angular.module('scheduling-app.controllers')
    .controller('ReviewNewShiftController', [
        '$scope',
        '$rootScope',
        '$stateParams',
        '$controller',
        '$q',
        '$state',
        'ResourceService',
        function($scope,
                 $rootScope,
                 $stateParams,
                 $controller,
                 $q,
                 $state,
                 ResourceService
        ) {
            $controller('BaseNewShiftController', {$scope: $scope});

            $scope.beforeEnter = function() {
                $scope.dates = $scope.decodeDates($stateParams.dates);
                $scope.when = $scope.decodeWhens($stateParams.when);
                $scope.where = $scope.decodeWhere($stateParams.where);
                $scope.who = $scope.decodeWho($stateParams.who);
                $scope.description = $scope.decodeDescription($stateParams.description);
                $scope.shifts = [];

                var group_id = $scope.where.group_id;
                var location_id = $scope.where.location_id;
                var sublocation_id = $scope.where.sublocation_id;
                var groupuserclass_id = $scope.who.id;

                var title = 'test';

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
                            title: title,
                            description: $scope.description,
                            start: startEndTime.start.format(),
                            end: startEndTime.end.format(),
                            groupuserclass_id: groupuserclass_id,
                            count: employeesNeeded
                        };

                        $scope.shifts.push(shift);
                    }
                });
                console.log($scope.shifts);
            };

            $scope.create = function() {
                ResourceService.createMultipleShifts($scope.shifts, function(result) {
                    console.log("SUCCESS");
                    console.log(result);
                }, function(err) {
                    console.log("ERR");
                    console.log(err);
                });
            };
        }
    ]
);
