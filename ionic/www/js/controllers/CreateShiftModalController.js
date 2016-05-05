angular.module('scheduling-app.controllers')
    .controller('CreateShiftModalController', [
        '$rootScope',
        '$scope',
        '$ionicScrollDelegate',
        '$timeout',
        '$location',
        '$controller',
        '$window',
        '$q',
        'GENERAL_EVENTS',
        'UserInfoService',
        'ResourceService',
        function(
            $rootScope,
            $scope,
            $ionicScrollDelegate,
            $timeout,
            $location,
            $controller,
            $window,
            $q,
            GENERAL_EVENTS,
            UserInfoService,
            ResourceService
        ) {
            $controller('FilterableIncrementalSearchController', {$scope: $scope});
            var calendarName = 'create-shift-calendar';

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

            function recalculateDivHeight() {
                if ($scope.currentStepDiv) {
                    $scope.currentStepDivHeight = $scope.currentStepDiv.height();
                }
            }

            $window.addEventListener('resize', function(event) {
                $location.hash($scope.location);
                $ionicScrollDelegate.anchorScroll(false);
                recalculateDivHeight();
            });

            var steps = [
                'create-shift-date',
                'create-shift-when',
                'create-shift-where',
                'create-shift-who',
                'create-shift-review'
            ];

            var substeps = {};

            $scope.next = true;
            $scope.prev = true;
            $scope.date = [];

            function defaultGoNext(index, next) {
                return next.id;
            }

            function defaultGoPrev(index, prev) {
                return prev.id;
            }

            var actions = [
                {
                    id: 'create-shift-date',
                    next: function() {
                        return $scope.date.length > 0;
                    },
                    calc: function() {

                    },
                    gonext: defaultGoNext
                },
                {
                    id: 'create-shift-when',
                    calc: function() {
                        var substeps = [];
                        angular.forEach($scope.date, function(value, key) {
                            substeps.push(
                                angular.extend({
                                    key: value.key,
                                    prev: function(index, substeps) {
                                        // show previous button on anything but the first shift
                                        //return index != 0;
                                        return true;
                                    },
                                    title: function() {
                                        return value.key;
                                    },
                                    goprev: defaultGoPrev,
                                    gonext: defaultGoNext,
                                    id: 'create-shift-when-' + value.key
                                }, value)
                            );
                        });

                        substeps.sort(function(left, right) {
                            if (left.key == right.key) {
                                return 0;
                            } else {
                                return left.key < right.key ? -1:1;
                            }
                        });

                        return substeps;
                    },
                    next: function() {
                        return true;
                    }
                },
                {
                    id: 'create-shift-where',
                    calc: function() {

                    },
                    visible: function() {
                        $ionicScrollDelegate.$getByHandle('shift-where').scrollTop();
                    },
                    anchored: function() {
                        $ionicScrollDelegate.$getByHandle('shift-where').scrollTop();
                    },
                    prev: function() {
                        return true;
                    },
                    next: function() {
                        return $scope.locationSelected;
                    },
                    goprev: defaultGoPrev,
                    gonext: defaultGoNext
                },
                {
                    id: 'create-shift-who',
                    calc: function() {

                    },
                    prev: function() {
                        return true;
                    },
                    next: function() {
                        return true;
                    },
                    goprev: defaultGoPrev,
                    gonext: defaultGoNext
                },
                {
                    id: 'create-shift-review',
                    calc: function() {

                    },
                    prev: function() {
                        return true;
                    },
                    next: function() {
                        return false;
                    },
                    goprev: defaultGoPrev
                }
            ];

            $scope.index = 0;
            $scope.subindex = -1;
            $scope.computedState = {};
            $scope.state = [];
            $scope.currentId = undefined;
            $scope.currentStepDiv = undefined;

            calc();

            function calc(index, subindex) {
                var persist = false;
                if (index === undefined) {
                    index = $scope.index;
                    persist = true;
                }
                if (subindex === undefined) {
                    subindex = $scope.subindex;
                    persist = true;
                }
                // determine which major page we are at
                // that should be index
                var major = actions[index];
                var majorId = major.id;
                var differentId = $scope.currentId != majorId;
                $scope.currentId = majorId;
                if (differentId) {
                    $scope.currentStepDiv = angular.element( document.querySelector( '#' + majorId ) );
                    recalculateDivHeight();
                }
                var computedState = $scope.computedState;
                // run this major page's calc to see if it has any children pages
                var childrenPages;
                if (major.hasOwnProperty('calc')) {
                    childrenPages = major.calc();
                }
                if (!computedState.hasOwnProperty(majorId)) {
                    computedState[majorId] = {};
                }
                var showPrev;
                var showNext;
                var goPrev;
                var goNext;
                if (childrenPages) {
                    angular.forEach(childrenPages, function(childPage) {
                        if (!childPage.hasOwnProperty('calc')) {
                            childPage.calc = major.calc;
                        }
                    });
                    // children pages exist
                    // this will be an array of state like objects of the same format of major
                    // just outright replace what is currently computed as they should not contain state
                    computedState[majorId].children = childrenPages;
                    // if we are currently on a child page
                    // we need to also run calc for that
                    if (subindex >= 0) {
                        var child = childrenPages[subindex];
                        if (child.hasOwnProperty('calc')) {
                            child.calc();
                        }
                        // prefer child's prev/next if it exists
                        if (child.hasOwnProperty('prev')) {
                            showPrev = child.prev(subindex);
                        }
                        if (child.hasOwnProperty('next')) {
                            showNext = child.next(subindex);
                        }
                        if (child.hasOwnProperty('goprev')) {
                            goPrev = child.goprev;
                        }
                        if (child.hasOwnProperty('gonext')) {
                            goNext = child.gonext;
                        }
                    }
                } else {
                    computedState[majorId].children = [];
                }
                // if child did not have any preference for showing/hiding buttons
                // check the parent
                if (showPrev === undefined && major.hasOwnProperty('prev')) {
                    showPrev = major.prev();
                }
                if (showNext === undefined && major.hasOwnProperty('next')) {
                    showNext = major.next();
                }
                if (major.hasOwnProperty('goprev')) {
                    goPrev = major.goprev;
                }
                if (major.hasOwnProperty('gonext')) {
                    goNext = major.gonext;
                }
                // defaults if parent has no preference
                if (showPrev === undefined) {
                    showPrev = false;
                }
                if (showNext === undefined) {
                    showNext = false;
                }

                if (persist) {
                    $scope.prev = showPrev;
                    $scope.next = showNext;
                    $scope.goprev = goPrev;
                    $scope.gonext = goNext;
                }
            }

            function recalculateSteps() {
                var existingSteps = $scope.steps;
                $scope.steps = {};
                console.log($scope.steps);
                angular.forEach($scope.computedState, function(state, id) {
                    $scope.steps[id] = {
                        show: true,
                        locked: existingSteps[id] ? existingSteps[id].locked:true
                    };
                    if (state.children) {
                        angular.forEach(state.children, function(child) {
                            $scope.steps[child.id] = {
                                show: true,
                                locked: existingSteps[id] ? existingSteps[id].locked:true
                            };
                        });
                    }
                });
                angular.forEach(actions, function(action) {
                    var id = action.id;
                    if (!$scope.steps.hasOwnProperty(id)) {
                        $scope.steps[id] = {
                            show: true,
                            locked: true
                        };
                    }
                });
                console.log($scope.steps);
            }

            function getCurrentScreen(index, subindex) {
                var recurse = false;
                if (index === undefined) {
                    index = $scope.index;
                    recurse = true;
                }
                if (subindex === undefined) {
                    subindex = $scope.subindex;
                    recurse = true;
                }
                var major = actions[index];
                var majorId = major.id;
                calc(index, subindex);
                var state = $scope.computedState[majorId];
                var prev;
                var next;
                var nextIndex = 0;
                var nextSubindex = -1;
                var prevIndex = 0;
                var prevSubindex = -1;
                var current = major;
                if (state.children.length > 0) {
                    if (subindex < 0) {
                        subindex = 0;
                    }
                    if (subindex > 0) {
                        prev = state.children[subindex - 1];
                        prevIndex = index;
                        prevSubindex = subindex - 1;
                    }
                    current = state.children[subindex];
                    if (state.children.length - subindex > 1) {
                        nextIndex = index;
                        nextSubindex = subindex + 1;
                        next = state.children[subindex + 1];
                    } else {
                        // no next subindex
                        // next should be the next index
                        if (actions.length - index > 1) {
                            next = actions[index + 1];
                            nextIndex = index + 1;
                            nextSubindex = -1;
                            if (subindex <= 0) {
                                prevIndex = index - 1;
                                prevSubindex = -1 ;
                            }
                        } else {
                            // no next
                        }
                    }
                }
                if (prev === undefined) {
                    if (index > 0) {
                        prevIndex = index - 1;
                        prev = actions[index - 1];
                    } else {
                        // no previous
                    }
                }
                if (next === undefined) {
                    if (actions.length - index > 0) {
                        nextIndex = index + 1;
                        next = actions[index + 1];
                    } else {
                        // no next, at end
                    }
                }
                if (recurse) {
                    if (next) {
                        var nextScreen = getCurrentScreen(nextIndex, nextSubindex);
                        next = nextScreen.current;
                        nextIndex = nextScreen.scopeIndex;
                        nextSubindex = nextScreen.scopeSubindex;
                    }
                    if (prev) {
                        var prevScreen = getCurrentScreen(prevIndex, prevSubindex);
                        prev = prevScreen.current;
                        prevIndex = prevScreen.scopeIndex;
                        prevSubindex = prevScreen.scopeSubindex;
                    }
                    var result = getCurrentScreen(index, subindex);
                    result.next = next;
                    result.nextIndex = nextIndex;
                    result.nextSubindex = nextSubindex;
                    result.prev = prev;
                    result.prevIndex = prevIndex;
                    result.prevSubindex = prevSubindex;
                    return result;
                } else {
                    return {
                        index: subindex > 0 ? index : subindex,
                        scopeIndex: index,
                        scopeSubindex: subindex,
                        children: current.hasOwnProperty('children') ? current.children : undefined,
                        prev: prev,
                        prevIndex: prevIndex,
                        prevSubindex: prevSubindex,
                        current: current,
                        next: next,
                        nextIndex: nextIndex,
                        nextSubindex: nextSubindex
                    };
                }
            }

            $scope.nextClicked = function() {
                calc();
                var current = getCurrentScreen();
                if ($scope.gonext) {
                    if (current.next) {
                        current.next.calc();
                        current = getCurrentScreen();
                    }
                    var id = $scope.gonext(current.index, current.next, current.children);
                    /*$scope.index = current.nextIndex;
                    $scope.subindex = current.nextSubindex;
                    calc();*/
                    slideTo(id);
                }
            };

            $scope.prevClicked = function() {
                calc();
                var current = getCurrentScreen();
                if ($scope.goprev) {
                    if (current.prev) {
                        current.prev.calc();
                        current = getCurrentScreen();
                    }
                    var id = $scope.goprev(current.index, current.prev, current.children);
                    /*$scope.index = current.prevIndex;
                    $scope.subindex = current.prevSubindex;
                    calc();*/
                    slideTo(id);
                }
            };

            var headers = [
                'Select date(s)',
                'Start time/length',
                'Where',
                'Who',
                'Review'
            ];

            $scope.header = headers[0];

            $scope.steps = [];
            $scope.substeps = {};
            $scope.substep = undefined;
            resetSteps();

            function resetSteps() {
                $scope.step = 0;
                angular.forEach($scope.computedState, function(state, id) {
                    $scope.steps[id] = {
                        show: true,
                        locked: true
                    };
                    if (state.children) {
                        angular.forEach(state.children, function(child) {
                            $scope.steps[child.id] = {
                                show: true,
                                locked: true
                            };
                        });
                    }
                });
                angular.forEach(actions, function(action) {
                    var id = action.id;
                    if (!$scope.steps.hasOwnProperty(id)) {
                        $scope.steps[id] = {
                            show: true,
                            locked: true
                        };
                    }
                });
            }

            function showAllSteps() {
                for (var i = 0, length = Object.keys($scope.steps).length; i < length; i++) {
                    var otherId = Object.keys($scope.steps)[i];
                    $scope.steps[otherId].show = true;
                }
            }

            function hideOtherSteps(id) {
                for (var i = 0, length = Object.keys($scope.steps).length; i < length; i++) {
                    var otherId = Object.keys($scope.steps)[i];
                    $scope.steps[otherId].show = otherId == id;
                }
            }

            $scope.timePickerObjectTime = {};
            $scope.timePickerObjectLength = {};
            //getLocations();

            $scope.$on('modal:createshift:reset', function() {
                console.log('reset');
                $ionicScrollDelegate.scrollTop(false);
                $rootScope.$broadcast('events:calendar:reset', calendarName);
                $rootScope.$broadcast('events:calendar:show', calendarName);
                $rootScope.$broadcast('events:calendar:currentmonth', calendarName);
                //getLocations();
                $scope.selected = null;
                resetSteps();
                $scope.init();
            });

            $scope.dateState = {};

            $rootScope.$on('events:calendar:clicked', function(state, name, selected) {
                if (name == calendarName) {
                    if (Object.keys(selected).length != 0) {
                        $scope.date = [];
                        var hours = (new Date()).getHours();
                        var minutes = (new Date()).getMinutes();
                        if (minutes > 15) {
                            if (minutes <= 30) {
                                minutes = 30;
                            } else if (minutes < 45) {
                                minutes = 30;
                            } else {
                                hours += 1;
                                minutes = 0;
                            }
                        } else {
                            minutes = 0;
                        }
                        hours = hours * 60 * 60;
                        minutes *= 60;
                        angular.forEach(selected, function(value, key) {
                            var date = moment();
                            date.year(value.year);
                            date.month(value.month);
                            date.date(value.day);
                            $scope.date.push(
                                angular.extend({
                                    key: key,
                                    moment: date
                                }, value)
                            );
                            $scope.dateState[key] = angular.extend({
                                counter: 1,
                                time: {
                                    inputEpochTime: hours + minutes,
                                    step: 5
                                },
                                hours: {
                                    inputEpochTime: 8 * 60 * 60, // 8 hours by default
                                    step: 5
                                }
                            }, $scope.dateState[key]);
                        });
                        $scope.date.sort(function(left, right) {
                            if (left.key == right.key) {
                                return 0;
                            } else {
                                return left.key < right.key ? -1:1;
                            }
                        });
                    } else {
                        $scope.date = [];
                        resetSteps();
                    }
                    calc();
                }
            });

            function convertToLocationTime(time) {
                return time;
            }

            $scope.getReadableDate = function() {
                if ($scope.date) {
                    return $scope.date.format('dddd') + ", " + $scope.date.format('LL');
                } else {
                    return "Select a date";
                }
            };

            $scope.incrementEmployees = function(day) {
                if ($scope.dateState.hasOwnProperty(day)) {
                    $scope.dateState[day].counter += 1;
                }
            };

            $scope.decrementEmployees = function(day) {
                if ($scope.dateState.hasOwnProperty(day)) {
                    if ($scope.dateState[day].counter <= 0) {
                        $scope.dateState[day].counter = 0;
                    } else {
                        $scope.dateState[day].counter -= 1;
                    }
                }
            };

            $scope.sliding = false;

            $scope.slideTo = slideTo;
            $scope.navigateTo = navigateTo;

            function navigateTo(location) {
                if ($scope.steps.hasOwnProperty(location) && !$scope.steps[location].locked) {
                    slideTo(location);
                }
            }

            function slideTo(location) {
                console.log("Sliding: " + location);
                if ($scope.sliding) {
                    return;
                }
                var index, subindex;
                var state = $scope.computedState;
                var parentId;
                var object;
                for (var i = 0; i < Object.keys(state).length; i++) {
                    var id = Object.keys(state)[i];
                    var computedState = state[id];
                    var stateIndex;
                    for (var k = 0; k < actions.length; k++) {
                        if (actions[k].id === id) {
                            stateIndex = k;
                            object = actions[k];
                            break;
                        }
                    }
                    if (id === location) {
                        index = stateIndex;
                        if (computedState.children && computedState.children.length > 0) {
                            object = computedState.children[0];
                            location = computedState.children[0].id;
                            subindex = 0;
                        } else {
                            object = actions[stateIndex];
                            subindex = -1;
                        }
                        break;
                    }
                    if (computedState.children) {
                        for (var j = 0; j < computedState.children.length; j++) {
                            var child = computedState.children[j];
                            if (child.id == location) {
                                parentId = id;
                                index = stateIndex;
                                subindex = j;
                                object = child;
                                break;
                            }
                        }
                    }
                    if (subindex !== undefined) {
                        break;
                    }
                }
                $scope.index = index;
                $scope.subindex = subindex;
                calc();
                recalculateSteps();
                if (parentId) {
                    $scope.steps[parentId].locked = false;
                    console.log("Unlocking " + parentId);
                }
                $scope.steps[location].locked = false;
                console.log("Unlocking" + location);


                $scope.sliding = true;
                $ionicScrollDelegate.freezeScroll(true);
                blockInput(true);
                $scope.location = location;
                $location.hash(location);
                $ionicScrollDelegate.anchorScroll(true);
                if (object.hasOwnProperty('title')) {
                    $scope.header = object.title();
                } else {
                    $scope.header = headers[index];
                }
                if (actions[index].hasOwnProperty('visible')) {
                    actions[index].visible(index, subindex);
                }
                showAllSteps();
                $timeout(function() {
                    blockInput(false);
                    $location.hash(location);
                    $ionicScrollDelegate.anchorScroll(false);
                    $scope.sliding = false;
                    hideOtherSteps(location);
                    if (actions[index].hasOwnProperty('anchored')) {
                        $timeout(function() {
                            actions[index].anchored(index, subindex);
                        });
                    }
                }, 500);
            }

            function blockInput(block) {
                $scope.blockInput = block;
            }

            $scope.closeModal = function() {
                $rootScope.createShiftModal.hide();
            };

            $rootScope.$on(GENERAL_EVENTS.UPDATES.USERINFO.PROCESSED, function() {
                //getLocations();
            });

            $scope.locationClicked = function(location) {
                unselect($scope.locations);
                unselect($scope.sublocations);
                location.selected = true;
                $scope.selected = location;
                $scope.sublocations = location.sublocations;
                setupJobTypesForLocationOrSublocation();
                if (!location.sublocations || location.sublocations.length === 0) {
                    $scope.locationSelected = true;
                    $scope.nextClicked();
                }
            };

            function unselect(list) {
                $scope.locationSelected = false;
                if (list) {
                    angular.forEach(list, function (item) {
                        item.selected = false;
                    });
                }
            }

            $scope.sublocationClicked = function(clickedSublocation) {
                if (clickedSublocation.selected) {
                    unselect($scope.sublocations);
                } else {
                    unselect($scope.sublocations);
                    $scope.sublocation = clickedSublocation;
                    clickedSublocation.selected = true;
                    $scope.locationSelected = true;
                    $scope.nextClicked();
                }
            };

            function setupJobTypesForLocationOrSublocation() {
                var group_id = $scope.selected.group_id;
                $scope.jobTypes = $scope.allJobs.filter(function(value) {
                    if (value.hasOwnProperty('group_id')) {
                        return value.group_id == group_id;
                    } else {
                        return false;
                    }
                });
                console.log($scope.jobTypes);
            }

            function getLocationsOld() {
                $scope.locationsObject = UserInfoService.getLocationList();
                $scope.locations = [];

                angular.forEach($scope.locationsObject, function(location, locationid) {
                    $scope.locations.push(angular.copy(location));
                });
                console.log($scope.locations);
            }

            slideTo(actions[0].id);
        }
    ]
);
