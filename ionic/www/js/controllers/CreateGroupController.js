/**
 * CreateGroupsController
 */
angular.module('scheduling-app.controllers')
    .controller('CreateGroupController', [
        '$scope',
        '$http',
        '$state',
        'GroupsModel',
        function($scope, $http, $state, GroupsModel) {

            $scope.group = {
                name: null,
                state: null,
                city: null,
                address: null,
                zipcode: null,
                weburl: null,
                contactemail: null,
                contactphone: null
            };

            $scope.doCreate = function() {
                GroupsModel.post($scope.group)

                    .then(function() {
                        $scope.group.name = null;
                        $scope.group.state = null;
                        $scope.group.city = null;
                        $scope.group.address = null;
                        $scope.group.zipcode = null;
                        $scope.group.weburl = null;
                        $scope.group.contactemail = null;
                        $scope.group.contactphone = null;
                        console.log("Successfully created group?");
                    }, function(response) {
                        console.log("Failed to create group with response: " + response.status);
                    });
            };

            $scope.$on('event:creategroup-failed', function(e, message) {
                $scope.message = message;
            });

            $scope.$on('event:creategroup-complete', function() {
                $state.go('app.home', {}, {reload: true, inherit: false});
            });

        }]
);