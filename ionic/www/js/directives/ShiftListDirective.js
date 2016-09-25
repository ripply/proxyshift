angular.module('scheduling-app.directives')
    .directive('shiftList', function() {
        return ({
            controller: 'OpenShiftsDirectiveController',
            link: link,
            restrict: 'E',
            templateUrl: 'templates/_shiftlist.html',
            scope: {
                dismissable: '=dismissable',
                cancelable: '=cancelable'
            }
        });

        function link(scope, element, attributes) {
            scope.name = attributes.name;
            scope.expiredUri = attributes.expired;
            if (attributes['acceptedonly']) {
                scope.acceptedOnly = attributes['acceptedonly'] == 'true';
            } else {
                scope.acceptedOnly = false;
            }
            if (attributes['showdividers']) {
                scope.showDividers = attributes['showdividers'] == 'true';
            } else {
                scope.showDividers = false;
            }
            if (attributes['swipable']) {
                scope.swipable = attributes['swipable'] == 'true';
            } else {
                scope.swipable = true;
            }
        }
    }
);
