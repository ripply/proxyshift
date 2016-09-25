angular.module('scheduling-app.authentication.csrf', [])
    .factory('CsrfFailureInterceptorService', ['$q', '$injector', function($q, $injector) {
        return {
            'request': function(config) {
                return config;
            },
            'response': function(response) {
                if (response.config.obtainingCsrf) {
                    var csrfToken = response.headers().xcsrftoken;
                    if (csrfToken !== undefined) {
                        // got a token!

                    }
                }
                return response;
            },
            'responseError': function(response) {
                var $http = $injector.get('$http');
                var config = response.config;
                if ('remainingAttempts' in config) {
                    if (config['remainingAttempts'] <= 0) {
                        return $q.reject(response);
                    }
                } else {
                    config['remainingAttempts'] = 10;
                }
                switch (response.status) {
                    case 403:
                        // CSRF failure
                        // we need to query the server for a csrf token and retry
                        // this is at /csrf
                        if (!config['obtainingCsrf']) {
                            return $http.get("http://localhost:8100/csrf", {obtainingCsrf: true})
                                .success(function (data, status, headers, config) {
                                    // now retry original request now that we have csrf
                                    // TODO: Validate that CSRF cookie was returned in response
                                    response.config['remainingAttempts'] = response.config['remainingAttempts'] - 1;
                                    second_response = $http(response.config)
                                        .success(function (data, status, headers, config) {
                                            // successfully made call!
                                            // do nothing
                                        })
                                        .error(function (data, status, headers, config) {
                                            // this means failure
                                            // interceptor service will handle reattempts
                                            // so we need to forward error
                                            config.failed = true
                                        });
                                    // I think this should work correctly...
                                    // if .success() return value is returned from $http then
                                    // this can be simplified
                                    if (second_response.failed) {
                                        return $q.reject(response);
                                    } else {
                                        return second_response;
                                    }
                                })
                                .error(function (data, status, headers, config) {
                                    // failed multiple times
                                    return $q.reject(response);
                                });
                        }
                }
                // TODO: Retry request again
                return $q.reject(response);
            }
        }
    }])
    .config(['$httpProvider', function($httpProvider) {
        $httpProvider.interceptors.push('CsrfFailureInterceptorService');
    }]);
