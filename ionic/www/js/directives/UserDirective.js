angular.module('scheduling-app.directives')
    .directive('userPartial',
    function() {
        return ({
            controller: 'BaseModelController',
            link: link,
            restrict: 'A',
            templateUrl: 'templates/_user.html'
        });

        function link(scope, element, attributes) {
            scope.register('UsersModel', null);
            scope.fetch();
        }
    });
