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
var __param = (this && this.__param) || function(paramIndex, decorator) {
  return function(target, key) {
    decorator(target, key, paramIndex);
  };
};
var di_1 = require('../../di');
var render_1 = require('../../render');
var linker_1 = require('../../linker');
var metadata_1 = require('../../metadata');
var async_1 = require('../../facade/async');
var control_value_accessor_1 = require('./control_value_accessor');
var lang_1 = require('../../facade/lang');
var shared_1 = require('./shared');
var SELECT_VALUE_ACCESSOR = lang_1.CONST_EXPR(new di_1.Provider(control_value_accessor_1.NG_VALUE_ACCESSOR, {
  useExisting: di_1.forwardRef(function() {
    return SelectControlValueAccessor;
  }),
  multi: true
}));
var NgSelectOption = (function() {
  function NgSelectOption() {}
  NgSelectOption = __decorate([metadata_1.Directive({selector: 'option'}), __metadata('design:paramtypes', [])], NgSelectOption);
  return NgSelectOption;
})();
exports.NgSelectOption = NgSelectOption;
var SelectControlValueAccessor = (function() {
  function SelectControlValueAccessor(_renderer, _elementRef, query) {
    this._renderer = _renderer;
    this._elementRef = _elementRef;
    this.onChange = function(_) {};
    this.onTouched = function() {};
    this._updateValueWhenListOfOptionsChanges(query);
  }
  SelectControlValueAccessor.prototype.writeValue = function(value) {
    this.value = value;
    shared_1.setProperty(this._renderer, this._elementRef, "value", value);
  };
  SelectControlValueAccessor.prototype.registerOnChange = function(fn) {
    this.onChange = fn;
  };
  SelectControlValueAccessor.prototype.registerOnTouched = function(fn) {
    this.onTouched = fn;
  };
  SelectControlValueAccessor.prototype._updateValueWhenListOfOptionsChanges = function(query) {
    var _this = this;
    async_1.ObservableWrapper.subscribe(query.changes, function(_) {
      return _this.writeValue(_this.value);
    });
  };
  SelectControlValueAccessor = __decorate([metadata_1.Directive({
    selector: 'select[ng-control],select[ng-form-control],select[ng-model]',
    host: {
      '(change)': 'onChange($event.target.value)',
      '(input)': 'onChange($event.target.value)',
      '(blur)': 'onTouched()'
    },
    bindings: [SELECT_VALUE_ACCESSOR]
  }), __param(2, metadata_1.Query(NgSelectOption, {descendants: true})), __metadata('design:paramtypes', [render_1.Renderer, linker_1.ElementRef, linker_1.QueryList])], SelectControlValueAccessor);
  return SelectControlValueAccessor;
})();
exports.SelectControlValueAccessor = SelectControlValueAccessor;
