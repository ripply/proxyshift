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
    if (config.has('rabbit.url')) {
        this.connections = connections(config.get('rabbit.url'));
        this.connections.once('ready', this.onConnected.bind(this));
        this.connections.once('lost', this.onLost.bind(this));
    } else {
        console.log("RabbitMQ not configured, will not send emails");
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
    this.emit('ready');
};

App.prototype.onLost = function() {
    //logger.log({ type: 'info', msg: 'app.lost' });
    this.emit('lost');
};

App.prototype.startHandlingEmails = function() {
    this.connections.email.consume(this.handleEmailJob.bind(this));
    return this;
};

App.prototype.sendEmail = function(from, to, subject, text, html) {
    if (!this.connections) {
        console.log("Cannot send email, RabbitMQ server is not defined");
        return;
    }
    console.log("Sending email...");
    this.connections.queue.default().publish({
        from: from,
        to: to,
        subject: subject,
        text: text,
        html: html
    }, {key: EMAIL_QUEUE});
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
