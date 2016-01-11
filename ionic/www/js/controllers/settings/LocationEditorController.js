"use strict";

angular.module('scheduling-app.controllers')
    .controller('LocationEditorController', [
        '$rootScope',
        '$scope',
        '$controller',
        '$stateParams',
        'ResourceService',
        function($rootScope,
                 $scope,
                 $controller,
                 $stateParams,
                 ResourceService
        ) {
            $controller('BaseModelController', {$scope: $scope});

            $scope.stateParams = $stateParams;
            $scope.beforeEnter = init;

            function init() {
                $scope.group_id = getGroupId();
                $scope.location_id = getLocationId();
                $scope.location = {};
                if ($scope.location_id !== null &&
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
        }]);
