/* */ 
'use strict';
var lang_1 = require('../facade/lang');
function setRootDomAdapter(adapter) {
  if (lang_1.isBlank(exports.DOM)) {
    exports.DOM = adapter;
  }
}
exports.setRootDomAdapter = setRootDomAdapter;
var DomAdapter = (function() {
  function DomAdapter() {}
  return DomAdapter;
})();
exports.DomAdapter = DomAdapter;
