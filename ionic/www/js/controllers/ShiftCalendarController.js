angular.module('scheduling-app.controllers')
    .controller('ShiftCalendarController', [
        '$scope',
        '$controller',
        'GENERAL_CONFIG',
        'GENERAL_EVENTS',
        function($scope,
                 $controller,
                 GENERAL_CONFIG,
                 GENERAL_EVENTS
        ) {
            $controller('BaseModelController', {$scope: $scope});

            $scope.$on(GENERAL_EVENTS.UPDATES.RESOURCE,
                function(event, resourceName, newValue, oldValue) {
                    if (getValueName() == resourceName) {
                        // value was updated
                        // re-compute calendar
                        console.log("Calendar's datasource was updated...");
                        calculateCalendar();
                    }
                }
            );

            calculateCalendar();

            $scope.$on('$ionicView.beforeEnter', calculateCalendar());

            $scope.$on(GENERAL_EVENTS.CALENDAR.NEXTMONTH, nextMonth);
            $scope.$on(GENERAL_EVENTS.CALENDAR.PREVIOUSMONTH, previousMonth);
            $scope.$on(GENERAL_EVENTS.CALENDAR.CURRENTMONTH, currentMonth);

            $scope.nextMonth = nextMonth;
            $scope.previousMonth = previousMonth;
            $scope.currentMonth = currentMonth;

            function nextMonth() {
                $scope.offset += 1;
                calculateCalendar();
                modifyCurrentShiftRetrievalRange();
            }

            function previousMonth() {
                $scope.offset -= 1;
                calculateCalendar();
                modifyCurrentShiftRetrievalRange();
            }

            function currentMonth() {
                $scope.offset = 0;
                calculateCalendar();
                modifyCurrentShiftRetrievalRange();
            }

            function modifyCurrentShiftRetrievalRange() {
                // TODO: Check that the current shifts being retrieved
                // are visible from the calendar with the offset
                // it should be visible.
                // we just need to make sure there is buffer room of several months
                // and fetch more shifts if needed to fill buffer
            }

            function calculateCalendar() {
                if ($scope.offset === undefined) {
                    $scope.offset = 0;
                }

                var data = getData();
                if (data === undefined) {
                    data = [];
                }
                var transform = getTransformationFunction();
                // create map of date => shift object
                var calendarDateMap = {};
                var calendar = [
                    []
                ];

                var now = moment();
                if ($scope.offset) {
                    now = now.add($scope.offset, 'month');
                }
                var month = now.month();

                var calendarStart = moment(now).startOf("month").startOf("week").startOf("day");
                var calendarEnd = moment(now).endOf("month").endOf("week").endOf("day");

                var calendarStartUnix = calendarStart.unix();
                var calendarEndUnix = calendarEnd.unix();

                // create calendar days
                var countingDays = moment(calendarStart);
                while(countingDays.isBefore(calendarEnd)) {
                    var thisWeek = calendar[calendar.length - 1];
                    if (thisWeek.length === 7) {
                        // new week
                        thisWeek = [];
                        calendar.push(thisWeek);
                    }
                    var today = {
                        number: countingDays.date()
                    };

                    calendarDateMap[countingDays.startOf("day").unix()] = today;
                    thisWeek.push(today);
                    countingDays = countingDays.add(1, 'day');
                }

                for (var i = 0; i < data.length; i++) {
                    var transformed = transform(data[i]);
                    var start = transformed.start;
                    var end = transformed.end;

                    var startMoment = moment(start, 'X');
                    var endMoment = moment(end, 'X');

                    if (startMoment.isAfter(calendarStart) || endMoment.isBefore(calendarEndUnix)) {
                        // edge case: determine if the shift perhaps takes an entire month
                        var shiftStartMoment = moment(startMoment);
                        if (shiftStartMoment.isBefore(calendarStart)) {
                            // shift starts before calendar, jump to start of calendar
                            shiftStartMoment = moment(calendarStart);
                        } else {
                            // shift starts after calendar starts
                            // this is OK
                        }

                        var shiftEndMoment = moment(endMoment);
                        if (shiftEndMoment.isAfter(calendarEnd)) {
                            shiftEndMoment = moment(calendarEnd);
                        } else {
                            // shift ends before calendar ends
                            // this is OK
                        }

                        while (shiftStartMoment.isBefore(shiftEndMoment)) {
                            var calendarDay = calendarDateMap[shiftStartMoment.startOf("day").unix()];
                            if (!calendarDay) {
                                throw new Error("Error generating calendar for shift " + transformed);
                            }
                            if (calendarDay.shifts === undefined) {
                                calendarDay.shifts = [];
                            }

                            calendarDay.shifts.push(transformed);
                            shiftStartMoment = shiftStartMoment.add(1, "day");
                        }

                    }
                }

                $scope.calendarData = calendar;
            }

            function getTransformationFunction() {
                var attributes = $scope.attributes;
                var transform;
                if (attributes !== undefined) {
                    transform = $scope[attributes.transform];

                    if (transform !== undefined) {
                        transform = $rootScope[transform];
                    }

                    if (transform === undefined) {
                        transform = function (input) {
                            return input;
                        }
                    }
                }

                return transform;
            }

            function getData() {
                return $scope[getValueName()];
            }

            function getValueName() {
                var attributes = $scope.attributes;
                var value;
                if (attributes !== undefined) {
                    value = attributes.value;
                }

                return value;
            }
        }]);
