angular.module('scheduling-app.controllers')
    .controller('SendInviteDirectiveController', [
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
            $controller('BaseSendInviteDirectiveController', {
                $scope: $scope,
                ModelVariableName: 'UsersModel',
                Model: UsersModel
            });
        }]);
