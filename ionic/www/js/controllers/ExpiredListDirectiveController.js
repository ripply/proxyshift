angular.module('scheduling-app.controllers')
    .controller('ExpiredListDirectiveController', [
        '$scope',
        '$rootScope',
        '$controller',
        '$stateParams',
        '$ionicHistory',
        'GENERAL_EVENTS',
        'ShiftsModel',
        'GroupsModel',
        'LocationsModel',
        function($scope,
                 $rootScope,
                 $controller,
                 $stateParams,
                 $ionicHistory,
                 GENERAL_EVENTS,
                 ShiftsModel,
                 GroupsModel,
                 LocationsModel
        ) {
            $scope.parentView = true;
            $controller('BaseModelController', {$scope: $scope});

            var models = {
                'shift': ShiftsModel,
                'group': GroupsModel,
                'location': LocationsModel
            };

            $scope.beforeEnter = fetch;
            $scope.enter = fetch;
            $scope.expired = ['Loading...'];

            function getName() {
                var val = 'expired' + $scope.model + $scope.method;
                return val;
            }

            $scope.getName = getName;

            var fetching = false;

            function fetch() {
                if (fetching) {
                    return;
                }
                fetching = true;
                models[$scope.model][$scope.method]().$promise
                    .then(function success(response) {
                        fetching = false;
                        if (response) {
                            $scope.expired = response;
                            $rootScope.$emit(GENERAL_EVENTS.UPDATES.RESOURCE, getName(), response, response, $scope);
                        }
                    }, function error(response) {
                        fetching = false;
                    });
            }
        }
    ]
);
