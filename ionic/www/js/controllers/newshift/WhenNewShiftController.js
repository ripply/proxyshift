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
            $controller('BaseNewShiftController', {$scope: $scope, $stateParams: $stateParams});
            $scope.state = $stateParams;
            $scope.when = {};

            var requiredWhenData = ['starttime', 'endtime', 'length', 'employees'];

            $scope.whereStateParams = function() {
                return angular.extend({
                    when: getWhen()
                }, $stateParams);
            };

            $scope.getDates = function() {
                return $scope.decodeDates($stateParams.dates);
            };

            $scope.getMoment = function(date) {
                return moment(date);
            }

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
                    } else {
                        progressable = false;
                    }
                });

                return progressable;
            };
        }
    ]
);
