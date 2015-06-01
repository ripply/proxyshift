angular.module('scheduling-app.controllers', [
  'scheduling-app.models',
  'scheduling-app.config'
])

    .controller('PlaylistsCtrl', [
      '$scope',
      'UsersModel',
      function($scope, UsersModel) {
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
        $scope.fetch = function() {
          UsersModel.getList().then(function(users) {
            console.log("Successfully fetched users!");
            $scope.playlists = users;
          }, function(err) {
            $scope.playlists = [
              {username: 'Failed to fetch users'}
            ];
          });
        };
        $scope.fetch();
}])

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
