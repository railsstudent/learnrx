function Observable(forEach) {
  this._forEach = forEach;
}

Observable.prototype = {
  forEach: function(onNext, onError, onCompleted) {
    if (typeof onNext === 'function') {
      return this._forEach({
        onNext: onNext,
        onError: onError || function() {},
        onCompleted: onCompleted || function() {}
      });
    } else {
       return this._forEach(onNext);
    }
  },
  // return mapped observable
  map: function(projectedFunction) {
    var self = this;
    return new Observable(function forEach(observer) {
        return self.forEach(
          function onNext(x) { return observer.onNext(projectedFunction(x)); },
          function onError(e) { return observer.onError(e); },
          function onCompleted() { return observer.onCompleted(); }
        );
    });
  },
  // return filter observable
  filter: function(testFunction) {
    var self = this;
    return new Observable(function forEach(observer) {
        return self.forEach(
          function onNext(x) { 
            if (testFunction(x)) {
              return observer.onNext(x); 
            }
          },
          function onError(e) { return observer.onError(e); },
          function onCompleted() { return observer.onCompleted(); }
        );
    });
  },
    // return take observable
  take: function(num) {
    var self = this;
    return new Observable(function forEach(observer) {
        var counter = 0;
        var subscription =  self.forEach(
          function onNext(x) { 
            observer.onNext(x);
            counter++;
            if (counter === num) {
                observer.onCompleted();
                subscription.dispose();
            }
          },
          function onError(e) { return observer.onError(e); },
          function onCompleted() { return observer.onCompleted(); }
        );
       return subscription;
    });
  }
}

Observable.fromEvent = function(dom, eventName) {
  return new Observable(function forEach(observer) {
    var handler = function(e) {
      observer.onNext(e);
    }
    
    dom.addEventListener(eventName, handler);
    
    // return a subscription object
    return {
      dispose: function() {
         dom.removeEventListener(eventName, handler);
      }
    }
  });
}


var button = document.getElementById("button");
var buttonClick = Observable.fromEvent(button, "click").
                  filter(function(x) { return x.pageX > 10; }).
                  map(function(x) { return x.pageX + 'px'; }).
                  take(10);

buttonClick.forEach(function(x) {
  console.log({x: x});
});
