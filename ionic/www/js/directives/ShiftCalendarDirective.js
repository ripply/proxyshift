console.log("LoginDirective js file loaded?");
angular.module('scheduling-app.directives')
    .directive('shiftCalendar',
    function() {
        return ({
            controller: 'ShiftCalendarController',
            link: link,
            restrict: 'E',
            templateUrl: 'templates/_shiftcalendar.html'
        });

        function link(scope, element, attributes) {
            scope.attributes = attributes;
        }
    }
);
