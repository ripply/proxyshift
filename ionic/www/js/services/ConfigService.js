var config_data = {
    'GENERAL_CONFIG': {
        'APP_NAME': 'Scheduling App',
        'APP_VERSION': '0.1',
        'APP_URL': '', // modified during setup to point to correct url
        //'APP_URL_PROD': 'https://www.proxyshift.com',
        'APP_URL_PROD': 'https://guarded-waters-4321.herokuapp.com',
        'APP_URL_DEV': '',
        'APP_URL_API': '/api/v1',
        'APP_URL_LOGIN': '/session/login',
        'APP_URL_LOGOUT': '/session/logout',
        'APP_REMEMBER_ME_TOKEN': 'remember_me',
        'SESSION_RETRY_ACCESSED_RESOURCE_IN': {
            value: 30,
            interval: 'm'
        },
        'LOADING': {
            'NOBACKDROP': false,
            'DELAY': 700 // ms
        },
        'LOGIN_TIMEOUT': 15 * 1000 // milliseconds
    },
    'GENERAL_SETTINGS': {
        'NOTIFICATIONS': {
            'REQUESTSHIFT': {
                'DONTSHOW': 'notify.requestshift.hide'
            }
        }
    },
    'GENERAL_EVENTS': {
        // TODO: NONE OF THESE EVENT NAMES FOLLOW A CONSISTENT PATTERN
        'AUTHENTICATION': {
            'CHECK': 'events:auth-check-authentication',
            'PENDING': 'events:auth-check-pending',
            // This is broadcast by angular-http-auth on 401 code
            'REQUIRED': 'event:auth-loginRequired',
            'CONFIRMED': 'event:auth-loginConfirmed',
            'INVALID': 'event:auth-login-failed-invalid',
            'FAILED': 'event:auth-login-failed'
        },
        'SIGNUP': {
            'REQUIRED': 'event:signup-required',
            'SUCCESS': 'event:signup-successful',
            'FAILED': 'event:signup-failed',
            'COMPLETE': 'event:signup-complete'
        },
        'LOGOUT': {
            'COMPLETE': 'event:auth-logout-complete',
            'FAILED': 'event:auth-logout-failed',
            'REQUESTED': 'event:auth-logout-requested'
        },
        'LOADING': {
            'SHOW': 'event:loading:show',
            'HIDE': 'event:loading:hide'
        },
        'RESETPASSWORD': {
            'HIDE': 'event:resetpassword:hide'
        },
        'TOAST': 'event:toast',
        'SLOW_REQUEST': 'events:slow-request',
        'UPDATES': {
            'USERINFO': {
                'UPDATENEEDED': 'events:updates:userinfo:updateneeded',
                'FAILED': 'events:updates:userinfo:failed',
                'SUCCESS': 'events:updates:userinfo:success',
                'FETCHED': 'events:updates:userinfo:fetched',
                'PROCESSED': 'events:updates:userinfo:processed'
            },
            'FAILURE': 'events:updates:failure',
            'RESOURCE': 'events:updates:resource'
        },
        'POPOVER': {
            'REQUESTED': 'events:popover:requested'
        },
        'POPUP': {
            'REQUESTED': 'events:popup:requested'
        },
        'MODAL': {
            'REQUESTED': 'events:modal:requested'
        },
        'NEWSHIFTS': {
            'RESET': 'events:newshift:reset',
            'DETAILS': 'events:newshift:details',
            'WHERE': 'events:newshift:where',
            'WHO': 'events:newshift:who',
            'REVIEW': 'events:newshift:review'
        },
        'CALENDAR': {
            // events for controlling calendar from outside calendar scope
            'NEXTMONTH': 'events:calendar:nextmonthe',
            'PREVIOUSMONTH': 'events:calendar:previousmonth',
            'CURRENTMONTH': 'events:calendar:currentmonth',
            'UPDATE': {
                'NEEDED': 'events:calendar:update:needed',
                'FETCHING': 'events:calendar:update:fetching',
                'FAILURE': 'events:calendar:update:failure',
                'DONE': 'events:calendar:update:done',
                'RANGE': 'events:calendar:update:range',
                'DATASETUPDATED': 'events:calendar:update:datasetupdated'
            },
            'CLICKED': 'events:calendar:clicked',
            'RESET': 'events:calendar:reset',
            'SHOW': 'events:calendar:show',
            'HIDE': 'events:calendar:hide',
            'TOGGLE': 'events:calendar:toggle',
            'VIEW': 'events:calendar:view',
            'INVALIDATE': 'events:calendar:invalidate'
        },
        'RESOURCE': {
            'UNAUTHORIZED': 'events:resource:unauthorized'
        },
        'SHIFTS': {
            'ACCEPT': 'events:shifts:accept',
            'DECLINE': 'events:shifts:decline',
            'SCROLL': 'events:shifts:scroll'
        }
    },
    'TOKENS': {
        'SESSION': 'connect.sid',
        'REMEMBERME': 'remember_me'
    },
    'STATES': {
        'LOADING': 'loading',
        // TODO DEPRECATE
        'HOME': 'app.home',
        'SHIFTS': 'app.shifts.open',
        'MYSHIFTS': 'app.shifts.mine',
        'MYCALLOUTS': 'app.shifts.callouts',
        'SHIFT_INFO': 'app.shift',
        'SHIFT_REQUEST': 'app.newshift.dates',
        'SHIFT_REQUEST_WHEN': 'app.newshift.when',
        'SHIFT_REQUEST_WHERE': 'app.newshift.where',
        'SHIFT_REQUEST_WHO': 'app.newshift.who',
        'SHIFT_REQUEST_REVIEW': 'app.newshift.review',
        'SETTINGS': 'settings.user',
        'PRIVACYPOLICY': 'settings.privacypolicy',
        'TOS': 'settings.tos',
        'GROUPSETTINGS': 'settings.group',
        'GROUPMEMBERS': 'settings.group.members',
        'SENDINVITE': 'settings.group.invite',
        'CREATESUBCLASS': 'settings.group.createtype',
        'CURRENTLOCATIONS': 'settings.group.locations.current',
        'MANAGELOCATION': 'settings.group.locations.manage',
        'USERLOCATIONS': 'settings.group.locations.subscription',
        'CONFIGURE_JOBS': 'settings.group.jobs',
        'REQUESTSHIFT': 'requestshift.locations',
        'REQUESTSHIFT_LOCATION_SELECTED': 'requestshift.location',
        'REQUESTSHIFT_LOCATION_AND_JOB_SELECTED': 'requestshift.locationjob',
        'REQUESTSHIFT_SUBLOCATION_SELECTED': 'requestshift.sublocation',
        'REQUESTSHIFT_SUBLOCATION_AND_JOB_SELECTED': 'requestshift.sublocationjob',
        'NEWSHIFT': 'app.tabs.newshift',
        'MANAGE': 'app.shifts.manage',
        'LOGIN': 'login',
        'LOGOUT': 'logout',
        'PRIVACY_POLICY': 'app.privacypolicy',
        'LEGAL': 'app.legal',
        'CONTACT_US': 'app.contactus'
    },
    'CORDOVA_SETTINGS': {
        // settings are set by app
        // this ensures that we do not need ionic as dependency
        // just these settings
    }
};

var config_module = angular.module('scheduling-app.config', []);
angular.forEach(config_data,function(key,value) {
    config_module.constant(value,key);
});

config_module.config([
    'GENERAL_CONFIG',
    function(
        GENERAL_CONFIG
    ) {
        var base_url = GENERAL_CONFIG.APP_URL + GENERAL_CONFIG.APP_URL_API;
    }
]);
