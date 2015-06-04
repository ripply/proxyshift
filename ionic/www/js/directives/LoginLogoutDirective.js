angular.module('scheduling-app.directives')
    .directive('loginLogoutButton', [
        '$rootScope',
        'GENERAL_EVENTS',
        function($rootScope,
                 GENERAL_EVENTS
        ) {
            return ({
                controller: 'LoginLogoutController',
                link: link,
                restrict: 'A',
                templateUrl: 'partials/loginLogoutButton.html'
            });

            function link(scope, element, attributes) {
                console.log("Link called");
            }
        }]
);