angular.module('scheduling-app.controllers')
    .controller('BaseModelController', [
        '$scope',
        '$injector',
        function($scope,
                 $injector) {
            $scope.init = function (model, baseObject, addFunction) {
                console.debug("init(" + model + ")");
                $scope._modelName = model;
                $scope._baseObject = baseObject;
                // this will throw if the service doesn't exist
                $scope._model = $injector.get(model);
                $scope._addFunction = addFunction;
                $scope.fetch();
            };

            function isInitialized() {
                return $scope._model === undefined && !needsInitialization();
            }

            $scope.revertToDefaultObject = function () {
                $scope.object = angular.extend($scope._baseObject);
                return $scope.object;
            };

            $scope.fetch = function () {
                $scope._model.getList().then(function (objects) {
                    $scope.objects = objects;
                }, function (err) {
                    $scope.objects = null;
                    $scope.error = err;
                });
            };

            $scope.add = function () {
                $scope.object = $scope._addFunction($scope.revertToDefaultObject());
                $scope._model.post($scope.object)
                    .then(function () {
                        //success
                    }, function () {
                        //error
                    });
            };

            function needsInitialization() {
                return $scope._needsInitialization;
            }

            function setNeedsInitialization(value) {
                $scope._needsInitialization = value;
            }

            $scope.$on('$ionicView.afterEnter', function() {
                if (!isInitialized()) {
                    $scope.fetch();
                }
            });

            $scope.$on('$ionicView.afterLeave', function() {
                setNeedsInitialization(true);
            })
        }
    ]);