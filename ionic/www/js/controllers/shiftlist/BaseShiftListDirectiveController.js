angular.module('scheduling-app.controllers')
    .controller('BaseShiftListDirectiveController', [
        '$rootScope',
        '$scope',
        '$controller',
        'GENERAL_CONFIG',
        'GENERAL_EVENTS',
        //'Restangular',
        'ShiftProcessingService',
        'ModelVariableName',
        'Model',
        function($rootScope,
                 $scope,
                 $controller,
                 GENERAL_CONFIG,
                 GENERAL_EVENTS,
                 //Restangular,
                 ShiftProcessingService,
                 ModelVariableName,
                 Model
        ) {
            $controller('BaseModelController', {$scope: $scope});
            $scope.register(
                ModelVariableName,
                Model,
                undefined
            );
            $scope.shifttitle = 'Open shifts';
            $scope.declinedshifttitle = 'Declined shifts';
            $scope.Model = $rootScope[ModelVariableName];
            $scope.data = {};
            $rootScope.$watch(ModelVariableName, function(newValue, oldValue) {
                $scope.Model = newValue;
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
                Restangular.one('shifts', id)
                    .all('ignore')
                    .post()
                    .then(function(result) {
                        console.log(result);
                        var ignoredShift = addShiftToIgnoredShifts(id);
                        if (ignoredShift) {
                            ignoredShift.busy = false;
                            ignoredShift.failed = false;
                        } else {
                            // we dont have copy of this shift, update
                            $scope.fetch();
                        }
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
                    .all('ignore')
                    .remove()
                    .then(function(result) {
                        console.log(result);
                        var unIgnoredShift = removeShiftFromIgnoredShifts(id);
                        if (unIgnoredShift) {
                            unIgnoredShift.busy = false;
                            unIgnoredShift.failed = false;
                        } else {
                            // we dont have copy of this shift, update
                            $scope.fetch();
                        }
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
                Restangular.one('shifts', id)
                    .all('register')
                    .post()
                    .then(function(result) {
                        shift.busy = false;
                        shift.failed = false;
                        var registrationId = -1;
                        if (result.hasOwnProperty('id')) {
                            registrationId = result.id;
                        } else {
                            // server sent unexpected content
                        }
                        shift.applied = registrationId;
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
                // window.Restangular.one('shifts', 1).all('register').customOperation('remove', null, null, {'Content-Type': 'application/json'}, {reason: 'test'});
                Restangular
                    .one('shifts', id)
                    .all('register')
                    .customOperation('remove', null, null, {
                        // content type must be set to json so that server will parse content, it is set to text without setting this
                        'Content-Type': 'application/json'
                    }, {
                        reason: reason
                    })
                    .then(function(result) {
                        shift.busy = false;
                        shift.failed = false;
                        shift.applied = undefined;
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
                if (shift === undefined) {
                    return true;
                }
                if (shift.ignoreshifts === undefined) {
                    return false;
                }
                return shift.ignoreshifts.length > 0;
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
                //shift.expanded = !shift.expanded;
                $rootScope.$broadcast('events:shift:description:show', shift, $scope.name);
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
        }]);
