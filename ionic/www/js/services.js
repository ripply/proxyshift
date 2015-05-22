angular.module('myApp')

    .provider('myCSRF',[function(){
        var headerName = 'X-CSRFToken';
        var cookieName = 'csrftoken';
        var allowedMethods = ['GET', 'POST', 'PUT', 'DELETE'];

        this.setHeaderName = function(n) {
            headerName = n;
        };
        this.setCookieName = function(n) {
            cookieName = n;
        };
        this.setAllowedMethods = function(n) {
            allowedMethods = n;
        };
        this.setCookie = ['$cookies', function($cookies){
            return {
                'request': function(config) {
                    if(allowedMethods.indexOf(config.method) === -1) {
                        // do something on success
                        config.headers[headerName] = $cookies[cookieName];
                    }
                    return config;
                }
            }
        }];

        this.$get = this.setCookie;
        this.$put = this.setCookie;
        this.$delete = this.setCookie;
        this.$post = this.setCookie;

        // Setup jQuery CSRF token sending
        $.ajaxSetup({
            beforeSend: function(xhr, settings) {
                if (settings.type == 'POST' ||
                    settings.type == 'PUT' ||
                    settings.type == 'PATCH' ||
                    settings.type == 'DELETE') {
                    if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
                        // Only send the token to relative URLs i.e. locally.
                        xhr.setRequestHeader("x-csrf-token", $.cookie('csrftoken'));
                    }
                }
            }
        });

    }]).config(function($httpProvider) {
        $httpProvider.interceptors.push('myCSRF');
    });

angular.
    module('mySession', []).
    factory('schedulingAppSession', ['$window', function(win) {


        var session = {};

        return function(msg) {
            msgs.push(msg);
            if (msgs.length == 3) {
                win.alert(msgs.join("\n"));
                msgs = [];
            }
        };
    }]);
