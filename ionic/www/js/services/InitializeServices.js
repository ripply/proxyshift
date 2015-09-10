angular.module('scheduling-app.services.initialize', [
    'scheduling-app.controllers',
    'scheduling-app.services'
])
    .service('InitializeServices', [
        'LoginControllerService',
        'ResourceUpdateAggregatorService',
        function(
            LoginControllerService,
            ResourceUpdateAggregatorService
        ) {
            // Services should be initialized
        }
    ]);
