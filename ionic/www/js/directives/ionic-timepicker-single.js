(function () {
    'use strict';

    angular.module('ionic-timepicker')
        .directive('ionicTimepickerSingle', ionicTimepickerSingle);

    function ionicTimepickerSingle() {
        return {
            restrict: 'AE',
            replace: true,
            templateUrl: 'js/directives/ionic-timepicker-single.html',
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
