angular.module('scheduling-app.controllers')
    .controller('BaseShiftListDirectiveController', [
        '$rootScope',
        '$scope',
        '$controller',
        '$ionicScrollDelegate',
        '$ionicListDelegate',
        'GENERAL_CONFIG',
        'GENERAL_EVENTS',
        'UserInfoService',
        'ResourceService',
        'ShiftProcessingService',
        function($rootScope,
                 $scope,
                 $controller,
                 $ionicScrollDelegate,
                 $ionicListDelegate,
                 GENERAL_CONFIG,
                 GENERAL_EVENTS,
                 UserInfoService,
                 ResourceService,
                 ShiftProcessingService
        ) {
            $controller('BaseModelController', {$scope: $scope});
            $scope.shifttitle = 'April 29th';
            $scope.declinedshifttitle = 'Declined shifts';
            $scope.visible = {};
            if ($scope.name) {
                $scope.Model = $rootScope[$scope.name];
                if ($rootScope[$scope.name + 'Status']) {
                    $scope.visible = $rootScope[$scope.name + 'Status'];
                }
            } else {
                $scope.Model = [];
            }
            $scope.data = {};
            $scope.$watch('name', function(newValue, oldValue) {
                $scope.Model = $rootScope[newValue];
                $rootScope.$watch(newValue, function(rootNewValue, rootOldValue) {
                    console.log(rootNewValue);
                    $scope.Model = rootNewValue;
                    $scope.visible = {};
                    $rootScope[newValue + 'Status'] = $scope.visible;
                });
            });
            var superFetchComplete = $scope.fetchComplete;
            $scope.fetchComplete = function(result, oldValue) {
                var range = getDefaultShiftRange();
                $rootScope.$broadcast(GENERAL_EVENTS.CALENDAR.UPDATE.RANGE, result, range[0], range[1]);
                if (superFetchComplete) {
                    superFetchComplete(result, oldValue);
                }
            };
            // TODO: Remove and figurout why $ionivView.afterEnter does not trigger in super class
            //$scope.fetch();

            var myUserClasses;

            $rootScope.$on(GENERAL_EVENTS.UPDATES.USERINFO.PROCESSED, function(state, userInfo) {
                getMyUserClasses();
            });

            getMyUserClasses();

            $scope.getGroupId = getGroupId;

            function getGroupId() {
                var groups = UserInfoService.getGroupList();
                if (groups && Object.keys(groups).length > 0) {
                    var group_id = Object.keys(groups)[0];
                    $scope.groupId = groups[group_id].id;
                    return groups[group_id].id;
                }
                return false;
            }

            $scope.markShiftVisible = function(shift) {
                if (shift.id) {
                    $scope.visible[shift.id] = true;
                }
                return true;
            };

            $scope.markShiftNotVisible = function(shift) {
                if (shift.id) {
                    $scope.visible[shift.id] = false;
                }
                return false;
            };

            $scope.isShiftVisible = function(shift) {
                if (shift.id) {
                    return $scope.visible[shift.id];
                } else {
                    return false;
                }
            };

            function getMyUserClasses() {
                myUserClasses = UserInfoService.getUserClasses();
            }

            function closeButtons() {
                $ionicListDelegate.closeOptionButtons();
            }

            $scope.hasUserClasses = function() {
                return Object.keys(myUserClasses).length > 0;
            };

            $rootScope.$on(GENERAL_EVENTS.SHIFTS.ACCEPT, function(state, shift) {
                $scope.applyForShift(shift.id);
            });

            $rootScope.$on(GENERAL_EVENTS.SHIFTS.DECLINE, function(state, shift) {
                $scope.recindApplicationForAShift(shift.id, 'test');
            });

            $scope.promptRecindShift = function(id) {
                // TODO: Angular replacement for website
                $rootScope.$emit(GENERAL_EVENTS.POPUP.REQUESTED, function($ionicPopup) {
                    $scope.prompt = $ionicPopup.show({
                        templateUrl: 'templates/notifications/recindshiftreason.html',
                        title: 'Provide a reason',
                        subTitle: 'for recinding this shift application',
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
                                    if (!$scope.data.recindreason || $scope.data.recindreason == '') {
                                        e.preventDefault();
                                    } else {
                                        return $scope.data.recindreason;
                                    }
                                }
                            }
                        ]
                    });

                    $scope.prompt.then(function(reason) {
                        delete $scope.data.reason;
                        if (reason) {
                            $scope.recindApplicationForAShift(id, reason);
                        }
                    });
                });
            };

            $scope.promptCancelShift = function(id) {
                // TODO: Angular replacement for website
                $rootScope.$emit(GENERAL_EVENTS.POPUP.REQUESTED, function($ionicPopup) {
                    $scope.prompt = $ionicPopup.show({
                        templateUrl: 'templates/notifications/cancelshiftreason.html',
                        title: 'Provide a reason',
                        subTitle: 'for canceling this shift',
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
                            $scope.cancelShift(id, reason);
                        }
                    });
                });
            };

            $scope.cancelShift = function(id, reason) {
                var shift = getShift(id);
                if (shift) {
                    if (shift.busy === true) {
                        return;
                    }
                    shift.busy = true;
                } else {
                    // doesn't exist? server might have it...
                }
                Restangular.one('shifts', id)
                    .all('cancel')
                    .customPOST({
                        reason: reason
                    })
                    .then(function(result) {
                        console.log(result);
                        var ignoredShift = addShiftToCanceledShifts(id);
                        if (ignoredShift) {
                            ignoredShift.busy = false;
                            ignoredShift.failed = false;
                        } else {
                            // we dont have copy of this shift, update
                            $scope.fetch();
                        }
                        $ionicScrollDelegate.resize();
                    }, function(response) {
                        // failure
                        var failedShift = getShift(id);
                        if (failedShift) {
                            failedShift.busy = false;
                            failedShift.failed = true;
                        }
                        $rootScope.$emit(GENERAL_EVENTS.UPDATES.FAILURE, response);
                });
            };

            $scope.unIgnoreShift = function(id) {
                var shift = getShift(id);
                if (shift) {
                    if (shift.busy === true) {
                        return;
                    }
                    shift.busy = true;
                } else {
                    // doesn't exist? server might have it...
                }
                Restangular.one('shifts', id)
                    .all('cancel')
                    .remove()
                    .then(function(result) {
                        console.log(result);
                        var unIgnoredShift = removeShiftFromCanceledShifts(id);
                        if (unIgnoredShift) {
                            unIgnoredShift.busy = false;
                            unIgnoredShift.failed = false;
                        } else {
                            // we dont have copy of this shift, update
                            $scope.fetch();
                        }
                        $ionicScrollDelegate.resize();
                    }, function(response) {
                        // failure
                        var failedShift = getShift(id);
                        if (failedShift) {
                        failedShift.busy = false;
                            failedShift.failed = true;
                        }
                        $rootScope.$emit(GENERAL_EVENTS.UPDATES.FAILURE, response);
                    });
            };

            $scope.ignoreShift = function(id) {
                var shift = getShift(id);
                if (shift) {
                    if (shift.busy === true) {
                        return;
                    }
                    shift.busy = true;
                } else {
                    // doesn't exist? server might have it...
                }
                ResourceService.ignoreShift(
                    id,
                    function(result) {
                        console.log(result);
                        var ignoredShift = addShiftToIgnoredShifts(id);
                        if (ignoredShift) {
                            ignoredShift.busy = false;
                            ignoredShift.failed = false;
                        } else {
                            // we dont have copy of this shift, update
                            $scope.fetch();
                        }
                        $ionicScrollDelegate.resize();
                    }, function(response) {
                        // failure
                        var failedShift = getShift(id);
                        if (failedShift) {
                            failedShift.busy = false;
                            failedShift.failed = true;
                        }
                        $rootScope.$emit(GENERAL_EVENTS.UPDATES.FAILURE, response);
                    });
            };

            $scope.unIgnoreShift = function(id) {
                var shift = getShift(id);
                if (shift) {
                    if (shift.busy === true) {
                        return;
                    }
                    shift.busy = true;
                } else {
                    // doesn't exist? server might have it...
                }
                ResourceService.unIgnoreShift(
                    id,
                    function(result) {
                        console.log(result);
                        var unIgnoredShift = removeShiftFromIgnoredShifts(id);
                        if (unIgnoredShift) {
                            unIgnoredShift.busy = false;
                            unIgnoredShift.failed = false;
                        } else {
                            // we dont have copy of this shift, update
                            $scope.fetch();
                        }
                        $ionicScrollDelegate.resize();
                    }, function(response) {
                        // failure
                        var failedShift = getShift(id);
                        if (failedShift) {
                            failedShift.busy = false;
                            failedShift.failed = true;
                        }
                        $rootScope.$emit(GENERAL_EVENTS.UPDATES.FAILURE, response);
                    });
            };

            $scope.applyForShift = function(id) {
                var shift = getShift(id);
                if (shift) {
                    if (shift.applied) {
                        // already applied for shift
                        return;
                    }
                    if (shift.busy === true) {
                        return;
                    }
                    shift.busy = true;
                } else {
                    // doesn't exist? server might have it...
                }
                ResourceService.registerForShift(
                    id,
                    function(result) {
                        shift.busy = false;
                        shift.failed = false;
                        var registrationId = -1;
                        if (result.hasOwnProperty('id')) {
                            registrationId = result.id;
                        } else {
                            // server sent unexpected content
                        }
                        shift.applied = registrationId;
                        $ionicScrollDelegate.resize();
                        $rootScope.$emit(GENERAL_EVENTS.TOAST, 'info', 'Applied', 'Applied for shift ' + id);
                    }, function(response) {
                        // failure
                        var failedShift = getShift(id);
                        if (failedShift) {
                            failedShift.busy = false;
                            failedShift.failed = true;
                        }
                        $rootScope.$emit(GENERAL_EVENTS.UPDATES.FAILURE, response);
                        $rootScope.$emit(GENERAL_EVENTS.TOAST, 'error', 'Applied', 'Error applying for shift ' + id);
                });
            };

            $scope.recindApplicationForAShift = function(id, reason) {
                var shift = getShift(id);
                if (shift) {
                    if (!shift.applied) {
                        // not applied
                        return;
                    }
                    if (shift.busy === true) {
                        return;
                    }
                    shift.busy = true;
                } else {
                    // doesn't exist? server might have it...
                }
                ResourceService.unregisterForShift(
                    id,
                    reason,
                    function(result) {
                        shift.busy = false;
                        shift.failed = false;
                        shift.applied = undefined;
                        $ionicScrollDelegate.resize();
                    }, function(response) {
                        // failure
                        var failedShift = getShift(id);
                        if (failedShift) {
                            failedShift.busy = false;
                            failedShift.failed = true;
                        }
                        $rootScope.$emit(GENERAL_EVENTS.UPDATES.FAILURE, response);
                        $rootScope.$emit(GENERAL_EVENTS.TOAST, 'info', 'Recision', 'Successfully recinded shift application ' + id);
                    });
            };

            function getShift(id) {
                var allShifts = $rootScope.AllShifts;
                if (allShifts) {
                    for (var i = 0; i < allShifts.length; i++) {
                        var shift = allShifts[i];
                        if (shift && shift.id == id) {
                            return shift;
                        }
                    }
                }
            }

            function addShiftToCanceledShifts(id) {
                var shift = getShift(id);
                if (shift) {
                    shift.canceled = true;
                }
                return shift;
            }

            function removeShiftFromCanceledShifts(id) {
                var shift = getShift(id);
                if (shift) {
                    shift.canceled = false;
                }
                return shift;
            }

            function addShiftToIgnoredShifts(id) {
                var shift = getShift(id);
                if (shift) {
                    if (!shift.ignoreshifts) {
                        shift.ignoreshifts = [];
                    }
                    shift.ignoreshifts.push({});
                }
                return shift;
            }

            function removeShiftFromIgnoredShifts(id) {
                var shift = getShift(id);
                if (shift) {
                    shift.ignoreshifts = [];
                }
                return shift;
            }

            $scope.ignorableShiftsExist = function() {
                var allShifts = $rootScope.AllShifts;
                if (allShifts && allShifts.length > 0) {
                    for (var i = 0; i < allShifts.length; i++) {
                        var ignoreshifts = allShifts[i].ignoreshifts;
                        if (ignoreshifts) {
                            if (ignoreshifts instanceof Array) {
                                if (ignoreshifts.length > 0) {
                                    return true;
                                }
                            }
                        }
                    }
                    return false;
                }
            };

            $scope.unIgnorableShiftsExist = function() {
                var allShifts = $rootScope.AllShifts;
                if (allShifts && allShifts.length > 0) {
                    for (var i = 0; i < allShifts.length; i++) {
                        var ignoreshifts = allShifts[i].ignoreshifts;
                        if (ignoreshifts) {
                            if (ignoreshifts instanceof Array) {
                                if (ignoreshifts.length === 0) {
                                    return true;
                                }
                            }
                        }
                    }
                    return false;
                }
            };

            $scope.ignoredShift = function(shift) {
                //console.log(shift);
                if (shift === undefined) {
                    return true;
                }
                if (shift.ignoreshifts === undefined) {
                    return false;
                }
                return shift.ignoreshifts.length > 0;
            };

            $scope.acceptedOrApprovedShiftOrDivider = function(shift) {
                if (shift.isDivider) {
                    return true;
                } else if (ShiftProcessingService.isShiftAppliedFor(shift)) {
                    return true;
                }
                return false;
            };

            $scope.acceptedOrApprovedShift = function(shift) {
                return shift.applied;
            };

            function getDefaultShiftRange() {
                return window.ShiftShared.grabNormalShiftRange();
            }

            $scope.ellipsis = function(text, length) {
                if (text.length > length) {
                    return text.substr(0, length) + "...";
                } else {
                    return text;
                }
            };

            $scope.clicked = function(shift) {
                $rootScope.$broadcast('events:shift:description:show', shift, $scope.name);
            };

            $scope.accept = function(shift) {
                closeButtons();
                $scope.applyForShift(shift.id);
            };

            $scope.decline = function(shift) {
                closeButtons();
                $scope.recindApplicationForAShift(shift.id, 'test');
            };

            $scope.ignore = function(shift) {
                closeButtons();
                $scope.ignoreShift(shift.id);
            };

            $scope.info = function(shift) {
                closeButtons();
                $rootScope.$broadcast('events:shift:info', shift, $scope.name);
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
            $scope.getReadableClassType = ShiftProcessingService.getReadableClassType;
            $scope.ignoreShift = ResourceService.ignoreShift;
        }]);
