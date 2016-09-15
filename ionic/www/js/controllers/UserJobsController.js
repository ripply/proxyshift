angular.module('scheduling-app.controllers')
    .controller('UserJobsController', [
        '$scope',
        '$rootScope',
        '$controller',
        '$stateParams',
        'GroupsModel',
        'LocationsModel',
        'UserInfoService',
        'StateHistoryService',
        'GENERAL_EVENTS',
        'STATES',
        function($scope,
                 $rootScope,
                 $controller,
                 $stateParams,
                 GroupsModel,
                 LocationsModel,
                 UserInfoService,
                 StateHistoryService,
                 GENERAL_EVENTS,
                 STATES) {
            $controller('BaseModelController', {$scope: $scope});

            function getGroupId() {
                return $stateParams.group_id;
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
                $scope.userClasses = angular.copy(UserInfoService.getSubscribableUserclassesFromGroupAsArray(getGroupId()));
                $scope.myUserClasses = UserInfoService.getUserClasses();
                updateJobs();
            }

            $scope.isPrivilegedGroupMember = function() {
                return UserInfoService.isPrivilegedGroupMember(getGroupId())
            };

            $scope.isJob = isJob;

            function isJob(job_id) {
                if (job_id.hasOwnProperty('id')) {
                    job_id = job_id.id;
                }
                return $scope.myUserClasses.hasOwnProperty(job_id);
            }

            function updateJobs() {
                angular.forEach($scope.userClasses, function(userClass) {
                    userClass.subscribed = isJob(userClass.id);
                });
            }

            $scope.saveJob = function() {
                var toUpdate = [];
                console.log('SAVE JOB');
                angular.forEach($scope.userClasses, function(userClass) {
                    if (!userClass.persisting && userClass.subscribed != isJob(userClass.id)) {
                        var method;
                        var clonedUserClass = angular.copy(userClass);
                        if (clonedUserClass.subscribed) {
                            method = 'userClassSubscribe';
                        } else {
                            method = 'userClassUnsubscribe';
                        }
                        userClass.persisting = true;
                        GroupsModel[method]({
                            group_id: clonedUserClass.group_id,
                            class_id: clonedUserClass.id
                        }, function persistUserClassSuccess(result) {
                            if (clonedUserClass.subscribed) {
                                // create in myUserClasses
                                $scope.myUserClasses[clonedUserClass.id] = clonedUserClass;
                            } else {
                                // remove from myUserClasses
                                delete $scope.myUserClasses[clonedUserClass.id];
                            }
                            userClass.persisting = false;
                        }, function persistUserClassError(err) {
                            // undo, failure
                            $scope.errorToast('Failed to persist job type');
                            userClass.subscribed = !clonedUserClass.subscribed;
                            userClass.persisting = false;
                        });
                    } else {
                        console.log("NOPEEE");
                    }
                });
            };

        }]
);
