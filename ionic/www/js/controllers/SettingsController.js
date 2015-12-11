/**
 * SettingsController
 */
angular.module('scheduling-app.controllers')
    .controller('SettingsController', [
        '$scope',
        '$controller',
        'RemoteUserSettingsService',
        'UserSettingsModel',
        'StateHistoryService',
        'STATES',
        'UserInfoService',
        function($scope,
                 $controller,
                 RemoteUserSettingsService,
                 UserSettingsModel,
                 StateHistoryService,
                 STATES,
                 UserInfoService
        ) {
            $controller('BaseModelController', {$scope: $scope});
            $scope.register(
                'UserSettings',
                UserSettingsModel,
                undefined
            );
            $scope.isList = false;
            $scope.fetch();

            $scope.groupsList = UserInfoService.getGroupList();

            $scope.close = function close() {
                StateHistoryService.returnTo(STATES.SHIFTS);
            };

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
