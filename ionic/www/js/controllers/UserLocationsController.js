/**
 * UserLocationsController
 */
angular.module('scheduling-app.controllers')
    .controller('UserLocationsController', [
        '$scope',
        '$rootScope',
        'StateHistoryService',
        'STATES',
        function($scope, $rootScope, StateHistoryService, STATES) {

            $scope.locationList = [
                { address: "Location 1", city: "Helsingborg", checked: true },
                { address: "Location 2", city: "Chesapeake", checked: false },
                { address: "Location 3", city: "Chesapeake", checked: false },
                { address: "Location 4", city: "Chicago", checked: false },
                { address: "Location 5", city: "Helsingborg", checked: true },
                { address: "Location 6", city: "Helsingborg", checked: true },
                { address: "Location 7", city: "Chesapeake", checked: false },
                { address: "Location 8", city: "Chesapeake", checked: false },
                { address: "Location 9", city: "Helsingborg", checked: false },
                { address: "Location 10", city: "Chicago", checked: false },
                { address: "Location 11", city: "Chicago", checked: false },
                { address: "Location 12", city: "Chesapeake", checked: false },
                { address: "Location 13", city: "Stockholm", checked: false },
                { address: "Location 14", city: "Stockholm", checked: false },
                { address: "Location 15", city: "Helsingborg", checked: true },
                { address: "Location 16", city: "Helsingborg", checked: false },
                { address: "Location 17", city: "Chesapeake", checked: false },
                { address: "Location 18", city: "Chicago", checked: false },
                { address: "Location 19", city: "Chicago", checked: false },
                { address: "Location 20", city: "Chicago", checked: true }
            ];

        }]
);
