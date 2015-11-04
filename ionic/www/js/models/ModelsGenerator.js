/**
 * UserModel
 */
module = angular.module('scheduling-app.models');
angular.forEach({
    'Users': 'Users',
    'Shifts': 'shifts',
    'AllShifts': {
        'Shifts': '/all'
    },
    'MyShifts': {
        'Shifts': '/mine'
    },
    'ManagingShifts': {
        'Shifts': '/managing'
    },
    'Groups': 'Groups',
    'UserGroups': 'UserGroups',
    'GroupSettings': 'GroupSettings'
}, function(definition, modelName) {

module
    .service(modelName + 'Model', ['Restangular', function(Restangular) {
        window.Restangular = Restangular;
        var baseRoute = definition;
        var nestedRoutes;
        if (typeof definition === 'object') {
            // build nested route
            var keys = [];
            for (var key in definition) {
                keys.push(key);
            }
            nestedRoutes = keys[0];
            subRoute = definition[nestedRoutes];
            subRoutes = subRoute.split('/');
            nestedRoutes = Restangular.one(nestedRoutes.toLowerCase());
            for (var i = 0; i < subRoutes.length; i++) {
                if (subRoutes[i].length > 0) {
                    if (subRoutes[i] < (i - 1)) {
                        nestedRoutes = nestedRoutes.one(subRoutes[i]);
                    } else {
                        // last item goes as first argument to Restangular.service
                        baseRoute = subRoutes[i];
                    }
                }
            }
        }

        var newModel;
        if (nestedRoutes === undefined) {
            newModel = Restangular.service(baseRoute);
        } else {
            newModel = Restangular.service(baseRoute, nestedRoutes);
        }


        Restangular.extendModel(modelName, function(model) {
            model.getResult = function() {
                if (this.status == 'complete') {
                    if (this.passed === null) return "Finished";
                    else if (this.passed === true) return "Pass";
                    else if (this.passed === false) return "Fail";
                }
                else return "Running";
            };

            return model;
        });

        newModel.register = _.bind(registerListener, newModel);
        newModel.unregister = _.bind(unregisterListener, newModel);

        // TODO: When we switch to socket.io
        // we should be able to create an angular cache object
        // that caches requests, and updates the cache with socket.io messages
        // the listeners should be able to be updated when socket.io messages
        // are received
        // see: https://github.com/mgonto/restangular/issues/373
        // and see this for an example on how to use $cacheFactory
        // https://www.phase2technology.com/blog/caching-json-arrays-using-cachefactory-in-angularjs-1-2-x/
        // we can cache Restangular requests by setting a http field
        // https://github.com/mgonto/restangular#can-i-cache-requests
        // like: RestangularProvider.setDefaultHttpFields({cache: myCache});

        return newModel;
    }]);
});

function registerListener(scopeToWriteVarialbe, variableName) {
    if (!this._listeners) {
        this._listeners = {};
    }
    this._listeners[scopeToWriteVarialbe] = variableName;
}

function unregisterListener(scopeToWriteVariable, variableName) {
    if (this._listeners) {
        if (!variableName) {
            // drop entire scope
            delete this._listeners[scopeToWriteVariable];
        } else if (this._listeners[scopeToWriteVariable] &&
                   typeof this._listeners[scopeToWriteVariable] == 'object') {
            delete this._listeners[scopeToWriteVariable][variableName];
        }
    }
}
