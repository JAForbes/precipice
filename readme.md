LD30
====

How to handle recording gestures?
---------------------------------

Up until now, I was recording the mouse start and end coords on the mouse component.
But now I think I should be creating a gesture on mouse start, and adding to it on mouse up.

```

//mouse down
E(mouseID,'Gesture',{start: {x:mouse.x, y: mouse.y}});

//mouse up
gesture = E('Gesture',mouseID)
gesture.end = {x: mouse.x, y: mouse.y }

```

Meanwhile somewhere else in the code, there is a system that looks at all the gestures and ignores them if they don't have an end yet.

```
E('Gesture').each(function(gesture,id){

  if(gesture.end){
    //do something
  }

})

```
But wouldn't be better if any code that wants to query gestures (and there will be a few)
doesn't have to do that check.  After all, it is not really a gesture until it gestured.
It _could_ later become a gesture.

```

//mouse down
E(mouseID,'GestureStart',{start: {x:mouse.x, y: mouse.y}});

//mouse up
gesture = E('GestureStart',mouseID)
gesture.end = {x: mouse.x, y: mouse.y }
E(mouseID,'Gesture',gesture)
delete E().GestureStart[mouseID]
```
