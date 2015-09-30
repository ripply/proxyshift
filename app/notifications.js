var config = require('config');
var apiKeys = {};

if (config.has('push.gcm.serverapikey')) {
    apiKeys['gcm'] = config.get('push.gcm.serverapikey');
}

var gcm = require('node-gcm');

function test() {
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
}
/*
// Send to a topic, with no retry this time
sender.sendNoRetry(message, { topic: '/topics/global' }, function (err, result) {
    if(err) console.error(err);
    else    console.log(result);
});
*/
module.exports = {
    test: test
};
