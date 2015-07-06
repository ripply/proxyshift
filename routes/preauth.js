var middleware = require('./misc/middleware'),
    _ = require('underscore'),
    models = require('../app/models'),
    passport = require('passport');

require('./../app/configure_passport');

var ensureCsrf = middleware.ensureCsrf;
var requireJson = middleware.requireJson;
var ensureAuthenticated = middleware.ensureAuthenticated;
var ensureDatabaseReady = models.databaseReadyMiddleware;

module.exports = function(app, settings){

    var url = require('url'),
        express = require('express'),
        preauthRouter = express.Router(),
        home = require('../controllers/home'),
        users = require('../controllers/users');

    /*
    app.use(function(req, res, next) {
        console.log('Received request');
        next();
    });
    */

    app.get('/', home.index);

    // middleware to ensure that database is in an OK state for each request
    app.use(ensureDatabaseReady);

    app.get('/csrf', function(req, res, next) {
        console.log("Issuing new csrf token...");
        res.cookie('XSRFTOKEN', req.csrfToken());
        console.log(req.session);
        res.send(200);
        console.log("Sent 200 response");
    });

    app.post('/session/login', requireJson, function(req, res, next) {
        passport.authenticate('local', {session: true}, function (err, user, info) {
            if (err) { return next(err); }
            // authentication failed, send 401 unauthorized
            if (!user) { return res.sendStatus(401); }
            req.login(user, function (err) {
                if (err) { return next(err); }

                var authToken = {'authorizationToken': '1234'};
                // https://github.com/jaredhanson/passport-remember-me#setting-the-remember-me-cookie
                // issue a remember me cookie if the option was checked
                console.log("Checking for remember me");
                if (req.body.remember_me) {
                    console.log("Remember me found!!");

                    models.issueToken(req.user, function(err, token) {
                        if (err) { return next(err); }
                        res.cookie('remember_me', token, { path: '/', httpOnly: true, maxAge: 604800000 });
                        res.send(authToken);
                    });
                } else {
                    console.log('remember me not found');
                    // send user information since user is found
                    // *SHOULD NEVER CONTAIN SENSITIVE DATA*
                    res.send(authToken);
                }
            });
        })(req, res, next);
        next();
    }, function(req, res, next) {

    });

    app.post('/session/logout', ensureCsrf, ensureAuthenticated, function(req, res, next) {

        console.log("Received rememberme cookie of: ");
        if ('remember_me' in req.cookies) {
            models.consumeRememberMeToken(req.cookies.remember_me, function(err, next) {
                console.log("User logged out: Purged token");
            });
        }
        req.logout();
        res.clearCookie('remember_me');
        res.clearCookie('connect.sid');
        req.session.destroy();
        // client session.postAuth method expects JSON, it will error if sent a blank response
        res.send({});
    });

    app.get('/session', ensureAuthenticated, function(req, res, next){

        var defaults = {
            id: 0,
            username: '',
            name: '',
            email: ''
        };
        // only send information in the above hash to client
        res.statusCode = 200;
        res.send(_.pick(req.user, _.keys(defaults)));
    });

    // creating users is ok to do without being logged in
    app.post('/api/users', users.add);

};