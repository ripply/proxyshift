angular.module('scheduling-app.directives')
    .directive('ignorableShifts', function() {
        return ({
            controller: 'IgnorableShiftsDirectiveController',
            link: link,
            restrict: 'A',
            templateUrl: 'templates/_ignorableshifts.html'
        });

        function link(scope, element, attributes) {
            scope.$on('$ionicView.afterEnter', function() {
                console.log("After enter in directive link");
            });
        }
    }
);
