angular.module('scheduling-app.controllers')
    .controller('BaseCreateSubclassDirectiveController', [
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

            function getGroupId() {
                return $scope.stateParams.group_id;
            }

            function init() {
                $scope.group_id = getGroupId();
            }

            $scope.beforeEnter = init;

            $scope.permissionList = [
                { description: "Can Send Notifications", checked: true },
                { description: "Requires Managers Approval", checked: false },
            ];

            function createSubclass(subclass) {
                //Send email invitation

                if(checkExistingSubclass(subclass)) {
                    //Also send invitation to user in app
                }
            }

            function checkExistingSubclass(subclass) {
                if(subclass) {
                    return true;
                } else {
                    return false;
                }
            }
        }]);
