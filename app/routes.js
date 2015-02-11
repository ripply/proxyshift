var home = require('../controllers/home'),
    shifts = require('../controllers/shifts'),
    users = require('../controllers/users'),
    _ = require('underscore'),
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
    }
    // 401 is Unauthorized response
    console.log("Denying access");
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
    /*app.post('/login', passport.authenticate('local',
        { successRedirect: '/', failureRedirect: '/login' }));*/
    // API calls must be authenticated
    app.post('/api/*', ensureCsrf, ensureAuthenticated);
    app.get('/api/*', ensureAuthenticated);

    app.post('/session/login', function(req, res, next) {
        //console.log(req.crsfToken());
        if (!req.is('application/json')) {
            console.log('Client sent non json data to /login');
            res.send(400);
            return;
        }
        console.log(req.protocol);
        console.log("/login");
        console.log(req.body);
        console.log('authenticating...');
        passport.authenticate('local', {session: true}, function (err, user, info) {
            if (err) { return next(err); }
            if (!user) { return res.send(401); }
            req.login(user, function (err) {
                if (err) { return next(err); }
                // 201 Created: The request has been fulfilled and resulted in a new resource being created.
                //return res.send(200);
                return res.send(user);
            });
        })(req, res, next);
    });

    app.get('/session', function(req, res){
        console.log(req.session.passport);
        var defaults = {
            id: 0,
            username: '',
            name: '',
            email: ''
        };
        res.send(_.pick(req.user, _.keys(defaults)));
    });

    app.get('/api/user/:id', users.getById);

    // API calls go below here
    app.get('/api/shifts', shifts.index);
    app.get('/api/shifts/:id', shifts.getById);
    app.post('/api/shifts', shifts.add);
    // app.put('/api/shifts', shifts.update);
    app.delete('/api/shifts/:id', shifts.delete);
};
