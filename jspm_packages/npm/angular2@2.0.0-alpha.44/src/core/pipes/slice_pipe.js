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
var lang_1 = require('../facade/lang');
var exceptions_1 = require('../facade/exceptions');
var collection_1 = require('../facade/collection');
var di_1 = require('../di');
var invalid_pipe_argument_exception_1 = require('./invalid_pipe_argument_exception');
var metadata_1 = require('../metadata');
var SlicePipe = (function() {
  function SlicePipe() {}
  SlicePipe.prototype.transform = function(value, args) {
    if (args === void 0) {
      args = null;
    }
    if (lang_1.isBlank(args) || args.length == 0) {
      throw new exceptions_1.BaseException('Slice pipe requires one argument');
    }
    if (!this.supports(value)) {
      throw new invalid_pipe_argument_exception_1.InvalidPipeArgumentException(SlicePipe, value);
    }
    if (lang_1.isBlank(value))
      return value;
    var start = args[0];
    var end = args.length > 1 ? args[1] : null;
    if (lang_1.isString(value)) {
      return lang_1.StringWrapper.slice(value, start, end);
    }
    return collection_1.ListWrapper.slice(value, start, end);
  };
  SlicePipe.prototype.supports = function(obj) {
    return lang_1.isString(obj) || lang_1.isArray(obj);
  };
  SlicePipe = __decorate([metadata_1.Pipe({name: 'slice'}), di_1.Injectable(), __metadata('design:paramtypes', [])], SlicePipe);
  return SlicePipe;
})();
exports.SlicePipe = SlicePipe;
