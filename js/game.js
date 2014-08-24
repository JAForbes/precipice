var systems = [
	'canvasSetup',
	'weaponClock',
	'spawnInterval',
	'move',
	'lockPosition',
	'recordGesture',
	'gestureDirection',
	'gestureDistance',
	'gestureTowardCenter',
	'gestureDuration',
	'gestureVelocity',
	'gestureShoot',
	'gestureShield',
	'arcCollision',
	'dieOnArcCollision',
	'damageOnArcCollision',
	'depleteShield',
	'shoot',
	'arcStrength',
	'useShieldStrength',
	'drawArc',
	'spikeyStrength',
	'spikeyArcPath',
	'scaleFrame',
	'chooseFrames',
	'drawFrames',
	'drawPath',
	'drawShield',
	'removeOffscreen',
	'remove',
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



window.onkeydown = function(e){
	console.log(e.which)
	if(e.which == '69'){
		E(Enemy())
	} else if (e.which == '80'){
		E('Paused').sample().paused = !E('Paused').sample().paused;
	}

}