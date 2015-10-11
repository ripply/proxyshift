angular.module('scheduling-app.services.initialize', [
    'scheduling-app.controllers',
    'scheduling-app.services',
    'scheduling-app.authentication',
    'scheduling-app.push',
    'scheduling-app.loading'
])
    .service('InitializeServices', [
        'LoginControllerService',
        'ResourceUpdateAggregatorService',
        'ShiftIntervalTreeCacheService',
        'AuthenticationService',
        'PushProcessingService',
        'ShiftProcessingService',
        'IonicService',
        function(
            LoginControllerService,
            ResourceUpdateAggregatorService,
            ShiftIntervalTreeCacheService,
            AuthenticationService,
            PushProcessingService,
            ShiftProcessingService,
            IonicService
        ) {
            // Services should be initialized
        }
    ]);
