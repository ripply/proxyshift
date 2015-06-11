angular.module('scheduling-app.services.initialize', [
    'scheduling-app.controllers'
])
    .service('InitializeServices', [
        'LoginControllerService',
        function(
            LoginControllerService) {
            // Services should be initialized
        }
    ]);