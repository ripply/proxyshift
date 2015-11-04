angular.module('scheduling-app.controllers')
    .controller('ManagingShiftsDirectiveController', [
        '$rootScope',
        '$scope',
        '$controller',
        'GENERAL_CONFIG',
        'GENERAL_EVENTS',
        'ManagingShiftsModel',
        function($rootScope,
                 $scope,
                 $controller,
                 GENERAL_CONFIG,
                 GENERAL_EVENTS,
                 ManagingShifts
        ) {
            $controller('BaseShiftListDirectiveController', {
                $scope: $scope,
                ModelVariableName: 'ManagingShifts',
                Model: ManagingShifts
            });
        }]);
