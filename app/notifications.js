var GCM = require('gcm').GCM,
    config = require('config');

var apiKeys = {};

if (config.has('push.gcm.serverapikey')) {
    apiKeys['gcm'] = config.get('push.gcm.serverapikey');
}

var gcm;
if (apiKeys.gcm) {
    gcm = new GCM(apiKeys.gcm);
}

module.exports = {

};
