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
            $scope.beforeEnter = function() {
                $scope.myUserClasses = UserInfoService.getUserClasses();
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
                        $scope.busy.fetch = false;
                    }, function(error) {
                        // TODO: RETRY HANDLING
                        $scope.busy.fetch = false;
                    });
                }
            }

            function promptRecindShiftApplication(success, cancel) {
                $rootScope.$emit(GENERAL_EVENTS.POPUP.REQUESTED, function($ionicPopup) {
                    $scope.prompt = $ionicPopup.show({
                        templateUrl: 'templates/notifications/cancelshiftreason.html',
                        title: 'Provide a reason',
                        subTitle: 'for canceling your shift application',
                        scope: $scope,
                        buttons: [
                            {
                                text: 'Cancel',
                                onTap: function(e) {
                                    delete $scope.data.reason;
                                }
                            },
                            {
                                text: 'OK',
                                type: 'button-positive',
                                onTap: function(e) {
                                    if (!$scope.data.reason || $scope.data.reason == '') {
                                        e.preventDefault();
                                    } else {
                                        return $scope.data.reason;
                                    }
                                }
                            }
                        ]
                    });

                    $scope.prompt.then(function(reason) {
                        delete $scope.data.reason;
                        if (reason) {
                            success(reason);
                        } else {
                            cancel();
                        }
                    });
                });
            }

            function promptDeleteShift(success, cancel) {
                $rootScope.$emit(GENERAL_EVENTS.POPUP.REQUESTED, function($ionicPopup) {
                    $scope.prompt = $ionicPopup.show({
                        //templateUrl: 'templates/notifications/cancelshiftreason.html',
                        title: 'Are you sure',
                        subTitle: 'you want to delete this shift?',
                        scope: $scope,
                        buttons: [
                            {
                                text: 'No',
                                onTap: function(e) {
                                    return false;
                                }
                            },
                            {
                                text: 'Yes',
                                type: 'button-assertive',
                                onTap: function(e) {
                                    return true;
                                }
                            }
                        ]
                    });

                    $scope.prompt.then(function(ok) {
                        if (ok) {
                            success();
                        } else {
                            cancel();
                        }
                    });
                });
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
                    console.log('SUCCESS');
                    console.log(response);
                    fetch();
                    $scope.busy.approveDecline = false;
                }, function(err) {
                    console.log("ERR");
                    console.log(err);
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
                    console.log('SUCCESS');
                    console.log(response);
                    fetch();
                    $scope.busy.approveDecline = false;
                }, function(err) {
                    console.log("ERR");
                    console.log(err);
                    fetch();
                    $scope.busy.approveDecline = false;
                });
            };

            $scope.removeShift = function(shift) {
                if ($scope.busy.delete) {
                    return;
                }
                $scope.busy.delete = true;
                promptDeleteShift(function() {
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
                promptRecindShiftApplication(function(reason) {
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
