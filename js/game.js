var systems = [
	'canvasSetup',
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
	'useShieldStrength',
	'drawArc',
	'spikeyStrength',
	'spikeyArcPath',
	'chooseFrames',
	'drawFrames',
	'drawPath',
	'drawShield',
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


function Enemy(){
	return {
	  Position: {x: 0 ,y:can.height/2},
	  Velocity: {x:5, y: 0},
	  Arc: {radius : 20, ratio: 1, theta : { start: 0 , end : 2 * Math.PI }},
	  DieOnCollision: { inCircle: true, inArc: false },
	  RenderArc: {},
	  Strength: { strength: 50 },
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