// use JQuery to call wikipedia to search Terminator
var searchWikipedia = (term) => {
  const encodeTerm = encodeURIComponent(term);
  const url = `https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=${encodeTerm}&callback=?`;
  $.getJSON(url,(data) => {
    console.log(data[1]);
  });
  
};
searchWikipedia('Terminator');

// Adapt JQuery getJSON to Observable function
// import from rx.all.js
var Observable = Rx.Observable;
function getWikipediaSearchResults(term) {
  return Observable.create(function forEach(observer) {     
       let cancelled = false;
       const encodeTerm = encodeURIComponent(term);
       const url = `https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=${encodeTerm}&callback=?`;
       $.getJSON(url,(data) => {
          observer.onNext(data[1]);
          observer.onCompleted();
       });   // getJSON     
       return function dispose() {
            cancelled = true;
         }; // dispose
    });
}

getWikipediaSearchResults('Terminiator').forEach((result) => {
  console.log(result);
})

// make an sutocomplete box
var searchResults = 
    keypresses      
     // {a..b.......c...d....}
    .throttle(20)   
     // {...b...........d...}
    .map((key) => {
      
      /* {
            {[aaaa], [bbbbb] },
                                { [cdefghh ] }
         }*/
      return getWikipediaSearchResults(textbox.value);
    })
    .switch();  
    // return latest result
    //  { [cdefghh ] }  

var textArea = document.getElementById("results");
searchResults.forEach((resultSet) => {
  textArea.value = JSON.stringify(resultSet);
})

// Use Observable function distinctUntilChanged to ensure no two same inputs in the stream
// make an sutocomplete box
var searchResults = 
    keypresses.
     // {a..b.......c...d....}
    throttle(20).   
     // {...b...........d...}
    map((key) => {
      return textbox.value
    }).
    // {...'ab'...'ab'....'abcd'....}
    distinctUntilChanged().
    // {...'ab'...........'abcd'....}
    map((search) => {
      return getWikipediaSearchResults(search);
    }).
    // {...['abcde', 'dddd']....['cdefghh']...}
    switch();  
    // return latest result
    //  { [cdefghh ] }  

var textArea = document.getElementById("results");
searchResults.forEach((resultSet) => {
  textArea.value = JSON.stringify(resultSet);
},  (error) => {
  alert('Error occurs, please try again later.');
});
