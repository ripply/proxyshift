angular.module('scheduling-app.controllers')
    .controller('GroupMembersController', [
        '$scope',
        '$controller',
        '$stateParams',
        '$q',
        'ResourceService',
        function($scope,
                 $controller,
                 $stateParams,
                 $q,
                 ResourceService
        ) {
            $controller('FilterableIncrementalSearchController', {$scope: $scope});
            $scope.get = ResourceService.getGroupMembersSlice;
            $scope.getSearch = ResourceService.getGroupMembersSliceSearch;

            $scope.init = init;
            $scope.states.loading = function(query, start, end, success, error) {

            };
            $scope.states.location = function(query, start, end, success, error) {
                //getAllLocationUsers();
            };
            $scope.states.groupUserWithPermission = function(query, start, end, success, error) {
                getGroupUserAndPermissions(success, error);
            };
            $scope.states.someGroupUsers = function(query, start, end, success, error) {
                getSomeGroupUsers(query, start, end, success, error);
            };

            var loading = {firstname: 'Loading...'};
            var error = {firstname: 'Error'};
            $scope.loading = loading;
            $scope.error = error;
            $scope.permissionsDirty = true;

            function init() {
                $scope.users = [loading];
                $scope.group_id = getGroupId();
                $scope.location_id = getLocationId();
                $scope.user_id = getGroupUserId();
                if ($scope.location_id) {
                    $scope.currentSearchState = 'location';
                } else if ($scope.group_id !== null &&
                    $scope.group_id !== undefined &&
                    $scope.user_id !== null &&
                    $scope.user_id !== undefined) {
                    $scope.permissionsDirty = true;
                    $scope.currentSearchState = 'groupUserWithPermission'
                } else {
                    //getAllGroupUsers()
                    $scope.currentSearchState = 'someGroupUsers';
                    $scope.loadMore();
                    //getSomeGroupUsers(0, fetchIncrement);
                }
            }

            function getAllLocationUsers() {
                var state = $scope.getFetchingState();
                var deferred = $q.defer();
                $scope.fetching = deferred.promise;
                ResourceService.getUsersAtLocation($scope.location_id, function getUsersSuccess(result) {
                    $scope.updateFetchingState(state, result, 0, result.size, result.size);
                    deferred.resolve();
                    delete $scope.fetching;
                }, function getUsersError(response) {
                    $scope.users = [error];
                    deferred.reject();
                    delete $scope.fetching;
                });
            }

            function getAllGroupUsers() {
                var group_id = getGroupId();
                var state = $scope.getFetchingState();
                var deferred = $q.defer();
                $scope.fetching = deferred.promise;
                ResourceService.getGroupMembers(group_id, function getAllGroupUsersSuccess(result) {
                    $scope.updateFetchingState(state, result, 0, result.size, result.size);
                    deferred.resolve();
                    delete $scope.fetching;
                }, function getAllGroupUsersError(response) {
                    $scope.users = [error];
                    deferred.reject();
                    delete $scope.fetching;
                })
            }

            function getGroupUserAndPermissions(success, error) {
                var queries = [getGroupUser()];
                if ($scope.permissionsDirty) {
                    queries.push(getGroupPermissions());
                }
                $q.all(queries)
                    .then(success, error);
            }

            function getGroupUser() {
                var deferred = $q.defer();
                $scope.fetching = deferred.promise;
                ResourceService.getGroupMember($scope.group_id, $scope.user_id, function getGroupUserSuccess(result) {
                    $scope.user = result;
                    deferred.resolve();
                    delete $scope.fetching;
                }, function getGroupUserError(response) {
                    $scope.user = error;
                    deferred.reject();
                    delete $scope.fetching;
                });

                return deferred.promise;
            }

            function getGroupPermissions() {
                var deferred = $q.defer();
                ResourceService.getGroupPermissions(getGroupId(), function getGroupPermissionsSuccess(result) {
                    $scope.permissions = result;
                    $scope.permissionsDirty = false;
                    deferred.resolve();
                }, function getGroupPermissionsError() {
                    deferred.reject();
                });

                return deferred.promise;
            }

            function getSomeGroupUsers(query, start, end, success, error) {
                var group_id = getGroupId();
                var state = $scope.getFetchingState();
                var deferred = $q.defer();
                $scope.fetching = deferred.promise;

                function getAllGroupUsersSuccess(result) {
                    $scope.updateFetchingState(state, result, result.start, result.end, result.size);
                    deferred.resolve();
                    delete $scope.fetching;
                    if (success) {
                        success(result);
                    }
                }

                function getAllGroupUsersError(response) {
                    console.log(response);
                    $scope.users = [error];
                    deferred.reject();
                    delete $scope.fetching;
                    if (error) {
                        error(response);
                    }
                }

                if (!query || query == '') {
                    ResourceService.getGroupMembersSlice(group_id, start, end, getAllGroupUsersSuccess, getAllGroupUsersError);
                } else {
                    ResourceService.getGroupMembersSliceSearch(group_id, start, end, query, getAllGroupUsersSuccess, getAllGroupUsersError);
                }
            }

            function getGroupId() {
                return $stateParams.group_id;
            }

            function getLocationId() {
                return $stateParams.location_id;
            }

            function getGroupUserId() {
                return $stateParams.user_id;
            }
        }
    ]);
