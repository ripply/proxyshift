var _ = require('underscore');

var controllers = [
    require('../../controllers/categories'),
    require('../../controllers/groups'),
    require('../../controllers/shifts'),
    require('../../controllers/users')
];

/**
 * Sets up roles for routes
 * @param app require('express')
 * @param roles require('connect-roles')
 */
module.exports = function(app, roles) {

    var user = roles;

    app.use(roles.middleware());

    var rolePaths = {
        'index': '/',
        'getById': '/:id',
        'postCreate': '/',
        'putCreate': '/',
        'patch': '/',
        'delete': '/'
    };

    var actionToVerb = {
        'index': 'get',
        'getById': 'get',
        'postCreate': 'post',
        'putCreate': 'put',
        'patch': 'patch',
        'delete': 'delete'
    };

    _.each(controllers, function(controller) {
        if (controller.hasOwnProperty('route')) {
            var route = controller.route;
            // make sure that route does not have an ending /
            if (route.indexOf('/', route.length - '/'.length) !== -1) {
                console.log("WARNING: Route (" + route + ") ends with / auth roles may get messed up");
            }

            _.each(rolePaths, function(path, roleAction) {

                var controllerMethod = "auth" + (roleAction.charAt(0).toUpperCase() + roleAction.slice(1));

                if (controller.hasOwnProperty(controllerMethod)) {

                    var fullRoute = route + path;

                    var fullRoleActionText = (controllerMethod + " " + fullRoute)
                        .replace(":", ";"); // due to bug somewhere, if there is a colon in the action name
                                            // it will be converted to the path param which means
                                            // the action will never execute since the action is different
                                            // this means that you can have it setup for very specific routes though

                    // setup action for role
                    roles.use(fullRoleActionText, fullRoute, controller[controllerMethod]);
                    // setup middleware for the route to use the new action
                    app[actionToVerb[roleAction]](fullRoute, user.can(fullRoleActionText));
                }

            });
        }
    });

};
