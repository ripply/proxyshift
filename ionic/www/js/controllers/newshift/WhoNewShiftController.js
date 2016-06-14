angular.module('scheduling-app.controllers')
    .controller('WhoNewShiftController', [
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
                ResourceService.getAllJobs(
                    function(result) {
                        $scope.allJobs = result;
                        setupJobTypesForLocationOrSublocation();
                    }, function() {
                        // error....
                        // TODO: We need this information
                    }
                );
            };

            $scope.description = {};

            $scope.jobTypeClicked = function(jobType) {
                clearClickedJobType();
                $scope.selectedJobType = jobType;
                jobType.selected = true;
                next();
            };

            function next() {
                console.log($scope.description);
                var d = angular.extend({
                    who: $scope.encodeWho($scope.selectedJobType),
                    description: $scope.description.text
                }, $stateParams);
                console.log(d);
                $state.go('app.newshift.review', d);
            }

            function clearClickedJobType() {
                angular.forEach($scope.jobTypes, function(item) {
                    item.selected = false;
                });
                $scope.selectedJobType = undefined;
            }

            function setupJobTypesForLocationOrSublocation() {
                var where = $scope.decodeWhere($stateParams.where);
                var group_id = where.group_id;
                $scope.jobTypes = $scope.allJobs.filter(function(value) {
                    if (value.hasOwnProperty('group_id')) {
                        return value.group_id == group_id;
                    } else {
                        return false;
                    }
                });
                $scope.selectedJobType = undefined;
                console.log($scope.jobTypes);
            }
        }
    ]
);
