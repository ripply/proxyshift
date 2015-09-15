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
// POST /api/groups/:group_id/users/:user_id/classes/:class_id/permissions/:permission_id

describe('#/api/groups', function() {

    before(function(done){
        require(ROOT_DIR + '/routes/preauth')(app, settings);
        require(ROOT_DIR + '/routes/misc/auth')(app, settings);
        require(ROOT_DIR + '/routes/groups')(app, settings);
        done();
    });

    beforeEach(function(done) {
        global.sess = new global.Session();

        // Done to prevent any server side console logs from the routes
        // to appear on the console when running tests
        //console.log=function(){};
        return global.setFixtures(global.fixtures.base)
            .then(done);
    });

    afterEach(function() {
        expect(global.sess).to.not.be.undefined;
        global.sess.destroy();
    });

    describe('- POST', function() {

        describe('- /', function () {

            describe('- anonymous user', function () {

                it('- return 401', function (done) {

                    request(app)
                        .post('/api/groups')
                        .send({
                            name: 'test_group',
                            state: 'state',
                            city: 'city',
                            address: 'address',
                            zipcode: 12345,
                            weburl: 'weburl',
                            contactemail: 'contactemail@example.com',
                            contactphone: '12435'
                        })
                        .expect(401, done);

                });

            });

            describe('- logged in user', function () {

                beforeEach(function (done) {

                    login('nongroupmember',
                        'secret',
                        done);

                });

                it('- create a group', function (done) {

                    request(app)
                        .post('/api/groups')
                        .send({
                            name: 'test_group',
                            state: 'state',
                            city: 'city',
                            address: 'address',
                            zipcode: 12345,
                            weburl: 'weburl',
                            contactemail: 'contactemail@example.com',
                            contactphone: '12435'
                        })
                        .expect(200)
                        .end(function (err, res) {
                            try {
                                debug(res.text);
                                var data = JSON.parse(res.text);
                                expect(data.id).to.not.be.null;
                                done();
                            } catch (e) {
                                done(e);
                            }
                        });
                });

            });

        });

        describe('- /:group_id/locations', function () {

            var newLocation = {
                state: 'new_state',
                city: 'new_city',
                address: 'new address',
                zipcode: 12345,
                phonenumber: 12345
            };

            describe('- anonymous user', function () {

                it('- return 401', function (done) {

                    request(app)
                        .post(parse('/api/groups/@groups:name:membershiptest:/locations'))
                        .send(newLocation)
                        .expect(401, done);
                });

            });

            describe('- non group member', function () {

                beforeEach(function (done) {

                    login('nongroupmember',
                        'secret',
                        done);

                });

                it('- returns 401', function (done) {

                    request(app)
                        .post(parse('/api/groups/@groups:name:membershiptest:/locations'))
                        .send(newLocation)
                        .expect(401, done);

                });

            });

            describe('- group member', function () {

                beforeEach(function (done) {

                    login('groupmember',
                        'secret',
                        done);

                });

                it('- returns 401', function (done) {

                    request(app)
                        .post(parse('/api/groups/@groups:name:membershiptest:/locations'))
                        .send(newLocation)
                        .expect(401, done);

                });

            });

            describe('- privileged group member', function () {

                beforeEach(function (done) {

                    login('privledgedmember',
                        'secret',
                        done);

                });

                it('- returns 201', function (done) {

                    request(app)
                        .post(parse('/api/groups/@groups:name:membershiptest:/locations'))
                        .send(newLocation)
                        .expect(201)
                        .end(function(err, res) {
                            if (err) {
                                done(err);
                                return;
                            }
                            try {
                                debug(res.text);
                                var data = JSON.parse(res.text);
                                data.should.be.a('object');
                                expect(data.id).to.not.be.undefined;

                                done();
                            } catch (e) {
                                done(e);
                            }
                        });

                });

            });

        });

        describe('- /:group_id/areas', function () {

            var newArea = {
                title: 'new_area'
            };

            describe('- anonymous user', function () {

                it('- return 401', function (done) {

                    request(app)
                        .post(parse('/api/groups/@groups:name:membershiptest:/areas'))
                        .send(newArea)
                        .expect(401, done);
                });

            });

            describe('- non group member', function () {

                beforeEach(function (done) {

                    login('nongroupmember',
                        'secret',
                        done);

                });

                it('- returns 401', function (done) {

                    request(app)
                        .post(parse('/api/groups/@groups:name:membershiptest:/areas'))
                        .send(newArea)
                        .expect(401, done);

                });

            });

            describe('- group member', function () {

                beforeEach(function (done) {

                    login('groupmember',
                        'secret',
                        done);

                });

                it('- returns 401', function (done) {

                    request(app)
                        .post(parse('/api/groups/@groups:name:membershiptest:/areas'))
                        .send(newArea)
                        .expect(401, done);

                });

            });

            describe('- privileged group member', function () {

                beforeEach(function (done) {

                    login('privledgedmember',
                        'secret',
                        done);

                });

                it('- returns 201', function (done) {

                    request(app)
                        .post(parse('/api/groups/@groups:name:membershiptest:/areas'))
                        .send(newArea)
                        .expect(201)
                        .end(function(err, res) {
                            if (err) {
                                done(err);
                                return;
                            }
                            try {
                                debug(res.text);
                                var data = JSON.parse(res.text);
                                data.should.be.a('object');
                                expect(data.id).to.not.be.undefined;

                                done();
                            } catch (e) {
                                done(e);
                            }
                        });

                });

            });

        });

        // :group_id/permissions
        // :group_id/users/:user_id/pdermissions/:permission_id

    });

    describe('- GET', function() {

        describe('- /', function() {

            describe('- anonymous users', function() {

                it('- return 401', function(done) {

                    request(app)
                        .get('/api/groups/')
                        .expect(401, done);

                });

            });

            describe('- group members', function() {

                it('- list all groups they are in or own', function(done) {

                    login('groupmember',
                        'secret',
                        function(err, res) {
                            if (err) {
                                done(err);
                                return;
                            }
                            request(app)
                                .get('/api/groups/')
                                .expect(200)
                                .end(function(err2, res) {
                                    if (err2) {
                                        done(err2);
                                        return;
                                    }
                                    try {
                                        debug(res.text);
                                        var data = JSON.parse(res.text);
                                        data.should.be.a('array');
                                        data.length.should.equal(2);
                                        var match = false;
                                        for (var i = 0; i < data.length; i++) {
                                            if (data[i].id === 2) {
                                                match = true;
                                            }
                                        }
                                        match.should.equal(true);

                                        done();
                                    } catch (e) {
                                        done(e);
                                    }
                                });
                        });

                });

            });

            describe('- group owners', function() {

                it('- list all groups they own', function(done) {

                    login('groupowner',
                        'secret',
                        function(err, res) {
                            if (err) {
                                done(err);
                                return;
                            }
                            request(app)
                                .get('/api/groups/')
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
                                        data.length.should.equal(2);
                                        var match = false;
                                        for (var i = 0; i < data.length; i++) {
                                            if (data[i].id === 2) {
                                                match = true;
                                            }
                                        }
                                        match.should.equal(true);

                                        done();
                                    } catch (e) {
                                        done(e);
                                    }
                                });
                        });

                });

            });

        });

        describe('- /:id', function() {

            describe('- anonymous users', function() {

                it('- fail to access group', function(done) {

                    request(app)
                        .get(parse('/api/groups/@groups:name:membershiptest:'))
                        .expect(401, done);

                });

            });

            describe('- group members', function() {

                it('- successfully access group', function(done) {

                    login('groupmember',
                        'secret',
                        function(err, res) {
                            if (err) {
                                done(err);
                                return;
                            }
                            // logged in, now query group
                            request(app)
                                .get(parse('/api/groups/@groups:name:membershiptest:'))
                                .expect(200, done);
                        });

                });

                it('- fail to access groups they are not a member of', function(done) {

                    login('groupmember',
                        'secret',
                        function(err, res) {
                            if (err) {
                                done(err);
                                return;
                            }
                            // logged in, now query group
                            request(app)
                                .get(parse('/api/groups/@groups:name:test_password_group:'))
                                .expect(401, done);
                        });

                });

            });

            describe('- group owners', function() {

                it('- successfully access group', function(done) {

                    login('groupowner',
                        'secret',
                        function(err, res) {
                            if (err) {
                                done(err);
                                return;
                            }
                            // logged in, now query group
                            request(app)
                                .get(parse('/api/groups/@groups:name:membershiptest:'))
                                .expect(200, done);
                        });

                });

                it('- fail to access groups they are not a member of', function(done) {

                    login('groupmember',
                        'secret',
                        function(err, res) {
                            if (err) {
                                done(err);
                                return;
                            }
                            // logged in, now query group
                            request(app)
                                .get(parse('/api/groups/@groups:name:test_password_group:'))
                                .expect(401, done);
                        });

                });

            });

        });

        describe('- /:group_id/classes', function() {

            describe('- anonymous users', function(e) {

                it('- returns 401', function(done) {

                    request(app)
                        .get(parse('/api/groups/@groups:name:test_password_group:/classes/'))
                        .expect(401, done);

                });

            });

            describe('- non privileged group members', function() {

                beforeEach(function(done) {

                    login('test_member_of_group',
                        'secret',
                        done);

                });

                it('- can fetch group classes', function(done) {

                    request(app)
                        .get(parse('/api/groups/@groups:name:test_password_group:/classes/'))
                        .expect(200)
                        .end(function(err, res) {
                            if (err) {
                                done(err);
                                return;
                            }
                            try {
                                debug(res.text);
                                var data = JSON.parse(res.text);
                                expect(data).to.not.be.null;
                                data.should.be.a('array');
                                var foundUserClass = false;
                                for (var i = 0; i < data.length; i++) {
                                    if (data[i].title == 'User class 1') {
                                        foundUserClass = true;
                                    }
                                }
                                foundUserClass.should.equal(true);

                                done();
                            } catch (e) {
                                done(e);
                            }
                        });

                })

            });

            describe('- non group members', function() {

                beforeEach(function(done) {

                    login('nongroupmember',
                        'secret',
                        done);

                });

                it('- returns 401', function(done) {

                    request(app)
                        .get(parse('/api/groups/@groups:name:test_password_group:/classes/'))
                        .expect(401, done);

                });

            });

        });

        describe('- /:group_id/classes/:class_id', function() {

            describe('- anonymous users', function(e) {

                it('- returns 401', function(done) {

                    request(app)
                        .get(parse('/api/groups/@groups:name:membershiptest:/classes'))
                        .expect(401, done);

                });

            });

            describe('- non privileged group members', function() {

                beforeEach(function(done) {

                    login('groupmember',
                        'secret',
                        done);

                });

                it('- can fetch a specific group class', function(done) {

                    request(app)
                        .get(parse('/api/groups/@groups:name:membershiptest:/classes/@groupuserclasses:title:User class 1:'))
                        .expect(200)
                        .end(function(err, res) {
                            if (err) {
                                done(err);
                                return;
                            }
                            try {
                                debug(res.text);
                                var data = JSON.parse(res.text);
                                expect(data).to.not.be.null;
                                data.should.not.be.a('array');
                                data.should.be.a('object');
                                expect(data.title).to.equal('User class 1');
                                done();
                            } catch (e) {
                                done(e);
                            }
                        });

                })

            });

            describe('- non group members', function() {

                beforeEach(function(done) {

                    login('nongroupmember',
                        'secret',
                        done);

                });

                it('- returns 401', function(done) {

                    request(app)
                        .get(parse('/api/groups/@groups:name:membershiptest:/classes/@groupuserclasses:title:User class 1:'))
                        .expect(401, done);

                });

            });

        });

        describe('- /:group_id/users', function() {

            describe('- anonymous users', function() {

                it('- return 401', function(done) {

                    request(app)
                        .get(parse('/api/groups/@groups:name:membershiptest:/users'))
                        .expect(401, done);

                });

            });

            describe('- group owners', function() {

                beforeEach(function(done) {

                    login('groupowner',
                        'secret',
                        done);

                });

                it('- list all users', function(done) {

                    request(app)
                        .get(parse('/api/groups/@groups:name:membershiptest:/users'))
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
                                for (var i = 0; i < data.length; i++) {
                                    // do not return password or email
                                    expect(data[i].password).to.be.undefined;
                                    expect(data[i].email).to.be.undefined;
                                }

                                done();
                            } catch (e) {
                                done(e);
                            }
                        });

                });

            });

            describe('- group members', function() {

                beforeEach(function(done) {

                    login('groupmember',
                        'secret',
                        done);

                });

                it('- return 401', function(done) {

                    request(app)
                        .get(parse('/api/groups/@groups:name:membershiptest:/users'))
                        .expect(401, done);

                });

            });

            describe('- privileged group member', function() {

                beforeEach(function(done) {

                    login('privledgedmember',
                        'secret',
                        done);

                });

                it('- list all users', function(done) {

                    request(app)
                        .get(parse('/api/groups/@groups:name:membershiptest:/users'))
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
                                for (var i = 0; i < data.length; i++) {
                                    // do not return password or email
                                    expect(data[i].password).to.be.undefined;
                                    expect(data[i].email).to.be.undefined;
                                }

                                done();
                            } catch (e) {
                                done(e);
                            }
                        });

                });

            });

        });

        describe('- /:group_id/users/:user_id', function() {

            describe('- anonymous users', function() {

                it('- return 401', function(done) {

                    request(app)
                        .get('/api/groups/2/users/5')
                        .expect(401, done);

                });

            });

            describe('- group owners', function() {

                beforeEach(function(done) {

                    login('groupowner',
                        'secret',
                        done);

                });

                it('- can get group owner info', function(done) {

                    request(app)
                        .get(parse('/api/groups/@groups:name:membershiptest:/users/@users:firstname:groupowner:'))
                        .expect(200)
                        .end(function(err, res) {
                            if (err) {
                                done(err);
                                return;
                            }
                            try {
                                debug(res.text);
                                var data = JSON.parse(res.text);
                                data.should.be.a('object');
                                expect(data.firstname).to.equal('groupowner');

                                done();
                            } catch (e) {
                                done(e);
                            }
                        });

                });

                it('- can get group member info', function(done) {

                    request(app)
                        .get(parse('/api/groups/@groups:name:membershiptest:/users/@users:firstname:groupmember:'))
                        .expect(200)
                        .end(function(err, res) {
                            if (err) {
                                done(err);
                                return;
                            }
                            try {
                                debug(res.text);
                                var data = JSON.parse(res.text);
                                data.should.be.a('object');
                                expect(data.firstname).to.equal('groupmember');

                                done();
                            } catch (e) {
                                done(e);
                            }
                        });

                });

            });

            describe('- group members', function() {

                beforeEach(function(done) {

                    login('groupmember',
                        'secret',
                        done);

                });

                it('- return 401', function(done) {

                    request(app)
                        .get(parse('/api/groups/@groups:name:membershiptest:/users'))
                        .expect(401, done);

                });

            });

            describe('- privileged group member', function() {

                beforeEach(function(done) {

                    login('privledgedmember',
                        'secret',
                        done);

                });

                it('- can get group owner info', function(done) {

                    request(app)
                        .get(parse('/api/groups/@groups:name:membershiptest:/users/@users:firstname:groupowner:'))
                        .expect(200)
                        .end(function(err, res) {
                            if (err) {
                                done(err);
                                return;
                            }
                            try {
                                debug(res.text);
                                var data = JSON.parse(res.text);
                                data.should.be.a('object');
                                expect(data.firstname).to.equal('groupowner');

                                done();
                            } catch (e) {
                                done(e);
                            }
                        });

                });

                it('- can get group member info', function(done) {

                    request(app)
                        .get(parse('/api/groups/@groups:name:membershiptest:/users/@users:firstname:groupmember:'))
                        .expect(200)
                        .end(function(err, res) {
                            if (err) {
                                done(err);
                                return;
                            }
                            try {
                                debug(res.text);
                                var data = JSON.parse(res.text);
                                data.should.be.a('object');
                                expect(data.firstname).to.equal('groupmember');

                                done();
                            } catch (e) {
                                done(e);
                            }
                        });

                });

            });

        });

        describe('- /:group_id/areas', function() {

            describe('- anonymous users', function() {

                it('- return 401', function(done) {

                    request(app)
                        .get(parse('/api/groups/@groups:name:membershiptest:/areas'))
                        .expect(401, done);

                });

            });

            function getAreas(done) {

                request(app)
                    .get(parse('/api/groups/@groups:name:membershiptest:/areas'))
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
                            data.should.be.a('array');

                            var area = data[0];
                            area.should.be.a('object');
                            expect(area.id).to.not.be.undefined;
                            expect(area.group_id).to.not.be.undefined;
                            expect(area.title).to.equal('membership test area');

                            done();
                        } catch (err2) {
                            done(err2);
                        }
                    });

            }

            describe('- unprivileged group member', function() {

                beforeEach(function(done) {

                    login('groupmember',
                        'secret',
                        done);

                });

                it('- returns 200', function(done) {

                    getAreas(done);

                });

            });

            describe('- group owner', function() {

                beforeEach(function(done) {

                    login('groupowner',
                        'secret',
                        done);

                });

                it('- returns 200', function(done) {

                    getAreas(done);

                });

            });

        });

        /*
        describe('- /:group_id/permissions', function() {

            describe('- anonymous users', function () {

                it('- return 401', function (done) {

                    request(app)
                        .get(parse('/api/groups/@groups:name:membershiptest:/permissions'))
                        .expect(401, done);

                });

            });

            function getGroupPermissions(done) {

                request(app)
                    .get(parse('/api/groups/@groups:name:membershiptest:/permissions'))
                    .expect(200)
                    .end(function(err, res) {
                        if (err) {
                            debug(res.text);
                            done(err);
                            return;
                        }
                        try {
                            var data = JSON.parse(res.text);

                            expect(data).to.be.a('array');
                            var permission = data[0];
                            expect(permission.groupsetting_id).to.not.be.undefined;
                            expect(permission.description).to.not.be.undefined;
                            expect(permission.description).to.equal('unprivileged');
                            expect(permission.permissionlevel).to.equal(1);

                            done();
                        } catch (err2) {
                            done(err2);
                        }
                    });

            }

            describe('- unprivileged group member', function() {

                beforeEach(function(done) {

                    login('groupmember',
                        'secret',
                        done);

                });


                it('- return 200', function(done) {

                    getGroupPermissions(done);

                });

            });

            describe('- group owner', function() {

                beforeEach(function(done) {

                    login('groupowner',
                        'secret',
                        done);

                });


                it('- return 200', function(done) {

                    getGroupPermissions(done);

                });

            });

        });
        */

    });

    var updatedInformation = {
        name: 'updated_name',
        state: 'updated state',
        city: 'updated city',
        address: 'updated addresss',
        zipcode: 54321,
        weburl: 'updated url',
        contactemail: 'updated_email@example.com',
        contactphone: 54321
    };

    var updatedClassInformation = {
        title: 'Updated title',
        description: 'Updated description'
    };

    describe('- PATCH', function() {

        describe('- /:id', function() {

            describe('- anonymous user', function() {

                it('- return 401', function(done) {

                    return request(app)
                        .patch(parse('/api/groups/@groups:name:membershiptest:'))
                        .send(updatedInformation)
                        .expect(401, done);

                });

            });

            function updateAllGroupInformation(done) {

                debug("Sending updated group information: ");
                debug(updatedInformation);

                return request(app)
                    .patch(parse('/api/groups/@groups:name:membershiptest:'))
                    .send(updatedInformation)
                    .expect(200)
                    .end(function(err, res) {
                        if (err) {
                            done(err);
                            return;
                        }
                        return request(app)
                            .get(parse('/api/groups/@groups:name:membershiptest:'))
                            .expect(200)
                            .end(function(err2, res2) {
                                if (err2) {
                                    done(err);
                                    return
                                }
                                debug(res2.text);
                                var data = JSON.parse(res2.text);
                                debug(data);
                                try {
                                    data.should.not.be.a('array');
                                    data.should.be.a('object');
                                    _.each(updatedInformation, function (value, key) {
                                        debug('key: ' + key);
                                        debug('value: ' + value);
                                        debug("Looking for key: " + key);
                                        debug("its value is: " + data[key]);
                                        data.should.have.property(key);
                                        debug(data[key] + " =? " + value);
                                        data[key].should.equal(value);
                                    });

                                    done();
                                } catch (e) {
                                    done(e);
                                }
                            });
                    });

            }

            function updatePartialGroupInformation(done) {

                var updatedInformationCopy = _.clone(updatedInformation);
                delete updatedInformationCopy['name'];

                request(app)
                    .patch(parse('/api/groups/@groups:name:membershiptest:'))
                    .send(_.pick(updatedInformation, 'name'))
                    .expect(200)
                    .end(function(err, res) {
                        if (err) {
                            debug(res.text);
                            done(err);
                            return;
                        }
                        return request(app)
                            .get(parse('/api/groups/@groups:name:membershiptest:'))
                            .expect(200)
                            .end(function(err2, res2) {
                                if (err2) {
                                    debug(res2.text);
                                    done(err);
                                    return;
                                }
                                try {
                                    var data = JSON.parse(res2.text);
                                    debug(data);
                                    data.name.should.equal(updatedInformation.name);

                                    _.each(updatedInformationCopy, function (value, key) {
                                        data[key].should.not.equal(value);
                                    });

                                    done();
                                } catch (e) {
                                    done(e);
                                }
                            });
                    });

            }

            describe('- group owner', function() {

                beforeEach(function(done) {

                    login('groupowner',
                        'secret',
                        done);

                });

                it('- update all group information', updateAllGroupInformation);

                it('- update some group information', updatePartialGroupInformation);

            });

            describe('- nonprivileged group member', function() {

                beforeEach(function(done) {

                    login('test_member_of_group',
                        'secret',
                        done);

                });

                it('- return 401', function(done) {

                    return request(app)
                        .patch(parse('/api/groups/@groups:name:membershiptest:'))
                        .send(updatedInformation)
                        .expect(401, done);
                });


            });

            describe('- privileged group member', function() {

                beforeEach(function(done){

                    login('privledgedmember',
                        'secret',
                        done);

                });

                it('- update all group information', updateAllGroupInformation);

                it('- update some group information', updatePartialGroupInformation);

            });

        });

        describe('- /:group_id/classes/:class_id', function() {

            describe('- anonymous user', function() {

                it('- return 401', function(done) {

                    return request(app)
                        .patch(parse('/api/groups/@groups:name:membershiptest:'))
                        .send(updatedClassInformation)
                        .expect(401, done);

                });

            });

            function updateAllClassInformation(done) {

                debug("Sending updated user class information: ");
                debug(updatedClassInformation);

                return request(app)
                    .patch(parse('/api/groups/@groups:name:membershiptest:/classes/@groupuserclasses:title:User class 1:'))
                    .send(updatedClassInformation)
                    .expect(200)
                    .end(function(err, res) {
                        if (err) {
                            debug(res.text);
                            done(err);
                            return;
                        }
                        debug("Successfully was able to patch class");
                        return request(app)
                            .get(parse('/api/groups/@groups:name:membershiptest:/classes/@groupuserclasses:title:User class 1:'))
                            .expect(200)
                            .end(function(err2, res2) {
                                if (err2) {
                                    debug(res2.text);
                                    done(err2);
                                    return;
                                }
                                debug(res2.text);
                                var data = JSON.parse(res2.text);
                                debug(data);
                                try {
                                    data.should.not.be.a('array');
                                    data.should.be.a('object');
                                    _.each(updatedClassInformation, function (value, key) {
                                        debug('key: ' + key);
                                        debug('value: ' + value);
                                        debug("Looking for key: " + key);
                                        debug("its value is: " + data[key]);
                                        data.should.have.property(key);
                                        debug(data[key] + " =? " + value);
                                        data[key].should.equal(value);
                                    });

                                    done();
                                } catch (e) {
                                    done(e);
                                }
                            });
                    });

            }

            function updatePartialClassInformation(done) {

                var updatedClassInformationCopy = _.clone(updatedClassInformation);
                delete updatedClassInformationCopy['title'];

                request(app)
                    .patch(parse('/api/groups/@groups:name:membershiptest:/classes/@groupuserclasses:title:User class 1:'))
                    .send(_.pick(updatedClassInformation, 'title'))
                    .expect(200)
                    .end(function(err, res) {
                        if (err) {
                            done(err);
                            return;
                        }
                        debug(res.text);
                        return request(app)
                            .get(parse('/api/groups/@groups:name:membershiptest:/classes/@groupuserclasses:title:User class 1:'))
                            .expect(200)
                            .end(function(err2, res2) {
                                if (err2) {
                                    done(err2);
                                    return;
                                }
                                try {
                                    var data = JSON.parse(res2.text);
                                    debug(data);
                                    data.title.should.equal(updatedClassInformation.title);

                                    _.each(updatedClassInformationCopy, function (value, key) {
                                        data[key].should.not.equal(value);
                                    });

                                    done();
                                } catch (e) {
                                    done(e);
                                }
                            });
                    });

            }

            describe('- group owner', function() {

                beforeEach(function(done) {

                    login('groupowner',
                        'secret',
                        done);

                });

                it('- update all user class information', updateAllClassInformation);

                it('- update some user class information', updatePartialClassInformation);

            });

            describe('- nonprivileged group member', function() {

                beforeEach(function(done) {

                    login('test_member_of_group',
                        'secret',
                        done);

                });

                it('- return 401', function(done) {

                    return request(app)
                        .patch(parse('/api/groups/@groups:name:membershiptest:/classes/@groupuserclasses:title:User class 1:'))
                        .send(updatedClassInformation)
                        .expect(401, done);
                });


            });

            describe('- privileged group member', function() {

                beforeEach(function(done){

                    login('privledgedmember',
                        'secret',
                        done);

                });

                it('- update all user class information', updateAllClassInformation);

                it('- update some user class information', updatePartialClassInformation);

            });

        });

        // :group_id/permissions
        // :group_id/users/:user_id/permissions/:permission_id

    });

    describe('- DELETE', function() {

        describe('- /:group_id', function() {

            describe('- anonymous user', function() {

                it('- returns 401', function(done) {

                    return request(app)
                        .delete(parse('/api/groups/@groups:name:membershiptest:'))
                        .expect(401, done);

                });

            });

            describe('- group owner', function() {

                beforeEach(function(done) {

                    login('groupowner',
                        'secret',
                        done);

                });

                it('- returns 200', function(done) {

                    request(app)
                        .delete(parse('/api/groups/@groups:name:membershiptest:'))
                        .expect(200)
                        .end(function(err, res) {
                            if (err) {
                                done(err);
                                return;
                            }
                            debug(res.text);
                            request(app)
                                .get(parse('/api/groups/@groups:name:membershiptest:'))
                                .expect(401, done);
                        });

                });

            });

            describe('- privileged group member', function(){

                beforeEach(function(done) {
                    login('privledgedmember',
                        'secret',
                        done);
                });

                it('- returns 401', function(done) {

                    request(app)
                        .delete(parse('/api/groups/@groups:name:membershiptest:'))
                        .expect(401, done);

                })

            });

            describe('- group member', function(){

                beforeEach(function(done) {
                    login('groupmember',
                        'secret',
                        done);
                });

                it('- returns 401', function(done) {

                    request(app)
                        .delete(parse('/api/groups/@groups:name:membershiptest:'))
                        .expect(401, done);

                })

            });

        });

        describe('- /:group_id/classes/:class_id', function() {

            describe('- anonymous user', function() {

                it('- returns 401', function(done) {

                    return request(app)
                        .delete(parse('/api/groups/@groups:name:membershiptest:/classes/@groupuserclasses:title:User class 1:'))
                        .expect(401, done);

                });

            });

            describe('- group owner', function() {

                beforeEach(function(done) {

                    login('groupowner',
                        'secret',
                        done);

                });

                it('- returns 200', function(done) {

                    request(app)
                        .get(parse('/api/groups/@groups:name:membershiptest:/classes/@groupuserclasses:title:User class 1:'))
                        .expect(200)
                        .end(function(err, res) {
                            if (err) {
                                debug(res);
                                done(err);
                                return;
                            }
                            request(app)
                                .delete(parse('/api/groups/@groups:name:membershiptest:/classes/@groupuserclasses:title:User class 1:'))
                                .expect(200)
                                .end(function(err2, res2) {
                                    if (err2) {
                                        debug(res2);
                                        done(err2);
                                        return;
                                    }
                                    request(app)
                                        .get(parse('/api/groups/@groups:name:membershiptest:/classes/@groupuserclasses:title:User class 1:'))
                                        .expect(403, done);
                                });
                        });

                });

            });

            describe('- privileged group member', function(){

                beforeEach(function(done) {
                    login('privledgedmember',
                        'secret',
                        done);
                });

                it('- returns 401', function(done) {

                    request(app)
                        .delete(parse('/api/groups/@groups:name:membershiptest:/classes/@groupuserclasses:title:User class 1:'))
                        .expect(401, done);

                })

            });

            describe('- very privileged group member', function(){

                beforeEach(function(done) {
                    login('veryprivileged',
                        'secret',
                        done);
                });

                it('- returns 200', function(done) {

                    request(app)
                        .delete(parse('/api/groups/@groups:name:membershiptest:/classes/@groupuserclasses:title:User class 1:'))
                        .expect(200, done);

                })

            });

            describe('- group member', function(){

                beforeEach(function(done) {
                    login('groupmember',
                        'secret',
                        done);
                });

                it('- returns 401', function(done) {

                    request(app)
                        .delete(parse('/api/groups/@groups:name:membershiptest:'))
                        .expect(401, done);

                })

            });

        });

        describe('- /:group_id/users/:user_id', function() {

            describe('- anonymous user', function() {

                it('- returns 401', function(done) {

                    return request(app)
                        .delete(parse('/api/groups/@groups:name:membershiptest:/users/@users:username:test_member_of_group:'))
                        .expect(401, done);

                });

            });

            function removeUserFromGroupTest(done) {
                request(app)
                    .get(parse('/api/groups/@groups:name:membershiptest:/users/@users:username:groupmember:'))
                    .expect(200)
                    .end(function(err, res) {
                        if (err) {
                            debug(res.text);
                            done(err);
                            return;
                        }
                        request(app)
                            .delete(parse('/api/groups/@groups:name:membershiptest:/users/@users:username:groupmember:'))
                            .expect(200)
                            .end(function(err2, res2) {
                                if (err2) {
                                    debug(res2.text);
                                    done(err2);
                                    return;
                                }
                                request(app)
                                    .get(parse('/api/groups/@groups:name:membershiptest:/users/@users:username:groupmember:'))
                                    .expect(403, done);
                            });
                    });
            }

            describe('- group owner', function() {

                beforeEach(function(done) {

                    login('groupowner',
                        'secret',
                        done);

                });

                it('- returns 200', function(done) {

                    removeUserFromGroupTest(done);

                });

            });

            describe('- privileged group member', function(){

                beforeEach(function(done) {
                    login('privledgedmember',
                        'secret',
                        done);
                });

                it('- returns 200', function(done) {

                    removeUserFromGroupTest(done);

                })

            });

            describe('- group member', function(){

                beforeEach(function(done) {
                    login('groupmember',
                        'secret',
                        done);
                });

                it('- returns 401', function(done) {

                    request(app)
                        .delete(parse('/api/groups/@groups:name:membershiptest:/users/@users:username:test_member_of_group:'))
                        .expect(401, done);

                })

            });

        });

        describe('- /:group_id/locations/:location_id', function() {

            describe('- anonymous user', function() {

                it('- returns 401', function(done) {

                    return request(app)
                        .delete(parse('/api/groups/@groups:name:membershiptest:/locations/@locations:state:membershiptest:'))
                        .expect(401, done);

                });

            });

            function removeLocationFromGroupTest(done) {
                request(app)
                    .get(parse('/api/locations/@locations:state:membershiptest:'))
                    .expect(200)
                    .end(function(err, res) {
                        if (err) {
                            debug(res.text);
                            done(err);
                            return;
                        }
                        try {
                            var data = JSON.parse(res.text);
                            expect(data.group_id).to.equal(parse('@groups:name:membershiptest:'));
                        } catch (err) {
                            done(err);
                            return;
                        }
                        request(app)
                            .delete(parse('/api/groups/@groups:name:membershiptest:/locations/@locations:state:membershiptest:'))
                            .expect(200)
                            .end(function(err2, res2) {
                                if (err2) {
                                    debug(res2.text);
                                    done(err2);
                                    return;
                                }
                                request(app)
                                    .get(parse('/api/locations/@locations:state:membershiptest:/api/groups/@groups:name:membershiptest:/locations/@locations:state:membershiptest:'))
                                    .expect(403, done);
                            });
                    });
            }

            describe('- group owner', function() {

                beforeEach(function(done) {

                    login('groupowner',
                        'secret',
                        done);

                });

                it('- returns 200', function(done) {

                    removeLocationFromGroupTest(done);

                });

            });

            describe('- privileged group member', function(){

                beforeEach(function(done) {
                    login('privledgedmember',
                        'secret',
                        done);
                });

                it('- returns 200', function(done) {

                    removeLocationFromGroupTest(done);

                })

            });

            describe('- group member', function(){

                beforeEach(function(done) {
                    login('groupmember',
                        'secret',
                        done);
                });

                it('- returns 401', function(done) {

                    request(app)
                        .delete(parse('/api/groups/@groups:name:membershiptest:/users/@users:username:test_member_of_group:'))
                        .expect(401, done);

                })

            });

        });

        // :group_id/areas/:area_id
        // :group_id/permissions/:permission_id

    });

});
