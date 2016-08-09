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
                    });
                    latestLocations = angular.copy(result);
                    $scope.locations = result;
                }, function fetchGroupLocationsError(err) {
                    $scope.locations = angular.copy(latestLocations);
                });
            };

            $scope.saveLocations = function saveLocations() {
                var diff = {};
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
                                    diff[location.id] = location.subscribedModified;
                                }
                            }
                        }
                    } else {
                        angular.forEach($scope.locations, function(location) {
                            diff[location.id] = location.subscribedModified;
                        });
                    }


                    var promises = [];
                    angular.forEach(diff, function saveLocationsPost(subscribed, location_id) {
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
                }
            };

            $scope.beforeEnter = $scope.fetchLocations();

        }]
);
