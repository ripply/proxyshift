module.exports.initialize = function(app) {
    return require('../routes')(app, {
        auth: true
    });
};
