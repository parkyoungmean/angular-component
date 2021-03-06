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
function _inherits(subClass, superClass) {
  if (typeof superClass !== 'function' && superClass !== null) {
    throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }});
  if (superClass)
    Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}
var _Subscription3 = require('../Subscription');
var _Subscription4 = _interopRequireDefault(_Subscription3);
var _Observable2 = require('../Observable');
var _Observable3 = _interopRequireDefault(_Observable2);
var RefCountSubscription = (function(_Subscription) {
  _inherits(RefCountSubscription, _Subscription);
  function RefCountSubscription() {
    _classCallCheck(this, RefCountSubscription);
    _Subscription.call(this);
    this.attemptedToUnsubscribePrimary = false;
    this.count = 0;
  }
  RefCountSubscription.prototype.setPrimary = function setPrimary(subscription) {
    this.primary = subscription;
  };
  RefCountSubscription.prototype.unsubscribe = function unsubscribe() {
    if (!this.isUnsubscribed && !this.attemptedToUnsubscribePrimary) {
      this.attemptedToUnsubscribePrimary = true;
      if (this.count === 0) {
        _Subscription.prototype.unsubscribe.call(this);
        this.primary.unsubscribe();
      }
    }
  };
  return RefCountSubscription;
})(_Subscription4['default']);
exports.RefCountSubscription = RefCountSubscription;
var GroupedObservable = (function(_Observable) {
  _inherits(GroupedObservable, _Observable);
  function GroupedObservable(key, groupSubject, refCountSubscription) {
    _classCallCheck(this, GroupedObservable);
    _Observable.call(this);
    this.key = key;
    this.groupSubject = groupSubject;
    this.refCountSubscription = refCountSubscription;
  }
  GroupedObservable.prototype._subscribe = function _subscribe(subscriber) {
    var subscription = new _Subscription4['default']();
    if (this.refCountSubscription && !this.refCountSubscription.isUnsubscribed) {
      subscription.add(new InnerRefCountSubscription(this.refCountSubscription));
    }
    subscription.add(this.groupSubject.subscribe(subscriber));
    return subscription;
  };
  return GroupedObservable;
})(_Observable3['default']);
exports.GroupedObservable = GroupedObservable;
var InnerRefCountSubscription = (function(_Subscription2) {
  _inherits(InnerRefCountSubscription, _Subscription2);
  function InnerRefCountSubscription(parent) {
    _classCallCheck(this, InnerRefCountSubscription);
    _Subscription2.call(this);
    this.parent = parent;
    parent.count++;
  }
  InnerRefCountSubscription.prototype.unsubscribe = function unsubscribe() {
    if (!this.parent.isUnsubscribed && !this.isUnsubscribed) {
      _Subscription2.prototype.unsubscribe.call(this);
      this.parent.count--;
      if (this.parent.count === 0 && this.parent.attemptedToUnsubscribePrimary) {
        this.parent.unsubscribe();
        this.parent.primary.unsubscribe();
      }
    }
  };
  return InnerRefCountSubscription;
})(_Subscription4['default']);
exports.InnerRefCountSubscription = InnerRefCountSubscription;
