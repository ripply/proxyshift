(function () {
    'use strict';

    angular.module('scheduling-app.directives')
        .directive('locationSearch', locationSearch);

    function locationSearch() {
        return {
            restrict: 'AE',
            controller: 'LocationSearchController',
            replace: true,
            templateUrl: 'js/directives/loation-search.html',
            scope: {
                inputObj: "=inputObj"
            },
            link: function (scope, element, attrs) {

                if (scope.inputObj.counter !== undefined) {
                    scope.inputObj.counter = 0;
                }

                scope.increment = function () {
                    scope.inputObj.counter += 1;
                };

                scope.decrement = function () {
                    scope.inputObj.counter -= 1;
                }

            }
        };
    }

})();
