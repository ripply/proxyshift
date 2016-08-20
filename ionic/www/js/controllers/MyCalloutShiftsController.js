angular.module('scheduling-app.controllers')
    .controller('MyCalloutShiftsController', [
        '$scope',
        '$controller',
        function($scope,
                 $controller
        ) {
            $scope.showDividers = true;
            $controller('ShiftsListController', {$scope: $scope});
            $scope.MODELNAME = 'shifts';
        }
    ]
);
