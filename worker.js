//var http = require('http');
//var logger = require('logfmt');
var throng = require('throng');

var config = require('config');

var workerCount = 1;
if (config.has('rabbit.workers')) {
    workerCount = config.get('rabbit.workers');
}
throng(start, {workers: workerCount});

function start() {
    var instance = require('./app');
    /*
    logger.log({
        type: 'info',
        msg: 'starting worker',
        concurrency: config.concurrency
    });
    */

    instance.on('ready', beginWork);
    process.on('SIGTERM', shutdown);

    function beginWork() {
        console.log("Started handling emails");
        instance.on('lost', shutdown);
        instance.init();
    }

    function shutdown() {
        console.log("Shutting down");
        //logger.log({type: 'info', msg: 'shutting down'});
        process.exit();
    }
}
