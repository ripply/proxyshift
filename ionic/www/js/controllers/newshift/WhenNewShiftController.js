angular.module('scheduling-app.controllers')
    .controller('WhenNewShiftController', [
        '$scope',
        '$rootScope',
        '$stateParams',
        '$controller',
        function($scope,
                 $rootScope,
                 $stateParams,
                 $controller
        ) {
            $controller('BaseNewShiftController', {$scope: $scope});
            $scope.state = $stateParams;
            $scope.when = {};

            var requiredWhenData = ['starttime', 'endtime', 'length', 'employees'];

            console.log("WATTTTTTTTTTTTTTTTT");

            $scope.whereStateParams = function() {
                return angular.extend({
                    when: getWhen()
                }, $stateParams);
            };

            $scope.getDates = function() {
                return $scope.decodeDates($stateParams.dates);
            };

            function getWhen() {
                return $scope.encodeWhens($scope.when);
            }

            $scope.progressable = function() {
                var progressable = true;
                angular.forEach($scope.getDates(), function(date) {
                    if ($scope.when.hasOwnProperty(date)) {
                        angular.forEach(requiredWhenData, function(requiredKey) {
                            if (!$scope.when[date].hasOwnProperty(requiredKey)) {
                                progressable = false;
                            }
                        });
                    }
                });

                return progressable;
            };
        }
    ]
);
