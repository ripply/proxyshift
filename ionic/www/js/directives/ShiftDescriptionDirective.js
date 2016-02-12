angular.module('scheduling-app.directives')
    .directive('shiftDescription', [
        '$rootScope',
        '$document',
        function(
            $rootScope,
            $document
        ) {
            return ({
                controller: 'ShiftDescriptionController',
                link: link,
                restrict: 'E',
                templateUrl: 'templates/_shiftdescription.html',
                scope: {
                    toggle: '=toggle',
                    name: '=name'
                }
            });

            function link(scope, element, attributes) {
                $document.bind('click', function (event) {
                    if (scope.show && !scope.waiting) {
                        var isClickedElementChildOfPopup = element
                                .find(event.target)
                                .length > 0;

                        if (isClickedElementChildOfPopup)
                            return;

                        event.stopPropagation();
                        scope.$apply(function() {
                            scope.show = false;
                        });
                    }
                });
            }
        }
    ]
);
