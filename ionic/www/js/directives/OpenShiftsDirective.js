angular.module('scheduling-app.directives')
    .directive('openShifts', function() {
        return ({
            controller: 'OpenShiftsDirectiveController',
            link: link,
            restrict: 'A',
            templateUrl: 'templates/_openshifts.html'
        });

        function link(scope, element, attributes) {
            scope.$on('$ionicView.afterEnter', function() {
                console.log("After enter in directive link");
            });
        }
    }
);
