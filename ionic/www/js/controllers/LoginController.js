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

            $scope.$on(GENERAL_EVENTS.CHECK_AUTHENTICATION, function() {
                return SessionService.checkAuthentication();
            });

            $scope.$on('event:auth-loginRequired', function(e, rejection) {
                // clear any error messages
                $scope.message = null;
                // reset existing midtyped username/password
                $scope.user.username = null;
                $scope.user.password = null;
                $scope.user.remember_me = false;

                $scope.loginModal.show();
            });

            $scope.$on('event:auth-loginConfirmed', function() {
                $scope.user.username = null;
                $scope.user.password = null;
                $scope.message = null;
                $scope.loginModal.hide();
            });

            $scope.$on('event:auth-login-failed-invalid', function(e, message) {
                $scope.message = message;
            });

            $scope.$on('event:auth-login-failed', function(e, status) {
                var error = "Login failed.";
                if (status == 401) {
                    error = "Invalid Username or Password.";
                }
                $scope.message = error;
            });

            $scope.$on('event:auth-logout-complete', function() {
                $state.go('app.home', {}, {reload: true, inherit: false});
            });
        }]);
