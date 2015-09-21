angular.module('scheduling-app.services')
    .service('ErrorMessageService', [
        function(
        ) {
            this.parse = function(response, defaultMessage) {
                var message;
                if (response.hasOwnProperty('data') && response.data.hasOwnProperty('message')) {
                    message = response.data.message;
                }
                // restangular responses
                if (response.hasOwnProperty('data')
                    && response.data.hasOwnProperty('data')
                    && response.data.data.hasOwnProperty('message')) {
                    message = response.data.data.message;
                }

                if (message === undefined) {
                    message = defaultMessage;
                }

                return message;
            }
        }
    ]);
