var cluster = require('cluster'),
    numCPUs = require('os').cpus().length;

if (process.env.WORKERS) {
    if (process.env.WORKERS == 'auto') {
        workers = numCPUs;
    } else {
        workers = parseInt(process.env.WORKERS);
    }
} else {
    workers = 0;
}

module.exports = {
    workers: workers,
    master: cluster.isMaster
};
