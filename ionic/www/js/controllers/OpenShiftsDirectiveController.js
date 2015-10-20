angular.module('scheduling-app.controllers')
    .controller('OpenShiftsDirectiveController', [
        '$rootScope',
        '$scope',
        '$controller',
        'GENERAL_CONFIG',
        'GENERAL_EVENTS',
        'AllShiftsModel',
        function($rootScope,
                 $scope,
                 $controller,
                 GENERAL_CONFIG,
                 GENERAL_EVENTS,
                 AllShiftsModel
        ) {
            $controller('BaseShiftListDirectiveController', {
                $scope: $scope,
                ModelVariableName: 'AllShifts',
                Model: AllShiftsModel
            });
        }]);
