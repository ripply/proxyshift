/* jshint -W030 */
var models = require('../../app/models');
var ROOT_DIR = global.ROOT_DIR;
var app = global.app;
var request = global.request;
var settings = {auth: true};
var Promise = require('bluebird');
var ready = models.onDatabaseReady;
var expect = global.expect;

var password = 'secret';
var login = require('../common').login;

describe('#/api/users', function(){

    var log = console.log;

    before(function(done){
        require(ROOT_DIR + '/routes/preauth')(app, settings);
        require(ROOT_DIR + '/routes/misc/auth')(app, settings);
        require(ROOT_DIR + '/routes/users')(app, settings);
        done();
    });

    beforeEach(function(done){
        this.sess = new global.Session();

        // Done to prevent any server side console logs from the routes
        // to appear on the console when running tests
        //console.log=function(){};
        global.setFixtures(global.fixtures.base)
            .then(done);
    });

    afterEach(function() {
        this.sess.destroy();
    });

    describe('- POST', function() {

        describe('- anonymous user', function() {

            it('- create a user then login successfully', function(done) {
                var username = 'createduser';
                request(app)
                    .post('/api/users')
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
                        pagernumer: '12435'
                    })
                    .expect(200)
                    .end(function(err, res) {
                        login(
                            username,
                            password,
                            function(err2, res2) {
                                try {
                                    var data = JSON.parse(res2.text);
                                    expect(data.authenticationToken).to.not.be.null;
                                } catch (e) {
                                    done(e);
                                }
                                done();
                            }
                        );
                    });
            });

        });

    });

});
