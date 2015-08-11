angular.module('scheduling-app.controllers')
    .controller('BaseModelController', [
        '$scope',
        '$injector',
        function($scope,
                 $injector) {
            $scope._models = {};
            $scope.pending = {};
            $scope.failed = {};
            $scope.errors = {};
            $scope.success = {};
            $scope.register = register;
            $scope.unregister = unregister;

            $scope.fetch = function () {
                angular.forEach($scope._models, function(objectMap, objectName) {
                    var addFunction = objectMap.add;
                    var object = objectMap.object;

                    if (!objectMap.pendingFetch ||
                        (objectMap.pendingFetch && !objectMap.pendingFetch.isPending())) {
                        // object is currently not pending or the pending fetch is finished
                        setPending(objectName);
                        objectMap.pendingFetch = object.getList();
                        objectMap.pendingFetch.then(function(result) {
                            $scope[objectName] = result;
                            delete objectMap.pendingFetch;
                            setSuccess(true);
                        }, function(err) {
                            delete objectMap.pendingFetch;
                            setFailed(objectName, err);
                        });
                    } else {
                        // object is currently pending
                        // no need to fetch
                    }
                });
            };

            function needsInitialization() {
                return $scope._needsInitialization;
            }

            function setNeedsInitialization(value) {
                $scope._needsInitialization = value;
            }

            function isInitialized() {
                !needsInitialization();
            }

            $scope.$on('$ionicView.afterEnter', function() {
                if (!isInitialized()) {
                    $scope.fetch();
                }
            });

            $scope.$on('$ionicView.afterLeave', function() {
                setNeedsInitialization(true);
            });

            function register(modelName, modelObject, addFunction) {
                if (arguments.length == 2) {
                    // assume 2nd argument is addFunction
                    // get 2nd argument via modelName
                    addFunction = modelObject;
                    modelObject = $injector.get(modelName);
                }
                $scope.pending[modelName] = false;
                $scope.failed[modelName] = false;
                if ($scope._models.hasOwnProperty(modelName)) {
                    $scope.unregister(modelName);
                }
                $scope._models[modelName] = {
                    add: addFunction,
                    object: modelObject
                };
            }

            function unregister(modelName) {
                delete $scope._models[modelName];
                angular.forEach(['failed', 'errors'], function(variable) {
                    if ($scope[variable].hasOwnProperty(modelName)) {
                        delete $scope[variable][modelName];
                    }
                });
            }

            function setPending(objectName) {
                $scope.pending[objectName] = true;
            }

            function clearPending(objectName) {
                $scope.pending[objectName] = false;
            }

            function setFailed(objectName, err) {
                $scope.failed[objectName] = true;
                $scope.errors[objectName] = err;
                $scope.success[objectName] = false
                clearPending(objectName);
            }

            function setSuccess(objectName) {
                $scope.failed[objectName] = false;
                if ($scope.errors.hasOwnProperty(objectName)) {
                    delete $scope.errors[objectName];
                }
                $scope.success[objectName] = true;
                clearPending(objectName);
            }
        }
    ]);
