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
        'StateHistoryService',
        'STATES',
        function($scope,
                 $rootScope,
                 $stateParams,
                 $controller,
                 UserInfoService,
                 StateHistoryService,
                 STATES) {
            $controller('BaseModelController', {$scope: $scope});

            $scope.stateParams = $stateParams;

            function getGroupId() {
                return $scope.stateParams.group_id;
            }

            function init() {
                $scope.group_id = getGroupId();
                $scope.locations = UserInfoService.getLocationsMemberOfForGroup($scope.group_id);
            }

            $scope.beforeEnter = init;

            $scope.pageTitle = 'Locations';

        }]
);
