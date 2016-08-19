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
                'timezone',
                'phonenumber'
            ];

            $scope.location = {};
            $scope.sublocation = {};
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
                }
            ];

            function setupAllTimezones() {
                $scope.timezones = [];
                var names = moment.tz.names();
                for (var i = 0; i < names.length; i++) {
                    $scope.timezones.push({
                        name: names[i],
                        description: names[i]
                    });
                }
            }

            $scope.timezoneSelected = function(value) {
                $scope.location.timezone.name = value;
            };

            function resetLocation() {
                angular.forEach(locationProperties, function(property) {
                    $scope.location[property] = null;
                });
                $scope.location.timezone = {
                    id: null,
                    name: null
                };
                $scope.sublocation.title = null;
                $scope.sublocation.description = null;
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
                    var timezone = $scope.location.timezone.name;
                    var timezoneExists = false;
                    for (var i = 0; i < $scope.timezones.length; i++) {
                        if ($scope.timezones[i].name == timezone) {
                            timezoneExists = true;
                            break;
                        }
                    }
                    if (!timezoneExists) {
                        setupAllTimezones();
                    }
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
                    $scope.location.timezone.name,
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

            $scope.editLocation = function editLocation() {
                if ($scope.saving) {
                    return;
                }
                $scope.saving = true;
                $scope.message = '';
                ResourceService.editLocation(
                    getGroupId(),
                    getLocationId(),
                    $scope.location.timezone.name,
                    $scope.location.title,
                    $scope.location.state,
                    $scope.location.city,
                    $scope.location.address,
                    $scope.location.zipcode,
                    $scope.location.phonenumber,
                    function editLocationSuccess(response) {
                        console.log(response);
                        $scope.message = 'Success';
                        $scope.saving = false;
                    },
                    function editLocationError(response) {
                        console.log(response);
                        if (response.data.data && response.data.error && response.data.data.message) {
                            $scope.message = response.data.data.message;
                        }
                        $scope.saving = false;
                    }
                );
            };

            $scope.createSublocation = function createSublocation() {
                if ($scope.saving) {
                    return;
                }
                $scope.saving = true;
                $scope.message = '';
                console.log("Creating sublocation under '" + getLocationId() + "'");
                ResourceService.createSublocation(
                    getLocationId(),
                    $scope.sublocation.title,
                    $scope.sublocation.description,
                    function createSublocationSuccess(response) {
                        console.log(response);
                        $scope.message = 'Success';
                        $scope.saving = false;
                    },
                    function createSublocationError(response) {
                        console.log(response);
                        if (response.data.data && response.data.error && response.data.data.message) {
                            $scope.message = response.data.data.message;
                        }
                        $scope.saving = false;
                    }
                );
            };

            $scope.editSublocation = function editSublocation() {
                if ($scope.saving) {
                    return;
                }
                $scope.saving = true;
                $scope.message = '';
                ResourceService.editSublocation(
                    getLocationId(),
                    getSublocationId(),
                    $scope.sublocation.title,
                    $scope.sublocation.description,
                    function editSublocationSuccess(response) {
                        console.log(response);
                        $scope.message = 'Success';
                        $scope.saving = false;
                    },
                    function editSublocationError(response) {
                        console.log(response);
                        if (response.data.data && response.data.error && response.data.data.message) {
                            $scope.message = response.data.data.message;
                        }
                        $scope.saving = false;
                    }
                );
            };

            //$scope.createLocation = ResourceService.createLocation;
            //$scope.editLocation = ResourceService.editLocation;
            $scope.deleteLocation = ResourceService.deleteLocation;

            //$scope.createSublocation = ResourceService.createSublocation;
            //$scope.editSublocation = ResourceService.editSublocation;
            $scope.deleteSublocation = ResourceService.deleteSublocation;
        }]);
