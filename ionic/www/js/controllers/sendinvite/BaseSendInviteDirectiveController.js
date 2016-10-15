angular.module('scheduling-app.controllers')
    .controller('BaseSendInviteDirectiveController', [
        '$rootScope',
        '$scope',
        '$stateParams',
        '$controller',
        'UserInfoService',
        'ResourceService',
        'GENERAL_CONFIG',
        'GENERAL_EVENTS',
        //'Restangular',
        //'ModelVariableName',
        //'Model',
        function($rootScope,
                 $scope,
                 $stateParams,
                 $controller,
                 UserInfoService,
                 ResourceService,
                 GENERAL_CONFIG,
                 GENERAL_EVENTS
                 //Restangular,
                 //ModelVariableName,
                 //Model
        ) {
            $controller('BaseModelController', {$scope: $scope});

            $scope.stateParams = $stateParams;
            $scope.beforeEnter = init;
            UserInfoService.onUserInfoUpdate($scope, init);

            function init() {
                $scope.group_id = getGroupId();
                $scope.grouppermission_id = 2;
                if ($rootScope.userinfo) {
                    $scope.usersUserclasses = $rootScope.userinfo.userClasses;
                }
                $scope.group = UserInfoService.getGroup($scope.group_id);
                if ($scope.group) {
                    $scope.userClasses= angular.copy($scope.group.userClasses);
                    // filter userclasses to that below yours
                    var groupUserclass;
                    for (var i = 0; i < $scope.usersUserclasses.length; i++) {
                        var usersUserClass = $scope.usersUserclasses[i];
                        if (usersUserClass.group_id == $scope.group_id) {
                            // match
                            groupUserclass = usersUserClass;
                            break;
                        }
                    }

                    if (!groupUserclass) {
                        console.error("No userclasses below ours");
                        if ($scope.usersUserclasses && $scope.usersUserclasses.length > 0) {
                            console.debug($scope.usersUserclasses);
                        } else {
                            console.debug("No userclasses assigned to us, reporting this to server as this shouldn't happen");
                            ResourceService.errorReport('No userclasses assigned to us');
                        }
                    }

                    var grouppermissionIdMap = {};
                    var lowestGrouppermissionlevel;
                    for (i = 0; i < $rootScope.userinfo.allGroupPermissions.length; i++) {
                        var individualGrouppermission = $rootScope.userinfo.allGroupPermissions[i];
                        grouppermissionIdMap[individualGrouppermission.id] = individualGrouppermission;
                        if (!lowestGrouppermissionlevel && individualGrouppermission.group_id == $scope.group_id ||
                            (lowestGrouppermissionlevel.permissionlevel > individualGrouppermission.permissionlevel)) {
                            lowestGrouppermissionlevel = individualGrouppermission;
                        }
                    }

                    $scope.grouppermission_id = lowestGrouppermissionlevel.id;

                    var ourGroupPermission;
                    if (groupUserclass) {
                        ourGroupPermission = grouppermissionIdMap[groupUserclass.grouppermission_id];
                    } else {
                        // couldn't find our group permission, fake it
                        ourGroupPermission = {
                            permissionlevel: 0
                        };
                    }

                    $scope.filteredGrouppermissions = [];
                    for (i = 0; i < $scope.group.grouppermissions.length; i++) {
                        var filterableGrouppermssion = $scope.group.grouppermissions[i];
                        if (filterableGrouppermssion.permissionlevel <= ourGroupPermission.permissionlevel) {
                            $scope.filteredGrouppermissions.push(filterableGrouppermssion);
                        }
                    }

                    $scope.filteredUserclasses = [];
                    var userclasses_ids = Object.keys($scope.userClasses);
                    for (i = 0; i < userclasses_ids.length; i++) {
                        var userclass = $scope.userClasses[userclasses_ids[i]];
                        var grouppermission_id = userclass.grouppermission_id;
                        if (grouppermissionIdMap.hasOwnProperty(grouppermission_id)) {
                            var grouppermission = grouppermissionIdMap[grouppermission_id];
                            var permissionLevel = grouppermission.permissionlevel;
                            if (permissionLevel <= ourGroupPermission.permissionlevel) {
                                $scope.filteredUserclasses.push(userclass);
                            }
                        }
                    }
                    if ($scope.userclass_id === undefined &&
                        $scope.filteredUserclasses.length > 0) {
                        $scope.userclass_id = $scope.filteredUserclasses[0].id;
                        selectOnlyOne($scope.filteredUserclasses, $scope.userclass_id);
                    }
                    selectOnlyOne($scope.filteredGrouppermissions, $scope.grouppermission_id);
                }
            }

            function selectOnlyOne(list, id) {
                if (list) {
                    angular.forEach(list, function(item) {
                        item.checked = item.id == id;
                    });
                }
            }

            $scope.userClassSelected = function(value) {
                selectOnlyOne($scope.filteredUserclasses, value);
            };

            $scope.permissionLevelSelected = function(value) {
                selectOnlyOne($scope.filteredGrouppermissions, value);
            };

            function getGroupId() {
                return $scope.stateParams.group_id;
            }

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

            var invitePending = false;

            function clearError() {
                $scope.error = undefined;
            }

            $scope.inviteUsersToGroup = function inviteUsersToGroup(group_id, grouppermission_id, userclass_id, email, message) {
                if (invitePending) {
                    return;
                }

                clearError();
                invitePending = true;
                ResourceService.inviteUsersToGroup(group_id, grouppermission_id, userclass_id, email, message,
                    function successfullyInvitedUser() {
                        clearError();
                        invitePending = false;
                    },
                    function failedToInviteUser(response) {
                        $scope.error = response.status;
                        if (response.data.error && response.data.data && response.data.data.message) {
                            $scope.error = response.data.data.message;
                        }
                        invitePending = false;
                    }
                );
            };
        }]);
