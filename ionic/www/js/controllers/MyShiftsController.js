angular.module('scheduling-app.controllers')
    .controller('MyShiftsController', [
        '$scope',
        '$controller',
        'GENERAL_CONFIG',
        'MyShiftsModel',
        function($scope,
                 $controller,
                 GENERAL_CONFIG,
                 MyShiftsModel
        ) {
            $controller('BaseModelController', {$scope: $scope});
            $scope.register(
                'MyShifts',
                MyShiftsModel,
                undefined
            );
        }]);
