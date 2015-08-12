/**
 * GroupsController
 */
angular.module('scheduling-app.controllers')
    .controller('GroupsController', [
        '$scope',
        '$controller',
        'GENERAL_CONFIG',
        function($scope, $controller, GENERAL_CONFIG) {
            $controller('BaseModelController', {$scope: $scope});
            $scope.register('GroupsModel');
        }]);
