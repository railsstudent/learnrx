Array.prototype.filter = function(predicateFunction) {
	var results = [];
	this.forEach(function(itemInArray) {
		// ------------ INSERT CODE HERE! ----------------------------
		// Apply the predicateFunction to each item in the array.
		// If the result is truthy, add the item to the results array.
		// Note: remember you can add items to the array using the array's
		// push() method.
		// ------------ INSERT CODE HERE! ----------------------------
	  if (predicateFunction(itemInArray)) {
      results.push(itemInArray);
    }
  });

	return results;
};

Array.prototype.map = function(projectionFunction) {
	var results = [];
	this.forEach(function(itemInArray) {

		// ------------ INSERT CODE HERE! ----------------------------
		// Apply the projectionFunction to each item in the array and add
		// each result to the results array.
		// Note: you can add items to an array with the push() method.
		// ------------ INSERT CODE HERE! ----------------------------
		results.push(projectionFunction(itemInArray));
	});
	return results;
};

Array.prototype.concatAll = function() {
	var results = [];
	this.forEach(function(subArray) {
		// ------------ INSERT CODE HERE! ----------------------------
		// Add all the items in each subArray to the results array.
		// ------------ INSERT CODE HERE! ----------------------------
    if (Array.isArray(subArray)) {
	    results = results.concat(subArray);
    } else {
      //throw "element is not an array";
    }
  });
	return results;
};

Array.prototype.concatMap = function(projectionFunctionThatReturnsArray) {
	return this.
		map(function(item) {
			// ------------   INSERT CODE HERE!  ----------------------------
			// Apply the projection function to each item. The projection
			// function will return a new child array. This will create a
			// two-dimensional array.
			// ------------   INSERT CODE HERE!  ----------------------------
      return projectionFunctionThatReturnsArray(item);
		}).
		// apply the concatAll function to flatten the two-dimensional array
		concatAll();
};

Array.prototype.reduce = function(combiner, initialValue) {
	var counter,
		accumulatedValue;

	// If the array is empty, do nothing
	if (this.length === 0) {
		return this;
	}
	else {
		// If the user didn't pass an initial value, use the first item.
		if (arguments.length === 1) {
			counter = 1;
			accumulatedValue = this[0];
		}
		else if (arguments.length >= 2) {
			counter = 0;
			accumulatedValue = initialValue;
		}
		else {
			throw "Invalid arguments.";
		}

		// Loop through the array, feeding the current value and the result of
		// the previous computation back into the combiner function until
		// we've exhausted the entire array and are left with only one value.
		while(counter < this.length) {
			accumulatedValue = combiner(accumulatedValue, this[counter])
			counter++;
		}

		return [accumulatedValue];
	}
};

/**Exercise 22: Implement zip

Let's add a static zip() function to the Array type. The zip function accepts a 
combiner function, traverses each array at the same time, and calls the combiner 
function on the current item on the left-hand-side and right-hand-side. The 
zip function requires an item from each array in order to call the combiner 
function, therefore the array returned by zip will only be as large as the 
smallest input array. 
*/

Array.zip = function(left, right, combinerFunction) {
	var counter,
		results = [];

	for(counter = 0; counter < Math.min(left.length, right.length); counter++) {
		// Add code here to apply the combinerFunction to the left and right-hand items in the respective arrays
		results.push(combinerFunction(left[counter], right[counter]));
	}
	return results;
};

console.log(JSON.stringify(Array.zip([1,2,3],[4,5,6], function(left, right) { return left + right })) === '[5,7,9]');
		
/*
Exercise 25: Converting from Arrays to Trees

When information is organized in a tree like a JSON expression, relationships 
point from parent to child. In relational systems like databases, relationships 
point from children to their parents. Both ways of organizing information are 
equivalent, and depending on the circumstances, we might get data organized in 
one way or another. It may surprise you to learn that you can use the 5 query 
functions you already know to easily convert between these representations. In 
other words, not only can you query arrays from trees, you can query trees from arrays.

We have 2 arrays each containing lists, and videos respectively. Each video has a 
listId field indicating its parent list. We want to build an array of list objects, 
each with a name and a videos array. The videos array will contain the video's id and 
title. In other words we want to build the following structure:
*/

