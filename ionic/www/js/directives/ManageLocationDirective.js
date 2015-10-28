angular.module('scheduling-app.directives')
    .directive('manageLocation', function() {
        return ({
            controller: 'ManageLocationDirectiveController',
            link: link,
            restrict: 'E',
            templateUrl: 'templates/managelocation.html',
            scope: {
                dismissable: '=dismissable',
                cancelable: '=cancelable'
            }
        });

        function link(scope, element, attributes) {
            scope.$on('$ionicView.afterEnter', function() {
                console.log("After enter in directive link");
            });
        }
    }
);
