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

/* 
This is a variation of the problem we solved earlier, where we retrieved the 
url of the boxart with a width of 150px. This time we'll use reduce() instead 
of filter() to retrieve the smallest box art in the boxarts array.
*/
var ex20 = function() {
	var movieLists = [
		{
			name: "New Releases",
			videos: [
				{
					"id": 70111470,
					"title": "Die Hard",
					"boxarts": [
						{ width: 150, height:200, url:"http://cdn-0.nflximg.com/images/2891/DieHard150.jpg" },
						{ width: 200, height:200, url:"http://cdn-0.nflximg.com/images/2891/DieHard200.jpg" }
					],
					"url": "http://api.netflix.com/catalog/titles/movies/70111470",
					"rating": 4.0,
					"bookmark": []
				},
				{
					"id": 654356453,
					"title": "Bad Boys",
					"boxarts": [
						{ width: 200, height:200, url:"http://cdn-0.nflximg.com/images/2891/BadBoys200.jpg" },
						{ width: 140, height:200, url:"http://cdn-0.nflximg.com/images/2891/BadBoys140.jpg" }

					],
					"url": "http://api.netflix.com/catalog/titles/movies/70111470",
					"rating": 5.0,
					"bookmark": [{ id:432534, time:65876586 }]
				}
			]
		},
		{
			name: "Thrillers",
			videos: [
				{
					"id": 65432445,
					"title": "The Chamber",
					"boxarts": [
						{ width: 130, height:200, url:"http://cdn-0.nflximg.com/images/2891/TheChamber130.jpg" },
						{ width: 200, height:200, url:"http://cdn-0.nflximg.com/images/2891/TheChamber200.jpg" }
					],
					"url": "http://api.netflix.com/catalog/titles/movies/70111470",
					"rating": 4.0,
					"bookmark": []
				},
				{
					"id": 675465,
					"title": "Fracture",
					"boxarts": [
						{ width: 200, height:200, url:"http://cdn-0.nflximg.com/images/2891/Fracture200.jpg" },
						{ width: 120, height:200, url:"http://cdn-0.nflximg.com/images/2891/Fracture120.jpg" },
						{ width: 300, height:200, url:"http://cdn-0.nflximg.com/images/2891/Fracture300.jpg" }
					],
					"url": "http://api.netflix.com/catalog/titles/movies/70111470",
					"rating": 5.0,
					"bookmark": [{ id:432534, time:65876586 }]
				}
			]
		}
	];


	// Use one or more concatMap, map, and reduce calls to create an array with the following items (order doesn't matter)
	// [
	//	 {"id": 675465,"title": "Fracture","boxart":"http://cdn-0.nflximg.com/images/2891/Fracture120.jpg" },
	//	 {"id": 65432445,"title": "The Chamber","boxart":"http://cdn-0.nflximg.com/images/2891/TheChamber130.jpg" },
	//	 {"id": 654356453,"title": "Bad Boys","boxart":"http://cdn-0.nflximg.com/images/2891/BadBoys140.jpg" },
	//	 {"id": 70111470,"title": "Die Hard","boxart":"http://cdn-0.nflximg.com/images/2891/DieHard150.jpg" }
	// ];

	return movieLists.
		concatMap(function(movieList) {
				return movieList.videos.concatMap(function(video) {
						return video.boxarts.reduce(function(acc, boxart) {
												return (acc.width * acc.height <= boxart.width * boxart.height) ? acc : boxart;
										}).map(function(boxart) {
											return { id: video.id, title: video.title, boxart : boxart.url };
										});
				});
		});
}
console.log(ex20());

/* 
Zipping Arrays

Sometimes we need to combine two arrays by progressively taking an item from 
each and combining the pair. If you visualize a zipper, where each side is an 
array, and each tooth is an item, you'll have a good idea of how the zip 
operation works.
*/

/* Exercise 21: Combine videos and bookmarks by index

Use a for loop to traverse the videos and bookmarks array at the same time. 
For each video and bookmark pair, create a {videoId, bookmarkId} pair and 
add it to the videoIdAndBookmarkIdPairs array.
*/
var ex21 = function() {
	var videos = [
			{
				"id": 70111470,
				"title": "Die Hard",
				"boxart": "http://cdn-0.nflximg.com/images/2891/DieHard.jpg",
				"uri": "http://api.netflix.com/catalog/titles/movies/70111470",
				"rating": 4.0,
			},
			{
				"id": 654356453,
				"title": "Bad Boys",
				"boxart": "http://cdn-0.nflximg.com/images/2891/BadBoys.jpg",
				"uri": "http://api.netflix.com/catalog/titles/movies/70111470",
				"rating": 5.0,
			},
			{
				"id": 65432445,
				"title": "The Chamber",
				"boxart": "http://cdn-0.nflximg.com/images/2891/TheChamber.jpg",
				"uri": "http://api.netflix.com/catalog/titles/movies/70111470",
				"rating": 4.0,
			},
			{
				"id": 675465,
				"title": "Fracture",
				"boxart": "http://cdn-0.nflximg.com/images/2891/Fracture.jpg",
				"uri": "http://api.netflix.com/catalog/titles/movies/70111470",
				"rating": 5.0,
			}
		],
		bookmarks = [
			{id: 470, time: 23432},
			{id: 453, time: 234324},
			{id: 445, time: 987834}
		],
	counter,
	videoIdAndBookmarkIdPairs = [];
	for(counter = 0; counter < Math.min(videos.length, bookmarks.length); counter++) {
		// Insert code here to create a {videoId, bookmarkId} pair and add it to the videoIdAndBookmarkIdPairs array.
		videoIdAndBookmarkIdPairs.push({videoId: videos[counter].id, bookmarkId: bookmarks[counter].id});
	}
	
	return videoIdAndBookmarkIdPairs;
}
console.log(ex21());

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
		
