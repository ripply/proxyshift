"use strict";
angular.module('scheduling-app.controllers')
    .controller('RequestShiftSelectLocationController', [
        '$scope',
        'UserInfoService',
        'GENERAL_EVENTS',
        function($scope,
                 UserInfoService,
                 GENERAL_EVENTS
        ) {
            $scope.groups = UserInfoService.getGroupList();
            $scope.locations = UserInfoService.getLocationList();
        }
    ]);
