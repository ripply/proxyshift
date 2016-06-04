/**
 * SessionService
 *
 * The session service needs to check for a remember me token
 * check that the token has not expired
 * token expiration should be set by the server when issuing the cookie
 * so the mere presence of a token should mean that the user is logged in
 */
angular.module('scheduling-app.session', [
    'scheduling-app.config',
    'scheduling-app.cookies',
    'scheduling-app.services',
    'ngCookies',
    'scheduling-app.services.routing.statehistory'
])
    .service('SessionService', [
        '$q',
        '$http',
        '$rootScope',
        '$state',
        'StateHistoryService',
        'UserInfoService',
        'CookiesService',
        'GENERAL_CONFIG',
        'GENERAL_EVENTS',
        'STATES',
        function($q,
                 $http,
                 $rootScope,
                 $state,
                 StateHistoryService,
                 UserInfoService,
                 CookiesService,
                 GENERAL_CONFIG,
                 GENERAL_EVENTS,
                 STATES) {
            var accessedRestrictedResource = false;
            var accessedRestrictedResourceExpires = null;
            var retryResourceIn = GENERAL_CONFIG.SESSION_RETRY_ACCESSED_RESOURCE_IN;
            var failedLogin = false;
            var userinfo = {};
            $rootScope.userinfo = userinfo;

            function setAuthenticated(authenticated) {
                accessedRestrictedResource = authenticated;
                if (authenticated === true) {
                    // only update expiration if authenticated
                    accessedRestrictedResourceExpires = moment().add(retryResourceIn.value, retryResourceIn.interval);
                }
            }

            this.setAuthenticated = setAuthenticated;

            function isAuthenticated() {
                var keys = [];
                for (var key in userinfo) {
                    keys.push(key);
                }

                var accessedRestrictedResourceRecently =
                    (accessedRestrictedResource && moment() < accessedRestrictedResourceExpires);

                if (!accessedRestrictedResourceRecently && keys.length === 0) {
                    return false;
                } else {
                    return accessedRestrictedResourceRecently;
                }
            }

            this.isAuthenticated = isAuthenticated;

            function fireAuthenticationRequiredEvent(loggingOut) {
                setAuthenticated(false);
                if (!loggingOut) {
                    $rootScope.$broadcast(GENERAL_EVENTS.AUTHENTICATION.REQUIRED);
                }
            }

            function fireAuthenticationConfirmedEvent(loggingOut) {
                setAuthenticated(true);
                if (!loggingOut) {
                    $rootScope.$broadcast(GENERAL_EVENTS.AUTHENTICATION.CONFIRMED);
                }
            }

            function fireAuthenticationPendingEvent() {
                showLoadingScreen(true);
                $rootScope.$broadcast(GENERAL_EVENTS.AUTHENTICATION.PENDING);
            }

            function showLoadingScreen(show) {
                $rootScope.$emit(show ?
                    GENERAL_EVENTS.LOADING.SHOW : GENERAL_EVENTS.LOADING.HIDE);
            }

            $rootScope.$on(GENERAL_EVENTS.AUTHENTICATION.CONFIRMED, function() {
                failedLogin = false;
            });

            $rootScope.$on(GENERAL_EVENTS.UPDATES.USERINFO.UPDATENEEDED, function() {
                updateUserInfo($rootScope);
            });

            $rootScope.$on(GENERAL_EVENTS.UPDATES.USERINFO.FETCHED, function(scope, data) {
                angular.extend(userinfo, data);
                UserInfoService.updateUserInfo();
            });

            function updateUserInfo($scope, success, error) {
                $http.get(GENERAL_CONFIG.APP_URL + GENERAL_CONFIG.APP_URL_API + "/users/userinfo", {
                    timeout: GENERAL_CONFIG.LOGIN_TIMEOUT
                })
                    .success(function (data, status, headers, config) {
                        angular.extend(userinfo, data);
                        UserInfoService.updateUserInfo();
                        $scope.$emit(GENERAL_EVENTS.UPDATES.USERINFO.SUCCESS);
                        if (success) {
                            success();
                        }
                    })
                    .error(function (data, status, headers, config) {
                        $scope.$emit(GENERAL_EVENTS.UPDATES.USERINFO.FAILED);
                        if (error) {
                            error();
                        }
                    });
            }

            var checkingAuthenticationPromise = false;

            function resolve(deferred, value) {
                showLoadingScreen(false);
                checkingAuthenticationPromise = false;
                console.log("checkAuthentication returning TRUE");
                deferred.resolve(value);
            }

            function reject(deferred, value) {
                showLoadingScreen(false);
                checkingAuthenticationPromise = false;
                console.log("checkAuthentication returning FALSE");
                deferred.reject(value);
            }

            function checkAuthentication(loggingOut, forceCheck) {
                var deferred;
                if (checkingAuthenticationPromise !== false) {
                    // blocking wait for auth to finish
                    return checkingAuthenticationPromise;
                } else {
                    deferred = $q.defer();
                    checkingAuthenticationPromise = deferred.promise;
                }

                var rememberme_token = CookiesService.getCookie(GENERAL_CONFIG.APP_REMEMBER_ME_TOKEN);

                if (forceCheck ||
                    rememberme_token === null ||
                    rememberme_token === undefined) {
                    // remember me token was not found
                    // query the server to see if the session is still open
                    var api_url = GENERAL_CONFIG.APP_URL;

                    if (!forceCheck && isAuthenticated()) {
                        console.debug("Already logged in.");
                        console.trace();
                        resolve(deferred);
                    } else if (!forceCheck && failedLogin) {
                        reject(deferred);
                    } else {
                        fireAuthenticationPendingEvent();
                        $http.get(api_url + "/session", {
                            ignoreAuthModule: true,
                            timeout: GENERAL_CONFIG.LOGIN_TIMEOUT
                        })
                            .success(function (data, status, headers, config) {
                                // successfully accessed a restriced resource
                                // we are already logged in
                                console.debug("Able to access protected resource, logged in.");
                                updateUserInfo($rootScope, function() {
                                    fireAuthenticationConfirmedEvent(loggingOut);
                                    resolve(deferred);
                                }, function() {
                                    console.debug("Failed to fetch userinfo, which is required");
                                    failedLoginFunc();
                                });
                            })
                            .error(function (data, status, headers, config) {
                                // failed to access a protected resource
                                // TODO: Handle connection timeouts here
                                console.debug("Failed to access protected resource, not logged in");
                                failedLoginFunc();
                            });

                        function failedLoginFunc() {
                            // set flag that forces this method to return false
                            // until the user is logged in
                            failedLogin = true;
                            fireAuthenticationRequiredEvent(loggingOut);
                            reject(deferred);
                        }
                    }
                } else {
                    // remember me token exists.
                    // we *should* be authenticated
                    // if for some reason this token is invalid,
                    // then when a request is made for a protected resource
                    // angular-http-auth will intercept the 401 response
                    // and trigger an 'event:auth-loginRequired' event.
                    // LoginController listens to that event
                    // and will trigger a login modal popup asking the user to login
                    fireAuthenticationConfirmedEvent();
                    resolve(deferred);
                }
                return deferred.promise;
            }
            this.checkAuthentication = checkAuthentication;
            this.checkAuthentication = checkAuthentication;
            function requireSession() {
                return checkAuthentication();
            }
            this.requireSession = requireSession;
            this.requireSessionOrBack = function() {
                var deferred = $q.defer();

                requireSession().then(function() {
                    deferred.resolve();
                }, function() {
                    deferred.reject();
                    StateHistoryService.goBack();
                }, function() {
                    // notice, do nothing
                });

                return deferred.promise;
            };
            this.requireSessionOrGoLogin = function() {
                var deferred = $q.defer();

                requireSession().then(function() {
                    deferred.resolve();
                }, function() {
                    deferred.reject();
                    $state.go(STATES.LOGIN)
                });

                return deferred.promise;
            };
            this.requireNoSession = function() {
                var deferred = $q.defer();

                checkAuthentication()
                    .then(function() {
                        deferred.reject();
                    }, function() {
                        deferred.resolve();
                    }, function() {
                        // notify, do nothing
                    });

                return deferred.promise;
            };
            this.requireNoSessionOrBack = function() {
                var deferred = $q.defer();

                requireSession().then(function() {
                    deferred.reject();
                    StateHistoryService.goBack();
                }, function() {
                    deferred.resolve();
                }, function() {
                    // notice, do nothing
                });

                return deferred.promise;
            }
        }
    ]);
