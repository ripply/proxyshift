angular.module('scheduling-app.directives')
    .directive('shiftDescription', [
        '$rootScope',
        '$document',
        '$window',
        function(
            $rootScope,
            $document,
            $window
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
                $window.addEventListener('resize', function(event) {
                    if (scope.show) {
                        scope.show = false;
                        scope.showAndResize(false, scope.shift, scope.name);
                    }
                });
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
