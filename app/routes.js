var home = require('../controllers/home'),
    shifts = require('../controllers/shifts'),
    users = require('../controllers/users'),
    groups = require('../controllers/groups'),
    categories = require('../controllers/categories'),
    _ = require('underscore'),
    utils = require('./utils'),
    models = require('./models');

module.exports.initialize = function(app) {
    return require('../routes')(app, {
        auth: true
    });
};
