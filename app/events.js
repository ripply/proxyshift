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
            alert: message,
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
            joinableLocation.join(' ') + ' has a ' + (joinableDisplayTime.join(' ')) + 'open shift starting at ' + time.prettyPrintStartTime(shift_start, timezone) + ' on ' + time.prettyPrintDate(shift_start, timezone),
            'body android only',
            3,
            3,
            'newShift'
        )
    };
}

module.exports = {
    newShift: newShift,
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
        return this.sendNewShifts(user_id_that_created_shift, shift_ids);
    }
};
