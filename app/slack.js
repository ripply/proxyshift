var config = require('config');
var moment = require('moment');
var cluster = require('cluster');
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
                text: prefixCluster(
                    message + "\nroute: " + req.originalUrl +
                    "\nreq.body = " + JSON.stringify(req.body) +
                    "\nuserid: " + (req.user ? req.user.id:'none') +
                    (err.stack ? ("\nstack trace:\n -" + JSON.stringify(err.stack).replace(/\\n/g, '\n -')):'\nno stacktrace')
                ),
                channel: '#crashes',
                username: username
            });
        }
    },
    alert: function(message, err) {
        if (slack) {
            return slack.send({
                text: prefixCluster(message + stringify("\n", prettifyError(err))),
                channel: "#alerts",
                username: username
            })
        }
    },
    serious: function(message, err) {
        if (slack) {
            return slack.send({
                text: prefixCluster(message + stringify("\n", prettifyError(err))),
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
            text: prefixCluster(message),
            username: username
        });
    },
    send: send
};

function stringify(prefix, object) {
    if (object) {
        return prefix + object;
    } else {
        return '';
    }
}

function prettifyError(err) {
    return (err.stack ? ("\nstack trace:\n -" + JSON.stringify(err.stack).replace(/\\n/g, '\n -')):stringify('\n', JSON.stringify(err)));
}

function prefixCluster(message) {
    return whichCluster() + ': ' + message;
}

function whichCluster() {
    return cluster.isMaster ?
        'master' : 'worker#' + cluster.worker.id;
}

function send(message) {
    if (slack && message) {
        if (message.text) {
            message.text = moment().format() + ': ' + message.text;
            console.log(message);
        }
        return slack.send(message);
    }
}
