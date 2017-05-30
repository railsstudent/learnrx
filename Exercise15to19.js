/* Exercise 15: Use forEach to find the largest box art

In this example we use forEach to find the largest box art. Each time we 
examine a new boxart we update a variable with the currently known maximumSize. 
If the boxart is smaller than the maximum size, we discard it. If it's larger, 
we keep track of it. Finally we're left with a single boxart which must 
necessarily be the largest.
*/
var ex15 = function() {
	var boxarts = [
			{ width: 200, height: 200, url: "http://cdn-0.nflximg.com/images/2891/Fracture200.jpg" },
			{ width: 150, height: 200, url: "http://cdn-0.nflximg.com/images/2891/Fracture150.jpg" },
			{ width: 300, height: 200, url: "http://cdn-0.nflximg.com/images/2891/Fracture300.jpg" },
			{ width: 425, height: 150, url: "http://cdn-0.nflximg.com/images/2891/Fracture425.jpg" }
		],
		currentSize,
		maxSize = -1,
		largestBoxart;

	boxarts.forEach(function(boxart) {
		currentSize = boxart.width * boxart.height;
		if (currentSize > maxSize) {
			largestBoxart = boxart;
			maxSize = currentSize;
		}
	});

	return largestBoxart;
}

/* 
Exercise 16: Implement reduce()

Let's add a reduce() function to the Array type. Like map. Take note this is 
different from the reduce in ES5, which returns a value instead of an Array! 
*/
// [1,2,3].reduce(function(accumulatedValue, currentValue) { return accumulatedValue + currentValue; }); === [6];
// [1,2,3].reduce(function(accumulatedValue, currentValue) { return accumulatedValue + currentValue; }, 10); === [16];

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

console.log(JSON.stringify([1,2,3].reduce(function(accumulatedValue, currentValue) { return accumulatedValue + currentValue; })) === '[6]');
console.log(JSON.stringify([1,2,3]
	.reduce(function(accumulatedValue, currentValue) { return accumulatedValue + currentValue; }, 10)) === '[16]');
		
		
var ex17 = function() {
	var ratings = [2,3,1,4,5];

	// You should return an array containing only the largest rating. Remember that reduce always
	// returns an array with one item.
	return ratings.
					reduce(function(acc, r) {
										return (acc >= r) ? acc : r;
								});
}
console.log(JSON.stringify(ex17()) === '[5]');

var ex18 = function() {
	var boxarts = [
			{ width: 200, height: 200, url: "http://cdn-0.nflximg.com/images/2891/Fracture200.jpg" },
			{ width: 150, height: 200, url: "http://cdn-0.nflximg.com/images/2891/Fracture150.jpg" },
			{ width: 300, height: 200, url: "http://cdn-0.nflximg.com/images/2891/Fracture300.jpg" },
			{ width: 425, height: 150, url: "http://cdn-0.nflximg.com/images/2891/Fracture425.jpg" }
		];

	// You should return an array containing only the URL of the largest box art. Remember that reduce always
	// returns an array with one item.
	return boxarts.
		reduce (function(acc, boxart) {
			// return an array of boxart object
			return (acc.width * acc.height) >= (boxart.width * boxart.height) ? acc : boxart
		}).map(function(boxart) {
			return boxart.url
		});
}
console.log(ex18()[0] === "http://cdn-0.nflximg.com/images/2891/Fracture425.jpg");	

/*
Exercise 19: Reducing with an initial value

Sometimes when we reduce an array, we want the reduced value to be a different type 
than the items stored in the array. Let's say we have an array of videos and we want to 
reduce them to a single map where the key is the video id and the value is the video's title.	
*/
var ex19 = function() {
	var videos = [
		{
			"id": 65432445,
			"title": "The Chamber"
		},
		{
			"id": 675465,
			"title": "Fracture"
		},
		{
			"id": 70111470,
			"title": "Die Hard"
		},
		{
			"id": 654356453,
			"title": "Bad Boys"
		}
	];

	// Expecting this output...
	// [
	//	 {
	//		 "65432445": "The Chamber",
	//		 "675465": "Fracture",
	//		 "70111470": "Die Hard",
	//		 "654356453": "Bad Boys"
	//	 }
	// ]
	return videos.
		reduce(function(accumulatedMap, video) {
			var obj = {};

			obj[video.id] = video.title;

			// Object.assign() takes all of the enumerable properties from
			// the object listed in its second argument (obj) and assigns them
			// to the object listed in its first argument (accumulatedMap).
			return Object.assign(accumulatedMap, obj);
		},
		// Use an empty map as the initial value instead of the first item in
		// the list.
		{});
}
		
console.log(ex19());
