var Promise = require('bluebird');
var _ = require('underscore');
var EventEmitter = require('events').EventEmitter;
var models = require('./models');
var Bookshelf = models.Bookshelf;
var config = require('config');
var mailer = require('./mailer');
var events = require('./events');
var time = require('./time');
var slack = require('./slack');
var cluster = require('cluster');
var workers = require('./workers');
var moment = require('moment-timezone');
var notifications = require('./notifications');
var Notifications = new notifications.Notifications();
var managingPermissionLevel = require('../controllers/variables').managingLocationMember;

var connections = require('./connections');

function App() {
    EventEmitter.call(this);

    this.config = config;
    this.models = models;
    this.ready = false;
    if (config.has('rabbit.url')) {
        this.connections = connections.topology(config.get('rabbit.url'));
        this.connections.once('ready', this.onConnected.bind(this));
        this.connections.once('lost', this.onLost.bind(this));
        this.connections.once('fail', this.onFail.bind(this));
    } else {
        console.log("RabbitMQ not configured, will not use a message broker for emails/notifications, set CLOUDAMQP_URL");
        this.onReady();
    }
}

function pushNotificationsExpiresIn(now) {
    return now + 100000;
}

App.prototype = Object.create(EventEmitter.prototype);
_.extend(App.prototype, events);
_.bindAll.apply(this, _.flatten([App.prototype, Object.keys(events)]));

App.prototype.pushNotificationsExpiresIn = pushNotificationsExpiresIn;

App.prototype.getUserSettings = function getUserSettings(user_ids, next) {
    if (!user_ids instanceof Array) {
        user_ids = [user_ids];
    }

    return models.User.query(function (q) {
        q.select()
            .from('users')
            .whereIn('users.id', user_ids);
    })
        .fetchAll({
            withRelated: [
                'usersetting',
                'pushTokens'
            ]
        })
        .tap(next);
};

App.prototype.forEachUserSetting = function forEachUserSetting(user_ids, each) {
    return this.getUserSettings(user_ids, function forEachUserSettingGetPermissions(permissions) {
        if (permissions) {
            permissions.forEach(each);
        }
    });
};

App.prototype.getUserSettingsAndSubs = function getUserSettingsAndSubs(user_ids, next) {
    if (!user_ids instanceof Array) {
        user_ids = [user_ids];
    }

    return models.User.query(function (q) {
        q.select()
            .from('users')
            .whereIn('users.id', user_ids);
    })
        .fetchAll({
            withRelated: [
                'usersetting',
                'subscriptions',
                'pushTokens'
            ]
        })
        .tap(next);
};

App.prototype.forEachUserSettingAndSubs = function forEachUserSettingsAndSubs(user_ids, each) {
    return this.getUserSettingsAndSubs(user_ids, function forEachUserSettingAndSubsGetPermissions(permissions) {
        if (permissions) {
            console.log(permissions);
            permissions.forEach(each);
        }
    });
};

const sendToUsersDefaultOrdering = ['push', 'email', 'text'];

