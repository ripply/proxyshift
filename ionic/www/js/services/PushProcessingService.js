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
            var timedout = false;

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
                    var errorOccured = false;
                    var finished = false;
                    try {
                        self.push = PushNotification.init({
                            android: {
                                senderID: window.PushAppIds.gcm,
                                icon: 'img/ionic.png'
                            },
                            ios: {
                                alert: true,
                                badge: true,
                                sound: true,
                                "categories": {
                                    "newShift": {
                                        "yes": {
                                            "callback": "window.apply", "title": "Apply", "foreground": true, "destructive": false
                                        },
                                        "no": {
                                            "callback": "window.ignore", "title": "Ignore", "foreground": false, "destructive": false
                                        }
                                    },
                                    "manageShift": {
                                        "yes": {
                                            "callback": "window.manageShift.accept", "title": "Accept", "foreground": true, "destructive": true
                                        },
                                        "no": {
                                            "callback": "window.manageShift.accept", "title": "Dismiss", "foreground": true, "destructive": true
                                        }
                                    }
                                }
                            },
                            windows: {

                            }
                        });
                        self.push.on('registration', function (data) {
                            finished = true;
                            if (timedout) {
                                timedout = false;
                                deferred = $q.defer();
                                promise = deferred.promise;
                            }
                            if (data.registrationId) {
                                deviceId = data.registrationId;
                                //navigator.notification.alert(deviceId, function(i) {}, "Success!", ['ok']);
                                deferred.resolve(deviceId);
                            } else {
                                //navigator.notification.alert("Failed to get push id", function(i) {}, "Failure", ['ok']);
                                deferred.reject(data);
                            }
                            console.log("REGISTRATION: " + JSON.stringify(data));
                        });
                        self.push.on('error', function(e) {
                            finished = true;
                            timedout = false;
                            if (!timedout) {
                                deferred.reject(e);
                            }
                        });
                        self.push.on('notification', function(data) {
                            alert(data.message);
                            //navigator.notification.alert(data.message, function(i) {}, data.title, ['hey', 'sup']);
                            console.log("RECEIVED NOTIFICATION:" + JSON.stringify(data));
                        });
                        // if push notifications are never initialized user wont be able to login
                        // this happens on ios when user disables push notifications
                        setTimeout(
                            function() {
                                if (!finished) {
                                    timedout = true;
                                    if (!errorOccured) {
                                        deferred.reject("timed out");
                                    }
                                }
                            },
                            200
                        );
                    } catch (err) {
                        alert("Error initializing push notifications");
                        alert(err);
                        console.log(err);
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
