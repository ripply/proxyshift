angular.module('scheduling-app.directives')
    .directive('managingShifts', function() {
        return ({
            controller: 'ManagingShiftsDirectiveController',
            link: link,
            restrict: 'E',
            templateUrl: 'templates/_shiftlist.html',
            scope: {
                dismissable: '=dismissable',
                cancelable: '=cancelable',
                manageable: '=manageable',
                name: '=name'
            }
        });

        function link(scope, element, attributes) {
            scope.$on('$ionicView.afterEnter', function() {
                console.log("After enter in directive link");
            });
        }
    }
);
