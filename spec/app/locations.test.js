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

var time = require('../../app/time');

// TODO:
// PATCH /api/locations/:location_id/sublocations/:sublocation_id
// DELETE /api/locations/:location_id/sublocations/:sublocation_id
// GET /api/locations/:location_id/shifts/:groupuserclass_id
// GET /api/locations/:location_id/shifts/after/:after/before/:before
// POST /api/locations/:location_id/subscribe
// DELETE /api/locations/:location_id/subscribe

describe('#/api/locations', function() {

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

                var managingShiftCount = 5 ;
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

    describe('- PATCH', function () {

        describe('- /:location_id/sublocations/:sublocation_id', function() {

            var patchSublocationData = {
                title: 'patched title',
                description: 'patched description'
            };

            describe('- anonymous user', function () {

                it('- return 401', function (done) {

                    request(app)
                        .patch(parse('/api/locations/@locations:state:membershiptest:/sublocations/@sublocations:description:membershiptest floor 1:'))
                        .send(patchSublocationData)
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
                        .patch(parse('/api/locations/@locations:state:membershiptest:/sublocations/@sublocations:description:membershiptest floor 1:'))
                        .send(patchSublocationData)
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
                        .patch(parse('/api/locations/@locations:state:membershiptest:/sublocations/@sublocations:description:membershiptest floor 1:'))
                        .send(patchSublocationData)
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

                    request(app)
                        .patch(parse('/api/locations/@locations:state:membershiptest:/sublocations/@sublocations:description:membershiptest floor 1:'))
                        .send(patchSublocationData)
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

                it('- update a sublocation', function (done) {

                    patchSublocation(done, patchSublocationData, '@locations:state:membershiptest:', '@sublocations:description:membershiptest floor 1:');

                });

            });

            describe('- group owner', function () {

                beforeEach(function (done) {

                    login('groupowner',
                        'secret',
                        done);

                });

                it('- update a sublocation', function (done) {

                    patchSublocation(done, patchSublocationData, '@locations:state:membershiptest:', '@sublocations:description:membershiptest floor 1:');

                });

            });

        });

        function patchSublocation(done, patchData, locationid, sublocationid) {
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

                        request(app)
                            .patch(parse('/api/locations/' + locationid + '/sublocations/' + sublocationid))
                            .send(patchData)
                            .expect(200)
                            .end(function(err, res) {
                                if (err) {
                                    debug(res.text);
                                    done(err);
                                    return;
                                }
                                try {
                                    debug(res.text);
                                    var data2 = JSON.parse(res.text);
                                    data2.should.be.a('object');
                                    expect(data2.error).to.equal(false);

                                    request(app)
                                        .get(parse('/api/locations/' + locationid + '/sublocations/' + sublocationid))
                                        .expect(200)
                                        .end(function (err, res3) {
                                            if (err) {
                                                debug(res3.text);
                                                done(err);
                                                return;
                                            }
                                            try {
                                                debug(res3.text);
                                                var data3 = JSON.parse(res3.text);
                                                data3.should.be.a('object');
                                                expect(data3.id).to.equal(parseInt(parse(sublocationid)));
                                                expect(data3.location_id).to.equal(parseInt(parse(locationid)));

                                                var keys = _.keys(patchData);
                                                for (var i = 0; i < keys.length; i++) {
                                                    expect(data3[keys[i]]).to.equal(patchData[keys[i]]);
                                                }

                                                done();
                                            } catch (e) {
                                                done(e);
                                            }
                                        });

                                } catch (err2) {
                                    debug(err2);
                                }
                            });

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

        describe('- /:location_id/', function() {

            describe('- /shifts/groupuserclass/:groupuserclass_id/start/:start/end/:end', function() {

                var currentTimeInUtc = time.nowInUtc();
                var threeHoursInFuture = new moment(currentTimeInUtc * 1000).add('3', 'hour').unix();
                var fourHoursInFuture = new moment(currentTimeInUtc * 1000).add('4', 'hour').unix();

                var newShift = {
                    title: 'new shift',
                    description: 'new shift description'
                };

                var newShiftWithDescriptionButWithoutTitle = {
                    description: newShift.description
                };

                //var baseUrl = parse('/api/locations/@locations:state:membershiptest:/shifts/groupuserclass/');
                //var correctUrl = parse('@groupuserclasses:title:classtest:/') + baseUrl + 'start/' + threeHoursInFuture + '/end/' + fourHoursInFuture;
                //var otherClassType = parse('@groupuserclasses:title:User class 1:/') + baseUrl + 'start/' + threeHoursInFuture + '/end/' + fourHoursInFuture;

                var baseUrl = parse('/api/locations/@locations:state:membershiptest:/shifts/groupuserclass/');
                var classType1 = parse('@groupuserclasses:title:classtest:/');
                var classType2 = parse('@groupuserclasses:title:User class 1:/');
                var subUrl1 = baseUrl + classType1;
                var subUrl2 = baseUrl + classType2;
                var endUrl = 'start/' + threeHoursInFuture + '/end/' + fourHoursInFuture;
                var correctUrl = subUrl1 + endUrl;
                var otherClassType = subUrl2 + endUrl;

                describe('- anonymous user', function() {

                    it('- return 401', function(done) {

                        request(app)
                            .post(correctUrl)
                            .send(newShift)
                            .expect(401, done);

                    });

                });

                describe('- non location member', function() {

                    beforeEach(function(done) {

                        login('nongroupmember',
                            'secret',
                            done);

                    });

                    it('- return 401', function(done) {

                        request(app)
                            .post(correctUrl)
                            .send(newShift)
                            .expect(401, done);

                    });

                });

                describe('- location member', function() {

                    beforeEach(function(done) {

                        login('groupmember',
                            'secret',
                            done);

                    });

                    it('- a shift requires a title', function(done) {

                        request(app)
                            .post(correctUrl)
                            .send(newShiftWithDescriptionButWithoutTitle)
                            .expect(400, function(err, res) {
                                if (err) {
                                    debug(res.text);
                                    done(err);
                                } else {
                                    try {
                                        var data = JSON.parse(res.text);
                                        data.should.be.a('object');
                                        expect(data.data).to.not.be.undefined;
                                        expect(data.data.message).to.not.be.undefined;
                                        expect(data.data.message.title).to.not.be.undefined;

                                        done();
                                    } catch (err) {
                                        done(err);
                                    }
                                }
                            });

                    });

                    it('- cannot create a shift of a class type you are not', function(done) {

                        request(app)
                            .post(otherClassType)
                            .send(newShift)
                            .expect(401, done);

                    });

                    describe('- returns 201 and returns shift_id', function() {

                        var shiftids ={

                        };

                        beforeEach(function(done) {

                            request(app)
                                .post(correctUrl)
                                .send(newShift)
                                .expect(201, function(err, res) {
                                    if (err) {
                                        debug(res.text);
                                        done(err);
                                    } else {
                                        try {
                                            var data = JSON.parse(res.text);
                                            data.should.be.a('object');
                                            expect(data.id).to.not.be.undefined;
                                            shiftids.id = data.id;

                                            done();
                                        } catch (err) {
                                            done(err);
                                        }
                                    }
                                });

                        });

                        it('- and the new shift is accessible', function(done) {

                            request(app)
                                .get('/api/shifts/' + shiftids.id)
                                .expect(200, function(err, res) {
                                    if (err) {
                                        debug(res.text);
                                        done(err);
                                    } else {
                                        try {
                                            var data = JSON.parse(res.text);
                                            data.should.be.a('object');
                                            expect(data.id).to.equal(parseInt(shiftids.id));
                                            expect(data.start).to.equal(threeHoursInFuture);
                                            expect(data.end).to.equal(fourHoursInFuture);
                                            expect(data.title).to.equal(newShift.title);
                                            expect(data.description).to.equal(newShift.description);

                                            done();
                                        } catch (err) {
                                            done(err);
                                        }
                                    }
                                });

                        });

                    });

                });

                describe('- manager', function() {

                    beforeEach(function(done) {

                        login('manager',
                            'secret',
                            done);

                    });

                    it('- a shift requires a title', function(done) {

                        request(app)
                            .post(correctUrl)
                            .send(newShiftWithDescriptionButWithoutTitle)
                            .expect(400, function(err, res) {
                                if (err) {
                                    debug(res.text);
                                    done(err);
                                } else {
                                    try {
                                        var data = JSON.parse(res.text);
                                        data.should.be.a('object');
                                        expect(data.data).to.not.be.undefined;
                                        expect(data.data.message).to.not.be.undefined;
                                        expect(data.data.message.title).to.not.be.undefined;

                                        done();
                                    } catch (err) {
                                        done(err);
                                    }
                                }
                            });

                    });

                    it('- can create a shift of a class type you are not', function(done) {

                        request(app)
                            .post(otherClassType)
                            .send(newShift)
                            .expect(201, done);

                    });

                    describe('- returns 201 and returns shift_id', function() {

                        var shiftids ={

                        };

                        beforeEach(function(done) {

                            request(app)
                                .post(correctUrl)
                                .send(newShift)
                                .expect(201, function(err, res) {
                                    if (err) {
                                        debug(res.text);
                                        done(err);
                                    } else {
                                        try {
                                            var data = JSON.parse(res.text);
                                            data.should.be.a('object');
                                            expect(data.id).to.not.be.undefined;
                                            shiftids.id = data.id;

                                            done();
                                        } catch (err) {
                                            done(err);
                                        }
                                    }
                                });

                        });

                        it('- and the new shift is accessible', function(done) {

                            request(app)
                                .get('/api/shifts/' + shiftids.id)
                                .expect(200, function(err, res) {
                                    if (err) {
                                        debug(res.text);
                                        done(err);
                                    } else {
                                        try {
                                            var data = JSON.parse(res.text);
                                            data.should.be.a('object');
                                            expect(data.id).to.equal(parseInt(shiftids.id));
                                            expect(data.start).to.equal(threeHoursInFuture);
                                            expect(data.end).to.equal(fourHoursInFuture);
                                            expect(data.title).to.equal(newShift.title);
                                            expect(data.description).to.equal(newShift.description);

                                            done();
                                        } catch (err) {
                                            done(err);
                                        }
                                    }
                                });

                        });

                    });

                });

                describe('- group owner', function() {

                    beforeEach(function(done) {

                        login('groupowner',
                            'secret',
                            done);

                    });

                    it('- a shift requires a title', function(done) {

                        request(app)
                            .post(correctUrl)
                            .send(newShiftWithDescriptionButWithoutTitle)
                            .expect(400, function(err, res) {
                                if (err) {
                                    debug(res.text);
                                    done(err);
                                } else {
                                    try {
                                        var data = JSON.parse(res.text);
                                        data.should.be.a('object');
                                        expect(data.data).to.not.be.undefined;
                                        expect(data.data.message).to.not.be.undefined;
                                        expect(data.data.message.title).to.not.be.undefined;

                                        done();
                                    } catch (err) {
                                        done(err);
                                    }
                                }
                            });

                    });

                    describe('- returns 201 and returns shift_id', function() {

                        var shiftids ={

                        };

                        beforeEach(function(done) {

                            request(app)
                                .post(correctUrl)
                                .send(newShift)
                                .expect(201, function(err, res) {
                                    if (err) {
                                        debug(res.text);
                                        done(err);
                                    } else {
                                        try {
                                            var data = JSON.parse(res.text);
                                            data.should.be.a('object');
                                            expect(data.id).to.not.be.undefined;
                                            shiftids.id = data.id;

                                            done();
                                        } catch (err) {
                                            done(err);
                                        }
                                    }
                                });

                        });

                        it('- and the new shift is accessible', function(done) {

                            request(app)
                                .get('/api/shifts/' + shiftids.id)
                                .expect(200, function(err, res) {
                                    if (err) {
                                        debug(res.text);
                                        done(err);
                                    } else {
                                        try {
                                            var data = JSON.parse(res.text);
                                            data.should.be.a('object');
                                            expect(data.id).to.equal(parseInt(shiftids.id));
                                            expect(data.start).to.equal(threeHoursInFuture);
                                            expect(data.end).to.equal(fourHoursInFuture);
                                            expect(data.title).to.equal(newShift.title);
                                            expect(data.description).to.equal(newShift.description);
                                            expect(data.location_id).to.equal(parseInt(parse('@locations:state:membershiptest:')));
                                            expect(data.sublocation_id).to.be.null;

                                            done();
                                        } catch (err) {
                                            done(err);
                                        }
                                    }
                                });

                        });

                    });

                });

            });

            describe('- /sublocations/:sublocation_id/shifts/groupuserclass/:groupuserclass_id/start/:start/end/:end', function() {

                var currentTimeInUtc = time.nowInUtc();
                var threeHoursInFuture = new moment(currentTimeInUtc * 1000).add('3', 'hour').unix();
                var fourHoursInFuture = new moment(currentTimeInUtc * 1000).add('4', 'hour').unix();

                var newShift = {
                    title: 'new shift',
                    description: 'new shift description'
                };

                var newShiftWithDescriptionButWithoutTitle = {
                    description: newShift.description
                };

                var baseUrl = parse('/api/locations/@locations:state:membershiptest:/sublocations/@sublocations:title:floor 1:/shifts/groupuserclass/');
                var classType1 = parse('@groupuserclasses:title:classtest:/');
                var classType2 = parse('@groupuserclasses:title:User class 1:/');
                var subUrl1 = baseUrl + classType1;
                var subUrl2 = baseUrl + classType2;
                var endUrl = 'start/' + threeHoursInFuture + '/end/' + fourHoursInFuture;
                var correctUrl = subUrl1 + endUrl;
                var otherClassType = subUrl2 + endUrl;

                describe('- anonymous user', function() {

                    it('- return 401', function(done) {

                        request(app)
                            .post(correctUrl)
                            .send(newShift)
                            .expect(401, done);

                    });

                });

                describe('- non location member', function() {

                    beforeEach(function(done) {

                        login('nongroupmember',
                            'secret',
                            done);

                    });

                    it('- return 401', function(done) {

                        request(app)
                            .post(correctUrl)
                            .send(newShift)
                            .expect(401, done);

                    });

                });

                describe('- location member', function() {

                    beforeEach(function(done) {

                        login('groupmember',
                            'secret',
                            done);

                    });

                    it('- a shift requires a title', function(done) {

                        request(app)
                            .post(correctUrl)
                            .send(newShiftWithDescriptionButWithoutTitle)
                            .expect(400, function(err, res) {
                                if (err) {
                                    debug(res.text);
                                    done(err);
                                } else {
                                    try {
                                        var data = JSON.parse(res.text);
                                        data.should.be.a('object');
                                        expect(data.data).to.not.be.undefined;
                                        expect(data.data.message).to.not.be.undefined;
                                        expect(data.data.message.title).to.not.be.undefined;

                                        done();
                                    } catch (err) {
                                        done(err);
                                    }
                                }
                            });

                    });

                    it('- cannot create a shift of a class type you are not', function(done) {

                        request(app)
                            .post(otherClassType)
                            .send(newShift)
                            .expect(401, done);

                    });

                    describe('- returns 201 and returns shift_id', function() {

                        var shiftids ={

                        };

                        beforeEach(function(done) {

                            request(app)
                                .post(correctUrl)
                                .send(newShift)
                                .expect(201, function(err, res) {
                                    if (err) {
                                        debug(res.text);
                                        done(err);
                                    } else {
                                        try {
                                            var data = JSON.parse(res.text);
                                            data.should.be.a('object');
                                            expect(data.id).to.not.be.undefined;
                                            shiftids.id = data.id;

                                            done();
                                        } catch (err) {
                                            done(err);
                                        }
                                    }
                                });

                        });

                        it('- and the new shift is accessible', function(done) {

                            request(app)
                                .get('/api/shifts/' + shiftids.id)
                                .expect(200, function(err, res) {
                                    if (err) {
                                        debug(res.text);
                                        done(err);
                                    } else {
                                        try {
                                            var data = JSON.parse(res.text);
                                            data.should.be.a('object');
                                            expect(data.id).to.equal(parseInt(shiftids.id));
                                            expect(data.start).to.equal(threeHoursInFuture);
                                            expect(data.end).to.equal(fourHoursInFuture);
                                            expect(data.title).to.equal(newShift.title);
                                            expect(data.description).to.equal(newShift.description);
                                            expect(data.location_id).to.be.null;
                                            expect(data.sublocation_id).to.equal(parseInt(parse('@sublocations:title:floor 1:')));

                                            done();
                                        } catch (err) {
                                            done(err);
                                        }
                                    }
                                });

                        });

                    });

                });

                describe('- manager', function() {

                    beforeEach(function(done) {

                        login('manager',
                            'secret',
                            done);

                    });

                    it('- a shift requires a title', function(done) {

                        request(app)
                            .post(correctUrl)
                            .send(newShiftWithDescriptionButWithoutTitle)
                            .expect(400, function(err, res) {
                                if (err) {
                                    debug(res.text);
                                    done(err);
                                } else {
                                    try {
                                        var data = JSON.parse(res.text);
                                        data.should.be.a('object');
                                        expect(data.data).to.not.be.undefined;
                                        expect(data.data.message).to.not.be.undefined;
                                        expect(data.data.message.title).to.not.be.undefined;

                                        done();
                                    } catch (err) {
                                        done(err);
                                    }
                                }
                            });

                    });

                    it('- can create a shift of a class type you are not', function(done) {

                        request(app)
                            .post(otherClassType)
                            .send(newShift)
                            .expect(201, done);

                    });

                    describe('- returns 201 and returns shift_id', function() {

                        var shiftids ={

                        };

                        beforeEach(function(done) {

                            request(app)
                                .post(correctUrl)
                                .send(newShift)
                                .expect(201, function(err, res) {
                                    if (err) {
                                        debug(res.text);
                                        done(err);
                                    } else {
                                        try {
                                            var data = JSON.parse(res.text);
                                            data.should.be.a('object');
                                            expect(data.id).to.not.be.undefined;
                                            shiftids.id = data.id;

                                            done();
                                        } catch (err) {
                                            done(err);
                                        }
                                    }
                                });

                        });

                        it('- and the new shift is accessible', function(done) {

                            request(app)
                                .get('/api/shifts/' + shiftids.id)
                                .expect(200, function(err, res) {
                                    if (err) {
                                        debug(res.text);
                                        done(err);
                                    } else {
                                        try {
                                            var data = JSON.parse(res.text);
                                            data.should.be.a('object');
                                            expect(data.id).to.equal(parseInt(shiftids.id));
                                            expect(data.start).to.equal(threeHoursInFuture);
                                            expect(data.end).to.equal(fourHoursInFuture);
                                            expect(data.title).to.equal(newShift.title);
                                            expect(data.description).to.equal(newShift.description);

                                            done();
                                        } catch (err) {
                                            done(err);
                                        }
                                    }
                                });

                        });

                    });

                });

                describe('- group owner', function() {

                    beforeEach(function(done) {

                        login('groupowner',
                            'secret',
                            done);

                    });

                    it('- a shift requires a title', function(done) {

                        request(app)
                            .post(correctUrl)
                            .send(newShiftWithDescriptionButWithoutTitle)
                            .expect(400, function(err, res) {
                                if (err) {
                                    debug(res.text);
                                    done(err);
                                } else {
                                    try {
                                        var data = JSON.parse(res.text);
                                        data.should.be.a('object');
                                        expect(data.data).to.not.be.undefined;
                                        expect(data.data.message).to.not.be.undefined;
                                        expect(data.data.message.title).to.not.be.undefined;

                                        done();
                                    } catch (err) {
                                        done(err);
                                    }
                                }
                            });

                    });

                    describe('- returns 201 and returns shift_id', function() {

                        var shiftids ={

                        };

                        beforeEach(function(done) {

                            request(app)
                                .post(correctUrl)
                                .send(newShift)
                                .expect(201, function(err, res) {
                                    if (err) {
                                        debug(res.text);
                                        done(err);
                                    } else {
                                        try {
                                            var data = JSON.parse(res.text);
                                            data.should.be.a('object');
                                            expect(data.id).to.not.be.undefined;
                                            shiftids.id = data.id;

                                            done();
                                        } catch (err) {
                                            done(err);
                                        }
                                    }
                                });

                        });

                        it('- and the new shift is accessible', function(done) {

                            request(app)
                                .get('/api/shifts/' + shiftids.id)
                                .expect(200, function(err, res) {
                                    if (err) {
                                        debug(res.text);
                                        done(err);
                                    } else {
                                        try {
                                            var data = JSON.parse(res.text);
                                            data.should.be.a('object');
                                            expect(data.id).to.equal(parseInt(shiftids.id));
                                            expect(data.start).to.equal(threeHoursInFuture);
                                            expect(data.end).to.equal(fourHoursInFuture);
                                            expect(data.title).to.equal(newShift.title);
                                            expect(data.description).to.equal(newShift.description);

                                            done();
                                        } catch (err) {
                                            done(err);
                                        }
                                    }
                                });

                        });

                    });

                });

            });

        });

    })

});
