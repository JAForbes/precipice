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
	'gestureShield',
	'move',
	'shoot',
	'useShootCharge',
	'useShieldCharge',
	'drawCircle',
	'spikeyCharge',
	'spikeyCirclePath',
	'drawPath',
	'drawShield',
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


function Enemy(){
	return {
	  Position: {x:0 ,y:400},
	  Velocity: {x:2, y: 0},
	  Circle: {radius : 20}
	}
}