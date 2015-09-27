angular.module('scheduling-app.services.initialize', [
    'scheduling-app.controllers',
    'scheduling-app.services',
    'scheduling-app.authentication'
])
    .service('InitializeServices', [
        'LoginControllerService',
        'ResourceUpdateAggregatorService',
        'ShiftIntervalTreeCacheService',
        'AuthenticationService',
        function(
            LoginControllerService,
            ResourceUpdateAggregatorService,
            ShiftIntervalTreeCacheService,
            AuthenticationService
        ) {
            // Services should be initialized
        }
    ]);
