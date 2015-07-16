var _ = require('underscore');

var controllers = [
    require('../../controllers/permissions'),
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
        if (controller.hasOwnProperty('route') ||
            controller.hasOwnProperty('auth')) {
            var route = controller.route;
            if (route !== undefined) {
                // make sure that route does not have an ending /
                if (route.indexOf('/', route.length - '/'.length) !== -1) {
                    console.log("WARNING: Route (" + route + ") ends with / auth roles may get messed up");
                }
            }

            _.each(_.keys(controller), function(possibleRoute) {
                // check if key could be a route
                // a route will be an object
                var possibleRouteValue = controller[possibleRoute];
                if (possibleRouteValue instanceof Object) {
                    if (possibleRoute == 'auth') {
                        _.each(_.keys(possibleRouteValue), function (actionName) {
                            var authFunction = possibleRouteValue[actionName];
                            if (typeof authFunction == "function") {
                                if (actionName instanceof Array) {
                                    // if the action name is an array of multiple strings
                                    // then turn it into a single one!
                                    actionName.sort();
                                    actionName = flattenArray(actionName).toLowerCase();
                                }
                                roles.use(actionName, authFunction);
                            }
                        });
                    } else {
                        _.each(_.keys(possibleRouteValue), function (verb) {
                            verb = verb.toLowerCase();

                            var authAndRouteObject = possibleRouteValue[verb];
                            if (authAndRouteObject instanceof Object) {
                                if (verbs.indexOf(verb) >= 0) {
                                    // verb!!
                                    // check if they have an auth property
                                    var auth = authAndRouteObject.auth;
                                    var subRoute = authAndRouteObject.route;

                                    var fullRoute = route + possibleRoute;

                                    if (subRoute !== undefined &&
                                        typeof subRoute == 'function') {
                                        if (auth !== undefined) {
                                            // create action name for auth
                                            // action name will essentially just be the verb + route
                                            var action = verb + " " + fullRoute;

                                            var fullRoleActionText = action
                                                .replace(":", ";"); // due to bug somewhere, if there is a colon in the action name
                                                                    // it will be converted to the path param which means
                                                                    // the action will never execute since the action is different
                                                                    // this means that you can have it setup for very specific routes though

                                            if (typeof auth == 'function') {
                                                // auth is a function which means
                                                // we don't have to do anything special
                                                roles.use(fullRoleActionText, fullRoute, auth);
                                                app[verb](fullRoute, user.can(fullRoleActionText));
                                            } else if (typeof auth == 'string') {
                                                // this means that we should use this string
                                                // in place of the fullRoleActionText we
                                                // are creating.
                                                // the purpose of this is to allow reuse of
                                                // auth code and to allow simple naming of
                                                // requirements
                                                //app[verb](fullRoute, user.can(auth));
                                            } else if (auth instanceof Array) {
                                                // should be an array of strings
                                                // we sort the list first then we flatten
                                                // the list into a string
                                                // the string becomes the lookup key.
                                                // this lets us define special auth lookups for
                                                // each item individually and then when they
                                                // are combined.
                                                // if there is no rule for handling all items
                                                // then each item is setup in a chain for sequential
                                                // matching
                                                auth.sort();
                                                var combinedRoleName = flattenArray(auth);

                                                if (true) {
                                                    app[verb](fullRoute, user.can(combinedRoleName));
                                                } else {
                                                    _.each(auth, function (individualAuthRole) {
                                                        app[verb](fullRoute, user.can(individualAuthRole));
                                                    });
                                                }
                                            }


                                        }

                                        //console.log(verb + ": " + fullRoute + " -> " + subRoute);
                                        // setup actual route now
                                        app[verb](fullRoute, subRoute);
                                    }
                                }
                            }
                        });
                    }
                }
            });
        }
    });

};

function flattenArray(stringArray, separator) {
    if (separator === undefined ||
        separator === null) {
        separator = " ";
    }
    return stringArray.reduce(function (previousValue, currentValue, index) {
        if (index > 0) {
            previousValue += separator;
        }

        previousValue += currentValue;

        return previousValue;
    }, '');
}
