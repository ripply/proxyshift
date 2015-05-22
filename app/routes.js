var home = require('../controllers/home'),
    shifts = require('../controllers/shifts'),
    users = require('../controllers/users'),
    groups = require('../controllers/groups'),
    categories = require('../controllers/categories'),
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

function requireJson(req, res, next) {
    if (!req.is('application/json')) {
        console.log('Client sent non json data to a json only resource');
        res.send(400);
    } else {
        next();
    }
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

    app.get('/csrf', function(req, res, next) {
        console.log("Issuing new csrf token...");
        res.cookie('XSRFTOKEN', req.csrfToken());
        console.log(req.session);
        res.send(200);
        console.log("Sent 200 response");
    });

    app.post('/session/login', requireJson, function(req, res, next) {
        //console.log(req.crsfToken());
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
                var authToken = {'authorizationToken': '1234'};
                // https://github.com/jaredhanson/passport-remember-me#setting-the-remember-me-cookie
                // issue a remember me cookie if the option was checked
                console.log("Checking for remember me");
                console.log(req.body);
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

    // creating users is ok to do without being logged in
    app.post('/api/users', users.add);

    /**
     * AUTHENTICATION
     */
    // API post calls must be authenticated and contain CSRF token
    app.post('/api/*', ensureCsrf, ensureAuthenticated);
    app.put('/api/*', ensureCsrf, ensureAuthenticated);
    app.patch('/api/*', ensureCsrf, ensureAuthenticated);
    app.delete('/api/*', ensureCsrf, ensureAuthenticated);
    // API get calls just need authentication
    app.get('/api/*', ensureAuthenticated);

    // API calls go below here

    /**
     * Shifts
     */
    app.get('/api/shifts', shifts.index);
    app.get('/api/shifts/:id', shifts.getById);
    app.post('/api/shifts', shifts.add);
    app.put('/api/shifts', shifts.add);
    app.patch('/api/shifts', shifts.update);
    app.delete('/api/shifts/:id', shifts.delete);

    /**
     * Categories
     */
    app.get('/api/categories', categories.index);
    app.get('/api/categories/:id', categories.getById);
    app.post('/api/categories', categories.add);
    app.put('/api/categories', categories.add);
    app.patch('/api/categories', categories.update);
    app.delete('/api/categories/:id', categories.delete);

    /**
     * Users
     */
    app.get('/api/users', users.index);
    app.get('/api/users/:id', users.getById);
    // post comes before authentication so anyone can make an account
    app.put('/api/users', users.add);
    app.patch('/api/users', users.update);
    app.delete('/api/users/:id', users.delete);

    /**
     * Groups
     */
    app.get('/api/groups', groups.index);
    app.get('/api/groups/:id', groups.getById);
    app.post('/api/groups', groups.add);
    app.put('/api/groups', groups.add);
    app.patch('/api/groups', groups.update);
    app.delete('/api/groups/:id', groups.delete);
};
