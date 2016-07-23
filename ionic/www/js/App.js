// Ionic Starter App

// TODO: Fix this hack that uses a global variable
var sessionHack = [];

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('scheduling-app', [
    'ionic',
    'toastr',
    'ngCookies',
    'ng-mfb',
    'gettext',
    'LocalStorageModule',
    'angular-google-analytics',
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
        'Analytics',
        'StateHistoryService',
        'InitializeServices',
        function($rootScope,
                 $ionicPlatform,
                 SessionService,
                 GENERAL_EVENTS,
                 STATES,
                 Analytics,
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
        'toastrConfig',
        'localStorageServiceProvider',
        'AnalyticsProvider',
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
                 toastrConfig,
                 localStorageServiceProvider,
                 AnalyticsProvider,
                 STATES,
                 GENERAL_CONFIG,
                 CORDOVA_SETTINGS
                 // specifying this as a dependency should set up
                 // listeners on the $rootScope which will keep track
                 // of the previous and current state
                 //StateHistoryService
        ) {
            // https://github.com/markmarijnissen/cordova-app-loader#step-1-bootstrap-your-app
            window.BOOTSTRAP_OK = true;
            $httpProvider.interceptors.push('timeoutHttpIntercept');
            // enables caching of calendar which takes 1-2 seconds to render initially
            $ionicConfigProvider.views.forwardCache(true);
            $ionicConfigProvider.views.transition('none');
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

            var doNotTrack = false;

            if (navigator.doNotTrack == 1) {
                doNotTrack = true;
            } else {
                if (typeof(Storage) !== "undefined") {
                    doNotTrack = localStorage.getItem('doNotTrack') == 1;
                } else {
                    // Sorry! No Web Storage support..
                }
            }

            AnalyticsProvider
                .logAllCalls(true)
                .setHybridMobileSupport(true);

            if (doNotTrack) {
                console.log("DO NOT TRACK DETECTED: DISABLING ANALYTICS");
                AnalyticsProvider
                    .startOffline(true)
                    .disableAnalytics(true);
            } else {
                console.log("ENABLING GOOGLE ANALYTICS: ENABLE DO NOT TRACK TO OPT OUT");
                AnalyticsProvider
                    .setAccount('UA-81239001-1')
                    .setPageEvent('$stateChangeSuccess')
                    .readFromRoute(true)
                    .startOffline(false);
            }

            console.log("APP-uRL=" + GENERAL_CONFIG.APP_URL);

            angular.extend(toastrConfig, {
                //autoDismiss: false,
                containerId: 'toast-container',
                //maxOpened: 0,
                newestOnTop: true,
                positionClass: 'toast-top-center',
                preventDuplicates: false,
                tapToDismiss: true,
                closeButton: false,
                preventOpenDuplicates: true,
                target: 'body'
            });

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

            function requireUserInfo() {

            }

            $stateProvider

                .state('loading', {
                    url: '/loading',
                    templateUrl: "templates/loading.html",
                    controller: "LoadingController"
                })

                .state(STATES.LOGIN, {
                    url: '/login',
                    pageTrack: '/app/login',
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
                    pageTrack: '/app/signup',
                    resolve: {
                        notAuthenticated: requireNoSessionOrBack
                    }
                })

                .state('logout', {
                    url: '/logout',
                    templateUrl: 'templates/logout.html',
                    controller: 'LogoutController',
                    pageTrack: '/app/logout',
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
                    },
                    pageTrack: '/app/home',
                    resolve: {
                        authenticated: requireSessionOrGoLogin
                    }
                })

                .state('app.shift', {
                    url: "/shift/:shift_id",
                    views: {
                        'tabContent': {
                            templateUrl: "templates/shiftinfo.html",
                            controller: 'ShiftInfoController'
                        }
                    },
                    pageTrack: '/app/shift/:shift_id',
                    resolve: {
                        authenticated: requireSessionOrGoLogin
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
                    },
                    pageTrack: '/app/shifts',
                    resolve: {
                        authenticated: requireSessionOrGoLogin
                    }
                })

                .state('app.shifts.open', {
                    url: "/open",
                    pageTrack: '/app/shifts/open',
                    views: {
                        'shiftTabContent': {
                            templateUrl: "templates/shifts.html",
                            controller: 'OpenShiftsController',
                        }
                    }
                })

                .state('app.shifts.open.scroll', {
                    url: "/scroll/:scroll_date",
                    pageTrack: '/app/shifts/open/scroll'
                })

                .state('app.shifts.mine', {
                    url: "/mine",
                    pageTrack: '/app/shifts/mine',
                    views: {
                        'shiftTabContent': {
                            templateUrl: "templates/myshifts.html",
                            controller: 'MyShiftsController',
                        }
                    }
                })

                .state('app.shifts.mine.scroll', {
                    url: "/scroll/:scroll_date",
                    pageTrack: '/app/shifts/mine/scroll'
                })

                .state('app.shifts.manage', {
                    url: "/manage",
                    pageTrack: '/app/shifts/manage',
                    views: {
                        'shiftTabContent': {
                            templateUrl: "templates/manage.html",
                            controller: 'ManagerController',
                        }
                    }
                })

                .state('app.shifts.manage.scroll', {
                    url: "/scroll/:scroll_date",
                    pageTrack: '/app/shifts/manage/scroll'
                })

                .state('app.newshift', {
                    url: "/newshift",
                    abstract: true,
                    views: {
                        'tabContent': {
                            templateUrl: "templates/newshift/newshiftstabs.html",
                            controller: "BaseNewShiftController"
                        }
                    }
                })

                .state('app.newshift.dates', {
                    url: "/dates",
                    pageTrack: '/app/newshift/dates',
                    views: {
                        'newShiftTabContent': {
                            templateUrl: "templates/newshift/dates.html",
                            controller: "DateNewShiftController"
                        }
                    }
                })

                .state('app.newshift.when', {
                    url: "/when/dates/:dates",
                    pageTrack: '/app/newshift/when',
                    views: {
                        'newShiftTabContent': {
                            templateUrl: "templates/newshift/when.html",
                            controller: "WhenNewShiftController"
                        }
                    }
                })

                .state('app.newshift.where', {
                    url: "/where/dates/:dates/when/:when",
                    pageTrack: '/app/newshift/where',
                    views: {
                        'newShiftTabContent': {
                            templateUrl: "templates/newshift/where.html",
                            controller: "WhereNewShiftController"
                        }
                    }
                })

                .state('app.newshift.who', {
                    url: "/who/dates/:dates/when/:when/where/:where",
                    pageTrack: '/app/newshift/who',
                    views: {
                        'newShiftTabContent': {
                            templateUrl: "templates/newshift/who.html",
                            controller: "WhoNewShiftController"
                        }
                    }
                })

                .state('app.newshift.review', {
                    url: "/review/dates/:dates/when/:when/where/:where/who/:who/description/:description/title/:title",
                    pageTrack: '/app/newshift/review',
                    views: {
                        'newShiftTabContent': {
                            templateUrl: "templates/newshift/review.html",
                            controller: "ReviewNewShiftController"
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
                    pageTrack: '/app/requestshift/locations',
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
                    pageTrack: '/app/requestshift/sublocation',
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
                    url: '/sublocation/:sublocation_id/job/:userclass_id',
                    pageTrack: '/app/requestshift/sublocationjob/sublocation/job',
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
                    pageTrack: '/app/requestshift/location',
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
                    pageTrack: '/app/requestshift/locationjob/location/job',
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
                    pageTrack: '/app/settings',
                    templateUrl: "templates/settings/settings.html",
                    controller: 'SettingsController',
                    abstract: true,
                    resolve: {
                        authenticated: requireSessionOrGoLogin
                    }
                })

                .state('settings.user', {
                    url: "/user",
                    pageTrack: '/app/settings/user',
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
                    pageTrack: '/app/settings/group',
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
                    pageTrack: '/app/settings/group/settings',
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
                    pageTrack: '/app/settings/group/members',
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
                    pageTrack: '/app/settings/group/managemembers',
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
                    pageTrack: '/app/settings/group/invite',
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
                    pageTrack: '/app/settings/group/createtype',
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
                    pageTrack: '/app/settings/group/types',
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
                    pageTrack: '/app/settings/group/type',
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
                    pageTrack: '/app/settings/group/newlocation',
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

                .state('settings.group.jobs', {
                    url: "/jobs",
                    pageTrack: '/app/settings/group/jobs',
                    views: {
                        'groupContent': {
                            templateUrl: "templates/jobsubscriptions.html",
                            controller: 'UserJobsController'
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

                .state('settings.group.locations.managing', {
                    url: "/managing",
                    pageTrack: '/app/settings/group/locations/managing',
                    views: {
                        'locationContent': {
                            templateUrl: "templates/managablelocations.html",
                            controller: 'UserLocationsController'
                        }
                    },
                    resolve: {
                        //TODO: Check /userinfo
                    }
                })

                .state('settings.group.locations.managingsubscriptions', {
                    url: "/managingsubscriptions/:location_id",
                    pageTrack: '/app/settings/group/locations/managingsubscriptions',
                    views: {
                        'locationContent': {
                            templateUrl: "templates/managingjobsubscriptions.html",
                            controller: 'ManagingJobsController'
                        }
                    },
                    resolve: {
                        //TODO: Check /userinfo
                    }
                })

                .state('settings.group.locations.subscriptions', {
                    url: "/subscription",
                    pageTrack: '/app/settings/group/locations/subscriptions',
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
                    pageTrack: '/app/settings/group/locations/current',
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
                    pageTrack: '/app/settings/group/locations/list',
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
                    pageTrack: '/app/settings/group/locations/manage',
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
                    pageTrack: '/app/settings/group/locations/newsublocations',
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
                    pageTrack: '/app/settings/group/locations/sublocations/list',
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
                    pageTrack: '/app/settings/group/locations/sublocations/manage',
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
                    pageTrack: '/app/settings/group/locations/users',
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
