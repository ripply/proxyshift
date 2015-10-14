"use strict";
angular.module('scheduling-app.controllers')
    .controller('RequestShiftSelectUserClassController', [
        '$scope',
        '$controller',
        '$state',
        '$stateParams',
        '$location',
        'UserInfoService',
        'GENERAL_EVENTS',
        'STATES',
        function($scope,
                 $controller,
                 $state,
                 $stateParams,
                 $location,
                 UserInfoService,
                 GENERAL_EVENTS,
                 STATES
        ) {
            $controller('BaseModelController', {$scope: $scope});

            $scope.groups = UserInfoService.getGroupList();
            $scope.locations = UserInfoService.getLocationList();

            $scope.getBaseUrl = function() {
                if ($scope.sublocation_id) {
                    return '/requestshift/sublocation/' + $stateParams.sublocation_id + '/job'
                } else {
                    return '/requestshift/location/' + $stateParams.location_id + '/job'
                }
            };

            $scope.beforeEnter = function() {
                init();
                gotoNextPageIfUserOnlyHasOneJobType();
            };

            //$scope.development = true;
            $location.replace();

            function gotoNextPageIfUserOnlyHasOneJobType() {
                if (!$scope.development
                    && $scope.userclasses
                    && Object.keys($scope.userclasses).length === 1) {
                    var state;
                    var params;
                    if ($scope.sublocation_id) {
                        state = STATES.REQUESTSHIFT_SUBLOCATION_AND_JOB_SELECTED;
                        params = {
                            'sublocation_id': $scope.sublocation_id
                        };
                    } else {
                        state = STATES.REQUESTSHIFT_LOCATION_AND_JOB_SELECTED;
                        params = {
                            'location_id': $scope.location_id
                        };
                    }
                    $state.go(state, params, {reload: false})
                }
            }

            $scope.$on(GENERAL_EVENTS.UPDATES.USERINFO.PROCESSED, function(env, userinfo) {
                init();
            });

            function init() {
                $scope.location_id = $stateParams.location_id;
                $scope.sublocation_id = $stateParams.sublocation_id;
                if ($scope.location_id) {
                    $scope.location = UserInfoService.getLocation($scope.location_id);
                    $scope.group_id = $scope.location.group_id;
                    $scope.sublocation = undefined;
                }
                if ($scope.sublocation_id) {
                    $scope.sublocation = UserInfoService.getSublocation($scope.sublocation_id);
                    if ($scope.sublocation) {
                        $scope.location = UserInfoService.getLocationForSublocation($scope.sublocation_id);
                        $scope.location_id = $scope.location.id;
                        $scope.group_id = $scope.location.group_id;
                    } else {
                        $scope.location = undefined;
                        $scope.location_id = undefined;
                        $scope.group_id = undefined;
                    }
                }
                if ($scope.groups && $scope.group_id) {
                    var group = $scope.groups[$scope.group_id];
                    if (group) {
                        $scope.userclasses = group.userclasses;
                    }
                } else {
                    $scope.userclasses = undefined;
                }
            }
        }
    ]);
