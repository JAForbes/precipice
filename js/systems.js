Systems = {


	canvasSetup: function () {
		E('Canvas').each(function(can,e){
			can.el.width = can.width
			can.el.height = can.height
		});
	}

}