var moment;
if (typeof window == 'undefined') {
    moment = require('moment');
}

var ShiftShared = {
    grabNormalShiftRange: grabNormalShiftRange
};

function grabNormalShiftRange(from, after, before) {
    if (from === undefined) {
        from = new Date();
    }
    if (after === undefined) {
        after = moment(from)
            .subtract('1', 'months')
            .subtract('1', 'hour')
            .endOf('month')
            .unix();
    }
    if (before === undefined) {
        before = moment(from)
            .add('3', 'months')
            .add('1', 'hour')
            .startOf('month')
            .unix();
    }

    return [after, before];
}

if (typeof window == 'undefined') {
    module.exports = ShiftShared;
} else {
    window.ShiftShared = ShiftShared;
}
