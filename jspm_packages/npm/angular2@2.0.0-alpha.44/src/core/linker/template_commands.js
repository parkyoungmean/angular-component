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
var _nextTemplateId = 0;
function nextTemplateId() {
  return _nextTemplateId++;
}
exports.nextTemplateId = nextTemplateId;
var CompiledHostTemplate = (function() {
  function CompiledHostTemplate(_templateGetter) {
    this._templateGetter = _templateGetter;
  }
  CompiledHostTemplate.prototype.getTemplate = function() {
    return this._templateGetter();
  };
  CompiledHostTemplate = __decorate([lang_1.CONST(), __metadata('design:paramtypes', [Function])], CompiledHostTemplate);
  return CompiledHostTemplate;
})();
exports.CompiledHostTemplate = CompiledHostTemplate;
var CompiledTemplate = (function() {
  function CompiledTemplate(id, _dataGetter) {
    this.id = id;
    this._dataGetter = _dataGetter;
  }
  CompiledTemplate.prototype.getData = function(appId) {
    var data = this._dataGetter(appId, this.id);
    return new CompiledTemplateData(data[0], data[1], data[2]);
  };
  return CompiledTemplate;
})();
exports.CompiledTemplate = CompiledTemplate;
var CompiledTemplateData = (function() {
  function CompiledTemplateData(changeDetectorFactory, commands, styles) {
    this.changeDetectorFactory = changeDetectorFactory;
    this.commands = commands;
    this.styles = styles;
  }
  return CompiledTemplateData;
})();
exports.CompiledTemplateData = CompiledTemplateData;
var EMPTY_ARR = lang_1.CONST_EXPR([]);
var TextCmd = (function() {
  function TextCmd(value, isBound, ngContentIndex) {
    this.value = value;
    this.isBound = isBound;
    this.ngContentIndex = ngContentIndex;
  }
  TextCmd.prototype.visit = function(visitor, context) {
    return visitor.visitText(this, context);
  };
  return TextCmd;
})();
exports.TextCmd = TextCmd;
function text(value, isBound, ngContentIndex) {
  return new TextCmd(value, isBound, ngContentIndex);
}
exports.text = text;
var NgContentCmd = (function() {
  function NgContentCmd(index, ngContentIndex) {
    this.index = index;
    this.ngContentIndex = ngContentIndex;
    this.isBound = false;
  }
  NgContentCmd.prototype.visit = function(visitor, context) {
    return visitor.visitNgContent(this, context);
  };
  return NgContentCmd;
})();
exports.NgContentCmd = NgContentCmd;
function ngContent(index, ngContentIndex) {
  return new NgContentCmd(index, ngContentIndex);
}
exports.ngContent = ngContent;
var BeginElementCmd = (function() {
  function BeginElementCmd(name, attrNameAndValues, eventTargetAndNames, variableNameAndValues, directives, isBound, ngContentIndex) {
    this.name = name;
    this.attrNameAndValues = attrNameAndValues;
    this.eventTargetAndNames = eventTargetAndNames;
    this.variableNameAndValues = variableNameAndValues;
    this.directives = directives;
    this.isBound = isBound;
    this.ngContentIndex = ngContentIndex;
  }
  BeginElementCmd.prototype.visit = function(visitor, context) {
    return visitor.visitBeginElement(this, context);
  };
  return BeginElementCmd;
})();
exports.BeginElementCmd = BeginElementCmd;
function beginElement(name, attrNameAndValues, eventTargetAndNames, variableNameAndValues, directives, isBound, ngContentIndex) {
  return new BeginElementCmd(name, attrNameAndValues, eventTargetAndNames, variableNameAndValues, directives, isBound, ngContentIndex);
}
exports.beginElement = beginElement;
var EndElementCmd = (function() {
  function EndElementCmd() {}
  EndElementCmd.prototype.visit = function(visitor, context) {
    return visitor.visitEndElement(context);
  };
  return EndElementCmd;
})();
exports.EndElementCmd = EndElementCmd;
function endElement() {
  return new EndElementCmd();
}
exports.endElement = endElement;
var BeginComponentCmd = (function() {
  function BeginComponentCmd(name, attrNameAndValues, eventTargetAndNames, variableNameAndValues, directives, nativeShadow, ngContentIndex, template) {
    this.name = name;
    this.attrNameAndValues = attrNameAndValues;
    this.eventTargetAndNames = eventTargetAndNames;
    this.variableNameAndValues = variableNameAndValues;
    this.directives = directives;
    this.nativeShadow = nativeShadow;
    this.ngContentIndex = ngContentIndex;
    this.template = template;
    this.isBound = true;
    this.templateId = template.id;
  }
  BeginComponentCmd.prototype.visit = function(visitor, context) {
    return visitor.visitBeginComponent(this, context);
  };
  return BeginComponentCmd;
})();
exports.BeginComponentCmd = BeginComponentCmd;
function beginComponent(name, attrNameAnsValues, eventTargetAndNames, variableNameAndValues, directives, nativeShadow, ngContentIndex, template) {
  return new BeginComponentCmd(name, attrNameAnsValues, eventTargetAndNames, variableNameAndValues, directives, nativeShadow, ngContentIndex, template);
}
exports.beginComponent = beginComponent;
var EndComponentCmd = (function() {
  function EndComponentCmd() {}
  EndComponentCmd.prototype.visit = function(visitor, context) {
    return visitor.visitEndComponent(context);
  };
  return EndComponentCmd;
})();
exports.EndComponentCmd = EndComponentCmd;
function endComponent() {
  return new EndComponentCmd();
}
exports.endComponent = endComponent;
var EmbeddedTemplateCmd = (function() {
  function EmbeddedTemplateCmd(attrNameAndValues, variableNameAndValues, directives, isMerged, ngContentIndex, changeDetectorFactory, children) {
    this.attrNameAndValues = attrNameAndValues;
    this.variableNameAndValues = variableNameAndValues;
    this.directives = directives;
    this.isMerged = isMerged;
    this.ngContentIndex = ngContentIndex;
    this.changeDetectorFactory = changeDetectorFactory;
    this.children = children;
    this.isBound = true;
    this.name = null;
    this.eventTargetAndNames = EMPTY_ARR;
  }
  EmbeddedTemplateCmd.prototype.visit = function(visitor, context) {
    return visitor.visitEmbeddedTemplate(this, context);
  };
  return EmbeddedTemplateCmd;
})();
exports.EmbeddedTemplateCmd = EmbeddedTemplateCmd;
function embeddedTemplate(attrNameAndValues, variableNameAndValues, directives, isMerged, ngContentIndex, changeDetectorFactory, children) {
  return new EmbeddedTemplateCmd(attrNameAndValues, variableNameAndValues, directives, isMerged, ngContentIndex, changeDetectorFactory, children);
}
exports.embeddedTemplate = embeddedTemplate;
function visitAllCommands(visitor, cmds, context) {
  if (context === void 0) {
    context = null;
  }
  for (var i = 0; i < cmds.length; i++) {
    cmds[i].visit(visitor, context);
  }
}
exports.visitAllCommands = visitAllCommands;
