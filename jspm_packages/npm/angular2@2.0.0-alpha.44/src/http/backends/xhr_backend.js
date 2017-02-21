/* */ 
'use strict';
var __decorate = (this && this.__decorate) || function(decorators, target, key, desc) {
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
    return Reflect.decorate(decorators, target, key, desc);
  switch (arguments.length) {
    case 2:
      return decorators.reduceRight(function(o, d) {
        return (d && d(o)) || o;
      }, target);
    case 3:
      return decorators.reduceRight(function(o, d) {
        return (d && d(target, key)), void 0;
      }, void 0);
    case 4:
      return decorators.reduceRight(function(o, d) {
        return (d && d(target, key, o)) || o;
      }, desc);
  }
};
var __metadata = (this && this.__metadata) || function(k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
    return Reflect.metadata(k, v);
};
var enums_1 = require('../enums');
var static_response_1 = require('../static_response');
var base_response_options_1 = require('../base_response_options');
var angular2_1 = require('../../../angular2');
var browser_xhr_1 = require('./browser_xhr');
var lang_1 = require('../../core/facade/lang');
var Rx = require('@reactivex/rxjs/dist/cjs/Rx');
var Observable = Rx.Observable;
var XHRConnection = (function() {
  function XHRConnection(req, browserXHR, baseResponseOptions) {
    var _this = this;
    this.request = req;
    this.response = new Observable(function(responseObserver) {
      var _xhr = browserXHR.build();
      _xhr.open(enums_1.RequestMethods[req.method].toUpperCase(), req.url);
      var onLoad = function() {
        var response = lang_1.isPresent(_xhr.response) ? _xhr.response : _xhr.responseText;
        var status = _xhr.status === 1223 ? 204 : _xhr.status;
        if (status === 0) {
          status = response ? 200 : 0;
        }
        var responseOptions = new base_response_options_1.ResponseOptions({
          body: response,
          status: status
        });
        if (lang_1.isPresent(baseResponseOptions)) {
          responseOptions = baseResponseOptions.merge(responseOptions);
        }
        responseObserver.next(new static_response_1.Response(responseOptions));
        responseObserver.complete();
      };
      var onError = function(err) {
        var responseOptions = new base_response_options_1.ResponseOptions({
          body: err,
          type: enums_1.ResponseTypes.Error
        });
        if (lang_1.isPresent(baseResponseOptions)) {
          responseOptions = baseResponseOptions.merge(responseOptions);
        }
        responseObserver.error(new static_response_1.Response(responseOptions));
      };
      if (lang_1.isPresent(req.headers)) {
        req.headers.forEach(function(values, name) {
          return _xhr.setRequestHeader(name, values.join(','));
        });
      }
      _xhr.addEventListener('load', onLoad);
      _xhr.addEventListener('error', onError);
      _xhr.send(_this.request.text());
      return function() {
        _xhr.removeEventListener('load', onLoad);
        _xhr.removeEventListener('error', onError);
        _xhr.abort();
      };
    });
  }
  return XHRConnection;
})();
exports.XHRConnection = XHRConnection;
var XHRBackend = (function() {
  function XHRBackend(_browserXHR, _baseResponseOptions) {
    this._browserXHR = _browserXHR;
    this._baseResponseOptions = _baseResponseOptions;
  }
  XHRBackend.prototype.createConnection = function(request) {
    return new XHRConnection(request, this._browserXHR, this._baseResponseOptions);
  };
  XHRBackend = __decorate([angular2_1.Injectable(), __metadata('design:paramtypes', [browser_xhr_1.BrowserXhr, base_response_options_1.ResponseOptions])], XHRBackend);
  return XHRBackend;
})();
exports.XHRBackend = XHRBackend;
