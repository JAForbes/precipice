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
	'shieldRadialCollision',
	'logIntersection',
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
	  Position: {x: 0 ,y:can.height/2},
	  Velocity: {x:2, y: 0},
	  Circle: {radius : 20},
	  DieOnCollision: {}
	}
}

window.onkeydown = function(e){
	console.log(e.which)
	if(e.which == '69'){
		E(Enemy())
	} else if (e.which == '80'){
		E('Paused').sample().paused = !E('Paused').sample().paused;
	}

}