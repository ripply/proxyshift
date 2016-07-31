angular.module('scheduling-app.controllers')
    .controller('ReviewNewShiftController', [
        '$scope',
        '$rootScope',
        '$stateParams',
        '$controller',
        '$q',
        '$state',
        'ResourceService',
        'UserInfoService',
        'GENERAL_EVENTS',
        function($scope,
                 $rootScope,
                 $stateParams,
                 $controller,
                 $q,
                 $state,
                 ResourceService,
                 UserInfoService,
                 GENERAL_EVENTS
        ) {
            $controller('BaseNewShiftController', {$scope: $scope, $stateParams: $stateParams});

            $scope.beforeEnter = function() {
                $rootScope.$emit(GENERAL_EVENTS.NEWSHIFTS.REVIEW);

                $scope.dates = $scope.decodeDates($stateParams.dates);
                $scope.when = $scope.decodeWhens($stateParams.when);
                $scope.where = $scope.decodeWhere($stateParams.where);
                $scope.who = $scope.decodeWho($stateParams.who);
                $scope.description = $scope.decodeDescription($stateParams.description);
                $scope.title = $scope.decodeTitle($stateParams.title);
                $scope.shifts = [];
                $scope.fakeShifts = [];

                var group_id = $scope.where.group_id;
                var location_id = $scope.where.location_id;
                var sublocation_id = $scope.where.sublocation_id;
                var groupuserclass_id = $scope.who.id;
                if (location_id) {
                    var timezone = UserInfoService.getLocation(location_id).timezone;

                    angular.forEach($scope.dates, function(date) {
                        if ($scope.when.hasOwnProperty(date)) {
                            var when = $scope.when[date];
                            var employeesNeeded = when.employees;
                            var startEndTime = $scope.getStartEndTime(
                                location_id,
                                date,
                                when.starttime,
                                when.endtime,
                                when.length
                            );

                            var shift = {
                                location_id: location_id,
                                sublocation_id: sublocation_id,
                                title: $scope.title,
                                description: $scope.description,
                                start: startEndTime.start.format(),
                                end: startEndTime.end.format(),
                                groupuserclass_id: groupuserclass_id,
                                count: employeesNeeded
                            };

                            var fakeShift = angular.extend(angular.copy(shift), {
                                start: startEndTime.start.format('X'),
                                end: startEndTime.end.format('X'),
                                timezone: timezone,
                                timezone_id: timezone.id
                            });

                            $scope.shifts.push(shift);
                            $scope.fakeShifts.push(fakeShift);
                        }
                    });
                    $rootScope.$emit(GENERAL_EVENTS.UPDATES.RESOURCE, 'newShifts', $scope.fakeShifts, $scope.fakeShifts, $scope);
                } else {
                    // invalid data passed in
                }
            };

            $scope.create = function() {
                ResourceService.createMultipleShifts($scope.shifts, function(result) {
                    console.log("SUCCESS");
                    console.log(result);
                    $rootScope.$emit(GENERAL_EVENTS.TOAST, 'info', "You're all set", 'All eligible employees have been notified of your shift request.');
                    $rootScope.$emit(GENERAL_EVENTS.NEWSHIFTS.RESET);
                    $state.go('app.shifts.open');
                }, function(err) {
                    console.log("ERR");
                    console.log(err);
                    $rootScope.$emit(GENERAL_EVENTS.TOAST, 'error', "Failed to send shifts", err.data.data.message);
                });
            };
        }
    ]
);
