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
        function($rootScope,
                 $scope,
                 $controller,
                 $q,
                 GENERAL_EVENTS,
                 GENERAL_CONFIG,
                 ShiftsModel,
                 ShiftProcessingService
        ) {
            $controller('BaseModelController', {$scope: $scope});

            $scope.fetch = function() {
                var deferred = $q.defer();

                ShiftsModel.managing(function(data) {
                    $scope.Model = data;
                    deferred.resolve(data);
                    var pendingApprovals = false;
                    var noApplications = false;
                    for (var i = 0; i < data.length; i++) {
                        var shift = data[i];
                        if (ShiftProcessingService.isShiftAppliedFor(shift)) {
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
                            sort: -1,
                            isDivider: true
                        });
                    }
                    if (noApplications) {
                        data.splice(0, 0, {
                            type: 'noApplications',
                            sort: 1,
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

            function predicate(left, right) {
                if (left.isDivider && right.isDivider) {
                    if (left.sort == right.sort) {
                        return 0;
                    } else if (left.sort < right.sort) {
                        return -1;
                    } else {
                        return 0;
                    }
                }
                var leftAppliedFor = ShiftProcessingService.isShiftAppliedFor(left);
                var rightAppliedFor = ShiftProcessingService.isShiftAppliedFor(right);
                if (leftAppliedFor && rightAppliedFor) {
                    return ShiftProcessingService.compareShiftByDate(left, right);
                } else if (leftAppliedFor) {
                    if (right.isDivider) {
                        if (right.sort <= 0) {
                            return 1;
                        } else {
                            return -1;
                        }
                    } else {
                        return -1;
                    }
                } else if (rightAppliedFor) {
                    if (left.isDivider) {
                        if (left.sort > 0) {
                            return -1;
                        } else {
                            return 1;
                        }
                    } else {
                        return 1;
                    }
                } else {
                    return ShiftProcessingService.compareShiftByDate(left, right);
                }
            }
        }]);
