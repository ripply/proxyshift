var moment = require('moment-timezone');

module.exports = {
    nowInUtc: function() {
        return Math.floor(new Date().getTime()/1000);
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
    // threshold to reject client requests as client time being too different from server time
    deltaDifferenceThreshold: 1800 // 30mins
};
