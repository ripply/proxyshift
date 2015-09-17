angular.module('scheduling-app.controllers')
    .controller('ShiftIntervalTreeCacheService', [
        'GENERAL_CONFIG',
        'GENERAL_EVENTS',
        function(GENERAL_CONFIG,
                 GENERAL_EVENTS
        ) {
            var intervalTree;
            this.initialize = initialize;

            function initialize() {
                if (intervalTree === undefined) {
                    intervalTree = createIntervalTree();
                } else {
                    // already initialized
                }
            }

            this.add = function(shift) {
                initialize();
                intervalTree.insert(createInterval(shift));
            };

            this.remove = function(start, end) {
                intervalTree.remove(start, end);
            };

            this.get = function(start, end) {
                var shifts = [];

                intervalTree.queryInterval(start, end, function(shiftInterval) {
                    if (shiftInterval.length > 2) {
                        shifts.push(shiftInterval[2]);
                    }
                    return false;
                });

                return shifts;
            };

            function createInterval(shift) {
                // the library we use inserts entire array into tree
                // so we can set the third array item
                return [shift.start, shift.end, shift]
            }

        }
    ]);
