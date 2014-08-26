Systems = {

	canvasSetup: function () {
		E('Canvas').each(function(can,e){
      var screen = E('Screen',e);

			can.el.width = screen.width*can.width
			can.el.height = screen.height*can.height

		});
	},

  lockPosition: function(){
    E('LockPosition').each(function(lockPosition,e){
      var screen = E('Screen').sample()
      var positions = {
        center: { x: screen.width /2 , y: screen.height /2 }
      }

      var place = positions[lockPosition.position];
      if(place){
        var position = E('Position',e);
        position.x = place.x;
        position.y = place.y;
      }
    })
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

  gestureDirection: function(){
    E('Gesture').each(function(gesture,id){
      gesture.direction = _.direction(gesture.start,gesture.end);
    })
  },

  gestureDistance: function(){
    E('Gesture').each(function(gesture,id){

        gesture.distance || (gesture.distance = _.distance(gesture.start,gesture.end));
    });
  },

  gestureDuration: function(){
    E('Gesture').each(function(gesture,id){
      gesture.duration || (gesture.duration = gesture.end.time - gesture.start.time);
    })
  },

  gestureVelocity: function(){
    E('Gesture').each(function(gesture,id){
      gesture.velocity || (gesture.velocity = gesture.distance / (gesture.duration/10));
    })
  },

  gestureTowardCenter: function(){
    E('Gesture').each(function(gesture,id){
      if(!gesture.towardCenter){
        var center = {x: can.width/2, y: can.height/2}
        var d = gesture.direction;
        var initalDistance = _.distance(center,gesture.start);
        var finalDistance = _.distance(center,gesture.end);
        gesture.towardCenter = finalDistance < initalDistance;
      }
    })
  },

	drawArc: function(){
		E('RenderArc').each(function(render,e){
      var arc = E('Arc',e)
      var position = E('Position',e)
			var con = E('Canvas').sample().con
      con.beginPath()
      con.arc(position.x, position.y, arc.radius, arc.theta.start, arc.theta.end, false)
			con.stroke();

		})
	},

  scaleFrame: function(){
    E('FrameScale').each(function(frameScale,e){
      var frame = E('Frame',e);
      var value = E(frameScale.component,e)[frameScale.key]
      var before = value();
      frame.scale = value() * (frameScale.multiplier || 1);
    })
  },

  chooseFrames: function(){
    E('State').each(function(state,entity){
      var frame = E('Frame',entity)
      var src = frame.frame.image.src;
      src = src.replace(/_([a-z])*/,'_'+state.action);
      
      if(frame.frame.image.src != src){
        var img = getImageBySrc(src);
        
        if(img){
          var repeat = img.getAttribute('repeat') == 'true';
          var playspeed = (img.getAttribute('playspeed')||1)*1;
          frame.frame.reset(img);
          frame.repeat = repeat;
          frame.playspeed = playspeed
        }
        
      }


    });

    function getImageBySrc(src){
      var img;
      $('img').each(function(){
        var newSrc = $(this).attr('src');
        var match = src.indexOf(newSrc) > -1;
        if(match){
          img = $(this)[0]
        }
      })
      return img;
    }
  },

  drawFrames: function(){
    E('Frame').each(function(component,entity){
      var position = E('Position',entity);
      var con = E('Canvas').sample().con;
      if(position){
        con.save();
          con.translate(position.x,position.y);
          component.frame.playspeed(component.playspeed);
          component.frame.scale(component.scale);
          component.frame.repeat = typeof component.repeat == 'undefined' || component.repeat;
          component.frame.next();

        con.restore();
      }
    });
  },

  drawPath: function(){
    E('Path').each(function(path,e){
      var pos = E('Position',e);
      var canvas = E('Canvas').sample();
      var con = canvas.con;
      con.beginPath()
      //con.strokeStyle = 'black';

      con.moveTo(path[0].x+pos.x,path[0].y+pos.y);
      _(path.slice(1)).each(function(point){
        con.lineTo(point.x+pos.x, point.y+pos.y)
      })
      con.stroke();
    })
  },

  gestureShoot: function () {
    E('GestureShoot').each(function(shooter,e){
      E('Gesture').each(function(gesture){
        if(!gesture.towardCenter && gesture.velocity > 1){
          E(e,'Shoot',{at: gesture.end, velocity: 1/gesture.distance*2000})
        }
      })
    })
  },

  

  depleteShield: function(){
    E('Shield').each(function(shield,e){
      var strength = E('Strength',e)
      if(strength.strength() <= 0){
        var arc = E('Arc',e);
        _(arc).extend({ radius: 0, ratio: 0, theta: { start: 0, end: 0} })
      }
    });
  },

  arcCollision: function(){

          
    E('Arc').each(function(arc1,e){
      E('Arc').each(function(arc2,e2){
        if(e != e2){
          check(arc1,arc2,e,e2)


        }
      })  
    })
    function check(arc1,acr2,e1,e2){

      var pos1 = E('Position',e1);
      var pos2 = E('Position',e2);
      if(pos1 != pos2 ){//reference check - not value check
        //step 1: check if within radius
        var d = _.distance(pos1,pos2);
        var r1 = arc1.radius;
        var r2 = acr2.radius;
        var isWithinCircle = d < r1+r2;
        //step 2: check if center within start and end theta
        var offsetPos = _.direction(pos1,pos2);
        var angleFrom = Math.atan2(offsetPos.y,offsetPos.x);
        var isWithinArc = _.between(angleFrom,arc1.theta.start,arc1.theta.end,Math.PI*2)
        if(isWithinArc || isWithinCircle){
          var ac = E('ArcCollision',e1);
          var collisionData = {against:e2, inArc: isWithinArc, inCircle: isWithinCircle}
          if(_(ac).isEmpty()){
            E(e1,'ArcCollision',{ collisions: [collisionData] })  
          } else {
            ac.collisions.push(collisionData)
          }
          
        }
        
      }
      
    }

  },

  sounds: function(){
    E('Sound').each(function(queries){
      _(queries).each(function(domQuery,eQuery){
        E(eQuery).each(function(val){
          

          var s = _($(domQuery+' audio')).sample()
          if(s.paused || s.currentTime>1){
            s.currentTime = 0
            s.play()  
          }
          
        })
      })
    })
  },

  arcStrength: function(){
    E('ArcStrength').each(function(arc,e){
      var arc = E('Arc',e);
      arc.radius = E('Strength',e).strength();
    })
  },

  damageOnArcCollision: function(){

    E('ArcCollision').each(function(collision,e){

      _(collision.collisions).each(function(collision){

      
        var die = E('DamageOnCollision',e)
        var otherDie = E('DamageOnCollision',collision.against)

        var otherCollision = _(E('ArcCollision',collision.against).collisions).findWhere({against:e})
        if(!_(die).isEmpty()){
          
          var criteriaMet = !(typeof die.inArc != 'undefined' && die.inArc != collision.inArc ||
            typeof die.inCircle != 'undefined' && die.inCircle != collision.inCircle);

          if(criteriaMet && _.agree(die,collision) && _.agree(otherDie,otherCollision)){
            
            var arc = E('Arc',e);
            var health = E('Strength',e);
            var strength = E('Strength',collision.against)
            
            health.strength( health.strength() - strength.strength() ) 

            if(health.strength() < 0){
              E(e,'Remove',{})
            }
          }
        }

      })
    })
  },

  shoot: function() {
    E('Shoot').each(function(shoot,e){
      var at = shoot.at;
      var position = E('Position',e);
      var center = {x: can.width/2, y: can.height/2};
      var direction = _.direction(position,at);
      var u = _.unitVector(direction);
      var arc = E('Arc',e);
      var strength = E('Strength',e)()
      var clampArc = Math.min(50/shoot.velocity) * 5;
      var projectile = E({
        Position: {x: position.x + (u.x*(arc.radius+clampArc) * 2), y: position.y + (u.y *(arc.radius+clampArc) * 2)},
        Velocity: {x: u.x * shoot.velocity , y: u.y * shoot.velocity},
        Arc: {radius: clampArc*2, ratio: 1, theta: { start: 0, end: Math.PI * 2} }, //todo, just define the center and let other systems figure out start,end,
        //RenderArc: {},
        FrameScale: { component: 'Strength', key: 'strength', multiplier: 0.5 },
        Strength: o({ strength: clampArc/5}),
        DamageOnCollision: { inCircle: true },
        Frame: {scale:clampArc/15, playspeed: 1/3, frame: new Frame().reset(energy_ball) },
      })
    })
  },

  weaponClock: function(){
    E('Weapon').each(function(weapon,e){

      weapon.clock++;
      if(weapon.clock == weapon.fireRate){
        weapon.clock = 0;

        E(e,'Shoot',{ at: E('Position',home), velocity: _.random(5,10), })
      }
    })
  },

  mouseState: function(){
    E('MouseState').each(function(mouseState,e){
      var mouse = E('Mouse').sample();
      var state = E('State',e)
      if(mouse.down && mouseState.down){
        state.action = mouseState.down
      } else if (mouse.up && mouseState.up){
        state.action = mouseState.up;
      }
    })
  },

  gestureShield: function() {
    E('GestureShield').each(function(gestureShield,e){
      E('Gesture').each(function(gesture){

        if(gesture.towardCenter){
          var center = {x: can.width/2, y: can.height/2};

          var y = gesture.start.y - center.y;
          var x = gesture.start.x - center.x;
          var angle = Math.atan2(y,x)
          var coverageRatio = Math.min(gesture.duration,2000)/2000;
          coverageRatio = coverageRatio > 0.49 && 0.49 || coverageRatio;
          var strength = Math.max(gesture.duration/1000,1000)/25;
          var halfCircle = Math.PI;
          var coverage = coverageRatio * halfCircle;
          var protecteeArc = E('Arc',gestureShield.protect)
          var arc = E('Arc',e);

          _(arc).extend({
            ratio: coverage,
            theta: {start: _.fmod(angle - coverage,2*Math.PI), end: _.fmod(angle + coverage,2*Math.PI)}, //TODO don't need FMOD anymore?
            radius: protecteeArc.radius *1.2
          })

          E('Strength',e).strength(strength);
          E(e,'Shield',{ protect: gestureShield.protect })
        }
      })
    })
  },

  drawShield: function(){
    E('Shield').each(function(shield,e){
      var con = E('Canvas').sample().con;
      var strength = E('Strength',e)();
      con.beginPath()
      var position = E('Position',e);
      con.lineWidth = strength.strength/4  + (strength.strength/8* _.cycle(200))
      var arc = E('Arc',e);
      con.arc(position.x, position.y, arc.radius + con.lineWidth , arc.theta.start,arc.theta.end, false)
      
      con.shadowColor = con.strokeStyle = 'rgba(171,254,255,'+_.cycle(10000/ strength.strength)+')';
      con.shadowBlur = 30;
      con.shadowOffsetX = 0;
      con.shadowOffsetY = 0;

      con.stroke();
    });
  },

  spawnInterval: function(){
    E('SpawnClock').each(function(spawn,e){
      spawn.clock++;
      if(spawn.clock > spawn.spawnRate){
        spawn.clock = 0;

        var available = _(spawn.positions()).difference(E().Position)
        
        var chosen = _(available).sample();

        E({
          Position: chosen,
          Velocity: {x:0, y: 0},
          Arc: {radius : 20, ratio: 1, theta : { start: 0 , end : 2 * Math.PI }},
          DamageOnCollision: { inCircle: true, inArc: false },
          Strength: o({ strength: 1 }),
          Weapon: { fireRate: 100, target: home, clock: 50 },
          Frame: {scale:2 , playspeed: 1/5, frame: new Frame().reset(warlock) },
        })
      }
    })
  },

  spawnVillagers: function(){
    
    E('SpawnVillagers').each(function(spawn,e){

      spawn.clock++;

      if(spawn.clock > spawn.rate){
        spawn.clock = 0;
        spawnThem()
      }
    });

    function spawnThem(){
      var position = {x: can.width/2, y: can.height}
      var direction = _.direction(position,{x:can.width/2, y:can.height/2});
      var u = _.unitVector(direction);

      E({
          Position: position,
          Frame: {scale:1.5 , playspeed: 1/5, frame: new Frame().reset(villagers) },
          Velocity: {x: u.x*1, y:u.y*1},
          Arc: { radius: 5, ratio: 1, theta: {start: 0, end: 2*Math.PI }},
          RenderArc: {},
          Strength: o({ strength: 0 }),
          Target: { x: can.width/2, y: can.height/2 },
          TargetScore: { category: "Villager's saved"}

      })
    }
  },

  arcStrength: function(){
    E('ArcStrength').each(function(arcStrength,e){
      var strength = E('Strength',e)
      var arc = E('Arc',e)

      arc.radius = strength.strength()
    })
  },

  strengthLose: function(){
    E('StrengthLose').each(function(lose,e){
      var strength = E('Strength',e)();
      if(strength.strength < lose.min){
        E(e,'GameOver',gameID);
        E('Paused',gameID).paused = true;

        console.log(E('Score', gameID))
      }
    })
  },

  targetReached: function(){

    E('Target').each(function(target,e){

      var position = E('Position',e);
      var velocity = E('Velocity',e);
      var d =_.distance(target,position);
      
      if( d  <  Math.abs(velocity.x + velocity.y) ){
        E(e,'TargetReached',{})
      }

    })
  },

  targetScore: function () {
    E('TargetReached').each( function(reached,e) {
      var category = E('TargetScore',e).category;
      var score = E('Score',gameID)
      score[category] = score[category] || 0;
      score[category]++;
      var $el= $('.villager_count p');
      $el.text($el.text().replace(/\d+/,score[category]))
      E(e,'Remove',{})
    })
  },


  useShieldStrength: function(){
    E('Gesture').each(function(gesture,e){
      if(gesture.towardCenter ){
        E('Shield').each(function(shield,e){
          var strength = E('Strength',shield.protect);
          strength.strength(strength.strength() -  gesture.duration/200);
        })
      }
    })
  },

  move: function(){
    E('Velocity').each(function(velocity,id) {
      var position = E('Position',id);
      position.x += velocity.x;
      position.y += velocity.y;
    })
  },

  removeOffscreen: function(){
    var can = E('Canvas').sample().el;
    var buffer = 1000;
    E('Position').each(function(position,e){
      if(position.x > can.width + buffer|| position.x < -buffer && position.y > can.height + buffer|| position.y < -buffer){
        E(e,'Remove',{})
      }
    })
  },

  remove: function(){
    E('Remove').each(function(remove,e){
      E.remove(e)
    })
  },

  cleanUp: function(){
    delete E().Shoot
    delete E().Gesture
    delete E().ArcCollision
    delete E().TargetReached    
  }


}
