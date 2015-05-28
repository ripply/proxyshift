/**
 * AuthenticationService
 */
angular.module('scheduling-app.authentication', [
    'http-auth-interceptor',
    'scheduling-app.config'
])
    .factory('AuthenticationService', [
        '$rootScope',
        '$http',
        'authService',
        'GENERAL_CONFIG',
        function($rootScope, $http, authService, GENERAL_CONFIG) {
            return {
                login: function(user) {
                    if (user.username === null || user.username == '') {
                        $rootScope.$broadcast('event:auth-login-failed-invalid', 'Empty username');
                        return false;
                    }
                    else if (user.password === null || user.password == '') {
                        $rootScope.$broadcast('event:auth-login-failed-invalid', 'Empty password');
                        return false;
                    }
                    var login_url = GENERAL_CONFIG.API_BASE_URL + GENERAL_CONFIG.API_URL_LOGIN;
                    $http.post(login_url, user, { ignoreAuthModule: true })
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
                            $rootScope.$broadcast('event:auth-login-failed', status);
                        });
                }
            };
    }])
;