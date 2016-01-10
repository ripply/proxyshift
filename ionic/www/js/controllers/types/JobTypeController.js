angular.module('scheduling-app.controllers')
    .controller('JobTypeController', [
        '$rootScope',
        '$scope',
        '$controller',
        '$stateParams',
        'ResourceService',
        function($rootScope,
                 $scope,
                 $controller,
                 $stateParams,
                 ResourceService
        ) {
            $controller('BaseModelController', {$scope: $scope});

            $scope.stateParams = $stateParams;
            $scope.beforeEnter = init;

            $scope.isPrivilegedType = function isPrivilegedType(type) {
                if (type &&
                    typeof type == 'object' &&
                    type.hasOwnProperty('grouppermission') &&
                    typeof type.grouppermission == 'object' &&
                    type.grouppermission.hasOwnProperty('permissionlevel')) {
                    return type.grouppermission.permissionlevel >= 2;
                }

                return false;
            };

            function init() {
                $scope.group_id = getGroupId();
                $scope.type_id = getTypeId();
                getJobTypes(function() {
                    if ($scope.type_id !== null &&
                        $scope.type_id !== undefined &&
                        $scope.types instanceof Array) {
                        for (var i = 0; i < $scope.types.length; i++) {
                            var type = $scope.types[i];
                            if (type.id == $scope.type_id) {
                                $scope.type = angular.copy(type);
                                // clean up fields if necessary
                                angular.forEach([
                                    'cansendnotification',
                                    'requiremanagerapproval'
                                ], function(field) {
                                    if (type.hasOwnProperty(field) &&
                                        (type[field] === null || type[field] === undefined)) {
                                        $scope.type[field] = false;
                                    } else if (type[field] == 1) {
                                        $scope.type[field] = true;
                                    } else {
                                        $scope.type[field] = false;
                                    }
                                });
                                break;
                            }
                        }
                    }
                });
            }

            function getGroupId() {
                return $stateParams.group_id;
            }

            function getTypeId() {
                return $stateParams.type_id;
            }

            function getJobTypes(success) {
                ResourceService.getJobsAtGroup($scope.group_id, function getJobsSuccess(result) {
                    $scope.types = result;
                    success(result);
                }, function getJobsError(response) {
                    $scope.types = [{firstname: 'Server Error'}];
                });
            }

            $scope.createType = ResourceService.createType;
            $scope.editType = ResourceService.editType;
            $scope.deleteType = ResourceService.deleteType;
        }]);
