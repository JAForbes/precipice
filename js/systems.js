Systems = {


	canvasSetup: function () {
		E('Canvas').each(function(can,e){
			can.el.width = can.width
			can.el.height = can.height
		});
	},

	drawMouse: function(){
		E('Mouse').each(function(mouse){
			var con = E('Canvas').sample().con
			con.fillRect(mouse.x-10,mouse.y-10,20,20)
		})
	},



}