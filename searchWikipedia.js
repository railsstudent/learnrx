var Observable = Rx.Observable;

var textbox = document.getElementById("textbox");
var textArea = document.getElementById("results");

var keypresses = Observable.fromEvent(textbox, 'keypress');

keypresses.forEach((x) => {
  var code = x.keyCode || x.which;
  var ch = String.fromCharCode(code);
  //console.log({ code: ch });
})

var searchWikipedia = (term) => {
  const encodeTerm = encodeURIComponent(term);
  const url = `https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=${encodeTerm}&callback=?`;
  $.getJSON(url,(data) => {
    console.log(data[1]);
  });
  
};

//searchWikipedia('Terminator');

// return an observable object
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

// getWikipediaSearchResults('Terminiator').forEach((result) => {
//   console.log(result);
// })


// create search button cl  ick observable
var searchButton = document.getElementById("searchButton");
var searchButtonClick = Observable.fromEvent(searchButton, "click");
var searchForm = document.getElementById("searchForm");

// use doAction to perform side-effect
// searchButtonClick.forEach((click) => {
//   searchForm.style.display = "block";
// });
// when someone calls this observable, do this action
var searchFormOpens = searchButtonClick.
                        doAction(function onNext() {
                          searchForm.style.display = "block";                          
                        });

// make an sutocomplete box
var searchResults = 
    // only subscribe to keypress when search is clicked
    searchFormOpens.
    map(function() {
      var closeButton = document.getElementById("closeButton");
      var closeButtonClick = Observable.fromEvent(closeButton, "click");

      // close search form when close button observable is clicked
      var searchFormCloses = closeButtonClick.
                             doAction(function onNext() {
                               searchForm.style.display = "none";
                               textbox.value = "";
                               textArea.value = "";
                             });
      
      return keypresses.
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
      switch().
      // return latest result
      //  { [cdefghh ] }  
      takeUntil(searchFormCloses); // 1-dimensional array 
      // stop keypress observable when close button is clicked
   }).switch();

searchResults.forEach((resultSet) => {
  textArea.value = JSON.stringify(resultSet);
}, (error) => {
  alert('error occurs');
});
