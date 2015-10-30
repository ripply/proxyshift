angular.module('scheduling-app.controllers')
    .controller('BaseSendInviteDirectiveController', [
        '$rootScope',
        '$scope',
        '$controller',
        'GENERAL_CONFIG',
        'GENERAL_EVENTS',
        //'Restangular',
        //'ModelVariableName',
        //'Model',
        function($rootScope,
                 $scope,
                 $controller,
                 GENERAL_CONFIG,
                 GENERAL_EVENTS
                 //Restangular,
                 //ModelVariableName,
                 //Model
        ) {
            $controller('BaseModelController', {$scope: $scope});
           /* $scope.register(
                //ModelVariableName,
                //Model,
                //undefined
            );*/
            //$scope.Model = $rootScope[ModelVariableName];
            /*$rootScope.$watch(ModelVariableName, function(newValue, oldValue) {
                $scope.Model = newValue;
            });*/

            $scope.userclassList = [
                { description: "Nurse"},
                { description: "Doctor"}
            ];

            $scope.permissionsList = [
                { description: "Regular User"},
                { description: "Manager"}
            ];

            function sendInvite(email) {
                //Send email invitation
                //Store invitation id/key in DB to use when user clicks URL to said invitation page?

                if(checkExistingUser(email)) {
                    //Also send invitation to user in app
                }
            }

            function checkExistingUser(email) {
                if(email) {
                    return true;
                } else {
                    return false;
                }
            }
        }]);
