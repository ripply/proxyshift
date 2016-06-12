angular.module('scheduling-app.controllers')
    .controller('OpenShiftsDirectiveController', [
        '$rootScope',
        '$scope',
        '$controller',
        '$http',
        'GENERAL_CONFIG',
        'GENERAL_EVENTS',
        'ShiftsModel',
        function($rootScope,
                 $scope,
                 $controller,
                 $http,
                 GENERAL_CONFIG,
                 GENERAL_EVENTS,
                 AllShiftsModel
        ) {
            $controller('BaseShiftListDirectiveController', {
                $scope: $scope
            });
        }]);