App.prototype.sendToUsers = function sendToUsers(user_ids, messages, args, test) {
    var hasLocationId = args.hasOwnProperty('location_id');
    var self = this;
    if (!args.order) {
        args.order = sendToUsersDefaultOrdering;
    }
    if (args.limit === undefined || args.limit === null) {
        args.limit = args.order.length;
    }
    if (hasLocationId) {
        return this.forEachUserSettingAndSubs(user_ids, sendToUsersForEach);
    } else {
        return this.forEachUserSetting(user_ids, sendToUsersForEach);
    }

    function sendToUsersForEach(user) {
        user = user.toJSON();
        if (test === undefined || test(user)) {
            var usersetting = user.usersetting;
            if (usersetting.pushnotifications ||
                usersetting.textnotifications ||
                usersetting.emailnotifications) {
                if (hasLocationId) {
                    var subscriptions = user.subscriptions;
                    for (var i = 0; i < subscriptions.length; i++) {
                        var subscription = subscriptions[i];
                        if (subscription.location_id == args.location_id) {
                            if (!subscription.subscribed) {
                                return;
                            }
                        }
                    }
                }

                args.username = user.username;
                args.firstname = user.firstname;
                args.lastname = user.lastname;

                if (args.force) {
                    args.pushForce = true;
                    args.emailForce = true;
                    // args.textForce = true;
                }

                var successfulNotifications = 0;

                var actions = {
                    push: function sendToUsersActionPush() {
                        if (args.pushForce || (usersetting.pushnotifications && messages['push'])) {
                            var pushtokens = user.pushTokens;
                            var now = time.nowInUtc();
                            var serviceTokens = {};
                            var expired = false;
                            var foundPushToken = false;
                            _.each(pushtokens, function (pushtoken) {
                                if (pushtoken.expires <= now) {
                                    expired = true;
                                } else {
                                    if (!serviceTokens.hasOwnProperty(pushtoken.platform)) {
                                        serviceTokens[pushtoken.platform] = [];
                                    }

                                    serviceTokens[pushtoken.platform].push(pushtoken.token);
                                    foundPushToken = true;
                                }
                            });

                            if (foundPushToken) {
                                var message = messages.push(args);
                                _.each(serviceTokens, function (tokens, service) {
                                    self.sendNotification(service, tokens, pushNotificationsExpiresIn(now), message);
                                });
                                successfulNotifications++;
                            }
                        }

                    },
                    email: function sendToUsersActionEmail() {
                        if (args.emailForce || (usersetting.emailnotifications && messages['email']) ) {
                            var email = messages.email;
                            var subject = email.subject(args);
                            var text = email.text(args);
                            var html = email.html(args);
                            var from = email.from;
                            if (!from && args.from) {
                                from = args.from;
                            }
                            var to = user.email;
                            console.log("Sending email.....");
                            self.sendEmail(from, to, subject, text, html);
                            successfulNotifications++;
                        }
                    },
                    text: function sendToUsersActionText() {
                        // TODO: TEXT MESSAGE
                    }
                };

                for (var orderIndex = 0; orderIndex < args.order.length && successfulNotifications < args.limit; orderIndex++) {
                    var orderKey = args.order[orderIndex];
                    if (actions.hasOwnProperty(orderKey)) {
                        actions[orderKey]();
                    }
                }
            } else {
                // this user has disabled all notifications
                console.log("User has all notifications disabled");
            }
        }
    }
};

App.prototype.onConnected = function() {
    this.onReady();
};

App.prototype.onReady = function() {
    //logger.log({ type: 'info', msg: 'app.ready' });
    this.ready = true;
    this.emit('ready');
};

App.prototype.onLost = function() {
    //logger.log({ type: 'info', msg: 'app.lost' });
    this.emit('lost');
};

App.prototype.onFail = function(err) {
    console.log('Failed to connect to RabbitMQ\n' + JSON.stringify(err));
    slack.error('Failed to connect to RabbitMQ', err);
    // TODO: ERROR HANDLING HERE?
};

App.prototype.init = function() {
    this.startHandlingEmails();
    this.startHandlingNotifications();
    this.startHandlingNewShifts();
    this.startHandlingNewShiftApplications();
};

App.prototype.startHandlingEmails = function() {
    if (mailer) {
        var started = "Started handling emails from RabbitMQ";
        console.log(started);
        slack.info(started);
        connections.handle(connections.EMAIL_QUEUE, this.handleEmailJob.bind(this));
    } else {
        slack.alert("Email is not configured so not going to consume email events from RabbitMQ");
    }
    return this;
};

App.prototype.startHandlingNotifications = function() {
    var started = "Started handling notifications from RabbitMQ";
    console.log(started);
    slack.info(started);
    connections.handle(connections.NOTIFICATION_QUEUE, this.handleNotificationJob.bind(this));
};

App.prototype.startHandlingNewShifts = function() {
    var started = "Started handling new shifts from RabbitMQ";
    console.log(started);
    slack.info(started);
    connections.handle(connections.NEW_SHIFT_QUEUE, this.handleNewShiftJob.bind(this));
};

