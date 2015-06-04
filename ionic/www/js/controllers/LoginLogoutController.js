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
            $scope.$on(GENERAL_EVENTS.AUTHENTICATION.CONFIRMED, function() {
                $scope.authenticated = true;
            });

            function notAuthenticated() {
                $scope.authenticated = false;
            }

            $scope.$on(GENERAL_EVENTS.AUTHENTICATION.REQUIRED, notAuthenticated);
            $scope.$on(GENERAL_EVENTS.AUTHENTICATION.FAILED, notAuthenticated);
            $scope.$on(GENERAL_EVENTS.LOGOUT.COMPLETE, notAuthenticated);

            $scope.login = function() {
                $rootScope.$broadcast(GENERAL_EVENTS.AUTHENTICATION.REQUIRED);
            };

            $scope.logout = function() {
                $rootScope.$broadcast(GENERAL_EVENTS.LOGOUT.REQUESTED);
            };

            $scope.logout = AuthenticationService.logout;
        }
    ]);