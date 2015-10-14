"use strict";
angular.module('scheduling-app.controllers')
    .controller('RequestShiftSelectLocationController', [
        '$scope',
        '$controller',
        'UserInfoService',
        'GENERAL_EVENTS',
        'STATES',
        function($scope,
                 $controller,
                 UserInfoService,
                 GENERAL_EVENTS,
                 STATES
        ) {
            $scope.groups = UserInfoService.getGroupList();
            $scope.locations = UserInfoService.getLocationList();
            $scope.development = true;

            init();

            $scope.$on(GENERAL_EVENTS.UPDATES.USERINFO.PROCESSED, function(env, userinfo) {
                init();
            });

            function init() {

            }

            $scope.getNextPageLocation = getNextPageLocation;
            $scope.getNextPageSublocation = getNextPageSublocation;

            function getNextPageLocation(location_id) {
                return getNextPageUrl(location_id, undefined);
            }

            function getNextPageSublocation(sublocation_id) {
                return getNextPageUrl(undefined, sublocation_id);
            }

            function getNextPageUrl(location_id, sublocation_id) {
                var url;
                if (sublocation_id) {
                    url = STATES.REQUESTSHIFT_SUBLOCATION_SELECTED_URL + '/' + sublocation_id;
                } else {
                    url = STATES.REQUESTSHIFT_LOCATION_SELECTED_URL + '/' + location_id;
                }
                var userclasses = UserInfoService.getUserclassesFromLocationOrSublocation(location_id, sublocation_id);
                if (!$scope.development
                    && userclasses
                    && Object.keys(userclasses).length === 1) {
                    var job = Object.keys(userclasses)[0];
                    url += '/job/' + job;
                }
                return url;
            }

        }
    ]);
