var config_data = {
    'GENERAL_CONFIG': {
        'APP_NAME': 'Scheduling App',
        'APP_VERSION': '0.1',
        'APP_URL': 'http://localhost:8100',
        'APP_URL_API': '/api',
        'APP_URL_LOGIN': '/session/login',
        'APP_URL_LOGOUT': '/session/logout'
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