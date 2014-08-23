var systems = [
	'canvasSetup',
	'lockPosition',
	'move',
	'shoot',
	'recordGesture',
	'gestureDirection',
	'gestureDistance',
	'gestureTowardCenter',
	'gestureDuration',
	'gestureVelocity',
	'drawPosition',
	'drawGesture',
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
