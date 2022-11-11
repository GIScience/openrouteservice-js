const constants = {
  defaultAPIVersion: "v2",
  defaultHost: "https://api.openrouteservice.org",
  missingAPIKeyMsg: "Please add your openrouteservice api_key..",
  useAPIV2Msg: "Please use ORS API v2",
  baseUrlConstituents: ["host", "service", "api_version", "mime_type"],
  propNames: {
    apiKey: "api_key",
    host: "host",
    service: "service",
    apiVersion: "api_version",
    mimeType: "mime_type",
    profile: "profile",
    format: "format",
    timeout: "timeout"
  }
};
class OrsUtil {
  fillArgs(defaultArgs, requestArgs) {
    requestArgs = { ...defaultArgs, ...requestArgs };
    return requestArgs;
  }
  saveArgsToCache(args) {
    return {
      host: args[constants.propNames.host],
      api_version: args[constants.propNames.apiVersion],
      profile: args[constants.propNames.profile],
      format: args[constants.propNames.format],
      service: args[constants.propNames.service],
      api_key: args[constants.propNames.apiKey],
      mime_type: args[constants.propNames.mimeType]
    };
  }
  prepareRequest(args) {
    delete args[constants.propNames.mimeType];
    delete args[constants.propNames.host];
    delete args[constants.propNames.apiVersion];
    delete args[constants.propNames.service];
    delete args[constants.propNames.apiKey];
    delete args[constants.propNames.profile];
    delete args[constants.propNames.format];
    delete args[constants.propNames.timeout];
    return { ...args };
  }
  prepareUrl(args) {
    let url = args[constants.propNames.host];
    let urlPathParts = [
      args[constants.propNames.apiVersion],
      args[constants.propNames.service],
      args[constants.propNames.profile],
      args[constants.propNames.format]
    ];
    urlPathParts = urlPathParts.join("/");
    urlPathParts = urlPathParts.replace(/\/(\/)+/g, "/");
    url = url + "/" + urlPathParts;
    if (url.slice(-1) === "/") {
      url = url.slice(0, -1);
    }
    return url;
  }
}
class OrsInput {
  constructor(input, input2) {
    this.setCoord(input, input2);
  }
  round(val, precision) {
    if (precision === void 0)
      precision = 1e6;
    return Math.round(val * precision) / precision;
  }
  setCoord(lat, lng) {
    this.coord = [this.round(lat), this.round(lng)];
  }
}
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
function getAugmentedNamespace(n) {
  var f = n.default;
  if (typeof f == "function") {
    var a = function() {
      return f.apply(this, arguments);
    };
    a.prototype = f.prototype;
  } else
    a = {};
  Object.defineProperty(a, "__esModule", { value: true });
  Object.keys(n).forEach(function(k) {
    var d = Object.getOwnPropertyDescriptor(n, k);
    Object.defineProperty(a, k, d.get ? d : {
      enumerable: true,
      get: function() {
        return n[k];
      }
    });
  });
  return a;
}
var client = { exports: {} };
var componentEmitter = { exports: {} };
(function(module2) {
  {
    module2.exports = Emitter;
  }
  function Emitter(obj) {
    if (obj)
      return mixin(obj);
  }
  function mixin(obj) {
    for (var key in Emitter.prototype) {
      obj[key] = Emitter.prototype[key];
    }
    return obj;
  }
  Emitter.prototype.on = Emitter.prototype.addEventListener = function(event, fn) {
    this._callbacks = this._callbacks || {};
    (this._callbacks["$" + event] = this._callbacks["$" + event] || []).push(fn);
    return this;
  };
  Emitter.prototype.once = function(event, fn) {
    function on() {
      this.off(event, on);
      fn.apply(this, arguments);
    }
    on.fn = fn;
    this.on(event, on);
    return this;
  };
  Emitter.prototype.off = Emitter.prototype.removeListener = Emitter.prototype.removeAllListeners = Emitter.prototype.removeEventListener = function(event, fn) {
    this._callbacks = this._callbacks || {};
    if (0 == arguments.length) {
      this._callbacks = {};
      return this;
    }
    var callbacks = this._callbacks["$" + event];
    if (!callbacks)
      return this;
    if (1 == arguments.length) {
      delete this._callbacks["$" + event];
      return this;
    }
    var cb;
    for (var i = 0; i < callbacks.length; i++) {
      cb = callbacks[i];
      if (cb === fn || cb.fn === fn) {
        callbacks.splice(i, 1);
        break;
      }
    }
    if (callbacks.length === 0) {
      delete this._callbacks["$" + event];
    }
    return this;
  };
  Emitter.prototype.emit = function(event) {
    this._callbacks = this._callbacks || {};
    var args = new Array(arguments.length - 1), callbacks = this._callbacks["$" + event];
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
    if (callbacks) {
      callbacks = callbacks.slice(0);
      for (var i = 0, len = callbacks.length; i < len; ++i) {
        callbacks[i].apply(this, args);
      }
    }
    return this;
  };
  Emitter.prototype.listeners = function(event) {
    this._callbacks = this._callbacks || {};
    return this._callbacks["$" + event] || [];
  };
  Emitter.prototype.hasListeners = function(event) {
    return !!this.listeners(event).length;
  };
})(componentEmitter);
var fastSafeStringify = stringify$2;
stringify$2.default = stringify$2;
stringify$2.stable = deterministicStringify;
stringify$2.stableStringify = deterministicStringify;
var LIMIT_REPLACE_NODE = "[...]";
var CIRCULAR_REPLACE_NODE = "[Circular]";
var arr = [];
var replacerStack = [];
function defaultOptions() {
  return {
    depthLimit: Number.MAX_SAFE_INTEGER,
    edgesLimit: Number.MAX_SAFE_INTEGER
  };
}
function stringify$2(obj, replacer, spacer, options) {
  if (typeof options === "undefined") {
    options = defaultOptions();
  }
  decirc(obj, "", 0, [], void 0, 0, options);
  var res;
  try {
    if (replacerStack.length === 0) {
      res = JSON.stringify(obj, replacer, spacer);
    } else {
      res = JSON.stringify(obj, replaceGetterValues(replacer), spacer);
    }
  } catch (_) {
    return JSON.stringify("[unable to serialize, circular reference is too complex to analyze]");
  } finally {
    while (arr.length !== 0) {
      var part = arr.pop();
      if (part.length === 4) {
        Object.defineProperty(part[0], part[1], part[3]);
      } else {
        part[0][part[1]] = part[2];
      }
    }
  }
  return res;
}
function setReplace(replace2, val, k, parent) {
  var propertyDescriptor = Object.getOwnPropertyDescriptor(parent, k);
  if (propertyDescriptor.get !== void 0) {
    if (propertyDescriptor.configurable) {
      Object.defineProperty(parent, k, { value: replace2 });
      arr.push([parent, k, val, propertyDescriptor]);
    } else {
      replacerStack.push([val, k, replace2]);
    }
  } else {
    parent[k] = replace2;
    arr.push([parent, k, val]);
  }
}
function decirc(val, k, edgeIndex, stack, parent, depth, options) {
  depth += 1;
  var i;
  if (typeof val === "object" && val !== null) {
    for (i = 0; i < stack.length; i++) {
      if (stack[i] === val) {
        setReplace(CIRCULAR_REPLACE_NODE, val, k, parent);
        return;
      }
    }
    if (typeof options.depthLimit !== "undefined" && depth > options.depthLimit) {
      setReplace(LIMIT_REPLACE_NODE, val, k, parent);
      return;
    }
    if (typeof options.edgesLimit !== "undefined" && edgeIndex + 1 > options.edgesLimit) {
      setReplace(LIMIT_REPLACE_NODE, val, k, parent);
      return;
    }
    stack.push(val);
    if (Array.isArray(val)) {
      for (i = 0; i < val.length; i++) {
        decirc(val[i], i, i, stack, val, depth, options);
      }
    } else {
      var keys = Object.keys(val);
      for (i = 0; i < keys.length; i++) {
        var key = keys[i];
        decirc(val[key], key, i, stack, val, depth, options);
      }
    }
    stack.pop();
  }
}
function compareFunction(a, b) {
  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 0;
}
function deterministicStringify(obj, replacer, spacer, options) {
  if (typeof options === "undefined") {
    options = defaultOptions();
  }
  var tmp = deterministicDecirc(obj, "", 0, [], void 0, 0, options) || obj;
  var res;
  try {
    if (replacerStack.length === 0) {
      res = JSON.stringify(tmp, replacer, spacer);
    } else {
      res = JSON.stringify(tmp, replaceGetterValues(replacer), spacer);
    }
  } catch (_) {
    return JSON.stringify("[unable to serialize, circular reference is too complex to analyze]");
  } finally {
    while (arr.length !== 0) {
      var part = arr.pop();
      if (part.length === 4) {
        Object.defineProperty(part[0], part[1], part[3]);
      } else {
        part[0][part[1]] = part[2];
      }
    }
  }
  return res;
}
function deterministicDecirc(val, k, edgeIndex, stack, parent, depth, options) {
  depth += 1;
  var i;
  if (typeof val === "object" && val !== null) {
    for (i = 0; i < stack.length; i++) {
      if (stack[i] === val) {
        setReplace(CIRCULAR_REPLACE_NODE, val, k, parent);
        return;
      }
    }
    try {
      if (typeof val.toJSON === "function") {
        return;
      }
    } catch (_) {
      return;
    }
    if (typeof options.depthLimit !== "undefined" && depth > options.depthLimit) {
      setReplace(LIMIT_REPLACE_NODE, val, k, parent);
      return;
    }
    if (typeof options.edgesLimit !== "undefined" && edgeIndex + 1 > options.edgesLimit) {
      setReplace(LIMIT_REPLACE_NODE, val, k, parent);
      return;
    }
    stack.push(val);
    if (Array.isArray(val)) {
      for (i = 0; i < val.length; i++) {
        deterministicDecirc(val[i], i, i, stack, val, depth, options);
      }
    } else {
      var tmp = {};
      var keys = Object.keys(val).sort(compareFunction);
      for (i = 0; i < keys.length; i++) {
        var key = keys[i];
        deterministicDecirc(val[key], key, i, stack, val, depth, options);
        tmp[key] = val[key];
      }
      if (typeof parent !== "undefined") {
        arr.push([parent, k, val]);
        parent[k] = tmp;
      } else {
        return tmp;
      }
    }
    stack.pop();
  }
}
function replaceGetterValues(replacer) {
  replacer = typeof replacer !== "undefined" ? replacer : function(k, v) {
    return v;
  };
  return function(key, val) {
    if (replacerStack.length > 0) {
      for (var i = 0; i < replacerStack.length; i++) {
        var part = replacerStack[i];
        if (part[1] === key && part[0] === val) {
          val = part[2];
          replacerStack.splice(i, 1);
          break;
        }
      }
    }
    return replacer.call(this, key, val);
  };
}
var shams = function hasSymbols() {
  if (typeof Symbol !== "function" || typeof Object.getOwnPropertySymbols !== "function") {
    return false;
  }
  if (typeof Symbol.iterator === "symbol") {
    return true;
  }
  var obj = {};
  var sym = Symbol("test");
  var symObj = Object(sym);
  if (typeof sym === "string") {
    return false;
  }
  if (Object.prototype.toString.call(sym) !== "[object Symbol]") {
    return false;
  }
  if (Object.prototype.toString.call(symObj) !== "[object Symbol]") {
    return false;
  }
  var symVal = 42;
  obj[sym] = symVal;
  for (sym in obj) {
    return false;
  }
  if (typeof Object.keys === "function" && Object.keys(obj).length !== 0) {
    return false;
  }
  if (typeof Object.getOwnPropertyNames === "function" && Object.getOwnPropertyNames(obj).length !== 0) {
    return false;
  }
  var syms = Object.getOwnPropertySymbols(obj);
  if (syms.length !== 1 || syms[0] !== sym) {
    return false;
  }
  if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) {
    return false;
  }
  if (typeof Object.getOwnPropertyDescriptor === "function") {
    var descriptor = Object.getOwnPropertyDescriptor(obj, sym);
    if (descriptor.value !== symVal || descriptor.enumerable !== true) {
      return false;
    }
  }
  return true;
};
var origSymbol = typeof Symbol !== "undefined" && Symbol;
var hasSymbolSham = shams;
var hasSymbols$1 = function hasNativeSymbols() {
  if (typeof origSymbol !== "function") {
    return false;
  }
  if (typeof Symbol !== "function") {
    return false;
  }
  if (typeof origSymbol("foo") !== "symbol") {
    return false;
  }
  if (typeof Symbol("bar") !== "symbol") {
    return false;
  }
  return hasSymbolSham();
};
var ERROR_MESSAGE = "Function.prototype.bind called on incompatible ";
var slice = Array.prototype.slice;
var toStr$1 = Object.prototype.toString;
var funcType = "[object Function]";
var implementation$1 = function bind(that) {
  var target = this;
  if (typeof target !== "function" || toStr$1.call(target) !== funcType) {
    throw new TypeError(ERROR_MESSAGE + target);
  }
  var args = slice.call(arguments, 1);
  var bound;
  var binder = function() {
    if (this instanceof bound) {
      var result = target.apply(
        this,
        args.concat(slice.call(arguments))
      );
      if (Object(result) === result) {
        return result;
      }
      return this;
    } else {
      return target.apply(
        that,
        args.concat(slice.call(arguments))
      );
    }
  };
  var boundLength = Math.max(0, target.length - args.length);
  var boundArgs = [];
  for (var i = 0; i < boundLength; i++) {
    boundArgs.push("$" + i);
  }
  bound = Function("binder", "return function (" + boundArgs.join(",") + "){ return binder.apply(this,arguments); }")(binder);
  if (target.prototype) {
    var Empty = function Empty2() {
    };
    Empty.prototype = target.prototype;
    bound.prototype = new Empty();
    Empty.prototype = null;
  }
  return bound;
};
var implementation = implementation$1;
var functionBind = Function.prototype.bind || implementation;
var bind$1 = functionBind;
var src = bind$1.call(Function.call, Object.prototype.hasOwnProperty);
var undefined$1;
var $SyntaxError = SyntaxError;
var $Function = Function;
var $TypeError$1 = TypeError;
var getEvalledConstructor = function(expressionSyntax) {
  try {
    return $Function('"use strict"; return (' + expressionSyntax + ").constructor;")();
  } catch (e) {
  }
};
var $gOPD = Object.getOwnPropertyDescriptor;
if ($gOPD) {
  try {
    $gOPD({}, "");
  } catch (e) {
    $gOPD = null;
  }
}
var throwTypeError = function() {
  throw new $TypeError$1();
};
var ThrowTypeError = $gOPD ? function() {
  try {
    arguments.callee;
    return throwTypeError;
  } catch (calleeThrows) {
    try {
      return $gOPD(arguments, "callee").get;
    } catch (gOPDthrows) {
      return throwTypeError;
    }
  }
}() : throwTypeError;
var hasSymbols2 = hasSymbols$1();
var getProto = Object.getPrototypeOf || function(x) {
  return x.__proto__;
};
var needsEval = {};
var TypedArray = typeof Uint8Array === "undefined" ? undefined$1 : getProto(Uint8Array);
var INTRINSICS = {
  "%AggregateError%": typeof AggregateError === "undefined" ? undefined$1 : AggregateError,
  "%Array%": Array,
  "%ArrayBuffer%": typeof ArrayBuffer === "undefined" ? undefined$1 : ArrayBuffer,
  "%ArrayIteratorPrototype%": hasSymbols2 ? getProto([][Symbol.iterator]()) : undefined$1,
  "%AsyncFromSyncIteratorPrototype%": undefined$1,
  "%AsyncFunction%": needsEval,
  "%AsyncGenerator%": needsEval,
  "%AsyncGeneratorFunction%": needsEval,
  "%AsyncIteratorPrototype%": needsEval,
  "%Atomics%": typeof Atomics === "undefined" ? undefined$1 : Atomics,
  "%BigInt%": typeof BigInt === "undefined" ? undefined$1 : BigInt,
  "%Boolean%": Boolean,
  "%DataView%": typeof DataView === "undefined" ? undefined$1 : DataView,
  "%Date%": Date,
  "%decodeURI%": decodeURI,
  "%decodeURIComponent%": decodeURIComponent,
  "%encodeURI%": encodeURI,
  "%encodeURIComponent%": encodeURIComponent,
  "%Error%": Error,
  "%eval%": eval,
  "%EvalError%": EvalError,
  "%Float32Array%": typeof Float32Array === "undefined" ? undefined$1 : Float32Array,
  "%Float64Array%": typeof Float64Array === "undefined" ? undefined$1 : Float64Array,
  "%FinalizationRegistry%": typeof FinalizationRegistry === "undefined" ? undefined$1 : FinalizationRegistry,
  "%Function%": $Function,
  "%GeneratorFunction%": needsEval,
  "%Int8Array%": typeof Int8Array === "undefined" ? undefined$1 : Int8Array,
  "%Int16Array%": typeof Int16Array === "undefined" ? undefined$1 : Int16Array,
  "%Int32Array%": typeof Int32Array === "undefined" ? undefined$1 : Int32Array,
  "%isFinite%": isFinite,
  "%isNaN%": isNaN,
  "%IteratorPrototype%": hasSymbols2 ? getProto(getProto([][Symbol.iterator]())) : undefined$1,
  "%JSON%": typeof JSON === "object" ? JSON : undefined$1,
  "%Map%": typeof Map === "undefined" ? undefined$1 : Map,
  "%MapIteratorPrototype%": typeof Map === "undefined" || !hasSymbols2 ? undefined$1 : getProto((/* @__PURE__ */ new Map())[Symbol.iterator]()),
  "%Math%": Math,
  "%Number%": Number,
  "%Object%": Object,
  "%parseFloat%": parseFloat,
  "%parseInt%": parseInt,
  "%Promise%": typeof Promise === "undefined" ? undefined$1 : Promise,
  "%Proxy%": typeof Proxy === "undefined" ? undefined$1 : Proxy,
  "%RangeError%": RangeError,
  "%ReferenceError%": ReferenceError,
  "%Reflect%": typeof Reflect === "undefined" ? undefined$1 : Reflect,
  "%RegExp%": RegExp,
  "%Set%": typeof Set === "undefined" ? undefined$1 : Set,
  "%SetIteratorPrototype%": typeof Set === "undefined" || !hasSymbols2 ? undefined$1 : getProto((/* @__PURE__ */ new Set())[Symbol.iterator]()),
  "%SharedArrayBuffer%": typeof SharedArrayBuffer === "undefined" ? undefined$1 : SharedArrayBuffer,
  "%String%": String,
  "%StringIteratorPrototype%": hasSymbols2 ? getProto(""[Symbol.iterator]()) : undefined$1,
  "%Symbol%": hasSymbols2 ? Symbol : undefined$1,
  "%SyntaxError%": $SyntaxError,
  "%ThrowTypeError%": ThrowTypeError,
  "%TypedArray%": TypedArray,
  "%TypeError%": $TypeError$1,
  "%Uint8Array%": typeof Uint8Array === "undefined" ? undefined$1 : Uint8Array,
  "%Uint8ClampedArray%": typeof Uint8ClampedArray === "undefined" ? undefined$1 : Uint8ClampedArray,
  "%Uint16Array%": typeof Uint16Array === "undefined" ? undefined$1 : Uint16Array,
  "%Uint32Array%": typeof Uint32Array === "undefined" ? undefined$1 : Uint32Array,
  "%URIError%": URIError,
  "%WeakMap%": typeof WeakMap === "undefined" ? undefined$1 : WeakMap,
  "%WeakRef%": typeof WeakRef === "undefined" ? undefined$1 : WeakRef,
  "%WeakSet%": typeof WeakSet === "undefined" ? undefined$1 : WeakSet
};
var doEval = function doEval2(name) {
  var value;
  if (name === "%AsyncFunction%") {
    value = getEvalledConstructor("async function () {}");
  } else if (name === "%GeneratorFunction%") {
    value = getEvalledConstructor("function* () {}");
  } else if (name === "%AsyncGeneratorFunction%") {
    value = getEvalledConstructor("async function* () {}");
  } else if (name === "%AsyncGenerator%") {
    var fn = doEval2("%AsyncGeneratorFunction%");
    if (fn) {
      value = fn.prototype;
    }
  } else if (name === "%AsyncIteratorPrototype%") {
    var gen = doEval2("%AsyncGenerator%");
    if (gen) {
      value = getProto(gen.prototype);
    }
  }
  INTRINSICS[name] = value;
  return value;
};
var LEGACY_ALIASES = {
  "%ArrayBufferPrototype%": ["ArrayBuffer", "prototype"],
  "%ArrayPrototype%": ["Array", "prototype"],
  "%ArrayProto_entries%": ["Array", "prototype", "entries"],
  "%ArrayProto_forEach%": ["Array", "prototype", "forEach"],
  "%ArrayProto_keys%": ["Array", "prototype", "keys"],
  "%ArrayProto_values%": ["Array", "prototype", "values"],
  "%AsyncFunctionPrototype%": ["AsyncFunction", "prototype"],
  "%AsyncGenerator%": ["AsyncGeneratorFunction", "prototype"],
  "%AsyncGeneratorPrototype%": ["AsyncGeneratorFunction", "prototype", "prototype"],
  "%BooleanPrototype%": ["Boolean", "prototype"],
  "%DataViewPrototype%": ["DataView", "prototype"],
  "%DatePrototype%": ["Date", "prototype"],
  "%ErrorPrototype%": ["Error", "prototype"],
  "%EvalErrorPrototype%": ["EvalError", "prototype"],
  "%Float32ArrayPrototype%": ["Float32Array", "prototype"],
  "%Float64ArrayPrototype%": ["Float64Array", "prototype"],
  "%FunctionPrototype%": ["Function", "prototype"],
  "%Generator%": ["GeneratorFunction", "prototype"],
  "%GeneratorPrototype%": ["GeneratorFunction", "prototype", "prototype"],
  "%Int8ArrayPrototype%": ["Int8Array", "prototype"],
  "%Int16ArrayPrototype%": ["Int16Array", "prototype"],
  "%Int32ArrayPrototype%": ["Int32Array", "prototype"],
  "%JSONParse%": ["JSON", "parse"],
  "%JSONStringify%": ["JSON", "stringify"],
  "%MapPrototype%": ["Map", "prototype"],
  "%NumberPrototype%": ["Number", "prototype"],
  "%ObjectPrototype%": ["Object", "prototype"],
  "%ObjProto_toString%": ["Object", "prototype", "toString"],
  "%ObjProto_valueOf%": ["Object", "prototype", "valueOf"],
  "%PromisePrototype%": ["Promise", "prototype"],
  "%PromiseProto_then%": ["Promise", "prototype", "then"],
  "%Promise_all%": ["Promise", "all"],
  "%Promise_reject%": ["Promise", "reject"],
  "%Promise_resolve%": ["Promise", "resolve"],
  "%RangeErrorPrototype%": ["RangeError", "prototype"],
  "%ReferenceErrorPrototype%": ["ReferenceError", "prototype"],
  "%RegExpPrototype%": ["RegExp", "prototype"],
  "%SetPrototype%": ["Set", "prototype"],
  "%SharedArrayBufferPrototype%": ["SharedArrayBuffer", "prototype"],
  "%StringPrototype%": ["String", "prototype"],
  "%SymbolPrototype%": ["Symbol", "prototype"],
  "%SyntaxErrorPrototype%": ["SyntaxError", "prototype"],
  "%TypedArrayPrototype%": ["TypedArray", "prototype"],
  "%TypeErrorPrototype%": ["TypeError", "prototype"],
  "%Uint8ArrayPrototype%": ["Uint8Array", "prototype"],
  "%Uint8ClampedArrayPrototype%": ["Uint8ClampedArray", "prototype"],
  "%Uint16ArrayPrototype%": ["Uint16Array", "prototype"],
  "%Uint32ArrayPrototype%": ["Uint32Array", "prototype"],
  "%URIErrorPrototype%": ["URIError", "prototype"],
  "%WeakMapPrototype%": ["WeakMap", "prototype"],
  "%WeakSetPrototype%": ["WeakSet", "prototype"]
};
var bind2 = functionBind;
var hasOwn$2 = src;
var $concat$1 = bind2.call(Function.call, Array.prototype.concat);
var $spliceApply = bind2.call(Function.apply, Array.prototype.splice);
var $replace$1 = bind2.call(Function.call, String.prototype.replace);
var $strSlice = bind2.call(Function.call, String.prototype.slice);
var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
var reEscapeChar = /\\(\\)?/g;
var stringToPath = function stringToPath2(string) {
  var first = $strSlice(string, 0, 1);
  var last = $strSlice(string, -1);
  if (first === "%" && last !== "%") {
    throw new $SyntaxError("invalid intrinsic syntax, expected closing `%`");
  } else if (last === "%" && first !== "%") {
    throw new $SyntaxError("invalid intrinsic syntax, expected opening `%`");
  }
  var result = [];
  $replace$1(string, rePropName, function(match, number, quote2, subString) {
    result[result.length] = quote2 ? $replace$1(subString, reEscapeChar, "$1") : number || match;
  });
  return result;
};
var getBaseIntrinsic = function getBaseIntrinsic2(name, allowMissing) {
  var intrinsicName = name;
  var alias;
  if (hasOwn$2(LEGACY_ALIASES, intrinsicName)) {
    alias = LEGACY_ALIASES[intrinsicName];
    intrinsicName = "%" + alias[0] + "%";
  }
  if (hasOwn$2(INTRINSICS, intrinsicName)) {
    var value = INTRINSICS[intrinsicName];
    if (value === needsEval) {
      value = doEval(intrinsicName);
    }
    if (typeof value === "undefined" && !allowMissing) {
      throw new $TypeError$1("intrinsic " + name + " exists, but is not available. Please file an issue!");
    }
    return {
      alias,
      name: intrinsicName,
      value
    };
  }
  throw new $SyntaxError("intrinsic " + name + " does not exist!");
};
var getIntrinsic = function GetIntrinsic(name, allowMissing) {
  if (typeof name !== "string" || name.length === 0) {
    throw new $TypeError$1("intrinsic name must be a non-empty string");
  }
  if (arguments.length > 1 && typeof allowMissing !== "boolean") {
    throw new $TypeError$1('"allowMissing" argument must be a boolean');
  }
  var parts = stringToPath(name);
  var intrinsicBaseName = parts.length > 0 ? parts[0] : "";
  var intrinsic = getBaseIntrinsic("%" + intrinsicBaseName + "%", allowMissing);
  var intrinsicRealName = intrinsic.name;
  var value = intrinsic.value;
  var skipFurtherCaching = false;
  var alias = intrinsic.alias;
  if (alias) {
    intrinsicBaseName = alias[0];
    $spliceApply(parts, $concat$1([0, 1], alias));
  }
  for (var i = 1, isOwn = true; i < parts.length; i += 1) {
    var part = parts[i];
    var first = $strSlice(part, 0, 1);
    var last = $strSlice(part, -1);
    if ((first === '"' || first === "'" || first === "`" || (last === '"' || last === "'" || last === "`")) && first !== last) {
      throw new $SyntaxError("property names with quotes must have matching quotes");
    }
    if (part === "constructor" || !isOwn) {
      skipFurtherCaching = true;
    }
    intrinsicBaseName += "." + part;
    intrinsicRealName = "%" + intrinsicBaseName + "%";
    if (hasOwn$2(INTRINSICS, intrinsicRealName)) {
      value = INTRINSICS[intrinsicRealName];
    } else if (value != null) {
      if (!(part in value)) {
        if (!allowMissing) {
          throw new $TypeError$1("base intrinsic for " + name + " exists, but the property is not available.");
        }
        return void 0;
      }
      if ($gOPD && i + 1 >= parts.length) {
        var desc = $gOPD(value, part);
        isOwn = !!desc;
        if (isOwn && "get" in desc && !("originalValue" in desc.get)) {
          value = desc.get;
        } else {
          value = value[part];
        }
      } else {
        isOwn = hasOwn$2(value, part);
        value = value[part];
      }
      if (isOwn && !skipFurtherCaching) {
        INTRINSICS[intrinsicRealName] = value;
      }
    }
  }
  return value;
};
var callBind$1 = { exports: {} };
(function(module2) {
  var bind3 = functionBind;
  var GetIntrinsic3 = getIntrinsic;
  var $apply = GetIntrinsic3("%Function.prototype.apply%");
  var $call = GetIntrinsic3("%Function.prototype.call%");
  var $reflectApply = GetIntrinsic3("%Reflect.apply%", true) || bind3.call($call, $apply);
  var $gOPD2 = GetIntrinsic3("%Object.getOwnPropertyDescriptor%", true);
  var $defineProperty = GetIntrinsic3("%Object.defineProperty%", true);
  var $max = GetIntrinsic3("%Math.max%");
  if ($defineProperty) {
    try {
      $defineProperty({}, "a", { value: 1 });
    } catch (e) {
      $defineProperty = null;
    }
  }
  module2.exports = function callBind2(originalFunction) {
    var func = $reflectApply(bind3, $call, arguments);
    if ($gOPD2 && $defineProperty) {
      var desc = $gOPD2(func, "length");
      if (desc.configurable) {
        $defineProperty(
          func,
          "length",
          { value: 1 + $max(0, originalFunction.length - (arguments.length - 1)) }
        );
      }
    }
    return func;
  };
  var applyBind = function applyBind2() {
    return $reflectApply(bind3, $apply, arguments);
  };
  if ($defineProperty) {
    $defineProperty(module2.exports, "apply", { value: applyBind });
  } else {
    module2.exports.apply = applyBind;
  }
})(callBind$1);
var GetIntrinsic$1 = getIntrinsic;
var callBind = callBind$1.exports;
var $indexOf = callBind(GetIntrinsic$1("String.prototype.indexOf"));
var callBound$1 = function callBoundIntrinsic(name, allowMissing) {
  var intrinsic = GetIntrinsic$1(name, !!allowMissing);
  if (typeof intrinsic === "function" && $indexOf(name, ".prototype.") > -1) {
    return callBind(intrinsic);
  }
  return intrinsic;
};
const __viteBrowserExternal = {};
const __viteBrowserExternal$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __viteBrowserExternal
}, Symbol.toStringTag, { value: "Module" }));
const require$$0 = /* @__PURE__ */ getAugmentedNamespace(__viteBrowserExternal$1);
var hasMap = typeof Map === "function" && Map.prototype;
var mapSizeDescriptor = Object.getOwnPropertyDescriptor && hasMap ? Object.getOwnPropertyDescriptor(Map.prototype, "size") : null;
var mapSize = hasMap && mapSizeDescriptor && typeof mapSizeDescriptor.get === "function" ? mapSizeDescriptor.get : null;
var mapForEach = hasMap && Map.prototype.forEach;
var hasSet = typeof Set === "function" && Set.prototype;
var setSizeDescriptor = Object.getOwnPropertyDescriptor && hasSet ? Object.getOwnPropertyDescriptor(Set.prototype, "size") : null;
var setSize = hasSet && setSizeDescriptor && typeof setSizeDescriptor.get === "function" ? setSizeDescriptor.get : null;
var setForEach = hasSet && Set.prototype.forEach;
var hasWeakMap = typeof WeakMap === "function" && WeakMap.prototype;
var weakMapHas = hasWeakMap ? WeakMap.prototype.has : null;
var hasWeakSet = typeof WeakSet === "function" && WeakSet.prototype;
var weakSetHas = hasWeakSet ? WeakSet.prototype.has : null;
var hasWeakRef = typeof WeakRef === "function" && WeakRef.prototype;
var weakRefDeref = hasWeakRef ? WeakRef.prototype.deref : null;
var booleanValueOf = Boolean.prototype.valueOf;
var objectToString = Object.prototype.toString;
var functionToString = Function.prototype.toString;
var $match = String.prototype.match;
var $slice = String.prototype.slice;
var $replace = String.prototype.replace;
var $toUpperCase = String.prototype.toUpperCase;
var $toLowerCase = String.prototype.toLowerCase;
var $test = RegExp.prototype.test;
var $concat = Array.prototype.concat;
var $join = Array.prototype.join;
var $arrSlice = Array.prototype.slice;
var $floor = Math.floor;
var bigIntValueOf = typeof BigInt === "function" ? BigInt.prototype.valueOf : null;
var gOPS = Object.getOwnPropertySymbols;
var symToString = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? Symbol.prototype.toString : null;
var hasShammedSymbols = typeof Symbol === "function" && typeof Symbol.iterator === "object";
var toStringTag = typeof Symbol === "function" && Symbol.toStringTag && (typeof Symbol.toStringTag === hasShammedSymbols ? "object" : "symbol") ? Symbol.toStringTag : null;
var isEnumerable = Object.prototype.propertyIsEnumerable;
var gPO = (typeof Reflect === "function" ? Reflect.getPrototypeOf : Object.getPrototypeOf) || ([].__proto__ === Array.prototype ? function(O) {
  return O.__proto__;
} : null);
function addNumericSeparator(num, str) {
  if (num === Infinity || num === -Infinity || num !== num || num && num > -1e3 && num < 1e3 || $test.call(/e/, str)) {
    return str;
  }
  var sepRegex = /[0-9](?=(?:[0-9]{3})+(?![0-9]))/g;
  if (typeof num === "number") {
    var int = num < 0 ? -$floor(-num) : $floor(num);
    if (int !== num) {
      var intStr = String(int);
      var dec = $slice.call(str, intStr.length + 1);
      return $replace.call(intStr, sepRegex, "$&_") + "." + $replace.call($replace.call(dec, /([0-9]{3})/g, "$&_"), /_$/, "");
    }
  }
  return $replace.call(str, sepRegex, "$&_");
}
var utilInspect = require$$0;
var inspectCustom = utilInspect.custom;
var inspectSymbol = isSymbol(inspectCustom) ? inspectCustom : null;
var objectInspect = function inspect_(obj, options, depth, seen) {
  var opts = options || {};
  if (has$3(opts, "quoteStyle") && (opts.quoteStyle !== "single" && opts.quoteStyle !== "double")) {
    throw new TypeError('option "quoteStyle" must be "single" or "double"');
  }
  if (has$3(opts, "maxStringLength") && (typeof opts.maxStringLength === "number" ? opts.maxStringLength < 0 && opts.maxStringLength !== Infinity : opts.maxStringLength !== null)) {
    throw new TypeError('option "maxStringLength", if provided, must be a positive integer, Infinity, or `null`');
  }
  var customInspect = has$3(opts, "customInspect") ? opts.customInspect : true;
  if (typeof customInspect !== "boolean" && customInspect !== "symbol") {
    throw new TypeError("option \"customInspect\", if provided, must be `true`, `false`, or `'symbol'`");
  }
  if (has$3(opts, "indent") && opts.indent !== null && opts.indent !== "	" && !(parseInt(opts.indent, 10) === opts.indent && opts.indent > 0)) {
    throw new TypeError('option "indent" must be "\\t", an integer > 0, or `null`');
  }
  if (has$3(opts, "numericSeparator") && typeof opts.numericSeparator !== "boolean") {
    throw new TypeError('option "numericSeparator", if provided, must be `true` or `false`');
  }
  var numericSeparator = opts.numericSeparator;
  if (typeof obj === "undefined") {
    return "undefined";
  }
  if (obj === null) {
    return "null";
  }
  if (typeof obj === "boolean") {
    return obj ? "true" : "false";
  }
  if (typeof obj === "string") {
    return inspectString(obj, opts);
  }
  if (typeof obj === "number") {
    if (obj === 0) {
      return Infinity / obj > 0 ? "0" : "-0";
    }
    var str = String(obj);
    return numericSeparator ? addNumericSeparator(obj, str) : str;
  }
  if (typeof obj === "bigint") {
    var bigIntStr = String(obj) + "n";
    return numericSeparator ? addNumericSeparator(obj, bigIntStr) : bigIntStr;
  }
  var maxDepth = typeof opts.depth === "undefined" ? 5 : opts.depth;
  if (typeof depth === "undefined") {
    depth = 0;
  }
  if (depth >= maxDepth && maxDepth > 0 && typeof obj === "object") {
    return isArray$3(obj) ? "[Array]" : "[Object]";
  }
  var indent = getIndent(opts, depth);
  if (typeof seen === "undefined") {
    seen = [];
  } else if (indexOf(seen, obj) >= 0) {
    return "[Circular]";
  }
  function inspect2(value, from, noIndent) {
    if (from) {
      seen = $arrSlice.call(seen);
      seen.push(from);
    }
    if (noIndent) {
      var newOpts = {
        depth: opts.depth
      };
      if (has$3(opts, "quoteStyle")) {
        newOpts.quoteStyle = opts.quoteStyle;
      }
      return inspect_(value, newOpts, depth + 1, seen);
    }
    return inspect_(value, opts, depth + 1, seen);
  }
  if (typeof obj === "function" && !isRegExp$1(obj)) {
    var name = nameOf(obj);
    var keys = arrObjKeys(obj, inspect2);
    return "[Function" + (name ? ": " + name : " (anonymous)") + "]" + (keys.length > 0 ? " { " + $join.call(keys, ", ") + " }" : "");
  }
  if (isSymbol(obj)) {
    var symString = hasShammedSymbols ? $replace.call(String(obj), /^(Symbol\(.*\))_[^)]*$/, "$1") : symToString.call(obj);
    return typeof obj === "object" && !hasShammedSymbols ? markBoxed(symString) : symString;
  }
  if (isElement(obj)) {
    var s = "<" + $toLowerCase.call(String(obj.nodeName));
    var attrs = obj.attributes || [];
    for (var i = 0; i < attrs.length; i++) {
      s += " " + attrs[i].name + "=" + wrapQuotes(quote(attrs[i].value), "double", opts);
    }
    s += ">";
    if (obj.childNodes && obj.childNodes.length) {
      s += "...";
    }
    s += "</" + $toLowerCase.call(String(obj.nodeName)) + ">";
    return s;
  }
  if (isArray$3(obj)) {
    if (obj.length === 0) {
      return "[]";
    }
    var xs = arrObjKeys(obj, inspect2);
    if (indent && !singleLineValues(xs)) {
      return "[" + indentedJoin(xs, indent) + "]";
    }
    return "[ " + $join.call(xs, ", ") + " ]";
  }
  if (isError(obj)) {
    var parts = arrObjKeys(obj, inspect2);
    if (!("cause" in Error.prototype) && "cause" in obj && !isEnumerable.call(obj, "cause")) {
      return "{ [" + String(obj) + "] " + $join.call($concat.call("[cause]: " + inspect2(obj.cause), parts), ", ") + " }";
    }
    if (parts.length === 0) {
      return "[" + String(obj) + "]";
    }
    return "{ [" + String(obj) + "] " + $join.call(parts, ", ") + " }";
  }
  if (typeof obj === "object" && customInspect) {
    if (inspectSymbol && typeof obj[inspectSymbol] === "function" && utilInspect) {
      return utilInspect(obj, { depth: maxDepth - depth });
    } else if (customInspect !== "symbol" && typeof obj.inspect === "function") {
      return obj.inspect();
    }
  }
  if (isMap(obj)) {
    var mapParts = [];
    mapForEach.call(obj, function(value, key) {
      mapParts.push(inspect2(key, obj, true) + " => " + inspect2(value, obj));
    });
    return collectionOf("Map", mapSize.call(obj), mapParts, indent);
  }
  if (isSet(obj)) {
    var setParts = [];
    setForEach.call(obj, function(value) {
      setParts.push(inspect2(value, obj));
    });
    return collectionOf("Set", setSize.call(obj), setParts, indent);
  }
  if (isWeakMap(obj)) {
    return weakCollectionOf("WeakMap");
  }
  if (isWeakSet(obj)) {
    return weakCollectionOf("WeakSet");
  }
  if (isWeakRef(obj)) {
    return weakCollectionOf("WeakRef");
  }
  if (isNumber(obj)) {
    return markBoxed(inspect2(Number(obj)));
  }
  if (isBigInt(obj)) {
    return markBoxed(inspect2(bigIntValueOf.call(obj)));
  }
  if (isBoolean(obj)) {
    return markBoxed(booleanValueOf.call(obj));
  }
  if (isString(obj)) {
    return markBoxed(inspect2(String(obj)));
  }
  if (!isDate(obj) && !isRegExp$1(obj)) {
    var ys = arrObjKeys(obj, inspect2);
    var isPlainObject = gPO ? gPO(obj) === Object.prototype : obj instanceof Object || obj.constructor === Object;
    var protoTag = obj instanceof Object ? "" : "null prototype";
    var stringTag = !isPlainObject && toStringTag && Object(obj) === obj && toStringTag in obj ? $slice.call(toStr(obj), 8, -1) : protoTag ? "Object" : "";
    var constructorTag = isPlainObject || typeof obj.constructor !== "function" ? "" : obj.constructor.name ? obj.constructor.name + " " : "";
    var tag = constructorTag + (stringTag || protoTag ? "[" + $join.call($concat.call([], stringTag || [], protoTag || []), ": ") + "] " : "");
    if (ys.length === 0) {
      return tag + "{}";
    }
    if (indent) {
      return tag + "{" + indentedJoin(ys, indent) + "}";
    }
    return tag + "{ " + $join.call(ys, ", ") + " }";
  }
  return String(obj);
};
function wrapQuotes(s, defaultStyle, opts) {
  var quoteChar = (opts.quoteStyle || defaultStyle) === "double" ? '"' : "'";
  return quoteChar + s + quoteChar;
}
function quote(s) {
  return $replace.call(String(s), /"/g, "&quot;");
}
function isArray$3(obj) {
  return toStr(obj) === "[object Array]" && (!toStringTag || !(typeof obj === "object" && toStringTag in obj));
}
function isDate(obj) {
  return toStr(obj) === "[object Date]" && (!toStringTag || !(typeof obj === "object" && toStringTag in obj));
}
function isRegExp$1(obj) {
  return toStr(obj) === "[object RegExp]" && (!toStringTag || !(typeof obj === "object" && toStringTag in obj));
}
function isError(obj) {
  return toStr(obj) === "[object Error]" && (!toStringTag || !(typeof obj === "object" && toStringTag in obj));
}
function isString(obj) {
  return toStr(obj) === "[object String]" && (!toStringTag || !(typeof obj === "object" && toStringTag in obj));
}
function isNumber(obj) {
  return toStr(obj) === "[object Number]" && (!toStringTag || !(typeof obj === "object" && toStringTag in obj));
}
function isBoolean(obj) {
  return toStr(obj) === "[object Boolean]" && (!toStringTag || !(typeof obj === "object" && toStringTag in obj));
}
function isSymbol(obj) {
  if (hasShammedSymbols) {
    return obj && typeof obj === "object" && obj instanceof Symbol;
  }
  if (typeof obj === "symbol") {
    return true;
  }
  if (!obj || typeof obj !== "object" || !symToString) {
    return false;
  }
  try {
    symToString.call(obj);
    return true;
  } catch (e) {
  }
  return false;
}
function isBigInt(obj) {
  if (!obj || typeof obj !== "object" || !bigIntValueOf) {
    return false;
  }
  try {
    bigIntValueOf.call(obj);
    return true;
  } catch (e) {
  }
  return false;
}
var hasOwn$1 = Object.prototype.hasOwnProperty || function(key) {
  return key in this;
};
function has$3(obj, key) {
  return hasOwn$1.call(obj, key);
}
function toStr(obj) {
  return objectToString.call(obj);
}
function nameOf(f) {
  if (f.name) {
    return f.name;
  }
  var m = $match.call(functionToString.call(f), /^function\s*([\w$]+)/);
  if (m) {
    return m[1];
  }
  return null;
}
function indexOf(xs, x) {
  if (xs.indexOf) {
    return xs.indexOf(x);
  }
  for (var i = 0, l = xs.length; i < l; i++) {
    if (xs[i] === x) {
      return i;
    }
  }
  return -1;
}
function isMap(x) {
  if (!mapSize || !x || typeof x !== "object") {
    return false;
  }
  try {
    mapSize.call(x);
    try {
      setSize.call(x);
    } catch (s) {
      return true;
    }
    return x instanceof Map;
  } catch (e) {
  }
  return false;
}
function isWeakMap(x) {
  if (!weakMapHas || !x || typeof x !== "object") {
    return false;
  }
  try {
    weakMapHas.call(x, weakMapHas);
    try {
      weakSetHas.call(x, weakSetHas);
    } catch (s) {
      return true;
    }
    return x instanceof WeakMap;
  } catch (e) {
  }
  return false;
}
function isWeakRef(x) {
  if (!weakRefDeref || !x || typeof x !== "object") {
    return false;
  }
  try {
    weakRefDeref.call(x);
    return true;
  } catch (e) {
  }
  return false;
}
function isSet(x) {
  if (!setSize || !x || typeof x !== "object") {
    return false;
  }
  try {
    setSize.call(x);
    try {
      mapSize.call(x);
    } catch (m) {
      return true;
    }
    return x instanceof Set;
  } catch (e) {
  }
  return false;
}
function isWeakSet(x) {
  if (!weakSetHas || !x || typeof x !== "object") {
    return false;
  }
  try {
    weakSetHas.call(x, weakSetHas);
    try {
      weakMapHas.call(x, weakMapHas);
    } catch (s) {
      return true;
    }
    return x instanceof WeakSet;
  } catch (e) {
  }
  return false;
}
function isElement(x) {
  if (!x || typeof x !== "object") {
    return false;
  }
  if (typeof HTMLElement !== "undefined" && x instanceof HTMLElement) {
    return true;
  }
  return typeof x.nodeName === "string" && typeof x.getAttribute === "function";
}
function inspectString(str, opts) {
  if (str.length > opts.maxStringLength) {
    var remaining = str.length - opts.maxStringLength;
    var trailer = "... " + remaining + " more character" + (remaining > 1 ? "s" : "");
    return inspectString($slice.call(str, 0, opts.maxStringLength), opts) + trailer;
  }
  var s = $replace.call($replace.call(str, /(['\\])/g, "\\$1"), /[\x00-\x1f]/g, lowbyte);
  return wrapQuotes(s, "single", opts);
}
function lowbyte(c) {
  var n = c.charCodeAt(0);
  var x = {
    8: "b",
    9: "t",
    10: "n",
    12: "f",
    13: "r"
  }[n];
  if (x) {
    return "\\" + x;
  }
  return "\\x" + (n < 16 ? "0" : "") + $toUpperCase.call(n.toString(16));
}
function markBoxed(str) {
  return "Object(" + str + ")";
}
function weakCollectionOf(type) {
  return type + " { ? }";
}
function collectionOf(type, size, entries, indent) {
  var joinedEntries = indent ? indentedJoin(entries, indent) : $join.call(entries, ", ");
  return type + " (" + size + ") {" + joinedEntries + "}";
}
function singleLineValues(xs) {
  for (var i = 0; i < xs.length; i++) {
    if (indexOf(xs[i], "\n") >= 0) {
      return false;
    }
  }
  return true;
}
function getIndent(opts, depth) {
  var baseIndent;
  if (opts.indent === "	") {
    baseIndent = "	";
  } else if (typeof opts.indent === "number" && opts.indent > 0) {
    baseIndent = $join.call(Array(opts.indent + 1), " ");
  } else {
    return null;
  }
  return {
    base: baseIndent,
    prev: $join.call(Array(depth + 1), baseIndent)
  };
}
function indentedJoin(xs, indent) {
  if (xs.length === 0) {
    return "";
  }
  var lineJoiner = "\n" + indent.prev + indent.base;
  return lineJoiner + $join.call(xs, "," + lineJoiner) + "\n" + indent.prev;
}
function arrObjKeys(obj, inspect2) {
  var isArr = isArray$3(obj);
  var xs = [];
  if (isArr) {
    xs.length = obj.length;
    for (var i = 0; i < obj.length; i++) {
      xs[i] = has$3(obj, i) ? inspect2(obj[i], obj) : "";
    }
  }
  var syms = typeof gOPS === "function" ? gOPS(obj) : [];
  var symMap;
  if (hasShammedSymbols) {
    symMap = {};
    for (var k = 0; k < syms.length; k++) {
      symMap["$" + syms[k]] = syms[k];
    }
  }
  for (var key in obj) {
    if (!has$3(obj, key)) {
      continue;
    }
    if (isArr && String(Number(key)) === key && key < obj.length) {
      continue;
    }
    if (hasShammedSymbols && symMap["$" + key] instanceof Symbol) {
      continue;
    } else if ($test.call(/[^\w$]/, key)) {
      xs.push(inspect2(key, obj) + ": " + inspect2(obj[key], obj));
    } else {
      xs.push(key + ": " + inspect2(obj[key], obj));
    }
  }
  if (typeof gOPS === "function") {
    for (var j = 0; j < syms.length; j++) {
      if (isEnumerable.call(obj, syms[j])) {
        xs.push("[" + inspect2(syms[j]) + "]: " + inspect2(obj[syms[j]], obj));
      }
    }
  }
  return xs;
}
var GetIntrinsic2 = getIntrinsic;
var callBound = callBound$1;
var inspect = objectInspect;
var $TypeError = GetIntrinsic2("%TypeError%");
var $WeakMap = GetIntrinsic2("%WeakMap%", true);
var $Map = GetIntrinsic2("%Map%", true);
var $weakMapGet = callBound("WeakMap.prototype.get", true);
var $weakMapSet = callBound("WeakMap.prototype.set", true);
var $weakMapHas = callBound("WeakMap.prototype.has", true);
var $mapGet = callBound("Map.prototype.get", true);
var $mapSet = callBound("Map.prototype.set", true);
var $mapHas = callBound("Map.prototype.has", true);
var listGetNode = function(list, key) {
  for (var prev = list, curr; (curr = prev.next) !== null; prev = curr) {
    if (curr.key === key) {
      prev.next = curr.next;
      curr.next = list.next;
      list.next = curr;
      return curr;
    }
  }
};
var listGet = function(objects, key) {
  var node = listGetNode(objects, key);
  return node && node.value;
};
var listSet = function(objects, key, value) {
  var node = listGetNode(objects, key);
  if (node) {
    node.value = value;
  } else {
    objects.next = {
      key,
      next: objects.next,
      value
    };
  }
};
var listHas = function(objects, key) {
  return !!listGetNode(objects, key);
};
var sideChannel = function getSideChannel() {
  var $wm;
  var $m;
  var $o;
  var channel = {
    assert: function(key) {
      if (!channel.has(key)) {
        throw new $TypeError("Side channel does not contain " + inspect(key));
      }
    },
    get: function(key) {
      if ($WeakMap && key && (typeof key === "object" || typeof key === "function")) {
        if ($wm) {
          return $weakMapGet($wm, key);
        }
      } else if ($Map) {
        if ($m) {
          return $mapGet($m, key);
        }
      } else {
        if ($o) {
          return listGet($o, key);
        }
      }
    },
    has: function(key) {
      if ($WeakMap && key && (typeof key === "object" || typeof key === "function")) {
        if ($wm) {
          return $weakMapHas($wm, key);
        }
      } else if ($Map) {
        if ($m) {
          return $mapHas($m, key);
        }
      } else {
        if ($o) {
          return listHas($o, key);
        }
      }
      return false;
    },
    set: function(key, value) {
      if ($WeakMap && key && (typeof key === "object" || typeof key === "function")) {
        if (!$wm) {
          $wm = new $WeakMap();
        }
        $weakMapSet($wm, key, value);
      } else if ($Map) {
        if (!$m) {
          $m = new $Map();
        }
        $mapSet($m, key, value);
      } else {
        if (!$o) {
          $o = { key: {}, next: null };
        }
        listSet($o, key, value);
      }
    }
  };
  return channel;
};
var replace = String.prototype.replace;
var percentTwenties = /%20/g;
var Format = {
  RFC1738: "RFC1738",
  RFC3986: "RFC3986"
};
var formats$3 = {
  "default": Format.RFC3986,
  formatters: {
    RFC1738: function(value) {
      return replace.call(value, percentTwenties, "+");
    },
    RFC3986: function(value) {
      return String(value);
    }
  },
  RFC1738: Format.RFC1738,
  RFC3986: Format.RFC3986
};
var formats$2 = formats$3;
var has$2 = Object.prototype.hasOwnProperty;
var isArray$2 = Array.isArray;
var hexTable = function() {
  var array = [];
  for (var i = 0; i < 256; ++i) {
    array.push("%" + ((i < 16 ? "0" : "") + i.toString(16)).toUpperCase());
  }
  return array;
}();
var compactQueue = function compactQueue2(queue) {
  while (queue.length > 1) {
    var item = queue.pop();
    var obj = item.obj[item.prop];
    if (isArray$2(obj)) {
      var compacted = [];
      for (var j = 0; j < obj.length; ++j) {
        if (typeof obj[j] !== "undefined") {
          compacted.push(obj[j]);
        }
      }
      item.obj[item.prop] = compacted;
    }
  }
};
var arrayToObject = function arrayToObject2(source, options) {
  var obj = options && options.plainObjects ? /* @__PURE__ */ Object.create(null) : {};
  for (var i = 0; i < source.length; ++i) {
    if (typeof source[i] !== "undefined") {
      obj[i] = source[i];
    }
  }
  return obj;
};
var merge = function merge2(target, source, options) {
  if (!source) {
    return target;
  }
  if (typeof source !== "object") {
    if (isArray$2(target)) {
      target.push(source);
    } else if (target && typeof target === "object") {
      if (options && (options.plainObjects || options.allowPrototypes) || !has$2.call(Object.prototype, source)) {
        target[source] = true;
      }
    } else {
      return [target, source];
    }
    return target;
  }
  if (!target || typeof target !== "object") {
    return [target].concat(source);
  }
  var mergeTarget = target;
  if (isArray$2(target) && !isArray$2(source)) {
    mergeTarget = arrayToObject(target, options);
  }
  if (isArray$2(target) && isArray$2(source)) {
    source.forEach(function(item, i) {
      if (has$2.call(target, i)) {
        var targetItem = target[i];
        if (targetItem && typeof targetItem === "object" && item && typeof item === "object") {
          target[i] = merge2(targetItem, item, options);
        } else {
          target.push(item);
        }
      } else {
        target[i] = item;
      }
    });
    return target;
  }
  return Object.keys(source).reduce(function(acc, key) {
    var value = source[key];
    if (has$2.call(acc, key)) {
      acc[key] = merge2(acc[key], value, options);
    } else {
      acc[key] = value;
    }
    return acc;
  }, mergeTarget);
};
var assign = function assignSingleSource(target, source) {
  return Object.keys(source).reduce(function(acc, key) {
    acc[key] = source[key];
    return acc;
  }, target);
};
var decode = function(str, decoder, charset) {
  var strWithoutPlus = str.replace(/\+/g, " ");
  if (charset === "iso-8859-1") {
    return strWithoutPlus.replace(/%[0-9a-f]{2}/gi, unescape);
  }
  try {
    return decodeURIComponent(strWithoutPlus);
  } catch (e) {
    return strWithoutPlus;
  }
};
var encode = function encode2(str, defaultEncoder, charset, kind, format) {
  if (str.length === 0) {
    return str;
  }
  var string = str;
  if (typeof str === "symbol") {
    string = Symbol.prototype.toString.call(str);
  } else if (typeof str !== "string") {
    string = String(str);
  }
  if (charset === "iso-8859-1") {
    return escape(string).replace(/%u[0-9a-f]{4}/gi, function($0) {
      return "%26%23" + parseInt($0.slice(2), 16) + "%3B";
    });
  }
  var out = "";
  for (var i = 0; i < string.length; ++i) {
    var c = string.charCodeAt(i);
    if (c === 45 || c === 46 || c === 95 || c === 126 || c >= 48 && c <= 57 || c >= 65 && c <= 90 || c >= 97 && c <= 122 || format === formats$2.RFC1738 && (c === 40 || c === 41)) {
      out += string.charAt(i);
      continue;
    }
    if (c < 128) {
      out = out + hexTable[c];
      continue;
    }
    if (c < 2048) {
      out = out + (hexTable[192 | c >> 6] + hexTable[128 | c & 63]);
      continue;
    }
    if (c < 55296 || c >= 57344) {
      out = out + (hexTable[224 | c >> 12] + hexTable[128 | c >> 6 & 63] + hexTable[128 | c & 63]);
      continue;
    }
    i += 1;
    c = 65536 + ((c & 1023) << 10 | string.charCodeAt(i) & 1023);
    out += hexTable[240 | c >> 18] + hexTable[128 | c >> 12 & 63] + hexTable[128 | c >> 6 & 63] + hexTable[128 | c & 63];
  }
  return out;
};
var compact = function compact2(value) {
  var queue = [{ obj: { o: value }, prop: "o" }];
  var refs = [];
  for (var i = 0; i < queue.length; ++i) {
    var item = queue[i];
    var obj = item.obj[item.prop];
    var keys = Object.keys(obj);
    for (var j = 0; j < keys.length; ++j) {
      var key = keys[j];
      var val = obj[key];
      if (typeof val === "object" && val !== null && refs.indexOf(val) === -1) {
        queue.push({ obj, prop: key });
        refs.push(val);
      }
    }
  }
  compactQueue(queue);
  return value;
};
var isRegExp = function isRegExp2(obj) {
  return Object.prototype.toString.call(obj) === "[object RegExp]";
};
var isBuffer = function isBuffer2(obj) {
  if (!obj || typeof obj !== "object") {
    return false;
  }
  return !!(obj.constructor && obj.constructor.isBuffer && obj.constructor.isBuffer(obj));
};
var combine = function combine2(a, b) {
  return [].concat(a, b);
};
var maybeMap = function maybeMap2(val, fn) {
  if (isArray$2(val)) {
    var mapped = [];
    for (var i = 0; i < val.length; i += 1) {
      mapped.push(fn(val[i]));
    }
    return mapped;
  }
  return fn(val);
};
var utils$4 = {
  arrayToObject,
  assign,
  combine,
  compact,
  decode,
  encode,
  isBuffer,
  isRegExp,
  maybeMap,
  merge
};
var getSideChannel2 = sideChannel;
var utils$3 = utils$4;
var formats$1 = formats$3;
var has$1 = Object.prototype.hasOwnProperty;
var arrayPrefixGenerators = {
  brackets: function brackets(prefix) {
    return prefix + "[]";
  },
  comma: "comma",
  indices: function indices(prefix, key) {
    return prefix + "[" + key + "]";
  },
  repeat: function repeat(prefix) {
    return prefix;
  }
};
var isArray$1 = Array.isArray;
var split = String.prototype.split;
var push = Array.prototype.push;
var pushToArray = function(arr2, valueOrArray) {
  push.apply(arr2, isArray$1(valueOrArray) ? valueOrArray : [valueOrArray]);
};
var toISO = Date.prototype.toISOString;
var defaultFormat = formats$1["default"];
var defaults$1 = {
  addQueryPrefix: false,
  allowDots: false,
  charset: "utf-8",
  charsetSentinel: false,
  delimiter: "&",
  encode: true,
  encoder: utils$3.encode,
  encodeValuesOnly: false,
  format: defaultFormat,
  formatter: formats$1.formatters[defaultFormat],
  indices: false,
  serializeDate: function serializeDate(date) {
    return toISO.call(date);
  },
  skipNulls: false,
  strictNullHandling: false
};
var isNonNullishPrimitive = function isNonNullishPrimitive2(v) {
  return typeof v === "string" || typeof v === "number" || typeof v === "boolean" || typeof v === "symbol" || typeof v === "bigint";
};
var sentinel = {};
var stringify$1 = function stringify(object, prefix, generateArrayPrefix, strictNullHandling, skipNulls, encoder, filter, sort, allowDots, serializeDate2, format, formatter, encodeValuesOnly, charset, sideChannel2) {
  var obj = object;
  var tmpSc = sideChannel2;
  var step = 0;
  var findFlag = false;
  while ((tmpSc = tmpSc.get(sentinel)) !== void 0 && !findFlag) {
    var pos = tmpSc.get(object);
    step += 1;
    if (typeof pos !== "undefined") {
      if (pos === step) {
        throw new RangeError("Cyclic object value");
      } else {
        findFlag = true;
      }
    }
    if (typeof tmpSc.get(sentinel) === "undefined") {
      step = 0;
    }
  }
  if (typeof filter === "function") {
    obj = filter(prefix, obj);
  } else if (obj instanceof Date) {
    obj = serializeDate2(obj);
  } else if (generateArrayPrefix === "comma" && isArray$1(obj)) {
    obj = utils$3.maybeMap(obj, function(value2) {
      if (value2 instanceof Date) {
        return serializeDate2(value2);
      }
      return value2;
    });
  }
  if (obj === null) {
    if (strictNullHandling) {
      return encoder && !encodeValuesOnly ? encoder(prefix, defaults$1.encoder, charset, "key", format) : prefix;
    }
    obj = "";
  }
  if (isNonNullishPrimitive(obj) || utils$3.isBuffer(obj)) {
    if (encoder) {
      var keyValue = encodeValuesOnly ? prefix : encoder(prefix, defaults$1.encoder, charset, "key", format);
      if (generateArrayPrefix === "comma" && encodeValuesOnly) {
        var valuesArray = split.call(String(obj), ",");
        var valuesJoined = "";
        for (var i = 0; i < valuesArray.length; ++i) {
          valuesJoined += (i === 0 ? "" : ",") + formatter(encoder(valuesArray[i], defaults$1.encoder, charset, "value", format));
        }
        return [formatter(keyValue) + (isArray$1(obj) && valuesArray.length === 1 ? "[]" : "") + "=" + valuesJoined];
      }
      return [formatter(keyValue) + "=" + formatter(encoder(obj, defaults$1.encoder, charset, "value", format))];
    }
    return [formatter(prefix) + "=" + formatter(String(obj))];
  }
  var values = [];
  if (typeof obj === "undefined") {
    return values;
  }
  var objKeys;
  if (generateArrayPrefix === "comma" && isArray$1(obj)) {
    objKeys = [{ value: obj.length > 0 ? obj.join(",") || null : void 0 }];
  } else if (isArray$1(filter)) {
    objKeys = filter;
  } else {
    var keys = Object.keys(obj);
    objKeys = sort ? keys.sort(sort) : keys;
  }
  var adjustedPrefix = generateArrayPrefix === "comma" && isArray$1(obj) && obj.length === 1 ? prefix + "[]" : prefix;
  for (var j = 0; j < objKeys.length; ++j) {
    var key = objKeys[j];
    var value = typeof key === "object" && typeof key.value !== "undefined" ? key.value : obj[key];
    if (skipNulls && value === null) {
      continue;
    }
    var keyPrefix = isArray$1(obj) ? typeof generateArrayPrefix === "function" ? generateArrayPrefix(adjustedPrefix, key) : adjustedPrefix : adjustedPrefix + (allowDots ? "." + key : "[" + key + "]");
    sideChannel2.set(object, step);
    var valueSideChannel = getSideChannel2();
    valueSideChannel.set(sentinel, sideChannel2);
    pushToArray(values, stringify(
      value,
      keyPrefix,
      generateArrayPrefix,
      strictNullHandling,
      skipNulls,
      encoder,
      filter,
      sort,
      allowDots,
      serializeDate2,
      format,
      formatter,
      encodeValuesOnly,
      charset,
      valueSideChannel
    ));
  }
  return values;
};
var normalizeStringifyOptions = function normalizeStringifyOptions2(opts) {
  if (!opts) {
    return defaults$1;
  }
  if (opts.encoder !== null && typeof opts.encoder !== "undefined" && typeof opts.encoder !== "function") {
    throw new TypeError("Encoder has to be a function.");
  }
  var charset = opts.charset || defaults$1.charset;
  if (typeof opts.charset !== "undefined" && opts.charset !== "utf-8" && opts.charset !== "iso-8859-1") {
    throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
  }
  var format = formats$1["default"];
  if (typeof opts.format !== "undefined") {
    if (!has$1.call(formats$1.formatters, opts.format)) {
      throw new TypeError("Unknown format option provided.");
    }
    format = opts.format;
  }
  var formatter = formats$1.formatters[format];
  var filter = defaults$1.filter;
  if (typeof opts.filter === "function" || isArray$1(opts.filter)) {
    filter = opts.filter;
  }
  return {
    addQueryPrefix: typeof opts.addQueryPrefix === "boolean" ? opts.addQueryPrefix : defaults$1.addQueryPrefix,
    allowDots: typeof opts.allowDots === "undefined" ? defaults$1.allowDots : !!opts.allowDots,
    charset,
    charsetSentinel: typeof opts.charsetSentinel === "boolean" ? opts.charsetSentinel : defaults$1.charsetSentinel,
    delimiter: typeof opts.delimiter === "undefined" ? defaults$1.delimiter : opts.delimiter,
    encode: typeof opts.encode === "boolean" ? opts.encode : defaults$1.encode,
    encoder: typeof opts.encoder === "function" ? opts.encoder : defaults$1.encoder,
    encodeValuesOnly: typeof opts.encodeValuesOnly === "boolean" ? opts.encodeValuesOnly : defaults$1.encodeValuesOnly,
    filter,
    format,
    formatter,
    serializeDate: typeof opts.serializeDate === "function" ? opts.serializeDate : defaults$1.serializeDate,
    skipNulls: typeof opts.skipNulls === "boolean" ? opts.skipNulls : defaults$1.skipNulls,
    sort: typeof opts.sort === "function" ? opts.sort : null,
    strictNullHandling: typeof opts.strictNullHandling === "boolean" ? opts.strictNullHandling : defaults$1.strictNullHandling
  };
};
var stringify_1 = function(object, opts) {
  var obj = object;
  var options = normalizeStringifyOptions(opts);
  var objKeys;
  var filter;
  if (typeof options.filter === "function") {
    filter = options.filter;
    obj = filter("", obj);
  } else if (isArray$1(options.filter)) {
    filter = options.filter;
    objKeys = filter;
  }
  var keys = [];
  if (typeof obj !== "object" || obj === null) {
    return "";
  }
  var arrayFormat;
  if (opts && opts.arrayFormat in arrayPrefixGenerators) {
    arrayFormat = opts.arrayFormat;
  } else if (opts && "indices" in opts) {
    arrayFormat = opts.indices ? "indices" : "repeat";
  } else {
    arrayFormat = "indices";
  }
  var generateArrayPrefix = arrayPrefixGenerators[arrayFormat];
  if (!objKeys) {
    objKeys = Object.keys(obj);
  }
  if (options.sort) {
    objKeys.sort(options.sort);
  }
  var sideChannel2 = getSideChannel2();
  for (var i = 0; i < objKeys.length; ++i) {
    var key = objKeys[i];
    if (options.skipNulls && obj[key] === null) {
      continue;
    }
    pushToArray(keys, stringify$1(
      obj[key],
      key,
      generateArrayPrefix,
      options.strictNullHandling,
      options.skipNulls,
      options.encode ? options.encoder : null,
      options.filter,
      options.sort,
      options.allowDots,
      options.serializeDate,
      options.format,
      options.formatter,
      options.encodeValuesOnly,
      options.charset,
      sideChannel2
    ));
  }
  var joined = keys.join(options.delimiter);
  var prefix = options.addQueryPrefix === true ? "?" : "";
  if (options.charsetSentinel) {
    if (options.charset === "iso-8859-1") {
      prefix += "utf8=%26%2310003%3B&";
    } else {
      prefix += "utf8=%E2%9C%93&";
    }
  }
  return joined.length > 0 ? prefix + joined : "";
};
var utils$2 = utils$4;
var has = Object.prototype.hasOwnProperty;
var isArray = Array.isArray;
var defaults = {
  allowDots: false,
  allowPrototypes: false,
  allowSparse: false,
  arrayLimit: 20,
  charset: "utf-8",
  charsetSentinel: false,
  comma: false,
  decoder: utils$2.decode,
  delimiter: "&",
  depth: 5,
  ignoreQueryPrefix: false,
  interpretNumericEntities: false,
  parameterLimit: 1e3,
  parseArrays: true,
  plainObjects: false,
  strictNullHandling: false
};
var interpretNumericEntities = function(str) {
  return str.replace(/&#(\d+);/g, function($0, numberStr) {
    return String.fromCharCode(parseInt(numberStr, 10));
  });
};
var parseArrayValue = function(val, options) {
  if (val && typeof val === "string" && options.comma && val.indexOf(",") > -1) {
    return val.split(",");
  }
  return val;
};
var isoSentinel = "utf8=%26%2310003%3B";
var charsetSentinel = "utf8=%E2%9C%93";
var parseValues = function parseQueryStringValues(str, options) {
  var obj = {};
  var cleanStr = options.ignoreQueryPrefix ? str.replace(/^\?/, "") : str;
  var limit = options.parameterLimit === Infinity ? void 0 : options.parameterLimit;
  var parts = cleanStr.split(options.delimiter, limit);
  var skipIndex = -1;
  var i;
  var charset = options.charset;
  if (options.charsetSentinel) {
    for (i = 0; i < parts.length; ++i) {
      if (parts[i].indexOf("utf8=") === 0) {
        if (parts[i] === charsetSentinel) {
          charset = "utf-8";
        } else if (parts[i] === isoSentinel) {
          charset = "iso-8859-1";
        }
        skipIndex = i;
        i = parts.length;
      }
    }
  }
  for (i = 0; i < parts.length; ++i) {
    if (i === skipIndex) {
      continue;
    }
    var part = parts[i];
    var bracketEqualsPos = part.indexOf("]=");
    var pos = bracketEqualsPos === -1 ? part.indexOf("=") : bracketEqualsPos + 1;
    var key, val;
    if (pos === -1) {
      key = options.decoder(part, defaults.decoder, charset, "key");
      val = options.strictNullHandling ? null : "";
    } else {
      key = options.decoder(part.slice(0, pos), defaults.decoder, charset, "key");
      val = utils$2.maybeMap(
        parseArrayValue(part.slice(pos + 1), options),
        function(encodedVal) {
          return options.decoder(encodedVal, defaults.decoder, charset, "value");
        }
      );
    }
    if (val && options.interpretNumericEntities && charset === "iso-8859-1") {
      val = interpretNumericEntities(val);
    }
    if (part.indexOf("[]=") > -1) {
      val = isArray(val) ? [val] : val;
    }
    if (has.call(obj, key)) {
      obj[key] = utils$2.combine(obj[key], val);
    } else {
      obj[key] = val;
    }
  }
  return obj;
};
var parseObject = function(chain, val, options, valuesParsed) {
  var leaf = valuesParsed ? val : parseArrayValue(val, options);
  for (var i = chain.length - 1; i >= 0; --i) {
    var obj;
    var root = chain[i];
    if (root === "[]" && options.parseArrays) {
      obj = [].concat(leaf);
    } else {
      obj = options.plainObjects ? /* @__PURE__ */ Object.create(null) : {};
      var cleanRoot = root.charAt(0) === "[" && root.charAt(root.length - 1) === "]" ? root.slice(1, -1) : root;
      var index = parseInt(cleanRoot, 10);
      if (!options.parseArrays && cleanRoot === "") {
        obj = { 0: leaf };
      } else if (!isNaN(index) && root !== cleanRoot && String(index) === cleanRoot && index >= 0 && (options.parseArrays && index <= options.arrayLimit)) {
        obj = [];
        obj[index] = leaf;
      } else if (cleanRoot !== "__proto__") {
        obj[cleanRoot] = leaf;
      }
    }
    leaf = obj;
  }
  return leaf;
};
var parseKeys = function parseQueryStringKeys(givenKey, val, options, valuesParsed) {
  if (!givenKey) {
    return;
  }
  var key = options.allowDots ? givenKey.replace(/\.([^.[]+)/g, "[$1]") : givenKey;
  var brackets2 = /(\[[^[\]]*])/;
  var child = /(\[[^[\]]*])/g;
  var segment = options.depth > 0 && brackets2.exec(key);
  var parent = segment ? key.slice(0, segment.index) : key;
  var keys = [];
  if (parent) {
    if (!options.plainObjects && has.call(Object.prototype, parent)) {
      if (!options.allowPrototypes) {
        return;
      }
    }
    keys.push(parent);
  }
  var i = 0;
  while (options.depth > 0 && (segment = child.exec(key)) !== null && i < options.depth) {
    i += 1;
    if (!options.plainObjects && has.call(Object.prototype, segment[1].slice(1, -1))) {
      if (!options.allowPrototypes) {
        return;
      }
    }
    keys.push(segment[1]);
  }
  if (segment) {
    keys.push("[" + key.slice(segment.index) + "]");
  }
  return parseObject(keys, val, options, valuesParsed);
};
var normalizeParseOptions = function normalizeParseOptions2(opts) {
  if (!opts) {
    return defaults;
  }
  if (opts.decoder !== null && opts.decoder !== void 0 && typeof opts.decoder !== "function") {
    throw new TypeError("Decoder has to be a function.");
  }
  if (typeof opts.charset !== "undefined" && opts.charset !== "utf-8" && opts.charset !== "iso-8859-1") {
    throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
  }
  var charset = typeof opts.charset === "undefined" ? defaults.charset : opts.charset;
  return {
    allowDots: typeof opts.allowDots === "undefined" ? defaults.allowDots : !!opts.allowDots,
    allowPrototypes: typeof opts.allowPrototypes === "boolean" ? opts.allowPrototypes : defaults.allowPrototypes,
    allowSparse: typeof opts.allowSparse === "boolean" ? opts.allowSparse : defaults.allowSparse,
    arrayLimit: typeof opts.arrayLimit === "number" ? opts.arrayLimit : defaults.arrayLimit,
    charset,
    charsetSentinel: typeof opts.charsetSentinel === "boolean" ? opts.charsetSentinel : defaults.charsetSentinel,
    comma: typeof opts.comma === "boolean" ? opts.comma : defaults.comma,
    decoder: typeof opts.decoder === "function" ? opts.decoder : defaults.decoder,
    delimiter: typeof opts.delimiter === "string" || utils$2.isRegExp(opts.delimiter) ? opts.delimiter : defaults.delimiter,
    depth: typeof opts.depth === "number" || opts.depth === false ? +opts.depth : defaults.depth,
    ignoreQueryPrefix: opts.ignoreQueryPrefix === true,
    interpretNumericEntities: typeof opts.interpretNumericEntities === "boolean" ? opts.interpretNumericEntities : defaults.interpretNumericEntities,
    parameterLimit: typeof opts.parameterLimit === "number" ? opts.parameterLimit : defaults.parameterLimit,
    parseArrays: opts.parseArrays !== false,
    plainObjects: typeof opts.plainObjects === "boolean" ? opts.plainObjects : defaults.plainObjects,
    strictNullHandling: typeof opts.strictNullHandling === "boolean" ? opts.strictNullHandling : defaults.strictNullHandling
  };
};
var parse$1 = function(str, opts) {
  var options = normalizeParseOptions(opts);
  if (str === "" || str === null || typeof str === "undefined") {
    return options.plainObjects ? /* @__PURE__ */ Object.create(null) : {};
  }
  var tempObj = typeof str === "string" ? parseValues(str, options) : str;
  var obj = options.plainObjects ? /* @__PURE__ */ Object.create(null) : {};
  var keys = Object.keys(tempObj);
  for (var i = 0; i < keys.length; ++i) {
    var key = keys[i];
    var newObj = parseKeys(key, tempObj[key], options, typeof str === "string");
    obj = utils$2.merge(obj, newObj, options);
  }
  if (options.allowSparse === true) {
    return obj;
  }
  return utils$2.compact(obj);
};
var stringify2 = stringify_1;
var parse = parse$1;
var formats = formats$3;
var lib = {
  formats,
  parse,
  stringify: stringify2
};
var utils$1 = {};
(function(exports) {
  function _typeof2(obj) {
    "@babel/helpers - typeof";
    return _typeof2 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj2) {
      return typeof obj2;
    } : function(obj2) {
      return obj2 && "function" == typeof Symbol && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
    }, _typeof2(obj);
  }
  function _createForOfIteratorHelper2(o, allowArrayLike) {
    var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
    if (!it) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray2(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it)
          o = it;
        var i = 0;
        var F = function F2() {
        };
        return { s: F, n: function n() {
          if (i >= o.length)
            return { done: true };
          return { done: false, value: o[i++] };
        }, e: function e(_e) {
          throw _e;
        }, f: F };
      }
      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    var normalCompletion = true, didErr = false, err;
    return { s: function s() {
      it = it.call(o);
    }, n: function n() {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    }, e: function e(_e2) {
      didErr = true;
      err = _e2;
    }, f: function f() {
      try {
        if (!normalCompletion && it.return != null)
          it.return();
      } finally {
        if (didErr)
          throw err;
      }
    } };
  }
  function _unsupportedIterableToArray2(o, minLen) {
    if (!o)
      return;
    if (typeof o === "string")
      return _arrayLikeToArray2(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor)
      n = o.constructor.name;
    if (n === "Map" || n === "Set")
      return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
      return _arrayLikeToArray2(o, minLen);
  }
  function _arrayLikeToArray2(arr2, len) {
    if (len == null || len > arr2.length)
      len = arr2.length;
    for (var i = 0, arr22 = new Array(len); i < len; i++) {
      arr22[i] = arr2[i];
    }
    return arr22;
  }
  exports.type = function(string_) {
    return string_.split(/ *; */).shift();
  };
  exports.params = function(value) {
    var object = {};
    var _iterator = _createForOfIteratorHelper2(value.split(/ *; */)), _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done; ) {
        var string_ = _step.value;
        var parts = string_.split(/ *= */);
        var key = parts.shift();
        var _value = parts.shift();
        if (key && _value)
          object[key] = _value;
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    return object;
  };
  exports.parseLinks = function(value) {
    var object = {};
    var _iterator2 = _createForOfIteratorHelper2(value.split(/ *, */)), _step2;
    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done; ) {
        var string_ = _step2.value;
        var parts = string_.split(/ *; */);
        var url = parts[0].slice(1, -1);
        var rel = parts[1].split(/ *= */)[1].slice(1, -1);
        object[rel] = url;
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
    return object;
  };
  exports.cleanHeader = function(header, changesOrigin) {
    delete header["content-type"];
    delete header["content-length"];
    delete header["transfer-encoding"];
    delete header.host;
    if (changesOrigin) {
      delete header.authorization;
      delete header.cookie;
    }
    return header;
  };
  exports.isObject = function(object) {
    return object !== null && _typeof2(object) === "object";
  };
  exports.hasOwn = Object.hasOwn || function(object, property) {
    if (object == null) {
      throw new TypeError("Cannot convert undefined or null to object");
    }
    return Object.prototype.hasOwnProperty.call(new Object(object), property);
  };
  exports.mixin = function(target, source) {
    for (var key in source) {
      if (exports.hasOwn(source, key)) {
        target[key] = source[key];
      }
    }
  };
})(utils$1);
function _typeof(obj) {
  "@babel/helpers - typeof";
  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj2) {
    return typeof obj2;
  } : function(obj2) {
    return obj2 && "function" == typeof Symbol && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
  }, _typeof(obj);
}
var semver = require$$0;
var _require = utils$1, isObject = _require.isObject, hasOwn = _require.hasOwn;
var requestBase = RequestBase;
function RequestBase() {
}
RequestBase.prototype.clearTimeout = function() {
  clearTimeout(this._timer);
  clearTimeout(this._responseTimeoutTimer);
  clearTimeout(this._uploadTimeoutTimer);
  delete this._timer;
  delete this._responseTimeoutTimer;
  delete this._uploadTimeoutTimer;
  return this;
};
RequestBase.prototype.parse = function(fn) {
  this._parser = fn;
  return this;
};
RequestBase.prototype.responseType = function(value) {
  this._responseType = value;
  return this;
};
RequestBase.prototype.serialize = function(fn) {
  this._serializer = fn;
  return this;
};
RequestBase.prototype.timeout = function(options) {
  if (!options || _typeof(options) !== "object") {
    this._timeout = options;
    this._responseTimeout = 0;
    this._uploadTimeout = 0;
    return this;
  }
  for (var option in options) {
    if (hasOwn(options, option)) {
      switch (option) {
        case "deadline":
          this._timeout = options.deadline;
          break;
        case "response":
          this._responseTimeout = options.response;
          break;
        case "upload":
          this._uploadTimeout = options.upload;
          break;
        default:
          console.warn("Unknown timeout option", option);
      }
    }
  }
  return this;
};
RequestBase.prototype.retry = function(count, fn) {
  if (arguments.length === 0 || count === true)
    count = 1;
  if (count <= 0)
    count = 0;
  this._maxRetries = count;
  this._retries = 0;
  this._retryCallback = fn;
  return this;
};
var ERROR_CODES = /* @__PURE__ */ new Set(["ETIMEDOUT", "ECONNRESET", "EADDRINUSE", "ECONNREFUSED", "EPIPE", "ENOTFOUND", "ENETUNREACH", "EAI_AGAIN"]);
var STATUS_CODES = /* @__PURE__ */ new Set([408, 413, 429, 500, 502, 503, 504, 521, 522, 524]);
RequestBase.prototype._shouldRetry = function(error, res) {
  if (!this._maxRetries || this._retries++ >= this._maxRetries) {
    return false;
  }
  if (this._retryCallback) {
    try {
      var override = this._retryCallback(error, res);
      if (override === true)
        return true;
      if (override === false)
        return false;
    } catch (err) {
      console.error(err);
    }
  }
  if (res && res.status && STATUS_CODES.has(res.status))
    return true;
  if (error) {
    if (error.code && ERROR_CODES.has(error.code))
      return true;
    if (error.timeout && error.code === "ECONNABORTED")
      return true;
    if (error.crossDomain)
      return true;
  }
  return false;
};
RequestBase.prototype._retry = function() {
  this.clearTimeout();
  if (this.req) {
    this.req = null;
    this.req = this.request();
  }
  this._aborted = false;
  this.timedout = false;
  this.timedoutError = null;
  return this._end();
};
RequestBase.prototype.then = function(resolve, reject) {
  var _this = this;
  if (!this._fullfilledPromise) {
    var self2 = this;
    if (this._endCalled) {
      console.warn("Warning: superagent request was sent twice, because both .end() and .then() were called. Never call .end() if you use promises");
    }
    this._fullfilledPromise = new Promise(function(resolve2, reject2) {
      self2.on("abort", function() {
        if (_this._maxRetries && _this._maxRetries > _this._retries) {
          return;
        }
        if (_this.timedout && _this.timedoutError) {
          reject2(_this.timedoutError);
          return;
        }
        var error = new Error("Aborted");
        error.code = "ABORTED";
        error.status = _this.status;
        error.method = _this.method;
        error.url = _this.url;
        reject2(error);
      });
      self2.end(function(error, res) {
        if (error)
          reject2(error);
        else
          resolve2(res);
      });
    });
  }
  return this._fullfilledPromise.then(resolve, reject);
};
RequestBase.prototype.catch = function(callback) {
  return this.then(void 0, callback);
};
RequestBase.prototype.use = function(fn) {
  fn(this);
  return this;
};
RequestBase.prototype.ok = function(callback) {
  if (typeof callback !== "function")
    throw new Error("Callback required");
  this._okCallback = callback;
  return this;
};
RequestBase.prototype._isResponseOK = function(res) {
  if (!res) {
    return false;
  }
  if (this._okCallback) {
    return this._okCallback(res);
  }
  return res.status >= 200 && res.status < 300;
};
RequestBase.prototype.get = function(field) {
  return this._header[field.toLowerCase()];
};
RequestBase.prototype.getHeader = RequestBase.prototype.get;
RequestBase.prototype.set = function(field, value) {
  if (isObject(field)) {
    for (var key in field) {
      if (hasOwn(field, key))
        this.set(key, field[key]);
    }
    return this;
  }
  this._header[field.toLowerCase()] = value;
  this.header[field] = value;
  return this;
};
RequestBase.prototype.unset = function(field) {
  delete this._header[field.toLowerCase()];
  delete this.header[field];
  return this;
};
RequestBase.prototype.field = function(name, value, options) {
  if (name === null || void 0 === name) {
    throw new Error(".field(name, val) name can not be empty");
  }
  if (this._data) {
    throw new Error(".field() can't be used if .send() is used. Please use only .send() or only .field() & .attach()");
  }
  if (isObject(name)) {
    for (var key in name) {
      if (hasOwn(name, key))
        this.field(key, name[key]);
    }
    return this;
  }
  if (Array.isArray(value)) {
    for (var i in value) {
      if (hasOwn(value, i))
        this.field(name, value[i]);
    }
    return this;
  }
  if (value === null || void 0 === value) {
    throw new Error(".field(name, val) val can not be empty");
  }
  if (typeof value === "boolean") {
    value = String(value);
  }
  if (options)
    this._getFormData().append(name, value, options);
  else
    this._getFormData().append(name, value);
  return this;
};
RequestBase.prototype.abort = function() {
  if (this._aborted) {
    return this;
  }
  this._aborted = true;
  if (this.xhr)
    this.xhr.abort();
  if (this.req) {
    if (semver.gte(process.version, "v13.0.0") && semver.lt(process.version, "v14.0.0")) {
      throw new Error("Superagent does not work in v13 properly with abort() due to Node.js core changes");
    } else if (semver.gte(process.version, "v14.0.0")) {
      this.req.destroyed = true;
    }
    this.req.abort();
  }
  this.clearTimeout();
  this.emit("abort");
  return this;
};
RequestBase.prototype._auth = function(user, pass, options, base64Encoder) {
  switch (options.type) {
    case "basic":
      this.set("Authorization", "Basic ".concat(base64Encoder("".concat(user, ":").concat(pass))));
      break;
    case "auto":
      this.username = user;
      this.password = pass;
      break;
    case "bearer":
      this.set("Authorization", "Bearer ".concat(user));
      break;
  }
  return this;
};
RequestBase.prototype.withCredentials = function(on) {
  if (on === void 0)
    on = true;
  this._withCredentials = on;
  return this;
};
RequestBase.prototype.redirects = function(n) {
  this._maxRedirects = n;
  return this;
};
RequestBase.prototype.maxResponseSize = function(n) {
  if (typeof n !== "number") {
    throw new TypeError("Invalid argument");
  }
  this._maxResponseSize = n;
  return this;
};
RequestBase.prototype.toJSON = function() {
  return {
    method: this.method,
    url: this.url,
    data: this._data,
    headers: this._header
  };
};
RequestBase.prototype.send = function(data) {
  var isObject_ = isObject(data);
  var type = this._header["content-type"];
  if (this._formData) {
    throw new Error(".send() can't be used if .attach() or .field() is used. Please use only .send() or only .field() & .attach()");
  }
  if (isObject_ && !this._data) {
    if (Array.isArray(data)) {
      this._data = [];
    } else if (!this._isHost(data)) {
      this._data = {};
    }
  } else if (data && this._data && this._isHost(this._data)) {
    throw new Error("Can't merge these send calls");
  }
  if (isObject_ && isObject(this._data)) {
    for (var key in data) {
      if (hasOwn(data, key))
        this._data[key] = data[key];
    }
  } else if (typeof data === "string") {
    if (!type)
      this.type("form");
    type = this._header["content-type"];
    if (type)
      type = type.toLowerCase().trim();
    if (type === "application/x-www-form-urlencoded") {
      this._data = this._data ? "".concat(this._data, "&").concat(data) : data;
    } else {
      this._data = (this._data || "") + data;
    }
  } else {
    this._data = data;
  }
  if (!isObject_ || this._isHost(data)) {
    return this;
  }
  if (!type)
    this.type("json");
  return this;
};
RequestBase.prototype.sortQuery = function(sort) {
  this._sort = typeof sort === "undefined" ? true : sort;
  return this;
};
RequestBase.prototype._finalizeQueryString = function() {
  var query = this._query.join("&");
  if (query) {
    this.url += (this.url.includes("?") ? "&" : "?") + query;
  }
  this._query.length = 0;
  if (this._sort) {
    var index = this.url.indexOf("?");
    if (index >= 0) {
      var queryArray = this.url.slice(index + 1).split("&");
      if (typeof this._sort === "function") {
        queryArray.sort(this._sort);
      } else {
        queryArray.sort();
      }
      this.url = this.url.slice(0, index) + "?" + queryArray.join("&");
    }
  }
};
RequestBase.prototype._appendQueryString = function() {
  console.warn("Unsupported");
};
RequestBase.prototype._timeoutError = function(reason, timeout, errno) {
  if (this._aborted) {
    return;
  }
  var error = new Error("".concat(reason + timeout, "ms exceeded"));
  error.timeout = timeout;
  error.code = "ECONNABORTED";
  error.errno = errno;
  this.timedout = true;
  this.timedoutError = error;
  this.abort();
  this.callback(error);
};
RequestBase.prototype._setTimeouts = function() {
  var self2 = this;
  if (this._timeout && !this._timer) {
    this._timer = setTimeout(function() {
      self2._timeoutError("Timeout of ", self2._timeout, "ETIME");
    }, this._timeout);
  }
  if (this._responseTimeout && !this._responseTimeoutTimer) {
    this._responseTimeoutTimer = setTimeout(function() {
      self2._timeoutError("Response timeout of ", self2._responseTimeout, "ETIMEDOUT");
    }, this._responseTimeout);
  }
};
var utils = utils$1;
var responseBase = ResponseBase;
function ResponseBase() {
}
ResponseBase.prototype.get = function(field) {
  return this.header[field.toLowerCase()];
};
ResponseBase.prototype._setHeaderProperties = function(header) {
  var ct = header["content-type"] || "";
  this.type = utils.type(ct);
  var parameters = utils.params(ct);
  for (var key in parameters) {
    if (Object.prototype.hasOwnProperty.call(parameters, key))
      this[key] = parameters[key];
  }
  this.links = {};
  try {
    if (header.link) {
      this.links = utils.parseLinks(header.link);
    }
  } catch (_unused) {
  }
};
ResponseBase.prototype._setStatusProperties = function(status) {
  var type = Math.trunc(status / 100);
  this.statusCode = status;
  this.status = this.statusCode;
  this.statusType = type;
  this.info = type === 1;
  this.ok = type === 2;
  this.redirect = type === 3;
  this.clientError = type === 4;
  this.serverError = type === 5;
  this.error = type === 4 || type === 5 ? this.toError() : false;
  this.created = status === 201;
  this.accepted = status === 202;
  this.noContent = status === 204;
  this.badRequest = status === 400;
  this.unauthorized = status === 401;
  this.notAcceptable = status === 406;
  this.forbidden = status === 403;
  this.notFound = status === 404;
  this.unprocessableEntity = status === 422;
};
function _toConsumableArray(arr2) {
  return _arrayWithoutHoles(arr2) || _iterableToArray(arr2) || _unsupportedIterableToArray(arr2) || _nonIterableSpread();
}
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null)
    return Array.from(iter);
}
function _arrayWithoutHoles(arr2) {
  if (Array.isArray(arr2))
    return _arrayLikeToArray(arr2);
}
function _createForOfIteratorHelper(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
  if (!it) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it)
        o = it;
      var i = 0;
      var F = function F2() {
      };
      return { s: F, n: function n() {
        if (i >= o.length)
          return { done: true };
        return { done: false, value: o[i++] };
      }, e: function e(_e) {
        throw _e;
      }, f: F };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  var normalCompletion = true, didErr = false, err;
  return { s: function s() {
    it = it.call(o);
  }, n: function n() {
    var step = it.next();
    normalCompletion = step.done;
    return step;
  }, e: function e(_e2) {
    didErr = true;
    err = _e2;
  }, f: function f() {
    try {
      if (!normalCompletion && it.return != null)
        it.return();
    } finally {
      if (didErr)
        throw err;
    }
  } };
}
function _unsupportedIterableToArray(o, minLen) {
  if (!o)
    return;
  if (typeof o === "string")
    return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor)
    n = o.constructor.name;
  if (n === "Map" || n === "Set")
    return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr2, len) {
  if (len == null || len > arr2.length)
    len = arr2.length;
  for (var i = 0, arr22 = new Array(len); i < len; i++) {
    arr22[i] = arr2[i];
  }
  return arr22;
}
function Agent() {
  this._defaults = [];
}
var _loop = function _loop2() {
  var fn = _arr[_i];
  Agent.prototype[fn] = function() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    this._defaults.push({
      fn,
      args
    });
    return this;
  };
};
for (var _i = 0, _arr = ["use", "on", "once", "set", "query", "type", "accept", "auth", "withCredentials", "sortQuery", "retry", "ok", "redirects", "timeout", "buffer", "serialize", "parse", "ca", "key", "pfx", "cert", "disableTLSCerts"]; _i < _arr.length; _i++) {
  _loop();
}
Agent.prototype._setDefaults = function(request2) {
  var _iterator = _createForOfIteratorHelper(this._defaults), _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done; ) {
      var def = _step.value;
      request2[def.fn].apply(request2, _toConsumableArray(def.args));
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
};
var agentBase = Agent;
(function(module2, exports) {
  function _typeof2(obj) {
    "@babel/helpers - typeof";
    return _typeof2 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj2) {
      return typeof obj2;
    } : function(obj2) {
      return obj2 && "function" == typeof Symbol && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
    }, _typeof2(obj);
  }
  function _createForOfIteratorHelper2(o, allowArrayLike) {
    var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
    if (!it) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray2(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it)
          o = it;
        var i = 0;
        var F = function F2() {
        };
        return { s: F, n: function n() {
          if (i >= o.length)
            return { done: true };
          return { done: false, value: o[i++] };
        }, e: function e(_e) {
          throw _e;
        }, f: F };
      }
      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    var normalCompletion = true, didErr = false, err;
    return { s: function s() {
      it = it.call(o);
    }, n: function n() {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    }, e: function e(_e2) {
      didErr = true;
      err = _e2;
    }, f: function f() {
      try {
        if (!normalCompletion && it.return != null)
          it.return();
      } finally {
        if (didErr)
          throw err;
      }
    } };
  }
  function _unsupportedIterableToArray2(o, minLen) {
    if (!o)
      return;
    if (typeof o === "string")
      return _arrayLikeToArray2(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor)
      n = o.constructor.name;
    if (n === "Map" || n === "Set")
      return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
      return _arrayLikeToArray2(o, minLen);
  }
  function _arrayLikeToArray2(arr2, len) {
    if (len == null || len > arr2.length)
      len = arr2.length;
    for (var i = 0, arr22 = new Array(len); i < len; i++) {
      arr22[i] = arr2[i];
    }
    return arr22;
  }
  var root;
  if (typeof window !== "undefined") {
    root = window;
  } else if (typeof self === "undefined") {
    console.warn("Using browser-only version of superagent in non-browser environment");
    root = void 0;
  } else {
    root = self;
  }
  var Emitter = componentEmitter.exports;
  var safeStringify = fastSafeStringify;
  var qs = lib;
  var RequestBase2 = requestBase;
  var _require2 = utils$1, isObject2 = _require2.isObject, mixin = _require2.mixin, hasOwn2 = _require2.hasOwn;
  var ResponseBase2 = responseBase;
  var Agent2 = agentBase;
  function noop() {
  }
  module2.exports = function(method, url) {
    if (typeof url === "function") {
      return new exports.Request("GET", method).end(url);
    }
    if (arguments.length === 1) {
      return new exports.Request("GET", method);
    }
    return new exports.Request(method, url);
  };
  exports = module2.exports;
  var request2 = exports;
  exports.Request = Request;
  request2.getXHR = function() {
    if (root.XMLHttpRequest && (!root.location || root.location.protocol !== "file:")) {
      return new XMLHttpRequest();
    }
    throw new Error("Browser-only version of superagent could not find XHR");
  };
  var trim = "".trim ? function(s) {
    return s.trim();
  } : function(s) {
    return s.replace(/(^\s*|\s*$)/g, "");
  };
  function serialize(object) {
    if (!isObject2(object))
      return object;
    var pairs = [];
    for (var key in object) {
      if (hasOwn2(object, key))
        pushEncodedKeyValuePair(pairs, key, object[key]);
    }
    return pairs.join("&");
  }
  function pushEncodedKeyValuePair(pairs, key, value) {
    if (value === void 0)
      return;
    if (value === null) {
      pairs.push(encodeURI(key));
      return;
    }
    if (Array.isArray(value)) {
      var _iterator = _createForOfIteratorHelper2(value), _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done; ) {
          var v = _step.value;
          pushEncodedKeyValuePair(pairs, key, v);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    } else if (isObject2(value)) {
      for (var subkey in value) {
        if (hasOwn2(value, subkey))
          pushEncodedKeyValuePair(pairs, "".concat(key, "[").concat(subkey, "]"), value[subkey]);
      }
    } else {
      pairs.push(encodeURI(key) + "=" + encodeURIComponent(value));
    }
  }
  request2.serializeObject = serialize;
  function parseString(string_) {
    var object = {};
    var pairs = string_.split("&");
    var pair;
    var pos;
    for (var i = 0, length_ = pairs.length; i < length_; ++i) {
      pair = pairs[i];
      pos = pair.indexOf("=");
      if (pos === -1) {
        object[decodeURIComponent(pair)] = "";
      } else {
        object[decodeURIComponent(pair.slice(0, pos))] = decodeURIComponent(pair.slice(pos + 1));
      }
    }
    return object;
  }
  request2.parseString = parseString;
  request2.types = {
    html: "text/html",
    json: "application/json",
    xml: "text/xml",
    urlencoded: "application/x-www-form-urlencoded",
    form: "application/x-www-form-urlencoded",
    "form-data": "application/x-www-form-urlencoded"
  };
  request2.serialize = {
    "application/x-www-form-urlencoded": qs.stringify,
    "application/json": safeStringify
  };
  request2.parse = {
    "application/x-www-form-urlencoded": parseString,
    "application/json": JSON.parse
  };
  function parseHeader(string_) {
    var lines = string_.split(/\r?\n/);
    var fields = {};
    var index;
    var line;
    var field;
    var value;
    for (var i = 0, length_ = lines.length; i < length_; ++i) {
      line = lines[i];
      index = line.indexOf(":");
      if (index === -1) {
        continue;
      }
      field = line.slice(0, index).toLowerCase();
      value = trim(line.slice(index + 1));
      fields[field] = value;
    }
    return fields;
  }
  function isJSON(mime) {
    return /[/+]json($|[^-\w])/i.test(mime);
  }
  function Response(request_) {
    this.req = request_;
    this.xhr = this.req.xhr;
    this.text = this.req.method !== "HEAD" && (this.xhr.responseType === "" || this.xhr.responseType === "text") || typeof this.xhr.responseType === "undefined" ? this.xhr.responseText : null;
    this.statusText = this.req.xhr.statusText;
    var status = this.xhr.status;
    if (status === 1223) {
      status = 204;
    }
    this._setStatusProperties(status);
    this.headers = parseHeader(this.xhr.getAllResponseHeaders());
    this.header = this.headers;
    this.header["content-type"] = this.xhr.getResponseHeader("content-type");
    this._setHeaderProperties(this.header);
    if (this.text === null && request_._responseType) {
      this.body = this.xhr.response;
    } else {
      this.body = this.req.method === "HEAD" ? null : this._parseBody(this.text ? this.text : this.xhr.response);
    }
  }
  mixin(Response.prototype, ResponseBase2.prototype);
  Response.prototype._parseBody = function(string_) {
    var parse2 = request2.parse[this.type];
    if (this.req._parser) {
      return this.req._parser(this, string_);
    }
    if (!parse2 && isJSON(this.type)) {
      parse2 = request2.parse["application/json"];
    }
    return parse2 && string_ && (string_.length > 0 || string_ instanceof Object) ? parse2(string_) : null;
  };
  Response.prototype.toError = function() {
    var req = this.req;
    var method = req.method;
    var url = req.url;
    var message = "cannot ".concat(method, " ").concat(url, " (").concat(this.status, ")");
    var error = new Error(message);
    error.status = this.status;
    error.method = method;
    error.url = url;
    return error;
  };
  request2.Response = Response;
  function Request(method, url) {
    var self2 = this;
    this._query = this._query || [];
    this.method = method;
    this.url = url;
    this.header = {};
    this._header = {};
    this.on("end", function() {
      var error = null;
      var res = null;
      try {
        res = new Response(self2);
      } catch (err) {
        error = new Error("Parser is unable to parse the response");
        error.parse = true;
        error.original = err;
        if (self2.xhr) {
          error.rawResponse = typeof self2.xhr.responseType === "undefined" ? self2.xhr.responseText : self2.xhr.response;
          error.status = self2.xhr.status ? self2.xhr.status : null;
          error.statusCode = error.status;
        } else {
          error.rawResponse = null;
          error.status = null;
        }
        return self2.callback(error);
      }
      self2.emit("response", res);
      var new_error;
      try {
        if (!self2._isResponseOK(res)) {
          new_error = new Error(res.statusText || res.text || "Unsuccessful HTTP response");
        }
      } catch (err) {
        new_error = err;
      }
      if (new_error) {
        new_error.original = error;
        new_error.response = res;
        new_error.status = new_error.status || res.status;
        self2.callback(new_error, res);
      } else {
        self2.callback(null, res);
      }
    });
  }
  Emitter(Request.prototype);
  mixin(Request.prototype, RequestBase2.prototype);
  Request.prototype.type = function(type) {
    this.set("Content-Type", request2.types[type] || type);
    return this;
  };
  Request.prototype.accept = function(type) {
    this.set("Accept", request2.types[type] || type);
    return this;
  };
  Request.prototype.auth = function(user, pass, options) {
    if (arguments.length === 1)
      pass = "";
    if (_typeof2(pass) === "object" && pass !== null) {
      options = pass;
      pass = "";
    }
    if (!options) {
      options = {
        type: typeof btoa === "function" ? "basic" : "auto"
      };
    }
    var encoder = options.encoder ? options.encoder : function(string) {
      if (typeof btoa === "function") {
        return btoa(string);
      }
      throw new Error("Cannot use basic auth, btoa is not a function");
    };
    return this._auth(user, pass, options, encoder);
  };
  Request.prototype.query = function(value) {
    if (typeof value !== "string")
      value = serialize(value);
    if (value)
      this._query.push(value);
    return this;
  };
  Request.prototype.attach = function(field, file, options) {
    if (file) {
      if (this._data) {
        throw new Error("superagent can't mix .send() and .attach()");
      }
      this._getFormData().append(field, file, options || file.name);
    }
    return this;
  };
  Request.prototype._getFormData = function() {
    if (!this._formData) {
      this._formData = new root.FormData();
    }
    return this._formData;
  };
  Request.prototype.callback = function(error, res) {
    if (this._shouldRetry(error, res)) {
      return this._retry();
    }
    var fn = this._callback;
    this.clearTimeout();
    if (error) {
      if (this._maxRetries)
        error.retries = this._retries - 1;
      this.emit("error", error);
    }
    fn(error, res);
  };
  Request.prototype.crossDomainError = function() {
    var error = new Error("Request has been terminated\nPossible causes: the network is offline, Origin is not allowed by Access-Control-Allow-Origin, the page is being unloaded, etc.");
    error.crossDomain = true;
    error.status = this.status;
    error.method = this.method;
    error.url = this.url;
    this.callback(error);
  };
  Request.prototype.agent = function() {
    console.warn("This is not supported in browser version of superagent");
    return this;
  };
  Request.prototype.ca = Request.prototype.agent;
  Request.prototype.buffer = Request.prototype.ca;
  Request.prototype.write = function() {
    throw new Error("Streaming is not supported in browser version of superagent");
  };
  Request.prototype.pipe = Request.prototype.write;
  Request.prototype._isHost = function(object) {
    return object && _typeof2(object) === "object" && !Array.isArray(object) && Object.prototype.toString.call(object) !== "[object Object]";
  };
  Request.prototype.end = function(fn) {
    if (this._endCalled) {
      console.warn("Warning: .end() was called twice. This is not supported in superagent");
    }
    this._endCalled = true;
    this._callback = fn || noop;
    this._finalizeQueryString();
    this._end();
  };
  Request.prototype._setUploadTimeout = function() {
    var self2 = this;
    if (this._uploadTimeout && !this._uploadTimeoutTimer) {
      this._uploadTimeoutTimer = setTimeout(function() {
        self2._timeoutError("Upload timeout of ", self2._uploadTimeout, "ETIMEDOUT");
      }, this._uploadTimeout);
    }
  };
  Request.prototype._end = function() {
    if (this._aborted)
      return this.callback(new Error("The request has been aborted even before .end() was called"));
    var self2 = this;
    this.xhr = request2.getXHR();
    var xhr = this.xhr;
    var data = this._formData || this._data;
    this._setTimeouts();
    xhr.addEventListener("readystatechange", function() {
      var readyState = xhr.readyState;
      if (readyState >= 2 && self2._responseTimeoutTimer) {
        clearTimeout(self2._responseTimeoutTimer);
      }
      if (readyState !== 4) {
        return;
      }
      var status;
      try {
        status = xhr.status;
      } catch (_unused) {
        status = 0;
      }
      if (!status) {
        if (self2.timedout || self2._aborted)
          return;
        return self2.crossDomainError();
      }
      self2.emit("end");
    });
    var handleProgress = function handleProgress2(direction, e) {
      if (e.total > 0) {
        e.percent = e.loaded / e.total * 100;
        if (e.percent === 100) {
          clearTimeout(self2._uploadTimeoutTimer);
        }
      }
      e.direction = direction;
      self2.emit("progress", e);
    };
    if (this.hasListeners("progress")) {
      try {
        xhr.addEventListener("progress", handleProgress.bind(null, "download"));
        if (xhr.upload) {
          xhr.upload.addEventListener("progress", handleProgress.bind(null, "upload"));
        }
      } catch (_unused2) {
      }
    }
    if (xhr.upload) {
      this._setUploadTimeout();
    }
    try {
      if (this.username && this.password) {
        xhr.open(this.method, this.url, true, this.username, this.password);
      } else {
        xhr.open(this.method, this.url, true);
      }
    } catch (err) {
      return this.callback(err);
    }
    if (this._withCredentials)
      xhr.withCredentials = true;
    if (!this._formData && this.method !== "GET" && this.method !== "HEAD" && typeof data !== "string" && !this._isHost(data)) {
      var contentType = this._header["content-type"];
      var _serialize = this._serializer || request2.serialize[contentType ? contentType.split(";")[0] : ""];
      if (!_serialize && isJSON(contentType)) {
        _serialize = request2.serialize["application/json"];
      }
      if (_serialize)
        data = _serialize(data);
    }
    for (var field in this.header) {
      if (this.header[field] === null)
        continue;
      if (hasOwn2(this.header, field))
        xhr.setRequestHeader(field, this.header[field]);
    }
    if (this._responseType) {
      xhr.responseType = this._responseType;
    }
    this.emit("request", this);
    xhr.send(typeof data === "undefined" ? null : data);
  };
  request2.agent = function() {
    return new Agent2();
  };
  var _loop3 = function _loop4() {
    var method = _arr[_i];
    Agent2.prototype[method.toLowerCase()] = function(url, fn) {
      var request_ = new request2.Request(method, url);
      this._setDefaults(request_);
      if (fn) {
        request_.end(fn);
      }
      return request_;
    };
  };
  for (var _i = 0, _arr = ["GET", "POST", "OPTIONS", "PATCH", "PUT", "DELETE"]; _i < _arr.length; _i++) {
    _loop3();
  }
  Agent2.prototype.del = Agent2.prototype.delete;
  request2.get = function(url, data, fn) {
    var request_ = request2("GET", url);
    if (typeof data === "function") {
      fn = data;
      data = null;
    }
    if (data)
      request_.query(data);
    if (fn)
      request_.end(fn);
    return request_;
  };
  request2.head = function(url, data, fn) {
    var request_ = request2("HEAD", url);
    if (typeof data === "function") {
      fn = data;
      data = null;
    }
    if (data)
      request_.query(data);
    if (fn)
      request_.end(fn);
    return request_;
  };
  request2.options = function(url, data, fn) {
    var request_ = request2("OPTIONS", url);
    if (typeof data === "function") {
      fn = data;
      data = null;
    }
    if (data)
      request_.send(data);
    if (fn)
      request_.end(fn);
    return request_;
  };
  function del(url, data, fn) {
    var request_ = request2("DELETE", url);
    if (typeof data === "function") {
      fn = data;
      data = null;
    }
    if (data)
      request_.send(data);
    if (fn)
      request_.end(fn);
    return request_;
  }
  request2.del = del;
  request2.delete = del;
  request2.patch = function(url, data, fn) {
    var request_ = request2("PATCH", url);
    if (typeof data === "function") {
      fn = data;
      data = null;
    }
    if (data)
      request_.send(data);
    if (fn)
      request_.end(fn);
    return request_;
  };
  request2.post = function(url, data, fn) {
    var request_ = request2("POST", url);
    if (typeof data === "function") {
      fn = data;
      data = null;
    }
    if (data)
      request_.send(data);
    if (fn)
      request_.end(fn);
    return request_;
  };
  request2.put = function(url, data, fn) {
    var request_ = request2("PUT", url);
    if (typeof data === "function") {
      fn = data;
      data = null;
    }
    if (data)
      request_.send(data);
    if (fn)
      request_.end(fn);
    return request_;
  };
})(client, client.exports);
const request = client.exports;
var bluebird = { exports: {} };
/* @preserve
 * The MIT License (MIT)
 * 
 * Copyright (c) 2013-2018 Petka Antonov
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * 
 */
