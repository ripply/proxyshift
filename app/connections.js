var _ = require('underscore');
var rabbit = require('wascally');
var EventEmitter = require('events').EventEmitter;

const JOB_EXCHANGE = 'job-requests-x';
const DEAD_LETTER_EXCHANGE = 'dead-letter-exchange-x';

const EMAIL_QUEUE = 'jobs-email-q';
const NOTIFICATION_QUEUE = 'jobs-notification-q';
const NEW_SHIFT_QUEUE = 'jobs-new_shifts-q';
const NEW_SHIFT_APPLICATION_QUEUE = 'jobs-new_shift_application-q';
const NEW_SHIFT_APPLICATION_WAIT_QUEUE = 'jobs-wait-new_shift_application-q';

function Connector(rabbitUrl) {
    EventEmitter.call(this);

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
                type: 'fanout',
                autoDelete: false,
                durable: true,
            },
            {
                name: DEAD_LETTER_EXCHANGE,
                type: 'direct',
                autoDelete: false,
                durable: true
            },
        ],
        queues: [
            {
                name: EMAIL_QUEUE,
                autoDelete: true,
                durable: true,
                subscribe: true
            },
            {
                name: NOTIFICATION_QUEUE,
                autoDelete: true,
                durable: true,
                subscribe: true
            },
            {
                name: NEW_SHIFT_QUEUE,
                autoDelete: true,
                durable: true,
                subscribe: true
            },
            {
                name: NEW_SHIFT_APPLICATION_QUEUE,
                autoDelete: true,
                durable: true,
                subscribe: true
            },
            {
                name: NEW_SHIFT_APPLICATION_WAIT_QUEUE,
                autoDelete: true,
                durable: true,
                subscribe: false,
                deadLetter: DEAD_LETTER_EXCHANGE,
                messageTtl: 10 * 1000 // 10 seconds
            },
        ],
        bindings: [
            {
                exchange: JOB_EXCHANGE,
                target: EMAIL_QUEUE,
            },
            {
                exchange: JOB_EXCHANGE,
                target: NOTIFICATION_QUEUE,
            },
            {
                exchange: JOB_EXCHANGE,
                target: NEW_SHIFT_QUEUE,
            },
            {
                exchange: JOB_EXCHANGE,
                target: NEW_SHIFT_APPLICATION_QUEUE,
            },
            {
                exchange: JOB_EXCHANGE,
                target: NEW_SHIFT_APPLICATION_WAIT_QUEUE
            }
        ]
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
    JOB_EXCHANGE: JOB_EXCHANGE,
    DEAD_LETTER_EXCHANGE: DEAD_LETTER_EXCHANGE,
    EMAIL_QUEUE: EMAIL_QUEUE,
    NOTIFICATION_QUEUE: NOTIFICATION_QUEUE,
    NEW_SHIFT_QUEUE: NEW_SHIFT_QUEUE,
    NEW_SHIFT_APPLICATION_QUEUE: NEW_SHIFT_APPLICATION_QUEUE,
    NEW_SHIFT_APPLICATION_WAIT_QUEUE: NEW_SHIFT_APPLICATION_WAIT_QUEUE
};
