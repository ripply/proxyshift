angular.module('scheduling-app.controllers')

    .controller('MenuController', [
        '$scope',
        '$rootScope',
        'StateHistoryService',
        'GENERAL_EVENTS',
        'STATES',
        function($scope,
                 $rootScope,
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
        }
    ]);
