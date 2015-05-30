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
    'ngCookies'
])
    .service('SessionService', [
        '$http',
        '$cookies',
        'GENERAL_CONFIG',
        function($http, $cookies, GENERAL_CONFIG) {
            var accessedRestrictedResource = false;
            var accessedRestrictedResourceExpires = null;
            var retryResourceIn = GENERAL_CONFIG.SESSION_RETRY_ACCESSED_RESOURCE_IN;

            function setAuthenticated(authenticated) {
                accessedRestrictedResource = authenticated;
                accessedRestrictedResourceExpires = moment().add(retryResourceIn.value, retryResourceIn.interval);
            }

            function isAuthenticated() {
                return (accessedRestrictedResource && moment() < accessedRestrictedResourceExpires);
            }

            this.checkAuthenticated = function() {
                var rememberme_token;
                // check if the remember me token exists
                if (angular.version.major === 1 &&
                        angular.version.minor <= 3) {
                    // Angular below 1.4 uses a different api
                    // Ionic 1.0 uses the old interface
                    rememberme_token = $cookies[GENERAL_CONFIG.APP_REMEMBER_ME_TOKEN];
                    } else {
                    // Angular 1.4 broke 1.3 $cookies interface
                    rememberme_token = $cookies.get(GENERAL_CONFIG.APP_REMEMBER_ME_TOKEN);
                }
                var authenticated = false;

                if (rememberme_token === null ||
                    rememberme_token === undefined) {
                    // remember me token was not found
                        // query the server to see if the session is still open
                    var api_url = GENERAL_CONFIG.APP_URL + GENERAL_CONFIG.APP_URL_API;

                    if (isAuthenticated()) {
                        authenticated = true;
                    } else {
                        authenticated = $http.get(api_url + "/session", {ignoreAuthModule: true})
                            .success(function (data, status, headers, config) {
                                // successfully accessed a restriced resource
                                // we are already logged in
                                setAuthenticated(true);
                                return true;
                            })
                            .error(function (data, status, headers, config) {
                                // failed to access a protected resource
                                // TODO: Handle connection timeouts here
                                return false;
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
                    authenticated = true;
                }
                return authenticated;
            }
        }
]);