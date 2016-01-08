/**
 * GroupLocationsController
 */
angular.module('scheduling-app.controllers')
    .controller('GroupLocationsController', [
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

            $scope.group_id = getGroupId;

            function getGroupId() {
                return $stateParams.group_id;
            }

            $scope.pageTitle = 'Locations';

            $scope.locationList = [
                { address: "Location 1", city: "Helsingborg", id: "1" },
                { address: "Location 2", city: "Chesapeake", id: "2" },
                { address: "Location 3", city: "Chesapeake", id: "3" },
                { address: "Location 4", city: "Chicago", id: "4" },
                { address: "Location 5", city: "Helsingborg", id: "5" },
                { address: "Location 6", city: "Helsingborg", id: "6" },
                { address: "Location 7", city: "Chesapeake", id: "7" },
                { address: "Location 8", city: "Chesapeake", id: "8" },
                { address: "Location 9", city: "Helsingborg", id: "9" },
                { address: "Location 10", city: "Chicago", id: "10" },
                { address: "Location 11", city: "Chicago", id: "11" },
                { address: "Location 12", city: "Chesapeake", id: "12" },
                { address: "Location 13", city: "Stockholm", id: "13" },
                { address: "Location 14", city: "Stockholm", id: "14" },
                { address: "Location 15", city: "Helsingborg", id: "15" },
                { address: "Location 16", city: "Helsingborg", id: "16" },
                { address: "Location 17", city: "Chesapeake", id: "17" },
                { address: "Location 18", city: "Chicago", id: "18" },
                { address: "Location 19", city: "Chicago", id: "19" },
                { address: "Location 20", city: "Chicago", id: "20" }
            ];

        }]
);
