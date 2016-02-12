var logger = require('./../../app/logger');

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        //console.log("Authorized user");
        return next();
    } else {
        //console.log("Authentication failed");
    }
    // 401 is Unauthorized response
    logger.unauthenticatedUserTriedToAccessProtectedResource(req, res);
    res.sendStatus(401);
}

function requireJson(req, res, next) {
    if (!req.is('application/json')) {
        console.log('Client sent non json data to a json only resource');
        res.sendStatus(400);
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

function logout(req, res) {
    var authToken = req.get('Authorization');
    if ('remember_me' in req.cookies || authToken) {
        models.checkRememberMeToken(req.cookies.remember_me, true, function(err, next) {
            if (authToken && req.cookies.remember_me != authToken) {
                models.checkRememberMeToken(authToken, true, function(err, next) {
                    console.log("User logged out: Purged token auth token");
                });
            } else {
                console.log("User logged out: Purged token remember me");
            }
        });
    }
    req.logout();
    res.clearCookie('remember_me');
    res.clearCookie('connect.sid');
    req.session.destroy();
}

function isLoggedIn(req) {
    return (req.user !== undefined && req.user.id !== undefined);
}

function notLoggedIn(req, res, next) {
    if (isLoggedIn(res)) {
        next();
    } else {
        res.sendStatus(401);
    }
}

module.exports = {
    ensureAuthenticated: ensureAuthenticated,
    requireJson: requireJson,
    ensureCsrf: ensureCsrf,
    logout: logout,
    isLoggedIn: isLoggedIn,
    notLoggedIn: notLoggedIn
};
