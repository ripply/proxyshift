var models = require('../../app/models');
var ROOT_DIR = global.ROOT_DIR;
var app = global.app;
var request = global.request;
var settings = {auth: true};
var Promise = require('bluebird');
var ready = models.onDatabaseReady;
var expect = global.expect;
var login = require('../common').login;
var logout = require('../common').logout;
var moment = require('moment');
var _ = require('underscore');

var time = require('../../app/time');

var debug = global.debug;
var parse = global.parse;

describe('#/utc', function() {

    before(function (done) {
        require(ROOT_DIR + '/routes/preauth')(app, settings);
        require(ROOT_DIR + '/routes/misc/auth')(app, settings);
        done();
    });

    beforeEach(function (done) {
        global.sess = new global.Session();

        // Done to prevent any server side console logs from the routes
        // to appear on the console when running tests
        //console.log=function(){};
        // should not be hitting the database
        /*
        global.setFixtures(global.fixtures.base)
            .then(done);
            */
        done();
    });

    afterEach(function () {
        global.sess.destroy();
    });

    function getCurrentUtc() {
        return new moment().unix();
    }

    describe('- GET', function() {

        it('- returns current server utc time', function(done) {

            request(app)
                .get('/api/utc')
                .expect(200, function(err, res) {
                    if (err) {
                        debug(res.text);
                        done(err);
                    } else {
                        try {
                            var serverUtcTime = parseInt(res.text);
                            expect(isNaN(serverUtcTime)).to.be.false;
                            var currentUtc = getCurrentUtc();
                            expect(Math.abs(currentUtc - serverUtcTime)).to.be.below(10);
                            done();
                        } catch (err) {
                            done(err);
                        }
                    }
                });

        });

    });

    describe('- POST', function() {

        it('- returns 200 and server time if client time is close to server time', function(done) {

            var currentUtc = getCurrentUtc();

            request(app)
                .post('/api/utc')
                .send('' + currentUtc)
                .expect(200, function(err, res) {
                    if (err) {
                        debug(res.text);
                        done(err);
                    } else {
                        try {
                            var serverUtcTime = parseInt(res.text);
                            expect(isNaN(serverUtcTime)).to.be.false;
                            expect(Math.abs(currentUtc - serverUtcTime)).to.be.below(10);
                            done();
                        } catch (err) {
                            done(err);
                        }
                    }
                });

        });

        it('- returns 403 and server time if client time is too old', function(done) {

            var currentUtc = getCurrentUtc();

            var deltaTime = time.deltaDifferenceThreshold * 2;

            request(app)
                .post('/api/utc')
                .send('' + (currentUtc + deltaTime))
                .expect(403, function(err, res) {
                    if (err) {
                        debug(res.text);
                        done(err);
                    } else {
                        try {
                            var serverUtcTime = parseInt(res.text);
                            expect(isNaN(serverUtcTime)).to.be.false;
                            expect(Math.abs(currentUtc - serverUtcTime)).to.be.below(10);
                            done();
                        } catch (err) {
                            done(err);
                        }
                    }
                });

        });

        it('- returns 403 and server time if client time is too new', function(done) {

            var currentUtc = getCurrentUtc();

            var deltaTime = time.deltaDifferenceThreshold * 2;

            request(app)
                .post('/api/utc')
                .send('' + (currentUtc - deltaTime))
                .expect(403, function(err, res) {
                    if (err) {
                        debug(res.text);
                        done(err);
                    } else {
                        try {
                            var serverUtcTime = parseInt(res.text);
                            expect(isNaN(serverUtcTime)).to.be.false;
                            expect(Math.abs(currentUtc - serverUtcTime)).to.be.below(10);
                            done();
                        } catch (err) {
                            done(err);
                        }
                    }
                });

        });

        it('- returns 400 and server time if non integer is sent', function(done) {

            var currentUtc = getCurrentUtc();

            request(app)
                .post('/api/utc')
                .send('noninteger')
                .expect(400, function(err, res) {
                    if (err) {
                        debug(res.text);
                        done(err);
                    } else {
                        try {
                            var serverUtcTime = parseInt(res.text);
                            expect(isNaN(serverUtcTime)).to.be.false;
                            expect(Math.abs(currentUtc - serverUtcTime)).to.be.below(10);
                            done();
                        } catch (err) {
                            done(err);
                        }
                    }
                });

        });

        it('- returns 400 and server time on empty request', function(done) {

            var currentUtc = getCurrentUtc();

            request(app)
                .post('/api/utc')
                .expect(400, function(err, res) {
                    if (err) {
                        debug(res.text);
                        done(err);
                    } else {
                        try {
                            var serverUtcTime = parseInt(res.text);
                            expect(isNaN(serverUtcTime)).to.be.false;
                            expect(Math.abs(currentUtc - serverUtcTime)).to.be.below(10);
                            done();
                        } catch (err) {
                            done(err);
                        }
                    }
                });

        });

    });

});
