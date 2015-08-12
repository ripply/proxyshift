/**
 * UserModel
 */
module = angular.module('scheduling-app.models');
_.each(['Users', 'Shifts', 'Groups', 'UserGroups', 'GroupSettings'], function(key, index) {

module
    .service(key + 'Model', ['Restangular', function(Restangular) {
        var newModel = Restangular.service(key);

        Restangular.extendModel(key, function(model) {
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
