/**
 * LoginController
 */
angular.module('scheduling-app.controllers')
    .service('LoginControllerService',[
        '$rootScope',
        'SessionService',
        'GENERAL_EVENTS',
        function($rootScope,
                 SessionService,
                 GENERAL_EVENTS) {

            $rootScope.user = {
                username: null,
                password: null,
                remember_me: false
            };

            var showLoginModal = function() {
                $rootScope.loginModal.show();
            };

            this.showLoginModal = showLoginModal;

            var hideLoginModal = function() {
                $rootScope.loginModal.hide();
            };

            this.hideLoginModal = hideLoginModal;

            $rootScope.$on(GENERAL_EVENTS.AUTHENTICATION.CHECK, function() {
                SessionService.checkAuthentication();
            });

            $rootScope.$on(GENERAL_EVENTS.AUTHENTICATION.REQUIRED, function(e, rejection) {
                // clear any error messages
                $rootScope.message = null;
                // reset existing mistyped username/password
                $rootScope.user.username = null;
                $rootScope.user.password = null;
                $rootScope.user.remember_me = false;

                showLoginModal();
            });

            $rootScope.$on(GENERAL_EVENTS.AUTHENTICATION.CONFIRMED, function() {
                $rootScope.user.username = null;
                $rootScope.user.password = null;
                $rootScope.message = null;
                hideLoginModal();
            });

            $rootScope.$on(GENERAL_EVENTS.AUTHENTICATION.INVALID, function(e, message) {
                $rootScope.message = message;
            });

            $rootScope.$on(GENERAL_EVENTS.AUTHENTICATION.FAILED, function(e, status) {
                var error = "Login failed.";
                if (status == 401) {
                    error = "Invalid Username or Password.";
                }
                $rootScope.message = error;
            });

            $rootScope.$on(GENERAL_EVENTS.LOGOUT.COMPLETE, function() {
                $state.go('app.home', {}, {reload: true, inherit: false});
            });
        }
    ])
    .controller('LoginController', [
        '$rootScope',
        '$scope',
        '$http',
        '$state',
        'AuthenticationService',
        'SessionService',
        'LoginControllerService',
        function($rootScope,
                 $scope,
                 $http,
                 $state,
                 AuthenticationService,
                 SessionService,
                 LoginControllerService,
                 GENERAL_EVENTS) {

            $scope.login = function() {
                AuthenticationService.login($rootScope.user);
            };

        }]);