App.prototype.startHandlingNewShiftApplications = function() {
    var started = "Started handling new shift applications from RabbitMQ";
    console.log(started);
    slack.info(started);
    connections.handle(connections.NEW_SHIFT_APPLICATION_QUEUE, this.handleNewShiftApplication.bind(this));
    connections.handle(connections.NEW_DELAYED_SHIFT_APPLICATION_QUEUE, this.handleNewDelayedShiftApplication.bind(this));
};

App.prototype.createTokenUrl = function(base, token) {
    var url = 'http://localhost';
    if (config.has('web.url')) {
        url = config.get('web.url');
    } else {
        console.log("NOTICE: WEB_URL env variable is not set to server address, verification emails will be sent with " + url);
    }

    return url + base + "?token=" + token;
};

App.prototype.fireEvent = function fireEvent(event, user_id, args) {
    if (!args) {
        args = {};
    }
    try {
        return this[event](user_id, args);
    } catch (err) {
        slack.error({
            body: {
                event: event,
                args: args
            },
            user: {
                id: user_id
            }
        }, 'Error firing event: ' + event, err);
        console.error(err.stack);
    }
};

App.prototype.notifyGroupPromoted = function(user_id, inviter_user, group_id) {
    // TODO:
    console.log("PROMOTEDD");
};

App.prototype.sendInviteEmail = function(token, to, inviter_user, message) {
    var inviteUrl = this.createTokenUrl("/acceptinvitation", token);
    this.sendEmail('thamer@proxyshift.com', to, 'Company invitation', inviteUrl + ' ' + message, '<a href="' + inviteUrl + '">' + inviteUrl + '</a>' + message)
};

App.prototype.sendNotification = function sendNotification(service, endpoints, expires, message) {
    var notification = {
        service: service,
        endpoints: endpoints,
        expires: expires,
        message: message
    };

    if (this.connections !== null && this.connections !== undefined) {
        console.log("RabbitMQ not configured, sending push notification in web process");
        this.handleNotificationJob(forgeRabbitMessage(notification));
    } else {
        console.log("Sending push notification to queue...");

        connections.publish(connections.JOB_EXCHANGE, {
            routingKey: connections.NOTIFICATION_KEY,
            type: connections.NOTIFICATION_QUEUE,
            body: notification
        });
    }
};

App.prototype.handleNotificationJob = function handleNotificationJob(job) {
    console.log("GOT NOTIFICATION JOB");
    var body = job.body;

    Notifications.send(body.service, body.endpoints, body.expires, body.message);
    job.ack();
};

App.prototype.sendEmail = function(from, to, subject, text, html) {
    if (to === null || to === undefined) {
        throw new Error("Email recipient required (not specified)");
    }
    var email = {
        from: from,
        to: to,
        subject: subject,
        text: text,
        html: html
    };

    if (!this.connections) {
        console.log("RabbitMQ not configured, sending email now in web process");
        this.handleEmailJob(forgeRabbitMessage(email));
    } else {
        console.log("Sending email to queue...");
        console.log(email);

        connections.publish(connections.JOB_EXCHANGE, {
            routingKey: connections.EMAIL_KEY,
            type: connections.EMAIL_QUEUE,
            body: email
        });
    }
};

App.prototype.handleEmailJob = function(job) {
    console.log("GOT EMAIL JOB");
    var body = job.body;
    // setup
    if (body.to.endsWith("@example.com")) {
        console.log("Not sending email to " + body.to + " as it is example.com (FIXTURE DATA)");
        job.ack();
    } else {
        if (mailer) {
            mailer.sendMail(body, function sendMailCallback(error, info) {
                job.ack();
                if (error) {
                    console.log("error");
                    console.log(error);
                    slack.alert("Failed to send email to: " + body.to, error);
                } else {
                    console.log("Mail successfully sent: " + info.response);
                    slack.info("Sent mail to: " + body.to, '#email');
                }
            });
        } else {
            // not setup
            console.log("Cannot send email as email is not configured properly");
            slack.alert("Email not configured, will not consume from RabbitMQ");
            // not ack()ing here will cause us to block and not fetch next items in the queue
            // which should be the intended so that we do not consume all emails
        }
    }
};

