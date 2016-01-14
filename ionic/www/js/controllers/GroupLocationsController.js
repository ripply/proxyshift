/**
 * GroupLocationsController
 */
angular.module('scheduling-app.controllers')
    .controller('GroupLocationsController', [
        '$scope',
        '$rootScope',
        '$stateParams',
        '$controller',
        'UserInfoService',
        function($scope,
                 $rootScope,
                 $stateParams,
                 $controller,
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
                    $scope.locations = UserInfoService.getLocationsMemberOfForGroup($scope.group_id);
                }
            }

            $scope.beforeEnter = init;

            $scope.pageTitle = 'Locations';

        }]
);
