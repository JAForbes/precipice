var systems = [
	'canvasSetup',
	'strengthLose',
	'weaponClock',
	'spawnInterval',
	'spawnVillagers',
	'mouseState',
	'move',
	'targetReached',
	'targetScore',
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
	'sounds',
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
	} else {
		$('.villager_count').html('<p>Game will restart in 4 seconds</p>')
		_.delay(function(){
			/localhost/.test(window.location.href) || location.reload()

		},4000)
	}
	
	requestAnimationFrame(loop)
}




window.onkeydown = function(e){
	console.log(e.which)
	if (e.which == '80'){
		E('Paused').sample().paused = !E('Paused').sample().paused;
	}

}


function updateScreen(){
    var $el = $(window);
    var w = $el.width()
    var h = $el.height();
    var screen = E('Screen',gameID)
    screen.width = w;
    screen.height = h;
    setTimeout(drawTrees,200)
}




function drawTrees() {
    E('Tree').each(function(tree,e){
        E.remove(e)
    });
    var n = 25;
    var angle = 2*Math.PI /n
    var offsetX = can.width /2;
    var offsetY = can.height/1.5;
    var xScale = can.width/2;
    var yScale = can.height/2
    _(n).times(function(i){

      var x = Math.cos(i*angle) * xScale + offsetX;
      var y = Math.sin(i*angle) * yScale + offsetY;

      E({
        Position: {x:x,y:y},
        Frame: {scale:y/(can.width/20), playspeed: 1/5, frame: new Frame().reset(tree) },
        Tree: {}
      })
      return [x,y]
    })
}

startGame = function(){
    
    var mc = new Hammer.Manager(can, {});

    var pan = new Hammer.Pan();
    mc.add(pan);

    mc.on('panstart', function(ev) {
        var mouse = E('Mouse',gameID);
        mouse.down = true;
    });
    mc.on('pan', function(ev) {
        var p = ev.pointers[0];
        var mouse = E('Mouse',gameID);
        mouse.x = p.clientX
        mouse.y = p.clientY
        ev.preventDefault()
    });
    mc.on('panend', function(ev) {
        //  transform.pos = ev.center;
        var mouse = E('Mouse',gameID);
        mouse.down = false;

    });


    gameID = E({
        Canvas: { el: can, width: 1, height: 1, con: can.getContext('2d') },
        Mouse: { x: can.width/2, y: can.height/2, },
        Paused: { paused: false },
        Screen: { width: 0, height: 0},
        Score: {},
    })



    home = E({
        Position: {x: can.width/2, y:can.height/2},
        Velocity: {x: 0,y:0},
        LockPosition: {position: 'center'},
        Strength: o({ strength: 150 }),
        Arc: { radius: 150, ratio: 0, theta: { start:0 , end: 2*Math.PI} },
        Frame: {scale:10 , playspeed: 1/5, frame: new Frame().reset(wormhole) },
        GestureShoot: {},
        DamageOnCollision: { inCircle: true },
        FrameScale: { component: 'Strength', key: 'strength', multiplier: 0.07 },
        StrengthLose: { min: 50},
        ArcStrength: {}
    })

    defender = E({
        Position: {x: can.width/2, y:can.height/2},
        LockPosition: {position: 'center'},
        Frame: {scale:3 , playspeed: 1/10, frame: new Frame().reset(wizard) },
        State: {action:'idle'},
        MouseState: { down: 'cast' },
        Strength: E('Strength',home)
    })

    E('Strength',defender).change(function(){
      var state = E('State',defender);
      state.action = 'hurt';
      _.delay(function(){
        state.action = 'idle';
      },200)
    })

    shield = E({
        Arc : { radius: 0, ratio: 0, theta: { start: 0, end: 0} },
        GestureShield: { protect: home },
        Position: E('Position',home),
        Strength: o({ strength: 0 }),
        DamageOnCollision: { inCircle: true, inArc: true },
    })


    E({
        SpawnClock: {

            positions : function(){
                return [
                    {x: 100, y: 100},
                    {x: can.width - 100, y: 100},
                    {x: 100, y: can.height - 100},
                    {x: can.width - 100, y: can.height - 100},
                    {x: 100 , y: can.height /2},
                    {x: can.width-100, y: can.height /2},

                ]
            },
            clock: 100,
            spawnRate: 100,

        }
    })

    E({
        SpawnVillagers: { clock: 900, rate: 1000 }
    })


    E({
        Sound: { 
            Remove: '#hits',
            TargetReached: '#warp'
        }
    })
    updateScreen()
    $(window).resize(updateScreen)
    loop()
}