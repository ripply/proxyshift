angular.module('scheduling-app.controllers')
    .controller('CreateSubclassDirectiveController', [
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
            $controller('BaseCreateSubclassDirectiveController', {
                $scope: $scope,
                ModelVariableName: 'UsersModel',
                Model: UsersModel
            });
        }]);
