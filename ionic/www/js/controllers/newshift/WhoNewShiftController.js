angular.module('scheduling-app.controllers')
    .controller('WhoNewShiftController', [
        '$scope',
        '$rootScope',
        '$stateParams',
        '$controller',
        '$q',
        '$state',
        'GENERAL_EVENTS',
        'ResourceService',
        function($scope,
                 $rootScope,
                 $stateParams,
                 $controller,
                 $q,
                 $state,
                 GENERAL_EVENTS,
                 ResourceService
        ) {
            $scope.resetData = function() {
                $scope.other = {};
            };
            $controller('BaseNewShiftController', {$scope: $scope, $stateParams: $stateParams});

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

                $rootScope.$emit(GENERAL_EVENTS.NEWSHIFTS.WHO);
            };

            $scope.descriptionMaxLength = 256;

            $scope.jobTypeClicked = function(jobType) {
                clearClickedJobType();
                $scope.selectedJobType = jobType;
                jobType.selected = true;
                next();
            };

            $scope.next = function next() {
                console.log($scope.description);
                var params = angular.extend({
                    who: $scope.encodeWho(getSelectedJobType()),
                    description: $scope.other.description,
                    title: $scope.other.title
                }, $stateParams);
                $state.go('app.newshift.review', params);
            };

            function getSelectedJobType() {
                var jobId = $scope.other.job;
                if (jobId) {
                    for (var i = 0; i < $scope.jobTypes.length; i++) {
                        if ($scope.jobTypes[i].id == jobId) {
                            return $scope.jobTypes[i];
                        }
                    }
                }
                return null;
            }

            function clearClickedJobType() {
                angular.forEach($scope.jobTypes, function(item) {
                    item.selected = false;
                });
                $scope.selectedJobType = undefined;
            }

            $scope.progressable = function() {
                return $scope.other.job !== undefined &&
                    $scope.other.job !== null &&
                    ($scope.other.description === null ||
                    $scope.other.description === undefined ||
                    $scope.other.description == '' ||
                    $scope.other.description.length <= $scope.descriptionMaxLength);
            };

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
                if ($scope.jobTypes.length > 0) {
                    $scope.other.job = $scope.jobTypes[0].id;
                }
                $scope.selectedJobType = undefined;
            }
        }
    ]
);
