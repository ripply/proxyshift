angular.module('scheduling-app.controllers')
.filter('groupByDay', [
        '$parse',
        'ShiftProcessingService',
        function(
            $parse,
            ShiftProcessingService
        ) {
        var dividers = {};

        return function groupByDayFilter(input) {
            if (!input || !input.length) return;

            var output = [],
                previous,
                startDay,
                endDay;

            for (var i = 0, ii = input.length; i < ii && (item = input[i]); i++) {
                var date = ShiftProcessingService.getStartOfShift(item);
                if (!previous ||
                    !date.isBetween(startDay, endDay)) {
                    previous = date;
                    startDay = moment(date).startOf('day');
                    endDay = moment(date).endOf('day');
                    var dividerId = startDay.format('X');

                    if (!dividers[dividerId]) {
                        dividers[dividerId] = {
                            isDivider: true,
                            shift: item
                        };
                    }

                    output.push(dividers[dividerId]);
                }

                output.push(item);
                previous = date;
            }

            return output;
        };
    }]
);
