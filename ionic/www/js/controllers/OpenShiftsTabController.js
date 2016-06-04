angular.module('scheduling-app.controllers')
    .controller('OpenShiftsTabController', [
        '$rootScope',
        '$scope',
        '$controller',
        '$state',
        'STATES',
        function($rootScope,
                 $scope,
                 $controller,
                 $state,
                 STATES
        ) {
            var validTabPages = [
                STATES.SHIFTS,
                STATES.MYSHIFTS,
                STATES.MANAGE,
                STATES.SHIFT_INFO
            ];
            $controller('BaseModelController', {$scope: $scope});
            $scope.afterEnter = function() {
                if (validTabPages.indexOf($state.current.name) >= 0) {
                    $rootScope.currentTabPage = $state.href($state.current.name);
                    $rootScope.currentTagPageState = $state.current.name;
                    console.log("Update to: " + $rootScope.currentTabPage);
                }
            };
        }]);
