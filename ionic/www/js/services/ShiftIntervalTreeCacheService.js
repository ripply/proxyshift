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
                intervalTree.insert(getInterval(shift));
            };

            function getInterval(shift) {
                // the library we use inserts entire array into tree
                // so we can set the third array item
                return [shift.start, shift.end, shift]
            }

        }
    ]);
