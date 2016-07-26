var config = require('config');
var moment = require('moment');
var cluster = require('cluster');
var _ = require('underscore');
var Slack = require('node-slack');
var SlackBot = require('slackbots');
var slack;

if (config.has('slack.webhook')) {
    var url = config.get('slack.webhook');
    if (url && url.length > 0) {
        slack = new Slack(url);
    }
}

var username = 'server';
var botConfig = {
    name: username
};


_.each({
    'slack.bot.token': 'token',
    'slack.bot.name': 'name',
    'slack.bot.channel.election': 'channel_election',
    'slack.bot.channel.control': 'channel_control'
}, function(value, key) {
    if (config.has(key)) {
        botConfig[value] = config.get(key);
    }
});

var bot;
const ELECTION_START = "WHO IZ LDR??";
const ELECTION_CLEAR = "LEEDR SUCKS!!";
const ELECTION_CURRENT_LEADER = "I AM LEEDR!";
const ELECTION_WON = "I OWN ALL NOW!!! haha";
const ELECTION_LENGTH = 1 * 10 * 1000;
const ELECTION_MIN_VOTE_WAIT = 1;
var startElectionRetryTimeout;
var electionToken;
var electionTimeout;
var electionVoteTimeout;
var currentlyElectedLeader = false;

var channels = {};

var BOT_ACTIONS = {};
BOT_ACTIONS[ELECTION_START] = function otherBotStartedElection() {
    if (currentlyElectedLeader) {
        bot.postMessageToChannel(botConfig.channel_election, wrapToken(ELECTION_CURRENT_LEADER), {})
            .then(function successfullyAssertedCurrentLeader() {
                // do nothing
            })
            .catch(function failedToAssetCurrentLeader(err) {
                console.log("Issue asserting that I am the currently elected bot leader, giving it up");
                // giveup, let the other bot be the leader
            });
    } else {
        // try to see if we can become the leader
        console.log('Trying to vote in election');
        voteInElection();
    }
};

BOT_ACTIONS[ELECTION_CLEAR] = function otherBotClearedElection() {
    voteInElection();
};

BOT_ACTIONS[ELECTION_WON] = function otherBotWonElection() {
    currentlyElectedLeader = false;
    if (electionVoteTimeout !== undefined) {
        clearTimeout(electionVoteTimeout);
        electionVoteTimeout = undefined;
    }
    if (electionTimeout !== undefined) {
        clearTimeout(electionTimeout);
        electionTimeout = undefined;
    }
    if (startElectionRetryTimeout !== undefined) {
        clearTimeout(startElectionRetryTimeout);
        startElectionRetryTimeout = undefined;
    }
};

function voteInElection() {
    currentlyElectedLeader = false;
    electionVoteTimeout = setTimeout(function castingElectionVote() {
            electionWon();
        }, Math.random() * (((ELECTION_LENGTH - 1) - ELECTION_MIN_VOTE_WAIT) + ELECTION_MIN_VOTE_WAIT)
    );
}

const ACTION_PING = 'ping';
const ACTION_INVITE_COMPANY = 'invite';
const RESPONSE_PONG = 'PONG';
const RESPONSE_LEADER = ELECTION_CURRENT_LEADER;

var USER_ACTIONS = {};
USER_ACTIONS[ACTION_PING] = function userRequestedPing(message) {
    var response = RESPONSE_PONG;
    if (currentlyElectedLeader) {
        response = RESPONSE_LEADER;
    }
    bot.postMessageToChannel(message.channelName, wrapToken(response), {});
};

USER_ACTIONS[ACTION_INVITE_COMPANY] = function userInviteCompany(message, splitMessage) {
    if (module.exports.appLogic && currentlyElectedLeader) {
        console.log("Sending group creation invitation email");
        if (splitMessage.length > 2) {
            var emailMessage = '';
            if (splitMessage.length > 3) {
                emailMessage = splitMessage.slice(2, splitMessage.length).join(' ');
            }
            module.exports.appLogic.inviteUserToCreateCompany(splitMessage[1], emailMessage);
        }
    }
};

if (botConfig.token) {
    console.log("Slackbot configured, starting...");
    bot = new SlackBot(botConfig);
    bot.on('start', function slackbotStart() {
        console.log("slackbot connected.");
        getChannels(startElection);
    });
    bot.on('message', function slackbotMessageReceived(message) {
        if (channels.hasOwnProperty(message.channel)) {
            message.channelName = channels[message.channel];
        }
        if (message.type == 'message') {
            if (message.channelName == botConfig.channel_election) {
                if (message.user == bot.name) {
                    if (didISendThisMessage(message)) {
                        // ignore
                    } else if (BOT_ACTIONS.hasOwnProperty(message.text)) {
                        BOT_ACTIONS[message.text]();
                    } else {
                        console.log("Unknown message from fellow bot: '" + message.text + "'");
                    }
                }
            } else if (message.channelName == botConfig.channel_control) {
                var messages = message.text.split(' ');
                var lowerCasedText = messages[0].toLowerCase();
                console.log(lowerCasedText);
                if (USER_ACTIONS.hasOwnProperty(lowerCasedText)) {
                    console.log(":YE");
                    try {
                        USER_ACTIONS[lowerCasedText](message, messages);
                    } catch (err) {
                        bot.postMessageToChannel(message.channelName, 'ERROR', {});
                        module.error(undefined, err, 'Failed to process command: ' + message.text);
                    }
                } else {
                    console.log("Unknown command");
                }
            } else {
                // don't leak slack convos to logs
            }
        } else {
            // not handling this event
        }
    });
} else {
    console.log("Slackbot is not configured.");
}

