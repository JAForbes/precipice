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
      if(mouse.down && !mouse.start){
        mouse.start = {x: mouse.x, y: mouse.y}
      } else if (mouse.up && mouse.start && !mouse.end){
        E('Gesture',{ start: mouse.start, end: {x: mouse.x, y: mouse.y})
        delete mouse.start
        delete mouse.end
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

  cleanUp: function(){

  }


}
