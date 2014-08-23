Systems = {

	canvasSetup: function () {
		E('Canvas').each(function(can,e){
      var $body = $('body');
			can.el.width = $body.width()*can.width
			can.el.height = $body.width()*can.height
		});
	},

	drawMouse: function(){
		E('Mouse').each(function(mouse){
			var con = E('Canvas').sample().con
			con.fillRect(mouse.x-10,mouse.y-10,20,20)
		})
	},




}
