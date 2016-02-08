angular.module('scheduling-app.controllers')
    .controller('OpenShiftsController', [
        '$rootScope',
        '$scope',
        '$controller',
        '$q',
        'GENERAL_EVENTS',
        'GENERAL_CONFIG',
        'ShiftProcessingService',
        'ShiftsModel',
        function($rootScope,
                 $scope,
                 $controller,
                 $q,
                 GENERAL_EVENTS,
                 GENERAL_CONFIG,
                 ShiftProcessingService,
                 ShiftsModel
        ) {
            $controller('BaseModelController', {$scope: $scope});
            /*
            $scope.register(
                'AllShifts',
                AllShiftsModel,
                undefined
            );
            */
            $scope.fetch = function() {
                var deferred = $q.defer();

                ShiftsModel.all(function(data) {
                    $scope.Model = data;
                    deferred.resolve(data);

                    $rootScope.$emit(GENERAL_EVENTS.UPDATES.RESOURCE, 'AllShifts', data, data, $scope);
                    if ($scope.fetchComplete !== undefined) {
                        $scope.fetchComplete(data);
                    }
                });

                return deferred.promise;
            };
        }]);
