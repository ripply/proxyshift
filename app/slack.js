var config = require('config');
var Slack = require('node-slack');
var slack;

if (config.has('slack.webhook')) {
    var url = config.get('slack.webhook');
    slack = new Slack(url);
}

var username = 'server';

module.exports = {
    error: function(req, message, err) {
        if (slack) {
            slack.send({
                text: message + "\nroute: " + req.originalUrl +
                "\nreq.body = " + JSON.stringify(req.body) +
                "\nuserid: " + (req.user ? req.user.id:'none') +
                (err.stack ? ("\nstack trace:" + JSON.stringify(err.stack)):'\nno stacktrace'),
                channel: '#alerts',
                username: username
            });
        }
    },
    alert: function(message, err) {
        if (slack) {
            slack.send({
                text: message + "\n" + JSON.stringify(err),
                channel: "#alerts",
                username: username
            })
        }
    },
    serious: function(message, err) {
        if (slack) {
            slack.send({
                text: message + "\n" + JSON.stringify(err),
                channel: "#alerts",
                username: username
            });
        }
    },
    info: function(message) {
        send({
            channel: '#server',
            text: message,
            username: username
        });
    },
    send: send
};

function send(message) {
    if (slack) {
        console.log("Trying to send message...");
        slack.send(message);
    }
}
