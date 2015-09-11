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

            createCalendarHeaderData();
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

            function createCalendarHeaderData() {
                var startOfWeek = new moment().startOf("week");

                var weekData = [];
                for (var i = 0; i < 7; i++) {
                    weekData.push(startOfWeek.format("dd"));
                    startOfWeek.add(1, "day");
                }

                $scope.weekData = weekData;
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
                var calendar = $scope.calendarData;
                var creatingDates = calendar === undefined;
                if (creatingDates) {
                    calendar = [
                        []
                    ];
                }

                var now = moment();
                if ($scope.offset) {
                    now = now.add($scope.offset, 'month');
                }
                var month = now.month();
                $scope.monthData = {
                    name: now.format("MMMM"),
                    number: month
                };

                var calendarStart = moment(now).startOf("month").startOf("week").startOf("day");
                var calendarEnd = moment(now).endOf("month").endOf("week").endOf("day");

                var calendarStartUnix = calendarStart.unix();
                var calendarEndUnix = calendarEnd.unix();

                // create calendar days
                var countingDays = moment(calendarStart);
                var currentWeek = -1;
                var currentDay = -1;
                while(countingDays.isBefore(calendarEnd)) {
                    var thisWeek;
                    var today;
                    if (creatingDates) {
                        thisWeek = calendar[calendar.length - 1];
                        if (thisWeek.length === 7) {
                            // new week
                            thisWeek = [];
                            calendar.push(thisWeek);
                        }
                        today = {};
                        thisWeek.push(today);
                    } else {
                        currentDay = (currentDay + 1) % 7;
                        if (currentDay === 0) {
                            ++currentWeek;
                        }
                        if (calendar[currentWeek] === undefined) {
                            // edge case:
                            // reached month where we display an extra week
                            var newWeek = [];
                            for (var i = 0; i < 7; i++) {
                                newWeek.push({});
                            }

                            calendar.push(newWeek);
                        }
                        thisWeek = calendar[currentWeek];
                        today = thisWeek[currentDay];
                        if (today.hasOwnProperty('shifts')) {
                            delete today['shifts'];
                        }
                    }
                    today.number = countingDays.date();

                    calendarDateMap[countingDays.startOf("day").unix()] = today;
                    countingDays = countingDays.add(1, 'day');
                }

                // edge case:
                // make sure that we remove extra unused months from DOM
                if (!creatingDates) {
                    while ((calendar.length - 1) > currentWeek) {
                        calendar.pop();
                    }
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
                var endTime = new Date().getTime();
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
