var config_data = {
    'GENERAL_CONFIG': {
        'APP_NAME': 'Scheduling App',
        'APP_VERSION': '0.1',
        'APP_URL': 'https://guarded-waters-3652.herokuapp.com', // modified during setup to point to correct url
        'APP_URL_PROD': 'https://guarded-waters-3652.herokuapp.com',
        'APP_URL_DEV': 'http://localhost:8100',
        'APP_URL_API': '/api',
        'APP_URL_LOGIN': '/session/login',
        'APP_URL_LOGOUT': '/session/logout',
        'APP_REMEMBER_ME_TOKEN': 'remember_me',
        'SESSION_RETRY_ACCESSED_RESOURCE_IN': {
            value: 30,
            interval: 'mins'
        },
        'LOGIN_TIMEOUT': 15 * 1000 // milliseconds
    },
    'GENERAL_EVENTS': {
        // TODO: NONE OF THESE EVENT NAMES FOLLOW A CONSISTENT PATTERN
        'AUTHENTICATION': {
            'CHECK': 'events:auth-check-authentication',
            // This is broadcast by angular-http-auth on 401 code
            'REQUIRED': 'event:auth-loginRequired',
            'CONFIRMED': 'event:auth-loginConfirmed',
            'INVALID': 'event:auth-login-failed-invalid',
            'FAILED': 'event:auth-login-failed'
        },
        'SIGNUP': {
            'REQUIRED': 'event:signup-requierd',
            'SUCCESS': 'event:signup-successful',
            'FAILED': 'event:signup-failed',
            'COMPLETE': 'event:signup-complete'
        },
        'LOGOUT': {
            'COMPLETE': 'event:auth-logout-complete',
            'FAILED': 'event:auth-logout-failed',
            'REQUESTED': 'event:auth-logout-requested'
        },
        'SLOW_REQUEST': 'events:slow-request',
        'UPDATES': {
            'USERINFO': {
                'UPDATENEEDED': 'events:updates:userinfo:updateneeded',
                'FAILED': 'events:updates:userinfo:failed',
                'SUCCESS': 'events:updates:userinfo:success'
            }
        }
    },
    'TOKENS': {
        'SESSION': 'connect.sid',
        'REMEMBERME': 'remember_me'
    },
    'STATES': {
        'HOME': 'app.openshifts',
        'LOGIN': 'login'
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
