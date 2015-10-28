angular.module('scheduling-app.directives')
    .directive('createSubclass', function() {
        return ({
            controller: 'CreateSubclassDirectiveController',
            link: link,
            restrict: 'E',
            templateUrl: 'templates/createsubclass.html',
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
