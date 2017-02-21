/* */ 
'use strict';
var lang_1 = require('../core/facade/lang');
var exceptions_1 = require('../core/facade/exceptions');
var collection_1 = require('../core/facade/collection');
var Headers = (function() {
  function Headers(headers) {
    var _this = this;
    if (headers instanceof Headers) {
      this._headersMap = headers._headersMap;
      return;
    }
    this._headersMap = new collection_1.Map();
    if (lang_1.isBlank(headers)) {
      return;
    }
    collection_1.StringMapWrapper.forEach(headers, function(v, k) {
      _this._headersMap.set(k, collection_1.isListLikeIterable(v) ? v : [v]);
    });
  }
  Headers.prototype.append = function(name, value) {
    var mapName = this._headersMap.get(name);
    var list = collection_1.isListLikeIterable(mapName) ? mapName : [];
    list.push(value);
    this._headersMap.set(name, list);
  };
  Headers.prototype.delete = function(name) {
    this._headersMap.delete(name);
  };
  Headers.prototype.forEach = function(fn) {
    this._headersMap.forEach(fn);
  };
  Headers.prototype.get = function(header) {
    return collection_1.ListWrapper.first(this._headersMap.get(header));
  };
  Headers.prototype.has = function(header) {
    return this._headersMap.has(header);
  };
  Headers.prototype.keys = function() {
    return collection_1.MapWrapper.keys(this._headersMap);
  };
  Headers.prototype.set = function(header, value) {
    var list = [];
    if (collection_1.isListLikeIterable(value)) {
      var pushValue = value.join(',');
      list.push(pushValue);
    } else {
      list.push(value);
    }
    this._headersMap.set(header, list);
  };
  Headers.prototype.values = function() {
    return collection_1.MapWrapper.values(this._headersMap);
  };
  Headers.prototype.getAll = function(header) {
    var headers = this._headersMap.get(header);
    return collection_1.isListLikeIterable(headers) ? headers : [];
  };
  Headers.prototype.entries = function() {
    throw new exceptions_1.BaseException('"entries" method is not implemented on Headers class');
  };
  return Headers;
})();
exports.Headers = Headers;
