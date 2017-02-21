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
var lang_1 = require('../../facade/lang');
var collection_1 = require('../../facade/collection');
var async_1 = require('../../facade/async');
var metadata_1 = require('../../metadata');
var di_1 = require('../../di');
var control_container_1 = require('./control_container');
var shared_1 = require('./shared');
var formDirectiveProvider = lang_1.CONST_EXPR(new di_1.Provider(control_container_1.ControlContainer, {useExisting: di_1.forwardRef(function() {
    return NgFormModel;
  })}));
var NgFormModel = (function(_super) {
  __extends(NgFormModel, _super);
  function NgFormModel() {
    _super.apply(this, arguments);
    this.form = null;
    this.directives = [];
    this.ngSubmit = new async_1.EventEmitter();
  }
  NgFormModel.prototype.onChanges = function(_) {
    this._updateDomValue();
  };
  Object.defineProperty(NgFormModel.prototype, "formDirective", {
    get: function() {
      return this;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(NgFormModel.prototype, "control", {
    get: function() {
      return this.form;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(NgFormModel.prototype, "path", {
    get: function() {
      return [];
    },
    enumerable: true,
    configurable: true
  });
  NgFormModel.prototype.addControl = function(dir) {
    var ctrl = this.form.find(dir.path);
    shared_1.setUpControl(ctrl, dir);
    ctrl.updateValidity();
    this.directives.push(dir);
  };
  NgFormModel.prototype.getControl = function(dir) {
    return this.form.find(dir.path);
  };
  NgFormModel.prototype.removeControl = function(dir) {
    collection_1.ListWrapper.remove(this.directives, dir);
  };
  NgFormModel.prototype.addControlGroup = function(dir) {};
  NgFormModel.prototype.removeControlGroup = function(dir) {};
  NgFormModel.prototype.getControlGroup = function(dir) {
    return this.form.find(dir.path);
  };
  NgFormModel.prototype.updateModel = function(dir, value) {
    var ctrl = this.form.find(dir.path);
    ctrl.updateValue(value);
  };
  NgFormModel.prototype.onSubmit = function() {
    async_1.ObservableWrapper.callNext(this.ngSubmit, null);
    return false;
  };
  NgFormModel.prototype._updateDomValue = function() {
    var _this = this;
    this.directives.forEach(function(dir) {
      var ctrl = _this.form.find(dir.path);
      dir.valueAccessor.writeValue(ctrl.value);
    });
  };
  NgFormModel = __decorate([metadata_1.Directive({
    selector: '[ng-form-model]',
    bindings: [formDirectiveProvider],
    inputs: ['form: ng-form-model'],
    host: {'(submit)': 'onSubmit()'},
    outputs: ['ngSubmit'],
    exportAs: 'form'
  }), __metadata('design:paramtypes', [])], NgFormModel);
  return NgFormModel;
})(control_container_1.ControlContainer);
exports.NgFormModel = NgFormModel;
