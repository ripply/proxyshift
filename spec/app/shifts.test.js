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

var debug = global.debug;
var parse = global.parse;

var password = 'secret';

// TODO:
// GET /api/shifts/:shift_id/ignore
// POST /api/shifts/:shift_id/ignore
// PATCH /api/shifts/:shift_id
// DELETE /api/shifts/:shift_id
// DELETE /api/shifts/:shift_id/ignore

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

        describe('- /:shift_id/register', function() {

            describe('- anonymous user', function() {

                it('- returns 401', function(done) {

                    request(app)
                        .post(parse('/api/shifts/@shifts:title:monthshiftisover:/register'))
                        .send()
                        .expect(401, done);

                });

            });

            describe('- non location member', function() {

                beforeEach(function(done) {

                    login('test_password',
                        'secret',
                        done);

                });

                it('- returns 401', function(done) {

                    request(app)
                        .post(parse('/api/shifts/@shifts:title:monthshiftisover:/register'))
                        .send()
                        .expect(401, done);

                });

            });

            describe('- location member', function() {

                var shift = '@shifts:title:newshift:';

                describe('- of incorrect class type', function() {

                    beforeEach(function(done) {

                        login('test_member_of_group',
                            'secret',
                            done);

                    });

                    it('- returns 401', function(done) {

                        request(app)
                            .post(parse('/api/shifts/' + shift + '/register'))
                            .send()
                            .expect(401, done);

                    });

                });

                describe('- of correct class type', function() {

                    beforeEach(function(done) {

                        login('groupmember',
                            'secret',
                            done);

                    });


                    describe('- can request a shift', function() {

                        beforeEach(function(done) {

                            // after logging in, request shift
                            request(app)
                                .post(parse('/api/shifts/' + shift + '/register'))
                                .send()
                                .expect(201, done);

                        });

                        describe('- then a manager', function() {

                            beforeEach(function(done) {

                                logout(function(err, res) {
                                    if (err) {
                                        debug(res.text);
                                        done(err);
                                    } else {
                                        login('manager',
                                            'secret',
                                            done);
                                    }
                                });

                            });

                            it('- can see the users request', function(done) {

                                request(app)
                                    .get(parse('/api/shifts/' + shift))
                                    .expect(200, function(err, res) {
                                        if (err) {
                                            debug(res.text);
                                            done(err);
                                        } else {
                                            try {
                                                var data = JSON.parse(res.text);
                                                data.should.be.a('object');
                                                expect(data.shiftapplications).to.not.be.undefined;
                                                expect(data.shiftapplications.length).to.equal(1);
                                                expect(data.shiftapplications[0].user_id).to.equal(parseInt(parse('@users:username:groupmember:')))
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

        });

    });

    var totalShiftCount = 4;

    var newShiftCount = 1;

    var properties = [
        'id',
        'user_id',
        'title',
        'description',
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
                        .get(parse('/api/shifts/@shifts:title:monthshiftisover:'))
                        .expect(401, done);

                });

            });

            describe('- location member', function() {

                beforeEach(function(done) {

                    login('groupmember',
                        'secret',
                        done);

                });

                describe('- accepted shift', function() {

                    it('- returns 200', function(done) {

                        request(app)
                            .get(parse('/api/shifts/@shifts:title:monthshiftisover:'))
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

                                    _.each(properties, function(property) {
                                        data.should.have.property(property);
                                    });

                                    // group member is not a manager
                                    // only managers will receive this
                                    expect(data.shiftapplications).to.be.undefined;

                                    done();
                                } catch (e) {
                                    done(e);
                                }
                            });

                    });

                });

                describe('- unaccepted shift but accessible', function() {

                    it('- returns 200', function(done) {

                        request(app)
                            .get(parse('/api/shifts/@shifts:title:sublocationshift:'))
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

                                    _.each(properties, function(property) {
                                        data.should.have.property(property);
                                    });

                                    // group member is not a manager
                                    // only managers will receive this
                                    expect(data.shiftapplications).to.be.undefined;

                                    done();
                                } catch (e) {
                                    done(e);
                                }
                            });

                    });

                });

                describe('- unaccepted shift and differing classtype', function() {

                    it('- returns 403', function(done) {

                        request(app)
                            .get(parse('/api/shifts/@shifts:title:different_classtype:'))
                            .expect(403, done);

                    });

                });

            });

            describe('- manager', function() {

                beforeEach(function(done) {

                    login('manager',
                        'secret',
                        done);

                });

                describe('- managed shift', function() {

                    it('- returns 200', function(done) {

                        request(app)
                            .get(parse('/api/shifts/@shifts:title:monthshiftisover:'))
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

                                    _.each(properties, function(property) {
                                        data.should.have.property(property);
                                    });

                                    // only managers will receive this
                                    expect(data.shiftapplications).to.be.undefined;

                                    done();
                                } catch (e) {
                                    done(e);
                                }
                            });

                    });

                });

                describe('- non managed shift', function() {

                    it('- returns 403', function(done) {

                        request(app)
                            .get(parse('/api/shifts/@shifts:title:shift_in_other_location:'))
                            .expect(403, done);

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
                                if (data.length != totalShiftCount) {
                                    debug(data);
                                }
                                data.length.should.equal(totalShiftCount);

                                _.each(data, function(shift) {
                                    // TODO: VALIDATE RULES FOR SHIFTS
                                    // RULES:
                                    // USER_ID == US
                                    // LOCATION_ID == MEMBER OF
                                    // SUBLOCATION_ID == PART OF LOCATION_ID
                                    // BEFORE/AFTER CORRECT
                                    //('' + shift['user_id']).should.equal(parse("@users:username:groupmember:"));
                                    _.each(properties, function(property) {
                                        shift.should.have.property(property);
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
                                debug(res.text);
                                done(err);
                                return;
                            }
                            try {
                                var data = JSON.parse(res.text);
                                data.should.be.a('array');
                                data.length.should.equal(newShiftCount);

                                _.each(data, function(shift) {
                                    _.each(properties, function(property) {
                                        shift.should.have.property(property);
                                        ('' + shift['user_id']).should.equal(parse("@users:username:groupmember:"));
                                    });

                                    // check that before is correct
                                    var offset = 0; //moment(new Date()).unix();
                                    var now = moment(new Date).unix();
                                    var greaterThan = parseInt(data.before) > now;
                                    expect(greaterThan).to.be.true;
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

                    login('groupmember',
                        'secret',
                        done);

                });

                it('- returns 200 zero length array', function(done) {

                    request(app)
                        .get('/api/shifts/managing')
                        .expect(200)
                        .end(function(err, res) {
                            if (err) {
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

            describe('- manager', function() {

                var managingShiftCount = 5;

                beforeEach(function(done) {

                    login('manager',
                        'secret',
                        done);

                });

                it('- lists ALL shifts the user is managing', function(done) {

                    getManagingShifts(managingShiftCount, done);

                });

                it('- the query is quick', function(done) {

                    var delta = 25; //ms
                    var before = new Date().getTime();
                    getManagingShifts(managingShiftCount, function(err) {
                        if (err) {
                            done(err);
                        } else {
                            var after = new Date().getTime();
                            var computedDelta = after - before;
                            debug("Query took: " + computedDelta);
                            expect(computedDelta).to.be.below(delta);
                            done();
                        }
                    });

                });

            });

            describe('- group owner', function() {

                var managingShiftCount = 5;

                beforeEach(function(done) {

                    login('groupowner',
                        'secret',
                        done);

                });

                it('- lists ALL shifts the user is managing', function(done) {

                    getManagingShifts(managingShiftCount, done);

                });

            });

            function getManagingShifts(managingShiftCount, done) {
                request(app)
                    .get('/api/shifts/managing')
                    .expect(200)
                    .end(function(err, res) {
                        if (err) {
                            done(err);
                            return;
                        }
                        try {
                            debug(res.text);
                            var data = JSON.parse(res.text);
                            data.should.be.a('array');
                            data.length.should.equal(managingShiftCount);

                            _.each(data, function(shift) {
                                _.each(properties, function(property) {
                                    shift.should.have.property(property);
                                    shift.should.have.property('shiftapplications');
                                });
                            });

                            done();
                        } catch (e) {
                            done(e);
                        }
                    });
            }

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
