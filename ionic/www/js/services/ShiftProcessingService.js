"use strict";
angular.module('scheduling-app.services')
    .service('ShiftProcessingService', [
        '$rootScope',
        'UserInfoService',
        'GENERAL_EVENTS',
        function(
            $rootScope,
            UserInfoService,
            GENERAL_EVENTS
        ) {
            $rootScope.userIsInDifferentTimeZone = userIsInDifferentTimeZone;

            this.createShift = function(body, start, end, groupuserclass_id, location_id, sublocation_id) {
                var resource = Restangular.one("locations", location_id)
                if (sublocation_id) {
                    resource = resource.one("sublocations", sublocation_id);
                }
                resource.all("shifts")
                    .one("groupuserclass", groupuserclass_id)
                    .one("start", start)
                    .one("end", end)
                    .customPOST(body)
                    .then(function(result) {
                        // success
                        console.log(result);
                    }, function(response) {
                        // fail
                        console.log(response);
                    });
            };

            function userIsInDifferentTimeZone(shift) {
                var startLocal = getStartOfShift(shift);
                var startUsersTime = moment(startLocal).local();

                return startLocal.format("Z") != startUsersTime.format("Z");
            }

            var units = {
                'year': ' year',
                'month': ' month',
                'day': ' day',
                'hour': 'h',
                'minute': 'm'
            };

            this.getReadableShiftDuration = function(shift) {
                var duration = moment.duration(getEndOfShift(shift) - getStartOfShift(shift));
                var list = [];
                angular.forEach(units, function(string, unit) {
                    var count = duration.get(unit);
                    if (count > 0) {
                        list.push(count + string + (!string.startsWith(' ') ? '' : (count > 1 ? 's':'')));
                    }
                });
                return list.join(' ');
            };

            this.getReadableLocalShiftStartTime = function(shift, format) {
                var startLocal = getStartOfShift(shift);
                return getDisplayableFormat(startLocal, format);
            };

            this.getReadableLocalShiftEndTime = function(shift, format) {
                var endLocal = getEndOfShift(shift);
                return getDisplayableFormat(endLocal, format);
            };

            this.getReadableLocalShiftDiffTime = function(shift) {
                // TODO: MAKE SURE THIS PROPERLY CONSIDERS DST
                var startLocal = getStartOfShift(shift);
                var endLocal = getEndOfShift(shift);

                var diffHours = endLocal.diff(startLocal, 'minutes');
                return (diffHours / 60) + " hour shift";
            };

            this.getReadableUsersShiftTime = function(shift, format) {
                var userInDifferentTimeZone = false;
                var startLocal = getStartOfShift(shift);
                var startUsersTime = moment(startLocal).local();
                var startDisplayableUserTime = '';

                var endLocal = getEndOfShift(shift);
                var endUsersTime = moment(endLocal).local();
                var endDisplayableUsersTime = '';

                if (startLocal.format("Z") != startUsersTime.format("Z")) {
                    userInDifferentTimeZone = true;
                    startDisplayableUserTime = getDisplayableFormat(startUsersTime, format);
                    endDisplayableUsersTime = getDisplayableFormat(endUsersTime, format);
                }

                var result;

                if (userInDifferentTimeZone) {
                    result = startDisplayableUserTime
                        + " - "
                        + endDisplayableUsersTime;
                }

                return result;
            };

            this.getReadableUsersShiftStartTime = function(shift, format) {
                var startLocal = getStartOfShift(shift);
                var startUsersTime = moment(startLocal).local();
                return getDisplayableFormat(startUsersTime, format);
            };

            this.getReadableUsersShiftEndTime = function(shift, format) {
                var endLocal = getEndOfShift(shift);
                var endUsersTime = moment(endLocal).local();
                return getDisplayableFormat(endUsersTime, format);
            };

            this.getShiftsLocation = function(shift) {
                var id = shift.location_id;
                var method = 'getLocation';

                if (shift.sublocation_id !== undefined && shift.sublocation_id !== null) {
                    method = 'getLocationForSublocation';
                    id = shift.sublocation_id;
                }

                return UserInfoService[method](id);
            };

            this.getShiftsSublocation = function(shift) {
                return UserInfoService.getSublocation(shift.sublocation_id);
            };

            function getDisplayableFormat(time, format) {
                if (!format) {
                    format = "h:mma";
                }
                return time.format(format);
            }

            this.getStartOfShift = getStartOfShift;

            function getStartOfShift(shift) {
                return moment.tz(shift.start * 1000, shift.timezone.name);
            }

            this.getEndOfShift = getEndOfShift;

            function getEndOfShift(shift) {
                return moment.tz(shift.end * 1000, shift.timezone.name);
            }

            this.markDayBreaksForShifts = markDayBreaksForShifts;

            function markDayBreaksForShifts(result) {
                if (!result) {
                    return;
                }
                var lastDay = null;
                var startDay = null;
                var endDay = null;
                // assume everything is sequential sent by server
                angular.forEach(result, function(shift) {
                    var day = getStartOfShift(shift);
                    if (!lastDay) {
                        shift.dayBreak = true;
                    } else if (day.isBetween(startDay, endDay)) {
                        // same day
                        shift.dayBreak = false;
                    } else {
                        // different day
                        shift.dayBreak = true;
                    }

                    lastDay = day;
                    startDay = lastDay.startOf('day');
                    endDay = lastDay.endOf('day');
                });
            }

            this.getReadableStartDate = getReadableStartDate;

            function getReadableStartDate(shift, format) {
                return getStartOfShift(shift).format(format);
            }

            $rootScope.$on(GENERAL_EVENTS.UPDATES.RESOURCE, function(state, resource, value) {
                if (resource == 'AllShifts') {
                    //markDayBreaksForShifts(value);
                }
            });
        }
    ]);
