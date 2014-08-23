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
      gesture.velocity || (gesture.velocity = gesture.distance / gesture.duration);
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

	drawPosition: function(){
		E('Position').each(function(mouse){
			var con = E('Canvas').sample().con
      con.fillStyle = mouse.down && 'red' || 'blue'
			con.fillRect(mouse.x-10,mouse.y-10,20,20)

		})
	},

  drawGesture: function(){
    E('Gesture').each(function(gesture,id){
      var con = E('Canvas').sample().con
      var start = gesture.start;
      var end = gesture.end;
			con.fillRect(start.x-10,start.y-10,20,20)
      con.fillRect(end.x-10,end.y-10,20,20)
    })
  },

  gestureShoot: function () {
    E('GestureShoot').each(function(shooter,e){
      E('Gesture').each(function(gesture){
        E(e,'Shoot',{at: gesture.end, velocity: gesture.velocity})
        console.log(E('Shoot').sample())
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
        Velocity: {x: u.x * shoot.velocity , y: u.y * shoot.velocity}
      })
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
