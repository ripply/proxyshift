angular.module('scheduling-app.directives')
    .directive('managingShifts', function() {
        return ({
            controller: 'ManagingShiftsDirectiveController',
            link: link,
            restrict: 'E',
            templateUrl: 'templates/_shiftlist.html',
            scope: {
                dismissable: '=dismissable',
                cancelable: '=cancelable'
            }
        });

        function link(scope, element, attributes) {
            scope.manageable = attributes.manageable == 'true' || attributes.manageable == true;
            scope.swipable = true;
            scope.name = attributes.name;
            scope.$on('$ionicView.afterEnter', function() {
                console.log("After enter in directive link");
            });
        }
    }
);
