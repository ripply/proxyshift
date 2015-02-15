var home = require('../controllers/home'),
    shifts = require('../controllers/shifts'),
    users = require('../controllers/users'),
    _ = require('underscore'),
    utils = require('./utils'),
    models = require('./models'),
    passport = require('passport');

require('./configure_passport');

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        console.log("Authorized user");
        return next();
    } else {
        console.log("Authentication failed");
    }
    // 401 is Unauthorized response
    console.log(req.baseUrl);
    res.send(401);
}

function ensureCsrf(err, req, res, next) {
    console.log(err.code);
    if (err.code !== 'EBADCSRFTOKEN') return next(err);

    // handle CSRF token errors here
    console.log("CSRF Token missing!!");
    res.status(403);
    res.send('session has expired or form tampered with');
}

module.exports.initialize = function(app) {
    app.use(function(req, res, next) {
        console.log('Received request');

        next();
    });
    app.get('/', home.index);

    app.post('/session/login', function(req, res, next) {
        //console.log(req.crsfToken());
        if (!req.is('application/json')) {
            console.log('Client sent non json data to /login');
            return res.send(400);
        }
        console.log(req.protocol);
        console.log("/login");
        console.log(req.body);
        console.log('authenticating...');
        passport.authenticate('local', {session: true}, function (err, user, info) {
            if (err) { return next(err); }
            // authentication failed, send 401 unauthorized
            if (!user) { return res.send(401); }
            req.login(user, function (err) {
                if (err) { return next(err); }

                if (err) { return next(err); }
                // https://github.com/jaredhanson/passport-remember-me#setting-the-remember-me-cookie
                // issue a remember me cookie if the option was checked
                console.log("Checking for rembmer me");
                console.log(req.body);
                if (req.body.remember_me) {
                    console.log("Remember me found!!");

                    models.issueToken(req.user, function(err, token) {
                        if (err) { return next(err); }
                        res.cookie('remember_me', token, { path: '/', httpOnly: true, maxAge: 604800000 });
                        res.send(user);
                    });
                } else {
                    console.log('remember me not found');
                    // send user information since user is found
                    // *SHOULD NEVER CONTAIN SENSITIVE DATA*
                    res.send(user);
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

    /**********************************************
     *              API METHODS
     **********************************************/

    // API post calls must be authenticated and contain CSRF token
    app.post('/api/*', ensureCsrf, ensureAuthenticated);
    app.delete('/api/*', ensureCsrf, ensureAuthenticated);
    // API get calls just need authentication
    app.get('/api/*', ensureAuthenticated);

    app.get('/api/user/:id', users.getById);

    // API calls go below here
    app.get('/api/shifts', shifts.index);
    app.get('/api/shifts/:id', shifts.getById);
    app.post('/api/shifts', shifts.add);
    // app.put('/api/shifts', shifts.update);
    app.delete('/api/shifts/:id', shifts.delete);
};
