console.log("LoginDirective js file loaded?");
angular.module('scheduling-app.directives')
    .directive('shiftCalendar', [
        '$rootScope',
        '$document',
        function(
            $rootScope,
            $document
        ) {
            return ({
                controller: 'ShiftCalendarController',
                link: link,
                restrict: 'E',
                templateUrl: 'templates/_shiftcalendar.html'
            });

            function link(scope, element, attributes) {
                scope.name = attributes.name;
                scope.show = attributes.show;
                scope.clickable = attributes.clickable;
                scope.attributes = attributes;

                if (attributes['toggle'] == 'true') {
                    $document.bind('click', function (event) {
                        if (scope.show) {
                            var isClickedElementChildOfPopup = element
                                    .find(event.target)
                                    .length > 0;

                            if (isClickedElementChildOfPopup)
                                return;

                            $rootScope.$emit('events:calendar:hide');
                            //$scope.isPopupVisible = false;
                            $rootScope.$apply();
                        }
                    });
                }
            }
        }
    ]
);
