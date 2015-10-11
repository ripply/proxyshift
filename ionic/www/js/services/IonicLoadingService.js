angular.module('scheduling-app.loading', [
    'ionic',
    'scheduling-app.config'
])
    .service('IonicLoadingService', [
        '$rootScope',
        '$ionicLoading',
        'GENERAL_EVENTS',
        'GENERAL_CONFIG',
        function(
            $rootScope,
            $ionicLoading,
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

        }
    ]);
