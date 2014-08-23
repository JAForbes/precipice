var systems = [
	'canvasSetup',
	'recordGesture',
  'gestureDirection',
  'gestureDistance',
  'gestureTowardCenter',
  'gestureDuration',
  'gestureVelocity',
  'drawMouse',
  'drawGesture',

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
