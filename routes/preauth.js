var middleware = require('./misc/middleware'),
    _ = require('underscore'),
    models = require('../app/models'),
    time = require('../app/time'),
    passport = require('passport');

require('./../app/configure_passport');

var ensureCsrf = middleware.ensureCsrf;
var requireJson = middleware.requireJson;
var ensureAuthenticated = middleware.ensureAuthenticated;
var ensureDatabaseReady = models.databaseReadyMiddleware;
var logout = middleware.logout;
var notLoggedIn = middleware.notLoggedIn;

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

    // return current server time in utc
    app.get('/api/utc', function(req, res, next) {
        res.status(200).send('' + time.nowInUtc());
    });

    // check that client's time is close enough to server's
    app.post('/api/utc', function(req, res, next) {
        var currentTimeInUtc = time.nowInUtc();
        var keys = Object.keys(req.body);
        var clientsTimeInUtc;

        if (keys.length > 0) {
            clientsTimeInUtc = parseInt(keys[0]);
        }

        if (isNaN(clientsTimeInUtc)) {
            res.status(400).send('' + currentTimeInUtc);
        } else {
            var delta = currentTimeInUtc - clientsTimeInUtc;

            if (Math.abs(delta) > time.deltaDifferenceThreshold) {
                // client is differs too much
                res.status(403).send('' + currentTimeInUtc);
            } else {
                // client's time is close enough
                res.status(200).send('' + currentTimeInUtc);
            }
        }
    });

    app.post('/session/login', requireJson, function(req, res, next) {
        passport.authenticate('local', {session: true}, function (err, user, info) {
            if (err) { return next(err); }
            // authentication failed, send 401 unauthorized
            if (!user) { return res.sendStatus(401); }
            req.login(user, function (err) {
                if (err) { return next(err); }

                var maxAgeInMs = 604800000;
                var expires = time.nowInUtc() + (maxAgeInMs / 1000);
                models.registerDeviceIdForUser(req.user.id, req.body.deviceid, expires, function(deviceIdRegistered, err) {
                    if (err) {
                        console.log("Failed to register user's device for push notifications: " + req.user.id + " => " + req.deviceid + "\n" + err);
                    }
                    // https://github.com/jaredhanson/passport-remember-me#setting-the-remember-me-cookie
                    // issue a remember me cookie if the option was checked
                    if (req.body.remember_me) {
                        models.issueToken(req.user, function(err, token) {
                            if (err) { return next(err); }
                            res.cookie('remember_me', token, { path: '/', httpOnly: true, maxAge: maxAgeInMs});
                            res.send({
                                token: token,
                                expires: expires,
                                registeredForPush: deviceIdRegistered
                            });
                        });
                    } else {
                        res.send({
                            registeredForPush: deviceIdRegistered
                        });
                    }
                });
            });
        })(req, res, next);
        next();
    }, function(req, res, next) {

    });

    app.post('/session/logout', ensureCsrf, ensureAuthenticated, function(req, res, next) {

        logout(req, res);
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
    app.post('/api/users', notLoggedIn, users['/'].post.route);

};
