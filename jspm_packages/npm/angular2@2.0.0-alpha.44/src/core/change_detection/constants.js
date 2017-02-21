/* */ 
'use strict';
var lang_1 = require('../facade/lang');
(function(ChangeDetectionStrategy) {
  ChangeDetectionStrategy[ChangeDetectionStrategy["CheckOnce"] = 0] = "CheckOnce";
  ChangeDetectionStrategy[ChangeDetectionStrategy["Checked"] = 1] = "Checked";
  ChangeDetectionStrategy[ChangeDetectionStrategy["CheckAlways"] = 2] = "CheckAlways";
  ChangeDetectionStrategy[ChangeDetectionStrategy["Detached"] = 3] = "Detached";
  ChangeDetectionStrategy[ChangeDetectionStrategy["OnPush"] = 4] = "OnPush";
  ChangeDetectionStrategy[ChangeDetectionStrategy["Default"] = 5] = "Default";
  ChangeDetectionStrategy[ChangeDetectionStrategy["OnPushObserve"] = 6] = "OnPushObserve";
})(exports.ChangeDetectionStrategy || (exports.ChangeDetectionStrategy = {}));
var ChangeDetectionStrategy = exports.ChangeDetectionStrategy;
exports.CHANGE_DECTION_STRATEGY_VALUES = [ChangeDetectionStrategy.CheckOnce, ChangeDetectionStrategy.Checked, ChangeDetectionStrategy.CheckAlways, ChangeDetectionStrategy.Detached, ChangeDetectionStrategy.OnPush, ChangeDetectionStrategy.Default, ChangeDetectionStrategy.OnPushObserve];
function isDefaultChangeDetectionStrategy(changeDetectionStrategy) {
  return lang_1.isBlank(changeDetectionStrategy) || changeDetectionStrategy === ChangeDetectionStrategy.Default;
}
exports.isDefaultChangeDetectionStrategy = isDefaultChangeDetectionStrategy;
