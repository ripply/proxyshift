angular.module('scheduling-app.services.initialize', [
    'scheduling-app.controllers',
    'scheduling-app.services'
])
    .service('InitializeServices', [
        'LoginControllerService',
        'ResourceUpdateAggregatorService',
        'ShiftIntervalTreeCacheService',
        function(
            LoginControllerService,
            ResourceUpdateAggregatorService,
            ShiftIntervalTreeCacheService
        ) {
            // Services should be initialized
        }
    ]);
