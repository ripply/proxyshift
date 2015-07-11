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

var password = 'secret';

describe("#/session", function() {

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

    describe('- supertest', function() {

        it('- should set session details correctly', function(done) {
            return login('test_password',
                'secret',
                function(err, res) {
                    expect(global.sess).to.not.be.undefined;
                    var sessionCookie = _.find(global.sess.cookies, function(cookie) {
                        return _.has(cookie, 'connect.sid');
                    });
                    expect(sessionCookie).to.not.be.undefined;
                    done();
                });
        });

    });

    describe('- POST', function() {

        describe('- /login', function() {

            describe('- return 401', function() {

                it('- empty password', function(done) {
                    request(app)
                        .post('/session/login')
                        .set('Accept', 'application/json')
                        .send({
                            username: 'test_nopassword',
                            password: '' // correct password due to fixture
                        })
                        .expect(401, done);
                });

            });

            describe('- return 200', function() {

                it('- successfully login', function(done) {
                    login(
                        'test_password',
                        password,
                        function(err, res) {
                            var data = JSON.parse(res.text);
                            expect(data.authenticationToken).to.not.be.null;
                            done()
                        }
                    );
                });

            });

        });

        describe('- /logout', function() {

            describe('- return 401', function() {

                it('- when not logged in', function(done) {
                    request(app)
                        .post('/session/logout')
                        .expect(401, done);
                });

            });

        });

        describe('- /login -> /logout', function(done) {

            it('- successfully login then logout', function(done) {
                login(
                    'test_password',
                    password,
                    function(err, res) {
                        var data = JSON.parse(res.text);
                        expect(data.authenticationToken).to.not.be.null;

                        request(app)
                            .post('/logout')
                            .expect(200)
                            .end(function(err, res) {
                                // TODO VERIFY SESSION CLOSED
                                done();
                            });
                    });

            });

        });

    });
});
