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

                    var ourGroupPermission = grouppermissionIdMap[groupUserclass.grouppermission_id];

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
                    console.log($scope.filteredUserclasses);
                }
            }

            function getGroupId() {
                return $scope.stateParams.group_id;
            }

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

            $scope.inviteUsersToGroup = ResourceService.inviteUsersToGroup;
        }]);
