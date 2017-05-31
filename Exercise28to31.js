/*
Querying Arrays only gives us a snapshot. By contrast, querying Observables allows 
us to create data sets that react and update as the system changes over time. 
This enables a very powerful type of programming known as reactive programming.
*/

/*
Exercise 28: Subscribing to an event

You're probably used to thinking about events as a list of handlers stored in 
an object. In this example, we subscribe to a button click event and then 
unsubscribe the first time the button is clicked.
*/
var ex28 = function(button) {
	// the button click handler
	var handler = function(ev) {
		// Unsubscribe from the button event.
		button.removeEventListener("click", handler);

		alert("Button was clicked. Unsubscribing from event.");
	};

	// add the button click handler
	button.addEventListener("click", handler);
}
		
/* 
Exercise 29: Traversing an Event

Subscribing to an Event and traversing an Array are fundamentally the same 
operation. The only difference is that Array traversal is synchronous and 
completes, and Event traversal is asynchronous and never completes. If we 
convert a button click Event to an Observable object, we can use forEach() 
to traverse the Event.
*/
var ex29 = function(button) {
	var buttonClicks = Observable.fromEvent(button, "click");

	// In the case of an Observable, forEach returns a subscription object.
	var subscription =
		buttonClicks.
			forEach(function(clickEvent) {
				alert("Button was clicked. Stopping Traversal.");

				// Stop traversing the button clicks
				subscription.dispose();
      }
			});
      
      
var ex30 = function(button) {
	var buttonClicks = Observable.fromEvent(button, "click");

	// Use take() to listen for only one button click
	// and unsubscribe.
	buttonClicks.
    take(1).
		// Insert take() call here
		forEach(function(clickEvent) {
      
			alert("Button was clicked once. Stopping Traversal.");
		});
}
		
		
		