var ex25 = function() {
	var lists = [
			{
				"id": 5434364,
				"name": "New Releases"
			},
			{
				"id": 65456475,
				"name": "Thrillers"
			}
		],
		videos = [
			{
				"listId": 5434364,
				"id": 65432445,
				"title": "The Chamber"
			},
			{
				"listId": 5434364,
				"id": 675465,
				"title": "Fracture"
			},
			{
				"listId": 65456475,
				"id": 70111470,
				"title": "Die Hard"
			},
			{
				"listId": 65456475,
				"id": 654356453,
				"title": "Bad Boys"
			}
		];

	return lists.map(function(list) {
		 return {
			 name: list.name,
			 videos: videos.filter(function(video) {
									 	return video.listId === list.id;
								 })
								 .map(function(video) { 
									 	return { id: video.id, 
														 title: video.title 
													 }; 
								 })
		 }
	});
}

/*
[
	{
		"name": "New Releases",
		"videos": [
			{
				"id": 65432445,
				"title": "The Chamber"
			},
			{
				"id": 675465,
				"title": "Fracture"
			}
		]
	},
	{
		"name": "Thrillers",
		"videos": [
			{
				"id": 70111470,
				"title": "Die Hard"
			},
			{
				"id": 654356453,
				"title": "Bad Boys"
			}
		]
	}
]
*/
		
console.log(JSON.stringify(ex25()));

/*
Exercise 26: Converting from Arrays to Deeper Trees

Let's try creating a deeper tree structure. This time we have 4 separate arrays 
each containing lists, videos, boxarts, and bookmarks respectively. Each object 
has a parent id, indicating its parent. We want to build an array of list 
objects, each with a name and a videos array. The videos array will contain 
the video's id, title, bookmark time, and smallest boxart url. In other words 
we want to build the following structure:
*/

var ex26 = function() {
	var lists = [
			{
				"id": 5434364,
				"name": "New Releases"
			},
			{
				"id": 65456475,
				name: "Thrillers"
			}
		],
		videos = [
			{
				"listId": 5434364,
				"id": 65432445,
				"title": "The Chamber"
			},
			{
				"listId": 5434364,
				"id": 675465,
				"title": "Fracture"
			},
			{
				"listId": 65456475,
				"id": 70111470,
				"title": "Die Hard"
			},
			{
				"listId": 65456475,
				"id": 654356453,
				"title": "Bad Boys"
			}
		],
		boxarts = [
			{ videoId: 65432445, width: 130, height:200, url:"http://cdn-0.nflximg.com/images/2891/TheChamber130.jpg" },
			{ videoId: 65432445, width: 200, height:200, url:"http://cdn-0.nflximg.com/images/2891/TheChamber200.jpg" },
			{ videoId: 675465, width: 200, height:200, url:"http://cdn-0.nflximg.com/images/2891/Fracture200.jpg" },
			{ videoId: 675465, width: 120, height:200, url:"http://cdn-0.nflximg.com/images/2891/Fracture120.jpg" },
			{ videoId: 675465, width: 300, height:200, url:"http://cdn-0.nflximg.com/images/2891/Fracture300.jpg" },
			{ videoId: 70111470, width: 150, height:200, url:"http://cdn-0.nflximg.com/images/2891/DieHard150.jpg" },
			{ videoId: 70111470, width: 200, height:200, url:"http://cdn-0.nflximg.com/images/2891/DieHard200.jpg" },
			{ videoId: 654356453, width: 200, height:200, url:"http://cdn-0.nflximg.com/images/2891/BadBoys200.jpg" },
			{ videoId: 654356453, width: 140, height:200, url:"http://cdn-0.nflximg.com/images/2891/BadBoys140.jpg" }
		],
		bookmarks = [
			{ videoId: 65432445, time: 32432 },
			{ videoId: 675465, time: 3534543 },
			{ videoId: 70111470, time: 645243 },
			{ videoId: 654356453, time: 984934 }
		];
		
		// [ { listId, videos }, { listId, videos }]
		return lists.map(function(list) {			
				return {
					name: list.name,
					// [ {id, title, time, url }]
					videos: videos
										.filter(function(video) { return video.listId === list.id; })
										.concatMap(function(video) {
													// [ one url ]
													var smallestBoxart = boxarts
														.filter(function(boxarts) { return video.id === boxarts.videoId; })
														.reduce(function(acc, boxart) {
																return (acc.width * acc.height) <= (boxart.width * boxart.height) ? acc : boxart;
														});
			
													// [ one bookmark time ]								
													var bookmark = bookmarks
														.filter(function(bookmark) { return video.id === bookmark.videoId; });
				
													// { id: id, title: title, time: time, url: url}
													return Array.zip(bookmark, smallestBoxart, function(bookmark, boxart) {
															return { id: video.id, title: video.title, time: bookmark.time, boxart: boxart.url };
													});
									 })
				};			
		});
}
console.log(JSON.stringify(ex26()));		

