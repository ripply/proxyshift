angular.module('scheduling-app.controllers')
    .controller('OpenShiftsController', [
        '$rootScope',
        '$scope',
        '$controller',
        function($rootScope,
                 $scope,
                 $controller
        ) {
            $controller('ShiftsListController', {$scope: $scope, enableScroll: true});
            $scope.showDivider = false;
        }
    ]
);
