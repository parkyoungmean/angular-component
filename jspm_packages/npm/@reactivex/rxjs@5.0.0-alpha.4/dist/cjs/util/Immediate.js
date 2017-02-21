/* */ 
(function(process) {
  'use strict';
  exports.__esModule = true;
  var _root = require('./root');
  var Immediate = {
    setImmediate: function setImmediate(x) {
      return 0;
    },
    clearImmediate: function clearImmediate(id) {}
  };
  exports.Immediate = Immediate;
  if (_root.root && _root.root.setImmediate) {
    Immediate.setImmediate = _root.root.setImmediate;
    Immediate.clearImmediate = _root.root.clearImmediate;
  } else {
    exports.Immediate = Immediate = (function(global, Immediate) {
      var nextHandle = 1,
          tasksByHandle = {},
          currentlyRunningATask = false,
          doc = global.document,
          setImmediate = undefined;
      if (({}).toString.call(global.process) === '[object process]') {
        setImmediate = installNextTickImplementation();
      } else if (canUsePostMessage()) {
        setImmediate = installPostMessageImplementation();
      } else if (global.MessageChannel) {
        setImmediate = installMessageChannelImplementation();
      } else if (doc && 'onreadystatechange' in doc.createElement('script')) {
        setImmediate = installReadyStateChangeImplementation();
      } else {
        setImmediate = installSetTimeoutImplementation();
      }
      Immediate.setImmediate = setImmediate;
      Immediate.clearImmediate = clearImmediate;
      return Immediate;
      function clearImmediate(handle) {
        delete tasksByHandle[handle];
      }
      function addFromSetImmediateArguments(args) {
        tasksByHandle[nextHandle] = partiallyApplied.apply(undefined, args);
        return nextHandle++;
      }
      function partiallyApplied(handler) {
        for (var _len = arguments.length,
            args = Array(_len > 1 ? _len - 1 : 0),
            _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }
        return function() {
          if (typeof handler === 'function') {
            handler.apply(undefined, args);
          } else {
            new Function('' + handler)();
          }
        };
      }
      function runIfPresent(handle) {
        if (currentlyRunningATask) {
          setTimeout(partiallyApplied(runIfPresent, handle), 0);
        } else {
          var task = tasksByHandle[handle];
          if (task) {
            currentlyRunningATask = true;
            try {
              task();
            } finally {
              clearImmediate(handle);
              currentlyRunningATask = false;
            }
          }
        }
      }
      function installNextTickImplementation() {
        return function setImmediate() {
          var handle = addFromSetImmediateArguments(arguments);
          global.process.nextTick(partiallyApplied(runIfPresent, handle));
          return handle;
        };
      }
      function canUsePostMessage() {
        if (global.postMessage && !global.importScripts) {
          var postMessageIsAsynchronous = true;
          var oldOnMessage = global.onmessage;
          global.onmessage = function() {
            postMessageIsAsynchronous = false;
          };
          global.postMessage('', '*');
          global.onmessage = oldOnMessage;
          return postMessageIsAsynchronous;
        }
      }
      function installPostMessageImplementation() {
        var messagePrefix = 'setImmediate$' + Math.random() + '$';
        var onGlobalMessage = function onGlobalMessage(event) {
          if (event.source === global && typeof event.data === 'string' && event.data.indexOf(messagePrefix) === 0) {
            runIfPresent(+event.data.slice(messagePrefix.length));
          }
        };
        if (global.addEventListener) {
          global.addEventListener('message', onGlobalMessage, false);
        } else {
          global.attachEvent('onmessage', onGlobalMessage);
        }
        return function setImmediate() {
          var handle = addFromSetImmediateArguments(arguments);
          global.postMessage(messagePrefix + handle, '*');
          return handle;
        };
      }
      function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
          var handle = event.data;
          runIfPresent(handle);
        };
        return function setImmediate() {
          var handle = addFromSetImmediateArguments(arguments);
          channel.port2.postMessage(handle);
          return handle;
        };
      }
      function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        return function setImmediate() {
          var handle = addFromSetImmediateArguments(arguments);
          var script = doc.createElement('script');
          script.onreadystatechange = function() {
            runIfPresent(handle);
            script.onreadystatechange = null;
            html.removeChild(script);
            script = null;
          };
          html.appendChild(script);
          return handle;
        };
      }
      function installSetTimeoutImplementation() {
        return function setImmediate() {
          var handle = addFromSetImmediateArguments(arguments);
          setTimeout(partiallyApplied(runIfPresent, handle), 0);
          return handle;
        };
      }
    })(_root.root, Immediate);
  }
})(require('process'));
