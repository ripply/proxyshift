/**
 * UserLocationsController
 */
angular.module('scheduling-app.controllers')
    .controller('UserLocationsController', [
        '$scope',
        '$rootScope',
        '$controller',
        '$stateParams',
        'GroupsModel',
        'LocationsModel',
        'UserInfoService',
        'StateHistoryService',
        'GENERAL_EVENTS',
        'STATES',
        function($scope,
                 $rootScope,
                 $controller,
                 $stateParams,
                 GroupsModel,
                 LocationsModel,
                 UserInfoService,
                 StateHistoryService,
                 GENERAL_EVENTS,
                 STATES) {
            $controller('BaseModelController', {$scope: $scope});

            $scope.getGroupId = getGroupId;

            function getGroupId() {
                return $stateParams.group_id;
            }

            var latestLocations;

            function getSubscribed(location) {
                console.log('190-823740-912830-489');
                console.log(location);
                if (location.userpermissions &&
                    location.userpermissions instanceof Array &&
                    location.userpermissions.length > 0) {
                    var userpermission = location.userpermissions[0];
                    return userpermission.subscribed == 1;
                } else {
                    return false;
                }
            }

            $scope.fetchLocations = function fetchLocations() {
                GroupsModel.locations({
                    group_id: getGroupId()
                }, function fetchGroupLocations(result) {
                    angular.forEach(result, function(location) {
                        location.subscribed = getSubscribed(location);
                        location.subscribedModified = location.subscribed;
                        angular.forEach(location.sublocations, function(sublocation) {
                            sublocation.subscribed = getSubscribed(sublocation);
                            sublocation.subscribedModified = sublocation.subscribed;
                        });
                    });
                    latestLocations = angular.copy(result);
                    $scope.locations = result;
                }, function fetchGroupLocationsError(err) {
                    $scope.locations = angular.copy(latestLocations);
                });
            };

            $scope.saveLocations = function saveLocations() {
                var locationDiff = {};
                var sublocationDiff = {};
                var sublocationIdToLocationId = {};
                if ($scope.locations) {
                    if ($scope.locations.length == latestLocations.length) {
                        for (var i = 0; i < $scope.locations.length; i++) {
                            var location = $scope.locations[i];
                            var unmodifiedLocation = latestLocations[i];
                            if (location.id != unmodifiedLocation.id) {
                                latestLocations = null;
                                return saveLocations();
                            } else {
                                if (location.subscribed != location.subscribedModified) {
                                    locationDiff[location.id] = location.subscribedModified;
                                }
                            }
                            for (var j = 0; j < location.sublocations.length; j++) {
                                var sublocation = location.sublocations[j];
                                if (sublocation.subscribed != sublocation.subscribedModified) {
                                    sublocationDiff[sublocation.id] = sublocation.subscribedModified;
                                    sublocationIdToLocationId[sublocation.id] = location.id;
                                }
                            }
                        }
                    } else {
                        angular.forEach($scope.locations, function(location) {
                            locationDiff[location.id] = location.subscribedModified;
                            angular.forEach(location.sublocations, function(sublocation) {
                                sublocationDiff[sublocation.id] = sublocation.subscribedModified;
                                sublocationIdToLocationId[sublocation.id] = location.id;
                            });
                        });
                    }


                    var promises = [];
                    angular.forEach(locationDiff, function saveLocationsPost(subscribed, location_id) {
                        var verb = subscribed ? 'subscribe':'unsubscribe';
                        var promise = LocationsModel[verb]({location_id: location_id}).$promise;
                        promises.push(promise);
                        promise.then(function saveLocationsPostSuccess(result) {
                            for (var i = 0; i < latestLocations.length; i++) {
                                var unmodifiedLocation = $scope.locations[i];
                                if (unmodifiedLocation.id == location_id) {
                                    unmodifiedLocation.subscribed = subscribed;
                                    unmodifiedLocation.subscribedModified = subscribed;
                                    break;
                                }
                            }
                        }, function saveLocationsPostError(response) {
                            // reset UI
                            for (var i = 0; i < $scope.locations.length; i++) {
                                var location = $scope.locations[i];
                                if (location.id == location_id) {
                                    location.subscribed = !subscribed;
                                    location.subscribedModified = !subscribed;
                                    break;
                                }
                            }
                            $rootScope.$emit(GENERAL_EVENTS.UPDATES.FAILURE, response);
                        });
                    });

                    angular.forEach(sublocationDiff, function saveSublocationsPost(subscribed, sublocation_id) {
                        var location_id = sublocationIdToLocationId[sublocation_id];
                        var verb = subscribed ? 'sublocationSubscribe':'sublocationUnsubscribe';
                        var promise = LocationsModel[verb]({location_id: location_id, sublocation_id: sublocation_id}).$promise;
                        promises.push(promise);
                        promise.then(function saveLocationsPostSuccess(result) {
                            for (var i = 0; i < latestLocations.length; i++) {
                                var unmodifiedLocation = $scope.locations[i];
                                if (unmodifiedLocation.id == location_id) {
                                    for (var j = 0; j < unmodifiedLocation.sublocations.length; j++) {
                                        var unmodifiedSublocation = unmodifiedLocation.sublocations[j];
                                        if (unmodifiedSublocation.id == sublocation_id) {
                                            unmodifiedSublocation.subscribed = subscribed;
                                            unmodifiedSublocation.subscribedModified = subscribed;
                                            break;
                                        }
                                    }
                                    break;
                                }
                            }
                        }, function saveLocationsPostError(response) {
                            // reset UI
                            for (var i = 0; i < $scope.locations.length; i++) {
                                var location = $scope.locations[i];
                                if (location.id == location_id) {
                                    for (var j = 0; j < location.sublocations.length; j++) {
                                        var sublocation = location.sublocations[j];
                                        if (sublocation.id == sublocation_id) {
                                            sublocation.subscribed = !subscribed;
                                            sublocation.subscribedModified = !subscribed;
                                            break;
                                        }
                                    }
                                    break;
                                }
                            }
                            $rootScope.$emit(GENERAL_EVENTS.UPDATES.FAILURE, response);
                        });
                    });
                }
            };

            $scope.beforeEnter = $scope.fetchLocations();

        }]
);
