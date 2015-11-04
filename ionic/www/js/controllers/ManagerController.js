angular.module('scheduling-app.controllers')
    .controller('ManagerController', [
        '$scope',
        '$controller',
        'GENERAL_CONFIG',
        'ManagingShiftsModel',
        function($scope,
                 $controller,
                 GENERAL_CONFIG,
                 ManagingShiftsModel
        ) {
            $controller('BaseModelController', {$scope: $scope});
            $scope.register(
                'ManagingShifts',
                ManagingShiftsModel,
                undefined
            );
        }]);
