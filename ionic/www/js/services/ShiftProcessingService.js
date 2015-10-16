angular.module('scheduling-app.services')
    .service('ShiftProcessingService', [
        '$rootScope',
        function($rootScope
        ) {
            $rootScope.getReadableShiftTime = function(shift) {
                var startMoment = moment.utc(shift.start * 1000);
                var endMoment = moment.utc(shift.end * 1000);
                var diffHours = endMoment.diff(startMoment, 'minutes');
                return getDisplayableFormat(startMoment)
                    + " - "
                    + getDisplayableFormat(endMoment.local())
                    + " - " + (diffHours / 60) + " hour shift";
            };

            function getDisplayableFormat(time) {
                return time.format("h:mma");
            }
        }
    ]);
