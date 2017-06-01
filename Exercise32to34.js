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

/*Exercise 33: Improving our mouse drag event

Our mouse drag event is a little too simple. Notice that when we drag around 
the sprite, it always positions itself at the top-left corner of the mouse. 
Ideally we'd like our drag event to offset its coordinates, based on where the 
mouse was when the mouse down event occurred. This will make our mouse drag 
more closely resemble moving a real object with our finger.

Let's see if you can adjust the coordinates in the mouse drag event, based 
on the mousedown location on the sprite. The mouse events are sequences, 
and they look something like this: 
*/

var ex33 = function(sprite, spriteContainer) {
	// All of the mouse event sequences look like this:
	// seq([ {pageX: 22, pageY: 3423, layerX: 14, layerY: 22} ,,, ])
	var spriteMouseDowns = Observable.fromEvent(sprite, "mousedown"),
		spriteContainerMouseMoves = Observable.fromEvent(spriteContainer, "mousemove"),
		spriteContainerMouseUps = Observable.fromEvent(spriteContainer, "mouseup"),
		// Create a sequence that looks like this:
		// seq([ {pageX: 22, pageY:4080 },,,{pageX: 24, pageY: 4082},,, ])
		spriteMouseDrags =
			// For every mouse down event on the sprite...
			spriteMouseDowns.
				concatMap(function(contactPoint) {
					// ...retrieve all the mouse move events on the sprite container...
					return spriteContainerMouseMoves.
            // ...until a mouse up event occurs.
						takeUntil(spriteContainerMouseUps).
            map((moveX) => {
              return {
                pageX: moveX.pageX + contactPoint.layerX,
                pageY: moveX.pageY + contactPoint.layerY 
              }
            });
						// ------------   INSERT CODE HERE  -----------------
						// Project each mouse move object into a new object
						// with adjusted pageX and pageY properties.
						// Translate each page coordinate based on the value
						// of the layerX and layerY properties in the
						// contactPoint.
						// -------------------------------------------------
						// Complete expression...
				});

	// For each mouse drag event, move the sprite to the absolute page position.
	spriteMouseDrags.forEach(function(dragPoint) {
		sprite.style.left = dragPoint.pageX + "px";
		sprite.style.top = dragPoint.pageY + "px";
	});
}

/*
Exercise 34: HTTP requests

Events aren't the only source of asynchronous data in an application. There's 
also HTTP requests. Most of the time HTTP requests are exposed via a 
callback-based API. To receive data asynchronously from a callback-based API, 
the client typically passes a success and error handler to the function. 
When the asynchronous operation completes, the appropriate handler is called 
with the data. In this exercise we'll use jQuery's getJSON api to asynchronously 
retrieve data. 
*/
function($) {
	$.getJSON(
		"http://api-global.netflix.com/queue",
		{
			success: function(json) {
				alert("Data has arrived.");
			},
			error: function(ex) {
				alert("There was an error.")
			}
		});
}

/*
Exercise 35: Sequencing HTTP requests with callbacks
*/

function(window, $, showMovieLists, showError) {
	var error,
		configDone,
		movieLists,
		queueList,
		windowLoaded,
		outputDisplayed,
		errorHandler = function() {
			// Otherwise show the error.
			error = "There was a connectivity error";

			// We may be ready to display out
			tryToDisplayOutput();
		},
		tryToDisplayOutput = function() {
			if (outputDisplayed) {
				return;
			}
			if (windowLoaded) {
				if (configDone && movieLists !== undefined) {
					if (queueList !== undefined) {
						movieLists.push(queueList);
					}
					outputDisplayed = true;
					showMovieLists(JSON.stringify(movieLists));
				}
				else if (error) {
					outputDisplayed = true;
					showError(error);
				}
			}
		},
		windowLoadHandler = function() {
			windowLoaded = true;

			// Remember to unsubscribe from events
			window.removeEventListener("load", windowLoadHandler);

			// This may be the last task we're waiting on, so try and display output.
			tryToDisplayOutput();
		};

	// Register for the load event
	window.addEventListener("load", windowLoadHandler);

	// Request the service url prefix for the users AB test
	$.getJSON(
		"http://api-global.netflix.com/abTestInformation",
		{
			success: function(abTestInformation) {
				// Request the member's config information to determine whether their instant
				// queue should be displayed.
				$.getJSON(
					"http://api-global.netflix.com/" + abTestInformation.urlPrefix + "/config",
					{
						success: function(config) {
							// Parallel retrieval of movie list could've failed,
							// in which case we don't want to issue this call.
							if (!error) {
								// If we're supposed to
								if (config.showInstantQueue) {
									$.getJSON(
										"http://api-global.netflix.com/" + abTestInformation.urlPrefix + "/queue",
										{
											success: function(queueMessage) {
												queueList = queueMessage.list;

												configDone = true;
												tryToDisplayOutput();
											},
											error: errorHandler
										});
								}
								else {
									configDone = true;
									tryToDisplayOutput();
								}
							}
						},
						error: errorHandler
					});

				// Retrieve the movie list
				$.getJSON(
					"http://api-global.netflix.com/" + abTestInformation.urlPrefix + "/movieLists",
					{
						success: function(movieListMessage) {
							movieLists = movieListMessage.list;
							tryToDisplayOutput();
						},
						error: errorHandler
					});
			},
			error: errorHandler
		});
}
				
