angular.module('scheduling-app.directives')
    .directive('sendInvite', function() {
        return ({
            controller: 'SendInviteDirectiveController',
            link: link,
            restrict: 'E',
            templateUrl: 'templates/invitemember.html',
            scope: {
                dismissable: '=dismissable',
                cancelable: '=cancelable'
            }
        });

        function link(scope, element, attributes) {
        }
    }
);
