var models = require('../../app/models');
var ROOT_DIR = global.ROOT_DIR;
var app = global.app;
var request = global.request;
var settings = {};
var Promise = require('bluebird');
var ready = models.onDatabaseReady;
var expect = global.expect;

describe('#/api/groups', function() {

    before(function(done){
        require(ROOT_DIR + '/routes/preauth')(app, settings);
        require(ROOT_DIR + '/routes/misc/auth')(app, settings);
        require(ROOT_DIR + '/routes/groups')(app, settings);
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

    it('- any user should be able to create a group', function(done) {

        request(app)
            .post('/session/login')
            .set('Accept', 'application/json')
            .send({
                username: 'test_password',
                password: 'secret'
            })
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function(err, res) {
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