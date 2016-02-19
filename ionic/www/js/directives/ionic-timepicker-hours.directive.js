//By Rajeshwar Patlolla
//https://github.com/rajeshwarpatlolla

(function () {
    'use strict';

    angular.module('ionic-timepicker')
        .directive('ionicTimepickerHoursEmbed', ionicTimepicker);

    function ionicTimepicker() {
        return {
            restrict: 'AE',
            replace: true,
            templateUrl: 'js/directives/ionic-timepicker-hours.html',
            scope: {
                inputObj: "=inputObj"
            },
            link: function (scope, element, attrs) {

                var today = new Date();
                var currentEpoch = ((new Date()).getHours() * 60 * 60) + ((new Date()).getMinutes() * 60);

                //set up base variables and options for customization
                scope.inputEpochTime = scope.inputObj.inputEpochTime ? scope.inputObj.inputEpochTime : currentEpoch;
                scope.step = scope.inputObj.step ? scope.inputObj.step : 15;
                //scope.format = scope.inputObj.format ? scope.inputObj.format : 24;
                scope.format = scope.inputObj.format ? scope.inputObj.format : 12;
                scope.titleLabel = scope.inputObj.titleLabel ? scope.inputObj.titleLabel : 'Time Picker';
                scope.setLabel = scope.inputObj.setLabel ? scope.inputObj.setLabel : 'Set';
                scope.closeLabel = scope.inputObj.closeLabel ? scope.inputObj.closeLabel : 'Close';
                scope.setButtonType = scope.inputObj.setButtonType ? scope.inputObj.setButtonType : 'button-positive';
                scope.closeButtonType = scope.inputObj.closeButtonType ? scope.inputObj.closeButtonType : 'button-stable';

                var obj = {epochTime: scope.inputEpochTime, step: scope.step, format: scope.format};
                scope.time = {hours: 0, minutes: 0, meridian: ""};
                var objDate = new Date(obj.epochTime * 1000);       // Epoch time in milliseconds.

                //Increasing the hours
                scope.increaseHours = function () {
                    scope.time.hours = Number(scope.time.hours);

                    scope.time.hours = (scope.time.hours + 1);

                    scope.time.hours = (scope.time.hours < 10) ? ('0' + scope.time.hours) : scope.time.hours;
                    updateETime();
                };

                //Decreasing the hours
                scope.decreaseHours = function () {
                    scope.time.hours = Number(scope.time.hours);
                    if (scope.time.hours > 1) {
                        scope.time.hours -= 1;
                    } else {
                        scope.time.hours = 0;
                    }
                    scope.time.hours = (scope.time.hours < 10) ? ('0' + scope.time.hours) : scope.time.hours;
                    updateETime();
                };

                //Increasing the minutes
                scope.increaseMinutes = function () {
                    scope.time.minutes = Number(scope.time.minutes);
                    scope.time.minutes = (scope.time.minutes + obj.step) % 60;
                    scope.time.minutes = (scope.time.minutes < 10) ? ('0' + scope.time.minutes) : scope.time.minutes;
                    updateETime();
                };

                //Decreasing the minutes
                scope.decreaseMinutes = function () {
                    scope.time.minutes = Number(scope.time.minutes);
                    scope.time.minutes = (scope.time.minutes + (60 - obj.step)) % 60;
                    scope.time.minutes = (scope.time.minutes < 10) ? ('0' + scope.time.minutes) : scope.time.minutes;
                    updateETime();
                };

                if (typeof scope.inputObj.inputEpochTime === 'undefined' || scope.inputObj.inputEpochTime === null) {
                    objDate = new Date();
                } else {
                    objDate = new Date(scope.inputObj.inputEpochTime * 1000);
                }

                scope.time.hours = (objDate.getUTCHours() > 12) ? ((objDate.getUTCHours() - 12)) : (objDate.getUTCHours());
                scope.time.minutes = (objDate.getUTCMinutes());

                scope.time.hours = (scope.time.hours < 10) ? ("0" + scope.time.hours) : (scope.time.hours);
                scope.time.minutes = (scope.time.minutes < 10) ? ("0" + scope.time.minutes) : (scope.time.minutes);

                function updateETime() {
                    var totalSec = 0;

                    if (scope.time.hours != 12) {
                        totalSec = (scope.time.hours * 60 * 60) + (scope.time.minutes * 60);
                    } else {
                        totalSec = scope.time.minutes * 60;
                    }

                    scope.etime = totalSec;
                }

            }
        };
    }

})();
