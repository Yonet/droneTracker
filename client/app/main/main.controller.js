'use strict';

angular.module('droneTrackerApp')
  .controller('MainCtrl', function ($scope, pathService, socket) {

    $scope.planCoordinates = pathService.getPath();

    $scope.pauseDrone = function(){
      socket.socket.emit('pauseDrone');
    };

    $scope.startDrone = function(){
      socket.socket.emit('startDrone');

    };
    $scope.stopDrone = function(){
      socket.socket.emit('stopDrone');
    };

  });
