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

            describe('- group owner', function() {

                beforeEach(function(done) {

                    login('groupowner',
                        'secret',
                        done);

                });

                it('- update all group information', function(done) {

                    return request(app)
                        .patch('/api/groups/2')
                        .send(updatedInformation)
                        .expect(200)
                        .end(function(err, res) {
                            return request(app)
                                .get('/api/groups/2')
                                .expect(200)
                                .end(function(err2, res2) {
                                    var data = JSON.parse(res2.text);
                                    try {
                                        _.each(updatedInformation, function (value, key) {
                                            res2.body.should.have.property(data[key]);
                                            res2.body.should.equal(data[key], value);
                                        });

                                        done();
                                    } catch (e) {
                                        done(e);
                                    }
                                });
                        });

                });

                it('- update some group information', function(done) {

                    var updatedInformationCopy = _.clone(updatedInformation);
                    delete updatedInformationCopy['name'];

                    request(app)
                        .patch('/api/groups/2')
                        .send(updatedInformation.name)
                        .expect(200)
                        .end(function(err, res) {
                            return request(app)
                                .get('/api/groups/2')
                                .expect(200)
                                .end(function(err2, res2) {
                                    try {
                                        var data = JSON.parse(res2.text);
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

                });

            });

            describe('- nonprivileged group member', function() {

                beforeEach(function(done) {

                    login('groupmember',
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

                    login('privilegedgroupmember',
                        'secret',
                        done);

                });

                it('- update all group information', function(done) {

                    return request(app)
                        .patch('/api/groups/2')
                        .send(updatedInformation)
                        .expect(200)
                        .end(function(err, res) {
                            return request(app)
                                .get('/api/groups/2')
                                .expect(200)
                                .end(function(err2, res2) {
                                    var data = JSON.parse(res2.text);
                                    try {
                                        _.each(updatedInformation, function (value, key) {
                                            res2.body.should.have.property(data[key]);
                                            res2.body.should.equal(data[key], value);
                                        });

                                        done();
                                    } catch (e) {
                                        done(e);
                                    }
                                });
                        });

                });

                it('- update some group information', function(done) {

                    var updatedInformationCopy = _.clone(updatedInformation);
                    delete updatedInformationCopy['name'];

                    request(app)
                        .patch('/api/groups/2')
                        .send(updatedInformation.name)
                        .expect(200)
                        .end(function(err, res) {
                            return request(app)
                                .get('/api/groups/2')
                                .expect(200)
                                .end(function(err2, res2) {
                                    try {
                                        var data = JSON.parse(res2.text);
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

                });

            });

        });

    });

    describe('- DELETE', function() {

        describe('- /:id', function() {

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
                    login('privledgegroupmember',
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

    });

});
