/**
 * UserModel
 */
module = angular.module('scheduling-app.models');
_.each(['Users', 'Shifts', 'Groups', 'UserGroups'], function(key, index) {

module
    .service(key + 'Model', ['Restangular', function(Restangular) {
        var User = Restangular.service(key);

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

        return User;
    }]);
});