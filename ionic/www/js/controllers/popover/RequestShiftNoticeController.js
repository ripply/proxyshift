angular.module('scheduling-app.controllers')
    .controller('RequestShiftNoticeController', [
        '$scope',
        'UserSettingsService',
        'GENERAL_EVENTS',
        function($scope,
                 UserSettingsService,
                 GENERAL_EVENTS
        ) {
            $scope.groups = UserSettingsService.getGroupList();
            $scope.locations = UserSettingsService.getLocationList();

            var location = onlyMemberOfOneLocation();
            if (location !== false) {
                // goto next page
                // console.log("Only a member of one location");
            }

            function onlyMemberOfOneLocation() {
                var location_ids = $scope.locations.keys();
                if (location_ids === 1) {
                    return $scope.locations[location_ids[0]];
                } else {
                    return false;
                }
            }
        }
    ]);
