//factory for processing push notifications.
angular.module('scheduling-app.services')
    .service('CreateShiftService', [
        '$rootScope',
        '$ionicModal',
        'CORDOVA_SETTINGS',
        function(
            $rootScope,
            $ionicModal,
            CORDOVA_SETTINGS
        ) {
            this.showModal = showModal;
            var loading = 'loading';

            function showModal($scope) {
                if ($rootScope.createShiftModal) {
                    if ($rootScope.createShiftModal != loading) {
                        $rootScope.$broadcast('modal:createshift:reset');
                        $rootScope.createShiftModal.show();
                    }
                } else {
                    $ionicModal.fromTemplateUrl('templates/modal/createshift.html', {
                        scope: $scope
                    })
                        .then(function (modal) {
                            $rootScope.createShiftModal = modal;
                            modal.show();
                        });
                }
            }

            this.closeShiftModal = function() {
                if ($rootScope.createShiftModal) {
                    $rootScope.createShiftModal.hide();
                }
            };
        }
    ]
);
