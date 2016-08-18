/**
 * GroupLocationsController
 */
angular.module('scheduling-app.controllers')
    .controller('GroupLocationsController', [
        '$scope',
        '$rootScope',
        '$stateParams',
        '$controller',
        'GroupsModel',
        'UserInfoService',
        function($scope,
                 $rootScope,
                 $stateParams,
                 $controller,
                 GroupsModel,
                 UserInfoService
        ) {
            $controller('BaseModelController', {$scope: $scope});

            function getGroupId() {
                return $stateParams.group_id;
            }

            function getLocationId() {
                return $stateParams.location_id;
            }

            function getSublocationId() {
                return $stateParams.sublocation_id;
            }

            function init() {
                $scope.group_id = getGroupId();
                $scope.location_id = getLocationId();
                $scope.sublocation_id = getSublocationId();
                if ($scope.sublocation_id) {
                    $scope.location = UserInfoService.getLocation($scope.location_id);
                } else if ($scope.location_id) {
                    $scope.location = UserInfoService.getLocation($scope.location_id);
                } else {
                    $scope.fetchLocations();
                }
            }

            var latestLocations;

            $scope.fetchLocations = function fetchLocations() {
                GroupsModel.locations({
                    group_id: getGroupId()
                }, function fetchGroupLocations(result) {
                    latestLocations = angular.copy(result);
                    $scope.locations = result;
                }, function fetchGroupLocationsError(err) {
                    $scope.locations = angular.copy(latestLocations);
                });
            };

            $scope.beforeEnter = init;

            $scope.pageTitle = 'Locations';

        }]
);
