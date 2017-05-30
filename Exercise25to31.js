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
