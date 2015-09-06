// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('scheduling-app', [
    'ionic',
    'ngCookies',
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
        'GENERAL_EVENTS',
        'StateHistoryService',
        'InitializeServices',
        function($rootScope,
                 $ionicPlatform,
                 GENERAL_EVENTS,
                 StateHistoryService,
                 InitializeServices) {
            StateHistoryService.setDefaultState('app.playlists');
            function triggerAuthenticationCheck() {
                console.log("Triggering auth check");
                $rootScope.$broadcast(GENERAL_EVENTS.AUTHENTICATION.CHECK);
            }
            $ionicPlatform.ready(function() {
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)
                if (window.cordova && window.cordova.plugins.Keyboard) {
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
        'STATES',
        'GENERAL_CONFIG',
        'CORDOVA_SETTINGS',
        //'StateHistoryService',
        function($stateProvider,
                 $urlRouterProvider,
                 $injector,
                 STATES,
                 GENERAL_CONFIG,
                 CORDOVA_SETTINGS
                 // specifying this as a dependency should set up
                 // listeners on the $rootScope which will keep track
                 // of the previous and current state
                 //StateHistoryService
        ) {
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
            } else {
                console.log("Running in browser using api source: " + GENERAL_CONFIG.APP_URL);
            }
            //RestangularConfig.configure();

            // Services cannot be asked for during config
            // instead, ask for injector provider and
            // use it to grab the service during runtime
            var SessionService = null;
            function getSessionService() {
                try {
                    if (SessionService === null ||
                        SessionService === undefined) {
                        SessionService = $injector.get('SessionServiceProvider').$get();
                    }
                } catch (err) {
                    console.debug(err);
                }
                return SessionService;
            }

            function requireSession() {
                return getSessionService().requireSession();
            }

            function requireSessionOrBack() {
                return getSessionService().requireSessionOrBack();
            }

            function requireSessionOrGoLogin() {
                return getSessionService().requireSessionOrGoLogin();
            }

            function requireNoSession() {
                return getSessionService().requireNoSession();
            }

            function requireNoSessionOrBack() {
                return getSessionService().requireNoSessionOrBack();
            }

            $stateProvider

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
                    controller: 'AppCtrl',
                    resolve: {
                        authenticated: requireSessionOrGoLogin
                    }
                })

                .state('app.search', {
                    url: "/search",
                    views: {
                        'menuContent': {
                            templateUrl: "templates/search.html"
                        }
                    }
                })

                .state('app.browse', {
                    url: "/browse",
                    views: {
                        'menuContent': {
                            templateUrl: "templates/browse.html"
                        }
                    }
                })

                .state(STATES.HOME, {
                    url: "/playlists",
                    views: {
                        'menuContent': {
                            templateUrl: "templates/playlists.html",
                            controller: 'PlaylistsCtrl'
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

            STATES.wut = 'hey';

            //StateHistoryService.setDefaultState('app.playlists');
            // if none of the above states are matched, use this as the fallback
            $urlRouterProvider.otherwise('/app/playlists');
        }]);
