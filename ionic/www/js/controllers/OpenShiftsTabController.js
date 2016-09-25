angular.module('scheduling-app.controllers')
    .controller('OpenShiftsTabController', [
        '$rootScope',
        '$scope',
        '$controller',
        '$state',
        '$stateParams',
        'STATES',
        'GENERAL_EVENTS',
        function($rootScope,
                 $scope,
                 $controller,
                 $state,
                 $stateParams,
                 STATES,
                 GENERAL_EVENTS
        ) {
            var validTabPages = [
                STATES.SHIFTS,
                STATES.MYSHIFTS,
                STATES.MANAGE,
                STATES.MYCALLOUTS,
                STATES.SHIFT_INFO
            ];
            $controller('BaseModelController', {$scope: $scope});
            $scope.afterEnter = function() {
                if (validTabPages.indexOf($state.current.name) >= 0) {
                    $rootScope.currentTabPage = $state.href($state.current.name);
                    $rootScope.currentTagPageState = $state.current.name;
                }
            };

            $rootScope.$on(GENERAL_EVENTS.CALENDAR.CLICKED, function(state, name, selected, clickedDay) {
                var start = moment().year(clickedDay.year).month(clickedDay.month - 1).date(clickedDay.number).format('X');
                scrollTo(start);
                $rootScope.$emit(GENERAL_EVENTS.CALENDAR.HIDE, name);
            });

            $rootScope.$on('$stateChangeSuccess', function(ev, to, toParams, from, fromParams) {
                tryToScrollToDate(toParams);
            });

            tryToScrollToDate($stateParams);

            function tryToScrollToDate(params) {
                if (params.scroll_date) {
                    scrollTo(time);
                }
            }

            function scrollTo(time) {
                $rootScope.$emit(GENERAL_EVENTS.SHIFTS.SCROLL, time);
            }
        }]);