App.prototype.sendNewShifts = function sendNewShifts(user_id, shift_ids) {
    if (!(shift_ids instanceof Array)) {
        // unknown format, discard
        slack.alert('Unknown sendNewShifts argument: ' + JSON.stringify(shift_ids));
    } else {
        var new_shifts = {
            user_id: user_id,
            shift_ids: shift_ids
        };

        if (!this.connections) {
            console.log("RabbitMQ not configured, processing new shifts in web process");
            this.handleNewShiftJob(forgeRabbitMessage(new_shifts));
        } else {
            connections.publish(connections.JOB_EXCHANGE, {
                routingKey: connections.NEW_SHIFT_KEY,
                type: connections.NEW_SHIFT_QUEUE,
                body: new_shifts
            });
        }
    }
};

App.prototype.sendNewShiftApplication = function sendNewShiftApplication(shift_id, shift_application_id) {
    var shift_application = {
        id: shift_application_id,
        shift_id: shift_id,
        sleep: 10 * 1000
    };

    if (!this.connections) {
        console.log("RabbitMQ not configured, processing new shift application INSTANTLY in web process");
        this.handleNewShiftApplication(forgeRabbitMessage(shift_application));
    } else {
        console.log("sending new shift application to delayed job exchange....");
        connections.publish(connections.DELAYED_JOB_EXCHANGE, {
            routingKey: connections.NEW_DELAYED_SHIFT_APPLICATION_KEY,
            type: connections.NEW_DELAYED_SHIFT_APPLICATION_QUEUE,
            body: shift_application
        });
    }
};

const newShiftApplicationProperties = [
    'start',
    'end',
    'timezone',
    'location_name',
    'sublocation_name',
    'location_id',
    'groupuserclass_title'
];

