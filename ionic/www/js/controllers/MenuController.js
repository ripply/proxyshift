angular.module('scheduling-app.controllers')

    .controller('MenuController', [
        '$scope',
        '$ionicModal',
        function($scope,
                 $ionicModal
        ) {
            $ionicModal.fromTemplateUrl('templates/settings.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $scope.settingsModal = modal;
            });

            $scope.openSettings = function() {
                $scope.settingsModal.show();
            };

            $scope.closeSettings = function() {
                $scope.settingsModal.hide();
            };
        }
    ]);
