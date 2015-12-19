var models = require('../../app/models');
var ROOT_DIR = global.ROOT_DIR;
var app = global.app;
var request = global.request;
var settings = {auth: true};
var Promise = require('bluebird');
var ready = models.onDatabaseReady;
var expect = global.expect;
var login = require('../common').login;
var _ = require('underscore');
var debug = global.debug;
var parse = global.parse;

if (process.env.LOAD_FIXTURES !== undefined && process.env.LOAD_FIXTURES == 'true') {
    describe('#Load fixtures', function() {
        it.only('Loading fixtures', function(done) {
            return global.setFixtures(global.fixtures.base)
                .then(done);
        })
    });
}
