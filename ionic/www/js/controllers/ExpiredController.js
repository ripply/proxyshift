angular.module('scheduling-app.controllers')
    .controller('ExpiredController', [
        '$scope',
        '$rootScope',
        '$stateParams',
        '$controller',
        '$q',
        '$timeout',
        'StateHistoryService',
        'STATES',
        function($scope,
                 $rootScope,
                 $stateParams,
                 $controller,
                 $q,
                 $timeout,
                 StateHistoryService,
                 STATES
        ) {
            $controller('BaseModelController', {$scope: $scope});

            $scope.afterEnter = fetch;
            $scope.fetch = fetch;

            function fetch() {
                $scope.$broadcast('FETCH', function fetchComplete() {
                    $scope.$broadcast('scroll.refreshComplete');
                });
            }

            $scope.close = function() {
                StateHistoryService.goBack($rootScope.currentTabPageState || STATES.SHIFTS);
            };
        }]
);
