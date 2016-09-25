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
        'ResourceService',
        'GroupsModel',
        'UserInfoService',
        function($scope,
                 $rootScope,
                 $controller,
                 $stateParams,
                 StateHistoryService,
                 GENERAL_EVENTS,
                 STATES,
                 ResourceService,
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

            var lastSuccessfulResult = {};

            $scope.fetchSettings = function fetchSettings() {
                ResourceService.getGroupSettings(
                    getGroupId(),
                    function fetchGroupSettings(result) {
                        angular.forEach(result, function(value, key) {
                            if (value === 0) {
                                value = false;
                            } else if (value == 1) {
                                value = true;
                            }
                            result[key] = value;
                        });
                        $scope[variableName] = result;
                        lastSuccessfulResult = angular.copy(result);
                    }, function fetchGroupSettingsError(err) {
                        $scope[variableName] = angular.copy(lastSuccessfulResult);
                    }
                );
            };

            $scope.saveSettings = function saveSettings() {
                ResourceService.saveGroupSettings(
                    getGroupId(),
                    $scope[variableName],
                    function saveGroupSettingsThen(result, wat) {
                    }, function saveGroupSettingsError(response) {
                        $scope[variableName] = angular.copy(lastSuccessfulResult);
                        $rootScope.$emit(GENERAL_EVENTS.UPDATES.FAILURE, response);
                    }
                );
            };

            $scope.fetchSettings();

        }]
);
