/**
 * LoginController
 */
angular.module('scheduling-app.controllers')
    .service('LoginControllerService',[
        '$rootScope',
        '$state',
        '$location',
        'SessionService',
        'PushProcessingService',
        'GENERAL_EVENTS',
        'STATES',
        function($rootScope,
                 $state,
                 $location,
                 SessionService,
                 PushProcessingService,
                 GENERAL_EVENTS,
                 STATES) {
            $rootScope.user = {
                username: null,
                password: null,
                remember_me: false
            };

            checkIfDemo();

            var showLoginModal = function() {
                checkIfDemo();
                $state.go(STATES.LOGIN, {}, {reload: false, inherit: true});
                //$rootScope.loginModal.show();
            };

            function checkIfDemo() {
                console.log($location.path());
                if ($location.path().indexOf('/demo') != -1) {
                    console.log("!!!!");
                    console.log($location.path().substring('/demo'));
                    $rootScope.user.username = 'demo';
                    $rootScope.user.password = 'supersecretdemopasswordpleasedontabuse';
                } else {
                    console.log("NOPE");
                }
            }

            this.showLoginModal = showLoginModal;

            var hideLoginModal = function hideLoginModal() {
                if ($state.current.name == STATES.LOGIN) {
                    $state.go(STATES.HOME, {}, {reload: false, inherit: true});
                } else {
                    // user opened app with a different state, let it happen
                }
            };

            this.hideLoginModal = hideLoginModal;

            $rootScope.$on(GENERAL_EVENTS.AUTHENTICATION.CHECK, function authenticationCheckRequested() {
                SessionService.checkAuthentication()
                    .then(function() {
                        // do nothing
                    }, function() {
                        // do nothing
                    }, function() {
                        // do nothing
                    });
            });

            $rootScope.$on(GENERAL_EVENTS.AUTHENTICATION.REQUIRED, function authenticationRequired(e, rejection) {
                // clear any error messages
                $rootScope.message = null;
                // reset existing mistyped username/password
                $rootScope.user.username = null;
                $rootScope.user.password = null;
                $rootScope.user.remember_me = false;

                showLoginModal();
            });

            $rootScope.$on(GENERAL_EVENTS.AUTHENTICATION.CONFIRMED, function authenticationConfirmed() {
                $rootScope.user.username = null;
                $rootScope.user.password = null;
                $rootScope.message = null;
                hideLoginModal();
            });

            $rootScope.$on(GENERAL_EVENTS.AUTHENTICATION.INVALID, function authenticationInvalid(e, message) {
                $rootScope.message = message;
            });

            $rootScope.$on(GENERAL_EVENTS.AUTHENTICATION.FAILED, function authenticationFailed(e, status) {
                var error = "Login failed";
                var statusType = Math.floor(status / 100);
                if (status == 401) {
                    error = "Invalid Username or Password.";
                } else if (status == 404) {
                    error = "Issue contacting server";
                } else if (statusType == 5) {
                    error = "An internal server error occurred";
                } else if (status == 0) {
                    error = "Cannot contact server";
                } else {
                    error = error + ": code " + status;
                }
                $rootScope.message = error;
            });

            $rootScope.$on(GENERAL_EVENTS.LOGOUT.COMPLETE, function logoutComplete() {
                $state.go(STATES.HOME, {}, {reload: true, inherit: false});
            });
        }
    ])
    .controller('LoginController', [
        '$rootScope',
        '$scope',
        '$http',
        '$state',
        '$ionicModal',
        'GENERAL_CONFIG',
        'GENERAL_EVENTS',
        'AuthenticationService',
        'SessionService',
        'LoginControllerService',
        function($rootScope,
                 $scope,
                 $http,
                 $state,
                 $ionicModal,
                 GENERAL_CONFIG,
                 GENERAL_EVENTS,
                 AuthenticationService,
                 SessionService,
                 LoginControllerService
        ) {

            $scope.api = GENERAL_CONFIG.APP_URL;

            // TEMP FIX TO GET SIGNUP WORKING AGAIN
            // Create the signup modal that we will use later
            $ionicModal.fromTemplateUrl('templates/signup.html', {
                scope: $scope
            }).then(function(modal) {
                $scope.signupModal = modal;
            });

            $ionicModal.fromTemplateUrl('templates/forgotpassword.html', {
                scope: $scope
            }).then(function(modal) {
                $scope.forgotPasswordModal = modal;
            });

            $scope.signup = function() {
                $rootScope.$broadcast('event:signup-required');
                $scope.signupModal.show();
            };

            $scope.forgot = function() {
                $rootScope.$broadcast('event:forgot-password');
                $scope.forgotPasswordModal.show();
            };

            $scope.closeSignup = function() {
                $scope.signupModal.hide();
            };

            $scope.closeForgotPassword = function() {
                $rootScope.$broadcast(GENERAL_EVENTS.RESETPASSWORD.HIDE);
            };

            $scope._closeForgotPassword = function() {
                $scope.forgotPasswordModal.hide();
            };

            $scope.$on(GENERAL_EVENTS.RESETPASSWORD.HIDE, function() {
                $scope._closeForgotPassword();
            });

            $scope.login = function() {
                $rootScope.user.remember_me = true;
                try {
                    if (window.cordova &&
                        window.cordova.plugins &&
                        window.cordova.plugins.Keyboard) {
                        cordova.plugins.Keyboard.close();
                    }
                } catch (e) {
                    // plugin not loaded, not a problem
                }
                AuthenticationService.login($rootScope.user)
                    .then(function() {
                        console.info("Logged in successfully");
                    }, function() {
                        console.info("Failed to login");
                    }, function() {
                        // notify, do nothing
                    })
            };



        }]);
