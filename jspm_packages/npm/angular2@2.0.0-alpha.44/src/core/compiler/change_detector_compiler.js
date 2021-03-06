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
var source_module_1 = require('./source_module');
var change_detection_jit_generator_1 = require('../change_detection/change_detection_jit_generator');
var change_definition_factory_1 = require('./change_definition_factory');
var change_detection_1 = require('../change_detection/change_detection');
var change_detector_codegen_1 = require('../../transform/template_compiler/change_detector_codegen');
var util_1 = require('./util');
var di_1 = require('../di');
var ABSTRACT_CHANGE_DETECTOR = "AbstractChangeDetector";
var UTIL = "ChangeDetectionUtil";
var ABSTRACT_CHANGE_DETECTOR_MODULE = source_module_1.moduleRef("package:angular2/src/core/change_detection/abstract_change_detector" + util_1.MODULE_SUFFIX);
var UTIL_MODULE = source_module_1.moduleRef("package:angular2/src/core/change_detection/change_detection_util" + util_1.MODULE_SUFFIX);
var PREGEN_PROTO_CHANGE_DETECTOR_MODULE = source_module_1.moduleRef("package:angular2/src/core/change_detection/pregen_proto_change_detector" + util_1.MODULE_SUFFIX);
var ChangeDetectionCompiler = (function() {
  function ChangeDetectionCompiler(_genConfig) {
    this._genConfig = _genConfig;
  }
  ChangeDetectionCompiler.prototype.compileComponentRuntime = function(componentType, strategy, parsedTemplate) {
    var _this = this;
    var changeDetectorDefinitions = change_definition_factory_1.createChangeDetectorDefinitions(componentType, strategy, this._genConfig, parsedTemplate);
    return changeDetectorDefinitions.map(function(definition) {
      return _this._createChangeDetectorFactory(definition);
    });
  };
  ChangeDetectionCompiler.prototype._createChangeDetectorFactory = function(definition) {
    if (util_1.IS_DART || !this._genConfig.useJit) {
      var proto = new change_detection_1.DynamicProtoChangeDetector(definition);
      return function(dispatcher) {
        return proto.instantiate(dispatcher);
      };
    } else {
      return new change_detection_jit_generator_1.ChangeDetectorJITGenerator(definition, UTIL, ABSTRACT_CHANGE_DETECTOR).generate();
    }
  };
  ChangeDetectionCompiler.prototype.compileComponentCodeGen = function(componentType, strategy, parsedTemplate) {
    var changeDetectorDefinitions = change_definition_factory_1.createChangeDetectorDefinitions(componentType, strategy, this._genConfig, parsedTemplate);
    var factories = [];
    var index = 0;
    var sourceParts = changeDetectorDefinitions.map(function(definition) {
      var codegen;
      var sourcePart;
      if (util_1.IS_DART) {
        codegen = new change_detector_codegen_1.Codegen(PREGEN_PROTO_CHANGE_DETECTOR_MODULE);
        var className = definition.id;
        var typeRef = (index === 0 && componentType.isHost) ? 'dynamic' : "" + source_module_1.moduleRef(componentType.moduleUrl) + componentType.name;
        codegen.generate(typeRef, className, definition);
        factories.push("(dispatcher) => new " + className + "(dispatcher)");
        sourcePart = codegen.toString();
      } else {
        codegen = new change_detection_jit_generator_1.ChangeDetectorJITGenerator(definition, "" + UTIL_MODULE + UTIL, "" + ABSTRACT_CHANGE_DETECTOR_MODULE + ABSTRACT_CHANGE_DETECTOR);
        factories.push("function(dispatcher) { return new " + codegen.typeName + "(dispatcher); }");
        sourcePart = codegen.generateSource();
      }
      index++;
      return sourcePart;
    });
    return new source_module_1.SourceExpressions(sourceParts, factories);
  };
  ChangeDetectionCompiler = __decorate([di_1.Injectable(), __metadata('design:paramtypes', [change_detection_1.ChangeDetectorGenConfig])], ChangeDetectionCompiler);
  return ChangeDetectionCompiler;
})();
exports.ChangeDetectionCompiler = ChangeDetectionCompiler;
