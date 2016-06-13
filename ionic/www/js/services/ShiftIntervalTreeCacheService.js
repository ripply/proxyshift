angular.module('scheduling-app.services')
    .service('ShiftIntervalTreeCacheService', [
        '$rootScope',
        'GENERAL_CONFIG',
        'GENERAL_EVENTS',
        function($rootScope,
                 GENERAL_CONFIG,
                 GENERAL_EVENTS
        ) {
            clear();
            this.initialize = initialize;

            function initialize() {
                // TODO: INTERVAL TREE INITIALIZE
            }

            this.add = function(shift) {
                // TODO: INTERVAL TREE
                if (shift) {
                    var shifts = getShifts();
                    for (var i = 0; i < shifts.length; i++) {
                        var existingShift = shifts[i];
                        if (existingShift) {
                            if (existingShift.id === shift.id) {
                                return;
                            }
                        }
                    }
                    $rootScope.push(shift);
                }
            };

            function getShifts() {
                return $rootScope.shiftIntervals;
            }

            this.updateShifts = updateShifts;

            function updateShifts(shifts) {
                $rootScope.shiftIntervals = shifts;
            }

            this.clear = clear;

            function clear() {
                $rootScope.shiftIntervals = [];
            }

            this.remove = remove;

            function remove(start, end) {
                // TODO: INTERVAL TREE
                var shifts = getShifts();
                for (var i = 0; i < shifts.length; i++) {
                    if (shiftInRange(shifts[i])) {
                        delete shifts[i];
                        --i;
                    }
                }
            }

            function shiftInRange(shift, start, end) {
                if (shift.end >= start && shift.start <= end) {
                    return true;
                } else if (shift.start <= end && shift.end >= start) {
                    return true;
                } else {
                    return false;
                }
            }

            this.get = get;

            function get(start, end, transform) {
                var results = [];
                var shifts = getShifts();
                // TODO: SETUP AN INTERVAL TREE HERE
                for (var i = 0; i < shifts.length; i++) {
                    var shift = shifts[i];
                    if (shift) {
                        if (transform !== undefined) {
                            shift = transform(shift);
                        }
                        if (shiftInRange(shift, start, end)) {
                            results.push(shift);
                        }
                    }
                }

                return results;
            }

            this.replaceRange = replaceRange;

            function replaceRange(start, end, shiftsArray, transform) {
                // TODO: INTERVAL TREE
                // Remove existing shifts in range
                var shifts = getShifts();
                for (var i = 0; i < shifts.length; i++) {
                    var shift = shifts[i];
                    if (shift) {
                        if (transform !== undefined) {
                            shift = transform(shift);
                        }

                        if (shiftInRange(shift, start, end)) {
                            delete shifts[i];
                            --i;
                        }
                    }
                }

                if (shiftsArray) {
                    // undefined could be passed in if server responds with no shifts
                    for (var j = 0; j < shiftsArray.length; j++) {
                        var replacementShift = shiftsArray[j];
                        if (transform !== undefined) {
                            replacementShift = transform(replacementShift);
                        }

                        shifts.push(replacementShift);
                    }
                }
            }

            function createInterval(shift) {
                // TODO: INTERVAL TREE
                return [shift.start, shift.end, shift]
            }

            $rootScope.$on(GENERAL_EVENTS.CALENDAR.INVALIDATE, function(event, start, end) {
                remove(start, end);
            });

            $rootScope.$on(GENERAL_EVENTS.CALENDAR.UPDATE.RANGE, function(event, shiftsArray, start, end) {
                replaceRange(start, end, shiftsArray);
                $rootScope.$broadcast(GENERAL_EVENTS.CALENDAR.UPDATE.DATASETUPDATED);
            });

            initialize();

        }
    ]);
