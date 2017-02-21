/* */ 
'use strict';
var __extends = (this && this.__extends) || function(d, b) {
  for (var p in b)
    if (b.hasOwnProperty(p))
      d[p] = b[p];
  function __() {
    this.constructor = d;
  }
  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
var proto_view_factory_1 = require('./proto_view_factory');
var di_1 = require('../di');
var lang_1 = require('../facade/lang');
var exceptions_1 = require('../facade/exceptions');
var async_1 = require('../facade/async');
var reflection_1 = require('../reflection/reflection');
var template_commands_1 = require('./template_commands');
var Compiler = (function() {
  function Compiler() {}
  return Compiler;
})();
exports.Compiler = Compiler;
var Compiler_ = (function(_super) {
  __extends(Compiler_, _super);
  function Compiler_(_protoViewFactory) {
    _super.call(this);
    this._protoViewFactory = _protoViewFactory;
  }
  Compiler_.prototype.compileInHost = function(componentType) {
    var metadatas = reflection_1.reflector.annotations(componentType);
    var compiledHostTemplate = null;
    for (var i = 0; i < metadatas.length; i++) {
      var metadata = metadatas[i];
      if (metadata instanceof template_commands_1.CompiledHostTemplate) {
        compiledHostTemplate = metadata;
        break;
      }
    }
    if (lang_1.isBlank(compiledHostTemplate)) {
      throw new exceptions_1.BaseException("No precompiled template for component " + lang_1.stringify(componentType) + " found");
    }
    return async_1.PromiseWrapper.resolve(this._createProtoView(compiledHostTemplate));
  };
  Compiler_.prototype._createProtoView = function(compiledHostTemplate) {
    return this._protoViewFactory.createHost(compiledHostTemplate).ref;
  };
  Compiler_.prototype.clearCache = function() {
    this._protoViewFactory.clearCache();
  };
  Compiler_ = __decorate([di_1.Injectable(), __metadata('design:paramtypes', [proto_view_factory_1.ProtoViewFactory])], Compiler_);
  return Compiler_;
})(Compiler);
exports.Compiler_ = Compiler_;
function internalCreateProtoView(compiler, compiledHostTemplate) {
  return compiler._createProtoView(compiledHostTemplate);
}
exports.internalCreateProtoView = internalCreateProtoView;
