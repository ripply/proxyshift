angular.module('scheduling-app.controllers')
    .controller('ManagingJobsController', [
        '$scope',
        '$rootScope',
        '$controller',
        '$stateParams',
        'LocationsModel',
        'UserInfoService',
        'StateHistoryService',
        'GENERAL_EVENTS',
        'STATES',
        function($scope,
                 $rootScope,
                 $controller,
                 $stateParams,
                 LocationsModel,
                 UserInfoService,
                 StateHistoryService,
                 GENERAL_EVENTS,
                 STATES) {
            $controller('BaseModelController', {$scope: $scope});

            function getGroupId() {
                return parseInt($stateParams.group_id);
            }

            function getLocationId() {
                return parseInt($stateParams.location_id);
            }

            var latestLocations;

            function getSubscribed(location) {
                if (location.userpermissions &&
                    location.userpermissions instanceof Array &&
                    location.userpermissions.length > 0) {
                    var userpermission = location.userpermissions[0];
                    return userpermission.subscribed == 1;
                } else {
                    return false;
                }
            }

            $rootScope.$on(GENERAL_EVENTS.UPDATES.USERINFO.PROCESSED, function(state, userInfo) {
                init();
            });

            $scope.beforeEnter = function() {
                init();
            };

            function init() {
                $scope.uiStateUserClasses = {};
                $scope.persistingUserClasses = {};
                $scope.sublocations = UserInfoService.getSublocationsForLocation(getLocationId());
                $scope.sublocationsMap = {};
                angular.forEach($scope.sublocations, function(sublocation) {
                    $scope.sublocationsMap[sublocation.id] = sublocation;
                });
                window.wat = UserInfoService.getManagingUserclassesForLocation;
                $scope.myUserClasses = UserInfoService.getManagingUserclassesForLocation(getLocationId());
                var userClassesMap = angular.copy(UserInfoService.getSubscribableUserclassesFromGroup(getGroupId()));
                var userClassesArray = [];
                angular.forEach(userClassesMap, function(userClass) {
                    userClassesArray.push(userClass);
                });

                var sublocationsPlusLocation = $scope.sublocations.slice(0);
                sublocationsPlusLocation.unshift(undefined);

                angular.forEach(userClassesMap, function(userClass) {
                    angular.forEach(sublocationsPlusLocation, function(sublocation) {
                        var userClassKey = UserInfoService.getUserclassKeyForIds(
                            userClass.id,
                            getLocationId(),
                            sublocation === undefined ? undefined:sublocation.id
                        );
                        $scope.uiStateUserClasses[userClassKey] = isManagingUserClassByKey(userClassKey);
                        $scope.persistingUserClasses[userClassKey] = false;
                        if ($scope.myUserClasses.hasOwnProperty(userClass.key)) {
                            $scope.myUserClasses[userClass.key].key = key;
                        }
                    });
                });
                $scope.userClasses = userClassesArray;
            }

            $scope.getUserClassKey = function getUserClassKey(userClassOrId, sublocation_id) {
                if (userClassOrId.hasOwnProperty('id')) {
                    userClassOrId = userClassOrId.id;
                }
                return UserInfoService.getUserclassKeyForIds(userClassOrId, getLocationId(), sublocation_id);
            };

            $scope.isPrivilegedGroupMember = function() {
                return UserInfoService.isPrivilegedGroupMember(getGroupId())
            };

            $scope.isManagingUserClass = isManagingUserClass;

            function isManagingUserClass(userClassOrUserClassId, sublocation_id) {
                if (!sublocation_id && userClassOrUserClassId.hasOwnProperty('sublocation_id')) {
                    sublocation_id = userClassOrUserClassId.sublocation_id;
                }
                if (userClassOrUserClassId.hasOwnProperty('id')) {
                    userClassOrUserClassId = userClassOrUserClassId.id;
                }
                var userClassKey = UserInfoService.getUserclassKeyForIds(userClassOrUserClassId, getLocationId(), sublocation_id);
                return isManagingUserClassByKey(userClassKey);
            }

            function isManagingUserClassByKey(userClassKey) {
                return $scope.myUserClasses.hasOwnProperty(userClassKey);
            }

            $scope.saveJob = function() {
                angular.forEach($scope.userClasses, function(userClass) {
                    angular.forEach($scope.sublocations, function(sublocation) {
                        var userClassKey = UserInfoService.getUserclassKeyForIds(userClass.id, getLocationId(), sublocation.id);
                        var sublocationPersistingUserClass = $scope.persistingUserClasses[locationUserClassKey];

                        if (!sublocationPersistingUserClass) {
                            var sublocationUiState = $scope.uiStateUserClasses[userClassKey];
                            var sublocationServerState = isManagingUserClassByKey(userClassKey);
                            if (sublocationUiState !== undefined &&
                                sublocationServerState !== undefined &&
                                sublocationUiState !== sublocationServerState) {
                                saveIndividualJob(sublocationUiState, userClass, getLocationId(), sublocation.id);
                            }
                        }
                    });
                    var locationUserClassKey = UserInfoService.getUserclassKeyForIds(userClass.id, getLocationId());
                    var locationPersistingUserClass = $scope.persistingUserClasses[locationUserClassKey];

                    if (!locationPersistingUserClass) {
                        var locationUiState = $scope.uiStateUserClasses[locationUserClassKey];
                        var locationServerState = isManagingUserClassByKey(locationUserClassKey);
                        if (locationUiState != locationServerState) {
                            saveIndividualJob(locationUiState, userClass, getLocationId());
                        }
                    }
                });
            };

            function saveIndividualJob(subscribe, userClass, location_id, sublocation_id) {
                var userClassKey = UserInfoService.getUserclassKeyForIds(userClass.id, location_id, sublocation_id);
                if (persistingUserClass()) {
                    return;
                }
                var method;
                var clonedUserClass = angular.copy(userClass);
                var successCallback;
                if (subscribe) {
                    method = 'manageJob' + (sublocation_id === undefined ? '':'AtSublocation');
                    successCallback = function() {
                        UserInfoService.addManagingUserclassToGroup(clonedUserClass.id, location_id, sublocation_id);
                        $scope.myUserClasses = UserInfoService.getManagingUserclassesForLocation(getLocationId());
                        if (!isManagingUserClass(clonedUserClass, sublocation_id)) {
                            $scope.errorToast('An error occurred, reloading...');
                            location.reload();
                        }
                    };
                } else {
                    method = 'unmanageJob' + (sublocation_id === undefined ? '':'AtSublocation');
                    successCallback = function() {
                        UserInfoService.removeManagingUserclassToGroup(clonedUserClass.id, location_id, sublocation_id);
                        $scope.myUserClasses = UserInfoService.getManagingUserclassesForLocation(getLocationId());
                        if (isManagingUserClass(clonedUserClass, sublocation_id)) {
                            $scope.errorToast('An error occurred, reloading...');
                            location.reload();
                        }
                    };
                }
                persistingUserClass(true);
                var post = {
                    location_id: location_id,
                    groupuserclass_id: clonedUserClass.id
                };
                if (sublocation_id) {
                    post.sublocation_id = sublocation_id;
                }
                LocationsModel[method](post, function persistUserClassSuccess(result) {
                    clonedUserClass.sublocation_id = sublocation_id;
                    if (location_id) {
                        clonedUserClass.location_id = location_id;
                    } else {
                        clonedUserClass.location_id = undefined;
                    }
                    var key = UserInfoService.getUserclassKey(clonedUserClass);

                    if (subscribe) {
                        // create in myUserClasses
                        $scope.myUserClasses[key] = clonedUserClass;
                    } else {
                        // remove from myUserClasses
                        if ($scope.myUserClasses.hasOwnProperty(key)) {
                            delete $scope.myUserClasses[key];
                        }
                    }
                    successCallback();
                    persistingUserClass(false);
                }, function persistUserClassError(err) {
                    // undo, failure
                    $scope.errorToast('Failed to persist job type');
                    userClass.subscribed = !clonedUserClass.subscribed;
                    persistingUserClass(false);
                });

                function persistingUserClass(persisting) {
                    if (persisting === undefined) {
                        return $scope.persistingUserClasses[userClassKey];
                    } else {
                        $scope.persistingUserClasses[userClassKey] = persisting;
                    }
                }
            }

        }]
);
