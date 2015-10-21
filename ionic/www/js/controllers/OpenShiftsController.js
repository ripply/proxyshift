angular.module('scheduling-app.controllers')
    .controller('OpenShiftsController', [
        '$scope',
        '$controller',
        'GENERAL_CONFIG',
        'AllShiftsModel',
        function($scope,
                 $controller,
                 GENERAL_CONFIG,
                 AllShiftsModel
        ) {
            $controller('BaseModelController', {$scope: $scope});
            $scope.register(
                'AllShifts',
                AllShiftsModel,
                undefined
            );
        }]);
