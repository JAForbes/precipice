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
  },

  fmod:  function (a,b) {
    return Number((a - (Math.floor(a / b) * b)).toPrecision(8)); 
  },

  between: function(val,left,right,round){
    left = _.fmod(left,round)
    right = _.fmod(right,round)
    val = _.fmod(val,round)
    
    if(left > right){
      right += round; 
      val += round;
    }
    return val < right && val > left;
  },

  cycle: function(divsior){
    return ((Math.sin(now()/divsior)+1.5)/2)
  },

  next: function(i,list){
    return list[(i+1)%list.length]
  },

  agree: function(){
    var args = _(arguments).toArray()
    allKeys = _(args).chain().map(_.keys).flatten().unique().value()

    return _(allKeys).every(function(key){

      var hasKey = _.partial(_.has,_,key)
      
      return _(args).chain()
        .filter(hasKey)
        .map(_.property(key))
        .every(function(val,i,list){
          return val == _.next(i,list)

        })
      .value()
    })

  }


})