/*
[
	{
		"name": "New Releases",
		"videos": [
			{
				"id": 65432445,
				"title": "The Chamber",
				"time": 32432,
				"boxart": "http://cdn-0.nflximg.com/images/2891/TheChamber130.jpg"
			},
			{
				"id": 675465,
				"title": "Fracture",
				"time": 3534543,
				"boxart": "http://cdn-0.nflximg.com/images/2891/Fracture120.jpg"
			}
		]
	},
	{
		"name": "Thrillers",
		"videos": [
			{
				"id": 70111470,
				"title": "Die Hard",
				"time": 645243,
				"boxart": "http://cdn-0.nflximg.com/images/2891/DieHard150.jpg"
			},
			{
				"id": 654356453,
				"title": "Bad Boys",
				"time": 984934,
				"boxart": "http://cdn-0.nflximg.com/images/2891/BadBoys140.jpg"
			}
		]
	}
]*/


/* Exercise 27: Stock Ticker

Let's try an easier question. Let's say we have a collection of all of the 
prices for NASDAQ stocks over time. Every time the price of a stock changes on 
the NASDAQ ticker an entry is added to this collection. Let's say that ten days ag
o you bought shares in Microsoft, and now you want to print all of the MSFT 
share prices since then. Filter the collection for MSFT trades starting from te
n days ago and print each price record (including the time stamp) using the 
print() function. Note: this is not a trick question. It's as easy as it seems.
*/

var ex27 = function(pricesNASDAQ, printRecord) {
	var microsoftPrices,
		now = new Date(),
		tenDaysAgo = new Date( now.getFullYear(), now.getMonth(), now.getDate() - 10);

	// use filter() to filter the trades for MSFT prices recorded any time after 10 days ago
	microsoftPrices =
		pricesNASDAQ.
			filter(function(priceRecord) {	 // finish this expression
				return priceRecord.name === 'MSFT' && 
							priceRecord.timeStamp.getTime() >= tenDaysAgo.getTime();
			});
			
	// Print the trades to the output console
	microsoftPrices.
		forEach(function(priceRecord) {
			printRecord(priceRecord);
		});
} 

// The pricesNASDAQ collection looks something like this...
var pricesNASDAQ = [
	// ... from the NASDAQ's opening day
	{name: "ANGI", price: 31.22, timeStamp: new Date(2017,05,15) },
	{name: "MSFT", price: 32.32, timeStamp: new Date(2017,05,25) },
	{name: "GOOG", price: 150.43, timeStamp: new Date(2017,05,25)},
	{name: "ANGI", price: 28.44, timeStamp: new Date(2017,05,26)},
	{name: "GOOG", price: 199.33, timeStamp: new Date(2017,05,27)},
	{name: "MSFT", price: 34.32, timeStamp: new Date(2017,05,27) }
	// ...and up to the present.
];
ex27(pricesNASDAQ, console.log);
