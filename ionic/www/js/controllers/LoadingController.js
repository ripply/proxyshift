angular.module('scheduling-app.controllers')
    .controller('LoadingController', [
        '$scope',
        '$rootScope',
        '$state',
        '$controller',
        'SessionService',
        'STATES',
        'GENERAL_CONFIG',
        'GENERAL_EVENTS',
        function($scope,
                 $rootScope,
                 $state,
                 $controller,
                 SessionService,
                 STATES,
                 GENERAL_CONFIG,
                 GENERAL_EVENTS
        ) {
            $controller('BaseModelController', {$scope: $scope});

            $scope.$on('$ionicView.beforeEnter', function() {
                if (SessionService.isAuthenticated()) {
                    goHome();
                } else {
                    // query server asyn
                    SessionService.checkAuthentication();
                }
            });

            $rootScope.$on(GENERAL_EVENTS.AUTHENTICATION.CONFIRMED, goHome);

            $rootScope.$on(GENERAL_EVENTS.AUTHENTICATION.PENDING, goLoading);

            $rootScope.$on(GENERAL_EVENTS.AUTHENTICATION.REQUIRED, goLogin);
            $rootScope.$on(GENERAL_EVENTS.AUTHENTICATION.INVALID, goLogin);
            $rootScope.$on(GENERAL_EVENTS.AUTHENTICATION.FAILED, goLogin);

            function goHome() {
                $state.go(STATES.HOME, {}, {reload: false, inherit: true});
            }

            function goLogin() {
                $state.go(STATES.LOGIN, {}, {reload: false, inherit: true});
            }

            function goLoading() {
                $state.go(STATES.LOADING, {}, {reload: false, inherit: true});
            }
        }
]);
