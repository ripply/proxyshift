/**
 * SettingsController
 */
angular.module('scheduling-app.controllers')
    .controller('SettingsController', [
        '$rootScope',
        '$scope',
        '$controller',
        'RemoteUserSettingsService',
        'UsersModel',
        'SupportModel',
        'StateHistoryService',
        'STATES',
        'GENERAL_EVENTS',
        'UserInfoService',
        function($rootScope,
                 $scope,
                 $controller,
                 RemoteUserSettingsService,
                 UsersModel,
                 SupportModel,
                 StateHistoryService,
                 STATES,
                 GENERAL_EVENTS,
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
            $scope.error = undefined;

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
                        $scope.error = false;
                        $scope.support.message = '';
                        $rootScope.$broadcast(GENERAL_EVENTS.TOAST, 'info', 'Submitted support inquiry');
                    }, function error(error) {
                        $scope.saving = false;
                        $scope.error = true;
                        $rootScope.$broadcast(GENERAL_EVENTS.TOAST, 'error', 'Error submitting support inquiry');
                    });
            }

        }]
);
