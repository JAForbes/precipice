Systems = {

	canvasSetup: function () {
		E('Canvas').each(function(can,e){
      var screen = E('Screen',e);

			can.el.width = screen.width*can.width
			can.el.height = screen.height*can.height
		});
	},

  lockPosition: function(){
    E('LockPosition').each(function(lockPosition,e){
      var screen = E('Screen').sample()
      var positions = {
        center: { x: screen.width /2 , y: screen.height /2 }
      }

      var place = positions[lockPosition.position];
      if(place){
        var position = E('Position',e);
        position.x = place.x;
        position.y = place.y;
      }
    })
  },

  recordGesture: function(){
    E('Mouse').each(function(mouse,id){
      var start = E('GestureStart',id)
      var gesture = E('Gesture',id)
      if(mouse.down && !start.x){
        E(id,'GestureStart',{x: mouse.x, y: mouse.y, time: now() })
      } else if (!mouse.down && start.x && !gesture.x){
        E(id,'Gesture',{ start: start, end: {x: mouse.x, y: mouse.y, time: now() }})
        delete E().GestureStart[id]
      }
    });
  },

  gestureDirection: function(){
    E('Gesture').each(function(gesture,id){
      gesture.direction = _.direction(gesture.start,gesture.end);
    })
  },

  gestureDistance: function(){
    E('Gesture').each(function(gesture,id){

        gesture.distance || (gesture.distance = _.distance(gesture.start,gesture.end));
    });
  },

  gestureDuration: function(){
    E('Gesture').each(function(gesture,id){
      gesture.duration || (gesture.duration = gesture.end.time - gesture.start.time);
    })
  },

  gestureVelocity: function(){
    E('Gesture').each(function(gesture,id){
      gesture.velocity || (gesture.velocity = gesture.distance / (gesture.duration/10));
    })
  },

  gestureTowardCenter: function(){
    E('Gesture').each(function(gesture,id){
      if(!gesture.towardCenter){
        var center = {x: can.width/2, y: can.height/2}
        var d = gesture.direction;
        var initalDistance = _.distance(center,gesture.start);
        var finalDistance = _.distance(center,gesture.end);
        gesture.towardCenter = finalDistance < initalDistance;
      }
    })
  },

	drawCircle: function(){
		E('Circle').each(function(circle,e){
      var position = E('Position',e)
			var con = E('Canvas').sample().con
      con.beginPath()
      con.arc(position.x, position.y, circle.radius, 0, 2*Math.PI, false)
			con.stroke();

		})
	},

  drawPath: function(){
    E('Path').each(function(path,e){
      var pos = E('Position',e);
      var canvas = E('Canvas').sample();
      var con = canvas.con;
      con.beginPath()
      con.strokeStyle = 'black';
      con.moveTo(path[0].x+pos.x,path[0].y+pos.y);
      _(path.slice(1)).each(function(point){
        con.lineTo(point.x+pos.x, point.y+pos.y)
      })
      con.stroke();
    })
  },

  spikeyCharge: function(){
    E('SpikeyCharge').each(function(spikeyCharge,e){
      var charge = E('Charge',e);
      var spikeyCircle = {radius: charge.charge, spikes: Math.floor(charge.charge), randomAngle: 0.25 / charge.charge, randomRadius:charge.charge/10}
      
      E(e,'SpikeyCircle',spikeyCircle)

    })
  },

  spikeyCirclePath: function(){
      E('SpikeyCircle').map(function(spikey,e){
        var pos = E('Position',e);
        var fullCircle = Math.PI * 2;
        var division = fullCircle / (spikey.spikes * 2);
        var path = [];
        _(spikey.spikes * 2).times(function(i){
          var angle = i * division;
          var r = spikey.radius;
          var randomAngle = (2*Math.random()-1) * spikey.randomAngle;
          var randomRadius = (2*Math.random()-1) * spikey.randomRadius;
          if(i % 2 == 0){
            r = spikey.radius / 3;
          }
          path.push({x: Math.cos(randomAngle +angle) * (r-randomRadius),y:  Math.sin(randomAngle +angle) * (r-randomRadius) })
        })
        path.push(path[0])
        E(e,'Path',path)
      })
  },

  gestureShoot: function () {
    E('GestureShoot').each(function(shooter,e){
      E('Gesture').each(function(gesture){
        if(!gesture.towardCenter && gesture.velocity > 1){
          E(e,'Shoot',{at: gesture.end, velocity: gesture.velocity})
        }
      })
    })
  },

  shoot: function() {
    E('Shoot').each(function(shoot,e){
      var at = shoot.at;
      var position = E('Position',e);
      var center = {x: can.width/2, y: can.height/2};
      var direction = _.direction(position,at);
      var u = _.unitVector(direction);
      var projectile = E({
        Position: _(position).clone(),
        Velocity: {x: u.x * shoot.velocity , y: u.y * shoot.velocity},
        Circle: {radius: 50/shoot.velocity}
      })
    })
  },

  useShootCharge: function(){
    E('Shoot').each(function(shoot,e){
      var charge = E('Charge',e);
      charge.charge -= 50/shoot.velocity;
    })
  },

  move: function(){
    E('Velocity').each(function(velocity,id) {
      var position = E('Position',id);
      position.x += velocity.x;
      position.y += velocity.y;
    })
  },

  cleanUp: function(){
    delete E().Shoot
    delete E().Gesture
  }


}
