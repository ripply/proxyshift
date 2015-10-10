angular.module('scheduling-app.services.initialize', [
    'scheduling-app.controllers',
    'scheduling-app.services',
    'scheduling-app.authentication',
    'scheduling-app.push'
])
    .service('InitializeServices', [
        'LoginControllerService',
        'ResourceUpdateAggregatorService',
        'ShiftIntervalTreeCacheService',
        'AuthenticationService',
        'PushProcessingService',
        'ShiftProcessingService',
        function(
            LoginControllerService,
            ResourceUpdateAggregatorService,
            ShiftIntervalTreeCacheService,
            AuthenticationService,
            PushProcessingService,
            ShiftProcessingService
        ) {
            // Services should be initialized
        }
    ]);
