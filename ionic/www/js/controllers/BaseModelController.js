angular.module('scheduling-app.controllers')
    .controller('BaseModelController', [
        '$rootScope',
        '$scope',
        '$injector',
        'GENERAL_EVENTS',
        function(
            $rootScope,
            $scope,
            $injector,
            GENERAL_EVENTS
        ) {
            $scope.active = true;
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
            if ($scope.fetchComplete === undefined) {
                $scope.fetchComplete = ionicRefreshComplete;
            }
            if ($scope.ionicRefreshComplete === undefined) {
                $scope.ionicRefreshComplete = ionicRefreshComplete;
            }

            $scope.fetch = function () {
                angular.forEach($scope._models, function(objectMap, objectName) {
                    var method = objectMap.method;
                    var subRouteFunction = objectMap.subRoute;
                    var object = objectMap.object;

                    if (!objectMap.pendingFetch ||
                        (objectMap.pendingFetch && !objectMap.pendingFetch.$resolved)) {
                        // object is currently not pending or the pending fetch is finished
                        setPending(objectName);
                        objectMap.pendingFetch = subRouteFunction(object, method);
                        objectMap.pendingFetch.$promise.then(function(result) {
                            // check if result is an empty array or empty object
                            // if it is, then delete the variable from scope
                            // this makes it easy to ng-show in templates

                            // TODO: Make this check an optional flag
                            if (result !== null && result !== undefined) {
                                if (result instanceof Array) {
                                    if (result.length === 0) {
                                        result = undefined;
                                    }
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

                            $rootScope.$emit(GENERAL_EVENTS.UPDATES.RESOURCE, objectName, result, oldValue, $scope);
                            if ($scope.fetchComplete !== undefined) {
                                $scope.fetchComplete(result, oldValue);
                            }
                        }, function(err) {
                            delete objectMap.pendingFetch;
                            setFailed(objectName, err);
                            if ($scope.fetchComplete !== undefined) {
                                $scope.fetchComplete(undefined, undefined);
                            }
                        });
                    } else {
                        // object is currently pending
                        // no need to fetch
                    }
                });
            };

            function ionicRefreshComplete(result, oldValue) {
                $scope.$broadcast('scroll.refreshComplete');
            }

            function needsInitialization() {
                return $scope._needsInitialization;
            }

            function setNeedsInitialization(value) {
                $scope._needsInitialization = value;
            }

            function isInitialized() {
                !needsInitialization();
            }

            function beforeEnterEvent() {
                if (!isInitialized()) {
                    $scope.fetch();
                }
                if ($scope.beforeEnter !== undefined) {
                    $scope.beforeEnter();
                }
            }

            function afterEnterEvent() {
                if ($scope.afterEnter !== undefined) {
                    $scope.afterEnter();
                }
            }

            function enterEvent() {
                $scope.active = true;
                if ($scope.enter !== undefined) {
                    $scope.enter();
                }
            }

            function beforeLeaveEvent() {
                if ($scope.beforeLeave !== undefined) {
                    $scope.beforeLeave();
                }
            }

            function afterLeaveEvent() {
                setNeedsInitialization(true);
                if ($scope.afterLeave !== undefined) {
                    $scope.afterLeave();
                }
            }

            function leaveEvent() {
                $scope.active = false;
                if ($scope.leave !== undefined) {
                    $scope.leave();
                }
            }

            $scope.errorToast = function(title, body, other) {
                toast('error', title, body, other);
            };

            $scope.infoToast = function(title, body, other) {
                toast('info', title, body, other);
            };

            $scope.warningToast = function(title, body, other) {
                toast('warning', title, body, other);
            };

            $scope.toast = toast;

            function toast(type, title, body, other) {
                $rootScope.$emit(GENERAL_EVENTS.TOAST, type, title, body, other);
            }

            $scope.$on('$ionicView.beforeEnter', beforeEnterEvent);
            $scope.$on('$ionicNavView.beforeEnter', beforeEnterEvent);
            $scope.$on('$ionicView.afterEnter', afterEnterEvent);
            $scope.$on('$ionicNavView.afterEnter', afterEnterEvent);
            $scope.$on('$ionicView.enter', enterEvent);
            $scope.$on('$ionicNavView.enter', enterEvent);
            $scope.$on('$ionicView.beforeLeave', beforeLeaveEvent);
            $scope.$on('$ionicNavView.beforeLeave', beforeLeaveEvent);
            $scope.$on('$ionicView.afterLeave', afterLeaveEvent);
            $scope.$on('$ionicNavView.afterLeave', afterLeaveEvent);
            $scope.$on('$ionicView.leave', leaveEvent);
            $scope.$on('$ionicNavView.leave', leaveEvent);

            function register(modelName, modelObject, method, subRouteFetchFunction) {
                if (arguments.length <= 2) {
                    // assume 2nd argument is addFunction
                    // get 2nd argument via modelName
                    method = modelObject;
                    modelObject = $injector.get(modelName);
                }
                $scope.pending[modelName] = false;
                $scope.failed[modelName] = false;
                if ($scope._models.hasOwnProperty(modelName)) {
                    $scope.unregister(modelName);
                }
                if (subRouteFetchFunction === undefined) {
                    subRouteFetchFunction = function(model, method) {
                        return model[method]();
                        /*
                        if ($scope.hasOwnProperty('isList') && $scope.isList == false) {
                            return model.one().get();
                        } else {
                            return model.getList();
                        }
                        */
                    }
                }
                $scope._models[modelName] = {
                    method: method,
                    subRoute: subRouteFetchFunction,
                    object: modelObject
                };
                $scope.$on(GENERAL_EVENTS.UPDATES.RESOURCE, function(env, objectName, result, oldValue, otherScope) {
                    if ($scope !== otherScope) {
                        if ($scope.fetchComplete !== undefined) {
                            $scope.fetchComplete(result, oldValue);
                        }
                    }
                });
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
