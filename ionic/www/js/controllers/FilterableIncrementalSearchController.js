/**
 * GroupMembersController
 */
angular.module('scheduling-app.controllers')
    .controller('FilterableIncrementalSearchController', [
        '$scope',
        '$rootScope',
        '$stateParams',
        '$controller',
        '$q',
        '$timeout',
        function($scope,
                 $rootScope,
                 $stateParams,
                 $controller,
                 $q,
                 $timeout
        ) {
            $controller('BaseModelController', {$scope: $scope});

            $scope.loading = {};

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
            $scope.fetchIncrement = 2;
            $scope.states = {};
            $scope.fetchState = {};

            $scope.queryChanged = function queryChanged(value) {
                $scope.query = value;
                loadMore();
            };

            function init() {
                $scope.fetching = undefined;
                $scope.filteredUsers = {};
                //$scope.users = [loading];
                $scope.init();
            }

            $scope.moreToLoad = moreToLoad;
            $scope.loadMore = loadMore;

            function moreToLoad() {
                var complete = isStateComplete();
                return !complete;
            }

            $scope.loadMore = loadMore;

            function loadMore() {
                if ($scope.fetching) {
                    // do nothing
                } else {
                    var range = getFetchableRange();
                    if (range) {
                        fetchThings($scope.query, range.from, range.to, infiniteScrollComplete, infiniteScrollFailed);
                    } else {
                        infiniteScrollComplete();
                    }
                }
            }

            function fetchThings(query, from, to, success, error) {
                $scope.states[$scope.currentSearchState](query, from, to, success, error);
            }

            function getFetchableRange() {
                var state = getFetchingState();
                var fetchStateAll = $scope.fetchState[state];
                var defaultInterval = {
                    from: 0,
                    to: $scope.fetchIncrement
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
                                to: previousInterval.to + 1 + $scope.fetchIncrement
                            };
                        } else {
                            // includes the end
                            // everything is fetched
                            return null;
                        }
                    } else {
                        // nothing fetched yet
                        return defaultInterval;
                    }
                }
            }

            $scope.getFetchingState = getFetchingState;

            function getFetchingState() {
                return $scope.query;
            }

            $scope.updateFetchingState = updateFetchingState;

            function updateFetchingState(state, result, from, to, total) {
                if (to < from) {
                    return;
                }

                var fetchStateAll = $scope.fetchState[state];
                if (fetchStateAll === undefined) {
                    $scope.fetchState[state] = {
                        list: []
                    };
                    return updateFetchingState(state, result, from, to, total);
                }

                var existingUsers = $scope.users;

                if (result.hasOwnProperty('result')) {
                    result = result.result;
                }

                if (existingUsers.length == 1 &&
                    (existingUsers.indexOf($scope.loading) >= 0 || existingUsers.indexOf(error) >= 0)) {
                    existingUsers.length = 0;
                }

                if (result instanceof Array) {
                    angular.forEach(result, function(user) {
                        if (!$scope.filteredUsers.hasOwnProperty(user.id)) {
                            $scope.users.push(user);
                            $scope.filteredUsers[user.id] = user;
                        }
                    });
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

            function infiniteScrollFailed() {
                $timeout(infiniteScrollComplete, 5000);
            }

            $scope.filteredUsers = {};
        }]
);
