/**
 * SettingsController
 */
angular.module('scheduling-app.controllers')
    .controller('SettingsController', [
        '$scope',
        '$controller',
        'RemoteUserSettingsService',
        'UsersModel',
        'StateHistoryService',
        'STATES',
        'UserInfoService',
        function($scope,
                 $controller,
                 RemoteUserSettingsService,
                 UsersModel,
                 StateHistoryService,
                 STATES,
                 UserInfoService
        ) {
            $controller('BaseModelController', {$scope: $scope});
            $scope.register(
                'UserSettings',
                UsersModel,
                'settings'
            );
            $scope.isList = false;
            $scope.fetch();

            $scope.version = window.ApiVersion.version;

            $scope.groupsList = UserInfoService.getGroupList();

            $scope.close = function close() {
                StateHistoryService.returnTo(STATES.SHIFTS);
            };

            $scope.localSettings = {
                showIgnoredShifts: UserInfoService.getShowIgnoredShifts(),
                analyticsEnabled: !UserInfoService.getAnalyticsDisabled()
            };

            $scope.$watch('localSettings.showIgnoredShifts', function(newValue, oldValue) {
                UserInfoService.setShowIgnoredShifts(newValue);
            });

            $scope.$watch('localSettings.analyticsEnabled', function(newValue, oldValue) {
                UserInfoService.setAnalyticsDisabled(!newValue);
            });

            $scope.checkForUpdate = window.checkForUpdate;

            $scope.commitSettings = function commitSettings() {
                RemoteUserSettingsService.saveSettings($scope.UserSettings,
                    function saveSettingsSuccess(result) {

                    }, function saveSettingsError(response, lastGoodSettings) {
                        // TODO: Notify user about failure to save settings
                        $scope.UserSettings = lastGoodSettings;
                    });
            }

        }]
);
