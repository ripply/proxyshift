angular.module('scheduling-app.controllers')
    .controller('CreateShiftModalController', [
        '$rootScope',
        '$scope',
        '$ionicScrollDelegate',
        '$timeout',
        '$location',
        '$window',
        'GENERAL_EVENTS',
        'UserInfoService',
        function(
            $rootScope,
            $scope,
            $ionicScrollDelegate,
            $timeout,
            $location,
            $window,
            GENERAL_EVENTS,
            UserInfoService
        ) {
            var calendarName = 'create-shift-calendar';

            $window.addEventListener('resize', function(event) {
                $location.hash($scope.steps[$scope.step]);
                $ionicScrollDelegate.anchorScroll(false);
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

            $scope.wat = function() {
                alert('wat');
            };

            var defaultArrows = {
                'create-shift-date': {
                    next: function() {
                        return Object.keys($scope.date).length > 0;
                    },
                    gonext: function() {
                        slideTo('create-shift-when');
                    }
                },
                'create-shift-when': {
                    calc: function() {
                        console.log('calcd');
                        if (!$scope.substeps['create-shift-when']) {
                            $scope.substeps['create-shift-when'] = [];
                        }
                        angular.forEach($scope.date, function(value, key) {
                            // check if this is already a part of the array
                            if (alreadyExists(value.key)) {
                                // do nothing
                            } else {
                                $scope.substeps['create-shift-when'].push(
                                    angular.extend({
                                        key: value.key,
                                        id: 'create-shift-when-' + value.key
                                    }, value)
                                );
                                console.log("ADDEDDDDDDDDDDDDDDD");
                            }
                        });
                        console.log("laksjdflkasldjkflaksjd");
                        console.log($scope.substeps['create-shift-when']);

                        $scope.substeps['create-shift-when'].sort(function(left, right) {
                            if (left == right) {
                                return 0;
                            } else {
                                console.log("comparing..");
                                return left > right ? -1:1;
                            }
                        });

                        console.log("sorted");
                        console.log($scope.substeps['create-shift-when']);

                        function alreadyExists(key) {
                            var substeps = $scope.substeps['create-shift-when'];
                            for (var i = 0, length = substeps.length; i < length; i++) {
                                if (substeps[i].key == key) {
                                    return true;
                                }
                            }
                            return false;
                        }
                    },
                    prev: function() {
                        return ($scope.location != $scope.substeps['create-shift-when'][0].id);
                    },
                    next: true,
                    goprev: function() {
                        var last;
                        for (var i = 0; i < $scope.substeps['create-shift-when'].length; i++) {
                            var substep = $scope.substeps['create-shift-when'][i];
                            if ($scope.location == substep.id) {
                                slideTo(last);
                                last = null;
                                break;
                            } else {
                                last = substep.id;
                            }
                        }

                        if (!last) {
                            slideTo(steps[0]);
                        }
                    },
                    gonext: function() {
                        var next = false;
                        for (var i = 0; i < $scope.substeps['create-shift-when'].length; i++) {
                            var substep = $scope.substeps['create-shift-when'][i];
                            if (next) {
                                slideTo(substep.id);
                                next = false;
                                break;
                            } else if ($scope.location == substep.id) {
                                next = true;
                            }
                        }

                        if (next) {
                            slideTo(steps[2]);
                        }
                    }
                }
            };

            $scope.nextClicked = function() {
                if ($scope.gonext) {
                    $scope.gonext();
                }
            };

            $scope.prevClicked = function() {
                if ($scope.goprev) {
                    $scope.goprev();
                }
            };

            var arrows = angular.copy(defaultArrows);

            var headers = [
                'Select date(s)',
                'Start time/length',
                'Where',
                'Who',
                'Review'
            ];

            $scope.header = headers[0];

            $scope.steps = {};
            $scope.substeps = {};
            $scope.substep = undefined;
            resetSteps();

            function resetSteps() {
                $scope.step = 0;
                for (var i = 0, length = steps.length; i < length; i++) {
                    var id = steps[i];
                    $scope.steps[id] = {
                        show: true,
                        locked: i != 0
                    };
                    if ($scope.substeps[id]) {
                        for (var j = 0, jlength = $scope.substeps[id].length; j < jlength; j++) {
                            $scope.substeps[id][j] = {
                                show: true
                            }
                        }
                    }
                }
                arrows = angular.copy(defaultArrows);
                resetSubsteps();
                showHideArrows();
            }

            function resetSubsteps() {
                substeps = {
                    'create-shift-when': []
                };
            }

            function showHideArrows() {
                // todo
            }

            function showAllSteps() {
                for (var i = 0, length = steps.length; i < length; i++) {
                    var id = steps[i];
                    $scope.steps[id].show = true;
                }
            }

            function hideOtherSteps() {
                for (var i = 0, length = steps.length; i < length; i++) {
                    var id = steps[i];
                    $scope.steps[id].show = i == $scope.step;
                }
            }

            $scope.timePickerObjectTime = {};
            $scope.timePickerObjectLength = {};
            getLocations();

            $scope.$on('modal:createshift:reset', function() {
                console.log('reset');
                $ionicScrollDelegate.scrollTop(false);
                $rootScope.$broadcast('events:calendar:reset', calendarName);
                $rootScope.$broadcast('events:calendar:show', calendarName);
                $rootScope.$broadcast('events:calendar:currentmonth', calendarName);
                getLocations();
                $scope.selected = null;
                resetSteps();
            });

            $rootScope.$on('events:calendar:clicked', function(state, name, selected) {
                if (name == calendarName) {
                    if (Object.keys(selected).length != 0) {
                        $scope.date = [];
                        angular.forEach(selected, function(value, key) {
                            var date = moment();
                            date.year(value.year);
                            date.month(value.month);
                            date.date(value.day);
                            $scope.date.push(angular.extend({
                                key: key,
                                moment: date
                            }, value));
                            console.log("pushed...");
                        });
                        console.log($scope.date);
                        slideTo('create-shift-when');
                    }
                }
            });

            $scope.getReadableDate = function() {
                if ($scope.date) {
                    return $scope.date.format('dddd') + ", " + $scope.date.format('LL');
                } else {
                    return "Select a date";
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
                if ($scope.sliding) {
                    return;
                }
                $scope.sliding = true;
                $ionicScrollDelegate.freezeScroll(true);
                blockInput(true);
                $scope.prev = false;
                $scope.next = false;
                $scope.goprev = undefined;
                $scope.gonext = undefined;
                if ($scope.steps.hasOwnProperty(location)) {
                    $scope.step = steps.indexOf(location);
                    $scope.steps[location].locked = false;
                    var newLocation;
                    if ($scope.substeps.hasOwnProperty(location)) {
                        newLocation = $scope.substeps[location][0].id;
                    }
                    if (newLocation) {
                        $scope.location = newLocation;
                    }
                    if (arrows.hasOwnProperty(location)) {
                        if (arrows[location].hasOwnProperty('calc')) {
                            arrows[location].calc();
                        }
                        if ($scope.substeps.hasOwnProperty(location)) {
                            newLocation = $scope.substeps[location][0].id;
                        }
                        if (newLocation) {
                            $scope.location = newLocation;
                        }
                        if (arrows[location].hasOwnProperty('prev')) {
                            var prev = arrows[location]['prev'];
                            if (prev === true) {
                                $scope.prev = true;
                            } else {
                                $scope.prev = prev();
                            }

                            if ($scope.prev && arrows[location].hasOwnProperty('goprev')) {
                                $scope.goprev = arrows[location]['goprev'];
                            }
                        }
                        if (arrows[location].hasOwnProperty('next')) {
                            var next = arrows[location]['next'];
                            if (next === true) {
                                $scope.next = true;
                            } else {
                                $scope.next = next();
                            }

                            if ($scope.next && arrows[location].hasOwnProperty('gonext')) {
                                $scope.gonext = arrows[location]['gonext'];
                            }
                        }
                    }
                    if (newLocation) {
                        location = newLocation;
                    }
                } else {
                    // unknown, show first
                    $scope.step = 0;
                    $scope.steps[steps[0]].show = true;
                }
                $scope.location = location;
                $location.hash(location);
                $ionicScrollDelegate.anchorScroll(true);
                $scope.header = headers[$scope.step];
                showAllSteps();
                $timeout(function() {
                    blockInput(false);
                    $location.hash(location);
                    $ionicScrollDelegate.anchorScroll(false);
                    $scope.sliding = false;
                    hideOtherSteps();
                }, 500);
            }

            function blockInput(block) {
                $scope.blockInput = block;
            }

            $scope.closeModal = function() {
                $rootScope.createShiftModal.hide();
            };

            $rootScope.$on(GENERAL_EVENTS.UPDATES.USERINFO.PROCESSED, function() {
                getLocations();
            });

            $scope.clicked = function(location) {
                angular.forEach($scope.locations, function(location) {
                    location.selected = false;
                });
                location.selected = true;
                $scope.selected = location;
                console.log(location);
            };

            function getLocations() {
                $scope.locationsObject = UserInfoService.getLocationList();
                $scope.locations = [];

                angular.forEach($scope.locationsObject, function(location, locationid) {
                    $scope.locations.push(angular.copy(location));
                });
                console.log($scope.locations);
            }
        }
    ]
);
