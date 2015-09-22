angular.module('scheduling-app.cookies', ['ngCookies'])
    .service('CookiesService', [
        '$cookieStore',
        function($cookieStore) {
            this.getCookie = function(name) {
                if (angular.version.major === 1 &&
                    angular.version.minor <= 3) {
                    // Angular below 1.4 uses a different api
                    // Ionic 1.0 uses the old interface
                    return $cookieStore[name];
                } else {
                    // Angular 1.4 broke 1.3 $cookies interface
                    return $cookieStore.get(name);
                }
            };

            this.setCookie = function(name, value) {
                if (angular.version.major === 1 &&
                    angular.version.minor <= 3) {
                    $cookieStore[name] = value;
                } else {
                    $cookieStore.set(name, value);
                }
            };
        }
    ]);
