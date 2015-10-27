angular.module('scheduling-app.controllers')
    .controller('ShiftCalendarController', [
        '$scope',
        '$rootScope',
        '$controller',
        'ShiftIntervalTreeCacheService',
        'ShiftProcessingService',
        'GENERAL_CONFIG',
        'GENERAL_EVENTS',
        function($scope,
                 $rootScope,
                 $controller,
                 ShiftIntervalTreeCacheService,
                 ShiftProcessingService,
                 GENERAL_CONFIG,
                 GENERAL_EVENTS
        ) {
            $controller('BaseModelController', {$scope: $scope});

            createCalendarHeaderData();
            calculateCalendar();

            $scope.$on('$ionicView.beforeEnter', calculateCalendar());

            $scope.$on(GENERAL_EVENTS.CALENDAR.NEXTMONTH, nextMonth);
            $scope.$on(GENERAL_EVENTS.CALENDAR.PREVIOUSMONTH, previousMonth);
            $scope.$on(GENERAL_EVENTS.CALENDAR.CURRENTMONTH, currentMonth);
            $scope.$on(GENERAL_EVENTS.CALENDAR.VIEW, view);
            $scope.$on(GENERAL_EVENTS.CALENDAR.UPDATE.DATASETUPDATED, render);

            $scope.$on(GENERAL_EVENTS.CALENDAR.UPDATE.FETCHING, loading);
            $scope.$on(GENERAL_EVENTS.CALENDAR.UPDATE.DONE, loadingComplete);

            $scope.nextMonth = nextMonth;
            $scope.previousMonth = previousMonth;
            $scope.currentMonth = currentMonth;

            function view(event, shift) {
                var shiftStart = moment(shift.start*1000);
                var now = moment();
                $scope.offset = shiftStart.month() - now.month();
                calculateCalendar();
                modifyCurrentShiftRetrievalRange();
            }

            function render() {
                calculateCalendar();
            }

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

            function loading(event, start, end) {
                if ($scope.calendarData.loadingData === undefined) {
                    $scope.calendarData.loadingData = [];
                }

                $scope.calendarData.loadingData.push({
                    start: start.unix(),
                    end: start.end()
                });
            }

            function loadingFailed(event, start, end) {
                // should be unix time
                loadingStopped(start, end);
                // TODO: Retry or setup an error css class for these months
            }

            function loadingComplete(event, start, end) {
                // should be unix time
                loadingStopped(start, end);
                calculateCalendar();
            }

            function loadingStopped(event, start, end) {
                if (start && end) {
                    var loadingData = $scope.calendarData.loadingData;
                    for (var i = 0; i < loadingData.length; i++) {
                        if (loadingData[i].start === start &&
                            loadingData[i].end === end) {
                            delete loadingData[i];
                            break;
                        }
                    }
                }
            }

            function modifyCurrentShiftRetrievalRange() {
                // TODO: Check that the current shifts being retrieved
                // are visible from the calendar with the offset
                // it should be visible.
                // we just need to make sure there is buffer room of several months
                // and fetch more shifts if needed to fill buffer
                var minBuffer = 5;
                var buffer = 8;
                var bufferUnit = "months";
                var calendarBounds = getCalendarBounds();
                var now = moment();
                var start = calendarBounds.start;
                var end = calendarBounds.end;
                if (moment(calendarBounds.now).add(minBuffer, bufferUnit).isBefore(now)) {
                    // user is going forward in time
                    end = moment(end).add(buffer, bufferUnit).endOf(bufferUnit);
                }
                if (moment(calendarBounds.now).subtract(minBuffer, bufferUnit)) {
                    start = moment(start).subtract(buffer, bufferUnit).startOf(bufferUnit);
                }

                requestShiftFetching(start, end);
            }

            function requestShiftFetching(start, end) {
                $scope.$emit(GENERAL_EVENTS.CALENDAR.UPDATE.NEEDED, getVariableName(), start, end);
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

            function getCalendarBounds() {
                var calendarBounds = {};
                var now = moment();
                calendarBounds.now = now;

                if ($scope.offset) {
                    calendarBounds.now.add($scope.offset, 'month');
                }

                calendarBounds.start = moment(now).startOf("month").startOf("week").startOf("day");
                calendarBounds.end = moment(now).endOf("month").endOf("week").endOf("day");

                return calendarBounds;
            }

            function calculateCalendar() {
                if ($scope.offset === undefined) {
                    $scope.offset = 0;
                }

                var data = getOneMonthOfDataFromOffset();
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

                var calendarBounds = getCalendarBounds();
                var month = calendarBounds.now.month();
                var calendarStart = calendarBounds.start;
                var calendarEnd = calendarBounds.end;
                var now = calendarBounds.now;
                var actualNow = moment();
                $scope.monthData = {
                    name: now.format("MMMM"),
                    month: month,
                    year: now.format("YYYY")
                };

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
                            for (var j = 0; j < 7; j++) {
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
                    today.thisMonth = countingDays.month() === month;
                    today.today = countingDays.isSame(actualNow, 'day');

                    calendarDateMap[countingDays.startOf("day").unix()] = today;
                    countingDays = countingDays.add(1, 'day');
                }

                // edge case:
                // make sure that we remove extra unused weeks from DOM
                if (!creatingDates) {
                    while ((calendar.length - 1) > currentWeek) {
                        calendar.pop();
                    }
                }

                for (var i = 0; i < data.length; i++) {
                    var transformed = data[i];
                    if (transform) {
                        transformed = transform(transformed);
                    }

                    var start = transformed.start;
                    var end = transformed.end;

                    var startMoment = ShiftProcessingService.getStartOfShift(transformed);
                    var endMoment = ShiftProcessingService.getEndOfShift(transformed);

                    if (startMoment.isAfter(calendarStart) || endMoment.isBefore(calendarEnd)) {
                        // edge case: determine if the shift perhaps takes an entire month
                        var shiftStartMoment = moment(startMoment);
                        if (shiftStartMoment.isBefore(calendarStart)) {
                            // shift starts before calendar, jump to start of calendar
                            shiftStartMoment = moment(calendarStart);
                        } else {
                            // shift starts after calendar starts
                            // this is OK
                        }
                        var shiftStartMomentLocal = moment.unix(shiftStartMoment.unix());

                        var shiftEndMoment = moment(endMoment);
                        if (shiftEndMoment.isAfter(calendarEnd)) {
                            shiftEndMoment = moment(calendarEnd);
                        } else {
                            // shift ends before calendar ends
                            // this is OK
                        }

                        while (shiftStartMomentLocal.isBefore(shiftEndMoment)) {
                            if (shiftStartMomentLocal.isAfter(calendarStart)) {
                                if (shiftStartMomentLocal.isBefore(calendarEnd)) {
                                    var calendarDay = calendarDateMap[shiftStartMomentLocal.startOf("day").unix()];
                                    if (!calendarDay) {
                                        throw new Error("Error generating calendar for shift " + transformed);
                                    }
                                    if (calendarDay.shifts === undefined) {
                                        calendarDay.shifts = [];
                                    }

                                    calendarDay.shifts.push(transformed);
                                } else {
                                    break
                                }
                            }
                            shiftStartMomentLocal = shiftStartMomentLocal.add(1, "day");
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

            function getOneMonthOfDataFromOffset() {
                var calendarBounds = getCalendarBounds();
                var now = calendarBounds.now;
                var month = calendarBounds.now.month();
                var calendarStart = calendarBounds.start.unix();
                var calendarEnd = calendarBounds.end.unix();
                $scope.monthData = {
                    name: now.format("MMMM"),
                    month: month,
                    year: now.format("YYYY")
                };
                return getData(calendarStart, calendarEnd);
            }

            function getData(start, end) {
                var data = ShiftIntervalTreeCacheService.get(start, end, getTransformationFunction());
                return data;
            }

            function getVariableName() {
                var attributes = $scope.attributes;
                var value;
                if (attributes !== undefined) {
                    value = attributes.value;
                }

                return value;
            }
        }]);
