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

                console.log("TRYING $ALL");
                AllShiftsModel.all(function(wat) {
                    console.log(wat);
                });
                console.log("TRIED ALL");
                $http.get('/api/shifts/all').success(function(data) {
                    $scope.Model = data;
                    console.log("!@#$!@#$!@#$!@#$!@#$");
                    deferred.resolve(data);
                });

                return deferred.promise;
            };
        }]);
