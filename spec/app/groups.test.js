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

        describe('- /', function() {

            describe('- anonymous user', function() {

                it('- create a group', function(done) {

                    login('test_password',
                        'secret',
                        function(err, res) {
                            // logged in, now create a group
                            request(app)
                                .post('/api/groups')
                                .send({
                                    name: 'test_group',
                                    state: 'state',
                                    city: 'city',
                                    address: 'address',
                                    zipcode: 'zipcode',
                                    weburl: 'weburl',
                                    contactemail: 'contactemail@example.com',
                                    contactphone: '12435'
                                })
                                .expect(200)
                                .end(function(err, res) {
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

            describe('- logged in user', function() {

                beforeEach(function(done){

                    login('nongroupmember',
                        'secret',
                        done);

                });

                it('- create a group', function(done) {

                    request(app)
                        .post('/api/groups')
                        .send({
                            name: 'test_group',
                            state: 'state',
                            city: 'city',
                            address: 'address',
                            zipcode: 'zipcode',
                            weburl: 'weburl',
                            contactemail: 'contactemail@example.com',
                            contactphone: '12435'
                        })
                        .expect(200)
                        .end(function(err, res) {
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
                            request(app)
                                .get('/api/groups/')
                                .expect(200)
                                .end(function(err, res) {
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
                            request(app)
                                .get('/api/groups/')
                                .expect(200)
                                .end(function(err, res) {
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
                        .get('/api/groups/2')
                        .expect(401, done);

                });

            });

            describe('- group members', function() {

                it('- successfully access group', function(done) {

                    login('groupmember',
                        'secret',
                        function(err, res) {
                            // logged in, now query group
                            request(app)
                                .get('/api/groups/2')
                                .expect(200, done);
                        });

                });

                it('- fail to access groups they are not a member of', function(done) {

                    login('groupmember',
                        'secret',
                        function(err, res) {
                            // logged in, now query group
                            request(app)
                                .get('/api/groups/1')
                                .expect(401, done);
                        });

                });

            });

            describe('- group owners', function() {

                it('- successfully access group', function(done) {

                    login('groupowner',
                        'secret',
                        function(err, res) {
                            // logged in, now query group
                            request(app)
                                .get('/api/groups/2')
                                .expect(200, done);
                        });

                });

                it('- fail to access groups they are not a member of', function(done) {

                    login('groupmember',
                        'secret',
                        function(err, res) {
                            // logged in, now query group
                            request(app)
                                .get('/api/groups/1')
                                .expect(401, done);
                        });

                });

            });

        });

        describe('- /:group_id/classes', function() {

            describe('- anonymous users', function(e) {

                it('- returns 401', function(done) {

                    request(app)
                        .get('/api/groups/1/classes/')
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
                        .get('/api/groups/1/classes/')
                        .expect(200)
                        .end(function(err, res) {
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
                        .get('/api/groups/1/classes/')
                        .expect(401, done);

                });

            });

        });

        describe('- /:group_id/classes/:class_id', function() {

            describe('- anonymous users', function(e) {

                it('- returns 401', function(done) {

                    request(app)
                        .get('/api/groups/1/classes')
                        .expect(401, done);

                });

            });

            describe('- non privileged group members', function() {

                beforeEach(function(done) {

                    login('test_member_of_group',
                        'secret',
                        done);

                });

                it('- can fetch a specific group class', function(done) {

                    request(app)
                        .get('/api/groups/1/classes/1')
                        .expect(200)
                        .end(function(err, res) {
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
                        .get('/api/groups/1/classes/1')
                        .expect(401, done);

                });

            });

        });

        describe('- /:group_id/users', function() {

            describe('- anonymous users', function() {

                it('- return 401', function(done) {

                    request(app)
                        .get('/api/groups/2/users')
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
                        .get('/api/groups/2/users')
                        .expect(200)
                        .end(function(err, res) {
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
                        .get('/api/groups/2/users')
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
                        .get('/api/groups/2/users')
                        .expect(200)
                        .end(function(err, res) {
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
                        .patch('/api/groups/2')
                        .send(updatedInformation)
                        .expect(401, done);

                });

            });

            function updateAllGroupInformation(done) {

                debug("Sending updated group information: ");
                debug(updatedInformation);

                return request(app)
                    .patch('/api/groups/2')
                    .send(updatedInformation)
                    .expect(200)
                    .end(function(err, res) {
                        return request(app)
                            .get('/api/groups/2')
                            .expect(200)
                            .end(function(err2, res2) {
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
                    .patch('/api/groups/2')
                    .send(_.pick(updatedInformation, 'name'))
                    .expect(200)
                    .end(function(err, res) {
                        return request(app)
                            .get('/api/groups/2')
                            .expect(200)
                            .end(function(err2, res2) {
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
                        .patch('/api/groups/2')
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
                        .patch('/api/groups/2')
                        .send(updatedClassInformation)
                        .expect(401, done);

                });

            });

            function updateAllClassInformation(done) {

                debug("Sending updated user class information: ");
                debug(updatedClassInformation);

                return request(app)
                    .patch('/api/groups/2classes/1')
                    .send(updatedClassInformation)
                    .expect(200)
                    .end(function(err, res) {
                        return request(app)
                            .get('/api/groups/2/classes/1')
                            .expect(200)
                            .end(function(err2, res2) {
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
                delete updatedClassInformationCopy['name'];

                request(app)
                    .patch('/api/groups/2/classes/1')
                    .send(_.pick(updatedClassInformation, 'name'))
                    .expect(200)
                    .end(function(err, res) {
                        return request(app)
                            .get('/api/groups/2/classes/1')
                            .expect(200)
                            .end(function(err2, res2) {
                                try {
                                    var data = JSON.parse(res2.text);
                                    debug(data);
                                    data.name.should.equal(updatedClassInformation.name);

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
                        .patch('/api/groups/1/classes/1')
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

    });

    describe('- DELETE', function() {

        describe('- /:group_id', function() {

            describe('- anonymous user', function() {

                it('- returns 401', function(done) {

                    return request(app)
                        .delete('/api/groups/2')
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
                        .delete('/api/groups/2')
                        .expect(200)
                        .end(function(err, res) {
                            request(app)
                                .get('/api/groups/2')
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
                        .delete('/api/groups/2')
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
                        .delete('/api/groups/2')
                        .expect(401, done);

                })

            });

        });

        describe('- /:group_id/classes/:class_id', function() {

            describe('- anonymous user', function() {

                it('- returns 401', function(done) {

                    return request(app)
                        .delete('/api/groups/1/classes/1')
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
                        .get('/api/groups/1/classes/1')
                        .expect(200)
                        .end(function(err, res) {
                            request(app)
                                .delete('/api/groups/1/classes/1')
                                .expect(200)
                                .end(function(err2, res2) {
                                    request(app)
                                        .get('/api/groups/1/classes/1')
                                        .expect(401, done);
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
                        .delete('/api/groups/1/classes/1')
                        .expect(401, done);

                })

            });

            describe('- very privileged group member', function(){

                beforeEach(function(done) {
                    login('veryprivledgedmember',
                        'secret',
                        done);
                });

                it('- returns 200', function(done) {

                    request(app)
                        .delete('/api/groups/1/classes/1')
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
                        .delete('/api/groups/2')
                        .expect(401, done);

                })

            });

        });

    });

});
