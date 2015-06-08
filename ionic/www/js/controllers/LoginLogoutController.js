angular.module('scheduling-app.controllers')
.controller('LoginLogoutController', [
        '$rootScope',
        '$scope',
        'AuthenticationService',
        'GENERAL_EVENTS',
        function($rootScope,
                 $scope,
                 AuthenticationService,
                 GENERAL_EVENTS
        ) {
            $scope.login = function() {
                $rootScope.$broadcast(GENERAL_EVENTS.AUTHENTICATION.REQUIRED);
            };

            $scope.logout = function() {
                $rootScope.$broadcast(GENERAL_EVENTS.LOGOUT.REQUESTED);
            };

            $scope.logout = AuthenticationService.logout;
        }
    ]);