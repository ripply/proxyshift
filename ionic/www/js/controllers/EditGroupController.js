/**
 * EditGroupController
 */
angular.module('scheduling-app.controllers')
    .controller('EditGroupController', [
        '$scope',
        '$http',
        '$state',
        '$stateParams',
        'Restangular',
        'GroupSettingsModel',
        function($scope, $http, $state, $stateParams, Restangular, GroupSettingsModel) {

            $scope.groupsettings = {
                groupsid: null,
                allowalltocreateshifts: null,
                requireshiftconfirmation: null
            };

            $scope.doSave = function() {
                $scope.groupsettings.groupsid = $stateParams.id;

                Restangular.one('groups', $stateParams.id)
                    .customPOST($scope.groupsettings, 'settings', null, null)
                    //GroupSettingsModel.post($scope.groupsettings)

                    .then(function() {
                        $scope.groupsettings.groupsid = null;
                        $scope.groupsettings.allowalltocreateshifts = null;
                        $scope.groupsettings.requireshiftconfirmation = null;
                        console.log("Successfully edited group?");
                    }, function(response) {
                        console.log("Failed to edit group with response: " + response.status);
                    });
            };

            $scope.$on('event:editgroup-failed', function(e, message) {
                $scope.message = message;
            });

            $scope.$on('event:editgroup-complete', function() {
                $state.go('app.home', {}, {reload: true, inherit: false});
            });

        }]
);