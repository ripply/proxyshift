angular.module('scheduling-app.controllers')
    .controller('ShiftInfoController', [
        '$scope',
        '$rootScope',
        '$controller',
        '$stateParams',
        'ResourceService',
        function($scope,
                 $rootScope,
                 $controller,
                 $stateParams,
                 ResourceService
        ) {
            $controller('BaseModelController', {$scope: $scope});
            $scope.beforeEnter = function() {
                console.log("ASKDJFLKASJDFJ");
                if ($stateParams.shift_id) {
                    ResourceService.getShift($stateParams.shift_id, function(response) {
                        console.log(response);
                        $scope.shift = response;
                    }, function(error) {
                        // TODO: RETRY HANDLING
                    });
                }
            };
        }
    ]
);
