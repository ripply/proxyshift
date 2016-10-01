/**
 * AuthenticationService
 */

var tokenKey = "token";
var tokenExpiresKey = "tokenExpires";

angular.module('scheduling-app.authentication', [
    'http-auth-interceptor',
    'scheduling-app.session',
    'scheduling-app.settings',
    'scheduling-app.config',
    'LocalStorageModule'
])
    .service('AuthenticationService', [
        '$rootScope',
        '$http',
        '$q',
        'authService',
        'UserSettingService',
        'CookiesService',
        'SessionService',
        'PushProcessingService',
        'GENERAL_CONFIG',
        'GENERAL_EVENTS',
        function($rootScope,
                 $http,
                 $q,
                 authService,
                 UserSettingService,
                 CookiesService,
                 SessionService,
                 PushProcessingService,
                 GENERAL_CONFIG,
                 GENERAL_EVENTS) {
            var loggingIn = false;
            setupAngularHttpAuthentication(getToken());

            function storeToken(token, expires) {
                return UserSettingService.put(tokenKey, token, false) &&
                    UserSettingService.put(tokenExpiresKey, expires, false);
            }

            function getToken() {
                var now = Math.round(new Date().getTime() / 1000);
                var token = UserSettingService.get(tokenKey);
                var expires = UserSettingService.get(tokenExpiresKey);
                if (expires) {
                    if (now > expires) {
                        console.info("Token issued by server expired, must sign in again");
                        UserSettingService.clear(tokenKey, tokenExpiresKey);
                    }
                }
                return token;
            }

            function clearToken() {
                UserSettingService.clear(tokenKey, tokenExpiresKey);
                setupAngularHttpAuthentication();
            }

            function setupAngularHttpAuthentication(token) {
                if (token) {
                    $http.defaults.headers.common.Authorization = token;
                } else {
                    $http.defaults.headers.common.Authorization = undefined;
                }
            }

            function resolveLogin(deferred, value) {
                loggingIn = false;
                deferred.resolve(value);
            }

            function rejectLogin(deferred, value) {
                loggingIn = false;
                deferred.reject(value);
            }

            this.login = function(user) {
                var deferred;
                if (loggingIn !== false) {
                    return loggingIn;
                } else {
                    deferred = $q.defer();
                    loggingIn = deferred.promise;
                }
                //SessionService.authenticate();
                if (user.username === null || user.username == '') {
                    $rootScope.$broadcast(GENERAL_EVENTS.AUTHENTICATION.INVALID, 'Empty username');
                    rejectLogin(deferred);
                } else if (user.password === null || user.password == '') {
                    $rootScope.$broadcast(GENERAL_EVENTS.AUTHENTICATION.INVALID, 'Empty password');
                    rejectLogin(deferred);
                } else {
                    var login_url = GENERAL_CONFIG.APP_URL + GENERAL_CONFIG.APP_URL_LOGIN;
                    PushProcessingService.getDeviceId()
                        .then(function(deviceid) {
                            if (deviceid) {
                                user.deviceid = deviceid;
                                user.platform = PushProcessingService.platformToSendToServerForPush();
                            }
                        })
                        .catch(function(err) {
                            // most likely not using cordova or issue with push service
                        })
                        .finally(function() {
                            $http.post(login_url, user, {
                                ignoreAuthModule: true,
                                timeout: GENERAL_CONFIG.LOGIN_TIMEOUT
                            })
                                .success(function (data, status, headers, config) {
                                    if (data.hasOwnProperty('token')) {
                                        setupAngularHttpAuthentication(data.token);
                                        storeToken(data.token, data.expires);
                                    } else {
                                        console.debug("Server did not issue an authentication token");
                                    }

                                    if (data.hasOwnProperty('registeredForPush')) {
                                        var registeredForPush = data.registeredForPush;
                                        // TODO: Prompt user if this is false or something?
                                    }

                                    if (data.hasOwnProperty('userinfo')) {
                                        $rootScope.$broadcast(GENERAL_EVENTS.UPDATES.USERINFO.FETCHED, data.userinfo);
                                    }

                                    // Need to inform the http-auth-interceptor that
                                    // the user has logged in successfully.  To do this, we pass in a function that
                                    // will configure the request headers with the authorization token so
                                    // previously failed requests(aka with status == 401) will be resent with the
                                    // authorization token placed in the header
                                    SessionService.setAuthenticated(true);
                                    resolveLogin(deferred);
                                    $rootScope.$broadcast(GENERAL_EVENTS.AUTHENTICATION.CONFIRMED);
                                    authService.loginConfirmed(data, function (config) {  // Step 2 & 3
                                        //config.headers.Authorization = data.authorizationToken;
                                        //deferred.resolve(config);
                                        return config;
                                    });
                                })
                                .error(function (data, status, headers, config) {
                                    rejectLogin(deferred);
                                    $rootScope.$broadcast(GENERAL_EVENTS.AUTHENTICATION.FAILED, status);
                                });
                        });
                }

                return deferred.promise;
            };

            function fireLogoutFailedEvent(error) {
                $rootScope.$broadcast(GENERAL_EVENTS.LOGOUT.FAILED, error);
            }

            function fireLogoutSuccessEvent() {
                $rootScope.$broadcast(GENERAL_EVENTS.LOGOUT.COMPLETE);
            }

            var loggingOut = false;

            function resolveLogout(deferred, value) {
                loggingOut = false;
                deferred.resolve(value);
            }

            function rejectLogout(deferred, value) {
                loggingOut = false;
                deferred.reject(value);
            }

            this.logout = function() {
                var deferred;
                if (loggingOut !== false) {
                    return loggingOut.promise;
                } else {
                    deferred = $q.defer();
                    loggingOut = deferred;
                }

                SessionService.checkAuthentication(true)
                    .then(function() {
                        var logout_url = GENERAL_CONFIG.APP_URL + GENERAL_CONFIG.APP_URL_LOGOUT;
                        return $http.post(logout_url, null, {
                            ignoreAuthModule: true,
                            timeout: GENERAL_CONFIG.LOGIN_TIMEOUT
                        }).
                            success(function(data, status, headers, config) {
                                // ensure that rememberme token is gone
                                clearToken();

                                SessionService.setAuthenticated(false);
                                var token = CookiesService.getCookie(GENERAL_CONFIG.APP_REMEMBER_ME_TOKEN);
                                if (token === undefined ||
                                    token === null ||
                                    token == '') {
                                    fireLogoutSuccessEvent();
                                    resolveLogout(deferred);
                                } else {
                                    fireLogoutFailedEvent("Failed to delete token");
                                    rejectLogout(deferred);
                                }
                            })
                            .error(function(data, status, headers, config) {
                                clearToken();
                                fireLogoutFailedEvent(data);
                                rejectLogout(deferred);
                            });
                    }, function() {
                        clearToken();
                        resolveLogout(deferred);
                    });

                return deferred.promise;
            };

            $rootScope.$on(GENERAL_EVENTS.AUTHENTICATION.CONFIRMED, function() {
                $rootScope.authenticated = true;
            });

            function notAuthenticated() {
                $rootScope.authenticated = false;
            }

            $rootScope.$on(GENERAL_EVENTS.AUTHENTICATION.REQUIRED, function() {
                SessionService.checkAuthentication(false, true)
                    .then(function() {
                        // OK, do nothing
                    }, function() {
                        // Not OK
                        notAuthenticated();
                    });
            });
            $rootScope.$on(GENERAL_EVENTS.AUTHENTICATION.FAILED, notAuthenticated);
            $rootScope.$on(GENERAL_EVENTS.LOGOUT.COMPLETE, notAuthenticated);
        }])
;
