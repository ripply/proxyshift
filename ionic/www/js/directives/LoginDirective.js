console.log("LoginDirective js file loaded?");
angular.module('scheduling-app.directives')
    .directive('loginPartial',
    function() {
        console.log('LoginPartial called');
        return ({
            controller: 'LoginController',
            link: link,
            restrict: 'A',
            templateUrl: 'templates/_login.html'
        });

        function link(scope, element, attributes) {
            console.log("Link called");
        }
    }
);