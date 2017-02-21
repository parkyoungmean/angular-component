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
var collection_1 = require('../core/facade/collection');
var exceptions_1 = require('../core/facade/exceptions');
var lang_1 = require('../core/facade/lang');
var RouteParams = (function() {
  function RouteParams(params) {
    this.params = params;
  }
  RouteParams.prototype.get = function(param) {
    return lang_1.normalizeBlank(collection_1.StringMapWrapper.get(this.params, param));
  };
  return RouteParams;
})();
exports.RouteParams = RouteParams;
var Instruction = (function() {
  function Instruction(component, child, auxInstruction) {
    this.component = component;
    this.child = child;
    this.auxInstruction = auxInstruction;
  }
  Instruction.prototype.replaceChild = function(child) {
    return new Instruction(this.component, child, this.auxInstruction);
  };
  return Instruction;
})();
exports.Instruction = Instruction;
var PrimaryInstruction = (function() {
  function PrimaryInstruction(component, child, auxUrls) {
    this.component = component;
    this.child = child;
    this.auxUrls = auxUrls;
  }
  return PrimaryInstruction;
})();
exports.PrimaryInstruction = PrimaryInstruction;
function stringifyInstruction(instruction) {
  return stringifyInstructionPath(instruction) + stringifyInstructionQuery(instruction);
}
exports.stringifyInstruction = stringifyInstruction;
function stringifyInstructionPath(instruction) {
  return instruction.component.urlPath + stringifyAux(instruction) + stringifyPrimary(instruction.child);
}
exports.stringifyInstructionPath = stringifyInstructionPath;
function stringifyInstructionQuery(instruction) {
  return instruction.component.urlParams.length > 0 ? ('?' + instruction.component.urlParams.join('&')) : '';
}
exports.stringifyInstructionQuery = stringifyInstructionQuery;
function stringifyPrimary(instruction) {
  if (lang_1.isBlank(instruction)) {
    return '';
  }
  var params = instruction.component.urlParams.length > 0 ? (';' + instruction.component.urlParams.join(';')) : '';
  return '/' + instruction.component.urlPath + params + stringifyAux(instruction) + stringifyPrimary(instruction.child);
}
function stringifyAux(instruction) {
  var routes = [];
  collection_1.StringMapWrapper.forEach(instruction.auxInstruction, function(auxInstruction, _) {
    routes.push(stringifyPrimary(auxInstruction));
  });
  if (routes.length > 0) {
    return '(' + routes.join('//') + ')';
  }
  return '';
}
var ComponentInstruction = (function() {
  function ComponentInstruction() {
    this.reuse = false;
  }
  Object.defineProperty(ComponentInstruction.prototype, "componentType", {
    get: function() {
      return exceptions_1.unimplemented();
    },
    enumerable: true,
    configurable: true
  });
  ;
  Object.defineProperty(ComponentInstruction.prototype, "specificity", {
    get: function() {
      return exceptions_1.unimplemented();
    },
    enumerable: true,
    configurable: true
  });
  ;
  Object.defineProperty(ComponentInstruction.prototype, "terminal", {
    get: function() {
      return exceptions_1.unimplemented();
    },
    enumerable: true,
    configurable: true
  });
  ;
  return ComponentInstruction;
})();
exports.ComponentInstruction = ComponentInstruction;
var ComponentInstruction_ = (function(_super) {
  __extends(ComponentInstruction_, _super);
  function ComponentInstruction_(urlPath, urlParams, _recognizer, params) {
    if (params === void 0) {
      params = null;
    }
    _super.call(this);
    this._recognizer = _recognizer;
    this.urlPath = urlPath;
    this.urlParams = urlParams;
    this.params = params;
  }
  Object.defineProperty(ComponentInstruction_.prototype, "componentType", {
    get: function() {
      return this._recognizer.handler.componentType;
    },
    enumerable: true,
    configurable: true
  });
  ComponentInstruction_.prototype.resolveComponentType = function() {
    return this._recognizer.handler.resolveComponentType();
  };
  Object.defineProperty(ComponentInstruction_.prototype, "specificity", {
    get: function() {
      return this._recognizer.specificity;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ComponentInstruction_.prototype, "terminal", {
    get: function() {
      return this._recognizer.terminal;
    },
    enumerable: true,
    configurable: true
  });
  ComponentInstruction_.prototype.routeData = function() {
    return this._recognizer.handler.data;
  };
  return ComponentInstruction_;
})(ComponentInstruction);
exports.ComponentInstruction_ = ComponentInstruction_;
