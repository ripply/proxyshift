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

// TODO:
// GET /api/locations/:location_id/shifts
// GET /api/locations/:location_id/sublocations
// POST /api/locations/:location_id/sublocations

describe('#/api/groups', function() {

    before(function (done) {
        require(ROOT_DIR + '/routes/preauth')(app, settings);
        require(ROOT_DIR + '/routes/misc/auth')(app, settings);
        require(ROOT_DIR + '/routes/groups')(app, settings);
        done();
    });

    beforeEach(function (done) {
        global.sess = new global.Session();

        // Done to prevent any server side console logs from the routes
        // to appear on the console when running tests
        //console.log=function(){};
        return global.setFixtures(global.fixtures.base)
            .then(done);
    });

    afterEach(function () {
        expect(global.sess).to.not.be.undefined;
        global.sess.destroy();
    });

    describe('- GET', function() {

        describe('- /', function() {

            describe('- anonymous user', function () {

                it('- return 401', function (done) {

                    request(app)
                        .get('/api/locations')
                        .expect(401, done);

                });

            });

            describe('- non group member', function () {

                beforeEach(function (done) {

                    login('nongroupmember',
                        'secret',
                        done);

                });

                it('- get an empty list becuase they are not a part of a group', function (done) {

                    request(app)
                        .get('/api/locations')
                        .expect(200)
                        .end(function (err, res) {
                            try {
                                debug(res.text);
                                var data = JSON.parse(res.text);
                                data.should.be.a('array');
                                expect(data.length).to.equal(0);
                                done();
                            } catch (e) {
                                done(e);
                            }
                        });

                });

            });

            describe('- group member', function () {

                beforeEach(function (done) {

                    login('groupmember',
                        'secret',
                        done);

                });

                it('- get a list of locations attached to', function (done) {

                    request(app)
                        .get('/api/locations')
                        .expect(200)
                        .end(function (err, res) {
                            if (err) {
                                debug(res.text);
                                done(err);
                                return;
                            }
                            try {
                                debug(res.text);
                                var data = JSON.parse(res.text);
                                data.should.be.a('array');
                                expect(data.length).to.not.equal(0);
                                done();
                            } catch (e) {
                                done(e);
                            }
                        });

                });

            });

            describe('- group owner', function () {

                beforeEach(function (done) {

                    login('groupowner',
                        'secret',
                        done);

                });

                it('- get a list of locations attached to', function (done) {

                    request(app)
                        .get('/api/locations')
                        .expect(200)
                        .end(function (err, res) {
                            if (err) {
                                debug(res.text);
                                done(err);
                                return;
                            }
                            try {
                                debug(res.text);
                                var data = JSON.parse(res.text);
                                data.should.be.a('array');
                                expect(data.length).to.not.equal(0);
                                done();
                            } catch (e) {
                                done(e);
                            }
                        });

                });

            });

        });

        describe('- /:location_id/shifts/managing', function() {

            var properties = [
                'id',
                'user_id',
                'title',
                'description',
                'start',
                'end',
                'location_id',
            ];

            describe('- anonymous user', function() {

                it('- returns 401', function(done) {

                    request(app)
                        .get(parse('/api/locations/@locations:state:membershiptest:/shifts/managing'))
                        .expect(401, done);

                });

            });

            describe('- non manager but shift owner', function() {

                beforeEach(function(done) {

                    login('groupmember',
                        'secret',
                        done);

                });

                it('- returns 200 empty response', function(done) {

                    request(app)
                        .get(parse('/api/locations/@locations:state:membershiptest:/shifts/managing'))
                        .expect(200)
                        .end(function(err, res) {
                            if (err) {
                                debug(res.text);
                                done(err);
                                return;
                            }
                            try {
                                var data = JSON.parse(res.text);
                                debug(data);
                                expect(data).to.not.be.undefined;
                                data.should.be.a('array');
                                expect(data.length).to.equal(0);

                                done();
                            } catch (e) {
                                done(e);
                            }
                        });

                });

            });

            describe('- manager', function() {

                var managingShiftCount = 4 ;
                var userwithshifts_userid = parseInt(parse('@users:username:groupmember:'));

                beforeEach(function(done) {

                    login('manager',
                        'secret',
                        done);

                });

                it('- lists ALL shifts the user is managing', function(done) {

                    request(app)
                        .get(parse('/api/locations/@locations:state:membershiptest:/shifts/managing'))
                        .expect(200)
                        .end(function(err, res) {
                            if (err) {
                                debug(res.text);
                                done(err);
                                return;
                            }
                            try {
                                var data = JSON.parse(res.text);
                                debug(data);
                                data.should.be.a('array');
                                data.length.should.equal(managingShiftCount);

                                var foundUsedShifts = 0;
                                var expectedUsedShifts = 3;
                                _.each(data, function(shift) {
                                    _.each(properties, function(property) {
                                        shift.should.have.property(property);
                                        if (shift['user_id'] != null) {
                                            foundUsedShifts++;
                                            shift['user_id'].should.equal(userwithshifts_userid);
                                        }
                                    });
                                });

                                expect(foundUsedShifts).to.equal(foundUsedShifts);

                                done();
                            } catch (e) {
                                done(e);
                            }
                        });

                });

            });

        });

    });

});