(function(module2, exports) {
  !function(e) {
    module2.exports = e();
  }(function() {
    return function e(t, n, r) {
      function s(o2, u) {
        if (!n[o2]) {
          if (!t[o2]) {
            var a = typeof _dereq_ == "function" && _dereq_;
            if (!u && a)
              return a(o2, true);
            if (i)
              return i(o2, true);
            var f = new Error("Cannot find module '" + o2 + "'");
            throw f.code = "MODULE_NOT_FOUND", f;
          }
          var l = n[o2] = { exports: {} };
          t[o2][0].call(l.exports, function(e2) {
            var n2 = t[o2][1][e2];
            return s(n2 ? n2 : e2);
          }, l, l.exports, e, t, n, r);
        }
        return n[o2].exports;
      }
      var i = typeof _dereq_ == "function" && _dereq_;
      for (var o = 0; o < r.length; o++)
        s(r[o]);
      return s;
    }({ 1: [function(_dereq_2, module3, exports2) {
      module3.exports = function(Promise2) {
        var SomePromiseArray = Promise2._SomePromiseArray;
        function any(promises) {
          var ret = new SomePromiseArray(promises);
          var promise = ret.promise();
          ret.setHowMany(1);
          ret.setUnwrap();
          ret.init();
          return promise;
        }
        Promise2.any = function(promises) {
          return any(promises);
        };
        Promise2.prototype.any = function() {
          return any(this);
        };
      };
    }, {}], 2: [function(_dereq_2, module3, exports2) {
      var firstLineError;
      try {
        throw new Error();
      } catch (e) {
        firstLineError = e;
      }
      var schedule = _dereq_2("./schedule");
      var Queue = _dereq_2("./queue");
      function Async() {
        this._customScheduler = false;
        this._isTickUsed = false;
        this._lateQueue = new Queue(16);
        this._normalQueue = new Queue(16);
        this._haveDrainedQueues = false;
        var self2 = this;
        this.drainQueues = function() {
          self2._drainQueues();
        };
        this._schedule = schedule;
      }
      Async.prototype.setScheduler = function(fn) {
        var prev = this._schedule;
        this._schedule = fn;
        this._customScheduler = true;
        return prev;
      };
      Async.prototype.hasCustomScheduler = function() {
        return this._customScheduler;
      };
      Async.prototype.haveItemsQueued = function() {
        return this._isTickUsed || this._haveDrainedQueues;
      };
      Async.prototype.fatalError = function(e, isNode) {
        if (isNode) {
          process.stderr.write("Fatal " + (e instanceof Error ? e.stack : e) + "\n");
          process.exit(2);
        } else {
          this.throwLater(e);
        }
      };
      Async.prototype.throwLater = function(fn, arg) {
        if (arguments.length === 1) {
          arg = fn;
          fn = function() {
            throw arg;
          };
        }
        if (typeof setTimeout !== "undefined") {
          setTimeout(function() {
            fn(arg);
          }, 0);
        } else
          try {
            this._schedule(function() {
              fn(arg);
            });
          } catch (e) {
            throw new Error("No async scheduler available\n\n    See http://goo.gl/MqrFmX\n");
          }
      };
      function AsyncInvokeLater(fn, receiver, arg) {
        this._lateQueue.push(fn, receiver, arg);
        this._queueTick();
      }
      function AsyncInvoke(fn, receiver, arg) {
        this._normalQueue.push(fn, receiver, arg);
        this._queueTick();
      }
      function AsyncSettlePromises(promise) {
        this._normalQueue._pushOne(promise);
        this._queueTick();
      }
      Async.prototype.invokeLater = AsyncInvokeLater;
      Async.prototype.invoke = AsyncInvoke;
      Async.prototype.settlePromises = AsyncSettlePromises;
      function _drainQueue(queue) {
        while (queue.length() > 0) {
          _drainQueueStep(queue);
        }
      }
      function _drainQueueStep(queue) {
        var fn = queue.shift();
        if (typeof fn !== "function") {
          fn._settlePromises();
        } else {
          var receiver = queue.shift();
          var arg = queue.shift();
          fn.call(receiver, arg);
        }
      }
      Async.prototype._drainQueues = function() {
        _drainQueue(this._normalQueue);
        this._reset();
        this._haveDrainedQueues = true;
        _drainQueue(this._lateQueue);
      };
      Async.prototype._queueTick = function() {
        if (!this._isTickUsed) {
          this._isTickUsed = true;
          this._schedule(this.drainQueues);
        }
      };
      Async.prototype._reset = function() {
        this._isTickUsed = false;
      };
      module3.exports = Async;
      module3.exports.firstLineError = firstLineError;
    }, { "./queue": 26, "./schedule": 29 }], 3: [function(_dereq_2, module3, exports2) {
      module3.exports = function(Promise2, INTERNAL, tryConvertToPromise, debug) {
        var calledBind = false;
        var rejectThis = function(_, e) {
          this._reject(e);
        };
        var targetRejected = function(e, context) {
          context.promiseRejectionQueued = true;
          context.bindingPromise._then(rejectThis, rejectThis, null, this, e);
        };
        var bindingResolved = function(thisArg, context) {
          if ((this._bitField & 50397184) === 0) {
            this._resolveCallback(context.target);
          }
        };
        var bindingRejected = function(e, context) {
          if (!context.promiseRejectionQueued)
            this._reject(e);
        };
        Promise2.prototype.bind = function(thisArg) {
          if (!calledBind) {
            calledBind = true;
            Promise2.prototype._propagateFrom = debug.propagateFromFunction();
            Promise2.prototype._boundValue = debug.boundValueFunction();
          }
          var maybePromise = tryConvertToPromise(thisArg);
          var ret = new Promise2(INTERNAL);
          ret._propagateFrom(this, 1);
          var target = this._target();
          ret._setBoundTo(maybePromise);
          if (maybePromise instanceof Promise2) {
            var context = {
              promiseRejectionQueued: false,
              promise: ret,
              target,
              bindingPromise: maybePromise
            };
            target._then(INTERNAL, targetRejected, void 0, ret, context);
            maybePromise._then(
              bindingResolved,
              bindingRejected,
              void 0,
              ret,
              context
            );
            ret._setOnCancel(maybePromise);
          } else {
            ret._resolveCallback(target);
          }
          return ret;
        };
        Promise2.prototype._setBoundTo = function(obj) {
          if (obj !== void 0) {
            this._bitField = this._bitField | 2097152;
            this._boundTo = obj;
          } else {
            this._bitField = this._bitField & ~2097152;
          }
        };
        Promise2.prototype._isBound = function() {
          return (this._bitField & 2097152) === 2097152;
        };
        Promise2.bind = function(thisArg, value) {
          return Promise2.resolve(value).bind(thisArg);
        };
      };
    }, {}], 4: [function(_dereq_2, module3, exports2) {
      var old;
      if (typeof Promise !== "undefined")
        old = Promise;
      function noConflict() {
        try {
          if (Promise === bluebird2)
            Promise = old;
        } catch (e) {
        }
        return bluebird2;
      }
      var bluebird2 = _dereq_2("./promise")();
      bluebird2.noConflict = noConflict;
      module3.exports = bluebird2;
    }, { "./promise": 22 }], 5: [function(_dereq_2, module3, exports2) {
      var cr = Object.create;
      if (cr) {
        var callerCache = cr(null);
        var getterCache = cr(null);
        callerCache[" size"] = getterCache[" size"] = 0;
      }
      module3.exports = function(Promise2) {
        var util = _dereq_2("./util");
        var canEvaluate = util.canEvaluate;
        util.isIdentifier;
        var getGetter;
        function ensureMethod(obj, methodName) {
          var fn;
          if (obj != null)
            fn = obj[methodName];
          if (typeof fn !== "function") {
            var message = "Object " + util.classString(obj) + " has no method '" + util.toString(methodName) + "'";
            throw new Promise2.TypeError(message);
          }
          return fn;
        }
        function caller(obj) {
          var methodName = this.pop();
          var fn = ensureMethod(obj, methodName);
          return fn.apply(obj, this);
        }
        Promise2.prototype.call = function(methodName) {
          var args = [].slice.call(arguments, 1);
          args.push(methodName);
          return this._then(caller, void 0, void 0, args, void 0);
        };
        function namedGetter(obj) {
          return obj[this];
        }
        function indexedGetter(obj) {
          var index = +this;
          if (index < 0)
            index = Math.max(0, index + obj.length);
          return obj[index];
        }
        Promise2.prototype.get = function(propertyName) {
          var isIndex = typeof propertyName === "number";
          var getter;
          if (!isIndex) {
            if (canEvaluate) {
              var maybeGetter = getGetter(propertyName);
              getter = maybeGetter !== null ? maybeGetter : namedGetter;
            } else {
              getter = namedGetter;
            }
          } else {
            getter = indexedGetter;
          }
          return this._then(getter, void 0, void 0, propertyName, void 0);
        };
      };
    }, { "./util": 36 }], 6: [function(_dereq_2, module3, exports2) {
      module3.exports = function(Promise2, PromiseArray, apiRejection, debug) {
        var util = _dereq_2("./util");
        var tryCatch = util.tryCatch;
        var errorObj = util.errorObj;
        var async = Promise2._async;
        Promise2.prototype["break"] = Promise2.prototype.cancel = function() {
          if (!debug.cancellation())
            return this._warn("cancellation is disabled");
          var promise = this;
          var child = promise;
          while (promise._isCancellable()) {
            if (!promise._cancelBy(child)) {
              if (child._isFollowing()) {
                child._followee().cancel();
              } else {
                child._cancelBranched();
              }
              break;
            }
            var parent = promise._cancellationParent;
            if (parent == null || !parent._isCancellable()) {
              if (promise._isFollowing()) {
                promise._followee().cancel();
              } else {
                promise._cancelBranched();
              }
              break;
            } else {
              if (promise._isFollowing())
                promise._followee().cancel();
              promise._setWillBeCancelled();
              child = promise;
              promise = parent;
            }
          }
        };
        Promise2.prototype._branchHasCancelled = function() {
          this._branchesRemainingToCancel--;
        };
        Promise2.prototype._enoughBranchesHaveCancelled = function() {
          return this._branchesRemainingToCancel === void 0 || this._branchesRemainingToCancel <= 0;
        };
        Promise2.prototype._cancelBy = function(canceller) {
          if (canceller === this) {
            this._branchesRemainingToCancel = 0;
            this._invokeOnCancel();
            return true;
          } else {
            this._branchHasCancelled();
            if (this._enoughBranchesHaveCancelled()) {
              this._invokeOnCancel();
              return true;
            }
          }
          return false;
        };
        Promise2.prototype._cancelBranched = function() {
          if (this._enoughBranchesHaveCancelled()) {
            this._cancel();
          }
        };
        Promise2.prototype._cancel = function() {
          if (!this._isCancellable())
            return;
          this._setCancelled();
          async.invoke(this._cancelPromises, this, void 0);
        };
        Promise2.prototype._cancelPromises = function() {
          if (this._length() > 0)
            this._settlePromises();
        };
        Promise2.prototype._unsetOnCancel = function() {
          this._onCancelField = void 0;
        };
        Promise2.prototype._isCancellable = function() {
          return this.isPending() && !this._isCancelled();
        };
        Promise2.prototype.isCancellable = function() {
          return this.isPending() && !this.isCancelled();
        };
        Promise2.prototype._doInvokeOnCancel = function(onCancelCallback, internalOnly) {
          if (util.isArray(onCancelCallback)) {
            for (var i = 0; i < onCancelCallback.length; ++i) {
              this._doInvokeOnCancel(onCancelCallback[i], internalOnly);
            }
          } else if (onCancelCallback !== void 0) {
            if (typeof onCancelCallback === "function") {
              if (!internalOnly) {
                var e = tryCatch(onCancelCallback).call(this._boundValue());
                if (e === errorObj) {
                  this._attachExtraTrace(e.e);
                  async.throwLater(e.e);
                }
              }
            } else {
              onCancelCallback._resultCancelled(this);
            }
          }
        };
        Promise2.prototype._invokeOnCancel = function() {
          var onCancelCallback = this._onCancel();
          this._unsetOnCancel();
          async.invoke(this._doInvokeOnCancel, this, onCancelCallback);
        };
        Promise2.prototype._invokeInternalOnCancel = function() {
          if (this._isCancellable()) {
            this._doInvokeOnCancel(this._onCancel(), true);
            this._unsetOnCancel();
          }
        };
        Promise2.prototype._resultCancelled = function() {
          this.cancel();
        };
      };
    }, { "./util": 36 }], 7: [function(_dereq_2, module3, exports2) {
      module3.exports = function(NEXT_FILTER) {
        var util = _dereq_2("./util");
        var getKeys = _dereq_2("./es5").keys;
        var tryCatch = util.tryCatch;
        var errorObj = util.errorObj;
        function catchFilter(instances, cb, promise) {
          return function(e) {
            var boundTo = promise._boundValue();
            predicateLoop:
              for (var i = 0; i < instances.length; ++i) {
                var item = instances[i];
                if (item === Error || item != null && item.prototype instanceof Error) {
                  if (e instanceof item) {
                    return tryCatch(cb).call(boundTo, e);
                  }
                } else if (typeof item === "function") {
                  var matchesPredicate = tryCatch(item).call(boundTo, e);
                  if (matchesPredicate === errorObj) {
                    return matchesPredicate;
                  } else if (matchesPredicate) {
                    return tryCatch(cb).call(boundTo, e);
                  }
                } else if (util.isObject(e)) {
                  var keys = getKeys(item);
                  for (var j = 0; j < keys.length; ++j) {
                    var key = keys[j];
                    if (item[key] != e[key]) {
                      continue predicateLoop;
                    }
                  }
                  return tryCatch(cb).call(boundTo, e);
                }
              }
            return NEXT_FILTER;
          };
        }
        return catchFilter;
      };
    }, { "./es5": 13, "./util": 36 }], 8: [function(_dereq_2, module3, exports2) {
      module3.exports = function(Promise2) {
        var longStackTraces = false;
        var contextStack = [];
        Promise2.prototype._promiseCreated = function() {
        };
        Promise2.prototype._pushContext = function() {
        };
        Promise2.prototype._popContext = function() {
          return null;
        };
        Promise2._peekContext = Promise2.prototype._peekContext = function() {
        };
        function Context() {
          this._trace = new Context.CapturedTrace(peekContext());
        }
        Context.prototype._pushContext = function() {
          if (this._trace !== void 0) {
            this._trace._promiseCreated = null;
            contextStack.push(this._trace);
          }
        };
        Context.prototype._popContext = function() {
          if (this._trace !== void 0) {
            var trace = contextStack.pop();
            var ret = trace._promiseCreated;
            trace._promiseCreated = null;
            return ret;
          }
          return null;
        };
        function createContext() {
          if (longStackTraces)
            return new Context();
        }
        function peekContext() {
          var lastIndex = contextStack.length - 1;
          if (lastIndex >= 0) {
            return contextStack[lastIndex];
          }
          return void 0;
        }
        Context.CapturedTrace = null;
        Context.create = createContext;
        Context.deactivateLongStackTraces = function() {
        };
        Context.activateLongStackTraces = function() {
          var Promise_pushContext = Promise2.prototype._pushContext;
          var Promise_popContext = Promise2.prototype._popContext;
          var Promise_PeekContext = Promise2._peekContext;
          var Promise_peekContext = Promise2.prototype._peekContext;
          var Promise_promiseCreated = Promise2.prototype._promiseCreated;
          Context.deactivateLongStackTraces = function() {
            Promise2.prototype._pushContext = Promise_pushContext;
            Promise2.prototype._popContext = Promise_popContext;
            Promise2._peekContext = Promise_PeekContext;
            Promise2.prototype._peekContext = Promise_peekContext;
            Promise2.prototype._promiseCreated = Promise_promiseCreated;
            longStackTraces = false;
          };
          longStackTraces = true;
          Promise2.prototype._pushContext = Context.prototype._pushContext;
          Promise2.prototype._popContext = Context.prototype._popContext;
          Promise2._peekContext = Promise2.prototype._peekContext = peekContext;
          Promise2.prototype._promiseCreated = function() {
            var ctx = this._peekContext();
            if (ctx && ctx._promiseCreated == null)
              ctx._promiseCreated = this;
          };
        };
        return Context;
      };
    }, {}], 9: [function(_dereq_2, module3, exports2) {
      module3.exports = function(Promise2, Context, enableAsyncHooks, disableAsyncHooks) {
        var async = Promise2._async;
        var Warning = _dereq_2("./errors").Warning;
        var util = _dereq_2("./util");
        var es5 = _dereq_2("./es5");
        var canAttachTrace = util.canAttachTrace;
        var unhandledRejectionHandled;
        var possiblyUnhandledRejection;
        var bluebirdFramePattern = /[\\\/]bluebird[\\\/]js[\\\/](release|debug|instrumented)/;
        var nodeFramePattern = /\((?:timers\.js):\d+:\d+\)/;
        var parseLinePattern = /[\/<\(](.+?):(\d+):(\d+)\)?\s*$/;
        var stackFramePattern = null;
        var formatStack = null;
        var indentStackFrames = false;
        var printWarning;
        var debugging = !!(util.env("BLUEBIRD_DEBUG") != 0 && true);
        var warnings = !!(util.env("BLUEBIRD_WARNINGS") != 0 && (debugging || util.env("BLUEBIRD_WARNINGS")));
        var longStackTraces = !!(util.env("BLUEBIRD_LONG_STACK_TRACES") != 0 && (debugging || util.env("BLUEBIRD_LONG_STACK_TRACES")));
        var wForgottenReturn = util.env("BLUEBIRD_W_FORGOTTEN_RETURN") != 0 && (warnings || !!util.env("BLUEBIRD_W_FORGOTTEN_RETURN"));
        var deferUnhandledRejectionCheck;
        (function() {
          var promises = [];
          function unhandledRejectionCheck() {
            for (var i = 0; i < promises.length; ++i) {
              promises[i]._notifyUnhandledRejection();
            }
            unhandledRejectionClear();
          }
          function unhandledRejectionClear() {
            promises.length = 0;
          }
          deferUnhandledRejectionCheck = function(promise) {
            promises.push(promise);
            setTimeout(unhandledRejectionCheck, 1);
          };
          es5.defineProperty(Promise2, "_unhandledRejectionCheck", {
            value: unhandledRejectionCheck
          });
          es5.defineProperty(Promise2, "_unhandledRejectionClear", {
            value: unhandledRejectionClear
          });
        })();
        Promise2.prototype.suppressUnhandledRejections = function() {
          var target = this._target();
          target._bitField = target._bitField & ~1048576 | 524288;
        };
        Promise2.prototype._ensurePossibleRejectionHandled = function() {
          if ((this._bitField & 524288) !== 0)
            return;
          this._setRejectionIsUnhandled();
          deferUnhandledRejectionCheck(this);
        };
        Promise2.prototype._notifyUnhandledRejectionIsHandled = function() {
          fireRejectionEvent(
            "rejectionHandled",
            unhandledRejectionHandled,
            void 0,
            this
          );
        };
        Promise2.prototype._setReturnedNonUndefined = function() {
          this._bitField = this._bitField | 268435456;
        };
        Promise2.prototype._returnedNonUndefined = function() {
          return (this._bitField & 268435456) !== 0;
        };
        Promise2.prototype._notifyUnhandledRejection = function() {
          if (this._isRejectionUnhandled()) {
            var reason = this._settledValue();
            this._setUnhandledRejectionIsNotified();
            fireRejectionEvent(
              "unhandledRejection",
              possiblyUnhandledRejection,
              reason,
              this
            );
          }
        };
        Promise2.prototype._setUnhandledRejectionIsNotified = function() {
          this._bitField = this._bitField | 262144;
        };
        Promise2.prototype._unsetUnhandledRejectionIsNotified = function() {
          this._bitField = this._bitField & ~262144;
        };
        Promise2.prototype._isUnhandledRejectionNotified = function() {
          return (this._bitField & 262144) > 0;
        };
        Promise2.prototype._setRejectionIsUnhandled = function() {
          this._bitField = this._bitField | 1048576;
        };
        Promise2.prototype._unsetRejectionIsUnhandled = function() {
          this._bitField = this._bitField & ~1048576;
          if (this._isUnhandledRejectionNotified()) {
            this._unsetUnhandledRejectionIsNotified();
            this._notifyUnhandledRejectionIsHandled();
          }
        };
        Promise2.prototype._isRejectionUnhandled = function() {
          return (this._bitField & 1048576) > 0;
        };
        Promise2.prototype._warn = function(message, shouldUseOwnTrace, promise) {
          return warn(message, shouldUseOwnTrace, promise || this);
        };
        Promise2.onPossiblyUnhandledRejection = function(fn) {
          var context = Promise2._getContext();
          possiblyUnhandledRejection = util.contextBind(context, fn);
        };
        Promise2.onUnhandledRejectionHandled = function(fn) {
          var context = Promise2._getContext();
          unhandledRejectionHandled = util.contextBind(context, fn);
        };
        var disableLongStackTraces = function() {
        };
        Promise2.longStackTraces = function() {
          if (async.haveItemsQueued() && !config.longStackTraces) {
            throw new Error("cannot enable long stack traces after promises have been created\n\n    See http://goo.gl/MqrFmX\n");
          }
          if (!config.longStackTraces && longStackTracesIsSupported()) {
            var Promise_captureStackTrace = Promise2.prototype._captureStackTrace;
            var Promise_attachExtraTrace = Promise2.prototype._attachExtraTrace;
            var Promise_dereferenceTrace = Promise2.prototype._dereferenceTrace;
            config.longStackTraces = true;
            disableLongStackTraces = function() {
              if (async.haveItemsQueued() && !config.longStackTraces) {
                throw new Error("cannot enable long stack traces after promises have been created\n\n    See http://goo.gl/MqrFmX\n");
              }
              Promise2.prototype._captureStackTrace = Promise_captureStackTrace;
              Promise2.prototype._attachExtraTrace = Promise_attachExtraTrace;
              Promise2.prototype._dereferenceTrace = Promise_dereferenceTrace;
              Context.deactivateLongStackTraces();
              config.longStackTraces = false;
            };
            Promise2.prototype._captureStackTrace = longStackTracesCaptureStackTrace;
            Promise2.prototype._attachExtraTrace = longStackTracesAttachExtraTrace;
            Promise2.prototype._dereferenceTrace = longStackTracesDereferenceTrace;
            Context.activateLongStackTraces();
          }
        };
        Promise2.hasLongStackTraces = function() {
          return config.longStackTraces && longStackTracesIsSupported();
        };
        var legacyHandlers = {
          unhandledrejection: {
            before: function() {
              var ret = util.global.onunhandledrejection;
              util.global.onunhandledrejection = null;
              return ret;
            },
            after: function(fn) {
              util.global.onunhandledrejection = fn;
            }
          },
          rejectionhandled: {
            before: function() {
              var ret = util.global.onrejectionhandled;
              util.global.onrejectionhandled = null;
              return ret;
            },
            after: function(fn) {
              util.global.onrejectionhandled = fn;
            }
          }
        };
        var fireDomEvent = function() {
          var dispatch = function(legacy, e) {
            if (legacy) {
              var fn;
              try {
                fn = legacy.before();
                return !util.global.dispatchEvent(e);
              } finally {
                legacy.after(fn);
              }
            } else {
              return !util.global.dispatchEvent(e);
            }
          };
          try {
            if (typeof CustomEvent === "function") {
              var event = new CustomEvent("CustomEvent");
              util.global.dispatchEvent(event);
              return function(name, event2) {
                name = name.toLowerCase();
                var eventData = {
                  detail: event2,
                  cancelable: true
                };
                var domEvent = new CustomEvent(name, eventData);
                es5.defineProperty(
                  domEvent,
                  "promise",
                  { value: event2.promise }
                );
                es5.defineProperty(
                  domEvent,
                  "reason",
                  { value: event2.reason }
                );
                return dispatch(legacyHandlers[name], domEvent);
              };
            } else if (typeof Event === "function") {
              var event = new Event("CustomEvent");
              util.global.dispatchEvent(event);
              return function(name, event2) {
                name = name.toLowerCase();
                var domEvent = new Event(name, {
                  cancelable: true
                });
                domEvent.detail = event2;
                es5.defineProperty(domEvent, "promise", { value: event2.promise });
                es5.defineProperty(domEvent, "reason", { value: event2.reason });
                return dispatch(legacyHandlers[name], domEvent);
              };
            } else {
              var event = document.createEvent("CustomEvent");
              event.initCustomEvent("testingtheevent", false, true, {});
              util.global.dispatchEvent(event);
              return function(name, event2) {
                name = name.toLowerCase();
                var domEvent = document.createEvent("CustomEvent");
                domEvent.initCustomEvent(
                  name,
                  false,
                  true,
                  event2
                );
                return dispatch(legacyHandlers[name], domEvent);
              };
            }
          } catch (e) {
          }
          return function() {
            return false;
          };
        }();
        var fireGlobalEvent = function() {
          if (util.isNode) {
            return function() {
              return process.emit.apply(process, arguments);
            };
          } else {
            if (!util.global) {
              return function() {
                return false;
              };
            }
            return function(name) {
              var methodName = "on" + name.toLowerCase();
              var method = util.global[methodName];
              if (!method)
                return false;
              method.apply(util.global, [].slice.call(arguments, 1));
              return true;
            };
          }
        }();
        function generatePromiseLifecycleEventObject(name, promise) {
          return { promise };
        }
        var eventToObjectGenerator = {
          promiseCreated: generatePromiseLifecycleEventObject,
          promiseFulfilled: generatePromiseLifecycleEventObject,
          promiseRejected: generatePromiseLifecycleEventObject,
          promiseResolved: generatePromiseLifecycleEventObject,
          promiseCancelled: generatePromiseLifecycleEventObject,
          promiseChained: function(name, promise, child) {
            return { promise, child };
          },
          warning: function(name, warning) {
            return { warning };
          },
          unhandledRejection: function(name, reason, promise) {
            return { reason, promise };
          },
          rejectionHandled: generatePromiseLifecycleEventObject
        };
        var activeFireEvent = function(name) {
          var globalEventFired = false;
          try {
            globalEventFired = fireGlobalEvent.apply(null, arguments);
          } catch (e) {
            async.throwLater(e);
            globalEventFired = true;
          }
          var domEventFired = false;
          try {
            domEventFired = fireDomEvent(
              name,
              eventToObjectGenerator[name].apply(null, arguments)
            );
          } catch (e) {
            async.throwLater(e);
            domEventFired = true;
          }
          return domEventFired || globalEventFired;
        };
        Promise2.config = function(opts) {
          opts = Object(opts);
          if ("longStackTraces" in opts) {
            if (opts.longStackTraces) {
              Promise2.longStackTraces();
            } else if (!opts.longStackTraces && Promise2.hasLongStackTraces()) {
              disableLongStackTraces();
            }
          }
          if ("warnings" in opts) {
            var warningsOption = opts.warnings;
            config.warnings = !!warningsOption;
            wForgottenReturn = config.warnings;
            if (util.isObject(warningsOption)) {
              if ("wForgottenReturn" in warningsOption) {
                wForgottenReturn = !!warningsOption.wForgottenReturn;
              }
            }
          }
          if ("cancellation" in opts && opts.cancellation && !config.cancellation) {
            if (async.haveItemsQueued()) {
              throw new Error(
                "cannot enable cancellation after promises are in use"
              );
            }
            Promise2.prototype._clearCancellationData = cancellationClearCancellationData;
            Promise2.prototype._propagateFrom = cancellationPropagateFrom;
            Promise2.prototype._onCancel = cancellationOnCancel;
            Promise2.prototype._setOnCancel = cancellationSetOnCancel;
            Promise2.prototype._attachCancellationCallback = cancellationAttachCancellationCallback;
            Promise2.prototype._execute = cancellationExecute;
            propagateFromFunction = cancellationPropagateFrom;
            config.cancellation = true;
          }
          if ("monitoring" in opts) {
            if (opts.monitoring && !config.monitoring) {
              config.monitoring = true;
              Promise2.prototype._fireEvent = activeFireEvent;
            } else if (!opts.monitoring && config.monitoring) {
              config.monitoring = false;
              Promise2.prototype._fireEvent = defaultFireEvent;
            }
          }
          if ("asyncHooks" in opts && util.nodeSupportsAsyncResource) {
            var prev = config.asyncHooks;
            var cur = !!opts.asyncHooks;
            if (prev !== cur) {
              config.asyncHooks = cur;
              if (cur) {
                enableAsyncHooks();
              } else {
                disableAsyncHooks();
              }
            }
          }
          return Promise2;
        };
        function defaultFireEvent() {
          return false;
        }
        Promise2.prototype._fireEvent = defaultFireEvent;
        Promise2.prototype._execute = function(executor, resolve, reject) {
          try {
            executor(resolve, reject);
          } catch (e) {
            return e;
          }
        };
        Promise2.prototype._onCancel = function() {
        };
        Promise2.prototype._setOnCancel = function(handler) {
        };
        Promise2.prototype._attachCancellationCallback = function(onCancel) {
        };
        Promise2.prototype._captureStackTrace = function() {
        };
        Promise2.prototype._attachExtraTrace = function() {
        };
        Promise2.prototype._dereferenceTrace = function() {
        };
        Promise2.prototype._clearCancellationData = function() {
        };
        Promise2.prototype._propagateFrom = function(parent, flags) {
        };
        function cancellationExecute(executor, resolve, reject) {
          var promise = this;
          try {
            executor(resolve, reject, function(onCancel) {
              if (typeof onCancel !== "function") {
                throw new TypeError("onCancel must be a function, got: " + util.toString(onCancel));
              }
              promise._attachCancellationCallback(onCancel);
            });
          } catch (e) {
            return e;
          }
        }
        function cancellationAttachCancellationCallback(onCancel) {
          if (!this._isCancellable())
            return this;
          var previousOnCancel = this._onCancel();
          if (previousOnCancel !== void 0) {
            if (util.isArray(previousOnCancel)) {
              previousOnCancel.push(onCancel);
            } else {
              this._setOnCancel([previousOnCancel, onCancel]);
            }
          } else {
            this._setOnCancel(onCancel);
          }
        }
        function cancellationOnCancel() {
          return this._onCancelField;
        }
        function cancellationSetOnCancel(onCancel) {
          this._onCancelField = onCancel;
        }
        function cancellationClearCancellationData() {
          this._cancellationParent = void 0;
          this._onCancelField = void 0;
        }
        function cancellationPropagateFrom(parent, flags) {
          if ((flags & 1) !== 0) {
            this._cancellationParent = parent;
            var branchesRemainingToCancel = parent._branchesRemainingToCancel;
            if (branchesRemainingToCancel === void 0) {
              branchesRemainingToCancel = 0;
            }
            parent._branchesRemainingToCancel = branchesRemainingToCancel + 1;
          }
          if ((flags & 2) !== 0 && parent._isBound()) {
            this._setBoundTo(parent._boundTo);
          }
        }
        function bindingPropagateFrom(parent, flags) {
          if ((flags & 2) !== 0 && parent._isBound()) {
            this._setBoundTo(parent._boundTo);
          }
        }
        var propagateFromFunction = bindingPropagateFrom;
        function boundValueFunction() {
          var ret = this._boundTo;
          if (ret !== void 0) {
            if (ret instanceof Promise2) {
              if (ret.isFulfilled()) {
                return ret.value();
              } else {
                return void 0;
              }
            }
          }
          return ret;
        }
        function longStackTracesCaptureStackTrace() {
          this._trace = new CapturedTrace(this._peekContext());
        }
        function longStackTracesAttachExtraTrace(error, ignoreSelf) {
          if (canAttachTrace(error)) {
            var trace = this._trace;
            if (trace !== void 0) {
              if (ignoreSelf)
                trace = trace._parent;
            }
            if (trace !== void 0) {
              trace.attachExtraTrace(error);
            } else if (!error.__stackCleaned__) {
              var parsed = parseStackAndMessage(error);
              util.notEnumerableProp(
                error,
                "stack",
                parsed.message + "\n" + parsed.stack.join("\n")
              );
              util.notEnumerableProp(error, "__stackCleaned__", true);
            }
          }
        }
        function longStackTracesDereferenceTrace() {
          this._trace = void 0;
        }
        function checkForgottenReturns(returnValue, promiseCreated, name, promise, parent) {
          if (returnValue === void 0 && promiseCreated !== null && wForgottenReturn) {
            if (parent !== void 0 && parent._returnedNonUndefined())
              return;
            if ((promise._bitField & 65535) === 0)
              return;
            if (name)
              name = name + " ";
            var handlerLine = "";
            var creatorLine = "";
            if (promiseCreated._trace) {
              var traceLines = promiseCreated._trace.stack.split("\n");
              var stack = cleanStack(traceLines);
              for (var i = stack.length - 1; i >= 0; --i) {
                var line = stack[i];
                if (!nodeFramePattern.test(line)) {
                  var lineMatches = line.match(parseLinePattern);
                  if (lineMatches) {
                    handlerLine = "at " + lineMatches[1] + ":" + lineMatches[2] + ":" + lineMatches[3] + " ";
                  }
                  break;
                }
              }
              if (stack.length > 0) {
                var firstUserLine = stack[0];
                for (var i = 0; i < traceLines.length; ++i) {
                  if (traceLines[i] === firstUserLine) {
                    if (i > 0) {
                      creatorLine = "\n" + traceLines[i - 1];
                    }
                    break;
                  }
                }
              }
            }
            var msg = "a promise was created in a " + name + "handler " + handlerLine + "but was not returned from it, see http://goo.gl/rRqMUw" + creatorLine;
            promise._warn(msg, true, promiseCreated);
          }
        }
        function deprecated(name, replacement) {
          var message = name + " is deprecated and will be removed in a future version.";
          if (replacement)
            message += " Use " + replacement + " instead.";
          return warn(message);
        }
        function warn(message, shouldUseOwnTrace, promise) {
          if (!config.warnings)
            return;
          var warning = new Warning(message);
          var ctx;
          if (shouldUseOwnTrace) {
            promise._attachExtraTrace(warning);
          } else if (config.longStackTraces && (ctx = Promise2._peekContext())) {
            ctx.attachExtraTrace(warning);
          } else {
            var parsed = parseStackAndMessage(warning);
            warning.stack = parsed.message + "\n" + parsed.stack.join("\n");
          }
          if (!activeFireEvent("warning", warning)) {
            formatAndLogError(warning, "", true);
          }
        }
        function reconstructStack(message, stacks) {
          for (var i = 0; i < stacks.length - 1; ++i) {
            stacks[i].push("From previous event:");
            stacks[i] = stacks[i].join("\n");
          }
          if (i < stacks.length) {
            stacks[i] = stacks[i].join("\n");
          }
          return message + "\n" + stacks.join("\n");
        }
        function removeDuplicateOrEmptyJumps(stacks) {
          for (var i = 0; i < stacks.length; ++i) {
            if (stacks[i].length === 0 || i + 1 < stacks.length && stacks[i][0] === stacks[i + 1][0]) {
              stacks.splice(i, 1);
              i--;
            }
          }
        }
        function removeCommonRoots(stacks) {
          var current = stacks[0];
          for (var i = 1; i < stacks.length; ++i) {
            var prev = stacks[i];
            var currentLastIndex = current.length - 1;
            var currentLastLine = current[currentLastIndex];
            var commonRootMeetPoint = -1;
            for (var j = prev.length - 1; j >= 0; --j) {
              if (prev[j] === currentLastLine) {
                commonRootMeetPoint = j;
                break;
              }
            }
            for (var j = commonRootMeetPoint; j >= 0; --j) {
              var line = prev[j];
              if (current[currentLastIndex] === line) {
                current.pop();
                currentLastIndex--;
              } else {
                break;
              }
            }
            current = prev;
          }
        }
        function cleanStack(stack) {
          var ret = [];
          for (var i = 0; i < stack.length; ++i) {
            var line = stack[i];
            var isTraceLine = "    (No stack trace)" === line || stackFramePattern.test(line);
            var isInternalFrame = isTraceLine && shouldIgnore(line);
            if (isTraceLine && !isInternalFrame) {
              if (indentStackFrames && line.charAt(0) !== " ") {
                line = "    " + line;
              }
              ret.push(line);
            }
          }
          return ret;
        }
        function stackFramesAsArray(error) {
          var stack = error.stack.replace(/\s+$/g, "").split("\n");
          for (var i = 0; i < stack.length; ++i) {
            var line = stack[i];
            if ("    (No stack trace)" === line || stackFramePattern.test(line)) {
              break;
            }
          }
          if (i > 0 && error.name != "SyntaxError") {
            stack = stack.slice(i);
          }
          return stack;
        }
        function parseStackAndMessage(error) {
          var stack = error.stack;
          var message = error.toString();
          stack = typeof stack === "string" && stack.length > 0 ? stackFramesAsArray(error) : ["    (No stack trace)"];
          return {
            message,
            stack: error.name == "SyntaxError" ? stack : cleanStack(stack)
          };
        }
        function formatAndLogError(error, title, isSoft) {
          if (typeof console !== "undefined") {
            var message;
            if (util.isObject(error)) {
              var stack = error.stack;
              message = title + formatStack(stack, error);
            } else {
              message = title + String(error);
            }
            if (typeof printWarning === "function") {
              printWarning(message, isSoft);
            } else if (typeof console.log === "function" || typeof console.log === "object") {
              console.log(message);
            }
          }
        }
        function fireRejectionEvent(name, localHandler, reason, promise) {
          var localEventFired = false;
          try {
            if (typeof localHandler === "function") {
              localEventFired = true;
              if (name === "rejectionHandled") {
                localHandler(promise);
              } else {
                localHandler(reason, promise);
              }
            }
          } catch (e) {
            async.throwLater(e);
          }
          if (name === "unhandledRejection") {
            if (!activeFireEvent(name, reason, promise) && !localEventFired) {
              formatAndLogError(reason, "Unhandled rejection ");
            }
          } else {
            activeFireEvent(name, promise);
          }
        }
        function formatNonError(obj) {
          var str;
          if (typeof obj === "function") {
            str = "[function " + (obj.name || "anonymous") + "]";
          } else {
            str = obj && typeof obj.toString === "function" ? obj.toString() : util.toString(obj);
            var ruselessToString = /\[object [a-zA-Z0-9$_]+\]/;
            if (ruselessToString.test(str)) {
              try {
                var newStr = JSON.stringify(obj);
                str = newStr;
              } catch (e) {
              }
            }
            if (str.length === 0) {
              str = "(empty array)";
            }
          }
          return "(<" + snip(str) + ">, no stack trace)";
        }
        function snip(str) {
          var maxChars = 41;
          if (str.length < maxChars) {
            return str;
          }
          return str.substr(0, maxChars - 3) + "...";
        }
        function longStackTracesIsSupported() {
          return typeof captureStackTrace === "function";
        }
        var shouldIgnore = function() {
          return false;
        };
        var parseLineInfoRegex = /[\/<\(]([^:\/]+):(\d+):(?:\d+)\)?\s*$/;
        function parseLineInfo(line) {
          var matches = line.match(parseLineInfoRegex);
          if (matches) {
            return {
              fileName: matches[1],
              line: parseInt(matches[2], 10)
            };
          }
        }
        function setBounds(firstLineError, lastLineError) {
          if (!longStackTracesIsSupported())
            return;
          var firstStackLines = (firstLineError.stack || "").split("\n");
          var lastStackLines = (lastLineError.stack || "").split("\n");
          var firstIndex = -1;
          var lastIndex = -1;
          var firstFileName;
          var lastFileName;
          for (var i = 0; i < firstStackLines.length; ++i) {
            var result = parseLineInfo(firstStackLines[i]);
            if (result) {
              firstFileName = result.fileName;
              firstIndex = result.line;
              break;
            }
          }
          for (var i = 0; i < lastStackLines.length; ++i) {
            var result = parseLineInfo(lastStackLines[i]);
            if (result) {
              lastFileName = result.fileName;
              lastIndex = result.line;
              break;
            }
          }
          if (firstIndex < 0 || lastIndex < 0 || !firstFileName || !lastFileName || firstFileName !== lastFileName || firstIndex >= lastIndex) {
            return;
          }
          shouldIgnore = function(line) {
            if (bluebirdFramePattern.test(line))
              return true;
            var info = parseLineInfo(line);
            if (info) {
              if (info.fileName === firstFileName && (firstIndex <= info.line && info.line <= lastIndex)) {
                return true;
              }
            }
            return false;
          };
        }
        function CapturedTrace(parent) {
          this._parent = parent;
          this._promisesCreated = 0;
          var length = this._length = 1 + (parent === void 0 ? 0 : parent._length);
          captureStackTrace(this, CapturedTrace);
          if (length > 32)
            this.uncycle();
        }
        util.inherits(CapturedTrace, Error);
        Context.CapturedTrace = CapturedTrace;
        CapturedTrace.prototype.uncycle = function() {
          var length = this._length;
          if (length < 2)
            return;
          var nodes = [];
          var stackToIndex = {};
          for (var i = 0, node = this; node !== void 0; ++i) {
            nodes.push(node);
            node = node._parent;
          }
          length = this._length = i;
          for (var i = length - 1; i >= 0; --i) {
            var stack = nodes[i].stack;
            if (stackToIndex[stack] === void 0) {
              stackToIndex[stack] = i;
            }
          }
          for (var i = 0; i < length; ++i) {
            var currentStack = nodes[i].stack;
            var index = stackToIndex[currentStack];
            if (index !== void 0 && index !== i) {
              if (index > 0) {
                nodes[index - 1]._parent = void 0;
                nodes[index - 1]._length = 1;
              }
              nodes[i]._parent = void 0;
              nodes[i]._length = 1;
              var cycleEdgeNode = i > 0 ? nodes[i - 1] : this;
              if (index < length - 1) {
                cycleEdgeNode._parent = nodes[index + 1];
                cycleEdgeNode._parent.uncycle();
                cycleEdgeNode._length = cycleEdgeNode._parent._length + 1;
              } else {
                cycleEdgeNode._parent = void 0;
                cycleEdgeNode._length = 1;
              }
              var currentChildLength = cycleEdgeNode._length + 1;
              for (var j = i - 2; j >= 0; --j) {
                nodes[j]._length = currentChildLength;
                currentChildLength++;
              }
              return;
            }
          }
        };
        CapturedTrace.prototype.attachExtraTrace = function(error) {
          if (error.__stackCleaned__)
            return;
          this.uncycle();
          var parsed = parseStackAndMessage(error);
          var message = parsed.message;
          var stacks = [parsed.stack];
          var trace = this;
          while (trace !== void 0) {
            stacks.push(cleanStack(trace.stack.split("\n")));
            trace = trace._parent;
          }
          removeCommonRoots(stacks);
          removeDuplicateOrEmptyJumps(stacks);
          util.notEnumerableProp(error, "stack", reconstructStack(message, stacks));
          util.notEnumerableProp(error, "__stackCleaned__", true);
        };
        var captureStackTrace = function stackDetection() {
          var v8stackFramePattern = /^\s*at\s*/;
          var v8stackFormatter = function(stack, error) {
            if (typeof stack === "string")
              return stack;
            if (error.name !== void 0 && error.message !== void 0) {
              return error.toString();
            }
            return formatNonError(error);
          };
          if (typeof Error.stackTraceLimit === "number" && typeof Error.captureStackTrace === "function") {
            Error.stackTraceLimit += 6;
            stackFramePattern = v8stackFramePattern;
            formatStack = v8stackFormatter;
            var captureStackTrace2 = Error.captureStackTrace;
            shouldIgnore = function(line) {
              return bluebirdFramePattern.test(line);
            };
            return function(receiver, ignoreUntil) {
              Error.stackTraceLimit += 6;
              captureStackTrace2(receiver, ignoreUntil);
              Error.stackTraceLimit -= 6;
            };
          }
          var err = new Error();
          if (typeof err.stack === "string" && err.stack.split("\n")[0].indexOf("stackDetection@") >= 0) {
            stackFramePattern = /@/;
            formatStack = v8stackFormatter;
            indentStackFrames = true;
            return function captureStackTrace3(o) {
              o.stack = new Error().stack;
            };
          }
          var hasStackAfterThrow;
          try {
            throw new Error();
          } catch (e) {
            hasStackAfterThrow = "stack" in e;
          }
          if (!("stack" in err) && hasStackAfterThrow && typeof Error.stackTraceLimit === "number") {
            stackFramePattern = v8stackFramePattern;
            formatStack = v8stackFormatter;
            return function captureStackTrace3(o) {
              Error.stackTraceLimit += 6;
              try {
                throw new Error();
              } catch (e) {
                o.stack = e.stack;
              }
              Error.stackTraceLimit -= 6;
            };
          }
          formatStack = function(stack, error) {
            if (typeof stack === "string")
              return stack;
            if ((typeof error === "object" || typeof error === "function") && error.name !== void 0 && error.message !== void 0) {
              return error.toString();
            }
            return formatNonError(error);
          };
          return null;
        }();
        if (typeof console !== "undefined" && typeof console.warn !== "undefined") {
          printWarning = function(message) {
            console.warn(message);
          };
          if (util.isNode && process.stderr.isTTY) {
            printWarning = function(message, isSoft) {
              var color = isSoft ? "\x1B[33m" : "\x1B[31m";
              console.warn(color + message + "\x1B[0m\n");
            };
          } else if (!util.isNode && typeof new Error().stack === "string") {
            printWarning = function(message, isSoft) {
              console.warn(
                "%c" + message,
                isSoft ? "color: darkorange" : "color: red"
              );
            };
          }
        }
        var config = {
          warnings,
          longStackTraces: false,
          cancellation: false,
          monitoring: false,
          asyncHooks: false
        };
        if (longStackTraces)
          Promise2.longStackTraces();
        return {
          asyncHooks: function() {
            return config.asyncHooks;
          },
          longStackTraces: function() {
            return config.longStackTraces;
          },
          warnings: function() {
            return config.warnings;
          },
          cancellation: function() {
            return config.cancellation;
          },
          monitoring: function() {
            return config.monitoring;
          },
          propagateFromFunction: function() {
            return propagateFromFunction;
          },
          boundValueFunction: function() {
            return boundValueFunction;
          },
          checkForgottenReturns,
          setBounds,
          warn,
          deprecated,
          CapturedTrace,
          fireDomEvent,
          fireGlobalEvent
        };
      };
    }, { "./errors": 12, "./es5": 13, "./util": 36 }], 10: [function(_dereq_2, module3, exports2) {
      module3.exports = function(Promise2) {
        function returner() {
          return this.value;
        }
        function thrower() {
          throw this.reason;
        }
        Promise2.prototype["return"] = Promise2.prototype.thenReturn = function(value) {
          if (value instanceof Promise2)
            value.suppressUnhandledRejections();
          return this._then(
            returner,
            void 0,
            void 0,
            { value },
            void 0
          );
        };
        Promise2.prototype["throw"] = Promise2.prototype.thenThrow = function(reason) {
          return this._then(
            thrower,
            void 0,
            void 0,
            { reason },
            void 0
          );
        };
        Promise2.prototype.catchThrow = function(reason) {
          if (arguments.length <= 1) {
            return this._then(
              void 0,
              thrower,
              void 0,
              { reason },
              void 0
            );
          } else {
            var _reason = arguments[1];
            var handler = function() {
              throw _reason;
            };
            return this.caught(reason, handler);
          }
        };
        Promise2.prototype.catchReturn = function(value) {
          if (arguments.length <= 1) {
            if (value instanceof Promise2)
              value.suppressUnhandledRejections();
            return this._then(
              void 0,
              returner,
              void 0,
              { value },
              void 0
            );
          } else {
            var _value = arguments[1];
            if (_value instanceof Promise2)
              _value.suppressUnhandledRejections();
            var handler = function() {
              return _value;
            };
            return this.caught(value, handler);
          }
        };
      };
    }, {}], 11: [function(_dereq_2, module3, exports2) {
      module3.exports = function(Promise2, INTERNAL) {
        var PromiseReduce = Promise2.reduce;
        var PromiseAll = Promise2.all;
        function promiseAllThis() {
          return PromiseAll(this);
        }
        function PromiseMapSeries(promises, fn) {
          return PromiseReduce(promises, fn, INTERNAL, INTERNAL);
        }
        Promise2.prototype.each = function(fn) {
          return PromiseReduce(this, fn, INTERNAL, 0)._then(promiseAllThis, void 0, void 0, this, void 0);
        };
        Promise2.prototype.mapSeries = function(fn) {
          return PromiseReduce(this, fn, INTERNAL, INTERNAL);
        };
        Promise2.each = function(promises, fn) {
          return PromiseReduce(promises, fn, INTERNAL, 0)._then(promiseAllThis, void 0, void 0, promises, void 0);
        };
        Promise2.mapSeries = PromiseMapSeries;
      };
    }, {}], 12: [function(_dereq_2, module3, exports2) {
      var es5 = _dereq_2("./es5");
      var Objectfreeze = es5.freeze;
      var util = _dereq_2("./util");
      var inherits = util.inherits;
      var notEnumerableProp = util.notEnumerableProp;
      function subError(nameProperty, defaultMessage) {
        function SubError(message) {
          if (!(this instanceof SubError))
            return new SubError(message);
          notEnumerableProp(
            this,
            "message",
            typeof message === "string" ? message : defaultMessage
          );
          notEnumerableProp(this, "name", nameProperty);
          if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
          } else {
            Error.call(this);
          }
        }
        inherits(SubError, Error);
        return SubError;
      }
      var _TypeError, _RangeError;
      var Warning = subError("Warning", "warning");
      var CancellationError = subError("CancellationError", "cancellation error");
      var TimeoutError = subError("TimeoutError", "timeout error");
      var AggregateError2 = subError("AggregateError", "aggregate error");
      try {
        _TypeError = TypeError;
        _RangeError = RangeError;
      } catch (e) {
        _TypeError = subError("TypeError", "type error");
        _RangeError = subError("RangeError", "range error");
      }
      var methods = "join pop push shift unshift slice filter forEach some every map indexOf lastIndexOf reduce reduceRight sort reverse".split(" ");
      for (var i = 0; i < methods.length; ++i) {
        if (typeof Array.prototype[methods[i]] === "function") {
          AggregateError2.prototype[methods[i]] = Array.prototype[methods[i]];
        }
      }
      es5.defineProperty(AggregateError2.prototype, "length", {
        value: 0,
        configurable: false,
        writable: true,
        enumerable: true
      });
      AggregateError2.prototype["isOperational"] = true;
      var level = 0;
      AggregateError2.prototype.toString = function() {
        var indent = Array(level * 4 + 1).join(" ");
        var ret = "\n" + indent + "AggregateError of:\n";
        level++;
        indent = Array(level * 4 + 1).join(" ");
        for (var i2 = 0; i2 < this.length; ++i2) {
          var str = this[i2] === this ? "[Circular AggregateError]" : this[i2] + "";
          var lines = str.split("\n");
          for (var j = 0; j < lines.length; ++j) {
            lines[j] = indent + lines[j];
          }
          str = lines.join("\n");
          ret += str + "\n";
        }
        level--;
        return ret;
      };
      function OperationalError(message) {
        if (!(this instanceof OperationalError))
          return new OperationalError(message);
        notEnumerableProp(this, "name", "OperationalError");
        notEnumerableProp(this, "message", message);
        this.cause = message;
        this["isOperational"] = true;
        if (message instanceof Error) {
          notEnumerableProp(this, "message", message.message);
          notEnumerableProp(this, "stack", message.stack);
        } else if (Error.captureStackTrace) {
          Error.captureStackTrace(this, this.constructor);
        }
      }
      inherits(OperationalError, Error);
      var errorTypes = Error["__BluebirdErrorTypes__"];
      if (!errorTypes) {
        errorTypes = Objectfreeze({
          CancellationError,
          TimeoutError,
          OperationalError,
          RejectionError: OperationalError,
          AggregateError: AggregateError2
        });
        es5.defineProperty(Error, "__BluebirdErrorTypes__", {
          value: errorTypes,
          writable: false,
          enumerable: false,
          configurable: false
        });
      }
      module3.exports = {
        Error,
        TypeError: _TypeError,
        RangeError: _RangeError,
        CancellationError: errorTypes.CancellationError,
        OperationalError: errorTypes.OperationalError,
        TimeoutError: errorTypes.TimeoutError,
        AggregateError: errorTypes.AggregateError,
        Warning
      };
    }, { "./es5": 13, "./util": 36 }], 13: [function(_dereq_2, module3, exports2) {
      var isES5 = function() {
        return this === void 0;
      }();
      if (isES5) {
        module3.exports = {
          freeze: Object.freeze,
          defineProperty: Object.defineProperty,
          getDescriptor: Object.getOwnPropertyDescriptor,
          keys: Object.keys,
          names: Object.getOwnPropertyNames,
          getPrototypeOf: Object.getPrototypeOf,
          isArray: Array.isArray,
          isES5,
          propertyIsWritable: function(obj, prop) {
            var descriptor = Object.getOwnPropertyDescriptor(obj, prop);
            return !!(!descriptor || descriptor.writable || descriptor.set);
          }
        };
      } else {
        var has2 = {}.hasOwnProperty;
        var str = {}.toString;
        var proto = {}.constructor.prototype;
        var ObjectKeys = function(o) {
          var ret = [];
          for (var key in o) {
            if (has2.call(o, key)) {
              ret.push(key);
            }
          }
          return ret;
        };
        var ObjectGetDescriptor = function(o, key) {
          return { value: o[key] };
        };
        var ObjectDefineProperty = function(o, key, desc) {
          o[key] = desc.value;
          return o;
        };
        var ObjectFreeze = function(obj) {
          return obj;
        };
        var ObjectGetPrototypeOf = function(obj) {
          try {
            return Object(obj).constructor.prototype;
          } catch (e) {
            return proto;
          }
        };
        var ArrayIsArray = function(obj) {
          try {
            return str.call(obj) === "[object Array]";
          } catch (e) {
            return false;
          }
        };
        module3.exports = {
          isArray: ArrayIsArray,
          keys: ObjectKeys,
          names: ObjectKeys,
          defineProperty: ObjectDefineProperty,
          getDescriptor: ObjectGetDescriptor,
          freeze: ObjectFreeze,
          getPrototypeOf: ObjectGetPrototypeOf,
          isES5,
          propertyIsWritable: function() {
            return true;
          }
        };
      }
    }, {}], 14: [function(_dereq_2, module3, exports2) {
      module3.exports = function(Promise2, INTERNAL) {
        var PromiseMap = Promise2.map;
        Promise2.prototype.filter = function(fn, options) {
          return PromiseMap(this, fn, options, INTERNAL);
        };
        Promise2.filter = function(promises, fn, options) {
          return PromiseMap(promises, fn, options, INTERNAL);
        };
      };
    }, {}], 15: [function(_dereq_2, module3, exports2) {
      module3.exports = function(Promise2, tryConvertToPromise, NEXT_FILTER) {
        var util = _dereq_2("./util");
        var CancellationError = Promise2.CancellationError;
        var errorObj = util.errorObj;
        var catchFilter = _dereq_2("./catch_filter")(NEXT_FILTER);
        function PassThroughHandlerContext(promise, type, handler) {
          this.promise = promise;
          this.type = type;
          this.handler = handler;
          this.called = false;
          this.cancelPromise = null;
        }
        PassThroughHandlerContext.prototype.isFinallyHandler = function() {
          return this.type === 0;
        };
        function FinallyHandlerCancelReaction(finallyHandler2) {
          this.finallyHandler = finallyHandler2;
        }
        FinallyHandlerCancelReaction.prototype._resultCancelled = function() {
          checkCancel(this.finallyHandler);
        };
        function checkCancel(ctx, reason) {
          if (ctx.cancelPromise != null) {
            if (arguments.length > 1) {
              ctx.cancelPromise._reject(reason);
            } else {
              ctx.cancelPromise._cancel();
            }
            ctx.cancelPromise = null;
            return true;
          }
          return false;
        }
        function succeed() {
          return finallyHandler.call(this, this.promise._target()._settledValue());
        }
        function fail(reason) {
          if (checkCancel(this, reason))
            return;
          errorObj.e = reason;
          return errorObj;
        }
        function finallyHandler(reasonOrValue) {
          var promise = this.promise;
          var handler = this.handler;
          if (!this.called) {
            this.called = true;
            var ret = this.isFinallyHandler() ? handler.call(promise._boundValue()) : handler.call(promise._boundValue(), reasonOrValue);
            if (ret === NEXT_FILTER) {
              return ret;
            } else if (ret !== void 0) {
              promise._setReturnedNonUndefined();
              var maybePromise = tryConvertToPromise(ret, promise);
              if (maybePromise instanceof Promise2) {
                if (this.cancelPromise != null) {
                  if (maybePromise._isCancelled()) {
                    var reason = new CancellationError("late cancellation observer");
                    promise._attachExtraTrace(reason);
                    errorObj.e = reason;
                    return errorObj;
                  } else if (maybePromise.isPending()) {
                    maybePromise._attachCancellationCallback(
                      new FinallyHandlerCancelReaction(this)
                    );
                  }
                }
                return maybePromise._then(
                  succeed,
                  fail,
                  void 0,
                  this,
                  void 0
                );
              }
            }
          }
          if (promise.isRejected()) {
            checkCancel(this);
            errorObj.e = reasonOrValue;
            return errorObj;
          } else {
            checkCancel(this);
            return reasonOrValue;
          }
        }
        Promise2.prototype._passThrough = function(handler, type, success, fail2) {
          if (typeof handler !== "function")
            return this.then();
          return this._then(
            success,
            fail2,
            void 0,
            new PassThroughHandlerContext(this, type, handler),
            void 0
          );
        };
        Promise2.prototype.lastly = Promise2.prototype["finally"] = function(handler) {
          return this._passThrough(
            handler,
            0,
            finallyHandler,
            finallyHandler
          );
        };
        Promise2.prototype.tap = function(handler) {
          return this._passThrough(handler, 1, finallyHandler);
        };
        Promise2.prototype.tapCatch = function(handlerOrPredicate) {
          var len = arguments.length;
          if (len === 1) {
            return this._passThrough(
              handlerOrPredicate,
              1,
              void 0,
              finallyHandler
            );
          } else {
            var catchInstances = new Array(len - 1), j = 0, i;
            for (i = 0; i < len - 1; ++i) {
              var item = arguments[i];
              if (util.isObject(item)) {
                catchInstances[j++] = item;
              } else {
                return Promise2.reject(new TypeError(
                  "tapCatch statement predicate: expecting an object but got " + util.classString(item)
                ));
              }
            }
            catchInstances.length = j;
            var handler = arguments[i];
            return this._passThrough(
              catchFilter(catchInstances, handler, this),
              1,
              void 0,
              finallyHandler
            );
          }
        };
        return PassThroughHandlerContext;
      };
    }, { "./catch_filter": 7, "./util": 36 }], 16: [function(_dereq_2, module3, exports2) {
      module3.exports = function(Promise2, apiRejection, INTERNAL, tryConvertToPromise, Proxyable, debug) {
        var errors = _dereq_2("./errors");
        var TypeError2 = errors.TypeError;
        var util = _dereq_2("./util");
        var errorObj = util.errorObj;
        var tryCatch = util.tryCatch;
        var yieldHandlers = [];
        function promiseFromYieldHandler(value, yieldHandlers2, traceParent) {
          for (var i = 0; i < yieldHandlers2.length; ++i) {
            traceParent._pushContext();
            var result = tryCatch(yieldHandlers2[i])(value);
            traceParent._popContext();
            if (result === errorObj) {
              traceParent._pushContext();
              var ret = Promise2.reject(errorObj.e);
              traceParent._popContext();
              return ret;
            }
            var maybePromise = tryConvertToPromise(result, traceParent);
            if (maybePromise instanceof Promise2)
              return maybePromise;
          }
          return null;
        }
        function PromiseSpawn(generatorFunction, receiver, yieldHandler, stack) {
          if (debug.cancellation()) {
            var internal = new Promise2(INTERNAL);
            var _finallyPromise = this._finallyPromise = new Promise2(INTERNAL);
            this._promise = internal.lastly(function() {
              return _finallyPromise;
            });
            internal._captureStackTrace();
            internal._setOnCancel(this);
          } else {
            var promise = this._promise = new Promise2(INTERNAL);
            promise._captureStackTrace();
          }
          this._stack = stack;
          this._generatorFunction = generatorFunction;
          this._receiver = receiver;
          this._generator = void 0;
          this._yieldHandlers = typeof yieldHandler === "function" ? [yieldHandler].concat(yieldHandlers) : yieldHandlers;
          this._yieldedPromise = null;
          this._cancellationPhase = false;
        }
        util.inherits(PromiseSpawn, Proxyable);
        PromiseSpawn.prototype._isResolved = function() {
          return this._promise === null;
        };
        PromiseSpawn.prototype._cleanup = function() {
          this._promise = this._generator = null;
          if (debug.cancellation() && this._finallyPromise !== null) {
            this._finallyPromise._fulfill();
            this._finallyPromise = null;
          }
        };
        PromiseSpawn.prototype._promiseCancelled = function() {
          if (this._isResolved())
            return;
          var implementsReturn = typeof this._generator["return"] !== "undefined";
          var result;
          if (!implementsReturn) {
            var reason = new Promise2.CancellationError(
              "generator .return() sentinel"
            );
            Promise2.coroutine.returnSentinel = reason;
            this._promise._attachExtraTrace(reason);
            this._promise._pushContext();
            result = tryCatch(this._generator["throw"]).call(
              this._generator,
              reason
            );
            this._promise._popContext();
          } else {
            this._promise._pushContext();
            result = tryCatch(this._generator["return"]).call(
              this._generator,
              void 0
            );
            this._promise._popContext();
          }
          this._cancellationPhase = true;
          this._yieldedPromise = null;
          this._continue(result);
        };
        PromiseSpawn.prototype._promiseFulfilled = function(value) {
          this._yieldedPromise = null;
          this._promise._pushContext();
          var result = tryCatch(this._generator.next).call(this._generator, value);
          this._promise._popContext();
          this._continue(result);
        };
        PromiseSpawn.prototype._promiseRejected = function(reason) {
          this._yieldedPromise = null;
          this._promise._attachExtraTrace(reason);
          this._promise._pushContext();
          var result = tryCatch(this._generator["throw"]).call(this._generator, reason);
          this._promise._popContext();
          this._continue(result);
        };
        PromiseSpawn.prototype._resultCancelled = function() {
          if (this._yieldedPromise instanceof Promise2) {
            var promise = this._yieldedPromise;
            this._yieldedPromise = null;
            promise.cancel();
          }
        };
        PromiseSpawn.prototype.promise = function() {
          return this._promise;
        };
        PromiseSpawn.prototype._run = function() {
          this._generator = this._generatorFunction.call(this._receiver);
          this._receiver = this._generatorFunction = void 0;
          this._promiseFulfilled(void 0);
        };
        PromiseSpawn.prototype._continue = function(result) {
          var promise = this._promise;
          if (result === errorObj) {
            this._cleanup();
            if (this._cancellationPhase) {
              return promise.cancel();
            } else {
              return promise._rejectCallback(result.e, false);
            }
          }
          var value = result.value;
          if (result.done === true) {
            this._cleanup();
            if (this._cancellationPhase) {
              return promise.cancel();
            } else {
              return promise._resolveCallback(value);
            }
          } else {
            var maybePromise = tryConvertToPromise(value, this._promise);
            if (!(maybePromise instanceof Promise2)) {
              maybePromise = promiseFromYieldHandler(
                maybePromise,
                this._yieldHandlers,
                this._promise
              );
              if (maybePromise === null) {
                this._promiseRejected(
                  new TypeError2(
                    "A value %s was yielded that could not be treated as a promise\n\n    See http://goo.gl/MqrFmX\n\n".replace("%s", String(value)) + "From coroutine:\n" + this._stack.split("\n").slice(1, -7).join("\n")
                  )
                );
                return;
              }
            }
            maybePromise = maybePromise._target();
            var bitField = maybePromise._bitField;
            if ((bitField & 50397184) === 0) {
              this._yieldedPromise = maybePromise;
              maybePromise._proxy(this, null);
            } else if ((bitField & 33554432) !== 0) {
              Promise2._async.invoke(
                this._promiseFulfilled,
                this,
                maybePromise._value()
              );
            } else if ((bitField & 16777216) !== 0) {
              Promise2._async.invoke(
                this._promiseRejected,
                this,
                maybePromise._reason()
              );
            } else {
              this._promiseCancelled();
            }
          }
        };
        Promise2.coroutine = function(generatorFunction, options) {
          if (typeof generatorFunction !== "function") {
            throw new TypeError2("generatorFunction must be a function\n\n    See http://goo.gl/MqrFmX\n");
          }
          var yieldHandler = Object(options).yieldHandler;
          var PromiseSpawn$ = PromiseSpawn;
          var stack = new Error().stack;
          return function() {
            var generator = generatorFunction.apply(this, arguments);
            var spawn = new PromiseSpawn$(
              void 0,
              void 0,
              yieldHandler,
              stack
            );
            var ret = spawn.promise();
            spawn._generator = generator;
            spawn._promiseFulfilled(void 0);
            return ret;
          };
        };
        Promise2.coroutine.addYieldHandler = function(fn) {
          if (typeof fn !== "function") {
            throw new TypeError2("expecting a function but got " + util.classString(fn));
          }
          yieldHandlers.push(fn);
        };
        Promise2.spawn = function(generatorFunction) {
          debug.deprecated("Promise.spawn()", "Promise.coroutine()");
          if (typeof generatorFunction !== "function") {
            return apiRejection("generatorFunction must be a function\n\n    See http://goo.gl/MqrFmX\n");
          }
          var spawn = new PromiseSpawn(generatorFunction, this);
          var ret = spawn.promise();
          spawn._run(Promise2.spawn);
          return ret;
        };
      };
    }, { "./errors": 12, "./util": 36 }], 17: [function(_dereq_2, module3, exports2) {
      module3.exports = function(Promise2, PromiseArray, tryConvertToPromise, INTERNAL, async) {
        var util = _dereq_2("./util");
        util.canEvaluate;
        util.tryCatch;
        util.errorObj;
        Promise2.join = function() {
          var last = arguments.length - 1;
          var fn;
          if (last > 0 && typeof arguments[last] === "function") {
            fn = arguments[last];
            var ret;
          }
          var args = [].slice.call(arguments);
          if (fn)
            args.pop();
          var ret = new PromiseArray(args).promise();
          return fn !== void 0 ? ret.spread(fn) : ret;
        };
      };
    }, { "./util": 36 }], 18: [function(_dereq_2, module3, exports2) {
      module3.exports = function(Promise2, PromiseArray, apiRejection, tryConvertToPromise, INTERNAL, debug) {
        var util = _dereq_2("./util");
        var tryCatch = util.tryCatch;
        var errorObj = util.errorObj;
        var async = Promise2._async;
        function MappingPromiseArray(promises, fn, limit, _filter) {
          this.constructor$(promises);
          this._promise._captureStackTrace();
          var context = Promise2._getContext();
          this._callback = util.contextBind(context, fn);
          this._preservedValues = _filter === INTERNAL ? new Array(this.length()) : null;
          this._limit = limit;
          this._inFlight = 0;
          this._queue = [];
          async.invoke(this._asyncInit, this, void 0);
          if (util.isArray(promises)) {
            for (var i = 0; i < promises.length; ++i) {
              var maybePromise = promises[i];
              if (maybePromise instanceof Promise2) {
                maybePromise.suppressUnhandledRejections();
              }
            }
          }
        }
        util.inherits(MappingPromiseArray, PromiseArray);
        MappingPromiseArray.prototype._asyncInit = function() {
          this._init$(void 0, -2);
        };
        MappingPromiseArray.prototype._init = function() {
        };
        MappingPromiseArray.prototype._promiseFulfilled = function(value, index) {
          var values = this._values;
          var length = this.length();
          var preservedValues = this._preservedValues;
          var limit = this._limit;
          if (index < 0) {
            index = index * -1 - 1;
            values[index] = value;
            if (limit >= 1) {
              this._inFlight--;
              this._drainQueue();
              if (this._isResolved())
                return true;
            }
          } else {
            if (limit >= 1 && this._inFlight >= limit) {
              values[index] = value;
              this._queue.push(index);
              return false;
            }
            if (preservedValues !== null)
              preservedValues[index] = value;
            var promise = this._promise;
            var callback = this._callback;
            var receiver = promise._boundValue();
            promise._pushContext();
            var ret = tryCatch(callback).call(receiver, value, index, length);
            var promiseCreated = promise._popContext();
            debug.checkForgottenReturns(
              ret,
              promiseCreated,
              preservedValues !== null ? "Promise.filter" : "Promise.map",
              promise
            );
            if (ret === errorObj) {
              this._reject(ret.e);
              return true;
            }
            var maybePromise = tryConvertToPromise(ret, this._promise);
            if (maybePromise instanceof Promise2) {
              maybePromise = maybePromise._target();
              var bitField = maybePromise._bitField;
              if ((bitField & 50397184) === 0) {
                if (limit >= 1)
                  this._inFlight++;
                values[index] = maybePromise;
                maybePromise._proxy(this, (index + 1) * -1);
                return false;
              } else if ((bitField & 33554432) !== 0) {
                ret = maybePromise._value();
              } else if ((bitField & 16777216) !== 0) {
                this._reject(maybePromise._reason());
                return true;
              } else {
                this._cancel();
                return true;
              }
            }
            values[index] = ret;
          }
          var totalResolved = ++this._totalResolved;
          if (totalResolved >= length) {
            if (preservedValues !== null) {
              this._filter(values, preservedValues);
            } else {
              this._resolve(values);
            }
            return true;
          }
          return false;
        };
        MappingPromiseArray.prototype._drainQueue = function() {
          var queue = this._queue;
          var limit = this._limit;
          var values = this._values;
          while (queue.length > 0 && this._inFlight < limit) {
            if (this._isResolved())
              return;
            var index = queue.pop();
            this._promiseFulfilled(values[index], index);
          }
        };
        MappingPromiseArray.prototype._filter = function(booleans, values) {
          var len = values.length;
          var ret = new Array(len);
          var j = 0;
          for (var i = 0; i < len; ++i) {
            if (booleans[i])
              ret[j++] = values[i];
          }
          ret.length = j;
          this._resolve(ret);
        };
        MappingPromiseArray.prototype.preservedValues = function() {
          return this._preservedValues;
        };
        function map(promises, fn, options, _filter) {
          if (typeof fn !== "function") {
            return apiRejection("expecting a function but got " + util.classString(fn));
          }
          var limit = 0;
          if (options !== void 0) {
            if (typeof options === "object" && options !== null) {
              if (typeof options.concurrency !== "number") {
                return Promise2.reject(
                  new TypeError("'concurrency' must be a number but it is " + util.classString(options.concurrency))
                );
              }
              limit = options.concurrency;
            } else {
              return Promise2.reject(new TypeError(
                "options argument must be an object but it is " + util.classString(options)
              ));
            }
          }
          limit = typeof limit === "number" && isFinite(limit) && limit >= 1 ? limit : 0;
          return new MappingPromiseArray(promises, fn, limit, _filter).promise();
        }
        Promise2.prototype.map = function(fn, options) {
          return map(this, fn, options, null);
        };
        Promise2.map = function(promises, fn, options, _filter) {
          return map(promises, fn, options, _filter);
        };
      };
    }, { "./util": 36 }], 19: [function(_dereq_2, module3, exports2) {
      module3.exports = function(Promise2, INTERNAL, tryConvertToPromise, apiRejection, debug) {
        var util = _dereq_2("./util");
        var tryCatch = util.tryCatch;
        Promise2.method = function(fn) {
          if (typeof fn !== "function") {
            throw new Promise2.TypeError("expecting a function but got " + util.classString(fn));
          }
          return function() {
            var ret = new Promise2(INTERNAL);
            ret._captureStackTrace();
            ret._pushContext();
            var value = tryCatch(fn).apply(this, arguments);
            var promiseCreated = ret._popContext();
            debug.checkForgottenReturns(
              value,
              promiseCreated,
              "Promise.method",
              ret
            );
            ret._resolveFromSyncValue(value);
            return ret;
          };
        };
        Promise2.attempt = Promise2["try"] = function(fn) {
          if (typeof fn !== "function") {
            return apiRejection("expecting a function but got " + util.classString(fn));
          }
          var ret = new Promise2(INTERNAL);
          ret._captureStackTrace();
          ret._pushContext();
          var value;
          if (arguments.length > 1) {
            debug.deprecated("calling Promise.try with more than 1 argument");
            var arg = arguments[1];
            var ctx = arguments[2];
            value = util.isArray(arg) ? tryCatch(fn).apply(ctx, arg) : tryCatch(fn).call(ctx, arg);
          } else {
            value = tryCatch(fn)();
          }
          var promiseCreated = ret._popContext();
          debug.checkForgottenReturns(
            value,
            promiseCreated,
            "Promise.try",
            ret
          );
          ret._resolveFromSyncValue(value);
          return ret;
        };
        Promise2.prototype._resolveFromSyncValue = function(value) {
          if (value === util.errorObj) {
            this._rejectCallback(value.e, false);
          } else {
            this._resolveCallback(value, true);
          }
        };
      };
    }, { "./util": 36 }], 20: [function(_dereq_2, module3, exports2) {
      var util = _dereq_2("./util");
      var maybeWrapAsError = util.maybeWrapAsError;
      var errors = _dereq_2("./errors");
      var OperationalError = errors.OperationalError;
      var es5 = _dereq_2("./es5");
      function isUntypedError(obj) {
        return obj instanceof Error && es5.getPrototypeOf(obj) === Error.prototype;
      }
      var rErrorKey = /^(?:name|message|stack|cause)$/;
      function wrapAsOperationalError(obj) {
        var ret;
        if (isUntypedError(obj)) {
          ret = new OperationalError(obj);
          ret.name = obj.name;
          ret.message = obj.message;
          ret.stack = obj.stack;
          var keys = es5.keys(obj);
          for (var i = 0; i < keys.length; ++i) {
            var key = keys[i];
            if (!rErrorKey.test(key)) {
              ret[key] = obj[key];
            }
          }
          return ret;
        }
        util.markAsOriginatingFromRejection(obj);
        return obj;
      }
      function nodebackForPromise(promise, multiArgs) {
        return function(err, value) {
          if (promise === null)
            return;
          if (err) {
            var wrapped = wrapAsOperationalError(maybeWrapAsError(err));
            promise._attachExtraTrace(wrapped);
            promise._reject(wrapped);
          } else if (!multiArgs) {
            promise._fulfill(value);
          } else {
            var args = [].slice.call(arguments, 1);
            promise._fulfill(args);
          }
          promise = null;
        };
      }
      module3.exports = nodebackForPromise;
    }, { "./errors": 12, "./es5": 13, "./util": 36 }], 21: [function(_dereq_2, module3, exports2) {
      module3.exports = function(Promise2) {
        var util = _dereq_2("./util");
        var async = Promise2._async;
        var tryCatch = util.tryCatch;
        var errorObj = util.errorObj;
        function spreadAdapter(val, nodeback) {
          var promise = this;
          if (!util.isArray(val))
            return successAdapter.call(promise, val, nodeback);
          var ret = tryCatch(nodeback).apply(promise._boundValue(), [null].concat(val));
          if (ret === errorObj) {
            async.throwLater(ret.e);
          }
        }
        function successAdapter(val, nodeback) {
          var promise = this;
          var receiver = promise._boundValue();
          var ret = val === void 0 ? tryCatch(nodeback).call(receiver, null) : tryCatch(nodeback).call(receiver, null, val);
          if (ret === errorObj) {
            async.throwLater(ret.e);
          }
        }
        function errorAdapter(reason, nodeback) {
          var promise = this;
          if (!reason) {
            var newReason = new Error(reason + "");
            newReason.cause = reason;
            reason = newReason;
          }
          var ret = tryCatch(nodeback).call(promise._boundValue(), reason);
          if (ret === errorObj) {
            async.throwLater(ret.e);
          }
        }
        Promise2.prototype.asCallback = Promise2.prototype.nodeify = function(nodeback, options) {
          if (typeof nodeback == "function") {
            var adapter = successAdapter;
            if (options !== void 0 && Object(options).spread) {
              adapter = spreadAdapter;
            }
            this._then(
              adapter,
              errorAdapter,
              void 0,
              this,
              nodeback
            );
          }
          return this;
        };
      };
    }, { "./util": 36 }], 22: [function(_dereq_2, module3, exports2) {
      module3.exports = function() {
        var makeSelfResolutionError = function() {
          return new TypeError2("circular promise resolution chain\n\n    See http://goo.gl/MqrFmX\n");
        };
        var reflectHandler = function() {
          return new Promise2.PromiseInspection(this._target());
        };
        var apiRejection = function(msg) {
          return Promise2.reject(new TypeError2(msg));
        };
        function Proxyable() {
        }
        var UNDEFINED_BINDING = {};
        var util = _dereq_2("./util");
        util.setReflectHandler(reflectHandler);
        var getDomain = function() {
          var domain = process.domain;
          if (domain === void 0) {
            return null;
          }
          return domain;
        };
        var getContextDefault = function() {
          return null;
        };
        var getContextDomain = function() {
          return {
            domain: getDomain(),
            async: null
          };
        };
        var AsyncResource = util.isNode && util.nodeSupportsAsyncResource ? _dereq_2("async_hooks").AsyncResource : null;
        var getContextAsyncHooks = function() {
          return {
            domain: getDomain(),
            async: new AsyncResource("Bluebird::Promise")
          };
        };
        var getContext = util.isNode ? getContextDomain : getContextDefault;
        util.notEnumerableProp(Promise2, "_getContext", getContext);
        var enableAsyncHooks = function() {
          getContext = getContextAsyncHooks;
          util.notEnumerableProp(Promise2, "_getContext", getContextAsyncHooks);
        };
        var disableAsyncHooks = function() {
          getContext = getContextDomain;
          util.notEnumerableProp(Promise2, "_getContext", getContextDomain);
        };
        var es5 = _dereq_2("./es5");
        var Async = _dereq_2("./async");
        var async = new Async();
        es5.defineProperty(Promise2, "_async", { value: async });
        var errors = _dereq_2("./errors");
        var TypeError2 = Promise2.TypeError = errors.TypeError;
        Promise2.RangeError = errors.RangeError;
        var CancellationError = Promise2.CancellationError = errors.CancellationError;
        Promise2.TimeoutError = errors.TimeoutError;
        Promise2.OperationalError = errors.OperationalError;
        Promise2.RejectionError = errors.OperationalError;
        Promise2.AggregateError = errors.AggregateError;
        var INTERNAL = function() {
        };
        var APPLY = {};
        var NEXT_FILTER = {};
        var tryConvertToPromise = _dereq_2("./thenables")(Promise2, INTERNAL);
        var PromiseArray = _dereq_2("./promise_array")(
          Promise2,
          INTERNAL,
          tryConvertToPromise,
          apiRejection,
          Proxyable
        );
        var Context = _dereq_2("./context")(Promise2);
        var createContext = Context.create;
        var debug = _dereq_2("./debuggability")(
          Promise2,
          Context,
          enableAsyncHooks,
          disableAsyncHooks
        );
        debug.CapturedTrace;
        var PassThroughHandlerContext = _dereq_2("./finally")(Promise2, tryConvertToPromise, NEXT_FILTER);
        var catchFilter = _dereq_2("./catch_filter")(NEXT_FILTER);
        var nodebackForPromise = _dereq_2("./nodeback");
        var errorObj = util.errorObj;
        var tryCatch = util.tryCatch;
        function check(self2, executor) {
          if (self2 == null || self2.constructor !== Promise2) {
            throw new TypeError2("the promise constructor cannot be invoked directly\n\n    See http://goo.gl/MqrFmX\n");
          }
          if (typeof executor !== "function") {
            throw new TypeError2("expecting a function but got " + util.classString(executor));
          }
        }
        function Promise2(executor) {
          if (executor !== INTERNAL) {
            check(this, executor);
          }
          this._bitField = 0;
          this._fulfillmentHandler0 = void 0;
          this._rejectionHandler0 = void 0;
          this._promise0 = void 0;
          this._receiver0 = void 0;
          this._resolveFromExecutor(executor);
          this._promiseCreated();
          this._fireEvent("promiseCreated", this);
        }
        Promise2.prototype.toString = function() {
          return "[object Promise]";
        };
        Promise2.prototype.caught = Promise2.prototype["catch"] = function(fn) {
          var len = arguments.length;
          if (len > 1) {
            var catchInstances = new Array(len - 1), j = 0, i;
            for (i = 0; i < len - 1; ++i) {
              var item = arguments[i];
              if (util.isObject(item)) {
                catchInstances[j++] = item;
              } else {
                return apiRejection("Catch statement predicate: expecting an object but got " + util.classString(item));
              }
            }
            catchInstances.length = j;
            fn = arguments[i];
            if (typeof fn !== "function") {
              throw new TypeError2("The last argument to .catch() must be a function, got " + util.toString(fn));
            }
            return this.then(void 0, catchFilter(catchInstances, fn, this));
          }
          return this.then(void 0, fn);
        };
        Promise2.prototype.reflect = function() {
          return this._then(
            reflectHandler,
            reflectHandler,
            void 0,
            this,
            void 0
          );
        };
        Promise2.prototype.then = function(didFulfill, didReject) {
          if (debug.warnings() && arguments.length > 0 && typeof didFulfill !== "function" && typeof didReject !== "function") {
            var msg = ".then() only accepts functions but was passed: " + util.classString(didFulfill);
            if (arguments.length > 1) {
              msg += ", " + util.classString(didReject);
            }
            this._warn(msg);
          }
          return this._then(didFulfill, didReject, void 0, void 0, void 0);
        };
        Promise2.prototype.done = function(didFulfill, didReject) {
          var promise = this._then(didFulfill, didReject, void 0, void 0, void 0);
          promise._setIsFinal();
        };
        Promise2.prototype.spread = function(fn) {
          if (typeof fn !== "function") {
            return apiRejection("expecting a function but got " + util.classString(fn));
          }
          return this.all()._then(fn, void 0, void 0, APPLY, void 0);
        };
        Promise2.prototype.toJSON = function() {
          var ret = {
            isFulfilled: false,
            isRejected: false,
            fulfillmentValue: void 0,
            rejectionReason: void 0
          };
          if (this.isFulfilled()) {
            ret.fulfillmentValue = this.value();
            ret.isFulfilled = true;
          } else if (this.isRejected()) {
            ret.rejectionReason = this.reason();
            ret.isRejected = true;
          }
          return ret;
        };
        Promise2.prototype.all = function() {
          if (arguments.length > 0) {
            this._warn(".all() was passed arguments but it does not take any");
          }
          return new PromiseArray(this).promise();
        };
        Promise2.prototype.error = function(fn) {
          return this.caught(util.originatesFromRejection, fn);
        };
        Promise2.getNewLibraryCopy = module3.exports;
        Promise2.is = function(val) {
          return val instanceof Promise2;
        };
        Promise2.fromNode = Promise2.fromCallback = function(fn) {
          var ret = new Promise2(INTERNAL);
          ret._captureStackTrace();
          var multiArgs = arguments.length > 1 ? !!Object(arguments[1]).multiArgs : false;
          var result = tryCatch(fn)(nodebackForPromise(ret, multiArgs));
          if (result === errorObj) {
            ret._rejectCallback(result.e, true);
          }
          if (!ret._isFateSealed())
            ret._setAsyncGuaranteed();
          return ret;
        };
        Promise2.all = function(promises) {
          return new PromiseArray(promises).promise();
        };
        Promise2.cast = function(obj) {
          var ret = tryConvertToPromise(obj);
          if (!(ret instanceof Promise2)) {
            ret = new Promise2(INTERNAL);
            ret._captureStackTrace();
            ret._setFulfilled();
            ret._rejectionHandler0 = obj;
          }
          return ret;
        };
        Promise2.resolve = Promise2.fulfilled = Promise2.cast;
        Promise2.reject = Promise2.rejected = function(reason) {
          var ret = new Promise2(INTERNAL);
          ret._captureStackTrace();
          ret._rejectCallback(reason, true);
          return ret;
        };
        Promise2.setScheduler = function(fn) {
          if (typeof fn !== "function") {
            throw new TypeError2("expecting a function but got " + util.classString(fn));
          }
          return async.setScheduler(fn);
        };
        Promise2.prototype._then = function(didFulfill, didReject, _, receiver, internalData) {
          var haveInternalData = internalData !== void 0;
          var promise = haveInternalData ? internalData : new Promise2(INTERNAL);
          var target = this._target();
          var bitField = target._bitField;
          if (!haveInternalData) {
            promise._propagateFrom(this, 3);
            promise._captureStackTrace();
            if (receiver === void 0 && (this._bitField & 2097152) !== 0) {
              if (!((bitField & 50397184) === 0)) {
                receiver = this._boundValue();
              } else {
                receiver = target === this ? void 0 : this._boundTo;
              }
            }
            this._fireEvent("promiseChained", this, promise);
          }
          var context = getContext();
          if (!((bitField & 50397184) === 0)) {
            var handler, value, settler = target._settlePromiseCtx;
            if ((bitField & 33554432) !== 0) {
              value = target._rejectionHandler0;
              handler = didFulfill;
            } else if ((bitField & 16777216) !== 0) {
              value = target._fulfillmentHandler0;
              handler = didReject;
              target._unsetRejectionIsUnhandled();
            } else {
              settler = target._settlePromiseLateCancellationObserver;
              value = new CancellationError("late cancellation observer");
              target._attachExtraTrace(value);
              handler = didReject;
            }
            async.invoke(settler, target, {
              handler: util.contextBind(context, handler),
              promise,
              receiver,
              value
            });
          } else {
            target._addCallbacks(
              didFulfill,
              didReject,
              promise,
              receiver,
              context
            );
          }
          return promise;
        };
        Promise2.prototype._length = function() {
          return this._bitField & 65535;
        };
        Promise2.prototype._isFateSealed = function() {
          return (this._bitField & 117506048) !== 0;
        };
        Promise2.prototype._isFollowing = function() {
          return (this._bitField & 67108864) === 67108864;
        };
        Promise2.prototype._setLength = function(len) {
          this._bitField = this._bitField & -65536 | len & 65535;
        };
        Promise2.prototype._setFulfilled = function() {
          this._bitField = this._bitField | 33554432;
          this._fireEvent("promiseFulfilled", this);
        };
        Promise2.prototype._setRejected = function() {
          this._bitField = this._bitField | 16777216;
          this._fireEvent("promiseRejected", this);
        };
        Promise2.prototype._setFollowing = function() {
          this._bitField = this._bitField | 67108864;
          this._fireEvent("promiseResolved", this);
        };
        Promise2.prototype._setIsFinal = function() {
          this._bitField = this._bitField | 4194304;
        };
        Promise2.prototype._isFinal = function() {
          return (this._bitField & 4194304) > 0;
        };
        Promise2.prototype._unsetCancelled = function() {
          this._bitField = this._bitField & ~65536;
        };
        Promise2.prototype._setCancelled = function() {
          this._bitField = this._bitField | 65536;
          this._fireEvent("promiseCancelled", this);
        };
        Promise2.prototype._setWillBeCancelled = function() {
          this._bitField = this._bitField | 8388608;
        };
        Promise2.prototype._setAsyncGuaranteed = function() {
          if (async.hasCustomScheduler())
            return;
          var bitField = this._bitField;
          this._bitField = bitField | (bitField & 536870912) >> 2 ^ 134217728;
        };
        Promise2.prototype._setNoAsyncGuarantee = function() {
          this._bitField = (this._bitField | 536870912) & ~134217728;
        };
        Promise2.prototype._receiverAt = function(index) {
          var ret = index === 0 ? this._receiver0 : this[index * 4 - 4 + 3];
          if (ret === UNDEFINED_BINDING) {
            return void 0;
          } else if (ret === void 0 && this._isBound()) {
            return this._boundValue();
          }
          return ret;
        };
        Promise2.prototype._promiseAt = function(index) {
          return this[index * 4 - 4 + 2];
        };
        Promise2.prototype._fulfillmentHandlerAt = function(index) {
          return this[index * 4 - 4 + 0];
        };
        Promise2.prototype._rejectionHandlerAt = function(index) {
          return this[index * 4 - 4 + 1];
        };
        Promise2.prototype._boundValue = function() {
        };
        Promise2.prototype._migrateCallback0 = function(follower) {
          follower._bitField;
          var fulfill = follower._fulfillmentHandler0;
          var reject = follower._rejectionHandler0;
          var promise = follower._promise0;
          var receiver = follower._receiverAt(0);
          if (receiver === void 0)
            receiver = UNDEFINED_BINDING;
          this._addCallbacks(fulfill, reject, promise, receiver, null);
        };
        Promise2.prototype._migrateCallbackAt = function(follower, index) {
          var fulfill = follower._fulfillmentHandlerAt(index);
          var reject = follower._rejectionHandlerAt(index);
          var promise = follower._promiseAt(index);
          var receiver = follower._receiverAt(index);
          if (receiver === void 0)
            receiver = UNDEFINED_BINDING;
          this._addCallbacks(fulfill, reject, promise, receiver, null);
        };
        Promise2.prototype._addCallbacks = function(fulfill, reject, promise, receiver, context) {
          var index = this._length();
          if (index >= 65535 - 4) {
            index = 0;
            this._setLength(0);
          }
          if (index === 0) {
            this._promise0 = promise;
            this._receiver0 = receiver;
            if (typeof fulfill === "function") {
              this._fulfillmentHandler0 = util.contextBind(context, fulfill);
            }
            if (typeof reject === "function") {
              this._rejectionHandler0 = util.contextBind(context, reject);
            }
          } else {
            var base = index * 4 - 4;
            this[base + 2] = promise;
            this[base + 3] = receiver;
            if (typeof fulfill === "function") {
              this[base + 0] = util.contextBind(context, fulfill);
            }
            if (typeof reject === "function") {
              this[base + 1] = util.contextBind(context, reject);
            }
          }
          this._setLength(index + 1);
          return index;
        };
        Promise2.prototype._proxy = function(proxyable, arg) {
          this._addCallbacks(void 0, void 0, arg, proxyable, null);
        };
        Promise2.prototype._resolveCallback = function(value, shouldBind) {
          if ((this._bitField & 117506048) !== 0)
            return;
          if (value === this)
            return this._rejectCallback(makeSelfResolutionError(), false);
          var maybePromise = tryConvertToPromise(value, this);
          if (!(maybePromise instanceof Promise2))
            return this._fulfill(value);
          if (shouldBind)
            this._propagateFrom(maybePromise, 2);
          var promise = maybePromise._target();
          if (promise === this) {
            this._reject(makeSelfResolutionError());
            return;
          }
          var bitField = promise._bitField;
          if ((bitField & 50397184) === 0) {
            var len = this._length();
            if (len > 0)
              promise._migrateCallback0(this);
            for (var i = 1; i < len; ++i) {
              promise._migrateCallbackAt(this, i);
            }
            this._setFollowing();
            this._setLength(0);
            this._setFollowee(maybePromise);
          } else if ((bitField & 33554432) !== 0) {
            this._fulfill(promise._value());
          } else if ((bitField & 16777216) !== 0) {
            this._reject(promise._reason());
          } else {
            var reason = new CancellationError("late cancellation observer");
            promise._attachExtraTrace(reason);
            this._reject(reason);
          }
        };
        Promise2.prototype._rejectCallback = function(reason, synchronous, ignoreNonErrorWarnings) {
          var trace = util.ensureErrorObject(reason);
          var hasStack = trace === reason;
          if (!hasStack && !ignoreNonErrorWarnings && debug.warnings()) {
            var message = "a promise was rejected with a non-error: " + util.classString(reason);
            this._warn(message, true);
          }
          this._attachExtraTrace(trace, synchronous ? hasStack : false);
          this._reject(reason);
        };
        Promise2.prototype._resolveFromExecutor = function(executor) {
          if (executor === INTERNAL)
            return;
          var promise = this;
          this._captureStackTrace();
          this._pushContext();
          var synchronous = true;
          var r = this._execute(executor, function(value) {
            promise._resolveCallback(value);
          }, function(reason) {
            promise._rejectCallback(reason, synchronous);
          });
          synchronous = false;
          this._popContext();
          if (r !== void 0) {
            promise._rejectCallback(r, true);
          }
        };
        Promise2.prototype._settlePromiseFromHandler = function(handler, receiver, value, promise) {
          var bitField = promise._bitField;
          if ((bitField & 65536) !== 0)
            return;
          promise._pushContext();
          var x;
          if (receiver === APPLY) {
            if (!value || typeof value.length !== "number") {
              x = errorObj;
              x.e = new TypeError2("cannot .spread() a non-array: " + util.classString(value));
            } else {
              x = tryCatch(handler).apply(this._boundValue(), value);
            }
          } else {
            x = tryCatch(handler).call(receiver, value);
          }
          var promiseCreated = promise._popContext();
          bitField = promise._bitField;
          if ((bitField & 65536) !== 0)
            return;
          if (x === NEXT_FILTER) {
            promise._reject(value);
          } else if (x === errorObj) {
            promise._rejectCallback(x.e, false);
          } else {
            debug.checkForgottenReturns(x, promiseCreated, "", promise, this);
            promise._resolveCallback(x);
          }
        };
        Promise2.prototype._target = function() {
          var ret = this;
          while (ret._isFollowing())
            ret = ret._followee();
          return ret;
        };
        Promise2.prototype._followee = function() {
          return this._rejectionHandler0;
        };
        Promise2.prototype._setFollowee = function(promise) {
          this._rejectionHandler0 = promise;
        };
        Promise2.prototype._settlePromise = function(promise, handler, receiver, value) {
          var isPromise = promise instanceof Promise2;
          var bitField = this._bitField;
          var asyncGuaranteed = (bitField & 134217728) !== 0;
          if ((bitField & 65536) !== 0) {
            if (isPromise)
              promise._invokeInternalOnCancel();
            if (receiver instanceof PassThroughHandlerContext && receiver.isFinallyHandler()) {
              receiver.cancelPromise = promise;
              if (tryCatch(handler).call(receiver, value) === errorObj) {
                promise._reject(errorObj.e);
              }
            } else if (handler === reflectHandler) {
              promise._fulfill(reflectHandler.call(receiver));
            } else if (receiver instanceof Proxyable) {
              receiver._promiseCancelled(promise);
            } else if (isPromise || promise instanceof PromiseArray) {
              promise._cancel();
            } else {
              receiver.cancel();
            }
          } else if (typeof handler === "function") {
            if (!isPromise) {
              handler.call(receiver, value, promise);
            } else {
              if (asyncGuaranteed)
                promise._setAsyncGuaranteed();
              this._settlePromiseFromHandler(handler, receiver, value, promise);
            }
          } else if (receiver instanceof Proxyable) {
            if (!receiver._isResolved()) {
              if ((bitField & 33554432) !== 0) {
                receiver._promiseFulfilled(value, promise);
              } else {
                receiver._promiseRejected(value, promise);
              }
            }
          } else if (isPromise) {
            if (asyncGuaranteed)
              promise._setAsyncGuaranteed();
            if ((bitField & 33554432) !== 0) {
              promise._fulfill(value);
            } else {
              promise._reject(value);
            }
          }
        };
        Promise2.prototype._settlePromiseLateCancellationObserver = function(ctx) {
          var handler = ctx.handler;
          var promise = ctx.promise;
          var receiver = ctx.receiver;
          var value = ctx.value;
          if (typeof handler === "function") {
            if (!(promise instanceof Promise2)) {
              handler.call(receiver, value, promise);
            } else {
              this._settlePromiseFromHandler(handler, receiver, value, promise);
            }
          } else if (promise instanceof Promise2) {
            promise._reject(value);
          }
        };
        Promise2.prototype._settlePromiseCtx = function(ctx) {
          this._settlePromise(ctx.promise, ctx.handler, ctx.receiver, ctx.value);
        };
        Promise2.prototype._settlePromise0 = function(handler, value, bitField) {
          var promise = this._promise0;
          var receiver = this._receiverAt(0);
          this._promise0 = void 0;
          this._receiver0 = void 0;
          this._settlePromise(promise, handler, receiver, value);
        };
        Promise2.prototype._clearCallbackDataAtIndex = function(index) {
          var base = index * 4 - 4;
          this[base + 2] = this[base + 3] = this[base + 0] = this[base + 1] = void 0;
        };
        Promise2.prototype._fulfill = function(value) {
          var bitField = this._bitField;
          if ((bitField & 117506048) >>> 16)
            return;
          if (value === this) {
            var err = makeSelfResolutionError();
            this._attachExtraTrace(err);
            return this._reject(err);
          }
          this._setFulfilled();
          this._rejectionHandler0 = value;
          if ((bitField & 65535) > 0) {
            if ((bitField & 134217728) !== 0) {
              this._settlePromises();
            } else {
              async.settlePromises(this);
            }
            this._dereferenceTrace();
          }
        };
        Promise2.prototype._reject = function(reason) {
          var bitField = this._bitField;
          if ((bitField & 117506048) >>> 16)
            return;
          this._setRejected();
          this._fulfillmentHandler0 = reason;
          if (this._isFinal()) {
            return async.fatalError(reason, util.isNode);
          }
          if ((bitField & 65535) > 0) {
            async.settlePromises(this);
          } else {
            this._ensurePossibleRejectionHandled();
          }
        };
        Promise2.prototype._fulfillPromises = function(len, value) {
          for (var i = 1; i < len; i++) {
            var handler = this._fulfillmentHandlerAt(i);
            var promise = this._promiseAt(i);
            var receiver = this._receiverAt(i);
            this._clearCallbackDataAtIndex(i);
            this._settlePromise(promise, handler, receiver, value);
          }
        };
        Promise2.prototype._rejectPromises = function(len, reason) {
          for (var i = 1; i < len; i++) {
            var handler = this._rejectionHandlerAt(i);
            var promise = this._promiseAt(i);
            var receiver = this._receiverAt(i);
            this._clearCallbackDataAtIndex(i);
            this._settlePromise(promise, handler, receiver, reason);
          }
        };
        Promise2.prototype._settlePromises = function() {
          var bitField = this._bitField;
          var len = bitField & 65535;
          if (len > 0) {
            if ((bitField & 16842752) !== 0) {
              var reason = this._fulfillmentHandler0;
              this._settlePromise0(this._rejectionHandler0, reason, bitField);
              this._rejectPromises(len, reason);
            } else {
              var value = this._rejectionHandler0;
              this._settlePromise0(this._fulfillmentHandler0, value, bitField);
              this._fulfillPromises(len, value);
            }
            this._setLength(0);
          }
          this._clearCancellationData();
        };
        Promise2.prototype._settledValue = function() {
          var bitField = this._bitField;
          if ((bitField & 33554432) !== 0) {
            return this._rejectionHandler0;
          } else if ((bitField & 16777216) !== 0) {
            return this._fulfillmentHandler0;
          }
        };
        if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
          es5.defineProperty(Promise2.prototype, Symbol.toStringTag, {
            get: function() {
              return "Object";
            }
          });
        }
        function deferResolve(v) {
          this.promise._resolveCallback(v);
        }
        function deferReject(v) {
          this.promise._rejectCallback(v, false);
        }
        Promise2.defer = Promise2.pending = function() {
          debug.deprecated("Promise.defer", "new Promise");
          var promise = new Promise2(INTERNAL);
          return {
            promise,
            resolve: deferResolve,
            reject: deferReject
          };
        };
        util.notEnumerableProp(
          Promise2,
          "_makeSelfResolutionError",
          makeSelfResolutionError
        );
        _dereq_2("./method")(
          Promise2,
          INTERNAL,
          tryConvertToPromise,
          apiRejection,
          debug
        );
        _dereq_2("./bind")(Promise2, INTERNAL, tryConvertToPromise, debug);
        _dereq_2("./cancel")(Promise2, PromiseArray, apiRejection, debug);
        _dereq_2("./direct_resolve")(Promise2);
        _dereq_2("./synchronous_inspection")(Promise2);
        _dereq_2("./join")(
          Promise2,
          PromiseArray,
          tryConvertToPromise,
          INTERNAL,
          async
        );
        Promise2.Promise = Promise2;
        Promise2.version = "3.7.2";
        _dereq_2("./call_get.js")(Promise2);
        _dereq_2("./generators.js")(Promise2, apiRejection, INTERNAL, tryConvertToPromise, Proxyable, debug);
        _dereq_2("./map.js")(Promise2, PromiseArray, apiRejection, tryConvertToPromise, INTERNAL, debug);
        _dereq_2("./nodeify.js")(Promise2);
        _dereq_2("./promisify.js")(Promise2, INTERNAL);
        _dereq_2("./props.js")(Promise2, PromiseArray, tryConvertToPromise, apiRejection);
        _dereq_2("./race.js")(Promise2, INTERNAL, tryConvertToPromise, apiRejection);
        _dereq_2("./reduce.js")(Promise2, PromiseArray, apiRejection, tryConvertToPromise, INTERNAL, debug);
        _dereq_2("./settle.js")(Promise2, PromiseArray, debug);
        _dereq_2("./some.js")(Promise2, PromiseArray, apiRejection);
        _dereq_2("./timers.js")(Promise2, INTERNAL, debug);
        _dereq_2("./using.js")(Promise2, apiRejection, tryConvertToPromise, createContext, INTERNAL, debug);
        _dereq_2("./any.js")(Promise2);
        _dereq_2("./each.js")(Promise2, INTERNAL);
        _dereq_2("./filter.js")(Promise2, INTERNAL);
        util.toFastProperties(Promise2);
        util.toFastProperties(Promise2.prototype);
        function fillTypes(value) {
          var p = new Promise2(INTERNAL);
          p._fulfillmentHandler0 = value;
          p._rejectionHandler0 = value;
          p._promise0 = value;
          p._receiver0 = value;
        }
        fillTypes({ a: 1 });
        fillTypes({ b: 2 });
        fillTypes({ c: 3 });
        fillTypes(1);
        fillTypes(function() {
        });
        fillTypes(void 0);
        fillTypes(false);
        fillTypes(new Promise2(INTERNAL));
        debug.setBounds(Async.firstLineError, util.lastLineError);
        return Promise2;
      };
    }, { "./any.js": 1, "./async": 2, "./bind": 3, "./call_get.js": 5, "./cancel": 6, "./catch_filter": 7, "./context": 8, "./debuggability": 9, "./direct_resolve": 10, "./each.js": 11, "./errors": 12, "./es5": 13, "./filter.js": 14, "./finally": 15, "./generators.js": 16, "./join": 17, "./map.js": 18, "./method": 19, "./nodeback": 20, "./nodeify.js": 21, "./promise_array": 23, "./promisify.js": 24, "./props.js": 25, "./race.js": 27, "./reduce.js": 28, "./settle.js": 30, "./some.js": 31, "./synchronous_inspection": 32, "./thenables": 33, "./timers.js": 34, "./using.js": 35, "./util": 36, "async_hooks": void 0 }], 23: [function(_dereq_2, module3, exports2) {
      module3.exports = function(Promise2, INTERNAL, tryConvertToPromise, apiRejection, Proxyable) {
        var util = _dereq_2("./util");
        util.isArray;
        function toResolutionValue(val) {
          switch (val) {
            case -2:
              return [];
            case -3:
              return {};
            case -6:
              return /* @__PURE__ */ new Map();
          }
        }
        function PromiseArray(values) {
          var promise = this._promise = new Promise2(INTERNAL);
          if (values instanceof Promise2) {
            promise._propagateFrom(values, 3);
            values.suppressUnhandledRejections();
          }
          promise._setOnCancel(this);
          this._values = values;
          this._length = 0;
          this._totalResolved = 0;
          this._init(void 0, -2);
        }
        util.inherits(PromiseArray, Proxyable);
        PromiseArray.prototype.length = function() {
          return this._length;
        };
        PromiseArray.prototype.promise = function() {
          return this._promise;
        };
        PromiseArray.prototype._init = function init(_, resolveValueIfEmpty) {
          var values = tryConvertToPromise(this._values, this._promise);
          if (values instanceof Promise2) {
            values = values._target();
            var bitField = values._bitField;
            this._values = values;
            if ((bitField & 50397184) === 0) {
              this._promise._setAsyncGuaranteed();
              return values._then(
                init,
                this._reject,
                void 0,
                this,
                resolveValueIfEmpty
              );
            } else if ((bitField & 33554432) !== 0) {
              values = values._value();
            } else if ((bitField & 16777216) !== 0) {
              return this._reject(values._reason());
            } else {
              return this._cancel();
            }
          }
          values = util.asArray(values);
          if (values === null) {
            var err = apiRejection(
              "expecting an array or an iterable object but got " + util.classString(values)
            ).reason();
            this._promise._rejectCallback(err, false);
            return;
          }
          if (values.length === 0) {
            if (resolveValueIfEmpty === -5) {
              this._resolveEmptyArray();
            } else {
              this._resolve(toResolutionValue(resolveValueIfEmpty));
            }
            return;
          }
          this._iterate(values);
        };
        PromiseArray.prototype._iterate = function(values) {
          var len = this.getActualLength(values.length);
          this._length = len;
          this._values = this.shouldCopyValues() ? new Array(len) : this._values;
          var result = this._promise;
          var isResolved = false;
          var bitField = null;
          for (var i = 0; i < len; ++i) {
            var maybePromise = tryConvertToPromise(values[i], result);
            if (maybePromise instanceof Promise2) {
              maybePromise = maybePromise._target();
              bitField = maybePromise._bitField;
            } else {
              bitField = null;
            }
            if (isResolved) {
              if (bitField !== null) {
                maybePromise.suppressUnhandledRejections();
              }
            } else if (bitField !== null) {
              if ((bitField & 50397184) === 0) {
                maybePromise._proxy(this, i);
                this._values[i] = maybePromise;
              } else if ((bitField & 33554432) !== 0) {
                isResolved = this._promiseFulfilled(maybePromise._value(), i);
              } else if ((bitField & 16777216) !== 0) {
                isResolved = this._promiseRejected(maybePromise._reason(), i);
              } else {
                isResolved = this._promiseCancelled(i);
              }
            } else {
              isResolved = this._promiseFulfilled(maybePromise, i);
            }
          }
          if (!isResolved)
            result._setAsyncGuaranteed();
        };
        PromiseArray.prototype._isResolved = function() {
          return this._values === null;
        };
        PromiseArray.prototype._resolve = function(value) {
          this._values = null;
          this._promise._fulfill(value);
        };
        PromiseArray.prototype._cancel = function() {
          if (this._isResolved() || !this._promise._isCancellable())
            return;
          this._values = null;
          this._promise._cancel();
        };
        PromiseArray.prototype._reject = function(reason) {
          this._values = null;
          this._promise._rejectCallback(reason, false);
        };
        PromiseArray.prototype._promiseFulfilled = function(value, index) {
          this._values[index] = value;
          var totalResolved = ++this._totalResolved;
          if (totalResolved >= this._length) {
            this._resolve(this._values);
            return true;
          }
          return false;
        };
        PromiseArray.prototype._promiseCancelled = function() {
          this._cancel();
          return true;
        };
        PromiseArray.prototype._promiseRejected = function(reason) {
          this._totalResolved++;
          this._reject(reason);
          return true;
        };
        PromiseArray.prototype._resultCancelled = function() {
          if (this._isResolved())
            return;
          var values = this._values;
          this._cancel();
          if (values instanceof Promise2) {
            values.cancel();
          } else {
            for (var i = 0; i < values.length; ++i) {
              if (values[i] instanceof Promise2) {
                values[i].cancel();
              }
            }
          }
        };
        PromiseArray.prototype.shouldCopyValues = function() {
          return true;
        };
        PromiseArray.prototype.getActualLength = function(len) {
          return len;
        };
        return PromiseArray;
      };
    }, { "./util": 36 }], 24: [function(_dereq_2, module3, exports2) {
      module3.exports = function(Promise2, INTERNAL) {
        var THIS = {};
        var util = _dereq_2("./util");
        var nodebackForPromise = _dereq_2("./nodeback");
        var withAppended = util.withAppended;
        var maybeWrapAsError = util.maybeWrapAsError;
        var canEvaluate = util.canEvaluate;
        var TypeError2 = _dereq_2("./errors").TypeError;
        var defaultSuffix = "Async";
        var defaultPromisified = { __isPromisified__: true };
        var noCopyProps = [
          "arity",
          "length",
          "name",
          "arguments",
          "caller",
          "callee",
          "prototype",
          "__isPromisified__"
        ];
        var noCopyPropsPattern = new RegExp("^(?:" + noCopyProps.join("|") + ")$");
        var defaultFilter = function(name) {
          return util.isIdentifier(name) && name.charAt(0) !== "_" && name !== "constructor";
        };
        function propsFilter(key) {
          return !noCopyPropsPattern.test(key);
        }
        function isPromisified(fn) {
          try {
            return fn.__isPromisified__ === true;
          } catch (e) {
            return false;
          }
        }
        function hasPromisified(obj, key, suffix) {
          var val = util.getDataPropertyOrDefault(
            obj,
            key + suffix,
            defaultPromisified
          );
          return val ? isPromisified(val) : false;
        }
        function checkValid(ret, suffix, suffixRegexp) {
          for (var i = 0; i < ret.length; i += 2) {
            var key = ret[i];
            if (suffixRegexp.test(key)) {
              var keyWithoutAsyncSuffix = key.replace(suffixRegexp, "");
              for (var j = 0; j < ret.length; j += 2) {
                if (ret[j] === keyWithoutAsyncSuffix) {
                  throw new TypeError2("Cannot promisify an API that has normal methods with '%s'-suffix\n\n    See http://goo.gl/MqrFmX\n".replace("%s", suffix));
                }
              }
            }
          }
        }
        function promisifiableMethods(obj, suffix, suffixRegexp, filter) {
          var keys = util.inheritedDataKeys(obj);
          var ret = [];
          for (var i = 0; i < keys.length; ++i) {
            var key = keys[i];
            var value = obj[key];
            var passesDefaultFilter = filter === defaultFilter ? true : defaultFilter(key);
            if (typeof value === "function" && !isPromisified(value) && !hasPromisified(obj, key, suffix) && filter(key, value, obj, passesDefaultFilter)) {
              ret.push(key, value);
            }
          }
          checkValid(ret, suffix, suffixRegexp);
          return ret;
        }
        var escapeIdentRegex = function(str) {
          return str.replace(/([$])/, "\\$");
        };
        var makeNodePromisifiedEval;
        function makeNodePromisifiedClosure(callback, receiver, _, fn, __, multiArgs) {
          var defaultThis = function() {
            return this;
          }();
          var method = callback;
          if (typeof method === "string") {
            callback = fn;
          }
          function promisified() {
            var _receiver = receiver;
            if (receiver === THIS)
              _receiver = this;
            var promise = new Promise2(INTERNAL);
            promise._captureStackTrace();
            var cb = typeof method === "string" && this !== defaultThis ? this[method] : callback;
            var fn2 = nodebackForPromise(promise, multiArgs);
            try {
              cb.apply(_receiver, withAppended(arguments, fn2));
            } catch (e) {
              promise._rejectCallback(maybeWrapAsError(e), true, true);
            }
            if (!promise._isFateSealed())
              promise._setAsyncGuaranteed();
            return promise;
          }
          util.notEnumerableProp(promisified, "__isPromisified__", true);
          return promisified;
        }
        var makeNodePromisified = canEvaluate ? makeNodePromisifiedEval : makeNodePromisifiedClosure;
        function promisifyAll(obj, suffix, filter, promisifier, multiArgs) {
          var suffixRegexp = new RegExp(escapeIdentRegex(suffix) + "$");
          var methods = promisifiableMethods(obj, suffix, suffixRegexp, filter);
          for (var i = 0, len = methods.length; i < len; i += 2) {
            var key = methods[i];
            var fn = methods[i + 1];
            var promisifiedKey = key + suffix;
            if (promisifier === makeNodePromisified) {
              obj[promisifiedKey] = makeNodePromisified(key, THIS, key, fn, suffix, multiArgs);
            } else {
              var promisified = promisifier(fn, function() {
                return makeNodePromisified(
                  key,
                  THIS,
                  key,
                  fn,
                  suffix,
                  multiArgs
                );
              });
              util.notEnumerableProp(promisified, "__isPromisified__", true);
              obj[promisifiedKey] = promisified;
            }
          }
          util.toFastProperties(obj);
          return obj;
        }
        function promisify(callback, receiver, multiArgs) {
          return makeNodePromisified(
            callback,
            receiver,
            void 0,
            callback,
            null,
            multiArgs
          );
        }
        Promise2.promisify = function(fn, options) {
          if (typeof fn !== "function") {
            throw new TypeError2("expecting a function but got " + util.classString(fn));
          }
          if (isPromisified(fn)) {
            return fn;
          }
          options = Object(options);
          var receiver = options.context === void 0 ? THIS : options.context;
          var multiArgs = !!options.multiArgs;
          var ret = promisify(fn, receiver, multiArgs);
          util.copyDescriptors(fn, ret, propsFilter);
          return ret;
        };
        Promise2.promisifyAll = function(target, options) {
          if (typeof target !== "function" && typeof target !== "object") {
            throw new TypeError2("the target of promisifyAll must be an object or a function\n\n    See http://goo.gl/MqrFmX\n");
          }
          options = Object(options);
          var multiArgs = !!options.multiArgs;
          var suffix = options.suffix;
          if (typeof suffix !== "string")
            suffix = defaultSuffix;
          var filter = options.filter;
          if (typeof filter !== "function")
            filter = defaultFilter;
          var promisifier = options.promisifier;
          if (typeof promisifier !== "function")
            promisifier = makeNodePromisified;
          if (!util.isIdentifier(suffix)) {
            throw new RangeError("suffix must be a valid identifier\n\n    See http://goo.gl/MqrFmX\n");
          }
          var keys = util.inheritedDataKeys(target);
          for (var i = 0; i < keys.length; ++i) {
            var value = target[keys[i]];
            if (keys[i] !== "constructor" && util.isClass(value)) {
              promisifyAll(
                value.prototype,
                suffix,
                filter,
                promisifier,
                multiArgs
              );
              promisifyAll(value, suffix, filter, promisifier, multiArgs);
            }
          }
          return promisifyAll(target, suffix, filter, promisifier, multiArgs);
        };
      };
    }, { "./errors": 12, "./nodeback": 20, "./util": 36 }], 25: [function(_dereq_2, module3, exports2) {
      module3.exports = function(Promise2, PromiseArray, tryConvertToPromise, apiRejection) {
        var util = _dereq_2("./util");
        var isObject2 = util.isObject;
        var es5 = _dereq_2("./es5");
        var Es6Map;
        if (typeof Map === "function")
          Es6Map = Map;
        var mapToEntries = function() {
          var index = 0;
          var size = 0;
          function extractEntry(value, key) {
            this[index] = value;
            this[index + size] = key;
            index++;
          }
          return function mapToEntries2(map) {
            size = map.size;
            index = 0;
            var ret = new Array(map.size * 2);
            map.forEach(extractEntry, ret);
            return ret;
          };
        }();
        var entriesToMap = function(entries) {
          var ret = new Es6Map();
          var length = entries.length / 2 | 0;
          for (var i = 0; i < length; ++i) {
            var key = entries[length + i];
            var value = entries[i];
            ret.set(key, value);
          }
          return ret;
        };
        function PropertiesPromiseArray(obj) {
          var isMap2 = false;
          var entries;
          if (Es6Map !== void 0 && obj instanceof Es6Map) {
            entries = mapToEntries(obj);
            isMap2 = true;
          } else {
            var keys = es5.keys(obj);
            var len = keys.length;
            entries = new Array(len * 2);
            for (var i = 0; i < len; ++i) {
              var key = keys[i];
              entries[i] = obj[key];
              entries[i + len] = key;
            }
          }
          this.constructor$(entries);
          this._isMap = isMap2;
          this._init$(void 0, isMap2 ? -6 : -3);
        }
        util.inherits(PropertiesPromiseArray, PromiseArray);
        PropertiesPromiseArray.prototype._init = function() {
        };
        PropertiesPromiseArray.prototype._promiseFulfilled = function(value, index) {
          this._values[index] = value;
          var totalResolved = ++this._totalResolved;
          if (totalResolved >= this._length) {
            var val;
            if (this._isMap) {
              val = entriesToMap(this._values);
            } else {
              val = {};
              var keyOffset = this.length();
              for (var i = 0, len = this.length(); i < len; ++i) {
                val[this._values[i + keyOffset]] = this._values[i];
              }
            }
            this._resolve(val);
            return true;
          }
          return false;
        };
        PropertiesPromiseArray.prototype.shouldCopyValues = function() {
          return false;
        };
        PropertiesPromiseArray.prototype.getActualLength = function(len) {
          return len >> 1;
        };
        function props(promises) {
          var ret;
          var castValue = tryConvertToPromise(promises);
          if (!isObject2(castValue)) {
            return apiRejection("cannot await properties of a non-object\n\n    See http://goo.gl/MqrFmX\n");
          } else if (castValue instanceof Promise2) {
            ret = castValue._then(
              Promise2.props,
              void 0,
              void 0,
              void 0,
              void 0
            );
          } else {
            ret = new PropertiesPromiseArray(castValue).promise();
          }
          if (castValue instanceof Promise2) {
            ret._propagateFrom(castValue, 2);
          }
          return ret;
        }
        Promise2.prototype.props = function() {
          return props(this);
        };
        Promise2.props = function(promises) {
          return props(promises);
        };
      };
    }, { "./es5": 13, "./util": 36 }], 26: [function(_dereq_2, module3, exports2) {
      function arrayMove(src2, srcIndex, dst, dstIndex, len) {
        for (var j = 0; j < len; ++j) {
          dst[j + dstIndex] = src2[j + srcIndex];
          src2[j + srcIndex] = void 0;
        }
      }
      function Queue(capacity) {
        this._capacity = capacity;
        this._length = 0;
        this._front = 0;
      }
      Queue.prototype._willBeOverCapacity = function(size) {
        return this._capacity < size;
      };
      Queue.prototype._pushOne = function(arg) {
        var length = this.length();
        this._checkCapacity(length + 1);
        var i = this._front + length & this._capacity - 1;
        this[i] = arg;
        this._length = length + 1;
      };
      Queue.prototype.push = function(fn, receiver, arg) {
        var length = this.length() + 3;
        if (this._willBeOverCapacity(length)) {
          this._pushOne(fn);
          this._pushOne(receiver);
          this._pushOne(arg);
          return;
        }
        var j = this._front + length - 3;
        this._checkCapacity(length);
        var wrapMask = this._capacity - 1;
        this[j + 0 & wrapMask] = fn;
        this[j + 1 & wrapMask] = receiver;
        this[j + 2 & wrapMask] = arg;
        this._length = length;
      };
      Queue.prototype.shift = function() {
        var front = this._front, ret = this[front];
        this[front] = void 0;
        this._front = front + 1 & this._capacity - 1;
        this._length--;
        return ret;
      };
      Queue.prototype.length = function() {
        return this._length;
      };
      Queue.prototype._checkCapacity = function(size) {
        if (this._capacity < size) {
          this._resizeTo(this._capacity << 1);
        }
      };
      Queue.prototype._resizeTo = function(capacity) {
        var oldCapacity = this._capacity;
        this._capacity = capacity;
        var front = this._front;
        var length = this._length;
        var moveItemsCount = front + length & oldCapacity - 1;
        arrayMove(this, 0, this, oldCapacity, moveItemsCount);
      };
      module3.exports = Queue;
    }, {}], 27: [function(_dereq_2, module3, exports2) {
      module3.exports = function(Promise2, INTERNAL, tryConvertToPromise, apiRejection) {
        var util = _dereq_2("./util");
        var raceLater = function(promise) {
          return promise.then(function(array) {
            return race(array, promise);
          });
        };
        function race(promises, parent) {
          var maybePromise = tryConvertToPromise(promises);
          if (maybePromise instanceof Promise2) {
            return raceLater(maybePromise);
          } else {
            promises = util.asArray(promises);
            if (promises === null)
              return apiRejection("expecting an array or an iterable object but got " + util.classString(promises));
          }
          var ret = new Promise2(INTERNAL);
          if (parent !== void 0) {
            ret._propagateFrom(parent, 3);
          }
          var fulfill = ret._fulfill;
          var reject = ret._reject;
          for (var i = 0, len = promises.length; i < len; ++i) {
            var val = promises[i];
            if (val === void 0 && !(i in promises)) {
              continue;
            }
            Promise2.cast(val)._then(fulfill, reject, void 0, ret, null);
          }
          return ret;
        }
        Promise2.race = function(promises) {
          return race(promises, void 0);
        };
        Promise2.prototype.race = function() {
          return race(this, void 0);
        };
      };
    }, { "./util": 36 }], 28: [function(_dereq_2, module3, exports2) {
      module3.exports = function(Promise2, PromiseArray, apiRejection, tryConvertToPromise, INTERNAL, debug) {
        var util = _dereq_2("./util");
        var tryCatch = util.tryCatch;
        function ReductionPromiseArray(promises, fn, initialValue, _each) {
          this.constructor$(promises);
          var context = Promise2._getContext();
          this._fn = util.contextBind(context, fn);
          if (initialValue !== void 0) {
            initialValue = Promise2.resolve(initialValue);
            initialValue._attachCancellationCallback(this);
          }
          this._initialValue = initialValue;
          this._currentCancellable = null;
          if (_each === INTERNAL) {
            this._eachValues = Array(this._length);
          } else if (_each === 0) {
            this._eachValues = null;
          } else {
            this._eachValues = void 0;
          }
          this._promise._captureStackTrace();
          this._init$(void 0, -5);
        }
        util.inherits(ReductionPromiseArray, PromiseArray);
        ReductionPromiseArray.prototype._gotAccum = function(accum) {
          if (this._eachValues !== void 0 && this._eachValues !== null && accum !== INTERNAL) {
            this._eachValues.push(accum);
          }
        };
        ReductionPromiseArray.prototype._eachComplete = function(value) {
          if (this._eachValues !== null) {
            this._eachValues.push(value);
          }
          return this._eachValues;
        };
        ReductionPromiseArray.prototype._init = function() {
        };
        ReductionPromiseArray.prototype._resolveEmptyArray = function() {
          this._resolve(this._eachValues !== void 0 ? this._eachValues : this._initialValue);
        };
        ReductionPromiseArray.prototype.shouldCopyValues = function() {
          return false;
        };
        ReductionPromiseArray.prototype._resolve = function(value) {
          this._promise._resolveCallback(value);
          this._values = null;
        };
        ReductionPromiseArray.prototype._resultCancelled = function(sender) {
          if (sender === this._initialValue)
            return this._cancel();
          if (this._isResolved())
            return;
          this._resultCancelled$();
          if (this._currentCancellable instanceof Promise2) {
            this._currentCancellable.cancel();
          }
          if (this._initialValue instanceof Promise2) {
            this._initialValue.cancel();
          }
        };
        ReductionPromiseArray.prototype._iterate = function(values) {
          this._values = values;
          var value;
          var i;
          var length = values.length;
          if (this._initialValue !== void 0) {
            value = this._initialValue;
            i = 0;
          } else {
            value = Promise2.resolve(values[0]);
            i = 1;
          }
          this._currentCancellable = value;
          for (var j = i; j < length; ++j) {
            var maybePromise = values[j];
            if (maybePromise instanceof Promise2) {
              maybePromise.suppressUnhandledRejections();
            }
          }
          if (!value.isRejected()) {
            for (; i < length; ++i) {
              var ctx = {
                accum: null,
                value: values[i],
                index: i,
                length,
                array: this
              };
              value = value._then(gotAccum, void 0, void 0, ctx, void 0);
              if ((i & 127) === 0) {
                value._setNoAsyncGuarantee();
              }
            }
          }
          if (this._eachValues !== void 0) {
            value = value._then(this._eachComplete, void 0, void 0, this, void 0);
          }
          value._then(completed, completed, void 0, value, this);
        };
        Promise2.prototype.reduce = function(fn, initialValue) {
          return reduce(this, fn, initialValue, null);
        };
        Promise2.reduce = function(promises, fn, initialValue, _each) {
          return reduce(promises, fn, initialValue, _each);
        };
        function completed(valueOrReason, array) {
          if (this.isFulfilled()) {
            array._resolve(valueOrReason);
          } else {
            array._reject(valueOrReason);
          }
        }
        function reduce(promises, fn, initialValue, _each) {
          if (typeof fn !== "function") {
            return apiRejection("expecting a function but got " + util.classString(fn));
          }
          var array = new ReductionPromiseArray(promises, fn, initialValue, _each);
          return array.promise();
        }
        function gotAccum(accum) {
          this.accum = accum;
          this.array._gotAccum(accum);
          var value = tryConvertToPromise(this.value, this.array._promise);
          if (value instanceof Promise2) {
            this.array._currentCancellable = value;
            return value._then(gotValue, void 0, void 0, this, void 0);
          } else {
            return gotValue.call(this, value);
          }
        }
        function gotValue(value) {
          var array = this.array;
          var promise = array._promise;
          var fn = tryCatch(array._fn);
          promise._pushContext();
          var ret;
          if (array._eachValues !== void 0) {
            ret = fn.call(promise._boundValue(), value, this.index, this.length);
          } else {
            ret = fn.call(
              promise._boundValue(),
              this.accum,
              value,
              this.index,
              this.length
            );
          }
          if (ret instanceof Promise2) {
            array._currentCancellable = ret;
          }
          var promiseCreated = promise._popContext();
          debug.checkForgottenReturns(
            ret,
            promiseCreated,
            array._eachValues !== void 0 ? "Promise.each" : "Promise.reduce",
            promise
          );
          return ret;
        }
      };
    }, { "./util": 36 }], 29: [function(_dereq_2, module3, exports2) {
      var util = _dereq_2("./util");
      var schedule;
      var noAsyncScheduler = function() {
        throw new Error("No async scheduler available\n\n    See http://goo.gl/MqrFmX\n");
      };
      var NativePromise = util.getNativePromise();
      if (util.isNode && typeof MutationObserver === "undefined") {
        var GlobalSetImmediate = commonjsGlobal.setImmediate;
        var ProcessNextTick = process.nextTick;
        schedule = util.isRecentNode ? function(fn) {
          GlobalSetImmediate.call(commonjsGlobal, fn);
        } : function(fn) {
          ProcessNextTick.call(process, fn);
        };
      } else if (typeof NativePromise === "function" && typeof NativePromise.resolve === "function") {
        var nativePromise = NativePromise.resolve();
        schedule = function(fn) {
          nativePromise.then(fn);
        };
      } else if (typeof MutationObserver !== "undefined" && !(typeof window !== "undefined" && window.navigator && (window.navigator.standalone || window.cordova)) && "classList" in document.documentElement) {
        schedule = function() {
          var div = document.createElement("div");
          var opts = { attributes: true };
          var toggleScheduled = false;
          var div2 = document.createElement("div");
          var o2 = new MutationObserver(function() {
            div.classList.toggle("foo");
            toggleScheduled = false;
          });
          o2.observe(div2, opts);
          var scheduleToggle = function() {
            if (toggleScheduled)
              return;
            toggleScheduled = true;
            div2.classList.toggle("foo");
          };
          return function schedule2(fn) {
            var o = new MutationObserver(function() {
              o.disconnect();
              fn();
            });
            o.observe(div, opts);
            scheduleToggle();
          };
        }();
      } else if (typeof setImmediate !== "undefined") {
        schedule = function(fn) {
          setImmediate(fn);
        };
      } else if (typeof setTimeout !== "undefined") {
        schedule = function(fn) {
          setTimeout(fn, 0);
        };
      } else {
        schedule = noAsyncScheduler;
      }
      module3.exports = schedule;
    }, { "./util": 36 }], 30: [function(_dereq_2, module3, exports2) {
      module3.exports = function(Promise2, PromiseArray, debug) {
        var PromiseInspection = Promise2.PromiseInspection;
        var util = _dereq_2("./util");
        function SettledPromiseArray(values) {
          this.constructor$(values);
        }
        util.inherits(SettledPromiseArray, PromiseArray);
        SettledPromiseArray.prototype._promiseResolved = function(index, inspection) {
          this._values[index] = inspection;
          var totalResolved = ++this._totalResolved;
          if (totalResolved >= this._length) {
            this._resolve(this._values);
            return true;
          }
          return false;
        };
        SettledPromiseArray.prototype._promiseFulfilled = function(value, index) {
          var ret = new PromiseInspection();
          ret._bitField = 33554432;
          ret._settledValueField = value;
          return this._promiseResolved(index, ret);
        };
        SettledPromiseArray.prototype._promiseRejected = function(reason, index) {
          var ret = new PromiseInspection();
          ret._bitField = 16777216;
          ret._settledValueField = reason;
          return this._promiseResolved(index, ret);
        };
        Promise2.settle = function(promises) {
          debug.deprecated(".settle()", ".reflect()");
          return new SettledPromiseArray(promises).promise();
        };
        Promise2.allSettled = function(promises) {
          return new SettledPromiseArray(promises).promise();
        };
        Promise2.prototype.settle = function() {
          return Promise2.settle(this);
        };
      };
    }, { "./util": 36 }], 31: [function(_dereq_2, module3, exports2) {
      module3.exports = function(Promise2, PromiseArray, apiRejection) {
        var util = _dereq_2("./util");
        var RangeError2 = _dereq_2("./errors").RangeError;
        var AggregateError2 = _dereq_2("./errors").AggregateError;
        var isArray2 = util.isArray;
        var CANCELLATION = {};
        function SomePromiseArray(values) {
          this.constructor$(values);
          this._howMany = 0;
          this._unwrap = false;
          this._initialized = false;
        }
        util.inherits(SomePromiseArray, PromiseArray);
        SomePromiseArray.prototype._init = function() {
          if (!this._initialized) {
            return;
          }
          if (this._howMany === 0) {
            this._resolve([]);
            return;
          }
          this._init$(void 0, -5);
          var isArrayResolved = isArray2(this._values);
          if (!this._isResolved() && isArrayResolved && this._howMany > this._canPossiblyFulfill()) {
            this._reject(this._getRangeError(this.length()));
          }
        };
        SomePromiseArray.prototype.init = function() {
          this._initialized = true;
          this._init();
        };
        SomePromiseArray.prototype.setUnwrap = function() {
          this._unwrap = true;
        };
        SomePromiseArray.prototype.howMany = function() {
          return this._howMany;
        };
        SomePromiseArray.prototype.setHowMany = function(count) {
          this._howMany = count;
        };
        SomePromiseArray.prototype._promiseFulfilled = function(value) {
          this._addFulfilled(value);
          if (this._fulfilled() === this.howMany()) {
            this._values.length = this.howMany();
            if (this.howMany() === 1 && this._unwrap) {
              this._resolve(this._values[0]);
            } else {
              this._resolve(this._values);
            }
            return true;
          }
          return false;
        };
        SomePromiseArray.prototype._promiseRejected = function(reason) {
          this._addRejected(reason);
          return this._checkOutcome();
        };
        SomePromiseArray.prototype._promiseCancelled = function() {
          if (this._values instanceof Promise2 || this._values == null) {
            return this._cancel();
          }
          this._addRejected(CANCELLATION);
          return this._checkOutcome();
        };
        SomePromiseArray.prototype._checkOutcome = function() {
          if (this.howMany() > this._canPossiblyFulfill()) {
            var e = new AggregateError2();
            for (var i = this.length(); i < this._values.length; ++i) {
              if (this._values[i] !== CANCELLATION) {
                e.push(this._values[i]);
              }
            }
            if (e.length > 0) {
              this._reject(e);
            } else {
              this._cancel();
            }
            return true;
          }
          return false;
        };
        SomePromiseArray.prototype._fulfilled = function() {
          return this._totalResolved;
        };
        SomePromiseArray.prototype._rejected = function() {
          return this._values.length - this.length();
        };
        SomePromiseArray.prototype._addRejected = function(reason) {
          this._values.push(reason);
        };
        SomePromiseArray.prototype._addFulfilled = function(value) {
          this._values[this._totalResolved++] = value;
        };
        SomePromiseArray.prototype._canPossiblyFulfill = function() {
          return this.length() - this._rejected();
        };
        SomePromiseArray.prototype._getRangeError = function(count) {
          var message = "Input array must contain at least " + this._howMany + " items but contains only " + count + " items";
          return new RangeError2(message);
        };
        SomePromiseArray.prototype._resolveEmptyArray = function() {
          this._reject(this._getRangeError(0));
        };
        function some(promises, howMany) {
          if ((howMany | 0) !== howMany || howMany < 0) {
            return apiRejection("expecting a positive integer\n\n    See http://goo.gl/MqrFmX\n");
          }
          var ret = new SomePromiseArray(promises);
          var promise = ret.promise();
          ret.setHowMany(howMany);
          ret.init();
          return promise;
        }
        Promise2.some = function(promises, howMany) {
          return some(promises, howMany);
        };
        Promise2.prototype.some = function(howMany) {
          return some(this, howMany);
        };
        Promise2._SomePromiseArray = SomePromiseArray;
      };
    }, { "./errors": 12, "./util": 36 }], 32: [function(_dereq_2, module3, exports2) {
      module3.exports = function(Promise2) {
        function PromiseInspection(promise) {
          if (promise !== void 0) {
            promise = promise._target();
            this._bitField = promise._bitField;
            this._settledValueField = promise._isFateSealed() ? promise._settledValue() : void 0;
          } else {
            this._bitField = 0;
            this._settledValueField = void 0;
          }
        }
        PromiseInspection.prototype._settledValue = function() {
          return this._settledValueField;
        };
        var value = PromiseInspection.prototype.value = function() {
          if (!this.isFulfilled()) {
            throw new TypeError("cannot get fulfillment value of a non-fulfilled promise\n\n    See http://goo.gl/MqrFmX\n");
          }
          return this._settledValue();
        };
        var reason = PromiseInspection.prototype.error = PromiseInspection.prototype.reason = function() {
          if (!this.isRejected()) {
            throw new TypeError("cannot get rejection reason of a non-rejected promise\n\n    See http://goo.gl/MqrFmX\n");
          }
          return this._settledValue();
        };
        var isFulfilled = PromiseInspection.prototype.isFulfilled = function() {
          return (this._bitField & 33554432) !== 0;
        };
        var isRejected = PromiseInspection.prototype.isRejected = function() {
          return (this._bitField & 16777216) !== 0;
        };
        var isPending = PromiseInspection.prototype.isPending = function() {
          return (this._bitField & 50397184) === 0;
        };
        var isResolved = PromiseInspection.prototype.isResolved = function() {
          return (this._bitField & 50331648) !== 0;
        };
        PromiseInspection.prototype.isCancelled = function() {
          return (this._bitField & 8454144) !== 0;
        };
        Promise2.prototype.__isCancelled = function() {
          return (this._bitField & 65536) === 65536;
        };
        Promise2.prototype._isCancelled = function() {
          return this._target().__isCancelled();
        };
        Promise2.prototype.isCancelled = function() {
          return (this._target()._bitField & 8454144) !== 0;
        };
        Promise2.prototype.isPending = function() {
          return isPending.call(this._target());
        };
        Promise2.prototype.isRejected = function() {
          return isRejected.call(this._target());
        };
        Promise2.prototype.isFulfilled = function() {
          return isFulfilled.call(this._target());
        };
        Promise2.prototype.isResolved = function() {
          return isResolved.call(this._target());
        };
        Promise2.prototype.value = function() {
          return value.call(this._target());
        };
        Promise2.prototype.reason = function() {
          var target = this._target();
          target._unsetRejectionIsUnhandled();
          return reason.call(target);
        };
        Promise2.prototype._value = function() {
          return this._settledValue();
        };
        Promise2.prototype._reason = function() {
          this._unsetRejectionIsUnhandled();
          return this._settledValue();
        };
        Promise2.PromiseInspection = PromiseInspection;
      };
    }, {}], 33: [function(_dereq_2, module3, exports2) {
      module3.exports = function(Promise2, INTERNAL) {
        var util = _dereq_2("./util");
        var errorObj = util.errorObj;
        var isObject2 = util.isObject;
        function tryConvertToPromise(obj, context) {
          if (isObject2(obj)) {
            if (obj instanceof Promise2)
              return obj;
            var then = getThen(obj);
            if (then === errorObj) {
              if (context)
                context._pushContext();
              var ret = Promise2.reject(then.e);
              if (context)
                context._popContext();
              return ret;
            } else if (typeof then === "function") {
              if (isAnyBluebirdPromise(obj)) {
                var ret = new Promise2(INTERNAL);
                obj._then(
                  ret._fulfill,
                  ret._reject,
                  void 0,
                  ret,
                  null
                );
                return ret;
              }
              return doThenable(obj, then, context);
            }
          }
          return obj;
        }
        function doGetThen(obj) {
          return obj.then;
        }
        function getThen(obj) {
          try {
            return doGetThen(obj);
          } catch (e) {
            errorObj.e = e;
            return errorObj;
          }
        }
        var hasProp = {}.hasOwnProperty;
        function isAnyBluebirdPromise(obj) {
          try {
            return hasProp.call(obj, "_promise0");
          } catch (e) {
            return false;
          }
        }
        function doThenable(x, then, context) {
          var promise = new Promise2(INTERNAL);
          var ret = promise;
          if (context)
            context._pushContext();
          promise._captureStackTrace();
          if (context)
            context._popContext();
          var synchronous = true;
          var result = util.tryCatch(then).call(x, resolve, reject);
          synchronous = false;
          if (promise && result === errorObj) {
            promise._rejectCallback(result.e, true, true);
            promise = null;
          }
          function resolve(value) {
            if (!promise)
              return;
            promise._resolveCallback(value);
            promise = null;
          }
          function reject(reason) {
            if (!promise)
              return;
            promise._rejectCallback(reason, synchronous, true);
            promise = null;
          }
          return ret;
        }
        return tryConvertToPromise;
      };
    }, { "./util": 36 }], 34: [function(_dereq_2, module3, exports2) {
      module3.exports = function(Promise2, INTERNAL, debug) {
        var util = _dereq_2("./util");
        var TimeoutError = Promise2.TimeoutError;
        function HandleWrapper(handle) {
          this.handle = handle;
        }
        HandleWrapper.prototype._resultCancelled = function() {
          clearTimeout(this.handle);
        };
        var afterValue = function(value) {
          return delay(+this).thenReturn(value);
        };
        var delay = Promise2.delay = function(ms, value) {
          var ret;
          var handle;
          if (value !== void 0) {
            ret = Promise2.resolve(value)._then(afterValue, null, null, ms, void 0);
            if (debug.cancellation() && value instanceof Promise2) {
              ret._setOnCancel(value);
            }
          } else {
            ret = new Promise2(INTERNAL);
            handle = setTimeout(function() {
              ret._fulfill();
            }, +ms);
            if (debug.cancellation()) {
              ret._setOnCancel(new HandleWrapper(handle));
            }
            ret._captureStackTrace();
          }
          ret._setAsyncGuaranteed();
          return ret;
        };
        Promise2.prototype.delay = function(ms) {
          return delay(ms, this);
        };
        var afterTimeout = function(promise, message, parent) {
          var err;
          if (typeof message !== "string") {
            if (message instanceof Error) {
              err = message;
            } else {
              err = new TimeoutError("operation timed out");
            }
          } else {
            err = new TimeoutError(message);
          }
          util.markAsOriginatingFromRejection(err);
          promise._attachExtraTrace(err);
          promise._reject(err);
          if (parent != null) {
            parent.cancel();
          }
        };
        function successClear(value) {
          clearTimeout(this.handle);
          return value;
        }
        function failureClear(reason) {
          clearTimeout(this.handle);
          throw reason;
        }
        Promise2.prototype.timeout = function(ms, message) {
          ms = +ms;
          var ret, parent;
          var handleWrapper = new HandleWrapper(setTimeout(function timeoutTimeout() {
            if (ret.isPending()) {
              afterTimeout(ret, message, parent);
            }
          }, ms));
          if (debug.cancellation()) {
            parent = this.then();
            ret = parent._then(
              successClear,
              failureClear,
              void 0,
              handleWrapper,
              void 0
            );
            ret._setOnCancel(handleWrapper);
          } else {
            ret = this._then(
              successClear,
              failureClear,
              void 0,
              handleWrapper,
              void 0
            );
          }
          return ret;
        };
      };
    }, { "./util": 36 }], 35: [function(_dereq_2, module3, exports2) {
      module3.exports = function(Promise2, apiRejection, tryConvertToPromise, createContext, INTERNAL, debug) {
        var util = _dereq_2("./util");
        var TypeError2 = _dereq_2("./errors").TypeError;
        var inherits = _dereq_2("./util").inherits;
        var errorObj = util.errorObj;
        var tryCatch = util.tryCatch;
        var NULL = {};
        function thrower(e) {
          setTimeout(function() {
            throw e;
          }, 0);
        }
        function castPreservingDisposable(thenable) {
          var maybePromise = tryConvertToPromise(thenable);
          if (maybePromise !== thenable && typeof thenable._isDisposable === "function" && typeof thenable._getDisposer === "function" && thenable._isDisposable()) {
            maybePromise._setDisposable(thenable._getDisposer());
          }
          return maybePromise;
        }
        function dispose(resources, inspection) {
          var i = 0;
          var len = resources.length;
          var ret = new Promise2(INTERNAL);
          function iterator() {
            if (i >= len)
              return ret._fulfill();
            var maybePromise = castPreservingDisposable(resources[i++]);
            if (maybePromise instanceof Promise2 && maybePromise._isDisposable()) {
              try {
                maybePromise = tryConvertToPromise(
                  maybePromise._getDisposer().tryDispose(inspection),
                  resources.promise
                );
              } catch (e) {
                return thrower(e);
              }
              if (maybePromise instanceof Promise2) {
                return maybePromise._then(
                  iterator,
                  thrower,
                  null,
                  null,
                  null
                );
              }
            }
            iterator();
          }
          iterator();
          return ret;
        }
        function Disposer(data, promise, context) {
          this._data = data;
          this._promise = promise;
          this._context = context;
        }
        Disposer.prototype.data = function() {
          return this._data;
        };
        Disposer.prototype.promise = function() {
          return this._promise;
        };
        Disposer.prototype.resource = function() {
          if (this.promise().isFulfilled()) {
            return this.promise().value();
          }
          return NULL;
        };
        Disposer.prototype.tryDispose = function(inspection) {
          var resource = this.resource();
          var context = this._context;
          if (context !== void 0)
            context._pushContext();
          var ret = resource !== NULL ? this.doDispose(resource, inspection) : null;
          if (context !== void 0)
            context._popContext();
          this._promise._unsetDisposable();
          this._data = null;
          return ret;
        };
        Disposer.isDisposer = function(d) {
          return d != null && typeof d.resource === "function" && typeof d.tryDispose === "function";
        };
        function FunctionDisposer(fn, promise, context) {
          this.constructor$(fn, promise, context);
        }
        inherits(FunctionDisposer, Disposer);
        FunctionDisposer.prototype.doDispose = function(resource, inspection) {
          var fn = this.data();
          return fn.call(resource, resource, inspection);
        };
        function maybeUnwrapDisposer(value) {
          if (Disposer.isDisposer(value)) {
            this.resources[this.index]._setDisposable(value);
            return value.promise();
          }
          return value;
        }
        function ResourceList(length) {
          this.length = length;
          this.promise = null;
          this[length - 1] = null;
        }
        ResourceList.prototype._resultCancelled = function() {
          var len = this.length;
          for (var i = 0; i < len; ++i) {
            var item = this[i];
            if (item instanceof Promise2) {
              item.cancel();
            }
          }
        };
        Promise2.using = function() {
          var len = arguments.length;
          if (len < 2)
            return apiRejection(
              "you must pass at least 2 arguments to Promise.using"
            );
          var fn = arguments[len - 1];
          if (typeof fn !== "function") {
            return apiRejection("expecting a function but got " + util.classString(fn));
          }
          var input;
          var spreadArgs = true;
          if (len === 2 && Array.isArray(arguments[0])) {
            input = arguments[0];
            len = input.length;
            spreadArgs = false;
          } else {
            input = arguments;
            len--;
          }
          var resources = new ResourceList(len);
          for (var i = 0; i < len; ++i) {
            var resource = input[i];
            if (Disposer.isDisposer(resource)) {
              var disposer = resource;
              resource = resource.promise();
              resource._setDisposable(disposer);
            } else {
              var maybePromise = tryConvertToPromise(resource);
              if (maybePromise instanceof Promise2) {
                resource = maybePromise._then(maybeUnwrapDisposer, null, null, {
                  resources,
                  index: i
                }, void 0);
              }
            }
            resources[i] = resource;
          }
          var reflectedResources = new Array(resources.length);
          for (var i = 0; i < reflectedResources.length; ++i) {
            reflectedResources[i] = Promise2.resolve(resources[i]).reflect();
          }
          var resultPromise = Promise2.all(reflectedResources).then(function(inspections) {
            for (var i2 = 0; i2 < inspections.length; ++i2) {
              var inspection = inspections[i2];
              if (inspection.isRejected()) {
                errorObj.e = inspection.error();
                return errorObj;
              } else if (!inspection.isFulfilled()) {
                resultPromise.cancel();
                return;
              }
              inspections[i2] = inspection.value();
            }
            promise._pushContext();
            fn = tryCatch(fn);
            var ret = spreadArgs ? fn.apply(void 0, inspections) : fn(inspections);
            var promiseCreated = promise._popContext();
            debug.checkForgottenReturns(
              ret,
              promiseCreated,
              "Promise.using",
              promise
            );
            return ret;
          });
          var promise = resultPromise.lastly(function() {
            var inspection = new Promise2.PromiseInspection(resultPromise);
            return dispose(resources, inspection);
          });
          resources.promise = promise;
          promise._setOnCancel(resources);
          return promise;
        };
        Promise2.prototype._setDisposable = function(disposer) {
          this._bitField = this._bitField | 131072;
          this._disposer = disposer;
        };
        Promise2.prototype._isDisposable = function() {
          return (this._bitField & 131072) > 0;
        };
        Promise2.prototype._getDisposer = function() {
          return this._disposer;
        };
        Promise2.prototype._unsetDisposable = function() {
          this._bitField = this._bitField & ~131072;
          this._disposer = void 0;
        };
        Promise2.prototype.disposer = function(fn) {
          if (typeof fn === "function") {
            return new FunctionDisposer(fn, this, createContext());
          }
          throw new TypeError2();
        };
      };
    }, { "./errors": 12, "./util": 36 }], 36: [function(_dereq_2, module3, exports2) {
      var es5 = _dereq_2("./es5");
      var canEvaluate = typeof navigator == "undefined";
      var errorObj = { e: {} };
      var tryCatchTarget;
      var globalObject = typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof commonjsGlobal !== "undefined" ? commonjsGlobal : this !== void 0 ? this : null;
      function tryCatcher() {
        try {
          var target = tryCatchTarget;
          tryCatchTarget = null;
          return target.apply(this, arguments);
        } catch (e) {
          errorObj.e = e;
          return errorObj;
        }
      }
      function tryCatch(fn) {
        tryCatchTarget = fn;
        return tryCatcher;
      }
      var inherits = function(Child, Parent) {
        var hasProp = {}.hasOwnProperty;
        function T() {
          this.constructor = Child;
          this.constructor$ = Parent;
          for (var propertyName in Parent.prototype) {
            if (hasProp.call(Parent.prototype, propertyName) && propertyName.charAt(propertyName.length - 1) !== "$") {
              this[propertyName + "$"] = Parent.prototype[propertyName];
            }
          }
        }
        T.prototype = Parent.prototype;
        Child.prototype = new T();
        return Child.prototype;
      };
      function isPrimitive(val) {
        return val == null || val === true || val === false || typeof val === "string" || typeof val === "number";
      }
      function isObject2(value) {
        return typeof value === "function" || typeof value === "object" && value !== null;
      }
      function maybeWrapAsError(maybeError) {
        if (!isPrimitive(maybeError))
          return maybeError;
        return new Error(safeToString(maybeError));
      }
      function withAppended(target, appendee) {
        var len = target.length;
        var ret2 = new Array(len + 1);
        var i;
        for (i = 0; i < len; ++i) {
          ret2[i] = target[i];
        }
        ret2[i] = appendee;
        return ret2;
      }
      function getDataPropertyOrDefault(obj, key, defaultValue) {
        if (es5.isES5) {
          var desc = Object.getOwnPropertyDescriptor(obj, key);
          if (desc != null) {
            return desc.get == null && desc.set == null ? desc.value : defaultValue;
          }
        } else {
          return {}.hasOwnProperty.call(obj, key) ? obj[key] : void 0;
        }
      }
      function notEnumerableProp(obj, name, value) {
        if (isPrimitive(obj))
          return obj;
        var descriptor = {
          value,
          configurable: true,
          enumerable: false,
          writable: true
        };
        es5.defineProperty(obj, name, descriptor);
        return obj;
      }
      function thrower(r) {
        throw r;
      }
      var inheritedDataKeys = function() {
        var excludedPrototypes = [
          Array.prototype,
          Object.prototype,
          Function.prototype
        ];
        var isExcludedProto = function(val) {
          for (var i = 0; i < excludedPrototypes.length; ++i) {
            if (excludedPrototypes[i] === val) {
              return true;
            }
          }
          return false;
        };
        if (es5.isES5) {
          var getKeys = Object.getOwnPropertyNames;
          return function(obj) {
            var ret2 = [];
            var visitedKeys = /* @__PURE__ */ Object.create(null);
            while (obj != null && !isExcludedProto(obj)) {
              var keys;
              try {
                keys = getKeys(obj);
              } catch (e) {
                return ret2;
              }
              for (var i = 0; i < keys.length; ++i) {
                var key = keys[i];
                if (visitedKeys[key])
                  continue;
                visitedKeys[key] = true;
                var desc = Object.getOwnPropertyDescriptor(obj, key);
                if (desc != null && desc.get == null && desc.set == null) {
                  ret2.push(key);
                }
              }
              obj = es5.getPrototypeOf(obj);
            }
            return ret2;
          };
        } else {
          var hasProp = {}.hasOwnProperty;
          return function(obj) {
            if (isExcludedProto(obj))
              return [];
            var ret2 = [];
            enumeration:
              for (var key in obj) {
                if (hasProp.call(obj, key)) {
                  ret2.push(key);
                } else {
                  for (var i = 0; i < excludedPrototypes.length; ++i) {
                    if (hasProp.call(excludedPrototypes[i], key)) {
                      continue enumeration;
                    }
                  }
                  ret2.push(key);
                }
              }
            return ret2;
          };
        }
      }();
      var thisAssignmentPattern = /this\s*\.\s*\S+\s*=/;
      function isClass(fn) {
        try {
          if (typeof fn === "function") {
            var keys = es5.names(fn.prototype);
            var hasMethods = es5.isES5 && keys.length > 1;
            var hasMethodsOtherThanConstructor = keys.length > 0 && !(keys.length === 1 && keys[0] === "constructor");
            var hasThisAssignmentAndStaticMethods = thisAssignmentPattern.test(fn + "") && es5.names(fn).length > 0;
            if (hasMethods || hasMethodsOtherThanConstructor || hasThisAssignmentAndStaticMethods) {
              return true;
            }
          }
          return false;
        } catch (e) {
          return false;
        }
      }
      function toFastProperties(obj) {
        function FakeConstructor() {
        }
        FakeConstructor.prototype = obj;
        var receiver = new FakeConstructor();
        function ic() {
          return typeof receiver.foo;
        }
        ic();
        ic();
        return obj;
      }
      var rident = /^[a-z$_][a-z$_0-9]*$/i;
      function isIdentifier(str) {
        return rident.test(str);
      }
      function filledRange(count, prefix, suffix) {
        var ret2 = new Array(count);
        for (var i = 0; i < count; ++i) {
          ret2[i] = prefix + i + suffix;
        }
        return ret2;
      }
      function safeToString(obj) {
        try {
          return obj + "";
        } catch (e) {
          return "[no string representation]";
        }
      }
      function isError2(obj) {
        return obj instanceof Error || obj !== null && typeof obj === "object" && typeof obj.message === "string" && typeof obj.name === "string";
      }
      function markAsOriginatingFromRejection(e) {
        try {
          notEnumerableProp(e, "isOperational", true);
        } catch (ignore) {
        }
      }
      function originatesFromRejection(e) {
        if (e == null)
          return false;
        return e instanceof Error["__BluebirdErrorTypes__"].OperationalError || e["isOperational"] === true;
      }
      function canAttachTrace(obj) {
        return isError2(obj) && es5.propertyIsWritable(obj, "stack");
      }
      var ensureErrorObject = function() {
        if (!("stack" in new Error())) {
          return function(value) {
            if (canAttachTrace(value))
              return value;
            try {
              throw new Error(safeToString(value));
            } catch (err) {
              return err;
            }
          };
        } else {
          return function(value) {
            if (canAttachTrace(value))
              return value;
            return new Error(safeToString(value));
          };
        }
      }();
      function classString(obj) {
        return {}.toString.call(obj);
      }
      function copyDescriptors(from, to, filter) {
        var keys = es5.names(from);
        for (var i = 0; i < keys.length; ++i) {
          var key = keys[i];
          if (filter(key)) {
            try {
              es5.defineProperty(to, key, es5.getDescriptor(from, key));
            } catch (ignore) {
            }
          }
        }
      }
      var asArray = function(v) {
        if (es5.isArray(v)) {
          return v;
        }
        return null;
      };
      if (typeof Symbol !== "undefined" && Symbol.iterator) {
        var ArrayFrom = typeof Array.from === "function" ? function(v) {
          return Array.from(v);
        } : function(v) {
          var ret2 = [];
          var it = v[Symbol.iterator]();
          var itResult;
          while (!(itResult = it.next()).done) {
            ret2.push(itResult.value);
          }
          return ret2;
        };
        asArray = function(v) {
          if (es5.isArray(v)) {
            return v;
          } else if (v != null && typeof v[Symbol.iterator] === "function") {
            return ArrayFrom(v);
          }
          return null;
        };
      }
      var isNode = typeof process !== "undefined" && classString(process).toLowerCase() === "[object process]";
      var hasEnvVariables = typeof process !== "undefined" && typeof process.env !== "undefined";
      function env(key) {
        return hasEnvVariables ? process.env[key] : void 0;
      }
      function getNativePromise() {
        if (typeof Promise === "function") {
          try {
            var promise = new Promise(function() {
            });
            if (classString(promise) === "[object Promise]") {
              return Promise;
            }
          } catch (e) {
          }
        }
      }
      var reflectHandler;
      function contextBind(ctx, cb) {
        if (ctx === null || typeof cb !== "function" || cb === reflectHandler) {
          return cb;
        }
        if (ctx.domain !== null) {
          cb = ctx.domain.bind(cb);
        }
        var async = ctx.async;
        if (async !== null) {
          var old = cb;
          cb = function() {
            var args = new Array(2).concat([].slice.call(arguments));
            args[0] = old;
            args[1] = this;
            return async.runInAsyncScope.apply(async, args);
          };
        }
        return cb;
      }
      var ret = {
        setReflectHandler: function(fn) {
          reflectHandler = fn;
        },
        isClass,
        isIdentifier,
        inheritedDataKeys,
        getDataPropertyOrDefault,
        thrower,
        isArray: es5.isArray,
        asArray,
        notEnumerableProp,
        isPrimitive,
        isObject: isObject2,
        isError: isError2,
        canEvaluate,
        errorObj,
        tryCatch,
        inherits,
        withAppended,
        maybeWrapAsError,
        toFastProperties,
        filledRange,
        toString: safeToString,
        canAttachTrace,
        ensureErrorObject,
        originatesFromRejection,
        markAsOriginatingFromRejection,
        classString,
        copyDescriptors,
        isNode,
        hasEnvVariables,
        env,
        global: globalObject,
        getNativePromise,
        contextBind
      };
      ret.isRecentNode = ret.isNode && function() {
        var version;
        if (process.versions && process.versions.node) {
          version = process.versions.node.split(".").map(Number);
        } else if (process.version) {
          version = process.version.split(".").map(Number);
        }
        return version[0] === 0 && version[1] > 10 || version[0] > 0;
      }();
      ret.nodeSupportsAsyncResource = ret.isNode && function() {
        var supportsAsync = false;
        try {
          var res = _dereq_2("async_hooks").AsyncResource;
          supportsAsync = typeof res.prototype.runInAsyncScope === "function";
        } catch (e) {
          supportsAsync = false;
        }
        return supportsAsync;
      }();
      if (ret.isNode)
        ret.toFastProperties(process);
      try {
        throw new Error();
      } catch (e) {
        ret.lastLineError = e;
      }
      module3.exports = ret;
    }, { "./es5": 13, "async_hooks": void 0 }] }, {}, [4])(4);
  });
  if (typeof window !== "undefined" && window !== null) {
    window.P = window.Promise;
  } else if (typeof self !== "undefined" && self !== null) {
    self.P = self.Promise;
  }
})(bluebird);
const Promise$1 = bluebird.exports;
const orsUtil$4 = new OrsUtil();
class OrsBase {
  constructor(args) {
    this.defaultArgs = {};
    this.requestArgs = {};
    this.argsCache = null;
    this.customHeaders = [];
    this._setRequestDefaults(args);
  }
  _setRequestDefaults(args) {
    this.defaultArgs[constants.propNames.host] = constants.defaultHost;
    if (args[constants.propNames.host]) {
      this.defaultArgs[constants.propNames.host] = args[constants.propNames.host];
    }
    if (args[constants.propNames.service]) {
      this.defaultArgs[constants.propNames.service] = args[constants.propNames.service];
    }
    if (constants.propNames.apiKey in args) {
      this.defaultArgs[constants.propNames.apiKey] = args[constants.propNames.apiKey];
    } else {
      console.error(constants.missingAPIKeyMsg);
      throw new Error(constants.missingAPIKeyMsg);
    }
  }
  checkHeaders() {
    if (this.requestArgs.customHeaders) {
      this.customHeaders = this.requestArgs.customHeaders;
      delete this.requestArgs.customHeaders;
    }
  }
  createRequest(body, resolve, reject) {
    let url = orsUtil$4.prepareUrl(this.argsCache);
    if (this.argsCache[constants.propNames.service] === "pois") {
      url += url.indexOf("?") > -1 ? "&" : "?";
    }
    const authorization = this.argsCache[constants.propNames.apiKey];
    const timeout = this.defaultArgs[constants.propNames.timeout] || 1e4;
    const orsRequest = request.post(url).send(body).set("Authorization", authorization).timeout(timeout);
    for (const key in this.customHeaders) {
      orsRequest.set(key, this.customHeaders[key]);
    }
    orsRequest.end(function(err, res) {
      if (err || !res.ok) {
        console.error(err);
        reject(err);
      } else if (res) {
        resolve(res.body || res.text);
      }
    });
  }
  getBody() {
    return this.httpArgs;
  }
  calculate(reqArgs) {
    this.requestArgs = reqArgs;
    this.checkHeaders();
    this.requestArgs = orsUtil$4.fillArgs(this.defaultArgs, this.requestArgs);
    const that = this;
    return new Promise$1(function(resolve, reject) {
      if (that.requestArgs[constants.propNames.apiVersion] === constants.defaultAPIVersion) {
        that.argsCache = orsUtil$4.saveArgsToCache(that.requestArgs);
        that.httpArgs = orsUtil$4.prepareRequest(that.requestArgs);
        const postBody = that.getBody(that.httpArgs);
        that.createRequest(postBody, resolve, reject);
      } else {
        console.error(constants.useAPIV2Msg);
      }
    });
  }
}
const orsUtil$3 = new OrsUtil();
class OrsGeocode extends OrsBase {
  constructor(args) {
    super(args);
    this.lookupParameter = {
      api_key: function(key, val) {
        return key + "=" + val;
      },
      text: function(key, val) {
        return "&" + key + "=" + encodeURIComponent(val);
      },
      focus_point: function(key, val) {
        let urlParams = "";
        urlParams += "&focus.point.lon=" + val[1];
        urlParams += "&focus.point.lat=" + val[0];
        return urlParams;
      },
      boundary_bbox: function(key, val) {
        let urlParams = "";
        urlParams += "&boundary.rect.min_lon=" + val[0][1];
        urlParams += "&boundary.rect.min_lat=" + val[0][0];
        urlParams += "&boundary.rect.max_lon=" + val[1][1];
        urlParams += "&boundary.rect.max_lat=" + val[1][0];
        return urlParams;
      },
      point: function(key, val) {
        if (val && Array.isArray(val.lat_lng)) {
          let urlParams = "";
          urlParams += "&point.lon=" + val.lat_lng[1];
          urlParams += "&point.lat=" + val.lat_lng[0];
          return urlParams;
        }
      },
      boundary_circle: function(key, val) {
        let urlParams = "";
        urlParams += "&boundary.circle.lon=" + val.lat_lng[1];
        urlParams += "&boundary.circle.lat=" + val.lat_lng[0];
        urlParams += "&boundary.circle.radius=" + val.radius;
        return urlParams;
      },
      sources: function(key, val) {
        let urlParams = "&sources=";
        if (val) {
          for (const key2 in val) {
            if (Number(key2) > 0) {
              urlParams += ",";
            }
            urlParams += val[key2];
          }
          return urlParams;
        }
      },
      layers: function(key, val) {
        let urlParams = "&layers=";
        let counter = 0;
        for (key in val) {
          if (counter > 0) {
            urlParams += ",";
          }
          urlParams += val[key];
          counter++;
        }
        return urlParams;
      },
      boundary_country: function(key, val) {
        return "&boundary.country=" + val;
      },
      size: function(key, val) {
        return "&" + key + "=" + val;
      },
      address: function(key, val) {
        return "&" + key + "=" + val;
      },
      neighbourhood: function(key, val) {
        return "&" + key + "=" + val;
      },
      borough: function(key, val) {
        return "&" + key + "=" + val;
      },
      locality: function(key, val) {
        return "&" + key + "=" + val;
      },
      county: function(key, val) {
        return "&" + key + "=" + val;
      },
      region: function(key, val) {
        return "&" + key + "=" + val;
      },
      postalcode: function(key, val) {
        return "&" + key + "=" + val;
      },
      country: function(key, val) {
        return "&" + key + "=" + val;
      }
    };
  }
  clear() {
    for (const variable in this.defaultArgs) {
      if (variable !== constants.propNames.apiKey)
        delete this.defaultArgs[variable];
    }
  }
  getParametersAsQueryString(args) {
    let queryString = "";
    for (const key in args) {
      const val = args[key];
      if (constants.baseUrlConstituents.indexOf(key) <= -1) {
        queryString += this.lookupParameter[key](key, val);
      }
    }
    return queryString;
  }
  geocodePromise() {
    const that = this;
    return new Promise$1(function(resolve, reject) {
      let url = orsUtil$3.prepareUrl(that.requestArgs);
      url += "?" + that.getParametersAsQueryString(that.requestArgs);
      const timeout = that.defaultArgs[constants.propNames.timeout] || 5e3;
      const orsRequest = request.get(url).timeout(timeout);
      for (const key in that.customHeaders) {
        orsRequest.set(key, that.customHeaders[key]);
      }
      orsRequest.end(function(err, res) {
        if (err || !res.ok) {
          console.error(err);
          reject(err);
        } else if (res) {
          resolve(res.body || res.text);
        }
      });
    });
  }
  geocode(reqArgs) {
    this.requestArgs = reqArgs;
    this.checkHeaders();
    if (!this.defaultArgs[constants.propNames.service] && !this.requestArgs[constants.propNames.service]) {
      this.requestArgs.service = "geocode/search";
    }
    this.requestArgs = orsUtil$3.fillArgs(this.defaultArgs, this.requestArgs);
    return this.geocodePromise();
  }
  reverseGeocode(reqArgs) {
    this.requestArgs = reqArgs;
    this.checkHeaders();
    if (!this.defaultArgs[constants.propNames.service] && !this.requestArgs[constants.propNames.service]) {
      this.requestArgs.service = "geocode/reverse";
    }
    this.requestArgs = orsUtil$3.fillArgs(this.defaultArgs, this.requestArgs);
    return this.geocodePromise();
  }
  structuredGeocode(reqArgs) {
    this.requestArgs = reqArgs;
    this.checkHeaders();
    if (!this.defaultArgs[constants.propNames.service] && !reqArgs[constants.propNames.service]) {
      reqArgs.service = "geocode/search/structured";
    }
    this.requestArgs = orsUtil$3.fillArgs(this.defaultArgs, this.requestArgs);
    return this.geocodePromise();
  }
}
class OrsIsochrones extends OrsBase {
  constructor(args) {
    super(args);
    if (!this.defaultArgs[constants.propNames.service] && !this.requestArgs[constants.propNames.service]) {
      this.defaultArgs.service = "isochrones";
    }
    if (!args[constants.propNames.apiVersion]) {
      this.defaultArgs.api_version = constants.defaultAPIVersion;
    }
  }
  addLocation(latlon) {
    if (!("locations" in this.defaultArgs)) {
      this.defaultArgs.locations = [];
    }
    this.defaultArgs.locations.push(latlon);
  }
  getBody(args) {
    const options = {};
    if (args.restrictions) {
      options.profile_params = {
        restrictions: {
          ...args.restrictions
        }
      };
      delete args.restrictions;
    }
    if (args.avoidables) {
      options.avoid_features = [...args.avoidables];
      delete args.avoidables;
    }
    if (args.avoid_polygons) {
      options.avoid_polygons = {
        ...args.avoid_polygons
      };
      delete args.avoid_polygons;
    }
    if (Object.keys(options).length > 0) {
      return {
        ...args,
        options
      };
    } else {
      return {
        ...args
      };
    }
  }
}
class OrsMatrix extends OrsBase {
  constructor(args) {
    super(args);
    if (!this.defaultArgs[constants.propNames.service] && !this.requestArgs[constants.propNames.service]) {
      this.defaultArgs[constants.propNames.service] = "matrix";
    }
    if (!args[constants.propNames.apiVersion]) {
      this.defaultArgs.api_version = constants.defaultAPIVersion;
    }
  }
}
class OrsDirections extends OrsBase {
  constructor(args) {
    super(args);
    if (!this.defaultArgs[constants.propNames.service]) {
      this.defaultArgs[constants.propNames.service] = "directions";
    }
    if (!args[constants.propNames.apiVersion]) {
      this.defaultArgs.api_version = constants.defaultAPIVersion;
    }
  }
  clear() {
    for (const variable in this.defaultArgs) {
      if (variable !== constants.propNames.apiKey)
        delete this.defaultArgs[variable];
    }
  }
  clearPoints() {
    if ("coordinates" in this.defaultArgs)
      this.defaultArgs.coordinates.length = 0;
  }
  addWaypoint(latLon) {
    if (!("coordinates" in this.defaultArgs)) {
      this.defaultArgs.coordinates = [];
    }
    this.defaultArgs.coordinates.push(latLon);
  }
  getBody(args) {
    if (args.options && typeof args.options !== "object") {
      args.options = JSON.parse(args.options);
    }
    if (this.argsCache && this.argsCache.profile === "driving-hgv" && (!args.options || !args.options.vehicle_type)) {
      args.options = args.options || {};
      args.options.vehicle_type = "hgv";
    }
    if (args.restrictions) {
      args.options = args.options || {};
      args.options.profile_params = {
        restrictions: { ...args.restrictions }
      };
      delete args.options.restrictions;
    }
    if (args.avoidables) {
      args.options = args.options || {};
      args.options.avoid_features = [...args.avoidables];
      delete args.avoidables;
    }
    return args;
  }
}
const orsUtil$2 = new OrsUtil();
class OrsPois extends OrsBase {
  constructor(args) {
    super(args);
    if (!this.defaultArgs[constants.propNames.service]) {
      this.defaultArgs[constants.propNames.service] = "pois";
    }
  }
  clear() {
    for (const variable in this.defaultArgs) {
      if (variable !== constants.propNames.apiKey)
        delete this.defaultArgs[variable];
    }
  }
  generatePayload(args) {
    const payload = {};
    for (const key in args) {
      if (!(constants.baseUrlConstituents.indexOf(key) > -1 || key === constants.propNames.apiKey || key === constants.propNames.timeout)) {
        payload[key] = args[key];
      }
    }
    return payload;
  }
  poisPromise() {
    this.requestArgs.request = this.requestArgs.request || "pois";
    const that = this;
    return new Promise$1(function(resolve, reject) {
      that.argsCache = orsUtil$2.saveArgsToCache(that.requestArgs);
      if (that.requestArgs[constants.propNames.service]) {
        delete that.requestArgs[constants.propNames.service];
      }
      const payload = that.generatePayload(that.requestArgs);
      that.createRequest(payload, resolve, reject);
    });
  }
  pois(reqArgs) {
    this.requestArgs = reqArgs;
    this.checkHeaders();
    this.requestArgs = orsUtil$2.fillArgs(this.defaultArgs, this.requestArgs);
    return this.poisPromise();
  }
}
const orsUtil$1 = new OrsUtil();
class OrsElevation extends OrsBase {
  clear() {
    for (const variable in this.defaultArgs) {
      if (variable !== constants.propNames.apiKey)
        delete this.defaultArgs[variable];
    }
  }
  generatePayload(args) {
    const payload = {};
    for (const key in args) {
      if (constants.baseUrlConstituents.indexOf(key) <= -1) {
        payload[key] = args[key];
      }
    }
    return payload;
  }
  elevationPromise() {
    const that = this;
    return new Promise$1(function(resolve, reject) {
      that.argsCache = orsUtil$1.saveArgsToCache(that.requestArgs);
      const payload = that.generatePayload(that.requestArgs);
      that.createRequest(payload, resolve, reject);
    });
  }
  lineElevation(reqArgs) {
    this.requestArgs = reqArgs;
    this.checkHeaders();
    if (!this.defaultArgs[constants.propNames.service] && !reqArgs[constants.propNames.service]) {
      reqArgs[constants.propNames.service] = "elevation/line";
    }
    this.requestArgs = orsUtil$1.fillArgs(this.defaultArgs, this.requestArgs);
    return this.elevationPromise();
  }
  pointElevation(reqArgs) {
    this.requestArgs = reqArgs;
    this.checkHeaders();
    if (!this.defaultArgs[constants.propNames.service] && !this.requestArgs[constants.propNames.service]) {
      this.requestArgs[constants.propNames.service] = "elevation/point";
    }
    this.requestArgs = orsUtil$1.fillArgs(this.defaultArgs, this.requestArgs);
    return this.elevationPromise();
  }
}
const orsUtil = new OrsUtil();
class OrsOptimization extends OrsBase {
  clear() {
    for (let variable in this.defaultArgs) {
      if (variable !== constants.propNames.apiKey)
        delete this.defaultArgs[variable];
    }
  }
  generatePayload(args) {
    let payload = {};
    for (const key in args) {
      if (constants.baseUrlConstituents.indexOf(key) <= -1) {
        payload[key] = args[key];
      }
    }
    return payload;
  }
  optimizationPromise() {
    const that = this;
    return new Promise$1(function(resolve, reject) {
      that.argsCache = orsUtil.saveArgsToCache(that.requestArgs);
      const payload = that.generatePayload(that.requestArgs);
      that.createRequest(payload, resolve, reject);
    });
  }
  optimize(reqArgs) {
    this.requestArgs = reqArgs;
    this.checkHeaders();
    if (!this.defaultArgs[constants.propNames.service] && !reqArgs[constants.propNames.service]) {
      reqArgs[constants.propNames.service] = "optimization";
    }
    this.requestArgs = orsUtil.fillArgs(this.defaultArgs, this.requestArgs);
    return this.optimizationPromise();
  }
}
const Openrouteservice = {
  Util: OrsUtil,
  Input: OrsInput,
  Geocode: OrsGeocode,
  Isochrones: OrsIsochrones,
  Directions: OrsDirections,
  Matrix: OrsMatrix,
  Pois: OrsPois,
  Elevation: OrsElevation,
  Optimization: OrsOptimization
};
if (typeof module === "object" && typeof module.exports === "object") {
  module.exports = Openrouteservice;
} else if (typeof define === "function" && define.amd) {
  define(Openrouteservice);
}
if (typeof window !== "undefined") {
  window.Openrouteservice = Openrouteservice;
}
export {
  Openrouteservice as default
};
//# sourceMappingURL=ors-js-client.js.map
