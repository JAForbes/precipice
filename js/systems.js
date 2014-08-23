Systems = {

	canvasSetup: function () {
		E('Canvas').each(function(can,e){
      var screen = E('Screen',e);

			can.el.width = screen.width*can.width
			can.el.height = screen.width*can.height
		});
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

  gestureDistance: function(){
    E('Gesture').each(function(gesture,id){
      if(gesture){
        gesture.distance = _.distance(gesture.start,gesture.end);
      }
    });
  },

	drawMouse: function(){
		E('Mouse').each(function(mouse){
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

  cleanUp: function(){

  }


}
