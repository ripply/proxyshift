var home = require('../controllers/home'),
    shifts = require('../controllers/shifts'),
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

module.exports.initialize = function(app) {
    app.use(function(req, res, next) {
        console.log('wut');
        console.log(req.body);
        next();
    });
    app.get('/', home.index);
    /*app.post('/login', passport.authenticate('local',
        { successRedirect: '/', failureRedirect: '/login' }));*/
    app.post('/login', function(req, res, next) {
        if (!req.is('application/json')) {
            res.send(400);
            next();
        }
        console.log(req.protocol);
        console.log("/login");
        console.log(req.body);
        passport.authenticate('local', function(err, user, info) {
            if (err) { return next(err); }
            if (!user) { return res.send(401); }
            req.logIn(user, function(err) {
                if (err) { return next(err); }
                // 201 Created: The request has been fulfilled and resulted in a new resource being created.
                return res.send(201);
            });
        })(req, res, next);
    });

    // API calls must be authenticated
    //app.get('/api/*', ensureAuthenticated);

    // API calls go below here
    app.get('/api/shifts', shifts.index);
    app.get('/api/shifts/:id', shifts.getById);
    app.post('/api/shifts', shifts.add);
    // app.put('/api/shifts', shifts.update);
    app.delete('/api/shifts/:id', shifts.delete);
};
