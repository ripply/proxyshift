var Promise = require('bluebird');
var EventEmitter = require('events').EventEmitter;
var models = require('./models');
var config = require('config');
var mailer = require('./mailer');

var connections = require('./connections');

var EMAIL_QUEUE = 'jobs.email';
var NOTIFICATION_QUEUE = 'jobs.notification';

function App() {
    EventEmitter.call(this);

    this.config = config;
    this.models = models;
    this.ready = false;
    if (config.has('rabbit.url')) {
        this.connections = connections(config.get('rabbit.url'));
        this.connections.once('ready', this.onConnected.bind(this));
        this.connections.once('lost', this.onLost.bind(this));
    } else {
        console.log("RabbitMQ not configured, will not use a message broker for emails/notifications, set CLOUDAMQP_URL");
        this.onReady();
    }
}

App.prototype = Object.create(EventEmitter.prototype);

App.prototype.onConnected = function() {
    this.connections.email = this.connections.queue.default().queue({name: EMAIL_QUEUE});// , { prefetch: 5 }, onCreate.bind(this));
    this.connections.notifications = this.connections.queue.default().queue({name: NOTIFICATION_QUEUE});
    this.onReady();
};

App.prototype.onReady = function() {
    //logger.log({ type: 'info', msg: 'app.ready' });
    this.ready = true;
    this.emit('ready');
};

App.prototype.onLost = function() {
    //logger.log({ type: 'info', msg: 'app.lost' });
    this.emit('lost');
};

App.prototype.startHandlingEmails = function() {
    if (this.connections) {
        console.log("Started handling emails from RabbitMQ");
        this.connections.email.consume(this.handleEmailJob.bind(this));
    } else {
        console.log("Not handling emails from RabbitMQ as it is not configured");
    }
    return this;
};

App.prototype.createTokenUrl = function(base, token) {
    var url = 'http://localhost';
    if (config.has('web.url')) {
        url = config.get('web.url');
    } else {
        console.log("NOTICE: WEB_URL env variable is not set to server address, verification emails will be sent with " + url);
    }

    return url + base + "?token=" + token;
};

App.prototype.notifyGroupPromoted = function(user_id, inviter_user, group_id) {
    // TODO:
    console.log("PROMOTEDD");
};

App.prototype.sendInviteEmail = function(token, to, inviter_user, message) {
    var inviteUrl = this.createTokenUrl("/accept", token);
    this.sendEmail('thamer@proxyshift.com', to, 'Company invitation', inviteUrl, '<a href="' + inviteUrl + '">' + inviteUrl + '</a>')
};

App.prototype.sendVerifyEmail = function(token, to, name) {
    var verifyUrl = this.createTokenUrl("/emailverify", token);
    this.sendEmail('thamer@proxyshift.com', to, 'Verify your email', verifyUrl, '<a href="' + verifyUrl + '">' + verifyUrl + '</a>')
};

App.prototype.sendEmail = function(from, to, subject, text, html) {
    if (to === null || to === undefined) {
        throw new Error("Email recipient required (not specified)");
    }
    var email = {
        from: from,
        to: to,
        subject: subject,
        text: text,
        html: html
    };

    if (!this.connections) {
        console.log("RabbitMQ not configured, sending email now in web process");
        this.handleEmailJob(email, function noop() {});
    } else {
        console.log("Sending email to queue...");
        console.log(email);

        this.connections.queue.default().publish(email, {key: EMAIL_QUEUE});
    }
};

App.prototype.handleEmailJob = function(job, ack) {
    console.log("GOT EMAIL JOB");
    console.log(job);
    mailer.sendMail(job, function sendMailCallback(error, info) {
        ack();
        if (error) {
            console.log("error");
            console.log(error);
        } else {
            console.log("Mail successfully sent: " + info.response);
        }
    });
};

module.exports = new App();
