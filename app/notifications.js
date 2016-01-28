"use strict";
var config = require('config'),
    cluster = require('cluster'),
    gcm = require('node-gcm'),
    apn = require('apn'),
    wns = require('wns'),
    fs = require('fs'),
    time = require('./time'),
    Promise = require('bluebird'),
    _ = require('underscore');
var apiKeys = {};
var apnConfig = {};
var wnsConfig = {};
var apnFeedbackOptions = {};

if (config.has('push.gcm.serverapikey')) {
    apiKeys['gcm'] = config.get('push.gcm.serverapikey');
}

if (config.has('push.apn.cert')) {
    apnConfig['cert'] = config.get('push.apn.cert');
}

if (config.has('push.apn.key')) {
    apnConfig['key'] = config.get('push.apn.key');
}

var cert = apnConfig['cert'];
if (!cert) {
    cert = 'cert.pem'
}
var key = apnConfig['key'];
if (!key) {
    key = 'key.pem'
}

var apnCertExists = false;
var apnKeyExists = false;
var filesExistPromises = [];
var minimumLengthToAssumeItIsAPemFile = 256;
filesExistPromises.push(new Promise(function(resolve) {
    if (cert.length > minimumLengthToAssumeItIsAPemFile) {
        // assume cert contains cert
        apnCertExists = true;
        resolve();
    } else {
        fs.exists(cert, function(exists) {
            apnCertExists = exists;
            resolve();
        });
    }
}));
filesExistPromises.push(new Promise(function(resolve) {
    if (key.length > minimumLengthToAssumeItIsAPemFile) {
        apnKeyExists = true;
        resolve();
    } else {
        fs.exists(key, function(exists) {
            apnKeyExists = exists;
            resolve();
        });
    }
}));
var filesExistFinished = Promise.all(filesExistPromises);

apnConfig['batchfeedback'] = true;

if (config.has('push.apn.feedback.interval')) {
    apnConfig['interval'] = config.get('push.apn.feedback.interval');
} else {
    apnConfig['interval'] = 300;
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

function doApnCertsExist() {
    return apnCertExists && apnKeyExists;
}

function Notifications() {
    if (cluster.isMaster) {
        var self = this;
        Object.keys(cluster.workers).forEach(function iterateOverWorkers(id) {
            cluster.workers[id].on('sendNotification', function parseClusterMessage(message, args) {
                console.log("Got sendNotification");
                console.log(args);
                self.send.apply(self, args);
            });
        });
        this.platformMap = platformMap;
        this.gcm = this.initGcm();
        this.sendMap = {};
        // https://github.com/argon/node-apn#setting-up-the-feedback-service
        this.apnCertsExist = filesExistFinished;
        this.apnCertsExist.then(function setupAPNFeedbackService() {
            if (doApnCertsExist()) {
                self.apnCertsExist = true;

                self.feedback = new apn.Feedback(apnConfig);
                self.feedback.on('feedback', function handleApnFeedback(devices) {
                    _.forEach(devices, function handlingApnFeedback(item) {
                        console.log("APN Feedback");
                        console.log(item);
                        // Buffer object containing device token
                        // item.device
                        //
                        // item.time
                    });
                });
            } else {
                self.apnCertsExist = false;
                console.log("Not initializing APN feedback service as certificates are not setup properly");
            }
        });
        _.each(platformMethodMap, function iterateOverPlatforms(method, serviceName) {
            self.sendMap[platformMap[serviceName]] = _.bind(self[method], self);
        });
    } else {
        // slave just will send messages to the master so that we only keep one connection open to notification services
    }
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
    var self = this;
    if (this.apnCertsExist === false) {
        console.log("APN Certs not setup correctly, not sending message to " + JSON.stringify(endpoints));
        return false;
    } else if (this.apnCertsExist !== true) {
        this.apnCertsExist.then(function() {
            self.apnCertsExist = doApnCertsExist();
            self.sendToIos(endpoints, expires, message);
        });
    }
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
    console.log("Sending notification to iOS");
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
    console.log("Sending notification to GCM");
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
    console.log("Sending notification to WNS");
    wns.sendTileSquareBlock(endpoint, 'Yes!', 'It worked!', wnsConfig, function(err, result) {
        var accessToken = err ? err.newAccessToken : result.newAccessToken;
        if (accessToken) {
            wnsConfig.accessToken = accessToken;
        }
        if (err) {
            console.log("Failed to send wns message:");
            console.log(err);
            if (err.headers.statusCode == 403) {
                // url endpoint is not associated with our app
                // TODO: Remove the endpoint from DB
            } else {
                queue[platformMap['windowsphone']].push({endpoints: endpoint, expires: expires, message: message});
            }
        }
    });
};

Notifications.prototype.send = function send(service, endpoints, expires, message) {
    //if (cluster.isMaster) {
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
    /*
    } else {
        console.log("sending sendNotification");
        process.send('sendNotification', [
            service,
            endpoints,
            expires,
            message
        ]);
    }
    */
};
/*
// Send to a topic, with no retry this time
sender.sendNoRetry(message, { topic: '/topics/global' }, function (err, result) {
    if(err) console.error(err);
    else    console.log(result);
});
*/

function filterExpiredPushTokens(query) {
    return query.where('pushtokens.expires', '<', time.nowInUtc());
}

module.exports = {
    platformMap: platformMap,
    filterExpiredPushTokens: filterExpiredPushTokens,
    Notifications: Notifications
};
