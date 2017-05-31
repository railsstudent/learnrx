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
      })
	};
      
      
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

/*
Exercise 31: Completing sequences with takeUntil()

Have you ever wanted to unsubscribe from one Event when another Event fires? 
Observable's takeUntil() function is a convenient way of completing a sequence
 when another Event occurs. Here's how takeUntil() works: 
*/
var ex31 = function(pricesNASDAQ, printRecord, stopButton) {
	var stopButtonClicks = Observable.fromEvent(stopButton, 'click'), // ----- To finish this expression, use Observable.fromEvent to convert the "click" event on the stop button to an Observable
		microsoftPrices =
			pricesNASDAQ.
				filter(function(priceRecord) {
					return priceRecord.name === "MSFT";
				}).takeUntil(stopButtonClicks);
				// ----- To finish this expression, use takeUntil to complete the sequence when stopButtonClicks fires.

	microsoftPrices.
		forEach(function(priceRecord) {
			printRecord(priceRecord);
		});
}

/* Here's what we learned in this section:

    We can traverse Observables using forEach().
    We can use fromEvent() to convert Events into Observables that never complete.
    We can apply take() and takeUntil() to an Observable to create a new sequence which does complete.
*/
		
		
