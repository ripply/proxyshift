"use strict";
angular.module('scheduling-app.controllers')
    .controller('RequestShiftCreateShiftController', [
        '$scope',
        '$stateParams',
        'UserInfoService',
        'GENERAL_EVENTS',
        function($scope,
                 $stateParams,
                 UserInfoService,
                 GENERAL_EVENTS
        ) {
            console.log($stateParams.location_id);
            $scope.location_id = $stateParams.location_id;
            $scope.location = UserInfoService.getLocation($scope.location_id);
        }
    ]);
