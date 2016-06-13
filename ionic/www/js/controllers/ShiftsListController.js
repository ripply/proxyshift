angular.module('scheduling-app.controllers')
    .controller('ShiftsListController', [
        '$rootScope',
        '$scope',
        '$controller',
        '$q',
        'GENERAL_EVENTS',
        'GENERAL_CONFIG',
        'ShiftProcessingService',
        'ShiftIntervalTreeCacheService',
        'ShiftsModel',
        function($rootScope,
                 $scope,
                 $controller,
                 $q,
                 GENERAL_EVENTS,
                 GENERAL_CONFIG,
                 ShiftProcessingService,
                 ShiftIntervalTreeCacheService,
                 ShiftsModel
        ) {
            $controller('BaseModelController', {$scope: $scope});

            var APPROVED_GROUP = -1;
            var PENDING_GROUP = 1;
            var DECLINED_GROUP = 2;

            if (!$scope.MODELNAME) {
                $scope.MODELNAME = 'AllShifts';
            }

            $rootScope.$on(GENERAL_EVENTS.UPDATES.RESOURCE, function(state, resource, value) {
                if (resource == $scope.MODELNAME) {
                    ShiftIntervalTreeCacheService.updateShifts(value);
                }
            });

            $scope.fetch = function() {
                var deferred = $q.defer();

                ShiftsModel.all(function(data) {
                    $scope.Model = data;
                    deferred.resolve(data);
                    if ($scope.showDividers) {
                        console.log("Checking for dividers..................");
                        var approved = false;
                        var pendingApprovals = false;
                        var declined = false;
                        for (var i = 0; i < data.length; i++) {
                            var shift = data[i];
                            if (ShiftProcessingService.isShiftAppliedFor(shift)) {
                                if (ShiftProcessingService.isShiftApproved(shift)) {
                                    approved = true;
                                } else if (ShiftProcessingService.isShiftDeclined(shift)) {
                                    declined = true;
                                } else {
                                    pendingApprovals = true;
                                }
                            } else {
                                // we don't want to show this in my shifts
                            }
                            if (approved && pendingApprovals && declined) {
                                break;
                            }
                        }
                        if (approved) {
                            console.log('Approved shifts exist!');
                            data.splice(0, 0, {
                                type: 'approved',
                                sort: APPROVED_GROUP,
                                isDivider: true
                            });
                        }
                        if (pendingApprovals) {
                            console.log('Pending approvals exist!');
                            data.splice(0, 0, {
                                type: 'pendingApproval',
                                sort: PENDING_GROUP,
                                isDivider: true
                            });
                        }
                        if (declined) {
                            console.log('Declined shifts exist!');
                            data.splice(0, 0, {
                                type: 'declined',
                                sort: DECLINED_GROUP,
                                isDivider: true
                            });
                        }
                        data.sort(predicate);
                    }
                    $rootScope.$emit(GENERAL_EVENTS.UPDATES.RESOURCE, $scope.MODELNAME || 'AllShifts', data, data, $scope);
                    if ($scope.fetchComplete !== undefined) {
                        $scope.fetchComplete(data);
                    }
                });

                return deferred.promise;
            };

            function getShiftGroup(shift) {
                if (shift.isDivider) {
                    return shift.sort;
                } else if (ShiftProcessingService.isShiftAppliedFor(shift)) {
                    if (ShiftProcessingService.isShiftApproved(shift)) {
                        return APPROVED_GROUP;
                    } else if (ShiftProcessingService.isShiftDeclined(shift)) {
                        return DECLINED_GROUP;
                    } else {
                        return PENDING_GROUP;
                    }
                }
            }

            function predicate(left, right) {
                // determine which group the shifts are a part of
                var leftGroup = getShiftGroup(left);
                var rightGroup = getShiftGroup(right);

                if (leftGroup == rightGroup) {
                    if (left.isDivider) {
                        return -1;
                    } else if (right.isDivider) {
                        return 1;
                    } else {
                        return ShiftProcessingService.compareShiftByDate(left, right);
                    }
                } else if (leftGroup < rightGroup) {
                    return -1;
                } else {
                    return 1;
                }
            }
        }]);
