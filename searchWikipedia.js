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
