/**
 * GroupMembersController
 */
angular.module('scheduling-app.controllers')
    .controller('GroupMembersController', [
        '$scope',
        '$rootScope',
        '$stateParams',
        '$controller',
        '$q',
        'ResourceService',
        function($scope,
                 $rootScope,
                 $stateParams,
                 $controller,
                 $q,
                 ResourceService
        ) {
            $controller('BaseModelController', {$scope: $scope});
            $scope.stateParams = $stateParams;

            $scope.beforeEnter = init;
            $scope.afterLeave = function() {
                function cleanup() {
                    $scope.users = [];
                    $scope.fetchState = {};
                }
                if ($scope.fetching) {
                    $scope.fetching.then(cleanup, cleanup, cleanup);
                } else {
                    cleanup();
                }
            };
            var fetchIncrement = 2;

            function init() {
                $scope.filteredUsers = {};
                $scope.users = [{firstname: 'Loading...'}];
                $scope.group_id = getGroupId();
                $scope.location_id = getLocationId();
                $scope.fetchState = {};
                if ($scope.location_id) {
                    getAllLocationUsers();
                } else {
                    //getAllGroupUsers()
                    loadMore();
                    //getSomeGroupUsers(0, fetchIncrement);
                }
            }

            $scope.moreToLoad = moreToLoad;
            $scope.loadMore = loadMore;

            function moreToLoad() {
                var complete = isStateComplete();
                return !complete;
            }

            function loadMore() {
                if ($scope.fetching) {
                    // do nothing
                } else {
                    var range = getFetchableRange();
                    if (range) {
                        getSomeGroupUsers(range.from, range.to, infiniteScrollComplete, infiniteScrollComplete);
                    }
                }
            }

            function getFetchableRange() {
                var state = getFetchingState();
                var fetchStateAll = $scope.fetchState[state];
                var defaultInterval = {
                    from: 0,
                    to: fetchIncrement
                };

                if (fetchStateAll === undefined) {
                    return defaultInterval;
                } else if (fetchStateAll.users) {
                    var users = fetchStateAll.users;
                    var previousInterval = null;
                    if (fetchStateAll.total === undefined) {
                        return defaultInterval;
                    }

                    for (var i = 0; i < users.length; i++) {
                        var interval = users[i];
                        if (previousInterval) {
                            // check for space
                            if (interval.from - previousInterval.to > 1) {
                                return {
                                    from: previousInterval.to + 1,
                                    to: interval.from - 1
                                };
                            }
                        }

                        previousInterval = interval;
                    }

                    if (previousInterval) {
                        // see if last interval includes the end
                        if (previousInterval.to < fetchStateAll.total) {
                            return {
                                from: previousInterval.to + 1,
                                to: previousInterval.to + 1 + fetchIncrement
                            };
                        } else {
                            // includes the end
                            // everthing is fetched
                            return null;
                        }
                    } else {
                        // nothing fetched yet
                        return defaultInterval;
                    }
                }
            }

            function getFetchingState() {
                return $scope.query;
            }

            function updateFetchingState(state, from, to, total) {
                if (to < from) {
                    return;
                }

                var fetchStateAll = $scope.fetchState[state];
                if (fetchStateAll === undefined) {
                    $scope.fetchState[state] = {
                        list: []
                    };
                    return updateFetchingState(state, from, to, total);
                }

                var fetchState = fetchStateAll.users;
                if (fetchState === undefined) {
                    fetchState = [];
                    fetchStateAll.users = fetchState;
                }

                var previousInterval = undefined;
                var handled = false;
                for (var i = 0; i < fetchState.length; i++) {
                    var interval = fetchState[i];
                    // determine if we need to extend this interval lower
                    var previousTo = from;
                    if (from <= interval.from && to >= interval.to) {
                        // interval intersects and extends to left and right
                        previousTo = from;
                        if (previousInterval) {
                            previousTo = Math.max(previousInterval.to, from);
                        }
                        interval.from = previousTo;
                        interval.to = to;
                        // we are done
                        handled = true;
                        break;
                    } else if (from <= interval.from && to <= interval.to) {
                        // interval intersects and extends to left
                        // extend interval to left
                        previousTo = from;
                        if (previousInterval) {
                            previousTo = Math.max(previousInterval.to, from);
                        }
                        interval.from = previousTo;
                        // we are done
                        handled = true;
                        break;
                    } else if (from >= interval.from && to <= interval.to) {
                        // interval fits inside this interval
                        // do nothing
                        // we are done
                        handled = true;
                        break;
                    } else if (from >= interval.from && to >= interval.to) {
                        // interval intersects and extends to right only
                        // peak at next interval and see if it exists
                        if (i + 1 >= fetchState.length) {
                            // no next interval
                            // handle this here
                            interval.to = to;
                            // we are done
                            handled = true;
                            break;
                        } else {
                            // let next pass handle it
                        }
                    } else if (to < from) {
                        // exists to left of interval only
                        var newInterval = {
                            to: to,
                            from: from
                        };

                        // insert it before us
                        if (i == 0) {
                            fetchState = [newInterval].concat(fetchState);
                        } else {
                            fetchState = fetchState.slice(0, i - 1)
                                .concat([newInterval])
                                .concat(fetchState.slice(i, fetchState.length));
                        }
                        // we are done
                        handled = true;
                        break;
                    }

                    previousInterval = interval;
                }

                if (!handled) {
                    fetchState.push({
                        to: to,
                        from: from
                    });
                }

                var count = 0;
                for (var j = 0; j < fetchState.length; j++) {
                    var interval_ = fetchState[j];
                    count += interval_.to - interval_.from;
                }

                fetchStateAll.count = count;
                fetchStateAll.total = total;
                fetchStateAll.missing = total - count;
            }

            function isStateComplete() {
                var state = getFetchingState();

                var fetchStateAll = $scope.fetchState[state];
                if (fetchStateAll === undefined) {
                    return false;
                } else {
                    if (!$scope.users) {
                        return false;
                    }
                    return fetchStateAll.missing === 0 &&
                        fetchStateAll.count === $scope.users.length;
                }
            }

            function infiniteScrollComplete() {
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }

            function getGroupId() {
                return $scope.stateParams.group_id;
            }

            function getLocationId() {
                return $stateParams.location_id;
            }

            function getAllLocationUsers() {
                var state = getFetchingState();
                var deferred = $q.defer();
                $scope.fetching = deferred.promise;
                ResourceService.getUsersAtLocation($scope.location_id, function getUsersSuccess(result) {
                    $scope.users = result;
                    updateFetchingState(state, 0, result.size, result.size);
                    deferred.resolve();
                    delete $scope.fetching;
                }, function getUsersError(response) {
                    $scope.users = [{firstname: 'Error'}];
                    deferred.reject();
                    delete $scope.fetching;
                });
            }

            function getAllGroupUsers() {
                var group_id = getGroupId();
                var state = getFetchingState();
                var deferred = $q.defer();
                $scope.fetching = deferred.promise;
                ResourceService.getGroupMembers(group_id, function getAllGroupUsersSuccess(result) {
                    $scope.users = result;
                    updateFetchingState(state, 0, result.size, result.size);
                    deferred.resolve();
                    delete $scope.fetching;
                }, function getAllGroupUsersError(response) {
                    $scope.users = [{firstname: 'Error'}];
                    deferred.reject();
                    delete $scope.fetching;
                })
            }

            $scope.filteredUsers = {};

            function getSomeGroupUsers(start, end, success, error) {
                var group_id = getGroupId();
                var state = getFetchingState();
                var deferred = $q.defer();
                $scope.fetching = deferred.promise;
                ResourceService.getGroupMembersSlice(group_id, start, end, function getAllGroupUsersSuccess(result) {
                    if (result.hasOwnProperty('result')) {
                        var users = result.result;
                        if (users instanceof Array) {
                            if ($scope.users.length == 1) {
                                $scope.users = [];
                            }
                            angular.forEach(users, function(user) {
                                if (!$scope.filteredUsers.hasOwnProperty(user.id)) {
                                    $scope.users.push(user);
                                    $scope.filteredUsers[user.id] = user;
                                }
                            });
                        }
                    }
                    updateFetchingState(state, result.start, result.end, result.size);
                    deferred.resolve();
                    delete $scope.fetching;
                    if (success) {
                        success(result);
                    }
                }, function getAllGroupUsersError(response) {
                    $scope.users = [{firstname: 'Error'}];
                    deferred.reject();
                    delete $scope.fetching;
                    if (error) {
                        error(response);
                    }
                })
            }

        }]
);
