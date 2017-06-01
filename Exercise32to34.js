/*Exercise 32: Creating a mouse drag event

"For mouse down event on the sprite, retrieve mouse move events that occur before the next mouse up event."
*/

var ex32 = function(sprite, spriteContainer) {
	var spriteMouseDowns = Observable.fromEvent(sprite, "mousedown"),
		spriteContainerMouseMoves = Observable.fromEvent(spriteContainer, "mousemove"),
		spriteContainerMouseUps = Observable.fromEvent(spriteContainer, "mouseup"),
		spriteMouseDrags =
			// For every mouse down event on the sprite...
			{ 
        forEach : function() { 
          return spriteMouseDowns
                  .forEach((mouseDown) => {
                    return spriteContainerMouseMoves
                          .takeUntil(spriteContainerMouseUps);
      				});
        }
      };
				// --------------------------------------------------------
				//					  INSERT CODE HERE
				// --------------------------------------------------------
				// Complete this expression...
				// For every mouse down event, return the mouse move event
				// sequence until a mouse up event occurs.

	// For each mouse drag event, move the sprite to the absolute page position.
	spriteMouseDrags.forEach(function(dragPoint) {
		sprite.style.left = dragPoint.pageX + "px";
		sprite.style.top = dragPoint.pageY + "px";
	});
}
