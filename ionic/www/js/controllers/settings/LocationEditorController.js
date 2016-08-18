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

            var locationProperties = [
                'title',
                'address',
                'state',
                'city',
                'zipcode',
                'phonenumber'
            ];

            $scope.location = {};
            resetLocation();

            $scope.timezones = [
                {
                    name: 'US/Pacific',
                    description: 'Pacific'
                },
                {
                    name: 'US/Mountain',
                    description: 'Mountain'
                },
                {
                    name: 'US/Central',
                    description: 'Central'
                },
                {
                    name: 'US/Eastern',
                    description: 'Eastern'
                },
            ];
            /*
            angular.forEach(moment.tz.names(), function(timezone) {
                $scope.timezones.push({description: timezone});
            });
            */

            $scope.timezoneSelected = function(value) {
                $scope.location.timezone = value;
            };

            function resetLocation() {
                angular.forEach(locationProperties, function(property) {
                    $scope.location[property] = null;
                })
            }

            function init() {
                $scope.group_id = getGroupId();
                $scope.location_id = getLocationId();
                $scope.sublocation_id = getSublocationId();
                resetLocation();
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

            $scope.createLocation = function createLocation() {
                if ($scope.saving) {
                    return;
                }
                $scope.saving = true;
                $scope.message = '';
                ResourceService.createLocation(
                    getGroupId(),
                    $scope.location.timezone,
                    $scope.location.title,
                    $scope.location.state,
                    $scope.location.city,
                    $scope.location.address,
                    $scope.location.zipcode,
                    $scope.location.phonenumber,
                    function createLocationSuccess(response) {
                        console.log(response);
                        $scope.message = 'Success';
                        $scope.saving = false;
                    },
                    function createLocationError(response) {
                        console.log(response);
                        if (response.data.data && response.data.error && response.data.data.message) {
                            $scope.message = response.data.data.message;
                        }
                        $scope.saving = false;
                    }
                );
            };

            //$scope.createLocation = ResourceService.createLocation;
            $scope.editLocation = ResourceService.editLocation;
            $scope.deleteLocation = ResourceService.deleteLocation;

            $scope.createSublocation = ResourceService.createSublocation;
            $scope.editSublocation = ResourceService.editSublocation;
            $scope.deleteSublocation = ResourceService.deleteSublocation;
        }]);
