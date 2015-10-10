angular.module('scheduling-app.controllers')

    .controller('RequestShiftController', [
        '$scope',
        'StateHistoryService',
        'STATES',
        function($scope,
                 StateHistoryService,
                 STATES
        ) {
            $scope.close = function() {
                StateHistoryService.returnTo(STATES.SHIFTS);
            };
        }
    ]);
