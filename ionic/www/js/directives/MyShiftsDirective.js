angular.module('scheduling-app.directives')
    .directive('myShifts', function() {
        return ({
            controller: 'MyShiftsDirectiveController',
            link: link,
            restrict: 'E',
            templateUrl: 'templates/_shiftlist.html',
            scope: {
                dismissable: '=dismissable',
                cancelable: '=cancelable'
            }
        });

        function link(scope, element, attributes) {
        }
    }
);
