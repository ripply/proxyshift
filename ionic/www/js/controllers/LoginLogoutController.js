angular.module('scheduling-app.controllers')
.controller('LoginLogoutController', [
        '$rootScope',
        '$scope',
        'GENERAL_EVENTS',
        function($rootScope,
                 $scope,
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
        }
    ]);