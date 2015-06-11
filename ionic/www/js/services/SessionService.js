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
    'ngCookies',
    'scheduling-app.services.routing.statehistory'
])
    .service('SessionService', [
        '$q',
        '$http',
        '$rootScope',
        'CookiesService',
        'GENERAL_CONFIG',
        'GENERAL_EVENTS',
        function($q,
                 $http,
                 $rootScope,
                 CookiesService,
                 GENERAL_CONFIG,
                 GENERAL_EVENTS) {
            var accessedRestrictedResource = false;
            var accessedRestrictedResourceExpires = null;
            var retryResourceIn = GENERAL_CONFIG.SESSION_RETRY_ACCESSED_RESOURCE_IN;
            var failedLogin = false;

            function setAuthenticated(authenticated) {
                accessedRestrictedResource = authenticated;
                if (authenticated !== true) {
                    // only update expiration if authenticated
                    accessedRestrictedResourceExpires = moment().add(retryResourceIn.value, retryResourceIn.interval);
                }
            }

            function isAuthenticated() {
                return (accessedRestrictedResource && moment() < accessedRestrictedResourceExpires);
            }

            function fireAuthenticaionRequiredEvent() {
                setAuthenticated(false);
                $rootScope.$broadcast(GENERAL_EVENTS.AUTHENTICATION.REQUIRED);
            }

            function fireAuthenticationConfirmedEvent() {
                setAuthenticated(true);
                $rootScope.$broadcast(GENERAL_EVENTS.AUTHENTICATION.CONFIRMED);
            }

            $rootScope.$on(GENERAL_EVENTS.AUTHENTICATION.CONFIRMED, function() {
                failedLogin = false;
            });

            var checkingAuthenticationPromise = false;

            function resolve(deferred, value) {
                checkingAuthenticationPromise = false;
                console.log("checkAuthentication returning TRUE");
                deferred.resolve(value);
            }

            function reject(deferred, value) {
                checkingAuthenticationPromise = false;
                console.log("checkAuthentication returning FALSE");
                deferred.reject(value);
            }

            this.checkAuthentication = function() {
                var deferred;
                if (checkingAuthenticationPromise !== false) {
                    // blocking wait for auth to finish
                    return checkingAuthenticationPromise;
                } else {
                    deferred = $q.defer();
                    checkingAuthenticationPromise = deferred.promise;
                }

                var rememberme_token = CookiesService.getCookie(GENERAL_CONFIG.APP_REMEMBER_ME_TOKEN);

                if (rememberme_token === null ||
                    rememberme_token === undefined) {
                    // remember me token was not found
                    // query the server to see if the session is still open
                    var api_url = GENERAL_CONFIG.APP_URL;

                    if (isAuthenticated()) {
                        console.debug("Already logged in.");
                        resolve(deferred);
                    } else if (failedLogin) {
                        reject(deferred);
                    } else {
                        $http.get(api_url + "/session", {
                            ignoreAuthModule: true,
                            timeout: GENERAL_CONFIG.LOGIN_TIMEOUT
                        })
                            .success(function (data, status, headers, config) {
                                // successfully accessed a restriced resource
                                // we are already logged in
                                console.debug("Able to access protected resource, logged in.");
                                fireAuthenticationConfirmedEvent();
                                resolve(deferred);
                            })
                            .error(function (data, status, headers, config) {
                                // failed to access a protected resource
                                // TODO: Handle connection timeouts here
                                console.debug("Failed to access protected resource, not logged in");
                                // set flag that forces this method to return false
                                // until the user is logged in
                                failedLogin = true;
                                fireAuthenticaionRequiredEvent();
                                reject(deferred);
                            });
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
            };
        }
    ])
    .factory("RequireSession", [
        'SessionService',
        function(SessionService) {
            // returns a promise
            return SessionService.checkAuthentication();
        }
    ])
    .factory("RequireSessionOrBack", [
        '$q',
        'RequireSession',
        'StateHistoryService',
        function($q,
                 RequireSession,
                 StateHistoryService) {
            var deferred = $q.defer();

            RequireSession.then(function() {
                deferred.resolve();
            }, function() {
                deferred.reject();
                StateHistoryService.goBack();
            }, function() {
                // notice, do nothing
            });

            return deferred.promise;
        }
    ])
    .factory("RequireSessionOrGoLogin", [
        '$q',
        '$state',
        'RequireSession',
        'STATES',
        function($q,
                 $state,
                 RequireSession,
                 STATES) {
            var deferred = $q.defer();

            RequireSession.then(function() {
                deferred.resolve();
            }, function() {
                deferred.reject();
                $state.go(STATES.LOGIN)
            });

            return deferred.promise;
        }
    ])
    .factory("RequireNoSession", [
        '$q',
        'SessionService',
        function($q,
                 SessionService) {
            var deferred = $q.defer();

            SessionService.checkAuthentication()
                .then(function() {
                    deferred.reject();
                }, function() {
                    deferred.resolve();
                }, function() {
                    // notify, do nothing
                });

            return deferred.promise;
        }
    ])
    .factory("RequireNoSessionOrBack", [
        '$q',
        'RequireNoSession',
        'StateHistoryService',
        function($q,
                 RequireSession,
                 StateHistoryService) {
            var deferred = $q.defer();

            RequireSession.then(function() {
                deferred.resolve();
            }, function() {
                deferred.reject();
                StateHistoryService.goBack();
            }, function() {
                // notice, do nothing
            });

            return deferred.promise;
        }
    ]);