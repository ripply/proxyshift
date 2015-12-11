/**
 * GroupSettingsController
 */
angular.module('scheduling-app.controllers')
    .controller('GroupSettingsController', [
        '$scope',
        '$rootScope',
        '$controller',
        'StateHistoryService',
        'STATES',
        'UserInfoService',
        function($scope,
                 $rootScope,
                 $controller,
                 StateHistoryService,
                 STATES,
                 UserInfoService
        ) {
            $controller('BaseModelController', {$scope: $scope});

            $scope.pageTitle = "Settings";

            var url = window.location.href;
            var id = url.split('/').pop();

            $scope.currentGroup = UserInfoService.getGroup(id);

            $scope.settingsList = [
                { text: "Everyone Can Create Shifts", checked: true},
                { text: "Shifts Need Confirmation", checked: false}
            ];

            $scope.close = function() {
                StateHistoryService.returnTo(STATES.SHIFTS);
            };

        }]
);
