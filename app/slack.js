var config = require('config');
var moment = require('moment');
var Slack = require('node-slack');
var slack;

if (config.has('slack.webhook')) {
    var url = config.get('slack.webhook');
    if (url && url.length > 0) {
        slack = new Slack(url);
    }
}

var username = 'server';

module.exports = {
    error: function(req, message, err) {
        if (slack) {
            return slack.send({
                text: message + "\nroute: " + req.originalUrl +
                "\nreq.body = " + JSON.stringify(req.body) +
                "\nuserid: " + (req.user ? req.user.id:'none') +
                (err.stack ? ("\nstack trace:\\n" + JSON.stringify(err.stack).replace(/\\n/g, '\n - ')):'\nno stacktrace'),
                channel: '#alerts',
                username: username
            });
        }
    },
    alert: function(message, err) {
        if (slack) {
            return slack.send({
                text: message + "\n" + JSON.stringify(err),
                channel: "#alerts",
                username: username
            })
        }
    },
    serious: function(message, err) {
        if (slack) {
            return slack.send({
                text: message + "\n" + JSON.stringify(err),
                channel: "#alerts",
                username: username
            });
        }
    },
    info: function(message, channel) {
        if (!channel) {
            channel = '#server';
        }
        return send({
            channel: channel,
            text: message,
            username: username
        });
    },
    send: send
};

function send(message) {
    if (slack && message) {
        if (message.text) {
            message.text = moment().format() + ': ' + message.text;
            console.log(message);
        }
        return slack.send(message);
    }
}
