/* */ 
(function(process) {
  ;
  (function(window, undefined) {
    var freeExports = typeof exports == 'object' && exports;
    var freeModule = typeof module == 'object' && module && module.exports == freeExports && module;
    var freeGlobal = typeof global == 'object' && global;
    if (freeGlobal.global === freeGlobal) {
      window = freeGlobal;
    }
    var arrayRef = [],
        objectRef = {};
    var idCounter = 0;
    var indicatorObject = objectRef;
    var oldDash = window._;
    var reEscapedHtml = /&(?:amp|lt|gt|quot|#39);/g;
    var reEmptyStringLeading = /\b__p \+= '';/g,
        reEmptyStringMiddle = /\b(__p \+=) '' \+/g,
        reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;
    var reFlags = /\w*$/;
    var reNative = RegExp('^' + (objectRef.valueOf + '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/valueOf|for [^\]]+/g, '.+?') + '$');
    var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;
    var reInterpolate = /<%=([\s\S]+?)%>/g;
    var reNoMatch = /($^)/;
    var reUnescapedHtml = /[&<>"']/g;
    var reUnescapedString = /['\n\r\t\u2028\u2029\\]/g;
    var templateCounter = 0;
    var ceil = Math.ceil,
        concat = arrayRef.concat,
        floor = Math.floor,
        hasOwnProperty = objectRef.hasOwnProperty,
        push = arrayRef.push,
        toString = objectRef.toString;
    var nativeBind = reNative.test(nativeBind = slice.bind) && nativeBind,
        nativeIsArray = reNative.test(nativeIsArray = Array.isArray) && nativeIsArray,
        nativeIsFinite = window.isFinite,
        nativeIsNaN = window.isNaN,
        nativeKeys = reNative.test(nativeKeys = Object.keys) && nativeKeys,
        nativeMax = Math.max,
        nativeMin = Math.min,
        nativeRandom = Math.random;
    var argsClass = '[object Arguments]',
        arrayClass = '[object Array]',
        boolClass = '[object Boolean]',
        dateClass = '[object Date]',
        funcClass = '[object Function]',
        numberClass = '[object Number]',
        objectClass = '[object Object]',
        regexpClass = '[object RegExp]',
        stringClass = '[object String]';
    var isIeOpera = !!window.attachEvent,
        isV8 = nativeBind && !/\n|true/.test(nativeBind + isIeOpera);
    var isBindFast = nativeBind && !isV8;
    var hasObjectSpliceBug = (hasObjectSpliceBug = {
      '0': 1,
      'length': 1
    }, arrayRef.splice.call(hasObjectSpliceBug, 0, 1), hasObjectSpliceBug[0]);
    var argsAreObjects = arguments.constructor == Object;
    var objectTypes = {
      'boolean': false,
      'function': true,
      'object': true,
      'number': false,
      'string': false,
      'undefined': false
    };
    var stringEscapes = {
      '\\': '\\',
      "'": "'",
      '\n': 'n',
      '\r': 'r',
      '\t': 't',
      '\u2028': 'u2028',
      '\u2029': 'u2029'
    };
    function lodash(value) {
      if (value && typeof value == 'object' && value.__wrapped__) {
        return value;
      }
      if (!(this instanceof lodash)) {
        return new lodash(value);
      }
      this.__wrapped__ = value;
    }
    lodash.templateSettings = {
      'escape': /<%-([\s\S]+?)%>/g,
      'evaluate': /<%([\s\S]+?)%>/g,
      'interpolate': reInterpolate,
      'variable': ''
    };
    function charAtCallback(value) {
      return value.charCodeAt(0);
    }
    function compareAscending(a, b) {
      var ai = a.index,
          bi = b.index;
      a = a.criteria;
      b = b.criteria;
      if (a !== b) {
        if (a > b || typeof a == 'undefined') {
          return 1;
        }
        if (a < b || typeof b == 'undefined') {
          return -1;
        }
      }
      return ai < bi ? -1 : 1;
    }
    function createBound(func, thisArg, partialArgs, rightIndicator) {
      var isFunc = isFunction(func),
          isPartial = !partialArgs,
          key = thisArg;
      if (isPartial) {
        partialArgs = thisArg;
      }
      if (!isFunc) {
        thisArg = func;
      }
      function bound() {
        var args = arguments,
            thisBinding = isPartial ? this : thisArg;
        if (!isFunc) {
          func = thisArg[key];
        }
        if (partialArgs.length) {
          args = args.length ? (args = slice(args), rightIndicator ? args.concat(partialArgs) : partialArgs.concat(args)) : partialArgs;
        }
        if (this instanceof bound) {
          noop.prototype = func.prototype;
          thisBinding = new noop;
          noop.prototype = null;
          var result = func.apply(thisBinding, args);
          return isObject(result) ? result : thisBinding;
        }
        return func.apply(thisBinding, args);
      }
      return bound;
    }
    function createCallback(func, thisArg, argCount) {
      if (func == null) {
        return identity;
      }
      var type = typeof func;
      if (type != 'function') {
        if (type != 'object') {
          return function(object) {
            return object[func];
          };
        }
        var props = keys(func);
        return function(object) {
          var length = props.length,
              result = false;
          while (length--) {
            if (!(result = object[props[length]] === func[props[length]])) {
              break;
            }
          }
          return result;
        };
      }
      if (typeof thisArg != 'undefined') {
        if (argCount === 1) {
          return function(value) {
            return func.call(thisArg, value);
          };
        }
        if (argCount === 2) {
          return function(a, b) {
            return func.call(thisArg, a, b);
          };
        }
        if (argCount === 4) {
          return function(accumulator, value, index, object) {
            return func.call(thisArg, accumulator, value, index, object);
          };
        }
        return function(value, index, object) {
          return func.call(thisArg, value, index, object);
        };
      }
      return func;
    }
    var each = function(collection, callback, thisArg) {
      var index,
          iterable = collection,
          result = iterable;
      if (!iterable)
        return result;
      callback = callback && typeof thisArg == 'undefined' ? callback : createCallback(callback, thisArg);
      var length = iterable.length;
      index = -1;
      if (typeof length == 'number') {
        while (++index < length) {
          if (callback(iterable[index], index, collection) === indicatorObject)
            return result;
        }
      } else {
        for (index in iterable) {
          if (hasOwnProperty.call(iterable, index)) {
            if (callback(iterable[index], index, collection) === indicatorObject)
              return result;
          }
        }
      }
    };
    function escapeStringChar(match) {
      return '\\' + stringEscapes[match];
    }
    function escapeHtmlChar(match) {
      return htmlEscapes[match];
    }
    function isNode(value) {
      return typeof value.toString != 'function' && typeof(value + '') == 'string';
    }
    function noop() {}
    function slice(array, start, end) {
      start || (start = 0);
      if (typeof end == 'undefined') {
        end = array ? array.length : 0;
      }
      var index = -1,
          length = end - start || 0,
          result = Array(length < 0 ? 0 : length);
      while (++index < length) {
        result[index] = array[start + index];
      }
      return result;
    }
    function unescapeHtmlChar(match) {
      return htmlUnescapes[match];
    }
    function isArguments(value) {
      return toString.call(value) == argsClass;
    }
    if (!isArguments(arguments)) {
      isArguments = function(value) {
        return value ? hasOwnProperty.call(value, 'callee') : false;
      };
    }
    var forIn = function(collection, callback) {
      var index,
          iterable = collection,
          result = iterable;
      if (!iterable)
        return result;
      if (!objectTypes[typeof iterable])
        return result;
      callback || (callback = identity);
      for (index in iterable) {
        if (callback(iterable[index], index, collection) === indicatorObject)
          return result;
      }
      return result;
    };
    var forOwn = function(collection, callback) {
      var index,
          iterable = collection,
          result = iterable;
      if (!iterable)
        return result;
      if (!objectTypes[typeof iterable])
        return result;
      callback || (callback = identity);
      for (index in iterable) {
        if (hasOwnProperty.call(iterable, index)) {
          if (callback(iterable[index], index, collection) === indicatorObject)
            return result;
        }
      }
      return result;
    };
    var isArray = nativeIsArray || function(value) {
      return (argsAreObjects && value instanceof Array) || toString.call(value) == arrayClass;
    };
    var keys = !nativeKeys ? shimKeys : function(object) {
      if (!isObject(object)) {
        return [];
      }
      return nativeKeys(object);
    };
    function shimIsPlainObject(value) {
      var result = false;
      if (!(value && typeof value == 'object') || isArguments(value)) {
        return result;
      }
      var ctor = value.constructor;
      if ((!isFunction(ctor)) || ctor instanceof ctor) {
        forIn(value, function(value, key) {
          result = key;
        });
        return result === false || hasOwnProperty.call(value, result);
      }
      return result;
    }
    function shimKeys(object) {
      var result = [];
      forOwn(object, function(value, key) {
        result.push(key);
      });
      return result;
    }
    var htmlEscapes = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    var htmlUnescapes = invert(htmlEscapes);
    function assign(object) {
      if (!object) {
        return object;
      }
      for (var argsIndex = 1,
          argsLength = arguments.length; argsIndex < argsLength; argsIndex++) {
        var iterable = arguments[argsIndex];
        if (iterable) {
          for (var key in iterable) {
            object[key] = iterable[key];
          }
        }
      }
      return object;
    }
    function clone(value) {
      return isObject(value) ? (isArray(value) ? slice(value) : assign({}, value)) : value;
    }
    function defaults(object) {
      if (!object) {
        return object;
      }
      for (var argsIndex = 1,
          argsLength = arguments.length; argsIndex < argsLength; argsIndex++) {
        var iterable = arguments[argsIndex];
        if (iterable) {
          for (var key in iterable) {
            if (object[key] == null) {
              object[key] = iterable[key];
            }
          }
        }
      }
      return object;
    }
    function functions(object) {
      var result = [];
      forIn(object, function(value, key) {
        if (isFunction(value)) {
          result.push(key);
        }
      });
      return result.sort();
    }
    function has(object, property) {
      return object ? hasOwnProperty.call(object, property) : false;
    }
    function invert(object) {
      var index = -1,
          props = keys(object),
          length = props.length,
          result = {};
      while (++index < length) {
        var key = props[index];
        result[object[key]] = key;
      }
      return result;
    }
    function isBoolean(value) {
      return value === true || value === false || toString.call(value) == boolClass;
    }
    function isDate(value) {
      return value instanceof Date || toString.call(value) == dateClass;
    }
    function isElement(value) {
      return value ? value.nodeType === 1 : false;
    }
    function isEmpty(value) {
      if (!value) {
        return true;
      }
      if (isArray(value) || isString(value)) {
        return !value.length;
      }
      for (var key in value) {
        if (hasOwnProperty.call(value, key)) {
          return false;
        }
      }
      return true;
    }
    function isEqual(a, b, stackA, stackB) {
      if (a === b) {
        return a !== 0 || (1 / a == 1 / b);
      }
      var type = typeof a,
          otherType = typeof b;
      if (a === a && (!a || (type != 'function' && type != 'object')) && (!b || (otherType != 'function' && otherType != 'object'))) {
        return false;
      }
      if (a == null || b == null) {
        return a === b;
      }
      var className = toString.call(a),
          otherClass = toString.call(b);
      if (className != otherClass) {
        return false;
      }
      switch (className) {
        case boolClass:
        case dateClass:
          return +a == +b;
        case numberClass:
          return a != +a ? b != +b : (a == 0 ? (1 / a == 1 / b) : a == +b);
        case regexpClass:
        case stringClass:
          return a == b + '';
      }
      var isArr = className == arrayClass;
      if (!isArr) {
        if (a.__wrapped__ || b.__wrapped__) {
          return isEqual(a.__wrapped__ || a, b.__wrapped__ || b, stackA, stackB);
        }
        if (className != objectClass) {
          return false;
        }
        var ctorA = a.constructor,
            ctorB = b.constructor;
        if (ctorA != ctorB && !(isFunction(ctorA) && ctorA instanceof ctorA && isFunction(ctorB) && ctorB instanceof ctorB)) {
          return false;
        }
      }
      stackA || (stackA = []);
      stackB || (stackB = []);
      var length = stackA.length;
      while (length--) {
        if (stackA[length] == a) {
          return stackB[length] == b;
        }
      }
      var result = true,
          size = 0;
      stackA.push(a);
      stackB.push(b);
      if (isArr) {
        size = b.length;
        result = size == a.length;
        if (result) {
          while (size--) {
            if (!(result = isEqual(a[size], b[size], stackA, stackB))) {
              break;
            }
          }
        }
        return result;
      }
      forIn(b, function(value, key, b) {
        if (hasOwnProperty.call(b, key)) {
          size++;
          return !(result = hasOwnProperty.call(a, key) && isEqual(a[key], value, stackA, stackB)) && indicatorObject;
        }
      });
      if (result) {
        forIn(a, function(value, key, a) {
          if (hasOwnProperty.call(a, key)) {
            return !(result = --size > -1) && indicatorObject;
          }
        });
      }
      return result;
    }
    function isFinite(value) {
      return nativeIsFinite(value) && !nativeIsNaN(parseFloat(value));
    }
    function isFunction(value) {
      return typeof value == 'function';
    }
    if (isFunction(/x/)) {
      isFunction = function(value) {
        return value instanceof Function || toString.call(value) == funcClass;
      };
    }
    function isObject(value) {
      return value ? objectTypes[typeof value] : false;
    }
    function isNaN(value) {
      return isNumber(value) && value != +value;
    }
    function isNull(value) {
      return value === null;
    }
    function isNumber(value) {
      return typeof value == 'number' || toString.call(value) == numberClass;
    }
    function isRegExp(value) {
      return value instanceof RegExp || toString.call(value) == regexpClass;
    }
    function isString(value) {
      return typeof value == 'string' || toString.call(value) == stringClass;
    }
    function isUndefined(value) {
      return typeof value == 'undefined';
    }
    function omit(object) {
      var props = concat.apply(arrayRef, arguments),
          result = {};
      forIn(object, function(value, key) {
        if (indexOf(props, key, 1) < 0) {
          result[key] = value;
        }
      });
      return result;
    }
    function pairs(object) {
      var index = -1,
          props = keys(object),
          length = props.length,
          result = Array(length);
      while (++index < length) {
        var key = props[index];
        result[index] = [key, object[key]];
      }
      return result;
    }
    function pick(object) {
      var index = 0,
          props = concat.apply(arrayRef, arguments),
          length = props.length,
          result = {};
      while (++index < length) {
        var prop = props[index];
        if (prop in object) {
          result[prop] = object[prop];
        }
      }
      return result;
    }
    function values(object) {
      var index = -1,
          props = keys(object),
          length = props.length,
          result = Array(length);
      while (++index < length) {
        result[index] = object[props[index]];
      }
      return result;
    }
    function contains(collection, target) {
      var length = collection ? collection.length : 0,
          result = false;
      if (typeof length == 'number') {
        result = indexOf(collection, target) > -1;
      } else {
        each(collection, function(value) {
          return (result = value === target) && indicatorObject;
        });
      }
      return result;
    }
    function countBy(collection, callback, thisArg) {
      var result = {};
      callback = createCallback(callback, thisArg);
      forEach(collection, function(value, key, collection) {
        key = callback(value, key, collection) + '';
        (hasOwnProperty.call(result, key) ? result[key]++ : result[key] = 1);
      });
      return result;
    }
    function every(collection, callback, thisArg) {
      var result = true;
      callback = createCallback(callback, thisArg);
      if (isArray(collection)) {
        var index = -1,
            length = collection.length;
        while (++index < length) {
          if (!(result = !!callback(collection[index], index, collection))) {
            break;
          }
        }
      } else {
        each(collection, function(value, index, collection) {
          return !(result = !!callback(value, index, collection)) && indicatorObject;
        });
      }
      return result;
    }
    function filter(collection, callback, thisArg) {
      var result = [];
      callback = createCallback(callback, thisArg);
      if (isArray(collection)) {
        var index = -1,
            length = collection.length;
        while (++index < length) {
          var value = collection[index];
          if (callback(value, index, collection)) {
            result.push(value);
          }
        }
      } else {
        each(collection, function(value, index, collection) {
          if (callback(value, index, collection)) {
            result.push(value);
          }
        });
      }
      return result;
    }
    function find(collection, callback, thisArg) {
      var result;
      callback = createCallback(callback, thisArg);
      forEach(collection, function(value, index, collection) {
        if (callback(value, index, collection)) {
          result = value;
          return indicatorObject;
        }
      });
      return result;
    }
    function findWhere(object, properties) {
      return where(object, properties, true);
    }
    function forEach(collection, callback, thisArg) {
      if (callback && typeof thisArg == 'undefined' && isArray(collection)) {
        var index = -1,
            length = collection.length;
        while (++index < length) {
          if (callback(collection[index], index, collection) === indicatorObject) {
            break;
          }
        }
      } else {
        each(collection, callback, thisArg);
      }
      ;
    }
    function groupBy(collection, callback, thisArg) {
      var result = {};
      callback = createCallback(callback, thisArg);
      forEach(collection, function(value, key, collection) {
        key = callback(value, key, collection) + '';
        (hasOwnProperty.call(result, key) ? result[key] : result[key] = []).push(value);
      });
      return result;
    }
    function invoke(collection, methodName) {
      var args = slice(arguments, 2),
          index = -1,
          isFunc = typeof methodName == 'function',
          length = collection ? collection.length : 0,
          result = Array(typeof length == 'number' ? length : 0);
      forEach(collection, function(value) {
        result[++index] = (isFunc ? methodName : value[methodName]).apply(value, args);
      });
      return result;
    }
    function map(collection, callback, thisArg) {
      var index = -1,
          length = collection ? collection.length : 0,
          result = Array(typeof length == 'number' ? length : 0);
      callback = createCallback(callback, thisArg);
      if (isArray(collection)) {
        while (++index < length) {
          result[index] = callback(collection[index], index, collection);
        }
      } else {
        each(collection, function(value, key, collection) {
          result[++index] = callback(value, key, collection);
        });
      }
      return result;
    }
    function max(collection, callback, thisArg) {
      var computed = -Infinity,
          result = computed;
      if (!callback && isArray(collection)) {
        var index = -1,
            length = collection.length;
        while (++index < length) {
          var value = collection[index];
          if (value > result) {
            result = value;
          }
        }
      } else {
        callback = createCallback(callback, thisArg);
        each(collection, function(value, index, collection) {
          var current = callback(value, index, collection);
          if (current > computed) {
            computed = current;
            result = value;
          }
        });
      }
      return result;
    }
    function min(collection, callback, thisArg) {
      var computed = Infinity,
          result = computed;
      if (!callback && isArray(collection)) {
        var index = -1,
            length = collection.length;
        while (++index < length) {
          var value = collection[index];
          if (value < result) {
            result = value;
          }
        }
      } else {
        callback = createCallback(callback, thisArg);
        each(collection, function(value, index, collection) {
          var current = callback(value, index, collection);
          if (current < computed) {
            computed = current;
            result = value;
          }
        });
      }
      return result;
    }
    var pluck = map;
    function reduce(collection, callback, accumulator, thisArg) {
      var noaccum = arguments.length < 3;
      callback = createCallback(callback, thisArg, 4);
      if (isArray(collection)) {
        var index = -1,
            length = collection.length;
        if (noaccum) {
          accumulator = collection[++index];
        }
        while (++index < length) {
          accumulator = callback(accumulator, collection[index], index, collection);
        }
      } else {
        each(collection, function(value, index, collection) {
          accumulator = noaccum ? (noaccum = false, value) : callback(accumulator, value, index, collection);
        });
      }
      return accumulator;
    }
    function reduceRight(collection, callback, accumulator, thisArg) {
      var iterable = collection,
          length = collection ? collection.length : 0,
          noaccum = arguments.length < 3;
      if (typeof length != 'number') {
        var props = keys(collection);
        length = props.length;
      }
      callback = createCallback(callback, thisArg, 4);
      forEach(collection, function(value, index, collection) {
        index = props ? props[--length] : --length;
        accumulator = noaccum ? (noaccum = false, iterable[index]) : callback(accumulator, iterable[index], index, collection);
      });
      return accumulator;
    }
    function reject(collection, callback, thisArg) {
      callback = createCallback(callback, thisArg);
      return filter(collection, function(value, index, collection) {
        return !callback(value, index, collection);
      });
    }
    function shuffle(collection) {
      var index = -1,
          length = collection ? collection.length : 0,
          result = Array(typeof length == 'number' ? length : 0);
      forEach(collection, function(value) {
        var rand = floor(nativeRandom() * (++index + 1));
        result[index] = result[rand];
        result[rand] = value;
      });
      return result;
    }
    function size(collection) {
      var length = collection ? collection.length : 0;
      return typeof length == 'number' ? length : keys(collection).length;
    }
    function some(collection, callback, thisArg) {
      var result;
      callback = createCallback(callback, thisArg);
      if (isArray(collection)) {
        var index = -1,
            length = collection.length;
        while (++index < length) {
          if ((result = callback(collection[index], index, collection))) {
            break;
          }
        }
      } else {
        each(collection, function(value, index, collection) {
          return (result = callback(value, index, collection)) && indicatorObject;
        });
      }
      return !!result;
    }
    function sortBy(collection, callback, thisArg) {
      var index = -1,
          length = collection ? collection.length : 0,
          result = Array(typeof length == 'number' ? length : 0);
      callback = createCallback(callback, thisArg);
      forEach(collection, function(value, key, collection) {
        result[++index] = {
          'criteria': callback(value, key, collection),
          'index': index,
          'value': value
        };
      });
      length = result.length;
      result.sort(compareAscending);
      while (length--) {
        result[length] = result[length].value;
      }
      return result;
    }
    function toArray(collection) {
      if (collection && typeof collection.length == 'number') {
        return slice(collection);
      }
      return values(collection);
    }
    function where(collection, properties, first) {
      return (first && isEmpty(properties)) ? null : (first ? find : filter)(collection, properties);
    }
    function compact(array) {
      var index = -1,
          length = array ? array.length : 0,
          result = [];
      while (++index < length) {
        var value = array[index];
        if (value) {
          result.push(value);
        }
      }
      return result;
    }
    function difference(array) {
      var index = -1,
          length = array.length,
          flattened = concat.apply(arrayRef, arguments),
          result = [];
      while (++index < length) {
        var value = array[index];
        if (indexOf(flattened, value, length) < 0) {
          result.push(value);
        }
      }
      return result;
    }
    function first(array, callback, thisArg) {
      if (array) {
        var n = 0,
            length = array.length;
        if (typeof callback != 'number' && callback != null) {
          var index = -1;
          callback = createCallback(callback, thisArg);
          while (++index < length && callback(array[index], index, array)) {
            n++;
          }
        } else {
          n = callback;
          if (n == null || thisArg) {
            return array[0];
          }
        }
        return slice(array, 0, nativeMin(nativeMax(0, n), length));
      }
    }
    function flatten(array, shallow) {
      var index = -1,
          length = array ? array.length : 0,
          result = [];
      while (++index < length) {
        var value = array[index];
        if (isArray(value)) {
          push.apply(result, shallow ? value : flatten(value));
        } else {
          result.push(value);
        }
      }
      return result;
    }
    function indexOf(array, value, fromIndex) {
      var index = -1,
          length = array ? array.length : 0;
      if (typeof fromIndex == 'number') {
        index = (fromIndex < 0 ? nativeMax(0, length + fromIndex) : fromIndex || 0) - 1;
      } else if (fromIndex) {
        index = sortedIndex(array, value);
        return array[index] === value ? index : -1;
      }
      while (++index < length) {
        if (array[index] === value) {
          return index;
        }
      }
      return -1;
    }
    function initial(array, callback, thisArg) {
      if (!array) {
        return [];
      }
      var n = 0,
          length = array.length;
      if (typeof callback != 'number' && callback != null) {
        var index = length;
        callback = createCallback(callback, thisArg);
        while (index-- && callback(array[index], index, array)) {
          n++;
        }
      } else {
        n = (callback == null || thisArg) ? 1 : callback || n;
      }
      return slice(array, 0, nativeMin(nativeMax(0, length - n), length));
    }
    function intersection(array) {
      var args = arguments,
          argsLength = args.length,
          index = -1,
          length = array ? array.length : 0,
          result = [];
      outer: while (++index < length) {
        var value = array[index];
        if (indexOf(result, value) < 0) {
          var argsIndex = argsLength;
          while (--argsIndex) {
            if (indexOf(args[argsIndex], value) < 0) {
              continue outer;
            }
          }
          result.push(value);
        }
      }
      return result;
    }
    function last(array, callback, thisArg) {
      if (array) {
        var n = 0,
            length = array.length;
        if (typeof callback != 'number' && callback != null) {
          var index = length;
          callback = createCallback(callback, thisArg);
          while (index-- && callback(array[index], index, array)) {
            n++;
          }
        } else {
          n = callback;
          if (n == null || thisArg) {
            return array[length - 1];
          }
        }
        return slice(array, nativeMax(0, length - n));
      }
    }
    function lastIndexOf(array, value, fromIndex) {
      var index = array ? array.length : 0;
      if (typeof fromIndex == 'number') {
        index = (fromIndex < 0 ? nativeMax(0, index + fromIndex) : nativeMin(fromIndex, index - 1)) + 1;
      }
      while (index--) {
        if (array[index] === value) {
          return index;
        }
      }
      return -1;
    }
    function object(keys, values) {
      var index = -1,
          length = keys ? keys.length : 0,
          result = {};
      while (++index < length) {
        var key = keys[index];
        if (values) {
          result[key] = values[index];
        } else {
          result[key[0]] = key[1];
        }
      }
      return result;
    }
    function range(start, end, step) {
      start = +start || 0;
      step = +step || 1;
      if (end == null) {
        end = start;
        start = 0;
      }
      var index = -1,
          length = nativeMax(0, ceil((end - start) / step)),
          result = Array(length);
      while (++index < length) {
        result[index] = start;
        start += step;
      }
      return result;
    }
    function rest(array, callback, thisArg) {
      if (typeof callback != 'number' && callback != null) {
        var n = 0,
            index = -1,
            length = array ? array.length : 0;
        callback = createCallback(callback, thisArg);
        while (++index < length && callback(array[index], index, array)) {
          n++;
        }
      } else {
        n = (callback == null || thisArg) ? 1 : nativeMax(0, callback);
      }
      return slice(array, n);
    }
    function sortedIndex(array, value, callback, thisArg) {
      var low = 0,
          high = array ? array.length : low;
      callback = callback ? createCallback(callback, thisArg, 1) : identity;
      value = callback(value);
      while (low < high) {
        var mid = (low + high) >>> 1;
        callback(array[mid]) < value ? low = mid + 1 : high = mid;
      }
      return low;
    }
    function union() {
      return uniq(concat.apply(arrayRef, arguments));
    }
    function uniq(array, isSorted, callback, thisArg) {
      var index = -1,
          length = array ? array.length : 0,
          result = [],
          seen = result;
      if (typeof isSorted == 'function') {
        thisArg = callback;
        callback = isSorted;
        isSorted = false;
      }
      if (callback) {
        seen = [];
        callback = createCallback(callback, thisArg);
      }
      while (++index < length) {
        var value = array[index],
            computed = callback ? callback(value, index, array) : value;
        if (isSorted ? !index || seen[seen.length - 1] !== computed : indexOf(seen, computed) < 0) {
          if (callback) {
            seen.push(computed);
          }
          result.push(value);
        }
      }
      return result;
    }
    function without(array) {
      var index = -1,
          length = array.length,
          result = [];
      while (++index < length) {
        var value = array[index];
        if (indexOf(arguments, value, 1) < 0) {
          result.push(value);
        }
      }
      return result;
    }
    function zip(array) {
      var index = -1,
          length = array ? max(pluck(arguments, 'length')) : 0,
          result = Array(length);
      while (++index < length) {
        result[index] = pluck(arguments, index);
      }
      return result;
    }
    function after(n, func) {
      if (n < 1) {
        return func();
      }
      return function() {
        if (--n < 1) {
          return func.apply(this, arguments);
        }
      };
    }
    function bind(func, thisArg) {
      return isBindFast || (nativeBind && arguments.length > 2) ? nativeBind.call.apply(nativeBind, arguments) : createBound(func, thisArg, slice(arguments, 2));
    }
    function bindAll(object) {
      var funcs = concat.apply(arrayRef, arguments),
          index = funcs.length > 1 ? 0 : (funcs = functions(object), -1),
          length = funcs.length;
      while (++index < length) {
        var key = funcs[index];
        object[key] = bind(object[key], object);
      }
      return object;
    }
    function compose() {
      var funcs = arguments;
      return function() {
        var args = arguments,
            length = funcs.length;
        while (length--) {
          args = [funcs[length].apply(this, args)];
        }
        return args[0];
      };
    }
    function debounce(func, wait, immediate) {
      var args,
          result,
          thisArg,
          timeoutId;
      function delayed() {
        timeoutId = null;
        if (!immediate) {
          result = func.apply(thisArg, args);
        }
      }
      return function() {
        var isImmediate = immediate && !timeoutId;
        args = arguments;
        thisArg = this;
        clearTimeout(timeoutId);
        timeoutId = setTimeout(delayed, wait);
        if (isImmediate) {
          result = func.apply(thisArg, args);
        }
        return result;
      };
    }
    function delay(func, wait) {
      var args = slice(arguments, 2);
      return setTimeout(function() {
        func.apply(undefined, args);
      }, wait);
    }
    function defer(func) {
      var args = slice(arguments, 1);
      return setTimeout(function() {
        func.apply(undefined, args);
      }, 1);
    }
    if (isV8 && freeModule && typeof setImmediate == 'function') {
      defer = bind(setImmediate, window);
    }
    function memoize(func, resolver) {
      var cache = {};
      return function() {
        var key = (resolver ? resolver.apply(this, arguments) : arguments[0]) + '';
        return hasOwnProperty.call(cache, key) ? cache[key] : (cache[key] = func.apply(this, arguments));
      };
    }
    function once(func) {
      var ran,
          result;
      return function() {
        if (ran) {
          return result;
        }
        ran = true;
        result = func.apply(this, arguments);
        func = null;
        return result;
      };
    }
    function partial(func) {
      return createBound(func, slice(arguments, 1));
    }
    function throttle(func, wait) {
      var args,
          result,
          thisArg,
          timeoutId,
          lastCalled = 0;
      function trailingCall() {
        lastCalled = new Date;
        timeoutId = null;
        result = func.apply(thisArg, args);
      }
      return function() {
        var now = new Date,
            remaining = wait - (now - lastCalled);
        args = arguments;
        thisArg = this;
        if (remaining <= 0) {
          clearTimeout(timeoutId);
          timeoutId = null;
          lastCalled = now;
          result = func.apply(thisArg, args);
        } else if (!timeoutId) {
          timeoutId = setTimeout(trailingCall, remaining);
        }
        return result;
      };
    }
    function wrap(value, wrapper) {
      return function() {
        var args = [value];
        push.apply(args, arguments);
        return wrapper.apply(this, args);
      };
    }
    function escape(string) {
      return string == null ? '' : (string + '').replace(reUnescapedHtml, escapeHtmlChar);
    }
    function identity(value) {
      return value;
    }
    function mixin(object) {
      forEach(functions(object), function(methodName) {
        var func = lodash[methodName] = object[methodName];
        lodash.prototype[methodName] = function() {
          var args = [this.__wrapped__];
          push.apply(args, arguments);
          var result = func.apply(lodash, args);
          if (this.__chain__) {
            result = new lodash(result);
            result.__chain__ = true;
          }
          return result;
        };
      });
    }
    function noConflict() {
      window._ = oldDash;
      return this;
    }
    function random(min, max) {
      if (min == null && max == null) {
        max = 1;
      }
      min = +min || 0;
      if (max == null) {
        max = min;
        min = 0;
      }
      return min + floor(nativeRandom() * ((+max || 0) - min + 1));
    }
    function result(object, property) {
      var value = object ? object[property] : null;
      return isFunction(value) ? object[property]() : value;
    }
    function template(text, data, options) {
      text || (text = '');
      options = defaults({}, options, lodash.templateSettings);
      var index = 0,
          source = "__p += '",
          variable = options.variable;
      var reDelimiters = RegExp((options.escape || reNoMatch).source + '|' + (options.interpolate || reNoMatch).source + '|' + (options.evaluate || reNoMatch).source + '|$', 'g');
      text.replace(reDelimiters, function(match, escapeValue, interpolateValue, evaluateValue, offset) {
        source += text.slice(index, offset).replace(reUnescapedString, escapeStringChar);
        if (escapeValue) {
          source += "' +\n_.escape(" + escapeValue + ") +\n'";
        }
        if (evaluateValue) {
          source += "';\n" + evaluateValue + ";\n__p += '";
        }
        if (interpolateValue) {
          source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";
        }
        index = offset + match.length;
        return match;
      });
      source += "';\n";
      if (!variable) {
        variable = 'obj';
        source = 'with (' + variable + ' || {}) {\n' + source + '\n}\n';
      }
      source = 'function(' + variable + ') {\n' + "var __t, __p = '', __j = Array.prototype.join;\n" + "function print() { __p += __j.call(arguments, '') }\n" + source + 'return __p\n}';
      try {
        var result = Function('_', 'return ' + source)(lodash);
      } catch (e) {
        e.source = source;
        throw e;
      }
      if (data) {
        return result(data);
      }
      result.source = source;
      return result;
    }
    function times(n, callback, thisArg) {
      n = +n || 0;
      var index = -1,
          result = Array(n);
      while (++index < n) {
        result[index] = callback.call(thisArg, index);
      }
      return result;
    }
    function unescape(string) {
      return string == null ? '' : (string + '').replace(reEscapedHtml, unescapeHtmlChar);
    }
    function uniqueId(prefix) {
      var id = ++idCounter + '';
      return prefix ? prefix + id : id;
    }
    function chain(value) {
      value = new lodash(value);
      value.__chain__ = true;
      return value;
    }
    function tap(value, interceptor) {
      interceptor(value);
      return value;
    }
    function wrapperChain() {
      this.__chain__ = true;
      return this;
    }
    function wrapperToString() {
      return this.__wrapped__ + '';
    }
    function wrapperValueOf() {
      return this.__wrapped__;
    }
    lodash.after = after;
    lodash.bind = bind;
    lodash.bindAll = bindAll;
    lodash.compact = compact;
    lodash.compose = compose;
    lodash.countBy = countBy;
    lodash.debounce = debounce;
    lodash.defaults = defaults;
    lodash.defer = defer;
    lodash.delay = delay;
    lodash.difference = difference;
    lodash.filter = filter;
    lodash.flatten = flatten;
    lodash.forEach = forEach;
    lodash.functions = functions;
    lodash.groupBy = groupBy;
    lodash.initial = initial;
    lodash.intersection = intersection;
    lodash.invert = invert;
    lodash.invoke = invoke;
    lodash.keys = keys;
    lodash.map = map;
    lodash.max = max;
    lodash.memoize = memoize;
    lodash.min = min;
    lodash.object = object;
    lodash.omit = omit;
    lodash.once = once;
    lodash.pairs = pairs;
    lodash.partial = partial;
    lodash.pick = pick;
    lodash.pluck = pluck;
    lodash.range = range;
    lodash.reject = reject;
    lodash.rest = rest;
    lodash.shuffle = shuffle;
    lodash.sortBy = sortBy;
    lodash.tap = tap;
    lodash.throttle = throttle;
    lodash.times = times;
    lodash.toArray = toArray;
    lodash.union = union;
    lodash.uniq = uniq;
    lodash.values = values;
    lodash.where = where;
    lodash.without = without;
    lodash.wrap = wrap;
    lodash.zip = zip;
    lodash.collect = map;
    lodash.drop = rest;
    lodash.each = forEach;
    lodash.extend = assign;
    lodash.methods = functions;
    lodash.select = filter;
    lodash.tail = rest;
    lodash.unique = uniq;
    lodash.clone = clone;
    lodash.contains = contains;
    lodash.escape = escape;
    lodash.every = every;
    lodash.find = find;
    lodash.findWhere = findWhere;
    lodash.has = has;
    lodash.identity = identity;
    lodash.indexOf = indexOf;
    lodash.isArguments = isArguments;
    lodash.isArray = isArray;
    lodash.isBoolean = isBoolean;
    lodash.isDate = isDate;
    lodash.isElement = isElement;
    lodash.isEmpty = isEmpty;
    lodash.isEqual = isEqual;
    lodash.isFinite = isFinite;
    lodash.isFunction = isFunction;
    lodash.isNaN = isNaN;
    lodash.isNull = isNull;
    lodash.isNumber = isNumber;
    lodash.isObject = isObject;
    lodash.isRegExp = isRegExp;
    lodash.isString = isString;
    lodash.isUndefined = isUndefined;
    lodash.lastIndexOf = lastIndexOf;
    lodash.mixin = mixin;
    lodash.noConflict = noConflict;
    lodash.random = random;
    lodash.reduce = reduce;
    lodash.reduceRight = reduceRight;
    lodash.result = result;
    lodash.size = size;
    lodash.some = some;
    lodash.sortedIndex = sortedIndex;
    lodash.template = template;
    lodash.unescape = unescape;
    lodash.uniqueId = uniqueId;
    lodash.all = every;
    lodash.any = some;
    lodash.detect = find;
    lodash.foldl = reduce;
    lodash.foldr = reduceRight;
    lodash.include = contains;
    lodash.inject = reduce;
    lodash.first = first;
    lodash.last = last;
    lodash.take = first;
    lodash.head = first;
    lodash.chain = chain;
    lodash.VERSION = '1.0.1';
    mixin(lodash);
    lodash.prototype.chain = wrapperChain;
    lodash.prototype.value = wrapperValueOf;
    each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(methodName) {
      var func = arrayRef[methodName];
      lodash.prototype[methodName] = function() {
        var value = this.__wrapped__;
        func.apply(value, arguments);
        if (hasObjectSpliceBug && value.length === 0) {
          delete value[0];
        }
        return this;
      };
    });
    each(['concat', 'join', 'slice'], function(methodName) {
      var func = arrayRef[methodName];
      lodash.prototype[methodName] = function() {
        var value = this.__wrapped__,
            result = func.apply(value, arguments);
        if (this.__chain__) {
          result = new lodash(result);
          result.__chain__ = true;
        }
        return result;
      };
    });
    if (freeExports) {
      if (freeModule) {
        (freeModule.exports = lodash)._ = lodash;
      } else {
        freeExports._ = lodash;
      }
    } else {
      window._ = lodash;
    }
  }(this));
})(require('process'));
