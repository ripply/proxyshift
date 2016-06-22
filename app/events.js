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

var timeFormats= {
    'years': 'year',
    'months': 'month',
    'days': 'day',
    'hours': 'hr',
    'minutes': 'min'
};

function formatTimeDateLocationsForNotifications(shift_location, shift_sublocation, shift_start, shift_end, timezone) {
    var hoursMinutes = time.differenceInHours(shift_start, shift_end);
    var joinableDisplayTime = [];

    _.each(timeFormats, function(value, key) {
        if (hoursMinutes.hasOwnProperty(key) && hoursMinutes[key] > 0) {
            joinableDisplayTime.push(hoursMinutes[key] + ' ' + value)
        }
    });

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

function newShiftApplication(
    shift_location,
    shift_sublocation,
    shift_start,
    shift_end,
    timezone,
    job_title,
    shift_id,
    shiftapplication_id
) {
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

// sent to anyone who can apply for this shift, informing them that it exists
function newShift(
    job_title,
    shift_location,
    shift_sublocation,
    shift_start,
    shift_end,
    shift_count,
    timezone,
    shift_id
) {
    var formatted = formatTimeDateLocationsForNotifications(shift_location, shift_sublocation, shift_start, shift_end, timezone);
    var difference = time.differenceInHoursWithTimezone(shift_start, shift_end, timezone);

    var now = time.now();
    if (now > difference.start) {
        // shift started in the past
        if (now <= difference.end) {
            // shift is in progress, good!
        } else {
            // shift is over...
            // it may have *just* ended
            if (now.diff(difference.end, 'hours') > 1) {
                // this shift is too old, lets let this fail
                // the worst that will happen is that it will progress to the next one
                // and this will show up in slack
                throw new Error(
                    'newShiftInProgress: Shift has ended: id:' + shift_id +
                    ', shift_end: ' + shift_end +
                    ', now: ' + now.format()
                );
            } else {
                // shift is relatively recent... let it pass but warn in slack, hopefully this doesn't happen
                slack.info(
                    'Sending notification for recently ended shift: ' + shift_id +
                    ', shift_end: ' + shift_end +
                    ', timezone: ' + timezone +
                    ', now: ' + now.format()
                );
            }
        }
    } else {
        // shift has not started yet
        return {
            push: createNotification(
                {test: 'test'},
                'New Open Shift' + (shift_count <= 1 ? '':'s'),
                shift_count <= 1 ?
                    (formatted.location + ' has a ' + formatted.length + ' long ' + job_title + ' open shift starting at ' + formatted.start + ' on ' + formatted.date):
                    (formatted.location + ' needs ' + shift_count + ' ' + job_title + ' to fill ' + formatted.length + ' long open shifts starting at ' + formatted.start + ' on ' + formatted.date),
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

    var message;

    if (shift_count <= 1) {
        message =
            formatted.location +
            ' needs help for a current shift in progress for a ' +
            job_title +
            ' for ' +
            formatted.length +
            ' that began on ' +
            formatted.date +
            ' at ' +
            formatted.start;
    } else {
        message =
            formatted.location +
            ' needs help for a current shift in progress for ' +
            shift_count +
            ' ' +
            job_title +
            ' for ' +
            formatted.length +
            ' that began on ' +
            formatted.date +
            ' at ' +
            formatted.start;
    }

    // shift is in progress
    return {
        push: createNotification(
            {test: 'test'},
            'New Shift' + (shift_count <= 1 ? '':'s') + ' In Progress',
            message,
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

// sent to all managers that can approve this new shift, letting them know that someone has called out or a new shift has been created
function newShiftForManagers(
    job_title,
    shift_location,
    shift_sublocation,
    shift_start,
    shift_end,
    shift_count,
    timezone,
    shift_id,
    calledout_user_firstname,
    calledout_user_lastname
) {
    var formatted = formatTimeDateLocationsForNotifications(shift_location, shift_sublocation, shift_start, shift_end, timezone);

    // [Employee Name] has called out from [LOCATION] for [X] hours on [DATE] at [TIME]
    return {
        push: createNotification(
            {test: 'test'},
            'New callout',
            shift_count <= 1 ?
                (calledout_user_firstname + ' ' + calledout_user_lastname + ' (' + job_title + ') has called out from ' + shift_location + ' for ' + formatted.length + ' on ' + formatted.date + ' at ' + formatted.start) :
                (calledout_user_firstname + ' ' + calledout_user_lastname + ' (' + job_title + ') has requested ' + shift_count + ' employees to cover at ' + shift_location + ' for ' + formatted.length + ' on ' + formatted.date + ' at ' + formatted.start),
            'body android only',
            3,
            3,
            'manageShift',
            'manageShift',
            {
                shift_id: shift_id
            }
        )
    };
}

// sent to person who created shift to inform them to contact their manager
function newShiftButNoManagersCanApprove(
    job_title,
    shift_location,
    shift_sublocation,
    shift_start,
    shift_end,
    shift_count,
    timezone,
    shift_id,
    calledout_user_firstname,
    calledout_user_lastname
) {
    var formatted = formatTimeDateLocationsForNotifications(shift_location, shift_sublocation, shift_start, shift_end, timezone);

    // There are no managers registered to approve this shift. Please contact your manager.

    return {
        push: createNotification(
            {test: 'test'},
            'Notice',
            'There are no managers registered to approve this shift. Please contact your manager.',
            'body android only',
            3,
            3,
            'manageShift',
            'manageShift',
            {
                shift_id: shift_id
            }
        )
    };
}

// sent to user who created the shift
function newShiftNoInterestedUsersManagersInterestedToCreator(
    job_title,
    shift_location,
    shift_sublocation,
    shift_start,
    shift_end,
    shift_count,
    timezone,
    shift_id,
    calledout_user_firstname,
    calledout_user_lastname
) {
    var formatted = formatTimeDateLocationsForNotifications(shift_location, shift_sublocation, shift_start, shift_end, timezone);

    // There are no managers registered to approve this shift. Please contact your manager.

    return {
        push: createNotification(
            {test: 'test'},
            'Notice',
            'You shift request has been sent. Please note no users have set their notification settings turned on.',
            'body android only',
            3,
            3,
            'manageShift',
            'manageShift',
            {
                shift_id: shift_id
            }
        )
    };
}

// sent to manager when no users have their notifications on
function newShiftNoInterestedUsersManagersInterestedToManager(
    job_title,
    shift_location,
    shift_sublocation,
    shift_start,
    shift_end,
    shift_count,
    timezone,
    shift_id,
    calledout_user_firstname,
    calledout_user_lastname
) {
    var formatted = formatTimeDateLocationsForNotifications(shift_location, shift_sublocation, shift_start, shift_end, timezone);

    // Manager- [Name] has created a shift request  at [Location Name] on [ date] at [time] for [X] hours. Please note no users have set their notification settings turned on."
    var message =
        calledout_user_firstname + ' ' + calledout_user_lastname +
        ' has created a shift request at ' +
        shift_location +
        ' on ' +
        formatted.date + ' at ' +
        formatted.start + ' for ' +
        formatted.length +
        '.Please note no users have set their notification settings turned on.';

    return {
        push: createNotification(
            {test: 'test'},
            'Notice',
            message,
            'body android only',
            3,
            3,
            'manageShift',
            'manageShift',
            {
                shift_id: shift_id
            }
        )
    };
}

// users wont be notified, but they can apply for the shifts, no managers to approve shifts
// sent to manager when no users have their notifications on
function newShiftNoInterestedUsersNoInterestedManagersToCreator(
    job_title,
    shift_location,
    shift_sublocation,
    shift_start,
    shift_end,
    shift_count,
    timezone,
    shift_id,
    calledout_user_firstname,
    calledout_user_lastname
) {
    var formatted = formatTimeDateLocationsForNotifications(shift_location, shift_sublocation, shift_start, shift_end, timezone);

    // There are no managers registered to approve this shift. Please contact your manager.
    var message =
        'Your shift request has been sent. Please note this shift requires manager approval and all managers currently have notifications turned off. Please contact your manager.';

    return {
        push: createNotification(
            {test: 'test'},
            'Notice',
            message,
            'body android only',
            3,
            3,
            'manageShift',
            'manageShift',
            {
                shift_id: shift_id
            }
        )
    };
}

// no users to apply for shifts, managers will not be notified, but can approve
function newShiftNoInterestedUsersNoManagersToCreator(
    job_title,
    shift_location,
    shift_sublocation,
    shift_start,
    shift_end,
    shift_count,
    timezone,
    shift_id,
    calledout_user_firstname,
    calledout_user_lastname
) {
    var formatted = formatTimeDateLocationsForNotifications(shift_location, shift_sublocation, shift_start, shift_end, timezone);

    // There are no managers registered to approve this shift. Please contact your manager.
    var message =
        'Your shift request has been sent. However no users are subscribed to receive notifications from your location. Please contact either your coworkers or manager.';

    return {
        push: createNotification(
            {test: 'test'},
            'Notice',
            message,
            'body android only',
            3,
            3,
            'manageShift',
            'manageShift',
            {
                shift_id: shift_id
            }
        )
    };
}

// no users to apply for shifts, managers will not be notified, but can approve
function newShiftNoUsersInterestedManagersToCreator(
    job_title,
    shift_location,
    shift_sublocation,
    shift_start,
    shift_end,
    shift_count,
    timezone,
    shift_id,
    calledout_user_firstname,
    calledout_user_lastname
) {
    var formatted = formatTimeDateLocationsForNotifications(shift_location, shift_sublocation, shift_start, shift_end, timezone);

    // There are no managers registered to approve this shift. Please contact your manager.
    var message =
        'Your shift request has been sent. However no users are subscribed to receive notifications from your location. Please contact either your coworkers or manager.';

    return {
        push: createNotification(
            {test: 'test'},
            'Notice',
            message,
            'body android only',
            3,
            3,
            'manageShift',
            'manageShift',
            {
                shift_id: shift_id
            }
        )
    };
}

function newShiftNoUsersInterestedManagersToManager(
    job_title,
    shift_location,
    shift_sublocation,
    shift_start,
    shift_end,
    shift_count,
    timezone,
    shift_id,
    calledout_user_firstname,
    calledout_user_lastname
) {
    var formatted = formatTimeDateLocationsForNotifications(shift_location, shift_sublocation, shift_start, shift_end, timezone);

    // Manager- [Name] has created a shift request  at [Location Name] on [ date] at [time] for [X] hours. Please note no users have set their notification settings turned on."
    var message =
        calledout_user_firstname + ' ' + calledout_user_lastname +
        ' has created a shift request at ' +
        shift_location +
        ' on ' +
        formatted.date +
        ' at ' +
        formatted.start +
        ' for ' +
        formatted.length +
        '. Please note no users have set their notification settings turned on.';

    return {
        push: createNotification(
            {test: 'test'},
            'Notice',
            message,
            'body android only',
            3,
            3,
            'manageShift',
            'manageShift',
            {
                shift_id: shift_id
            }
        )
    };
}

function newShiftNoUsersNoInterestedManagerToCreator(
    job_title,
    shift_location,
    shift_sublocation,
    shift_start,
    shift_end,
    shift_count,
    timezone,
    shift_id,
    calledout_user_firstname,
    calledout_user_lastname
) {
    var formatted = formatTimeDateLocationsForNotifications(shift_location, shift_sublocation, shift_start, shift_end, timezone);

    var message =
        'Your shift request has been sent. Please note this shift requires manager approval and all managers currently have notifications turned off. Please contact your manager.';

    return {
        push: createNotification(
            {test: 'test'},
            'Notice',
            message,
            'body android only',
            3,
            3,
            'manageShift',
            'manageShift',
            {
                shift_id: shift_id
            }
        )
    };
}

function newShiftNoUsersNoManagersToCreator(
    job_title,
    shift_location,
    shift_sublocation,
    shift_start,
    shift_end,
    shift_count,
    timezone,
    shift_id,
    calledout_user_firstname,
    calledout_user_lastname
) {
    var formatted = formatTimeDateLocationsForNotifications(shift_location, shift_sublocation, shift_start, shift_end, timezone);

    var message =
        'Your shift request has been sent. However no users are subscribed to receive notifications from your location. Also there are no managers to approve the shift. Please contact your coworkers and manager.';

    return {
        push: createNotification(
            {test: 'test'},
            'Notice',
            message,
            'body android only',
            3,
            3,
            'manageShift',
            'manageShift',
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
    newShiftApplication: newShiftApplication,
    acceptOrDeniedShiftApplication: acceptOrDeniedShiftApplication,

    newShift: newShift,
    newShiftForManagers: newShiftForManagers,
    newShiftButNoManagersCanApprove: newShiftButNoManagersCanApprove,
    // 4a
    newShiftNoInterestedUsersManagersInterestedToCreator: newShiftNoInterestedUsersManagersInterestedToCreator,
    // 4b
    newShiftNoInterestedUsersManagersInterestedToManager: newShiftNoInterestedUsersManagersInterestedToManager,
    // 5a
    newShiftNoInterestedUsersNoInterestedManagersToCreator: newShiftNoInterestedUsersNoInterestedManagersToCreator,
    // 6a
    newShiftNoInterestedUsersNoManagersToCreator: newShiftNoInterestedUsersNoManagersToCreator,
    // 7a
    newShiftNoUsersInterestedManagersToCreator: newShiftNoUsersInterestedManagersToCreator,
    // 7b
    newShiftNoUsersInterestedManagersToManager: newShiftNoUsersInterestedManagersToManager,
    // 8a
    newShiftNoUsersNoInterestedManagerToCreator: newShiftNoUsersNoInterestedManagerToCreator,
    // 9a
    newShiftNoUsersNoManagersToCreator: newShiftNoUsersNoManagersToCreator,
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
