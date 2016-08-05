angular.module('scheduling-app.controllers')
    .controller('ShiftInfoController', [
        '$scope',
        '$rootScope',
        '$controller',
        '$stateParams',
        '$ionicHistory',
        'toastr',
        'StateHistoryService',
        'ShiftProcessingService',
        'ResourceService',
        'STATES',
        function($scope,
                 $rootScope,
                 $controller,
                 $stateParams,
                 $ionicHistory,
                 toastr,
                 StateHistoryService,
                 ShiftProcessingService,
                 ResourceService,
                 STATES
        ) {
            $controller('BaseModelController', {$scope: $scope});
            $scope.beforeEnter = fetch;

            function fetch() {
                if ($stateParams.shift_id) {
                    ResourceService.getShift($stateParams.shift_id, function(response) {
                        $scope.shift = response;
                    }, function(error) {
                        // TODO: RETRY HANDLING
                    });
                }
            }

            $scope.close = function() {
                StateHistoryService.goBack($rootScope.currentTabPageState || STATES.SHIFTS);
            };

            $scope.approveShiftApplication = function(shiftapplication) {
                ResourceService.approveShiftApplication(shiftapplication.id, function(response) {
                    console.log('SUCCESS');
                    console.log(response);
                    fetch();
                }, function(err) {
                    console.log("ERR");
                    console.log(err);
                    fetch();
                });
            };

            $scope.declineShiftApplication = function(shiftapplication) {
                var reason = 'test';
                ResourceService.declineShiftApplication(shiftapplication.id, reason, function(response) {
                    console.log('SUCCESS');
                    console.log(response);
                    fetch();
                }, function(err) {
                    console.log("ERR");
                    console.log(err);
                    fetch();
                });
            };

            $scope.removeShift = function(shift) {
                $scope._removeShift(shift.id);
            };

            $scope.getReadableLocalShiftStartTime = ShiftProcessingService.getReadableLocalShiftStartTime;
            $scope.getReadableLocalShiftEndTime = ShiftProcessingService.getReadableLocalShiftEndTime;
            $scope.getReadableLocalShiftDiffTime = ShiftProcessingService.getReadableLocalShiftDiffTime;
            $scope.getReadableUsersShiftTime = ShiftProcessingService.getReadableUsersShiftTime;
            $scope.getReadableUsersShiftStartTime = ShiftProcessingService.getReadableUsersShiftStartTime;
            $scope.getReadableUsersShiftEndTime = ShiftProcessingService.getReadableUsersShiftEndTime;
            $scope.getReadableShiftDuration = ShiftProcessingService.getReadableShiftDuration;
            $scope.getReadableStartDate = ShiftProcessingService.getReadableStartDate;
            $scope.getDisplayableFormatFromString = ShiftProcessingService.getDisplayableFormatFromString;
            $scope.shiftHasAcceptedApplication = ShiftProcessingService.shiftHasAcceptedApplication;
            $scope.shiftApplicationIsAccepted = ShiftProcessingService.shiftApplicationIsAccepted;
            $scope.shiftApplicationIsDeclined = ShiftProcessingService.shiftApplicationIsDeclined;
            $scope.userIsInDifferentTimeZone = ShiftProcessingService.userIsInDifferentTimeZone;
            $scope.getShiftsLocation = ShiftProcessingService.getShiftsLocation;
            $scope.getShiftsSublocation = ShiftProcessingService.getShiftsSublocation;
            $scope.getReadableLocalShiftApplicationTime = ShiftProcessingService.getReadableLocalShiftApplicationTime;
            $scope.shiftHasNonRecindedApplications = ShiftProcessingService.shiftHasNonRecindedApplications;
            $scope.ignoreShift = ResourceService.ignoreShift;
            $scope._approveShiftApplication = ResourceService.approveShiftApplication;
            $scope._declineShiftApplication = ResourceService.declineShiftApplication;
            $scope._removeShift = ResourceService.removeShift;
        }
    ]
);
