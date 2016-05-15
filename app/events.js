var _ = require('underscore'),
    time = require('./time');

function createNotification(default_, title, message, bodyAndroidOnly, badge, timeToLive) {
    var compiledMessage = _.template(message);
    var compiledBody = _.template(bodyAndroidOnly);
    return function(args) {
        var interpolatedMessage = compiledMessage(args);
        var interpolatedBody = compiledBody(args);

        var ios = {
            alert: title,
            payload: {
                message: interpolatedMessage
            }
        };
        if (badge) {
            ios.badge = badge;
        }

        var android = {
            contentAvailable: true,
            timeToLive: timeToLive,
            data: {
                message: interpolatedMessage,
                style: 'inbox',
                summaryText: 'There are %n% notifications'
            },
            notification: {
                title: title,
                body: interpolatedBody
            }
        };

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
    }
};
