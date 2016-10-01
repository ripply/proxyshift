angular.module('scheduling-app.controllers')
    .controller('WhenNewShiftController', [
        '$scope',
        '$rootScope',
        '$stateParams',
        '$controller',
        'GENERAL_EVENTS',
        function($scope,
                 $rootScope,
                 $stateParams,
                 $controller,
                 GENERAL_EVENTS
        ) {
            $scope.resetData = function() {
                $scope.when = {};
            };
            $controller('BaseNewShiftController', {$scope: $scope, $stateParams: $stateParams});
            $scope.state = $stateParams;

            var requiredWhenData = ['starttime', 'endtime', 'length', 'employees'];

            $scope.beforeEnter = function() {
                $rootScope.$emit(GENERAL_EVENTS.NEWSHIFTS.DETAILS);
            };

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
                        when.starttime = guessStartTime();
                    }
                    if (when.length === undefined) {
                        when.length = guessEndTime(when.starttime);
                    }
                    if (when.endtime === undefined) {
                        var startdate = moment(dateString);
                        var date = moment(startdate);
                        var starttime = moment(when.starttime);
                        var length = moment(when.length);
                        startdate.add(starttime.hours(), 'hours');
                        startdate.add(starttime.minutes(), 'minutes');
                        startdate.add(starttime.seconds(), 'seconds');
                        if (starttime == length) {
                            date.add(24, 'hours');
                        } else {
                            if (starttime > length) {
                                // crosses midnight
                                date.add(24, 'hours');
                            } else {
                                // doesn't cross
                            }
                        }
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
                        if (!$scope.dateOk(date)) {
                            progressable = false;
                        }
                    } else {
                        progressable = false;
                    }
                });

                return progressable;
            };

            $scope.dateOk = function(date) {
                var data = $scope.when[date];
                // check if start date is the same as the end date
                var start = moment(date);
                var end = moment(data.endtime);
                if (start.isSame(end, 'day')) {
                    // same day requires end time > start time
                    var startTime = moment(data.starttime);
                    var endTime = moment(data.length);
                    if (endTime <= startTime) {
                        return false;
                    }
                } else if (end.isBefore(start)) {
                    return false;
                } else {
                    // this is fine
                }

                return true;
            };
        }
    ]
);
