angular.module('scheduling-app.controllers')
    .controller('BaseManageLocationDirectiveController', [
        '$rootScope',
        '$scope',
        '$controller',
        '$stateParams',
        'GENERAL_CONFIG',
        'GENERAL_EVENTS',
        //'Restangular',
        //'ModelVariableName',
        //'Model',
        function($rootScope,
                 $scope,
                 $controller,
                 $stateParams,
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

            $scope.stateParams = $stateParams;
            $scope.beforeEnter = init;

            function init() {
                $scope.group_id = getGroupId();
            }

            function getGroupId() {
                return $scope.stateParams.group_id;
            }

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
