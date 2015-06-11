/**
 * SignupController
 */
angular.module('scheduling-app.controllers')
    .controller('SignupController', [
        '$scope',
        '$http',
        '$state',
        'UsersModel',
        'GENERAL_EVENTS',
        'STATES',
        function($scope,
                 $http,
                 $state,
                 UsersModel,
                 GENERAL_EVENTS,
                 STATES) {

            $scope.user = {
                name: null,
                username: null,
                password: null,
                squestion: null,
                sanswer: null
            };

            $scope.doSignup = function() {
                UsersModel.post($scope.user)
                    .then(function() {
                        console.log("Successfully created user?");
                    }, function(response) {
                        console.log("Failed to create user with response: " + response.status);
                    });
            };

            $scope.$on(GENERAL_EVENTS.SIGNUP.REQUIRED, function(e, rejection) {
                // clear any error messages
                $scope.message = null;
                // reset existing midtyped username/password
                $scope.user.name = null;
                $scope.user.username = null;
                $scope.user.password = null;
                $scope.user.squestion = null;
                $scope.user.sanswer = null;

                $scope.signupModal.show();
            });

            $scope.$on(GENERAL_EVENTS.SIGNUP.SUCCESS, function() {
                $scope.message = null;
                $scope.user.name = null;
                $scope.user.username = null;
                $scope.user.password = null;
                $scope.user.squestion = null;
                $scope.user.sanswer = null;

                $scope.signupModal.hide();
            });

            $scope.$on(GENERAL_EVENTS.SIGNUP.FAILED, function(e, message) {
                $scope.message = message;
            });

            $scope.$on(GENERAL_EVENTS.SIGNUP.COMPLETE, function() {
                $state.go(STATES.HOME, {}, {reload: true, inherit: false});
            });

        }]
)
;