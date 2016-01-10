angular.module('scheduling-app.controllers')
    .controller('BaseUsersListController', [
        '$rootScope',
        '$scope',
        '$controller',
        '$stateParams',
        'GENERAL_CONFIG',
        'GENERAL_EVENTS',
        'ResourceService',
        //'ModelVariableName',
        //'Model',
        function($rootScope,
                 $scope,
                 $controller,
                 $stateParams,
                 GENERAL_CONFIG,
                 GENERAL_EVENTS,
                 ResourceService
                 //ModelVariableName,
                 //Model
        ) {
            $controller('BaseModelController', {$scope: $scope});

            $scope.stateParams = $stateParams;
            $scope.beforeEnter = init;

            function init() {
                $scope.group_id = getGroupId();
                $scope.location_id = getLocationId();
                getUsers();
            }

            function getGroupId() {
                return $stateParams.group_id;
            }

            function getLocationId() {
                return $stateParams.location_id;
            }

            function getUsers() {
                ResourceService.getUsersAtLocation($scope.location_id, function getUsersSuccess(result) {
                    $scope.users = result;
                }, function getUsersError(response) {
                    $scope.users = [{firstname: 'Server Error'}];
                });
            }
        }]);
