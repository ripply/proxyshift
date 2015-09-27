//factory for processing push notifications.
angular.module('scheduling-app.push', [

])
    .service('PushProcessingService', [
        '$q',
        function(
            $q
        ) {
            var self = this;
            var deferred = $q.defer();
            var promise = deferred.promise;
            var deviceId;

            if (!window.cordova) {
                deferred.reject("Cordova missing");
            }

            this.getDeviceId = function() {
                return promise;
            };

            function onDeviceReady() {
                if (window.cordova) {
                    try {
                        self.push = PushNotification.init({
                            android: {
                                senderID: window.PushAppIds.gcm
                            }
                        });
                        self.push.on('registration', function (data) {
                            if (data.registrationId) {
                                deviceId = data.registrationId;
                                deferred.resolve(deviceId);
                            } else {
                                deferred.reject(data);
                            }
                            console.log("REGISTRATION: " + JSON.stringify(data));
                        });
                    } catch (err) {
                        console.log(err);
                        deferred.reject(err);
                        // page wont load properly if this service errors
                        // we can live without it
                    }
                }
            }

            document.addEventListener('deviceready', onDeviceReady, false);
        }
    ]
);
