angular.module('scheduling-app.controllers')
    .controller('IgnorableShiftsDirectiveController', [
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
            $controller('BaseModelController', {$scope: $scope});
            $scope.register(
                'AllShifts',
                AllShiftsModel,
                undefined
            );
            var superFetchComplete = $scope.fetchComplete;
            $scope.fetchComplete = function(result, oldValue) {
                var range = getDefaultShiftRange();
                $rootScope.$broadcast(GENERAL_EVENTS.CALENDAR.UPDATE.RANGE, result, range[0], range[1]);
                if (superFetchComplete) {
                    superFetchComplete(result, oldValue);
                }
            };
            // TODO: Remove and figurout why $ionivView.afterEnter does not trigger in super class
            $scope.fetch();

            function getDefaultShiftRange() {
                return window.ShiftShared.grabNormalShiftRange();
            }
        }]);
