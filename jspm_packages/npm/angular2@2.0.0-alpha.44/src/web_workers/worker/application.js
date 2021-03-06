/* */ 
'use strict';
function __export(m) {
  for (var p in m)
    if (!exports.hasOwnProperty(p))
      exports[p] = m[p];
}
var post_message_bus_1 = require('../shared/post_message_bus');
var application_common_1 = require('./application_common');
__export(require('../shared/message_bus'));
var parse5_adapter_1 = require('../../core/dom/parse5_adapter');
var _postMessage = postMessage;
function bootstrapWebWorker(appComponentType, componentInjectableProviders) {
  if (componentInjectableProviders === void 0) {
    componentInjectableProviders = null;
  }
  parse5_adapter_1.Parse5DomAdapter.makeCurrent();
  var sink = new post_message_bus_1.PostMessageBusSink({postMessage: function(message, transferrables) {
      console.log("Sending", message);
      _postMessage(message, transferrables);
    }});
  var source = new post_message_bus_1.PostMessageBusSource();
  var bus = new post_message_bus_1.PostMessageBus(sink, source);
  return application_common_1.bootstrapWebWorkerCommon(appComponentType, bus, componentInjectableProviders);
}
exports.bootstrapWebWorker = bootstrapWebWorker;
