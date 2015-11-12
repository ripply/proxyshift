/**
 * InvitationController
 */
angular.module('scheduling-app.controllers')
    .controller('InvitationController', [
        '$rootScope',
        '$scope',
        '$http',
        '$state',
        'UsersModel',
        'ErrorMessageService',
        'GENERAL_EVENTS',
        'STATES',
        'StateHistoryService',
        function($rootScope,
                 $scope,
                 $http,
                 $state,
                 UsersModel,
                 ErrorMessageService,
                 GENERAL_EVENTS,
                 STATES,
                 StateHistoryService) {

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

            $scope.doSignup = function(valid) {
                if (!valid) {
                    return;
                }
                UsersModel.post($scope.user)
                    .then(function() {
                        console.log("User successfully signed up.");
                        $rootScope.$broadcast(GENERAL_EVENTS.SIGNUP.SUCCESS);
                    }, function(response) {
                        console.log("User failed to signup.");
                        console.log(response);
                        $rootScope.$broadcast(GENERAL_EVENTS.SIGNUP.FAILED, ErrorMessageService.parse(response, 'An error occurred'));
                    });
            };

            $scope.$on(GENERAL_EVENTS.SIGNUP.REQUIRED, function(e, rejection) {
                // clear any error messages
                $scope.message = null;
                // reset existing midtyped username/password
                $scope.user.username = null;
                $scope.user.firstname = null;
                $scope.user.lastname = null;
                $scope.user.email = null;
                $scope.user.password = null;
                $scope.user.squestion = null;
                $scope.user.sanswer = null;
                $scope.user.phonehome = null;
                $scope.user.phonemobile = null;
                $scope.user.pagernumber = null;

                $scope.signupModal.show();
            });

            $scope.$on(GENERAL_EVENTS.SIGNUP.SUCCESS, function() {
                $scope.message = null;
                $scope.user.username = null;
                $scope.user.firstname = null;
                $scope.user.lastname = null;
                $scope.user.email = null;
                $scope.user.password = null;
                $scope.user.squestion = null;
                $scope.user.sanswer = null;
                $scope.user.phonehome = null;
                $scope.user.phonemobile = null;
                $scope.user.pagernumber = null;

                $scope.signupModal.hide();
            });

            $scope.$on(GENERAL_EVENTS.SIGNUP.FAILED, function(e, message) {
                if (typeof message === 'object') {
                    var error;
                    angular.forEach(message, function(value, key) {
                        if (value instanceof Array) {
                            angular.forEach(value, function(errorMessage) {
                                if (error === undefined) {
                                    error = errorMessage;
                                } else {
                                    error += ", " + errorMessage;
                                }
                            });
                        }
                    });

                    if (!error) {
                        error = "Unknown error";
                    }

                    message = error;
                }
                $scope.message = message;
            });

            $scope.$on(GENERAL_EVENTS.SIGNUP.COMPLETE, function() {
                //addUserToGroup(user);
                $state.go(STATES.HOME, {}, {reload: true, inherit: false});
            });

            function addUserToGroup(user) {
                //Add user to group
            }

        }]
)
;
