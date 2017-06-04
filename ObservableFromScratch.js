function Observable(forEach) {
  this._forEach = forEach;
}

Observable.prototype = {
  forEach: function(onNext, onError, onComplete) {
    if (typeof onNext === 'function') {
      return this._forEach({
        onNext: onNext,
        onError: onError || function() {},
        onComplete: onComplete || function() {}
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
