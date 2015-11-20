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

            $scope.acceptShift = function(id) {
                //Accept the shift
            };

            $scope.rejectShift = function(id) {
                //Reject the shift
            };
        }]);
