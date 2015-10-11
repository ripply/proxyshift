angular.module('scheduling-app.controllers')
    .controller('RequestShiftController', [
        '$rootScope',
        '$scope',
        '$controller',
        '$timeout',
        'UserSettingService',
        'StateHistoryService',
        'GENERAL_SETTINGS',
        'GENERAL_EVENTS',
        'STATES',
        function($scope,
                 $rootScope,
                 $controller,
                 $timeout,
                 UserSettingsService,
                 StateHistoryService,
                 GENERAL_SETTINGS,
                 GENERAL_EVENTS,
                 STATES
        ) {
            $controller('BaseModelController', {$scope: $scope});
            $scope.close = function() {
                StateHistoryService.returnTo(STATES.SHIFTS);
            };

            var hide = UserSettingsService.get(GENERAL_SETTINGS.NOTIFICATIONS.REQUESTSHIFT.DONTSHOW);

            $scope.afterEnter = function() {
                if (!hide) {
                    showPrompt();
                }
            };

            $scope.beforeLeave = function() {
                hidePrompt();
            };

            $scope.showPrompt = showPrompt;

            var promptLoading = false;

            function showPrompt() {
                if (promptLoading) {
                    return;
                }
                promptLoading = true;
                $rootScope.$emit(GENERAL_EVENTS.POPUP.REQUESTED, function($ionicPopup) {
                    $scope.prompt = $scope.popup = $ionicPopup.show({
                        templateUrl: 'templates/notifications/requestshift.html',
                        title: 'Notice',
                        //subTitle: '(this will only be shown once)',
                        scope: $scope,
                        buttons: [
                            {text: 'OK'}
                        ]
                    });
                    promptLoading = false;
                });
                hide = true;
                //UserSettingsService.save(GENERAL_SETTINGS.NOTIFICATIONS.REQUESTSHIFT.DONTSHOW, true, true);
            }

            function hidePrompt() {
                if ($scope.prompt !== undefined) {
                    $scope.prompt.close();
                    delete $scope.prompt;
                }
            }
        }
    ]);
