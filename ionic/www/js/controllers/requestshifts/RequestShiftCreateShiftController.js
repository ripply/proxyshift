"use strict";
angular.module('scheduling-app.controllers')
    .controller('RequestShiftCreateShiftController', [
        '$scope',
        '$stateParams',
        '$controller',
        'UserInfoService',
        'GENERAL_EVENTS',
        function($scope,
                 $stateParams,
                 $controller,
                 UserInfoService,
                 GENERAL_EVENTS
        ) {
            $controller('BaseModelController', {$scope: $scope});

            $scope.timePickerObject = {
                inputEpochTime: ((new Date()).getHours() * 60 * 60),  //Optional
                step: 15,  //Optional
                format: 12,  //Optional
                titleLabel: '12-hour Format',  //Optional
                setLabel: 'Set',  //Optional
                closeLabel: 'Close',  //Optional
                setButtonType: 'button-positive',  //Optional
                closeButtonType: 'button-stable',  //Optional
                callback: function (val) {    //Mandatory
                    timePickerCallback(val);
                }
            };

            function timePickerCallback(val) {
                if (typeof (val) === 'undefined') {
                    console.log('Time not selected');
                } else {
                    var selectedTime = new Date(val * 1000);
                    console.log('Selected epoch is : ', val, 'and the time is ', selectedTime.getUTCHours(), ':', selectedTime.getUTCMinutes(), 'in UTC');
                }
            }

            $scope.datepickerObject = {
                titleLabel: 'Title',  //Optional
                todayLabel: 'Today',  //Optional
                closeLabel: 'Close',  //Optional
                setLabel: 'Set',  //Optional
                setButtonType : 'button-assertive',  //Optional
                todayButtonType : 'button-assertive',  //Optional
                closeButtonType : 'button-assertive',  //Optional
                inputDate: new Date(),    //Optional
                mondayFirst: true,    //Optional
                //disabledDates: disabledDates, //Optional
                //weekDaysList: weekDaysList,   //Optional
                //monthList: monthList, //Optional
                templateType: 'popup', //Optional
                showTodayButton: 'true', //Optional
                modalHeaderColor: 'bar-positive', //Optional
                modalFooterColor: 'bar-positive', //Optional
                from: new Date(2012, 8, 2),   //Optional
                to: new Date(2018, 8, 25),    //Optional
                callback: function (val) {    //Mandatory
                    datePickerCallback(val);
                }
            };

            var datePickerCallback = function (val) {
                if (typeof(val) === 'undefined') {
                    console.log('No date selected');
                } else {
                    console.log('Selected date is : ', val)
                }
            };

            $scope.beforeEnter = function() {
                init();
            };

            $scope.$on(GENERAL_EVENTS.UPDATES.USERINFO.PROCESSED, function(env, userinfo) {
                init();
            });

            function init() {
                $scope.location_id = $stateParams.location_id;
                $scope.sublocation_id = $stateParams.sublocation_id;
                if ($scope.location_id) {
                    $scope.location = UserInfoService.getLocation($scope.location_id);
                    $scope.sublocation = undefined;
                }
                if ($scope.sublocation_id) {
                    $scope.sublocation = UserInfoService.getSublocation($scope.sublocation_id);
                    if ($scope.sublocation) {
                        $scope.location = UserInfoService.getLocationForSublocation($scope.sublocation_id);
                        $scope.location_id = $scope.location.id;
                    } else {
                        $scope.location = undefined;
                        $scope.location_id = undefined;
                    }
                }
            }
        }
    ]);
