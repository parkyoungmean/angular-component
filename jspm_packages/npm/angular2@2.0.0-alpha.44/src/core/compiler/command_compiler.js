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
var collection_1 = require('../facade/collection');
var template_commands_1 = require('../linker/template_commands');
var template_ast_1 = require('./template_ast');
var source_module_1 = require('./source_module');
var view_1 = require('../metadata/view');
var style_compiler_1 = require('./style_compiler');
var util_1 = require('./util');
var di_1 = require('../di');
exports.TEMPLATE_COMMANDS_MODULE_REF = source_module_1.moduleRef("package:angular2/src/core/linker/template_commands" + util_1.MODULE_SUFFIX);
var IMPLICIT_TEMPLATE_VAR = '\$implicit';
var CLASS_ATTR = 'class';
var STYLE_ATTR = 'style';
var CommandCompiler = (function() {
  function CommandCompiler() {}
  CommandCompiler.prototype.compileComponentRuntime = function(component, appId, templateId, template, changeDetectorFactories, componentTemplateFactory) {
    var visitor = new CommandBuilderVisitor(new RuntimeCommandFactory(component, appId, templateId, componentTemplateFactory, changeDetectorFactories), 0);
    template_ast_1.templateVisitAll(visitor, template);
    return visitor.result;
  };
  CommandCompiler.prototype.compileComponentCodeGen = function(component, appIdExpr, templateIdExpr, template, changeDetectorFactoryExpressions, componentTemplateFactory) {
    var visitor = new CommandBuilderVisitor(new CodegenCommandFactory(component, appIdExpr, templateIdExpr, componentTemplateFactory, changeDetectorFactoryExpressions), 0);
    template_ast_1.templateVisitAll(visitor, template);
    var source = "[" + visitor.result.join(',') + "]";
    return new source_module_1.SourceExpression([], source);
  };
  CommandCompiler = __decorate([di_1.Injectable(), __metadata('design:paramtypes', [])], CommandCompiler);
  return CommandCompiler;
})();
exports.CommandCompiler = CommandCompiler;
var RuntimeCommandFactory = (function() {
  function RuntimeCommandFactory(component, appId, templateId, componentTemplateFactory, changeDetectorFactories) {
    this.component = component;
    this.appId = appId;
    this.templateId = templateId;
    this.componentTemplateFactory = componentTemplateFactory;
    this.changeDetectorFactories = changeDetectorFactories;
  }
  RuntimeCommandFactory.prototype._mapDirectives = function(directives) {
    return directives.map(function(directive) {
      return directive.type.runtime;
    });
  };
  RuntimeCommandFactory.prototype._addStyleShimAttributes = function(attrNameAndValues, localComponent, localTemplateId) {
    var additionalStyles = [];
    if (lang_1.isPresent(localComponent) && localComponent.template.encapsulation === view_1.ViewEncapsulation.Emulated) {
      additionalStyles.push(style_compiler_1.shimHostAttribute(this.appId, localTemplateId));
      additionalStyles.push('');
    }
    if (this.component.template.encapsulation === view_1.ViewEncapsulation.Emulated) {
      additionalStyles.push(style_compiler_1.shimContentAttribute(this.appId, this.templateId));
      additionalStyles.push('');
    }
    return additionalStyles.concat(attrNameAndValues);
  };
  RuntimeCommandFactory.prototype.createText = function(value, isBound, ngContentIndex) {
    return template_commands_1.text(value, isBound, ngContentIndex);
  };
  RuntimeCommandFactory.prototype.createNgContent = function(index, ngContentIndex) {
    return template_commands_1.ngContent(index, ngContentIndex);
  };
  RuntimeCommandFactory.prototype.createBeginElement = function(name, attrNameAndValues, eventTargetAndNames, variableNameAndValues, directives, isBound, ngContentIndex) {
    return template_commands_1.beginElement(name, this._addStyleShimAttributes(attrNameAndValues, null, null), eventTargetAndNames, variableNameAndValues, this._mapDirectives(directives), isBound, ngContentIndex);
  };
  RuntimeCommandFactory.prototype.createEndElement = function() {
    return template_commands_1.endElement();
  };
  RuntimeCommandFactory.prototype.createBeginComponent = function(name, attrNameAndValues, eventTargetAndNames, variableNameAndValues, directives, nativeShadow, ngContentIndex) {
    var nestedTemplate = this.componentTemplateFactory(directives[0]);
    return template_commands_1.beginComponent(name, this._addStyleShimAttributes(attrNameAndValues, directives[0], nestedTemplate.id), eventTargetAndNames, variableNameAndValues, this._mapDirectives(directives), nativeShadow, ngContentIndex, nestedTemplate);
  };
  RuntimeCommandFactory.prototype.createEndComponent = function() {
    return template_commands_1.endComponent();
  };
  RuntimeCommandFactory.prototype.createEmbeddedTemplate = function(embeddedTemplateIndex, attrNameAndValues, variableNameAndValues, directives, isMerged, ngContentIndex, children) {
    return template_commands_1.embeddedTemplate(attrNameAndValues, variableNameAndValues, this._mapDirectives(directives), isMerged, ngContentIndex, this.changeDetectorFactories[embeddedTemplateIndex], children);
  };
  return RuntimeCommandFactory;
})();
var CodegenCommandFactory = (function() {
  function CodegenCommandFactory(component, appIdExpr, templateIdExpr, componentTemplateFactory, changeDetectorFactoryExpressions) {
    this.component = component;
    this.appIdExpr = appIdExpr;
    this.templateIdExpr = templateIdExpr;
    this.componentTemplateFactory = componentTemplateFactory;
    this.changeDetectorFactoryExpressions = changeDetectorFactoryExpressions;
  }
  CodegenCommandFactory.prototype._addStyleShimAttributes = function(attrNameAndValues, localComponent, localTemplateIdExpr) {
    var additionalStlyes = [];
    if (lang_1.isPresent(localComponent) && localComponent.template.encapsulation === view_1.ViewEncapsulation.Emulated) {
      additionalStlyes.push(new Expression(style_compiler_1.shimHostAttributeExpr(this.appIdExpr, localTemplateIdExpr)));
      additionalStlyes.push('');
    }
    if (this.component.template.encapsulation === view_1.ViewEncapsulation.Emulated) {
      additionalStlyes.push(new Expression(style_compiler_1.shimContentAttributeExpr(this.appIdExpr, this.templateIdExpr)));
      additionalStlyes.push('');
    }
    return additionalStlyes.concat(attrNameAndValues);
  };
  CodegenCommandFactory.prototype.createText = function(value, isBound, ngContentIndex) {
    return exports.TEMPLATE_COMMANDS_MODULE_REF + "text(" + util_1.escapeSingleQuoteString(value) + ", " + isBound + ", " + ngContentIndex + ")";
  };
  CodegenCommandFactory.prototype.createNgContent = function(index, ngContentIndex) {
    return exports.TEMPLATE_COMMANDS_MODULE_REF + "ngContent(" + index + ", " + ngContentIndex + ")";
  };
  CodegenCommandFactory.prototype.createBeginElement = function(name, attrNameAndValues, eventTargetAndNames, variableNameAndValues, directives, isBound, ngContentIndex) {
    var attrsExpression = codeGenArray(this._addStyleShimAttributes(attrNameAndValues, null, null));
    return exports.TEMPLATE_COMMANDS_MODULE_REF + "beginElement(" + util_1.escapeSingleQuoteString(name) + ", " + attrsExpression + ", " + codeGenArray(eventTargetAndNames) + ", " + codeGenArray(variableNameAndValues) + ", " + codeGenDirectivesArray(directives) + ", " + isBound + ", " + ngContentIndex + ")";
  };
  CodegenCommandFactory.prototype.createEndElement = function() {
    return exports.TEMPLATE_COMMANDS_MODULE_REF + "endElement()";
  };
  CodegenCommandFactory.prototype.createBeginComponent = function(name, attrNameAndValues, eventTargetAndNames, variableNameAndValues, directives, nativeShadow, ngContentIndex) {
    var nestedCompExpr = this.componentTemplateFactory(directives[0]);
    var attrsExpression = codeGenArray(this._addStyleShimAttributes(attrNameAndValues, directives[0], nestedCompExpr + ".id"));
    return exports.TEMPLATE_COMMANDS_MODULE_REF + "beginComponent(" + util_1.escapeSingleQuoteString(name) + ", " + attrsExpression + ", " + codeGenArray(eventTargetAndNames) + ", " + codeGenArray(variableNameAndValues) + ", " + codeGenDirectivesArray(directives) + ", " + nativeShadow + ", " + ngContentIndex + ", " + nestedCompExpr + ")";
  };
  CodegenCommandFactory.prototype.createEndComponent = function() {
    return exports.TEMPLATE_COMMANDS_MODULE_REF + "endComponent()";
  };
  CodegenCommandFactory.prototype.createEmbeddedTemplate = function(embeddedTemplateIndex, attrNameAndValues, variableNameAndValues, directives, isMerged, ngContentIndex, children) {
    return (exports.TEMPLATE_COMMANDS_MODULE_REF + "embeddedTemplate(" + codeGenArray(attrNameAndValues) + ", " + codeGenArray(variableNameAndValues) + ", ") + (codeGenDirectivesArray(directives) + ", " + isMerged + ", " + ngContentIndex + ", " + this.changeDetectorFactoryExpressions[embeddedTemplateIndex] + ", [" + children.join(',') + "])");
  };
  return CodegenCommandFactory;
})();
function visitAndReturnContext(visitor, asts, context) {
  template_ast_1.templateVisitAll(visitor, asts, context);
  return context;
}
var CommandBuilderVisitor = (function() {
  function CommandBuilderVisitor(commandFactory, embeddedTemplateIndex) {
    this.commandFactory = commandFactory;
    this.embeddedTemplateIndex = embeddedTemplateIndex;
    this.result = [];
    this.transitiveNgContentCount = 0;
  }
  CommandBuilderVisitor.prototype._readAttrNameAndValues = function(directives, attrAsts) {
    var attrs = keyValueArrayToMap(visitAndReturnContext(this, attrAsts, []));
    directives.forEach(function(directiveMeta) {
      collection_1.StringMapWrapper.forEach(directiveMeta.hostAttributes, function(value, name) {
        var prevValue = attrs[name];
        attrs[name] = lang_1.isPresent(prevValue) ? mergeAttributeValue(name, prevValue, value) : value;
      });
    });
    return mapToKeyValueArray(attrs);
  };
  CommandBuilderVisitor.prototype.visitNgContent = function(ast, context) {
    this.transitiveNgContentCount++;
    this.result.push(this.commandFactory.createNgContent(ast.index, ast.ngContentIndex));
    return null;
  };
  CommandBuilderVisitor.prototype.visitEmbeddedTemplate = function(ast, context) {
    var _this = this;
    this.embeddedTemplateIndex++;
    var childVisitor = new CommandBuilderVisitor(this.commandFactory, this.embeddedTemplateIndex);
    template_ast_1.templateVisitAll(childVisitor, ast.children);
    var isMerged = childVisitor.transitiveNgContentCount > 0;
    var variableNameAndValues = [];
    ast.vars.forEach(function(varAst) {
      variableNameAndValues.push(varAst.name);
      variableNameAndValues.push(varAst.value.length > 0 ? varAst.value : IMPLICIT_TEMPLATE_VAR);
    });
    var directives = [];
    collection_1.ListWrapper.forEachWithIndex(ast.directives, function(directiveAst, index) {
      directiveAst.visit(_this, new DirectiveContext(index, [], [], directives));
    });
    this.result.push(this.commandFactory.createEmbeddedTemplate(this.embeddedTemplateIndex, this._readAttrNameAndValues(directives, ast.attrs), variableNameAndValues, directives, isMerged, ast.ngContentIndex, childVisitor.result));
    this.transitiveNgContentCount += childVisitor.transitiveNgContentCount;
    this.embeddedTemplateIndex = childVisitor.embeddedTemplateIndex;
    return null;
  };
  CommandBuilderVisitor.prototype.visitElement = function(ast, context) {
    var _this = this;
    var component = ast.getComponent();
    var eventTargetAndNames = visitAndReturnContext(this, ast.outputs, []);
    var variableNameAndValues = [];
    if (lang_1.isBlank(component)) {
      ast.exportAsVars.forEach(function(varAst) {
        variableNameAndValues.push(varAst.name);
        variableNameAndValues.push(null);
      });
    }
    var directives = [];
    collection_1.ListWrapper.forEachWithIndex(ast.directives, function(directiveAst, index) {
      directiveAst.visit(_this, new DirectiveContext(index, eventTargetAndNames, variableNameAndValues, directives));
    });
    eventTargetAndNames = removeKeyValueArrayDuplicates(eventTargetAndNames);
    var attrNameAndValues = this._readAttrNameAndValues(directives, ast.attrs);
    if (lang_1.isPresent(component)) {
      this.result.push(this.commandFactory.createBeginComponent(ast.name, attrNameAndValues, eventTargetAndNames, variableNameAndValues, directives, component.template.encapsulation === view_1.ViewEncapsulation.Native, ast.ngContentIndex));
      template_ast_1.templateVisitAll(this, ast.children);
      this.result.push(this.commandFactory.createEndComponent());
    } else {
      this.result.push(this.commandFactory.createBeginElement(ast.name, attrNameAndValues, eventTargetAndNames, variableNameAndValues, directives, ast.isBound(), ast.ngContentIndex));
      template_ast_1.templateVisitAll(this, ast.children);
      this.result.push(this.commandFactory.createEndElement());
    }
    return null;
  };
  CommandBuilderVisitor.prototype.visitVariable = function(ast, ctx) {
    return null;
  };
  CommandBuilderVisitor.prototype.visitAttr = function(ast, attrNameAndValues) {
    attrNameAndValues.push(ast.name);
    attrNameAndValues.push(ast.value);
    return null;
  };
  CommandBuilderVisitor.prototype.visitBoundText = function(ast, context) {
    this.result.push(this.commandFactory.createText(null, true, ast.ngContentIndex));
    return null;
  };
  CommandBuilderVisitor.prototype.visitText = function(ast, context) {
    this.result.push(this.commandFactory.createText(ast.value, false, ast.ngContentIndex));
    return null;
  };
  CommandBuilderVisitor.prototype.visitDirective = function(ast, ctx) {
    ctx.targetDirectives.push(ast.directive);
    template_ast_1.templateVisitAll(this, ast.hostEvents, ctx.eventTargetAndNames);
    ast.exportAsVars.forEach(function(varAst) {
      ctx.targetVariableNameAndValues.push(varAst.name);
      ctx.targetVariableNameAndValues.push(ctx.index);
    });
    return null;
  };
  CommandBuilderVisitor.prototype.visitEvent = function(ast, eventTargetAndNames) {
    eventTargetAndNames.push(ast.target);
    eventTargetAndNames.push(ast.name);
    return null;
  };
  CommandBuilderVisitor.prototype.visitDirectiveProperty = function(ast, context) {
    return null;
  };
  CommandBuilderVisitor.prototype.visitElementProperty = function(ast, context) {
    return null;
  };
  return CommandBuilderVisitor;
})();
function removeKeyValueArrayDuplicates(keyValueArray) {
  var knownPairs = new Set();
  var resultKeyValueArray = [];
  for (var i = 0; i < keyValueArray.length; i += 2) {
    var key = keyValueArray[i];
    var value = keyValueArray[i + 1];
    var pairId = key + ":" + value;
    if (!collection_1.SetWrapper.has(knownPairs, pairId)) {
      resultKeyValueArray.push(key);
      resultKeyValueArray.push(value);
      knownPairs.add(pairId);
    }
  }
  return resultKeyValueArray;
}
function keyValueArrayToMap(keyValueArr) {
  var data = {};
  for (var i = 0; i < keyValueArr.length; i += 2) {
    data[keyValueArr[i]] = keyValueArr[i + 1];
  }
  return data;
}
function mapToKeyValueArray(data) {
  var entryArray = [];
  collection_1.StringMapWrapper.forEach(data, function(value, name) {
    entryArray.push([name, value]);
  });
  collection_1.ListWrapper.sort(entryArray, function(entry1, entry2) {
    return lang_1.StringWrapper.compare(entry1[0], entry2[0]);
  });
  var keyValueArray = [];
  entryArray.forEach(function(entry) {
    keyValueArray.push(entry[0]);
    keyValueArray.push(entry[1]);
  });
  return keyValueArray;
}
function mergeAttributeValue(attrName, attrValue1, attrValue2) {
  if (attrName == CLASS_ATTR || attrName == STYLE_ATTR) {
    return attrValue1 + " " + attrValue2;
  } else {
    return attrValue2;
  }
}
var DirectiveContext = (function() {
  function DirectiveContext(index, eventTargetAndNames, targetVariableNameAndValues, targetDirectives) {
    this.index = index;
    this.eventTargetAndNames = eventTargetAndNames;
    this.targetVariableNameAndValues = targetVariableNameAndValues;
    this.targetDirectives = targetDirectives;
  }
  return DirectiveContext;
})();
var Expression = (function() {
  function Expression(value) {
    this.value = value;
  }
  return Expression;
})();
function escapeValue(value) {
  if (value instanceof Expression) {
    return value.value;
  } else if (lang_1.isString(value)) {
    return util_1.escapeSingleQuoteString(value);
  } else if (lang_1.isBlank(value)) {
    return 'null';
  } else {
    return "" + value;
  }
}
function codeGenArray(data) {
  return "[" + data.map(escapeValue).join(',') + "]";
}
function codeGenDirectivesArray(directives) {
  var expressions = directives.map(function(directiveType) {
    return ("" + source_module_1.moduleRef(directiveType.type.moduleUrl) + directiveType.type.name);
  });
  return "[" + expressions.join(',') + "]";
}
