/**
 * Purpose of this is to not inject ionic into controllers
 * so that the controllers will need minimal modification for desktop views
 */
angular.module('scheduling-app.loading', [
    'ionic',
    'scheduling-app.config'
])
    .service('IonicService', [
        '$rootScope',
        '$ionicLoading',
        '$ionicPopover',
        '$ionicPopup',
        '$ionicModal',
        'GENERAL_EVENTS',
        'GENERAL_CONFIG',
        function(
            $rootScope,
            $ionicLoading,
            $ionicPopover,
            $ionicPopup,
            $ionicModal,
            GENERAL_EVENTS,
            GENERAL_CONFIG
        ) {
            $rootScope.$on(GENERAL_EVENTS.LOADING.SHOW, function() {
                $ionicLoading.show({
                    templateUrl: 'templates/loading.html',
                    delay: GENERAL_CONFIG.LOADING.DELAY,
                    noBackDrop: GENERAL_CONFIG.LOADING.NOBACKDROP
                });
            });

            $rootScope.$on(GENERAL_EVENTS.LOADING.HIDE, function() {
                $ionicLoading.hide();
            });

            $rootScope.$on(GENERAL_EVENTS.POPOVER.REQUESTED, function(env, callback) {
                callback($ionicPopover);
            });

            $rootScope.$on(GENERAL_EVENTS.POPUP.REQUESTED, function(env, callback) {
                callback($ionicPopup);
            });

        }
    ]);
