Systems = {


	canvasSetup: function () {
		E('Canvas').each(function(can,e){
			can.el.width = can.width
			can.el.height = can.height
			can.con.translate(can.width/2,can.height/2)
			can.con.fillRect(0,0,20,20)
		});
	}

}