angular.module('scheduling-app.controllers')
    .controller('DateNewShiftController', [
        '$scope',
        '$rootScope',
        '$stateParams',
        '$controller',
        function($scope,
                 $rootScope,
                 $stateParams,
                 $controller
        ) {
            $scope.resetData = function() {
                $scope.dateState = {};
                $scope.date = [];
            };
            $controller('BaseNewShiftController', {$scope: $scope, $stateParams: $stateParams});

            $rootScope.$on('events:calendar:clicked', function(state, name, selected) {
                if (name == 'create-shift-calendar') {
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
                            date.month(value.month - 1);
                            date.date(value.day);
                            date.startOf('day');
                            $scope.date.push(
                                angular.extend({
                                    key: key,
                                    moment: date
                                }, value)
                            );

                            var now = moment();
                            var nowHour = now.hour();
                            var nowMinute = now.minute();
                            if (nowMinute > 0) {
                                nowHour += 1;
                            }

                            date.add(nowHour, 'hours');
                            var end = moment(date).add(8, 'hours');

                            $scope.dateState[key] = angular.extend({
                                counter: 1,
                                time: date.toDate(),
                                hours: end.toDate(),
                                endtime: end.toDate()
                            }, $scope.dateState[key]);
                        });
                        $scope.date.sort(function(left, right) {
                            if (left.key == right.key) {
                                return 0;
                            } else {
                                return left.key < right.key ? -1:1;
                            }
                        });
                        console.log($scope.date);
                    } else {
                        $scope.date = [];
                        //resetSteps();
                    }
                    //calc();
                }
            });

            $scope.getDatesString = function() {
                console.log($scope.date);
                var dates = [];
                angular.forEach($scope.date, function(date) {
                    dates.push(date.key);
                });
                return dates;
            };

            $scope.getDates = function() {
                var result = [];
                angular.forEach($scope.date, function(date) {
                    result.push(date.key);
                });
                return $scope.encodeDates(result);
            }
        }
    ]
);
