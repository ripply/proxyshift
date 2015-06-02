/**
 * GroupsController
 */
angular.module('scheduling-app.controllers')
    .controller('GroupsController', [
        '$scope',
        'GroupsModel',
        'GENERAL_CONFIG',
        function($scope, GroupsModel, GENERAL_CONFIG) {
            $scope.groups = [];
            $scope.add = function() {
                $scope.groups.push({
                    groupname: 'test!?', id: $scope.groupname.length
                });
            };
            $scope.fetch = function() {
                GroupsModel.getList().then(function(groups) {
                    console.log("Successfully fetched groups!");
                    $scope.groups = groups;
                }, function(err) {
                    $scope.groups = [
                        {groupname: 'Failed to fetch groups'}
                    ];
                });
            };
            $scope.fetch();
        }]);