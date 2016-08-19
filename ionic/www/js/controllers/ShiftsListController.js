angular.module('scheduling-app.controllers')
    .controller('ShiftsListController', [
        '$rootScope',
        '$scope',
        '$controller',
        '$q',
        '$location',
        '$stateParams',
        '$ionicScrollDelegate',
        'GENERAL_EVENTS',
        'GENERAL_CONFIG',
        'ShiftProcessingService',
        'ShiftIntervalTreeCacheService',
        'ShiftsModel',
        function($rootScope,
                 $scope,
                 $controller,
                 $q,
                 $location,
                 $stateParams,
                 $ionicScrollDelegate,
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

            $scope.spacing = 1;
            $scope.dividerOuterHeight = 40;
            $scope.dividerInnerHeight = 32;
            $scope.shiftOuterHeight = 120;
            $scope.shiftInnerHeight = 64 + 4 * 2;

            $rootScope.$on(GENERAL_EVENTS.UPDATES.RESOURCE, function(state, resource, value) {
                if (resource == $scope.MODELNAME) {
                    ShiftIntervalTreeCacheService.updateShifts(value);
                }
            });

            $rootScope.$on(GENERAL_EVENTS.SHIFTS.SCROLL, function(state, value) {
                var model = $rootScope[$scope.MODELNAME];
                var y = ShiftProcessingService.getScrollToPosition(value, model, $scope.spacing, $scope.dividerOuterHeight, $scope.dividerInnerHeight, $scope.shiftOuterHeight, $scope.shiftInnerHeight);
                $ionicScrollDelegate.scrollTo(0, y, true);
            });

            function getShiftApiRoute() {
                var route;
                if ($scope.acceptedOnly === true) {
                    if ($scope.showDividers === true) {
                        route = 'allAppliedOnlyWithDividers';
                    } else {
                        route = 'allAppliedOnly';
                    }
                } else if ($scope.showDividers === true) {
                    route = 'allWithDividers';
                } else {
                    route = 'all';
                }
                return route;
            }

            $scope.fetch = function() {
                var deferred = $q.defer();
                ShiftsModel[getShiftApiRoute()](function(data) {
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
                        /*
                        if (declined) {
                            console.log('Declined shifts exist!');
                            data.splice(0, 0, {
                                type: 'declined',
                                sort: DECLINED_GROUP,
                                isDivider: true
                            });
                        }
                        */
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
