angular.module('scheduling-app.controllers')

    .controller('MenuController', [
        '$scope',
        'StateHistoryService',
        'STATES',
        function($scope,
                 StateHistoryService,
                 STATES
        ) {
            $scope.openSettings = function() {
                StateHistoryService.addToGotoHistory();
                //StateHistoryService.goto(STATES.SETTINGS);
            };
        }
    ]);
