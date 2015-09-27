var moment;
if (typeof window == 'undefined') {
    moment = require('moment');
}

var PushAppIds = {
    gcm: 635706604728
};

if (typeof window == 'undefined') {
    module.exports = PushAppIds;
} else {
    window.PushAppIds = PushAppIds;
}
