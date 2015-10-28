angular.module('scheduling-app.controllers')
    .controller('ManageLocationDirectiveController', [
        '$rootScope',
        '$scope',
        '$controller',
        'GENERAL_CONFIG',
        'GENERAL_EVENTS',
        'UsersModel',
        function($rootScope,
                 $scope,
                 $controller,
                 GENERAL_CONFIG,
                 GENERAL_EVENTS,
                 UsersModel
        ) {
            $controller('BaseManageLocationDirectiveController', {
                $scope: $scope,
                ModelVariableName: 'UsersModel',
                Model: UsersModel
            });
        }]);
