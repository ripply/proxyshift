angular.module('scheduling-app.services', [
    'scheduling-app.config'
])
    .service('ResourceUpdateAggregatorService', [
        '$rootScope',
        'GENERAL_EVENTS',
        function(
            $rootScope,
            GENERAL_EVENTS
        ) {
            $rootScope.$on(GENERAL_EVENTS.UPDATES.RESOURCE,
                function(event, resourceName, newResourceValue, oldResourceValue) {
                    $rootScope[resourceName] = newResourceValue;
                }
            );
        }
    ]
);
