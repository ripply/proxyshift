angular.module('scheduling-app.controllers')
    .controller('WhenNewShiftController', [
        '$scope',
        '$rootScope',
        '$stateParams',
        '$controller',
        function($scope,
                 $rootScope,
                 $stateParams,
                 $controller
        ) {
            $controller('BaseNewShiftController', {$scope: $scope, $stateParams: $stateParams});
            $scope.state = $stateParams;
            $scope.when = {};

            var requiredWhenData = ['starttime', 'endtime', 'length', 'employees'];

            function guessStartTime() {
                var now = moment();
                var minutes = now.minutes();
                if (minutes < 15) {
                    minutes = 30;
                } else if (minutes < 30) {
                    minutes = 30;
                } else {
                    minutes = 60;
                }
                now.startOf('hour');
                now.add(minutes, 'minutes');
                return new Date(1970, 0, 1, now.hour(), now.minutes(), 0);
            }

            function guessEndTime(start) {
                var endtime = moment(start);
                endtime.add(8, 'hours');
                return new Date(1970, 0, 1, endtime.hours(), endtime.minutes(), endtime.seconds());
            }

            $scope.whereStateParams = function() {
                return angular.extend({
                    when: getWhen()
                }, $stateParams);
            };

            $scope.getDates = function() {
                var a = $scope.decodeDates($stateParams.dates);
                angular.forEach(a, function(dateString) {
                    if (!$scope.when.hasOwnProperty(dateString)) {
                        $scope.when[dateString] = {};
                    }
                    var when = $scope.when[dateString];
                    if (when.starttime === undefined) {
                        console.log("Setting starttime...");
                        when.starttime = guessStartTime();
                    }
                    if (when.length === undefined) {
                        console.log('Setting length...');
                        when.length = guessEndTime(when.starttime);
                    }
                    if (when.endtime === undefined) {
                        console.log('Setting endtime...');
                        var date = moment(dateString);
                        var starttime = moment(when.starttime);
                        date.add(starttime.hours(), 'hours');
                        date.add(starttime.minutes(), 'minutes');
                        date.add(starttime.seconds(), 'seconds');
                        var length = moment(when.length);
                        date.add(length.hours(), 'hours');
                        date.add(length.minutes(), 'minutes');
                        date.add(length.seconds(), 'seconds');
                        when.endtime = date.toDate();
                    }
                    if (when.employees === undefined) {
                        when.employees = 1;
                    }
                });
                return a;
            };

            $scope.getMoment = function(date) {
                return moment(date);
            };

            function getWhen() {
                return $scope.encodeWhens($scope.when);
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
                    } else {
                        progressable = false;
                    }
                });

                return progressable;
            };
        }
    ]
);
