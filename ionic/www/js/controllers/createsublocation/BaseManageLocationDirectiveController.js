angular.module('scheduling-app.controllers')
    .controller('BaseManageLocationDirectiveController', [
        '$rootScope',
        '$scope',
        '$controller',
        '$stateParams',
        'GENERAL_CONFIG',
        'GENERAL_EVENTS',
        'ResourceService',
        //'ModelVariableName',
        //'Model',
        function($rootScope,
                 $scope,
                 $controller,
                 $stateParams,
                 GENERAL_CONFIG,
                 GENERAL_EVENTS,
                 ResourceService
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
                $scope.location_id = getLocationId();
            }

            function getGroupId() {
                return $stateParams.group_id;
            }

            function getLocationId() {
                return $stateParams.location_id;
            }

            $scope.createSubLocation = createSubLocation;

            function createSubLocation(location_id, title, description) {
                ResourceService.createSublocation(location_id, title, description);
            }

            function checkExistingSubLocation(sublocation) {
                if(sublocation) {
                    return true;
                } else {
                    return false;
                }
            }
        }]);
