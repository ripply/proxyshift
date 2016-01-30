/**
 * SignupController
 */
angular.module('scheduling-app.controllers')
    .controller('SignupController', [
        '$rootScope',
        '$scope',
        '$http',
        '$state',
        'UsersModel',
        'ErrorMessageService',
        'ResourceService',
        'GENERAL_EVENTS',
        'STATES',
        function($rootScope,
                 $scope,
                 $http,
                 $state,
                 UsersModel,
                 ErrorMessageService,
                 ResourceService,
                 GENERAL_EVENTS,
                 STATES) {

            $scope.user = {
                username: null,
                firstname: null,
                lastname: null,
                email: null,
                password: null,
                squestion: null,
                sanswer: null,
                phonehome: null,
                phonemobile: null,
                pagernumber: null
            };

            $scope.doSignup = function(valid) {
                if (!valid && !$scope.busy) {
                    return;
                }
                $scope.busy = true;
                UsersModel.post($scope.user)
                    .then(function() {
                        $scope.busy = false;
                        console.log("User successfully signed up.");
                        $rootScope.$broadcast(GENERAL_EVENTS.SIGNUP.SUCCESS);
                    }, function(response) {
                        $scope.busy = false;
                        console.log("User failed to signup.");
                        console.log(response);
                        $rootScope.$broadcast(GENERAL_EVENTS.SIGNUP.FAILED, ErrorMessageService.parse(response, 'An error occurred'));
                    });
            };

            $scope.forgotPassword = function(valid) {
                if (!valid && !$scope.busy) {
                    return;
                }
                $scope.busy = true;
                var usernameOrPassword = $scope.usernameOrPassword;
                ResourceService.resetPassword(usernameOrPassword, function resetPasswordSuccess() {
                    $scope.busy = false;
                        $rootScope.$emit(GENERAL_EVENTS.POPUP.REQUESTED, function($ionicPopup) {
                        $scope.prompt = $scope.popup = $ionicPopup.show({
                            templateUrl: 'templates/notifications/resetpasswordsuccess.html',
                            title: 'Notice',
                            //subTitle: '(this will only be shown once)',
                            scope: $scope,
                            buttons: [
                                {
                                    text: 'OK',
                                    onTap: function(e) {
                                        $rootScope.$broadcast(GENERAL_EVENTS.RESETPASSWORD.HIDE);
                                    }
                                }
                            ]
                        });
                    });
                }, function resetPasswordError() {
                    $scope.busy = false;
                    $rootScope.$emit(GENERAL_EVENTS.POPUP.REQUESTED, function($ionicPopup) {
                        $scope.prompt = $scope.popup = $ionicPopup.show({
                            templateUrl: 'templates/notifications/unknownerror.html',
                            title: 'Notice',
                            //subTitle: '(this will only be shown once)',
                            scope: $scope,
                            buttons: [
                                {
                                    text: 'OK'
                                }
                            ]
                        });
                    });
                });
            };

            $scope.$on(GENERAL_EVENTS.RESETPASSWORD.HIDE, function() {
                $scope.usernameOrPassword = '';
            });

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
                $state.go(STATES.HOME, {}, {reload: true, inherit: false});
            });

        }]
)
;
