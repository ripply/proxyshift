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
// PATCH /api/locations/:location_id/sublocations/:sublocation_id
// DELETE /api/locations/:location_id/sublocations/:sublocation_id
// GET /api/locations/:location_id/shifts/:groupuserclass_id
// GET /api/locations/:location_id/shifts/after/:after/before/:before

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
                            if (err) {
                                debug(res.text);
                                done(err);
                                return;
                            }
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

        describe('- /:location_id/shifts', function() {

            describe('- anonymous user', function () {

                it('- return 401', function (done) {

                    request(app)
                        .get(parse('/api/locations/@locations:state:membershiptest:/shifts'))
                        .expect(401, done);

                });

            });

            describe('- non group member', function () {

                beforeEach(function (done) {

                    login('nongroupmember',
                        'secret',
                        done);

                });

                it('- return 401', function (done) {

                    request(app)
                        .get(parse('/api/locations/@locations:state:membershiptest:/shifts'))
                        .expect(401)
                        .end(done);

                });

            });

            describe('- group member but not location member', function () {

                beforeEach(function (done) {

                    login('nonlocationmem',
                        'secret',
                        done);

                });

                it('- returns 401', function (done) {

                    request(app)
                        .get(parse('/api/locations/@locations:state:membershiptest:/shifts'))
                        .expect(401)
                        .end(done);

                });

            });

            describe('- location member', function () {

                beforeEach(function (done) {

                    login('groupmember',
                        'secret',
                        done);

                });

                it('- get a list of shifts you are eligible for', function (done) {

                    getLocationShifts(done, 4);

                });

            });

            describe('- group owner', function () {

                beforeEach(function (done) {

                    login('groupowner',
                        'secret',
                        done);

                });

                it('- get a list of locations attached to', function (done) {

                    getLocationShifts(done, 0);

                });

            });

            function getLocationShifts(done, shiftcount) {
                request(app)
                    .get(parse('/api/locations/@locations:state:membershiptest:/shifts'))
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
                            expect(data.length).to.equal(shiftcount);
                            for (var i = 0; i < data.length; i++) {
                                var shift = data[i];
                                expect(shift.user_id == parse('@users:username:groupmember:') || shift.user_id == null).to.be.true;
                            }
                            done();
                        } catch (e) {
                            done(e);
                        }
                    });
            }

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

        describe('- /:location_id/sublocations', function() {

            describe('- anonymous user', function () {

                it('- return 401', function (done) {

                    request(app)
                        .get(parse('/api/locations/@locations:state:membershiptest:/sublocations'))
                        .expect(401, done);

                });

            });

            describe('- non group member', function () {

                beforeEach(function (done) {

                    login('nongroupmember',
                        'secret',
                        done);

                });

                it('- return 401', function (done) {

                    request(app)
                        .get(parse('/api/locations/@locations:state:membershiptest:/sublocations'))
                        .expect(401)
                        .end(done);

                });

            });

            describe('- group member but not location member', function () {

                beforeEach(function (done) {

                    login('nonlocationmem',
                        'secret',
                        done);

                });

                it('- returns 401', function (done) {

                    request(app)
                        .get(parse('/api/locations/@locations:state:membershiptest:/sublocations'))
                        .expect(401)
                        .end(done);

                });

            });

            describe('- location member', function () {

                beforeEach(function (done) {

                    login('groupmember',
                        'secret',
                        done);

                });

                it('- get a list of sublocations attatched to a location', function (done) {

                    getSublocations(done, '@locations:state:membershiptest:', 1);

                });

            });

            describe('- group owner', function () {

                beforeEach(function (done) {

                    login('groupowner',
                        'secret',
                        done);

                });

                it('- get a list of sublocations attatched to a location', function (done) {

                    getSublocations(done, '@locations:state:membershiptest:', 1);

                });

            });

        });

        function getSublocations(done, id, sublocationcount) {
            request(app)
                .get(parse('/api/locations/' + id + '/sublocations'))
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
                        expect(data.length).to.equal(sublocationcount);
                        for (var i = 0; i < data.length; i++) {
                            expect(data[i].location_id).to.equal(parseInt(parse(id)));
                        }
                        done();
                    } catch (e) {
                        done(e);
                    }
                });
        }

        describe('- /:location_id/sublocations/:sublocation_id', function() {

            describe('- anonymous user', function () {

                it('- return 401', function (done) {

                    request(app)
                        .get(parse('/api/locations/@locations:state:membershiptest:/sublocations/@sublocations:description:membershiptest floor 1:'))
                        .expect(401, done);

                });

            });

            describe('- non group member', function () {

                beforeEach(function (done) {

                    login('nongroupmember',
                        'secret',
                        done);

                });

                it('- return 401', function (done) {

                    request(app)
                        .get(parse('/api/locations/@locations:state:membershiptest:/sublocations/@sublocations:description:membershiptest floor 1:'))
                        .expect(401)
                        .end(done);

                });

            });

            describe('- group member but not location member', function () {

                beforeEach(function (done) {

                    login('nonlocationmem',
                        'secret',
                        done);

                });

                it('- returns 401', function (done) {

                    request(app)
                        .get(parse('/api/locations/@locations:state:membershiptest:/sublocations/@sublocations:description:membershiptest floor 1:'))
                        .expect(401)
                        .end(done);

                });

            });

            describe('- location member', function () {

                beforeEach(function (done) {

                    login('groupmember',
                        'secret',
                        done);

                });

                it('- get a list of sublocations attatched to a location', function (done) {

                    getSublocation(done, '@locations:state:membershiptest:', '@sublocations:description:membershiptest floor 1:');

                });

            });

            describe('- group owner', function () {

                beforeEach(function (done) {

                    login('groupowner',
                        'secret',
                        done);

                });

                it('- get a list of sublocations attatched to a location', function (done) {

                    getSublocation(done, '@locations:state:membershiptest:', '@sublocations:description:membershiptest floor 1:');

                });

            });

        });

        function getSublocation(done, locationid, sublocationid) {
            request(app)
                .get(parse('/api/locations/' + locationid + '/sublocations/' + sublocationid))
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
                        data.should.be.a('object');
                        expect(data.id).to.equal(parseInt(parse(sublocationid)));
                        expect(data.location_id).to.equal(parseInt(parse(locationid)));
                        done();
                    } catch (e) {
                        done(e);
                    }
                });
        }

    });

    describe('- POST', function () {

        describe('- /:location_id/sublocations', function() {

            var newSublocation = {
                title: 'test',
                description: 'test description'
            };

            describe('- anonymous user', function () {

                it('- return 401', function (done) {

                    request(app)
                        .post(parse('/api/locations/@locations:state:membershiptest:/sublocations'))
                        .send(newSublocation)
                        .expect(401, done);

                });

            });

            describe('- non group member', function () {

                beforeEach(function (done) {

                    login('nongroupmember',
                        'secret',
                        done);

                });

                it('- return 401', function (done) {

                    request(app)
                        .post(parse('/api/locations/@locations:state:membershiptest:/sublocations'))
                        .send(newSublocation)
                        .expect(401)
                        .end(done);

                });

            });

            describe('- group member but not location member', function () {

                beforeEach(function (done) {

                    login('nonlocationmem',
                        'secret',
                        done);

                });

                it('- returns 401', function (done) {

                    request(app)
                        .post(parse('/api/locations/@locations:state:membershiptest:/sublocations'))
                        .send(newSublocation)
                        .expect(401)
                        .end(done);

                });

            });

            describe('- location member', function () {

                beforeEach(function (done) {

                    login('groupmember',
                        'secret',
                        done);

                });

                it('- returns 401', function (done) {

                    request(app)
                        .post(parse('/api/locations/@locations:state:membershiptest:/sublocations'))
                        .send(newSublocation)
                        .expect(401)
                        .end(done);

                });

            });

            describe('- privileged location member', function () {

                beforeEach(function (done) {

                    login('manager',
                        'secret',
                        done);

                });

                it('- get a list of sublocations attatched to a location', function (done) {

                    postSublocations(done, newSublocation);

                });

            });

            describe('- group owner', function () {

                beforeEach(function (done) {

                    login('groupowner',
                        'secret',
                        done);

                });

                it('- able to create a sublocation', function (done) {

                    postSublocations(done, newSublocation);

                });

            });

            function postSublocations(done, postData) {
                request(app)
                    .post(parse('/api/locations/@locations:state:membershiptest:/sublocations'))
                    .send(postData)
                    .expect(201)
                    .end(function (err, res) {
                        if (err) {
                            debug(res.text);
                            done(err);
                            return;
                        }
                        console.log("POSTED");
                        try {
                            debug(res.text);
                            var data = JSON.parse(res.text);
                            data.should.be.a('object');
                            expect(data.id).to.not.be.undefined;

                            request(app)
                                .get(parse('/api/locations/@locations:state:membershiptest:/sublocations/' + data.id))
                                .expect(200)
                                .end(function(err, res) {
                                    if (err) {
                                        debug(res.text);
                                        done(err);
                                        return;
                                    }
                                    try {
                                        debug(res.text);
                                        var data = JSON.parse(res.text);
                                        data.should.be.a('object');

                                        expect(data.location_id).to.equal(data.id);
                                        _.each(postData, function(value, key) {
                                            expect(data[key]).to.equal(value);
                                        });
                                        done();
                                    } catch (err2) {
                                        done(err2);
                                    }
                                });
                        } catch (e) {
                            done(e);
                        }
                    });
            }

        });

    })

});
