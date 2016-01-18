var jackrabbit = require('jackrabbit');
var EventEmitter = require('events').EventEmitter;

function Connector(rabbitUrl) {
    EventEmitter.call(this);

    var self = this;
    var readyCount = 0;

    console.log("Connecting to RabbitMQ server...");
    this.queue = jackrabbit(rabbitUrl)
        .on('connected', function() {
            console.log("Successfully connected to RabbitMQ server");
            //logger.log({ type: 'info', msg: 'connected', service: 'rabbitmq' });
            ready();
        })
        .on('error', function(err) {
            console.log("Failed to connect to RabbitMQ server");
            //logger.log({ type: 'error', msg: err, service: 'rabbitmq' });
        })
        .on('disconnected', function() {
            console.log("Disconnected from RabbitMQ server");
            //logger.log({ type: 'error', msg: 'disconnected', service: 'rabbitmq' });
            lost();
        });

    function ready() {
        //if (++readyCount === 2) {
            self.emit('ready');
        //}
    }

    function lost() {
        self.emit('lost');
    }
}

Connector.prototype = Object.create(EventEmitter.prototype);

module.exports = function(rabbitUrl) {
    return new Connector(rabbitUrl);
};
