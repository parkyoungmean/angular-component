/* */ 
'use strict';
var ng = require('./angular2');
var router = require('./router');
var http = require('./http');
var _prevNg = window.ng;
window.ng = ng;
window.ngRouter = router;
window.ngHttp = http;
ng.noConflict = function() {
  window.ng = _prevNg;
  return ng;
};
