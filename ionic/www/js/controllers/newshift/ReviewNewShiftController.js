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
                console.log("DECODED");
            };

            $scope.create = function() {
                var shifts = [];
                var location_id = $scope.location;
                var sublocation_id = $scope.sublocation;
                console.log($scope.selectedJobType);
                var location = {
                    title: 'text',
                    description: $scope.description,
                    groupuserclass_id: $scope.selectedJobType.id
                };
                if ($scope.sublocation) {
                    location.sublocation_id = $scope.sublocation.id;
                } else if ($scope.location) {
                    location.location_id = $scope.selected.id;
                } else {
                    return;
                }
                angular.forEach($scope.dateState, function(value, key) {
                    shifts.push(
                        angular.extend({
                            start: value.time,
                            end: value.hours,
                            count: value.counter
                        }, location)
                    );
                });

                ResourceService.createMultipleShifts(shifts, function(result) {
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
