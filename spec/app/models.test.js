/* jshint -W030 */
var models = require('../../app/models');
var ROOT_DIR = global.ROOT_DIR;
var app = global.app;
var request = global.request;
var settings = {};
var Promise = require('bluebird');
var ready = models.onDatabaseReady;
var expect = global.expect;

describe("#/session", function() {

    before(function(done){
        require(ROOT_DIR + '/routes/preauth')(app, settings);
        require(ROOT_DIR + '/routes/misc/auth')(app, settings);
        require(ROOT_DIR + '/routes/users')(app, settings);
        done();
    });

    beforeEach(function(){
        this.sess = new global.Session();

        // Done to prevent any server side console logs from the routes
        // to appear on the console when running tests
        //console.log=function(){};
        global.setFixtures(global.fixtures.base)
            .then(function() {
                console.log('Fixtures are complete');
            })
    });

    afterEach(function() {
        this.sess.destroy();
    });

    function login(username, password, next) {
        request(app)
            .post('/session/login')
            .set('Accept', 'application/json')
            .send({
                username: username,
                password: password
            })
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function(err, res) {
                console.log(res.text);
                var data = JSON.parse(res.text);
                expect(data.authenticationToken).to.not.be.null;
                next();
            });
    }

    describe('/login', function() {

        it('- should return non 401 for an empty password', function(done) {
            request(app)
                .post('/session/login')
                .set('Accept', 'application/json')
                .send({
                    username: 'test_nopassword',
                    password: '' // correct password due to fixture
                })
                .expect(401, done);
        });

        it('- should be able to login, return status 200 and return ', function(done) {
            login(
                'test_password',
                'test_password',
                done
            );
        });

    });

    describe('/logout', function() {

        it('- should return 401 when logging out and not logged in', function(done) {
            request(app)
                .post('/session/logout')
                .expect(401, done);
        });

    });

    describe('/login -> /logout', function(done) {

        it('- should be able to login then logout', function(done) {
            login(
                'test_password',
                'test_password',
                function() {
                    console.log(res.text);
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

describe('#/api/users', function(){

    var log = console.log;

    before(function(done){
        require(ROOT_DIR + '/routes/preauth')(app, settings);
        require(ROOT_DIR + '/routes/misc/auth')(app, settings);
        require(ROOT_DIR + '/routes/users')(app, settings);
        done();
    });

    beforeEach(function(){
        // Done to prevent any server side console logs from the routes
        // to appear on the console when running tests
        //console.log=function(){};
        global.setFixtures(global.fixtures.base)
            .then(function() {
                //console.log('Fixtures are complete');
            })
    });

    it('- should GET users', function(done){
        request(app)
            .get('/api/users')
            .end(function(err, res){
                // Enable the console log to print the assertion output
                console.log = log;
                //var data = JSON.parse(res.text);
                //expect(err).to.be.null;
                //expect(data.length).to.equal(3);
                done();
            });
    });

    it('- should GET a user at index (1)', function(done){
        request(app)
            .get('/api/users/1')
            .end(function(err, res){
                // Enable the console log
                console.log = log;
                //var data = JSON.parse(res.text);
                //expect(err).to.be.null;
                //expect(data.name).to.equal('Jony Ive');
                done();
            });
    });

    it('- should POST a user and get back a response', function(done){
        var user = {
            name: 'Steve Wozniak'
        };

        request(app)
            .post('/api/users')
            .send(user)
            .end(function(err, res){
                // Enable the console log
                //console.log = log;
                //var data = JSON.parse(res.text);
                //expect(err).to.be.null;
                //expect(data.name).to.equal(user.name);
                done();
            });
    });
});