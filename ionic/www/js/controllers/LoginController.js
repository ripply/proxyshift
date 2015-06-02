/**
 * LoginController
 */
angular.module('scheduling-app.controllers')
    .controller('LoginController', [
        '$scope',
        '$http',
        '$state',
        'AuthenticationService',
        'SessionService',
        'GENERAL_EVENTS',
        function($scope, $http, $state, AuthenticationService, SessionService, GENERAL_EVENTS) {

            $scope.user = {
                username: null,
                password: null,
                remember_me: false
            };

            $scope.login = function() {
                AuthenticationService.login($scope.user);
            };

            $scope.$on(GENERAL_EVENTS.AUTHENTICATION.CHECK, function() {
                return SessionService.checkAuthentication();
            });

            $scope.$on(GENERAL_EVENTS.AUTHENTICATION.REQUIRED, function(e, rejection) {
                // clear any error messages
                $scope.message = null;
                // reset existing midtyped username/password
                $scope.user.username = null;
                $scope.user.password = null;
                $scope.user.remember_me = false;

                $scope.loginModal.show();
            });

            $scope.$on(GENERAL_EVENTS.AUTHENTICATION.CONFIRMED, function() {
                $scope.user.username = null;
                $scope.user.password = null;
                $scope.message = null;
                $scope.loginModal.hide();
            });

            $scope.$on(GENERAL_EVENTS.AUTHENTICATION.INVALID, function(e, message) {
                $scope.message = message;
            });

            $scope.$on(GENERAL_EVENTS.AUTHENTICATION.FAILED, function(e, status) {
                var error = "Login failed.";
                if (status == 401) {
                    error = "Invalid Username or Password.";
                }
                $scope.message = error;
            });

            $scope.$on(GENERAL_EVENTS.LOGOUT.COMPLETE, function() {
                $state.go('app.home', {}, {reload: true, inherit: false});
            });
        }]);
