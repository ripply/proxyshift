var config_data = {
    'GENERAL_CONFIG': {
        'APP_NAME': 'Scheduling App',
        'APP_VERSION': '0.1',
        'APP_URL': '', // modified during setup to point to correct url
        'APP_URL_PROD': 'https://guarded-waters-3652.herokuapp.com',
        'APP_URL_DEV': '',
        'APP_URL_API': '/api',
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
            'VIEW': 'events:calendar:view',
            'INVALIDATE': 'events:calendar:invalidate'
        }
    },
    'TOKENS': {
        'SESSION': 'connect.sid',
        'REMEMBERME': 'remember_me'
    },
    'STATES': {
        'LOADING': 'loading',
        // TODO DEPRECATE
        'HOME': 'app.tabs.shifts',
        'SHIFTS': 'app.tabs.shifts',
        'OPENSHIFTS': 'app.tabs.openshifts',
        'MYSHIFTS': 'app.tabs.myshifts',
        'SETTINGS': 'settings',
        'GROUPSETTINGS': 'groupsettings',
        'GROUPMEMBERS': 'groupsettings.members.current',
        'SENDINVITE': 'groupsettings.members.invite',
        'CREATESUBCLASS': 'groupsettings.members.createsubclass',
        'CURRENTLOCATIONS': 'groupsettings.locations.current',
        'MANAGELOCATION': 'groupsettings.locations.manage',
        'REQUESTSHIFT': 'requestshift.locations',
        'REQUESTSHIFT_LOCATION_SELECTED': 'requestshift.location',
        'REQUESTSHIFT_LOCATION_AND_JOB_SELECTED': 'requestshift.locationjob',
        'REQUESTSHIFT_SUBLOCATION_SELECTED': 'requestshift.sublocation',
        'REQUESTSHIFT_SUBLOCATION_AND_JOB_SELECTED': 'requestshift.sublocationjob',
        'NEWSHIFT': 'app.tabs.newshift',
        'MANAGE': 'app.tabs.manage',
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

config_module = angular.module('scheduling-app.config', [
    'restangular'
]);
angular.forEach(config_data,function(key,value) {
    config_module.constant(value,key);
});

config_module.config([
    'RestangularProvider',
    'GENERAL_CONFIG',
    function(
        RestangularProvider,
        GENERAL_CONFIG
    ) {
        var base_url = GENERAL_CONFIG.APP_URL + GENERAL_CONFIG.APP_URL_API;
        RestangularProvider.setBaseUrl(base_url);
    }
]);
