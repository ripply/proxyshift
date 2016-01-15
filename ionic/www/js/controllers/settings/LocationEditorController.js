"use strict";

angular.module('scheduling-app.controllers')
    .controller('LocationEditorController', [
        '$rootScope',
        '$scope',
        '$controller',
        '$stateParams',
        'UserInfoService',
        'ResourceService',
        function($rootScope,
                 $scope,
                 $controller,
                 $stateParams,
                 UserInfoService,
                 ResourceService
        ) {
            $controller('BaseModelController', {$scope: $scope});

            $scope.stateParams = $stateParams;
            $scope.beforeEnter = init;

            function init() {
                $scope.group_id = getGroupId();
                $scope.location_id = getLocationId();
                $scope.sublocation_id = getSublocationId();
                $scope.location = {};
                if ($scope.sublocation_id) {
                    $scope.sublocation = angular.copy(UserInfoService.getSublocation($scope.sublocation_id));
                } else if ($scope.location_id !== null &&
                    $scope.location_id !== undefined) {
                    getLocation(function(result) {
                        console.log(result);
                    }, function(response) {
                    });
                }
            }

            function getGroupId() {
                return $stateParams.group_id;
            }

            function getLocationId() {
                return $stateParams.location_id;
            }

            function getSublocationId() {
                return $stateParams.sublocation_id;
            }

            function getLocation(success, error) {
                ResourceService.getLocation($scope.group_id, $scope.location_id, function getLocationSuccess(result) {
                    $scope.location = angular.copy (result);
                    if (success) {
                        success(result);
                    }
                }, function getLocationError(response) {
                    if (error) {
                        error(response);
                    }
                })
            }

            $scope.createLocation = ResourceService.createLocation;
            $scope.editLocation = ResourceService.editLocation;
            $scope.deleteLocation = ResourceService.deleteLocation;

            $scope.createSublocation = ResourceService.createSublocation;
            $scope.editSublocation = ResourceService.editSublocation;
            $scope.deleteSublocation = ResourceService.deleteSublocation;
        }]);
