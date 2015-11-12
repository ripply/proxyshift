angular.module('scheduling-app.controllers')
    .controller('ManageShiftController', [
        '$scope',
        '$controller',
        '$stateParams',
        'GENERAL_CONFIG',
        'ManagingShiftsModel',
        function($scope,
                 $controller,
                 $stateParams,
                 GENERAL_CONFIG,
                 ManagingShiftsModel
        ) {
            $controller('BaseModelController', {$scope: $scope});
            $scope.register(
                'ManagingShifts',
                ManagingShiftsModel,
                undefined
            );
            $scope.shift_id = $stateParams.shift_id;

            $scope.$on()
        }]);
