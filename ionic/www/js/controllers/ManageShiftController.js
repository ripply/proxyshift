angular.module('scheduling-app.controllers')
    .controller('ManageShiftController', [
        '$scope',
        '$rootScope',
        '$controller',
        '$stateParams',
        '$ionicScrollDelegate',
        //'Restangular',
        'GENERAL_EVENTS',
        'GENERAL_CONFIG',
        'ManagingShiftsModel',
        function($scope,
                 $rootScope,
                 $controller,
                 $stateParams,
                 $ionicScrollDelegate,
                 //Restangular,
                 GENERAL_EVENTS,
                 GENERAL_CONFIG,
                 ManagingShiftsModel
        ) {
            var RESOURCE = 'ManagingShifts';
            $controller('BaseModelController', {$scope: $scope});
            $scope.register(
                RESOURCE,
                ManagingShiftsModel,
                undefined
            );
            $scope.shift_id = $stateParams.shift_id;
            $scope.data = {};

            $rootScope.$on(GENERAL_EVENTS.UPDATES.RESOURCE, function(env, resource, newValue, oldValue) {
                getShiftId($scope.shift_id);
            });

            if ($rootScope[RESOURCE]) {
                $scope._managingshifts = $rootScope[RESOURCE];
                getShiftId($scope.shift_id);
            }

            function getShiftId(shift_id) {
                shift_id = parseInt(shift_id);
                if (!isNaN(shift_id) && $rootScope[RESOURCE]) {
                    var shifts = $rootScope[RESOURCE];
                    for (var i = 0; i < shifts.length; i++) {
                        if (shifts[i].id === shift_id) {
                            $scope.shift = shifts[i];
                            return;
                        }
                    }
                }

                // TODO: Go back, invalid shift
            }

            /*
            $scope.spacing = 0;
            $scope.dividerOuterHeight = 40;
            $scope.dividerInnerHeight = 32;
            $scope.shiftOuterHeight = 120;
            $scope.shiftInnerHeight = 64 + 4 * 2;

            $rootScope.$on(GENERAL_EVENTS.SHIFTS.SCROLL, function(state, value) {
                var model = $rootScope[$scope.MODELNAME];
                var y = ShiftProcessingService.getScrollToPosition(value, model, $scope.spacing, $scope.dividerOuterHeight, $scope.dividerInnerHeight, $scope.shiftOuterHeight, $scope.shiftInnerHeight);
                $ionicScrollDelegate.scrollTo(0, y, true);
            });
            */

            $scope.promptAcceptShiftApplication = promptAcceptShiftApplication;

            function promptAcceptShiftApplication(shiftapplication_id) {
                // TODO: Angular replacement for website
                $rootScope.$emit(GENERAL_EVENTS.POPUP.REQUESTED, function($ionicPopup) {
                    $scope.prompt = $ionicPopup.show({
                        templateUrl: 'templates/notifications/acceptshiftapplication.html',
                        title: 'Are you sure',
                        subTitle: 'you want to accept this shift application?',
                        scope: $scope,
                        buttons: [
                            {
                                text: 'No',
                                onTap: function(e) {
                                    return false;
                                }
                            },
                            {
                                text: 'Yes',
                                type: 'button-positive',
                                onTap: function(e) {
                                    return true;
                                }
                            }
                        ]
                    });

                    $scope.prompt.then(function(accepted) {
                        if (accepted) {
                            acceptShiftApplication(shiftapplication_id);
                        }
                    });
                });
            }

            function acceptShiftApplication(shiftapplication_id) {
                Restangular.all('shifts')
                    .one('application', shiftapplication_id)
                    .post()
                    .then(function(result) {
                        console.log(result);
                    });
            }

            $scope.promptDeclineShiftApplication = promptDeclineShiftApplication;

            function promptDeclineShiftApplication(shiftapplication_id) {
                // TODO: Angular replacement for website
                $rootScope.$emit(GENERAL_EVENTS.POPUP.REQUESTED, function($ionicPopup) {
                    $scope.prompt = $ionicPopup.show({
                        templateUrl: 'templates/notifications/declineshiftapplicationreason.html',
                        title: 'Provide a reason',
                        subTitle: 'for declining this shift application',
                        scope: $scope,
                        buttons: [
                            {
                                text: 'Cancel',
                                onTap: function(e) {
                                    delete $scope.data.reason;
                                }
                            },
                            {
                                text: 'OK',
                                type: 'button-positive',
                                onTap: function(e) {
                                    if (!$scope.data.declinereason || $scope.data.declinereason == '') {
                                        e.preventDefault();
                                    } else {
                                        return $scope.data.declinereason;
                                    }
                                }
                            }
                        ]
                    });

                    $scope.prompt.then(function(reason) {
                        delete $scope.data.reason;
                        if (reason) {
                            declineShiftApplication(shiftapplication_id, reason);
                        }
                    });
                });
            }

            function declineShiftApplication(shiftapplication_id, reason) {
                Restangular.all('shifts')
                    .one('application', shiftapplication_id)
                    .customOperation('remove', null, null, {
                        // content type must be set to json so that server will parse content, it is set to text without setting this
                        'Content-Type': 'application/json'
                    }, {
                        reason: reason
                    })
                    .then(function(result) {
                        console.log(result);
                    });
            }
        }]);
