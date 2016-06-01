angular.module('scheduling-app.controllers')
    .controller('ManagerController', [
        '$rootScope',
        '$scope',
        '$controller',
        '$q',
        'GENERAL_EVENTS',
        'GENERAL_CONFIG',
        'ShiftsModel',
        function($rootScope,
                 $scope,
                 $controller,
                 $q,
                 GENERAL_EVENTS,
                 GENERAL_CONFIG,
                 ShiftsModel
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
                        if (isAppliedFor(shift)) {
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
                var leftAppliedFor = isAppliedFor(left);
                var rightAppliedFor = isAppliedFor(right);
                if (leftAppliedFor && rightAppliedFor) {
                    return compareShiftByDate(left, right);
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
                    return compareShiftByDate(left, right);
                }
            }

            function compareShiftByDate(left, right) {
                if (left.start < right.start) {
                    return -1;
                } else if (left.start > right.start) {
                    return 1;
                } else {
                    return 0;
                }
            }

            function isAppliedFor(shift) {
                return shift.shiftapplications && shift.shiftapplications.length > 0;
            }
        }]);
