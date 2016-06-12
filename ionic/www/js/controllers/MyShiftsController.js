angular.module('scheduling-app.controllers')
    .controller('MyShiftsController', [
        '$scope',
        '$controller',
        function($scope,
                 $controller
        ) {
            $controller('ShiftsListController', {$scope: $scope});
            $scope.showDividers = true;
            $scope.MODELNAME = 'shifts';
        }
    ]
);
