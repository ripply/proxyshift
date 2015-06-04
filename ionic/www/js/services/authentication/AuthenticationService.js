/**
 * AuthenticationService
 */
angular.module('scheduling-app.authentication', [
    'http-auth-interceptor',
    'scheduling-app.session',
    'scheduling-app.config'
])
    .service('AuthenticationService', [
        '$rootScope',
        '$http',
        '$q',
        'authService',
        'CookiesService',
        'SessionService',
        'GENERAL_CONFIG',
        'GENERAL_EVENTS',
        function($rootScope,
                 $http,
                 $q,
                 authService,
                 CookiesService,
                 SessionService,
                 GENERAL_CONFIG,
                 GENERAL_EVENTS) {
            this.login = function(user) {
                //SessionService.authenticate();
                if (user.username === null || user.username == '') {
                    $rootScope.$broadcast(GENERAL_EVENTS.AUTHENTICATION.INVALID, 'Empty username');
                    return false;
                }
                else if (user.password === null || user.password == '') {
                    $rootScope.$broadcast(GENERAL_EVENTS.AUTHENTICATION.INVALID, 'Empty password');
                    return false;
                }
                var login_url = GENERAL_CONFIG.APP_URL + GENERAL_CONFIG.APP_URL_LOGIN;
                return $http.post(login_url, user, {
                    ignoreAuthModule: true,
                    timeout: GENERAL_CONFIG.LOGIN_TIMEOUT
                })
                    .success(function (data, status, headers, config) {
                        //$http.defaults.headers.common.Authorization = data.authorizationToken;  // Step 1

                        // Need to inform the http-auth-interceptor that
                        // the user has logged in successfully.  To do this, we pass in a function that
                        // will configure the request headers with the authorization token so
                        // previously failed requests(aka with status == 401) will be resent with the
                        // authorization token placed in the header
                        authService.loginConfirmed(data, function(config) {  // Step 2 & 3
                            //config.headers.Authorization = data.authorizationToken;
                            return config;
                        });
                    })
                    .error(function (data, status, headers, config) {
                        $rootScope.$broadcast(GENERAL_EVENTS.AUTHENTICATION.FAILED, status);
                    });
            };

            function fireLogoutFailedEvent(error) {
                $rootScope.$broadcast(GENERAL_EVENTS.LOGOUT.FAILED, error);
            }

            var loggingOut = false;
            var loggingOutDeferred = null;

            this.logout = function() {
                var deferred = $q.defer();

                setTimeout(function() {
                    if (loggingOut) {
                        return loggingOutDeferred.then(function() {
                            // success
                            deferred.resolve(true);
                        }, function() {
                            // error
                            deferred.resolve(false);
                        }, function(value) {
                            // update
                            deferred.notify(value);
                        })
                    }
                    if (SessionService.checkAuthentication()) {
                        var logout_url = GENERAL_CONFIG.APP_URL + GENERAL_CONFIG.APP_URL_LOGOUT;
                        return $http.post(logout_url, null, {
                            ignoreAuthModule: true,
                            timeout: GENERAL_CONFIG.LOGIN_TIMEOUT
                        }).
                            success(function(data, status, headers, config) {
                                // ensure that rememberme token is gone
                                var token = CookiesService.getCookie(GENERAL_CONFIG.APP_REMEMBER_ME_TOKEN);
                                if (token === undefined ||
                                    token === null ||
                                    token == '') {
                                    deferred.resolve(true);
                                } else {
                                    fireLogoutFailedEvent("Failed to delete token");
                                    deferred.resolve(false);
                                }
                            })
                            .error(function(data, status, headers, config) {
                                fireLogoutFailedEvent(data);
                            });
                    } else {
                        deferred.resolve(true);
                    }
                });

                return deferred.promise();
            };
        }])
;