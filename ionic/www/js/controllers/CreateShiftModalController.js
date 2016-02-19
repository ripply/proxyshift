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

            var steps = [
                'create-shift-date',
                'create-shift-when',
                'create-shift-where',
                'create-shift-who',
                'create-shift-review'
            ];

            $scope.steps = {};
            resetSteps();

            function resetSteps() {
                $scope.step = 0;
                for (var i = 0, length = steps.length; i < length; i++) {
                    var id = steps[i];
                    $scope.steps[id] = {
                        show: true,
                        locked: i != 0
                    };
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
                    var date = moment();
                    date.year(selected.year);
                    date.month(selected.month);
                    date.date(selected.day);
                    $scope.date = date;
                    slideTo('create-shift-when');
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
                $location.hash(location);
                $ionicScrollDelegate.anchorScroll(true);
                if ($scope.steps.hasOwnProperty(location)) {
                    $scope.step = steps.indexOf(location);
                    $scope.steps[location].locked = false;
                } else {
                    // unknown, show first
                    $scope.step = 0;
                    $scope.steps[steps[0]].show = true;
                }
                hideOtherSteps();
                $timeout(function() {
                    blockInput(false);
                    $location.hash(location);
                    $ionicScrollDelegate.anchorScroll(false);
                    $scope.sliding = false;
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
