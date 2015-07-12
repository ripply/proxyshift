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
    console.log(req.baseUrl);
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

module.exports = {
    ensureAuthenticated: ensureAuthenticated,
    requireJson: requireJson,
    ensureCsrf: ensureCsrf
};
