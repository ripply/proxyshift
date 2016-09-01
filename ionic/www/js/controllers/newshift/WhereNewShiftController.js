angular.module('scheduling-app.controllers')
    .controller('WhereNewShiftController', [
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
                $scope.when = {};
            };
            $controller('BaseNewShiftController', {$scope: $scope, $stateParams: $stateParams});
            $controller('FilterableIncrementalSearchController', {$scope: $scope});

            $scope.state = $stateParams;

            $scope.beforeEnter = function() {
                $rootScope.$emit(GENERAL_EVENTS.NEWSHIFTS.WHERE);
            };

            var requiredWhenData = ['starttime', 'endtime', 'length', 'employees'];

            $scope.get = ResourceService.getLocationsSlice;
            $scope.getSearch = ResourceService.getLocationsSearchSlice;

            $scope.init = init;

            $scope.states.loading = function(query, start, end, success, error) {

            };
            $scope.states.locations = function(query, start, end, success, error) {
                var queries = [];
                queries.push(getLocations(start, end));
                $q.all(queries)
                    .then(success, error);
            };

            var loading = {firstname: 'Loading...'};
            var error = {firstname: 'Error'};
            $scope.loading = loading;
            $scope.error = error;

            function init() {
                //getAllGroupUsers()
                $scope.users = [];
                $scope.currentSearchState = 'locations';
                $scope.loadMore();
                ResourceService.getAllJobs(
                    function(result) {
                        $scope.allJobs = result;
                    }, function() {
                        // error....
                        // TODO: We need this information
                    }
                );
                //getSomeGroupUsers(0, fetchIncrement);
            }

            init();

            $scope.whereStateParams = function() {
                return angular.extend({
                    when: getWhen()
                }, $stateParams);
            };

            $scope.getDates = function() {
                return $scope.parseDates($stateParams.dates);
            };

            function getWhen() {
                return $scope.encodeWhens($scope.when);
            }

            function getLocations(start, end) {
                var deferred = $q.defer();
                var state = $scope.getFetchingState();
                ResourceService.getLocationsSlice(start, end, function getGroupPermissionsSuccess(result) {
                    $scope.permissions = result;
                    $scope.updateFetchingState(state, result, result.start, result.end, result.size);
                    deferred.resolve();
                }, function getGroupPermissionsError() {
                    deferred.reject();
                });

                return deferred.promise;
            }

            function clearClickedJobType() {
                unselect($scope.locations);
                unselect($scope.sublocations);
                $scope.selected = undefined;
                $scope.sublocation = undefined;
                $scope.locationSelected = false;
                $scope.selectedLocationRadio = undefined;
            }

            $scope.locationClicked = function(location) {
                unselect($scope.locations);
                unselect($scope.sublocations);
                if ($scope.selected == location) {
                    clearClickedJobType();
                }
                location.selected = true;
                $scope.selected = location;
                $scope.sublocations = location.sublocations;
                $scope.sublocation = undefined;
                //setupJobTypesForLocationOrSublocation();
                if (!location.sublocations || location.sublocations.length === 0) {
                    $scope.locationSelected = true;
                    next();
                }
            };

            $scope.sublocationClicked = function(clickedSublocation) {
                console.log("************8");
                console.log(clickedSublocation);
                console.log("*************");
                if (clickedSublocation.selected) {
                    unselect($scope.sublocations);
                } else {
                    unselect($scope.sublocations);
                    if ($scope.sublocation == clickedSublocation) {
                        clearClickedJobType();
                    }
                    $scope.sublocation = clickedSublocation;
                    clickedSublocation.selected = true;
                    $scope.locationSelected = true;
                    next();
                }
            };

            function next() {
                var dataa = angular.extend({
                    where: $scope.encodeWhere($scope.selected.group_id, $scope.selected.id, $scope.sublocation && $scope.sublocation.id || undefined)
                }, $stateParams);
                $state.go('app.newshift.who', dataa);
            }

            function unselect(list) {
                $scope.locationSelected = false;
                if (list) {
                    angular.forEach(list, function (item) {
                        item.selected = false;
                    });
                }
            }

            $scope.progressable = function() {
                var progressable = true;
                angular.forEach($scope.getDates(), function(date) {
                    if ($scope.when.hasOwnProperty(date)) {
                        angular.forEach(requiredWhenData, function(requiredKey) {
                            if (!$scope.when[date].hasOwnProperty(requiredKey)) {
                                progressable = false;
                            }
                        });
                    }
                });

                return progressable;
            };
        }
    ]
);
