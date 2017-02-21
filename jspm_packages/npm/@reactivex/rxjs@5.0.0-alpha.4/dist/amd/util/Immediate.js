/* */ 
"format cjs";
(function(process) {
  define(["require", "exports", './root'], function(require, exports, root_1) {
    exports.Immediate = {
      setImmediate: function(x) {
        return 0;
      },
      clearImmediate: function(id) {}
    };
    if (root_1.root && root_1.root.setImmediate) {
      exports.Immediate.setImmediate = root_1.root.setImmediate;
      exports.Immediate.clearImmediate = root_1.root.clearImmediate;
    } else {
      exports.Immediate = (function(global, Immediate) {
        var nextHandle = 1,
            tasksByHandle = {},
            currentlyRunningATask = false,
            doc = global.document,
            setImmediate;
        if ({}.toString.call(global.process) === '[object process]') {
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
          var args = [];
          for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
          }
          return function() {
            if (typeof handler === 'function') {
              handler.apply(undefined, args);
            } else {
              (new Function('' + handler))();
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
          var onGlobalMessage = function(event) {
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
      }(root_1.root, exports.Immediate));
    }
  });
})(require('process'));
