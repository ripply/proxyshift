angular.module('scheduling-app.services')
    .service('ShiftProcessingService', [
        '$rootScope',
        function($rootScope
        ) {
            $rootScope.getReadableShiftTime = function(shift) {
                var startMoment = moment.tz(shift.start * 1000, shift.timezone.name);
                var startLocal = moment(startMoment).local();
                var startDisplayable = getDisplayableFormat(startMoment);
                var startDisplayableLocal = getDisplayableFormat(startLocal);

                if (startMoment.format("Z") != startLocal.format("Z")) {
                    startDisplayable = startDisplayable + "(" + startDisplayableLocal + " local)";
                }

                var endMoment = moment.tz(shift.end * 1000, shift.timezone.name);
                var endLocal = moment(endMoment).local();
                var endDisplayable = getDisplayableFormat(endMoment);
                var endDisplayableLocal = getDisplayableFormat(endLocal);

                if (endMoment.format("Z") != endLocal.format("Z")) {
                    endDisplayable = endDisplayable + "(" + endDisplayableLocal + " local)";
                }

                var diffHours = endMoment.diff(startMoment, 'minutes');
                return startDisplayable
                    + " - "
                    + endDisplayable
                    + " - " + (diffHours / 60) + " hour shift";
            };

            function getDisplayableFormat(time) {
                return time.format("h:mma");
            }

            this.getStartOfShift = function(shift) {
                return moment.tz(shift.start * 1000, shift.timezone.name);
            };

            this.getEndOfShift = function(shift) {
                return moment.tz(shift.end * 1000, shift.timezone.name);
            };
        }
    ]);
