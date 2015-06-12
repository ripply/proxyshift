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
                    name: 'test!?',
                    id: $scope.name.length
                });
            };
            $scope.fetch = function() {
                GroupsModel.getList().then(function(groups) {
                    console.log("Successfully fetched groups!");
                    $scope.groups = groups;
                }, function(err) {
                    $scope.groups = [
                        {name: 'Failed to fetch groups'}
                    ];
                });
            };
            $scope.fetch();
        }]);