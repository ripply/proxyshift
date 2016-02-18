angular.module('scheduling-app.controllers')
    .controller('CreateShiftModalController', [
        '$rootScope',
        '$scope',
        '$ionicScrollDelegate',
        '$timeout',
        '$location',
        function(
            $rootScope,
            $scope,
            $ionicScrollDelegate,
            $timeout,
            $location
        ) {
            var calendarName = 'create-shift-calendar';
            $scope.$on('modal:createshift:reset', function() {
                console.log('reset');
                $ionicScrollDelegate.scrollTop(false);
                $rootScope.$broadcast('events:calendar:reset', calendarName);
            });

            $rootScope.$on('events:calendar:clicked', function(state, name, selected) {
                if (name == calendarName) {
                    var date = moment();
                    date.year(selected.year);
                    date.month(selected.month);
                    date.date(selected.day);
                    $scope.date = date;
                    slideTo('create-shift-time');
                }
            });

            $scope.getReadableDate = function() {
                if ($scope.date) {
                    return $scope.date.format("L");
                } else {
                    return "Select a date";
                }
            };

            $scope.sliding = false;

            $scope.slideTo = slideTo;

            function slideTo(location) {
                if ($scope.sliding) {
                    return;
                }
                $scope.sliding = true;
                $ionicScrollDelegate.freezeScroll(true);
                blockInput(true);
                $location.hash(location);
                $ionicScrollDelegate.anchorScroll(true);
                $timeout(function() {
                    blockInput(false);
                    $location.hash(location);
                    $ionicScrollDelegate.anchorScroll(false);
                    $scope.sliding = false;
                }, 500);
            };

            function blockInput(block) {
                $scope.blockInput = block;
            }

            $scope.closeModal = function() {
                $rootScope.createShiftModal.hide();
            };
        }
    ]
);
