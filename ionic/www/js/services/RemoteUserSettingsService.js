"use strict";
angular.module('scheduling-app.services')
    .service('RemoteUserSettingsService', [
        '$rootScope',
        '$controller',
        'ResourceService',
        'GENERAL_EVENTS',
        function($rootScope,
                 $controller,
                 ResourceService,
                 GENERAL_EVENTS
        ) {
            this.getSetting = function getSetting(settingName) {
                return $rootScope.UserSettings[settingName];
            };

            this.setSetting = function setSetting(settingName, value) {
                $rootScope.UserSettings[settingName] = value;
            };

            var lastUserSettingsFromServer = null;

            this.saveSettings = function saveSettings(settings, successCallback, errorCallback) {
                if (settings === undefined) {
                    settings = $rootScope.UserSettings;
                }
                ResourceService.updateSettings(
                    settings,
                    function(result) {
                        lastUserSettingsFromServer = angular.copy(result);
                        $rootScope.$emit(GENERAL_EVENTS.UPDATES.RESOURCE,
                            'UserSettings',
                            result,
                            angular.copy(lastUserSettingsFromServer),
                            $rootScope
                        );
                        successCallback(result);
                    },
                    function(response) {
                        // failure
                        console.log("FAIL");
                        $rootScope.$emit(GENERAL_EVENTS.UPDATES.FAILURE, response);
                        errorCallback(response, angular.copy(lastUserSettingsFromServer));
                    }
                );
            };

            $rootScope.$on(GENERAL_EVENTS.UPDATES.RESOURCE, function resourceUpdated(env, resource, newValue, oldValue) {
                if (resource != 'UserSettings') {
                    return;
                }
                angular.forEach(newValue, function(value, key) {
                    if (value === 0) {
                        value = false;
                    } else if (value == 1) {
                        value = true;
                    }
                    newValue[key] = value;
                });
                $rootScope.UserSettings = newValue;
                lastUserSettingsFromServer = angular.copy(newValue);
            });
        }]
);
