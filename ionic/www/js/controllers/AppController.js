angular.module('scheduling-app.controllers')

    .controller('AppCtrl', [
        '$scope',
        '$ionicModal',
        '$timeout',
        '$rootScope',
        function($scope, $ionicModal, $timeout, $rootScope) {
            // Form data for the login modal
            $scope.loginData = {};

            // Create the login modal that we will use later
            $ionicModal.fromTemplateUrl('templates/login.html', {
                scope: $scope
            }).then(function(modal) {
                $scope.loginModal = modal;
            });

            // Triggered in the login modal to close it
            $scope.closeLogin = function() {
                $scope.loginModal.hide();
            };

            // Open the login modal
            console.log($scope.login = function () {
                $rootScope.$broadcast('event:auth-loginRequired');
                //$scopeinModal.show();
            });

            // Perform the login action when the user submits the login form
            $scope.doLogin = function() {
                console.log('Doing login', $scope.loginData);

                // Simulate a login delay. Remove this and replace with your login
                // code if using a login system
                $timeout(function() {
                    $scope.closeLogin();
                }, 1000);
            };
    }])
;