angular.module('scheduling-app.cookies', [])
    .service('CookiesService', [
        '$cookies',
        function($cookies) {
            this.getCookie = function(name) {
                if (angular.version.major === 1 &&
                    angular.version.minor <= 3) {
                    // Angular below 1.4 uses a different api
                    // Ionic 1.0 uses the old interface
                    return $cookies[name];
                } else {
                    // Angular 1.4 broke 1.3 $cookies interface
                    return $cookies.get(name);
                }
            };

            this.setCookie = function(name, value) {
                if (angular.version.major === 1 &&
                    angular.version.minor <= 3) {
                    $cookies[name] = value;
                } else {
                    $cookies.set(name, value);
                }
            };
        }
    ]);