angular.module('scheduling-app.controllers')
    .controller('BaseManageLocationDirectiveController', [
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

            function createSubLocation(sublocation) {
                //Send email invitation

                if(checkExistingSubLocation(sublocation)) {
                    //Also send invitation to user in app
                }
            }

            function checkExistingSubLocation(sublocation) {
                if(sublocation) {
                    return true;
                } else {
                    return false;
                }
            }
        }]);
