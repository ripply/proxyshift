angular.module('scheduling-app.controllers')
    .controller('ManagerController', [
        '$rootScope',
        '$scope',
        '$controller',
        '$q',
        'GENERAL_EVENTS',
        'GENERAL_CONFIG',
        'ShiftsModel',
        'ShiftProcessingService',
        'ShiftIntervalTreeCacheService',
        function($rootScope,
                 $scope,
                 $controller,
                 $q,
                 GENERAL_EVENTS,
                 GENERAL_CONFIG,
                 ShiftsModel,
                 ShiftProcessingService,
                 ShiftIntervalTreeCacheService
        ) {
            $controller('BaseModelController', {$scope: $scope});

            $rootScope.$on(GENERAL_EVENTS.UPDATES.RESOURCE, function(state, resource, value) {
                if (resource == $scope.MODELNAME) {
                    ShiftIntervalTreeCacheService.updateShifts(value);
                }
            });

            var PENDING_GRUOP = -1;
            var NOAPPLICATION_GROUP = 1;
            var APPROVED_GROUP = 2;

            $scope.fetch = function() {
                var deferred = $q.defer();

                ShiftsModel.managing(function(data) {
                    $scope.Model = data;
                    deferred.resolve(data);
                    var pendingApprovals = false;
                    var noApplications = false;
                    var approvedShifts = false;
                    for (var i = 0; i < data.length; i++) {
                        var shift = data[i];
                        if (ShiftProcessingService.isShiftApproved(shift)) {
                            approvedShifts = true;
                        } else if (ShiftProcessingService.isShiftAppliedFor(shift)) {
                            pendingApprovals = true;
                        } else {
                            noApplications = true;
                        }
                        if (pendingApprovals && noApplications) {
                            break;
                        }
                    }
                    if (pendingApprovals) {
                        data.splice(0, 0, {
                            type: 'pendingApproval',
                            sort: PENDING_GRUOP,
                            isDivider: true
                        });
                    }
                    if (noApplications) {
                        data.splice(0, 0, {
                            type: 'noApplications',
                            sort: NOAPPLICATION_GROUP,
                            isDivider: true
                        });
                    }
                    if (approvedShifts) {
                        data.splice(0, 0, {
                            type: 'approved',
                            sort: APPROVED_GROUP,
                            isDivider: true
                        });
                    }
                    data.sort(predicate);
                    $rootScope.$emit(GENERAL_EVENTS.UPDATES.RESOURCE, 'ManageShifts', data, data, $scope);
                    if ($scope.fetchComplete !== undefined) {
                        $scope.fetchComplete(data);
                    }
                });

                return deferred.promise;
            };

            function getShiftGroup(shift) {
                if (shift.isDivider) {
                    return shift.sort;
                } else if (ShiftProcessingService.isShiftApproved(shift)) {
                    return APPROVED_GROUP;
                } else if (ShiftProcessingService.isShiftAppliedFor(shift)) {
                    return PENDING_GRUOP;
                } else {
                    return NOAPPLICATION_GROUP;
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
