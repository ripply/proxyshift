angular.module('scheduling-app.controllers')
    .controller('ManageShiftController', [
        '$scope',
        '$rootScope',
        '$controller',
        '$stateParams',
        'GENERAL_EVENTS',
        'GENERAL_CONFIG',
        'ManagingShiftsModel',
        function($scope,
                 $rootScope,
                 $controller,
                 $stateParams,
                 GENERAL_EVENTS,
                 GENERAL_CONFIG,
                 ManagingShiftsModel
        ) {
            var RESOURCE = 'ManagingShifts';
            $controller('BaseModelController', {$scope: $scope});
            $scope.register(
                RESOURCE,
                ManagingShiftsModel,
                undefined
            );
            $scope.shift_id = $stateParams.shift_id;

            $rootScope.$on(GENERAL_EVENTS.UPDATES.RESOURCE, function(env, resource, newValue, oldValue) {
                console.log("WAT");
                getShiftId($scope.shift_id);
            });

            if ($rootScope[RESOURCE]) {
                $scope._managingshifts = $rootScope[RESOURCE];
                getShiftId($scope.shift_id);
            }

            function getShiftId(shift_id) {
                shift_id = parseInt(shift_id);
                if (!isNaN(shift_id) && $rootScope[RESOURCE]) {
                    var shifts = $rootScope[RESOURCE];
                    for (var i = 0; i < shifts.length; i++) {
                        if (shifts[i].id === shift_id) {
                            $scope.shift = shifts[i];
                            return;
                        }
                    }
                }

                // TODO: Go back, invalid shift
            }
        }]);
