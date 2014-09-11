function preload(images,sounds,done,progress) {
  
  var resourceCount = images.length + _(sounds).flatten().length

  var done = _.after(resourceCount-1,_.once(done)); 
  var n = 1;
  var onload = function(){
    n++;
    progress(n,resourceCount)

    done()

  }

  function loadImage(attributes){
    var $img = $('<img>')
    $img[0].onload = onload
    $img
      .attr(attributes)
      .appendTo($('body'))
  }

  function loadSound(src) {
    var $audio = $('<audio>')

    $audio[0].muted = true;
    $audio[0].onplay = _(function(){
      $audio[0].pause()
      $audio[0].muted = false;

      onload()
    }).once()
    $audio.attr({src:src,autoplay:true})
    return $audio;
  }

  _(images).each(loadImage);
  _(sounds).each(function(sources,group){
    $('<div id='+group+'>')
    .append(_(sources).map(loadSound))
    .appendTo($('body'))
  });
 
}