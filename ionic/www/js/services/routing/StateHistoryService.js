angular.module('scheduling-app.services.routing.statehistory', [
])
    .service('StateHistoryService', [
        '$rootScope',
        '$state',
        'STATES',
        function($rootScope,
                 $state,
                 STATES
        ) {
            $rootScope.states = STATES;
            angular.forEach(STATES, function(value, key) {
                STATES[key + "_URL"] = value.replace(/\./g, "/");
            });
            console.log(STATES);
            $rootScope.$on('$stateChangeSuccess', function(ev, to, toParams, from, fromParams) {
                $rootScope.previousState = from.name;
                $rootScope.previousStateParams = fromParams;
                $rootScope.currentState = to.name;
                $rootScope.currentStateParams = toParams;
            });

            this.previousState = function() {
                return $rootScope.previousState;
            };

            this.previousStateParams = function() {
                return $rootScope.previousStateParams;
            };

            this.currentState = function() {
                return $rootScope.currentState;
            };

            this.currentStateParams = function() {
                return $rootScope.currentStateParams;
            };

            this.defaultState = function() {
                return $rootScope.defaultState;
            };

            this.setDefaultState = function(state) {
                $rootScope.defaultState = state;
            };

            this.goBack = function() {
                // TODO: 2 calls in a row will go back and forth between 2 states
                var prevState = this.previousState();
                if (prevState === null ||
                    prevState === undefined) {
                    $state.go(this.defaultState(), {}, {reload: false})
                } else {
                    $state.go(prevState, this.previousStateParams(), {reload: false})
                }
            }
        }
    ]);
