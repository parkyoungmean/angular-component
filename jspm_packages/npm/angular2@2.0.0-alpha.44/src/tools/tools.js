/* */ 
'use strict';
var lang_1 = require('../core/facade/lang');
var common_tools_1 = require('./common_tools');
var context = lang_1.global;
function enableDebugTools(ref) {
  context.ng = new common_tools_1.AngularTools(ref);
}
exports.enableDebugTools = enableDebugTools;
function disableDebugTools() {
  context.ng = undefined;
}
exports.disableDebugTools = disableDebugTools;
