angular.module('scheduling-app.directives')
    .directive('shiftList', function() {
        return ({
            controller: 'OpenShiftsDirectiveController',
            link: link,
            restrict: 'E',
            templateUrl: 'templates/_shiftlist.html',
            scope: {
                dismissable: '=dismissable'
            }
        });

        function link(scope, element, attributes) {
            scope.$on('$ionicView.afterEnter', function() {
                console.log("After enter in directive link");
            });
        }
    }
);
