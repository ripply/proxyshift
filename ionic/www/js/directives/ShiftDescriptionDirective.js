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
                if ($scope.toggle == 'true') {
                    $document.bind('click', function (event) {
                        if (scope.show) {
                            var isClickedElementChildOfPopup = element
                                    .find(event.target)
                                    .length > 0;

                            if (isClickedElementChildOfPopup)
                                return;

                            $rootScope.$emit('events:shift:description:hide', $scope.name);
                            $rootScope.$apply();
                        }
                    });
                }
            }
        }
    ]
);
