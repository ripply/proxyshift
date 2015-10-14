"use strict";
angular.module('scheduling-app.controllers')
    .controller('RequestShiftSelectLocationController', [
        '$scope',
        '$controller',
        'UserInfoService',
        'GENERAL_EVENTS',
        function($scope,
                 $controller,
                 UserInfoService,
                 GENERAL_EVENTS
        ) {
            $scope.groups = UserInfoService.getGroupList();
            $scope.locations = UserInfoService.getLocationList();

            init();

            $scope.$on(GENERAL_EVENTS.UPDATES.USERINFO.PROCESSED, function(env, userinfo) {
                init();
            });

            function init() {

            }

        }
    ]);
