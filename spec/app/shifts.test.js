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

var password = 'secret';

describe("#/shifts", function() {

    before(function (done) {
        require(ROOT_DIR + '/routes/preauth')(app, settings);
        require(ROOT_DIR + '/routes/misc/auth')(app, settings);
        require(ROOT_DIR + '/routes/shifts')(app, settings);
        done();
    });

    beforeEach(function (done) {
        global.sess = new global.Session();

        // Done to prevent any server side console logs from the routes
        // to appear on the console when running tests
        //console.log=function(){};
        global.setFixtures(global.fixtures.base)
            .then(done);
    });

    afterEach(function () {
        global.sess.destroy();
    });

    describe('- POST', function() {

        var newShift = {
            // TODO
        };

        describe('- /', function() {

            describe('- anonymous user', function() {

                it('- returns 401', function(done) {

                    request(app)
                        .post('/api/shifts/')
                        .send(newShift)
                        .expect(401, done);

                });

            });

            describe('- unprivileged location member', function() {

                beforeEach(function(done) {

                    login('locationmember',
                        'secret',
                        done);

                });

                it('- returns 401', function(done) {

                    request(app)
                        .post('/api/locations/1/shifts')
                        .send(newShift)
                        .expect(401, done);

                });

            });

        });

    });

    var totalShiftCount = 1;

    var newShiftCount = 0;

    var properties = [
        'id',
        'user_id',
        'title',
        'description',
        'recurring',
        'start',
        'end',
        'location_id',
    ];

    describe('- GET', function() {

        var userwithshifts_userid = 0;

        describe('- /:id', function() {

            describe('- anonymous user', function() {

                it('- returns 401', function(done) {

                    request(app)
                        .get('/api/shifts/1')
                        .expect(401, done);

                });

            });

            describe('- manager', function() {

                describe('- managed shift', function() {

                    it('- returns 200', function(done) {

                        request(app)
                            .get('/api/shifts/1')
                            .expect(200)
                            .end(function(err, res) {
                                if (err) {
                                    done(err);
                                }
                                try {
                                    var data = JSON.parse(res.text);
                                    data.should.be.a('object');

                                    _.each(properties, function(property) {
                                        data.should.have.property(property);
                                    });

                                    done();
                                } catch (e) {
                                    done(e);
                                }
                            });

                    });

                });

                describe('- non managed shift', function() {

                    it('- returns 401', function(done) {

                        request(app)
                            .get('/api/shifts/2')
                            .expect(401, done);

                    });

                });

            });

        });

        describe('- /all', function() {

            describe('- anonymous user', function() {

                it('- returns 401', function(done) {

                    request(app)
                        .get('/api/shifts/all')
                        .expect(401, done);

                });

            });

            describe('- logged in user', function() {

                beforeEach(function(done) {

                    login('groupmember',
                        'secret',
                        done);

                });

                it('- lists ALL shifts the user is attached to', function(done) {

                    request(app)
                        .get('/api/shifts/all')
                        .expect(200)
                        .end(function(err, res) {
                            if (err) {
                                debug(res.text);
                                done(err);
                                return;
                            }
                            try {
                                var data = JSON.parse(res.text);
                                data.should.be.a('array');
                                data.length.should.equal(totalShiftCount);

                                _.each(data, function(shift) {
                                    _.each(properties, function(property) {
                                        shift.should.have.property(property);
                                        ('' + shift['user_id']).should.equal(parse("@users:username:groupmember:"));
                                    });
                                });

                                done();
                            } catch (e) {
                                done(e);
                            }
                        });

                });

            });

        });

        describe('- /new', function() {

            describe('- anonymous user', function() {

                it('- returns 401', function(done) {

                    request(app)
                        .get('/api/shifts/new')
                        .expect(401, done);

                });

            });

            describe('- logged in user', function() {

                beforeEach(function(done) {

                    login('userwithshifts',
                        'secret',
                        done);

                });

                it('- lists NEW shifts the user is attached to', function(done) {

                    request(app)
                        .get('/api/shifts/new')
                        .expect(200)
                        .end(function(err, res) {
                            if (err) {
                                done(err);
                            }
                            try {
                                var data = JSON.parse(res.text);
                                data.should.be.a('array');
                                data.length.should.equal(newShiftCount);

                                _.each(data, function(shift) {
                                    _.each(properties, function(property) {
                                        shift.should.have.property(property);
                                        shift['user_id'].should.equal(userwithshifts_userid);
                                    });
                                });

                                done();
                            } catch (e) {
                                done(e);
                            }
                        });

                });

            });

        });

        describe('- /managing', function() {

            describe('- anonymous user', function() {

                it('- returns 401', function(done) {

                    request(app)
                        .get('/api/shifts/managing')
                        .expect(401, done);

                });

            });

            describe('- non manager', function() {

                beforeEach(function(done) {

                    login('userwithshifts',
                        'secret',
                        done);

                });

                it('- returns 200 empty response', function(done) {

                    request(app)
                        .get('/api/shifts/managing')
                        .expect(200)
                        .end(function(err, res) {
                            if (err) {
                                done(err);
                            }
                            try {
                                expect(res.text).to.not.be.undefined;
                                expect(res.text.length).to.equal(0);

                                done();
                            } catch (e) {
                                done(e);
                            }
                        });

                });

            });

            describe('- manager', function() {

                var managingShiftCount = 0;

                beforeEach(function(done) {

                    login('manager',
                        'secret',
                        done);

                });

                it('- lists ALL shifts the user is managing', function(done) {

                    request(app)
                        .get('/api/shifts/managing')
                        .expect(200)
                        .end(function(err, res) {
                            if (err) {
                                done(err);
                            }
                            try {
                                var data = JSON.parse(res.text);
                                data.should.be.a('array');
                                data.length.should.equal(managingShiftCount);

                                _.each(data, function(shift) {
                                    _.each(properties, function(property) {
                                        shift.should.have.property(property);
                                        shift['user_id'].should.equal(userwithshifts_userid);
                                    });
                                });

                                done();
                            } catch (e) {
                                done(e);
                            }
                        });

                });

            });

        });

    });

    describe('- PATCH', function() {

        var updateStartEnd = {
            start: 12345,
            end: 123456
        };

        describe('- /managing/:id', function() {

            describe('- update start/end time', function() {

                describe('- anonymous user', function() {

                    it('- returns 401', function(done) {

                        request(app)
                            .patch('/api/shifts/managing/1')
                            .send(updateStartEnd)
                            .expect(401, done);

                    });

                });

                describe('- non manager', function() {

                    beforeEach(function(done) {

                        login('userwithshifts',
                            'secret',
                            done);

                    });

                    it('- returns 401', function(done) {

                        request(app)
                            .patch('/api/shifts/managing/1')
                            .send(updateStartEnd)
                            .expect(401, done);

                    });

                });

                describe('- manager', function() {

                    beforeEach(function(done) {

                        login('manager',
                            'secret',
                            done);

                    });

                    describe('- returns 200', function() {

                        beforeEach(function(done) {

                            request(app)
                                .patch('/api/shifts/managing/1')
                                .send(updateStartEnd)
                                .expect(200, done);

                        });

                        it('- updates', function(done) {

                            request(app)
                                .get('/api/shifts/1')
                                .expect(200)
                                .end(function(err, res) {
                                    if (err) {
                                        done(err);
                                    }
                                    try {
                                        var data = JSON.parse(res.text);
                                        data.should.be.a('object');
                                        _.each(properties, function(property) {
                                            data.should.have.property(property);
                                        });

                                        data['start'].should.equal(updateStartEnd.start);
                                        data['end'].should.equal(updateStartEnd.end);

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

    });

    describe('- DELETE', function() {

    });

});
