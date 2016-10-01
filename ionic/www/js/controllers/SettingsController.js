/**
 * SettingsController
 */
angular.module('scheduling-app.controllers')
    .controller('SettingsController', [
        '$scope',
        '$controller',
        'RemoteUserSettingsService',
        'UsersModel',
        'SupportModel',
        'StateHistoryService',
        'STATES',
        'UserInfoService',
        function($scope,
                 $controller,
                 RemoteUserSettingsService,
                 UsersModel,
                 SupportModel,
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
                errorReporting: !UserInfoService.getDisableErrorReporting(),
                analyticsEnabled: !UserInfoService.getAnalyticsDisabled()
            };

            $scope.$watch('localSettings.showIgnoredShifts', function(newValue, oldValue) {
                UserInfoService.setShowIgnoredShifts(newValue);
            });

            $scope.$watch('localSettings.analyticsEnabled', function(newValue, oldValue) {
                UserInfoService.setAnalyticsDisabled(!newValue);
            });

            $scope.$watch('localSettings.errorReporting', function(newValue, oldValue) {
                UserInfoService.setDisableErrorReporting(!newValue);
            });

            $scope.checkForUpdate = window.checkForUpdate;

            $scope.commitSettings = function commitSettings() {
                RemoteUserSettingsService.saveSettings($scope.UserSettings,
                    function saveSettingsSuccess(result) {

                    }, function saveSettingsError(response, lastGoodSettings) {
                        // TODO: Notify user about failure to save settings
                        $scope.UserSettings = lastGoodSettings;
                    });
            };

            $scope.support = {
                message: ''
            };
            $scope.saving = false;

            $scope.submitSupportInquiry = function() {
                if ($scope.saving ||
                    $scope.support.message == '' ||
                    $scope.support.message === undefined) {
                    return;
                }
                $scope.saving = true;
                SupportModel.inquiry(
                    $scope.support,
                    function success() {
                        $scope.saving = false;
                    }, function error(error) {
                        $scope.saving = false;
                    });
            }

        }]
);
