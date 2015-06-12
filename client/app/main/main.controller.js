'use strict';

angular.module('droneTrackerApp')
  .controller('MainCtrl', function ($scope, pathService, $timeout, $http, socket) {

    // $scope.paths = pathService.getPath();
    $scope.map;
    //Delete marker
    $scope.markers = [];

    $scope.planCoordinates = pathService.getPath();
    // console.log('$scope.planCoordinates',$scope.planCoordinates[0])
    $scope.pauseDrone = function(){
      console.log('pause drone clicked');
      socket.pauseDrone($scope.planCoordinates[0]);

    };

    $scope.startDrone = function(){
      console.log('start drone clicked', $scope.planCoordinates[0]);
      socket.socket.emit('startDrone', $scope.planCoordinates[0]);

    };
    socket.socket.on('moveDrone', function(){
        
    })
    // $http.get('/api/paths').success(function(planCoordinates) {
    //   $scope.planCoordinates = planCoordinates;
    //   socket.syncUpdates('paths', $scope.planCoordinates);
    // });

    // $scope.addThing = function() {
    //   if($scope.newThing === '') {
    //     return;
    //   }
    //   $http.post('/api/things', { name: $scope.newThing });
    //   $scope.newThing = '';
    // };

    // $scope.deleteThing = function(thing) {
    //   $http.delete('/api/things/' + thing._id);
    // };

    // $scope.$on('$destroy', function () {
    //   socket.unsyncUpdates('thing');
    // });
  });
