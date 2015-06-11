/**
 * LoginController
 */
angular.module('scheduling-app.controllers')
    .service('LoginControllerService',[
        '$rootScope',
        '$state',
        'SessionService',
        'GENERAL_EVENTS',
        'STATES',
        function($rootScope,
                 $state,
                 SessionService,
                 GENERAL_EVENTS,
                 STATES) {
            console.log("LoginControllerService INIT");
            $rootScope.user = {
                username: null,
                password: null,
                remember_me: false
            };

            var showLoginModal = function() {
                $state.go(STATES.LOGIN, {}, {reload: false, inherit: true});
                //$rootScope.loginModal.show();
            };

            this.showLoginModal = showLoginModal;

            var hideLoginModal = function() {
                console.log("Hide login modal... going " + ($rootScope.previousState || STATES.HOME));
                $state.go($rootScope.previousState || STATES.HOME, {}, {reload: false, inherit: true});
                //$rootScope.loginModal.hide();
            };

            this.hideLoginModal = hideLoginModal;

            $rootScope.$on(GENERAL_EVENTS.AUTHENTICATION.CHECK, function() {
                SessionService.checkAuthentication()
                    .then(function() {
                        // do nothing
                    }, function() {
                        // do nothing
                    }, function() {
                        // do nothing
                    });
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
                console.log("Got auth confirmed event");
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
                $state.go(STATES.HOME, {}, {reload: true, inherit: false});
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
                AuthenticationService.login($rootScope.user)
                    .then(function() {
                        console.log("Logged in!");
                    }, function() {
                        console.log("Failed to login :(");
                    }, function() {
                        // notify, do nothing
                    })
            };

        }]);
