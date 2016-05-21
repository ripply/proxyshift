var _ = require('underscore');
var rabbit = require('wascally');
var cluster = require('cluster');
var workers = require('./workers');
var EventEmitter = require('events').EventEmitter;

const JOB_EXCHANGE = 'job-requests-x';
const DELAYED_JOB_EXCHANGE = 'delayed-job-exchange-x';

const JOB_ROUTING_KEY = 'job-rk';
const DEAD_LETTER_ROUTING_KEY = 'dl-rk';

const EMAIL_QUEUE = 'jobs-email-q';
const EMAIL_KEY = 'email';
const NOTIFICATION_QUEUE = 'jobs-notification-q';
const NOTIFICATION_KEY = 'notification';
const NEW_SHIFT_QUEUE = 'jobs-new_shifts-q';
const NEW_SHIFT_KEY = 'new_shifts';
const NEW_SHIFT_APPLICATION_QUEUE = 'jobs-new-shift-application-q';
const NEW_SHIFT_APPLICATION_KEY = 'new_shift_application';
const NEW_DELAYED_SHIFT_APPLICATION_QUEUE = 'jobs-delayed-new-shift-application-q';
const NEW_DELAYED_SHIFT_APPLICATION_KEY = 'delayed_new_shift_application';

function Connector(rabbitUrl) {
    EventEmitter.call(this);

    var subscribe = true;
    if (cluster.isMaster) {
        // master only subscribes to events if there are no workers
        subscribe = workers.workers == 0;
    } else {
        // workers, always subscribe to events
        subscribe = true;
    }

    if (subscribe) {
        console.log('Subscribing to rabbit events in this thread');
    } else {
        console.log('Not subscribing to rabbit events in this thread');
    }

    var self = this;
    var readyCount = 0;

    console.log("Connecting to RabbitMQ server...");
    var re = /([^:]*:\/\/)([^:]*):([^@]*)@([^:]*)(:(\d*))?\/(.*)/;
    var match;

    var rabbitConnection = {};

    if ((match = re.exec(rabbitUrl)) !== null) {
        // defaults to aqmp://
        rabbitConnection.prototol = match[1];
        // defaults to guest
        rabbitConnection.user = match[2];
        // defaults to guest
        rabbitConnection.pass = match[3];
        // defaults to localhost
        rabbitConnection.server = [match[4]];
        // defaults to 5672
        rabbitConnection.port = match[6];
        rabbitConnection.vhost = match[7];
    }

    rabbitConnection = _.omit(rabbitConnection, function(value, key, object) {
        return value === null || value === undefined;
    });

    this.connection = rabbit.configure({
        connection: rabbitConnection,
        exchanges: [
            {
                name: JOB_EXCHANGE,
                type: 'direct',
                autoDelete: false,
                durable: true,
            },
            {
                name: DELAYED_JOB_EXCHANGE,
                type: 'direct',
                autoDelete: false,
                durable: true,
            },
        ],
        queues: [
            {
                name: EMAIL_QUEUE,
                //durable: true,
                subscribe: subscribe
            },
            {
                name: NOTIFICATION_QUEUE,
                //durable: true,
                subscribe: subscribe
            },
            {
                name: NEW_SHIFT_QUEUE,
                //durable: true,
                subscribe: subscribe
            },
            {
                name: NEW_SHIFT_APPLICATION_QUEUE,
                //durable: true,
                subscribe: subscribe
            },
            {
                name: NEW_DELAYED_SHIFT_APPLICATION_QUEUE,
                //durable: true,
                subscribe: subscribe,
                //deadLetter: JOB_EXCHANGE,
                //messageTtl: 10 * 1000 // 10 seconds
            },
        ],
        bindings: [
            {
                exchange: JOB_EXCHANGE,
                target: EMAIL_QUEUE,
                keys: EMAIL_KEY,
            },
            {
                exchange: JOB_EXCHANGE,
                target: NOTIFICATION_QUEUE,
                keys: NOTIFICATION_KEY,
            },
            {
                exchange: JOB_EXCHANGE,
                target: NEW_SHIFT_QUEUE,
                keys: NEW_SHIFT_KEY,
            },
            {
                exchange: JOB_EXCHANGE,
                target: NEW_SHIFT_APPLICATION_QUEUE,
                keys: NEW_SHIFT_APPLICATION_KEY
            },
            {
                exchange: JOB_EXCHANGE,
                target: NEW_SHIFT_APPLICATION_QUEUE,
                keys: NEW_DELAYED_SHIFT_APPLICATION_KEY
            },
            {
                exchange: DELAYED_JOB_EXCHANGE,
                target: NEW_DELAYED_SHIFT_APPLICATION_QUEUE,
                keys: NEW_DELAYED_SHIFT_APPLICATION_KEY
            },
        ]
    })
        .catch(function(err) {
            self.emit('fail', err);
        })
        .done(function() {
            console.log('Connected to RabbitMQ: ' + rabbitConnection.server + '/' + rabbitConnection.vhost);
            self.emit('ready');
        });

    function ready() {
        self.emit('ready');
    }

    function lost() {
        self.emit('lost');
    }
}

Connector.prototype = Object.create(EventEmitter.prototype);

module.exports = {
    topology: function(rabbitUrl) {
        return new Connector(rabbitUrl);
    },
    publish: rabbit.publish,
    handle: rabbit.handle,
    startSubscription: rabbit.startSubscription,
    JOB_EXCHANGE: JOB_EXCHANGE,
    DELAYED_JOB_EXCHANGE: DELAYED_JOB_EXCHANGE,
    EMAIL_QUEUE: EMAIL_QUEUE,
    EMAIL_KEY: EMAIL_KEY,
    NOTIFICATION_QUEUE: NOTIFICATION_QUEUE,
    NOTIFICATION_KEY: NOTIFICATION_KEY,
    NEW_SHIFT_QUEUE: NEW_SHIFT_QUEUE,
    NEW_SHIFT_KEY: NEW_SHIFT_KEY,
    NEW_SHIFT_APPLICATION_QUEUE: NEW_SHIFT_APPLICATION_QUEUE,
    NEW_SHIFT_APPLICATION_KEY: NEW_SHIFT_APPLICATION_KEY,
    NEW_DELAYED_SHIFT_APPLICATION_QUEUE: NEW_DELAYED_SHIFT_APPLICATION_QUEUE,
    NEW_DELAYED_SHIFT_APPLICATION_KEY: NEW_DELAYED_SHIFT_APPLICATION_KEY,
    JOB_ROUTING_KEY: JOB_ROUTING_KEY,
    DEAD_LETTER_ROUTING_KEY: DEAD_LETTER_ROUTING_KEY
};
