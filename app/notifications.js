"use strict";
var config = require('config'),
    gcm = require('node-gcm'),
    apn = require('apn'),
    wns = require('wns'),
    _ = require('underscore');
var apiKeys = {};
var apnConfig = {};
var wnsConfig = {};

if (config.has('push.gcm.serverapikey')) {
    apiKeys['gcm'] = config.get('push.gcm.serverapikey');
}
if (config.has('push.apn.cert')) {
    apnConfig['cert'] = config.get('push.apn.cert');
}
if (config.has('push.apn.key')) {
    apnConfig['key'] = config.get('push.apn.key');
}
if (config.has('push.wns.id')) {
    if (!apiKeys['wns']) {
        apiKeys['wns'] = {};
    }
    apiKeys['wns']['id'] = config.get('push.wns.id');
    wnsConfig['client_id'] = apiKeys['wns']['id'];
}
if (config.has('push.wns.secret')) {
    if (!apiKeys['wns']) {
        apiKeys['wns'] = {};
    }
    apiKeys['wns']['secret'] = config.get('push.wns.secret');
    wnsConfig['client_secret'] = apiKeys['wns']['secret'];
}

var apnConnection = new apn.Connection(apnConfig);
// https://cordova.apache.org/docs/en/3.0.0/cordova_device_device.md.html#device.platform
var platformMap = {
    'android': 1,
    'ios': 2,
    'windowsphone': 3,
    'blackberry': 4,
    'tizen': 5
};
var platformMethodMap = {
    'android': 'sendToGcm',
    'ios': 'sendToIos',
    'windowsphone': 'sendToWns'
};
var queue = [];
_.each(platformMap, function(value, key) {
    queue.push([]);
});

function Notifications() {
    this.platformMap = platformMap;
    this.gcm = this.initGcm();
    this.sendMap = {};
    var self = this;
    _.each(platformMethodMap, function(method, serviceName) {
        self.sendMap[platformMap[serviceName]] = _.bind(self[method], self);
    });
}

Notifications.prototype.initGcm = function() {
    if (apiKeys.gcm !== undefined && apiKeys.gcm !== null && apiKeys.gcm != '') {
        return new gcm.Sender(apiKeys.gcm);
    } else {
        console.log("Api key for GCM service not specified");
    }
};

Notifications.prototype.sendToIos = function(endpoints, expires, message) {
    //var myDevice = new apn.Device("863974a9b8615f62a9af9c2a6f69a2e50bf9ceef8abd361bc84334e9c0e43eb7");
    var note = new apn.Notification();
    var iosMessage = message.ios;
    if (!iosMessage) {
        iosMessage = message.default;
    }
    note.expiry = Math.floor(Date.now() / 1000) + 3600; // 1hr
    _.each(iosMessage, function(value, option) {
        //if (note.hasOwnProperty(option)) {
            note[option] = value;
        //} else {
            //console.log("NOPE");
        //}
    });
    apnConnection.pushNotification(note, endpoints);
};

Notifications.prototype.sendToGcm = function(endpoints, expires, message) {
    if (!this.gcm) {
        console.log("Tried to send GCM message but api key missing");
        return;
    }
    var themessage = message.android;
    if (!themessage) {
        themessage = message.default;
    }
    console.log(themessage);
    var gcmMessage = new gcm.Message(themessage);
    if (endpoints instanceof Array) {
        if (endpoints.length > 1000) {
            // 1000 endpoints at a time is the maximum
            // TODO: split the calls ups
        } else {
            this._sendToGcm(this.gcm, expires, gcmMessage, endpoints);
        }
    } else {
        this._sendToGcm(this.gcm, expires, gcMessage, endpoints);
    }
};

Notifications.prototype._sendToGcm = function(gcm, expires, message, endpoints) {
    gcm.send(message, {registrationIds: endpoints}, function(err, result) {
        if (err) {
            console.log("Failed to send gcm message:");
            console.log(err);
            queue[platformMap['android']].push({endpoints: endpoints, expires: expires, message: message});
        }
    })
};

Notifications.prototype.sendToWns = function(endpoints, expires, message) {
    if (apiKeys.hasOwnProperty('wns')) {
        if (endpoints instanceof Array) {
            var self = this;
            _.each(endpoints, function(endpoint) {
                self._sendToWns(expires, message, endpoint);
            });
        } else {
            this._sendToWns(expires, message, endpoints);
        }
    } else {
        console.log("Failed to send wns message: not configured");
        return null;
    }
};

Notifications.prototype._sendToWns = function(expires, message, endpoint) {
    wns.sendTileSquareBlock(endpoint, 'Yes!', 'It worked!', wnsConfig, function(err, result) {
        if (err) {
            console.log("Failed to send wns message:");
            console.log(err);
            queue[platformMap['windowsphone']].push({endpoints: endpoint, expires: expires, message: message});
        }
    });
};

Notifications.prototype.send = function(service, endpoints, expires, message) {
    if (!this.sendMap.hasOwnProperty(service) && platformMap.hasOwnProperty(service)) {
        // allow addressing service by name instead of just index
        service = platformMap[service];
    }
    var send = this.sendMap[service];
    if (send) {
        console.log("Trying to send...");
        send(endpoints, expires, message);
        return true;
    } else {
        console.log("Push: Unknown service: " + service);
        return false;
    }
};
/*
// Send to a topic, with no retry this time
sender.sendNoRetry(message, { topic: '/topics/global' }, function (err, result) {
    if(err) console.error(err);
    else    console.log(result);
});
*/
module.exports = Notifications;
