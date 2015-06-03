angular.module('scheduling-app.directives')
    .directive('loginLogoutButton',
    function() {
        console.log("Loginlogoutbutton partial");
        return ({
            controller: 'LoginLogoutController',
            link: link,
            restrict: 'A',
            templateUrl: 'partials/loginLogoutButton.html'
        });

        function link(scope, element, attributes) {
            console.log("Link called");
        }
    }
);