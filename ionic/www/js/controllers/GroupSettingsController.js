/**
 * GroupSettingsController
 */
angular.module('scheduling-app.controllers')
    .controller('GroupSettingsController', [
        '$scope',
        '$rootScope',
        '$controller',
        '$stateParams',
        'StateHistoryService',
        'GENERAL_EVENTS',
        'STATES',
        'Restangular',
        'GroupsModel',
        'UserInfoService',
        function($scope,
                 $rootScope,
                 $controller,
                 $stateParams,
                 StateHistoryService,
                 GENERAL_EVENTS,
                 STATES,
                 Restangular,
                 GroupsModel,
                 UserInfoService
        ) {
            $controller('BaseModelController', {$scope: $scope});
            var variableName = 'GroupSettings';

            $scope.pageTitle = "Settings";

            function getGroupId() {
                return $stateParams.group_id;
            }

            $scope[variableName] = {};

            $scope.group_id = getGroupId();
            $scope.currentGroup = UserInfoService.getGroup(getGroupId());

            $scope.groupsList = UserInfoService.getGroupList();

            $scope.close = function close() {
                StateHistoryService.returnTo(STATES.SHIFTS);
            };

            $scope.isPrivilegedGroupMember = function isPrivilegedGroupMember() {
                return UserInfoService.isPrivilegedGroupMember(getGroupId());
            };

            var lastSuccessfullResult = {};

            $scope.fetchSettings = function fetchSettings() {
                Restangular.one("groups", getGroupId())
                    .one("settings")
                    .get()
                    .then(function fetchGroupSettings(result) {
                        result = result.plain();
                        angular.forEach(result, function(value, key) {
                            if (value === 0) {
                                value = false;
                            } else if (value == 1) {
                                value = true;
                            }
                            result[key] = value;
                        });
                        $scope[variableName] = result;
                        lastSuccessfullResult = angular.copy(result);
                    }, function fetchGroupSettingsError(err) {
                        $scope[variableName] = angular.copy(lastSuccessfullResult);
                    })
            };

            $scope.saveSettings = function saveSettings() {
                Restangular.one("groups", getGroupId())
                    .one("settings")
                    .customPOST($scope[variableName])
                    .then(function saveGroupSettingsThen(result, wat) {
                        console.log(result);
                        console.log(wat);
                    }, function saveGroupSettingsError(response) {
                        $scope[variableName] = angular.copy(lastSuccessfullResult);
                        $rootScope.$emit(GENERAL_EVENTS.UPDATES.FAILURE, response);
                    }
                );
            };

            $scope.fetchSettings();

        }]
);
