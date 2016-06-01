angular.module('scheduling-app.controllers')
    .controller('OpenShiftsDirectiveController', [
        '$rootScope',
        '$scope',
        '$controller',
        '$http',
        'GENERAL_CONFIG',
        'GENERAL_EVENTS',
        'ShiftsModel',
        function($rootScope,
                 $scope,
                 $controller,
                 $http,
                 GENERAL_CONFIG,
                 GENERAL_EVENTS,
                 AllShiftsModel
        ) {
            $controller('BaseShiftListDirectiveController', {
                $scope: $scope,
                ModelVariableName: 'AllShifts',
                Model: AllShiftsModel
            });

            $scope.fetch = function() {
                console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
                var deferred = $q.defer();

                AllShiftsModel.all(function(data) {
                    $scope.Model = data;
                    deferred.resolve(data);
                });

                return deferred.promise;
            };
        }]);