App.prototype.handleNewShiftApplication = function handleNewShiftApplication(job) {
    console.log("GOT NEW SHIFT APPLICATION");
    var body = job.body;
    var self = this;
    console.log(job);
    var shift_id = body.shift_id;
    var shift_application_id = body.shfit_application_id;

    return Bookshelf.transaction(function(t) {
        return models.ShiftApplication.query(function(q) {
            q.select(
                Bookshelf.knex.raw(
                    'shiftapplications.date as date, ' +
                    'shiftapplications.recindeddate as recindeddate, ' +
                    'shiftapplications.user_id as user_id, ' +
                    'shifts.start as start, ' +
                    'shifts.canceled as canceled, ' +
                    'shifts.end as end, ' +
                    'timezones.name as timezone, ' +
                    'locations.address as location_name, ' +
                    'sublocations.title as sublocation_name, ' +
                    'COALESCE(shifts.notify) >= shiftapplications.date as notified, ' +
                    'COALESCE(shifts.location_id, locations.id) as location_id, ' +
                    'groupuserclasses.title as groupuserclass_title, ' +
                    'shifts.notify as notify'
                )
            )
                .from('shiftapplications')
                .leftJoin('shiftapplicationacceptdeclinereasons', function() {
                    this.on('shiftapplicationacceptdeclinereasons.shiftapplication_id', '=', 'shiftapplications.id');
                })
                .innerJoin('shifts', function() {
                    this.on('shifts.id', '=', 'shiftapplications.shift_id');
                })
                .innerJoin('groupuserclasses', function() {
                    this.on('groupuserclasses.id', '=', 'shifts.groupuserclass_id');
                })
                .leftJoin('timezones', function() {
                    this.on('timezones.id', '=', 'shifts.timezone_id');
                })
                .leftJoin('sublocations', function() {
                    this.on('sublocations.id', '=', 'shifts.sublocation_id');
                })
                .innerJoin('locations', function() {
                    this.on('locations.id', '=', 'shifts.location_id')
                        .orOn('locations.id', '=', 'sublocations.location_id');
                })
                .leftJoin('shiftrescissionreasons', function() {
                    this.on('shiftrescissionreasons.shiftapplication_id', '=', 'shiftapplications.id');
                })
                .innerJoin('users', function() {
                    this.on('users.id', '=', 'shiftapplications.user_id');
                })
                .where('shiftapplications.shift_id', '=', shift_id)
                .whereNull('shiftapplicationacceptdeclinereasons.accept')
                .whereNull('shiftrescissionreasons.id')
                .andWhere(function() {
                    this.whereNull('shifts.canceled')
                        .orWhere('shifts.canceled', '<>', true)
                        .orWhere('shifts.canceled', '<>', 1);
                })
                .andWhere(function() {
                    this.whereNull('shiftapplications.recinded')
                        .orWhere('shiftapplications.recinded', '<>', true)
                        .orWhere('shiftapplications.recinded', '<>', 1);
                });
        })
            .fetchAll({
                transacting: t
            })
            .tap(function fetchHandleNewShiftApplications(shiftapplications) {
                if (shiftapplications) {
                    var remainingInformation = _.clone(newShiftApplicationProperties);
                    var shiftApplicationProperties = {};
                    var uniqueUserIds = {};
                    var remainingNotification = false;
                    shiftapplications.each(function(shiftapplication) {
                        var user_id = shiftapplication.get('user_id');
                        uniqueUserIds[user_id] = true;
                        if (remainingInformation.length > 0) {
                            var foundKeys = [];
                            _.each(remainingInformation, function(key) {
                                var value = shiftapplication.get(key);
                                if (value) {
                                    shiftApplicationProperties[key] = value;
                                    foundKeys.push(key);
                                }
                            });
                            remainingInformation = _.difference(remainingInformation, foundKeys);
                        }
                        if (!remainingNotification) {
                            var notified = shiftapplication.get('notified');
                            if (notified !== 1 && notified !== true) {
                                remainingNotification = true;
                            }
                        }
                    });
                    var shiftApplicationCount = Object.keys(uniqueUserIds).length;
                    if (shiftApplicationCount == 0 || !remainingNotification) {
                        // nothing to do, application was 'undone'
                        // or, a notification was already sent for all these applications
                    } else {
                        // figure out who we need to send notifications to
                        return models.Shift.query(function(q) {
                            q.select([
                                'usergroups.user_id as user_id'
                            ])
                                .from('shifts')
                                .leftJoin('sublocations', function() {
                                    this.on('sublocations.id', '=', 'shifts.sublocation_id');
                                })
                                .innerJoin('managingclassesatlocations', function() {
                                    this.on('managingclassesatlocations.groupuserclass_id', '=', 'shifts.groupuserclass_id');
                                })
                                .innerJoin('usergroups', function() {
                                    this.on('usergroups.id', '=', 'managingclassesatlocations.usergroup_id');
                                })
                                .innerJoin('grouppermissions', function() {
                                    this.on('grouppermissions.id', '=', 'usergroups.grouppermission_id');
                                })
                                .innerJoin('userpermissions', function() {
                                    this.on('userpermissions.location_id', '=', 'shifts.location_id')
                                        .orOn('userpermissions.location_id', '=', 'sublocations.location_id');
                                })
                                .where('shifts.id', '=', shift_id)
                                .andWhereRaw('COALESCE(shifts.location_id, sublocations.location_id) = managingclassesatlocations.location_id')
                                .andWhere('grouppermissions.permissionlevel', '>=', managingPermissionLevel);
                        })
                            .fetchAll({
                                transacting: t
                            })
                            .tap(function handleNewShiftApplicationsFetchManagers(managingUserIds) {
                                var managingUserIdsMinusAppliedUserIds = {};
                                managingUserIds.each(function(managingUserId) {
                                    var managing_user_id = managingUserId.get('user_id');
                                    /*
                                    // don't send notifications for a shift to someone eligible to manage it, if they have applied
                                    // (this isn't a requirement)
                                    if (!uniqueUserIds.hasOwnProperty(managing_user_id)) {
                                        managingUserIdsMinusAppliedUserIds.push(managing_user_id);
                                    }
                                    */
                                    managingUserIdsMinusAppliedUserIds[managing_user_id] = true;
                                });
                                var uniqueManagingUserIds = Object.keys(managingUserIdsMinusAppliedUserIds);
                                if (uniqueManagingUserIds.length > 0) {
                                    return models.Shift.query(function(q) {
                                        q.select()
                                            .from('shifts')
                                            .where('shifts.id', '=', shift_id)
                                            .update({
                                                notify: time.nowInUtc()
                                            });
                                    })
                                        .fetch({
                                            transacting: t
                                        })
                                        .tap(function() {
                                            self.sendToUsers(
                                                uniqueManagingUserIds,
                                                self.newShiftApplication(
                                                    shiftApplicationProperties.location_name,
                                                    shiftApplicationProperties.sublocation_name,
                                                    shiftApplicationProperties.start,
                                                    shiftApplicationProperties.end,
                                                    shiftApplicationProperties.timezone,
                                                    shiftApplicationProperties.groupuserclass_title
                                                ), {
                                                    location_id: shiftApplicationProperties.location_id
                                                }
                                            );
                                            // success
                                            job.ack();
                                        })
                                        .catch(function(err) {
                                            console.log(err);
                                            slack.error(null, 'Error sending new shift application notification: Updating notify time', err);
                                            job.nack();
                                        });
                                } else {
                                    // nothing to do
                                    job.ack();
                                }
                            });
                    }
                }
                // fall through, nothing to do
                job.ack();
            })
            .catch(function(err) {
                console.log(err.stack);
                slack.error(null, 'Error sending new shift application notifications', err);
                job.nack();
            });
    });
};

