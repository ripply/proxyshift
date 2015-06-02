/**
 * CreateGroupsController
 */
angular.module('scheduling-app.controllers')
    .controller('CreateGroupController', [
        '$scope',
        '$http',
        '$state',
        'GroupsModel',
        function($scope, $http, $state, GroupsModel) {

            $scope.group = {
                groupname: null
            };

            $scope.doCreate = function() {
                GroupsModel.post($scope.group)

                    .then(function() {
                        $scope.group.groupname = null;
                        console.log("Successfully created group?");
                    }, function(response) {
                        console.log("Failed to create group with response: " + response.status);
                    });
            };

            $scope.$on('event:creategroup-failed', function(e, message) {
                $scope.message = message;
            });

            $scope.$on('event:creategroup-complete', function() {
                $state.go('app.home', {}, {reload: true, inherit: false});
            });

        }]
);