angular.module('scheduling-app.settings', [
    'scheduling-app.config',
    'LocalStorageModule'
])
    .service('UserSettingService', [
        'localStorageService',
        function(
            localStorageService
        ) {
            this.getStore = getStore;
            this.getStores = getStores;
            this.put = put;
            this.get = get;
            this.clear = clear;

            function getStore(preferCookies) {
                var service;
                if (preferCookies) {
                    if (localStorageService.cookie.isSupported) {
                        service = localStorageService.cookie;
                    } else if (localStorageService.isSupported) {
                        service = localStorageService;
                    }
                } else {
                    if (localStorageService.isSupported) {
                        service = localStorageService;
                    } else if (localStorageService.cookie.isSupported) {
                        service = localStorageService.cookie;
                    }
                }
                return service;
            }

            function getStores(preferCookies) {
                var stores = [getStore(preferCookies)];
                var store = getStore(!preferCookies);
                if (stores[0] !== store) {
                    stores.push(store);
                }
                return stores;
            }

            function put(key, value, preferCookies) {
                var store = getStore(preferCookies);
                if (store === undefined) {
                    return false;
                } else {
                    store.set(key, value);
                    return true;
                }
            }

            function get(key) {
                var stores = getStores(true);
                for (var i = 0; i < stores.length; i++) {
                    var store = stores[i];
                    var value = store.get(key);
                    if (value) {
                        return value
                    }
                }
            }

            function clear() {
                angular.forEach(getStores(true), function(store) {
                    angular.forEach(arguments, function(key) {
                        store.remove(key);
                    });
                });
            }

        }
    ]);
