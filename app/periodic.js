var timers = require('timers'),
    config = require('config'),
    models = require('./models');

var interval = 60 * 60 * 1000; // 1 hour
if (config.has('periodic.interval')) {
    interval = parseFloat(config.get('periodic.interval'));
}

function PeriodicEvents() {
    this.running = false;
}

PeriodicEvents.prototype.start = function() {
    if (this.running) {
        return;
    }
    this.timer = timers.setInterval(function pruneDatabaseEverySoOften() {
            // purges expired session tokens and notifies user
            console.log("Pruning expired tokens");
            models.purgeExpiredTokens();
        },
        interval
    );

    this.running = true;
    this.timer.unref();
};

PeriodicEvents.prototype.stop = function() {
    if (!this.running) {
        timers.clearInterval(this.timer);
        delete this.timer;
        this.running = false;
    }
};

module.exports = {
    PeriodicEvents: PeriodicEvents
};
