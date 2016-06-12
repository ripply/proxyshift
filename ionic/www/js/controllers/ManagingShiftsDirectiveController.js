angular.module('scheduling-app.controllers')
    .controller('ManagingShiftsDirectiveController', [
        '$rootScope',
        '$scope',
        '$controller',
        'GENERAL_CONFIG',
        'GENERAL_EVENTS',
        function($rootScope,
                 $scope,
                 $controller,
                 GENERAL_CONFIG,
                 GENERAL_EVENTS
        ) {
            $controller('BaseShiftListDirectiveController', {
                $scope: $scope
            });

            $scope.fetch = function() {
                var deferred = $q.defer();

                ShiftsModel.manage(function(data) {
                    $scope.Model = data;
                    deferred.resolve(data);
                    $rootScope.$emit(GENERAL_EVENTS.UPDATES.RESOURCE, 'ManageShifts', data, data, $scope);
                    if ($scope.fetchComplete !== undefined) {
                        $scope.fetchComplete(data);
                    }
                });

                return deferred.promise;
            };
        }]);
