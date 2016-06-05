var _ = require('underscore'),
    models = require('./models'),
    slack = require('./slack'),
    moment = require('moment-timezone'),
    time = require('./time');

var categories = {
    'newShift': {
        actions: [
            { "icon": "ion-checkmark", "title": "Apply", "callback": "window.newShift.apply", "foreground": true},
            { "icon": "snooze", "title": "Ignore", "callback": "window.newShift.ignore", "foreground": false}
        ]
    },
    'manageShift': {
        actions: [
            { "icon": "ion-checkmark", "title": "Accept", "callback": "window.manageShift.accept", "foreground": true},
            { "icon": "snooze", "title": "Manage", "callback": "window.manageShift.manage", "foreground": true}
        ]
    }
};

function createNotification(default_, title, message, bodyAndroidOnly, badge, timeToLive, category, action, data) {
    var compiledMessage = _.template(message);
    var compiledBody = _.template(bodyAndroidOnly);
    return function(args) {
        var interpolatedMessage = compiledMessage(args);
        var interpolatedBody = compiledBody(args);

        var ios = {
            alert: message,
            'content-available': 1,
            payload: {
                message: interpolatedMessage,
                action: action,
                data: data
            }
        };

        if (category) {
            ios.category = category;
        }

        if (badge) {
            ios.badge = badge;
        }

        var android = {
            timeToLive: timeToLive,
            data: {
                title: title,
                message: interpolatedMessage,
                action: action,
                data: data,
                //style: 'inbox',
                //summaryText: 'There are %n% notifications',
                'content-available': '1',
                //priority: 2,

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
        3,
        undefined,
        'loggedIn'
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

function formatTimeDateLocationsForNotifications(shift_location, shift_sublocation, shift_start, shift_end, timezone) {
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
        location: joinableLocation.join(' '),
        length: joinableDisplayTime.join(' '),
        start: time.prettyPrintStartTime(shift_start, timezone),
        date: time.prettyPrintDate(shift_start, timezone)
    }
}

function newShiftApplication(shift_location, shift_sublocation, shift_start, shift_end, timezone, job_title, shift_id, shiftapplication_id) {
    var formatted = formatTimeDateLocationsForNotifications(shift_location, shift_sublocation, shift_start, shift_end, timezone);

    return {
        push: createNotification(
            {test: 'test'},
            'New Shift Applications',
            'Available employees are waiting for your confirmation for the ' + job_title + ' open shift on ' + formatted.date + ' at ' + formatted.start,
            'body android only',
            3,
            3,
            'manageShift',
            'manageShift',
            {
                shift_id: shift_id,
                shiftapplication_id: shiftapplication_id
            }
        )
    }
}

function newShift(shift_location, shift_sublocation, shift_start, shift_end, timezone, shift_id) {
    var formatted = formatTimeDateLocationsForNotifications(shift_location, shift_sublocation, shift_start, shift_end, timezone);

    return {
        push: createNotification(
            {test: 'test'},
            'New Open Shift',
            formatted.location + ' has a ' + formatted.length + 'open shift starting at ' + formatted.start + ' on ' + formatted.date,
            'body android only',
            3,
            3,
            'newShift',
            'newShift',
            {
                shift_id: shift_id
            }
        )
    };
}

function acceptOrDeniedShiftApplication(data) {
    /*
     approved_denied_date,
     shift_accepted,
     shift_deny_reason,
     shift_title,
     shift_description,
     shift_start,
     shift_end,
     shift_canceled,
     shift_timezone,
     groupuserclass_title,
     groupuserclass_description,
     approver_username,
     approver_firstname,
     approver_lastname,
     applicant_userid,
     applicant_firstname,
     applicant_lastname,
     location_title,
     sublocation_title,
     sublocation_description
     */
    var formatted = formatTimeDateLocationsForNotifications(data.location_title, data.sublocation_title, data.shift_start, data.shift_end, data.timezone);
    _.extend(data, formatted);

    data.shift_accepted = (data.shift_accepted == true || data.shift_accepted == 1);

    return {
        push: createNotification(
            {test: 'test'},
            data.shift_accepted ? 'Approved Shift' : 'Denied Shift',
            (data.shift_accepted ? 'APPROVED' : 'DENIED') + ' for ' + data.start + ' at ' + data.length + ' at ' + data.location,
            'body android only',
            3,
            3,
            'shiftApplicationApproveDeny',
            'shiftApplicationApproveDeny',
            {
                shift_id: data.shift_id,
                shiftapplication_id: data.shiftapplication_id,
                accepted: data.shift_accepted
            }
        ),
        email: {
            subject: data.shift_accepted ?
                _.template("Approved for shift <%- start %> - <%- length %> at <%- location %>") :
                _.template("Application denied for shift <%- start %> - <%- length %> at <%- location %>"),
            text: data.shift_accepted ?
                _.template("APPROVED") :
                _.template("DENIED"),
            html: data.shift_accepted ?
                _.template("APPROVED") :
                _.template("DENIED")
        }
    };
}

module.exports = {
    newShift: newShift,
    newShiftApplication: newShiftApplication,
    acceptOrDeniedShiftApplication: acceptOrDeniedShiftApplication,
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
    shiftApplicationApprovalOrDenial: function shiftApplicationApproved(shiftapplicationacceptdeclinereason_id) {
        return this.sendShiftApplicationApprovalDenial(shiftapplicationacceptdeclinereason_id);
    },
    passwordReset: function passwordReset(user_ids, args) {
        args.link = this.createTokenUrl("/passwordreset", args.token);
        return this.sendToUsers(user_ids, eventPasswordReset, args);
    },
    shiftsCreated: function shiftsCreated(user_id_that_created_shift, shift_ids) {
        return this.sendNewShifts(user_id_that_created_shift, shift_ids);
    }
};
