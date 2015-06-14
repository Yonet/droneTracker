'use strict';

angular.module('droneTrackerApp')
	.directive('googleMap', function (socket) {
		return {
 
			restrict: 'EA',
			scope:{
				planCoordinates: '=',
				offset: '='
			},
			link: function (scope, element, attrs) {
				//Canvas element to initialize the Google map
				var mapCanvas = document.getElementById('map-canvas');
				//move interval
				var move, totalTime, icons;

				//initial drone offset from the start position
				var offset = '0%';
				var offsetPercantage = 0;

				//Drone path coordinates
				var coordinatesArray = scope.planCoordinates;

				//drone moving symbol options
				var droneSymbol = {
					path: google.maps.SymbolPath.CIRCLE,
					scale: 8,
					strokeColor: '#393'
				};

				//Converts each coordinate to path points for google maps
				var coordinateToPathPoints = function(coordinatesArray){
					var mapPoints = [];
					angular.forEach(coordinatesArray, function(value, key){
						mapPoints.push(new google.maps.LatLng(value[0], value[1]));
					})
					return mapPoints;
				}

				var flightPlanCoordinates = coordinateToPathPoints(coordinatesArray);

				//Map options gets the center coordinate from scope coordinates
				var calculateCenter = function(){
					if(!flightPlanCoordinates.length) {return new google.maps.LatLng(37.7577,-122.4376);}
					else { 
						var ind = Math.floor(flightPlanCoordinates.length / 2);
						return flightPlanCoordinates[ind];
					}
				}
				var centerCoord = calculateCenter();

				//Number to radians 
				var toRadians = function(num){
					return num * Math.PI / 180;	
				}

				// Calculates total distance of the path
				var calculateDistance = function(coord1, coord2){
					var R = 6371000; // metres
					var φ1 = toRadians(coord1[0]);
					var φ2 = toRadians(coord2[0]);
					var Δφ = toRadians(coord2[0] - coord1[0]);
					var Δλ = toRadians(coord2[1] - coord1[1]);
					var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
					        Math.cos(φ1) * Math.cos(φ2) *
					        Math.sin(Δλ/2) * Math.sin(Δλ/2);
					var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

					var d = R * c;
					return d;
				}

				//Calculates the total time the drone will travel the path
				var calculateTime = function(){
					var distance = 0;
					for(var i = 1; i < coordinatesArray.length; i++){
						var currentDist = calculateDistance(coordinatesArray[i - 1], coordinatesArray[i]);
						distance += currentDist;
					}
					var time = distance / 10;//seconds for total
					return time;
				}

				//main map options.
				var mapOptions = {
					center: centerCoord,
					zoom: 17,
					mapTypeId: google.maps.MapTypeId.ROADMAP
				}

				//Initilized map
				var map = new google.maps.Map(mapCanvas, mapOptions)

				// Draws path polyline
				var flightPath = new google.maps.Polyline({
					path: flightPlanCoordinates,
					geodesic: true,
					icons: [{
						icon: droneSymbol,
						offset: offset
					}],
					strokeColor: '#FF0000',
					strokeOpacity: 1,
					strokeWeight: 2
				});

				// Attaches path to map
				flightPath.setMap(map);

				var stopDrone = function(){
					icons = flightPath.get('icons');
					offset = icons[0].offset;
					clearInterval(move);
				}

				//animates backwords to the starting position
				var moveBack = function(){
					icons = flightPath.get('icons');
					offsetPercantage = offset.split('%')[0];
					move = window.setInterval(function() {
						offsetPercantage -= 1/totalTime * 100;
						if(offsetPercantage === 0) {
							clearInterval(move); 
							icons[0].offset = '0%'; 
							return;
						}
						icons[0].offset = offsetPercantage + '%';
						flightPath.set('icons', icons);
					}, 1000);
				}

				//Animates drone position
				function animateCircle() {
					totalTime = calculateTime();
					icons = flightPath.get('icons');
					icons[0].offset = offset;
					move = window.setInterval(function() {
						offsetPercantage += 1/totalTime * 100;
						if(icons[0].offset === '100%') {clearInterval(move);}
						icons[0].offset = offsetPercantage + '%';
						flightPath.set('icons', icons);
					}, 1000);///move

				}///Animate
			
				//Watch for drone event
				socket.socket.on('startDrone', animateCircle);
				socket.socket.on('pauseDrone', stopDrone);
				socket.socket.on('stopDrone', function(){
						stopDrone();
						moveBack();
				})///stopDrone

			}///Link
		};///returned
	});