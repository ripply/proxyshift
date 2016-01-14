angular.module('scheduling-app.controllers')
    .controller('BaseManageLocationDirectiveController', [
        '$rootScope',
        '$scope',
        '$controller',
        '$stateParams',
        'UserInfoService',
        'GENERAL_CONFIG',
        'GENERAL_EVENTS',
        'ResourceService',
        function($rootScope,
                 $scope,
                 $controller,
                 $stateParams,
                 UserInfoService,
                 GENERAL_CONFIG,
                 GENERAL_EVENTS,
                 ResourceService
        ) {
            $controller('BaseModelController', {$scope: $scope});

            $scope.stateParams = $stateParams;
            $scope.beforeEnter = init;

            function init() {
                $scope.group_id = getGroupId();
                $scope.location_id = getLocationId();
                $scope.sublocation_id = getSublocationId();
                if ($scope.sublocation_id) {
                    $scope.sublocation = UserInfoService.getSublocation($scope.sublocation_id);
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

            $scope.isPrivilegedMemberOfLocation = function isPrivilegedMemberOfLocation() {
                return UserInfoService.isPrivilegedMemberOfLocation(getLocationId());
            };

            $scope.createSubLocation = createSubLocation;

            function createSubLocation(location_id, title, description) {
                ResourceService.createSublocation(location_id, title, description);
            }
        }]);
