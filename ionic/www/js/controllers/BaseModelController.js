angular.module('scheduling-app.controllers')
    .controller('BaseModelController', [
        '$scope',
        '$injector',
        'GENERAL_EVENTS',
        function($scope,
                 $injector,
                 GENERAL_EVENTS
        ) {
            if ($scope._models === undefined) {
                $scope._models = {};
            }
            if ($scope.pending === undefined) {
                $scope.pending = {};
            }
            if ($scope.failed === undefined) {
                $scope.failed = {};
            }
            if ($scope.errors === undefined) {
                $scope.errors = {};
            }
            if ($scope.success === undefined) {
                $scope.success = {};
            }
            if ($scope.objects === undefined) {
                $scope.objects = {};
            }
            if ($scope.register === undefined) {
                $scope.register = register;
            }
            if ($scope.unregister === undefined) {
                $scope.unregister = unregister;
            }

            $scope.fetch = function () {
                angular.forEach($scope._models, function(objectMap, objectName) {
                    var addFunction = objectMap.add;
                    var subRouteFunction = objectMap.subRoute;
                    var object = objectMap.object;

                    if (!objectMap.pendingFetch ||
                        (objectMap.pendingFetch && objectMap.pendingFetch.isPending && !objectMap.pendingFetch.isPending())) {
                        // object is currently not pending or the pending fetch is finished
                        setPending(objectName);
                        objectMap.pendingFetch = subRouteFunction(object);
                        objectMap.pendingFetch.then(function(result) {
                            // check if result is an empty array or empty object
                            // if it is, then delete the variable from scope
                            // this makes it easy to ng-show in templates

                            // TODO: Make this check an optional flag
                            if (result !== null && result !== undefined) {
                                if (result instanceof Array) {
                                    if (result.length === 0) {
                                        result = undefined;
                                    }
                                } else if (typeof result === 'object') {
                                    result = undefined;
                                }
                            }

                            var oldValue = $scope[objectName];

                            if (result === undefined || result === null) {
                                if ($scope.hasOwnProperty(objectName)) {
                                    delete $scope[objectMap];
                                } else {
                                    // do nothing
                                }
                            } else {
                                $scope[objectName] = result;
                            }

                            delete objectMap.pendingFetch;
                            setSuccess(true);

                            $scope.$emit(GENERAL_EVENTS.UPDATES.RESOURCE, objectName, result, oldValue);
                            if ($scope.fetchComplete !== undefined) {
                                $scope.fetchComplete(result, oldValue);
                            }
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

            function register(modelName, modelObject, addFunction, subRouteFetchFunction) {
                if (arguments.length <= 2) {
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
                if (subRouteFetchFunction === undefined) {
                    subRouteFetchFunction = function(model) {
                        return model.getList();
                    }
                }
                $scope._models[modelName] = {
                    add: addFunction,
                    subRoute: subRouteFetchFunction,
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
