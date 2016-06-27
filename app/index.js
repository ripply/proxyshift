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

App.prototype.getUserSettings = function getUserSettings(user_ids, next, error) {
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
        .tap(next)
        .catch(function (err) {
            slack.error(undefined, 'Error getting user settings', err);
            if (error) {
                return error(err);0
            }
        });
};

App.prototype.forEachUserSetting = function forEachUserSetting(user_ids, each, error) {
    return this.getUserSettings(user_ids, function forEachUserSettingGetPermissions(permissions) {
        if (permissions) {
            permissions.forEach(each);
        }
    }, function(err) {
        if (error) {
            error(err);
        }
    });
};

App.prototype.getUserSettingsAndSubs = function getUserSettingsAndSubs(user_ids, next, error) {
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
        .tap(next)
        .catch(function(err) {
            slack.error(undefined, 'Error getting user settings and subs', err);
            if (error) {
                return error(err);
            }
        });
};

App.prototype.forEachUserSettingAndSubs = function forEachUserSettingsAndSubs(user_ids, each, error) {
    return this.getUserSettingsAndSubs(user_ids, function forEachUserSettingAndSubsGetPermissions(permissions) {
        if (permissions) {
            console.log(permissions);
            permissions.forEach(each);
        }
    }, function(err) {
        if (error) {
            error(err);
        }
    });
};

const sendToUsersDefaultOrdering = ['push', 'email', 'text'];

