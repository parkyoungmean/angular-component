/* */ 
'use strict';
exports.__esModule = true;
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {'default': obj};
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}
var _Subscriber = require('./Subscriber');
var _Subscriber2 = _interopRequireDefault(_Subscriber);
var _utilRoot = require('./util/root');
var _utilSymbol_observable = require('./util/Symbol_observable');
var _utilSymbol_observable2 = _interopRequireDefault(_utilSymbol_observable);
var Observable = (function() {
  function Observable(subscribe) {
    _classCallCheck(this, Observable);
    this._isScalar = false;
    if (subscribe) {
      this._subscribe = subscribe;
    }
  }
  Observable.prototype.lift = function lift(operator) {
    var observable = new Observable();
    observable.source = this;
    observable.operator = operator;
    return observable;
  };
  Observable.prototype[_utilSymbol_observable2['default']] = function() {
    return this;
  };
  Observable.prototype.subscribe = function subscribe(observerOrNext, error, complete) {
    var subscriber = undefined;
    if (observerOrNext && typeof observerOrNext === "object") {
      if (observerOrNext instanceof _Subscriber2['default']) {
        subscriber = observerOrNext;
      } else {
        subscriber = new _Subscriber2['default'](observerOrNext);
      }
    } else {
      var next = observerOrNext;
      subscriber = _Subscriber2['default'].create(next, error, complete);
    }
    subscriber.add(this._subscribe(subscriber));
    return subscriber;
  };
  Observable.prototype.forEach = function forEach(next, PromiseCtor) {
    var _this = this;
    if (!PromiseCtor) {
      if (_utilRoot.root.Rx && _utilRoot.root.Rx.config && _utilRoot.root.Rx.config.Promise) {
        PromiseCtor = _utilRoot.root.Rx.config.Promise;
      } else if (_utilRoot.root.Promise) {
        PromiseCtor = _utilRoot.root.Promise;
      }
    }
    if (!PromiseCtor) {
      throw new Error('no Promise impl found');
    }
    return new PromiseCtor(function(resolve, reject) {
      _this.subscribe(next, reject, resolve);
    });
  };
  Observable.prototype._subscribe = function _subscribe(subscriber) {
    return this.source._subscribe(this.operator.call(subscriber));
  };
  return Observable;
})();
exports['default'] = Observable;
Observable.create = function(subscribe) {
  return new Observable(subscribe);
};
module.exports = exports['default'];
