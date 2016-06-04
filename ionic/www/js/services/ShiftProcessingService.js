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
                if (list.length == 0) {
                    var seconds = duration.get('s');
                    list.push(seconds + 's');
                }
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

            this.shiftHasAcceptedApplication = function(shift) {
                if (shift.shiftapplications) {
                    for (var i = 0; i < shift.shiftapplications.lenght; i++) {
                        var application = shift.shiftapplications[i];
                        if (shiftApplicationIsAccepted(application)) {
                            return true;
                        }
                    }
                }
                return false;
            };

            this.shiftApplicationIsAccepted = shiftApplicationIsAccepted;

            function sortShiftApplicationAcceptDeny(acceptDeny) {
                acceptDeny.sort(function(left, right) {
                    if (left.date == right.date) {
                        return 0;
                    } else if (left.date < right.date) {
                        return -1;
                    } else {
                        return 1;
                    }
                });
            }

            function shiftApplicationIsAccepted(application) {
                if (!application.recinded && application.shiftapplicationacceptdeclinereasons) {
                    var reasons = application.shiftapplicationacceptdeclinereasons;
                    sortShiftApplicationAcceptDeny(reasons);
                    if (reasons.length > 0) {
                        if (isAccepted(reasons[reasons.length - 1].accept)) {
                            return true;
                        }
                    }
                }
                return false;
            }

            this.shiftApplicationIsDeclined = shiftApplicationIsDeclined;

            function shiftApplicationIsDeclined(application) {
                if (!application.recinded && application.shiftapplicationacceptdeclinereasons) {
                    var reasons = application.shiftapplicationacceptdeclinereasons;
                    sortShiftApplicationAcceptDeny(reasons);
                    if (reasons.length > 0) {
                        if (!isAccepted(reasons[reasons.length - 1].accept)) {
                            return true;
                        }
                    }
                }
                return false;
            }

            function isAccepted(accept) {
                return accept == '1' || accept == true;
            }

            this.getDisplayableFormatFromString = function(time, format, wat) {
                return getDisplayableFormat(moment(time * 1000), format);
            };

            this.getDisplayableFormat = getDisplayableFormat;

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

            this.shiftHasNonRecindedApplications = function shiftHasNonRecindedApplications(shift) {
                if (shift.shiftapplications) {
                    for (var i = 0; i < shift.shiftapplications.length; i++) {
                        var shiftapplication = shift.shiftapplications[i];
                        if (!shiftapplication.recinded) {
                            return true;
                        }
                    }
                }

                return false;
            };

            $rootScope.$on(GENERAL_EVENTS.UPDATES.RESOURCE, function(state, resource, value) {
                if (resource == 'AllShifts') {
                    //markDayBreaksForShifts(value);
                }
            });
        }
    ]);
