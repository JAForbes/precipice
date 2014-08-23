_.mixin({


  distance: function(p1,p2){
    var d = _.direction(p1,p2)
    var xSq = d.x*d.x;
    var ySq = d.y*d.y;
    return Math.sqrt(xSq + ySq)
  },

  direction: function(p1,p2){
    return {
      x:  p2.x - p1.x,
      y: p2.y - p1.y
    }
  },

  unitVector: function(v) {
    var magnitude = _.distance({x:0 ,y:0}, v);
    return {
      x: v.x/ magnitude,
      y: v.y/ magnitude
    }
  }

})