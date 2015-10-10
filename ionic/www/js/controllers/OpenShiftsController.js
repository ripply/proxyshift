angular.module('scheduling-app.controllers')
    .controller('OpenShiftsController', [
        '$scope',
        '$controller',
        'GENERAL_CONFIG',
        function($scope,
                 $controller,
                 GENERAL_CONFIG
        ) {
            $controller('BaseModelController', {$scope: $scope});
            $scope.requestShift = function() {
                StateHistoryService.addToGotoHistory();
            };
        }]);
