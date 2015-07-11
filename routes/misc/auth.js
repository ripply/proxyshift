var middleware = require('./middleware');

var ConnectRoles = require('connect-roles'),
    roles = new ConnectRoles(require('./rolesOptions'));

var ensureCsrf = middleware.ensureCsrf;
var requireJson = middleware.requireJson;
var ensureAuthenticated = middleware.ensureAuthenticated;

module.exports = function(app, settings){

    var url = require('url'),
        express = require('express'),
        authRouter = express.Router();

    if (settings.auth) {
        // API post calls must be authenticated and contain CSRF token
        authRouter.post('/*', ensureCsrf, ensureAuthenticated);
        authRouter.put('/*', ensureCsrf, ensureAuthenticated);
        authRouter.patch('/*', ensureCsrf, ensureAuthenticated);
        authRouter.delete('/*', ensureCsrf, ensureAuthenticated);
        // API get calls just need authentication
        authRouter.get('/*', ensureAuthenticated);

        app.use('/api', authRouter);

        require('./roles')(app, roles);
    }

};