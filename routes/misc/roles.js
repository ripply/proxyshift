var _ = require('underscore');
var Promise = require('bluebird');

// Keeps track of custom authentication methods that get setup
var authRoutes = {};

var controllers = [
    require('../../controllers/permissions'),
    require('../../controllers/groups'),
    require('../../controllers/shifts'),
    require('../../controllers/users')
];

function executeAuthRule(rule, req, res) {

}

// ['admin', 'or', 'user']
// ['admin', 'and', ['admin', 'or', 'user']]
function process(req, res, array) {
    var stack = [];
    _.each(array, function(item, index) {
        if (stack.length > 0) {
            stack.push(Promise.resolve(stack.pop()).then(function(top_) {
                Promise.resolve(top).then(function(top) {
                    if (typeof top == 'function') {
                        // there will be a left hand side argument below the function
                        var fn = stack.pop();
                        if (stack.length == 0) {
                            throw new Error("or and functions must have left hand argument");
                        }
                        var rhs = item;
                        stack.push(Promise.resolve(stack.pop).then(function(lhs) {
                            return fn(lhs, rhs);
                        }));
                    } else {
                        if (typeof item === 'string') {
                            var next = null;
                            if (item == 'or' ||
                                item == '||') {
                                next = function(lhs_, rhs_) {
                                    return Promise.resolve(lhs_).then(function(lhs) {
                                        return Promise.resolve(rhs_).then(function(rhs) {
                                            var left;
                                            var right;
                                            if (lhs == true) {
                                                left = true;
                                            } else if (lhs === false) {
                                                left = false;
                                            } else if (lhs === undefined) {
                                                // undefined means go to next
                                                left = true;
                                            }

                                            if (rhs == true) {
                                                right = true;
                                            } else if (rhs === false) {
                                                right = false;
                                            } else if (rhs === undefined) {
                                                // undefined means go to next
                                                right = true;
                                            }

                                            return left || right;
                                        });
                                    });
                                };
                            } else if (item == 'and' ||
                                item == '&&') {
                                next = function(lhs_, rhs_) {
                                    return Promise.resolve(lhs_).then(function(lhs) {
                                        return Promise.resolve(rhs_).then(function(rhs) {
                                            var left;
                                            var right;
                                            if (lhs == true) {
                                                left = true;
                                            } else if (lhs === false) {
                                                left = false;
                                            } else if (lhs === undefined) {
                                                // undefined means go to next
                                                left = true;
                                            }

                                            if (rhs == true) {
                                                right = true;
                                            } else if (rhs === false) {
                                                right = false;
                                            } else if (rhs === undefined) {
                                                // undefined means go to next
                                                right = true;
                                            }

                                            return left && right;
                                        });
                                    });
                                };
                            } else {
                                if (top !== true && top !== undefined) {
                                    // previous result was false
                                    // continue returning false until the end
                                    next = false;
                                } else {
                                    next = executeAuthRule(item, req, res);
                                }
                            }
                            stack.push(next);
                        } else if (item instanceof Array) {
                            // item is an array, recurse
                            // result will be a Promise that resolves
                            // to
                            var recursedProcessResult = process(req, res, array);
                            stack.push(recursedProcessResult);
                        } else {
                            throw new Error("Auth array cannot have a '" + typeof item + "' in it");
                        }
                    }
                });
            }));
        } else {
            stack.push(item);
        }
    });

    return Promise.resolve(stack.pop()).then(function(result) {
        // the only time that the stack will have more than one item
        // is when processing an 'or' or 'and' function
        // this means, if there is more than 1 item on the stack
        // after promise resolution then there is a function without
        // a right hand argument, so that won't work anyway
        if (stack.length > 0) {
            throw new Error("Auth permissions syntax is invalid");
        }

        return result;
    });
}

/**
 * Sets up roles for routes
 * @param app require('express')
 * @param roles require('connect-roles')
 */
module.exports = function(app, roles) {

    var special = {

    };

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
                                // keep track of auth function for custom && and || of routes
                                authRoutes[actionName] = authFunction;
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
                                                // requirements22222222
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

                                                // check if the array contains '&&' or '||'


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
