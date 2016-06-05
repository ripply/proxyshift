//factory for processing push notifications.
angular.module('scheduling-app.push', [
    'scheduling-app.config'
])
    .service('PushProcessingService', [
        '$q',
        '$rootScope',
        '$state',
        'toastr',
        'ResourceService',
        'CORDOVA_SETTINGS',
        function(
            $q,
            $rootScope,
            $state,
            toastr,
            ResourceService,
            CORDOVA_SETTINGS
        ) {
            var self = this;
            var deferred = $q.defer();
            var promise = deferred.promise;
            var deviceId;
            var timedout = false;

            function showToast(type, title, body, misc) {
                toastr[type](title, body, misc ? misc : {});
            }

            window.manageShift = {
                accept: function(data) {

                },
                manage: function(data) {
                    $state.go('app.shift', {shift_id: data.additionalData.data.shift_id});
                }
            };

            window.newShift = {
                apply: function(data) {
                    ResourceService.registerForShift(data.additionalData.data.shift_id[0], function() {
                        alert("Successfully registered for shift");
                    }, function(response) {
                        alert("Failed to register for shift: " + JSON.stringify(response));
                    });
                },
                ignore: function(data) {
                    ResourceService.ignoreShift(adata.additionalData.data.shift_id[0], function() {
                        alert("Successfully ignored shift");
                    }, function(response) {
                        alert("Failed to ignore shift: " + JSON.stringify(response));
                    })
                }
            };

            window.actions = {
                loggedIn: {
                    foreground: function(data) {
                        showToast('info', 'Logged in', 'logged in!');
                    },
                    background: function(data) {
                        showToast('info', 'Logged in', 'logged in while app in the background');
                    },
                    coldstart: function(data) {
                        showToast('info', 'Logged in', 'logged in while app was off');
                    }
                },
                newShift: {
                    'default': function(data, additionalData, foreground, coldstart) {

                    }
                },
                shiftApplicationApproveDeny: {
                    foreground: function(data) {
                        showToast(data.additionalData.data.accepted ? 'success':'warning', data.title, data.message, {
                            onTap: function(clicked, toast) {
                                $state.go('app.shift', {shift_id: data.additionalData.data.shift_id});
                            }
                        });
                    },
                    background: function(data) {
                        alert('Shift application approval/denial');
                    },
                    coldstart: function(data) {
                        $state.go('app.shifts', {shift_id: data.additionalData.data.shift_id});
                    }
                }
            };

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
                                            "callback": "window.newShift.apply", "title": "Apply", "foreground": true, "destructive": false
                                        },
                                        "no": {
                                            "callback": "window.newShift.ignore", "title": "Ignore", "foreground": false, "destructive": false
                                        }
                                    },
                                    "manageShift": {
                                        "yes": {
                                            "callback": "window.manageShift.accept", "title": "Accept", "foreground": true, "destructive": true
                                        },
                                        "no": {
                                            "callback": "window.manageShift.manage", "title": "Manage", "foreground": true, "destructive": true
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
                            console.log("RECEIVED NOTIFICATION:" + JSON.stringify(data));
                            var additionalData = data.additionalData;
                            if (additionalData && additionalData.hasOwnProperty('action')) {
                                var foreground = additionalData.foreground;
                                var coldstart = additionalData.coldstart;
                                if (window.actions.hasOwnProperty(additionalData.action)) {
                                    var actions = window.actions[additionalData.action];
                                    var method = null;
                                    if (coldstart && actions.hasOwnProperty('coldstart') && actions['coldstart'] != false) {
                                        method = actions['coldstart'];
                                    } else if (foreground && actions.hasOwnProperty('foreground') && actions['foreground'] != false) {
                                        method = actions['foreground'];
                                    } else if (!foreground && actions.hasOwnProperty('background') && actions['background'] != false) {
                                        method = actions['background'];
                                    } else if (actions.hasOwnProperty('foreground') && actions['foreground'] != false) {
                                        method = actions['foreground'];
                                    } else if (actions.hasOwnProperty('background') && actions['background'] != false) {
                                        method = actions['background'];
                                    } else if (actions.hasOwnProperty('default')) {
                                        method = actions['default'];
                                    }
                                    if (method) {
                                        method(data, additionalData, foreground, coldstart);
                                    } else {
                                        alert('Cannot handle action: ' + additionalData.action + '\n' + JSON.stringify(data));
                                    }
                                } else {
                                    alert('Unknown action: ' + additionalData.action + '\n' + JSON.stringify(data));
                                }
                            } else {
                                alert(JSON.stringify(data));
                            }
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
