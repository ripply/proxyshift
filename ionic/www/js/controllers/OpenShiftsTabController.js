angular.module('scheduling-app.controllers')
    .controller('OpenShiftsTabController', [
        '$rootScope',
        '$scope',
        '$controller',
        '$state',
        function($rootScope,
                 $scope,
                 $controller,
                 $state
        ) {
            $controller('BaseModelController', {$scope: $scope});
            $scope.afterEnter = function() {
                $rootScope.currentTabPage = $state.href($state.current.name);
                $rootScope.currentTagPageState = $state.current.name;
                console.log("Update to: " + $rootScope.currentTabPage);
            };
        }]);
