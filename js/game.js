var systems = [
	'canvasSetup'
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
