angular.module('scheduling-app.services.routing.statehistory', [
])
    .service('StateHistoryService', [
        '$rootScope',
        '$state',
        '$ionicHistory',
        'UserInfoService',
        'Analytics',
        'CORDOVA_SETTINGS',
        'STATES',
        function($rootScope,
                 $state,
                 $ionicHistory,
                 UserInfoService,
                 Analytics,
                 CORDOVA_SETTINGS,
                 STATES
        ) {
            $rootScope.states = STATES;
            angular.forEach(STATES, function(value, key) {
                STATES[key + "_URL"] = value.replace(/\./g, "/");
            });
            console.log(STATES);
            var goingTo;
            $rootScope.$on('$stateChangeSuccess', function(ev, to, toParams, from, fromParams) {
                if (to == goingTo) {
                    goingTo = null;
                }
                $rootScope.previousState = from.name;
                $rootScope.previousStateParams = fromParams;
                $rootScope.currentState = to.name;
                $rootScope.currentStateParams = toParams;
                gotoHistory.push(from.name);
            });

            function isAnalyticsDisabled() {
                return UserInfoService.getAnalyticsDisabled();
            }

            Analytics.set('client', CORDOVA_SETTINGS.currentPlatform);
            setTimeout(function startAnalyticsBatching() {
                var openInterval = 15000;
                setInterval(ANALYTICS_BATCH_OPEN, openInterval);
                setTimeout(function DELAY_START_CLOSE() {
                    setInterval(ANALYTICS_BATCH_CLOSE, openInterval)
                }, 1000);
            }, 15000);

            function ANALYTICS_BATCH_OPEN() {
                if (!isAnalyticsDisabled()) {
                    Analytics.offline(false);
                }
            }

            function ANALYTICS_BATCH_CLOSE() {
                Analytics.offline(true);
            }

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

            this.goBack = function(defaultState) {
                // TODO: 2 calls in a row will go back and forth between 2 states
                if ($ionicHistory.viewHistory().backView == null) {
                    $state.go(defaultState || this.defaultState(), {}, {reload: false});
                } else {
                    $ionicHistory.goBack();
                }
                /*
                var prevState = this.previousState();
                if (prevState === null ||
                    prevState === undefined) {
                    $state.go(this.defaultState(), {}, {reload: false})
                } else {
                    $state.go(prevState, this.previousStateParams(), {reload: false})
                }
                */
            };

            var gotoHistory = [];

            this.addToGotoHistory = function() {
                gotoHistory.push(this.currentState());
            };

            this.goto = function(state) {
                gotoHistory.push(this.currentState());
                $state.go(state, {}, {reload: true});
            };

            this.returnTo = function(defaultIfHistoryEmpty) {
                // TODO: Fix navigation history
                var returningTo = gotoHistory.pop();
                if (!returningTo) {
                    returningTo = defaultIfHistoryEmpty;
                }
                $state.go(returningTo, {}, {reload: true});
            };
        }
    ]);
