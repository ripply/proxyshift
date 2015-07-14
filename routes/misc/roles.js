var _ = require('underscore');

var controllers = [
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

    var verbs = [
        'get',
        'post',
        'patch',
        'delete'
    ];

    app.use(roles.middleware());

    _.each(controllers, function(controller) {
        if (controller.hasOwnProperty('route')) {
            var route = controller.route;
            // make sure that route does not have an ending /
            if (route.indexOf('/', route.length - '/'.length) !== -1) {
                console.log("WARNING: Route (" + route + ") ends with / auth roles may get messed up");
            }

            _.each(_.keys(controller), function(possibleRoute) {
                // check if key could be a route
                // a route will be an object
                if (possibleRoute instanceof Object) {
                    _.each(_.keys(possibleRoute), function(verb) {
                        verb = verb.toLowerCase();

                        if (verb instanceof Object && verbs.contains(verb)) {
                            // verb!!
                            // check if they have an auth property
                            var auth = verb.auth;
                            var subRoute = verb.route;

                            var fullRoute = route + subRoute;

                            if (subRoute !== undefined) {
                                if (auth !== undefined) {
                                    // create action name for auth
                                    // action name will essentially just be the verb + route
                                    var action = verb + " " + fullRoute;

                                    var fullRoleActionText = action
                                        .replace(":", ";"); // due to bug somewhere, if there is a colon in the action name
                                                            // it will be converted to the path param which means
                                                            // the action will never execute since the action is different
                                                            // this means that you can have it setup for very specific routes though

                                    roles.use(fullRoleActionText, fullRoute, subRoute);

                                    app[verb](fullRoute, user.can(fullRoleActionText));
                                }

                                // setup actual route now
                                app[verb](fullRoute, subRoute);
                            }
                        }
                    });
                }
            });
        }
    });

};
