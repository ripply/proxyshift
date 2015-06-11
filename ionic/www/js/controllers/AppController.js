angular.module('scheduling-app.controllers')

    .controller('AppCtrl', [
        '$scope',
        '$ionicModal',
        '$timeout',
        '$rootScope',
        '$state',
        'STATES',
        'GENERAL_EVENTS',
        function($scope,
                 $ionicModal,
                 $timeout,
                 $rootScope,
                 $state,
                 STATES,
                 GENERAL_EVENTS) {
            // Form data for the login modal
            $scope.loginData = {};

            // Create the login modal that we will use later
            $ionicModal.fromTemplateUrl('templates/_login.html', {
                scope: $scope
            }).then(function(modal) {
                $rootScope.loginModal = modal;
            });

            // Create the signup modal that we will use later
            $ionicModal.fromTemplateUrl('templates/signup.html', {
                scope: $scope
            }).then(function(modal) {
                $scope.signupModal = modal;
            });

            // Triggered in the login modal to close it
            $scope.closeLogin = function() {
                $scope.loginModal.hide();
            };

            $scope.closeSignup = function() {
                $scope.signupModal.hide();
            };

            // Open the login modal
            $scope.login = function() {
                $rootScope.$broadcast('event:auth-loginRequired');
                //$scopeinModal.show();
            };

            $scope.signup = function() {
                $rootScope.$broadcast('event:signup-required');
                $scope.signupModal.show();
            };

            // Perform the login action when the user submits the login form
            $scope.doLogin = function() {
                console.log('Doing login', $scope.loginData);

                // Simulate a login delay. Remove this and replace with your login
                // code if using a login system
                $timeout(function() {
                    $scope.closeLogin();
                }, 1000);
            };

            $scope.doSignup = function() {
                // TODO
            };

            function goLogin() {
                $state.go(STATES.LOGIN, {}, {reload: false, inherit: true})
            }

            $scope.$on(GENERAL_EVENTS.AUTHENTICATION.REQUIRED, goLogin);
            $scope.$on(GENERAL_EVENTS.AUTHENTICATION.INVALID, goLogin);
            $scope.$on(GENERAL_EVENTS.AUTHENTICATION.FAILED, goLogin);
            $scope.$on(GENERAL_EVENTS.LOGOUT.COMPLETE, goLogin)

    }])
;