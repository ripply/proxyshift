angular.module('scheduling-app.controllers')
    .controller('ShiftInfoController', [
        '$scope',
        '$rootScope',
        '$controller',
        '$stateParams',
        'ShiftProcessingService',
        'ResourceService',
        function($scope,
                 $rootScope,
                 $controller,
                 $stateParams,
                 ShiftProcessingService,
                 ResourceService
        ) {
            $controller('BaseModelController', {$scope: $scope});
            $scope.beforeEnter = function() {
                console.log("ASKDJFLKASJDFJ");
                if ($stateParams.shift_id) {
                    ResourceService.getShift($stateParams.shift_id, function(response) {
                        console.log(response);
                        $scope.shift = response;
                    }, function(error) {
                        // TODO: RETRY HANDLING
                    });
                }
            };

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
            $scope.shiftHasNonRecindedApplications = ShiftProcessingService.shiftHasNonRecindedApplications;
            $scope.ignoreShift = ResourceService.ignoreShift;
        }
    ]
);
