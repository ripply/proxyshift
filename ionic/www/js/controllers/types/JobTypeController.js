angular.module('scheduling-app.controllers')
    .controller('JobTypeController', [
        '$rootScope',
        '$scope',
        '$controller',
        '$stateParams',
        '$q',
        'ResourceService',
        function($rootScope,
                 $scope,
                 $controller,
                 $stateParams,
                 $q,
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
                var typesDeferred = $q.defer();
                var permissionsDeferred = $q.defer();

                getJobTypes(function() {
                    typesDeferred.resolve();
                }, function() {
                    typesDeferred.reject();
                });

                getGroupPermissions(function() {
                    permissionsDeferred.resolve();
                }, function() {
                    permissionsDeferred.reject();
                });

                // runs both requests async
                $q.all([typesDeferred.promise, permissionsDeferred.promise])
                    .then(function() {
                        if ($scope.type_id !== null &&
                            $scope.type_id !== undefined &&
                            $scope.types instanceof Array) {
                            for (var i = 0; i < $scope.types.length; i++) {
                                var type = $scope.types[i];
                                if (type.id == $scope.type_id) {
                                    $scope.type = angular.copy(type);
                                    if ($scope.permissions && $scope.permissions instanceof Array) {
                                        for (var j = 0; j < $scope.permissions.length; j++) {
                                            var permission = $scope.permissions[j];
                                            if (permission.id == $scope.type.grouppermission_id) {
                                                $scope.grouppermission = permission;
                                                break;
                                            }
                                        }
                                    }
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
                    })
            }

            function getGroupId() {
                return $stateParams.group_id;
            }

            function getTypeId() {
                return $stateParams.type_id;
            }

            function getJobTypes(success, error) {
                ResourceService.getJobsAtGroup($scope.group_id, function getJobsSuccess(result) {
                    $scope.types = result;
                    success(result);
                }, function getJobsError(response) {
                    $scope.types = [{firstname: 'Server Error'}];
                    error(response);
                });
            }

            function getGroupPermissions(success, error) {
                ResourceService.getGroupPermissions($scope.group_id, function getGroupPermissionsSuccess(result) {
                    $scope.permissions = result;
                    success(result);
                }, function getGroupPermissionsError(response) {
                    $scope.permissions = [];
                    error(response);
                });
            }

            $scope.createType = ResourceService.createType;
            $scope.editType = ResourceService.editType;
            $scope.deleteType = ResourceService.deleteType;
        }]);
