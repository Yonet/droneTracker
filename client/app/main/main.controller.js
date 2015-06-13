'use strict';

angular.module('droneTrackerApp')
  .controller('MainCtrl', function ($scope, pathService, $timeout, $http, socket) {

    // $scope.paths = pathService.getPath();
    $scope.map;
    //Delete marker
    $scope.markers = [];

    $scope.planCoordinates = pathService.getPath();
    $scope.pauseDrone = function(){
      socket.socket.emit('pauseDrone');
    };

    $scope.startDrone = function(){
      console.log('start drone clicked');
      socket.socket.emit('startDrone');

    };
    $scope.stopDrone = function(){
      socket.socket.emit('stopDrone');
    };
    socket.socket.on('moveDrone', function(){

    })

  });
