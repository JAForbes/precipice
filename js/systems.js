Systems = {

	canvasSetup: function () {
		E('Canvas').each(function(can,e){
      var $body = $('body');
			can.el.width = $body.width()*can.width
			can.el.height = $body.width()*can.height
		});
	},

  recordGesture: function(){
    E('Mouse').each(function(mouse,id){
      var start = E('GestureStart',id)
      var gesture = E('Gesture',id)
      if(mouse.down && !start.x){
        E(id,'GestureStart',{x: mouse.x, y: mouse.y})
      } else if (!mouse.down && start.x && !gesture.x){
        E(id,'Gesture',{ start: start, end: {x: mouse.x, y: mouse.y}})
        delete E().GestureStart[id]
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
