var systems = [
	'canvasSetup',
	'lockPosition',
	'recordGesture',
	'gestureDirection',
	'gestureDistance',
	'gestureTowardCenter',
	'gestureDuration',
	'gestureVelocity',
	'gestureShoot',
	'move',
	'shoot',
	'drawCircle',
	'cleanUp',
]

function loop () {
	_(systems).each(function(name){
		var system = Systems[name];
		if(system){
			system()
		}
	})
	requestAnimationFrame(loop)
}
loop()
