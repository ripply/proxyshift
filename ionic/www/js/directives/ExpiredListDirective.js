angular.module('scheduling-app.directives')
    .directive('expiredList', function() {
        return ({
            controller: 'ExpiredListDirectiveController',
            link: link,
            restrict: 'E',
            templateUrl: 'templates/expired/_expired.html',
            scope: {
                model: '=model',
                method: '=method'
            }
        });

        function link(scope, element, attributes) {
            scope.model = attributes.model;
            scope.method = attributes.method;
            scope.enter();
        }
    }
);
