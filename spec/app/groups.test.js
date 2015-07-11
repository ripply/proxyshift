var models = require('../../app/models');
var ROOT_DIR = global.ROOT_DIR;
var app = global.app;
//var request = global.request;
var request = function(app) {
    return global.sess;
};
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

    beforeEach(function(){
        global.sess = new global.Session();

        // Done to prevent any server side console logs from the routes
        // to appear on the console when running tests
        //console.log=function(){};
        return global.setFixtures(global.fixtures.base);
    });

    afterEach(function() {
        expect(global.sess).to.not.be.undefined;
        global.sess.destroy();
    });

    describe('- POST', function() {

        describe('- /', function() {

            describe('- any user', function() {

                it('- can create a group', function(done) {
                    expect(global.sess).to.not.be.undefined;
                    return login('test_password',
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
                                    var data = JSON.parse(res.text);
                                    expect(data.id).to.not.be.null;
                                    done();
                                });
                        });

                });

            });

        });

    });

    describe('- GET', function() {

        describe('- /', function() {

            describe('- group members', function() {

                it('- list all groups they are in', function(done) {

                    login('groupmember',
                        'secret',
                        function(err, res) {
                            request(app)
                                .get('/api/groups/')
                                .expect(200)
                                .end(function(err, res) {
                                    var data = JSON.parse(res.text);
                                    expect(data).to.be.a('array');
                                    expect(data.length).to.equal(1);
                                    expect(data[0].id).to.equal(2);
                                    done();
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
                                    var data = JSON.parse(res.text);
                                    expect(data).to.be.a('array');
                                    expect(data.length).to.equal(1);
                                    expect(data[0].id).to.equal(2);
                                    done();
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

            });

        });

    });

    /*
    // auth.js disables authentication for tests, no need to test
    it('- must be logged in to create a group', function(done) {

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
            .expect(401, done);

    });
    */

});
