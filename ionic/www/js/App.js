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
    'ng-mfb',
    'gettext',
    'LocalStorageModule',
    'ionic-fancy-select',
    'scheduling-app.controllers',
    'scheduling-app.authentication',
    'scheduling-app.session',
    'scheduling-app.resources',
    'scheduling-app.directives',
    'scheduling-app.cookies',
    'scheduling-app.config',
    'scheduling-app.services.routing.statehistory',
    'scheduling-app.services.initialize',
    'scheduling-app.validation'
])
    .factory('timeoutHttpIntercept', function () {
        return {
            'request': function(config) {
                config.timeout = 300000;
                return config;
            }
        };
    })

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
                ionic.Platform.fullScreen();
                if (window.StatusBar) {
                    // org.apache.cordova.statusbar required
                    //StatusBar.styleDefault();
                    StatusBar.hide();
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
        '$resourceProvider',
        '$httpProvider',
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
                 $resourceProvider,
                 $httpProvider,
                 localStorageServiceProvider,
                 STATES,
                 GENERAL_CONFIG,
                 CORDOVA_SETTINGS
                 // specifying this as a dependency should set up
                 // listeners on the $rootScope which will keep track
                 // of the previous and current state
                 //StateHistoryService
        ) {
            $httpProvider.interceptors.push('timeoutHttpIntercept');
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

            console.log("APP-uRL=" + GENERAL_CONFIG.APP_URL);

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
                    templateUrl: "templates/tabs.html",
                    controller: 'MenuController',
                    resolve: {
                        authenticated: requireSessionOrGoLogin
                    }
                })

                .state('app.home', {
                    url: "/home",
                    views: {
                        'tabContent': {
                            templateUrl: "templates/home.html",
                            controller: 'AppCtrl',
                        }
                    }
                })

                .state('app.shift', {
                    url: "/shift/:shift_id",
                    views: {
                        'tabContent': {
                            templateUrl: "templates/shiftinfo.html",
                            controller: 'ShiftInfoController'
                        }
                    }
                })

                .state('app.shifts', {
                    url: "/shifts",
                    abstract: true,
                    views: {
                        'tabContent': {
                            templateUrl: "templates/shifttabs.html",
                            controller: 'OpenShiftsTabController'
                        }
                    }
                })

                .state('app.shifts.open', {
                    url: "/open",
                    views: {
                        'shiftTabContent': {
                            templateUrl: "templates/shifts.html",
                            controller: 'OpenShiftsController',
                        }
                    }
                })

                .state('app.shifts.mine', {
                    url: "/mine",
                    views: {
                        'shiftTabContent': {
                            templateUrl: "templates/myshifts.html",
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

                .state('app.tabs.myshifts', {
                    url: "/myshifts",
                    views: {
                        'tabContent': {
                            templateUrl: "templates/myshifts.html",
                            controller: 'MyShiftsController',
                        }
                    }
                })

                .state('app.shifts.manage', {
                    url: "/manage",
                    views: {
                        'shiftTabContent': {
                            templateUrl: "templates/manage.html",
                            controller: 'ManagerController',
                        }
                    }
                })

                .state('app.tabs.manage_shift', {
                    url: "/manageshift/:shift_id",
                    views: {
                        'tabContent': {
                            templateUrl: "templates/manageshift.html",
                            controller: 'ManageShiftController',
                        }
                    }
                })

                .state('requestshift', {
                    url: "/requestshift",
                    abstract: true,
                    templateUrl: "templates/requestshift.html",
                    controller: 'RequestShiftController',
                    resolve: {
                        //TODO: Check /userinfo
                    }
                })

                .state('requestshift.locations', {
                    url: "/locations",
                    resolve: {
                        //TODO: Check /userinfo
                    },
                    views: {
                        'content': {
                            templateUrl: "templates/requestshift/selectlocation.html",
                            controller: 'RequestShiftSelectLocationController'
                        }
                    }
                })

                .state('requestshift.sublocation', {
                    url: "/sublocation/:sublocation_id",
                    resolve: {
                        //TODO: Check /userinfo
                    },
                    views: {
                        'content': {
                            templateUrl: "templates/requestshift/selectjob.html",
                            controller: 'RequestShiftSelectUserClassController'
                        }
                    }
                })

                .state('requestshift.sublocationjob', {
                    url: "/sublocation/:sublocation_id/job/:userclass_id",
                    resolve: {
                        //TODO: Check /userinfo
                    },
                    views: {
                        'content': {
                            templateUrl: "templates/requestshift/createshift.html",
                            controller: 'RequestShiftCreateShiftController'
                        }
                    }
                })

                .state('requestshift.location', {
                    url: "/location/:location_id",
                    resolve: {
                        //TODO: Check /userinfo
                    },
                    views: {
                        'content': {
                            templateUrl: "templates/requestshift/selectjob.html",
                            controller: 'RequestShiftSelectUserClassController'
                        }
                    }
                })

                .state('requestshift.locationjob', {
                    url: "/location/:location_id/job/:userclass_id",
                    resolve: {
                        //TODO: Check /userinfo
                    },
                    views: {
                        'content': {
                            templateUrl: "templates/requestshift/createshift.html",
                            controller: 'RequestShiftCreateShiftController'
                        }
                    }
                })

                .state('settings', {
                    url: "/settings",
                    templateUrl: "templates/settings/settings.html",
                    controller: 'SettingsController',
                    abstract: true,
                    resolve: {
                        //TODO: Check /userinfo
                    }
                })

                .state('settings.user', {
                    url: "/user",
                    templateUrl: "templates/usersettings.html",
                    controller: 'SettingsController',
                    views: {
                        'content': {
                            templateUrl: "templates/usersettings.html",
                            controller: 'SettingsController'
                        }
                    },
                    resolve: {
                        //TODO: Check /userinfo
                    }
                })

                .state('settings.group', {
                    url: "/group/:group_id",
                    views: {
                        'content': {
                            templateUrl: "templates/settings/settingsgroup.html"
                        }
                    },
                    resolve: {
                        //TODO: Check /userinfo
                    }
                })

                .state('settings.group.settings', {
                    url: "/settings",
                    views: {
                        'groupContent': {
                            templateUrl: "templates/groupsettings.html",
                            controller: 'GroupSettingsController'
                        }
                    },
                    resolve: {
                        //TODO: Check /userinfo
                    }
                })

                .state('settings.group.members', {
                    url: "/members",
                    resolve: {
                        //TODO: Check /userinfo
                    },
                    views: {
                        'groupContent': {
                            templateUrl: "templates/currentgroupmembers.html",
                            controller: 'GroupMembersController'
                        }
                    }
                })

                .state('settings.group.managemembers', {
                    url: "/members/:user_id/manage",
                    resolve: {
                        //TODO: Check /userinfo
                    },
                    views: {
                        'groupContent': {
                            templateUrl: "templates/settingsgroupmembersmanage.html",
                            controller: 'GroupMembersController'
                        }
                    }
                })

                .state('settings.group.invite', {
                    url: "/invite",
                    resolve: {
                        //TODO: Check /userinfo
                    },
                    views: {
                        'groupContent': {
                            templateUrl: "templates/invitemember.html",
                            controller: 'BaseSendInviteDirectiveController'
                        }
                    }
                })

                .state('settings.group.createtype', {
                    url: "/createtype",
                    resolve: {
                        //TODO: Check /userinfo
                    },
                    views: {
                        'groupContent': {
                            templateUrl: "templates/types/typecreate.html",
                            controller: 'JobTypeController'
                        }
                    }
                })

                .state('settings.group.types', {
                    url: "/types",
                    views: {
                        'groupContent': {
                            templateUrl: "templates/types/typelist.html",
                            controller: 'JobTypeController'
                        }
                    },
                    resolve: {
                        //TODO: Check /userinfo
                    }
                })

                .state('settings.group.type', {
                    url: "/type/:type_id",
                    views: {
                        'groupContent': {
                            templateUrl: "templates/types/typeedit.html",
                            controller: 'JobTypeController'
                        }
                    },
                    resolve: {
                        //TODO: Check /userinfo
                    }
                })

                .state('settings.group.newlocation', {
                    url: "/newlocation",
                    views: {
                        'groupContent': {
                            templateUrl: "templates/locations/locationcreate.html",
                            controller: 'LocationEditorController'
                        }
                    },
                    resolve: {
                        //TODO: Check /userinfo
                    }
                })

                .state('settings.group.locations', {
                    url: "/locations",
                    abstract: true,
                    views: {
                        'groupContent': {
                            templateUrl: "templates/locations.html"
                        }
                    },
                    resolve: {
                        //TODO: Check /userinfo
                    }
                })

                .state('settings.group.locations.subscriptions', {
                    url: "/subscription",
                    resolve: {
                        //TODO: Check /userinfo
                    },
                    views: {
                        'locationContent': {
                            templateUrl: "templates/locationsubscriptions.html",
                            controller: 'UserLocationsController'
                        }
                    }
                })

                .state('settings.group.locations.current', {
                    url: "/current",
                    resolve: {
                        //TODO: Check /userinfo
                    },
                    views: {
                        'locationContent': {
                            templateUrl: "templates/currentlocations.html",
                            controller: 'GroupLocationsController'
                        }
                    }
                })

                .state('settings.group.locations.list', {
                    url: "/:location_id/list",
                    resolve: {
                        //TODO: Check /userinfo
                    },
                    views: {
                        'locationContent': {
                            templateUrl: "templates/locations/locationlist.html",
                            controller: 'GroupLocationsController'
                        }
                    }
                })

                .state('settings.group.locations.manage', {
                    url: "/:location_id/manage",
                    resolve: {
                        //TODO: Check /userinfo
                    },
                    views: {
                        'locationContent': {
                            templateUrl: "templates/locations/locationedit.html",
                            controller: 'LocationEditorController'
                        }
                    }
                })

                .state('settings.group.locations.newsublocation', {
                    url: "/:location_id/new",
                    resolve: {
                        //TODO: Check /userinfo
                    },
                    views: {
                        'locationContent': {
                            templateUrl: "templates/sublocations/sublocationcreate.html",
                            controller: 'LocationEditorController'
                        }
                    }
                })

                .state('settings.group.locations.sublocations', {
                    url: "/:location_id/sublocations",
                    abstract: true,
                    resolve: {
                        //TODO: Check /userinfo
                    },
                    views: {
                        'locationContent': {
                            templateUrl: "templates/sublocations.html"
                        }
                    }
                })

                .state('settings.group.locations.sublocations.list', {
                    url: "/:sublocation_id/list",
                    resolve: {
                        //TODO: Check /userinfo
                    },
                    views: {
                        'sublocationContent': {
                            templateUrl: "templates/sublocationslist.html",
                            controller: 'GroupLocationsController'
                        }
                    }
                })

                .state('settings.group.locations.sublocations.manage', {
                    url: "/:sublocation_id/manage",
                    resolve: {
                        //TODO: Check /userinfo
                    },
                    views: {
                        'sublocationContent': {
                            templateUrl: "templates/managelocation.html",
                            controller: 'LocationEditorController'
                        }
                    }
                })

                .state('settings.group.locations.users', {
                    url: "/:location_id/users",
                    resolve: {
                        //TODO: CHECK USERINFO, MUST BE PRIVILEGED USER OF THE LOCATION
                    },
                    views: {
                        'locationContent': {
                            templateUrl: "templates/grouplocationsmanageusers.html",
                            controller: 'BaseUsersListController'
                        }
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

                .state('groupinvitation', {
                    url: "/groupinvitation/:invititation_id",
                    templateUrl: "templates/groupinvitation.html",
                    controller: 'GroupInvitationController',
                    resolve: {
                        //TODO: Check /userinfo
                    }
                })

                .state('invitation', {
                    url: "/invitation/:invititation_id",
                    templateUrl: "templates/invitation.html",
                    controller: 'InvitationController',
                    resolve: {
                        //TODO: Check /userinfo
                    }
                });

            //StateHistoryService.setDefaultState('app.playlists');
            // if none of the above states are matched, use this as the fallback
            $urlRouterProvider.otherwise(STATES.LOGIN);
        }]);
