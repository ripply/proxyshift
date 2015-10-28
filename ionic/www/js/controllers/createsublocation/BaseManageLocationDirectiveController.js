angular.module('scheduling-app.controllers')
    .controller('BaseManageLocationDirectiveController', [
        '$rootScope',
        '$scope',
        '$controller',
        'GENERAL_CONFIG',
        'GENERAL_EVENTS',
        //'Restangular',
        //'ModelVariableName',
        //'Model',
        function($rootScope,
                 $scope,
                 $controller,
                 GENERAL_CONFIG,
                 GENERAL_EVENTS
                 //Restangular,
                 //ModelVariableName,
                 //Model
        ) {
            $controller('BaseModelController', {$scope: $scope});
           /* $scope.register(
                //ModelVariableName,
                //Model,
                //undefined
            );*/
            //$scope.Model = $rootScope[ModelVariableName];
            /*$rootScope.$watch(ModelVariableName, function(newValue, oldValue) {
                $scope.Model = newValue;
            });*/

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

            function createSubLocation(sublocation) {
                //Send email invitation

                if(checkExistingSubLocation(sublocation)) {
                    //Also send invitation to user in app
                }
            }

            function checkExistingSubLocation(sublocation) {
                if(sublocation) {
                    return true;
                } else {
                    return false;
                }
            }
        }]);
