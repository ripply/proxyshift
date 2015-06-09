/**
 * AuthenticationService
 */
angular.module('scheduling-app.services.longrequesteventnotifier', [
    'scheduling-app.config'
])
    .factory('LongRequestEventNotifierService', [
        '$rootScope',
        'GENERAL_EVENTS',
        function($rootScope) {
            var pendingRequests = {

            };

            function triggerWaiting() {
                $rootScope.$broadcast(GENERAL_EVENTS.SLOW_REQUEST);
            }

            var previousRequest = [];

            return {
                'request': function(config) {
                    previousRequest.push(config);
                    console.debug("Request being made..");
                },
                'response': function(response) {
                    console.debug("Response received");
                    var found = false;
                    
                    for (var i = 0; i < previousRequest.length; i++) {
                        if (previousRequest[i] === response.config) {
                            console.debug("Config is IDENTICAL");
                            found = true;
                            break;
                        }
                    }

                    if (!found) {
                        console.debug("Unknown config...");
                    }

                }
            };
        }
    ])
    .config([
        '$httpProvider',
        'GENERAL_CONFIG',
        function($httpProvider, GENERAL_CONFIG) {
            $httpProvider.interceptors.push('LongRequestEventNotifierService');
        }
    ]);
