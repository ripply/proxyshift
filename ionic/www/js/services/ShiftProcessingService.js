"use strict";
angular.module('scheduling-app.services')
    .service('ShiftProcessingService', [
        '$rootScope',
        'UserInfoService',
        function(
            $rootScope,
            UserInfoService
        ) {
            $rootScope.userIsInDifferentTimeZone = userIsInDifferentTimeZone;

            function userIsInDifferentTimeZone(shift) {
                var startLocal = getStartOfShift(shift);
                var startUsersTime = moment(startLocal).local();

                return startLocal.format("Z") != startUsersTime.format("Z");
            }

            $rootScope.getReadableLocalShiftStartTime = function(shift, format) {
                var startLocal = getStartOfShift(shift);
                return getDisplayableFormat(startLocal, format);
            };

            $rootScope.getReadableLocalShiftEndTime = function(shift, format) {
                var endLocal = getEndOfShift(shift);
                return getDisplayableFormat(endLocal, format);
            };

            $rootScope.getReadableLocalShiftDiffTime = function(shift) {
                // TODO: MAKE SURE THIS PROPERLY CONSIDERS DST
                var startLocal = getStartOfShift(shift);
                var endLocal = getEndOfShift(shift);

                var diffHours = endLocal.diff(startLocal, 'minutes');
                return (diffHours / 60) + " hour shift";
            };

            $rootScope.getReadableUsersShiftTime = function(shift, format) {
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

            $rootScope.getReadableUsersShiftStartTime = function(shift, format) {
                var startLocal = getStartOfShift(shift);
                var startUsersTime = moment(startLocal).local();
                return getDisplayableFormat(startUsersTime, format);
            };

            $rootScope.getReadableUsersShiftEndTime = function(shift, format) {
                var endLocal = getEndOfShift(shift);
                var endUsersTime = moment(endLocal).local();
                return getDisplayableFormat(endUsersTime, format);
            };

            $rootScope.getShiftsLocation = function(shift) {
                var id = shift.location_id;
                var method = 'getLocation';

                if (shift.sublocation_id !== undefined && shift.sublocation_id !== null) {
                    method = 'getLocationForSublocation';
                    id = shift.sublocation_id;
                }

                return UserInfoService[method](id);
            };

            $rootScope.getShiftsSublocation = function(shift) {
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
        }
    ]);
