// Ionic Starter App

// TODO: Fix this hack that uses a global variable
var sessionHack = [];

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('scheduling-app', [
    'ionic',
    'ngCookies',
    'gettext',
    'restangular',
    'LocalStorageModule',
    'scheduling-app.controllers',
    'scheduling-app.authentication',
    'scheduling-app.models',
    'scheduling-app.session',
    'scheduling-app.directives',
    'scheduling-app.cookies',
    'scheduling-app.config',
    'scheduling-app.services.routing.statehistory',
    'scheduling-app.services.initialize',
    'scheduling-app.validation'
])

    .run([
        '$rootScope',
        '$ionicPlatform',
        'SessionService',
        'GENERAL_EVENTS',
        'STATES',
        'StateHistoryService',
        'InitializeServices',
        function($rootScope,
                 $ionicPlatform,
                 SessionService,
                 GENERAL_EVENTS,
                 STATES,
                 StateHistoryService,
                 InitializeServices) {
            sessionHack.push(SessionService);
            StateHistoryService.setDefaultState(STATES.HOME);
            function triggerAuthenticationCheck() {
                console.log("Triggering auth check");
                $rootScope.$broadcast(GENERAL_EVENTS.AUTHENTICATION.CHECK);
            }
            $ionicPlatform.ready(function() {
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)
                if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                }
                if (window.StatusBar) {
                    // org.apache.cordova.statusbar required
                    StatusBar.styleDefault();
                }
                triggerAuthenticationCheck();
            });
        }])

    .config([
        '$stateProvider',
        '$urlRouterProvider',
        '$injector',
        '$provide',
        '$ionicConfigProvider',
        'RestangularProvider',
        'localStorageServiceProvider',
        'STATES',
        'GENERAL_CONFIG',
        'CORDOVA_SETTINGS',
        //'StateHistoryService',
        function($stateProvider,
                 $urlRouterProvider,
                 $injector,
                 $provide,
                 $ionicConfigProvider,
                 RestangularProvider,
                 localStorageServiceProvider,
                 STATES,
                 GENERAL_CONFIG,
                 CORDOVA_SETTINGS
                 // specifying this as a dependency should set up
                 // listeners on the $rootScope which will keep track
                 // of the previous and current state
                 //StateHistoryService
        ) {
            // enables caching of calendar which takes 1-2 seconds to render initially
            $ionicConfigProvider.views.forwardCache(true);
            CORDOVA_SETTINGS.isWebView = ionic.Platform.isWebView();
            CORDOVA_SETTINGS.isIPad = ionic.Platform.isIPad();
            CORDOVA_SETTINGS.isIOS = ionic.Platform.isIOS();
            CORDOVA_SETTINGS.isAndroid = ionic.Platform.isAndroid();
            CORDOVA_SETTINGS.isWindowsPhone = ionic.Platform.isWindowsPhone();
            CORDOVA_SETTINGS.currentPlatform = ionic.Platform.platform();
            CORDOVA_SETTINGS.currentPlatformVersion = ionic.Platform.version();

            if (CORDOVA_SETTINGS.isWebView) {
                GENERAL_CONFIG.APP_URL = GENERAL_CONFIG.APP_URL_PROD;
                console.log("Detected running inside a webview using api source: " + GENERAL_CONFIG.APP_URL_PROD);
            } else if (window.cordova) {
                GENERAL_CONFIG.APP_URL = GENERAL_CONFIG.APP_URL_PROD;
                console.log("Detected cordova, using api source: " + GENERAL_CONFIG.APP_URL_PROD);
            } else if (document.location.protocol == "file:") {
                GENERAL_CONFIG.APP_URL = GENERAL_CONFIG.APP_URL_PROD;
                console.log("Detected running in ionic view, using api source: " + GENERAL_CONFIG.APP_URL_PROD);
            } else {
                GENERAL_CONFIG.APP_URL = GENERAL_CONFIG.APP_URL_DEV;
                console.log("Running in browser using dev api source: " + GENERAL_CONFIG.APP_URL);
            }
            // update restangular configuration so that models will use new base url
            var base_url = GENERAL_CONFIG.APP_URL + GENERAL_CONFIG.APP_URL_API;
            RestangularProvider.setBaseUrl(base_url);
            //RestangularConfig.configure();

            // Services cannot be asked for during config
            // instead, ask for injector provider and
            // use it to grab the service during runtime
            var SessionService = null;
            function getSessionService() {
                try {
                    if (SessionService === null ||
                        SessionService === undefined) {
                        // This creates a second instance of SessionService which ends up having two instances consume token at once
                        // the server consumes the token for the first request then rejects the second request and user fails to login
                        // this hack uses a global variable to grab the instance used in run above
                        SessionService = sessionHack[0];
                        //SessionService = $injector.get('SessionServiceProvider').$get();
                    }
                } catch (err) {
                    console.debug(err);
                }
                return SessionService;
            }

            function requireSession() {
                var sess = getSessionService();
                if (sess) {
                    return sess.requrieSession();
                } else {
                    return false;
                }
            }

            function requireSessionOrBack() {
                var sess = getSessionService();
                if (sess) {
                    return sess.requireSessionOrBack();
                } else {
                    return false;
                }
            }

            function requireSessionOrGoLogin() {
                var sess = getSessionService();
                if (sess) {
                    return sess.requireSessionOrGoLogin();
                } else {
                    return false;
                }
            }

            function requireNoSession() {
                var sess = getSessionService();
                if (sess) {
                    return sess.requireNoSession();
                } else {
                    return false;
                }
            }

            function requireNoSessionOrBack() {
                var sess = getSessionService();
                if (sess) {
                    return sess.requireNoSessionOrBack();
                } else {
                    return false;
                }
            }

            $stateProvider

                .state('loading', {
                    url: '/loading',
                    templateUrl: "templates/loading.html",
                    controller: "LoadingController"
                })

                .state(STATES.LOGIN, {
                    url: '/login',
                    templateUrl: "templates/login.html",
                    controller: 'LoginController',
                    resolve: {
                        notAuthenticated: requireNoSessionOrBack
                    }
                })

                .state('signup', {
                    url: '/signup',
                    templateUrl: "templates/signup.html",
                    controller: 'LoginController',
                    resolve: {
                        notAuthenticated: requireNoSessionOrBack
                    }
                })

                .state('logout', {
                    url: '/logout',
                    templateUrl: 'templates/logout.html',
                    controller: 'LogoutController',
                    resolve: {
                        //authenticated: requireSessionOrBack
                    }
                })

                .state('app', {
                    url: "/app",
                    abstract: true,
                    templateUrl: "templates/menu.html",
                    controller: 'MenuController',
                    resolve: {
                        authenticated: requireSessionOrGoLogin
                    }
                })

                .state('app.tabs', {
                    url: "/tabs",
                    abstract: true,
                    views: {
                        'menuContent': {
                            templateUrl: "templates/tabs.html",
                            controller: 'AppCtrl',
                        },
                        'menu': {
                            templateUrl: "templates/menuimpl.html",
                            controller: 'AppCtrl',
                        }
                    }
                })

                .state('app.tabs.shifts', {
                    url: "/shifts",
                    views: {
                        'tabContent': {
                            templateUrl: "templates/shifts.html",
                            controller: 'OpenShiftsController',
                        }
                    }
                })

                .state('app.tabs.openshifts', {
                    url: "/openshifts",
                    views: {
                        'tabContent': {
                            templateUrl: "templates/openshifts.html",
                            controller: 'OpenShiftsController',
                        }
                    }
                })

                .state('app.tabs.manage', {
                    url: "/manage",
                    views: {
                        'tabContent': {
                            templateUrl: "templates/manage.html",
                            controller: 'ManageController',
                        }
                    }
                })

                .state('requestshift', {
                    url: "/requestshift",
                    templateUrl: "templates/requestshift.html",
                    controller: 'RequestShiftController',
                    resolve: {
                        //TODO: Check /userinfo
                    }
                })

                .state('settings', {
                    url: "/settings",
                    templateUrl: "templates/settings.html",
                    controller: 'SettingsController',
                    resolve: {
                        //TODO: Check /userinfo
                    }
                })

                .state('app.privacypolicy', {
                    url: "/privacypolicy",
                    views: {
                        'menuContent': {
                            templateUrl: "templates/privacypolicy.html"
                        }
                    }
                })

                .state('app.legal', {
                    url: "/legal",
                    views: {
                        'menuContent': {
                            templateUrl: "templates/legal.html"
                        }
                    }
                })

                .state('app.contactus', {
                    url: "/contactus",
                    views: {
                        'menuContent': {
                            templateUrl: "templates/contactus.html"
                        }
                    }
                })

                .state('app.single', {
                    url: "/playlists/:playlistId",
                    views: {
                        'menuContent': {
                            templateUrl: "templates/playlist.html",
                            controller: 'PlaylistCtrl'
                        }
                    }
                })

                .state('app.groups', {
                    url: "/groups",
                    views: {
                        'menuContent': {
                            templateUrl: "templates/groups.html",
                            controller: 'GroupsController'
                        }
                    }
                })

                .state('app.creategroup', {
                    url: "/creategroup",
                    views: {
                        'menuContent': {
                            templateUrl: "templates/creategroup.html",
                            controller: 'CreateGroupController'
                        }
                    }
                })

                .state('app.groupsettings', {
                    url: "/groups/:id/settings",
                    views: {
                        'menuContent': {
                            templateUrl: "templates/editgroup.html",
                            controller: 'EditGroupController'
                        }
                    }
                });

            //StateHistoryService.setDefaultState('app.playlists');
            // if none of the above states are matched, use this as the fallback
            $urlRouterProvider.otherwise(STATES.LOGIN);
        }]);
