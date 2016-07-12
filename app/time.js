var moment = require('moment-timezone'),
    slack = require('./slack');

module.exports = {
    nowInUtc: function() {
        return Math.floor(new Date().getTime()/1000);
    },
    now: function() {
        return moment();
    },
    dateToUnix: function dateToUnix(date, timezone) {
        return moment(date).unix();
    },
    unixToDate: function unixToDate(unix, timezone) {
        // NOOP for now, for more easily transitioning from UNIX time to SQL Date storage formats
        // http://momentjs.com/timezone/docs/#/using-timezones/parsing-in-zone/
        // return moment(utc, timezone).format('Z'); // untested (http://momentjs.com/timezone/docs/#/using-timezones/converting-to-zone/)
        return unix;
    },
    unknownTimeFormatToDate: unknownTimeFormatToDate,
    differenceInHours: differenceInHours,
    differenceInHoursWithTimezone: function differenceInHoursWithTimezone(start, end, timezone) {
        var difference = differenceInHours(start, end);
        difference.start = difference.start.tz(timezone);
        difference.end = difference.end.tz(timezone);
        return difference;
    },
    prettyPrintStartTime: function prettyPrintStartTime(start, timezone) {
        if (!timezone) {
            throw new Error('No timezone passed in: ' + start + ' - ' + timezone);
        }
        var startMoment = moment(unknownTimeFormatToDate(start, timezone)).tz(timezone);
        return startMoment.format('h:mm A');
    },
    prettyPrintDate: function prettyPrintDate(start, timezone) {
        var startMoment = moment(unknownTimeFormatToDate(start, timezone)).tz(timezone);
        var format = 'ddd, MMMM Do';
        if (moment().diff(startMoment, 'days', false) > 365) {
            format += ' YYYY';
        }
        return startMoment.format(format);
    },
    // threshold to reject client requests as client time being too different from server time
    deltaDifferenceThreshold: 1800 // 30mins
};

function actualUnixToDate(unix, timezone) {
    var time = moment(unix * 1000);
    if (timezone) {
        time = time.tz(timezone);
    }
    return time.format(); // untested (http://momentjs.com/timezone/docs/#/using-timezones/converting-to-zone/)
}

function unknownTimeFormatToDate(time, timezone) {
    if (time) {
        if (typeof(time) != 'number' && time.indexOf('T') >= 0) {
            return time;
        } else {
            return actualUnixToDate(time, timezone);
        }
    } else {
        slack.error(undefined, 'Unknown time given: ' + JSON.stringify(time));
    }
}

function differenceInHours(start, end) {
    var startMoment = moment(unknownTimeFormatToDate(start));
    var endMoment = moment(unknownTimeFormatToDate(end));
    var endMomentCopy = moment(endMoment);
    var years = Math.abs(startMoment.diff(endMoment, 'years', false));
    endMoment.subtract(years, 'years');
    var months = Math.abs(startMoment.diff(endMoment, 'months', false));
    endMoment.subtract(months, 'months');
    var days = Math.abs(startMoment.diff(endMoment, 'days', false));
    endMoment.subtract(days, 'days');
    var hours = Math.abs(startMoment.diff(endMoment, 'hours', false));
    endMoment.subtract(hours, 'hours');
    var minutes = Math.abs(startMoment.diff(endMoment, 'minutes', false));

    return {
        start: startMoment,
        end: endMomentCopy,
        years: years,
        months: months,
        days: days,
        hours: hours,
        minutes: minutes
    };
}
