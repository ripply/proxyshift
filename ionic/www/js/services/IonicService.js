/**
 * Purpose of this is to not inject ionic into controllers
 * so that the controllers will need minimal modification for desktop views
 */

var splashScreenIsProbablyRunning = true;
setTimeout(function() {
    splashScreenIsProbablyRunning = false;
}, 10000);

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
                if (window.cordova && splashScreenIsProbablyRunning) {
                    // don't show loading screen while splash screen is probably visible
                    // that way we can hide the splash screen without having the loading screen shortly visible
                    // return;
                }
                var templateUrl = 'templates/loading.html';
                if (ionic.Platform.isAndroid()) {
                    templateUrl = 'templates/loading-android.html';
                } else if (ionic.Platform.isIOS()) {
                    templateUrl = 'templates/loading-ios.html';
                }
                $ionicLoading.show({
                    templateUrl: templateUrl,
                    delay: GENERAL_CONFIG.LOADING.DELAY,
                    hideOnStateChange: true,
                    noBackdrop: GENERAL_CONFIG.LOADING.NOBACKDROP
                });
            });

            $rootScope.$on(GENERAL_EVENTS.LOADING.HIDE, function() {
                $ionicLoading.hide();
                if (navigator.splashscreen) {
                    // delay hiding splashscreen slightly so that ionic loading hides
                    // TODO: HACK: FIX THIS MAKE IT HIDE INSTANTLY INSTEAD OF THIS HACK
                    if (splashScreenIsProbablyRunning) {
                        setTimeout(function() {
                            navigator.splashscreen.hide();
                        }, 200);
                    } else {
                        navigator.splashscreen.hide();
                    }
                }
            });

            $rootScope.$on(GENERAL_EVENTS.POPOVER.REQUESTED, function(env, callback) {
                callback($ionicPopover);
            });

            $rootScope.$on(GENERAL_EVENTS.POPUP.REQUESTED, function(env, callback) {
                callback($ionicPopup);
            });

        }
    ]);
