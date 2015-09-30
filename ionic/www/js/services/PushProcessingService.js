//factory for processing push notifications.
angular.module('scheduling-app.push', [
    'scheduling-app.config'
])
    .service('PushProcessingService', [
        '$q',
        'CORDOVA_SETTINGS',
        function(
            $q,
            CORDOVA_SETTINGS
        ) {
            var self = this;
            var deferred = $q.defer();
            var promise = deferred.promise;
            var deviceId;

            function supported() {
                return window.cordova &&
                    (CORDOVA_SETTINGS.isIOS ||
                     CORDOVA_SETTINGS.isAndroid ||
                     CORDOVA_SETTINGS.isWindowsPhone);
            }

            this.supported = supported;

            function platformToSendToServerForPush() {
                return CORDOVA_SETTINGS.currentPlatform;
            }

            this.platformToSendToServerForPush = platformToSendToServerForPush;

            if (!supported()) {
                deferred.reject("Platform not supported");
            }

            this.getDeviceId = function() {
                return promise;
            };

            function onDeviceReady() {
                if (supported()) {
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
                        // push notification plugin was most likely not included with build
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
