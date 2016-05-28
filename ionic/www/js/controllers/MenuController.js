angular.module('scheduling-app.controllers')

    .controller('MenuController', [
        '$scope',
        '$rootScope',
        '$state',
        'StateHistoryService',
        'GENERAL_EVENTS',
        'STATES',
        function($scope,
                 $rootScope,
                 $state,
                 StateHistoryService,
                 GENERAL_EVENTS,
                 STATES
        ) {
            $scope.toggleCalendar = function(event) {
                $rootScope.$emit(GENERAL_EVENTS.CALENDAR.TOGGLE);
                event.stopPropagation();
            };

            $scope.openSettings = function() {
                StateHistoryService.addToGotoHistory();
            };

            $rootScope.$on('events:shift:info', function(state, shift, name) {
                if (shift.hasOwnProperty('id')) {
                    $state.go('app.shift', {shift_id: shift.id});
                }
            });
        }
    ]);
