var _ = require('underscore'),
    models = require('./models'),
    slack = require('./slack'),
    moment = require('moment-timezone'),
    time = require('./time');

var categories = {
    'newShift': {
        actions: [
            { "icon": "ion-checkmark", "title": "Apply", "callback": "app.apply", "foreground": true},
            { "icon": "snooze", "title": "Ignore", "callback": "app.ignore", "foreground": false}
        ]
    }
};

function createNotification(default_, title, message, bodyAndroidOnly, badge, timeToLive, category) {
    var compiledMessage = _.template(message);
    var compiledBody = _.template(bodyAndroidOnly);
    return function(args) {
        var interpolatedMessage = compiledMessage(args);
        var interpolatedBody = compiledBody(args);

        var ios = {
            alert: title,
            payload: {
                message: interpolatedMessage,
            }
        };

        if (category) {
            ios.category = category;
        }

        if (badge) {
            ios.badge = badge;
        }

        var android = {
            contentAvailable: true,
            timeToLive: timeToLive,
            data: {
                title: title,
                message: interpolatedMessage,
                //style: 'inbox',
                //summaryText: 'There are %n% notifications',

                //priority: 2,
                'content-available': '1',
                //"vibrationPattern": [2000, 1000, 500, 500]
            }
        };

        if (category) {
            android.data = _.extend(android.data, categories[category]);
        }

        return {
            default: default_,
            ios: ios,
            android: android
        }
    }
}

var eventInvitedToGroupMessages = {
    push: createNotification(
        {test: 'test'},
        "Invited to group <%- group %>",
        "Invited to group <%- group %>",
        "Invited to group <%- group %>",
        3,
        3
    ),
    email: {
        subject: _.template("Invited to group <%- group %>"),
        text: _.template("Invited to group <%- group %>"),
        html: _.template("Invited to group <%- group %>")
    }
};

var eventLoggedInMesages = {
    push: createNotification(
        {test: 'test'},
        'You logged in!',
        'Push: You logged in!',
        'Successfully!',
        3,
        3
    )
};

var eventPasswordReset = {
    email: {
        subject: _.template("Proxyshift Password reset"),
        text: _.template("Click to reset your password: <%- link %>"),
        html: _.template("Click to reset your password: <a href=\"<%- link %>\"><%- link -></a>")
    }
};

var verifyEmail = {
    email: {
        from: 'thamer@proxyshift.com',
        subject: _.template("Proxyshift Email verification"),
        text: _.template("Verify email at <%- link %>"),
        html: _.template('Verify email at <a href="<%- link %>"><%- link %></a>')
    }
};

function newShift(shift_location, shift_sublocation, shift_start, shift_end, timezone) {
    var hoursMinutes = time.differenceInHours(shift_start, shift_end);
    var joinableDisplayTime = [];
    if (hoursMinutes.hours && hoursMinutes.hours > 0) {
        joinableDisplayTime.push(hoursMinutes.hours + ' hr');
    }
    if (hoursMinutes.minutes && hoursMinutes.minutes > 0) {
        joinableDisplayTime.push(hoursMinutes.minutes + ' min');
    }
    var joinableLocation = [];
    if (shift_location) {
        joinableLocation.push(shift_location);
    }
    if (shift_sublocation) {
        joinableLocation.push(shift_sublocation);
    }

    return {
        push: createNotification(
            {test: 'test'},
            'New Open Shift',
            joinableLocation.join(' ') + ' has a ' + (joinableDisplayTime.join(' ')) + ' open shift starting at ' + time.prettyPrintStartTime(shift_start, timezone) + ' on ' + time.prettyPrintDate(shift_start, timezone),
            'body android only',
            3,
            3,
            'newShift'
        )
    };
}

module.exports = {
    invitedToGroup: function eventInvitedToGroup(user_ids, args) {
        // TODO: MODIFY THIS TO ACCEPT A TO EMAIL
        // send email and notification
        return this.sendToUsers(user_ids, eventInvitedToGroupMessages, args);
    },
    loggedIn: function loggedIn(user_ids, args) {
        return this.sendToUsers(user_ids, eventLoggedInMesages, args);
    },
    verifyEmail: function verifyEmail(user_ids, args) {
        args.link = this.createTokenUrl("/emailverify", args.token);
        return this.sendToUsers(user_ids, verifyEmail, args);
    },
    loggedOut: function loggedOut(pushtokens) {
        if (!(pushtokens instanceof Array)) {
            pushtokens = [pushtokens];
        }
        var now = time.nowInUtc();
        var self = this;

        var serviceTokens = {};
        var foundPushToken = false;
        _.each(pushtokens, function (pushtoken) {
            if (!serviceTokens.hasOwnProperty(pushtoken.platform)) {
                serviceTokens[pushtoken.platform] = [];
            }

            serviceTokens[pushtoken.platform].push(pushtoken.token);
            foundPushToken = true;
        });

        if (foundPushToken) {
            _.each(serviceTokens, function (tokens, service) {
                self.sendNotification(service, tokens, self.pushNotificationsExpiresIn(now), "You have been logged out on this device");
            });
        }
    },
    passwordReset: function passwordReset(user_ids, args) {
        args.link = this.createTokenUrl("/passwordreset", args.token);
        return this.sendToUsers(user_ids, eventPasswordReset, args);
    },
    shiftsCreated: function shiftsCreated(user_id_that_created_shift, shift_ids) {
        if (!(shift_ids instanceof Array)) {
            // unknown format, discard
            slack.alert('Unknown shiftsCreated argument: ' + JSON.stringify(shift_ids));
            return;
        }

        var self = this;

        return models.User.query(function(q) {
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
                .from('users')
                .innerJoin('groupuserclasses', function() {
                    this.on('groupuserclasses.id', '=', 'shifts.groupuserclass_id');
                })
                .innerJoin('shifts', function() {
                    this.on('shifts.groupuserclass_id', '=', 'groupuserclasses.id');
                })
                .innerJoin('groupuserclasstousers', function() {
                    this.on('groupuserclasstousers.groupuserclass_id', '=', 'groupuserclasses.id');
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
                        .andOn('userpermissions.user_id', '=', 'users.id')
                        .andOn('userpermissions.subscribed', '!=', false);
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
                var args = {};
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
                    self.sendToUsers(Object.keys(user_ids), newShift(location_name, sublocation_name, start, end, timezone), args);
                } else {
                    // never send a notification for a shift created in the past
                }
            })
            .catch(function(err) {
                slack.error(undefined, 'Error notifying about new shift', err);
            });
    }
};
