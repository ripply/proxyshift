var config = require('config'),
    gcm = require('node-gcm'),
    apn = require('apn');
var apiKeys = {};
var apnConfig = {};

if (config.has('push.gcm.serverapikey')) {
    apiKeys['gcm'] = config.get('push.gcm.serverapikey');
}
if (config.has('push.apn.cert')) {
    apnConfig['cert'] = config.get('push.apn.cert');
}
if (config.has('push.apn.key')) {
    apnConfig['key'] = config.get('push.apn.key');
}

var apnConnection = new apn.Connection(apnConfig);
// https://cordova.apache.org/docs/en/3.0.0/cordova_device_device.md.html#device.platform
var platformMap = {
    'android': 1,
    'ios': 2,
    'wince': 3,
    'blackberry': 4,
    'tizen': 5
};
var services = {

};



function send(service, endpoint, message) {
    console.log("Trying apn...");
    var myDevice = new apn.Device("863974a9b8615f62a9af9c2a6f69a2e50bf9ceef8abd361bc84334e9c0e43eb7");
    var note = new apn.Notification();
    note.expiry = Math.floor(Date.now() / 1000) + 3600; // 1hr
    note.badge = 3;
    note.alert = "test";
    note.payload = {'message': 'HEY!'};
    apnConnection.pushNotification(note, myDevice);
    /*
    var message = new gcm.Message({
        contentAvailable: true,
        timeToLive: 3,
        data: {
            message: 'hey'
        },
        notification: {
            title: 'title!',
            body: 'body!'
        }
    });


    var regIds = ['APA91bFySW60DcD29ZJSlGqPftJ0LKxr7GNZbqcT-9_2s4ju2JyQB0_a2D-G4aiHWaWedduQsH7fADooD_8yuOutqmHi6CCyaZzlFEKoObVBafiY9ugx_Ymmg4Z6lGquH3k7_AKag3rZ'];

// Set up the sender with you API key
    var sender = new gcm.Sender(apiKeys.gcm);

// Now the sender can be used to send messages
    sender.send(message, {registrationIds: regIds}, function (err, result) {
        if (err) console.error(err);
        else    console.log(result);
    });
    */
}
/*
// Send to a topic, with no retry this time
sender.sendNoRetry(message, { topic: '/topics/global' }, function (err, result) {
    if(err) console.error(err);
    else    console.log(result);
});
*/
module.exports = {
    send: send,
    platformMap: platformMap
};
