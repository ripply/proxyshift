angular.module('scheduling-app.controllers')
    .controller('MyShiftsController', [
        '$scope',
        '$controller',
        function($scope,
                 $controller
        ) {
            $scope.acceptedOnly = true;
            $scope.showDividers = true;
            $controller('ShiftsListController', {$scope: $scope});
            $scope.MODELNAME = 'shifts';
        }
    ]
);
