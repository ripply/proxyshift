angular.module('starter.controllers', [])

.controller('AppCtrl', ['$scope', '$ionicModal', '$timeout', '$rootScope', function($scope, $ionicModal, $timeout, $rootScope) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.loginModal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.loginModal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $rootScope.$broadcast('event:auth-loginRequired');
    //$scope.loginModal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
}])
.controller('LoginController', ['$scope', '$http', '$state', 'AuthenticationService', function($scope, $http, $state, AuthenticationService) {

      $scope.user = {
        username: null,
        password: null,
        remember_me: false
      };

      $scope.login = function() {
        AuthenticationService.login($scope.user);
      };

      $scope.$on('event:auth-loginRequired', function(e, rejection) {
        // clear any error messages
        $scope.message = null;
        // reset existing midtyped username/password
        $scope.user.username = null;
        $scope.user.password = null;
        $scope.user.remember_me = false;
        
        $scope.loginModal.show();
      });

      $scope.$on('event:auth-loginConfirmed', function() {
        $scope.user.username = null;
        $scope.user.password = null;
        $scope.message = null;
        $scope.loginModal.hide();
      });

      $scope.$on('event:auth-login-failed-invalid', function(e, message) {
        $scope.message = message;
      });

      $scope.$on('event:auth-login-failed', function(e, status) {
        var error = "Login failed.";
        if (status == 401) {
          error = "Invalid Username or Password.";
        }
        $scope.message = error;
      });

      $scope.$on('event:auth-logout-complete', function() {
        $state.go('app.home', {}, {reload: true, inherit: false});
      });
    }])

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
  $scope.add = function() {
    $scope.playlists.push({
      title: 'test!?', id: $scope.playlists.length
    });
  };
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
