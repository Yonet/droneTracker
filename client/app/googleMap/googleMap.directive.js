'use strict';

angular.module('droneTrackerApp')
	.directive('googleMap', function (socket) {
		return {
 
			restrict: 'EA',
			scope:{
				planCoordinates: '=',
				actualCoordinates: '='
			},
			link: function (scope, element, attrs) {
				element.text('this is the googleMap directive');
				var mapCanvas = document.getElementById('map-canvas');

				//drone moving symbol options
				var droneSymbol = {
			    path: google.maps.SymbolPath.CIRCLE,
			    scale: 8,
			    strokeColor: '#393'
			  };

			  //main map options.
			  var mapOptions = {
					center: centerCoord,
					zoom: 17,
					mapTypeId: google.maps.MapTypeId.ROADMAP
				}

				//travelled path options
				var polyOptions = {
			    strokeColor: '#000000',
			    strokeOpacity: 1.0,
			    strokeWeight: 3
			  };
			
				var coordinateToPathPoints = function(coordinatesArray){
					var mapPoints = [];
					angular.forEach(coordinatesArray, function(value, key){
						mapPoints.push(new google.maps.LatLng(value[0], value[1]));
					})
					return mapPoints;
				}

				var flightPlanCoordinates = coordinateToPathPoints(scope.planCoordinates);

				//Map options gets the center coordinate from scope coordinates
				var calculateCenter = function(){
					if(!flightPlanCoordinates.length) {return new google.maps.LatLng(37.7577,-122.4376);}
					else { 
						var ind = Math.floor(flightPlanCoordinates.length / 2);
						return flightPlanCoordinates[ind];
					}
				}
				var centerCoord = calculateCenter();

				

				var map = new google.maps.Map(mapCanvas, mapOptions)

				var flightPath = new google.maps.Polyline({
					path: flightPlanCoordinates,
					geodesic: true,
					strokeColor: '#FF0000',
					strokeOpacity: 0.25,
					strokeWeight: 2
				});


				flightPath.setMap(map);
				var travelled;

			  travelled = new google.maps.Polyline(polyOptions);

			  socket.socket.on('moveDrone', addLatLng)
			  travelled.setMap(map);
			  function addLatLng(event) {
			  	var path = travelled.getPath();
			  	var coord = new google.maps.LatLng(event.newCoordinate[0], event.newCoordinate[1]);
			  	path.push(coord);
			  	console.log('adding lat long', event.newCoordinate);
			  }

			}
			//Link
		};
	});