function getChannels(next) {
    console.log("slackbot fetching channels.");
    bot.getChannels()
        .then(function successfullyGotChannels(message) {
            if (message.hasOwnProperty('channels')) {
                channels = {};
                _.each(message.channels, function (channel) {
                    channels[channel.id] = channel.name;
                });
            }
            next();
        })
        .catch(function failedToGetChannels(err) {
            setTimeout(function retryingGetChannels() {
                getChannels(next);
            }, ELECTION_LENGTH / 4);
        });
}

function runWhenElectionOver(next) {
    if (electionTimeout !== undefined) {
        clearTimeout(electionTimeout);
    }
    electionTimeout = setTimeout(next, ELECTION_LENGTH);
}

function clearElectionRetryTimeout() {
    if (startElectionRetryTimeout !== undefined) {
        clearTimeout(startElectionRetryTimeout);
        startElectionRetryTimeout = undefined;
    }
}

function electionWon() {
    bot.postMessageToChannel(botConfig.channel_election, wrapToken(ELECTION_WON), {})
        .then(function electionWonMessageSent() {
            currentlyElectedLeader = true;
        })
        .catch(function electionWonMessageFail(err) {
            setTimeout(function retryElectionWonMessage() {
                electionWon();
            }, ELECTION_LENGTH / 2);
        });
}

function startElection() {
    electionToken = generateUniqueToken();
    console.log("Trying to start election");
    bot.postMessageToChannel(botConfig.channel_election, wrapToken(ELECTION_START), {})
        .then(function successfullyStartedElection() {
            clearElectionRetryTimeout();
            runWhenElectionOver(electionWon);
        })
        .catch(function failedToStartElection(err) {
            console.log("Failed to start election: " + JSON.stringify(err));
            startElectionRetryTimeout = setTimeout(function retryElection() {
                    startElection();
                },
                ELECTION_LENGTH * 4
            );

        });
}

function didISendThisMessage(message) {
    return (message.user == botConfig.name &&
            message.indexOf(electionToken) !== -1);
}

function wrapToken(message) {
    return electionToken + ': ' + message;
}

const UNIQUE_TOKEN_LOW = 1;
const UNIQUE_TOKEN_HIGH = UNIQUE_TOKEN_LOW * 10000000000;

function generateUniqueToken() {
    var asdf = '' + Math.floor(Math.random() * (UNIQUE_TOKEN_HIGH - UNIQUE_TOKEN_LOW + 1) + UNIQUE_TOKEN_LOW);
    console.log("TOKEN = " + asdf);
    return asdf;
}

function printError(message, err) {
    if (err) {
        console.log(err.stack ? err.stack : err);
    } else {
        console.log(message);
    }
}

module.exports = {
    error: function(req, message, err) {
        if (slack) {
            if (err === undefined || err === null) {
                try {
                    throw new Error('No stack trace specified, getting stack trace.');
                } catch (e) {
                    err = e;
                }
            }
            printError(message, err);
            return slack.send({
                text: prefixCluster(
                    message + "\nip: " + (req ? req.ip : 'undefined') + "\nroute: " + (req ? req.originalUrl : 'undefined') +
                    "\nreq.body = " + JSON.stringify(req ? stripSensitiveData(req.body) : 'undefined') +
                    "\nuserid: " + (req ? (req.user ? req.user.id:'none') : 'undefined') +
                    (err ?
                        (err.stack ? ("\nstack trace:\n -" + JSON.stringify(err.stack).replace(/\\n/g, '\n -')):'\nno stacktrace') :
                        '\nstack trace: No stack given')
                ),
                channel: '#crashes',
                username: username
            });
        } else {
            printError(message, err);
        }
    },
    alert: function(message, err) {
        if (slack) {
            printError(message, err);
            return slack.send({
                text: prefixCluster(message + stringify("\n", prettifyError(err))),
                channel: "#alerts",
                username: username
            })
        } else {
            printError(message, err);
        }
    },
    serious: function(message, err) {
        if (slack) {
            printError(message, err);
            return slack.send({
                text: prefixCluster(message + stringify("\n", prettifyError(err))),
                channel: "#alerts",
                username: username
            });
        } else {
            printError(message, err);
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
    return err ? (err.stack ? ("\nstack trace:\n -" + JSON.stringify(err.stack).replace(/\\n/g, '\n -')):stringify('\n', JSON.stringify(err))):'';
}

function prefixCluster(message) {
    return whichCluster() + ': ' + message;
}

function whichCluster() {
    return cluster.isMaster ?
        'master' : 'worker#' + cluster.worker.id;
}

function stripSensitiveData(body) {
    if (body && body.password) {
        body.password = '******';
    }
    if (body && body.sanswer) {
        body.sanswer = '*****';
    }
    return body;
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
