'use strict';

angular.module('droneTrackerApp')
	.directive('googleMap', function (socket) {
		return {
 
			restrict: 'EA',
			scope:{
				planCoordinates: '='
			},
			link: function (scope, element, attrs) {
				element.text('this is the googleMap directive');
				var mapCanvas = document.getElementById('map-canvas');
				var move;
				var offset = '0%';
				var offsetPercantage = 0;
				var coordinatesArray = scope.planCoordinates;
				//drone moving symbol options
				var droneSymbol = {
					path: google.maps.SymbolPath.CIRCLE,
					scale: 8,
					strokeColor: '#393'
				};

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
				var toRadians = function(num){
					return num * Math.PI / 180;	
				}


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

				var calculateTime = function(){
					var distance = 0;
					for(var i = 1; i < coordinatesArray.length; i++){
						var currentDist = calculateDistance(coordinatesArray[i - 1], coordinatesArray[i]);
						distance += currentDist;
					}
					var time = distance / 10;//seconds for total
					console.log('distance', distance, time);
					return time;
				}
				

				var centerCoord = calculateCenter();

				//main map options.
				var mapOptions = {
					center: centerCoord,
					zoom: 17,
					mapTypeId: google.maps.MapTypeId.ROADMAP
				}
				

				var map = new google.maps.Map(mapCanvas, mapOptions)

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


				flightPath.setMap(map);




				socket.socket.on('startDrone', animateCircle)


				
				function animateCircle() {
					var totalTime = calculateTime();
					var offsetPercantage = 0;
					var icons = flightPath.get('icons');
					var stopDrone = function(){
						offset = icons[0].offset;
						clearInterval(move);
					}

					var moveBack = function(){
						offsetPercantage = offset.split('%')[0];
						console.log('offsetPercantage', offsetPercantage);
						var move = window.setInterval(function() {
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
					socket.socket.on('pauseDrone', stopDrone);
					socket.socket.on('stopDrone', function(){
						
						// icons[0].offset = offset ='0%';
						// flightPath.set('icons', icons);
						stopDrone();
						moveBack();
					})
					// socket.socket.on('pauseDrone', function(){
					// 	return clearInterval(move);
					// })

					// socket.socket.on('stopDrone', function(){
					// 	return clearInterval(move);
					// })
					move = window.setInterval(function() {
						offsetPercantage += 1/totalTime * 100;
						if(icons[0].offset === '100%') {clearInterval(move);}
						icons[0].offset = offsetPercantage + '%';
						flightPath.set('icons', icons);
					}, 1000);
					///move

					socket.socket.on('startDrone', function(){
							
							icons[0].offset = offset;
							flightPath.set('icons', icons);
							move = window.setInterval(function() {
								offsetPercantage += 1/totalTime * 100;

								var icons = flightPath.get('icons');
								icons[0].offset = offsetPercantage + '%';
								flightPath.set('icons', icons);
								socket.socket.on('pauseDrone', function(){
									offset = icons[0].offset;
									return clearInterval(move);
								})
								

							}, 1000);
							
					})///startDrone

				}
				//Animate

			}
			//Link
		};
	});