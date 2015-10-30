/**
 * GroupInviteController
 */
angular.module('scheduling-app.controllers')
    .controller('GroupInviteController', [
        '$scope',
        'StateHistoryService',
        'STATES',
        'UserInfoService',
        function($scope, StateHistoryService, STATES, UserInfoService) {

            //Retreive following data from db that was stored when invitation was sent
            $scope.groupDetails = [
                { description: "Group Name", data: "Evolution"},
                { description: "State", data: "Virginia"},
                { description: "City", data: "Chesapeake"},
                { description: "Address", data: "Evo Street 123"},
                { description: "Zipcode", data: "12345"},
                { description: "Contact Phone", data: "54321"},
                { description: "Website", data: "www.evolution.com"}
            ];

            $scope.groupRole = "Nurse";

            $scope.doAccept = function(valid) {
                if (!valid) {
                    return;
                }

                //Add user to group
            };

        }]
);
