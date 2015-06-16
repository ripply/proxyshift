angular.module("scheduling-app.controllers")
    .controller("LogoutController", [
        '$scope',
        '$state',
        'STATES',
        'AuthenticationService',
        function($scope,
                 $state,
                 STATES,
                 AuthenticationService) {
            $scope.logout = function() {
                console.log("Logout controller... logging out...");
                AuthenticationService.logout()
                    .then(function() {
                        console.log("Logged out");
                        $state.go(STATES.LOGIN);
                    }, function() {
                        console.log("Failed to logout!!!");
                        $state.go(STATES.LOGIN);
                    });
            };

            // http://blog.ionic.io/navigating-the-changes/
            // views in ionic are now never destroyed
            // for speed improvements they are cached, thus
            // scope is not remade every time
            // use this event to handle that
            // normally, ng-init should work
            // and that will need to be tested when desktop
            // interface is setup
            $scope.$on('$ionicView.afterEnter', function() {
                $scope.logout();
            });
        }
    ]);
