/**
angular.module('scheduling-app.models', [])
    .service('User', ['Restangular', function(Restangular) {
        var User = Restangular.service('User');

        Restangular.extendModel('User', function(model) {
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
    }]);**/