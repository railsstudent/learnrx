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

/* 
Exercise 36: Traversing callback-based Asynchronous APIs
*/
function(window, $) {
	var getJSON = function(url) {
		return Observable.create(function(observer) {
			var subscribed = true;

			$.getJSON(url,
				{
					success:
						function(data) {
							// If client is still interested in the results, send them.
							if (subscribed) {
								// Send data to the client
								observer.next(data);
								// Immediately complete the sequence
								observer.complete();
							}
						},
					error: function(ex) {
						// If client is still interested in the results, send them.
						if (subscribed) {
							// Inform the client that an error occurred.
							observer.error(ex);
						}
					}
				});

			// Definition of the Subscription objects unsubscribe (dispose in RxJS 4) method.
			return function() {
				subscribed = false;
			}
		});
	};

	var observer = {
		// onNext in RxJS 4
		next: function (data) {
			alert(JSON.stringify(data));
		},
		// onError in RxJS 4
		error: function (err) {
			alert(err);
		},
		// onComplete in RxJS 4
		complete: function () {
			alert("The asynchronous operation has completed.");
		}
	};

	var subscription =
		getJSON("http://api-global.netflix.com/abTestInformation").subscribe(observer);

	// setTimeout(function () {
	// 	alert("Changed my mind, I do not want notifications any more!")
	// 	subscription.unsubscribe();
	// }, 10);
}
		

/*
Exercise 37: Sequencing HTTP requests with Observable

Let's use the getJSON function that returns Observables, and the 
Observable.fromEvent() to complete the exercise we completed earlier.
*/
function(window, getJSON, showMovieLists, showError) {
	var movieListsSequence =
		Observable.zip(
			getJSON("http://api-global.netflix.com/abTestInformation").
				concatMap(function(abTestInformation) {
					return Observable.zip(
						getJSON("http://api-global.netflix.com/" + abTestInformation.urlPrefix + "/config").
							concatMap(function(config) {
								if (config.showInstantQueue) {
									return getJSON("http://api-global.netflix.com/" + abTestInformation.urlPrefix + "/queue").
										map(function(queueMessage) {
											return queueMessage.list;
										});
								}
								else {
									return Observable.returnValue(undefined);
								}
							}),
						getJSON("http://api-global.netflix.com/" + abTestInformation.urlPrefix + "/movieLists"),
						function(queue, movieListsMessage) {
							var copyOfMovieLists = Object.create(movieListsMessage.list);
							if (queue !== undefined) {
								copyOfMovieLists.push(queue);
							}

							return copyOfMovieLists;
						});
				}),
			Observable.fromEvent(window, "load"),
			function(movieLists, loadEvent) {
				return movieLists;
			});

	movieListsSequence.
		forEach(
			function(movieLists) {
				showMovieLists(movieLists);
			},
			function(err) {
				showError(err);
			});
}

/*
Exercise 38: Throttle Input

When dealing with user input, there will be times when the user's input is too noisy, and will potentially clog your servers with extraneous requests. We want the ability to throttle the users's input so that if they interacting for one second, then we will get the user input. Let's say for example, the user clicks a button once too many times upon saving and we only want to fire after they've stopped for a second.
*/
/*
seq([1,2,3,,,,,,,4,5,6,,,]).throttleTime(1000 /* ms */) /* === seq([,,,,,,,3,,,,,,,,,,6,,,]);
*/		
function (clicks, saveData, name) {
	return clicks
		// TODO: Throttle the clicks so that it only happens every one second
    .throttleTime(1000)
		.concatMap(function () {
			return saveData(name);
		});
}
	
/*  
Exercise 39: Autocomplete Box

One of the most common problems in web development is the autocomplete box. This seems like it should be an easy problem, but is actually quite challenging. For example, how do we throttle the input? How do we make sure we're not getting out of order requests coming back? For example if I type "react" then type "reactive" I want "reactive" to be my result, regardless of which actually returned first from the service.

In the example below, you will be receiving a sequence of key presses, a textbox, and a function when called returns an array of search results.

getSearchResultSet('react') === seq[,,,["reactive", "reaction","reactor"]]
keyPresses === seq['r',,,,,'e',,,,,,'a',,,,'c',,,,'t',,,,,]
*/
function (getSearchResultSet, keyPresses, textBox) {

	var getSearchResultSets =
		keyPresses.
			map(function () {
				return textBox.value;
			}).
			throttleTime(1000).
			concatMap(function (text) {
				return getSearchResultSet(text).takesUntil(keyPresses);
			});

	return getSearchResultSets;
}
    
		/*
Exercise 40: Distinct Until Changed Input

You'll notice in the previous exercise that if you pressed your arrow keys 
while inside the textbox, the query will still fire, regardless of whether 
the text actually changed or not. How do we prevent that? The distinctUntilChanged 
filters out successive repetitive values.		
*/

/* seq([1,,,1,,,3,,,3,,,5,,,1,,,]).distinctUntilChanged() ===
seq([1,,,,,,,3,,,,,,,5,,,1,,,]);
*/
function (keyPresses, isAlpha) {

	return keyPresses.
		map(function (e) { return String.fromCharCode(e.keyCode); }).  // [ { a..b...b....1...2..3....d... }]

		// Ensure we only have alphabetic characters
		filter(function (character) { return isAlpha(character); }).  // [ {a..b....b.....d... }]

		// TODO: Filter out successive repetitive keys
		distinctUntilChanged().																				// [ {a..b..........d...} ]
		// Building up a string of all the characters typed.
		scan(function (stringSoFar, character) {
			return stringSoFar + character;
		}, '');
}
		
/* Exercise 41: Autocomplete Box Part 2: Electric Boogaloo

In the previous version of the autocomplete box, there were two bugs
    Multiple successive searches are made for the same string
    Attempts are made to retrieve results for an empty string.

The example below is the same as above, but this time, fix the bugs!

getSearchResultSet('react') === seq[,,,["reactive", "reaction","reactor"]]
keyPresses === seq['r',,,,,'e',,,,,,'a',,,,'c',,,,'t',,,,,]
*/		
function (getSearchResultSet, keyPresses, textBox) {

	var getSearchResultSets =
		keyPresses.
			map(function () {
				return textBox.value;
			}).
			throttleTime(1000).

			// TODO: Make sure we only get distinct values
			distinctUntilChanged().
			// TODO: Make sure the text is not empty
			filter(function (search) {
				return search.length > 0;
			}).
			concatMap(function (text) {
				return getSearchResultSet(text).takeUntil(keyPresses);
			});

	return getSearchResultSets;
}
		
