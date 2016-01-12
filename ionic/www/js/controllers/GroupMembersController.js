/**
 * GroupMembersController
 */
angular.module('scheduling-app.controllers')
    .controller('GroupMembersController', [
        '$scope',
        '$rootScope',
        '$stateParams',
        '$controller',
        'ResourceService',
        function($scope,
                 $rootScope,
                 $stateParams,
                 $controller,
                 ResourceService
        ) {
            $controller('BaseModelController', {$scope: $scope});
            $scope.stateParams = $stateParams;

            $scope.beforeEnter = init;

            function init() {
                $scope.group_id = getGroupId();
                $scope.location_id = getLocationId();
                if ($scope.location_id) {
                    getAllLocationUsers();
                } else {
                    getAllGroupUsers()
                }
            }

            function getGroupId() {
                return $scope.stateParams.group_id;
            }

            function getLocationId() {
                return $stateParams.location_id;
            }

            function getAllLocationUsers() {
                ResourceService.getUsersAtLocation($scope.location_id, function getUsersSuccess(result) {
                    $scope.users = result;
                }, function getUsersError(response) {
                    $scope.users = [{firstname: 'Error'}];
                });
            }

            function getAllGroupUsers() {
                var group_id = getGroupId();
                ResourceService.getGroupMembers(group_id, function getAllGroupUsersSuccess(result) {
                    $scope.users = result;
                }, function getAllGroupUsersError(response) {
                    $scope.users = [{firstname: 'Error'}];
                })
            }

            function getSomeGroupUsers(start, end) {
                var group_id = getGroupId();
                ResourceService.getGroupMembersSlice(group_id, start, end, function getAllGroupUsersSuccess(result) {

                }, function getAllGroupUsersError(response) {
                    $scope.users = [{firstname: 'Error'}];
                })
            }

        }]
);
