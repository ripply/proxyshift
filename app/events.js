var _ = require('underscore');

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
                message: interpolatedMessage
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

module.exports = {
    invitedToGroup: function eventInvitedToGroup(user_ids, args) {
        // send email and notification
        return this.sendToUsers(user_ids, eventInvitedToGroupMessages, args);
    },
    loggedIn: function loggedIn(user_ids, args) {
        return this.sendToUsers(user_ids, eventLoggedInMesages, args);
    }
};
