angular.module('scheduling-app.services.routing.statehistory', [
])
    .service('StateHistoryService', [
        '$rootScope',
        function($rootScope) {
            $rootScope.$on('$stateChangeSuccess', function(ev, to, toParams, from, fromParams) {
                $rootScope.previousState = from.name;
                $rootScope.previousStateParams = fromParams;
                $rootScope.currentState = to.name;
                $rootScope.currentStateParams = toParams;
            });
        }
    ]);