App.prototype.sendToUsers = function sendToUsers(user_ids, messages, args, test, error) {
    if (user_ids && user_ids.length == 0) {
        // nothing to do
        return;
    }

    var hasLocationId = args.hasOwnProperty('location_id');
    var self = this;
    if (!args.order) {
        args.order = sendToUsersDefaultOrdering;
    }
    if (args.limit === undefined || args.limit === null) {
        args.limit = args.order.length;
    }
    if (hasLocationId) {
        return this.forEachUserSettingAndSubs(user_ids, sendToUsersForEach, error);
    } else {
        return this.forEachUserSetting(user_ids, sendToUsersForEach, error);
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
    slack.error(undefined, 'Failed to connect to RabbitMQ', err);
    // TODO: ERROR HANDLING HERE?
};

App.prototype.init = function() {
    this.startHandlingEmails();
    this.startHandlingNotifications();
    this.startHandlingNewShifts();
    this.startHandlingNewShiftApplications();
    this.startHandlingShiftApplicationApprovalDenials();
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

App.prototype.startHandlingShiftApplicationApprovalDenials = function() {
    var started = "Started handling shift application approval denials from RabbitMQ";
    console.log(started);
    slack.info(started);
    connections.handle(connections.SHIFT_APPLICATION_APPROVED_DENIED_QUEUE, this.handleShiftApplicationApprovalDenial.bind(this));
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

try {
    'ECMCA6'.endsWith('test');
} catch (e) {
    String.prototype.endsWith = function(suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };
}

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

App.prototype.sendShiftApplicationApprovalDenial = function sendShiftApplicationApprovalDenial(
    shift_id,
    shiftapplicationacceptdeclinereason_id,
    approved
) {
    var approvalDenial = {
        shift_id: shift_id,
        shiftapplicationacceptdeclinereason_id: shiftapplicationacceptdeclinereason_id,
        approved: approved
    };

    if (!this.connections) {
        console.log("RabbitMQ not configured, processing shift application approval denial in web process");
        this.handleShiftApplicationApprovalDenial(forgeRabbitMessage(approvalDenial));
    } else {
        console.log("sending shift application approval denial to queue");
        connections.publish(connections.JOB_EXCHANGE, {
            routingKey: connections.SHIFT_APPLICATION_APPROVED_DENIED_KEY,
            type: connections.SHIFT_APPLICATION_APPROVED_DENIED_QUEUE,
            body: approvalDenial
        });
    }
};

App.prototype.handleShiftApplicationApprovalDenial = function handleShiftApplicationApprovalDenial(job) {
    console.log("GOT SHIFT APPLICATION APPROVAL DENIAL JOB");
    var body = job.body;
    // setup
    this.shiftApplicationApprovedOrDenied(
        body.shift_id,
        body.shiftapplicationacceptdeclinereason_id,
        body.approved
    )
        .then(function() {
            job.ack();
        })
        .catch(function(err) {
            job.nack();
            slack.error(undefined, 'Failed to handle shift application approval denial job\n' + JSON.stringify(job), err);
        });
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

App.prototype.shiftApplicationApprovedOrDenied = function shiftApplicationApprovedOrDenied(
    shift_id,
    shiftapplicationacceptdeclinereason_id,
    approved
) {
    var self = this;

    return models.ShiftApplication.query(function(q) {
        q.select([
            'shiftapplicationacceptdeclinereasons.date as approved_denied_date',
            'shiftapplicationacceptdeclinereasons.id as approved_denied_id',
            'shiftapplicationacceptdeclinereasons.reason as shit_deny_reason',
            'shiftapplicationacceptdeclinereasons.accept as shift_accepted',
            'shiftapplications.id as shiftapplication_id',
            'shifts.id as shift_id',
            'shifts.title as shift_title',
            'shifts.description as shift_description',
            'shifts.start as shift_start',
            'shifts.end as shift_end',
            'shifts.canceled as shift_canceled',
            'timezones.name as timezone',
            'locations.title as location_title',
            'sublocations.title as sublocation_title',
            'sublocations.description as sublocation_description',
            'approver.username as approver_username',
            'approver.firstname as approver_firstname',
            'approver.lastname as approver_lastname',
            'shiftapplications.user_id as applicant_userid',
            'shiftapplications.recinded as recinded',
            'applicant.username as applicant_username',
            'applicant.firstname as applicant_firstname',
            'applicant.lastname as applicant_lastname',
            'groupuserclasses.title as groupuserclass_title',
            'groupuserclasses.description as groupuserclass_description'
        ])
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
            .innerJoin('users as approver', function() {
                this.on('approver.id', '=', 'shiftapplicationacceptdeclinereasons.user_id');
            })
            .innerJoin('users as applicant', function() {
                this.on('applicant.id', '=', 'shiftapplications.user_id');
            })
            .orderBy('shiftapplicationacceptdeclinereasons.date', 'desc'); // desc so that always compares against latest one
            //.where('shiftapplicationacceptdeclinereasons.id', '=', shiftapplicationacceptdeclinereason_id)
    })
        .fetch()
        .tap(function shiftApplicationApprovedOrDeniedSuccess(approvalOrDenials) {
            if (approvalOrDenials) {
                var approved;
                var denied = {};
                var neitherApprovedOrDenied = {};
                var data;
                var alreadyAccepted = false;
                var approvalOrDenialsJson = approvalOrDenials.toJSON();
                _.each(approvalOrDenialsJson, function shiftApplicationApprovedOrDeniedForEach(approvalOrDenial) {
                    if (data === undefined &&
                        // this is the approval/denial that was just done
                        // grab data from it for sending personalized message to user
                        approvalOrDenial.approved_denied_id == shiftapplicationacceptdeclinereason_id
                    ) {
                        data = approvalOrDenial.toJSON();
                    }
                    if (approvalOrDenial.approved_denied_id != shiftapplicationacceptdeclinereason_id &&
                        approvalOrDenial.recinded &&
                        approvalOrDenial.shift_accepted) {
                        // there was a previous accepted shift that was recinded
                        // this means that all users that were declined or not approved
                        // were already sent notifications saying they were denied
                        // so we do not need to re-send notifications letting them know
                        // that they were once again, not chosen
                        alreadyAccepted = true;
                    } else if (
                        approvalOrDenial.shift_accepted &&
                        approvalOrDenial.id != shiftapplicationacceptdeclinereason_id) {
                        alreadyAccepted = true;
                    }
                    if (approvalOrDenial.shift_accepted) {
                        // approved
                        approved = approvalOrDenial.toJSON();
                    } else if (approvalOrDenial.shift_accepted == false) {
                        // denied
                        denied[approvalOrDenial.applicant_userid] = approvalOrDenial;
                    } else {
                        // neither
                        neitherApprovedOrDenied[approvalOrDenial.applicant_userid] = approvalOrDenial
                    }
                });

                if (approved) {
                    // this shift was approved
                    // notify them they were approved!
                    self.sendToUsers(
                        data.applicant_userid,
                        self.acceptOrDeniedShiftApplication(data),
                        data
                    );
                    if (!alreadyAccepted) {
                        // and everyone else that they didn't get chosen, unless they were already denied
                        // in which case, they should have already had a notification sent to them
                        var neither_user_ids = Object.keys(neitherApprovedOrDenied);
                        if (neither_user_ids.length > 0) {
                            self.sendToUsers(
                                neither_user_ids,
                                self.newShiftApplicationApprovedToDeniedUsers(
                                    data.location_title,
                                    data.sublocation_title,
                                    data.shift_start,
                                    data.shift_end,
                                    data.timezone,
                                    data.shift_id
                                ),
                                data
                            );
                        }
                    } else {
                        // people were already approved, so, were already sent a notification regarding this to everyone
                    }
                } else {
                    // denied, only notify this applicant
                    // send the applicant a push notification as well as an email
                    self.sendToUsers(
                        data.applicant_userid,
                        self.acceptOrDeniedShiftApplication(data),
                        data
                    );
                }
            } else {
                // do nothing? it doesn't exist
            }
        });
};

App.prototype.handleNewShiftApplication = function handleNewShiftApplication(job) {
    console.log("GOT NEW SHIFT APPLICATION");
    var body = job.body;
    var self = this;
    console.log(job);
    var shift_id = body.shift_id;
    var shiftapplication_id = body.shfit_application_id;

    return Bookshelf.transaction(function(t) {
        var sqlOptions = {
            transacting: t
        };
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
                    //'COALESCE(shifts.notify) >= shiftapplications.date as notified, ' +
                    'shifts.notify >= shiftapplications.date as notified, ' +
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
            .fetchAll(sqlOptions)
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
                        return getUsersManagingAShift(shift_id, false, sqlOptions)
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
                                        .fetch(sqlOptions)
                                        .tap(function() {
                                            var nacked = false;
                                            self.sendToUsers(
                                                uniqueManagingUserIds,
                                                self.newShiftApplication(
                                                    shiftApplicationProperties.location_name,
                                                    shiftApplicationProperties.sublocation_name,
                                                    shiftApplicationProperties.start,
                                                    shiftApplicationProperties.end,
                                                    shiftApplicationProperties.timezone,
                                                    shiftApplicationProperties.groupuserclass_title,
                                                    shift_id,
                                                    shiftapplication_id
                                                ), {
                                                    location_id: shiftApplicationProperties.location_id
                                                },
                                                undefined,
                                                function failedToSendNewShiftApplicationNotification(err) {
                                                    nacked = true;
                                                    job.nack();
                                                }
                                            );
                                            if (!nacked) {
                                                // success
                                                job.ack();
                                            }
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

App.prototype.sendNotificationAboutNotGettingShift =
    function sendNotificationAboutNotGettingShift(
        user_ids,
        shift_id,
        shift_location,
        shift_sublocation,
        shift_start,
        shift_end,
        timezone,
        success,
        error
    ) {
        var failed = false;
        this.sendToUsers(
            user_ids,
            this.newShiftApplicationApprovedToDeniedUsers(
                shift_location,
                shift_sublocation,
                shift_start,
                shift_end,
                timezone,
                shift_id
            ),
            {},
            undefined,
            function sendNotificationAboutNotGettingShiftError(err) {
                failed = true;
                if (error) {
                    return error(err);
                }
            }
        );
        if (!failed) {
            return success();
        }
    };

App.prototype.sendNotificationAboutAutoApprovedShift = function(
    user_id,
    shift_id,
    location_title,
    sublocation_title,
    shift_start,
    shift_end,
    timezone,
    success,
    error
) {
    return sendNotificationAboutApprovedShift.call(this,
        this.newShiftApplicationAutoApproved,
        this.newShiftApplicationAutoApprovedToManagers,
        user_id,
        shift_id,
        location_title,
        sublocation_title,
        shift_start,
        shift_end,
        timezone,
        success,
        error
    );
};

App.prototype.sendNotificationAboutApprovedShift = function(
    user_id,
    shift_id,
    location_title,
    sublocation_title,
    shift_start,
    shift_end,
    timezone,
    success,
    error
) {
    return sendNotificationAboutApprovedShift.call(this,
        this.newShiftApplicationApproved,
        this.newShiftApplicationApprovedToManagers,
        user_id,
        shift_id,
        location_title,
        sublocation_title,
        shift_start,
        shift_end,
        timezone,
        success,
        error
    );
};

function sendNotificationAboutApprovedShift(
    userMessage,
    managerMessage,
    user_id,
    shift_id,
    location_title,
    sublocation_title,
    shift_start,
    shift_end,
    timezone,
    success,
    error
) {
    //newShiftApplicationAutoApproved
    // the user_id should be the user who was auto approved for the shift
    // the shift_id is the shift they were approved for
    // an auto approved shift will only have one applicant
    // we need to send a notification to the user as well as managers
    var failedToSendToUsers = undefined;
    this.sendToUsers(
        user_id,
        userMessage(
            location_title,
            sublocation_title,
            shift_start,
            shift_end,
            timezone,
            shift_id
        ),
        {},
        undefined,
        function failedToSendApprovalNotificationToUser(err) {
            failedToSendToUsers = err;
            slack.error(undefined, 'Failed to send shift approval notification to user', err);
        }
    );

    if (failedToSendToUsers !== undefined) {
        return error(failedToSendToUsers);
    }

    var self = this;
    var sqlOptions = {};
    return getUsersManagingAShiftAndShiftInformation(
        [shift_id],
        sqlOptions,
        function gotManagersForANewShift(interestedManagers) {
            return models.User.query(function(q) {
                q.select([
                    'firstname',
                    'lastname'
                ])
                    .from('users')
                    .where('id', '=', user_id);
            })
                .fetch(sqlOptions)
                .tap(function createShiftApplicationGetUserInfo(user) {
                    var firstname = 'UNKNOWN';
                    var lastname;
                    if (user) {
                        firstname = user.get('firstname');
                        lastname = user.get('lastname');
                    }

                    _.each(interestedManagers.groupedShifts, function (groupedShift) {
                        if (!interestedManagers.shiftcreator_firstname ||
                            !interestedManagers.shiftcreator_firstname) {
                            interestedManagers.shiftcreator_firstname = 'UNKNOWN';
                            interestedManagers.shiftcreator_lastname = undefined;
                        }
                        self.sendToUsers(
                            interestedManagers.user_ids,
                            managerMessage(
                                interestedManagers.groupuserclass_title,
                                interestedManagers.location_name,
                                interestedManagers.sublocation_name,
                                groupedShift.start,
                                groupedShift.end,
                                Object.keys(groupedShift.ids).length,
                                interestedManagers.timezone,
                                interestedManagers.shift_ids,
                                interestedManagers.shiftcreator_firstname,
                                interestedManagers.shiftcreator_lastname,
                                firstname,
                                lastname
                            ),
                            interestedManagers.args,
                            undefined,
                            function failedToSendManagersNewShiftNotificationsAfterSendingUserNotification(err) {
                                slack.error(undefined, 'Failed to send new shift notifications to managers', err);
                                success = false;
                                return error(err);
                            }
                        );
                    });
                });
        },
        function failedToGetManagersForAutoApprovedShift(err) {
            if (error) {
                return error(err);
            }
        }
    );
}

App.prototype.sendNotificationsAboutApprovedShiftToOtherApplicants = function sendNotificationsAboutApprovedShiftToOtherApplicants(user_id, shift_id, success, error) {
    // send a notification to the user that they were approved
    // newShiftApplicationAutoApproved
    // send a notification to managers that it was approved
    // newShiftApplicationApprovedToManagers
};

App.prototype.sendNotificationsAboutNewShifts = function sendNotificationsAboutNewShifts(user_id, shift_ids, success, error) {
    if (!(shift_ids instanceof Array)) {
        // unknown format, discard
        slack.alert('Unknown shiftsCreated argument: ' + JSON.stringify(shift_ids));
        return;
    }

    var self = this;

    var sqlOptions = {};

    var sendToCreator = true;

    var now = time.now();

    return getUsersInterestedInAShift(shift_ids, sqlOptions, function gotUsersInterestedInAShift(interested) {
        if (interested.start === undefined || // no users interested in this shift, managers might be interested
            moment(time.unknownTimeFormatToDate(interested.start, interested.timezone)) > now) {
            return getUsersManagingAShiftAndShiftInformation(
                shift_ids,
                sqlOptions,
                function gotManagersForANewShift(interestedManagers) {
                    if ((interested.start == undefined && // if users are not interested in this shift AND
                        interestedManagers.start == undefined) || // managers are not interested in this shift
                            // OR, the shift occurred in the past
                        moment(time.unknownTimeFormatToDate(
                            interested.end === undefined ?
                                interestedManagers.end:
                                interested.end,
                            interested.end === undefined ?
                                interestedManagers.timezone:
                                interested.timezone)
                        ) < now) {
                        // than do not send notifications
                        if (success) {
                            return success();
                        }
                        return;
                    }

                    var requiresmanagerapproval = interested.start === undefined ?
                        interestedManagers.requiremanagerapproval : interested.requiremanagerapproval;

                    var user_ids_key = sendToCreator ? 'user_ids' : 'user_ids_minus_creator';

                    if (interested.notifiableUsersExist) {
                        // interested users exist that we can send notifications to
                        if (interestedManagers.notifiableUsersExist) {
                            // interested managers exist that we can send notifications to
                            // managers exist that can approve shift

                            // send user notifications
                            console.log(_.difference(interestedManagers.user_ids, interested[user_ids_key]));
                            var interestedUsersMinusManagersWithoutParameters = interestedManagers[user_ids_key].slice();
                            interestedUsersMinusManagersWithoutParameters.splice(0, 0, interested[user_ids_key]);
                            _.each(interested.groupedShifts, function (groupedShift) {
                                self.sendToUsers(
                                    // do not send this notification to managers who also happen to be interested in the shift
                                    // send them the management specific notification instead
                                    _.without.apply(this, interestedUsersMinusManagersWithoutParameters),
                                    self.newShift(
                                        interested.groupuserclass_title,
                                        interested.location_name,
                                        interested.sublocation_name,
                                        groupedShift.start,
                                        groupedShift.end,
                                        Object.keys(groupedShift.ids).length,
                                        interested.timezone,
                                        interested.shift_ids
                                    ),
                                    interested.args,
                                    undefined,
                                    function failedToSendUsersNewShiftNotifications(err) {
                                        slack.error(undefined, 'Failed to send new shift notifications to users', err);
                                        success = false;
                                        return error(err);
                                    }
                                );
                                // send managers notifications
                                self.sendToUsers(
                                    interestedManagers[user_ids_key],
                                    self.newShiftForManagers(
                                        interestedManagers.groupuserclass_title,
                                        interestedManagers.location_name,
                                        interestedManagers.sublocation_name,
                                        groupedShift.start,
                                        groupedShift.end,
                                        Object.keys(groupedShift.ids).length,
                                        interestedManagers.timezone,
                                        interestedManagers.shift_ids,
                                        interestedManagers.shiftcreator_firstname,
                                        interestedManagers.shiftcreator_lastname
                                    ),
                                    interestedManagers.args,
                                    undefined,
                                    function failedToSendManagersNewShiftNotificationsAfterSendingUserNotification(err) {
                                        slack.error(undefined, 'Failed to send new shift notifications to managers', err);
                                        success = false;
                                        return error(err);
                                    }
                                );
                            });
                        } else if (interestedManagers.unnotifiableUsersExist) {
                            // interested users exist that we can send notifications to
                            // but, no interested managers exist that we can notify, user does not need to know that
                            // managers that can approve the shift exist
                            _.each(interested.groupedShifts, function (groupedShift) {
                                self.sendToUsers(
                                    interested[user_ids_key],
                                    self.newShift(
                                        interested.groupuserclass_title,
                                        interested.location_name,
                                        interested.sublocation_name,
                                        groupedShift.start,
                                        groupedShift.end,
                                        Object.keys(groupedShift.ids).length,
                                        interested.timezone,
                                        interested.shift_ids
                                    ),
                                    interested.args,
                                    undefined,
                                    function failedToSendUsersNewShiftNotificationsNotSendingManagerNotification(err) {
                                        slack.error(undefined, 'Failed to send new shift notifications to users', err);
                                        success = false;
                                        return error(err);
                                    }
                                );
                            });
                        } else {
                            // interested users exist that we can send notifications to
                            // but, no managers even can approve this shift

                            // notify all users like normal
                            _.each(interested.groupedShifts, function (groupedShift) {
                                self.sendToUsers(
                                    interested[user_ids_key],
                                    self.newShift(
                                        interested.groupuserclass_title,
                                        interested.location_name,
                                        interested.sublocation_name,
                                        groupedShift.start,
                                        groupedShift.end,
                                        Object.keys(groupedShift.ids).length,
                                        interested.timezone,
                                        interested.shift_ids
                                    ),
                                    interested.args,
                                    undefined,
                                    function failedToSendUsersNewShiftNotificationsNotSendingManagerNotification(err) {
                                        slack.error(undefined, 'Failed to send new shift notifications to users', err);
                                        success = false;
                                        return error(err);
                                    }
                                );
                            });
                            // but also send the user that created the shift a notification
                            if (interested.shiftcreator_id) {
                                _.each(interested.groupedShifts, function (groupedShift) {
                                    self.sendToUsers(
                                        [interested.shiftcreator_id],
                                        self.newShiftButNoManagersCanApprove(
                                            interested.groupuserclass_title,
                                            interested.location_name,
                                            interested.sublocation_name,
                                            groupedShift.start,
                                            groupedShift.end,
                                            Object.keys(groupedShift.ids).length,
                                            interested.timezone,
                                            interested.shift_ids
                                        ),
                                        interested.args,
                                        undefined,
                                        function failedToSendUsersNewShiftNotificationsNotSendingManagerNotification(err) {
                                            slack.error(undefined, 'Failed to send new shift notifications to users', err);
                                            success = false;
                                            return error(err);
                                        }
                                    )
                                });
                            }
                        }
                    } else if (interested.unnotifiableUsersExist) {
                        // users exist that can apply for the shift
                        // but they have their notifications disabled
                        console.log('no interested users, but users exist that can apply for the shift');
                        if (interestedManagers.notifiableUsersExist) {
                            // users wont be notified, but they can apply for the shifts, managers will be notified

                            // users exist that can apply for shift, but will not receive notifications about the new shift
                            // managers exist that will receive notifications about the new shift
                            console.log('but, interested managers');
                            // newShiftNoInterestedUsersManagersInterestedToCreator
                            // send special notification to managers saying that this might not get filled

                            // but also send the user that created the shift a notification
                            if (interested.shiftcreator_id) {
                                _.each(interested.groupedShifts, function (groupedShift) {
                                    self.sendToUsers(
                                        [interested.shiftcreator_id],
                                        self.newShiftNoInterestedUsersManagersInterestedToCreator(
                                            interested.groupuserclass_title,
                                            interested.location_name,
                                            interested.sublocation_name,
                                            groupedShift.start,
                                            groupedShift.end,
                                            Object.keys(groupedShift.ids).length,
                                            interested.timezone,
                                            interested.shift_ids
                                        ),
                                        interested.args,
                                        undefined,
                                        function failedToSendUsersNewShiftNotificationsNotSendingManagerNotification(err) {
                                            slack.error(undefined, 'Failed to send new shift notifications to users', err);
                                            success = false;
                                            return error(err);
                                        }
                                    )
                                });
                            }
                            // send managers notifications
                            _.each(interestedManagers.groupedShifts, function (groupedShift) {
                                self.sendToUsers(
                                    interestedManagers[user_ids_key],
                                    self.newShiftNoInterestedUsersManagersInterestedToManager(
                                        interestedManagers.groupuserclass_title,
                                        interestedManagers.location_name,
                                        interestedManagers.sublocation_name,
                                        groupedShift.start,
                                        groupedShift.end,
                                        Object.keys(groupedShift.ids).length,
                                        interestedManagers.timezone,
                                        interestedManagers.shift_ids,
                                        interestedManagers.shiftcreator_firstname,
                                        interestedManagers.shiftcreator_lastname
                                    ),
                                    interestedManagers.args,
                                    undefined,
                                    function failedToSendManagersNewShiftNotificationsAfterSendingUserNotification(err) {
                                        slack.error(undefined, 'Failed to send new shift notifications to managers', err);
                                        success = false;
                                        return error(err);
                                    }
                                );
                            });

                        } else if (interestedManagers.unnotifiableUsersExist) {
                            // users wont be notified, but they can apply for the shifts, managers will not be notified but can approve

                            // users exist that can apply for shift, but will not receive notifications about the new shift
                            // managers exist to approve the shift, but will not receive notifications about the new shift

                            if (interested.shiftcreator_id) {
                                _.each(interested.groupedShifts, function (groupedShift) {
                                    self.sendToUsers(
                                        [interested.shiftcreator_id],
                                        self.newShiftNoInterestedUsersNoInterestedManagersToCreator(
                                            interested.groupuserclass_title,
                                            interested.location_name,
                                            interested.sublocation_name,
                                            groupedShift.start,
                                            groupedShift.end,
                                            Object.keys(groupedShift.ids).length,
                                            interested.timezone,
                                            interested.shift_ids
                                        ),
                                        interested.args,
                                        undefined,
                                        function failedToSendUsersNewShiftNotificationsNotSendingManagerNotification(err) {
                                            slack.error(undefined, 'Failed to send new shift notifications to users', err);
                                            success = false;
                                            return error(err);
                                        }
                                    )
                                });
                            }
                        } else {
                            // users wont be notified, but they can apply for the shifts, no managers to approve shifts

                            // users exist that can apply for shift, but will not receive notifications about the new shift
                            // no managers are interested...
                            console.log('no interested managers');
                            if (interested.shiftcreator_id) {
                                _.each(interested.groupedShifts, function (groupedShift) {
                                    self.sendToUsers(
                                        [interested.shiftcreator_id],
                                        self.newShiftNoInterestedUsersNoManagersToCreator(
                                            interested.groupuserclass_title,
                                            interested.location_name,
                                            interested.sublocation_name,
                                            groupedShift.start,
                                            groupedShift.end,
                                            Object.keys(groupedShift.ids).length,
                                            interested.timezone,
                                            interested.shift_ids
                                        ),
                                        interested.args,
                                        undefined,
                                        function failedToSendUsersNewShiftNotificationsNotSendingManagerNotification(err) {
                                            slack.error(undefined, 'Failed to send new shift notifications to users', err);
                                            success = false;
                                            return error(err);
                                        }
                                    )
                                });
                            }
                        }
                    } else {
                        // no users are interested in this shift
                        // no users can apply for the shift
                        console.log('no interested users, users cannot apply for it');
                        if (interestedManagers.notifiableUsersExist) {
                            // no users to apply for shifts, managers will be notified

                            // no users are interested in this shift
                            // no users can apply for the shift
                            // send special notification to managers saying that this might not get filled
                            console.log('but, interested managers');
                            if (interested.shiftcreator_id) {
                                _.each(interested.groupedShifts, function (groupedShift) {
                                    self.sendToUsers(
                                        [interested.shiftcreator_id],
                                        self.newShiftNoUsersInterestedManagersToCreator(
                                            interested.groupuserclass_title,
                                            interested.location_name,
                                            interested.sublocation_name,
                                            groupedShift.start,
                                            groupedShift.end,
                                            Object.keys(groupedShift.ids).length,
                                            interested.timezone,
                                            interested.shift_ids
                                        ),
                                        interested.args,
                                        undefined,
                                        function failedToSendUsersNewShiftNotificationsNotSendingManagerNotification(err) {
                                            slack.error(undefined, 'Failed to send new shift notifications to users', err);
                                            success = false;
                                            return error(err);
                                        }
                                    )
                                });
                            }
                            // send managers notifications
                            _.each(interestedManagers.groupedShifts, function (groupedShift) {
                                self.sendToUsers(
                                    interestedManagers[user_ids_key],
                                    self.newShiftNoUsersInterestedManagersToManager(
                                        interestedManagers.groupuserclass_title,
                                        interestedManagers.location_name,
                                        interestedManagers.sublocation_name,
                                        groupedShift.start,
                                        groupedShift.end,
                                        Object.keys(groupedShift.ids).length,
                                        interestedManagers.timezone,
                                        interestedManagers.shift_ids,
                                        interestedManagers.shiftcreator_firstname,
                                        interestedManagers.shiftcreator_lastname
                                    ),
                                    interestedManagers.args,
                                    undefined,
                                    function failedToSendManagersNewShiftNotificationsAfterSendingUserNotification(err) {
                                        slack.error(undefined, 'Failed to send new shift notifications to managers', err);
                                        success = false;
                                        return error(err);
                                    }
                                );
                            });
                        } else if (interestedManagers.unnotifiableUsersExist) {
                            // no users to apply for shifts, managers will not be notified, but can approve

                            // no users are interested in this shift
                            // no users can apply for the shift
                            // managers can approve it, but are not interested
                            console.log('no interested managers');
                            if (interested.shiftcreator_id) {
                                _.each(interested.groupedShifts, function (groupedShift) {
                                    self.sendToUsers(
                                        [interested.shiftcreator_id],
                                        self.newShiftNoUsersNoInterestedManagerToCreator(
                                            interested.groupuserclass_title,
                                                interested.location_name,
                                                interested.sublocation_name,
                                                groupedShift.start,
                                                groupedShift.end,
                                                Object.keys(groupedShift.ids).length,
                                                interested.timezone,
                                                interested.shift_ids
                                        ),
                                        interested.args,
                                        undefined,
                                        function failedToSendUsersNewShiftNotificationsNotSendingManagerNotification(err) {
                                            slack.error(undefined, 'Failed to send new shift notifications to users', err);
                                            success = false;
                                            return error(err);
                                        }
                                    )
                                });
                            }
                        } else {
                            // no users to apply for shifts, no managers to approve shifts

                            // no users are interested
                            // no users can apply
                            // no managers are interested
                            // no managers can approve

                            // no one cares about this shift except the person creating it
                            if (interested.shiftcreator_id) {
                                _.each(interested.groupedShifts, function (groupedShift) {
                                    self.sendToUsers(
                                        [interested.shiftcreator_id],
                                        self.newShiftNoUsersNoManagersToCreator(
                                            interested.groupuserclass_title,
                                            interested.location_name,
                                            interested.sublocation_name,
                                            groupedShift.start,
                                            groupedShift.end,
                                            Object.keys(groupedShift.ids).length,
                                            interested.timezone,
                                            interested.shift_ids
                                        ),
                                        interested.args,
                                        undefined,
                                        function failedToSendUsersNewShiftNotificationsNotSendingManagerNotification(err) {
                                            slack.error(undefined, 'Failed to send new shift notifications to users', err);
                                            success = false;
                                            return error(err);
                                        }
                                    )
                                });
                            }
                        }
                    }

                    if (success) {
                        return success();
                    }
                },
                function failedToGetManagersForANewShift(err) {
                    slack.error(undefined, 'Error fetching managers for a new shift', err);
                    if (error) {
                        return error(err);
                    }
                });
        } else {
            // never send a notification for a shift created in the past
        }
    }, function failedToGetUsersInterestedInAShift() {
        slack.error(undefined, 'Error notifying about new shift', err);
        console.log(err.stack);
        if (error) {
            return error(err);
        }
    });
};

var usersManagingAShiftSelect = [
    'usergroups.user_id as user_id'
];

var usersManagingAShiftWithShiftInformationSelect = usersManagingAShiftSelect.slice();
_.each([
    // checking if manager is interested in notifications
    'usersettings.pushnotifications as pushOk',
    'usersettings.textnotifications as textOk',
    'usersettings.emailnotifications as emailOk',
    // shift information
    'shifts.title as title',
    'shifts.start as start',
    'shifts.end as end',
    'shifts.location_id as location_id',
    'shifts.id as shift_id',
    // where shift is
    'sublocations.location_id as sublocation_location_id',
    'locations.title as location_name',
    'timezones.name as timezone',
    'sublocations.title as sublocation_name',
    // who the shift is for
    'groupuserclasses.title as groupuserclass_title',
    'groupuserclasses.description as groupuserclass_description',
    'groupuserclasses.requiremanagerapproval as requiremanagerapproval',
    // manager information
    'users.id as user_id',
    'users.username as username',
    'users.email as email',
    'users.phonemobile as text',
    // creator of shift
    'shiftcreator.id as shiftcreator_id',
    'shiftcreator.username as shiftcreator_username',
    'shiftcreator.firstname as shiftcreator_firstname',
    'shiftcreator.lastname as shiftcreator_lastname',
    'shiftcreator.email as shiftcreator_email',
    'shiftcreator.phonemobile as shiftcreator_phonemobile',
    // if manager has any push notifications
    'pushtokens.token as pushtoken',
    'pushtokens.platform as service'
], function(shiftInformationSelectStatement) {
    usersManagingAShiftWithShiftInformationSelect.push(shiftInformationSelectStatement);
});

function getUsersManagingAShiftAndShiftInformation(shift_id, sqlOptions, success, error) {
    return _getUsersManagingAShift(shift_id, true, sqlOptions)
        .tap(function(interestedUsers) {
            if (success) {
                return success(processFetchedInterestedUsers(interestedUsers));
            }
        })
        .catch(function(err) {
            if (error) {
                return error(err);
            }
        });
}

function getUsersManagingAShift(shift_id, sqlOptions) {
    return _getUsersManagingAShift(shift_id, false, sqlOptions);
}

function _getUsersManagingAShift(shift_id, includeShiftInformation, sqlOptions) {
    return models.Shift.query(function(q) {
        q = q.select(
            includeShiftInformation ?
                usersManagingAShiftWithShiftInformationSelect : usersManagingAShiftSelect
        )
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
            });
        if (includeShiftInformation) {
            q
                // grab job type for this shift
                .innerJoin('groupuserclasses', function() {
                    this.on('groupuserclasses.id', '=', 'shifts.groupuserclass_id');
                })
                // where the shift is located at
                .leftJoin('locations', function() {
                    this.on('locations.id', '=', 'sublocations.location_id')
                        .orOn('locations.id', '=', 'shifts.location_id');
                })
                // what timezone it is in
                .leftJoin('timezones', function() {
                    this.on('timezones.id', '=', 'locations.timezone_id');
                })
                .leftJoin('users as shiftcreator', function() {
                    this.on('shiftcreator.id', '=', 'shifts.user_id');
                })
                // get managing users from their usergroup through managingclassesatlocations
                .innerJoin('users', function() {
                    this.on('users.id', '=', 'usergroups.user_id');
                })
                // get user settings
                .innerJoin('usersettings', function() {
                    this.on('usersettings.id', '=', 'users.usersetting_id');
                })
                // if manager has any push tokens
                .leftJoin('tokens', function() {
                    this.on('tokens.user_id', '=', 'users.id')
                })
                .leftJoin('pushtokens', function() {
                    this.on('pushtokens.token_id', '=', 'tokens.id')
                        .andOn('pushtokens.expires', '<', time.nowInUtc())
                })
        }
        if (shift_id instanceof Array) {
            q = q.whereIn('shifts.id', shift_id);
        } else {
            q = q.where('shifts.id', '=', shift_id)
        }
            q = q.andWhereRaw('COALESCE(shifts.location_id, sublocations.location_id) = managingclassesatlocations.location_id')
            .andWhere('grouppermissions.permissionlevel', '>=', managingPermissionLevel);
    })
        .fetchAll(sqlOptions);
}

function getUsersInterestedInAShift(shift_ids, sqlOptions, success, error) {
    return models.Shift.query(function(q) {
        q.select([
            'usersettings.pushnotifications as pushOk',
            'usersettings.textnotifications as textOk',
            'usersettings.emailnotifications as emailOk',
            'shifts.title as title',
            'shifts.start as start',
            'shifts.end as end',
            'shifts.location_id as location_id',
            'shifts.id as shift_id',
            'sublocations.location_id as sublocation_location_id',
            'locations.title as location_name',
            'timezones.name as timezone',
            'sublocations.title as sublocation_name',
            'groupuserclasses.title as groupuserclass_title',
            'groupuserclasses.description as groupuserclass_description',
            'users.id as user_id',
            'users.username as username',
            'users.email as email',
            'users.phonemobile as text',
            'groupuserclasses.requiremanagerapproval as requiremanagerapproval',
            'userpermissions.user_id as user_id',
            'pushtokens.token as pushtoken',
            'pushtokens.platform as service',
            // creator of shift
            'shiftcreator.id as shiftcreator_id',
            'shiftcreator.username as shiftcreator_username',
            'shiftcreator.firstname as shiftcreator_firstname',
            'shiftcreator.lastname as shiftcreator_lastname',
            'shiftcreator.email as shiftcreator_email',
            'shiftcreator.phonemobile as shiftcreator_phonemobile',
        ])
            .from('shifts')
            .innerJoin('groupuserclasses', function() {
                this.on('groupuserclasses.id', '=', 'shifts.groupuserclass_id');
            })
            .innerJoin('groupuserclasstousers', function() {
                this.on('groupuserclasstousers.groupuserclass_id', '=', 'groupuserclasses.id');
            })
            .innerJoin('users', function() {
                this.on('users.id', '=', 'groupuserclasstousers.user_id');
            })
            .leftJoin('users as shiftcreator', function() {
                this.on('shiftcreator.id', '=', 'shifts.user_id');
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
        .fetchAll(sqlOptions)
        .tap(function(interestedUsers) {
            return success(
                processFetchedInterestedUsers(interestedUsers)
            );
        })
        .catch(function(err) {
            slack.error(undefined, 'Failed to get users interested in a shift', err)
            if (err) {
                return error(err);
            }
        })
}

function processFetchedInterestedUsers(interestedUsers) {
    var user_ids = {};
    var user_ids_minus_creator = {};
    var uninterested_user_ids = {};
    var uninterested_user_ids_minus_creator = {};
    var location_id;
    var location_name;
    var sublocation_name;
    var timezone;
    var start;
    var end;
    var shifts = {};
    var groupedShifts = {};
    var shiftcreator_id;
    var shiftcreator_firstname;
    var shiftcreator_lastname;
    var groupuserclass_title;
    var groupuserclass_description;
    var requiremanagerapproval;

    var notifiableUsersExist = false;
    var unnotifiableUsersExist = false;
    var notifiableUsersExistMinusShiftCreator = false;
    var unnotifiableUsersExistMinusShiftCreator = false;

    interestedUsers.each(function (interestedUser) {
        // the same user_id can show up multiple times if the user has more than one login token
        // we prefer to send push notifications
        // if that is not possible we will send an email and a text message?
        interestedUser = interestedUser.toJSON();
        //console.log(interestedUser);
        var user_id = interestedUser.user_id;
        var pushOk = interestedUser.pushOk;
        var textOk = interestedUser.textOk;
        var emailOk = interestedUser.emailOk;
        if (interestedUser.location_id) {
            location_id = interestedUser.location_id;
        }
        if (interestedUser.sublocation_location_id) {
            location_id = interestedUser.sublocation_location_id;
        }
        if (interestedUser.location_name) {
            location_name = interestedUser.location_name;
        }
        if (interestedUser.sublocation_name) {
            sublocation_name = interestedUser.sublocation_name;
        }
        if (interestedUser.start) {
            start = interestedUser.start;
        }
        if (interestedUser.end) {
            end = interestedUser.end;
        }
        if (interestedUser.timezone) {
            timezone = interestedUser.timezone;
        }
        if (interestedUser.groupuserclass_title) {
            groupuserclass_title = interestedUser.groupuserclass_title;
        }
        if (interestedUser.groupuserclass_description) {
            groupuserclass_description = interestedUser.groupuserclass_description;
        }
        if (interestedUser.requiremanagerapproval) {
            requiremanagerapproval = interestedUser.requiremanagerapproval;
        }
        if (interestedUser.shiftcreator_id) {
            callout_id = interestedUser.shiftcreator_id;
        }
        if (interestedUser.shiftcreator_firstname) {
            shiftcreator_firstname = interestedUser.shiftcreator_firstname;
        }
        if (interestedUser.shiftcreator_lastname) {
            shiftcreator_lastname = interestedUser.shiftcreator_lastname;
        }
        if (interestedUser.shift_id) {
            if (!shifts.hasOwnProperty(interestedUser.shift_id)) {
                shifts[interestedUser.shift_id] = {
                    start: start,
                    end: end
                }
            }
            var shiftKey = start + '-' + end;
            if (!groupedShifts.hasOwnProperty(shiftKey)) {
                groupedShifts[shiftKey] = {
                    start: start,
                    end: end,
                    ids: {}
                };
            }
            groupedShifts[shiftKey].ids[interestedUser.shift_id] = true;
        }

        var isShiftCreator = callout_id !== undefined && callout_id == user_id;

        if (pushOk || textOk || emailOk) {
            // regardless if this user is the shift creator, add them to the list
            user_ids[user_id] = true;
            notifiableUsersExist = true;
            if (!isShiftCreator) {
                // this user is not the shift creator
                // add them to the list of users that are not the creator
                user_ids_minus_creator[user_id] = true;
                notifiableUsersExistMinusShiftCreator = true;
            }
        } else {
            // user wants to be in the dark, which is ok
            uninterested_user_ids[user_id] = true;
            unnotifiableUsersExist = true;
            if (!isShiftCreator) {
                // not the shift creator, add them to the list of users that are not the creator
                uninterested_user_ids_minus_creator[user_id] = true;
                unnotifiableUsersExistMinusShiftCreator = true;
            }
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

    return {
        user_ids: Object.keys(user_ids),
        user_ids_minus_creator: Object.keys(user_ids_minus_creator),
        user_ids_map: user_ids,
        notifiableUsersExist: notifiableUsersExist,
        notifiableUsersExistMinusShiftCreator: notifiableUsersExistMinusShiftCreator,
        uninterested_user_ids: Object.keys(uninterested_user_ids),
        uninterested_user_ids_minus_creator: Object.keys(uninterested_user_ids_minus_creator),
        uninterested_user_ids_map: uninterested_user_ids,
        unnotifiableUsersExist: unnotifiableUsersExist,
        unnotifiableUsersExistMinusShiftCreator: unnotifiableUsersExistMinusShiftCreator,
        location_id: location_id,
        location_name: location_name,
        sublocation_name: sublocation_name,
        timezone: timezone,
        start: start,
        end: end,
        shifts: shifts,
        groupedShifts: _.values(groupedShifts),
        shiftcreator_id: shiftcreator_id,
        shiftcreator_firstname: shiftcreator_firstname,
        shiftcreator_lastname: shiftcreator_lastname,
        groupuserclass_title: groupuserclass_title,
        groupuserclass_description: groupuserclass_description,
        requiremanagerapproval: requiremanagerapproval,
        args: args
    };
}

App.prototype.getApprovedDeniedUsersForShift = getApprovedDeniedUsersForShift;

const approvedDeniedUsersShiftInfoKeys = [
    'location_title',
    'sublocation_title',
    'shift_start',
    'shift_end',
    'shift_timezone',
    'shiftcreator_userid',
    'requiremanagerapproval'
];

function getApprovedDeniedUsersForShift(user_id, shift_id, sqlOptions, success, error) {
    return models.Shift.query(function(q) {
        q.select([
            'shiftapplications.id as shiftapplication_id',
            'shiftapplications.user_id as shiftapplicant',
            'shiftapplications.date as shiftapplication_date',
            'shiftapplications.recinded as recinded',
            'shiftapplicationacceptdeclinereasons.accept as accept',
            'shiftapplicationacceptdeclinereasons.autoaccepted as autoaccepted',
            'shiftapplicationacceptdeclinereasons.date as acceptdecline_date',
            'groupuserclasses.requiremanagerapproval as requiremanagerapproval',

            'locations.title as location_title',
            'sublocations.title as sublocation_title',
            'shifts.start as shift_start',
            'shifts.end as shift_end',
            'timezones.name as shift_timezone',
            'shifts.user_id as shiftcreator_userid'
        ])
            .from('shifts')
            .leftJoin('groupuserclasses', function() {
                this.on('groupuserclasses.id', '=', 'shifts.groupuserclass_id');
            })
            .leftJoin('shiftapplications', function() {
                this.on('shiftapplications.shift_id', '=', 'shifts.id');
            })
            .leftJoin('shiftapplicationacceptdeclinereasons', function() {
                this.on('shiftapplicationacceptdeclinereasons.shiftapplication_id', '=', 'shiftapplications.id');
            })
            .leftJoin('sublocations', function() {
                this.on('sublocations.id', '=', 'shifts.sublocation_id')
                    .orOn('sublocations.id', '=', 'shifts.location_id');
            })
            .leftJoin('locations', function() {
                this.on('locations.id', '=', 'shifts.location_id')
                    .orOn('sublocations.location_id', '=', 'locations.id');
            })
            .leftJoin('timezones', function() {
                this.on('timezones.id', '=', 'shifts.timezone_id');
            })
            .where('shifts.id', '=', shift_id)
            .orderBy('acceptdecline_date', 'desc'); // desc so that always compares against latest one
    })
        .fetchAll(sqlOptions)
        .tap(function getApprovedDeniedUsersForShiftSuccess(shiftapplications) {
            if (shiftapplications) {
                var shiftapplicationsJson = shiftapplications.toJSON();
                var userHasOutstandingApplication = false;
                var shiftApplicants = {};
                var approvedApplicant;
                var approvedApplicantApplicationId;
                // iterate through the list of applications
                // figure out if someone has been approved for the shift
                // the first non recinded, accepted shift is the approved one
                var shiftApproved = false;
                var userIsApproved = false;
                var otherUsersHaveAppliedBeforeUser = false;
                var shiftInfoFilled = false;
                var shiftInfo;
                for (var i = 0; i < shiftapplicationsJson.length; i++) {
                    var shiftapplication = shiftapplicationsJson[i];
                    if (!shiftInfoFilled) {
                        shiftInfo = _.pick(shiftapplication, approvedDeniedUsersShiftInfoKeys);
                    }
                    if (shiftapplication.recinded) {
                        // ignore
                    } else {
                        var applicant = shiftapplication.shiftapplicant;
                        if (approvedApplicant === undefined && shiftapplication.accept) {
                            approvedApplicant = applicant;
                            approvedApplicantApplicationId = shiftapplication.shiftapplication_id;
                        } else {
                            shiftApplicants[applicant] = shiftapplication.shiftapplication_id;
                        }
                        if (shiftapplication.shiftapplicant == user_id) {
                            if (shiftapplication.accept) {
                                userIsApproved = true;
                            } else {
                                // user is not approved, keep looking to see if there is an approved shift
                            }
                            // this users shift!
                            userHasOutstandingApplication = true;
                        } else if (shiftapplication.accept) {
                            if (userHasOutstandingApplication) {
                                // user has an outstanding shift already
                                // this means that we encountered the requesting user first
                            } else {
                                // this shiftapplication was made before the user making this request
                                // meaning, they have precedence, in fact they have already been approved
                                otherUsersHaveAppliedBeforeUser = true;
                            }
                        } else {
                            if (userHasOutstandingApplication) {
                                // user has applied before this application
                            } else {
                                // we have not ran into the user yet, someone else (this application) applied before them
                                otherUsersHaveAppliedBeforeUser = true;
                            }
                        }
                    }
                }

                if (shiftapplicationsJson.length == 0) {
                    var errorMessage = 'Approved/Denied users for shift: ' + shift_id + ' end up returning zero results, this will cause a crash.';
                    slack.error(undefined, errorMessage);
                    if (error) {
                        return error(errorMessage);
                    }
                } else if (success) {
                    return success(
                        true,
                        approvedApplicant,
                        approvedApplicantApplicationId,
                        shiftApplicants,
                        userHasOutstandingApplication,
                        otherUsersHaveAppliedBeforeUser,
                        shiftInfo
                    );
                }
            } else if (success) {
                return success(false);
            }
        })
        .catch(function getApprovedDeniedUsersForShiftError(err) {
            slack.error(undefined, 'Failed to get approved denied users for shift: ' + shift_id, err);
            if (error) {
                return error(err);
            }
        })
}

function noop() {
    // NO OP, do nothing, used in forged rabbit messages for ack/nack etc
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
