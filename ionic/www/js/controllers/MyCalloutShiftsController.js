angular.module('scheduling-app.controllers')
    .controller('MyCalloutShiftsController', [
        '$scope',
        '$controller',
        'UserInfoService',
        function($scope,
                 $controller,
                 UserInfoService
        ) {
            $scope.getRouteName = function() {
                var noIgnored = UserInfoService.getShowIgnoredShifts() ? '':'NoIgnored';
                return 'mine' + noIgnored;
            };
            $scope.showDividers = true;
            $controller('ShiftsListController', {$scope: $scope, enableScroll: false});
            $scope.MODELNAME = 'shifts';
        }
    ]
);
