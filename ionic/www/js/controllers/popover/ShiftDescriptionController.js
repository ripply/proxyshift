angular.module('scheduling-app.controllers')
    .controller('ShiftDescriptionController', [
        '$scope',
        '$rootScope',
        '$controller',
        'ShiftProcessingService',
        'GENERAL_CONFIG',
        'GENERAL_EVENTS',
        function($scope,
                 $rootScope,
                 $controller,
                 ShiftProcessingService,
                 GENERAL_CONFIG,
                 GENERAL_EVENTS
        ) {
            $controller('BaseModelController', {$scope: $scope});
            $rootScope.$on('events:shift:description:hide', function(name) {
                if (name == $scope.name) {
                    $scope.show = false;
                }
            });

            $rootScope.$on('events:shift:description:show', function(state, shift, name) {
                if (name == $scope.name) {
                    $scope.show = true;
                    $scope.shift = shift;
                }
            });

            $scope.getReadableLocalShiftStartTime = ShiftProcessingService.getReadableLocalShiftStartTime;
            $scope.getReadableLocalShiftEndTime = ShiftProcessingService.getReadableLocalShiftEndTime;
            $scope.getReadableLocalShiftDiffTime = ShiftProcessingService.getReadableLocalShiftDiffTime;
            $scope.getReadableUsersShiftTime = ShiftProcessingService.getReadableUsersShiftTime;
            $scope.getReadableUsersShiftStartTime = ShiftProcessingService.getReadableUsersShiftStartTime;
            $scope.getReadableUsersShiftEndTime = ShiftProcessingService.getReadableUsersShiftEndTime;
            $scope.getReadableShiftDuration = ShiftProcessingService.getReadableShiftDuration;
            $scope.getReadableStartDate = ShiftProcessingService.getReadableStartDate;
            $scope.userIsInDifferentTimeZone = ShiftProcessingService.userIsInDifferentTimeZone;
            $scope.getShiftsLocation = ShiftProcessingService.getShiftsLocation;
            $scope.getShiftsSublocation = ShiftProcessingService.getShiftsSublocation;
        }
    ]
);
