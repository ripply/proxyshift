angular.module('scheduling-app.controllers')
    .controller('ShiftDescriptionController', [
        '$scope',
        '$rootScope',
        '$controller',
        '$ionicScrollDelegate',
        'ShiftProcessingService',
        'GENERAL_CONFIG',
        'GENERAL_EVENTS',
        function($scope,
                 $rootScope,
                 $controller,
                 $ionicScrollDelegate,
                 ShiftProcessingService,
                 GENERAL_CONFIG,
                 GENERAL_EVENTS
        ) {
            $controller('BaseModelController', {$scope: $scope});
            $rootScope.$on('events:shift:description:hide', function(name) {
                if (name == $scope.name) {
                    $scope.show = false;
                    $scope.$apply();
                }
            });

            $rootScope.$on('events:shift:description:show', function(state, shift, name) {
                showAndResize(true, shift, name);
            });

            $scope.hideModal = function() {
                $scope.show = false;
                $scope.waiting = false;
            };

            $scope.showAndResize = showAndResize;

            function showAndResize(hide, shift, name) {
                if (!$scope.show && name == $scope.name && !$scope.waiting) {
                    $scope.show = true;
                    $scope.shift = shift;
                    $scope.waiting = true;
                    var shiftScrollContent = document.getElementById('shift-scroll-content');
                    if (shiftScrollContent != null) {
                        if (hide) {
                            shiftScrollContent.setAttribute("style", "height: 0px");
                        }
                    }

                    var shiftDescriptions = document.getElementsByClassName('shift-description');
                    angular.forEach(shiftDescriptions, function(shiftDescription) {
                        if (hide) {
                            shiftDescription.setAttribute('style', 'opacity: 0;');
                        }
                    });

                    setTimeout(function() {
                        var scrollContent = document.getElementById('shift-description-scroll-content');
                        if (scrollContent) {
                            var topPadding = 20;
                            var buttonHeight = 47;
                            var outerBottomPadding = 1;
                            var outerTopPadding = 1;
                            var titleAndLocation = 96; // .shift-description .scroll-content top:
                            var maxHeight = (browserHeight() * 0.75) - buttonHeight - outerBottomPadding;
                            var shiftScrollContent = document.getElementById('shift-scroll-content');
                            var height = Math.min((scrollContent.clientHeight + topPadding + titleAndLocation), maxHeight) - outerBottomPadding - outerTopPadding;
                            shiftScrollContent.setAttribute("style", "height: " + height + 'px');
                            $ionicScrollDelegate.resize();
                            angular.forEach(shiftDescriptions, function(shiftDescription) {
                                shiftDescription.setAttribute('style', 'height: ' + (height + outerBottomPadding + buttonHeight + outerTopPadding ) + 'px');
                            });
                        }
                        $scope.waiting = false;
                    }, 0);
                }
            }

            $scope.acceptClicked = function acceptClicked(shift) {
                $rootScope.$broadcast(GENERAL_EVENTS.SHIFTS.ACCEPT, shift);
            };

            $scope.declineClicked = function declineClicked(shift) {
                $rootScope.$broadcast(GENERAL_EVENTS.SHIFTS.DECLINE, shift);
            };

            $scope.getReadableLocalShiftStartTime = ShiftProcessingService.getReadableLocalShiftStartTime;
            $scope.getReadableLocalShiftEndTime = ShiftProcessingService.getReadableLocalShiftEndTime;
            $scope.getReadableLocalShiftDiffTime = ShiftProcessingService.getReadableLocalShiftDiffTime;
            $scope.getReadableUsersShiftTime = ShiftProcessingService.getReadableUsersShiftTime;
            $scope.getReadableUsersShiftStartTime = ShiftProcessingService.getReadableUsersShiftStartTime;
            $scope.getReadableUsersShiftEndTime = ShiftProcessingService.getReadableUsersShiftEndTime;
            $scope.getReadableShiftDuration = ShiftProcessingService.getReadableShiftDuration;
            $scope.getReadableStartDate = ShiftProcessingService.getReadableStartDate;
            $scope.userIsInDifferentTimeZone = ShiftProcessingService.userIsInDifferentTimeZone;
            $scope.getShiftsLocation = ShiftProcessingService.getShiftsLocation;
            $scope.getShiftsSublocation = ShiftProcessingService.getShiftsSublocation;

            function browserHeight() {
                var myWidth = 0, myHeight = 0;
                if( typeof( window.innerWidth ) == 'number' ) {
                    //Non-IE
                    myWidth = window.innerWidth;
                    myHeight = window.innerHeight;
                } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
                    //IE 6+ in 'standards compliant mode'
                    myWidth = document.documentElement.clientWidth;
                    myHeight = document.documentElement.clientHeight;
                } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
                    //IE 4 compatible
                    myWidth = document.body.clientWidth;
                    myHeight = document.body.clientHeight;
                }
                return myHeight;
            }
        }
    ]
);
