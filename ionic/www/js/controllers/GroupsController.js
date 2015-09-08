/**
 * GroupsController
 */
angular.module('scheduling-app.controllers')
    .controller('GroupsController', [
        '$scope',
        '$controller',
        'GENERAL_CONFIG',
        'GroupsModel',
        function($scope, $controller, GENERAL_CONFIG, GroupsModel) {
            $controller('BaseModelController', {$scope: $scope});
            $scope.register('GroupsModel', GroupsModel);
        }]);
