angular.module('scheduling-app.services')
    .service('ResourceService', [
        '$rootScope',
        '$controller',
        'Restangular',
        function($rootScope,
                 $controller,
                 Restangular
        ) {
            this.createSublocation = function createSublocation(locationId, title, description, success, error) {
                andThen(
                    Restangular.one('locations', locationId)
                        .all('sublocations')
                        .customPOST({
                            title: title,
                            description: description
                        }),
                    success,
                    error
                );
            };

            function andThen(promise, success, error) {
                promise.then(function resourceServiceSuccess(result) {
                    if (success) {
                        success(result);
                    }
                }, function resourceServiceError(response) {
                    if (error) {
                        error(response);
                    }
                });
            }

        }]
);
