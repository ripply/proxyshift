/**
 * UserLocationsController
 */
angular.module('scheduling-app.controllers')
    .controller('UserLocationsController', [
        '$scope',
        '$rootScope',
        '$controller',
        '$stateParams',
        'Restangular',
        'UserInfoService',
        'StateHistoryService',
        'STATES',
        function($scope,
                 $rootScope,
                 $controller,
                 $stateParams,
                 Restangular,
                 UserInfoService,
                 StateHistoryService,
                 STATES) {
            $controller('BaseModelController', {$scope: $scope});

            function getGroupId() {
                return $stateParams.group_id;
            }

            var latestLocations;

            $scope.fetchLocations = function fetchLocations() {
                Restangular.one("groups", getGroupId())
                    .all('locations')
                    .getList()
                    .then(function fetchGroupLocations(result) {
                        result = result.plain();
                        angular.forEach(result, function(location) {
                            location.subscribed = location.subscribed == 1;
                        });
                        latestLocations = angular.copy(result);
                        $scope.locations = result;
                        console.log(result);
                    }, function fetchGroupLocationsError(err) {
                        $scope.locations = angular.copy(latestLocations);
                        console.log(err);
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
                                if (location.subscribed != latestLocations.subscribed) {
                                    diff[location.id] = location.subscribed;
                                }
                            }
                        }
                    } else {
                        angular.forEach($scope.locations, function(location) {
                            diff[location.id] = location.subscribed;
                        });
                    }


                    var promises = [];
                    angular.forEach(diff, function saveLocationsPost(subscribed, location_id) {
                        var rest = Restangular.one("locations", location_id)
                            .one('subscribe');
                        var verb = subscribed ? 'doPOST':'doDELETE';
                        var promise = rest[verb]();
                        promises.push(promise);
                        var location;
                        promise.then(function saveLocationsPostSuccess(result) {
                            for (var i = 0; i < latestLocations.length; i++) {
                                var unmodifiedLocation = latestLocations[i];
                                if (unmodifiedLocation.id == location_id) {
                                    unmodifiedLocation.subscribed = subscribed;
                                    break;
                                }
                            }
                        }, function saveLocationsPostError(response) {
                            // reset UI
                            for (var i = 0; i < $scope.locations.length; i++) {
                                var location = $scope.locations[i];
                                if (location.id == location_id) {
                                    location.subscribed = !subscribed;
                                    break;
                                }
                            }
                            $rootScope.$emit(GENERAL_EVENTS.UPDATES.FAILURE, response);
                        });
                    });
                }
            };

            $scope.fetchLocations();

            $scope.locationList = [
                { address: "Location 1", city: "Helsingborg", checked: true },
                { address: "Location 2", city: "Chesapeake", checked: false },
                { address: "Location 3", city: "Chesapeake", checked: false },
                { address: "Location 4", city: "Chicago", checked: false },
                { address: "Location 5", city: "Helsingborg", checked: true },
                { address: "Location 6", city: "Helsingborg", checked: true },
                { address: "Location 7", city: "Chesapeake", checked: false },
                { address: "Location 8", city: "Chesapeake", checked: false },
                { address: "Location 9", city: "Helsingborg", checked: false },
                { address: "Location 10", city: "Chicago", checked: false },
                { address: "Location 11", city: "Chicago", checked: false },
                { address: "Location 12", city: "Chesapeake", checked: false },
                { address: "Location 13", city: "Stockholm", checked: false },
                { address: "Location 14", city: "Stockholm", checked: false },
                { address: "Location 15", city: "Helsingborg", checked: true },
                { address: "Location 16", city: "Helsingborg", checked: false },
                { address: "Location 17", city: "Chesapeake", checked: false },
                { address: "Location 18", city: "Chicago", checked: false },
                { address: "Location 19", city: "Chicago", checked: false },
                { address: "Location 20", city: "Chicago", checked: true }
            ];

        }]
);
