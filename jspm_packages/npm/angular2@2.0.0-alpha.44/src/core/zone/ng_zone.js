/* */ 
(function(process) {
  'use strict';
  var collection_1 = require('../facade/collection');
  var lang_1 = require('../facade/lang');
  var profile_1 = require('../profile/profile');
  var NgZone = (function() {
    function NgZone(_a) {
      var enableLongStackTrace = _a.enableLongStackTrace;
      this._runScope = profile_1.wtfCreateScope("NgZone#run()");
      this._microtaskScope = profile_1.wtfCreateScope("NgZone#microtask()");
      this._pendingMicrotasks = 0;
      this._hasExecutedCodeInInnerZone = false;
      this._nestedRun = 0;
      this._inVmTurnDone = false;
      this._pendingTimeouts = [];
      if (lang_1.global.zone) {
        this._disabled = false;
        this._mountZone = lang_1.global.zone;
        this._innerZone = this._createInnerZone(this._mountZone, enableLongStackTrace);
      } else {
        this._disabled = true;
        this._mountZone = null;
      }
    }
    NgZone.prototype.overrideOnTurnStart = function(onTurnStartHook) {
      this._onTurnStart = lang_1.normalizeBlank(onTurnStartHook);
    };
    NgZone.prototype.overrideOnTurnDone = function(onTurnDoneHook) {
      this._onTurnDone = lang_1.normalizeBlank(onTurnDoneHook);
    };
    NgZone.prototype.overrideOnEventDone = function(onEventDoneFn, opt_waitForAsync) {
      var _this = this;
      if (opt_waitForAsync === void 0) {
        opt_waitForAsync = false;
      }
      var normalizedOnEventDone = lang_1.normalizeBlank(onEventDoneFn);
      if (opt_waitForAsync) {
        this._onEventDone = function() {
          if (!_this._pendingTimeouts.length) {
            normalizedOnEventDone();
          }
        };
      } else {
        this._onEventDone = normalizedOnEventDone;
      }
    };
    NgZone.prototype.overrideOnErrorHandler = function(errorHandler) {
      this._onErrorHandler = lang_1.normalizeBlank(errorHandler);
    };
    NgZone.prototype.run = function(fn) {
      if (this._disabled) {
        return fn();
      } else {
        var s = this._runScope();
        try {
          return this._innerZone.run(fn);
        } finally {
          profile_1.wtfLeave(s);
        }
      }
    };
    NgZone.prototype.runOutsideAngular = function(fn) {
      if (this._disabled) {
        return fn();
      } else {
        return this._mountZone.run(fn);
      }
    };
    NgZone.prototype._createInnerZone = function(zone, enableLongStackTrace) {
      var microtaskScope = this._microtaskScope;
      var ngZone = this;
      var errorHandling;
      if (enableLongStackTrace) {
        errorHandling = collection_1.StringMapWrapper.merge(Zone.longStackTraceZone, {onError: function(e) {
            ngZone._onError(this, e);
          }});
      } else {
        errorHandling = {onError: function(e) {
            ngZone._onError(this, e);
          }};
      }
      return zone.fork(errorHandling).fork({
        '$run': function(parentRun) {
          return function() {
            try {
              ngZone._nestedRun++;
              if (!ngZone._hasExecutedCodeInInnerZone) {
                ngZone._hasExecutedCodeInInnerZone = true;
                if (ngZone._onTurnStart) {
                  parentRun.call(ngZone._innerZone, ngZone._onTurnStart);
                }
              }
              return parentRun.apply(this, arguments);
            } finally {
              ngZone._nestedRun--;
              if (ngZone._pendingMicrotasks == 0 && ngZone._nestedRun == 0 && !this._inVmTurnDone) {
                if (ngZone._onTurnDone && ngZone._hasExecutedCodeInInnerZone) {
                  try {
                    this._inVmTurnDone = true;
                    parentRun.call(ngZone._innerZone, ngZone._onTurnDone);
                  } finally {
                    this._inVmTurnDone = false;
                    ngZone._hasExecutedCodeInInnerZone = false;
                  }
                }
                if (ngZone._pendingMicrotasks === 0 && lang_1.isPresent(ngZone._onEventDone)) {
                  ngZone.runOutsideAngular(ngZone._onEventDone);
                }
              }
            }
          };
        },
        '$scheduleMicrotask': function(parentScheduleMicrotask) {
          return function(fn) {
            ngZone._pendingMicrotasks++;
            var microtask = function() {
              var s = microtaskScope();
              try {
                fn();
              } finally {
                ngZone._pendingMicrotasks--;
                profile_1.wtfLeave(s);
              }
            };
            parentScheduleMicrotask.call(this, microtask);
          };
        },
        '$setTimeout': function(parentSetTimeout) {
          return function(fn, delay) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
              args[_i - 2] = arguments[_i];
            }
            var id;
            var cb = function() {
              fn();
              collection_1.ListWrapper.remove(ngZone._pendingTimeouts, id);
            };
            id = parentSetTimeout(cb, delay, args);
            ngZone._pendingTimeouts.push(id);
            return id;
          };
        },
        '$clearTimeout': function(parentClearTimeout) {
          return function(id) {
            parentClearTimeout(id);
            collection_1.ListWrapper.remove(ngZone._pendingTimeouts, id);
          };
        },
        _innerZone: true
      });
    };
    NgZone.prototype._onError = function(zone, e) {
      if (lang_1.isPresent(this._onErrorHandler)) {
        var trace = [lang_1.normalizeBlank(e.stack)];
        while (zone && zone.constructedAtException) {
          trace.push(zone.constructedAtException.get());
          zone = zone.parent;
        }
        this._onErrorHandler(e, trace);
      } else {
        console.log('## _onError ##');
        console.log(e.stack);
        throw e;
      }
    };
    return NgZone;
  })();
  exports.NgZone = NgZone;
})(require('process'));
