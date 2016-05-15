var Promise = require('bluebird');
var _ = require('underscore');
var EventEmitter = require('events').EventEmitter;
var models = require('./models');
var config = require('config');
var mailer = require('./mailer');
var events = require('./events');
var time = require('./time');
var slack = require('./slack');
var notifications = require('./notifications');
var Notifications = new notifications.Notifications();

var connections = require('./connections');

var EMAIL_QUEUE = 'jobs.email';
var NOTIFICATION_QUEUE = 'jobs.notification';

function App() {
    EventEmitter.call(this);

    this.config = config;
    this.models = models;
    this.ready = false;
    if (config.has('rabbit.url')) {
        this.connections = connections(config.get('rabbit.url'));
        this.connections.once('ready', this.onConnected.bind(this));
        this.connections.once('lost', this.onLost.bind(this));
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

App.prototype.sendToUsers = function sendToUsers(user_ids, messages, args, test) {
    var hasLocationId = args.hasOwnProperty('location_id');
    var self = this;
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
                    var subscriptions = user.get('subscriptions');
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
                    }
                }

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
                }

                // TODO: TEXT MESSAGE
            } else {
                // this user has disabled all notifications
                console.log("User has all notifications disabled");
            }
        }
    }
};

App.prototype.onConnected = function() {
    this.connections.email = this.connections.queue.default().queue({name: EMAIL_QUEUE});// , { prefetch: 5 }, onCreate.bind(this));
    this.connections.notifications = this.connections.queue.default().queue({name: NOTIFICATION_QUEUE});
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

App.prototype.init = function() {
    this.startHandlingEmails();
    this.startHandlingNotifications();
};

App.prototype.startHandlingEmails = function() {
    if (this.connections) {
        if (mailer) {
            var started = "Started handling emails from RabbitMQ";
            console.log(started);
            slack.info(started);
            this.connections.email.consume(this.handleEmailJob.bind(this));
        } else {
            slack.alert("Email is not configured so not going to consume email events from RabbitMQ");
        }
    } else {
        var notConfigured = "Not handling emails from RabbitMQ as it is not configured";
        console.log(notConfigured);
        slack.info(notConfigured);
    }
    return this;
};

App.prototype.startHandlingNotifications = function() {
    if (this.connections) {
        var started = "Started handling notifications from RabbitMQ";
        console.log(started);
        slack.info(started);
        this.connections.notifications.consume(this.handleNotificationJob.bind(this));
    } else {
        console.log("Not handling notifications from RabbitMQ as it is not configured");
    }
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

    if (!this.connections) {
        console.log("RabbitMQ not configured, sending push notification in web process");
        this.handleNotificationJob(notification, function() {});
        this.handleNotificationJob(notification, function() {});
    } else {
        console.log("Sending push notification to queue...");
        console.log(push);

        this.connections.queue.default().publish(notification, {key: NOTIFICATION_QUEUE});
        this.connections.queue.default().publish(notification, {key: NOTIFICATION_QUEUE});
    }
};

App.prototype.handleNotificationJob = function handleNotificationJob(job, ack) {
    console.log("GOT NOTIFICATION JOB");
    console.log(job);

    Notifications.send(job.service, job.endpoints, job.expires, job.message);
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
        this.handleEmailJob(email, function noop() {});
    } else {
        console.log("Sending email to queue...");
        console.log(email);

        this.connections.queue.default().publish(email, {key: EMAIL_QUEUE});
    }
};

App.prototype.handleEmailJob = function(job, ack) {
    console.log("GOT EMAIL JOB");
    console.log(job);
    // setup
    if (job.to.endsWith("@example.com")) {
        console.log("Not sending email to " + job.to + " as it is example.com (FIXTURE DATA)");
        ack();
    } else {
        if (mailer) {
            mailer.sendMail(job, function sendMailCallback(error, info) {
                ack();
                if (error) {
                    console.log("error");
                    console.log(error);
                    slack.alert("Failed to send email to: " + job.to, error);
                } else {
                    console.log("Mail successfully sent: " + info.response);
                    slack.info("Sent mail to: " + job.to, '#email');
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

module.exports = new App();
