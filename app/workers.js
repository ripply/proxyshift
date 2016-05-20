var cluster = require('cluster');

if (process.env.WORKERS) {
    workers = parseInt(process.env.WORKERS);
} else {
    workers = 1;
}

module.exports = {
    workers: workers,
    master: cluster.isMaster
};
