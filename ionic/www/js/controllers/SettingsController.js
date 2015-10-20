/**
 * SettingsController
 */
angular.module('scheduling-app.controllers')
    .controller('SettingsController', [
        '$scope',
        'StateHistoryService',
        'STATES',
        'UserInfoService',
        function($scope, StateHistoryService, STATES, UserInfoService) {

            $scope.settingsList = [
                { text: "Push Notifications", checked: true },
                { text: "Text Notifications", checked: false },
                { text: "Email Notifications", checked: false }
            ];

            $scope.groupsList = UserInfoService.getGroupList();

            $scope.openGroupSettings = function() {
                StateHistoryService.addToGotoHistory();
            };

            $scope.close = function() {
                StateHistoryService.returnTo(STATES.SHIFTS);
            };

        }]
);
