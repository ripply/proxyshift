/**
 * GroupMembersController
 */
angular.module('scheduling-app.controllers')
    .controller('GroupMembersController', [
        '$scope',
        '$rootScope',
        '$stateParams',
        '$controller',
        'StateHistoryService',
        'STATES',
        function($scope,
                 $rootScope,
                 $stateParams,
                 $controller,
                 StateHistoryService,
                 STATES) {
            $controller('BaseModelController', {$scope: $scope});
            $scope.stateParams = $stateParams;

            $scope.beforeEnter = init;

            function init() {
                $scope.group_id = getGroupId();
            }

            function getGroupId() {
                return $scope.stateParams.group_id;
            }

            $scope.usersList = [
                { username: "Bro 1", email: "email_1@email.com", phone: "1"},
                { username: "Bro 2", email: "email_2@email.com", phone: "2"},
                { username: "Bro 3", email: "email_3@email.com", phone: "3"},
                { username: "Bro 4", email: "email_4@email.com", phone: "4"},
                { username: "Bro 5", email: "email_5@email.com", phone: "5"},
                { username: "Bro 6", email: "email_6@email.com", phone: "6"},
                { username: "Bro 7", email: "email_7@email.com", phone: "7"},
                { username: "Bro 8", email: "email_8@email.com", phone: "8"},
                { username: "Bro 9", email: "email_9@email.com", phone: "9"}
            ];

        }]
);
