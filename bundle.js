/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 12);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module, global, process) {var __WEBPACK_AMD_DEFINE_RESULT__;// Copyright (c) Microsoft, All rights reserved. See License.txt in the project root for license information.

;(function (undefined) {

  var objectTypes = {
    'function': true,
    'object': true
  };

  function checkGlobal(value) {
    return (value && value.Object === Object) ? value : null;
  }

  var freeExports = (objectTypes[typeof exports] && exports && !exports.nodeType) ? exports : null;
  var freeModule = (objectTypes[typeof module] && module && !module.nodeType) ? module : null;
  var freeGlobal = checkGlobal(freeExports && freeModule && typeof global === 'object' && global);
  var freeSelf = checkGlobal(objectTypes[typeof self] && self);
  var freeWindow = checkGlobal(objectTypes[typeof window] && window);
  var moduleExports = (freeModule && freeModule.exports === freeExports) ? freeExports : null;
  var thisGlobal = checkGlobal(objectTypes[typeof this] && this);
  var root = freeGlobal || ((freeWindow !== (thisGlobal && thisGlobal.window)) && freeWindow) || freeSelf || thisGlobal || Function('return this')();

  var Rx = {
    internals: {},
    config: {
      Promise: root.Promise
    },
    helpers: { }
  };

  // Defaults
  var noop = Rx.helpers.noop = function () { },
    identity = Rx.helpers.identity = function (x) { return x; },
    defaultNow = Rx.helpers.defaultNow = Date.now,
    defaultComparer = Rx.helpers.defaultComparer = function (x, y) { return isEqual(x, y); },
    defaultSubComparer = Rx.helpers.defaultSubComparer = function (x, y) { return x > y ? 1 : (x < y ? -1 : 0); },
    defaultKeySerializer = Rx.helpers.defaultKeySerializer = function (x) { return x.toString(); },
    defaultError = Rx.helpers.defaultError = function (err) { throw err; },
    isPromise = Rx.helpers.isPromise = function (p) { return !!p && typeof p.subscribe !== 'function' && typeof p.then === 'function'; },
    isFunction = Rx.helpers.isFunction = (function () {

      var isFn = function (value) {
        return typeof value == 'function' || false;
      };

      // fallback for older versions of Chrome and Safari
      if (isFn(/x/)) {
        isFn = function(value) {
          return typeof value == 'function' && toString.call(value) == '[object Function]';
        };
      }

      return isFn;
    }());

    function cloneArray(arr) {
      var len = arr.length, a = new Array(len);
      for(var i = 0; i < len; i++) { a[i] = arr[i]; }
      return a;
    }

  var errorObj = {e: {}};
  
  function tryCatcherGen(tryCatchTarget) {
    return function tryCatcher() {
      try {
        return tryCatchTarget.apply(this, arguments);
      } catch (e) {
        errorObj.e = e;
        return errorObj;
      }
    };
  }

  var tryCatch = Rx.internals.tryCatch = function tryCatch(fn) {
    if (!isFunction(fn)) { throw new TypeError('fn must be a function'); }
    return tryCatcherGen(fn);
  };

  function thrower(e) {
    throw e;
  }

  Rx.config.longStackSupport = false;
  var hasStacks = false, stacks = tryCatch(function () { throw new Error(); })();
  hasStacks = !!stacks.e && !!stacks.e.stack;

  // All code after this point will be filtered from stack traces reported by RxJS
  var rStartingLine = captureLine(), rFileName;

  var STACK_JUMP_SEPARATOR = 'From previous event:';

  function makeStackTraceLong(error, observable) {
    // If possible, transform the error stack trace by removing Node and RxJS
    // cruft, then concatenating with the stack trace of `observable`.
    if (hasStacks &&
        observable.stack &&
        typeof error === 'object' &&
        error !== null &&
        error.stack &&
        error.stack.indexOf(STACK_JUMP_SEPARATOR) === -1
    ) {
      var stacks = [];
      for (var o = observable; !!o; o = o.source) {
        if (o.stack) {
          stacks.unshift(o.stack);
        }
      }
      stacks.unshift(error.stack);

      var concatedStacks = stacks.join('\n' + STACK_JUMP_SEPARATOR + '\n');
      error.stack = filterStackString(concatedStacks);
    }
  }

  function filterStackString(stackString) {
    var lines = stackString.split('\n'), desiredLines = [];
    for (var i = 0, len = lines.length; i < len; i++) {
      var line = lines[i];

      if (!isInternalFrame(line) && !isNodeFrame(line) && line) {
        desiredLines.push(line);
      }
    }
    return desiredLines.join('\n');
  }

  function isInternalFrame(stackLine) {
    var fileNameAndLineNumber = getFileNameAndLineNumber(stackLine);
    if (!fileNameAndLineNumber) {
      return false;
    }
    var fileName = fileNameAndLineNumber[0], lineNumber = fileNameAndLineNumber[1];

    return fileName === rFileName &&
      lineNumber >= rStartingLine &&
      lineNumber <= rEndingLine;
  }

  function isNodeFrame(stackLine) {
    return stackLine.indexOf('(module.js:') !== -1 ||
      stackLine.indexOf('(node.js:') !== -1;
  }

  function captureLine() {
    if (!hasStacks) { return; }

    try {
      throw new Error();
    } catch (e) {
      var lines = e.stack.split('\n');
      var firstLine = lines[0].indexOf('@') > 0 ? lines[1] : lines[2];
      var fileNameAndLineNumber = getFileNameAndLineNumber(firstLine);
      if (!fileNameAndLineNumber) { return; }

      rFileName = fileNameAndLineNumber[0];
      return fileNameAndLineNumber[1];
    }
  }

  function getFileNameAndLineNumber(stackLine) {
    // Named functions: 'at functionName (filename:lineNumber:columnNumber)'
    var attempt1 = /at .+ \((.+):(\d+):(?:\d+)\)$/.exec(stackLine);
    if (attempt1) { return [attempt1[1], Number(attempt1[2])]; }

    // Anonymous functions: 'at filename:lineNumber:columnNumber'
    var attempt2 = /at ([^ ]+):(\d+):(?:\d+)$/.exec(stackLine);
    if (attempt2) { return [attempt2[1], Number(attempt2[2])]; }

    // Firefox style: 'function@filename:lineNumber or @filename:lineNumber'
    var attempt3 = /.*@(.+):(\d+)$/.exec(stackLine);
    if (attempt3) { return [attempt3[1], Number(attempt3[2])]; }
  }

  var EmptyError = Rx.EmptyError = function() {
    this.message = 'Sequence contains no elements.';
    Error.call(this);
  };
  EmptyError.prototype = Object.create(Error.prototype);
  EmptyError.prototype.name = 'EmptyError';

  var ObjectDisposedError = Rx.ObjectDisposedError = function() {
    this.message = 'Object has been disposed';
    Error.call(this);
  };
  ObjectDisposedError.prototype = Object.create(Error.prototype);
  ObjectDisposedError.prototype.name = 'ObjectDisposedError';

  var ArgumentOutOfRangeError = Rx.ArgumentOutOfRangeError = function () {
    this.message = 'Argument out of range';
    Error.call(this);
  };
  ArgumentOutOfRangeError.prototype = Object.create(Error.prototype);
  ArgumentOutOfRangeError.prototype.name = 'ArgumentOutOfRangeError';

  var NotSupportedError = Rx.NotSupportedError = function (message) {
    this.message = message || 'This operation is not supported';
    Error.call(this);
  };
  NotSupportedError.prototype = Object.create(Error.prototype);
  NotSupportedError.prototype.name = 'NotSupportedError';

  var NotImplementedError = Rx.NotImplementedError = function (message) {
    this.message = message || 'This operation is not implemented';
    Error.call(this);
  };
  NotImplementedError.prototype = Object.create(Error.prototype);
  NotImplementedError.prototype.name = 'NotImplementedError';

  var notImplemented = Rx.helpers.notImplemented = function () {
    throw new NotImplementedError();
  };

  var notSupported = Rx.helpers.notSupported = function () {
    throw new NotSupportedError();
  };

  // Shim in iterator support
  var $iterator$ = (typeof Symbol === 'function' && Symbol.iterator) ||
    '_es6shim_iterator_';
  // Bug for mozilla version
  if (root.Set && typeof new root.Set()['@@iterator'] === 'function') {
    $iterator$ = '@@iterator';
  }

  var doneEnumerator = Rx.doneEnumerator = { done: true, value: undefined };

  var isIterable = Rx.helpers.isIterable = function (o) {
    return o && o[$iterator$] !== undefined;
  };

  var isArrayLike = Rx.helpers.isArrayLike = function (o) {
    return o && o.length !== undefined;
  };

  Rx.helpers.iterator = $iterator$;

  var bindCallback = Rx.internals.bindCallback = function (func, thisArg, argCount) {
    if (typeof thisArg === 'undefined') { return func; }
    switch(argCount) {
      case 0:
        return function() {
          return func.call(thisArg)
        };
      case 1:
        return function(arg) {
          return func.call(thisArg, arg);
        };
      case 2:
        return function(value, index) {
          return func.call(thisArg, value, index);
        };
      case 3:
        return function(value, index, collection) {
          return func.call(thisArg, value, index, collection);
        };
    }

    return function() {
      return func.apply(thisArg, arguments);
    };
  };

  /** Used to determine if values are of the language type Object */
  var dontEnums = ['toString',
    'toLocaleString',
    'valueOf',
    'hasOwnProperty',
    'isPrototypeOf',
    'propertyIsEnumerable',
    'constructor'],
  dontEnumsLength = dontEnums.length;

var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dateTag] = typedArrayTags[errorTag] =
typedArrayTags[funcTag] = typedArrayTags[mapTag] =
typedArrayTags[numberTag] = typedArrayTags[objectTag] =
typedArrayTags[regexpTag] = typedArrayTags[setTag] =
typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;

var objectProto = Object.prototype,
    hasOwnProperty = objectProto.hasOwnProperty,
    objToString = objectProto.toString,
    MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;

var keys = Object.keys || (function() {
    var hasOwnProperty = Object.prototype.hasOwnProperty,
        hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'),
        dontEnums = [
          'toString',
          'toLocaleString',
          'valueOf',
          'hasOwnProperty',
          'isPrototypeOf',
          'propertyIsEnumerable',
          'constructor'
        ],
        dontEnumsLength = dontEnums.length;

    return function(obj) {
      if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
        throw new TypeError('Object.keys called on non-object');
      }

      var result = [], prop, i;

      for (prop in obj) {
        if (hasOwnProperty.call(obj, prop)) {
          result.push(prop);
        }
      }

      if (hasDontEnumBug) {
        for (i = 0; i < dontEnumsLength; i++) {
          if (hasOwnProperty.call(obj, dontEnums[i])) {
            result.push(dontEnums[i]);
          }
        }
      }
      return result;
    };
  }());

function equalObjects(object, other, equalFunc, isLoose, stackA, stackB) {
  var objProps = keys(object),
      objLength = objProps.length,
      othProps = keys(other),
      othLength = othProps.length;

  if (objLength !== othLength && !isLoose) {
    return false;
  }
  var index = objLength, key;
  while (index--) {
    key = objProps[index];
    if (!(isLoose ? key in other : hasOwnProperty.call(other, key))) {
      return false;
    }
  }
  var skipCtor = isLoose;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
        othValue = other[key],
        result;

    if (!(result === undefined ? equalFunc(objValue, othValue, isLoose, stackA, stackB) : result)) {
      return false;
    }
    skipCtor || (skipCtor = key === 'constructor');
  }
  if (!skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    if (objCtor !== othCtor &&
        ('constructor' in object && 'constructor' in other) &&
        !(typeof objCtor === 'function' && objCtor instanceof objCtor &&
          typeof othCtor === 'function' && othCtor instanceof othCtor)) {
      return false;
    }
  }
  return true;
}

function equalByTag(object, other, tag) {
  switch (tag) {
    case boolTag:
    case dateTag:
      return +object === +other;

    case errorTag:
      return object.name === other.name && object.message === other.message;

    case numberTag:
      return (object !== +object) ?
        other !== +other :
        object === +other;

    case regexpTag:
    case stringTag:
      return object === (other + '');
  }
  return false;
}

var isObject = Rx.internals.isObject = function(value) {
  var type = typeof value;
  return !!value && (type === 'object' || type === 'function');
};

function isObjectLike(value) {
  return !!value && typeof value === 'object';
}

function isLength(value) {
  return typeof value === 'number' && value > -1 && value % 1 === 0 && value <= MAX_SAFE_INTEGER;
}

var isHostObject = (function() {
  try {
    Object({ 'toString': 0 } + '');
  } catch(e) {
    return function() { return false; };
  }
  return function(value) {
    return typeof value.toString !== 'function' && typeof (value + '') === 'string';
  };
}());

function isTypedArray(value) {
  return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[objToString.call(value)];
}

var isArray = Array.isArray || function(value) {
  return isObjectLike(value) && isLength(value.length) && objToString.call(value) === arrayTag;
};

function arraySome (array, predicate) {
  var index = -1,
      length = array.length;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

function equalArrays(array, other, equalFunc, isLoose, stackA, stackB) {
  var index = -1,
      arrLength = array.length,
      othLength = other.length;

  if (arrLength !== othLength && !(isLoose && othLength > arrLength)) {
    return false;
  }
  // Ignore non-index properties.
  while (++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index],
        result;

    if (result !== undefined) {
      if (result) {
        continue;
      }
      return false;
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (isLoose) {
      if (!arraySome(other, function(othValue) {
            return arrValue === othValue || equalFunc(arrValue, othValue, isLoose, stackA, stackB);
          })) {
        return false;
      }
    } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, isLoose, stackA, stackB))) {
      return false;
    }
  }
  return true;
}

function baseIsEqualDeep(object, other, equalFunc, isLoose, stackA, stackB) {
  var objIsArr = isArray(object),
      othIsArr = isArray(other),
      objTag = arrayTag,
      othTag = arrayTag;

  if (!objIsArr) {
    objTag = objToString.call(object);
    if (objTag === argsTag) {
      objTag = objectTag;
    } else if (objTag !== objectTag) {
      objIsArr = isTypedArray(object);
    }
  }
  if (!othIsArr) {
    othTag = objToString.call(other);
    if (othTag === argsTag) {
      othTag = objectTag;
    }
  }
  var objIsObj = objTag === objectTag && !isHostObject(object),
      othIsObj = othTag === objectTag && !isHostObject(other),
      isSameTag = objTag === othTag;

  if (isSameTag && !(objIsArr || objIsObj)) {
    return equalByTag(object, other, objTag);
  }
  if (!isLoose) {
    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      return equalFunc(objIsWrapped ? object.value() : object, othIsWrapped ? other.value() : other, isLoose, stackA, stackB);
    }
  }
  if (!isSameTag) {
    return false;
  }
  // Assume cyclic values are equal.
  // For more information on detecting circular references see https://es5.github.io/#JO.
  stackA || (stackA = []);
  stackB || (stackB = []);

  var length = stackA.length;
  while (length--) {
    if (stackA[length] === object) {
      return stackB[length] === other;
    }
  }
  // Add `object` and `other` to the stack of traversed objects.
  stackA.push(object);
  stackB.push(other);

  var result = (objIsArr ? equalArrays : equalObjects)(object, other, equalFunc, isLoose, stackA, stackB);

  stackA.pop();
  stackB.pop();

  return result;
}

function baseIsEqual(value, other, isLoose, stackA, stackB) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || (!isObject(value) && !isObjectLike(other))) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, baseIsEqual, isLoose, stackA, stackB);
}

var isEqual = Rx.internals.isEqual = function (value, other) {
  return baseIsEqual(value, other);
};

  var hasProp = {}.hasOwnProperty,
      slice = Array.prototype.slice;

  var inherits = Rx.internals.inherits = function (child, parent) {
    function __() { this.constructor = child; }
    __.prototype = parent.prototype;
    child.prototype = new __();
  };

  var addProperties = Rx.internals.addProperties = function (obj) {
    for(var sources = [], i = 1, len = arguments.length; i < len; i++) { sources.push(arguments[i]); }
    for (var idx = 0, ln = sources.length; idx < ln; idx++) {
      var source = sources[idx];
      for (var prop in source) {
        obj[prop] = source[prop];
      }
    }
  };

  // Rx Utils
  var addRef = Rx.internals.addRef = function (xs, r) {
    return new AnonymousObservable(function (observer) {
      return new BinaryDisposable(r.getDisposable(), xs.subscribe(observer));
    });
  };

  function arrayInitialize(count, factory) {
    var a = new Array(count);
    for (var i = 0; i < count; i++) {
      a[i] = factory();
    }
    return a;
  }

  /**
   * Represents a group of disposable resources that are disposed together.
   * @constructor
   */
  var CompositeDisposable = Rx.CompositeDisposable = function () {
    var args = [], i, len;
    if (Array.isArray(arguments[0])) {
      args = arguments[0];
    } else {
      len = arguments.length;
      args = new Array(len);
      for(i = 0; i < len; i++) { args[i] = arguments[i]; }
    }
    this.disposables = args;
    this.isDisposed = false;
    this.length = args.length;
  };

  var CompositeDisposablePrototype = CompositeDisposable.prototype;

  /**
   * Adds a disposable to the CompositeDisposable or disposes the disposable if the CompositeDisposable is disposed.
   * @param {Mixed} item Disposable to add.
   */
  CompositeDisposablePrototype.add = function (item) {
    if (this.isDisposed) {
      item.dispose();
    } else {
      this.disposables.push(item);
      this.length++;
    }
  };

  /**
   * Removes and disposes the first occurrence of a disposable from the CompositeDisposable.
   * @param {Mixed} item Disposable to remove.
   * @returns {Boolean} true if found; false otherwise.
   */
  CompositeDisposablePrototype.remove = function (item) {
    var shouldDispose = false;
    if (!this.isDisposed) {
      var idx = this.disposables.indexOf(item);
      if (idx !== -1) {
        shouldDispose = true;
        this.disposables.splice(idx, 1);
        this.length--;
        item.dispose();
      }
    }
    return shouldDispose;
  };

  /**
   *  Disposes all disposables in the group and removes them from the group.
   */
  CompositeDisposablePrototype.dispose = function () {
    if (!this.isDisposed) {
      this.isDisposed = true;
      var len = this.disposables.length, currentDisposables = new Array(len);
      for(var i = 0; i < len; i++) { currentDisposables[i] = this.disposables[i]; }
      this.disposables = [];
      this.length = 0;

      for (i = 0; i < len; i++) {
        currentDisposables[i].dispose();
      }
    }
  };

  /**
   * Provides a set of static methods for creating Disposables.
   * @param {Function} dispose Action to run during the first call to dispose. The action is guaranteed to be run at most once.
   */
  var Disposable = Rx.Disposable = function (action) {
    this.isDisposed = false;
    this.action = action || noop;
  };

  /** Performs the task of cleaning up resources. */
  Disposable.prototype.dispose = function () {
    if (!this.isDisposed) {
      this.action();
      this.isDisposed = true;
    }
  };

  /**
   * Creates a disposable object that invokes the specified action when disposed.
   * @param {Function} dispose Action to run during the first call to dispose. The action is guaranteed to be run at most once.
   * @return {Disposable} The disposable object that runs the given action upon disposal.
   */
  var disposableCreate = Disposable.create = function (action) { return new Disposable(action); };

  /**
   * Gets the disposable that does nothing when disposed.
   */
  var disposableEmpty = Disposable.empty = { dispose: noop };

  /**
   * Validates whether the given object is a disposable
   * @param {Object} Object to test whether it has a dispose method
   * @returns {Boolean} true if a disposable object, else false.
   */
  var isDisposable = Disposable.isDisposable = function (d) {
    return d && isFunction(d.dispose);
  };

  var checkDisposed = Disposable.checkDisposed = function (disposable) {
    if (disposable.isDisposed) { throw new ObjectDisposedError(); }
  };

  var disposableFixup = Disposable._fixup = function (result) {
    return isDisposable(result) ? result : disposableEmpty;
  };

  // Single assignment
  var SingleAssignmentDisposable = Rx.SingleAssignmentDisposable = function () {
    this.isDisposed = false;
    this.current = null;
  };
  SingleAssignmentDisposable.prototype.getDisposable = function () {
    return this.current;
  };
  SingleAssignmentDisposable.prototype.setDisposable = function (value) {
    if (this.current) { throw new Error('Disposable has already been assigned'); }
    var shouldDispose = this.isDisposed;
    !shouldDispose && (this.current = value);
    shouldDispose && value && value.dispose();
  };
  SingleAssignmentDisposable.prototype.dispose = function () {
    if (!this.isDisposed) {
      this.isDisposed = true;
      var old = this.current;
      this.current = null;
      old && old.dispose();
    }
  };

  // Multiple assignment disposable
  var SerialDisposable = Rx.SerialDisposable = function () {
    this.isDisposed = false;
    this.current = null;
  };
  SerialDisposable.prototype.getDisposable = function () {
    return this.current;
  };
  SerialDisposable.prototype.setDisposable = function (value) {
    var shouldDispose = this.isDisposed;
    if (!shouldDispose) {
      var old = this.current;
      this.current = value;
    }
    old && old.dispose();
    shouldDispose && value && value.dispose();
  };
  SerialDisposable.prototype.dispose = function () {
    if (!this.isDisposed) {
      this.isDisposed = true;
      var old = this.current;
      this.current = null;
    }
    old && old.dispose();
  };

  var BinaryDisposable = Rx.BinaryDisposable = function (first, second) {
    this._first = first;
    this._second = second;
    this.isDisposed = false;
  };

  BinaryDisposable.prototype.dispose = function () {
    if (!this.isDisposed) {
      this.isDisposed = true;
      var old1 = this._first;
      this._first = null;
      old1 && old1.dispose();
      var old2 = this._second;
      this._second = null;
      old2 && old2.dispose();
    }
  };

  var NAryDisposable = Rx.NAryDisposable = function (disposables) {
    this._disposables = disposables;
    this.isDisposed = false;
  };

  NAryDisposable.prototype.dispose = function () {
    if (!this.isDisposed) {
      this.isDisposed = true;
      for (var i = 0, len = this._disposables.length; i < len; i++) {
        this._disposables[i].dispose();
      }
      this._disposables.length = 0;
    }
  };

  /**
   * Represents a disposable resource that only disposes its underlying disposable resource when all dependent disposable objects have been disposed.
   */
  var RefCountDisposable = Rx.RefCountDisposable = (function () {

    function InnerDisposable(disposable) {
      this.disposable = disposable;
      this.disposable.count++;
      this.isInnerDisposed = false;
    }

    InnerDisposable.prototype.dispose = function () {
      if (!this.disposable.isDisposed && !this.isInnerDisposed) {
        this.isInnerDisposed = true;
        this.disposable.count--;
        if (this.disposable.count === 0 && this.disposable.isPrimaryDisposed) {
          this.disposable.isDisposed = true;
          this.disposable.underlyingDisposable.dispose();
        }
      }
    };

    /**
     * Initializes a new instance of the RefCountDisposable with the specified disposable.
     * @constructor
     * @param {Disposable} disposable Underlying disposable.
      */
    function RefCountDisposable(disposable) {
      this.underlyingDisposable = disposable;
      this.isDisposed = false;
      this.isPrimaryDisposed = false;
      this.count = 0;
    }

    /**
     * Disposes the underlying disposable only when all dependent disposables have been disposed
     */
    RefCountDisposable.prototype.dispose = function () {
      if (!this.isDisposed && !this.isPrimaryDisposed) {
        this.isPrimaryDisposed = true;
        if (this.count === 0) {
          this.isDisposed = true;
          this.underlyingDisposable.dispose();
        }
      }
    };

    /**
     * Returns a dependent disposable that when disposed decreases the refcount on the underlying disposable.
     * @returns {Disposable} A dependent disposable contributing to the reference count that manages the underlying disposable's lifetime.
     */
    RefCountDisposable.prototype.getDisposable = function () {
      return this.isDisposed ? disposableEmpty : new InnerDisposable(this);
    };

    return RefCountDisposable;
  })();

  var ScheduledItem = Rx.internals.ScheduledItem = function (scheduler, state, action, dueTime, comparer) {
    this.scheduler = scheduler;
    this.state = state;
    this.action = action;
    this.dueTime = dueTime;
    this.comparer = comparer || defaultSubComparer;
    this.disposable = new SingleAssignmentDisposable();
  };

  ScheduledItem.prototype.invoke = function () {
    this.disposable.setDisposable(this.invokeCore());
  };

  ScheduledItem.prototype.compareTo = function (other) {
    return this.comparer(this.dueTime, other.dueTime);
  };

  ScheduledItem.prototype.isCancelled = function () {
    return this.disposable.isDisposed;
  };

  ScheduledItem.prototype.invokeCore = function () {
    return disposableFixup(this.action(this.scheduler, this.state));
  };

  /** Provides a set of static properties to access commonly used schedulers. */
  var Scheduler = Rx.Scheduler = (function () {

    function Scheduler() { }

    /** Determines whether the given object is a scheduler */
    Scheduler.isScheduler = function (s) {
      return s instanceof Scheduler;
    };

    var schedulerProto = Scheduler.prototype;

    /**
   * Schedules an action to be executed.
   * @param state State passed to the action to be executed.
   * @param {Function} action Action to be executed.
   * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
   */
    schedulerProto.schedule = function (state, action) {
      throw new NotImplementedError();
    };

  /**
   * Schedules an action to be executed after dueTime.
   * @param state State passed to the action to be executed.
   * @param {Function} action Action to be executed.
   * @param {Number} dueTime Relative time after which to execute the action.
   * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
   */
    schedulerProto.scheduleFuture = function (state, dueTime, action) {
      var dt = dueTime;
      dt instanceof Date && (dt = dt - this.now());
      dt = Scheduler.normalize(dt);

      if (dt === 0) { return this.schedule(state, action); }

      return this._scheduleFuture(state, dt, action);
    };

    schedulerProto._scheduleFuture = function (state, dueTime, action) {
      throw new NotImplementedError();
    };

    /** Gets the current time according to the local machine's system clock. */
    Scheduler.now = defaultNow;

    /** Gets the current time according to the local machine's system clock. */
    Scheduler.prototype.now = defaultNow;

    /**
     * Normalizes the specified TimeSpan value to a positive value.
     * @param {Number} timeSpan The time span value to normalize.
     * @returns {Number} The specified TimeSpan value if it is zero or positive; otherwise, 0
     */
    Scheduler.normalize = function (timeSpan) {
      timeSpan < 0 && (timeSpan = 0);
      return timeSpan;
    };

    return Scheduler;
  }());

  var normalizeTime = Scheduler.normalize, isScheduler = Scheduler.isScheduler;

  (function (schedulerProto) {

    function invokeRecImmediate(scheduler, pair) {
      var state = pair[0], action = pair[1], group = new CompositeDisposable();
      action(state, innerAction);
      return group;

      function innerAction(state2) {
        var isAdded = false, isDone = false;

        var d = scheduler.schedule(state2, scheduleWork);
        if (!isDone) {
          group.add(d);
          isAdded = true;
        }

        function scheduleWork(_, state3) {
          if (isAdded) {
            group.remove(d);
          } else {
            isDone = true;
          }
          action(state3, innerAction);
          return disposableEmpty;
        }
      }
    }

    function invokeRecDate(scheduler, pair) {
      var state = pair[0], action = pair[1], group = new CompositeDisposable();
      action(state, innerAction);
      return group;

      function innerAction(state2, dueTime1) {
        var isAdded = false, isDone = false;

        var d = scheduler.scheduleFuture(state2, dueTime1, scheduleWork);
        if (!isDone) {
          group.add(d);
          isAdded = true;
        }

        function scheduleWork(_, state3) {
          if (isAdded) {
            group.remove(d);
          } else {
            isDone = true;
          }
          action(state3, innerAction);
          return disposableEmpty;
        }
      }
    }

    /**
     * Schedules an action to be executed recursively.
     * @param {Mixed} state State passed to the action to be executed.
     * @param {Function} action Action to execute recursively. The last parameter passed to the action is used to trigger recursive scheduling of the action, passing in recursive invocation state.
     * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
     */
    schedulerProto.scheduleRecursive = function (state, action) {
      return this.schedule([state, action], invokeRecImmediate);
    };

    /**
     * Schedules an action to be executed recursively after a specified relative or absolute due time.
     * @param {Mixed} state State passed to the action to be executed.
     * @param {Function} action Action to execute recursively. The last parameter passed to the action is used to trigger recursive scheduling of the action, passing in the recursive due time and invocation state.
     * @param {Number | Date} dueTime Relative or absolute time after which to execute the action for the first time.
     * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
     */
    schedulerProto.scheduleRecursiveFuture = function (state, dueTime, action) {
      return this.scheduleFuture([state, action], dueTime, invokeRecDate);
    };

  }(Scheduler.prototype));

  (function (schedulerProto) {

    /**
     * Schedules a periodic piece of work by dynamically discovering the scheduler's capabilities. The periodic task will be scheduled using window.setInterval for the base implementation.
     * @param {Mixed} state Initial state passed to the action upon the first iteration.
     * @param {Number} period Period for running the work periodically.
     * @param {Function} action Action to be executed, potentially updating the state.
     * @returns {Disposable} The disposable object used to cancel the scheduled recurring action (best effort).
     */
    schedulerProto.schedulePeriodic = function(state, period, action) {
      if (typeof root.setInterval === 'undefined') { throw new NotSupportedError(); }
      period = normalizeTime(period);
      var s = state, id = root.setInterval(function () { s = action(s); }, period);
      return disposableCreate(function () { root.clearInterval(id); });
    };

  }(Scheduler.prototype));

  /** Gets a scheduler that schedules work immediately on the current thread. */
   var ImmediateScheduler = (function (__super__) {
    inherits(ImmediateScheduler, __super__);
    function ImmediateScheduler() {
      __super__.call(this);
    }

    ImmediateScheduler.prototype.schedule = function (state, action) {
      return disposableFixup(action(this, state));
    };

    return ImmediateScheduler;
  }(Scheduler));

  var immediateScheduler = Scheduler.immediate = new ImmediateScheduler();

  /**
   * Gets a scheduler that schedules work as soon as possible on the current thread.
   */
  var CurrentThreadScheduler = (function (__super__) {
    var queue;

    function runTrampoline () {
      while (queue.length > 0) {
        var item = queue.dequeue();
        !item.isCancelled() && item.invoke();
      }
    }

    inherits(CurrentThreadScheduler, __super__);
    function CurrentThreadScheduler() {
      __super__.call(this);
    }

    CurrentThreadScheduler.prototype.schedule = function (state, action) {
      var si = new ScheduledItem(this, state, action, this.now());

      if (!queue) {
        queue = new PriorityQueue(4);
        queue.enqueue(si);

        var result = tryCatch(runTrampoline)();
        queue = null;
        if (result === errorObj) { thrower(result.e); }
      } else {
        queue.enqueue(si);
      }
      return si.disposable;
    };

    CurrentThreadScheduler.prototype.scheduleRequired = function () { return !queue; };

    return CurrentThreadScheduler;
  }(Scheduler));

  var currentThreadScheduler = Scheduler.currentThread = new CurrentThreadScheduler();

  var SchedulePeriodicRecursive = Rx.internals.SchedulePeriodicRecursive = (function () {
    function createTick(self) {
      return function tick(command, recurse) {
        recurse(0, self._period);
        var state = tryCatch(self._action)(self._state);
        if (state === errorObj) {
          self._cancel.dispose();
          thrower(state.e);
        }
        self._state = state;
      };
    }

    function SchedulePeriodicRecursive(scheduler, state, period, action) {
      this._scheduler = scheduler;
      this._state = state;
      this._period = period;
      this._action = action;
    }

    SchedulePeriodicRecursive.prototype.start = function () {
      var d = new SingleAssignmentDisposable();
      this._cancel = d;
      d.setDisposable(this._scheduler.scheduleRecursiveFuture(0, this._period, createTick(this)));

      return d;
    };

    return SchedulePeriodicRecursive;
  }());

  var scheduleMethod, clearMethod;

  var localTimer = (function () {
    var localSetTimeout, localClearTimeout = noop;
    if (!!root.setTimeout) {
      localSetTimeout = root.setTimeout;
      localClearTimeout = root.clearTimeout;
    } else if (!!root.WScript) {
      localSetTimeout = function (fn, time) {
        root.WScript.Sleep(time);
        fn();
      };
    } else {
      throw new NotSupportedError();
    }

    return {
      setTimeout: localSetTimeout,
      clearTimeout: localClearTimeout
    };
  }());
  var localSetTimeout = localTimer.setTimeout,
    localClearTimeout = localTimer.clearTimeout;

  (function () {

    var nextHandle = 1, tasksByHandle = {}, currentlyRunning = false;

    clearMethod = function (handle) {
      delete tasksByHandle[handle];
    };

    function runTask(handle) {
      if (currentlyRunning) {
        localSetTimeout(function () { runTask(handle); }, 0);
      } else {
        var task = tasksByHandle[handle];
        if (task) {
          currentlyRunning = true;
          var result = tryCatch(task)();
          clearMethod(handle);
          currentlyRunning = false;
          if (result === errorObj) { thrower(result.e); }
        }
      }
    }

    var reNative = new RegExp('^' +
      String(toString)
        .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        .replace(/toString| for [^\]]+/g, '.*?') + '$'
    );

    var setImmediate = typeof (setImmediate = freeGlobal && moduleExports && freeGlobal.setImmediate) == 'function' &&
      !reNative.test(setImmediate) && setImmediate;

    function postMessageSupported () {
      // Ensure not in a worker
      if (!root.postMessage || root.importScripts) { return false; }
      var isAsync = false, oldHandler = root.onmessage;
      // Test for async
      root.onmessage = function () { isAsync = true; };
      root.postMessage('', '*');
      root.onmessage = oldHandler;

      return isAsync;
    }

    // Use in order, setImmediate, nextTick, postMessage, MessageChannel, script readystatechanged, setTimeout
    if (isFunction(setImmediate)) {
      scheduleMethod = function (action) {
        var id = nextHandle++;
        tasksByHandle[id] = action;
        setImmediate(function () { runTask(id); });

        return id;
      };
    } else if (typeof process !== 'undefined' && {}.toString.call(process) === '[object process]') {
      scheduleMethod = function (action) {
        var id = nextHandle++;
        tasksByHandle[id] = action;
        process.nextTick(function () { runTask(id); });

        return id;
      };
    } else if (postMessageSupported()) {
      var MSG_PREFIX = 'ms.rx.schedule' + Math.random();

      var onGlobalPostMessage = function (event) {
        // Only if we're a match to avoid any other global events
        if (typeof event.data === 'string' && event.data.substring(0, MSG_PREFIX.length) === MSG_PREFIX) {
          runTask(event.data.substring(MSG_PREFIX.length));
        }
      };

      root.addEventListener('message', onGlobalPostMessage, false);

      scheduleMethod = function (action) {
        var id = nextHandle++;
        tasksByHandle[id] = action;
        root.postMessage(MSG_PREFIX + id, '*');
        return id;
      };
    } else if (!!root.MessageChannel) {
      var channel = new root.MessageChannel();

      channel.port1.onmessage = function (e) { runTask(e.data); };

      scheduleMethod = function (action) {
        var id = nextHandle++;
        tasksByHandle[id] = action;
        channel.port2.postMessage(id);
        return id;
      };
    } else if ('document' in root && 'onreadystatechange' in root.document.createElement('script')) {

      scheduleMethod = function (action) {
        var scriptElement = root.document.createElement('script');
        var id = nextHandle++;
        tasksByHandle[id] = action;

        scriptElement.onreadystatechange = function () {
          runTask(id);
          scriptElement.onreadystatechange = null;
          scriptElement.parentNode.removeChild(scriptElement);
          scriptElement = null;
        };
        root.document.documentElement.appendChild(scriptElement);
        return id;
      };

    } else {
      scheduleMethod = function (action) {
        var id = nextHandle++;
        tasksByHandle[id] = action;
        localSetTimeout(function () {
          runTask(id);
        }, 0);

        return id;
      };
    }
  }());

  /**
   * Gets a scheduler that schedules work via a timed callback based upon platform.
   */
   var DefaultScheduler = (function (__super__) {
     inherits(DefaultScheduler, __super__);
     function DefaultScheduler() {
       __super__.call(this);
     }

     function scheduleAction(disposable, action, scheduler, state) {
       return function schedule() {
         disposable.setDisposable(Disposable._fixup(action(scheduler, state)));
       };
     }

     function ClearDisposable(id) {
       this._id = id;
       this.isDisposed = false;
     }

     ClearDisposable.prototype.dispose = function () {
       if (!this.isDisposed) {
         this.isDisposed = true;
         clearMethod(this._id);
       }
     };

     function LocalClearDisposable(id) {
       this._id = id;
       this.isDisposed = false;
     }

     LocalClearDisposable.prototype.dispose = function () {
       if (!this.isDisposed) {
         this.isDisposed = true;
         localClearTimeout(this._id);
       }
     };

    DefaultScheduler.prototype.schedule = function (state, action) {
      var disposable = new SingleAssignmentDisposable(),
          id = scheduleMethod(scheduleAction(disposable, action, this, state));
      return new BinaryDisposable(disposable, new ClearDisposable(id));
    };

    DefaultScheduler.prototype._scheduleFuture = function (state, dueTime, action) {
      if (dueTime === 0) { return this.schedule(state, action); }
      var disposable = new SingleAssignmentDisposable(),
          id = localSetTimeout(scheduleAction(disposable, action, this, state), dueTime);
      return new BinaryDisposable(disposable, new LocalClearDisposable(id));
    };

    return DefaultScheduler;
  }(Scheduler));

  var defaultScheduler = Scheduler['default'] = Scheduler.async = new DefaultScheduler();

  function IndexedItem(id, value) {
    this.id = id;
    this.value = value;
  }

  IndexedItem.prototype.compareTo = function (other) {
    var c = this.value.compareTo(other.value);
    c === 0 && (c = this.id - other.id);
    return c;
  };

  var PriorityQueue = Rx.internals.PriorityQueue = function (capacity) {
    this.items = new Array(capacity);
    this.length = 0;
  };

  var priorityProto = PriorityQueue.prototype;
  priorityProto.isHigherPriority = function (left, right) {
    return this.items[left].compareTo(this.items[right]) < 0;
  };

  priorityProto.percolate = function (index) {
    if (index >= this.length || index < 0) { return; }
    var parent = index - 1 >> 1;
    if (parent < 0 || parent === index) { return; }
    if (this.isHigherPriority(index, parent)) {
      var temp = this.items[index];
      this.items[index] = this.items[parent];
      this.items[parent] = temp;
      this.percolate(parent);
    }
  };

  priorityProto.heapify = function (index) {
    +index || (index = 0);
    if (index >= this.length || index < 0) { return; }
    var left = 2 * index + 1,
        right = 2 * index + 2,
        first = index;
    if (left < this.length && this.isHigherPriority(left, first)) {
      first = left;
    }
    if (right < this.length && this.isHigherPriority(right, first)) {
      first = right;
    }
    if (first !== index) {
      var temp = this.items[index];
      this.items[index] = this.items[first];
      this.items[first] = temp;
      this.heapify(first);
    }
  };

  priorityProto.peek = function () { return this.items[0].value; };

  priorityProto.removeAt = function (index) {
    this.items[index] = this.items[--this.length];
    this.items[this.length] = undefined;
    this.heapify();
  };

  priorityProto.dequeue = function () {
    var result = this.peek();
    this.removeAt(0);
    return result;
  };

  priorityProto.enqueue = function (item) {
    var index = this.length++;
    this.items[index] = new IndexedItem(PriorityQueue.count++, item);
    this.percolate(index);
  };

  priorityProto.remove = function (item) {
    for (var i = 0; i < this.length; i++) {
      if (this.items[i].value === item) {
        this.removeAt(i);
        return true;
      }
    }
    return false;
  };
  PriorityQueue.count = 0;

  /**
   *  Represents a notification to an observer.
   */
  var Notification = Rx.Notification = (function () {
    function Notification() {

    }

    Notification.prototype._accept = function (onNext, onError, onCompleted) {
      throw new NotImplementedError();
    };

    Notification.prototype._acceptObserver = function (onNext, onError, onCompleted) {
      throw new NotImplementedError();
    };

    /**
     * Invokes the delegate corresponding to the notification or the observer's method corresponding to the notification and returns the produced result.
     * @param {Function | Observer} observerOrOnNext Function to invoke for an OnNext notification or Observer to invoke the notification on..
     * @param {Function} onError Function to invoke for an OnError notification.
     * @param {Function} onCompleted Function to invoke for an OnCompleted notification.
     * @returns {Any} Result produced by the observation.
     */
    Notification.prototype.accept = function (observerOrOnNext, onError, onCompleted) {
      return observerOrOnNext && typeof observerOrOnNext === 'object' ?
        this._acceptObserver(observerOrOnNext) :
        this._accept(observerOrOnNext, onError, onCompleted);
    };

    /**
     * Returns an observable sequence with a single notification.
     *
     * @memberOf Notifications
     * @param {Scheduler} [scheduler] Scheduler to send out the notification calls on.
     * @returns {Observable} The observable sequence that surfaces the behavior of the notification upon subscription.
     */
    Notification.prototype.toObservable = function (scheduler) {
      var self = this;
      isScheduler(scheduler) || (scheduler = immediateScheduler);
      return new AnonymousObservable(function (o) {
        return scheduler.schedule(self, function (_, notification) {
          notification._acceptObserver(o);
          notification.kind === 'N' && o.onCompleted();
        });
      });
    };

    return Notification;
  })();

  var OnNextNotification = (function (__super__) {
    inherits(OnNextNotification, __super__);
    function OnNextNotification(value) {
      this.value = value;
      this.kind = 'N';
    }

    OnNextNotification.prototype._accept = function (onNext) {
      return onNext(this.value);
    };

    OnNextNotification.prototype._acceptObserver = function (o) {
      return o.onNext(this.value);
    };

    OnNextNotification.prototype.toString = function () {
      return 'OnNext(' + this.value + ')';
    };

    return OnNextNotification;
  }(Notification));

  var OnErrorNotification = (function (__super__) {
    inherits(OnErrorNotification, __super__);
    function OnErrorNotification(error) {
      this.error = error;
      this.kind = 'E';
    }

    OnErrorNotification.prototype._accept = function (onNext, onError) {
      return onError(this.error);
    };

    OnErrorNotification.prototype._acceptObserver = function (o) {
      return o.onError(this.error);
    };

    OnErrorNotification.prototype.toString = function () {
      return 'OnError(' + this.error + ')';
    };

    return OnErrorNotification;
  }(Notification));

  var OnCompletedNotification = (function (__super__) {
    inherits(OnCompletedNotification, __super__);
    function OnCompletedNotification() {
      this.kind = 'C';
    }

    OnCompletedNotification.prototype._accept = function (onNext, onError, onCompleted) {
      return onCompleted();
    };

    OnCompletedNotification.prototype._acceptObserver = function (o) {
      return o.onCompleted();
    };

    OnCompletedNotification.prototype.toString = function () {
      return 'OnCompleted()';
    };

    return OnCompletedNotification;
  }(Notification));

  /**
   * Creates an object that represents an OnNext notification to an observer.
   * @param {Any} value The value contained in the notification.
   * @returns {Notification} The OnNext notification containing the value.
   */
  var notificationCreateOnNext = Notification.createOnNext = function (value) {
    return new OnNextNotification(value);
  };

  /**
   * Creates an object that represents an OnError notification to an observer.
   * @param {Any} error The exception contained in the notification.
   * @returns {Notification} The OnError notification containing the exception.
   */
  var notificationCreateOnError = Notification.createOnError = function (error) {
    return new OnErrorNotification(error);
  };

  /**
   * Creates an object that represents an OnCompleted notification to an observer.
   * @returns {Notification} The OnCompleted notification.
   */
  var notificationCreateOnCompleted = Notification.createOnCompleted = function () {
    return new OnCompletedNotification();
  };

  /**
   * Supports push-style iteration over an observable sequence.
   */
  var Observer = Rx.Observer = function () { };

  /**
   *  Creates an observer from the specified OnNext, along with optional OnError, and OnCompleted actions.
   * @param {Function} [onNext] Observer's OnNext action implementation.
   * @param {Function} [onError] Observer's OnError action implementation.
   * @param {Function} [onCompleted] Observer's OnCompleted action implementation.
   * @returns {Observer} The observer object implemented using the given actions.
   */
  var observerCreate = Observer.create = function (onNext, onError, onCompleted) {
    onNext || (onNext = noop);
    onError || (onError = defaultError);
    onCompleted || (onCompleted = noop);
    return new AnonymousObserver(onNext, onError, onCompleted);
  };

  /**
   * Abstract base class for implementations of the Observer class.
   * This base class enforces the grammar of observers where OnError and OnCompleted are terminal messages.
   */
  var AbstractObserver = Rx.internals.AbstractObserver = (function (__super__) {
    inherits(AbstractObserver, __super__);

    /**
     * Creates a new observer in a non-stopped state.
     */
    function AbstractObserver() {
      this.isStopped = false;
    }

    // Must be implemented by other observers
    AbstractObserver.prototype.next = notImplemented;
    AbstractObserver.prototype.error = notImplemented;
    AbstractObserver.prototype.completed = notImplemented;

    /**
     * Notifies the observer of a new element in the sequence.
     * @param {Any} value Next element in the sequence.
     */
    AbstractObserver.prototype.onNext = function (value) {
      !this.isStopped && this.next(value);
    };

    /**
     * Notifies the observer that an exception has occurred.
     * @param {Any} error The error that has occurred.
     */
    AbstractObserver.prototype.onError = function (error) {
      if (!this.isStopped) {
        this.isStopped = true;
        this.error(error);
      }
    };

    /**
     * Notifies the observer of the end of the sequence.
     */
    AbstractObserver.prototype.onCompleted = function () {
      if (!this.isStopped) {
        this.isStopped = true;
        this.completed();
      }
    };

    /**
     * Disposes the observer, causing it to transition to the stopped state.
     */
    AbstractObserver.prototype.dispose = function () { this.isStopped = true; };

    AbstractObserver.prototype.fail = function (e) {
      if (!this.isStopped) {
        this.isStopped = true;
        this.error(e);
        return true;
      }

      return false;
    };

    return AbstractObserver;
  }(Observer));

  /**
   * Class to create an Observer instance from delegate-based implementations of the on* methods.
   */
  var AnonymousObserver = Rx.AnonymousObserver = (function (__super__) {
    inherits(AnonymousObserver, __super__);

    /**
     * Creates an observer from the specified OnNext, OnError, and OnCompleted actions.
     * @param {Any} onNext Observer's OnNext action implementation.
     * @param {Any} onError Observer's OnError action implementation.
     * @param {Any} onCompleted Observer's OnCompleted action implementation.
     */
    function AnonymousObserver(onNext, onError, onCompleted) {
      __super__.call(this);
      this._onNext = onNext;
      this._onError = onError;
      this._onCompleted = onCompleted;
    }

    /**
     * Calls the onNext action.
     * @param {Any} value Next element in the sequence.
     */
    AnonymousObserver.prototype.next = function (value) {
      this._onNext(value);
    };

    /**
     * Calls the onError action.
     * @param {Any} error The error that has occurred.
     */
    AnonymousObserver.prototype.error = function (error) {
      this._onError(error);
    };

    /**
     *  Calls the onCompleted action.
     */
    AnonymousObserver.prototype.completed = function () {
      this._onCompleted();
    };

    return AnonymousObserver;
  }(AbstractObserver));

  var observableProto;

  /**
   * Represents a push-style collection.
   */
  var Observable = Rx.Observable = (function () {

    function makeSubscribe(self, subscribe) {
      return function (o) {
        var oldOnError = o.onError;
        o.onError = function (e) {
          makeStackTraceLong(e, self);
          oldOnError.call(o, e);
        };

        return subscribe.call(self, o);
      };
    }

    function Observable() {
      if (Rx.config.longStackSupport && hasStacks) {
        var oldSubscribe = this._subscribe;
        var e = tryCatch(thrower)(new Error()).e;
        this.stack = e.stack.substring(e.stack.indexOf('\n') + 1);
        this._subscribe = makeSubscribe(this, oldSubscribe);
      }
    }

    observableProto = Observable.prototype;

    /**
    * Determines whether the given object is an Observable
    * @param {Any} An object to determine whether it is an Observable
    * @returns {Boolean} true if an Observable, else false.
    */
    Observable.isObservable = function (o) {
      return o && isFunction(o.subscribe);
    };

    /**
     *  Subscribes an o to the observable sequence.
     *  @param {Mixed} [oOrOnNext] The object that is to receive notifications or an action to invoke for each element in the observable sequence.
     *  @param {Function} [onError] Action to invoke upon exceptional termination of the observable sequence.
     *  @param {Function} [onCompleted] Action to invoke upon graceful termination of the observable sequence.
     *  @returns {Diposable} A disposable handling the subscriptions and unsubscriptions.
     */
    observableProto.subscribe = observableProto.forEach = function (oOrOnNext, onError, onCompleted) {
      return this._subscribe(typeof oOrOnNext === 'object' ?
        oOrOnNext :
        observerCreate(oOrOnNext, onError, onCompleted));
    };

    /**
     * Subscribes to the next value in the sequence with an optional "this" argument.
     * @param {Function} onNext The function to invoke on each element in the observable sequence.
     * @param {Any} [thisArg] Object to use as this when executing callback.
     * @returns {Disposable} A disposable handling the subscriptions and unsubscriptions.
     */
    observableProto.subscribeOnNext = function (onNext, thisArg) {
      return this._subscribe(observerCreate(typeof thisArg !== 'undefined' ? function(x) { onNext.call(thisArg, x); } : onNext));
    };

    /**
     * Subscribes to an exceptional condition in the sequence with an optional "this" argument.
     * @param {Function} onError The function to invoke upon exceptional termination of the observable sequence.
     * @param {Any} [thisArg] Object to use as this when executing callback.
     * @returns {Disposable} A disposable handling the subscriptions and unsubscriptions.
     */
    observableProto.subscribeOnError = function (onError, thisArg) {
      return this._subscribe(observerCreate(null, typeof thisArg !== 'undefined' ? function(e) { onError.call(thisArg, e); } : onError));
    };

    /**
     * Subscribes to the next value in the sequence with an optional "this" argument.
     * @param {Function} onCompleted The function to invoke upon graceful termination of the observable sequence.
     * @param {Any} [thisArg] Object to use as this when executing callback.
     * @returns {Disposable} A disposable handling the subscriptions and unsubscriptions.
     */
    observableProto.subscribeOnCompleted = function (onCompleted, thisArg) {
      return this._subscribe(observerCreate(null, null, typeof thisArg !== 'undefined' ? function() { onCompleted.call(thisArg); } : onCompleted));
    };

    return Observable;
  })();

  var ScheduledObserver = Rx.internals.ScheduledObserver = (function (__super__) {
    inherits(ScheduledObserver, __super__);

    function ScheduledObserver(scheduler, observer) {
      __super__.call(this);
      this.scheduler = scheduler;
      this.observer = observer;
      this.isAcquired = false;
      this.hasFaulted = false;
      this.queue = [];
      this.disposable = new SerialDisposable();
    }

    function enqueueNext(observer, x) { return function () { observer.onNext(x); }; }
    function enqueueError(observer, e) { return function () { observer.onError(e); }; }
    function enqueueCompleted(observer) { return function () { observer.onCompleted(); }; }

    ScheduledObserver.prototype.next = function (x) {
      this.queue.push(enqueueNext(this.observer, x));
    };

    ScheduledObserver.prototype.error = function (e) {
      this.queue.push(enqueueError(this.observer, e));
    };

    ScheduledObserver.prototype.completed = function () {
      this.queue.push(enqueueCompleted(this.observer));
    };


    function scheduleMethod(state, recurse) {
      var work;
      if (state.queue.length > 0) {
        work = state.queue.shift();
      } else {
        state.isAcquired = false;
        return;
      }
      var res = tryCatch(work)();
      if (res === errorObj) {
        state.queue = [];
        state.hasFaulted = true;
        return thrower(res.e);
      }
      recurse(state);
    }

    ScheduledObserver.prototype.ensureActive = function () {
      var isOwner = false;
      if (!this.hasFaulted && this.queue.length > 0) {
        isOwner = !this.isAcquired;
        this.isAcquired = true;
      }
      isOwner &&
        this.disposable.setDisposable(this.scheduler.scheduleRecursive(this, scheduleMethod));
    };

    ScheduledObserver.prototype.dispose = function () {
      __super__.prototype.dispose.call(this);
      this.disposable.dispose();
    };

    return ScheduledObserver;
  }(AbstractObserver));

  var ObservableBase = Rx.ObservableBase = (function (__super__) {
    inherits(ObservableBase, __super__);

    function fixSubscriber(subscriber) {
      return subscriber && isFunction(subscriber.dispose) ? subscriber :
        isFunction(subscriber) ? disposableCreate(subscriber) : disposableEmpty;
    }

    function setDisposable(s, state) {
      var ado = state[0], self = state[1];
      var sub = tryCatch(self.subscribeCore).call(self, ado);
      if (sub === errorObj && !ado.fail(errorObj.e)) { thrower(errorObj.e); }
      ado.setDisposable(fixSubscriber(sub));
    }

    function ObservableBase() {
      __super__.call(this);
    }

    ObservableBase.prototype._subscribe = function (o) {
      var ado = new AutoDetachObserver(o), state = [ado, this];

      if (currentThreadScheduler.scheduleRequired()) {
        currentThreadScheduler.schedule(state, setDisposable);
      } else {
        setDisposable(null, state);
      }
      return ado;
    };

    ObservableBase.prototype.subscribeCore = notImplemented;

    return ObservableBase;
  }(Observable));

var FlatMapObservable = Rx.FlatMapObservable = (function(__super__) {

    inherits(FlatMapObservable, __super__);

    function FlatMapObservable(source, selector, resultSelector, thisArg) {
      this.resultSelector = isFunction(resultSelector) ? resultSelector : null;
      this.selector = bindCallback(isFunction(selector) ? selector : function() { return selector; }, thisArg, 3);
      this.source = source;
      __super__.call(this);
    }

    FlatMapObservable.prototype.subscribeCore = function(o) {
      return this.source.subscribe(new InnerObserver(o, this.selector, this.resultSelector, this));
    };

    inherits(InnerObserver, AbstractObserver);
    function InnerObserver(observer, selector, resultSelector, source) {
      this.i = 0;
      this.selector = selector;
      this.resultSelector = resultSelector;
      this.source = source;
      this.o = observer;
      AbstractObserver.call(this);
    }

    InnerObserver.prototype._wrapResult = function(result, x, i) {
      return this.resultSelector ?
        result.map(function(y, i2) { return this.resultSelector(x, y, i, i2); }, this) :
        result;
    };

    InnerObserver.prototype.next = function(x) {
      var i = this.i++;
      var result = tryCatch(this.selector)(x, i, this.source);
      if (result === errorObj) { return this.o.onError(result.e); }

      isPromise(result) && (result = observableFromPromise(result));
      (isArrayLike(result) || isIterable(result)) && (result = Observable.from(result));
      this.o.onNext(this._wrapResult(result, x, i));
    };

    InnerObserver.prototype.error = function(e) { this.o.onError(e); };

    InnerObserver.prototype.completed = function() { this.o.onCompleted(); };

    return FlatMapObservable;

}(ObservableBase));

  var Enumerable = Rx.internals.Enumerable = function () { };

  function IsDisposedDisposable(state) {
    this._s = state;
    this.isDisposed = false;
  }

  IsDisposedDisposable.prototype.dispose = function () {
    if (!this.isDisposed) {
      this.isDisposed = true;
      this._s.isDisposed = true;
    }
  };

  var ConcatEnumerableObservable = (function(__super__) {
    inherits(ConcatEnumerableObservable, __super__);
    function ConcatEnumerableObservable(sources) {
      this.sources = sources;
      __super__.call(this);
    }

    function scheduleMethod(state, recurse) {
      if (state.isDisposed) { return; }
      var currentItem = tryCatch(state.e.next).call(state.e);
      if (currentItem === errorObj) { return state.o.onError(currentItem.e); }
      if (currentItem.done) { return state.o.onCompleted(); }

      // Check if promise
      var currentValue = currentItem.value;
      isPromise(currentValue) && (currentValue = observableFromPromise(currentValue));

      var d = new SingleAssignmentDisposable();
      state.subscription.setDisposable(d);
      d.setDisposable(currentValue.subscribe(new InnerObserver(state, recurse)));
    }

    ConcatEnumerableObservable.prototype.subscribeCore = function (o) {
      var subscription = new SerialDisposable();
      var state = {
        isDisposed: false,
        o: o,
        subscription: subscription,
        e: this.sources[$iterator$]()
      };

      var cancelable = currentThreadScheduler.scheduleRecursive(state, scheduleMethod);
      return new NAryDisposable([subscription, cancelable, new IsDisposedDisposable(state)]);
    };

    function InnerObserver(state, recurse) {
      this._state = state;
      this._recurse = recurse;
      AbstractObserver.call(this);
    }

    inherits(InnerObserver, AbstractObserver);

    InnerObserver.prototype.next = function (x) { this._state.o.onNext(x); };
    InnerObserver.prototype.error = function (e) { this._state.o.onError(e); };
    InnerObserver.prototype.completed = function () { this._recurse(this._state); };

    return ConcatEnumerableObservable;
  }(ObservableBase));

  Enumerable.prototype.concat = function () {
    return new ConcatEnumerableObservable(this);
  };

  var CatchErrorObservable = (function(__super__) {
    function CatchErrorObservable(sources) {
      this.sources = sources;
      __super__.call(this);
    }

    inherits(CatchErrorObservable, __super__);

    function scheduleMethod(state, recurse) {
      if (state.isDisposed) { return; }
      var currentItem = tryCatch(state.e.next).call(state.e);
      if (currentItem === errorObj) { return state.o.onError(currentItem.e); }
      if (currentItem.done) { return state.lastError !== null ? state.o.onError(state.lastError) : state.o.onCompleted(); }

      var currentValue = currentItem.value;
      isPromise(currentValue) && (currentValue = observableFromPromise(currentValue));

      var d = new SingleAssignmentDisposable();
      state.subscription.setDisposable(d);
      d.setDisposable(currentValue.subscribe(new InnerObserver(state, recurse)));
    }

    CatchErrorObservable.prototype.subscribeCore = function (o) {
      var subscription = new SerialDisposable();
      var state = {
        isDisposed: false,
        e: this.sources[$iterator$](),
        subscription: subscription,
        lastError: null,
        o: o
      };

      var cancelable = currentThreadScheduler.scheduleRecursive(state, scheduleMethod);
      return new NAryDisposable([subscription, cancelable, new IsDisposedDisposable(state)]);
    };

    function InnerObserver(state, recurse) {
      this._state = state;
      this._recurse = recurse;
      AbstractObserver.call(this);
    }

    inherits(InnerObserver, AbstractObserver);

    InnerObserver.prototype.next = function (x) { this._state.o.onNext(x); };
    InnerObserver.prototype.error = function (e) { this._state.lastError = e; this._recurse(this._state); };
    InnerObserver.prototype.completed = function () { this._state.o.onCompleted(); };

    return CatchErrorObservable;
  }(ObservableBase));

  Enumerable.prototype.catchError = function () {
    return new CatchErrorObservable(this);
  };

  var RepeatEnumerable = (function (__super__) {
    inherits(RepeatEnumerable, __super__);
    function RepeatEnumerable(v, c) {
      this.v = v;
      this.c = c == null ? -1 : c;
    }

    RepeatEnumerable.prototype[$iterator$] = function () {
      return new RepeatEnumerator(this);
    };

    function RepeatEnumerator(p) {
      this.v = p.v;
      this.l = p.c;
    }

    RepeatEnumerator.prototype.next = function () {
      if (this.l === 0) { return doneEnumerator; }
      if (this.l > 0) { this.l--; }
      return { done: false, value: this.v };
    };

    return RepeatEnumerable;
  }(Enumerable));

  var enumerableRepeat = Enumerable.repeat = function (value, repeatCount) {
    return new RepeatEnumerable(value, repeatCount);
  };

  var OfEnumerable = (function(__super__) {
    inherits(OfEnumerable, __super__);
    function OfEnumerable(s, fn, thisArg) {
      this.s = s;
      this.fn = fn ? bindCallback(fn, thisArg, 3) : null;
    }
    OfEnumerable.prototype[$iterator$] = function () {
      return new OfEnumerator(this);
    };

    function OfEnumerator(p) {
      this.i = -1;
      this.s = p.s;
      this.l = this.s.length;
      this.fn = p.fn;
    }

    OfEnumerator.prototype.next = function () {
     return ++this.i < this.l ?
       { done: false, value: !this.fn ? this.s[this.i] : this.fn(this.s[this.i], this.i, this.s) } :
       doneEnumerator;
    };

    return OfEnumerable;
  }(Enumerable));

  var enumerableOf = Enumerable.of = function (source, selector, thisArg) {
    return new OfEnumerable(source, selector, thisArg);
  };

  var ToArrayObservable = (function(__super__) {
    inherits(ToArrayObservable, __super__);
    function ToArrayObservable(source) {
      this.source = source;
      __super__.call(this);
    }

    ToArrayObservable.prototype.subscribeCore = function(o) {
      return this.source.subscribe(new InnerObserver(o));
    };

    inherits(InnerObserver, AbstractObserver);
    function InnerObserver(o) {
      this.o = o;
      this.a = [];
      AbstractObserver.call(this);
    }
    
    InnerObserver.prototype.next = function (x) { this.a.push(x); };
    InnerObserver.prototype.error = function (e) { this.o.onError(e);  };
    InnerObserver.prototype.completed = function () { this.o.onNext(this.a); this.o.onCompleted(); };

    return ToArrayObservable;
  }(ObservableBase));

  /**
  * Creates an array from an observable sequence.
  * @returns {Observable} An observable sequence containing a single element with a list containing all the elements of the source sequence.
  */
  observableProto.toArray = function () {
    return new ToArrayObservable(this);
  };

  /**
   *  Creates an observable sequence from a specified subscribe method implementation.
   * @example
   *  var res = Rx.Observable.create(function (observer) { return function () { } );
   *  var res = Rx.Observable.create(function (observer) { return Rx.Disposable.empty; } );
   *  var res = Rx.Observable.create(function (observer) { } );
   * @param {Function} subscribe Implementation of the resulting observable sequence's subscribe method, returning a function that will be wrapped in a Disposable.
   * @returns {Observable} The observable sequence with the specified implementation for the Subscribe method.
   */
  Observable.create = function (subscribe, parent) {
    return new AnonymousObservable(subscribe, parent);
  };

  var Defer = (function(__super__) {
    inherits(Defer, __super__);
    function Defer(factory) {
      this._f = factory;
      __super__.call(this);
    }

    Defer.prototype.subscribeCore = function (o) {
      var result = tryCatch(this._f)();
      if (result === errorObj) { return observableThrow(result.e).subscribe(o);}
      isPromise(result) && (result = observableFromPromise(result));
      return result.subscribe(o);
    };

    return Defer;
  }(ObservableBase));

  /**
   *  Returns an observable sequence that invokes the specified factory function whenever a new observer subscribes.
   *
   * @example
   *  var res = Rx.Observable.defer(function () { return Rx.Observable.fromArray([1,2,3]); });
   * @param {Function} observableFactory Observable factory function to invoke for each observer that subscribes to the resulting sequence or Promise.
   * @returns {Observable} An observable sequence whose observers trigger an invocation of the given observable factory function.
   */
  var observableDefer = Observable.defer = function (observableFactory) {
    return new Defer(observableFactory);
  };

  var EmptyObservable = (function(__super__) {
    inherits(EmptyObservable, __super__);
    function EmptyObservable(scheduler) {
      this.scheduler = scheduler;
      __super__.call(this);
    }

    EmptyObservable.prototype.subscribeCore = function (observer) {
      var sink = new EmptySink(observer, this.scheduler);
      return sink.run();
    };

    function EmptySink(observer, scheduler) {
      this.observer = observer;
      this.scheduler = scheduler;
    }

    function scheduleItem(s, state) {
      state.onCompleted();
      return disposableEmpty;
    }

    EmptySink.prototype.run = function () {
      var state = this.observer;
      return this.scheduler === immediateScheduler ?
        scheduleItem(null, state) :
        this.scheduler.schedule(state, scheduleItem);
    };

    return EmptyObservable;
  }(ObservableBase));

  var EMPTY_OBSERVABLE = new EmptyObservable(immediateScheduler);

  /**
   *  Returns an empty observable sequence, using the specified scheduler to send out the single OnCompleted message.
   *
   * @example
   *  var res = Rx.Observable.empty();
   *  var res = Rx.Observable.empty(Rx.Scheduler.timeout);
   * @param {Scheduler} [scheduler] Scheduler to send the termination call on.
   * @returns {Observable} An observable sequence with no elements.
   */
  var observableEmpty = Observable.empty = function (scheduler) {
    isScheduler(scheduler) || (scheduler = immediateScheduler);
    return scheduler === immediateScheduler ? EMPTY_OBSERVABLE : new EmptyObservable(scheduler);
  };

  var FromObservable = (function(__super__) {
    inherits(FromObservable, __super__);
    function FromObservable(iterable, fn, scheduler) {
      this._iterable = iterable;
      this._fn = fn;
      this._scheduler = scheduler;
      __super__.call(this);
    }

    function createScheduleMethod(o, it, fn) {
      return function loopRecursive(i, recurse) {
        var next = tryCatch(it.next).call(it);
        if (next === errorObj) { return o.onError(next.e); }
        if (next.done) { return o.onCompleted(); }

        var result = next.value;

        if (isFunction(fn)) {
          result = tryCatch(fn)(result, i);
          if (result === errorObj) { return o.onError(result.e); }
        }

        o.onNext(result);
        recurse(i + 1);
      };
    }

    FromObservable.prototype.subscribeCore = function (o) {
      var list = Object(this._iterable),
          it = getIterable(list);

      return this._scheduler.scheduleRecursive(0, createScheduleMethod(o, it, this._fn));
    };

    return FromObservable;
  }(ObservableBase));

  var maxSafeInteger = Math.pow(2, 53) - 1;

  function StringIterable(s) {
    this._s = s;
  }

  StringIterable.prototype[$iterator$] = function () {
    return new StringIterator(this._s);
  };

  function StringIterator(s) {
    this._s = s;
    this._l = s.length;
    this._i = 0;
  }

  StringIterator.prototype[$iterator$] = function () {
    return this;
  };

  StringIterator.prototype.next = function () {
    return this._i < this._l ? { done: false, value: this._s.charAt(this._i++) } : doneEnumerator;
  };

  function ArrayIterable(a) {
    this._a = a;
  }

  ArrayIterable.prototype[$iterator$] = function () {
    return new ArrayIterator(this._a);
  };

  function ArrayIterator(a) {
    this._a = a;
    this._l = toLength(a);
    this._i = 0;
  }

  ArrayIterator.prototype[$iterator$] = function () {
    return this;
  };

  ArrayIterator.prototype.next = function () {
    return this._i < this._l ? { done: false, value: this._a[this._i++] } : doneEnumerator;
  };

  function numberIsFinite(value) {
    return typeof value === 'number' && root.isFinite(value);
  }

  function isNan(n) {
    return n !== n;
  }

  function getIterable(o) {
    var i = o[$iterator$], it;
    if (!i && typeof o === 'string') {
      it = new StringIterable(o);
      return it[$iterator$]();
    }
    if (!i && o.length !== undefined) {
      it = new ArrayIterable(o);
      return it[$iterator$]();
    }
    if (!i) { throw new TypeError('Object is not iterable'); }
    return o[$iterator$]();
  }

  function sign(value) {
    var number = +value;
    if (number === 0) { return number; }
    if (isNaN(number)) { return number; }
    return number < 0 ? -1 : 1;
  }

  function toLength(o) {
    var len = +o.length;
    if (isNaN(len)) { return 0; }
    if (len === 0 || !numberIsFinite(len)) { return len; }
    len = sign(len) * Math.floor(Math.abs(len));
    if (len <= 0) { return 0; }
    if (len > maxSafeInteger) { return maxSafeInteger; }
    return len;
  }

  /**
  * This method creates a new Observable sequence from an array-like or iterable object.
  * @param {Any} arrayLike An array-like or iterable object to convert to an Observable sequence.
  * @param {Function} [mapFn] Map function to call on every element of the array.
  * @param {Any} [thisArg] The context to use calling the mapFn if provided.
  * @param {Scheduler} [scheduler] Optional scheduler to use for scheduling.  If not provided, defaults to Scheduler.currentThread.
  */
  var observableFrom = Observable.from = function (iterable, mapFn, thisArg, scheduler) {
    if (iterable == null) {
      throw new Error('iterable cannot be null.')
    }
    if (mapFn && !isFunction(mapFn)) {
      throw new Error('mapFn when provided must be a function');
    }
    if (mapFn) {
      var mapper = bindCallback(mapFn, thisArg, 2);
    }
    isScheduler(scheduler) || (scheduler = currentThreadScheduler);
    return new FromObservable(iterable, mapper, scheduler);
  }

  var FromArrayObservable = (function(__super__) {
    inherits(FromArrayObservable, __super__);
    function FromArrayObservable(args, scheduler) {
      this._args = args;
      this._scheduler = scheduler;
      __super__.call(this);
    }

    function scheduleMethod(o, args) {
      var len = args.length;
      return function loopRecursive (i, recurse) {
        if (i < len) {
          o.onNext(args[i]);
          recurse(i + 1);
        } else {
          o.onCompleted();
        }
      };
    }

    FromArrayObservable.prototype.subscribeCore = function (o) {
      return this._scheduler.scheduleRecursive(0, scheduleMethod(o, this._args));
    };

    return FromArrayObservable;
  }(ObservableBase));

  /**
  *  Converts an array to an observable sequence, using an optional scheduler to enumerate the array.
  * @deprecated use Observable.from or Observable.of
  * @param {Scheduler} [scheduler] Scheduler to run the enumeration of the input sequence on.
  * @returns {Observable} The observable sequence whose elements are pulled from the given enumerable sequence.
  */
  var observableFromArray = Observable.fromArray = function (array, scheduler) {
    isScheduler(scheduler) || (scheduler = currentThreadScheduler);
    return new FromArrayObservable(array, scheduler)
  };

  var NeverObservable = (function(__super__) {
    inherits(NeverObservable, __super__);
    function NeverObservable() {
      __super__.call(this);
    }

    NeverObservable.prototype.subscribeCore = function (observer) {
      return disposableEmpty;
    };

    return NeverObservable;
  }(ObservableBase));

  var NEVER_OBSERVABLE = new NeverObservable();

  /**
   * Returns a non-terminating observable sequence, which can be used to denote an infinite duration (e.g. when using reactive joins).
   * @returns {Observable} An observable sequence whose observers will never get called.
   */
  var observableNever = Observable.never = function () {
    return NEVER_OBSERVABLE;
  };

  function observableOf (scheduler, array) {
    isScheduler(scheduler) || (scheduler = currentThreadScheduler);
    return new FromArrayObservable(array, scheduler);
  }

  /**
  *  This method creates a new Observable instance with a variable number of arguments, regardless of number or type of the arguments.
  * @returns {Observable} The observable sequence whose elements are pulled from the given arguments.
  */
  Observable.of = function () {
    var len = arguments.length, args = new Array(len);
    for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
    return new FromArrayObservable(args, currentThreadScheduler);
  };

  /**
  *  This method creates a new Observable instance with a variable number of arguments, regardless of number or type of the arguments.
  * @param {Scheduler} scheduler A scheduler to use for scheduling the arguments.
  * @returns {Observable} The observable sequence whose elements are pulled from the given arguments.
  */
  Observable.ofWithScheduler = function (scheduler) {
    var len = arguments.length, args = new Array(len - 1);
    for(var i = 1; i < len; i++) { args[i - 1] = arguments[i]; }
    return new FromArrayObservable(args, scheduler);
  };

  var PairsObservable = (function(__super__) {
    inherits(PairsObservable, __super__);
    function PairsObservable(o, scheduler) {
      this._o = o;
      this._keys = Object.keys(o);
      this._scheduler = scheduler;
      __super__.call(this);
    }

    function scheduleMethod(o, obj, keys) {
      return function loopRecursive(i, recurse) {
        if (i < keys.length) {
          var key = keys[i];
          o.onNext([key, obj[key]]);
          recurse(i + 1);
        } else {
          o.onCompleted();
        }
      };
    }

    PairsObservable.prototype.subscribeCore = function (o) {
      return this._scheduler.scheduleRecursive(0, scheduleMethod(o, this._o, this._keys));
    };

    return PairsObservable;
  }(ObservableBase));

  /**
   * Convert an object into an observable sequence of [key, value] pairs.
   * @param {Object} obj The object to inspect.
   * @param {Scheduler} [scheduler] Scheduler to run the enumeration of the input sequence on.
   * @returns {Observable} An observable sequence of [key, value] pairs from the object.
   */
  Observable.pairs = function (obj, scheduler) {
    scheduler || (scheduler = currentThreadScheduler);
    return new PairsObservable(obj, scheduler);
  };

    var RangeObservable = (function(__super__) {
    inherits(RangeObservable, __super__);
    function RangeObservable(start, count, scheduler) {
      this.start = start;
      this.rangeCount = count;
      this.scheduler = scheduler;
      __super__.call(this);
    }

    function loopRecursive(start, count, o) {
      return function loop (i, recurse) {
        if (i < count) {
          o.onNext(start + i);
          recurse(i + 1);
        } else {
          o.onCompleted();
        }
      };
    }

    RangeObservable.prototype.subscribeCore = function (o) {
      return this.scheduler.scheduleRecursive(
        0,
        loopRecursive(this.start, this.rangeCount, o)
      );
    };

    return RangeObservable;
  }(ObservableBase));

  /**
  *  Generates an observable sequence of integral numbers within a specified range, using the specified scheduler to send out observer messages.
  * @param {Number} start The value of the first integer in the sequence.
  * @param {Number} count The number of sequential integers to generate.
  * @param {Scheduler} [scheduler] Scheduler to run the generator loop on. If not specified, defaults to Scheduler.currentThread.
  * @returns {Observable} An observable sequence that contains a range of sequential integral numbers.
  */
  Observable.range = function (start, count, scheduler) {
    isScheduler(scheduler) || (scheduler = currentThreadScheduler);
    return new RangeObservable(start, count, scheduler);
  };

  var RepeatObservable = (function(__super__) {
    inherits(RepeatObservable, __super__);
    function RepeatObservable(value, repeatCount, scheduler) {
      this.value = value;
      this.repeatCount = repeatCount == null ? -1 : repeatCount;
      this.scheduler = scheduler;
      __super__.call(this);
    }

    RepeatObservable.prototype.subscribeCore = function (observer) {
      var sink = new RepeatSink(observer, this);
      return sink.run();
    };

    return RepeatObservable;
  }(ObservableBase));

  function RepeatSink(observer, parent) {
    this.observer = observer;
    this.parent = parent;
  }

  RepeatSink.prototype.run = function () {
    var observer = this.observer, value = this.parent.value;
    function loopRecursive(i, recurse) {
      if (i === -1 || i > 0) {
        observer.onNext(value);
        i > 0 && i--;
      }
      if (i === 0) { return observer.onCompleted(); }
      recurse(i);
    }

    return this.parent.scheduler.scheduleRecursive(this.parent.repeatCount, loopRecursive);
  };

  /**
   *  Generates an observable sequence that repeats the given element the specified number of times, using the specified scheduler to send out observer messages.
   * @param {Mixed} value Element to repeat.
   * @param {Number} repeatCount [Optiona] Number of times to repeat the element. If not specified, repeats indefinitely.
   * @param {Scheduler} scheduler Scheduler to run the producer loop on. If not specified, defaults to Scheduler.immediate.
   * @returns {Observable} An observable sequence that repeats the given element the specified number of times.
   */
  Observable.repeat = function (value, repeatCount, scheduler) {
    isScheduler(scheduler) || (scheduler = currentThreadScheduler);
    return new RepeatObservable(value, repeatCount, scheduler);
  };

  var JustObservable = (function(__super__) {
    inherits(JustObservable, __super__);
    function JustObservable(value, scheduler) {
      this._value = value;
      this._scheduler = scheduler;
      __super__.call(this);
    }

    JustObservable.prototype.subscribeCore = function (o) {
      var state = [this._value, o];
      return this._scheduler === immediateScheduler ?
        scheduleItem(null, state) :
        this._scheduler.schedule(state, scheduleItem);
    };

    function scheduleItem(s, state) {
      var value = state[0], observer = state[1];
      observer.onNext(value);
      observer.onCompleted();
      return disposableEmpty;
    }

    return JustObservable;
  }(ObservableBase));

  /**
   *  Returns an observable sequence that contains a single element, using the specified scheduler to send out observer messages.
   *  There is an alias called 'just' or browsers <IE9.
   * @param {Mixed} value Single element in the resulting observable sequence.
   * @param {Scheduler} scheduler Scheduler to send the single element on. If not specified, defaults to Scheduler.immediate.
   * @returns {Observable} An observable sequence containing the single specified element.
   */
  var observableReturn = Observable['return'] = Observable.just = function (value, scheduler) {
    isScheduler(scheduler) || (scheduler = immediateScheduler);
    return new JustObservable(value, scheduler);
  };

  var ThrowObservable = (function(__super__) {
    inherits(ThrowObservable, __super__);
    function ThrowObservable(error, scheduler) {
      this._error = error;
      this._scheduler = scheduler;
      __super__.call(this);
    }

    ThrowObservable.prototype.subscribeCore = function (o) {
      var state = [this._error, o];
      return this._scheduler === immediateScheduler ?
        scheduleItem(null, state) :
        this._scheduler.schedule(state, scheduleItem);
    };

    function scheduleItem(s, state) {
      var e = state[0], o = state[1];
      o.onError(e);
      return disposableEmpty;
    }

    return ThrowObservable;
  }(ObservableBase));

  /**
   *  Returns an observable sequence that terminates with an exception, using the specified scheduler to send out the single onError message.
   *  There is an alias to this method called 'throwError' for browsers <IE9.
   * @param {Mixed} error An object used for the sequence's termination.
   * @param {Scheduler} scheduler Scheduler to send the exceptional termination call on. If not specified, defaults to Scheduler.immediate.
   * @returns {Observable} The observable sequence that terminates exceptionally with the specified exception object.
   */
  var observableThrow = Observable['throw'] = function (error, scheduler) {
    isScheduler(scheduler) || (scheduler = immediateScheduler);
    return new ThrowObservable(error, scheduler);
  };

  var CatchObservable = (function (__super__) {
    inherits(CatchObservable, __super__);
    function CatchObservable(source, fn) {
      this.source = source;
      this._fn = fn;
      __super__.call(this);
    }

    CatchObservable.prototype.subscribeCore = function (o) {
      var d1 = new SingleAssignmentDisposable(), subscription = new SerialDisposable();
      subscription.setDisposable(d1);
      d1.setDisposable(this.source.subscribe(new CatchObserver(o, subscription, this._fn)));
      return subscription;
    };

    return CatchObservable;
  }(ObservableBase));

  var CatchObserver = (function(__super__) {
    inherits(CatchObserver, __super__);
    function CatchObserver(o, s, fn) {
      this._o = o;
      this._s = s;
      this._fn = fn;
      __super__.call(this);
    }

    CatchObserver.prototype.next = function (x) { this._o.onNext(x); };
    CatchObserver.prototype.completed = function () { return this._o.onCompleted(); };
    CatchObserver.prototype.error = function (e) {
      var result = tryCatch(this._fn)(e);
      if (result === errorObj) { return this._o.onError(result.e); }
      isPromise(result) && (result = observableFromPromise(result));

      var d = new SingleAssignmentDisposable();
      this._s.setDisposable(d);
      d.setDisposable(result.subscribe(this._o));
    };

    return CatchObserver;
  }(AbstractObserver));

  /**
   * Continues an observable sequence that is terminated by an exception with the next observable sequence.
   * @param {Mixed} handlerOrSecond Exception handler function that returns an observable sequence given the error that occurred in the first sequence, or a second observable sequence used to produce results when an error occurred in the first sequence.
   * @returns {Observable} An observable sequence containing the first sequence's elements, followed by the elements of the handler sequence in case an exception occurred.
   */
  observableProto['catch'] = function (handlerOrSecond) {
    return isFunction(handlerOrSecond) ? new CatchObservable(this, handlerOrSecond) : observableCatch([this, handlerOrSecond]);
  };

  /**
   * Continues an observable sequence that is terminated by an exception with the next observable sequence.
   * @param {Array | Arguments} args Arguments or an array to use as the next sequence if an error occurs.
   * @returns {Observable} An observable sequence containing elements from consecutive source sequences until a source sequence terminates successfully.
   */
  var observableCatch = Observable['catch'] = function () {
    var items;
    if (Array.isArray(arguments[0])) {
      items = arguments[0];
    } else {
      var len = arguments.length;
      items = new Array(len);
      for(var i = 0; i < len; i++) { items[i] = arguments[i]; }
    }
    return enumerableOf(items).catchError();
  };

  /**
   * Merges the specified observable sequences into one observable sequence by using the selector function whenever any of the observable sequences or Promises produces an element.
   * This can be in the form of an argument list of observables or an array.
   *
   * @example
   * 1 - obs = observable.combineLatest(obs1, obs2, obs3, function (o1, o2, o3) { return o1 + o2 + o3; });
   * 2 - obs = observable.combineLatest([obs1, obs2, obs3], function (o1, o2, o3) { return o1 + o2 + o3; });
   * @returns {Observable} An observable sequence containing the result of combining elements of the sources using the specified result selector function.
   */
  observableProto.combineLatest = function () {
    var len = arguments.length, args = new Array(len);
    for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
    if (Array.isArray(args[0])) {
      args[0].unshift(this);
    } else {
      args.unshift(this);
    }
    return combineLatest.apply(this, args);
  };

  function falseFactory() { return false; }
  function argumentsToArray() {
    var len = arguments.length, args = new Array(len);
    for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
    return args;
  }

  var CombineLatestObservable = (function(__super__) {
    inherits(CombineLatestObservable, __super__);
    function CombineLatestObservable(params, cb) {
      this._params = params;
      this._cb = cb;
      __super__.call(this);
    }

    CombineLatestObservable.prototype.subscribeCore = function(observer) {
      var len = this._params.length,
          subscriptions = new Array(len);

      var state = {
        hasValue: arrayInitialize(len, falseFactory),
        hasValueAll: false,
        isDone: arrayInitialize(len, falseFactory),
        values: new Array(len)
      };

      for (var i = 0; i < len; i++) {
        var source = this._params[i], sad = new SingleAssignmentDisposable();
        subscriptions[i] = sad;
        isPromise(source) && (source = observableFromPromise(source));
        sad.setDisposable(source.subscribe(new CombineLatestObserver(observer, i, this._cb, state)));
      }

      return new NAryDisposable(subscriptions);
    };

    return CombineLatestObservable;
  }(ObservableBase));

  var CombineLatestObserver = (function (__super__) {
    inherits(CombineLatestObserver, __super__);
    function CombineLatestObserver(o, i, cb, state) {
      this._o = o;
      this._i = i;
      this._cb = cb;
      this._state = state;
      __super__.call(this);
    }

    function notTheSame(i) {
      return function (x, j) {
        return j !== i;
      };
    }

    CombineLatestObserver.prototype.next = function (x) {
      this._state.values[this._i] = x;
      this._state.hasValue[this._i] = true;
      if (this._state.hasValueAll || (this._state.hasValueAll = this._state.hasValue.every(identity))) {
        var res = tryCatch(this._cb).apply(null, this._state.values);
        if (res === errorObj) { return this._o.onError(res.e); }
        this._o.onNext(res);
      } else if (this._state.isDone.filter(notTheSame(this._i)).every(identity)) {
        this._o.onCompleted();
      }
    };

    CombineLatestObserver.prototype.error = function (e) {
      this._o.onError(e);
    };

    CombineLatestObserver.prototype.completed = function () {
      this._state.isDone[this._i] = true;
      this._state.isDone.every(identity) && this._o.onCompleted();
    };

    return CombineLatestObserver;
  }(AbstractObserver));

  /**
  * Merges the specified observable sequences into one observable sequence by using the selector function whenever any of the observable sequences or Promises produces an element.
  *
  * @example
  * 1 - obs = Rx.Observable.combineLatest(obs1, obs2, obs3, function (o1, o2, o3) { return o1 + o2 + o3; });
  * 2 - obs = Rx.Observable.combineLatest([obs1, obs2, obs3], function (o1, o2, o3) { return o1 + o2 + o3; });
  * @returns {Observable} An observable sequence containing the result of combining elements of the sources using the specified result selector function.
  */
  var combineLatest = Observable.combineLatest = function () {
    var len = arguments.length, args = new Array(len);
    for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
    var resultSelector = isFunction(args[len - 1]) ? args.pop() : argumentsToArray;
    Array.isArray(args[0]) && (args = args[0]);
    return new CombineLatestObservable(args, resultSelector);
  };

  /**
   * Concatenates all the observable sequences.  This takes in either an array or variable arguments to concatenate.
   * @returns {Observable} An observable sequence that contains the elements of each given sequence, in sequential order.
   */
  observableProto.concat = function () {
    for(var args = [], i = 0, len = arguments.length; i < len; i++) { args.push(arguments[i]); }
    args.unshift(this);
    return observableConcat.apply(null, args);
  };

  var ConcatObserver = (function(__super__) {
    inherits(ConcatObserver, __super__);
    function ConcatObserver(s, fn) {
      this._s = s;
      this._fn = fn;
      __super__.call(this);
    }

    ConcatObserver.prototype.next = function (x) { this._s.o.onNext(x); };
    ConcatObserver.prototype.error = function (e) { this._s.o.onError(e); };
    ConcatObserver.prototype.completed = function () { this._s.i++; this._fn(this._s); };

    return ConcatObserver;
  }(AbstractObserver));

  var ConcatObservable = (function(__super__) {
    inherits(ConcatObservable, __super__);
    function ConcatObservable(sources) {
      this._sources = sources;
      __super__.call(this);
    }

    function scheduleRecursive (state, recurse) {
      if (state.disposable.isDisposed) { return; }
      if (state.i === state.sources.length) { return state.o.onCompleted(); }

      // Check if promise
      var currentValue = state.sources[state.i];
      isPromise(currentValue) && (currentValue = observableFromPromise(currentValue));

      var d = new SingleAssignmentDisposable();
      state.subscription.setDisposable(d);
      d.setDisposable(currentValue.subscribe(new ConcatObserver(state, recurse)));
    }

    ConcatObservable.prototype.subscribeCore = function(o) {
      var subscription = new SerialDisposable();
      var disposable = disposableCreate(noop);
      var state = {
        o: o,
        i: 0,
        subscription: subscription,
        disposable: disposable,
        sources: this._sources
      };

      var cancelable = immediateScheduler.scheduleRecursive(state, scheduleRecursive);
      return new NAryDisposable([subscription, disposable, cancelable]);
    };

    return ConcatObservable;
  }(ObservableBase));

  /**
   * Concatenates all the observable sequences.
   * @param {Array | Arguments} args Arguments or an array to concat to the observable sequence.
   * @returns {Observable} An observable sequence that contains the elements of each given sequence, in sequential order.
   */
  var observableConcat = Observable.concat = function () {
    var args;
    if (Array.isArray(arguments[0])) {
      args = arguments[0];
    } else {
      args = new Array(arguments.length);
      for(var i = 0, len = arguments.length; i < len; i++) { args[i] = arguments[i]; }
    }
    return new ConcatObservable(args);
  };

  /**
   * Concatenates an observable sequence of observable sequences.
   * @returns {Observable} An observable sequence that contains the elements of each observed inner sequence, in sequential order.
   */
  observableProto.concatAll = function () {
    return this.merge(1);
  };

  var MergeObservable = (function (__super__) {
    inherits(MergeObservable, __super__);

    function MergeObservable(source, maxConcurrent) {
      this.source = source;
      this.maxConcurrent = maxConcurrent;
      __super__.call(this);
    }

    MergeObservable.prototype.subscribeCore = function(observer) {
      var g = new CompositeDisposable();
      g.add(this.source.subscribe(new MergeObserver(observer, this.maxConcurrent, g)));
      return g;
    };

    return MergeObservable;

  }(ObservableBase));

  var MergeObserver = (function (__super__) {
    function MergeObserver(o, max, g) {
      this.o = o;
      this.max = max;
      this.g = g;
      this.done = false;
      this.q = [];
      this.activeCount = 0;
      __super__.call(this);
    }

    inherits(MergeObserver, __super__);

    MergeObserver.prototype.handleSubscribe = function (xs) {
      var sad = new SingleAssignmentDisposable();
      this.g.add(sad);
      isPromise(xs) && (xs = observableFromPromise(xs));
      sad.setDisposable(xs.subscribe(new InnerObserver(this, sad)));
    };

    MergeObserver.prototype.next = function (innerSource) {
      if(this.activeCount < this.max) {
        this.activeCount++;
        this.handleSubscribe(innerSource);
      } else {
        this.q.push(innerSource);
      }
    };
    MergeObserver.prototype.error = function (e) { this.o.onError(e); };
    MergeObserver.prototype.completed = function () { this.done = true; this.activeCount === 0 && this.o.onCompleted(); };

    function InnerObserver(parent, sad) {
      this.parent = parent;
      this.sad = sad;
      __super__.call(this);
    }

    inherits(InnerObserver, __super__);

    InnerObserver.prototype.next = function (x) { this.parent.o.onNext(x); };
    InnerObserver.prototype.error = function (e) { this.parent.o.onError(e); };
    InnerObserver.prototype.completed = function () {
      this.parent.g.remove(this.sad);
      if (this.parent.q.length > 0) {
        this.parent.handleSubscribe(this.parent.q.shift());
      } else {
        this.parent.activeCount--;
        this.parent.done && this.parent.activeCount === 0 && this.parent.o.onCompleted();
      }
    };

    return MergeObserver;
  }(AbstractObserver));

  /**
  * Merges an observable sequence of observable sequences into an observable sequence, limiting the number of concurrent subscriptions to inner sequences.
  * Or merges two observable sequences into a single observable sequence.
  * @param {Mixed} [maxConcurrentOrOther] Maximum number of inner observable sequences being subscribed to concurrently or the second observable sequence.
  * @returns {Observable} The observable sequence that merges the elements of the inner sequences.
  */
  observableProto.merge = function (maxConcurrentOrOther) {
    return typeof maxConcurrentOrOther !== 'number' ?
      observableMerge(this, maxConcurrentOrOther) :
      new MergeObservable(this, maxConcurrentOrOther);
  };

  /**
   * Merges all the observable sequences into a single observable sequence.
   * The scheduler is optional and if not specified, the immediate scheduler is used.
   * @returns {Observable} The observable sequence that merges the elements of the observable sequences.
   */
  var observableMerge = Observable.merge = function () {
    var scheduler, sources = [], i, len = arguments.length;
    if (!arguments[0]) {
      scheduler = immediateScheduler;
      for(i = 1; i < len; i++) { sources.push(arguments[i]); }
    } else if (isScheduler(arguments[0])) {
      scheduler = arguments[0];
      for(i = 1; i < len; i++) { sources.push(arguments[i]); }
    } else {
      scheduler = immediateScheduler;
      for(i = 0; i < len; i++) { sources.push(arguments[i]); }
    }
    if (Array.isArray(sources[0])) {
      sources = sources[0];
    }
    return observableOf(scheduler, sources).mergeAll();
  };

  var CompositeError = Rx.CompositeError = function(errors) {
    this.innerErrors = errors;
    this.message = 'This contains multiple errors. Check the innerErrors';
    Error.call(this);
  };
  CompositeError.prototype = Object.create(Error.prototype);
  CompositeError.prototype.name = 'CompositeError';

  var MergeDelayErrorObservable = (function(__super__) {
    inherits(MergeDelayErrorObservable, __super__);
    function MergeDelayErrorObservable(source) {
      this.source = source;
      __super__.call(this);
    }

    MergeDelayErrorObservable.prototype.subscribeCore = function (o) {
      var group = new CompositeDisposable(),
        m = new SingleAssignmentDisposable(),
        state = { isStopped: false, errors: [], o: o };

      group.add(m);
      m.setDisposable(this.source.subscribe(new MergeDelayErrorObserver(group, state)));

      return group;
    };

    return MergeDelayErrorObservable;
  }(ObservableBase));

  var MergeDelayErrorObserver = (function(__super__) {
    inherits(MergeDelayErrorObserver, __super__);
    function MergeDelayErrorObserver(group, state) {
      this._group = group;
      this._state = state;
      __super__.call(this);
    }

    function setCompletion(o, errors) {
      if (errors.length === 0) {
        o.onCompleted();
      } else if (errors.length === 1) {
        o.onError(errors[0]);
      } else {
        o.onError(new CompositeError(errors));
      }
    }

    MergeDelayErrorObserver.prototype.next = function (x) {
      var inner = new SingleAssignmentDisposable();
      this._group.add(inner);

      // Check for promises support
      isPromise(x) && (x = observableFromPromise(x));
      inner.setDisposable(x.subscribe(new InnerObserver(inner, this._group, this._state)));
    };

    MergeDelayErrorObserver.prototype.error = function (e) {
      this._state.errors.push(e);
      this._state.isStopped = true;
      this._group.length === 1 && setCompletion(this._state.o, this._state.errors);
    };

    MergeDelayErrorObserver.prototype.completed = function () {
      this._state.isStopped = true;
      this._group.length === 1 && setCompletion(this._state.o, this._state.errors);
    };

    inherits(InnerObserver, __super__);
    function InnerObserver(inner, group, state) {
      this._inner = inner;
      this._group = group;
      this._state = state;
      __super__.call(this);
    }

    InnerObserver.prototype.next = function (x) { this._state.o.onNext(x); };
    InnerObserver.prototype.error = function (e) {
      this._state.errors.push(e);
      this._group.remove(this._inner);
      this._state.isStopped && this._group.length === 1 && setCompletion(this._state.o, this._state.errors);
    };
    InnerObserver.prototype.completed = function () {
      this._group.remove(this._inner);
      this._state.isStopped && this._group.length === 1 && setCompletion(this._state.o, this._state.errors);
    };

    return MergeDelayErrorObserver;
  }(AbstractObserver));

  /**
  * Flattens an Observable that emits Observables into one Observable, in a way that allows an Observer to
  * receive all successfully emitted items from all of the source Observables without being interrupted by
  * an error notification from one of them.
  *
  * This behaves like Observable.prototype.mergeAll except that if any of the merged Observables notify of an
  * error via the Observer's onError, mergeDelayError will refrain from propagating that
  * error notification until all of the merged Observables have finished emitting items.
  * @param {Array | Arguments} args Arguments or an array to merge.
  * @returns {Observable} an Observable that emits all of the items emitted by the Observables emitted by the Observable
  */
  Observable.mergeDelayError = function() {
    var args;
    if (Array.isArray(arguments[0])) {
      args = arguments[0];
    } else {
      var len = arguments.length;
      args = new Array(len);
      for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
    }
    var source = observableOf(null, args);
    return new MergeDelayErrorObservable(source);
  };

  var MergeAllObservable = (function (__super__) {
    inherits(MergeAllObservable, __super__);

    function MergeAllObservable(source) {
      this.source = source;
      __super__.call(this);
    }

    MergeAllObservable.prototype.subscribeCore = function (o) {
      var g = new CompositeDisposable(), m = new SingleAssignmentDisposable();
      g.add(m);
      m.setDisposable(this.source.subscribe(new MergeAllObserver(o, g)));
      return g;
    };

    return MergeAllObservable;
  }(ObservableBase));

  var MergeAllObserver = (function (__super__) {
    function MergeAllObserver(o, g) {
      this.o = o;
      this.g = g;
      this.done = false;
      __super__.call(this);
    }

    inherits(MergeAllObserver, __super__);

    MergeAllObserver.prototype.next = function(innerSource) {
      var sad = new SingleAssignmentDisposable();
      this.g.add(sad);
      isPromise(innerSource) && (innerSource = observableFromPromise(innerSource));
      sad.setDisposable(innerSource.subscribe(new InnerObserver(this, sad)));
    };

    MergeAllObserver.prototype.error = function (e) {
      this.o.onError(e);
    };

    MergeAllObserver.prototype.completed = function () {
      this.done = true;
      this.g.length === 1 && this.o.onCompleted();
    };

    function InnerObserver(parent, sad) {
      this.parent = parent;
      this.sad = sad;
      __super__.call(this);
    }

    inherits(InnerObserver, __super__);

    InnerObserver.prototype.next = function (x) {
      this.parent.o.onNext(x);
    };
    InnerObserver.prototype.error = function (e) {
      this.parent.o.onError(e);
    };
    InnerObserver.prototype.completed = function () {
      this.parent.g.remove(this.sad);
      this.parent.done && this.parent.g.length === 1 && this.parent.o.onCompleted();
    };

    return MergeAllObserver;
  }(AbstractObserver));

  /**
  * Merges an observable sequence of observable sequences into an observable sequence.
  * @returns {Observable} The observable sequence that merges the elements of the inner sequences.
  */
  observableProto.mergeAll = function () {
    return new MergeAllObservable(this);
  };

  var SkipUntilObservable = (function(__super__) {
    inherits(SkipUntilObservable, __super__);

    function SkipUntilObservable(source, other) {
      this._s = source;
      this._o = isPromise(other) ? observableFromPromise(other) : other;
      this._open = false;
      __super__.call(this);
    }

    SkipUntilObservable.prototype.subscribeCore = function(o) {
      var leftSubscription = new SingleAssignmentDisposable();
      leftSubscription.setDisposable(this._s.subscribe(new SkipUntilSourceObserver(o, this)));

      isPromise(this._o) && (this._o = observableFromPromise(this._o));

      var rightSubscription = new SingleAssignmentDisposable();
      rightSubscription.setDisposable(this._o.subscribe(new SkipUntilOtherObserver(o, this, rightSubscription)));

      return new BinaryDisposable(leftSubscription, rightSubscription);
    };

    return SkipUntilObservable;
  }(ObservableBase));

  var SkipUntilSourceObserver = (function(__super__) {
    inherits(SkipUntilSourceObserver, __super__);
    function SkipUntilSourceObserver(o, p) {
      this._o = o;
      this._p = p;
      __super__.call(this);
    }

    SkipUntilSourceObserver.prototype.next = function (x) {
      this._p._open && this._o.onNext(x);
    };

    SkipUntilSourceObserver.prototype.error = function (err) {
      this._o.onError(err);
    };

    SkipUntilSourceObserver.prototype.onCompleted = function () {
      this._p._open && this._o.onCompleted();
    };

    return SkipUntilSourceObserver;
  }(AbstractObserver));

  var SkipUntilOtherObserver = (function(__super__) {
    inherits(SkipUntilOtherObserver, __super__);
    function SkipUntilOtherObserver(o, p, r) {
      this._o = o;
      this._p = p;
      this._r = r;
      __super__.call(this);
    }

    SkipUntilOtherObserver.prototype.next = function () {
      this._p._open = true;
      this._r.dispose();
    };

    SkipUntilOtherObserver.prototype.error = function (err) {
      this._o.onError(err);
    };

    SkipUntilOtherObserver.prototype.onCompleted = function () {
      this._r.dispose();
    };

    return SkipUntilOtherObserver;
  }(AbstractObserver));

  /**
   * Returns the values from the source observable sequence only after the other observable sequence produces a value.
   * @param {Observable | Promise} other The observable sequence or Promise that triggers propagation of elements of the source sequence.
   * @returns {Observable} An observable sequence containing the elements of the source sequence starting from the point the other sequence triggered propagation.
   */
  observableProto.skipUntil = function (other) {
    return new SkipUntilObservable(this, other);
  };

  var SwitchObservable = (function(__super__) {
    inherits(SwitchObservable, __super__);
    function SwitchObservable(source) {
      this.source = source;
      __super__.call(this);
    }

    SwitchObservable.prototype.subscribeCore = function (o) {
      var inner = new SerialDisposable(), s = this.source.subscribe(new SwitchObserver(o, inner));
      return new BinaryDisposable(s, inner);
    };

    inherits(SwitchObserver, AbstractObserver);
    function SwitchObserver(o, inner) {
      this.o = o;
      this.inner = inner;
      this.stopped = false;
      this.latest = 0;
      this.hasLatest = false;
      AbstractObserver.call(this);
    }

    SwitchObserver.prototype.next = function (innerSource) {
      var d = new SingleAssignmentDisposable(), id = ++this.latest;
      this.hasLatest = true;
      this.inner.setDisposable(d);
      isPromise(innerSource) && (innerSource = observableFromPromise(innerSource));
      d.setDisposable(innerSource.subscribe(new InnerObserver(this, id)));
    };

    SwitchObserver.prototype.error = function (e) {
      this.o.onError(e);
    };

    SwitchObserver.prototype.completed = function () {
      this.stopped = true;
      !this.hasLatest && this.o.onCompleted();
    };

    inherits(InnerObserver, AbstractObserver);
    function InnerObserver(parent, id) {
      this.parent = parent;
      this.id = id;
      AbstractObserver.call(this);
    }
    InnerObserver.prototype.next = function (x) {
      this.parent.latest === this.id && this.parent.o.onNext(x);
    };

    InnerObserver.prototype.error = function (e) {
      this.parent.latest === this.id && this.parent.o.onError(e);
    };

    InnerObserver.prototype.completed = function () {
      if (this.parent.latest === this.id) {
        this.parent.hasLatest = false;
        this.parent.stopped && this.parent.o.onCompleted();
      }
    };

    return SwitchObservable;
  }(ObservableBase));

  /**
  * Transforms an observable sequence of observable sequences into an observable sequence producing values only from the most recent observable sequence.
  * @returns {Observable} The observable sequence that at any point in time produces the elements of the most recent inner observable sequence that has been received.
  */
  observableProto['switch'] = observableProto.switchLatest = function () {
    return new SwitchObservable(this);
  };

  var TakeUntilObservable = (function(__super__) {
    inherits(TakeUntilObservable, __super__);

    function TakeUntilObservable(source, other) {
      this.source = source;
      this.other = isPromise(other) ? observableFromPromise(other) : other;
      __super__.call(this);
    }

    TakeUntilObservable.prototype.subscribeCore = function(o) {
      return new BinaryDisposable(
        this.source.subscribe(o),
        this.other.subscribe(new TakeUntilObserver(o))
      );
    };

    return TakeUntilObservable;
  }(ObservableBase));

  var TakeUntilObserver = (function(__super__) {
    inherits(TakeUntilObserver, __super__);
    function TakeUntilObserver(o) {
      this._o = o;
      __super__.call(this);
    }

    TakeUntilObserver.prototype.next = function () {
      this._o.onCompleted();
    };

    TakeUntilObserver.prototype.error = function (err) {
      this._o.onError(err);
    };

    TakeUntilObserver.prototype.onCompleted = noop;

    return TakeUntilObserver;
  }(AbstractObserver));

  /**
   * Returns the values from the source observable sequence until the other observable sequence produces a value.
   * @param {Observable | Promise} other Observable sequence or Promise that terminates propagation of elements of the source sequence.
   * @returns {Observable} An observable sequence containing the elements of the source sequence up to the point the other sequence interrupted further propagation.
   */
  observableProto.takeUntil = function (other) {
    return new TakeUntilObservable(this, other);
  };

  function falseFactory() { return false; }
  function argumentsToArray() {
    var len = arguments.length, args = new Array(len);
    for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
    return args;
  }

  var WithLatestFromObservable = (function(__super__) {
    inherits(WithLatestFromObservable, __super__);
    function WithLatestFromObservable(source, sources, resultSelector) {
      this._s = source;
      this._ss = sources;
      this._cb = resultSelector;
      __super__.call(this);
    }

    WithLatestFromObservable.prototype.subscribeCore = function (o) {
      var len = this._ss.length;
      var state = {
        hasValue: arrayInitialize(len, falseFactory),
        hasValueAll: false,
        values: new Array(len)
      };

      var n = this._ss.length, subscriptions = new Array(n + 1);
      for (var i = 0; i < n; i++) {
        var other = this._ss[i], sad = new SingleAssignmentDisposable();
        isPromise(other) && (other = observableFromPromise(other));
        sad.setDisposable(other.subscribe(new WithLatestFromOtherObserver(o, i, state)));
        subscriptions[i] = sad;
      }

      var outerSad = new SingleAssignmentDisposable();
      outerSad.setDisposable(this._s.subscribe(new WithLatestFromSourceObserver(o, this._cb, state)));
      subscriptions[n] = outerSad;

      return new NAryDisposable(subscriptions);
    };

    return WithLatestFromObservable;
  }(ObservableBase));

  var WithLatestFromOtherObserver = (function (__super__) {
    inherits(WithLatestFromOtherObserver, __super__);
    function WithLatestFromOtherObserver(o, i, state) {
      this._o = o;
      this._i = i;
      this._state = state;
      __super__.call(this);
    }

    WithLatestFromOtherObserver.prototype.next = function (x) {
      this._state.values[this._i] = x;
      this._state.hasValue[this._i] = true;
      this._state.hasValueAll = this._state.hasValue.every(identity);
    };

    WithLatestFromOtherObserver.prototype.error = function (e) {
      this._o.onError(e);
    };

    WithLatestFromOtherObserver.prototype.completed = noop;

    return WithLatestFromOtherObserver;
  }(AbstractObserver));

  var WithLatestFromSourceObserver = (function (__super__) {
    inherits(WithLatestFromSourceObserver, __super__);
    function WithLatestFromSourceObserver(o, cb, state) {
      this._o = o;
      this._cb = cb;
      this._state = state;
      __super__.call(this);
    }

    WithLatestFromSourceObserver.prototype.next = function (x) {
      var allValues = [x].concat(this._state.values);
      if (!this._state.hasValueAll) { return; }
      var res = tryCatch(this._cb).apply(null, allValues);
      if (res === errorObj) { return this._o.onError(res.e); }
      this._o.onNext(res);
    };

    WithLatestFromSourceObserver.prototype.error = function (e) {
      this._o.onError(e);
    };

    WithLatestFromSourceObserver.prototype.completed = function () {
      this._o.onCompleted();
    };

    return WithLatestFromSourceObserver;
  }(AbstractObserver));

  /**
   * Merges the specified observable sequences into one observable sequence by using the selector function only when the (first) source observable sequence produces an element.
   * @returns {Observable} An observable sequence containing the result of combining elements of the sources using the specified result selector function.
   */
  observableProto.withLatestFrom = function () {
    if (arguments.length === 0) { throw new Error('invalid arguments'); }

    var len = arguments.length, args = new Array(len);
    for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
    var resultSelector = isFunction(args[len - 1]) ? args.pop() : argumentsToArray;
    Array.isArray(args[0]) && (args = args[0]);

    return new WithLatestFromObservable(this, args, resultSelector);
  };

  function falseFactory() { return false; }
  function emptyArrayFactory() { return []; }

  var ZipObservable = (function(__super__) {
    inherits(ZipObservable, __super__);
    function ZipObservable(sources, resultSelector) {
      this._s = sources;
      this._cb = resultSelector;
      __super__.call(this);
    }

    ZipObservable.prototype.subscribeCore = function(observer) {
      var n = this._s.length,
          subscriptions = new Array(n),
          done = arrayInitialize(n, falseFactory),
          q = arrayInitialize(n, emptyArrayFactory);

      for (var i = 0; i < n; i++) {
        var source = this._s[i], sad = new SingleAssignmentDisposable();
        subscriptions[i] = sad;
        isPromise(source) && (source = observableFromPromise(source));
        sad.setDisposable(source.subscribe(new ZipObserver(observer, i, this, q, done)));
      }

      return new NAryDisposable(subscriptions);
    };

    return ZipObservable;
  }(ObservableBase));

  var ZipObserver = (function (__super__) {
    inherits(ZipObserver, __super__);
    function ZipObserver(o, i, p, q, d) {
      this._o = o;
      this._i = i;
      this._p = p;
      this._q = q;
      this._d = d;
      __super__.call(this);
    }

    function notEmpty(x) { return x.length > 0; }
    function shiftEach(x) { return x.shift(); }
    function notTheSame(i) {
      return function (x, j) {
        return j !== i;
      };
    }

    ZipObserver.prototype.next = function (x) {
      this._q[this._i].push(x);
      if (this._q.every(notEmpty)) {
        var queuedValues = this._q.map(shiftEach);
        var res = tryCatch(this._p._cb).apply(null, queuedValues);
        if (res === errorObj) { return this._o.onError(res.e); }
        this._o.onNext(res);
      } else if (this._d.filter(notTheSame(this._i)).every(identity)) {
        this._o.onCompleted();
      }
    };

    ZipObserver.prototype.error = function (e) {
      this._o.onError(e);
    };

    ZipObserver.prototype.completed = function () {
      this._d[this._i] = true;
      this._d.every(identity) && this._o.onCompleted();
    };

    return ZipObserver;
  }(AbstractObserver));

  /**
   * Merges the specified observable sequences into one observable sequence by using the selector function whenever all of the observable sequences or an array have produced an element at a corresponding index.
   * The last element in the arguments must be a function to invoke for each series of elements at corresponding indexes in the args.
   * @returns {Observable} An observable sequence containing the result of combining elements of the args using the specified result selector function.
   */
  observableProto.zip = function () {
    if (arguments.length === 0) { throw new Error('invalid arguments'); }

    var len = arguments.length, args = new Array(len);
    for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
    var resultSelector = isFunction(args[len - 1]) ? args.pop() : argumentsToArray;
    Array.isArray(args[0]) && (args = args[0]);

    var parent = this;
    args.unshift(parent);

    return new ZipObservable(args, resultSelector);
  };

  /**
   * Merges the specified observable sequences into one observable sequence by using the selector function whenever all of the observable sequences have produced an element at a corresponding index.
   * @param arguments Observable sources.
   * @param {Function} resultSelector Function to invoke for each series of elements at corresponding indexes in the sources.
   * @returns {Observable} An observable sequence containing the result of combining elements of the sources using the specified result selector function.
   */
  Observable.zip = function () {
    var len = arguments.length, args = new Array(len);
    for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
    if (Array.isArray(args[0])) {
      args = isFunction(args[1]) ? args[0].concat(args[1]) : args[0];
    }
    var first = args.shift();
    return first.zip.apply(first, args);
  };

function falseFactory() { return false; }
function emptyArrayFactory() { return []; }
function argumentsToArray() {
  var len = arguments.length, args = new Array(len);
  for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
  return args;
}

var ZipIterableObservable = (function(__super__) {
  inherits(ZipIterableObservable, __super__);
  function ZipIterableObservable(sources, cb) {
    this.sources = sources;
    this._cb = cb;
    __super__.call(this);
  }

  ZipIterableObservable.prototype.subscribeCore = function (o) {
    var sources = this.sources, len = sources.length, subscriptions = new Array(len);

    var state = {
      q: arrayInitialize(len, emptyArrayFactory),
      done: arrayInitialize(len, falseFactory),
      cb: this._cb,
      o: o
    };

    for (var i = 0; i < len; i++) {
      (function (i) {
        var source = sources[i], sad = new SingleAssignmentDisposable();
        (isArrayLike(source) || isIterable(source)) && (source = observableFrom(source));

        subscriptions[i] = sad;
        sad.setDisposable(source.subscribe(new ZipIterableObserver(state, i)));
      }(i));
    }

    return new NAryDisposable(subscriptions);
  };

  return ZipIterableObservable;
}(ObservableBase));

var ZipIterableObserver = (function (__super__) {
  inherits(ZipIterableObserver, __super__);
  function ZipIterableObserver(s, i) {
    this._s = s;
    this._i = i;
    __super__.call(this);
  }

  function notEmpty(x) { return x.length > 0; }
  function shiftEach(x) { return x.shift(); }
  function notTheSame(i) {
    return function (x, j) {
      return j !== i;
    };
  }

  ZipIterableObserver.prototype.next = function (x) {
    this._s.q[this._i].push(x);
    if (this._s.q.every(notEmpty)) {
      var queuedValues = this._s.q.map(shiftEach),
          res = tryCatch(this._s.cb).apply(null, queuedValues);
      if (res === errorObj) { return this._s.o.onError(res.e); }
      this._s.o.onNext(res);
    } else if (this._s.done.filter(notTheSame(this._i)).every(identity)) {
      this._s.o.onCompleted();
    }
  };

  ZipIterableObserver.prototype.error = function (e) { this._s.o.onError(e); };

  ZipIterableObserver.prototype.completed = function () {
    this._s.done[this._i] = true;
    this._s.done.every(identity) && this._s.o.onCompleted();
  };

  return ZipIterableObserver;
}(AbstractObserver));

/**
 * Merges the specified observable sequences into one observable sequence by using the selector function whenever all of the observable sequences or an array have produced an element at a corresponding index.
 * The last element in the arguments must be a function to invoke for each series of elements at corresponding indexes in the args.
 * @returns {Observable} An observable sequence containing the result of combining elements of the args using the specified result selector function.
 */
observableProto.zipIterable = function () {
  if (arguments.length === 0) { throw new Error('invalid arguments'); }

  var len = arguments.length, args = new Array(len);
  for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
  var resultSelector = isFunction(args[len - 1]) ? args.pop() : argumentsToArray;

  var parent = this;
  args.unshift(parent);
  return new ZipIterableObservable(args, resultSelector);
};

  function asObservable(source) {
    return function subscribe(o) { return source.subscribe(o); };
  }

  /**
   *  Hides the identity of an observable sequence.
   * @returns {Observable} An observable sequence that hides the identity of the source sequence.
   */
  observableProto.asObservable = function () {
    return new AnonymousObservable(asObservable(this), this);
  };

  var DematerializeObservable = (function (__super__) {
    inherits(DematerializeObservable, __super__);
    function DematerializeObservable(source) {
      this.source = source;
      __super__.call(this);
    }

    DematerializeObservable.prototype.subscribeCore = function (o) {
      return this.source.subscribe(new DematerializeObserver(o));
    };

    return DematerializeObservable;
  }(ObservableBase));

  var DematerializeObserver = (function (__super__) {
    inherits(DematerializeObserver, __super__);

    function DematerializeObserver(o) {
      this._o = o;
      __super__.call(this);
    }

    DematerializeObserver.prototype.next = function (x) { x.accept(this._o); };
    DematerializeObserver.prototype.error = function (e) { this._o.onError(e); };
    DematerializeObserver.prototype.completed = function () { this._o.onCompleted(); };

    return DematerializeObserver;
  }(AbstractObserver));

  /**
   * Dematerializes the explicit notification values of an observable sequence as implicit notifications.
   * @returns {Observable} An observable sequence exhibiting the behavior corresponding to the source sequence's notification values.
   */
  observableProto.dematerialize = function () {
    return new DematerializeObservable(this);
  };

  var DistinctUntilChangedObservable = (function(__super__) {
    inherits(DistinctUntilChangedObservable, __super__);
    function DistinctUntilChangedObservable(source, keyFn, comparer) {
      this.source = source;
      this.keyFn = keyFn;
      this.comparer = comparer;
      __super__.call(this);
    }

    DistinctUntilChangedObservable.prototype.subscribeCore = function (o) {
      return this.source.subscribe(new DistinctUntilChangedObserver(o, this.keyFn, this.comparer));
    };

    return DistinctUntilChangedObservable;
  }(ObservableBase));

  var DistinctUntilChangedObserver = (function(__super__) {
    inherits(DistinctUntilChangedObserver, __super__);
    function DistinctUntilChangedObserver(o, keyFn, comparer) {
      this.o = o;
      this.keyFn = keyFn;
      this.comparer = comparer;
      this.hasCurrentKey = false;
      this.currentKey = null;
      __super__.call(this);
    }

    DistinctUntilChangedObserver.prototype.next = function (x) {
      var key = x, comparerEquals;
      if (isFunction(this.keyFn)) {
        key = tryCatch(this.keyFn)(x);
        if (key === errorObj) { return this.o.onError(key.e); }
      }
      if (this.hasCurrentKey) {
        comparerEquals = tryCatch(this.comparer)(this.currentKey, key);
        if (comparerEquals === errorObj) { return this.o.onError(comparerEquals.e); }
      }
      if (!this.hasCurrentKey || !comparerEquals) {
        this.hasCurrentKey = true;
        this.currentKey = key;
        this.o.onNext(x);
      }
    };
    DistinctUntilChangedObserver.prototype.error = function(e) {
      this.o.onError(e);
    };
    DistinctUntilChangedObserver.prototype.completed = function () {
      this.o.onCompleted();
    };

    return DistinctUntilChangedObserver;
  }(AbstractObserver));

  /**
  *  Returns an observable sequence that contains only distinct contiguous elements according to the keyFn and the comparer.
  * @param {Function} [keyFn] A function to compute the comparison key for each element. If not provided, it projects the value.
  * @param {Function} [comparer] Equality comparer for computed key values. If not provided, defaults to an equality comparer function.
  * @returns {Observable} An observable sequence only containing the distinct contiguous elements, based on a computed key value, from the source sequence.
  */
  observableProto.distinctUntilChanged = function (keyFn, comparer) {
    comparer || (comparer = defaultComparer);
    return new DistinctUntilChangedObservable(this, keyFn, comparer);
  };

  var TapObservable = (function(__super__) {
    inherits(TapObservable,__super__);
    function TapObservable(source, observerOrOnNext, onError, onCompleted) {
      this.source = source;
      this._oN = observerOrOnNext;
      this._oE = onError;
      this._oC = onCompleted;
      __super__.call(this);
    }

    TapObservable.prototype.subscribeCore = function(o) {
      return this.source.subscribe(new InnerObserver(o, this));
    };

    inherits(InnerObserver, AbstractObserver);
    function InnerObserver(o, p) {
      this.o = o;
      this.t = !p._oN || isFunction(p._oN) ?
        observerCreate(p._oN || noop, p._oE || noop, p._oC || noop) :
        p._oN;
      this.isStopped = false;
      AbstractObserver.call(this);
    }
    InnerObserver.prototype.next = function(x) {
      var res = tryCatch(this.t.onNext).call(this.t, x);
      if (res === errorObj) { this.o.onError(res.e); }
      this.o.onNext(x);
    };
    InnerObserver.prototype.error = function(err) {
      var res = tryCatch(this.t.onError).call(this.t, err);
      if (res === errorObj) { return this.o.onError(res.e); }
      this.o.onError(err);
    };
    InnerObserver.prototype.completed = function() {
      var res = tryCatch(this.t.onCompleted).call(this.t);
      if (res === errorObj) { return this.o.onError(res.e); }
      this.o.onCompleted();
    };

    return TapObservable;
  }(ObservableBase));

  /**
  *  Invokes an action for each element in the observable sequence and invokes an action upon graceful or exceptional termination of the observable sequence.
  *  This method can be used for debugging, logging, etc. of query behavior by intercepting the message stream to run arbitrary actions for messages on the pipeline.
  * @param {Function | Observer} observerOrOnNext Action to invoke for each element in the observable sequence or an o.
  * @param {Function} [onError]  Action to invoke upon exceptional termination of the observable sequence. Used if only the observerOrOnNext parameter is also a function.
  * @param {Function} [onCompleted]  Action to invoke upon graceful termination of the observable sequence. Used if only the observerOrOnNext parameter is also a function.
  * @returns {Observable} The source sequence with the side-effecting behavior applied.
  */
  observableProto['do'] = observableProto.tap = observableProto.doAction = function (observerOrOnNext, onError, onCompleted) {
    return new TapObservable(this, observerOrOnNext, onError, onCompleted);
  };

  /**
  *  Invokes an action for each element in the observable sequence.
  *  This method can be used for debugging, logging, etc. of query behavior by intercepting the message stream to run arbitrary actions for messages on the pipeline.
  * @param {Function} onNext Action to invoke for each element in the observable sequence.
  * @param {Any} [thisArg] Object to use as this when executing callback.
  * @returns {Observable} The source sequence with the side-effecting behavior applied.
  */
  observableProto.doOnNext = observableProto.tapOnNext = function (onNext, thisArg) {
    return this.tap(typeof thisArg !== 'undefined' ? function (x) { onNext.call(thisArg, x); } : onNext);
  };

  /**
  *  Invokes an action upon exceptional termination of the observable sequence.
  *  This method can be used for debugging, logging, etc. of query behavior by intercepting the message stream to run arbitrary actions for messages on the pipeline.
  * @param {Function} onError Action to invoke upon exceptional termination of the observable sequence.
  * @param {Any} [thisArg] Object to use as this when executing callback.
  * @returns {Observable} The source sequence with the side-effecting behavior applied.
  */
  observableProto.doOnError = observableProto.tapOnError = function (onError, thisArg) {
    return this.tap(noop, typeof thisArg !== 'undefined' ? function (e) { onError.call(thisArg, e); } : onError);
  };

  /**
  *  Invokes an action upon graceful termination of the observable sequence.
  *  This method can be used for debugging, logging, etc. of query behavior by intercepting the message stream to run arbitrary actions for messages on the pipeline.
  * @param {Function} onCompleted Action to invoke upon graceful termination of the observable sequence.
  * @param {Any} [thisArg] Object to use as this when executing callback.
  * @returns {Observable} The source sequence with the side-effecting behavior applied.
  */
  observableProto.doOnCompleted = observableProto.tapOnCompleted = function (onCompleted, thisArg) {
    return this.tap(noop, null, typeof thisArg !== 'undefined' ? function () { onCompleted.call(thisArg); } : onCompleted);
  };

  var FinallyObservable = (function (__super__) {
    inherits(FinallyObservable, __super__);
    function FinallyObservable(source, fn, thisArg) {
      this.source = source;
      this._fn = bindCallback(fn, thisArg, 0);
      __super__.call(this);
    }

    FinallyObservable.prototype.subscribeCore = function (o) {
      var d = tryCatch(this.source.subscribe).call(this.source, o);
      if (d === errorObj) {
        this._fn();
        thrower(d.e);
      }

      return new FinallyDisposable(d, this._fn);
    };

    function FinallyDisposable(s, fn) {
      this.isDisposed = false;
      this._s = s;
      this._fn = fn;
    }
    FinallyDisposable.prototype.dispose = function () {
      if (!this.isDisposed) {
        var res = tryCatch(this._s.dispose).call(this._s);
        this._fn();
        res === errorObj && thrower(res.e);
      }
    };

    return FinallyObservable;

  }(ObservableBase));

  /**
   *  Invokes a specified action after the source observable sequence terminates gracefully or exceptionally.
   * @param {Function} finallyAction Action to invoke after the source observable sequence terminates.
   * @returns {Observable} Source sequence with the action-invoking termination behavior applied.
   */
  observableProto['finally'] = function (action, thisArg) {
    return new FinallyObservable(this, action, thisArg);
  };

  var IgnoreElementsObservable = (function(__super__) {
    inherits(IgnoreElementsObservable, __super__);

    function IgnoreElementsObservable(source) {
      this.source = source;
      __super__.call(this);
    }

    IgnoreElementsObservable.prototype.subscribeCore = function (o) {
      return this.source.subscribe(new InnerObserver(o));
    };

    function InnerObserver(o) {
      this.o = o;
      this.isStopped = false;
    }
    InnerObserver.prototype.onNext = noop;
    InnerObserver.prototype.onError = function (err) {
      if(!this.isStopped) {
        this.isStopped = true;
        this.o.onError(err);
      }
    };
    InnerObserver.prototype.onCompleted = function () {
      if(!this.isStopped) {
        this.isStopped = true;
        this.o.onCompleted();
      }
    };
    InnerObserver.prototype.dispose = function() { this.isStopped = true; };
    InnerObserver.prototype.fail = function (e) {
      if (!this.isStopped) {
        this.isStopped = true;
        this.observer.onError(e);
        return true;
      }

      return false;
    };

    return IgnoreElementsObservable;
  }(ObservableBase));

  /**
   *  Ignores all elements in an observable sequence leaving only the termination messages.
   * @returns {Observable} An empty observable sequence that signals termination, successful or exceptional, of the source sequence.
   */
  observableProto.ignoreElements = function () {
    return new IgnoreElementsObservable(this);
  };

  var MaterializeObservable = (function (__super__) {
    inherits(MaterializeObservable, __super__);
    function MaterializeObservable(source, fn) {
      this.source = source;
      __super__.call(this);
    }

    MaterializeObservable.prototype.subscribeCore = function (o) {
      return this.source.subscribe(new MaterializeObserver(o));
    };

    return MaterializeObservable;
  }(ObservableBase));

  var MaterializeObserver = (function (__super__) {
    inherits(MaterializeObserver, __super__);

    function MaterializeObserver(o) {
      this._o = o;
      __super__.call(this);
    }

    MaterializeObserver.prototype.next = function (x) { this._o.onNext(notificationCreateOnNext(x)) };
    MaterializeObserver.prototype.error = function (e) { this._o.onNext(notificationCreateOnError(e)); this._o.onCompleted(); };
    MaterializeObserver.prototype.completed = function () { this._o.onNext(notificationCreateOnCompleted()); this._o.onCompleted(); };

    return MaterializeObserver;
  }(AbstractObserver));

  /**
   *  Materializes the implicit notifications of an observable sequence as explicit notification values.
   * @returns {Observable} An observable sequence containing the materialized notification values from the source sequence.
   */
  observableProto.materialize = function () {
    return new MaterializeObservable(this);
  };

  /**
   *  Repeats the observable sequence a specified number of times. If the repeat count is not specified, the sequence repeats indefinitely.
   * @param {Number} [repeatCount]  Number of times to repeat the sequence. If not provided, repeats the sequence indefinitely.
   * @returns {Observable} The observable sequence producing the elements of the given sequence repeatedly.
   */
  observableProto.repeat = function (repeatCount) {
    return enumerableRepeat(this, repeatCount).concat();
  };

  /**
   *  Repeats the source observable sequence the specified number of times or until it successfully terminates. If the retry count is not specified, it retries indefinitely.
   *  Note if you encounter an error and want it to retry once, then you must use .retry(2);
   *
   * @example
   *  var res = retried = retry.repeat();
   *  var res = retried = retry.repeat(2);
   * @param {Number} [retryCount]  Number of times to retry the sequence. If not provided, retry the sequence indefinitely.
   * @returns {Observable} An observable sequence producing the elements of the given sequence repeatedly until it terminates successfully.
   */
  observableProto.retry = function (retryCount) {
    return enumerableRepeat(this, retryCount).catchError();
  };

  function repeat(value) {
    return {
      '@@iterator': function () {
        return {
          next: function () {
            return { done: false, value: value };
          }
        };
      }
    };
  }

  var RetryWhenObservable = (function(__super__) {
    function createDisposable(state) {
      return {
        isDisposed: false,
        dispose: function () {
          if (!this.isDisposed) {
            this.isDisposed = true;
            state.isDisposed = true;
          }
        }
      };
    }

    function RetryWhenObservable(source, notifier) {
      this.source = source;
      this._notifier = notifier;
      __super__.call(this);
    }

    inherits(RetryWhenObservable, __super__);

    RetryWhenObservable.prototype.subscribeCore = function (o) {
      var exceptions = new Subject(),
        notifier = new Subject(),
        handled = this._notifier(exceptions),
        notificationDisposable = handled.subscribe(notifier);

      var e = this.source['@@iterator']();

      var state = { isDisposed: false },
        lastError,
        subscription = new SerialDisposable();
      var cancelable = currentThreadScheduler.scheduleRecursive(null, function (_, recurse) {
        if (state.isDisposed) { return; }
        var currentItem = e.next();

        if (currentItem.done) {
          if (lastError) {
            o.onError(lastError);
          } else {
            o.onCompleted();
          }
          return;
        }

        // Check if promise
        var currentValue = currentItem.value;
        isPromise(currentValue) && (currentValue = observableFromPromise(currentValue));

        var outer = new SingleAssignmentDisposable();
        var inner = new SingleAssignmentDisposable();
        subscription.setDisposable(new BinaryDisposable(inner, outer));
        outer.setDisposable(currentValue.subscribe(
          function(x) { o.onNext(x); },
          function (exn) {
            inner.setDisposable(notifier.subscribe(recurse, function(ex) {
              o.onError(ex);
            }, function() {
              o.onCompleted();
            }));

            exceptions.onNext(exn);
            outer.dispose();
          },
          function() { o.onCompleted(); }));
      });

      return new NAryDisposable([notificationDisposable, subscription, cancelable, createDisposable(state)]);
    };

    return RetryWhenObservable;
  }(ObservableBase));

  observableProto.retryWhen = function (notifier) {
    return new RetryWhenObservable(repeat(this), notifier);
  };

  function repeat(value) {
    return {
      '@@iterator': function () {
        return {
          next: function () {
            return { done: false, value: value };
          }
        };
      }
    };
  }

  var RepeatWhenObservable = (function(__super__) {
    function createDisposable(state) {
      return {
        isDisposed: false,
        dispose: function () {
          if (!this.isDisposed) {
            this.isDisposed = true;
            state.isDisposed = true;
          }
        }
      };
    }

    function RepeatWhenObservable(source, notifier) {
      this.source = source;
      this._notifier = notifier;
      __super__.call(this);
    }

    inherits(RepeatWhenObservable, __super__);

    RepeatWhenObservable.prototype.subscribeCore = function (o) {
      var completions = new Subject(),
        notifier = new Subject(),
        handled = this._notifier(completions),
        notificationDisposable = handled.subscribe(notifier);

      var e = this.source['@@iterator']();

      var state = { isDisposed: false },
        lastError,
        subscription = new SerialDisposable();
      var cancelable = currentThreadScheduler.scheduleRecursive(null, function (_, recurse) {
        if (state.isDisposed) { return; }
        var currentItem = e.next();

        if (currentItem.done) {
          if (lastError) {
            o.onError(lastError);
          } else {
            o.onCompleted();
          }
          return;
        }

        // Check if promise
        var currentValue = currentItem.value;
        isPromise(currentValue) && (currentValue = observableFromPromise(currentValue));

        var outer = new SingleAssignmentDisposable();
        var inner = new SingleAssignmentDisposable();
        subscription.setDisposable(new BinaryDisposable(inner, outer));
        outer.setDisposable(currentValue.subscribe(
          function(x) { o.onNext(x); },
          function (exn) { o.onError(exn); },
          function() {
            inner.setDisposable(notifier.subscribe(recurse, function(ex) {
              o.onError(ex);
            }, function() {
              o.onCompleted();
            }));

            completions.onNext(null);
            outer.dispose();
          }));
      });

      return new NAryDisposable([notificationDisposable, subscription, cancelable, createDisposable(state)]);
    };

    return RepeatWhenObservable;
  }(ObservableBase));

  observableProto.repeatWhen = function (notifier) {
    return new RepeatWhenObservable(repeat(this), notifier);
  };

  var ScanObservable = (function(__super__) {
    inherits(ScanObservable, __super__);
    function ScanObservable(source, accumulator, hasSeed, seed) {
      this.source = source;
      this.accumulator = accumulator;
      this.hasSeed = hasSeed;
      this.seed = seed;
      __super__.call(this);
    }

    ScanObservable.prototype.subscribeCore = function(o) {
      return this.source.subscribe(new ScanObserver(o,this));
    };

    return ScanObservable;
  }(ObservableBase));

  var ScanObserver = (function (__super__) {
    inherits(ScanObserver, __super__);
    function ScanObserver(o, parent) {
      this._o = o;
      this._p = parent;
      this._fn = parent.accumulator;
      this._hs = parent.hasSeed;
      this._s = parent.seed;
      this._ha = false;
      this._a = null;
      this._hv = false;
      this._i = 0;
      __super__.call(this);
    }

    ScanObserver.prototype.next = function (x) {
      !this._hv && (this._hv = true);
      if (this._ha) {
        this._a = tryCatch(this._fn)(this._a, x, this._i, this._p);
      } else {
        this._a = this._hs ? tryCatch(this._fn)(this._s, x, this._i, this._p) : x;
        this._ha = true;
      }
      if (this._a === errorObj) { return this._o.onError(this._a.e); }
      this._o.onNext(this._a);
      this._i++;
    };

    ScanObserver.prototype.error = function (e) {
      this._o.onError(e);
    };

    ScanObserver.prototype.completed = function () {
      !this._hv && this._hs && this._o.onNext(this._s);
      this._o.onCompleted();
    };

    return ScanObserver;
  }(AbstractObserver));

  /**
  *  Applies an accumulator function over an observable sequence and returns each intermediate result. The optional seed value is used as the initial accumulator value.
  *  For aggregation behavior with no intermediate results, see Observable.aggregate.
  * @param {Mixed} [seed] The initial accumulator value.
  * @param {Function} accumulator An accumulator function to be invoked on each element.
  * @returns {Observable} An observable sequence containing the accumulated values.
  */
  observableProto.scan = function () {
    var hasSeed = false, seed, accumulator = arguments[0];
    if (arguments.length === 2) {
      hasSeed = true;
      seed = arguments[1];
    }
    return new ScanObservable(this, accumulator, hasSeed, seed);
  };

  var SkipLastObservable = (function (__super__) {
    inherits(SkipLastObservable, __super__);
    function SkipLastObservable(source, c) {
      this.source = source;
      this._c = c;
      __super__.call(this);
    }

    SkipLastObservable.prototype.subscribeCore = function (o) {
      return this.source.subscribe(new SkipLastObserver(o, this._c));
    };

    return SkipLastObservable;
  }(ObservableBase));

  var SkipLastObserver = (function (__super__) {
    inherits(SkipLastObserver, __super__);
    function SkipLastObserver(o, c) {
      this._o = o;
      this._c = c;
      this._q = [];
      __super__.call(this);
    }

    SkipLastObserver.prototype.next = function (x) {
      this._q.push(x);
      this._q.length > this._c && this._o.onNext(this._q.shift());
    };

    SkipLastObserver.prototype.error = function (e) {
      this._o.onError(e);
    };

    SkipLastObserver.prototype.completed = function () {
      this._o.onCompleted();
    };

    return SkipLastObserver;
  }(AbstractObserver));

  /**
   *  Bypasses a specified number of elements at the end of an observable sequence.
   * @description
   *  This operator accumulates a queue with a length enough to store the first `count` elements. As more elements are
   *  received, elements are taken from the front of the queue and produced on the result sequence. This causes elements to be delayed.
   * @param count Number of elements to bypass at the end of the source sequence.
   * @returns {Observable} An observable sequence containing the source sequence elements except for the bypassed ones at the end.
   */
  observableProto.skipLast = function (count) {
    if (count < 0) { throw new ArgumentOutOfRangeError(); }
    return new SkipLastObservable(this, count);
  };

  /**
   *  Prepends a sequence of values to an observable sequence with an optional scheduler and an argument list of values to prepend.
   *  @example
   *  var res = source.startWith(1, 2, 3);
   *  var res = source.startWith(Rx.Scheduler.timeout, 1, 2, 3);
   * @param {Arguments} args The specified values to prepend to the observable sequence
   * @returns {Observable} The source sequence prepended with the specified values.
   */
  observableProto.startWith = function () {
    var values, scheduler, start = 0;
    if (!!arguments.length && isScheduler(arguments[0])) {
      scheduler = arguments[0];
      start = 1;
    } else {
      scheduler = immediateScheduler;
    }
    for(var args = [], i = start, len = arguments.length; i < len; i++) { args.push(arguments[i]); }
    return enumerableOf([observableFromArray(args, scheduler), this]).concat();
  };

  var TakeLastObserver = (function (__super__) {
    inherits(TakeLastObserver, __super__);
    function TakeLastObserver(o, c) {
      this._o = o;
      this._c = c;
      this._q = [];
      __super__.call(this);
    }

    TakeLastObserver.prototype.next = function (x) {
      this._q.push(x);
      this._q.length > this._c && this._q.shift();
    };

    TakeLastObserver.prototype.error = function (e) {
      this._o.onError(e);
    };

    TakeLastObserver.prototype.completed = function () {
      while (this._q.length > 0) { this._o.onNext(this._q.shift()); }
      this._o.onCompleted();
    };

    return TakeLastObserver;
  }(AbstractObserver));

  /**
   *  Returns a specified number of contiguous elements from the end of an observable sequence.
   * @description
   *  This operator accumulates a buffer with a length enough to store elements count elements. Upon completion of
   *  the source sequence, this buffer is drained on the result sequence. This causes the elements to be delayed.
   * @param {Number} count Number of elements to take from the end of the source sequence.
   * @returns {Observable} An observable sequence containing the specified number of elements from the end of the source sequence.
   */
  observableProto.takeLast = function (count) {
    if (count < 0) { throw new ArgumentOutOfRangeError(); }
    var source = this;
    return new AnonymousObservable(function (o) {
      return source.subscribe(new TakeLastObserver(o, count));
    }, source);
  };

observableProto.flatMapConcat = observableProto.concatMap = function(selector, resultSelector, thisArg) {
    return new FlatMapObservable(this, selector, resultSelector, thisArg).merge(1);
};
  var MapObservable = (function (__super__) {
    inherits(MapObservable, __super__);

    function MapObservable(source, selector, thisArg) {
      this.source = source;
      this.selector = bindCallback(selector, thisArg, 3);
      __super__.call(this);
    }

    function innerMap(selector, self) {
      return function (x, i, o) { return selector.call(this, self.selector(x, i, o), i, o); };
    }

    MapObservable.prototype.internalMap = function (selector, thisArg) {
      return new MapObservable(this.source, innerMap(selector, this), thisArg);
    };

    MapObservable.prototype.subscribeCore = function (o) {
      return this.source.subscribe(new InnerObserver(o, this.selector, this));
    };

    inherits(InnerObserver, AbstractObserver);
    function InnerObserver(o, selector, source) {
      this.o = o;
      this.selector = selector;
      this.source = source;
      this.i = 0;
      AbstractObserver.call(this);
    }

    InnerObserver.prototype.next = function(x) {
      var result = tryCatch(this.selector)(x, this.i++, this.source);
      if (result === errorObj) { return this.o.onError(result.e); }
      this.o.onNext(result);
    };

    InnerObserver.prototype.error = function (e) {
      this.o.onError(e);
    };

    InnerObserver.prototype.completed = function () {
      this.o.onCompleted();
    };

    return MapObservable;

  }(ObservableBase));

  /**
  * Projects each element of an observable sequence into a new form by incorporating the element's index.
  * @param {Function} selector A transform function to apply to each source element; the second parameter of the function represents the index of the source element.
  * @param {Any} [thisArg] Object to use as this when executing callback.
  * @returns {Observable} An observable sequence whose elements are the result of invoking the transform function on each element of source.
  */
  observableProto.map = observableProto.select = function (selector, thisArg) {
    var selectorFn = typeof selector === 'function' ? selector : function () { return selector; };
    return this instanceof MapObservable ?
      this.internalMap(selectorFn, thisArg) :
      new MapObservable(this, selectorFn, thisArg);
  };

  function plucker(args, len) {
    return function mapper(x) {
      var currentProp = x;
      for (var i = 0; i < len; i++) {
        var p = currentProp[args[i]];
        if (typeof p !== 'undefined') {
          currentProp = p;
        } else {
          return undefined;
        }
      }
      return currentProp;
    };
  }

  /**
   * Retrieves the value of a specified nested property from all elements in
   * the Observable sequence.
   * @param {Arguments} arguments The nested properties to pluck.
   * @returns {Observable} Returns a new Observable sequence of property values.
   */
  observableProto.pluck = function () {
    var len = arguments.length, args = new Array(len);
    if (len === 0) { throw new Error('List of properties cannot be empty.'); }
    for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
    return this.map(plucker(args, len));
  };

observableProto.flatMap = observableProto.selectMany = function(selector, resultSelector, thisArg) {
    return new FlatMapObservable(this, selector, resultSelector, thisArg).mergeAll();
};

Rx.Observable.prototype.flatMapLatest = function(selector, resultSelector, thisArg) {
    return new FlatMapObservable(this, selector, resultSelector, thisArg).switchLatest();
};
  var SkipObservable = (function(__super__) {
    inherits(SkipObservable, __super__);
    function SkipObservable(source, count) {
      this.source = source;
      this._count = count;
      __super__.call(this);
    }

    SkipObservable.prototype.subscribeCore = function (o) {
      return this.source.subscribe(new SkipObserver(o, this._count));
    };

    function SkipObserver(o, c) {
      this._o = o;
      this._r = c;
      AbstractObserver.call(this);
    }

    inherits(SkipObserver, AbstractObserver);

    SkipObserver.prototype.next = function (x) {
      if (this._r <= 0) {
        this._o.onNext(x);
      } else {
        this._r--;
      }
    };
    SkipObserver.prototype.error = function(e) { this._o.onError(e); };
    SkipObserver.prototype.completed = function() { this._o.onCompleted(); };

    return SkipObservable;
  }(ObservableBase));

  /**
   * Bypasses a specified number of elements in an observable sequence and then returns the remaining elements.
   * @param {Number} count The number of elements to skip before returning the remaining elements.
   * @returns {Observable} An observable sequence that contains the elements that occur after the specified index in the input sequence.
   */
  observableProto.skip = function (count) {
    if (count < 0) { throw new ArgumentOutOfRangeError(); }
    return new SkipObservable(this, count);
  };

  var SkipWhileObservable = (function (__super__) {
    inherits(SkipWhileObservable, __super__);
    function SkipWhileObservable(source, fn) {
      this.source = source;
      this._fn = fn;
      __super__.call(this);
    }

    SkipWhileObservable.prototype.subscribeCore = function (o) {
      return this.source.subscribe(new SkipWhileObserver(o, this));
    };

    return SkipWhileObservable;
  }(ObservableBase));

  var SkipWhileObserver = (function (__super__) {
    inherits(SkipWhileObserver, __super__);

    function SkipWhileObserver(o, p) {
      this._o = o;
      this._p = p;
      this._i = 0;
      this._r = false;
      __super__.call(this);
    }

    SkipWhileObserver.prototype.next = function (x) {
      if (!this._r) {
        var res = tryCatch(this._p._fn)(x, this._i++, this._p);
        if (res === errorObj) { return this._o.onError(res.e); }
        this._r = !res;
      }
      this._r && this._o.onNext(x);
    };
    SkipWhileObserver.prototype.error = function (e) { this._o.onError(e); };
    SkipWhileObserver.prototype.completed = function () { this._o.onCompleted(); };

    return SkipWhileObserver;
  }(AbstractObserver));

  /**
   *  Bypasses elements in an observable sequence as long as a specified condition is true and then returns the remaining elements.
   *  The element's index is used in the logic of the predicate function.
   *
   *  var res = source.skipWhile(function (value) { return value < 10; });
   *  var res = source.skipWhile(function (value, index) { return value < 10 || index < 10; });
   * @param {Function} predicate A function to test each element for a condition; the second parameter of the function represents the index of the source element.
   * @param {Any} [thisArg] Object to use as this when executing callback.
   * @returns {Observable} An observable sequence that contains the elements from the input sequence starting at the first element in the linear series that does not pass the test specified by predicate.
   */
  observableProto.skipWhile = function (predicate, thisArg) {
    var fn = bindCallback(predicate, thisArg, 3);
    return new SkipWhileObservable(this, fn);
  };

  var TakeObservable = (function(__super__) {
    inherits(TakeObservable, __super__);
    function TakeObservable(source, count) {
      this.source = source;
      this._count = count;
      __super__.call(this);
    }

    TakeObservable.prototype.subscribeCore = function (o) {
      return this.source.subscribe(new TakeObserver(o, this._count));
    };

    function TakeObserver(o, c) {
      this._o = o;
      this._c = c;
      this._r = c;
      AbstractObserver.call(this);
    }

    inherits(TakeObserver, AbstractObserver);

    TakeObserver.prototype.next = function (x) {
      if (this._r-- > 0) {
        this._o.onNext(x);
        this._r <= 0 && this._o.onCompleted();
      }
    };

    TakeObserver.prototype.error = function (e) { this._o.onError(e); };
    TakeObserver.prototype.completed = function () { this._o.onCompleted(); };

    return TakeObservable;
  }(ObservableBase));

  /**
   *  Returns a specified number of contiguous elements from the start of an observable sequence, using the specified scheduler for the edge case of take(0).
   * @param {Number} count The number of elements to return.
   * @param {Scheduler} [scheduler] Scheduler used to produce an OnCompleted message in case <paramref name="count count</paramref> is set to 0.
   * @returns {Observable} An observable sequence that contains the specified number of elements from the start of the input sequence.
   */
  observableProto.take = function (count, scheduler) {
    if (count < 0) { throw new ArgumentOutOfRangeError(); }
    if (count === 0) { return observableEmpty(scheduler); }
    return new TakeObservable(this, count);
  };

  var TakeWhileObservable = (function (__super__) {
    inherits(TakeWhileObservable, __super__);
    function TakeWhileObservable(source, fn) {
      this.source = source;
      this._fn = fn;
      __super__.call(this);
    }

    TakeWhileObservable.prototype.subscribeCore = function (o) {
      return this.source.subscribe(new TakeWhileObserver(o, this));
    };

    return TakeWhileObservable;
  }(ObservableBase));

  var TakeWhileObserver = (function (__super__) {
    inherits(TakeWhileObserver, __super__);

    function TakeWhileObserver(o, p) {
      this._o = o;
      this._p = p;
      this._i = 0;
      this._r = true;
      __super__.call(this);
    }

    TakeWhileObserver.prototype.next = function (x) {
      if (this._r) {
        this._r = tryCatch(this._p._fn)(x, this._i++, this._p);
        if (this._r === errorObj) { return this._o.onError(this._r.e); }
      }
      if (this._r) {
        this._o.onNext(x);
      } else {
        this._o.onCompleted();
      }
    };
    TakeWhileObserver.prototype.error = function (e) { this._o.onError(e); };
    TakeWhileObserver.prototype.completed = function () { this._o.onCompleted(); };

    return TakeWhileObserver;
  }(AbstractObserver));

  /**
   *  Returns elements from an observable sequence as long as a specified condition is true.
   *  The element's index is used in the logic of the predicate function.
   * @param {Function} predicate A function to test each element for a condition; the second parameter of the function represents the index of the source element.
   * @param {Any} [thisArg] Object to use as this when executing callback.
   * @returns {Observable} An observable sequence that contains the elements from the input sequence that occur before the element at which the test no longer passes.
   */
  observableProto.takeWhile = function (predicate, thisArg) {
    var fn = bindCallback(predicate, thisArg, 3);
    return new TakeWhileObservable(this, fn);
  };

  var FilterObservable = (function (__super__) {
    inherits(FilterObservable, __super__);

    function FilterObservable(source, predicate, thisArg) {
      this.source = source;
      this.predicate = bindCallback(predicate, thisArg, 3);
      __super__.call(this);
    }

    FilterObservable.prototype.subscribeCore = function (o) {
      return this.source.subscribe(new InnerObserver(o, this.predicate, this));
    };

    function innerPredicate(predicate, self) {
      return function(x, i, o) { return self.predicate(x, i, o) && predicate.call(this, x, i, o); }
    }

    FilterObservable.prototype.internalFilter = function(predicate, thisArg) {
      return new FilterObservable(this.source, innerPredicate(predicate, this), thisArg);
    };

    inherits(InnerObserver, AbstractObserver);
    function InnerObserver(o, predicate, source) {
      this.o = o;
      this.predicate = predicate;
      this.source = source;
      this.i = 0;
      AbstractObserver.call(this);
    }

    InnerObserver.prototype.next = function(x) {
      var shouldYield = tryCatch(this.predicate)(x, this.i++, this.source);
      if (shouldYield === errorObj) {
        return this.o.onError(shouldYield.e);
      }
      shouldYield && this.o.onNext(x);
    };

    InnerObserver.prototype.error = function (e) {
      this.o.onError(e);
    };

    InnerObserver.prototype.completed = function () {
      this.o.onCompleted();
    };

    return FilterObservable;

  }(ObservableBase));

  /**
  *  Filters the elements of an observable sequence based on a predicate by incorporating the element's index.
  * @param {Function} predicate A function to test each source element for a condition; the second parameter of the function represents the index of the source element.
  * @param {Any} [thisArg] Object to use as this when executing callback.
  * @returns {Observable} An observable sequence that contains elements from the input sequence that satisfy the condition.
  */
  observableProto.filter = observableProto.where = function (predicate, thisArg) {
    return this instanceof FilterObservable ? this.internalFilter(predicate, thisArg) :
      new FilterObservable(this, predicate, thisArg);
  };

function createCbObservable(fn, ctx, selector, args) {
  var o = new AsyncSubject();

  args.push(createCbHandler(o, ctx, selector));
  fn.apply(ctx, args);

  return o.asObservable();
}

function createCbHandler(o, ctx, selector) {
  return function handler () {
    var len = arguments.length, results = new Array(len);
    for(var i = 0; i < len; i++) { results[i] = arguments[i]; }

    if (isFunction(selector)) {
      results = tryCatch(selector).apply(ctx, results);
      if (results === errorObj) { return o.onError(results.e); }
      o.onNext(results);
    } else {
      if (results.length <= 1) {
        o.onNext(results[0]);
      } else {
        o.onNext(results);
      }
    }

    o.onCompleted();
  };
}

/**
 * Converts a callback function to an observable sequence.
 *
 * @param {Function} fn Function with a callback as the last parameter to convert to an Observable sequence.
 * @param {Mixed} [ctx] The context for the func parameter to be executed.  If not specified, defaults to undefined.
 * @param {Function} [selector] A selector which takes the arguments from the callback to produce a single item to yield on next.
 * @returns {Function} A function, when executed with the required parameters minus the callback, produces an Observable sequence with a single value of the arguments to the callback as an array.
 */
Observable.fromCallback = function (fn, ctx, selector) {
  return function () {
    typeof ctx === 'undefined' && (ctx = this); 

    var len = arguments.length, args = new Array(len)
    for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
    return createCbObservable(fn, ctx, selector, args);
  };
};

function createNodeObservable(fn, ctx, selector, args) {
  var o = new AsyncSubject();

  args.push(createNodeHandler(o, ctx, selector));
  fn.apply(ctx, args);

  return o.asObservable();
}

function createNodeHandler(o, ctx, selector) {
  return function handler () {
    var err = arguments[0];
    if (err) { return o.onError(err); }

    var len = arguments.length, results = [];
    for(var i = 1; i < len; i++) { results[i - 1] = arguments[i]; }

    if (isFunction(selector)) {
      var results = tryCatch(selector).apply(ctx, results);
      if (results === errorObj) { return o.onError(results.e); }
      o.onNext(results);
    } else {
      if (results.length <= 1) {
        o.onNext(results[0]);
      } else {
        o.onNext(results);
      }
    }

    o.onCompleted();
  };
}

/**
 * Converts a Node.js callback style function to an observable sequence.  This must be in function (err, ...) format.
 * @param {Function} fn The function to call
 * @param {Mixed} [ctx] The context for the func parameter to be executed.  If not specified, defaults to undefined.
 * @param {Function} [selector] A selector which takes the arguments from the callback minus the error to produce a single item to yield on next.
 * @returns {Function} An async function which when applied, returns an observable sequence with the callback arguments as an array.
 */
Observable.fromNodeCallback = function (fn, ctx, selector) {
  return function () {
    typeof ctx === 'undefined' && (ctx = this); 
    var len = arguments.length, args = new Array(len);
    for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
    return createNodeObservable(fn, ctx, selector, args);
  };
};

  function isNodeList(el) {
    if (root.StaticNodeList) {
      // IE8 Specific
      // instanceof is slower than Object#toString, but Object#toString will not work as intended in IE8
      return el instanceof root.StaticNodeList || el instanceof root.NodeList;
    } else {
      return Object.prototype.toString.call(el) === '[object NodeList]';
    }
  }

  function ListenDisposable(e, n, fn) {
    this._e = e;
    this._n = n;
    this._fn = fn;
    this._e.addEventListener(this._n, this._fn, false);
    this.isDisposed = false;
  }
  ListenDisposable.prototype.dispose = function () {
    if (!this.isDisposed) {
      this._e.removeEventListener(this._n, this._fn, false);
      this.isDisposed = true;
    }
  };

  function createEventListener (el, eventName, handler) {
    var disposables = new CompositeDisposable();

    // Asume NodeList or HTMLCollection
    var elemToString = Object.prototype.toString.call(el);
    if (isNodeList(el) || elemToString === '[object HTMLCollection]') {
      for (var i = 0, len = el.length; i < len; i++) {
        disposables.add(createEventListener(el.item(i), eventName, handler));
      }
    } else if (el) {
      disposables.add(new ListenDisposable(el, eventName, handler));
    }

    return disposables;
  }

  /**
   * Configuration option to determine whether to use native events only
   */
  Rx.config.useNativeEvents = false;

  var EventObservable = (function(__super__) {
    inherits(EventObservable, __super__);
    function EventObservable(el, name, fn) {
      this._el = el;
      this._n = name;
      this._fn = fn;
      __super__.call(this);
    }

    function createHandler(o, fn) {
      return function handler () {
        var results = arguments[0];
        if (isFunction(fn)) {
          results = tryCatch(fn).apply(null, arguments);
          if (results === errorObj) { return o.onError(results.e); }
        }
        o.onNext(results);
      };
    }

    EventObservable.prototype.subscribeCore = function (o) {
      return createEventListener(
        this._el,
        this._n,
        createHandler(o, this._fn));
    };

    return EventObservable;
  }(ObservableBase));

  /**
   * Creates an observable sequence by adding an event listener to the matching DOMElement or each item in the NodeList.
   * @param {Object} element The DOMElement or NodeList to attach a listener.
   * @param {String} eventName The event name to attach the observable sequence.
   * @param {Function} [selector] A selector which takes the arguments from the event handler to produce a single item to yield on next.
   * @returns {Observable} An observable sequence of events from the specified element and the specified event.
   */
  Observable.fromEvent = function (element, eventName, selector) {
    // Node.js specific
    if (element.addListener) {
      return fromEventPattern(
        function (h) { element.addListener(eventName, h); },
        function (h) { element.removeListener(eventName, h); },
        selector);
    }

    // Use only if non-native events are allowed
    if (!Rx.config.useNativeEvents) {
      // Handles jq, Angular.js, Zepto, Marionette, Ember.js
      if (typeof element.on === 'function' && typeof element.off === 'function') {
        return fromEventPattern(
          function (h) { element.on(eventName, h); },
          function (h) { element.off(eventName, h); },
          selector);
      }
    }

    return new EventObservable(element, eventName, selector).publish().refCount();
  };

  var EventPatternObservable = (function(__super__) {
    inherits(EventPatternObservable, __super__);
    function EventPatternObservable(add, del, fn) {
      this._add = add;
      this._del = del;
      this._fn = fn;
      __super__.call(this);
    }

    function createHandler(o, fn) {
      return function handler () {
        var results = arguments[0];
        if (isFunction(fn)) {
          results = tryCatch(fn).apply(null, arguments);
          if (results === errorObj) { return o.onError(results.e); }
        }
        o.onNext(results);
      };
    }

    EventPatternObservable.prototype.subscribeCore = function (o) {
      var fn = createHandler(o, this._fn);
      var returnValue = this._add(fn);
      return new EventPatternDisposable(this._del, fn, returnValue);
    };

    function EventPatternDisposable(del, fn, ret) {
      this._del = del;
      this._fn = fn;
      this._ret = ret;
      this.isDisposed = false;
    }

    EventPatternDisposable.prototype.dispose = function () {
      if(!this.isDisposed) {
        isFunction(this._del) && this._del(this._fn, this._ret);
        this.isDisposed = true;
      }
    };

    return EventPatternObservable;
  }(ObservableBase));

  /**
   * Creates an observable sequence from an event emitter via an addHandler/removeHandler pair.
   * @param {Function} addHandler The function to add a handler to the emitter.
   * @param {Function} [removeHandler] The optional function to remove a handler from an emitter.
   * @param {Function} [selector] A selector which takes the arguments from the event handler to produce a single item to yield on next.
   * @returns {Observable} An observable sequence which wraps an event from an event emitter
   */
  var fromEventPattern = Observable.fromEventPattern = function (addHandler, removeHandler, selector) {
    return new EventPatternObservable(addHandler, removeHandler, selector).publish().refCount();
  };

  var FromPromiseObservable = (function(__super__) {
    inherits(FromPromiseObservable, __super__);
    function FromPromiseObservable(p, s) {
      this._p = p;
      this._s = s;
      __super__.call(this);
    }

    function scheduleNext(s, state) {
      var o = state[0], data = state[1];
      o.onNext(data);
      o.onCompleted();
    }

    function scheduleError(s, state) {
      var o = state[0], err = state[1];
      o.onError(err);
    }

    FromPromiseObservable.prototype.subscribeCore = function(o) {
      var sad = new SingleAssignmentDisposable(), self = this;

      this._p
        .then(function (data) {
          sad.setDisposable(self._s.schedule([o, data], scheduleNext));
        }, function (err) {
          sad.setDisposable(self._s.schedule([o, err], scheduleError));
        });

      return sad;
    };

    return FromPromiseObservable;
  }(ObservableBase));

  /**
  * Converts a Promise to an Observable sequence
  * @param {Promise} An ES6 Compliant promise.
  * @returns {Observable} An Observable sequence which wraps the existing promise success and failure.
  */
  var observableFromPromise = Observable.fromPromise = function (promise, scheduler) {
    scheduler || (scheduler = defaultScheduler);
    return new FromPromiseObservable(promise, scheduler);
  };

  /*
   * Converts an existing observable sequence to an ES6 Compatible Promise
   * @example
   * var promise = Rx.Observable.return(42).toPromise(RSVP.Promise);
   *
   * // With config
   * Rx.config.Promise = RSVP.Promise;
   * var promise = Rx.Observable.return(42).toPromise();
   * @param {Function} [promiseCtor] The constructor of the promise. If not provided, it looks for it in Rx.config.Promise.
   * @returns {Promise} An ES6 compatible promise with the last value from the observable sequence.
   */
  observableProto.toPromise = function (promiseCtor) {
    promiseCtor || (promiseCtor = Rx.config.Promise);
    if (!promiseCtor) { throw new NotSupportedError('Promise type not provided nor in Rx.config.Promise'); }
    var source = this;
    return new promiseCtor(function (resolve, reject) {
      // No cancellation can be done
      var value;
      source.subscribe(function (v) {
        value = v;
      }, reject, function () {
        resolve(value);
      });
    });
  };

  /**
   * Invokes the asynchronous function, surfacing the result through an observable sequence.
   * @param {Function} functionAsync Asynchronous function which returns a Promise to run.
   * @returns {Observable} An observable sequence exposing the function's result value, or an exception.
   */
  Observable.startAsync = function (functionAsync) {
    var promise = tryCatch(functionAsync)();
    if (promise === errorObj) { return observableThrow(promise.e); }
    return observableFromPromise(promise);
  };

  var MulticastObservable = (function (__super__) {
    inherits(MulticastObservable, __super__);
    function MulticastObservable(source, fn1, fn2) {
      this.source = source;
      this._fn1 = fn1;
      this._fn2 = fn2;
      __super__.call(this);
    }

    MulticastObservable.prototype.subscribeCore = function (o) {
      var connectable = this.source.multicast(this._fn1());
      return new BinaryDisposable(this._fn2(connectable).subscribe(o), connectable.connect());
    };

    return MulticastObservable;
  }(ObservableBase));

  /**
   * Multicasts the source sequence notifications through an instantiated subject into all uses of the sequence within a selector function. Each
   * subscription to the resulting sequence causes a separate multicast invocation, exposing the sequence resulting from the selector function's
   * invocation. For specializations with fixed subject types, see Publish, PublishLast, and Replay.
   *
   * @example
   * 1 - res = source.multicast(observable);
   * 2 - res = source.multicast(function () { return new Subject(); }, function (x) { return x; });
   *
   * @param {Function|Subject} subjectOrSubjectSelector
   * Factory function to create an intermediate subject through which the source sequence's elements will be multicast to the selector function.
   * Or:
   * Subject to push source elements into.
   *
   * @param {Function} [selector] Optional selector function which can use the multicasted source sequence subject to the policies enforced by the created subject. Specified only if <paramref name="subjectOrSubjectSelector" is a factory function.
   * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source sequence within a selector function.
   */
  observableProto.multicast = function (subjectOrSubjectSelector, selector) {
    return isFunction(subjectOrSubjectSelector) ?
      new MulticastObservable(this, subjectOrSubjectSelector, selector) :
      new ConnectableObservable(this, subjectOrSubjectSelector);
  };

  /**
   * Returns an observable sequence that is the result of invoking the selector on a connectable observable sequence that shares a single subscription to the underlying sequence.
   * This operator is a specialization of Multicast using a regular Subject.
   *
   * @example
   * var resres = source.publish();
   * var res = source.publish(function (x) { return x; });
   *
   * @param {Function} [selector] Selector function which can use the multicasted source sequence as many times as needed, without causing multiple subscriptions to the source sequence. Subscribers to the given source will receive all notifications of the source from the time of the subscription on.
   * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source sequence within a selector function.
   */
  observableProto.publish = function (selector) {
    return selector && isFunction(selector) ?
      this.multicast(function () { return new Subject(); }, selector) :
      this.multicast(new Subject());
  };

  /**
   * Returns an observable sequence that shares a single subscription to the underlying sequence.
   * This operator is a specialization of publish which creates a subscription when the number of observers goes from zero to one, then shares that subscription with all subsequent observers until the number of observers returns to zero, at which point the subscription is disposed.
   * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source sequence.
   */
  observableProto.share = function () {
    return this.publish().refCount();
  };

  /**
   * Returns an observable sequence that is the result of invoking the selector on a connectable observable sequence that shares a single subscription to the underlying sequence containing only the last notification.
   * This operator is a specialization of Multicast using a AsyncSubject.
   *
   * @example
   * var res = source.publishLast();
   * var res = source.publishLast(function (x) { return x; });
   *
   * @param selector [Optional] Selector function which can use the multicasted source sequence as many times as needed, without causing multiple subscriptions to the source sequence. Subscribers to the given source will only receive the last notification of the source.
   * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source sequence within a selector function.
   */
  observableProto.publishLast = function (selector) {
    return selector && isFunction(selector) ?
      this.multicast(function () { return new AsyncSubject(); }, selector) :
      this.multicast(new AsyncSubject());
  };

  /**
   * Returns an observable sequence that is the result of invoking the selector on a connectable observable sequence that shares a single subscription to the underlying sequence and starts with initialValue.
   * This operator is a specialization of Multicast using a BehaviorSubject.
   *
   * @example
   * var res = source.publishValue(42);
   * var res = source.publishValue(function (x) { return x.select(function (y) { return y * y; }) }, 42);
   *
   * @param {Function} [selector] Optional selector function which can use the multicasted source sequence as many times as needed, without causing multiple subscriptions to the source sequence. Subscribers to the given source will receive immediately receive the initial value, followed by all notifications of the source from the time of the subscription on.
   * @param {Mixed} initialValue Initial value received by observers upon subscription.
   * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source sequence within a selector function.
   */
  observableProto.publishValue = function (initialValueOrSelector, initialValue) {
    return arguments.length === 2 ?
      this.multicast(function () {
        return new BehaviorSubject(initialValue);
      }, initialValueOrSelector) :
      this.multicast(new BehaviorSubject(initialValueOrSelector));
  };

  /**
   * Returns an observable sequence that shares a single subscription to the underlying sequence and starts with an initialValue.
   * This operator is a specialization of publishValue which creates a subscription when the number of observers goes from zero to one, then shares that subscription with all subsequent observers until the number of observers returns to zero, at which point the subscription is disposed.
   * @param {Mixed} initialValue Initial value received by observers upon subscription.
   * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source sequence.
   */
  observableProto.shareValue = function (initialValue) {
    return this.publishValue(initialValue).refCount();
  };

  /**
   * Returns an observable sequence that is the result of invoking the selector on a connectable observable sequence that shares a single subscription to the underlying sequence replaying notifications subject to a maximum time length for the replay buffer.
   * This operator is a specialization of Multicast using a ReplaySubject.
   *
   * @example
   * var res = source.replay(null, 3);
   * var res = source.replay(null, 3, 500);
   * var res = source.replay(null, 3, 500, scheduler);
   * var res = source.replay(function (x) { return x.take(6).repeat(); }, 3, 500, scheduler);
   *
   * @param selector [Optional] Selector function which can use the multicasted source sequence as many times as needed, without causing multiple subscriptions to the source sequence. Subscribers to the given source will receive all the notifications of the source subject to the specified replay buffer trimming policy.
   * @param bufferSize [Optional] Maximum element count of the replay buffer.
   * @param windowSize [Optional] Maximum time length of the replay buffer.
   * @param scheduler [Optional] Scheduler where connected observers within the selector function will be invoked on.
   * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source sequence within a selector function.
   */
  observableProto.replay = function (selector, bufferSize, windowSize, scheduler) {
    return selector && isFunction(selector) ?
      this.multicast(function () { return new ReplaySubject(bufferSize, windowSize, scheduler); }, selector) :
      this.multicast(new ReplaySubject(bufferSize, windowSize, scheduler));
  };

  /**
   * Returns an observable sequence that shares a single subscription to the underlying sequence replaying notifications subject to a maximum time length for the replay buffer.
   * This operator is a specialization of replay which creates a subscription when the number of observers goes from zero to one, then shares that subscription with all subsequent observers until the number of observers returns to zero, at which point the subscription is disposed.
   *
   * @example
   * var res = source.shareReplay(3);
   * var res = source.shareReplay(3, 500);
   * var res = source.shareReplay(3, 500, scheduler);
   *

   * @param bufferSize [Optional] Maximum element count of the replay buffer.
   * @param window [Optional] Maximum time length of the replay buffer.
   * @param scheduler [Optional] Scheduler where connected observers within the selector function will be invoked on.
   * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source sequence.
   */
  observableProto.shareReplay = function (bufferSize, windowSize, scheduler) {
    return this.replay(null, bufferSize, windowSize, scheduler).refCount();
  };

  var RefCountObservable = (function (__super__) {
    inherits(RefCountObservable, __super__);
    function RefCountObservable(source) {
      this.source = source;
      this._count = 0;
      this._connectableSubscription = null;
      __super__.call(this);
    }

    RefCountObservable.prototype.subscribeCore = function (o) {
      var subscription = this.source.subscribe(o);
      ++this._count === 1 && (this._connectableSubscription = this.source.connect());
      return new RefCountDisposable(this, subscription);
    };

    function RefCountDisposable(p, s) {
      this._p = p;
      this._s = s;
      this.isDisposed = false;
    }

    RefCountDisposable.prototype.dispose = function () {
      if (!this.isDisposed) {
        this.isDisposed = true;
        this._s.dispose();
        --this._p._count === 0 && this._p._connectableSubscription.dispose();
      }
    };

    return RefCountObservable;
  }(ObservableBase));

  var ConnectableObservable = Rx.ConnectableObservable = (function (__super__) {
    inherits(ConnectableObservable, __super__);
    function ConnectableObservable(source, subject) {
      this.source = source;
      this._connection = null;
      this._source = source.asObservable();
      this._subject = subject;
      __super__.call(this);
    }

    function ConnectDisposable(parent, subscription) {
      this._p = parent;
      this._s = subscription;
    }

    ConnectDisposable.prototype.dispose = function () {
      if (this._s) {
        this._s.dispose();
        this._s = null;
        this._p._connection = null;
      }
    };

    ConnectableObservable.prototype.connect = function () {
      if (!this._connection) {
        var subscription = this._source.subscribe(this._subject);
        this._connection = new ConnectDisposable(this, subscription);
      }
      return this._connection;
    };

    ConnectableObservable.prototype._subscribe = function (o) {
      return this._subject.subscribe(o);
    };

    ConnectableObservable.prototype.refCount = function () {
      return new RefCountObservable(this);
    };

    return ConnectableObservable;
  }(Observable));

  var TimerObservable = (function(__super__) {
    inherits(TimerObservable, __super__);
    function TimerObservable(dt, s) {
      this._dt = dt;
      this._s = s;
      __super__.call(this);
    }

    TimerObservable.prototype.subscribeCore = function (o) {
      return this._s.scheduleFuture(o, this._dt, scheduleMethod);
    };

    function scheduleMethod(s, o) {
      o.onNext(0);
      o.onCompleted();
    }

    return TimerObservable;
  }(ObservableBase));

  function _observableTimer(dueTime, scheduler) {
    return new TimerObservable(dueTime, scheduler);
  }

  function observableTimerDateAndPeriod(dueTime, period, scheduler) {
    return new AnonymousObservable(function (observer) {
      var d = dueTime, p = normalizeTime(period);
      return scheduler.scheduleRecursiveFuture(0, d, function (count, self) {
        if (p > 0) {
          var now = scheduler.now();
          d = new Date(d.getTime() + p);
          d.getTime() <= now && (d = new Date(now + p));
        }
        observer.onNext(count);
        self(count + 1, new Date(d));
      });
    });
  }

  function observableTimerTimeSpanAndPeriod(dueTime, period, scheduler) {
    return dueTime === period ?
      new AnonymousObservable(function (observer) {
        return scheduler.schedulePeriodic(0, period, function (count) {
          observer.onNext(count);
          return count + 1;
        });
      }) :
      observableDefer(function () {
        return observableTimerDateAndPeriod(new Date(scheduler.now() + dueTime), period, scheduler);
      });
  }

  /**
   *  Returns an observable sequence that produces a value after each period.
   *
   * @example
   *  1 - res = Rx.Observable.interval(1000);
   *  2 - res = Rx.Observable.interval(1000, Rx.Scheduler.timeout);
   *
   * @param {Number} period Period for producing the values in the resulting sequence (specified as an integer denoting milliseconds).
   * @param {Scheduler} [scheduler] Scheduler to run the timer on. If not specified, Rx.Scheduler.timeout is used.
   * @returns {Observable} An observable sequence that produces a value after each period.
   */
  var observableinterval = Observable.interval = function (period, scheduler) {
    return observableTimerTimeSpanAndPeriod(period, period, isScheduler(scheduler) ? scheduler : defaultScheduler);
  };

  /**
   *  Returns an observable sequence that produces a value after dueTime has elapsed and then after each period.
   * @param {Number} dueTime Absolute (specified as a Date object) or relative time (specified as an integer denoting milliseconds) at which to produce the first value.
   * @param {Mixed} [periodOrScheduler]  Period to produce subsequent values (specified as an integer denoting milliseconds), or the scheduler to run the timer on. If not specified, the resulting timer is not recurring.
   * @param {Scheduler} [scheduler]  Scheduler to run the timer on. If not specified, the timeout scheduler is used.
   * @returns {Observable} An observable sequence that produces a value after due time has elapsed and then each period.
   */
  var observableTimer = Observable.timer = function (dueTime, periodOrScheduler, scheduler) {
    var period;
    isScheduler(scheduler) || (scheduler = defaultScheduler);
    if (periodOrScheduler != null && typeof periodOrScheduler === 'number') {
      period = periodOrScheduler;
    } else if (isScheduler(periodOrScheduler)) {
      scheduler = periodOrScheduler;
    }
    if ((dueTime instanceof Date || typeof dueTime === 'number') && period === undefined) {
      return _observableTimer(dueTime, scheduler);
    }
    if (dueTime instanceof Date && period !== undefined) {
      return observableTimerDateAndPeriod(dueTime, periodOrScheduler, scheduler);
    }
    return observableTimerTimeSpanAndPeriod(dueTime, period, scheduler);
  };

  function observableDelayRelative(source, dueTime, scheduler) {
    return new AnonymousObservable(function (o) {
      var active = false,
        cancelable = new SerialDisposable(),
        exception = null,
        q = [],
        running = false,
        subscription;
      subscription = source.materialize().timestamp(scheduler).subscribe(function (notification) {
        var d, shouldRun;
        if (notification.value.kind === 'E') {
          q = [];
          q.push(notification);
          exception = notification.value.error;
          shouldRun = !running;
        } else {
          q.push({ value: notification.value, timestamp: notification.timestamp + dueTime });
          shouldRun = !active;
          active = true;
        }
        if (shouldRun) {
          if (exception !== null) {
            o.onError(exception);
          } else {
            d = new SingleAssignmentDisposable();
            cancelable.setDisposable(d);
            d.setDisposable(scheduler.scheduleRecursiveFuture(null, dueTime, function (_, self) {
              var e, recurseDueTime, result, shouldRecurse;
              if (exception !== null) {
                return;
              }
              running = true;
              do {
                result = null;
                if (q.length > 0 && q[0].timestamp - scheduler.now() <= 0) {
                  result = q.shift().value;
                }
                if (result !== null) {
                  result.accept(o);
                }
              } while (result !== null);
              shouldRecurse = false;
              recurseDueTime = 0;
              if (q.length > 0) {
                shouldRecurse = true;
                recurseDueTime = Math.max(0, q[0].timestamp - scheduler.now());
              } else {
                active = false;
              }
              e = exception;
              running = false;
              if (e !== null) {
                o.onError(e);
              } else if (shouldRecurse) {
                self(null, recurseDueTime);
              }
            }));
          }
        }
      });
      return new BinaryDisposable(subscription, cancelable);
    }, source);
  }

  function observableDelayAbsolute(source, dueTime, scheduler) {
    return observableDefer(function () {
      return observableDelayRelative(source, dueTime - scheduler.now(), scheduler);
    });
  }

  function delayWithSelector(source, subscriptionDelay, delayDurationSelector) {
    var subDelay, selector;
    if (isFunction(subscriptionDelay)) {
      selector = subscriptionDelay;
    } else {
      subDelay = subscriptionDelay;
      selector = delayDurationSelector;
    }
    return new AnonymousObservable(function (o) {
      var delays = new CompositeDisposable(), atEnd = false, subscription = new SerialDisposable();

      function start() {
        subscription.setDisposable(source.subscribe(
          function (x) {
            var delay = tryCatch(selector)(x);
            if (delay === errorObj) { return o.onError(delay.e); }
            var d = new SingleAssignmentDisposable();
            delays.add(d);
            d.setDisposable(delay.subscribe(
              function () {
                o.onNext(x);
                delays.remove(d);
                done();
              },
              function (e) { o.onError(e); },
              function () {
                o.onNext(x);
                delays.remove(d);
                done();
              }
            ));
          },
          function (e) { o.onError(e); },
          function () {
            atEnd = true;
            subscription.dispose();
            done();
          }
        ));
      }

      function done () {
        atEnd && delays.length === 0 && o.onCompleted();
      }

      if (!subDelay) {
        start();
      } else {
        subscription.setDisposable(subDelay.subscribe(start, function (e) { o.onError(e); }, start));
      }

      return new BinaryDisposable(subscription, delays);
    }, source);
  }

  /**
   *  Time shifts the observable sequence by dueTime.
   *  The relative time intervals between the values are preserved.
   *
   * @param {Number} dueTime Absolute (specified as a Date object) or relative time (specified as an integer denoting milliseconds) by which to shift the observable sequence.
   * @param {Scheduler} [scheduler] Scheduler to run the delay timers on. If not specified, the timeout scheduler is used.
   * @returns {Observable} Time-shifted sequence.
   */
  observableProto.delay = function () {
    var firstArg = arguments[0];
    if (typeof firstArg === 'number' || firstArg instanceof Date) {
      var dueTime = firstArg, scheduler = arguments[1];
      isScheduler(scheduler) || (scheduler = defaultScheduler);
      return dueTime instanceof Date ?
        observableDelayAbsolute(this, dueTime, scheduler) :
        observableDelayRelative(this, dueTime, scheduler);
    } else if (Observable.isObservable(firstArg) || isFunction(firstArg)) {
      return delayWithSelector(this, firstArg, arguments[1]);
    } else {
      throw new Error('Invalid arguments');
    }
  };

  var DebounceObservable = (function (__super__) {
    inherits(DebounceObservable, __super__);
    function DebounceObservable(source, dt, s) {
      isScheduler(s) || (s = defaultScheduler);
      this.source = source;
      this._dt = dt;
      this._s = s;
      __super__.call(this);
    }

    DebounceObservable.prototype.subscribeCore = function (o) {
      var cancelable = new SerialDisposable();
      return new BinaryDisposable(
        this.source.subscribe(new DebounceObserver(o, this._dt, this._s, cancelable)),
        cancelable);
    };

    return DebounceObservable;
  }(ObservableBase));

  var DebounceObserver = (function (__super__) {
    inherits(DebounceObserver, __super__);
    function DebounceObserver(observer, dueTime, scheduler, cancelable) {
      this._o = observer;
      this._d = dueTime;
      this._scheduler = scheduler;
      this._c = cancelable;
      this._v = null;
      this._hv = false;
      this._id = 0;
      __super__.call(this);
    }

    function scheduleFuture(s, state) {
      state.self._hv && state.self._id === state.currentId && state.self._o.onNext(state.x);
      state.self._hv = false;
    }

    DebounceObserver.prototype.next = function (x) {
      this._hv = true;
      this._v = x;
      var currentId = ++this._id, d = new SingleAssignmentDisposable();
      this._c.setDisposable(d);
      d.setDisposable(this._scheduler.scheduleFuture(this, this._d, function (_, self) {
        self._hv && self._id === currentId && self._o.onNext(x);
        self._hv = false;
      }));
    };

    DebounceObserver.prototype.error = function (e) {
      this._c.dispose();
      this._o.onError(e);
      this._hv = false;
      this._id++;
    };

    DebounceObserver.prototype.completed = function () {
      this._c.dispose();
      this._hv && this._o.onNext(this._v);
      this._o.onCompleted();
      this._hv = false;
      this._id++;
    };

    return DebounceObserver;
  }(AbstractObserver));

  function debounceWithSelector(source, durationSelector) {
    return new AnonymousObservable(function (o) {
      var value, hasValue = false, cancelable = new SerialDisposable(), id = 0;
      var subscription = source.subscribe(
        function (x) {
          var throttle = tryCatch(durationSelector)(x);
          if (throttle === errorObj) { return o.onError(throttle.e); }

          isPromise(throttle) && (throttle = observableFromPromise(throttle));

          hasValue = true;
          value = x;
          id++;
          var currentid = id, d = new SingleAssignmentDisposable();
          cancelable.setDisposable(d);
          d.setDisposable(throttle.subscribe(
            function () {
              hasValue && id === currentid && o.onNext(value);
              hasValue = false;
              d.dispose();
            },
            function (e) { o.onError(e); },
            function () {
              hasValue && id === currentid && o.onNext(value);
              hasValue = false;
              d.dispose();
            }
          ));
        },
        function (e) {
          cancelable.dispose();
          o.onError(e);
          hasValue = false;
          id++;
        },
        function () {
          cancelable.dispose();
          hasValue && o.onNext(value);
          o.onCompleted();
          hasValue = false;
          id++;
        }
      );
      return new BinaryDisposable(subscription, cancelable);
    }, source);
  }

  observableProto.debounce = function () {
    if (isFunction (arguments[0])) {
      return debounceWithSelector(this, arguments[0]);
    } else if (typeof arguments[0] === 'number') {
      return new DebounceObservable(this, arguments[0], arguments[1]);
    } else {
      throw new Error('Invalid arguments');
    }
  };

  var TimestampObservable = (function (__super__) {
    inherits(TimestampObservable, __super__);
    function TimestampObservable(source, s) {
      this.source = source;
      this._s = s;
      __super__.call(this);
    }

    TimestampObservable.prototype.subscribeCore = function (o) {
      return this.source.subscribe(new TimestampObserver(o, this._s));
    };

    return TimestampObservable;
  }(ObservableBase));

  var TimestampObserver = (function (__super__) {
    inherits(TimestampObserver, __super__);
    function TimestampObserver(o, s) {
      this._o = o;
      this._s = s;
      __super__.call(this);
    }

    TimestampObserver.prototype.next = function (x) {
      this._o.onNext({ value: x, timestamp: this._s.now() });
    };

    TimestampObserver.prototype.error = function (e) {
      this._o.onError(e);
    };

    TimestampObserver.prototype.completed = function () {
      this._o.onCompleted();
    };

    return TimestampObserver;
  }(AbstractObserver));

  /**
   *  Records the timestamp for each value in an observable sequence.
   *
   * @example
   *  1 - res = source.timestamp(); // produces { value: x, timestamp: ts }
   *  2 - res = source.timestamp(Rx.Scheduler.default);
   *
   * @param {Scheduler} [scheduler]  Scheduler used to compute timestamps. If not specified, the default scheduler is used.
   * @returns {Observable} An observable sequence with timestamp information on values.
   */
  observableProto.timestamp = function (scheduler) {
    isScheduler(scheduler) || (scheduler = defaultScheduler);
    return new TimestampObservable(this, scheduler);
  };

  var SampleObservable = (function(__super__) {
    inherits(SampleObservable, __super__);
    function SampleObservable(source, sampler) {
      this.source = source;
      this._sampler = sampler;
      __super__.call(this);
    }

    SampleObservable.prototype.subscribeCore = function (o) {
      var state = {
        o: o,
        atEnd: false,
        value: null,
        hasValue: false,
        sourceSubscription: new SingleAssignmentDisposable()
      };

      state.sourceSubscription.setDisposable(this.source.subscribe(new SampleSourceObserver(state)));
      return new BinaryDisposable(
        state.sourceSubscription,
        this._sampler.subscribe(new SamplerObserver(state))
      );
    };

    return SampleObservable;
  }(ObservableBase));

  var SamplerObserver = (function(__super__) {
    inherits(SamplerObserver, __super__);
    function SamplerObserver(s) {
      this._s = s;
      __super__.call(this);
    }

    SamplerObserver.prototype._handleMessage = function () {
      if (this._s.hasValue) {
        this._s.hasValue = false;
        this._s.o.onNext(this._s.value);
      }
      this._s.atEnd && this._s.o.onCompleted();
    };

    SamplerObserver.prototype.next = function () { this._handleMessage(); };
    SamplerObserver.prototype.error = function (e) { this._s.onError(e); };
    SamplerObserver.prototype.completed = function () { this._handleMessage(); };

    return SamplerObserver;
  }(AbstractObserver));

  var SampleSourceObserver = (function(__super__) {
    inherits(SampleSourceObserver, __super__);
    function SampleSourceObserver(s) {
      this._s = s;
      __super__.call(this);
    }

    SampleSourceObserver.prototype.next = function (x) {
      this._s.hasValue = true;
      this._s.value = x;
    };
    SampleSourceObserver.prototype.error = function (e) { this._s.o.onError(e); };
    SampleSourceObserver.prototype.completed = function () {
      this._s.atEnd = true;
      this._s.sourceSubscription.dispose();
    };

    return SampleSourceObserver;
  }(AbstractObserver));

  /**
   *  Samples the observable sequence at each interval.
   *
   * @example
   *  1 - res = source.sample(sampleObservable); // Sampler tick sequence
   *  2 - res = source.sample(5000); // 5 seconds
   *  2 - res = source.sample(5000, Rx.Scheduler.timeout); // 5 seconds
   *
   * @param {Mixed} intervalOrSampler Interval at which to sample (specified as an integer denoting milliseconds) or Sampler Observable.
   * @param {Scheduler} [scheduler]  Scheduler to run the sampling timer on. If not specified, the timeout scheduler is used.
   * @returns {Observable} Sampled observable sequence.
   */
  observableProto.sample = function (intervalOrSampler, scheduler) {
    isScheduler(scheduler) || (scheduler = defaultScheduler);
    return typeof intervalOrSampler === 'number' ?
      new SampleObservable(this, observableinterval(intervalOrSampler, scheduler)) :
      new SampleObservable(this, intervalOrSampler);
  };

  var TimeoutError = Rx.TimeoutError = function(message) {
    this.message = message || 'Timeout has occurred';
    this.name = 'TimeoutError';
    Error.call(this);
  };
  TimeoutError.prototype = Object.create(Error.prototype);

  function timeoutWithSelector(source, firstTimeout, timeoutDurationSelector, other) {
    if (isFunction(firstTimeout)) {
      other = timeoutDurationSelector;
      timeoutDurationSelector = firstTimeout;
      firstTimeout = observableNever();
    }
    Observable.isObservable(other) || (other = observableThrow(new TimeoutError()));
    return new AnonymousObservable(function (o) {
      var subscription = new SerialDisposable(),
        timer = new SerialDisposable(),
        original = new SingleAssignmentDisposable();

      subscription.setDisposable(original);

      var id = 0, switched = false;

      function setTimer(timeout) {
        var myId = id, d = new SingleAssignmentDisposable();

        function timerWins() {
          switched = (myId === id);
          return switched;
        }

        timer.setDisposable(d);
        d.setDisposable(timeout.subscribe(function () {
          timerWins() && subscription.setDisposable(other.subscribe(o));
          d.dispose();
        }, function (e) {
          timerWins() && o.onError(e);
        }, function () {
          timerWins() && subscription.setDisposable(other.subscribe(o));
        }));
      };

      setTimer(firstTimeout);

      function oWins() {
        var res = !switched;
        if (res) { id++; }
        return res;
      }

      original.setDisposable(source.subscribe(function (x) {
        if (oWins()) {
          o.onNext(x);
          var timeout = tryCatch(timeoutDurationSelector)(x);
          if (timeout === errorObj) { return o.onError(timeout.e); }
          setTimer(isPromise(timeout) ? observableFromPromise(timeout) : timeout);
        }
      }, function (e) {
        oWins() && o.onError(e);
      }, function () {
        oWins() && o.onCompleted();
      }));
      return new BinaryDisposable(subscription, timer);
    }, source);
  }

  function timeout(source, dueTime, other, scheduler) {
    if (isScheduler(other)) {
      scheduler = other;
      other = observableThrow(new TimeoutError());
    }
    if (other instanceof Error) { other = observableThrow(other); }
    isScheduler(scheduler) || (scheduler = defaultScheduler);
    Observable.isObservable(other) || (other = observableThrow(new TimeoutError()));
    return new AnonymousObservable(function (o) {
      var id = 0,
        original = new SingleAssignmentDisposable(),
        subscription = new SerialDisposable(),
        switched = false,
        timer = new SerialDisposable();

      subscription.setDisposable(original);

      function createTimer() {
        var myId = id;
        timer.setDisposable(scheduler.scheduleFuture(null, dueTime, function () {
          switched = id === myId;
          if (switched) {
            isPromise(other) && (other = observableFromPromise(other));
            subscription.setDisposable(other.subscribe(o));
          }
        }));
      }

      createTimer();

      original.setDisposable(source.subscribe(function (x) {
        if (!switched) {
          id++;
          o.onNext(x);
          createTimer();
        }
      }, function (e) {
        if (!switched) {
          id++;
          o.onError(e);
        }
      }, function () {
        if (!switched) {
          id++;
          o.onCompleted();
        }
      }));
      return new BinaryDisposable(subscription, timer);
    }, source);
  }

  observableProto.timeout = function () {
    var firstArg = arguments[0];
    if (firstArg instanceof Date || typeof firstArg === 'number') {
      return timeout(this, firstArg, arguments[1], arguments[2]);
    } else if (Observable.isObservable(firstArg) || isFunction(firstArg)) {
      return timeoutWithSelector(this, firstArg, arguments[1], arguments[2]);
    } else {
      throw new Error('Invalid arguments');
    }
  };

  /**
   * Returns an Observable that emits only the first item emitted by the source Observable during sequential time windows of a specified duration.
   * @param {Number} windowDuration time to wait before emitting another item after emitting the last item
   * @param {Scheduler} [scheduler] the Scheduler to use internally to manage the timers that handle timeout for each item. If not provided, defaults to Scheduler.timeout.
   * @returns {Observable} An Observable that performs the throttle operation.
   */
  observableProto.throttle = function (windowDuration, scheduler) {
    isScheduler(scheduler) || (scheduler = defaultScheduler);
    var duration = +windowDuration || 0;
    if (duration <= 0) { throw new RangeError('windowDuration cannot be less or equal zero.'); }
    var source = this;
    return new AnonymousObservable(function (o) {
      var lastOnNext = 0;
      return source.subscribe(
        function (x) {
          var now = scheduler.now();
          if (lastOnNext === 0 || now - lastOnNext >= duration) {
            lastOnNext = now;
            o.onNext(x);
          }
        },function (e) { o.onError(e); }, function () { o.onCompleted(); }
      );
    }, source);
  };

  var PausableObservable = (function (__super__) {
    inherits(PausableObservable, __super__);
    function PausableObservable(source, pauser) {
      this.source = source;
      this.controller = new Subject();

      if (pauser && pauser.subscribe) {
        this.pauser = this.controller.merge(pauser);
      } else {
        this.pauser = this.controller;
      }

      __super__.call(this);
    }

    PausableObservable.prototype._subscribe = function (o) {
      var conn = this.source.publish(),
        subscription = conn.subscribe(o),
        connection = disposableEmpty;

      var pausable = this.pauser.distinctUntilChanged().subscribe(function (b) {
        if (b) {
          connection = conn.connect();
        } else {
          connection.dispose();
          connection = disposableEmpty;
        }
      });

      return new NAryDisposable([subscription, connection, pausable]);
    };

    PausableObservable.prototype.pause = function () {
      this.controller.onNext(false);
    };

    PausableObservable.prototype.resume = function () {
      this.controller.onNext(true);
    };

    return PausableObservable;

  }(Observable));

  /**
   * Pauses the underlying observable sequence based upon the observable sequence which yields true/false.
   * @example
   * var pauser = new Rx.Subject();
   * var source = Rx.Observable.interval(100).pausable(pauser);
   * @param {Observable} pauser The observable sequence used to pause the underlying sequence.
   * @returns {Observable} The observable sequence which is paused based upon the pauser.
   */
  observableProto.pausable = function (pauser) {
    return new PausableObservable(this, pauser);
  };

  function combineLatestSource(source, subject, resultSelector) {
    return new AnonymousObservable(function (o) {
      var hasValue = [false, false],
        hasValueAll = false,
        isDone = false,
        values = new Array(2),
        err;

      function next(x, i) {
        values[i] = x;
        hasValue[i] = true;
        if (hasValueAll || (hasValueAll = hasValue.every(identity))) {
          if (err) { return o.onError(err); }
          var res = tryCatch(resultSelector).apply(null, values);
          if (res === errorObj) { return o.onError(res.e); }
          o.onNext(res);
        }
        isDone && values[1] && o.onCompleted();
      }

      return new BinaryDisposable(
        source.subscribe(
          function (x) {
            next(x, 0);
          },
          function (e) {
            if (values[1]) {
              o.onError(e);
            } else {
              err = e;
            }
          },
          function () {
            isDone = true;
            values[1] && o.onCompleted();
          }),
        subject.subscribe(
          function (x) {
            next(x, 1);
          },
          function (e) { o.onError(e); },
          function () {
            isDone = true;
            next(true, 1);
          })
        );
    }, source);
  }

  var PausableBufferedObservable = (function (__super__) {
    inherits(PausableBufferedObservable, __super__);
    function PausableBufferedObservable(source, pauser) {
      this.source = source;
      this.controller = new Subject();

      if (pauser && pauser.subscribe) {
        this.pauser = this.controller.merge(pauser);
      } else {
        this.pauser = this.controller;
      }

      __super__.call(this);
    }

    PausableBufferedObservable.prototype._subscribe = function (o) {
      var q = [], previousShouldFire;

      function drainQueue() { while (q.length > 0) { o.onNext(q.shift()); } }

      var subscription =
        combineLatestSource(
          this.source,
          this.pauser.startWith(false).distinctUntilChanged(),
          function (data, shouldFire) {
            return { data: data, shouldFire: shouldFire };
          })
          .subscribe(
            function (results) {
              if (previousShouldFire !== undefined && results.shouldFire !== previousShouldFire) {
                previousShouldFire = results.shouldFire;
                // change in shouldFire
                if (results.shouldFire) { drainQueue(); }
              } else {
                previousShouldFire = results.shouldFire;
                // new data
                if (results.shouldFire) {
                  o.onNext(results.data);
                } else {
                  q.push(results.data);
                }
              }
            },
            function (err) {
              drainQueue();
              o.onError(err);
            },
            function () {
              drainQueue();
              o.onCompleted();
            }
          );
      return subscription;      
    };

    PausableBufferedObservable.prototype.pause = function () {
      this.controller.onNext(false);
    };

    PausableBufferedObservable.prototype.resume = function () {
      this.controller.onNext(true);
    };

    return PausableBufferedObservable;

  }(Observable));

  /**
   * Pauses the underlying observable sequence based upon the observable sequence which yields true/false,
   * and yields the values that were buffered while paused.
   * @example
   * var pauser = new Rx.Subject();
   * var source = Rx.Observable.interval(100).pausableBuffered(pauser);
   * @param {Observable} pauser The observable sequence used to pause the underlying sequence.
   * @returns {Observable} The observable sequence which is paused based upon the pauser.
   */
  observableProto.pausableBuffered = function (pauser) {
    return new PausableBufferedObservable(this, pauser);
  };

  var ControlledObservable = (function (__super__) {
    inherits(ControlledObservable, __super__);
    function ControlledObservable (source, enableQueue, scheduler) {
      __super__.call(this);
      this.subject = new ControlledSubject(enableQueue, scheduler);
      this.source = source.multicast(this.subject).refCount();
    }

    ControlledObservable.prototype._subscribe = function (o) {
      return this.source.subscribe(o);
    };

    ControlledObservable.prototype.request = function (numberOfItems) {
      return this.subject.request(numberOfItems == null ? -1 : numberOfItems);
    };

    return ControlledObservable;

  }(Observable));

  var ControlledSubject = (function (__super__) {
    inherits(ControlledSubject, __super__);
    function ControlledSubject(enableQueue, scheduler) {
      enableQueue == null && (enableQueue = true);

      __super__.call(this);
      this.subject = new Subject();
      this.enableQueue = enableQueue;
      this.queue = enableQueue ? [] : null;
      this.requestedCount = 0;
      this.requestedDisposable = null;
      this.error = null;
      this.hasFailed = false;
      this.hasCompleted = false;
      this.scheduler = scheduler || currentThreadScheduler;
    }

    addProperties(ControlledSubject.prototype, Observer, {
      _subscribe: function (o) {
        return this.subject.subscribe(o);
      },
      onCompleted: function () {
        this.hasCompleted = true;
        if (!this.enableQueue || this.queue.length === 0) {
          this.subject.onCompleted();
          this.disposeCurrentRequest();
        } else {
          this.queue.push(Notification.createOnCompleted());
        }
      },
      onError: function (error) {
        this.hasFailed = true;
        this.error = error;
        if (!this.enableQueue || this.queue.length === 0) {
          this.subject.onError(error);
          this.disposeCurrentRequest();
        } else {
          this.queue.push(Notification.createOnError(error));
        }
      },
      onNext: function (value) {
        if (this.requestedCount <= 0) {
          this.enableQueue && this.queue.push(Notification.createOnNext(value));
        } else {
          (this.requestedCount-- === 0) && this.disposeCurrentRequest();
          this.subject.onNext(value);
        }
      },
      _processRequest: function (numberOfItems) {
        if (this.enableQueue) {
          while (this.queue.length > 0 && (numberOfItems > 0 || this.queue[0].kind !== 'N')) {
            var first = this.queue.shift();
            first.accept(this.subject);
            if (first.kind === 'N') {
              numberOfItems--;
            } else {
              this.disposeCurrentRequest();
              this.queue = [];
            }
          }
        }

        return numberOfItems;
      },
      request: function (number) {
        this.disposeCurrentRequest();
        var self = this;

        this.requestedDisposable = this.scheduler.schedule(number,
        function(s, i) {
          var remaining = self._processRequest(i);
          var stopped = self.hasCompleted || self.hasFailed;
          if (!stopped && remaining > 0) {
            self.requestedCount = remaining;

            return disposableCreate(function () {
              self.requestedCount = 0;
            });
              // Scheduled item is still in progress. Return a new
              // disposable to allow the request to be interrupted
              // via dispose.
          }
        });

        return this.requestedDisposable;
      },
      disposeCurrentRequest: function () {
        if (this.requestedDisposable) {
          this.requestedDisposable.dispose();
          this.requestedDisposable = null;
        }
      }
    });

    return ControlledSubject;
  }(Observable));

  /**
   * Attaches a controller to the observable sequence with the ability to queue.
   * @example
   * var source = Rx.Observable.interval(100).controlled();
   * source.request(3); // Reads 3 values
   * @param {bool} enableQueue truthy value to determine if values should be queued pending the next request
   * @param {Scheduler} scheduler determines how the requests will be scheduled
   * @returns {Observable} The observable sequence which only propagates values on request.
   */
  observableProto.controlled = function (enableQueue, scheduler) {

    if (enableQueue && isScheduler(enableQueue)) {
      scheduler = enableQueue;
      enableQueue = true;
    }

    if (enableQueue == null) {  enableQueue = true; }
    return new ControlledObservable(this, enableQueue, scheduler);
  };

  /**
   * Pipes the existing Observable sequence into a Node.js Stream.
   * @param {Stream} dest The destination Node.js stream.
   * @returns {Stream} The destination stream.
   */
  observableProto.pipe = function (dest) {
    var source = this.pausableBuffered();

    function onDrain() {
      source.resume();
    }

    dest.addListener('drain', onDrain);

    source.subscribe(
      function (x) {
        !dest.write(String(x)) && source.pause();
      },
      function (err) {
        dest.emit('error', err);
      },
      function () {
        // Hack check because STDIO is not closable
        !dest._isStdio && dest.end();
        dest.removeListener('drain', onDrain);
      });

    source.resume();

    return dest;
  };

  var TransduceObserver = (function (__super__) {
    inherits(TransduceObserver, __super__);
    function TransduceObserver(o, xform) {
      this._o = o;
      this._xform = xform;
      __super__.call(this);
    }

    TransduceObserver.prototype.next = function (x) {
      var res = tryCatch(this._xform['@@transducer/step']).call(this._xform, this._o, x);
      if (res === errorObj) { this._o.onError(res.e); }
    };

    TransduceObserver.prototype.error = function (e) { this._o.onError(e); };

    TransduceObserver.prototype.completed = function () {
      this._xform['@@transducer/result'](this._o);
    };

    return TransduceObserver;
  }(AbstractObserver));

  function transformForObserver(o) {
    return {
      '@@transducer/init': function() {
        return o;
      },
      '@@transducer/step': function(obs, input) {
        return obs.onNext(input);
      },
      '@@transducer/result': function(obs) {
        return obs.onCompleted();
      }
    };
  }

  /**
   * Executes a transducer to transform the observable sequence
   * @param {Transducer} transducer A transducer to execute
   * @returns {Observable} An Observable sequence containing the results from the transducer.
   */
  observableProto.transduce = function(transducer) {
    var source = this;
    return new AnonymousObservable(function(o) {
      var xform = transducer(transformForObserver(o));
      return source.subscribe(new TransduceObserver(o, xform));
    }, source);
  };

  var AnonymousObservable = Rx.AnonymousObservable = (function (__super__) {
    inherits(AnonymousObservable, __super__);

    // Fix subscriber to check for undefined or function returned to decorate as Disposable
    function fixSubscriber(subscriber) {
      return subscriber && isFunction(subscriber.dispose) ? subscriber :
        isFunction(subscriber) ? disposableCreate(subscriber) : disposableEmpty;
    }

    function setDisposable(s, state) {
      var ado = state[0], self = state[1];
      var sub = tryCatch(self.__subscribe).call(self, ado);
      if (sub === errorObj && !ado.fail(errorObj.e)) { thrower(errorObj.e); }
      ado.setDisposable(fixSubscriber(sub));
    }

    function AnonymousObservable(subscribe, parent) {
      this.source = parent;
      this.__subscribe = subscribe;
      __super__.call(this);
    }

    AnonymousObservable.prototype._subscribe = function (o) {
      var ado = new AutoDetachObserver(o), state = [ado, this];

      if (currentThreadScheduler.scheduleRequired()) {
        currentThreadScheduler.schedule(state, setDisposable);
      } else {
        setDisposable(null, state);
      }
      return ado;
    };

    return AnonymousObservable;

  }(Observable));

  var AutoDetachObserver = (function (__super__) {
    inherits(AutoDetachObserver, __super__);

    function AutoDetachObserver(observer) {
      __super__.call(this);
      this.observer = observer;
      this.m = new SingleAssignmentDisposable();
    }

    var AutoDetachObserverPrototype = AutoDetachObserver.prototype;

    AutoDetachObserverPrototype.next = function (value) {
      var result = tryCatch(this.observer.onNext).call(this.observer, value);
      if (result === errorObj) {
        this.dispose();
        thrower(result.e);
      }
    };

    AutoDetachObserverPrototype.error = function (err) {
      var result = tryCatch(this.observer.onError).call(this.observer, err);
      this.dispose();
      result === errorObj && thrower(result.e);
    };

    AutoDetachObserverPrototype.completed = function () {
      var result = tryCatch(this.observer.onCompleted).call(this.observer);
      this.dispose();
      result === errorObj && thrower(result.e);
    };

    AutoDetachObserverPrototype.setDisposable = function (value) { this.m.setDisposable(value); };
    AutoDetachObserverPrototype.getDisposable = function () { return this.m.getDisposable(); };

    AutoDetachObserverPrototype.dispose = function () {
      __super__.prototype.dispose.call(this);
      this.m.dispose();
    };

    return AutoDetachObserver;
  }(AbstractObserver));

  var InnerSubscription = function (s, o) {
    this._s = s;
    this._o = o;
  };

  InnerSubscription.prototype.dispose = function () {
    if (!this._s.isDisposed && this._o !== null) {
      var idx = this._s.observers.indexOf(this._o);
      this._s.observers.splice(idx, 1);
      this._o = null;
    }
  };

  /**
   *  Represents an object that is both an observable sequence as well as an observer.
   *  Each notification is broadcasted to all subscribed observers.
   */
  var Subject = Rx.Subject = (function (__super__) {
    inherits(Subject, __super__);
    function Subject() {
      __super__.call(this);
      this.isDisposed = false;
      this.isStopped = false;
      this.observers = [];
      this.hasError = false;
    }

    addProperties(Subject.prototype, Observer.prototype, {
      _subscribe: function (o) {
        checkDisposed(this);
        if (!this.isStopped) {
          this.observers.push(o);
          return new InnerSubscription(this, o);
        }
        if (this.hasError) {
          o.onError(this.error);
          return disposableEmpty;
        }
        o.onCompleted();
        return disposableEmpty;
      },
      /**
       * Indicates whether the subject has observers subscribed to it.
       * @returns {Boolean} Indicates whether the subject has observers subscribed to it.
       */
      hasObservers: function () { checkDisposed(this); return this.observers.length > 0; },
      /**
       * Notifies all subscribed observers about the end of the sequence.
       */
      onCompleted: function () {
        checkDisposed(this);
        if (!this.isStopped) {
          this.isStopped = true;
          for (var i = 0, os = cloneArray(this.observers), len = os.length; i < len; i++) {
            os[i].onCompleted();
          }

          this.observers.length = 0;
        }
      },
      /**
       * Notifies all subscribed observers about the exception.
       * @param {Mixed} error The exception to send to all observers.
       */
      onError: function (error) {
        checkDisposed(this);
        if (!this.isStopped) {
          this.isStopped = true;
          this.error = error;
          this.hasError = true;
          for (var i = 0, os = cloneArray(this.observers), len = os.length; i < len; i++) {
            os[i].onError(error);
          }

          this.observers.length = 0;
        }
      },
      /**
       * Notifies all subscribed observers about the arrival of the specified element in the sequence.
       * @param {Mixed} value The value to send to all observers.
       */
      onNext: function (value) {
        checkDisposed(this);
        if (!this.isStopped) {
          for (var i = 0, os = cloneArray(this.observers), len = os.length; i < len; i++) {
            os[i].onNext(value);
          }
        }
      },
      /**
       * Unsubscribe all observers and release resources.
       */
      dispose: function () {
        this.isDisposed = true;
        this.observers = null;
      }
    });

    /**
     * Creates a subject from the specified observer and observable.
     * @param {Observer} observer The observer used to send messages to the subject.
     * @param {Observable} observable The observable used to subscribe to messages sent from the subject.
     * @returns {Subject} Subject implemented using the given observer and observable.
     */
    Subject.create = function (observer, observable) {
      return new AnonymousSubject(observer, observable);
    };

    return Subject;
  }(Observable));

  /**
   *  Represents the result of an asynchronous operation.
   *  The last value before the OnCompleted notification, or the error received through OnError, is sent to all subscribed observers.
   */
  var AsyncSubject = Rx.AsyncSubject = (function (__super__) {
    inherits(AsyncSubject, __super__);

    /**
     * Creates a subject that can only receive one value and that value is cached for all future observations.
     * @constructor
     */
    function AsyncSubject() {
      __super__.call(this);
      this.isDisposed = false;
      this.isStopped = false;
      this.hasValue = false;
      this.observers = [];
      this.hasError = false;
    }

    addProperties(AsyncSubject.prototype, Observer.prototype, {
      _subscribe: function (o) {
        checkDisposed(this);

        if (!this.isStopped) {
          this.observers.push(o);
          return new InnerSubscription(this, o);
        }

        if (this.hasError) {
          o.onError(this.error);
        } else if (this.hasValue) {
          o.onNext(this.value);
          o.onCompleted();
        } else {
          o.onCompleted();
        }

        return disposableEmpty;
      },
      /**
       * Indicates whether the subject has observers subscribed to it.
       * @returns {Boolean} Indicates whether the subject has observers subscribed to it.
       */
      hasObservers: function () { checkDisposed(this); return this.observers.length > 0; },
      /**
       * Notifies all subscribed observers about the end of the sequence, also causing the last received value to be sent out (if any).
       */
      onCompleted: function () {
        var i, len;
        checkDisposed(this);
        if (!this.isStopped) {
          this.isStopped = true;
          var os = cloneArray(this.observers), len = os.length;

          if (this.hasValue) {
            for (i = 0; i < len; i++) {
              var o = os[i];
              o.onNext(this.value);
              o.onCompleted();
            }
          } else {
            for (i = 0; i < len; i++) {
              os[i].onCompleted();
            }
          }

          this.observers.length = 0;
        }
      },
      /**
       * Notifies all subscribed observers about the error.
       * @param {Mixed} error The Error to send to all observers.
       */
      onError: function (error) {
        checkDisposed(this);
        if (!this.isStopped) {
          this.isStopped = true;
          this.hasError = true;
          this.error = error;

          for (var i = 0, os = cloneArray(this.observers), len = os.length; i < len; i++) {
            os[i].onError(error);
          }

          this.observers.length = 0;
        }
      },
      /**
       * Sends a value to the subject. The last value received before successful termination will be sent to all subscribed and future observers.
       * @param {Mixed} value The value to store in the subject.
       */
      onNext: function (value) {
        checkDisposed(this);
        if (this.isStopped) { return; }
        this.value = value;
        this.hasValue = true;
      },
      /**
       * Unsubscribe all observers and release resources.
       */
      dispose: function () {
        this.isDisposed = true;
        this.observers = null;
        this.error = null;
        this.value = null;
      }
    });

    return AsyncSubject;
  }(Observable));

  var AnonymousSubject = Rx.AnonymousSubject = (function (__super__) {
    inherits(AnonymousSubject, __super__);
    function AnonymousSubject(observer, observable) {
      this.observer = observer;
      this.observable = observable;
      __super__.call(this);
    }

    addProperties(AnonymousSubject.prototype, Observer.prototype, {
      _subscribe: function (o) {
        return this.observable.subscribe(o);
      },
      onCompleted: function () {
        this.observer.onCompleted();
      },
      onError: function (error) {
        this.observer.onError(error);
      },
      onNext: function (value) {
        this.observer.onNext(value);
      }
    });

    return AnonymousSubject;
  }(Observable));

  /**
   *  Represents a value that changes over time.
   *  Observers can subscribe to the subject to receive the last (or initial) value and all subsequent notifications.
   */
  var BehaviorSubject = Rx.BehaviorSubject = (function (__super__) {
    inherits(BehaviorSubject, __super__);
    function BehaviorSubject(value) {
      __super__.call(this);
      this.value = value;
      this.observers = [];
      this.isDisposed = false;
      this.isStopped = false;
      this.hasError = false;
    }

    addProperties(BehaviorSubject.prototype, Observer.prototype, {
      _subscribe: function (o) {
        checkDisposed(this);
        if (!this.isStopped) {
          this.observers.push(o);
          o.onNext(this.value);
          return new InnerSubscription(this, o);
        }
        if (this.hasError) {
          o.onError(this.error);
        } else {
          o.onCompleted();
        }
        return disposableEmpty;
      },
      /**
       * Gets the current value or throws an exception.
       * Value is frozen after onCompleted is called.
       * After onError is called always throws the specified exception.
       * An exception is always thrown after dispose is called.
       * @returns {Mixed} The initial value passed to the constructor until onNext is called; after which, the last value passed to onNext.
       */
      getValue: function () {
        checkDisposed(this);
        if (this.hasError) { thrower(this.error); }
        return this.value;
      },
      /**
       * Indicates whether the subject has observers subscribed to it.
       * @returns {Boolean} Indicates whether the subject has observers subscribed to it.
       */
      hasObservers: function () { checkDisposed(this); return this.observers.length > 0; },
      /**
       * Notifies all subscribed observers about the end of the sequence.
       */
      onCompleted: function () {
        checkDisposed(this);
        if (this.isStopped) { return; }
        this.isStopped = true;
        for (var i = 0, os = cloneArray(this.observers), len = os.length; i < len; i++) {
          os[i].onCompleted();
        }

        this.observers.length = 0;
      },
      /**
       * Notifies all subscribed observers about the exception.
       * @param {Mixed} error The exception to send to all observers.
       */
      onError: function (error) {
        checkDisposed(this);
        if (this.isStopped) { return; }
        this.isStopped = true;
        this.hasError = true;
        this.error = error;

        for (var i = 0, os = cloneArray(this.observers), len = os.length; i < len; i++) {
          os[i].onError(error);
        }

        this.observers.length = 0;
      },
      /**
       * Notifies all subscribed observers about the arrival of the specified element in the sequence.
       * @param {Mixed} value The value to send to all observers.
       */
      onNext: function (value) {
        checkDisposed(this);
        if (this.isStopped) { return; }
        this.value = value;
        for (var i = 0, os = cloneArray(this.observers), len = os.length; i < len; i++) {
          os[i].onNext(value);
        }
      },
      /**
       * Unsubscribe all observers and release resources.
       */
      dispose: function () {
        this.isDisposed = true;
        this.observers = null;
        this.value = null;
        this.error = null;
      }
    });

    return BehaviorSubject;
  }(Observable));

  /**
   * Represents an object that is both an observable sequence as well as an observer.
   * Each notification is broadcasted to all subscribed and future observers, subject to buffer trimming policies.
   */
  var ReplaySubject = Rx.ReplaySubject = (function (__super__) {

    var maxSafeInteger = Math.pow(2, 53) - 1;

    function createRemovableDisposable(subject, observer) {
      return disposableCreate(function () {
        observer.dispose();
        !subject.isDisposed && subject.observers.splice(subject.observers.indexOf(observer), 1);
      });
    }

    inherits(ReplaySubject, __super__);

    /**
     *  Initializes a new instance of the ReplaySubject class with the specified buffer size, window size and scheduler.
     *  @param {Number} [bufferSize] Maximum element count of the replay buffer.
     *  @param {Number} [windowSize] Maximum time length of the replay buffer.
     *  @param {Scheduler} [scheduler] Scheduler the observers are invoked on.
     */
    function ReplaySubject(bufferSize, windowSize, scheduler) {
      this.bufferSize = bufferSize == null ? maxSafeInteger : bufferSize;
      this.windowSize = windowSize == null ? maxSafeInteger : windowSize;
      this.scheduler = scheduler || currentThreadScheduler;
      this.q = [];
      this.observers = [];
      this.isStopped = false;
      this.isDisposed = false;
      this.hasError = false;
      this.error = null;
      __super__.call(this);
    }

    addProperties(ReplaySubject.prototype, Observer.prototype, {
      _subscribe: function (o) {
        checkDisposed(this);
        var so = new ScheduledObserver(this.scheduler, o), subscription = createRemovableDisposable(this, so);

        this._trim(this.scheduler.now());
        this.observers.push(so);

        for (var i = 0, len = this.q.length; i < len; i++) {
          so.onNext(this.q[i].value);
        }

        if (this.hasError) {
          so.onError(this.error);
        } else if (this.isStopped) {
          so.onCompleted();
        }

        so.ensureActive();
        return subscription;
      },
      /**
       * Indicates whether the subject has observers subscribed to it.
       * @returns {Boolean} Indicates whether the subject has observers subscribed to it.
       */
      hasObservers: function () { checkDisposed(this); return this.observers.length > 0; },
      _trim: function (now) {
        while (this.q.length > this.bufferSize) {
          this.q.shift();
        }
        while (this.q.length > 0 && (now - this.q[0].interval) > this.windowSize) {
          this.q.shift();
        }
      },
      /**
       * Notifies all subscribed observers about the arrival of the specified element in the sequence.
       * @param {Mixed} value The value to send to all observers.
       */
      onNext: function (value) {
        checkDisposed(this);
        if (this.isStopped) { return; }
        var now = this.scheduler.now();
        this.q.push({ interval: now, value: value });
        this._trim(now);

        for (var i = 0, os = cloneArray(this.observers), len = os.length; i < len; i++) {
          var observer = os[i];
          observer.onNext(value);
          observer.ensureActive();
        }
      },
      /**
       * Notifies all subscribed observers about the exception.
       * @param {Mixed} error The exception to send to all observers.
       */
      onError: function (error) {
        checkDisposed(this);
        if (this.isStopped) { return; }
        this.isStopped = true;
        this.error = error;
        this.hasError = true;
        var now = this.scheduler.now();
        this._trim(now);
        for (var i = 0, os = cloneArray(this.observers), len = os.length; i < len; i++) {
          var observer = os[i];
          observer.onError(error);
          observer.ensureActive();
        }
        this.observers.length = 0;
      },
      /**
       * Notifies all subscribed observers about the end of the sequence.
       */
      onCompleted: function () {
        checkDisposed(this);
        if (this.isStopped) { return; }
        this.isStopped = true;
        var now = this.scheduler.now();
        this._trim(now);
        for (var i = 0, os = cloneArray(this.observers), len = os.length; i < len; i++) {
          var observer = os[i];
          observer.onCompleted();
          observer.ensureActive();
        }
        this.observers.length = 0;
      },
      /**
       * Unsubscribe all observers and release resources.
       */
      dispose: function () {
        this.isDisposed = true;
        this.observers = null;
      }
    });

    return ReplaySubject;
  }(Observable));

  /**
  * Used to pause and resume streams.
  */
  Rx.Pauser = (function (__super__) {
    inherits(Pauser, __super__);
    function Pauser() {
      __super__.call(this);
    }

    /**
     * Pauses the underlying sequence.
     */
    Pauser.prototype.pause = function () { this.onNext(false); };

    /**
    * Resumes the underlying sequence.
    */
    Pauser.prototype.resume = function () { this.onNext(true); };

    return Pauser;
  }(Subject));

  if (true) {
    root.Rx = Rx;

    !(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
      return Rx;
    }.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if (freeExports && freeModule) {
    // in Node.js or RingoJS
    if (moduleExports) {
      (freeModule.exports = Rx).Rx = Rx;
    } else {
      freeExports.Rx = Rx;
    }
  } else {
    // in a browser or Rhino
    root.Rx = Rx;
  }

  // All code before this point will be filtered from stack traces.
  var rEndingLine = captureLine();

}.call(this));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(11)(module), __webpack_require__(10), __webpack_require__(1)))

/***/ }),
/* 1 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = {
	"name": "tesseract.js",
	"version": "1.0.10",
	"description": "Pure Javascript Multilingual OCR",
	"main": "src/index.js",
	"scripts": {
		"test": "echo \"Error: no test specified\" & exit 1",
		"start": "watchify src/index.js  -t [ envify --NODE_ENV development ] -t [ babelify --presets [ es2015 ] ] -o dist/tesseract.dev.js --standalone Tesseract & watchify src/browser/worker.js  -t [ envify --NODE_ENV development ] -t [ babelify --presets [ es2015 ] ] -o dist/worker.dev.js & http-server -p 7355",
		"build": "browserify src/index.js -t [ babelify --presets [ es2015 ] ] -o dist/tesseract.js --standalone Tesseract && browserify src/browser/worker.js -t [ babelify --presets [ es2015 ] ] -o dist/worker.js",
		"release": "npm run build && git commit -am 'new release' && git push && git tag `jq -r '.version' package.json` && git push origin --tags && npm publish"
	},
	"browser": {
		"./src/node/index.js": "./src/browser/index.js"
	},
	"author": "",
	"license": "Apache-2.0",
	"devDependencies": {
		"babel-preset-es2015": "^6.16.0",
		"babelify": "^7.3.0",
		"browserify": "^13.1.0",
		"envify": "^3.4.1",
		"http-server": "^0.9.0",
		"pako": "^1.0.3",
		"watchify": "^3.7.0"
	},
	"dependencies": {
		"file-type": "^3.8.0",
		"is-url": "^1.2.2",
		"jpeg-js": "^0.2.0",
		"level-js": "^2.2.4",
		"node-fetch": "^1.6.3",
		"object-assign": "^4.1.0",
		"png.js": "^0.2.1",
		"tesseract.js-core": "^1.0.2"
	},
	"repository": {
		"type": "git",
		"url": "https://github.com/naptha/tesseract.js.git"
	},
	"bugs": {
		"url": "https://github.com/naptha/tesseract.js/issues"
	},
	"homepage": "https://github.com/naptha/tesseract.js"
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {var defaultOptions = {
    // workerPath: 'https://cdn.rawgit.com/naptha/tesseract.js/0.2.0/dist/worker.js',
    corePath: 'https://cdn.rawgit.com/naptha/tesseract.js-core/0.1.0/index.js',    
    langPath: 'https://cdn.rawgit.com/naptha/tessdata/gh-pages/3.02/',
}

if (process.env.NODE_ENV === "development") {
    console.debug('Using Development Configuration')
    defaultOptions.workerPath = location.protocol + '//' + location.host + '/dist/worker.dev.js?nocache=' + Math.random().toString(36).slice(3)
}else{
    var version = __webpack_require__(2).version;
    defaultOptions.workerPath = 'https://cdn.rawgit.com/naptha/tesseract.js/' + version + '/dist/worker.js'
}

exports.defaultOptions = defaultOptions;


exports.spawnWorker = function spawnWorker(instance, workerOptions){
    if(window.Blob && window.URL){
        var blob = new Blob(['importScripts("' + workerOptions.workerPath + '");'])
        var worker = new Worker(window.URL.createObjectURL(blob));
    }else{
        var worker = new Worker(workerOptions.workerPath)
    }

    worker.onmessage = function(e){
        var packet = e.data;
        instance._recv(packet)
    }
    return worker
}

exports.terminateWorker = function(instance){
    instance.worker.terminate()
}

exports.sendPacket = function sendPacket(instance, packet){
    loadImage(packet.payload.image, function(img){
        packet.payload.image = img
        instance.worker.postMessage(packet) 
    })
}


function loadImage(image, cb){
    if(typeof image === 'string'){
        if(/^\#/.test(image)){
            // element css selector
            return loadImage(document.querySelector(image), cb)
        }else if(/(blob|data)\:/.test(image)){
            // data url
            var im = new Image
            im.src = image;
            im.onload = e => loadImage(im, cb);
            return
        }else{
            var xhr = new XMLHttpRequest();
            xhr.open('GET', image, true)
            xhr.responseType = "blob";
            xhr.onload = e => loadImage(xhr.response, cb);
            xhr.onerror = function(e){
                if(/^https?:\/\//.test(image) && !/^https:\/\/crossorigin.me/.test(image)){
                    console.debug('Attempting to load image with CORS proxy')
                    loadImage('https://crossorigin.me/' + image, cb)
                }
            }
            xhr.send(null)
            return
        }
    }else if(image instanceof File){
        // files
        var fr = new FileReader()
        fr.onload = e => loadImage(fr.result, cb);
        fr.readAsDataURL(image)
        return
    }else if(image instanceof Blob){
        return loadImage(URL.createObjectURL(image), cb)
    }else if(image.getContext){
        // canvas element
        return loadImage(image.getContext('2d'), cb)
    }else if(image.tagName == "IMG" || image.tagName == "VIDEO"){
        // image element or video element
        var c = document.createElement('canvas');
        c.width  = image.naturalWidth  || image.videoWidth;
        c.height = image.naturalHeight || image.videoHeight;
        var ctx = c.getContext('2d');
        ctx.drawImage(image, 0, 0);
        return loadImage(ctx, cb)
    }else if(image.getImageData){
        // canvas context
        var data = image.getImageData(0, 0, image.canvas.width, image.canvas.height);
        return loadImage(data, cb)
    }else{
        return cb(image)
    }
    throw new Error('Missing return in loadImage cascade')

}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/**
 * File and Directory Entries API 関連の汎用API
 *  - 基本APIがコールバック主体なので、Promiseベースとなるようwrap
 */

/**
 * FileSystemFileEntryオブジェクトからFileオブジェクトを生成
 */
const createFile = (() => {
  var _ref = _asyncToGenerator(function* (entry) {
    return new Promise(function (resolve, reject) {
      entry.file(function (file) {
        return resolve(file);
      }, function (err) {
        return reject(err);
      });
    });
  });

  return function createFile(_x) {
    return _ref.apply(this, arguments);
  };
})();
/* unused harmony export createFile */


/**
 *  FileSystemEntryを再帰的に走査し、Fileオブジェクトを取得
 */
const scanEntry = (() => {
  var _ref2 = _asyncToGenerator(function* (entry) {
    // ファイルの場合
    if (entry.isFile) {
      return createFile(entry);
    }

    // ディレクトリの場合: 再帰的な走査
    return new Promise(function (resolve, reject) {
      const reader = entry.createReader();
      reader.readEntries((() => {
        var _ref3 = _asyncToGenerator(function* (entries) {
          const results = yield Promise.all(entries.map(scanEntry));
          resolve(results.reduce(function (pv, cv) {
            cv = Array.isArray(cv) ? cv : [cv];
            return [...pv, ...cv];
          }, []));
        });

        return function (_x3) {
          return _ref3.apply(this, arguments);
        };
      })());
    }, function (err) {
      return reject(err);
    });
  });

  return function scanEntry(_x2) {
    return _ref2.apply(this, arguments);
  };
})();
/* harmony export (immutable) */ __webpack_exports__["a"] = scanEntry;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyY1xcZmlsZXV0aWxzLmpzIl0sIm5hbWVzIjpbImNyZWF0ZUZpbGUiLCJlbnRyeSIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiZmlsZSIsImVyciIsInNjYW5FbnRyeSIsImlzRmlsZSIsInJlYWRlciIsImNyZWF0ZVJlYWRlciIsInJlYWRFbnRyaWVzIiwiZW50cmllcyIsInJlc3VsdHMiLCJhbGwiLCJtYXAiLCJyZWR1Y2UiLCJwdiIsImN2IiwiQXJyYXkiLCJpc0FycmF5Il0sIm1hcHBpbmdzIjoiOztBQUFBOzs7OztBQUtBOzs7QUFHQSxPQUFPLE1BQU1BO0FBQUEsK0JBQWEsV0FBTUMsS0FBTjtBQUFBLFdBQ3hCLElBQUlDLE9BQUosQ0FBWSxVQUFDQyxPQUFELEVBQVVDLE1BQVYsRUFBcUI7QUFDL0JILFlBQU1JLElBQU4sQ0FBVztBQUFBLGVBQVFGLFFBQVFFLElBQVIsQ0FBUjtBQUFBLE9BQVgsRUFBa0M7QUFBQSxlQUFPRCxPQUFPRSxHQUFQLENBQVA7QUFBQSxPQUFsQztBQUNELEtBRkQsQ0FEd0I7QUFBQSxHQUFiOztBQUFBO0FBQUE7QUFBQTtBQUFBLElBQU47O0FBS1A7OztBQUdBLE9BQU8sTUFBTUM7QUFBQSxnQ0FBWSxXQUFPTixLQUFQLEVBQWtDO0FBQ3pEO0FBQ0EsUUFBSUEsTUFBTU8sTUFBVixFQUFrQjtBQUNoQixhQUFPUixXQUFXQyxLQUFYLENBQVA7QUFDRDs7QUFFRDtBQUNBLFdBQU8sSUFBSUMsT0FBSixDQUFZLFVBQUNDLE9BQUQsRUFBVUMsTUFBVixFQUFxQjtBQUN0QyxZQUFNSyxTQUFTUixNQUFNUyxZQUFOLEVBQWY7QUFDQUQsYUFBT0UsV0FBUDtBQUFBLHNDQUFtQixXQUFNQyxPQUFOLEVBQWlCO0FBQ2xDLGdCQUFNQyxVQUFVLE1BQU1YLFFBQVFZLEdBQVIsQ0FBWUYsUUFBUUcsR0FBUixDQUFZUixTQUFaLENBQVosQ0FBdEI7QUFDQUosa0JBQVFVLFFBQVFHLE1BQVIsQ0FBZSxVQUFDQyxFQUFELEVBQUtDLEVBQUwsRUFBWTtBQUNqQ0EsaUJBQUtDLE1BQU1DLE9BQU4sQ0FBY0YsRUFBZCxJQUFvQkEsRUFBcEIsR0FBeUIsQ0FBQ0EsRUFBRCxDQUE5QjtBQUNBLG1CQUFPLENBQUMsR0FBR0QsRUFBSixFQUFRLEdBQUdDLEVBQVgsQ0FBUDtBQUNELFdBSE8sRUFHTCxFQUhLLENBQVI7QUFJRCxTQU5EOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBT0QsS0FUTSxFQVNKO0FBQUEsYUFBT2QsT0FBT0UsR0FBUCxDQUFQO0FBQUEsS0FUSSxDQUFQO0FBVUQsR0FqQlk7O0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFBTiIsImZpbGUiOiJmaWxldXRpbHMuanMiLCJzb3VyY2VSb290IjoiRDovR2l0L0dpdEh1Yi9vY3ItZGVtbyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogRmlsZSBhbmQgRGlyZWN0b3J5IEVudHJpZXMgQVBJIOmWoumAo+OBruaxjueUqEFQSVxuICogIC0g5Z+65pysQVBJ44GM44Kz44O844Or44OQ44OD44Kv5Li75L2T44Gq44Gu44Gn44CBUHJvbWlzZeODmeODvOOCueOBqOOBquOCi+OCiOOBhndyYXBcbiAqL1xuXG4vKipcbiAqIEZpbGVTeXN0ZW1GaWxlRW50cnnjgqrjg5bjgrjjgqfjgq/jg4jjgYvjgolGaWxl44Kq44OW44K444Kn44Kv44OI44KS55Sf5oiQXG4gKi9cbmV4cG9ydCBjb25zdCBjcmVhdGVGaWxlID0gYXN5bmMgZW50cnkgPT5cbiAgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGVudHJ5LmZpbGUoZmlsZSA9PiByZXNvbHZlKGZpbGUpLCBlcnIgPT4gcmVqZWN0KGVycikpXG4gIH0pXG5cbi8qKlxuICogIEZpbGVTeXN0ZW1FbnRyeeOCkuWGjeW4sOeahOOBq+i1sOafu+OBl+OAgUZpbGXjgqrjg5bjgrjjgqfjgq/jg4jjgpLlj5blvpdcbiAqL1xuZXhwb3J0IGNvbnN0IHNjYW5FbnRyeSA9IGFzeW5jIChlbnRyeTogRmlsZVN5c3RlbUVudHJ5KSA9PiB7XG4gIC8vIOODleOCoeOCpOODq+OBruWgtOWQiFxuICBpZiAoZW50cnkuaXNGaWxlKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUZpbGUoZW50cnkpXG4gIH1cblxuICAvLyDjg4fjgqPjg6zjgq/jg4jjg6rjga7loLTlkIg6IOWGjeW4sOeahOOBqui1sOafu1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGNvbnN0IHJlYWRlciA9IGVudHJ5LmNyZWF0ZVJlYWRlcigpXG4gICAgcmVhZGVyLnJlYWRFbnRyaWVzKGFzeW5jIGVudHJpZXMgPT4ge1xuICAgICAgY29uc3QgcmVzdWx0cyA9IGF3YWl0IFByb21pc2UuYWxsKGVudHJpZXMubWFwKHNjYW5FbnRyeSkpXG4gICAgICByZXNvbHZlKHJlc3VsdHMucmVkdWNlKChwdiwgY3YpID0+IHtcbiAgICAgICAgY3YgPSBBcnJheS5pc0FycmF5KGN2KSA/IGN2IDogW2N2XVxuICAgICAgICByZXR1cm4gWy4uLnB2LCAuLi5jdl1cbiAgICAgIH0sIFtdKSlcbiAgICB9KVxuICB9LCBlcnIgPT4gcmVqZWN0KGVycikpXG59XG4iXX0=

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tesseract_js__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tesseract_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_tesseract_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rx_lite__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rx_lite___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rx_lite__);
/* harmony export (immutable) */ __webpack_exports__["a"] = recognize;



function recognize(files, options) {
  const fileNum = files.length;
  let count = 0;
  const allProcesses = files.map(file => new Promise((resolve, reject) => {
    __WEBPACK_IMPORTED_MODULE_0_tesseract_js___default.a.recognize(file, options).then(result => {
      console.log(`${++count}/${fileNum}`);
      resolve(result.words.map(w => w.text));
    }).catch(err => {
      reject(err);
    });
  }));

  return Promise.all(allProcesses);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyY1xcb2NyLmpzIl0sIm5hbWVzIjpbIlRlc3NlcmFjdCIsIlJ4IiwicmVjb2duaXplIiwiZmlsZXMiLCJvcHRpb25zIiwiZmlsZU51bSIsImxlbmd0aCIsImNvdW50IiwiYWxsUHJvY2Vzc2VzIiwibWFwIiwiZmlsZSIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwidGhlbiIsInJlc3VsdCIsImNvbnNvbGUiLCJsb2ciLCJ3b3JkcyIsInciLCJ0ZXh0IiwiY2F0Y2giLCJlcnIiLCJhbGwiXSwibWFwcGluZ3MiOiJBQUFBLE9BQU9BLFNBQVAsTUFBc0IsY0FBdEI7QUFDQSxPQUFPQyxFQUFQLE1BQWUsU0FBZjs7QUFFQSxPQUFPLFNBQVNDLFNBQVQsQ0FBbUJDLEtBQW5CLEVBQTBCQyxPQUExQixFQUFtQztBQUN4QyxRQUFNQyxVQUFVRixNQUFNRyxNQUF0QjtBQUNBLE1BQUlDLFFBQVEsQ0FBWjtBQUNBLFFBQU1DLGVBQWVMLE1BQU1NLEdBQU4sQ0FBVUMsUUFDN0IsSUFBSUMsT0FBSixDQUFZLENBQUNDLE9BQUQsRUFBVUMsTUFBVixLQUFxQjtBQUMvQmIsY0FBVUUsU0FBVixDQUFvQlEsSUFBcEIsRUFBMEJOLE9BQTFCLEVBQ0dVLElBREgsQ0FDUUMsVUFBVTtBQUNkQyxjQUFRQyxHQUFSLENBQWEsR0FBRSxFQUFFVixLQUFNLElBQUdGLE9BQVEsRUFBbEM7QUFDQU8sY0FBUUcsT0FBT0csS0FBUCxDQUFhVCxHQUFiLENBQWlCVSxLQUFLQSxFQUFFQyxJQUF4QixDQUFSO0FBQ0QsS0FKSCxFQUtHQyxLQUxILENBS1NDLE9BQU87QUFDWlQsYUFBT1MsR0FBUDtBQUNELEtBUEg7QUFRRCxHQVRELENBRG1CLENBQXJCOztBQWFBLFNBQU9YLFFBQVFZLEdBQVIsQ0FBWWYsWUFBWixDQUFQO0FBQ0QiLCJmaWxlIjoib2NyLmpzIiwic291cmNlUm9vdCI6IkQ6L0dpdC9HaXRIdWIvb2NyLWRlbW8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVGVzc2VyYWN0IGZyb20gJ3Rlc3NlcmFjdC5qcydcbmltcG9ydCBSeCBmcm9tICdyeC1saXRlJ1xuXG5leHBvcnQgZnVuY3Rpb24gcmVjb2duaXplKGZpbGVzLCBvcHRpb25zKSB7XG4gIGNvbnN0IGZpbGVOdW0gPSBmaWxlcy5sZW5ndGhcbiAgbGV0IGNvdW50ID0gMFxuICBjb25zdCBhbGxQcm9jZXNzZXMgPSBmaWxlcy5tYXAoZmlsZSA9PlxuICAgIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIFRlc3NlcmFjdC5yZWNvZ25pemUoZmlsZSwgb3B0aW9ucylcbiAgICAgICAgLnRoZW4ocmVzdWx0ID0+IHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhgJHsrK2NvdW50fS8ke2ZpbGVOdW19YClcbiAgICAgICAgICByZXNvbHZlKHJlc3VsdC53b3Jkcy5tYXAodyA9PiB3LnRleHQpKVxuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgICByZWplY3QoZXJyKVxuICAgICAgICB9KVxuICAgIH0pLFxuICApXG5cbiAgcmV0dXJuIFByb21pc2UuYWxsKGFsbFByb2Nlc3Nlcylcbn1cbiJdfQ==

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/


/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};


/***/ }),
/* 7 */
/***/ (function(module, exports) {

// The result of dump.js is a big JSON tree
// which can be easily serialized (for instance
// to be sent from a webworker to the main app
// or through Node's IPC), but we want
// a (circular) DOM-like interface for walking
// through the data. 

module.exports = function circularize(page){
    page.paragraphs = []
    page.lines = []
    page.words = []
    page.symbols = []

    page.blocks.forEach(function(block){
        block.page = page;

        block.lines = []
        block.words = []
        block.symbols = []

        block.paragraphs.forEach(function(para){
            para.block = block;
            para.page = page;

            para.words = []
            para.symbols = []
            
            para.lines.forEach(function(line){
                line.paragraph = para;
                line.block = block;
                line.page = page;

                line.symbols = []

                line.words.forEach(function(word){
                    word.line = line;
                    word.paragraph = para;
                    word.block = block;
                    word.page = page;
                    word.symbols.forEach(function(sym){
                        sym.word = word;
                        sym.line = line;
                        sym.paragraph = para;
                        sym.block = block;
                        sym.page = page;
                        
                        sym.line.symbols.push(sym)
                        sym.paragraph.symbols.push(sym)
                        sym.block.symbols.push(sym)
                        sym.page.symbols.push(sym)
                    })
                    word.paragraph.words.push(word)
                    word.block.words.push(word)
                    word.page.words.push(word)
                })
                line.block.lines.push(line)
                line.page.lines.push(line)
            })
            para.page.paragraphs.push(para)
        })
    })
    return page
}

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

const adapter = __webpack_require__(3)

let jobCounter = 0;

module.exports = class TesseractJob {
    constructor(instance){
        this.id = 'Job-' + (++jobCounter) + '-' + Math.random().toString(16).slice(3, 8)

        this._instance = instance;
        this._resolve = []
        this._reject = []
        this._progress = []
        this._finally = []
    }

    then(resolve, reject){
        if(this._resolve.push){
            this._resolve.push(resolve) 
        }else{
            resolve(this._resolve)
        }

        if(reject) this.catch(reject);
        return this;
    }
    catch(reject){
        if(this._reject.push){
            this._reject.push(reject) 
        }else{
            reject(this._reject)
        }
        return this;
    }
    progress(fn){
        this._progress.push(fn)
        return this;
    }
    finally(fn) {
        this._finally.push(fn)
        return this;  
    }
    _send(action, payload){
        adapter.sendPacket(this._instance, {
            jobId: this.id,
            action: action,
            payload: payload
        })
    }

    _handle(packet){
        var data = packet.data;
        let runFinallyCbs = false;

        if(packet.status === 'resolve'){
            if(this._resolve.length === 0) console.log(data);
            this._resolve.forEach(fn => {
                var ret = fn(data);
                if(ret && typeof ret.then == 'function'){
                    console.warn('TesseractJob instances do not chain like ES6 Promises. To convert it into a real promise, use Promise.resolve.')
                }
            })
            this._resolve = data;
            this._instance._dequeue()
            runFinallyCbs = true;
        }else if(packet.status === 'reject'){
            if(this._reject.length === 0) console.error(data);
            this._reject.forEach(fn => fn(data))
            this._reject = data;
            this._instance._dequeue()
            runFinallyCbs = true;
        }else if(packet.status === 'progress'){
            this._progress.forEach(fn => fn(data))
        }else{
            console.warn('Message type unknown', packet.status)
        }

        if (runFinallyCbs) {
            this._finally.forEach(fn => fn(data));
        }
    }
}


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

const adapter = __webpack_require__(3)
const circularize = __webpack_require__(7)
const TesseractJob = __webpack_require__(8);
const objectAssign = __webpack_require__(6);
const version = __webpack_require__(2).version;

function create(workerOptions){
	workerOptions = workerOptions || {};
	var worker = new TesseractWorker(objectAssign({}, adapter.defaultOptions, workerOptions))
	worker.create = create;
	worker.version = version;
	return worker;
}

class TesseractWorker {
	constructor(workerOptions){
		this.worker = null;
		this.workerOptions = workerOptions;
		this._currentJob = null;
		this._queue = []
	}

	recognize(image, options){
		return this._delay(job => {
			if(typeof options === 'string'){
				options = { lang: options };
			}else{
				options = options || {}
				options.lang = options.lang || 'eng';	
			}
			
			job._send('recognize', { image: image, options: options, workerOptions: this.workerOptions })
		})
	}
	detect(image, options){
		options = options || {}
		return this._delay(job => {
			job._send('detect', { image: image, options: options, workerOptions: this.workerOptions })
		})
	}

	terminate(){ 
		if(this.worker) adapter.terminateWorker(this);
		this.worker = null;
	}

	_delay(fn){
		if(!this.worker) this.worker = adapter.spawnWorker(this, this.workerOptions);

		var job = new TesseractJob(this);
		this._queue.push(e => {
			this._queue.shift()
			this._currentJob = job;
			fn(job)
		})
		if(!this._currentJob) this._dequeue();
		return job
	}

	_dequeue(){
		this._currentJob = null;
		if(this._queue.length > 0){
			this._queue[0]()
		}
	}

	_recv(packet){

        if(packet.status === 'resolve' && packet.action === 'recognize'){
            packet.data = circularize(packet.data);
        }

		if(this._currentJob.id === packet.jobId){
			this._currentJob._handle(packet)
		}else{
			console.warn('Job ID ' + packet.jobId + ' not known.')
		}
	}
}

var DefaultTesseract = create()

module.exports = DefaultTesseract

/***/ }),
/* 10 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rx_lite__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rx_lite___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_rx_lite__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__fileutils__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ocr__ = __webpack_require__(5);
function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }





function blockEventPropagation(event) {
  event.stopPropagation();
  event.preventDefault();
}

function activateDropZone(zone, activate = false) {
  zone.classList.toggle('dropzone--active', activate);
}

const dropZone = document.getElementById('dropzone');
__WEBPACK_IMPORTED_MODULE_0_rx_lite___default.a.Observable.fromEvent(dropZone, 'dragover').subscribe(e => {
  blockEventPropagation(e);
  e.dataTransfer.dropEffect = 'copy';
});

// "dragleave"イベントが子要素で発火する問題の対応策
// 1. カウンター方式
// 2. pointer-events: none;方式 (子要素でイベントが不必要な場合)
const plus = __WEBPACK_IMPORTED_MODULE_0_rx_lite___default.a.Observable.fromEvent(dropZone, 'dragenter').map(1);
const minus = __WEBPACK_IMPORTED_MODULE_0_rx_lite___default.a.Observable.fromEvent(dropZone, 'dragleave').map(-1);
const drop = __WEBPACK_IMPORTED_MODULE_0_rx_lite___default.a.Observable.fromEvent(dropZone, 'drop');
const source = plus.merge(minus).merge(drop.map(null));
source.scan((acc, v) => v === null ? 0 : acc + v, 0).subscribe(count => {
  activateDropZone(dropZone, count !== 0);
});

const dropClick = __WEBPACK_IMPORTED_MODULE_0_rx_lite___default.a.Observable.fromEvent(dropZone, 'click');
dropClick.subscribe(e => {
  const hiddenId = e.target.getAttribute('data-link');
  const action = new Event('click');
  const hidden = document.getElementById(hiddenId);
  if (hidden) {
    hidden.dispatchEvent(action);
  }
});

const resultList = document.getElementById('result-list').querySelector('.list');
const hiddenFile = document.getElementById('hidden-file');
const fileChange = __WEBPACK_IMPORTED_MODULE_0_rx_lite___default.a.Observable.fromEvent(hiddenFile, 'change');
drop.merge(fileChange).subscribe((() => {
  var _ref = _asyncToGenerator(function* (e) {
    blockEventPropagation(e);
    activateDropZone(e.currentTarget, false);

    let allFiles;
    if (e.dataTransfer) {
      const items = Array.from(e.dataTransfer.items);
      const entries = items.map(function (i) {
        return i.webkitGetAsEntry();
      });
      allFiles = yield Promise.all(entries.map(__WEBPACK_IMPORTED_MODULE_1__fileutils__["a" /* scanEntry */]));
    } else {
      allFiles = Array.from(e.target.files);
    }

    const $processing = document.createElement('li');
    $processing.innerHTML = '<div class="load-indicator"><div class="load-indicator__slide"></div>';
    resultList.appendChild($processing);

    // 画像認識
    const words = yield __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__ocr__["a" /* recognize */])(allFiles, 'eng');

    const $link = document.createElement('a');
    $link.classList.add('button');
    $link.innerHTML = 'download';
    $link.addEventListener('click', function (ev) {
      __WEBPACK_IMPORTED_MODULE_0_rx_lite___default.a.Observable.from(words).flatMap(function (x) {
        return __WEBPACK_IMPORTED_MODULE_0_rx_lite___default.a.Observable.from(x);
      }).scan(function (acc, v) {
        return acc === '' ? v : `${acc}\r\n${v}`;
      }, '').takeLast(1).subscribe(function (txt) {
        const data = new Blob([txt], { type: 'text/plain' });
        const url = URL.createObjectURL(data);
        $link.href = url;
        $link.download = `ocr-${new Date().getTime()}.txt`;
      });
    });
    const $li = document.createElement('li');
    $li.appendChild($link);
    resultList.removeChild($processing);
    resultList.appendChild($li);
  });

  return function (_x) {
    return _ref.apply(this, arguments);
  };
})());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyY1xcbWFpbi5qcyJdLCJuYW1lcyI6WyJSeCIsInNjYW5FbnRyeSIsInJlY29nbml6ZSIsImJsb2NrRXZlbnRQcm9wYWdhdGlvbiIsImV2ZW50Iiwic3RvcFByb3BhZ2F0aW9uIiwicHJldmVudERlZmF1bHQiLCJhY3RpdmF0ZURyb3Bab25lIiwiem9uZSIsImFjdGl2YXRlIiwiY2xhc3NMaXN0IiwidG9nZ2xlIiwiZHJvcFpvbmUiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwiT2JzZXJ2YWJsZSIsImZyb21FdmVudCIsInN1YnNjcmliZSIsImUiLCJkYXRhVHJhbnNmZXIiLCJkcm9wRWZmZWN0IiwicGx1cyIsIm1hcCIsIm1pbnVzIiwiZHJvcCIsInNvdXJjZSIsIm1lcmdlIiwic2NhbiIsImFjYyIsInYiLCJjb3VudCIsImRyb3BDbGljayIsImhpZGRlbklkIiwidGFyZ2V0IiwiZ2V0QXR0cmlidXRlIiwiYWN0aW9uIiwiRXZlbnQiLCJoaWRkZW4iLCJkaXNwYXRjaEV2ZW50IiwicmVzdWx0TGlzdCIsInF1ZXJ5U2VsZWN0b3IiLCJoaWRkZW5GaWxlIiwiZmlsZUNoYW5nZSIsImN1cnJlbnRUYXJnZXQiLCJhbGxGaWxlcyIsIml0ZW1zIiwiQXJyYXkiLCJmcm9tIiwiZW50cmllcyIsImkiLCJ3ZWJraXRHZXRBc0VudHJ5IiwiUHJvbWlzZSIsImFsbCIsImZpbGVzIiwiJHByb2Nlc3NpbmciLCJjcmVhdGVFbGVtZW50IiwiaW5uZXJIVE1MIiwiYXBwZW5kQ2hpbGQiLCJ3b3JkcyIsIiRsaW5rIiwiYWRkIiwiYWRkRXZlbnRMaXN0ZW5lciIsImV2IiwiZmxhdE1hcCIsIngiLCJ0YWtlTGFzdCIsImRhdGEiLCJCbG9iIiwidHh0IiwidHlwZSIsInVybCIsIlVSTCIsImNyZWF0ZU9iamVjdFVSTCIsImhyZWYiLCJkb3dubG9hZCIsIkRhdGUiLCJnZXRUaW1lIiwiJGxpIiwicmVtb3ZlQ2hpbGQiXSwibWFwcGluZ3MiOiI7O0FBQ0EsT0FBT0EsRUFB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YjtBQUNBLGNBQU1DLE1BQU1DLElBQUlDLGVBQUosQ0FBb0JOLElBQXBCLENBQVo7QUFDQVAsY0FBTWMsSUFBTixHQUFhSCxHQUFiO0FBQ0FYLGNBQU1lLFFBQU4sR0FBa0IsT0FBTSxJQUFJQyxJQUFKLEdBQVdDLE9BQVgsRUFBcUIsTUFBN0M7QUFDRCxPQVRIO0FBVUQsS0FYRDtBQVlBLFVBQU1DLE1BQU1oRSxTQUFTMEMsYUFBVCxDQUF1QixJQUF2QixDQUFaO0FBQ0FzQixRQUFJcEIsV0FBSixDQUFnQkUsS0FBaEI7QUFDQXBCLGVBQVd1QyxXQUFYLENBQXVCeEIsV0FBdkI7QUFDQWYsZUFBV2tCLFdBQVgsQ0FBdUJvQixHQUF2QjtBQUNELEdBdkNEOztBQUFBO0FBQUE7QUFBQTtBQUFBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VSb290IjoiRDovR2l0L0dpdEh1Yi9vY3ItZGVtbyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5pbXBvcnQgUnggZnJvbSAncngtbGl0ZSdcbmltcG9ydCB7IHNjYW5FbnRyeSB9IGZyb20gJy4vZmlsZXV0aWxzJ1xuaW1wb3J0IHsgcmVjb2duaXplIH0gZnJvbSAnLi9vY3InXG5cbmZ1bmN0aW9uIGJsb2NrRXZlbnRQcm9wYWdhdGlvbihldmVudCkge1xuICBldmVudC5zdG9wUHJvcGFnYXRpb24oKVxuICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG59XG5cbmZ1bmN0aW9uIGFjdGl2YXRlRHJvcFpvbmUoem9uZTogSFRNTEVsZW1lbnQsIGFjdGl2YXRlID0gZmFsc2UpIHtcbiAgem9uZS5jbGFzc0xpc3QudG9nZ2xlKCdkcm9wem9uZS0tYWN0aXZlJywgYWN0aXZhdGUpXG59XG5cbmNvbnN0IGRyb3Bab25lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Ryb3B6b25lJylcblJ4Lk9ic2VydmFibGUuZnJvbUV2ZW50KGRyb3Bab25lLCAnZHJhZ292ZXInKVxuICAuc3Vic2NyaWJlKGUgPT4ge1xuICAgIGJsb2NrRXZlbnRQcm9wYWdhdGlvbihlKVxuICAgIGUuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSAnY29weSdcbiAgfSlcblxuLy8gXCJkcmFnbGVhdmVcIuOCpOODmeODs+ODiOOBjOWtkOimgee0oOOBp+eZuueBq+OBmeOCi+WVj+mhjOOBruWvvuW/nOetllxuLy8gMS4g44Kr44Km44Oz44K/44O85pa55byPXG4vLyAyLiBwb2ludGVyLWV2ZW50czogbm9uZTvmlrnlvI8gKOWtkOimgee0oOOBp+OCpOODmeODs+ODiOOBjOS4jeW/heimgeOBquWgtOWQiClcbmNvbnN0IHBsdXMgPSBSeC5PYnNlcnZhYmxlLmZyb21FdmVudChkcm9wWm9uZSwgJ2RyYWdlbnRlcicpLm1hcCgxKVxuY29uc3QgbWludXMgPSBSeC5PYnNlcnZhYmxlLmZyb21FdmVudChkcm9wWm9uZSwgJ2RyYWdsZWF2ZScpLm1hcCgtMSlcbmNvbnN0IGRyb3AgPSBSeC5PYnNlcnZhYmxlLmZyb21FdmVudChkcm9wWm9uZSwgJ2Ryb3AnKVxuY29uc3Qgc291cmNlID0gcGx1cy5tZXJnZShtaW51cykubWVyZ2UoZHJvcC5tYXAobnVsbCkpXG5zb3VyY2Uuc2NhbigoYWNjLCB2KSA9PiAodiA9PT0gbnVsbCA/IDAgOiBhY2MgKyB2KSwgMClcbiAgLnN1YnNjcmliZShjb3VudCA9PiB7XG4gICAgYWN0aXZhdGVEcm9wWm9uZShkcm9wWm9uZSwgY291bnQgIT09IDApXG4gIH0pXG5cbmNvbnN0IGRyb3BDbGljayA9IFJ4Lk9ic2VydmFibGUuZnJvbUV2ZW50KGRyb3Bab25lLCAnY2xpY2snKVxuZHJvcENsaWNrXG4gIC5zdWJzY3JpYmUoZSA9PiB7XG4gICAgY29uc3QgaGlkZGVuSWQgPSBlLnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtbGluaycpXG4gICAgY29uc3QgYWN0aW9uID0gbmV3IEV2ZW50KCdjbGljaycpXG4gICAgY29uc3QgaGlkZGVuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaGlkZGVuSWQpXG4gICAgaWYgKGhpZGRlbikge1xuICAgICAgaGlkZGVuLmRpc3BhdGNoRXZlbnQoYWN0aW9uKVxuICAgIH1cbiAgfSlcblxuY29uc3QgcmVzdWx0TGlzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXN1bHQtbGlzdCcpLnF1ZXJ5U2VsZWN0b3IoJy5saXN0JylcbmNvbnN0IGhpZGRlbkZpbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaGlkZGVuLWZpbGUnKVxuY29uc3QgZmlsZUNoYW5nZSA9IFJ4Lk9ic2VydmFibGUuZnJvbUV2ZW50KGhpZGRlbkZpbGUsICdjaGFuZ2UnKVxuZHJvcC5tZXJnZShmaWxlQ2hhbmdlKS5zdWJzY3JpYmUoYXN5bmMgZSA9PiB7XG4gIGJsb2NrRXZlbnRQcm9wYWdhdGlvbihlKVxuICBhY3RpdmF0ZURyb3Bab25lKGUuY3VycmVudFRhcmdldCwgZmFsc2UpXG5cbiAgbGV0IGFsbEZpbGVzXG4gIGlmIChlLmRhdGFUcmFuc2Zlcikge1xuICAgIGNvbnN0IGl0ZW1zID0gQXJyYXkuZnJvbShlLmRhdGFUcmFuc2Zlci5pdGVtcylcbiAgICBjb25zdCBlbnRyaWVzID0gaXRlbXMubWFwKGkgPT4gaS53ZWJraXRHZXRBc0VudHJ5KCkpXG4gICAgYWxsRmlsZXMgPSBhd2FpdCBQcm9taXNlLmFsbChlbnRyaWVzLm1hcChzY2FuRW50cnkpKVxuICB9IGVsc2Uge1xuICAgIGFsbEZpbGVzID0gQXJyYXkuZnJvbShlLnRhcmdldC5maWxlcylcbiAgfVxuXG4gIGNvbnN0ICRwcm9jZXNzaW5nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKVxuICAkcHJvY2Vzc2luZy5pbm5lckhUTUwgPSAnPGRpdiBjbGFzcz1cImxvYWQtaW5kaWNhdG9yXCI+PGRpdiBjbGFzcz1cImxvYWQtaW5kaWNhdG9yX19zbGlkZVwiPjwvZGl2PidcbiAgcmVzdWx0TGlzdC5hcHBlbmRDaGlsZCgkcHJvY2Vzc2luZylcblxuICAvLyDnlLvlg4/oqo3orZhcbiAgY29uc3Qgd29yZHMgPSBhd2FpdCByZWNvZ25pemUoYWxsRmlsZXMsICdlbmcnKVxuXG4gIGNvbnN0ICRsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpXG4gICRsaW5rLmNsYXNzTGlzdC5hZGQoJ2J1dHRvbicpXG4gICRsaW5rLmlubmVySFRNTCA9ICdkb3dubG9hZCdcbiAgJGxpbmsuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXYpID0+IHtcbiAgICBSeC5PYnNlcnZhYmxlLmZyb20od29yZHMpXG4gICAgICAuZmxhdE1hcCh4ID0+IFJ4Lk9ic2VydmFibGUuZnJvbSh4KSlcbiAgICAgIC5zY2FuKChhY2MsIHYpID0+IChhY2MgPT09ICcnID8gdiA6IGAke2FjY31cXHJcXG4ke3Z9YCksICcnKVxuICAgICAgLnRha2VMYXN0KDEpXG4gICAgICAuc3Vic2NyaWJlKHR4dCA9PiB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSBuZXcgQmxvYihbdHh0XSwgeyB0eXBlOiAndGV4dC9wbGFpbicgfSlcbiAgICAgICAgY29uc3QgdXJsID0gVVJMLmNyZWF0ZU9iamVjdFVSTChkYXRhKVxuICAgICAgICAkbGluay5ocmVmID0gdXJsXG4gICAgICAgICRsaW5rLmRvd25sb2FkID0gYG9jci0ke25ldyBEYXRlKCkuZ2V0VGltZSgpfS50eHRgXG4gICAgICB9KVxuICB9KVxuICBjb25zdCAkbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpXG4gICRsaS5hcHBlbmRDaGlsZCgkbGluaylcbiAgcmVzdWx0TGlzdC5yZW1vdmVDaGlsZCgkcHJvY2Vzc2luZylcbiAgcmVzdWx0TGlzdC5hcHBlbmRDaGlsZCgkbGkpXG59KVxuIl19

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNDJlZmM3NWIwMzExZjZhNDkxNjgiLCJ3ZWJwYWNrOi8vLy4vfi9yeC1saXRlL3J4LmxpdGUuanMiLCJ3ZWJwYWNrOi8vLy4vfi9wcm9jZXNzL2Jyb3dzZXIuanMiLCJ3ZWJwYWNrOi8vLy4vfi90ZXNzZXJhY3QuanMvcGFja2FnZS5qc29uIiwid2VicGFjazovLy8uL34vdGVzc2VyYWN0LmpzL3NyYy9icm93c2VyL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9maWxldXRpbHMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL29jci5qcyIsIndlYnBhY2s6Ly8vLi9+L29iamVjdC1hc3NpZ24vaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vfi90ZXNzZXJhY3QuanMvc3JjL2NvbW1vbi9jaXJjdWxhcml6ZS5qcyIsIndlYnBhY2s6Ly8vLi9+L3Rlc3NlcmFjdC5qcy9zcmMvY29tbW9uL2pvYi5qcyIsIndlYnBhY2s6Ly8vLi9+L3Rlc3NlcmFjdC5qcy9zcmMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9idWlsZGluL2dsb2JhbC5qcyIsIndlYnBhY2s6Ly8vKHdlYnBhY2spL2J1aWxkaW4vbW9kdWxlLmpzIiwid2VicGFjazovLy8uL3NyYy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxtREFBMkMsY0FBYzs7QUFFekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7OytEQ2hFQTs7QUFFQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsY0FBYztBQUNkOztBQUVBO0FBQ0EsNENBQTRDLEVBQUU7QUFDOUMsbURBQW1ELFVBQVUsRUFBRTtBQUMvRDtBQUNBLG9FQUFvRSxzQkFBc0IsRUFBRTtBQUM1RiwwRUFBMEUscUNBQXFDLEVBQUU7QUFDakgsMkVBQTJFLHFCQUFxQixFQUFFO0FBQ2xHLDZEQUE2RCxXQUFXLEVBQUU7QUFDMUUscURBQXFELGlGQUFpRixFQUFFO0FBQ3hJOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQSxvQkFBb0IsU0FBUyxPQUFPLGVBQWU7QUFDbkQ7QUFDQTs7QUFFQSxrQkFBa0I7O0FBRWxCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwwQkFBMEIsOENBQThDO0FBQ3hFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0Esd0RBQXdELG1CQUFtQixFQUFFO0FBQzdFOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhCQUE4QixLQUFLO0FBQ25DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVDQUF1QyxTQUFTO0FBQ2hEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxxQkFBcUIsUUFBUTs7QUFFN0I7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxtQ0FBbUMsUUFBUTs7QUFFM0M7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLDJDQUEyQzs7QUFFOUQ7QUFDQTtBQUNBLG1CQUFtQiwyQ0FBMkM7O0FBRTlEO0FBQ0E7QUFDQSxtQkFBbUIsMkNBQTJDO0FBQzlEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSw0Q0FBNEM7O0FBRTVDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSx5Q0FBeUMsYUFBYTtBQUN0RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVB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Q0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBLGNBQWMsV0FBVztBQUN6QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0EsYUFBYSxxQkFBcUI7QUFDbEMsZUFBZSxXQUFXO0FBQzFCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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cEIsYUFBYSxVQUFVO0FBQ3ZCLGVBQWUsV0FBVztBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDLDhCQUE4Qjs7QUFFcEU7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsMEJBQTBCLGNBQWMsRUFBRTtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esc0JBQXNCLHFDQUFxQztBQUMzRDs7QUFF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UUFBUTtBQUNyQztBQUNBO0FBQ0E7QUFDQSx5RUFBeUUsU0FBUztBQUNsRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSwwQ0FBMEMsb0JBQW9COztBQUU5RDtBQUNBO0FBQ0E7QUFDQSwyQ0FBMkMsbUJBQW1COztBQUU5RDtBQUNBLEdBQUc7O0FBRUg7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSztBQUFBO0FBQ0wsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLENBQUM7Ozs7Ozs7O0FDNzRORDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLHNCQUFzQjtBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsMkJBQTJCO0FBQzNCO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QixVQUFVOzs7Ozs7O0FDbkx0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBLEU7Ozs7OztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7O0FBRUE7OztBQUdBO0FBQ0E7QUFDQSxnRkFBZ0Y7QUFDaEY7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOzs7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Q0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELDJDQUEyQyxtb1MiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGlkZW50aXR5IGZ1bmN0aW9uIGZvciBjYWxsaW5nIGhhcm1vbnkgaW1wb3J0cyB3aXRoIHRoZSBjb3JyZWN0IGNvbnRleHRcbiBcdF9fd2VicGFja19yZXF1aXJlX18uaSA9IGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiB2YWx1ZTsgfTtcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMTIpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDQyZWZjNzViMDMxMWY2YTQ5MTY4IiwiLy8gQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQsIEFsbCByaWdodHMgcmVzZXJ2ZWQuIFNlZSBMaWNlbnNlLnR4dCBpbiB0aGUgcHJvamVjdCByb290IGZvciBsaWNlbnNlIGluZm9ybWF0aW9uLlxuXG47KGZ1bmN0aW9uICh1bmRlZmluZWQpIHtcblxuICB2YXIgb2JqZWN0VHlwZXMgPSB7XG4gICAgJ2Z1bmN0aW9uJzogdHJ1ZSxcbiAgICAnb2JqZWN0JzogdHJ1ZVxuICB9O1xuXG4gIGZ1bmN0aW9uIGNoZWNrR2xvYmFsKHZhbHVlKSB7XG4gICAgcmV0dXJuICh2YWx1ZSAmJiB2YWx1ZS5PYmplY3QgPT09IE9iamVjdCkgPyB2YWx1ZSA6IG51bGw7XG4gIH1cblxuICB2YXIgZnJlZUV4cG9ydHMgPSAob2JqZWN0VHlwZXNbdHlwZW9mIGV4cG9ydHNdICYmIGV4cG9ydHMgJiYgIWV4cG9ydHMubm9kZVR5cGUpID8gZXhwb3J0cyA6IG51bGw7XG4gIHZhciBmcmVlTW9kdWxlID0gKG9iamVjdFR5cGVzW3R5cGVvZiBtb2R1bGVdICYmIG1vZHVsZSAmJiAhbW9kdWxlLm5vZGVUeXBlKSA/IG1vZHVsZSA6IG51bGw7XG4gIHZhciBmcmVlR2xvYmFsID0gY2hlY2tHbG9iYWwoZnJlZUV4cG9ydHMgJiYgZnJlZU1vZHVsZSAmJiB0eXBlb2YgZ2xvYmFsID09PSAnb2JqZWN0JyAmJiBnbG9iYWwpO1xuICB2YXIgZnJlZVNlbGYgPSBjaGVja0dsb2JhbChvYmplY3RUeXBlc1t0eXBlb2Ygc2VsZl0gJiYgc2VsZik7XG4gIHZhciBmcmVlV2luZG93ID0gY2hlY2tHbG9iYWwob2JqZWN0VHlwZXNbdHlwZW9mIHdpbmRvd10gJiYgd2luZG93KTtcbiAgdmFyIG1vZHVsZUV4cG9ydHMgPSAoZnJlZU1vZHVsZSAmJiBmcmVlTW9kdWxlLmV4cG9ydHMgPT09IGZyZWVFeHBvcnRzKSA/IGZyZWVFeHBvcnRzIDogbnVsbDtcbiAgdmFyIHRoaXNHbG9iYWwgPSBjaGVja0dsb2JhbChvYmplY3RUeXBlc1t0eXBlb2YgdGhpc10gJiYgdGhpcyk7XG4gIHZhciByb290ID0gZnJlZUdsb2JhbCB8fCAoKGZyZWVXaW5kb3cgIT09ICh0aGlzR2xvYmFsICYmIHRoaXNHbG9iYWwud2luZG93KSkgJiYgZnJlZVdpbmRvdykgfHwgZnJlZVNlbGYgfHwgdGhpc0dsb2JhbCB8fCBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXG4gIHZhciBSeCA9IHtcbiAgICBpbnRlcm5hbHM6IHt9LFxuICAgIGNvbmZpZzoge1xuICAgICAgUHJvbWlzZTogcm9vdC5Qcm9taXNlXG4gICAgfSxcbiAgICBoZWxwZXJzOiB7IH1cbiAgfTtcblxuICAvLyBEZWZhdWx0c1xuICB2YXIgbm9vcCA9IFJ4LmhlbHBlcnMubm9vcCA9IGZ1bmN0aW9uICgpIHsgfSxcbiAgICBpZGVudGl0eSA9IFJ4LmhlbHBlcnMuaWRlbnRpdHkgPSBmdW5jdGlvbiAoeCkgeyByZXR1cm4geDsgfSxcbiAgICBkZWZhdWx0Tm93ID0gUnguaGVscGVycy5kZWZhdWx0Tm93ID0gRGF0ZS5ub3csXG4gICAgZGVmYXVsdENvbXBhcmVyID0gUnguaGVscGVycy5kZWZhdWx0Q29tcGFyZXIgPSBmdW5jdGlvbiAoeCwgeSkgeyByZXR1cm4gaXNFcXVhbCh4LCB5KTsgfSxcbiAgICBkZWZhdWx0U3ViQ29tcGFyZXIgPSBSeC5oZWxwZXJzLmRlZmF1bHRTdWJDb21wYXJlciA9IGZ1bmN0aW9uICh4LCB5KSB7IHJldHVybiB4ID4geSA/IDEgOiAoeCA8IHkgPyAtMSA6IDApOyB9LFxuICAgIGRlZmF1bHRLZXlTZXJpYWxpemVyID0gUnguaGVscGVycy5kZWZhdWx0S2V5U2VyaWFsaXplciA9IGZ1bmN0aW9uICh4KSB7IHJldHVybiB4LnRvU3RyaW5nKCk7IH0sXG4gICAgZGVmYXVsdEVycm9yID0gUnguaGVscGVycy5kZWZhdWx0RXJyb3IgPSBmdW5jdGlvbiAoZXJyKSB7IHRocm93IGVycjsgfSxcbiAgICBpc1Byb21pc2UgPSBSeC5oZWxwZXJzLmlzUHJvbWlzZSA9IGZ1bmN0aW9uIChwKSB7IHJldHVybiAhIXAgJiYgdHlwZW9mIHAuc3Vic2NyaWJlICE9PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBwLnRoZW4gPT09ICdmdW5jdGlvbic7IH0sXG4gICAgaXNGdW5jdGlvbiA9IFJ4LmhlbHBlcnMuaXNGdW5jdGlvbiA9IChmdW5jdGlvbiAoKSB7XG5cbiAgICAgIHZhciBpc0ZuID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ2Z1bmN0aW9uJyB8fCBmYWxzZTtcbiAgICAgIH07XG5cbiAgICAgIC8vIGZhbGxiYWNrIGZvciBvbGRlciB2ZXJzaW9ucyBvZiBDaHJvbWUgYW5kIFNhZmFyaVxuICAgICAgaWYgKGlzRm4oL3gvKSkge1xuICAgICAgICBpc0ZuID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdmdW5jdGlvbicgJiYgdG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT0gJ1tvYmplY3QgRnVuY3Rpb25dJztcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGlzRm47XG4gICAgfSgpKTtcblxuICAgIGZ1bmN0aW9uIGNsb25lQXJyYXkoYXJyKSB7XG4gICAgICB2YXIgbGVuID0gYXJyLmxlbmd0aCwgYSA9IG5ldyBBcnJheShsZW4pO1xuICAgICAgZm9yKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7IGFbaV0gPSBhcnJbaV07IH1cbiAgICAgIHJldHVybiBhO1xuICAgIH1cblxuICB2YXIgZXJyb3JPYmogPSB7ZToge319O1xuICBcbiAgZnVuY3Rpb24gdHJ5Q2F0Y2hlckdlbih0cnlDYXRjaFRhcmdldCkge1xuICAgIHJldHVybiBmdW5jdGlvbiB0cnlDYXRjaGVyKCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIHRyeUNhdGNoVGFyZ2V0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGVycm9yT2JqLmUgPSBlO1xuICAgICAgICByZXR1cm4gZXJyb3JPYmo7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIHZhciB0cnlDYXRjaCA9IFJ4LmludGVybmFscy50cnlDYXRjaCA9IGZ1bmN0aW9uIHRyeUNhdGNoKGZuKSB7XG4gICAgaWYgKCFpc0Z1bmN0aW9uKGZuKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKCdmbiBtdXN0IGJlIGEgZnVuY3Rpb24nKTsgfVxuICAgIHJldHVybiB0cnlDYXRjaGVyR2VuKGZuKTtcbiAgfTtcblxuICBmdW5jdGlvbiB0aHJvd2VyKGUpIHtcbiAgICB0aHJvdyBlO1xuICB9XG5cbiAgUnguY29uZmlnLmxvbmdTdGFja1N1cHBvcnQgPSBmYWxzZTtcbiAgdmFyIGhhc1N0YWNrcyA9IGZhbHNlLCBzdGFja3MgPSB0cnlDYXRjaChmdW5jdGlvbiAoKSB7IHRocm93IG5ldyBFcnJvcigpOyB9KSgpO1xuICBoYXNTdGFja3MgPSAhIXN0YWNrcy5lICYmICEhc3RhY2tzLmUuc3RhY2s7XG5cbiAgLy8gQWxsIGNvZGUgYWZ0ZXIgdGhpcyBwb2ludCB3aWxsIGJlIGZpbHRlcmVkIGZyb20gc3RhY2sgdHJhY2VzIHJlcG9ydGVkIGJ5IFJ4SlNcbiAgdmFyIHJTdGFydGluZ0xpbmUgPSBjYXB0dXJlTGluZSgpLCByRmlsZU5hbWU7XG5cbiAgdmFyIFNUQUNLX0pVTVBfU0VQQVJBVE9SID0gJ0Zyb20gcHJldmlvdXMgZXZlbnQ6JztcblxuICBmdW5jdGlvbiBtYWtlU3RhY2tUcmFjZUxvbmcoZXJyb3IsIG9ic2VydmFibGUpIHtcbiAgICAvLyBJZiBwb3NzaWJsZSwgdHJhbnNmb3JtIHRoZSBlcnJvciBzdGFjayB0cmFjZSBieSByZW1vdmluZyBOb2RlIGFuZCBSeEpTXG4gICAgLy8gY3J1ZnQsIHRoZW4gY29uY2F0ZW5hdGluZyB3aXRoIHRoZSBzdGFjayB0cmFjZSBvZiBgb2JzZXJ2YWJsZWAuXG4gICAgaWYgKGhhc1N0YWNrcyAmJlxuICAgICAgICBvYnNlcnZhYmxlLnN0YWNrICYmXG4gICAgICAgIHR5cGVvZiBlcnJvciA9PT0gJ29iamVjdCcgJiZcbiAgICAgICAgZXJyb3IgIT09IG51bGwgJiZcbiAgICAgICAgZXJyb3Iuc3RhY2sgJiZcbiAgICAgICAgZXJyb3Iuc3RhY2suaW5kZXhPZihTVEFDS19KVU1QX1NFUEFSQVRPUikgPT09IC0xXG4gICAgKSB7XG4gICAgICB2YXIgc3RhY2tzID0gW107XG4gICAgICBmb3IgKHZhciBvID0gb2JzZXJ2YWJsZTsgISFvOyBvID0gby5zb3VyY2UpIHtcbiAgICAgICAgaWYgKG8uc3RhY2spIHtcbiAgICAgICAgICBzdGFja3MudW5zaGlmdChvLnN0YWNrKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgc3RhY2tzLnVuc2hpZnQoZXJyb3Iuc3RhY2spO1xuXG4gICAgICB2YXIgY29uY2F0ZWRTdGFja3MgPSBzdGFja3Muam9pbignXFxuJyArIFNUQUNLX0pVTVBfU0VQQVJBVE9SICsgJ1xcbicpO1xuICAgICAgZXJyb3Iuc3RhY2sgPSBmaWx0ZXJTdGFja1N0cmluZyhjb25jYXRlZFN0YWNrcyk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZmlsdGVyU3RhY2tTdHJpbmcoc3RhY2tTdHJpbmcpIHtcbiAgICB2YXIgbGluZXMgPSBzdGFja1N0cmluZy5zcGxpdCgnXFxuJyksIGRlc2lyZWRMaW5lcyA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBsaW5lcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgdmFyIGxpbmUgPSBsaW5lc1tpXTtcblxuICAgICAgaWYgKCFpc0ludGVybmFsRnJhbWUobGluZSkgJiYgIWlzTm9kZUZyYW1lKGxpbmUpICYmIGxpbmUpIHtcbiAgICAgICAgZGVzaXJlZExpbmVzLnB1c2gobGluZSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBkZXNpcmVkTGluZXMuam9pbignXFxuJyk7XG4gIH1cblxuICBmdW5jdGlvbiBpc0ludGVybmFsRnJhbWUoc3RhY2tMaW5lKSB7XG4gICAgdmFyIGZpbGVOYW1lQW5kTGluZU51bWJlciA9IGdldEZpbGVOYW1lQW5kTGluZU51bWJlcihzdGFja0xpbmUpO1xuICAgIGlmICghZmlsZU5hbWVBbmRMaW5lTnVtYmVyKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHZhciBmaWxlTmFtZSA9IGZpbGVOYW1lQW5kTGluZU51bWJlclswXSwgbGluZU51bWJlciA9IGZpbGVOYW1lQW5kTGluZU51bWJlclsxXTtcblxuICAgIHJldHVybiBmaWxlTmFtZSA9PT0gckZpbGVOYW1lICYmXG4gICAgICBsaW5lTnVtYmVyID49IHJTdGFydGluZ0xpbmUgJiZcbiAgICAgIGxpbmVOdW1iZXIgPD0gckVuZGluZ0xpbmU7XG4gIH1cblxuICBmdW5jdGlvbiBpc05vZGVGcmFtZShzdGFja0xpbmUpIHtcbiAgICByZXR1cm4gc3RhY2tMaW5lLmluZGV4T2YoJyhtb2R1bGUuanM6JykgIT09IC0xIHx8XG4gICAgICBzdGFja0xpbmUuaW5kZXhPZignKG5vZGUuanM6JykgIT09IC0xO1xuICB9XG5cbiAgZnVuY3Rpb24gY2FwdHVyZUxpbmUoKSB7XG4gICAgaWYgKCFoYXNTdGFja3MpIHsgcmV0dXJuOyB9XG5cbiAgICB0cnkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgdmFyIGxpbmVzID0gZS5zdGFjay5zcGxpdCgnXFxuJyk7XG4gICAgICB2YXIgZmlyc3RMaW5lID0gbGluZXNbMF0uaW5kZXhPZignQCcpID4gMCA/IGxpbmVzWzFdIDogbGluZXNbMl07XG4gICAgICB2YXIgZmlsZU5hbWVBbmRMaW5lTnVtYmVyID0gZ2V0RmlsZU5hbWVBbmRMaW5lTnVtYmVyKGZpcnN0TGluZSk7XG4gICAgICBpZiAoIWZpbGVOYW1lQW5kTGluZU51bWJlcikgeyByZXR1cm47IH1cblxuICAgICAgckZpbGVOYW1lID0gZmlsZU5hbWVBbmRMaW5lTnVtYmVyWzBdO1xuICAgICAgcmV0dXJuIGZpbGVOYW1lQW5kTGluZU51bWJlclsxXTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBnZXRGaWxlTmFtZUFuZExpbmVOdW1iZXIoc3RhY2tMaW5lKSB7XG4gICAgLy8gTmFtZWQgZnVuY3Rpb25zOiAnYXQgZnVuY3Rpb25OYW1lIChmaWxlbmFtZTpsaW5lTnVtYmVyOmNvbHVtbk51bWJlciknXG4gICAgdmFyIGF0dGVtcHQxID0gL2F0IC4rIFxcKCguKyk6KFxcZCspOig/OlxcZCspXFwpJC8uZXhlYyhzdGFja0xpbmUpO1xuICAgIGlmIChhdHRlbXB0MSkgeyByZXR1cm4gW2F0dGVtcHQxWzFdLCBOdW1iZXIoYXR0ZW1wdDFbMl0pXTsgfVxuXG4gICAgLy8gQW5vbnltb3VzIGZ1bmN0aW9uczogJ2F0IGZpbGVuYW1lOmxpbmVOdW1iZXI6Y29sdW1uTnVtYmVyJ1xuICAgIHZhciBhdHRlbXB0MiA9IC9hdCAoW14gXSspOihcXGQrKTooPzpcXGQrKSQvLmV4ZWMoc3RhY2tMaW5lKTtcbiAgICBpZiAoYXR0ZW1wdDIpIHsgcmV0dXJuIFthdHRlbXB0MlsxXSwgTnVtYmVyKGF0dGVtcHQyWzJdKV07IH1cblxuICAgIC8vIEZpcmVmb3ggc3R5bGU6ICdmdW5jdGlvbkBmaWxlbmFtZTpsaW5lTnVtYmVyIG9yIEBmaWxlbmFtZTpsaW5lTnVtYmVyJ1xuICAgIHZhciBhdHRlbXB0MyA9IC8uKkAoLispOihcXGQrKSQvLmV4ZWMoc3RhY2tMaW5lKTtcbiAgICBpZiAoYXR0ZW1wdDMpIHsgcmV0dXJuIFthdHRlbXB0M1sxXSwgTnVtYmVyKGF0dGVtcHQzWzJdKV07IH1cbiAgfVxuXG4gIHZhciBFbXB0eUVycm9yID0gUnguRW1wdHlFcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMubWVzc2FnZSA9ICdTZXF1ZW5jZSBjb250YWlucyBubyBlbGVtZW50cy4nO1xuICAgIEVycm9yLmNhbGwodGhpcyk7XG4gIH07XG4gIEVtcHR5RXJyb3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShFcnJvci5wcm90b3R5cGUpO1xuICBFbXB0eUVycm9yLnByb3RvdHlwZS5uYW1lID0gJ0VtcHR5RXJyb3InO1xuXG4gIHZhciBPYmplY3REaXNwb3NlZEVycm9yID0gUnguT2JqZWN0RGlzcG9zZWRFcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMubWVzc2FnZSA9ICdPYmplY3QgaGFzIGJlZW4gZGlzcG9zZWQnO1xuICAgIEVycm9yLmNhbGwodGhpcyk7XG4gIH07XG4gIE9iamVjdERpc3Bvc2VkRXJyb3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShFcnJvci5wcm90b3R5cGUpO1xuICBPYmplY3REaXNwb3NlZEVycm9yLnByb3RvdHlwZS5uYW1lID0gJ09iamVjdERpc3Bvc2VkRXJyb3InO1xuXG4gIHZhciBBcmd1bWVudE91dE9mUmFuZ2VFcnJvciA9IFJ4LkFyZ3VtZW50T3V0T2ZSYW5nZUVycm9yID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMubWVzc2FnZSA9ICdBcmd1bWVudCBvdXQgb2YgcmFuZ2UnO1xuICAgIEVycm9yLmNhbGwodGhpcyk7XG4gIH07XG4gIEFyZ3VtZW50T3V0T2ZSYW5nZUVycm9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoRXJyb3IucHJvdG90eXBlKTtcbiAgQXJndW1lbnRPdXRPZlJhbmdlRXJyb3IucHJvdG90eXBlLm5hbWUgPSAnQXJndW1lbnRPdXRPZlJhbmdlRXJyb3InO1xuXG4gIHZhciBOb3RTdXBwb3J0ZWRFcnJvciA9IFJ4Lk5vdFN1cHBvcnRlZEVycm9yID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlIHx8ICdUaGlzIG9wZXJhdGlvbiBpcyBub3Qgc3VwcG9ydGVkJztcbiAgICBFcnJvci5jYWxsKHRoaXMpO1xuICB9O1xuICBOb3RTdXBwb3J0ZWRFcnJvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEVycm9yLnByb3RvdHlwZSk7XG4gIE5vdFN1cHBvcnRlZEVycm9yLnByb3RvdHlwZS5uYW1lID0gJ05vdFN1cHBvcnRlZEVycm9yJztcblxuICB2YXIgTm90SW1wbGVtZW50ZWRFcnJvciA9IFJ4Lk5vdEltcGxlbWVudGVkRXJyb3IgPSBmdW5jdGlvbiAobWVzc2FnZSkge1xuICAgIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2UgfHwgJ1RoaXMgb3BlcmF0aW9uIGlzIG5vdCBpbXBsZW1lbnRlZCc7XG4gICAgRXJyb3IuY2FsbCh0aGlzKTtcbiAgfTtcbiAgTm90SW1wbGVtZW50ZWRFcnJvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEVycm9yLnByb3RvdHlwZSk7XG4gIE5vdEltcGxlbWVudGVkRXJyb3IucHJvdG90eXBlLm5hbWUgPSAnTm90SW1wbGVtZW50ZWRFcnJvcic7XG5cbiAgdmFyIG5vdEltcGxlbWVudGVkID0gUnguaGVscGVycy5ub3RJbXBsZW1lbnRlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aHJvdyBuZXcgTm90SW1wbGVtZW50ZWRFcnJvcigpO1xuICB9O1xuXG4gIHZhciBub3RTdXBwb3J0ZWQgPSBSeC5oZWxwZXJzLm5vdFN1cHBvcnRlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aHJvdyBuZXcgTm90U3VwcG9ydGVkRXJyb3IoKTtcbiAgfTtcblxuICAvLyBTaGltIGluIGl0ZXJhdG9yIHN1cHBvcnRcbiAgdmFyICRpdGVyYXRvciQgPSAodHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJyAmJiBTeW1ib2wuaXRlcmF0b3IpIHx8XG4gICAgJ19lczZzaGltX2l0ZXJhdG9yXyc7XG4gIC8vIEJ1ZyBmb3IgbW96aWxsYSB2ZXJzaW9uXG4gIGlmIChyb290LlNldCAmJiB0eXBlb2YgbmV3IHJvb3QuU2V0KClbJ0BAaXRlcmF0b3InXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICRpdGVyYXRvciQgPSAnQEBpdGVyYXRvcic7XG4gIH1cblxuICB2YXIgZG9uZUVudW1lcmF0b3IgPSBSeC5kb25lRW51bWVyYXRvciA9IHsgZG9uZTogdHJ1ZSwgdmFsdWU6IHVuZGVmaW5lZCB9O1xuXG4gIHZhciBpc0l0ZXJhYmxlID0gUnguaGVscGVycy5pc0l0ZXJhYmxlID0gZnVuY3Rpb24gKG8pIHtcbiAgICByZXR1cm4gbyAmJiBvWyRpdGVyYXRvciRdICE9PSB1bmRlZmluZWQ7XG4gIH07XG5cbiAgdmFyIGlzQXJyYXlMaWtlID0gUnguaGVscGVycy5pc0FycmF5TGlrZSA9IGZ1bmN0aW9uIChvKSB7XG4gICAgcmV0dXJuIG8gJiYgby5sZW5ndGggIT09IHVuZGVmaW5lZDtcbiAgfTtcblxuICBSeC5oZWxwZXJzLml0ZXJhdG9yID0gJGl0ZXJhdG9yJDtcblxuICB2YXIgYmluZENhbGxiYWNrID0gUnguaW50ZXJuYWxzLmJpbmRDYWxsYmFjayA9IGZ1bmN0aW9uIChmdW5jLCB0aGlzQXJnLCBhcmdDb3VudCkge1xuICAgIGlmICh0eXBlb2YgdGhpc0FyZyA9PT0gJ3VuZGVmaW5lZCcpIHsgcmV0dXJuIGZ1bmM7IH1cbiAgICBzd2l0Y2goYXJnQ291bnQpIHtcbiAgICAgIGNhc2UgMDpcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiBmdW5jLmNhbGwodGhpc0FyZylcbiAgICAgICAgfTtcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGFyZykge1xuICAgICAgICAgIHJldHVybiBmdW5jLmNhbGwodGhpc0FyZywgYXJnKTtcbiAgICAgICAgfTtcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCkge1xuICAgICAgICAgIHJldHVybiBmdW5jLmNhbGwodGhpc0FyZywgdmFsdWUsIGluZGV4KTtcbiAgICAgICAgfTtcbiAgICAgIGNhc2UgMzpcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbikge1xuICAgICAgICAgIHJldHVybiBmdW5jLmNhbGwodGhpc0FyZywgdmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZnVuYy5hcHBseSh0aGlzQXJnLCBhcmd1bWVudHMpO1xuICAgIH07XG4gIH07XG5cbiAgLyoqIFVzZWQgdG8gZGV0ZXJtaW5lIGlmIHZhbHVlcyBhcmUgb2YgdGhlIGxhbmd1YWdlIHR5cGUgT2JqZWN0ICovXG4gIHZhciBkb250RW51bXMgPSBbJ3RvU3RyaW5nJyxcbiAgICAndG9Mb2NhbGVTdHJpbmcnLFxuICAgICd2YWx1ZU9mJyxcbiAgICAnaGFzT3duUHJvcGVydHknLFxuICAgICdpc1Byb3RvdHlwZU9mJyxcbiAgICAncHJvcGVydHlJc0VudW1lcmFibGUnLFxuICAgICdjb25zdHJ1Y3RvciddLFxuICBkb250RW51bXNMZW5ndGggPSBkb250RW51bXMubGVuZ3RoO1xuXG52YXIgYXJnc1RhZyA9ICdbb2JqZWN0IEFyZ3VtZW50c10nLFxuICAgIGFycmF5VGFnID0gJ1tvYmplY3QgQXJyYXldJyxcbiAgICBib29sVGFnID0gJ1tvYmplY3QgQm9vbGVhbl0nLFxuICAgIGRhdGVUYWcgPSAnW29iamVjdCBEYXRlXScsXG4gICAgZXJyb3JUYWcgPSAnW29iamVjdCBFcnJvcl0nLFxuICAgIGZ1bmNUYWcgPSAnW29iamVjdCBGdW5jdGlvbl0nLFxuICAgIG1hcFRhZyA9ICdbb2JqZWN0IE1hcF0nLFxuICAgIG51bWJlclRhZyA9ICdbb2JqZWN0IE51bWJlcl0nLFxuICAgIG9iamVjdFRhZyA9ICdbb2JqZWN0IE9iamVjdF0nLFxuICAgIHJlZ2V4cFRhZyA9ICdbb2JqZWN0IFJlZ0V4cF0nLFxuICAgIHNldFRhZyA9ICdbb2JqZWN0IFNldF0nLFxuICAgIHN0cmluZ1RhZyA9ICdbb2JqZWN0IFN0cmluZ10nLFxuICAgIHdlYWtNYXBUYWcgPSAnW29iamVjdCBXZWFrTWFwXSc7XG5cbnZhciBhcnJheUJ1ZmZlclRhZyA9ICdbb2JqZWN0IEFycmF5QnVmZmVyXScsXG4gICAgZmxvYXQzMlRhZyA9ICdbb2JqZWN0IEZsb2F0MzJBcnJheV0nLFxuICAgIGZsb2F0NjRUYWcgPSAnW29iamVjdCBGbG9hdDY0QXJyYXldJyxcbiAgICBpbnQ4VGFnID0gJ1tvYmplY3QgSW50OEFycmF5XScsXG4gICAgaW50MTZUYWcgPSAnW29iamVjdCBJbnQxNkFycmF5XScsXG4gICAgaW50MzJUYWcgPSAnW29iamVjdCBJbnQzMkFycmF5XScsXG4gICAgdWludDhUYWcgPSAnW29iamVjdCBVaW50OEFycmF5XScsXG4gICAgdWludDhDbGFtcGVkVGFnID0gJ1tvYmplY3QgVWludDhDbGFtcGVkQXJyYXldJyxcbiAgICB1aW50MTZUYWcgPSAnW29iamVjdCBVaW50MTZBcnJheV0nLFxuICAgIHVpbnQzMlRhZyA9ICdbb2JqZWN0IFVpbnQzMkFycmF5XSc7XG5cbnZhciB0eXBlZEFycmF5VGFncyA9IHt9O1xudHlwZWRBcnJheVRhZ3NbZmxvYXQzMlRhZ10gPSB0eXBlZEFycmF5VGFnc1tmbG9hdDY0VGFnXSA9XG50eXBlZEFycmF5VGFnc1tpbnQ4VGFnXSA9IHR5cGVkQXJyYXlUYWdzW2ludDE2VGFnXSA9XG50eXBlZEFycmF5VGFnc1tpbnQzMlRhZ10gPSB0eXBlZEFycmF5VGFnc1t1aW50OFRhZ10gPVxudHlwZWRBcnJheVRhZ3NbdWludDhDbGFtcGVkVGFnXSA9IHR5cGVkQXJyYXlUYWdzW3VpbnQxNlRhZ10gPVxudHlwZWRBcnJheVRhZ3NbdWludDMyVGFnXSA9IHRydWU7XG50eXBlZEFycmF5VGFnc1thcmdzVGFnXSA9IHR5cGVkQXJyYXlUYWdzW2FycmF5VGFnXSA9XG50eXBlZEFycmF5VGFnc1thcnJheUJ1ZmZlclRhZ10gPSB0eXBlZEFycmF5VGFnc1tib29sVGFnXSA9XG50eXBlZEFycmF5VGFnc1tkYXRlVGFnXSA9IHR5cGVkQXJyYXlUYWdzW2Vycm9yVGFnXSA9XG50eXBlZEFycmF5VGFnc1tmdW5jVGFnXSA9IHR5cGVkQXJyYXlUYWdzW21hcFRhZ10gPVxudHlwZWRBcnJheVRhZ3NbbnVtYmVyVGFnXSA9IHR5cGVkQXJyYXlUYWdzW29iamVjdFRhZ10gPVxudHlwZWRBcnJheVRhZ3NbcmVnZXhwVGFnXSA9IHR5cGVkQXJyYXlUYWdzW3NldFRhZ10gPVxudHlwZWRBcnJheVRhZ3Nbc3RyaW5nVGFnXSA9IHR5cGVkQXJyYXlUYWdzW3dlYWtNYXBUYWddID0gZmFsc2U7XG5cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGUsXG4gICAgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eSxcbiAgICBvYmpUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nLFxuICAgIE1BWF9TQUZFX0lOVEVHRVIgPSBNYXRoLnBvdygyLCA1MykgLSAxO1xuXG52YXIga2V5cyA9IE9iamVjdC5rZXlzIHx8IChmdW5jdGlvbigpIHtcbiAgICB2YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LFxuICAgICAgICBoYXNEb250RW51bUJ1ZyA9ICEoeyB0b1N0cmluZzogbnVsbCB9KS5wcm9wZXJ0eUlzRW51bWVyYWJsZSgndG9TdHJpbmcnKSxcbiAgICAgICAgZG9udEVudW1zID0gW1xuICAgICAgICAgICd0b1N0cmluZycsXG4gICAgICAgICAgJ3RvTG9jYWxlU3RyaW5nJyxcbiAgICAgICAgICAndmFsdWVPZicsXG4gICAgICAgICAgJ2hhc093blByb3BlcnR5JyxcbiAgICAgICAgICAnaXNQcm90b3R5cGVPZicsXG4gICAgICAgICAgJ3Byb3BlcnR5SXNFbnVtZXJhYmxlJyxcbiAgICAgICAgICAnY29uc3RydWN0b3InXG4gICAgICAgIF0sXG4gICAgICAgIGRvbnRFbnVtc0xlbmd0aCA9IGRvbnRFbnVtcy5sZW5ndGg7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24ob2JqKSB7XG4gICAgICBpZiAodHlwZW9mIG9iaiAhPT0gJ29iamVjdCcgJiYgKHR5cGVvZiBvYmogIT09ICdmdW5jdGlvbicgfHwgb2JqID09PSBudWxsKSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdPYmplY3Qua2V5cyBjYWxsZWQgb24gbm9uLW9iamVjdCcpO1xuICAgICAgfVxuXG4gICAgICB2YXIgcmVzdWx0ID0gW10sIHByb3AsIGk7XG5cbiAgICAgIGZvciAocHJvcCBpbiBvYmopIHtcbiAgICAgICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkge1xuICAgICAgICAgIHJlc3VsdC5wdXNoKHByb3ApO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChoYXNEb250RW51bUJ1Zykge1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgZG9udEVudW1zTGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGRvbnRFbnVtc1tpXSkpIHtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKGRvbnRFbnVtc1tpXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG4gIH0oKSk7XG5cbmZ1bmN0aW9uIGVxdWFsT2JqZWN0cyhvYmplY3QsIG90aGVyLCBlcXVhbEZ1bmMsIGlzTG9vc2UsIHN0YWNrQSwgc3RhY2tCKSB7XG4gIHZhciBvYmpQcm9wcyA9IGtleXMob2JqZWN0KSxcbiAgICAgIG9iakxlbmd0aCA9IG9ialByb3BzLmxlbmd0aCxcbiAgICAgIG90aFByb3BzID0ga2V5cyhvdGhlciksXG4gICAgICBvdGhMZW5ndGggPSBvdGhQcm9wcy5sZW5ndGg7XG5cbiAgaWYgKG9iakxlbmd0aCAhPT0gb3RoTGVuZ3RoICYmICFpc0xvb3NlKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciBpbmRleCA9IG9iakxlbmd0aCwga2V5O1xuICB3aGlsZSAoaW5kZXgtLSkge1xuICAgIGtleSA9IG9ialByb3BzW2luZGV4XTtcbiAgICBpZiAoIShpc0xvb3NlID8ga2V5IGluIG90aGVyIDogaGFzT3duUHJvcGVydHkuY2FsbChvdGhlciwga2V5KSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbiAgdmFyIHNraXBDdG9yID0gaXNMb29zZTtcbiAgd2hpbGUgKCsraW5kZXggPCBvYmpMZW5ndGgpIHtcbiAgICBrZXkgPSBvYmpQcm9wc1tpbmRleF07XG4gICAgdmFyIG9ialZhbHVlID0gb2JqZWN0W2tleV0sXG4gICAgICAgIG90aFZhbHVlID0gb3RoZXJba2V5XSxcbiAgICAgICAgcmVzdWx0O1xuXG4gICAgaWYgKCEocmVzdWx0ID09PSB1bmRlZmluZWQgPyBlcXVhbEZ1bmMob2JqVmFsdWUsIG90aFZhbHVlLCBpc0xvb3NlLCBzdGFja0EsIHN0YWNrQikgOiByZXN1bHQpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHNraXBDdG9yIHx8IChza2lwQ3RvciA9IGtleSA9PT0gJ2NvbnN0cnVjdG9yJyk7XG4gIH1cbiAgaWYgKCFza2lwQ3Rvcikge1xuICAgIHZhciBvYmpDdG9yID0gb2JqZWN0LmNvbnN0cnVjdG9yLFxuICAgICAgICBvdGhDdG9yID0gb3RoZXIuY29uc3RydWN0b3I7XG5cbiAgICBpZiAob2JqQ3RvciAhPT0gb3RoQ3RvciAmJlxuICAgICAgICAoJ2NvbnN0cnVjdG9yJyBpbiBvYmplY3QgJiYgJ2NvbnN0cnVjdG9yJyBpbiBvdGhlcikgJiZcbiAgICAgICAgISh0eXBlb2Ygb2JqQ3RvciA9PT0gJ2Z1bmN0aW9uJyAmJiBvYmpDdG9yIGluc3RhbmNlb2Ygb2JqQ3RvciAmJlxuICAgICAgICAgIHR5cGVvZiBvdGhDdG9yID09PSAnZnVuY3Rpb24nICYmIG90aEN0b3IgaW5zdGFuY2VvZiBvdGhDdG9yKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gZXF1YWxCeVRhZyhvYmplY3QsIG90aGVyLCB0YWcpIHtcbiAgc3dpdGNoICh0YWcpIHtcbiAgICBjYXNlIGJvb2xUYWc6XG4gICAgY2FzZSBkYXRlVGFnOlxuICAgICAgcmV0dXJuICtvYmplY3QgPT09ICtvdGhlcjtcblxuICAgIGNhc2UgZXJyb3JUYWc6XG4gICAgICByZXR1cm4gb2JqZWN0Lm5hbWUgPT09IG90aGVyLm5hbWUgJiYgb2JqZWN0Lm1lc3NhZ2UgPT09IG90aGVyLm1lc3NhZ2U7XG5cbiAgICBjYXNlIG51bWJlclRhZzpcbiAgICAgIHJldHVybiAob2JqZWN0ICE9PSArb2JqZWN0KSA/XG4gICAgICAgIG90aGVyICE9PSArb3RoZXIgOlxuICAgICAgICBvYmplY3QgPT09ICtvdGhlcjtcblxuICAgIGNhc2UgcmVnZXhwVGFnOlxuICAgIGNhc2Ugc3RyaW5nVGFnOlxuICAgICAgcmV0dXJuIG9iamVjdCA9PT0gKG90aGVyICsgJycpO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxudmFyIGlzT2JqZWN0ID0gUnguaW50ZXJuYWxzLmlzT2JqZWN0ID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIHJldHVybiAhIXZhbHVlICYmICh0eXBlID09PSAnb2JqZWN0JyB8fCB0eXBlID09PSAnZnVuY3Rpb24nKTtcbn07XG5cbmZ1bmN0aW9uIGlzT2JqZWN0TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gISF2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnO1xufVxuXG5mdW5jdGlvbiBpc0xlbmd0aCh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyAmJiB2YWx1ZSA+IC0xICYmIHZhbHVlICUgMSA9PT0gMCAmJiB2YWx1ZSA8PSBNQVhfU0FGRV9JTlRFR0VSO1xufVxuXG52YXIgaXNIb3N0T2JqZWN0ID0gKGZ1bmN0aW9uKCkge1xuICB0cnkge1xuICAgIE9iamVjdCh7ICd0b1N0cmluZyc6IDAgfSArICcnKTtcbiAgfSBjYXRjaChlKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkgeyByZXR1cm4gZmFsc2U7IH07XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZS50b1N0cmluZyAhPT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgKHZhbHVlICsgJycpID09PSAnc3RyaW5nJztcbiAgfTtcbn0oKSk7XG5cbmZ1bmN0aW9uIGlzVHlwZWRBcnJheSh2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBpc0xlbmd0aCh2YWx1ZS5sZW5ndGgpICYmICEhdHlwZWRBcnJheVRhZ3Nbb2JqVG9TdHJpbmcuY2FsbCh2YWx1ZSldO1xufVxuXG52YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgaXNMZW5ndGgodmFsdWUubGVuZ3RoKSAmJiBvYmpUb1N0cmluZy5jYWxsKHZhbHVlKSA9PT0gYXJyYXlUYWc7XG59O1xuXG5mdW5jdGlvbiBhcnJheVNvbWUgKGFycmF5LCBwcmVkaWNhdGUpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBhcnJheS5sZW5ndGg7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICBpZiAocHJlZGljYXRlKGFycmF5W2luZGV4XSwgaW5kZXgsIGFycmF5KSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gZXF1YWxBcnJheXMoYXJyYXksIG90aGVyLCBlcXVhbEZ1bmMsIGlzTG9vc2UsIHN0YWNrQSwgc3RhY2tCKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgYXJyTGVuZ3RoID0gYXJyYXkubGVuZ3RoLFxuICAgICAgb3RoTGVuZ3RoID0gb3RoZXIubGVuZ3RoO1xuXG4gIGlmIChhcnJMZW5ndGggIT09IG90aExlbmd0aCAmJiAhKGlzTG9vc2UgJiYgb3RoTGVuZ3RoID4gYXJyTGVuZ3RoKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICAvLyBJZ25vcmUgbm9uLWluZGV4IHByb3BlcnRpZXMuXG4gIHdoaWxlICgrK2luZGV4IDwgYXJyTGVuZ3RoKSB7XG4gICAgdmFyIGFyclZhbHVlID0gYXJyYXlbaW5kZXhdLFxuICAgICAgICBvdGhWYWx1ZSA9IG90aGVyW2luZGV4XSxcbiAgICAgICAgcmVzdWx0O1xuXG4gICAgaWYgKHJlc3VsdCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICAvLyBSZWN1cnNpdmVseSBjb21wYXJlIGFycmF5cyAoc3VzY2VwdGlibGUgdG8gY2FsbCBzdGFjayBsaW1pdHMpLlxuICAgIGlmIChpc0xvb3NlKSB7XG4gICAgICBpZiAoIWFycmF5U29tZShvdGhlciwgZnVuY3Rpb24ob3RoVmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiBhcnJWYWx1ZSA9PT0gb3RoVmFsdWUgfHwgZXF1YWxGdW5jKGFyclZhbHVlLCBvdGhWYWx1ZSwgaXNMb29zZSwgc3RhY2tBLCBzdGFja0IpO1xuICAgICAgICAgIH0pKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKCEoYXJyVmFsdWUgPT09IG90aFZhbHVlIHx8IGVxdWFsRnVuYyhhcnJWYWx1ZSwgb3RoVmFsdWUsIGlzTG9vc2UsIHN0YWNrQSwgc3RhY2tCKSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIGJhc2VJc0VxdWFsRGVlcChvYmplY3QsIG90aGVyLCBlcXVhbEZ1bmMsIGlzTG9vc2UsIHN0YWNrQSwgc3RhY2tCKSB7XG4gIHZhciBvYmpJc0FyciA9IGlzQXJyYXkob2JqZWN0KSxcbiAgICAgIG90aElzQXJyID0gaXNBcnJheShvdGhlciksXG4gICAgICBvYmpUYWcgPSBhcnJheVRhZyxcbiAgICAgIG90aFRhZyA9IGFycmF5VGFnO1xuXG4gIGlmICghb2JqSXNBcnIpIHtcbiAgICBvYmpUYWcgPSBvYmpUb1N0cmluZy5jYWxsKG9iamVjdCk7XG4gICAgaWYgKG9ialRhZyA9PT0gYXJnc1RhZykge1xuICAgICAgb2JqVGFnID0gb2JqZWN0VGFnO1xuICAgIH0gZWxzZSBpZiAob2JqVGFnICE9PSBvYmplY3RUYWcpIHtcbiAgICAgIG9iaklzQXJyID0gaXNUeXBlZEFycmF5KG9iamVjdCk7XG4gICAgfVxuICB9XG4gIGlmICghb3RoSXNBcnIpIHtcbiAgICBvdGhUYWcgPSBvYmpUb1N0cmluZy5jYWxsKG90aGVyKTtcbiAgICBpZiAob3RoVGFnID09PSBhcmdzVGFnKSB7XG4gICAgICBvdGhUYWcgPSBvYmplY3RUYWc7XG4gICAgfVxuICB9XG4gIHZhciBvYmpJc09iaiA9IG9ialRhZyA9PT0gb2JqZWN0VGFnICYmICFpc0hvc3RPYmplY3Qob2JqZWN0KSxcbiAgICAgIG90aElzT2JqID0gb3RoVGFnID09PSBvYmplY3RUYWcgJiYgIWlzSG9zdE9iamVjdChvdGhlciksXG4gICAgICBpc1NhbWVUYWcgPSBvYmpUYWcgPT09IG90aFRhZztcblxuICBpZiAoaXNTYW1lVGFnICYmICEob2JqSXNBcnIgfHwgb2JqSXNPYmopKSB7XG4gICAgcmV0dXJuIGVxdWFsQnlUYWcob2JqZWN0LCBvdGhlciwgb2JqVGFnKTtcbiAgfVxuICBpZiAoIWlzTG9vc2UpIHtcbiAgICB2YXIgb2JqSXNXcmFwcGVkID0gb2JqSXNPYmogJiYgaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsICdfX3dyYXBwZWRfXycpLFxuICAgICAgICBvdGhJc1dyYXBwZWQgPSBvdGhJc09iaiAmJiBoYXNPd25Qcm9wZXJ0eS5jYWxsKG90aGVyLCAnX193cmFwcGVkX18nKTtcblxuICAgIGlmIChvYmpJc1dyYXBwZWQgfHwgb3RoSXNXcmFwcGVkKSB7XG4gICAgICByZXR1cm4gZXF1YWxGdW5jKG9iaklzV3JhcHBlZCA/IG9iamVjdC52YWx1ZSgpIDogb2JqZWN0LCBvdGhJc1dyYXBwZWQgPyBvdGhlci52YWx1ZSgpIDogb3RoZXIsIGlzTG9vc2UsIHN0YWNrQSwgc3RhY2tCKTtcbiAgICB9XG4gIH1cbiAgaWYgKCFpc1NhbWVUYWcpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgLy8gQXNzdW1lIGN5Y2xpYyB2YWx1ZXMgYXJlIGVxdWFsLlxuICAvLyBGb3IgbW9yZSBpbmZvcm1hdGlvbiBvbiBkZXRlY3RpbmcgY2lyY3VsYXIgcmVmZXJlbmNlcyBzZWUgaHR0cHM6Ly9lczUuZ2l0aHViLmlvLyNKTy5cbiAgc3RhY2tBIHx8IChzdGFja0EgPSBbXSk7XG4gIHN0YWNrQiB8fCAoc3RhY2tCID0gW10pO1xuXG4gIHZhciBsZW5ndGggPSBzdGFja0EubGVuZ3RoO1xuICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICBpZiAoc3RhY2tBW2xlbmd0aF0gPT09IG9iamVjdCkge1xuICAgICAgcmV0dXJuIHN0YWNrQltsZW5ndGhdID09PSBvdGhlcjtcbiAgICB9XG4gIH1cbiAgLy8gQWRkIGBvYmplY3RgIGFuZCBgb3RoZXJgIHRvIHRoZSBzdGFjayBvZiB0cmF2ZXJzZWQgb2JqZWN0cy5cbiAgc3RhY2tBLnB1c2gob2JqZWN0KTtcbiAgc3RhY2tCLnB1c2gob3RoZXIpO1xuXG4gIHZhciByZXN1bHQgPSAob2JqSXNBcnIgPyBlcXVhbEFycmF5cyA6IGVxdWFsT2JqZWN0cykob2JqZWN0LCBvdGhlciwgZXF1YWxGdW5jLCBpc0xvb3NlLCBzdGFja0EsIHN0YWNrQik7XG5cbiAgc3RhY2tBLnBvcCgpO1xuICBzdGFja0IucG9wKCk7XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gYmFzZUlzRXF1YWwodmFsdWUsIG90aGVyLCBpc0xvb3NlLCBzdGFja0EsIHN0YWNrQikge1xuICBpZiAodmFsdWUgPT09IG90aGVyKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgaWYgKHZhbHVlID09IG51bGwgfHwgb3RoZXIgPT0gbnVsbCB8fCAoIWlzT2JqZWN0KHZhbHVlKSAmJiAhaXNPYmplY3RMaWtlKG90aGVyKSkpIHtcbiAgICByZXR1cm4gdmFsdWUgIT09IHZhbHVlICYmIG90aGVyICE9PSBvdGhlcjtcbiAgfVxuICByZXR1cm4gYmFzZUlzRXF1YWxEZWVwKHZhbHVlLCBvdGhlciwgYmFzZUlzRXF1YWwsIGlzTG9vc2UsIHN0YWNrQSwgc3RhY2tCKTtcbn1cblxudmFyIGlzRXF1YWwgPSBSeC5pbnRlcm5hbHMuaXNFcXVhbCA9IGZ1bmN0aW9uICh2YWx1ZSwgb3RoZXIpIHtcbiAgcmV0dXJuIGJhc2VJc0VxdWFsKHZhbHVlLCBvdGhlcik7XG59O1xuXG4gIHZhciBoYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHksXG4gICAgICBzbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcblxuICB2YXIgaW5oZXJpdHMgPSBSeC5pbnRlcm5hbHMuaW5oZXJpdHMgPSBmdW5jdGlvbiAoY2hpbGQsIHBhcmVudCkge1xuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH1cbiAgICBfXy5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlO1xuICAgIGNoaWxkLnByb3RvdHlwZSA9IG5ldyBfXygpO1xuICB9O1xuXG4gIHZhciBhZGRQcm9wZXJ0aWVzID0gUnguaW50ZXJuYWxzLmFkZFByb3BlcnRpZXMgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgZm9yKHZhciBzb3VyY2VzID0gW10sIGkgPSAxLCBsZW4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHsgc291cmNlcy5wdXNoKGFyZ3VtZW50c1tpXSk7IH1cbiAgICBmb3IgKHZhciBpZHggPSAwLCBsbiA9IHNvdXJjZXMubGVuZ3RoOyBpZHggPCBsbjsgaWR4KyspIHtcbiAgICAgIHZhciBzb3VyY2UgPSBzb3VyY2VzW2lkeF07XG4gICAgICBmb3IgKHZhciBwcm9wIGluIHNvdXJjZSkge1xuICAgICAgICBvYmpbcHJvcF0gPSBzb3VyY2VbcHJvcF07XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIC8vIFJ4IFV0aWxzXG4gIHZhciBhZGRSZWYgPSBSeC5pbnRlcm5hbHMuYWRkUmVmID0gZnVuY3Rpb24gKHhzLCByKSB7XG4gICAgcmV0dXJuIG5ldyBBbm9ueW1vdXNPYnNlcnZhYmxlKGZ1bmN0aW9uIChvYnNlcnZlcikge1xuICAgICAgcmV0dXJuIG5ldyBCaW5hcnlEaXNwb3NhYmxlKHIuZ2V0RGlzcG9zYWJsZSgpLCB4cy5zdWJzY3JpYmUob2JzZXJ2ZXIpKTtcbiAgICB9KTtcbiAgfTtcblxuICBmdW5jdGlvbiBhcnJheUluaXRpYWxpemUoY291bnQsIGZhY3RvcnkpIHtcbiAgICB2YXIgYSA9IG5ldyBBcnJheShjb3VudCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb3VudDsgaSsrKSB7XG4gICAgICBhW2ldID0gZmFjdG9yeSgpO1xuICAgIH1cbiAgICByZXR1cm4gYTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXByZXNlbnRzIGEgZ3JvdXAgb2YgZGlzcG9zYWJsZSByZXNvdXJjZXMgdGhhdCBhcmUgZGlzcG9zZWQgdG9nZXRoZXIuXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKi9cbiAgdmFyIENvbXBvc2l0ZURpc3Bvc2FibGUgPSBSeC5Db21wb3NpdGVEaXNwb3NhYmxlID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBhcmdzID0gW10sIGksIGxlbjtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShhcmd1bWVudHNbMF0pKSB7XG4gICAgICBhcmdzID0gYXJndW1lbnRzWzBdO1xuICAgIH0gZWxzZSB7XG4gICAgICBsZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgICAgYXJncyA9IG5ldyBBcnJheShsZW4pO1xuICAgICAgZm9yKGkgPSAwOyBpIDwgbGVuOyBpKyspIHsgYXJnc1tpXSA9IGFyZ3VtZW50c1tpXTsgfVxuICAgIH1cbiAgICB0aGlzLmRpc3Bvc2FibGVzID0gYXJncztcbiAgICB0aGlzLmlzRGlzcG9zZWQgPSBmYWxzZTtcbiAgICB0aGlzLmxlbmd0aCA9IGFyZ3MubGVuZ3RoO1xuICB9O1xuXG4gIHZhciBDb21wb3NpdGVEaXNwb3NhYmxlUHJvdG90eXBlID0gQ29tcG9zaXRlRGlzcG9zYWJsZS5wcm90b3R5cGU7XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBkaXNwb3NhYmxlIHRvIHRoZSBDb21wb3NpdGVEaXNwb3NhYmxlIG9yIGRpc3Bvc2VzIHRoZSBkaXNwb3NhYmxlIGlmIHRoZSBDb21wb3NpdGVEaXNwb3NhYmxlIGlzIGRpc3Bvc2VkLlxuICAgKiBAcGFyYW0ge01peGVkfSBpdGVtIERpc3Bvc2FibGUgdG8gYWRkLlxuICAgKi9cbiAgQ29tcG9zaXRlRGlzcG9zYWJsZVByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiAoaXRlbSkge1xuICAgIGlmICh0aGlzLmlzRGlzcG9zZWQpIHtcbiAgICAgIGl0ZW0uZGlzcG9zZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmRpc3Bvc2FibGVzLnB1c2goaXRlbSk7XG4gICAgICB0aGlzLmxlbmd0aCsrO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogUmVtb3ZlcyBhbmQgZGlzcG9zZXMgdGhlIGZpcnN0IG9jY3VycmVuY2Ugb2YgYSBkaXNwb3NhYmxlIGZyb20gdGhlIENvbXBvc2l0ZURpc3Bvc2FibGUuXG4gICAqIEBwYXJhbSB7TWl4ZWR9IGl0ZW0gRGlzcG9zYWJsZSB0byByZW1vdmUuXG4gICAqIEByZXR1cm5zIHtCb29sZWFufSB0cnVlIGlmIGZvdW5kOyBmYWxzZSBvdGhlcndpc2UuXG4gICAqL1xuICBDb21wb3NpdGVEaXNwb3NhYmxlUHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgdmFyIHNob3VsZERpc3Bvc2UgPSBmYWxzZTtcbiAgICBpZiAoIXRoaXMuaXNEaXNwb3NlZCkge1xuICAgICAgdmFyIGlkeCA9IHRoaXMuZGlzcG9zYWJsZXMuaW5kZXhPZihpdGVtKTtcbiAgICAgIGlmIChpZHggIT09IC0xKSB7XG4gICAgICAgIHNob3VsZERpc3Bvc2UgPSB0cnVlO1xuICAgICAgICB0aGlzLmRpc3Bvc2FibGVzLnNwbGljZShpZHgsIDEpO1xuICAgICAgICB0aGlzLmxlbmd0aC0tO1xuICAgICAgICBpdGVtLmRpc3Bvc2UoKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHNob3VsZERpc3Bvc2U7XG4gIH07XG5cbiAgLyoqXG4gICAqICBEaXNwb3NlcyBhbGwgZGlzcG9zYWJsZXMgaW4gdGhlIGdyb3VwIGFuZCByZW1vdmVzIHRoZW0gZnJvbSB0aGUgZ3JvdXAuXG4gICAqL1xuICBDb21wb3NpdGVEaXNwb3NhYmxlUHJvdG90eXBlLmRpc3Bvc2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCF0aGlzLmlzRGlzcG9zZWQpIHtcbiAgICAgIHRoaXMuaXNEaXNwb3NlZCA9IHRydWU7XG4gICAgICB2YXIgbGVuID0gdGhpcy5kaXNwb3NhYmxlcy5sZW5ndGgsIGN1cnJlbnREaXNwb3NhYmxlcyA9IG5ldyBBcnJheShsZW4pO1xuICAgICAgZm9yKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7IGN1cnJlbnREaXNwb3NhYmxlc1tpXSA9IHRoaXMuZGlzcG9zYWJsZXNbaV07IH1cbiAgICAgIHRoaXMuZGlzcG9zYWJsZXMgPSBbXTtcbiAgICAgIHRoaXMubGVuZ3RoID0gMDtcblxuICAgICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIGN1cnJlbnREaXNwb3NhYmxlc1tpXS5kaXNwb3NlKCk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBQcm92aWRlcyBhIHNldCBvZiBzdGF0aWMgbWV0aG9kcyBmb3IgY3JlYXRpbmcgRGlzcG9zYWJsZXMuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGRpc3Bvc2UgQWN0aW9uIHRvIHJ1biBkdXJpbmcgdGhlIGZpcnN0IGNhbGwgdG8gZGlzcG9zZS4gVGhlIGFjdGlvbiBpcyBndWFyYW50ZWVkIHRvIGJlIHJ1biBhdCBtb3N0IG9uY2UuXG4gICAqL1xuICB2YXIgRGlzcG9zYWJsZSA9IFJ4LkRpc3Bvc2FibGUgPSBmdW5jdGlvbiAoYWN0aW9uKSB7XG4gICAgdGhpcy5pc0Rpc3Bvc2VkID0gZmFsc2U7XG4gICAgdGhpcy5hY3Rpb24gPSBhY3Rpb24gfHwgbm9vcDtcbiAgfTtcblxuICAvKiogUGVyZm9ybXMgdGhlIHRhc2sgb2YgY2xlYW5pbmcgdXAgcmVzb3VyY2VzLiAqL1xuICBEaXNwb3NhYmxlLnByb3RvdHlwZS5kaXNwb3NlID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICghdGhpcy5pc0Rpc3Bvc2VkKSB7XG4gICAgICB0aGlzLmFjdGlvbigpO1xuICAgICAgdGhpcy5pc0Rpc3Bvc2VkID0gdHJ1ZTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBkaXNwb3NhYmxlIG9iamVjdCB0aGF0IGludm9rZXMgdGhlIHNwZWNpZmllZCBhY3Rpb24gd2hlbiBkaXNwb3NlZC5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZGlzcG9zZSBBY3Rpb24gdG8gcnVuIGR1cmluZyB0aGUgZmlyc3QgY2FsbCB0byBkaXNwb3NlLiBUaGUgYWN0aW9uIGlzIGd1YXJhbnRlZWQgdG8gYmUgcnVuIGF0IG1vc3Qgb25jZS5cbiAgICogQHJldHVybiB7RGlzcG9zYWJsZX0gVGhlIGRpc3Bvc2FibGUgb2JqZWN0IHRoYXQgcnVucyB0aGUgZ2l2ZW4gYWN0aW9uIHVwb24gZGlzcG9zYWwuXG4gICAqL1xuICB2YXIgZGlzcG9zYWJsZUNyZWF0ZSA9IERpc3Bvc2FibGUuY3JlYXRlID0gZnVuY3Rpb24gKGFjdGlvbikgeyByZXR1cm4gbmV3IERpc3Bvc2FibGUoYWN0aW9uKTsgfTtcblxuICAvKipcbiAgICogR2V0cyB0aGUgZGlzcG9zYWJsZSB0aGF0IGRvZXMgbm90aGluZyB3aGVuIGRpc3Bvc2VkLlxuICAgKi9cbiAgdmFyIGRpc3Bvc2FibGVFbXB0eSA9IERpc3Bvc2FibGUuZW1wdHkgPSB7IGRpc3Bvc2U6IG5vb3AgfTtcblxuICAvKipcbiAgICogVmFsaWRhdGVzIHdoZXRoZXIgdGhlIGdpdmVuIG9iamVjdCBpcyBhIGRpc3Bvc2FibGVcbiAgICogQHBhcmFtIHtPYmplY3R9IE9iamVjdCB0byB0ZXN0IHdoZXRoZXIgaXQgaGFzIGEgZGlzcG9zZSBtZXRob2RcbiAgICogQHJldHVybnMge0Jvb2xlYW59IHRydWUgaWYgYSBkaXNwb3NhYmxlIG9iamVjdCwgZWxzZSBmYWxzZS5cbiAgICovXG4gIHZhciBpc0Rpc3Bvc2FibGUgPSBEaXNwb3NhYmxlLmlzRGlzcG9zYWJsZSA9IGZ1bmN0aW9uIChkKSB7XG4gICAgcmV0dXJuIGQgJiYgaXNGdW5jdGlvbihkLmRpc3Bvc2UpO1xuICB9O1xuXG4gIHZhciBjaGVja0Rpc3Bvc2VkID0gRGlzcG9zYWJsZS5jaGVja0Rpc3Bvc2VkID0gZnVuY3Rpb24gKGRpc3Bvc2FibGUpIHtcbiAgICBpZiAoZGlzcG9zYWJsZS5pc0Rpc3Bvc2VkKSB7IHRocm93IG5ldyBPYmplY3REaXNwb3NlZEVycm9yKCk7IH1cbiAgfTtcblxuICB2YXIgZGlzcG9zYWJsZUZpeHVwID0gRGlzcG9zYWJsZS5fZml4dXAgPSBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgcmV0dXJuIGlzRGlzcG9zYWJsZShyZXN1bHQpID8gcmVzdWx0IDogZGlzcG9zYWJsZUVtcHR5O1xuICB9O1xuXG4gIC8vIFNpbmdsZSBhc3NpZ25tZW50XG4gIHZhciBTaW5nbGVBc3NpZ25tZW50RGlzcG9zYWJsZSA9IFJ4LlNpbmdsZUFzc2lnbm1lbnREaXNwb3NhYmxlID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuaXNEaXNwb3NlZCA9IGZhbHNlO1xuICAgIHRoaXMuY3VycmVudCA9IG51bGw7XG4gIH07XG4gIFNpbmdsZUFzc2lnbm1lbnREaXNwb3NhYmxlLnByb3RvdHlwZS5nZXREaXNwb3NhYmxlID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLmN1cnJlbnQ7XG4gIH07XG4gIFNpbmdsZUFzc2lnbm1lbnREaXNwb3NhYmxlLnByb3RvdHlwZS5zZXREaXNwb3NhYmxlID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgaWYgKHRoaXMuY3VycmVudCkgeyB0aHJvdyBuZXcgRXJyb3IoJ0Rpc3Bvc2FibGUgaGFzIGFscmVhZHkgYmVlbiBhc3NpZ25lZCcpOyB9XG4gICAgdmFyIHNob3VsZERpc3Bvc2UgPSB0aGlzLmlzRGlzcG9zZWQ7XG4gICAgIXNob3VsZERpc3Bvc2UgJiYgKHRoaXMuY3VycmVudCA9IHZhbHVlKTtcbiAgICBzaG91bGREaXNwb3NlICYmIHZhbHVlICYmIHZhbHVlLmRpc3Bvc2UoKTtcbiAgfTtcbiAgU2luZ2xlQXNzaWdubWVudERpc3Bvc2FibGUucHJvdG90eXBlLmRpc3Bvc2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCF0aGlzLmlzRGlzcG9zZWQpIHtcbiAgICAgIHRoaXMuaXNEaXNwb3NlZCA9IHRydWU7XG4gICAgICB2YXIgb2xkID0gdGhpcy5jdXJyZW50O1xuICAgICAgdGhpcy5jdXJyZW50ID0gbnVsbDtcbiAgICAgIG9sZCAmJiBvbGQuZGlzcG9zZSgpO1xuICAgIH1cbiAgfTtcblxuICAvLyBNdWx0aXBsZSBhc3NpZ25tZW50IGRpc3Bvc2FibGVcbiAgdmFyIFNlcmlhbERpc3Bvc2FibGUgPSBSeC5TZXJpYWxEaXNwb3NhYmxlID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuaXNEaXNwb3NlZCA9IGZhbHNlO1xuICAgIHRoaXMuY3VycmVudCA9IG51bGw7XG4gIH07XG4gIFNlcmlhbERpc3Bvc2FibGUucHJvdG90eXBlLmdldERpc3Bvc2FibGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuY3VycmVudDtcbiAgfTtcbiAgU2VyaWFsRGlzcG9zYWJsZS5wcm90b3R5cGUuc2V0RGlzcG9zYWJsZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHZhciBzaG91bGREaXNwb3NlID0gdGhpcy5pc0Rpc3Bvc2VkO1xuICAgIGlmICghc2hvdWxkRGlzcG9zZSkge1xuICAgICAgdmFyIG9sZCA9IHRoaXMuY3VycmVudDtcbiAgICAgIHRoaXMuY3VycmVudCA9IHZhbHVlO1xuICAgIH1cbiAgICBvbGQgJiYgb2xkLmRpc3Bvc2UoKTtcbiAgICBzaG91bGREaXNwb3NlICYmIHZhbHVlICYmIHZhbHVlLmRpc3Bvc2UoKTtcbiAgfTtcbiAgU2VyaWFsRGlzcG9zYWJsZS5wcm90b3R5cGUuZGlzcG9zZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXRoaXMuaXNEaXNwb3NlZCkge1xuICAgICAgdGhpcy5pc0Rpc3Bvc2VkID0gdHJ1ZTtcbiAgICAgIHZhciBvbGQgPSB0aGlzLmN1cnJlbnQ7XG4gICAgICB0aGlzLmN1cnJlbnQgPSBudWxsO1xuICAgIH1cbiAgICBvbGQgJiYgb2xkLmRpc3Bvc2UoKTtcbiAgfTtcblxuICB2YXIgQmluYXJ5RGlzcG9zYWJsZSA9IFJ4LkJpbmFyeURpc3Bvc2FibGUgPSBmdW5jdGlvbiAoZmlyc3QsIHNlY29uZCkge1xuICAgIHRoaXMuX2ZpcnN0ID0gZmlyc3Q7XG4gICAgdGhpcy5fc2Vjb25kID0gc2Vjb25kO1xuICAgIHRoaXMuaXNEaXNwb3NlZCA9IGZhbHNlO1xuICB9O1xuXG4gIEJpbmFyeURpc3Bvc2FibGUucHJvdG90eXBlLmRpc3Bvc2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCF0aGlzLmlzRGlzcG9zZWQpIHtcbiAgICAgIHRoaXMuaXNEaXNwb3NlZCA9IHRydWU7XG4gICAgICB2YXIgb2xkMSA9IHRoaXMuX2ZpcnN0O1xuICAgICAgdGhpcy5fZmlyc3QgPSBudWxsO1xuICAgICAgb2xkMSAmJiBvbGQxLmRpc3Bvc2UoKTtcbiAgICAgIHZhciBvbGQyID0gdGhpcy5fc2Vjb25kO1xuICAgICAgdGhpcy5fc2Vjb25kID0gbnVsbDtcbiAgICAgIG9sZDIgJiYgb2xkMi5kaXNwb3NlKCk7XG4gICAgfVxuICB9O1xuXG4gIHZhciBOQXJ5RGlzcG9zYWJsZSA9IFJ4Lk5BcnlEaXNwb3NhYmxlID0gZnVuY3Rpb24gKGRpc3Bvc2FibGVzKSB7XG4gICAgdGhpcy5fZGlzcG9zYWJsZXMgPSBkaXNwb3NhYmxlcztcbiAgICB0aGlzLmlzRGlzcG9zZWQgPSBmYWxzZTtcbiAgfTtcblxuICBOQXJ5RGlzcG9zYWJsZS5wcm90b3R5cGUuZGlzcG9zZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXRoaXMuaXNEaXNwb3NlZCkge1xuICAgICAgdGhpcy5pc0Rpc3Bvc2VkID0gdHJ1ZTtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSB0aGlzLl9kaXNwb3NhYmxlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICB0aGlzLl9kaXNwb3NhYmxlc1tpXS5kaXNwb3NlKCk7XG4gICAgICB9XG4gICAgICB0aGlzLl9kaXNwb3NhYmxlcy5sZW5ndGggPSAwO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogUmVwcmVzZW50cyBhIGRpc3Bvc2FibGUgcmVzb3VyY2UgdGhhdCBvbmx5IGRpc3Bvc2VzIGl0cyB1bmRlcmx5aW5nIGRpc3Bvc2FibGUgcmVzb3VyY2Ugd2hlbiBhbGwgZGVwZW5kZW50IGRpc3Bvc2FibGUgb2JqZWN0cyBoYXZlIGJlZW4gZGlzcG9zZWQuXG4gICAqL1xuICB2YXIgUmVmQ291bnREaXNwb3NhYmxlID0gUnguUmVmQ291bnREaXNwb3NhYmxlID0gKGZ1bmN0aW9uICgpIHtcblxuICAgIGZ1bmN0aW9uIElubmVyRGlzcG9zYWJsZShkaXNwb3NhYmxlKSB7XG4gICAgICB0aGlzLmRpc3Bvc2FibGUgPSBkaXNwb3NhYmxlO1xuICAgICAgdGhpcy5kaXNwb3NhYmxlLmNvdW50Kys7XG4gICAgICB0aGlzLmlzSW5uZXJEaXNwb3NlZCA9IGZhbHNlO1xuICAgIH1cblxuICAgIElubmVyRGlzcG9zYWJsZS5wcm90b3R5cGUuZGlzcG9zZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICghdGhpcy5kaXNwb3NhYmxlLmlzRGlzcG9zZWQgJiYgIXRoaXMuaXNJbm5lckRpc3Bvc2VkKSB7XG4gICAgICAgIHRoaXMuaXNJbm5lckRpc3Bvc2VkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5kaXNwb3NhYmxlLmNvdW50LS07XG4gICAgICAgIGlmICh0aGlzLmRpc3Bvc2FibGUuY291bnQgPT09IDAgJiYgdGhpcy5kaXNwb3NhYmxlLmlzUHJpbWFyeURpc3Bvc2VkKSB7XG4gICAgICAgICAgdGhpcy5kaXNwb3NhYmxlLmlzRGlzcG9zZWQgPSB0cnVlO1xuICAgICAgICAgIHRoaXMuZGlzcG9zYWJsZS51bmRlcmx5aW5nRGlzcG9zYWJsZS5kaXNwb3NlKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogSW5pdGlhbGl6ZXMgYSBuZXcgaW5zdGFuY2Ugb2YgdGhlIFJlZkNvdW50RGlzcG9zYWJsZSB3aXRoIHRoZSBzcGVjaWZpZWQgZGlzcG9zYWJsZS5cbiAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgKiBAcGFyYW0ge0Rpc3Bvc2FibGV9IGRpc3Bvc2FibGUgVW5kZXJseWluZyBkaXNwb3NhYmxlLlxuICAgICAgKi9cbiAgICBmdW5jdGlvbiBSZWZDb3VudERpc3Bvc2FibGUoZGlzcG9zYWJsZSkge1xuICAgICAgdGhpcy51bmRlcmx5aW5nRGlzcG9zYWJsZSA9IGRpc3Bvc2FibGU7XG4gICAgICB0aGlzLmlzRGlzcG9zZWQgPSBmYWxzZTtcbiAgICAgIHRoaXMuaXNQcmltYXJ5RGlzcG9zZWQgPSBmYWxzZTtcbiAgICAgIHRoaXMuY291bnQgPSAwO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERpc3Bvc2VzIHRoZSB1bmRlcmx5aW5nIGRpc3Bvc2FibGUgb25seSB3aGVuIGFsbCBkZXBlbmRlbnQgZGlzcG9zYWJsZXMgaGF2ZSBiZWVuIGRpc3Bvc2VkXG4gICAgICovXG4gICAgUmVmQ291bnREaXNwb3NhYmxlLnByb3RvdHlwZS5kaXNwb3NlID0gZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKCF0aGlzLmlzRGlzcG9zZWQgJiYgIXRoaXMuaXNQcmltYXJ5RGlzcG9zZWQpIHtcbiAgICAgICAgdGhpcy5pc1ByaW1hcnlEaXNwb3NlZCA9IHRydWU7XG4gICAgICAgIGlmICh0aGlzLmNvdW50ID09PSAwKSB7XG4gICAgICAgICAgdGhpcy5pc0Rpc3Bvc2VkID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLnVuZGVybHlpbmdEaXNwb3NhYmxlLmRpc3Bvc2UoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgZGVwZW5kZW50IGRpc3Bvc2FibGUgdGhhdCB3aGVuIGRpc3Bvc2VkIGRlY3JlYXNlcyB0aGUgcmVmY291bnQgb24gdGhlIHVuZGVybHlpbmcgZGlzcG9zYWJsZS5cbiAgICAgKiBAcmV0dXJucyB7RGlzcG9zYWJsZX0gQSBkZXBlbmRlbnQgZGlzcG9zYWJsZSBjb250cmlidXRpbmcgdG8gdGhlIHJlZmVyZW5jZSBjb3VudCB0aGF0IG1hbmFnZXMgdGhlIHVuZGVybHlpbmcgZGlzcG9zYWJsZSdzIGxpZmV0aW1lLlxuICAgICAqL1xuICAgIFJlZkNvdW50RGlzcG9zYWJsZS5wcm90b3R5cGUuZ2V0RGlzcG9zYWJsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiB0aGlzLmlzRGlzcG9zZWQgPyBkaXNwb3NhYmxlRW1wdHkgOiBuZXcgSW5uZXJEaXNwb3NhYmxlKHRoaXMpO1xuICAgIH07XG5cbiAgICByZXR1cm4gUmVmQ291bnREaXNwb3NhYmxlO1xuICB9KSgpO1xuXG4gIHZhciBTY2hlZHVsZWRJdGVtID0gUnguaW50ZXJuYWxzLlNjaGVkdWxlZEl0ZW0gPSBmdW5jdGlvbiAoc2NoZWR1bGVyLCBzdGF0ZSwgYWN0aW9uLCBkdWVUaW1lLCBjb21wYXJlcikge1xuICAgIHRoaXMuc2NoZWR1bGVyID0gc2NoZWR1bGVyO1xuICAgIHRoaXMuc3RhdGUgPSBzdGF0ZTtcbiAgICB0aGlzLmFjdGlvbiA9IGFjdGlvbjtcbiAgICB0aGlzLmR1ZVRpbWUgPSBkdWVUaW1lO1xuICAgIHRoaXMuY29tcGFyZXIgPSBjb21wYXJlciB8fCBkZWZhdWx0U3ViQ29tcGFyZXI7XG4gICAgdGhpcy5kaXNwb3NhYmxlID0gbmV3IFNpbmdsZUFzc2lnbm1lbnREaXNwb3NhYmxlKCk7XG4gIH07XG5cbiAgU2NoZWR1bGVkSXRlbS5wcm90b3R5cGUuaW52b2tlID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZGlzcG9zYWJsZS5zZXREaXNwb3NhYmxlKHRoaXMuaW52b2tlQ29yZSgpKTtcbiAgfTtcblxuICBTY2hlZHVsZWRJdGVtLnByb3RvdHlwZS5jb21wYXJlVG8gPSBmdW5jdGlvbiAob3RoZXIpIHtcbiAgICByZXR1cm4gdGhpcy5jb21wYXJlcih0aGlzLmR1ZVRpbWUsIG90aGVyLmR1ZVRpbWUpO1xuICB9O1xuXG4gIFNjaGVkdWxlZEl0ZW0ucHJvdG90eXBlLmlzQ2FuY2VsbGVkID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLmRpc3Bvc2FibGUuaXNEaXNwb3NlZDtcbiAgfTtcblxuICBTY2hlZHVsZWRJdGVtLnByb3RvdHlwZS5pbnZva2VDb3JlID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBkaXNwb3NhYmxlRml4dXAodGhpcy5hY3Rpb24odGhpcy5zY2hlZHVsZXIsIHRoaXMuc3RhdGUpKTtcbiAgfTtcblxuICAvKiogUHJvdmlkZXMgYSBzZXQgb2Ygc3RhdGljIHByb3BlcnRpZXMgdG8gYWNjZXNzIGNvbW1vbmx5IHVzZWQgc2NoZWR1bGVycy4gKi9cbiAgdmFyIFNjaGVkdWxlciA9IFJ4LlNjaGVkdWxlciA9IChmdW5jdGlvbiAoKSB7XG5cbiAgICBmdW5jdGlvbiBTY2hlZHVsZXIoKSB7IH1cblxuICAgIC8qKiBEZXRlcm1pbmVzIHdoZXRoZXIgdGhlIGdpdmVuIG9iamVjdCBpcyBhIHNjaGVkdWxlciAqL1xuICAgIFNjaGVkdWxlci5pc1NjaGVkdWxlciA9IGZ1bmN0aW9uIChzKSB7XG4gICAgICByZXR1cm4gcyBpbnN0YW5jZW9mIFNjaGVkdWxlcjtcbiAgICB9O1xuXG4gICAgdmFyIHNjaGVkdWxlclByb3RvID0gU2NoZWR1bGVyLnByb3RvdHlwZTtcblxuICAgIC8qKlxuICAgKiBTY2hlZHVsZXMgYW4gYWN0aW9uIHRvIGJlIGV4ZWN1dGVkLlxuICAgKiBAcGFyYW0gc3RhdGUgU3RhdGUgcGFzc2VkIHRvIHRoZSBhY3Rpb24gdG8gYmUgZXhlY3V0ZWQuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGFjdGlvbiBBY3Rpb24gdG8gYmUgZXhlY3V0ZWQuXG4gICAqIEByZXR1cm5zIHtEaXNwb3NhYmxlfSBUaGUgZGlzcG9zYWJsZSBvYmplY3QgdXNlZCB0byBjYW5jZWwgdGhlIHNjaGVkdWxlZCBhY3Rpb24gKGJlc3QgZWZmb3J0KS5cbiAgICovXG4gICAgc2NoZWR1bGVyUHJvdG8uc2NoZWR1bGUgPSBmdW5jdGlvbiAoc3RhdGUsIGFjdGlvbikge1xuICAgICAgdGhyb3cgbmV3IE5vdEltcGxlbWVudGVkRXJyb3IoKTtcbiAgICB9O1xuXG4gIC8qKlxuICAgKiBTY2hlZHVsZXMgYW4gYWN0aW9uIHRvIGJlIGV4ZWN1dGVkIGFmdGVyIGR1ZVRpbWUuXG4gICAqIEBwYXJhbSBzdGF0ZSBTdGF0ZSBwYXNzZWQgdG8gdGhlIGFjdGlvbiB0byBiZSBleGVjdXRlZC5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gYWN0aW9uIEFjdGlvbiB0byBiZSBleGVjdXRlZC5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGR1ZVRpbWUgUmVsYXRpdmUgdGltZSBhZnRlciB3aGljaCB0byBleGVjdXRlIHRoZSBhY3Rpb24uXG4gICAqIEByZXR1cm5zIHtEaXNwb3NhYmxlfSBUaGUgZGlzcG9zYWJsZSBvYmplY3QgdXNlZCB0byBjYW5jZWwgdGhlIHNjaGVkdWxlZCBhY3Rpb24gKGJlc3QgZWZmb3J0KS5cbiAgICovXG4gICAgc2NoZWR1bGVyUHJvdG8uc2NoZWR1bGVGdXR1cmUgPSBmdW5jdGlvbiAoc3RhdGUsIGR1ZVRpbWUsIGFjdGlvbikge1xuICAgICAgdmFyIGR0ID0gZHVlVGltZTtcbiAgICAgIGR0IGluc3RhbmNlb2YgRGF0ZSAmJiAoZHQgPSBkdCAtIHRoaXMubm93KCkpO1xuICAgICAgZHQgPSBTY2hlZHVsZXIubm9ybWFsaXplKGR0KTtcblxuICAgICAgaWYgKGR0ID09PSAwKSB7IHJldHVybiB0aGlzLnNjaGVkdWxlKHN0YXRlLCBhY3Rpb24pOyB9XG5cbiAgICAgIHJldHVybiB0aGlzLl9zY2hlZHVsZUZ1dHVyZShzdGF0ZSwgZHQsIGFjdGlvbik7XG4gICAgfTtcblxuICAgIHNjaGVkdWxlclByb3RvLl9zY2hlZHVsZUZ1dHVyZSA9IGZ1bmN0aW9uIChzdGF0ZSwgZHVlVGltZSwgYWN0aW9uKSB7XG4gICAgICB0aHJvdyBuZXcgTm90SW1wbGVtZW50ZWRFcnJvcigpO1xuICAgIH07XG5cbiAgICAvKiogR2V0cyB0aGUgY3VycmVudCB0aW1lIGFjY29yZGluZyB0byB0aGUgbG9jYWwgbWFjaGluZSdzIHN5c3RlbSBjbG9jay4gKi9cbiAgICBTY2hlZHVsZXIubm93ID0gZGVmYXVsdE5vdztcblxuICAgIC8qKiBHZXRzIHRoZSBjdXJyZW50IHRpbWUgYWNjb3JkaW5nIHRvIHRoZSBsb2NhbCBtYWNoaW5lJ3Mgc3lzdGVtIGNsb2NrLiAqL1xuICAgIFNjaGVkdWxlci5wcm90b3R5cGUubm93ID0gZGVmYXVsdE5vdztcblxuICAgIC8qKlxuICAgICAqIE5vcm1hbGl6ZXMgdGhlIHNwZWNpZmllZCBUaW1lU3BhbiB2YWx1ZSB0byBhIHBvc2l0aXZlIHZhbHVlLlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB0aW1lU3BhbiBUaGUgdGltZSBzcGFuIHZhbHVlIHRvIG5vcm1hbGl6ZS5cbiAgICAgKiBAcmV0dXJucyB7TnVtYmVyfSBUaGUgc3BlY2lmaWVkIFRpbWVTcGFuIHZhbHVlIGlmIGl0IGlzIHplcm8gb3IgcG9zaXRpdmU7IG90aGVyd2lzZSwgMFxuICAgICAqL1xuICAgIFNjaGVkdWxlci5ub3JtYWxpemUgPSBmdW5jdGlvbiAodGltZVNwYW4pIHtcbiAgICAgIHRpbWVTcGFuIDwgMCAmJiAodGltZVNwYW4gPSAwKTtcbiAgICAgIHJldHVybiB0aW1lU3BhbjtcbiAgICB9O1xuXG4gICAgcmV0dXJuIFNjaGVkdWxlcjtcbiAgfSgpKTtcblxuICB2YXIgbm9ybWFsaXplVGltZSA9IFNjaGVkdWxlci5ub3JtYWxpemUsIGlzU2NoZWR1bGVyID0gU2NoZWR1bGVyLmlzU2NoZWR1bGVyO1xuXG4gIChmdW5jdGlvbiAoc2NoZWR1bGVyUHJvdG8pIHtcblxuICAgIGZ1bmN0aW9uIGludm9rZVJlY0ltbWVkaWF0ZShzY2hlZHVsZXIsIHBhaXIpIHtcbiAgICAgIHZhciBzdGF0ZSA9IHBhaXJbMF0sIGFjdGlvbiA9IHBhaXJbMV0sIGdyb3VwID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcbiAgICAgIGFjdGlvbihzdGF0ZSwgaW5uZXJBY3Rpb24pO1xuICAgICAgcmV0dXJuIGdyb3VwO1xuXG4gICAgICBmdW5jdGlvbiBpbm5lckFjdGlvbihzdGF0ZTIpIHtcbiAgICAgICAgdmFyIGlzQWRkZWQgPSBmYWxzZSwgaXNEb25lID0gZmFsc2U7XG5cbiAgICAgICAgdmFyIGQgPSBzY2hlZHVsZXIuc2NoZWR1bGUoc3RhdGUyLCBzY2hlZHVsZVdvcmspO1xuICAgICAgICBpZiAoIWlzRG9uZSkge1xuICAgICAgICAgIGdyb3VwLmFkZChkKTtcbiAgICAgICAgICBpc0FkZGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHNjaGVkdWxlV29yayhfLCBzdGF0ZTMpIHtcbiAgICAgICAgICBpZiAoaXNBZGRlZCkge1xuICAgICAgICAgICAgZ3JvdXAucmVtb3ZlKGQpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpc0RvbmUgPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBhY3Rpb24oc3RhdGUzLCBpbm5lckFjdGlvbik7XG4gICAgICAgICAgcmV0dXJuIGRpc3Bvc2FibGVFbXB0eTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGludm9rZVJlY0RhdGUoc2NoZWR1bGVyLCBwYWlyKSB7XG4gICAgICB2YXIgc3RhdGUgPSBwYWlyWzBdLCBhY3Rpb24gPSBwYWlyWzFdLCBncm91cCA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG4gICAgICBhY3Rpb24oc3RhdGUsIGlubmVyQWN0aW9uKTtcbiAgICAgIHJldHVybiBncm91cDtcblxuICAgICAgZnVuY3Rpb24gaW5uZXJBY3Rpb24oc3RhdGUyLCBkdWVUaW1lMSkge1xuICAgICAgICB2YXIgaXNBZGRlZCA9IGZhbHNlLCBpc0RvbmUgPSBmYWxzZTtcblxuICAgICAgICB2YXIgZCA9IHNjaGVkdWxlci5zY2hlZHVsZUZ1dHVyZShzdGF0ZTIsIGR1ZVRpbWUxLCBzY2hlZHVsZVdvcmspO1xuICAgICAgICBpZiAoIWlzRG9uZSkge1xuICAgICAgICAgIGdyb3VwLmFkZChkKTtcbiAgICAgICAgICBpc0FkZGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHNjaGVkdWxlV29yayhfLCBzdGF0ZTMpIHtcbiAgICAgICAgICBpZiAoaXNBZGRlZCkge1xuICAgICAgICAgICAgZ3JvdXAucmVtb3ZlKGQpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpc0RvbmUgPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBhY3Rpb24oc3RhdGUzLCBpbm5lckFjdGlvbik7XG4gICAgICAgICAgcmV0dXJuIGRpc3Bvc2FibGVFbXB0eTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNjaGVkdWxlcyBhbiBhY3Rpb24gdG8gYmUgZXhlY3V0ZWQgcmVjdXJzaXZlbHkuXG4gICAgICogQHBhcmFtIHtNaXhlZH0gc3RhdGUgU3RhdGUgcGFzc2VkIHRvIHRoZSBhY3Rpb24gdG8gYmUgZXhlY3V0ZWQuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gYWN0aW9uIEFjdGlvbiB0byBleGVjdXRlIHJlY3Vyc2l2ZWx5LiBUaGUgbGFzdCBwYXJhbWV0ZXIgcGFzc2VkIHRvIHRoZSBhY3Rpb24gaXMgdXNlZCB0byB0cmlnZ2VyIHJlY3Vyc2l2ZSBzY2hlZHVsaW5nIG9mIHRoZSBhY3Rpb24sIHBhc3NpbmcgaW4gcmVjdXJzaXZlIGludm9jYXRpb24gc3RhdGUuXG4gICAgICogQHJldHVybnMge0Rpc3Bvc2FibGV9IFRoZSBkaXNwb3NhYmxlIG9iamVjdCB1c2VkIHRvIGNhbmNlbCB0aGUgc2NoZWR1bGVkIGFjdGlvbiAoYmVzdCBlZmZvcnQpLlxuICAgICAqL1xuICAgIHNjaGVkdWxlclByb3RvLnNjaGVkdWxlUmVjdXJzaXZlID0gZnVuY3Rpb24gKHN0YXRlLCBhY3Rpb24pIHtcbiAgICAgIHJldHVybiB0aGlzLnNjaGVkdWxlKFtzdGF0ZSwgYWN0aW9uXSwgaW52b2tlUmVjSW1tZWRpYXRlKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogU2NoZWR1bGVzIGFuIGFjdGlvbiB0byBiZSBleGVjdXRlZCByZWN1cnNpdmVseSBhZnRlciBhIHNwZWNpZmllZCByZWxhdGl2ZSBvciBhYnNvbHV0ZSBkdWUgdGltZS5cbiAgICAgKiBAcGFyYW0ge01peGVkfSBzdGF0ZSBTdGF0ZSBwYXNzZWQgdG8gdGhlIGFjdGlvbiB0byBiZSBleGVjdXRlZC5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBhY3Rpb24gQWN0aW9uIHRvIGV4ZWN1dGUgcmVjdXJzaXZlbHkuIFRoZSBsYXN0IHBhcmFtZXRlciBwYXNzZWQgdG8gdGhlIGFjdGlvbiBpcyB1c2VkIHRvIHRyaWdnZXIgcmVjdXJzaXZlIHNjaGVkdWxpbmcgb2YgdGhlIGFjdGlvbiwgcGFzc2luZyBpbiB0aGUgcmVjdXJzaXZlIGR1ZSB0aW1lIGFuZCBpbnZvY2F0aW9uIHN0YXRlLlxuICAgICAqIEBwYXJhbSB7TnVtYmVyIHwgRGF0ZX0gZHVlVGltZSBSZWxhdGl2ZSBvciBhYnNvbHV0ZSB0aW1lIGFmdGVyIHdoaWNoIHRvIGV4ZWN1dGUgdGhlIGFjdGlvbiBmb3IgdGhlIGZpcnN0IHRpbWUuXG4gICAgICogQHJldHVybnMge0Rpc3Bvc2FibGV9IFRoZSBkaXNwb3NhYmxlIG9iamVjdCB1c2VkIHRvIGNhbmNlbCB0aGUgc2NoZWR1bGVkIGFjdGlvbiAoYmVzdCBlZmZvcnQpLlxuICAgICAqL1xuICAgIHNjaGVkdWxlclByb3RvLnNjaGVkdWxlUmVjdXJzaXZlRnV0dXJlID0gZnVuY3Rpb24gKHN0YXRlLCBkdWVUaW1lLCBhY3Rpb24pIHtcbiAgICAgIHJldHVybiB0aGlzLnNjaGVkdWxlRnV0dXJlKFtzdGF0ZSwgYWN0aW9uXSwgZHVlVGltZSwgaW52b2tlUmVjRGF0ZSk7XG4gICAgfTtcblxuICB9KFNjaGVkdWxlci5wcm90b3R5cGUpKTtcblxuICAoZnVuY3Rpb24gKHNjaGVkdWxlclByb3RvKSB7XG5cbiAgICAvKipcbiAgICAgKiBTY2hlZHVsZXMgYSBwZXJpb2RpYyBwaWVjZSBvZiB3b3JrIGJ5IGR5bmFtaWNhbGx5IGRpc2NvdmVyaW5nIHRoZSBzY2hlZHVsZXIncyBjYXBhYmlsaXRpZXMuIFRoZSBwZXJpb2RpYyB0YXNrIHdpbGwgYmUgc2NoZWR1bGVkIHVzaW5nIHdpbmRvdy5zZXRJbnRlcnZhbCBmb3IgdGhlIGJhc2UgaW1wbGVtZW50YXRpb24uXG4gICAgICogQHBhcmFtIHtNaXhlZH0gc3RhdGUgSW5pdGlhbCBzdGF0ZSBwYXNzZWQgdG8gdGhlIGFjdGlvbiB1cG9uIHRoZSBmaXJzdCBpdGVyYXRpb24uXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHBlcmlvZCBQZXJpb2QgZm9yIHJ1bm5pbmcgdGhlIHdvcmsgcGVyaW9kaWNhbGx5LlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGFjdGlvbiBBY3Rpb24gdG8gYmUgZXhlY3V0ZWQsIHBvdGVudGlhbGx5IHVwZGF0aW5nIHRoZSBzdGF0ZS5cbiAgICAgKiBAcmV0dXJucyB7RGlzcG9zYWJsZX0gVGhlIGRpc3Bvc2FibGUgb2JqZWN0IHVzZWQgdG8gY2FuY2VsIHRoZSBzY2hlZHVsZWQgcmVjdXJyaW5nIGFjdGlvbiAoYmVzdCBlZmZvcnQpLlxuICAgICAqL1xuICAgIHNjaGVkdWxlclByb3RvLnNjaGVkdWxlUGVyaW9kaWMgPSBmdW5jdGlvbihzdGF0ZSwgcGVyaW9kLCBhY3Rpb24pIHtcbiAgICAgIGlmICh0eXBlb2Ygcm9vdC5zZXRJbnRlcnZhbCA9PT0gJ3VuZGVmaW5lZCcpIHsgdGhyb3cgbmV3IE5vdFN1cHBvcnRlZEVycm9yKCk7IH1cbiAgICAgIHBlcmlvZCA9IG5vcm1hbGl6ZVRpbWUocGVyaW9kKTtcbiAgICAgIHZhciBzID0gc3RhdGUsIGlkID0gcm9vdC5zZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7IHMgPSBhY3Rpb24ocyk7IH0sIHBlcmlvZCk7XG4gICAgICByZXR1cm4gZGlzcG9zYWJsZUNyZWF0ZShmdW5jdGlvbiAoKSB7IHJvb3QuY2xlYXJJbnRlcnZhbChpZCk7IH0pO1xuICAgIH07XG5cbiAgfShTY2hlZHVsZXIucHJvdG90eXBlKSk7XG5cbiAgLyoqIEdldHMgYSBzY2hlZHVsZXIgdGhhdCBzY2hlZHVsZXMgd29yayBpbW1lZGlhdGVseSBvbiB0aGUgY3VycmVudCB0aHJlYWQuICovXG4gICB2YXIgSW1tZWRpYXRlU2NoZWR1bGVyID0gKGZ1bmN0aW9uIChfX3N1cGVyX18pIHtcbiAgICBpbmhlcml0cyhJbW1lZGlhdGVTY2hlZHVsZXIsIF9fc3VwZXJfXyk7XG4gICAgZnVuY3Rpb24gSW1tZWRpYXRlU2NoZWR1bGVyKCkge1xuICAgICAgX19zdXBlcl9fLmNhbGwodGhpcyk7XG4gICAgfVxuXG4gICAgSW1tZWRpYXRlU2NoZWR1bGVyLnByb3RvdHlwZS5zY2hlZHVsZSA9IGZ1bmN0aW9uIChzdGF0ZSwgYWN0aW9uKSB7XG4gICAgICByZXR1cm4gZGlzcG9zYWJsZUZpeHVwKGFjdGlvbih0aGlzLCBzdGF0ZSkpO1xuICAgIH07XG5cbiAgICByZXR1cm4gSW1tZWRpYXRlU2NoZWR1bGVyO1xuICB9KFNjaGVkdWxlcikpO1xuXG4gIHZhciBpbW1lZGlhdGVTY2hlZHVsZXIgPSBTY2hlZHVsZXIuaW1tZWRpYXRlID0gbmV3IEltbWVkaWF0ZVNjaGVkdWxlcigpO1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgc2NoZWR1bGVyIHRoYXQgc2NoZWR1bGVzIHdvcmsgYXMgc29vbiBhcyBwb3NzaWJsZSBvbiB0aGUgY3VycmVudCB0aHJlYWQuXG4gICAqL1xuICB2YXIgQ3VycmVudFRocmVhZFNjaGVkdWxlciA9IChmdW5jdGlvbiAoX19zdXBlcl9fKSB7XG4gICAgdmFyIHF1ZXVlO1xuXG4gICAgZnVuY3Rpb24gcnVuVHJhbXBvbGluZSAoKSB7XG4gICAgICB3aGlsZSAocXVldWUubGVuZ3RoID4gMCkge1xuICAgICAgICB2YXIgaXRlbSA9IHF1ZXVlLmRlcXVldWUoKTtcbiAgICAgICAgIWl0ZW0uaXNDYW5jZWxsZWQoKSAmJiBpdGVtLmludm9rZSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGluaGVyaXRzKEN1cnJlbnRUaHJlYWRTY2hlZHVsZXIsIF9fc3VwZXJfXyk7XG4gICAgZnVuY3Rpb24gQ3VycmVudFRocmVhZFNjaGVkdWxlcigpIHtcbiAgICAgIF9fc3VwZXJfXy5jYWxsKHRoaXMpO1xuICAgIH1cblxuICAgIEN1cnJlbnRUaHJlYWRTY2hlZHVsZXIucHJvdG90eXBlLnNjaGVkdWxlID0gZnVuY3Rpb24gKHN0YXRlLCBhY3Rpb24pIHtcbiAgICAgIHZhciBzaSA9IG5ldyBTY2hlZHVsZWRJdGVtKHRoaXMsIHN0YXRlLCBhY3Rpb24sIHRoaXMubm93KCkpO1xuXG4gICAgICBpZiAoIXF1ZXVlKSB7XG4gICAgICAgIHF1ZXVlID0gbmV3IFByaW9yaXR5UXVldWUoNCk7XG4gICAgICAgIHF1ZXVlLmVucXVldWUoc2kpO1xuXG4gICAgICAgIHZhciByZXN1bHQgPSB0cnlDYXRjaChydW5UcmFtcG9saW5lKSgpO1xuICAgICAgICBxdWV1ZSA9IG51bGw7XG4gICAgICAgIGlmIChyZXN1bHQgPT09IGVycm9yT2JqKSB7IHRocm93ZXIocmVzdWx0LmUpOyB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZS5lbnF1ZXVlKHNpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzaS5kaXNwb3NhYmxlO1xuICAgIH07XG5cbiAgICBDdXJyZW50VGhyZWFkU2NoZWR1bGVyLnByb3RvdHlwZS5zY2hlZHVsZVJlcXVpcmVkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gIXF1ZXVlOyB9O1xuXG4gICAgcmV0dXJuIEN1cnJlbnRUaHJlYWRTY2hlZHVsZXI7XG4gIH0oU2NoZWR1bGVyKSk7XG5cbiAgdmFyIGN1cnJlbnRUaHJlYWRTY2hlZHVsZXIgPSBTY2hlZHVsZXIuY3VycmVudFRocmVhZCA9IG5ldyBDdXJyZW50VGhyZWFkU2NoZWR1bGVyKCk7XG5cbiAgdmFyIFNjaGVkdWxlUGVyaW9kaWNSZWN1cnNpdmUgPSBSeC5pbnRlcm5hbHMuU2NoZWR1bGVQZXJpb2RpY1JlY3Vyc2l2ZSA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gY3JlYXRlVGljayhzZWxmKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gdGljayhjb21tYW5kLCByZWN1cnNlKSB7XG4gICAgICAgIHJlY3Vyc2UoMCwgc2VsZi5fcGVyaW9kKTtcbiAgICAgICAgdmFyIHN0YXRlID0gdHJ5Q2F0Y2goc2VsZi5fYWN0aW9uKShzZWxmLl9zdGF0ZSk7XG4gICAgICAgIGlmIChzdGF0ZSA9PT0gZXJyb3JPYmopIHtcbiAgICAgICAgICBzZWxmLl9jYW5jZWwuZGlzcG9zZSgpO1xuICAgICAgICAgIHRocm93ZXIoc3RhdGUuZSk7XG4gICAgICAgIH1cbiAgICAgICAgc2VsZi5fc3RhdGUgPSBzdGF0ZTtcbiAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gU2NoZWR1bGVQZXJpb2RpY1JlY3Vyc2l2ZShzY2hlZHVsZXIsIHN0YXRlLCBwZXJpb2QsIGFjdGlvbikge1xuICAgICAgdGhpcy5fc2NoZWR1bGVyID0gc2NoZWR1bGVyO1xuICAgICAgdGhpcy5fc3RhdGUgPSBzdGF0ZTtcbiAgICAgIHRoaXMuX3BlcmlvZCA9IHBlcmlvZDtcbiAgICAgIHRoaXMuX2FjdGlvbiA9IGFjdGlvbjtcbiAgICB9XG5cbiAgICBTY2hlZHVsZVBlcmlvZGljUmVjdXJzaXZlLnByb3RvdHlwZS5zdGFydCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBkID0gbmV3IFNpbmdsZUFzc2lnbm1lbnREaXNwb3NhYmxlKCk7XG4gICAgICB0aGlzLl9jYW5jZWwgPSBkO1xuICAgICAgZC5zZXREaXNwb3NhYmxlKHRoaXMuX3NjaGVkdWxlci5zY2hlZHVsZVJlY3Vyc2l2ZUZ1dHVyZSgwLCB0aGlzLl9wZXJpb2QsIGNyZWF0ZVRpY2sodGhpcykpKTtcblxuICAgICAgcmV0dXJuIGQ7XG4gICAgfTtcblxuICAgIHJldHVybiBTY2hlZHVsZVBlcmlvZGljUmVjdXJzaXZlO1xuICB9KCkpO1xuXG4gIHZhciBzY2hlZHVsZU1ldGhvZCwgY2xlYXJNZXRob2Q7XG5cbiAgdmFyIGxvY2FsVGltZXIgPSAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBsb2NhbFNldFRpbWVvdXQsIGxvY2FsQ2xlYXJUaW1lb3V0ID0gbm9vcDtcbiAgICBpZiAoISFyb290LnNldFRpbWVvdXQpIHtcbiAgICAgIGxvY2FsU2V0VGltZW91dCA9IHJvb3Quc2V0VGltZW91dDtcbiAgICAgIGxvY2FsQ2xlYXJUaW1lb3V0ID0gcm9vdC5jbGVhclRpbWVvdXQ7XG4gICAgfSBlbHNlIGlmICghIXJvb3QuV1NjcmlwdCkge1xuICAgICAgbG9jYWxTZXRUaW1lb3V0ID0gZnVuY3Rpb24gKGZuLCB0aW1lKSB7XG4gICAgICAgIHJvb3QuV1NjcmlwdC5TbGVlcCh0aW1lKTtcbiAgICAgICAgZm4oKTtcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBOb3RTdXBwb3J0ZWRFcnJvcigpO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBzZXRUaW1lb3V0OiBsb2NhbFNldFRpbWVvdXQsXG4gICAgICBjbGVhclRpbWVvdXQ6IGxvY2FsQ2xlYXJUaW1lb3V0XG4gICAgfTtcbiAgfSgpKTtcbiAgdmFyIGxvY2FsU2V0VGltZW91dCA9IGxvY2FsVGltZXIuc2V0VGltZW91dCxcbiAgICBsb2NhbENsZWFyVGltZW91dCA9IGxvY2FsVGltZXIuY2xlYXJUaW1lb3V0O1xuXG4gIChmdW5jdGlvbiAoKSB7XG5cbiAgICB2YXIgbmV4dEhhbmRsZSA9IDEsIHRhc2tzQnlIYW5kbGUgPSB7fSwgY3VycmVudGx5UnVubmluZyA9IGZhbHNlO1xuXG4gICAgY2xlYXJNZXRob2QgPSBmdW5jdGlvbiAoaGFuZGxlKSB7XG4gICAgICBkZWxldGUgdGFza3NCeUhhbmRsZVtoYW5kbGVdO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBydW5UYXNrKGhhbmRsZSkge1xuICAgICAgaWYgKGN1cnJlbnRseVJ1bm5pbmcpIHtcbiAgICAgICAgbG9jYWxTZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgcnVuVGFzayhoYW5kbGUpOyB9LCAwKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciB0YXNrID0gdGFza3NCeUhhbmRsZVtoYW5kbGVdO1xuICAgICAgICBpZiAodGFzaykge1xuICAgICAgICAgIGN1cnJlbnRseVJ1bm5pbmcgPSB0cnVlO1xuICAgICAgICAgIHZhciByZXN1bHQgPSB0cnlDYXRjaCh0YXNrKSgpO1xuICAgICAgICAgIGNsZWFyTWV0aG9kKGhhbmRsZSk7XG4gICAgICAgICAgY3VycmVudGx5UnVubmluZyA9IGZhbHNlO1xuICAgICAgICAgIGlmIChyZXN1bHQgPT09IGVycm9yT2JqKSB7IHRocm93ZXIocmVzdWx0LmUpOyB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgcmVOYXRpdmUgPSBuZXcgUmVnRXhwKCdeJyArXG4gICAgICBTdHJpbmcodG9TdHJpbmcpXG4gICAgICAgIC5yZXBsYWNlKC9bLiorP14ke30oKXxbXFxdXFxcXF0vZywgJ1xcXFwkJicpXG4gICAgICAgIC5yZXBsYWNlKC90b1N0cmluZ3wgZm9yIFteXFxdXSsvZywgJy4qPycpICsgJyQnXG4gICAgKTtcblxuICAgIHZhciBzZXRJbW1lZGlhdGUgPSB0eXBlb2YgKHNldEltbWVkaWF0ZSA9IGZyZWVHbG9iYWwgJiYgbW9kdWxlRXhwb3J0cyAmJiBmcmVlR2xvYmFsLnNldEltbWVkaWF0ZSkgPT0gJ2Z1bmN0aW9uJyAmJlxuICAgICAgIXJlTmF0aXZlLnRlc3Qoc2V0SW1tZWRpYXRlKSAmJiBzZXRJbW1lZGlhdGU7XG5cbiAgICBmdW5jdGlvbiBwb3N0TWVzc2FnZVN1cHBvcnRlZCAoKSB7XG4gICAgICAvLyBFbnN1cmUgbm90IGluIGEgd29ya2VyXG4gICAgICBpZiAoIXJvb3QucG9zdE1lc3NhZ2UgfHwgcm9vdC5pbXBvcnRTY3JpcHRzKSB7IHJldHVybiBmYWxzZTsgfVxuICAgICAgdmFyIGlzQXN5bmMgPSBmYWxzZSwgb2xkSGFuZGxlciA9IHJvb3Qub25tZXNzYWdlO1xuICAgICAgLy8gVGVzdCBmb3IgYXN5bmNcbiAgICAgIHJvb3Qub25tZXNzYWdlID0gZnVuY3Rpb24gKCkgeyBpc0FzeW5jID0gdHJ1ZTsgfTtcbiAgICAgIHJvb3QucG9zdE1lc3NhZ2UoJycsICcqJyk7XG4gICAgICByb290Lm9ubWVzc2FnZSA9IG9sZEhhbmRsZXI7XG5cbiAgICAgIHJldHVybiBpc0FzeW5jO1xuICAgIH1cblxuICAgIC8vIFVzZSBpbiBvcmRlciwgc2V0SW1tZWRpYXRlLCBuZXh0VGljaywgcG9zdE1lc3NhZ2UsIE1lc3NhZ2VDaGFubmVsLCBzY3JpcHQgcmVhZHlzdGF0ZWNoYW5nZWQsIHNldFRpbWVvdXRcbiAgICBpZiAoaXNGdW5jdGlvbihzZXRJbW1lZGlhdGUpKSB7XG4gICAgICBzY2hlZHVsZU1ldGhvZCA9IGZ1bmN0aW9uIChhY3Rpb24pIHtcbiAgICAgICAgdmFyIGlkID0gbmV4dEhhbmRsZSsrO1xuICAgICAgICB0YXNrc0J5SGFuZGxlW2lkXSA9IGFjdGlvbjtcbiAgICAgICAgc2V0SW1tZWRpYXRlKGZ1bmN0aW9uICgpIHsgcnVuVGFzayhpZCk7IH0pO1xuXG4gICAgICAgIHJldHVybiBpZDtcbiAgICAgIH07XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgJiYge30udG9TdHJpbmcuY2FsbChwcm9jZXNzKSA9PT0gJ1tvYmplY3QgcHJvY2Vzc10nKSB7XG4gICAgICBzY2hlZHVsZU1ldGhvZCA9IGZ1bmN0aW9uIChhY3Rpb24pIHtcbiAgICAgICAgdmFyIGlkID0gbmV4dEhhbmRsZSsrO1xuICAgICAgICB0YXNrc0J5SGFuZGxlW2lkXSA9IGFjdGlvbjtcbiAgICAgICAgcHJvY2Vzcy5uZXh0VGljayhmdW5jdGlvbiAoKSB7IHJ1blRhc2soaWQpOyB9KTtcblxuICAgICAgICByZXR1cm4gaWQ7XG4gICAgICB9O1xuICAgIH0gZWxzZSBpZiAocG9zdE1lc3NhZ2VTdXBwb3J0ZWQoKSkge1xuICAgICAgdmFyIE1TR19QUkVGSVggPSAnbXMucnguc2NoZWR1bGUnICsgTWF0aC5yYW5kb20oKTtcblxuICAgICAgdmFyIG9uR2xvYmFsUG9zdE1lc3NhZ2UgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgLy8gT25seSBpZiB3ZSdyZSBhIG1hdGNoIHRvIGF2b2lkIGFueSBvdGhlciBnbG9iYWwgZXZlbnRzXG4gICAgICAgIGlmICh0eXBlb2YgZXZlbnQuZGF0YSA9PT0gJ3N0cmluZycgJiYgZXZlbnQuZGF0YS5zdWJzdHJpbmcoMCwgTVNHX1BSRUZJWC5sZW5ndGgpID09PSBNU0dfUFJFRklYKSB7XG4gICAgICAgICAgcnVuVGFzayhldmVudC5kYXRhLnN1YnN0cmluZyhNU0dfUFJFRklYLmxlbmd0aCkpO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICByb290LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBvbkdsb2JhbFBvc3RNZXNzYWdlLCBmYWxzZSk7XG5cbiAgICAgIHNjaGVkdWxlTWV0aG9kID0gZnVuY3Rpb24gKGFjdGlvbikge1xuICAgICAgICB2YXIgaWQgPSBuZXh0SGFuZGxlKys7XG4gICAgICAgIHRhc2tzQnlIYW5kbGVbaWRdID0gYWN0aW9uO1xuICAgICAgICByb290LnBvc3RNZXNzYWdlKE1TR19QUkVGSVggKyBpZCwgJyonKTtcbiAgICAgICAgcmV0dXJuIGlkO1xuICAgICAgfTtcbiAgICB9IGVsc2UgaWYgKCEhcm9vdC5NZXNzYWdlQ2hhbm5lbCkge1xuICAgICAgdmFyIGNoYW5uZWwgPSBuZXcgcm9vdC5NZXNzYWdlQ2hhbm5lbCgpO1xuXG4gICAgICBjaGFubmVsLnBvcnQxLm9ubWVzc2FnZSA9IGZ1bmN0aW9uIChlKSB7IHJ1blRhc2soZS5kYXRhKTsgfTtcblxuICAgICAgc2NoZWR1bGVNZXRob2QgPSBmdW5jdGlvbiAoYWN0aW9uKSB7XG4gICAgICAgIHZhciBpZCA9IG5leHRIYW5kbGUrKztcbiAgICAgICAgdGFza3NCeUhhbmRsZVtpZF0gPSBhY3Rpb247XG4gICAgICAgIGNoYW5uZWwucG9ydDIucG9zdE1lc3NhZ2UoaWQpO1xuICAgICAgICByZXR1cm4gaWQ7XG4gICAgICB9O1xuICAgIH0gZWxzZSBpZiAoJ2RvY3VtZW50JyBpbiByb290ICYmICdvbnJlYWR5c3RhdGVjaGFuZ2UnIGluIHJvb3QuZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0JykpIHtcblxuICAgICAgc2NoZWR1bGVNZXRob2QgPSBmdW5jdGlvbiAoYWN0aW9uKSB7XG4gICAgICAgIHZhciBzY3JpcHRFbGVtZW50ID0gcm9vdC5kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcbiAgICAgICAgdmFyIGlkID0gbmV4dEhhbmRsZSsrO1xuICAgICAgICB0YXNrc0J5SGFuZGxlW2lkXSA9IGFjdGlvbjtcblxuICAgICAgICBzY3JpcHRFbGVtZW50Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBydW5UYXNrKGlkKTtcbiAgICAgICAgICBzY3JpcHRFbGVtZW50Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IG51bGw7XG4gICAgICAgICAgc2NyaXB0RWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHNjcmlwdEVsZW1lbnQpO1xuICAgICAgICAgIHNjcmlwdEVsZW1lbnQgPSBudWxsO1xuICAgICAgICB9O1xuICAgICAgICByb290LmRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5hcHBlbmRDaGlsZChzY3JpcHRFbGVtZW50KTtcbiAgICAgICAgcmV0dXJuIGlkO1xuICAgICAgfTtcblxuICAgIH0gZWxzZSB7XG4gICAgICBzY2hlZHVsZU1ldGhvZCA9IGZ1bmN0aW9uIChhY3Rpb24pIHtcbiAgICAgICAgdmFyIGlkID0gbmV4dEhhbmRsZSsrO1xuICAgICAgICB0YXNrc0J5SGFuZGxlW2lkXSA9IGFjdGlvbjtcbiAgICAgICAgbG9jYWxTZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBydW5UYXNrKGlkKTtcbiAgICAgICAgfSwgMCk7XG5cbiAgICAgICAgcmV0dXJuIGlkO1xuICAgICAgfTtcbiAgICB9XG4gIH0oKSk7XG5cbiAgLyoqXG4gICAqIEdldHMgYSBzY2hlZHVsZXIgdGhhdCBzY2hlZHVsZXMgd29yayB2aWEgYSB0aW1lZCBjYWxsYmFjayBiYXNlZCB1cG9uIHBsYXRmb3JtLlxuICAgKi9cbiAgIHZhciBEZWZhdWx0U2NoZWR1bGVyID0gKGZ1bmN0aW9uIChfX3N1cGVyX18pIHtcbiAgICAgaW5oZXJpdHMoRGVmYXVsdFNjaGVkdWxlciwgX19zdXBlcl9fKTtcbiAgICAgZnVuY3Rpb24gRGVmYXVsdFNjaGVkdWxlcigpIHtcbiAgICAgICBfX3N1cGVyX18uY2FsbCh0aGlzKTtcbiAgICAgfVxuXG4gICAgIGZ1bmN0aW9uIHNjaGVkdWxlQWN0aW9uKGRpc3Bvc2FibGUsIGFjdGlvbiwgc2NoZWR1bGVyLCBzdGF0ZSkge1xuICAgICAgIHJldHVybiBmdW5jdGlvbiBzY2hlZHVsZSgpIHtcbiAgICAgICAgIGRpc3Bvc2FibGUuc2V0RGlzcG9zYWJsZShEaXNwb3NhYmxlLl9maXh1cChhY3Rpb24oc2NoZWR1bGVyLCBzdGF0ZSkpKTtcbiAgICAgICB9O1xuICAgICB9XG5cbiAgICAgZnVuY3Rpb24gQ2xlYXJEaXNwb3NhYmxlKGlkKSB7XG4gICAgICAgdGhpcy5faWQgPSBpZDtcbiAgICAgICB0aGlzLmlzRGlzcG9zZWQgPSBmYWxzZTtcbiAgICAgfVxuXG4gICAgIENsZWFyRGlzcG9zYWJsZS5wcm90b3R5cGUuZGlzcG9zZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICBpZiAoIXRoaXMuaXNEaXNwb3NlZCkge1xuICAgICAgICAgdGhpcy5pc0Rpc3Bvc2VkID0gdHJ1ZTtcbiAgICAgICAgIGNsZWFyTWV0aG9kKHRoaXMuX2lkKTtcbiAgICAgICB9XG4gICAgIH07XG5cbiAgICAgZnVuY3Rpb24gTG9jYWxDbGVhckRpc3Bvc2FibGUoaWQpIHtcbiAgICAgICB0aGlzLl9pZCA9IGlkO1xuICAgICAgIHRoaXMuaXNEaXNwb3NlZCA9IGZhbHNlO1xuICAgICB9XG5cbiAgICAgTG9jYWxDbGVhckRpc3Bvc2FibGUucHJvdG90eXBlLmRpc3Bvc2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgaWYgKCF0aGlzLmlzRGlzcG9zZWQpIHtcbiAgICAgICAgIHRoaXMuaXNEaXNwb3NlZCA9IHRydWU7XG4gICAgICAgICBsb2NhbENsZWFyVGltZW91dCh0aGlzLl9pZCk7XG4gICAgICAgfVxuICAgICB9O1xuXG4gICAgRGVmYXVsdFNjaGVkdWxlci5wcm90b3R5cGUuc2NoZWR1bGUgPSBmdW5jdGlvbiAoc3RhdGUsIGFjdGlvbikge1xuICAgICAgdmFyIGRpc3Bvc2FibGUgPSBuZXcgU2luZ2xlQXNzaWdubWVudERpc3Bvc2FibGUoKSxcbiAgICAgICAgICBpZCA9IHNjaGVkdWxlTWV0aG9kKHNjaGVkdWxlQWN0aW9uKGRpc3Bvc2FibGUsIGFjdGlvbiwgdGhpcywgc3RhdGUpKTtcbiAgICAgIHJldHVybiBuZXcgQmluYXJ5RGlzcG9zYWJsZShkaXNwb3NhYmxlLCBuZXcgQ2xlYXJEaXNwb3NhYmxlKGlkKSk7XG4gICAgfTtcblxuICAgIERlZmF1bHRTY2hlZHVsZXIucHJvdG90eXBlLl9zY2hlZHVsZUZ1dHVyZSA9IGZ1bmN0aW9uIChzdGF0ZSwgZHVlVGltZSwgYWN0aW9uKSB7XG4gICAgICBpZiAoZHVlVGltZSA9PT0gMCkgeyByZXR1cm4gdGhpcy5zY2hlZHVsZShzdGF0ZSwgYWN0aW9uKTsgfVxuICAgICAgdmFyIGRpc3Bvc2FibGUgPSBuZXcgU2luZ2xlQXNzaWdubWVudERpc3Bvc2FibGUoKSxcbiAgICAgICAgICBpZCA9IGxvY2FsU2V0VGltZW91dChzY2hlZHVsZUFjdGlvbihkaXNwb3NhYmxlLCBhY3Rpb24sIHRoaXMsIHN0YXRlKSwgZHVlVGltZSk7XG4gICAgICByZXR1cm4gbmV3IEJpbmFyeURpc3Bvc2FibGUoZGlzcG9zYWJsZSwgbmV3IExvY2FsQ2xlYXJEaXNwb3NhYmxlKGlkKSk7XG4gICAgfTtcblxuICAgIHJldHVybiBEZWZhdWx0U2NoZWR1bGVyO1xuICB9KFNjaGVkdWxlcikpO1xuXG4gIHZhciBkZWZhdWx0U2NoZWR1bGVyID0gU2NoZWR1bGVyWydkZWZhdWx0J10gPSBTY2hlZHVsZXIuYXN5bmMgPSBuZXcgRGVmYXVsdFNjaGVkdWxlcigpO1xuXG4gIGZ1bmN0aW9uIEluZGV4ZWRJdGVtKGlkLCB2YWx1ZSkge1xuICAgIHRoaXMuaWQgPSBpZDtcbiAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gIH1cblxuICBJbmRleGVkSXRlbS5wcm90b3R5cGUuY29tcGFyZVRvID0gZnVuY3Rpb24gKG90aGVyKSB7XG4gICAgdmFyIGMgPSB0aGlzLnZhbHVlLmNvbXBhcmVUbyhvdGhlci52YWx1ZSk7XG4gICAgYyA9PT0gMCAmJiAoYyA9IHRoaXMuaWQgLSBvdGhlci5pZCk7XG4gICAgcmV0dXJuIGM7XG4gIH07XG5cbiAgdmFyIFByaW9yaXR5UXVldWUgPSBSeC5pbnRlcm5hbHMuUHJpb3JpdHlRdWV1ZSA9IGZ1bmN0aW9uIChjYXBhY2l0eSkge1xuICAgIHRoaXMuaXRlbXMgPSBuZXcgQXJyYXkoY2FwYWNpdHkpO1xuICAgIHRoaXMubGVuZ3RoID0gMDtcbiAgfTtcblxuICB2YXIgcHJpb3JpdHlQcm90byA9IFByaW9yaXR5UXVldWUucHJvdG90eXBlO1xuICBwcmlvcml0eVByb3RvLmlzSGlnaGVyUHJpb3JpdHkgPSBmdW5jdGlvbiAobGVmdCwgcmlnaHQpIHtcbiAgICByZXR1cm4gdGhpcy5pdGVtc1tsZWZ0XS5jb21wYXJlVG8odGhpcy5pdGVtc1tyaWdodF0pIDwgMDtcbiAgfTtcblxuICBwcmlvcml0eVByb3RvLnBlcmNvbGF0ZSA9IGZ1bmN0aW9uIChpbmRleCkge1xuICAgIGlmIChpbmRleCA+PSB0aGlzLmxlbmd0aCB8fCBpbmRleCA8IDApIHsgcmV0dXJuOyB9XG4gICAgdmFyIHBhcmVudCA9IGluZGV4IC0gMSA+PiAxO1xuICAgIGlmIChwYXJlbnQgPCAwIHx8IHBhcmVudCA9PT0gaW5kZXgpIHsgcmV0dXJuOyB9XG4gICAgaWYgKHRoaXMuaXNIaWdoZXJQcmlvcml0eShpbmRleCwgcGFyZW50KSkge1xuICAgICAgdmFyIHRlbXAgPSB0aGlzLml0ZW1zW2luZGV4XTtcbiAgICAgIHRoaXMuaXRlbXNbaW5kZXhdID0gdGhpcy5pdGVtc1twYXJlbnRdO1xuICAgICAgdGhpcy5pdGVtc1twYXJlbnRdID0gdGVtcDtcbiAgICAgIHRoaXMucGVyY29sYXRlKHBhcmVudCk7XG4gICAgfVxuICB9O1xuXG4gIHByaW9yaXR5UHJvdG8uaGVhcGlmeSA9IGZ1bmN0aW9uIChpbmRleCkge1xuICAgICtpbmRleCB8fCAoaW5kZXggPSAwKTtcbiAgICBpZiAoaW5kZXggPj0gdGhpcy5sZW5ndGggfHwgaW5kZXggPCAwKSB7IHJldHVybjsgfVxuICAgIHZhciBsZWZ0ID0gMiAqIGluZGV4ICsgMSxcbiAgICAgICAgcmlnaHQgPSAyICogaW5kZXggKyAyLFxuICAgICAgICBmaXJzdCA9IGluZGV4O1xuICAgIGlmIChsZWZ0IDwgdGhpcy5sZW5ndGggJiYgdGhpcy5pc0hpZ2hlclByaW9yaXR5KGxlZnQsIGZpcnN0KSkge1xuICAgICAgZmlyc3QgPSBsZWZ0O1xuICAgIH1cbiAgICBpZiAocmlnaHQgPCB0aGlzLmxlbmd0aCAmJiB0aGlzLmlzSGlnaGVyUHJpb3JpdHkocmlnaHQsIGZpcnN0KSkge1xuICAgICAgZmlyc3QgPSByaWdodDtcbiAgICB9XG4gICAgaWYgKGZpcnN0ICE9PSBpbmRleCkge1xuICAgICAgdmFyIHRlbXAgPSB0aGlzLml0ZW1zW2luZGV4XTtcbiAgICAgIHRoaXMuaXRlbXNbaW5kZXhdID0gdGhpcy5pdGVtc1tmaXJzdF07XG4gICAgICB0aGlzLml0ZW1zW2ZpcnN0XSA9IHRlbXA7XG4gICAgICB0aGlzLmhlYXBpZnkoZmlyc3QpO1xuICAgIH1cbiAgfTtcblxuICBwcmlvcml0eVByb3RvLnBlZWsgPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzLml0ZW1zWzBdLnZhbHVlOyB9O1xuXG4gIHByaW9yaXR5UHJvdG8ucmVtb3ZlQXQgPSBmdW5jdGlvbiAoaW5kZXgpIHtcbiAgICB0aGlzLml0ZW1zW2luZGV4XSA9IHRoaXMuaXRlbXNbLS10aGlzLmxlbmd0aF07XG4gICAgdGhpcy5pdGVtc1t0aGlzLmxlbmd0aF0gPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5oZWFwaWZ5KCk7XG4gIH07XG5cbiAgcHJpb3JpdHlQcm90by5kZXF1ZXVlID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciByZXN1bHQgPSB0aGlzLnBlZWsoKTtcbiAgICB0aGlzLnJlbW92ZUF0KDApO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgcHJpb3JpdHlQcm90by5lbnF1ZXVlID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICB2YXIgaW5kZXggPSB0aGlzLmxlbmd0aCsrO1xuICAgIHRoaXMuaXRlbXNbaW5kZXhdID0gbmV3IEluZGV4ZWRJdGVtKFByaW9yaXR5UXVldWUuY291bnQrKywgaXRlbSk7XG4gICAgdGhpcy5wZXJjb2xhdGUoaW5kZXgpO1xuICB9O1xuXG4gIHByaW9yaXR5UHJvdG8ucmVtb3ZlID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICh0aGlzLml0ZW1zW2ldLnZhbHVlID09PSBpdGVtKSB7XG4gICAgICAgIHRoaXMucmVtb3ZlQXQoaSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG4gIFByaW9yaXR5UXVldWUuY291bnQgPSAwO1xuXG4gIC8qKlxuICAgKiAgUmVwcmVzZW50cyBhIG5vdGlmaWNhdGlvbiB0byBhbiBvYnNlcnZlci5cbiAgICovXG4gIHZhciBOb3RpZmljYXRpb24gPSBSeC5Ob3RpZmljYXRpb24gPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIE5vdGlmaWNhdGlvbigpIHtcblxuICAgIH1cblxuICAgIE5vdGlmaWNhdGlvbi5wcm90b3R5cGUuX2FjY2VwdCA9IGZ1bmN0aW9uIChvbk5leHQsIG9uRXJyb3IsIG9uQ29tcGxldGVkKSB7XG4gICAgICB0aHJvdyBuZXcgTm90SW1wbGVtZW50ZWRFcnJvcigpO1xuICAgIH07XG5cbiAgICBOb3RpZmljYXRpb24ucHJvdG90eXBlLl9hY2NlcHRPYnNlcnZlciA9IGZ1bmN0aW9uIChvbk5leHQsIG9uRXJyb3IsIG9uQ29tcGxldGVkKSB7XG4gICAgICB0aHJvdyBuZXcgTm90SW1wbGVtZW50ZWRFcnJvcigpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBJbnZva2VzIHRoZSBkZWxlZ2F0ZSBjb3JyZXNwb25kaW5nIHRvIHRoZSBub3RpZmljYXRpb24gb3IgdGhlIG9ic2VydmVyJ3MgbWV0aG9kIGNvcnJlc3BvbmRpbmcgdG8gdGhlIG5vdGlmaWNhdGlvbiBhbmQgcmV0dXJucyB0aGUgcHJvZHVjZWQgcmVzdWx0LlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb24gfCBPYnNlcnZlcn0gb2JzZXJ2ZXJPck9uTmV4dCBGdW5jdGlvbiB0byBpbnZva2UgZm9yIGFuIE9uTmV4dCBub3RpZmljYXRpb24gb3IgT2JzZXJ2ZXIgdG8gaW52b2tlIHRoZSBub3RpZmljYXRpb24gb24uLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IG9uRXJyb3IgRnVuY3Rpb24gdG8gaW52b2tlIGZvciBhbiBPbkVycm9yIG5vdGlmaWNhdGlvbi5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBvbkNvbXBsZXRlZCBGdW5jdGlvbiB0byBpbnZva2UgZm9yIGFuIE9uQ29tcGxldGVkIG5vdGlmaWNhdGlvbi5cbiAgICAgKiBAcmV0dXJucyB7QW55fSBSZXN1bHQgcHJvZHVjZWQgYnkgdGhlIG9ic2VydmF0aW9uLlxuICAgICAqL1xuICAgIE5vdGlmaWNhdGlvbi5wcm90b3R5cGUuYWNjZXB0ID0gZnVuY3Rpb24gKG9ic2VydmVyT3JPbk5leHQsIG9uRXJyb3IsIG9uQ29tcGxldGVkKSB7XG4gICAgICByZXR1cm4gb2JzZXJ2ZXJPck9uTmV4dCAmJiB0eXBlb2Ygb2JzZXJ2ZXJPck9uTmV4dCA9PT0gJ29iamVjdCcgP1xuICAgICAgICB0aGlzLl9hY2NlcHRPYnNlcnZlcihvYnNlcnZlck9yT25OZXh0KSA6XG4gICAgICAgIHRoaXMuX2FjY2VwdChvYnNlcnZlck9yT25OZXh0LCBvbkVycm9yLCBvbkNvbXBsZXRlZCk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYW4gb2JzZXJ2YWJsZSBzZXF1ZW5jZSB3aXRoIGEgc2luZ2xlIG5vdGlmaWNhdGlvbi5cbiAgICAgKlxuICAgICAqIEBtZW1iZXJPZiBOb3RpZmljYXRpb25zXG4gICAgICogQHBhcmFtIHtTY2hlZHVsZXJ9IFtzY2hlZHVsZXJdIFNjaGVkdWxlciB0byBzZW5kIG91dCB0aGUgbm90aWZpY2F0aW9uIGNhbGxzIG9uLlxuICAgICAqIEByZXR1cm5zIHtPYnNlcnZhYmxlfSBUaGUgb2JzZXJ2YWJsZSBzZXF1ZW5jZSB0aGF0IHN1cmZhY2VzIHRoZSBiZWhhdmlvciBvZiB0aGUgbm90aWZpY2F0aW9uIHVwb24gc3Vic2NyaXB0aW9uLlxuICAgICAqL1xuICAgIE5vdGlmaWNhdGlvbi5wcm90b3R5cGUudG9PYnNlcnZhYmxlID0gZnVuY3Rpb24gKHNjaGVkdWxlcikge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgaXNTY2hlZHVsZXIoc2NoZWR1bGVyKSB8fCAoc2NoZWR1bGVyID0gaW1tZWRpYXRlU2NoZWR1bGVyKTtcbiAgICAgIHJldHVybiBuZXcgQW5vbnltb3VzT2JzZXJ2YWJsZShmdW5jdGlvbiAobykge1xuICAgICAgICByZXR1cm4gc2NoZWR1bGVyLnNjaGVkdWxlKHNlbGYsIGZ1bmN0aW9uIChfLCBub3RpZmljYXRpb24pIHtcbiAgICAgICAgICBub3RpZmljYXRpb24uX2FjY2VwdE9ic2VydmVyKG8pO1xuICAgICAgICAgIG5vdGlmaWNhdGlvbi5raW5kID09PSAnTicgJiYgby5vbkNvbXBsZXRlZCgpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICByZXR1cm4gTm90aWZpY2F0aW9uO1xuICB9KSgpO1xuXG4gIHZhciBPbk5leHROb3RpZmljYXRpb24gPSAoZnVuY3Rpb24gKF9fc3VwZXJfXykge1xuICAgIGluaGVyaXRzKE9uTmV4dE5vdGlmaWNhdGlvbiwgX19zdXBlcl9fKTtcbiAgICBmdW5jdGlvbiBPbk5leHROb3RpZmljYXRpb24odmFsdWUpIHtcbiAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgIHRoaXMua2luZCA9ICdOJztcbiAgICB9XG5cbiAgICBPbk5leHROb3RpZmljYXRpb24ucHJvdG90eXBlLl9hY2NlcHQgPSBmdW5jdGlvbiAob25OZXh0KSB7XG4gICAgICByZXR1cm4gb25OZXh0KHRoaXMudmFsdWUpO1xuICAgIH07XG5cbiAgICBPbk5leHROb3RpZmljYXRpb24ucHJvdG90eXBlLl9hY2NlcHRPYnNlcnZlciA9IGZ1bmN0aW9uIChvKSB7XG4gICAgICByZXR1cm4gby5vbk5leHQodGhpcy52YWx1ZSk7XG4gICAgfTtcblxuICAgIE9uTmV4dE5vdGlmaWNhdGlvbi5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gJ09uTmV4dCgnICsgdGhpcy52YWx1ZSArICcpJztcbiAgICB9O1xuXG4gICAgcmV0dXJuIE9uTmV4dE5vdGlmaWNhdGlvbjtcbiAgfShOb3RpZmljYXRpb24pKTtcblxuICB2YXIgT25FcnJvck5vdGlmaWNhdGlvbiA9IChmdW5jdGlvbiAoX19zdXBlcl9fKSB7XG4gICAgaW5oZXJpdHMoT25FcnJvck5vdGlmaWNhdGlvbiwgX19zdXBlcl9fKTtcbiAgICBmdW5jdGlvbiBPbkVycm9yTm90aWZpY2F0aW9uKGVycm9yKSB7XG4gICAgICB0aGlzLmVycm9yID0gZXJyb3I7XG4gICAgICB0aGlzLmtpbmQgPSAnRSc7XG4gICAgfVxuXG4gICAgT25FcnJvck5vdGlmaWNhdGlvbi5wcm90b3R5cGUuX2FjY2VwdCA9IGZ1bmN0aW9uIChvbk5leHQsIG9uRXJyb3IpIHtcbiAgICAgIHJldHVybiBvbkVycm9yKHRoaXMuZXJyb3IpO1xuICAgIH07XG5cbiAgICBPbkVycm9yTm90aWZpY2F0aW9uLnByb3RvdHlwZS5fYWNjZXB0T2JzZXJ2ZXIgPSBmdW5jdGlvbiAobykge1xuICAgICAgcmV0dXJuIG8ub25FcnJvcih0aGlzLmVycm9yKTtcbiAgICB9O1xuXG4gICAgT25FcnJvck5vdGlmaWNhdGlvbi5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gJ09uRXJyb3IoJyArIHRoaXMuZXJyb3IgKyAnKSc7XG4gICAgfTtcblxuICAgIHJldHVybiBPbkVycm9yTm90aWZpY2F0aW9uO1xuICB9KE5vdGlmaWNhdGlvbikpO1xuXG4gIHZhciBPbkNvbXBsZXRlZE5vdGlmaWNhdGlvbiA9IChmdW5jdGlvbiAoX19zdXBlcl9fKSB7XG4gICAgaW5oZXJpdHMoT25Db21wbGV0ZWROb3RpZmljYXRpb24sIF9fc3VwZXJfXyk7XG4gICAgZnVuY3Rpb24gT25Db21wbGV0ZWROb3RpZmljYXRpb24oKSB7XG4gICAgICB0aGlzLmtpbmQgPSAnQyc7XG4gICAgfVxuXG4gICAgT25Db21wbGV0ZWROb3RpZmljYXRpb24ucHJvdG90eXBlLl9hY2NlcHQgPSBmdW5jdGlvbiAob25OZXh0LCBvbkVycm9yLCBvbkNvbXBsZXRlZCkge1xuICAgICAgcmV0dXJuIG9uQ29tcGxldGVkKCk7XG4gICAgfTtcblxuICAgIE9uQ29tcGxldGVkTm90aWZpY2F0aW9uLnByb3RvdHlwZS5fYWNjZXB0T2JzZXJ2ZXIgPSBmdW5jdGlvbiAobykge1xuICAgICAgcmV0dXJuIG8ub25Db21wbGV0ZWQoKTtcbiAgICB9O1xuXG4gICAgT25Db21wbGV0ZWROb3RpZmljYXRpb24ucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuICdPbkNvbXBsZXRlZCgpJztcbiAgICB9O1xuXG4gICAgcmV0dXJuIE9uQ29tcGxldGVkTm90aWZpY2F0aW9uO1xuICB9KE5vdGlmaWNhdGlvbikpO1xuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIG9iamVjdCB0aGF0IHJlcHJlc2VudHMgYW4gT25OZXh0IG5vdGlmaWNhdGlvbiB0byBhbiBvYnNlcnZlci5cbiAgICogQHBhcmFtIHtBbnl9IHZhbHVlIFRoZSB2YWx1ZSBjb250YWluZWQgaW4gdGhlIG5vdGlmaWNhdGlvbi5cbiAgICogQHJldHVybnMge05vdGlmaWNhdGlvbn0gVGhlIE9uTmV4dCBub3RpZmljYXRpb24gY29udGFpbmluZyB0aGUgdmFsdWUuXG4gICAqL1xuICB2YXIgbm90aWZpY2F0aW9uQ3JlYXRlT25OZXh0ID0gTm90aWZpY2F0aW9uLmNyZWF0ZU9uTmV4dCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHJldHVybiBuZXcgT25OZXh0Tm90aWZpY2F0aW9uKHZhbHVlKTtcbiAgfTtcblxuICAvKipcbiAgICogQ3JlYXRlcyBhbiBvYmplY3QgdGhhdCByZXByZXNlbnRzIGFuIE9uRXJyb3Igbm90aWZpY2F0aW9uIHRvIGFuIG9ic2VydmVyLlxuICAgKiBAcGFyYW0ge0FueX0gZXJyb3IgVGhlIGV4Y2VwdGlvbiBjb250YWluZWQgaW4gdGhlIG5vdGlmaWNhdGlvbi5cbiAgICogQHJldHVybnMge05vdGlmaWNhdGlvbn0gVGhlIE9uRXJyb3Igbm90aWZpY2F0aW9uIGNvbnRhaW5pbmcgdGhlIGV4Y2VwdGlvbi5cbiAgICovXG4gIHZhciBub3RpZmljYXRpb25DcmVhdGVPbkVycm9yID0gTm90aWZpY2F0aW9uLmNyZWF0ZU9uRXJyb3IgPSBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICByZXR1cm4gbmV3IE9uRXJyb3JOb3RpZmljYXRpb24oZXJyb3IpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIG9iamVjdCB0aGF0IHJlcHJlc2VudHMgYW4gT25Db21wbGV0ZWQgbm90aWZpY2F0aW9uIHRvIGFuIG9ic2VydmVyLlxuICAgKiBAcmV0dXJucyB7Tm90aWZpY2F0aW9ufSBUaGUgT25Db21wbGV0ZWQgbm90aWZpY2F0aW9uLlxuICAgKi9cbiAgdmFyIG5vdGlmaWNhdGlvbkNyZWF0ZU9uQ29tcGxldGVkID0gTm90aWZpY2F0aW9uLmNyZWF0ZU9uQ29tcGxldGVkID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBuZXcgT25Db21wbGV0ZWROb3RpZmljYXRpb24oKTtcbiAgfTtcblxuICAvKipcbiAgICogU3VwcG9ydHMgcHVzaC1zdHlsZSBpdGVyYXRpb24gb3ZlciBhbiBvYnNlcnZhYmxlIHNlcXVlbmNlLlxuICAgKi9cbiAgdmFyIE9ic2VydmVyID0gUnguT2JzZXJ2ZXIgPSBmdW5jdGlvbiAoKSB7IH07XG5cbiAgLyoqXG4gICAqICBDcmVhdGVzIGFuIG9ic2VydmVyIGZyb20gdGhlIHNwZWNpZmllZCBPbk5leHQsIGFsb25nIHdpdGggb3B0aW9uYWwgT25FcnJvciwgYW5kIE9uQ29tcGxldGVkIGFjdGlvbnMuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IFtvbk5leHRdIE9ic2VydmVyJ3MgT25OZXh0IGFjdGlvbiBpbXBsZW1lbnRhdGlvbi5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gW29uRXJyb3JdIE9ic2VydmVyJ3MgT25FcnJvciBhY3Rpb24gaW1wbGVtZW50YXRpb24uXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IFtvbkNvbXBsZXRlZF0gT2JzZXJ2ZXIncyBPbkNvbXBsZXRlZCBhY3Rpb24gaW1wbGVtZW50YXRpb24uXG4gICAqIEByZXR1cm5zIHtPYnNlcnZlcn0gVGhlIG9ic2VydmVyIG9iamVjdCBpbXBsZW1lbnRlZCB1c2luZyB0aGUgZ2l2ZW4gYWN0aW9ucy5cbiAgICovXG4gIHZhciBvYnNlcnZlckNyZWF0ZSA9IE9ic2VydmVyLmNyZWF0ZSA9IGZ1bmN0aW9uIChvbk5leHQsIG9uRXJyb3IsIG9uQ29tcGxldGVkKSB7XG4gICAgb25OZXh0IHx8IChvbk5leHQgPSBub29wKTtcbiAgICBvbkVycm9yIHx8IChvbkVycm9yID0gZGVmYXVsdEVycm9yKTtcbiAgICBvbkNvbXBsZXRlZCB8fCAob25Db21wbGV0ZWQgPSBub29wKTtcbiAgICByZXR1cm4gbmV3IEFub255bW91c09ic2VydmVyKG9uTmV4dCwgb25FcnJvciwgb25Db21wbGV0ZWQpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBBYnN0cmFjdCBiYXNlIGNsYXNzIGZvciBpbXBsZW1lbnRhdGlvbnMgb2YgdGhlIE9ic2VydmVyIGNsYXNzLlxuICAgKiBUaGlzIGJhc2UgY2xhc3MgZW5mb3JjZXMgdGhlIGdyYW1tYXIgb2Ygb2JzZXJ2ZXJzIHdoZXJlIE9uRXJyb3IgYW5kIE9uQ29tcGxldGVkIGFyZSB0ZXJtaW5hbCBtZXNzYWdlcy5cbiAgICovXG4gIHZhciBBYnN0cmFjdE9ic2VydmVyID0gUnguaW50ZXJuYWxzLkFic3RyYWN0T2JzZXJ2ZXIgPSAoZnVuY3Rpb24gKF9fc3VwZXJfXykge1xuICAgIGluaGVyaXRzKEFic3RyYWN0T2JzZXJ2ZXIsIF9fc3VwZXJfXyk7XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgbmV3IG9ic2VydmVyIGluIGEgbm9uLXN0b3BwZWQgc3RhdGUuXG4gICAgICovXG4gICAgZnVuY3Rpb24gQWJzdHJhY3RPYnNlcnZlcigpIHtcbiAgICAgIHRoaXMuaXNTdG9wcGVkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gTXVzdCBiZSBpbXBsZW1lbnRlZCBieSBvdGhlciBvYnNlcnZlcnNcbiAgICBBYnN0cmFjdE9ic2VydmVyLnByb3RvdHlwZS5uZXh0ID0gbm90SW1wbGVtZW50ZWQ7XG4gICAgQWJzdHJhY3RPYnNlcnZlci5wcm90b3R5cGUuZXJyb3IgPSBub3RJbXBsZW1lbnRlZDtcbiAgICBBYnN0cmFjdE9ic2VydmVyLnByb3RvdHlwZS5jb21wbGV0ZWQgPSBub3RJbXBsZW1lbnRlZDtcblxuICAgIC8qKlxuICAgICAqIE5vdGlmaWVzIHRoZSBvYnNlcnZlciBvZiBhIG5ldyBlbGVtZW50IGluIHRoZSBzZXF1ZW5jZS5cbiAgICAgKiBAcGFyYW0ge0FueX0gdmFsdWUgTmV4dCBlbGVtZW50IGluIHRoZSBzZXF1ZW5jZS5cbiAgICAgKi9cbiAgICBBYnN0cmFjdE9ic2VydmVyLnByb3RvdHlwZS5vbk5leHQgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICF0aGlzLmlzU3RvcHBlZCAmJiB0aGlzLm5leHQodmFsdWUpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBOb3RpZmllcyB0aGUgb2JzZXJ2ZXIgdGhhdCBhbiBleGNlcHRpb24gaGFzIG9jY3VycmVkLlxuICAgICAqIEBwYXJhbSB7QW55fSBlcnJvciBUaGUgZXJyb3IgdGhhdCBoYXMgb2NjdXJyZWQuXG4gICAgICovXG4gICAgQWJzdHJhY3RPYnNlcnZlci5wcm90b3R5cGUub25FcnJvciA9IGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgaWYgKCF0aGlzLmlzU3RvcHBlZCkge1xuICAgICAgICB0aGlzLmlzU3RvcHBlZCA9IHRydWU7XG4gICAgICAgIHRoaXMuZXJyb3IoZXJyb3IpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBOb3RpZmllcyB0aGUgb2JzZXJ2ZXIgb2YgdGhlIGVuZCBvZiB0aGUgc2VxdWVuY2UuXG4gICAgICovXG4gICAgQWJzdHJhY3RPYnNlcnZlci5wcm90b3R5cGUub25Db21wbGV0ZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoIXRoaXMuaXNTdG9wcGVkKSB7XG4gICAgICAgIHRoaXMuaXNTdG9wcGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5jb21wbGV0ZWQoKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogRGlzcG9zZXMgdGhlIG9ic2VydmVyLCBjYXVzaW5nIGl0IHRvIHRyYW5zaXRpb24gdG8gdGhlIHN0b3BwZWQgc3RhdGUuXG4gICAgICovXG4gICAgQWJzdHJhY3RPYnNlcnZlci5wcm90b3R5cGUuZGlzcG9zZSA9IGZ1bmN0aW9uICgpIHsgdGhpcy5pc1N0b3BwZWQgPSB0cnVlOyB9O1xuXG4gICAgQWJzdHJhY3RPYnNlcnZlci5wcm90b3R5cGUuZmFpbCA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICBpZiAoIXRoaXMuaXNTdG9wcGVkKSB7XG4gICAgICAgIHRoaXMuaXNTdG9wcGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5lcnJvcihlKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIEFic3RyYWN0T2JzZXJ2ZXI7XG4gIH0oT2JzZXJ2ZXIpKTtcblxuICAvKipcbiAgICogQ2xhc3MgdG8gY3JlYXRlIGFuIE9ic2VydmVyIGluc3RhbmNlIGZyb20gZGVsZWdhdGUtYmFzZWQgaW1wbGVtZW50YXRpb25zIG9mIHRoZSBvbiogbWV0aG9kcy5cbiAgICovXG4gIHZhciBBbm9ueW1vdXNPYnNlcnZlciA9IFJ4LkFub255bW91c09ic2VydmVyID0gKGZ1bmN0aW9uIChfX3N1cGVyX18pIHtcbiAgICBpbmhlcml0cyhBbm9ueW1vdXNPYnNlcnZlciwgX19zdXBlcl9fKTtcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYW4gb2JzZXJ2ZXIgZnJvbSB0aGUgc3BlY2lmaWVkIE9uTmV4dCwgT25FcnJvciwgYW5kIE9uQ29tcGxldGVkIGFjdGlvbnMuXG4gICAgICogQHBhcmFtIHtBbnl9IG9uTmV4dCBPYnNlcnZlcidzIE9uTmV4dCBhY3Rpb24gaW1wbGVtZW50YXRpb24uXG4gICAgICogQHBhcmFtIHtBbnl9IG9uRXJyb3IgT2JzZXJ2ZXIncyBPbkVycm9yIGFjdGlvbiBpbXBsZW1lbnRhdGlvbi5cbiAgICAgKiBAcGFyYW0ge0FueX0gb25Db21wbGV0ZWQgT2JzZXJ2ZXIncyBPbkNvbXBsZXRlZCBhY3Rpb24gaW1wbGVtZW50YXRpb24uXG4gICAgICovXG4gICAgZnVuY3Rpb24gQW5vbnltb3VzT2JzZXJ2ZXIob25OZXh0LCBvbkVycm9yLCBvbkNvbXBsZXRlZCkge1xuICAgICAgX19zdXBlcl9fLmNhbGwodGhpcyk7XG4gICAgICB0aGlzLl9vbk5leHQgPSBvbk5leHQ7XG4gICAgICB0aGlzLl9vbkVycm9yID0gb25FcnJvcjtcbiAgICAgIHRoaXMuX29uQ29tcGxldGVkID0gb25Db21wbGV0ZWQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2FsbHMgdGhlIG9uTmV4dCBhY3Rpb24uXG4gICAgICogQHBhcmFtIHtBbnl9IHZhbHVlIE5leHQgZWxlbWVudCBpbiB0aGUgc2VxdWVuY2UuXG4gICAgICovXG4gICAgQW5vbnltb3VzT2JzZXJ2ZXIucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgIHRoaXMuX29uTmV4dCh2YWx1ZSk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIENhbGxzIHRoZSBvbkVycm9yIGFjdGlvbi5cbiAgICAgKiBAcGFyYW0ge0FueX0gZXJyb3IgVGhlIGVycm9yIHRoYXQgaGFzIG9jY3VycmVkLlxuICAgICAqL1xuICAgIEFub255bW91c09ic2VydmVyLnByb3RvdHlwZS5lcnJvciA9IGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgdGhpcy5fb25FcnJvcihlcnJvcik7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqICBDYWxscyB0aGUgb25Db21wbGV0ZWQgYWN0aW9uLlxuICAgICAqL1xuICAgIEFub255bW91c09ic2VydmVyLnByb3RvdHlwZS5jb21wbGV0ZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLl9vbkNvbXBsZXRlZCgpO1xuICAgIH07XG5cbiAgICByZXR1cm4gQW5vbnltb3VzT2JzZXJ2ZXI7XG4gIH0oQWJzdHJhY3RPYnNlcnZlcikpO1xuXG4gIHZhciBvYnNlcnZhYmxlUHJvdG87XG5cbiAgLyoqXG4gICAqIFJlcHJlc2VudHMgYSBwdXNoLXN0eWxlIGNvbGxlY3Rpb24uXG4gICAqL1xuICB2YXIgT2JzZXJ2YWJsZSA9IFJ4Lk9ic2VydmFibGUgPSAoZnVuY3Rpb24gKCkge1xuXG4gICAgZnVuY3Rpb24gbWFrZVN1YnNjcmliZShzZWxmLCBzdWJzY3JpYmUpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbiAobykge1xuICAgICAgICB2YXIgb2xkT25FcnJvciA9IG8ub25FcnJvcjtcbiAgICAgICAgby5vbkVycm9yID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICBtYWtlU3RhY2tUcmFjZUxvbmcoZSwgc2VsZik7XG4gICAgICAgICAgb2xkT25FcnJvci5jYWxsKG8sIGUpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBzdWJzY3JpYmUuY2FsbChzZWxmLCBvKTtcbiAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gT2JzZXJ2YWJsZSgpIHtcbiAgICAgIGlmIChSeC5jb25maWcubG9uZ1N0YWNrU3VwcG9ydCAmJiBoYXNTdGFja3MpIHtcbiAgICAgICAgdmFyIG9sZFN1YnNjcmliZSA9IHRoaXMuX3N1YnNjcmliZTtcbiAgICAgICAgdmFyIGUgPSB0cnlDYXRjaCh0aHJvd2VyKShuZXcgRXJyb3IoKSkuZTtcbiAgICAgICAgdGhpcy5zdGFjayA9IGUuc3RhY2suc3Vic3RyaW5nKGUuc3RhY2suaW5kZXhPZignXFxuJykgKyAxKTtcbiAgICAgICAgdGhpcy5fc3Vic2NyaWJlID0gbWFrZVN1YnNjcmliZSh0aGlzLCBvbGRTdWJzY3JpYmUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIG9ic2VydmFibGVQcm90byA9IE9ic2VydmFibGUucHJvdG90eXBlO1xuXG4gICAgLyoqXG4gICAgKiBEZXRlcm1pbmVzIHdoZXRoZXIgdGhlIGdpdmVuIG9iamVjdCBpcyBhbiBPYnNlcnZhYmxlXG4gICAgKiBAcGFyYW0ge0FueX0gQW4gb2JqZWN0IHRvIGRldGVybWluZSB3aGV0aGVyIGl0IGlzIGFuIE9ic2VydmFibGVcbiAgICAqIEByZXR1cm5zIHtCb29sZWFufSB0cnVlIGlmIGFuIE9ic2VydmFibGUsIGVsc2UgZmFsc2UuXG4gICAgKi9cbiAgICBPYnNlcnZhYmxlLmlzT2JzZXJ2YWJsZSA9IGZ1bmN0aW9uIChvKSB7XG4gICAgICByZXR1cm4gbyAmJiBpc0Z1bmN0aW9uKG8uc3Vic2NyaWJlKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogIFN1YnNjcmliZXMgYW4gbyB0byB0aGUgb2JzZXJ2YWJsZSBzZXF1ZW5jZS5cbiAgICAgKiAgQHBhcmFtIHtNaXhlZH0gW29Pck9uTmV4dF0gVGhlIG9iamVjdCB0aGF0IGlzIHRvIHJlY2VpdmUgbm90aWZpY2F0aW9ucyBvciBhbiBhY3Rpb24gdG8gaW52b2tlIGZvciBlYWNoIGVsZW1lbnQgaW4gdGhlIG9ic2VydmFibGUgc2VxdWVuY2UuXG4gICAgICogIEBwYXJhbSB7RnVuY3Rpb259IFtvbkVycm9yXSBBY3Rpb24gdG8gaW52b2tlIHVwb24gZXhjZXB0aW9uYWwgdGVybWluYXRpb24gb2YgdGhlIG9ic2VydmFibGUgc2VxdWVuY2UuXG4gICAgICogIEBwYXJhbSB7RnVuY3Rpb259IFtvbkNvbXBsZXRlZF0gQWN0aW9uIHRvIGludm9rZSB1cG9uIGdyYWNlZnVsIHRlcm1pbmF0aW9uIG9mIHRoZSBvYnNlcnZhYmxlIHNlcXVlbmNlLlxuICAgICAqICBAcmV0dXJucyB7RGlwb3NhYmxlfSBBIGRpc3Bvc2FibGUgaGFuZGxpbmcgdGhlIHN1YnNjcmlwdGlvbnMgYW5kIHVuc3Vic2NyaXB0aW9ucy5cbiAgICAgKi9cbiAgICBvYnNlcnZhYmxlUHJvdG8uc3Vic2NyaWJlID0gb2JzZXJ2YWJsZVByb3RvLmZvckVhY2ggPSBmdW5jdGlvbiAob09yT25OZXh0LCBvbkVycm9yLCBvbkNvbXBsZXRlZCkge1xuICAgICAgcmV0dXJuIHRoaXMuX3N1YnNjcmliZSh0eXBlb2Ygb09yT25OZXh0ID09PSAnb2JqZWN0JyA/XG4gICAgICAgIG9Pck9uTmV4dCA6XG4gICAgICAgIG9ic2VydmVyQ3JlYXRlKG9Pck9uTmV4dCwgb25FcnJvciwgb25Db21wbGV0ZWQpKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogU3Vic2NyaWJlcyB0byB0aGUgbmV4dCB2YWx1ZSBpbiB0aGUgc2VxdWVuY2Ugd2l0aCBhbiBvcHRpb25hbCBcInRoaXNcIiBhcmd1bWVudC5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBvbk5leHQgVGhlIGZ1bmN0aW9uIHRvIGludm9rZSBvbiBlYWNoIGVsZW1lbnQgaW4gdGhlIG9ic2VydmFibGUgc2VxdWVuY2UuXG4gICAgICogQHBhcmFtIHtBbnl9IFt0aGlzQXJnXSBPYmplY3QgdG8gdXNlIGFzIHRoaXMgd2hlbiBleGVjdXRpbmcgY2FsbGJhY2suXG4gICAgICogQHJldHVybnMge0Rpc3Bvc2FibGV9IEEgZGlzcG9zYWJsZSBoYW5kbGluZyB0aGUgc3Vic2NyaXB0aW9ucyBhbmQgdW5zdWJzY3JpcHRpb25zLlxuICAgICAqL1xuICAgIG9ic2VydmFibGVQcm90by5zdWJzY3JpYmVPbk5leHQgPSBmdW5jdGlvbiAob25OZXh0LCB0aGlzQXJnKSB7XG4gICAgICByZXR1cm4gdGhpcy5fc3Vic2NyaWJlKG9ic2VydmVyQ3JlYXRlKHR5cGVvZiB0aGlzQXJnICE9PSAndW5kZWZpbmVkJyA/IGZ1bmN0aW9uKHgpIHsgb25OZXh0LmNhbGwodGhpc0FyZywgeCk7IH0gOiBvbk5leHQpKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogU3Vic2NyaWJlcyB0byBhbiBleGNlcHRpb25hbCBjb25kaXRpb24gaW4gdGhlIHNlcXVlbmNlIHdpdGggYW4gb3B0aW9uYWwgXCJ0aGlzXCIgYXJndW1lbnQuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gb25FcnJvciBUaGUgZnVuY3Rpb24gdG8gaW52b2tlIHVwb24gZXhjZXB0aW9uYWwgdGVybWluYXRpb24gb2YgdGhlIG9ic2VydmFibGUgc2VxdWVuY2UuXG4gICAgICogQHBhcmFtIHtBbnl9IFt0aGlzQXJnXSBPYmplY3QgdG8gdXNlIGFzIHRoaXMgd2hlbiBleGVjdXRpbmcgY2FsbGJhY2suXG4gICAgICogQHJldHVybnMge0Rpc3Bvc2FibGV9IEEgZGlzcG9zYWJsZSBoYW5kbGluZyB0aGUgc3Vic2NyaXB0aW9ucyBhbmQgdW5zdWJzY3JpcHRpb25zLlxuICAgICAqL1xuICAgIG9ic2VydmFibGVQcm90by5zdWJzY3JpYmVPbkVycm9yID0gZnVuY3Rpb24gKG9uRXJyb3IsIHRoaXNBcmcpIHtcbiAgICAgIHJldHVybiB0aGlzLl9zdWJzY3JpYmUob2JzZXJ2ZXJDcmVhdGUobnVsbCwgdHlwZW9mIHRoaXNBcmcgIT09ICd1bmRlZmluZWQnID8gZnVuY3Rpb24oZSkgeyBvbkVycm9yLmNhbGwodGhpc0FyZywgZSk7IH0gOiBvbkVycm9yKSk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFN1YnNjcmliZXMgdG8gdGhlIG5leHQgdmFsdWUgaW4gdGhlIHNlcXVlbmNlIHdpdGggYW4gb3B0aW9uYWwgXCJ0aGlzXCIgYXJndW1lbnQuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gb25Db21wbGV0ZWQgVGhlIGZ1bmN0aW9uIHRvIGludm9rZSB1cG9uIGdyYWNlZnVsIHRlcm1pbmF0aW9uIG9mIHRoZSBvYnNlcnZhYmxlIHNlcXVlbmNlLlxuICAgICAqIEBwYXJhbSB7QW55fSBbdGhpc0FyZ10gT2JqZWN0IHRvIHVzZSBhcyB0aGlzIHdoZW4gZXhlY3V0aW5nIGNhbGxiYWNrLlxuICAgICAqIEByZXR1cm5zIHtEaXNwb3NhYmxlfSBBIGRpc3Bvc2FibGUgaGFuZGxpbmcgdGhlIHN1YnNjcmlwdGlvbnMgYW5kIHVuc3Vic2NyaXB0aW9ucy5cbiAgICAgKi9cbiAgICBvYnNlcnZhYmxlUHJvdG8uc3Vic2NyaWJlT25Db21wbGV0ZWQgPSBmdW5jdGlvbiAob25Db21wbGV0ZWQsIHRoaXNBcmcpIHtcbiAgICAgIHJldHVybiB0aGlzLl9zdWJzY3JpYmUob2JzZXJ2ZXJDcmVhdGUobnVsbCwgbnVsbCwgdHlwZW9mIHRoaXNBcmcgIT09ICd1bmRlZmluZWQnID8gZnVuY3Rpb24oKSB7IG9uQ29tcGxldGVkLmNhbGwodGhpc0FyZyk7IH0gOiBvbkNvbXBsZXRlZCkpO1xuICAgIH07XG5cbiAgICByZXR1cm4gT2JzZXJ2YWJsZTtcbiAgfSkoKTtcblxuICB2YXIgU2NoZWR1bGVkT2JzZXJ2ZXIgPSBSeC5pbnRlcm5hbHMuU2NoZWR1bGVkT2JzZXJ2ZXIgPSAoZnVuY3Rpb24gKF9fc3VwZXJfXykge1xuICAgIGluaGVyaXRzKFNjaGVkdWxlZE9ic2VydmVyLCBfX3N1cGVyX18pO1xuXG4gICAgZnVuY3Rpb24gU2NoZWR1bGVkT2JzZXJ2ZXIoc2NoZWR1bGVyLCBvYnNlcnZlcikge1xuICAgICAgX19zdXBlcl9fLmNhbGwodGhpcyk7XG4gICAgICB0aGlzLnNjaGVkdWxlciA9IHNjaGVkdWxlcjtcbiAgICAgIHRoaXMub2JzZXJ2ZXIgPSBvYnNlcnZlcjtcbiAgICAgIHRoaXMuaXNBY3F1aXJlZCA9IGZhbHNlO1xuICAgICAgdGhpcy5oYXNGYXVsdGVkID0gZmFsc2U7XG4gICAgICB0aGlzLnF1ZXVlID0gW107XG4gICAgICB0aGlzLmRpc3Bvc2FibGUgPSBuZXcgU2VyaWFsRGlzcG9zYWJsZSgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGVucXVldWVOZXh0KG9ic2VydmVyLCB4KSB7IHJldHVybiBmdW5jdGlvbiAoKSB7IG9ic2VydmVyLm9uTmV4dCh4KTsgfTsgfVxuICAgIGZ1bmN0aW9uIGVucXVldWVFcnJvcihvYnNlcnZlciwgZSkgeyByZXR1cm4gZnVuY3Rpb24gKCkgeyBvYnNlcnZlci5vbkVycm9yKGUpOyB9OyB9XG4gICAgZnVuY3Rpb24gZW5xdWV1ZUNvbXBsZXRlZChvYnNlcnZlcikgeyByZXR1cm4gZnVuY3Rpb24gKCkgeyBvYnNlcnZlci5vbkNvbXBsZXRlZCgpOyB9OyB9XG5cbiAgICBTY2hlZHVsZWRPYnNlcnZlci5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uICh4KSB7XG4gICAgICB0aGlzLnF1ZXVlLnB1c2goZW5xdWV1ZU5leHQodGhpcy5vYnNlcnZlciwgeCkpO1xuICAgIH07XG5cbiAgICBTY2hlZHVsZWRPYnNlcnZlci5wcm90b3R5cGUuZXJyb3IgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgdGhpcy5xdWV1ZS5wdXNoKGVucXVldWVFcnJvcih0aGlzLm9ic2VydmVyLCBlKSk7XG4gICAgfTtcblxuICAgIFNjaGVkdWxlZE9ic2VydmVyLnByb3RvdHlwZS5jb21wbGV0ZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLnF1ZXVlLnB1c2goZW5xdWV1ZUNvbXBsZXRlZCh0aGlzLm9ic2VydmVyKSk7XG4gICAgfTtcblxuXG4gICAgZnVuY3Rpb24gc2NoZWR1bGVNZXRob2Qoc3RhdGUsIHJlY3Vyc2UpIHtcbiAgICAgIHZhciB3b3JrO1xuICAgICAgaWYgKHN0YXRlLnF1ZXVlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgd29yayA9IHN0YXRlLnF1ZXVlLnNoaWZ0KCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdGF0ZS5pc0FjcXVpcmVkID0gZmFsc2U7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHZhciByZXMgPSB0cnlDYXRjaCh3b3JrKSgpO1xuICAgICAgaWYgKHJlcyA9PT0gZXJyb3JPYmopIHtcbiAgICAgICAgc3RhdGUucXVldWUgPSBbXTtcbiAgICAgICAgc3RhdGUuaGFzRmF1bHRlZCA9IHRydWU7XG4gICAgICAgIHJldHVybiB0aHJvd2VyKHJlcy5lKTtcbiAgICAgIH1cbiAgICAgIHJlY3Vyc2Uoc3RhdGUpO1xuICAgIH1cblxuICAgIFNjaGVkdWxlZE9ic2VydmVyLnByb3RvdHlwZS5lbnN1cmVBY3RpdmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgaXNPd25lciA9IGZhbHNlO1xuICAgICAgaWYgKCF0aGlzLmhhc0ZhdWx0ZWQgJiYgdGhpcy5xdWV1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgIGlzT3duZXIgPSAhdGhpcy5pc0FjcXVpcmVkO1xuICAgICAgICB0aGlzLmlzQWNxdWlyZWQgPSB0cnVlO1xuICAgICAgfVxuICAgICAgaXNPd25lciAmJlxuICAgICAgICB0aGlzLmRpc3Bvc2FibGUuc2V0RGlzcG9zYWJsZSh0aGlzLnNjaGVkdWxlci5zY2hlZHVsZVJlY3Vyc2l2ZSh0aGlzLCBzY2hlZHVsZU1ldGhvZCkpO1xuICAgIH07XG5cbiAgICBTY2hlZHVsZWRPYnNlcnZlci5wcm90b3R5cGUuZGlzcG9zZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIF9fc3VwZXJfXy5wcm90b3R5cGUuZGlzcG9zZS5jYWxsKHRoaXMpO1xuICAgICAgdGhpcy5kaXNwb3NhYmxlLmRpc3Bvc2UoKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIFNjaGVkdWxlZE9ic2VydmVyO1xuICB9KEFic3RyYWN0T2JzZXJ2ZXIpKTtcblxuICB2YXIgT2JzZXJ2YWJsZUJhc2UgPSBSeC5PYnNlcnZhYmxlQmFzZSA9IChmdW5jdGlvbiAoX19zdXBlcl9fKSB7XG4gICAgaW5oZXJpdHMoT2JzZXJ2YWJsZUJhc2UsIF9fc3VwZXJfXyk7XG5cbiAgICBmdW5jdGlvbiBmaXhTdWJzY3JpYmVyKHN1YnNjcmliZXIpIHtcbiAgICAgIHJldHVybiBzdWJzY3JpYmVyICYmIGlzRnVuY3Rpb24oc3Vic2NyaWJlci5kaXNwb3NlKSA/IHN1YnNjcmliZXIgOlxuICAgICAgICBpc0Z1bmN0aW9uKHN1YnNjcmliZXIpID8gZGlzcG9zYWJsZUNyZWF0ZShzdWJzY3JpYmVyKSA6IGRpc3Bvc2FibGVFbXB0eTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZXREaXNwb3NhYmxlKHMsIHN0YXRlKSB7XG4gICAgICB2YXIgYWRvID0gc3RhdGVbMF0sIHNlbGYgPSBzdGF0ZVsxXTtcbiAgICAgIHZhciBzdWIgPSB0cnlDYXRjaChzZWxmLnN1YnNjcmliZUNvcmUpLmNhbGwoc2VsZiwgYWRvKTtcbiAgICAgIGlmIChzdWIgPT09IGVycm9yT2JqICYmICFhZG8uZmFpbChlcnJvck9iai5lKSkgeyB0aHJvd2VyKGVycm9yT2JqLmUpOyB9XG4gICAgICBhZG8uc2V0RGlzcG9zYWJsZShmaXhTdWJzY3JpYmVyKHN1YikpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIE9ic2VydmFibGVCYXNlKCkge1xuICAgICAgX19zdXBlcl9fLmNhbGwodGhpcyk7XG4gICAgfVxuXG4gICAgT2JzZXJ2YWJsZUJhc2UucHJvdG90eXBlLl9zdWJzY3JpYmUgPSBmdW5jdGlvbiAobykge1xuICAgICAgdmFyIGFkbyA9IG5ldyBBdXRvRGV0YWNoT2JzZXJ2ZXIobyksIHN0YXRlID0gW2FkbywgdGhpc107XG5cbiAgICAgIGlmIChjdXJyZW50VGhyZWFkU2NoZWR1bGVyLnNjaGVkdWxlUmVxdWlyZWQoKSkge1xuICAgICAgICBjdXJyZW50VGhyZWFkU2NoZWR1bGVyLnNjaGVkdWxlKHN0YXRlLCBzZXREaXNwb3NhYmxlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNldERpc3Bvc2FibGUobnVsbCwgc3RhdGUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGFkbztcbiAgICB9O1xuXG4gICAgT2JzZXJ2YWJsZUJhc2UucHJvdG90eXBlLnN1YnNjcmliZUNvcmUgPSBub3RJbXBsZW1lbnRlZDtcblxuICAgIHJldHVybiBPYnNlcnZhYmxlQmFzZTtcbiAgfShPYnNlcnZhYmxlKSk7XG5cbnZhciBGbGF0TWFwT2JzZXJ2YWJsZSA9IFJ4LkZsYXRNYXBPYnNlcnZhYmxlID0gKGZ1bmN0aW9uKF9fc3VwZXJfXykge1xuXG4gICAgaW5oZXJpdHMoRmxhdE1hcE9ic2VydmFibGUsIF9fc3VwZXJfXyk7XG5cbiAgICBmdW5jdGlvbiBGbGF0TWFwT2JzZXJ2YWJsZShzb3VyY2UsIHNlbGVjdG9yLCByZXN1bHRTZWxlY3RvciwgdGhpc0FyZykge1xuICAgICAgdGhpcy5yZXN1bHRTZWxlY3RvciA9IGlzRnVuY3Rpb24ocmVzdWx0U2VsZWN0b3IpID8gcmVzdWx0U2VsZWN0b3IgOiBudWxsO1xuICAgICAgdGhpcy5zZWxlY3RvciA9IGJpbmRDYWxsYmFjayhpc0Z1bmN0aW9uKHNlbGVjdG9yKSA/IHNlbGVjdG9yIDogZnVuY3Rpb24oKSB7IHJldHVybiBzZWxlY3RvcjsgfSwgdGhpc0FyZywgMyk7XG4gICAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcbiAgICAgIF9fc3VwZXJfXy5jYWxsKHRoaXMpO1xuICAgIH1cblxuICAgIEZsYXRNYXBPYnNlcnZhYmxlLnByb3RvdHlwZS5zdWJzY3JpYmVDb3JlID0gZnVuY3Rpb24obykge1xuICAgICAgcmV0dXJuIHRoaXMuc291cmNlLnN1YnNjcmliZShuZXcgSW5uZXJPYnNlcnZlcihvLCB0aGlzLnNlbGVjdG9yLCB0aGlzLnJlc3VsdFNlbGVjdG9yLCB0aGlzKSk7XG4gICAgfTtcblxuICAgIGluaGVyaXRzKElubmVyT2JzZXJ2ZXIsIEFic3RyYWN0T2JzZXJ2ZXIpO1xuICAgIGZ1bmN0aW9uIElubmVyT2JzZXJ2ZXIob2JzZXJ2ZXIsIHNlbGVjdG9yLCByZXN1bHRTZWxlY3Rvciwgc291cmNlKSB7XG4gICAgICB0aGlzLmkgPSAwO1xuICAgICAgdGhpcy5zZWxlY3RvciA9IHNlbGVjdG9yO1xuICAgICAgdGhpcy5yZXN1bHRTZWxlY3RvciA9IHJlc3VsdFNlbGVjdG9yO1xuICAgICAgdGhpcy5zb3VyY2UgPSBzb3VyY2U7XG4gICAgICB0aGlzLm8gPSBvYnNlcnZlcjtcbiAgICAgIEFic3RyYWN0T2JzZXJ2ZXIuY2FsbCh0aGlzKTtcbiAgICB9XG5cbiAgICBJbm5lck9ic2VydmVyLnByb3RvdHlwZS5fd3JhcFJlc3VsdCA9IGZ1bmN0aW9uKHJlc3VsdCwgeCwgaSkge1xuICAgICAgcmV0dXJuIHRoaXMucmVzdWx0U2VsZWN0b3IgP1xuICAgICAgICByZXN1bHQubWFwKGZ1bmN0aW9uKHksIGkyKSB7IHJldHVybiB0aGlzLnJlc3VsdFNlbGVjdG9yKHgsIHksIGksIGkyKTsgfSwgdGhpcykgOlxuICAgICAgICByZXN1bHQ7XG4gICAgfTtcblxuICAgIElubmVyT2JzZXJ2ZXIucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbih4KSB7XG4gICAgICB2YXIgaSA9IHRoaXMuaSsrO1xuICAgICAgdmFyIHJlc3VsdCA9IHRyeUNhdGNoKHRoaXMuc2VsZWN0b3IpKHgsIGksIHRoaXMuc291cmNlKTtcbiAgICAgIGlmIChyZXN1bHQgPT09IGVycm9yT2JqKSB7IHJldHVybiB0aGlzLm8ub25FcnJvcihyZXN1bHQuZSk7IH1cblxuICAgICAgaXNQcm9taXNlKHJlc3VsdCkgJiYgKHJlc3VsdCA9IG9ic2VydmFibGVGcm9tUHJvbWlzZShyZXN1bHQpKTtcbiAgICAgIChpc0FycmF5TGlrZShyZXN1bHQpIHx8IGlzSXRlcmFibGUocmVzdWx0KSkgJiYgKHJlc3VsdCA9IE9ic2VydmFibGUuZnJvbShyZXN1bHQpKTtcbiAgICAgIHRoaXMuby5vbk5leHQodGhpcy5fd3JhcFJlc3VsdChyZXN1bHQsIHgsIGkpKTtcbiAgICB9O1xuXG4gICAgSW5uZXJPYnNlcnZlci5wcm90b3R5cGUuZXJyb3IgPSBmdW5jdGlvbihlKSB7IHRoaXMuby5vbkVycm9yKGUpOyB9O1xuXG4gICAgSW5uZXJPYnNlcnZlci5wcm90b3R5cGUuY29tcGxldGVkID0gZnVuY3Rpb24oKSB7IHRoaXMuby5vbkNvbXBsZXRlZCgpOyB9O1xuXG4gICAgcmV0dXJuIEZsYXRNYXBPYnNlcnZhYmxlO1xuXG59KE9ic2VydmFibGVCYXNlKSk7XG5cbiAgdmFyIEVudW1lcmFibGUgPSBSeC5pbnRlcm5hbHMuRW51bWVyYWJsZSA9IGZ1bmN0aW9uICgpIHsgfTtcblxuICBmdW5jdGlvbiBJc0Rpc3Bvc2VkRGlzcG9zYWJsZShzdGF0ZSkge1xuICAgIHRoaXMuX3MgPSBzdGF0ZTtcbiAgICB0aGlzLmlzRGlzcG9zZWQgPSBmYWxzZTtcbiAgfVxuXG4gIElzRGlzcG9zZWREaXNwb3NhYmxlLnByb3RvdHlwZS5kaXNwb3NlID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICghdGhpcy5pc0Rpc3Bvc2VkKSB7XG4gICAgICB0aGlzLmlzRGlzcG9zZWQgPSB0cnVlO1xuICAgICAgdGhpcy5fcy5pc0Rpc3Bvc2VkID0gdHJ1ZTtcbiAgICB9XG4gIH07XG5cbiAgdmFyIENvbmNhdEVudW1lcmFibGVPYnNlcnZhYmxlID0gKGZ1bmN0aW9uKF9fc3VwZXJfXykge1xuICAgIGluaGVyaXRzKENvbmNhdEVudW1lcmFibGVPYnNlcnZhYmxlLCBfX3N1cGVyX18pO1xuICAgIGZ1bmN0aW9uIENvbmNhdEVudW1lcmFibGVPYnNlcnZhYmxlKHNvdXJjZXMpIHtcbiAgICAgIHRoaXMuc291cmNlcyA9IHNvdXJjZXM7XG4gICAgICBfX3N1cGVyX18uY2FsbCh0aGlzKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzY2hlZHVsZU1ldGhvZChzdGF0ZSwgcmVjdXJzZSkge1xuICAgICAgaWYgKHN0YXRlLmlzRGlzcG9zZWQpIHsgcmV0dXJuOyB9XG4gICAgICB2YXIgY3VycmVudEl0ZW0gPSB0cnlDYXRjaChzdGF0ZS5lLm5leHQpLmNhbGwoc3RhdGUuZSk7XG4gICAgICBpZiAoY3VycmVudEl0ZW0gPT09IGVycm9yT2JqKSB7IHJldHVybiBzdGF0ZS5vLm9uRXJyb3IoY3VycmVudEl0ZW0uZSk7IH1cbiAgICAgIGlmIChjdXJyZW50SXRlbS5kb25lKSB7IHJldHVybiBzdGF0ZS5vLm9uQ29tcGxldGVkKCk7IH1cblxuICAgICAgLy8gQ2hlY2sgaWYgcHJvbWlzZVxuICAgICAgdmFyIGN1cnJlbnRWYWx1ZSA9IGN1cnJlbnRJdGVtLnZhbHVlO1xuICAgICAgaXNQcm9taXNlKGN1cnJlbnRWYWx1ZSkgJiYgKGN1cnJlbnRWYWx1ZSA9IG9ic2VydmFibGVGcm9tUHJvbWlzZShjdXJyZW50VmFsdWUpKTtcblxuICAgICAgdmFyIGQgPSBuZXcgU2luZ2xlQXNzaWdubWVudERpc3Bvc2FibGUoKTtcbiAgICAgIHN0YXRlLnN1YnNjcmlwdGlvbi5zZXREaXNwb3NhYmxlKGQpO1xuICAgICAgZC5zZXREaXNwb3NhYmxlKGN1cnJlbnRWYWx1ZS5zdWJzY3JpYmUobmV3IElubmVyT2JzZXJ2ZXIoc3RhdGUsIHJlY3Vyc2UpKSk7XG4gICAgfVxuXG4gICAgQ29uY2F0RW51bWVyYWJsZU9ic2VydmFibGUucHJvdG90eXBlLnN1YnNjcmliZUNvcmUgPSBmdW5jdGlvbiAobykge1xuICAgICAgdmFyIHN1YnNjcmlwdGlvbiA9IG5ldyBTZXJpYWxEaXNwb3NhYmxlKCk7XG4gICAgICB2YXIgc3RhdGUgPSB7XG4gICAgICAgIGlzRGlzcG9zZWQ6IGZhbHNlLFxuICAgICAgICBvOiBvLFxuICAgICAgICBzdWJzY3JpcHRpb246IHN1YnNjcmlwdGlvbixcbiAgICAgICAgZTogdGhpcy5zb3VyY2VzWyRpdGVyYXRvciRdKClcbiAgICAgIH07XG5cbiAgICAgIHZhciBjYW5jZWxhYmxlID0gY3VycmVudFRocmVhZFNjaGVkdWxlci5zY2hlZHVsZVJlY3Vyc2l2ZShzdGF0ZSwgc2NoZWR1bGVNZXRob2QpO1xuICAgICAgcmV0dXJuIG5ldyBOQXJ5RGlzcG9zYWJsZShbc3Vic2NyaXB0aW9uLCBjYW5jZWxhYmxlLCBuZXcgSXNEaXNwb3NlZERpc3Bvc2FibGUoc3RhdGUpXSk7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIElubmVyT2JzZXJ2ZXIoc3RhdGUsIHJlY3Vyc2UpIHtcbiAgICAgIHRoaXMuX3N0YXRlID0gc3RhdGU7XG4gICAgICB0aGlzLl9yZWN1cnNlID0gcmVjdXJzZTtcbiAgICAgIEFic3RyYWN0T2JzZXJ2ZXIuY2FsbCh0aGlzKTtcbiAgICB9XG5cbiAgICBpbmhlcml0cyhJbm5lck9ic2VydmVyLCBBYnN0cmFjdE9ic2VydmVyKTtcblxuICAgIElubmVyT2JzZXJ2ZXIucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbiAoeCkgeyB0aGlzLl9zdGF0ZS5vLm9uTmV4dCh4KTsgfTtcbiAgICBJbm5lck9ic2VydmVyLnByb3RvdHlwZS5lcnJvciA9IGZ1bmN0aW9uIChlKSB7IHRoaXMuX3N0YXRlLm8ub25FcnJvcihlKTsgfTtcbiAgICBJbm5lck9ic2VydmVyLnByb3RvdHlwZS5jb21wbGV0ZWQgPSBmdW5jdGlvbiAoKSB7IHRoaXMuX3JlY3Vyc2UodGhpcy5fc3RhdGUpOyB9O1xuXG4gICAgcmV0dXJuIENvbmNhdEVudW1lcmFibGVPYnNlcnZhYmxlO1xuICB9KE9ic2VydmFibGVCYXNlKSk7XG5cbiAgRW51bWVyYWJsZS5wcm90b3R5cGUuY29uY2F0ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBuZXcgQ29uY2F0RW51bWVyYWJsZU9ic2VydmFibGUodGhpcyk7XG4gIH07XG5cbiAgdmFyIENhdGNoRXJyb3JPYnNlcnZhYmxlID0gKGZ1bmN0aW9uKF9fc3VwZXJfXykge1xuICAgIGZ1bmN0aW9uIENhdGNoRXJyb3JPYnNlcnZhYmxlKHNvdXJjZXMpIHtcbiAgICAgIHRoaXMuc291cmNlcyA9IHNvdXJjZXM7XG4gICAgICBfX3N1cGVyX18uY2FsbCh0aGlzKTtcbiAgICB9XG5cbiAgICBpbmhlcml0cyhDYXRjaEVycm9yT2JzZXJ2YWJsZSwgX19zdXBlcl9fKTtcblxuICAgIGZ1bmN0aW9uIHNjaGVkdWxlTWV0aG9kKHN0YXRlLCByZWN1cnNlKSB7XG4gICAgICBpZiAoc3RhdGUuaXNEaXNwb3NlZCkgeyByZXR1cm47IH1cbiAgICAgIHZhciBjdXJyZW50SXRlbSA9IHRyeUNhdGNoKHN0YXRlLmUubmV4dCkuY2FsbChzdGF0ZS5lKTtcbiAgICAgIGlmIChjdXJyZW50SXRlbSA9PT0gZXJyb3JPYmopIHsgcmV0dXJuIHN0YXRlLm8ub25FcnJvcihjdXJyZW50SXRlbS5lKTsgfVxuICAgICAgaWYgKGN1cnJlbnRJdGVtLmRvbmUpIHsgcmV0dXJuIHN0YXRlLmxhc3RFcnJvciAhPT0gbnVsbCA/IHN0YXRlLm8ub25FcnJvcihzdGF0ZS5sYXN0RXJyb3IpIDogc3RhdGUuby5vbkNvbXBsZXRlZCgpOyB9XG5cbiAgICAgIHZhciBjdXJyZW50VmFsdWUgPSBjdXJyZW50SXRlbS52YWx1ZTtcbiAgICAgIGlzUHJvbWlzZShjdXJyZW50VmFsdWUpICYmIChjdXJyZW50VmFsdWUgPSBvYnNlcnZhYmxlRnJvbVByb21pc2UoY3VycmVudFZhbHVlKSk7XG5cbiAgICAgIHZhciBkID0gbmV3IFNpbmdsZUFzc2lnbm1lbnREaXNwb3NhYmxlKCk7XG4gICAgICBzdGF0ZS5zdWJzY3JpcHRpb24uc2V0RGlzcG9zYWJsZShkKTtcbiAgICAgIGQuc2V0RGlzcG9zYWJsZShjdXJyZW50VmFsdWUuc3Vic2NyaWJlKG5ldyBJbm5lck9ic2VydmVyKHN0YXRlLCByZWN1cnNlKSkpO1xuICAgIH1cblxuICAgIENhdGNoRXJyb3JPYnNlcnZhYmxlLnByb3RvdHlwZS5zdWJzY3JpYmVDb3JlID0gZnVuY3Rpb24gKG8pIHtcbiAgICAgIHZhciBzdWJzY3JpcHRpb24gPSBuZXcgU2VyaWFsRGlzcG9zYWJsZSgpO1xuICAgICAgdmFyIHN0YXRlID0ge1xuICAgICAgICBpc0Rpc3Bvc2VkOiBmYWxzZSxcbiAgICAgICAgZTogdGhpcy5zb3VyY2VzWyRpdGVyYXRvciRdKCksXG4gICAgICAgIHN1YnNjcmlwdGlvbjogc3Vic2NyaXB0aW9uLFxuICAgICAgICBsYXN0RXJyb3I6IG51bGwsXG4gICAgICAgIG86IG9cbiAgICAgIH07XG5cbiAgICAgIHZhciBjYW5jZWxhYmxlID0gY3VycmVudFRocmVhZFNjaGVkdWxlci5zY2hlZHVsZVJlY3Vyc2l2ZShzdGF0ZSwgc2NoZWR1bGVNZXRob2QpO1xuICAgICAgcmV0dXJuIG5ldyBOQXJ5RGlzcG9zYWJsZShbc3Vic2NyaXB0aW9uLCBjYW5jZWxhYmxlLCBuZXcgSXNEaXNwb3NlZERpc3Bvc2FibGUoc3RhdGUpXSk7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIElubmVyT2JzZXJ2ZXIoc3RhdGUsIHJlY3Vyc2UpIHtcbiAgICAgIHRoaXMuX3N0YXRlID0gc3RhdGU7XG4gICAgICB0aGlzLl9yZWN1cnNlID0gcmVjdXJzZTtcbiAgICAgIEFic3RyYWN0T2JzZXJ2ZXIuY2FsbCh0aGlzKTtcbiAgICB9XG5cbiAgICBpbmhlcml0cyhJbm5lck9ic2VydmVyLCBBYnN0cmFjdE9ic2VydmVyKTtcblxuICAgIElubmVyT2JzZXJ2ZXIucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbiAoeCkgeyB0aGlzLl9zdGF0ZS5vLm9uTmV4dCh4KTsgfTtcbiAgICBJbm5lck9ic2VydmVyLnByb3RvdHlwZS5lcnJvciA9IGZ1bmN0aW9uIChlKSB7IHRoaXMuX3N0YXRlLmxhc3RFcnJvciA9IGU7IHRoaXMuX3JlY3Vyc2UodGhpcy5fc3RhdGUpOyB9O1xuICAgIElubmVyT2JzZXJ2ZXIucHJvdG90eXBlLmNvbXBsZXRlZCA9IGZ1bmN0aW9uICgpIHsgdGhpcy5fc3RhdGUuby5vbkNvbXBsZXRlZCgpOyB9O1xuXG4gICAgcmV0dXJuIENhdGNoRXJyb3JPYnNlcnZhYmxlO1xuICB9KE9ic2VydmFibGVCYXNlKSk7XG5cbiAgRW51bWVyYWJsZS5wcm90b3R5cGUuY2F0Y2hFcnJvciA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gbmV3IENhdGNoRXJyb3JPYnNlcnZhYmxlKHRoaXMpO1xuICB9O1xuXG4gIHZhciBSZXBlYXRFbnVtZXJhYmxlID0gKGZ1bmN0aW9uIChfX3N1cGVyX18pIHtcbiAgICBpbmhlcml0cyhSZXBlYXRFbnVtZXJhYmxlLCBfX3N1cGVyX18pO1xuICAgIGZ1bmN0aW9uIFJlcGVhdEVudW1lcmFibGUodiwgYykge1xuICAgICAgdGhpcy52ID0gdjtcbiAgICAgIHRoaXMuYyA9IGMgPT0gbnVsbCA/IC0xIDogYztcbiAgICB9XG5cbiAgICBSZXBlYXRFbnVtZXJhYmxlLnByb3RvdHlwZVskaXRlcmF0b3IkXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBuZXcgUmVwZWF0RW51bWVyYXRvcih0aGlzKTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gUmVwZWF0RW51bWVyYXRvcihwKSB7XG4gICAgICB0aGlzLnYgPSBwLnY7XG4gICAgICB0aGlzLmwgPSBwLmM7XG4gICAgfVxuXG4gICAgUmVwZWF0RW51bWVyYXRvci5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICh0aGlzLmwgPT09IDApIHsgcmV0dXJuIGRvbmVFbnVtZXJhdG9yOyB9XG4gICAgICBpZiAodGhpcy5sID4gMCkgeyB0aGlzLmwtLTsgfVxuICAgICAgcmV0dXJuIHsgZG9uZTogZmFsc2UsIHZhbHVlOiB0aGlzLnYgfTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIFJlcGVhdEVudW1lcmFibGU7XG4gIH0oRW51bWVyYWJsZSkpO1xuXG4gIHZhciBlbnVtZXJhYmxlUmVwZWF0ID0gRW51bWVyYWJsZS5yZXBlYXQgPSBmdW5jdGlvbiAodmFsdWUsIHJlcGVhdENvdW50KSB7XG4gICAgcmV0dXJuIG5ldyBSZXBlYXRFbnVtZXJhYmxlKHZhbHVlLCByZXBlYXRDb3VudCk7XG4gIH07XG5cbiAgdmFyIE9mRW51bWVyYWJsZSA9IChmdW5jdGlvbihfX3N1cGVyX18pIHtcbiAgICBpbmhlcml0cyhPZkVudW1lcmFibGUsIF9fc3VwZXJfXyk7XG4gICAgZnVuY3Rpb24gT2ZFbnVtZXJhYmxlKHMsIGZuLCB0aGlzQXJnKSB7XG4gICAgICB0aGlzLnMgPSBzO1xuICAgICAgdGhpcy5mbiA9IGZuID8gYmluZENhbGxiYWNrKGZuLCB0aGlzQXJnLCAzKSA6IG51bGw7XG4gICAgfVxuICAgIE9mRW51bWVyYWJsZS5wcm90b3R5cGVbJGl0ZXJhdG9yJF0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gbmV3IE9mRW51bWVyYXRvcih0aGlzKTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gT2ZFbnVtZXJhdG9yKHApIHtcbiAgICAgIHRoaXMuaSA9IC0xO1xuICAgICAgdGhpcy5zID0gcC5zO1xuICAgICAgdGhpcy5sID0gdGhpcy5zLmxlbmd0aDtcbiAgICAgIHRoaXMuZm4gPSBwLmZuO1xuICAgIH1cblxuICAgIE9mRW51bWVyYXRvci5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgcmV0dXJuICsrdGhpcy5pIDwgdGhpcy5sID9cbiAgICAgICB7IGRvbmU6IGZhbHNlLCB2YWx1ZTogIXRoaXMuZm4gPyB0aGlzLnNbdGhpcy5pXSA6IHRoaXMuZm4odGhpcy5zW3RoaXMuaV0sIHRoaXMuaSwgdGhpcy5zKSB9IDpcbiAgICAgICBkb25lRW51bWVyYXRvcjtcbiAgICB9O1xuXG4gICAgcmV0dXJuIE9mRW51bWVyYWJsZTtcbiAgfShFbnVtZXJhYmxlKSk7XG5cbiAgdmFyIGVudW1lcmFibGVPZiA9IEVudW1lcmFibGUub2YgPSBmdW5jdGlvbiAoc291cmNlLCBzZWxlY3RvciwgdGhpc0FyZykge1xuICAgIHJldHVybiBuZXcgT2ZFbnVtZXJhYmxlKHNvdXJjZSwgc2VsZWN0b3IsIHRoaXNBcmcpO1xuICB9O1xuXG4gIHZhciBUb0FycmF5T2JzZXJ2YWJsZSA9IChmdW5jdGlvbihfX3N1cGVyX18pIHtcbiAgICBpbmhlcml0cyhUb0FycmF5T2JzZXJ2YWJsZSwgX19zdXBlcl9fKTtcbiAgICBmdW5jdGlvbiBUb0FycmF5T2JzZXJ2YWJsZShzb3VyY2UpIHtcbiAgICAgIHRoaXMuc291cmNlID0gc291cmNlO1xuICAgICAgX19zdXBlcl9fLmNhbGwodGhpcyk7XG4gICAgfVxuXG4gICAgVG9BcnJheU9ic2VydmFibGUucHJvdG90eXBlLnN1YnNjcmliZUNvcmUgPSBmdW5jdGlvbihvKSB7XG4gICAgICByZXR1cm4gdGhpcy5zb3VyY2Uuc3Vic2NyaWJlKG5ldyBJbm5lck9ic2VydmVyKG8pKTtcbiAgICB9O1xuXG4gICAgaW5oZXJpdHMoSW5uZXJPYnNlcnZlciwgQWJzdHJhY3RPYnNlcnZlcik7XG4gICAgZnVuY3Rpb24gSW5uZXJPYnNlcnZlcihvKSB7XG4gICAgICB0aGlzLm8gPSBvO1xuICAgICAgdGhpcy5hID0gW107XG4gICAgICBBYnN0cmFjdE9ic2VydmVyLmNhbGwodGhpcyk7XG4gICAgfVxuICAgIFxuICAgIElubmVyT2JzZXJ2ZXIucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbiAoeCkgeyB0aGlzLmEucHVzaCh4KTsgfTtcbiAgICBJbm5lck9ic2VydmVyLnByb3RvdHlwZS5lcnJvciA9IGZ1bmN0aW9uIChlKSB7IHRoaXMuby5vbkVycm9yKGUpOyAgfTtcbiAgICBJbm5lck9ic2VydmVyLnByb3RvdHlwZS5jb21wbGV0ZWQgPSBmdW5jdGlvbiAoKSB7IHRoaXMuby5vbk5leHQodGhpcy5hKTsgdGhpcy5vLm9uQ29tcGxldGVkKCk7IH07XG5cbiAgICByZXR1cm4gVG9BcnJheU9ic2VydmFibGU7XG4gIH0oT2JzZXJ2YWJsZUJhc2UpKTtcblxuICAvKipcbiAgKiBDcmVhdGVzIGFuIGFycmF5IGZyb20gYW4gb2JzZXJ2YWJsZSBzZXF1ZW5jZS5cbiAgKiBAcmV0dXJucyB7T2JzZXJ2YWJsZX0gQW4gb2JzZXJ2YWJsZSBzZXF1ZW5jZSBjb250YWluaW5nIGEgc2luZ2xlIGVsZW1lbnQgd2l0aCBhIGxpc3QgY29udGFpbmluZyBhbGwgdGhlIGVsZW1lbnRzIG9mIHRoZSBzb3VyY2Ugc2VxdWVuY2UuXG4gICovXG4gIG9ic2VydmFibGVQcm90by50b0FycmF5ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBuZXcgVG9BcnJheU9ic2VydmFibGUodGhpcyk7XG4gIH07XG5cbiAgLyoqXG4gICAqICBDcmVhdGVzIGFuIG9ic2VydmFibGUgc2VxdWVuY2UgZnJvbSBhIHNwZWNpZmllZCBzdWJzY3JpYmUgbWV0aG9kIGltcGxlbWVudGF0aW9uLlxuICAgKiBAZXhhbXBsZVxuICAgKiAgdmFyIHJlcyA9IFJ4Lk9ic2VydmFibGUuY3JlYXRlKGZ1bmN0aW9uIChvYnNlcnZlcikgeyByZXR1cm4gZnVuY3Rpb24gKCkgeyB9ICk7XG4gICAqICB2YXIgcmVzID0gUnguT2JzZXJ2YWJsZS5jcmVhdGUoZnVuY3Rpb24gKG9ic2VydmVyKSB7IHJldHVybiBSeC5EaXNwb3NhYmxlLmVtcHR5OyB9ICk7XG4gICAqICB2YXIgcmVzID0gUnguT2JzZXJ2YWJsZS5jcmVhdGUoZnVuY3Rpb24gKG9ic2VydmVyKSB7IH0gKTtcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gc3Vic2NyaWJlIEltcGxlbWVudGF0aW9uIG9mIHRoZSByZXN1bHRpbmcgb2JzZXJ2YWJsZSBzZXF1ZW5jZSdzIHN1YnNjcmliZSBtZXRob2QsIHJldHVybmluZyBhIGZ1bmN0aW9uIHRoYXQgd2lsbCBiZSB3cmFwcGVkIGluIGEgRGlzcG9zYWJsZS5cbiAgICogQHJldHVybnMge09ic2VydmFibGV9IFRoZSBvYnNlcnZhYmxlIHNlcXVlbmNlIHdpdGggdGhlIHNwZWNpZmllZCBpbXBsZW1lbnRhdGlvbiBmb3IgdGhlIFN1YnNjcmliZSBtZXRob2QuXG4gICAqL1xuICBPYnNlcnZhYmxlLmNyZWF0ZSA9IGZ1bmN0aW9uIChzdWJzY3JpYmUsIHBhcmVudCkge1xuICAgIHJldHVybiBuZXcgQW5vbnltb3VzT2JzZXJ2YWJsZShzdWJzY3JpYmUsIHBhcmVudCk7XG4gIH07XG5cbiAgdmFyIERlZmVyID0gKGZ1bmN0aW9uKF9fc3VwZXJfXykge1xuICAgIGluaGVyaXRzKERlZmVyLCBfX3N1cGVyX18pO1xuICAgIGZ1bmN0aW9uIERlZmVyKGZhY3RvcnkpIHtcbiAgICAgIHRoaXMuX2YgPSBmYWN0b3J5O1xuICAgICAgX19zdXBlcl9fLmNhbGwodGhpcyk7XG4gICAgfVxuXG4gICAgRGVmZXIucHJvdG90eXBlLnN1YnNjcmliZUNvcmUgPSBmdW5jdGlvbiAobykge1xuICAgICAgdmFyIHJlc3VsdCA9IHRyeUNhdGNoKHRoaXMuX2YpKCk7XG4gICAgICBpZiAocmVzdWx0ID09PSBlcnJvck9iaikgeyByZXR1cm4gb2JzZXJ2YWJsZVRocm93KHJlc3VsdC5lKS5zdWJzY3JpYmUobyk7fVxuICAgICAgaXNQcm9taXNlKHJlc3VsdCkgJiYgKHJlc3VsdCA9IG9ic2VydmFibGVGcm9tUHJvbWlzZShyZXN1bHQpKTtcbiAgICAgIHJldHVybiByZXN1bHQuc3Vic2NyaWJlKG8pO1xuICAgIH07XG5cbiAgICByZXR1cm4gRGVmZXI7XG4gIH0oT2JzZXJ2YWJsZUJhc2UpKTtcblxuICAvKipcbiAgICogIFJldHVybnMgYW4gb2JzZXJ2YWJsZSBzZXF1ZW5jZSB0aGF0IGludm9rZXMgdGhlIHNwZWNpZmllZCBmYWN0b3J5IGZ1bmN0aW9uIHdoZW5ldmVyIGEgbmV3IG9ic2VydmVyIHN1YnNjcmliZXMuXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqICB2YXIgcmVzID0gUnguT2JzZXJ2YWJsZS5kZWZlcihmdW5jdGlvbiAoKSB7IHJldHVybiBSeC5PYnNlcnZhYmxlLmZyb21BcnJheShbMSwyLDNdKTsgfSk7XG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IG9ic2VydmFibGVGYWN0b3J5IE9ic2VydmFibGUgZmFjdG9yeSBmdW5jdGlvbiB0byBpbnZva2UgZm9yIGVhY2ggb2JzZXJ2ZXIgdGhhdCBzdWJzY3JpYmVzIHRvIHRoZSByZXN1bHRpbmcgc2VxdWVuY2Ugb3IgUHJvbWlzZS5cbiAgICogQHJldHVybnMge09ic2VydmFibGV9IEFuIG9ic2VydmFibGUgc2VxdWVuY2Ugd2hvc2Ugb2JzZXJ2ZXJzIHRyaWdnZXIgYW4gaW52b2NhdGlvbiBvZiB0aGUgZ2l2ZW4gb2JzZXJ2YWJsZSBmYWN0b3J5IGZ1bmN0aW9uLlxuICAgKi9cbiAgdmFyIG9ic2VydmFibGVEZWZlciA9IE9ic2VydmFibGUuZGVmZXIgPSBmdW5jdGlvbiAob2JzZXJ2YWJsZUZhY3RvcnkpIHtcbiAgICByZXR1cm4gbmV3IERlZmVyKG9ic2VydmFibGVGYWN0b3J5KTtcbiAgfTtcblxuICB2YXIgRW1wdHlPYnNlcnZhYmxlID0gKGZ1bmN0aW9uKF9fc3VwZXJfXykge1xuICAgIGluaGVyaXRzKEVtcHR5T2JzZXJ2YWJsZSwgX19zdXBlcl9fKTtcbiAgICBmdW5jdGlvbiBFbXB0eU9ic2VydmFibGUoc2NoZWR1bGVyKSB7XG4gICAgICB0aGlzLnNjaGVkdWxlciA9IHNjaGVkdWxlcjtcbiAgICAgIF9fc3VwZXJfXy5jYWxsKHRoaXMpO1xuICAgIH1cblxuICAgIEVtcHR5T2JzZXJ2YWJsZS5wcm90b3R5cGUuc3Vic2NyaWJlQ29yZSA9IGZ1bmN0aW9uIChvYnNlcnZlcikge1xuICAgICAgdmFyIHNpbmsgPSBuZXcgRW1wdHlTaW5rKG9ic2VydmVyLCB0aGlzLnNjaGVkdWxlcik7XG4gICAgICByZXR1cm4gc2luay5ydW4oKTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gRW1wdHlTaW5rKG9ic2VydmVyLCBzY2hlZHVsZXIpIHtcbiAgICAgIHRoaXMub2JzZXJ2ZXIgPSBvYnNlcnZlcjtcbiAgICAgIHRoaXMuc2NoZWR1bGVyID0gc2NoZWR1bGVyO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNjaGVkdWxlSXRlbShzLCBzdGF0ZSkge1xuICAgICAgc3RhdGUub25Db21wbGV0ZWQoKTtcbiAgICAgIHJldHVybiBkaXNwb3NhYmxlRW1wdHk7XG4gICAgfVxuXG4gICAgRW1wdHlTaW5rLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgc3RhdGUgPSB0aGlzLm9ic2VydmVyO1xuICAgICAgcmV0dXJuIHRoaXMuc2NoZWR1bGVyID09PSBpbW1lZGlhdGVTY2hlZHVsZXIgP1xuICAgICAgICBzY2hlZHVsZUl0ZW0obnVsbCwgc3RhdGUpIDpcbiAgICAgICAgdGhpcy5zY2hlZHVsZXIuc2NoZWR1bGUoc3RhdGUsIHNjaGVkdWxlSXRlbSk7XG4gICAgfTtcblxuICAgIHJldHVybiBFbXB0eU9ic2VydmFibGU7XG4gIH0oT2JzZXJ2YWJsZUJhc2UpKTtcblxuICB2YXIgRU1QVFlfT0JTRVJWQUJMRSA9IG5ldyBFbXB0eU9ic2VydmFibGUoaW1tZWRpYXRlU2NoZWR1bGVyKTtcblxuICAvKipcbiAgICogIFJldHVybnMgYW4gZW1wdHkgb2JzZXJ2YWJsZSBzZXF1ZW5jZSwgdXNpbmcgdGhlIHNwZWNpZmllZCBzY2hlZHVsZXIgdG8gc2VuZCBvdXQgdGhlIHNpbmdsZSBPbkNvbXBsZXRlZCBtZXNzYWdlLlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiAgdmFyIHJlcyA9IFJ4Lk9ic2VydmFibGUuZW1wdHkoKTtcbiAgICogIHZhciByZXMgPSBSeC5PYnNlcnZhYmxlLmVtcHR5KFJ4LlNjaGVkdWxlci50aW1lb3V0KTtcbiAgICogQHBhcmFtIHtTY2hlZHVsZXJ9IFtzY2hlZHVsZXJdIFNjaGVkdWxlciB0byBzZW5kIHRoZSB0ZXJtaW5hdGlvbiBjYWxsIG9uLlxuICAgKiBAcmV0dXJucyB7T2JzZXJ2YWJsZX0gQW4gb2JzZXJ2YWJsZSBzZXF1ZW5jZSB3aXRoIG5vIGVsZW1lbnRzLlxuICAgKi9cbiAgdmFyIG9ic2VydmFibGVFbXB0eSA9IE9ic2VydmFibGUuZW1wdHkgPSBmdW5jdGlvbiAoc2NoZWR1bGVyKSB7XG4gICAgaXNTY2hlZHVsZXIoc2NoZWR1bGVyKSB8fCAoc2NoZWR1bGVyID0gaW1tZWRpYXRlU2NoZWR1bGVyKTtcbiAgICByZXR1cm4gc2NoZWR1bGVyID09PSBpbW1lZGlhdGVTY2hlZHVsZXIgPyBFTVBUWV9PQlNFUlZBQkxFIDogbmV3IEVtcHR5T2JzZXJ2YWJsZShzY2hlZHVsZXIpO1xuICB9O1xuXG4gIHZhciBGcm9tT2JzZXJ2YWJsZSA9IChmdW5jdGlvbihfX3N1cGVyX18pIHtcbiAgICBpbmhlcml0cyhGcm9tT2JzZXJ2YWJsZSwgX19zdXBlcl9fKTtcbiAgICBmdW5jdGlvbiBGcm9tT2JzZXJ2YWJsZShpdGVyYWJsZSwgZm4sIHNjaGVkdWxlcikge1xuICAgICAgdGhpcy5faXRlcmFibGUgPSBpdGVyYWJsZTtcbiAgICAgIHRoaXMuX2ZuID0gZm47XG4gICAgICB0aGlzLl9zY2hlZHVsZXIgPSBzY2hlZHVsZXI7XG4gICAgICBfX3N1cGVyX18uY2FsbCh0aGlzKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjcmVhdGVTY2hlZHVsZU1ldGhvZChvLCBpdCwgZm4pIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbiBsb29wUmVjdXJzaXZlKGksIHJlY3Vyc2UpIHtcbiAgICAgICAgdmFyIG5leHQgPSB0cnlDYXRjaChpdC5uZXh0KS5jYWxsKGl0KTtcbiAgICAgICAgaWYgKG5leHQgPT09IGVycm9yT2JqKSB7IHJldHVybiBvLm9uRXJyb3IobmV4dC5lKTsgfVxuICAgICAgICBpZiAobmV4dC5kb25lKSB7IHJldHVybiBvLm9uQ29tcGxldGVkKCk7IH1cblxuICAgICAgICB2YXIgcmVzdWx0ID0gbmV4dC52YWx1ZTtcblxuICAgICAgICBpZiAoaXNGdW5jdGlvbihmbikpIHtcbiAgICAgICAgICByZXN1bHQgPSB0cnlDYXRjaChmbikocmVzdWx0LCBpKTtcbiAgICAgICAgICBpZiAocmVzdWx0ID09PSBlcnJvck9iaikgeyByZXR1cm4gby5vbkVycm9yKHJlc3VsdC5lKTsgfVxuICAgICAgICB9XG5cbiAgICAgICAgby5vbk5leHQocmVzdWx0KTtcbiAgICAgICAgcmVjdXJzZShpICsgMSk7XG4gICAgICB9O1xuICAgIH1cblxuICAgIEZyb21PYnNlcnZhYmxlLnByb3RvdHlwZS5zdWJzY3JpYmVDb3JlID0gZnVuY3Rpb24gKG8pIHtcbiAgICAgIHZhciBsaXN0ID0gT2JqZWN0KHRoaXMuX2l0ZXJhYmxlKSxcbiAgICAgICAgICBpdCA9IGdldEl0ZXJhYmxlKGxpc3QpO1xuXG4gICAgICByZXR1cm4gdGhpcy5fc2NoZWR1bGVyLnNjaGVkdWxlUmVjdXJzaXZlKDAsIGNyZWF0ZVNjaGVkdWxlTWV0aG9kKG8sIGl0LCB0aGlzLl9mbikpO1xuICAgIH07XG5cbiAgICByZXR1cm4gRnJvbU9ic2VydmFibGU7XG4gIH0oT2JzZXJ2YWJsZUJhc2UpKTtcblxuICB2YXIgbWF4U2FmZUludGVnZXIgPSBNYXRoLnBvdygyLCA1MykgLSAxO1xuXG4gIGZ1bmN0aW9uIFN0cmluZ0l0ZXJhYmxlKHMpIHtcbiAgICB0aGlzLl9zID0gcztcbiAgfVxuXG4gIFN0cmluZ0l0ZXJhYmxlLnByb3RvdHlwZVskaXRlcmF0b3IkXSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gbmV3IFN0cmluZ0l0ZXJhdG9yKHRoaXMuX3MpO1xuICB9O1xuXG4gIGZ1bmN0aW9uIFN0cmluZ0l0ZXJhdG9yKHMpIHtcbiAgICB0aGlzLl9zID0gcztcbiAgICB0aGlzLl9sID0gcy5sZW5ndGg7XG4gICAgdGhpcy5faSA9IDA7XG4gIH1cblxuICBTdHJpbmdJdGVyYXRvci5wcm90b3R5cGVbJGl0ZXJhdG9yJF0gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgU3RyaW5nSXRlcmF0b3IucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2kgPCB0aGlzLl9sID8geyBkb25lOiBmYWxzZSwgdmFsdWU6IHRoaXMuX3MuY2hhckF0KHRoaXMuX2krKykgfSA6IGRvbmVFbnVtZXJhdG9yO1xuICB9O1xuXG4gIGZ1bmN0aW9uIEFycmF5SXRlcmFibGUoYSkge1xuICAgIHRoaXMuX2EgPSBhO1xuICB9XG5cbiAgQXJyYXlJdGVyYWJsZS5wcm90b3R5cGVbJGl0ZXJhdG9yJF0gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIG5ldyBBcnJheUl0ZXJhdG9yKHRoaXMuX2EpO1xuICB9O1xuXG4gIGZ1bmN0aW9uIEFycmF5SXRlcmF0b3IoYSkge1xuICAgIHRoaXMuX2EgPSBhO1xuICAgIHRoaXMuX2wgPSB0b0xlbmd0aChhKTtcbiAgICB0aGlzLl9pID0gMDtcbiAgfVxuXG4gIEFycmF5SXRlcmF0b3IucHJvdG90eXBlWyRpdGVyYXRvciRdID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIEFycmF5SXRlcmF0b3IucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2kgPCB0aGlzLl9sID8geyBkb25lOiBmYWxzZSwgdmFsdWU6IHRoaXMuX2FbdGhpcy5faSsrXSB9IDogZG9uZUVudW1lcmF0b3I7XG4gIH07XG5cbiAgZnVuY3Rpb24gbnVtYmVySXNGaW5pdGUodmFsdWUpIHtcbiAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyAmJiByb290LmlzRmluaXRlKHZhbHVlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzTmFuKG4pIHtcbiAgICByZXR1cm4gbiAhPT0gbjtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEl0ZXJhYmxlKG8pIHtcbiAgICB2YXIgaSA9IG9bJGl0ZXJhdG9yJF0sIGl0O1xuICAgIGlmICghaSAmJiB0eXBlb2YgbyA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGl0ID0gbmV3IFN0cmluZ0l0ZXJhYmxlKG8pO1xuICAgICAgcmV0dXJuIGl0WyRpdGVyYXRvciRdKCk7XG4gICAgfVxuICAgIGlmICghaSAmJiBvLmxlbmd0aCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBpdCA9IG5ldyBBcnJheUl0ZXJhYmxlKG8pO1xuICAgICAgcmV0dXJuIGl0WyRpdGVyYXRvciRdKCk7XG4gICAgfVxuICAgIGlmICghaSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKCdPYmplY3QgaXMgbm90IGl0ZXJhYmxlJyk7IH1cbiAgICByZXR1cm4gb1skaXRlcmF0b3IkXSgpO1xuICB9XG5cbiAgZnVuY3Rpb24gc2lnbih2YWx1ZSkge1xuICAgIHZhciBudW1iZXIgPSArdmFsdWU7XG4gICAgaWYgKG51bWJlciA9PT0gMCkgeyByZXR1cm4gbnVtYmVyOyB9XG4gICAgaWYgKGlzTmFOKG51bWJlcikpIHsgcmV0dXJuIG51bWJlcjsgfVxuICAgIHJldHVybiBudW1iZXIgPCAwID8gLTEgOiAxO1xuICB9XG5cbiAgZnVuY3Rpb24gdG9MZW5ndGgobykge1xuICAgIHZhciBsZW4gPSArby5sZW5ndGg7XG4gICAgaWYgKGlzTmFOKGxlbikpIHsgcmV0dXJuIDA7IH1cbiAgICBpZiAobGVuID09PSAwIHx8ICFudW1iZXJJc0Zpbml0ZShsZW4pKSB7IHJldHVybiBsZW47IH1cbiAgICBsZW4gPSBzaWduKGxlbikgKiBNYXRoLmZsb29yKE1hdGguYWJzKGxlbikpO1xuICAgIGlmIChsZW4gPD0gMCkgeyByZXR1cm4gMDsgfVxuICAgIGlmIChsZW4gPiBtYXhTYWZlSW50ZWdlcikgeyByZXR1cm4gbWF4U2FmZUludGVnZXI7IH1cbiAgICByZXR1cm4gbGVuO1xuICB9XG5cbiAgLyoqXG4gICogVGhpcyBtZXRob2QgY3JlYXRlcyBhIG5ldyBPYnNlcnZhYmxlIHNlcXVlbmNlIGZyb20gYW4gYXJyYXktbGlrZSBvciBpdGVyYWJsZSBvYmplY3QuXG4gICogQHBhcmFtIHtBbnl9IGFycmF5TGlrZSBBbiBhcnJheS1saWtlIG9yIGl0ZXJhYmxlIG9iamVjdCB0byBjb252ZXJ0IHRvIGFuIE9ic2VydmFibGUgc2VxdWVuY2UuXG4gICogQHBhcmFtIHtGdW5jdGlvbn0gW21hcEZuXSBNYXAgZnVuY3Rpb24gdG8gY2FsbCBvbiBldmVyeSBlbGVtZW50IG9mIHRoZSBhcnJheS5cbiAgKiBAcGFyYW0ge0FueX0gW3RoaXNBcmddIFRoZSBjb250ZXh0IHRvIHVzZSBjYWxsaW5nIHRoZSBtYXBGbiBpZiBwcm92aWRlZC5cbiAgKiBAcGFyYW0ge1NjaGVkdWxlcn0gW3NjaGVkdWxlcl0gT3B0aW9uYWwgc2NoZWR1bGVyIHRvIHVzZSBmb3Igc2NoZWR1bGluZy4gIElmIG5vdCBwcm92aWRlZCwgZGVmYXVsdHMgdG8gU2NoZWR1bGVyLmN1cnJlbnRUaHJlYWQuXG4gICovXG4gIHZhciBvYnNlcnZhYmxlRnJvbSA9IE9ic2VydmFibGUuZnJvbSA9IGZ1bmN0aW9uIChpdGVyYWJsZSwgbWFwRm4sIHRoaXNBcmcsIHNjaGVkdWxlcikge1xuICAgIGlmIChpdGVyYWJsZSA9PSBudWxsKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2l0ZXJhYmxlIGNhbm5vdCBiZSBudWxsLicpXG4gICAgfVxuICAgIGlmIChtYXBGbiAmJiAhaXNGdW5jdGlvbihtYXBGbikpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignbWFwRm4gd2hlbiBwcm92aWRlZCBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcbiAgICB9XG4gICAgaWYgKG1hcEZuKSB7XG4gICAgICB2YXIgbWFwcGVyID0gYmluZENhbGxiYWNrKG1hcEZuLCB0aGlzQXJnLCAyKTtcbiAgICB9XG4gICAgaXNTY2hlZHVsZXIoc2NoZWR1bGVyKSB8fCAoc2NoZWR1bGVyID0gY3VycmVudFRocmVhZFNjaGVkdWxlcik7XG4gICAgcmV0dXJuIG5ldyBGcm9tT2JzZXJ2YWJsZShpdGVyYWJsZSwgbWFwcGVyLCBzY2hlZHVsZXIpO1xuICB9XG5cbiAgdmFyIEZyb21BcnJheU9ic2VydmFibGUgPSAoZnVuY3Rpb24oX19zdXBlcl9fKSB7XG4gICAgaW5oZXJpdHMoRnJvbUFycmF5T2JzZXJ2YWJsZSwgX19zdXBlcl9fKTtcbiAgICBmdW5jdGlvbiBGcm9tQXJyYXlPYnNlcnZhYmxlKGFyZ3MsIHNjaGVkdWxlcikge1xuICAgICAgdGhpcy5fYXJncyA9IGFyZ3M7XG4gICAgICB0aGlzLl9zY2hlZHVsZXIgPSBzY2hlZHVsZXI7XG4gICAgICBfX3N1cGVyX18uY2FsbCh0aGlzKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzY2hlZHVsZU1ldGhvZChvLCBhcmdzKSB7XG4gICAgICB2YXIgbGVuID0gYXJncy5sZW5ndGg7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gbG9vcFJlY3Vyc2l2ZSAoaSwgcmVjdXJzZSkge1xuICAgICAgICBpZiAoaSA8IGxlbikge1xuICAgICAgICAgIG8ub25OZXh0KGFyZ3NbaV0pO1xuICAgICAgICAgIHJlY3Vyc2UoaSArIDEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG8ub25Db21wbGV0ZWQoKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG5cbiAgICBGcm9tQXJyYXlPYnNlcnZhYmxlLnByb3RvdHlwZS5zdWJzY3JpYmVDb3JlID0gZnVuY3Rpb24gKG8pIHtcbiAgICAgIHJldHVybiB0aGlzLl9zY2hlZHVsZXIuc2NoZWR1bGVSZWN1cnNpdmUoMCwgc2NoZWR1bGVNZXRob2QobywgdGhpcy5fYXJncykpO1xuICAgIH07XG5cbiAgICByZXR1cm4gRnJvbUFycmF5T2JzZXJ2YWJsZTtcbiAgfShPYnNlcnZhYmxlQmFzZSkpO1xuXG4gIC8qKlxuICAqICBDb252ZXJ0cyBhbiBhcnJheSB0byBhbiBvYnNlcnZhYmxlIHNlcXVlbmNlLCB1c2luZyBhbiBvcHRpb25hbCBzY2hlZHVsZXIgdG8gZW51bWVyYXRlIHRoZSBhcnJheS5cbiAgKiBAZGVwcmVjYXRlZCB1c2UgT2JzZXJ2YWJsZS5mcm9tIG9yIE9ic2VydmFibGUub2ZcbiAgKiBAcGFyYW0ge1NjaGVkdWxlcn0gW3NjaGVkdWxlcl0gU2NoZWR1bGVyIHRvIHJ1biB0aGUgZW51bWVyYXRpb24gb2YgdGhlIGlucHV0IHNlcXVlbmNlIG9uLlxuICAqIEByZXR1cm5zIHtPYnNlcnZhYmxlfSBUaGUgb2JzZXJ2YWJsZSBzZXF1ZW5jZSB3aG9zZSBlbGVtZW50cyBhcmUgcHVsbGVkIGZyb20gdGhlIGdpdmVuIGVudW1lcmFibGUgc2VxdWVuY2UuXG4gICovXG4gIHZhciBvYnNlcnZhYmxlRnJvbUFycmF5ID0gT2JzZXJ2YWJsZS5mcm9tQXJyYXkgPSBmdW5jdGlvbiAoYXJyYXksIHNjaGVkdWxlcikge1xuICAgIGlzU2NoZWR1bGVyKHNjaGVkdWxlcikgfHwgKHNjaGVkdWxlciA9IGN1cnJlbnRUaHJlYWRTY2hlZHVsZXIpO1xuICAgIHJldHVybiBuZXcgRnJvbUFycmF5T2JzZXJ2YWJsZShhcnJheSwgc2NoZWR1bGVyKVxuICB9O1xuXG4gIHZhciBOZXZlck9ic2VydmFibGUgPSAoZnVuY3Rpb24oX19zdXBlcl9fKSB7XG4gICAgaW5oZXJpdHMoTmV2ZXJPYnNlcnZhYmxlLCBfX3N1cGVyX18pO1xuICAgIGZ1bmN0aW9uIE5ldmVyT2JzZXJ2YWJsZSgpIHtcbiAgICAgIF9fc3VwZXJfXy5jYWxsKHRoaXMpO1xuICAgIH1cblxuICAgIE5ldmVyT2JzZXJ2YWJsZS5wcm90b3R5cGUuc3Vic2NyaWJlQ29yZSA9IGZ1bmN0aW9uIChvYnNlcnZlcikge1xuICAgICAgcmV0dXJuIGRpc3Bvc2FibGVFbXB0eTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIE5ldmVyT2JzZXJ2YWJsZTtcbiAgfShPYnNlcnZhYmxlQmFzZSkpO1xuXG4gIHZhciBORVZFUl9PQlNFUlZBQkxFID0gbmV3IE5ldmVyT2JzZXJ2YWJsZSgpO1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgbm9uLXRlcm1pbmF0aW5nIG9ic2VydmFibGUgc2VxdWVuY2UsIHdoaWNoIGNhbiBiZSB1c2VkIHRvIGRlbm90ZSBhbiBpbmZpbml0ZSBkdXJhdGlvbiAoZS5nLiB3aGVuIHVzaW5nIHJlYWN0aXZlIGpvaW5zKS5cbiAgICogQHJldHVybnMge09ic2VydmFibGV9IEFuIG9ic2VydmFibGUgc2VxdWVuY2Ugd2hvc2Ugb2JzZXJ2ZXJzIHdpbGwgbmV2ZXIgZ2V0IGNhbGxlZC5cbiAgICovXG4gIHZhciBvYnNlcnZhYmxlTmV2ZXIgPSBPYnNlcnZhYmxlLm5ldmVyID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBORVZFUl9PQlNFUlZBQkxFO1xuICB9O1xuXG4gIGZ1bmN0aW9uIG9ic2VydmFibGVPZiAoc2NoZWR1bGVyLCBhcnJheSkge1xuICAgIGlzU2NoZWR1bGVyKHNjaGVkdWxlcikgfHwgKHNjaGVkdWxlciA9IGN1cnJlbnRUaHJlYWRTY2hlZHVsZXIpO1xuICAgIHJldHVybiBuZXcgRnJvbUFycmF5T2JzZXJ2YWJsZShhcnJheSwgc2NoZWR1bGVyKTtcbiAgfVxuXG4gIC8qKlxuICAqICBUaGlzIG1ldGhvZCBjcmVhdGVzIGEgbmV3IE9ic2VydmFibGUgaW5zdGFuY2Ugd2l0aCBhIHZhcmlhYmxlIG51bWJlciBvZiBhcmd1bWVudHMsIHJlZ2FyZGxlc3Mgb2YgbnVtYmVyIG9yIHR5cGUgb2YgdGhlIGFyZ3VtZW50cy5cbiAgKiBAcmV0dXJucyB7T2JzZXJ2YWJsZX0gVGhlIG9ic2VydmFibGUgc2VxdWVuY2Ugd2hvc2UgZWxlbWVudHMgYXJlIHB1bGxlZCBmcm9tIHRoZSBnaXZlbiBhcmd1bWVudHMuXG4gICovXG4gIE9ic2VydmFibGUub2YgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBuZXcgQXJyYXkobGVuKTtcbiAgICBmb3IodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHsgYXJnc1tpXSA9IGFyZ3VtZW50c1tpXTsgfVxuICAgIHJldHVybiBuZXcgRnJvbUFycmF5T2JzZXJ2YWJsZShhcmdzLCBjdXJyZW50VGhyZWFkU2NoZWR1bGVyKTtcbiAgfTtcblxuICAvKipcbiAgKiAgVGhpcyBtZXRob2QgY3JlYXRlcyBhIG5ldyBPYnNlcnZhYmxlIGluc3RhbmNlIHdpdGggYSB2YXJpYWJsZSBudW1iZXIgb2YgYXJndW1lbnRzLCByZWdhcmRsZXNzIG9mIG51bWJlciBvciB0eXBlIG9mIHRoZSBhcmd1bWVudHMuXG4gICogQHBhcmFtIHtTY2hlZHVsZXJ9IHNjaGVkdWxlciBBIHNjaGVkdWxlciB0byB1c2UgZm9yIHNjaGVkdWxpbmcgdGhlIGFyZ3VtZW50cy5cbiAgKiBAcmV0dXJucyB7T2JzZXJ2YWJsZX0gVGhlIG9ic2VydmFibGUgc2VxdWVuY2Ugd2hvc2UgZWxlbWVudHMgYXJlIHB1bGxlZCBmcm9tIHRoZSBnaXZlbiBhcmd1bWVudHMuXG4gICovXG4gIE9ic2VydmFibGUub2ZXaXRoU2NoZWR1bGVyID0gZnVuY3Rpb24gKHNjaGVkdWxlcikge1xuICAgIHZhciBsZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gbmV3IEFycmF5KGxlbiAtIDEpO1xuICAgIGZvcih2YXIgaSA9IDE7IGkgPCBsZW47IGkrKykgeyBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTsgfVxuICAgIHJldHVybiBuZXcgRnJvbUFycmF5T2JzZXJ2YWJsZShhcmdzLCBzY2hlZHVsZXIpO1xuICB9O1xuXG4gIHZhciBQYWlyc09ic2VydmFibGUgPSAoZnVuY3Rpb24oX19zdXBlcl9fKSB7XG4gICAgaW5oZXJpdHMoUGFpcnNPYnNlcnZhYmxlLCBfX3N1cGVyX18pO1xuICAgIGZ1bmN0aW9uIFBhaXJzT2JzZXJ2YWJsZShvLCBzY2hlZHVsZXIpIHtcbiAgICAgIHRoaXMuX28gPSBvO1xuICAgICAgdGhpcy5fa2V5cyA9IE9iamVjdC5rZXlzKG8pO1xuICAgICAgdGhpcy5fc2NoZWR1bGVyID0gc2NoZWR1bGVyO1xuICAgICAgX19zdXBlcl9fLmNhbGwodGhpcyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2NoZWR1bGVNZXRob2Qobywgb2JqLCBrZXlzKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gbG9vcFJlY3Vyc2l2ZShpLCByZWN1cnNlKSB7XG4gICAgICAgIGlmIChpIDwga2V5cy5sZW5ndGgpIHtcbiAgICAgICAgICB2YXIga2V5ID0ga2V5c1tpXTtcbiAgICAgICAgICBvLm9uTmV4dChba2V5LCBvYmpba2V5XV0pO1xuICAgICAgICAgIHJlY3Vyc2UoaSArIDEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG8ub25Db21wbGV0ZWQoKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG5cbiAgICBQYWlyc09ic2VydmFibGUucHJvdG90eXBlLnN1YnNjcmliZUNvcmUgPSBmdW5jdGlvbiAobykge1xuICAgICAgcmV0dXJuIHRoaXMuX3NjaGVkdWxlci5zY2hlZHVsZVJlY3Vyc2l2ZSgwLCBzY2hlZHVsZU1ldGhvZChvLCB0aGlzLl9vLCB0aGlzLl9rZXlzKSk7XG4gICAgfTtcblxuICAgIHJldHVybiBQYWlyc09ic2VydmFibGU7XG4gIH0oT2JzZXJ2YWJsZUJhc2UpKTtcblxuICAvKipcbiAgICogQ29udmVydCBhbiBvYmplY3QgaW50byBhbiBvYnNlcnZhYmxlIHNlcXVlbmNlIG9mIFtrZXksIHZhbHVlXSBwYWlycy5cbiAgICogQHBhcmFtIHtPYmplY3R9IG9iaiBUaGUgb2JqZWN0IHRvIGluc3BlY3QuXG4gICAqIEBwYXJhbSB7U2NoZWR1bGVyfSBbc2NoZWR1bGVyXSBTY2hlZHVsZXIgdG8gcnVuIHRoZSBlbnVtZXJhdGlvbiBvZiB0aGUgaW5wdXQgc2VxdWVuY2Ugb24uXG4gICAqIEByZXR1cm5zIHtPYnNlcnZhYmxlfSBBbiBvYnNlcnZhYmxlIHNlcXVlbmNlIG9mIFtrZXksIHZhbHVlXSBwYWlycyBmcm9tIHRoZSBvYmplY3QuXG4gICAqL1xuICBPYnNlcnZhYmxlLnBhaXJzID0gZnVuY3Rpb24gKG9iaiwgc2NoZWR1bGVyKSB7XG4gICAgc2NoZWR1bGVyIHx8IChzY2hlZHVsZXIgPSBjdXJyZW50VGhyZWFkU2NoZWR1bGVyKTtcbiAgICByZXR1cm4gbmV3IFBhaXJzT2JzZXJ2YWJsZShvYmosIHNjaGVkdWxlcik7XG4gIH07XG5cbiAgICB2YXIgUmFuZ2VPYnNlcnZhYmxlID0gKGZ1bmN0aW9uKF9fc3VwZXJfXykge1xuICAgIGluaGVyaXRzKFJhbmdlT2JzZXJ2YWJsZSwgX19zdXBlcl9fKTtcbiAgICBmdW5jdGlvbiBSYW5nZU9ic2VydmFibGUoc3RhcnQsIGNvdW50LCBzY2hlZHVsZXIpIHtcbiAgICAgIHRoaXMuc3RhcnQgPSBzdGFydDtcbiAgICAgIHRoaXMucmFuZ2VDb3VudCA9IGNvdW50O1xuICAgICAgdGhpcy5zY2hlZHVsZXIgPSBzY2hlZHVsZXI7XG4gICAgICBfX3N1cGVyX18uY2FsbCh0aGlzKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsb29wUmVjdXJzaXZlKHN0YXJ0LCBjb3VudCwgbykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uIGxvb3AgKGksIHJlY3Vyc2UpIHtcbiAgICAgICAgaWYgKGkgPCBjb3VudCkge1xuICAgICAgICAgIG8ub25OZXh0KHN0YXJ0ICsgaSk7XG4gICAgICAgICAgcmVjdXJzZShpICsgMSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgby5vbkNvbXBsZXRlZCgpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cblxuICAgIFJhbmdlT2JzZXJ2YWJsZS5wcm90b3R5cGUuc3Vic2NyaWJlQ29yZSA9IGZ1bmN0aW9uIChvKSB7XG4gICAgICByZXR1cm4gdGhpcy5zY2hlZHVsZXIuc2NoZWR1bGVSZWN1cnNpdmUoXG4gICAgICAgIDAsXG4gICAgICAgIGxvb3BSZWN1cnNpdmUodGhpcy5zdGFydCwgdGhpcy5yYW5nZUNvdW50LCBvKVxuICAgICAgKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIFJhbmdlT2JzZXJ2YWJsZTtcbiAgfShPYnNlcnZhYmxlQmFzZSkpO1xuXG4gIC8qKlxuICAqICBHZW5lcmF0ZXMgYW4gb2JzZXJ2YWJsZSBzZXF1ZW5jZSBvZiBpbnRlZ3JhbCBudW1iZXJzIHdpdGhpbiBhIHNwZWNpZmllZCByYW5nZSwgdXNpbmcgdGhlIHNwZWNpZmllZCBzY2hlZHVsZXIgdG8gc2VuZCBvdXQgb2JzZXJ2ZXIgbWVzc2FnZXMuXG4gICogQHBhcmFtIHtOdW1iZXJ9IHN0YXJ0IFRoZSB2YWx1ZSBvZiB0aGUgZmlyc3QgaW50ZWdlciBpbiB0aGUgc2VxdWVuY2UuXG4gICogQHBhcmFtIHtOdW1iZXJ9IGNvdW50IFRoZSBudW1iZXIgb2Ygc2VxdWVudGlhbCBpbnRlZ2VycyB0byBnZW5lcmF0ZS5cbiAgKiBAcGFyYW0ge1NjaGVkdWxlcn0gW3NjaGVkdWxlcl0gU2NoZWR1bGVyIHRvIHJ1biB0aGUgZ2VuZXJhdG9yIGxvb3Agb24uIElmIG5vdCBzcGVjaWZpZWQsIGRlZmF1bHRzIHRvIFNjaGVkdWxlci5jdXJyZW50VGhyZWFkLlxuICAqIEByZXR1cm5zIHtPYnNlcnZhYmxlfSBBbiBvYnNlcnZhYmxlIHNlcXVlbmNlIHRoYXQgY29udGFpbnMgYSByYW5nZSBvZiBzZXF1ZW50aWFsIGludGVncmFsIG51bWJlcnMuXG4gICovXG4gIE9ic2VydmFibGUucmFuZ2UgPSBmdW5jdGlvbiAoc3RhcnQsIGNvdW50LCBzY2hlZHVsZXIpIHtcbiAgICBpc1NjaGVkdWxlcihzY2hlZHVsZXIpIHx8IChzY2hlZHVsZXIgPSBjdXJyZW50VGhyZWFkU2NoZWR1bGVyKTtcbiAgICByZXR1cm4gbmV3IFJhbmdlT2JzZXJ2YWJsZShzdGFydCwgY291bnQsIHNjaGVkdWxlcik7XG4gIH07XG5cbiAgdmFyIFJlcGVhdE9ic2VydmFibGUgPSAoZnVuY3Rpb24oX19zdXBlcl9fKSB7XG4gICAgaW5oZXJpdHMoUmVwZWF0T2JzZXJ2YWJsZSwgX19zdXBlcl9fKTtcbiAgICBmdW5jdGlvbiBSZXBlYXRPYnNlcnZhYmxlKHZhbHVlLCByZXBlYXRDb3VudCwgc2NoZWR1bGVyKSB7XG4gICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICB0aGlzLnJlcGVhdENvdW50ID0gcmVwZWF0Q291bnQgPT0gbnVsbCA/IC0xIDogcmVwZWF0Q291bnQ7XG4gICAgICB0aGlzLnNjaGVkdWxlciA9IHNjaGVkdWxlcjtcbiAgICAgIF9fc3VwZXJfXy5jYWxsKHRoaXMpO1xuICAgIH1cblxuICAgIFJlcGVhdE9ic2VydmFibGUucHJvdG90eXBlLnN1YnNjcmliZUNvcmUgPSBmdW5jdGlvbiAob2JzZXJ2ZXIpIHtcbiAgICAgIHZhciBzaW5rID0gbmV3IFJlcGVhdFNpbmsob2JzZXJ2ZXIsIHRoaXMpO1xuICAgICAgcmV0dXJuIHNpbmsucnVuKCk7XG4gICAgfTtcblxuICAgIHJldHVybiBSZXBlYXRPYnNlcnZhYmxlO1xuICB9KE9ic2VydmFibGVCYXNlKSk7XG5cbiAgZnVuY3Rpb24gUmVwZWF0U2luayhvYnNlcnZlciwgcGFyZW50KSB7XG4gICAgdGhpcy5vYnNlcnZlciA9IG9ic2VydmVyO1xuICAgIHRoaXMucGFyZW50ID0gcGFyZW50O1xuICB9XG5cbiAgUmVwZWF0U2luay5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBvYnNlcnZlciA9IHRoaXMub2JzZXJ2ZXIsIHZhbHVlID0gdGhpcy5wYXJlbnQudmFsdWU7XG4gICAgZnVuY3Rpb24gbG9vcFJlY3Vyc2l2ZShpLCByZWN1cnNlKSB7XG4gICAgICBpZiAoaSA9PT0gLTEgfHwgaSA+IDApIHtcbiAgICAgICAgb2JzZXJ2ZXIub25OZXh0KHZhbHVlKTtcbiAgICAgICAgaSA+IDAgJiYgaS0tO1xuICAgICAgfVxuICAgICAgaWYgKGkgPT09IDApIHsgcmV0dXJuIG9ic2VydmVyLm9uQ29tcGxldGVkKCk7IH1cbiAgICAgIHJlY3Vyc2UoaSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMucGFyZW50LnNjaGVkdWxlci5zY2hlZHVsZVJlY3Vyc2l2ZSh0aGlzLnBhcmVudC5yZXBlYXRDb3VudCwgbG9vcFJlY3Vyc2l2ZSk7XG4gIH07XG5cbiAgLyoqXG4gICAqICBHZW5lcmF0ZXMgYW4gb2JzZXJ2YWJsZSBzZXF1ZW5jZSB0aGF0IHJlcGVhdHMgdGhlIGdpdmVuIGVsZW1lbnQgdGhlIHNwZWNpZmllZCBudW1iZXIgb2YgdGltZXMsIHVzaW5nIHRoZSBzcGVjaWZpZWQgc2NoZWR1bGVyIHRvIHNlbmQgb3V0IG9ic2VydmVyIG1lc3NhZ2VzLlxuICAgKiBAcGFyYW0ge01peGVkfSB2YWx1ZSBFbGVtZW50IHRvIHJlcGVhdC5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHJlcGVhdENvdW50IFtPcHRpb25hXSBOdW1iZXIgb2YgdGltZXMgdG8gcmVwZWF0IHRoZSBlbGVtZW50LiBJZiBub3Qgc3BlY2lmaWVkLCByZXBlYXRzIGluZGVmaW5pdGVseS5cbiAgICogQHBhcmFtIHtTY2hlZHVsZXJ9IHNjaGVkdWxlciBTY2hlZHVsZXIgdG8gcnVuIHRoZSBwcm9kdWNlciBsb29wIG9uLiBJZiBub3Qgc3BlY2lmaWVkLCBkZWZhdWx0cyB0byBTY2hlZHVsZXIuaW1tZWRpYXRlLlxuICAgKiBAcmV0dXJucyB7T2JzZXJ2YWJsZX0gQW4gb2JzZXJ2YWJsZSBzZXF1ZW5jZSB0aGF0IHJlcGVhdHMgdGhlIGdpdmVuIGVsZW1lbnQgdGhlIHNwZWNpZmllZCBudW1iZXIgb2YgdGltZXMuXG4gICAqL1xuICBPYnNlcnZhYmxlLnJlcGVhdCA9IGZ1bmN0aW9uICh2YWx1ZSwgcmVwZWF0Q291bnQsIHNjaGVkdWxlcikge1xuICAgIGlzU2NoZWR1bGVyKHNjaGVkdWxlcikgfHwgKHNjaGVkdWxlciA9IGN1cnJlbnRUaHJlYWRTY2hlZHVsZXIpO1xuICAgIHJldHVybiBuZXcgUmVwZWF0T2JzZXJ2YWJsZSh2YWx1ZSwgcmVwZWF0Q291bnQsIHNjaGVkdWxlcik7XG4gIH07XG5cbiAgdmFyIEp1c3RPYnNlcnZhYmxlID0gKGZ1bmN0aW9uKF9fc3VwZXJfXykge1xuICAgIGluaGVyaXRzKEp1c3RPYnNlcnZhYmxlLCBfX3N1cGVyX18pO1xuICAgIGZ1bmN0aW9uIEp1c3RPYnNlcnZhYmxlKHZhbHVlLCBzY2hlZHVsZXIpIHtcbiAgICAgIHRoaXMuX3ZhbHVlID0gdmFsdWU7XG4gICAgICB0aGlzLl9zY2hlZHVsZXIgPSBzY2hlZHVsZXI7XG4gICAgICBfX3N1cGVyX18uY2FsbCh0aGlzKTtcbiAgICB9XG5cbiAgICBKdXN0T2JzZXJ2YWJsZS5wcm90b3R5cGUuc3Vic2NyaWJlQ29yZSA9IGZ1bmN0aW9uIChvKSB7XG4gICAgICB2YXIgc3RhdGUgPSBbdGhpcy5fdmFsdWUsIG9dO1xuICAgICAgcmV0dXJuIHRoaXMuX3NjaGVkdWxlciA9PT0gaW1tZWRpYXRlU2NoZWR1bGVyID9cbiAgICAgICAgc2NoZWR1bGVJdGVtKG51bGwsIHN0YXRlKSA6XG4gICAgICAgIHRoaXMuX3NjaGVkdWxlci5zY2hlZHVsZShzdGF0ZSwgc2NoZWR1bGVJdGVtKTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gc2NoZWR1bGVJdGVtKHMsIHN0YXRlKSB7XG4gICAgICB2YXIgdmFsdWUgPSBzdGF0ZVswXSwgb2JzZXJ2ZXIgPSBzdGF0ZVsxXTtcbiAgICAgIG9ic2VydmVyLm9uTmV4dCh2YWx1ZSk7XG4gICAgICBvYnNlcnZlci5vbkNvbXBsZXRlZCgpO1xuICAgICAgcmV0dXJuIGRpc3Bvc2FibGVFbXB0eTtcbiAgICB9XG5cbiAgICByZXR1cm4gSnVzdE9ic2VydmFibGU7XG4gIH0oT2JzZXJ2YWJsZUJhc2UpKTtcblxuICAvKipcbiAgICogIFJldHVybnMgYW4gb2JzZXJ2YWJsZSBzZXF1ZW5jZSB0aGF0IGNvbnRhaW5zIGEgc2luZ2xlIGVsZW1lbnQsIHVzaW5nIHRoZSBzcGVjaWZpZWQgc2NoZWR1bGVyIHRvIHNlbmQgb3V0IG9ic2VydmVyIG1lc3NhZ2VzLlxuICAgKiAgVGhlcmUgaXMgYW4gYWxpYXMgY2FsbGVkICdqdXN0JyBvciBicm93c2VycyA8SUU5LlxuICAgKiBAcGFyYW0ge01peGVkfSB2YWx1ZSBTaW5nbGUgZWxlbWVudCBpbiB0aGUgcmVzdWx0aW5nIG9ic2VydmFibGUgc2VxdWVuY2UuXG4gICAqIEBwYXJhbSB7U2NoZWR1bGVyfSBzY2hlZHVsZXIgU2NoZWR1bGVyIHRvIHNlbmQgdGhlIHNpbmdsZSBlbGVtZW50IG9uLiBJZiBub3Qgc3BlY2lmaWVkLCBkZWZhdWx0cyB0byBTY2hlZHVsZXIuaW1tZWRpYXRlLlxuICAgKiBAcmV0dXJucyB7T2JzZXJ2YWJsZX0gQW4gb2JzZXJ2YWJsZSBzZXF1ZW5jZSBjb250YWluaW5nIHRoZSBzaW5nbGUgc3BlY2lmaWVkIGVsZW1lbnQuXG4gICAqL1xuICB2YXIgb2JzZXJ2YWJsZVJldHVybiA9IE9ic2VydmFibGVbJ3JldHVybiddID0gT2JzZXJ2YWJsZS5qdXN0ID0gZnVuY3Rpb24gKHZhbHVlLCBzY2hlZHVsZXIpIHtcbiAgICBpc1NjaGVkdWxlcihzY2hlZHVsZXIpIHx8IChzY2hlZHVsZXIgPSBpbW1lZGlhdGVTY2hlZHVsZXIpO1xuICAgIHJldHVybiBuZXcgSnVzdE9ic2VydmFibGUodmFsdWUsIHNjaGVkdWxlcik7XG4gIH07XG5cbiAgdmFyIFRocm93T2JzZXJ2YWJsZSA9IChmdW5jdGlvbihfX3N1cGVyX18pIHtcbiAgICBpbmhlcml0cyhUaHJvd09ic2VydmFibGUsIF9fc3VwZXJfXyk7XG4gICAgZnVuY3Rpb24gVGhyb3dPYnNlcnZhYmxlKGVycm9yLCBzY2hlZHVsZXIpIHtcbiAgICAgIHRoaXMuX2Vycm9yID0gZXJyb3I7XG4gICAgICB0aGlzLl9zY2hlZHVsZXIgPSBzY2hlZHVsZXI7XG4gICAgICBfX3N1cGVyX18uY2FsbCh0aGlzKTtcbiAgICB9XG5cbiAgICBUaHJvd09ic2VydmFibGUucHJvdG90eXBlLnN1YnNjcmliZUNvcmUgPSBmdW5jdGlvbiAobykge1xuICAgICAgdmFyIHN0YXRlID0gW3RoaXMuX2Vycm9yLCBvXTtcbiAgICAgIHJldHVybiB0aGlzLl9zY2hlZHVsZXIgPT09IGltbWVkaWF0ZVNjaGVkdWxlciA/XG4gICAgICAgIHNjaGVkdWxlSXRlbShudWxsLCBzdGF0ZSkgOlxuICAgICAgICB0aGlzLl9zY2hlZHVsZXIuc2NoZWR1bGUoc3RhdGUsIHNjaGVkdWxlSXRlbSk7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIHNjaGVkdWxlSXRlbShzLCBzdGF0ZSkge1xuICAgICAgdmFyIGUgPSBzdGF0ZVswXSwgbyA9IHN0YXRlWzFdO1xuICAgICAgby5vbkVycm9yKGUpO1xuICAgICAgcmV0dXJuIGRpc3Bvc2FibGVFbXB0eTtcbiAgICB9XG5cbiAgICByZXR1cm4gVGhyb3dPYnNlcnZhYmxlO1xuICB9KE9ic2VydmFibGVCYXNlKSk7XG5cbiAgLyoqXG4gICAqICBSZXR1cm5zIGFuIG9ic2VydmFibGUgc2VxdWVuY2UgdGhhdCB0ZXJtaW5hdGVzIHdpdGggYW4gZXhjZXB0aW9uLCB1c2luZyB0aGUgc3BlY2lmaWVkIHNjaGVkdWxlciB0byBzZW5kIG91dCB0aGUgc2luZ2xlIG9uRXJyb3IgbWVzc2FnZS5cbiAgICogIFRoZXJlIGlzIGFuIGFsaWFzIHRvIHRoaXMgbWV0aG9kIGNhbGxlZCAndGhyb3dFcnJvcicgZm9yIGJyb3dzZXJzIDxJRTkuXG4gICAqIEBwYXJhbSB7TWl4ZWR9IGVycm9yIEFuIG9iamVjdCB1c2VkIGZvciB0aGUgc2VxdWVuY2UncyB0ZXJtaW5hdGlvbi5cbiAgICogQHBhcmFtIHtTY2hlZHVsZXJ9IHNjaGVkdWxlciBTY2hlZHVsZXIgdG8gc2VuZCB0aGUgZXhjZXB0aW9uYWwgdGVybWluYXRpb24gY2FsbCBvbi4gSWYgbm90IHNwZWNpZmllZCwgZGVmYXVsdHMgdG8gU2NoZWR1bGVyLmltbWVkaWF0ZS5cbiAgICogQHJldHVybnMge09ic2VydmFibGV9IFRoZSBvYnNlcnZhYmxlIHNlcXVlbmNlIHRoYXQgdGVybWluYXRlcyBleGNlcHRpb25hbGx5IHdpdGggdGhlIHNwZWNpZmllZCBleGNlcHRpb24gb2JqZWN0LlxuICAgKi9cbiAgdmFyIG9ic2VydmFibGVUaHJvdyA9IE9ic2VydmFibGVbJ3Rocm93J10gPSBmdW5jdGlvbiAoZXJyb3IsIHNjaGVkdWxlcikge1xuICAgIGlzU2NoZWR1bGVyKHNjaGVkdWxlcikgfHwgKHNjaGVkdWxlciA9IGltbWVkaWF0ZVNjaGVkdWxlcik7XG4gICAgcmV0dXJuIG5ldyBUaHJvd09ic2VydmFibGUoZXJyb3IsIHNjaGVkdWxlcik7XG4gIH07XG5cbiAgdmFyIENhdGNoT2JzZXJ2YWJsZSA9IChmdW5jdGlvbiAoX19zdXBlcl9fKSB7XG4gICAgaW5oZXJpdHMoQ2F0Y2hPYnNlcnZhYmxlLCBfX3N1cGVyX18pO1xuICAgIGZ1bmN0aW9uIENhdGNoT2JzZXJ2YWJsZShzb3VyY2UsIGZuKSB7XG4gICAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcbiAgICAgIHRoaXMuX2ZuID0gZm47XG4gICAgICBfX3N1cGVyX18uY2FsbCh0aGlzKTtcbiAgICB9XG5cbiAgICBDYXRjaE9ic2VydmFibGUucHJvdG90eXBlLnN1YnNjcmliZUNvcmUgPSBmdW5jdGlvbiAobykge1xuICAgICAgdmFyIGQxID0gbmV3IFNpbmdsZUFzc2lnbm1lbnREaXNwb3NhYmxlKCksIHN1YnNjcmlwdGlvbiA9IG5ldyBTZXJpYWxEaXNwb3NhYmxlKCk7XG4gICAgICBzdWJzY3JpcHRpb24uc2V0RGlzcG9zYWJsZShkMSk7XG4gICAgICBkMS5zZXREaXNwb3NhYmxlKHRoaXMuc291cmNlLnN1YnNjcmliZShuZXcgQ2F0Y2hPYnNlcnZlcihvLCBzdWJzY3JpcHRpb24sIHRoaXMuX2ZuKSkpO1xuICAgICAgcmV0dXJuIHN1YnNjcmlwdGlvbjtcbiAgICB9O1xuXG4gICAgcmV0dXJuIENhdGNoT2JzZXJ2YWJsZTtcbiAgfShPYnNlcnZhYmxlQmFzZSkpO1xuXG4gIHZhciBDYXRjaE9ic2VydmVyID0gKGZ1bmN0aW9uKF9fc3VwZXJfXykge1xuICAgIGluaGVyaXRzKENhdGNoT2JzZXJ2ZXIsIF9fc3VwZXJfXyk7XG4gICAgZnVuY3Rpb24gQ2F0Y2hPYnNlcnZlcihvLCBzLCBmbikge1xuICAgICAgdGhpcy5fbyA9IG87XG4gICAgICB0aGlzLl9zID0gcztcbiAgICAgIHRoaXMuX2ZuID0gZm47XG4gICAgICBfX3N1cGVyX18uY2FsbCh0aGlzKTtcbiAgICB9XG5cbiAgICBDYXRjaE9ic2VydmVyLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24gKHgpIHsgdGhpcy5fby5vbk5leHQoeCk7IH07XG4gICAgQ2F0Y2hPYnNlcnZlci5wcm90b3R5cGUuY29tcGxldGVkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpcy5fby5vbkNvbXBsZXRlZCgpOyB9O1xuICAgIENhdGNoT2JzZXJ2ZXIucHJvdG90eXBlLmVycm9yID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgIHZhciByZXN1bHQgPSB0cnlDYXRjaCh0aGlzLl9mbikoZSk7XG4gICAgICBpZiAocmVzdWx0ID09PSBlcnJvck9iaikgeyByZXR1cm4gdGhpcy5fby5vbkVycm9yKHJlc3VsdC5lKTsgfVxuICAgICAgaXNQcm9taXNlKHJlc3VsdCkgJiYgKHJlc3VsdCA9IG9ic2VydmFibGVGcm9tUHJvbWlzZShyZXN1bHQpKTtcblxuICAgICAgdmFyIGQgPSBuZXcgU2luZ2xlQXNzaWdubWVudERpc3Bvc2FibGUoKTtcbiAgICAgIHRoaXMuX3Muc2V0RGlzcG9zYWJsZShkKTtcbiAgICAgIGQuc2V0RGlzcG9zYWJsZShyZXN1bHQuc3Vic2NyaWJlKHRoaXMuX28pKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIENhdGNoT2JzZXJ2ZXI7XG4gIH0oQWJzdHJhY3RPYnNlcnZlcikpO1xuXG4gIC8qKlxuICAgKiBDb250aW51ZXMgYW4gb2JzZXJ2YWJsZSBzZXF1ZW5jZSB0aGF0IGlzIHRlcm1pbmF0ZWQgYnkgYW4gZXhjZXB0aW9uIHdpdGggdGhlIG5leHQgb2JzZXJ2YWJsZSBzZXF1ZW5jZS5cbiAgICogQHBhcmFtIHtNaXhlZH0gaGFuZGxlck9yU2Vjb25kIEV4Y2VwdGlvbiBoYW5kbGVyIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhbiBvYnNlcnZhYmxlIHNlcXVlbmNlIGdpdmVuIHRoZSBlcnJvciB0aGF0IG9jY3VycmVkIGluIHRoZSBmaXJzdCBzZXF1ZW5jZSwgb3IgYSBzZWNvbmQgb2JzZXJ2YWJsZSBzZXF1ZW5jZSB1c2VkIHRvIHByb2R1Y2UgcmVzdWx0cyB3aGVuIGFuIGVycm9yIG9jY3VycmVkIGluIHRoZSBmaXJzdCBzZXF1ZW5jZS5cbiAgICogQHJldHVybnMge09ic2VydmFibGV9IEFuIG9ic2VydmFibGUgc2VxdWVuY2UgY29udGFpbmluZyB0aGUgZmlyc3Qgc2VxdWVuY2UncyBlbGVtZW50cywgZm9sbG93ZWQgYnkgdGhlIGVsZW1lbnRzIG9mIHRoZSBoYW5kbGVyIHNlcXVlbmNlIGluIGNhc2UgYW4gZXhjZXB0aW9uIG9jY3VycmVkLlxuICAgKi9cbiAgb2JzZXJ2YWJsZVByb3RvWydjYXRjaCddID0gZnVuY3Rpb24gKGhhbmRsZXJPclNlY29uZCkge1xuICAgIHJldHVybiBpc0Z1bmN0aW9uKGhhbmRsZXJPclNlY29uZCkgPyBuZXcgQ2F0Y2hPYnNlcnZhYmxlKHRoaXMsIGhhbmRsZXJPclNlY29uZCkgOiBvYnNlcnZhYmxlQ2F0Y2goW3RoaXMsIGhhbmRsZXJPclNlY29uZF0pO1xuICB9O1xuXG4gIC8qKlxuICAgKiBDb250aW51ZXMgYW4gb2JzZXJ2YWJsZSBzZXF1ZW5jZSB0aGF0IGlzIHRlcm1pbmF0ZWQgYnkgYW4gZXhjZXB0aW9uIHdpdGggdGhlIG5leHQgb2JzZXJ2YWJsZSBzZXF1ZW5jZS5cbiAgICogQHBhcmFtIHtBcnJheSB8IEFyZ3VtZW50c30gYXJncyBBcmd1bWVudHMgb3IgYW4gYXJyYXkgdG8gdXNlIGFzIHRoZSBuZXh0IHNlcXVlbmNlIGlmIGFuIGVycm9yIG9jY3Vycy5cbiAgICogQHJldHVybnMge09ic2VydmFibGV9IEFuIG9ic2VydmFibGUgc2VxdWVuY2UgY29udGFpbmluZyBlbGVtZW50cyBmcm9tIGNvbnNlY3V0aXZlIHNvdXJjZSBzZXF1ZW5jZXMgdW50aWwgYSBzb3VyY2Ugc2VxdWVuY2UgdGVybWluYXRlcyBzdWNjZXNzZnVsbHkuXG4gICAqL1xuICB2YXIgb2JzZXJ2YWJsZUNhdGNoID0gT2JzZXJ2YWJsZVsnY2F0Y2gnXSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgaXRlbXM7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoYXJndW1lbnRzWzBdKSkge1xuICAgICAgaXRlbXMgPSBhcmd1bWVudHNbMF07XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBsZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgICAgaXRlbXMgPSBuZXcgQXJyYXkobGVuKTtcbiAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykgeyBpdGVtc1tpXSA9IGFyZ3VtZW50c1tpXTsgfVxuICAgIH1cbiAgICByZXR1cm4gZW51bWVyYWJsZU9mKGl0ZW1zKS5jYXRjaEVycm9yKCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIE1lcmdlcyB0aGUgc3BlY2lmaWVkIG9ic2VydmFibGUgc2VxdWVuY2VzIGludG8gb25lIG9ic2VydmFibGUgc2VxdWVuY2UgYnkgdXNpbmcgdGhlIHNlbGVjdG9yIGZ1bmN0aW9uIHdoZW5ldmVyIGFueSBvZiB0aGUgb2JzZXJ2YWJsZSBzZXF1ZW5jZXMgb3IgUHJvbWlzZXMgcHJvZHVjZXMgYW4gZWxlbWVudC5cbiAgICogVGhpcyBjYW4gYmUgaW4gdGhlIGZvcm0gb2YgYW4gYXJndW1lbnQgbGlzdCBvZiBvYnNlcnZhYmxlcyBvciBhbiBhcnJheS5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogMSAtIG9icyA9IG9ic2VydmFibGUuY29tYmluZUxhdGVzdChvYnMxLCBvYnMyLCBvYnMzLCBmdW5jdGlvbiAobzEsIG8yLCBvMykgeyByZXR1cm4gbzEgKyBvMiArIG8zOyB9KTtcbiAgICogMiAtIG9icyA9IG9ic2VydmFibGUuY29tYmluZUxhdGVzdChbb2JzMSwgb2JzMiwgb2JzM10sIGZ1bmN0aW9uIChvMSwgbzIsIG8zKSB7IHJldHVybiBvMSArIG8yICsgbzM7IH0pO1xuICAgKiBAcmV0dXJucyB7T2JzZXJ2YWJsZX0gQW4gb2JzZXJ2YWJsZSBzZXF1ZW5jZSBjb250YWluaW5nIHRoZSByZXN1bHQgb2YgY29tYmluaW5nIGVsZW1lbnRzIG9mIHRoZSBzb3VyY2VzIHVzaW5nIHRoZSBzcGVjaWZpZWQgcmVzdWx0IHNlbGVjdG9yIGZ1bmN0aW9uLlxuICAgKi9cbiAgb2JzZXJ2YWJsZVByb3RvLmNvbWJpbmVMYXRlc3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBuZXcgQXJyYXkobGVuKTtcbiAgICBmb3IodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHsgYXJnc1tpXSA9IGFyZ3VtZW50c1tpXTsgfVxuICAgIGlmIChBcnJheS5pc0FycmF5KGFyZ3NbMF0pKSB7XG4gICAgICBhcmdzWzBdLnVuc2hpZnQodGhpcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFyZ3MudW5zaGlmdCh0aGlzKTtcbiAgICB9XG4gICAgcmV0dXJuIGNvbWJpbmVMYXRlc3QuYXBwbHkodGhpcywgYXJncyk7XG4gIH07XG5cbiAgZnVuY3Rpb24gZmFsc2VGYWN0b3J5KCkgeyByZXR1cm4gZmFsc2U7IH1cbiAgZnVuY3Rpb24gYXJndW1lbnRzVG9BcnJheSgpIHtcbiAgICB2YXIgbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IG5ldyBBcnJheShsZW4pO1xuICAgIGZvcih2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykgeyBhcmdzW2ldID0gYXJndW1lbnRzW2ldOyB9XG4gICAgcmV0dXJuIGFyZ3M7XG4gIH1cblxuICB2YXIgQ29tYmluZUxhdGVzdE9ic2VydmFibGUgPSAoZnVuY3Rpb24oX19zdXBlcl9fKSB7XG4gICAgaW5oZXJpdHMoQ29tYmluZUxhdGVzdE9ic2VydmFibGUsIF9fc3VwZXJfXyk7XG4gICAgZnVuY3Rpb24gQ29tYmluZUxhdGVzdE9ic2VydmFibGUocGFyYW1zLCBjYikge1xuICAgICAgdGhpcy5fcGFyYW1zID0gcGFyYW1zO1xuICAgICAgdGhpcy5fY2IgPSBjYjtcbiAgICAgIF9fc3VwZXJfXy5jYWxsKHRoaXMpO1xuICAgIH1cblxuICAgIENvbWJpbmVMYXRlc3RPYnNlcnZhYmxlLnByb3RvdHlwZS5zdWJzY3JpYmVDb3JlID0gZnVuY3Rpb24ob2JzZXJ2ZXIpIHtcbiAgICAgIHZhciBsZW4gPSB0aGlzLl9wYXJhbXMubGVuZ3RoLFxuICAgICAgICAgIHN1YnNjcmlwdGlvbnMgPSBuZXcgQXJyYXkobGVuKTtcblxuICAgICAgdmFyIHN0YXRlID0ge1xuICAgICAgICBoYXNWYWx1ZTogYXJyYXlJbml0aWFsaXplKGxlbiwgZmFsc2VGYWN0b3J5KSxcbiAgICAgICAgaGFzVmFsdWVBbGw6IGZhbHNlLFxuICAgICAgICBpc0RvbmU6IGFycmF5SW5pdGlhbGl6ZShsZW4sIGZhbHNlRmFjdG9yeSksXG4gICAgICAgIHZhbHVlczogbmV3IEFycmF5KGxlbilcbiAgICAgIH07XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgdmFyIHNvdXJjZSA9IHRoaXMuX3BhcmFtc1tpXSwgc2FkID0gbmV3IFNpbmdsZUFzc2lnbm1lbnREaXNwb3NhYmxlKCk7XG4gICAgICAgIHN1YnNjcmlwdGlvbnNbaV0gPSBzYWQ7XG4gICAgICAgIGlzUHJvbWlzZShzb3VyY2UpICYmIChzb3VyY2UgPSBvYnNlcnZhYmxlRnJvbVByb21pc2Uoc291cmNlKSk7XG4gICAgICAgIHNhZC5zZXREaXNwb3NhYmxlKHNvdXJjZS5zdWJzY3JpYmUobmV3IENvbWJpbmVMYXRlc3RPYnNlcnZlcihvYnNlcnZlciwgaSwgdGhpcy5fY2IsIHN0YXRlKSkpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbmV3IE5BcnlEaXNwb3NhYmxlKHN1YnNjcmlwdGlvbnMpO1xuICAgIH07XG5cbiAgICByZXR1cm4gQ29tYmluZUxhdGVzdE9ic2VydmFibGU7XG4gIH0oT2JzZXJ2YWJsZUJhc2UpKTtcblxuICB2YXIgQ29tYmluZUxhdGVzdE9ic2VydmVyID0gKGZ1bmN0aW9uIChfX3N1cGVyX18pIHtcbiAgICBpbmhlcml0cyhDb21iaW5lTGF0ZXN0T2JzZXJ2ZXIsIF9fc3VwZXJfXyk7XG4gICAgZnVuY3Rpb24gQ29tYmluZUxhdGVzdE9ic2VydmVyKG8sIGksIGNiLCBzdGF0ZSkge1xuICAgICAgdGhpcy5fbyA9IG87XG4gICAgICB0aGlzLl9pID0gaTtcbiAgICAgIHRoaXMuX2NiID0gY2I7XG4gICAgICB0aGlzLl9zdGF0ZSA9IHN0YXRlO1xuICAgICAgX19zdXBlcl9fLmNhbGwodGhpcyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbm90VGhlU2FtZShpKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKHgsIGopIHtcbiAgICAgICAgcmV0dXJuIGogIT09IGk7XG4gICAgICB9O1xuICAgIH1cblxuICAgIENvbWJpbmVMYXRlc3RPYnNlcnZlci5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uICh4KSB7XG4gICAgICB0aGlzLl9zdGF0ZS52YWx1ZXNbdGhpcy5faV0gPSB4O1xuICAgICAgdGhpcy5fc3RhdGUuaGFzVmFsdWVbdGhpcy5faV0gPSB0cnVlO1xuICAgICAgaWYgKHRoaXMuX3N0YXRlLmhhc1ZhbHVlQWxsIHx8ICh0aGlzLl9zdGF0ZS5oYXNWYWx1ZUFsbCA9IHRoaXMuX3N0YXRlLmhhc1ZhbHVlLmV2ZXJ5KGlkZW50aXR5KSkpIHtcbiAgICAgICAgdmFyIHJlcyA9IHRyeUNhdGNoKHRoaXMuX2NiKS5hcHBseShudWxsLCB0aGlzLl9zdGF0ZS52YWx1ZXMpO1xuICAgICAgICBpZiAocmVzID09PSBlcnJvck9iaikgeyByZXR1cm4gdGhpcy5fby5vbkVycm9yKHJlcy5lKTsgfVxuICAgICAgICB0aGlzLl9vLm9uTmV4dChyZXMpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLl9zdGF0ZS5pc0RvbmUuZmlsdGVyKG5vdFRoZVNhbWUodGhpcy5faSkpLmV2ZXJ5KGlkZW50aXR5KSkge1xuICAgICAgICB0aGlzLl9vLm9uQ29tcGxldGVkKCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIENvbWJpbmVMYXRlc3RPYnNlcnZlci5wcm90b3R5cGUuZXJyb3IgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgdGhpcy5fby5vbkVycm9yKGUpO1xuICAgIH07XG5cbiAgICBDb21iaW5lTGF0ZXN0T2JzZXJ2ZXIucHJvdG90eXBlLmNvbXBsZXRlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuX3N0YXRlLmlzRG9uZVt0aGlzLl9pXSA9IHRydWU7XG4gICAgICB0aGlzLl9zdGF0ZS5pc0RvbmUuZXZlcnkoaWRlbnRpdHkpICYmIHRoaXMuX28ub25Db21wbGV0ZWQoKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIENvbWJpbmVMYXRlc3RPYnNlcnZlcjtcbiAgfShBYnN0cmFjdE9ic2VydmVyKSk7XG5cbiAgLyoqXG4gICogTWVyZ2VzIHRoZSBzcGVjaWZpZWQgb2JzZXJ2YWJsZSBzZXF1ZW5jZXMgaW50byBvbmUgb2JzZXJ2YWJsZSBzZXF1ZW5jZSBieSB1c2luZyB0aGUgc2VsZWN0b3IgZnVuY3Rpb24gd2hlbmV2ZXIgYW55IG9mIHRoZSBvYnNlcnZhYmxlIHNlcXVlbmNlcyBvciBQcm9taXNlcyBwcm9kdWNlcyBhbiBlbGVtZW50LlxuICAqXG4gICogQGV4YW1wbGVcbiAgKiAxIC0gb2JzID0gUnguT2JzZXJ2YWJsZS5jb21iaW5lTGF0ZXN0KG9iczEsIG9iczIsIG9iczMsIGZ1bmN0aW9uIChvMSwgbzIsIG8zKSB7IHJldHVybiBvMSArIG8yICsgbzM7IH0pO1xuICAqIDIgLSBvYnMgPSBSeC5PYnNlcnZhYmxlLmNvbWJpbmVMYXRlc3QoW29iczEsIG9iczIsIG9iczNdLCBmdW5jdGlvbiAobzEsIG8yLCBvMykgeyByZXR1cm4gbzEgKyBvMiArIG8zOyB9KTtcbiAgKiBAcmV0dXJucyB7T2JzZXJ2YWJsZX0gQW4gb2JzZXJ2YWJsZSBzZXF1ZW5jZSBjb250YWluaW5nIHRoZSByZXN1bHQgb2YgY29tYmluaW5nIGVsZW1lbnRzIG9mIHRoZSBzb3VyY2VzIHVzaW5nIHRoZSBzcGVjaWZpZWQgcmVzdWx0IHNlbGVjdG9yIGZ1bmN0aW9uLlxuICAqL1xuICB2YXIgY29tYmluZUxhdGVzdCA9IE9ic2VydmFibGUuY29tYmluZUxhdGVzdCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IG5ldyBBcnJheShsZW4pO1xuICAgIGZvcih2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykgeyBhcmdzW2ldID0gYXJndW1lbnRzW2ldOyB9XG4gICAgdmFyIHJlc3VsdFNlbGVjdG9yID0gaXNGdW5jdGlvbihhcmdzW2xlbiAtIDFdKSA/IGFyZ3MucG9wKCkgOiBhcmd1bWVudHNUb0FycmF5O1xuICAgIEFycmF5LmlzQXJyYXkoYXJnc1swXSkgJiYgKGFyZ3MgPSBhcmdzWzBdKTtcbiAgICByZXR1cm4gbmV3IENvbWJpbmVMYXRlc3RPYnNlcnZhYmxlKGFyZ3MsIHJlc3VsdFNlbGVjdG9yKTtcbiAgfTtcblxuICAvKipcbiAgICogQ29uY2F0ZW5hdGVzIGFsbCB0aGUgb2JzZXJ2YWJsZSBzZXF1ZW5jZXMuICBUaGlzIHRha2VzIGluIGVpdGhlciBhbiBhcnJheSBvciB2YXJpYWJsZSBhcmd1bWVudHMgdG8gY29uY2F0ZW5hdGUuXG4gICAqIEByZXR1cm5zIHtPYnNlcnZhYmxlfSBBbiBvYnNlcnZhYmxlIHNlcXVlbmNlIHRoYXQgY29udGFpbnMgdGhlIGVsZW1lbnRzIG9mIGVhY2ggZ2l2ZW4gc2VxdWVuY2UsIGluIHNlcXVlbnRpYWwgb3JkZXIuXG4gICAqL1xuICBvYnNlcnZhYmxlUHJvdG8uY29uY2F0ID0gZnVuY3Rpb24gKCkge1xuICAgIGZvcih2YXIgYXJncyA9IFtdLCBpID0gMCwgbGVuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7IGFyZ3MucHVzaChhcmd1bWVudHNbaV0pOyB9XG4gICAgYXJncy51bnNoaWZ0KHRoaXMpO1xuICAgIHJldHVybiBvYnNlcnZhYmxlQ29uY2F0LmFwcGx5KG51bGwsIGFyZ3MpO1xuICB9O1xuXG4gIHZhciBDb25jYXRPYnNlcnZlciA9IChmdW5jdGlvbihfX3N1cGVyX18pIHtcbiAgICBpbmhlcml0cyhDb25jYXRPYnNlcnZlciwgX19zdXBlcl9fKTtcbiAgICBmdW5jdGlvbiBDb25jYXRPYnNlcnZlcihzLCBmbikge1xuICAgICAgdGhpcy5fcyA9IHM7XG4gICAgICB0aGlzLl9mbiA9IGZuO1xuICAgICAgX19zdXBlcl9fLmNhbGwodGhpcyk7XG4gICAgfVxuXG4gICAgQ29uY2F0T2JzZXJ2ZXIucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbiAoeCkgeyB0aGlzLl9zLm8ub25OZXh0KHgpOyB9O1xuICAgIENvbmNhdE9ic2VydmVyLnByb3RvdHlwZS5lcnJvciA9IGZ1bmN0aW9uIChlKSB7IHRoaXMuX3Muby5vbkVycm9yKGUpOyB9O1xuICAgIENvbmNhdE9ic2VydmVyLnByb3RvdHlwZS5jb21wbGV0ZWQgPSBmdW5jdGlvbiAoKSB7IHRoaXMuX3MuaSsrOyB0aGlzLl9mbih0aGlzLl9zKTsgfTtcblxuICAgIHJldHVybiBDb25jYXRPYnNlcnZlcjtcbiAgfShBYnN0cmFjdE9ic2VydmVyKSk7XG5cbiAgdmFyIENvbmNhdE9ic2VydmFibGUgPSAoZnVuY3Rpb24oX19zdXBlcl9fKSB7XG4gICAgaW5oZXJpdHMoQ29uY2F0T2JzZXJ2YWJsZSwgX19zdXBlcl9fKTtcbiAgICBmdW5jdGlvbiBDb25jYXRPYnNlcnZhYmxlKHNvdXJjZXMpIHtcbiAgICAgIHRoaXMuX3NvdXJjZXMgPSBzb3VyY2VzO1xuICAgICAgX19zdXBlcl9fLmNhbGwodGhpcyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2NoZWR1bGVSZWN1cnNpdmUgKHN0YXRlLCByZWN1cnNlKSB7XG4gICAgICBpZiAoc3RhdGUuZGlzcG9zYWJsZS5pc0Rpc3Bvc2VkKSB7IHJldHVybjsgfVxuICAgICAgaWYgKHN0YXRlLmkgPT09IHN0YXRlLnNvdXJjZXMubGVuZ3RoKSB7IHJldHVybiBzdGF0ZS5vLm9uQ29tcGxldGVkKCk7IH1cblxuICAgICAgLy8gQ2hlY2sgaWYgcHJvbWlzZVxuICAgICAgdmFyIGN1cnJlbnRWYWx1ZSA9IHN0YXRlLnNvdXJjZXNbc3RhdGUuaV07XG4gICAgICBpc1Byb21pc2UoY3VycmVudFZhbHVlKSAmJiAoY3VycmVudFZhbHVlID0gb2JzZXJ2YWJsZUZyb21Qcm9taXNlKGN1cnJlbnRWYWx1ZSkpO1xuXG4gICAgICB2YXIgZCA9IG5ldyBTaW5nbGVBc3NpZ25tZW50RGlzcG9zYWJsZSgpO1xuICAgICAgc3RhdGUuc3Vic2NyaXB0aW9uLnNldERpc3Bvc2FibGUoZCk7XG4gICAgICBkLnNldERpc3Bvc2FibGUoY3VycmVudFZhbHVlLnN1YnNjcmliZShuZXcgQ29uY2F0T2JzZXJ2ZXIoc3RhdGUsIHJlY3Vyc2UpKSk7XG4gICAgfVxuXG4gICAgQ29uY2F0T2JzZXJ2YWJsZS5wcm90b3R5cGUuc3Vic2NyaWJlQ29yZSA9IGZ1bmN0aW9uKG8pIHtcbiAgICAgIHZhciBzdWJzY3JpcHRpb24gPSBuZXcgU2VyaWFsRGlzcG9zYWJsZSgpO1xuICAgICAgdmFyIGRpc3Bvc2FibGUgPSBkaXNwb3NhYmxlQ3JlYXRlKG5vb3ApO1xuICAgICAgdmFyIHN0YXRlID0ge1xuICAgICAgICBvOiBvLFxuICAgICAgICBpOiAwLFxuICAgICAgICBzdWJzY3JpcHRpb246IHN1YnNjcmlwdGlvbixcbiAgICAgICAgZGlzcG9zYWJsZTogZGlzcG9zYWJsZSxcbiAgICAgICAgc291cmNlczogdGhpcy5fc291cmNlc1xuICAgICAgfTtcblxuICAgICAgdmFyIGNhbmNlbGFibGUgPSBpbW1lZGlhdGVTY2hlZHVsZXIuc2NoZWR1bGVSZWN1cnNpdmUoc3RhdGUsIHNjaGVkdWxlUmVjdXJzaXZlKTtcbiAgICAgIHJldHVybiBuZXcgTkFyeURpc3Bvc2FibGUoW3N1YnNjcmlwdGlvbiwgZGlzcG9zYWJsZSwgY2FuY2VsYWJsZV0pO1xuICAgIH07XG5cbiAgICByZXR1cm4gQ29uY2F0T2JzZXJ2YWJsZTtcbiAgfShPYnNlcnZhYmxlQmFzZSkpO1xuXG4gIC8qKlxuICAgKiBDb25jYXRlbmF0ZXMgYWxsIHRoZSBvYnNlcnZhYmxlIHNlcXVlbmNlcy5cbiAgICogQHBhcmFtIHtBcnJheSB8IEFyZ3VtZW50c30gYXJncyBBcmd1bWVudHMgb3IgYW4gYXJyYXkgdG8gY29uY2F0IHRvIHRoZSBvYnNlcnZhYmxlIHNlcXVlbmNlLlxuICAgKiBAcmV0dXJucyB7T2JzZXJ2YWJsZX0gQW4gb2JzZXJ2YWJsZSBzZXF1ZW5jZSB0aGF0IGNvbnRhaW5zIHRoZSBlbGVtZW50cyBvZiBlYWNoIGdpdmVuIHNlcXVlbmNlLCBpbiBzZXF1ZW50aWFsIG9yZGVyLlxuICAgKi9cbiAgdmFyIG9ic2VydmFibGVDb25jYXQgPSBPYnNlcnZhYmxlLmNvbmNhdCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYXJncztcbiAgICBpZiAoQXJyYXkuaXNBcnJheShhcmd1bWVudHNbMF0pKSB7XG4gICAgICBhcmdzID0gYXJndW1lbnRzWzBdO1xuICAgIH0gZWxzZSB7XG4gICAgICBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGgpO1xuICAgICAgZm9yKHZhciBpID0gMCwgbGVuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7IGFyZ3NbaV0gPSBhcmd1bWVudHNbaV07IH1cbiAgICB9XG4gICAgcmV0dXJuIG5ldyBDb25jYXRPYnNlcnZhYmxlKGFyZ3MpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBDb25jYXRlbmF0ZXMgYW4gb2JzZXJ2YWJsZSBzZXF1ZW5jZSBvZiBvYnNlcnZhYmxlIHNlcXVlbmNlcy5cbiAgICogQHJldHVybnMge09ic2VydmFibGV9IEFuIG9ic2VydmFibGUgc2VxdWVuY2UgdGhhdCBjb250YWlucyB0aGUgZWxlbWVudHMgb2YgZWFjaCBvYnNlcnZlZCBpbm5lciBzZXF1ZW5jZSwgaW4gc2VxdWVudGlhbCBvcmRlci5cbiAgICovXG4gIG9ic2VydmFibGVQcm90by5jb25jYXRBbGwgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMubWVyZ2UoMSk7XG4gIH07XG5cbiAgdmFyIE1lcmdlT2JzZXJ2YWJsZSA9IChmdW5jdGlvbiAoX19zdXBlcl9fKSB7XG4gICAgaW5oZXJpdHMoTWVyZ2VPYnNlcnZhYmxlLCBfX3N1cGVyX18pO1xuXG4gICAgZnVuY3Rpb24gTWVyZ2VPYnNlcnZhYmxlKHNvdXJjZSwgbWF4Q29uY3VycmVudCkge1xuICAgICAgdGhpcy5zb3VyY2UgPSBzb3VyY2U7XG4gICAgICB0aGlzLm1heENvbmN1cnJlbnQgPSBtYXhDb25jdXJyZW50O1xuICAgICAgX19zdXBlcl9fLmNhbGwodGhpcyk7XG4gICAgfVxuXG4gICAgTWVyZ2VPYnNlcnZhYmxlLnByb3RvdHlwZS5zdWJzY3JpYmVDb3JlID0gZnVuY3Rpb24ob2JzZXJ2ZXIpIHtcbiAgICAgIHZhciBnID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcbiAgICAgIGcuYWRkKHRoaXMuc291cmNlLnN1YnNjcmliZShuZXcgTWVyZ2VPYnNlcnZlcihvYnNlcnZlciwgdGhpcy5tYXhDb25jdXJyZW50LCBnKSkpO1xuICAgICAgcmV0dXJuIGc7XG4gICAgfTtcblxuICAgIHJldHVybiBNZXJnZU9ic2VydmFibGU7XG5cbiAgfShPYnNlcnZhYmxlQmFzZSkpO1xuXG4gIHZhciBNZXJnZU9ic2VydmVyID0gKGZ1bmN0aW9uIChfX3N1cGVyX18pIHtcbiAgICBmdW5jdGlvbiBNZXJnZU9ic2VydmVyKG8sIG1heCwgZykge1xuICAgICAgdGhpcy5vID0gbztcbiAgICAgIHRoaXMubWF4ID0gbWF4O1xuICAgICAgdGhpcy5nID0gZztcbiAgICAgIHRoaXMuZG9uZSA9IGZhbHNlO1xuICAgICAgdGhpcy5xID0gW107XG4gICAgICB0aGlzLmFjdGl2ZUNvdW50ID0gMDtcbiAgICAgIF9fc3VwZXJfXy5jYWxsKHRoaXMpO1xuICAgIH1cblxuICAgIGluaGVyaXRzKE1lcmdlT2JzZXJ2ZXIsIF9fc3VwZXJfXyk7XG5cbiAgICBNZXJnZU9ic2VydmVyLnByb3RvdHlwZS5oYW5kbGVTdWJzY3JpYmUgPSBmdW5jdGlvbiAoeHMpIHtcbiAgICAgIHZhciBzYWQgPSBuZXcgU2luZ2xlQXNzaWdubWVudERpc3Bvc2FibGUoKTtcbiAgICAgIHRoaXMuZy5hZGQoc2FkKTtcbiAgICAgIGlzUHJvbWlzZSh4cykgJiYgKHhzID0gb2JzZXJ2YWJsZUZyb21Qcm9taXNlKHhzKSk7XG4gICAgICBzYWQuc2V0RGlzcG9zYWJsZSh4cy5zdWJzY3JpYmUobmV3IElubmVyT2JzZXJ2ZXIodGhpcywgc2FkKSkpO1xuICAgIH07XG5cbiAgICBNZXJnZU9ic2VydmVyLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24gKGlubmVyU291cmNlKSB7XG4gICAgICBpZih0aGlzLmFjdGl2ZUNvdW50IDwgdGhpcy5tYXgpIHtcbiAgICAgICAgdGhpcy5hY3RpdmVDb3VudCsrO1xuICAgICAgICB0aGlzLmhhbmRsZVN1YnNjcmliZShpbm5lclNvdXJjZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnEucHVzaChpbm5lclNvdXJjZSk7XG4gICAgICB9XG4gICAgfTtcbiAgICBNZXJnZU9ic2VydmVyLnByb3RvdHlwZS5lcnJvciA9IGZ1bmN0aW9uIChlKSB7IHRoaXMuby5vbkVycm9yKGUpOyB9O1xuICAgIE1lcmdlT2JzZXJ2ZXIucHJvdG90eXBlLmNvbXBsZXRlZCA9IGZ1bmN0aW9uICgpIHsgdGhpcy5kb25lID0gdHJ1ZTsgdGhpcy5hY3RpdmVDb3VudCA9PT0gMCAmJiB0aGlzLm8ub25Db21wbGV0ZWQoKTsgfTtcblxuICAgIGZ1bmN0aW9uIElubmVyT2JzZXJ2ZXIocGFyZW50LCBzYWQpIHtcbiAgICAgIHRoaXMucGFyZW50ID0gcGFyZW50O1xuICAgICAgdGhpcy5zYWQgPSBzYWQ7XG4gICAgICBfX3N1cGVyX18uY2FsbCh0aGlzKTtcbiAgICB9XG5cbiAgICBpbmhlcml0cyhJbm5lck9ic2VydmVyLCBfX3N1cGVyX18pO1xuXG4gICAgSW5uZXJPYnNlcnZlci5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uICh4KSB7IHRoaXMucGFyZW50Lm8ub25OZXh0KHgpOyB9O1xuICAgIElubmVyT2JzZXJ2ZXIucHJvdG90eXBlLmVycm9yID0gZnVuY3Rpb24gKGUpIHsgdGhpcy5wYXJlbnQuby5vbkVycm9yKGUpOyB9O1xuICAgIElubmVyT2JzZXJ2ZXIucHJvdG90eXBlLmNvbXBsZXRlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMucGFyZW50LmcucmVtb3ZlKHRoaXMuc2FkKTtcbiAgICAgIGlmICh0aGlzLnBhcmVudC5xLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdGhpcy5wYXJlbnQuaGFuZGxlU3Vic2NyaWJlKHRoaXMucGFyZW50LnEuc2hpZnQoKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnBhcmVudC5hY3RpdmVDb3VudC0tO1xuICAgICAgICB0aGlzLnBhcmVudC5kb25lICYmIHRoaXMucGFyZW50LmFjdGl2ZUNvdW50ID09PSAwICYmIHRoaXMucGFyZW50Lm8ub25Db21wbGV0ZWQoKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIE1lcmdlT2JzZXJ2ZXI7XG4gIH0oQWJzdHJhY3RPYnNlcnZlcikpO1xuXG4gIC8qKlxuICAqIE1lcmdlcyBhbiBvYnNlcnZhYmxlIHNlcXVlbmNlIG9mIG9ic2VydmFibGUgc2VxdWVuY2VzIGludG8gYW4gb2JzZXJ2YWJsZSBzZXF1ZW5jZSwgbGltaXRpbmcgdGhlIG51bWJlciBvZiBjb25jdXJyZW50IHN1YnNjcmlwdGlvbnMgdG8gaW5uZXIgc2VxdWVuY2VzLlxuICAqIE9yIG1lcmdlcyB0d28gb2JzZXJ2YWJsZSBzZXF1ZW5jZXMgaW50byBhIHNpbmdsZSBvYnNlcnZhYmxlIHNlcXVlbmNlLlxuICAqIEBwYXJhbSB7TWl4ZWR9IFttYXhDb25jdXJyZW50T3JPdGhlcl0gTWF4aW11bSBudW1iZXIgb2YgaW5uZXIgb2JzZXJ2YWJsZSBzZXF1ZW5jZXMgYmVpbmcgc3Vic2NyaWJlZCB0byBjb25jdXJyZW50bHkgb3IgdGhlIHNlY29uZCBvYnNlcnZhYmxlIHNlcXVlbmNlLlxuICAqIEByZXR1cm5zIHtPYnNlcnZhYmxlfSBUaGUgb2JzZXJ2YWJsZSBzZXF1ZW5jZSB0aGF0IG1lcmdlcyB0aGUgZWxlbWVudHMgb2YgdGhlIGlubmVyIHNlcXVlbmNlcy5cbiAgKi9cbiAgb2JzZXJ2YWJsZVByb3RvLm1lcmdlID0gZnVuY3Rpb24gKG1heENvbmN1cnJlbnRPck90aGVyKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBtYXhDb25jdXJyZW50T3JPdGhlciAhPT0gJ251bWJlcicgP1xuICAgICAgb2JzZXJ2YWJsZU1lcmdlKHRoaXMsIG1heENvbmN1cnJlbnRPck90aGVyKSA6XG4gICAgICBuZXcgTWVyZ2VPYnNlcnZhYmxlKHRoaXMsIG1heENvbmN1cnJlbnRPck90aGVyKTtcbiAgfTtcblxuICAvKipcbiAgICogTWVyZ2VzIGFsbCB0aGUgb2JzZXJ2YWJsZSBzZXF1ZW5jZXMgaW50byBhIHNpbmdsZSBvYnNlcnZhYmxlIHNlcXVlbmNlLlxuICAgKiBUaGUgc2NoZWR1bGVyIGlzIG9wdGlvbmFsIGFuZCBpZiBub3Qgc3BlY2lmaWVkLCB0aGUgaW1tZWRpYXRlIHNjaGVkdWxlciBpcyB1c2VkLlxuICAgKiBAcmV0dXJucyB7T2JzZXJ2YWJsZX0gVGhlIG9ic2VydmFibGUgc2VxdWVuY2UgdGhhdCBtZXJnZXMgdGhlIGVsZW1lbnRzIG9mIHRoZSBvYnNlcnZhYmxlIHNlcXVlbmNlcy5cbiAgICovXG4gIHZhciBvYnNlcnZhYmxlTWVyZ2UgPSBPYnNlcnZhYmxlLm1lcmdlID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBzY2hlZHVsZXIsIHNvdXJjZXMgPSBbXSwgaSwgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICBpZiAoIWFyZ3VtZW50c1swXSkge1xuICAgICAgc2NoZWR1bGVyID0gaW1tZWRpYXRlU2NoZWR1bGVyO1xuICAgICAgZm9yKGkgPSAxOyBpIDwgbGVuOyBpKyspIHsgc291cmNlcy5wdXNoKGFyZ3VtZW50c1tpXSk7IH1cbiAgICB9IGVsc2UgaWYgKGlzU2NoZWR1bGVyKGFyZ3VtZW50c1swXSkpIHtcbiAgICAgIHNjaGVkdWxlciA9IGFyZ3VtZW50c1swXTtcbiAgICAgIGZvcihpID0gMTsgaSA8IGxlbjsgaSsrKSB7IHNvdXJjZXMucHVzaChhcmd1bWVudHNbaV0pOyB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHNjaGVkdWxlciA9IGltbWVkaWF0ZVNjaGVkdWxlcjtcbiAgICAgIGZvcihpID0gMDsgaSA8IGxlbjsgaSsrKSB7IHNvdXJjZXMucHVzaChhcmd1bWVudHNbaV0pOyB9XG4gICAgfVxuICAgIGlmIChBcnJheS5pc0FycmF5KHNvdXJjZXNbMF0pKSB7XG4gICAgICBzb3VyY2VzID0gc291cmNlc1swXTtcbiAgICB9XG4gICAgcmV0dXJuIG9ic2VydmFibGVPZihzY2hlZHVsZXIsIHNvdXJjZXMpLm1lcmdlQWxsKCk7XG4gIH07XG5cbiAgdmFyIENvbXBvc2l0ZUVycm9yID0gUnguQ29tcG9zaXRlRXJyb3IgPSBmdW5jdGlvbihlcnJvcnMpIHtcbiAgICB0aGlzLmlubmVyRXJyb3JzID0gZXJyb3JzO1xuICAgIHRoaXMubWVzc2FnZSA9ICdUaGlzIGNvbnRhaW5zIG11bHRpcGxlIGVycm9ycy4gQ2hlY2sgdGhlIGlubmVyRXJyb3JzJztcbiAgICBFcnJvci5jYWxsKHRoaXMpO1xuICB9O1xuICBDb21wb3NpdGVFcnJvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEVycm9yLnByb3RvdHlwZSk7XG4gIENvbXBvc2l0ZUVycm9yLnByb3RvdHlwZS5uYW1lID0gJ0NvbXBvc2l0ZUVycm9yJztcblxuICB2YXIgTWVyZ2VEZWxheUVycm9yT2JzZXJ2YWJsZSA9IChmdW5jdGlvbihfX3N1cGVyX18pIHtcbiAgICBpbmhlcml0cyhNZXJnZURlbGF5RXJyb3JPYnNlcnZhYmxlLCBfX3N1cGVyX18pO1xuICAgIGZ1bmN0aW9uIE1lcmdlRGVsYXlFcnJvck9ic2VydmFibGUoc291cmNlKSB7XG4gICAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcbiAgICAgIF9fc3VwZXJfXy5jYWxsKHRoaXMpO1xuICAgIH1cblxuICAgIE1lcmdlRGVsYXlFcnJvck9ic2VydmFibGUucHJvdG90eXBlLnN1YnNjcmliZUNvcmUgPSBmdW5jdGlvbiAobykge1xuICAgICAgdmFyIGdyb3VwID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKSxcbiAgICAgICAgbSA9IG5ldyBTaW5nbGVBc3NpZ25tZW50RGlzcG9zYWJsZSgpLFxuICAgICAgICBzdGF0ZSA9IHsgaXNTdG9wcGVkOiBmYWxzZSwgZXJyb3JzOiBbXSwgbzogbyB9O1xuXG4gICAgICBncm91cC5hZGQobSk7XG4gICAgICBtLnNldERpc3Bvc2FibGUodGhpcy5zb3VyY2Uuc3Vic2NyaWJlKG5ldyBNZXJnZURlbGF5RXJyb3JPYnNlcnZlcihncm91cCwgc3RhdGUpKSk7XG5cbiAgICAgIHJldHVybiBncm91cDtcbiAgICB9O1xuXG4gICAgcmV0dXJuIE1lcmdlRGVsYXlFcnJvck9ic2VydmFibGU7XG4gIH0oT2JzZXJ2YWJsZUJhc2UpKTtcblxuICB2YXIgTWVyZ2VEZWxheUVycm9yT2JzZXJ2ZXIgPSAoZnVuY3Rpb24oX19zdXBlcl9fKSB7XG4gICAgaW5oZXJpdHMoTWVyZ2VEZWxheUVycm9yT2JzZXJ2ZXIsIF9fc3VwZXJfXyk7XG4gICAgZnVuY3Rpb24gTWVyZ2VEZWxheUVycm9yT2JzZXJ2ZXIoZ3JvdXAsIHN0YXRlKSB7XG4gICAgICB0aGlzLl9ncm91cCA9IGdyb3VwO1xuICAgICAgdGhpcy5fc3RhdGUgPSBzdGF0ZTtcbiAgICAgIF9fc3VwZXJfXy5jYWxsKHRoaXMpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNldENvbXBsZXRpb24obywgZXJyb3JzKSB7XG4gICAgICBpZiAoZXJyb3JzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBvLm9uQ29tcGxldGVkKCk7XG4gICAgICB9IGVsc2UgaWYgKGVycm9ycy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgby5vbkVycm9yKGVycm9yc1swXSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvLm9uRXJyb3IobmV3IENvbXBvc2l0ZUVycm9yKGVycm9ycykpO1xuICAgICAgfVxuICAgIH1cblxuICAgIE1lcmdlRGVsYXlFcnJvck9ic2VydmVyLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24gKHgpIHtcbiAgICAgIHZhciBpbm5lciA9IG5ldyBTaW5nbGVBc3NpZ25tZW50RGlzcG9zYWJsZSgpO1xuICAgICAgdGhpcy5fZ3JvdXAuYWRkKGlubmVyKTtcblxuICAgICAgLy8gQ2hlY2sgZm9yIHByb21pc2VzIHN1cHBvcnRcbiAgICAgIGlzUHJvbWlzZSh4KSAmJiAoeCA9IG9ic2VydmFibGVGcm9tUHJvbWlzZSh4KSk7XG4gICAgICBpbm5lci5zZXREaXNwb3NhYmxlKHguc3Vic2NyaWJlKG5ldyBJbm5lck9ic2VydmVyKGlubmVyLCB0aGlzLl9ncm91cCwgdGhpcy5fc3RhdGUpKSk7XG4gICAgfTtcblxuICAgIE1lcmdlRGVsYXlFcnJvck9ic2VydmVyLnByb3RvdHlwZS5lcnJvciA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICB0aGlzLl9zdGF0ZS5lcnJvcnMucHVzaChlKTtcbiAgICAgIHRoaXMuX3N0YXRlLmlzU3RvcHBlZCA9IHRydWU7XG4gICAgICB0aGlzLl9ncm91cC5sZW5ndGggPT09IDEgJiYgc2V0Q29tcGxldGlvbih0aGlzLl9zdGF0ZS5vLCB0aGlzLl9zdGF0ZS5lcnJvcnMpO1xuICAgIH07XG5cbiAgICBNZXJnZURlbGF5RXJyb3JPYnNlcnZlci5wcm90b3R5cGUuY29tcGxldGVkID0gZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5fc3RhdGUuaXNTdG9wcGVkID0gdHJ1ZTtcbiAgICAgIHRoaXMuX2dyb3VwLmxlbmd0aCA9PT0gMSAmJiBzZXRDb21wbGV0aW9uKHRoaXMuX3N0YXRlLm8sIHRoaXMuX3N0YXRlLmVycm9ycyk7XG4gICAgfTtcblxuICAgIGluaGVyaXRzKElubmVyT2JzZXJ2ZXIsIF9fc3VwZXJfXyk7XG4gICAgZnVuY3Rpb24gSW5uZXJPYnNlcnZlcihpbm5lciwgZ3JvdXAsIHN0YXRlKSB7XG4gICAgICB0aGlzLl9pbm5lciA9IGlubmVyO1xuICAgICAgdGhpcy5fZ3JvdXAgPSBncm91cDtcbiAgICAgIHRoaXMuX3N0YXRlID0gc3RhdGU7XG4gICAgICBfX3N1cGVyX18uY2FsbCh0aGlzKTtcbiAgICB9XG5cbiAgICBJbm5lck9ic2VydmVyLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24gKHgpIHsgdGhpcy5fc3RhdGUuby5vbk5leHQoeCk7IH07XG4gICAgSW5uZXJPYnNlcnZlci5wcm90b3R5cGUuZXJyb3IgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgdGhpcy5fc3RhdGUuZXJyb3JzLnB1c2goZSk7XG4gICAgICB0aGlzLl9ncm91cC5yZW1vdmUodGhpcy5faW5uZXIpO1xuICAgICAgdGhpcy5fc3RhdGUuaXNTdG9wcGVkICYmIHRoaXMuX2dyb3VwLmxlbmd0aCA9PT0gMSAmJiBzZXRDb21wbGV0aW9uKHRoaXMuX3N0YXRlLm8sIHRoaXMuX3N0YXRlLmVycm9ycyk7XG4gICAgfTtcbiAgICBJbm5lck9ic2VydmVyLnByb3RvdHlwZS5jb21wbGV0ZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLl9ncm91cC5yZW1vdmUodGhpcy5faW5uZXIpO1xuICAgICAgdGhpcy5fc3RhdGUuaXNTdG9wcGVkICYmIHRoaXMuX2dyb3VwLmxlbmd0aCA9PT0gMSAmJiBzZXRDb21wbGV0aW9uKHRoaXMuX3N0YXRlLm8sIHRoaXMuX3N0YXRlLmVycm9ycyk7XG4gICAgfTtcblxuICAgIHJldHVybiBNZXJnZURlbGF5RXJyb3JPYnNlcnZlcjtcbiAgfShBYnN0cmFjdE9ic2VydmVyKSk7XG5cbiAgLyoqXG4gICogRmxhdHRlbnMgYW4gT2JzZXJ2YWJsZSB0aGF0IGVtaXRzIE9ic2VydmFibGVzIGludG8gb25lIE9ic2VydmFibGUsIGluIGEgd2F5IHRoYXQgYWxsb3dzIGFuIE9ic2VydmVyIHRvXG4gICogcmVjZWl2ZSBhbGwgc3VjY2Vzc2Z1bGx5IGVtaXR0ZWQgaXRlbXMgZnJvbSBhbGwgb2YgdGhlIHNvdXJjZSBPYnNlcnZhYmxlcyB3aXRob3V0IGJlaW5nIGludGVycnVwdGVkIGJ5XG4gICogYW4gZXJyb3Igbm90aWZpY2F0aW9uIGZyb20gb25lIG9mIHRoZW0uXG4gICpcbiAgKiBUaGlzIGJlaGF2ZXMgbGlrZSBPYnNlcnZhYmxlLnByb3RvdHlwZS5tZXJnZUFsbCBleGNlcHQgdGhhdCBpZiBhbnkgb2YgdGhlIG1lcmdlZCBPYnNlcnZhYmxlcyBub3RpZnkgb2YgYW5cbiAgKiBlcnJvciB2aWEgdGhlIE9ic2VydmVyJ3Mgb25FcnJvciwgbWVyZ2VEZWxheUVycm9yIHdpbGwgcmVmcmFpbiBmcm9tIHByb3BhZ2F0aW5nIHRoYXRcbiAgKiBlcnJvciBub3RpZmljYXRpb24gdW50aWwgYWxsIG9mIHRoZSBtZXJnZWQgT2JzZXJ2YWJsZXMgaGF2ZSBmaW5pc2hlZCBlbWl0dGluZyBpdGVtcy5cbiAgKiBAcGFyYW0ge0FycmF5IHwgQXJndW1lbnRzfSBhcmdzIEFyZ3VtZW50cyBvciBhbiBhcnJheSB0byBtZXJnZS5cbiAgKiBAcmV0dXJucyB7T2JzZXJ2YWJsZX0gYW4gT2JzZXJ2YWJsZSB0aGF0IGVtaXRzIGFsbCBvZiB0aGUgaXRlbXMgZW1pdHRlZCBieSB0aGUgT2JzZXJ2YWJsZXMgZW1pdHRlZCBieSB0aGUgT2JzZXJ2YWJsZVxuICAqL1xuICBPYnNlcnZhYmxlLm1lcmdlRGVsYXlFcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhcmdzO1xuICAgIGlmIChBcnJheS5pc0FycmF5KGFyZ3VtZW50c1swXSkpIHtcbiAgICAgIGFyZ3MgPSBhcmd1bWVudHNbMF07XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBsZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgICAgYXJncyA9IG5ldyBBcnJheShsZW4pO1xuICAgICAgZm9yKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7IGFyZ3NbaV0gPSBhcmd1bWVudHNbaV07IH1cbiAgICB9XG4gICAgdmFyIHNvdXJjZSA9IG9ic2VydmFibGVPZihudWxsLCBhcmdzKTtcbiAgICByZXR1cm4gbmV3IE1lcmdlRGVsYXlFcnJvck9ic2VydmFibGUoc291cmNlKTtcbiAgfTtcblxuICB2YXIgTWVyZ2VBbGxPYnNlcnZhYmxlID0gKGZ1bmN0aW9uIChfX3N1cGVyX18pIHtcbiAgICBpbmhlcml0cyhNZXJnZUFsbE9ic2VydmFibGUsIF9fc3VwZXJfXyk7XG5cbiAgICBmdW5jdGlvbiBNZXJnZUFsbE9ic2VydmFibGUoc291cmNlKSB7XG4gICAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcbiAgICAgIF9fc3VwZXJfXy5jYWxsKHRoaXMpO1xuICAgIH1cblxuICAgIE1lcmdlQWxsT2JzZXJ2YWJsZS5wcm90b3R5cGUuc3Vic2NyaWJlQ29yZSA9IGZ1bmN0aW9uIChvKSB7XG4gICAgICB2YXIgZyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCksIG0gPSBuZXcgU2luZ2xlQXNzaWdubWVudERpc3Bvc2FibGUoKTtcbiAgICAgIGcuYWRkKG0pO1xuICAgICAgbS5zZXREaXNwb3NhYmxlKHRoaXMuc291cmNlLnN1YnNjcmliZShuZXcgTWVyZ2VBbGxPYnNlcnZlcihvLCBnKSkpO1xuICAgICAgcmV0dXJuIGc7XG4gICAgfTtcblxuICAgIHJldHVybiBNZXJnZUFsbE9ic2VydmFibGU7XG4gIH0oT2JzZXJ2YWJsZUJhc2UpKTtcblxuICB2YXIgTWVyZ2VBbGxPYnNlcnZlciA9IChmdW5jdGlvbiAoX19zdXBlcl9fKSB7XG4gICAgZnVuY3Rpb24gTWVyZ2VBbGxPYnNlcnZlcihvLCBnKSB7XG4gICAgICB0aGlzLm8gPSBvO1xuICAgICAgdGhpcy5nID0gZztcbiAgICAgIHRoaXMuZG9uZSA9IGZhbHNlO1xuICAgICAgX19zdXBlcl9fLmNhbGwodGhpcyk7XG4gICAgfVxuXG4gICAgaW5oZXJpdHMoTWVyZ2VBbGxPYnNlcnZlciwgX19zdXBlcl9fKTtcblxuICAgIE1lcmdlQWxsT2JzZXJ2ZXIucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbihpbm5lclNvdXJjZSkge1xuICAgICAgdmFyIHNhZCA9IG5ldyBTaW5nbGVBc3NpZ25tZW50RGlzcG9zYWJsZSgpO1xuICAgICAgdGhpcy5nLmFkZChzYWQpO1xuICAgICAgaXNQcm9taXNlKGlubmVyU291cmNlKSAmJiAoaW5uZXJTb3VyY2UgPSBvYnNlcnZhYmxlRnJvbVByb21pc2UoaW5uZXJTb3VyY2UpKTtcbiAgICAgIHNhZC5zZXREaXNwb3NhYmxlKGlubmVyU291cmNlLnN1YnNjcmliZShuZXcgSW5uZXJPYnNlcnZlcih0aGlzLCBzYWQpKSk7XG4gICAgfTtcblxuICAgIE1lcmdlQWxsT2JzZXJ2ZXIucHJvdG90eXBlLmVycm9yID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgIHRoaXMuby5vbkVycm9yKGUpO1xuICAgIH07XG5cbiAgICBNZXJnZUFsbE9ic2VydmVyLnByb3RvdHlwZS5jb21wbGV0ZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLmRvbmUgPSB0cnVlO1xuICAgICAgdGhpcy5nLmxlbmd0aCA9PT0gMSAmJiB0aGlzLm8ub25Db21wbGV0ZWQoKTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gSW5uZXJPYnNlcnZlcihwYXJlbnQsIHNhZCkge1xuICAgICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XG4gICAgICB0aGlzLnNhZCA9IHNhZDtcbiAgICAgIF9fc3VwZXJfXy5jYWxsKHRoaXMpO1xuICAgIH1cblxuICAgIGluaGVyaXRzKElubmVyT2JzZXJ2ZXIsIF9fc3VwZXJfXyk7XG5cbiAgICBJbm5lck9ic2VydmVyLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24gKHgpIHtcbiAgICAgIHRoaXMucGFyZW50Lm8ub25OZXh0KHgpO1xuICAgIH07XG4gICAgSW5uZXJPYnNlcnZlci5wcm90b3R5cGUuZXJyb3IgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgdGhpcy5wYXJlbnQuby5vbkVycm9yKGUpO1xuICAgIH07XG4gICAgSW5uZXJPYnNlcnZlci5wcm90b3R5cGUuY29tcGxldGVkID0gZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5wYXJlbnQuZy5yZW1vdmUodGhpcy5zYWQpO1xuICAgICAgdGhpcy5wYXJlbnQuZG9uZSAmJiB0aGlzLnBhcmVudC5nLmxlbmd0aCA9PT0gMSAmJiB0aGlzLnBhcmVudC5vLm9uQ29tcGxldGVkKCk7XG4gICAgfTtcblxuICAgIHJldHVybiBNZXJnZUFsbE9ic2VydmVyO1xuICB9KEFic3RyYWN0T2JzZXJ2ZXIpKTtcblxuICAvKipcbiAgKiBNZXJnZXMgYW4gb2JzZXJ2YWJsZSBzZXF1ZW5jZSBvZiBvYnNlcnZhYmxlIHNlcXVlbmNlcyBpbnRvIGFuIG9ic2VydmFibGUgc2VxdWVuY2UuXG4gICogQHJldHVybnMge09ic2VydmFibGV9IFRoZSBvYnNlcnZhYmxlIHNlcXVlbmNlIHRoYXQgbWVyZ2VzIHRoZSBlbGVtZW50cyBvZiB0aGUgaW5uZXIgc2VxdWVuY2VzLlxuICAqL1xuICBvYnNlcnZhYmxlUHJvdG8ubWVyZ2VBbGwgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIG5ldyBNZXJnZUFsbE9ic2VydmFibGUodGhpcyk7XG4gIH07XG5cbiAgdmFyIFNraXBVbnRpbE9ic2VydmFibGUgPSAoZnVuY3Rpb24oX19zdXBlcl9fKSB7XG4gICAgaW5oZXJpdHMoU2tpcFVudGlsT2JzZXJ2YWJsZSwgX19zdXBlcl9fKTtcblxuICAgIGZ1bmN0aW9uIFNraXBVbnRpbE9ic2VydmFibGUoc291cmNlLCBvdGhlcikge1xuICAgICAgdGhpcy5fcyA9IHNvdXJjZTtcbiAgICAgIHRoaXMuX28gPSBpc1Byb21pc2Uob3RoZXIpID8gb2JzZXJ2YWJsZUZyb21Qcm9taXNlKG90aGVyKSA6IG90aGVyO1xuICAgICAgdGhpcy5fb3BlbiA9IGZhbHNlO1xuICAgICAgX19zdXBlcl9fLmNhbGwodGhpcyk7XG4gICAgfVxuXG4gICAgU2tpcFVudGlsT2JzZXJ2YWJsZS5wcm90b3R5cGUuc3Vic2NyaWJlQ29yZSA9IGZ1bmN0aW9uKG8pIHtcbiAgICAgIHZhciBsZWZ0U3Vic2NyaXB0aW9uID0gbmV3IFNpbmdsZUFzc2lnbm1lbnREaXNwb3NhYmxlKCk7XG4gICAgICBsZWZ0U3Vic2NyaXB0aW9uLnNldERpc3Bvc2FibGUodGhpcy5fcy5zdWJzY3JpYmUobmV3IFNraXBVbnRpbFNvdXJjZU9ic2VydmVyKG8sIHRoaXMpKSk7XG5cbiAgICAgIGlzUHJvbWlzZSh0aGlzLl9vKSAmJiAodGhpcy5fbyA9IG9ic2VydmFibGVGcm9tUHJvbWlzZSh0aGlzLl9vKSk7XG5cbiAgICAgIHZhciByaWdodFN1YnNjcmlwdGlvbiA9IG5ldyBTaW5nbGVBc3NpZ25tZW50RGlzcG9zYWJsZSgpO1xuICAgICAgcmlnaHRTdWJzY3JpcHRpb24uc2V0RGlzcG9zYWJsZSh0aGlzLl9vLnN1YnNjcmliZShuZXcgU2tpcFVudGlsT3RoZXJPYnNlcnZlcihvLCB0aGlzLCByaWdodFN1YnNjcmlwdGlvbikpKTtcblxuICAgICAgcmV0dXJuIG5ldyBCaW5hcnlEaXNwb3NhYmxlKGxlZnRTdWJzY3JpcHRpb24sIHJpZ2h0U3Vic2NyaXB0aW9uKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIFNraXBVbnRpbE9ic2VydmFibGU7XG4gIH0oT2JzZXJ2YWJsZUJhc2UpKTtcblxuICB2YXIgU2tpcFVudGlsU291cmNlT2JzZXJ2ZXIgPSAoZnVuY3Rpb24oX19zdXBlcl9fKSB7XG4gICAgaW5oZXJpdHMoU2tpcFVudGlsU291cmNlT2JzZXJ2ZXIsIF9fc3VwZXJfXyk7XG4gICAgZnVuY3Rpb24gU2tpcFVudGlsU291cmNlT2JzZXJ2ZXIobywgcCkge1xuICAgICAgdGhpcy5fbyA9IG87XG4gICAgICB0aGlzLl9wID0gcDtcbiAgICAgIF9fc3VwZXJfXy5jYWxsKHRoaXMpO1xuICAgIH1cblxuICAgIFNraXBVbnRpbFNvdXJjZU9ic2VydmVyLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24gKHgpIHtcbiAgICAgIHRoaXMuX3AuX29wZW4gJiYgdGhpcy5fby5vbk5leHQoeCk7XG4gICAgfTtcblxuICAgIFNraXBVbnRpbFNvdXJjZU9ic2VydmVyLnByb3RvdHlwZS5lcnJvciA9IGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgIHRoaXMuX28ub25FcnJvcihlcnIpO1xuICAgIH07XG5cbiAgICBTa2lwVW50aWxTb3VyY2VPYnNlcnZlci5wcm90b3R5cGUub25Db21wbGV0ZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLl9wLl9vcGVuICYmIHRoaXMuX28ub25Db21wbGV0ZWQoKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIFNraXBVbnRpbFNvdXJjZU9ic2VydmVyO1xuICB9KEFic3RyYWN0T2JzZXJ2ZXIpKTtcblxuICB2YXIgU2tpcFVudGlsT3RoZXJPYnNlcnZlciA9IChmdW5jdGlvbihfX3N1cGVyX18pIHtcbiAgICBpbmhlcml0cyhTa2lwVW50aWxPdGhlck9ic2VydmVyLCBfX3N1cGVyX18pO1xuICAgIGZ1bmN0aW9uIFNraXBVbnRpbE90aGVyT2JzZXJ2ZXIobywgcCwgcikge1xuICAgICAgdGhpcy5fbyA9IG87XG4gICAgICB0aGlzLl9wID0gcDtcbiAgICAgIHRoaXMuX3IgPSByO1xuICAgICAgX19zdXBlcl9fLmNhbGwodGhpcyk7XG4gICAgfVxuXG4gICAgU2tpcFVudGlsT3RoZXJPYnNlcnZlci5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuX3AuX29wZW4gPSB0cnVlO1xuICAgICAgdGhpcy5fci5kaXNwb3NlKCk7XG4gICAgfTtcblxuICAgIFNraXBVbnRpbE90aGVyT2JzZXJ2ZXIucHJvdG90eXBlLmVycm9yID0gZnVuY3Rpb24gKGVycikge1xuICAgICAgdGhpcy5fby5vbkVycm9yKGVycik7XG4gICAgfTtcblxuICAgIFNraXBVbnRpbE90aGVyT2JzZXJ2ZXIucHJvdG90eXBlLm9uQ29tcGxldGVkID0gZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5fci5kaXNwb3NlKCk7XG4gICAgfTtcblxuICAgIHJldHVybiBTa2lwVW50aWxPdGhlck9ic2VydmVyO1xuICB9KEFic3RyYWN0T2JzZXJ2ZXIpKTtcblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgdmFsdWVzIGZyb20gdGhlIHNvdXJjZSBvYnNlcnZhYmxlIHNlcXVlbmNlIG9ubHkgYWZ0ZXIgdGhlIG90aGVyIG9ic2VydmFibGUgc2VxdWVuY2UgcHJvZHVjZXMgYSB2YWx1ZS5cbiAgICogQHBhcmFtIHtPYnNlcnZhYmxlIHwgUHJvbWlzZX0gb3RoZXIgVGhlIG9ic2VydmFibGUgc2VxdWVuY2Ugb3IgUHJvbWlzZSB0aGF0IHRyaWdnZXJzIHByb3BhZ2F0aW9uIG9mIGVsZW1lbnRzIG9mIHRoZSBzb3VyY2Ugc2VxdWVuY2UuXG4gICAqIEByZXR1cm5zIHtPYnNlcnZhYmxlfSBBbiBvYnNlcnZhYmxlIHNlcXVlbmNlIGNvbnRhaW5pbmcgdGhlIGVsZW1lbnRzIG9mIHRoZSBzb3VyY2Ugc2VxdWVuY2Ugc3RhcnRpbmcgZnJvbSB0aGUgcG9pbnQgdGhlIG90aGVyIHNlcXVlbmNlIHRyaWdnZXJlZCBwcm9wYWdhdGlvbi5cbiAgICovXG4gIG9ic2VydmFibGVQcm90by5za2lwVW50aWwgPSBmdW5jdGlvbiAob3RoZXIpIHtcbiAgICByZXR1cm4gbmV3IFNraXBVbnRpbE9ic2VydmFibGUodGhpcywgb3RoZXIpO1xuICB9O1xuXG4gIHZhciBTd2l0Y2hPYnNlcnZhYmxlID0gKGZ1bmN0aW9uKF9fc3VwZXJfXykge1xuICAgIGluaGVyaXRzKFN3aXRjaE9ic2VydmFibGUsIF9fc3VwZXJfXyk7XG4gICAgZnVuY3Rpb24gU3dpdGNoT2JzZXJ2YWJsZShzb3VyY2UpIHtcbiAgICAgIHRoaXMuc291cmNlID0gc291cmNlO1xuICAgICAgX19zdXBlcl9fLmNhbGwodGhpcyk7XG4gICAgfVxuXG4gICAgU3dpdGNoT2JzZXJ2YWJsZS5wcm90b3R5cGUuc3Vic2NyaWJlQ29yZSA9IGZ1bmN0aW9uIChvKSB7XG4gICAgICB2YXIgaW5uZXIgPSBuZXcgU2VyaWFsRGlzcG9zYWJsZSgpLCBzID0gdGhpcy5zb3VyY2Uuc3Vic2NyaWJlKG5ldyBTd2l0Y2hPYnNlcnZlcihvLCBpbm5lcikpO1xuICAgICAgcmV0dXJuIG5ldyBCaW5hcnlEaXNwb3NhYmxlKHMsIGlubmVyKTtcbiAgICB9O1xuXG4gICAgaW5oZXJpdHMoU3dpdGNoT2JzZXJ2ZXIsIEFic3RyYWN0T2JzZXJ2ZXIpO1xuICAgIGZ1bmN0aW9uIFN3aXRjaE9ic2VydmVyKG8sIGlubmVyKSB7XG4gICAgICB0aGlzLm8gPSBvO1xuICAgICAgdGhpcy5pbm5lciA9IGlubmVyO1xuICAgICAgdGhpcy5zdG9wcGVkID0gZmFsc2U7XG4gICAgICB0aGlzLmxhdGVzdCA9IDA7XG4gICAgICB0aGlzLmhhc0xhdGVzdCA9IGZhbHNlO1xuICAgICAgQWJzdHJhY3RPYnNlcnZlci5jYWxsKHRoaXMpO1xuICAgIH1cblxuICAgIFN3aXRjaE9ic2VydmVyLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24gKGlubmVyU291cmNlKSB7XG4gICAgICB2YXIgZCA9IG5ldyBTaW5nbGVBc3NpZ25tZW50RGlzcG9zYWJsZSgpLCBpZCA9ICsrdGhpcy5sYXRlc3Q7XG4gICAgICB0aGlzLmhhc0xhdGVzdCA9IHRydWU7XG4gICAgICB0aGlzLmlubmVyLnNldERpc3Bvc2FibGUoZCk7XG4gICAgICBpc1Byb21pc2UoaW5uZXJTb3VyY2UpICYmIChpbm5lclNvdXJjZSA9IG9ic2VydmFibGVGcm9tUHJvbWlzZShpbm5lclNvdXJjZSkpO1xuICAgICAgZC5zZXREaXNwb3NhYmxlKGlubmVyU291cmNlLnN1YnNjcmliZShuZXcgSW5uZXJPYnNlcnZlcih0aGlzLCBpZCkpKTtcbiAgICB9O1xuXG4gICAgU3dpdGNoT2JzZXJ2ZXIucHJvdG90eXBlLmVycm9yID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgIHRoaXMuby5vbkVycm9yKGUpO1xuICAgIH07XG5cbiAgICBTd2l0Y2hPYnNlcnZlci5wcm90b3R5cGUuY29tcGxldGVkID0gZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5zdG9wcGVkID0gdHJ1ZTtcbiAgICAgICF0aGlzLmhhc0xhdGVzdCAmJiB0aGlzLm8ub25Db21wbGV0ZWQoKTtcbiAgICB9O1xuXG4gICAgaW5oZXJpdHMoSW5uZXJPYnNlcnZlciwgQWJzdHJhY3RPYnNlcnZlcik7XG4gICAgZnVuY3Rpb24gSW5uZXJPYnNlcnZlcihwYXJlbnQsIGlkKSB7XG4gICAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcbiAgICAgIHRoaXMuaWQgPSBpZDtcbiAgICAgIEFic3RyYWN0T2JzZXJ2ZXIuY2FsbCh0aGlzKTtcbiAgICB9XG4gICAgSW5uZXJPYnNlcnZlci5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uICh4KSB7XG4gICAgICB0aGlzLnBhcmVudC5sYXRlc3QgPT09IHRoaXMuaWQgJiYgdGhpcy5wYXJlbnQuby5vbk5leHQoeCk7XG4gICAgfTtcblxuICAgIElubmVyT2JzZXJ2ZXIucHJvdG90eXBlLmVycm9yID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgIHRoaXMucGFyZW50LmxhdGVzdCA9PT0gdGhpcy5pZCAmJiB0aGlzLnBhcmVudC5vLm9uRXJyb3IoZSk7XG4gICAgfTtcblxuICAgIElubmVyT2JzZXJ2ZXIucHJvdG90eXBlLmNvbXBsZXRlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICh0aGlzLnBhcmVudC5sYXRlc3QgPT09IHRoaXMuaWQpIHtcbiAgICAgICAgdGhpcy5wYXJlbnQuaGFzTGF0ZXN0ID0gZmFsc2U7XG4gICAgICAgIHRoaXMucGFyZW50LnN0b3BwZWQgJiYgdGhpcy5wYXJlbnQuby5vbkNvbXBsZXRlZCgpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICByZXR1cm4gU3dpdGNoT2JzZXJ2YWJsZTtcbiAgfShPYnNlcnZhYmxlQmFzZSkpO1xuXG4gIC8qKlxuICAqIFRyYW5zZm9ybXMgYW4gb2JzZXJ2YWJsZSBzZXF1ZW5jZSBvZiBvYnNlcnZhYmxlIHNlcXVlbmNlcyBpbnRvIGFuIG9ic2VydmFibGUgc2VxdWVuY2UgcHJvZHVjaW5nIHZhbHVlcyBvbmx5IGZyb20gdGhlIG1vc3QgcmVjZW50IG9ic2VydmFibGUgc2VxdWVuY2UuXG4gICogQHJldHVybnMge09ic2VydmFibGV9IFRoZSBvYnNlcnZhYmxlIHNlcXVlbmNlIHRoYXQgYXQgYW55IHBvaW50IGluIHRpbWUgcHJvZHVjZXMgdGhlIGVsZW1lbnRzIG9mIHRoZSBtb3N0IHJlY2VudCBpbm5lciBvYnNlcnZhYmxlIHNlcXVlbmNlIHRoYXQgaGFzIGJlZW4gcmVjZWl2ZWQuXG4gICovXG4gIG9ic2VydmFibGVQcm90b1snc3dpdGNoJ10gPSBvYnNlcnZhYmxlUHJvdG8uc3dpdGNoTGF0ZXN0ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBuZXcgU3dpdGNoT2JzZXJ2YWJsZSh0aGlzKTtcbiAgfTtcblxuICB2YXIgVGFrZVVudGlsT2JzZXJ2YWJsZSA9IChmdW5jdGlvbihfX3N1cGVyX18pIHtcbiAgICBpbmhlcml0cyhUYWtlVW50aWxPYnNlcnZhYmxlLCBfX3N1cGVyX18pO1xuXG4gICAgZnVuY3Rpb24gVGFrZVVudGlsT2JzZXJ2YWJsZShzb3VyY2UsIG90aGVyKSB7XG4gICAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcbiAgICAgIHRoaXMub3RoZXIgPSBpc1Byb21pc2Uob3RoZXIpID8gb2JzZXJ2YWJsZUZyb21Qcm9taXNlKG90aGVyKSA6IG90aGVyO1xuICAgICAgX19zdXBlcl9fLmNhbGwodGhpcyk7XG4gICAgfVxuXG4gICAgVGFrZVVudGlsT2JzZXJ2YWJsZS5wcm90b3R5cGUuc3Vic2NyaWJlQ29yZSA9IGZ1bmN0aW9uKG8pIHtcbiAgICAgIHJldHVybiBuZXcgQmluYXJ5RGlzcG9zYWJsZShcbiAgICAgICAgdGhpcy5zb3VyY2Uuc3Vic2NyaWJlKG8pLFxuICAgICAgICB0aGlzLm90aGVyLnN1YnNjcmliZShuZXcgVGFrZVVudGlsT2JzZXJ2ZXIobykpXG4gICAgICApO1xuICAgIH07XG5cbiAgICByZXR1cm4gVGFrZVVudGlsT2JzZXJ2YWJsZTtcbiAgfShPYnNlcnZhYmxlQmFzZSkpO1xuXG4gIHZhciBUYWtlVW50aWxPYnNlcnZlciA9IChmdW5jdGlvbihfX3N1cGVyX18pIHtcbiAgICBpbmhlcml0cyhUYWtlVW50aWxPYnNlcnZlciwgX19zdXBlcl9fKTtcbiAgICBmdW5jdGlvbiBUYWtlVW50aWxPYnNlcnZlcihvKSB7XG4gICAgICB0aGlzLl9vID0gbztcbiAgICAgIF9fc3VwZXJfXy5jYWxsKHRoaXMpO1xuICAgIH1cblxuICAgIFRha2VVbnRpbE9ic2VydmVyLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5fby5vbkNvbXBsZXRlZCgpO1xuICAgIH07XG5cbiAgICBUYWtlVW50aWxPYnNlcnZlci5wcm90b3R5cGUuZXJyb3IgPSBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICB0aGlzLl9vLm9uRXJyb3IoZXJyKTtcbiAgICB9O1xuXG4gICAgVGFrZVVudGlsT2JzZXJ2ZXIucHJvdG90eXBlLm9uQ29tcGxldGVkID0gbm9vcDtcblxuICAgIHJldHVybiBUYWtlVW50aWxPYnNlcnZlcjtcbiAgfShBYnN0cmFjdE9ic2VydmVyKSk7XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHZhbHVlcyBmcm9tIHRoZSBzb3VyY2Ugb2JzZXJ2YWJsZSBzZXF1ZW5jZSB1bnRpbCB0aGUgb3RoZXIgb2JzZXJ2YWJsZSBzZXF1ZW5jZSBwcm9kdWNlcyBhIHZhbHVlLlxuICAgKiBAcGFyYW0ge09ic2VydmFibGUgfCBQcm9taXNlfSBvdGhlciBPYnNlcnZhYmxlIHNlcXVlbmNlIG9yIFByb21pc2UgdGhhdCB0ZXJtaW5hdGVzIHByb3BhZ2F0aW9uIG9mIGVsZW1lbnRzIG9mIHRoZSBzb3VyY2Ugc2VxdWVuY2UuXG4gICAqIEByZXR1cm5zIHtPYnNlcnZhYmxlfSBBbiBvYnNlcnZhYmxlIHNlcXVlbmNlIGNvbnRhaW5pbmcgdGhlIGVsZW1lbnRzIG9mIHRoZSBzb3VyY2Ugc2VxdWVuY2UgdXAgdG8gdGhlIHBvaW50IHRoZSBvdGhlciBzZXF1ZW5jZSBpbnRlcnJ1cHRlZCBmdXJ0aGVyIHByb3BhZ2F0aW9uLlxuICAgKi9cbiAgb2JzZXJ2YWJsZVByb3RvLnRha2VVbnRpbCA9IGZ1bmN0aW9uIChvdGhlcikge1xuICAgIHJldHVybiBuZXcgVGFrZVVudGlsT2JzZXJ2YWJsZSh0aGlzLCBvdGhlcik7XG4gIH07XG5cbiAgZnVuY3Rpb24gZmFsc2VGYWN0b3J5KCkgeyByZXR1cm4gZmFsc2U7IH1cbiAgZnVuY3Rpb24gYXJndW1lbnRzVG9BcnJheSgpIHtcbiAgICB2YXIgbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IG5ldyBBcnJheShsZW4pO1xuICAgIGZvcih2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykgeyBhcmdzW2ldID0gYXJndW1lbnRzW2ldOyB9XG4gICAgcmV0dXJuIGFyZ3M7XG4gIH1cblxuICB2YXIgV2l0aExhdGVzdEZyb21PYnNlcnZhYmxlID0gKGZ1bmN0aW9uKF9fc3VwZXJfXykge1xuICAgIGluaGVyaXRzKFdpdGhMYXRlc3RGcm9tT2JzZXJ2YWJsZSwgX19zdXBlcl9fKTtcbiAgICBmdW5jdGlvbiBXaXRoTGF0ZXN0RnJvbU9ic2VydmFibGUoc291cmNlLCBzb3VyY2VzLCByZXN1bHRTZWxlY3Rvcikge1xuICAgICAgdGhpcy5fcyA9IHNvdXJjZTtcbiAgICAgIHRoaXMuX3NzID0gc291cmNlcztcbiAgICAgIHRoaXMuX2NiID0gcmVzdWx0U2VsZWN0b3I7XG4gICAgICBfX3N1cGVyX18uY2FsbCh0aGlzKTtcbiAgICB9XG5cbiAgICBXaXRoTGF0ZXN0RnJvbU9ic2VydmFibGUucHJvdG90eXBlLnN1YnNjcmliZUNvcmUgPSBmdW5jdGlvbiAobykge1xuICAgICAgdmFyIGxlbiA9IHRoaXMuX3NzLmxlbmd0aDtcbiAgICAgIHZhciBzdGF0ZSA9IHtcbiAgICAgICAgaGFzVmFsdWU6IGFycmF5SW5pdGlhbGl6ZShsZW4sIGZhbHNlRmFjdG9yeSksXG4gICAgICAgIGhhc1ZhbHVlQWxsOiBmYWxzZSxcbiAgICAgICAgdmFsdWVzOiBuZXcgQXJyYXkobGVuKVxuICAgICAgfTtcblxuICAgICAgdmFyIG4gPSB0aGlzLl9zcy5sZW5ndGgsIHN1YnNjcmlwdGlvbnMgPSBuZXcgQXJyYXkobiArIDEpO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgdmFyIG90aGVyID0gdGhpcy5fc3NbaV0sIHNhZCA9IG5ldyBTaW5nbGVBc3NpZ25tZW50RGlzcG9zYWJsZSgpO1xuICAgICAgICBpc1Byb21pc2Uob3RoZXIpICYmIChvdGhlciA9IG9ic2VydmFibGVGcm9tUHJvbWlzZShvdGhlcikpO1xuICAgICAgICBzYWQuc2V0RGlzcG9zYWJsZShvdGhlci5zdWJzY3JpYmUobmV3IFdpdGhMYXRlc3RGcm9tT3RoZXJPYnNlcnZlcihvLCBpLCBzdGF0ZSkpKTtcbiAgICAgICAgc3Vic2NyaXB0aW9uc1tpXSA9IHNhZDtcbiAgICAgIH1cblxuICAgICAgdmFyIG91dGVyU2FkID0gbmV3IFNpbmdsZUFzc2lnbm1lbnREaXNwb3NhYmxlKCk7XG4gICAgICBvdXRlclNhZC5zZXREaXNwb3NhYmxlKHRoaXMuX3Muc3Vic2NyaWJlKG5ldyBXaXRoTGF0ZXN0RnJvbVNvdXJjZU9ic2VydmVyKG8sIHRoaXMuX2NiLCBzdGF0ZSkpKTtcbiAgICAgIHN1YnNjcmlwdGlvbnNbbl0gPSBvdXRlclNhZDtcblxuICAgICAgcmV0dXJuIG5ldyBOQXJ5RGlzcG9zYWJsZShzdWJzY3JpcHRpb25zKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIFdpdGhMYXRlc3RGcm9tT2JzZXJ2YWJsZTtcbiAgfShPYnNlcnZhYmxlQmFzZSkpO1xuXG4gIHZhciBXaXRoTGF0ZXN0RnJvbU90aGVyT2JzZXJ2ZXIgPSAoZnVuY3Rpb24gKF9fc3VwZXJfXykge1xuICAgIGluaGVyaXRzKFdpdGhMYXRlc3RGcm9tT3RoZXJPYnNlcnZlciwgX19zdXBlcl9fKTtcbiAgICBmdW5jdGlvbiBXaXRoTGF0ZXN0RnJvbU90aGVyT2JzZXJ2ZXIobywgaSwgc3RhdGUpIHtcbiAgICAgIHRoaXMuX28gPSBvO1xuICAgICAgdGhpcy5faSA9IGk7XG4gICAgICB0aGlzLl9zdGF0ZSA9IHN0YXRlO1xuICAgICAgX19zdXBlcl9fLmNhbGwodGhpcyk7XG4gICAgfVxuXG4gICAgV2l0aExhdGVzdEZyb21PdGhlck9ic2VydmVyLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24gKHgpIHtcbiAgICAgIHRoaXMuX3N0YXRlLnZhbHVlc1t0aGlzLl9pXSA9IHg7XG4gICAgICB0aGlzLl9zdGF0ZS5oYXNWYWx1ZVt0aGlzLl9pXSA9IHRydWU7XG4gICAgICB0aGlzLl9zdGF0ZS5oYXNWYWx1ZUFsbCA9IHRoaXMuX3N0YXRlLmhhc1ZhbHVlLmV2ZXJ5KGlkZW50aXR5KTtcbiAgICB9O1xuXG4gICAgV2l0aExhdGVzdEZyb21PdGhlck9ic2VydmVyLnByb3RvdHlwZS5lcnJvciA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICB0aGlzLl9vLm9uRXJyb3IoZSk7XG4gICAgfTtcblxuICAgIFdpdGhMYXRlc3RGcm9tT3RoZXJPYnNlcnZlci5wcm90b3R5cGUuY29tcGxldGVkID0gbm9vcDtcblxuICAgIHJldHVybiBXaXRoTGF0ZXN0RnJvbU90aGVyT2JzZXJ2ZXI7XG4gIH0oQWJzdHJhY3RPYnNlcnZlcikpO1xuXG4gIHZhciBXaXRoTGF0ZXN0RnJvbVNvdXJjZU9ic2VydmVyID0gKGZ1bmN0aW9uIChfX3N1cGVyX18pIHtcbiAgICBpbmhlcml0cyhXaXRoTGF0ZXN0RnJvbVNvdXJjZU9ic2VydmVyLCBfX3N1cGVyX18pO1xuICAgIGZ1bmN0aW9uIFdpdGhMYXRlc3RGcm9tU291cmNlT2JzZXJ2ZXIobywgY2IsIHN0YXRlKSB7XG4gICAgICB0aGlzLl9vID0gbztcbiAgICAgIHRoaXMuX2NiID0gY2I7XG4gICAgICB0aGlzLl9zdGF0ZSA9IHN0YXRlO1xuICAgICAgX19zdXBlcl9fLmNhbGwodGhpcyk7XG4gICAgfVxuXG4gICAgV2l0aExhdGVzdEZyb21Tb3VyY2VPYnNlcnZlci5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uICh4KSB7XG4gICAgICB2YXIgYWxsVmFsdWVzID0gW3hdLmNvbmNhdCh0aGlzLl9zdGF0ZS52YWx1ZXMpO1xuICAgICAgaWYgKCF0aGlzLl9zdGF0ZS5oYXNWYWx1ZUFsbCkgeyByZXR1cm47IH1cbiAgICAgIHZhciByZXMgPSB0cnlDYXRjaCh0aGlzLl9jYikuYXBwbHkobnVsbCwgYWxsVmFsdWVzKTtcbiAgICAgIGlmIChyZXMgPT09IGVycm9yT2JqKSB7IHJldHVybiB0aGlzLl9vLm9uRXJyb3IocmVzLmUpOyB9XG4gICAgICB0aGlzLl9vLm9uTmV4dChyZXMpO1xuICAgIH07XG5cbiAgICBXaXRoTGF0ZXN0RnJvbVNvdXJjZU9ic2VydmVyLnByb3RvdHlwZS5lcnJvciA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICB0aGlzLl9vLm9uRXJyb3IoZSk7XG4gICAgfTtcblxuICAgIFdpdGhMYXRlc3RGcm9tU291cmNlT2JzZXJ2ZXIucHJvdG90eXBlLmNvbXBsZXRlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuX28ub25Db21wbGV0ZWQoKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIFdpdGhMYXRlc3RGcm9tU291cmNlT2JzZXJ2ZXI7XG4gIH0oQWJzdHJhY3RPYnNlcnZlcikpO1xuXG4gIC8qKlxuICAgKiBNZXJnZXMgdGhlIHNwZWNpZmllZCBvYnNlcnZhYmxlIHNlcXVlbmNlcyBpbnRvIG9uZSBvYnNlcnZhYmxlIHNlcXVlbmNlIGJ5IHVzaW5nIHRoZSBzZWxlY3RvciBmdW5jdGlvbiBvbmx5IHdoZW4gdGhlIChmaXJzdCkgc291cmNlIG9ic2VydmFibGUgc2VxdWVuY2UgcHJvZHVjZXMgYW4gZWxlbWVudC5cbiAgICogQHJldHVybnMge09ic2VydmFibGV9IEFuIG9ic2VydmFibGUgc2VxdWVuY2UgY29udGFpbmluZyB0aGUgcmVzdWx0IG9mIGNvbWJpbmluZyBlbGVtZW50cyBvZiB0aGUgc291cmNlcyB1c2luZyB0aGUgc3BlY2lmaWVkIHJlc3VsdCBzZWxlY3RvciBmdW5jdGlvbi5cbiAgICovXG4gIG9ic2VydmFibGVQcm90by53aXRoTGF0ZXN0RnJvbSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkgeyB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgYXJndW1lbnRzJyk7IH1cblxuICAgIHZhciBsZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gbmV3IEFycmF5KGxlbik7XG4gICAgZm9yKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7IGFyZ3NbaV0gPSBhcmd1bWVudHNbaV07IH1cbiAgICB2YXIgcmVzdWx0U2VsZWN0b3IgPSBpc0Z1bmN0aW9uKGFyZ3NbbGVuIC0gMV0pID8gYXJncy5wb3AoKSA6IGFyZ3VtZW50c1RvQXJyYXk7XG4gICAgQXJyYXkuaXNBcnJheShhcmdzWzBdKSAmJiAoYXJncyA9IGFyZ3NbMF0pO1xuXG4gICAgcmV0dXJuIG5ldyBXaXRoTGF0ZXN0RnJvbU9ic2VydmFibGUodGhpcywgYXJncywgcmVzdWx0U2VsZWN0b3IpO1xuICB9O1xuXG4gIGZ1bmN0aW9uIGZhbHNlRmFjdG9yeSgpIHsgcmV0dXJuIGZhbHNlOyB9XG4gIGZ1bmN0aW9uIGVtcHR5QXJyYXlGYWN0b3J5KCkgeyByZXR1cm4gW107IH1cblxuICB2YXIgWmlwT2JzZXJ2YWJsZSA9IChmdW5jdGlvbihfX3N1cGVyX18pIHtcbiAgICBpbmhlcml0cyhaaXBPYnNlcnZhYmxlLCBfX3N1cGVyX18pO1xuICAgIGZ1bmN0aW9uIFppcE9ic2VydmFibGUoc291cmNlcywgcmVzdWx0U2VsZWN0b3IpIHtcbiAgICAgIHRoaXMuX3MgPSBzb3VyY2VzO1xuICAgICAgdGhpcy5fY2IgPSByZXN1bHRTZWxlY3RvcjtcbiAgICAgIF9fc3VwZXJfXy5jYWxsKHRoaXMpO1xuICAgIH1cblxuICAgIFppcE9ic2VydmFibGUucHJvdG90eXBlLnN1YnNjcmliZUNvcmUgPSBmdW5jdGlvbihvYnNlcnZlcikge1xuICAgICAgdmFyIG4gPSB0aGlzLl9zLmxlbmd0aCxcbiAgICAgICAgICBzdWJzY3JpcHRpb25zID0gbmV3IEFycmF5KG4pLFxuICAgICAgICAgIGRvbmUgPSBhcnJheUluaXRpYWxpemUobiwgZmFsc2VGYWN0b3J5KSxcbiAgICAgICAgICBxID0gYXJyYXlJbml0aWFsaXplKG4sIGVtcHR5QXJyYXlGYWN0b3J5KTtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgdmFyIHNvdXJjZSA9IHRoaXMuX3NbaV0sIHNhZCA9IG5ldyBTaW5nbGVBc3NpZ25tZW50RGlzcG9zYWJsZSgpO1xuICAgICAgICBzdWJzY3JpcHRpb25zW2ldID0gc2FkO1xuICAgICAgICBpc1Byb21pc2Uoc291cmNlKSAmJiAoc291cmNlID0gb2JzZXJ2YWJsZUZyb21Qcm9taXNlKHNvdXJjZSkpO1xuICAgICAgICBzYWQuc2V0RGlzcG9zYWJsZShzb3VyY2Uuc3Vic2NyaWJlKG5ldyBaaXBPYnNlcnZlcihvYnNlcnZlciwgaSwgdGhpcywgcSwgZG9uZSkpKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5ldyBOQXJ5RGlzcG9zYWJsZShzdWJzY3JpcHRpb25zKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIFppcE9ic2VydmFibGU7XG4gIH0oT2JzZXJ2YWJsZUJhc2UpKTtcblxuICB2YXIgWmlwT2JzZXJ2ZXIgPSAoZnVuY3Rpb24gKF9fc3VwZXJfXykge1xuICAgIGluaGVyaXRzKFppcE9ic2VydmVyLCBfX3N1cGVyX18pO1xuICAgIGZ1bmN0aW9uIFppcE9ic2VydmVyKG8sIGksIHAsIHEsIGQpIHtcbiAgICAgIHRoaXMuX28gPSBvO1xuICAgICAgdGhpcy5faSA9IGk7XG4gICAgICB0aGlzLl9wID0gcDtcbiAgICAgIHRoaXMuX3EgPSBxO1xuICAgICAgdGhpcy5fZCA9IGQ7XG4gICAgICBfX3N1cGVyX18uY2FsbCh0aGlzKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBub3RFbXB0eSh4KSB7IHJldHVybiB4Lmxlbmd0aCA+IDA7IH1cbiAgICBmdW5jdGlvbiBzaGlmdEVhY2goeCkgeyByZXR1cm4geC5zaGlmdCgpOyB9XG4gICAgZnVuY3Rpb24gbm90VGhlU2FtZShpKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKHgsIGopIHtcbiAgICAgICAgcmV0dXJuIGogIT09IGk7XG4gICAgICB9O1xuICAgIH1cblxuICAgIFppcE9ic2VydmVyLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24gKHgpIHtcbiAgICAgIHRoaXMuX3FbdGhpcy5faV0ucHVzaCh4KTtcbiAgICAgIGlmICh0aGlzLl9xLmV2ZXJ5KG5vdEVtcHR5KSkge1xuICAgICAgICB2YXIgcXVldWVkVmFsdWVzID0gdGhpcy5fcS5tYXAoc2hpZnRFYWNoKTtcbiAgICAgICAgdmFyIHJlcyA9IHRyeUNhdGNoKHRoaXMuX3AuX2NiKS5hcHBseShudWxsLCBxdWV1ZWRWYWx1ZXMpO1xuICAgICAgICBpZiAocmVzID09PSBlcnJvck9iaikgeyByZXR1cm4gdGhpcy5fby5vbkVycm9yKHJlcy5lKTsgfVxuICAgICAgICB0aGlzLl9vLm9uTmV4dChyZXMpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLl9kLmZpbHRlcihub3RUaGVTYW1lKHRoaXMuX2kpKS5ldmVyeShpZGVudGl0eSkpIHtcbiAgICAgICAgdGhpcy5fby5vbkNvbXBsZXRlZCgpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBaaXBPYnNlcnZlci5wcm90b3R5cGUuZXJyb3IgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgdGhpcy5fby5vbkVycm9yKGUpO1xuICAgIH07XG5cbiAgICBaaXBPYnNlcnZlci5wcm90b3R5cGUuY29tcGxldGVkID0gZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5fZFt0aGlzLl9pXSA9IHRydWU7XG4gICAgICB0aGlzLl9kLmV2ZXJ5KGlkZW50aXR5KSAmJiB0aGlzLl9vLm9uQ29tcGxldGVkKCk7XG4gICAgfTtcblxuICAgIHJldHVybiBaaXBPYnNlcnZlcjtcbiAgfShBYnN0cmFjdE9ic2VydmVyKSk7XG5cbiAgLyoqXG4gICAqIE1lcmdlcyB0aGUgc3BlY2lmaWVkIG9ic2VydmFibGUgc2VxdWVuY2VzIGludG8gb25lIG9ic2VydmFibGUgc2VxdWVuY2UgYnkgdXNpbmcgdGhlIHNlbGVjdG9yIGZ1bmN0aW9uIHdoZW5ldmVyIGFsbCBvZiB0aGUgb2JzZXJ2YWJsZSBzZXF1ZW5jZXMgb3IgYW4gYXJyYXkgaGF2ZSBwcm9kdWNlZCBhbiBlbGVtZW50IGF0IGEgY29ycmVzcG9uZGluZyBpbmRleC5cbiAgICogVGhlIGxhc3QgZWxlbWVudCBpbiB0aGUgYXJndW1lbnRzIG11c3QgYmUgYSBmdW5jdGlvbiB0byBpbnZva2UgZm9yIGVhY2ggc2VyaWVzIG9mIGVsZW1lbnRzIGF0IGNvcnJlc3BvbmRpbmcgaW5kZXhlcyBpbiB0aGUgYXJncy5cbiAgICogQHJldHVybnMge09ic2VydmFibGV9IEFuIG9ic2VydmFibGUgc2VxdWVuY2UgY29udGFpbmluZyB0aGUgcmVzdWx0IG9mIGNvbWJpbmluZyBlbGVtZW50cyBvZiB0aGUgYXJncyB1c2luZyB0aGUgc3BlY2lmaWVkIHJlc3VsdCBzZWxlY3RvciBmdW5jdGlvbi5cbiAgICovXG4gIG9ic2VydmFibGVQcm90by56aXAgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHsgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIGFyZ3VtZW50cycpOyB9XG5cbiAgICB2YXIgbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IG5ldyBBcnJheShsZW4pO1xuICAgIGZvcih2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykgeyBhcmdzW2ldID0gYXJndW1lbnRzW2ldOyB9XG4gICAgdmFyIHJlc3VsdFNlbGVjdG9yID0gaXNGdW5jdGlvbihhcmdzW2xlbiAtIDFdKSA/IGFyZ3MucG9wKCkgOiBhcmd1bWVudHNUb0FycmF5O1xuICAgIEFycmF5LmlzQXJyYXkoYXJnc1swXSkgJiYgKGFyZ3MgPSBhcmdzWzBdKTtcblxuICAgIHZhciBwYXJlbnQgPSB0aGlzO1xuICAgIGFyZ3MudW5zaGlmdChwYXJlbnQpO1xuXG4gICAgcmV0dXJuIG5ldyBaaXBPYnNlcnZhYmxlKGFyZ3MsIHJlc3VsdFNlbGVjdG9yKTtcbiAgfTtcblxuICAvKipcbiAgICogTWVyZ2VzIHRoZSBzcGVjaWZpZWQgb2JzZXJ2YWJsZSBzZXF1ZW5jZXMgaW50byBvbmUgb2JzZXJ2YWJsZSBzZXF1ZW5jZSBieSB1c2luZyB0aGUgc2VsZWN0b3IgZnVuY3Rpb24gd2hlbmV2ZXIgYWxsIG9mIHRoZSBvYnNlcnZhYmxlIHNlcXVlbmNlcyBoYXZlIHByb2R1Y2VkIGFuIGVsZW1lbnQgYXQgYSBjb3JyZXNwb25kaW5nIGluZGV4LlxuICAgKiBAcGFyYW0gYXJndW1lbnRzIE9ic2VydmFibGUgc291cmNlcy5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gcmVzdWx0U2VsZWN0b3IgRnVuY3Rpb24gdG8gaW52b2tlIGZvciBlYWNoIHNlcmllcyBvZiBlbGVtZW50cyBhdCBjb3JyZXNwb25kaW5nIGluZGV4ZXMgaW4gdGhlIHNvdXJjZXMuXG4gICAqIEByZXR1cm5zIHtPYnNlcnZhYmxlfSBBbiBvYnNlcnZhYmxlIHNlcXVlbmNlIGNvbnRhaW5pbmcgdGhlIHJlc3VsdCBvZiBjb21iaW5pbmcgZWxlbWVudHMgb2YgdGhlIHNvdXJjZXMgdXNpbmcgdGhlIHNwZWNpZmllZCByZXN1bHQgc2VsZWN0b3IgZnVuY3Rpb24uXG4gICAqL1xuICBPYnNlcnZhYmxlLnppcCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IG5ldyBBcnJheShsZW4pO1xuICAgIGZvcih2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykgeyBhcmdzW2ldID0gYXJndW1lbnRzW2ldOyB9XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoYXJnc1swXSkpIHtcbiAgICAgIGFyZ3MgPSBpc0Z1bmN0aW9uKGFyZ3NbMV0pID8gYXJnc1swXS5jb25jYXQoYXJnc1sxXSkgOiBhcmdzWzBdO1xuICAgIH1cbiAgICB2YXIgZmlyc3QgPSBhcmdzLnNoaWZ0KCk7XG4gICAgcmV0dXJuIGZpcnN0LnppcC5hcHBseShmaXJzdCwgYXJncyk7XG4gIH07XG5cbmZ1bmN0aW9uIGZhbHNlRmFjdG9yeSgpIHsgcmV0dXJuIGZhbHNlOyB9XG5mdW5jdGlvbiBlbXB0eUFycmF5RmFjdG9yeSgpIHsgcmV0dXJuIFtdOyB9XG5mdW5jdGlvbiBhcmd1bWVudHNUb0FycmF5KCkge1xuICB2YXIgbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IG5ldyBBcnJheShsZW4pO1xuICBmb3IodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHsgYXJnc1tpXSA9IGFyZ3VtZW50c1tpXTsgfVxuICByZXR1cm4gYXJncztcbn1cblxudmFyIFppcEl0ZXJhYmxlT2JzZXJ2YWJsZSA9IChmdW5jdGlvbihfX3N1cGVyX18pIHtcbiAgaW5oZXJpdHMoWmlwSXRlcmFibGVPYnNlcnZhYmxlLCBfX3N1cGVyX18pO1xuICBmdW5jdGlvbiBaaXBJdGVyYWJsZU9ic2VydmFibGUoc291cmNlcywgY2IpIHtcbiAgICB0aGlzLnNvdXJjZXMgPSBzb3VyY2VzO1xuICAgIHRoaXMuX2NiID0gY2I7XG4gICAgX19zdXBlcl9fLmNhbGwodGhpcyk7XG4gIH1cblxuICBaaXBJdGVyYWJsZU9ic2VydmFibGUucHJvdG90eXBlLnN1YnNjcmliZUNvcmUgPSBmdW5jdGlvbiAobykge1xuICAgIHZhciBzb3VyY2VzID0gdGhpcy5zb3VyY2VzLCBsZW4gPSBzb3VyY2VzLmxlbmd0aCwgc3Vic2NyaXB0aW9ucyA9IG5ldyBBcnJheShsZW4pO1xuXG4gICAgdmFyIHN0YXRlID0ge1xuICAgICAgcTogYXJyYXlJbml0aWFsaXplKGxlbiwgZW1wdHlBcnJheUZhY3RvcnkpLFxuICAgICAgZG9uZTogYXJyYXlJbml0aWFsaXplKGxlbiwgZmFsc2VGYWN0b3J5KSxcbiAgICAgIGNiOiB0aGlzLl9jYixcbiAgICAgIG86IG9cbiAgICB9O1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgKGZ1bmN0aW9uIChpKSB7XG4gICAgICAgIHZhciBzb3VyY2UgPSBzb3VyY2VzW2ldLCBzYWQgPSBuZXcgU2luZ2xlQXNzaWdubWVudERpc3Bvc2FibGUoKTtcbiAgICAgICAgKGlzQXJyYXlMaWtlKHNvdXJjZSkgfHwgaXNJdGVyYWJsZShzb3VyY2UpKSAmJiAoc291cmNlID0gb2JzZXJ2YWJsZUZyb20oc291cmNlKSk7XG5cbiAgICAgICAgc3Vic2NyaXB0aW9uc1tpXSA9IHNhZDtcbiAgICAgICAgc2FkLnNldERpc3Bvc2FibGUoc291cmNlLnN1YnNjcmliZShuZXcgWmlwSXRlcmFibGVPYnNlcnZlcihzdGF0ZSwgaSkpKTtcbiAgICAgIH0oaSkpO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgTkFyeURpc3Bvc2FibGUoc3Vic2NyaXB0aW9ucyk7XG4gIH07XG5cbiAgcmV0dXJuIFppcEl0ZXJhYmxlT2JzZXJ2YWJsZTtcbn0oT2JzZXJ2YWJsZUJhc2UpKTtcblxudmFyIFppcEl0ZXJhYmxlT2JzZXJ2ZXIgPSAoZnVuY3Rpb24gKF9fc3VwZXJfXykge1xuICBpbmhlcml0cyhaaXBJdGVyYWJsZU9ic2VydmVyLCBfX3N1cGVyX18pO1xuICBmdW5jdGlvbiBaaXBJdGVyYWJsZU9ic2VydmVyKHMsIGkpIHtcbiAgICB0aGlzLl9zID0gcztcbiAgICB0aGlzLl9pID0gaTtcbiAgICBfX3N1cGVyX18uY2FsbCh0aGlzKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG5vdEVtcHR5KHgpIHsgcmV0dXJuIHgubGVuZ3RoID4gMDsgfVxuICBmdW5jdGlvbiBzaGlmdEVhY2goeCkgeyByZXR1cm4geC5zaGlmdCgpOyB9XG4gIGZ1bmN0aW9uIG5vdFRoZVNhbWUoaSkge1xuICAgIHJldHVybiBmdW5jdGlvbiAoeCwgaikge1xuICAgICAgcmV0dXJuIGogIT09IGk7XG4gICAgfTtcbiAgfVxuXG4gIFppcEl0ZXJhYmxlT2JzZXJ2ZXIucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbiAoeCkge1xuICAgIHRoaXMuX3MucVt0aGlzLl9pXS5wdXNoKHgpO1xuICAgIGlmICh0aGlzLl9zLnEuZXZlcnkobm90RW1wdHkpKSB7XG4gICAgICB2YXIgcXVldWVkVmFsdWVzID0gdGhpcy5fcy5xLm1hcChzaGlmdEVhY2gpLFxuICAgICAgICAgIHJlcyA9IHRyeUNhdGNoKHRoaXMuX3MuY2IpLmFwcGx5KG51bGwsIHF1ZXVlZFZhbHVlcyk7XG4gICAgICBpZiAocmVzID09PSBlcnJvck9iaikgeyByZXR1cm4gdGhpcy5fcy5vLm9uRXJyb3IocmVzLmUpOyB9XG4gICAgICB0aGlzLl9zLm8ub25OZXh0KHJlcyk7XG4gICAgfSBlbHNlIGlmICh0aGlzLl9zLmRvbmUuZmlsdGVyKG5vdFRoZVNhbWUodGhpcy5faSkpLmV2ZXJ5KGlkZW50aXR5KSkge1xuICAgICAgdGhpcy5fcy5vLm9uQ29tcGxldGVkKCk7XG4gICAgfVxuICB9O1xuXG4gIFppcEl0ZXJhYmxlT2JzZXJ2ZXIucHJvdG90eXBlLmVycm9yID0gZnVuY3Rpb24gKGUpIHsgdGhpcy5fcy5vLm9uRXJyb3IoZSk7IH07XG5cbiAgWmlwSXRlcmFibGVPYnNlcnZlci5wcm90b3R5cGUuY29tcGxldGVkID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuX3MuZG9uZVt0aGlzLl9pXSA9IHRydWU7XG4gICAgdGhpcy5fcy5kb25lLmV2ZXJ5KGlkZW50aXR5KSAmJiB0aGlzLl9zLm8ub25Db21wbGV0ZWQoKTtcbiAgfTtcblxuICByZXR1cm4gWmlwSXRlcmFibGVPYnNlcnZlcjtcbn0oQWJzdHJhY3RPYnNlcnZlcikpO1xuXG4vKipcbiAqIE1lcmdlcyB0aGUgc3BlY2lmaWVkIG9ic2VydmFibGUgc2VxdWVuY2VzIGludG8gb25lIG9ic2VydmFibGUgc2VxdWVuY2UgYnkgdXNpbmcgdGhlIHNlbGVjdG9yIGZ1bmN0aW9uIHdoZW5ldmVyIGFsbCBvZiB0aGUgb2JzZXJ2YWJsZSBzZXF1ZW5jZXMgb3IgYW4gYXJyYXkgaGF2ZSBwcm9kdWNlZCBhbiBlbGVtZW50IGF0IGEgY29ycmVzcG9uZGluZyBpbmRleC5cbiAqIFRoZSBsYXN0IGVsZW1lbnQgaW4gdGhlIGFyZ3VtZW50cyBtdXN0IGJlIGEgZnVuY3Rpb24gdG8gaW52b2tlIGZvciBlYWNoIHNlcmllcyBvZiBlbGVtZW50cyBhdCBjb3JyZXNwb25kaW5nIGluZGV4ZXMgaW4gdGhlIGFyZ3MuXG4gKiBAcmV0dXJucyB7T2JzZXJ2YWJsZX0gQW4gb2JzZXJ2YWJsZSBzZXF1ZW5jZSBjb250YWluaW5nIHRoZSByZXN1bHQgb2YgY29tYmluaW5nIGVsZW1lbnRzIG9mIHRoZSBhcmdzIHVzaW5nIHRoZSBzcGVjaWZpZWQgcmVzdWx0IHNlbGVjdG9yIGZ1bmN0aW9uLlxuICovXG5vYnNlcnZhYmxlUHJvdG8uemlwSXRlcmFibGUgPSBmdW5jdGlvbiAoKSB7XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7IHRocm93IG5ldyBFcnJvcignaW52YWxpZCBhcmd1bWVudHMnKTsgfVxuXG4gIHZhciBsZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gbmV3IEFycmF5KGxlbik7XG4gIGZvcih2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykgeyBhcmdzW2ldID0gYXJndW1lbnRzW2ldOyB9XG4gIHZhciByZXN1bHRTZWxlY3RvciA9IGlzRnVuY3Rpb24oYXJnc1tsZW4gLSAxXSkgPyBhcmdzLnBvcCgpIDogYXJndW1lbnRzVG9BcnJheTtcblxuICB2YXIgcGFyZW50ID0gdGhpcztcbiAgYXJncy51bnNoaWZ0KHBhcmVudCk7XG4gIHJldHVybiBuZXcgWmlwSXRlcmFibGVPYnNlcnZhYmxlKGFyZ3MsIHJlc3VsdFNlbGVjdG9yKTtcbn07XG5cbiAgZnVuY3Rpb24gYXNPYnNlcnZhYmxlKHNvdXJjZSkge1xuICAgIHJldHVybiBmdW5jdGlvbiBzdWJzY3JpYmUobykgeyByZXR1cm4gc291cmNlLnN1YnNjcmliZShvKTsgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgSGlkZXMgdGhlIGlkZW50aXR5IG9mIGFuIG9ic2VydmFibGUgc2VxdWVuY2UuXG4gICAqIEByZXR1cm5zIHtPYnNlcnZhYmxlfSBBbiBvYnNlcnZhYmxlIHNlcXVlbmNlIHRoYXQgaGlkZXMgdGhlIGlkZW50aXR5IG9mIHRoZSBzb3VyY2Ugc2VxdWVuY2UuXG4gICAqL1xuICBvYnNlcnZhYmxlUHJvdG8uYXNPYnNlcnZhYmxlID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBuZXcgQW5vbnltb3VzT2JzZXJ2YWJsZShhc09ic2VydmFibGUodGhpcyksIHRoaXMpO1xuICB9O1xuXG4gIHZhciBEZW1hdGVyaWFsaXplT2JzZXJ2YWJsZSA9IChmdW5jdGlvbiAoX19zdXBlcl9fKSB7XG4gICAgaW5oZXJpdHMoRGVtYXRlcmlhbGl6ZU9ic2VydmFibGUsIF9fc3VwZXJfXyk7XG4gICAgZnVuY3Rpb24gRGVtYXRlcmlhbGl6ZU9ic2VydmFibGUoc291cmNlKSB7XG4gICAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcbiAgICAgIF9fc3VwZXJfXy5jYWxsKHRoaXMpO1xuICAgIH1cblxuICAgIERlbWF0ZXJpYWxpemVPYnNlcnZhYmxlLnByb3RvdHlwZS5zdWJzY3JpYmVDb3JlID0gZnVuY3Rpb24gKG8pIHtcbiAgICAgIHJldHVybiB0aGlzLnNvdXJjZS5zdWJzY3JpYmUobmV3IERlbWF0ZXJpYWxpemVPYnNlcnZlcihvKSk7XG4gICAgfTtcblxuICAgIHJldHVybiBEZW1hdGVyaWFsaXplT2JzZXJ2YWJsZTtcbiAgfShPYnNlcnZhYmxlQmFzZSkpO1xuXG4gIHZhciBEZW1hdGVyaWFsaXplT2JzZXJ2ZXIgPSAoZnVuY3Rpb24gKF9fc3VwZXJfXykge1xuICAgIGluaGVyaXRzKERlbWF0ZXJpYWxpemVPYnNlcnZlciwgX19zdXBlcl9fKTtcblxuICAgIGZ1bmN0aW9uIERlbWF0ZXJpYWxpemVPYnNlcnZlcihvKSB7XG4gICAgICB0aGlzLl9vID0gbztcbiAgICAgIF9fc3VwZXJfXy5jYWxsKHRoaXMpO1xuICAgIH1cblxuICAgIERlbWF0ZXJpYWxpemVPYnNlcnZlci5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uICh4KSB7IHguYWNjZXB0KHRoaXMuX28pOyB9O1xuICAgIERlbWF0ZXJpYWxpemVPYnNlcnZlci5wcm90b3R5cGUuZXJyb3IgPSBmdW5jdGlvbiAoZSkgeyB0aGlzLl9vLm9uRXJyb3IoZSk7IH07XG4gICAgRGVtYXRlcmlhbGl6ZU9ic2VydmVyLnByb3RvdHlwZS5jb21wbGV0ZWQgPSBmdW5jdGlvbiAoKSB7IHRoaXMuX28ub25Db21wbGV0ZWQoKTsgfTtcblxuICAgIHJldHVybiBEZW1hdGVyaWFsaXplT2JzZXJ2ZXI7XG4gIH0oQWJzdHJhY3RPYnNlcnZlcikpO1xuXG4gIC8qKlxuICAgKiBEZW1hdGVyaWFsaXplcyB0aGUgZXhwbGljaXQgbm90aWZpY2F0aW9uIHZhbHVlcyBvZiBhbiBvYnNlcnZhYmxlIHNlcXVlbmNlIGFzIGltcGxpY2l0IG5vdGlmaWNhdGlvbnMuXG4gICAqIEByZXR1cm5zIHtPYnNlcnZhYmxlfSBBbiBvYnNlcnZhYmxlIHNlcXVlbmNlIGV4aGliaXRpbmcgdGhlIGJlaGF2aW9yIGNvcnJlc3BvbmRpbmcgdG8gdGhlIHNvdXJjZSBzZXF1ZW5jZSdzIG5vdGlmaWNhdGlvbiB2YWx1ZXMuXG4gICAqL1xuICBvYnNlcnZhYmxlUHJvdG8uZGVtYXRlcmlhbGl6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gbmV3IERlbWF0ZXJpYWxpemVPYnNlcnZhYmxlKHRoaXMpO1xuICB9O1xuXG4gIHZhciBEaXN0aW5jdFVudGlsQ2hhbmdlZE9ic2VydmFibGUgPSAoZnVuY3Rpb24oX19zdXBlcl9fKSB7XG4gICAgaW5oZXJpdHMoRGlzdGluY3RVbnRpbENoYW5nZWRPYnNlcnZhYmxlLCBfX3N1cGVyX18pO1xuICAgIGZ1bmN0aW9uIERpc3RpbmN0VW50aWxDaGFuZ2VkT2JzZXJ2YWJsZShzb3VyY2UsIGtleUZuLCBjb21wYXJlcikge1xuICAgICAgdGhpcy5zb3VyY2UgPSBzb3VyY2U7XG4gICAgICB0aGlzLmtleUZuID0ga2V5Rm47XG4gICAgICB0aGlzLmNvbXBhcmVyID0gY29tcGFyZXI7XG4gICAgICBfX3N1cGVyX18uY2FsbCh0aGlzKTtcbiAgICB9XG5cbiAgICBEaXN0aW5jdFVudGlsQ2hhbmdlZE9ic2VydmFibGUucHJvdG90eXBlLnN1YnNjcmliZUNvcmUgPSBmdW5jdGlvbiAobykge1xuICAgICAgcmV0dXJuIHRoaXMuc291cmNlLnN1YnNjcmliZShuZXcgRGlzdGluY3RVbnRpbENoYW5nZWRPYnNlcnZlcihvLCB0aGlzLmtleUZuLCB0aGlzLmNvbXBhcmVyKSk7XG4gICAgfTtcblxuICAgIHJldHVybiBEaXN0aW5jdFVudGlsQ2hhbmdlZE9ic2VydmFibGU7XG4gIH0oT2JzZXJ2YWJsZUJhc2UpKTtcblxuICB2YXIgRGlzdGluY3RVbnRpbENoYW5nZWRPYnNlcnZlciA9IChmdW5jdGlvbihfX3N1cGVyX18pIHtcbiAgICBpbmhlcml0cyhEaXN0aW5jdFVudGlsQ2hhbmdlZE9ic2VydmVyLCBfX3N1cGVyX18pO1xuICAgIGZ1bmN0aW9uIERpc3RpbmN0VW50aWxDaGFuZ2VkT2JzZXJ2ZXIobywga2V5Rm4sIGNvbXBhcmVyKSB7XG4gICAgICB0aGlzLm8gPSBvO1xuICAgICAgdGhpcy5rZXlGbiA9IGtleUZuO1xuICAgICAgdGhpcy5jb21wYXJlciA9IGNvbXBhcmVyO1xuICAgICAgdGhpcy5oYXNDdXJyZW50S2V5ID0gZmFsc2U7XG4gICAgICB0aGlzLmN1cnJlbnRLZXkgPSBudWxsO1xuICAgICAgX19zdXBlcl9fLmNhbGwodGhpcyk7XG4gICAgfVxuXG4gICAgRGlzdGluY3RVbnRpbENoYW5nZWRPYnNlcnZlci5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uICh4KSB7XG4gICAgICB2YXIga2V5ID0geCwgY29tcGFyZXJFcXVhbHM7XG4gICAgICBpZiAoaXNGdW5jdGlvbih0aGlzLmtleUZuKSkge1xuICAgICAgICBrZXkgPSB0cnlDYXRjaCh0aGlzLmtleUZuKSh4KTtcbiAgICAgICAgaWYgKGtleSA9PT0gZXJyb3JPYmopIHsgcmV0dXJuIHRoaXMuby5vbkVycm9yKGtleS5lKTsgfVxuICAgICAgfVxuICAgICAgaWYgKHRoaXMuaGFzQ3VycmVudEtleSkge1xuICAgICAgICBjb21wYXJlckVxdWFscyA9IHRyeUNhdGNoKHRoaXMuY29tcGFyZXIpKHRoaXMuY3VycmVudEtleSwga2V5KTtcbiAgICAgICAgaWYgKGNvbXBhcmVyRXF1YWxzID09PSBlcnJvck9iaikgeyByZXR1cm4gdGhpcy5vLm9uRXJyb3IoY29tcGFyZXJFcXVhbHMuZSk7IH1cbiAgICAgIH1cbiAgICAgIGlmICghdGhpcy5oYXNDdXJyZW50S2V5IHx8ICFjb21wYXJlckVxdWFscykge1xuICAgICAgICB0aGlzLmhhc0N1cnJlbnRLZXkgPSB0cnVlO1xuICAgICAgICB0aGlzLmN1cnJlbnRLZXkgPSBrZXk7XG4gICAgICAgIHRoaXMuby5vbk5leHQoeCk7XG4gICAgICB9XG4gICAgfTtcbiAgICBEaXN0aW5jdFVudGlsQ2hhbmdlZE9ic2VydmVyLnByb3RvdHlwZS5lcnJvciA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgIHRoaXMuby5vbkVycm9yKGUpO1xuICAgIH07XG4gICAgRGlzdGluY3RVbnRpbENoYW5nZWRPYnNlcnZlci5wcm90b3R5cGUuY29tcGxldGVkID0gZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5vLm9uQ29tcGxldGVkKCk7XG4gICAgfTtcblxuICAgIHJldHVybiBEaXN0aW5jdFVudGlsQ2hhbmdlZE9ic2VydmVyO1xuICB9KEFic3RyYWN0T2JzZXJ2ZXIpKTtcblxuICAvKipcbiAgKiAgUmV0dXJucyBhbiBvYnNlcnZhYmxlIHNlcXVlbmNlIHRoYXQgY29udGFpbnMgb25seSBkaXN0aW5jdCBjb250aWd1b3VzIGVsZW1lbnRzIGFjY29yZGluZyB0byB0aGUga2V5Rm4gYW5kIHRoZSBjb21wYXJlci5cbiAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBba2V5Rm5dIEEgZnVuY3Rpb24gdG8gY29tcHV0ZSB0aGUgY29tcGFyaXNvbiBrZXkgZm9yIGVhY2ggZWxlbWVudC4gSWYgbm90IHByb3ZpZGVkLCBpdCBwcm9qZWN0cyB0aGUgdmFsdWUuXG4gICogQHBhcmFtIHtGdW5jdGlvbn0gW2NvbXBhcmVyXSBFcXVhbGl0eSBjb21wYXJlciBmb3IgY29tcHV0ZWQga2V5IHZhbHVlcy4gSWYgbm90IHByb3ZpZGVkLCBkZWZhdWx0cyB0byBhbiBlcXVhbGl0eSBjb21wYXJlciBmdW5jdGlvbi5cbiAgKiBAcmV0dXJucyB7T2JzZXJ2YWJsZX0gQW4gb2JzZXJ2YWJsZSBzZXF1ZW5jZSBvbmx5IGNvbnRhaW5pbmcgdGhlIGRpc3RpbmN0IGNvbnRpZ3VvdXMgZWxlbWVudHMsIGJhc2VkIG9uIGEgY29tcHV0ZWQga2V5IHZhbHVlLCBmcm9tIHRoZSBzb3VyY2Ugc2VxdWVuY2UuXG4gICovXG4gIG9ic2VydmFibGVQcm90by5kaXN0aW5jdFVudGlsQ2hhbmdlZCA9IGZ1bmN0aW9uIChrZXlGbiwgY29tcGFyZXIpIHtcbiAgICBjb21wYXJlciB8fCAoY29tcGFyZXIgPSBkZWZhdWx0Q29tcGFyZXIpO1xuICAgIHJldHVybiBuZXcgRGlzdGluY3RVbnRpbENoYW5nZWRPYnNlcnZhYmxlKHRoaXMsIGtleUZuLCBjb21wYXJlcik7XG4gIH07XG5cbiAgdmFyIFRhcE9ic2VydmFibGUgPSAoZnVuY3Rpb24oX19zdXBlcl9fKSB7XG4gICAgaW5oZXJpdHMoVGFwT2JzZXJ2YWJsZSxfX3N1cGVyX18pO1xuICAgIGZ1bmN0aW9uIFRhcE9ic2VydmFibGUoc291cmNlLCBvYnNlcnZlck9yT25OZXh0LCBvbkVycm9yLCBvbkNvbXBsZXRlZCkge1xuICAgICAgdGhpcy5zb3VyY2UgPSBzb3VyY2U7XG4gICAgICB0aGlzLl9vTiA9IG9ic2VydmVyT3JPbk5leHQ7XG4gICAgICB0aGlzLl9vRSA9IG9uRXJyb3I7XG4gICAgICB0aGlzLl9vQyA9IG9uQ29tcGxldGVkO1xuICAgICAgX19zdXBlcl9fLmNhbGwodGhpcyk7XG4gICAgfVxuXG4gICAgVGFwT2JzZXJ2YWJsZS5wcm90b3R5cGUuc3Vic2NyaWJlQ29yZSA9IGZ1bmN0aW9uKG8pIHtcbiAgICAgIHJldHVybiB0aGlzLnNvdXJjZS5zdWJzY3JpYmUobmV3IElubmVyT2JzZXJ2ZXIobywgdGhpcykpO1xuICAgIH07XG5cbiAgICBpbmhlcml0cyhJbm5lck9ic2VydmVyLCBBYnN0cmFjdE9ic2VydmVyKTtcbiAgICBmdW5jdGlvbiBJbm5lck9ic2VydmVyKG8sIHApIHtcbiAgICAgIHRoaXMubyA9IG87XG4gICAgICB0aGlzLnQgPSAhcC5fb04gfHwgaXNGdW5jdGlvbihwLl9vTikgP1xuICAgICAgICBvYnNlcnZlckNyZWF0ZShwLl9vTiB8fCBub29wLCBwLl9vRSB8fCBub29wLCBwLl9vQyB8fCBub29wKSA6XG4gICAgICAgIHAuX29OO1xuICAgICAgdGhpcy5pc1N0b3BwZWQgPSBmYWxzZTtcbiAgICAgIEFic3RyYWN0T2JzZXJ2ZXIuY2FsbCh0aGlzKTtcbiAgICB9XG4gICAgSW5uZXJPYnNlcnZlci5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uKHgpIHtcbiAgICAgIHZhciByZXMgPSB0cnlDYXRjaCh0aGlzLnQub25OZXh0KS5jYWxsKHRoaXMudCwgeCk7XG4gICAgICBpZiAocmVzID09PSBlcnJvck9iaikgeyB0aGlzLm8ub25FcnJvcihyZXMuZSk7IH1cbiAgICAgIHRoaXMuby5vbk5leHQoeCk7XG4gICAgfTtcbiAgICBJbm5lck9ic2VydmVyLnByb3RvdHlwZS5lcnJvciA9IGZ1bmN0aW9uKGVycikge1xuICAgICAgdmFyIHJlcyA9IHRyeUNhdGNoKHRoaXMudC5vbkVycm9yKS5jYWxsKHRoaXMudCwgZXJyKTtcbiAgICAgIGlmIChyZXMgPT09IGVycm9yT2JqKSB7IHJldHVybiB0aGlzLm8ub25FcnJvcihyZXMuZSk7IH1cbiAgICAgIHRoaXMuby5vbkVycm9yKGVycik7XG4gICAgfTtcbiAgICBJbm5lck9ic2VydmVyLnByb3RvdHlwZS5jb21wbGV0ZWQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciByZXMgPSB0cnlDYXRjaCh0aGlzLnQub25Db21wbGV0ZWQpLmNhbGwodGhpcy50KTtcbiAgICAgIGlmIChyZXMgPT09IGVycm9yT2JqKSB7IHJldHVybiB0aGlzLm8ub25FcnJvcihyZXMuZSk7IH1cbiAgICAgIHRoaXMuby5vbkNvbXBsZXRlZCgpO1xuICAgIH07XG5cbiAgICByZXR1cm4gVGFwT2JzZXJ2YWJsZTtcbiAgfShPYnNlcnZhYmxlQmFzZSkpO1xuXG4gIC8qKlxuICAqICBJbnZva2VzIGFuIGFjdGlvbiBmb3IgZWFjaCBlbGVtZW50IGluIHRoZSBvYnNlcnZhYmxlIHNlcXVlbmNlIGFuZCBpbnZva2VzIGFuIGFjdGlvbiB1cG9uIGdyYWNlZnVsIG9yIGV4Y2VwdGlvbmFsIHRlcm1pbmF0aW9uIG9mIHRoZSBvYnNlcnZhYmxlIHNlcXVlbmNlLlxuICAqICBUaGlzIG1ldGhvZCBjYW4gYmUgdXNlZCBmb3IgZGVidWdnaW5nLCBsb2dnaW5nLCBldGMuIG9mIHF1ZXJ5IGJlaGF2aW9yIGJ5IGludGVyY2VwdGluZyB0aGUgbWVzc2FnZSBzdHJlYW0gdG8gcnVuIGFyYml0cmFyeSBhY3Rpb25zIGZvciBtZXNzYWdlcyBvbiB0aGUgcGlwZWxpbmUuXG4gICogQHBhcmFtIHtGdW5jdGlvbiB8IE9ic2VydmVyfSBvYnNlcnZlck9yT25OZXh0IEFjdGlvbiB0byBpbnZva2UgZm9yIGVhY2ggZWxlbWVudCBpbiB0aGUgb2JzZXJ2YWJsZSBzZXF1ZW5jZSBvciBhbiBvLlxuICAqIEBwYXJhbSB7RnVuY3Rpb259IFtvbkVycm9yXSAgQWN0aW9uIHRvIGludm9rZSB1cG9uIGV4Y2VwdGlvbmFsIHRlcm1pbmF0aW9uIG9mIHRoZSBvYnNlcnZhYmxlIHNlcXVlbmNlLiBVc2VkIGlmIG9ubHkgdGhlIG9ic2VydmVyT3JPbk5leHQgcGFyYW1ldGVyIGlzIGFsc28gYSBmdW5jdGlvbi5cbiAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb25Db21wbGV0ZWRdICBBY3Rpb24gdG8gaW52b2tlIHVwb24gZ3JhY2VmdWwgdGVybWluYXRpb24gb2YgdGhlIG9ic2VydmFibGUgc2VxdWVuY2UuIFVzZWQgaWYgb25seSB0aGUgb2JzZXJ2ZXJPck9uTmV4dCBwYXJhbWV0ZXIgaXMgYWxzbyBhIGZ1bmN0aW9uLlxuICAqIEByZXR1cm5zIHtPYnNlcnZhYmxlfSBUaGUgc291cmNlIHNlcXVlbmNlIHdpdGggdGhlIHNpZGUtZWZmZWN0aW5nIGJlaGF2aW9yIGFwcGxpZWQuXG4gICovXG4gIG9ic2VydmFibGVQcm90b1snZG8nXSA9IG9ic2VydmFibGVQcm90by50YXAgPSBvYnNlcnZhYmxlUHJvdG8uZG9BY3Rpb24gPSBmdW5jdGlvbiAob2JzZXJ2ZXJPck9uTmV4dCwgb25FcnJvciwgb25Db21wbGV0ZWQpIHtcbiAgICByZXR1cm4gbmV3IFRhcE9ic2VydmFibGUodGhpcywgb2JzZXJ2ZXJPck9uTmV4dCwgb25FcnJvciwgb25Db21wbGV0ZWQpO1xuICB9O1xuXG4gIC8qKlxuICAqICBJbnZva2VzIGFuIGFjdGlvbiBmb3IgZWFjaCBlbGVtZW50IGluIHRoZSBvYnNlcnZhYmxlIHNlcXVlbmNlLlxuICAqICBUaGlzIG1ldGhvZCBjYW4gYmUgdXNlZCBmb3IgZGVidWdnaW5nLCBsb2dnaW5nLCBldGMuIG9mIHF1ZXJ5IGJlaGF2aW9yIGJ5IGludGVyY2VwdGluZyB0aGUgbWVzc2FnZSBzdHJlYW0gdG8gcnVuIGFyYml0cmFyeSBhY3Rpb25zIGZvciBtZXNzYWdlcyBvbiB0aGUgcGlwZWxpbmUuXG4gICogQHBhcmFtIHtGdW5jdGlvbn0gb25OZXh0IEFjdGlvbiB0byBpbnZva2UgZm9yIGVhY2ggZWxlbWVudCBpbiB0aGUgb2JzZXJ2YWJsZSBzZXF1ZW5jZS5cbiAgKiBAcGFyYW0ge0FueX0gW3RoaXNBcmddIE9iamVjdCB0byB1c2UgYXMgdGhpcyB3aGVuIGV4ZWN1dGluZyBjYWxsYmFjay5cbiAgKiBAcmV0dXJucyB7T2JzZXJ2YWJsZX0gVGhlIHNvdXJjZSBzZXF1ZW5jZSB3aXRoIHRoZSBzaWRlLWVmZmVjdGluZyBiZWhhdmlvciBhcHBsaWVkLlxuICAqL1xuICBvYnNlcnZhYmxlUHJvdG8uZG9Pbk5leHQgPSBvYnNlcnZhYmxlUHJvdG8udGFwT25OZXh0ID0gZnVuY3Rpb24gKG9uTmV4dCwgdGhpc0FyZykge1xuICAgIHJldHVybiB0aGlzLnRhcCh0eXBlb2YgdGhpc0FyZyAhPT0gJ3VuZGVmaW5lZCcgPyBmdW5jdGlvbiAoeCkgeyBvbk5leHQuY2FsbCh0aGlzQXJnLCB4KTsgfSA6IG9uTmV4dCk7XG4gIH07XG5cbiAgLyoqXG4gICogIEludm9rZXMgYW4gYWN0aW9uIHVwb24gZXhjZXB0aW9uYWwgdGVybWluYXRpb24gb2YgdGhlIG9ic2VydmFibGUgc2VxdWVuY2UuXG4gICogIFRoaXMgbWV0aG9kIGNhbiBiZSB1c2VkIGZvciBkZWJ1Z2dpbmcsIGxvZ2dpbmcsIGV0Yy4gb2YgcXVlcnkgYmVoYXZpb3IgYnkgaW50ZXJjZXB0aW5nIHRoZSBtZXNzYWdlIHN0cmVhbSB0byBydW4gYXJiaXRyYXJ5IGFjdGlvbnMgZm9yIG1lc3NhZ2VzIG9uIHRoZSBwaXBlbGluZS5cbiAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBvbkVycm9yIEFjdGlvbiB0byBpbnZva2UgdXBvbiBleGNlcHRpb25hbCB0ZXJtaW5hdGlvbiBvZiB0aGUgb2JzZXJ2YWJsZSBzZXF1ZW5jZS5cbiAgKiBAcGFyYW0ge0FueX0gW3RoaXNBcmddIE9iamVjdCB0byB1c2UgYXMgdGhpcyB3aGVuIGV4ZWN1dGluZyBjYWxsYmFjay5cbiAgKiBAcmV0dXJucyB7T2JzZXJ2YWJsZX0gVGhlIHNvdXJjZSBzZXF1ZW5jZSB3aXRoIHRoZSBzaWRlLWVmZmVjdGluZyBiZWhhdmlvciBhcHBsaWVkLlxuICAqL1xuICBvYnNlcnZhYmxlUHJvdG8uZG9PbkVycm9yID0gb2JzZXJ2YWJsZVByb3RvLnRhcE9uRXJyb3IgPSBmdW5jdGlvbiAob25FcnJvciwgdGhpc0FyZykge1xuICAgIHJldHVybiB0aGlzLnRhcChub29wLCB0eXBlb2YgdGhpc0FyZyAhPT0gJ3VuZGVmaW5lZCcgPyBmdW5jdGlvbiAoZSkgeyBvbkVycm9yLmNhbGwodGhpc0FyZywgZSk7IH0gOiBvbkVycm9yKTtcbiAgfTtcblxuICAvKipcbiAgKiAgSW52b2tlcyBhbiBhY3Rpb24gdXBvbiBncmFjZWZ1bCB0ZXJtaW5hdGlvbiBvZiB0aGUgb2JzZXJ2YWJsZSBzZXF1ZW5jZS5cbiAgKiAgVGhpcyBtZXRob2QgY2FuIGJlIHVzZWQgZm9yIGRlYnVnZ2luZywgbG9nZ2luZywgZXRjLiBvZiBxdWVyeSBiZWhhdmlvciBieSBpbnRlcmNlcHRpbmcgdGhlIG1lc3NhZ2Ugc3RyZWFtIHRvIHJ1biBhcmJpdHJhcnkgYWN0aW9ucyBmb3IgbWVzc2FnZXMgb24gdGhlIHBpcGVsaW5lLlxuICAqIEBwYXJhbSB7RnVuY3Rpb259IG9uQ29tcGxldGVkIEFjdGlvbiB0byBpbnZva2UgdXBvbiBncmFjZWZ1bCB0ZXJtaW5hdGlvbiBvZiB0aGUgb2JzZXJ2YWJsZSBzZXF1ZW5jZS5cbiAgKiBAcGFyYW0ge0FueX0gW3RoaXNBcmddIE9iamVjdCB0byB1c2UgYXMgdGhpcyB3aGVuIGV4ZWN1dGluZyBjYWxsYmFjay5cbiAgKiBAcmV0dXJucyB7T2JzZXJ2YWJsZX0gVGhlIHNvdXJjZSBzZXF1ZW5jZSB3aXRoIHRoZSBzaWRlLWVmZmVjdGluZyBiZWhhdmlvciBhcHBsaWVkLlxuICAqL1xuICBvYnNlcnZhYmxlUHJvdG8uZG9PbkNvbXBsZXRlZCA9IG9ic2VydmFibGVQcm90by50YXBPbkNvbXBsZXRlZCA9IGZ1bmN0aW9uIChvbkNvbXBsZXRlZCwgdGhpc0FyZykge1xuICAgIHJldHVybiB0aGlzLnRhcChub29wLCBudWxsLCB0eXBlb2YgdGhpc0FyZyAhPT0gJ3VuZGVmaW5lZCcgPyBmdW5jdGlvbiAoKSB7IG9uQ29tcGxldGVkLmNhbGwodGhpc0FyZyk7IH0gOiBvbkNvbXBsZXRlZCk7XG4gIH07XG5cbiAgdmFyIEZpbmFsbHlPYnNlcnZhYmxlID0gKGZ1bmN0aW9uIChfX3N1cGVyX18pIHtcbiAgICBpbmhlcml0cyhGaW5hbGx5T2JzZXJ2YWJsZSwgX19zdXBlcl9fKTtcbiAgICBmdW5jdGlvbiBGaW5hbGx5T2JzZXJ2YWJsZShzb3VyY2UsIGZuLCB0aGlzQXJnKSB7XG4gICAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcbiAgICAgIHRoaXMuX2ZuID0gYmluZENhbGxiYWNrKGZuLCB0aGlzQXJnLCAwKTtcbiAgICAgIF9fc3VwZXJfXy5jYWxsKHRoaXMpO1xuICAgIH1cblxuICAgIEZpbmFsbHlPYnNlcnZhYmxlLnByb3RvdHlwZS5zdWJzY3JpYmVDb3JlID0gZnVuY3Rpb24gKG8pIHtcbiAgICAgIHZhciBkID0gdHJ5Q2F0Y2godGhpcy5zb3VyY2Uuc3Vic2NyaWJlKS5jYWxsKHRoaXMuc291cmNlLCBvKTtcbiAgICAgIGlmIChkID09PSBlcnJvck9iaikge1xuICAgICAgICB0aGlzLl9mbigpO1xuICAgICAgICB0aHJvd2VyKGQuZSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBuZXcgRmluYWxseURpc3Bvc2FibGUoZCwgdGhpcy5fZm4pO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBGaW5hbGx5RGlzcG9zYWJsZShzLCBmbikge1xuICAgICAgdGhpcy5pc0Rpc3Bvc2VkID0gZmFsc2U7XG4gICAgICB0aGlzLl9zID0gcztcbiAgICAgIHRoaXMuX2ZuID0gZm47XG4gICAgfVxuICAgIEZpbmFsbHlEaXNwb3NhYmxlLnByb3RvdHlwZS5kaXNwb3NlID0gZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKCF0aGlzLmlzRGlzcG9zZWQpIHtcbiAgICAgICAgdmFyIHJlcyA9IHRyeUNhdGNoKHRoaXMuX3MuZGlzcG9zZSkuY2FsbCh0aGlzLl9zKTtcbiAgICAgICAgdGhpcy5fZm4oKTtcbiAgICAgICAgcmVzID09PSBlcnJvck9iaiAmJiB0aHJvd2VyKHJlcy5lKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIEZpbmFsbHlPYnNlcnZhYmxlO1xuXG4gIH0oT2JzZXJ2YWJsZUJhc2UpKTtcblxuICAvKipcbiAgICogIEludm9rZXMgYSBzcGVjaWZpZWQgYWN0aW9uIGFmdGVyIHRoZSBzb3VyY2Ugb2JzZXJ2YWJsZSBzZXF1ZW5jZSB0ZXJtaW5hdGVzIGdyYWNlZnVsbHkgb3IgZXhjZXB0aW9uYWxseS5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZmluYWxseUFjdGlvbiBBY3Rpb24gdG8gaW52b2tlIGFmdGVyIHRoZSBzb3VyY2Ugb2JzZXJ2YWJsZSBzZXF1ZW5jZSB0ZXJtaW5hdGVzLlxuICAgKiBAcmV0dXJucyB7T2JzZXJ2YWJsZX0gU291cmNlIHNlcXVlbmNlIHdpdGggdGhlIGFjdGlvbi1pbnZva2luZyB0ZXJtaW5hdGlvbiBiZWhhdmlvciBhcHBsaWVkLlxuICAgKi9cbiAgb2JzZXJ2YWJsZVByb3RvWydmaW5hbGx5J10gPSBmdW5jdGlvbiAoYWN0aW9uLCB0aGlzQXJnKSB7XG4gICAgcmV0dXJuIG5ldyBGaW5hbGx5T2JzZXJ2YWJsZSh0aGlzLCBhY3Rpb24sIHRoaXNBcmcpO1xuICB9O1xuXG4gIHZhciBJZ25vcmVFbGVtZW50c09ic2VydmFibGUgPSAoZnVuY3Rpb24oX19zdXBlcl9fKSB7XG4gICAgaW5oZXJpdHMoSWdub3JlRWxlbWVudHNPYnNlcnZhYmxlLCBfX3N1cGVyX18pO1xuXG4gICAgZnVuY3Rpb24gSWdub3JlRWxlbWVudHNPYnNlcnZhYmxlKHNvdXJjZSkge1xuICAgICAgdGhpcy5zb3VyY2UgPSBzb3VyY2U7XG4gICAgICBfX3N1cGVyX18uY2FsbCh0aGlzKTtcbiAgICB9XG5cbiAgICBJZ25vcmVFbGVtZW50c09ic2VydmFibGUucHJvdG90eXBlLnN1YnNjcmliZUNvcmUgPSBmdW5jdGlvbiAobykge1xuICAgICAgcmV0dXJuIHRoaXMuc291cmNlLnN1YnNjcmliZShuZXcgSW5uZXJPYnNlcnZlcihvKSk7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIElubmVyT2JzZXJ2ZXIobykge1xuICAgICAgdGhpcy5vID0gbztcbiAgICAgIHRoaXMuaXNTdG9wcGVkID0gZmFsc2U7XG4gICAgfVxuICAgIElubmVyT2JzZXJ2ZXIucHJvdG90eXBlLm9uTmV4dCA9IG5vb3A7XG4gICAgSW5uZXJPYnNlcnZlci5wcm90b3R5cGUub25FcnJvciA9IGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgIGlmKCF0aGlzLmlzU3RvcHBlZCkge1xuICAgICAgICB0aGlzLmlzU3RvcHBlZCA9IHRydWU7XG4gICAgICAgIHRoaXMuby5vbkVycm9yKGVycik7XG4gICAgICB9XG4gICAgfTtcbiAgICBJbm5lck9ic2VydmVyLnByb3RvdHlwZS5vbkNvbXBsZXRlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmKCF0aGlzLmlzU3RvcHBlZCkge1xuICAgICAgICB0aGlzLmlzU3RvcHBlZCA9IHRydWU7XG4gICAgICAgIHRoaXMuby5vbkNvbXBsZXRlZCgpO1xuICAgICAgfVxuICAgIH07XG4gICAgSW5uZXJPYnNlcnZlci5wcm90b3R5cGUuZGlzcG9zZSA9IGZ1bmN0aW9uKCkgeyB0aGlzLmlzU3RvcHBlZCA9IHRydWU7IH07XG4gICAgSW5uZXJPYnNlcnZlci5wcm90b3R5cGUuZmFpbCA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICBpZiAoIXRoaXMuaXNTdG9wcGVkKSB7XG4gICAgICAgIHRoaXMuaXNTdG9wcGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5vYnNlcnZlci5vbkVycm9yKGUpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG5cbiAgICByZXR1cm4gSWdub3JlRWxlbWVudHNPYnNlcnZhYmxlO1xuICB9KE9ic2VydmFibGVCYXNlKSk7XG5cbiAgLyoqXG4gICAqICBJZ25vcmVzIGFsbCBlbGVtZW50cyBpbiBhbiBvYnNlcnZhYmxlIHNlcXVlbmNlIGxlYXZpbmcgb25seSB0aGUgdGVybWluYXRpb24gbWVzc2FnZXMuXG4gICAqIEByZXR1cm5zIHtPYnNlcnZhYmxlfSBBbiBlbXB0eSBvYnNlcnZhYmxlIHNlcXVlbmNlIHRoYXQgc2lnbmFscyB0ZXJtaW5hdGlvbiwgc3VjY2Vzc2Z1bCBvciBleGNlcHRpb25hbCwgb2YgdGhlIHNvdXJjZSBzZXF1ZW5jZS5cbiAgICovXG4gIG9ic2VydmFibGVQcm90by5pZ25vcmVFbGVtZW50cyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gbmV3IElnbm9yZUVsZW1lbnRzT2JzZXJ2YWJsZSh0aGlzKTtcbiAgfTtcblxuICB2YXIgTWF0ZXJpYWxpemVPYnNlcnZhYmxlID0gKGZ1bmN0aW9uIChfX3N1cGVyX18pIHtcbiAgICBpbmhlcml0cyhNYXRlcmlhbGl6ZU9ic2VydmFibGUsIF9fc3VwZXJfXyk7XG4gICAgZnVuY3Rpb24gTWF0ZXJpYWxpemVPYnNlcnZhYmxlKHNvdXJjZSwgZm4pIHtcbiAgICAgIHRoaXMuc291cmNlID0gc291cmNlO1xuICAgICAgX19zdXBlcl9fLmNhbGwodGhpcyk7XG4gICAgfVxuXG4gICAgTWF0ZXJpYWxpemVPYnNlcnZhYmxlLnByb3RvdHlwZS5zdWJzY3JpYmVDb3JlID0gZnVuY3Rpb24gKG8pIHtcbiAgICAgIHJldHVybiB0aGlzLnNvdXJjZS5zdWJzY3JpYmUobmV3IE1hdGVyaWFsaXplT2JzZXJ2ZXIobykpO1xuICAgIH07XG5cbiAgICByZXR1cm4gTWF0ZXJpYWxpemVPYnNlcnZhYmxlO1xuICB9KE9ic2VydmFibGVCYXNlKSk7XG5cbiAgdmFyIE1hdGVyaWFsaXplT2JzZXJ2ZXIgPSAoZnVuY3Rpb24gKF9fc3VwZXJfXykge1xuICAgIGluaGVyaXRzKE1hdGVyaWFsaXplT2JzZXJ2ZXIsIF9fc3VwZXJfXyk7XG5cbiAgICBmdW5jdGlvbiBNYXRlcmlhbGl6ZU9ic2VydmVyKG8pIHtcbiAgICAgIHRoaXMuX28gPSBvO1xuICAgICAgX19zdXBlcl9fLmNhbGwodGhpcyk7XG4gICAgfVxuXG4gICAgTWF0ZXJpYWxpemVPYnNlcnZlci5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uICh4KSB7IHRoaXMuX28ub25OZXh0KG5vdGlmaWNhdGlvbkNyZWF0ZU9uTmV4dCh4KSkgfTtcbiAgICBNYXRlcmlhbGl6ZU9ic2VydmVyLnByb3RvdHlwZS5lcnJvciA9IGZ1bmN0aW9uIChlKSB7IHRoaXMuX28ub25OZXh0KG5vdGlmaWNhdGlvbkNyZWF0ZU9uRXJyb3IoZSkpOyB0aGlzLl9vLm9uQ29tcGxldGVkKCk7IH07XG4gICAgTWF0ZXJpYWxpemVPYnNlcnZlci5wcm90b3R5cGUuY29tcGxldGVkID0gZnVuY3Rpb24gKCkgeyB0aGlzLl9vLm9uTmV4dChub3RpZmljYXRpb25DcmVhdGVPbkNvbXBsZXRlZCgpKTsgdGhpcy5fby5vbkNvbXBsZXRlZCgpOyB9O1xuXG4gICAgcmV0dXJuIE1hdGVyaWFsaXplT2JzZXJ2ZXI7XG4gIH0oQWJzdHJhY3RPYnNlcnZlcikpO1xuXG4gIC8qKlxuICAgKiAgTWF0ZXJpYWxpemVzIHRoZSBpbXBsaWNpdCBub3RpZmljYXRpb25zIG9mIGFuIG9ic2VydmFibGUgc2VxdWVuY2UgYXMgZXhwbGljaXQgbm90aWZpY2F0aW9uIHZhbHVlcy5cbiAgICogQHJldHVybnMge09ic2VydmFibGV9IEFuIG9ic2VydmFibGUgc2VxdWVuY2UgY29udGFpbmluZyB0aGUgbWF0ZXJpYWxpemVkIG5vdGlmaWNhdGlvbiB2YWx1ZXMgZnJvbSB0aGUgc291cmNlIHNlcXVlbmNlLlxuICAgKi9cbiAgb2JzZXJ2YWJsZVByb3RvLm1hdGVyaWFsaXplID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBuZXcgTWF0ZXJpYWxpemVPYnNlcnZhYmxlKHRoaXMpO1xuICB9O1xuXG4gIC8qKlxuICAgKiAgUmVwZWF0cyB0aGUgb2JzZXJ2YWJsZSBzZXF1ZW5jZSBhIHNwZWNpZmllZCBudW1iZXIgb2YgdGltZXMuIElmIHRoZSByZXBlYXQgY291bnQgaXMgbm90IHNwZWNpZmllZCwgdGhlIHNlcXVlbmNlIHJlcGVhdHMgaW5kZWZpbml0ZWx5LlxuICAgKiBAcGFyYW0ge051bWJlcn0gW3JlcGVhdENvdW50XSAgTnVtYmVyIG9mIHRpbWVzIHRvIHJlcGVhdCB0aGUgc2VxdWVuY2UuIElmIG5vdCBwcm92aWRlZCwgcmVwZWF0cyB0aGUgc2VxdWVuY2UgaW5kZWZpbml0ZWx5LlxuICAgKiBAcmV0dXJucyB7T2JzZXJ2YWJsZX0gVGhlIG9ic2VydmFibGUgc2VxdWVuY2UgcHJvZHVjaW5nIHRoZSBlbGVtZW50cyBvZiB0aGUgZ2l2ZW4gc2VxdWVuY2UgcmVwZWF0ZWRseS5cbiAgICovXG4gIG9ic2VydmFibGVQcm90by5yZXBlYXQgPSBmdW5jdGlvbiAocmVwZWF0Q291bnQpIHtcbiAgICByZXR1cm4gZW51bWVyYWJsZVJlcGVhdCh0aGlzLCByZXBlYXRDb3VudCkuY29uY2F0KCk7XG4gIH07XG5cbiAgLyoqXG4gICAqICBSZXBlYXRzIHRoZSBzb3VyY2Ugb2JzZXJ2YWJsZSBzZXF1ZW5jZSB0aGUgc3BlY2lmaWVkIG51bWJlciBvZiB0aW1lcyBvciB1bnRpbCBpdCBzdWNjZXNzZnVsbHkgdGVybWluYXRlcy4gSWYgdGhlIHJldHJ5IGNvdW50IGlzIG5vdCBzcGVjaWZpZWQsIGl0IHJldHJpZXMgaW5kZWZpbml0ZWx5LlxuICAgKiAgTm90ZSBpZiB5b3UgZW5jb3VudGVyIGFuIGVycm9yIGFuZCB3YW50IGl0IHRvIHJldHJ5IG9uY2UsIHRoZW4geW91IG11c3QgdXNlIC5yZXRyeSgyKTtcbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogIHZhciByZXMgPSByZXRyaWVkID0gcmV0cnkucmVwZWF0KCk7XG4gICAqICB2YXIgcmVzID0gcmV0cmllZCA9IHJldHJ5LnJlcGVhdCgyKTtcbiAgICogQHBhcmFtIHtOdW1iZXJ9IFtyZXRyeUNvdW50XSAgTnVtYmVyIG9mIHRpbWVzIHRvIHJldHJ5IHRoZSBzZXF1ZW5jZS4gSWYgbm90IHByb3ZpZGVkLCByZXRyeSB0aGUgc2VxdWVuY2UgaW5kZWZpbml0ZWx5LlxuICAgKiBAcmV0dXJucyB7T2JzZXJ2YWJsZX0gQW4gb2JzZXJ2YWJsZSBzZXF1ZW5jZSBwcm9kdWNpbmcgdGhlIGVsZW1lbnRzIG9mIHRoZSBnaXZlbiBzZXF1ZW5jZSByZXBlYXRlZGx5IHVudGlsIGl0IHRlcm1pbmF0ZXMgc3VjY2Vzc2Z1bGx5LlxuICAgKi9cbiAgb2JzZXJ2YWJsZVByb3RvLnJldHJ5ID0gZnVuY3Rpb24gKHJldHJ5Q291bnQpIHtcbiAgICByZXR1cm4gZW51bWVyYWJsZVJlcGVhdCh0aGlzLCByZXRyeUNvdW50KS5jYXRjaEVycm9yKCk7XG4gIH07XG5cbiAgZnVuY3Rpb24gcmVwZWF0KHZhbHVlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICdAQGl0ZXJhdG9yJzogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIG5leHQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB7IGRvbmU6IGZhbHNlLCB2YWx1ZTogdmFsdWUgfTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIHZhciBSZXRyeVdoZW5PYnNlcnZhYmxlID0gKGZ1bmN0aW9uKF9fc3VwZXJfXykge1xuICAgIGZ1bmN0aW9uIGNyZWF0ZURpc3Bvc2FibGUoc3RhdGUpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGlzRGlzcG9zZWQ6IGZhbHNlLFxuICAgICAgICBkaXNwb3NlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgaWYgKCF0aGlzLmlzRGlzcG9zZWQpIHtcbiAgICAgICAgICAgIHRoaXMuaXNEaXNwb3NlZCA9IHRydWU7XG4gICAgICAgICAgICBzdGF0ZS5pc0Rpc3Bvc2VkID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gUmV0cnlXaGVuT2JzZXJ2YWJsZShzb3VyY2UsIG5vdGlmaWVyKSB7XG4gICAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcbiAgICAgIHRoaXMuX25vdGlmaWVyID0gbm90aWZpZXI7XG4gICAgICBfX3N1cGVyX18uY2FsbCh0aGlzKTtcbiAgICB9XG5cbiAgICBpbmhlcml0cyhSZXRyeVdoZW5PYnNlcnZhYmxlLCBfX3N1cGVyX18pO1xuXG4gICAgUmV0cnlXaGVuT2JzZXJ2YWJsZS5wcm90b3R5cGUuc3Vic2NyaWJlQ29yZSA9IGZ1bmN0aW9uIChvKSB7XG4gICAgICB2YXIgZXhjZXB0aW9ucyA9IG5ldyBTdWJqZWN0KCksXG4gICAgICAgIG5vdGlmaWVyID0gbmV3IFN1YmplY3QoKSxcbiAgICAgICAgaGFuZGxlZCA9IHRoaXMuX25vdGlmaWVyKGV4Y2VwdGlvbnMpLFxuICAgICAgICBub3RpZmljYXRpb25EaXNwb3NhYmxlID0gaGFuZGxlZC5zdWJzY3JpYmUobm90aWZpZXIpO1xuXG4gICAgICB2YXIgZSA9IHRoaXMuc291cmNlWydAQGl0ZXJhdG9yJ10oKTtcblxuICAgICAgdmFyIHN0YXRlID0geyBpc0Rpc3Bvc2VkOiBmYWxzZSB9LFxuICAgICAgICBsYXN0RXJyb3IsXG4gICAgICAgIHN1YnNjcmlwdGlvbiA9IG5ldyBTZXJpYWxEaXNwb3NhYmxlKCk7XG4gICAgICB2YXIgY2FuY2VsYWJsZSA9IGN1cnJlbnRUaHJlYWRTY2hlZHVsZXIuc2NoZWR1bGVSZWN1cnNpdmUobnVsbCwgZnVuY3Rpb24gKF8sIHJlY3Vyc2UpIHtcbiAgICAgICAgaWYgKHN0YXRlLmlzRGlzcG9zZWQpIHsgcmV0dXJuOyB9XG4gICAgICAgIHZhciBjdXJyZW50SXRlbSA9IGUubmV4dCgpO1xuXG4gICAgICAgIGlmIChjdXJyZW50SXRlbS5kb25lKSB7XG4gICAgICAgICAgaWYgKGxhc3RFcnJvcikge1xuICAgICAgICAgICAgby5vbkVycm9yKGxhc3RFcnJvcik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG8ub25Db21wbGV0ZWQoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ2hlY2sgaWYgcHJvbWlzZVxuICAgICAgICB2YXIgY3VycmVudFZhbHVlID0gY3VycmVudEl0ZW0udmFsdWU7XG4gICAgICAgIGlzUHJvbWlzZShjdXJyZW50VmFsdWUpICYmIChjdXJyZW50VmFsdWUgPSBvYnNlcnZhYmxlRnJvbVByb21pc2UoY3VycmVudFZhbHVlKSk7XG5cbiAgICAgICAgdmFyIG91dGVyID0gbmV3IFNpbmdsZUFzc2lnbm1lbnREaXNwb3NhYmxlKCk7XG4gICAgICAgIHZhciBpbm5lciA9IG5ldyBTaW5nbGVBc3NpZ25tZW50RGlzcG9zYWJsZSgpO1xuICAgICAgICBzdWJzY3JpcHRpb24uc2V0RGlzcG9zYWJsZShuZXcgQmluYXJ5RGlzcG9zYWJsZShpbm5lciwgb3V0ZXIpKTtcbiAgICAgICAgb3V0ZXIuc2V0RGlzcG9zYWJsZShjdXJyZW50VmFsdWUuc3Vic2NyaWJlKFxuICAgICAgICAgIGZ1bmN0aW9uKHgpIHsgby5vbk5leHQoeCk7IH0sXG4gICAgICAgICAgZnVuY3Rpb24gKGV4bikge1xuICAgICAgICAgICAgaW5uZXIuc2V0RGlzcG9zYWJsZShub3RpZmllci5zdWJzY3JpYmUocmVjdXJzZSwgZnVuY3Rpb24oZXgpIHtcbiAgICAgICAgICAgICAgby5vbkVycm9yKGV4KTtcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICBvLm9uQ29tcGxldGVkKCk7XG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIGV4Y2VwdGlvbnMub25OZXh0KGV4bik7XG4gICAgICAgICAgICBvdXRlci5kaXNwb3NlKCk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBmdW5jdGlvbigpIHsgby5vbkNvbXBsZXRlZCgpOyB9KSk7XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIG5ldyBOQXJ5RGlzcG9zYWJsZShbbm90aWZpY2F0aW9uRGlzcG9zYWJsZSwgc3Vic2NyaXB0aW9uLCBjYW5jZWxhYmxlLCBjcmVhdGVEaXNwb3NhYmxlKHN0YXRlKV0pO1xuICAgIH07XG5cbiAgICByZXR1cm4gUmV0cnlXaGVuT2JzZXJ2YWJsZTtcbiAgfShPYnNlcnZhYmxlQmFzZSkpO1xuXG4gIG9ic2VydmFibGVQcm90by5yZXRyeVdoZW4gPSBmdW5jdGlvbiAobm90aWZpZXIpIHtcbiAgICByZXR1cm4gbmV3IFJldHJ5V2hlbk9ic2VydmFibGUocmVwZWF0KHRoaXMpLCBub3RpZmllcik7XG4gIH07XG5cbiAgZnVuY3Rpb24gcmVwZWF0KHZhbHVlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICdAQGl0ZXJhdG9yJzogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIG5leHQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB7IGRvbmU6IGZhbHNlLCB2YWx1ZTogdmFsdWUgfTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIHZhciBSZXBlYXRXaGVuT2JzZXJ2YWJsZSA9IChmdW5jdGlvbihfX3N1cGVyX18pIHtcbiAgICBmdW5jdGlvbiBjcmVhdGVEaXNwb3NhYmxlKHN0YXRlKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBpc0Rpc3Bvc2VkOiBmYWxzZSxcbiAgICAgICAgZGlzcG9zZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGlmICghdGhpcy5pc0Rpc3Bvc2VkKSB7XG4gICAgICAgICAgICB0aGlzLmlzRGlzcG9zZWQgPSB0cnVlO1xuICAgICAgICAgICAgc3RhdGUuaXNEaXNwb3NlZCA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIFJlcGVhdFdoZW5PYnNlcnZhYmxlKHNvdXJjZSwgbm90aWZpZXIpIHtcbiAgICAgIHRoaXMuc291cmNlID0gc291cmNlO1xuICAgICAgdGhpcy5fbm90aWZpZXIgPSBub3RpZmllcjtcbiAgICAgIF9fc3VwZXJfXy5jYWxsKHRoaXMpO1xuICAgIH1cblxuICAgIGluaGVyaXRzKFJlcGVhdFdoZW5PYnNlcnZhYmxlLCBfX3N1cGVyX18pO1xuXG4gICAgUmVwZWF0V2hlbk9ic2VydmFibGUucHJvdG90eXBlLnN1YnNjcmliZUNvcmUgPSBmdW5jdGlvbiAobykge1xuICAgICAgdmFyIGNvbXBsZXRpb25zID0gbmV3IFN1YmplY3QoKSxcbiAgICAgICAgbm90aWZpZXIgPSBuZXcgU3ViamVjdCgpLFxuICAgICAgICBoYW5kbGVkID0gdGhpcy5fbm90aWZpZXIoY29tcGxldGlvbnMpLFxuICAgICAgICBub3RpZmljYXRpb25EaXNwb3NhYmxlID0gaGFuZGxlZC5zdWJzY3JpYmUobm90aWZpZXIpO1xuXG4gICAgICB2YXIgZSA9IHRoaXMuc291cmNlWydAQGl0ZXJhdG9yJ10oKTtcblxuICAgICAgdmFyIHN0YXRlID0geyBpc0Rpc3Bvc2VkOiBmYWxzZSB9LFxuICAgICAgICBsYXN0RXJyb3IsXG4gICAgICAgIHN1YnNjcmlwdGlvbiA9IG5ldyBTZXJpYWxEaXNwb3NhYmxlKCk7XG4gICAgICB2YXIgY2FuY2VsYWJsZSA9IGN1cnJlbnRUaHJlYWRTY2hlZHVsZXIuc2NoZWR1bGVSZWN1cnNpdmUobnVsbCwgZnVuY3Rpb24gKF8sIHJlY3Vyc2UpIHtcbiAgICAgICAgaWYgKHN0YXRlLmlzRGlzcG9zZWQpIHsgcmV0dXJuOyB9XG4gICAgICAgIHZhciBjdXJyZW50SXRlbSA9IGUubmV4dCgpO1xuXG4gICAgICAgIGlmIChjdXJyZW50SXRlbS5kb25lKSB7XG4gICAgICAgICAgaWYgKGxhc3RFcnJvcikge1xuICAgICAgICAgICAgby5vbkVycm9yKGxhc3RFcnJvcik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG8ub25Db21wbGV0ZWQoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ2hlY2sgaWYgcHJvbWlzZVxuICAgICAgICB2YXIgY3VycmVudFZhbHVlID0gY3VycmVudEl0ZW0udmFsdWU7XG4gICAgICAgIGlzUHJvbWlzZShjdXJyZW50VmFsdWUpICYmIChjdXJyZW50VmFsdWUgPSBvYnNlcnZhYmxlRnJvbVByb21pc2UoY3VycmVudFZhbHVlKSk7XG5cbiAgICAgICAgdmFyIG91dGVyID0gbmV3IFNpbmdsZUFzc2lnbm1lbnREaXNwb3NhYmxlKCk7XG4gICAgICAgIHZhciBpbm5lciA9IG5ldyBTaW5nbGVBc3NpZ25tZW50RGlzcG9zYWJsZSgpO1xuICAgICAgICBzdWJzY3JpcHRpb24uc2V0RGlzcG9zYWJsZShuZXcgQmluYXJ5RGlzcG9zYWJsZShpbm5lciwgb3V0ZXIpKTtcbiAgICAgICAgb3V0ZXIuc2V0RGlzcG9zYWJsZShjdXJyZW50VmFsdWUuc3Vic2NyaWJlKFxuICAgICAgICAgIGZ1bmN0aW9uKHgpIHsgby5vbk5leHQoeCk7IH0sXG4gICAgICAgICAgZnVuY3Rpb24gKGV4bikgeyBvLm9uRXJyb3IoZXhuKTsgfSxcbiAgICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlubmVyLnNldERpc3Bvc2FibGUobm90aWZpZXIuc3Vic2NyaWJlKHJlY3Vyc2UsIGZ1bmN0aW9uKGV4KSB7XG4gICAgICAgICAgICAgIG8ub25FcnJvcihleCk7XG4gICAgICAgICAgICB9LCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgby5vbkNvbXBsZXRlZCgpO1xuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICBjb21wbGV0aW9ucy5vbk5leHQobnVsbCk7XG4gICAgICAgICAgICBvdXRlci5kaXNwb3NlKCk7XG4gICAgICAgICAgfSkpO1xuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiBuZXcgTkFyeURpc3Bvc2FibGUoW25vdGlmaWNhdGlvbkRpc3Bvc2FibGUsIHN1YnNjcmlwdGlvbiwgY2FuY2VsYWJsZSwgY3JlYXRlRGlzcG9zYWJsZShzdGF0ZSldKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIFJlcGVhdFdoZW5PYnNlcnZhYmxlO1xuICB9KE9ic2VydmFibGVCYXNlKSk7XG5cbiAgb2JzZXJ2YWJsZVByb3RvLnJlcGVhdFdoZW4gPSBmdW5jdGlvbiAobm90aWZpZXIpIHtcbiAgICByZXR1cm4gbmV3IFJlcGVhdFdoZW5PYnNlcnZhYmxlKHJlcGVhdCh0aGlzKSwgbm90aWZpZXIpO1xuICB9O1xuXG4gIHZhciBTY2FuT2JzZXJ2YWJsZSA9IChmdW5jdGlvbihfX3N1cGVyX18pIHtcbiAgICBpbmhlcml0cyhTY2FuT2JzZXJ2YWJsZSwgX19zdXBlcl9fKTtcbiAgICBmdW5jdGlvbiBTY2FuT2JzZXJ2YWJsZShzb3VyY2UsIGFjY3VtdWxhdG9yLCBoYXNTZWVkLCBzZWVkKSB7XG4gICAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcbiAgICAgIHRoaXMuYWNjdW11bGF0b3IgPSBhY2N1bXVsYXRvcjtcbiAgICAgIHRoaXMuaGFzU2VlZCA9IGhhc1NlZWQ7XG4gICAgICB0aGlzLnNlZWQgPSBzZWVkO1xuICAgICAgX19zdXBlcl9fLmNhbGwodGhpcyk7XG4gICAgfVxuXG4gICAgU2Nhbk9ic2VydmFibGUucHJvdG90eXBlLnN1YnNjcmliZUNvcmUgPSBmdW5jdGlvbihvKSB7XG4gICAgICByZXR1cm4gdGhpcy5zb3VyY2Uuc3Vic2NyaWJlKG5ldyBTY2FuT2JzZXJ2ZXIobyx0aGlzKSk7XG4gICAgfTtcblxuICAgIHJldHVybiBTY2FuT2JzZXJ2YWJsZTtcbiAgfShPYnNlcnZhYmxlQmFzZSkpO1xuXG4gIHZhciBTY2FuT2JzZXJ2ZXIgPSAoZnVuY3Rpb24gKF9fc3VwZXJfXykge1xuICAgIGluaGVyaXRzKFNjYW5PYnNlcnZlciwgX19zdXBlcl9fKTtcbiAgICBmdW5jdGlvbiBTY2FuT2JzZXJ2ZXIobywgcGFyZW50KSB7XG4gICAgICB0aGlzLl9vID0gbztcbiAgICAgIHRoaXMuX3AgPSBwYXJlbnQ7XG4gICAgICB0aGlzLl9mbiA9IHBhcmVudC5hY2N1bXVsYXRvcjtcbiAgICAgIHRoaXMuX2hzID0gcGFyZW50Lmhhc1NlZWQ7XG4gICAgICB0aGlzLl9zID0gcGFyZW50LnNlZWQ7XG4gICAgICB0aGlzLl9oYSA9IGZhbHNlO1xuICAgICAgdGhpcy5fYSA9IG51bGw7XG4gICAgICB0aGlzLl9odiA9IGZhbHNlO1xuICAgICAgdGhpcy5faSA9IDA7XG4gICAgICBfX3N1cGVyX18uY2FsbCh0aGlzKTtcbiAgICB9XG5cbiAgICBTY2FuT2JzZXJ2ZXIucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbiAoeCkge1xuICAgICAgIXRoaXMuX2h2ICYmICh0aGlzLl9odiA9IHRydWUpO1xuICAgICAgaWYgKHRoaXMuX2hhKSB7XG4gICAgICAgIHRoaXMuX2EgPSB0cnlDYXRjaCh0aGlzLl9mbikodGhpcy5fYSwgeCwgdGhpcy5faSwgdGhpcy5fcCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9hID0gdGhpcy5faHMgPyB0cnlDYXRjaCh0aGlzLl9mbikodGhpcy5fcywgeCwgdGhpcy5faSwgdGhpcy5fcCkgOiB4O1xuICAgICAgICB0aGlzLl9oYSA9IHRydWU7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5fYSA9PT0gZXJyb3JPYmopIHsgcmV0dXJuIHRoaXMuX28ub25FcnJvcih0aGlzLl9hLmUpOyB9XG4gICAgICB0aGlzLl9vLm9uTmV4dCh0aGlzLl9hKTtcbiAgICAgIHRoaXMuX2krKztcbiAgICB9O1xuXG4gICAgU2Nhbk9ic2VydmVyLnByb3RvdHlwZS5lcnJvciA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICB0aGlzLl9vLm9uRXJyb3IoZSk7XG4gICAgfTtcblxuICAgIFNjYW5PYnNlcnZlci5wcm90b3R5cGUuY29tcGxldGVkID0gZnVuY3Rpb24gKCkge1xuICAgICAgIXRoaXMuX2h2ICYmIHRoaXMuX2hzICYmIHRoaXMuX28ub25OZXh0KHRoaXMuX3MpO1xuICAgICAgdGhpcy5fby5vbkNvbXBsZXRlZCgpO1xuICAgIH07XG5cbiAgICByZXR1cm4gU2Nhbk9ic2VydmVyO1xuICB9KEFic3RyYWN0T2JzZXJ2ZXIpKTtcblxuICAvKipcbiAgKiAgQXBwbGllcyBhbiBhY2N1bXVsYXRvciBmdW5jdGlvbiBvdmVyIGFuIG9ic2VydmFibGUgc2VxdWVuY2UgYW5kIHJldHVybnMgZWFjaCBpbnRlcm1lZGlhdGUgcmVzdWx0LiBUaGUgb3B0aW9uYWwgc2VlZCB2YWx1ZSBpcyB1c2VkIGFzIHRoZSBpbml0aWFsIGFjY3VtdWxhdG9yIHZhbHVlLlxuICAqICBGb3IgYWdncmVnYXRpb24gYmVoYXZpb3Igd2l0aCBubyBpbnRlcm1lZGlhdGUgcmVzdWx0cywgc2VlIE9ic2VydmFibGUuYWdncmVnYXRlLlxuICAqIEBwYXJhbSB7TWl4ZWR9IFtzZWVkXSBUaGUgaW5pdGlhbCBhY2N1bXVsYXRvciB2YWx1ZS5cbiAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBhY2N1bXVsYXRvciBBbiBhY2N1bXVsYXRvciBmdW5jdGlvbiB0byBiZSBpbnZva2VkIG9uIGVhY2ggZWxlbWVudC5cbiAgKiBAcmV0dXJucyB7T2JzZXJ2YWJsZX0gQW4gb2JzZXJ2YWJsZSBzZXF1ZW5jZSBjb250YWluaW5nIHRoZSBhY2N1bXVsYXRlZCB2YWx1ZXMuXG4gICovXG4gIG9ic2VydmFibGVQcm90by5zY2FuID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBoYXNTZWVkID0gZmFsc2UsIHNlZWQsIGFjY3VtdWxhdG9yID0gYXJndW1lbnRzWzBdO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAyKSB7XG4gICAgICBoYXNTZWVkID0gdHJ1ZTtcbiAgICAgIHNlZWQgPSBhcmd1bWVudHNbMV07XG4gICAgfVxuICAgIHJldHVybiBuZXcgU2Nhbk9ic2VydmFibGUodGhpcywgYWNjdW11bGF0b3IsIGhhc1NlZWQsIHNlZWQpO1xuICB9O1xuXG4gIHZhciBTa2lwTGFzdE9ic2VydmFibGUgPSAoZnVuY3Rpb24gKF9fc3VwZXJfXykge1xuICAgIGluaGVyaXRzKFNraXBMYXN0T2JzZXJ2YWJsZSwgX19zdXBlcl9fKTtcbiAgICBmdW5jdGlvbiBTa2lwTGFzdE9ic2VydmFibGUoc291cmNlLCBjKSB7XG4gICAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcbiAgICAgIHRoaXMuX2MgPSBjO1xuICAgICAgX19zdXBlcl9fLmNhbGwodGhpcyk7XG4gICAgfVxuXG4gICAgU2tpcExhc3RPYnNlcnZhYmxlLnByb3RvdHlwZS5zdWJzY3JpYmVDb3JlID0gZnVuY3Rpb24gKG8pIHtcbiAgICAgIHJldHVybiB0aGlzLnNvdXJjZS5zdWJzY3JpYmUobmV3IFNraXBMYXN0T2JzZXJ2ZXIobywgdGhpcy5fYykpO1xuICAgIH07XG5cbiAgICByZXR1cm4gU2tpcExhc3RPYnNlcnZhYmxlO1xuICB9KE9ic2VydmFibGVCYXNlKSk7XG5cbiAgdmFyIFNraXBMYXN0T2JzZXJ2ZXIgPSAoZnVuY3Rpb24gKF9fc3VwZXJfXykge1xuICAgIGluaGVyaXRzKFNraXBMYXN0T2JzZXJ2ZXIsIF9fc3VwZXJfXyk7XG4gICAgZnVuY3Rpb24gU2tpcExhc3RPYnNlcnZlcihvLCBjKSB7XG4gICAgICB0aGlzLl9vID0gbztcbiAgICAgIHRoaXMuX2MgPSBjO1xuICAgICAgdGhpcy5fcSA9IFtdO1xuICAgICAgX19zdXBlcl9fLmNhbGwodGhpcyk7XG4gICAgfVxuXG4gICAgU2tpcExhc3RPYnNlcnZlci5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uICh4KSB7XG4gICAgICB0aGlzLl9xLnB1c2goeCk7XG4gICAgICB0aGlzLl9xLmxlbmd0aCA+IHRoaXMuX2MgJiYgdGhpcy5fby5vbk5leHQodGhpcy5fcS5zaGlmdCgpKTtcbiAgICB9O1xuXG4gICAgU2tpcExhc3RPYnNlcnZlci5wcm90b3R5cGUuZXJyb3IgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgdGhpcy5fby5vbkVycm9yKGUpO1xuICAgIH07XG5cbiAgICBTa2lwTGFzdE9ic2VydmVyLnByb3RvdHlwZS5jb21wbGV0ZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLl9vLm9uQ29tcGxldGVkKCk7XG4gICAgfTtcblxuICAgIHJldHVybiBTa2lwTGFzdE9ic2VydmVyO1xuICB9KEFic3RyYWN0T2JzZXJ2ZXIpKTtcblxuICAvKipcbiAgICogIEJ5cGFzc2VzIGEgc3BlY2lmaWVkIG51bWJlciBvZiBlbGVtZW50cyBhdCB0aGUgZW5kIG9mIGFuIG9ic2VydmFibGUgc2VxdWVuY2UuXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiAgVGhpcyBvcGVyYXRvciBhY2N1bXVsYXRlcyBhIHF1ZXVlIHdpdGggYSBsZW5ndGggZW5vdWdoIHRvIHN0b3JlIHRoZSBmaXJzdCBgY291bnRgIGVsZW1lbnRzLiBBcyBtb3JlIGVsZW1lbnRzIGFyZVxuICAgKiAgcmVjZWl2ZWQsIGVsZW1lbnRzIGFyZSB0YWtlbiBmcm9tIHRoZSBmcm9udCBvZiB0aGUgcXVldWUgYW5kIHByb2R1Y2VkIG9uIHRoZSByZXN1bHQgc2VxdWVuY2UuIFRoaXMgY2F1c2VzIGVsZW1lbnRzIHRvIGJlIGRlbGF5ZWQuXG4gICAqIEBwYXJhbSBjb3VudCBOdW1iZXIgb2YgZWxlbWVudHMgdG8gYnlwYXNzIGF0IHRoZSBlbmQgb2YgdGhlIHNvdXJjZSBzZXF1ZW5jZS5cbiAgICogQHJldHVybnMge09ic2VydmFibGV9IEFuIG9ic2VydmFibGUgc2VxdWVuY2UgY29udGFpbmluZyB0aGUgc291cmNlIHNlcXVlbmNlIGVsZW1lbnRzIGV4Y2VwdCBmb3IgdGhlIGJ5cGFzc2VkIG9uZXMgYXQgdGhlIGVuZC5cbiAgICovXG4gIG9ic2VydmFibGVQcm90by5za2lwTGFzdCA9IGZ1bmN0aW9uIChjb3VudCkge1xuICAgIGlmIChjb3VudCA8IDApIHsgdGhyb3cgbmV3IEFyZ3VtZW50T3V0T2ZSYW5nZUVycm9yKCk7IH1cbiAgICByZXR1cm4gbmV3IFNraXBMYXN0T2JzZXJ2YWJsZSh0aGlzLCBjb3VudCk7XG4gIH07XG5cbiAgLyoqXG4gICAqICBQcmVwZW5kcyBhIHNlcXVlbmNlIG9mIHZhbHVlcyB0byBhbiBvYnNlcnZhYmxlIHNlcXVlbmNlIHdpdGggYW4gb3B0aW9uYWwgc2NoZWR1bGVyIGFuZCBhbiBhcmd1bWVudCBsaXN0IG9mIHZhbHVlcyB0byBwcmVwZW5kLlxuICAgKiAgQGV4YW1wbGVcbiAgICogIHZhciByZXMgPSBzb3VyY2Uuc3RhcnRXaXRoKDEsIDIsIDMpO1xuICAgKiAgdmFyIHJlcyA9IHNvdXJjZS5zdGFydFdpdGgoUnguU2NoZWR1bGVyLnRpbWVvdXQsIDEsIDIsIDMpO1xuICAgKiBAcGFyYW0ge0FyZ3VtZW50c30gYXJncyBUaGUgc3BlY2lmaWVkIHZhbHVlcyB0byBwcmVwZW5kIHRvIHRoZSBvYnNlcnZhYmxlIHNlcXVlbmNlXG4gICAqIEByZXR1cm5zIHtPYnNlcnZhYmxlfSBUaGUgc291cmNlIHNlcXVlbmNlIHByZXBlbmRlZCB3aXRoIHRoZSBzcGVjaWZpZWQgdmFsdWVzLlxuICAgKi9cbiAgb2JzZXJ2YWJsZVByb3RvLnN0YXJ0V2l0aCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdmFsdWVzLCBzY2hlZHVsZXIsIHN0YXJ0ID0gMDtcbiAgICBpZiAoISFhcmd1bWVudHMubGVuZ3RoICYmIGlzU2NoZWR1bGVyKGFyZ3VtZW50c1swXSkpIHtcbiAgICAgIHNjaGVkdWxlciA9IGFyZ3VtZW50c1swXTtcbiAgICAgIHN0YXJ0ID0gMTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2NoZWR1bGVyID0gaW1tZWRpYXRlU2NoZWR1bGVyO1xuICAgIH1cbiAgICBmb3IodmFyIGFyZ3MgPSBbXSwgaSA9IHN0YXJ0LCBsZW4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHsgYXJncy5wdXNoKGFyZ3VtZW50c1tpXSk7IH1cbiAgICByZXR1cm4gZW51bWVyYWJsZU9mKFtvYnNlcnZhYmxlRnJvbUFycmF5KGFyZ3MsIHNjaGVkdWxlciksIHRoaXNdKS5jb25jYXQoKTtcbiAgfTtcblxuICB2YXIgVGFrZUxhc3RPYnNlcnZlciA9IChmdW5jdGlvbiAoX19zdXBlcl9fKSB7XG4gICAgaW5oZXJpdHMoVGFrZUxhc3RPYnNlcnZlciwgX19zdXBlcl9fKTtcbiAgICBmdW5jdGlvbiBUYWtlTGFzdE9ic2VydmVyKG8sIGMpIHtcbiAgICAgIHRoaXMuX28gPSBvO1xuICAgICAgdGhpcy5fYyA9IGM7XG4gICAgICB0aGlzLl9xID0gW107XG4gICAgICBfX3N1cGVyX18uY2FsbCh0aGlzKTtcbiAgICB9XG5cbiAgICBUYWtlTGFzdE9ic2VydmVyLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24gKHgpIHtcbiAgICAgIHRoaXMuX3EucHVzaCh4KTtcbiAgICAgIHRoaXMuX3EubGVuZ3RoID4gdGhpcy5fYyAmJiB0aGlzLl9xLnNoaWZ0KCk7XG4gICAgfTtcblxuICAgIFRha2VMYXN0T2JzZXJ2ZXIucHJvdG90eXBlLmVycm9yID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgIHRoaXMuX28ub25FcnJvcihlKTtcbiAgICB9O1xuXG4gICAgVGFrZUxhc3RPYnNlcnZlci5wcm90b3R5cGUuY29tcGxldGVkID0gZnVuY3Rpb24gKCkge1xuICAgICAgd2hpbGUgKHRoaXMuX3EubGVuZ3RoID4gMCkgeyB0aGlzLl9vLm9uTmV4dCh0aGlzLl9xLnNoaWZ0KCkpOyB9XG4gICAgICB0aGlzLl9vLm9uQ29tcGxldGVkKCk7XG4gICAgfTtcblxuICAgIHJldHVybiBUYWtlTGFzdE9ic2VydmVyO1xuICB9KEFic3RyYWN0T2JzZXJ2ZXIpKTtcblxuICAvKipcbiAgICogIFJldHVybnMgYSBzcGVjaWZpZWQgbnVtYmVyIG9mIGNvbnRpZ3VvdXMgZWxlbWVudHMgZnJvbSB0aGUgZW5kIG9mIGFuIG9ic2VydmFibGUgc2VxdWVuY2UuXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiAgVGhpcyBvcGVyYXRvciBhY2N1bXVsYXRlcyBhIGJ1ZmZlciB3aXRoIGEgbGVuZ3RoIGVub3VnaCB0byBzdG9yZSBlbGVtZW50cyBjb3VudCBlbGVtZW50cy4gVXBvbiBjb21wbGV0aW9uIG9mXG4gICAqICB0aGUgc291cmNlIHNlcXVlbmNlLCB0aGlzIGJ1ZmZlciBpcyBkcmFpbmVkIG9uIHRoZSByZXN1bHQgc2VxdWVuY2UuIFRoaXMgY2F1c2VzIHRoZSBlbGVtZW50cyB0byBiZSBkZWxheWVkLlxuICAgKiBAcGFyYW0ge051bWJlcn0gY291bnQgTnVtYmVyIG9mIGVsZW1lbnRzIHRvIHRha2UgZnJvbSB0aGUgZW5kIG9mIHRoZSBzb3VyY2Ugc2VxdWVuY2UuXG4gICAqIEByZXR1cm5zIHtPYnNlcnZhYmxlfSBBbiBvYnNlcnZhYmxlIHNlcXVlbmNlIGNvbnRhaW5pbmcgdGhlIHNwZWNpZmllZCBudW1iZXIgb2YgZWxlbWVudHMgZnJvbSB0aGUgZW5kIG9mIHRoZSBzb3VyY2Ugc2VxdWVuY2UuXG4gICAqL1xuICBvYnNlcnZhYmxlUHJvdG8udGFrZUxhc3QgPSBmdW5jdGlvbiAoY291bnQpIHtcbiAgICBpZiAoY291bnQgPCAwKSB7IHRocm93IG5ldyBBcmd1bWVudE91dE9mUmFuZ2VFcnJvcigpOyB9XG4gICAgdmFyIHNvdXJjZSA9IHRoaXM7XG4gICAgcmV0dXJuIG5ldyBBbm9ueW1vdXNPYnNlcnZhYmxlKGZ1bmN0aW9uIChvKSB7XG4gICAgICByZXR1cm4gc291cmNlLnN1YnNjcmliZShuZXcgVGFrZUxhc3RPYnNlcnZlcihvLCBjb3VudCkpO1xuICAgIH0sIHNvdXJjZSk7XG4gIH07XG5cbm9ic2VydmFibGVQcm90by5mbGF0TWFwQ29uY2F0ID0gb2JzZXJ2YWJsZVByb3RvLmNvbmNhdE1hcCA9IGZ1bmN0aW9uKHNlbGVjdG9yLCByZXN1bHRTZWxlY3RvciwgdGhpc0FyZykge1xuICAgIHJldHVybiBuZXcgRmxhdE1hcE9ic2VydmFibGUodGhpcywgc2VsZWN0b3IsIHJlc3VsdFNlbGVjdG9yLCB0aGlzQXJnKS5tZXJnZSgxKTtcbn07XG4gIHZhciBNYXBPYnNlcnZhYmxlID0gKGZ1bmN0aW9uIChfX3N1cGVyX18pIHtcbiAgICBpbmhlcml0cyhNYXBPYnNlcnZhYmxlLCBfX3N1cGVyX18pO1xuXG4gICAgZnVuY3Rpb24gTWFwT2JzZXJ2YWJsZShzb3VyY2UsIHNlbGVjdG9yLCB0aGlzQXJnKSB7XG4gICAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcbiAgICAgIHRoaXMuc2VsZWN0b3IgPSBiaW5kQ2FsbGJhY2soc2VsZWN0b3IsIHRoaXNBcmcsIDMpO1xuICAgICAgX19zdXBlcl9fLmNhbGwodGhpcyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5uZXJNYXAoc2VsZWN0b3IsIHNlbGYpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbiAoeCwgaSwgbykgeyByZXR1cm4gc2VsZWN0b3IuY2FsbCh0aGlzLCBzZWxmLnNlbGVjdG9yKHgsIGksIG8pLCBpLCBvKTsgfTtcbiAgICB9XG5cbiAgICBNYXBPYnNlcnZhYmxlLnByb3RvdHlwZS5pbnRlcm5hbE1hcCA9IGZ1bmN0aW9uIChzZWxlY3RvciwgdGhpc0FyZykge1xuICAgICAgcmV0dXJuIG5ldyBNYXBPYnNlcnZhYmxlKHRoaXMuc291cmNlLCBpbm5lck1hcChzZWxlY3RvciwgdGhpcyksIHRoaXNBcmcpO1xuICAgIH07XG5cbiAgICBNYXBPYnNlcnZhYmxlLnByb3RvdHlwZS5zdWJzY3JpYmVDb3JlID0gZnVuY3Rpb24gKG8pIHtcbiAgICAgIHJldHVybiB0aGlzLnNvdXJjZS5zdWJzY3JpYmUobmV3IElubmVyT2JzZXJ2ZXIobywgdGhpcy5zZWxlY3RvciwgdGhpcykpO1xuICAgIH07XG5cbiAgICBpbmhlcml0cyhJbm5lck9ic2VydmVyLCBBYnN0cmFjdE9ic2VydmVyKTtcbiAgICBmdW5jdGlvbiBJbm5lck9ic2VydmVyKG8sIHNlbGVjdG9yLCBzb3VyY2UpIHtcbiAgICAgIHRoaXMubyA9IG87XG4gICAgICB0aGlzLnNlbGVjdG9yID0gc2VsZWN0b3I7XG4gICAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcbiAgICAgIHRoaXMuaSA9IDA7XG4gICAgICBBYnN0cmFjdE9ic2VydmVyLmNhbGwodGhpcyk7XG4gICAgfVxuXG4gICAgSW5uZXJPYnNlcnZlci5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uKHgpIHtcbiAgICAgIHZhciByZXN1bHQgPSB0cnlDYXRjaCh0aGlzLnNlbGVjdG9yKSh4LCB0aGlzLmkrKywgdGhpcy5zb3VyY2UpO1xuICAgICAgaWYgKHJlc3VsdCA9PT0gZXJyb3JPYmopIHsgcmV0dXJuIHRoaXMuby5vbkVycm9yKHJlc3VsdC5lKTsgfVxuICAgICAgdGhpcy5vLm9uTmV4dChyZXN1bHQpO1xuICAgIH07XG5cbiAgICBJbm5lck9ic2VydmVyLnByb3RvdHlwZS5lcnJvciA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICB0aGlzLm8ub25FcnJvcihlKTtcbiAgICB9O1xuXG4gICAgSW5uZXJPYnNlcnZlci5wcm90b3R5cGUuY29tcGxldGVkID0gZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5vLm9uQ29tcGxldGVkKCk7XG4gICAgfTtcblxuICAgIHJldHVybiBNYXBPYnNlcnZhYmxlO1xuXG4gIH0oT2JzZXJ2YWJsZUJhc2UpKTtcblxuICAvKipcbiAgKiBQcm9qZWN0cyBlYWNoIGVsZW1lbnQgb2YgYW4gb2JzZXJ2YWJsZSBzZXF1ZW5jZSBpbnRvIGEgbmV3IGZvcm0gYnkgaW5jb3Jwb3JhdGluZyB0aGUgZWxlbWVudCdzIGluZGV4LlxuICAqIEBwYXJhbSB7RnVuY3Rpb259IHNlbGVjdG9yIEEgdHJhbnNmb3JtIGZ1bmN0aW9uIHRvIGFwcGx5IHRvIGVhY2ggc291cmNlIGVsZW1lbnQ7IHRoZSBzZWNvbmQgcGFyYW1ldGVyIG9mIHRoZSBmdW5jdGlvbiByZXByZXNlbnRzIHRoZSBpbmRleCBvZiB0aGUgc291cmNlIGVsZW1lbnQuXG4gICogQHBhcmFtIHtBbnl9IFt0aGlzQXJnXSBPYmplY3QgdG8gdXNlIGFzIHRoaXMgd2hlbiBleGVjdXRpbmcgY2FsbGJhY2suXG4gICogQHJldHVybnMge09ic2VydmFibGV9IEFuIG9ic2VydmFibGUgc2VxdWVuY2Ugd2hvc2UgZWxlbWVudHMgYXJlIHRoZSByZXN1bHQgb2YgaW52b2tpbmcgdGhlIHRyYW5zZm9ybSBmdW5jdGlvbiBvbiBlYWNoIGVsZW1lbnQgb2Ygc291cmNlLlxuICAqL1xuICBvYnNlcnZhYmxlUHJvdG8ubWFwID0gb2JzZXJ2YWJsZVByb3RvLnNlbGVjdCA9IGZ1bmN0aW9uIChzZWxlY3RvciwgdGhpc0FyZykge1xuICAgIHZhciBzZWxlY3RvckZuID0gdHlwZW9mIHNlbGVjdG9yID09PSAnZnVuY3Rpb24nID8gc2VsZWN0b3IgOiBmdW5jdGlvbiAoKSB7IHJldHVybiBzZWxlY3RvcjsgfTtcbiAgICByZXR1cm4gdGhpcyBpbnN0YW5jZW9mIE1hcE9ic2VydmFibGUgP1xuICAgICAgdGhpcy5pbnRlcm5hbE1hcChzZWxlY3RvckZuLCB0aGlzQXJnKSA6XG4gICAgICBuZXcgTWFwT2JzZXJ2YWJsZSh0aGlzLCBzZWxlY3RvckZuLCB0aGlzQXJnKTtcbiAgfTtcblxuICBmdW5jdGlvbiBwbHVja2VyKGFyZ3MsIGxlbikge1xuICAgIHJldHVybiBmdW5jdGlvbiBtYXBwZXIoeCkge1xuICAgICAgdmFyIGN1cnJlbnRQcm9wID0geDtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgdmFyIHAgPSBjdXJyZW50UHJvcFthcmdzW2ldXTtcbiAgICAgICAgaWYgKHR5cGVvZiBwICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIGN1cnJlbnRQcm9wID0gcDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gY3VycmVudFByb3A7XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZXMgdGhlIHZhbHVlIG9mIGEgc3BlY2lmaWVkIG5lc3RlZCBwcm9wZXJ0eSBmcm9tIGFsbCBlbGVtZW50cyBpblxuICAgKiB0aGUgT2JzZXJ2YWJsZSBzZXF1ZW5jZS5cbiAgICogQHBhcmFtIHtBcmd1bWVudHN9IGFyZ3VtZW50cyBUaGUgbmVzdGVkIHByb3BlcnRpZXMgdG8gcGx1Y2suXG4gICAqIEByZXR1cm5zIHtPYnNlcnZhYmxlfSBSZXR1cm5zIGEgbmV3IE9ic2VydmFibGUgc2VxdWVuY2Ugb2YgcHJvcGVydHkgdmFsdWVzLlxuICAgKi9cbiAgb2JzZXJ2YWJsZVByb3RvLnBsdWNrID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBsZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gbmV3IEFycmF5KGxlbik7XG4gICAgaWYgKGxlbiA9PT0gMCkgeyB0aHJvdyBuZXcgRXJyb3IoJ0xpc3Qgb2YgcHJvcGVydGllcyBjYW5ub3QgYmUgZW1wdHkuJyk7IH1cbiAgICBmb3IodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHsgYXJnc1tpXSA9IGFyZ3VtZW50c1tpXTsgfVxuICAgIHJldHVybiB0aGlzLm1hcChwbHVja2VyKGFyZ3MsIGxlbikpO1xuICB9O1xuXG5vYnNlcnZhYmxlUHJvdG8uZmxhdE1hcCA9IG9ic2VydmFibGVQcm90by5zZWxlY3RNYW55ID0gZnVuY3Rpb24oc2VsZWN0b3IsIHJlc3VsdFNlbGVjdG9yLCB0aGlzQXJnKSB7XG4gICAgcmV0dXJuIG5ldyBGbGF0TWFwT2JzZXJ2YWJsZSh0aGlzLCBzZWxlY3RvciwgcmVzdWx0U2VsZWN0b3IsIHRoaXNBcmcpLm1lcmdlQWxsKCk7XG59O1xuXG5SeC5PYnNlcnZhYmxlLnByb3RvdHlwZS5mbGF0TWFwTGF0ZXN0ID0gZnVuY3Rpb24oc2VsZWN0b3IsIHJlc3VsdFNlbGVjdG9yLCB0aGlzQXJnKSB7XG4gICAgcmV0dXJuIG5ldyBGbGF0TWFwT2JzZXJ2YWJsZSh0aGlzLCBzZWxlY3RvciwgcmVzdWx0U2VsZWN0b3IsIHRoaXNBcmcpLnN3aXRjaExhdGVzdCgpO1xufTtcbiAgdmFyIFNraXBPYnNlcnZhYmxlID0gKGZ1bmN0aW9uKF9fc3VwZXJfXykge1xuICAgIGluaGVyaXRzKFNraXBPYnNlcnZhYmxlLCBfX3N1cGVyX18pO1xuICAgIGZ1bmN0aW9uIFNraXBPYnNlcnZhYmxlKHNvdXJjZSwgY291bnQpIHtcbiAgICAgIHRoaXMuc291cmNlID0gc291cmNlO1xuICAgICAgdGhpcy5fY291bnQgPSBjb3VudDtcbiAgICAgIF9fc3VwZXJfXy5jYWxsKHRoaXMpO1xuICAgIH1cblxuICAgIFNraXBPYnNlcnZhYmxlLnByb3RvdHlwZS5zdWJzY3JpYmVDb3JlID0gZnVuY3Rpb24gKG8pIHtcbiAgICAgIHJldHVybiB0aGlzLnNvdXJjZS5zdWJzY3JpYmUobmV3IFNraXBPYnNlcnZlcihvLCB0aGlzLl9jb3VudCkpO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBTa2lwT2JzZXJ2ZXIobywgYykge1xuICAgICAgdGhpcy5fbyA9IG87XG4gICAgICB0aGlzLl9yID0gYztcbiAgICAgIEFic3RyYWN0T2JzZXJ2ZXIuY2FsbCh0aGlzKTtcbiAgICB9XG5cbiAgICBpbmhlcml0cyhTa2lwT2JzZXJ2ZXIsIEFic3RyYWN0T2JzZXJ2ZXIpO1xuXG4gICAgU2tpcE9ic2VydmVyLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24gKHgpIHtcbiAgICAgIGlmICh0aGlzLl9yIDw9IDApIHtcbiAgICAgICAgdGhpcy5fby5vbk5leHQoeCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9yLS07XG4gICAgICB9XG4gICAgfTtcbiAgICBTa2lwT2JzZXJ2ZXIucHJvdG90eXBlLmVycm9yID0gZnVuY3Rpb24oZSkgeyB0aGlzLl9vLm9uRXJyb3IoZSk7IH07XG4gICAgU2tpcE9ic2VydmVyLnByb3RvdHlwZS5jb21wbGV0ZWQgPSBmdW5jdGlvbigpIHsgdGhpcy5fby5vbkNvbXBsZXRlZCgpOyB9O1xuXG4gICAgcmV0dXJuIFNraXBPYnNlcnZhYmxlO1xuICB9KE9ic2VydmFibGVCYXNlKSk7XG5cbiAgLyoqXG4gICAqIEJ5cGFzc2VzIGEgc3BlY2lmaWVkIG51bWJlciBvZiBlbGVtZW50cyBpbiBhbiBvYnNlcnZhYmxlIHNlcXVlbmNlIGFuZCB0aGVuIHJldHVybnMgdGhlIHJlbWFpbmluZyBlbGVtZW50cy5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGNvdW50IFRoZSBudW1iZXIgb2YgZWxlbWVudHMgdG8gc2tpcCBiZWZvcmUgcmV0dXJuaW5nIHRoZSByZW1haW5pbmcgZWxlbWVudHMuXG4gICAqIEByZXR1cm5zIHtPYnNlcnZhYmxlfSBBbiBvYnNlcnZhYmxlIHNlcXVlbmNlIHRoYXQgY29udGFpbnMgdGhlIGVsZW1lbnRzIHRoYXQgb2NjdXIgYWZ0ZXIgdGhlIHNwZWNpZmllZCBpbmRleCBpbiB0aGUgaW5wdXQgc2VxdWVuY2UuXG4gICAqL1xuICBvYnNlcnZhYmxlUHJvdG8uc2tpcCA9IGZ1bmN0aW9uIChjb3VudCkge1xuICAgIGlmIChjb3VudCA8IDApIHsgdGhyb3cgbmV3IEFyZ3VtZW50T3V0T2ZSYW5nZUVycm9yKCk7IH1cbiAgICByZXR1cm4gbmV3IFNraXBPYnNlcnZhYmxlKHRoaXMsIGNvdW50KTtcbiAgfTtcblxuICB2YXIgU2tpcFdoaWxlT2JzZXJ2YWJsZSA9IChmdW5jdGlvbiAoX19zdXBlcl9fKSB7XG4gICAgaW5oZXJpdHMoU2tpcFdoaWxlT2JzZXJ2YWJsZSwgX19zdXBlcl9fKTtcbiAgICBmdW5jdGlvbiBTa2lwV2hpbGVPYnNlcnZhYmxlKHNvdXJjZSwgZm4pIHtcbiAgICAgIHRoaXMuc291cmNlID0gc291cmNlO1xuICAgICAgdGhpcy5fZm4gPSBmbjtcbiAgICAgIF9fc3VwZXJfXy5jYWxsKHRoaXMpO1xuICAgIH1cblxuICAgIFNraXBXaGlsZU9ic2VydmFibGUucHJvdG90eXBlLnN1YnNjcmliZUNvcmUgPSBmdW5jdGlvbiAobykge1xuICAgICAgcmV0dXJuIHRoaXMuc291cmNlLnN1YnNjcmliZShuZXcgU2tpcFdoaWxlT2JzZXJ2ZXIobywgdGhpcykpO1xuICAgIH07XG5cbiAgICByZXR1cm4gU2tpcFdoaWxlT2JzZXJ2YWJsZTtcbiAgfShPYnNlcnZhYmxlQmFzZSkpO1xuXG4gIHZhciBTa2lwV2hpbGVPYnNlcnZlciA9IChmdW5jdGlvbiAoX19zdXBlcl9fKSB7XG4gICAgaW5oZXJpdHMoU2tpcFdoaWxlT2JzZXJ2ZXIsIF9fc3VwZXJfXyk7XG5cbiAgICBmdW5jdGlvbiBTa2lwV2hpbGVPYnNlcnZlcihvLCBwKSB7XG4gICAgICB0aGlzLl9vID0gbztcbiAgICAgIHRoaXMuX3AgPSBwO1xuICAgICAgdGhpcy5faSA9IDA7XG4gICAgICB0aGlzLl9yID0gZmFsc2U7XG4gICAgICBfX3N1cGVyX18uY2FsbCh0aGlzKTtcbiAgICB9XG5cbiAgICBTa2lwV2hpbGVPYnNlcnZlci5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uICh4KSB7XG4gICAgICBpZiAoIXRoaXMuX3IpIHtcbiAgICAgICAgdmFyIHJlcyA9IHRyeUNhdGNoKHRoaXMuX3AuX2ZuKSh4LCB0aGlzLl9pKyssIHRoaXMuX3ApO1xuICAgICAgICBpZiAocmVzID09PSBlcnJvck9iaikgeyByZXR1cm4gdGhpcy5fby5vbkVycm9yKHJlcy5lKTsgfVxuICAgICAgICB0aGlzLl9yID0gIXJlcztcbiAgICAgIH1cbiAgICAgIHRoaXMuX3IgJiYgdGhpcy5fby5vbk5leHQoeCk7XG4gICAgfTtcbiAgICBTa2lwV2hpbGVPYnNlcnZlci5wcm90b3R5cGUuZXJyb3IgPSBmdW5jdGlvbiAoZSkgeyB0aGlzLl9vLm9uRXJyb3IoZSk7IH07XG4gICAgU2tpcFdoaWxlT2JzZXJ2ZXIucHJvdG90eXBlLmNvbXBsZXRlZCA9IGZ1bmN0aW9uICgpIHsgdGhpcy5fby5vbkNvbXBsZXRlZCgpOyB9O1xuXG4gICAgcmV0dXJuIFNraXBXaGlsZU9ic2VydmVyO1xuICB9KEFic3RyYWN0T2JzZXJ2ZXIpKTtcblxuICAvKipcbiAgICogIEJ5cGFzc2VzIGVsZW1lbnRzIGluIGFuIG9ic2VydmFibGUgc2VxdWVuY2UgYXMgbG9uZyBhcyBhIHNwZWNpZmllZCBjb25kaXRpb24gaXMgdHJ1ZSBhbmQgdGhlbiByZXR1cm5zIHRoZSByZW1haW5pbmcgZWxlbWVudHMuXG4gICAqICBUaGUgZWxlbWVudCdzIGluZGV4IGlzIHVzZWQgaW4gdGhlIGxvZ2ljIG9mIHRoZSBwcmVkaWNhdGUgZnVuY3Rpb24uXG4gICAqXG4gICAqICB2YXIgcmVzID0gc291cmNlLnNraXBXaGlsZShmdW5jdGlvbiAodmFsdWUpIHsgcmV0dXJuIHZhbHVlIDwgMTA7IH0pO1xuICAgKiAgdmFyIHJlcyA9IHNvdXJjZS5za2lwV2hpbGUoZnVuY3Rpb24gKHZhbHVlLCBpbmRleCkgeyByZXR1cm4gdmFsdWUgPCAxMCB8fCBpbmRleCA8IDEwOyB9KTtcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gcHJlZGljYXRlIEEgZnVuY3Rpb24gdG8gdGVzdCBlYWNoIGVsZW1lbnQgZm9yIGEgY29uZGl0aW9uOyB0aGUgc2Vjb25kIHBhcmFtZXRlciBvZiB0aGUgZnVuY3Rpb24gcmVwcmVzZW50cyB0aGUgaW5kZXggb2YgdGhlIHNvdXJjZSBlbGVtZW50LlxuICAgKiBAcGFyYW0ge0FueX0gW3RoaXNBcmddIE9iamVjdCB0byB1c2UgYXMgdGhpcyB3aGVuIGV4ZWN1dGluZyBjYWxsYmFjay5cbiAgICogQHJldHVybnMge09ic2VydmFibGV9IEFuIG9ic2VydmFibGUgc2VxdWVuY2UgdGhhdCBjb250YWlucyB0aGUgZWxlbWVudHMgZnJvbSB0aGUgaW5wdXQgc2VxdWVuY2Ugc3RhcnRpbmcgYXQgdGhlIGZpcnN0IGVsZW1lbnQgaW4gdGhlIGxpbmVhciBzZXJpZXMgdGhhdCBkb2VzIG5vdCBwYXNzIHRoZSB0ZXN0IHNwZWNpZmllZCBieSBwcmVkaWNhdGUuXG4gICAqL1xuICBvYnNlcnZhYmxlUHJvdG8uc2tpcFdoaWxlID0gZnVuY3Rpb24gKHByZWRpY2F0ZSwgdGhpc0FyZykge1xuICAgIHZhciBmbiA9IGJpbmRDYWxsYmFjayhwcmVkaWNhdGUsIHRoaXNBcmcsIDMpO1xuICAgIHJldHVybiBuZXcgU2tpcFdoaWxlT2JzZXJ2YWJsZSh0aGlzLCBmbik7XG4gIH07XG5cbiAgdmFyIFRha2VPYnNlcnZhYmxlID0gKGZ1bmN0aW9uKF9fc3VwZXJfXykge1xuICAgIGluaGVyaXRzKFRha2VPYnNlcnZhYmxlLCBfX3N1cGVyX18pO1xuICAgIGZ1bmN0aW9uIFRha2VPYnNlcnZhYmxlKHNvdXJjZSwgY291bnQpIHtcbiAgICAgIHRoaXMuc291cmNlID0gc291cmNlO1xuICAgICAgdGhpcy5fY291bnQgPSBjb3VudDtcbiAgICAgIF9fc3VwZXJfXy5jYWxsKHRoaXMpO1xuICAgIH1cblxuICAgIFRha2VPYnNlcnZhYmxlLnByb3RvdHlwZS5zdWJzY3JpYmVDb3JlID0gZnVuY3Rpb24gKG8pIHtcbiAgICAgIHJldHVybiB0aGlzLnNvdXJjZS5zdWJzY3JpYmUobmV3IFRha2VPYnNlcnZlcihvLCB0aGlzLl9jb3VudCkpO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBUYWtlT2JzZXJ2ZXIobywgYykge1xuICAgICAgdGhpcy5fbyA9IG87XG4gICAgICB0aGlzLl9jID0gYztcbiAgICAgIHRoaXMuX3IgPSBjO1xuICAgICAgQWJzdHJhY3RPYnNlcnZlci5jYWxsKHRoaXMpO1xuICAgIH1cblxuICAgIGluaGVyaXRzKFRha2VPYnNlcnZlciwgQWJzdHJhY3RPYnNlcnZlcik7XG5cbiAgICBUYWtlT2JzZXJ2ZXIucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbiAoeCkge1xuICAgICAgaWYgKHRoaXMuX3ItLSA+IDApIHtcbiAgICAgICAgdGhpcy5fby5vbk5leHQoeCk7XG4gICAgICAgIHRoaXMuX3IgPD0gMCAmJiB0aGlzLl9vLm9uQ29tcGxldGVkKCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIFRha2VPYnNlcnZlci5wcm90b3R5cGUuZXJyb3IgPSBmdW5jdGlvbiAoZSkgeyB0aGlzLl9vLm9uRXJyb3IoZSk7IH07XG4gICAgVGFrZU9ic2VydmVyLnByb3RvdHlwZS5jb21wbGV0ZWQgPSBmdW5jdGlvbiAoKSB7IHRoaXMuX28ub25Db21wbGV0ZWQoKTsgfTtcblxuICAgIHJldHVybiBUYWtlT2JzZXJ2YWJsZTtcbiAgfShPYnNlcnZhYmxlQmFzZSkpO1xuXG4gIC8qKlxuICAgKiAgUmV0dXJucyBhIHNwZWNpZmllZCBudW1iZXIgb2YgY29udGlndW91cyBlbGVtZW50cyBmcm9tIHRoZSBzdGFydCBvZiBhbiBvYnNlcnZhYmxlIHNlcXVlbmNlLCB1c2luZyB0aGUgc3BlY2lmaWVkIHNjaGVkdWxlciBmb3IgdGhlIGVkZ2UgY2FzZSBvZiB0YWtlKDApLlxuICAgKiBAcGFyYW0ge051bWJlcn0gY291bnQgVGhlIG51bWJlciBvZiBlbGVtZW50cyB0byByZXR1cm4uXG4gICAqIEBwYXJhbSB7U2NoZWR1bGVyfSBbc2NoZWR1bGVyXSBTY2hlZHVsZXIgdXNlZCB0byBwcm9kdWNlIGFuIE9uQ29tcGxldGVkIG1lc3NhZ2UgaW4gY2FzZSA8cGFyYW1yZWYgbmFtZT1cImNvdW50IGNvdW50PC9wYXJhbXJlZj4gaXMgc2V0IHRvIDAuXG4gICAqIEByZXR1cm5zIHtPYnNlcnZhYmxlfSBBbiBvYnNlcnZhYmxlIHNlcXVlbmNlIHRoYXQgY29udGFpbnMgdGhlIHNwZWNpZmllZCBudW1iZXIgb2YgZWxlbWVudHMgZnJvbSB0aGUgc3RhcnQgb2YgdGhlIGlucHV0IHNlcXVlbmNlLlxuICAgKi9cbiAgb2JzZXJ2YWJsZVByb3RvLnRha2UgPSBmdW5jdGlvbiAoY291bnQsIHNjaGVkdWxlcikge1xuICAgIGlmIChjb3VudCA8IDApIHsgdGhyb3cgbmV3IEFyZ3VtZW50T3V0T2ZSYW5nZUVycm9yKCk7IH1cbiAgICBpZiAoY291bnQgPT09IDApIHsgcmV0dXJuIG9ic2VydmFibGVFbXB0eShzY2hlZHVsZXIpOyB9XG4gICAgcmV0dXJuIG5ldyBUYWtlT2JzZXJ2YWJsZSh0aGlzLCBjb3VudCk7XG4gIH07XG5cbiAgdmFyIFRha2VXaGlsZU9ic2VydmFibGUgPSAoZnVuY3Rpb24gKF9fc3VwZXJfXykge1xuICAgIGluaGVyaXRzKFRha2VXaGlsZU9ic2VydmFibGUsIF9fc3VwZXJfXyk7XG4gICAgZnVuY3Rpb24gVGFrZVdoaWxlT2JzZXJ2YWJsZShzb3VyY2UsIGZuKSB7XG4gICAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcbiAgICAgIHRoaXMuX2ZuID0gZm47XG4gICAgICBfX3N1cGVyX18uY2FsbCh0aGlzKTtcbiAgICB9XG5cbiAgICBUYWtlV2hpbGVPYnNlcnZhYmxlLnByb3RvdHlwZS5zdWJzY3JpYmVDb3JlID0gZnVuY3Rpb24gKG8pIHtcbiAgICAgIHJldHVybiB0aGlzLnNvdXJjZS5zdWJzY3JpYmUobmV3IFRha2VXaGlsZU9ic2VydmVyKG8sIHRoaXMpKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIFRha2VXaGlsZU9ic2VydmFibGU7XG4gIH0oT2JzZXJ2YWJsZUJhc2UpKTtcblxuICB2YXIgVGFrZVdoaWxlT2JzZXJ2ZXIgPSAoZnVuY3Rpb24gKF9fc3VwZXJfXykge1xuICAgIGluaGVyaXRzKFRha2VXaGlsZU9ic2VydmVyLCBfX3N1cGVyX18pO1xuXG4gICAgZnVuY3Rpb24gVGFrZVdoaWxlT2JzZXJ2ZXIobywgcCkge1xuICAgICAgdGhpcy5fbyA9IG87XG4gICAgICB0aGlzLl9wID0gcDtcbiAgICAgIHRoaXMuX2kgPSAwO1xuICAgICAgdGhpcy5fciA9IHRydWU7XG4gICAgICBfX3N1cGVyX18uY2FsbCh0aGlzKTtcbiAgICB9XG5cbiAgICBUYWtlV2hpbGVPYnNlcnZlci5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uICh4KSB7XG4gICAgICBpZiAodGhpcy5fcikge1xuICAgICAgICB0aGlzLl9yID0gdHJ5Q2F0Y2godGhpcy5fcC5fZm4pKHgsIHRoaXMuX2krKywgdGhpcy5fcCk7XG4gICAgICAgIGlmICh0aGlzLl9yID09PSBlcnJvck9iaikgeyByZXR1cm4gdGhpcy5fby5vbkVycm9yKHRoaXMuX3IuZSk7IH1cbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLl9yKSB7XG4gICAgICAgIHRoaXMuX28ub25OZXh0KHgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fby5vbkNvbXBsZXRlZCgpO1xuICAgICAgfVxuICAgIH07XG4gICAgVGFrZVdoaWxlT2JzZXJ2ZXIucHJvdG90eXBlLmVycm9yID0gZnVuY3Rpb24gKGUpIHsgdGhpcy5fby5vbkVycm9yKGUpOyB9O1xuICAgIFRha2VXaGlsZU9ic2VydmVyLnByb3RvdHlwZS5jb21wbGV0ZWQgPSBmdW5jdGlvbiAoKSB7IHRoaXMuX28ub25Db21wbGV0ZWQoKTsgfTtcblxuICAgIHJldHVybiBUYWtlV2hpbGVPYnNlcnZlcjtcbiAgfShBYnN0cmFjdE9ic2VydmVyKSk7XG5cbiAgLyoqXG4gICAqICBSZXR1cm5zIGVsZW1lbnRzIGZyb20gYW4gb2JzZXJ2YWJsZSBzZXF1ZW5jZSBhcyBsb25nIGFzIGEgc3BlY2lmaWVkIGNvbmRpdGlvbiBpcyB0cnVlLlxuICAgKiAgVGhlIGVsZW1lbnQncyBpbmRleCBpcyB1c2VkIGluIHRoZSBsb2dpYyBvZiB0aGUgcHJlZGljYXRlIGZ1bmN0aW9uLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBwcmVkaWNhdGUgQSBmdW5jdGlvbiB0byB0ZXN0IGVhY2ggZWxlbWVudCBmb3IgYSBjb25kaXRpb247IHRoZSBzZWNvbmQgcGFyYW1ldGVyIG9mIHRoZSBmdW5jdGlvbiByZXByZXNlbnRzIHRoZSBpbmRleCBvZiB0aGUgc291cmNlIGVsZW1lbnQuXG4gICAqIEBwYXJhbSB7QW55fSBbdGhpc0FyZ10gT2JqZWN0IHRvIHVzZSBhcyB0aGlzIHdoZW4gZXhlY3V0aW5nIGNhbGxiYWNrLlxuICAgKiBAcmV0dXJucyB7T2JzZXJ2YWJsZX0gQW4gb2JzZXJ2YWJsZSBzZXF1ZW5jZSB0aGF0IGNvbnRhaW5zIHRoZSBlbGVtZW50cyBmcm9tIHRoZSBpbnB1dCBzZXF1ZW5jZSB0aGF0IG9jY3VyIGJlZm9yZSB0aGUgZWxlbWVudCBhdCB3aGljaCB0aGUgdGVzdCBubyBsb25nZXIgcGFzc2VzLlxuICAgKi9cbiAgb2JzZXJ2YWJsZVByb3RvLnRha2VXaGlsZSA9IGZ1bmN0aW9uIChwcmVkaWNhdGUsIHRoaXNBcmcpIHtcbiAgICB2YXIgZm4gPSBiaW5kQ2FsbGJhY2socHJlZGljYXRlLCB0aGlzQXJnLCAzKTtcbiAgICByZXR1cm4gbmV3IFRha2VXaGlsZU9ic2VydmFibGUodGhpcywgZm4pO1xuICB9O1xuXG4gIHZhciBGaWx0ZXJPYnNlcnZhYmxlID0gKGZ1bmN0aW9uIChfX3N1cGVyX18pIHtcbiAgICBpbmhlcml0cyhGaWx0ZXJPYnNlcnZhYmxlLCBfX3N1cGVyX18pO1xuXG4gICAgZnVuY3Rpb24gRmlsdGVyT2JzZXJ2YWJsZShzb3VyY2UsIHByZWRpY2F0ZSwgdGhpc0FyZykge1xuICAgICAgdGhpcy5zb3VyY2UgPSBzb3VyY2U7XG4gICAgICB0aGlzLnByZWRpY2F0ZSA9IGJpbmRDYWxsYmFjayhwcmVkaWNhdGUsIHRoaXNBcmcsIDMpO1xuICAgICAgX19zdXBlcl9fLmNhbGwodGhpcyk7XG4gICAgfVxuXG4gICAgRmlsdGVyT2JzZXJ2YWJsZS5wcm90b3R5cGUuc3Vic2NyaWJlQ29yZSA9IGZ1bmN0aW9uIChvKSB7XG4gICAgICByZXR1cm4gdGhpcy5zb3VyY2Uuc3Vic2NyaWJlKG5ldyBJbm5lck9ic2VydmVyKG8sIHRoaXMucHJlZGljYXRlLCB0aGlzKSk7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGlubmVyUHJlZGljYXRlKHByZWRpY2F0ZSwgc2VsZikge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKHgsIGksIG8pIHsgcmV0dXJuIHNlbGYucHJlZGljYXRlKHgsIGksIG8pICYmIHByZWRpY2F0ZS5jYWxsKHRoaXMsIHgsIGksIG8pOyB9XG4gICAgfVxuXG4gICAgRmlsdGVyT2JzZXJ2YWJsZS5wcm90b3R5cGUuaW50ZXJuYWxGaWx0ZXIgPSBmdW5jdGlvbihwcmVkaWNhdGUsIHRoaXNBcmcpIHtcbiAgICAgIHJldHVybiBuZXcgRmlsdGVyT2JzZXJ2YWJsZSh0aGlzLnNvdXJjZSwgaW5uZXJQcmVkaWNhdGUocHJlZGljYXRlLCB0aGlzKSwgdGhpc0FyZyk7XG4gICAgfTtcblxuICAgIGluaGVyaXRzKElubmVyT2JzZXJ2ZXIsIEFic3RyYWN0T2JzZXJ2ZXIpO1xuICAgIGZ1bmN0aW9uIElubmVyT2JzZXJ2ZXIobywgcHJlZGljYXRlLCBzb3VyY2UpIHtcbiAgICAgIHRoaXMubyA9IG87XG4gICAgICB0aGlzLnByZWRpY2F0ZSA9IHByZWRpY2F0ZTtcbiAgICAgIHRoaXMuc291cmNlID0gc291cmNlO1xuICAgICAgdGhpcy5pID0gMDtcbiAgICAgIEFic3RyYWN0T2JzZXJ2ZXIuY2FsbCh0aGlzKTtcbiAgICB9XG5cbiAgICBJbm5lck9ic2VydmVyLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24oeCkge1xuICAgICAgdmFyIHNob3VsZFlpZWxkID0gdHJ5Q2F0Y2godGhpcy5wcmVkaWNhdGUpKHgsIHRoaXMuaSsrLCB0aGlzLnNvdXJjZSk7XG4gICAgICBpZiAoc2hvdWxkWWllbGQgPT09IGVycm9yT2JqKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm8ub25FcnJvcihzaG91bGRZaWVsZC5lKTtcbiAgICAgIH1cbiAgICAgIHNob3VsZFlpZWxkICYmIHRoaXMuby5vbk5leHQoeCk7XG4gICAgfTtcblxuICAgIElubmVyT2JzZXJ2ZXIucHJvdG90eXBlLmVycm9yID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgIHRoaXMuby5vbkVycm9yKGUpO1xuICAgIH07XG5cbiAgICBJbm5lck9ic2VydmVyLnByb3RvdHlwZS5jb21wbGV0ZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLm8ub25Db21wbGV0ZWQoKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIEZpbHRlck9ic2VydmFibGU7XG5cbiAgfShPYnNlcnZhYmxlQmFzZSkpO1xuXG4gIC8qKlxuICAqICBGaWx0ZXJzIHRoZSBlbGVtZW50cyBvZiBhbiBvYnNlcnZhYmxlIHNlcXVlbmNlIGJhc2VkIG9uIGEgcHJlZGljYXRlIGJ5IGluY29ycG9yYXRpbmcgdGhlIGVsZW1lbnQncyBpbmRleC5cbiAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBwcmVkaWNhdGUgQSBmdW5jdGlvbiB0byB0ZXN0IGVhY2ggc291cmNlIGVsZW1lbnQgZm9yIGEgY29uZGl0aW9uOyB0aGUgc2Vjb25kIHBhcmFtZXRlciBvZiB0aGUgZnVuY3Rpb24gcmVwcmVzZW50cyB0aGUgaW5kZXggb2YgdGhlIHNvdXJjZSBlbGVtZW50LlxuICAqIEBwYXJhbSB7QW55fSBbdGhpc0FyZ10gT2JqZWN0IHRvIHVzZSBhcyB0aGlzIHdoZW4gZXhlY3V0aW5nIGNhbGxiYWNrLlxuICAqIEByZXR1cm5zIHtPYnNlcnZhYmxlfSBBbiBvYnNlcnZhYmxlIHNlcXVlbmNlIHRoYXQgY29udGFpbnMgZWxlbWVudHMgZnJvbSB0aGUgaW5wdXQgc2VxdWVuY2UgdGhhdCBzYXRpc2Z5IHRoZSBjb25kaXRpb24uXG4gICovXG4gIG9ic2VydmFibGVQcm90by5maWx0ZXIgPSBvYnNlcnZhYmxlUHJvdG8ud2hlcmUgPSBmdW5jdGlvbiAocHJlZGljYXRlLCB0aGlzQXJnKSB7XG4gICAgcmV0dXJuIHRoaXMgaW5zdGFuY2VvZiBGaWx0ZXJPYnNlcnZhYmxlID8gdGhpcy5pbnRlcm5hbEZpbHRlcihwcmVkaWNhdGUsIHRoaXNBcmcpIDpcbiAgICAgIG5ldyBGaWx0ZXJPYnNlcnZhYmxlKHRoaXMsIHByZWRpY2F0ZSwgdGhpc0FyZyk7XG4gIH07XG5cbmZ1bmN0aW9uIGNyZWF0ZUNiT2JzZXJ2YWJsZShmbiwgY3R4LCBzZWxlY3RvciwgYXJncykge1xuICB2YXIgbyA9IG5ldyBBc3luY1N1YmplY3QoKTtcblxuICBhcmdzLnB1c2goY3JlYXRlQ2JIYW5kbGVyKG8sIGN0eCwgc2VsZWN0b3IpKTtcbiAgZm4uYXBwbHkoY3R4LCBhcmdzKTtcblxuICByZXR1cm4gby5hc09ic2VydmFibGUoKTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlQ2JIYW5kbGVyKG8sIGN0eCwgc2VsZWN0b3IpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGhhbmRsZXIgKCkge1xuICAgIHZhciBsZW4gPSBhcmd1bWVudHMubGVuZ3RoLCByZXN1bHRzID0gbmV3IEFycmF5KGxlbik7XG4gICAgZm9yKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7IHJlc3VsdHNbaV0gPSBhcmd1bWVudHNbaV07IH1cblxuICAgIGlmIChpc0Z1bmN0aW9uKHNlbGVjdG9yKSkge1xuICAgICAgcmVzdWx0cyA9IHRyeUNhdGNoKHNlbGVjdG9yKS5hcHBseShjdHgsIHJlc3VsdHMpO1xuICAgICAgaWYgKHJlc3VsdHMgPT09IGVycm9yT2JqKSB7IHJldHVybiBvLm9uRXJyb3IocmVzdWx0cy5lKTsgfVxuICAgICAgby5vbk5leHQocmVzdWx0cyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChyZXN1bHRzLmxlbmd0aCA8PSAxKSB7XG4gICAgICAgIG8ub25OZXh0KHJlc3VsdHNbMF0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgby5vbk5leHQocmVzdWx0cyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgby5vbkNvbXBsZXRlZCgpO1xuICB9O1xufVxuXG4vKipcbiAqIENvbnZlcnRzIGEgY2FsbGJhY2sgZnVuY3Rpb24gdG8gYW4gb2JzZXJ2YWJsZSBzZXF1ZW5jZS5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBGdW5jdGlvbiB3aXRoIGEgY2FsbGJhY2sgYXMgdGhlIGxhc3QgcGFyYW1ldGVyIHRvIGNvbnZlcnQgdG8gYW4gT2JzZXJ2YWJsZSBzZXF1ZW5jZS5cbiAqIEBwYXJhbSB7TWl4ZWR9IFtjdHhdIFRoZSBjb250ZXh0IGZvciB0aGUgZnVuYyBwYXJhbWV0ZXIgdG8gYmUgZXhlY3V0ZWQuICBJZiBub3Qgc3BlY2lmaWVkLCBkZWZhdWx0cyB0byB1bmRlZmluZWQuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbc2VsZWN0b3JdIEEgc2VsZWN0b3Igd2hpY2ggdGFrZXMgdGhlIGFyZ3VtZW50cyBmcm9tIHRoZSBjYWxsYmFjayB0byBwcm9kdWNlIGEgc2luZ2xlIGl0ZW0gdG8geWllbGQgb24gbmV4dC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gQSBmdW5jdGlvbiwgd2hlbiBleGVjdXRlZCB3aXRoIHRoZSByZXF1aXJlZCBwYXJhbWV0ZXJzIG1pbnVzIHRoZSBjYWxsYmFjaywgcHJvZHVjZXMgYW4gT2JzZXJ2YWJsZSBzZXF1ZW5jZSB3aXRoIGEgc2luZ2xlIHZhbHVlIG9mIHRoZSBhcmd1bWVudHMgdG8gdGhlIGNhbGxiYWNrIGFzIGFuIGFycmF5LlxuICovXG5PYnNlcnZhYmxlLmZyb21DYWxsYmFjayA9IGZ1bmN0aW9uIChmbiwgY3R4LCBzZWxlY3Rvcikge1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHR5cGVvZiBjdHggPT09ICd1bmRlZmluZWQnICYmIChjdHggPSB0aGlzKTsgXG5cbiAgICB2YXIgbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IG5ldyBBcnJheShsZW4pXG4gICAgZm9yKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7IGFyZ3NbaV0gPSBhcmd1bWVudHNbaV07IH1cbiAgICByZXR1cm4gY3JlYXRlQ2JPYnNlcnZhYmxlKGZuLCBjdHgsIHNlbGVjdG9yLCBhcmdzKTtcbiAgfTtcbn07XG5cbmZ1bmN0aW9uIGNyZWF0ZU5vZGVPYnNlcnZhYmxlKGZuLCBjdHgsIHNlbGVjdG9yLCBhcmdzKSB7XG4gIHZhciBvID0gbmV3IEFzeW5jU3ViamVjdCgpO1xuXG4gIGFyZ3MucHVzaChjcmVhdGVOb2RlSGFuZGxlcihvLCBjdHgsIHNlbGVjdG9yKSk7XG4gIGZuLmFwcGx5KGN0eCwgYXJncyk7XG5cbiAgcmV0dXJuIG8uYXNPYnNlcnZhYmxlKCk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZU5vZGVIYW5kbGVyKG8sIGN0eCwgc2VsZWN0b3IpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGhhbmRsZXIgKCkge1xuICAgIHZhciBlcnIgPSBhcmd1bWVudHNbMF07XG4gICAgaWYgKGVycikgeyByZXR1cm4gby5vbkVycm9yKGVycik7IH1cblxuICAgIHZhciBsZW4gPSBhcmd1bWVudHMubGVuZ3RoLCByZXN1bHRzID0gW107XG4gICAgZm9yKHZhciBpID0gMTsgaSA8IGxlbjsgaSsrKSB7IHJlc3VsdHNbaSAtIDFdID0gYXJndW1lbnRzW2ldOyB9XG5cbiAgICBpZiAoaXNGdW5jdGlvbihzZWxlY3RvcikpIHtcbiAgICAgIHZhciByZXN1bHRzID0gdHJ5Q2F0Y2goc2VsZWN0b3IpLmFwcGx5KGN0eCwgcmVzdWx0cyk7XG4gICAgICBpZiAocmVzdWx0cyA9PT0gZXJyb3JPYmopIHsgcmV0dXJuIG8ub25FcnJvcihyZXN1bHRzLmUpOyB9XG4gICAgICBvLm9uTmV4dChyZXN1bHRzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHJlc3VsdHMubGVuZ3RoIDw9IDEpIHtcbiAgICAgICAgby5vbk5leHQocmVzdWx0c1swXSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvLm9uTmV4dChyZXN1bHRzKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBvLm9uQ29tcGxldGVkKCk7XG4gIH07XG59XG5cbi8qKlxuICogQ29udmVydHMgYSBOb2RlLmpzIGNhbGxiYWNrIHN0eWxlIGZ1bmN0aW9uIHRvIGFuIG9ic2VydmFibGUgc2VxdWVuY2UuICBUaGlzIG11c3QgYmUgaW4gZnVuY3Rpb24gKGVyciwgLi4uKSBmb3JtYXQuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgZnVuY3Rpb24gdG8gY2FsbFxuICogQHBhcmFtIHtNaXhlZH0gW2N0eF0gVGhlIGNvbnRleHQgZm9yIHRoZSBmdW5jIHBhcmFtZXRlciB0byBiZSBleGVjdXRlZC4gIElmIG5vdCBzcGVjaWZpZWQsIGRlZmF1bHRzIHRvIHVuZGVmaW5lZC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtzZWxlY3Rvcl0gQSBzZWxlY3RvciB3aGljaCB0YWtlcyB0aGUgYXJndW1lbnRzIGZyb20gdGhlIGNhbGxiYWNrIG1pbnVzIHRoZSBlcnJvciB0byBwcm9kdWNlIGEgc2luZ2xlIGl0ZW0gdG8geWllbGQgb24gbmV4dC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gQW4gYXN5bmMgZnVuY3Rpb24gd2hpY2ggd2hlbiBhcHBsaWVkLCByZXR1cm5zIGFuIG9ic2VydmFibGUgc2VxdWVuY2Ugd2l0aCB0aGUgY2FsbGJhY2sgYXJndW1lbnRzIGFzIGFuIGFycmF5LlxuICovXG5PYnNlcnZhYmxlLmZyb21Ob2RlQ2FsbGJhY2sgPSBmdW5jdGlvbiAoZm4sIGN0eCwgc2VsZWN0b3IpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICB0eXBlb2YgY3R4ID09PSAndW5kZWZpbmVkJyAmJiAoY3R4ID0gdGhpcyk7IFxuICAgIHZhciBsZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gbmV3IEFycmF5KGxlbik7XG4gICAgZm9yKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7IGFyZ3NbaV0gPSBhcmd1bWVudHNbaV07IH1cbiAgICByZXR1cm4gY3JlYXRlTm9kZU9ic2VydmFibGUoZm4sIGN0eCwgc2VsZWN0b3IsIGFyZ3MpO1xuICB9O1xufTtcblxuICBmdW5jdGlvbiBpc05vZGVMaXN0KGVsKSB7XG4gICAgaWYgKHJvb3QuU3RhdGljTm9kZUxpc3QpIHtcbiAgICAgIC8vIElFOCBTcGVjaWZpY1xuICAgICAgLy8gaW5zdGFuY2VvZiBpcyBzbG93ZXIgdGhhbiBPYmplY3QjdG9TdHJpbmcsIGJ1dCBPYmplY3QjdG9TdHJpbmcgd2lsbCBub3Qgd29yayBhcyBpbnRlbmRlZCBpbiBJRThcbiAgICAgIHJldHVybiBlbCBpbnN0YW5jZW9mIHJvb3QuU3RhdGljTm9kZUxpc3QgfHwgZWwgaW5zdGFuY2VvZiByb290Lk5vZGVMaXN0O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGVsKSA9PT0gJ1tvYmplY3QgTm9kZUxpc3RdJztcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBMaXN0ZW5EaXNwb3NhYmxlKGUsIG4sIGZuKSB7XG4gICAgdGhpcy5fZSA9IGU7XG4gICAgdGhpcy5fbiA9IG47XG4gICAgdGhpcy5fZm4gPSBmbjtcbiAgICB0aGlzLl9lLmFkZEV2ZW50TGlzdGVuZXIodGhpcy5fbiwgdGhpcy5fZm4sIGZhbHNlKTtcbiAgICB0aGlzLmlzRGlzcG9zZWQgPSBmYWxzZTtcbiAgfVxuICBMaXN0ZW5EaXNwb3NhYmxlLnByb3RvdHlwZS5kaXNwb3NlID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICghdGhpcy5pc0Rpc3Bvc2VkKSB7XG4gICAgICB0aGlzLl9lLnJlbW92ZUV2ZW50TGlzdGVuZXIodGhpcy5fbiwgdGhpcy5fZm4sIGZhbHNlKTtcbiAgICAgIHRoaXMuaXNEaXNwb3NlZCA9IHRydWU7XG4gICAgfVxuICB9O1xuXG4gIGZ1bmN0aW9uIGNyZWF0ZUV2ZW50TGlzdGVuZXIgKGVsLCBldmVudE5hbWUsIGhhbmRsZXIpIHtcbiAgICB2YXIgZGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuXG4gICAgLy8gQXN1bWUgTm9kZUxpc3Qgb3IgSFRNTENvbGxlY3Rpb25cbiAgICB2YXIgZWxlbVRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGVsKTtcbiAgICBpZiAoaXNOb2RlTGlzdChlbCkgfHwgZWxlbVRvU3RyaW5nID09PSAnW29iamVjdCBIVE1MQ29sbGVjdGlvbl0nKSB7XG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gZWwubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgZGlzcG9zYWJsZXMuYWRkKGNyZWF0ZUV2ZW50TGlzdGVuZXIoZWwuaXRlbShpKSwgZXZlbnROYW1lLCBoYW5kbGVyKSk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChlbCkge1xuICAgICAgZGlzcG9zYWJsZXMuYWRkKG5ldyBMaXN0ZW5EaXNwb3NhYmxlKGVsLCBldmVudE5hbWUsIGhhbmRsZXIpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZGlzcG9zYWJsZXM7XG4gIH1cblxuICAvKipcbiAgICogQ29uZmlndXJhdGlvbiBvcHRpb24gdG8gZGV0ZXJtaW5lIHdoZXRoZXIgdG8gdXNlIG5hdGl2ZSBldmVudHMgb25seVxuICAgKi9cbiAgUnguY29uZmlnLnVzZU5hdGl2ZUV2ZW50cyA9IGZhbHNlO1xuXG4gIHZhciBFdmVudE9ic2VydmFibGUgPSAoZnVuY3Rpb24oX19zdXBlcl9fKSB7XG4gICAgaW5oZXJpdHMoRXZlbnRPYnNlcnZhYmxlLCBfX3N1cGVyX18pO1xuICAgIGZ1bmN0aW9uIEV2ZW50T2JzZXJ2YWJsZShlbCwgbmFtZSwgZm4pIHtcbiAgICAgIHRoaXMuX2VsID0gZWw7XG4gICAgICB0aGlzLl9uID0gbmFtZTtcbiAgICAgIHRoaXMuX2ZuID0gZm47XG4gICAgICBfX3N1cGVyX18uY2FsbCh0aGlzKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjcmVhdGVIYW5kbGVyKG8sIGZuKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gaGFuZGxlciAoKSB7XG4gICAgICAgIHZhciByZXN1bHRzID0gYXJndW1lbnRzWzBdO1xuICAgICAgICBpZiAoaXNGdW5jdGlvbihmbikpIHtcbiAgICAgICAgICByZXN1bHRzID0gdHJ5Q2F0Y2goZm4pLmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgaWYgKHJlc3VsdHMgPT09IGVycm9yT2JqKSB7IHJldHVybiBvLm9uRXJyb3IocmVzdWx0cy5lKTsgfVxuICAgICAgICB9XG4gICAgICAgIG8ub25OZXh0KHJlc3VsdHMpO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICBFdmVudE9ic2VydmFibGUucHJvdG90eXBlLnN1YnNjcmliZUNvcmUgPSBmdW5jdGlvbiAobykge1xuICAgICAgcmV0dXJuIGNyZWF0ZUV2ZW50TGlzdGVuZXIoXG4gICAgICAgIHRoaXMuX2VsLFxuICAgICAgICB0aGlzLl9uLFxuICAgICAgICBjcmVhdGVIYW5kbGVyKG8sIHRoaXMuX2ZuKSk7XG4gICAgfTtcblxuICAgIHJldHVybiBFdmVudE9ic2VydmFibGU7XG4gIH0oT2JzZXJ2YWJsZUJhc2UpKTtcblxuICAvKipcbiAgICogQ3JlYXRlcyBhbiBvYnNlcnZhYmxlIHNlcXVlbmNlIGJ5IGFkZGluZyBhbiBldmVudCBsaXN0ZW5lciB0byB0aGUgbWF0Y2hpbmcgRE9NRWxlbWVudCBvciBlYWNoIGl0ZW0gaW4gdGhlIE5vZGVMaXN0LlxuICAgKiBAcGFyYW0ge09iamVjdH0gZWxlbWVudCBUaGUgRE9NRWxlbWVudCBvciBOb2RlTGlzdCB0byBhdHRhY2ggYSBsaXN0ZW5lci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50TmFtZSBUaGUgZXZlbnQgbmFtZSB0byBhdHRhY2ggdGhlIG9ic2VydmFibGUgc2VxdWVuY2UuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IFtzZWxlY3Rvcl0gQSBzZWxlY3RvciB3aGljaCB0YWtlcyB0aGUgYXJndW1lbnRzIGZyb20gdGhlIGV2ZW50IGhhbmRsZXIgdG8gcHJvZHVjZSBhIHNpbmdsZSBpdGVtIHRvIHlpZWxkIG9uIG5leHQuXG4gICAqIEByZXR1cm5zIHtPYnNlcnZhYmxlfSBBbiBvYnNlcnZhYmxlIHNlcXVlbmNlIG9mIGV2ZW50cyBmcm9tIHRoZSBzcGVjaWZpZWQgZWxlbWVudCBhbmQgdGhlIHNwZWNpZmllZCBldmVudC5cbiAgICovXG4gIE9ic2VydmFibGUuZnJvbUV2ZW50ID0gZnVuY3Rpb24gKGVsZW1lbnQsIGV2ZW50TmFtZSwgc2VsZWN0b3IpIHtcbiAgICAvLyBOb2RlLmpzIHNwZWNpZmljXG4gICAgaWYgKGVsZW1lbnQuYWRkTGlzdGVuZXIpIHtcbiAgICAgIHJldHVybiBmcm9tRXZlbnRQYXR0ZXJuKFxuICAgICAgICBmdW5jdGlvbiAoaCkgeyBlbGVtZW50LmFkZExpc3RlbmVyKGV2ZW50TmFtZSwgaCk7IH0sXG4gICAgICAgIGZ1bmN0aW9uIChoKSB7IGVsZW1lbnQucmVtb3ZlTGlzdGVuZXIoZXZlbnROYW1lLCBoKTsgfSxcbiAgICAgICAgc2VsZWN0b3IpO1xuICAgIH1cblxuICAgIC8vIFVzZSBvbmx5IGlmIG5vbi1uYXRpdmUgZXZlbnRzIGFyZSBhbGxvd2VkXG4gICAgaWYgKCFSeC5jb25maWcudXNlTmF0aXZlRXZlbnRzKSB7XG4gICAgICAvLyBIYW5kbGVzIGpxLCBBbmd1bGFyLmpzLCBaZXB0bywgTWFyaW9uZXR0ZSwgRW1iZXIuanNcbiAgICAgIGlmICh0eXBlb2YgZWxlbWVudC5vbiA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgZWxlbWVudC5vZmYgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcmV0dXJuIGZyb21FdmVudFBhdHRlcm4oXG4gICAgICAgICAgZnVuY3Rpb24gKGgpIHsgZWxlbWVudC5vbihldmVudE5hbWUsIGgpOyB9LFxuICAgICAgICAgIGZ1bmN0aW9uIChoKSB7IGVsZW1lbnQub2ZmKGV2ZW50TmFtZSwgaCk7IH0sXG4gICAgICAgICAgc2VsZWN0b3IpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBuZXcgRXZlbnRPYnNlcnZhYmxlKGVsZW1lbnQsIGV2ZW50TmFtZSwgc2VsZWN0b3IpLnB1Ymxpc2goKS5yZWZDb3VudCgpO1xuICB9O1xuXG4gIHZhciBFdmVudFBhdHRlcm5PYnNlcnZhYmxlID0gKGZ1bmN0aW9uKF9fc3VwZXJfXykge1xuICAgIGluaGVyaXRzKEV2ZW50UGF0dGVybk9ic2VydmFibGUsIF9fc3VwZXJfXyk7XG4gICAgZnVuY3Rpb24gRXZlbnRQYXR0ZXJuT2JzZXJ2YWJsZShhZGQsIGRlbCwgZm4pIHtcbiAgICAgIHRoaXMuX2FkZCA9IGFkZDtcbiAgICAgIHRoaXMuX2RlbCA9IGRlbDtcbiAgICAgIHRoaXMuX2ZuID0gZm47XG4gICAgICBfX3N1cGVyX18uY2FsbCh0aGlzKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjcmVhdGVIYW5kbGVyKG8sIGZuKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gaGFuZGxlciAoKSB7XG4gICAgICAgIHZhciByZXN1bHRzID0gYXJndW1lbnRzWzBdO1xuICAgICAgICBpZiAoaXNGdW5jdGlvbihmbikpIHtcbiAgICAgICAgICByZXN1bHRzID0gdHJ5Q2F0Y2goZm4pLmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgaWYgKHJlc3VsdHMgPT09IGVycm9yT2JqKSB7IHJldHVybiBvLm9uRXJyb3IocmVzdWx0cy5lKTsgfVxuICAgICAgICB9XG4gICAgICAgIG8ub25OZXh0KHJlc3VsdHMpO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICBFdmVudFBhdHRlcm5PYnNlcnZhYmxlLnByb3RvdHlwZS5zdWJzY3JpYmVDb3JlID0gZnVuY3Rpb24gKG8pIHtcbiAgICAgIHZhciBmbiA9IGNyZWF0ZUhhbmRsZXIobywgdGhpcy5fZm4pO1xuICAgICAgdmFyIHJldHVyblZhbHVlID0gdGhpcy5fYWRkKGZuKTtcbiAgICAgIHJldHVybiBuZXcgRXZlbnRQYXR0ZXJuRGlzcG9zYWJsZSh0aGlzLl9kZWwsIGZuLCByZXR1cm5WYWx1ZSk7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIEV2ZW50UGF0dGVybkRpc3Bvc2FibGUoZGVsLCBmbiwgcmV0KSB7XG4gICAgICB0aGlzLl9kZWwgPSBkZWw7XG4gICAgICB0aGlzLl9mbiA9IGZuO1xuICAgICAgdGhpcy5fcmV0ID0gcmV0O1xuICAgICAgdGhpcy5pc0Rpc3Bvc2VkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgRXZlbnRQYXR0ZXJuRGlzcG9zYWJsZS5wcm90b3R5cGUuZGlzcG9zZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmKCF0aGlzLmlzRGlzcG9zZWQpIHtcbiAgICAgICAgaXNGdW5jdGlvbih0aGlzLl9kZWwpICYmIHRoaXMuX2RlbCh0aGlzLl9mbiwgdGhpcy5fcmV0KTtcbiAgICAgICAgdGhpcy5pc0Rpc3Bvc2VkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIEV2ZW50UGF0dGVybk9ic2VydmFibGU7XG4gIH0oT2JzZXJ2YWJsZUJhc2UpKTtcblxuICAvKipcbiAgICogQ3JlYXRlcyBhbiBvYnNlcnZhYmxlIHNlcXVlbmNlIGZyb20gYW4gZXZlbnQgZW1pdHRlciB2aWEgYW4gYWRkSGFuZGxlci9yZW1vdmVIYW5kbGVyIHBhaXIuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGFkZEhhbmRsZXIgVGhlIGZ1bmN0aW9uIHRvIGFkZCBhIGhhbmRsZXIgdG8gdGhlIGVtaXR0ZXIuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IFtyZW1vdmVIYW5kbGVyXSBUaGUgb3B0aW9uYWwgZnVuY3Rpb24gdG8gcmVtb3ZlIGEgaGFuZGxlciBmcm9tIGFuIGVtaXR0ZXIuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IFtzZWxlY3Rvcl0gQSBzZWxlY3RvciB3aGljaCB0YWtlcyB0aGUgYXJndW1lbnRzIGZyb20gdGhlIGV2ZW50IGhhbmRsZXIgdG8gcHJvZHVjZSBhIHNpbmdsZSBpdGVtIHRvIHlpZWxkIG9uIG5leHQuXG4gICAqIEByZXR1cm5zIHtPYnNlcnZhYmxlfSBBbiBvYnNlcnZhYmxlIHNlcXVlbmNlIHdoaWNoIHdyYXBzIGFuIGV2ZW50IGZyb20gYW4gZXZlbnQgZW1pdHRlclxuICAgKi9cbiAgdmFyIGZyb21FdmVudFBhdHRlcm4gPSBPYnNlcnZhYmxlLmZyb21FdmVudFBhdHRlcm4gPSBmdW5jdGlvbiAoYWRkSGFuZGxlciwgcmVtb3ZlSGFuZGxlciwgc2VsZWN0b3IpIHtcbiAgICByZXR1cm4gbmV3IEV2ZW50UGF0dGVybk9ic2VydmFibGUoYWRkSGFuZGxlciwgcmVtb3ZlSGFuZGxlciwgc2VsZWN0b3IpLnB1Ymxpc2goKS5yZWZDb3VudCgpO1xuICB9O1xuXG4gIHZhciBGcm9tUHJvbWlzZU9ic2VydmFibGUgPSAoZnVuY3Rpb24oX19zdXBlcl9fKSB7XG4gICAgaW5oZXJpdHMoRnJvbVByb21pc2VPYnNlcnZhYmxlLCBfX3N1cGVyX18pO1xuICAgIGZ1bmN0aW9uIEZyb21Qcm9taXNlT2JzZXJ2YWJsZShwLCBzKSB7XG4gICAgICB0aGlzLl9wID0gcDtcbiAgICAgIHRoaXMuX3MgPSBzO1xuICAgICAgX19zdXBlcl9fLmNhbGwodGhpcyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2NoZWR1bGVOZXh0KHMsIHN0YXRlKSB7XG4gICAgICB2YXIgbyA9IHN0YXRlWzBdLCBkYXRhID0gc3RhdGVbMV07XG4gICAgICBvLm9uTmV4dChkYXRhKTtcbiAgICAgIG8ub25Db21wbGV0ZWQoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzY2hlZHVsZUVycm9yKHMsIHN0YXRlKSB7XG4gICAgICB2YXIgbyA9IHN0YXRlWzBdLCBlcnIgPSBzdGF0ZVsxXTtcbiAgICAgIG8ub25FcnJvcihlcnIpO1xuICAgIH1cblxuICAgIEZyb21Qcm9taXNlT2JzZXJ2YWJsZS5wcm90b3R5cGUuc3Vic2NyaWJlQ29yZSA9IGZ1bmN0aW9uKG8pIHtcbiAgICAgIHZhciBzYWQgPSBuZXcgU2luZ2xlQXNzaWdubWVudERpc3Bvc2FibGUoKSwgc2VsZiA9IHRoaXM7XG5cbiAgICAgIHRoaXMuX3BcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICBzYWQuc2V0RGlzcG9zYWJsZShzZWxmLl9zLnNjaGVkdWxlKFtvLCBkYXRhXSwgc2NoZWR1bGVOZXh0KSk7XG4gICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICBzYWQuc2V0RGlzcG9zYWJsZShzZWxmLl9zLnNjaGVkdWxlKFtvLCBlcnJdLCBzY2hlZHVsZUVycm9yKSk7XG4gICAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gc2FkO1xuICAgIH07XG5cbiAgICByZXR1cm4gRnJvbVByb21pc2VPYnNlcnZhYmxlO1xuICB9KE9ic2VydmFibGVCYXNlKSk7XG5cbiAgLyoqXG4gICogQ29udmVydHMgYSBQcm9taXNlIHRvIGFuIE9ic2VydmFibGUgc2VxdWVuY2VcbiAgKiBAcGFyYW0ge1Byb21pc2V9IEFuIEVTNiBDb21wbGlhbnQgcHJvbWlzZS5cbiAgKiBAcmV0dXJucyB7T2JzZXJ2YWJsZX0gQW4gT2JzZXJ2YWJsZSBzZXF1ZW5jZSB3aGljaCB3cmFwcyB0aGUgZXhpc3RpbmcgcHJvbWlzZSBzdWNjZXNzIGFuZCBmYWlsdXJlLlxuICAqL1xuICB2YXIgb2JzZXJ2YWJsZUZyb21Qcm9taXNlID0gT2JzZXJ2YWJsZS5mcm9tUHJvbWlzZSA9IGZ1bmN0aW9uIChwcm9taXNlLCBzY2hlZHVsZXIpIHtcbiAgICBzY2hlZHVsZXIgfHwgKHNjaGVkdWxlciA9IGRlZmF1bHRTY2hlZHVsZXIpO1xuICAgIHJldHVybiBuZXcgRnJvbVByb21pc2VPYnNlcnZhYmxlKHByb21pc2UsIHNjaGVkdWxlcik7XG4gIH07XG5cbiAgLypcbiAgICogQ29udmVydHMgYW4gZXhpc3Rpbmcgb2JzZXJ2YWJsZSBzZXF1ZW5jZSB0byBhbiBFUzYgQ29tcGF0aWJsZSBQcm9taXNlXG4gICAqIEBleGFtcGxlXG4gICAqIHZhciBwcm9taXNlID0gUnguT2JzZXJ2YWJsZS5yZXR1cm4oNDIpLnRvUHJvbWlzZShSU1ZQLlByb21pc2UpO1xuICAgKlxuICAgKiAvLyBXaXRoIGNvbmZpZ1xuICAgKiBSeC5jb25maWcuUHJvbWlzZSA9IFJTVlAuUHJvbWlzZTtcbiAgICogdmFyIHByb21pc2UgPSBSeC5PYnNlcnZhYmxlLnJldHVybig0MikudG9Qcm9taXNlKCk7XG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IFtwcm9taXNlQ3Rvcl0gVGhlIGNvbnN0cnVjdG9yIG9mIHRoZSBwcm9taXNlLiBJZiBub3QgcHJvdmlkZWQsIGl0IGxvb2tzIGZvciBpdCBpbiBSeC5jb25maWcuUHJvbWlzZS5cbiAgICogQHJldHVybnMge1Byb21pc2V9IEFuIEVTNiBjb21wYXRpYmxlIHByb21pc2Ugd2l0aCB0aGUgbGFzdCB2YWx1ZSBmcm9tIHRoZSBvYnNlcnZhYmxlIHNlcXVlbmNlLlxuICAgKi9cbiAgb2JzZXJ2YWJsZVByb3RvLnRvUHJvbWlzZSA9IGZ1bmN0aW9uIChwcm9taXNlQ3Rvcikge1xuICAgIHByb21pc2VDdG9yIHx8IChwcm9taXNlQ3RvciA9IFJ4LmNvbmZpZy5Qcm9taXNlKTtcbiAgICBpZiAoIXByb21pc2VDdG9yKSB7IHRocm93IG5ldyBOb3RTdXBwb3J0ZWRFcnJvcignUHJvbWlzZSB0eXBlIG5vdCBwcm92aWRlZCBub3IgaW4gUnguY29uZmlnLlByb21pc2UnKTsgfVxuICAgIHZhciBzb3VyY2UgPSB0aGlzO1xuICAgIHJldHVybiBuZXcgcHJvbWlzZUN0b3IoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgLy8gTm8gY2FuY2VsbGF0aW9uIGNhbiBiZSBkb25lXG4gICAgICB2YXIgdmFsdWU7XG4gICAgICBzb3VyY2Uuc3Vic2NyaWJlKGZ1bmN0aW9uICh2KSB7XG4gICAgICAgIHZhbHVlID0gdjtcbiAgICAgIH0sIHJlamVjdCwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXNvbHZlKHZhbHVlKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9O1xuXG4gIC8qKlxuICAgKiBJbnZva2VzIHRoZSBhc3luY2hyb25vdXMgZnVuY3Rpb24sIHN1cmZhY2luZyB0aGUgcmVzdWx0IHRocm91Z2ggYW4gb2JzZXJ2YWJsZSBzZXF1ZW5jZS5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuY3Rpb25Bc3luYyBBc3luY2hyb25vdXMgZnVuY3Rpb24gd2hpY2ggcmV0dXJucyBhIFByb21pc2UgdG8gcnVuLlxuICAgKiBAcmV0dXJucyB7T2JzZXJ2YWJsZX0gQW4gb2JzZXJ2YWJsZSBzZXF1ZW5jZSBleHBvc2luZyB0aGUgZnVuY3Rpb24ncyByZXN1bHQgdmFsdWUsIG9yIGFuIGV4Y2VwdGlvbi5cbiAgICovXG4gIE9ic2VydmFibGUuc3RhcnRBc3luYyA9IGZ1bmN0aW9uIChmdW5jdGlvbkFzeW5jKSB7XG4gICAgdmFyIHByb21pc2UgPSB0cnlDYXRjaChmdW5jdGlvbkFzeW5jKSgpO1xuICAgIGlmIChwcm9taXNlID09PSBlcnJvck9iaikgeyByZXR1cm4gb2JzZXJ2YWJsZVRocm93KHByb21pc2UuZSk7IH1cbiAgICByZXR1cm4gb2JzZXJ2YWJsZUZyb21Qcm9taXNlKHByb21pc2UpO1xuICB9O1xuXG4gIHZhciBNdWx0aWNhc3RPYnNlcnZhYmxlID0gKGZ1bmN0aW9uIChfX3N1cGVyX18pIHtcbiAgICBpbmhlcml0cyhNdWx0aWNhc3RPYnNlcnZhYmxlLCBfX3N1cGVyX18pO1xuICAgIGZ1bmN0aW9uIE11bHRpY2FzdE9ic2VydmFibGUoc291cmNlLCBmbjEsIGZuMikge1xuICAgICAgdGhpcy5zb3VyY2UgPSBzb3VyY2U7XG4gICAgICB0aGlzLl9mbjEgPSBmbjE7XG4gICAgICB0aGlzLl9mbjIgPSBmbjI7XG4gICAgICBfX3N1cGVyX18uY2FsbCh0aGlzKTtcbiAgICB9XG5cbiAgICBNdWx0aWNhc3RPYnNlcnZhYmxlLnByb3RvdHlwZS5zdWJzY3JpYmVDb3JlID0gZnVuY3Rpb24gKG8pIHtcbiAgICAgIHZhciBjb25uZWN0YWJsZSA9IHRoaXMuc291cmNlLm11bHRpY2FzdCh0aGlzLl9mbjEoKSk7XG4gICAgICByZXR1cm4gbmV3IEJpbmFyeURpc3Bvc2FibGUodGhpcy5fZm4yKGNvbm5lY3RhYmxlKS5zdWJzY3JpYmUobyksIGNvbm5lY3RhYmxlLmNvbm5lY3QoKSk7XG4gICAgfTtcblxuICAgIHJldHVybiBNdWx0aWNhc3RPYnNlcnZhYmxlO1xuICB9KE9ic2VydmFibGVCYXNlKSk7XG5cbiAgLyoqXG4gICAqIE11bHRpY2FzdHMgdGhlIHNvdXJjZSBzZXF1ZW5jZSBub3RpZmljYXRpb25zIHRocm91Z2ggYW4gaW5zdGFudGlhdGVkIHN1YmplY3QgaW50byBhbGwgdXNlcyBvZiB0aGUgc2VxdWVuY2Ugd2l0aGluIGEgc2VsZWN0b3IgZnVuY3Rpb24uIEVhY2hcbiAgICogc3Vic2NyaXB0aW9uIHRvIHRoZSByZXN1bHRpbmcgc2VxdWVuY2UgY2F1c2VzIGEgc2VwYXJhdGUgbXVsdGljYXN0IGludm9jYXRpb24sIGV4cG9zaW5nIHRoZSBzZXF1ZW5jZSByZXN1bHRpbmcgZnJvbSB0aGUgc2VsZWN0b3IgZnVuY3Rpb24nc1xuICAgKiBpbnZvY2F0aW9uLiBGb3Igc3BlY2lhbGl6YXRpb25zIHdpdGggZml4ZWQgc3ViamVjdCB0eXBlcywgc2VlIFB1Ymxpc2gsIFB1Ymxpc2hMYXN0LCBhbmQgUmVwbGF5LlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiAxIC0gcmVzID0gc291cmNlLm11bHRpY2FzdChvYnNlcnZhYmxlKTtcbiAgICogMiAtIHJlcyA9IHNvdXJjZS5tdWx0aWNhc3QoZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IFN1YmplY3QoKTsgfSwgZnVuY3Rpb24gKHgpIHsgcmV0dXJuIHg7IH0pO1xuICAgKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufFN1YmplY3R9IHN1YmplY3RPclN1YmplY3RTZWxlY3RvclxuICAgKiBGYWN0b3J5IGZ1bmN0aW9uIHRvIGNyZWF0ZSBhbiBpbnRlcm1lZGlhdGUgc3ViamVjdCB0aHJvdWdoIHdoaWNoIHRoZSBzb3VyY2Ugc2VxdWVuY2UncyBlbGVtZW50cyB3aWxsIGJlIG11bHRpY2FzdCB0byB0aGUgc2VsZWN0b3IgZnVuY3Rpb24uXG4gICAqIE9yOlxuICAgKiBTdWJqZWN0IHRvIHB1c2ggc291cmNlIGVsZW1lbnRzIGludG8uXG4gICAqXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IFtzZWxlY3Rvcl0gT3B0aW9uYWwgc2VsZWN0b3IgZnVuY3Rpb24gd2hpY2ggY2FuIHVzZSB0aGUgbXVsdGljYXN0ZWQgc291cmNlIHNlcXVlbmNlIHN1YmplY3QgdG8gdGhlIHBvbGljaWVzIGVuZm9yY2VkIGJ5IHRoZSBjcmVhdGVkIHN1YmplY3QuIFNwZWNpZmllZCBvbmx5IGlmIDxwYXJhbXJlZiBuYW1lPVwic3ViamVjdE9yU3ViamVjdFNlbGVjdG9yXCIgaXMgYSBmYWN0b3J5IGZ1bmN0aW9uLlxuICAgKiBAcmV0dXJucyB7T2JzZXJ2YWJsZX0gQW4gb2JzZXJ2YWJsZSBzZXF1ZW5jZSB0aGF0IGNvbnRhaW5zIHRoZSBlbGVtZW50cyBvZiBhIHNlcXVlbmNlIHByb2R1Y2VkIGJ5IG11bHRpY2FzdGluZyB0aGUgc291cmNlIHNlcXVlbmNlIHdpdGhpbiBhIHNlbGVjdG9yIGZ1bmN0aW9uLlxuICAgKi9cbiAgb2JzZXJ2YWJsZVByb3RvLm11bHRpY2FzdCA9IGZ1bmN0aW9uIChzdWJqZWN0T3JTdWJqZWN0U2VsZWN0b3IsIHNlbGVjdG9yKSB7XG4gICAgcmV0dXJuIGlzRnVuY3Rpb24oc3ViamVjdE9yU3ViamVjdFNlbGVjdG9yKSA/XG4gICAgICBuZXcgTXVsdGljYXN0T2JzZXJ2YWJsZSh0aGlzLCBzdWJqZWN0T3JTdWJqZWN0U2VsZWN0b3IsIHNlbGVjdG9yKSA6XG4gICAgICBuZXcgQ29ubmVjdGFibGVPYnNlcnZhYmxlKHRoaXMsIHN1YmplY3RPclN1YmplY3RTZWxlY3Rvcik7XG4gIH07XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gb2JzZXJ2YWJsZSBzZXF1ZW5jZSB0aGF0IGlzIHRoZSByZXN1bHQgb2YgaW52b2tpbmcgdGhlIHNlbGVjdG9yIG9uIGEgY29ubmVjdGFibGUgb2JzZXJ2YWJsZSBzZXF1ZW5jZSB0aGF0IHNoYXJlcyBhIHNpbmdsZSBzdWJzY3JpcHRpb24gdG8gdGhlIHVuZGVybHlpbmcgc2VxdWVuY2UuXG4gICAqIFRoaXMgb3BlcmF0b3IgaXMgYSBzcGVjaWFsaXphdGlvbiBvZiBNdWx0aWNhc3QgdXNpbmcgYSByZWd1bGFyIFN1YmplY3QuXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIHZhciByZXNyZXMgPSBzb3VyY2UucHVibGlzaCgpO1xuICAgKiB2YXIgcmVzID0gc291cmNlLnB1Ymxpc2goZnVuY3Rpb24gKHgpIHsgcmV0dXJuIHg7IH0pO1xuICAgKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbc2VsZWN0b3JdIFNlbGVjdG9yIGZ1bmN0aW9uIHdoaWNoIGNhbiB1c2UgdGhlIG11bHRpY2FzdGVkIHNvdXJjZSBzZXF1ZW5jZSBhcyBtYW55IHRpbWVzIGFzIG5lZWRlZCwgd2l0aG91dCBjYXVzaW5nIG11bHRpcGxlIHN1YnNjcmlwdGlvbnMgdG8gdGhlIHNvdXJjZSBzZXF1ZW5jZS4gU3Vic2NyaWJlcnMgdG8gdGhlIGdpdmVuIHNvdXJjZSB3aWxsIHJlY2VpdmUgYWxsIG5vdGlmaWNhdGlvbnMgb2YgdGhlIHNvdXJjZSBmcm9tIHRoZSB0aW1lIG9mIHRoZSBzdWJzY3JpcHRpb24gb24uXG4gICAqIEByZXR1cm5zIHtPYnNlcnZhYmxlfSBBbiBvYnNlcnZhYmxlIHNlcXVlbmNlIHRoYXQgY29udGFpbnMgdGhlIGVsZW1lbnRzIG9mIGEgc2VxdWVuY2UgcHJvZHVjZWQgYnkgbXVsdGljYXN0aW5nIHRoZSBzb3VyY2Ugc2VxdWVuY2Ugd2l0aGluIGEgc2VsZWN0b3IgZnVuY3Rpb24uXG4gICAqL1xuICBvYnNlcnZhYmxlUHJvdG8ucHVibGlzaCA9IGZ1bmN0aW9uIChzZWxlY3Rvcikge1xuICAgIHJldHVybiBzZWxlY3RvciAmJiBpc0Z1bmN0aW9uKHNlbGVjdG9yKSA/XG4gICAgICB0aGlzLm11bHRpY2FzdChmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgU3ViamVjdCgpOyB9LCBzZWxlY3RvcikgOlxuICAgICAgdGhpcy5tdWx0aWNhc3QobmV3IFN1YmplY3QoKSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gb2JzZXJ2YWJsZSBzZXF1ZW5jZSB0aGF0IHNoYXJlcyBhIHNpbmdsZSBzdWJzY3JpcHRpb24gdG8gdGhlIHVuZGVybHlpbmcgc2VxdWVuY2UuXG4gICAqIFRoaXMgb3BlcmF0b3IgaXMgYSBzcGVjaWFsaXphdGlvbiBvZiBwdWJsaXNoIHdoaWNoIGNyZWF0ZXMgYSBzdWJzY3JpcHRpb24gd2hlbiB0aGUgbnVtYmVyIG9mIG9ic2VydmVycyBnb2VzIGZyb20gemVybyB0byBvbmUsIHRoZW4gc2hhcmVzIHRoYXQgc3Vic2NyaXB0aW9uIHdpdGggYWxsIHN1YnNlcXVlbnQgb2JzZXJ2ZXJzIHVudGlsIHRoZSBudW1iZXIgb2Ygb2JzZXJ2ZXJzIHJldHVybnMgdG8gemVybywgYXQgd2hpY2ggcG9pbnQgdGhlIHN1YnNjcmlwdGlvbiBpcyBkaXNwb3NlZC5cbiAgICogQHJldHVybnMge09ic2VydmFibGV9IEFuIG9ic2VydmFibGUgc2VxdWVuY2UgdGhhdCBjb250YWlucyB0aGUgZWxlbWVudHMgb2YgYSBzZXF1ZW5jZSBwcm9kdWNlZCBieSBtdWx0aWNhc3RpbmcgdGhlIHNvdXJjZSBzZXF1ZW5jZS5cbiAgICovXG4gIG9ic2VydmFibGVQcm90by5zaGFyZSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5wdWJsaXNoKCkucmVmQ291bnQoKTtcbiAgfTtcblxuICAvKipcbiAgICogUmV0dXJucyBhbiBvYnNlcnZhYmxlIHNlcXVlbmNlIHRoYXQgaXMgdGhlIHJlc3VsdCBvZiBpbnZva2luZyB0aGUgc2VsZWN0b3Igb24gYSBjb25uZWN0YWJsZSBvYnNlcnZhYmxlIHNlcXVlbmNlIHRoYXQgc2hhcmVzIGEgc2luZ2xlIHN1YnNjcmlwdGlvbiB0byB0aGUgdW5kZXJseWluZyBzZXF1ZW5jZSBjb250YWluaW5nIG9ubHkgdGhlIGxhc3Qgbm90aWZpY2F0aW9uLlxuICAgKiBUaGlzIG9wZXJhdG9yIGlzIGEgc3BlY2lhbGl6YXRpb24gb2YgTXVsdGljYXN0IHVzaW5nIGEgQXN5bmNTdWJqZWN0LlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiB2YXIgcmVzID0gc291cmNlLnB1Ymxpc2hMYXN0KCk7XG4gICAqIHZhciByZXMgPSBzb3VyY2UucHVibGlzaExhc3QoZnVuY3Rpb24gKHgpIHsgcmV0dXJuIHg7IH0pO1xuICAgKlxuICAgKiBAcGFyYW0gc2VsZWN0b3IgW09wdGlvbmFsXSBTZWxlY3RvciBmdW5jdGlvbiB3aGljaCBjYW4gdXNlIHRoZSBtdWx0aWNhc3RlZCBzb3VyY2Ugc2VxdWVuY2UgYXMgbWFueSB0aW1lcyBhcyBuZWVkZWQsIHdpdGhvdXQgY2F1c2luZyBtdWx0aXBsZSBzdWJzY3JpcHRpb25zIHRvIHRoZSBzb3VyY2Ugc2VxdWVuY2UuIFN1YnNjcmliZXJzIHRvIHRoZSBnaXZlbiBzb3VyY2Ugd2lsbCBvbmx5IHJlY2VpdmUgdGhlIGxhc3Qgbm90aWZpY2F0aW9uIG9mIHRoZSBzb3VyY2UuXG4gICAqIEByZXR1cm5zIHtPYnNlcnZhYmxlfSBBbiBvYnNlcnZhYmxlIHNlcXVlbmNlIHRoYXQgY29udGFpbnMgdGhlIGVsZW1lbnRzIG9mIGEgc2VxdWVuY2UgcHJvZHVjZWQgYnkgbXVsdGljYXN0aW5nIHRoZSBzb3VyY2Ugc2VxdWVuY2Ugd2l0aGluIGEgc2VsZWN0b3IgZnVuY3Rpb24uXG4gICAqL1xuICBvYnNlcnZhYmxlUHJvdG8ucHVibGlzaExhc3QgPSBmdW5jdGlvbiAoc2VsZWN0b3IpIHtcbiAgICByZXR1cm4gc2VsZWN0b3IgJiYgaXNGdW5jdGlvbihzZWxlY3RvcikgP1xuICAgICAgdGhpcy5tdWx0aWNhc3QoZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IEFzeW5jU3ViamVjdCgpOyB9LCBzZWxlY3RvcikgOlxuICAgICAgdGhpcy5tdWx0aWNhc3QobmV3IEFzeW5jU3ViamVjdCgpKTtcbiAgfTtcblxuICAvKipcbiAgICogUmV0dXJucyBhbiBvYnNlcnZhYmxlIHNlcXVlbmNlIHRoYXQgaXMgdGhlIHJlc3VsdCBvZiBpbnZva2luZyB0aGUgc2VsZWN0b3Igb24gYSBjb25uZWN0YWJsZSBvYnNlcnZhYmxlIHNlcXVlbmNlIHRoYXQgc2hhcmVzIGEgc2luZ2xlIHN1YnNjcmlwdGlvbiB0byB0aGUgdW5kZXJseWluZyBzZXF1ZW5jZSBhbmQgc3RhcnRzIHdpdGggaW5pdGlhbFZhbHVlLlxuICAgKiBUaGlzIG9wZXJhdG9yIGlzIGEgc3BlY2lhbGl6YXRpb24gb2YgTXVsdGljYXN0IHVzaW5nIGEgQmVoYXZpb3JTdWJqZWN0LlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiB2YXIgcmVzID0gc291cmNlLnB1Ymxpc2hWYWx1ZSg0Mik7XG4gICAqIHZhciByZXMgPSBzb3VyY2UucHVibGlzaFZhbHVlKGZ1bmN0aW9uICh4KSB7IHJldHVybiB4LnNlbGVjdChmdW5jdGlvbiAoeSkgeyByZXR1cm4geSAqIHk7IH0pIH0sIDQyKTtcbiAgICpcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gW3NlbGVjdG9yXSBPcHRpb25hbCBzZWxlY3RvciBmdW5jdGlvbiB3aGljaCBjYW4gdXNlIHRoZSBtdWx0aWNhc3RlZCBzb3VyY2Ugc2VxdWVuY2UgYXMgbWFueSB0aW1lcyBhcyBuZWVkZWQsIHdpdGhvdXQgY2F1c2luZyBtdWx0aXBsZSBzdWJzY3JpcHRpb25zIHRvIHRoZSBzb3VyY2Ugc2VxdWVuY2UuIFN1YnNjcmliZXJzIHRvIHRoZSBnaXZlbiBzb3VyY2Ugd2lsbCByZWNlaXZlIGltbWVkaWF0ZWx5IHJlY2VpdmUgdGhlIGluaXRpYWwgdmFsdWUsIGZvbGxvd2VkIGJ5IGFsbCBub3RpZmljYXRpb25zIG9mIHRoZSBzb3VyY2UgZnJvbSB0aGUgdGltZSBvZiB0aGUgc3Vic2NyaXB0aW9uIG9uLlxuICAgKiBAcGFyYW0ge01peGVkfSBpbml0aWFsVmFsdWUgSW5pdGlhbCB2YWx1ZSByZWNlaXZlZCBieSBvYnNlcnZlcnMgdXBvbiBzdWJzY3JpcHRpb24uXG4gICAqIEByZXR1cm5zIHtPYnNlcnZhYmxlfSBBbiBvYnNlcnZhYmxlIHNlcXVlbmNlIHRoYXQgY29udGFpbnMgdGhlIGVsZW1lbnRzIG9mIGEgc2VxdWVuY2UgcHJvZHVjZWQgYnkgbXVsdGljYXN0aW5nIHRoZSBzb3VyY2Ugc2VxdWVuY2Ugd2l0aGluIGEgc2VsZWN0b3IgZnVuY3Rpb24uXG4gICAqL1xuICBvYnNlcnZhYmxlUHJvdG8ucHVibGlzaFZhbHVlID0gZnVuY3Rpb24gKGluaXRpYWxWYWx1ZU9yU2VsZWN0b3IsIGluaXRpYWxWYWx1ZSkge1xuICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID09PSAyID9cbiAgICAgIHRoaXMubXVsdGljYXN0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBCZWhhdmlvclN1YmplY3QoaW5pdGlhbFZhbHVlKTtcbiAgICAgIH0sIGluaXRpYWxWYWx1ZU9yU2VsZWN0b3IpIDpcbiAgICAgIHRoaXMubXVsdGljYXN0KG5ldyBCZWhhdmlvclN1YmplY3QoaW5pdGlhbFZhbHVlT3JTZWxlY3RvcikpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFuIG9ic2VydmFibGUgc2VxdWVuY2UgdGhhdCBzaGFyZXMgYSBzaW5nbGUgc3Vic2NyaXB0aW9uIHRvIHRoZSB1bmRlcmx5aW5nIHNlcXVlbmNlIGFuZCBzdGFydHMgd2l0aCBhbiBpbml0aWFsVmFsdWUuXG4gICAqIFRoaXMgb3BlcmF0b3IgaXMgYSBzcGVjaWFsaXphdGlvbiBvZiBwdWJsaXNoVmFsdWUgd2hpY2ggY3JlYXRlcyBhIHN1YnNjcmlwdGlvbiB3aGVuIHRoZSBudW1iZXIgb2Ygb2JzZXJ2ZXJzIGdvZXMgZnJvbSB6ZXJvIHRvIG9uZSwgdGhlbiBzaGFyZXMgdGhhdCBzdWJzY3JpcHRpb24gd2l0aCBhbGwgc3Vic2VxdWVudCBvYnNlcnZlcnMgdW50aWwgdGhlIG51bWJlciBvZiBvYnNlcnZlcnMgcmV0dXJucyB0byB6ZXJvLCBhdCB3aGljaCBwb2ludCB0aGUgc3Vic2NyaXB0aW9uIGlzIGRpc3Bvc2VkLlxuICAgKiBAcGFyYW0ge01peGVkfSBpbml0aWFsVmFsdWUgSW5pdGlhbCB2YWx1ZSByZWNlaXZlZCBieSBvYnNlcnZlcnMgdXBvbiBzdWJzY3JpcHRpb24uXG4gICAqIEByZXR1cm5zIHtPYnNlcnZhYmxlfSBBbiBvYnNlcnZhYmxlIHNlcXVlbmNlIHRoYXQgY29udGFpbnMgdGhlIGVsZW1lbnRzIG9mIGEgc2VxdWVuY2UgcHJvZHVjZWQgYnkgbXVsdGljYXN0aW5nIHRoZSBzb3VyY2Ugc2VxdWVuY2UuXG4gICAqL1xuICBvYnNlcnZhYmxlUHJvdG8uc2hhcmVWYWx1ZSA9IGZ1bmN0aW9uIChpbml0aWFsVmFsdWUpIHtcbiAgICByZXR1cm4gdGhpcy5wdWJsaXNoVmFsdWUoaW5pdGlhbFZhbHVlKS5yZWZDb3VudCgpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFuIG9ic2VydmFibGUgc2VxdWVuY2UgdGhhdCBpcyB0aGUgcmVzdWx0IG9mIGludm9raW5nIHRoZSBzZWxlY3RvciBvbiBhIGNvbm5lY3RhYmxlIG9ic2VydmFibGUgc2VxdWVuY2UgdGhhdCBzaGFyZXMgYSBzaW5nbGUgc3Vic2NyaXB0aW9uIHRvIHRoZSB1bmRlcmx5aW5nIHNlcXVlbmNlIHJlcGxheWluZyBub3RpZmljYXRpb25zIHN1YmplY3QgdG8gYSBtYXhpbXVtIHRpbWUgbGVuZ3RoIGZvciB0aGUgcmVwbGF5IGJ1ZmZlci5cbiAgICogVGhpcyBvcGVyYXRvciBpcyBhIHNwZWNpYWxpemF0aW9uIG9mIE11bHRpY2FzdCB1c2luZyBhIFJlcGxheVN1YmplY3QuXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIHZhciByZXMgPSBzb3VyY2UucmVwbGF5KG51bGwsIDMpO1xuICAgKiB2YXIgcmVzID0gc291cmNlLnJlcGxheShudWxsLCAzLCA1MDApO1xuICAgKiB2YXIgcmVzID0gc291cmNlLnJlcGxheShudWxsLCAzLCA1MDAsIHNjaGVkdWxlcik7XG4gICAqIHZhciByZXMgPSBzb3VyY2UucmVwbGF5KGZ1bmN0aW9uICh4KSB7IHJldHVybiB4LnRha2UoNikucmVwZWF0KCk7IH0sIDMsIDUwMCwgc2NoZWR1bGVyKTtcbiAgICpcbiAgICogQHBhcmFtIHNlbGVjdG9yIFtPcHRpb25hbF0gU2VsZWN0b3IgZnVuY3Rpb24gd2hpY2ggY2FuIHVzZSB0aGUgbXVsdGljYXN0ZWQgc291cmNlIHNlcXVlbmNlIGFzIG1hbnkgdGltZXMgYXMgbmVlZGVkLCB3aXRob3V0IGNhdXNpbmcgbXVsdGlwbGUgc3Vic2NyaXB0aW9ucyB0byB0aGUgc291cmNlIHNlcXVlbmNlLiBTdWJzY3JpYmVycyB0byB0aGUgZ2l2ZW4gc291cmNlIHdpbGwgcmVjZWl2ZSBhbGwgdGhlIG5vdGlmaWNhdGlvbnMgb2YgdGhlIHNvdXJjZSBzdWJqZWN0IHRvIHRoZSBzcGVjaWZpZWQgcmVwbGF5IGJ1ZmZlciB0cmltbWluZyBwb2xpY3kuXG4gICAqIEBwYXJhbSBidWZmZXJTaXplIFtPcHRpb25hbF0gTWF4aW11bSBlbGVtZW50IGNvdW50IG9mIHRoZSByZXBsYXkgYnVmZmVyLlxuICAgKiBAcGFyYW0gd2luZG93U2l6ZSBbT3B0aW9uYWxdIE1heGltdW0gdGltZSBsZW5ndGggb2YgdGhlIHJlcGxheSBidWZmZXIuXG4gICAqIEBwYXJhbSBzY2hlZHVsZXIgW09wdGlvbmFsXSBTY2hlZHVsZXIgd2hlcmUgY29ubmVjdGVkIG9ic2VydmVycyB3aXRoaW4gdGhlIHNlbGVjdG9yIGZ1bmN0aW9uIHdpbGwgYmUgaW52b2tlZCBvbi5cbiAgICogQHJldHVybnMge09ic2VydmFibGV9IEFuIG9ic2VydmFibGUgc2VxdWVuY2UgdGhhdCBjb250YWlucyB0aGUgZWxlbWVudHMgb2YgYSBzZXF1ZW5jZSBwcm9kdWNlZCBieSBtdWx0aWNhc3RpbmcgdGhlIHNvdXJjZSBzZXF1ZW5jZSB3aXRoaW4gYSBzZWxlY3RvciBmdW5jdGlvbi5cbiAgICovXG4gIG9ic2VydmFibGVQcm90by5yZXBsYXkgPSBmdW5jdGlvbiAoc2VsZWN0b3IsIGJ1ZmZlclNpemUsIHdpbmRvd1NpemUsIHNjaGVkdWxlcikge1xuICAgIHJldHVybiBzZWxlY3RvciAmJiBpc0Z1bmN0aW9uKHNlbGVjdG9yKSA/XG4gICAgICB0aGlzLm11bHRpY2FzdChmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgUmVwbGF5U3ViamVjdChidWZmZXJTaXplLCB3aW5kb3dTaXplLCBzY2hlZHVsZXIpOyB9LCBzZWxlY3RvcikgOlxuICAgICAgdGhpcy5tdWx0aWNhc3QobmV3IFJlcGxheVN1YmplY3QoYnVmZmVyU2l6ZSwgd2luZG93U2l6ZSwgc2NoZWR1bGVyKSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gb2JzZXJ2YWJsZSBzZXF1ZW5jZSB0aGF0IHNoYXJlcyBhIHNpbmdsZSBzdWJzY3JpcHRpb24gdG8gdGhlIHVuZGVybHlpbmcgc2VxdWVuY2UgcmVwbGF5aW5nIG5vdGlmaWNhdGlvbnMgc3ViamVjdCB0byBhIG1heGltdW0gdGltZSBsZW5ndGggZm9yIHRoZSByZXBsYXkgYnVmZmVyLlxuICAgKiBUaGlzIG9wZXJhdG9yIGlzIGEgc3BlY2lhbGl6YXRpb24gb2YgcmVwbGF5IHdoaWNoIGNyZWF0ZXMgYSBzdWJzY3JpcHRpb24gd2hlbiB0aGUgbnVtYmVyIG9mIG9ic2VydmVycyBnb2VzIGZyb20gemVybyB0byBvbmUsIHRoZW4gc2hhcmVzIHRoYXQgc3Vic2NyaXB0aW9uIHdpdGggYWxsIHN1YnNlcXVlbnQgb2JzZXJ2ZXJzIHVudGlsIHRoZSBudW1iZXIgb2Ygb2JzZXJ2ZXJzIHJldHVybnMgdG8gemVybywgYXQgd2hpY2ggcG9pbnQgdGhlIHN1YnNjcmlwdGlvbiBpcyBkaXNwb3NlZC5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogdmFyIHJlcyA9IHNvdXJjZS5zaGFyZVJlcGxheSgzKTtcbiAgICogdmFyIHJlcyA9IHNvdXJjZS5zaGFyZVJlcGxheSgzLCA1MDApO1xuICAgKiB2YXIgcmVzID0gc291cmNlLnNoYXJlUmVwbGF5KDMsIDUwMCwgc2NoZWR1bGVyKTtcbiAgICpcblxuICAgKiBAcGFyYW0gYnVmZmVyU2l6ZSBbT3B0aW9uYWxdIE1heGltdW0gZWxlbWVudCBjb3VudCBvZiB0aGUgcmVwbGF5IGJ1ZmZlci5cbiAgICogQHBhcmFtIHdpbmRvdyBbT3B0aW9uYWxdIE1heGltdW0gdGltZSBsZW5ndGggb2YgdGhlIHJlcGxheSBidWZmZXIuXG4gICAqIEBwYXJhbSBzY2hlZHVsZXIgW09wdGlvbmFsXSBTY2hlZHVsZXIgd2hlcmUgY29ubmVjdGVkIG9ic2VydmVycyB3aXRoaW4gdGhlIHNlbGVjdG9yIGZ1bmN0aW9uIHdpbGwgYmUgaW52b2tlZCBvbi5cbiAgICogQHJldHVybnMge09ic2VydmFibGV9IEFuIG9ic2VydmFibGUgc2VxdWVuY2UgdGhhdCBjb250YWlucyB0aGUgZWxlbWVudHMgb2YgYSBzZXF1ZW5jZSBwcm9kdWNlZCBieSBtdWx0aWNhc3RpbmcgdGhlIHNvdXJjZSBzZXF1ZW5jZS5cbiAgICovXG4gIG9ic2VydmFibGVQcm90by5zaGFyZVJlcGxheSA9IGZ1bmN0aW9uIChidWZmZXJTaXplLCB3aW5kb3dTaXplLCBzY2hlZHVsZXIpIHtcbiAgICByZXR1cm4gdGhpcy5yZXBsYXkobnVsbCwgYnVmZmVyU2l6ZSwgd2luZG93U2l6ZSwgc2NoZWR1bGVyKS5yZWZDb3VudCgpO1xuICB9O1xuXG4gIHZhciBSZWZDb3VudE9ic2VydmFibGUgPSAoZnVuY3Rpb24gKF9fc3VwZXJfXykge1xuICAgIGluaGVyaXRzKFJlZkNvdW50T2JzZXJ2YWJsZSwgX19zdXBlcl9fKTtcbiAgICBmdW5jdGlvbiBSZWZDb3VudE9ic2VydmFibGUoc291cmNlKSB7XG4gICAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcbiAgICAgIHRoaXMuX2NvdW50ID0gMDtcbiAgICAgIHRoaXMuX2Nvbm5lY3RhYmxlU3Vic2NyaXB0aW9uID0gbnVsbDtcbiAgICAgIF9fc3VwZXJfXy5jYWxsKHRoaXMpO1xuICAgIH1cblxuICAgIFJlZkNvdW50T2JzZXJ2YWJsZS5wcm90b3R5cGUuc3Vic2NyaWJlQ29yZSA9IGZ1bmN0aW9uIChvKSB7XG4gICAgICB2YXIgc3Vic2NyaXB0aW9uID0gdGhpcy5zb3VyY2Uuc3Vic2NyaWJlKG8pO1xuICAgICAgKyt0aGlzLl9jb3VudCA9PT0gMSAmJiAodGhpcy5fY29ubmVjdGFibGVTdWJzY3JpcHRpb24gPSB0aGlzLnNvdXJjZS5jb25uZWN0KCkpO1xuICAgICAgcmV0dXJuIG5ldyBSZWZDb3VudERpc3Bvc2FibGUodGhpcywgc3Vic2NyaXB0aW9uKTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gUmVmQ291bnREaXNwb3NhYmxlKHAsIHMpIHtcbiAgICAgIHRoaXMuX3AgPSBwO1xuICAgICAgdGhpcy5fcyA9IHM7XG4gICAgICB0aGlzLmlzRGlzcG9zZWQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBSZWZDb3VudERpc3Bvc2FibGUucHJvdG90eXBlLmRpc3Bvc2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoIXRoaXMuaXNEaXNwb3NlZCkge1xuICAgICAgICB0aGlzLmlzRGlzcG9zZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLl9zLmRpc3Bvc2UoKTtcbiAgICAgICAgLS10aGlzLl9wLl9jb3VudCA9PT0gMCAmJiB0aGlzLl9wLl9jb25uZWN0YWJsZVN1YnNjcmlwdGlvbi5kaXNwb3NlKCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHJldHVybiBSZWZDb3VudE9ic2VydmFibGU7XG4gIH0oT2JzZXJ2YWJsZUJhc2UpKTtcblxuICB2YXIgQ29ubmVjdGFibGVPYnNlcnZhYmxlID0gUnguQ29ubmVjdGFibGVPYnNlcnZhYmxlID0gKGZ1bmN0aW9uIChfX3N1cGVyX18pIHtcbiAgICBpbmhlcml0cyhDb25uZWN0YWJsZU9ic2VydmFibGUsIF9fc3VwZXJfXyk7XG4gICAgZnVuY3Rpb24gQ29ubmVjdGFibGVPYnNlcnZhYmxlKHNvdXJjZSwgc3ViamVjdCkge1xuICAgICAgdGhpcy5zb3VyY2UgPSBzb3VyY2U7XG4gICAgICB0aGlzLl9jb25uZWN0aW9uID0gbnVsbDtcbiAgICAgIHRoaXMuX3NvdXJjZSA9IHNvdXJjZS5hc09ic2VydmFibGUoKTtcbiAgICAgIHRoaXMuX3N1YmplY3QgPSBzdWJqZWN0O1xuICAgICAgX19zdXBlcl9fLmNhbGwodGhpcyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gQ29ubmVjdERpc3Bvc2FibGUocGFyZW50LCBzdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMuX3AgPSBwYXJlbnQ7XG4gICAgICB0aGlzLl9zID0gc3Vic2NyaXB0aW9uO1xuICAgIH1cblxuICAgIENvbm5lY3REaXNwb3NhYmxlLnByb3RvdHlwZS5kaXNwb3NlID0gZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHRoaXMuX3MpIHtcbiAgICAgICAgdGhpcy5fcy5kaXNwb3NlKCk7XG4gICAgICAgIHRoaXMuX3MgPSBudWxsO1xuICAgICAgICB0aGlzLl9wLl9jb25uZWN0aW9uID0gbnVsbDtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgQ29ubmVjdGFibGVPYnNlcnZhYmxlLnByb3RvdHlwZS5jb25uZWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKCF0aGlzLl9jb25uZWN0aW9uKSB7XG4gICAgICAgIHZhciBzdWJzY3JpcHRpb24gPSB0aGlzLl9zb3VyY2Uuc3Vic2NyaWJlKHRoaXMuX3N1YmplY3QpO1xuICAgICAgICB0aGlzLl9jb25uZWN0aW9uID0gbmV3IENvbm5lY3REaXNwb3NhYmxlKHRoaXMsIHN1YnNjcmlwdGlvbik7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5fY29ubmVjdGlvbjtcbiAgICB9O1xuXG4gICAgQ29ubmVjdGFibGVPYnNlcnZhYmxlLnByb3RvdHlwZS5fc3Vic2NyaWJlID0gZnVuY3Rpb24gKG8pIHtcbiAgICAgIHJldHVybiB0aGlzLl9zdWJqZWN0LnN1YnNjcmliZShvKTtcbiAgICB9O1xuXG4gICAgQ29ubmVjdGFibGVPYnNlcnZhYmxlLnByb3RvdHlwZS5yZWZDb3VudCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBuZXcgUmVmQ291bnRPYnNlcnZhYmxlKHRoaXMpO1xuICAgIH07XG5cbiAgICByZXR1cm4gQ29ubmVjdGFibGVPYnNlcnZhYmxlO1xuICB9KE9ic2VydmFibGUpKTtcblxuICB2YXIgVGltZXJPYnNlcnZhYmxlID0gKGZ1bmN0aW9uKF9fc3VwZXJfXykge1xuICAgIGluaGVyaXRzKFRpbWVyT2JzZXJ2YWJsZSwgX19zdXBlcl9fKTtcbiAgICBmdW5jdGlvbiBUaW1lck9ic2VydmFibGUoZHQsIHMpIHtcbiAgICAgIHRoaXMuX2R0ID0gZHQ7XG4gICAgICB0aGlzLl9zID0gcztcbiAgICAgIF9fc3VwZXJfXy5jYWxsKHRoaXMpO1xuICAgIH1cblxuICAgIFRpbWVyT2JzZXJ2YWJsZS5wcm90b3R5cGUuc3Vic2NyaWJlQ29yZSA9IGZ1bmN0aW9uIChvKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcy5zY2hlZHVsZUZ1dHVyZShvLCB0aGlzLl9kdCwgc2NoZWR1bGVNZXRob2QpO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBzY2hlZHVsZU1ldGhvZChzLCBvKSB7XG4gICAgICBvLm9uTmV4dCgwKTtcbiAgICAgIG8ub25Db21wbGV0ZWQoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gVGltZXJPYnNlcnZhYmxlO1xuICB9KE9ic2VydmFibGVCYXNlKSk7XG5cbiAgZnVuY3Rpb24gX29ic2VydmFibGVUaW1lcihkdWVUaW1lLCBzY2hlZHVsZXIpIHtcbiAgICByZXR1cm4gbmV3IFRpbWVyT2JzZXJ2YWJsZShkdWVUaW1lLCBzY2hlZHVsZXIpO1xuICB9XG5cbiAgZnVuY3Rpb24gb2JzZXJ2YWJsZVRpbWVyRGF0ZUFuZFBlcmlvZChkdWVUaW1lLCBwZXJpb2QsIHNjaGVkdWxlcikge1xuICAgIHJldHVybiBuZXcgQW5vbnltb3VzT2JzZXJ2YWJsZShmdW5jdGlvbiAob2JzZXJ2ZXIpIHtcbiAgICAgIHZhciBkID0gZHVlVGltZSwgcCA9IG5vcm1hbGl6ZVRpbWUocGVyaW9kKTtcbiAgICAgIHJldHVybiBzY2hlZHVsZXIuc2NoZWR1bGVSZWN1cnNpdmVGdXR1cmUoMCwgZCwgZnVuY3Rpb24gKGNvdW50LCBzZWxmKSB7XG4gICAgICAgIGlmIChwID4gMCkge1xuICAgICAgICAgIHZhciBub3cgPSBzY2hlZHVsZXIubm93KCk7XG4gICAgICAgICAgZCA9IG5ldyBEYXRlKGQuZ2V0VGltZSgpICsgcCk7XG4gICAgICAgICAgZC5nZXRUaW1lKCkgPD0gbm93ICYmIChkID0gbmV3IERhdGUobm93ICsgcCkpO1xuICAgICAgICB9XG4gICAgICAgIG9ic2VydmVyLm9uTmV4dChjb3VudCk7XG4gICAgICAgIHNlbGYoY291bnQgKyAxLCBuZXcgRGF0ZShkKSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG9ic2VydmFibGVUaW1lclRpbWVTcGFuQW5kUGVyaW9kKGR1ZVRpbWUsIHBlcmlvZCwgc2NoZWR1bGVyKSB7XG4gICAgcmV0dXJuIGR1ZVRpbWUgPT09IHBlcmlvZCA/XG4gICAgICBuZXcgQW5vbnltb3VzT2JzZXJ2YWJsZShmdW5jdGlvbiAob2JzZXJ2ZXIpIHtcbiAgICAgICAgcmV0dXJuIHNjaGVkdWxlci5zY2hlZHVsZVBlcmlvZGljKDAsIHBlcmlvZCwgZnVuY3Rpb24gKGNvdW50KSB7XG4gICAgICAgICAgb2JzZXJ2ZXIub25OZXh0KGNvdW50KTtcbiAgICAgICAgICByZXR1cm4gY291bnQgKyAxO1xuICAgICAgICB9KTtcbiAgICAgIH0pIDpcbiAgICAgIG9ic2VydmFibGVEZWZlcihmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBvYnNlcnZhYmxlVGltZXJEYXRlQW5kUGVyaW9kKG5ldyBEYXRlKHNjaGVkdWxlci5ub3coKSArIGR1ZVRpbWUpLCBwZXJpb2QsIHNjaGVkdWxlcik7XG4gICAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgUmV0dXJucyBhbiBvYnNlcnZhYmxlIHNlcXVlbmNlIHRoYXQgcHJvZHVjZXMgYSB2YWx1ZSBhZnRlciBlYWNoIHBlcmlvZC5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogIDEgLSByZXMgPSBSeC5PYnNlcnZhYmxlLmludGVydmFsKDEwMDApO1xuICAgKiAgMiAtIHJlcyA9IFJ4Lk9ic2VydmFibGUuaW50ZXJ2YWwoMTAwMCwgUnguU2NoZWR1bGVyLnRpbWVvdXQpO1xuICAgKlxuICAgKiBAcGFyYW0ge051bWJlcn0gcGVyaW9kIFBlcmlvZCBmb3IgcHJvZHVjaW5nIHRoZSB2YWx1ZXMgaW4gdGhlIHJlc3VsdGluZyBzZXF1ZW5jZSAoc3BlY2lmaWVkIGFzIGFuIGludGVnZXIgZGVub3RpbmcgbWlsbGlzZWNvbmRzKS5cbiAgICogQHBhcmFtIHtTY2hlZHVsZXJ9IFtzY2hlZHVsZXJdIFNjaGVkdWxlciB0byBydW4gdGhlIHRpbWVyIG9uLiBJZiBub3Qgc3BlY2lmaWVkLCBSeC5TY2hlZHVsZXIudGltZW91dCBpcyB1c2VkLlxuICAgKiBAcmV0dXJucyB7T2JzZXJ2YWJsZX0gQW4gb2JzZXJ2YWJsZSBzZXF1ZW5jZSB0aGF0IHByb2R1Y2VzIGEgdmFsdWUgYWZ0ZXIgZWFjaCBwZXJpb2QuXG4gICAqL1xuICB2YXIgb2JzZXJ2YWJsZWludGVydmFsID0gT2JzZXJ2YWJsZS5pbnRlcnZhbCA9IGZ1bmN0aW9uIChwZXJpb2QsIHNjaGVkdWxlcikge1xuICAgIHJldHVybiBvYnNlcnZhYmxlVGltZXJUaW1lU3BhbkFuZFBlcmlvZChwZXJpb2QsIHBlcmlvZCwgaXNTY2hlZHVsZXIoc2NoZWR1bGVyKSA/IHNjaGVkdWxlciA6IGRlZmF1bHRTY2hlZHVsZXIpO1xuICB9O1xuXG4gIC8qKlxuICAgKiAgUmV0dXJucyBhbiBvYnNlcnZhYmxlIHNlcXVlbmNlIHRoYXQgcHJvZHVjZXMgYSB2YWx1ZSBhZnRlciBkdWVUaW1lIGhhcyBlbGFwc2VkIGFuZCB0aGVuIGFmdGVyIGVhY2ggcGVyaW9kLlxuICAgKiBAcGFyYW0ge051bWJlcn0gZHVlVGltZSBBYnNvbHV0ZSAoc3BlY2lmaWVkIGFzIGEgRGF0ZSBvYmplY3QpIG9yIHJlbGF0aXZlIHRpbWUgKHNwZWNpZmllZCBhcyBhbiBpbnRlZ2VyIGRlbm90aW5nIG1pbGxpc2Vjb25kcykgYXQgd2hpY2ggdG8gcHJvZHVjZSB0aGUgZmlyc3QgdmFsdWUuXG4gICAqIEBwYXJhbSB7TWl4ZWR9IFtwZXJpb2RPclNjaGVkdWxlcl0gIFBlcmlvZCB0byBwcm9kdWNlIHN1YnNlcXVlbnQgdmFsdWVzIChzcGVjaWZpZWQgYXMgYW4gaW50ZWdlciBkZW5vdGluZyBtaWxsaXNlY29uZHMpLCBvciB0aGUgc2NoZWR1bGVyIHRvIHJ1biB0aGUgdGltZXIgb24uIElmIG5vdCBzcGVjaWZpZWQsIHRoZSByZXN1bHRpbmcgdGltZXIgaXMgbm90IHJlY3VycmluZy5cbiAgICogQHBhcmFtIHtTY2hlZHVsZXJ9IFtzY2hlZHVsZXJdICBTY2hlZHVsZXIgdG8gcnVuIHRoZSB0aW1lciBvbi4gSWYgbm90IHNwZWNpZmllZCwgdGhlIHRpbWVvdXQgc2NoZWR1bGVyIGlzIHVzZWQuXG4gICAqIEByZXR1cm5zIHtPYnNlcnZhYmxlfSBBbiBvYnNlcnZhYmxlIHNlcXVlbmNlIHRoYXQgcHJvZHVjZXMgYSB2YWx1ZSBhZnRlciBkdWUgdGltZSBoYXMgZWxhcHNlZCBhbmQgdGhlbiBlYWNoIHBlcmlvZC5cbiAgICovXG4gIHZhciBvYnNlcnZhYmxlVGltZXIgPSBPYnNlcnZhYmxlLnRpbWVyID0gZnVuY3Rpb24gKGR1ZVRpbWUsIHBlcmlvZE9yU2NoZWR1bGVyLCBzY2hlZHVsZXIpIHtcbiAgICB2YXIgcGVyaW9kO1xuICAgIGlzU2NoZWR1bGVyKHNjaGVkdWxlcikgfHwgKHNjaGVkdWxlciA9IGRlZmF1bHRTY2hlZHVsZXIpO1xuICAgIGlmIChwZXJpb2RPclNjaGVkdWxlciAhPSBudWxsICYmIHR5cGVvZiBwZXJpb2RPclNjaGVkdWxlciA9PT0gJ251bWJlcicpIHtcbiAgICAgIHBlcmlvZCA9IHBlcmlvZE9yU2NoZWR1bGVyO1xuICAgIH0gZWxzZSBpZiAoaXNTY2hlZHVsZXIocGVyaW9kT3JTY2hlZHVsZXIpKSB7XG4gICAgICBzY2hlZHVsZXIgPSBwZXJpb2RPclNjaGVkdWxlcjtcbiAgICB9XG4gICAgaWYgKChkdWVUaW1lIGluc3RhbmNlb2YgRGF0ZSB8fCB0eXBlb2YgZHVlVGltZSA9PT0gJ251bWJlcicpICYmIHBlcmlvZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gX29ic2VydmFibGVUaW1lcihkdWVUaW1lLCBzY2hlZHVsZXIpO1xuICAgIH1cbiAgICBpZiAoZHVlVGltZSBpbnN0YW5jZW9mIERhdGUgJiYgcGVyaW9kICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBvYnNlcnZhYmxlVGltZXJEYXRlQW5kUGVyaW9kKGR1ZVRpbWUsIHBlcmlvZE9yU2NoZWR1bGVyLCBzY2hlZHVsZXIpO1xuICAgIH1cbiAgICByZXR1cm4gb2JzZXJ2YWJsZVRpbWVyVGltZVNwYW5BbmRQZXJpb2QoZHVlVGltZSwgcGVyaW9kLCBzY2hlZHVsZXIpO1xuICB9O1xuXG4gIGZ1bmN0aW9uIG9ic2VydmFibGVEZWxheVJlbGF0aXZlKHNvdXJjZSwgZHVlVGltZSwgc2NoZWR1bGVyKSB7XG4gICAgcmV0dXJuIG5ldyBBbm9ueW1vdXNPYnNlcnZhYmxlKGZ1bmN0aW9uIChvKSB7XG4gICAgICB2YXIgYWN0aXZlID0gZmFsc2UsXG4gICAgICAgIGNhbmNlbGFibGUgPSBuZXcgU2VyaWFsRGlzcG9zYWJsZSgpLFxuICAgICAgICBleGNlcHRpb24gPSBudWxsLFxuICAgICAgICBxID0gW10sXG4gICAgICAgIHJ1bm5pbmcgPSBmYWxzZSxcbiAgICAgICAgc3Vic2NyaXB0aW9uO1xuICAgICAgc3Vic2NyaXB0aW9uID0gc291cmNlLm1hdGVyaWFsaXplKCkudGltZXN0YW1wKHNjaGVkdWxlcikuc3Vic2NyaWJlKGZ1bmN0aW9uIChub3RpZmljYXRpb24pIHtcbiAgICAgICAgdmFyIGQsIHNob3VsZFJ1bjtcbiAgICAgICAgaWYgKG5vdGlmaWNhdGlvbi52YWx1ZS5raW5kID09PSAnRScpIHtcbiAgICAgICAgICBxID0gW107XG4gICAgICAgICAgcS5wdXNoKG5vdGlmaWNhdGlvbik7XG4gICAgICAgICAgZXhjZXB0aW9uID0gbm90aWZpY2F0aW9uLnZhbHVlLmVycm9yO1xuICAgICAgICAgIHNob3VsZFJ1biA9ICFydW5uaW5nO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHEucHVzaCh7IHZhbHVlOiBub3RpZmljYXRpb24udmFsdWUsIHRpbWVzdGFtcDogbm90aWZpY2F0aW9uLnRpbWVzdGFtcCArIGR1ZVRpbWUgfSk7XG4gICAgICAgICAgc2hvdWxkUnVuID0gIWFjdGl2ZTtcbiAgICAgICAgICBhY3RpdmUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzaG91bGRSdW4pIHtcbiAgICAgICAgICBpZiAoZXhjZXB0aW9uICE9PSBudWxsKSB7XG4gICAgICAgICAgICBvLm9uRXJyb3IoZXhjZXB0aW9uKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZCA9IG5ldyBTaW5nbGVBc3NpZ25tZW50RGlzcG9zYWJsZSgpO1xuICAgICAgICAgICAgY2FuY2VsYWJsZS5zZXREaXNwb3NhYmxlKGQpO1xuICAgICAgICAgICAgZC5zZXREaXNwb3NhYmxlKHNjaGVkdWxlci5zY2hlZHVsZVJlY3Vyc2l2ZUZ1dHVyZShudWxsLCBkdWVUaW1lLCBmdW5jdGlvbiAoXywgc2VsZikge1xuICAgICAgICAgICAgICB2YXIgZSwgcmVjdXJzZUR1ZVRpbWUsIHJlc3VsdCwgc2hvdWxkUmVjdXJzZTtcbiAgICAgICAgICAgICAgaWYgKGV4Y2VwdGlvbiAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBydW5uaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgZG8ge1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IG51bGw7XG4gICAgICAgICAgICAgICAgaWYgKHEubGVuZ3RoID4gMCAmJiBxWzBdLnRpbWVzdGFtcCAtIHNjaGVkdWxlci5ub3coKSA8PSAwKSB7XG4gICAgICAgICAgICAgICAgICByZXN1bHQgPSBxLnNoaWZ0KCkudmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgIHJlc3VsdC5hY2NlcHQobyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IHdoaWxlIChyZXN1bHQgIT09IG51bGwpO1xuICAgICAgICAgICAgICBzaG91bGRSZWN1cnNlID0gZmFsc2U7XG4gICAgICAgICAgICAgIHJlY3Vyc2VEdWVUaW1lID0gMDtcbiAgICAgICAgICAgICAgaWYgKHEubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHNob3VsZFJlY3Vyc2UgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHJlY3Vyc2VEdWVUaW1lID0gTWF0aC5tYXgoMCwgcVswXS50aW1lc3RhbXAgLSBzY2hlZHVsZXIubm93KCkpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGUgPSBleGNlcHRpb247XG4gICAgICAgICAgICAgIHJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgaWYgKGUgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBvLm9uRXJyb3IoZSk7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoc2hvdWxkUmVjdXJzZSkge1xuICAgICAgICAgICAgICAgIHNlbGYobnVsbCwgcmVjdXJzZUR1ZVRpbWUpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBuZXcgQmluYXJ5RGlzcG9zYWJsZShzdWJzY3JpcHRpb24sIGNhbmNlbGFibGUpO1xuICAgIH0sIHNvdXJjZSk7XG4gIH1cblxuICBmdW5jdGlvbiBvYnNlcnZhYmxlRGVsYXlBYnNvbHV0ZShzb3VyY2UsIGR1ZVRpbWUsIHNjaGVkdWxlcikge1xuICAgIHJldHVybiBvYnNlcnZhYmxlRGVmZXIoZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIG9ic2VydmFibGVEZWxheVJlbGF0aXZlKHNvdXJjZSwgZHVlVGltZSAtIHNjaGVkdWxlci5ub3coKSwgc2NoZWR1bGVyKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGRlbGF5V2l0aFNlbGVjdG9yKHNvdXJjZSwgc3Vic2NyaXB0aW9uRGVsYXksIGRlbGF5RHVyYXRpb25TZWxlY3Rvcikge1xuICAgIHZhciBzdWJEZWxheSwgc2VsZWN0b3I7XG4gICAgaWYgKGlzRnVuY3Rpb24oc3Vic2NyaXB0aW9uRGVsYXkpKSB7XG4gICAgICBzZWxlY3RvciA9IHN1YnNjcmlwdGlvbkRlbGF5O1xuICAgIH0gZWxzZSB7XG4gICAgICBzdWJEZWxheSA9IHN1YnNjcmlwdGlvbkRlbGF5O1xuICAgICAgc2VsZWN0b3IgPSBkZWxheUR1cmF0aW9uU2VsZWN0b3I7XG4gICAgfVxuICAgIHJldHVybiBuZXcgQW5vbnltb3VzT2JzZXJ2YWJsZShmdW5jdGlvbiAobykge1xuICAgICAgdmFyIGRlbGF5cyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCksIGF0RW5kID0gZmFsc2UsIHN1YnNjcmlwdGlvbiA9IG5ldyBTZXJpYWxEaXNwb3NhYmxlKCk7XG5cbiAgICAgIGZ1bmN0aW9uIHN0YXJ0KCkge1xuICAgICAgICBzdWJzY3JpcHRpb24uc2V0RGlzcG9zYWJsZShzb3VyY2Uuc3Vic2NyaWJlKFxuICAgICAgICAgIGZ1bmN0aW9uICh4KSB7XG4gICAgICAgICAgICB2YXIgZGVsYXkgPSB0cnlDYXRjaChzZWxlY3RvcikoeCk7XG4gICAgICAgICAgICBpZiAoZGVsYXkgPT09IGVycm9yT2JqKSB7IHJldHVybiBvLm9uRXJyb3IoZGVsYXkuZSk7IH1cbiAgICAgICAgICAgIHZhciBkID0gbmV3IFNpbmdsZUFzc2lnbm1lbnREaXNwb3NhYmxlKCk7XG4gICAgICAgICAgICBkZWxheXMuYWRkKGQpO1xuICAgICAgICAgICAgZC5zZXREaXNwb3NhYmxlKGRlbGF5LnN1YnNjcmliZShcbiAgICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIG8ub25OZXh0KHgpO1xuICAgICAgICAgICAgICAgIGRlbGF5cy5yZW1vdmUoZCk7XG4gICAgICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBmdW5jdGlvbiAoZSkgeyBvLm9uRXJyb3IoZSk7IH0sXG4gICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBvLm9uTmV4dCh4KTtcbiAgICAgICAgICAgICAgICBkZWxheXMucmVtb3ZlKGQpO1xuICAgICAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKSk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBmdW5jdGlvbiAoZSkgeyBvLm9uRXJyb3IoZSk7IH0sXG4gICAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgYXRFbmQgPSB0cnVlO1xuICAgICAgICAgICAgc3Vic2NyaXB0aW9uLmRpc3Bvc2UoKTtcbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgICB9XG4gICAgICAgICkpO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBkb25lICgpIHtcbiAgICAgICAgYXRFbmQgJiYgZGVsYXlzLmxlbmd0aCA9PT0gMCAmJiBvLm9uQ29tcGxldGVkKCk7XG4gICAgICB9XG5cbiAgICAgIGlmICghc3ViRGVsYXkpIHtcbiAgICAgICAgc3RhcnQoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN1YnNjcmlwdGlvbi5zZXREaXNwb3NhYmxlKHN1YkRlbGF5LnN1YnNjcmliZShzdGFydCwgZnVuY3Rpb24gKGUpIHsgby5vbkVycm9yKGUpOyB9LCBzdGFydCkpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbmV3IEJpbmFyeURpc3Bvc2FibGUoc3Vic2NyaXB0aW9uLCBkZWxheXMpO1xuICAgIH0sIHNvdXJjZSk7XG4gIH1cblxuICAvKipcbiAgICogIFRpbWUgc2hpZnRzIHRoZSBvYnNlcnZhYmxlIHNlcXVlbmNlIGJ5IGR1ZVRpbWUuXG4gICAqICBUaGUgcmVsYXRpdmUgdGltZSBpbnRlcnZhbHMgYmV0d2VlbiB0aGUgdmFsdWVzIGFyZSBwcmVzZXJ2ZWQuXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBkdWVUaW1lIEFic29sdXRlIChzcGVjaWZpZWQgYXMgYSBEYXRlIG9iamVjdCkgb3IgcmVsYXRpdmUgdGltZSAoc3BlY2lmaWVkIGFzIGFuIGludGVnZXIgZGVub3RpbmcgbWlsbGlzZWNvbmRzKSBieSB3aGljaCB0byBzaGlmdCB0aGUgb2JzZXJ2YWJsZSBzZXF1ZW5jZS5cbiAgICogQHBhcmFtIHtTY2hlZHVsZXJ9IFtzY2hlZHVsZXJdIFNjaGVkdWxlciB0byBydW4gdGhlIGRlbGF5IHRpbWVycyBvbi4gSWYgbm90IHNwZWNpZmllZCwgdGhlIHRpbWVvdXQgc2NoZWR1bGVyIGlzIHVzZWQuXG4gICAqIEByZXR1cm5zIHtPYnNlcnZhYmxlfSBUaW1lLXNoaWZ0ZWQgc2VxdWVuY2UuXG4gICAqL1xuICBvYnNlcnZhYmxlUHJvdG8uZGVsYXkgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGZpcnN0QXJnID0gYXJndW1lbnRzWzBdO1xuICAgIGlmICh0eXBlb2YgZmlyc3RBcmcgPT09ICdudW1iZXInIHx8IGZpcnN0QXJnIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgICAgdmFyIGR1ZVRpbWUgPSBmaXJzdEFyZywgc2NoZWR1bGVyID0gYXJndW1lbnRzWzFdO1xuICAgICAgaXNTY2hlZHVsZXIoc2NoZWR1bGVyKSB8fCAoc2NoZWR1bGVyID0gZGVmYXVsdFNjaGVkdWxlcik7XG4gICAgICByZXR1cm4gZHVlVGltZSBpbnN0YW5jZW9mIERhdGUgP1xuICAgICAgICBvYnNlcnZhYmxlRGVsYXlBYnNvbHV0ZSh0aGlzLCBkdWVUaW1lLCBzY2hlZHVsZXIpIDpcbiAgICAgICAgb2JzZXJ2YWJsZURlbGF5UmVsYXRpdmUodGhpcywgZHVlVGltZSwgc2NoZWR1bGVyKTtcbiAgICB9IGVsc2UgaWYgKE9ic2VydmFibGUuaXNPYnNlcnZhYmxlKGZpcnN0QXJnKSB8fCBpc0Z1bmN0aW9uKGZpcnN0QXJnKSkge1xuICAgICAgcmV0dXJuIGRlbGF5V2l0aFNlbGVjdG9yKHRoaXMsIGZpcnN0QXJnLCBhcmd1bWVudHNbMV0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgYXJndW1lbnRzJyk7XG4gICAgfVxuICB9O1xuXG4gIHZhciBEZWJvdW5jZU9ic2VydmFibGUgPSAoZnVuY3Rpb24gKF9fc3VwZXJfXykge1xuICAgIGluaGVyaXRzKERlYm91bmNlT2JzZXJ2YWJsZSwgX19zdXBlcl9fKTtcbiAgICBmdW5jdGlvbiBEZWJvdW5jZU9ic2VydmFibGUoc291cmNlLCBkdCwgcykge1xuICAgICAgaXNTY2hlZHVsZXIocykgfHwgKHMgPSBkZWZhdWx0U2NoZWR1bGVyKTtcbiAgICAgIHRoaXMuc291cmNlID0gc291cmNlO1xuICAgICAgdGhpcy5fZHQgPSBkdDtcbiAgICAgIHRoaXMuX3MgPSBzO1xuICAgICAgX19zdXBlcl9fLmNhbGwodGhpcyk7XG4gICAgfVxuXG4gICAgRGVib3VuY2VPYnNlcnZhYmxlLnByb3RvdHlwZS5zdWJzY3JpYmVDb3JlID0gZnVuY3Rpb24gKG8pIHtcbiAgICAgIHZhciBjYW5jZWxhYmxlID0gbmV3IFNlcmlhbERpc3Bvc2FibGUoKTtcbiAgICAgIHJldHVybiBuZXcgQmluYXJ5RGlzcG9zYWJsZShcbiAgICAgICAgdGhpcy5zb3VyY2Uuc3Vic2NyaWJlKG5ldyBEZWJvdW5jZU9ic2VydmVyKG8sIHRoaXMuX2R0LCB0aGlzLl9zLCBjYW5jZWxhYmxlKSksXG4gICAgICAgIGNhbmNlbGFibGUpO1xuICAgIH07XG5cbiAgICByZXR1cm4gRGVib3VuY2VPYnNlcnZhYmxlO1xuICB9KE9ic2VydmFibGVCYXNlKSk7XG5cbiAgdmFyIERlYm91bmNlT2JzZXJ2ZXIgPSAoZnVuY3Rpb24gKF9fc3VwZXJfXykge1xuICAgIGluaGVyaXRzKERlYm91bmNlT2JzZXJ2ZXIsIF9fc3VwZXJfXyk7XG4gICAgZnVuY3Rpb24gRGVib3VuY2VPYnNlcnZlcihvYnNlcnZlciwgZHVlVGltZSwgc2NoZWR1bGVyLCBjYW5jZWxhYmxlKSB7XG4gICAgICB0aGlzLl9vID0gb2JzZXJ2ZXI7XG4gICAgICB0aGlzLl9kID0gZHVlVGltZTtcbiAgICAgIHRoaXMuX3NjaGVkdWxlciA9IHNjaGVkdWxlcjtcbiAgICAgIHRoaXMuX2MgPSBjYW5jZWxhYmxlO1xuICAgICAgdGhpcy5fdiA9IG51bGw7XG4gICAgICB0aGlzLl9odiA9IGZhbHNlO1xuICAgICAgdGhpcy5faWQgPSAwO1xuICAgICAgX19zdXBlcl9fLmNhbGwodGhpcyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2NoZWR1bGVGdXR1cmUocywgc3RhdGUpIHtcbiAgICAgIHN0YXRlLnNlbGYuX2h2ICYmIHN0YXRlLnNlbGYuX2lkID09PSBzdGF0ZS5jdXJyZW50SWQgJiYgc3RhdGUuc2VsZi5fby5vbk5leHQoc3RhdGUueCk7XG4gICAgICBzdGF0ZS5zZWxmLl9odiA9IGZhbHNlO1xuICAgIH1cblxuICAgIERlYm91bmNlT2JzZXJ2ZXIucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbiAoeCkge1xuICAgICAgdGhpcy5faHYgPSB0cnVlO1xuICAgICAgdGhpcy5fdiA9IHg7XG4gICAgICB2YXIgY3VycmVudElkID0gKyt0aGlzLl9pZCwgZCA9IG5ldyBTaW5nbGVBc3NpZ25tZW50RGlzcG9zYWJsZSgpO1xuICAgICAgdGhpcy5fYy5zZXREaXNwb3NhYmxlKGQpO1xuICAgICAgZC5zZXREaXNwb3NhYmxlKHRoaXMuX3NjaGVkdWxlci5zY2hlZHVsZUZ1dHVyZSh0aGlzLCB0aGlzLl9kLCBmdW5jdGlvbiAoXywgc2VsZikge1xuICAgICAgICBzZWxmLl9odiAmJiBzZWxmLl9pZCA9PT0gY3VycmVudElkICYmIHNlbGYuX28ub25OZXh0KHgpO1xuICAgICAgICBzZWxmLl9odiA9IGZhbHNlO1xuICAgICAgfSkpO1xuICAgIH07XG5cbiAgICBEZWJvdW5jZU9ic2VydmVyLnByb3RvdHlwZS5lcnJvciA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICB0aGlzLl9jLmRpc3Bvc2UoKTtcbiAgICAgIHRoaXMuX28ub25FcnJvcihlKTtcbiAgICAgIHRoaXMuX2h2ID0gZmFsc2U7XG4gICAgICB0aGlzLl9pZCsrO1xuICAgIH07XG5cbiAgICBEZWJvdW5jZU9ic2VydmVyLnByb3RvdHlwZS5jb21wbGV0ZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLl9jLmRpc3Bvc2UoKTtcbiAgICAgIHRoaXMuX2h2ICYmIHRoaXMuX28ub25OZXh0KHRoaXMuX3YpO1xuICAgICAgdGhpcy5fby5vbkNvbXBsZXRlZCgpO1xuICAgICAgdGhpcy5faHYgPSBmYWxzZTtcbiAgICAgIHRoaXMuX2lkKys7XG4gICAgfTtcblxuICAgIHJldHVybiBEZWJvdW5jZU9ic2VydmVyO1xuICB9KEFic3RyYWN0T2JzZXJ2ZXIpKTtcblxuICBmdW5jdGlvbiBkZWJvdW5jZVdpdGhTZWxlY3Rvcihzb3VyY2UsIGR1cmF0aW9uU2VsZWN0b3IpIHtcbiAgICByZXR1cm4gbmV3IEFub255bW91c09ic2VydmFibGUoZnVuY3Rpb24gKG8pIHtcbiAgICAgIHZhciB2YWx1ZSwgaGFzVmFsdWUgPSBmYWxzZSwgY2FuY2VsYWJsZSA9IG5ldyBTZXJpYWxEaXNwb3NhYmxlKCksIGlkID0gMDtcbiAgICAgIHZhciBzdWJzY3JpcHRpb24gPSBzb3VyY2Uuc3Vic2NyaWJlKFxuICAgICAgICBmdW5jdGlvbiAoeCkge1xuICAgICAgICAgIHZhciB0aHJvdHRsZSA9IHRyeUNhdGNoKGR1cmF0aW9uU2VsZWN0b3IpKHgpO1xuICAgICAgICAgIGlmICh0aHJvdHRsZSA9PT0gZXJyb3JPYmopIHsgcmV0dXJuIG8ub25FcnJvcih0aHJvdHRsZS5lKTsgfVxuXG4gICAgICAgICAgaXNQcm9taXNlKHRocm90dGxlKSAmJiAodGhyb3R0bGUgPSBvYnNlcnZhYmxlRnJvbVByb21pc2UodGhyb3R0bGUpKTtcblxuICAgICAgICAgIGhhc1ZhbHVlID0gdHJ1ZTtcbiAgICAgICAgICB2YWx1ZSA9IHg7XG4gICAgICAgICAgaWQrKztcbiAgICAgICAgICB2YXIgY3VycmVudGlkID0gaWQsIGQgPSBuZXcgU2luZ2xlQXNzaWdubWVudERpc3Bvc2FibGUoKTtcbiAgICAgICAgICBjYW5jZWxhYmxlLnNldERpc3Bvc2FibGUoZCk7XG4gICAgICAgICAgZC5zZXREaXNwb3NhYmxlKHRocm90dGxlLnN1YnNjcmliZShcbiAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgaGFzVmFsdWUgJiYgaWQgPT09IGN1cnJlbnRpZCAmJiBvLm9uTmV4dCh2YWx1ZSk7XG4gICAgICAgICAgICAgIGhhc1ZhbHVlID0gZmFsc2U7XG4gICAgICAgICAgICAgIGQuZGlzcG9zZSgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChlKSB7IG8ub25FcnJvcihlKTsgfSxcbiAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgaGFzVmFsdWUgJiYgaWQgPT09IGN1cnJlbnRpZCAmJiBvLm9uTmV4dCh2YWx1ZSk7XG4gICAgICAgICAgICAgIGhhc1ZhbHVlID0gZmFsc2U7XG4gICAgICAgICAgICAgIGQuZGlzcG9zZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICkpO1xuICAgICAgICB9LFxuICAgICAgICBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgIGNhbmNlbGFibGUuZGlzcG9zZSgpO1xuICAgICAgICAgIG8ub25FcnJvcihlKTtcbiAgICAgICAgICBoYXNWYWx1ZSA9IGZhbHNlO1xuICAgICAgICAgIGlkKys7XG4gICAgICAgIH0sXG4gICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBjYW5jZWxhYmxlLmRpc3Bvc2UoKTtcbiAgICAgICAgICBoYXNWYWx1ZSAmJiBvLm9uTmV4dCh2YWx1ZSk7XG4gICAgICAgICAgby5vbkNvbXBsZXRlZCgpO1xuICAgICAgICAgIGhhc1ZhbHVlID0gZmFsc2U7XG4gICAgICAgICAgaWQrKztcbiAgICAgICAgfVxuICAgICAgKTtcbiAgICAgIHJldHVybiBuZXcgQmluYXJ5RGlzcG9zYWJsZShzdWJzY3JpcHRpb24sIGNhbmNlbGFibGUpO1xuICAgIH0sIHNvdXJjZSk7XG4gIH1cblxuICBvYnNlcnZhYmxlUHJvdG8uZGVib3VuY2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKGlzRnVuY3Rpb24gKGFyZ3VtZW50c1swXSkpIHtcbiAgICAgIHJldHVybiBkZWJvdW5jZVdpdGhTZWxlY3Rvcih0aGlzLCBhcmd1bWVudHNbMF0pO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGFyZ3VtZW50c1swXSA9PT0gJ251bWJlcicpIHtcbiAgICAgIHJldHVybiBuZXcgRGVib3VuY2VPYnNlcnZhYmxlKHRoaXMsIGFyZ3VtZW50c1swXSwgYXJndW1lbnRzWzFdKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGFyZ3VtZW50cycpO1xuICAgIH1cbiAgfTtcblxuICB2YXIgVGltZXN0YW1wT2JzZXJ2YWJsZSA9IChmdW5jdGlvbiAoX19zdXBlcl9fKSB7XG4gICAgaW5oZXJpdHMoVGltZXN0YW1wT2JzZXJ2YWJsZSwgX19zdXBlcl9fKTtcbiAgICBmdW5jdGlvbiBUaW1lc3RhbXBPYnNlcnZhYmxlKHNvdXJjZSwgcykge1xuICAgICAgdGhpcy5zb3VyY2UgPSBzb3VyY2U7XG4gICAgICB0aGlzLl9zID0gcztcbiAgICAgIF9fc3VwZXJfXy5jYWxsKHRoaXMpO1xuICAgIH1cblxuICAgIFRpbWVzdGFtcE9ic2VydmFibGUucHJvdG90eXBlLnN1YnNjcmliZUNvcmUgPSBmdW5jdGlvbiAobykge1xuICAgICAgcmV0dXJuIHRoaXMuc291cmNlLnN1YnNjcmliZShuZXcgVGltZXN0YW1wT2JzZXJ2ZXIobywgdGhpcy5fcykpO1xuICAgIH07XG5cbiAgICByZXR1cm4gVGltZXN0YW1wT2JzZXJ2YWJsZTtcbiAgfShPYnNlcnZhYmxlQmFzZSkpO1xuXG4gIHZhciBUaW1lc3RhbXBPYnNlcnZlciA9IChmdW5jdGlvbiAoX19zdXBlcl9fKSB7XG4gICAgaW5oZXJpdHMoVGltZXN0YW1wT2JzZXJ2ZXIsIF9fc3VwZXJfXyk7XG4gICAgZnVuY3Rpb24gVGltZXN0YW1wT2JzZXJ2ZXIobywgcykge1xuICAgICAgdGhpcy5fbyA9IG87XG4gICAgICB0aGlzLl9zID0gcztcbiAgICAgIF9fc3VwZXJfXy5jYWxsKHRoaXMpO1xuICAgIH1cblxuICAgIFRpbWVzdGFtcE9ic2VydmVyLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24gKHgpIHtcbiAgICAgIHRoaXMuX28ub25OZXh0KHsgdmFsdWU6IHgsIHRpbWVzdGFtcDogdGhpcy5fcy5ub3coKSB9KTtcbiAgICB9O1xuXG4gICAgVGltZXN0YW1wT2JzZXJ2ZXIucHJvdG90eXBlLmVycm9yID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgIHRoaXMuX28ub25FcnJvcihlKTtcbiAgICB9O1xuXG4gICAgVGltZXN0YW1wT2JzZXJ2ZXIucHJvdG90eXBlLmNvbXBsZXRlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuX28ub25Db21wbGV0ZWQoKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIFRpbWVzdGFtcE9ic2VydmVyO1xuICB9KEFic3RyYWN0T2JzZXJ2ZXIpKTtcblxuICAvKipcbiAgICogIFJlY29yZHMgdGhlIHRpbWVzdGFtcCBmb3IgZWFjaCB2YWx1ZSBpbiBhbiBvYnNlcnZhYmxlIHNlcXVlbmNlLlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiAgMSAtIHJlcyA9IHNvdXJjZS50aW1lc3RhbXAoKTsgLy8gcHJvZHVjZXMgeyB2YWx1ZTogeCwgdGltZXN0YW1wOiB0cyB9XG4gICAqICAyIC0gcmVzID0gc291cmNlLnRpbWVzdGFtcChSeC5TY2hlZHVsZXIuZGVmYXVsdCk7XG4gICAqXG4gICAqIEBwYXJhbSB7U2NoZWR1bGVyfSBbc2NoZWR1bGVyXSAgU2NoZWR1bGVyIHVzZWQgdG8gY29tcHV0ZSB0aW1lc3RhbXBzLiBJZiBub3Qgc3BlY2lmaWVkLCB0aGUgZGVmYXVsdCBzY2hlZHVsZXIgaXMgdXNlZC5cbiAgICogQHJldHVybnMge09ic2VydmFibGV9IEFuIG9ic2VydmFibGUgc2VxdWVuY2Ugd2l0aCB0aW1lc3RhbXAgaW5mb3JtYXRpb24gb24gdmFsdWVzLlxuICAgKi9cbiAgb2JzZXJ2YWJsZVByb3RvLnRpbWVzdGFtcCA9IGZ1bmN0aW9uIChzY2hlZHVsZXIpIHtcbiAgICBpc1NjaGVkdWxlcihzY2hlZHVsZXIpIHx8IChzY2hlZHVsZXIgPSBkZWZhdWx0U2NoZWR1bGVyKTtcbiAgICByZXR1cm4gbmV3IFRpbWVzdGFtcE9ic2VydmFibGUodGhpcywgc2NoZWR1bGVyKTtcbiAgfTtcblxuICB2YXIgU2FtcGxlT2JzZXJ2YWJsZSA9IChmdW5jdGlvbihfX3N1cGVyX18pIHtcbiAgICBpbmhlcml0cyhTYW1wbGVPYnNlcnZhYmxlLCBfX3N1cGVyX18pO1xuICAgIGZ1bmN0aW9uIFNhbXBsZU9ic2VydmFibGUoc291cmNlLCBzYW1wbGVyKSB7XG4gICAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcbiAgICAgIHRoaXMuX3NhbXBsZXIgPSBzYW1wbGVyO1xuICAgICAgX19zdXBlcl9fLmNhbGwodGhpcyk7XG4gICAgfVxuXG4gICAgU2FtcGxlT2JzZXJ2YWJsZS5wcm90b3R5cGUuc3Vic2NyaWJlQ29yZSA9IGZ1bmN0aW9uIChvKSB7XG4gICAgICB2YXIgc3RhdGUgPSB7XG4gICAgICAgIG86IG8sXG4gICAgICAgIGF0RW5kOiBmYWxzZSxcbiAgICAgICAgdmFsdWU6IG51bGwsXG4gICAgICAgIGhhc1ZhbHVlOiBmYWxzZSxcbiAgICAgICAgc291cmNlU3Vic2NyaXB0aW9uOiBuZXcgU2luZ2xlQXNzaWdubWVudERpc3Bvc2FibGUoKVxuICAgICAgfTtcblxuICAgICAgc3RhdGUuc291cmNlU3Vic2NyaXB0aW9uLnNldERpc3Bvc2FibGUodGhpcy5zb3VyY2Uuc3Vic2NyaWJlKG5ldyBTYW1wbGVTb3VyY2VPYnNlcnZlcihzdGF0ZSkpKTtcbiAgICAgIHJldHVybiBuZXcgQmluYXJ5RGlzcG9zYWJsZShcbiAgICAgICAgc3RhdGUuc291cmNlU3Vic2NyaXB0aW9uLFxuICAgICAgICB0aGlzLl9zYW1wbGVyLnN1YnNjcmliZShuZXcgU2FtcGxlck9ic2VydmVyKHN0YXRlKSlcbiAgICAgICk7XG4gICAgfTtcblxuICAgIHJldHVybiBTYW1wbGVPYnNlcnZhYmxlO1xuICB9KE9ic2VydmFibGVCYXNlKSk7XG5cbiAgdmFyIFNhbXBsZXJPYnNlcnZlciA9IChmdW5jdGlvbihfX3N1cGVyX18pIHtcbiAgICBpbmhlcml0cyhTYW1wbGVyT2JzZXJ2ZXIsIF9fc3VwZXJfXyk7XG4gICAgZnVuY3Rpb24gU2FtcGxlck9ic2VydmVyKHMpIHtcbiAgICAgIHRoaXMuX3MgPSBzO1xuICAgICAgX19zdXBlcl9fLmNhbGwodGhpcyk7XG4gICAgfVxuXG4gICAgU2FtcGxlck9ic2VydmVyLnByb3RvdHlwZS5faGFuZGxlTWVzc2FnZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICh0aGlzLl9zLmhhc1ZhbHVlKSB7XG4gICAgICAgIHRoaXMuX3MuaGFzVmFsdWUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fcy5vLm9uTmV4dCh0aGlzLl9zLnZhbHVlKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX3MuYXRFbmQgJiYgdGhpcy5fcy5vLm9uQ29tcGxldGVkKCk7XG4gICAgfTtcblxuICAgIFNhbXBsZXJPYnNlcnZlci5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uICgpIHsgdGhpcy5faGFuZGxlTWVzc2FnZSgpOyB9O1xuICAgIFNhbXBsZXJPYnNlcnZlci5wcm90b3R5cGUuZXJyb3IgPSBmdW5jdGlvbiAoZSkgeyB0aGlzLl9zLm9uRXJyb3IoZSk7IH07XG4gICAgU2FtcGxlck9ic2VydmVyLnByb3RvdHlwZS5jb21wbGV0ZWQgPSBmdW5jdGlvbiAoKSB7IHRoaXMuX2hhbmRsZU1lc3NhZ2UoKTsgfTtcblxuICAgIHJldHVybiBTYW1wbGVyT2JzZXJ2ZXI7XG4gIH0oQWJzdHJhY3RPYnNlcnZlcikpO1xuXG4gIHZhciBTYW1wbGVTb3VyY2VPYnNlcnZlciA9IChmdW5jdGlvbihfX3N1cGVyX18pIHtcbiAgICBpbmhlcml0cyhTYW1wbGVTb3VyY2VPYnNlcnZlciwgX19zdXBlcl9fKTtcbiAgICBmdW5jdGlvbiBTYW1wbGVTb3VyY2VPYnNlcnZlcihzKSB7XG4gICAgICB0aGlzLl9zID0gcztcbiAgICAgIF9fc3VwZXJfXy5jYWxsKHRoaXMpO1xuICAgIH1cblxuICAgIFNhbXBsZVNvdXJjZU9ic2VydmVyLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24gKHgpIHtcbiAgICAgIHRoaXMuX3MuaGFzVmFsdWUgPSB0cnVlO1xuICAgICAgdGhpcy5fcy52YWx1ZSA9IHg7XG4gICAgfTtcbiAgICBTYW1wbGVTb3VyY2VPYnNlcnZlci5wcm90b3R5cGUuZXJyb3IgPSBmdW5jdGlvbiAoZSkgeyB0aGlzLl9zLm8ub25FcnJvcihlKTsgfTtcbiAgICBTYW1wbGVTb3VyY2VPYnNlcnZlci5wcm90b3R5cGUuY29tcGxldGVkID0gZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5fcy5hdEVuZCA9IHRydWU7XG4gICAgICB0aGlzLl9zLnNvdXJjZVN1YnNjcmlwdGlvbi5kaXNwb3NlKCk7XG4gICAgfTtcblxuICAgIHJldHVybiBTYW1wbGVTb3VyY2VPYnNlcnZlcjtcbiAgfShBYnN0cmFjdE9ic2VydmVyKSk7XG5cbiAgLyoqXG4gICAqICBTYW1wbGVzIHRoZSBvYnNlcnZhYmxlIHNlcXVlbmNlIGF0IGVhY2ggaW50ZXJ2YWwuXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqICAxIC0gcmVzID0gc291cmNlLnNhbXBsZShzYW1wbGVPYnNlcnZhYmxlKTsgLy8gU2FtcGxlciB0aWNrIHNlcXVlbmNlXG4gICAqICAyIC0gcmVzID0gc291cmNlLnNhbXBsZSg1MDAwKTsgLy8gNSBzZWNvbmRzXG4gICAqICAyIC0gcmVzID0gc291cmNlLnNhbXBsZSg1MDAwLCBSeC5TY2hlZHVsZXIudGltZW91dCk7IC8vIDUgc2Vjb25kc1xuICAgKlxuICAgKiBAcGFyYW0ge01peGVkfSBpbnRlcnZhbE9yU2FtcGxlciBJbnRlcnZhbCBhdCB3aGljaCB0byBzYW1wbGUgKHNwZWNpZmllZCBhcyBhbiBpbnRlZ2VyIGRlbm90aW5nIG1pbGxpc2Vjb25kcykgb3IgU2FtcGxlciBPYnNlcnZhYmxlLlxuICAgKiBAcGFyYW0ge1NjaGVkdWxlcn0gW3NjaGVkdWxlcl0gIFNjaGVkdWxlciB0byBydW4gdGhlIHNhbXBsaW5nIHRpbWVyIG9uLiBJZiBub3Qgc3BlY2lmaWVkLCB0aGUgdGltZW91dCBzY2hlZHVsZXIgaXMgdXNlZC5cbiAgICogQHJldHVybnMge09ic2VydmFibGV9IFNhbXBsZWQgb2JzZXJ2YWJsZSBzZXF1ZW5jZS5cbiAgICovXG4gIG9ic2VydmFibGVQcm90by5zYW1wbGUgPSBmdW5jdGlvbiAoaW50ZXJ2YWxPclNhbXBsZXIsIHNjaGVkdWxlcikge1xuICAgIGlzU2NoZWR1bGVyKHNjaGVkdWxlcikgfHwgKHNjaGVkdWxlciA9IGRlZmF1bHRTY2hlZHVsZXIpO1xuICAgIHJldHVybiB0eXBlb2YgaW50ZXJ2YWxPclNhbXBsZXIgPT09ICdudW1iZXInID9cbiAgICAgIG5ldyBTYW1wbGVPYnNlcnZhYmxlKHRoaXMsIG9ic2VydmFibGVpbnRlcnZhbChpbnRlcnZhbE9yU2FtcGxlciwgc2NoZWR1bGVyKSkgOlxuICAgICAgbmV3IFNhbXBsZU9ic2VydmFibGUodGhpcywgaW50ZXJ2YWxPclNhbXBsZXIpO1xuICB9O1xuXG4gIHZhciBUaW1lb3V0RXJyb3IgPSBSeC5UaW1lb3V0RXJyb3IgPSBmdW5jdGlvbihtZXNzYWdlKSB7XG4gICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZSB8fCAnVGltZW91dCBoYXMgb2NjdXJyZWQnO1xuICAgIHRoaXMubmFtZSA9ICdUaW1lb3V0RXJyb3InO1xuICAgIEVycm9yLmNhbGwodGhpcyk7XG4gIH07XG4gIFRpbWVvdXRFcnJvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEVycm9yLnByb3RvdHlwZSk7XG5cbiAgZnVuY3Rpb24gdGltZW91dFdpdGhTZWxlY3Rvcihzb3VyY2UsIGZpcnN0VGltZW91dCwgdGltZW91dER1cmF0aW9uU2VsZWN0b3IsIG90aGVyKSB7XG4gICAgaWYgKGlzRnVuY3Rpb24oZmlyc3RUaW1lb3V0KSkge1xuICAgICAgb3RoZXIgPSB0aW1lb3V0RHVyYXRpb25TZWxlY3RvcjtcbiAgICAgIHRpbWVvdXREdXJhdGlvblNlbGVjdG9yID0gZmlyc3RUaW1lb3V0O1xuICAgICAgZmlyc3RUaW1lb3V0ID0gb2JzZXJ2YWJsZU5ldmVyKCk7XG4gICAgfVxuICAgIE9ic2VydmFibGUuaXNPYnNlcnZhYmxlKG90aGVyKSB8fCAob3RoZXIgPSBvYnNlcnZhYmxlVGhyb3cobmV3IFRpbWVvdXRFcnJvcigpKSk7XG4gICAgcmV0dXJuIG5ldyBBbm9ueW1vdXNPYnNlcnZhYmxlKGZ1bmN0aW9uIChvKSB7XG4gICAgICB2YXIgc3Vic2NyaXB0aW9uID0gbmV3IFNlcmlhbERpc3Bvc2FibGUoKSxcbiAgICAgICAgdGltZXIgPSBuZXcgU2VyaWFsRGlzcG9zYWJsZSgpLFxuICAgICAgICBvcmlnaW5hbCA9IG5ldyBTaW5nbGVBc3NpZ25tZW50RGlzcG9zYWJsZSgpO1xuXG4gICAgICBzdWJzY3JpcHRpb24uc2V0RGlzcG9zYWJsZShvcmlnaW5hbCk7XG5cbiAgICAgIHZhciBpZCA9IDAsIHN3aXRjaGVkID0gZmFsc2U7XG5cbiAgICAgIGZ1bmN0aW9uIHNldFRpbWVyKHRpbWVvdXQpIHtcbiAgICAgICAgdmFyIG15SWQgPSBpZCwgZCA9IG5ldyBTaW5nbGVBc3NpZ25tZW50RGlzcG9zYWJsZSgpO1xuXG4gICAgICAgIGZ1bmN0aW9uIHRpbWVyV2lucygpIHtcbiAgICAgICAgICBzd2l0Y2hlZCA9IChteUlkID09PSBpZCk7XG4gICAgICAgICAgcmV0dXJuIHN3aXRjaGVkO1xuICAgICAgICB9XG5cbiAgICAgICAgdGltZXIuc2V0RGlzcG9zYWJsZShkKTtcbiAgICAgICAgZC5zZXREaXNwb3NhYmxlKHRpbWVvdXQuc3Vic2NyaWJlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB0aW1lcldpbnMoKSAmJiBzdWJzY3JpcHRpb24uc2V0RGlzcG9zYWJsZShvdGhlci5zdWJzY3JpYmUobykpO1xuICAgICAgICAgIGQuZGlzcG9zZSgpO1xuICAgICAgICB9LCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgIHRpbWVyV2lucygpICYmIG8ub25FcnJvcihlKTtcbiAgICAgICAgfSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHRpbWVyV2lucygpICYmIHN1YnNjcmlwdGlvbi5zZXREaXNwb3NhYmxlKG90aGVyLnN1YnNjcmliZShvKSk7XG4gICAgICAgIH0pKTtcbiAgICAgIH07XG5cbiAgICAgIHNldFRpbWVyKGZpcnN0VGltZW91dCk7XG5cbiAgICAgIGZ1bmN0aW9uIG9XaW5zKCkge1xuICAgICAgICB2YXIgcmVzID0gIXN3aXRjaGVkO1xuICAgICAgICBpZiAocmVzKSB7IGlkKys7IH1cbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgIH1cblxuICAgICAgb3JpZ2luYWwuc2V0RGlzcG9zYWJsZShzb3VyY2Uuc3Vic2NyaWJlKGZ1bmN0aW9uICh4KSB7XG4gICAgICAgIGlmIChvV2lucygpKSB7XG4gICAgICAgICAgby5vbk5leHQoeCk7XG4gICAgICAgICAgdmFyIHRpbWVvdXQgPSB0cnlDYXRjaCh0aW1lb3V0RHVyYXRpb25TZWxlY3RvcikoeCk7XG4gICAgICAgICAgaWYgKHRpbWVvdXQgPT09IGVycm9yT2JqKSB7IHJldHVybiBvLm9uRXJyb3IodGltZW91dC5lKTsgfVxuICAgICAgICAgIHNldFRpbWVyKGlzUHJvbWlzZSh0aW1lb3V0KSA/IG9ic2VydmFibGVGcm9tUHJvbWlzZSh0aW1lb3V0KSA6IHRpbWVvdXQpO1xuICAgICAgICB9XG4gICAgICB9LCBmdW5jdGlvbiAoZSkge1xuICAgICAgICBvV2lucygpICYmIG8ub25FcnJvcihlKTtcbiAgICAgIH0sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgb1dpbnMoKSAmJiBvLm9uQ29tcGxldGVkKCk7XG4gICAgICB9KSk7XG4gICAgICByZXR1cm4gbmV3IEJpbmFyeURpc3Bvc2FibGUoc3Vic2NyaXB0aW9uLCB0aW1lcik7XG4gICAgfSwgc291cmNlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHRpbWVvdXQoc291cmNlLCBkdWVUaW1lLCBvdGhlciwgc2NoZWR1bGVyKSB7XG4gICAgaWYgKGlzU2NoZWR1bGVyKG90aGVyKSkge1xuICAgICAgc2NoZWR1bGVyID0gb3RoZXI7XG4gICAgICBvdGhlciA9IG9ic2VydmFibGVUaHJvdyhuZXcgVGltZW91dEVycm9yKCkpO1xuICAgIH1cbiAgICBpZiAob3RoZXIgaW5zdGFuY2VvZiBFcnJvcikgeyBvdGhlciA9IG9ic2VydmFibGVUaHJvdyhvdGhlcik7IH1cbiAgICBpc1NjaGVkdWxlcihzY2hlZHVsZXIpIHx8IChzY2hlZHVsZXIgPSBkZWZhdWx0U2NoZWR1bGVyKTtcbiAgICBPYnNlcnZhYmxlLmlzT2JzZXJ2YWJsZShvdGhlcikgfHwgKG90aGVyID0gb2JzZXJ2YWJsZVRocm93KG5ldyBUaW1lb3V0RXJyb3IoKSkpO1xuICAgIHJldHVybiBuZXcgQW5vbnltb3VzT2JzZXJ2YWJsZShmdW5jdGlvbiAobykge1xuICAgICAgdmFyIGlkID0gMCxcbiAgICAgICAgb3JpZ2luYWwgPSBuZXcgU2luZ2xlQXNzaWdubWVudERpc3Bvc2FibGUoKSxcbiAgICAgICAgc3Vic2NyaXB0aW9uID0gbmV3IFNlcmlhbERpc3Bvc2FibGUoKSxcbiAgICAgICAgc3dpdGNoZWQgPSBmYWxzZSxcbiAgICAgICAgdGltZXIgPSBuZXcgU2VyaWFsRGlzcG9zYWJsZSgpO1xuXG4gICAgICBzdWJzY3JpcHRpb24uc2V0RGlzcG9zYWJsZShvcmlnaW5hbCk7XG5cbiAgICAgIGZ1bmN0aW9uIGNyZWF0ZVRpbWVyKCkge1xuICAgICAgICB2YXIgbXlJZCA9IGlkO1xuICAgICAgICB0aW1lci5zZXREaXNwb3NhYmxlKHNjaGVkdWxlci5zY2hlZHVsZUZ1dHVyZShudWxsLCBkdWVUaW1lLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgc3dpdGNoZWQgPSBpZCA9PT0gbXlJZDtcbiAgICAgICAgICBpZiAoc3dpdGNoZWQpIHtcbiAgICAgICAgICAgIGlzUHJvbWlzZShvdGhlcikgJiYgKG90aGVyID0gb2JzZXJ2YWJsZUZyb21Qcm9taXNlKG90aGVyKSk7XG4gICAgICAgICAgICBzdWJzY3JpcHRpb24uc2V0RGlzcG9zYWJsZShvdGhlci5zdWJzY3JpYmUobykpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSkpO1xuICAgICAgfVxuXG4gICAgICBjcmVhdGVUaW1lcigpO1xuXG4gICAgICBvcmlnaW5hbC5zZXREaXNwb3NhYmxlKHNvdXJjZS5zdWJzY3JpYmUoZnVuY3Rpb24gKHgpIHtcbiAgICAgICAgaWYgKCFzd2l0Y2hlZCkge1xuICAgICAgICAgIGlkKys7XG4gICAgICAgICAgby5vbk5leHQoeCk7XG4gICAgICAgICAgY3JlYXRlVGltZXIoKTtcbiAgICAgICAgfVxuICAgICAgfSwgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgaWYgKCFzd2l0Y2hlZCkge1xuICAgICAgICAgIGlkKys7XG4gICAgICAgICAgby5vbkVycm9yKGUpO1xuICAgICAgICB9XG4gICAgICB9LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghc3dpdGNoZWQpIHtcbiAgICAgICAgICBpZCsrO1xuICAgICAgICAgIG8ub25Db21wbGV0ZWQoKTtcbiAgICAgICAgfVxuICAgICAgfSkpO1xuICAgICAgcmV0dXJuIG5ldyBCaW5hcnlEaXNwb3NhYmxlKHN1YnNjcmlwdGlvbiwgdGltZXIpO1xuICAgIH0sIHNvdXJjZSk7XG4gIH1cblxuICBvYnNlcnZhYmxlUHJvdG8udGltZW91dCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZmlyc3RBcmcgPSBhcmd1bWVudHNbMF07XG4gICAgaWYgKGZpcnN0QXJnIGluc3RhbmNlb2YgRGF0ZSB8fCB0eXBlb2YgZmlyc3RBcmcgPT09ICdudW1iZXInKSB7XG4gICAgICByZXR1cm4gdGltZW91dCh0aGlzLCBmaXJzdEFyZywgYXJndW1lbnRzWzFdLCBhcmd1bWVudHNbMl0pO1xuICAgIH0gZWxzZSBpZiAoT2JzZXJ2YWJsZS5pc09ic2VydmFibGUoZmlyc3RBcmcpIHx8IGlzRnVuY3Rpb24oZmlyc3RBcmcpKSB7XG4gICAgICByZXR1cm4gdGltZW91dFdpdGhTZWxlY3Rvcih0aGlzLCBmaXJzdEFyZywgYXJndW1lbnRzWzFdLCBhcmd1bWVudHNbMl0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgYXJndW1lbnRzJyk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFuIE9ic2VydmFibGUgdGhhdCBlbWl0cyBvbmx5IHRoZSBmaXJzdCBpdGVtIGVtaXR0ZWQgYnkgdGhlIHNvdXJjZSBPYnNlcnZhYmxlIGR1cmluZyBzZXF1ZW50aWFsIHRpbWUgd2luZG93cyBvZiBhIHNwZWNpZmllZCBkdXJhdGlvbi5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHdpbmRvd0R1cmF0aW9uIHRpbWUgdG8gd2FpdCBiZWZvcmUgZW1pdHRpbmcgYW5vdGhlciBpdGVtIGFmdGVyIGVtaXR0aW5nIHRoZSBsYXN0IGl0ZW1cbiAgICogQHBhcmFtIHtTY2hlZHVsZXJ9IFtzY2hlZHVsZXJdIHRoZSBTY2hlZHVsZXIgdG8gdXNlIGludGVybmFsbHkgdG8gbWFuYWdlIHRoZSB0aW1lcnMgdGhhdCBoYW5kbGUgdGltZW91dCBmb3IgZWFjaCBpdGVtLiBJZiBub3QgcHJvdmlkZWQsIGRlZmF1bHRzIHRvIFNjaGVkdWxlci50aW1lb3V0LlxuICAgKiBAcmV0dXJucyB7T2JzZXJ2YWJsZX0gQW4gT2JzZXJ2YWJsZSB0aGF0IHBlcmZvcm1zIHRoZSB0aHJvdHRsZSBvcGVyYXRpb24uXG4gICAqL1xuICBvYnNlcnZhYmxlUHJvdG8udGhyb3R0bGUgPSBmdW5jdGlvbiAod2luZG93RHVyYXRpb24sIHNjaGVkdWxlcikge1xuICAgIGlzU2NoZWR1bGVyKHNjaGVkdWxlcikgfHwgKHNjaGVkdWxlciA9IGRlZmF1bHRTY2hlZHVsZXIpO1xuICAgIHZhciBkdXJhdGlvbiA9ICt3aW5kb3dEdXJhdGlvbiB8fCAwO1xuICAgIGlmIChkdXJhdGlvbiA8PSAwKSB7IHRocm93IG5ldyBSYW5nZUVycm9yKCd3aW5kb3dEdXJhdGlvbiBjYW5ub3QgYmUgbGVzcyBvciBlcXVhbCB6ZXJvLicpOyB9XG4gICAgdmFyIHNvdXJjZSA9IHRoaXM7XG4gICAgcmV0dXJuIG5ldyBBbm9ueW1vdXNPYnNlcnZhYmxlKGZ1bmN0aW9uIChvKSB7XG4gICAgICB2YXIgbGFzdE9uTmV4dCA9IDA7XG4gICAgICByZXR1cm4gc291cmNlLnN1YnNjcmliZShcbiAgICAgICAgZnVuY3Rpb24gKHgpIHtcbiAgICAgICAgICB2YXIgbm93ID0gc2NoZWR1bGVyLm5vdygpO1xuICAgICAgICAgIGlmIChsYXN0T25OZXh0ID09PSAwIHx8IG5vdyAtIGxhc3RPbk5leHQgPj0gZHVyYXRpb24pIHtcbiAgICAgICAgICAgIGxhc3RPbk5leHQgPSBub3c7XG4gICAgICAgICAgICBvLm9uTmV4dCh4KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sZnVuY3Rpb24gKGUpIHsgby5vbkVycm9yKGUpOyB9LCBmdW5jdGlvbiAoKSB7IG8ub25Db21wbGV0ZWQoKTsgfVxuICAgICAgKTtcbiAgICB9LCBzb3VyY2UpO1xuICB9O1xuXG4gIHZhciBQYXVzYWJsZU9ic2VydmFibGUgPSAoZnVuY3Rpb24gKF9fc3VwZXJfXykge1xuICAgIGluaGVyaXRzKFBhdXNhYmxlT2JzZXJ2YWJsZSwgX19zdXBlcl9fKTtcbiAgICBmdW5jdGlvbiBQYXVzYWJsZU9ic2VydmFibGUoc291cmNlLCBwYXVzZXIpIHtcbiAgICAgIHRoaXMuc291cmNlID0gc291cmNlO1xuICAgICAgdGhpcy5jb250cm9sbGVyID0gbmV3IFN1YmplY3QoKTtcblxuICAgICAgaWYgKHBhdXNlciAmJiBwYXVzZXIuc3Vic2NyaWJlKSB7XG4gICAgICAgIHRoaXMucGF1c2VyID0gdGhpcy5jb250cm9sbGVyLm1lcmdlKHBhdXNlcik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnBhdXNlciA9IHRoaXMuY29udHJvbGxlcjtcbiAgICAgIH1cblxuICAgICAgX19zdXBlcl9fLmNhbGwodGhpcyk7XG4gICAgfVxuXG4gICAgUGF1c2FibGVPYnNlcnZhYmxlLnByb3RvdHlwZS5fc3Vic2NyaWJlID0gZnVuY3Rpb24gKG8pIHtcbiAgICAgIHZhciBjb25uID0gdGhpcy5zb3VyY2UucHVibGlzaCgpLFxuICAgICAgICBzdWJzY3JpcHRpb24gPSBjb25uLnN1YnNjcmliZShvKSxcbiAgICAgICAgY29ubmVjdGlvbiA9IGRpc3Bvc2FibGVFbXB0eTtcblxuICAgICAgdmFyIHBhdXNhYmxlID0gdGhpcy5wYXVzZXIuZGlzdGluY3RVbnRpbENoYW5nZWQoKS5zdWJzY3JpYmUoZnVuY3Rpb24gKGIpIHtcbiAgICAgICAgaWYgKGIpIHtcbiAgICAgICAgICBjb25uZWN0aW9uID0gY29ubi5jb25uZWN0KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29ubmVjdGlvbi5kaXNwb3NlKCk7XG4gICAgICAgICAgY29ubmVjdGlvbiA9IGRpc3Bvc2FibGVFbXB0eTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiBuZXcgTkFyeURpc3Bvc2FibGUoW3N1YnNjcmlwdGlvbiwgY29ubmVjdGlvbiwgcGF1c2FibGVdKTtcbiAgICB9O1xuXG4gICAgUGF1c2FibGVPYnNlcnZhYmxlLnByb3RvdHlwZS5wYXVzZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuY29udHJvbGxlci5vbk5leHQoZmFsc2UpO1xuICAgIH07XG5cbiAgICBQYXVzYWJsZU9ic2VydmFibGUucHJvdG90eXBlLnJlc3VtZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuY29udHJvbGxlci5vbk5leHQodHJ1ZSk7XG4gICAgfTtcblxuICAgIHJldHVybiBQYXVzYWJsZU9ic2VydmFibGU7XG5cbiAgfShPYnNlcnZhYmxlKSk7XG5cbiAgLyoqXG4gICAqIFBhdXNlcyB0aGUgdW5kZXJseWluZyBvYnNlcnZhYmxlIHNlcXVlbmNlIGJhc2VkIHVwb24gdGhlIG9ic2VydmFibGUgc2VxdWVuY2Ugd2hpY2ggeWllbGRzIHRydWUvZmFsc2UuXG4gICAqIEBleGFtcGxlXG4gICAqIHZhciBwYXVzZXIgPSBuZXcgUnguU3ViamVjdCgpO1xuICAgKiB2YXIgc291cmNlID0gUnguT2JzZXJ2YWJsZS5pbnRlcnZhbCgxMDApLnBhdXNhYmxlKHBhdXNlcik7XG4gICAqIEBwYXJhbSB7T2JzZXJ2YWJsZX0gcGF1c2VyIFRoZSBvYnNlcnZhYmxlIHNlcXVlbmNlIHVzZWQgdG8gcGF1c2UgdGhlIHVuZGVybHlpbmcgc2VxdWVuY2UuXG4gICAqIEByZXR1cm5zIHtPYnNlcnZhYmxlfSBUaGUgb2JzZXJ2YWJsZSBzZXF1ZW5jZSB3aGljaCBpcyBwYXVzZWQgYmFzZWQgdXBvbiB0aGUgcGF1c2VyLlxuICAgKi9cbiAgb2JzZXJ2YWJsZVByb3RvLnBhdXNhYmxlID0gZnVuY3Rpb24gKHBhdXNlcikge1xuICAgIHJldHVybiBuZXcgUGF1c2FibGVPYnNlcnZhYmxlKHRoaXMsIHBhdXNlcik7XG4gIH07XG5cbiAgZnVuY3Rpb24gY29tYmluZUxhdGVzdFNvdXJjZShzb3VyY2UsIHN1YmplY3QsIHJlc3VsdFNlbGVjdG9yKSB7XG4gICAgcmV0dXJuIG5ldyBBbm9ueW1vdXNPYnNlcnZhYmxlKGZ1bmN0aW9uIChvKSB7XG4gICAgICB2YXIgaGFzVmFsdWUgPSBbZmFsc2UsIGZhbHNlXSxcbiAgICAgICAgaGFzVmFsdWVBbGwgPSBmYWxzZSxcbiAgICAgICAgaXNEb25lID0gZmFsc2UsXG4gICAgICAgIHZhbHVlcyA9IG5ldyBBcnJheSgyKSxcbiAgICAgICAgZXJyO1xuXG4gICAgICBmdW5jdGlvbiBuZXh0KHgsIGkpIHtcbiAgICAgICAgdmFsdWVzW2ldID0geDtcbiAgICAgICAgaGFzVmFsdWVbaV0gPSB0cnVlO1xuICAgICAgICBpZiAoaGFzVmFsdWVBbGwgfHwgKGhhc1ZhbHVlQWxsID0gaGFzVmFsdWUuZXZlcnkoaWRlbnRpdHkpKSkge1xuICAgICAgICAgIGlmIChlcnIpIHsgcmV0dXJuIG8ub25FcnJvcihlcnIpOyB9XG4gICAgICAgICAgdmFyIHJlcyA9IHRyeUNhdGNoKHJlc3VsdFNlbGVjdG9yKS5hcHBseShudWxsLCB2YWx1ZXMpO1xuICAgICAgICAgIGlmIChyZXMgPT09IGVycm9yT2JqKSB7IHJldHVybiBvLm9uRXJyb3IocmVzLmUpOyB9XG4gICAgICAgICAgby5vbk5leHQocmVzKTtcbiAgICAgICAgfVxuICAgICAgICBpc0RvbmUgJiYgdmFsdWVzWzFdICYmIG8ub25Db21wbGV0ZWQoKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5ldyBCaW5hcnlEaXNwb3NhYmxlKFxuICAgICAgICBzb3VyY2Uuc3Vic2NyaWJlKFxuICAgICAgICAgIGZ1bmN0aW9uICh4KSB7XG4gICAgICAgICAgICBuZXh0KHgsIDApO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZXNbMV0pIHtcbiAgICAgICAgICAgICAgby5vbkVycm9yKGUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZXJyID0gZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlzRG9uZSA9IHRydWU7XG4gICAgICAgICAgICB2YWx1ZXNbMV0gJiYgby5vbkNvbXBsZXRlZCgpO1xuICAgICAgICAgIH0pLFxuICAgICAgICBzdWJqZWN0LnN1YnNjcmliZShcbiAgICAgICAgICBmdW5jdGlvbiAoeCkge1xuICAgICAgICAgICAgbmV4dCh4LCAxKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGZ1bmN0aW9uIChlKSB7IG8ub25FcnJvcihlKTsgfSxcbiAgICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpc0RvbmUgPSB0cnVlO1xuICAgICAgICAgICAgbmV4dCh0cnVlLCAxKTtcbiAgICAgICAgICB9KVxuICAgICAgICApO1xuICAgIH0sIHNvdXJjZSk7XG4gIH1cblxuICB2YXIgUGF1c2FibGVCdWZmZXJlZE9ic2VydmFibGUgPSAoZnVuY3Rpb24gKF9fc3VwZXJfXykge1xuICAgIGluaGVyaXRzKFBhdXNhYmxlQnVmZmVyZWRPYnNlcnZhYmxlLCBfX3N1cGVyX18pO1xuICAgIGZ1bmN0aW9uIFBhdXNhYmxlQnVmZmVyZWRPYnNlcnZhYmxlKHNvdXJjZSwgcGF1c2VyKSB7XG4gICAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcbiAgICAgIHRoaXMuY29udHJvbGxlciA9IG5ldyBTdWJqZWN0KCk7XG5cbiAgICAgIGlmIChwYXVzZXIgJiYgcGF1c2VyLnN1YnNjcmliZSkge1xuICAgICAgICB0aGlzLnBhdXNlciA9IHRoaXMuY29udHJvbGxlci5tZXJnZShwYXVzZXIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5wYXVzZXIgPSB0aGlzLmNvbnRyb2xsZXI7XG4gICAgICB9XG5cbiAgICAgIF9fc3VwZXJfXy5jYWxsKHRoaXMpO1xuICAgIH1cblxuICAgIFBhdXNhYmxlQnVmZmVyZWRPYnNlcnZhYmxlLnByb3RvdHlwZS5fc3Vic2NyaWJlID0gZnVuY3Rpb24gKG8pIHtcbiAgICAgIHZhciBxID0gW10sIHByZXZpb3VzU2hvdWxkRmlyZTtcblxuICAgICAgZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHsgd2hpbGUgKHEubGVuZ3RoID4gMCkgeyBvLm9uTmV4dChxLnNoaWZ0KCkpOyB9IH1cblxuICAgICAgdmFyIHN1YnNjcmlwdGlvbiA9XG4gICAgICAgIGNvbWJpbmVMYXRlc3RTb3VyY2UoXG4gICAgICAgICAgdGhpcy5zb3VyY2UsXG4gICAgICAgICAgdGhpcy5wYXVzZXIuc3RhcnRXaXRoKGZhbHNlKS5kaXN0aW5jdFVudGlsQ2hhbmdlZCgpLFxuICAgICAgICAgIGZ1bmN0aW9uIChkYXRhLCBzaG91bGRGaXJlKSB7XG4gICAgICAgICAgICByZXR1cm4geyBkYXRhOiBkYXRhLCBzaG91bGRGaXJlOiBzaG91bGRGaXJlIH07XG4gICAgICAgICAgfSlcbiAgICAgICAgICAuc3Vic2NyaWJlKFxuICAgICAgICAgICAgZnVuY3Rpb24gKHJlc3VsdHMpIHtcbiAgICAgICAgICAgICAgaWYgKHByZXZpb3VzU2hvdWxkRmlyZSAhPT0gdW5kZWZpbmVkICYmIHJlc3VsdHMuc2hvdWxkRmlyZSAhPT0gcHJldmlvdXNTaG91bGRGaXJlKSB7XG4gICAgICAgICAgICAgICAgcHJldmlvdXNTaG91bGRGaXJlID0gcmVzdWx0cy5zaG91bGRGaXJlO1xuICAgICAgICAgICAgICAgIC8vIGNoYW5nZSBpbiBzaG91bGRGaXJlXG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdHMuc2hvdWxkRmlyZSkgeyBkcmFpblF1ZXVlKCk7IH1cbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBwcmV2aW91c1Nob3VsZEZpcmUgPSByZXN1bHRzLnNob3VsZEZpcmU7XG4gICAgICAgICAgICAgICAgLy8gbmV3IGRhdGFcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0cy5zaG91bGRGaXJlKSB7XG4gICAgICAgICAgICAgICAgICBvLm9uTmV4dChyZXN1bHRzLmRhdGEpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBxLnB1c2gocmVzdWx0cy5kYXRhKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgIGRyYWluUXVldWUoKTtcbiAgICAgICAgICAgICAgby5vbkVycm9yKGVycik7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgICAgICAgICAgIG8ub25Db21wbGV0ZWQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICApO1xuICAgICAgcmV0dXJuIHN1YnNjcmlwdGlvbjsgICAgICBcbiAgICB9O1xuXG4gICAgUGF1c2FibGVCdWZmZXJlZE9ic2VydmFibGUucHJvdG90eXBlLnBhdXNlID0gZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5jb250cm9sbGVyLm9uTmV4dChmYWxzZSk7XG4gICAgfTtcblxuICAgIFBhdXNhYmxlQnVmZmVyZWRPYnNlcnZhYmxlLnByb3RvdHlwZS5yZXN1bWUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLmNvbnRyb2xsZXIub25OZXh0KHRydWUpO1xuICAgIH07XG5cbiAgICByZXR1cm4gUGF1c2FibGVCdWZmZXJlZE9ic2VydmFibGU7XG5cbiAgfShPYnNlcnZhYmxlKSk7XG5cbiAgLyoqXG4gICAqIFBhdXNlcyB0aGUgdW5kZXJseWluZyBvYnNlcnZhYmxlIHNlcXVlbmNlIGJhc2VkIHVwb24gdGhlIG9ic2VydmFibGUgc2VxdWVuY2Ugd2hpY2ggeWllbGRzIHRydWUvZmFsc2UsXG4gICAqIGFuZCB5aWVsZHMgdGhlIHZhbHVlcyB0aGF0IHdlcmUgYnVmZmVyZWQgd2hpbGUgcGF1c2VkLlxuICAgKiBAZXhhbXBsZVxuICAgKiB2YXIgcGF1c2VyID0gbmV3IFJ4LlN1YmplY3QoKTtcbiAgICogdmFyIHNvdXJjZSA9IFJ4Lk9ic2VydmFibGUuaW50ZXJ2YWwoMTAwKS5wYXVzYWJsZUJ1ZmZlcmVkKHBhdXNlcik7XG4gICAqIEBwYXJhbSB7T2JzZXJ2YWJsZX0gcGF1c2VyIFRoZSBvYnNlcnZhYmxlIHNlcXVlbmNlIHVzZWQgdG8gcGF1c2UgdGhlIHVuZGVybHlpbmcgc2VxdWVuY2UuXG4gICAqIEByZXR1cm5zIHtPYnNlcnZhYmxlfSBUaGUgb2JzZXJ2YWJsZSBzZXF1ZW5jZSB3aGljaCBpcyBwYXVzZWQgYmFzZWQgdXBvbiB0aGUgcGF1c2VyLlxuICAgKi9cbiAgb2JzZXJ2YWJsZVByb3RvLnBhdXNhYmxlQnVmZmVyZWQgPSBmdW5jdGlvbiAocGF1c2VyKSB7XG4gICAgcmV0dXJuIG5ldyBQYXVzYWJsZUJ1ZmZlcmVkT2JzZXJ2YWJsZSh0aGlzLCBwYXVzZXIpO1xuICB9O1xuXG4gIHZhciBDb250cm9sbGVkT2JzZXJ2YWJsZSA9IChmdW5jdGlvbiAoX19zdXBlcl9fKSB7XG4gICAgaW5oZXJpdHMoQ29udHJvbGxlZE9ic2VydmFibGUsIF9fc3VwZXJfXyk7XG4gICAgZnVuY3Rpb24gQ29udHJvbGxlZE9ic2VydmFibGUgKHNvdXJjZSwgZW5hYmxlUXVldWUsIHNjaGVkdWxlcikge1xuICAgICAgX19zdXBlcl9fLmNhbGwodGhpcyk7XG4gICAgICB0aGlzLnN1YmplY3QgPSBuZXcgQ29udHJvbGxlZFN1YmplY3QoZW5hYmxlUXVldWUsIHNjaGVkdWxlcik7XG4gICAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZS5tdWx0aWNhc3QodGhpcy5zdWJqZWN0KS5yZWZDb3VudCgpO1xuICAgIH1cblxuICAgIENvbnRyb2xsZWRPYnNlcnZhYmxlLnByb3RvdHlwZS5fc3Vic2NyaWJlID0gZnVuY3Rpb24gKG8pIHtcbiAgICAgIHJldHVybiB0aGlzLnNvdXJjZS5zdWJzY3JpYmUobyk7XG4gICAgfTtcblxuICAgIENvbnRyb2xsZWRPYnNlcnZhYmxlLnByb3RvdHlwZS5yZXF1ZXN0ID0gZnVuY3Rpb24gKG51bWJlck9mSXRlbXMpIHtcbiAgICAgIHJldHVybiB0aGlzLnN1YmplY3QucmVxdWVzdChudW1iZXJPZkl0ZW1zID09IG51bGwgPyAtMSA6IG51bWJlck9mSXRlbXMpO1xuICAgIH07XG5cbiAgICByZXR1cm4gQ29udHJvbGxlZE9ic2VydmFibGU7XG5cbiAgfShPYnNlcnZhYmxlKSk7XG5cbiAgdmFyIENvbnRyb2xsZWRTdWJqZWN0ID0gKGZ1bmN0aW9uIChfX3N1cGVyX18pIHtcbiAgICBpbmhlcml0cyhDb250cm9sbGVkU3ViamVjdCwgX19zdXBlcl9fKTtcbiAgICBmdW5jdGlvbiBDb250cm9sbGVkU3ViamVjdChlbmFibGVRdWV1ZSwgc2NoZWR1bGVyKSB7XG4gICAgICBlbmFibGVRdWV1ZSA9PSBudWxsICYmIChlbmFibGVRdWV1ZSA9IHRydWUpO1xuXG4gICAgICBfX3N1cGVyX18uY2FsbCh0aGlzKTtcbiAgICAgIHRoaXMuc3ViamVjdCA9IG5ldyBTdWJqZWN0KCk7XG4gICAgICB0aGlzLmVuYWJsZVF1ZXVlID0gZW5hYmxlUXVldWU7XG4gICAgICB0aGlzLnF1ZXVlID0gZW5hYmxlUXVldWUgPyBbXSA6IG51bGw7XG4gICAgICB0aGlzLnJlcXVlc3RlZENvdW50ID0gMDtcbiAgICAgIHRoaXMucmVxdWVzdGVkRGlzcG9zYWJsZSA9IG51bGw7XG4gICAgICB0aGlzLmVycm9yID0gbnVsbDtcbiAgICAgIHRoaXMuaGFzRmFpbGVkID0gZmFsc2U7XG4gICAgICB0aGlzLmhhc0NvbXBsZXRlZCA9IGZhbHNlO1xuICAgICAgdGhpcy5zY2hlZHVsZXIgPSBzY2hlZHVsZXIgfHwgY3VycmVudFRocmVhZFNjaGVkdWxlcjtcbiAgICB9XG5cbiAgICBhZGRQcm9wZXJ0aWVzKENvbnRyb2xsZWRTdWJqZWN0LnByb3RvdHlwZSwgT2JzZXJ2ZXIsIHtcbiAgICAgIF9zdWJzY3JpYmU6IGZ1bmN0aW9uIChvKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN1YmplY3Quc3Vic2NyaWJlKG8pO1xuICAgICAgfSxcbiAgICAgIG9uQ29tcGxldGVkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuaGFzQ29tcGxldGVkID0gdHJ1ZTtcbiAgICAgICAgaWYgKCF0aGlzLmVuYWJsZVF1ZXVlIHx8IHRoaXMucXVldWUubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgdGhpcy5zdWJqZWN0Lm9uQ29tcGxldGVkKCk7XG4gICAgICAgICAgdGhpcy5kaXNwb3NlQ3VycmVudFJlcXVlc3QoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnF1ZXVlLnB1c2goTm90aWZpY2F0aW9uLmNyZWF0ZU9uQ29tcGxldGVkKCkpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgb25FcnJvcjogZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgIHRoaXMuaGFzRmFpbGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5lcnJvciA9IGVycm9yO1xuICAgICAgICBpZiAoIXRoaXMuZW5hYmxlUXVldWUgfHwgdGhpcy5xdWV1ZS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICB0aGlzLnN1YmplY3Qub25FcnJvcihlcnJvcik7XG4gICAgICAgICAgdGhpcy5kaXNwb3NlQ3VycmVudFJlcXVlc3QoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnF1ZXVlLnB1c2goTm90aWZpY2F0aW9uLmNyZWF0ZU9uRXJyb3IoZXJyb3IpKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIG9uTmV4dDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIGlmICh0aGlzLnJlcXVlc3RlZENvdW50IDw9IDApIHtcbiAgICAgICAgICB0aGlzLmVuYWJsZVF1ZXVlICYmIHRoaXMucXVldWUucHVzaChOb3RpZmljYXRpb24uY3JlYXRlT25OZXh0KHZhbHVlKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgKHRoaXMucmVxdWVzdGVkQ291bnQtLSA9PT0gMCkgJiYgdGhpcy5kaXNwb3NlQ3VycmVudFJlcXVlc3QoKTtcbiAgICAgICAgICB0aGlzLnN1YmplY3Qub25OZXh0KHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIF9wcm9jZXNzUmVxdWVzdDogZnVuY3Rpb24gKG51bWJlck9mSXRlbXMpIHtcbiAgICAgICAgaWYgKHRoaXMuZW5hYmxlUXVldWUpIHtcbiAgICAgICAgICB3aGlsZSAodGhpcy5xdWV1ZS5sZW5ndGggPiAwICYmIChudW1iZXJPZkl0ZW1zID4gMCB8fCB0aGlzLnF1ZXVlWzBdLmtpbmQgIT09ICdOJykpIHtcbiAgICAgICAgICAgIHZhciBmaXJzdCA9IHRoaXMucXVldWUuc2hpZnQoKTtcbiAgICAgICAgICAgIGZpcnN0LmFjY2VwdCh0aGlzLnN1YmplY3QpO1xuICAgICAgICAgICAgaWYgKGZpcnN0LmtpbmQgPT09ICdOJykge1xuICAgICAgICAgICAgICBudW1iZXJPZkl0ZW1zLS07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0aGlzLmRpc3Bvc2VDdXJyZW50UmVxdWVzdCgpO1xuICAgICAgICAgICAgICB0aGlzLnF1ZXVlID0gW107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG51bWJlck9mSXRlbXM7XG4gICAgICB9LFxuICAgICAgcmVxdWVzdDogZnVuY3Rpb24gKG51bWJlcikge1xuICAgICAgICB0aGlzLmRpc3Bvc2VDdXJyZW50UmVxdWVzdCgpO1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy5yZXF1ZXN0ZWREaXNwb3NhYmxlID0gdGhpcy5zY2hlZHVsZXIuc2NoZWR1bGUobnVtYmVyLFxuICAgICAgICBmdW5jdGlvbihzLCBpKSB7XG4gICAgICAgICAgdmFyIHJlbWFpbmluZyA9IHNlbGYuX3Byb2Nlc3NSZXF1ZXN0KGkpO1xuICAgICAgICAgIHZhciBzdG9wcGVkID0gc2VsZi5oYXNDb21wbGV0ZWQgfHwgc2VsZi5oYXNGYWlsZWQ7XG4gICAgICAgICAgaWYgKCFzdG9wcGVkICYmIHJlbWFpbmluZyA+IDApIHtcbiAgICAgICAgICAgIHNlbGYucmVxdWVzdGVkQ291bnQgPSByZW1haW5pbmc7XG5cbiAgICAgICAgICAgIHJldHVybiBkaXNwb3NhYmxlQ3JlYXRlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgc2VsZi5yZXF1ZXN0ZWRDb3VudCA9IDA7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgLy8gU2NoZWR1bGVkIGl0ZW0gaXMgc3RpbGwgaW4gcHJvZ3Jlc3MuIFJldHVybiBhIG5ld1xuICAgICAgICAgICAgICAvLyBkaXNwb3NhYmxlIHRvIGFsbG93IHRoZSByZXF1ZXN0IHRvIGJlIGludGVycnVwdGVkXG4gICAgICAgICAgICAgIC8vIHZpYSBkaXNwb3NlLlxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMucmVxdWVzdGVkRGlzcG9zYWJsZTtcbiAgICAgIH0sXG4gICAgICBkaXNwb3NlQ3VycmVudFJlcXVlc3Q6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMucmVxdWVzdGVkRGlzcG9zYWJsZSkge1xuICAgICAgICAgIHRoaXMucmVxdWVzdGVkRGlzcG9zYWJsZS5kaXNwb3NlKCk7XG4gICAgICAgICAgdGhpcy5yZXF1ZXN0ZWREaXNwb3NhYmxlID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIENvbnRyb2xsZWRTdWJqZWN0O1xuICB9KE9ic2VydmFibGUpKTtcblxuICAvKipcbiAgICogQXR0YWNoZXMgYSBjb250cm9sbGVyIHRvIHRoZSBvYnNlcnZhYmxlIHNlcXVlbmNlIHdpdGggdGhlIGFiaWxpdHkgdG8gcXVldWUuXG4gICAqIEBleGFtcGxlXG4gICAqIHZhciBzb3VyY2UgPSBSeC5PYnNlcnZhYmxlLmludGVydmFsKDEwMCkuY29udHJvbGxlZCgpO1xuICAgKiBzb3VyY2UucmVxdWVzdCgzKTsgLy8gUmVhZHMgMyB2YWx1ZXNcbiAgICogQHBhcmFtIHtib29sfSBlbmFibGVRdWV1ZSB0cnV0aHkgdmFsdWUgdG8gZGV0ZXJtaW5lIGlmIHZhbHVlcyBzaG91bGQgYmUgcXVldWVkIHBlbmRpbmcgdGhlIG5leHQgcmVxdWVzdFxuICAgKiBAcGFyYW0ge1NjaGVkdWxlcn0gc2NoZWR1bGVyIGRldGVybWluZXMgaG93IHRoZSByZXF1ZXN0cyB3aWxsIGJlIHNjaGVkdWxlZFxuICAgKiBAcmV0dXJucyB7T2JzZXJ2YWJsZX0gVGhlIG9ic2VydmFibGUgc2VxdWVuY2Ugd2hpY2ggb25seSBwcm9wYWdhdGVzIHZhbHVlcyBvbiByZXF1ZXN0LlxuICAgKi9cbiAgb2JzZXJ2YWJsZVByb3RvLmNvbnRyb2xsZWQgPSBmdW5jdGlvbiAoZW5hYmxlUXVldWUsIHNjaGVkdWxlcikge1xuXG4gICAgaWYgKGVuYWJsZVF1ZXVlICYmIGlzU2NoZWR1bGVyKGVuYWJsZVF1ZXVlKSkge1xuICAgICAgc2NoZWR1bGVyID0gZW5hYmxlUXVldWU7XG4gICAgICBlbmFibGVRdWV1ZSA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYgKGVuYWJsZVF1ZXVlID09IG51bGwpIHsgIGVuYWJsZVF1ZXVlID0gdHJ1ZTsgfVxuICAgIHJldHVybiBuZXcgQ29udHJvbGxlZE9ic2VydmFibGUodGhpcywgZW5hYmxlUXVldWUsIHNjaGVkdWxlcik7XG4gIH07XG5cbiAgLyoqXG4gICAqIFBpcGVzIHRoZSBleGlzdGluZyBPYnNlcnZhYmxlIHNlcXVlbmNlIGludG8gYSBOb2RlLmpzIFN0cmVhbS5cbiAgICogQHBhcmFtIHtTdHJlYW19IGRlc3QgVGhlIGRlc3RpbmF0aW9uIE5vZGUuanMgc3RyZWFtLlxuICAgKiBAcmV0dXJucyB7U3RyZWFtfSBUaGUgZGVzdGluYXRpb24gc3RyZWFtLlxuICAgKi9cbiAgb2JzZXJ2YWJsZVByb3RvLnBpcGUgPSBmdW5jdGlvbiAoZGVzdCkge1xuICAgIHZhciBzb3VyY2UgPSB0aGlzLnBhdXNhYmxlQnVmZmVyZWQoKTtcblxuICAgIGZ1bmN0aW9uIG9uRHJhaW4oKSB7XG4gICAgICBzb3VyY2UucmVzdW1lKCk7XG4gICAgfVxuXG4gICAgZGVzdC5hZGRMaXN0ZW5lcignZHJhaW4nLCBvbkRyYWluKTtcblxuICAgIHNvdXJjZS5zdWJzY3JpYmUoXG4gICAgICBmdW5jdGlvbiAoeCkge1xuICAgICAgICAhZGVzdC53cml0ZShTdHJpbmcoeCkpICYmIHNvdXJjZS5wYXVzZSgpO1xuICAgICAgfSxcbiAgICAgIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgZGVzdC5lbWl0KCdlcnJvcicsIGVycik7XG4gICAgICB9LFxuICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBIYWNrIGNoZWNrIGJlY2F1c2UgU1RESU8gaXMgbm90IGNsb3NhYmxlXG4gICAgICAgICFkZXN0Ll9pc1N0ZGlvICYmIGRlc3QuZW5kKCk7XG4gICAgICAgIGRlc3QucmVtb3ZlTGlzdGVuZXIoJ2RyYWluJywgb25EcmFpbik7XG4gICAgICB9KTtcblxuICAgIHNvdXJjZS5yZXN1bWUoKTtcblxuICAgIHJldHVybiBkZXN0O1xuICB9O1xuXG4gIHZhciBUcmFuc2R1Y2VPYnNlcnZlciA9IChmdW5jdGlvbiAoX19zdXBlcl9fKSB7XG4gICAgaW5oZXJpdHMoVHJhbnNkdWNlT2JzZXJ2ZXIsIF9fc3VwZXJfXyk7XG4gICAgZnVuY3Rpb24gVHJhbnNkdWNlT2JzZXJ2ZXIobywgeGZvcm0pIHtcbiAgICAgIHRoaXMuX28gPSBvO1xuICAgICAgdGhpcy5feGZvcm0gPSB4Zm9ybTtcbiAgICAgIF9fc3VwZXJfXy5jYWxsKHRoaXMpO1xuICAgIH1cblxuICAgIFRyYW5zZHVjZU9ic2VydmVyLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24gKHgpIHtcbiAgICAgIHZhciByZXMgPSB0cnlDYXRjaCh0aGlzLl94Zm9ybVsnQEB0cmFuc2R1Y2VyL3N0ZXAnXSkuY2FsbCh0aGlzLl94Zm9ybSwgdGhpcy5fbywgeCk7XG4gICAgICBpZiAocmVzID09PSBlcnJvck9iaikgeyB0aGlzLl9vLm9uRXJyb3IocmVzLmUpOyB9XG4gICAgfTtcblxuICAgIFRyYW5zZHVjZU9ic2VydmVyLnByb3RvdHlwZS5lcnJvciA9IGZ1bmN0aW9uIChlKSB7IHRoaXMuX28ub25FcnJvcihlKTsgfTtcblxuICAgIFRyYW5zZHVjZU9ic2VydmVyLnByb3RvdHlwZS5jb21wbGV0ZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLl94Zm9ybVsnQEB0cmFuc2R1Y2VyL3Jlc3VsdCddKHRoaXMuX28pO1xuICAgIH07XG5cbiAgICByZXR1cm4gVHJhbnNkdWNlT2JzZXJ2ZXI7XG4gIH0oQWJzdHJhY3RPYnNlcnZlcikpO1xuXG4gIGZ1bmN0aW9uIHRyYW5zZm9ybUZvck9ic2VydmVyKG8pIHtcbiAgICByZXR1cm4ge1xuICAgICAgJ0BAdHJhbnNkdWNlci9pbml0JzogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBvO1xuICAgICAgfSxcbiAgICAgICdAQHRyYW5zZHVjZXIvc3RlcCc6IGZ1bmN0aW9uKG9icywgaW5wdXQpIHtcbiAgICAgICAgcmV0dXJuIG9icy5vbk5leHQoaW5wdXQpO1xuICAgICAgfSxcbiAgICAgICdAQHRyYW5zZHVjZXIvcmVzdWx0JzogZnVuY3Rpb24ob2JzKSB7XG4gICAgICAgIHJldHVybiBvYnMub25Db21wbGV0ZWQoKTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIEV4ZWN1dGVzIGEgdHJhbnNkdWNlciB0byB0cmFuc2Zvcm0gdGhlIG9ic2VydmFibGUgc2VxdWVuY2VcbiAgICogQHBhcmFtIHtUcmFuc2R1Y2VyfSB0cmFuc2R1Y2VyIEEgdHJhbnNkdWNlciB0byBleGVjdXRlXG4gICAqIEByZXR1cm5zIHtPYnNlcnZhYmxlfSBBbiBPYnNlcnZhYmxlIHNlcXVlbmNlIGNvbnRhaW5pbmcgdGhlIHJlc3VsdHMgZnJvbSB0aGUgdHJhbnNkdWNlci5cbiAgICovXG4gIG9ic2VydmFibGVQcm90by50cmFuc2R1Y2UgPSBmdW5jdGlvbih0cmFuc2R1Y2VyKSB7XG4gICAgdmFyIHNvdXJjZSA9IHRoaXM7XG4gICAgcmV0dXJuIG5ldyBBbm9ueW1vdXNPYnNlcnZhYmxlKGZ1bmN0aW9uKG8pIHtcbiAgICAgIHZhciB4Zm9ybSA9IHRyYW5zZHVjZXIodHJhbnNmb3JtRm9yT2JzZXJ2ZXIobykpO1xuICAgICAgcmV0dXJuIHNvdXJjZS5zdWJzY3JpYmUobmV3IFRyYW5zZHVjZU9ic2VydmVyKG8sIHhmb3JtKSk7XG4gICAgfSwgc291cmNlKTtcbiAgfTtcblxuICB2YXIgQW5vbnltb3VzT2JzZXJ2YWJsZSA9IFJ4LkFub255bW91c09ic2VydmFibGUgPSAoZnVuY3Rpb24gKF9fc3VwZXJfXykge1xuICAgIGluaGVyaXRzKEFub255bW91c09ic2VydmFibGUsIF9fc3VwZXJfXyk7XG5cbiAgICAvLyBGaXggc3Vic2NyaWJlciB0byBjaGVjayBmb3IgdW5kZWZpbmVkIG9yIGZ1bmN0aW9uIHJldHVybmVkIHRvIGRlY29yYXRlIGFzIERpc3Bvc2FibGVcbiAgICBmdW5jdGlvbiBmaXhTdWJzY3JpYmVyKHN1YnNjcmliZXIpIHtcbiAgICAgIHJldHVybiBzdWJzY3JpYmVyICYmIGlzRnVuY3Rpb24oc3Vic2NyaWJlci5kaXNwb3NlKSA/IHN1YnNjcmliZXIgOlxuICAgICAgICBpc0Z1bmN0aW9uKHN1YnNjcmliZXIpID8gZGlzcG9zYWJsZUNyZWF0ZShzdWJzY3JpYmVyKSA6IGRpc3Bvc2FibGVFbXB0eTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZXREaXNwb3NhYmxlKHMsIHN0YXRlKSB7XG4gICAgICB2YXIgYWRvID0gc3RhdGVbMF0sIHNlbGYgPSBzdGF0ZVsxXTtcbiAgICAgIHZhciBzdWIgPSB0cnlDYXRjaChzZWxmLl9fc3Vic2NyaWJlKS5jYWxsKHNlbGYsIGFkbyk7XG4gICAgICBpZiAoc3ViID09PSBlcnJvck9iaiAmJiAhYWRvLmZhaWwoZXJyb3JPYmouZSkpIHsgdGhyb3dlcihlcnJvck9iai5lKTsgfVxuICAgICAgYWRvLnNldERpc3Bvc2FibGUoZml4U3Vic2NyaWJlcihzdWIpKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBBbm9ueW1vdXNPYnNlcnZhYmxlKHN1YnNjcmliZSwgcGFyZW50KSB7XG4gICAgICB0aGlzLnNvdXJjZSA9IHBhcmVudDtcbiAgICAgIHRoaXMuX19zdWJzY3JpYmUgPSBzdWJzY3JpYmU7XG4gICAgICBfX3N1cGVyX18uY2FsbCh0aGlzKTtcbiAgICB9XG5cbiAgICBBbm9ueW1vdXNPYnNlcnZhYmxlLnByb3RvdHlwZS5fc3Vic2NyaWJlID0gZnVuY3Rpb24gKG8pIHtcbiAgICAgIHZhciBhZG8gPSBuZXcgQXV0b0RldGFjaE9ic2VydmVyKG8pLCBzdGF0ZSA9IFthZG8sIHRoaXNdO1xuXG4gICAgICBpZiAoY3VycmVudFRocmVhZFNjaGVkdWxlci5zY2hlZHVsZVJlcXVpcmVkKCkpIHtcbiAgICAgICAgY3VycmVudFRocmVhZFNjaGVkdWxlci5zY2hlZHVsZShzdGF0ZSwgc2V0RGlzcG9zYWJsZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzZXREaXNwb3NhYmxlKG51bGwsIHN0YXRlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBhZG87XG4gICAgfTtcblxuICAgIHJldHVybiBBbm9ueW1vdXNPYnNlcnZhYmxlO1xuXG4gIH0oT2JzZXJ2YWJsZSkpO1xuXG4gIHZhciBBdXRvRGV0YWNoT2JzZXJ2ZXIgPSAoZnVuY3Rpb24gKF9fc3VwZXJfXykge1xuICAgIGluaGVyaXRzKEF1dG9EZXRhY2hPYnNlcnZlciwgX19zdXBlcl9fKTtcblxuICAgIGZ1bmN0aW9uIEF1dG9EZXRhY2hPYnNlcnZlcihvYnNlcnZlcikge1xuICAgICAgX19zdXBlcl9fLmNhbGwodGhpcyk7XG4gICAgICB0aGlzLm9ic2VydmVyID0gb2JzZXJ2ZXI7XG4gICAgICB0aGlzLm0gPSBuZXcgU2luZ2xlQXNzaWdubWVudERpc3Bvc2FibGUoKTtcbiAgICB9XG5cbiAgICB2YXIgQXV0b0RldGFjaE9ic2VydmVyUHJvdG90eXBlID0gQXV0b0RldGFjaE9ic2VydmVyLnByb3RvdHlwZTtcblxuICAgIEF1dG9EZXRhY2hPYnNlcnZlclByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICB2YXIgcmVzdWx0ID0gdHJ5Q2F0Y2godGhpcy5vYnNlcnZlci5vbk5leHQpLmNhbGwodGhpcy5vYnNlcnZlciwgdmFsdWUpO1xuICAgICAgaWYgKHJlc3VsdCA9PT0gZXJyb3JPYmopIHtcbiAgICAgICAgdGhpcy5kaXNwb3NlKCk7XG4gICAgICAgIHRocm93ZXIocmVzdWx0LmUpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBBdXRvRGV0YWNoT2JzZXJ2ZXJQcm90b3R5cGUuZXJyb3IgPSBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICB2YXIgcmVzdWx0ID0gdHJ5Q2F0Y2godGhpcy5vYnNlcnZlci5vbkVycm9yKS5jYWxsKHRoaXMub2JzZXJ2ZXIsIGVycik7XG4gICAgICB0aGlzLmRpc3Bvc2UoKTtcbiAgICAgIHJlc3VsdCA9PT0gZXJyb3JPYmogJiYgdGhyb3dlcihyZXN1bHQuZSk7XG4gICAgfTtcblxuICAgIEF1dG9EZXRhY2hPYnNlcnZlclByb3RvdHlwZS5jb21wbGV0ZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgcmVzdWx0ID0gdHJ5Q2F0Y2godGhpcy5vYnNlcnZlci5vbkNvbXBsZXRlZCkuY2FsbCh0aGlzLm9ic2VydmVyKTtcbiAgICAgIHRoaXMuZGlzcG9zZSgpO1xuICAgICAgcmVzdWx0ID09PSBlcnJvck9iaiAmJiB0aHJvd2VyKHJlc3VsdC5lKTtcbiAgICB9O1xuXG4gICAgQXV0b0RldGFjaE9ic2VydmVyUHJvdG90eXBlLnNldERpc3Bvc2FibGUgPSBmdW5jdGlvbiAodmFsdWUpIHsgdGhpcy5tLnNldERpc3Bvc2FibGUodmFsdWUpOyB9O1xuICAgIEF1dG9EZXRhY2hPYnNlcnZlclByb3RvdHlwZS5nZXREaXNwb3NhYmxlID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpcy5tLmdldERpc3Bvc2FibGUoKTsgfTtcblxuICAgIEF1dG9EZXRhY2hPYnNlcnZlclByb3RvdHlwZS5kaXNwb3NlID0gZnVuY3Rpb24gKCkge1xuICAgICAgX19zdXBlcl9fLnByb3RvdHlwZS5kaXNwb3NlLmNhbGwodGhpcyk7XG4gICAgICB0aGlzLm0uZGlzcG9zZSgpO1xuICAgIH07XG5cbiAgICByZXR1cm4gQXV0b0RldGFjaE9ic2VydmVyO1xuICB9KEFic3RyYWN0T2JzZXJ2ZXIpKTtcblxuICB2YXIgSW5uZXJTdWJzY3JpcHRpb24gPSBmdW5jdGlvbiAocywgbykge1xuICAgIHRoaXMuX3MgPSBzO1xuICAgIHRoaXMuX28gPSBvO1xuICB9O1xuXG4gIElubmVyU3Vic2NyaXB0aW9uLnByb3RvdHlwZS5kaXNwb3NlID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICghdGhpcy5fcy5pc0Rpc3Bvc2VkICYmIHRoaXMuX28gIT09IG51bGwpIHtcbiAgICAgIHZhciBpZHggPSB0aGlzLl9zLm9ic2VydmVycy5pbmRleE9mKHRoaXMuX28pO1xuICAgICAgdGhpcy5fcy5vYnNlcnZlcnMuc3BsaWNlKGlkeCwgMSk7XG4gICAgICB0aGlzLl9vID0gbnVsbDtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqICBSZXByZXNlbnRzIGFuIG9iamVjdCB0aGF0IGlzIGJvdGggYW4gb2JzZXJ2YWJsZSBzZXF1ZW5jZSBhcyB3ZWxsIGFzIGFuIG9ic2VydmVyLlxuICAgKiAgRWFjaCBub3RpZmljYXRpb24gaXMgYnJvYWRjYXN0ZWQgdG8gYWxsIHN1YnNjcmliZWQgb2JzZXJ2ZXJzLlxuICAgKi9cbiAgdmFyIFN1YmplY3QgPSBSeC5TdWJqZWN0ID0gKGZ1bmN0aW9uIChfX3N1cGVyX18pIHtcbiAgICBpbmhlcml0cyhTdWJqZWN0LCBfX3N1cGVyX18pO1xuICAgIGZ1bmN0aW9uIFN1YmplY3QoKSB7XG4gICAgICBfX3N1cGVyX18uY2FsbCh0aGlzKTtcbiAgICAgIHRoaXMuaXNEaXNwb3NlZCA9IGZhbHNlO1xuICAgICAgdGhpcy5pc1N0b3BwZWQgPSBmYWxzZTtcbiAgICAgIHRoaXMub2JzZXJ2ZXJzID0gW107XG4gICAgICB0aGlzLmhhc0Vycm9yID0gZmFsc2U7XG4gICAgfVxuXG4gICAgYWRkUHJvcGVydGllcyhTdWJqZWN0LnByb3RvdHlwZSwgT2JzZXJ2ZXIucHJvdG90eXBlLCB7XG4gICAgICBfc3Vic2NyaWJlOiBmdW5jdGlvbiAobykge1xuICAgICAgICBjaGVja0Rpc3Bvc2VkKHRoaXMpO1xuICAgICAgICBpZiAoIXRoaXMuaXNTdG9wcGVkKSB7XG4gICAgICAgICAgdGhpcy5vYnNlcnZlcnMucHVzaChvKTtcbiAgICAgICAgICByZXR1cm4gbmV3IElubmVyU3Vic2NyaXB0aW9uKHRoaXMsIG8pO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmhhc0Vycm9yKSB7XG4gICAgICAgICAgby5vbkVycm9yKHRoaXMuZXJyb3IpO1xuICAgICAgICAgIHJldHVybiBkaXNwb3NhYmxlRW1wdHk7XG4gICAgICAgIH1cbiAgICAgICAgby5vbkNvbXBsZXRlZCgpO1xuICAgICAgICByZXR1cm4gZGlzcG9zYWJsZUVtcHR5O1xuICAgICAgfSxcbiAgICAgIC8qKlxuICAgICAgICogSW5kaWNhdGVzIHdoZXRoZXIgdGhlIHN1YmplY3QgaGFzIG9ic2VydmVycyBzdWJzY3JpYmVkIHRvIGl0LlxuICAgICAgICogQHJldHVybnMge0Jvb2xlYW59IEluZGljYXRlcyB3aGV0aGVyIHRoZSBzdWJqZWN0IGhhcyBvYnNlcnZlcnMgc3Vic2NyaWJlZCB0byBpdC5cbiAgICAgICAqL1xuICAgICAgaGFzT2JzZXJ2ZXJzOiBmdW5jdGlvbiAoKSB7IGNoZWNrRGlzcG9zZWQodGhpcyk7IHJldHVybiB0aGlzLm9ic2VydmVycy5sZW5ndGggPiAwOyB9LFxuICAgICAgLyoqXG4gICAgICAgKiBOb3RpZmllcyBhbGwgc3Vic2NyaWJlZCBvYnNlcnZlcnMgYWJvdXQgdGhlIGVuZCBvZiB0aGUgc2VxdWVuY2UuXG4gICAgICAgKi9cbiAgICAgIG9uQ29tcGxldGVkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNoZWNrRGlzcG9zZWQodGhpcyk7XG4gICAgICAgIGlmICghdGhpcy5pc1N0b3BwZWQpIHtcbiAgICAgICAgICB0aGlzLmlzU3RvcHBlZCA9IHRydWU7XG4gICAgICAgICAgZm9yICh2YXIgaSA9IDAsIG9zID0gY2xvbmVBcnJheSh0aGlzLm9ic2VydmVycyksIGxlbiA9IG9zLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBvc1tpXS5vbkNvbXBsZXRlZCgpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMub2JzZXJ2ZXJzLmxlbmd0aCA9IDA7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAvKipcbiAgICAgICAqIE5vdGlmaWVzIGFsbCBzdWJzY3JpYmVkIG9ic2VydmVycyBhYm91dCB0aGUgZXhjZXB0aW9uLlxuICAgICAgICogQHBhcmFtIHtNaXhlZH0gZXJyb3IgVGhlIGV4Y2VwdGlvbiB0byBzZW5kIHRvIGFsbCBvYnNlcnZlcnMuXG4gICAgICAgKi9cbiAgICAgIG9uRXJyb3I6IGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICBjaGVja0Rpc3Bvc2VkKHRoaXMpO1xuICAgICAgICBpZiAoIXRoaXMuaXNTdG9wcGVkKSB7XG4gICAgICAgICAgdGhpcy5pc1N0b3BwZWQgPSB0cnVlO1xuICAgICAgICAgIHRoaXMuZXJyb3IgPSBlcnJvcjtcbiAgICAgICAgICB0aGlzLmhhc0Vycm9yID0gdHJ1ZTtcbiAgICAgICAgICBmb3IgKHZhciBpID0gMCwgb3MgPSBjbG9uZUFycmF5KHRoaXMub2JzZXJ2ZXJzKSwgbGVuID0gb3MubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIG9zW2ldLm9uRXJyb3IoZXJyb3IpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMub2JzZXJ2ZXJzLmxlbmd0aCA9IDA7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAvKipcbiAgICAgICAqIE5vdGlmaWVzIGFsbCBzdWJzY3JpYmVkIG9ic2VydmVycyBhYm91dCB0aGUgYXJyaXZhbCBvZiB0aGUgc3BlY2lmaWVkIGVsZW1lbnQgaW4gdGhlIHNlcXVlbmNlLlxuICAgICAgICogQHBhcmFtIHtNaXhlZH0gdmFsdWUgVGhlIHZhbHVlIHRvIHNlbmQgdG8gYWxsIG9ic2VydmVycy5cbiAgICAgICAqL1xuICAgICAgb25OZXh0OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgY2hlY2tEaXNwb3NlZCh0aGlzKTtcbiAgICAgICAgaWYgKCF0aGlzLmlzU3RvcHBlZCkge1xuICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBvcyA9IGNsb25lQXJyYXkodGhpcy5vYnNlcnZlcnMpLCBsZW4gPSBvcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgb3NbaV0ub25OZXh0KHZhbHVlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAvKipcbiAgICAgICAqIFVuc3Vic2NyaWJlIGFsbCBvYnNlcnZlcnMgYW5kIHJlbGVhc2UgcmVzb3VyY2VzLlxuICAgICAgICovXG4gICAgICBkaXNwb3NlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuaXNEaXNwb3NlZCA9IHRydWU7XG4gICAgICAgIHRoaXMub2JzZXJ2ZXJzID0gbnVsbDtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBzdWJqZWN0IGZyb20gdGhlIHNwZWNpZmllZCBvYnNlcnZlciBhbmQgb2JzZXJ2YWJsZS5cbiAgICAgKiBAcGFyYW0ge09ic2VydmVyfSBvYnNlcnZlciBUaGUgb2JzZXJ2ZXIgdXNlZCB0byBzZW5kIG1lc3NhZ2VzIHRvIHRoZSBzdWJqZWN0LlxuICAgICAqIEBwYXJhbSB7T2JzZXJ2YWJsZX0gb2JzZXJ2YWJsZSBUaGUgb2JzZXJ2YWJsZSB1c2VkIHRvIHN1YnNjcmliZSB0byBtZXNzYWdlcyBzZW50IGZyb20gdGhlIHN1YmplY3QuXG4gICAgICogQHJldHVybnMge1N1YmplY3R9IFN1YmplY3QgaW1wbGVtZW50ZWQgdXNpbmcgdGhlIGdpdmVuIG9ic2VydmVyIGFuZCBvYnNlcnZhYmxlLlxuICAgICAqL1xuICAgIFN1YmplY3QuY3JlYXRlID0gZnVuY3Rpb24gKG9ic2VydmVyLCBvYnNlcnZhYmxlKSB7XG4gICAgICByZXR1cm4gbmV3IEFub255bW91c1N1YmplY3Qob2JzZXJ2ZXIsIG9ic2VydmFibGUpO1xuICAgIH07XG5cbiAgICByZXR1cm4gU3ViamVjdDtcbiAgfShPYnNlcnZhYmxlKSk7XG5cbiAgLyoqXG4gICAqICBSZXByZXNlbnRzIHRoZSByZXN1bHQgb2YgYW4gYXN5bmNocm9ub3VzIG9wZXJhdGlvbi5cbiAgICogIFRoZSBsYXN0IHZhbHVlIGJlZm9yZSB0aGUgT25Db21wbGV0ZWQgbm90aWZpY2F0aW9uLCBvciB0aGUgZXJyb3IgcmVjZWl2ZWQgdGhyb3VnaCBPbkVycm9yLCBpcyBzZW50IHRvIGFsbCBzdWJzY3JpYmVkIG9ic2VydmVycy5cbiAgICovXG4gIHZhciBBc3luY1N1YmplY3QgPSBSeC5Bc3luY1N1YmplY3QgPSAoZnVuY3Rpb24gKF9fc3VwZXJfXykge1xuICAgIGluaGVyaXRzKEFzeW5jU3ViamVjdCwgX19zdXBlcl9fKTtcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBzdWJqZWN0IHRoYXQgY2FuIG9ubHkgcmVjZWl2ZSBvbmUgdmFsdWUgYW5kIHRoYXQgdmFsdWUgaXMgY2FjaGVkIGZvciBhbGwgZnV0dXJlIG9ic2VydmF0aW9ucy5cbiAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBBc3luY1N1YmplY3QoKSB7XG4gICAgICBfX3N1cGVyX18uY2FsbCh0aGlzKTtcbiAgICAgIHRoaXMuaXNEaXNwb3NlZCA9IGZhbHNlO1xuICAgICAgdGhpcy5pc1N0b3BwZWQgPSBmYWxzZTtcbiAgICAgIHRoaXMuaGFzVmFsdWUgPSBmYWxzZTtcbiAgICAgIHRoaXMub2JzZXJ2ZXJzID0gW107XG4gICAgICB0aGlzLmhhc0Vycm9yID0gZmFsc2U7XG4gICAgfVxuXG4gICAgYWRkUHJvcGVydGllcyhBc3luY1N1YmplY3QucHJvdG90eXBlLCBPYnNlcnZlci5wcm90b3R5cGUsIHtcbiAgICAgIF9zdWJzY3JpYmU6IGZ1bmN0aW9uIChvKSB7XG4gICAgICAgIGNoZWNrRGlzcG9zZWQodGhpcyk7XG5cbiAgICAgICAgaWYgKCF0aGlzLmlzU3RvcHBlZCkge1xuICAgICAgICAgIHRoaXMub2JzZXJ2ZXJzLnB1c2gobyk7XG4gICAgICAgICAgcmV0dXJuIG5ldyBJbm5lclN1YnNjcmlwdGlvbih0aGlzLCBvKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmhhc0Vycm9yKSB7XG4gICAgICAgICAgby5vbkVycm9yKHRoaXMuZXJyb3IpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaGFzVmFsdWUpIHtcbiAgICAgICAgICBvLm9uTmV4dCh0aGlzLnZhbHVlKTtcbiAgICAgICAgICBvLm9uQ29tcGxldGVkKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgby5vbkNvbXBsZXRlZCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGRpc3Bvc2FibGVFbXB0eTtcbiAgICAgIH0sXG4gICAgICAvKipcbiAgICAgICAqIEluZGljYXRlcyB3aGV0aGVyIHRoZSBzdWJqZWN0IGhhcyBvYnNlcnZlcnMgc3Vic2NyaWJlZCB0byBpdC5cbiAgICAgICAqIEByZXR1cm5zIHtCb29sZWFufSBJbmRpY2F0ZXMgd2hldGhlciB0aGUgc3ViamVjdCBoYXMgb2JzZXJ2ZXJzIHN1YnNjcmliZWQgdG8gaXQuXG4gICAgICAgKi9cbiAgICAgIGhhc09ic2VydmVyczogZnVuY3Rpb24gKCkgeyBjaGVja0Rpc3Bvc2VkKHRoaXMpOyByZXR1cm4gdGhpcy5vYnNlcnZlcnMubGVuZ3RoID4gMDsgfSxcbiAgICAgIC8qKlxuICAgICAgICogTm90aWZpZXMgYWxsIHN1YnNjcmliZWQgb2JzZXJ2ZXJzIGFib3V0IHRoZSBlbmQgb2YgdGhlIHNlcXVlbmNlLCBhbHNvIGNhdXNpbmcgdGhlIGxhc3QgcmVjZWl2ZWQgdmFsdWUgdG8gYmUgc2VudCBvdXQgKGlmIGFueSkuXG4gICAgICAgKi9cbiAgICAgIG9uQ29tcGxldGVkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBpLCBsZW47XG4gICAgICAgIGNoZWNrRGlzcG9zZWQodGhpcyk7XG4gICAgICAgIGlmICghdGhpcy5pc1N0b3BwZWQpIHtcbiAgICAgICAgICB0aGlzLmlzU3RvcHBlZCA9IHRydWU7XG4gICAgICAgICAgdmFyIG9zID0gY2xvbmVBcnJheSh0aGlzLm9ic2VydmVycyksIGxlbiA9IG9zLmxlbmd0aDtcblxuICAgICAgICAgIGlmICh0aGlzLmhhc1ZhbHVlKSB7XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgICAgdmFyIG8gPSBvc1tpXTtcbiAgICAgICAgICAgICAgby5vbk5leHQodGhpcy52YWx1ZSk7XG4gICAgICAgICAgICAgIG8ub25Db21wbGV0ZWQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICAgIG9zW2ldLm9uQ29tcGxldGVkKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5vYnNlcnZlcnMubGVuZ3RoID0gMDtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIC8qKlxuICAgICAgICogTm90aWZpZXMgYWxsIHN1YnNjcmliZWQgb2JzZXJ2ZXJzIGFib3V0IHRoZSBlcnJvci5cbiAgICAgICAqIEBwYXJhbSB7TWl4ZWR9IGVycm9yIFRoZSBFcnJvciB0byBzZW5kIHRvIGFsbCBvYnNlcnZlcnMuXG4gICAgICAgKi9cbiAgICAgIG9uRXJyb3I6IGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICBjaGVja0Rpc3Bvc2VkKHRoaXMpO1xuICAgICAgICBpZiAoIXRoaXMuaXNTdG9wcGVkKSB7XG4gICAgICAgICAgdGhpcy5pc1N0b3BwZWQgPSB0cnVlO1xuICAgICAgICAgIHRoaXMuaGFzRXJyb3IgPSB0cnVlO1xuICAgICAgICAgIHRoaXMuZXJyb3IgPSBlcnJvcjtcblxuICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBvcyA9IGNsb25lQXJyYXkodGhpcy5vYnNlcnZlcnMpLCBsZW4gPSBvcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgb3NbaV0ub25FcnJvcihlcnJvcik7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5vYnNlcnZlcnMubGVuZ3RoID0gMDtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIC8qKlxuICAgICAgICogU2VuZHMgYSB2YWx1ZSB0byB0aGUgc3ViamVjdC4gVGhlIGxhc3QgdmFsdWUgcmVjZWl2ZWQgYmVmb3JlIHN1Y2Nlc3NmdWwgdGVybWluYXRpb24gd2lsbCBiZSBzZW50IHRvIGFsbCBzdWJzY3JpYmVkIGFuZCBmdXR1cmUgb2JzZXJ2ZXJzLlxuICAgICAgICogQHBhcmFtIHtNaXhlZH0gdmFsdWUgVGhlIHZhbHVlIHRvIHN0b3JlIGluIHRoZSBzdWJqZWN0LlxuICAgICAgICovXG4gICAgICBvbk5leHQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICBjaGVja0Rpc3Bvc2VkKHRoaXMpO1xuICAgICAgICBpZiAodGhpcy5pc1N0b3BwZWQpIHsgcmV0dXJuOyB9XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5oYXNWYWx1ZSA9IHRydWU7XG4gICAgICB9LFxuICAgICAgLyoqXG4gICAgICAgKiBVbnN1YnNjcmliZSBhbGwgb2JzZXJ2ZXJzIGFuZCByZWxlYXNlIHJlc291cmNlcy5cbiAgICAgICAqL1xuICAgICAgZGlzcG9zZTogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmlzRGlzcG9zZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLm9ic2VydmVycyA9IG51bGw7XG4gICAgICAgIHRoaXMuZXJyb3IgPSBudWxsO1xuICAgICAgICB0aGlzLnZhbHVlID0gbnVsbDtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBBc3luY1N1YmplY3Q7XG4gIH0oT2JzZXJ2YWJsZSkpO1xuXG4gIHZhciBBbm9ueW1vdXNTdWJqZWN0ID0gUnguQW5vbnltb3VzU3ViamVjdCA9IChmdW5jdGlvbiAoX19zdXBlcl9fKSB7XG4gICAgaW5oZXJpdHMoQW5vbnltb3VzU3ViamVjdCwgX19zdXBlcl9fKTtcbiAgICBmdW5jdGlvbiBBbm9ueW1vdXNTdWJqZWN0KG9ic2VydmVyLCBvYnNlcnZhYmxlKSB7XG4gICAgICB0aGlzLm9ic2VydmVyID0gb2JzZXJ2ZXI7XG4gICAgICB0aGlzLm9ic2VydmFibGUgPSBvYnNlcnZhYmxlO1xuICAgICAgX19zdXBlcl9fLmNhbGwodGhpcyk7XG4gICAgfVxuXG4gICAgYWRkUHJvcGVydGllcyhBbm9ueW1vdXNTdWJqZWN0LnByb3RvdHlwZSwgT2JzZXJ2ZXIucHJvdG90eXBlLCB7XG4gICAgICBfc3Vic2NyaWJlOiBmdW5jdGlvbiAobykge1xuICAgICAgICByZXR1cm4gdGhpcy5vYnNlcnZhYmxlLnN1YnNjcmliZShvKTtcbiAgICAgIH0sXG4gICAgICBvbkNvbXBsZXRlZDogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLm9ic2VydmVyLm9uQ29tcGxldGVkKCk7XG4gICAgICB9LFxuICAgICAgb25FcnJvcjogZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgIHRoaXMub2JzZXJ2ZXIub25FcnJvcihlcnJvcik7XG4gICAgICB9LFxuICAgICAgb25OZXh0OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgdGhpcy5vYnNlcnZlci5vbk5leHQodmFsdWUpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIEFub255bW91c1N1YmplY3Q7XG4gIH0oT2JzZXJ2YWJsZSkpO1xuXG4gIC8qKlxuICAgKiAgUmVwcmVzZW50cyBhIHZhbHVlIHRoYXQgY2hhbmdlcyBvdmVyIHRpbWUuXG4gICAqICBPYnNlcnZlcnMgY2FuIHN1YnNjcmliZSB0byB0aGUgc3ViamVjdCB0byByZWNlaXZlIHRoZSBsYXN0IChvciBpbml0aWFsKSB2YWx1ZSBhbmQgYWxsIHN1YnNlcXVlbnQgbm90aWZpY2F0aW9ucy5cbiAgICovXG4gIHZhciBCZWhhdmlvclN1YmplY3QgPSBSeC5CZWhhdmlvclN1YmplY3QgPSAoZnVuY3Rpb24gKF9fc3VwZXJfXykge1xuICAgIGluaGVyaXRzKEJlaGF2aW9yU3ViamVjdCwgX19zdXBlcl9fKTtcbiAgICBmdW5jdGlvbiBCZWhhdmlvclN1YmplY3QodmFsdWUpIHtcbiAgICAgIF9fc3VwZXJfXy5jYWxsKHRoaXMpO1xuICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgdGhpcy5vYnNlcnZlcnMgPSBbXTtcbiAgICAgIHRoaXMuaXNEaXNwb3NlZCA9IGZhbHNlO1xuICAgICAgdGhpcy5pc1N0b3BwZWQgPSBmYWxzZTtcbiAgICAgIHRoaXMuaGFzRXJyb3IgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBhZGRQcm9wZXJ0aWVzKEJlaGF2aW9yU3ViamVjdC5wcm90b3R5cGUsIE9ic2VydmVyLnByb3RvdHlwZSwge1xuICAgICAgX3N1YnNjcmliZTogZnVuY3Rpb24gKG8pIHtcbiAgICAgICAgY2hlY2tEaXNwb3NlZCh0aGlzKTtcbiAgICAgICAgaWYgKCF0aGlzLmlzU3RvcHBlZCkge1xuICAgICAgICAgIHRoaXMub2JzZXJ2ZXJzLnB1c2gobyk7XG4gICAgICAgICAgby5vbk5leHQodGhpcy52YWx1ZSk7XG4gICAgICAgICAgcmV0dXJuIG5ldyBJbm5lclN1YnNjcmlwdGlvbih0aGlzLCBvKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5oYXNFcnJvcikge1xuICAgICAgICAgIG8ub25FcnJvcih0aGlzLmVycm9yKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBvLm9uQ29tcGxldGVkKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRpc3Bvc2FibGVFbXB0eTtcbiAgICAgIH0sXG4gICAgICAvKipcbiAgICAgICAqIEdldHMgdGhlIGN1cnJlbnQgdmFsdWUgb3IgdGhyb3dzIGFuIGV4Y2VwdGlvbi5cbiAgICAgICAqIFZhbHVlIGlzIGZyb3plbiBhZnRlciBvbkNvbXBsZXRlZCBpcyBjYWxsZWQuXG4gICAgICAgKiBBZnRlciBvbkVycm9yIGlzIGNhbGxlZCBhbHdheXMgdGhyb3dzIHRoZSBzcGVjaWZpZWQgZXhjZXB0aW9uLlxuICAgICAgICogQW4gZXhjZXB0aW9uIGlzIGFsd2F5cyB0aHJvd24gYWZ0ZXIgZGlzcG9zZSBpcyBjYWxsZWQuXG4gICAgICAgKiBAcmV0dXJucyB7TWl4ZWR9IFRoZSBpbml0aWFsIHZhbHVlIHBhc3NlZCB0byB0aGUgY29uc3RydWN0b3IgdW50aWwgb25OZXh0IGlzIGNhbGxlZDsgYWZ0ZXIgd2hpY2gsIHRoZSBsYXN0IHZhbHVlIHBhc3NlZCB0byBvbk5leHQuXG4gICAgICAgKi9cbiAgICAgIGdldFZhbHVlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNoZWNrRGlzcG9zZWQodGhpcyk7XG4gICAgICAgIGlmICh0aGlzLmhhc0Vycm9yKSB7IHRocm93ZXIodGhpcy5lcnJvcik7IH1cbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWU7XG4gICAgICB9LFxuICAgICAgLyoqXG4gICAgICAgKiBJbmRpY2F0ZXMgd2hldGhlciB0aGUgc3ViamVjdCBoYXMgb2JzZXJ2ZXJzIHN1YnNjcmliZWQgdG8gaXQuXG4gICAgICAgKiBAcmV0dXJucyB7Qm9vbGVhbn0gSW5kaWNhdGVzIHdoZXRoZXIgdGhlIHN1YmplY3QgaGFzIG9ic2VydmVycyBzdWJzY3JpYmVkIHRvIGl0LlxuICAgICAgICovXG4gICAgICBoYXNPYnNlcnZlcnM6IGZ1bmN0aW9uICgpIHsgY2hlY2tEaXNwb3NlZCh0aGlzKTsgcmV0dXJuIHRoaXMub2JzZXJ2ZXJzLmxlbmd0aCA+IDA7IH0sXG4gICAgICAvKipcbiAgICAgICAqIE5vdGlmaWVzIGFsbCBzdWJzY3JpYmVkIG9ic2VydmVycyBhYm91dCB0aGUgZW5kIG9mIHRoZSBzZXF1ZW5jZS5cbiAgICAgICAqL1xuICAgICAgb25Db21wbGV0ZWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2hlY2tEaXNwb3NlZCh0aGlzKTtcbiAgICAgICAgaWYgKHRoaXMuaXNTdG9wcGVkKSB7IHJldHVybjsgfVxuICAgICAgICB0aGlzLmlzU3RvcHBlZCA9IHRydWU7XG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBvcyA9IGNsb25lQXJyYXkodGhpcy5vYnNlcnZlcnMpLCBsZW4gPSBvcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgIG9zW2ldLm9uQ29tcGxldGVkKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm9ic2VydmVycy5sZW5ndGggPSAwO1xuICAgICAgfSxcbiAgICAgIC8qKlxuICAgICAgICogTm90aWZpZXMgYWxsIHN1YnNjcmliZWQgb2JzZXJ2ZXJzIGFib3V0IHRoZSBleGNlcHRpb24uXG4gICAgICAgKiBAcGFyYW0ge01peGVkfSBlcnJvciBUaGUgZXhjZXB0aW9uIHRvIHNlbmQgdG8gYWxsIG9ic2VydmVycy5cbiAgICAgICAqL1xuICAgICAgb25FcnJvcjogZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgIGNoZWNrRGlzcG9zZWQodGhpcyk7XG4gICAgICAgIGlmICh0aGlzLmlzU3RvcHBlZCkgeyByZXR1cm47IH1cbiAgICAgICAgdGhpcy5pc1N0b3BwZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLmhhc0Vycm9yID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5lcnJvciA9IGVycm9yO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBvcyA9IGNsb25lQXJyYXkodGhpcy5vYnNlcnZlcnMpLCBsZW4gPSBvcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgIG9zW2ldLm9uRXJyb3IoZXJyb3IpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5vYnNlcnZlcnMubGVuZ3RoID0gMDtcbiAgICAgIH0sXG4gICAgICAvKipcbiAgICAgICAqIE5vdGlmaWVzIGFsbCBzdWJzY3JpYmVkIG9ic2VydmVycyBhYm91dCB0aGUgYXJyaXZhbCBvZiB0aGUgc3BlY2lmaWVkIGVsZW1lbnQgaW4gdGhlIHNlcXVlbmNlLlxuICAgICAgICogQHBhcmFtIHtNaXhlZH0gdmFsdWUgVGhlIHZhbHVlIHRvIHNlbmQgdG8gYWxsIG9ic2VydmVycy5cbiAgICAgICAqL1xuICAgICAgb25OZXh0OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgY2hlY2tEaXNwb3NlZCh0aGlzKTtcbiAgICAgICAgaWYgKHRoaXMuaXNTdG9wcGVkKSB7IHJldHVybjsgfVxuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBvcyA9IGNsb25lQXJyYXkodGhpcy5vYnNlcnZlcnMpLCBsZW4gPSBvcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgIG9zW2ldLm9uTmV4dCh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAvKipcbiAgICAgICAqIFVuc3Vic2NyaWJlIGFsbCBvYnNlcnZlcnMgYW5kIHJlbGVhc2UgcmVzb3VyY2VzLlxuICAgICAgICovXG4gICAgICBkaXNwb3NlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuaXNEaXNwb3NlZCA9IHRydWU7XG4gICAgICAgIHRoaXMub2JzZXJ2ZXJzID0gbnVsbDtcbiAgICAgICAgdGhpcy52YWx1ZSA9IG51bGw7XG4gICAgICAgIHRoaXMuZXJyb3IgPSBudWxsO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIEJlaGF2aW9yU3ViamVjdDtcbiAgfShPYnNlcnZhYmxlKSk7XG5cbiAgLyoqXG4gICAqIFJlcHJlc2VudHMgYW4gb2JqZWN0IHRoYXQgaXMgYm90aCBhbiBvYnNlcnZhYmxlIHNlcXVlbmNlIGFzIHdlbGwgYXMgYW4gb2JzZXJ2ZXIuXG4gICAqIEVhY2ggbm90aWZpY2F0aW9uIGlzIGJyb2FkY2FzdGVkIHRvIGFsbCBzdWJzY3JpYmVkIGFuZCBmdXR1cmUgb2JzZXJ2ZXJzLCBzdWJqZWN0IHRvIGJ1ZmZlciB0cmltbWluZyBwb2xpY2llcy5cbiAgICovXG4gIHZhciBSZXBsYXlTdWJqZWN0ID0gUnguUmVwbGF5U3ViamVjdCA9IChmdW5jdGlvbiAoX19zdXBlcl9fKSB7XG5cbiAgICB2YXIgbWF4U2FmZUludGVnZXIgPSBNYXRoLnBvdygyLCA1MykgLSAxO1xuXG4gICAgZnVuY3Rpb24gY3JlYXRlUmVtb3ZhYmxlRGlzcG9zYWJsZShzdWJqZWN0LCBvYnNlcnZlcikge1xuICAgICAgcmV0dXJuIGRpc3Bvc2FibGVDcmVhdGUoZnVuY3Rpb24gKCkge1xuICAgICAgICBvYnNlcnZlci5kaXNwb3NlKCk7XG4gICAgICAgICFzdWJqZWN0LmlzRGlzcG9zZWQgJiYgc3ViamVjdC5vYnNlcnZlcnMuc3BsaWNlKHN1YmplY3Qub2JzZXJ2ZXJzLmluZGV4T2Yob2JzZXJ2ZXIpLCAxKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGluaGVyaXRzKFJlcGxheVN1YmplY3QsIF9fc3VwZXJfXyk7XG5cbiAgICAvKipcbiAgICAgKiAgSW5pdGlhbGl6ZXMgYSBuZXcgaW5zdGFuY2Ugb2YgdGhlIFJlcGxheVN1YmplY3QgY2xhc3Mgd2l0aCB0aGUgc3BlY2lmaWVkIGJ1ZmZlciBzaXplLCB3aW5kb3cgc2l6ZSBhbmQgc2NoZWR1bGVyLlxuICAgICAqICBAcGFyYW0ge051bWJlcn0gW2J1ZmZlclNpemVdIE1heGltdW0gZWxlbWVudCBjb3VudCBvZiB0aGUgcmVwbGF5IGJ1ZmZlci5cbiAgICAgKiAgQHBhcmFtIHtOdW1iZXJ9IFt3aW5kb3dTaXplXSBNYXhpbXVtIHRpbWUgbGVuZ3RoIG9mIHRoZSByZXBsYXkgYnVmZmVyLlxuICAgICAqICBAcGFyYW0ge1NjaGVkdWxlcn0gW3NjaGVkdWxlcl0gU2NoZWR1bGVyIHRoZSBvYnNlcnZlcnMgYXJlIGludm9rZWQgb24uXG4gICAgICovXG4gICAgZnVuY3Rpb24gUmVwbGF5U3ViamVjdChidWZmZXJTaXplLCB3aW5kb3dTaXplLCBzY2hlZHVsZXIpIHtcbiAgICAgIHRoaXMuYnVmZmVyU2l6ZSA9IGJ1ZmZlclNpemUgPT0gbnVsbCA/IG1heFNhZmVJbnRlZ2VyIDogYnVmZmVyU2l6ZTtcbiAgICAgIHRoaXMud2luZG93U2l6ZSA9IHdpbmRvd1NpemUgPT0gbnVsbCA/IG1heFNhZmVJbnRlZ2VyIDogd2luZG93U2l6ZTtcbiAgICAgIHRoaXMuc2NoZWR1bGVyID0gc2NoZWR1bGVyIHx8IGN1cnJlbnRUaHJlYWRTY2hlZHVsZXI7XG4gICAgICB0aGlzLnEgPSBbXTtcbiAgICAgIHRoaXMub2JzZXJ2ZXJzID0gW107XG4gICAgICB0aGlzLmlzU3RvcHBlZCA9IGZhbHNlO1xuICAgICAgdGhpcy5pc0Rpc3Bvc2VkID0gZmFsc2U7XG4gICAgICB0aGlzLmhhc0Vycm9yID0gZmFsc2U7XG4gICAgICB0aGlzLmVycm9yID0gbnVsbDtcbiAgICAgIF9fc3VwZXJfXy5jYWxsKHRoaXMpO1xuICAgIH1cblxuICAgIGFkZFByb3BlcnRpZXMoUmVwbGF5U3ViamVjdC5wcm90b3R5cGUsIE9ic2VydmVyLnByb3RvdHlwZSwge1xuICAgICAgX3N1YnNjcmliZTogZnVuY3Rpb24gKG8pIHtcbiAgICAgICAgY2hlY2tEaXNwb3NlZCh0aGlzKTtcbiAgICAgICAgdmFyIHNvID0gbmV3IFNjaGVkdWxlZE9ic2VydmVyKHRoaXMuc2NoZWR1bGVyLCBvKSwgc3Vic2NyaXB0aW9uID0gY3JlYXRlUmVtb3ZhYmxlRGlzcG9zYWJsZSh0aGlzLCBzbyk7XG5cbiAgICAgICAgdGhpcy5fdHJpbSh0aGlzLnNjaGVkdWxlci5ub3coKSk7XG4gICAgICAgIHRoaXMub2JzZXJ2ZXJzLnB1c2goc28pO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSB0aGlzLnEubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICBzby5vbk5leHQodGhpcy5xW2ldLnZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmhhc0Vycm9yKSB7XG4gICAgICAgICAgc28ub25FcnJvcih0aGlzLmVycm9yKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmlzU3RvcHBlZCkge1xuICAgICAgICAgIHNvLm9uQ29tcGxldGVkKCk7XG4gICAgICAgIH1cblxuICAgICAgICBzby5lbnN1cmVBY3RpdmUoKTtcbiAgICAgICAgcmV0dXJuIHN1YnNjcmlwdGlvbjtcbiAgICAgIH0sXG4gICAgICAvKipcbiAgICAgICAqIEluZGljYXRlcyB3aGV0aGVyIHRoZSBzdWJqZWN0IGhhcyBvYnNlcnZlcnMgc3Vic2NyaWJlZCB0byBpdC5cbiAgICAgICAqIEByZXR1cm5zIHtCb29sZWFufSBJbmRpY2F0ZXMgd2hldGhlciB0aGUgc3ViamVjdCBoYXMgb2JzZXJ2ZXJzIHN1YnNjcmliZWQgdG8gaXQuXG4gICAgICAgKi9cbiAgICAgIGhhc09ic2VydmVyczogZnVuY3Rpb24gKCkgeyBjaGVja0Rpc3Bvc2VkKHRoaXMpOyByZXR1cm4gdGhpcy5vYnNlcnZlcnMubGVuZ3RoID4gMDsgfSxcbiAgICAgIF90cmltOiBmdW5jdGlvbiAobm93KSB7XG4gICAgICAgIHdoaWxlICh0aGlzLnEubGVuZ3RoID4gdGhpcy5idWZmZXJTaXplKSB7XG4gICAgICAgICAgdGhpcy5xLnNoaWZ0KCk7XG4gICAgICAgIH1cbiAgICAgICAgd2hpbGUgKHRoaXMucS5sZW5ndGggPiAwICYmIChub3cgLSB0aGlzLnFbMF0uaW50ZXJ2YWwpID4gdGhpcy53aW5kb3dTaXplKSB7XG4gICAgICAgICAgdGhpcy5xLnNoaWZ0KCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAvKipcbiAgICAgICAqIE5vdGlmaWVzIGFsbCBzdWJzY3JpYmVkIG9ic2VydmVycyBhYm91dCB0aGUgYXJyaXZhbCBvZiB0aGUgc3BlY2lmaWVkIGVsZW1lbnQgaW4gdGhlIHNlcXVlbmNlLlxuICAgICAgICogQHBhcmFtIHtNaXhlZH0gdmFsdWUgVGhlIHZhbHVlIHRvIHNlbmQgdG8gYWxsIG9ic2VydmVycy5cbiAgICAgICAqL1xuICAgICAgb25OZXh0OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgY2hlY2tEaXNwb3NlZCh0aGlzKTtcbiAgICAgICAgaWYgKHRoaXMuaXNTdG9wcGVkKSB7IHJldHVybjsgfVxuICAgICAgICB2YXIgbm93ID0gdGhpcy5zY2hlZHVsZXIubm93KCk7XG4gICAgICAgIHRoaXMucS5wdXNoKHsgaW50ZXJ2YWw6IG5vdywgdmFsdWU6IHZhbHVlIH0pO1xuICAgICAgICB0aGlzLl90cmltKG5vdyk7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIG9zID0gY2xvbmVBcnJheSh0aGlzLm9ic2VydmVycyksIGxlbiA9IG9zLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgdmFyIG9ic2VydmVyID0gb3NbaV07XG4gICAgICAgICAgb2JzZXJ2ZXIub25OZXh0KHZhbHVlKTtcbiAgICAgICAgICBvYnNlcnZlci5lbnN1cmVBY3RpdmUoKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIC8qKlxuICAgICAgICogTm90aWZpZXMgYWxsIHN1YnNjcmliZWQgb2JzZXJ2ZXJzIGFib3V0IHRoZSBleGNlcHRpb24uXG4gICAgICAgKiBAcGFyYW0ge01peGVkfSBlcnJvciBUaGUgZXhjZXB0aW9uIHRvIHNlbmQgdG8gYWxsIG9ic2VydmVycy5cbiAgICAgICAqL1xuICAgICAgb25FcnJvcjogZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgIGNoZWNrRGlzcG9zZWQodGhpcyk7XG4gICAgICAgIGlmICh0aGlzLmlzU3RvcHBlZCkgeyByZXR1cm47IH1cbiAgICAgICAgdGhpcy5pc1N0b3BwZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLmVycm9yID0gZXJyb3I7XG4gICAgICAgIHRoaXMuaGFzRXJyb3IgPSB0cnVlO1xuICAgICAgICB2YXIgbm93ID0gdGhpcy5zY2hlZHVsZXIubm93KCk7XG4gICAgICAgIHRoaXMuX3RyaW0obm93KTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIG9zID0gY2xvbmVBcnJheSh0aGlzLm9ic2VydmVycyksIGxlbiA9IG9zLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgdmFyIG9ic2VydmVyID0gb3NbaV07XG4gICAgICAgICAgb2JzZXJ2ZXIub25FcnJvcihlcnJvcik7XG4gICAgICAgICAgb2JzZXJ2ZXIuZW5zdXJlQWN0aXZlKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5vYnNlcnZlcnMubGVuZ3RoID0gMDtcbiAgICAgIH0sXG4gICAgICAvKipcbiAgICAgICAqIE5vdGlmaWVzIGFsbCBzdWJzY3JpYmVkIG9ic2VydmVycyBhYm91dCB0aGUgZW5kIG9mIHRoZSBzZXF1ZW5jZS5cbiAgICAgICAqL1xuICAgICAgb25Db21wbGV0ZWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2hlY2tEaXNwb3NlZCh0aGlzKTtcbiAgICAgICAgaWYgKHRoaXMuaXNTdG9wcGVkKSB7IHJldHVybjsgfVxuICAgICAgICB0aGlzLmlzU3RvcHBlZCA9IHRydWU7XG4gICAgICAgIHZhciBub3cgPSB0aGlzLnNjaGVkdWxlci5ub3coKTtcbiAgICAgICAgdGhpcy5fdHJpbShub3cpO1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgb3MgPSBjbG9uZUFycmF5KHRoaXMub2JzZXJ2ZXJzKSwgbGVuID0gb3MubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICB2YXIgb2JzZXJ2ZXIgPSBvc1tpXTtcbiAgICAgICAgICBvYnNlcnZlci5vbkNvbXBsZXRlZCgpO1xuICAgICAgICAgIG9ic2VydmVyLmVuc3VyZUFjdGl2ZSgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMub2JzZXJ2ZXJzLmxlbmd0aCA9IDA7XG4gICAgICB9LFxuICAgICAgLyoqXG4gICAgICAgKiBVbnN1YnNjcmliZSBhbGwgb2JzZXJ2ZXJzIGFuZCByZWxlYXNlIHJlc291cmNlcy5cbiAgICAgICAqL1xuICAgICAgZGlzcG9zZTogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmlzRGlzcG9zZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLm9ic2VydmVycyA9IG51bGw7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gUmVwbGF5U3ViamVjdDtcbiAgfShPYnNlcnZhYmxlKSk7XG5cbiAgLyoqXG4gICogVXNlZCB0byBwYXVzZSBhbmQgcmVzdW1lIHN0cmVhbXMuXG4gICovXG4gIFJ4LlBhdXNlciA9IChmdW5jdGlvbiAoX19zdXBlcl9fKSB7XG4gICAgaW5oZXJpdHMoUGF1c2VyLCBfX3N1cGVyX18pO1xuICAgIGZ1bmN0aW9uIFBhdXNlcigpIHtcbiAgICAgIF9fc3VwZXJfXy5jYWxsKHRoaXMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFBhdXNlcyB0aGUgdW5kZXJseWluZyBzZXF1ZW5jZS5cbiAgICAgKi9cbiAgICBQYXVzZXIucHJvdG90eXBlLnBhdXNlID0gZnVuY3Rpb24gKCkgeyB0aGlzLm9uTmV4dChmYWxzZSk7IH07XG5cbiAgICAvKipcbiAgICAqIFJlc3VtZXMgdGhlIHVuZGVybHlpbmcgc2VxdWVuY2UuXG4gICAgKi9cbiAgICBQYXVzZXIucHJvdG90eXBlLnJlc3VtZSA9IGZ1bmN0aW9uICgpIHsgdGhpcy5vbk5leHQodHJ1ZSk7IH07XG5cbiAgICByZXR1cm4gUGF1c2VyO1xuICB9KFN1YmplY3QpKTtcblxuICBpZiAodHlwZW9mIGRlZmluZSA9PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBkZWZpbmUuYW1kID09ICdvYmplY3QnICYmIGRlZmluZS5hbWQpIHtcbiAgICByb290LlJ4ID0gUng7XG5cbiAgICBkZWZpbmUoZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gUng7XG4gICAgfSk7XG4gIH0gZWxzZSBpZiAoZnJlZUV4cG9ydHMgJiYgZnJlZU1vZHVsZSkge1xuICAgIC8vIGluIE5vZGUuanMgb3IgUmluZ29KU1xuICAgIGlmIChtb2R1bGVFeHBvcnRzKSB7XG4gICAgICAoZnJlZU1vZHVsZS5leHBvcnRzID0gUngpLlJ4ID0gUng7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZyZWVFeHBvcnRzLlJ4ID0gUng7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIC8vIGluIGEgYnJvd3NlciBvciBSaGlub1xuICAgIHJvb3QuUnggPSBSeDtcbiAgfVxuXG4gIC8vIEFsbCBjb2RlIGJlZm9yZSB0aGlzIHBvaW50IHdpbGwgYmUgZmlsdGVyZWQgZnJvbSBzdGFjayB0cmFjZXMuXG4gIHZhciByRW5kaW5nTGluZSA9IGNhcHR1cmVMaW5lKCk7XG5cbn0uY2FsbCh0aGlzKSk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcngtbGl0ZS9yeC5saXRlLmpzXG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG4vLyBjYWNoZWQgZnJvbSB3aGF0ZXZlciBnbG9iYWwgaXMgcHJlc2VudCBzbyB0aGF0IHRlc3QgcnVubmVycyB0aGF0IHN0dWIgaXRcbi8vIGRvbid0IGJyZWFrIHRoaW5ncy4gIEJ1dCB3ZSBuZWVkIHRvIHdyYXAgaXQgaW4gYSB0cnkgY2F0Y2ggaW4gY2FzZSBpdCBpc1xuLy8gd3JhcHBlZCBpbiBzdHJpY3QgbW9kZSBjb2RlIHdoaWNoIGRvZXNuJ3QgZGVmaW5lIGFueSBnbG9iYWxzLiAgSXQncyBpbnNpZGUgYVxuLy8gZnVuY3Rpb24gYmVjYXVzZSB0cnkvY2F0Y2hlcyBkZW9wdGltaXplIGluIGNlcnRhaW4gZW5naW5lcy5cblxudmFyIGNhY2hlZFNldFRpbWVvdXQ7XG52YXIgY2FjaGVkQ2xlYXJUaW1lb3V0O1xuXG5mdW5jdGlvbiBkZWZhdWx0U2V0VGltb3V0KCkge1xuICAgIHRocm93IG5ldyBFcnJvcignc2V0VGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuZnVuY3Rpb24gZGVmYXVsdENsZWFyVGltZW91dCAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdjbGVhclRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbihmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBzZXRUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBjbGVhclRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgfVxufSAoKSlcbmZ1bmN0aW9uIHJ1blRpbWVvdXQoZnVuKSB7XG4gICAgaWYgKGNhY2hlZFNldFRpbWVvdXQgPT09IHNldFRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIC8vIGlmIHNldFRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRTZXRUaW1lb3V0ID09PSBkZWZhdWx0U2V0VGltb3V0IHx8ICFjYWNoZWRTZXRUaW1lb3V0KSAmJiBzZXRUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfSBjYXRjaChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbChudWxsLCBmdW4sIDApO1xuICAgICAgICB9IGNhdGNoKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3JcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwodGhpcywgZnVuLCAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG59XG5mdW5jdGlvbiBydW5DbGVhclRpbWVvdXQobWFya2VyKSB7XG4gICAgaWYgKGNhY2hlZENsZWFyVGltZW91dCA9PT0gY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIC8vIGlmIGNsZWFyVGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZENsZWFyVGltZW91dCA9PT0gZGVmYXVsdENsZWFyVGltZW91dCB8fCAhY2FjaGVkQ2xlYXJUaW1lb3V0KSAmJiBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0ICB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKG51bGwsIG1hcmtlcik7XG4gICAgICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3IuXG4gICAgICAgICAgICAvLyBTb21lIHZlcnNpb25zIG9mIEkuRS4gaGF2ZSBkaWZmZXJlbnQgcnVsZXMgZm9yIGNsZWFyVGltZW91dCB2cyBzZXRUaW1lb3V0XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwodGhpcywgbWFya2VyKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbn1cbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGlmICghZHJhaW5pbmcgfHwgIWN1cnJlbnRRdWV1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHJ1blRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIHJ1bkNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHJ1blRpbWVvdXQoZHJhaW5RdWV1ZSk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcHJvY2Vzcy9icm93c2VyLmpzXG4vLyBtb2R1bGUgaWQgPSAxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0ge1xuXHRcIm5hbWVcIjogXCJ0ZXNzZXJhY3QuanNcIixcblx0XCJ2ZXJzaW9uXCI6IFwiMS4wLjEwXCIsXG5cdFwiZGVzY3JpcHRpb25cIjogXCJQdXJlIEphdmFzY3JpcHQgTXVsdGlsaW5ndWFsIE9DUlwiLFxuXHRcIm1haW5cIjogXCJzcmMvaW5kZXguanNcIixcblx0XCJzY3JpcHRzXCI6IHtcblx0XHRcInRlc3RcIjogXCJlY2hvIFxcXCJFcnJvcjogbm8gdGVzdCBzcGVjaWZpZWRcXFwiICYgZXhpdCAxXCIsXG5cdFx0XCJzdGFydFwiOiBcIndhdGNoaWZ5IHNyYy9pbmRleC5qcyAgLXQgWyBlbnZpZnkgLS1OT0RFX0VOViBkZXZlbG9wbWVudCBdIC10IFsgYmFiZWxpZnkgLS1wcmVzZXRzIFsgZXMyMDE1IF0gXSAtbyBkaXN0L3Rlc3NlcmFjdC5kZXYuanMgLS1zdGFuZGFsb25lIFRlc3NlcmFjdCAmIHdhdGNoaWZ5IHNyYy9icm93c2VyL3dvcmtlci5qcyAgLXQgWyBlbnZpZnkgLS1OT0RFX0VOViBkZXZlbG9wbWVudCBdIC10IFsgYmFiZWxpZnkgLS1wcmVzZXRzIFsgZXMyMDE1IF0gXSAtbyBkaXN0L3dvcmtlci5kZXYuanMgJiBodHRwLXNlcnZlciAtcCA3MzU1XCIsXG5cdFx0XCJidWlsZFwiOiBcImJyb3dzZXJpZnkgc3JjL2luZGV4LmpzIC10IFsgYmFiZWxpZnkgLS1wcmVzZXRzIFsgZXMyMDE1IF0gXSAtbyBkaXN0L3Rlc3NlcmFjdC5qcyAtLXN0YW5kYWxvbmUgVGVzc2VyYWN0ICYmIGJyb3dzZXJpZnkgc3JjL2Jyb3dzZXIvd29ya2VyLmpzIC10IFsgYmFiZWxpZnkgLS1wcmVzZXRzIFsgZXMyMDE1IF0gXSAtbyBkaXN0L3dvcmtlci5qc1wiLFxuXHRcdFwicmVsZWFzZVwiOiBcIm5wbSBydW4gYnVpbGQgJiYgZ2l0IGNvbW1pdCAtYW0gJ25ldyByZWxlYXNlJyAmJiBnaXQgcHVzaCAmJiBnaXQgdGFnIGBqcSAtciAnLnZlcnNpb24nIHBhY2thZ2UuanNvbmAgJiYgZ2l0IHB1c2ggb3JpZ2luIC0tdGFncyAmJiBucG0gcHVibGlzaFwiXG5cdH0sXG5cdFwiYnJvd3NlclwiOiB7XG5cdFx0XCIuL3NyYy9ub2RlL2luZGV4LmpzXCI6IFwiLi9zcmMvYnJvd3Nlci9pbmRleC5qc1wiXG5cdH0sXG5cdFwiYXV0aG9yXCI6IFwiXCIsXG5cdFwibGljZW5zZVwiOiBcIkFwYWNoZS0yLjBcIixcblx0XCJkZXZEZXBlbmRlbmNpZXNcIjoge1xuXHRcdFwiYmFiZWwtcHJlc2V0LWVzMjAxNVwiOiBcIl42LjE2LjBcIixcblx0XHRcImJhYmVsaWZ5XCI6IFwiXjcuMy4wXCIsXG5cdFx0XCJicm93c2VyaWZ5XCI6IFwiXjEzLjEuMFwiLFxuXHRcdFwiZW52aWZ5XCI6IFwiXjMuNC4xXCIsXG5cdFx0XCJodHRwLXNlcnZlclwiOiBcIl4wLjkuMFwiLFxuXHRcdFwicGFrb1wiOiBcIl4xLjAuM1wiLFxuXHRcdFwid2F0Y2hpZnlcIjogXCJeMy43LjBcIlxuXHR9LFxuXHRcImRlcGVuZGVuY2llc1wiOiB7XG5cdFx0XCJmaWxlLXR5cGVcIjogXCJeMy44LjBcIixcblx0XHRcImlzLXVybFwiOiBcIl4xLjIuMlwiLFxuXHRcdFwianBlZy1qc1wiOiBcIl4wLjIuMFwiLFxuXHRcdFwibGV2ZWwtanNcIjogXCJeMi4yLjRcIixcblx0XHRcIm5vZGUtZmV0Y2hcIjogXCJeMS42LjNcIixcblx0XHRcIm9iamVjdC1hc3NpZ25cIjogXCJeNC4xLjBcIixcblx0XHRcInBuZy5qc1wiOiBcIl4wLjIuMVwiLFxuXHRcdFwidGVzc2VyYWN0LmpzLWNvcmVcIjogXCJeMS4wLjJcIlxuXHR9LFxuXHRcInJlcG9zaXRvcnlcIjoge1xuXHRcdFwidHlwZVwiOiBcImdpdFwiLFxuXHRcdFwidXJsXCI6IFwiaHR0cHM6Ly9naXRodWIuY29tL25hcHRoYS90ZXNzZXJhY3QuanMuZ2l0XCJcblx0fSxcblx0XCJidWdzXCI6IHtcblx0XHRcInVybFwiOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9uYXB0aGEvdGVzc2VyYWN0LmpzL2lzc3Vlc1wiXG5cdH0sXG5cdFwiaG9tZXBhZ2VcIjogXCJodHRwczovL2dpdGh1Yi5jb20vbmFwdGhhL3Rlc3NlcmFjdC5qc1wiXG59O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi90ZXNzZXJhY3QuanMvcGFja2FnZS5qc29uXG4vLyBtb2R1bGUgaWQgPSAyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgICAvLyB3b3JrZXJQYXRoOiAnaHR0cHM6Ly9jZG4ucmF3Z2l0LmNvbS9uYXB0aGEvdGVzc2VyYWN0LmpzLzAuMi4wL2Rpc3Qvd29ya2VyLmpzJyxcbiAgICBjb3JlUGF0aDogJ2h0dHBzOi8vY2RuLnJhd2dpdC5jb20vbmFwdGhhL3Rlc3NlcmFjdC5qcy1jb3JlLzAuMS4wL2luZGV4LmpzJywgICAgXG4gICAgbGFuZ1BhdGg6ICdodHRwczovL2Nkbi5yYXdnaXQuY29tL25hcHRoYS90ZXNzZGF0YS9naC1wYWdlcy8zLjAyLycsXG59XG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gXCJkZXZlbG9wbWVudFwiKSB7XG4gICAgY29uc29sZS5kZWJ1ZygnVXNpbmcgRGV2ZWxvcG1lbnQgQ29uZmlndXJhdGlvbicpXG4gICAgZGVmYXVsdE9wdGlvbnMud29ya2VyUGF0aCA9IGxvY2F0aW9uLnByb3RvY29sICsgJy8vJyArIGxvY2F0aW9uLmhvc3QgKyAnL2Rpc3Qvd29ya2VyLmRldi5qcz9ub2NhY2hlPScgKyBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zbGljZSgzKVxufWVsc2V7XG4gICAgdmFyIHZlcnNpb24gPSByZXF1aXJlKCcuLi8uLi9wYWNrYWdlLmpzb24nKS52ZXJzaW9uO1xuICAgIGRlZmF1bHRPcHRpb25zLndvcmtlclBhdGggPSAnaHR0cHM6Ly9jZG4ucmF3Z2l0LmNvbS9uYXB0aGEvdGVzc2VyYWN0LmpzLycgKyB2ZXJzaW9uICsgJy9kaXN0L3dvcmtlci5qcydcbn1cblxuZXhwb3J0cy5kZWZhdWx0T3B0aW9ucyA9IGRlZmF1bHRPcHRpb25zO1xuXG5cbmV4cG9ydHMuc3Bhd25Xb3JrZXIgPSBmdW5jdGlvbiBzcGF3bldvcmtlcihpbnN0YW5jZSwgd29ya2VyT3B0aW9ucyl7XG4gICAgaWYod2luZG93LkJsb2IgJiYgd2luZG93LlVSTCl7XG4gICAgICAgIHZhciBibG9iID0gbmV3IEJsb2IoWydpbXBvcnRTY3JpcHRzKFwiJyArIHdvcmtlck9wdGlvbnMud29ya2VyUGF0aCArICdcIik7J10pXG4gICAgICAgIHZhciB3b3JrZXIgPSBuZXcgV29ya2VyKHdpbmRvdy5VUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpKTtcbiAgICB9ZWxzZXtcbiAgICAgICAgdmFyIHdvcmtlciA9IG5ldyBXb3JrZXIod29ya2VyT3B0aW9ucy53b3JrZXJQYXRoKVxuICAgIH1cblxuICAgIHdvcmtlci5vbm1lc3NhZ2UgPSBmdW5jdGlvbihlKXtcbiAgICAgICAgdmFyIHBhY2tldCA9IGUuZGF0YTtcbiAgICAgICAgaW5zdGFuY2UuX3JlY3YocGFja2V0KVxuICAgIH1cbiAgICByZXR1cm4gd29ya2VyXG59XG5cbmV4cG9ydHMudGVybWluYXRlV29ya2VyID0gZnVuY3Rpb24oaW5zdGFuY2Upe1xuICAgIGluc3RhbmNlLndvcmtlci50ZXJtaW5hdGUoKVxufVxuXG5leHBvcnRzLnNlbmRQYWNrZXQgPSBmdW5jdGlvbiBzZW5kUGFja2V0KGluc3RhbmNlLCBwYWNrZXQpe1xuICAgIGxvYWRJbWFnZShwYWNrZXQucGF5bG9hZC5pbWFnZSwgZnVuY3Rpb24oaW1nKXtcbiAgICAgICAgcGFja2V0LnBheWxvYWQuaW1hZ2UgPSBpbWdcbiAgICAgICAgaW5zdGFuY2Uud29ya2VyLnBvc3RNZXNzYWdlKHBhY2tldCkgXG4gICAgfSlcbn1cblxuXG5mdW5jdGlvbiBsb2FkSW1hZ2UoaW1hZ2UsIGNiKXtcbiAgICBpZih0eXBlb2YgaW1hZ2UgPT09ICdzdHJpbmcnKXtcbiAgICAgICAgaWYoL15cXCMvLnRlc3QoaW1hZ2UpKXtcbiAgICAgICAgICAgIC8vIGVsZW1lbnQgY3NzIHNlbGVjdG9yXG4gICAgICAgICAgICByZXR1cm4gbG9hZEltYWdlKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoaW1hZ2UpLCBjYilcbiAgICAgICAgfWVsc2UgaWYoLyhibG9ifGRhdGEpXFw6Ly50ZXN0KGltYWdlKSl7XG4gICAgICAgICAgICAvLyBkYXRhIHVybFxuICAgICAgICAgICAgdmFyIGltID0gbmV3IEltYWdlXG4gICAgICAgICAgICBpbS5zcmMgPSBpbWFnZTtcbiAgICAgICAgICAgIGltLm9ubG9hZCA9IGUgPT4gbG9hZEltYWdlKGltLCBjYik7XG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgICAgICB4aHIub3BlbignR0VUJywgaW1hZ2UsIHRydWUpXG4gICAgICAgICAgICB4aHIucmVzcG9uc2VUeXBlID0gXCJibG9iXCI7XG4gICAgICAgICAgICB4aHIub25sb2FkID0gZSA9PiBsb2FkSW1hZ2UoeGhyLnJlc3BvbnNlLCBjYik7XG4gICAgICAgICAgICB4aHIub25lcnJvciA9IGZ1bmN0aW9uKGUpe1xuICAgICAgICAgICAgICAgIGlmKC9eaHR0cHM/OlxcL1xcLy8udGVzdChpbWFnZSkgJiYgIS9eaHR0cHM6XFwvXFwvY3Jvc3NvcmlnaW4ubWUvLnRlc3QoaW1hZ2UpKXtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5kZWJ1ZygnQXR0ZW1wdGluZyB0byBsb2FkIGltYWdlIHdpdGggQ09SUyBwcm94eScpXG4gICAgICAgICAgICAgICAgICAgIGxvYWRJbWFnZSgnaHR0cHM6Ly9jcm9zc29yaWdpbi5tZS8nICsgaW1hZ2UsIGNiKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHhoci5zZW5kKG51bGwpXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgIH1lbHNlIGlmKGltYWdlIGluc3RhbmNlb2YgRmlsZSl7XG4gICAgICAgIC8vIGZpbGVzXG4gICAgICAgIHZhciBmciA9IG5ldyBGaWxlUmVhZGVyKClcbiAgICAgICAgZnIub25sb2FkID0gZSA9PiBsb2FkSW1hZ2UoZnIucmVzdWx0LCBjYik7XG4gICAgICAgIGZyLnJlYWRBc0RhdGFVUkwoaW1hZ2UpXG4gICAgICAgIHJldHVyblxuICAgIH1lbHNlIGlmKGltYWdlIGluc3RhbmNlb2YgQmxvYil7XG4gICAgICAgIHJldHVybiBsb2FkSW1hZ2UoVVJMLmNyZWF0ZU9iamVjdFVSTChpbWFnZSksIGNiKVxuICAgIH1lbHNlIGlmKGltYWdlLmdldENvbnRleHQpe1xuICAgICAgICAvLyBjYW52YXMgZWxlbWVudFxuICAgICAgICByZXR1cm4gbG9hZEltYWdlKGltYWdlLmdldENvbnRleHQoJzJkJyksIGNiKVxuICAgIH1lbHNlIGlmKGltYWdlLnRhZ05hbWUgPT0gXCJJTUdcIiB8fCBpbWFnZS50YWdOYW1lID09IFwiVklERU9cIil7XG4gICAgICAgIC8vIGltYWdlIGVsZW1lbnQgb3IgdmlkZW8gZWxlbWVudFxuICAgICAgICB2YXIgYyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgICAgICBjLndpZHRoICA9IGltYWdlLm5hdHVyYWxXaWR0aCAgfHwgaW1hZ2UudmlkZW9XaWR0aDtcbiAgICAgICAgYy5oZWlnaHQgPSBpbWFnZS5uYXR1cmFsSGVpZ2h0IHx8IGltYWdlLnZpZGVvSGVpZ2h0O1xuICAgICAgICB2YXIgY3R4ID0gYy5nZXRDb250ZXh0KCcyZCcpO1xuICAgICAgICBjdHguZHJhd0ltYWdlKGltYWdlLCAwLCAwKTtcbiAgICAgICAgcmV0dXJuIGxvYWRJbWFnZShjdHgsIGNiKVxuICAgIH1lbHNlIGlmKGltYWdlLmdldEltYWdlRGF0YSl7XG4gICAgICAgIC8vIGNhbnZhcyBjb250ZXh0XG4gICAgICAgIHZhciBkYXRhID0gaW1hZ2UuZ2V0SW1hZ2VEYXRhKDAsIDAsIGltYWdlLmNhbnZhcy53aWR0aCwgaW1hZ2UuY2FudmFzLmhlaWdodCk7XG4gICAgICAgIHJldHVybiBsb2FkSW1hZ2UoZGF0YSwgY2IpXG4gICAgfWVsc2V7XG4gICAgICAgIHJldHVybiBjYihpbWFnZSlcbiAgICB9XG4gICAgdGhyb3cgbmV3IEVycm9yKCdNaXNzaW5nIHJldHVybiBpbiBsb2FkSW1hZ2UgY2FzY2FkZScpXG5cbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi90ZXNzZXJhY3QuanMvc3JjL2Jyb3dzZXIvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZnVuY3Rpb24gX2FzeW5jVG9HZW5lcmF0b3IoZm4pIHsgcmV0dXJuIGZ1bmN0aW9uICgpIHsgdmFyIGdlbiA9IGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7IGZ1bmN0aW9uIHN0ZXAoa2V5LCBhcmcpIHsgdHJ5IHsgdmFyIGluZm8gPSBnZW5ba2V5XShhcmcpOyB2YXIgdmFsdWUgPSBpbmZvLnZhbHVlOyB9IGNhdGNoIChlcnJvcikgeyByZWplY3QoZXJyb3IpOyByZXR1cm47IH0gaWYgKGluZm8uZG9uZSkgeyByZXNvbHZlKHZhbHVlKTsgfSBlbHNlIHsgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh2YWx1ZSkudGhlbihmdW5jdGlvbiAodmFsdWUpIHsgc3RlcChcIm5leHRcIiwgdmFsdWUpOyB9LCBmdW5jdGlvbiAoZXJyKSB7IHN0ZXAoXCJ0aHJvd1wiLCBlcnIpOyB9KTsgfSB9IHJldHVybiBzdGVwKFwibmV4dFwiKTsgfSk7IH07IH1cblxuLyoqXG4gKiBGaWxlIGFuZCBEaXJlY3RvcnkgRW50cmllcyBBUEkg6Zai6YCj44Gu5rGO55SoQVBJXG4gKiAgLSDln7rmnKxBUEnjgYzjgrPjg7zjg6vjg5Djg4Pjgq/kuLvkvZPjgarjga7jgafjgIFQcm9taXNl44OZ44O844K544Go44Gq44KL44KI44GGd3JhcFxuICovXG5cbi8qKlxuICogRmlsZVN5c3RlbUZpbGVFbnRyeeOCquODluOCuOOCp+OCr+ODiOOBi+OCiUZpbGXjgqrjg5bjgrjjgqfjgq/jg4jjgpLnlJ/miJBcbiAqL1xuZXhwb3J0IGNvbnN0IGNyZWF0ZUZpbGUgPSAoKCkgPT4ge1xuICB2YXIgX3JlZiA9IF9hc3luY1RvR2VuZXJhdG9yKGZ1bmN0aW9uKiAoZW50cnkpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgZW50cnkuZmlsZShmdW5jdGlvbiAoZmlsZSkge1xuICAgICAgICByZXR1cm4gcmVzb2x2ZShmaWxlKTtcbiAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgcmV0dXJuIHJlamVjdChlcnIpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIHJldHVybiBmdW5jdGlvbiBjcmVhdGVGaWxlKF94KSB7XG4gICAgcmV0dXJuIF9yZWYuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfTtcbn0pKCk7XG5cbi8qKlxuICogIEZpbGVTeXN0ZW1FbnRyeeOCkuWGjeW4sOeahOOBq+i1sOafu+OBl+OAgUZpbGXjgqrjg5bjgrjjgqfjgq/jg4jjgpLlj5blvpdcbiAqL1xuZXhwb3J0IGNvbnN0IHNjYW5FbnRyeSA9ICgoKSA9PiB7XG4gIHZhciBfcmVmMiA9IF9hc3luY1RvR2VuZXJhdG9yKGZ1bmN0aW9uKiAoZW50cnkpIHtcbiAgICAvLyDjg5XjgqHjgqTjg6vjga7loLTlkIhcbiAgICBpZiAoZW50cnkuaXNGaWxlKSB7XG4gICAgICByZXR1cm4gY3JlYXRlRmlsZShlbnRyeSk7XG4gICAgfVxuXG4gICAgLy8g44OH44Kj44Os44Kv44OI44Oq44Gu5aC05ZCIOiDlho3luLDnmoTjgarotbDmn7tcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgY29uc3QgcmVhZGVyID0gZW50cnkuY3JlYXRlUmVhZGVyKCk7XG4gICAgICByZWFkZXIucmVhZEVudHJpZXMoKCgpID0+IHtcbiAgICAgICAgdmFyIF9yZWYzID0gX2FzeW5jVG9HZW5lcmF0b3IoZnVuY3Rpb24qIChlbnRyaWVzKSB7XG4gICAgICAgICAgY29uc3QgcmVzdWx0cyA9IHlpZWxkIFByb21pc2UuYWxsKGVudHJpZXMubWFwKHNjYW5FbnRyeSkpO1xuICAgICAgICAgIHJlc29sdmUocmVzdWx0cy5yZWR1Y2UoZnVuY3Rpb24gKHB2LCBjdikge1xuICAgICAgICAgICAgY3YgPSBBcnJheS5pc0FycmF5KGN2KSA/IGN2IDogW2N2XTtcbiAgICAgICAgICAgIHJldHVybiBbLi4ucHYsIC4uLmN2XTtcbiAgICAgICAgICB9LCBbXSkpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKF94Mykge1xuICAgICAgICAgIHJldHVybiBfcmVmMy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9O1xuICAgICAgfSkoKSk7XG4gICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgcmV0dXJuIHJlamVjdChlcnIpO1xuICAgIH0pO1xuICB9KTtcblxuICByZXR1cm4gZnVuY3Rpb24gc2NhbkVudHJ5KF94Mikge1xuICAgIHJldHVybiBfcmVmMi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9O1xufSkoKTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJbk55WTF4Y1ptbHNaWFYwYVd4ekxtcHpJbDBzSW01aGJXVnpJanBiSW1OeVpXRjBaVVpwYkdVaUxDSmxiblJ5ZVNJc0lsQnliMjFwYzJVaUxDSnlaWE52YkhabElpd2ljbVZxWldOMElpd2labWxzWlNJc0ltVnljaUlzSW5OallXNUZiblJ5ZVNJc0ltbHpSbWxzWlNJc0luSmxZV1JsY2lJc0ltTnlaV0YwWlZKbFlXUmxjaUlzSW5KbFlXUkZiblJ5YVdWeklpd2laVzUwY21sbGN5SXNJbkpsYzNWc2RITWlMQ0poYkd3aUxDSnRZWEFpTENKeVpXUjFZMlVpTENKd2RpSXNJbU4ySWl3aVFYSnlZWGtpTENKcGMwRnljbUY1SWwwc0ltMWhjSEJwYm1keklqb2lPenRCUVVGQk96czdPenRCUVV0Qk96czdRVUZIUVN4UFFVRlBMRTFCUVUxQk8wRkJRVUVzSzBKQlFXRXNWMEZCVFVNc1MwRkJUanRCUVVGQkxGZEJRM2hDTEVsQlFVbERMRTlCUVVvc1EwRkJXU3hWUVVGRFF5eFBRVUZFTEVWQlFWVkRMRTFCUVZZc1JVRkJjVUk3UVVGREwwSklMRmxCUVUxSkxFbEJRVTRzUTBGQlZ6dEJRVUZCTEdWQlFWRkdMRkZCUVZGRkxFbEJRVklzUTBGQlVqdEJRVUZCTEU5QlFWZ3NSVUZCYTBNN1FVRkJRU3hsUVVGUFJDeFBRVUZQUlN4SFFVRlFMRU5CUVZBN1FVRkJRU3hQUVVGc1F6dEJRVU5FTEV0QlJrUXNRMEZFZDBJN1FVRkJRU3hIUVVGaU96dEJRVUZCTzBGQlFVRTdRVUZCUVR0QlFVRkJMRWxCUVU0N08wRkJTMUE3T3p0QlFVZEJMRTlCUVU4c1RVRkJUVU03UVVGQlFTeG5RMEZCV1N4WFFVRlBUaXhMUVVGUUxFVkJRV3RETzBGQlEzcEVPMEZCUTBFc1VVRkJTVUVzVFVGQlRVOHNUVUZCVml4RlFVRnJRanRCUVVOb1FpeGhRVUZQVWl4WFFVRlhReXhMUVVGWUxFTkJRVkE3UVVGRFJEczdRVUZGUkR0QlFVTkJMRmRCUVU4c1NVRkJTVU1zVDBGQlNpeERRVUZaTEZWQlFVTkRMRTlCUVVRc1JVRkJWVU1zVFVGQlZpeEZRVUZ4UWp0QlFVTjBReXhaUVVGTlN5eFRRVUZUVWl4TlFVRk5VeXhaUVVGT0xFVkJRV1k3UVVGRFFVUXNZVUZCVDBVc1YwRkJVRHRCUVVGQkxITkRRVUZ0UWl4WFFVRk5ReXhQUVVGT0xFVkJRV2xDTzBGQlEyeERMR2RDUVVGTlF5eFZRVUZWTEUxQlFVMVlMRkZCUVZGWkxFZEJRVklzUTBGQldVWXNVVUZCVVVjc1IwRkJVaXhEUVVGWlVpeFRRVUZhTEVOQlFWb3NRMEZCZEVJN1FVRkRRVW9zYTBKQlFWRlZMRkZCUVZGSExFMUJRVklzUTBGQlpTeFZRVUZEUXl4RlFVRkVMRVZCUVV0RExFVkJRVXdzUlVGQldUdEJRVU5xUTBFc2FVSkJRVXRETEUxQlFVMURMRTlCUVU0c1EwRkJZMFlzUlVGQlpDeEpRVUZ2UWtFc1JVRkJjRUlzUjBGQmVVSXNRMEZCUTBFc1JVRkJSQ3hEUVVFNVFqdEJRVU5CTEcxQ1FVRlBMRU5CUVVNc1IwRkJSMFFzUlVGQlNpeEZRVUZSTEVkQlFVZERMRVZCUVZnc1EwRkJVRHRCUVVORUxGZEJTRThzUlVGSFRDeEZRVWhMTEVOQlFWSTdRVUZKUkN4VFFVNUVPenRCUVVGQk8wRkJRVUU3UVVGQlFUdEJRVUZCTzBGQlQwUXNTMEZVVFN4RlFWTktPMEZCUVVFc1lVRkJUMlFzVDBGQlQwVXNSMEZCVUN4RFFVRlFPMEZCUVVFc1MwRlVTU3hEUVVGUU8wRkJWVVFzUjBGcVFsazdPMEZCUVVFN1FVRkJRVHRCUVVGQk8wRkJRVUVzU1VGQlRpSXNJbVpwYkdVaU9pSm1hV3hsZFhScGJITXVhbk1pTENKemIzVnlZMlZTYjI5MElqb2lSRG92UjJsMEwwZHBkRWgxWWk5dlkzSXRaR1Z0YnlJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYklpOHFLbHh1SUNvZ1JtbHNaU0JoYm1RZ1JHbHlaV04wYjNKNUlFVnVkSEpwWlhNZ1FWQkpJT21Xb3VtQW8rT0JydWF4anVlVXFFRlFTVnh1SUNvZ0lDMGc1Wis2NXB5c1FWQko0NEdNNDRLejQ0Tzg0NE9yNDRPUTQ0T0Q0NEt2NUxpNzVMMlQ0NEdxNDRHdTQ0R240NENCVUhKdmJXbHpaZU9EbWVPRHZPT0N1ZU9CcU9PQnF1T0NpK09DaU9PQmhuZHlZWEJjYmlBcUwxeHVYRzR2S2lwY2JpQXFJRVpwYkdWVGVYTjBaVzFHYVd4bFJXNTBjbm5qZ3Fyamc1YmpncmpqZ3FmamdxL2pnNGpqZ1l2amdvbEdhV3hsNDRLcTQ0T1c0NEs0NDRLbjQ0S3Y0NE9JNDRLUzU1U2Y1b2lRWEc0Z0tpOWNibVY0Y0c5eWRDQmpiMjV6ZENCamNtVmhkR1ZHYVd4bElEMGdZWE41Ym1NZ1pXNTBjbmtnUFQ1Y2JpQWdibVYzSUZCeWIyMXBjMlVvS0hKbGMyOXNkbVVzSUhKbGFtVmpkQ2tnUFQ0Z2UxeHVJQ0FnSUdWdWRISjVMbVpwYkdVb1ptbHNaU0E5UGlCeVpYTnZiSFpsS0dacGJHVXBMQ0JsY25JZ1BUNGdjbVZxWldOMEtHVnljaWtwWEc0Z0lIMHBYRzVjYmk4cUtseHVJQ29nSUVacGJHVlRlWE4wWlcxRmJuUnllZU9Da3VXR2plVzRzT2VhaE9PQnEraTFzT2FmdStPQmwrT0FnVVpwYkdYamdxcmpnNWJqZ3JqamdxZmpncS9qZzRqamdwTGxqNWJsdnBkY2JpQXFMMXh1Wlhod2IzSjBJR052Ym5OMElITmpZVzVGYm5SeWVTQTlJR0Z6ZVc1aklDaGxiblJ5ZVRvZ1JtbHNaVk41YzNSbGJVVnVkSEo1S1NBOVBpQjdYRzRnSUM4dklPT0RsZU9Db2VPQ3BPT0RxK09CcnVXZ3RPV1FpRnh1SUNCcFppQW9aVzUwY25rdWFYTkdhV3hsS1NCN1hHNGdJQ0FnY21WMGRYSnVJR055WldGMFpVWnBiR1VvWlc1MGNua3BYRzRnSUgxY2JseHVJQ0F2THlEamc0ZmpncVBqZzZ6amdxL2pnNGpqZzZyamdhN2xvTFRsa0lnNklPV0dqZVc0c09lYWhPT0JxdWkxc09hZnUxeHVJQ0J5WlhSMWNtNGdibVYzSUZCeWIyMXBjMlVvS0hKbGMyOXNkbVVzSUhKbGFtVmpkQ2tnUFQ0Z2UxeHVJQ0FnSUdOdmJuTjBJSEpsWVdSbGNpQTlJR1Z1ZEhKNUxtTnlaV0YwWlZKbFlXUmxjaWdwWEc0Z0lDQWdjbVZoWkdWeUxuSmxZV1JGYm5SeWFXVnpLR0Z6ZVc1aklHVnVkSEpwWlhNZ1BUNGdlMXh1SUNBZ0lDQWdZMjl1YzNRZ2NtVnpkV3gwY3lBOUlHRjNZV2wwSUZCeWIyMXBjMlV1WVd4c0tHVnVkSEpwWlhNdWJXRndLSE5qWVc1RmJuUnllU2twWEc0Z0lDQWdJQ0J5WlhOdmJIWmxLSEpsYzNWc2RITXVjbVZrZFdObEtDaHdkaXdnWTNZcElEMCtJSHRjYmlBZ0lDQWdJQ0FnWTNZZ1BTQkJjbkpoZVM1cGMwRnljbUY1S0dOMktTQS9JR04ySURvZ1cyTjJYVnh1SUNBZ0lDQWdJQ0J5WlhSMWNtNGdXeTR1TG5CMkxDQXVMaTVqZGwxY2JpQWdJQ0FnSUgwc0lGdGRLU2xjYmlBZ0lDQjlLVnh1SUNCOUxDQmxjbklnUFQ0Z2NtVnFaV04wS0dWeWNpa3BYRzU5WEc0aVhYMD1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9maWxldXRpbHMuanNcbi8vIG1vZHVsZSBpZCA9IDRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IFRlc3NlcmFjdCBmcm9tICd0ZXNzZXJhY3QuanMnO1xuaW1wb3J0IFJ4IGZyb20gJ3J4LWxpdGUnO1xuXG5leHBvcnQgZnVuY3Rpb24gcmVjb2duaXplKGZpbGVzLCBvcHRpb25zKSB7XG4gIGNvbnN0IGZpbGVOdW0gPSBmaWxlcy5sZW5ndGg7XG4gIGxldCBjb3VudCA9IDA7XG4gIGNvbnN0IGFsbFByb2Nlc3NlcyA9IGZpbGVzLm1hcChmaWxlID0+IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBUZXNzZXJhY3QucmVjb2duaXplKGZpbGUsIG9wdGlvbnMpLnRoZW4ocmVzdWx0ID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKGAkeysrY291bnR9LyR7ZmlsZU51bX1gKTtcbiAgICAgIHJlc29sdmUocmVzdWx0LndvcmRzLm1hcCh3ID0+IHcudGV4dCkpO1xuICAgIH0pLmNhdGNoKGVyciA9PiB7XG4gICAgICByZWplY3QoZXJyKTtcbiAgICB9KTtcbiAgfSkpO1xuXG4gIHJldHVybiBQcm9taXNlLmFsbChhbGxQcm9jZXNzZXMpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYkluTnlZMXhjYjJOeUxtcHpJbDBzSW01aGJXVnpJanBiSWxSbGMzTmxjbUZqZENJc0lsSjRJaXdpY21WamIyZHVhWHBsSWl3aVptbHNaWE1pTENKdmNIUnBiMjV6SWl3aVptbHNaVTUxYlNJc0lteGxibWQwYUNJc0ltTnZkVzUwSWl3aVlXeHNVSEp2WTJWemMyVnpJaXdpYldGd0lpd2labWxzWlNJc0lsQnliMjFwYzJVaUxDSnlaWE52YkhabElpd2ljbVZxWldOMElpd2lkR2hsYmlJc0luSmxjM1ZzZENJc0ltTnZibk52YkdVaUxDSnNiMmNpTENKM2IzSmtjeUlzSW5jaUxDSjBaWGgwSWl3aVkyRjBZMmdpTENKbGNuSWlMQ0poYkd3aVhTd2liV0Z3Y0dsdVozTWlPaUpCUVVGQkxFOUJRVTlCTEZOQlFWQXNUVUZCYzBJc1kwRkJkRUk3UVVGRFFTeFBRVUZQUXl4RlFVRlFMRTFCUVdVc1UwRkJaanM3UVVGRlFTeFBRVUZQTEZOQlFWTkRMRk5CUVZRc1EwRkJiVUpETEV0QlFXNUNMRVZCUVRCQ1F5eFBRVUV4UWl4RlFVRnRRenRCUVVONFF5eFJRVUZOUXl4VlFVRlZSaXhOUVVGTlJ5eE5RVUYwUWp0QlFVTkJMRTFCUVVsRExGRkJRVkVzUTBGQldqdEJRVU5CTEZGQlFVMURMR1ZCUVdWTUxFMUJRVTFOTEVkQlFVNHNRMEZCVlVNc1VVRkROMElzU1VGQlNVTXNUMEZCU2l4RFFVRlpMRU5CUVVORExFOUJRVVFzUlVGQlZVTXNUVUZCVml4TFFVRnhRanRCUVVNdlFtSXNZMEZCVlVVc1UwRkJWaXhEUVVGdlFsRXNTVUZCY0VJc1JVRkJNRUpPTEU5QlFURkNMRVZCUTBkVkxFbEJSRWdzUTBGRFVVTXNWVUZCVlR0QlFVTmtReXhqUVVGUlF5eEhRVUZTTEVOQlFXRXNSMEZCUlN4RlFVRkZWaXhMUVVGTkxFbEJRVWRHTEU5QlFWRXNSVUZCYkVNN1FVRkRRVThzWTBGQlVVY3NUMEZCVDBjc1MwRkJVQ3hEUVVGaFZDeEhRVUZpTEVOQlFXbENWU3hMUVVGTFFTeEZRVUZGUXl4SlFVRjRRaXhEUVVGU08wRkJRMFFzUzBGS1NDeEZRVXRIUXl4TFFVeElMRU5CUzFORExFOUJRVTg3UVVGRFdsUXNZVUZCVDFNc1IwRkJVRHRCUVVORUxFdEJVRWc3UVVGUlJDeEhRVlJFTEVOQlJHMUNMRU5CUVhKQ096dEJRV0ZCTEZOQlFVOVlMRkZCUVZGWkxFZEJRVklzUTBGQldXWXNXVUZCV2l4RFFVRlFPMEZCUTBRaUxDSm1hV3hsSWpvaWIyTnlMbXB6SWl3aWMyOTFjbU5sVW05dmRDSTZJa1E2TDBkcGRDOUhhWFJJZFdJdmIyTnlMV1JsYlc4aUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SnBiWEJ2Y25RZ1ZHVnpjMlZ5WVdOMElHWnliMjBnSjNSbGMzTmxjbUZqZEM1cWN5ZGNibWx0Y0c5eWRDQlNlQ0JtY205dElDZHllQzFzYVhSbEoxeHVYRzVsZUhCdmNuUWdablZ1WTNScGIyNGdjbVZqYjJkdWFYcGxLR1pwYkdWekxDQnZjSFJwYjI1ektTQjdYRzRnSUdOdmJuTjBJR1pwYkdWT2RXMGdQU0JtYVd4bGN5NXNaVzVuZEdoY2JpQWdiR1YwSUdOdmRXNTBJRDBnTUZ4dUlDQmpiMjV6ZENCaGJHeFFjbTlqWlhOelpYTWdQU0JtYVd4bGN5NXRZWEFvWm1sc1pTQTlQbHh1SUNBZ0lHNWxkeUJRY205dGFYTmxLQ2h5WlhOdmJIWmxMQ0J5WldwbFkzUXBJRDArSUh0Y2JpQWdJQ0FnSUZSbGMzTmxjbUZqZEM1eVpXTnZaMjVwZW1Vb1ptbHNaU3dnYjNCMGFXOXVjeWxjYmlBZ0lDQWdJQ0FnTG5Sb1pXNG9jbVZ6ZFd4MElEMCtJSHRjYmlBZ0lDQWdJQ0FnSUNCamIyNXpiMnhsTG14dlp5aGdKSHNySzJOdmRXNTBmUzhrZTJacGJHVk9kVzE5WUNsY2JpQWdJQ0FnSUNBZ0lDQnlaWE52YkhabEtISmxjM1ZzZEM1M2IzSmtjeTV0WVhBb2R5QTlQaUIzTG5SbGVIUXBLVnh1SUNBZ0lDQWdJQ0I5S1Z4dUlDQWdJQ0FnSUNBdVkyRjBZMmdvWlhKeUlEMCtJSHRjYmlBZ0lDQWdJQ0FnSUNCeVpXcGxZM1FvWlhKeUtWeHVJQ0FnSUNBZ0lDQjlLVnh1SUNBZ0lIMHBMRnh1SUNBcFhHNWNiaUFnY21WMGRYSnVJRkJ5YjIxcGMyVXVZV3hzS0dGc2JGQnliMk5sYzNObGN5bGNibjFjYmlKZGZRPT1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9vY3IuanNcbi8vIG1vZHVsZSBpZCA9IDVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLypcbm9iamVjdC1hc3NpZ25cbihjKSBTaW5kcmUgU29yaHVzXG5AbGljZW5zZSBNSVRcbiovXG5cbid1c2Ugc3RyaWN0Jztcbi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG52YXIgZ2V0T3duUHJvcGVydHlTeW1ib2xzID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scztcbnZhciBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgcHJvcElzRW51bWVyYWJsZSA9IE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGU7XG5cbmZ1bmN0aW9uIHRvT2JqZWN0KHZhbCkge1xuXHRpZiAodmFsID09PSBudWxsIHx8IHZhbCA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignT2JqZWN0LmFzc2lnbiBjYW5ub3QgYmUgY2FsbGVkIHdpdGggbnVsbCBvciB1bmRlZmluZWQnKTtcblx0fVxuXG5cdHJldHVybiBPYmplY3QodmFsKTtcbn1cblxuZnVuY3Rpb24gc2hvdWxkVXNlTmF0aXZlKCkge1xuXHR0cnkge1xuXHRcdGlmICghT2JqZWN0LmFzc2lnbikge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIERldGVjdCBidWdneSBwcm9wZXJ0eSBlbnVtZXJhdGlvbiBvcmRlciBpbiBvbGRlciBWOCB2ZXJzaW9ucy5cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTQxMThcblx0XHR2YXIgdGVzdDEgPSBuZXcgU3RyaW5nKCdhYmMnKTsgIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tbmV3LXdyYXBwZXJzXG5cdFx0dGVzdDFbNV0gPSAnZGUnO1xuXHRcdGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0ZXN0MSlbMF0gPT09ICc1Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTMwNTZcblx0XHR2YXIgdGVzdDIgPSB7fTtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IDEwOyBpKyspIHtcblx0XHRcdHRlc3QyWydfJyArIFN0cmluZy5mcm9tQ2hhckNvZGUoaSldID0gaTtcblx0XHR9XG5cdFx0dmFyIG9yZGVyMiA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRlc3QyKS5tYXAoZnVuY3Rpb24gKG4pIHtcblx0XHRcdHJldHVybiB0ZXN0MltuXTtcblx0XHR9KTtcblx0XHRpZiAob3JkZXIyLmpvaW4oJycpICE9PSAnMDEyMzQ1Njc4OScpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0zMDU2XG5cdFx0dmFyIHRlc3QzID0ge307XG5cdFx0J2FiY2RlZmdoaWprbG1ub3BxcnN0Jy5zcGxpdCgnJykuZm9yRWFjaChmdW5jdGlvbiAobGV0dGVyKSB7XG5cdFx0XHR0ZXN0M1tsZXR0ZXJdID0gbGV0dGVyO1xuXHRcdH0pO1xuXHRcdGlmIChPYmplY3Qua2V5cyhPYmplY3QuYXNzaWduKHt9LCB0ZXN0MykpLmpvaW4oJycpICE9PVxuXHRcdFx0XHQnYWJjZGVmZ2hpamtsbW5vcHFyc3QnKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRydWU7XG5cdH0gY2F0Y2ggKGVycikge1xuXHRcdC8vIFdlIGRvbid0IGV4cGVjdCBhbnkgb2YgdGhlIGFib3ZlIHRvIHRocm93LCBidXQgYmV0dGVyIHRvIGJlIHNhZmUuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2hvdWxkVXNlTmF0aXZlKCkgPyBPYmplY3QuYXNzaWduIDogZnVuY3Rpb24gKHRhcmdldCwgc291cmNlKSB7XG5cdHZhciBmcm9tO1xuXHR2YXIgdG8gPSB0b09iamVjdCh0YXJnZXQpO1xuXHR2YXIgc3ltYm9scztcblxuXHRmb3IgKHZhciBzID0gMTsgcyA8IGFyZ3VtZW50cy5sZW5ndGg7IHMrKykge1xuXHRcdGZyb20gPSBPYmplY3QoYXJndW1lbnRzW3NdKTtcblxuXHRcdGZvciAodmFyIGtleSBpbiBmcm9tKSB7XG5cdFx0XHRpZiAoaGFzT3duUHJvcGVydHkuY2FsbChmcm9tLCBrZXkpKSB7XG5cdFx0XHRcdHRvW2tleV0gPSBmcm9tW2tleV07XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKGdldE93blByb3BlcnR5U3ltYm9scykge1xuXHRcdFx0c3ltYm9scyA9IGdldE93blByb3BlcnR5U3ltYm9scyhmcm9tKTtcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgc3ltYm9scy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRpZiAocHJvcElzRW51bWVyYWJsZS5jYWxsKGZyb20sIHN5bWJvbHNbaV0pKSB7XG5cdFx0XHRcdFx0dG9bc3ltYm9sc1tpXV0gPSBmcm9tW3N5bWJvbHNbaV1dO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHRvO1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9vYmplY3QtYXNzaWduL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSA2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIFRoZSByZXN1bHQgb2YgZHVtcC5qcyBpcyBhIGJpZyBKU09OIHRyZWVcbi8vIHdoaWNoIGNhbiBiZSBlYXNpbHkgc2VyaWFsaXplZCAoZm9yIGluc3RhbmNlXG4vLyB0byBiZSBzZW50IGZyb20gYSB3ZWJ3b3JrZXIgdG8gdGhlIG1haW4gYXBwXG4vLyBvciB0aHJvdWdoIE5vZGUncyBJUEMpLCBidXQgd2Ugd2FudFxuLy8gYSAoY2lyY3VsYXIpIERPTS1saWtlIGludGVyZmFjZSBmb3Igd2Fsa2luZ1xuLy8gdGhyb3VnaCB0aGUgZGF0YS4gXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY2lyY3VsYXJpemUocGFnZSl7XG4gICAgcGFnZS5wYXJhZ3JhcGhzID0gW11cbiAgICBwYWdlLmxpbmVzID0gW11cbiAgICBwYWdlLndvcmRzID0gW11cbiAgICBwYWdlLnN5bWJvbHMgPSBbXVxuXG4gICAgcGFnZS5ibG9ja3MuZm9yRWFjaChmdW5jdGlvbihibG9jayl7XG4gICAgICAgIGJsb2NrLnBhZ2UgPSBwYWdlO1xuXG4gICAgICAgIGJsb2NrLmxpbmVzID0gW11cbiAgICAgICAgYmxvY2sud29yZHMgPSBbXVxuICAgICAgICBibG9jay5zeW1ib2xzID0gW11cblxuICAgICAgICBibG9jay5wYXJhZ3JhcGhzLmZvckVhY2goZnVuY3Rpb24ocGFyYSl7XG4gICAgICAgICAgICBwYXJhLmJsb2NrID0gYmxvY2s7XG4gICAgICAgICAgICBwYXJhLnBhZ2UgPSBwYWdlO1xuXG4gICAgICAgICAgICBwYXJhLndvcmRzID0gW11cbiAgICAgICAgICAgIHBhcmEuc3ltYm9scyA9IFtdXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHBhcmEubGluZXMuZm9yRWFjaChmdW5jdGlvbihsaW5lKXtcbiAgICAgICAgICAgICAgICBsaW5lLnBhcmFncmFwaCA9IHBhcmE7XG4gICAgICAgICAgICAgICAgbGluZS5ibG9jayA9IGJsb2NrO1xuICAgICAgICAgICAgICAgIGxpbmUucGFnZSA9IHBhZ2U7XG5cbiAgICAgICAgICAgICAgICBsaW5lLnN5bWJvbHMgPSBbXVxuXG4gICAgICAgICAgICAgICAgbGluZS53b3Jkcy5mb3JFYWNoKGZ1bmN0aW9uKHdvcmQpe1xuICAgICAgICAgICAgICAgICAgICB3b3JkLmxpbmUgPSBsaW5lO1xuICAgICAgICAgICAgICAgICAgICB3b3JkLnBhcmFncmFwaCA9IHBhcmE7XG4gICAgICAgICAgICAgICAgICAgIHdvcmQuYmxvY2sgPSBibG9jaztcbiAgICAgICAgICAgICAgICAgICAgd29yZC5wYWdlID0gcGFnZTtcbiAgICAgICAgICAgICAgICAgICAgd29yZC5zeW1ib2xzLmZvckVhY2goZnVuY3Rpb24oc3ltKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN5bS53b3JkID0gd29yZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN5bS5saW5lID0gbGluZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN5bS5wYXJhZ3JhcGggPSBwYXJhO1xuICAgICAgICAgICAgICAgICAgICAgICAgc3ltLmJsb2NrID0gYmxvY2s7XG4gICAgICAgICAgICAgICAgICAgICAgICBzeW0ucGFnZSA9IHBhZ2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIHN5bS5saW5lLnN5bWJvbHMucHVzaChzeW0pXG4gICAgICAgICAgICAgICAgICAgICAgICBzeW0ucGFyYWdyYXBoLnN5bWJvbHMucHVzaChzeW0pXG4gICAgICAgICAgICAgICAgICAgICAgICBzeW0uYmxvY2suc3ltYm9scy5wdXNoKHN5bSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHN5bS5wYWdlLnN5bWJvbHMucHVzaChzeW0pXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIHdvcmQucGFyYWdyYXBoLndvcmRzLnB1c2god29yZClcbiAgICAgICAgICAgICAgICAgICAgd29yZC5ibG9jay53b3Jkcy5wdXNoKHdvcmQpXG4gICAgICAgICAgICAgICAgICAgIHdvcmQucGFnZS53b3Jkcy5wdXNoKHdvcmQpXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICBsaW5lLmJsb2NrLmxpbmVzLnB1c2gobGluZSlcbiAgICAgICAgICAgICAgICBsaW5lLnBhZ2UubGluZXMucHVzaChsaW5lKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHBhcmEucGFnZS5wYXJhZ3JhcGhzLnB1c2gocGFyYSlcbiAgICAgICAgfSlcbiAgICB9KVxuICAgIHJldHVybiBwYWdlXG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3Rlc3NlcmFjdC5qcy9zcmMvY29tbW9uL2NpcmN1bGFyaXplLmpzXG4vLyBtb2R1bGUgaWQgPSA3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImNvbnN0IGFkYXB0ZXIgPSByZXF1aXJlKCcuLi9ub2RlL2luZGV4LmpzJylcblxubGV0IGpvYkNvdW50ZXIgPSAwO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFRlc3NlcmFjdEpvYiB7XG4gICAgY29uc3RydWN0b3IoaW5zdGFuY2Upe1xuICAgICAgICB0aGlzLmlkID0gJ0pvYi0nICsgKCsram9iQ291bnRlcikgKyAnLScgKyBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDE2KS5zbGljZSgzLCA4KVxuXG4gICAgICAgIHRoaXMuX2luc3RhbmNlID0gaW5zdGFuY2U7XG4gICAgICAgIHRoaXMuX3Jlc29sdmUgPSBbXVxuICAgICAgICB0aGlzLl9yZWplY3QgPSBbXVxuICAgICAgICB0aGlzLl9wcm9ncmVzcyA9IFtdXG4gICAgICAgIHRoaXMuX2ZpbmFsbHkgPSBbXVxuICAgIH1cblxuICAgIHRoZW4ocmVzb2x2ZSwgcmVqZWN0KXtcbiAgICAgICAgaWYodGhpcy5fcmVzb2x2ZS5wdXNoKXtcbiAgICAgICAgICAgIHRoaXMuX3Jlc29sdmUucHVzaChyZXNvbHZlKSBcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICByZXNvbHZlKHRoaXMuX3Jlc29sdmUpXG4gICAgICAgIH1cblxuICAgICAgICBpZihyZWplY3QpIHRoaXMuY2F0Y2gocmVqZWN0KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIGNhdGNoKHJlamVjdCl7XG4gICAgICAgIGlmKHRoaXMuX3JlamVjdC5wdXNoKXtcbiAgICAgICAgICAgIHRoaXMuX3JlamVjdC5wdXNoKHJlamVjdCkgXG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgcmVqZWN0KHRoaXMuX3JlamVjdClcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgcHJvZ3Jlc3MoZm4pe1xuICAgICAgICB0aGlzLl9wcm9ncmVzcy5wdXNoKGZuKVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgZmluYWxseShmbikge1xuICAgICAgICB0aGlzLl9maW5hbGx5LnB1c2goZm4pXG4gICAgICAgIHJldHVybiB0aGlzOyAgXG4gICAgfVxuICAgIF9zZW5kKGFjdGlvbiwgcGF5bG9hZCl7XG4gICAgICAgIGFkYXB0ZXIuc2VuZFBhY2tldCh0aGlzLl9pbnN0YW5jZSwge1xuICAgICAgICAgICAgam9iSWQ6IHRoaXMuaWQsXG4gICAgICAgICAgICBhY3Rpb246IGFjdGlvbixcbiAgICAgICAgICAgIHBheWxvYWQ6IHBheWxvYWRcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBfaGFuZGxlKHBhY2tldCl7XG4gICAgICAgIHZhciBkYXRhID0gcGFja2V0LmRhdGE7XG4gICAgICAgIGxldCBydW5GaW5hbGx5Q2JzID0gZmFsc2U7XG5cbiAgICAgICAgaWYocGFja2V0LnN0YXR1cyA9PT0gJ3Jlc29sdmUnKXtcbiAgICAgICAgICAgIGlmKHRoaXMuX3Jlc29sdmUubGVuZ3RoID09PSAwKSBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgICAgIHRoaXMuX3Jlc29sdmUuZm9yRWFjaChmbiA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIHJldCA9IGZuKGRhdGEpO1xuICAgICAgICAgICAgICAgIGlmKHJldCAmJiB0eXBlb2YgcmV0LnRoZW4gPT0gJ2Z1bmN0aW9uJyl7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignVGVzc2VyYWN0Sm9iIGluc3RhbmNlcyBkbyBub3QgY2hhaW4gbGlrZSBFUzYgUHJvbWlzZXMuIFRvIGNvbnZlcnQgaXQgaW50byBhIHJlYWwgcHJvbWlzZSwgdXNlIFByb21pc2UucmVzb2x2ZS4nKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB0aGlzLl9yZXNvbHZlID0gZGF0YTtcbiAgICAgICAgICAgIHRoaXMuX2luc3RhbmNlLl9kZXF1ZXVlKClcbiAgICAgICAgICAgIHJ1bkZpbmFsbHlDYnMgPSB0cnVlO1xuICAgICAgICB9ZWxzZSBpZihwYWNrZXQuc3RhdHVzID09PSAncmVqZWN0Jyl7XG4gICAgICAgICAgICBpZih0aGlzLl9yZWplY3QubGVuZ3RoID09PSAwKSBjb25zb2xlLmVycm9yKGRhdGEpO1xuICAgICAgICAgICAgdGhpcy5fcmVqZWN0LmZvckVhY2goZm4gPT4gZm4oZGF0YSkpXG4gICAgICAgICAgICB0aGlzLl9yZWplY3QgPSBkYXRhO1xuICAgICAgICAgICAgdGhpcy5faW5zdGFuY2UuX2RlcXVldWUoKVxuICAgICAgICAgICAgcnVuRmluYWxseUNicyA9IHRydWU7XG4gICAgICAgIH1lbHNlIGlmKHBhY2tldC5zdGF0dXMgPT09ICdwcm9ncmVzcycpe1xuICAgICAgICAgICAgdGhpcy5fcHJvZ3Jlc3MuZm9yRWFjaChmbiA9PiBmbihkYXRhKSlcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ01lc3NhZ2UgdHlwZSB1bmtub3duJywgcGFja2V0LnN0YXR1cylcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChydW5GaW5hbGx5Q2JzKSB7XG4gICAgICAgICAgICB0aGlzLl9maW5hbGx5LmZvckVhY2goZm4gPT4gZm4oZGF0YSkpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3Rlc3NlcmFjdC5qcy9zcmMvY29tbW9uL2pvYi5qc1xuLy8gbW9kdWxlIGlkID0gOFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJjb25zdCBhZGFwdGVyID0gcmVxdWlyZSgnLi9ub2RlL2luZGV4LmpzJylcbmNvbnN0IGNpcmN1bGFyaXplID0gcmVxdWlyZSgnLi9jb21tb24vY2lyY3VsYXJpemUuanMnKVxuY29uc3QgVGVzc2VyYWN0Sm9iID0gcmVxdWlyZSgnLi9jb21tb24vam9iJyk7XG5jb25zdCBvYmplY3RBc3NpZ24gPSByZXF1aXJlKCdvYmplY3QtYXNzaWduJyk7XG5jb25zdCB2ZXJzaW9uID0gcmVxdWlyZSgnLi4vcGFja2FnZS5qc29uJykudmVyc2lvbjtcblxuZnVuY3Rpb24gY3JlYXRlKHdvcmtlck9wdGlvbnMpe1xuXHR3b3JrZXJPcHRpb25zID0gd29ya2VyT3B0aW9ucyB8fCB7fTtcblx0dmFyIHdvcmtlciA9IG5ldyBUZXNzZXJhY3RXb3JrZXIob2JqZWN0QXNzaWduKHt9LCBhZGFwdGVyLmRlZmF1bHRPcHRpb25zLCB3b3JrZXJPcHRpb25zKSlcblx0d29ya2VyLmNyZWF0ZSA9IGNyZWF0ZTtcblx0d29ya2VyLnZlcnNpb24gPSB2ZXJzaW9uO1xuXHRyZXR1cm4gd29ya2VyO1xufVxuXG5jbGFzcyBUZXNzZXJhY3RXb3JrZXIge1xuXHRjb25zdHJ1Y3Rvcih3b3JrZXJPcHRpb25zKXtcblx0XHR0aGlzLndvcmtlciA9IG51bGw7XG5cdFx0dGhpcy53b3JrZXJPcHRpb25zID0gd29ya2VyT3B0aW9ucztcblx0XHR0aGlzLl9jdXJyZW50Sm9iID0gbnVsbDtcblx0XHR0aGlzLl9xdWV1ZSA9IFtdXG5cdH1cblxuXHRyZWNvZ25pemUoaW1hZ2UsIG9wdGlvbnMpe1xuXHRcdHJldHVybiB0aGlzLl9kZWxheShqb2IgPT4ge1xuXHRcdFx0aWYodHlwZW9mIG9wdGlvbnMgPT09ICdzdHJpbmcnKXtcblx0XHRcdFx0b3B0aW9ucyA9IHsgbGFuZzogb3B0aW9ucyB9O1xuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9XG5cdFx0XHRcdG9wdGlvbnMubGFuZyA9IG9wdGlvbnMubGFuZyB8fCAnZW5nJztcdFxuXHRcdFx0fVxuXHRcdFx0XG5cdFx0XHRqb2IuX3NlbmQoJ3JlY29nbml6ZScsIHsgaW1hZ2U6IGltYWdlLCBvcHRpb25zOiBvcHRpb25zLCB3b3JrZXJPcHRpb25zOiB0aGlzLndvcmtlck9wdGlvbnMgfSlcblx0XHR9KVxuXHR9XG5cdGRldGVjdChpbWFnZSwgb3B0aW9ucyl7XG5cdFx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge31cblx0XHRyZXR1cm4gdGhpcy5fZGVsYXkoam9iID0+IHtcblx0XHRcdGpvYi5fc2VuZCgnZGV0ZWN0JywgeyBpbWFnZTogaW1hZ2UsIG9wdGlvbnM6IG9wdGlvbnMsIHdvcmtlck9wdGlvbnM6IHRoaXMud29ya2VyT3B0aW9ucyB9KVxuXHRcdH0pXG5cdH1cblxuXHR0ZXJtaW5hdGUoKXsgXG5cdFx0aWYodGhpcy53b3JrZXIpIGFkYXB0ZXIudGVybWluYXRlV29ya2VyKHRoaXMpO1xuXHRcdHRoaXMud29ya2VyID0gbnVsbDtcblx0fVxuXG5cdF9kZWxheShmbil7XG5cdFx0aWYoIXRoaXMud29ya2VyKSB0aGlzLndvcmtlciA9IGFkYXB0ZXIuc3Bhd25Xb3JrZXIodGhpcywgdGhpcy53b3JrZXJPcHRpb25zKTtcblxuXHRcdHZhciBqb2IgPSBuZXcgVGVzc2VyYWN0Sm9iKHRoaXMpO1xuXHRcdHRoaXMuX3F1ZXVlLnB1c2goZSA9PiB7XG5cdFx0XHR0aGlzLl9xdWV1ZS5zaGlmdCgpXG5cdFx0XHR0aGlzLl9jdXJyZW50Sm9iID0gam9iO1xuXHRcdFx0Zm4oam9iKVxuXHRcdH0pXG5cdFx0aWYoIXRoaXMuX2N1cnJlbnRKb2IpIHRoaXMuX2RlcXVldWUoKTtcblx0XHRyZXR1cm4gam9iXG5cdH1cblxuXHRfZGVxdWV1ZSgpe1xuXHRcdHRoaXMuX2N1cnJlbnRKb2IgPSBudWxsO1xuXHRcdGlmKHRoaXMuX3F1ZXVlLmxlbmd0aCA+IDApe1xuXHRcdFx0dGhpcy5fcXVldWVbMF0oKVxuXHRcdH1cblx0fVxuXG5cdF9yZWN2KHBhY2tldCl7XG5cbiAgICAgICAgaWYocGFja2V0LnN0YXR1cyA9PT0gJ3Jlc29sdmUnICYmIHBhY2tldC5hY3Rpb24gPT09ICdyZWNvZ25pemUnKXtcbiAgICAgICAgICAgIHBhY2tldC5kYXRhID0gY2lyY3VsYXJpemUocGFja2V0LmRhdGEpO1xuICAgICAgICB9XG5cblx0XHRpZih0aGlzLl9jdXJyZW50Sm9iLmlkID09PSBwYWNrZXQuam9iSWQpe1xuXHRcdFx0dGhpcy5fY3VycmVudEpvYi5faGFuZGxlKHBhY2tldClcblx0XHR9ZWxzZXtcblx0XHRcdGNvbnNvbGUud2FybignSm9iIElEICcgKyBwYWNrZXQuam9iSWQgKyAnIG5vdCBrbm93bi4nKVxuXHRcdH1cblx0fVxufVxuXG52YXIgRGVmYXVsdFRlc3NlcmFjdCA9IGNyZWF0ZSgpXG5cbm1vZHVsZS5leHBvcnRzID0gRGVmYXVsdFRlc3NlcmFjdFxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi90ZXNzZXJhY3QuanMvc3JjL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSA5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBnO1xyXG5cclxuLy8gVGhpcyB3b3JrcyBpbiBub24tc3RyaWN0IG1vZGVcclxuZyA9IChmdW5jdGlvbigpIHtcclxuXHRyZXR1cm4gdGhpcztcclxufSkoKTtcclxuXHJcbnRyeSB7XHJcblx0Ly8gVGhpcyB3b3JrcyBpZiBldmFsIGlzIGFsbG93ZWQgKHNlZSBDU1ApXHJcblx0ZyA9IGcgfHwgRnVuY3Rpb24oXCJyZXR1cm4gdGhpc1wiKSgpIHx8ICgxLGV2YWwpKFwidGhpc1wiKTtcclxufSBjYXRjaChlKSB7XHJcblx0Ly8gVGhpcyB3b3JrcyBpZiB0aGUgd2luZG93IHJlZmVyZW5jZSBpcyBhdmFpbGFibGVcclxuXHRpZih0eXBlb2Ygd2luZG93ID09PSBcIm9iamVjdFwiKVxyXG5cdFx0ZyA9IHdpbmRvdztcclxufVxyXG5cclxuLy8gZyBjYW4gc3RpbGwgYmUgdW5kZWZpbmVkLCBidXQgbm90aGluZyB0byBkbyBhYm91dCBpdC4uLlxyXG4vLyBXZSByZXR1cm4gdW5kZWZpbmVkLCBpbnN0ZWFkIG9mIG5vdGhpbmcgaGVyZSwgc28gaXQnc1xyXG4vLyBlYXNpZXIgdG8gaGFuZGxlIHRoaXMgY2FzZS4gaWYoIWdsb2JhbCkgeyAuLi59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGc7XHJcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vICh3ZWJwYWNrKS9idWlsZGluL2dsb2JhbC5qc1xuLy8gbW9kdWxlIGlkID0gMTBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihtb2R1bGUpIHtcclxuXHRpZighbW9kdWxlLndlYnBhY2tQb2x5ZmlsbCkge1xyXG5cdFx0bW9kdWxlLmRlcHJlY2F0ZSA9IGZ1bmN0aW9uKCkge307XHJcblx0XHRtb2R1bGUucGF0aHMgPSBbXTtcclxuXHRcdC8vIG1vZHVsZS5wYXJlbnQgPSB1bmRlZmluZWQgYnkgZGVmYXVsdFxyXG5cdFx0aWYoIW1vZHVsZS5jaGlsZHJlbikgbW9kdWxlLmNoaWxkcmVuID0gW107XHJcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobW9kdWxlLCBcImxvYWRlZFwiLCB7XHJcblx0XHRcdGVudW1lcmFibGU6IHRydWUsXHJcblx0XHRcdGdldDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0cmV0dXJuIG1vZHVsZS5sO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShtb2R1bGUsIFwiaWRcIiwge1xyXG5cdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxyXG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHJldHVybiBtb2R1bGUuaTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRtb2R1bGUud2VicGFja1BvbHlmaWxsID0gMTtcclxuXHR9XHJcblx0cmV0dXJuIG1vZHVsZTtcclxufTtcclxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gKHdlYnBhY2spL2J1aWxkaW4vbW9kdWxlLmpzXG4vLyBtb2R1bGUgaWQgPSAxMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJmdW5jdGlvbiBfYXN5bmNUb0dlbmVyYXRvcihmbikgeyByZXR1cm4gZnVuY3Rpb24gKCkgeyB2YXIgZ2VuID0gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHsgZnVuY3Rpb24gc3RlcChrZXksIGFyZykgeyB0cnkgeyB2YXIgaW5mbyA9IGdlbltrZXldKGFyZyk7IHZhciB2YWx1ZSA9IGluZm8udmFsdWU7IH0gY2F0Y2ggKGVycm9yKSB7IHJlamVjdChlcnJvcik7IHJldHVybjsgfSBpZiAoaW5mby5kb25lKSB7IHJlc29sdmUodmFsdWUpOyB9IGVsc2UgeyByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHZhbHVlKS50aGVuKGZ1bmN0aW9uICh2YWx1ZSkgeyBzdGVwKFwibmV4dFwiLCB2YWx1ZSk7IH0sIGZ1bmN0aW9uIChlcnIpIHsgc3RlcChcInRocm93XCIsIGVycik7IH0pOyB9IH0gcmV0dXJuIHN0ZXAoXCJuZXh0XCIpOyB9KTsgfTsgfVxuXG5pbXBvcnQgUnggZnJvbSAncngtbGl0ZSc7XG5pbXBvcnQgeyBzY2FuRW50cnkgfSBmcm9tICcuL2ZpbGV1dGlscyc7XG5pbXBvcnQgeyByZWNvZ25pemUgfSBmcm9tICcuL29jcic7XG5cbmZ1bmN0aW9uIGJsb2NrRXZlbnRQcm9wYWdhdGlvbihldmVudCkge1xuICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbn1cblxuZnVuY3Rpb24gYWN0aXZhdGVEcm9wWm9uZSh6b25lLCBhY3RpdmF0ZSA9IGZhbHNlKSB7XG4gIHpvbmUuY2xhc3NMaXN0LnRvZ2dsZSgnZHJvcHpvbmUtLWFjdGl2ZScsIGFjdGl2YXRlKTtcbn1cblxuY29uc3QgZHJvcFpvbmUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZHJvcHpvbmUnKTtcblJ4Lk9ic2VydmFibGUuZnJvbUV2ZW50KGRyb3Bab25lLCAnZHJhZ292ZXInKS5zdWJzY3JpYmUoZSA9PiB7XG4gIGJsb2NrRXZlbnRQcm9wYWdhdGlvbihlKTtcbiAgZS5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9ICdjb3B5Jztcbn0pO1xuXG4vLyBcImRyYWdsZWF2ZVwi44Kk44OZ44Oz44OI44GM5a2Q6KaB57Sg44Gn55m654Gr44GZ44KL5ZWP6aGM44Gu5a++5b+c562WXG4vLyAxLiDjgqvjgqbjg7Pjgr/jg7zmlrnlvI9cbi8vIDIuIHBvaW50ZXItZXZlbnRzOiBub25lO+aWueW8jyAo5a2Q6KaB57Sg44Gn44Kk44OZ44Oz44OI44GM5LiN5b+F6KaB44Gq5aC05ZCIKVxuY29uc3QgcGx1cyA9IFJ4Lk9ic2VydmFibGUuZnJvbUV2ZW50KGRyb3Bab25lLCAnZHJhZ2VudGVyJykubWFwKDEpO1xuY29uc3QgbWludXMgPSBSeC5PYnNlcnZhYmxlLmZyb21FdmVudChkcm9wWm9uZSwgJ2RyYWdsZWF2ZScpLm1hcCgtMSk7XG5jb25zdCBkcm9wID0gUnguT2JzZXJ2YWJsZS5mcm9tRXZlbnQoZHJvcFpvbmUsICdkcm9wJyk7XG5jb25zdCBzb3VyY2UgPSBwbHVzLm1lcmdlKG1pbnVzKS5tZXJnZShkcm9wLm1hcChudWxsKSk7XG5zb3VyY2Uuc2NhbigoYWNjLCB2KSA9PiB2ID09PSBudWxsID8gMCA6IGFjYyArIHYsIDApLnN1YnNjcmliZShjb3VudCA9PiB7XG4gIGFjdGl2YXRlRHJvcFpvbmUoZHJvcFpvbmUsIGNvdW50ICE9PSAwKTtcbn0pO1xuXG5jb25zdCBkcm9wQ2xpY2sgPSBSeC5PYnNlcnZhYmxlLmZyb21FdmVudChkcm9wWm9uZSwgJ2NsaWNrJyk7XG5kcm9wQ2xpY2suc3Vic2NyaWJlKGUgPT4ge1xuICBjb25zdCBoaWRkZW5JZCA9IGUudGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1saW5rJyk7XG4gIGNvbnN0IGFjdGlvbiA9IG5ldyBFdmVudCgnY2xpY2snKTtcbiAgY29uc3QgaGlkZGVuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaGlkZGVuSWQpO1xuICBpZiAoaGlkZGVuKSB7XG4gICAgaGlkZGVuLmRpc3BhdGNoRXZlbnQoYWN0aW9uKTtcbiAgfVxufSk7XG5cbmNvbnN0IHJlc3VsdExpc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVzdWx0LWxpc3QnKS5xdWVyeVNlbGVjdG9yKCcubGlzdCcpO1xuY29uc3QgaGlkZGVuRmlsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdoaWRkZW4tZmlsZScpO1xuY29uc3QgZmlsZUNoYW5nZSA9IFJ4Lk9ic2VydmFibGUuZnJvbUV2ZW50KGhpZGRlbkZpbGUsICdjaGFuZ2UnKTtcbmRyb3AubWVyZ2UoZmlsZUNoYW5nZSkuc3Vic2NyaWJlKCgoKSA9PiB7XG4gIHZhciBfcmVmID0gX2FzeW5jVG9HZW5lcmF0b3IoZnVuY3Rpb24qIChlKSB7XG4gICAgYmxvY2tFdmVudFByb3BhZ2F0aW9uKGUpO1xuICAgIGFjdGl2YXRlRHJvcFpvbmUoZS5jdXJyZW50VGFyZ2V0LCBmYWxzZSk7XG5cbiAgICBsZXQgYWxsRmlsZXM7XG4gICAgaWYgKGUuZGF0YVRyYW5zZmVyKSB7XG4gICAgICBjb25zdCBpdGVtcyA9IEFycmF5LmZyb20oZS5kYXRhVHJhbnNmZXIuaXRlbXMpO1xuICAgICAgY29uc3QgZW50cmllcyA9IGl0ZW1zLm1hcChmdW5jdGlvbiAoaSkge1xuICAgICAgICByZXR1cm4gaS53ZWJraXRHZXRBc0VudHJ5KCk7XG4gICAgICB9KTtcbiAgICAgIGFsbEZpbGVzID0geWllbGQgUHJvbWlzZS5hbGwoZW50cmllcy5tYXAoc2NhbkVudHJ5KSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFsbEZpbGVzID0gQXJyYXkuZnJvbShlLnRhcmdldC5maWxlcyk7XG4gICAgfVxuXG4gICAgY29uc3QgJHByb2Nlc3NpbmcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgICRwcm9jZXNzaW5nLmlubmVySFRNTCA9ICc8ZGl2IGNsYXNzPVwibG9hZC1pbmRpY2F0b3JcIj48ZGl2IGNsYXNzPVwibG9hZC1pbmRpY2F0b3JfX3NsaWRlXCI+PC9kaXY+JztcbiAgICByZXN1bHRMaXN0LmFwcGVuZENoaWxkKCRwcm9jZXNzaW5nKTtcblxuICAgIC8vIOeUu+WDj+iqjeitmFxuICAgIGNvbnN0IHdvcmRzID0geWllbGQgcmVjb2duaXplKGFsbEZpbGVzLCAnZW5nJyk7XG5cbiAgICBjb25zdCAkbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICAkbGluay5jbGFzc0xpc3QuYWRkKCdidXR0b24nKTtcbiAgICAkbGluay5pbm5lckhUTUwgPSAnZG93bmxvYWQnO1xuICAgICRsaW5rLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGV2KSB7XG4gICAgICBSeC5PYnNlcnZhYmxlLmZyb20od29yZHMpLmZsYXRNYXAoZnVuY3Rpb24gKHgpIHtcbiAgICAgICAgcmV0dXJuIFJ4Lk9ic2VydmFibGUuZnJvbSh4KTtcbiAgICAgIH0pLnNjYW4oZnVuY3Rpb24gKGFjYywgdikge1xuICAgICAgICByZXR1cm4gYWNjID09PSAnJyA/IHYgOiBgJHthY2N9XFxyXFxuJHt2fWA7XG4gICAgICB9LCAnJykudGFrZUxhc3QoMSkuc3Vic2NyaWJlKGZ1bmN0aW9uICh0eHQpIHtcbiAgICAgICAgY29uc3QgZGF0YSA9IG5ldyBCbG9iKFt0eHRdLCB7IHR5cGU6ICd0ZXh0L3BsYWluJyB9KTtcbiAgICAgICAgY29uc3QgdXJsID0gVVJMLmNyZWF0ZU9iamVjdFVSTChkYXRhKTtcbiAgICAgICAgJGxpbmsuaHJlZiA9IHVybDtcbiAgICAgICAgJGxpbmsuZG93bmxvYWQgPSBgb2NyLSR7bmV3IERhdGUoKS5nZXRUaW1lKCl9LnR4dGA7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBjb25zdCAkbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgICRsaS5hcHBlbmRDaGlsZCgkbGluayk7XG4gICAgcmVzdWx0TGlzdC5yZW1vdmVDaGlsZCgkcHJvY2Vzc2luZyk7XG4gICAgcmVzdWx0TGlzdC5hcHBlbmRDaGlsZCgkbGkpO1xuICB9KTtcblxuICByZXR1cm4gZnVuY3Rpb24gKF94KSB7XG4gICAgcmV0dXJuIF9yZWYuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfTtcbn0pKCkpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYkluTnlZMXhjYldGcGJpNXFjeUpkTENKdVlXMWxjeUk2V3lKU2VDSXNJbk5qWVc1RmJuUnllU0lzSW5KbFkyOW5ibWw2WlNJc0ltSnNiMk5yUlhabGJuUlFjbTl3WVdkaGRHbHZiaUlzSW1WMlpXNTBJaXdpYzNSdmNGQnliM0JoWjJGMGFXOXVJaXdpY0hKbGRtVnVkRVJsWm1GMWJIUWlMQ0poWTNScGRtRjBaVVJ5YjNCYWIyNWxJaXdpZW05dVpTSXNJbUZqZEdsMllYUmxJaXdpWTJ4aGMzTk1hWE4wSWl3aWRHOW5aMnhsSWl3aVpISnZjRnB2Ym1VaUxDSmtiMk4xYldWdWRDSXNJbWRsZEVWc1pXMWxiblJDZVVsa0lpd2lUMkp6WlhKMllXSnNaU0lzSW1aeWIyMUZkbVZ1ZENJc0luTjFZbk5qY21saVpTSXNJbVVpTENKa1lYUmhWSEpoYm5ObVpYSWlMQ0prY205d1JXWm1aV04wSWl3aWNHeDFjeUlzSW0xaGNDSXNJbTFwYm5Weklpd2laSEp2Y0NJc0luTnZkWEpqWlNJc0ltMWxjbWRsSWl3aWMyTmhiaUlzSW1Gall5SXNJbllpTENKamIzVnVkQ0lzSW1SeWIzQkRiR2xqYXlJc0ltaHBaR1JsYmtsa0lpd2lkR0Z5WjJWMElpd2laMlYwUVhSMGNtbGlkWFJsSWl3aVlXTjBhVzl1SWl3aVJYWmxiblFpTENKb2FXUmtaVzRpTENKa2FYTndZWFJqYUVWMlpXNTBJaXdpY21WemRXeDBUR2x6ZENJc0luRjFaWEo1VTJWc1pXTjBiM0lpTENKb2FXUmtaVzVHYVd4bElpd2labWxzWlVOb1lXNW5aU0lzSW1OMWNuSmxiblJVWVhKblpYUWlMQ0poYkd4R2FXeGxjeUlzSW1sMFpXMXpJaXdpUVhKeVlYa2lMQ0ptY205dElpd2laVzUwY21sbGN5SXNJbWtpTENKM1pXSnJhWFJIWlhSQmMwVnVkSEo1SWl3aVVISnZiV2x6WlNJc0ltRnNiQ0lzSW1acGJHVnpJaXdpSkhCeWIyTmxjM05wYm1jaUxDSmpjbVZoZEdWRmJHVnRaVzUwSWl3aWFXNXVaWEpJVkUxTUlpd2lZWEJ3Wlc1a1EyaHBiR1FpTENKM2IzSmtjeUlzSWlSc2FXNXJJaXdpWVdSa0lpd2lZV1JrUlhabGJuUk1hWE4wWlc1bGNpSXNJbVYySWl3aVpteGhkRTFoY0NJc0luZ2lMQ0owWVd0bFRHRnpkQ0lzSW1SaGRHRWlMQ0pDYkc5aUlpd2lkSGgwSWl3aWRIbHdaU0lzSW5WeWJDSXNJbFZTVENJc0ltTnlaV0YwWlU5aWFtVmpkRlZTVENJc0ltaHlaV1lpTENKa2IzZHViRzloWkNJc0lrUmhkR1VpTENKblpYUlVhVzFsSWl3aUpHeHBJaXdpY21WdGIzWmxRMmhwYkdRaVhTd2liV0Z3Y0dsdVozTWlPaUk3TzBGQlEwRXNUMEZCVDBFc1JVRkJVQ3hOUVVGbExGTkJRV1k3UVVGRFFTeFRRVUZUUXl4VFFVRlVMRkZCUVRCQ0xHRkJRVEZDTzBGQlEwRXNVMEZCVTBNc1UwRkJWQ3hSUVVFd1FpeFBRVUV4UWpzN1FVRkZRU3hUUVVGVFF5eHhRa0ZCVkN4RFFVRXJRa01zUzBGQkwwSXNSVUZCYzBNN1FVRkRjRU5CTEZGQlFVMURMR1ZCUVU0N1FVRkRRVVFzVVVGQlRVVXNZMEZCVGp0QlFVTkVPenRCUVVWRUxGTkJRVk5ETEdkQ1FVRlVMRU5CUVRCQ1F5eEpRVUV4UWl4RlFVRTJRME1zVjBGQlZ5eExRVUY0UkN4RlFVRXJSRHRCUVVNM1JFUXNUMEZCUzBVc1UwRkJUQ3hEUVVGbFF5eE5RVUZtTEVOQlFYTkNMR3RDUVVGMFFpeEZRVUV3UTBZc1VVRkJNVU03UVVGRFJEczdRVUZGUkN4TlFVRk5SeXhYUVVGWFF5eFRRVUZUUXl4alFVRlVMRU5CUVhkQ0xGVkJRWGhDTEVOQlFXcENPMEZCUTBGa0xFZEJRVWRsTEZWQlFVZ3NRMEZCWTBNc1UwRkJaQ3hEUVVGM1Frb3NVVUZCZUVJc1JVRkJhME1zVlVGQmJFTXNSVUZEUjBzc1UwRkVTQ3hEUVVOaFF5eExRVUZMTzBGQlEyUm1MSGRDUVVGelFtVXNRMEZCZEVJN1FVRkRRVUVzU1VGQlJVTXNXVUZCUml4RFFVRmxReXhWUVVGbUxFZEJRVFJDTEUxQlFUVkNPMEZCUTBRc1EwRktTRHM3UVVGTlFUdEJRVU5CTzBGQlEwRTdRVUZEUVN4TlFVRk5ReXhQUVVGUGNrSXNSMEZCUjJVc1ZVRkJTQ3hEUVVGalF5eFRRVUZrTEVOQlFYZENTaXhSUVVGNFFpeEZRVUZyUXl4WFFVRnNReXhGUVVFclExVXNSMEZCTDBNc1EwRkJiVVFzUTBGQmJrUXNRMEZCWWp0QlFVTkJMRTFCUVUxRExGRkJRVkYyUWl4SFFVRkhaU3hWUVVGSUxFTkJRV05ETEZOQlFXUXNRMEZCZDBKS0xGRkJRWGhDTEVWQlFXdERMRmRCUVd4RExFVkJRU3REVlN4SFFVRXZReXhEUVVGdFJDeERRVUZETEVOQlFYQkVMRU5CUVdRN1FVRkRRU3hOUVVGTlJTeFBRVUZQZUVJc1IwRkJSMlVzVlVGQlNDeERRVUZqUXl4VFFVRmtMRU5CUVhkQ1NpeFJRVUY0UWl4RlFVRnJReXhOUVVGc1F5eERRVUZpTzBGQlEwRXNUVUZCVFdFc1UwRkJVMG9zUzBGQlMwc3NTMEZCVEN4RFFVRlhTQ3hMUVVGWUxFVkJRV3RDUnl4TFFVRnNRaXhEUVVGM1FrWXNTMEZCUzBZc1IwRkJUQ3hEUVVGVExFbEJRVlFzUTBGQmVFSXNRMEZCWmp0QlFVTkJSeXhQUVVGUFJTeEpRVUZRTEVOQlFWa3NRMEZCUTBNc1IwRkJSQ3hGUVVGTlF5eERRVUZPTEV0QlFXRkJMRTFCUVUwc1NVRkJUaXhIUVVGaExFTkJRV0lzUjBGQmFVSkVMRTFCUVUxRExFTkJRV2hFTEVWQlFXOUVMRU5CUVhCRUxFVkJRMGRhTEZOQlJFZ3NRMEZEWVdFc1UwRkJVenRCUVVOc1FuWkNMRzFDUVVGcFFrc3NVVUZCYWtJc1JVRkJNa0pyUWl4VlFVRlZMRU5CUVhKRE8wRkJRMFFzUTBGSVNEczdRVUZMUVN4TlFVRk5ReXhaUVVGWkwwSXNSMEZCUjJVc1ZVRkJTQ3hEUVVGalF5eFRRVUZrTEVOQlFYZENTaXhSUVVGNFFpeEZRVUZyUXl4UFFVRnNReXhEUVVGc1FqdEJRVU5CYlVJc1ZVRkRSMlFzVTBGRVNDeERRVU5oUXl4TFFVRkxPMEZCUTJRc1VVRkJUV01zVjBGQlYyUXNSVUZCUldVc1RVRkJSaXhEUVVGVFF5eFpRVUZVTEVOQlFYTkNMRmRCUVhSQ0xFTkJRV3BDTzBGQlEwRXNVVUZCVFVNc1UwRkJVeXhKUVVGSlF5eExRVUZLTEVOQlFWVXNUMEZCVml4RFFVRm1PMEZCUTBFc1VVRkJUVU1zVTBGQlUzaENMRk5CUVZORExHTkJRVlFzUTBGQmQwSnJRaXhSUVVGNFFpeERRVUZtTzBGQlEwRXNUVUZCU1Vzc1RVRkJTaXhGUVVGWk8wRkJRMVpCTEZkQlFVOURMR0ZCUVZBc1EwRkJjVUpJTEUxQlFYSkNPMEZCUTBRN1FVRkRSaXhEUVZKSU96dEJRVlZCTEUxQlFVMUpMR0ZCUVdFeFFpeFRRVUZUUXl4alFVRlVMRU5CUVhkQ0xHRkJRWGhDTEVWQlFYVkRNRUlzWVVGQmRrTXNRMEZCY1VRc1QwRkJja1FzUTBGQmJrSTdRVUZEUVN4TlFVRk5ReXhoUVVGaE5VSXNVMEZCVTBNc1kwRkJWQ3hEUVVGM1FpeGhRVUY0UWl4RFFVRnVRanRCUVVOQkxFMUJRVTAwUWl4aFFVRmhNVU1zUjBGQlIyVXNWVUZCU0N4RFFVRmpReXhUUVVGa0xFTkJRWGRDZVVJc1ZVRkJlRUlzUlVGQmIwTXNVVUZCY0VNc1EwRkJia0k3UVVGRFFXcENMRXRCUVV0RkxFdEJRVXdzUTBGQlYyZENMRlZCUVZnc1JVRkJkVUo2UWl4VFFVRjJRanRCUVVGQkxDdENRVUZwUXl4WFFVRk5ReXhEUVVGT0xFVkJRVmM3UVVGRE1VTm1MREJDUVVGelFtVXNRMEZCZEVJN1FVRkRRVmdzY1VKQlFXbENWeXhGUVVGRmVVSXNZVUZCYmtJc1JVRkJhME1zUzBGQmJFTTdPMEZCUlVFc1VVRkJTVU1zVVVGQlNqdEJRVU5CTEZGQlFVa3hRaXhGUVVGRlF5eFpRVUZPTEVWQlFXOUNPMEZCUTJ4Q0xGbEJRVTB3UWl4UlFVRlJReXhOUVVGTlF5eEpRVUZPTEVOQlFWYzNRaXhGUVVGRlF5eFpRVUZHTEVOQlFXVXdRaXhMUVVFeFFpeERRVUZrTzBGQlEwRXNXVUZCVFVjc1ZVRkJWVWdzVFVGQlRYWkNMRWRCUVU0c1EwRkJWVHRCUVVGQkxHVkJRVXN5UWl4RlFVRkZReXhuUWtGQlJpeEZRVUZNTzBGQlFVRXNUMEZCVml4RFFVRm9RanRCUVVOQlRpeHBRa0ZCVnl4TlFVRk5UeXhSUVVGUlF5eEhRVUZTTEVOQlFWbEtMRkZCUVZFeFFpeEhRVUZTTEVOQlFWbHlRaXhUUVVGYUxFTkJRVm9zUTBGQmFrSTdRVUZEUkN4TFFVcEVMRTFCU1U4N1FVRkRUREpETEdsQ1FVRlhSU3hOUVVGTlF5eEpRVUZPTEVOQlFWYzNRaXhGUVVGRlpTeE5RVUZHTEVOQlFWTnZRaXhMUVVGd1FpeERRVUZZTzBGQlEwUTdPMEZCUlVRc1ZVRkJUVU1zWTBGQlkzcERMRk5CUVZNd1F5eGhRVUZVTEVOQlFYVkNMRWxCUVhaQ0xFTkJRWEJDTzBGQlEwRkVMR2RDUVVGWlJTeFRRVUZhTEVkQlFYZENMSFZGUVVGNFFqdEJRVU5CYWtJc1pVRkJWMnRDTEZkQlFWZ3NRMEZCZFVKSUxGZEJRWFpDT3p0QlFVVkJPMEZCUTBFc1ZVRkJUVWtzVVVGQlVTeE5RVUZOZUVRc1ZVRkJWVEJETEZGQlFWWXNSVUZCYjBJc1MwRkJjRUlzUTBGQmNFSTdPMEZCUlVFc1ZVRkJUV1VzVVVGQlVUbERMRk5CUVZNd1F5eGhRVUZVTEVOQlFYVkNMRWRCUVhaQ0xFTkJRV1E3UVVGRFFVa3NWVUZCVFdwRUxGTkJRVTRzUTBGQlowSnJSQ3hIUVVGb1FpeERRVUZ2UWl4UlFVRndRanRCUVVOQlJDeFZRVUZOU0N4VFFVRk9MRWRCUVd0Q0xGVkJRV3hDTzBGQlEwRkhMRlZCUVUxRkxHZENRVUZPTEVOQlFYVkNMRTlCUVhaQ0xFVkJRV2RETEZWQlFVTkRMRVZCUVVRc1JVRkJVVHRCUVVOMFF6bEVMRk5CUVVkbExGVkJRVWdzUTBGQlkyZERMRWxCUVdRc1EwRkJiVUpYTEV0QlFXNUNMRVZCUTBkTExFOUJSRWdzUTBGRFZ6dEJRVUZCTEdWQlFVc3ZSQ3hIUVVGSFpTeFZRVUZJTEVOQlFXTm5ReXhKUVVGa0xFTkJRVzFDYVVJc1EwRkJia0lzUTBGQlREdEJRVUZCTEU5QlJGZ3NSVUZGUjNKRExFbEJSa2dzUTBGRlVTeFZRVUZEUXl4SFFVRkVMRVZCUVUxRExFTkJRVTQ3UVVGQlFTeGxRVUZoUkN4UlFVRlJMRVZCUVZJc1IwRkJZVU1zUTBGQllpeEhRVUZyUWl4SFFVRkZSQ3hIUVVGSkxFOUJRVTFETEVOQlFVVXNSVUZCTjBNN1FVRkJRU3hQUVVaU0xFVkJSWGxFTEVWQlJucEVMRVZCUjBkdlF5eFJRVWhJTEVOQlIxa3NRMEZJV2l4RlFVbEhhRVFzVTBGS1NDeERRVWxoTEdWQlFVODdRVUZEYUVJc1kwRkJUV2xFTEU5QlFVOHNTVUZCU1VNc1NVRkJTaXhEUVVGVExFTkJRVU5ETEVkQlFVUXNRMEZCVkN4RlFVRm5RaXhGUVVGRlF5eE5RVUZOTEZsQlFWSXNSVUZCYUVJc1EwRkJZanRCUVVOQkxHTkJRVTFETEUxQlFVMURMRWxCUVVsRExHVkJRVW9zUTBGQmIwSk9MRWxCUVhCQ0xFTkJRVm83UVVGRFFWQXNZMEZCVFdNc1NVRkJUaXhIUVVGaFNDeEhRVUZpTzBGQlEwRllMR05CUVUxbExGRkJRVTRzUjBGQmEwSXNUMEZCVFN4SlFVRkpReXhKUVVGS0xFZEJRVmRETEU5QlFWZ3NSVUZCY1VJc1RVRkJOME03UVVGRFJDeFBRVlJJTzBGQlZVUXNTMEZZUkR0QlFWbEJMRlZCUVUxRExFMUJRVTFvUlN4VFFVRlRNRU1zWVVGQlZDeERRVUYxUWl4SlFVRjJRaXhEUVVGYU8wRkJRMEZ6UWl4UlFVRkpjRUlzVjBGQlNpeERRVUZuUWtVc1MwRkJhRUk3UVVGRFFYQkNMR1ZCUVZkMVF5eFhRVUZZTEVOQlFYVkNlRUlzVjBGQmRrSTdRVUZEUVdZc1pVRkJWMnRDTEZkQlFWZ3NRMEZCZFVKdlFpeEhRVUYyUWp0QlFVTkVMRWRCZGtORU96dEJRVUZCTzBGQlFVRTdRVUZCUVR0QlFVRkJJaXdpWm1sc1pTSTZJbTFoYVc0dWFuTWlMQ0p6YjNWeVkyVlNiMjkwSWpvaVJEb3ZSMmwwTDBkcGRFaDFZaTl2WTNJdFpHVnRieUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSWk4cUlFQm1iRzkzSUNvdlhHNXBiWEJ2Y25RZ1VuZ2dabkp2YlNBbmNuZ3RiR2wwWlNkY2JtbHRjRzl5ZENCN0lITmpZVzVGYm5SeWVTQjlJR1p5YjIwZ0p5NHZabWxzWlhWMGFXeHpKMXh1YVcxd2IzSjBJSHNnY21WamIyZHVhWHBsSUgwZ1puSnZiU0FuTGk5dlkzSW5YRzVjYm1aMWJtTjBhVzl1SUdKc2IyTnJSWFpsYm5SUWNtOXdZV2RoZEdsdmJpaGxkbVZ1ZENrZ2UxeHVJQ0JsZG1WdWRDNXpkRzl3VUhKdmNHRm5ZWFJwYjI0b0tWeHVJQ0JsZG1WdWRDNXdjbVYyWlc1MFJHVm1ZWFZzZENncFhHNTlYRzVjYm1aMWJtTjBhVzl1SUdGamRHbDJZWFJsUkhKdmNGcHZibVVvZW05dVpUb2dTRlJOVEVWc1pXMWxiblFzSUdGamRHbDJZWFJsSUQwZ1ptRnNjMlVwSUh0Y2JpQWdlbTl1WlM1amJHRnpjMHhwYzNRdWRHOW5aMnhsS0Nka2NtOXdlbTl1WlMwdFlXTjBhWFpsSnl3Z1lXTjBhWFpoZEdVcFhHNTlYRzVjYm1OdmJuTjBJR1J5YjNCYWIyNWxJRDBnWkc5amRXMWxiblF1WjJWMFJXeGxiV1Z1ZEVKNVNXUW9KMlJ5YjNCNmIyNWxKeWxjYmxKNExrOWljMlZ5ZG1GaWJHVXVabkp2YlVWMlpXNTBLR1J5YjNCYWIyNWxMQ0FuWkhKaFoyOTJaWEluS1Z4dUlDQXVjM1ZpYzJOeWFXSmxLR1VnUFQ0Z2UxeHVJQ0FnSUdKc2IyTnJSWFpsYm5SUWNtOXdZV2RoZEdsdmJpaGxLVnh1SUNBZ0lHVXVaR0YwWVZSeVlXNXpabVZ5TG1SeWIzQkZabVpsWTNRZ1BTQW5ZMjl3ZVNkY2JpQWdmU2xjYmx4dUx5OGdYQ0prY21GbmJHVmhkbVZjSXVPQ3BPT0RtZU9EcytPRGlPT0JqT1d0a09pbWdlZTBvT09CcCtlWnV1ZUJxK09CbWVPQ2krV1ZqK21oak9PQnJ1V3Z2dVcvbk9ldGxseHVMeThnTVM0ZzQ0S3I0NEttNDRPejQ0Sy80NE84NXBhNTVieVBYRzR2THlBeUxpQndiMmx1ZEdWeUxXVjJaVzUwY3pvZ2JtOXVaVHZtbHJubHZJOGdLT1d0a09pbWdlZTBvT09CcCtPQ3BPT0RtZU9EcytPRGlPT0JqT1M0amVXL2hlaW1nZU9CcXVXZ3RPV1FpQ2xjYm1OdmJuTjBJSEJzZFhNZ1BTQlNlQzVQWW5ObGNuWmhZbXhsTG1aeWIyMUZkbVZ1ZENoa2NtOXdXbTl1WlN3Z0oyUnlZV2RsYm5SbGNpY3BMbTFoY0NneEtWeHVZMjl1YzNRZ2JXbHVkWE1nUFNCU2VDNVBZbk5sY25aaFlteGxMbVp5YjIxRmRtVnVkQ2hrY205d1dtOXVaU3dnSjJSeVlXZHNaV0YyWlNjcExtMWhjQ2d0TVNsY2JtTnZibk4wSUdSeWIzQWdQU0JTZUM1UFluTmxjblpoWW14bExtWnliMjFGZG1WdWRDaGtjbTl3V205dVpTd2dKMlJ5YjNBbktWeHVZMjl1YzNRZ2MyOTFjbU5sSUQwZ2NHeDFjeTV0WlhKblpTaHRhVzUxY3lrdWJXVnlaMlVvWkhKdmNDNXRZWEFvYm5Wc2JDa3BYRzV6YjNWeVkyVXVjMk5oYmlnb1lXTmpMQ0IyS1NBOVBpQW9kaUE5UFQwZ2JuVnNiQ0EvSURBZ09pQmhZMk1nS3lCMktTd2dNQ2xjYmlBZ0xuTjFZbk5qY21saVpTaGpiM1Z1ZENBOVBpQjdYRzRnSUNBZ1lXTjBhWFpoZEdWRWNtOXdXbTl1WlNoa2NtOXdXbTl1WlN3Z1kyOTFiblFnSVQwOUlEQXBYRzRnSUgwcFhHNWNibU52Ym5OMElHUnliM0JEYkdsamF5QTlJRko0TGs5aWMyVnlkbUZpYkdVdVpuSnZiVVYyWlc1MEtHUnliM0JhYjI1bExDQW5ZMnhwWTJzbktWeHVaSEp2Y0VOc2FXTnJYRzRnSUM1emRXSnpZM0pwWW1Vb1pTQTlQaUI3WEc0Z0lDQWdZMjl1YzNRZ2FHbGtaR1Z1U1dRZ1BTQmxMblJoY21kbGRDNW5aWFJCZEhSeWFXSjFkR1VvSjJSaGRHRXRiR2x1YXljcFhHNGdJQ0FnWTI5dWMzUWdZV04wYVc5dUlEMGdibVYzSUVWMlpXNTBLQ2RqYkdsamF5Y3BYRzRnSUNBZ1kyOXVjM1FnYUdsa1pHVnVJRDBnWkc5amRXMWxiblF1WjJWMFJXeGxiV1Z1ZEVKNVNXUW9hR2xrWkdWdVNXUXBYRzRnSUNBZ2FXWWdLR2hwWkdSbGJpa2dlMXh1SUNBZ0lDQWdhR2xrWkdWdUxtUnBjM0JoZEdOb1JYWmxiblFvWVdOMGFXOXVLVnh1SUNBZ0lIMWNiaUFnZlNsY2JseHVZMjl1YzNRZ2NtVnpkV3gwVEdsemRDQTlJR1J2WTNWdFpXNTBMbWRsZEVWc1pXMWxiblJDZVVsa0tDZHlaWE4xYkhRdGJHbHpkQ2NwTG5GMVpYSjVVMlZzWldOMGIzSW9KeTVzYVhOMEp5bGNibU52Ym5OMElHaHBaR1JsYmtacGJHVWdQU0JrYjJOMWJXVnVkQzVuWlhSRmJHVnRaVzUwUW5sSlpDZ25hR2xrWkdWdUxXWnBiR1VuS1Z4dVkyOXVjM1FnWm1sc1pVTm9ZVzVuWlNBOUlGSjRMazlpYzJWeWRtRmliR1V1Wm5KdmJVVjJaVzUwS0docFpHUmxia1pwYkdVc0lDZGphR0Z1WjJVbktWeHVaSEp2Y0M1dFpYSm5aU2htYVd4bFEyaGhibWRsS1M1emRXSnpZM0pwWW1Vb1lYTjVibU1nWlNBOVBpQjdYRzRnSUdKc2IyTnJSWFpsYm5SUWNtOXdZV2RoZEdsdmJpaGxLVnh1SUNCaFkzUnBkbUYwWlVSeWIzQmFiMjVsS0dVdVkzVnljbVZ1ZEZSaGNtZGxkQ3dnWm1Gc2MyVXBYRzVjYmlBZ2JHVjBJR0ZzYkVacGJHVnpYRzRnSUdsbUlDaGxMbVJoZEdGVWNtRnVjMlpsY2lrZ2UxeHVJQ0FnSUdOdmJuTjBJR2wwWlcxeklEMGdRWEp5WVhrdVpuSnZiU2hsTG1SaGRHRlVjbUZ1YzJabGNpNXBkR1Z0Y3lsY2JpQWdJQ0JqYjI1emRDQmxiblJ5YVdWeklEMGdhWFJsYlhNdWJXRndLR2tnUFQ0Z2FTNTNaV0pyYVhSSFpYUkJjMFZ1ZEhKNUtDa3BYRzRnSUNBZ1lXeHNSbWxzWlhNZ1BTQmhkMkZwZENCUWNtOXRhWE5sTG1Gc2JDaGxiblJ5YVdWekxtMWhjQ2h6WTJGdVJXNTBjbmtwS1Z4dUlDQjlJR1ZzYzJVZ2UxeHVJQ0FnSUdGc2JFWnBiR1Z6SUQwZ1FYSnlZWGt1Wm5KdmJTaGxMblJoY21kbGRDNW1hV3hsY3lsY2JpQWdmVnh1WEc0Z0lHTnZibk4wSUNSd2NtOWpaWE56YVc1bklEMGdaRzlqZFcxbGJuUXVZM0psWVhSbFJXeGxiV1Z1ZENnbmJHa25LVnh1SUNBa2NISnZZMlZ6YzJsdVp5NXBibTVsY2toVVRVd2dQU0FuUEdScGRpQmpiR0Z6Y3oxY0lteHZZV1F0YVc1a2FXTmhkRzl5WENJK1BHUnBkaUJqYkdGemN6MWNJbXh2WVdRdGFXNWthV05oZEc5eVgxOXpiR2xrWlZ3aVBqd3ZaR2wyUGlkY2JpQWdjbVZ6ZFd4MFRHbHpkQzVoY0hCbGJtUkRhR2xzWkNna2NISnZZMlZ6YzJsdVp5bGNibHh1SUNBdkx5RG5sTHZsZzQvb3FvM29yWmhjYmlBZ1kyOXVjM1FnZDI5eVpITWdQU0JoZDJGcGRDQnlaV052WjI1cGVtVW9ZV3hzUm1sc1pYTXNJQ2RsYm1jbktWeHVYRzRnSUdOdmJuTjBJQ1JzYVc1cklEMGdaRzlqZFcxbGJuUXVZM0psWVhSbFJXeGxiV1Z1ZENnbllTY3BYRzRnSUNSc2FXNXJMbU5zWVhOelRHbHpkQzVoWkdRb0oySjFkSFJ2YmljcFhHNGdJQ1JzYVc1ckxtbHVibVZ5U0ZSTlRDQTlJQ2RrYjNkdWJHOWhaQ2RjYmlBZ0pHeHBibXN1WVdSa1JYWmxiblJNYVhOMFpXNWxjaWduWTJ4cFkyc25MQ0FvWlhZcElEMCtJSHRjYmlBZ0lDQlNlQzVQWW5ObGNuWmhZbXhsTG1aeWIyMG9kMjl5WkhNcFhHNGdJQ0FnSUNBdVpteGhkRTFoY0NoNElEMCtJRko0TGs5aWMyVnlkbUZpYkdVdVpuSnZiU2g0S1NsY2JpQWdJQ0FnSUM1elkyRnVLQ2hoWTJNc0lIWXBJRDArSUNoaFkyTWdQVDA5SUNjbklEOGdkaUE2SUdBa2UyRmpZMzFjWEhKY1hHNGtlM1o5WUNrc0lDY25LVnh1SUNBZ0lDQWdMblJoYTJWTVlYTjBLREVwWEc0Z0lDQWdJQ0F1YzNWaWMyTnlhV0psS0hSNGRDQTlQaUI3WEc0Z0lDQWdJQ0FnSUdOdmJuTjBJR1JoZEdFZ1BTQnVaWGNnUW14dllpaGJkSGgwWFN3Z2V5QjBlWEJsT2lBbmRHVjRkQzl3YkdGcGJpY2dmU2xjYmlBZ0lDQWdJQ0FnWTI5dWMzUWdkWEpzSUQwZ1ZWSk1MbU55WldGMFpVOWlhbVZqZEZWU1RDaGtZWFJoS1Z4dUlDQWdJQ0FnSUNBa2JHbHVheTVvY21WbUlEMGdkWEpzWEc0Z0lDQWdJQ0FnSUNSc2FXNXJMbVJ2ZDI1c2IyRmtJRDBnWUc5amNpMGtlMjVsZHlCRVlYUmxLQ2t1WjJWMFZHbHRaU2dwZlM1MGVIUmdYRzRnSUNBZ0lDQjlLVnh1SUNCOUtWeHVJQ0JqYjI1emRDQWtiR2tnUFNCa2IyTjFiV1Z1ZEM1amNtVmhkR1ZGYkdWdFpXNTBLQ2RzYVNjcFhHNGdJQ1JzYVM1aGNIQmxibVJEYUdsc1pDZ2tiR2x1YXlsY2JpQWdjbVZ6ZFd4MFRHbHpkQzV5WlcxdmRtVkRhR2xzWkNna2NISnZZMlZ6YzJsdVp5bGNiaUFnY21WemRXeDBUR2x6ZEM1aGNIQmxibVJEYUdsc1pDZ2tiR2twWEc1OUtWeHVJbDE5XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvbWFpbi5qc1xuLy8gbW9kdWxlIGlkID0gMTJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==