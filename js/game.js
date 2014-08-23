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
	'spikeyCharge',
	'spikeyCirclePath',
	'drawPath',
	'cleanUp',
]

function loop () {
	var paused = E('Paused').sample().paused;
	if(!paused){
		_(systems).each(function(name){
			var system = Systems[name];
			if(system){
				system()
			}
		})	
	}
	
	requestAnimationFrame(loop)
}
loop()
