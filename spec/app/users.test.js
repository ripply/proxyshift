/* jshint -W030 */
var models = require('../../app/models');
var ROOT_DIR = global.ROOT_DIR;
var app = global.app;
var request = global.request;
var settings = {auth: true};
var Promise = require('bluebird');
var ready = models.onDatabaseReady;
var expect = global.expect;
var _ = require('underscore');

var password = 'secret';
var login = require('../common').login;
var logout = require('../common').logout;
var failToLogin = require('../common').failToLogin;

// TODO:
// GET /users/settings
// POST /users/settings

// TODO: NOOP this for now see if things work with bookshelf events
encryptKey = function(key) {
    return key;
};

describe('#/api/users', function(){

    var log = console.log;

    before(function(done){
        require(ROOT_DIR + '/routes/preauth')(app, settings);
        require(ROOT_DIR + '/routes/misc/auth')(app, settings);
        require(ROOT_DIR + '/routes/users')(app, settings);
        done();
    });

    beforeEach(function(done){
        global.sess = new global.Session();

        // Done to prevent any server side console logs from the routes
        // to appear on the console when running tests
        //console.log=function(){};
        global.setFixtures(global.fixtures.base)
            .then(done);
    });

    afterEach(function() {
        global.sess.destroy();
    });

    describe('- POST', function() {

        describe('- /', function() {

            describe('- anonymous user', function() {

                it('- create a user then login successfully', function(done) {

                    var username = 'createduser';
                    request(app)
                        .post('/api/users/')
                        .send({
                            username: username,
                            password: password,
                            firstname: 'firstname',
                            lastname: 'lastname',
                            email: 'email@example.com',
                            squestion: 'squestion',
                            sanswer: 'sanswer',
                            phonehome: '12435',
                            phonemobile: '12345',
                            pagernumber: '12435'
                        })
                        .expect(201)
                        .end(function(err, res) {
                            if (err) {
                                done(err);
                                return;
                            }
                            login(
                                username,
                                password,
                                function(err2, res2) {
                                    if (err2) {
                                        done(err);
                                        return;
                                    }
                                    try {
                                        var data = JSON.parse(res2.text);
                                        expect(data.authenticationToken).to.not.be.null;

                                        done();
                                    } catch (e) {
                                        done(e);
                                    }
                                }
                            );
                        });

                });

                var username = 'noncreateduser';

                it('- returns details as to why creation fails', function(done) {

                    request(app)
                        .post('/api/users/')
                        .send({
                            username: username,
                            password: password,
                            firstname: 'firstname',
                            lastname: 'lastname',
                            email: 'invalidemail',
                            squestion: 'squestion',
                            sanswer: 'sanswer',
                            phonehome: '12435',
                            phonemobile: '12345',
                            pagernumber: '12435'
                        })
                        .expect(400)
                        .end(function(err, res) {
                            if (err) {
                                done(err);
                                return;
                            }
                            login(
                                username,
                                password,
                                function(err2, res2) {
                                    if (err2) {
                                        var data = JSON.parse(res.text);
                                        var message = data.data.message;
                                        done(err);
                                        return message;
                                    }
                                    try {
                                        var data = JSON.parse(res2.text);
                                        expect(data.authenticationToken).to.not.be.null;

                                        done();
                                    } catch (e) {
                                        done(e);
                                    }
                                }
                            );
                        });

                });

                it('- username must be unique', function(done) {

                    var username = 'username';
                    request(app)
                        .post('/api/users/')
                        .send({
                            username: username,
                            password: password,
                            firstname: 'firstname',
                            lastname: 'lastname',
                            email: 'email@example.com',
                            squestion: 'squestion',
                            sanswer: 'sanswer',
                            phonehome: '12435',
                            phonemobile: '12345',
                            pagernumber: '12435'
                        })
                        .expect(201)
                        .end(function(err, res) {
                            if (err) {
                                done(err);
                                return;
                            }
                            request(app)
                                .post('/api/users/')
                                .send({
                                    username: username,
                                    password: password,
                                    firstname: 'asdffasd',
                                    lastname: 'lastasdfname',
                                    email: 'emaiasdfl@example.com',
                                    squestion: 'squeasdfstion',
                                    sanswer: 'sanswfdsaer',
                                    phonehome: '124135',
                                    phonemobile: '123245',
                                    pagernumber: '132435'
                                })
                                .expect(500, done);
                        });

                });

                it('- username is case insensitive', function(done) {

                    var username = 'CASEinsensitive';
                    request(app)
                        .post('/api/users/')
                        .send({
                            username: username,
                            password: password,
                            firstname: 'firstname',
                            lastname: 'lastname',
                            email: 'email@example.com',
                            squestion: 'squestion',
                            sanswer: 'sanswer',
                            phonehome: '12435',
                            phonemobile: '12345',
                            pagernumber: '12435'
                        })
                        .expect(201)
                        .end(function(err, res) {
                            if (err) {
                                done(err);
                                return;
                            }
                            var secondUsername = 'caseINSENSITIVE';
                            request(app)
                                .post('/api/users/')
                                .send({
                                    username: secondUsername,
                                    password: password,
                                    firstname: 'asdffasd',
                                    lastname: 'lastasdfname',
                                    email: 'emaiasdfl@example.com',
                                    squestion: 'squeasdfstion',
                                    sanswer: 'sanswfdsaer',
                                    phonehome: '124135',
                                    phonemobile: '123245',
                                    pagernumber: '132435'
                                })
                                .expect(500, done);
                        });

                });

            });

            describe('- logged in user', function() {

                describe('- nonprivileged', function() {

                    beforeEach(function(done) {

                        login('groupmember',
                            'secret',
                            done);
                    });


                    it('- returns 401 when creating a user', function(done) {

                        request(app)
                            .post('/api/users/')
                            .send({
                                username: 'noncreateduser',
                                password: 'password',
                                firstname: 'firstname',
                                lastname: 'lastname',
                                email: 'email@example.com',
                                squestion: 'squestion',
                                sanswer: 'sanswer',
                                phonehome: '12435',
                                phonemobile: '12345',
                                pagernumber: '12435'
                            })
                            .expect(401, done);

                    });

                });

            });

        });

    });

    describe('- GET', function() {

        describe('- /', function() {

            describe('- anonymous user', function() {

                it('- returns 401', function(done) {

                    request(app)
                        .get('/api/users/')
                        .expect(401, done);

                });

            });

            describe('- logged in user', function() {

                describe('- the user', function() {

                    beforeEach(function(done) {

                        login('test_password',
                            'secret',
                            done);
                    });


                    it('- returns 200 and your user info', function(done) {

                        request(app)
                            .get(parse('/api/users/@users:username:test_password:'))
                            .expect('Content-Type', /json/)
                            .expect(200)
                            .end(function(err, res) {
                                if (err) {
                                    done(err);
                                    return;
                                }
                                try {
                                    var data = JSON.parse(res.text);
                                    data.should.be.a('object');

                                    _.each({
                                        username: 'test_password',
                                        firstname: 'password',
                                        lastname: 'password',
                                        email: 'test_password@example.com'
                                    }, function(value, key) {
                                        data.should.have.property(key);
                                        data[key].should.equal(value);
                                    });

                                    done();
                                } catch (e) {
                                    done(e);
                                }
                            });

                    });

                });

            });

            describe('- site admin', function() {

                beforeEach(function(done) {

                    login('siteadmin',
                        'secret',
                        done);
                });


                it('- returns all users', function(done) {

                    request(app)
                        .get('/api/users/')
                        .expect('Content-Type', /json/)
                        .expect(200)
                        .end(function(err, res) {
                            if (err) {
                                done(err);
                            }
                            try {
                                var data = JSON.parse(res.text);
                                data.should.be.a('array');
                                data.length.should.be.above(1);

                                _.each(data, function(userinfo) {
                                    _.each({
                                        username: 'test_password',
                                        firstname: 'password',
                                        lastname: 'password',
                                        email: 'test_password@example.com'
                                    }, function(value, key) {
                                        // just check if key exists
                                        data.should.have.property(key);
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

        describe('- /:id', function() {

            describe('- anonymous user', function() {

                it('- returns 401', function(done) {

                    request(app)
                        .get(parse('/api/users/@users:username:groupmember:'))
                        .expect(401, done);

                });

            });

            describe('- logged in user', function() {

                beforeEach(function(done) {
                    login('test_password',
                        'secret',
                        done);
                });

                describe('- self', function() {

                    it('- returns 200 and your user info', function(done) {

                        request(app)
                            .get(parse('/api/users/@users:username:test_password:'))
                            .expect('Content-Type', /json/)
                            .expect(200)
                            .end(function(err, res) {
                                if (err) {
                                    done(err);
                                }
                                try {
                                    var data = JSON.parse(res.text);
                                    data.should.be.a('object');

                                    _.each({
                                        username: 'test_password',
                                        firstname: 'password',
                                        lastname: 'password',
                                        email: 'test_password@example.com'
                                    }, function(value, key) {
                                        data.should.have.property(key);
                                        data[key].should.equal(value);
                                    });

                                    done();
                                } catch (e) {
                                    done(e);
                                }
                            });

                    });

                });

                describe('- other', function() {

                    it('- returns 401', function(done) {

                        request(app)
                            .get(parse('/api/users/@users:username:groupmember:'))
                            .expect(401, done);

                    });

                });

            });

            describe('- site admin', function() {

                beforeEach(function(done) {

                    login('siteadmin',
                        'secret',
                        done);
                });


                it('- always returns user', function(done) {

                    request(app)
                        .get(parse('/api/users/@users:username:test_password:'))
                        .expect('Content-Type', /json/)
                        .expect(200)
                        .end(function(err, res) {
                            if (err) {
                                done(err);
                            }
                            try {
                                var data = JSON.parse(res.text);
                                data.should.be.a('object');

                                _.each({
                                    username: 'test_password',
                                    firstname: 'password',
                                    lastname: 'password',
                                    email: 'test_password@example.com'
                                }, function(value, key) {
                                    data.should.have.property(key);
                                    data[value].should.equal(value);
                                });

                                done();
                            } catch (e) {
                                done(e);
                            }
                        });

                });

            });

        });

        describe('- /userinfo', function() {

            var uri = '/api/users/userinfo';

            describe('- anonymous user', function() {

                it('- returns 401', function(done) {

                    request(app)
                        .get(uri)
                        .expect(401, done);

                });

            });

            describe('- group member', function() {

                beforeEach(function(done) {

                    login('groupmember',
                        'secret',
                        done);

                });

                it('- sends basic account information', function(done) {

                    request(app)
                        .get(uri)
                        .expect(200, function(err, res) {
                            if (err) {
                                debug(res.text);
                                done(err);
                            } else {
                                try {
                                    var data = JSON.parse(res.text);

                                    expect(data).to.be.a('object');
                                    expect(data.username).to.equal('groupmember');
                                    expect(data.firstname).to.equal('groupmember');
                                    expect(data.lastname).to.equal('groupmember');

                                    done();
                                } catch (err) {
                                    done(err);
                                }
                            }
                        });

                });

                it('- does not transmit sensitive account information', function(done) {

                    request(app)
                        .get(uri)
                        .expect(200, function(err, res) {
                            if (err) {
                                debug(res.text);
                                done(err);
                            } else {
                                try {
                                    var data = JSON.parse(res.text);

                                    expect(data).to.be.a('object');
                                    expect(data.password).to.be.undefined;
                                    expect(data.squestion).to.be.undefined;
                                    expect(data.sanswer).to.be.undefined;
                                    expect(data.email).to.be.undefined;

                                    done();
                                } catch (err) {
                                    done(err);
                                }
                            }
                        });

                });

                it('- sends groups the user owns (0)', function(done) {

                    request(app)
                        .get(uri)
                        .expect(200, function(err, res) {
                            if (err) {
                                debug(res.text);
                                done(err);
                            } else {
                                try {
                                    var data = JSON.parse(res.text);

                                    expect(data).to.be.a('object');
                                    expect(data.ownedGroups).to.be.a('array');
                                    expect(data.ownedGroups.length).to.equal(0);

                                    done();
                                } catch (err) {
                                    done(err);
                                }
                            }
                        });

                });

                it('- sends groups the user is a member of (1)', function(done) {

                    request(app)
                        .get(uri)
                        .expect(200, function(err, res) {
                            if (err) {
                                debug(res.text);
                                done(err);
                            } else {
                                try {
                                    var data = JSON.parse(res.text);

                                    expect(data).to.be.a('object');
                                    expect(data.memberOfGroups).to.be.a('array');
                                    expect(data.memberOfGroups.length).to.equal(1);
                                    expect(data.memberOfGroups[0].id).to.equal(parseInt(parse('@groups:name:membershiptest:')));

                                    done();
                                } catch (err) {
                                    done(err);
                                }
                            }
                        });

                });

                it('- sends groups the user is a privileged member of (0)', function(done) {

                    request(app)
                        .get(uri)
                        .expect(200, function(err, res) {
                            if (err) {
                                debug(res.text);
                                done(err);
                            } else {
                                try {
                                    var data = JSON.parse(res.text);

                                    expect(data).to.be.a('object');
                                    expect(data.privilegedMemberOfGroups).to.be.a('array');
                                    expect(data.privilegedMemberOfGroups.length).to.equal(0);

                                    done();
                                } catch (err) {
                                    done(err);
                                }
                            }
                        });

                });

                it('- sends locations the user is a member of (1)', function(done) {

                    request(app)
                        .get(uri)
                        .expect(200, function(err, res) {
                            if (err) {
                                debug(res.text);
                                done(err);
                            } else {
                                try {
                                    var data = JSON.parse(res.text);

                                    expect(data).to.be.a('object');
                                    expect(data.memberOfLocations).to.be.a('array');
                                    expect(data.memberOfLocations.length).to.equal(1);
                                    expect(data.memberOfLocations[0].id).to.equal(parseInt(parse('@locations:state:membershiptest:')));

                                    done();
                                } catch (err) {
                                    done(err);
                                }
                            }
                        });

                });

                it('- sends locations the user is a privileged member of (0)', function(done) {

                    request(app)
                        .get(uri)
                        .expect(200, function(err, res) {
                            if (err) {
                                debug(res.text);
                                done(err);
                            } else {
                                try {
                                    var data = JSON.parse(res.text);

                                    expect(data).to.be.a('object');
                                    expect(data.privilegedMemberOfLocations).to.be.a('array');
                                    expect(data.privilegedMemberOfLocations.length).to.equal(0);

                                    done();
                                } catch (err) {
                                    done(err);
                                }
                            }
                        });

                });

            });

            describe('- group owner', function() {

                beforeEach(function(done) {

                    login('groupowner',
                        'secret',
                        done);

                });

                it('- sends groups the user owns (1)', function(done) {

                    request(app)
                        .get(uri)
                        .expect(200, function(err, res) {
                            if (err) {
                                debug(res.text);
                                done(err);
                            } else {
                                try {
                                    var data = JSON.parse(res.text);

                                    expect(data).to.be.a('object');
                                    expect(data.ownedGroups).to.be.a('array');
                                    expect(data.ownedGroups.length).to.equal(1);
                                    expect(data.ownedGroups[0].id).to.equal(parseInt(parse('@groups:name:membershiptest:')));

                                    done();
                                } catch (err) {
                                    done(err);
                                }
                            }
                        });

                });

                it('- sends groups the user is a member of (0)', function(done) {

                    request(app)
                        .get(uri)
                        .expect(200, function(err, res) {
                            if (err) {
                                debug(res.text);
                                done(err);
                            } else {
                                try {
                                    var data = JSON.parse(res.text);

                                    expect(data).to.be.a('object');
                                    expect(data.memberOfGroups).to.be.a('array');
                                    expect(data.memberOfGroups.length).to.equal(0);

                                    done();
                                } catch (err) {
                                    done(err);
                                }
                            }
                        });

                });

                it('- sends groups the user is a privileged member of (0)', function(done) {

                    request(app)
                        .get(uri)
                        .expect(200, function(err, res) {
                            if (err) {
                                debug(res.text);
                                done(err);
                            } else {
                                try {
                                    var data = JSON.parse(res.text);

                                    expect(data).to.be.a('object');
                                    expect(data.privilegedMemberOfGroups).to.be.a('array');
                                    expect(data.privilegedMemberOfGroups.length).to.equal(0);

                                    done();
                                } catch (err) {
                                    done(err);
                                }
                            }
                        });

                });

                it('- sends locations the user is a member of (0)', function(done) {

                    request(app)
                        .get(uri)
                        .expect(200, function(err, res) {
                            if (err) {
                                debug(res.text);
                                done(err);
                            } else {
                                try {
                                    var data = JSON.parse(res.text);

                                    expect(data).to.be.a('object');
                                    expect(data.memberOfLocations).to.be.a('array');
                                    expect(data.memberOfLocations.length).to.equal(0);

                                    done();
                                } catch (err) {
                                    done(err);
                                }
                            }
                        });

                });

                it('- sends locations the user is a privileged member of (0)', function(done) {

                    request(app)
                        .get(uri)
                        .expect(200, function(err, res) {
                            if (err) {
                                debug(res.text);
                                done(err);
                            } else {
                                try {
                                    var data = JSON.parse(res.text);

                                    expect(data).to.be.a('object');
                                    expect(data.privilegedMemberOfLocations).to.be.a('array');
                                    expect(data.privilegedMemberOfLocations.length).to.equal(0);

                                    done();
                                } catch (err) {
                                    done(err);
                                }
                            }
                        });

                });

            });

            describe('- manager', function() {

                beforeEach(function(done) {

                    login('manager',
                        'secret',
                        done);

                });

                it('- sends groups the user owns (0)', function(done) {

                    request(app)
                        .get(uri)
                        .expect(200, function(err, res) {
                            if (err) {
                                debug(res.text);
                                done(err);
                            } else {
                                try {
                                    var data = JSON.parse(res.text);

                                    expect(data).to.be.a('object');
                                    expect(data.ownedGroups).to.be.a('array');
                                    expect(data.ownedGroups.length).to.equal(0);

                                    done();
                                } catch (err) {
                                    done(err);
                                }
                            }
                        });

                });

                it('- sends groups the user is a member of (1)', function(done) {

                    request(app)
                        .get(uri)
                        .expect(200, function(err, res) {
                            if (err) {
                                debug(res.text);
                                done(err);
                            } else {
                                try {
                                    var data = JSON.parse(res.text);

                                    expect(data).to.be.a('object');
                                    expect(data.memberOfGroups).to.be.a('array');
                                    expect(data.memberOfGroups.length).to.equal(1);
                                    expect(data.memberOfGroups[0].id).to.equal(parseInt(parse('@groups:name:membershiptest:')));

                                    done();
                                } catch (err) {
                                    done(err);
                                }
                            }
                        });

                });

                it('- sends groups the user is a privileged member of (0)', function(done) {

                    request(app)
                        .get(uri)
                        .expect(200, function(err, res) {
                            if (err) {
                                debug(res.text);
                                done(err);
                            } else {
                                try {
                                    var data = JSON.parse(res.text);

                                    expect(data).to.be.a('object');
                                    expect(data.privilegedMemberOfGroups).to.be.a('array');
                                    expect(data.privilegedMemberOfGroups.length).to.equal(0);

                                    done();
                                } catch (err) {
                                    done(err);
                                }
                            }
                        });

                });

                it('- sends locations the user is a member of (1)', function(done) {

                    request(app)
                        .get(uri)
                        .expect(200, function(err, res) {
                            if (err) {
                                debug(res.text);
                                done(err);
                            } else {
                                try {
                                    var data = JSON.parse(res.text);

                                    expect(data).to.be.a('object');
                                    expect(data.memberOfLocations).to.be.a('array');
                                    expect(data.memberOfLocations.length).to.equal(1);
                                    expect(data.memberOfLocations[0].id).to.equal(parseInt(parse('@locations:state:membershiptest:')));

                                    done();
                                } catch (err) {
                                    done(err);
                                }
                            }
                        });

                });

                it('- sends locations the user is a privileged member of (1)', function(done) {

                    request(app)
                        .get(uri)
                        .expect(200, function(err, res) {
                            if (err) {
                                debug(res.text);
                                done(err);
                            } else {
                                try {
                                    var data = JSON.parse(res.text);

                                    expect(data).to.be.a('object');
                                    expect(data.privilegedMemberOfLocations).to.be.a('array');
                                    expect(data.privilegedMemberOfLocations.length).to.equal(1);
                                    expect(data.privilegedMemberOfLocations[0].id).to.equal(parseInt(parse('@locations:state:membershiptest:')));

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

    describe('- PATCH', function() {

        var updateUsername = {
            username: 'newusernamewillfail'
        };

        var updatePassword = {
            password: 'newpassword'
        };

        var encryptedPassword = {
            password: encryptKey('newpassword')
        };

        var updateEmail = {
            email: 'newmail@email.com'
        };

        var updateName = {
            firstname: 'newfirstname',
            lastname: 'newlastname'
        };

        describe('- /:id', function() {

            describe('- anonymous user', function() {

                it('- returns 401', function(done) {

                    request(app)
                        .patch(parse('/api/users/@users:username:test_password:'))
                        .send(encryptedPassword)
                        .expect(401, done);

                });

            });

            describe('- logged in user', function() {

                beforeEach(function(done) {

                    login('test_password',
                        'secret',
                        done);

                });


                describe('- self', function() {

                    describe('- update password', function() {

                        beforeEach(function(done) {

                            request(app)
                                .patch(parse('/api/users/@users:username:test_password:'))
                                .send(encryptedPassword)
                                .expect(200, done);

                        });

                        it('- logged out by server', function(done) {

                            request(app)
                                .get(parse('/api/users/@users:username:test_password:'))
                                .expect(401, done);

                        });

                        describe('- login with new password', function() {

                            beforeEach(function(done) {

                                login('test_password',
                                    updatePassword.password,
                                    done);

                            });

                            it('- can access user info', function(done) {

                                request(app)
                                    .get(parse('/api/users/@users:username:test_password:'))
                                    .expect(200, done);

                            });

                        });
                    });

                    it('- cannot update username', function() {

                        request(app)
                            .patch(parse('/api/users/@users:username:test_password:'))
                            .send(updateUsername)

                    });

                    describe('- can update email', function() {

                        beforeEach(function(done) {

                            request(app)
                                .patch(parse('/api/users/@users:username:test_password:'))
                                .send(updateEmail)
                                .expect(200)
                                .end(done);

                        });

                        it('- and see updated email', function(done) {

                            request(app)
                                .get(parse('/api/users/@users:username:test_password:'))
                                .expect('Content-Type', /json/)
                                .expect(200)
                                .end(function(err, res) {
                                    if (err) {
                                        done(err);
                                    }
                                    try {
                                        var data = JSON.parse(res.text);
                                        data.should.be.a('object');

                                        _.each({
                                            email: updateEmail.email
                                        }, function(value, key) {
                                            data.should.have.property(key);
                                            data[key].should.equal(value);
                                        });

                                        done();
                                    } catch (e) {
                                        done(e);
                                    }
                                });

                        });

                    });

                    describe('- can update name', function() {

                        beforeEach(function(done) {

                            request(app)
                                .patch(parse('/api/users/@users:username:test_password:'))
                                .send(updateName)
                                .expect(200)
                                .end(done);

                        });

                        it('- and see updated email', function(done) {

                            request(app)
                                .get(parse('/api/users/@users:username:test_password:'))
                                .expect('Content-Type', /json/)
                                .expect(200)
                                .end(function(err, res) {
                                    if (err) {
                                        done(err);
                                    }
                                    try {
                                        var data = JSON.parse(res.text);
                                        data.should.be.a('object');

                                        _.each({
                                            firstname: updateName.firstname,
                                            lastname: updateName.lastname
                                        }, function(value, key) {
                                            data.should.have.property(key);
                                            data[key].should.equal(value);
                                        });

                                        done();
                                    } catch (e) {
                                        done(e);
                                    }
                                });

                        });

                    });

                });

                describe('- other', function() {

                    it('- cannot update password', function(done) {

                        request(app)
                            .patch(parse('/api/users/@users:username:groupmember:'))
                            .send(updatePassword)
                            .expect(401, done);

                    });

                    it('- cannot update username', function(done) {

                        request(app)
                            .patch(parse('/api/users/@users:username:groupmember:'))
                            .send(updateUsername)
                            .expect(401, done);

                    });

                    it('- cannot update email', function(done) {

                        request(app)
                            .patch(parse('/api/users/@users:username:groupmember:'))
                            .send(updateEmail)
                            .expect(401, done);

                    });

                    it('- cannot update name', function(done) {

                        request(app)
                            .patch(parse('/api/users/@users:username:groupmember:'))
                            .send(updateName)
                            .expect(401, done);

                    });

                })

            });

            describe('- site admin', function() {

                beforeEach(function(done) {
                   login('siteadmin',
                       'secret',
                       done);
                });

                describe('- other', function() {

                    describe('- update password', function() {

                        beforeEach(function(done) {

                            request(app)
                                .patch(parse('/api/users/@users:username:test_password:'))
                                .send(updatePassword)
                                .expect(200, done);

                        });

                        it('- logged out by server', function(done) {

                            request(app)
                                .get(parse('/api/users/@users:username:test_password:'))
                                .expect(401, done);

                        });

                        describe('- login with new password', function() {

                            beforeEach(function(done) {

                                login('test_password',
                                    updatePassword.password,
                                    done);
                            });


                            it('- can access user info', function(done) {

                                request(app)
                                    .get(parse('/api/users/@users:username:test_password:'))
                                    .expect(200, done);

                            });

                        });
                    });

                    it('- cannot update username', function() {

                        request(app)
                            .patch(parse('/api/users/@users:username:test_password:'))
                            .send(updateUsername)

                    });

                    describe('- can update email', function() {

                        beforeEach(function(done) {

                            request(app)
                                .patch(parse('/api/users/@users:username:test_password:'))
                                .send(updateEmail)
                                .expect(200)
                                .end(done);

                        });

                        it('- and see updated email', function(done) {

                            request(app)
                                .get(parse('/api/users/@users:username:test_password:'))
                                .expect('Content-Type', /json/)
                                .expect(200)
                                .end(function(err, res) {
                                    if (err) {
                                        done(err);
                                    }
                                    try {
                                        var data = JSON.parse(res.text);
                                        data.should.be.a('object');

                                        _.each({
                                            email: updateEmail.email
                                        }, function(value, key) {
                                            data.should.have.property(key);
                                            data[value].should.equal(value);
                                        });

                                        done();
                                    } catch (e) {
                                        done(e);
                                    }
                                });

                        });

                    });

                    describe('- can update name', function() {

                        beforeEach(function(done) {

                            request(app)
                                .patch(parse('/api/users/@users:username:test_password:'))
                                .send(updateName)
                                .expect(200)
                                .end(done);

                        });

                        it('- and see updated email', function(done) {

                            request(app)
                                .get(parse('/api/users/@users:username:test_password:'))
                                .expect('Content-Type', /json/)
                                .expect(200)
                                .end(function(err, res) {
                                    if (err) {
                                        done(err);
                                    }
                                    try {
                                        var data = JSON.parse(res.text);
                                        data.should.be.a('object');

                                        _.each({
                                            firstname: updateName.firstname,
                                            lastname: updateName.lastname
                                        }, function(value, key) {
                                            data.should.have.property(key);
                                            data[value].should.equal(value);
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

        });

    });

    describe('- DELETE', function() {

        var userDeletePayload = {
            password: 'secret'
        };

        describe('- /', function() {

            describe('- anonymous user', function() {

                it('- returns 401', function(done) {

                    request(app)
                        .delete('/api/users/')
                        .expect(401, done);

                });

            });

            describe('- logged in user', function() {

                beforeEach(function(done) {

                    login('test_password',
                        'secret',
                        done);

                });

                describe('- deletes their account', function() {

                    beforeEach(function(done) {

                        request(app)
                            .delete(parse('/api/users/@users:username:test_password:'))
                            .send(userDeletePayload)
                            .expect(200, done);

                    });

                    it('- cannot login anymore', function(done) {

                        failToLogin('test_password',
                            'secret',
                            401,
                            done);

                    });

                })

            });

            describe('- site admin', function() {

                beforeEach(function(done) {

                    login('siteadmin',
                        'secret',
                        done);

                });

                it('- fails if only admin account left', function(done) {
                    throw new Error("Not implemented");
                });

            });

        });

        describe('- /:id', function() {

            describe('- anonymous user', function() {

                it('- returns 401', function(done) {

                    request(app)
                        .delete('/api/users/1')
                        .expect(401, done);

                });

            });

            describe('- logged in user', function() {

                beforeEach(function(done) {

                    login('test_password',
                        'secret',
                        done);

                });

                describe('- self', function() {

                    describe('- fails to delete their own account', function() {

                        beforeEach(function(done) {

                            request(app)
                                .delete(parse('/api/users/@users:username:test_password:'))
                                .expect(401, done);

                        });

                        it('- can still login', function(done) {

                            logout(function(err, res) {
                                if (err) {
                                    debug(res.text);
                                    done(err);
                                    return;
                                }
                                login('test_password',
                                    'secret',
                                    done);
                            })

                        });

                    })

                });

                describe('- other', function() {

                    it('- returns 401', function(done) {

                        request(app)
                            .delete(parse('/api/users/@users:username:groupmember:'))
                            .expect(401, done);

                    });

                });

            });

            describe('- site admin', function() {

                beforeEach(function(done) {

                    login('siteadmin',
                        'secret',
                        done);

                });

                describe('- other', function() {

                    it('- returns 200', function(done) {

                        requst(app)
                            .delete(parse('/api/users/@users:username:groupmember:'))
                            .expect(200, done);

                    });

                });

            });

        });

    });

});
