/**
 * Author: Padilla
 * Date: 9/7/13
 * Time: 12:27 PM
 * This is a mess, feel free to mess it up or tell me better way to do it.
 *
 */



$(document).ready(function() {
	//************************************ Notification

	$('body').append('<div id="notificacion"><span></span></div>');

	var notifMsg;
	var jumpNotification = function() {
		var mensaje = notifMsg;
		var $notificacion = $('#notificacion');
		$notificacion.find('span').text(mensaje);
		$notificacion.stop().animate({
			top: '0'
		});
		setTimeout(function() {
			$notificacion.stop().animate({
				top: '-30px'
			});
		}, 100000);
	};
	//************************************ gmaps
	var map;
	(function(position) {
		var map = new GMaps({
			div: '#map',
			lat: 9.9340573930128,
			lng: -84.05647694782
		});
		GMaps.geolocate({
			success: function(position) {
				map.setCenter(position.coords.latitude, position.coords.longitude);
				map.addMarker({
					lat: position.coords.latitude,
					lng: position.coords.longitude,
					title: 'You are here',
					infoWindow: {
						content: '<p>Estas aqui</p>'
					}

				});
				notifMsg = "Location: lat= " + position.coords.latitude + ", lon= " + position.coords.longitude;
			},
			error: function(error) {
				notifMsg = 'Geolocation failed: ' + error.message;
			},
			not_supported: function() {
				notifMsg = "Your browser does not support geolocation";
			},
			always: function() {
				jumpNotification($('.notificar'));
			}
		});
	})();

});