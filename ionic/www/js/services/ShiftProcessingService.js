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
                'hour': 'hr',
                'minute': 'm'
            };

            this.getReadableClassType = function(shift) {
                var userClass = UserInfoService.getUserClass(shift.groupuserclass_id);
                if (userClass) {
                    return userClass.title;
                } else {
                    return 'UNKNOWN';
                }
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

            this.getReadableLocalShiftApplicationTime = function(shift, shiftapplication, format) {
                var startLocal = getShiftApplicationTime(shift, shiftapplication);
                return getDisplayableFormat(startLocal, format);
            };

            this.getReadableLocalShiftStartTime = function(shift, format) {
                var startLocal = getStartOfShift(shift);
                return getDisplayableFormat(startLocal, format);
            };

            this.getReadableLocalShiftStartEndTime = function(shift, format) {
                var startLocal = getStartOfShift(shift);
                var endLocal = getEndOfShift(shift);
                var start = getDisplayableFormat(startLocal, format);
                var end = getDisplayableFormat(endLocal, 'h:mma');
                return start + ' - ' + end;
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

            this.getScrollToPosition = function(scrollTo, model, spacing, dividerOuterHeight, dividerInnerHeight, shiftOuterHeight, shiftInnerHeight) {
                if (model) {
                    var start = parseInt(scrollTo);
                    if (!start) {
                        return;
                    }
                    var y = 0;
                    var index = 0;
                    var latestShift;
                    var latestShiftMoment;
                    var latestY = 0;
                    for (var i = 0; i < model.length; i++) {
                        var shift = model[i];
                        if (shift.isDivider) {
                            if (y != 0) {
                                y = y + spacing;
                            }
                            y = y + dividerOuterHeight;
                        } else {
                            // check if this shift is on the same day as the previous one
                            var thisShiftMoment = this.getStartOfShift(shift);
                            if (shift.start < start) {
                                // this shift is the latest one we know, keep searching
                                if (latestShiftMoment &&
                                    (latestShiftMoment.year() == thisShiftMoment.year() &&
                                    latestShiftMoment.month() == thisShiftMoment.month() &&
                                    latestShiftMoment.date() == thisShiftMoment.date())) {
                                        // starts on the same day
                                        // don't update the latest Shift
                                } else {
                                    latestShift = shift.start;
                                    latestShiftMoment = thisShiftMoment;
                                    latestY = y;
                                }
                                index = i;
                                if (y != 0) {
                                    y = y + spacing;
                                }
                                y = y + shiftOuterHeight;
                            } else {
                                // this shift is AFTER what we are looking for, and it is the first
                                if (latestShift) {
                                    // there is a shift before this, that's good
                                } else {
                                    index = i;
                                    latestShift = shift.start;
                                    latestShiftMoment = thisShiftMoment;
                                    latestY = y;
                                }
                                break;
                            }
                        }
                    }
                    if (latestShift) {
                        //$ionicScrollDelegate.scrollTo(0, latestY, true);
                        return latestY;
                    }
                }
            };

            this.isShiftApproved = function isShiftApproved(shift) {
                if (shift.approved) {
                    return true;
                } else if (shift.shiftapplications && shift.shiftapplications.length > 0) {
                    var i = 0;
                    var shiftapplications = shift.shiftapplications;
                    for (i = 0; i < shiftapplications.length; i++) {
                        if (shiftapplications[i].accept) {
                            return true;
                        }
                    }
                }
                return false;
            };

            this.isShiftAppliedFor = function isShiftAppliedFor(shift) {
                return shift.applied || (shift.shiftapplications && shift.shiftapplications.length > 0);
            };

            this.compareShiftByDate = function compareShiftByDate(left, right) {
                if (left.start < right.start) {
                    return -1;
                } else if (left.start > right.start) {
                    return 1;
                } else {
                    return 0;
                }
            };

            this.isShiftApproved = function isShiftApproved(shift) {
                if (shift.approved) {
                    return true;
                } else if (shift.shiftapplications && shift.shiftapplications.length > 0) {
                    for (var i = 0; i < shift.shiftapplications.length; i++) {
                        if (shiftApplicationIsAccepted(shift.shiftapplications[i])) {
                            return true;
                        }
                    }
                }
                return false
            };

            this.isShiftDeclined = function isShiftDeclined(shift) {
                if (shift.approved !== undefined && shift.approved !== null && !shift.approved) {
                    return true;
                } else if (shift.shiftapplications && shift.shiftapplications.length > 0) {
                    for (var i = 0; i < shift.shiftapplications.length; i++) {
                        if (shiftApplicationIsDeclined(shift.shiftapplications[i])) {
                            return true;
                        }
                    }
                }
                return false
            };

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
                    // only show year if it is different than the current year
                    var currentYear = moment().year();
                    var shiftYear = time.year();
                    format = "MM/DD" + (currentYear == shiftYear ? '':' YYYY') + " h:mma";
                }
                return time.format(format);
            }

            this.getStartOfShift = getStartOfShift;

            function getStartOfShift(shift) {
                return moment.tz(shift.start * 1000, shift.timezone.name);
            }

            function getShiftApplicationTime(shift, shiftapplication) {
                return moment.tz(shiftapplication.date * 1000, shift.timezone.name);
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
