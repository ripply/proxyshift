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
                var deferred = $q.defer();

                AllShiftsModel.all(function(data) {
                    $scope.Model = data;
                    setTimeout(function() {
                        alert("WAT");
                        AllShiftsModel.all(function(data) {
                            alert("updated");
                            $scope.Model = data;
                        });
                    }, 5000);
                    deferred.resolve(data);
                });

                return deferred.promise;
            };
        }]);
