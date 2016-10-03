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
        'UserInfoService',
        'ResourceService',
        'GENERAL_EVENTS',
        'STATES',
        function($scope,
                 $rootScope,
                 $controller,
                 $stateParams,
                 $ionicHistory,
                 toastr,
                 StateHistoryService,
                 ShiftProcessingService,
                 UserInfoService,
                 ResourceService,
                 GENERAL_EVENTS,
                 STATES
        ) {
            $controller('BaseModelController', {$scope: $scope});
            $scope.enter = function() {
                setupUserClasses();
                fetch();
            };

            $scope.busy = {
                register: false,
                approveDecine: false,
                fetch: false
            };

            $scope.data = {
                reason: ''
            };

            $scope.error = undefined;

            function setupUserClasses() {
                $scope.myUserClasses = UserInfoService.getUserClasses();
            }

            function networkUp() {
                if ($scope.error && $scope.statusCode !== 403) {
                    fetch();
                }
            }

            $scope.loaded = function() {
                document.addEventListener('online', networkUp, false);
            };

            $scope.unloaded = function() {
                document.removeEventListener('online', networkUp);
            };

            $rootScope.$on(GENERAL_EVENTS.UPDATES.USERINFO.PROCESSED, function(state, userInfo) {
                setupUserClasses();
            });

            $scope.$watch('shift', function(newVal) {
                if (newVal && newVal.hasOwnProperty('groupuserclass_id')) {
                    $scope.canApply = $scope.myUserClasses.hasOwnProperty(newVal.groupuserclass_id);
                } else {
                    $scope.canApply = false;
                }
            });

            function fetch() {
                if ($scope.busy.fetch) {
                    return;
                }
                $scope.busy.fetch = true;
                if ($stateParams.shift_id) {
                    ResourceService.getShift($stateParams.shift_id, function(response) {
                        $scope.shift = response;
                        $scope.error = undefined;
                        $scope.statusCode = 200;
                        $scope.busy.fetch = false;
                    }, function(error) {
                        // TODO: RETRY HANDLING
                        $scope.error = error;
                        $scope.statusCode = error.status;
                        $scope.busy.fetch = false;
                        if (error.status == 403) {
                            close();
                        }
                    });
                }
            }

            $scope.close = close;

            function close() {
                StateHistoryService.goBack($rootScope.currentTabPageState || STATES.SHIFTS);
            }

            $scope.approveShiftApplication = function(shiftapplication) {
                if ($scope.busy.approveDecline) {
                    return;
                }
                $scope.busy.approveDecline = true;
                ResourceService.approveShiftApplication(shiftapplication.id, function(response) {
                    fetch();
                    $scope.busy.approveDecline = false;
                }, function(err) {
                    fetch();
                    $scope.busy.approveDecline = false;
                });
            };

            $scope.declineShiftApplication = function(shiftapplication) {
                var reason = 'test';
                if ($scope.busy.approveDecline) {
                    return;
                }
                $scope.busy.approveDecline = true;
                ResourceService.declineShiftApplication(shiftapplication.id, reason, function(response) {
                    fetch();
                    $scope.busy.approveDecline = false;
                }, function(err) {
                    fetch();
                    $scope.busy.approveDecline = false;
                });
            };

            $scope.removeShift = function(shift) {
                if ($scope.busy.delete) {
                    return;
                }
                $scope.busy.delete = true;
                ShiftProcessingService.promptDeleteShift($scope, function() {
                    $scope._removeShift(shift.id, function shiftDeleted() {
                        $scope.busy.delete = false;
                        close();
                    }, function errorDeletingShift() {
                        $scope.busy.delete = false;
                    });
                }, function() {
                    $scope.busy.delete = false;
                });
            };

            function fetchIfPrivileged() {
                if ($scope.shift.privileged) {
                    fetch();
                }
            }

            $scope.registerForShift = function() {
                if ($scope.busy.register) {
                    return;
                }
                $scope.busy.register = true;
                ResourceService.registerForShift($stateParams.shift_id, function success(resource) {
                    if (resource.id) {
                        $scope.shift.applied = resource.id;
                    } else {
                        $scope.shift.applied = -1;
                    }
                    $scope.busy.register = false;
                    fetchIfPrivileged();
                }, function error() {
                    $scope.busy.register = false;
                    fetchIfPrivileged();
                });
            };

            $scope.unregisterForShift = function() {
                if ($scope.busy.register) {
                    return;
                }
                $scope.busy.register = true;
                ShiftProcessingService.promptRescindShiftApplication($scope, function(reason) {
                    ResourceService.unregisterForShift($stateParams.shift_id, reason, function success() {
                        $scope.shift.applied = undefined;
                        $scope.busy.register = false;
                        fetchIfPrivileged();
                    }, function error() {
                        $scope.busy.register = false;
                        fetchIfPrivileged();
                    });
                }, function() {
                    $scope.busy.register = false;
                });
            };

            $scope.getReadableLocalShiftStartEndTime = ShiftProcessingService.getReadableLocalShiftStartEndTime;
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
