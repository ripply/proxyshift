angular.module('scheduling-app.controllers')
    .controller('ManagerController', [
        '$rootScope',
        '$scope',
        '$controller',
        '$q',
        'GENERAL_EVENTS',
        'GENERAL_CONFIG',
        'ShiftsModel',
        function($rootScope,
                 $scope,
                 $controller,
                 $q,
                 GENERAL_EVENTS,
                 GENERAL_CONFIG,
                 ShiftsModel
        ) {
            $controller('BaseModelController', {$scope: $scope});

            $scope.fetch = function() {
                var deferred = $q.defer();

                ShiftsModel.managing(function(data) {
                    $scope.Model = data;
                    deferred.resolve(data);
                    data.splice(1, 0, {
                        type: 'pendingApproval',
                        isDivider: true
                    });
                    data.splice(3, 0, {
                        type: 'noApplications',
                        isDivider: true
                    });
                    $rootScope.$emit(GENERAL_EVENTS.UPDATES.RESOURCE, 'ManageShifts', data, data, $scope);
                    if ($scope.fetchComplete !== undefined) {
                        $scope.fetchComplete(data);
                    }
                });

                return deferred.promise;
            };
        }]);
