angular.module('scheduling-app.controllers')
    .controller('OpenShiftsDirectiveController', [
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
            // TODO: Remove and figurout why $ionivView.afterEnter does not trigger in super class
            $scope.fetch();
        }]);
