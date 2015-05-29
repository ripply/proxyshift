/**
 * UserModel
 */
angular.module('scheduling-app.models')
    .service('UsersModel', ['Restangular', function(Restangular) {
        var User = Restangular.service('Users');

        Restangular.extendModel('Users', function(model) {
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