App.prototype.handleNewDelayedShiftApplication = function handleNewDelayedShiftApplication(job) {
    var body = job.body;
    var sleep = 10 * 1000; // 10 seconds
    if (body.sleep) {
        sleep = body.sleep;
    }
    var self = this;
    setTimeout(function() {
        self.handleNewShiftApplication(job);
    }, sleep);
};

App.prototype.handleNewShiftJob = function handleNewShiftJob(job) {
    console.log("GOT NEW SHIFT JOB");
    var body = job.body;

    var user_id = body.user_id;
    var shift_ids = body.shift_ids;
    this.sendNotificationsAboutNewShifts(user_id, shift_ids, job.ack, job.reject);
};

App.prototype.sendNotificationsAboutNewShifts = function sendNotificationsAboutNewShifts(user_id, shift_ids, success, error) {
    if (!(shift_ids instanceof Array)) {
        // unknown format, discard
        slack.alert('Unknown shiftsCreated argument: ' + JSON.stringify(shift_ids));
        return;
    }

    var self = this;

    return models.Shift.query(function(q) {
        q.select([
            'usersettings.pushnotifications as pushOk',
            'usersettings.textnotifications as textOk',
            'usersettings.emailnotifications as emailOk',
            'shifts.title as title',
            'shifts.start as start',
            'shifts.end as end',
            'shifts.location_id as location_id',
            'sublocations.location_id as sublocation_location_id',
            'locations.address as location_name',
            'timezones.name as timezone',
            'sublocations.title as sublocation_name',
            'users.id as user_id',
            'users.username as username',
            'users.email as email',
            'users.phonemobile as text',
            'userpermissions.user_id as user_id',
            'pushtokens.token as pushtoken',
            'pushtokens.platform as service'
        ])
            .from('shifts')
            .innerJoin('groupuserclasses', function() {
                this.on('groupuserclasses.id', '=', 'shifts.groupuserclass_id')
                    .andOn('groupuserclasses.id', '=', 'shifts.groupuserclass_id');
            })
            .innerJoin('groupuserclasstousers', function() {
                this.on('groupuserclasstousers.groupuserclass_id', '=', 'groupuserclasses.id');
            })
            .innerJoin('users', function() {
                this.on('users.id', '=', 'groupuserclasstousers.user_id');
            })
            .leftJoin('sublocations', function() {
                this.on('sublocations.id', '=', 'shifts.sublocation_id');
            })
            .leftJoin('locations', function() {
                this.on('locations.id', '=', 'sublocations.location_id')
                    .orOn('locations.id', '=', 'shifts.location_id');
            })
            .leftJoin('timezones', function() {
                this.on('timezones.id', '=', 'locations.timezone_id');
            })
            .leftJoin('userpermissions', function() {
                this.on('userpermissions.user_id', '=', 'groupuserclasstousers.user_id')
                    .andOn('userpermissions.user_id', '=', 'users.id');
                //.andOn('userpermissions.subscribed', '!=', false); // TODO: FIX THIS, ADD IT BACK IT CRASHED IN HEROKU
            })
            // get user settings
            .innerJoin('usersettings', function() {
                this.on('usersettings.id', '=', 'users.usersetting_id');
            })
            .leftJoin('tokens', function() {
                this.on('tokens.user_id', '=', 'users.id')
            })
            .leftJoin('pushtokens', function() {
                this.on('pushtokens.token_id', '=', 'tokens.id')
                    .andOn('pushtokens.expires', '<', time.nowInUtc())
            })
            .whereIn('shifts.id', shift_ids)
            .andWhere(function() {
                this.whereRaw('sublocations.location_id = userpermissions.location_id')
                    .orWhereRaw('shifts.location_id = userpermissions.location_id');
            })
            .orderBy('pushtokens.platform');
    })
        .fetchAll()
        .tap(function(interestedUsers) {
            var user_ids = {};
            var location_id;
            var location_name;
            var sublocation_name;
            var timezone;
            var start;
            var end;
            interestedUsers.each(function(interestedUser) {
                // the same user_id can show up multiple times if the user has more than one login token
                // we prefer to send push notifications
                // if that is not possible we will send an email and a text message?
                var user_id = interestedUser.get('user_id');
                var pushOk = interestedUser.get('pushOk');
                var textOk = interestedUser.get('textOk');
                var emailOk = interestedUser.get('emailOk');
                if (interestedUser.get('location_id')) {
                    location_id = interestedUser.get('location_id');
                }
                if (interestedUser.get('sublocation_location_id')) {
                    location_id = interestedUser.get('sublocation_location_id');
                }
                if (interestedUser.get('location_name')) {
                    location_name = interestedUser.get('location_name');
                }
                if (interestedUser.get('sublocation_name')) {
                    sublocation_name = interestedUser.get('sublocation_name');
                }
                if (interestedUser.get('start')) {
                    start = interestedUser.get('start');
                }
                if (interestedUser.get('end')) {
                    end = interestedUser.get('end');
                }
                if (interestedUser.get('timezone')) {
                    timezone = interestedUser.get('timezone');
                }
                if (pushOk || textOk || emailOk) {
                    user_ids[user_id] = true;
                } else {
                    // user wants to be in the dark, which is ok
                }
            });
            var args = {
                limit: 1 // limit to only sending one notification method (the first that works)
            };
            if (location_id) {
                args.location_id = location_id;
            }
            if (location_name) {
                args.location_name = location_name;
            }
            if (sublocation_name) {
                args.sublocation_name = sublocation_name;
            }

            if (start && moment(time.unknownTimeFormatToDate(start, timezone)) > moment()) {
                self.sendToUsers(Object.keys(user_ids), self.newShift(location_name, sublocation_name, start, end, timezone), args);
            } else {
                // never send a notification for a shift created in the past
            }

            if (success) {
                success();
            }
        })
        .catch(function(err) {
            slack.error(undefined, 'Error notifying about new shift', err);
            console.log(err.stack);
            if (error) {
                error(err);
            }
        });
};

function noop() {
    console.log("NOOOOOOOOOOPPPP");
}

function forgeRabbitMessage(body) {
    return {
        body: body,
        ack: noop,
        nack: noop,
        reject: noop,
        reply: noop
    }
}

module.exports = new App();
