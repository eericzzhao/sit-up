var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x2) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x2, {
  get: (a2, b2) => (typeof require !== "undefined" ? require : a2)[b2]
}) : x2)(function(x2) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x2 + '" is not supported');
});
var __commonJS = (cb, mod) => function __require3() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to2, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to2, key) && key !== except)
        __defProp(to2, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to2;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/path-browserify/index.js
var require_path_browserify = __commonJS({
  "node_modules/path-browserify/index.js"(exports, module) {
    "use strict";
    function assertPath(path2) {
      if (typeof path2 !== "string") {
        throw new TypeError("Path must be a string. Received " + JSON.stringify(path2));
      }
    }
    function normalizeStringPosix(path2, allowAboveRoot) {
      var res = "";
      var lastSegmentLength = 0;
      var lastSlash = -1;
      var dots = 0;
      var code;
      for (var i2 = 0; i2 <= path2.length; ++i2) {
        if (i2 < path2.length)
          code = path2.charCodeAt(i2);
        else if (code === 47)
          break;
        else
          code = 47;
        if (code === 47) {
          if (lastSlash === i2 - 1 || dots === 1) {
          } else if (lastSlash !== i2 - 1 && dots === 2) {
            if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 || res.charCodeAt(res.length - 2) !== 46) {
              if (res.length > 2) {
                var lastSlashIndex = res.lastIndexOf("/");
                if (lastSlashIndex !== res.length - 1) {
                  if (lastSlashIndex === -1) {
                    res = "";
                    lastSegmentLength = 0;
                  } else {
                    res = res.slice(0, lastSlashIndex);
                    lastSegmentLength = res.length - 1 - res.lastIndexOf("/");
                  }
                  lastSlash = i2;
                  dots = 0;
                  continue;
                }
              } else if (res.length === 2 || res.length === 1) {
                res = "";
                lastSegmentLength = 0;
                lastSlash = i2;
                dots = 0;
                continue;
              }
            }
            if (allowAboveRoot) {
              if (res.length > 0)
                res += "/..";
              else
                res = "..";
              lastSegmentLength = 2;
            }
          } else {
            if (res.length > 0)
              res += "/" + path2.slice(lastSlash + 1, i2);
            else
              res = path2.slice(lastSlash + 1, i2);
            lastSegmentLength = i2 - lastSlash - 1;
          }
          lastSlash = i2;
          dots = 0;
        } else if (code === 46 && dots !== -1) {
          ++dots;
        } else {
          dots = -1;
        }
      }
      return res;
    }
    function _format(sep, pathObject) {
      var dir = pathObject.dir || pathObject.root;
      var base = pathObject.base || (pathObject.name || "") + (pathObject.ext || "");
      if (!dir) {
        return base;
      }
      if (dir === pathObject.root) {
        return dir + base;
      }
      return dir + sep + base;
    }
    var posix = {
      // path.resolve([from ...], to)
      resolve: function resolve() {
        var resolvedPath = "";
        var resolvedAbsolute = false;
        var cwd;
        for (var i2 = arguments.length - 1; i2 >= -1 && !resolvedAbsolute; i2--) {
          var path2;
          if (i2 >= 0)
            path2 = arguments[i2];
          else {
            if (cwd === void 0)
              cwd = process.cwd();
            path2 = cwd;
          }
          assertPath(path2);
          if (path2.length === 0) {
            continue;
          }
          resolvedPath = path2 + "/" + resolvedPath;
          resolvedAbsolute = path2.charCodeAt(0) === 47;
        }
        resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute);
        if (resolvedAbsolute) {
          if (resolvedPath.length > 0)
            return "/" + resolvedPath;
          else
            return "/";
        } else if (resolvedPath.length > 0) {
          return resolvedPath;
        } else {
          return ".";
        }
      },
      normalize: function normalize2(path2) {
        assertPath(path2);
        if (path2.length === 0) return ".";
        var isAbsolute = path2.charCodeAt(0) === 47;
        var trailingSeparator = path2.charCodeAt(path2.length - 1) === 47;
        path2 = normalizeStringPosix(path2, !isAbsolute);
        if (path2.length === 0 && !isAbsolute) path2 = ".";
        if (path2.length > 0 && trailingSeparator) path2 += "/";
        if (isAbsolute) return "/" + path2;
        return path2;
      },
      isAbsolute: function isAbsolute(path2) {
        assertPath(path2);
        return path2.length > 0 && path2.charCodeAt(0) === 47;
      },
      join: function join() {
        if (arguments.length === 0)
          return ".";
        var joined;
        for (var i2 = 0; i2 < arguments.length; ++i2) {
          var arg = arguments[i2];
          assertPath(arg);
          if (arg.length > 0) {
            if (joined === void 0)
              joined = arg;
            else
              joined += "/" + arg;
          }
        }
        if (joined === void 0)
          return ".";
        return posix.normalize(joined);
      },
      relative: function relative(from, to2) {
        assertPath(from);
        assertPath(to2);
        if (from === to2) return "";
        from = posix.resolve(from);
        to2 = posix.resolve(to2);
        if (from === to2) return "";
        var fromStart = 1;
        for (; fromStart < from.length; ++fromStart) {
          if (from.charCodeAt(fromStart) !== 47)
            break;
        }
        var fromEnd = from.length;
        var fromLen = fromEnd - fromStart;
        var toStart = 1;
        for (; toStart < to2.length; ++toStart) {
          if (to2.charCodeAt(toStart) !== 47)
            break;
        }
        var toEnd = to2.length;
        var toLen = toEnd - toStart;
        var length = fromLen < toLen ? fromLen : toLen;
        var lastCommonSep = -1;
        var i2 = 0;
        for (; i2 <= length; ++i2) {
          if (i2 === length) {
            if (toLen > length) {
              if (to2.charCodeAt(toStart + i2) === 47) {
                return to2.slice(toStart + i2 + 1);
              } else if (i2 === 0) {
                return to2.slice(toStart + i2);
              }
            } else if (fromLen > length) {
              if (from.charCodeAt(fromStart + i2) === 47) {
                lastCommonSep = i2;
              } else if (i2 === 0) {
                lastCommonSep = 0;
              }
            }
            break;
          }
          var fromCode = from.charCodeAt(fromStart + i2);
          var toCode = to2.charCodeAt(toStart + i2);
          if (fromCode !== toCode)
            break;
          else if (fromCode === 47)
            lastCommonSep = i2;
        }
        var out = "";
        for (i2 = fromStart + lastCommonSep + 1; i2 <= fromEnd; ++i2) {
          if (i2 === fromEnd || from.charCodeAt(i2) === 47) {
            if (out.length === 0)
              out += "..";
            else
              out += "/..";
          }
        }
        if (out.length > 0)
          return out + to2.slice(toStart + lastCommonSep);
        else {
          toStart += lastCommonSep;
          if (to2.charCodeAt(toStart) === 47)
            ++toStart;
          return to2.slice(toStart);
        }
      },
      _makeLong: function _makeLong(path2) {
        return path2;
      },
      dirname: function dirname(path2) {
        assertPath(path2);
        if (path2.length === 0) return ".";
        var code = path2.charCodeAt(0);
        var hasRoot = code === 47;
        var end = -1;
        var matchedSlash = true;
        for (var i2 = path2.length - 1; i2 >= 1; --i2) {
          code = path2.charCodeAt(i2);
          if (code === 47) {
            if (!matchedSlash) {
              end = i2;
              break;
            }
          } else {
            matchedSlash = false;
          }
        }
        if (end === -1) return hasRoot ? "/" : ".";
        if (hasRoot && end === 1) return "//";
        return path2.slice(0, end);
      },
      basename: function basename(path2, ext) {
        if (ext !== void 0 && typeof ext !== "string") throw new TypeError('"ext" argument must be a string');
        assertPath(path2);
        var start = 0;
        var end = -1;
        var matchedSlash = true;
        var i2;
        if (ext !== void 0 && ext.length > 0 && ext.length <= path2.length) {
          if (ext.length === path2.length && ext === path2) return "";
          var extIdx = ext.length - 1;
          var firstNonSlashEnd = -1;
          for (i2 = path2.length - 1; i2 >= 0; --i2) {
            var code = path2.charCodeAt(i2);
            if (code === 47) {
              if (!matchedSlash) {
                start = i2 + 1;
                break;
              }
            } else {
              if (firstNonSlashEnd === -1) {
                matchedSlash = false;
                firstNonSlashEnd = i2 + 1;
              }
              if (extIdx >= 0) {
                if (code === ext.charCodeAt(extIdx)) {
                  if (--extIdx === -1) {
                    end = i2;
                  }
                } else {
                  extIdx = -1;
                  end = firstNonSlashEnd;
                }
              }
            }
          }
          if (start === end) end = firstNonSlashEnd;
          else if (end === -1) end = path2.length;
          return path2.slice(start, end);
        } else {
          for (i2 = path2.length - 1; i2 >= 0; --i2) {
            if (path2.charCodeAt(i2) === 47) {
              if (!matchedSlash) {
                start = i2 + 1;
                break;
              }
            } else if (end === -1) {
              matchedSlash = false;
              end = i2 + 1;
            }
          }
          if (end === -1) return "";
          return path2.slice(start, end);
        }
      },
      extname: function extname(path2) {
        assertPath(path2);
        var startDot = -1;
        var startPart = 0;
        var end = -1;
        var matchedSlash = true;
        var preDotState = 0;
        for (var i2 = path2.length - 1; i2 >= 0; --i2) {
          var code = path2.charCodeAt(i2);
          if (code === 47) {
            if (!matchedSlash) {
              startPart = i2 + 1;
              break;
            }
            continue;
          }
          if (end === -1) {
            matchedSlash = false;
            end = i2 + 1;
          }
          if (code === 46) {
            if (startDot === -1)
              startDot = i2;
            else if (preDotState !== 1)
              preDotState = 1;
          } else if (startDot !== -1) {
            preDotState = -1;
          }
        }
        if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
        preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
        preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
          return "";
        }
        return path2.slice(startDot, end);
      },
      format: function format(pathObject) {
        if (pathObject === null || typeof pathObject !== "object") {
          throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof pathObject);
        }
        return _format("/", pathObject);
      },
      parse: function parse2(path2) {
        assertPath(path2);
        var ret = { root: "", dir: "", base: "", ext: "", name: "" };
        if (path2.length === 0) return ret;
        var code = path2.charCodeAt(0);
        var isAbsolute = code === 47;
        var start;
        if (isAbsolute) {
          ret.root = "/";
          start = 1;
        } else {
          start = 0;
        }
        var startDot = -1;
        var startPart = 0;
        var end = -1;
        var matchedSlash = true;
        var i2 = path2.length - 1;
        var preDotState = 0;
        for (; i2 >= start; --i2) {
          code = path2.charCodeAt(i2);
          if (code === 47) {
            if (!matchedSlash) {
              startPart = i2 + 1;
              break;
            }
            continue;
          }
          if (end === -1) {
            matchedSlash = false;
            end = i2 + 1;
          }
          if (code === 46) {
            if (startDot === -1) startDot = i2;
            else if (preDotState !== 1) preDotState = 1;
          } else if (startDot !== -1) {
            preDotState = -1;
          }
        }
        if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
        preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
        preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
          if (end !== -1) {
            if (startPart === 0 && isAbsolute) ret.base = ret.name = path2.slice(1, end);
            else ret.base = ret.name = path2.slice(startPart, end);
          }
        } else {
          if (startPart === 0 && isAbsolute) {
            ret.name = path2.slice(1, startDot);
            ret.base = path2.slice(1, end);
          } else {
            ret.name = path2.slice(startPart, startDot);
            ret.base = path2.slice(startPart, end);
          }
          ret.ext = path2.slice(startDot, end);
        }
        if (startPart > 0) ret.dir = path2.slice(0, startPart - 1);
        else if (isAbsolute) ret.dir = "/";
        return ret;
      },
      sep: "/",
      delimiter: ":",
      win32: null,
      posix: null
    };
    posix.posix = posix;
    module.exports = posix;
  }
});

// node_modules/quick-format-unescaped/index.js
var require_quick_format_unescaped = __commonJS({
  "node_modules/quick-format-unescaped/index.js"(exports, module) {
    "use strict";
    function tryStringify(o2) {
      try {
        return JSON.stringify(o2);
      } catch (e3) {
        return '"[Circular]"';
      }
    }
    module.exports = format;
    function format(f2, args, opts) {
      var ss = opts && opts.stringify || tryStringify;
      var offset = 1;
      if (typeof f2 === "object" && f2 !== null) {
        var len = args.length + offset;
        if (len === 1) return f2;
        var objects = new Array(len);
        objects[0] = ss(f2);
        for (var index = 1; index < len; index++) {
          objects[index] = ss(args[index]);
        }
        return objects.join(" ");
      }
      if (typeof f2 !== "string") {
        return f2;
      }
      var argLen = args.length;
      if (argLen === 0) return f2;
      var str = "";
      var a2 = 1 - offset;
      var lastPos = -1;
      var flen = f2 && f2.length || 0;
      for (var i2 = 0; i2 < flen; ) {
        if (f2.charCodeAt(i2) === 37 && i2 + 1 < flen) {
          lastPos = lastPos > -1 ? lastPos : 0;
          switch (f2.charCodeAt(i2 + 1)) {
            case 100:
            // 'd'
            case 102:
              if (a2 >= argLen)
                break;
              if (args[a2] == null) break;
              if (lastPos < i2)
                str += f2.slice(lastPos, i2);
              str += Number(args[a2]);
              lastPos = i2 + 2;
              i2++;
              break;
            case 105:
              if (a2 >= argLen)
                break;
              if (args[a2] == null) break;
              if (lastPos < i2)
                str += f2.slice(lastPos, i2);
              str += Math.floor(Number(args[a2]));
              lastPos = i2 + 2;
              i2++;
              break;
            case 79:
            // 'O'
            case 111:
            // 'o'
            case 106:
              if (a2 >= argLen)
                break;
              if (args[a2] === void 0) break;
              if (lastPos < i2)
                str += f2.slice(lastPos, i2);
              var type = typeof args[a2];
              if (type === "string") {
                str += "'" + args[a2] + "'";
                lastPos = i2 + 2;
                i2++;
                break;
              }
              if (type === "function") {
                str += args[a2].name || "<anonymous>";
                lastPos = i2 + 2;
                i2++;
                break;
              }
              str += ss(args[a2]);
              lastPos = i2 + 2;
              i2++;
              break;
            case 115:
              if (a2 >= argLen)
                break;
              if (lastPos < i2)
                str += f2.slice(lastPos, i2);
              str += String(args[a2]);
              lastPos = i2 + 2;
              i2++;
              break;
            case 37:
              if (lastPos < i2)
                str += f2.slice(lastPos, i2);
              str += "%";
              lastPos = i2 + 2;
              i2++;
              a2--;
              break;
          }
          ++a2;
        }
        ++i2;
      }
      if (lastPos === -1)
        return f2;
      else if (lastPos < flen) {
        str += f2.slice(lastPos);
      }
      return str;
    }
  }
});

// node_modules/pino/browser.js
var require_browser = __commonJS({
  "node_modules/pino/browser.js"(exports, module) {
    "use strict";
    var format = require_quick_format_unescaped();
    module.exports = pino2;
    var _console = pfGlobalThisOrFallback().console || {};
    var stdSerializers = {
      mapHttpRequest: mock,
      mapHttpResponse: mock,
      wrapRequestSerializer: passthrough,
      wrapResponseSerializer: passthrough,
      wrapErrorSerializer: passthrough,
      req: mock,
      res: mock,
      err: asErrValue,
      errWithCause: asErrValue
    };
    function levelToValue(level, logger) {
      return level === "silent" ? Infinity : logger.levels.values[level];
    }
    var baseLogFunctionSymbol = /* @__PURE__ */ Symbol("pino.logFuncs");
    var hierarchySymbol = /* @__PURE__ */ Symbol("pino.hierarchy");
    var logFallbackMap = {
      error: "log",
      fatal: "error",
      warn: "error",
      info: "log",
      debug: "log",
      trace: "log"
    };
    function appendChildLogger(parentLogger, childLogger) {
      const newEntry = {
        logger: childLogger,
        parent: parentLogger[hierarchySymbol]
      };
      childLogger[hierarchySymbol] = newEntry;
    }
    function setupBaseLogFunctions(logger, levels, proto) {
      const logFunctions = {};
      levels.forEach((level) => {
        logFunctions[level] = proto[level] ? proto[level] : _console[level] || _console[logFallbackMap[level] || "log"] || noop;
      });
      logger[baseLogFunctionSymbol] = logFunctions;
    }
    function shouldSerialize(serialize, serializers) {
      if (Array.isArray(serialize)) {
        const hasToFilter = serialize.filter(function(k2) {
          return k2 !== "!stdSerializers.err";
        });
        return hasToFilter;
      } else if (serialize === true) {
        return Object.keys(serializers);
      }
      return false;
    }
    function pino2(opts) {
      opts = opts || {};
      opts.browser = opts.browser || {};
      const transmit2 = opts.browser.transmit;
      if (transmit2 && typeof transmit2.send !== "function") {
        throw Error("pino: transmit option must have a send function");
      }
      const proto = opts.browser.write || _console;
      if (opts.browser.write) opts.browser.asObject = true;
      const serializers = opts.serializers || {};
      const serialize = shouldSerialize(opts.browser.serialize, serializers);
      let stdErrSerialize = opts.browser.serialize;
      if (Array.isArray(opts.browser.serialize) && opts.browser.serialize.indexOf("!stdSerializers.err") > -1) stdErrSerialize = false;
      const customLevels = Object.keys(opts.customLevels || {});
      const levels = ["error", "fatal", "warn", "info", "debug", "trace"].concat(customLevels);
      if (typeof proto === "function") {
        levels.forEach(function(level2) {
          proto[level2] = proto;
        });
      }
      if (opts.enabled === false || opts.browser.disabled) opts.level = "silent";
      const level = opts.level || "info";
      const logger = Object.create(proto);
      if (!logger.log) logger.log = noop;
      setupBaseLogFunctions(logger, levels, proto);
      appendChildLogger({}, logger);
      Object.defineProperty(logger, "levelVal", {
        get: getLevelVal
      });
      Object.defineProperty(logger, "level", {
        get: getLevel,
        set: setLevel
      });
      const setOpts = {
        transmit: transmit2,
        serialize,
        asObject: opts.browser.asObject,
        formatters: opts.browser.formatters,
        levels,
        timestamp: getTimeFunction(opts)
      };
      logger.levels = getLevels(opts);
      logger.level = level;
      logger.setMaxListeners = logger.getMaxListeners = logger.emit = logger.addListener = logger.on = logger.prependListener = logger.once = logger.prependOnceListener = logger.removeListener = logger.removeAllListeners = logger.listeners = logger.listenerCount = logger.eventNames = logger.write = logger.flush = noop;
      logger.serializers = serializers;
      logger._serialize = serialize;
      logger._stdErrSerialize = stdErrSerialize;
      logger.child = child;
      if (transmit2) logger._logEvent = createLogEventShape();
      function getLevelVal() {
        return levelToValue(this.level, this);
      }
      function getLevel() {
        return this._level;
      }
      function setLevel(level2) {
        if (level2 !== "silent" && !this.levels.values[level2]) {
          throw Error("unknown level " + level2);
        }
        this._level = level2;
        set(this, setOpts, logger, "error");
        set(this, setOpts, logger, "fatal");
        set(this, setOpts, logger, "warn");
        set(this, setOpts, logger, "info");
        set(this, setOpts, logger, "debug");
        set(this, setOpts, logger, "trace");
        customLevels.forEach((level3) => {
          set(this, setOpts, logger, level3);
        });
      }
      function child(bindings, childOptions) {
        if (!bindings) {
          throw new Error("missing bindings for child Pino");
        }
        childOptions = childOptions || {};
        if (serialize && bindings.serializers) {
          childOptions.serializers = bindings.serializers;
        }
        const childOptionsSerializers = childOptions.serializers;
        if (serialize && childOptionsSerializers) {
          var childSerializers = Object.assign({}, serializers, childOptionsSerializers);
          var childSerialize = opts.browser.serialize === true ? Object.keys(childSerializers) : serialize;
          delete bindings.serializers;
          applySerializers([bindings], childSerialize, childSerializers, this._stdErrSerialize);
        }
        function Child(parent) {
          this._childLevel = (parent._childLevel | 0) + 1;
          this.bindings = bindings;
          if (childSerializers) {
            this.serializers = childSerializers;
            this._serialize = childSerialize;
          }
          if (transmit2) {
            this._logEvent = createLogEventShape(
              [].concat(parent._logEvent.bindings, bindings)
            );
          }
        }
        Child.prototype = this;
        const newLogger = new Child(this);
        appendChildLogger(this, newLogger);
        newLogger.level = this.level;
        return newLogger;
      }
      return logger;
    }
    function getLevels(opts) {
      const customLevels = opts.customLevels || {};
      const values = Object.assign({}, pino2.levels.values, customLevels);
      const labels = Object.assign({}, pino2.levels.labels, invertObject(customLevels));
      return {
        values,
        labels
      };
    }
    function invertObject(obj) {
      const inverted = {};
      Object.keys(obj).forEach(function(key) {
        inverted[obj[key]] = key;
      });
      return inverted;
    }
    pino2.levels = {
      values: {
        fatal: 60,
        error: 50,
        warn: 40,
        info: 30,
        debug: 20,
        trace: 10
      },
      labels: {
        10: "trace",
        20: "debug",
        30: "info",
        40: "warn",
        50: "error",
        60: "fatal"
      }
    };
    pino2.stdSerializers = stdSerializers;
    pino2.stdTimeFunctions = Object.assign({}, { nullTime, epochTime, unixTime, isoTime });
    function getBindingChain(logger) {
      const bindings = [];
      if (logger.bindings) {
        bindings.push(logger.bindings);
      }
      let hierarchy = logger[hierarchySymbol];
      while (hierarchy.parent) {
        hierarchy = hierarchy.parent;
        if (hierarchy.logger.bindings) {
          bindings.push(hierarchy.logger.bindings);
        }
      }
      return bindings.reverse();
    }
    function set(self2, opts, rootLogger, level) {
      Object.defineProperty(self2, level, {
        value: levelToValue(self2.level, rootLogger) > levelToValue(level, rootLogger) ? noop : rootLogger[baseLogFunctionSymbol][level],
        writable: true,
        enumerable: true,
        configurable: true
      });
      if (!opts.transmit && self2[level] === noop) {
        return;
      }
      self2[level] = createWrap(self2, opts, rootLogger, level);
      const bindings = getBindingChain(self2);
      if (bindings.length === 0) {
        return;
      }
      self2[level] = prependBindingsInArguments(bindings, self2[level]);
    }
    function prependBindingsInArguments(bindings, logFunc) {
      return function() {
        return logFunc.apply(this, [...bindings, ...arguments]);
      };
    }
    function createWrap(self2, opts, rootLogger, level) {
      return /* @__PURE__ */ (function(write) {
        return function LOG() {
          const ts = opts.timestamp();
          const args = new Array(arguments.length);
          const proto = Object.getPrototypeOf && Object.getPrototypeOf(this) === _console ? _console : this;
          for (var i2 = 0; i2 < args.length; i2++) args[i2] = arguments[i2];
          if (opts.serialize && !opts.asObject) {
            applySerializers(args, this._serialize, this.serializers, this._stdErrSerialize);
          }
          if (opts.asObject || opts.formatters) {
            write.call(proto, asObject(this, level, args, ts, opts.formatters));
          } else write.apply(proto, args);
          if (opts.transmit) {
            const transmitLevel = opts.transmit.level || self2._level;
            const transmitValue = rootLogger.levels.values[transmitLevel];
            const methodValue = rootLogger.levels.values[level];
            if (methodValue < transmitValue) return;
            transmit(this, {
              ts,
              methodLevel: level,
              methodValue,
              transmitLevel,
              transmitValue: rootLogger.levels.values[opts.transmit.level || self2._level],
              send: opts.transmit.send,
              val: levelToValue(self2._level, rootLogger)
            }, args);
          }
        };
      })(self2[baseLogFunctionSymbol][level]);
    }
    function asObject(logger, level, args, ts, formatters = {}) {
      const {
        level: levelFormatter = () => logger.levels.values[level],
        log: logObjectFormatter = (obj) => obj
      } = formatters;
      if (logger._serialize) applySerializers(args, logger._serialize, logger.serializers, logger._stdErrSerialize);
      const argsCloned = args.slice();
      let msg = argsCloned[0];
      const logObject = {};
      if (ts) {
        logObject.time = ts;
      }
      logObject.level = levelFormatter(level, logger.levels.values[level]);
      let lvl = (logger._childLevel | 0) + 1;
      if (lvl < 1) lvl = 1;
      if (msg !== null && typeof msg === "object") {
        while (lvl-- && typeof argsCloned[0] === "object") {
          Object.assign(logObject, argsCloned.shift());
        }
        msg = argsCloned.length ? format(argsCloned.shift(), argsCloned) : void 0;
      } else if (typeof msg === "string") msg = format(argsCloned.shift(), argsCloned);
      if (msg !== void 0) logObject.msg = msg;
      const formattedLogObject = logObjectFormatter(logObject);
      return formattedLogObject;
    }
    function applySerializers(args, serialize, serializers, stdErrSerialize) {
      for (const i2 in args) {
        if (stdErrSerialize && args[i2] instanceof Error) {
          args[i2] = pino2.stdSerializers.err(args[i2]);
        } else if (typeof args[i2] === "object" && !Array.isArray(args[i2])) {
          for (const k2 in args[i2]) {
            if (serialize && serialize.indexOf(k2) > -1 && k2 in serializers) {
              args[i2][k2] = serializers[k2](args[i2][k2]);
            }
          }
        }
      }
    }
    function transmit(logger, opts, args) {
      const send = opts.send;
      const ts = opts.ts;
      const methodLevel = opts.methodLevel;
      const methodValue = opts.methodValue;
      const val = opts.val;
      const bindings = logger._logEvent.bindings;
      applySerializers(
        args,
        logger._serialize || Object.keys(logger.serializers),
        logger.serializers,
        logger._stdErrSerialize === void 0 ? true : logger._stdErrSerialize
      );
      logger._logEvent.ts = ts;
      logger._logEvent.messages = args.filter(function(arg) {
        return bindings.indexOf(arg) === -1;
      });
      logger._logEvent.level.label = methodLevel;
      logger._logEvent.level.value = methodValue;
      send(methodLevel, logger._logEvent, val);
      logger._logEvent = createLogEventShape(bindings);
    }
    function createLogEventShape(bindings) {
      return {
        ts: 0,
        messages: [],
        bindings: bindings || [],
        level: { label: "", value: 0 }
      };
    }
    function asErrValue(err) {
      const obj = {
        type: err.constructor.name,
        msg: err.message,
        stack: err.stack
      };
      for (const key in err) {
        if (obj[key] === void 0) {
          obj[key] = err[key];
        }
      }
      return obj;
    }
    function getTimeFunction(opts) {
      if (typeof opts.timestamp === "function") {
        return opts.timestamp;
      }
      if (opts.timestamp === false) {
        return nullTime;
      }
      return epochTime;
    }
    function mock() {
      return {};
    }
    function passthrough(a2) {
      return a2;
    }
    function noop() {
    }
    function nullTime() {
      return false;
    }
    function epochTime() {
      return Date.now();
    }
    function unixTime() {
      return Math.round(Date.now() / 1e3);
    }
    function isoTime() {
      return new Date(Date.now()).toISOString();
    }
    function pfGlobalThisOrFallback() {
      function defd(o2) {
        return typeof o2 !== "undefined" && o2;
      }
      try {
        if (typeof globalThis !== "undefined") return globalThis;
        Object.defineProperty(Object.prototype, "globalThis", {
          get: function() {
            delete Object.prototype.globalThis;
            return this.globalThis = this;
          },
          configurable: true
        });
        return globalThis;
      } catch (e3) {
        return defd(self) || defd(window) || defd(this) || {};
      }
    }
    module.exports.default = pino2;
    module.exports.pino = pino2;
  }
});

// node_modules/engine.io-parser/build/esm/commons.js
var PACKET_TYPES = /* @__PURE__ */ Object.create(null);
PACKET_TYPES["open"] = "0";
PACKET_TYPES["close"] = "1";
PACKET_TYPES["ping"] = "2";
PACKET_TYPES["pong"] = "3";
PACKET_TYPES["message"] = "4";
PACKET_TYPES["upgrade"] = "5";
PACKET_TYPES["noop"] = "6";
var PACKET_TYPES_REVERSE = /* @__PURE__ */ Object.create(null);
Object.keys(PACKET_TYPES).forEach((key) => {
  PACKET_TYPES_REVERSE[PACKET_TYPES[key]] = key;
});
var ERROR_PACKET = { type: "error", data: "parser error" };

// node_modules/engine.io-parser/build/esm/encodePacket.browser.js
var withNativeBlob = typeof Blob === "function" || typeof Blob !== "undefined" && Object.prototype.toString.call(Blob) === "[object BlobConstructor]";
var withNativeArrayBuffer = typeof ArrayBuffer === "function";
var isView = (obj) => {
  return typeof ArrayBuffer.isView === "function" ? ArrayBuffer.isView(obj) : obj && obj.buffer instanceof ArrayBuffer;
};
var encodePacket = ({ type, data }, supportsBinary, callback) => {
  if (withNativeBlob && data instanceof Blob) {
    if (supportsBinary) {
      return callback(data);
    } else {
      return encodeBlobAsBase64(data, callback);
    }
  } else if (withNativeArrayBuffer && (data instanceof ArrayBuffer || isView(data))) {
    if (supportsBinary) {
      return callback(data);
    } else {
      return encodeBlobAsBase64(new Blob([data]), callback);
    }
  }
  return callback(PACKET_TYPES[type] + (data || ""));
};
var encodeBlobAsBase64 = (data, callback) => {
  const fileReader = new FileReader();
  fileReader.onload = function() {
    const content = fileReader.result.split(",")[1];
    callback("b" + (content || ""));
  };
  return fileReader.readAsDataURL(data);
};
function toArray(data) {
  if (data instanceof Uint8Array) {
    return data;
  } else if (data instanceof ArrayBuffer) {
    return new Uint8Array(data);
  } else {
    return new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
  }
}
var TEXT_ENCODER;
function encodePacketToBinary(packet, callback) {
  if (withNativeBlob && packet.data instanceof Blob) {
    return packet.data.arrayBuffer().then(toArray).then(callback);
  } else if (withNativeArrayBuffer && (packet.data instanceof ArrayBuffer || isView(packet.data))) {
    return callback(toArray(packet.data));
  }
  encodePacket(packet, false, (encoded) => {
    if (!TEXT_ENCODER) {
      TEXT_ENCODER = new TextEncoder();
    }
    callback(TEXT_ENCODER.encode(encoded));
  });
}

// node_modules/engine.io-parser/build/esm/contrib/base64-arraybuffer.js
var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var lookup = typeof Uint8Array === "undefined" ? [] : new Uint8Array(256);
for (let i2 = 0; i2 < chars.length; i2++) {
  lookup[chars.charCodeAt(i2)] = i2;
}
var decode = (base64) => {
  let bufferLength = base64.length * 0.75, len = base64.length, i2, p2 = 0, encoded1, encoded2, encoded3, encoded4;
  if (base64[base64.length - 1] === "=") {
    bufferLength--;
    if (base64[base64.length - 2] === "=") {
      bufferLength--;
    }
  }
  const arraybuffer = new ArrayBuffer(bufferLength), bytes = new Uint8Array(arraybuffer);
  for (i2 = 0; i2 < len; i2 += 4) {
    encoded1 = lookup[base64.charCodeAt(i2)];
    encoded2 = lookup[base64.charCodeAt(i2 + 1)];
    encoded3 = lookup[base64.charCodeAt(i2 + 2)];
    encoded4 = lookup[base64.charCodeAt(i2 + 3)];
    bytes[p2++] = encoded1 << 2 | encoded2 >> 4;
    bytes[p2++] = (encoded2 & 15) << 4 | encoded3 >> 2;
    bytes[p2++] = (encoded3 & 3) << 6 | encoded4 & 63;
  }
  return arraybuffer;
};

// node_modules/engine.io-parser/build/esm/decodePacket.browser.js
var withNativeArrayBuffer2 = typeof ArrayBuffer === "function";
var decodePacket = (encodedPacket, binaryType) => {
  if (typeof encodedPacket !== "string") {
    return {
      type: "message",
      data: mapBinary(encodedPacket, binaryType)
    };
  }
  const type = encodedPacket.charAt(0);
  if (type === "b") {
    return {
      type: "message",
      data: decodeBase64Packet(encodedPacket.substring(1), binaryType)
    };
  }
  const packetType = PACKET_TYPES_REVERSE[type];
  if (!packetType) {
    return ERROR_PACKET;
  }
  return encodedPacket.length > 1 ? {
    type: PACKET_TYPES_REVERSE[type],
    data: encodedPacket.substring(1)
  } : {
    type: PACKET_TYPES_REVERSE[type]
  };
};
var decodeBase64Packet = (data, binaryType) => {
  if (withNativeArrayBuffer2) {
    const decoded = decode(data);
    return mapBinary(decoded, binaryType);
  } else {
    return { base64: true, data };
  }
};
var mapBinary = (data, binaryType) => {
  switch (binaryType) {
    case "blob":
      if (data instanceof Blob) {
        return data;
      } else {
        return new Blob([data]);
      }
    case "arraybuffer":
    default:
      if (data instanceof ArrayBuffer) {
        return data;
      } else {
        return data.buffer;
      }
  }
};

// node_modules/engine.io-parser/build/esm/index.js
var SEPARATOR = String.fromCharCode(30);
var encodePayload = (packets, callback) => {
  const length = packets.length;
  const encodedPackets = new Array(length);
  let count = 0;
  packets.forEach((packet, i2) => {
    encodePacket(packet, false, (encodedPacket) => {
      encodedPackets[i2] = encodedPacket;
      if (++count === length) {
        callback(encodedPackets.join(SEPARATOR));
      }
    });
  });
};
var decodePayload = (encodedPayload, binaryType) => {
  const encodedPackets = encodedPayload.split(SEPARATOR);
  const packets = [];
  for (let i2 = 0; i2 < encodedPackets.length; i2++) {
    const decodedPacket = decodePacket(encodedPackets[i2], binaryType);
    packets.push(decodedPacket);
    if (decodedPacket.type === "error") {
      break;
    }
  }
  return packets;
};
function createPacketEncoderStream() {
  return new TransformStream({
    transform(packet, controller) {
      encodePacketToBinary(packet, (encodedPacket) => {
        const payloadLength = encodedPacket.length;
        let header;
        if (payloadLength < 126) {
          header = new Uint8Array(1);
          new DataView(header.buffer).setUint8(0, payloadLength);
        } else if (payloadLength < 65536) {
          header = new Uint8Array(3);
          const view = new DataView(header.buffer);
          view.setUint8(0, 126);
          view.setUint16(1, payloadLength);
        } else {
          header = new Uint8Array(9);
          const view = new DataView(header.buffer);
          view.setUint8(0, 127);
          view.setBigUint64(1, BigInt(payloadLength));
        }
        if (packet.data && typeof packet.data !== "string") {
          header[0] |= 128;
        }
        controller.enqueue(header);
        controller.enqueue(encodedPacket);
      });
    }
  });
}
var TEXT_DECODER;
function totalLength(chunks) {
  return chunks.reduce((acc, chunk) => acc + chunk.length, 0);
}
function concatChunks(chunks, size) {
  if (chunks[0].length === size) {
    return chunks.shift();
  }
  const buffer = new Uint8Array(size);
  let j2 = 0;
  for (let i2 = 0; i2 < size; i2++) {
    buffer[i2] = chunks[0][j2++];
    if (j2 === chunks[0].length) {
      chunks.shift();
      j2 = 0;
    }
  }
  if (chunks.length && j2 < chunks[0].length) {
    chunks[0] = chunks[0].slice(j2);
  }
  return buffer;
}
function createPacketDecoderStream(maxPayload, binaryType) {
  if (!TEXT_DECODER) {
    TEXT_DECODER = new TextDecoder();
  }
  const chunks = [];
  let state = 0;
  let expectedLength = -1;
  let isBinary2 = false;
  return new TransformStream({
    transform(chunk, controller) {
      chunks.push(chunk);
      while (true) {
        if (state === 0) {
          if (totalLength(chunks) < 1) {
            break;
          }
          const header = concatChunks(chunks, 1);
          isBinary2 = (header[0] & 128) === 128;
          expectedLength = header[0] & 127;
          if (expectedLength < 126) {
            state = 3;
          } else if (expectedLength === 126) {
            state = 1;
          } else {
            state = 2;
          }
        } else if (state === 1) {
          if (totalLength(chunks) < 2) {
            break;
          }
          const headerArray = concatChunks(chunks, 2);
          expectedLength = new DataView(headerArray.buffer, headerArray.byteOffset, headerArray.length).getUint16(0);
          state = 3;
        } else if (state === 2) {
          if (totalLength(chunks) < 8) {
            break;
          }
          const headerArray = concatChunks(chunks, 8);
          const view = new DataView(headerArray.buffer, headerArray.byteOffset, headerArray.length);
          const n2 = view.getUint32(0);
          if (n2 > Math.pow(2, 53 - 32) - 1) {
            controller.enqueue(ERROR_PACKET);
            break;
          }
          expectedLength = n2 * Math.pow(2, 32) + view.getUint32(4);
          state = 3;
        } else {
          if (totalLength(chunks) < expectedLength) {
            break;
          }
          const data = concatChunks(chunks, expectedLength);
          controller.enqueue(decodePacket(isBinary2 ? data : TEXT_DECODER.decode(data), binaryType));
          state = 0;
        }
        if (expectedLength === 0 || expectedLength > maxPayload) {
          controller.enqueue(ERROR_PACKET);
          break;
        }
      }
    }
  });
}
var protocol = 4;

// node_modules/@socket.io/component-emitter/lib/esm/index.js
function Emitter(obj) {
  if (obj) return mixin(obj);
}
function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}
Emitter.prototype.on = Emitter.prototype.addEventListener = function(event, fn2) {
  this._callbacks = this._callbacks || {};
  (this._callbacks["$" + event] = this._callbacks["$" + event] || []).push(fn2);
  return this;
};
Emitter.prototype.once = function(event, fn2) {
  function on3() {
    this.off(event, on3);
    fn2.apply(this, arguments);
  }
  on3.fn = fn2;
  this.on(event, on3);
  return this;
};
Emitter.prototype.off = Emitter.prototype.removeListener = Emitter.prototype.removeAllListeners = Emitter.prototype.removeEventListener = function(event, fn2) {
  this._callbacks = this._callbacks || {};
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }
  var callbacks = this._callbacks["$" + event];
  if (!callbacks) return this;
  if (1 == arguments.length) {
    delete this._callbacks["$" + event];
    return this;
  }
  var cb;
  for (var i2 = 0; i2 < callbacks.length; i2++) {
    cb = callbacks[i2];
    if (cb === fn2 || cb.fn === fn2) {
      callbacks.splice(i2, 1);
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
  for (var i2 = 1; i2 < arguments.length; i2++) {
    args[i2 - 1] = arguments[i2];
  }
  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i2 = 0, len = callbacks.length; i2 < len; ++i2) {
      callbacks[i2].apply(this, args);
    }
  }
  return this;
};
Emitter.prototype.emitReserved = Emitter.prototype.emit;
Emitter.prototype.listeners = function(event) {
  this._callbacks = this._callbacks || {};
  return this._callbacks["$" + event] || [];
};
Emitter.prototype.hasListeners = function(event) {
  return !!this.listeners(event).length;
};

// node_modules/engine.io-client/build/esm/globals.js
var nextTick = (() => {
  const isPromiseAvailable = typeof Promise === "function" && typeof Promise.resolve === "function";
  if (isPromiseAvailable) {
    return (cb) => Promise.resolve().then(cb);
  } else {
    return (cb, setTimeoutFn) => setTimeoutFn(cb, 0);
  }
})();
var globalThisShim = (() => {
  if (typeof self !== "undefined") {
    return self;
  } else if (typeof window !== "undefined") {
    return window;
  } else {
    return Function("return this")();
  }
})();
var defaultBinaryType = "arraybuffer";
function createCookieJar() {
}

// node_modules/engine.io-client/build/esm/util.js
function pick(obj, ...attr) {
  return attr.reduce((acc, k2) => {
    if (obj.hasOwnProperty(k2)) {
      acc[k2] = obj[k2];
    }
    return acc;
  }, {});
}
var NATIVE_SET_TIMEOUT = globalThisShim.setTimeout;
var NATIVE_CLEAR_TIMEOUT = globalThisShim.clearTimeout;
function installTimerFunctions(obj, opts) {
  if (opts.useNativeTimers) {
    obj.setTimeoutFn = NATIVE_SET_TIMEOUT.bind(globalThisShim);
    obj.clearTimeoutFn = NATIVE_CLEAR_TIMEOUT.bind(globalThisShim);
  } else {
    obj.setTimeoutFn = globalThisShim.setTimeout.bind(globalThisShim);
    obj.clearTimeoutFn = globalThisShim.clearTimeout.bind(globalThisShim);
  }
}
var BASE64_OVERHEAD = 1.33;
function byteLength(obj) {
  if (typeof obj === "string") {
    return utf8Length(obj);
  }
  return Math.ceil((obj.byteLength || obj.size) * BASE64_OVERHEAD);
}
function utf8Length(str) {
  let c2 = 0, length = 0;
  for (let i2 = 0, l2 = str.length; i2 < l2; i2++) {
    c2 = str.charCodeAt(i2);
    if (c2 < 128) {
      length += 1;
    } else if (c2 < 2048) {
      length += 2;
    } else if (c2 < 55296 || c2 >= 57344) {
      length += 3;
    } else {
      i2++;
      length += 4;
    }
  }
  return length;
}
function randomString() {
  return Date.now().toString(36).substring(3) + Math.random().toString(36).substring(2, 5);
}

// node_modules/engine.io-client/build/esm/contrib/parseqs.js
function encode(obj) {
  let str = "";
  for (let i2 in obj) {
    if (obj.hasOwnProperty(i2)) {
      if (str.length)
        str += "&";
      str += encodeURIComponent(i2) + "=" + encodeURIComponent(obj[i2]);
    }
  }
  return str;
}
function decode2(qs) {
  let qry = {};
  let pairs = qs.split("&");
  for (let i2 = 0, l2 = pairs.length; i2 < l2; i2++) {
    let pair = pairs[i2].split("=");
    qry[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
  }
  return qry;
}

// node_modules/engine.io-client/build/esm/transport.js
var TransportError = class extends Error {
  constructor(reason, description, context) {
    super(reason);
    this.description = description;
    this.context = context;
    this.type = "TransportError";
  }
};
var Transport = class extends Emitter {
  /**
   * Transport abstract constructor.
   *
   * @param {Object} opts - options
   * @protected
   */
  constructor(opts) {
    super();
    this.writable = false;
    installTimerFunctions(this, opts);
    this.opts = opts;
    this.query = opts.query;
    this.socket = opts.socket;
    this.supportsBinary = !opts.forceBase64;
  }
  /**
   * Emits an error.
   *
   * @param {String} reason
   * @param description
   * @param context - the error context
   * @return {Transport} for chaining
   * @protected
   */
  onError(reason, description, context) {
    super.emitReserved("error", new TransportError(reason, description, context));
    return this;
  }
  /**
   * Opens the transport.
   */
  open() {
    this.readyState = "opening";
    this.doOpen();
    return this;
  }
  /**
   * Closes the transport.
   */
  close() {
    if (this.readyState === "opening" || this.readyState === "open") {
      this.doClose();
      this.onClose();
    }
    return this;
  }
  /**
   * Sends multiple packets.
   *
   * @param {Array} packets
   */
  send(packets) {
    if (this.readyState === "open") {
      this.write(packets);
    } else {
    }
  }
  /**
   * Called upon open
   *
   * @protected
   */
  onOpen() {
    this.readyState = "open";
    this.writable = true;
    super.emitReserved("open");
  }
  /**
   * Called with data.
   *
   * @param {String} data
   * @protected
   */
  onData(data) {
    const packet = decodePacket(data, this.socket.binaryType);
    this.onPacket(packet);
  }
  /**
   * Called with a decoded packet.
   *
   * @protected
   */
  onPacket(packet) {
    super.emitReserved("packet", packet);
  }
  /**
   * Called upon close.
   *
   * @protected
   */
  onClose(details) {
    this.readyState = "closed";
    super.emitReserved("close", details);
  }
  /**
   * Pauses the transport, in order not to lose packets during an upgrade.
   *
   * @param onPause
   */
  pause(onPause) {
  }
  createUri(schema, query = {}) {
    return schema + "://" + this._hostname() + this._port() + this.opts.path + this._query(query);
  }
  _hostname() {
    const hostname = this.opts.hostname;
    return hostname.indexOf(":") === -1 ? hostname : "[" + hostname + "]";
  }
  _port() {
    if (this.opts.port && (this.opts.secure && Number(this.opts.port) !== 443 || !this.opts.secure && Number(this.opts.port) !== 80)) {
      return ":" + this.opts.port;
    } else {
      return "";
    }
  }
  _query(query) {
    const encodedQuery = encode(query);
    return encodedQuery.length ? "?" + encodedQuery : "";
  }
};

// node_modules/engine.io-client/build/esm/transports/polling.js
var Polling = class extends Transport {
  constructor() {
    super(...arguments);
    this._polling = false;
  }
  get name() {
    return "polling";
  }
  /**
   * Opens the socket (triggers polling). We write a PING message to determine
   * when the transport is open.
   *
   * @protected
   */
  doOpen() {
    this._poll();
  }
  /**
   * Pauses polling.
   *
   * @param {Function} onPause - callback upon buffers are flushed and transport is paused
   * @package
   */
  pause(onPause) {
    this.readyState = "pausing";
    const pause = () => {
      this.readyState = "paused";
      onPause();
    };
    if (this._polling || !this.writable) {
      let total = 0;
      if (this._polling) {
        total++;
        this.once("pollComplete", function() {
          --total || pause();
        });
      }
      if (!this.writable) {
        total++;
        this.once("drain", function() {
          --total || pause();
        });
      }
    } else {
      pause();
    }
  }
  /**
   * Starts polling cycle.
   *
   * @private
   */
  _poll() {
    this._polling = true;
    this.doPoll();
    this.emitReserved("poll");
  }
  /**
   * Overloads onData to detect payloads.
   *
   * @protected
   */
  onData(data) {
    const callback = (packet) => {
      if ("opening" === this.readyState && packet.type === "open") {
        this.onOpen();
      }
      if ("close" === packet.type) {
        this.onClose({ description: "transport closed by the server" });
        return false;
      }
      this.onPacket(packet);
    };
    decodePayload(data, this.socket.binaryType).forEach(callback);
    if ("closed" !== this.readyState) {
      this._polling = false;
      this.emitReserved("pollComplete");
      if ("open" === this.readyState) {
        this._poll();
      } else {
      }
    }
  }
  /**
   * For polling, send a close packet.
   *
   * @protected
   */
  doClose() {
    const close = () => {
      this.write([{ type: "close" }]);
    };
    if ("open" === this.readyState) {
      close();
    } else {
      this.once("open", close);
    }
  }
  /**
   * Writes a packets payload.
   *
   * @param {Array} packets - data packets
   * @protected
   */
  write(packets) {
    this.writable = false;
    encodePayload(packets, (data) => {
      this.doWrite(data, () => {
        this.writable = true;
        this.emitReserved("drain");
      });
    });
  }
  /**
   * Generates uri for connection.
   *
   * @private
   */
  uri() {
    const schema = this.opts.secure ? "https" : "http";
    const query = this.query || {};
    if (false !== this.opts.timestampRequests) {
      query[this.opts.timestampParam] = randomString();
    }
    if (!this.supportsBinary && !query.sid) {
      query.b64 = 1;
    }
    return this.createUri(schema, query);
  }
};

// node_modules/engine.io-client/build/esm/contrib/has-cors.js
var value = false;
try {
  value = typeof XMLHttpRequest !== "undefined" && "withCredentials" in new XMLHttpRequest();
} catch (err) {
}
var hasCORS = value;

// node_modules/engine.io-client/build/esm/transports/polling-xhr.js
function empty() {
}
var BaseXHR = class extends Polling {
  /**
   * XHR Polling constructor.
   *
   * @param {Object} opts
   * @package
   */
  constructor(opts) {
    super(opts);
    if (typeof location !== "undefined") {
      const isSSL = "https:" === location.protocol;
      let port = location.port;
      if (!port) {
        port = isSSL ? "443" : "80";
      }
      this.xd = typeof location !== "undefined" && opts.hostname !== location.hostname || port !== opts.port;
    }
  }
  /**
   * Sends data.
   *
   * @param {String} data to send.
   * @param {Function} called upon flush.
   * @private
   */
  doWrite(data, fn2) {
    const req = this.request({
      method: "POST",
      data
    });
    req.on("success", fn2);
    req.on("error", (xhrStatus, context) => {
      this.onError("xhr post error", xhrStatus, context);
    });
  }
  /**
   * Starts a poll cycle.
   *
   * @private
   */
  doPoll() {
    const req = this.request();
    req.on("data", this.onData.bind(this));
    req.on("error", (xhrStatus, context) => {
      this.onError("xhr poll error", xhrStatus, context);
    });
    this.pollXhr = req;
  }
};
var Request2 = class _Request extends Emitter {
  /**
   * Request constructor
   *
   * @param {Object} options
   * @package
   */
  constructor(createRequest, uri, opts) {
    super();
    this.createRequest = createRequest;
    installTimerFunctions(this, opts);
    this._opts = opts;
    this._method = opts.method || "GET";
    this._uri = uri;
    this._data = void 0 !== opts.data ? opts.data : null;
    this._create();
  }
  /**
   * Creates the XHR object and sends the request.
   *
   * @private
   */
  _create() {
    var _a;
    const opts = pick(this._opts, "agent", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "autoUnref");
    opts.xdomain = !!this._opts.xd;
    const xhr = this._xhr = this.createRequest(opts);
    try {
      xhr.open(this._method, this._uri, true);
      try {
        if (this._opts.extraHeaders) {
          xhr.setDisableHeaderCheck && xhr.setDisableHeaderCheck(true);
          for (let i2 in this._opts.extraHeaders) {
            if (this._opts.extraHeaders.hasOwnProperty(i2)) {
              xhr.setRequestHeader(i2, this._opts.extraHeaders[i2]);
            }
          }
        }
      } catch (e3) {
      }
      if ("POST" === this._method) {
        try {
          xhr.setRequestHeader("Content-type", "text/plain;charset=UTF-8");
        } catch (e3) {
        }
      }
      try {
        xhr.setRequestHeader("Accept", "*/*");
      } catch (e3) {
      }
      (_a = this._opts.cookieJar) === null || _a === void 0 ? void 0 : _a.addCookies(xhr);
      if ("withCredentials" in xhr) {
        xhr.withCredentials = this._opts.withCredentials;
      }
      if (this._opts.requestTimeout) {
        xhr.timeout = this._opts.requestTimeout;
      }
      xhr.onreadystatechange = () => {
        var _a2;
        if (xhr.readyState === 3) {
          (_a2 = this._opts.cookieJar) === null || _a2 === void 0 ? void 0 : _a2.parseCookies(
            // @ts-ignore
            xhr.getResponseHeader("set-cookie")
          );
        }
        if (4 !== xhr.readyState)
          return;
        if (200 === xhr.status || 1223 === xhr.status) {
          this._onLoad();
        } else {
          this.setTimeoutFn(() => {
            this._onError(typeof xhr.status === "number" ? xhr.status : 0);
          }, 0);
        }
      };
      xhr.send(this._data);
    } catch (e3) {
      this.setTimeoutFn(() => {
        this._onError(e3);
      }, 0);
      return;
    }
    if (typeof document !== "undefined") {
      this._index = _Request.requestsCount++;
      _Request.requests[this._index] = this;
    }
  }
  /**
   * Called upon error.
   *
   * @private
   */
  _onError(err) {
    this.emitReserved("error", err, this._xhr);
    this._cleanup(true);
  }
  /**
   * Cleans up house.
   *
   * @private
   */
  _cleanup(fromError) {
    if ("undefined" === typeof this._xhr || null === this._xhr) {
      return;
    }
    this._xhr.onreadystatechange = empty;
    if (fromError) {
      try {
        this._xhr.abort();
      } catch (e3) {
      }
    }
    if (typeof document !== "undefined") {
      delete _Request.requests[this._index];
    }
    this._xhr = null;
  }
  /**
   * Called upon load.
   *
   * @private
   */
  _onLoad() {
    const data = this._xhr.responseText;
    if (data !== null) {
      this.emitReserved("data", data);
      this.emitReserved("success");
      this._cleanup();
    }
  }
  /**
   * Aborts the request.
   *
   * @package
   */
  abort() {
    this._cleanup();
  }
};
Request2.requestsCount = 0;
Request2.requests = {};
if (typeof document !== "undefined") {
  if (typeof attachEvent === "function") {
    attachEvent("onunload", unloadHandler);
  } else if (typeof addEventListener === "function") {
    const terminationEvent = "onpagehide" in globalThisShim ? "pagehide" : "unload";
    addEventListener(terminationEvent, unloadHandler, false);
  }
}
function unloadHandler() {
  for (let i2 in Request2.requests) {
    if (Request2.requests.hasOwnProperty(i2)) {
      Request2.requests[i2].abort();
    }
  }
}
var hasXHR2 = (function() {
  const xhr = newRequest({
    xdomain: false
  });
  return xhr && xhr.responseType !== null;
})();
var XHR = class extends BaseXHR {
  constructor(opts) {
    super(opts);
    const forceBase64 = opts && opts.forceBase64;
    this.supportsBinary = hasXHR2 && !forceBase64;
  }
  request(opts = {}) {
    Object.assign(opts, { xd: this.xd }, this.opts);
    return new Request2(newRequest, this.uri(), opts);
  }
};
function newRequest(opts) {
  const xdomain = opts.xdomain;
  try {
    if ("undefined" !== typeof XMLHttpRequest && (!xdomain || hasCORS)) {
      return new XMLHttpRequest();
    }
  } catch (e3) {
  }
  if (!xdomain) {
    try {
      return new globalThisShim[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP");
    } catch (e3) {
    }
  }
}

// node_modules/engine.io-client/build/esm/transports/websocket.js
var isReactNative = typeof navigator !== "undefined" && typeof navigator.product === "string" && navigator.product.toLowerCase() === "reactnative";
var BaseWS = class extends Transport {
  get name() {
    return "websocket";
  }
  doOpen() {
    const uri = this.uri();
    const protocols = this.opts.protocols;
    const opts = isReactNative ? {} : pick(this.opts, "agent", "perMessageDeflate", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "localAddress", "protocolVersion", "origin", "maxPayload", "family", "checkServerIdentity");
    if (this.opts.extraHeaders) {
      opts.headers = this.opts.extraHeaders;
    }
    try {
      this.ws = this.createSocket(uri, protocols, opts);
    } catch (err) {
      return this.emitReserved("error", err);
    }
    this.ws.binaryType = this.socket.binaryType;
    this.addEventListeners();
  }
  /**
   * Adds event listeners to the socket
   *
   * @private
   */
  addEventListeners() {
    this.ws.onopen = () => {
      if (this.opts.autoUnref) {
        this.ws._socket.unref();
      }
      this.onOpen();
    };
    this.ws.onclose = (closeEvent) => this.onClose({
      description: "websocket connection closed",
      context: closeEvent
    });
    this.ws.onmessage = (ev) => this.onData(ev.data);
    this.ws.onerror = (e3) => this.onError("websocket error", e3);
  }
  write(packets) {
    this.writable = false;
    for (let i2 = 0; i2 < packets.length; i2++) {
      const packet = packets[i2];
      const lastPacket = i2 === packets.length - 1;
      encodePacket(packet, this.supportsBinary, (data) => {
        try {
          this.doWrite(packet, data);
        } catch (e3) {
        }
        if (lastPacket) {
          nextTick(() => {
            this.writable = true;
            this.emitReserved("drain");
          }, this.setTimeoutFn);
        }
      });
    }
  }
  doClose() {
    if (typeof this.ws !== "undefined") {
      this.ws.onerror = () => {
      };
      this.ws.close();
      this.ws = null;
    }
  }
  /**
   * Generates uri for connection.
   *
   * @private
   */
  uri() {
    const schema = this.opts.secure ? "wss" : "ws";
    const query = this.query || {};
    if (this.opts.timestampRequests) {
      query[this.opts.timestampParam] = randomString();
    }
    if (!this.supportsBinary) {
      query.b64 = 1;
    }
    return this.createUri(schema, query);
  }
};
var WebSocketCtor = globalThisShim.WebSocket || globalThisShim.MozWebSocket;
var WS = class extends BaseWS {
  createSocket(uri, protocols, opts) {
    return !isReactNative ? protocols ? new WebSocketCtor(uri, protocols) : new WebSocketCtor(uri) : new WebSocketCtor(uri, protocols, opts);
  }
  doWrite(_packet, data) {
    this.ws.send(data);
  }
};

// node_modules/engine.io-client/build/esm/transports/webtransport.js
var WT = class extends Transport {
  get name() {
    return "webtransport";
  }
  doOpen() {
    try {
      this._transport = new WebTransport(this.createUri("https"), this.opts.transportOptions[this.name]);
    } catch (err) {
      return this.emitReserved("error", err);
    }
    this._transport.closed.then(() => {
      this.onClose();
    }).catch((err) => {
      this.onError("webtransport error", err);
    });
    this._transport.ready.then(() => {
      this._transport.createBidirectionalStream().then((stream) => {
        const decoderStream = createPacketDecoderStream(Number.MAX_SAFE_INTEGER, this.socket.binaryType);
        const reader = stream.readable.pipeThrough(decoderStream).getReader();
        const encoderStream = createPacketEncoderStream();
        encoderStream.readable.pipeTo(stream.writable);
        this._writer = encoderStream.writable.getWriter();
        const read = () => {
          reader.read().then(({ done, value: value2 }) => {
            if (done) {
              return;
            }
            this.onPacket(value2);
            read();
          }).catch((err) => {
          });
        };
        read();
        const packet = { type: "open" };
        if (this.query.sid) {
          packet.data = `{"sid":"${this.query.sid}"}`;
        }
        this._writer.write(packet).then(() => this.onOpen());
      });
    });
  }
  write(packets) {
    this.writable = false;
    for (let i2 = 0; i2 < packets.length; i2++) {
      const packet = packets[i2];
      const lastPacket = i2 === packets.length - 1;
      this._writer.write(packet).then(() => {
        if (lastPacket) {
          nextTick(() => {
            this.writable = true;
            this.emitReserved("drain");
          }, this.setTimeoutFn);
        }
      });
    }
  }
  doClose() {
    var _a;
    (_a = this._transport) === null || _a === void 0 ? void 0 : _a.close();
  }
};

// node_modules/engine.io-client/build/esm/transports/index.js
var transports = {
  websocket: WS,
  webtransport: WT,
  polling: XHR
};

// node_modules/engine.io-client/build/esm/contrib/parseuri.js
var re = /^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;
var parts = [
  "source",
  "protocol",
  "authority",
  "userInfo",
  "user",
  "password",
  "host",
  "port",
  "relative",
  "path",
  "directory",
  "file",
  "query",
  "anchor"
];
function parse(str) {
  if (str.length > 8e3) {
    throw "URI too long";
  }
  const src = str, b2 = str.indexOf("["), e3 = str.indexOf("]");
  if (b2 != -1 && e3 != -1) {
    str = str.substring(0, b2) + str.substring(b2, e3).replace(/:/g, ";") + str.substring(e3, str.length);
  }
  let m2 = re.exec(str || ""), uri = {}, i2 = 14;
  while (i2--) {
    uri[parts[i2]] = m2[i2] || "";
  }
  if (b2 != -1 && e3 != -1) {
    uri.source = src;
    uri.host = uri.host.substring(1, uri.host.length - 1).replace(/;/g, ":");
    uri.authority = uri.authority.replace("[", "").replace("]", "").replace(/;/g, ":");
    uri.ipv6uri = true;
  }
  uri.pathNames = pathNames(uri, uri["path"]);
  uri.queryKey = queryKey(uri, uri["query"]);
  return uri;
}
function pathNames(obj, path2) {
  const regx = /\/{2,9}/g, names = path2.replace(regx, "/").split("/");
  if (path2.slice(0, 1) == "/" || path2.length === 0) {
    names.splice(0, 1);
  }
  if (path2.slice(-1) == "/") {
    names.splice(names.length - 1, 1);
  }
  return names;
}
function queryKey(uri, query) {
  const data = {};
  query.replace(/(?:^|&)([^&=]*)=?([^&]*)/g, function($0, $1, $2) {
    if ($1) {
      data[$1] = $2;
    }
  });
  return data;
}

// node_modules/engine.io-client/build/esm/socket.js
var withEventListeners = typeof addEventListener === "function" && typeof removeEventListener === "function";
var OFFLINE_EVENT_LISTENERS = [];
if (withEventListeners) {
  addEventListener("offline", () => {
    OFFLINE_EVENT_LISTENERS.forEach((listener) => listener());
  }, false);
}
var SocketWithoutUpgrade = class _SocketWithoutUpgrade extends Emitter {
  /**
   * Socket constructor.
   *
   * @param {String|Object} uri - uri or options
   * @param {Object} opts - options
   */
  constructor(uri, opts) {
    super();
    this.binaryType = defaultBinaryType;
    this.writeBuffer = [];
    this._prevBufferLen = 0;
    this._pingInterval = -1;
    this._pingTimeout = -1;
    this._maxPayload = -1;
    this._pingTimeoutTime = Infinity;
    if (uri && "object" === typeof uri) {
      opts = uri;
      uri = null;
    }
    if (uri) {
      const parsedUri = parse(uri);
      opts.hostname = parsedUri.host;
      opts.secure = parsedUri.protocol === "https" || parsedUri.protocol === "wss";
      opts.port = parsedUri.port;
      if (parsedUri.query)
        opts.query = parsedUri.query;
    } else if (opts.host) {
      opts.hostname = parse(opts.host).host;
    }
    installTimerFunctions(this, opts);
    this.secure = null != opts.secure ? opts.secure : typeof location !== "undefined" && "https:" === location.protocol;
    if (opts.hostname && !opts.port) {
      opts.port = this.secure ? "443" : "80";
    }
    this.hostname = opts.hostname || (typeof location !== "undefined" ? location.hostname : "localhost");
    this.port = opts.port || (typeof location !== "undefined" && location.port ? location.port : this.secure ? "443" : "80");
    this.transports = [];
    this._transportsByName = {};
    opts.transports.forEach((t2) => {
      const transportName = t2.prototype.name;
      this.transports.push(transportName);
      this._transportsByName[transportName] = t2;
    });
    this.opts = Object.assign({
      path: "/engine.io",
      agent: false,
      withCredentials: false,
      upgrade: true,
      timestampParam: "t",
      rememberUpgrade: false,
      addTrailingSlash: true,
      rejectUnauthorized: true,
      perMessageDeflate: {
        threshold: 1024
      },
      transportOptions: {},
      closeOnBeforeunload: false
    }, opts);
    this.opts.path = this.opts.path.replace(/\/$/, "") + (this.opts.addTrailingSlash ? "/" : "");
    if (typeof this.opts.query === "string") {
      this.opts.query = decode2(this.opts.query);
    }
    if (withEventListeners) {
      if (this.opts.closeOnBeforeunload) {
        this._beforeunloadEventListener = () => {
          if (this.transport) {
            this.transport.removeAllListeners();
            this.transport.close();
          }
        };
        addEventListener("beforeunload", this._beforeunloadEventListener, false);
      }
      if (this.hostname !== "localhost") {
        this._offlineEventListener = () => {
          this._onClose("transport close", {
            description: "network connection lost"
          });
        };
        OFFLINE_EVENT_LISTENERS.push(this._offlineEventListener);
      }
    }
    if (this.opts.withCredentials) {
      this._cookieJar = createCookieJar();
    }
    this._open();
  }
  /**
   * Creates transport of the given type.
   *
   * @param {String} name - transport name
   * @return {Transport}
   * @private
   */
  createTransport(name) {
    const query = Object.assign({}, this.opts.query);
    query.EIO = protocol;
    query.transport = name;
    if (this.id)
      query.sid = this.id;
    const opts = Object.assign({}, this.opts, {
      query,
      socket: this,
      hostname: this.hostname,
      secure: this.secure,
      port: this.port
    }, this.opts.transportOptions[name]);
    return new this._transportsByName[name](opts);
  }
  /**
   * Initializes transport to use and starts probe.
   *
   * @private
   */
  _open() {
    if (this.transports.length === 0) {
      this.setTimeoutFn(() => {
        this.emitReserved("error", "No transports available");
      }, 0);
      return;
    }
    const transportName = this.opts.rememberUpgrade && _SocketWithoutUpgrade.priorWebsocketSuccess && this.transports.indexOf("websocket") !== -1 ? "websocket" : this.transports[0];
    this.readyState = "opening";
    const transport = this.createTransport(transportName);
    transport.open();
    this.setTransport(transport);
  }
  /**
   * Sets the current transport. Disables the existing one (if any).
   *
   * @private
   */
  setTransport(transport) {
    if (this.transport) {
      this.transport.removeAllListeners();
    }
    this.transport = transport;
    transport.on("drain", this._onDrain.bind(this)).on("packet", this._onPacket.bind(this)).on("error", this._onError.bind(this)).on("close", (reason) => this._onClose("transport close", reason));
  }
  /**
   * Called when connection is deemed open.
   *
   * @private
   */
  onOpen() {
    this.readyState = "open";
    _SocketWithoutUpgrade.priorWebsocketSuccess = "websocket" === this.transport.name;
    this.emitReserved("open");
    this.flush();
  }
  /**
   * Handles a packet.
   *
   * @private
   */
  _onPacket(packet) {
    if ("opening" === this.readyState || "open" === this.readyState || "closing" === this.readyState) {
      this.emitReserved("packet", packet);
      this.emitReserved("heartbeat");
      switch (packet.type) {
        case "open":
          this.onHandshake(JSON.parse(packet.data));
          break;
        case "ping":
          this._sendPacket("pong");
          this.emitReserved("ping");
          this.emitReserved("pong");
          this._resetPingTimeout();
          break;
        case "error":
          const err = new Error("server error");
          err.code = packet.data;
          this._onError(err);
          break;
        case "message":
          this.emitReserved("data", packet.data);
          this.emitReserved("message", packet.data);
          break;
      }
    } else {
    }
  }
  /**
   * Called upon handshake completion.
   *
   * @param {Object} data - handshake obj
   * @private
   */
  onHandshake(data) {
    this.emitReserved("handshake", data);
    this.id = data.sid;
    this.transport.query.sid = data.sid;
    this._pingInterval = data.pingInterval;
    this._pingTimeout = data.pingTimeout;
    this._maxPayload = data.maxPayload;
    this.onOpen();
    if ("closed" === this.readyState)
      return;
    this._resetPingTimeout();
  }
  /**
   * Sets and resets ping timeout timer based on server pings.
   *
   * @private
   */
  _resetPingTimeout() {
    this.clearTimeoutFn(this._pingTimeoutTimer);
    const delay = this._pingInterval + this._pingTimeout;
    this._pingTimeoutTime = Date.now() + delay;
    this._pingTimeoutTimer = this.setTimeoutFn(() => {
      this._onClose("ping timeout");
    }, delay);
    if (this.opts.autoUnref) {
      this._pingTimeoutTimer.unref();
    }
  }
  /**
   * Called on `drain` event
   *
   * @private
   */
  _onDrain() {
    this.writeBuffer.splice(0, this._prevBufferLen);
    this._prevBufferLen = 0;
    if (0 === this.writeBuffer.length) {
      this.emitReserved("drain");
    } else {
      this.flush();
    }
  }
  /**
   * Flush write buffers.
   *
   * @private
   */
  flush() {
    if ("closed" !== this.readyState && this.transport.writable && !this.upgrading && this.writeBuffer.length) {
      const packets = this._getWritablePackets();
      this.transport.send(packets);
      this._prevBufferLen = packets.length;
      this.emitReserved("flush");
    }
  }
  /**
   * Ensure the encoded size of the writeBuffer is below the maxPayload value sent by the server (only for HTTP
   * long-polling)
   *
   * @private
   */
  _getWritablePackets() {
    const shouldCheckPayloadSize = this._maxPayload && this.transport.name === "polling" && this.writeBuffer.length > 1;
    if (!shouldCheckPayloadSize) {
      return this.writeBuffer;
    }
    let payloadSize = 1;
    for (let i2 = 0; i2 < this.writeBuffer.length; i2++) {
      const data = this.writeBuffer[i2].data;
      if (data) {
        payloadSize += byteLength(data);
      }
      if (i2 > 0 && payloadSize > this._maxPayload) {
        return this.writeBuffer.slice(0, i2);
      }
      payloadSize += 2;
    }
    return this.writeBuffer;
  }
  /**
   * Checks whether the heartbeat timer has expired but the socket has not yet been notified.
   *
   * Note: this method is private for now because it does not really fit the WebSocket API, but if we put it in the
   * `write()` method then the message would not be buffered by the Socket.IO client.
   *
   * @return {boolean}
   * @private
   */
  /* private */
  _hasPingExpired() {
    if (!this._pingTimeoutTime)
      return true;
    const hasExpired = Date.now() > this._pingTimeoutTime;
    if (hasExpired) {
      this._pingTimeoutTime = 0;
      nextTick(() => {
        this._onClose("ping timeout");
      }, this.setTimeoutFn);
    }
    return hasExpired;
  }
  /**
   * Sends a message.
   *
   * @param {String} msg - message.
   * @param {Object} options.
   * @param {Function} fn - callback function.
   * @return {Socket} for chaining.
   */
  write(msg, options, fn2) {
    this._sendPacket("message", msg, options, fn2);
    return this;
  }
  /**
   * Sends a message. Alias of {@link Socket#write}.
   *
   * @param {String} msg - message.
   * @param {Object} options.
   * @param {Function} fn - callback function.
   * @return {Socket} for chaining.
   */
  send(msg, options, fn2) {
    this._sendPacket("message", msg, options, fn2);
    return this;
  }
  /**
   * Sends a packet.
   *
   * @param {String} type: packet type.
   * @param {String} data.
   * @param {Object} options.
   * @param {Function} fn - callback function.
   * @private
   */
  _sendPacket(type, data, options, fn2) {
    if ("function" === typeof data) {
      fn2 = data;
      data = void 0;
    }
    if ("function" === typeof options) {
      fn2 = options;
      options = null;
    }
    if ("closing" === this.readyState || "closed" === this.readyState) {
      return;
    }
    options = options || {};
    options.compress = false !== options.compress;
    const packet = {
      type,
      data,
      options
    };
    this.emitReserved("packetCreate", packet);
    this.writeBuffer.push(packet);
    if (fn2)
      this.once("flush", fn2);
    this.flush();
  }
  /**
   * Closes the connection.
   */
  close() {
    const close = () => {
      this._onClose("forced close");
      this.transport.close();
    };
    const cleanupAndClose = () => {
      this.off("upgrade", cleanupAndClose);
      this.off("upgradeError", cleanupAndClose);
      close();
    };
    const waitForUpgrade = () => {
      this.once("upgrade", cleanupAndClose);
      this.once("upgradeError", cleanupAndClose);
    };
    if ("opening" === this.readyState || "open" === this.readyState) {
      this.readyState = "closing";
      if (this.writeBuffer.length) {
        this.once("drain", () => {
          if (this.upgrading) {
            waitForUpgrade();
          } else {
            close();
          }
        });
      } else if (this.upgrading) {
        waitForUpgrade();
      } else {
        close();
      }
    }
    return this;
  }
  /**
   * Called upon transport error
   *
   * @private
   */
  _onError(err) {
    _SocketWithoutUpgrade.priorWebsocketSuccess = false;
    if (this.opts.tryAllTransports && this.transports.length > 1 && this.readyState === "opening") {
      this.transports.shift();
      return this._open();
    }
    this.emitReserved("error", err);
    this._onClose("transport error", err);
  }
  /**
   * Called upon transport close.
   *
   * @private
   */
  _onClose(reason, description) {
    if ("opening" === this.readyState || "open" === this.readyState || "closing" === this.readyState) {
      this.clearTimeoutFn(this._pingTimeoutTimer);
      this.transport.removeAllListeners("close");
      this.transport.close();
      this.transport.removeAllListeners();
      if (withEventListeners) {
        if (this._beforeunloadEventListener) {
          removeEventListener("beforeunload", this._beforeunloadEventListener, false);
        }
        if (this._offlineEventListener) {
          const i2 = OFFLINE_EVENT_LISTENERS.indexOf(this._offlineEventListener);
          if (i2 !== -1) {
            OFFLINE_EVENT_LISTENERS.splice(i2, 1);
          }
        }
      }
      this.readyState = "closed";
      this.id = null;
      this.emitReserved("close", reason, description);
      this.writeBuffer = [];
      this._prevBufferLen = 0;
    }
  }
};
SocketWithoutUpgrade.protocol = protocol;
var SocketWithUpgrade = class extends SocketWithoutUpgrade {
  constructor() {
    super(...arguments);
    this._upgrades = [];
  }
  onOpen() {
    super.onOpen();
    if ("open" === this.readyState && this.opts.upgrade) {
      for (let i2 = 0; i2 < this._upgrades.length; i2++) {
        this._probe(this._upgrades[i2]);
      }
    }
  }
  /**
   * Probes a transport.
   *
   * @param {String} name - transport name
   * @private
   */
  _probe(name) {
    let transport = this.createTransport(name);
    let failed = false;
    SocketWithoutUpgrade.priorWebsocketSuccess = false;
    const onTransportOpen = () => {
      if (failed)
        return;
      transport.send([{ type: "ping", data: "probe" }]);
      transport.once("packet", (msg) => {
        if (failed)
          return;
        if ("pong" === msg.type && "probe" === msg.data) {
          this.upgrading = true;
          this.emitReserved("upgrading", transport);
          if (!transport)
            return;
          SocketWithoutUpgrade.priorWebsocketSuccess = "websocket" === transport.name;
          this.transport.pause(() => {
            if (failed)
              return;
            if ("closed" === this.readyState)
              return;
            cleanup();
            this.setTransport(transport);
            transport.send([{ type: "upgrade" }]);
            this.emitReserved("upgrade", transport);
            transport = null;
            this.upgrading = false;
            this.flush();
          });
        } else {
          const err = new Error("probe error");
          err.transport = transport.name;
          this.emitReserved("upgradeError", err);
        }
      });
    };
    function freezeTransport() {
      if (failed)
        return;
      failed = true;
      cleanup();
      transport.close();
      transport = null;
    }
    const onerror = (err) => {
      const error = new Error("probe error: " + err);
      error.transport = transport.name;
      freezeTransport();
      this.emitReserved("upgradeError", error);
    };
    function onTransportClose() {
      onerror("transport closed");
    }
    function onclose() {
      onerror("socket closed");
    }
    function onupgrade(to2) {
      if (transport && to2.name !== transport.name) {
        freezeTransport();
      }
    }
    const cleanup = () => {
      transport.removeListener("open", onTransportOpen);
      transport.removeListener("error", onerror);
      transport.removeListener("close", onTransportClose);
      this.off("close", onclose);
      this.off("upgrading", onupgrade);
    };
    transport.once("open", onTransportOpen);
    transport.once("error", onerror);
    transport.once("close", onTransportClose);
    this.once("close", onclose);
    this.once("upgrading", onupgrade);
    if (this._upgrades.indexOf("webtransport") !== -1 && name !== "webtransport") {
      this.setTimeoutFn(() => {
        if (!failed) {
          transport.open();
        }
      }, 200);
    } else {
      transport.open();
    }
  }
  onHandshake(data) {
    this._upgrades = this._filterUpgrades(data.upgrades);
    super.onHandshake(data);
  }
  /**
   * Filters upgrades, returning only those matching client transports.
   *
   * @param {Array} upgrades - server upgrades
   * @private
   */
  _filterUpgrades(upgrades) {
    const filteredUpgrades = [];
    for (let i2 = 0; i2 < upgrades.length; i2++) {
      if (~this.transports.indexOf(upgrades[i2]))
        filteredUpgrades.push(upgrades[i2]);
    }
    return filteredUpgrades;
  }
};
var Socket = class extends SocketWithUpgrade {
  constructor(uri, opts = {}) {
    const o2 = typeof uri === "object" ? uri : opts;
    if (!o2.transports || o2.transports && typeof o2.transports[0] === "string") {
      o2.transports = (o2.transports || ["polling", "websocket", "webtransport"]).map((transportName) => transports[transportName]).filter((t2) => !!t2);
    }
    super(uri, o2);
  }
};

// node_modules/engine.io-client/build/esm/index.js
var protocol2 = Socket.protocol;

// node_modules/socket.io-client/build/esm/url.js
function url(uri, path2 = "", loc) {
  let obj = uri;
  loc = loc || typeof location !== "undefined" && location;
  if (null == uri)
    uri = loc.protocol + "//" + loc.host;
  if (typeof uri === "string") {
    if ("/" === uri.charAt(0)) {
      if ("/" === uri.charAt(1)) {
        uri = loc.protocol + uri;
      } else {
        uri = loc.host + uri;
      }
    }
    if (!/^(https?|wss?):\/\//.test(uri)) {
      if ("undefined" !== typeof loc) {
        uri = loc.protocol + "//" + uri;
      } else {
        uri = "https://" + uri;
      }
    }
    obj = parse(uri);
  }
  if (!obj.port) {
    if (/^(http|ws)$/.test(obj.protocol)) {
      obj.port = "80";
    } else if (/^(http|ws)s$/.test(obj.protocol)) {
      obj.port = "443";
    }
  }
  obj.path = obj.path || "/";
  const ipv6 = obj.host.indexOf(":") !== -1;
  const host = ipv6 ? "[" + obj.host + "]" : obj.host;
  obj.id = obj.protocol + "://" + host + ":" + obj.port + path2;
  obj.href = obj.protocol + "://" + host + (loc && loc.port === obj.port ? "" : ":" + obj.port);
  return obj;
}

// node_modules/socket.io-parser/build/esm/index.js
var esm_exports = {};
__export(esm_exports, {
  Decoder: () => Decoder,
  Encoder: () => Encoder,
  PacketType: () => PacketType,
  isPacketValid: () => isPacketValid,
  protocol: () => protocol3
});

// node_modules/socket.io-parser/build/esm/is-binary.js
var withNativeArrayBuffer3 = typeof ArrayBuffer === "function";
var isView2 = (obj) => {
  return typeof ArrayBuffer.isView === "function" ? ArrayBuffer.isView(obj) : obj.buffer instanceof ArrayBuffer;
};
var toString = Object.prototype.toString;
var withNativeBlob2 = typeof Blob === "function" || typeof Blob !== "undefined" && toString.call(Blob) === "[object BlobConstructor]";
var withNativeFile = typeof File === "function" || typeof File !== "undefined" && toString.call(File) === "[object FileConstructor]";
function isBinary(obj) {
  return withNativeArrayBuffer3 && (obj instanceof ArrayBuffer || isView2(obj)) || withNativeBlob2 && obj instanceof Blob || withNativeFile && obj instanceof File;
}
function hasBinary(obj, toJSON) {
  if (!obj || typeof obj !== "object") {
    return false;
  }
  if (Array.isArray(obj)) {
    for (let i2 = 0, l2 = obj.length; i2 < l2; i2++) {
      if (hasBinary(obj[i2])) {
        return true;
      }
    }
    return false;
  }
  if (isBinary(obj)) {
    return true;
  }
  if (obj.toJSON && typeof obj.toJSON === "function" && arguments.length === 1) {
    return hasBinary(obj.toJSON(), true);
  }
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key) && hasBinary(obj[key])) {
      return true;
    }
  }
  return false;
}

// node_modules/socket.io-parser/build/esm/binary.js
function deconstructPacket(packet) {
  const buffers = [];
  const packetData = packet.data;
  const pack = packet;
  pack.data = _deconstructPacket(packetData, buffers);
  pack.attachments = buffers.length;
  return { packet: pack, buffers };
}
function _deconstructPacket(data, buffers) {
  if (!data)
    return data;
  if (isBinary(data)) {
    const placeholder = { _placeholder: true, num: buffers.length };
    buffers.push(data);
    return placeholder;
  } else if (Array.isArray(data)) {
    const newData = new Array(data.length);
    for (let i2 = 0; i2 < data.length; i2++) {
      newData[i2] = _deconstructPacket(data[i2], buffers);
    }
    return newData;
  } else if (typeof data === "object" && !(data instanceof Date)) {
    const newData = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        newData[key] = _deconstructPacket(data[key], buffers);
      }
    }
    return newData;
  }
  return data;
}
function reconstructPacket(packet, buffers) {
  packet.data = _reconstructPacket(packet.data, buffers);
  delete packet.attachments;
  return packet;
}
function _reconstructPacket(data, buffers) {
  if (!data)
    return data;
  if (data && data._placeholder === true) {
    const isIndexValid = typeof data.num === "number" && data.num >= 0 && data.num < buffers.length;
    if (isIndexValid) {
      return buffers[data.num];
    } else {
      throw new Error("illegal attachments");
    }
  } else if (Array.isArray(data)) {
    for (let i2 = 0; i2 < data.length; i2++) {
      data[i2] = _reconstructPacket(data[i2], buffers);
    }
  } else if (typeof data === "object") {
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        data[key] = _reconstructPacket(data[key], buffers);
      }
    }
  }
  return data;
}

// node_modules/socket.io-parser/build/esm/index.js
var RESERVED_EVENTS = [
  "connect",
  // used on the client side
  "connect_error",
  // used on the client side
  "disconnect",
  // used on both sides
  "disconnecting",
  // used on the server side
  "newListener",
  // used by the Node.js EventEmitter
  "removeListener"
  // used by the Node.js EventEmitter
];
var protocol3 = 5;
var PacketType;
(function(PacketType2) {
  PacketType2[PacketType2["CONNECT"] = 0] = "CONNECT";
  PacketType2[PacketType2["DISCONNECT"] = 1] = "DISCONNECT";
  PacketType2[PacketType2["EVENT"] = 2] = "EVENT";
  PacketType2[PacketType2["ACK"] = 3] = "ACK";
  PacketType2[PacketType2["CONNECT_ERROR"] = 4] = "CONNECT_ERROR";
  PacketType2[PacketType2["BINARY_EVENT"] = 5] = "BINARY_EVENT";
  PacketType2[PacketType2["BINARY_ACK"] = 6] = "BINARY_ACK";
})(PacketType || (PacketType = {}));
var Encoder = class {
  /**
   * Encoder constructor
   *
   * @param {function} replacer - custom replacer to pass down to JSON.parse
   */
  constructor(replacer) {
    this.replacer = replacer;
  }
  /**
   * Encode a packet as a single string if non-binary, or as a
   * buffer sequence, depending on packet type.
   *
   * @param {Object} obj - packet object
   */
  encode(obj) {
    if (obj.type === PacketType.EVENT || obj.type === PacketType.ACK) {
      if (hasBinary(obj)) {
        return this.encodeAsBinary({
          type: obj.type === PacketType.EVENT ? PacketType.BINARY_EVENT : PacketType.BINARY_ACK,
          nsp: obj.nsp,
          data: obj.data,
          id: obj.id
        });
      }
    }
    return [this.encodeAsString(obj)];
  }
  /**
   * Encode packet as string.
   */
  encodeAsString(obj) {
    let str = "" + obj.type;
    if (obj.type === PacketType.BINARY_EVENT || obj.type === PacketType.BINARY_ACK) {
      str += obj.attachments + "-";
    }
    if (obj.nsp && "/" !== obj.nsp) {
      str += obj.nsp + ",";
    }
    if (null != obj.id) {
      str += obj.id;
    }
    if (null != obj.data) {
      str += JSON.stringify(obj.data, this.replacer);
    }
    return str;
  }
  /**
   * Encode packet as 'buffer sequence' by removing blobs, and
   * deconstructing packet into object with placeholders and
   * a list of buffers.
   */
  encodeAsBinary(obj) {
    const deconstruction = deconstructPacket(obj);
    const pack = this.encodeAsString(deconstruction.packet);
    const buffers = deconstruction.buffers;
    buffers.unshift(pack);
    return buffers;
  }
};
var Decoder = class _Decoder extends Emitter {
  /**
   * Decoder constructor
   *
   * @param {function} reviver - custom reviver to pass down to JSON.stringify
   */
  constructor(reviver) {
    super();
    this.reviver = reviver;
  }
  /**
   * Decodes an encoded packet string into packet JSON.
   *
   * @param {String} obj - encoded packet
   */
  add(obj) {
    let packet;
    if (typeof obj === "string") {
      if (this.reconstructor) {
        throw new Error("got plaintext data when reconstructing a packet");
      }
      packet = this.decodeString(obj);
      const isBinaryEvent = packet.type === PacketType.BINARY_EVENT;
      if (isBinaryEvent || packet.type === PacketType.BINARY_ACK) {
        packet.type = isBinaryEvent ? PacketType.EVENT : PacketType.ACK;
        this.reconstructor = new BinaryReconstructor(packet);
        if (packet.attachments === 0) {
          super.emitReserved("decoded", packet);
        }
      } else {
        super.emitReserved("decoded", packet);
      }
    } else if (isBinary(obj) || obj.base64) {
      if (!this.reconstructor) {
        throw new Error("got binary data when not reconstructing a packet");
      } else {
        packet = this.reconstructor.takeBinaryData(obj);
        if (packet) {
          this.reconstructor = null;
          super.emitReserved("decoded", packet);
        }
      }
    } else {
      throw new Error("Unknown type: " + obj);
    }
  }
  /**
   * Decode a packet String (JSON data)
   *
   * @param {String} str
   * @return {Object} packet
   */
  decodeString(str) {
    let i2 = 0;
    const p2 = {
      type: Number(str.charAt(0))
    };
    if (PacketType[p2.type] === void 0) {
      throw new Error("unknown packet type " + p2.type);
    }
    if (p2.type === PacketType.BINARY_EVENT || p2.type === PacketType.BINARY_ACK) {
      const start = i2 + 1;
      while (str.charAt(++i2) !== "-" && i2 != str.length) {
      }
      const buf = str.substring(start, i2);
      if (buf != Number(buf) || str.charAt(i2) !== "-") {
        throw new Error("Illegal attachments");
      }
      p2.attachments = Number(buf);
    }
    if ("/" === str.charAt(i2 + 1)) {
      const start = i2 + 1;
      while (++i2) {
        const c2 = str.charAt(i2);
        if ("," === c2)
          break;
        if (i2 === str.length)
          break;
      }
      p2.nsp = str.substring(start, i2);
    } else {
      p2.nsp = "/";
    }
    const next = str.charAt(i2 + 1);
    if ("" !== next && Number(next) == next) {
      const start = i2 + 1;
      while (++i2) {
        const c2 = str.charAt(i2);
        if (null == c2 || Number(c2) != c2) {
          --i2;
          break;
        }
        if (i2 === str.length)
          break;
      }
      p2.id = Number(str.substring(start, i2 + 1));
    }
    if (str.charAt(++i2)) {
      const payload = this.tryParse(str.substr(i2));
      if (_Decoder.isPayloadValid(p2.type, payload)) {
        p2.data = payload;
      } else {
        throw new Error("invalid payload");
      }
    }
    return p2;
  }
  tryParse(str) {
    try {
      return JSON.parse(str, this.reviver);
    } catch (e3) {
      return false;
    }
  }
  static isPayloadValid(type, payload) {
    switch (type) {
      case PacketType.CONNECT:
        return isObject(payload);
      case PacketType.DISCONNECT:
        return payload === void 0;
      case PacketType.CONNECT_ERROR:
        return typeof payload === "string" || isObject(payload);
      case PacketType.EVENT:
      case PacketType.BINARY_EVENT:
        return Array.isArray(payload) && (typeof payload[0] === "number" || typeof payload[0] === "string" && RESERVED_EVENTS.indexOf(payload[0]) === -1);
      case PacketType.ACK:
      case PacketType.BINARY_ACK:
        return Array.isArray(payload);
    }
  }
  /**
   * Deallocates a parser's resources
   */
  destroy() {
    if (this.reconstructor) {
      this.reconstructor.finishedReconstruction();
      this.reconstructor = null;
    }
  }
};
var BinaryReconstructor = class {
  constructor(packet) {
    this.packet = packet;
    this.buffers = [];
    this.reconPack = packet;
  }
  /**
   * Method to be called when binary data received from connection
   * after a BINARY_EVENT packet.
   *
   * @param {Buffer | ArrayBuffer} binData - the raw binary data received
   * @return {null | Object} returns null if more binary data is expected or
   *   a reconstructed packet object if all buffers have been received.
   */
  takeBinaryData(binData) {
    this.buffers.push(binData);
    if (this.buffers.length === this.reconPack.attachments) {
      const packet = reconstructPacket(this.reconPack, this.buffers);
      this.finishedReconstruction();
      return packet;
    }
    return null;
  }
  /**
   * Cleans up binary packet reconstruction variables.
   */
  finishedReconstruction() {
    this.reconPack = null;
    this.buffers = [];
  }
};
function isNamespaceValid(nsp) {
  return typeof nsp === "string";
}
var isInteger = Number.isInteger || function(value2) {
  return typeof value2 === "number" && isFinite(value2) && Math.floor(value2) === value2;
};
function isAckIdValid(id) {
  return id === void 0 || isInteger(id);
}
function isObject(value2) {
  return Object.prototype.toString.call(value2) === "[object Object]";
}
function isDataValid(type, payload) {
  switch (type) {
    case PacketType.CONNECT:
      return payload === void 0 || isObject(payload);
    case PacketType.DISCONNECT:
      return payload === void 0;
    case PacketType.EVENT:
      return Array.isArray(payload) && (typeof payload[0] === "number" || typeof payload[0] === "string" && RESERVED_EVENTS.indexOf(payload[0]) === -1);
    case PacketType.ACK:
      return Array.isArray(payload);
    case PacketType.CONNECT_ERROR:
      return typeof payload === "string" || isObject(payload);
    default:
      return false;
  }
}
function isPacketValid(packet) {
  return isNamespaceValid(packet.nsp) && isAckIdValid(packet.id) && isDataValid(packet.type, packet.data);
}

// node_modules/socket.io-client/build/esm/on.js
function on(obj, ev, fn2) {
  obj.on(ev, fn2);
  return function subDestroy() {
    obj.off(ev, fn2);
  };
}

// node_modules/socket.io-client/build/esm/socket.js
var RESERVED_EVENTS2 = Object.freeze({
  connect: 1,
  connect_error: 1,
  disconnect: 1,
  disconnecting: 1,
  // EventEmitter reserved events: https://nodejs.org/api/events.html#events_event_newlistener
  newListener: 1,
  removeListener: 1
});
var Socket2 = class extends Emitter {
  /**
   * `Socket` constructor.
   */
  constructor(io2, nsp, opts) {
    super();
    this.connected = false;
    this.recovered = false;
    this.receiveBuffer = [];
    this.sendBuffer = [];
    this._queue = [];
    this._queueSeq = 0;
    this.ids = 0;
    this.acks = {};
    this.flags = {};
    this.io = io2;
    this.nsp = nsp;
    if (opts && opts.auth) {
      this.auth = opts.auth;
    }
    this._opts = Object.assign({}, opts);
    if (this.io._autoConnect)
      this.open();
  }
  /**
   * Whether the socket is currently disconnected
   *
   * @example
   * const socket = io();
   *
   * socket.on("connect", () => {
   *   console.log(socket.disconnected); // false
   * });
   *
   * socket.on("disconnect", () => {
   *   console.log(socket.disconnected); // true
   * });
   */
  get disconnected() {
    return !this.connected;
  }
  /**
   * Subscribe to open, close and packet events
   *
   * @private
   */
  subEvents() {
    if (this.subs)
      return;
    const io2 = this.io;
    this.subs = [
      on(io2, "open", this.onopen.bind(this)),
      on(io2, "packet", this.onpacket.bind(this)),
      on(io2, "error", this.onerror.bind(this)),
      on(io2, "close", this.onclose.bind(this))
    ];
  }
  /**
   * Whether the Socket will try to reconnect when its Manager connects or reconnects.
   *
   * @example
   * const socket = io();
   *
   * console.log(socket.active); // true
   *
   * socket.on("disconnect", (reason) => {
   *   if (reason === "io server disconnect") {
   *     // the disconnection was initiated by the server, you need to manually reconnect
   *     console.log(socket.active); // false
   *   }
   *   // else the socket will automatically try to reconnect
   *   console.log(socket.active); // true
   * });
   */
  get active() {
    return !!this.subs;
  }
  /**
   * "Opens" the socket.
   *
   * @example
   * const socket = io({
   *   autoConnect: false
   * });
   *
   * socket.connect();
   */
  connect() {
    if (this.connected)
      return this;
    this.subEvents();
    if (!this.io["_reconnecting"])
      this.io.open();
    if ("open" === this.io._readyState)
      this.onopen();
    return this;
  }
  /**
   * Alias for {@link connect()}.
   */
  open() {
    return this.connect();
  }
  /**
   * Sends a `message` event.
   *
   * This method mimics the WebSocket.send() method.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/send
   *
   * @example
   * socket.send("hello");
   *
   * // this is equivalent to
   * socket.emit("message", "hello");
   *
   * @return self
   */
  send(...args) {
    args.unshift("message");
    this.emit.apply(this, args);
    return this;
  }
  /**
   * Override `emit`.
   * If the event is in `events`, it's emitted normally.
   *
   * @example
   * socket.emit("hello", "world");
   *
   * // all serializable datastructures are supported (no need to call JSON.stringify)
   * socket.emit("hello", 1, "2", { 3: ["4"], 5: Uint8Array.from([6]) });
   *
   * // with an acknowledgement from the server
   * socket.emit("hello", "world", (val) => {
   *   // ...
   * });
   *
   * @return self
   */
  emit(ev, ...args) {
    var _a, _b, _c;
    if (RESERVED_EVENTS2.hasOwnProperty(ev)) {
      throw new Error('"' + ev.toString() + '" is a reserved event name');
    }
    args.unshift(ev);
    if (this._opts.retries && !this.flags.fromQueue && !this.flags.volatile) {
      this._addToQueue(args);
      return this;
    }
    const packet = {
      type: PacketType.EVENT,
      data: args
    };
    packet.options = {};
    packet.options.compress = this.flags.compress !== false;
    if ("function" === typeof args[args.length - 1]) {
      const id = this.ids++;
      const ack = args.pop();
      this._registerAckCallback(id, ack);
      packet.id = id;
    }
    const isTransportWritable = (_b = (_a = this.io.engine) === null || _a === void 0 ? void 0 : _a.transport) === null || _b === void 0 ? void 0 : _b.writable;
    const isConnected = this.connected && !((_c = this.io.engine) === null || _c === void 0 ? void 0 : _c._hasPingExpired());
    const discardPacket = this.flags.volatile && !isTransportWritable;
    if (discardPacket) {
    } else if (isConnected) {
      this.notifyOutgoingListeners(packet);
      this.packet(packet);
    } else {
      this.sendBuffer.push(packet);
    }
    this.flags = {};
    return this;
  }
  /**
   * @private
   */
  _registerAckCallback(id, ack) {
    var _a;
    const timeout = (_a = this.flags.timeout) !== null && _a !== void 0 ? _a : this._opts.ackTimeout;
    if (timeout === void 0) {
      this.acks[id] = ack;
      return;
    }
    const timer = this.io.setTimeoutFn(() => {
      delete this.acks[id];
      for (let i2 = 0; i2 < this.sendBuffer.length; i2++) {
        if (this.sendBuffer[i2].id === id) {
          this.sendBuffer.splice(i2, 1);
        }
      }
      ack.call(this, new Error("operation has timed out"));
    }, timeout);
    const fn2 = (...args) => {
      this.io.clearTimeoutFn(timer);
      ack.apply(this, args);
    };
    fn2.withError = true;
    this.acks[id] = fn2;
  }
  /**
   * Emits an event and waits for an acknowledgement
   *
   * @example
   * // without timeout
   * const response = await socket.emitWithAck("hello", "world");
   *
   * // with a specific timeout
   * try {
   *   const response = await socket.timeout(1000).emitWithAck("hello", "world");
   * } catch (err) {
   *   // the server did not acknowledge the event in the given delay
   * }
   *
   * @return a Promise that will be fulfilled when the server acknowledges the event
   */
  emitWithAck(ev, ...args) {
    return new Promise((resolve, reject) => {
      const fn2 = (arg1, arg2) => {
        return arg1 ? reject(arg1) : resolve(arg2);
      };
      fn2.withError = true;
      args.push(fn2);
      this.emit(ev, ...args);
    });
  }
  /**
   * Add the packet to the queue.
   * @param args
   * @private
   */
  _addToQueue(args) {
    let ack;
    if (typeof args[args.length - 1] === "function") {
      ack = args.pop();
    }
    const packet = {
      id: this._queueSeq++,
      tryCount: 0,
      pending: false,
      args,
      flags: Object.assign({ fromQueue: true }, this.flags)
    };
    args.push((err, ...responseArgs) => {
      if (packet !== this._queue[0]) {
      }
      const hasError = err !== null;
      if (hasError) {
        if (packet.tryCount > this._opts.retries) {
          this._queue.shift();
          if (ack) {
            ack(err);
          }
        }
      } else {
        this._queue.shift();
        if (ack) {
          ack(null, ...responseArgs);
        }
      }
      packet.pending = false;
      return this._drainQueue();
    });
    this._queue.push(packet);
    this._drainQueue();
  }
  /**
   * Send the first packet of the queue, and wait for an acknowledgement from the server.
   * @param force - whether to resend a packet that has not been acknowledged yet
   *
   * @private
   */
  _drainQueue(force = false) {
    if (!this.connected || this._queue.length === 0) {
      return;
    }
    const packet = this._queue[0];
    if (packet.pending && !force) {
      return;
    }
    packet.pending = true;
    packet.tryCount++;
    this.flags = packet.flags;
    this.emit.apply(this, packet.args);
  }
  /**
   * Sends a packet.
   *
   * @param packet
   * @private
   */
  packet(packet) {
    packet.nsp = this.nsp;
    this.io._packet(packet);
  }
  /**
   * Called upon engine `open`.
   *
   * @private
   */
  onopen() {
    if (typeof this.auth == "function") {
      this.auth((data) => {
        this._sendConnectPacket(data);
      });
    } else {
      this._sendConnectPacket(this.auth);
    }
  }
  /**
   * Sends a CONNECT packet to initiate the Socket.IO session.
   *
   * @param data
   * @private
   */
  _sendConnectPacket(data) {
    this.packet({
      type: PacketType.CONNECT,
      data: this._pid ? Object.assign({ pid: this._pid, offset: this._lastOffset }, data) : data
    });
  }
  /**
   * Called upon engine or manager `error`.
   *
   * @param err
   * @private
   */
  onerror(err) {
    if (!this.connected) {
      this.emitReserved("connect_error", err);
    }
  }
  /**
   * Called upon engine `close`.
   *
   * @param reason
   * @param description
   * @private
   */
  onclose(reason, description) {
    this.connected = false;
    delete this.id;
    this.emitReserved("disconnect", reason, description);
    this._clearAcks();
  }
  /**
   * Clears the acknowledgement handlers upon disconnection, since the client will never receive an acknowledgement from
   * the server.
   *
   * @private
   */
  _clearAcks() {
    Object.keys(this.acks).forEach((id) => {
      const isBuffered = this.sendBuffer.some((packet) => String(packet.id) === id);
      if (!isBuffered) {
        const ack = this.acks[id];
        delete this.acks[id];
        if (ack.withError) {
          ack.call(this, new Error("socket has been disconnected"));
        }
      }
    });
  }
  /**
   * Called with socket packet.
   *
   * @param packet
   * @private
   */
  onpacket(packet) {
    const sameNamespace = packet.nsp === this.nsp;
    if (!sameNamespace)
      return;
    switch (packet.type) {
      case PacketType.CONNECT:
        if (packet.data && packet.data.sid) {
          this.onconnect(packet.data.sid, packet.data.pid);
        } else {
          this.emitReserved("connect_error", new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));
        }
        break;
      case PacketType.EVENT:
      case PacketType.BINARY_EVENT:
        this.onevent(packet);
        break;
      case PacketType.ACK:
      case PacketType.BINARY_ACK:
        this.onack(packet);
        break;
      case PacketType.DISCONNECT:
        this.ondisconnect();
        break;
      case PacketType.CONNECT_ERROR:
        this.destroy();
        const err = new Error(packet.data.message);
        err.data = packet.data.data;
        this.emitReserved("connect_error", err);
        break;
    }
  }
  /**
   * Called upon a server event.
   *
   * @param packet
   * @private
   */
  onevent(packet) {
    const args = packet.data || [];
    if (null != packet.id) {
      args.push(this.ack(packet.id));
    }
    if (this.connected) {
      this.emitEvent(args);
    } else {
      this.receiveBuffer.push(Object.freeze(args));
    }
  }
  emitEvent(args) {
    if (this._anyListeners && this._anyListeners.length) {
      const listeners = this._anyListeners.slice();
      for (const listener of listeners) {
        listener.apply(this, args);
      }
    }
    super.emit.apply(this, args);
    if (this._pid && args.length && typeof args[args.length - 1] === "string") {
      this._lastOffset = args[args.length - 1];
    }
  }
  /**
   * Produces an ack callback to emit with an event.
   *
   * @private
   */
  ack(id) {
    const self2 = this;
    let sent = false;
    return function(...args) {
      if (sent)
        return;
      sent = true;
      self2.packet({
        type: PacketType.ACK,
        id,
        data: args
      });
    };
  }
  /**
   * Called upon a server acknowledgement.
   *
   * @param packet
   * @private
   */
  onack(packet) {
    const ack = this.acks[packet.id];
    if (typeof ack !== "function") {
      return;
    }
    delete this.acks[packet.id];
    if (ack.withError) {
      packet.data.unshift(null);
    }
    ack.apply(this, packet.data);
  }
  /**
   * Called upon server connect.
   *
   * @private
   */
  onconnect(id, pid) {
    this.id = id;
    this.recovered = pid && this._pid === pid;
    this._pid = pid;
    this.connected = true;
    this.emitBuffered();
    this._drainQueue(true);
    this.emitReserved("connect");
  }
  /**
   * Emit buffered events (received and emitted).
   *
   * @private
   */
  emitBuffered() {
    this.receiveBuffer.forEach((args) => this.emitEvent(args));
    this.receiveBuffer = [];
    this.sendBuffer.forEach((packet) => {
      this.notifyOutgoingListeners(packet);
      this.packet(packet);
    });
    this.sendBuffer = [];
  }
  /**
   * Called upon server disconnect.
   *
   * @private
   */
  ondisconnect() {
    this.destroy();
    this.onclose("io server disconnect");
  }
  /**
   * Called upon forced client/server side disconnections,
   * this method ensures the manager stops tracking us and
   * that reconnections don't get triggered for this.
   *
   * @private
   */
  destroy() {
    if (this.subs) {
      this.subs.forEach((subDestroy) => subDestroy());
      this.subs = void 0;
    }
    this.io["_destroy"](this);
  }
  /**
   * Disconnects the socket manually. In that case, the socket will not try to reconnect.
   *
   * If this is the last active Socket instance of the {@link Manager}, the low-level connection will be closed.
   *
   * @example
   * const socket = io();
   *
   * socket.on("disconnect", (reason) => {
   *   // console.log(reason); prints "io client disconnect"
   * });
   *
   * socket.disconnect();
   *
   * @return self
   */
  disconnect() {
    if (this.connected) {
      this.packet({ type: PacketType.DISCONNECT });
    }
    this.destroy();
    if (this.connected) {
      this.onclose("io client disconnect");
    }
    return this;
  }
  /**
   * Alias for {@link disconnect()}.
   *
   * @return self
   */
  close() {
    return this.disconnect();
  }
  /**
   * Sets the compress flag.
   *
   * @example
   * socket.compress(false).emit("hello");
   *
   * @param compress - if `true`, compresses the sending data
   * @return self
   */
  compress(compress) {
    this.flags.compress = compress;
    return this;
  }
  /**
   * Sets a modifier for a subsequent event emission that the event message will be dropped when this socket is not
   * ready to send messages.
   *
   * @example
   * socket.volatile.emit("hello"); // the server may or may not receive it
   *
   * @returns self
   */
  get volatile() {
    this.flags.volatile = true;
    return this;
  }
  /**
   * Sets a modifier for a subsequent event emission that the callback will be called with an error when the
   * given number of milliseconds have elapsed without an acknowledgement from the server:
   *
   * @example
   * socket.timeout(5000).emit("my-event", (err) => {
   *   if (err) {
   *     // the server did not acknowledge the event in the given delay
   *   }
   * });
   *
   * @returns self
   */
  timeout(timeout) {
    this.flags.timeout = timeout;
    return this;
  }
  /**
   * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
   * callback.
   *
   * @example
   * socket.onAny((event, ...args) => {
   *   console.log(`got ${event}`);
   * });
   *
   * @param listener
   */
  onAny(listener) {
    this._anyListeners = this._anyListeners || [];
    this._anyListeners.push(listener);
    return this;
  }
  /**
   * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
   * callback. The listener is added to the beginning of the listeners array.
   *
   * @example
   * socket.prependAny((event, ...args) => {
   *   console.log(`got event ${event}`);
   * });
   *
   * @param listener
   */
  prependAny(listener) {
    this._anyListeners = this._anyListeners || [];
    this._anyListeners.unshift(listener);
    return this;
  }
  /**
   * Removes the listener that will be fired when any event is emitted.
   *
   * @example
   * const catchAllListener = (event, ...args) => {
   *   console.log(`got event ${event}`);
   * }
   *
   * socket.onAny(catchAllListener);
   *
   * // remove a specific listener
   * socket.offAny(catchAllListener);
   *
   * // or remove all listeners
   * socket.offAny();
   *
   * @param listener
   */
  offAny(listener) {
    if (!this._anyListeners) {
      return this;
    }
    if (listener) {
      const listeners = this._anyListeners;
      for (let i2 = 0; i2 < listeners.length; i2++) {
        if (listener === listeners[i2]) {
          listeners.splice(i2, 1);
          return this;
        }
      }
    } else {
      this._anyListeners = [];
    }
    return this;
  }
  /**
   * Returns an array of listeners that are listening for any event that is specified. This array can be manipulated,
   * e.g. to remove listeners.
   */
  listenersAny() {
    return this._anyListeners || [];
  }
  /**
   * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
   * callback.
   *
   * Note: acknowledgements sent to the server are not included.
   *
   * @example
   * socket.onAnyOutgoing((event, ...args) => {
   *   console.log(`sent event ${event}`);
   * });
   *
   * @param listener
   */
  onAnyOutgoing(listener) {
    this._anyOutgoingListeners = this._anyOutgoingListeners || [];
    this._anyOutgoingListeners.push(listener);
    return this;
  }
  /**
   * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
   * callback. The listener is added to the beginning of the listeners array.
   *
   * Note: acknowledgements sent to the server are not included.
   *
   * @example
   * socket.prependAnyOutgoing((event, ...args) => {
   *   console.log(`sent event ${event}`);
   * });
   *
   * @param listener
   */
  prependAnyOutgoing(listener) {
    this._anyOutgoingListeners = this._anyOutgoingListeners || [];
    this._anyOutgoingListeners.unshift(listener);
    return this;
  }
  /**
   * Removes the listener that will be fired when any event is emitted.
   *
   * @example
   * const catchAllListener = (event, ...args) => {
   *   console.log(`sent event ${event}`);
   * }
   *
   * socket.onAnyOutgoing(catchAllListener);
   *
   * // remove a specific listener
   * socket.offAnyOutgoing(catchAllListener);
   *
   * // or remove all listeners
   * socket.offAnyOutgoing();
   *
   * @param [listener] - the catch-all listener (optional)
   */
  offAnyOutgoing(listener) {
    if (!this._anyOutgoingListeners) {
      return this;
    }
    if (listener) {
      const listeners = this._anyOutgoingListeners;
      for (let i2 = 0; i2 < listeners.length; i2++) {
        if (listener === listeners[i2]) {
          listeners.splice(i2, 1);
          return this;
        }
      }
    } else {
      this._anyOutgoingListeners = [];
    }
    return this;
  }
  /**
   * Returns an array of listeners that are listening for any event that is specified. This array can be manipulated,
   * e.g. to remove listeners.
   */
  listenersAnyOutgoing() {
    return this._anyOutgoingListeners || [];
  }
  /**
   * Notify the listeners for each packet sent
   *
   * @param packet
   *
   * @private
   */
  notifyOutgoingListeners(packet) {
    if (this._anyOutgoingListeners && this._anyOutgoingListeners.length) {
      const listeners = this._anyOutgoingListeners.slice();
      for (const listener of listeners) {
        listener.apply(this, packet.data);
      }
    }
  }
};

// node_modules/socket.io-client/build/esm/contrib/backo2.js
function Backoff(opts) {
  opts = opts || {};
  this.ms = opts.min || 100;
  this.max = opts.max || 1e4;
  this.factor = opts.factor || 2;
  this.jitter = opts.jitter > 0 && opts.jitter <= 1 ? opts.jitter : 0;
  this.attempts = 0;
}
Backoff.prototype.duration = function() {
  var ms = this.ms * Math.pow(this.factor, this.attempts++);
  if (this.jitter) {
    var rand = Math.random();
    var deviation = Math.floor(rand * this.jitter * ms);
    ms = (Math.floor(rand * 10) & 1) == 0 ? ms - deviation : ms + deviation;
  }
  return Math.min(ms, this.max) | 0;
};
Backoff.prototype.reset = function() {
  this.attempts = 0;
};
Backoff.prototype.setMin = function(min) {
  this.ms = min;
};
Backoff.prototype.setMax = function(max) {
  this.max = max;
};
Backoff.prototype.setJitter = function(jitter) {
  this.jitter = jitter;
};

// node_modules/socket.io-client/build/esm/manager.js
var Manager = class extends Emitter {
  constructor(uri, opts) {
    var _a;
    super();
    this.nsps = {};
    this.subs = [];
    if (uri && "object" === typeof uri) {
      opts = uri;
      uri = void 0;
    }
    opts = opts || {};
    opts.path = opts.path || "/socket.io";
    this.opts = opts;
    installTimerFunctions(this, opts);
    this.reconnection(opts.reconnection !== false);
    this.reconnectionAttempts(opts.reconnectionAttempts || Infinity);
    this.reconnectionDelay(opts.reconnectionDelay || 1e3);
    this.reconnectionDelayMax(opts.reconnectionDelayMax || 5e3);
    this.randomizationFactor((_a = opts.randomizationFactor) !== null && _a !== void 0 ? _a : 0.5);
    this.backoff = new Backoff({
      min: this.reconnectionDelay(),
      max: this.reconnectionDelayMax(),
      jitter: this.randomizationFactor()
    });
    this.timeout(null == opts.timeout ? 2e4 : opts.timeout);
    this._readyState = "closed";
    this.uri = uri;
    const _parser = opts.parser || esm_exports;
    this.encoder = new _parser.Encoder();
    this.decoder = new _parser.Decoder();
    this._autoConnect = opts.autoConnect !== false;
    if (this._autoConnect)
      this.open();
  }
  reconnection(v2) {
    if (!arguments.length)
      return this._reconnection;
    this._reconnection = !!v2;
    if (!v2) {
      this.skipReconnect = true;
    }
    return this;
  }
  reconnectionAttempts(v2) {
    if (v2 === void 0)
      return this._reconnectionAttempts;
    this._reconnectionAttempts = v2;
    return this;
  }
  reconnectionDelay(v2) {
    var _a;
    if (v2 === void 0)
      return this._reconnectionDelay;
    this._reconnectionDelay = v2;
    (_a = this.backoff) === null || _a === void 0 ? void 0 : _a.setMin(v2);
    return this;
  }
  randomizationFactor(v2) {
    var _a;
    if (v2 === void 0)
      return this._randomizationFactor;
    this._randomizationFactor = v2;
    (_a = this.backoff) === null || _a === void 0 ? void 0 : _a.setJitter(v2);
    return this;
  }
  reconnectionDelayMax(v2) {
    var _a;
    if (v2 === void 0)
      return this._reconnectionDelayMax;
    this._reconnectionDelayMax = v2;
    (_a = this.backoff) === null || _a === void 0 ? void 0 : _a.setMax(v2);
    return this;
  }
  timeout(v2) {
    if (!arguments.length)
      return this._timeout;
    this._timeout = v2;
    return this;
  }
  /**
   * Starts trying to reconnect if reconnection is enabled and we have not
   * started reconnecting yet
   *
   * @private
   */
  maybeReconnectOnOpen() {
    if (!this._reconnecting && this._reconnection && this.backoff.attempts === 0) {
      this.reconnect();
    }
  }
  /**
   * Sets the current transport `socket`.
   *
   * @param {Function} fn - optional, callback
   * @return self
   * @public
   */
  open(fn2) {
    if (~this._readyState.indexOf("open"))
      return this;
    this.engine = new Socket(this.uri, this.opts);
    const socket2 = this.engine;
    const self2 = this;
    this._readyState = "opening";
    this.skipReconnect = false;
    const openSubDestroy = on(socket2, "open", function() {
      self2.onopen();
      fn2 && fn2();
    });
    const onError = (err) => {
      this.cleanup();
      this._readyState = "closed";
      this.emitReserved("error", err);
      if (fn2) {
        fn2(err);
      } else {
        this.maybeReconnectOnOpen();
      }
    };
    const errorSub = on(socket2, "error", onError);
    if (false !== this._timeout) {
      const timeout = this._timeout;
      const timer = this.setTimeoutFn(() => {
        openSubDestroy();
        onError(new Error("timeout"));
        socket2.close();
      }, timeout);
      if (this.opts.autoUnref) {
        timer.unref();
      }
      this.subs.push(() => {
        this.clearTimeoutFn(timer);
      });
    }
    this.subs.push(openSubDestroy);
    this.subs.push(errorSub);
    return this;
  }
  /**
   * Alias for open()
   *
   * @return self
   * @public
   */
  connect(fn2) {
    return this.open(fn2);
  }
  /**
   * Called upon transport open.
   *
   * @private
   */
  onopen() {
    this.cleanup();
    this._readyState = "open";
    this.emitReserved("open");
    const socket2 = this.engine;
    this.subs.push(
      on(socket2, "ping", this.onping.bind(this)),
      on(socket2, "data", this.ondata.bind(this)),
      on(socket2, "error", this.onerror.bind(this)),
      on(socket2, "close", this.onclose.bind(this)),
      // @ts-ignore
      on(this.decoder, "decoded", this.ondecoded.bind(this))
    );
  }
  /**
   * Called upon a ping.
   *
   * @private
   */
  onping() {
    this.emitReserved("ping");
  }
  /**
   * Called with data.
   *
   * @private
   */
  ondata(data) {
    try {
      this.decoder.add(data);
    } catch (e3) {
      this.onclose("parse error", e3);
    }
  }
  /**
   * Called when parser fully decodes a packet.
   *
   * @private
   */
  ondecoded(packet) {
    nextTick(() => {
      this.emitReserved("packet", packet);
    }, this.setTimeoutFn);
  }
  /**
   * Called upon socket error.
   *
   * @private
   */
  onerror(err) {
    this.emitReserved("error", err);
  }
  /**
   * Creates a new socket for the given `nsp`.
   *
   * @return {Socket}
   * @public
   */
  socket(nsp, opts) {
    let socket2 = this.nsps[nsp];
    if (!socket2) {
      socket2 = new Socket2(this, nsp, opts);
      this.nsps[nsp] = socket2;
    } else if (this._autoConnect && !socket2.active) {
      socket2.connect();
    }
    return socket2;
  }
  /**
   * Called upon a socket close.
   *
   * @param socket
   * @private
   */
  _destroy(socket2) {
    const nsps = Object.keys(this.nsps);
    for (const nsp of nsps) {
      const socket3 = this.nsps[nsp];
      if (socket3.active) {
        return;
      }
    }
    this._close();
  }
  /**
   * Writes a packet.
   *
   * @param packet
   * @private
   */
  _packet(packet) {
    const encodedPackets = this.encoder.encode(packet);
    for (let i2 = 0; i2 < encodedPackets.length; i2++) {
      this.engine.write(encodedPackets[i2], packet.options);
    }
  }
  /**
   * Clean up transport subscriptions and packet buffer.
   *
   * @private
   */
  cleanup() {
    this.subs.forEach((subDestroy) => subDestroy());
    this.subs.length = 0;
    this.decoder.destroy();
  }
  /**
   * Close the current socket.
   *
   * @private
   */
  _close() {
    this.skipReconnect = true;
    this._reconnecting = false;
    this.onclose("forced close");
  }
  /**
   * Alias for close()
   *
   * @private
   */
  disconnect() {
    return this._close();
  }
  /**
   * Called when:
   *
   * - the low-level engine is closed
   * - the parser encountered a badly formatted packet
   * - all sockets are disconnected
   *
   * @private
   */
  onclose(reason, description) {
    var _a;
    this.cleanup();
    (_a = this.engine) === null || _a === void 0 ? void 0 : _a.close();
    this.backoff.reset();
    this._readyState = "closed";
    this.emitReserved("close", reason, description);
    if (this._reconnection && !this.skipReconnect) {
      this.reconnect();
    }
  }
  /**
   * Attempt a reconnection.
   *
   * @private
   */
  reconnect() {
    if (this._reconnecting || this.skipReconnect)
      return this;
    const self2 = this;
    if (this.backoff.attempts >= this._reconnectionAttempts) {
      this.backoff.reset();
      this.emitReserved("reconnect_failed");
      this._reconnecting = false;
    } else {
      const delay = this.backoff.duration();
      this._reconnecting = true;
      const timer = this.setTimeoutFn(() => {
        if (self2.skipReconnect)
          return;
        this.emitReserved("reconnect_attempt", self2.backoff.attempts);
        if (self2.skipReconnect)
          return;
        self2.open((err) => {
          if (err) {
            self2._reconnecting = false;
            self2.reconnect();
            this.emitReserved("reconnect_error", err);
          } else {
            self2.onreconnect();
          }
        });
      }, delay);
      if (this.opts.autoUnref) {
        timer.unref();
      }
      this.subs.push(() => {
        this.clearTimeoutFn(timer);
      });
    }
  }
  /**
   * Called upon successful reconnect.
   *
   * @private
   */
  onreconnect() {
    const attempt = this.backoff.attempts;
    this._reconnecting = false;
    this.backoff.reset();
    this.emitReserved("reconnect", attempt);
  }
};

// node_modules/socket.io-client/build/esm/index.js
var cache = {};
function lookup2(uri, opts) {
  if (typeof uri === "object") {
    opts = uri;
    uri = void 0;
  }
  opts = opts || {};
  const parsed = url(uri, opts.path || "/socket.io");
  const source = parsed.source;
  const id = parsed.id;
  const path2 = parsed.path;
  const sameNamespace = cache[id] && path2 in cache[id]["nsps"];
  const newConnection = opts.forceNew || opts["force new connection"] || false === opts.multiplex || sameNamespace;
  let io2;
  if (newConnection) {
    io2 = new Manager(source, opts);
  } else {
    if (!cache[id]) {
      cache[id] = new Manager(source, opts);
    }
    io2 = cache[id];
  }
  if (parsed.query && !opts.query) {
    opts.query = parsed.queryKey;
  }
  return io2.socket(parsed.path, opts);
}
Object.assign(lookup2, {
  Manager,
  Socket: Socket2,
  io: lookup2,
  connect: lookup2
});

// node_modules/@eyepop.ai/eyepop/dist/eyepop.index.mjs
var eyepop_index_exports = {};
__export(eyepop_index_exports, {
  AbstractJob: () => AbstractJob,
  AnnotationType: () => AnnotationType,
  ArtifactType: () => ArtifactType,
  AssetStatus: () => AssetStatus,
  AssetUrlType: () => AssetUrlType,
  AutoAnnotateStatus: () => AutoAnnotateStatus,
  AutoAnnotateTask: () => AutoAnnotateTask,
  ChangeType: () => ChangeType,
  ContourType: () => ContourType,
  DEFAULT_PREDICTION_VERSION: () => DEFAULT_PREDICTION_VERSION,
  DataApiType: () => DataApiType,
  DataEndpoint: () => DataEndpoint,
  Endpoint: () => Endpoint,
  EndpointState: () => EndpointState,
  EvaluationStatus: () => EvaluationStatus,
  ExportedBy: () => ExportedBy,
  EyePop: () => EyePop,
  EyepopLineDecoder: () => EyepopLineDecoder,
  ForwardOperatorType: () => ForwardOperatorType,
  InferenceType: () => InferenceType,
  LoadFromAssetUuidJob: () => LoadFromAssetUuidJob,
  LoadFromJob: () => LoadFromJob,
  LoadLiveIngressJob: () => LoadLiveIngressJob,
  LoadMediaStreamJob: () => LoadMediaStreamJob,
  ModelExportStatus: () => ModelExportStatus,
  ModelFormat: () => ModelFormat,
  ModelPrecisionType: () => ModelPrecisionType,
  ModelStatus: () => ModelStatus,
  ModelTask: () => ModelTask,
  ModelTrainingStage: () => ModelTrainingStage,
  ModelType: () => ModelType,
  MotionModel: () => MotionModel,
  PopComponentType: () => PopComponentType,
  PredictionVersion: () => PredictionVersion,
  Semaphore: () => Semaphore,
  SessionStatus: () => SessionStatus,
  Stream: () => Stream,
  TranscodeMode: () => TranscodeMode,
  TransientPopId: () => TransientPopId,
  UploadJob: () => UploadJob,
  UserReview: () => UserReview,
  VideoMode: () => VideoMode,
  VlmAbilityStatus: () => VlmAbilityStatus,
  WebrtcBase: () => WebrtcBase,
  WebrtcWhep: () => WebrtcWhep,
  WebrtcWhip: () => WebrtcWhip,
  WorkerEndpoint: () => WorkerEndpoint,
  WorkflowPhase: () => WorkflowPhase,
  default: () => index_default,
  getBaseUrl: () => getBaseUrl,
  readableStreamFromString: () => readableStreamFromString
});

// node_modules/uuid/dist/esm-browser/stringify.js
var byteToHex = [];
for (let i2 = 0; i2 < 256; ++i2) {
  byteToHex.push((i2 + 256).toString(16).slice(1));
}
function unsafeStringify(arr, offset = 0) {
  return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
}

// node_modules/uuid/dist/esm-browser/rng.js
var getRandomValues;
var rnds8 = new Uint8Array(16);
function rng() {
  if (!getRandomValues) {
    if (typeof crypto === "undefined" || !crypto.getRandomValues) {
      throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
    }
    getRandomValues = crypto.getRandomValues.bind(crypto);
  }
  return getRandomValues(rnds8);
}

// node_modules/uuid/dist/esm-browser/native.js
var randomUUID = typeof crypto !== "undefined" && crypto.randomUUID && crypto.randomUUID.bind(crypto);
var native_default = { randomUUID };

// node_modules/uuid/dist/esm-browser/v4.js
function v4(options, buf, offset) {
  if (native_default.randomUUID && !buf && !options) {
    return native_default.randomUUID();
  }
  options = options || {};
  const rnds = options.random ?? options.rng?.() ?? rng();
  if (rnds.length < 16) {
    throw new Error("Random bytes length must be >= 16");
  }
  rnds[6] = rnds[6] & 15 | 64;
  rnds[8] = rnds[8] & 63 | 128;
  if (buf) {
    offset = offset || 0;
    if (offset < 0 || offset + 16 > buf.length) {
      throw new RangeError(`UUID byte range ${offset}:${offset + 15} is out of buffer bounds`);
    }
    for (let i2 = 0; i2 < 16; ++i2) {
      buf[offset + i2] = rnds[i2];
    }
    return buf;
  }
  return unsafeStringify(rnds);
}
var v4_default = v4;

// node_modules/@eyepop.ai/eyepop/dist/eyepop.index.mjs
var import_path = __toESM(require_path_browserify(), 1);
var import_pino = __toESM(require_browser(), 1);

// node_modules/@auth0/auth0-spa-js/dist/auth0-spa-js.production.esm.js
function e(e3, t2) {
  var n2 = {};
  for (var o2 in e3) Object.prototype.hasOwnProperty.call(e3, o2) && t2.indexOf(o2) < 0 && (n2[o2] = e3[o2]);
  if (null != e3 && "function" == typeof Object.getOwnPropertySymbols) {
    var r2 = 0;
    for (o2 = Object.getOwnPropertySymbols(e3); r2 < o2.length; r2++) t2.indexOf(o2[r2]) < 0 && Object.prototype.propertyIsEnumerable.call(e3, o2[r2]) && (n2[o2[r2]] = e3[o2[r2]]);
  }
  return n2;
}
var t = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {};
var n = {};
var o = {};
Object.defineProperty(o, "__esModule", { value: true });
var r = (function() {
  function e3() {
    var e4 = this;
    this.locked = /* @__PURE__ */ new Map(), this.addToLocked = function(t2, n2) {
      var o2 = e4.locked.get(t2);
      void 0 === o2 ? void 0 === n2 ? e4.locked.set(t2, []) : e4.locked.set(t2, [n2]) : void 0 !== n2 && (o2.unshift(n2), e4.locked.set(t2, o2));
    }, this.isLocked = function(t2) {
      return e4.locked.has(t2);
    }, this.lock = function(t2) {
      return new Promise((function(n2, o2) {
        e4.isLocked(t2) ? e4.addToLocked(t2, n2) : (e4.addToLocked(t2), n2());
      }));
    }, this.unlock = function(t2) {
      var n2 = e4.locked.get(t2);
      if (void 0 !== n2 && 0 !== n2.length) {
        var o2 = n2.pop();
        e4.locked.set(t2, n2), void 0 !== o2 && setTimeout(o2, 0);
      } else e4.locked.delete(t2);
    };
  }
  return e3.getInstance = function() {
    return void 0 === e3.instance && (e3.instance = new e3()), e3.instance;
  }, e3;
})();
o.default = function() {
  return r.getInstance();
};
var i = t && t.__awaiter || function(e3, t2, n2, o2) {
  return new (n2 || (n2 = Promise))((function(r2, i2) {
    function a2(e4) {
      try {
        c2(o2.next(e4));
      } catch (e5) {
        i2(e5);
      }
    }
    function s2(e4) {
      try {
        c2(o2.throw(e4));
      } catch (e5) {
        i2(e5);
      }
    }
    function c2(e4) {
      e4.done ? r2(e4.value) : new n2((function(t3) {
        t3(e4.value);
      })).then(a2, s2);
    }
    c2((o2 = o2.apply(e3, t2 || [])).next());
  }));
};
var a = t && t.__generator || function(e3, t2) {
  var n2, o2, r2, i2, a2 = { label: 0, sent: function() {
    if (1 & r2[0]) throw r2[1];
    return r2[1];
  }, trys: [], ops: [] };
  return i2 = { next: s2(0), throw: s2(1), return: s2(2) }, "function" == typeof Symbol && (i2[Symbol.iterator] = function() {
    return this;
  }), i2;
  function s2(i3) {
    return function(s3) {
      return (function(i4) {
        if (n2) throw new TypeError("Generator is already executing.");
        for (; a2; ) try {
          if (n2 = 1, o2 && (r2 = 2 & i4[0] ? o2.return : i4[0] ? o2.throw || ((r2 = o2.return) && r2.call(o2), 0) : o2.next) && !(r2 = r2.call(o2, i4[1])).done) return r2;
          switch (o2 = 0, r2 && (i4 = [2 & i4[0], r2.value]), i4[0]) {
            case 0:
            case 1:
              r2 = i4;
              break;
            case 4:
              return a2.label++, { value: i4[1], done: false };
            case 5:
              a2.label++, o2 = i4[1], i4 = [0];
              continue;
            case 7:
              i4 = a2.ops.pop(), a2.trys.pop();
              continue;
            default:
              if (!(r2 = a2.trys, (r2 = r2.length > 0 && r2[r2.length - 1]) || 6 !== i4[0] && 2 !== i4[0])) {
                a2 = 0;
                continue;
              }
              if (3 === i4[0] && (!r2 || i4[1] > r2[0] && i4[1] < r2[3])) {
                a2.label = i4[1];
                break;
              }
              if (6 === i4[0] && a2.label < r2[1]) {
                a2.label = r2[1], r2 = i4;
                break;
              }
              if (r2 && a2.label < r2[2]) {
                a2.label = r2[2], a2.ops.push(i4);
                break;
              }
              r2[2] && a2.ops.pop(), a2.trys.pop();
              continue;
          }
          i4 = t2.call(e3, a2);
        } catch (e4) {
          i4 = [6, e4], o2 = 0;
        } finally {
          n2 = r2 = 0;
        }
        if (5 & i4[0]) throw i4[1];
        return { value: i4[0] ? i4[1] : void 0, done: true };
      })([i3, s3]);
    };
  }
};
var s = t;
Object.defineProperty(n, "__esModule", { value: true });
var c = o;
var u = { key: function(e3) {
  return i(s, void 0, void 0, (function() {
    return a(this, (function(e4) {
      throw new Error("Unsupported");
    }));
  }));
}, getItem: function(e3) {
  return i(s, void 0, void 0, (function() {
    return a(this, (function(e4) {
      throw new Error("Unsupported");
    }));
  }));
}, clear: function() {
  return i(s, void 0, void 0, (function() {
    return a(this, (function(e3) {
      return [2, window.localStorage.clear()];
    }));
  }));
}, removeItem: function(e3) {
  return i(s, void 0, void 0, (function() {
    return a(this, (function(e4) {
      throw new Error("Unsupported");
    }));
  }));
}, setItem: function(e3, t2) {
  return i(s, void 0, void 0, (function() {
    return a(this, (function(e4) {
      throw new Error("Unsupported");
    }));
  }));
}, keySync: function(e3) {
  return window.localStorage.key(e3);
}, getItemSync: function(e3) {
  return window.localStorage.getItem(e3);
}, clearSync: function() {
  return window.localStorage.clear();
}, removeItemSync: function(e3) {
  return window.localStorage.removeItem(e3);
}, setItemSync: function(e3, t2) {
  return window.localStorage.setItem(e3, t2);
} };
function l(e3) {
  return new Promise((function(t2) {
    return setTimeout(t2, e3);
  }));
}
function d(e3) {
  for (var t2 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz", n2 = "", o2 = 0; o2 < e3; o2++) {
    n2 += t2[Math.floor(Math.random() * t2.length)];
  }
  return n2;
}
var h = (function() {
  function e3(t2) {
    this.acquiredIatSet = /* @__PURE__ */ new Set(), this.storageHandler = void 0, this.id = Date.now().toString() + d(15), this.acquireLock = this.acquireLock.bind(this), this.releaseLock = this.releaseLock.bind(this), this.releaseLock__private__ = this.releaseLock__private__.bind(this), this.waitForSomethingToChange = this.waitForSomethingToChange.bind(this), this.refreshLockWhileAcquired = this.refreshLockWhileAcquired.bind(this), this.storageHandler = t2, void 0 === e3.waiters && (e3.waiters = []);
  }
  return e3.prototype.acquireLock = function(t2, n2) {
    return void 0 === n2 && (n2 = 5e3), i(this, void 0, void 0, (function() {
      var o2, r2, i2, s2, c2, h2, p2;
      return a(this, (function(a2) {
        switch (a2.label) {
          case 0:
            o2 = Date.now() + d(4), r2 = Date.now() + n2, i2 = "browser-tabs-lock-key-" + t2, s2 = void 0 === this.storageHandler ? u : this.storageHandler, a2.label = 1;
          case 1:
            return Date.now() < r2 ? [4, l(30)] : [3, 8];
          case 2:
            return a2.sent(), null !== s2.getItemSync(i2) ? [3, 5] : (c2 = this.id + "-" + t2 + "-" + o2, [4, l(Math.floor(25 * Math.random()))]);
          case 3:
            return a2.sent(), s2.setItemSync(i2, JSON.stringify({ id: this.id, iat: o2, timeoutKey: c2, timeAcquired: Date.now(), timeRefreshed: Date.now() })), [4, l(30)];
          case 4:
            return a2.sent(), null !== (h2 = s2.getItemSync(i2)) && (p2 = JSON.parse(h2)).id === this.id && p2.iat === o2 ? (this.acquiredIatSet.add(o2), this.refreshLockWhileAcquired(i2, o2), [2, true]) : [3, 7];
          case 5:
            return e3.lockCorrector(void 0 === this.storageHandler ? u : this.storageHandler), [4, this.waitForSomethingToChange(r2)];
          case 6:
            a2.sent(), a2.label = 7;
          case 7:
            return o2 = Date.now() + d(4), [3, 1];
          case 8:
            return [2, false];
        }
      }));
    }));
  }, e3.prototype.refreshLockWhileAcquired = function(e4, t2) {
    return i(this, void 0, void 0, (function() {
      var n2 = this;
      return a(this, (function(o2) {
        return setTimeout((function() {
          return i(n2, void 0, void 0, (function() {
            var n3, o3, r2;
            return a(this, (function(i2) {
              switch (i2.label) {
                case 0:
                  return [4, c.default().lock(t2)];
                case 1:
                  return i2.sent(), this.acquiredIatSet.has(t2) ? (n3 = void 0 === this.storageHandler ? u : this.storageHandler, null === (o3 = n3.getItemSync(e4)) ? (c.default().unlock(t2), [2]) : ((r2 = JSON.parse(o3)).timeRefreshed = Date.now(), n3.setItemSync(e4, JSON.stringify(r2)), c.default().unlock(t2), this.refreshLockWhileAcquired(e4, t2), [2])) : (c.default().unlock(t2), [2]);
              }
            }));
          }));
        }), 1e3), [2];
      }));
    }));
  }, e3.prototype.waitForSomethingToChange = function(t2) {
    return i(this, void 0, void 0, (function() {
      return a(this, (function(n2) {
        switch (n2.label) {
          case 0:
            return [4, new Promise((function(n3) {
              var o2 = false, r2 = Date.now(), i2 = false;
              function a2() {
                if (i2 || (window.removeEventListener("storage", a2), e3.removeFromWaiting(a2), clearTimeout(s2), i2 = true), !o2) {
                  o2 = true;
                  var t3 = 50 - (Date.now() - r2);
                  t3 > 0 ? setTimeout(n3, t3) : n3(null);
                }
              }
              window.addEventListener("storage", a2), e3.addToWaiting(a2);
              var s2 = setTimeout(a2, Math.max(0, t2 - Date.now()));
            }))];
          case 1:
            return n2.sent(), [2];
        }
      }));
    }));
  }, e3.addToWaiting = function(t2) {
    this.removeFromWaiting(t2), void 0 !== e3.waiters && e3.waiters.push(t2);
  }, e3.removeFromWaiting = function(t2) {
    void 0 !== e3.waiters && (e3.waiters = e3.waiters.filter((function(e4) {
      return e4 !== t2;
    })));
  }, e3.notifyWaiters = function() {
    void 0 !== e3.waiters && e3.waiters.slice().forEach((function(e4) {
      return e4();
    }));
  }, e3.prototype.releaseLock = function(e4) {
    return i(this, void 0, void 0, (function() {
      return a(this, (function(t2) {
        switch (t2.label) {
          case 0:
            return [4, this.releaseLock__private__(e4)];
          case 1:
            return [2, t2.sent()];
        }
      }));
    }));
  }, e3.prototype.releaseLock__private__ = function(t2) {
    return i(this, void 0, void 0, (function() {
      var n2, o2, r2, i2;
      return a(this, (function(a2) {
        switch (a2.label) {
          case 0:
            return n2 = void 0 === this.storageHandler ? u : this.storageHandler, o2 = "browser-tabs-lock-key-" + t2, null === (r2 = n2.getItemSync(o2)) ? [2] : (i2 = JSON.parse(r2)).id !== this.id ? [3, 2] : [4, c.default().lock(i2.iat)];
          case 1:
            a2.sent(), this.acquiredIatSet.delete(i2.iat), n2.removeItemSync(o2), c.default().unlock(i2.iat), e3.notifyWaiters(), a2.label = 2;
          case 2:
            return [2];
        }
      }));
    }));
  }, e3.lockCorrector = function(t2) {
    for (var n2 = Date.now() - 5e3, o2 = t2, r2 = [], i2 = 0; ; ) {
      var a2 = o2.keySync(i2);
      if (null === a2) break;
      r2.push(a2), i2++;
    }
    for (var s2 = false, c2 = 0; c2 < r2.length; c2++) {
      var u2 = r2[c2];
      if (u2.includes("browser-tabs-lock-key")) {
        var l2 = o2.getItemSync(u2);
        if (null !== l2) {
          var d2 = JSON.parse(l2);
          (void 0 === d2.timeRefreshed && d2.timeAcquired < n2 || void 0 !== d2.timeRefreshed && d2.timeRefreshed < n2) && (o2.removeItemSync(u2), s2 = true);
        }
      }
    }
    s2 && e3.notifyWaiters();
  }, e3.waiters = void 0, e3;
})();
var p = n.default = h;
var f = { timeoutInSeconds: 60 };
var m = { name: "auth0-spa-js", version: "2.13.0" };
var y = () => Date.now();
var w = class _w extends Error {
  constructor(e3, t2) {
    super(t2), this.error = e3, this.error_description = t2, Object.setPrototypeOf(this, _w.prototype);
  }
  static fromPayload(e3) {
    let { error: t2, error_description: n2 } = e3;
    return new _w(t2, n2);
  }
};
var g = class _g extends w {
  constructor(e3, t2, n2) {
    let o2 = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : null;
    super(e3, t2), this.state = n2, this.appState = o2, Object.setPrototypeOf(this, _g.prototype);
  }
};
var v = class _v extends w {
  constructor(e3, t2, n2, o2) {
    let r2 = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : null;
    super(e3, t2), this.connection = n2, this.state = o2, this.appState = r2, Object.setPrototypeOf(this, _v.prototype);
  }
};
var b = class _b extends w {
  constructor() {
    super("timeout", "Timeout"), Object.setPrototypeOf(this, _b.prototype);
  }
};
var _ = class __ extends b {
  constructor(e3) {
    super(), this.popup = e3, Object.setPrototypeOf(this, __.prototype);
  }
};
var k = class _k extends w {
  constructor(e3) {
    super("cancelled", "Popup closed"), this.popup = e3, Object.setPrototypeOf(this, _k.prototype);
  }
};
var S = class _S extends w {
  constructor() {
    super("popup_open", "Unable to open a popup for loginWithPopup - window.open returned `null`"), Object.setPrototypeOf(this, _S.prototype);
  }
};
var E = class _E extends w {
  constructor(e3, t2, n2, o2) {
    super(e3, t2), this.mfa_token = n2, this.mfa_requirements = o2, Object.setPrototypeOf(this, _E.prototype);
  }
};
var A = class _A extends w {
  constructor(e3, t2) {
    super("missing_refresh_token", "Missing Refresh Token (audience: '".concat(R(e3, ["default"]), "', scope: '").concat(R(t2), "')")), this.audience = e3, this.scope = t2, Object.setPrototypeOf(this, _A.prototype);
  }
};
var T = class _T extends w {
  constructor(e3, t2) {
    super("missing_scopes", "Missing requested scopes after refresh (audience: '".concat(R(e3, ["default"]), "', missing scope: '").concat(R(t2), "')")), this.audience = e3, this.scope = t2, Object.setPrototypeOf(this, _T.prototype);
  }
};
var P = class _P extends w {
  constructor(e3) {
    super("use_dpop_nonce", "Server rejected DPoP proof: wrong nonce"), this.newDpopNonce = e3, Object.setPrototypeOf(this, _P.prototype);
  }
};
function R(e3) {
  let t2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : [];
  return e3 && !t2.includes(e3) ? e3 : "";
}
var I = () => window.crypto;
var O = () => {
  const e3 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_~.";
  let t2 = "";
  return Array.from(I().getRandomValues(new Uint8Array(43))).forEach(((n2) => t2 += e3[n2 % e3.length])), t2;
};
var x = (e3) => btoa(e3);
var C = [{ key: "name", type: ["string"] }, { key: "version", type: ["string", "number"] }, { key: "env", type: ["object"] }];
var j = function(e3) {
  let t2 = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
  return Object.keys(e3).reduce(((n2, o2) => {
    if (t2 && "env" === o2) return n2;
    const r2 = C.find(((e4) => e4.key === o2));
    return r2 && r2.type.includes(typeof e3[o2]) && (n2[o2] = e3[o2]), n2;
  }), {});
};
var D = (t2) => {
  var { clientId: n2 } = t2, o2 = e(t2, ["clientId"]);
  return new URLSearchParams(((e3) => Object.keys(e3).filter(((t3) => void 0 !== e3[t3])).reduce(((t3, n3) => Object.assign(Object.assign({}, t3), { [n3]: e3[n3] })), {}))(Object.assign({ client_id: n2 }, o2))).toString();
};
var K = async (e3) => {
  const t2 = I().subtle.digest({ name: "SHA-256" }, new TextEncoder().encode(e3));
  return await t2;
};
var L = (e3) => ((e4) => decodeURIComponent(atob(e4).split("").map(((e5) => "%" + ("00" + e5.charCodeAt(0).toString(16)).slice(-2))).join("")))(e3.replace(/_/g, "/").replace(/-/g, "+"));
var U = (e3) => {
  const t2 = new Uint8Array(e3);
  return ((e4) => {
    const t3 = { "+": "-", "/": "_", "=": "" };
    return e4.replace(/[+/=]/g, ((e5) => t3[e5]));
  })(window.btoa(String.fromCharCode(...Array.from(t2))));
};
var N = new TextEncoder();
var W = new TextDecoder();
function z(e3) {
  return "string" == typeof e3 ? N.encode(e3) : W.decode(e3);
}
function H(e3) {
  if ("number" != typeof e3.modulusLength || e3.modulusLength < 2048) throw new G(`${e3.name} modulusLength must be at least 2048 bits`);
}
async function M(e3, t2, n2) {
  if (false === n2.usages.includes("sign")) throw new TypeError('private CryptoKey instances used for signing assertions must include "sign" in their "usages"');
  const o2 = `${V(z(JSON.stringify(e3)))}.${V(z(JSON.stringify(t2)))}`;
  return `${o2}.${V(await crypto.subtle.sign((function(e4) {
    switch (e4.algorithm.name) {
      case "ECDSA":
        return { name: e4.algorithm.name, hash: "SHA-256" };
      case "RSA-PSS":
        return H(e4.algorithm), { name: e4.algorithm.name, saltLength: 32 };
      case "RSASSA-PKCS1-v1_5":
        return H(e4.algorithm), { name: e4.algorithm.name };
      case "Ed25519":
        return { name: e4.algorithm.name };
    }
    throw new F();
  })(n2), n2, z(o2)))}`;
}
var J;
if (Uint8Array.prototype.toBase64) J = (e3) => (e3 instanceof ArrayBuffer && (e3 = new Uint8Array(e3)), e3.toBase64({ alphabet: "base64url", omitPadding: true }));
else {
  const e3 = 32768;
  J = (t2) => {
    t2 instanceof ArrayBuffer && (t2 = new Uint8Array(t2));
    const n2 = [];
    for (let o2 = 0; o2 < t2.byteLength; o2 += e3) n2.push(String.fromCharCode.apply(null, t2.subarray(o2, o2 + e3)));
    return btoa(n2.join("")).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  };
}
function V(e3) {
  return J(e3);
}
var F = class extends Error {
  constructor(e3) {
    var t2;
    super(null != e3 ? e3 : "operation not supported"), this.name = this.constructor.name, null === (t2 = Error.captureStackTrace) || void 0 === t2 || t2.call(Error, this, this.constructor);
  }
};
var G = class extends Error {
  constructor(e3) {
    var t2;
    super(e3), this.name = this.constructor.name, null === (t2 = Error.captureStackTrace) || void 0 === t2 || t2.call(Error, this, this.constructor);
  }
};
function Z(e3) {
  switch (e3.algorithm.name) {
    case "RSA-PSS":
      return (function(e4) {
        if ("SHA-256" === e4.algorithm.hash.name) return "PS256";
        throw new F("unsupported RsaHashedKeyAlgorithm hash name");
      })(e3);
    case "RSASSA-PKCS1-v1_5":
      return (function(e4) {
        if ("SHA-256" === e4.algorithm.hash.name) return "RS256";
        throw new F("unsupported RsaHashedKeyAlgorithm hash name");
      })(e3);
    case "ECDSA":
      return (function(e4) {
        if ("P-256" === e4.algorithm.namedCurve) return "ES256";
        throw new F("unsupported EcKeyAlgorithm namedCurve");
      })(e3);
    case "Ed25519":
      return "Ed25519";
    default:
      throw new F("unsupported CryptoKey algorithm name");
  }
}
function q(e3) {
  return e3 instanceof CryptoKey;
}
function B(e3) {
  return q(e3) && "public" === e3.type;
}
async function X(e3, t2, n2, o2, r2, i2) {
  const a2 = null == e3 ? void 0 : e3.privateKey, s2 = null == e3 ? void 0 : e3.publicKey;
  if (!q(c2 = a2) || "private" !== c2.type) throw new TypeError('"keypair.privateKey" must be a private CryptoKey');
  var c2;
  if (!B(s2)) throw new TypeError('"keypair.publicKey" must be a public CryptoKey');
  if (true !== s2.extractable) throw new TypeError('"keypair.publicKey.extractable" must be true');
  if ("string" != typeof t2) throw new TypeError('"htu" must be a string');
  if ("string" != typeof n2) throw new TypeError('"htm" must be a string');
  if (void 0 !== o2 && "string" != typeof o2) throw new TypeError('"nonce" must be a string or undefined');
  if (void 0 !== r2 && "string" != typeof r2) throw new TypeError('"accessToken" must be a string or undefined');
  if (void 0 !== i2 && ("object" != typeof i2 || null === i2 || Array.isArray(i2))) throw new TypeError('"additional" must be an object');
  return M({ alg: Z(a2), typ: "dpop+jwt", jwk: await Y(s2) }, Object.assign(Object.assign({}, i2), { iat: Math.floor(Date.now() / 1e3), jti: crypto.randomUUID(), htm: n2, nonce: o2, htu: t2, ath: r2 ? V(await crypto.subtle.digest("SHA-256", z(r2))) : void 0 }), a2);
}
async function Y(e3) {
  const { kty: t2, e: n2, n: o2, x: r2, y: i2, crv: a2 } = await crypto.subtle.exportKey("jwk", e3);
  return { kty: t2, crv: a2, e: n2, n: o2, x: r2, y: i2 };
}
var Q = ["authorization_code", "refresh_token", "urn:ietf:params:oauth:grant-type:token-exchange", "http://auth0.com/oauth/grant-type/mfa-oob", "http://auth0.com/oauth/grant-type/mfa-otp", "http://auth0.com/oauth/grant-type/mfa-recovery-code"];
function $() {
  return (async function(e3, t2) {
    var n2;
    let o2;
    if ("string" != typeof e3 || 0 === e3.length) throw new TypeError('"alg" must be a non-empty string');
    switch (e3) {
      case "PS256":
        o2 = { name: "RSA-PSS", hash: "SHA-256", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]) };
        break;
      case "RS256":
        o2 = { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]) };
        break;
      case "ES256":
        o2 = { name: "ECDSA", namedCurve: "P-256" };
        break;
      case "Ed25519":
        o2 = { name: "Ed25519" };
        break;
      default:
        throw new F();
    }
    return crypto.subtle.generateKey(o2, null !== (n2 = null == t2 ? void 0 : t2.extractable) && void 0 !== n2 && n2, ["sign", "verify"]);
  })("ES256", { extractable: false });
}
function ee(e3) {
  return (async function(e4) {
    if (!B(e4)) throw new TypeError('"publicKey" must be a public CryptoKey');
    if (true !== e4.extractable) throw new TypeError('"publicKey.extractable" must be true');
    const t2 = await Y(e4);
    let n2;
    switch (t2.kty) {
      case "EC":
        n2 = { crv: t2.crv, kty: t2.kty, x: t2.x, y: t2.y };
        break;
      case "OKP":
        n2 = { crv: t2.crv, kty: t2.kty, x: t2.x };
        break;
      case "RSA":
        n2 = { e: t2.e, kty: t2.kty, n: t2.n };
        break;
      default:
        throw new F("unsupported JWK kty");
    }
    return V(await crypto.subtle.digest({ name: "SHA-256" }, z(JSON.stringify(n2))));
  })(e3.publicKey);
}
function te(e3) {
  let { keyPair: t2, url: n2, method: o2, nonce: r2, accessToken: i2 } = e3;
  const a2 = (function(e4) {
    const t3 = new URL(e4);
    return t3.search = "", t3.hash = "", t3.href;
  })(n2);
  return X(t2, a2, o2, r2, i2);
}
var ne = async (e3, t2) => {
  const n2 = await fetch(e3, t2);
  return { ok: n2.ok, json: await n2.json(), headers: (o2 = n2.headers, [...o2].reduce(((e4, t3) => {
    let [n3, o3] = t3;
    return e4[n3] = o3, e4;
  }), {})) };
  var o2;
};
var oe = async (e3, t2, n2) => {
  const o2 = new AbortController();
  let r2;
  return t2.signal = o2.signal, Promise.race([ne(e3, t2), new Promise(((e4, t3) => {
    r2 = setTimeout((() => {
      o2.abort(), t3(new Error("Timeout when executing 'fetch'"));
    }), n2);
  }))]).finally((() => {
    clearTimeout(r2);
  }));
};
var re2 = async (e3, t2, n2, o2, r2, i2, a2, s2) => ((e4, t3) => new Promise((function(n3, o3) {
  const r3 = new MessageChannel();
  r3.port1.onmessage = function(e5) {
    e5.data.error ? o3(new Error(e5.data.error)) : n3(e5.data), r3.port1.close();
  }, t3.postMessage(e4, [r3.port2]);
})))({ auth: { audience: t2, scope: n2 }, timeout: r2, fetchUrl: e3, fetchOptions: o2, useFormData: a2, useMrrt: s2 }, i2);
var ie = async function(e3, t2, n2, o2, r2, i2) {
  let a2 = arguments.length > 6 && void 0 !== arguments[6] ? arguments[6] : 1e4, s2 = arguments.length > 7 ? arguments[7] : void 0;
  return r2 ? re2(e3, t2, n2, o2, a2, r2, i2, s2) : oe(e3, o2, a2);
};
async function ae(t2, n2, o2, r2, i2, a2, s2, c2, u2, l2) {
  if (u2) {
    const e3 = await u2.generateProof({ url: t2, method: i2.method || "GET", nonce: await u2.getNonce() });
    i2.headers = Object.assign(Object.assign({}, i2.headers), { dpop: e3 });
  }
  let d2, h2 = null;
  for (let e3 = 0; e3 < 3; e3++) try {
    d2 = await ie(t2, o2, r2, i2, a2, s2, n2, c2), h2 = null;
    break;
  } catch (e4) {
    h2 = e4;
  }
  if (h2) throw h2;
  const p2 = d2.json, { error: f2, error_description: m2 } = p2, y2 = e(p2, ["error", "error_description"]), { headers: g2, ok: v2 } = d2;
  let b2;
  if (u2 && (b2 = g2["dpop-nonce"], b2 && await u2.setNonce(b2)), !v2) {
    const e3 = m2 || "HTTP error. Unable to fetch ".concat(t2);
    if ("mfa_required" === f2) throw new E(f2, e3, y2.mfa_token, y2.mfa_requirements);
    if ("missing_refresh_token" === f2) throw new A(o2, r2);
    if ("use_dpop_nonce" === f2) {
      if (!u2 || !b2 || l2) throw new P(b2);
      return ae(t2, n2, o2, r2, i2, a2, s2, c2, u2, true);
    }
    throw new w(f2 || "request_error", e3);
  }
  return y2;
}
async function se(t2, n2) {
  var { baseUrl: o2, timeout: r2, audience: i2, scope: a2, auth0Client: s2, useFormData: c2, useMrrt: u2, dpop: l2 } = t2, d2 = e(t2, ["baseUrl", "timeout", "audience", "scope", "auth0Client", "useFormData", "useMrrt", "dpop"]);
  const h2 = "urn:ietf:params:oauth:grant-type:token-exchange" === d2.grant_type, p2 = "refresh_token" === d2.grant_type && u2, f2 = Object.assign(Object.assign(Object.assign(Object.assign({}, d2), h2 && i2 && { audience: i2 }), h2 && a2 && { scope: a2 }), p2 && { audience: i2, scope: a2 }), y2 = c2 ? D(f2) : JSON.stringify(f2), w2 = (g2 = d2.grant_type, Q.includes(g2));
  var g2;
  return await ae("".concat(o2, "/oauth/token"), r2, i2 || "default", a2, { method: "POST", body: y2, headers: { "Content-Type": c2 ? "application/x-www-form-urlencoded" : "application/json", "Auth0-Client": btoa(JSON.stringify(j(s2 || m))) } }, n2, c2, u2, w2 ? l2 : void 0);
}
var ce = (e3) => Array.from(new Set(e3));
var ue = function() {
  for (var e3 = arguments.length, t2 = new Array(e3), n2 = 0; n2 < e3; n2++) t2[n2] = arguments[n2];
  return ce(t2.filter(Boolean).join(" ").trim().split(/\s+/)).join(" ");
};
var le = (e3, t2, n2) => {
  let o2;
  return n2 && (o2 = e3[n2]), o2 || (o2 = e3.default), ue(o2, t2);
};
var de = class _de {
  constructor(e3) {
    let t2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "@@auth0spajs@@", n2 = arguments.length > 2 ? arguments[2] : void 0;
    this.prefix = t2, this.suffix = n2, this.clientId = e3.clientId, this.scope = e3.scope, this.audience = e3.audience;
  }
  toKey() {
    return [this.prefix, this.clientId, this.audience, this.scope, this.suffix].filter(Boolean).join("::");
  }
  static fromKey(e3) {
    const [t2, n2, o2, r2] = e3.split("::");
    return new _de({ clientId: n2, scope: r2, audience: o2 }, t2);
  }
  static fromCacheEntry(e3) {
    const { scope: t2, audience: n2, client_id: o2 } = e3;
    return new _de({ scope: t2, audience: n2, clientId: o2 });
  }
};
var he = class {
  set(e3, t2) {
    localStorage.setItem(e3, JSON.stringify(t2));
  }
  get(e3) {
    const t2 = window.localStorage.getItem(e3);
    if (t2) try {
      return JSON.parse(t2);
    } catch (e4) {
      return;
    }
  }
  remove(e3) {
    localStorage.removeItem(e3);
  }
  allKeys() {
    return Object.keys(window.localStorage).filter(((e3) => e3.startsWith("@@auth0spajs@@")));
  }
};
var pe = class {
  constructor() {
    this.enclosedCache = /* @__PURE__ */ (function() {
      let e3 = {};
      return { set(t2, n2) {
        e3[t2] = n2;
      }, get(t2) {
        const n2 = e3[t2];
        if (n2) return n2;
      }, remove(t2) {
        delete e3[t2];
      }, allKeys: () => Object.keys(e3) };
    })();
  }
};
var fe = class {
  constructor(e3, t2, n2) {
    this.cache = e3, this.keyManifest = t2, this.nowProvider = n2 || y;
  }
  async setIdToken(e3, t2, n2) {
    var o2;
    const r2 = this.getIdTokenCacheKey(e3);
    await this.cache.set(r2, { id_token: t2, decodedToken: n2 }), await (null === (o2 = this.keyManifest) || void 0 === o2 ? void 0 : o2.add(r2));
  }
  async getIdToken(e3) {
    const t2 = await this.cache.get(this.getIdTokenCacheKey(e3.clientId));
    if (!t2 && e3.scope && e3.audience) {
      const t3 = await this.get(e3);
      if (!t3) return;
      if (!t3.id_token || !t3.decodedToken) return;
      return { id_token: t3.id_token, decodedToken: t3.decodedToken };
    }
    if (t2) return { id_token: t2.id_token, decodedToken: t2.decodedToken };
  }
  async get(e3) {
    let t2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0, n2 = arguments.length > 2 && void 0 !== arguments[2] && arguments[2], o2 = arguments.length > 3 ? arguments[3] : void 0;
    var r2;
    let i2 = await this.cache.get(e3.toKey());
    if (!i2) {
      const t3 = await this.getCacheKeys();
      if (!t3) return;
      const r3 = this.matchExistingCacheKey(e3, t3);
      if (r3 && (i2 = await this.cache.get(r3)), !i2 && n2 && "cache-only" !== o2) return this.getEntryWithRefreshToken(e3, t3);
    }
    if (!i2) return;
    const a2 = await this.nowProvider(), s2 = Math.floor(a2 / 1e3);
    return i2.expiresAt - t2 < s2 ? i2.body.refresh_token ? this.modifiedCachedEntry(i2, e3) : (await this.cache.remove(e3.toKey()), void await (null === (r2 = this.keyManifest) || void 0 === r2 ? void 0 : r2.remove(e3.toKey()))) : i2.body;
  }
  async modifiedCachedEntry(e3, t2) {
    return e3.body = { refresh_token: e3.body.refresh_token, audience: e3.body.audience, scope: e3.body.scope }, await this.cache.set(t2.toKey(), e3), { refresh_token: e3.body.refresh_token, audience: e3.body.audience, scope: e3.body.scope };
  }
  async set(e3) {
    var t2;
    const n2 = new de({ clientId: e3.client_id, scope: e3.scope, audience: e3.audience }), o2 = await this.wrapCacheEntry(e3);
    await this.cache.set(n2.toKey(), o2), await (null === (t2 = this.keyManifest) || void 0 === t2 ? void 0 : t2.add(n2.toKey()));
  }
  async remove(e3, t2, n2) {
    const o2 = new de({ clientId: e3, scope: n2, audience: t2 });
    await this.cache.remove(o2.toKey());
  }
  async clear(e3) {
    var t2;
    const n2 = await this.getCacheKeys();
    n2 && (await n2.filter(((t3) => !e3 || t3.includes(e3))).reduce((async (e4, t3) => {
      await e4, await this.cache.remove(t3);
    }), Promise.resolve()), await (null === (t2 = this.keyManifest) || void 0 === t2 ? void 0 : t2.clear()));
  }
  async wrapCacheEntry(e3) {
    const t2 = await this.nowProvider();
    return { body: e3, expiresAt: Math.floor(t2 / 1e3) + e3.expires_in };
  }
  async getCacheKeys() {
    var e3;
    return this.keyManifest ? null === (e3 = await this.keyManifest.get()) || void 0 === e3 ? void 0 : e3.keys : this.cache.allKeys ? this.cache.allKeys() : void 0;
  }
  getIdTokenCacheKey(e3) {
    return new de({ clientId: e3 }, "@@auth0spajs@@", "@@user@@").toKey();
  }
  matchExistingCacheKey(e3, t2) {
    return t2.filter(((t3) => {
      var n2;
      const o2 = de.fromKey(t3), r2 = new Set(o2.scope && o2.scope.split(" ")), i2 = (null === (n2 = e3.scope) || void 0 === n2 ? void 0 : n2.split(" ")) || [], a2 = o2.scope && i2.reduce(((e4, t4) => e4 && r2.has(t4)), true);
      return "@@auth0spajs@@" === o2.prefix && o2.clientId === e3.clientId && o2.audience === e3.audience && a2;
    }))[0];
  }
  async getEntryWithRefreshToken(e3, t2) {
    var n2;
    for (const o2 of t2) {
      const t3 = de.fromKey(o2);
      if ("@@auth0spajs@@" === t3.prefix && t3.clientId === e3.clientId) {
        const t4 = await this.cache.get(o2);
        if (null === (n2 = null == t4 ? void 0 : t4.body) || void 0 === n2 ? void 0 : n2.refresh_token) return this.modifiedCachedEntry(t4, e3);
      }
    }
  }
  async updateEntry(e3, t2) {
    var n2;
    const o2 = await this.getCacheKeys();
    if (o2) for (const r2 of o2) {
      const o3 = await this.cache.get(r2);
      if ((null === (n2 = null == o3 ? void 0 : o3.body) || void 0 === n2 ? void 0 : n2.refresh_token) === e3) {
        const e4 = Object.assign(Object.assign({}, o3.body), { refresh_token: t2 });
        await this.set(e4);
      }
    }
  }
};
var me = class {
  constructor(e3, t2, n2) {
    this.storage = e3, this.clientId = t2, this.cookieDomain = n2, this.storageKey = "".concat("a0.spajs.txs", ".").concat(this.clientId);
  }
  create(e3) {
    this.storage.save(this.storageKey, e3, { daysUntilExpire: 1, cookieDomain: this.cookieDomain });
  }
  get() {
    return this.storage.get(this.storageKey);
  }
  remove() {
    this.storage.remove(this.storageKey, { cookieDomain: this.cookieDomain });
  }
};
var ye = (e3) => "number" == typeof e3;
var we = ["iss", "aud", "exp", "nbf", "iat", "jti", "azp", "nonce", "auth_time", "at_hash", "c_hash", "acr", "amr", "sub_jwk", "cnf", "sip_from_tag", "sip_date", "sip_callid", "sip_cseq_num", "sip_via_branch", "orig", "dest", "mky", "events", "toe", "txn", "rph", "sid", "vot", "vtm"];
var ge = (e3) => {
  if (!e3.id_token) throw new Error("ID token is required but missing");
  const t2 = ((e4) => {
    const t3 = e4.split("."), [n3, o3, r3] = t3;
    if (3 !== t3.length || !n3 || !o3 || !r3) throw new Error("ID token could not be decoded");
    const i2 = JSON.parse(L(o3)), a2 = { __raw: e4 }, s2 = {};
    return Object.keys(i2).forEach(((e5) => {
      a2[e5] = i2[e5], we.includes(e5) || (s2[e5] = i2[e5]);
    })), { encoded: { header: n3, payload: o3, signature: r3 }, header: JSON.parse(L(n3)), claims: a2, user: s2 };
  })(e3.id_token);
  if (!t2.claims.iss) throw new Error("Issuer (iss) claim must be a string present in the ID token");
  if (t2.claims.iss !== e3.iss) throw new Error('Issuer (iss) claim mismatch in the ID token; expected "'.concat(e3.iss, '", found "').concat(t2.claims.iss, '"'));
  if (!t2.user.sub) throw new Error("Subject (sub) claim must be a string present in the ID token");
  if ("RS256" !== t2.header.alg) throw new Error('Signature algorithm of "'.concat(t2.header.alg, '" is not supported. Expected the ID token to be signed with "RS256".'));
  if (!t2.claims.aud || "string" != typeof t2.claims.aud && !Array.isArray(t2.claims.aud)) throw new Error("Audience (aud) claim must be a string or array of strings present in the ID token");
  if (Array.isArray(t2.claims.aud)) {
    if (!t2.claims.aud.includes(e3.aud)) throw new Error('Audience (aud) claim mismatch in the ID token; expected "'.concat(e3.aud, '" but was not one of "').concat(t2.claims.aud.join(", "), '"'));
    if (t2.claims.aud.length > 1) {
      if (!t2.claims.azp) throw new Error("Authorized Party (azp) claim must be a string present in the ID token when Audience (aud) claim has multiple values");
      if (t2.claims.azp !== e3.aud) throw new Error('Authorized Party (azp) claim mismatch in the ID token; expected "'.concat(e3.aud, '", found "').concat(t2.claims.azp, '"'));
    }
  } else if (t2.claims.aud !== e3.aud) throw new Error('Audience (aud) claim mismatch in the ID token; expected "'.concat(e3.aud, '" but found "').concat(t2.claims.aud, '"'));
  if (e3.nonce) {
    if (!t2.claims.nonce) throw new Error("Nonce (nonce) claim must be a string present in the ID token");
    if (t2.claims.nonce !== e3.nonce) throw new Error('Nonce (nonce) claim mismatch in the ID token; expected "'.concat(e3.nonce, '", found "').concat(t2.claims.nonce, '"'));
  }
  if (e3.max_age && !ye(t2.claims.auth_time)) throw new Error("Authentication Time (auth_time) claim must be a number present in the ID token when Max Age (max_age) is specified");
  if (null == t2.claims.exp || !ye(t2.claims.exp)) throw new Error("Expiration Time (exp) claim must be a number present in the ID token");
  if (!ye(t2.claims.iat)) throw new Error("Issued At (iat) claim must be a number present in the ID token");
  const n2 = e3.leeway || 60, o2 = new Date(e3.now || Date.now()), r2 = /* @__PURE__ */ new Date(0);
  if (r2.setUTCSeconds(t2.claims.exp + n2), o2 > r2) throw new Error("Expiration Time (exp) claim error in the ID token; current time (".concat(o2, ") is after expiration time (").concat(r2, ")"));
  if (null != t2.claims.nbf && ye(t2.claims.nbf)) {
    const e4 = /* @__PURE__ */ new Date(0);
    if (e4.setUTCSeconds(t2.claims.nbf - n2), o2 < e4) throw new Error("Not Before time (nbf) claim in the ID token indicates that this token can't be used just yet. Current time (".concat(o2, ") is before ").concat(e4));
  }
  if (null != t2.claims.auth_time && ye(t2.claims.auth_time)) {
    const r3 = /* @__PURE__ */ new Date(0);
    if (r3.setUTCSeconds(parseInt(t2.claims.auth_time) + e3.max_age + n2), o2 > r3) throw new Error("Authentication Time (auth_time) claim in the ID token indicates that too much time has passed since the last end-user authentication. Current time (".concat(o2, ") is after last auth at ").concat(r3));
  }
  if (e3.organization) {
    const n3 = e3.organization.trim();
    if (n3.startsWith("org_")) {
      const e4 = n3;
      if (!t2.claims.org_id) throw new Error("Organization ID (org_id) claim must be a string present in the ID token");
      if (e4 !== t2.claims.org_id) throw new Error('Organization ID (org_id) claim mismatch in the ID token; expected "'.concat(e4, '", found "').concat(t2.claims.org_id, '"'));
    } else {
      const e4 = n3.toLowerCase();
      if (!t2.claims.org_name) throw new Error("Organization Name (org_name) claim must be a string present in the ID token");
      if (e4 !== t2.claims.org_name) throw new Error('Organization Name (org_name) claim mismatch in the ID token; expected "'.concat(e4, '", found "').concat(t2.claims.org_name, '"'));
    }
  }
  return t2;
};
var ve = t && t.__assign || function() {
  return ve = Object.assign || function(e3) {
    for (var t2, n2 = 1, o2 = arguments.length; n2 < o2; n2++) for (var r2 in t2 = arguments[n2]) Object.prototype.hasOwnProperty.call(t2, r2) && (e3[r2] = t2[r2]);
    return e3;
  }, ve.apply(this, arguments);
};
function be(e3, t2) {
  if (!t2) return "";
  var n2 = "; " + e3;
  return true === t2 ? n2 : n2 + "=" + t2;
}
function _e(e3, t2, n2) {
  return encodeURIComponent(e3).replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent).replace(/\(/g, "%28").replace(/\)/g, "%29") + "=" + encodeURIComponent(t2).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent) + (function(e4) {
    if ("number" == typeof e4.expires) {
      var t3 = /* @__PURE__ */ new Date();
      t3.setMilliseconds(t3.getMilliseconds() + 864e5 * e4.expires), e4.expires = t3;
    }
    return be("Expires", e4.expires ? e4.expires.toUTCString() : "") + be("Domain", e4.domain) + be("Path", e4.path) + be("Secure", e4.secure) + be("SameSite", e4.sameSite);
  })(n2);
}
function ke() {
  return (function(e3) {
    for (var t2 = {}, n2 = e3 ? e3.split("; ") : [], o2 = /(%[\dA-F]{2})+/gi, r2 = 0; r2 < n2.length; r2++) {
      var i2 = n2[r2].split("="), a2 = i2.slice(1).join("=");
      '"' === a2.charAt(0) && (a2 = a2.slice(1, -1));
      try {
        t2[i2[0].replace(o2, decodeURIComponent)] = a2.replace(o2, decodeURIComponent);
      } catch (e4) {
      }
    }
    return t2;
  })(document.cookie);
}
var Se = function(e3) {
  return ke()[e3];
};
function Ee(e3, t2, n2) {
  document.cookie = _e(e3, t2, ve({ path: "/" }, n2));
}
var Ae = Ee;
var Te = function(e3, t2) {
  Ee(e3, "", ve(ve({}, t2), { expires: -1 }));
};
var Pe = { get(e3) {
  const t2 = Se(e3);
  if (void 0 !== t2) return JSON.parse(t2);
}, save(e3, t2, n2) {
  let o2 = {};
  "https:" === window.location.protocol && (o2 = { secure: true, sameSite: "none" }), (null == n2 ? void 0 : n2.daysUntilExpire) && (o2.expires = n2.daysUntilExpire), (null == n2 ? void 0 : n2.cookieDomain) && (o2.domain = n2.cookieDomain), Ae(e3, JSON.stringify(t2), o2);
}, remove(e3, t2) {
  let n2 = {};
  (null == t2 ? void 0 : t2.cookieDomain) && (n2.domain = t2.cookieDomain), Te(e3, n2);
} };
var Re = { get(e3) {
  const t2 = Pe.get(e3);
  return t2 || Pe.get("".concat("_legacy_").concat(e3));
}, save(e3, t2, n2) {
  let o2 = {};
  "https:" === window.location.protocol && (o2 = { secure: true }), (null == n2 ? void 0 : n2.daysUntilExpire) && (o2.expires = n2.daysUntilExpire), (null == n2 ? void 0 : n2.cookieDomain) && (o2.domain = n2.cookieDomain), Ae("".concat("_legacy_").concat(e3), JSON.stringify(t2), o2), Pe.save(e3, t2, n2);
}, remove(e3, t2) {
  let n2 = {};
  (null == t2 ? void 0 : t2.cookieDomain) && (n2.domain = t2.cookieDomain), Te(e3, n2), Pe.remove(e3, t2), Pe.remove("".concat("_legacy_").concat(e3), t2);
} };
var Ie = { get(e3) {
  if ("undefined" == typeof sessionStorage) return;
  const t2 = sessionStorage.getItem(e3);
  return null != t2 ? JSON.parse(t2) : void 0;
}, save(e3, t2) {
  sessionStorage.setItem(e3, JSON.stringify(t2));
}, remove(e3) {
  sessionStorage.removeItem(e3);
} };
var Oe;
!(function(e3) {
  e3.Code = "code", e3.ConnectCode = "connect_code";
})(Oe || (Oe = {}));
function Ce(e3, t2, n2) {
  var o2 = void 0 === t2 ? null : t2, r2 = (function(e4, t3) {
    var n3 = atob(e4);
    if (t3) {
      for (var o3 = new Uint8Array(n3.length), r3 = 0, i3 = n3.length; r3 < i3; ++r3) o3[r3] = n3.charCodeAt(r3);
      return String.fromCharCode.apply(null, new Uint16Array(o3.buffer));
    }
    return n3;
  })(e3, void 0 !== n2 && n2), i2 = r2.indexOf("\n", 10) + 1, a2 = r2.substring(i2) + (o2 ? "//# sourceMappingURL=" + o2 : ""), s2 = new Blob([a2], { type: "application/javascript" });
  return URL.createObjectURL(s2);
}
var je;
var De;
var Ke;
var Le;
var Ue = (je = "Lyogcm9sbHVwLXBsdWdpbi13ZWItd29ya2VyLWxvYWRlciAqLwohZnVuY3Rpb24oKXsidXNlIHN0cmljdCI7Y2xhc3MgZSBleHRlbmRzIEVycm9ye2NvbnN0cnVjdG9yKHQscil7c3VwZXIociksdGhpcy5lcnJvcj10LHRoaXMuZXJyb3JfZGVzY3JpcHRpb249cixPYmplY3Quc2V0UHJvdG90eXBlT2YodGhpcyxlLnByb3RvdHlwZSl9c3RhdGljIGZyb21QYXlsb2FkKHQpe2xldHtlcnJvcjpyLGVycm9yX2Rlc2NyaXB0aW9uOnN9PXQ7cmV0dXJuIG5ldyBlKHIscyl9fWNsYXNzIHQgZXh0ZW5kcyBle2NvbnN0cnVjdG9yKGUscyl7c3VwZXIoIm1pc3NpbmdfcmVmcmVzaF90b2tlbiIsIk1pc3NpbmcgUmVmcmVzaCBUb2tlbiAoYXVkaWVuY2U6ICciLmNvbmNhdChyKGUsWyJkZWZhdWx0Il0pLCInLCBzY29wZTogJyIpLmNvbmNhdChyKHMpLCInKSIpKSx0aGlzLmF1ZGllbmNlPWUsdGhpcy5zY29wZT1zLE9iamVjdC5zZXRQcm90b3R5cGVPZih0aGlzLHQucHJvdG90eXBlKX19ZnVuY3Rpb24gcihlKXtsZXQgdD1hcmd1bWVudHMubGVuZ3RoPjEmJnZvaWQgMCE9PWFyZ3VtZW50c1sxXT9hcmd1bWVudHNbMV06W107cmV0dXJuIGUmJiF0LmluY2x1ZGVzKGUpP2U6IiJ9ImZ1bmN0aW9uIj09dHlwZW9mIFN1cHByZXNzZWRFcnJvciYmU3VwcHJlc3NlZEVycm9yO2NvbnN0IHM9ZT0+e3ZhcntjbGllbnRJZDp0fT1lLHI9ZnVuY3Rpb24oZSx0KXt2YXIgcj17fTtmb3IodmFyIHMgaW4gZSlPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoZSxzKSYmdC5pbmRleE9mKHMpPDAmJihyW3NdPWVbc10pO2lmKG51bGwhPWUmJiJmdW5jdGlvbiI9PXR5cGVvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKXt2YXIgbz0wO2ZvcihzPU9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMoZSk7bzxzLmxlbmd0aDtvKyspdC5pbmRleE9mKHNbb10pPDAmJk9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGUuY2FsbChlLHNbb10pJiYocltzW29dXT1lW3Nbb11dKX1yZXR1cm4gcn0oZSxbImNsaWVudElkIl0pO3JldHVybiBuZXcgVVJMU2VhcmNoUGFyYW1zKChlPT5PYmplY3Qua2V5cyhlKS5maWx0ZXIoKHQ9PnZvaWQgMCE9PWVbdF0pKS5yZWR1Y2UoKCh0LHIpPT5PYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sdCkse1tyXTplW3JdfSkpLHt9KSkoT2JqZWN0LmFzc2lnbih7Y2xpZW50X2lkOnR9LHIpKSkudG9TdHJpbmcoKX07bGV0IG89e307Y29uc3Qgbj0oZSx0KT0+IiIuY29uY2F0KGUsInwiKS5jb25jYXQodCk7YWRkRXZlbnRMaXN0ZW5lcigibWVzc2FnZSIsKGFzeW5jIGU9PntsZXQgcixjLHtkYXRhOnt0aW1lb3V0OmksYXV0aDphLGZldGNoVXJsOmYsZmV0Y2hPcHRpb25zOmwsdXNlRm9ybURhdGE6cCx1c2VNcnJ0Omh9LHBvcnRzOlt1XX09ZSxkPXt9O2NvbnN0e2F1ZGllbmNlOmcsc2NvcGU6eX09YXx8e307dHJ5e2NvbnN0IGU9cD8oZT0+e2NvbnN0IHQ9bmV3IFVSTFNlYXJjaFBhcmFtcyhlKSxyPXt9O3JldHVybiB0LmZvckVhY2goKChlLHQpPT57clt0XT1lfSkpLHJ9KShsLmJvZHkpOkpTT04ucGFyc2UobC5ib2R5KTtpZighZS5yZWZyZXNoX3Rva2VuJiYicmVmcmVzaF90b2tlbiI9PT1lLmdyYW50X3R5cGUpe2lmKGM9KChlLHQpPT5vW24oZSx0KV0pKGcseSksIWMmJmgpe2NvbnN0IGU9by5sYXRlc3RfcmVmcmVzaF90b2tlbix0PSgoZSx0KT0+e2NvbnN0IHI9T2JqZWN0LmtleXMobykuZmluZCgocj0+e2lmKCJsYXRlc3RfcmVmcmVzaF90b2tlbiIhPT1yKXtjb25zdCBzPSgoZSx0KT0+dC5zdGFydHNXaXRoKCIiLmNvbmNhdChlLCJ8IikpKSh0LHIpLG89ci5zcGxpdCgifCIpWzFdLnNwbGl0KCIgIiksbj1lLnNwbGl0KCIgIikuZXZlcnkoKGU9Pm8uaW5jbHVkZXMoZSkpKTtyZXR1cm4gcyYmbn19KSk7cmV0dXJuISFyfSkoeSxnKTtlJiYhdCYmKGM9ZSl9aWYoIWMpdGhyb3cgbmV3IHQoZyx5KTtsLmJvZHk9cD9zKE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSxlKSx7cmVmcmVzaF90b2tlbjpjfSkpOkpTT04uc3RyaW5naWZ5KE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSxlKSx7cmVmcmVzaF90b2tlbjpjfSkpfWxldCBhLGs7ImZ1bmN0aW9uIj09dHlwZW9mIEFib3J0Q29udHJvbGxlciYmKGE9bmV3IEFib3J0Q29udHJvbGxlcixsLnNpZ25hbD1hLnNpZ25hbCk7dHJ5e2s9YXdhaXQgUHJvbWlzZS5yYWNlKFsoaj1pLG5ldyBQcm9taXNlKChlPT5zZXRUaW1lb3V0KGUsaikpKSksZmV0Y2goZixPYmplY3QuYXNzaWduKHt9LGwpKV0pfWNhdGNoKGUpe3JldHVybiB2b2lkIHUucG9zdE1lc3NhZ2Uoe2Vycm9yOmUubWVzc2FnZX0pfWlmKCFrKXJldHVybiBhJiZhLmFib3J0KCksdm9pZCB1LnBvc3RNZXNzYWdlKHtlcnJvcjoiVGltZW91dCB3aGVuIGV4ZWN1dGluZyAnZmV0Y2gnIn0pO189ay5oZWFkZXJzLGQ9Wy4uLl9dLnJlZHVjZSgoKGUsdCk9PntsZXRbcixzXT10O3JldHVybiBlW3JdPXMsZX0pLHt9KSxyPWF3YWl0IGsuanNvbigpLHIucmVmcmVzaF90b2tlbj8oaCYmKG8ubGF0ZXN0X3JlZnJlc2hfdG9rZW49ci5yZWZyZXNoX3Rva2VuLE89YyxiPXIucmVmcmVzaF90b2tlbixPYmplY3QuZW50cmllcyhvKS5mb3JFYWNoKChlPT57bGV0W3Qscl09ZTtyPT09TyYmKG9bdF09Yil9KSkpLCgoZSx0LHIpPT57b1tuKHQscildPWV9KShyLnJlZnJlc2hfdG9rZW4sZyx5KSxkZWxldGUgci5yZWZyZXNoX3Rva2VuKTooKGUsdCk9PntkZWxldGUgb1tuKGUsdCldfSkoZyx5KSx1LnBvc3RNZXNzYWdlKHtvazprLm9rLGpzb246cixoZWFkZXJzOmR9KX1jYXRjaChlKXt1LnBvc3RNZXNzYWdlKHtvazohMSxqc29uOntlcnJvcjplLmVycm9yLGVycm9yX2Rlc2NyaXB0aW9uOmUubWVzc2FnZX0saGVhZGVyczpkfSl9dmFyIE8sYixfLGp9KSl9KCk7Cgo=", De = null, Ke = false, function(e3) {
  return Le = Le || Ce(je, De, Ke), new Worker(Le, e3);
});
var Ne = {};
var We = async function(e3) {
  let t2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 3;
  for (let n2 = 0; n2 < t2; n2++) if (await e3()) return true;
  return false;
};
var ze = class {
  constructor(e3, t2) {
    this.cache = e3, this.clientId = t2, this.manifestKey = this.createManifestKeyFrom(this.clientId);
  }
  async add(e3) {
    var t2;
    const n2 = new Set((null === (t2 = await this.cache.get(this.manifestKey)) || void 0 === t2 ? void 0 : t2.keys) || []);
    n2.add(e3), await this.cache.set(this.manifestKey, { keys: [...n2] });
  }
  async remove(e3) {
    const t2 = await this.cache.get(this.manifestKey);
    if (t2) {
      const n2 = new Set(t2.keys);
      return n2.delete(e3), n2.size > 0 ? await this.cache.set(this.manifestKey, { keys: [...n2] }) : await this.cache.remove(this.manifestKey);
    }
  }
  get() {
    return this.cache.get(this.manifestKey);
  }
  clear() {
    return this.cache.remove(this.manifestKey);
  }
  createManifestKeyFrom(e3) {
    return "".concat("@@auth0spajs@@", "::").concat(e3);
  }
};
var He = { memory: () => new pe().enclosedCache, localstorage: () => new he() };
var Me = (e3) => He[e3];
var Je = (t2) => {
  const { openUrl: n2, onRedirect: o2 } = t2, r2 = e(t2, ["openUrl", "onRedirect"]);
  return Object.assign(Object.assign({}, r2), { openUrl: false === n2 || n2 ? n2 : o2 });
};
var Ve = (e3, t2) => {
  const n2 = (null == t2 ? void 0 : t2.split(" ")) || [];
  return ((null == e3 ? void 0 : e3.split(" ")) || []).every(((e4) => n2.includes(e4)));
};
var Fe = { NONCE: "nonce", KEYPAIR: "keypair" };
var Ge = class {
  constructor(e3) {
    this.clientId = e3;
  }
  getVersion() {
    return 1;
  }
  createDbHandle() {
    const e3 = window.indexedDB.open("auth0-spa-js", this.getVersion());
    return new Promise(((t2, n2) => {
      e3.onupgradeneeded = () => Object.values(Fe).forEach(((t3) => e3.result.createObjectStore(t3))), e3.onerror = () => n2(e3.error), e3.onsuccess = () => t2(e3.result);
    }));
  }
  async getDbHandle() {
    return this.dbHandle || (this.dbHandle = await this.createDbHandle()), this.dbHandle;
  }
  async executeDbRequest(e3, t2, n2) {
    const o2 = n2((await this.getDbHandle()).transaction(e3, t2).objectStore(e3));
    return new Promise(((e4, t3) => {
      o2.onsuccess = () => e4(o2.result), o2.onerror = () => t3(o2.error);
    }));
  }
  buildKey(e3) {
    const t2 = e3 ? "_".concat(e3) : "auth0";
    return "".concat(this.clientId, "::").concat(t2);
  }
  setNonce(e3, t2) {
    return this.save(Fe.NONCE, this.buildKey(t2), e3);
  }
  setKeyPair(e3) {
    return this.save(Fe.KEYPAIR, this.buildKey(), e3);
  }
  async save(e3, t2, n2) {
    await this.executeDbRequest(e3, "readwrite", ((e4) => e4.put(n2, t2)));
  }
  findNonce(e3) {
    return this.find(Fe.NONCE, this.buildKey(e3));
  }
  findKeyPair() {
    return this.find(Fe.KEYPAIR, this.buildKey());
  }
  find(e3, t2) {
    return this.executeDbRequest(e3, "readonly", ((e4) => e4.get(t2)));
  }
  async deleteBy(e3, t2) {
    const n2 = await this.executeDbRequest(e3, "readonly", ((e4) => e4.getAllKeys()));
    null == n2 || n2.filter(t2).map(((t3) => this.executeDbRequest(e3, "readwrite", ((e4) => e4.delete(t3)))));
  }
  deleteByClientId(e3, t2) {
    return this.deleteBy(e3, ((e4) => "string" == typeof e4 && e4.startsWith("".concat(t2, "::"))));
  }
  clearNonces() {
    return this.deleteByClientId(Fe.NONCE, this.clientId);
  }
  clearKeyPairs() {
    return this.deleteByClientId(Fe.KEYPAIR, this.clientId);
  }
};
var Ze = class {
  constructor(e3) {
    this.storage = new Ge(e3);
  }
  getNonce(e3) {
    return this.storage.findNonce(e3);
  }
  setNonce(e3, t2) {
    return this.storage.setNonce(e3, t2);
  }
  async getOrGenerateKeyPair() {
    let e3 = await this.storage.findKeyPair();
    return e3 || (e3 = await $(), await this.storage.setKeyPair(e3)), e3;
  }
  async generateProof(e3) {
    const t2 = await this.getOrGenerateKeyPair();
    return te(Object.assign({ keyPair: t2 }, e3));
  }
  async calculateThumbprint() {
    return ee(await this.getOrGenerateKeyPair());
  }
  async clear() {
    await Promise.all([this.storage.clearNonces(), this.storage.clearKeyPairs()]);
  }
};
var qe;
!(function(e3) {
  e3.Bearer = "Bearer", e3.DPoP = "DPoP";
})(qe || (qe = {}));
var Be = class {
  constructor(e3, t2) {
    this.hooks = t2, this.config = Object.assign(Object.assign({}, e3), { fetch: e3.fetch || ("undefined" == typeof window ? fetch : window.fetch.bind(window)) });
  }
  isAbsoluteUrl(e3) {
    return /^(https?:)?\/\//i.test(e3);
  }
  buildUrl(e3, t2) {
    if (t2) {
      if (this.isAbsoluteUrl(t2)) return t2;
      if (e3) return "".concat(e3.replace(/\/?\/$/, ""), "/").concat(t2.replace(/^\/+/, ""));
    }
    throw new TypeError("`url` must be absolute or `baseUrl` non-empty.");
  }
  getAccessToken(e3) {
    return this.config.getAccessToken ? this.config.getAccessToken(e3) : this.hooks.getAccessToken(e3);
  }
  extractUrl(e3) {
    return "string" == typeof e3 ? e3 : e3 instanceof URL ? e3.href : e3.url;
  }
  buildBaseRequest(e3, t2) {
    if (!this.config.baseUrl) return new Request(e3, t2);
    const n2 = this.buildUrl(this.config.baseUrl, this.extractUrl(e3)), o2 = e3 instanceof Request ? new Request(n2, e3) : n2;
    return new Request(o2, t2);
  }
  setAuthorizationHeader(e3, t2) {
    let n2 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : qe.Bearer;
    e3.headers.set("authorization", "".concat(n2, " ").concat(t2));
  }
  async setDpopProofHeader(e3, t2) {
    if (!this.config.dpopNonceId) return;
    const n2 = await this.hooks.getDpopNonce(), o2 = await this.hooks.generateDpopProof({ accessToken: t2, method: e3.method, nonce: n2, url: e3.url });
    e3.headers.set("dpop", o2);
  }
  async prepareRequest(e3, t2) {
    const n2 = await this.getAccessToken(t2);
    let o2, r2;
    "string" == typeof n2 ? (o2 = this.config.dpopNonceId ? qe.DPoP : qe.Bearer, r2 = n2) : (o2 = n2.token_type, r2 = n2.access_token), this.setAuthorizationHeader(e3, r2, o2), o2 === qe.DPoP && await this.setDpopProofHeader(e3, r2);
  }
  getHeader(e3, t2) {
    return Array.isArray(e3) ? new Headers(e3).get(t2) || "" : "function" == typeof e3.get ? e3.get(t2) || "" : e3[t2] || "";
  }
  hasUseDpopNonceError(e3) {
    if (401 !== e3.status) return false;
    const t2 = this.getHeader(e3.headers, "www-authenticate");
    return t2.includes("invalid_dpop_nonce") || t2.includes("use_dpop_nonce");
  }
  async handleResponse(e3, t2) {
    const n2 = this.getHeader(e3.headers, "dpop-nonce");
    if (n2 && await this.hooks.setDpopNonce(n2), !this.hasUseDpopNonceError(e3)) return e3;
    if (!n2 || !t2.onUseDpopNonceError) throw new P(n2);
    return t2.onUseDpopNonceError();
  }
  async internalFetchWithAuth(e3, t2, n2, o2) {
    const r2 = this.buildBaseRequest(e3, t2);
    await this.prepareRequest(r2, o2);
    const i2 = await this.config.fetch(r2);
    return this.handleResponse(i2, n2);
  }
  fetchWithAuth(e3, t2, n2) {
    const o2 = { onUseDpopNonceError: () => this.internalFetchWithAuth(e3, t2, Object.assign(Object.assign({}, o2), { onUseDpopNonceError: void 0 }), n2) };
    return this.internalFetchWithAuth(e3, t2, o2, n2);
  }
};
var Xe = class {
  constructor(e3, t2) {
    this.myAccountFetcher = e3, this.apiBase = t2;
  }
  async connectAccount(e3) {
    const t2 = await this.myAccountFetcher.fetchWithAuth("".concat(this.apiBase, "v1/connected-accounts/connect"), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(e3) });
    return this._handleResponse(t2);
  }
  async completeAccount(e3) {
    const t2 = await this.myAccountFetcher.fetchWithAuth("".concat(this.apiBase, "v1/connected-accounts/complete"), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(e3) });
    return this._handleResponse(t2);
  }
  async _handleResponse(e3) {
    let t2;
    try {
      t2 = await e3.text(), t2 = JSON.parse(t2);
    } catch (n2) {
      throw new Ye({ type: "invalid_json", status: e3.status, title: "Invalid JSON response", detail: t2 || String(n2) });
    }
    if (e3.ok) return t2;
    throw new Ye(t2);
  }
};
var Ye = class _Ye extends Error {
  constructor(e3) {
    let { type: t2, status: n2, title: o2, detail: r2, validation_errors: i2 } = e3;
    super(r2), this.name = "MyAccountApiError", this.type = t2, this.status = n2, this.title = o2, this.detail = r2, this.validation_errors = i2, Object.setPrototypeOf(this, _Ye.prototype);
  }
};
var Qe = { otp: { authenticatorTypes: ["otp"] }, sms: { authenticatorTypes: ["oob"], oobChannels: ["sms"] }, email: { authenticatorTypes: ["oob"], oobChannels: ["email"] }, push: { authenticatorTypes: ["oob"], oobChannels: ["auth0"] }, voice: { authenticatorTypes: ["oob"], oobChannels: ["voice"] } };
var $e = "http://auth0.com/oauth/grant-type/mfa-otp";
var et = "http://auth0.com/oauth/grant-type/mfa-oob";
var tt = "http://auth0.com/oauth/grant-type/mfa-recovery-code";
function nt(e3, t2) {
  this.v = e3, this.k = t2;
}
function ot(e3, t2, n2) {
  if ("function" == typeof e3 ? e3 === t2 : e3.has(t2)) return arguments.length < 3 ? t2 : n2;
  throw new TypeError("Private element is not present on this object");
}
function rt(e3) {
  return new nt(e3, 0);
}
function it(e3, t2) {
  if (t2.has(e3)) throw new TypeError("Cannot initialize the same private elements twice on an object");
}
function at(e3, t2) {
  return e3.get(ot(e3, t2));
}
function st(e3, t2, n2) {
  it(e3, t2), t2.set(e3, n2);
}
function ct(e3, t2, n2) {
  return e3.set(ot(e3, t2), n2), n2;
}
function ut(e3, t2, n2) {
  return (t2 = (function(e4) {
    var t3 = (function(e5, t4) {
      if ("object" != typeof e5 || !e5) return e5;
      var n3 = e5[Symbol.toPrimitive];
      if (void 0 !== n3) {
        var o2 = n3.call(e5, t4 || "default");
        if ("object" != typeof o2) return o2;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return ("string" === t4 ? String : Number)(e5);
    })(e4, "string");
    return "symbol" == typeof t3 ? t3 : t3 + "";
  })(t2)) in e3 ? Object.defineProperty(e3, t2, { value: n2, enumerable: true, configurable: true, writable: true }) : e3[t2] = n2, e3;
}
function lt(e3, t2) {
  var n2 = Object.keys(e3);
  if (Object.getOwnPropertySymbols) {
    var o2 = Object.getOwnPropertySymbols(e3);
    t2 && (o2 = o2.filter((function(t3) {
      return Object.getOwnPropertyDescriptor(e3, t3).enumerable;
    }))), n2.push.apply(n2, o2);
  }
  return n2;
}
function dt(e3) {
  for (var t2 = 1; t2 < arguments.length; t2++) {
    var n2 = null != arguments[t2] ? arguments[t2] : {};
    t2 % 2 ? lt(Object(n2), true).forEach((function(t3) {
      ut(e3, t3, n2[t3]);
    })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e3, Object.getOwnPropertyDescriptors(n2)) : lt(Object(n2)).forEach((function(t3) {
      Object.defineProperty(e3, t3, Object.getOwnPropertyDescriptor(n2, t3));
    }));
  }
  return e3;
}
function ht(e3, t2) {
  if (null == e3) return {};
  var n2, o2, r2 = (function(e4, t3) {
    if (null == e4) return {};
    var n3 = {};
    for (var o3 in e4) if ({}.hasOwnProperty.call(e4, o3)) {
      if (-1 !== t3.indexOf(o3)) continue;
      n3[o3] = e4[o3];
    }
    return n3;
  })(e3, t2);
  if (Object.getOwnPropertySymbols) {
    var i2 = Object.getOwnPropertySymbols(e3);
    for (o2 = 0; o2 < i2.length; o2++) n2 = i2[o2], -1 === t2.indexOf(n2) && {}.propertyIsEnumerable.call(e3, n2) && (r2[n2] = e3[n2]);
  }
  return r2;
}
function pt(e3) {
  return function() {
    return new ft(e3.apply(this, arguments));
  };
}
function ft(e3) {
  var t2, n2;
  function o2(t3, n3) {
    try {
      var i2 = e3[t3](n3), a2 = i2.value, s2 = a2 instanceof nt;
      Promise.resolve(s2 ? a2.v : a2).then((function(n4) {
        if (s2) {
          var c2 = "return" === t3 ? "return" : "next";
          if (!a2.k || n4.done) return o2(c2, n4);
          n4 = e3[c2](n4).value;
        }
        r2(i2.done ? "return" : "normal", n4);
      }), (function(e4) {
        o2("throw", e4);
      }));
    } catch (e4) {
      r2("throw", e4);
    }
  }
  function r2(e4, r3) {
    switch (e4) {
      case "return":
        t2.resolve({ value: r3, done: true });
        break;
      case "throw":
        t2.reject(r3);
        break;
      default:
        t2.resolve({ value: r3, done: false });
    }
    (t2 = t2.next) ? o2(t2.key, t2.arg) : n2 = null;
  }
  this._invoke = function(e4, r3) {
    return new Promise((function(i2, a2) {
      var s2 = { key: e4, arg: r3, resolve: i2, reject: a2, next: null };
      n2 ? n2 = n2.next = s2 : (t2 = n2 = s2, o2(e4, r3));
    }));
  }, "function" != typeof e3.return && (this.return = void 0);
}
var mt;
var yt;
var wt;
if (ft.prototype["function" == typeof Symbol && Symbol.asyncIterator || "@@asyncIterator"] = function() {
  return this;
}, ft.prototype.next = function(e3) {
  return this._invoke("next", e3);
}, ft.prototype.throw = function(e3) {
  return this._invoke("throw", e3);
}, ft.prototype.return = function(e3) {
  return this._invoke("return", e3);
}, "undefined" == typeof navigator || null === (mt = navigator.userAgent) || void 0 === mt || null === (yt = mt.startsWith) || void 0 === yt || !yt.call(mt, "Mozilla/5.0 ")) {
  const e3 = "v3.8.3";
  wt = "".concat("oauth4webapi", "/").concat(e3);
}
function gt(e3, t2) {
  if (null == e3) return false;
  try {
    return e3 instanceof t2 || Object.getPrototypeOf(e3)[Symbol.toStringTag] === t2.prototype[Symbol.toStringTag];
  } catch (e4) {
    return false;
  }
}
function vt(e3, t2, n2) {
  const o2 = new TypeError(e3, { cause: n2 });
  return Object.assign(o2, { code: t2 }), o2;
}
var bt = /* @__PURE__ */ Symbol();
var _t = /* @__PURE__ */ Symbol();
var kt = /* @__PURE__ */ Symbol();
var St = /* @__PURE__ */ Symbol();
var Et = /* @__PURE__ */ Symbol();
var At = /* @__PURE__ */ Symbol();
var Tt = new TextEncoder();
var Pt = new TextDecoder();
function Rt(e3) {
  return "string" == typeof e3 ? Tt.encode(e3) : Pt.decode(e3);
}
var It;
var Ot;
if (Uint8Array.prototype.toBase64) It = (e3) => (e3 instanceof ArrayBuffer && (e3 = new Uint8Array(e3)), e3.toBase64({ alphabet: "base64url", omitPadding: true }));
else {
  const e3 = 32768;
  It = (t2) => {
    t2 instanceof ArrayBuffer && (t2 = new Uint8Array(t2));
    const n2 = [];
    for (let o2 = 0; o2 < t2.byteLength; o2 += e3) n2.push(String.fromCharCode.apply(null, t2.subarray(o2, o2 + e3)));
    return btoa(n2.join("")).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  };
}
function xt(e3) {
  return "string" == typeof e3 ? Ot(e3) : It(e3);
}
Ot = Uint8Array.fromBase64 ? (e3) => {
  try {
    return Uint8Array.fromBase64(e3, { alphabet: "base64url" });
  } catch (e4) {
    throw vt("The input to be decoded is not correctly encoded.", "ERR_INVALID_ARG_VALUE", e4);
  }
} : (e3) => {
  try {
    const t2 = atob(e3.replace(/-/g, "+").replace(/_/g, "/").replace(/\s/g, "")), n2 = new Uint8Array(t2.length);
    for (let e4 = 0; e4 < t2.length; e4++) n2[e4] = t2.charCodeAt(e4);
    return n2;
  } catch (e4) {
    throw vt("The input to be decoded is not correctly encoded.", "ERR_INVALID_ARG_VALUE", e4);
  }
};
var Ct = class extends Error {
  constructor(e3, t2) {
    var n2;
    super(e3, t2), ut(this, "code", void 0), this.name = this.constructor.name, this.code = Cn, null === (n2 = Error.captureStackTrace) || void 0 === n2 || n2.call(Error, this, this.constructor);
  }
};
var jt = class extends Error {
  constructor(e3, t2) {
    var n2;
    super(e3, t2), ut(this, "code", void 0), this.name = this.constructor.name, null != t2 && t2.code && (this.code = null == t2 ? void 0 : t2.code), null === (n2 = Error.captureStackTrace) || void 0 === n2 || n2.call(Error, this, this.constructor);
  }
};
function Dt(e3, t2, n2) {
  return new jt(e3, { code: t2, cause: n2 });
}
function Kt(e3, t2) {
  if ((function(e4, t3) {
    if (!(e4 instanceof CryptoKey)) throw vt("".concat(t3, " must be a CryptoKey"), "ERR_INVALID_ARG_TYPE");
  })(e3, t2), "private" !== e3.type) throw vt("".concat(t2, " must be a private CryptoKey"), "ERR_INVALID_ARG_VALUE");
}
function Lt(e3) {
  return null !== e3 && "object" == typeof e3 && !Array.isArray(e3);
}
function Ut(e3) {
  gt(e3, Headers) && (e3 = Object.fromEntries(e3.entries()));
  const t2 = new Headers(null != e3 ? e3 : {});
  if (wt && !t2.has("user-agent") && t2.set("user-agent", wt), t2.has("authorization")) throw vt('"options.headers" must not include the "authorization" header name', "ERR_INVALID_ARG_VALUE");
  return t2;
}
function Nt(e3, t2) {
  if (void 0 !== t2) {
    if ("function" == typeof t2 && (t2 = t2(e3.href)), !(t2 instanceof AbortSignal)) throw vt('"options.signal" must return or be an instance of AbortSignal', "ERR_INVALID_ARG_TYPE");
    return t2;
  }
}
function Wt(e3) {
  return e3.includes("//") ? e3.replace("//", "/") : e3;
}
async function zt(e3, t2) {
  return (async function(e4, t3, n2, o2) {
    if (!(e4 instanceof URL)) throw vt('"'.concat(t3, '" must be an instance of URL'), "ERR_INVALID_ARG_TYPE");
    en(e4, true !== (null == o2 ? void 0 : o2[bt]));
    const r2 = n2(new URL(e4.href)), i2 = Ut(null == o2 ? void 0 : o2.headers);
    return i2.set("accept", "application/json"), ((null == o2 ? void 0 : o2[St]) || fetch)(r2.href, { body: void 0, headers: Object.fromEntries(i2.entries()), method: "GET", redirect: "manual", signal: Nt(r2, null == o2 ? void 0 : o2.signal) });
  })(e3, "issuerIdentifier", ((e4) => {
    switch (null == t2 ? void 0 : t2.algorithm) {
      case void 0:
      case "oidc":
        !(function(e5, t3) {
          e5.pathname = Wt("".concat(e5.pathname, "/").concat(t3));
        })(e4, ".well-known/openid-configuration");
        break;
      case "oauth2":
        !(function(e5, t3) {
          let n2 = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
          "/" === e5.pathname ? e5.pathname = t3 : e5.pathname = Wt("".concat(t3, "/").concat(n2 ? e5.pathname : e5.pathname.replace(/(\/)$/, "")));
        })(e4, ".well-known/oauth-authorization-server");
        break;
      default:
        throw vt('"options.algorithm" must be "oidc" (default), or "oauth2"', "ERR_INVALID_ARG_VALUE");
    }
    return e4;
  }), t2);
}
function Ht(e3, t2, n2, o2, r2) {
  try {
    if ("number" != typeof e3 || !Number.isFinite(e3)) throw vt("".concat(n2, " must be a number"), "ERR_INVALID_ARG_TYPE", r2);
    if (e3 > 0) return;
    if (t2) {
      if (0 !== e3) throw vt("".concat(n2, " must be a non-negative number"), "ERR_INVALID_ARG_VALUE", r2);
      return;
    }
    throw vt("".concat(n2, " must be a positive number"), "ERR_INVALID_ARG_VALUE", r2);
  } catch (e4) {
    if (o2) throw Dt(e4.message, o2, r2);
    throw e4;
  }
}
function Mt(e3, t2, n2, o2) {
  try {
    if ("string" != typeof e3) throw vt("".concat(t2, " must be a string"), "ERR_INVALID_ARG_TYPE", o2);
    if (0 === e3.length) throw vt("".concat(t2, " must not be empty"), "ERR_INVALID_ARG_VALUE", o2);
  } catch (e4) {
    if (n2) throw Dt(e4.message, n2, o2);
    throw e4;
  }
}
function Jt(e3) {
  !(function(e4, t2) {
    if (fn(e4) !== t2) throw (function(e5) {
      let t3 = '"response" content-type must be ';
      for (var n2 = arguments.length, o2 = new Array(n2 > 1 ? n2 - 1 : 0), r2 = 1; r2 < n2; r2++) o2[r2 - 1] = arguments[r2];
      if (o2.length > 2) {
        const e6 = o2.pop();
        t3 += "".concat(o2.join(", "), ", or ").concat(e6);
      } else 2 === o2.length ? t3 += "".concat(o2[0], " or ").concat(o2[1]) : t3 += o2[0];
      return Dt(t3, Ln, e5);
    })(e4, t2);
  })(e3, "application/json");
}
function Vt() {
  return xt(crypto.getRandomValues(new Uint8Array(32)));
}
function Ft(e3) {
  switch (e3.algorithm.name) {
    case "RSA-PSS":
      return (function(e4) {
        switch (e4.algorithm.hash.name) {
          case "SHA-256":
            return "PS256";
          case "SHA-384":
            return "PS384";
          case "SHA-512":
            return "PS512";
          default:
            throw new Ct("unsupported RsaHashedKeyAlgorithm hash name", { cause: e4 });
        }
      })(e3);
    case "RSASSA-PKCS1-v1_5":
      return (function(e4) {
        switch (e4.algorithm.hash.name) {
          case "SHA-256":
            return "RS256";
          case "SHA-384":
            return "RS384";
          case "SHA-512":
            return "RS512";
          default:
            throw new Ct("unsupported RsaHashedKeyAlgorithm hash name", { cause: e4 });
        }
      })(e3);
    case "ECDSA":
      return (function(e4) {
        switch (e4.algorithm.namedCurve) {
          case "P-256":
            return "ES256";
          case "P-384":
            return "ES384";
          case "P-521":
            return "ES512";
          default:
            throw new Ct("unsupported EcKeyAlgorithm namedCurve", { cause: e4 });
        }
      })(e3);
    case "Ed25519":
    case "ML-DSA-44":
    case "ML-DSA-65":
    case "ML-DSA-87":
      return e3.algorithm.name;
    case "EdDSA":
      return "Ed25519";
    default:
      throw new Ct("unsupported CryptoKey algorithm name", { cause: e3 });
  }
}
function Gt(e3) {
  const t2 = null == e3 ? void 0 : e3[_t];
  return "number" == typeof t2 && Number.isFinite(t2) ? t2 : 0;
}
function Zt(e3) {
  const t2 = null == e3 ? void 0 : e3[kt];
  return "number" == typeof t2 && Number.isFinite(t2) && -1 !== Math.sign(t2) ? t2 : 30;
}
function qt() {
  return Math.floor(Date.now() / 1e3);
}
function Bt(e3) {
  if ("object" != typeof e3 || null === e3) throw vt('"as" must be an object', "ERR_INVALID_ARG_TYPE");
  Mt(e3.issuer, '"as.issuer"');
}
function Xt(e3) {
  if ("object" != typeof e3 || null === e3) throw vt('"client" must be an object', "ERR_INVALID_ARG_TYPE");
  Mt(e3.client_id, '"client.client_id"');
}
function Yt(e3) {
  return Mt(e3, '"clientSecret"'), (t2, n2, o2, r2) => {
    o2.set("client_id", n2.client_id), o2.set("client_secret", e3);
  };
}
function Qt(e3, t2) {
  const { key: n2, kid: o2 } = (r2 = e3) instanceof CryptoKey ? { key: r2 } : (null == r2 ? void 0 : r2.key) instanceof CryptoKey ? (void 0 !== r2.kid && Mt(r2.kid, '"kid"'), { key: r2.key, kid: r2.kid }) : {};
  var r2;
  return Kt(n2, '"clientPrivateKey.key"'), async (e4, r3, i2, a2) => {
    var s2;
    const c2 = { alg: Ft(n2), kid: o2 }, u2 = (function(e5, t3) {
      const n3 = qt() + Gt(t3);
      return { jti: Vt(), aud: e5.issuer, exp: n3 + 60, iat: n3, nbf: n3, iss: t3.client_id, sub: t3.client_id };
    })(e4, r3);
    null == t2 || null === (s2 = t2[Et]) || void 0 === s2 || s2.call(t2, c2, u2), i2.set("client_id", r3.client_id), i2.set("client_assertion_type", "urn:ietf:params:oauth:client-assertion-type:jwt-bearer"), i2.set("client_assertion", await (async function(e5, t3, n3) {
      if (!n3.usages.includes("sign")) throw vt('CryptoKey instances used for signing assertions must include "sign" in their "usages"', "ERR_INVALID_ARG_VALUE");
      const o3 = "".concat(xt(Rt(JSON.stringify(e5))), ".").concat(xt(Rt(JSON.stringify(t3)))), r4 = xt(await crypto.subtle.sign((function(e6) {
        switch (e6.algorithm.name) {
          case "ECDSA":
            return { name: e6.algorithm.name, hash: Zn(e6) };
          case "RSA-PSS":
            switch (Gn(e6), e6.algorithm.hash.name) {
              case "SHA-256":
              case "SHA-384":
              case "SHA-512":
                return { name: e6.algorithm.name, saltLength: parseInt(e6.algorithm.hash.name.slice(-3), 10) >> 3 };
              default:
                throw new Ct("unsupported RSA-PSS hash name", { cause: e6 });
            }
          case "RSASSA-PKCS1-v1_5":
            return Gn(e6), e6.algorithm.name;
          case "ML-DSA-44":
          case "ML-DSA-65":
          case "ML-DSA-87":
          case "Ed25519":
            return e6.algorithm.name;
        }
        throw new Ct("unsupported CryptoKey algorithm name", { cause: e6 });
      })(n3), n3, Rt(o3)));
      return "".concat(o3, ".").concat(r4);
    })(c2, u2, n2));
  };
}
var $t = URL.parse ? (e3, t2) => URL.parse(e3, t2) : (e3, t2) => {
  try {
    return new URL(e3, t2);
  } catch (e4) {
    return null;
  }
};
function en(e3, t2) {
  if (t2 && "https:" !== e3.protocol) throw Dt("only requests to HTTPS are allowed", Nn, e3);
  if ("https:" !== e3.protocol && "http:" !== e3.protocol) throw Dt("only HTTP and HTTPS requests are allowed", Wn, e3);
}
function tn(e3, t2, n2, o2) {
  let r2;
  if ("string" != typeof e3 || !(r2 = $t(e3))) throw Dt("authorization server metadata does not contain a valid ".concat(n2 ? '"as.mtls_endpoint_aliases.'.concat(t2, '"') : '"as.'.concat(t2, '"')), void 0 === e3 ? Jn : Vn, { attribute: n2 ? "mtls_endpoint_aliases.".concat(t2) : t2 });
  return en(r2, o2), r2;
}
function nn(e3, t2, n2, o2) {
  return n2 && e3.mtls_endpoint_aliases && t2 in e3.mtls_endpoint_aliases ? tn(e3.mtls_endpoint_aliases[t2], t2, n2, o2) : tn(e3[t2], t2, n2, o2);
}
var on2 = class extends Error {
  constructor(e3, t2) {
    var n2;
    super(e3, t2), ut(this, "cause", void 0), ut(this, "code", void 0), ut(this, "error", void 0), ut(this, "status", void 0), ut(this, "error_description", void 0), ut(this, "response", void 0), this.name = this.constructor.name, this.code = xn, this.cause = t2.cause, this.error = t2.cause.error, this.status = t2.response.status, this.error_description = t2.cause.error_description, Object.defineProperty(this, "response", { enumerable: false, value: t2.response }), null === (n2 = Error.captureStackTrace) || void 0 === n2 || n2.call(Error, this, this.constructor);
  }
};
var rn = class extends Error {
  constructor(e3, t2) {
    var n2, o2;
    super(e3, t2), ut(this, "cause", void 0), ut(this, "code", void 0), ut(this, "error", void 0), ut(this, "error_description", void 0), this.name = this.constructor.name, this.code = jn, this.cause = t2.cause, this.error = t2.cause.get("error"), this.error_description = null !== (n2 = t2.cause.get("error_description")) && void 0 !== n2 ? n2 : void 0, null === (o2 = Error.captureStackTrace) || void 0 === o2 || o2.call(Error, this, this.constructor);
  }
};
var an = class extends Error {
  constructor(e3, t2) {
    var n2;
    super(e3, t2), ut(this, "cause", void 0), ut(this, "code", void 0), ut(this, "response", void 0), ut(this, "status", void 0), this.name = this.constructor.name, this.code = On, this.cause = t2.cause, this.status = t2.response.status, this.response = t2.response, Object.defineProperty(this, "response", { enumerable: false }), null === (n2 = Error.captureStackTrace) || void 0 === n2 || n2.call(Error, this, this.constructor);
  }
};
var sn = "[a-zA-Z0-9!#$%&\\'\\*\\+\\-\\.\\^_`\\|~]+";
var cn = new RegExp("^[,\\s]*(" + sn + ")");
var un = new RegExp('^[,\\s]*([a-zA-Z0-9!#$%&\\\'\\*\\+\\-\\.\\^_`\\|~]+)\\s*=\\s*"((?:[^"\\\\]|\\\\[\\s\\S])*)"[,\\s]*(.*)');
var ln = new RegExp("^[,\\s]*([a-zA-Z0-9!#$%&\\'\\*\\+\\-\\.\\^_`\\|~]+)\\s*=\\s*([a-zA-Z0-9!#$%&\\'\\*\\+\\-\\.\\^_`\\|~]+)[,\\s]*(.*)");
var dn = new RegExp("^([a-zA-Z0-9\\-\\._\\~\\+\\/]+={0,2})(?:$|[,\\s])(.*)");
async function hn(e3, t2, n2) {
  if (e3.status !== t2) {
    let t3;
    var o2;
    if ((function(e4) {
      let t4;
      if (t4 = (function(e5) {
        if (!gt(e5, Response)) throw vt('"response" must be an instance of Response', "ERR_INVALID_ARG_TYPE");
        const t5 = e5.headers.get("www-authenticate");
        if (null === t5) return;
        const n3 = [];
        let o3 = t5;
        for (; o3; ) {
          var r2;
          let e6 = o3.match(cn);
          const t6 = null === (r2 = e6) || void 0 === r2 ? void 0 : r2[1].toLowerCase();
          if (!t6) return;
          const i2 = o3.substring(e6[0].length);
          if (i2 && !i2.match(/^[\s,]/)) return;
          const a2 = i2.match(/^\s+(.*)$/), s2 = !!a2;
          o3 = a2 ? a2[1] : void 0;
          const c2 = {};
          let u2;
          if (s2) for (; o3; ) {
            let t7, n4;
            if (e6 = o3.match(un)) {
              if ([, t7, n4, o3] = e6, n4.includes("\\")) try {
                n4 = JSON.parse('"'.concat(n4, '"'));
              } catch (e7) {
              }
              c2[t7.toLowerCase()] = n4;
            } else {
              if (!(e6 = o3.match(ln))) {
                if (e6 = o3.match(dn)) {
                  if (Object.keys(c2).length) break;
                  [, u2, o3] = e6;
                  break;
                }
                return;
              }
              [, t7, n4, o3] = e6, c2[t7.toLowerCase()] = n4;
            }
          }
          else o3 = i2 || void 0;
          const l2 = { scheme: t6, parameters: c2 };
          u2 && (l2.token68 = u2), n3.push(l2);
        }
        return n3.length ? n3 : void 0;
      })(e4)) throw new an("server responded with a challenge in the WWW-Authenticate HTTP Header", { cause: t4, response: e4 });
    })(e3), t3 = await (async function(e4) {
      if (e4.status > 399 && e4.status < 500) {
        Fn(e4), Jt(e4);
        try {
          const t4 = await e4.clone().json();
          if (Lt(t4) && "string" == typeof t4.error && t4.error.length) return t4;
        } catch (e5) {
        }
      }
    })(e3)) throw await (null === (o2 = e3.body) || void 0 === o2 ? void 0 : o2.cancel()), new on2("server responded with an error in the response body", { cause: t3, response: e3 });
    throw Dt('"response" is not a conform '.concat(n2, " response (unexpected HTTP status code)"), Un, e3);
  }
}
function pn(e3) {
  if (!Sn.has(e3)) throw vt('"options.DPoP" is not a valid DPoPHandle', "ERR_INVALID_ARG_VALUE");
}
function fn(e3) {
  var t2;
  return null === (t2 = e3.headers.get("content-type")) || void 0 === t2 ? void 0 : t2.split(";")[0];
}
async function mn(e3, t2, n2, o2, r2, i2, a2) {
  return await n2(e3, t2, r2, i2), i2.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"), ((null == a2 ? void 0 : a2[St]) || fetch)(o2.href, { body: r2, headers: Object.fromEntries(i2.entries()), method: "POST", redirect: "manual", signal: Nt(o2, null == a2 ? void 0 : a2.signal) });
}
async function yn(e3, t2, n2, o2, r2, i2) {
  var a2;
  const s2 = nn(e3, "token_endpoint", t2.use_mtls_endpoint_aliases, true !== (null == i2 ? void 0 : i2[bt]));
  r2.set("grant_type", o2);
  const c2 = Ut(null == i2 ? void 0 : i2.headers);
  c2.set("accept", "application/json"), void 0 !== (null == i2 ? void 0 : i2.DPoP) && (pn(i2.DPoP), await i2.DPoP.addProof(s2, c2, "POST"));
  const u2 = await mn(e3, t2, n2, s2, r2, c2, i2);
  return null == i2 || null === (a2 = i2.DPoP) || void 0 === a2 || a2.cacheNonce(u2, s2), u2;
}
var wn = /* @__PURE__ */ new WeakMap();
var gn = /* @__PURE__ */ new WeakMap();
function vn(e3) {
  if (!e3.id_token) return;
  const t2 = wn.get(e3);
  if (!t2) throw vt('"ref" was already garbage collected or did not resolve from the proper sources', "ERR_INVALID_ARG_VALUE");
  return t2;
}
async function bn(e3, t2, n2, o2, r2, i2) {
  if (Bt(e3), Xt(t2), !gt(n2, Response)) throw vt('"response" must be an instance of Response', "ERR_INVALID_ARG_TYPE");
  await hn(n2, 200, "Token Endpoint"), Fn(n2);
  const a2 = await eo(n2);
  if (Mt(a2.access_token, '"response" body "access_token" property', Kn, { body: a2 }), Mt(a2.token_type, '"response" body "token_type" property', Kn, { body: a2 }), a2.token_type = a2.token_type.toLowerCase(), void 0 !== a2.expires_in) {
    let e4 = "number" != typeof a2.expires_in ? parseFloat(a2.expires_in) : a2.expires_in;
    Ht(e4, true, '"response" body "expires_in" property', Kn, { body: a2 }), a2.expires_in = e4;
  }
  if (void 0 !== a2.refresh_token && Mt(a2.refresh_token, '"response" body "refresh_token" property', Kn, { body: a2 }), void 0 !== a2.scope && "string" != typeof a2.scope) throw Dt('"response" body "scope" property must be a string', Kn, { body: a2 });
  if (void 0 !== a2.id_token) {
    Mt(a2.id_token, '"response" body "id_token" property', Kn, { body: a2 });
    const i3 = ["aud", "exp", "iat", "iss", "sub"];
    true === t2.require_auth_time && i3.push("auth_time"), void 0 !== t2.default_max_age && (Ht(t2.default_max_age, true, '"client.default_max_age"'), i3.push("auth_time")), null != o2 && o2.length && i3.push(...o2);
    const { claims: s2, jwt: c2 } = await (async function(e4, t3, n3, o3, r3) {
      let i4, a3, { 0: s3, 1: c3, length: u2 } = e4.split(".");
      if (5 === u2) {
        if (void 0 === r3) throw new Ct("JWE decryption is not configured", { cause: e4 });
        e4 = await r3(e4), { 0: s3, 1: c3, length: u2 } = e4.split(".");
      }
      if (3 !== u2) throw Dt("Invalid JWT", Kn, e4);
      try {
        i4 = JSON.parse(Rt(xt(s3)));
      } catch (e5) {
        throw Dt("failed to parse JWT Header body as base64url encoded JSON", Dn, e5);
      }
      if (!Lt(i4)) throw Dt("JWT Header must be a top level object", Kn, e4);
      if (t3(i4), void 0 !== i4.crit) throw new Ct('no JWT "crit" header parameter extensions are supported', { cause: { header: i4 } });
      try {
        a3 = JSON.parse(Rt(xt(c3)));
      } catch (e5) {
        throw Dt("failed to parse JWT Payload body as base64url encoded JSON", Dn, e5);
      }
      if (!Lt(a3)) throw Dt("JWT Payload must be a top level object", Kn, e4);
      const l2 = qt() + n3;
      if (void 0 !== a3.exp) {
        if ("number" != typeof a3.exp) throw Dt('unexpected JWT "exp" (expiration time) claim type', Kn, { claims: a3 });
        if (a3.exp <= l2 - o3) throw Dt('unexpected JWT "exp" (expiration time) claim value, expiration is past current timestamp', zn, { claims: a3, now: l2, tolerance: o3, claim: "exp" });
      }
      if (void 0 !== a3.iat && "number" != typeof a3.iat) throw Dt('unexpected JWT "iat" (issued at) claim type', Kn, { claims: a3 });
      if (void 0 !== a3.iss && "string" != typeof a3.iss) throw Dt('unexpected JWT "iss" (issuer) claim type', Kn, { claims: a3 });
      if (void 0 !== a3.nbf) {
        if ("number" != typeof a3.nbf) throw Dt('unexpected JWT "nbf" (not before) claim type', Kn, { claims: a3 });
        if (a3.nbf > l2 + o3) throw Dt('unexpected JWT "nbf" (not before) claim value', zn, { claims: a3, now: l2, tolerance: o3, claim: "nbf" });
      }
      if (void 0 !== a3.aud && "string" != typeof a3.aud && !Array.isArray(a3.aud)) throw Dt('unexpected JWT "aud" (audience) claim type', Kn, { claims: a3 });
      return { header: i4, claims: a3, jwt: e4 };
    })(a2.id_token, Bn.bind(void 0, t2.id_token_signed_response_alg, e3.id_token_signing_alg_values_supported, "RS256"), Gt(t2), Zt(t2), r2).then(Tn.bind(void 0, i3)).then(kn.bind(void 0, e3)).then(_n.bind(void 0, t2.client_id));
    if (Array.isArray(s2.aud) && 1 !== s2.aud.length) {
      if (void 0 === s2.azp) throw Dt('ID Token "aud" (audience) claim includes additional untrusted audiences', Hn, { claims: s2, claim: "aud" });
      if (s2.azp !== t2.client_id) throw Dt('unexpected ID Token "azp" (authorized party) claim value', Hn, { expected: t2.client_id, claims: s2, claim: "azp" });
    }
    void 0 !== s2.auth_time && Ht(s2.auth_time, true, 'ID Token "auth_time" (authentication time)', Kn, { claims: s2 }), gn.set(n2, c2), wn.set(a2, s2);
  }
  if (void 0 !== (null == i2 ? void 0 : i2[a2.token_type])) i2[a2.token_type](n2, a2);
  else if ("dpop" !== a2.token_type && "bearer" !== a2.token_type) throw new Ct("unsupported `token_type` value", { cause: { body: a2 } });
  return a2;
}
function _n(e3, t2) {
  if (Array.isArray(t2.claims.aud)) {
    if (!t2.claims.aud.includes(e3)) throw Dt('unexpected JWT "aud" (audience) claim value', Hn, { expected: e3, claims: t2.claims, claim: "aud" });
  } else if (t2.claims.aud !== e3) throw Dt('unexpected JWT "aud" (audience) claim value', Hn, { expected: e3, claims: t2.claims, claim: "aud" });
  return t2;
}
function kn(e3, t2) {
  var n2, o2;
  const r2 = null !== (n2 = null === (o2 = e3[no]) || void 0 === o2 ? void 0 : o2.call(e3, t2)) && void 0 !== n2 ? n2 : e3.issuer;
  if (t2.claims.iss !== r2) throw Dt('unexpected JWT "iss" (issuer) claim value', Hn, { expected: r2, claims: t2.claims, claim: "iss" });
  return t2;
}
var Sn = /* @__PURE__ */ new WeakSet();
var En = /* @__PURE__ */ Symbol();
var An = { aud: "audience", c_hash: "code hash", client_id: "client id", exp: "expiration time", iat: "issued at", iss: "issuer", jti: "jwt id", nonce: "nonce", s_hash: "state hash", sub: "subject", ath: "access token hash", htm: "http method", htu: "http uri", cnf: "confirmation", auth_time: "authentication time" };
function Tn(e3, t2) {
  for (const n2 of e3) if (void 0 === t2.claims[n2]) throw Dt('JWT "'.concat(n2, '" (').concat(An[n2], ") claim missing"), Kn, { claims: t2.claims });
  return t2;
}
var Pn = /* @__PURE__ */ Symbol();
var Rn = /* @__PURE__ */ Symbol();
async function In(e3, t2, n2, o2) {
  return "string" == typeof (null == o2 ? void 0 : o2.expectedNonce) || "number" == typeof (null == o2 ? void 0 : o2.maxAge) || null != o2 && o2.requireIdToken ? (async function(e4, t3, n3, o3, r2, i2, a2) {
    const s2 = [];
    switch (o3) {
      case void 0:
        o3 = Pn;
        break;
      case Pn:
        break;
      default:
        Mt(o3, '"expectedNonce" argument'), s2.push("nonce");
    }
    switch (null != r2 || (r2 = t3.default_max_age), r2) {
      case void 0:
        r2 = Rn;
        break;
      case Rn:
        break;
      default:
        Ht(r2, true, '"maxAge" argument'), s2.push("auth_time");
    }
    const c2 = await bn(e4, t3, n3, s2, i2, a2);
    Mt(c2.id_token, '"response" body "id_token" property', Kn, { body: c2 });
    const u2 = vn(c2);
    if (r2 !== Rn) {
      const e5 = qt() + Gt(t3), n4 = Zt(t3);
      if (u2.auth_time + r2 < e5 - n4) throw Dt("too much time has elapsed since the last End-User authentication", zn, { claims: u2, now: e5, tolerance: n4, claim: "auth_time" });
    }
    if (o3 === Pn) {
      if (void 0 !== u2.nonce) throw Dt('unexpected ID Token "nonce" claim value', Hn, { expected: void 0, claims: u2, claim: "nonce" });
    } else if (u2.nonce !== o3) throw Dt('unexpected ID Token "nonce" claim value', Hn, { expected: o3, claims: u2, claim: "nonce" });
    return c2;
  })(e3, t2, n2, o2.expectedNonce, o2.maxAge, o2[At], o2.recognizedTokenTypes) : (async function(e4, t3, n3, o3, r2) {
    const i2 = await bn(e4, t3, n3, void 0, o3, r2), a2 = vn(i2);
    if (a2) {
      if (void 0 !== t3.default_max_age) {
        Ht(t3.default_max_age, true, '"client.default_max_age"');
        const e5 = qt() + Gt(t3), n4 = Zt(t3);
        if (a2.auth_time + t3.default_max_age < e5 - n4) throw Dt("too much time has elapsed since the last End-User authentication", zn, { claims: a2, now: e5, tolerance: n4, claim: "auth_time" });
      }
      if (void 0 !== a2.nonce) throw Dt('unexpected ID Token "nonce" claim value', Hn, { expected: void 0, claims: a2, claim: "nonce" });
    }
    return i2;
  })(e3, t2, n2, null == o2 ? void 0 : o2[At], null == o2 ? void 0 : o2.recognizedTokenTypes);
}
var On = "OAUTH_WWW_AUTHENTICATE_CHALLENGE";
var xn = "OAUTH_RESPONSE_BODY_ERROR";
var Cn = "OAUTH_UNSUPPORTED_OPERATION";
var jn = "OAUTH_AUTHORIZATION_RESPONSE_ERROR";
var Dn = "OAUTH_PARSE_ERROR";
var Kn = "OAUTH_INVALID_RESPONSE";
var Ln = "OAUTH_RESPONSE_IS_NOT_JSON";
var Un = "OAUTH_RESPONSE_IS_NOT_CONFORM";
var Nn = "OAUTH_HTTP_REQUEST_FORBIDDEN";
var Wn = "OAUTH_REQUEST_PROTOCOL_FORBIDDEN";
var zn = "OAUTH_JWT_TIMESTAMP_CHECK_FAILED";
var Hn = "OAUTH_JWT_CLAIM_COMPARISON_FAILED";
var Mn = "OAUTH_JSON_ATTRIBUTE_COMPARISON_FAILED";
var Jn = "OAUTH_MISSING_SERVER_METADATA";
var Vn = "OAUTH_INVALID_SERVER_METADATA";
function Fn(e3) {
  if (e3.bodyUsed) throw vt('"response" body has been used already', "ERR_INVALID_ARG_VALUE");
}
function Gn(e3) {
  const { algorithm: t2 } = e3;
  if ("number" != typeof t2.modulusLength || t2.modulusLength < 2048) throw new Ct("unsupported ".concat(t2.name, " modulusLength"), { cause: e3 });
}
function Zn(e3) {
  const { algorithm: t2 } = e3;
  switch (t2.namedCurve) {
    case "P-256":
      return "SHA-256";
    case "P-384":
      return "SHA-384";
    case "P-521":
      return "SHA-512";
    default:
      throw new Ct("unsupported ECDSA namedCurve", { cause: e3 });
  }
}
async function qn(e3) {
  if ("POST" !== e3.method) throw vt("form_post responses are expected to use the POST method", "ERR_INVALID_ARG_VALUE", { cause: e3 });
  if ("application/x-www-form-urlencoded" !== fn(e3)) throw vt("form_post responses are expected to use the application/x-www-form-urlencoded content-type", "ERR_INVALID_ARG_VALUE", { cause: e3 });
  return (async function(e4) {
    if (e4.bodyUsed) throw vt("form_post Request instances must contain a readable body", "ERR_INVALID_ARG_VALUE", { cause: e4 });
    return e4.text();
  })(e3);
}
function Bn(e3, t2, n2, o2) {
  if (void 0 === e3) if (Array.isArray(t2)) {
    if (!t2.includes(o2.alg)) throw Dt('unexpected JWT "alg" header parameter', Kn, { header: o2, expected: t2, reason: "authorization server metadata" });
  } else {
    if (void 0 === n2) throw Dt('missing client or server configuration to verify used JWT "alg" header parameter', void 0, { client: e3, issuer: t2, fallback: n2 });
    if ("string" == typeof n2 ? o2.alg !== n2 : "function" == typeof n2 ? !n2(o2.alg) : !n2.includes(o2.alg)) throw Dt('unexpected JWT "alg" header parameter', Kn, { header: o2, expected: n2, reason: "default value" });
  }
  else if ("string" == typeof e3 ? o2.alg !== e3 : !e3.includes(o2.alg)) throw Dt('unexpected JWT "alg" header parameter', Kn, { header: o2, expected: e3, reason: "client configuration" });
}
function Xn(e3, t2) {
  const { 0: n2, length: o2 } = e3.getAll(t2);
  if (o2 > 1) throw Dt('"'.concat(t2, '" parameter must be provided only once'), Kn);
  return n2;
}
var Yn = /* @__PURE__ */ Symbol();
var Qn = /* @__PURE__ */ Symbol();
function $n(e3, t2, n2, o2) {
  if (Bt(e3), Xt(t2), n2 instanceof URL && (n2 = n2.searchParams), !(n2 instanceof URLSearchParams)) throw vt('"parameters" must be an instance of URLSearchParams, or URL', "ERR_INVALID_ARG_TYPE");
  if (Xn(n2, "response")) throw Dt('"parameters" contains a JARM response, use validateJwtAuthResponse() instead of validateAuthResponse()', Kn, { parameters: n2 });
  const r2 = Xn(n2, "iss"), i2 = Xn(n2, "state");
  if (!r2 && e3.authorization_response_iss_parameter_supported) throw Dt('response parameter "iss" (issuer) missing', Kn, { parameters: n2 });
  if (r2 && r2 !== e3.issuer) throw Dt('unexpected "iss" (issuer) response parameter value', Kn, { expected: e3.issuer, parameters: n2 });
  switch (o2) {
    case void 0:
    case Qn:
      if (void 0 !== i2) throw Dt('unexpected "state" response parameter encountered', Kn, { expected: void 0, parameters: n2 });
      break;
    case Yn:
      break;
    default:
      if (Mt(o2, '"expectedState" argument'), i2 !== o2) throw Dt(void 0 === i2 ? 'response parameter "state" missing' : 'unexpected "state" response parameter value', Kn, { expected: o2, parameters: n2 });
  }
  if (Xn(n2, "error")) throw new rn("authorization response from the server is an error", { cause: n2 });
  const a2 = Xn(n2, "id_token"), s2 = Xn(n2, "token");
  if (void 0 !== a2 || void 0 !== s2) throw new Ct("implicit and hybrid flows are not supported");
  return c2 = new URLSearchParams(n2), Sn.add(c2), c2;
  var c2;
}
async function eo(e3) {
  let t2, n2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : Jt;
  try {
    t2 = await e3.json();
  } catch (t3) {
    throw n2(e3), Dt('failed to parse "response" body as JSON', Dn, t3);
  }
  if (!Lt(t2)) throw Dt('"response" body must be a top level object', Kn, { body: t2 });
  return t2;
}
var to = /* @__PURE__ */ Symbol();
var no = /* @__PURE__ */ Symbol();
var oo = new TextEncoder();
var ro = new TextDecoder();
function io(e3) {
  const t2 = new Uint8Array(e3.length);
  for (let n2 = 0; n2 < e3.length; n2++) {
    const o2 = e3.charCodeAt(n2);
    if (o2 > 127) throw new TypeError("non-ASCII string encountered in encode()");
    t2[n2] = o2;
  }
  return t2;
}
function ao(e3) {
  if (Uint8Array.fromBase64) return Uint8Array.fromBase64(e3);
  const t2 = atob(e3), n2 = new Uint8Array(t2.length);
  for (let e4 = 0; e4 < t2.length; e4++) n2[e4] = t2.charCodeAt(e4);
  return n2;
}
function so(e3) {
  if (Uint8Array.fromBase64) return Uint8Array.fromBase64("string" == typeof e3 ? e3 : ro.decode(e3), { alphabet: "base64url" });
  let t2 = e3;
  t2 instanceof Uint8Array && (t2 = ro.decode(t2)), t2 = t2.replace(/-/g, "+").replace(/_/g, "/");
  try {
    return ao(t2);
  } catch (e4) {
    throw new TypeError("The input to be decoded is not correctly encoded.");
  }
}
var co = class extends Error {
  constructor(e3, t2) {
    var n2;
    super(e3, t2), ut(this, "code", "ERR_JOSE_GENERIC"), this.name = this.constructor.name, null === (n2 = Error.captureStackTrace) || void 0 === n2 || n2.call(Error, this, this.constructor);
  }
};
ut(co, "code", "ERR_JOSE_GENERIC");
var uo = class extends co {
  constructor(e3, t2) {
    let n2 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "unspecified", o2 = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : "unspecified";
    super(e3, { cause: { claim: n2, reason: o2, payload: t2 } }), ut(this, "code", "ERR_JWT_CLAIM_VALIDATION_FAILED"), ut(this, "claim", void 0), ut(this, "reason", void 0), ut(this, "payload", void 0), this.claim = n2, this.reason = o2, this.payload = t2;
  }
};
ut(uo, "code", "ERR_JWT_CLAIM_VALIDATION_FAILED");
var lo = class extends co {
  constructor(e3, t2) {
    let n2 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "unspecified", o2 = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : "unspecified";
    super(e3, { cause: { claim: n2, reason: o2, payload: t2 } }), ut(this, "code", "ERR_JWT_EXPIRED"), ut(this, "claim", void 0), ut(this, "reason", void 0), ut(this, "payload", void 0), this.claim = n2, this.reason = o2, this.payload = t2;
  }
};
ut(lo, "code", "ERR_JWT_EXPIRED");
var ho = class extends co {
  constructor() {
    super(...arguments), ut(this, "code", "ERR_JOSE_ALG_NOT_ALLOWED");
  }
};
ut(ho, "code", "ERR_JOSE_ALG_NOT_ALLOWED");
var po = class extends co {
  constructor() {
    super(...arguments), ut(this, "code", "ERR_JOSE_NOT_SUPPORTED");
  }
};
ut(po, "code", "ERR_JOSE_NOT_SUPPORTED");
ut(class extends co {
  constructor() {
    super(arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "decryption operation failed", arguments.length > 1 ? arguments[1] : void 0), ut(this, "code", "ERR_JWE_DECRYPTION_FAILED");
  }
}, "code", "ERR_JWE_DECRYPTION_FAILED");
ut(class extends co {
  constructor() {
    super(...arguments), ut(this, "code", "ERR_JWE_INVALID");
  }
}, "code", "ERR_JWE_INVALID");
var fo = class extends co {
  constructor() {
    super(...arguments), ut(this, "code", "ERR_JWS_INVALID");
  }
};
ut(fo, "code", "ERR_JWS_INVALID");
var mo = class extends co {
  constructor() {
    super(...arguments), ut(this, "code", "ERR_JWT_INVALID");
  }
};
ut(mo, "code", "ERR_JWT_INVALID");
ut(class extends co {
  constructor() {
    super(...arguments), ut(this, "code", "ERR_JWK_INVALID");
  }
}, "code", "ERR_JWK_INVALID");
var yo = class extends co {
  constructor() {
    super(...arguments), ut(this, "code", "ERR_JWKS_INVALID");
  }
};
ut(yo, "code", "ERR_JWKS_INVALID");
var wo = class extends co {
  constructor() {
    super(arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "no applicable key found in the JSON Web Key Set", arguments.length > 1 ? arguments[1] : void 0), ut(this, "code", "ERR_JWKS_NO_MATCHING_KEY");
  }
};
ut(wo, "code", "ERR_JWKS_NO_MATCHING_KEY");
var go = class extends co {
  constructor() {
    super(arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "multiple matching keys found in the JSON Web Key Set", arguments.length > 1 ? arguments[1] : void 0), ut(this, Symbol.asyncIterator, void 0), ut(this, "code", "ERR_JWKS_MULTIPLE_MATCHING_KEYS");
  }
};
ut(go, "code", "ERR_JWKS_MULTIPLE_MATCHING_KEYS");
var vo = class extends co {
  constructor() {
    super(arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "request timed out", arguments.length > 1 ? arguments[1] : void 0), ut(this, "code", "ERR_JWKS_TIMEOUT");
  }
};
ut(vo, "code", "ERR_JWKS_TIMEOUT");
var bo = class extends co {
  constructor() {
    super(arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "signature verification failed", arguments.length > 1 ? arguments[1] : void 0), ut(this, "code", "ERR_JWS_SIGNATURE_VERIFICATION_FAILED");
  }
};
ut(bo, "code", "ERR_JWS_SIGNATURE_VERIFICATION_FAILED");
var _o = function(e3) {
  let t2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "algorithm.name";
  return new TypeError("CryptoKey does not support this operation, its ".concat(t2, " must be ").concat(e3));
};
var ko = (e3, t2) => e3.name === t2;
function So(e3) {
  return parseInt(e3.name.slice(4), 10);
}
function Eo(e3, t2, n2) {
  switch (t2) {
    case "HS256":
    case "HS384":
    case "HS512": {
      if (!ko(e3.algorithm, "HMAC")) throw _o("HMAC");
      const n3 = parseInt(t2.slice(2), 10);
      if (So(e3.algorithm.hash) !== n3) throw _o("SHA-".concat(n3), "algorithm.hash");
      break;
    }
    case "RS256":
    case "RS384":
    case "RS512": {
      if (!ko(e3.algorithm, "RSASSA-PKCS1-v1_5")) throw _o("RSASSA-PKCS1-v1_5");
      const n3 = parseInt(t2.slice(2), 10);
      if (So(e3.algorithm.hash) !== n3) throw _o("SHA-".concat(n3), "algorithm.hash");
      break;
    }
    case "PS256":
    case "PS384":
    case "PS512": {
      if (!ko(e3.algorithm, "RSA-PSS")) throw _o("RSA-PSS");
      const n3 = parseInt(t2.slice(2), 10);
      if (So(e3.algorithm.hash) !== n3) throw _o("SHA-".concat(n3), "algorithm.hash");
      break;
    }
    case "Ed25519":
    case "EdDSA":
      if (!ko(e3.algorithm, "Ed25519")) throw _o("Ed25519");
      break;
    case "ML-DSA-44":
    case "ML-DSA-65":
    case "ML-DSA-87":
      if (!ko(e3.algorithm, t2)) throw _o(t2);
      break;
    case "ES256":
    case "ES384":
    case "ES512": {
      if (!ko(e3.algorithm, "ECDSA")) throw _o("ECDSA");
      const n3 = (function(e4) {
        switch (e4) {
          case "ES256":
            return "P-256";
          case "ES384":
            return "P-384";
          case "ES512":
            return "P-521";
          default:
            throw new Error("unreachable");
        }
      })(t2);
      if (e3.algorithm.namedCurve !== n3) throw _o(n3, "algorithm.namedCurve");
      break;
    }
    default:
      throw new TypeError("CryptoKey does not support this operation");
  }
  !(function(e4, t3) {
    if (t3 && !e4.usages.includes(t3)) throw new TypeError("CryptoKey does not support this operation, its usages must include ".concat(t3, "."));
  })(e3, n2);
}
function Ao(e3, t2) {
  for (var n2 = arguments.length, o2 = new Array(n2 > 2 ? n2 - 2 : 0), r2 = 2; r2 < n2; r2++) o2[r2 - 2] = arguments[r2];
  if ((o2 = o2.filter(Boolean)).length > 2) {
    const t3 = o2.pop();
    e3 += "one of type ".concat(o2.join(", "), ", or ").concat(t3, ".");
  } else 2 === o2.length ? e3 += "one of type ".concat(o2[0], " or ").concat(o2[1], ".") : e3 += "of type ".concat(o2[0], ".");
  if (null == t2) e3 += " Received ".concat(t2);
  else if ("function" == typeof t2 && t2.name) e3 += " Received function ".concat(t2.name);
  else if ("object" == typeof t2 && null != t2) {
    var i2;
    null !== (i2 = t2.constructor) && void 0 !== i2 && i2.name && (e3 += " Received an instance of ".concat(t2.constructor.name));
  }
  return e3;
}
var To = function(e3, t2) {
  for (var n2 = arguments.length, o2 = new Array(n2 > 2 ? n2 - 2 : 0), r2 = 2; r2 < n2; r2++) o2[r2 - 2] = arguments[r2];
  return Ao("Key for the ".concat(e3, " algorithm must be "), t2, ...o2);
};
var Po = (e3) => {
  if ("CryptoKey" === (null == e3 ? void 0 : e3[Symbol.toStringTag])) return true;
  try {
    return e3 instanceof CryptoKey;
  } catch (e4) {
    return false;
  }
};
var Ro = (e3) => "KeyObject" === (null == e3 ? void 0 : e3[Symbol.toStringTag]);
var Io = (e3) => Po(e3) || Ro(e3);
function Oo(e3) {
  if ("object" != typeof (t2 = e3) || null === t2 || "[object Object]" !== Object.prototype.toString.call(e3)) return false;
  var t2;
  if (null === Object.getPrototypeOf(e3)) return true;
  let n2 = e3;
  for (; null !== Object.getPrototypeOf(n2); ) n2 = Object.getPrototypeOf(n2);
  return Object.getPrototypeOf(e3) === n2;
}
var xo = (e3, t2) => {
  if (e3.byteLength !== t2.length) return false;
  for (let n2 = 0; n2 < e3.byteLength; n2++) if (e3[n2] !== t2[n2]) return false;
  return true;
};
var Co = (e3) => {
  const t2 = e3.data[e3.pos++];
  if (128 & t2) {
    const n2 = 127 & t2;
    let o2 = 0;
    for (let t3 = 0; t3 < n2; t3++) o2 = o2 << 8 | e3.data[e3.pos++];
    return o2;
  }
  return t2;
};
var jo = (e3, t2, n2) => {
  if (e3.data[e3.pos++] !== t2) throw new Error(n2);
};
var Do = (e3, t2) => {
  const n2 = e3.data.subarray(e3.pos, e3.pos + t2);
  return e3.pos += t2, n2;
};
var Ko = (e3) => {
  const t2 = ((e4) => {
    jo(e4, 6, "Expected algorithm OID");
    const t3 = Co(e4);
    return Do(e4, t3);
  })(e3);
  if (xo(t2, [43, 101, 110])) return "X25519";
  if (!xo(t2, [42, 134, 72, 206, 61, 2, 1])) throw new Error("Unsupported key algorithm");
  jo(e3, 6, "Expected curve OID");
  const n2 = Co(e3), o2 = Do(e3, n2);
  for (const { name: e4, oid: t3 } of [{ name: "P-256", oid: [42, 134, 72, 206, 61, 3, 1, 7] }, { name: "P-384", oid: [43, 129, 4, 0, 34] }, { name: "P-521", oid: [43, 129, 4, 0, 35] }]) if (xo(o2, t3)) return e4;
  throw new Error("Unsupported named curve");
};
var Lo = async (e3, t2, n2, o2) => {
  var r2;
  let i2, a2;
  const s2 = "spki" === e3, c2 = () => s2 ? ["verify"] : ["sign"];
  switch (n2) {
    case "PS256":
    case "PS384":
    case "PS512":
      i2 = { name: "RSA-PSS", hash: "SHA-".concat(n2.slice(-3)) }, a2 = c2();
      break;
    case "RS256":
    case "RS384":
    case "RS512":
      i2 = { name: "RSASSA-PKCS1-v1_5", hash: "SHA-".concat(n2.slice(-3)) }, a2 = c2();
      break;
    case "RSA-OAEP":
    case "RSA-OAEP-256":
    case "RSA-OAEP-384":
    case "RSA-OAEP-512":
      i2 = { name: "RSA-OAEP", hash: "SHA-".concat(parseInt(n2.slice(-3), 10) || 1) }, a2 = s2 ? ["encrypt", "wrapKey"] : ["decrypt", "unwrapKey"];
      break;
    case "ES256":
    case "ES384":
    case "ES512":
      i2 = { name: "ECDSA", namedCurve: { ES256: "P-256", ES384: "P-384", ES512: "P-521" }[n2] }, a2 = c2();
      break;
    case "ECDH-ES":
    case "ECDH-ES+A128KW":
    case "ECDH-ES+A192KW":
    case "ECDH-ES+A256KW":
      try {
        const e4 = o2.getNamedCurve(t2);
        i2 = "X25519" === e4 ? { name: "X25519" } : { name: "ECDH", namedCurve: e4 };
      } catch (e4) {
        throw new po("Invalid or unsupported key format");
      }
      a2 = s2 ? [] : ["deriveBits"];
      break;
    case "Ed25519":
    case "EdDSA":
      i2 = { name: "Ed25519" }, a2 = c2();
      break;
    case "ML-DSA-44":
    case "ML-DSA-65":
    case "ML-DSA-87":
      i2 = { name: n2 }, a2 = c2();
      break;
    default:
      throw new po('Invalid or unsupported "alg" (Algorithm) value');
  }
  return crypto.subtle.importKey(e3, t2, i2, null !== (r2 = null == o2 ? void 0 : o2.extractable) && void 0 !== r2 ? r2 : !!s2, a2);
};
var Uo = (e3, t2, n2) => {
  var o2;
  const r2 = ((e4, t3) => ao(e4.replace(t3, "")))(e3, /(?:-----(?:BEGIN|END) PRIVATE KEY-----|\s)/g);
  let i2 = n2;
  return null != t2 && null !== (o2 = t2.startsWith) && void 0 !== o2 && o2.call(t2, "ECDH-ES") && (i2 || (i2 = {}), i2.getNamedCurve = (e4) => {
    const t3 = { data: e4, pos: 0 };
    return (function(e5) {
      jo(e5, 48, "Invalid PKCS#8 structure"), Co(e5), jo(e5, 2, "Expected version field");
      const t4 = Co(e5);
      e5.pos += t4, jo(e5, 48, "Expected algorithm identifier");
      const n3 = Co(e5);
      e5.pos;
    })(t3), Ko(t3);
  }), Lo("pkcs8", r2, t2, i2);
};
async function No(e3) {
  var t2, n2;
  if (!e3.alg) throw new TypeError('"alg" argument is required when "jwk.alg" is not present');
  const { algorithm: o2, keyUsages: r2 } = (function(e4) {
    let t3, n3;
    switch (e4.kty) {
      case "AKP":
        switch (e4.alg) {
          case "ML-DSA-44":
          case "ML-DSA-65":
          case "ML-DSA-87":
            t3 = { name: e4.alg }, n3 = e4.priv ? ["sign"] : ["verify"];
            break;
          default:
            throw new po('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
        }
        break;
      case "RSA":
        switch (e4.alg) {
          case "PS256":
          case "PS384":
          case "PS512":
            t3 = { name: "RSA-PSS", hash: "SHA-".concat(e4.alg.slice(-3)) }, n3 = e4.d ? ["sign"] : ["verify"];
            break;
          case "RS256":
          case "RS384":
          case "RS512":
            t3 = { name: "RSASSA-PKCS1-v1_5", hash: "SHA-".concat(e4.alg.slice(-3)) }, n3 = e4.d ? ["sign"] : ["verify"];
            break;
          case "RSA-OAEP":
          case "RSA-OAEP-256":
          case "RSA-OAEP-384":
          case "RSA-OAEP-512":
            t3 = { name: "RSA-OAEP", hash: "SHA-".concat(parseInt(e4.alg.slice(-3), 10) || 1) }, n3 = e4.d ? ["decrypt", "unwrapKey"] : ["encrypt", "wrapKey"];
            break;
          default:
            throw new po('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
        }
        break;
      case "EC":
        switch (e4.alg) {
          case "ES256":
            t3 = { name: "ECDSA", namedCurve: "P-256" }, n3 = e4.d ? ["sign"] : ["verify"];
            break;
          case "ES384":
            t3 = { name: "ECDSA", namedCurve: "P-384" }, n3 = e4.d ? ["sign"] : ["verify"];
            break;
          case "ES512":
            t3 = { name: "ECDSA", namedCurve: "P-521" }, n3 = e4.d ? ["sign"] : ["verify"];
            break;
          case "ECDH-ES":
          case "ECDH-ES+A128KW":
          case "ECDH-ES+A192KW":
          case "ECDH-ES+A256KW":
            t3 = { name: "ECDH", namedCurve: e4.crv }, n3 = e4.d ? ["deriveBits"] : [];
            break;
          default:
            throw new po('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
        }
        break;
      case "OKP":
        switch (e4.alg) {
          case "Ed25519":
          case "EdDSA":
            t3 = { name: "Ed25519" }, n3 = e4.d ? ["sign"] : ["verify"];
            break;
          case "ECDH-ES":
          case "ECDH-ES+A128KW":
          case "ECDH-ES+A192KW":
          case "ECDH-ES+A256KW":
            t3 = { name: e4.crv }, n3 = e4.d ? ["deriveBits"] : [];
            break;
          default:
            throw new po('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
        }
        break;
      default:
        throw new po('Invalid or unsupported JWK "kty" (Key Type) Parameter value');
    }
    return { algorithm: t3, keyUsages: n3 };
  })(e3), i2 = dt({}, e3);
  return "AKP" !== i2.kty && delete i2.alg, delete i2.use, crypto.subtle.importKey("jwk", i2, o2, null !== (t2 = e3.ext) && void 0 !== t2 ? t2 : !e3.d && !e3.priv, null !== (n2 = e3.key_ops) && void 0 !== n2 ? n2 : r2);
}
var Wo = (e3) => Oo(e3) && "string" == typeof e3.kty;
var zo;
var Ho = async function(e3, t2, n2) {
  let o2 = arguments.length > 3 && void 0 !== arguments[3] && arguments[3];
  zo || (zo = /* @__PURE__ */ new WeakMap());
  let r2 = zo.get(e3);
  if (null != r2 && r2[n2]) return r2[n2];
  const i2 = await No(dt(dt({}, t2), {}, { alg: n2 }));
  return o2 && Object.freeze(e3), r2 ? r2[n2] = i2 : zo.set(e3, { [n2]: i2 }), i2;
};
async function Mo(e3, t2) {
  if (e3 instanceof Uint8Array) return e3;
  if (Po(e3)) return e3;
  if (Ro(e3)) {
    if ("secret" === e3.type) return e3.export();
    if ("toCryptoKey" in e3 && "function" == typeof e3.toCryptoKey) try {
      return ((e4, t3) => {
        zo || (zo = /* @__PURE__ */ new WeakMap());
        let n3 = zo.get(e4);
        if (null != n3 && n3[t3]) return n3[t3];
        const o2 = "public" === e4.type, r2 = !!o2;
        let i2;
        if ("x25519" === e4.asymmetricKeyType) {
          switch (t3) {
            case "ECDH-ES":
            case "ECDH-ES+A128KW":
            case "ECDH-ES+A192KW":
            case "ECDH-ES+A256KW":
              break;
            default:
              throw new TypeError("given KeyObject instance cannot be used for this algorithm");
          }
          i2 = e4.toCryptoKey(e4.asymmetricKeyType, r2, o2 ? [] : ["deriveBits"]);
        }
        if ("ed25519" === e4.asymmetricKeyType) {
          if ("EdDSA" !== t3 && "Ed25519" !== t3) throw new TypeError("given KeyObject instance cannot be used for this algorithm");
          i2 = e4.toCryptoKey(e4.asymmetricKeyType, r2, [o2 ? "verify" : "sign"]);
        }
        switch (e4.asymmetricKeyType) {
          case "ml-dsa-44":
          case "ml-dsa-65":
          case "ml-dsa-87":
            if (t3 !== e4.asymmetricKeyType.toUpperCase()) throw new TypeError("given KeyObject instance cannot be used for this algorithm");
            i2 = e4.toCryptoKey(e4.asymmetricKeyType, r2, [o2 ? "verify" : "sign"]);
        }
        if ("rsa" === e4.asymmetricKeyType) {
          let n4;
          switch (t3) {
            case "RSA-OAEP":
              n4 = "SHA-1";
              break;
            case "RS256":
            case "PS256":
            case "RSA-OAEP-256":
              n4 = "SHA-256";
              break;
            case "RS384":
            case "PS384":
            case "RSA-OAEP-384":
              n4 = "SHA-384";
              break;
            case "RS512":
            case "PS512":
            case "RSA-OAEP-512":
              n4 = "SHA-512";
              break;
            default:
              throw new TypeError("given KeyObject instance cannot be used for this algorithm");
          }
          if (t3.startsWith("RSA-OAEP")) return e4.toCryptoKey({ name: "RSA-OAEP", hash: n4 }, r2, o2 ? ["encrypt"] : ["decrypt"]);
          i2 = e4.toCryptoKey({ name: t3.startsWith("PS") ? "RSA-PSS" : "RSASSA-PKCS1-v1_5", hash: n4 }, r2, [o2 ? "verify" : "sign"]);
        }
        if ("ec" === e4.asymmetricKeyType) {
          var a2;
          const n4 = (/* @__PURE__ */ new Map([["prime256v1", "P-256"], ["secp384r1", "P-384"], ["secp521r1", "P-521"]])).get(null === (a2 = e4.asymmetricKeyDetails) || void 0 === a2 ? void 0 : a2.namedCurve);
          if (!n4) throw new TypeError("given KeyObject instance cannot be used for this algorithm");
          "ES256" === t3 && "P-256" === n4 && (i2 = e4.toCryptoKey({ name: "ECDSA", namedCurve: n4 }, r2, [o2 ? "verify" : "sign"])), "ES384" === t3 && "P-384" === n4 && (i2 = e4.toCryptoKey({ name: "ECDSA", namedCurve: n4 }, r2, [o2 ? "verify" : "sign"])), "ES512" === t3 && "P-521" === n4 && (i2 = e4.toCryptoKey({ name: "ECDSA", namedCurve: n4 }, r2, [o2 ? "verify" : "sign"])), t3.startsWith("ECDH-ES") && (i2 = e4.toCryptoKey({ name: "ECDH", namedCurve: n4 }, r2, o2 ? [] : ["deriveBits"]));
        }
        if (!i2) throw new TypeError("given KeyObject instance cannot be used for this algorithm");
        return n3 ? n3[t3] = i2 : zo.set(e4, { [t3]: i2 }), i2;
      })(e3, t2);
    } catch (e4) {
      if (e4 instanceof TypeError) throw e4;
    }
    let n2 = e3.export({ format: "jwk" });
    return Ho(e3, n2, t2);
  }
  if (Wo(e3)) return e3.k ? so(e3.k) : Ho(e3, e3, t2, true);
  throw new Error("unreachable");
}
var Jo = (e3) => null == e3 ? void 0 : e3[Symbol.toStringTag];
var Vo = (e3, t2, n2) => {
  if (void 0 !== t2.use) {
    let e4;
    switch (n2) {
      case "sign":
      case "verify":
        e4 = "sig";
        break;
      case "encrypt":
      case "decrypt":
        e4 = "enc";
    }
    if (t2.use !== e4) throw new TypeError('Invalid key for this operation, its "use" must be "'.concat(e4, '" when present'));
  }
  if (void 0 !== t2.alg && t2.alg !== e3) throw new TypeError('Invalid key for this operation, its "alg" must be "'.concat(e3, '" when present'));
  if (Array.isArray(t2.key_ops)) {
    var o2, r2;
    let i2;
    switch (true) {
      case ("sign" === n2 || "verify" === n2):
      case "dir" === e3:
      case e3.includes("CBC-HS"):
        i2 = n2;
        break;
      case e3.startsWith("PBES2"):
        i2 = "deriveBits";
        break;
      case /^A\d{3}(?:GCM)?(?:KW)?$/.test(e3):
        i2 = !e3.includes("GCM") && e3.endsWith("KW") ? "encrypt" === n2 ? "wrapKey" : "unwrapKey" : n2;
        break;
      case ("encrypt" === n2 && e3.startsWith("RSA")):
        i2 = "wrapKey";
        break;
      case "decrypt" === n2:
        i2 = e3.startsWith("RSA") ? "unwrapKey" : "deriveBits";
    }
    if (i2 && false === (null === (o2 = t2.key_ops) || void 0 === o2 || null === (r2 = o2.includes) || void 0 === r2 ? void 0 : r2.call(o2, i2))) throw new TypeError('Invalid key for this operation, its "key_ops" must include "'.concat(i2, '" when present'));
  }
  return true;
};
function Fo(e3, t2, n2) {
  switch (e3.substring(0, 2)) {
    case "A1":
    case "A2":
    case "di":
    case "HS":
    case "PB":
      ((e4, t3, n3) => {
        if (!(t3 instanceof Uint8Array)) {
          if (Wo(t3)) {
            if (((e5) => "oct" === e5.kty && "string" == typeof e5.k)(t3) && Vo(e4, t3, n3)) return;
            throw new TypeError('JSON Web Key for symmetric algorithms must have JWK "kty" (Key Type) equal to "oct" and the JWK "k" (Key Value) present');
          }
          if (!Io(t3)) throw new TypeError(To(e4, t3, "CryptoKey", "KeyObject", "JSON Web Key", "Uint8Array"));
          if ("secret" !== t3.type) throw new TypeError("".concat(Jo(t3), ' instances for symmetric algorithms must be of type "secret"'));
        }
      })(e3, t2, n2);
      break;
    default:
      ((e4, t3, n3) => {
        if (Wo(t3)) switch (n3) {
          case "decrypt":
          case "sign":
            if (((e5) => "oct" !== e5.kty && ("AKP" === e5.kty && "string" == typeof e5.priv || "string" == typeof e5.d))(t3) && Vo(e4, t3, n3)) return;
            throw new TypeError("JSON Web Key for this operation must be a private JWK");
          case "encrypt":
          case "verify":
            if (((e5) => "oct" !== e5.kty && void 0 === e5.d && void 0 === e5.priv)(t3) && Vo(e4, t3, n3)) return;
            throw new TypeError("JSON Web Key for this operation must be a public JWK");
        }
        if (!Io(t3)) throw new TypeError(To(e4, t3, "CryptoKey", "KeyObject", "JSON Web Key"));
        if ("secret" === t3.type) throw new TypeError("".concat(Jo(t3), ' instances for asymmetric algorithms must not be of type "secret"'));
        if ("public" === t3.type) switch (n3) {
          case "sign":
            throw new TypeError("".concat(Jo(t3), ' instances for asymmetric algorithm signing must be of type "private"'));
          case "decrypt":
            throw new TypeError("".concat(Jo(t3), ' instances for asymmetric algorithm decryption must be of type "private"'));
        }
        if ("private" === t3.type) switch (n3) {
          case "verify":
            throw new TypeError("".concat(Jo(t3), ' instances for asymmetric algorithm verifying must be of type "public"'));
          case "encrypt":
            throw new TypeError("".concat(Jo(t3), ' instances for asymmetric algorithm encryption must be of type "public"'));
        }
      })(e3, t2, n2);
  }
}
var Go;
var Zo;
var qo;
var Bo;
if ("undefined" == typeof navigator || null === (Go = navigator.userAgent) || void 0 === Go || null === (Zo = Go.startsWith) || void 0 === Zo || !Zo.call(Go, "Mozilla/5.0 ")) {
  const e3 = "v6.8.1";
  Bo = "".concat("openid-client", "/").concat(e3), qo = { "user-agent": Bo };
}
var Xo = (e3) => Yo.get(e3);
var Yo;
var Qo;
function $o(e3) {
  return void 0 !== e3 ? Yt(e3) : (Qo || (Qo = /* @__PURE__ */ new WeakMap()), (e4, t2, n2, o2) => {
    let r2;
    return (r2 = Qo.get(t2)) || (!(function(e5, t3) {
      if ("string" != typeof e5) throw or("".concat(t3, " must be a string"), nr);
      if (0 === e5.length) throw or("".concat(t3, " must not be empty"), tr);
    })(t2.client_secret, '"metadata.client_secret"'), r2 = Yt(t2.client_secret), Qo.set(t2, r2)), r2(e4, t2, n2, o2);
  });
}
var er = St;
var tr = "ERR_INVALID_ARG_VALUE";
var nr = "ERR_INVALID_ARG_TYPE";
function or(e3, t2, n2) {
  const o2 = new TypeError(e3, { cause: n2 });
  return Object.assign(o2, { code: t2 }), o2;
}
function rr(e3) {
  return (async function(e4) {
    return Mt(e4, "codeVerifier"), xt(await crypto.subtle.digest("SHA-256", Rt(e4)));
  })(e3);
}
function ir() {
  return Vt();
}
var ar = class extends Error {
  constructor(e3, t2) {
    var n2;
    super(e3, t2), ut(this, "code", void 0), this.name = this.constructor.name, this.code = null == t2 ? void 0 : t2.code, null === (n2 = Error.captureStackTrace) || void 0 === n2 || n2.call(Error, this, this.constructor);
  }
};
function sr(e3, t2, n2) {
  return new ar(e3, { cause: t2, code: n2 });
}
function cr(e3) {
  if (e3 instanceof TypeError || e3 instanceof ar || e3 instanceof on2 || e3 instanceof rn || e3 instanceof an) throw e3;
  if (e3 instanceof jt) switch (e3.code) {
    case Nn:
      throw sr("only requests to HTTPS are allowed", e3, e3.code);
    case Wn:
      throw sr("only requests to HTTP or HTTPS are allowed", e3, e3.code);
    case Un:
      throw sr("unexpected HTTP response status code", e3.cause, e3.code);
    case Ln:
      throw sr("unexpected response content-type", e3.cause, e3.code);
    case Dn:
      throw sr("parsing error occured", e3, e3.code);
    case Kn:
      throw sr("invalid response encountered", e3, e3.code);
    case Hn:
      throw sr("unexpected JWT claim value encountered", e3, e3.code);
    case Mn:
      throw sr("unexpected JSON attribute value encountered", e3, e3.code);
    case zn:
      throw sr("JWT timestamp claim value failed validation", e3, e3.code);
    default:
      throw sr(e3.message, e3, e3.code);
  }
  if (e3 instanceof Ct) throw sr("unsupported operation", e3, e3.code);
  if (e3 instanceof DOMException) switch (e3.name) {
    case "OperationError":
      throw sr("runtime operation error", e3, Cn);
    case "NotSupportedError":
      throw sr("runtime unsupported operation", e3, Cn);
    case "TimeoutError":
      throw sr("operation timed out", e3, "OAUTH_TIMEOUT");
    case "AbortError":
      throw sr("operation aborted", e3, "OAUTH_ABORT");
  }
  throw new ar("something went wrong", { cause: e3 });
}
async function ur(e3, t2, n2, o2, r2) {
  const i2 = await (async function(e4, t3) {
    var n3, o3;
    if (!(e4 instanceof URL)) throw or('"server" must be an instance of URL', nr);
    const r3 = !e4.href.includes("/.well-known/"), i3 = null !== (n3 = null == t3 ? void 0 : t3.timeout) && void 0 !== n3 ? n3 : 30, a3 = AbortSignal.timeout(1e3 * i3), s3 = await (r3 ? zt(e4, { algorithm: null == t3 ? void 0 : t3.algorithm, [St]: null == t3 ? void 0 : t3[er], [bt]: null == t3 || null === (o3 = t3.execute) || void 0 === o3 ? void 0 : o3.includes(wr), signal: a3, headers: new Headers(qo) }) : ((null == t3 ? void 0 : t3[er]) || fetch)((en(e4, null == t3 || null === (c2 = t3.execute) || void 0 === c2 || !c2.includes(wr)), e4.href), { headers: Object.fromEntries(new Headers(dt({ accept: "application/json" }, qo)).entries()), body: void 0, method: "GET", redirect: "manual", signal: a3 })).then(((e5) => (async function(e6, t4) {
      const n4 = e6;
      if (!(n4 instanceof URL) && n4 !== to) throw vt('"expectedIssuerIdentifier" must be an instance of URL', "ERR_INVALID_ARG_TYPE");
      if (!gt(t4, Response)) throw vt('"response" must be an instance of Response', "ERR_INVALID_ARG_TYPE");
      if (200 !== t4.status) throw Dt('"response" is not a conform Authorization Server Metadata response (unexpected HTTP status code)', Un, t4);
      Fn(t4);
      const o4 = await eo(t4);
      if (Mt(o4.issuer, '"response" body "issuer" property', Kn, { body: o4 }), n4 !== to && new URL(o4.issuer).href !== n4.href) throw Dt('"response" body "issuer" property does not match the expected value', Mn, { expected: n4.href, body: o4, attribute: "issuer" });
      return o4;
    })(to, e5))).catch(cr);
    var c2;
    r3 && new URL(s3.issuer).href !== e4.href && ((function(e5, t4, n4) {
      return !("https://login.microsoftonline.com" !== e5.origin || null != n4 && n4.algorithm && "oidc" !== n4.algorithm || (t4[lr] = true, 0));
    })(e4, s3, t3) || (function(e5, t4) {
      return !(!e5.hostname.endsWith(".b2clogin.com") || null != t4 && t4.algorithm && "oidc" !== t4.algorithm);
    })(e4, t3) || (() => {
      throw new ar("discovered metadata issuer does not match the expected issuer", { code: Mn, cause: { expected: e4.href, body: s3, attribute: "issuer" } });
    })());
    return s3;
  })(e3, r2), a2 = new dr(i2, t2, n2, o2);
  let s2 = Xo(a2);
  if (null != r2 && r2[er] && (s2.fetch = r2[er]), null != r2 && r2.timeout && (s2.timeout = r2.timeout), null != r2 && r2.execute) for (const e4 of r2.execute) e4(a2);
  return a2;
}
new TextDecoder();
var lr = /* @__PURE__ */ Symbol();
var dr = class {
  constructor(e3, t2, n2, o2) {
    var r2, i2, a2, s2, c2;
    if ("string" != typeof t2 || !t2.length) throw or('"clientId" must be a non-empty string', nr);
    if ("string" == typeof n2 && (n2 = { client_secret: n2 }), void 0 !== (null === (r2 = n2) || void 0 === r2 ? void 0 : r2.client_id) && t2 !== n2.client_id) throw or('"clientId" and "metadata.client_id" must be the same', tr);
    const u2 = dt(dt({}, structuredClone(n2)), {}, { client_id: t2 });
    let l2;
    u2[_t] = null !== (i2 = null === (a2 = n2) || void 0 === a2 ? void 0 : a2[_t]) && void 0 !== i2 ? i2 : 0, u2[kt] = null !== (s2 = null === (c2 = n2) || void 0 === c2 ? void 0 : c2[kt]) && void 0 !== s2 ? s2 : 30, l2 = o2 || ("string" == typeof u2.client_secret && u2.client_secret.length ? $o(u2.client_secret) : (e4, t3, n3, o3) => {
      n3.set("client_id", t3.client_id);
    });
    let d2 = Object.freeze(u2);
    const h2 = structuredClone(e3);
    lr in e3 && (h2[no] = (t3) => {
      let { claims: { tid: n3 } } = t3;
      return e3.issuer.replace("{tenantid}", n3);
    });
    let p2 = Object.freeze(h2);
    Yo || (Yo = /* @__PURE__ */ new WeakMap()), Yo.set(this, { __proto__: null, as: p2, c: d2, auth: l2, tlsOnly: true, jwksCache: {} });
  }
  serverMetadata() {
    const e3 = structuredClone(Xo(this).as);
    return (function(e4) {
      Object.defineProperties(e4, /* @__PURE__ */ (function(e5) {
        return { supportsPKCE: { __proto__: null, value() {
          var t2;
          let n2 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "S256";
          return true === (null === (t2 = e5.code_challenge_methods_supported) || void 0 === t2 ? void 0 : t2.includes(n2));
        } } };
      })(e4));
    })(e3), e3;
  }
  clientMetadata() {
    return structuredClone(Xo(this).c);
  }
  get timeout() {
    return Xo(this).timeout;
  }
  set timeout(e3) {
    Xo(this).timeout = e3;
  }
  get [er]() {
    return Xo(this).fetch;
  }
  set [er](e3) {
    Xo(this).fetch = e3;
  }
};
function hr(e3) {
  Object.defineProperties(e3, (function(e4) {
    let t2;
    if (void 0 !== e4.expires_in) {
      const n2 = /* @__PURE__ */ new Date();
      n2.setSeconds(n2.getSeconds() + e4.expires_in), t2 = n2.getTime();
    }
    return { expiresIn: { __proto__: null, value() {
      if (t2) {
        const e5 = Date.now();
        return t2 > e5 ? Math.floor((t2 - e5) / 1e3) : 0;
      }
    } }, claims: { __proto__: null, value() {
      try {
        return vn(this);
      } catch (e5) {
        return;
      }
    } } };
  })(e3));
}
async function pr(e3, t2, n2) {
  var o2;
  let r2 = arguments.length > 3 && void 0 !== arguments[3] && arguments[3];
  const i2 = null === (o2 = e3.headers.get("retry-after")) || void 0 === o2 ? void 0 : o2.trim();
  if (void 0 === i2) return;
  let a2;
  if (/^\d+$/.test(i2)) a2 = parseInt(i2, 10);
  else {
    const e4 = new Date(i2);
    if (Number.isFinite(e4.getTime())) {
      const t3 = /* @__PURE__ */ new Date(), n3 = e4.getTime() - t3.getTime();
      n3 > 0 && (a2 = Math.ceil(n3 / 1e3));
    }
  }
  if (r2 && !Number.isFinite(a2)) throw new jt("invalid Retry-After header value", { cause: e3 });
  a2 > t2 && await fr(a2 - t2, n2);
}
function fr(e3, t2) {
  return new Promise(((n2, o2) => {
    const r2 = (e4) => {
      try {
        t2.throwIfAborted();
      } catch (e5) {
        return void o2(e5);
      }
      if (e4 <= 0) return void n2();
      const i2 = Math.min(e4, 5);
      setTimeout((() => r2(e4 - i2)), 1e3 * i2);
    };
    r2(e3);
  }));
}
async function mr(e3, t2) {
  Sr(e3);
  const { as: n2, c: o2, auth: r2, fetch: i2, tlsOnly: a2, timeout: s2 } = Xo(e3);
  return (async function(e4, t3, n3, o3, r3) {
    Bt(e4), Xt(t3);
    const i3 = nn(e4, "backchannel_authentication_endpoint", t3.use_mtls_endpoint_aliases, true !== (null == r3 ? void 0 : r3[bt])), a3 = new URLSearchParams(o3);
    a3.set("client_id", t3.client_id);
    const s3 = Ut(null == r3 ? void 0 : r3.headers);
    return s3.set("accept", "application/json"), mn(e4, t3, n3, i3, a3, s3, r3);
  })(n2, o2, r2, t2, { [St]: i2, [bt]: !a2, headers: new Headers(qo), signal: Er(s2) }).then(((e4) => (async function(e5, t3, n3) {
    if (Bt(e5), Xt(t3), !gt(n3, Response)) throw vt('"response" must be an instance of Response', "ERR_INVALID_ARG_TYPE");
    await hn(n3, 200, "Backchannel Authentication Endpoint"), Fn(n3);
    const o3 = await eo(n3);
    Mt(o3.auth_req_id, '"response" body "auth_req_id" property', Kn, { body: o3 });
    let r3 = "number" != typeof o3.expires_in ? parseFloat(o3.expires_in) : o3.expires_in;
    return Ht(r3, true, '"response" body "expires_in" property', Kn, { body: o3 }), o3.expires_in = r3, void 0 !== o3.interval && Ht(o3.interval, false, '"response" body "interval" property', Kn, { body: o3 }), o3;
  })(n2, o2, e4))).catch(cr);
}
async function yr(e3, t2, n2, o2) {
  var r2, i2;
  Sr(e3), n2 = new URLSearchParams(n2);
  let a2 = null !== (r2 = t2.interval) && void 0 !== r2 ? r2 : 5;
  const s2 = null !== (i2 = null == o2 ? void 0 : o2.signal) && void 0 !== i2 ? i2 : AbortSignal.timeout(1e3 * t2.expires_in);
  try {
    await fr(a2, s2);
  } catch (e4) {
    cr(e4);
  }
  const { as: c2, c: u2, auth: l2, fetch: d2, tlsOnly: h2, nonRepudiation: p2, timeout: f2, decrypt: m2 } = Xo(e3), y2 = (r3, i3) => yr(e3, dt(dt({}, t2), {}, { interval: r3 }), n2, dt(dt({}, o2), {}, { signal: s2, flag: i3 })), w2 = await (async function(e4, t3, n3, o3, r3) {
    Bt(e4), Xt(t3), Mt(o3, '"authReqId"');
    const i3 = new URLSearchParams(null == r3 ? void 0 : r3.additionalParameters);
    return i3.set("auth_req_id", o3), yn(e4, t3, n3, "urn:openid:params:grant-type:ciba", i3, r3);
  })(c2, u2, l2, t2.auth_req_id, { [St]: d2, [bt]: !h2, additionalParameters: n2, DPoP: null == o2 ? void 0 : o2.DPoP, headers: new Headers(qo), signal: s2.aborted ? s2 : Er(f2) }).catch(cr);
  var g2;
  if (503 === w2.status && w2.headers.has("retry-after")) return await pr(w2, a2, s2, true), await (null === (g2 = w2.body) || void 0 === g2 ? void 0 : g2.cancel()), y2(a2);
  const v2 = (async function(e4, t3, n3, o3) {
    return bn(e4, t3, n3, void 0, null == o3 ? void 0 : o3[At], null == o3 ? void 0 : o3.recognizedTokenTypes);
  })(c2, u2, w2, { [At]: m2 });
  let b2;
  try {
    b2 = await v2;
  } catch (e4) {
    if (Ar(e4, o2)) return y2(a2, Tr);
    if (e4 instanceof on2) switch (e4.error) {
      case "slow_down":
        a2 += 5;
      case "authorization_pending":
        return await pr(e4.response, a2, s2), y2(a2);
    }
    cr(e4);
  }
  return b2.id_token && await (null == p2 ? void 0 : p2(w2)), hr(b2), b2;
}
function wr(e3) {
  Xo(e3).tlsOnly = false;
}
async function gr(e3, t2, n2, o2, r2) {
  if (Sr(e3), !((null == r2 ? void 0 : r2.flag) === Tr || t2 instanceof URL || (function(e4, t3) {
    try {
      return Object.getPrototypeOf(e4)[Symbol.toStringTag] === t3;
    } catch (e5) {
      return false;
    }
  })(t2, "Request"))) throw or('"currentUrl" must be an instance of URL, or Request', nr);
  let i2, a2;
  const { as: s2, c: c2, auth: u2, fetch: l2, tlsOnly: d2, jarm: h2, hybrid: p2, nonRepudiation: f2, timeout: m2, decrypt: y2, implicit: w2 } = Xo(e3);
  if ((null == r2 ? void 0 : r2.flag) === Tr) i2 = r2.authResponse, a2 = r2.redirectUri;
  else {
    if (!(t2 instanceof URL)) {
      const e4 = t2;
      switch (t2 = new URL(t2.url), e4.method) {
        case "GET":
          break;
        case "POST":
          const n3 = new URLSearchParams(await qn(e4));
          if (p2) t2.hash = n3.toString();
          else for (const [e5, o3] of n3.entries()) t2.searchParams.append(e5, o3);
          break;
        default:
          throw or("unexpected Request HTTP method", tr);
      }
    }
    switch (a2 = (function(e4) {
      return (e4 = new URL(e4)).search = "", e4.hash = "", e4.href;
    })(t2), true) {
      case !!h2:
        i2 = await h2(t2, null == n2 ? void 0 : n2.expectedState);
        break;
      case !!p2:
        i2 = await p2(t2, null == n2 ? void 0 : n2.expectedNonce, null == n2 ? void 0 : n2.expectedState, null == n2 ? void 0 : n2.maxAge);
        break;
      case !!w2:
        throw new TypeError("authorizationCodeGrant() cannot be used by response_type=id_token clients");
      default:
        try {
          i2 = $n(s2, c2, t2.searchParams, null == n2 ? void 0 : n2.expectedState);
        } catch (e4) {
          cr(e4);
        }
    }
  }
  const g2 = await (async function(e4, t3, n3, o3, r3, i3, a3) {
    if (Bt(e4), Xt(t3), !Sn.has(o3)) throw vt('"callbackParameters" must be an instance of URLSearchParams obtained from "validateAuthResponse()", or "validateJwtAuthResponse()', "ERR_INVALID_ARG_VALUE");
    Mt(r3, '"redirectUri"');
    const s3 = Xn(o3, "code");
    if (!s3) throw Dt('no authorization code in "callbackParameters"', Kn);
    const c3 = new URLSearchParams(null == a3 ? void 0 : a3.additionalParameters);
    return c3.set("redirect_uri", r3), c3.set("code", s3), i3 !== En && (Mt(i3, '"codeVerifier"'), c3.set("code_verifier", i3)), yn(e4, t3, n3, "authorization_code", c3, a3);
  })(s2, c2, u2, i2, a2, (null == n2 ? void 0 : n2.pkceCodeVerifier) || En, { additionalParameters: o2, [St]: l2, [bt]: !d2, DPoP: null == r2 ? void 0 : r2.DPoP, headers: new Headers(qo), signal: Er(m2) }).catch(cr);
  "string" != typeof (null == n2 ? void 0 : n2.expectedNonce) && "number" != typeof (null == n2 ? void 0 : n2.maxAge) || (n2.idTokenExpected = true);
  const v2 = In(s2, c2, g2, { expectedNonce: null == n2 ? void 0 : n2.expectedNonce, maxAge: null == n2 ? void 0 : n2.maxAge, requireIdToken: null == n2 ? void 0 : n2.idTokenExpected, [At]: y2 });
  let b2;
  try {
    b2 = await v2;
  } catch (t3) {
    if (Ar(t3, r2)) return gr(e3, void 0, n2, o2, dt(dt({}, r2), {}, { flag: Tr, authResponse: i2, redirectUri: a2 }));
    cr(t3);
  }
  return b2.id_token && await (null == f2 ? void 0 : f2(g2)), hr(b2), b2;
}
async function vr(e3, t2, n2, o2) {
  Sr(e3), n2 = new URLSearchParams(n2);
  const { as: r2, c: i2, auth: a2, fetch: s2, tlsOnly: c2, nonRepudiation: u2, timeout: l2, decrypt: d2 } = Xo(e3), h2 = await (async function(e4, t3, n3, o3, r3) {
    Bt(e4), Xt(t3), Mt(o3, '"refreshToken"');
    const i3 = new URLSearchParams(null == r3 ? void 0 : r3.additionalParameters);
    return i3.set("refresh_token", o3), yn(e4, t3, n3, "refresh_token", i3, r3);
  })(r2, i2, a2, t2, { [St]: s2, [bt]: !c2, additionalParameters: n2, DPoP: null == o2 ? void 0 : o2.DPoP, headers: new Headers(qo), signal: Er(l2) }).catch(cr), p2 = (async function(e4, t3, n3, o3) {
    return bn(e4, t3, n3, void 0, null == o3 ? void 0 : o3[At], null == o3 ? void 0 : o3.recognizedTokenTypes);
  })(r2, i2, h2, { [At]: d2 });
  let f2;
  try {
    f2 = await p2;
  } catch (r3) {
    if (Ar(r3, o2)) return vr(e3, t2, n2, dt(dt({}, o2), {}, { flag: Tr }));
    cr(r3);
  }
  return f2.id_token && await (null == u2 ? void 0 : u2(h2)), hr(f2), f2;
}
async function br(e3, t2, n2) {
  Sr(e3), t2 = new URLSearchParams(t2);
  const { as: o2, c: r2, auth: i2, fetch: a2, tlsOnly: s2, timeout: c2 } = Xo(e3), u2 = await (async function(e4, t3, n3, o3, r3) {
    return Bt(e4), Xt(t3), yn(e4, t3, n3, "client_credentials", new URLSearchParams(o3), r3);
  })(o2, r2, i2, t2, { [St]: a2, [bt]: !s2, DPoP: null == n2 ? void 0 : n2.DPoP, headers: new Headers(qo), signal: Er(c2) }).catch(cr), l2 = (async function(e4, t3, n3, o3) {
    return bn(e4, t3, n3, void 0, null == o3 ? void 0 : o3[At], null == o3 ? void 0 : o3.recognizedTokenTypes);
  })(o2, r2, u2);
  let d2;
  try {
    d2 = await l2;
  } catch (o3) {
    if (Ar(o3, n2)) return br(e3, t2, dt(dt({}, n2), {}, { flag: Tr }));
    cr(o3);
  }
  return hr(d2), d2;
}
function _r(e3, t2) {
  Sr(e3);
  const { as: n2, c: o2, tlsOnly: r2, hybrid: i2, jarm: a2, implicit: s2 } = Xo(e3), c2 = nn(n2, "authorization_endpoint", false, r2);
  if ((t2 = new URLSearchParams(t2)).has("client_id") || t2.set("client_id", o2.client_id), !t2.has("request_uri") && !t2.has("request")) {
    if (t2.has("response_type") || t2.set("response_type", i2 ? "code id_token" : s2 ? "id_token" : "code"), s2 && !t2.has("nonce")) throw or("response_type=id_token clients must provide a nonce parameter in their authorization request parameters", tr);
    a2 && t2.set("response_mode", "jwt");
  }
  for (const [e4, n3] of t2.entries()) c2.searchParams.append(e4, n3);
  return c2;
}
async function kr(e3, t2, n2) {
  Sr(e3);
  const o2 = _r(e3, t2), { as: r2, c: i2, auth: a2, fetch: s2, tlsOnly: c2, timeout: u2 } = Xo(e3), l2 = await (async function(e4, t3, n3, o3, r3) {
    var i3;
    Bt(e4), Xt(t3);
    const a3 = nn(e4, "pushed_authorization_request_endpoint", t3.use_mtls_endpoint_aliases, true !== (null == r3 ? void 0 : r3[bt])), s3 = new URLSearchParams(o3);
    s3.set("client_id", t3.client_id);
    const c3 = Ut(null == r3 ? void 0 : r3.headers);
    c3.set("accept", "application/json"), void 0 !== (null == r3 ? void 0 : r3.DPoP) && (pn(r3.DPoP), await r3.DPoP.addProof(a3, c3, "POST"));
    const u3 = await mn(e4, t3, n3, a3, s3, c3, r3);
    return null == r3 || null === (i3 = r3.DPoP) || void 0 === i3 || i3.cacheNonce(u3, a3), u3;
  })(r2, i2, a2, o2.searchParams, { [St]: s2, [bt]: !c2, DPoP: null == n2 ? void 0 : n2.DPoP, headers: new Headers(qo), signal: Er(u2) }).catch(cr), d2 = (async function(e4, t3, n3) {
    if (Bt(e4), Xt(t3), !gt(n3, Response)) throw vt('"response" must be an instance of Response', "ERR_INVALID_ARG_TYPE");
    await hn(n3, 201, "Pushed Authorization Request Endpoint"), Fn(n3);
    const o3 = await eo(n3);
    Mt(o3.request_uri, '"response" body "request_uri" property', Kn, { body: o3 });
    let r3 = "number" != typeof o3.expires_in ? parseFloat(o3.expires_in) : o3.expires_in;
    return Ht(r3, true, '"response" body "expires_in" property', Kn, { body: o3 }), o3.expires_in = r3, o3;
  })(r2, i2, l2);
  let h2;
  try {
    h2 = await d2;
  } catch (o3) {
    if (Ar(o3, n2)) return kr(e3, t2, dt(dt({}, n2), {}, { flag: Tr }));
    cr(o3);
  }
  return _r(e3, { request_uri: h2.request_uri });
}
function Sr(e3) {
  if (!(e3 instanceof dr)) throw or('"config" must be an instance of Configuration', nr);
  if (Object.getPrototypeOf(e3) !== dr.prototype) throw or("subclassing Configuration is not allowed", tr);
}
function Er(e3) {
  return e3 ? AbortSignal.timeout(1e3 * e3) : void 0;
}
function Ar(e3, t2) {
  return !(null == t2 || !t2.DPoP || t2.flag === Tr) && (function(e4) {
    if (e4 instanceof an) {
      const { 0: t3, length: n2 } = e4.cause;
      return 1 === n2 && "dpop" === t3.scheme && "use_dpop_nonce" === t3.parameters.error;
    }
    return e4 instanceof on2 && "use_dpop_nonce" === e4.error;
  })(e3);
}
Object.freeze(dr.prototype);
var Tr = /* @__PURE__ */ Symbol();
async function Pr(e3, t2, n2, o2) {
  Sr(e3);
  const { as: r2, c: i2, auth: a2, fetch: s2, tlsOnly: c2, timeout: u2, decrypt: l2 } = Xo(e3), d2 = await (async function(e4, t3, n3, o3, r3, i3) {
    return Bt(e4), Xt(t3), Mt(o3, '"grantType"'), yn(e4, t3, n3, o3, new URLSearchParams(r3), i3);
  })(r2, i2, a2, t2, new URLSearchParams(n2), { [St]: s2, [bt]: !c2, DPoP: null == o2 ? void 0 : o2.DPoP, headers: new Headers(qo), signal: Er(u2) }).then(((e4) => {
    let n3;
    return "urn:ietf:params:oauth:grant-type:token-exchange" === t2 && (n3 = { n_a: () => {
    } }), (async function(e5, t3, n4, o3) {
      return bn(e5, t3, n4, void 0, null == o3 ? void 0 : o3[At], null == o3 ? void 0 : o3.recognizedTokenTypes);
    })(r2, i2, e4, { [At]: l2, recognizedTokenTypes: n3 });
  })).catch(cr);
  return hr(d2), d2;
}
async function Rr(e3, t2, n2) {
  if (t2 instanceof Uint8Array) {
    if (!e3.startsWith("HS")) throw new TypeError((function(e4) {
      for (var t3 = arguments.length, n3 = new Array(t3 > 1 ? t3 - 1 : 0), o2 = 1; o2 < t3; o2++) n3[o2 - 1] = arguments[o2];
      return Ao("Key must be ", e4, ...n3);
    })(t2, "CryptoKey", "KeyObject", "JSON Web Key"));
    return crypto.subtle.importKey("raw", t2, { hash: "SHA-".concat(e3.slice(-3)), name: "HMAC" }, false, [n2]);
  }
  return Eo(t2, e3, n2), t2;
}
async function Ir(e3, t2, n2, o2) {
  const r2 = await Rr(e3, t2, "verify");
  !(function(e4, t3) {
    if (e4.startsWith("RS") || e4.startsWith("PS")) {
      const { modulusLength: n3 } = t3.algorithm;
      if ("number" != typeof n3 || n3 < 2048) throw new TypeError("".concat(e4, " requires key modulusLength to be 2048 bits or larger"));
    }
  })(e3, r2);
  const i2 = (function(e4, t3) {
    const n3 = "SHA-".concat(e4.slice(-3));
    switch (e4) {
      case "HS256":
      case "HS384":
      case "HS512":
        return { hash: n3, name: "HMAC" };
      case "PS256":
      case "PS384":
      case "PS512":
        return { hash: n3, name: "RSA-PSS", saltLength: parseInt(e4.slice(-3), 10) >> 3 };
      case "RS256":
      case "RS384":
      case "RS512":
        return { hash: n3, name: "RSASSA-PKCS1-v1_5" };
      case "ES256":
      case "ES384":
      case "ES512":
        return { hash: n3, name: "ECDSA", namedCurve: t3.namedCurve };
      case "Ed25519":
      case "EdDSA":
        return { name: "Ed25519" };
      case "ML-DSA-44":
      case "ML-DSA-65":
      case "ML-DSA-87":
        return { name: e4 };
      default:
        throw new po("alg ".concat(e4, " is not supported either by JOSE or your javascript runtime"));
    }
  })(e3, r2.algorithm);
  try {
    return await crypto.subtle.verify(i2, r2, n2, o2);
  } catch (e4) {
    return false;
  }
}
async function Or(e3, t2, n2) {
  if (!Oo(e3)) throw new fo("Flattened JWS must be an object");
  if (void 0 === e3.protected && void 0 === e3.header) throw new fo('Flattened JWS must have either of the "protected" or "header" members');
  if (void 0 !== e3.protected && "string" != typeof e3.protected) throw new fo("JWS Protected Header incorrect type");
  if (void 0 === e3.payload) throw new fo("JWS Payload missing");
  if ("string" != typeof e3.signature) throw new fo("JWS Signature missing or incorrect type");
  if (void 0 !== e3.header && !Oo(e3.header)) throw new fo("JWS Unprotected Header incorrect type");
  let o2 = {};
  if (e3.protected) try {
    const t3 = so(e3.protected);
    o2 = JSON.parse(ro.decode(t3));
  } catch (e4) {
    throw new fo("JWS Protected Header is invalid");
  }
  if (!(function() {
    for (var e4 = arguments.length, t3 = new Array(e4), n3 = 0; n3 < e4; n3++) t3[n3] = arguments[n3];
    const o3 = t3.filter(Boolean);
    if (0 === o3.length || 1 === o3.length) return true;
    let r3;
    for (const e5 of o3) {
      const t4 = Object.keys(e5);
      if (r3 && 0 !== r3.size) for (const e6 of t4) {
        if (r3.has(e6)) return false;
        r3.add(e6);
      }
      else r3 = new Set(t4);
    }
    return true;
  })(o2, e3.header)) throw new fo("JWS Protected and JWS Unprotected Header Parameter names must be disjoint");
  const r2 = dt(dt({}, o2), e3.header), i2 = (function(e4, t3, n3, o3, r3) {
    if (void 0 !== r3.crit && void 0 === (null == o3 ? void 0 : o3.crit)) throw new e4('"crit" (Critical) Header Parameter MUST be integrity protected');
    if (!o3 || void 0 === o3.crit) return /* @__PURE__ */ new Set();
    if (!Array.isArray(o3.crit) || 0 === o3.crit.length || o3.crit.some(((e5) => "string" != typeof e5 || 0 === e5.length))) throw new e4('"crit" (Critical) Header Parameter MUST be an array of non-empty strings when present');
    let i3;
    i3 = void 0 !== n3 ? new Map([...Object.entries(n3), ...t3.entries()]) : t3;
    for (const t4 of o3.crit) {
      if (!i3.has(t4)) throw new po('Extension Header Parameter "'.concat(t4, '" is not recognized'));
      if (void 0 === r3[t4]) throw new e4('Extension Header Parameter "'.concat(t4, '" is missing'));
      if (i3.get(t4) && void 0 === o3[t4]) throw new e4('Extension Header Parameter "'.concat(t4, '" MUST be integrity protected'));
    }
    return new Set(o3.crit);
  })(fo, /* @__PURE__ */ new Map([["b64", true]]), null == n2 ? void 0 : n2.crit, o2, r2);
  let a2 = true;
  if (i2.has("b64") && (a2 = o2.b64, "boolean" != typeof a2)) throw new fo('The "b64" (base64url-encode payload) Header Parameter must be a boolean');
  const { alg: s2 } = r2;
  if ("string" != typeof s2 || !s2) throw new fo('JWS "alg" (Algorithm) Header Parameter missing or invalid');
  const c2 = n2 && (function(e4, t3) {
    if (void 0 !== t3 && (!Array.isArray(t3) || t3.some(((e5) => "string" != typeof e5)))) throw new TypeError('"'.concat(e4, '" option must be an array of strings'));
    if (t3) return new Set(t3);
  })("algorithms", n2.algorithms);
  if (c2 && !c2.has(s2)) throw new ho('"alg" (Algorithm) Header Parameter value not allowed');
  if (a2) {
    if ("string" != typeof e3.payload) throw new fo("JWS Payload must be a string");
  } else if ("string" != typeof e3.payload && !(e3.payload instanceof Uint8Array)) throw new fo("JWS Payload must be a string or an Uint8Array instance");
  let u2 = false;
  "function" == typeof t2 && (t2 = await t2(o2, e3), u2 = true), Fo(s2, t2, "verify");
  const l2 = (function() {
    for (var e4 = arguments.length, t3 = new Array(e4), n3 = 0; n3 < e4; n3++) t3[n3] = arguments[n3];
    const o3 = t3.reduce(((e5, t4) => {
      let { length: n4 } = t4;
      return e5 + n4;
    }), 0), r3 = new Uint8Array(o3);
    let i3 = 0;
    for (const e5 of t3) r3.set(e5, i3), i3 += e5.length;
    return r3;
  })(void 0 !== e3.protected ? io(e3.protected) : new Uint8Array(), io("."), "string" == typeof e3.payload ? a2 ? io(e3.payload) : oo.encode(e3.payload) : e3.payload);
  let d2;
  try {
    d2 = so(e3.signature);
  } catch (e4) {
    throw new fo("Failed to base64url decode the signature");
  }
  const h2 = await Mo(t2, s2);
  if (!await Ir(s2, h2, d2, l2)) throw new bo();
  let p2;
  if (a2) try {
    p2 = so(e3.payload);
  } catch (e4) {
    throw new fo("Failed to base64url decode the payload");
  }
  else p2 = "string" == typeof e3.payload ? oo.encode(e3.payload) : e3.payload;
  const f2 = { payload: p2 };
  return void 0 !== e3.protected && (f2.protectedHeader = o2), void 0 !== e3.header && (f2.unprotectedHeader = e3.header), u2 ? dt(dt({}, f2), {}, { key: h2 }) : f2;
}
var xr = (e3) => Math.floor(e3.getTime() / 1e3);
var Cr = /^(\+|\-)? ?(\d+|\d+\.\d+) ?(seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)(?: (ago|from now))?$/i;
function jr(e3) {
  const t2 = Cr.exec(e3);
  if (!t2 || t2[4] && t2[1]) throw new TypeError("Invalid time period format");
  const n2 = parseFloat(t2[2]);
  let o2;
  switch (t2[3].toLowerCase()) {
    case "sec":
    case "secs":
    case "second":
    case "seconds":
    case "s":
      o2 = Math.round(n2);
      break;
    case "minute":
    case "minutes":
    case "min":
    case "mins":
    case "m":
      o2 = Math.round(60 * n2);
      break;
    case "hour":
    case "hours":
    case "hr":
    case "hrs":
    case "h":
      o2 = Math.round(3600 * n2);
      break;
    case "day":
    case "days":
    case "d":
      o2 = Math.round(86400 * n2);
      break;
    case "week":
    case "weeks":
    case "w":
      o2 = Math.round(604800 * n2);
      break;
    default:
      o2 = Math.round(31557600 * n2);
  }
  return "-" === t2[1] || "ago" === t2[4] ? -o2 : o2;
}
var Dr = (e3) => e3.includes("/") ? e3.toLowerCase() : "application/".concat(e3.toLowerCase());
var Kr = (e3, t2) => "string" == typeof e3 ? t2.includes(e3) : !!Array.isArray(e3) && t2.some(Set.prototype.has.bind(new Set(e3)));
async function Lr(e3, t2, n2) {
  var o2;
  const r2 = await (async function(e4, t3, n3) {
    if (e4 instanceof Uint8Array && (e4 = ro.decode(e4)), "string" != typeof e4) throw new fo("Compact JWS must be a string or Uint8Array");
    const { 0: o3, 1: r3, 2: i3, length: a3 } = e4.split(".");
    if (3 !== a3) throw new fo("Invalid Compact JWS");
    const s2 = await Or({ payload: r3, protected: o3, signature: i3 }, t3, n3), c2 = { payload: s2.payload, protectedHeader: s2.protectedHeader };
    return "function" == typeof t3 ? dt(dt({}, c2), {}, { key: s2.key }) : c2;
  })(e3, t2, n2);
  if (null !== (o2 = r2.protectedHeader.crit) && void 0 !== o2 && o2.includes("b64") && false === r2.protectedHeader.b64) throw new mo("JWTs MUST NOT use unencoded payload");
  const i2 = (function(e4, t3) {
    let n3, o3 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
    try {
      n3 = JSON.parse(ro.decode(t3));
    } catch (e5) {
    }
    if (!Oo(n3)) throw new mo("JWT Claims Set must be a top-level JSON object");
    const { typ: r3 } = o3;
    if (r3 && ("string" != typeof e4.typ || Dr(e4.typ) !== Dr(r3))) throw new uo('unexpected "typ" JWT header value', n3, "typ", "check_failed");
    const { requiredClaims: i3 = [], issuer: a3, subject: s2, audience: c2, maxTokenAge: u2 } = o3, l2 = [...i3];
    void 0 !== u2 && l2.push("iat"), void 0 !== c2 && l2.push("aud"), void 0 !== s2 && l2.push("sub"), void 0 !== a3 && l2.push("iss");
    for (const e5 of new Set(l2.reverse())) if (!(e5 in n3)) throw new uo('missing required "'.concat(e5, '" claim'), n3, e5, "missing");
    if (a3 && !(Array.isArray(a3) ? a3 : [a3]).includes(n3.iss)) throw new uo('unexpected "iss" claim value', n3, "iss", "check_failed");
    if (s2 && n3.sub !== s2) throw new uo('unexpected "sub" claim value', n3, "sub", "check_failed");
    if (c2 && !Kr(n3.aud, "string" == typeof c2 ? [c2] : c2)) throw new uo('unexpected "aud" claim value', n3, "aud", "check_failed");
    let d2;
    switch (typeof o3.clockTolerance) {
      case "string":
        d2 = jr(o3.clockTolerance);
        break;
      case "number":
        d2 = o3.clockTolerance;
        break;
      case "undefined":
        d2 = 0;
        break;
      default:
        throw new TypeError("Invalid clockTolerance option type");
    }
    const { currentDate: h2 } = o3, p2 = xr(h2 || /* @__PURE__ */ new Date());
    if ((void 0 !== n3.iat || u2) && "number" != typeof n3.iat) throw new uo('"iat" claim must be a number', n3, "iat", "invalid");
    if (void 0 !== n3.nbf) {
      if ("number" != typeof n3.nbf) throw new uo('"nbf" claim must be a number', n3, "nbf", "invalid");
      if (n3.nbf > p2 + d2) throw new uo('"nbf" claim timestamp check failed', n3, "nbf", "check_failed");
    }
    if (void 0 !== n3.exp) {
      if ("number" != typeof n3.exp) throw new uo('"exp" claim must be a number', n3, "exp", "invalid");
      if (n3.exp <= p2 - d2) throw new lo('"exp" claim timestamp check failed', n3, "exp", "check_failed");
    }
    if (u2) {
      const e5 = p2 - n3.iat;
      if (e5 - d2 > ("number" == typeof u2 ? u2 : jr(u2))) throw new lo('"iat" claim timestamp check failed (too far in the past)', n3, "iat", "check_failed");
      if (e5 < 0 - d2) throw new uo('"iat" claim timestamp check failed (it should be in the past)', n3, "iat", "check_failed");
    }
    return n3;
  })(r2.protectedHeader, r2.payload, n2), a2 = { payload: i2, protectedHeader: r2.protectedHeader };
  return "function" == typeof t2 ? dt(dt({}, a2), {}, { key: r2.key }) : a2;
}
function Ur(e3) {
  return Oo(e3);
}
var Nr;
var Wr;
var zr = /* @__PURE__ */ new WeakMap();
var Hr = /* @__PURE__ */ new WeakMap();
var Mr = class {
  constructor(e3) {
    if (st(this, zr, void 0), st(this, Hr, /* @__PURE__ */ new WeakMap()), !(function(e4) {
      return e4 && "object" == typeof e4 && Array.isArray(e4.keys) && e4.keys.every(Ur);
    })(e3)) throw new yo("JSON Web Key Set malformed");
    ct(zr, this, structuredClone(e3));
  }
  jwks() {
    return at(zr, this);
  }
  async getKey(e3, t2) {
    const { alg: n2, kid: o2 } = dt(dt({}, e3), null == t2 ? void 0 : t2.header), r2 = (function(e4) {
      switch ("string" == typeof e4 && e4.slice(0, 2)) {
        case "RS":
        case "PS":
          return "RSA";
        case "ES":
          return "EC";
        case "Ed":
          return "OKP";
        case "ML":
          return "AKP";
        default:
          throw new po('Unsupported "alg" value for a JSON Web Key Set');
      }
    })(n2), i2 = at(zr, this).keys.filter(((e4) => {
      let t3 = r2 === e4.kty;
      if (t3 && "string" == typeof o2 && (t3 = o2 === e4.kid), !t3 || "string" != typeof e4.alg && "AKP" !== r2 || (t3 = n2 === e4.alg), t3 && "string" == typeof e4.use && (t3 = "sig" === e4.use), t3 && Array.isArray(e4.key_ops) && (t3 = e4.key_ops.includes("verify")), t3) switch (n2) {
        case "ES256":
          t3 = "P-256" === e4.crv;
          break;
        case "ES384":
          t3 = "P-384" === e4.crv;
          break;
        case "ES512":
          t3 = "P-521" === e4.crv;
          break;
        case "Ed25519":
        case "EdDSA":
          t3 = "Ed25519" === e4.crv;
      }
      return t3;
    })), { 0: a2, length: s2 } = i2;
    if (0 === s2) throw new wo();
    if (1 !== s2) {
      const e4 = new go(), t3 = at(Hr, this);
      throw e4[Symbol.asyncIterator] = pt((function* () {
        for (const e5 of i2) try {
          yield yield rt(Jr(t3, e5, n2));
        } catch (e6) {
        }
      })), e4;
    }
    return Jr(at(Hr, this), a2, n2);
  }
};
async function Jr(e3, t2, n2) {
  const o2 = e3.get(t2) || e3.set(t2, {}).get(t2);
  if (void 0 === o2[n2]) {
    const e4 = await (async function(e5, t3, n3) {
      var o3;
      if (!Oo(e5)) throw new TypeError("JWK must be an object");
      let r2;
      switch (null != t3 || (t3 = e5.alg), null != r2 || (r2 = null !== (o3 = null == n3 ? void 0 : n3.extractable) && void 0 !== o3 ? o3 : e5.ext), e5.kty) {
        case "oct":
          if ("string" != typeof e5.k || !e5.k) throw new TypeError('missing "k" (Key Value) Parameter value');
          return so(e5.k);
        case "RSA":
          if ("oth" in e5 && void 0 !== e5.oth) throw new po('RSA JWK "oth" (Other Primes Info) Parameter value is not supported');
          return No(dt(dt({}, e5), {}, { alg: t3, ext: r2 }));
        case "AKP":
          if ("string" != typeof e5.alg || !e5.alg) throw new TypeError('missing "alg" (Algorithm) Parameter value');
          if (void 0 !== t3 && t3 !== e5.alg) throw new TypeError("JWK alg and alg option value mismatch");
          return No(dt(dt({}, e5), {}, { ext: r2 }));
        case "EC":
        case "OKP":
          return No(dt(dt({}, e5), {}, { alg: t3, ext: r2 }));
        default:
          throw new po('Unsupported "kty" (Key Type) Parameter value');
      }
    })(dt(dt({}, t2), {}, { ext: true }), n2);
    if (e4 instanceof Uint8Array || "public" !== e4.type) throw new yo("JSON Web Key Set members must be public keys");
    o2[n2] = e4;
  }
  return o2[n2];
}
function Vr(e3) {
  const t2 = new Mr(e3), n2 = async (e4, n3) => t2.getKey(e4, n3);
  return Object.defineProperties(n2, { jwks: { value: () => structuredClone(t2.jwks()), enumerable: false, configurable: false, writable: false } }), n2;
}
var Fr;
if ("undefined" == typeof navigator || null === (Nr = navigator.userAgent) || void 0 === Nr || null === (Wr = Nr.startsWith) || void 0 === Wr || !Wr.call(Nr, "Mozilla/5.0 ")) {
  const e3 = "v6.1.3";
  Fr = "".concat("jose", "/").concat(e3);
}
var Gr = /* @__PURE__ */ Symbol();
var Zr = /* @__PURE__ */ Symbol();
var qr = /* @__PURE__ */ new WeakMap();
var Br = /* @__PURE__ */ new WeakMap();
var Xr = /* @__PURE__ */ new WeakMap();
var Yr = /* @__PURE__ */ new WeakMap();
var Qr = /* @__PURE__ */ new WeakMap();
var $r = /* @__PURE__ */ new WeakMap();
var ei = /* @__PURE__ */ new WeakMap();
var ti = /* @__PURE__ */ new WeakMap();
var ni = /* @__PURE__ */ new WeakMap();
var oi = /* @__PURE__ */ new WeakMap();
var ri = class {
  constructor(e3, t2) {
    if (st(this, qr, void 0), st(this, Br, void 0), st(this, Xr, void 0), st(this, Yr, void 0), st(this, Qr, void 0), st(this, $r, void 0), st(this, ei, void 0), st(this, ti, void 0), st(this, ni, void 0), st(this, oi, void 0), !(e3 instanceof URL)) throw new TypeError("url must be an instance of URL");
    var n2, o2;
    ct(qr, this, new URL(e3.href)), ct(Br, this, "number" == typeof (null == t2 ? void 0 : t2.timeoutDuration) ? null == t2 ? void 0 : t2.timeoutDuration : 5e3), ct(Xr, this, "number" == typeof (null == t2 ? void 0 : t2.cooldownDuration) ? null == t2 ? void 0 : t2.cooldownDuration : 3e4), ct(Yr, this, "number" == typeof (null == t2 ? void 0 : t2.cacheMaxAge) ? null == t2 ? void 0 : t2.cacheMaxAge : 6e5), ct(ei, this, new Headers(null == t2 ? void 0 : t2.headers)), Fr && !at(ei, this).has("User-Agent") && at(ei, this).set("User-Agent", Fr), at(ei, this).has("accept") || (at(ei, this).set("accept", "application/json"), at(ei, this).append("accept", "application/jwk-set+json")), ct(ti, this, null == t2 ? void 0 : t2[Gr]), void 0 !== (null == t2 ? void 0 : t2[Zr]) && (ct(oi, this, null == t2 ? void 0 : t2[Zr]), n2 = null == t2 ? void 0 : t2[Zr], o2 = at(Yr, this), "object" == typeof n2 && null !== n2 && "uat" in n2 && "number" == typeof n2.uat && !(Date.now() - n2.uat >= o2) && "jwks" in n2 && Oo(n2.jwks) && Array.isArray(n2.jwks.keys) && Array.prototype.every.call(n2.jwks.keys, Oo) && (ct(Qr, this, at(oi, this).uat), ct(ni, this, Vr(at(oi, this).jwks))));
  }
  pendingFetch() {
    return !!at($r, this);
  }
  coolingDown() {
    return "number" == typeof at(Qr, this) && Date.now() < at(Qr, this) + at(Xr, this);
  }
  fresh() {
    return "number" == typeof at(Qr, this) && Date.now() < at(Qr, this) + at(Yr, this);
  }
  jwks() {
    var e3;
    return null === (e3 = at(ni, this)) || void 0 === e3 ? void 0 : e3.jwks();
  }
  async getKey(e3, t2) {
    at(ni, this) && this.fresh() || await this.reload();
    try {
      return await at(ni, this).call(this, e3, t2);
    } catch (n2) {
      if (n2 instanceof wo && false === this.coolingDown()) return await this.reload(), at(ni, this).call(this, e3, t2);
      throw n2;
    }
  }
  async reload() {
    at($r, this) && ("undefined" != typeof WebSocketPair || "undefined" != typeof navigator && "Cloudflare-Workers" === navigator.userAgent || "undefined" != typeof EdgeRuntime && "vercel" === EdgeRuntime) && ct($r, this, void 0), at($r, this) || ct($r, this, (async function(e3, t2, n2) {
      let o2 = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : fetch;
      const r2 = await o2(e3, { method: "GET", signal: n2, redirect: "manual", headers: t2 }).catch(((e4) => {
        if ("TimeoutError" === e4.name) throw new vo();
        throw e4;
      }));
      if (200 !== r2.status) throw new co("Expected 200 OK from the JSON Web Key Set HTTP response");
      try {
        return await r2.json();
      } catch (e4) {
        throw new co("Failed to parse the JSON Web Key Set HTTP response as JSON");
      }
    })(at(qr, this).href, at(ei, this), AbortSignal.timeout(at(Br, this)), at(ti, this)).then(((e3) => {
      ct(ni, this, Vr(e3)), at(oi, this) && (at(oi, this).uat = Date.now(), at(oi, this).jwks = e3), ct(Qr, this, Date.now()), ct($r, this, void 0);
    })).catch(((e3) => {
      throw ct($r, this, void 0), e3;
    }))), await at($r, this);
  }
};
var ii = ["mfaToken"];
var ai = ["mfaToken"];
var si;
var ci;
var ui;
var li;
var di;
var hi;
var pi;
var fi;
var mi = class extends Error {
  constructor(e3, t2) {
    super(t2), ut(this, "code", void 0), this.name = "NotSupportedError", this.code = e3;
  }
};
var yi = class extends Error {
  constructor(e3, t2, n2) {
    super(t2), ut(this, "cause", void 0), ut(this, "code", void 0), this.code = e3, this.cause = n2 && { error: n2.error, error_description: n2.error_description, message: n2.message };
  }
};
var wi = class extends yi {
  constructor(e3, t2) {
    super("token_by_code_error", e3, t2), this.name = "TokenByCodeError";
  }
};
var gi = class extends yi {
  constructor(e3, t2) {
    super("token_by_client_credentials_error", e3, t2), this.name = "TokenByClientCredentialsError";
  }
};
var vi = class extends yi {
  constructor(e3, t2) {
    super("token_by_refresh_token_error", e3, t2), this.name = "TokenByRefreshTokenError";
  }
};
var bi = class extends yi {
  constructor(e3, t2) {
    super("token_for_connection_error", e3, t2), this.name = "TokenForConnectionErrorCode";
  }
};
var _i = class extends yi {
  constructor(e3, t2) {
    super("token_exchange_error", e3, t2), this.name = "TokenExchangeError";
  }
};
var ki = class extends Error {
  constructor(e3) {
    super(e3), ut(this, "code", "verify_logout_token_error"), this.name = "VerifyLogoutTokenError";
  }
};
var Si = class extends yi {
  constructor(e3) {
    super("backchannel_authentication_error", "There was an error when trying to use Client-Initiated Backchannel Authentication.", e3), ut(this, "code", "backchannel_authentication_error"), this.name = "BackchannelAuthenticationError";
  }
};
var Ei = class extends yi {
  constructor(e3) {
    super("build_authorization_url_error", "There was an error when trying to build the authorization URL.", e3), this.name = "BuildAuthorizationUrlError";
  }
};
var Ai = class extends yi {
  constructor(e3) {
    super("build_link_user_url_error", "There was an error when trying to build the Link User URL.", e3), this.name = "BuildLinkUserUrlError";
  }
};
var Ti = class extends yi {
  constructor(e3) {
    super("build_unlink_user_url_error", "There was an error when trying to build the Unlink User URL.", e3), this.name = "BuildUnlinkUserUrlError";
  }
};
var Pi = class extends Error {
  constructor() {
    super("The client secret or client assertion signing key must be provided."), ut(this, "code", "missing_client_auth_error"), this.name = "MissingClientAuthError";
  }
};
function Ri(e3) {
  return Object.entries(e3).filter(((e4) => {
    let [, t2] = e4;
    return void 0 !== t2;
  })).reduce(((e4, t2) => dt(dt({}, e4), {}, { [t2[0]]: t2[1] })), {});
}
var Ii = class extends Error {
  constructor(e3, t2, n2) {
    super(t2), ut(this, "cause", void 0), ut(this, "code", void 0), this.code = e3, this.cause = n2 && { error: n2.error, error_description: n2.error_description, message: n2.message };
  }
};
var Oi = class extends Ii {
  constructor(e3, t2) {
    super("mfa_list_authenticators_error", e3, t2), this.name = "MfaListAuthenticatorsError";
  }
};
var xi = class extends Ii {
  constructor(e3, t2) {
    super("mfa_enrollment_error", e3, t2), this.name = "MfaEnrollmentError";
  }
};
var Ci = class extends Ii {
  constructor(e3, t2) {
    super("mfa_delete_authenticator_error", e3, t2), this.name = "MfaDeleteAuthenticatorError";
  }
};
var ji = class extends Ii {
  constructor(e3, t2) {
    super("mfa_challenge_error", e3, t2), this.name = "MfaChallengeError";
  }
};
function Di(e3) {
  return { id: e3.id, authenticatorType: e3.authenticator_type, active: e3.active, name: e3.name, oobChannels: e3.oob_channels, type: e3.type };
}
var Ki = (si = /* @__PURE__ */ new WeakMap(), ci = /* @__PURE__ */ new WeakMap(), ui = /* @__PURE__ */ new WeakMap(), class {
  constructor(e3) {
    var t2;
    st(this, si, void 0), st(this, ci, void 0), st(this, ui, void 0), ct(si, this, "https://".concat(e3.domain)), ct(ci, this, e3.clientId), ct(ui, this, null !== (t2 = e3.customFetch) && void 0 !== t2 ? t2 : function() {
      return fetch(...arguments);
    });
  }
  async listAuthenticators(e3) {
    const t2 = "".concat(at(si, this), "/mfa/authenticators"), { mfaToken: n2 } = e3, o2 = await at(ui, this).call(this, t2, { method: "GET", headers: { Authorization: "Bearer ".concat(n2), "Content-Type": "application/json" } });
    if (!o2.ok) {
      const e4 = await o2.json();
      throw new Oi(e4.error_description || "Failed to list authenticators", e4);
    }
    return (await o2.json()).map(Di);
  }
  async enrollAuthenticator(e3) {
    const t2 = "".concat(at(si, this), "/mfa/associate"), { mfaToken: n2 } = e3, o2 = ht(e3, ii), r2 = { authenticator_types: o2.authenticatorTypes };
    "oobChannels" in o2 && (r2.oob_channels = o2.oobChannels), "phoneNumber" in o2 && o2.phoneNumber && (r2.phone_number = o2.phoneNumber), "email" in o2 && o2.email && (r2.email = o2.email);
    const i2 = await at(ui, this).call(this, t2, { method: "POST", headers: { Authorization: "Bearer ".concat(n2), "Content-Type": "application/json" }, body: JSON.stringify(r2) });
    if (!i2.ok) {
      const e4 = await i2.json();
      throw new xi(e4.error_description || "Failed to enroll authenticator", e4);
    }
    return (function(e4) {
      if ("otp" === e4.authenticator_type) return { authenticatorType: "otp", secret: e4.secret, barcodeUri: e4.barcode_uri, recoveryCodes: e4.recovery_codes, id: e4.id };
      if ("oob" === e4.authenticator_type) return { authenticatorType: "oob", oobChannel: e4.oob_channel, oobCode: e4.oob_code, bindingMethod: e4.binding_method, id: e4.id };
      throw new Error("Unexpected authenticator type: ".concat(e4.authenticator_type));
    })(await i2.json());
  }
  async deleteAuthenticator(e3) {
    const { authenticatorId: t2, mfaToken: n2 } = e3, o2 = "".concat(at(si, this), "/mfa/authenticators/").concat(encodeURIComponent(t2)), r2 = await at(ui, this).call(this, o2, { method: "DELETE", headers: { Authorization: "Bearer ".concat(n2), "Content-Type": "application/json" } });
    if (!r2.ok) {
      const e4 = await r2.json();
      throw new Ci(e4.error_description || "Failed to delete authenticator", e4);
    }
  }
  async challengeAuthenticator(e3) {
    const t2 = "".concat(at(si, this), "/mfa/challenge"), { mfaToken: n2 } = e3, o2 = ht(e3, ai), r2 = { mfa_token: n2, client_id: at(ci, this), challenge_type: o2.challengeType };
    o2.authenticatorId && (r2.authenticator_id = o2.authenticatorId);
    const i2 = await at(ui, this).call(this, t2, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(r2) });
    if (!i2.ok) {
      const e4 = await i2.json();
      throw new ji(e4.error_description || "Failed to challenge authenticator", e4);
    }
    return (function(e4) {
      const t3 = { challengeType: e4.challenge_type };
      return void 0 !== e4.oob_code && (t3.oobCode = e4.oob_code), void 0 !== e4.binding_method && (t3.bindingMethod = e4.binding_method), t3;
    })(await i2.json());
  }
});
var Li = class e2 {
  constructor(e3, t2, n2, o2, r2, i2, a2) {
    ut(this, "accessToken", void 0), ut(this, "idToken", void 0), ut(this, "refreshToken", void 0), ut(this, "expiresAt", void 0), ut(this, "scope", void 0), ut(this, "claims", void 0), ut(this, "authorizationDetails", void 0), ut(this, "tokenType", void 0), ut(this, "issuedTokenType", void 0), this.accessToken = e3, this.idToken = n2, this.refreshToken = o2, this.expiresAt = t2, this.scope = r2, this.claims = i2, this.authorizationDetails = a2;
  }
  static fromTokenEndpointResponse(t2) {
    const n2 = t2.id_token ? t2.claims() : void 0, o2 = new e2(t2.access_token, Math.floor(Date.now() / 1e3) + Number(t2.expires_in), t2.id_token, t2.refresh_token, t2.scope, n2, t2.authorization_details);
    return o2.tokenType = t2.token_type, o2.issuedTokenType = t2.issued_token_type, o2;
  }
};
var Ui = "openid profile email offline_access";
var Ni = Object.freeze(/* @__PURE__ */ new Set(["grant_type", "client_id", "client_secret", "client_assertion", "client_assertion_type", "subject_token", "subject_token_type", "requested_token_type", "actor_token", "actor_token_type", "audience", "aud", "resource", "resources", "resource_indicator", "scope", "connection", "login_hint", "organization", "assertion"]));
function Wi(e3) {
  if (null == e3) throw new _i("subject_token is required");
  if ("string" != typeof e3) throw new _i("subject_token must be a string");
  if (0 === e3.trim().length) throw new _i("subject_token cannot be blank or whitespace");
  if (e3 !== e3.trim()) throw new _i("subject_token must not include leading or trailing whitespace");
  if (/^bearer\s+/i.test(e3)) throw new _i("subject_token must not include the 'Bearer ' prefix");
}
function zi(e3, t2) {
  if (t2) {
    for (const [n2, o2] of Object.entries(t2)) if (!Ni.has(n2)) if (Array.isArray(o2)) {
      if (o2.length > 20) throw new _i("Parameter '".concat(n2, "' exceeds maximum array size of ").concat(20));
      o2.forEach(((t3) => {
        e3.append(n2, t3);
      }));
    } else e3.append(n2, o2);
  }
}
var Hi = (li = /* @__PURE__ */ new WeakMap(), di = /* @__PURE__ */ new WeakMap(), hi = /* @__PURE__ */ new WeakMap(), pi = /* @__PURE__ */ new WeakMap(), fi = /* @__PURE__ */ new WeakSet(), class {
  constructor(e3) {
    if ((function(e4, t2) {
      it(e4, t2), t2.add(e4);
    })(this, fi), st(this, li, void 0), st(this, di, void 0), st(this, hi, void 0), st(this, pi, void 0), ut(this, "mfa", void 0), ct(hi, this, e3), e3.useMtls && !e3.customFetch) throw new mi("mtls_without_custom_fetch_not_supported", "Using mTLS without a custom fetch implementation is not supported");
    this.mfa = new Ki({ domain: at(hi, this).domain, clientId: at(hi, this).clientId, customFetch: at(hi, this).customFetch });
  }
  async buildAuthorizationUrl(e3) {
    const { serverMetadata: t2 } = await ot(fi, this, Mi).call(this);
    if (null != e3 && e3.pushedAuthorizationRequests && !t2.pushed_authorization_request_endpoint) throw new mi("par_not_supported_error", "The Auth0 tenant does not have pushed authorization requests enabled. Learn how to enable it here: https://auth0.com/docs/get-started/applications/configure-par");
    try {
      return await ot(fi, this, Gi).call(this, e3);
    } catch (e4) {
      throw new Ei(e4);
    }
  }
  async buildLinkUserUrl(e3) {
    try {
      const t2 = await ot(fi, this, Gi).call(this, { authorizationParams: dt(dt({}, e3.authorizationParams), {}, { requested_connection: e3.connection, requested_connection_scope: e3.connectionScope, scope: "openid link_account offline_access", id_token_hint: e3.idToken }) });
      return { linkUserUrl: t2.authorizationUrl, codeVerifier: t2.codeVerifier };
    } catch (e4) {
      throw new Ai(e4);
    }
  }
  async buildUnlinkUserUrl(e3) {
    try {
      const t2 = await ot(fi, this, Gi).call(this, { authorizationParams: dt(dt({}, e3.authorizationParams), {}, { requested_connection: e3.connection, scope: "openid unlink_account", id_token_hint: e3.idToken }) });
      return { unlinkUserUrl: t2.authorizationUrl, codeVerifier: t2.codeVerifier };
    } catch (e4) {
      throw new Ti(e4);
    }
  }
  async backchannelAuthentication(e3) {
    const { configuration: t2, serverMetadata: n2 } = await ot(fi, this, Mi).call(this), o2 = Ri(dt(dt({}, at(hi, this).authorizationParams), null == e3 ? void 0 : e3.authorizationParams)), r2 = new URLSearchParams(dt(dt({ scope: Ui }, o2), {}, { client_id: at(hi, this).clientId, binding_message: e3.bindingMessage, login_hint: JSON.stringify({ format: "iss_sub", iss: n2.issuer, sub: e3.loginHint.sub }) }));
    e3.requestedExpiry && r2.append("requested_expiry", e3.requestedExpiry.toString()), e3.authorizationDetails && r2.append("authorization_details", JSON.stringify(e3.authorizationDetails));
    try {
      const e4 = await mr(t2, r2), n3 = await yr(t2, e4);
      return Li.fromTokenEndpointResponse(n3);
    } catch (e4) {
      throw new Si(e4);
    }
  }
  async initiateBackchannelAuthentication(e3) {
    const { configuration: t2, serverMetadata: n2 } = await ot(fi, this, Mi).call(this), o2 = Ri(dt(dt({}, at(hi, this).authorizationParams), null == e3 ? void 0 : e3.authorizationParams)), r2 = new URLSearchParams(dt(dt({ scope: Ui }, o2), {}, { client_id: at(hi, this).clientId, binding_message: e3.bindingMessage, login_hint: JSON.stringify({ format: "iss_sub", iss: n2.issuer, sub: e3.loginHint.sub }) }));
    e3.requestedExpiry && r2.append("requested_expiry", e3.requestedExpiry.toString()), e3.authorizationDetails && r2.append("authorization_details", JSON.stringify(e3.authorizationDetails));
    try {
      const e4 = await mr(t2, r2);
      return { authReqId: e4.auth_req_id, expiresIn: e4.expires_in, interval: e4.interval };
    } catch (e4) {
      throw new Si(e4);
    }
  }
  async backchannelAuthenticationGrant(e3) {
    let { authReqId: t2 } = e3;
    const { configuration: n2 } = await ot(fi, this, Mi).call(this), o2 = new URLSearchParams({ auth_req_id: t2 });
    try {
      const e4 = await Pr(n2, "urn:openid:params:grant-type:ciba", o2);
      return Li.fromTokenEndpointResponse(e4);
    } catch (e4) {
      throw new Si(e4);
    }
  }
  async getTokenForConnection(e3) {
    var t2;
    if (e3.refreshToken && e3.accessToken) throw new bi("Either a refresh or access token should be specified, but not both.");
    const n2 = null !== (t2 = e3.accessToken) && void 0 !== t2 ? t2 : e3.refreshToken;
    if (!n2) throw new bi("Either a refresh or access token must be specified.");
    try {
      return await this.exchangeToken({ connection: e3.connection, subjectToken: n2, subjectTokenType: e3.accessToken ? "urn:ietf:params:oauth:token-type:access_token" : "urn:ietf:params:oauth:token-type:refresh_token", loginHint: e3.loginHint });
    } catch (e4) {
      if (e4 instanceof _i) throw new bi(e4.message, e4.cause);
      throw e4;
    }
  }
  async exchangeToken(e3) {
    return "connection" in e3 ? ot(fi, this, Ji).call(this, e3) : ot(fi, this, Vi).call(this, e3);
  }
  async getTokenByCode(e3, t2) {
    const { configuration: n2 } = await ot(fi, this, Mi).call(this);
    try {
      const o2 = await gr(n2, e3, { pkceCodeVerifier: t2.codeVerifier });
      return Li.fromTokenEndpointResponse(o2);
    } catch (e4) {
      throw new wi("There was an error while trying to request a token.", e4);
    }
  }
  async getTokenByRefreshToken(e3) {
    const { configuration: t2 } = await ot(fi, this, Mi).call(this);
    try {
      const n2 = await vr(t2, e3.refreshToken);
      return Li.fromTokenEndpointResponse(n2);
    } catch (e4) {
      throw new vi("The access token has expired and there was an error while trying to refresh it.", e4);
    }
  }
  async getTokenByClientCredentials(e3) {
    const { configuration: t2 } = await ot(fi, this, Mi).call(this);
    try {
      const n2 = new URLSearchParams({ audience: e3.audience });
      e3.organization && n2.append("organization", e3.organization);
      const o2 = await br(t2, n2);
      return Li.fromTokenEndpointResponse(o2);
    } catch (e4) {
      throw new gi("There was an error while trying to request a token.", e4);
    }
  }
  async buildLogoutUrl(e3) {
    const { configuration: t2, serverMetadata: n2 } = await ot(fi, this, Mi).call(this);
    if (!n2.end_session_endpoint) {
      const t3 = new URL("https://".concat(at(hi, this).domain, "/v2/logout"));
      return t3.searchParams.set("returnTo", e3.returnTo), t3.searchParams.set("client_id", at(hi, this).clientId), t3;
    }
    return (function(e4, t3) {
      Sr(e4);
      const { as: n3, c: o2, tlsOnly: r2 } = Xo(e4), i2 = nn(n3, "end_session_endpoint", false, r2);
      (t3 = new URLSearchParams(t3)).has("client_id") || t3.set("client_id", o2.client_id);
      for (const [e5, n4] of t3.entries()) i2.searchParams.append(e5, n4);
      return i2;
    })(t2, { post_logout_redirect_uri: e3.returnTo });
  }
  async verifyLogoutToken(e3) {
    const { serverMetadata: t2 } = await ot(fi, this, Mi).call(this);
    at(pi, this) || ct(pi, this, (function(e4, t3) {
      const n3 = new ri(e4, t3), o2 = async (e5, t4) => n3.getKey(e5, t4);
      return Object.defineProperties(o2, { coolingDown: { get: () => n3.coolingDown(), enumerable: true, configurable: false }, fresh: { get: () => n3.fresh(), enumerable: true, configurable: false }, reload: { value: () => n3.reload(), enumerable: true, configurable: false, writable: false }, reloading: { get: () => n3.pendingFetch(), enumerable: true, configurable: false }, jwks: { value: () => n3.jwks(), enumerable: true, configurable: false, writable: false } }), o2;
    })(new URL(t2.jwks_uri), { [Gr]: at(hi, this).customFetch }));
    const { payload: n2 } = await Lr(e3.logoutToken, at(pi, this), { issuer: t2.issuer, audience: at(hi, this).clientId, algorithms: ["RS256"], requiredClaims: ["iat"] });
    if (!("sid" in n2) && !("sub" in n2)) throw new ki('either "sid" or "sub" (or both) claims must be present');
    if ("sid" in n2 && "string" != typeof n2.sid) throw new ki('"sid" claim must be a string');
    if ("sub" in n2 && "string" != typeof n2.sub) throw new ki('"sub" claim must be a string');
    if ("nonce" in n2) throw new ki('"nonce" claim is prohibited');
    if (!("events" in n2)) throw new ki('"events" claim is missing');
    if ("object" != typeof n2.events || null === n2.events) throw new ki('"events" claim must be an object');
    if (!("http://schemas.openid.net/event/backchannel-logout" in n2.events)) throw new ki('"http://schemas.openid.net/event/backchannel-logout" member is missing in the "events" claim');
    if ("object" != typeof n2.events["http://schemas.openid.net/event/backchannel-logout"]) throw new ki('"http://schemas.openid.net/event/backchannel-logout" member in the "events" claim must be an object');
    return { sid: n2.sid, sub: n2.sub };
  }
});
async function Mi() {
  if (at(li, this) && at(di, this)) return { configuration: at(li, this), serverMetadata: at(di, this) };
  const e3 = await ot(fi, this, Fi).call(this);
  return ct(li, this, await ur(new URL("https://".concat(at(hi, this).domain)), at(hi, this).clientId, { use_mtls_endpoint_aliases: at(hi, this).useMtls }, e3, { [er]: at(hi, this).customFetch })), ct(di, this, at(li, this).serverMetadata()), at(li, this)[er] = at(hi, this).customFetch || fetch, { configuration: at(li, this), serverMetadata: at(di, this) };
}
async function Ji(e3) {
  var t2, n2;
  const { configuration: o2 } = await ot(fi, this, Mi).call(this);
  if ("audience" in e3 || "resource" in e3) throw new _i("audience and resource parameters are not supported for Token Vault exchanges");
  Wi(e3.subjectToken);
  const r2 = new URLSearchParams({ connection: e3.connection, subject_token: e3.subjectToken, subject_token_type: null !== (t2 = e3.subjectTokenType) && void 0 !== t2 ? t2 : "urn:ietf:params:oauth:token-type:access_token", requested_token_type: null !== (n2 = e3.requestedTokenType) && void 0 !== n2 ? n2 : "http://auth0.com/oauth/token-type/federated-connection-access-token" });
  e3.loginHint && r2.append("login_hint", e3.loginHint), e3.scope && r2.append("scope", e3.scope), zi(r2, e3.extra);
  try {
    const e4 = await Pr(o2, "urn:auth0:params:oauth:grant-type:token-exchange:federated-connection-access-token", r2);
    return Li.fromTokenEndpointResponse(e4);
  } catch (t3) {
    throw new _i("Failed to exchange token for connection '".concat(e3.connection, "'."), t3);
  }
}
async function Vi(e3) {
  const { configuration: t2 } = await ot(fi, this, Mi).call(this);
  Wi(e3.subjectToken);
  const n2 = new URLSearchParams({ subject_token_type: e3.subjectTokenType, subject_token: e3.subjectToken });
  e3.audience && n2.append("audience", e3.audience), e3.scope && n2.append("scope", e3.scope), e3.requestedTokenType && n2.append("requested_token_type", e3.requestedTokenType), e3.organization && n2.append("organization", e3.organization), zi(n2, e3.extra);
  try {
    const e4 = await Pr(t2, "urn:ietf:params:oauth:grant-type:token-exchange", n2);
    return Li.fromTokenEndpointResponse(e4);
  } catch (t3) {
    throw new _i("Failed to exchange token of type '".concat(e3.subjectTokenType, "'").concat(e3.audience ? " for audience '".concat(e3.audience, "'") : "", "."), t3);
  }
}
async function Fi() {
  if (!at(hi, this).clientSecret && !at(hi, this).clientAssertionSigningKey && !at(hi, this).useMtls) throw new Pi();
  if (at(hi, this).useMtls) return (e4, t2, n2, o2) => {
    n2.set("client_id", t2.client_id);
  };
  let e3 = at(hi, this).clientAssertionSigningKey;
  return !e3 || e3 instanceof CryptoKey || (e3 = await (async function(e4, t2, n2) {
    if ("string" != typeof e4 || 0 !== e4.indexOf("-----BEGIN PRIVATE KEY-----")) throw new TypeError('"pkcs8" must be PKCS#8 formatted string');
    return Uo(e4, t2, n2);
  })(e3, at(hi, this).clientAssertionSigningAlg || "RS256")), e3 ? (function(e4, t2) {
    return Qt(e4, t2);
  })(e3) : $o(at(hi, this).clientSecret);
}
async function Gi(e3) {
  const { configuration: t2 } = await ot(fi, this, Mi).call(this), n2 = ir(), o2 = await rr(n2), r2 = Ri(dt(dt({}, at(hi, this).authorizationParams), null == e3 ? void 0 : e3.authorizationParams)), i2 = new URLSearchParams(dt(dt({ scope: Ui }, r2), {}, { client_id: at(hi, this).clientId, code_challenge: o2, code_challenge_method: "S256" }));
  return { authorizationUrl: null != e3 && e3.pushedAuthorizationRequests ? await kr(t2, i2) : await _r(t2, i2), codeVerifier: n2 };
}
var Zi = class _Zi extends w {
  constructor(e3, t2) {
    super(e3, t2), Object.setPrototypeOf(this, _Zi.prototype);
  }
  static fromPayload(e3) {
    let { error: t2, error_description: n2 } = e3;
    return new _Zi(t2, n2);
  }
};
var qi = class _qi extends Zi {
  constructor(e3, t2) {
    super(e3, t2), Object.setPrototypeOf(this, _qi.prototype);
  }
};
var Bi = class _Bi extends Zi {
  constructor(e3, t2) {
    super(e3, t2), Object.setPrototypeOf(this, _Bi.prototype);
  }
};
var Xi = class _Xi extends Zi {
  constructor(e3, t2) {
    super(e3, t2), Object.setPrototypeOf(this, _Xi.prototype);
  }
};
var Yi = class _Yi extends Zi {
  constructor(e3, t2) {
    super(e3, t2), Object.setPrototypeOf(this, _Yi.prototype);
  }
};
var Qi = class _Qi extends Zi {
  constructor(e3, t2) {
    super(e3, t2), Object.setPrototypeOf(this, _Qi.prototype);
  }
};
var $i = class {
  constructor() {
    let e3 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 6e5;
    this.contexts = /* @__PURE__ */ new Map(), this.ttlMs = e3;
  }
  set(e3, t2) {
    this.cleanup(), this.contexts.set(e3, Object.assign(Object.assign({}, t2), { createdAt: Date.now() }));
  }
  get(e3) {
    const t2 = this.contexts.get(e3);
    if (t2) {
      if (!(Date.now() - t2.createdAt > this.ttlMs)) return t2;
      this.contexts.delete(e3);
    }
  }
  remove(e3) {
    this.contexts.delete(e3);
  }
  cleanup() {
    const e3 = Date.now();
    for (const [t2, n2] of this.contexts) e3 - n2.createdAt > this.ttlMs && this.contexts.delete(t2);
  }
  get size() {
    return this.contexts.size;
  }
};
var ea = class {
  constructor(e3, t2) {
    this.authJsMfaClient = e3, this.auth0Client = t2, this.contextManager = new $i();
  }
  setMFAAuthDetails(e3, t2, n2, o2) {
    this.contextManager.set(e3, { scope: t2, audience: n2, mfaRequirements: o2 });
  }
  async getAuthenticators(e3) {
    var t2, n2;
    const o2 = this.contextManager.get(e3);
    if (!(null === (t2 = null == o2 ? void 0 : o2.mfaRequirements) || void 0 === t2 ? void 0 : t2.challenge) || 0 === o2.mfaRequirements.challenge.length) throw new qi("invalid_request", "challengeType is required and must contain at least one challenge type, please check mfa_required error payload");
    const r2 = o2.mfaRequirements.challenge.map(((e4) => e4.type));
    try {
      return (await this.authJsMfaClient.listAuthenticators({ mfaToken: e3 })).filter(((e4) => !!e4.type && r2.includes(e4.type)));
    } catch (e4) {
      if (e4 instanceof Oi) throw new qi(null === (n2 = e4.cause) || void 0 === n2 ? void 0 : n2.error, e4.message);
      throw e4;
    }
  }
  async enroll(e3) {
    var t2;
    const n2 = (function(e4) {
      const t3 = Qe[e4.factorType];
      return Object.assign(Object.assign(Object.assign({ mfaToken: e4.mfaToken, authenticatorTypes: t3.authenticatorTypes }, t3.oobChannels && { oobChannels: t3.oobChannels }), "phoneNumber" in e4 && { phoneNumber: e4.phoneNumber }), "email" in e4 && { email: e4.email });
    })(e3);
    try {
      return await this.authJsMfaClient.enrollAuthenticator(n2);
    } catch (e4) {
      if (e4 instanceof xi) throw new Bi(null === (t2 = e4.cause) || void 0 === t2 ? void 0 : t2.error, e4.message);
      throw e4;
    }
  }
  async challenge(e3) {
    var t2;
    try {
      const t3 = { challengeType: e3.challengeType, mfaToken: e3.mfaToken };
      return e3.authenticatorId && (t3.authenticatorId = e3.authenticatorId), await this.authJsMfaClient.challengeAuthenticator(t3);
    } catch (e4) {
      if (e4 instanceof ji) throw new Xi(null === (t2 = e4.cause) || void 0 === t2 ? void 0 : t2.error, e4.message);
      throw e4;
    }
  }
  async getEnrollmentFactors(e3) {
    const t2 = this.contextManager.get(e3);
    if (!t2 || !t2.mfaRequirements) throw new Qi("mfa_context_not_found", "MFA context not found for this MFA token. Please retry the original request to get a new MFA token.");
    return t2.mfaRequirements.enroll && 0 !== t2.mfaRequirements.enroll.length ? t2.mfaRequirements.enroll : [];
  }
  async verify(e3) {
    const t2 = this.contextManager.get(e3.mfaToken);
    if (!t2) throw new Yi("mfa_context_not_found", "MFA context not found for this MFA token. Please retry the original request to get a new MFA token.");
    const n2 = (function(e4) {
      return "otp" in e4 && e4.otp ? $e : "oobCode" in e4 && e4.oobCode ? et : "recoveryCode" in e4 && e4.recoveryCode ? tt : void 0;
    })(e3);
    if (!n2) throw new Yi("invalid_request", "Unable to determine grant type. Provide one of: otp, oobCode, or recoveryCode.");
    const o2 = t2.scope, r2 = t2.audience;
    try {
      const t3 = await this.auth0Client._requestTokenForMfa({ grant_type: n2, mfaToken: e3.mfaToken, scope: o2, audience: r2, otp: e3.otp, oob_code: e3.oobCode, binding_code: e3.bindingCode, recovery_code: e3.recoveryCode });
      return this.contextManager.remove(e3.mfaToken), t3;
    } catch (e4) {
      if (e4 instanceof E) this.setMFAAuthDetails(e4.mfa_token, o2, r2, e4.mfa_requirements);
      else if (e4 instanceof Yi) throw new Yi(e4.error, e4.error_description);
      throw e4;
    }
  }
};
var ta = new p();
var na = class {
  constructor(e3) {
    let t2, n2;
    if (this.userCache = new pe().enclosedCache, this.activeLockKeys = /* @__PURE__ */ new Set(), this.defaultOptions = { authorizationParams: { scope: "openid profile email" }, useRefreshTokensFallback: false, useFormData: true }, this._releaseLockOnPageHide = async () => {
      const e4 = Array.from(this.activeLockKeys);
      for (const t3 of e4) await ta.releaseLock(t3);
      this.activeLockKeys.clear(), window.removeEventListener("pagehide", this._releaseLockOnPageHide);
    }, this.options = Object.assign(Object.assign(Object.assign({}, this.defaultOptions), e3), { authorizationParams: Object.assign(Object.assign({}, this.defaultOptions.authorizationParams), e3.authorizationParams) }), "undefined" != typeof window && (() => {
      if (!I()) throw new Error("For security reasons, `window.crypto` is required to run `auth0-spa-js`.");
      if (void 0 === I().subtle) throw new Error("\n      auth0-spa-js must run on a secure origin. See https://github.com/auth0/auth0-spa-js/blob/main/FAQ.md#why-do-i-get-auth0-spa-js-must-run-on-a-secure-origin for more information.\n    ");
    })(), e3.cache && e3.cacheLocation && console.warn("Both `cache` and `cacheLocation` options have been specified in the Auth0Client configuration; ignoring `cacheLocation` and using `cache`."), e3.cache) n2 = e3.cache;
    else {
      if (t2 = e3.cacheLocation || "memory", !Me(t2)) throw new Error('Invalid cache location "'.concat(t2, '"'));
      n2 = Me(t2)();
    }
    var o2;
    this.httpTimeoutMs = e3.httpTimeoutInSeconds ? 1e3 * e3.httpTimeoutInSeconds : 1e4, this.cookieStorage = false === e3.legacySameSiteCookie ? Pe : Re, this.orgHintCookieName = (o2 = this.options.clientId, "auth0.".concat(o2, ".organization_hint")), this.isAuthenticatedCookieName = ((e4) => "auth0.".concat(e4, ".is.authenticated"))(this.options.clientId), this.sessionCheckExpiryDays = e3.sessionCheckExpiryDays || 1;
    const r2 = e3.useCookiesForTransactions ? this.cookieStorage : Ie;
    var i2;
    this.scope = (function(e4, t3) {
      for (var n3 = arguments.length, o3 = new Array(n3 > 2 ? n3 - 2 : 0), r3 = 2; r3 < n3; r3++) o3[r3 - 2] = arguments[r3];
      if ("object" != typeof e4) return { default: ue(t3, e4, ...o3) };
      let i3 = { default: ue(t3, ...o3) };
      return Object.keys(e4).forEach(((n4) => {
        const r4 = e4[n4];
        i3[n4] = ue(t3, r4, ...o3);
      })), i3;
    })(this.options.authorizationParams.scope, "openid", this.options.useRefreshTokens ? "offline_access" : ""), this.transactionManager = new me(r2, this.options.clientId, this.options.cookieDomain), this.nowProvider = this.options.nowProvider || y, this.cacheManager = new fe(n2, n2.allKeys ? void 0 : new ze(n2, this.options.clientId), this.nowProvider), this.dpop = this.options.useDpop ? new Ze(this.options.clientId) : void 0, this.domainUrl = (i2 = this.options.domain, /^https?:\/\//.test(i2) ? i2 : "https://".concat(i2)), this.tokenIssuer = ((e4, t3) => e4 ? e4.startsWith("https://") ? e4 : "https://".concat(e4, "/") : "".concat(t3, "/"))(this.options.issuer, this.domainUrl);
    const a2 = "".concat(this.domainUrl, "/me/"), s2 = this.createFetcher(Object.assign(Object.assign({}, this.options.useDpop && { dpopNonceId: "__auth0_my_account_api__" }), { getAccessToken: () => this.getTokenSilently({ authorizationParams: { scope: "create:me:connected_accounts", audience: a2 }, detailedResponse: true }) }));
    this.myAccountApi = new Xe(s2, a2), this.authJsClient = new Hi({ domain: this.options.domain, clientId: this.options.clientId }), this.mfa = new ea(this.authJsClient.mfa, this), "undefined" != typeof window && window.Worker && this.options.useRefreshTokens && "memory" === t2 && (this.options.workerUrl ? this.worker = new Worker(this.options.workerUrl) : this.worker = new Ue());
  }
  getConfiguration() {
    return Object.freeze({ domain: this.options.domain, clientId: this.options.clientId });
  }
  _url(e3) {
    const t2 = this.options.auth0Client || m, n2 = j(t2, true), o2 = encodeURIComponent(btoa(JSON.stringify(n2)));
    return "".concat(this.domainUrl).concat(e3, "&auth0Client=").concat(o2);
  }
  _authorizeUrl(e3) {
    return this._url("/authorize?".concat(D(e3)));
  }
  async _verifyIdToken(e3, t2, n2) {
    const o2 = await this.nowProvider();
    return ge({ iss: this.tokenIssuer, aud: this.options.clientId, id_token: e3, nonce: t2, organization: n2, leeway: this.options.leeway, max_age: (r2 = this.options.authorizationParams.max_age, "string" != typeof r2 ? r2 : parseInt(r2, 10) || void 0), now: o2 });
    var r2;
  }
  _processOrgHint(e3) {
    e3 ? this.cookieStorage.save(this.orgHintCookieName, e3, { daysUntilExpire: this.sessionCheckExpiryDays, cookieDomain: this.options.cookieDomain }) : this.cookieStorage.remove(this.orgHintCookieName, { cookieDomain: this.options.cookieDomain });
  }
  async _prepareAuthorizeUrl(e3, t2, n2) {
    var o2;
    const r2 = x(O()), i2 = x(O()), a2 = O(), s2 = await K(a2), c2 = U(s2), u2 = await (null === (o2 = this.dpop) || void 0 === o2 ? void 0 : o2.calculateThumbprint()), l2 = ((e4, t3, n3, o3, r3, i3, a3, s3, c3) => Object.assign(Object.assign(Object.assign({ client_id: e4.clientId }, e4.authorizationParams), n3), { scope: le(t3, n3.scope, n3.audience), response_type: "code", response_mode: s3 || "query", state: o3, nonce: r3, redirect_uri: a3 || e4.authorizationParams.redirect_uri, code_challenge: i3, code_challenge_method: "S256", dpop_jkt: c3 }))(this.options, this.scope, e3, r2, i2, c2, e3.redirect_uri || this.options.authorizationParams.redirect_uri || n2, null == t2 ? void 0 : t2.response_mode, u2), d2 = this._authorizeUrl(l2);
    return { nonce: i2, code_verifier: a2, scope: l2.scope, audience: l2.audience || "default", redirect_uri: l2.redirect_uri, state: r2, url: d2 };
  }
  async loginWithPopup(e3, t2) {
    var n2;
    if (e3 = e3 || {}, !(t2 = t2 || {}).popup && (t2.popup = ((e4) => {
      const t3 = window.screenX + (window.innerWidth - 400) / 2, n3 = window.screenY + (window.innerHeight - 600) / 2;
      return window.open(e4, "auth0:authorize:popup", "left=".concat(t3, ",top=").concat(n3, ",width=").concat(400, ",height=").concat(600, ",resizable,scrollbars=yes,status=1"));
    })(""), !t2.popup)) throw new S();
    const o2 = await this._prepareAuthorizeUrl(e3.authorizationParams || {}, { response_mode: "web_message" }, window.location.origin);
    t2.popup.location.href = o2.url;
    const r2 = await ((e4) => new Promise(((t3, n3) => {
      let o3;
      const r3 = setInterval((() => {
        e4.popup && e4.popup.closed && (clearInterval(r3), clearTimeout(i3), window.removeEventListener("message", o3, false), n3(new k(e4.popup)));
      }), 1e3), i3 = setTimeout((() => {
        clearInterval(r3), n3(new _(e4.popup)), window.removeEventListener("message", o3, false);
      }), 1e3 * (e4.timeoutInSeconds || 60));
      o3 = function(a2) {
        if (a2.data && "authorization_response" === a2.data.type) {
          if (clearTimeout(i3), clearInterval(r3), window.removeEventListener("message", o3, false), false !== e4.closePopup && e4.popup.close(), a2.data.response.error) return n3(w.fromPayload(a2.data.response));
          t3(a2.data.response);
        }
      }, window.addEventListener("message", o3);
    })))(Object.assign(Object.assign({}, t2), { timeoutInSeconds: t2.timeoutInSeconds || this.options.authorizeTimeoutInSeconds || 60 }));
    if (o2.state !== r2.state) throw new w("state_mismatch", "Invalid state");
    const i2 = (null === (n2 = e3.authorizationParams) || void 0 === n2 ? void 0 : n2.organization) || this.options.authorizationParams.organization;
    await this._requestToken({ audience: o2.audience, scope: o2.scope, code_verifier: o2.code_verifier, grant_type: "authorization_code", code: r2.code, redirect_uri: o2.redirect_uri }, { nonceIn: o2.nonce, organization: i2 });
  }
  async getUser() {
    var e3;
    const t2 = await this._getIdTokenFromCache();
    return null === (e3 = null == t2 ? void 0 : t2.decodedToken) || void 0 === e3 ? void 0 : e3.user;
  }
  async getIdTokenClaims() {
    var e3;
    const t2 = await this._getIdTokenFromCache();
    return null === (e3 = null == t2 ? void 0 : t2.decodedToken) || void 0 === e3 ? void 0 : e3.claims;
  }
  async loginWithRedirect() {
    var t2;
    const n2 = Je(arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}), { openUrl: o2, fragment: r2, appState: i2 } = n2, a2 = e(n2, ["openUrl", "fragment", "appState"]), s2 = (null === (t2 = a2.authorizationParams) || void 0 === t2 ? void 0 : t2.organization) || this.options.authorizationParams.organization, c2 = await this._prepareAuthorizeUrl(a2.authorizationParams || {}), { url: u2 } = c2, l2 = e(c2, ["url"]);
    this.transactionManager.create(Object.assign(Object.assign(Object.assign({}, l2), { appState: i2, response_type: Oe.Code }), s2 && { organization: s2 }));
    const d2 = r2 ? "".concat(u2, "#").concat(r2) : u2;
    o2 ? await o2(d2) : window.location.assign(d2);
  }
  async handleRedirectCallback() {
    const e3 = (arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : window.location.href).split("?").slice(1);
    if (0 === e3.length) throw new Error("There are no query params available for parsing.");
    const t2 = this.transactionManager.get();
    if (!t2) throw new w("missing_transaction", "Invalid state");
    this.transactionManager.remove();
    const n2 = ((e4) => {
      e4.indexOf("#") > -1 && (e4 = e4.substring(0, e4.indexOf("#")));
      const t3 = new URLSearchParams(e4);
      return { state: t3.get("state"), code: t3.get("code") || void 0, connect_code: t3.get("connect_code") || void 0, error: t3.get("error") || void 0, error_description: t3.get("error_description") || void 0 };
    })(e3.join(""));
    return t2.response_type === Oe.ConnectCode ? this._handleConnectAccountRedirectCallback(n2, t2) : this._handleLoginRedirectCallback(n2, t2);
  }
  async _handleLoginRedirectCallback(e3, t2) {
    const { code: n2, state: o2, error: r2, error_description: i2 } = e3;
    if (r2) throw new g(r2, i2 || r2, o2, t2.appState);
    if (!t2.code_verifier || t2.state && t2.state !== o2) throw new w("state_mismatch", "Invalid state");
    const a2 = t2.organization, s2 = t2.nonce, c2 = t2.redirect_uri;
    return await this._requestToken(Object.assign({ audience: t2.audience, scope: t2.scope, code_verifier: t2.code_verifier, grant_type: "authorization_code", code: n2 }, c2 ? { redirect_uri: c2 } : {}), { nonceIn: s2, organization: a2 }), { appState: t2.appState, response_type: Oe.Code };
  }
  async _handleConnectAccountRedirectCallback(e3, t2) {
    const { connect_code: n2, state: o2, error: r2, error_description: i2 } = e3;
    if (r2) throw new v(r2, i2 || r2, t2.connection, o2, t2.appState);
    if (!n2) throw new w("missing_connect_code", "Missing connect code");
    if (!(t2.code_verifier && t2.state && t2.auth_session && t2.redirect_uri && t2.state === o2)) throw new w("state_mismatch", "Invalid state");
    const a2 = await this.myAccountApi.completeAccount({ auth_session: t2.auth_session, connect_code: n2, redirect_uri: t2.redirect_uri, code_verifier: t2.code_verifier });
    return Object.assign(Object.assign({}, a2), { appState: t2.appState, response_type: Oe.ConnectCode });
  }
  async checkSession(e3) {
    if (!this.cookieStorage.get(this.isAuthenticatedCookieName)) {
      if (!this.cookieStorage.get("auth0.is.authenticated")) return;
      this.cookieStorage.save(this.isAuthenticatedCookieName, true, { daysUntilExpire: this.sessionCheckExpiryDays, cookieDomain: this.options.cookieDomain }), this.cookieStorage.remove("auth0.is.authenticated");
    }
    try {
      await this.getTokenSilently(e3);
    } catch (e4) {
    }
  }
  async getTokenSilently() {
    let e3 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
    var t2, n2;
    const o2 = Object.assign(Object.assign({ cacheMode: "on" }, e3), { authorizationParams: Object.assign(Object.assign(Object.assign({}, this.options.authorizationParams), e3.authorizationParams), { scope: le(this.scope, null === (t2 = e3.authorizationParams) || void 0 === t2 ? void 0 : t2.scope, (null === (n2 = e3.authorizationParams) || void 0 === n2 ? void 0 : n2.audience) || this.options.authorizationParams.audience) }) }), r2 = await ((e4, t3) => {
      let n3 = Ne[t3];
      return n3 || (n3 = e4().finally((() => {
        delete Ne[t3], n3 = null;
      })), Ne[t3] = n3), n3;
    })((() => this._getTokenSilently(o2)), "".concat(this.options.clientId, "::").concat(o2.authorizationParams.audience, "::").concat(o2.authorizationParams.scope));
    return e3.detailedResponse ? r2 : null == r2 ? void 0 : r2.access_token;
  }
  async _getTokenSilently(t2) {
    const { cacheMode: n2 } = t2, o2 = e(t2, ["cacheMode"]);
    if ("off" !== n2) {
      const e3 = await this._getEntryFromCache({ scope: o2.authorizationParams.scope, audience: o2.authorizationParams.audience || "default", clientId: this.options.clientId, cacheMode: n2 });
      if (e3) return e3;
    }
    if ("cache-only" === n2) return;
    const r2 = (i2 = this.options.clientId, a2 = o2.authorizationParams.audience || "default", "".concat("auth0.lock.getTokenSilently", ".").concat(i2, ".").concat(a2));
    var i2, a2;
    if (!await We((() => ta.acquireLock(r2, 5e3)), 10)) throw new b();
    this.activeLockKeys.add(r2), 1 === this.activeLockKeys.size && window.addEventListener("pagehide", this._releaseLockOnPageHide);
    try {
      if ("off" !== n2) {
        const e4 = await this._getEntryFromCache({ scope: o2.authorizationParams.scope, audience: o2.authorizationParams.audience || "default", clientId: this.options.clientId });
        if (e4) return e4;
      }
      const e3 = this.options.useRefreshTokens ? await this._getTokenUsingRefreshToken(o2) : await this._getTokenFromIFrame(o2), { id_token: t3, token_type: i3, access_token: a3, oauthTokenScope: s2, expires_in: c2 } = e3;
      return Object.assign(Object.assign({ id_token: t3, token_type: i3, access_token: a3 }, s2 ? { scope: s2 } : null), { expires_in: c2 });
    } finally {
      await ta.releaseLock(r2), this.activeLockKeys.delete(r2), 0 === this.activeLockKeys.size && window.removeEventListener("pagehide", this._releaseLockOnPageHide);
    }
  }
  async getTokenWithPopup() {
    let e3 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, t2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
    var n2, o2;
    const r2 = Object.assign(Object.assign({}, e3), { authorizationParams: Object.assign(Object.assign(Object.assign({}, this.options.authorizationParams), e3.authorizationParams), { scope: le(this.scope, null === (n2 = e3.authorizationParams) || void 0 === n2 ? void 0 : n2.scope, (null === (o2 = e3.authorizationParams) || void 0 === o2 ? void 0 : o2.audience) || this.options.authorizationParams.audience) }) });
    t2 = Object.assign(Object.assign({}, f), t2), await this.loginWithPopup(r2, t2);
    return (await this.cacheManager.get(new de({ scope: r2.authorizationParams.scope, audience: r2.authorizationParams.audience || "default", clientId: this.options.clientId }), void 0, this.options.useMrrt)).access_token;
  }
  async isAuthenticated() {
    return !!await this.getUser();
  }
  _buildLogoutUrl(t2) {
    null !== t2.clientId ? t2.clientId = t2.clientId || this.options.clientId : delete t2.clientId;
    const n2 = t2.logoutParams || {}, { federated: o2 } = n2, r2 = e(n2, ["federated"]), i2 = o2 ? "&federated" : "";
    return this._url("/v2/logout?".concat(D(Object.assign({ clientId: t2.clientId }, r2)))) + i2;
  }
  async logout() {
    let t2 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
    var n2;
    const o2 = Je(t2), { openUrl: r2 } = o2, i2 = e(o2, ["openUrl"]);
    null === t2.clientId ? await this.cacheManager.clear() : await this.cacheManager.clear(t2.clientId || this.options.clientId), this.cookieStorage.remove(this.orgHintCookieName, { cookieDomain: this.options.cookieDomain }), this.cookieStorage.remove(this.isAuthenticatedCookieName, { cookieDomain: this.options.cookieDomain }), this.userCache.remove("@@user@@"), await (null === (n2 = this.dpop) || void 0 === n2 ? void 0 : n2.clear());
    const a2 = this._buildLogoutUrl(i2);
    r2 ? await r2(a2) : false !== r2 && window.location.assign(a2);
  }
  async _getTokenFromIFrame(e3) {
    const t2 = (n2 = this.options.clientId, "".concat("auth0.lock.getTokenFromIFrame", ".").concat(n2));
    var n2;
    if (!await We((() => ta.acquireLock(t2, 5e3)), 10)) throw new b();
    try {
      const n3 = Object.assign(Object.assign({}, e3.authorizationParams), { prompt: "none" }), o2 = this.cookieStorage.get(this.orgHintCookieName);
      o2 && !n3.organization && (n3.organization = o2);
      const { url: r2, state: i2, nonce: a2, code_verifier: s2, redirect_uri: c2, scope: u2, audience: l2 } = await this._prepareAuthorizeUrl(n3, { response_mode: "web_message" }, window.location.origin);
      if (window.crossOriginIsolated) throw new w("login_required", "The application is running in a Cross-Origin Isolated context, silently retrieving a token without refresh token is not possible.");
      const d2 = e3.timeoutInSeconds || this.options.authorizeTimeoutInSeconds;
      let h2;
      try {
        h2 = new URL(this.domainUrl).origin;
      } catch (e4) {
        h2 = this.domainUrl;
      }
      const p2 = await (function(e4, t3) {
        let n4 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 60;
        return new Promise(((o3, r3) => {
          const i3 = window.document.createElement("iframe");
          i3.setAttribute("width", "0"), i3.setAttribute("height", "0"), i3.style.display = "none";
          const a3 = () => {
            window.document.body.contains(i3) && (window.document.body.removeChild(i3), window.removeEventListener("message", s3, false));
          };
          let s3;
          const c3 = setTimeout((() => {
            r3(new b()), a3();
          }), 1e3 * n4);
          s3 = function(e5) {
            if (e5.origin != t3) return;
            if (!e5.data || "authorization_response" !== e5.data.type) return;
            const n5 = e5.source;
            n5 && n5.close(), e5.data.response.error ? r3(w.fromPayload(e5.data.response)) : o3(e5.data.response), clearTimeout(c3), window.removeEventListener("message", s3, false), setTimeout(a3, 2e3);
          }, window.addEventListener("message", s3, false), window.document.body.appendChild(i3), i3.setAttribute("src", e4);
        }));
      })(r2, h2, d2);
      if (i2 !== p2.state) throw new w("state_mismatch", "Invalid state");
      const f2 = await this._requestToken(Object.assign(Object.assign({}, e3.authorizationParams), { code_verifier: s2, code: p2.code, grant_type: "authorization_code", redirect_uri: c2, timeout: e3.authorizationParams.timeout || this.httpTimeoutMs }), { nonceIn: a2, organization: n3.organization });
      return Object.assign(Object.assign({}, f2), { scope: u2, oauthTokenScope: f2.scope, audience: l2 });
    } catch (e4) {
      throw "login_required" === e4.error && this.logout({ openUrl: false }), e4;
    } finally {
      await ta.releaseLock(t2);
    }
  }
  async _getTokenUsingRefreshToken(e3) {
    var t2, n2;
    const o2 = await this.cacheManager.get(new de({ scope: e3.authorizationParams.scope, audience: e3.authorizationParams.audience || "default", clientId: this.options.clientId }), void 0, this.options.useMrrt);
    if (!(o2 && o2.refresh_token || this.worker)) {
      if (this.options.useRefreshTokensFallback) return await this._getTokenFromIFrame(e3);
      throw new A(e3.authorizationParams.audience || "default", e3.authorizationParams.scope);
    }
    const r2 = e3.authorizationParams.redirect_uri || this.options.authorizationParams.redirect_uri || window.location.origin, i2 = "number" == typeof e3.timeoutInSeconds ? 1e3 * e3.timeoutInSeconds : null, a2 = ((e4, t3, n3, o3) => {
      var r3;
      if (e4 && n3 && o3) {
        if (t3.audience !== n3) return t3.scope;
        const e5 = o3.split(" "), i3 = (null === (r3 = t3.scope) || void 0 === r3 ? void 0 : r3.split(" ")) || [], a3 = i3.every(((t4) => e5.includes(t4)));
        return e5.length >= i3.length && a3 ? o3 : t3.scope;
      }
      return t3.scope;
    })(this.options.useMrrt, e3.authorizationParams, null == o2 ? void 0 : o2.audience, null == o2 ? void 0 : o2.scope);
    try {
      const t3 = await this._requestToken(Object.assign(Object.assign(Object.assign({}, e3.authorizationParams), { grant_type: "refresh_token", refresh_token: o2 && o2.refresh_token, redirect_uri: r2 }), i2 && { timeout: i2 }), { scopesToRequest: a2 });
      if (t3.refresh_token && (null == o2 ? void 0 : o2.refresh_token) && await this.cacheManager.updateEntry(o2.refresh_token, t3.refresh_token), this.options.useMrrt) {
        if (s2 = null == o2 ? void 0 : o2.audience, c2 = null == o2 ? void 0 : o2.scope, u2 = e3.authorizationParams.audience, l2 = e3.authorizationParams.scope, s2 !== u2 || !Ve(l2, c2)) {
          if (!Ve(a2, t3.scope)) {
            if (this.options.useRefreshTokensFallback) return await this._getTokenFromIFrame(e3);
            await this.cacheManager.remove(this.options.clientId, e3.authorizationParams.audience, e3.authorizationParams.scope);
            const n3 = ((e4, t4) => {
              const n4 = (null == e4 ? void 0 : e4.split(" ")) || [], o3 = (null == t4 ? void 0 : t4.split(" ")) || [];
              return n4.filter(((e5) => -1 == o3.indexOf(e5))).join(",");
            })(a2, t3.scope);
            throw new T(e3.authorizationParams.audience || "default", n3);
          }
        }
      }
      return Object.assign(Object.assign({}, t3), { scope: e3.authorizationParams.scope, oauthTokenScope: t3.scope, audience: e3.authorizationParams.audience || "default" });
    } catch (o3) {
      if ((o3.message.indexOf("Missing Refresh Token") > -1 || o3.message && o3.message.indexOf("invalid refresh token") > -1) && this.options.useRefreshTokensFallback) return await this._getTokenFromIFrame(e3);
      throw o3 instanceof E && this.mfa.setMFAAuthDetails(o3.mfa_token, null === (t2 = e3.authorizationParams) || void 0 === t2 ? void 0 : t2.scope, null === (n2 = e3.authorizationParams) || void 0 === n2 ? void 0 : n2.audience, o3.mfa_requirements), o3;
    }
    var s2, c2, u2, l2;
  }
  async _saveEntryInCache(t2) {
    const { id_token: n2, decodedToken: o2 } = t2, r2 = e(t2, ["id_token", "decodedToken"]);
    this.userCache.set("@@user@@", { id_token: n2, decodedToken: o2 }), await this.cacheManager.setIdToken(this.options.clientId, t2.id_token, t2.decodedToken), await this.cacheManager.set(r2);
  }
  async _getIdTokenFromCache() {
    const e3 = this.options.authorizationParams.audience || "default", t2 = this.scope[e3], n2 = await this.cacheManager.getIdToken(new de({ clientId: this.options.clientId, audience: e3, scope: t2 })), o2 = this.userCache.get("@@user@@");
    return n2 && n2.id_token === (null == o2 ? void 0 : o2.id_token) ? o2 : (this.userCache.set("@@user@@", n2), n2);
  }
  async _getEntryFromCache(e3) {
    let { scope: t2, audience: n2, clientId: o2, cacheMode: r2 } = e3;
    const i2 = await this.cacheManager.get(new de({ scope: t2, audience: n2, clientId: o2 }), 60, this.options.useMrrt, r2);
    if (i2 && i2.access_token) {
      const { token_type: e4, access_token: t3, oauthTokenScope: n3, expires_in: o3 } = i2, r3 = await this._getIdTokenFromCache();
      return r3 && Object.assign(Object.assign({ id_token: r3.id_token, token_type: e4 || "Bearer", access_token: t3 }, n3 ? { scope: n3 } : null), { expires_in: o3 });
    }
  }
  async _requestToken(e3, t2) {
    var n2, o2;
    const { nonceIn: r2, organization: i2, scopesToRequest: a2 } = t2 || {}, s2 = await se(Object.assign(Object.assign({ baseUrl: this.domainUrl, client_id: this.options.clientId, auth0Client: this.options.auth0Client, useFormData: this.options.useFormData, timeout: this.httpTimeoutMs, useMrrt: this.options.useMrrt, dpop: this.dpop }, e3), { scope: a2 || e3.scope }), this.worker), c2 = await this._verifyIdToken(s2.id_token, r2, i2);
    if ("authorization_code" === e3.grant_type) {
      const e4 = await this._getIdTokenFromCache();
      (null === (o2 = null === (n2 = null == e4 ? void 0 : e4.decodedToken) || void 0 === n2 ? void 0 : n2.claims) || void 0 === o2 ? void 0 : o2.sub) && e4.decodedToken.claims.sub !== c2.claims.sub && (await this.cacheManager.clear(this.options.clientId), this.userCache.remove("@@user@@"));
    }
    return await this._saveEntryInCache(Object.assign(Object.assign(Object.assign(Object.assign({}, s2), { decodedToken: c2, scope: e3.scope, audience: e3.audience || "default" }), s2.scope ? { oauthTokenScope: s2.scope } : null), { client_id: this.options.clientId })), this.cookieStorage.save(this.isAuthenticatedCookieName, true, { daysUntilExpire: this.sessionCheckExpiryDays, cookieDomain: this.options.cookieDomain }), this._processOrgHint(i2 || c2.claims.org_id), Object.assign(Object.assign({}, s2), { decodedToken: c2 });
  }
  async exchangeToken(e3) {
    return this._requestToken({ grant_type: "urn:ietf:params:oauth:grant-type:token-exchange", subject_token: e3.subject_token, subject_token_type: e3.subject_token_type, scope: le(this.scope, e3.scope, e3.audience || this.options.authorizationParams.audience), audience: e3.audience || this.options.authorizationParams.audience, organization: e3.organization || this.options.authorizationParams.organization });
  }
  _assertDpop(e3) {
    if (!e3) throw new Error("`useDpop` option must be enabled before using DPoP.");
  }
  getDpopNonce(e3) {
    return this._assertDpop(this.dpop), this.dpop.getNonce(e3);
  }
  setDpopNonce(e3, t2) {
    return this._assertDpop(this.dpop), this.dpop.setNonce(e3, t2);
  }
  generateDpopProof(e3) {
    return this._assertDpop(this.dpop), this.dpop.generateProof(e3);
  }
  createFetcher() {
    let e3 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
    return new Be(e3, { isDpopEnabled: () => !!this.options.useDpop, getAccessToken: (e4) => {
      var t2;
      return this.getTokenSilently({ authorizationParams: { scope: null === (t2 = null == e4 ? void 0 : e4.scope) || void 0 === t2 ? void 0 : t2.join(" "), audience: null == e4 ? void 0 : e4.audience }, detailedResponse: true });
    }, getDpopNonce: () => this.getDpopNonce(e3.dpopNonceId), setDpopNonce: (t2) => this.setDpopNonce(t2, e3.dpopNonceId), generateDpopProof: (e4) => this.generateDpopProof(e4) });
  }
  async connectAccountWithRedirect(e3) {
    const { openUrl: t2, appState: n2, connection: o2, scopes: r2, authorization_params: i2, redirectUri: a2 = this.options.authorizationParams.redirect_uri || window.location.origin } = e3;
    if (!o2) throw new Error("connection is required");
    const s2 = x(O()), c2 = O(), u2 = await K(c2), l2 = U(u2), { connect_uri: d2, connect_params: h2, auth_session: p2 } = await this.myAccountApi.connectAccount({ connection: o2, scopes: r2, redirect_uri: a2, state: s2, code_challenge: l2, code_challenge_method: "S256", authorization_params: i2 });
    this.transactionManager.create({ state: s2, code_verifier: c2, auth_session: p2, redirect_uri: a2, appState: n2, connection: o2, response_type: Oe.ConnectCode });
    const f2 = new URL(d2);
    f2.searchParams.set("ticket", h2.ticket), t2 ? await t2(f2.toString()) : window.location.assign(f2);
  }
  async _requestTokenForMfa(t2, n2) {
    const { mfaToken: o2 } = t2, r2 = e(t2, ["mfaToken"]);
    return this._requestToken(Object.assign(Object.assign({}, r2), { mfa_token: o2 }), n2);
  }
};
async function oa(e3) {
  const t2 = new na(e3);
  return await t2.checkSession(), t2;
}

// node_modules/@eyepop.ai/eyepop/dist/eyepop.index.mjs
var __getOwnPropNames2 = Object.getOwnPropertyNames;
var __require2 = /* @__PURE__ */ ((x2) => typeof __require !== "undefined" ? __require : typeof Proxy !== "undefined" ? new Proxy(x2, {
  get: (a2, b2) => (typeof __require !== "undefined" ? __require : a2)[b2]
}) : x2)(function(x2) {
  if (typeof __require !== "undefined") return __require.apply(this, arguments);
  throw Error('Dynamic require of "' + x2 + '" is not supported');
});
var __commonJS2 = (cb, mod) => function __require22() {
  return mod || (0, cb[__getOwnPropNames2(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_db = __commonJS2({
  "../../node_modules/mime-db/db.json"(exports, module) {
    module.exports = {
      "application/1d-interleaved-parityfec": {
        source: "iana"
      },
      "application/3gpdash-qoe-report+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/3gpp-ims+xml": {
        source: "iana",
        compressible: true
      },
      "application/3gpphal+json": {
        source: "iana",
        compressible: true
      },
      "application/3gpphalforms+json": {
        source: "iana",
        compressible: true
      },
      "application/a2l": {
        source: "iana"
      },
      "application/ace+cbor": {
        source: "iana"
      },
      "application/activemessage": {
        source: "iana"
      },
      "application/activity+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-costmap+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-costmapfilter+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-directory+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-endpointcost+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-endpointcostparams+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-endpointprop+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-endpointpropparams+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-error+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-networkmap+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-networkmapfilter+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-updatestreamcontrol+json": {
        source: "iana",
        compressible: true
      },
      "application/alto-updatestreamparams+json": {
        source: "iana",
        compressible: true
      },
      "application/aml": {
        source: "iana"
      },
      "application/andrew-inset": {
        source: "iana",
        extensions: ["ez"]
      },
      "application/applefile": {
        source: "iana"
      },
      "application/applixware": {
        source: "apache",
        extensions: ["aw"]
      },
      "application/at+jwt": {
        source: "iana"
      },
      "application/atf": {
        source: "iana"
      },
      "application/atfx": {
        source: "iana"
      },
      "application/atom+xml": {
        source: "iana",
        compressible: true,
        extensions: ["atom"]
      },
      "application/atomcat+xml": {
        source: "iana",
        compressible: true,
        extensions: ["atomcat"]
      },
      "application/atomdeleted+xml": {
        source: "iana",
        compressible: true,
        extensions: ["atomdeleted"]
      },
      "application/atomicmail": {
        source: "iana"
      },
      "application/atomsvc+xml": {
        source: "iana",
        compressible: true,
        extensions: ["atomsvc"]
      },
      "application/atsc-dwd+xml": {
        source: "iana",
        compressible: true,
        extensions: ["dwd"]
      },
      "application/atsc-dynamic-event-message": {
        source: "iana"
      },
      "application/atsc-held+xml": {
        source: "iana",
        compressible: true,
        extensions: ["held"]
      },
      "application/atsc-rdt+json": {
        source: "iana",
        compressible: true
      },
      "application/atsc-rsat+xml": {
        source: "iana",
        compressible: true,
        extensions: ["rsat"]
      },
      "application/atxml": {
        source: "iana"
      },
      "application/auth-policy+xml": {
        source: "iana",
        compressible: true
      },
      "application/bacnet-xdd+zip": {
        source: "iana",
        compressible: false
      },
      "application/batch-smtp": {
        source: "iana"
      },
      "application/bdoc": {
        compressible: false,
        extensions: ["bdoc"]
      },
      "application/beep+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/calendar+json": {
        source: "iana",
        compressible: true
      },
      "application/calendar+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xcs"]
      },
      "application/call-completion": {
        source: "iana"
      },
      "application/cals-1840": {
        source: "iana"
      },
      "application/captive+json": {
        source: "iana",
        compressible: true
      },
      "application/cbor": {
        source: "iana"
      },
      "application/cbor-seq": {
        source: "iana"
      },
      "application/cccex": {
        source: "iana"
      },
      "application/ccmp+xml": {
        source: "iana",
        compressible: true
      },
      "application/ccxml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["ccxml"]
      },
      "application/cdfx+xml": {
        source: "iana",
        compressible: true,
        extensions: ["cdfx"]
      },
      "application/cdmi-capability": {
        source: "iana",
        extensions: ["cdmia"]
      },
      "application/cdmi-container": {
        source: "iana",
        extensions: ["cdmic"]
      },
      "application/cdmi-domain": {
        source: "iana",
        extensions: ["cdmid"]
      },
      "application/cdmi-object": {
        source: "iana",
        extensions: ["cdmio"]
      },
      "application/cdmi-queue": {
        source: "iana",
        extensions: ["cdmiq"]
      },
      "application/cdni": {
        source: "iana"
      },
      "application/cea": {
        source: "iana"
      },
      "application/cea-2018+xml": {
        source: "iana",
        compressible: true
      },
      "application/cellml+xml": {
        source: "iana",
        compressible: true
      },
      "application/cfw": {
        source: "iana"
      },
      "application/city+json": {
        source: "iana",
        compressible: true
      },
      "application/clr": {
        source: "iana"
      },
      "application/clue+xml": {
        source: "iana",
        compressible: true
      },
      "application/clue_info+xml": {
        source: "iana",
        compressible: true
      },
      "application/cms": {
        source: "iana"
      },
      "application/cnrp+xml": {
        source: "iana",
        compressible: true
      },
      "application/coap-group+json": {
        source: "iana",
        compressible: true
      },
      "application/coap-payload": {
        source: "iana"
      },
      "application/commonground": {
        source: "iana"
      },
      "application/conference-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/cose": {
        source: "iana"
      },
      "application/cose-key": {
        source: "iana"
      },
      "application/cose-key-set": {
        source: "iana"
      },
      "application/cpl+xml": {
        source: "iana",
        compressible: true,
        extensions: ["cpl"]
      },
      "application/csrattrs": {
        source: "iana"
      },
      "application/csta+xml": {
        source: "iana",
        compressible: true
      },
      "application/cstadata+xml": {
        source: "iana",
        compressible: true
      },
      "application/csvm+json": {
        source: "iana",
        compressible: true
      },
      "application/cu-seeme": {
        source: "apache",
        extensions: ["cu"]
      },
      "application/cwt": {
        source: "iana"
      },
      "application/cybercash": {
        source: "iana"
      },
      "application/dart": {
        compressible: true
      },
      "application/dash+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mpd"]
      },
      "application/dash-patch+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mpp"]
      },
      "application/dashdelta": {
        source: "iana"
      },
      "application/davmount+xml": {
        source: "iana",
        compressible: true,
        extensions: ["davmount"]
      },
      "application/dca-rft": {
        source: "iana"
      },
      "application/dcd": {
        source: "iana"
      },
      "application/dec-dx": {
        source: "iana"
      },
      "application/dialog-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/dicom": {
        source: "iana"
      },
      "application/dicom+json": {
        source: "iana",
        compressible: true
      },
      "application/dicom+xml": {
        source: "iana",
        compressible: true
      },
      "application/dii": {
        source: "iana"
      },
      "application/dit": {
        source: "iana"
      },
      "application/dns": {
        source: "iana"
      },
      "application/dns+json": {
        source: "iana",
        compressible: true
      },
      "application/dns-message": {
        source: "iana"
      },
      "application/docbook+xml": {
        source: "apache",
        compressible: true,
        extensions: ["dbk"]
      },
      "application/dots+cbor": {
        source: "iana"
      },
      "application/dskpp+xml": {
        source: "iana",
        compressible: true
      },
      "application/dssc+der": {
        source: "iana",
        extensions: ["dssc"]
      },
      "application/dssc+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xdssc"]
      },
      "application/dvcs": {
        source: "iana"
      },
      "application/ecmascript": {
        source: "iana",
        compressible: true,
        extensions: ["es", "ecma"]
      },
      "application/edi-consent": {
        source: "iana"
      },
      "application/edi-x12": {
        source: "iana",
        compressible: false
      },
      "application/edifact": {
        source: "iana",
        compressible: false
      },
      "application/efi": {
        source: "iana"
      },
      "application/elm+json": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/elm+xml": {
        source: "iana",
        compressible: true
      },
      "application/emergencycalldata.cap+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/emergencycalldata.comment+xml": {
        source: "iana",
        compressible: true
      },
      "application/emergencycalldata.control+xml": {
        source: "iana",
        compressible: true
      },
      "application/emergencycalldata.deviceinfo+xml": {
        source: "iana",
        compressible: true
      },
      "application/emergencycalldata.ecall.msd": {
        source: "iana"
      },
      "application/emergencycalldata.providerinfo+xml": {
        source: "iana",
        compressible: true
      },
      "application/emergencycalldata.serviceinfo+xml": {
        source: "iana",
        compressible: true
      },
      "application/emergencycalldata.subscriberinfo+xml": {
        source: "iana",
        compressible: true
      },
      "application/emergencycalldata.veds+xml": {
        source: "iana",
        compressible: true
      },
      "application/emma+xml": {
        source: "iana",
        compressible: true,
        extensions: ["emma"]
      },
      "application/emotionml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["emotionml"]
      },
      "application/encaprtp": {
        source: "iana"
      },
      "application/epp+xml": {
        source: "iana",
        compressible: true
      },
      "application/epub+zip": {
        source: "iana",
        compressible: false,
        extensions: ["epub"]
      },
      "application/eshop": {
        source: "iana"
      },
      "application/exi": {
        source: "iana",
        extensions: ["exi"]
      },
      "application/expect-ct-report+json": {
        source: "iana",
        compressible: true
      },
      "application/express": {
        source: "iana",
        extensions: ["exp"]
      },
      "application/fastinfoset": {
        source: "iana"
      },
      "application/fastsoap": {
        source: "iana"
      },
      "application/fdt+xml": {
        source: "iana",
        compressible: true,
        extensions: ["fdt"]
      },
      "application/fhir+json": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/fhir+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/fido.trusted-apps+json": {
        compressible: true
      },
      "application/fits": {
        source: "iana"
      },
      "application/flexfec": {
        source: "iana"
      },
      "application/font-sfnt": {
        source: "iana"
      },
      "application/font-tdpfr": {
        source: "iana",
        extensions: ["pfr"]
      },
      "application/font-woff": {
        source: "iana",
        compressible: false
      },
      "application/framework-attributes+xml": {
        source: "iana",
        compressible: true
      },
      "application/geo+json": {
        source: "iana",
        compressible: true,
        extensions: ["geojson"]
      },
      "application/geo+json-seq": {
        source: "iana"
      },
      "application/geopackage+sqlite3": {
        source: "iana"
      },
      "application/geoxacml+xml": {
        source: "iana",
        compressible: true
      },
      "application/gltf-buffer": {
        source: "iana"
      },
      "application/gml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["gml"]
      },
      "application/gpx+xml": {
        source: "apache",
        compressible: true,
        extensions: ["gpx"]
      },
      "application/gxf": {
        source: "apache",
        extensions: ["gxf"]
      },
      "application/gzip": {
        source: "iana",
        compressible: false,
        extensions: ["gz"]
      },
      "application/h224": {
        source: "iana"
      },
      "application/held+xml": {
        source: "iana",
        compressible: true
      },
      "application/hjson": {
        extensions: ["hjson"]
      },
      "application/http": {
        source: "iana"
      },
      "application/hyperstudio": {
        source: "iana",
        extensions: ["stk"]
      },
      "application/ibe-key-request+xml": {
        source: "iana",
        compressible: true
      },
      "application/ibe-pkg-reply+xml": {
        source: "iana",
        compressible: true
      },
      "application/ibe-pp-data": {
        source: "iana"
      },
      "application/iges": {
        source: "iana"
      },
      "application/im-iscomposing+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/index": {
        source: "iana"
      },
      "application/index.cmd": {
        source: "iana"
      },
      "application/index.obj": {
        source: "iana"
      },
      "application/index.response": {
        source: "iana"
      },
      "application/index.vnd": {
        source: "iana"
      },
      "application/inkml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["ink", "inkml"]
      },
      "application/iotp": {
        source: "iana"
      },
      "application/ipfix": {
        source: "iana",
        extensions: ["ipfix"]
      },
      "application/ipp": {
        source: "iana"
      },
      "application/isup": {
        source: "iana"
      },
      "application/its+xml": {
        source: "iana",
        compressible: true,
        extensions: ["its"]
      },
      "application/java-archive": {
        source: "apache",
        compressible: false,
        extensions: ["jar", "war", "ear"]
      },
      "application/java-serialized-object": {
        source: "apache",
        compressible: false,
        extensions: ["ser"]
      },
      "application/java-vm": {
        source: "apache",
        compressible: false,
        extensions: ["class"]
      },
      "application/javascript": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: ["js", "mjs"]
      },
      "application/jf2feed+json": {
        source: "iana",
        compressible: true
      },
      "application/jose": {
        source: "iana"
      },
      "application/jose+json": {
        source: "iana",
        compressible: true
      },
      "application/jrd+json": {
        source: "iana",
        compressible: true
      },
      "application/jscalendar+json": {
        source: "iana",
        compressible: true
      },
      "application/json": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: ["json", "map"]
      },
      "application/json-patch+json": {
        source: "iana",
        compressible: true
      },
      "application/json-seq": {
        source: "iana"
      },
      "application/json5": {
        extensions: ["json5"]
      },
      "application/jsonml+json": {
        source: "apache",
        compressible: true,
        extensions: ["jsonml"]
      },
      "application/jwk+json": {
        source: "iana",
        compressible: true
      },
      "application/jwk-set+json": {
        source: "iana",
        compressible: true
      },
      "application/jwt": {
        source: "iana"
      },
      "application/kpml-request+xml": {
        source: "iana",
        compressible: true
      },
      "application/kpml-response+xml": {
        source: "iana",
        compressible: true
      },
      "application/ld+json": {
        source: "iana",
        compressible: true,
        extensions: ["jsonld"]
      },
      "application/lgr+xml": {
        source: "iana",
        compressible: true,
        extensions: ["lgr"]
      },
      "application/link-format": {
        source: "iana"
      },
      "application/load-control+xml": {
        source: "iana",
        compressible: true
      },
      "application/lost+xml": {
        source: "iana",
        compressible: true,
        extensions: ["lostxml"]
      },
      "application/lostsync+xml": {
        source: "iana",
        compressible: true
      },
      "application/lpf+zip": {
        source: "iana",
        compressible: false
      },
      "application/lxf": {
        source: "iana"
      },
      "application/mac-binhex40": {
        source: "iana",
        extensions: ["hqx"]
      },
      "application/mac-compactpro": {
        source: "apache",
        extensions: ["cpt"]
      },
      "application/macwriteii": {
        source: "iana"
      },
      "application/mads+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mads"]
      },
      "application/manifest+json": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: ["webmanifest"]
      },
      "application/marc": {
        source: "iana",
        extensions: ["mrc"]
      },
      "application/marcxml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mrcx"]
      },
      "application/mathematica": {
        source: "iana",
        extensions: ["ma", "nb", "mb"]
      },
      "application/mathml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mathml"]
      },
      "application/mathml-content+xml": {
        source: "iana",
        compressible: true
      },
      "application/mathml-presentation+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-associated-procedure-description+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-deregister+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-envelope+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-msk+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-msk-response+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-protection-description+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-reception-report+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-register+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-register-response+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-schedule+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbms-user-service-description+xml": {
        source: "iana",
        compressible: true
      },
      "application/mbox": {
        source: "iana",
        extensions: ["mbox"]
      },
      "application/media-policy-dataset+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mpf"]
      },
      "application/media_control+xml": {
        source: "iana",
        compressible: true
      },
      "application/mediaservercontrol+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mscml"]
      },
      "application/merge-patch+json": {
        source: "iana",
        compressible: true
      },
      "application/metalink+xml": {
        source: "apache",
        compressible: true,
        extensions: ["metalink"]
      },
      "application/metalink4+xml": {
        source: "iana",
        compressible: true,
        extensions: ["meta4"]
      },
      "application/mets+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mets"]
      },
      "application/mf4": {
        source: "iana"
      },
      "application/mikey": {
        source: "iana"
      },
      "application/mipc": {
        source: "iana"
      },
      "application/missing-blocks+cbor-seq": {
        source: "iana"
      },
      "application/mmt-aei+xml": {
        source: "iana",
        compressible: true,
        extensions: ["maei"]
      },
      "application/mmt-usd+xml": {
        source: "iana",
        compressible: true,
        extensions: ["musd"]
      },
      "application/mods+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mods"]
      },
      "application/moss-keys": {
        source: "iana"
      },
      "application/moss-signature": {
        source: "iana"
      },
      "application/mosskey-data": {
        source: "iana"
      },
      "application/mosskey-request": {
        source: "iana"
      },
      "application/mp21": {
        source: "iana",
        extensions: ["m21", "mp21"]
      },
      "application/mp4": {
        source: "iana",
        extensions: ["mp4s", "m4p"]
      },
      "application/mpeg4-generic": {
        source: "iana"
      },
      "application/mpeg4-iod": {
        source: "iana"
      },
      "application/mpeg4-iod-xmt": {
        source: "iana"
      },
      "application/mrb-consumer+xml": {
        source: "iana",
        compressible: true
      },
      "application/mrb-publish+xml": {
        source: "iana",
        compressible: true
      },
      "application/msc-ivr+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/msc-mixer+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/msword": {
        source: "iana",
        compressible: false,
        extensions: ["doc", "dot"]
      },
      "application/mud+json": {
        source: "iana",
        compressible: true
      },
      "application/multipart-core": {
        source: "iana"
      },
      "application/mxf": {
        source: "iana",
        extensions: ["mxf"]
      },
      "application/n-quads": {
        source: "iana",
        extensions: ["nq"]
      },
      "application/n-triples": {
        source: "iana",
        extensions: ["nt"]
      },
      "application/nasdata": {
        source: "iana"
      },
      "application/news-checkgroups": {
        source: "iana",
        charset: "US-ASCII"
      },
      "application/news-groupinfo": {
        source: "iana",
        charset: "US-ASCII"
      },
      "application/news-transmission": {
        source: "iana"
      },
      "application/nlsml+xml": {
        source: "iana",
        compressible: true
      },
      "application/node": {
        source: "iana",
        extensions: ["cjs"]
      },
      "application/nss": {
        source: "iana"
      },
      "application/oauth-authz-req+jwt": {
        source: "iana"
      },
      "application/oblivious-dns-message": {
        source: "iana"
      },
      "application/ocsp-request": {
        source: "iana"
      },
      "application/ocsp-response": {
        source: "iana"
      },
      "application/octet-stream": {
        source: "iana",
        compressible: false,
        extensions: ["bin", "dms", "lrf", "mar", "so", "dist", "distz", "pkg", "bpk", "dump", "elc", "deploy", "exe", "dll", "deb", "dmg", "iso", "img", "msi", "msp", "msm", "buffer"]
      },
      "application/oda": {
        source: "iana",
        extensions: ["oda"]
      },
      "application/odm+xml": {
        source: "iana",
        compressible: true
      },
      "application/odx": {
        source: "iana"
      },
      "application/oebps-package+xml": {
        source: "iana",
        compressible: true,
        extensions: ["opf"]
      },
      "application/ogg": {
        source: "iana",
        compressible: false,
        extensions: ["ogx"]
      },
      "application/omdoc+xml": {
        source: "apache",
        compressible: true,
        extensions: ["omdoc"]
      },
      "application/onenote": {
        source: "apache",
        extensions: ["onetoc", "onetoc2", "onetmp", "onepkg"]
      },
      "application/opc-nodeset+xml": {
        source: "iana",
        compressible: true
      },
      "application/oscore": {
        source: "iana"
      },
      "application/oxps": {
        source: "iana",
        extensions: ["oxps"]
      },
      "application/p21": {
        source: "iana"
      },
      "application/p21+zip": {
        source: "iana",
        compressible: false
      },
      "application/p2p-overlay+xml": {
        source: "iana",
        compressible: true,
        extensions: ["relo"]
      },
      "application/parityfec": {
        source: "iana"
      },
      "application/passport": {
        source: "iana"
      },
      "application/patch-ops-error+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xer"]
      },
      "application/pdf": {
        source: "iana",
        compressible: false,
        extensions: ["pdf"]
      },
      "application/pdx": {
        source: "iana"
      },
      "application/pem-certificate-chain": {
        source: "iana"
      },
      "application/pgp-encrypted": {
        source: "iana",
        compressible: false,
        extensions: ["pgp"]
      },
      "application/pgp-keys": {
        source: "iana",
        extensions: ["asc"]
      },
      "application/pgp-signature": {
        source: "iana",
        extensions: ["asc", "sig"]
      },
      "application/pics-rules": {
        source: "apache",
        extensions: ["prf"]
      },
      "application/pidf+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/pidf-diff+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/pkcs10": {
        source: "iana",
        extensions: ["p10"]
      },
      "application/pkcs12": {
        source: "iana"
      },
      "application/pkcs7-mime": {
        source: "iana",
        extensions: ["p7m", "p7c"]
      },
      "application/pkcs7-signature": {
        source: "iana",
        extensions: ["p7s"]
      },
      "application/pkcs8": {
        source: "iana",
        extensions: ["p8"]
      },
      "application/pkcs8-encrypted": {
        source: "iana"
      },
      "application/pkix-attr-cert": {
        source: "iana",
        extensions: ["ac"]
      },
      "application/pkix-cert": {
        source: "iana",
        extensions: ["cer"]
      },
      "application/pkix-crl": {
        source: "iana",
        extensions: ["crl"]
      },
      "application/pkix-pkipath": {
        source: "iana",
        extensions: ["pkipath"]
      },
      "application/pkixcmp": {
        source: "iana",
        extensions: ["pki"]
      },
      "application/pls+xml": {
        source: "iana",
        compressible: true,
        extensions: ["pls"]
      },
      "application/poc-settings+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/postscript": {
        source: "iana",
        compressible: true,
        extensions: ["ai", "eps", "ps"]
      },
      "application/ppsp-tracker+json": {
        source: "iana",
        compressible: true
      },
      "application/problem+json": {
        source: "iana",
        compressible: true
      },
      "application/problem+xml": {
        source: "iana",
        compressible: true
      },
      "application/provenance+xml": {
        source: "iana",
        compressible: true,
        extensions: ["provx"]
      },
      "application/prs.alvestrand.titrax-sheet": {
        source: "iana"
      },
      "application/prs.cww": {
        source: "iana",
        extensions: ["cww"]
      },
      "application/prs.cyn": {
        source: "iana",
        charset: "7-BIT"
      },
      "application/prs.hpub+zip": {
        source: "iana",
        compressible: false
      },
      "application/prs.nprend": {
        source: "iana"
      },
      "application/prs.plucker": {
        source: "iana"
      },
      "application/prs.rdf-xml-crypt": {
        source: "iana"
      },
      "application/prs.xsf+xml": {
        source: "iana",
        compressible: true
      },
      "application/pskc+xml": {
        source: "iana",
        compressible: true,
        extensions: ["pskcxml"]
      },
      "application/pvd+json": {
        source: "iana",
        compressible: true
      },
      "application/qsig": {
        source: "iana"
      },
      "application/raml+yaml": {
        compressible: true,
        extensions: ["raml"]
      },
      "application/raptorfec": {
        source: "iana"
      },
      "application/rdap+json": {
        source: "iana",
        compressible: true
      },
      "application/rdf+xml": {
        source: "iana",
        compressible: true,
        extensions: ["rdf", "owl"]
      },
      "application/reginfo+xml": {
        source: "iana",
        compressible: true,
        extensions: ["rif"]
      },
      "application/relax-ng-compact-syntax": {
        source: "iana",
        extensions: ["rnc"]
      },
      "application/remote-printing": {
        source: "iana"
      },
      "application/reputon+json": {
        source: "iana",
        compressible: true
      },
      "application/resource-lists+xml": {
        source: "iana",
        compressible: true,
        extensions: ["rl"]
      },
      "application/resource-lists-diff+xml": {
        source: "iana",
        compressible: true,
        extensions: ["rld"]
      },
      "application/rfc+xml": {
        source: "iana",
        compressible: true
      },
      "application/riscos": {
        source: "iana"
      },
      "application/rlmi+xml": {
        source: "iana",
        compressible: true
      },
      "application/rls-services+xml": {
        source: "iana",
        compressible: true,
        extensions: ["rs"]
      },
      "application/route-apd+xml": {
        source: "iana",
        compressible: true,
        extensions: ["rapd"]
      },
      "application/route-s-tsid+xml": {
        source: "iana",
        compressible: true,
        extensions: ["sls"]
      },
      "application/route-usd+xml": {
        source: "iana",
        compressible: true,
        extensions: ["rusd"]
      },
      "application/rpki-ghostbusters": {
        source: "iana",
        extensions: ["gbr"]
      },
      "application/rpki-manifest": {
        source: "iana",
        extensions: ["mft"]
      },
      "application/rpki-publication": {
        source: "iana"
      },
      "application/rpki-roa": {
        source: "iana",
        extensions: ["roa"]
      },
      "application/rpki-updown": {
        source: "iana"
      },
      "application/rsd+xml": {
        source: "apache",
        compressible: true,
        extensions: ["rsd"]
      },
      "application/rss+xml": {
        source: "apache",
        compressible: true,
        extensions: ["rss"]
      },
      "application/rtf": {
        source: "iana",
        compressible: true,
        extensions: ["rtf"]
      },
      "application/rtploopback": {
        source: "iana"
      },
      "application/rtx": {
        source: "iana"
      },
      "application/samlassertion+xml": {
        source: "iana",
        compressible: true
      },
      "application/samlmetadata+xml": {
        source: "iana",
        compressible: true
      },
      "application/sarif+json": {
        source: "iana",
        compressible: true
      },
      "application/sarif-external-properties+json": {
        source: "iana",
        compressible: true
      },
      "application/sbe": {
        source: "iana"
      },
      "application/sbml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["sbml"]
      },
      "application/scaip+xml": {
        source: "iana",
        compressible: true
      },
      "application/scim+json": {
        source: "iana",
        compressible: true
      },
      "application/scvp-cv-request": {
        source: "iana",
        extensions: ["scq"]
      },
      "application/scvp-cv-response": {
        source: "iana",
        extensions: ["scs"]
      },
      "application/scvp-vp-request": {
        source: "iana",
        extensions: ["spq"]
      },
      "application/scvp-vp-response": {
        source: "iana",
        extensions: ["spp"]
      },
      "application/sdp": {
        source: "iana",
        extensions: ["sdp"]
      },
      "application/secevent+jwt": {
        source: "iana"
      },
      "application/senml+cbor": {
        source: "iana"
      },
      "application/senml+json": {
        source: "iana",
        compressible: true
      },
      "application/senml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["senmlx"]
      },
      "application/senml-etch+cbor": {
        source: "iana"
      },
      "application/senml-etch+json": {
        source: "iana",
        compressible: true
      },
      "application/senml-exi": {
        source: "iana"
      },
      "application/sensml+cbor": {
        source: "iana"
      },
      "application/sensml+json": {
        source: "iana",
        compressible: true
      },
      "application/sensml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["sensmlx"]
      },
      "application/sensml-exi": {
        source: "iana"
      },
      "application/sep+xml": {
        source: "iana",
        compressible: true
      },
      "application/sep-exi": {
        source: "iana"
      },
      "application/session-info": {
        source: "iana"
      },
      "application/set-payment": {
        source: "iana"
      },
      "application/set-payment-initiation": {
        source: "iana",
        extensions: ["setpay"]
      },
      "application/set-registration": {
        source: "iana"
      },
      "application/set-registration-initiation": {
        source: "iana",
        extensions: ["setreg"]
      },
      "application/sgml": {
        source: "iana"
      },
      "application/sgml-open-catalog": {
        source: "iana"
      },
      "application/shf+xml": {
        source: "iana",
        compressible: true,
        extensions: ["shf"]
      },
      "application/sieve": {
        source: "iana",
        extensions: ["siv", "sieve"]
      },
      "application/simple-filter+xml": {
        source: "iana",
        compressible: true
      },
      "application/simple-message-summary": {
        source: "iana"
      },
      "application/simplesymbolcontainer": {
        source: "iana"
      },
      "application/sipc": {
        source: "iana"
      },
      "application/slate": {
        source: "iana"
      },
      "application/smil": {
        source: "iana"
      },
      "application/smil+xml": {
        source: "iana",
        compressible: true,
        extensions: ["smi", "smil"]
      },
      "application/smpte336m": {
        source: "iana"
      },
      "application/soap+fastinfoset": {
        source: "iana"
      },
      "application/soap+xml": {
        source: "iana",
        compressible: true
      },
      "application/sparql-query": {
        source: "iana",
        extensions: ["rq"]
      },
      "application/sparql-results+xml": {
        source: "iana",
        compressible: true,
        extensions: ["srx"]
      },
      "application/spdx+json": {
        source: "iana",
        compressible: true
      },
      "application/spirits-event+xml": {
        source: "iana",
        compressible: true
      },
      "application/sql": {
        source: "iana"
      },
      "application/srgs": {
        source: "iana",
        extensions: ["gram"]
      },
      "application/srgs+xml": {
        source: "iana",
        compressible: true,
        extensions: ["grxml"]
      },
      "application/sru+xml": {
        source: "iana",
        compressible: true,
        extensions: ["sru"]
      },
      "application/ssdl+xml": {
        source: "apache",
        compressible: true,
        extensions: ["ssdl"]
      },
      "application/ssml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["ssml"]
      },
      "application/stix+json": {
        source: "iana",
        compressible: true
      },
      "application/swid+xml": {
        source: "iana",
        compressible: true,
        extensions: ["swidtag"]
      },
      "application/tamp-apex-update": {
        source: "iana"
      },
      "application/tamp-apex-update-confirm": {
        source: "iana"
      },
      "application/tamp-community-update": {
        source: "iana"
      },
      "application/tamp-community-update-confirm": {
        source: "iana"
      },
      "application/tamp-error": {
        source: "iana"
      },
      "application/tamp-sequence-adjust": {
        source: "iana"
      },
      "application/tamp-sequence-adjust-confirm": {
        source: "iana"
      },
      "application/tamp-status-query": {
        source: "iana"
      },
      "application/tamp-status-response": {
        source: "iana"
      },
      "application/tamp-update": {
        source: "iana"
      },
      "application/tamp-update-confirm": {
        source: "iana"
      },
      "application/tar": {
        compressible: true
      },
      "application/taxii+json": {
        source: "iana",
        compressible: true
      },
      "application/td+json": {
        source: "iana",
        compressible: true
      },
      "application/tei+xml": {
        source: "iana",
        compressible: true,
        extensions: ["tei", "teicorpus"]
      },
      "application/tetra_isi": {
        source: "iana"
      },
      "application/thraud+xml": {
        source: "iana",
        compressible: true,
        extensions: ["tfi"]
      },
      "application/timestamp-query": {
        source: "iana"
      },
      "application/timestamp-reply": {
        source: "iana"
      },
      "application/timestamped-data": {
        source: "iana",
        extensions: ["tsd"]
      },
      "application/tlsrpt+gzip": {
        source: "iana"
      },
      "application/tlsrpt+json": {
        source: "iana",
        compressible: true
      },
      "application/tnauthlist": {
        source: "iana"
      },
      "application/token-introspection+jwt": {
        source: "iana"
      },
      "application/toml": {
        compressible: true,
        extensions: ["toml"]
      },
      "application/trickle-ice-sdpfrag": {
        source: "iana"
      },
      "application/trig": {
        source: "iana",
        extensions: ["trig"]
      },
      "application/ttml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["ttml"]
      },
      "application/tve-trigger": {
        source: "iana"
      },
      "application/tzif": {
        source: "iana"
      },
      "application/tzif-leap": {
        source: "iana"
      },
      "application/ubjson": {
        compressible: false,
        extensions: ["ubj"]
      },
      "application/ulpfec": {
        source: "iana"
      },
      "application/urc-grpsheet+xml": {
        source: "iana",
        compressible: true
      },
      "application/urc-ressheet+xml": {
        source: "iana",
        compressible: true,
        extensions: ["rsheet"]
      },
      "application/urc-targetdesc+xml": {
        source: "iana",
        compressible: true,
        extensions: ["td"]
      },
      "application/urc-uisocketdesc+xml": {
        source: "iana",
        compressible: true
      },
      "application/vcard+json": {
        source: "iana",
        compressible: true
      },
      "application/vcard+xml": {
        source: "iana",
        compressible: true
      },
      "application/vemmi": {
        source: "iana"
      },
      "application/vividence.scriptfile": {
        source: "apache"
      },
      "application/vnd.1000minds.decision-model+xml": {
        source: "iana",
        compressible: true,
        extensions: ["1km"]
      },
      "application/vnd.3gpp-prose+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp-prose-pc3ch+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp-v2x-local-service-information": {
        source: "iana"
      },
      "application/vnd.3gpp.5gnas": {
        source: "iana"
      },
      "application/vnd.3gpp.access-transfer-events+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.bsf+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.gmop+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.gtpc": {
        source: "iana"
      },
      "application/vnd.3gpp.interworking-data": {
        source: "iana"
      },
      "application/vnd.3gpp.lpp": {
        source: "iana"
      },
      "application/vnd.3gpp.mc-signalling-ear": {
        source: "iana"
      },
      "application/vnd.3gpp.mcdata-affiliation-command+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcdata-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcdata-payload": {
        source: "iana"
      },
      "application/vnd.3gpp.mcdata-service-config+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcdata-signalling": {
        source: "iana"
      },
      "application/vnd.3gpp.mcdata-ue-config+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcdata-user-profile+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcptt-affiliation-command+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcptt-floor-request+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcptt-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcptt-location-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcptt-mbms-usage-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcptt-service-config+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcptt-signed+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcptt-ue-config+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcptt-ue-init-config+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcptt-user-profile+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcvideo-affiliation-command+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcvideo-affiliation-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcvideo-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcvideo-location-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcvideo-mbms-usage-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcvideo-service-config+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcvideo-transmission-request+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcvideo-ue-config+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mcvideo-user-profile+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.mid-call+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.ngap": {
        source: "iana"
      },
      "application/vnd.3gpp.pfcp": {
        source: "iana"
      },
      "application/vnd.3gpp.pic-bw-large": {
        source: "iana",
        extensions: ["plb"]
      },
      "application/vnd.3gpp.pic-bw-small": {
        source: "iana",
        extensions: ["psb"]
      },
      "application/vnd.3gpp.pic-bw-var": {
        source: "iana",
        extensions: ["pvb"]
      },
      "application/vnd.3gpp.s1ap": {
        source: "iana"
      },
      "application/vnd.3gpp.sms": {
        source: "iana"
      },
      "application/vnd.3gpp.sms+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.srvcc-ext+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.srvcc-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.state-and-event-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp.ussd+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp2.bcmcsinfo+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.3gpp2.sms": {
        source: "iana"
      },
      "application/vnd.3gpp2.tcap": {
        source: "iana",
        extensions: ["tcap"]
      },
      "application/vnd.3lightssoftware.imagescal": {
        source: "iana"
      },
      "application/vnd.3m.post-it-notes": {
        source: "iana",
        extensions: ["pwn"]
      },
      "application/vnd.accpac.simply.aso": {
        source: "iana",
        extensions: ["aso"]
      },
      "application/vnd.accpac.simply.imp": {
        source: "iana",
        extensions: ["imp"]
      },
      "application/vnd.acucobol": {
        source: "iana",
        extensions: ["acu"]
      },
      "application/vnd.acucorp": {
        source: "iana",
        extensions: ["atc", "acutc"]
      },
      "application/vnd.adobe.air-application-installer-package+zip": {
        source: "apache",
        compressible: false,
        extensions: ["air"]
      },
      "application/vnd.adobe.flash.movie": {
        source: "iana"
      },
      "application/vnd.adobe.formscentral.fcdt": {
        source: "iana",
        extensions: ["fcdt"]
      },
      "application/vnd.adobe.fxp": {
        source: "iana",
        extensions: ["fxp", "fxpl"]
      },
      "application/vnd.adobe.partial-upload": {
        source: "iana"
      },
      "application/vnd.adobe.xdp+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xdp"]
      },
      "application/vnd.adobe.xfdf": {
        source: "iana",
        extensions: ["xfdf"]
      },
      "application/vnd.aether.imp": {
        source: "iana"
      },
      "application/vnd.afpc.afplinedata": {
        source: "iana"
      },
      "application/vnd.afpc.afplinedata-pagedef": {
        source: "iana"
      },
      "application/vnd.afpc.cmoca-cmresource": {
        source: "iana"
      },
      "application/vnd.afpc.foca-charset": {
        source: "iana"
      },
      "application/vnd.afpc.foca-codedfont": {
        source: "iana"
      },
      "application/vnd.afpc.foca-codepage": {
        source: "iana"
      },
      "application/vnd.afpc.modca": {
        source: "iana"
      },
      "application/vnd.afpc.modca-cmtable": {
        source: "iana"
      },
      "application/vnd.afpc.modca-formdef": {
        source: "iana"
      },
      "application/vnd.afpc.modca-mediummap": {
        source: "iana"
      },
      "application/vnd.afpc.modca-objectcontainer": {
        source: "iana"
      },
      "application/vnd.afpc.modca-overlay": {
        source: "iana"
      },
      "application/vnd.afpc.modca-pagesegment": {
        source: "iana"
      },
      "application/vnd.age": {
        source: "iana",
        extensions: ["age"]
      },
      "application/vnd.ah-barcode": {
        source: "iana"
      },
      "application/vnd.ahead.space": {
        source: "iana",
        extensions: ["ahead"]
      },
      "application/vnd.airzip.filesecure.azf": {
        source: "iana",
        extensions: ["azf"]
      },
      "application/vnd.airzip.filesecure.azs": {
        source: "iana",
        extensions: ["azs"]
      },
      "application/vnd.amadeus+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.amazon.ebook": {
        source: "apache",
        extensions: ["azw"]
      },
      "application/vnd.amazon.mobi8-ebook": {
        source: "iana"
      },
      "application/vnd.americandynamics.acc": {
        source: "iana",
        extensions: ["acc"]
      },
      "application/vnd.amiga.ami": {
        source: "iana",
        extensions: ["ami"]
      },
      "application/vnd.amundsen.maze+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.android.ota": {
        source: "iana"
      },
      "application/vnd.android.package-archive": {
        source: "apache",
        compressible: false,
        extensions: ["apk"]
      },
      "application/vnd.anki": {
        source: "iana"
      },
      "application/vnd.anser-web-certificate-issue-initiation": {
        source: "iana",
        extensions: ["cii"]
      },
      "application/vnd.anser-web-funds-transfer-initiation": {
        source: "apache",
        extensions: ["fti"]
      },
      "application/vnd.antix.game-component": {
        source: "iana",
        extensions: ["atx"]
      },
      "application/vnd.apache.arrow.file": {
        source: "iana"
      },
      "application/vnd.apache.arrow.stream": {
        source: "iana"
      },
      "application/vnd.apache.thrift.binary": {
        source: "iana"
      },
      "application/vnd.apache.thrift.compact": {
        source: "iana"
      },
      "application/vnd.apache.thrift.json": {
        source: "iana"
      },
      "application/vnd.api+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.aplextor.warrp+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.apothekende.reservation+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.apple.installer+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mpkg"]
      },
      "application/vnd.apple.keynote": {
        source: "iana",
        extensions: ["key"]
      },
      "application/vnd.apple.mpegurl": {
        source: "iana",
        extensions: ["m3u8"]
      },
      "application/vnd.apple.numbers": {
        source: "iana",
        extensions: ["numbers"]
      },
      "application/vnd.apple.pages": {
        source: "iana",
        extensions: ["pages"]
      },
      "application/vnd.apple.pkpass": {
        compressible: false,
        extensions: ["pkpass"]
      },
      "application/vnd.arastra.swi": {
        source: "iana"
      },
      "application/vnd.aristanetworks.swi": {
        source: "iana",
        extensions: ["swi"]
      },
      "application/vnd.artisan+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.artsquare": {
        source: "iana"
      },
      "application/vnd.astraea-software.iota": {
        source: "iana",
        extensions: ["iota"]
      },
      "application/vnd.audiograph": {
        source: "iana",
        extensions: ["aep"]
      },
      "application/vnd.autopackage": {
        source: "iana"
      },
      "application/vnd.avalon+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.avistar+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.balsamiq.bmml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["bmml"]
      },
      "application/vnd.balsamiq.bmpr": {
        source: "iana"
      },
      "application/vnd.banana-accounting": {
        source: "iana"
      },
      "application/vnd.bbf.usp.error": {
        source: "iana"
      },
      "application/vnd.bbf.usp.msg": {
        source: "iana"
      },
      "application/vnd.bbf.usp.msg+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.bekitzur-stech+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.bint.med-content": {
        source: "iana"
      },
      "application/vnd.biopax.rdf+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.blink-idb-value-wrapper": {
        source: "iana"
      },
      "application/vnd.blueice.multipass": {
        source: "iana",
        extensions: ["mpm"]
      },
      "application/vnd.bluetooth.ep.oob": {
        source: "iana"
      },
      "application/vnd.bluetooth.le.oob": {
        source: "iana"
      },
      "application/vnd.bmi": {
        source: "iana",
        extensions: ["bmi"]
      },
      "application/vnd.bpf": {
        source: "iana"
      },
      "application/vnd.bpf3": {
        source: "iana"
      },
      "application/vnd.businessobjects": {
        source: "iana",
        extensions: ["rep"]
      },
      "application/vnd.byu.uapi+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.cab-jscript": {
        source: "iana"
      },
      "application/vnd.canon-cpdl": {
        source: "iana"
      },
      "application/vnd.canon-lips": {
        source: "iana"
      },
      "application/vnd.capasystems-pg+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.cendio.thinlinc.clientconf": {
        source: "iana"
      },
      "application/vnd.century-systems.tcp_stream": {
        source: "iana"
      },
      "application/vnd.chemdraw+xml": {
        source: "iana",
        compressible: true,
        extensions: ["cdxml"]
      },
      "application/vnd.chess-pgn": {
        source: "iana"
      },
      "application/vnd.chipnuts.karaoke-mmd": {
        source: "iana",
        extensions: ["mmd"]
      },
      "application/vnd.ciedi": {
        source: "iana"
      },
      "application/vnd.cinderella": {
        source: "iana",
        extensions: ["cdy"]
      },
      "application/vnd.cirpack.isdn-ext": {
        source: "iana"
      },
      "application/vnd.citationstyles.style+xml": {
        source: "iana",
        compressible: true,
        extensions: ["csl"]
      },
      "application/vnd.claymore": {
        source: "iana",
        extensions: ["cla"]
      },
      "application/vnd.cloanto.rp9": {
        source: "iana",
        extensions: ["rp9"]
      },
      "application/vnd.clonk.c4group": {
        source: "iana",
        extensions: ["c4g", "c4d", "c4f", "c4p", "c4u"]
      },
      "application/vnd.cluetrust.cartomobile-config": {
        source: "iana",
        extensions: ["c11amc"]
      },
      "application/vnd.cluetrust.cartomobile-config-pkg": {
        source: "iana",
        extensions: ["c11amz"]
      },
      "application/vnd.coffeescript": {
        source: "iana"
      },
      "application/vnd.collabio.xodocuments.document": {
        source: "iana"
      },
      "application/vnd.collabio.xodocuments.document-template": {
        source: "iana"
      },
      "application/vnd.collabio.xodocuments.presentation": {
        source: "iana"
      },
      "application/vnd.collabio.xodocuments.presentation-template": {
        source: "iana"
      },
      "application/vnd.collabio.xodocuments.spreadsheet": {
        source: "iana"
      },
      "application/vnd.collabio.xodocuments.spreadsheet-template": {
        source: "iana"
      },
      "application/vnd.collection+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.collection.doc+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.collection.next+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.comicbook+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.comicbook-rar": {
        source: "iana"
      },
      "application/vnd.commerce-battelle": {
        source: "iana"
      },
      "application/vnd.commonspace": {
        source: "iana",
        extensions: ["csp"]
      },
      "application/vnd.contact.cmsg": {
        source: "iana",
        extensions: ["cdbcmsg"]
      },
      "application/vnd.coreos.ignition+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.cosmocaller": {
        source: "iana",
        extensions: ["cmc"]
      },
      "application/vnd.crick.clicker": {
        source: "iana",
        extensions: ["clkx"]
      },
      "application/vnd.crick.clicker.keyboard": {
        source: "iana",
        extensions: ["clkk"]
      },
      "application/vnd.crick.clicker.palette": {
        source: "iana",
        extensions: ["clkp"]
      },
      "application/vnd.crick.clicker.template": {
        source: "iana",
        extensions: ["clkt"]
      },
      "application/vnd.crick.clicker.wordbank": {
        source: "iana",
        extensions: ["clkw"]
      },
      "application/vnd.criticaltools.wbs+xml": {
        source: "iana",
        compressible: true,
        extensions: ["wbs"]
      },
      "application/vnd.cryptii.pipe+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.crypto-shade-file": {
        source: "iana"
      },
      "application/vnd.cryptomator.encrypted": {
        source: "iana"
      },
      "application/vnd.cryptomator.vault": {
        source: "iana"
      },
      "application/vnd.ctc-posml": {
        source: "iana",
        extensions: ["pml"]
      },
      "application/vnd.ctct.ws+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.cups-pdf": {
        source: "iana"
      },
      "application/vnd.cups-postscript": {
        source: "iana"
      },
      "application/vnd.cups-ppd": {
        source: "iana",
        extensions: ["ppd"]
      },
      "application/vnd.cups-raster": {
        source: "iana"
      },
      "application/vnd.cups-raw": {
        source: "iana"
      },
      "application/vnd.curl": {
        source: "iana"
      },
      "application/vnd.curl.car": {
        source: "apache",
        extensions: ["car"]
      },
      "application/vnd.curl.pcurl": {
        source: "apache",
        extensions: ["pcurl"]
      },
      "application/vnd.cyan.dean.root+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.cybank": {
        source: "iana"
      },
      "application/vnd.cyclonedx+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.cyclonedx+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.d2l.coursepackage1p0+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.d3m-dataset": {
        source: "iana"
      },
      "application/vnd.d3m-problem": {
        source: "iana"
      },
      "application/vnd.dart": {
        source: "iana",
        compressible: true,
        extensions: ["dart"]
      },
      "application/vnd.data-vision.rdz": {
        source: "iana",
        extensions: ["rdz"]
      },
      "application/vnd.datapackage+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dataresource+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dbf": {
        source: "iana",
        extensions: ["dbf"]
      },
      "application/vnd.debian.binary-package": {
        source: "iana"
      },
      "application/vnd.dece.data": {
        source: "iana",
        extensions: ["uvf", "uvvf", "uvd", "uvvd"]
      },
      "application/vnd.dece.ttml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["uvt", "uvvt"]
      },
      "application/vnd.dece.unspecified": {
        source: "iana",
        extensions: ["uvx", "uvvx"]
      },
      "application/vnd.dece.zip": {
        source: "iana",
        extensions: ["uvz", "uvvz"]
      },
      "application/vnd.denovo.fcselayout-link": {
        source: "iana",
        extensions: ["fe_launch"]
      },
      "application/vnd.desmume.movie": {
        source: "iana"
      },
      "application/vnd.dir-bi.plate-dl-nosuffix": {
        source: "iana"
      },
      "application/vnd.dm.delegation+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dna": {
        source: "iana",
        extensions: ["dna"]
      },
      "application/vnd.document+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dolby.mlp": {
        source: "apache",
        extensions: ["mlp"]
      },
      "application/vnd.dolby.mobile.1": {
        source: "iana"
      },
      "application/vnd.dolby.mobile.2": {
        source: "iana"
      },
      "application/vnd.doremir.scorecloud-binary-document": {
        source: "iana"
      },
      "application/vnd.dpgraph": {
        source: "iana",
        extensions: ["dpg"]
      },
      "application/vnd.dreamfactory": {
        source: "iana",
        extensions: ["dfac"]
      },
      "application/vnd.drive+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ds-keypoint": {
        source: "apache",
        extensions: ["kpxx"]
      },
      "application/vnd.dtg.local": {
        source: "iana"
      },
      "application/vnd.dtg.local.flash": {
        source: "iana"
      },
      "application/vnd.dtg.local.html": {
        source: "iana"
      },
      "application/vnd.dvb.ait": {
        source: "iana",
        extensions: ["ait"]
      },
      "application/vnd.dvb.dvbisl+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dvb.dvbj": {
        source: "iana"
      },
      "application/vnd.dvb.esgcontainer": {
        source: "iana"
      },
      "application/vnd.dvb.ipdcdftnotifaccess": {
        source: "iana"
      },
      "application/vnd.dvb.ipdcesgaccess": {
        source: "iana"
      },
      "application/vnd.dvb.ipdcesgaccess2": {
        source: "iana"
      },
      "application/vnd.dvb.ipdcesgpdd": {
        source: "iana"
      },
      "application/vnd.dvb.ipdcroaming": {
        source: "iana"
      },
      "application/vnd.dvb.iptv.alfec-base": {
        source: "iana"
      },
      "application/vnd.dvb.iptv.alfec-enhancement": {
        source: "iana"
      },
      "application/vnd.dvb.notif-aggregate-root+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dvb.notif-container+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dvb.notif-generic+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dvb.notif-ia-msglist+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dvb.notif-ia-registration-request+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dvb.notif-ia-registration-response+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dvb.notif-init+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.dvb.pfr": {
        source: "iana"
      },
      "application/vnd.dvb.service": {
        source: "iana",
        extensions: ["svc"]
      },
      "application/vnd.dxr": {
        source: "iana"
      },
      "application/vnd.dynageo": {
        source: "iana",
        extensions: ["geo"]
      },
      "application/vnd.dzr": {
        source: "iana"
      },
      "application/vnd.easykaraoke.cdgdownload": {
        source: "iana"
      },
      "application/vnd.ecdis-update": {
        source: "iana"
      },
      "application/vnd.ecip.rlp": {
        source: "iana"
      },
      "application/vnd.eclipse.ditto+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ecowin.chart": {
        source: "iana",
        extensions: ["mag"]
      },
      "application/vnd.ecowin.filerequest": {
        source: "iana"
      },
      "application/vnd.ecowin.fileupdate": {
        source: "iana"
      },
      "application/vnd.ecowin.series": {
        source: "iana"
      },
      "application/vnd.ecowin.seriesrequest": {
        source: "iana"
      },
      "application/vnd.ecowin.seriesupdate": {
        source: "iana"
      },
      "application/vnd.efi.img": {
        source: "iana"
      },
      "application/vnd.efi.iso": {
        source: "iana"
      },
      "application/vnd.emclient.accessrequest+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.enliven": {
        source: "iana",
        extensions: ["nml"]
      },
      "application/vnd.enphase.envoy": {
        source: "iana"
      },
      "application/vnd.eprints.data+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.epson.esf": {
        source: "iana",
        extensions: ["esf"]
      },
      "application/vnd.epson.msf": {
        source: "iana",
        extensions: ["msf"]
      },
      "application/vnd.epson.quickanime": {
        source: "iana",
        extensions: ["qam"]
      },
      "application/vnd.epson.salt": {
        source: "iana",
        extensions: ["slt"]
      },
      "application/vnd.epson.ssf": {
        source: "iana",
        extensions: ["ssf"]
      },
      "application/vnd.ericsson.quickcall": {
        source: "iana"
      },
      "application/vnd.espass-espass+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.eszigno3+xml": {
        source: "iana",
        compressible: true,
        extensions: ["es3", "et3"]
      },
      "application/vnd.etsi.aoc+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.asic-e+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.etsi.asic-s+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.etsi.cug+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.iptvcommand+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.iptvdiscovery+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.iptvprofile+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.iptvsad-bc+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.iptvsad-cod+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.iptvsad-npvr+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.iptvservice+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.iptvsync+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.iptvueprofile+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.mcid+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.mheg5": {
        source: "iana"
      },
      "application/vnd.etsi.overload-control-policy-dataset+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.pstn+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.sci+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.simservs+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.timestamp-token": {
        source: "iana"
      },
      "application/vnd.etsi.tsl+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.etsi.tsl.der": {
        source: "iana"
      },
      "application/vnd.eu.kasparian.car+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.eudora.data": {
        source: "iana"
      },
      "application/vnd.evolv.ecig.profile": {
        source: "iana"
      },
      "application/vnd.evolv.ecig.settings": {
        source: "iana"
      },
      "application/vnd.evolv.ecig.theme": {
        source: "iana"
      },
      "application/vnd.exstream-empower+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.exstream-package": {
        source: "iana"
      },
      "application/vnd.ezpix-album": {
        source: "iana",
        extensions: ["ez2"]
      },
      "application/vnd.ezpix-package": {
        source: "iana",
        extensions: ["ez3"]
      },
      "application/vnd.f-secure.mobile": {
        source: "iana"
      },
      "application/vnd.familysearch.gedcom+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.fastcopy-disk-image": {
        source: "iana"
      },
      "application/vnd.fdf": {
        source: "iana",
        extensions: ["fdf"]
      },
      "application/vnd.fdsn.mseed": {
        source: "iana",
        extensions: ["mseed"]
      },
      "application/vnd.fdsn.seed": {
        source: "iana",
        extensions: ["seed", "dataless"]
      },
      "application/vnd.ffsns": {
        source: "iana"
      },
      "application/vnd.ficlab.flb+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.filmit.zfc": {
        source: "iana"
      },
      "application/vnd.fints": {
        source: "iana"
      },
      "application/vnd.firemonkeys.cloudcell": {
        source: "iana"
      },
      "application/vnd.flographit": {
        source: "iana",
        extensions: ["gph"]
      },
      "application/vnd.fluxtime.clip": {
        source: "iana",
        extensions: ["ftc"]
      },
      "application/vnd.font-fontforge-sfd": {
        source: "iana"
      },
      "application/vnd.framemaker": {
        source: "iana",
        extensions: ["fm", "frame", "maker", "book"]
      },
      "application/vnd.frogans.fnc": {
        source: "iana",
        extensions: ["fnc"]
      },
      "application/vnd.frogans.ltf": {
        source: "iana",
        extensions: ["ltf"]
      },
      "application/vnd.fsc.weblaunch": {
        source: "iana",
        extensions: ["fsc"]
      },
      "application/vnd.fujifilm.fb.docuworks": {
        source: "iana"
      },
      "application/vnd.fujifilm.fb.docuworks.binder": {
        source: "iana"
      },
      "application/vnd.fujifilm.fb.docuworks.container": {
        source: "iana"
      },
      "application/vnd.fujifilm.fb.jfi+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.fujitsu.oasys": {
        source: "iana",
        extensions: ["oas"]
      },
      "application/vnd.fujitsu.oasys2": {
        source: "iana",
        extensions: ["oa2"]
      },
      "application/vnd.fujitsu.oasys3": {
        source: "iana",
        extensions: ["oa3"]
      },
      "application/vnd.fujitsu.oasysgp": {
        source: "iana",
        extensions: ["fg5"]
      },
      "application/vnd.fujitsu.oasysprs": {
        source: "iana",
        extensions: ["bh2"]
      },
      "application/vnd.fujixerox.art-ex": {
        source: "iana"
      },
      "application/vnd.fujixerox.art4": {
        source: "iana"
      },
      "application/vnd.fujixerox.ddd": {
        source: "iana",
        extensions: ["ddd"]
      },
      "application/vnd.fujixerox.docuworks": {
        source: "iana",
        extensions: ["xdw"]
      },
      "application/vnd.fujixerox.docuworks.binder": {
        source: "iana",
        extensions: ["xbd"]
      },
      "application/vnd.fujixerox.docuworks.container": {
        source: "iana"
      },
      "application/vnd.fujixerox.hbpl": {
        source: "iana"
      },
      "application/vnd.fut-misnet": {
        source: "iana"
      },
      "application/vnd.futoin+cbor": {
        source: "iana"
      },
      "application/vnd.futoin+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.fuzzysheet": {
        source: "iana",
        extensions: ["fzs"]
      },
      "application/vnd.genomatix.tuxedo": {
        source: "iana",
        extensions: ["txd"]
      },
      "application/vnd.gentics.grd+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.geo+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.geocube+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.geogebra.file": {
        source: "iana",
        extensions: ["ggb"]
      },
      "application/vnd.geogebra.slides": {
        source: "iana"
      },
      "application/vnd.geogebra.tool": {
        source: "iana",
        extensions: ["ggt"]
      },
      "application/vnd.geometry-explorer": {
        source: "iana",
        extensions: ["gex", "gre"]
      },
      "application/vnd.geonext": {
        source: "iana",
        extensions: ["gxt"]
      },
      "application/vnd.geoplan": {
        source: "iana",
        extensions: ["g2w"]
      },
      "application/vnd.geospace": {
        source: "iana",
        extensions: ["g3w"]
      },
      "application/vnd.gerber": {
        source: "iana"
      },
      "application/vnd.globalplatform.card-content-mgt": {
        source: "iana"
      },
      "application/vnd.globalplatform.card-content-mgt-response": {
        source: "iana"
      },
      "application/vnd.gmx": {
        source: "iana",
        extensions: ["gmx"]
      },
      "application/vnd.google-apps.document": {
        compressible: false,
        extensions: ["gdoc"]
      },
      "application/vnd.google-apps.presentation": {
        compressible: false,
        extensions: ["gslides"]
      },
      "application/vnd.google-apps.spreadsheet": {
        compressible: false,
        extensions: ["gsheet"]
      },
      "application/vnd.google-earth.kml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["kml"]
      },
      "application/vnd.google-earth.kmz": {
        source: "iana",
        compressible: false,
        extensions: ["kmz"]
      },
      "application/vnd.gov.sk.e-form+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.gov.sk.e-form+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.gov.sk.xmldatacontainer+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.grafeq": {
        source: "iana",
        extensions: ["gqf", "gqs"]
      },
      "application/vnd.gridmp": {
        source: "iana"
      },
      "application/vnd.groove-account": {
        source: "iana",
        extensions: ["gac"]
      },
      "application/vnd.groove-help": {
        source: "iana",
        extensions: ["ghf"]
      },
      "application/vnd.groove-identity-message": {
        source: "iana",
        extensions: ["gim"]
      },
      "application/vnd.groove-injector": {
        source: "iana",
        extensions: ["grv"]
      },
      "application/vnd.groove-tool-message": {
        source: "iana",
        extensions: ["gtm"]
      },
      "application/vnd.groove-tool-template": {
        source: "iana",
        extensions: ["tpl"]
      },
      "application/vnd.groove-vcard": {
        source: "iana",
        extensions: ["vcg"]
      },
      "application/vnd.hal+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.hal+xml": {
        source: "iana",
        compressible: true,
        extensions: ["hal"]
      },
      "application/vnd.handheld-entertainment+xml": {
        source: "iana",
        compressible: true,
        extensions: ["zmm"]
      },
      "application/vnd.hbci": {
        source: "iana",
        extensions: ["hbci"]
      },
      "application/vnd.hc+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.hcl-bireports": {
        source: "iana"
      },
      "application/vnd.hdt": {
        source: "iana"
      },
      "application/vnd.heroku+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.hhe.lesson-player": {
        source: "iana",
        extensions: ["les"]
      },
      "application/vnd.hl7cda+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/vnd.hl7v2+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/vnd.hp-hpgl": {
        source: "iana",
        extensions: ["hpgl"]
      },
      "application/vnd.hp-hpid": {
        source: "iana",
        extensions: ["hpid"]
      },
      "application/vnd.hp-hps": {
        source: "iana",
        extensions: ["hps"]
      },
      "application/vnd.hp-jlyt": {
        source: "iana",
        extensions: ["jlt"]
      },
      "application/vnd.hp-pcl": {
        source: "iana",
        extensions: ["pcl"]
      },
      "application/vnd.hp-pclxl": {
        source: "iana",
        extensions: ["pclxl"]
      },
      "application/vnd.httphone": {
        source: "iana"
      },
      "application/vnd.hydrostatix.sof-data": {
        source: "iana",
        extensions: ["sfd-hdstx"]
      },
      "application/vnd.hyper+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.hyper-item+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.hyperdrive+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.hzn-3d-crossword": {
        source: "iana"
      },
      "application/vnd.ibm.afplinedata": {
        source: "iana"
      },
      "application/vnd.ibm.electronic-media": {
        source: "iana"
      },
      "application/vnd.ibm.minipay": {
        source: "iana",
        extensions: ["mpy"]
      },
      "application/vnd.ibm.modcap": {
        source: "iana",
        extensions: ["afp", "listafp", "list3820"]
      },
      "application/vnd.ibm.rights-management": {
        source: "iana",
        extensions: ["irm"]
      },
      "application/vnd.ibm.secure-container": {
        source: "iana",
        extensions: ["sc"]
      },
      "application/vnd.iccprofile": {
        source: "iana",
        extensions: ["icc", "icm"]
      },
      "application/vnd.ieee.1905": {
        source: "iana"
      },
      "application/vnd.igloader": {
        source: "iana",
        extensions: ["igl"]
      },
      "application/vnd.imagemeter.folder+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.imagemeter.image+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.immervision-ivp": {
        source: "iana",
        extensions: ["ivp"]
      },
      "application/vnd.immervision-ivu": {
        source: "iana",
        extensions: ["ivu"]
      },
      "application/vnd.ims.imsccv1p1": {
        source: "iana"
      },
      "application/vnd.ims.imsccv1p2": {
        source: "iana"
      },
      "application/vnd.ims.imsccv1p3": {
        source: "iana"
      },
      "application/vnd.ims.lis.v2.result+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ims.lti.v2.toolconsumerprofile+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ims.lti.v2.toolproxy+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ims.lti.v2.toolproxy.id+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ims.lti.v2.toolsettings+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ims.lti.v2.toolsettings.simple+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.informedcontrol.rms+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.informix-visionary": {
        source: "iana"
      },
      "application/vnd.infotech.project": {
        source: "iana"
      },
      "application/vnd.infotech.project+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.innopath.wamp.notification": {
        source: "iana"
      },
      "application/vnd.insors.igm": {
        source: "iana",
        extensions: ["igm"]
      },
      "application/vnd.intercon.formnet": {
        source: "iana",
        extensions: ["xpw", "xpx"]
      },
      "application/vnd.intergeo": {
        source: "iana",
        extensions: ["i2g"]
      },
      "application/vnd.intertrust.digibox": {
        source: "iana"
      },
      "application/vnd.intertrust.nncp": {
        source: "iana"
      },
      "application/vnd.intu.qbo": {
        source: "iana",
        extensions: ["qbo"]
      },
      "application/vnd.intu.qfx": {
        source: "iana",
        extensions: ["qfx"]
      },
      "application/vnd.iptc.g2.catalogitem+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.iptc.g2.conceptitem+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.iptc.g2.knowledgeitem+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.iptc.g2.newsitem+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.iptc.g2.newsmessage+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.iptc.g2.packageitem+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.iptc.g2.planningitem+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ipunplugged.rcprofile": {
        source: "iana",
        extensions: ["rcprofile"]
      },
      "application/vnd.irepository.package+xml": {
        source: "iana",
        compressible: true,
        extensions: ["irp"]
      },
      "application/vnd.is-xpr": {
        source: "iana",
        extensions: ["xpr"]
      },
      "application/vnd.isac.fcs": {
        source: "iana",
        extensions: ["fcs"]
      },
      "application/vnd.iso11783-10+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.jam": {
        source: "iana",
        extensions: ["jam"]
      },
      "application/vnd.japannet-directory-service": {
        source: "iana"
      },
      "application/vnd.japannet-jpnstore-wakeup": {
        source: "iana"
      },
      "application/vnd.japannet-payment-wakeup": {
        source: "iana"
      },
      "application/vnd.japannet-registration": {
        source: "iana"
      },
      "application/vnd.japannet-registration-wakeup": {
        source: "iana"
      },
      "application/vnd.japannet-setstore-wakeup": {
        source: "iana"
      },
      "application/vnd.japannet-verification": {
        source: "iana"
      },
      "application/vnd.japannet-verification-wakeup": {
        source: "iana"
      },
      "application/vnd.jcp.javame.midlet-rms": {
        source: "iana",
        extensions: ["rms"]
      },
      "application/vnd.jisp": {
        source: "iana",
        extensions: ["jisp"]
      },
      "application/vnd.joost.joda-archive": {
        source: "iana",
        extensions: ["joda"]
      },
      "application/vnd.jsk.isdn-ngn": {
        source: "iana"
      },
      "application/vnd.kahootz": {
        source: "iana",
        extensions: ["ktz", "ktr"]
      },
      "application/vnd.kde.karbon": {
        source: "iana",
        extensions: ["karbon"]
      },
      "application/vnd.kde.kchart": {
        source: "iana",
        extensions: ["chrt"]
      },
      "application/vnd.kde.kformula": {
        source: "iana",
        extensions: ["kfo"]
      },
      "application/vnd.kde.kivio": {
        source: "iana",
        extensions: ["flw"]
      },
      "application/vnd.kde.kontour": {
        source: "iana",
        extensions: ["kon"]
      },
      "application/vnd.kde.kpresenter": {
        source: "iana",
        extensions: ["kpr", "kpt"]
      },
      "application/vnd.kde.kspread": {
        source: "iana",
        extensions: ["ksp"]
      },
      "application/vnd.kde.kword": {
        source: "iana",
        extensions: ["kwd", "kwt"]
      },
      "application/vnd.kenameaapp": {
        source: "iana",
        extensions: ["htke"]
      },
      "application/vnd.kidspiration": {
        source: "iana",
        extensions: ["kia"]
      },
      "application/vnd.kinar": {
        source: "iana",
        extensions: ["kne", "knp"]
      },
      "application/vnd.koan": {
        source: "iana",
        extensions: ["skp", "skd", "skt", "skm"]
      },
      "application/vnd.kodak-descriptor": {
        source: "iana",
        extensions: ["sse"]
      },
      "application/vnd.las": {
        source: "iana"
      },
      "application/vnd.las.las+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.las.las+xml": {
        source: "iana",
        compressible: true,
        extensions: ["lasxml"]
      },
      "application/vnd.laszip": {
        source: "iana"
      },
      "application/vnd.leap+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.liberty-request+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.llamagraphics.life-balance.desktop": {
        source: "iana",
        extensions: ["lbd"]
      },
      "application/vnd.llamagraphics.life-balance.exchange+xml": {
        source: "iana",
        compressible: true,
        extensions: ["lbe"]
      },
      "application/vnd.logipipe.circuit+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.loom": {
        source: "iana"
      },
      "application/vnd.lotus-1-2-3": {
        source: "iana",
        extensions: ["123"]
      },
      "application/vnd.lotus-approach": {
        source: "iana",
        extensions: ["apr"]
      },
      "application/vnd.lotus-freelance": {
        source: "iana",
        extensions: ["pre"]
      },
      "application/vnd.lotus-notes": {
        source: "iana",
        extensions: ["nsf"]
      },
      "application/vnd.lotus-organizer": {
        source: "iana",
        extensions: ["org"]
      },
      "application/vnd.lotus-screencam": {
        source: "iana",
        extensions: ["scm"]
      },
      "application/vnd.lotus-wordpro": {
        source: "iana",
        extensions: ["lwp"]
      },
      "application/vnd.macports.portpkg": {
        source: "iana",
        extensions: ["portpkg"]
      },
      "application/vnd.mapbox-vector-tile": {
        source: "iana",
        extensions: ["mvt"]
      },
      "application/vnd.marlin.drm.actiontoken+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.marlin.drm.conftoken+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.marlin.drm.license+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.marlin.drm.mdcf": {
        source: "iana"
      },
      "application/vnd.mason+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.maxar.archive.3tz+zip": {
        source: "iana",
        compressible: false
      },
      "application/vnd.maxmind.maxmind-db": {
        source: "iana"
      },
      "application/vnd.mcd": {
        source: "iana",
        extensions: ["mcd"]
      },
      "application/vnd.medcalcdata": {
        source: "iana",
        extensions: ["mc1"]
      },
      "application/vnd.mediastation.cdkey": {
        source: "iana",
        extensions: ["cdkey"]
      },
      "application/vnd.meridian-slingshot": {
        source: "iana"
      },
      "application/vnd.mfer": {
        source: "iana",
        extensions: ["mwf"]
      },
      "application/vnd.mfmp": {
        source: "iana",
        extensions: ["mfm"]
      },
      "application/vnd.micro+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.micrografx.flo": {
        source: "iana",
        extensions: ["flo"]
      },
      "application/vnd.micrografx.igx": {
        source: "iana",
        extensions: ["igx"]
      },
      "application/vnd.microsoft.portable-executable": {
        source: "iana"
      },
      "application/vnd.microsoft.windows.thumbnail-cache": {
        source: "iana"
      },
      "application/vnd.miele+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.mif": {
        source: "iana",
        extensions: ["mif"]
      },
      "application/vnd.minisoft-hp3000-save": {
        source: "iana"
      },
      "application/vnd.mitsubishi.misty-guard.trustweb": {
        source: "iana"
      },
      "application/vnd.mobius.daf": {
        source: "iana",
        extensions: ["daf"]
      },
      "application/vnd.mobius.dis": {
        source: "iana",
        extensions: ["dis"]
      },
      "application/vnd.mobius.mbk": {
        source: "iana",
        extensions: ["mbk"]
      },
      "application/vnd.mobius.mqy": {
        source: "iana",
        extensions: ["mqy"]
      },
      "application/vnd.mobius.msl": {
        source: "iana",
        extensions: ["msl"]
      },
      "application/vnd.mobius.plc": {
        source: "iana",
        extensions: ["plc"]
      },
      "application/vnd.mobius.txf": {
        source: "iana",
        extensions: ["txf"]
      },
      "application/vnd.mophun.application": {
        source: "iana",
        extensions: ["mpn"]
      },
      "application/vnd.mophun.certificate": {
        source: "iana",
        extensions: ["mpc"]
      },
      "application/vnd.motorola.flexsuite": {
        source: "iana"
      },
      "application/vnd.motorola.flexsuite.adsi": {
        source: "iana"
      },
      "application/vnd.motorola.flexsuite.fis": {
        source: "iana"
      },
      "application/vnd.motorola.flexsuite.gotap": {
        source: "iana"
      },
      "application/vnd.motorola.flexsuite.kmr": {
        source: "iana"
      },
      "application/vnd.motorola.flexsuite.ttc": {
        source: "iana"
      },
      "application/vnd.motorola.flexsuite.wem": {
        source: "iana"
      },
      "application/vnd.motorola.iprm": {
        source: "iana"
      },
      "application/vnd.mozilla.xul+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xul"]
      },
      "application/vnd.ms-3mfdocument": {
        source: "iana"
      },
      "application/vnd.ms-artgalry": {
        source: "iana",
        extensions: ["cil"]
      },
      "application/vnd.ms-asf": {
        source: "iana"
      },
      "application/vnd.ms-cab-compressed": {
        source: "iana",
        extensions: ["cab"]
      },
      "application/vnd.ms-color.iccprofile": {
        source: "apache"
      },
      "application/vnd.ms-excel": {
        source: "iana",
        compressible: false,
        extensions: ["xls", "xlm", "xla", "xlc", "xlt", "xlw"]
      },
      "application/vnd.ms-excel.addin.macroenabled.12": {
        source: "iana",
        extensions: ["xlam"]
      },
      "application/vnd.ms-excel.sheet.binary.macroenabled.12": {
        source: "iana",
        extensions: ["xlsb"]
      },
      "application/vnd.ms-excel.sheet.macroenabled.12": {
        source: "iana",
        extensions: ["xlsm"]
      },
      "application/vnd.ms-excel.template.macroenabled.12": {
        source: "iana",
        extensions: ["xltm"]
      },
      "application/vnd.ms-fontobject": {
        source: "iana",
        compressible: true,
        extensions: ["eot"]
      },
      "application/vnd.ms-htmlhelp": {
        source: "iana",
        extensions: ["chm"]
      },
      "application/vnd.ms-ims": {
        source: "iana",
        extensions: ["ims"]
      },
      "application/vnd.ms-lrm": {
        source: "iana",
        extensions: ["lrm"]
      },
      "application/vnd.ms-office.activex+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ms-officetheme": {
        source: "iana",
        extensions: ["thmx"]
      },
      "application/vnd.ms-opentype": {
        source: "apache",
        compressible: true
      },
      "application/vnd.ms-outlook": {
        compressible: false,
        extensions: ["msg"]
      },
      "application/vnd.ms-package.obfuscated-opentype": {
        source: "apache"
      },
      "application/vnd.ms-pki.seccat": {
        source: "apache",
        extensions: ["cat"]
      },
      "application/vnd.ms-pki.stl": {
        source: "apache",
        extensions: ["stl"]
      },
      "application/vnd.ms-playready.initiator+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ms-powerpoint": {
        source: "iana",
        compressible: false,
        extensions: ["ppt", "pps", "pot"]
      },
      "application/vnd.ms-powerpoint.addin.macroenabled.12": {
        source: "iana",
        extensions: ["ppam"]
      },
      "application/vnd.ms-powerpoint.presentation.macroenabled.12": {
        source: "iana",
        extensions: ["pptm"]
      },
      "application/vnd.ms-powerpoint.slide.macroenabled.12": {
        source: "iana",
        extensions: ["sldm"]
      },
      "application/vnd.ms-powerpoint.slideshow.macroenabled.12": {
        source: "iana",
        extensions: ["ppsm"]
      },
      "application/vnd.ms-powerpoint.template.macroenabled.12": {
        source: "iana",
        extensions: ["potm"]
      },
      "application/vnd.ms-printdevicecapabilities+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ms-printing.printticket+xml": {
        source: "apache",
        compressible: true
      },
      "application/vnd.ms-printschematicket+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ms-project": {
        source: "iana",
        extensions: ["mpp", "mpt"]
      },
      "application/vnd.ms-tnef": {
        source: "iana"
      },
      "application/vnd.ms-windows.devicepairing": {
        source: "iana"
      },
      "application/vnd.ms-windows.nwprinting.oob": {
        source: "iana"
      },
      "application/vnd.ms-windows.printerpairing": {
        source: "iana"
      },
      "application/vnd.ms-windows.wsd.oob": {
        source: "iana"
      },
      "application/vnd.ms-wmdrm.lic-chlg-req": {
        source: "iana"
      },
      "application/vnd.ms-wmdrm.lic-resp": {
        source: "iana"
      },
      "application/vnd.ms-wmdrm.meter-chlg-req": {
        source: "iana"
      },
      "application/vnd.ms-wmdrm.meter-resp": {
        source: "iana"
      },
      "application/vnd.ms-word.document.macroenabled.12": {
        source: "iana",
        extensions: ["docm"]
      },
      "application/vnd.ms-word.template.macroenabled.12": {
        source: "iana",
        extensions: ["dotm"]
      },
      "application/vnd.ms-works": {
        source: "iana",
        extensions: ["wps", "wks", "wcm", "wdb"]
      },
      "application/vnd.ms-wpl": {
        source: "iana",
        extensions: ["wpl"]
      },
      "application/vnd.ms-xpsdocument": {
        source: "iana",
        compressible: false,
        extensions: ["xps"]
      },
      "application/vnd.msa-disk-image": {
        source: "iana"
      },
      "application/vnd.mseq": {
        source: "iana",
        extensions: ["mseq"]
      },
      "application/vnd.msign": {
        source: "iana"
      },
      "application/vnd.multiad.creator": {
        source: "iana"
      },
      "application/vnd.multiad.creator.cif": {
        source: "iana"
      },
      "application/vnd.music-niff": {
        source: "iana"
      },
      "application/vnd.musician": {
        source: "iana",
        extensions: ["mus"]
      },
      "application/vnd.muvee.style": {
        source: "iana",
        extensions: ["msty"]
      },
      "application/vnd.mynfc": {
        source: "iana",
        extensions: ["taglet"]
      },
      "application/vnd.nacamar.ybrid+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.ncd.control": {
        source: "iana"
      },
      "application/vnd.ncd.reference": {
        source: "iana"
      },
      "application/vnd.nearst.inv+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.nebumind.line": {
        source: "iana"
      },
      "application/vnd.nervana": {
        source: "iana"
      },
      "application/vnd.netfpx": {
        source: "iana"
      },
      "application/vnd.neurolanguage.nlu": {
        source: "iana",
        extensions: ["nlu"]
      },
      "application/vnd.nimn": {
        source: "iana"
      },
      "application/vnd.nintendo.nitro.rom": {
        source: "iana"
      },
      "application/vnd.nintendo.snes.rom": {
        source: "iana"
      },
      "application/vnd.nitf": {
        source: "iana",
        extensions: ["ntf", "nitf"]
      },
      "application/vnd.noblenet-directory": {
        source: "iana",
        extensions: ["nnd"]
      },
      "application/vnd.noblenet-sealer": {
        source: "iana",
        extensions: ["nns"]
      },
      "application/vnd.noblenet-web": {
        source: "iana",
        extensions: ["nnw"]
      },
      "application/vnd.nokia.catalogs": {
        source: "iana"
      },
      "application/vnd.nokia.conml+wbxml": {
        source: "iana"
      },
      "application/vnd.nokia.conml+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.nokia.iptv.config+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.nokia.isds-radio-presets": {
        source: "iana"
      },
      "application/vnd.nokia.landmark+wbxml": {
        source: "iana"
      },
      "application/vnd.nokia.landmark+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.nokia.landmarkcollection+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.nokia.n-gage.ac+xml": {
        source: "iana",
        compressible: true,
        extensions: ["ac"]
      },
      "application/vnd.nokia.n-gage.data": {
        source: "iana",
        extensions: ["ngdat"]
      },
      "application/vnd.nokia.n-gage.symbian.install": {
        source: "iana",
        extensions: ["n-gage"]
      },
      "application/vnd.nokia.ncd": {
        source: "iana"
      },
      "application/vnd.nokia.pcd+wbxml": {
        source: "iana"
      },
      "application/vnd.nokia.pcd+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.nokia.radio-preset": {
        source: "iana",
        extensions: ["rpst"]
      },
      "application/vnd.nokia.radio-presets": {
        source: "iana",
        extensions: ["rpss"]
      },
      "application/vnd.novadigm.edm": {
        source: "iana",
        extensions: ["edm"]
      },
      "application/vnd.novadigm.edx": {
        source: "iana",
        extensions: ["edx"]
      },
      "application/vnd.novadigm.ext": {
        source: "iana",
        extensions: ["ext"]
      },
      "application/vnd.ntt-local.content-share": {
        source: "iana"
      },
      "application/vnd.ntt-local.file-transfer": {
        source: "iana"
      },
      "application/vnd.ntt-local.ogw_remote-access": {
        source: "iana"
      },
      "application/vnd.ntt-local.sip-ta_remote": {
        source: "iana"
      },
      "application/vnd.ntt-local.sip-ta_tcp_stream": {
        source: "iana"
      },
      "application/vnd.oasis.opendocument.chart": {
        source: "iana",
        extensions: ["odc"]
      },
      "application/vnd.oasis.opendocument.chart-template": {
        source: "iana",
        extensions: ["otc"]
      },
      "application/vnd.oasis.opendocument.database": {
        source: "iana",
        extensions: ["odb"]
      },
      "application/vnd.oasis.opendocument.formula": {
        source: "iana",
        extensions: ["odf"]
      },
      "application/vnd.oasis.opendocument.formula-template": {
        source: "iana",
        extensions: ["odft"]
      },
      "application/vnd.oasis.opendocument.graphics": {
        source: "iana",
        compressible: false,
        extensions: ["odg"]
      },
      "application/vnd.oasis.opendocument.graphics-template": {
        source: "iana",
        extensions: ["otg"]
      },
      "application/vnd.oasis.opendocument.image": {
        source: "iana",
        extensions: ["odi"]
      },
      "application/vnd.oasis.opendocument.image-template": {
        source: "iana",
        extensions: ["oti"]
      },
      "application/vnd.oasis.opendocument.presentation": {
        source: "iana",
        compressible: false,
        extensions: ["odp"]
      },
      "application/vnd.oasis.opendocument.presentation-template": {
        source: "iana",
        extensions: ["otp"]
      },
      "application/vnd.oasis.opendocument.spreadsheet": {
        source: "iana",
        compressible: false,
        extensions: ["ods"]
      },
      "application/vnd.oasis.opendocument.spreadsheet-template": {
        source: "iana",
        extensions: ["ots"]
      },
      "application/vnd.oasis.opendocument.text": {
        source: "iana",
        compressible: false,
        extensions: ["odt"]
      },
      "application/vnd.oasis.opendocument.text-master": {
        source: "iana",
        extensions: ["odm"]
      },
      "application/vnd.oasis.opendocument.text-template": {
        source: "iana",
        extensions: ["ott"]
      },
      "application/vnd.oasis.opendocument.text-web": {
        source: "iana",
        extensions: ["oth"]
      },
      "application/vnd.obn": {
        source: "iana"
      },
      "application/vnd.ocf+cbor": {
        source: "iana"
      },
      "application/vnd.oci.image.manifest.v1+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oftn.l10n+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oipf.contentaccessdownload+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oipf.contentaccessstreaming+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oipf.cspg-hexbinary": {
        source: "iana"
      },
      "application/vnd.oipf.dae.svg+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oipf.dae.xhtml+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oipf.mippvcontrolmessage+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oipf.pae.gem": {
        source: "iana"
      },
      "application/vnd.oipf.spdiscovery+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oipf.spdlist+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oipf.ueprofile+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oipf.userprofile+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.olpc-sugar": {
        source: "iana",
        extensions: ["xo"]
      },
      "application/vnd.oma-scws-config": {
        source: "iana"
      },
      "application/vnd.oma-scws-http-request": {
        source: "iana"
      },
      "application/vnd.oma-scws-http-response": {
        source: "iana"
      },
      "application/vnd.oma.bcast.associated-procedure-parameter+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.bcast.drm-trigger+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.bcast.imd+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.bcast.ltkm": {
        source: "iana"
      },
      "application/vnd.oma.bcast.notification+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.bcast.provisioningtrigger": {
        source: "iana"
      },
      "application/vnd.oma.bcast.sgboot": {
        source: "iana"
      },
      "application/vnd.oma.bcast.sgdd+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.bcast.sgdu": {
        source: "iana"
      },
      "application/vnd.oma.bcast.simple-symbol-container": {
        source: "iana"
      },
      "application/vnd.oma.bcast.smartcard-trigger+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.bcast.sprov+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.bcast.stkm": {
        source: "iana"
      },
      "application/vnd.oma.cab-address-book+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.cab-feature-handler+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.cab-pcc+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.cab-subs-invite+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.cab-user-prefs+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.dcd": {
        source: "iana"
      },
      "application/vnd.oma.dcdc": {
        source: "iana"
      },
      "application/vnd.oma.dd2+xml": {
        source: "iana",
        compressible: true,
        extensions: ["dd2"]
      },
      "application/vnd.oma.drm.risd+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.group-usage-list+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.lwm2m+cbor": {
        source: "iana"
      },
      "application/vnd.oma.lwm2m+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.lwm2m+tlv": {
        source: "iana"
      },
      "application/vnd.oma.pal+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.poc.detailed-progress-report+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.poc.final-report+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.poc.groups+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.poc.invocation-descriptor+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.poc.optimized-progress-report+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.push": {
        source: "iana"
      },
      "application/vnd.oma.scidm.messages+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oma.xcap-directory+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.omads-email+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/vnd.omads-file+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/vnd.omads-folder+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/vnd.omaloc-supl-init": {
        source: "iana"
      },
      "application/vnd.onepager": {
        source: "iana"
      },
      "application/vnd.onepagertamp": {
        source: "iana"
      },
      "application/vnd.onepagertamx": {
        source: "iana"
      },
      "application/vnd.onepagertat": {
        source: "iana"
      },
      "application/vnd.onepagertatp": {
        source: "iana"
      },
      "application/vnd.onepagertatx": {
        source: "iana"
      },
      "application/vnd.openblox.game+xml": {
        source: "iana",
        compressible: true,
        extensions: ["obgx"]
      },
      "application/vnd.openblox.game-binary": {
        source: "iana"
      },
      "application/vnd.openeye.oeb": {
        source: "iana"
      },
      "application/vnd.openofficeorg.extension": {
        source: "apache",
        extensions: ["oxt"]
      },
      "application/vnd.openstreetmap.data+xml": {
        source: "iana",
        compressible: true,
        extensions: ["osm"]
      },
      "application/vnd.opentimestamps.ots": {
        source: "iana"
      },
      "application/vnd.openxmlformats-officedocument.custom-properties+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.customxmlproperties+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.drawing+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.drawingml.chart+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.drawingml.chartshapes+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.drawingml.diagramcolors+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.drawingml.diagramdata+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.drawingml.diagramlayout+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.drawingml.diagramstyle+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.extended-properties+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.commentauthors+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.comments+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.handoutmaster+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.notesmaster+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.notesslide+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.presentation": {
        source: "iana",
        compressible: false,
        extensions: ["pptx"]
      },
      "application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.presprops+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.slide": {
        source: "iana",
        extensions: ["sldx"]
      },
      "application/vnd.openxmlformats-officedocument.presentationml.slide+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.slidelayout+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.slidemaster+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.slideshow": {
        source: "iana",
        extensions: ["ppsx"]
      },
      "application/vnd.openxmlformats-officedocument.presentationml.slideshow.main+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.slideupdateinfo+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.tablestyles+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.tags+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.template": {
        source: "iana",
        extensions: ["potx"]
      },
      "application/vnd.openxmlformats-officedocument.presentationml.template.main+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.presentationml.viewprops+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.calcchain+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.chartsheet+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.comments+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.connections+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.dialogsheet+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.externallink+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcachedefinition+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcacherecords+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.pivottable+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.querytable+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.revisionheaders+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.revisionlog+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sharedstrings+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
        source: "iana",
        compressible: false,
        extensions: ["xlsx"]
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheetmetadata+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.table+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.tablesinglecells+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.template": {
        source: "iana",
        extensions: ["xltx"]
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.template.main+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.usernames+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.volatiledependencies+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.theme+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.themeoverride+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.vmldrawing": {
        source: "iana"
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.comments+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
        source: "iana",
        compressible: false,
        extensions: ["docx"]
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document.glossary+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.endnotes+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.fonttable+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.footnotes+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.template": {
        source: "iana",
        extensions: ["dotx"]
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.template.main+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-officedocument.wordprocessingml.websettings+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-package.core-properties+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-package.digital-signature-xmlsignature+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.openxmlformats-package.relationships+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oracle.resource+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.orange.indata": {
        source: "iana"
      },
      "application/vnd.osa.netdeploy": {
        source: "iana"
      },
      "application/vnd.osgeo.mapguide.package": {
        source: "iana",
        extensions: ["mgp"]
      },
      "application/vnd.osgi.bundle": {
        source: "iana"
      },
      "application/vnd.osgi.dp": {
        source: "iana",
        extensions: ["dp"]
      },
      "application/vnd.osgi.subsystem": {
        source: "iana",
        extensions: ["esa"]
      },
      "application/vnd.otps.ct-kip+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.oxli.countgraph": {
        source: "iana"
      },
      "application/vnd.pagerduty+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.palm": {
        source: "iana",
        extensions: ["pdb", "pqa", "oprc"]
      },
      "application/vnd.panoply": {
        source: "iana"
      },
      "application/vnd.paos.xml": {
        source: "iana"
      },
      "application/vnd.patentdive": {
        source: "iana"
      },
      "application/vnd.patientecommsdoc": {
        source: "iana"
      },
      "application/vnd.pawaafile": {
        source: "iana",
        extensions: ["paw"]
      },
      "application/vnd.pcos": {
        source: "iana"
      },
      "application/vnd.pg.format": {
        source: "iana",
        extensions: ["str"]
      },
      "application/vnd.pg.osasli": {
        source: "iana",
        extensions: ["ei6"]
      },
      "application/vnd.piaccess.application-licence": {
        source: "iana"
      },
      "application/vnd.picsel": {
        source: "iana",
        extensions: ["efif"]
      },
      "application/vnd.pmi.widget": {
        source: "iana",
        extensions: ["wg"]
      },
      "application/vnd.poc.group-advertisement+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.pocketlearn": {
        source: "iana",
        extensions: ["plf"]
      },
      "application/vnd.powerbuilder6": {
        source: "iana",
        extensions: ["pbd"]
      },
      "application/vnd.powerbuilder6-s": {
        source: "iana"
      },
      "application/vnd.powerbuilder7": {
        source: "iana"
      },
      "application/vnd.powerbuilder7-s": {
        source: "iana"
      },
      "application/vnd.powerbuilder75": {
        source: "iana"
      },
      "application/vnd.powerbuilder75-s": {
        source: "iana"
      },
      "application/vnd.preminet": {
        source: "iana"
      },
      "application/vnd.previewsystems.box": {
        source: "iana",
        extensions: ["box"]
      },
      "application/vnd.proteus.magazine": {
        source: "iana",
        extensions: ["mgz"]
      },
      "application/vnd.psfs": {
        source: "iana"
      },
      "application/vnd.publishare-delta-tree": {
        source: "iana",
        extensions: ["qps"]
      },
      "application/vnd.pvi.ptid1": {
        source: "iana",
        extensions: ["ptid"]
      },
      "application/vnd.pwg-multiplexed": {
        source: "iana"
      },
      "application/vnd.pwg-xhtml-print+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.qualcomm.brew-app-res": {
        source: "iana"
      },
      "application/vnd.quarantainenet": {
        source: "iana"
      },
      "application/vnd.quark.quarkxpress": {
        source: "iana",
        extensions: ["qxd", "qxt", "qwd", "qwt", "qxl", "qxb"]
      },
      "application/vnd.quobject-quoxdocument": {
        source: "iana"
      },
      "application/vnd.radisys.moml+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-audit+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-audit-conf+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-audit-conn+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-audit-dialog+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-audit-stream+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-conf+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-dialog+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-dialog-base+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-dialog-fax-detect+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-dialog-fax-sendrecv+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-dialog-group+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-dialog-speech+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.radisys.msml-dialog-transform+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.rainstor.data": {
        source: "iana"
      },
      "application/vnd.rapid": {
        source: "iana"
      },
      "application/vnd.rar": {
        source: "iana",
        extensions: ["rar"]
      },
      "application/vnd.realvnc.bed": {
        source: "iana",
        extensions: ["bed"]
      },
      "application/vnd.recordare.musicxml": {
        source: "iana",
        extensions: ["mxl"]
      },
      "application/vnd.recordare.musicxml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["musicxml"]
      },
      "application/vnd.renlearn.rlprint": {
        source: "iana"
      },
      "application/vnd.resilient.logic": {
        source: "iana"
      },
      "application/vnd.restful+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.rig.cryptonote": {
        source: "iana",
        extensions: ["cryptonote"]
      },
      "application/vnd.rim.cod": {
        source: "apache",
        extensions: ["cod"]
      },
      "application/vnd.rn-realmedia": {
        source: "apache",
        extensions: ["rm"]
      },
      "application/vnd.rn-realmedia-vbr": {
        source: "apache",
        extensions: ["rmvb"]
      },
      "application/vnd.route66.link66+xml": {
        source: "iana",
        compressible: true,
        extensions: ["link66"]
      },
      "application/vnd.rs-274x": {
        source: "iana"
      },
      "application/vnd.ruckus.download": {
        source: "iana"
      },
      "application/vnd.s3sms": {
        source: "iana"
      },
      "application/vnd.sailingtracker.track": {
        source: "iana",
        extensions: ["st"]
      },
      "application/vnd.sar": {
        source: "iana"
      },
      "application/vnd.sbm.cid": {
        source: "iana"
      },
      "application/vnd.sbm.mid2": {
        source: "iana"
      },
      "application/vnd.scribus": {
        source: "iana"
      },
      "application/vnd.sealed.3df": {
        source: "iana"
      },
      "application/vnd.sealed.csf": {
        source: "iana"
      },
      "application/vnd.sealed.doc": {
        source: "iana"
      },
      "application/vnd.sealed.eml": {
        source: "iana"
      },
      "application/vnd.sealed.mht": {
        source: "iana"
      },
      "application/vnd.sealed.net": {
        source: "iana"
      },
      "application/vnd.sealed.ppt": {
        source: "iana"
      },
      "application/vnd.sealed.tiff": {
        source: "iana"
      },
      "application/vnd.sealed.xls": {
        source: "iana"
      },
      "application/vnd.sealedmedia.softseal.html": {
        source: "iana"
      },
      "application/vnd.sealedmedia.softseal.pdf": {
        source: "iana"
      },
      "application/vnd.seemail": {
        source: "iana",
        extensions: ["see"]
      },
      "application/vnd.seis+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.sema": {
        source: "iana",
        extensions: ["sema"]
      },
      "application/vnd.semd": {
        source: "iana",
        extensions: ["semd"]
      },
      "application/vnd.semf": {
        source: "iana",
        extensions: ["semf"]
      },
      "application/vnd.shade-save-file": {
        source: "iana"
      },
      "application/vnd.shana.informed.formdata": {
        source: "iana",
        extensions: ["ifm"]
      },
      "application/vnd.shana.informed.formtemplate": {
        source: "iana",
        extensions: ["itp"]
      },
      "application/vnd.shana.informed.interchange": {
        source: "iana",
        extensions: ["iif"]
      },
      "application/vnd.shana.informed.package": {
        source: "iana",
        extensions: ["ipk"]
      },
      "application/vnd.shootproof+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.shopkick+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.shp": {
        source: "iana"
      },
      "application/vnd.shx": {
        source: "iana"
      },
      "application/vnd.sigrok.session": {
        source: "iana"
      },
      "application/vnd.simtech-mindmapper": {
        source: "iana",
        extensions: ["twd", "twds"]
      },
      "application/vnd.siren+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.smaf": {
        source: "iana",
        extensions: ["mmf"]
      },
      "application/vnd.smart.notebook": {
        source: "iana"
      },
      "application/vnd.smart.teacher": {
        source: "iana",
        extensions: ["teacher"]
      },
      "application/vnd.snesdev-page-table": {
        source: "iana"
      },
      "application/vnd.software602.filler.form+xml": {
        source: "iana",
        compressible: true,
        extensions: ["fo"]
      },
      "application/vnd.software602.filler.form-xml-zip": {
        source: "iana"
      },
      "application/vnd.solent.sdkm+xml": {
        source: "iana",
        compressible: true,
        extensions: ["sdkm", "sdkd"]
      },
      "application/vnd.spotfire.dxp": {
        source: "iana",
        extensions: ["dxp"]
      },
      "application/vnd.spotfire.sfs": {
        source: "iana",
        extensions: ["sfs"]
      },
      "application/vnd.sqlite3": {
        source: "iana"
      },
      "application/vnd.sss-cod": {
        source: "iana"
      },
      "application/vnd.sss-dtf": {
        source: "iana"
      },
      "application/vnd.sss-ntf": {
        source: "iana"
      },
      "application/vnd.stardivision.calc": {
        source: "apache",
        extensions: ["sdc"]
      },
      "application/vnd.stardivision.draw": {
        source: "apache",
        extensions: ["sda"]
      },
      "application/vnd.stardivision.impress": {
        source: "apache",
        extensions: ["sdd"]
      },
      "application/vnd.stardivision.math": {
        source: "apache",
        extensions: ["smf"]
      },
      "application/vnd.stardivision.writer": {
        source: "apache",
        extensions: ["sdw", "vor"]
      },
      "application/vnd.stardivision.writer-global": {
        source: "apache",
        extensions: ["sgl"]
      },
      "application/vnd.stepmania.package": {
        source: "iana",
        extensions: ["smzip"]
      },
      "application/vnd.stepmania.stepchart": {
        source: "iana",
        extensions: ["sm"]
      },
      "application/vnd.street-stream": {
        source: "iana"
      },
      "application/vnd.sun.wadl+xml": {
        source: "iana",
        compressible: true,
        extensions: ["wadl"]
      },
      "application/vnd.sun.xml.calc": {
        source: "apache",
        extensions: ["sxc"]
      },
      "application/vnd.sun.xml.calc.template": {
        source: "apache",
        extensions: ["stc"]
      },
      "application/vnd.sun.xml.draw": {
        source: "apache",
        extensions: ["sxd"]
      },
      "application/vnd.sun.xml.draw.template": {
        source: "apache",
        extensions: ["std"]
      },
      "application/vnd.sun.xml.impress": {
        source: "apache",
        extensions: ["sxi"]
      },
      "application/vnd.sun.xml.impress.template": {
        source: "apache",
        extensions: ["sti"]
      },
      "application/vnd.sun.xml.math": {
        source: "apache",
        extensions: ["sxm"]
      },
      "application/vnd.sun.xml.writer": {
        source: "apache",
        extensions: ["sxw"]
      },
      "application/vnd.sun.xml.writer.global": {
        source: "apache",
        extensions: ["sxg"]
      },
      "application/vnd.sun.xml.writer.template": {
        source: "apache",
        extensions: ["stw"]
      },
      "application/vnd.sus-calendar": {
        source: "iana",
        extensions: ["sus", "susp"]
      },
      "application/vnd.svd": {
        source: "iana",
        extensions: ["svd"]
      },
      "application/vnd.swiftview-ics": {
        source: "iana"
      },
      "application/vnd.sycle+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.syft+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.symbian.install": {
        source: "apache",
        extensions: ["sis", "sisx"]
      },
      "application/vnd.syncml+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: ["xsm"]
      },
      "application/vnd.syncml.dm+wbxml": {
        source: "iana",
        charset: "UTF-8",
        extensions: ["bdm"]
      },
      "application/vnd.syncml.dm+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: ["xdm"]
      },
      "application/vnd.syncml.dm.notification": {
        source: "iana"
      },
      "application/vnd.syncml.dmddf+wbxml": {
        source: "iana"
      },
      "application/vnd.syncml.dmddf+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: ["ddf"]
      },
      "application/vnd.syncml.dmtnds+wbxml": {
        source: "iana"
      },
      "application/vnd.syncml.dmtnds+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
      },
      "application/vnd.syncml.ds.notification": {
        source: "iana"
      },
      "application/vnd.tableschema+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.tao.intent-module-archive": {
        source: "iana",
        extensions: ["tao"]
      },
      "application/vnd.tcpdump.pcap": {
        source: "iana",
        extensions: ["pcap", "cap", "dmp"]
      },
      "application/vnd.think-cell.ppttc+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.tmd.mediaflex.api+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.tml": {
        source: "iana"
      },
      "application/vnd.tmobile-livetv": {
        source: "iana",
        extensions: ["tmo"]
      },
      "application/vnd.tri.onesource": {
        source: "iana"
      },
      "application/vnd.trid.tpt": {
        source: "iana",
        extensions: ["tpt"]
      },
      "application/vnd.triscape.mxs": {
        source: "iana",
        extensions: ["mxs"]
      },
      "application/vnd.trueapp": {
        source: "iana",
        extensions: ["tra"]
      },
      "application/vnd.truedoc": {
        source: "iana"
      },
      "application/vnd.ubisoft.webplayer": {
        source: "iana"
      },
      "application/vnd.ufdl": {
        source: "iana",
        extensions: ["ufd", "ufdl"]
      },
      "application/vnd.uiq.theme": {
        source: "iana",
        extensions: ["utz"]
      },
      "application/vnd.umajin": {
        source: "iana",
        extensions: ["umj"]
      },
      "application/vnd.unity": {
        source: "iana",
        extensions: ["unityweb"]
      },
      "application/vnd.uoml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["uoml"]
      },
      "application/vnd.uplanet.alert": {
        source: "iana"
      },
      "application/vnd.uplanet.alert-wbxml": {
        source: "iana"
      },
      "application/vnd.uplanet.bearer-choice": {
        source: "iana"
      },
      "application/vnd.uplanet.bearer-choice-wbxml": {
        source: "iana"
      },
      "application/vnd.uplanet.cacheop": {
        source: "iana"
      },
      "application/vnd.uplanet.cacheop-wbxml": {
        source: "iana"
      },
      "application/vnd.uplanet.channel": {
        source: "iana"
      },
      "application/vnd.uplanet.channel-wbxml": {
        source: "iana"
      },
      "application/vnd.uplanet.list": {
        source: "iana"
      },
      "application/vnd.uplanet.list-wbxml": {
        source: "iana"
      },
      "application/vnd.uplanet.listcmd": {
        source: "iana"
      },
      "application/vnd.uplanet.listcmd-wbxml": {
        source: "iana"
      },
      "application/vnd.uplanet.signal": {
        source: "iana"
      },
      "application/vnd.uri-map": {
        source: "iana"
      },
      "application/vnd.valve.source.material": {
        source: "iana"
      },
      "application/vnd.vcx": {
        source: "iana",
        extensions: ["vcx"]
      },
      "application/vnd.vd-study": {
        source: "iana"
      },
      "application/vnd.vectorworks": {
        source: "iana"
      },
      "application/vnd.vel+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.verimatrix.vcas": {
        source: "iana"
      },
      "application/vnd.veritone.aion+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.veryant.thin": {
        source: "iana"
      },
      "application/vnd.ves.encrypted": {
        source: "iana"
      },
      "application/vnd.vidsoft.vidconference": {
        source: "iana"
      },
      "application/vnd.visio": {
        source: "iana",
        extensions: ["vsd", "vst", "vss", "vsw"]
      },
      "application/vnd.visionary": {
        source: "iana",
        extensions: ["vis"]
      },
      "application/vnd.vividence.scriptfile": {
        source: "iana"
      },
      "application/vnd.vsf": {
        source: "iana",
        extensions: ["vsf"]
      },
      "application/vnd.wap.sic": {
        source: "iana"
      },
      "application/vnd.wap.slc": {
        source: "iana"
      },
      "application/vnd.wap.wbxml": {
        source: "iana",
        charset: "UTF-8",
        extensions: ["wbxml"]
      },
      "application/vnd.wap.wmlc": {
        source: "iana",
        extensions: ["wmlc"]
      },
      "application/vnd.wap.wmlscriptc": {
        source: "iana",
        extensions: ["wmlsc"]
      },
      "application/vnd.webturbo": {
        source: "iana",
        extensions: ["wtb"]
      },
      "application/vnd.wfa.dpp": {
        source: "iana"
      },
      "application/vnd.wfa.p2p": {
        source: "iana"
      },
      "application/vnd.wfa.wsc": {
        source: "iana"
      },
      "application/vnd.windows.devicepairing": {
        source: "iana"
      },
      "application/vnd.wmc": {
        source: "iana"
      },
      "application/vnd.wmf.bootstrap": {
        source: "iana"
      },
      "application/vnd.wolfram.mathematica": {
        source: "iana"
      },
      "application/vnd.wolfram.mathematica.package": {
        source: "iana"
      },
      "application/vnd.wolfram.player": {
        source: "iana",
        extensions: ["nbp"]
      },
      "application/vnd.wordperfect": {
        source: "iana",
        extensions: ["wpd"]
      },
      "application/vnd.wqd": {
        source: "iana",
        extensions: ["wqd"]
      },
      "application/vnd.wrq-hp3000-labelled": {
        source: "iana"
      },
      "application/vnd.wt.stf": {
        source: "iana",
        extensions: ["stf"]
      },
      "application/vnd.wv.csp+wbxml": {
        source: "iana"
      },
      "application/vnd.wv.csp+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.wv.ssp+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.xacml+json": {
        source: "iana",
        compressible: true
      },
      "application/vnd.xara": {
        source: "iana",
        extensions: ["xar"]
      },
      "application/vnd.xfdl": {
        source: "iana",
        extensions: ["xfdl"]
      },
      "application/vnd.xfdl.webform": {
        source: "iana"
      },
      "application/vnd.xmi+xml": {
        source: "iana",
        compressible: true
      },
      "application/vnd.xmpie.cpkg": {
        source: "iana"
      },
      "application/vnd.xmpie.dpkg": {
        source: "iana"
      },
      "application/vnd.xmpie.plan": {
        source: "iana"
      },
      "application/vnd.xmpie.ppkg": {
        source: "iana"
      },
      "application/vnd.xmpie.xlim": {
        source: "iana"
      },
      "application/vnd.yamaha.hv-dic": {
        source: "iana",
        extensions: ["hvd"]
      },
      "application/vnd.yamaha.hv-script": {
        source: "iana",
        extensions: ["hvs"]
      },
      "application/vnd.yamaha.hv-voice": {
        source: "iana",
        extensions: ["hvp"]
      },
      "application/vnd.yamaha.openscoreformat": {
        source: "iana",
        extensions: ["osf"]
      },
      "application/vnd.yamaha.openscoreformat.osfpvg+xml": {
        source: "iana",
        compressible: true,
        extensions: ["osfpvg"]
      },
      "application/vnd.yamaha.remote-setup": {
        source: "iana"
      },
      "application/vnd.yamaha.smaf-audio": {
        source: "iana",
        extensions: ["saf"]
      },
      "application/vnd.yamaha.smaf-phrase": {
        source: "iana",
        extensions: ["spf"]
      },
      "application/vnd.yamaha.through-ngn": {
        source: "iana"
      },
      "application/vnd.yamaha.tunnel-udpencap": {
        source: "iana"
      },
      "application/vnd.yaoweme": {
        source: "iana"
      },
      "application/vnd.yellowriver-custom-menu": {
        source: "iana",
        extensions: ["cmp"]
      },
      "application/vnd.youtube.yt": {
        source: "iana"
      },
      "application/vnd.zul": {
        source: "iana",
        extensions: ["zir", "zirz"]
      },
      "application/vnd.zzazz.deck+xml": {
        source: "iana",
        compressible: true,
        extensions: ["zaz"]
      },
      "application/voicexml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["vxml"]
      },
      "application/voucher-cms+json": {
        source: "iana",
        compressible: true
      },
      "application/vq-rtcpxr": {
        source: "iana"
      },
      "application/wasm": {
        source: "iana",
        compressible: true,
        extensions: ["wasm"]
      },
      "application/watcherinfo+xml": {
        source: "iana",
        compressible: true,
        extensions: ["wif"]
      },
      "application/webpush-options+json": {
        source: "iana",
        compressible: true
      },
      "application/whoispp-query": {
        source: "iana"
      },
      "application/whoispp-response": {
        source: "iana"
      },
      "application/widget": {
        source: "iana",
        extensions: ["wgt"]
      },
      "application/winhlp": {
        source: "apache",
        extensions: ["hlp"]
      },
      "application/wita": {
        source: "iana"
      },
      "application/wordperfect5.1": {
        source: "iana"
      },
      "application/wsdl+xml": {
        source: "iana",
        compressible: true,
        extensions: ["wsdl"]
      },
      "application/wspolicy+xml": {
        source: "iana",
        compressible: true,
        extensions: ["wspolicy"]
      },
      "application/x-7z-compressed": {
        source: "apache",
        compressible: false,
        extensions: ["7z"]
      },
      "application/x-abiword": {
        source: "apache",
        extensions: ["abw"]
      },
      "application/x-ace-compressed": {
        source: "apache",
        extensions: ["ace"]
      },
      "application/x-amf": {
        source: "apache"
      },
      "application/x-apple-diskimage": {
        source: "apache",
        extensions: ["dmg"]
      },
      "application/x-arj": {
        compressible: false,
        extensions: ["arj"]
      },
      "application/x-authorware-bin": {
        source: "apache",
        extensions: ["aab", "x32", "u32", "vox"]
      },
      "application/x-authorware-map": {
        source: "apache",
        extensions: ["aam"]
      },
      "application/x-authorware-seg": {
        source: "apache",
        extensions: ["aas"]
      },
      "application/x-bcpio": {
        source: "apache",
        extensions: ["bcpio"]
      },
      "application/x-bdoc": {
        compressible: false,
        extensions: ["bdoc"]
      },
      "application/x-bittorrent": {
        source: "apache",
        extensions: ["torrent"]
      },
      "application/x-blorb": {
        source: "apache",
        extensions: ["blb", "blorb"]
      },
      "application/x-bzip": {
        source: "apache",
        compressible: false,
        extensions: ["bz"]
      },
      "application/x-bzip2": {
        source: "apache",
        compressible: false,
        extensions: ["bz2", "boz"]
      },
      "application/x-cbr": {
        source: "apache",
        extensions: ["cbr", "cba", "cbt", "cbz", "cb7"]
      },
      "application/x-cdlink": {
        source: "apache",
        extensions: ["vcd"]
      },
      "application/x-cfs-compressed": {
        source: "apache",
        extensions: ["cfs"]
      },
      "application/x-chat": {
        source: "apache",
        extensions: ["chat"]
      },
      "application/x-chess-pgn": {
        source: "apache",
        extensions: ["pgn"]
      },
      "application/x-chrome-extension": {
        extensions: ["crx"]
      },
      "application/x-cocoa": {
        source: "nginx",
        extensions: ["cco"]
      },
      "application/x-compress": {
        source: "apache"
      },
      "application/x-conference": {
        source: "apache",
        extensions: ["nsc"]
      },
      "application/x-cpio": {
        source: "apache",
        extensions: ["cpio"]
      },
      "application/x-csh": {
        source: "apache",
        extensions: ["csh"]
      },
      "application/x-deb": {
        compressible: false
      },
      "application/x-debian-package": {
        source: "apache",
        extensions: ["deb", "udeb"]
      },
      "application/x-dgc-compressed": {
        source: "apache",
        extensions: ["dgc"]
      },
      "application/x-director": {
        source: "apache",
        extensions: ["dir", "dcr", "dxr", "cst", "cct", "cxt", "w3d", "fgd", "swa"]
      },
      "application/x-doom": {
        source: "apache",
        extensions: ["wad"]
      },
      "application/x-dtbncx+xml": {
        source: "apache",
        compressible: true,
        extensions: ["ncx"]
      },
      "application/x-dtbook+xml": {
        source: "apache",
        compressible: true,
        extensions: ["dtb"]
      },
      "application/x-dtbresource+xml": {
        source: "apache",
        compressible: true,
        extensions: ["res"]
      },
      "application/x-dvi": {
        source: "apache",
        compressible: false,
        extensions: ["dvi"]
      },
      "application/x-envoy": {
        source: "apache",
        extensions: ["evy"]
      },
      "application/x-eva": {
        source: "apache",
        extensions: ["eva"]
      },
      "application/x-font-bdf": {
        source: "apache",
        extensions: ["bdf"]
      },
      "application/x-font-dos": {
        source: "apache"
      },
      "application/x-font-framemaker": {
        source: "apache"
      },
      "application/x-font-ghostscript": {
        source: "apache",
        extensions: ["gsf"]
      },
      "application/x-font-libgrx": {
        source: "apache"
      },
      "application/x-font-linux-psf": {
        source: "apache",
        extensions: ["psf"]
      },
      "application/x-font-pcf": {
        source: "apache",
        extensions: ["pcf"]
      },
      "application/x-font-snf": {
        source: "apache",
        extensions: ["snf"]
      },
      "application/x-font-speedo": {
        source: "apache"
      },
      "application/x-font-sunos-news": {
        source: "apache"
      },
      "application/x-font-type1": {
        source: "apache",
        extensions: ["pfa", "pfb", "pfm", "afm"]
      },
      "application/x-font-vfont": {
        source: "apache"
      },
      "application/x-freearc": {
        source: "apache",
        extensions: ["arc"]
      },
      "application/x-futuresplash": {
        source: "apache",
        extensions: ["spl"]
      },
      "application/x-gca-compressed": {
        source: "apache",
        extensions: ["gca"]
      },
      "application/x-glulx": {
        source: "apache",
        extensions: ["ulx"]
      },
      "application/x-gnumeric": {
        source: "apache",
        extensions: ["gnumeric"]
      },
      "application/x-gramps-xml": {
        source: "apache",
        extensions: ["gramps"]
      },
      "application/x-gtar": {
        source: "apache",
        extensions: ["gtar"]
      },
      "application/x-gzip": {
        source: "apache"
      },
      "application/x-hdf": {
        source: "apache",
        extensions: ["hdf"]
      },
      "application/x-httpd-php": {
        compressible: true,
        extensions: ["php"]
      },
      "application/x-install-instructions": {
        source: "apache",
        extensions: ["install"]
      },
      "application/x-iso9660-image": {
        source: "apache",
        extensions: ["iso"]
      },
      "application/x-iwork-keynote-sffkey": {
        extensions: ["key"]
      },
      "application/x-iwork-numbers-sffnumbers": {
        extensions: ["numbers"]
      },
      "application/x-iwork-pages-sffpages": {
        extensions: ["pages"]
      },
      "application/x-java-archive-diff": {
        source: "nginx",
        extensions: ["jardiff"]
      },
      "application/x-java-jnlp-file": {
        source: "apache",
        compressible: false,
        extensions: ["jnlp"]
      },
      "application/x-javascript": {
        compressible: true
      },
      "application/x-keepass2": {
        extensions: ["kdbx"]
      },
      "application/x-latex": {
        source: "apache",
        compressible: false,
        extensions: ["latex"]
      },
      "application/x-lua-bytecode": {
        extensions: ["luac"]
      },
      "application/x-lzh-compressed": {
        source: "apache",
        extensions: ["lzh", "lha"]
      },
      "application/x-makeself": {
        source: "nginx",
        extensions: ["run"]
      },
      "application/x-mie": {
        source: "apache",
        extensions: ["mie"]
      },
      "application/x-mobipocket-ebook": {
        source: "apache",
        extensions: ["prc", "mobi"]
      },
      "application/x-mpegurl": {
        compressible: false
      },
      "application/x-ms-application": {
        source: "apache",
        extensions: ["application"]
      },
      "application/x-ms-shortcut": {
        source: "apache",
        extensions: ["lnk"]
      },
      "application/x-ms-wmd": {
        source: "apache",
        extensions: ["wmd"]
      },
      "application/x-ms-wmz": {
        source: "apache",
        extensions: ["wmz"]
      },
      "application/x-ms-xbap": {
        source: "apache",
        extensions: ["xbap"]
      },
      "application/x-msaccess": {
        source: "apache",
        extensions: ["mdb"]
      },
      "application/x-msbinder": {
        source: "apache",
        extensions: ["obd"]
      },
      "application/x-mscardfile": {
        source: "apache",
        extensions: ["crd"]
      },
      "application/x-msclip": {
        source: "apache",
        extensions: ["clp"]
      },
      "application/x-msdos-program": {
        extensions: ["exe"]
      },
      "application/x-msdownload": {
        source: "apache",
        extensions: ["exe", "dll", "com", "bat", "msi"]
      },
      "application/x-msmediaview": {
        source: "apache",
        extensions: ["mvb", "m13", "m14"]
      },
      "application/x-msmetafile": {
        source: "apache",
        extensions: ["wmf", "wmz", "emf", "emz"]
      },
      "application/x-msmoney": {
        source: "apache",
        extensions: ["mny"]
      },
      "application/x-mspublisher": {
        source: "apache",
        extensions: ["pub"]
      },
      "application/x-msschedule": {
        source: "apache",
        extensions: ["scd"]
      },
      "application/x-msterminal": {
        source: "apache",
        extensions: ["trm"]
      },
      "application/x-mswrite": {
        source: "apache",
        extensions: ["wri"]
      },
      "application/x-netcdf": {
        source: "apache",
        extensions: ["nc", "cdf"]
      },
      "application/x-ns-proxy-autoconfig": {
        compressible: true,
        extensions: ["pac"]
      },
      "application/x-nzb": {
        source: "apache",
        extensions: ["nzb"]
      },
      "application/x-perl": {
        source: "nginx",
        extensions: ["pl", "pm"]
      },
      "application/x-pilot": {
        source: "nginx",
        extensions: ["prc", "pdb"]
      },
      "application/x-pkcs12": {
        source: "apache",
        compressible: false,
        extensions: ["p12", "pfx"]
      },
      "application/x-pkcs7-certificates": {
        source: "apache",
        extensions: ["p7b", "spc"]
      },
      "application/x-pkcs7-certreqresp": {
        source: "apache",
        extensions: ["p7r"]
      },
      "application/x-pki-message": {
        source: "iana"
      },
      "application/x-rar-compressed": {
        source: "apache",
        compressible: false,
        extensions: ["rar"]
      },
      "application/x-redhat-package-manager": {
        source: "nginx",
        extensions: ["rpm"]
      },
      "application/x-research-info-systems": {
        source: "apache",
        extensions: ["ris"]
      },
      "application/x-sea": {
        source: "nginx",
        extensions: ["sea"]
      },
      "application/x-sh": {
        source: "apache",
        compressible: true,
        extensions: ["sh"]
      },
      "application/x-shar": {
        source: "apache",
        extensions: ["shar"]
      },
      "application/x-shockwave-flash": {
        source: "apache",
        compressible: false,
        extensions: ["swf"]
      },
      "application/x-silverlight-app": {
        source: "apache",
        extensions: ["xap"]
      },
      "application/x-sql": {
        source: "apache",
        extensions: ["sql"]
      },
      "application/x-stuffit": {
        source: "apache",
        compressible: false,
        extensions: ["sit"]
      },
      "application/x-stuffitx": {
        source: "apache",
        extensions: ["sitx"]
      },
      "application/x-subrip": {
        source: "apache",
        extensions: ["srt"]
      },
      "application/x-sv4cpio": {
        source: "apache",
        extensions: ["sv4cpio"]
      },
      "application/x-sv4crc": {
        source: "apache",
        extensions: ["sv4crc"]
      },
      "application/x-t3vm-image": {
        source: "apache",
        extensions: ["t3"]
      },
      "application/x-tads": {
        source: "apache",
        extensions: ["gam"]
      },
      "application/x-tar": {
        source: "apache",
        compressible: true,
        extensions: ["tar"]
      },
      "application/x-tcl": {
        source: "apache",
        extensions: ["tcl", "tk"]
      },
      "application/x-tex": {
        source: "apache",
        extensions: ["tex"]
      },
      "application/x-tex-tfm": {
        source: "apache",
        extensions: ["tfm"]
      },
      "application/x-texinfo": {
        source: "apache",
        extensions: ["texinfo", "texi"]
      },
      "application/x-tgif": {
        source: "apache",
        extensions: ["obj"]
      },
      "application/x-ustar": {
        source: "apache",
        extensions: ["ustar"]
      },
      "application/x-virtualbox-hdd": {
        compressible: true,
        extensions: ["hdd"]
      },
      "application/x-virtualbox-ova": {
        compressible: true,
        extensions: ["ova"]
      },
      "application/x-virtualbox-ovf": {
        compressible: true,
        extensions: ["ovf"]
      },
      "application/x-virtualbox-vbox": {
        compressible: true,
        extensions: ["vbox"]
      },
      "application/x-virtualbox-vbox-extpack": {
        compressible: false,
        extensions: ["vbox-extpack"]
      },
      "application/x-virtualbox-vdi": {
        compressible: true,
        extensions: ["vdi"]
      },
      "application/x-virtualbox-vhd": {
        compressible: true,
        extensions: ["vhd"]
      },
      "application/x-virtualbox-vmdk": {
        compressible: true,
        extensions: ["vmdk"]
      },
      "application/x-wais-source": {
        source: "apache",
        extensions: ["src"]
      },
      "application/x-web-app-manifest+json": {
        compressible: true,
        extensions: ["webapp"]
      },
      "application/x-www-form-urlencoded": {
        source: "iana",
        compressible: true
      },
      "application/x-x509-ca-cert": {
        source: "iana",
        extensions: ["der", "crt", "pem"]
      },
      "application/x-x509-ca-ra-cert": {
        source: "iana"
      },
      "application/x-x509-next-ca-cert": {
        source: "iana"
      },
      "application/x-xfig": {
        source: "apache",
        extensions: ["fig"]
      },
      "application/x-xliff+xml": {
        source: "apache",
        compressible: true,
        extensions: ["xlf"]
      },
      "application/x-xpinstall": {
        source: "apache",
        compressible: false,
        extensions: ["xpi"]
      },
      "application/x-xz": {
        source: "apache",
        extensions: ["xz"]
      },
      "application/x-zmachine": {
        source: "apache",
        extensions: ["z1", "z2", "z3", "z4", "z5", "z6", "z7", "z8"]
      },
      "application/x400-bp": {
        source: "iana"
      },
      "application/xacml+xml": {
        source: "iana",
        compressible: true
      },
      "application/xaml+xml": {
        source: "apache",
        compressible: true,
        extensions: ["xaml"]
      },
      "application/xcap-att+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xav"]
      },
      "application/xcap-caps+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xca"]
      },
      "application/xcap-diff+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xdf"]
      },
      "application/xcap-el+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xel"]
      },
      "application/xcap-error+xml": {
        source: "iana",
        compressible: true
      },
      "application/xcap-ns+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xns"]
      },
      "application/xcon-conference-info+xml": {
        source: "iana",
        compressible: true
      },
      "application/xcon-conference-info-diff+xml": {
        source: "iana",
        compressible: true
      },
      "application/xenc+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xenc"]
      },
      "application/xhtml+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xhtml", "xht"]
      },
      "application/xhtml-voice+xml": {
        source: "apache",
        compressible: true
      },
      "application/xliff+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xlf"]
      },
      "application/xml": {
        source: "iana",
        compressible: true,
        extensions: ["xml", "xsl", "xsd", "rng"]
      },
      "application/xml-dtd": {
        source: "iana",
        compressible: true,
        extensions: ["dtd"]
      },
      "application/xml-external-parsed-entity": {
        source: "iana"
      },
      "application/xml-patch+xml": {
        source: "iana",
        compressible: true
      },
      "application/xmpp+xml": {
        source: "iana",
        compressible: true
      },
      "application/xop+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xop"]
      },
      "application/xproc+xml": {
        source: "apache",
        compressible: true,
        extensions: ["xpl"]
      },
      "application/xslt+xml": {
        source: "iana",
        compressible: true,
        extensions: ["xsl", "xslt"]
      },
      "application/xspf+xml": {
        source: "apache",
        compressible: true,
        extensions: ["xspf"]
      },
      "application/xv+xml": {
        source: "iana",
        compressible: true,
        extensions: ["mxml", "xhvml", "xvml", "xvm"]
      },
      "application/yang": {
        source: "iana",
        extensions: ["yang"]
      },
      "application/yang-data+json": {
        source: "iana",
        compressible: true
      },
      "application/yang-data+xml": {
        source: "iana",
        compressible: true
      },
      "application/yang-patch+json": {
        source: "iana",
        compressible: true
      },
      "application/yang-patch+xml": {
        source: "iana",
        compressible: true
      },
      "application/yin+xml": {
        source: "iana",
        compressible: true,
        extensions: ["yin"]
      },
      "application/zip": {
        source: "iana",
        compressible: false,
        extensions: ["zip"]
      },
      "application/zlib": {
        source: "iana"
      },
      "application/zstd": {
        source: "iana"
      },
      "audio/1d-interleaved-parityfec": {
        source: "iana"
      },
      "audio/32kadpcm": {
        source: "iana"
      },
      "audio/3gpp": {
        source: "iana",
        compressible: false,
        extensions: ["3gpp"]
      },
      "audio/3gpp2": {
        source: "iana"
      },
      "audio/aac": {
        source: "iana"
      },
      "audio/ac3": {
        source: "iana"
      },
      "audio/adpcm": {
        source: "apache",
        extensions: ["adp"]
      },
      "audio/amr": {
        source: "iana",
        extensions: ["amr"]
      },
      "audio/amr-wb": {
        source: "iana"
      },
      "audio/amr-wb+": {
        source: "iana"
      },
      "audio/aptx": {
        source: "iana"
      },
      "audio/asc": {
        source: "iana"
      },
      "audio/atrac-advanced-lossless": {
        source: "iana"
      },
      "audio/atrac-x": {
        source: "iana"
      },
      "audio/atrac3": {
        source: "iana"
      },
      "audio/basic": {
        source: "iana",
        compressible: false,
        extensions: ["au", "snd"]
      },
      "audio/bv16": {
        source: "iana"
      },
      "audio/bv32": {
        source: "iana"
      },
      "audio/clearmode": {
        source: "iana"
      },
      "audio/cn": {
        source: "iana"
      },
      "audio/dat12": {
        source: "iana"
      },
      "audio/dls": {
        source: "iana"
      },
      "audio/dsr-es201108": {
        source: "iana"
      },
      "audio/dsr-es202050": {
        source: "iana"
      },
      "audio/dsr-es202211": {
        source: "iana"
      },
      "audio/dsr-es202212": {
        source: "iana"
      },
      "audio/dv": {
        source: "iana"
      },
      "audio/dvi4": {
        source: "iana"
      },
      "audio/eac3": {
        source: "iana"
      },
      "audio/encaprtp": {
        source: "iana"
      },
      "audio/evrc": {
        source: "iana"
      },
      "audio/evrc-qcp": {
        source: "iana"
      },
      "audio/evrc0": {
        source: "iana"
      },
      "audio/evrc1": {
        source: "iana"
      },
      "audio/evrcb": {
        source: "iana"
      },
      "audio/evrcb0": {
        source: "iana"
      },
      "audio/evrcb1": {
        source: "iana"
      },
      "audio/evrcnw": {
        source: "iana"
      },
      "audio/evrcnw0": {
        source: "iana"
      },
      "audio/evrcnw1": {
        source: "iana"
      },
      "audio/evrcwb": {
        source: "iana"
      },
      "audio/evrcwb0": {
        source: "iana"
      },
      "audio/evrcwb1": {
        source: "iana"
      },
      "audio/evs": {
        source: "iana"
      },
      "audio/flexfec": {
        source: "iana"
      },
      "audio/fwdred": {
        source: "iana"
      },
      "audio/g711-0": {
        source: "iana"
      },
      "audio/g719": {
        source: "iana"
      },
      "audio/g722": {
        source: "iana"
      },
      "audio/g7221": {
        source: "iana"
      },
      "audio/g723": {
        source: "iana"
      },
      "audio/g726-16": {
        source: "iana"
      },
      "audio/g726-24": {
        source: "iana"
      },
      "audio/g726-32": {
        source: "iana"
      },
      "audio/g726-40": {
        source: "iana"
      },
      "audio/g728": {
        source: "iana"
      },
      "audio/g729": {
        source: "iana"
      },
      "audio/g7291": {
        source: "iana"
      },
      "audio/g729d": {
        source: "iana"
      },
      "audio/g729e": {
        source: "iana"
      },
      "audio/gsm": {
        source: "iana"
      },
      "audio/gsm-efr": {
        source: "iana"
      },
      "audio/gsm-hr-08": {
        source: "iana"
      },
      "audio/ilbc": {
        source: "iana"
      },
      "audio/ip-mr_v2.5": {
        source: "iana"
      },
      "audio/isac": {
        source: "apache"
      },
      "audio/l16": {
        source: "iana"
      },
      "audio/l20": {
        source: "iana"
      },
      "audio/l24": {
        source: "iana",
        compressible: false
      },
      "audio/l8": {
        source: "iana"
      },
      "audio/lpc": {
        source: "iana"
      },
      "audio/melp": {
        source: "iana"
      },
      "audio/melp1200": {
        source: "iana"
      },
      "audio/melp2400": {
        source: "iana"
      },
      "audio/melp600": {
        source: "iana"
      },
      "audio/mhas": {
        source: "iana"
      },
      "audio/midi": {
        source: "apache",
        extensions: ["mid", "midi", "kar", "rmi"]
      },
      "audio/mobile-xmf": {
        source: "iana",
        extensions: ["mxmf"]
      },
      "audio/mp3": {
        compressible: false,
        extensions: ["mp3"]
      },
      "audio/mp4": {
        source: "iana",
        compressible: false,
        extensions: ["m4a", "mp4a"]
      },
      "audio/mp4a-latm": {
        source: "iana"
      },
      "audio/mpa": {
        source: "iana"
      },
      "audio/mpa-robust": {
        source: "iana"
      },
      "audio/mpeg": {
        source: "iana",
        compressible: false,
        extensions: ["mpga", "mp2", "mp2a", "mp3", "m2a", "m3a"]
      },
      "audio/mpeg4-generic": {
        source: "iana"
      },
      "audio/musepack": {
        source: "apache"
      },
      "audio/ogg": {
        source: "iana",
        compressible: false,
        extensions: ["oga", "ogg", "spx", "opus"]
      },
      "audio/opus": {
        source: "iana"
      },
      "audio/parityfec": {
        source: "iana"
      },
      "audio/pcma": {
        source: "iana"
      },
      "audio/pcma-wb": {
        source: "iana"
      },
      "audio/pcmu": {
        source: "iana"
      },
      "audio/pcmu-wb": {
        source: "iana"
      },
      "audio/prs.sid": {
        source: "iana"
      },
      "audio/qcelp": {
        source: "iana"
      },
      "audio/raptorfec": {
        source: "iana"
      },
      "audio/red": {
        source: "iana"
      },
      "audio/rtp-enc-aescm128": {
        source: "iana"
      },
      "audio/rtp-midi": {
        source: "iana"
      },
      "audio/rtploopback": {
        source: "iana"
      },
      "audio/rtx": {
        source: "iana"
      },
      "audio/s3m": {
        source: "apache",
        extensions: ["s3m"]
      },
      "audio/scip": {
        source: "iana"
      },
      "audio/silk": {
        source: "apache",
        extensions: ["sil"]
      },
      "audio/smv": {
        source: "iana"
      },
      "audio/smv-qcp": {
        source: "iana"
      },
      "audio/smv0": {
        source: "iana"
      },
      "audio/sofa": {
        source: "iana"
      },
      "audio/sp-midi": {
        source: "iana"
      },
      "audio/speex": {
        source: "iana"
      },
      "audio/t140c": {
        source: "iana"
      },
      "audio/t38": {
        source: "iana"
      },
      "audio/telephone-event": {
        source: "iana"
      },
      "audio/tetra_acelp": {
        source: "iana"
      },
      "audio/tetra_acelp_bb": {
        source: "iana"
      },
      "audio/tone": {
        source: "iana"
      },
      "audio/tsvcis": {
        source: "iana"
      },
      "audio/uemclip": {
        source: "iana"
      },
      "audio/ulpfec": {
        source: "iana"
      },
      "audio/usac": {
        source: "iana"
      },
      "audio/vdvi": {
        source: "iana"
      },
      "audio/vmr-wb": {
        source: "iana"
      },
      "audio/vnd.3gpp.iufp": {
        source: "iana"
      },
      "audio/vnd.4sb": {
        source: "iana"
      },
      "audio/vnd.audiokoz": {
        source: "iana"
      },
      "audio/vnd.celp": {
        source: "iana"
      },
      "audio/vnd.cisco.nse": {
        source: "iana"
      },
      "audio/vnd.cmles.radio-events": {
        source: "iana"
      },
      "audio/vnd.cns.anp1": {
        source: "iana"
      },
      "audio/vnd.cns.inf1": {
        source: "iana"
      },
      "audio/vnd.dece.audio": {
        source: "iana",
        extensions: ["uva", "uvva"]
      },
      "audio/vnd.digital-winds": {
        source: "iana",
        extensions: ["eol"]
      },
      "audio/vnd.dlna.adts": {
        source: "iana"
      },
      "audio/vnd.dolby.heaac.1": {
        source: "iana"
      },
      "audio/vnd.dolby.heaac.2": {
        source: "iana"
      },
      "audio/vnd.dolby.mlp": {
        source: "iana"
      },
      "audio/vnd.dolby.mps": {
        source: "iana"
      },
      "audio/vnd.dolby.pl2": {
        source: "iana"
      },
      "audio/vnd.dolby.pl2x": {
        source: "iana"
      },
      "audio/vnd.dolby.pl2z": {
        source: "iana"
      },
      "audio/vnd.dolby.pulse.1": {
        source: "iana"
      },
      "audio/vnd.dra": {
        source: "iana",
        extensions: ["dra"]
      },
      "audio/vnd.dts": {
        source: "iana",
        extensions: ["dts"]
      },
      "audio/vnd.dts.hd": {
        source: "iana",
        extensions: ["dtshd"]
      },
      "audio/vnd.dts.uhd": {
        source: "iana"
      },
      "audio/vnd.dvb.file": {
        source: "iana"
      },
      "audio/vnd.everad.plj": {
        source: "iana"
      },
      "audio/vnd.hns.audio": {
        source: "iana"
      },
      "audio/vnd.lucent.voice": {
        source: "iana",
        extensions: ["lvp"]
      },
      "audio/vnd.ms-playready.media.pya": {
        source: "iana",
        extensions: ["pya"]
      },
      "audio/vnd.nokia.mobile-xmf": {
        source: "iana"
      },
      "audio/vnd.nortel.vbk": {
        source: "iana"
      },
      "audio/vnd.nuera.ecelp4800": {
        source: "iana",
        extensions: ["ecelp4800"]
      },
      "audio/vnd.nuera.ecelp7470": {
        source: "iana",
        extensions: ["ecelp7470"]
      },
      "audio/vnd.nuera.ecelp9600": {
        source: "iana",
        extensions: ["ecelp9600"]
      },
      "audio/vnd.octel.sbc": {
        source: "iana"
      },
      "audio/vnd.presonus.multitrack": {
        source: "iana"
      },
      "audio/vnd.qcelp": {
        source: "iana"
      },
      "audio/vnd.rhetorex.32kadpcm": {
        source: "iana"
      },
      "audio/vnd.rip": {
        source: "iana",
        extensions: ["rip"]
      },
      "audio/vnd.rn-realaudio": {
        compressible: false
      },
      "audio/vnd.sealedmedia.softseal.mpeg": {
        source: "iana"
      },
      "audio/vnd.vmx.cvsd": {
        source: "iana"
      },
      "audio/vnd.wave": {
        compressible: false
      },
      "audio/vorbis": {
        source: "iana",
        compressible: false
      },
      "audio/vorbis-config": {
        source: "iana"
      },
      "audio/wav": {
        compressible: false,
        extensions: ["wav"]
      },
      "audio/wave": {
        compressible: false,
        extensions: ["wav"]
      },
      "audio/webm": {
        source: "apache",
        compressible: false,
        extensions: ["weba"]
      },
      "audio/x-aac": {
        source: "apache",
        compressible: false,
        extensions: ["aac"]
      },
      "audio/x-aiff": {
        source: "apache",
        extensions: ["aif", "aiff", "aifc"]
      },
      "audio/x-caf": {
        source: "apache",
        compressible: false,
        extensions: ["caf"]
      },
      "audio/x-flac": {
        source: "apache",
        extensions: ["flac"]
      },
      "audio/x-m4a": {
        source: "nginx",
        extensions: ["m4a"]
      },
      "audio/x-matroska": {
        source: "apache",
        extensions: ["mka"]
      },
      "audio/x-mpegurl": {
        source: "apache",
        extensions: ["m3u"]
      },
      "audio/x-ms-wax": {
        source: "apache",
        extensions: ["wax"]
      },
      "audio/x-ms-wma": {
        source: "apache",
        extensions: ["wma"]
      },
      "audio/x-pn-realaudio": {
        source: "apache",
        extensions: ["ram", "ra"]
      },
      "audio/x-pn-realaudio-plugin": {
        source: "apache",
        extensions: ["rmp"]
      },
      "audio/x-realaudio": {
        source: "nginx",
        extensions: ["ra"]
      },
      "audio/x-tta": {
        source: "apache"
      },
      "audio/x-wav": {
        source: "apache",
        extensions: ["wav"]
      },
      "audio/xm": {
        source: "apache",
        extensions: ["xm"]
      },
      "chemical/x-cdx": {
        source: "apache",
        extensions: ["cdx"]
      },
      "chemical/x-cif": {
        source: "apache",
        extensions: ["cif"]
      },
      "chemical/x-cmdf": {
        source: "apache",
        extensions: ["cmdf"]
      },
      "chemical/x-cml": {
        source: "apache",
        extensions: ["cml"]
      },
      "chemical/x-csml": {
        source: "apache",
        extensions: ["csml"]
      },
      "chemical/x-pdb": {
        source: "apache"
      },
      "chemical/x-xyz": {
        source: "apache",
        extensions: ["xyz"]
      },
      "font/collection": {
        source: "iana",
        extensions: ["ttc"]
      },
      "font/otf": {
        source: "iana",
        compressible: true,
        extensions: ["otf"]
      },
      "font/sfnt": {
        source: "iana"
      },
      "font/ttf": {
        source: "iana",
        compressible: true,
        extensions: ["ttf"]
      },
      "font/woff": {
        source: "iana",
        extensions: ["woff"]
      },
      "font/woff2": {
        source: "iana",
        extensions: ["woff2"]
      },
      "image/aces": {
        source: "iana",
        extensions: ["exr"]
      },
      "image/apng": {
        compressible: false,
        extensions: ["apng"]
      },
      "image/avci": {
        source: "iana",
        extensions: ["avci"]
      },
      "image/avcs": {
        source: "iana",
        extensions: ["avcs"]
      },
      "image/avif": {
        source: "iana",
        compressible: false,
        extensions: ["avif"]
      },
      "image/bmp": {
        source: "iana",
        compressible: true,
        extensions: ["bmp"]
      },
      "image/cgm": {
        source: "iana",
        extensions: ["cgm"]
      },
      "image/dicom-rle": {
        source: "iana",
        extensions: ["drle"]
      },
      "image/emf": {
        source: "iana",
        extensions: ["emf"]
      },
      "image/fits": {
        source: "iana",
        extensions: ["fits"]
      },
      "image/g3fax": {
        source: "iana",
        extensions: ["g3"]
      },
      "image/gif": {
        source: "iana",
        compressible: false,
        extensions: ["gif"]
      },
      "image/heic": {
        source: "iana",
        extensions: ["heic"]
      },
      "image/heic-sequence": {
        source: "iana",
        extensions: ["heics"]
      },
      "image/heif": {
        source: "iana",
        extensions: ["heif"]
      },
      "image/heif-sequence": {
        source: "iana",
        extensions: ["heifs"]
      },
      "image/hej2k": {
        source: "iana",
        extensions: ["hej2"]
      },
      "image/hsj2": {
        source: "iana",
        extensions: ["hsj2"]
      },
      "image/ief": {
        source: "iana",
        extensions: ["ief"]
      },
      "image/jls": {
        source: "iana",
        extensions: ["jls"]
      },
      "image/jp2": {
        source: "iana",
        compressible: false,
        extensions: ["jp2", "jpg2"]
      },
      "image/jpeg": {
        source: "iana",
        compressible: false,
        extensions: ["jpeg", "jpg", "jpe"]
      },
      "image/jph": {
        source: "iana",
        extensions: ["jph"]
      },
      "image/jphc": {
        source: "iana",
        extensions: ["jhc"]
      },
      "image/jpm": {
        source: "iana",
        compressible: false,
        extensions: ["jpm"]
      },
      "image/jpx": {
        source: "iana",
        compressible: false,
        extensions: ["jpx", "jpf"]
      },
      "image/jxr": {
        source: "iana",
        extensions: ["jxr"]
      },
      "image/jxra": {
        source: "iana",
        extensions: ["jxra"]
      },
      "image/jxrs": {
        source: "iana",
        extensions: ["jxrs"]
      },
      "image/jxs": {
        source: "iana",
        extensions: ["jxs"]
      },
      "image/jxsc": {
        source: "iana",
        extensions: ["jxsc"]
      },
      "image/jxsi": {
        source: "iana",
        extensions: ["jxsi"]
      },
      "image/jxss": {
        source: "iana",
        extensions: ["jxss"]
      },
      "image/ktx": {
        source: "iana",
        extensions: ["ktx"]
      },
      "image/ktx2": {
        source: "iana",
        extensions: ["ktx2"]
      },
      "image/naplps": {
        source: "iana"
      },
      "image/pjpeg": {
        compressible: false
      },
      "image/png": {
        source: "iana",
        compressible: false,
        extensions: ["png"]
      },
      "image/prs.btif": {
        source: "iana",
        extensions: ["btif"]
      },
      "image/prs.pti": {
        source: "iana",
        extensions: ["pti"]
      },
      "image/pwg-raster": {
        source: "iana"
      },
      "image/sgi": {
        source: "apache",
        extensions: ["sgi"]
      },
      "image/svg+xml": {
        source: "iana",
        compressible: true,
        extensions: ["svg", "svgz"]
      },
      "image/t38": {
        source: "iana",
        extensions: ["t38"]
      },
      "image/tiff": {
        source: "iana",
        compressible: false,
        extensions: ["tif", "tiff"]
      },
      "image/tiff-fx": {
        source: "iana",
        extensions: ["tfx"]
      },
      "image/vnd.adobe.photoshop": {
        source: "iana",
        compressible: true,
        extensions: ["psd"]
      },
      "image/vnd.airzip.accelerator.azv": {
        source: "iana",
        extensions: ["azv"]
      },
      "image/vnd.cns.inf2": {
        source: "iana"
      },
      "image/vnd.dece.graphic": {
        source: "iana",
        extensions: ["uvi", "uvvi", "uvg", "uvvg"]
      },
      "image/vnd.djvu": {
        source: "iana",
        extensions: ["djvu", "djv"]
      },
      "image/vnd.dvb.subtitle": {
        source: "iana",
        extensions: ["sub"]
      },
      "image/vnd.dwg": {
        source: "iana",
        extensions: ["dwg"]
      },
      "image/vnd.dxf": {
        source: "iana",
        extensions: ["dxf"]
      },
      "image/vnd.fastbidsheet": {
        source: "iana",
        extensions: ["fbs"]
      },
      "image/vnd.fpx": {
        source: "iana",
        extensions: ["fpx"]
      },
      "image/vnd.fst": {
        source: "iana",
        extensions: ["fst"]
      },
      "image/vnd.fujixerox.edmics-mmr": {
        source: "iana",
        extensions: ["mmr"]
      },
      "image/vnd.fujixerox.edmics-rlc": {
        source: "iana",
        extensions: ["rlc"]
      },
      "image/vnd.globalgraphics.pgb": {
        source: "iana"
      },
      "image/vnd.microsoft.icon": {
        source: "iana",
        compressible: true,
        extensions: ["ico"]
      },
      "image/vnd.mix": {
        source: "iana"
      },
      "image/vnd.mozilla.apng": {
        source: "iana"
      },
      "image/vnd.ms-dds": {
        compressible: true,
        extensions: ["dds"]
      },
      "image/vnd.ms-modi": {
        source: "iana",
        extensions: ["mdi"]
      },
      "image/vnd.ms-photo": {
        source: "apache",
        extensions: ["wdp"]
      },
      "image/vnd.net-fpx": {
        source: "iana",
        extensions: ["npx"]
      },
      "image/vnd.pco.b16": {
        source: "iana",
        extensions: ["b16"]
      },
      "image/vnd.radiance": {
        source: "iana"
      },
      "image/vnd.sealed.png": {
        source: "iana"
      },
      "image/vnd.sealedmedia.softseal.gif": {
        source: "iana"
      },
      "image/vnd.sealedmedia.softseal.jpg": {
        source: "iana"
      },
      "image/vnd.svf": {
        source: "iana"
      },
      "image/vnd.tencent.tap": {
        source: "iana",
        extensions: ["tap"]
      },
      "image/vnd.valve.source.texture": {
        source: "iana",
        extensions: ["vtf"]
      },
      "image/vnd.wap.wbmp": {
        source: "iana",
        extensions: ["wbmp"]
      },
      "image/vnd.xiff": {
        source: "iana",
        extensions: ["xif"]
      },
      "image/vnd.zbrush.pcx": {
        source: "iana",
        extensions: ["pcx"]
      },
      "image/webp": {
        source: "apache",
        extensions: ["webp"]
      },
      "image/wmf": {
        source: "iana",
        extensions: ["wmf"]
      },
      "image/x-3ds": {
        source: "apache",
        extensions: ["3ds"]
      },
      "image/x-cmu-raster": {
        source: "apache",
        extensions: ["ras"]
      },
      "image/x-cmx": {
        source: "apache",
        extensions: ["cmx"]
      },
      "image/x-freehand": {
        source: "apache",
        extensions: ["fh", "fhc", "fh4", "fh5", "fh7"]
      },
      "image/x-icon": {
        source: "apache",
        compressible: true,
        extensions: ["ico"]
      },
      "image/x-jng": {
        source: "nginx",
        extensions: ["jng"]
      },
      "image/x-mrsid-image": {
        source: "apache",
        extensions: ["sid"]
      },
      "image/x-ms-bmp": {
        source: "nginx",
        compressible: true,
        extensions: ["bmp"]
      },
      "image/x-pcx": {
        source: "apache",
        extensions: ["pcx"]
      },
      "image/x-pict": {
        source: "apache",
        extensions: ["pic", "pct"]
      },
      "image/x-portable-anymap": {
        source: "apache",
        extensions: ["pnm"]
      },
      "image/x-portable-bitmap": {
        source: "apache",
        extensions: ["pbm"]
      },
      "image/x-portable-graymap": {
        source: "apache",
        extensions: ["pgm"]
      },
      "image/x-portable-pixmap": {
        source: "apache",
        extensions: ["ppm"]
      },
      "image/x-rgb": {
        source: "apache",
        extensions: ["rgb"]
      },
      "image/x-tga": {
        source: "apache",
        extensions: ["tga"]
      },
      "image/x-xbitmap": {
        source: "apache",
        extensions: ["xbm"]
      },
      "image/x-xcf": {
        compressible: false
      },
      "image/x-xpixmap": {
        source: "apache",
        extensions: ["xpm"]
      },
      "image/x-xwindowdump": {
        source: "apache",
        extensions: ["xwd"]
      },
      "message/cpim": {
        source: "iana"
      },
      "message/delivery-status": {
        source: "iana"
      },
      "message/disposition-notification": {
        source: "iana",
        extensions: [
          "disposition-notification"
        ]
      },
      "message/external-body": {
        source: "iana"
      },
      "message/feedback-report": {
        source: "iana"
      },
      "message/global": {
        source: "iana",
        extensions: ["u8msg"]
      },
      "message/global-delivery-status": {
        source: "iana",
        extensions: ["u8dsn"]
      },
      "message/global-disposition-notification": {
        source: "iana",
        extensions: ["u8mdn"]
      },
      "message/global-headers": {
        source: "iana",
        extensions: ["u8hdr"]
      },
      "message/http": {
        source: "iana",
        compressible: false
      },
      "message/imdn+xml": {
        source: "iana",
        compressible: true
      },
      "message/news": {
        source: "iana"
      },
      "message/partial": {
        source: "iana",
        compressible: false
      },
      "message/rfc822": {
        source: "iana",
        compressible: true,
        extensions: ["eml", "mime"]
      },
      "message/s-http": {
        source: "iana"
      },
      "message/sip": {
        source: "iana"
      },
      "message/sipfrag": {
        source: "iana"
      },
      "message/tracking-status": {
        source: "iana"
      },
      "message/vnd.si.simp": {
        source: "iana"
      },
      "message/vnd.wfa.wsc": {
        source: "iana",
        extensions: ["wsc"]
      },
      "model/3mf": {
        source: "iana",
        extensions: ["3mf"]
      },
      "model/e57": {
        source: "iana"
      },
      "model/gltf+json": {
        source: "iana",
        compressible: true,
        extensions: ["gltf"]
      },
      "model/gltf-binary": {
        source: "iana",
        compressible: true,
        extensions: ["glb"]
      },
      "model/iges": {
        source: "iana",
        compressible: false,
        extensions: ["igs", "iges"]
      },
      "model/mesh": {
        source: "iana",
        compressible: false,
        extensions: ["msh", "mesh", "silo"]
      },
      "model/mtl": {
        source: "iana",
        extensions: ["mtl"]
      },
      "model/obj": {
        source: "iana",
        extensions: ["obj"]
      },
      "model/step": {
        source: "iana"
      },
      "model/step+xml": {
        source: "iana",
        compressible: true,
        extensions: ["stpx"]
      },
      "model/step+zip": {
        source: "iana",
        compressible: false,
        extensions: ["stpz"]
      },
      "model/step-xml+zip": {
        source: "iana",
        compressible: false,
        extensions: ["stpxz"]
      },
      "model/stl": {
        source: "iana",
        extensions: ["stl"]
      },
      "model/vnd.collada+xml": {
        source: "iana",
        compressible: true,
        extensions: ["dae"]
      },
      "model/vnd.dwf": {
        source: "iana",
        extensions: ["dwf"]
      },
      "model/vnd.flatland.3dml": {
        source: "iana"
      },
      "model/vnd.gdl": {
        source: "iana",
        extensions: ["gdl"]
      },
      "model/vnd.gs-gdl": {
        source: "apache"
      },
      "model/vnd.gs.gdl": {
        source: "iana"
      },
      "model/vnd.gtw": {
        source: "iana",
        extensions: ["gtw"]
      },
      "model/vnd.moml+xml": {
        source: "iana",
        compressible: true
      },
      "model/vnd.mts": {
        source: "iana",
        extensions: ["mts"]
      },
      "model/vnd.opengex": {
        source: "iana",
        extensions: ["ogex"]
      },
      "model/vnd.parasolid.transmit.binary": {
        source: "iana",
        extensions: ["x_b"]
      },
      "model/vnd.parasolid.transmit.text": {
        source: "iana",
        extensions: ["x_t"]
      },
      "model/vnd.pytha.pyox": {
        source: "iana"
      },
      "model/vnd.rosette.annotated-data-model": {
        source: "iana"
      },
      "model/vnd.sap.vds": {
        source: "iana",
        extensions: ["vds"]
      },
      "model/vnd.usdz+zip": {
        source: "iana",
        compressible: false,
        extensions: ["usdz"]
      },
      "model/vnd.valve.source.compiled-map": {
        source: "iana",
        extensions: ["bsp"]
      },
      "model/vnd.vtu": {
        source: "iana",
        extensions: ["vtu"]
      },
      "model/vrml": {
        source: "iana",
        compressible: false,
        extensions: ["wrl", "vrml"]
      },
      "model/x3d+binary": {
        source: "apache",
        compressible: false,
        extensions: ["x3db", "x3dbz"]
      },
      "model/x3d+fastinfoset": {
        source: "iana",
        extensions: ["x3db"]
      },
      "model/x3d+vrml": {
        source: "apache",
        compressible: false,
        extensions: ["x3dv", "x3dvz"]
      },
      "model/x3d+xml": {
        source: "iana",
        compressible: true,
        extensions: ["x3d", "x3dz"]
      },
      "model/x3d-vrml": {
        source: "iana",
        extensions: ["x3dv"]
      },
      "multipart/alternative": {
        source: "iana",
        compressible: false
      },
      "multipart/appledouble": {
        source: "iana"
      },
      "multipart/byteranges": {
        source: "iana"
      },
      "multipart/digest": {
        source: "iana"
      },
      "multipart/encrypted": {
        source: "iana",
        compressible: false
      },
      "multipart/form-data": {
        source: "iana",
        compressible: false
      },
      "multipart/header-set": {
        source: "iana"
      },
      "multipart/mixed": {
        source: "iana"
      },
      "multipart/multilingual": {
        source: "iana"
      },
      "multipart/parallel": {
        source: "iana"
      },
      "multipart/related": {
        source: "iana",
        compressible: false
      },
      "multipart/report": {
        source: "iana"
      },
      "multipart/signed": {
        source: "iana",
        compressible: false
      },
      "multipart/vnd.bint.med-plus": {
        source: "iana"
      },
      "multipart/voice-message": {
        source: "iana"
      },
      "multipart/x-mixed-replace": {
        source: "iana"
      },
      "text/1d-interleaved-parityfec": {
        source: "iana"
      },
      "text/cache-manifest": {
        source: "iana",
        compressible: true,
        extensions: ["appcache", "manifest"]
      },
      "text/calendar": {
        source: "iana",
        extensions: ["ics", "ifb"]
      },
      "text/calender": {
        compressible: true
      },
      "text/cmd": {
        compressible: true
      },
      "text/coffeescript": {
        extensions: ["coffee", "litcoffee"]
      },
      "text/cql": {
        source: "iana"
      },
      "text/cql-expression": {
        source: "iana"
      },
      "text/cql-identifier": {
        source: "iana"
      },
      "text/css": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: ["css"]
      },
      "text/csv": {
        source: "iana",
        compressible: true,
        extensions: ["csv"]
      },
      "text/csv-schema": {
        source: "iana"
      },
      "text/directory": {
        source: "iana"
      },
      "text/dns": {
        source: "iana"
      },
      "text/ecmascript": {
        source: "iana"
      },
      "text/encaprtp": {
        source: "iana"
      },
      "text/enriched": {
        source: "iana"
      },
      "text/fhirpath": {
        source: "iana"
      },
      "text/flexfec": {
        source: "iana"
      },
      "text/fwdred": {
        source: "iana"
      },
      "text/gff3": {
        source: "iana"
      },
      "text/grammar-ref-list": {
        source: "iana"
      },
      "text/html": {
        source: "iana",
        compressible: true,
        extensions: ["html", "htm", "shtml"]
      },
      "text/jade": {
        extensions: ["jade"]
      },
      "text/javascript": {
        source: "iana",
        compressible: true
      },
      "text/jcr-cnd": {
        source: "iana"
      },
      "text/jsx": {
        compressible: true,
        extensions: ["jsx"]
      },
      "text/less": {
        compressible: true,
        extensions: ["less"]
      },
      "text/markdown": {
        source: "iana",
        compressible: true,
        extensions: ["markdown", "md"]
      },
      "text/mathml": {
        source: "nginx",
        extensions: ["mml"]
      },
      "text/mdx": {
        compressible: true,
        extensions: ["mdx"]
      },
      "text/mizar": {
        source: "iana"
      },
      "text/n3": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: ["n3"]
      },
      "text/parameters": {
        source: "iana",
        charset: "UTF-8"
      },
      "text/parityfec": {
        source: "iana"
      },
      "text/plain": {
        source: "iana",
        compressible: true,
        extensions: ["txt", "text", "conf", "def", "list", "log", "in", "ini"]
      },
      "text/provenance-notation": {
        source: "iana",
        charset: "UTF-8"
      },
      "text/prs.fallenstein.rst": {
        source: "iana"
      },
      "text/prs.lines.tag": {
        source: "iana",
        extensions: ["dsc"]
      },
      "text/prs.prop.logic": {
        source: "iana"
      },
      "text/raptorfec": {
        source: "iana"
      },
      "text/red": {
        source: "iana"
      },
      "text/rfc822-headers": {
        source: "iana"
      },
      "text/richtext": {
        source: "iana",
        compressible: true,
        extensions: ["rtx"]
      },
      "text/rtf": {
        source: "iana",
        compressible: true,
        extensions: ["rtf"]
      },
      "text/rtp-enc-aescm128": {
        source: "iana"
      },
      "text/rtploopback": {
        source: "iana"
      },
      "text/rtx": {
        source: "iana"
      },
      "text/sgml": {
        source: "iana",
        extensions: ["sgml", "sgm"]
      },
      "text/shaclc": {
        source: "iana"
      },
      "text/shex": {
        source: "iana",
        extensions: ["shex"]
      },
      "text/slim": {
        extensions: ["slim", "slm"]
      },
      "text/spdx": {
        source: "iana",
        extensions: ["spdx"]
      },
      "text/strings": {
        source: "iana"
      },
      "text/stylus": {
        extensions: ["stylus", "styl"]
      },
      "text/t140": {
        source: "iana"
      },
      "text/tab-separated-values": {
        source: "iana",
        compressible: true,
        extensions: ["tsv"]
      },
      "text/troff": {
        source: "iana",
        extensions: ["t", "tr", "roff", "man", "me", "ms"]
      },
      "text/turtle": {
        source: "iana",
        charset: "UTF-8",
        extensions: ["ttl"]
      },
      "text/ulpfec": {
        source: "iana"
      },
      "text/uri-list": {
        source: "iana",
        compressible: true,
        extensions: ["uri", "uris", "urls"]
      },
      "text/vcard": {
        source: "iana",
        compressible: true,
        extensions: ["vcard"]
      },
      "text/vnd.a": {
        source: "iana"
      },
      "text/vnd.abc": {
        source: "iana"
      },
      "text/vnd.ascii-art": {
        source: "iana"
      },
      "text/vnd.curl": {
        source: "iana",
        extensions: ["curl"]
      },
      "text/vnd.curl.dcurl": {
        source: "apache",
        extensions: ["dcurl"]
      },
      "text/vnd.curl.mcurl": {
        source: "apache",
        extensions: ["mcurl"]
      },
      "text/vnd.curl.scurl": {
        source: "apache",
        extensions: ["scurl"]
      },
      "text/vnd.debian.copyright": {
        source: "iana",
        charset: "UTF-8"
      },
      "text/vnd.dmclientscript": {
        source: "iana"
      },
      "text/vnd.dvb.subtitle": {
        source: "iana",
        extensions: ["sub"]
      },
      "text/vnd.esmertec.theme-descriptor": {
        source: "iana",
        charset: "UTF-8"
      },
      "text/vnd.familysearch.gedcom": {
        source: "iana",
        extensions: ["ged"]
      },
      "text/vnd.ficlab.flt": {
        source: "iana"
      },
      "text/vnd.fly": {
        source: "iana",
        extensions: ["fly"]
      },
      "text/vnd.fmi.flexstor": {
        source: "iana",
        extensions: ["flx"]
      },
      "text/vnd.gml": {
        source: "iana"
      },
      "text/vnd.graphviz": {
        source: "iana",
        extensions: ["gv"]
      },
      "text/vnd.hans": {
        source: "iana"
      },
      "text/vnd.hgl": {
        source: "iana"
      },
      "text/vnd.in3d.3dml": {
        source: "iana",
        extensions: ["3dml"]
      },
      "text/vnd.in3d.spot": {
        source: "iana",
        extensions: ["spot"]
      },
      "text/vnd.iptc.newsml": {
        source: "iana"
      },
      "text/vnd.iptc.nitf": {
        source: "iana"
      },
      "text/vnd.latex-z": {
        source: "iana"
      },
      "text/vnd.motorola.reflex": {
        source: "iana"
      },
      "text/vnd.ms-mediapackage": {
        source: "iana"
      },
      "text/vnd.net2phone.commcenter.command": {
        source: "iana"
      },
      "text/vnd.radisys.msml-basic-layout": {
        source: "iana"
      },
      "text/vnd.senx.warpscript": {
        source: "iana"
      },
      "text/vnd.si.uricatalogue": {
        source: "iana"
      },
      "text/vnd.sosi": {
        source: "iana"
      },
      "text/vnd.sun.j2me.app-descriptor": {
        source: "iana",
        charset: "UTF-8",
        extensions: ["jad"]
      },
      "text/vnd.trolltech.linguist": {
        source: "iana",
        charset: "UTF-8"
      },
      "text/vnd.wap.si": {
        source: "iana"
      },
      "text/vnd.wap.sl": {
        source: "iana"
      },
      "text/vnd.wap.wml": {
        source: "iana",
        extensions: ["wml"]
      },
      "text/vnd.wap.wmlscript": {
        source: "iana",
        extensions: ["wmls"]
      },
      "text/vtt": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: ["vtt"]
      },
      "text/x-asm": {
        source: "apache",
        extensions: ["s", "asm"]
      },
      "text/x-c": {
        source: "apache",
        extensions: ["c", "cc", "cxx", "cpp", "h", "hh", "dic"]
      },
      "text/x-component": {
        source: "nginx",
        extensions: ["htc"]
      },
      "text/x-fortran": {
        source: "apache",
        extensions: ["f", "for", "f77", "f90"]
      },
      "text/x-gwt-rpc": {
        compressible: true
      },
      "text/x-handlebars-template": {
        extensions: ["hbs"]
      },
      "text/x-java-source": {
        source: "apache",
        extensions: ["java"]
      },
      "text/x-jquery-tmpl": {
        compressible: true
      },
      "text/x-lua": {
        extensions: ["lua"]
      },
      "text/x-markdown": {
        compressible: true,
        extensions: ["mkd"]
      },
      "text/x-nfo": {
        source: "apache",
        extensions: ["nfo"]
      },
      "text/x-opml": {
        source: "apache",
        extensions: ["opml"]
      },
      "text/x-org": {
        compressible: true,
        extensions: ["org"]
      },
      "text/x-pascal": {
        source: "apache",
        extensions: ["p", "pas"]
      },
      "text/x-processing": {
        compressible: true,
        extensions: ["pde"]
      },
      "text/x-sass": {
        extensions: ["sass"]
      },
      "text/x-scss": {
        extensions: ["scss"]
      },
      "text/x-setext": {
        source: "apache",
        extensions: ["etx"]
      },
      "text/x-sfv": {
        source: "apache",
        extensions: ["sfv"]
      },
      "text/x-suse-ymp": {
        compressible: true,
        extensions: ["ymp"]
      },
      "text/x-uuencode": {
        source: "apache",
        extensions: ["uu"]
      },
      "text/x-vcalendar": {
        source: "apache",
        extensions: ["vcs"]
      },
      "text/x-vcard": {
        source: "apache",
        extensions: ["vcf"]
      },
      "text/xml": {
        source: "iana",
        compressible: true,
        extensions: ["xml"]
      },
      "text/xml-external-parsed-entity": {
        source: "iana"
      },
      "text/yaml": {
        compressible: true,
        extensions: ["yaml", "yml"]
      },
      "video/1d-interleaved-parityfec": {
        source: "iana"
      },
      "video/3gpp": {
        source: "iana",
        extensions: ["3gp", "3gpp"]
      },
      "video/3gpp-tt": {
        source: "iana"
      },
      "video/3gpp2": {
        source: "iana",
        extensions: ["3g2"]
      },
      "video/av1": {
        source: "iana"
      },
      "video/bmpeg": {
        source: "iana"
      },
      "video/bt656": {
        source: "iana"
      },
      "video/celb": {
        source: "iana"
      },
      "video/dv": {
        source: "iana"
      },
      "video/encaprtp": {
        source: "iana"
      },
      "video/ffv1": {
        source: "iana"
      },
      "video/flexfec": {
        source: "iana"
      },
      "video/h261": {
        source: "iana",
        extensions: ["h261"]
      },
      "video/h263": {
        source: "iana",
        extensions: ["h263"]
      },
      "video/h263-1998": {
        source: "iana"
      },
      "video/h263-2000": {
        source: "iana"
      },
      "video/h264": {
        source: "iana",
        extensions: ["h264"]
      },
      "video/h264-rcdo": {
        source: "iana"
      },
      "video/h264-svc": {
        source: "iana"
      },
      "video/h265": {
        source: "iana"
      },
      "video/iso.segment": {
        source: "iana",
        extensions: ["m4s"]
      },
      "video/jpeg": {
        source: "iana",
        extensions: ["jpgv"]
      },
      "video/jpeg2000": {
        source: "iana"
      },
      "video/jpm": {
        source: "apache",
        extensions: ["jpm", "jpgm"]
      },
      "video/jxsv": {
        source: "iana"
      },
      "video/mj2": {
        source: "iana",
        extensions: ["mj2", "mjp2"]
      },
      "video/mp1s": {
        source: "iana"
      },
      "video/mp2p": {
        source: "iana"
      },
      "video/mp2t": {
        source: "iana",
        extensions: ["ts"]
      },
      "video/mp4": {
        source: "iana",
        compressible: false,
        extensions: ["mp4", "mp4v", "mpg4"]
      },
      "video/mp4v-es": {
        source: "iana"
      },
      "video/mpeg": {
        source: "iana",
        compressible: false,
        extensions: ["mpeg", "mpg", "mpe", "m1v", "m2v"]
      },
      "video/mpeg4-generic": {
        source: "iana"
      },
      "video/mpv": {
        source: "iana"
      },
      "video/nv": {
        source: "iana"
      },
      "video/ogg": {
        source: "iana",
        compressible: false,
        extensions: ["ogv"]
      },
      "video/parityfec": {
        source: "iana"
      },
      "video/pointer": {
        source: "iana"
      },
      "video/quicktime": {
        source: "iana",
        compressible: false,
        extensions: ["qt", "mov"]
      },
      "video/raptorfec": {
        source: "iana"
      },
      "video/raw": {
        source: "iana"
      },
      "video/rtp-enc-aescm128": {
        source: "iana"
      },
      "video/rtploopback": {
        source: "iana"
      },
      "video/rtx": {
        source: "iana"
      },
      "video/scip": {
        source: "iana"
      },
      "video/smpte291": {
        source: "iana"
      },
      "video/smpte292m": {
        source: "iana"
      },
      "video/ulpfec": {
        source: "iana"
      },
      "video/vc1": {
        source: "iana"
      },
      "video/vc2": {
        source: "iana"
      },
      "video/vnd.cctv": {
        source: "iana"
      },
      "video/vnd.dece.hd": {
        source: "iana",
        extensions: ["uvh", "uvvh"]
      },
      "video/vnd.dece.mobile": {
        source: "iana",
        extensions: ["uvm", "uvvm"]
      },
      "video/vnd.dece.mp4": {
        source: "iana"
      },
      "video/vnd.dece.pd": {
        source: "iana",
        extensions: ["uvp", "uvvp"]
      },
      "video/vnd.dece.sd": {
        source: "iana",
        extensions: ["uvs", "uvvs"]
      },
      "video/vnd.dece.video": {
        source: "iana",
        extensions: ["uvv", "uvvv"]
      },
      "video/vnd.directv.mpeg": {
        source: "iana"
      },
      "video/vnd.directv.mpeg-tts": {
        source: "iana"
      },
      "video/vnd.dlna.mpeg-tts": {
        source: "iana"
      },
      "video/vnd.dvb.file": {
        source: "iana",
        extensions: ["dvb"]
      },
      "video/vnd.fvt": {
        source: "iana",
        extensions: ["fvt"]
      },
      "video/vnd.hns.video": {
        source: "iana"
      },
      "video/vnd.iptvforum.1dparityfec-1010": {
        source: "iana"
      },
      "video/vnd.iptvforum.1dparityfec-2005": {
        source: "iana"
      },
      "video/vnd.iptvforum.2dparityfec-1010": {
        source: "iana"
      },
      "video/vnd.iptvforum.2dparityfec-2005": {
        source: "iana"
      },
      "video/vnd.iptvforum.ttsavc": {
        source: "iana"
      },
      "video/vnd.iptvforum.ttsmpeg2": {
        source: "iana"
      },
      "video/vnd.motorola.video": {
        source: "iana"
      },
      "video/vnd.motorola.videop": {
        source: "iana"
      },
      "video/vnd.mpegurl": {
        source: "iana",
        extensions: ["mxu", "m4u"]
      },
      "video/vnd.ms-playready.media.pyv": {
        source: "iana",
        extensions: ["pyv"]
      },
      "video/vnd.nokia.interleaved-multimedia": {
        source: "iana"
      },
      "video/vnd.nokia.mp4vr": {
        source: "iana"
      },
      "video/vnd.nokia.videovoip": {
        source: "iana"
      },
      "video/vnd.objectvideo": {
        source: "iana"
      },
      "video/vnd.radgamettools.bink": {
        source: "iana"
      },
      "video/vnd.radgamettools.smacker": {
        source: "iana"
      },
      "video/vnd.sealed.mpeg1": {
        source: "iana"
      },
      "video/vnd.sealed.mpeg4": {
        source: "iana"
      },
      "video/vnd.sealed.swf": {
        source: "iana"
      },
      "video/vnd.sealedmedia.softseal.mov": {
        source: "iana"
      },
      "video/vnd.uvvu.mp4": {
        source: "iana",
        extensions: ["uvu", "uvvu"]
      },
      "video/vnd.vivo": {
        source: "iana",
        extensions: ["viv"]
      },
      "video/vnd.youtube.yt": {
        source: "iana"
      },
      "video/vp8": {
        source: "iana"
      },
      "video/vp9": {
        source: "iana"
      },
      "video/webm": {
        source: "apache",
        compressible: false,
        extensions: ["webm"]
      },
      "video/x-f4v": {
        source: "apache",
        extensions: ["f4v"]
      },
      "video/x-fli": {
        source: "apache",
        extensions: ["fli"]
      },
      "video/x-flv": {
        source: "apache",
        compressible: false,
        extensions: ["flv"]
      },
      "video/x-m4v": {
        source: "apache",
        extensions: ["m4v"]
      },
      "video/x-matroska": {
        source: "apache",
        compressible: false,
        extensions: ["mkv", "mk3d", "mks"]
      },
      "video/x-mng": {
        source: "apache",
        extensions: ["mng"]
      },
      "video/x-ms-asf": {
        source: "apache",
        extensions: ["asf", "asx"]
      },
      "video/x-ms-vob": {
        source: "apache",
        extensions: ["vob"]
      },
      "video/x-ms-wm": {
        source: "apache",
        extensions: ["wm"]
      },
      "video/x-ms-wmv": {
        source: "apache",
        compressible: false,
        extensions: ["wmv"]
      },
      "video/x-ms-wmx": {
        source: "apache",
        extensions: ["wmx"]
      },
      "video/x-ms-wvx": {
        source: "apache",
        extensions: ["wvx"]
      },
      "video/x-msvideo": {
        source: "apache",
        extensions: ["avi"]
      },
      "video/x-sgi-movie": {
        source: "apache",
        extensions: ["movie"]
      },
      "video/x-smv": {
        source: "apache",
        extensions: ["smv"]
      },
      "x-conference/x-cooltalk": {
        source: "apache",
        extensions: ["ice"]
      },
      "x-shader/x-fragment": {
        compressible: true
      },
      "x-shader/x-vertex": {
        compressible: true
      }
    };
  }
});
var require_mime_db = __commonJS2({
  "../../node_modules/mime-db/index.js"(exports, module) {
    "use strict";
    module.exports = require_db();
  }
});
var require_mime_types = __commonJS2({
  "../../node_modules/mime-types/index.js"(exports) {
    "use strict";
    var db = require_mime_db();
    var extname = __require2("path").extname;
    var EXTRACT_TYPE_REGEXP = /^\s*([^;\s]*)(?:;|\s|$)/;
    var TEXT_TYPE_REGEXP = /^text\//i;
    exports.charset = charset;
    exports.charsets = { lookup: charset };
    exports.contentType = contentType;
    exports.extension = extension;
    exports.extensions = /* @__PURE__ */ Object.create(null);
    exports.lookup = lookup3;
    exports.types = /* @__PURE__ */ Object.create(null);
    populateMaps(exports.extensions, exports.types);
    function charset(type) {
      if (!type || typeof type !== "string") {
        return false;
      }
      var match = EXTRACT_TYPE_REGEXP.exec(type);
      var mime = match && db[match[1].toLowerCase()];
      if (mime && mime.charset) {
        return mime.charset;
      }
      if (match && TEXT_TYPE_REGEXP.test(match[1])) {
        return "UTF-8";
      }
      return false;
    }
    function contentType(str) {
      if (!str || typeof str !== "string") {
        return false;
      }
      var mime = str.indexOf("/") === -1 ? exports.lookup(str) : str;
      if (!mime) {
        return false;
      }
      if (mime.indexOf("charset") === -1) {
        var charset2 = exports.charset(mime);
        if (charset2) mime += "; charset=" + charset2.toLowerCase();
      }
      return mime;
    }
    function extension(type) {
      if (!type || typeof type !== "string") {
        return false;
      }
      var match = EXTRACT_TYPE_REGEXP.exec(type);
      var exts = match && exports.extensions[match[1].toLowerCase()];
      if (!exts || !exts.length) {
        return false;
      }
      return exts[0];
    }
    function lookup3(path2) {
      if (!path2 || typeof path2 !== "string") {
        return false;
      }
      var extension2 = extname("x." + path2).toLowerCase().substr(1);
      if (!extension2) {
        return false;
      }
      return exports.types[extension2] || false;
    }
    function populateMaps(extensions, types) {
      var preference = ["nginx", "apache", void 0, "iana"];
      Object.keys(db).forEach(function forEachMimeType(type) {
        var mime = db[type];
        var exts = mime.extensions;
        if (!exts || !exts.length) {
          return;
        }
        extensions[type] = exts;
        for (var i2 = 0; i2 < exts.length; i2++) {
          var extension2 = exts[i2];
          if (types[extension2]) {
            var from = preference.indexOf(db[types[extension2]].source);
            var to2 = preference.indexOf(mime.source);
            if (types[extension2] !== "application/octet-stream" && (from > to2 || from === to2 && types[extension2].substr(0, 12) === "application/")) {
              continue;
            }
          }
          types[extension2] = type;
        }
      });
    }
  }
});
var EndpointState = /* @__PURE__ */ ((EndpointState2) => {
  EndpointState2["Idle"] = "Idle";
  EndpointState2["Busy"] = "Busy";
  EndpointState2["Authenticating"] = "Authenticating";
  EndpointState2["FetchConfig"] = "FetchConfig";
  EndpointState2["Error"] = "Error";
  EndpointState2["NotAvailable"] = "NotAvailable";
  return EndpointState2;
})(EndpointState || {});
var Stream = class _Stream {
  constructor(iterator, controller) {
    this.iterator = iterator;
    this.controller = controller;
  }
  static iterFromReadableStream(readableStream, controller, eventHandler) {
    let consumed = false;
    async function* iterLines() {
      const lineDecoder = new EyepopLineDecoder();
      const iter = readableStreamAsyncIterable(await readableStream);
      for await (let chunk of iter) {
        for (const line of lineDecoder.decode(chunk)) {
          yield line;
        }
      }
      for (const line of lineDecoder.flush()) {
        yield line;
      }
    }
    async function* iterator() {
      if (consumed) {
        throw new Error("Cannot iterate over a consumed stream, use `.tee()` to split the stream.");
      }
      consumed = true;
      let done = false;
      try {
        for await (const line of iterLines()) {
          if (done) continue;
          if (line) {
            const message = JSON.parse(line);
            const event = message["event"];
            if (event !== void 0) {
              await eventHandler(event);
            } else {
              yield message;
            }
          }
        }
        done = true;
      } catch (e3) {
        if (e3 instanceof Error && e3.name === "AbortError") return;
        throw e3;
      } finally {
        if (!done) controller.abort();
      }
    }
    return iterator();
  }
  [Symbol.asyncIterator]() {
    return this.iterator();
  }
  /**
   * Splits the stream into two streams which can be
   * independently read from at different speeds.
   */
  tee() {
    const left = [];
    const right = [];
    const iterator = this.iterator();
    const teeIterator = (queue) => {
      return {
        next: () => {
          if (queue.length === 0) {
            const result = iterator.next();
            left.push(result);
            right.push(result);
          }
          return queue.shift();
        }
      };
    };
    return [new _Stream(() => teeIterator(left), this.controller), new _Stream(() => teeIterator(right), this.controller)];
  }
};
var _EyepopLineDecoder = class _EyepopLineDecoder2 {
  // TextDecoder found in browsers; not typed to avoid pulling in either "dom" or "node" types.
  constructor() {
    this.buffer = [];
    this.trailingCR = false;
  }
  decode(chunk) {
    let text = this.decodeText(chunk);
    if (this.trailingCR) {
      text = "\r" + text;
      this.trailingCR = false;
    }
    if (text.endsWith("\r")) {
      this.trailingCR = true;
      text = text.slice(0, -1);
    }
    if (!text) {
      return [];
    }
    const trailingNewline = _EyepopLineDecoder2.NEWLINE_CHARS.has(text[text.length - 1] || "");
    let lines = text.split(_EyepopLineDecoder2.NEWLINE_REGEXP);
    if (lines.length === 1 && !trailingNewline) {
      this.buffer.push(lines[0]);
      return [];
    }
    if (this.buffer.length > 0) {
      lines = [this.buffer.join("") + lines[0], ...lines.slice(1)];
      this.buffer = [];
    }
    if (!trailingNewline) {
      this.buffer = [lines.pop() || ""];
    }
    return lines;
  }
  decodeText(bytes) {
    if (bytes == null) return "";
    if (typeof bytes === "string") return bytes;
    if (typeof Buffer !== "undefined") {
      if (bytes instanceof Buffer) {
        return bytes.toString();
      }
      if (bytes instanceof Uint8Array) {
        return Buffer.from(bytes).toString();
      }
      throw new Error(
        `Unexpected: received non-Uint8Array (${bytes.constructor.name}) stream chunk in an environment with a global "Buffer" defined, which this library assumes to be Node. Please report this error.`
      );
    }
    if (typeof TextDecoder !== "undefined") {
      if (bytes instanceof Uint8Array || bytes instanceof ArrayBuffer) {
        this.textDecoder ?? (this.textDecoder = new TextDecoder("utf8"));
        return this.textDecoder.decode(bytes);
      }
      throw new Error(`Unexpected: received non-Uint8Array/ArrayBuffer (${bytes.constructor.name}) in a web platform. Please report this error.`);
    }
    throw new Error(`Unexpected: neither Buffer nor TextDecoder are available as globals. Please report this error.`);
  }
  flush() {
    if (!this.buffer.length && !this.trailingCR) {
      return [];
    }
    const lines = [this.buffer.join("")];
    this.buffer = [];
    this.trailingCR = false;
    return lines;
  }
};
_EyepopLineDecoder.NEWLINE_CHARS = /* @__PURE__ */ new Set(["\n", "\r", "\v", "\f", "", "", "", "\x85", "\u2028", "\u2029"]);
_EyepopLineDecoder.NEWLINE_REGEXP = /\r\n|[\n\r\x0b\x0c\x1c\x1d\x1e\x85\u2028\u2029]/g;
var EyepopLineDecoder = _EyepopLineDecoder;
function readableStreamAsyncIterable(stream) {
  if (stream[Symbol.asyncIterator]) {
    return stream[Symbol.asyncIterator]();
  }
  const reader = stream.getReader();
  return {
    async next() {
      try {
        const result = await reader.read();
        if (result?.done) reader.releaseLock();
        return result;
      } catch (e3) {
        reader.releaseLock();
        throw e3;
      }
    },
    async return() {
      const cancelPromise = reader.cancel();
      reader.releaseLock();
      await cancelPromise;
      return { done: true, value: void 0 };
    },
    [Symbol.asyncIterator]() {
      return this;
    }
  };
}
function readableStreamFromString(s2) {
  return new ReadableStream({
    start(controller) {
      controller.enqueue(Buffer.from(s2));
      controller.close();
    }
  });
}
var PredictionVersion = /* @__PURE__ */ ((PredictionVersion3) => {
  PredictionVersion3[PredictionVersion3["V1"] = 1] = "V1";
  PredictionVersion3[PredictionVersion3["V2"] = 2] = "V2";
  return PredictionVersion3;
})(PredictionVersion || {});
var DEFAULT_PREDICTION_VERSION = 2;
var VideoMode = /* @__PURE__ */ ((VideoMode2) => {
  VideoMode2["STREAM"] = "stream";
  VideoMode2["BUFFER"] = "buffer";
  return VideoMode2;
})(VideoMode || {});
var PopComponentType = /* @__PURE__ */ ((PopComponentType22) => {
  PopComponentType22["FORWARD"] = "forward";
  PopComponentType22["INFERENCE"] = "inference";
  PopComponentType22["TRACING"] = "tracing";
  PopComponentType22["TRACKING"] = "tracking";
  PopComponentType22["CONTOUR_FINDER"] = "contour_finder";
  PopComponentType22["COMPONENT_FINDER"] = "component_finder";
  return PopComponentType22;
})(PopComponentType || {});
var ForwardOperatorType = /* @__PURE__ */ ((ForwardOperatorType22) => {
  ForwardOperatorType22["FULL"] = "full";
  ForwardOperatorType22["CROP"] = "crop";
  ForwardOperatorType22["CROP_WITH_FULL_FALLBACK"] = "crop_with_full_fallback";
  return ForwardOperatorType22;
})(ForwardOperatorType || {});
var InferenceType = /* @__PURE__ */ ((InferenceType2) => {
  InferenceType2["IMAGE_CLASSIFICATION"] = "image_classification";
  InferenceType2["OBJECT_DETECTION"] = "object_detection";
  InferenceType2["KEY_POINTS"] = "key_points";
  InferenceType2["OCR"] = "ocr";
  InferenceType2["MESH"] = "mesh";
  InferenceType2["FEATURE_VECTOR"] = "feature_vector";
  InferenceType2["SEMANTIC_SEGMENTATION"] = "semantic_segmentation";
  InferenceType2["SEGMENTATION"] = "segmentation";
  return InferenceType2;
})(InferenceType || {});
var MotionModel = /* @__PURE__ */ ((MotionModel2) => {
  MotionModel2["RANDOM_WALK"] = "random_walk";
  MotionModel2["CONSTANT_VELOCITY"] = "constant_velocity";
  MotionModel2["CONSTANT_ACCELERATION"] = "constant_acceleration";
  return MotionModel2;
})(MotionModel || {});
var ContourType = /* @__PURE__ */ ((ContourType2) => {
  ContourType2["ALL_PIXELS"] = "all_pixels";
  ContourType2["POLYGON"] = "polygon";
  ContourType2["CONVEX_HULL"] = "convex_hull";
  ContourType2["HOUGH_CIRCLES"] = "hough_circles";
  ContourType2["CIRCLE"] = "circle";
  ContourType2["TRIANGLE"] = "triangle";
  ContourType2["RECTANGLE"] = "rectangle";
  return ContourType2;
})(ContourType || {});
var WebrtcBase = class _WebrtcBase {
  constructor(getSession, client, ingressId, urlBasePath, is_pipeline_direct, requestLogger) {
    this._getSession = getSession;
    this._client = client;
    this._requestLogger = requestLogger;
    this._ingressId = ingressId;
    this._urlPath = `${urlBasePath}/${this._ingressId}`;
    this._is_pipeline_direct = is_pipeline_direct;
    this._pc = null;
    this._eTag = "";
    this._location = null;
    this._queuedCandidates = [];
    this._offerData = null;
  }
  async close() {
    const pc = this._pc;
    this._pc = null;
    if (pc) {
      return pc.close();
    }
  }
  ingressId() {
    return this._ingressId;
  }
  gresUrl(session, location2 = null) {
    let urlPath;
    if (this._is_pipeline_direct) {
      if (!session.pipelineId) {
        throw new Error("cannot connect with is_pipeline_direct=true but !session.pipelineId");
      }
      urlPath = import_path.default.join("pipelines", session.pipelineId, this._urlPath);
    } else {
      urlPath = this._urlPath;
    }
    if (location2) {
      urlPath = import_path.default.join(urlPath, location2);
    }
    let baseUrl;
    if (session.baseUrl?.endsWith("/")) {
      baseUrl = session.baseUrl;
    } else {
      baseUrl = session.baseUrl + "/";
    }
    return new URL(urlPath, baseUrl);
  }
  async onLocalOffer(offer) {
    if (!this._pc) {
      throw new Error("onLocalOffer no peer connection");
    }
    if (!offer.sdp) {
      throw new Error("onLocalOffer no sdp");
    }
    this._offerData = _WebrtcBase.parseOffer(offer.sdp);
    await this._pc.setLocalDescription(offer);
    const session = await this._getSession();
    const ingressUrl = this.gresUrl(session);
    const headers = {
      ...session.authenticationHeaders(),
      "Content-Type": "application/sdp"
    };
    const response = await this._client.fetch(ingressUrl, {
      headers,
      method: "POST",
      body: offer.sdp
    });
    if (response.status >= 300) {
      return Promise.reject(`unknown status code for POST '${ingressUrl}': ${response.status} (${response.statusText})`);
    }
    this._eTag = response.headers.get("ETag") ?? "";
    this._location = response.headers.get("Location");
    return await this.onRemoteAnswer(new RTCSessionDescription({
      type: "answer",
      sdp: await response.text()
    }));
  }
  async sendLocalCandidates(candidates) {
    if (!this._offerData) {
      throw new Error("sendLocalCandidates no offerData");
    }
    const session = await this._getSession();
    const ingressUrl = this.gresUrl(session, this._location);
    const headers = {
      ...session.authenticationHeaders(),
      "Content-Type": "application/trickle-ice-sdpfrag",
      "If-Match": this._eTag
    };
    const response = await this._client.fetch(ingressUrl, {
      headers,
      method: "PATCH",
      body: _WebrtcBase.generateSdpFragment(this._offerData, candidates)
    });
    if (response.status >= 300) {
      return Promise.reject(`unknown status code for PATCH '${ingressUrl}': ${response.status} (${response.statusText})`);
    }
    return this;
  }
  async onLocalCandidate(evt) {
    if (evt.candidate !== null) {
      if (this._eTag === "") {
        this._queuedCandidates.push(evt.candidate);
      } else {
        await this.sendLocalCandidates([evt.candidate]);
      }
    }
    return this;
  }
  static linkToIceServers(links) {
    const servers = links !== null ? links.split(", ").map((link) => {
      let m2 = link.match(/^<(.+?)>; rel="ice-server"(; username="(.*?)"; credential="(.*?)"; credential-type="password")?/i);
      if (!m2) {
        m2 = link.match(/^(.+?); rel="ice-server"(; username="(.*?)"; credential="(.*?)"; credential-type="password")?/i);
      }
      if (!m2) {
        return null;
      }
      const iceServer = {
        urls: [m2[1]],
        username: WebrtcWhip.unquoteCredential(m2[3]),
        credential: WebrtcWhip.unquoteCredential(m2[4])
        // credentialType: m[3]? "password" : undefined
      };
      return iceServer;
    }) : [];
    return servers.filter(function(el) {
      return el != null;
    });
  }
  static editAnswer(answer, videoCodec, audioCodec, videoBitrate, audioBitrate, audioVoice) {
    const sections = answer.split("m=");
    for (let i2 = 0; i2 < sections.length; i2++) {
      const section = sections[i2];
      if (section && section.startsWith("video")) {
        sections[i2] = WebrtcWhip.setVideoBitrate(WebrtcWhip.setCodec(section, videoCodec), videoBitrate);
      } else if (section && section.startsWith("audio")) {
        sections[i2] = WebrtcWhip.setAudioBitrate(WebrtcWhip.setCodec(section, audioCodec), audioBitrate, audioVoice);
      }
    }
    return sections.join("m=");
  }
  static setCodec(section, codec) {
    const lines = section.split("\r\n");
    const lines2 = [];
    const payloadFormats = [];
    for (const line of lines) {
      if (!line.startsWith("a=rtpmap:")) {
        lines2.push(line);
      } else {
        if (codec && line.toLowerCase().includes(codec)) {
          payloadFormats.push(line.slice("a=rtpmap:".length).split(" ")[0]);
          lines2.push(line);
        }
      }
    }
    const lines3 = [];
    for (const line of lines2) {
      if (line.startsWith("a=fmtp:")) {
        if (payloadFormats.includes(line.slice("a=fmtp:".length).split(" ")[0])) {
          lines3.push(line);
        }
      } else if (line.startsWith("a=rtcp-fb:")) {
        if (payloadFormats.includes(line.slice("a=rtcp-fb:".length).split(" ")[0])) {
          lines3.push(line);
        }
      } else {
        lines3.push(line);
      }
    }
    return lines3.join("\r\n");
  }
  static setVideoBitrate(section, bitrate) {
    let lines = section.split("\r\n");
    for (let i2 = 0; i2 < lines.length; i2++) {
      const line = lines[i2];
      if (!line) {
        continue;
      }
      if (line.startsWith("c=")) {
        lines = [...lines.slice(0, i2 + 1), "b=TIAS:" + (bitrate * 1024).toString(), ...lines.slice(i2 + 1)];
        break;
      }
    }
    return lines.join("\r\n");
  }
  static setAudioBitrate(section, bitrate, voice) {
    let opusPayloadFormat = "";
    let lines = section.split("\r\n");
    for (let i2 = 0; i2 < lines.length; i2++) {
      const line = lines[i2];
      if (!line) {
        continue;
      }
      if (line.startsWith("a=rtpmap:") && line.toLowerCase().includes("opus/")) {
        opusPayloadFormat = line.slice("a=rtpmap:".length).split(" ")[0] || "";
        break;
      }
    }
    if (opusPayloadFormat === "") {
      return section;
    }
    for (let i2 = 0; i2 < lines.length; i2++) {
      const line = lines[i2];
      if (!line) {
        continue;
      }
      if (line.startsWith("a=fmtp:" + opusPayloadFormat + " ")) {
        if (voice) {
          lines[i2] = "a=fmtp:" + opusPayloadFormat + " minptime=10;useinbandfec=1;maxaveragebitrate=" + ((bitrate ?? 0) * 1024).toString();
        } else {
          lines[i2] = "a=fmtp:" + opusPayloadFormat + " maxplaybackrate=48000;stereo=1;sprop-stereo=1;maxaveragebitrate" + ((bitrate ?? 0) * 1024).toString();
        }
      }
    }
    return lines.join("\r\n");
  }
  static parseOffer(offer) {
    let medias = [];
    let iceUfrag = "";
    let icePwd = "";
    for (const line of offer.split("\r\n")) {
      if (line.startsWith("m=")) {
        medias.push(line.slice("m=".length));
      } else if (iceUfrag === "" && line.startsWith("a=ice-ufrag:")) {
        iceUfrag = line.slice("a=ice-ufrag:".length);
      } else if (icePwd === "" && line.startsWith("a=ice-pwd:")) {
        icePwd = line.slice("a=ice-pwd:".length);
      }
    }
    return {
      iceUfrag,
      icePwd,
      medias
    };
  }
  static generateSdpFragment(offerData, candidates) {
    const candidatesByMedia = /* @__PURE__ */ new Map();
    for (const candidate of candidates) {
      if (candidate.sdpMLineIndex !== null) {
        const mid2 = candidate.sdpMLineIndex;
        let matched = candidatesByMedia.get(mid2);
        if (matched === void 0) {
          matched = [];
          candidatesByMedia.set(mid2, matched);
        }
        matched.push(candidate);
      }
    }
    let frag = "a=ice-ufrag:" + offerData.iceUfrag + "\r\na=ice-pwd:" + offerData.icePwd + "\r\n";
    let mid = 0;
    for (const media of offerData.medias) {
      let matched = candidatesByMedia.get(mid);
      if (matched !== void 0) {
        frag += "m=" + media + "\r\na=mid:" + mid + "\r\n";
        for (const candidate of matched) {
          frag += "a=" + candidate.candidate + "\r\n";
        }
      }
      mid++;
    }
    return frag;
  }
  static unquoteCredential(v2) {
    if (!v2) {
      return "";
    }
    return JSON.parse(`"${v2}"`);
  }
};
var WebrtcWhip = class extends WebrtcBase {
  constructor(stream, getSession, client, is_pipeline_direct, requestLogger) {
    super(getSession, client, v4_default().toString(), "liveIngress/whip", is_pipeline_direct, requestLogger);
    this._stream = stream;
  }
  async start() {
    const session = await this._getSession();
    const ingressUrl = this.gresUrl(session);
    const response = await this._client.fetch(ingressUrl, {
      headers: session.authenticationHeaders(),
      method: "GET"
    });
    if (response.status >= 300) {
      return Promise.reject(`unknown status code for GET '${ingressUrl}': ${response.status} (${response.statusText})`);
    }
    return await this.onIceServers(response);
  }
  async stream() {
    if (this._stream) {
      return Promise.resolve(this._stream);
    } else {
      return Promise.reject("fetching stream failed");
    }
  }
  async onRemoteAnswer(answer) {
    if (!this._pc) {
      throw new Error("onLocalOffer no peer connection");
    }
    await this._pc.setRemoteDescription(new RTCSessionDescription(answer));
    if (this._queuedCandidates.length !== 0) {
      await this.sendLocalCandidates(this._queuedCandidates);
      this._queuedCandidates = [];
    }
    return this;
  }
  async onIceServers(response) {
    if (!this._stream) {
      throw new Error("onIceServers no stream");
    }
    const stream = this._stream;
    const pc = new RTCPeerConnection({
      iceServers: WebrtcBase.linkToIceServers(response.headers.get("Link"))
    });
    this._pc = pc;
    pc.onicecandidate = (evt) => this.onLocalCandidate(evt);
    return new Promise(async (resolve, reject) => {
      pc.oniceconnectionstatechange = () => {
        switch (pc.iceConnectionState) {
          case "failed":
          case "disconnected":
            reject(`peer connection: ${pc.iceConnectionState}`);
            break;
          case "connected":
            resolve(this);
            break;
        }
      };
      stream.getTracks().forEach((track) => {
        this._requestLogger.debug("onIceServers our stream has track: %s", track);
        pc.addTrack(track, stream);
      });
      stream.addEventListener("addtrack", (trackEvent) => {
        this._requestLogger.debug("onIceServers got lazy track: ", trackEvent.track);
        pc.addTrack(trackEvent.track, stream);
      });
      await this.onLocalOffer(await pc.createOffer());
    });
  }
  async close() {
    const stream = this._stream;
    this._stream = null;
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => {
        track.stop();
      });
    }
    return super.close();
  }
};
var AbstractJob = class {
  constructor(params, getSession, client, requestLogger, version = DEFAULT_PREDICTION_VERSION) {
    this._responseStream = null;
    this._controller = new AbortController();
    this._getSession = getSession;
    this._params = params ?? null;
    this._client = client;
    this._requestLogger = requestLogger;
    this._version = version;
  }
  [Symbol.asyncIterator]() {
    if (!this._responseStream) {
      throw Error("logical bug");
    }
    return Stream.iterFromReadableStream(this._responseStream, this._controller, async (event) => {
      return await this.onEvent(event);
    });
  }
  async startJob() {
    return Promise.reject("abstract class");
  }
  async onEvent(event) {
    if (event.type == "error") {
      return Promise.reject(`Error event for source ${event.source_id}: ${event.message}`);
    }
    return Promise.resolve();
  }
  start(done, status) {
    this._responseStream = new Promise(async (resolve, reject) => {
      try {
        let retries = 1;
        while (true) {
          try {
            const response = await this.startJob();
            if (response.status == 401) {
              status(response.status);
              if (retries--) {
                this._requestLogger.info("received 401 response, attempt to reauthorize once");
              } else {
                reject(`response ${response.status}: ${response.statusText}`);
                break;
              }
            } else if (response.status == 404) {
              status(response.status);
              if (retries--) {
                this._requestLogger.info("received 404 response, attempt to restart pop");
              } else {
                reject(`response ${response.status}: ${response.statusText}`);
                break;
              }
            } else if (response.status != 200) {
              reject(`upload error ${response.status}: ${await response.text()}`);
              break;
            } else if (response.body) {
              resolve(response.body);
              break;
            } else {
              const text = await response.text();
              if (text) {
                resolve(readableStreamFromString(text));
                break;
              } else {
                reject("response body is empty");
                break;
              }
            }
          } catch (error) {
            if (retries--) {
              this._requestLogger.info("unknown, attempt to restart pop (as if we received 404)", error);
              status(404);
            } else {
              status(500);
              reject(error);
              break;
            }
          }
        }
      } catch (reason) {
        reject(reason);
      } finally {
        done();
      }
    });
    return this;
  }
  cancel() {
    this._controller.abort("cancelled");
  }
};
AbstractJob.n = 0;
var UploadJob = class extends AbstractJob {
  get [Symbol.toStringTag]() {
    return "uploadJob";
  }
  constructor(stream, mimeType, size, videoMode, params, getSession, client, requestLogger) {
    super(params, getSession, client, requestLogger);
    this._uploadStream = stream;
    this._mimeType = mimeType;
    this._size = size;
    this._videoMode = videoMode;
    this._needsFullDuplex = !client.isFullDuplex() && mimeType.startsWith("video/") && videoMode == "stream";
  }
  async onEvent(event) {
    if (event.type == "prepared") {
      if (!event.source_id) {
        return Promise.reject("did not get a prepared sourceId to simulate full duplex");
      }
      const session = await this._getSession();
      if (!session.baseUrl) {
        return Promise.reject("session.baseUrl must not ne null");
      }
      let request;
      const videoModeQuery = this._videoMode ? `&videoMode=${this._videoMode}` : "";
      const versionQuery = this._version ? `&version=${this._version}` : "";
      const postUrl = `${session.baseUrl.replace(/\/+$/, "")}/pipelines/${session.pipelineId}/source?mode=queue&processing=async&sourceId=${event.source_id}${videoModeQuery}${versionQuery}`;
      if (this._params) {
        const params = JSON.stringify(this._params);
        const paramBlob = new Blob([params], { type: "application/json" });
        const formData = new FormData();
        const fileBlob = await new Response(this._uploadStream).blob();
        formData.append("params", paramBlob);
        formData.append("file", fileBlob);
        const headers = {
          ...session.authenticationHeaders(),
          Accept: "application/jsonl"
        };
        request = this._client.fetch(postUrl, {
          headers,
          method: "POST",
          body: formData,
          signal: this._controller.signal,
          // @ts-ignore
          duplex: "half",
          eyepop: { responseStreaming: true }
        });
      } else {
        const headers = {
          ...session.authenticationHeaders(),
          Accept: "application/jsonl",
          "Content-Type": this._mimeType
        };
        if (this._size) {
          headers["Content-Length"] = `${this._size}`;
        }
        request = this._client.fetch(postUrl, {
          headers,
          method: "POST",
          body: this._uploadStream,
          signal: this._controller.signal,
          // @ts-ignore
          duplex: "half",
          eyepop: { responseStreaming: true }
        });
      }
      request.then(async (value2) => {
        if (value2.status != 204) {
          this._requestLogger.debug(`unexpected status ${value2.status} (${await value2.text()}) for POST ${postUrl}`);
        }
      }).catch((reason) => {
        this._requestLogger.debug(`error ${reason} for POST ${postUrl}`);
      });
    }
    return Promise.resolve();
  }
  async startJob() {
    const session = await this._getSession();
    if (!session.baseUrl) {
      return Promise.reject("session.baseUrl must not be null");
    }
    let response;
    if (this._needsFullDuplex) {
      const prepareUrl = `${session.baseUrl.replace(/\/+$/, "")}/pipelines/${session.pipelineId}/prepareSource?timeout=10s`;
      const headers = {
        ...session.authenticationHeaders(),
        Accept: "application/jsonl"
      };
      response = await this._client.fetch(prepareUrl, {
        headers,
        method: "POST",
        signal: this._controller.signal,
        // @ts-ignore
        duplex: "half",
        eyepop: { responseStreaming: true }
      });
    } else {
      const videoModeQuery = this._videoMode ? `&videoMode=${this._videoMode}` : "";
      const versionQuery = this._version ? `&version=${this._version}` : "";
      const postUrl = `${session.baseUrl.replace(/\/+$/, "")}/pipelines/${session.pipelineId}/source?mode=queue&processing=sync${videoModeQuery}${versionQuery}`;
      if (this._params) {
        const params = JSON.stringify(this._params);
        const paramBlob = new Blob([params], { type: "application/json" });
        const formData = new FormData();
        const fileBlob = await new Response(this._uploadStream).blob();
        formData.append("params", paramBlob);
        formData.append("file", fileBlob);
        const headers = {
          ...session.authenticationHeaders(),
          Accept: "application/jsonl"
        };
        response = await this._client.fetch(postUrl, {
          headers,
          method: "POST",
          body: formData,
          signal: this._controller.signal,
          // @ts-ignore
          duplex: "half",
          eyepop: { responseStreaming: true }
        });
      } else {
        const headers = {
          ...session.authenticationHeaders(),
          Accept: "application/jsonl",
          "Content-Type": this._mimeType
        };
        if (this._size) {
          headers["Content-Length"] = `${this._size}`;
        }
        response = await this._client.fetch(postUrl, {
          headers,
          method: "POST",
          body: this._uploadStream,
          signal: this._controller.signal,
          // @ts-ignore
          duplex: "half"
        });
      }
    }
    return response;
  }
};
var LoadFromJob = class extends AbstractJob {
  constructor(location2, params, getSession, client, requestLogger) {
    super(params, getSession, client, requestLogger);
    this._location = location2;
  }
  get [Symbol.toStringTag]() {
    return "loadFromJob";
  }
  async startJob() {
    const session = await this._getSession();
    if (!session.baseUrl) {
      return Promise.reject("session.baseUrl must not ne null");
    }
    const body = {
      sourceType: "URL",
      url: this._location,
      params: this._params,
      version: this._version
    };
    const headers = {
      ...session.authenticationHeaders(),
      Accept: "application/jsonl",
      "Content-Type": "application/json"
    };
    const patchUrl = `${session.baseUrl.replace(/\/+$/, "")}/pipelines/${session.pipelineId}/source?mode=queue&processing=sync`;
    return await this._client.fetch(patchUrl, {
      headers,
      method: "PATCH",
      body: JSON.stringify(body),
      signal: this._controller.signal,
      // @ts-ignore
      eyepop: { responseStreaming: true }
    });
  }
};
var LoadFromAssetUuidJob = class extends AbstractJob {
  constructor(assetUuid, params, getSession, client, requestLogger) {
    super(params, getSession, client, requestLogger);
    this._assetUuid = assetUuid;
  }
  get [Symbol.toStringTag]() {
    return "loadFromAssetUuidJob";
  }
  async startJob() {
    const session = await this._getSession();
    if (!session.baseUrl) {
      return Promise.reject("session.baseUrl must not ne null");
    }
    const body = {
      sourceType: "ASSET_UUID",
      assetUuid: this._assetUuid,
      params: this._params,
      version: this._version
    };
    const headers = {
      ...session.authenticationHeaders(),
      Accept: "application/jsonl",
      "Content-Type": "application/json"
    };
    const patchUrl = `${session.baseUrl.replace(/\/+$/, "")}/pipelines/${session.pipelineId}/source?mode=queue&processing=sync`;
    return await this._client.fetch(patchUrl, {
      headers,
      method: "PATCH",
      body: JSON.stringify(body),
      signal: this._controller.signal,
      // @ts-ignore
      eyepop: { responseStreaming: true }
    });
  }
};
var LoadLiveIngressJob = class extends AbstractJob {
  constructor(ingressId, params, getSession, client, requestLogger) {
    super(params, getSession, client, requestLogger);
    this._ingressId = ingressId;
  }
  get [Symbol.toStringTag]() {
    return "loadLiveIngressJob";
  }
  async startJob() {
    const session = await this._getSession();
    if (!session.baseUrl) {
      return Promise.reject("session.baseUrl must not ne null");
    }
    const body = {
      sourceType: "LIVE_INGRESS",
      liveIngressId: this._ingressId,
      params: this._params,
      version: this._version
    };
    const headers = {
      ...session.authenticationHeaders(),
      Accept: "application/jsonl",
      "Content-Type": "application/json"
    };
    const patchUrl = `${session.baseUrl.replace(/\/+$/, "")}/pipelines/${session.pipelineId}/source?mode=preempt&processing=sync`;
    return await this._client.fetch(patchUrl, {
      headers,
      method: "PATCH",
      body: JSON.stringify(body),
      signal: this._controller.signal,
      // @ts-ignore
      eyepop: { responseStreaming: true }
    });
  }
};
var LoadMediaStreamJob = class extends AbstractJob {
  constructor(mediaStream, params, getSession, client, requestLogger) {
    super(params, getSession, client, requestLogger);
    this._mediaStream = mediaStream;
  }
  get [Symbol.toStringTag]() {
    return "loadLiveIngressJob";
  }
  async startJob() {
    const session = await this._getSession();
    if (!session.baseUrl) {
      return Promise.reject("session.baseUrl must not ne null");
    }
    const whip = new WebrtcWhip(
      this._mediaStream,
      async () => {
        return session;
      },
      this._client,
      true,
      this._requestLogger
    );
    whip.start().then((_2) => {
      this._requestLogger.debug("direct whip for ingressId=%s successful", whip.ingressId());
    }).catch((reason) => {
      this._controller.abort(reason);
    });
    const body = {
      sourceType: "WHIP",
      whipIngressId: whip.ingressId(),
      params: this._params,
      version: this._version
    };
    const headers = {
      ...session.authenticationHeaders(),
      Accept: "application/jsonl",
      "Content-Type": "application/json"
    };
    const patchUrl = `${session.baseUrl.replace(/\/+$/, "")}/pipelines/${session.pipelineId}/source?mode=preempt&processing=sync`;
    return await this._client.fetch(patchUrl, {
      headers,
      method: "PATCH",
      body: JSON.stringify(body),
      signal: this._controller.signal,
      // @ts-ignore
      eyepop: { responseStreaming: true }
    });
  }
};
var resolvePath;
if ("document" in globalThis && "implementation" in globalThis.document) {
  resolvePath = async (_source, _logger) => {
    throw new DOMException("resolving a path to a file is not supported in browser");
  };
} else {
  let iteratorToStream = function(iterator) {
    return new ReadableStream({
      async pull(controller) {
        const { value: value2, done } = await iterator.next();
        if (done) {
          controller.close();
        } else {
          controller.enqueue(new Uint8Array(value2));
        }
      }
    });
  };
  iteratorToStream2 = iteratorToStream;
  async function* nodeStreamToIterator(stream) {
    for await (const chunk of stream) {
      yield chunk;
    }
  }
  resolvePath = async (source, _2) => {
    const mime = require_mime_types();
    const filehandle = __require2("fs/promises");
    const fd = await filehandle.open(source.path, "r");
    const stream = fd.createReadStream();
    const iterator = nodeStreamToIterator(stream);
    const webStream = iteratorToStream(iterator);
    const mimeType = source.mimeType ? source.mimeType : mime.lookup(source.path) || "image/*";
    return {
      stream: webStream,
      mimeType
    };
  };
}
var iteratorToStream2;
var createHttpClient;
function logLineFromRequest(input, init) {
  const url2 = input instanceof Request ? input.url : input;
  const method = input instanceof Request ? input.method : init?.method || (init?.body !== void 0 ? "POST" : "GET");
  return `${method} ${url2}`;
}
if ("document" in globalThis && "implementation" in globalThis.document) {
  class BrowserHttpClient {
    constructor(logger) {
      this._logger = logger;
    }
    async fetch(input, init) {
      const logLine = logLineFromRequest(input, init);
      this._logger.debug(`Browser fetch() BEFORE ${logLine}`);
      const response = await fetch(input, init);
      this._logger.debug(`AFTER ${logLine} -> ${response.status}`);
      return response;
    }
    async close() {
    }
    isFullDuplex() {
      return false;
    }
  }
  createHttpClient = async (logger) => {
    return new BrowserHttpClient(logger);
  };
} else {
  class NodeHttpClient {
    constructor(agent, logger) {
      this._agent = agent;
      this._logger = logger;
    }
    async fetch(input, init) {
      init || (init = {});
      init.dispatcher = this._agent;
      const logLine = logLineFromRequest(input, init);
      this._logger.debug(`Node fetch() BEFORE ${logLine}`);
      const response = await fetch(input, init);
      this._logger.debug(`AFTER ${logLine} -> ${response.status}`);
      return response;
    }
    async close() {
      return this._agent.close();
    }
    isFullDuplex() {
      return false;
    }
  }
  createHttpClient = async (logger) => {
    const undici = __require2("undici");
    const agent = new undici.Agent({
      keepAliveTimeout: 1e4,
      connections: 5,
      // two parallel streaming requests to the same host seem to deadlock with pipelining > 0
      pipelining: 0
    });
    logger.debug("Using node fetch with undici agent as http client");
    return new NodeHttpClient(agent, logger);
  };
}
var Semaphore = class {
  /**
   * Creates a semaphore.
   * @param permits  The number of permits, i.e. strands of execution being allowed
   * to run in parallel.
   * This number can be initialized with a negative integer.
   */
  constructor(permits) {
    this.promiseResolverQueue = [];
    this.permits = permits;
  }
  /**
   * Returns the number of available permits.
   * @returns  The number of available permits.
   */
  getPermits() {
    return this.permits;
  }
  /**
   * Returns a promise used to wait for a permit to become available. This method should be awaited on.
   * @returns  A promise that gets resolved when execution is allowed to proceed.
   */
  async wait() {
    if (this.permits > 0) {
      this.permits -= 1;
      return Promise.resolve(true);
    }
    return new Promise((resolver) => this.promiseResolverQueue.push(resolver));
  }
  /**
   * Alias for {@linkcode Semaphore.wait}.
   * @returns  A promise that gets resolved when execution is allowed to proceed.
   */
  async acquire() {
    return this.wait();
  }
  /**
   * Same as {@linkcode Semaphore.wait} except the promise returned gets resolved with false if no
   * permit becomes available in time.
   * @param milliseconds  The time spent waiting before the wait is aborted. This is a lower bound,
   * you shouldn't rely on it being precise.
   * @returns  A promise that gets resolved to true when execution is allowed to proceed or
   * false if the time given elapses before a permit becomes available.
   */
  async waitFor(milliseconds) {
    if (this.permits > 0) {
      this.permits -= 1;
      return Promise.resolve(true);
    }
    let resolver = (_2) => void 0;
    const promise = new Promise((r2) => {
      resolver = r2;
    });
    this.promiseResolverQueue.push(resolver);
    setTimeout(() => {
      const index = this.promiseResolverQueue.indexOf(resolver);
      if (index !== -1) {
        this.promiseResolverQueue.splice(index, 1);
      } else {
        console.warn(`Semaphore.waitFor couldn't find its promise resolver in the queue`);
      }
      resolver(false);
    }, milliseconds);
    return promise;
  }
  /**
   * Synchronous function that tries to acquire a permit and returns true if successful, false otherwise.
   * @returns  Whether a permit could be acquired.
   */
  tryAcquire() {
    if (this.permits > 0) {
      this.permits -= 1;
      return true;
    }
    return false;
  }
  /**
   * Acquires all permits that are currently available and returns the number of acquired permits.
   * @returns  Number of acquired permits.
   */
  drainPermits() {
    if (this.permits > 0) {
      const permitCount = this.permits;
      this.permits = 0;
      return permitCount;
    }
    return 0;
  }
  /**
   * Increases the number of permits by one. If there are other functions waiting, one of them will
   * continue to execute in a future iteration of the event loop.
   */
  signal() {
    this.permits += 1;
    if (this.permits > 1 && this.promiseResolverQueue.length > 0) {
      console.warn("Semaphore.permits should never be > 0 when there is someone waiting.");
    } else if (this.permits === 1 && this.promiseResolverQueue.length > 0) {
      this.permits -= 1;
      const nextResolver = this.promiseResolverQueue.shift();
      if (nextResolver) {
        nextResolver(true);
      }
    }
  }
  /**
   * Alias for {@linkcode Semaphore.signal}.
   */
  release() {
    this.signal();
  }
  /**
   * Schedules func to be called once a permit becomes available.
   * Returns a promise that resolves to the return value of func.
   * @typeparam T  The return type of func.
   * @param func  The function to be executed.
   * @return  A promise that gets resolved with the return value of the function.
   */
  async execute(func) {
    await this.wait();
    try {
      return await func();
    } finally {
      this.signal();
    }
  }
};
var authenticateBrowserSession;
if ("document" in globalThis && "implementation" in globalThis.document) {
  authenticateBrowserSession = async (auth0, options) => {
    if (options.eyepopUrl == null) {
      return Promise.reject("options.eyepopUrl cannot be null");
    }
    const auth0ClientOptions = {
      clientId: auth0.clientId,
      domain: auth0.domain,
      authorizationParams: {
        scope: auth0.scope,
        audience: auth0.audience
      }
    };
    const auth0Client = await oa(auth0ClientOptions);
    if (!await auth0Client.isAuthenticated()) {
      await auth0Client.loginWithPopup();
    }
    const accessToken = await auth0Client.getTokenSilently();
    if (!accessToken) {
      return Promise.reject("auth0 login failed");
    }
    let session;
    const workerOptions = options;
    if (typeof workerOptions.popId != "undefined") {
      const workerSession = {
        eyepopUrl: options.eyepopUrl,
        accessToken,
        validUntil: Date.now() + 60 * 60 * 1e3,
        popId: workerOptions.popId,
        baseUrl: void 0,
        pipelineId: void 0,
        authenticationHeaders: () => {
          return { Authorization: `Bearer ${accessToken}` };
        }
      };
      session = workerSession;
    } else {
      session = {
        eyepopUrl: options.eyepopUrl,
        accessToken,
        validUntil: Date.now() + 60 * 60 * 1e3
      };
    }
    return session;
  };
} else {
  authenticateBrowserSession = (_auth0, _options) => {
    return Promise.reject("auth0 login not supported server-side");
  };
}
var Endpoint = class {
  constructor(options) {
    this._options = options;
    this._token = null;
    this._expire_token_time = null;
    this._client = null;
    this._statusRetryHandlers = /* @__PURE__ */ new Map();
    this._statusRetryHandlers.set(401, this.statusHandler401);
    this._limit = new Semaphore(this._options.jobQueueLength ?? 1024);
    this._state = "Idle";
    this._message = null;
    this._stateChangeHandler = null;
    let rootLogger;
    if (options.logger) {
      rootLogger = options.logger;
    } else {
      rootLogger = (0, import_pino.pino)();
    }
    this._logger = rootLogger.child({ module: "eyepop" });
    this._requestLogger = this._logger.child({ module: "requests" });
  }
  setStatusRetryHandlers(statusRetryHandlers = void 0) {
    this._statusRetryHandlers = new Map(statusRetryHandlers);
    this._statusRetryHandlers.set(401, this.statusHandler401);
  }
  eyepopUrl() {
    if (this._options.eyepopUrl) {
      return this._options.eyepopUrl.replace(/\/+$/, "");
    } else {
      return "https://compute.eyepop.ai";
    }
  }
  // TODO: deprecated Web API endpoint needed for POP_ID support
  eyepopWebApiUrl() {
    if (this._options.eyepopUrl) {
      return this._options.eyepopUrl.replace(/\/+$/, "").replace(/compute\./, "web-api.");
    } else {
      return "https://api.eyepop.ai";
    }
  }
  pendingJobs() {
    return (this._options.jobQueueLength ?? 1024) - this._limit.getPermits();
  }
  state() {
    return this._state;
  }
  lastMessage() {
    return this._message;
  }
  onStateChanged(handler) {
    this._stateChangeHandler = handler;
    return this;
  }
  updateState(newState = void 0, message = void 0) {
    const fromState = this._state;
    if (newState == void 0) {
      if (this._limit.getPermits() == this._options.jobQueueLength) {
        newState = "Idle";
      } else {
        newState = "Busy";
      }
    }
    this._state = newState;
    this._message = message ? message : null;
    if (this._stateChangeHandler) {
      this._stateChangeHandler(fromState, this._state);
    }
  }
  async connect() {
    if (this._client) {
      this._logger.warn("endpoint already connected");
      return this;
    }
    if (!this._options.eyepopUrl) {
      return Promise.reject("option eyepopUrl or environment variable EYEPOP_URL is required");
    }
    if (this._options.auth === void 0) {
      return Promise.reject("cannot connect without defined auth option");
    }
    if (this._options.auth.session !== void 0) {
      this._token = this._options.auth.session.accessToken;
      this._expire_token_time = this._options.auth.session.validUntil / 1e3;
    } else if (this._options.auth.oAuth2 !== void 0) {
    } else if (this._options.auth.apiKey !== void 0) {
    } else if (this._options.auth.isLocal !== void 0) {
    } else {
      return Promise.reject("option apiKey or environment variable EYEPOP_API_KEY is required");
    }
    if (this._options.platformSupport?.createHttpClient !== void 0) {
      this._client = await this._options.platformSupport.createHttpClient(this._requestLogger);
    } else {
      this._client = await createHttpClient(this._requestLogger);
    }
    return await this.reconnect();
  }
  async disconnect(wait = true) {
    if (wait && this._limit) {
      for (let j2 = 0; j2 < this._options.jobQueueLength; j2++) {
        await this._limit.acquire();
      }
    }
    this._limit = new Semaphore(this._options.jobQueueLength ?? 1024);
    if (this._client) {
      await this._client.close();
      this._client = null;
    }
  }
  async session() {
    await this.currentAccessToken();
    if (this._token == null || this._expire_token_time == null) {
      return Promise.reject("endpoint not connected");
    }
    return {
      eyepopUrl: this._options.eyepopUrl,
      accessToken: this._token,
      validUntil: this._expire_token_time * 1e3
    };
  }
  statusHandler401(_statusCode) {
    this._token = null;
    this._expire_token_time = null;
  }
  async fetchWithRetry(fetcher, retries = 1) {
    while (true) {
      try {
        const response = await fetcher();
        if (response.ok) {
          return response;
        } else {
          const handler = this._statusRetryHandlers.get(response.status);
          if (handler != null) {
            handler(response.status);
            if (retries--) {
              this._requestLogger.info("received %d response, retry", response.status);
            } else {
              return response;
            }
          } else {
            return response;
          }
        }
      } catch (error) {
        const handler = this._statusRetryHandlers.get(404);
        if (handler != null) {
          handler(error);
          if (retries--) {
            this._requestLogger.info("error %s, retry", error);
          } else {
            return Promise.reject(`error ${error}`);
          }
        } else {
          return Promise.reject(`error ${error}`);
        }
      }
    }
  }
  async reconnect() {
    throw new Error("reconnect() not implemented");
  }
  async authorizationHeader() {
    if (this._options.auth.isLocal !== void 0) {
      return `Implicit`;
    }
    return `Bearer ${await this.currentAccessToken()}`;
  }
  async currentAccessToken() {
    const now = Date.now() / 1e3;
    if (!this._token || this._expire_token_time < now) {
      this.updateState(
        "Authenticating"
        /* Authenticating */
      );
      try {
        if (!this._client) {
          return Promise.reject("endpoint not connected");
        } else if (this._options.auth.isLocal !== void 0) {
          this._token = "implicit";
          this._expire_token_time = Number.MAX_VALUE;
        } else if (this._options.auth.session !== void 0) {
          return Promise.reject("temporary access token expired");
        } else if (this._options.auth.oAuth2 !== void 0 && this._options.eyepopUrl) {
          const session = await authenticateBrowserSession(this._options.auth.oAuth2, this._options);
          this._token = session.accessToken;
          this._expire_token_time = session.validUntil / 1e3;
        } else if (this._options.auth.apiKey !== void 0 && this._options.eyepopUrl) {
          const headers = { "Authorization": `Bearer ${this._options.auth.apiKey}` };
          const post_url = `${this.eyepopUrl()}/v1/auth/authenticate`;
          const response = await this._client.fetch(post_url, {
            method: "POST",
            headers
          });
          if (response.status != 200) {
            const message = await response.text();
            return Promise.reject(`Unexpected status ${response.status}: ${message}`);
          }
          const data = await response.json();
          const token = data;
          this._token = token.access_token;
          this._expire_token_time = now + token.expires_in - 60;
        } else {
          return Promise.reject("no valid auth option");
        }
      } finally {
        this.updateState();
      }
    }
    this._logger.debug("using access token, valid for at least %d seconds", this._expire_token_time - now);
    return this._token;
  }
};
var TransientPopId = /* @__PURE__ */ ((TransientPopId2) => {
  TransientPopId2["Transient"] = "transient";
  return TransientPopId2;
})(TransientPopId || {});
var SessionStatus = /* @__PURE__ */ ((SessionStatus2) => {
  SessionStatus2["UNKNOWN"] = "unknown";
  SessionStatus2["PENDING"] = "pending";
  SessionStatus2["RUNNING"] = "running";
  SessionStatus2["STOPPED"] = "stopped";
  SessionStatus2["FAILED"] = "failed";
  SessionStatus2["ERROR"] = "error";
  SessionStatus2["PIPELINE_CREATING"] = "pipeline_creating";
  SessionStatus2["PIPELINE_OK"] = "pipeline_ok";
  SessionStatus2["PIPELINE_CHECKING"] = "pipeline_checking";
  SessionStatus2["PIPELINE_ERROR"] = "pipeline_error";
  return SessionStatus2;
})(SessionStatus || {});
var sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
var _WorkerEndpoint = class _WorkerEndpoint2 extends Endpoint {
  constructor(options) {
    super(options);
    this.setStatusRetryHandlers(/* @__PURE__ */ new Map([[404, (statusCode) => this.statusHandler404(statusCode)]]));
    this._baseUrl = null;
    this._pipelineId = null;
    this._popName = null;
    this._pipeline = null;
  }
  options() {
    return this._options;
  }
  async disconnect(wait = true) {
    if (this.options().popId == "transient" && this._pipelineId) {
      const deleteUrl = `${this._baseUrl}/pipelines/${this._pipelineId}`;
      const headers = {
        Authorization: await this.authorizationHeader()
      };
      let response = await this._client?.fetch(deleteUrl, {
        method: "DELETE",
        headers
      });
      if (response?.status != 204) {
        const message = await response?.text();
        this._logger.info(`stopping pipeline failed, status ${response?.status}: ${message}`);
      }
    }
    return super.disconnect(wait);
  }
  statusHandler404(_2) {
    this._pipelineId = null;
    this._baseUrl = null;
  }
  async session() {
    const session = await super.session();
    if (this._baseUrl == null || this._pipelineId == null) {
      await this.reconnect();
      if (this._baseUrl == null || this._pipelineId == null) {
        return Promise.reject("endpoint not connected");
      }
    }
    return {
      eyepopUrl: session.eyepopUrl,
      accessToken: session.accessToken,
      validUntil: session.validUntil,
      popId: this.options().popId,
      baseUrl: this._baseUrl,
      pipelineId: this._pipelineId,
      authenticationHeaders: () => this._authenticationHeaders(session)
    };
  }
  popName() {
    return this._popName;
  }
  pop() {
    if (this._pipeline) {
      return this._pipeline.pop || null;
    } else {
      return null;
    }
  }
  async changePop(pop) {
    const client = this._client;
    const baseUrl = this._baseUrl;
    if (!baseUrl || !client) {
      return Promise.reject("endpoint not connected, use connect()");
    }
    let response = await this.fetchWithRetry(async () => {
      const session = await this.session();
      let headers = {
        "Content-Type": "application/json",
        ...this._authenticationHeaders(session)
      };
      const patch_url = `${session.baseUrl}/pipelines/${session.pipelineId}/pop`;
      return await client.fetch(patch_url, {
        method: "PATCH",
        body: JSON.stringify(pop),
        headers
      });
    });
    if (response.status != 204) {
      const message = await response.text();
      throw new Error(`Unexpected status ${response.status}: ${message}`);
    }
    if (this._pipeline) {
      this._pipeline.pop = pop;
    } else {
      this._pipeline = {
        id: this._pipelineId || "unknown",
        state: "idle",
        startTime: (/* @__PURE__ */ new Date()).toString(),
        pop
      };
    }
  }
  _authenticationHeaders(session) {
    return this._options.auth.isLocal !== void 0 ? {} : { Authorization: `Bearer ${session.accessToken}` };
  }
  popId() {
    return this.options().popId || null;
  }
  async process(source, params) {
    if (source.file !== void 0) {
      return this.uploadFile(source, params);
    } else if (source.stream !== void 0) {
      return this.uploadStream(source, params);
    } else if (source.path !== void 0) {
      return this.uploadPath(source, params);
    } else if (source.url !== void 0) {
      return this.loadFrom(source, params);
    } else if (source.assetUuid !== void 0) {
      return this.loadFromAssetUuid(source, params);
    } else if (source.mediaStream !== void 0) {
      return this.loadMediaStream(source, params);
    } else {
      return Promise.reject("unknown source type");
    }
  }
  async uploadFile(source, params) {
    if (!this._baseUrl || !this._pipelineId || !this._client || !this._limit) {
      return Promise.reject("endpoint not connected, use connect()");
    }
    await this._limit.acquire();
    try {
      this.updateState();
      const job = new UploadJob(
        source.file,
        source.file.type,
        source.file.size,
        source.videoMode,
        params,
        async () => {
          return this.session();
        },
        this._client,
        this._requestLogger
      );
      return job.start(
        () => {
          this.jobDone(job);
        },
        (statusCode) => {
          this.jobStatus(job, statusCode);
        }
      );
    } catch (e3) {
      this._limit.release();
      throw e3;
    }
  }
  async uploadStream(source, params) {
    if (!this._baseUrl || !this._pipelineId || !this._client || !this._limit) {
      return Promise.reject("endpoint not connected, use connect()");
    }
    await this._limit.acquire();
    try {
      this.updateState();
      const job = new UploadJob(
        source.stream,
        source.mimeType,
        source.size,
        source.videoMode,
        params,
        async () => {
          return this.session();
        },
        this._client,
        this._requestLogger
      );
      return job.start(
        () => {
          this.jobDone(job);
        },
        (statusCode) => {
          this.jobStatus(job, statusCode);
        }
      );
    } catch (e3) {
      this._limit.release();
      throw e3;
    }
  }
  async uploadPath(source, params) {
    if (!this._baseUrl || !this._pipelineId || !this._client || !this._limit) {
      throw new Error("endpoint not connected, use connect()");
    }
    await this._limit.acquire();
    try {
      this.updateState();
      let streamSource;
      if (this._options.platformSupport?.resolvePath) {
        streamSource = await this._options.platformSupport.resolvePath(source, this._logger);
      } else {
        streamSource = await resolvePath(source, this._logger);
      }
      const job = new UploadJob(
        streamSource.stream,
        streamSource.mimeType,
        streamSource.size,
        source.videoMode,
        params,
        async () => {
          return this.session();
        },
        this._client,
        this._requestLogger
      );
      return job.start(
        () => {
          this.jobDone(job);
        },
        (statusCode) => {
          this.jobStatus(job, statusCode);
        }
      );
    } catch (e3) {
      this._limit.release();
      throw e3;
    }
  }
  async loadFrom(source, params) {
    if (source.url.startsWith("file://")) {
      return await this.uploadPath({
        path: source.url.substring("file://".length)
      }, params);
    }
    if (!this._baseUrl || !this._pipelineId || !this._client || !this._limit) {
      throw new Error("endpoint not connected, use connect()");
    }
    await this._limit.acquire();
    try {
      this.updateState();
      const job = new LoadFromJob(
        source.url,
        params,
        async () => {
          return this.session();
        },
        this._client,
        this._requestLogger
      );
      return job.start(
        () => {
          this.jobDone(job);
        },
        (statusCode) => {
          this.jobStatus(job, statusCode);
        }
      );
    } catch (e3) {
      this._limit.release();
      throw e3;
    }
  }
  async loadFromAssetUuid(source, params) {
    if (!this._baseUrl || !this._pipelineId || !this._client || !this._limit) {
      throw new Error("endpoint not connected, use connect()");
    }
    await this._limit.acquire();
    try {
      this.updateState();
      const job = new LoadFromAssetUuidJob(
        source.assetUuid,
        params,
        async () => {
          return this.session();
        },
        this._client,
        this._requestLogger
      );
      return job.start(
        () => {
          this.jobDone(job);
        },
        (statusCode) => {
          this.jobStatus(job, statusCode);
        }
      );
    } catch (e3) {
      this._limit.release();
      throw e3;
    }
  }
  async loadMediaStream(source, params) {
    if (!this._baseUrl || !this._pipelineId || !this._client || !this._limit) {
      throw new Error("endpoint not connected, use connect()");
    }
    await this._limit.acquire();
    try {
      this.updateState();
      const job = new LoadMediaStreamJob(
        source.mediaStream,
        params,
        async () => {
          return this.session();
        },
        this._client,
        this._requestLogger
      );
      return job.start(
        () => {
          this.jobDone(job);
        },
        (statusCode) => {
          this.jobStatus(job, statusCode);
        }
      );
    } catch (e3) {
      this._limit.release();
      throw e3;
    }
  }
  jobDone(_2) {
    this._limit?.release();
    this.updateState();
  }
  jobStatus(_2, statusCode) {
    if (statusCode == 404) {
      this.statusHandler404(statusCode);
    } else if (statusCode == 401) {
      this.statusHandler401(statusCode);
    }
  }
  async reconnect() {
    if (this.options().popId == "transient") {
      await this.startComputeSession();
      this._pipelineId = await this.startTransientPipeline();
    } else {
      await this.startWebApiSessionWithPopId();
    }
    this.updateState();
    return Promise.resolve(this);
  }
  async startWebApiSessionWithPopId() {
    if (!this._client) {
      throw new Error("endpoint not initialized");
    }
    const config_url = `${this.eyepopWebApiUrl()}/pops/${this.options().popId}/config?auto_start=false`;
    const headers = {
      Authorization: await this.authorizationHeader()
    };
    this.updateState(
      "FetchConfig"
      /* FetchConfig */
    );
    let response = await this._client.fetch(config_url, { headers });
    if (response.status == 401) {
      this._requestLogger.debug("GET %s: 401, about to retry with fresh access token", config_url);
      this.statusHandler401(response.status);
      const headers2 = {
        Authorization: await this.authorizationHeader()
      };
      this.updateState(
        "FetchConfig"
        /* FetchConfig */
      );
      response = await this._client.fetch(config_url, {
        headers: headers2
      });
    }
    if (response.status != 200) {
      const message = await response.text();
      if (response.status == 429) {
        this.updateState("NotAvailable", message);
      } else {
        this.updateState("Error", message);
      }
      throw new Error(`Unexpected status ${response.status}: ${message}`);
    }
    let config = await response.json();
    if (!config.base_url && this.options().autoStart) {
      const auto_start_config_url = `${this.eyepopWebApiUrl()}/pops/${this.options().popId}/config?auto_start=true`;
      this._requestLogger.debug("pop was not running, trying to autostart with: %s", auto_start_config_url);
      const headers2 = {
        Authorization: await this.authorizationHeader()
      };
      response = await this._client.fetch(auto_start_config_url, {
        headers: headers2
      });
      if (response.status != 200) {
        this.updateState(
          "Error"
          /* Error */
        );
        const message = await response.text();
        throw new Error(`Unexpected status ${response.status}: ${message}`);
      }
      config = await response.json();
    }
    const baseUrl = new URL(config.base_url, this.eyepopUrl());
    this._baseUrl = baseUrl.toString();
    if (this._baseUrl) {
      this._baseUrl = this._baseUrl.replace(/\/+$/, "");
      this._pipelineId = config.pipeline_id;
      this._popName = config.name;
      if (!this._pipelineId || !this._baseUrl) {
        throw new Error("Pop not started");
      }
      const get_url = `${this._baseUrl}/pipelines/${this._pipelineId}`;
      const headers2 = {
        Authorization: await this.authorizationHeader()
      };
      let response2 = await this._client.fetch(get_url, {
        method: "GET",
        headers: headers2
      });
      if (response2.status > 200) {
        const message = await response2.text();
        throw new Error(`Unexpected status ${response2.status}: ${message}`);
      }
      this._pipeline = await response2.json();
      if (this.options().stopJobs) {
        const body = { sourceType: "NONE" };
        const headers3 = {
          Authorization: await this.authorizationHeader(),
          "Content-Type": "application/json"
        };
        const stop_url = `${this._baseUrl}/pipelines/${this._pipeline.id}/source?mode=preempt&processing=sync`;
        let response3 = await this._client.fetch(stop_url, {
          method: "PATCH",
          headers: headers3,
          body: JSON.stringify(body)
        });
        if (response3.status >= 300) {
          const message = await response3.text();
          throw new Error(`Unexpected status ${response3.status}: ${message}`);
        }
      }
    }
  }
  async startComputeSession() {
    if (!this._client) {
      throw new Error("endpoint not initialized");
    }
    let session = null;
    const sessionsUrl = `${this.eyepopUrl()}/v1/sessions`;
    this._requestLogger.debug("fetching sessions from: %s", sessionsUrl);
    const headers = {
      Authorization: await this.authorizationHeader()
    };
    let response = await this._client.fetch(sessionsUrl, {
      headers
    });
    let sessions;
    if (response.status == 404) {
      sessions = [];
    } else if (response.status != 200) {
      this.updateState(
        "Error"
        /* Error */
      );
      const message = await response.text();
      throw new Error(`Unexpected status ${response.status} fetching compute sessions: ${message}`);
    } else {
      const response_content = await response.json();
      sessions = response_content;
    }
    if (sessions.length > 0) {
      this._logger.debug(`User has ${sessions.length} sessions, inspecting for active session`);
      for (let s2 of sessions) {
        if (!_WorkerEndpoint2.SESSION_DEAD.has(s2.session_status)) {
          session = s2;
          this._logger.debug(`Use active session ${s2.session_uuid} with pipeline ${s2.pipeline_uuid}`);
          break;
        }
      }
    }
    if (!session) {
      this._requestLogger.debug("creating a new session at: %s", sessionsUrl);
      response = await this._client.fetch(sessionsUrl, {
        headers,
        method: "POST"
      });
      if (response.status != 200) {
        this.updateState(
          "Error"
          /* Error */
        );
        const message = await response.text();
        throw new Error(`Unexpected status ${response.status} creating a compute session: ${message}`);
      } else {
        sessions = await response.json();
      }
      if (sessions.length == 0) {
        throw new Error("Unexpected, no compute session after attempt to create one");
      }
      session = sessions[0] || null;
    }
    if (!session) {
      throw new Error("unexpected undefined session");
    }
    let isReady = false;
    const deadline = Date.now() + _WorkerEndpoint2.WAIT_FOR_IS_READY;
    while (!isReady) {
      const health_url = `${session.session_endpoint}/health`;
      response = await this._client.fetch(health_url, {
        headers
      });
      if (response.status < 300) {
        isReady = true;
      } else if (Date.now() > deadline) {
        throw new Error(`Created session ${session.session_uuid} did not become healthy after ${_WorkerEndpoint2.WAIT_FOR_IS_READY / 1e3} seconds`);
      } else {
        this._logger.debug(`session ${session.session_uuid} health check status ${response.status}, wait and poll for update`);
        await sleep(_WorkerEndpoint2.CHECK_FOR_IS_READY_INTERVAL);
      }
    }
    this._baseUrl = session.session_endpoint;
    this._pipeline = null;
    if (session.pipeline_uuid) {
      this._pipelineId = session.pipeline_uuid;
    } else {
      this._pipelineId = null;
    }
  }
  async startTransientPipeline() {
    const client = this._client;
    const baseUrl = this._baseUrl;
    if (client == null || baseUrl == null) {
      throw new Error("endpoint not initialized");
    }
    let pop;
    if (this._pipeline && this._pipeline.pop) {
      pop = this._pipeline.pop;
    } else {
      pop = {
        components: []
      };
    }
    const body = {
      pop,
      source: {
        sourceType: "NONE"
      },
      idleTimeoutSeconds: 30,
      logging: ["out_meta"],
      videoOutput: "no_output"
    };
    const post_url = `${baseUrl.replace(/\/+$/, "")}/pipelines`;
    let response = await this.fetchWithRetry(async () => {
      let headers = {
        "Content-Type": "application/json",
        Authorization: await this.authorizationHeader()
      };
      return client.fetch(post_url, {
        method: "POST",
        body: JSON.stringify(body),
        headers
      });
    });
    if (response.status != 200) {
      const message = await response.text();
      throw new Error(`Unexpected status ${response.status}: ${message}`);
    }
    const result = await response.json();
    return result["id"];
  }
};
_WorkerEndpoint.SESSION_DEAD = /* @__PURE__ */ new Set([
  "error",
  "failed",
  "stopped",
  "pipeline_error",
  "unknown"
  /* UNKNOWN */
]);
_WorkerEndpoint.WAIT_FOR_IS_READY = 60 * 1e3;
_WorkerEndpoint.CHECK_FOR_IS_READY_INTERVAL = 250;
var WorkerEndpoint = _WorkerEndpoint;
var createWebSocket;
if ("document" in globalThis && "implementation" in globalThis.document) {
  createWebSocket = (url2, protocols) => {
    return new WebSocket(url2, protocols);
  };
} else {
  createWebSocket = (url2, protocols) => {
    const ws = __require2("ws");
    return new ws.WebSocket(url2, protocols);
  };
}
function normalize(strArray) {
  var resultArray = [];
  if (strArray.length === 0) {
    return "";
  }
  if (typeof strArray[0] !== "string") {
    throw new TypeError("Url must be a string. Received " + strArray[0]);
  }
  if (strArray[0].match(/^[^/:]+:\/*$/) && strArray.length > 1) {
    var first = strArray.shift();
    strArray[0] = first + strArray[0];
  }
  if (strArray[0].match(/^file:\/\/\//)) {
    strArray[0] = strArray[0].replace(/^([^/:]+):\/*/, "$1:///");
  } else {
    strArray[0] = strArray[0].replace(/^([^/:]+):\/*/, "$1://");
  }
  for (var i2 = 0; i2 < strArray.length; i2++) {
    var component = strArray[i2];
    if (typeof component !== "string") {
      throw new TypeError("Url must be a string. Received " + component);
    }
    if (component === "") {
      continue;
    }
    if (i2 > 0) {
      component = component.replace(/^[\/]+/, "");
    }
    if (i2 < strArray.length - 1) {
      component = component.replace(/[\/]+$/, "");
    } else {
      component = component.replace(/[\/]+$/, "/");
    }
    resultArray.push(component);
  }
  var str = resultArray.join("/");
  str = str.replace(/\/(\?|&|#[^!])/g, "$1");
  var parts2 = str.split("?");
  str = parts2.shift() + (parts2.length > 0 ? "?" : "") + parts2.join("&");
  return str;
}
function urlJoin() {
  var input;
  if (typeof arguments[0] === "object") {
    input = arguments[0];
  } else {
    input = [].slice.call(arguments);
  }
  return normalize(input);
}
var DataApiType = /* @__PURE__ */ ((DataApiType2) => {
  DataApiType2["dataset"] = "dataset";
  DataApiType2["vlm"] = "vlm";
  return DataApiType2;
})(DataApiType || {});
function getBaseUrl(session, dataApiType) {
  switch (dataApiType) {
    case "dataset":
      return session.datasetApiUrl ?? "";
    case "vlm":
      return session.vlmApiUrl ?? "";
    default:
      throw new Error(`unsupported type ${dataApiType}`);
  }
}
var AutoAnnotateStatus = /* @__PURE__ */ ((AutoAnnotateStatus2) => {
  AutoAnnotateStatus2["error"] = "error";
  AutoAnnotateStatus2["requested"] = "requested";
  AutoAnnotateStatus2["in_progress"] = "in_progress";
  AutoAnnotateStatus2["completed"] = "completed";
  return AutoAnnotateStatus2;
})(AutoAnnotateStatus || {});
var AssetStatus = /* @__PURE__ */ ((AssetStatus2) => {
  AssetStatus2["rejected"] = "rejected";
  AssetStatus2["upload_in_progress"] = "upload_in_progress";
  AssetStatus2["upload_failed"] = "upload_failed";
  AssetStatus2["transform_failed"] = "transform_failed";
  AssetStatus2["transform_in_progress"] = "transform_in_progress";
  AssetStatus2["accepted"] = "accepted";
  return AssetStatus2;
})(AssetStatus || {});
var AnnotationType = /* @__PURE__ */ ((AnnotationType2) => {
  AnnotationType2["ground_truth"] = "ground_truth";
  AnnotationType2["prediction"] = "prediction";
  AnnotationType2["auto"] = "auto";
  return AnnotationType2;
})(AnnotationType || {});
var UserReview = /* @__PURE__ */ ((UserReview2) => {
  UserReview2["approved"] = "approved";
  UserReview2["rejected"] = "rejected";
  UserReview2["unknown"] = "unknown";
  return UserReview2;
})(UserReview || {});
var AutoAnnotateTask = /* @__PURE__ */ ((AutoAnnotateTask2) => {
  AutoAnnotateTask2["object_detection"] = "object_detection";
  AutoAnnotateTask2["image_classification"] = "image_classification";
  return AutoAnnotateTask2;
})(AutoAnnotateTask || {});
var TranscodeMode = /* @__PURE__ */ ((TranscodeMode2) => {
  TranscodeMode2["original"] = "original";
  TranscodeMode2["video_original_size"] = "video_original_size";
  TranscodeMode2["image_original_size"] = "image_original_size";
  TranscodeMode2["image_fit_1024"] = "image_fit_1024";
  TranscodeMode2["image_fit_640"] = "image_fit_640";
  TranscodeMode2["image_fit_224"] = "image_fit_224";
  TranscodeMode2["image_cover_1024"] = "image_cover_1024";
  TranscodeMode2["image_cover_640"] = "image_cover_640";
  TranscodeMode2["image_cover_224"] = "image_cover_224";
  return TranscodeMode2;
})(TranscodeMode || {});
var ModelType = /* @__PURE__ */ ((ModelType2) => {
  ModelType2["epdet_b1"] = "epdet_b1";
  ModelType2["imported"] = "imported";
  ModelType2["vlm_ability"] = "vlm_ability";
  return ModelType2;
})(ModelType || {});
var ModelTask = /* @__PURE__ */ ((ModelTask2) => {
  ModelTask2["object_detection"] = "object_detection";
  ModelTask2["image_classification"] = "image_classification";
  ModelTask2["keypoint_detection"] = "keypoint_detection";
  return ModelTask2;
})(ModelTask || {});
var ModelStatus = /* @__PURE__ */ ((ModelStatus2) => {
  ModelStatus2["error"] = "error";
  ModelStatus2["draft"] = "draft";
  ModelStatus2["requested"] = "requested";
  ModelStatus2["in_progress"] = "in_progress";
  ModelStatus2["available"] = "available";
  ModelStatus2["published"] = "published";
  return ModelStatus2;
})(ModelStatus || {});
var ModelExportStatus = /* @__PURE__ */ ((ModelExportStatus2) => {
  ModelExportStatus2["in_progress"] = "in_progress";
  ModelExportStatus2["finished"] = "finished";
  ModelExportStatus2["error"] = "error";
  return ModelExportStatus2;
})(ModelExportStatus || {});
var ExportedBy = /* @__PURE__ */ ((ExportedBy2) => {
  ExportedBy2["eyepop"] = "eyepop";
  ExportedBy2["qc_ai_hub"] = "qc_ai_hub";
  return ExportedBy2;
})(ExportedBy || {});
var ArtifactType = /* @__PURE__ */ ((ArtifactType3) => {
  ArtifactType3["eyepop_bundle"] = "eyepop_bundle";
  ArtifactType3["weights_file"] = "weights_file";
  return ArtifactType3;
})(ArtifactType || {});
var ModelTrainingStage = /* @__PURE__ */ ((ModelTrainingStage2) => {
  ModelTrainingStage2["waiting"] = "waiting";
  ModelTrainingStage2["scheduling"] = "scheduling";
  ModelTrainingStage2["preparing"] = "preparing";
  ModelTrainingStage2["training"] = "training";
  ModelTrainingStage2["exporting"] = "exporting";
  return ModelTrainingStage2;
})(ModelTrainingStage || {});
var ChangeType = /* @__PURE__ */ ((ChangeType2) => {
  ChangeType2["dataset_added"] = "dataset_added";
  ChangeType2["dataset_removed"] = "dataset_removed";
  ChangeType2["dataset_modified"] = "dataset_modified";
  ChangeType2["dataset_version_modified"] = "dataset_version_modified";
  ChangeType2["asset_added"] = "asset_added";
  ChangeType2["asset_removed"] = "asset_removed";
  ChangeType2["asset_status_modified"] = "asset_status_modified";
  ChangeType2["asset_annotation_modified"] = "asset_annotation_modified";
  ChangeType2["model_added"] = "model_added";
  ChangeType2["model_removed"] = "model_removed";
  ChangeType2["model_modified"] = "model_modified";
  ChangeType2["model_status_modified"] = "model_status_modified";
  ChangeType2["model_progress"] = "model_progress";
  ChangeType2["events_lost"] = "events_lost";
  ChangeType2["workflow_started"] = "workflow_started";
  ChangeType2["workflow_succeeded"] = "workflow_succeeded";
  ChangeType2["workflow_failed"] = "workflow_failed";
  ChangeType2["workflow_task_started"] = "workflow_task_started";
  ChangeType2["workflow_task_succeeded"] = "workflow_task_succeeded";
  ChangeType2["workflow_task_failed"] = "workflow_task_failed";
  return ChangeType2;
})(ChangeType || {});
var WorkflowPhase = /* @__PURE__ */ ((WorkflowPhase3) => {
  WorkflowPhase3["unknown"] = "Unknown";
  WorkflowPhase3["pending"] = "Pending";
  WorkflowPhase3["running"] = "Running";
  WorkflowPhase3["succeeded"] = "Succeeded";
  WorkflowPhase3["failed"] = "Failed";
  WorkflowPhase3["error"] = "Error";
  return WorkflowPhase3;
})(WorkflowPhase || {});
var ModelFormat = /* @__PURE__ */ ((ModelFormat3) => {
  ModelFormat3["TensorFlowLite"] = "TensorFlowLite";
  ModelFormat3["TensorFlowGraphDef"] = "TensorFlowGraphDef";
  ModelFormat3["ONNX"] = "ONNX";
  ModelFormat3["TorchScript"] = "TorchScript";
  ModelFormat3["TorchScriptCpu"] = "TorchScriptCpu";
  ModelFormat3["TorchScriptCuda"] = "TorchScriptCuda";
  ModelFormat3["PyTorch"] = "PyTorch";
  ModelFormat3["ModelLess"] = "ModelLess";
  return ModelFormat3;
})(ModelFormat || {});
var ModelPrecisionType = /* @__PURE__ */ ((ModelPrecisionType2) => {
  ModelPrecisionType2["float32"] = "float32";
  ModelPrecisionType2["float16"] = "float16";
  ModelPrecisionType2["int32"] = "int32";
  ModelPrecisionType2["int8"] = "int8";
  ModelPrecisionType2["uint8"] = "uint8";
  return ModelPrecisionType2;
})(ModelPrecisionType || {});
var AssetUrlType = /* @__PURE__ */ ((AssetUrlType3) => {
  AssetUrlType3["gcs"] = "gcs";
  AssetUrlType3["s3"] = "s3";
  AssetUrlType3["https_signed"] = "https_signed";
  return AssetUrlType3;
})(AssetUrlType || {});
var EvaluationStatus = /* @__PURE__ */ ((EvaluationStatus2) => {
  EvaluationStatus2["success"] = "success";
  EvaluationStatus2["failed"] = "failed";
  return EvaluationStatus2;
})(EvaluationStatus || {});
var VlmAbilityStatus = /* @__PURE__ */ ((VlmAbilityStatus2) => {
  VlmAbilityStatus2["draft"] = "draft";
  VlmAbilityStatus2["published"] = "published";
  return VlmAbilityStatus2;
})(VlmAbilityStatus || {});
var InferAssetJob = class {
  constructor(assetUrl, inferRequest, vlmFetch, requestLogger) {
    this._response = null;
    this._runInfo = null;
    this._controller = new AbortController();
    this._vlmFetch = vlmFetch;
    this._assetUrl = assetUrl;
    this._inferRequest = inferRequest;
    this._requestLogger = requestLogger;
  }
  [Symbol.asyncIterator]() {
    if (!this._response) {
      throw Error("logical bug");
    }
    let consumed = false;
    const response_promise = this._response;
    const controller = this._controller;
    async function* iterator() {
      if (consumed) {
        throw new Error("Cannot iterate over a consumed stream, use `.tee()` to split the stream.");
      }
      consumed = true;
      let done = false;
      try {
        const predictions = await response_promise;
        if (predictions) {
          for (let prediction of predictions) {
            yield prediction;
          }
        }
        done = true;
      } catch (e3) {
        if (e3 instanceof Error && e3.name === "AbortError") return;
        throw e3;
      } finally {
        if (!done) controller.abort();
      }
    }
    return iterator();
  }
  start(done) {
    this._response = new Promise(async (resolve, reject) => {
      try {
        let requestId = null;
        while (true) {
          let response = null;
          if (requestId) {
            response = await this._vlmFetch(`/api/v1/requests/${requestId}?timeout=20`, {
              method: "POST"
            });
          } else {
            const infer_request = new Map(Object.entries(this._inferRequest));
            infer_request.set("url", this._assetUrl);
            const body = new FormData();
            body.append("infer_request", JSON.stringify(Object.fromEntries(infer_request)));
            response = await this._vlmFetch(`/api/v1/infer?timeout=20`, {
              method: "POST",
              body
            });
          }
          const predictions = response["predictions"];
          const runInfo = response["run_info"];
          if (predictions) {
            this._runInfo = runInfo;
            resolve(predictions);
            break;
          } else {
            requestId = response["request_id"];
            if (!requestId) {
              reject(`missing request_id in response: ${JSON.stringify(response)}`);
              break;
            }
          }
        }
      } catch (reason) {
        reject(reason);
      } finally {
        done();
      }
    });
    return this;
  }
  cancel() {
    this._controller.abort("cancelled");
  }
};
var EvaluateDatasetJob = class {
  constructor(evaluateRequest, workerRelease, vlmFetch, requestLogger) {
    this._response = null;
    this._controller = new AbortController();
    this._vlmFetch = vlmFetch;
    this._evaluateRequest = evaluateRequest;
    this._workerRelease = workerRelease;
    this._requestLogger = requestLogger;
  }
  async response() {
    if (!this._response) {
      throw Error("logical bug");
    }
    return await this._response;
  }
  start(done) {
    this._response = new Promise(async (resolve, reject) => {
      try {
        let requestId = null;
        while (true) {
          let response = null;
          if (requestId) {
            response = await this._vlmFetch(`/api/v1/evaluations/${requestId}?timeout=20`, {
              method: "GET"
            });
          } else {
            const workerReleaseQuery = this._workerRelease ? `&worker_release=${this._workerRelease}` : "";
            response = await this._vlmFetch(`/api/v1/evaluations?timeout=20${workerReleaseQuery}`, {
              method: "POST",
              body: JSON.stringify(this._evaluateRequest),
              headers: { "Content-Type": "application/json" }
            });
          }
          const runInfo = response["run_info"];
          if (runInfo) {
            resolve(response);
            break;
          } else {
            requestId = response["request_id"];
            if (!requestId) {
              reject(`missing request_id in response: ${JSON.stringify(response)}`);
              break;
            }
          }
        }
      } catch (reason) {
        reject(reason);
      } finally {
        done();
      }
    });
    return this;
  }
  cancel() {
    this._controller.abort("cancelled");
  }
};
var WS_INITIAL_RECONNECT_DELAY = 1e3;
var WS_MAX_RECONNECT_DELAY = 6e4;
var DataEndpoint = class extends Endpoint {
  constructor(options) {
    super(options);
    this.datasetApiUrl = null;
    this.vlmApiUrl = null;
    this._ws = null;
    this._ws_current_reconnect_delay = null;
    this._accountId = options.accountId || null;
    this._account_event_handlers = [];
    this._dataset_uuid_to_event_handlers = /* @__PURE__ */ new Map();
    const sessionAuth = options.auth;
    if (sessionAuth.session !== void 0) {
      const dataSession = sessionAuth.session;
      if (dataSession.accountId) {
        this._accountId = dataSession.accountId;
      }
    }
  }
  async session() {
    const session = await super.session();
    return {
      eyepopUrl: session.eyepopUrl,
      accessToken: session.accessToken,
      validUntil: session.validUntil,
      accountId: this.options().accountId,
      datasetApiUrl: this.datasetApiUrl,
      vlmApiUrl: this.vlmApiUrl
    };
  }
  async disconnect(wait = true) {
    this.datasetApiUrl = null;
    this.vlmApiUrl = null;
    if (this._ws) {
      try {
        this._ws.close();
      } catch (e3) {
        this._logger.warn("ignored exception", e3);
      }
      this._ws = null;
    }
    await super.disconnect(wait);
  }
  async reconnect() {
    if (!this._client) {
      return Promise.reject("endpoint not initialized");
    }
    const accountUuidQuery = this._accountId ? `?account_uuid=${this._accountId}` : "";
    const config_url = `${this.eyepopUrl()}/v1/configs${accountUuidQuery}`;
    let headers = {
      Authorization: await this.authorizationHeader()
    };
    this.updateState(
      "FetchConfig"
      /* FetchConfig */
    );
    let response = await this._client.fetch(config_url, { headers });
    if (response.status == 401) {
      this._requestLogger.debug("GET %s: 401, about to retry with fresh access token", config_url);
      this.statusHandler401(response.status);
      headers = {
        Authorization: await this.authorizationHeader()
      };
      this.updateState(
        "FetchConfig"
        /* FetchConfig */
      );
      response = await this._client.fetch(config_url, {
        headers
      });
    }
    if (response.status != 200) {
      this.updateState(
        "Error"
        /* Error */
      );
      const message = await response.text();
      return Promise.reject(`Unexpected status ${response.status} for ${config_url}: ${message}`);
    }
    let config = await response.json();
    const datasetApiUrl = new URL(config.dataset_api_url, this.eyepopUrl());
    this.datasetApiUrl = datasetApiUrl.toString();
    const vlmApiUrl = new URL(config.vlm_api_url, this.eyepopUrl());
    this.vlmApiUrl = vlmApiUrl.toString();
    if (this.options().disableWs) {
      this._logger.info("disabled ws connection");
    } else {
      await this.reconnect_ws();
    }
    if (this.options().useCookie) {
      const client = this._client;
      const url2 = urlJoin(this.datasetApiUrl, "security", "check?set_cookie=true");
      const headers2 = {
        Authorization: await this.authorizationHeader()
      };
      response = await client.fetch(url2, {
        headers: headers2
      });
      if (response.status != 204) {
        this.updateState(
          "Error"
          /* Error */
        );
        const message = await response.text();
        return Promise.reject(`Unexpected status ${response.status}: ${message}`);
      }
    }
    this.updateState();
    return Promise.resolve(this);
  }
  async reconnect_ws() {
    if (this._ws) {
      this._ws.close();
      this._ws = null;
    }
    const baseUrl = this.datasetApiUrl?.replace("https://", "wss://").replace("http://", "ws://");
    if (!baseUrl) {
      return;
    }
    const ws_url = urlJoin(baseUrl, "events");
    this._requestLogger.debug("about to connect ws to: %s", ws_url);
    return new Promise((resolve, reject) => {
      const ws = createWebSocket(ws_url);
      if (!ws) {
        return resolve();
      }
      this._ws = ws;
      ws.onopen = async () => {
        const auth_header = await this.authorizationHeader();
        let msg = JSON.stringify({ authorization: auth_header });
        this._requestLogger.debug("ws send: %s", msg);
        ws.send(msg);
        msg = JSON.stringify({ subscribe: { account_uuid: this._accountId } });
        this._requestLogger.debug("ws send: %s", msg);
        ws.send(msg);
        for (let dataset_uuid in this._dataset_uuid_to_event_handlers.keys()) {
          const msg2 = JSON.stringify({ subscribe: { dataset_uuid } });
          this._requestLogger.debug("ws send: %s", msg2);
          ws.send(msg2);
        }
        this._ws_current_reconnect_delay = WS_INITIAL_RECONNECT_DELAY;
        resolve();
      };
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        this._requestLogger.debug("received ws: %s", JSON.stringify(data));
        const change_event = data;
        this.dispatchChangeEvent(change_event);
      };
      ws.onclose = (event) => {
        const { code, reason } = event;
        this._requestLogger.debug("ws closed: %d %s", code, reason);
        if (reason !== "unsubscribe") {
          if (!this._ws_current_reconnect_delay) {
            this._ws_current_reconnect_delay = WS_INITIAL_RECONNECT_DELAY;
          } else if (this._ws_current_reconnect_delay < WS_MAX_RECONNECT_DELAY) {
            this._ws_current_reconnect_delay *= 1.5;
          }
          setTimeout(async () => {
            await this.reconnect_ws();
          }, this._ws_current_reconnect_delay);
        }
      };
      ws.onerror = (event) => {
        this._logger.error(event);
        reject(event);
        return null;
      };
    });
  }
  options() {
    return this._options;
  }
  async request(path2, options = {}, disableAuth = false, dataApiType = "dataset") {
    const client = this._client;
    if (!client) {
      return Promise.reject("endpoint not connected");
    }
    let response = await this.fetchWithRetry(async () => {
      const session = await this.session();
      const baseUrl = getBaseUrl(session, dataApiType);
      const headers = {
        ...disableAuth ? {} : { Authorization: `Bearer ${session.accessToken}` },
        ...options.headers || {}
      };
      if (!options.body) {
        options.body = null;
      }
      const ri2 = {
        headers,
        method: options.method || "GET",
        body: options.body
      };
      this._requestLogger.debug("Request - " + ri2.method + " " + path2 + " BODY: " + (ri2.body ? ri2.body : ""));
      return await client.fetch(urlJoin(baseUrl ?? "", path2), ri2);
    });
    if (response.status === 204) {
      return null;
    }
    const contentType = response.headers.get("Content-Type");
    this._requestLogger.debug("Response - " + response.status + " " + response.statusText);
    if (!response.ok) {
      if (contentType && (contentType.toLowerCase().startsWith("application/json") || contentType.toLowerCase().startsWith("text/"))) {
        throw new Error(`Request failed with ${response.status} ${response.statusText}: ${await response.text()}`);
      } else {
        throw new Error(`Request failed with ${response.status} ${response.statusText}`);
      }
    }
    if (contentType && contentType.toLowerCase().startsWith("application/json")) {
      return await response.json();
    }
    return await response.blob();
  }
  async listDatasets(include_stats = true, modifiable_version_only) {
    const modifiableVersionQuery = typeof modifiable_version_only !== "undefined" ? `&modifiable_version_only=${modifiable_version_only}` : "";
    return this.request(`/datasets?account_uuid=${this._accountId}&include_stats=${include_stats}${modifiableVersionQuery}`, {
      method: "GET"
    });
  }
  async createDataset(data) {
    return this.request(`/datasets?account_uuid=${this._accountId}`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" }
    });
  }
  async getDataset(dataset_uuid, include_stats = true, dataset_version, modifiable_version_only) {
    const versionQuery = dataset_version ? `&dataset_version=${dataset_version}` : "";
    const modifiableVersionQuery = typeof modifiable_version_only !== "undefined" ? `&modifiable_version_only=${modifiable_version_only}` : "";
    return this.request(`/datasets/${dataset_uuid}?include_stats=${include_stats}${versionQuery}${modifiableVersionQuery}`, {
      method: "GET"
    });
  }
  async updateDataset(dataset_uuid, data, start_auto_annotate = true) {
    return this.request(`/datasets/${dataset_uuid}?start_auto_annotate=${start_auto_annotate}`, {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" }
    });
  }
  async updateDatasetHeroAsset(dataset_uuid, update) {
    return this.request(`/datasets/${dataset_uuid}/hero_asset`, {
      method: "PATCH",
      body: JSON.stringify(update),
      headers: { "Content-Type": "application/json" }
    });
  }
  async deleteDataset(dataset_uuid) {
    return this.request(`/datasets/${dataset_uuid}`, {
      method: "DELETE"
    });
  }
  async freezeDatasetVersion(dataset_uuid, dataset_version) {
    const versionQuery = dataset_version ? `&dataset_version=${dataset_version}` : "";
    return this.request(`/datasets/${dataset_uuid}/freeze?${versionQuery}`, {
      method: "POST"
    });
  }
  async analyzeDatasetVersion(dataset_uuid, dataset_version) {
    const versionQuery = dataset_version ? `&dataset_version=${dataset_version}` : "";
    return this.request(`/datasets/${dataset_uuid}/analyze?${versionQuery}`, {
      method: "POST"
    });
  }
  async autoAnnotateDatasetVersion(dataset_uuid, dataset_version, max_assets) {
    const versionQuery = dataset_version ? `&dataset_version=${dataset_version}` : "";
    const maxAssetsQuery = max_assets ? `&max_assets=${max_assets}` : "";
    return this.request(`/datasets/${dataset_uuid}/auto_annotate?${versionQuery}${maxAssetsQuery}`, {
      method: "POST"
    });
  }
  async deleteDatasetVersion(dataset_uuid, dataset_version) {
    return this.request(`/datasets/${dataset_uuid}/versions?dataset_version=${dataset_version}`, {
      method: "DELETE"
    });
  }
  async deleteAnnotations(dataset_uuid, dataset_version, user_reviews = [
    "unknown"
    /* unknown */
  ]) {
    let userReviewsQuery = "";
    for (let userReview in user_reviews) {
      userReviewsQuery += `&user_review=${userReview}`;
    }
    await this.request(`/datasets/${dataset_uuid}/annotations?dataset_version=${dataset_version}${userReviewsQuery}`, {
      method: "DELETE"
    });
  }
  async createDatasetAutoAnnotate(create, dataset_uuid, dataset_version) {
    const versionQuery = dataset_version ? `dataset_version=${dataset_version}&` : "";
    return this.request(`/datasets/${dataset_uuid}/auto_annotates?${versionQuery}`, {
      method: "POST",
      body: JSON.stringify(create),
      headers: { "Content-Type": "application/json" }
    });
  }
  async updateDatasetAutoAnnotate(update, dataset_uuid, auto_annotate, source, dataset_version) {
    const versionQuery = dataset_version ? `dataset_version=${dataset_version}&` : "";
    return this.request(`/datasets/${dataset_uuid}/auto_annotates?auto_annotate=${auto_annotate}&source=${encodeURIComponent(source)}&${versionQuery}`, {
      method: "PATCH",
      body: JSON.stringify(update),
      headers: { "Content-Type": "application/json" }
    });
  }
  async listDatasetAutoAnnotates(dataset_uuid, auto_annotate, source, dataset_version) {
    const versionQuery = dataset_version ? `dataset_version=${dataset_version}&` : "";
    const autoAnnotateQuery = auto_annotate ? `auto_annotate=${auto_annotate}&` : "";
    const sourceQuery = source ? `source=${source}&` : "";
    return this.request(`/datasets/${dataset_uuid}/auto_annotates?${versionQuery}&${autoAnnotateQuery}&${sourceQuery}`, {
      method: "GET"
    });
  }
  // Asset methods
  async uploadAsset(dataset_uuid, dataset_version, blob, external_id = void 0) {
    const versionQuery = dataset_version ? `&dataset_version=${dataset_version}` : "";
    let post_path;
    if (external_id) {
      post_path = `/assets?dataset_uuid=${dataset_uuid}${versionQuery}&external_id=${external_id}`;
    } else {
      post_path = `/assets?dataset_uuid=${dataset_uuid}${versionQuery}`;
    }
    return this.request(post_path, {
      method: "POST",
      body: blob,
      headers: {
        "Content-Type": blob.type || "application/octet-stream"
      }
    });
  }
  async importAsset(dataset_uuid, dataset_version, asset_import, external_id = void 0) {
    const versionQuery = dataset_version ? `&dataset_version=${dataset_version}` : "";
    let post_path;
    if (external_id) {
      post_path = `/assets/imports?dataset_uuid=${dataset_uuid}${versionQuery}&external_id=${external_id}`;
    } else {
      post_path = `/assets/imports?dataset_uuid=${dataset_uuid}${versionQuery}`;
    }
    return this.request(post_path, {
      method: "POST",
      body: JSON.stringify(asset_import),
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
  async listAssets(dataset_uuid, dataset_version, include_annotations = false, top_k) {
    const versionQuery = dataset_version ? `&dataset_version=${dataset_version}` : "";
    const annotationsQuery = include_annotations ? "&include_annotations=true" : "";
    const topKQuery = top_k ? `&top_k=${top_k}` : "";
    return this.request(`/assets?dataset_uuid=${dataset_uuid}${versionQuery}${annotationsQuery}${topKQuery}`, {
      method: "GET"
    });
  }
  async getAsset(asset_uuid, dataset_uuid, dataset_version, include_annotations = false, top_k) {
    const versionQuery = dataset_version ? `&dataset_version=${dataset_version}` : "";
    const annotationsQuery = include_annotations ? "&include_annotations=true" : "";
    const datasetQuery = dataset_uuid ? `&dataset_uuid=${dataset_uuid}` : "";
    const topKQuery = top_k ? `&top_k=${top_k}` : "";
    return this.request(`/assets/${asset_uuid}?${datasetQuery}${versionQuery}${annotationsQuery}${topKQuery}`, {
      method: "GET"
    });
  }
  async deleteAsset(asset_uuid, dataset_uuid, dataset_version) {
    const versionQuery = dataset_version ? `&dataset_version=${dataset_version}` : "";
    const datasetQuery = dataset_uuid ? `&dataset_uuid=${dataset_uuid}` : "";
    return this.request(`/assets/${asset_uuid}?${datasetQuery}${versionQuery}`, {
      method: "DELETE"
    });
  }
  async resurrectAsset(asset_uuid, dataset_uuid, from_dataset_version, into_dataset_version) {
    const intoVersionQuery = into_dataset_version ? `&into_dataset_version=${into_dataset_version}` : "";
    return this.request(`/assets/${asset_uuid}/resurrect?dataset_uuid=${dataset_uuid}&from_dataset_version=${from_dataset_version}${intoVersionQuery}`, {
      method: "POST"
    });
  }
  async updateAssetGroundTruth(asset_uuid, dataset_uuid, dataset_version, predictions) {
    const versionQuery = dataset_version ? `&dataset_version=${dataset_version}` : "";
    const datasetQuery = dataset_uuid ? `&dataset_uuid=${dataset_uuid}` : "";
    return this.request(`/assets/${asset_uuid}/ground_truth?${datasetQuery}${versionQuery}`, {
      method: "PATCH",
      body: JSON.stringify(predictions),
      headers: { "Content-Type": "application/json" }
    });
  }
  async deleteAssetGroundTruth(asset_uuid, dataset_uuid, dataset_version) {
    const versionQuery = dataset_version ? `&dataset_version=${dataset_version}` : "";
    const datasetQuery = dataset_uuid ? `&dataset_uuid=${dataset_uuid}` : "";
    return this.request(`/assets/${asset_uuid}/ground_truth?${datasetQuery}${versionQuery}`, {
      method: "DELETE"
    });
  }
  async updateAutoAnnotationStatus(asset_uuid, auto_annotate, user_review, approved_threshold) {
    const validStatuses = ["approved", "rejected", "unknown"];
    if (!validStatuses.includes(user_review)) {
      throw new Error("Invalid status");
    }
    const thresholdQuery = approved_threshold ? `?approved_threshold=${approved_threshold}` : "";
    return this.request(`/assets/${asset_uuid}/auto_annotations/${auto_annotate}/user_review/${user_review}${thresholdQuery}`, {
      method: "PATCH"
    });
  }
  async addAssetAnnotation(asset_uuid, dataset_uuid, dataset_version, predictions, auto_annotate, source, user_review, approved_threshold) {
    const datasetQuery = dataset_uuid ? `dataset_uuid=${dataset_uuid}&` : "";
    const versionQuery = dataset_version ? `&dataset_version=${dataset_version}&` : "";
    const autoAnnotateQuery = auto_annotate ? `&auto_annotate=${auto_annotate}&` : "";
    const sourceQuery = source ? `&source=${encodeURIComponent(source)}&` : "";
    const userReviewQuery = user_review ? `&user_review=${user_review}&` : "";
    const approvedThresholdQuery = typeof approved_threshold !== "undefined" ? `&approved_threshold=${approved_threshold}&` : "";
    return this.request(`/assets/${asset_uuid}/annotations?${datasetQuery}${versionQuery}${autoAnnotateQuery}${sourceQuery}${userReviewQuery}${approvedThresholdQuery}`, {
      method: "POST",
      body: JSON.stringify(predictions),
      headers: { "Content-Type": "application/json" }
    });
  }
  async updateAssetAnnotationApproval(asset_uuid, dataset_uuid, dataset_version, auto_annotate, source, user_review, approved_threshold) {
    const datasetQuery = dataset_uuid ? `dataset_uuid=${dataset_uuid}&` : "";
    const versionQuery = dataset_version ? `&dataset_version=${dataset_version}&` : "";
    const autoAnnotateQuery = auto_annotate ? `&auto_annotate=${auto_annotate}&` : "";
    const sourceQuery = source ? `&source=${encodeURIComponent(source)}&` : "";
    const userReviewQuery = user_review ? `&user_review=${user_review}&` : "";
    const approvedThresholdQuery = approved_threshold ? `&approved_threshold=${approved_threshold}&` : "";
    return this.request(`/assets/${asset_uuid}/annotations?${datasetQuery}${versionQuery}${autoAnnotateQuery}${sourceQuery}${userReviewQuery}${approvedThresholdQuery}`, {
      method: "PATCH"
    });
  }
  async downloadAsset(asset_uuid, dataset_uuid, dataset_version, transcode_mode = "original", start_timestamp, end_timestamp, url_type) {
    const versionQuery = dataset_version ? `&dataset_version=${dataset_version}` : "";
    const datasetQuery = dataset_uuid ? `&dataset_uuid=${dataset_uuid}` : "";
    const startTimestampQuery = start_timestamp ? `&start_timestamp=${start_timestamp}` : "";
    const endTimestampQuery = end_timestamp ? `&end_timestamp=${end_timestamp}` : "";
    const urlTypeQuery = url_type ? `&url_type=${url_type}` : "";
    return this.request(`/assets/${asset_uuid}/download?transcode_mode=${transcode_mode}${datasetQuery}${versionQuery}${startTimestampQuery}${endTimestampQuery}${urlTypeQuery}`, {
      method: "GET"
    });
  }
  async previewAutoAnnotateAsset(asset_uuid, auto_annotate, auto_annotate_params) {
    return this.request(`/assets/${asset_uuid}/preview_auto_annotate?auto_annotate=${auto_annotate}`, {
      method: "POST",
      body: auto_annotate_params ? JSON.stringify(auto_annotate_params) : null,
      headers: auto_annotate_params ? { "Content-Type": "application/json" } : {}
    });
  }
  // Model methods
  async listModels() {
    return this.request(`/models?account_uuid=${this._accountId}`, {
      method: "GET"
    });
  }
  async findModelsForDataset(dataset_uuid) {
    return this.request(`/models?dataset_uuid=${dataset_uuid}`, {
      method: "GET"
    });
  }
  async createModel(dataset_uuid, dataset_version, data, start_training = true) {
    return this.request(`/models?dataset_uuid=${dataset_uuid}&dataset_version=${dataset_version}&start_training=${start_training}`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" }
    });
  }
  async getModel(model_uuid) {
    return this.request(`/models/${model_uuid}`, {
      method: "GET"
    });
  }
  async getModelTrainingProgress(model_uuid) {
    return this.request(`/models/${model_uuid}/progress`, {
      method: "GET"
    });
  }
  async updateModel(model_uuid, data) {
    return this.request(`/models/${model_uuid}`, {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" }
    });
  }
  async deleteModel(model_uuid) {
    return this.request(`/models/${model_uuid}`, {
      method: "DELETE"
    });
  }
  async trainModel(model_uuid) {
    return this.request(`/models/${model_uuid}/train`, {
      method: "POST"
    });
  }
  async publishModel(model_uuid) {
    return this.request(`/models/${model_uuid}/publish`, {
      method: "POST"
    });
  }
  async exportModel(model_uuid, export_by, params) {
    if (export_by != "qc_ai_hub") {
      return Promise.reject(`Unexpected export_by ${export_by}, must be 'qc_ai_hub'`);
    }
    await this.request(`/models/${model_uuid}/exports/qc_ai_hub`, {
      method: "POST",
      body: JSON.stringify(params),
      headers: { "Content-Type": "application/json" }
    });
  }
  async downloadModelArtifacts(model_uuid, model_formats, device_name, artifact_type) {
    const artifactTypeQuery = artifact_type ? `artifact_type=${artifact_type}&` : "";
    const deviceNameQuery = device_name ? `device_name=${encodeURIComponent(device_name)}&` : "";
    let modelFormatQuery = "";
    if (model_formats) {
      for (const model_format of model_formats) {
        modelFormatQuery += `model_format=${model_format}&`;
      }
    }
    return this.request(`/exports/model_artifacts/?model_uuid=${model_uuid}&${artifactTypeQuery}${deviceNameQuery}${modelFormatQuery}`, {
      method: "GET"
    });
  }
  addAccountEventHandler(eventHandler) {
    this._account_event_handlers.push(eventHandler);
  }
  removeAccountEventHandler(eventHandler) {
    this._account_event_handlers = this._account_event_handlers.filter((h2) => h2 !== eventHandler);
  }
  addDatasetEventHandler(dataset_uuid, eventHandler) {
    let event_handlers = this._dataset_uuid_to_event_handlers.get(dataset_uuid);
    this._logger.debug("addDatasetEventHandler %s", event_handlers);
    if (event_handlers === void 0) {
      event_handlers = [];
      this._dataset_uuid_to_event_handlers.set(dataset_uuid, event_handlers);
      const ws = this._ws;
      if (ws) {
        const msg = JSON.stringify({ subscribe: { dataset_uuid } });
        this._requestLogger.debug("ws send: %s", msg);
        ws.send(msg);
      }
    }
    if (event_handlers.find((h2) => h2 === eventHandler) !== eventHandler) {
      this._logger.debug("addDatasetEventHandler event_handlers=%s", event_handlers);
      event_handlers.push(eventHandler);
    }
  }
  removeDatasetEventHandler(dataset_uuid, eventHandler) {
    let event_handlers = this._dataset_uuid_to_event_handlers.get(dataset_uuid);
    if (event_handlers === void 0) {
      return;
    }
    event_handlers = event_handlers.filter((h2) => h2 !== eventHandler);
    if (event_handlers.length == 0) {
      const ws = this._ws;
      if (ws) {
        const msg = JSON.stringify({ unsubscribe: { dataset_uuid } });
        this._requestLogger.debug("ws send: %s", msg);
        ws.send(msg);
      }
      this._dataset_uuid_to_event_handlers.delete(dataset_uuid);
    }
  }
  removeAllDatasetEventHandlers(dataset_uuid) {
    let event_handlers = this._dataset_uuid_to_event_handlers.get(dataset_uuid);
    if (event_handlers === void 0) {
      return;
    }
    const ws = this._ws;
    if (ws) {
      const msg = JSON.stringify({ unsubscribe: { dataset_uuid } });
      this._requestLogger.debug("ws send: %s", msg);
      ws.send(msg);
    }
    this._dataset_uuid_to_event_handlers.delete(dataset_uuid);
  }
  async startWorkflow(account_uuid, template_name, workflow) {
    return this.request(`/workflows?account_uuid=${account_uuid}&template_name=${template_name}`, {
      method: "POST",
      body: JSON.stringify(workflow),
      headers: { "Content-Type": "application/json" }
    });
  }
  async getWorkflow(workflow_id, account_uuid) {
    return this.request(`/workflows/${workflow_id}?account_uuid=${account_uuid}`, {
      method: "GET"
    });
  }
  async listWorkflows(account_uuid, dataset_uuids, model_uuids, phases) {
    const datasetQuery = dataset_uuids?.map((uuid) => `dataset_uuid=${uuid}`).join("&") || "";
    const modelQuery = model_uuids?.map((uuid) => `model_uuid=${uuid}`).join("&") || "";
    const phaseQuery = phases?.map((p2) => `phase=${p2}`).join("&") || "";
    const queryParams = [datasetQuery, modelQuery, phaseQuery].filter((q2) => q2).join("&");
    return this.request(`/workflows?account_uuid=${account_uuid}${queryParams ? `&${queryParams}` : ""}`, {
      method: "GET"
    });
  }
  async inferAsset(asset_uuid, infer_request, dataset_uuid, dataset_version, transcode_mode, start_timestamp, end_timestamp) {
    const datasetQuery = dataset_uuid ? `dataset_uuid=${dataset_uuid}&` : "";
    const versionQuery = dataset_version ? `dataset_version=${dataset_version}&` : "";
    const transcodeModeQuery = transcode_mode ? `transcode_mode=${transcode_mode}&` : "";
    const startTimestampQuery = start_timestamp ? `start_timestamp=${start_timestamp}&` : "";
    const endTimestampQuery = end_timestamp ? `end_timestamp=${end_timestamp}&` : "";
    const assetUrl = `ai.eyepop://data/assets/${asset_uuid}?${transcodeModeQuery}${datasetQuery}${versionQuery}${startTimestampQuery}${endTimestampQuery}`;
    if (!this.vlmApiUrl || !this._client || !this._limit) {
      throw new Error("endpoint not connected, use connect()");
    }
    await this._limit.acquire();
    try {
      this.updateState();
      const job = new InferAssetJob(
        assetUrl,
        infer_request,
        async (path2, options) => {
          return await this.request(
            path2,
            options,
            false,
            "vlm"
            /* vlm */
          );
        },
        this._requestLogger
      );
      return job.start(() => {
        this.jobDone(job);
      });
    } catch (e3) {
      this._limit.release();
      throw e3;
    }
  }
  async evaluateDataset(evaluate_request, worker_release) {
    if (!this.vlmApiUrl || !this._client || !this._limit) {
      throw new Error("endpoint not connected, use connect()");
    }
    await this._limit.acquire();
    try {
      this.updateState();
      const job = new EvaluateDatasetJob(
        evaluate_request,
        worker_release ?? null,
        async (path2, options) => {
          return await this.request(
            path2,
            options,
            false,
            "vlm"
            /* vlm */
          );
        },
        this._requestLogger
      );
      return job.start(() => {
        this.jobDone(job);
      });
    } catch (e3) {
      this._limit.release();
      throw e3;
    }
  }
  jobDone(_job) {
    this._limit?.release();
  }
  async dispatchChangeEvent(change_event) {
    switch (change_event.change_type) {
      // account event types
      case "dataset_added":
      case "dataset_modified":
      case "dataset_removed":
      case "dataset_version_modified":
      case "workflow_started":
      case "workflow_succeeded":
      case "workflow_failed":
      case "workflow_task_started":
      case "workflow_task_succeeded":
      case "workflow_task_failed":
        this._logger.debug("dispatchChangeEvent account_event_handlers=%s", this._account_event_handlers);
        for (let handler of this._account_event_handlers) {
          await handler(change_event);
        }
        break;
      // dataset event types
      case "asset_added":
      case "asset_removed":
      case "asset_status_modified":
      case "asset_annotation_modified":
      case "model_added":
      case "model_modified":
      case "model_removed":
      case "model_status_modified":
      case "model_progress":
        const event_handlers = this._dataset_uuid_to_event_handlers.get(change_event.dataset_uuid);
        this._logger.debug("dispatchChangeEvent event_handlers=%s", event_handlers);
        if (event_handlers !== void 0) {
          for (let handler of event_handlers) {
            await handler(change_event);
          }
        }
        break;
    }
  }
  // Vlm Ability Management
  async listVlmAbilityGroups() {
    return this.request(`/vlm_ability_groups?account_uuid=${this._accountId}`, {
      method: "GET"
    });
  }
  async createVlmAbilityGroup(create) {
    return this.request(`/vlm_ability_groups?account_uuid=${this._accountId}`, {
      method: "POST",
      body: JSON.stringify(create),
      headers: { "Content-Type": "application/json" }
    });
  }
  async getVlmAbilityGroup(vlm_ability_group_uuid) {
    return this.request(`/vlm_ability_groups/${vlm_ability_group_uuid}`, {
      method: "GET"
    });
  }
  async deleteVlmAbilityGroup(vlm_ability_group_uuid) {
    return this.request(`/vlm_ability_groups/${vlm_ability_group_uuid}`, {
      method: "DELETE"
    });
  }
  async updateVlmAbilityGroup(vlm_ability_group_uuid, update) {
    return this.request(`/vlm_ability_groups/${vlm_ability_group_uuid}`, {
      method: "PATCH",
      body: JSON.stringify(update),
      headers: { "Content-Type": "application/json" }
    });
  }
  async listVlmAbilities() {
    return this.request(`/vlm_abilities?account_uuid=${this._accountId}`, {
      method: "GET"
    });
  }
  async createVlmAbility(create, vlm_ability_group_uuid) {
    const groupQuery = vlm_ability_group_uuid ? `&vlm_ability_group_uuid=${vlm_ability_group_uuid}` : "";
    return this.request(`/vlm_abilities?account_uuid=${this._accountId}${groupQuery}`, {
      method: "POST",
      body: JSON.stringify(create),
      headers: { "Content-Type": "application/json" }
    });
  }
  async getVlmAbility(vlm_ability_uuid) {
    return this.request(`/vlm_abilities/${vlm_ability_uuid}`, {
      method: "GET"
    });
  }
  async deleteVlmAbility(vlm_ability_uuid) {
    return this.request(`/vlm_abilities/${vlm_ability_uuid}`, {
      method: "DELETE"
    });
  }
  async updateVlmAbility(vlm_ability_uuid, update) {
    return this.request(`/vlm_abilities/${vlm_ability_uuid}`, {
      method: "PATCH",
      body: JSON.stringify(update),
      headers: { "Content-Type": "application/json" }
    });
  }
  async publishVlmAbility(vlm_ability_uuid, alias_name, tag_name) {
    const alias_name_query = alias_name ? `alias_name=${encodeURIComponent(alias_name)}&` : "";
    const tag_name_query = tag_name ? `tag_name=${encodeURIComponent(tag_name)}&` : "";
    return this.request(`/vlm_abilities/${vlm_ability_uuid}/publish?${alias_name_query}${tag_name_query}`, {
      method: "POST"
    });
  }
  async addVlmAbilityAlias(vlm_ability_uuid, alias_name, tag_name) {
    return this.request(`/vlm_abilities/${vlm_ability_uuid}/alias/${encodeURIComponent(alias_name)}/tag/${tag_name ? encodeURIComponent(tag_name) : ""}`, {
      method: "POST"
    });
  }
  async removeVlmAbilityAlias(vlm_ability_uuid, alias_name, tag_name) {
    return this.request(`/vlm_abilities/${vlm_ability_uuid}/alias/${encodeURIComponent(alias_name)}/tag/${encodeURIComponent(tag_name)}`, {
      method: "DELETE"
    });
  }
};
var WebrtcWhep = class extends WebrtcBase {
  constructor(ingressId, getSession, client, requestLogger) {
    super(getSession, client, ingressId, "liveIngress/whep", false, requestLogger);
    this._stream = null;
  }
  async close() {
    const stream = this._stream;
    this._stream = null;
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => {
        track.stop();
      });
    }
    return super.close();
  }
  async stream() {
    if (this._stream) {
      return Promise.resolve(this._stream);
    } else {
      return Promise.reject("fetching stream failed");
    }
  }
  async start() {
    const session = await this._getSession();
    const egressUrl = this.gresUrl(session);
    const response = await this._client.fetch(egressUrl, {
      headers: session.authenticationHeaders(),
      method: "GET"
    });
    if (response.status >= 300) {
      return Promise.reject(`unknown status code for GET '${egressUrl}': ${response.status} (${response.statusText})`);
    }
    return this.onIceServers(response);
  }
  async onRemoteAnswer(answer) {
    if (!this._pc) {
      throw new Error("onLocalOffer no peer connection");
    }
    await this._pc.setRemoteDescription(new RTCSessionDescription(answer));
    if (this._queuedCandidates.length !== 0) {
      await this.sendLocalCandidates(this._queuedCandidates);
      this._queuedCandidates = [];
    }
    return this;
  }
  async onIceServers(response) {
    if (this._stream) {
      throw new Error("onIceServers has stream");
    }
    const pc = new RTCPeerConnection({
      iceServers: WebrtcBase.linkToIceServers(response.headers.get("Link"))
    });
    const direction = "sendrecv";
    pc.addTransceiver("video", { direction });
    pc.onicecandidate = (evt) => this.onLocalCandidate(evt);
    this._pc = pc;
    this._requestLogger.info(`onIceServers ${pc.iceConnectionState}`);
    return new Promise(async (resolve, reject) => {
      pc.ontrack = (evt) => {
        this._requestLogger.debug(`new track: ${evt.track.kind}`);
        this._stream = evt.streams[0] || null;
        resolve(this);
      };
      pc.oniceconnectionstatechange = () => {
        switch (pc.iceConnectionState) {
          case "failed":
          case "disconnected":
            this._requestLogger.debug("oniceconnectionstatechange disconnected");
            reject(`peer connection: ${pc.iceConnectionState}`);
            break;
          case "connected":
            this._requestLogger.debug("oniceconnectionstatechange connected");
            break;
        }
      };
      await this.onLocalOffer(await pc.createOffer());
    });
  }
};
var readEnv = (env) => {
  if (typeof process !== "undefined") {
    return process.env?.[env] ?? void 0;
  }
  return void 0;
};
var stringToBooleanSafe = (str) => {
  if (typeof str == "undefined") {
    return false;
  }
  const loweCaseStr = str.toLowerCase();
  return loweCaseStr == "true" || loweCaseStr == "yes";
};
var EyePop;
((EyePop22) => {
  const envApiKey = readEnv("EYEPOP_API_KEY");
  const defaultAuth = envApiKey ? {
    apiKey: envApiKey
  } : void 0;
  EyePop22.endpoint = workerEndpoint;
  function workerEndpoint(opts = {}) {
    if (opts.isLocalMode === void 0) {
      opts.isLocalMode = stringToBooleanSafe(readEnv("EYEPOP_LOCAL_MODE"));
    }
    if (opts.isLocalMode) {
      opts.eyepopUrl = "http://127.0.0.1:8080";
    }
    _fill_default_options(opts);
    if (opts.auth === void 0) {
      if (opts.isLocalMode) {
        opts.auth = { isLocal: true };
      } else {
        throw new Error("auth option or EYEPOP_API_KEY environment variable is required");
      }
    }
    if (opts.popId === void 0) {
      opts.popId = readEnv("EYEPOP_POP_ID") || "transient";
    }
    if (opts.autoStart === void 0) {
      opts.autoStart = true;
    }
    if (opts.stopJobs === void 0) {
      opts.stopJobs = true;
    }
    if (opts.auth !== void 0) {
      if (opts.auth.session !== void 0) {
        if (opts.auth.session !== void 0) {
          if (opts.auth.session.popId) {
            opts.popId = opts.auth.session.popId;
          }
        }
      }
    }
    return new WorkerEndpoint(opts);
  }
  EyePop22.workerEndpoint = workerEndpoint;
  function dataEndpoint(opts = {}) {
    _fill_default_options(opts);
    if (opts.auth === void 0) {
      throw new Error("auth option or EYEPOP_API_KEY environment variable is required");
    }
    if (opts.accountId === void 0) {
      opts.accountId = readEnv("EYEPOP_ACCOUNT_ID");
    }
    if (opts.auth.session !== void 0) {
      if (opts.auth.session !== void 0) {
        if (opts.auth.session.accountId) {
          opts.accountId = opts.auth.session.accountId;
        }
      }
    }
    return new DataEndpoint(opts);
  }
  EyePop22.dataEndpoint = dataEndpoint;
  function _fill_default_options(opts) {
    if (!opts.auth) {
      opts.auth = defaultAuth;
    }
    if (!opts.eyepopUrl && opts.auth && opts.auth.session && opts.auth.session.eyepopUrl) {
      opts.eyepopUrl = opts.auth.session.eyepopUrl;
    }
    if (!opts.eyepopUrl) {
      opts.eyepopUrl = readEnv("EYEPOP_URL");
    }
    if (!opts.eyepopUrl) {
      opts.eyepopUrl = "https://compute.eyepop.ai";
    }
    if (opts.auth) {
      if (opts.auth.oAuth2 !== void 0) {
        if (typeof opts.auth.oAuth2 === "boolean") {
          if (opts.eyepopUrl && opts.eyepopUrl.match(/https:(.*).staging.eyepop.xyz/i)) {
            opts.auth = {
              oAuth2: {
                domain: "dev-eyepop.us.auth0.com",
                clientId: "jktx3YO2UnbkNPvr05PQWf26t1kNTJyg",
                audience: "https://dev-app.eyepop.ai",
                scope: "admin:clouds access:inference-api access:datasets"
              }
            };
          } else {
            opts.auth = {
              oAuth2: {
                domain: "eyepop.us.auth0.com",
                clientId: "Lb9ubA9Hf3jlaqWLUx8XgA0zvotgViCl",
                audience: "https://api.eyepop.ai",
                scope: "admin:clouds access:inference-api access:datasets"
              }
            };
          }
        }
      }
    }
    if (!opts.jobQueueLength) {
      opts.jobQueueLength = 128;
    }
  }
})(EyePop || (EyePop = {}));
var index_default = EyePop;

// popup.js
var { EyePop: EyePop2, PopComponentType: PopComponentType2, ForwardOperatorType: ForwardOperatorType2 } = eyepop_index_exports;
if (!EyePop2 || !PopComponentType2 || !ForwardOperatorType2) {
  throw new Error("Missing EyePop exports. Check EP exports in console.");
}
var SOCKET_URL = "http://localhost:3000";
var socket = null;
var currentSession = null;
var currentPlayer = null;
var epEndpoint = null;
var epStream = null;
var epStop = false;
var latestScore = 50;
var scoreEma = 70;
var pages = null;
var trackingInterval = null;
var scoreEmitInterval = null;
var sessionTimeRemaining = 900;
var skeletonCanvas = null;
var skeletonCtx = null;
var greenZoneTime = 0;
var greenZoneStart = null;
var streakSeconds = 0;
var totalPoints = 0;
var lastPointTickAt = null;
var PostureVisualIntelligence = {
  components: [{
    type: PopComponentType2.INFERENCE,
    ability: "eyepop.person.2d-body-points:latest",
    categoryName: "person",
    confidenceThreshold: 0.5,
    forward: {
      operator: { type: ForwardOperatorType2.CROP },
      targets: [{
        type: PopComponentType2.INFERENCE,
        ability: "eyepop.image-contents:latest",
        params: {
          prompts: [{
            prompt: "Analyze the person's posture in this image and determine the categories of: " + [
              "Head position (Neutral, Forward-leaning, Tilted left, Tilted right)",
              "Shoulder alignment (Level, Left higher, Right higher, Rounded/slouched)",
              "Back position (Straight, Slightly curved, Hunched, Slouched)",
              "Neck angle (Neutral, Forward, Strained)",
              "Overall posture score (Good, Fair, Poor)",
              "Describe any posture issues observed"
            ].join(", ") + ". Report the values of the categories as classLabels. If you are unable to provide a category with a value then set its classLabel to null"
          }]
        }
      }]
    }
  }]
};
function showPage(pageName) {
  if (!pages) return;
  Object.values(pages).forEach((p2) => p2.classList.remove("active"));
  pages[pageName]?.classList.add("active");
}
window.addEventListener("DOMContentLoaded", () => {
  pages = {
    mainMenu: document.getElementById("mainMenuPage"),
    duration: document.getElementById("durationPage"),
    join: document.getElementById("joinPage"),
    lobby: document.getElementById("lobbyPage"),
    session: document.getElementById("sessionPage"),
    leaderboard: document.getElementById("leaderboardPage")
  };
});
function initSocket() {
  if (socket) return;
  socket = lookup2(SOCKET_URL);
  socket.on("connect", () => console.log("Connected:", socket.id));
  socket.on("disconnect", () => console.log("Disconnected"));
  socket.on("session_created", (data) => {
    currentSession = data.sessionData;
    currentPlayer = data.player;
    sessionTimeRemaining = data.sessionData.duration;
    document.getElementById("lobbySessionCode").textContent = data.sessionCode;
    updateLobbyUI(data.sessionData);
    showPage("lobby");
  });
  socket.on("session_joined", (data) => {
    currentSession = data.sessionData;
    currentPlayer = data.player;
    sessionTimeRemaining = data.sessionData.duration;
    document.getElementById("lobbySessionCode").textContent = data.sessionCode;
    updateLobbyUI(data.sessionData);
    showPage("lobby");
  });
  socket.on("player_joined", (data) => {
    currentSession = data.sessionData;
    updateLobbyUI(data.sessionData);
  });
  socket.on("player_left", (data) => {
    currentSession = data.sessionData;
    updateLobbyUI(data.sessionData);
    if (data.newHost && data.newHost.socketId === socket.id) {
      currentPlayer.isHost = true;
      showHostControls();
    }
  });
  socket.on("session_started", (data) => {
    currentSession = data.sessionData;
    currentPlayer = data.player || currentPlayer;
    document.getElementById("activeSessionCode").textContent = currentSession.sessionId;
    showPage("session");
    startPostureTracking();
  });
  socket.on("leaderboard_update", (data) => {
    if (data?.leaderboard) renderLeaderboard(data.leaderboard);
  });
  socket.on("session_finished", (data) => {
    stopPostureTracking();
    alert(
      `Session finished!
Winner: ${data.winner.playerName} with ${data.winner.greenZoneTime}s in green zone`
    );
    showPage("mainMenu");
  });
  socket.on("error", (data) => {
    console.error("Socket error:", data.message);
    alert(data.message);
  });
}
function updateLobbyUI(sessionData) {
  document.getElementById("playerCount").textContent = sessionData.playerCount;
  const playersList = document.getElementById("playersList");
  playersList.innerHTML = "";
  for (const player of sessionData.players) {
    const item = document.createElement("div");
    item.className = "player-item";
    item.innerHTML = `
      <span class="player-name">${player.playerName}${player.isHost ? " (Host)" : ""}</span>
      <span class="player-ready">${player.isReady ? "\u2713" : ""}</span>
    `;
    playersList.appendChild(item);
  }
  if (currentPlayer?.isHost) showHostControls();
  else hideHostControls();
}
function showHostControls() {
  document.getElementById("startSessionBtn").style.display = "block";
  document.getElementById("waitingMessage").style.display = "none";
}
function hideHostControls() {
  document.getElementById("startSessionBtn").style.display = "none";
  document.getElementById("waitingMessage").style.display = "block";
}
function renderLeaderboard(leaderboard) {
  const list = document.getElementById("leaderboardFullList");
  list.innerHTML = "";
  const medals = ["\u{1F947}", "\u{1F948}", "\u{1F949}"];
  leaderboard.forEach((entry, i2) => {
    const isYou = currentPlayer && entry.playerName === currentPlayer.playerName;
    const item = document.createElement("div");
    item.className = `leaderboard-item rank-${i2 + 1}${isYou ? " highlight" : ""}`;
    item.innerHTML = `
      <span class="rank">${i2 < 3 ? medals[i2] : "#" + (i2 + 1)}</span>
      <div class="player-info">
        <span class="player">${isYou ? "You" : entry.playerName}</span>
        <span class="player-stats">${entry.score} pts \xB7 ${entry.greenZoneTime}s green</span>
      </div>
    `;
    list.appendChild(item);
    if (isYou) {
      document.getElementById("rankValue").textContent = `#${i2 + 1}`;
      document.getElementById("yourRankLarge").textContent = `#${i2 + 1}`;
      document.getElementById("yourScoreLarge").textContent = entry.score;
    }
  });
}
document.getElementById("createSessionBtn").addEventListener("click", () => {
  initSocket();
  showPage("duration");
});
document.getElementById("joinSessionBtn").addEventListener("click", () => {
  initSocket();
  showPage("join");
});
document.querySelectorAll(".duration-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const duration = parseInt(btn.dataset.duration);
    document.getElementById("lobbyDuration").textContent = `${duration / 60} minutes`;
    socket.emit("create_session", { duration });
  });
});
document.getElementById("cancelDurationBtn").addEventListener("click", () => {
  showPage("mainMenu");
});
document.getElementById("joinConfirmBtn").addEventListener("click", () => {
  const code = document.getElementById("sessionCodeInput").value.trim();
  if (!code) {
    alert("Please enter a session code");
    return;
  }
  if (code.length !== 6) {
    alert("Session code must be 6 digits");
    return;
  }
  socket.emit("join_session", { sessionCode: code });
  document.getElementById("sessionCodeInput").value = "";
});
document.getElementById("cancelJoinBtn").addEventListener("click", () => {
  document.getElementById("sessionCodeInput").value = "";
  showPage("mainMenu");
});
document.getElementById("sessionCodeInput").addEventListener("input", (e3) => {
  e3.target.value = e3.target.value.replace(/[^0-9]/g, "").slice(0, 6);
});
document.getElementById("copyLinkBtn").addEventListener("click", async () => {
  const code = document.getElementById("lobbySessionCode").textContent;
  try {
    await navigator.clipboard.writeText(code);
  } catch (_2) {
    const ta2 = document.createElement("textarea");
    ta2.value = code;
    document.body.appendChild(ta2);
    ta2.select();
    document.execCommand("copy");
    document.body.removeChild(ta2);
  }
  const btn = document.getElementById("copyLinkBtn");
  const orig = btn.textContent;
  btn.textContent = "[Copied!]";
  setTimeout(() => {
    btn.textContent = orig;
  }, 2e3);
});
document.getElementById("startSessionBtn").addEventListener("click", () => {
  if (currentSession) {
    socket.emit("start_session", { sessionCode: currentSession.sessionId });
  }
});
document.getElementById("leaveLobbyBtn").addEventListener("click", () => {
  if (currentSession) {
    socket.emit("leave_session", { sessionCode: currentSession.sessionId });
    currentSession = null;
    currentPlayer = null;
  }
  showPage("mainMenu");
});
document.getElementById("endSessionBtn").addEventListener("click", () => {
  if (confirm("Are you sure you want to end the session?")) {
    stopPostureTracking();
    if (currentSession) {
      socket.emit("leave_session", { sessionCode: currentSession.sessionId });
      currentSession = null;
      currentPlayer = null;
    }
    showPage("mainMenu");
  }
});
document.getElementById("rankStatBox").addEventListener("click", () => {
  document.getElementById("leaderboardSessionCode").textContent = document.getElementById("activeSessionCode").textContent;
  showPage("leaderboard");
});
document.getElementById("backToSessionBtn").addEventListener("click", () => {
  showPage("session");
});
async function startPostureTracking() {
  sessionTimeRemaining = currentSession?.duration ?? 900;
  greenZoneTime = 0;
  greenZoneStart = null;
  streakSeconds = 0;
  totalPoints = 0;
  lastPointTickAt = null;
  scoreEma = 70;
  latestScore = 50;
  updateTimer();
  initializeSkeletonCanvas();
  resetFeedbackUI();
  trackingInterval = setInterval(() => {
    sessionTimeRemaining--;
    updateTimer();
    if (sessionTimeRemaining <= 0) endSession();
  }, 1e3);
  scoreEmitInterval = setInterval(() => {
    if (socket && currentSession) {
      socket.emit("update_score", {
        sessionCode: currentSession.sessionId,
        score: latestScore,
        greenZoneTime: Math.round(
          greenZoneTime + (greenZoneStart !== null ? (Date.now() - greenZoneStart) / 1e3 : 0)
        )
      });
    }
  }, 1e3);
  try {
    await initializeCameraFeed();
  } catch (err) {
    console.error("initializeCameraFeed failed:", err);
  }
}
function stopPostureTracking() {
  epStop = true;
  if (trackingInterval) {
    clearInterval(trackingInterval);
    trackingInterval = null;
  }
  if (scoreEmitInterval) {
    clearInterval(scoreEmitInterval);
    scoreEmitInterval = null;
  }
  const video = document.getElementById("cameraFeed");
  if (video.srcObject) {
    video.srcObject.getTracks().forEach((t2) => t2.stop());
    video.srcObject = null;
  }
  if (epEndpoint) {
    epEndpoint.disconnect(false).catch(() => {
    });
    epEndpoint = null;
  }
  epStream = null;
}
var KEYPOINT_TTL_MS = 1500;
var kpAccumulator = {};
function accumulateKeypoints(newPoints) {
  const now = Date.now();
  for (const [key, point] of Object.entries(newPoints)) {
    kpAccumulator[key] = { point, ts: now };
  }
  for (const key of Object.keys(kpAccumulator)) {
    if (now - kpAccumulator[key].ts > KEYPOINT_TTL_MS) {
      delete kpAccumulator[key];
    }
  }
}
function getAccumulatedKpMap() {
  const now = Date.now();
  const result = {};
  for (const [key, entry] of Object.entries(kpAccumulator)) {
    if (now - entry.ts < KEYPOINT_TTL_MS) {
      result[key] = entry.point;
    }
  }
  return result;
}
async function connectAndStream() {
  const resp = await fetch(`${SOCKET_URL}/eyepop/session`);
  if (!resp.ok) throw new Error(`Session endpoint ${resp.status}`);
  const session = await resp.json();
  if (epEndpoint) {
    try {
      epEndpoint.disconnect(false);
    } catch (_2) {
    }
  }
  epEndpoint = await EyePop2.workerEndpoint({
    auth: { session },
    popId: session.popId || "transient"
  }).connect();
  await epEndpoint.changePop(PostureVisualIntelligence);
  const resultIterator = await epEndpoint.process({ mediaStream: epStream });
  for await (const result of resultIterator) {
    if (epStop) break;
    const kpGroups = result?.keyPoints;
    if (Array.isArray(kpGroups) && kpGroups.length > 0) {
      for (const group of kpGroups) {
        const points = Array.isArray(group?.points) ? group.points : [];
        const batch = {};
        for (const p2 of points) {
          const key = normalizeLabel(p2?.classLabel);
          if (key) batch[key] = p2;
        }
        if (Object.keys(batch).length > 0) {
          accumulateKeypoints(batch);
        }
      }
      const kpMap = getAccumulatedKpMap();
      if (Object.keys(kpMap).length > 0) {
        setCameraStatus(true);
        drawSkeleton(kpMap);
        const score = scoreFromKeypoints(kpMap, result.source_width, result.source_height);
        if (score !== null) applyNumericScoreToUI(score);
      }
    }
    const vlm = extractVLMFromResult(result);
    if (vlm) renderFeedbackItems(vlm);
    tickStatsAtTime(Date.now());
  }
}
async function initializeCameraFeed() {
  const video = document.getElementById("cameraFeed");
  const canvas = document.getElementById("skeletonCanvas");
  epStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
  video.srcObject = epStream;
  await new Promise((resolve) => video.onloadedmetadata = resolve);
  await video.play();
  canvas.width = video.videoWidth || 640;
  canvas.height = video.videoHeight || 480;
  epStop = false;
  kpAccumulator = {};
  setCameraStatus(false);
  const MAX_RETRIES = 5;
  let retries = 0;
  while (!epStop && epStream) {
    try {
      await connectAndStream();
      if (!epStop) {
        retries = 0;
        await new Promise((r2) => setTimeout(r2, 500));
      }
    } catch (err) {
      if (epStop) break;
      retries++;
      console.error(`EyePop error (${retries}/${MAX_RETRIES}):`, err?.message || err);
      if (retries >= MAX_RETRIES) {
        setCameraStatus(false);
        break;
      }
      await new Promise((r2) => setTimeout(r2, Math.min(1e3 * 2 ** (retries - 1), 16e3)));
    }
  }
}
function normalizeLabel(label) {
  if (!label) return null;
  const s2 = String(label).toLowerCase().replace(/[\s\-]+/g, "_").trim();
  const alias = {
    nose: "nose",
    neck: "neck",
    left_eye: "leftEye",
    right_eye: "rightEye",
    left_ear: "leftEar",
    right_ear: "rightEar",
    left_shoulder: "leftShoulder",
    right_shoulder: "rightShoulder",
    left_elbow: "leftElbow",
    right_elbow: "rightElbow",
    left_wrist: "leftWrist",
    right_wrist: "rightWrist",
    left_hip: "leftHip",
    right_hip: "rightHip",
    left_knee: "leftKnee",
    right_knee: "rightKnee",
    left_ankle: "leftAnkle",
    right_ankle: "rightAnkle"
  };
  return alias[s2] || alias[s2.replace(/_/g, "")] || label;
}
function scoreFromKeypoints(kpMap, sourceWidth, sourceHeight) {
  const {
    nose,
    leftShoulder: ls,
    rightShoulder: rs,
    leftHip: lh,
    rightHip: rh,
    leftKnee: lk,
    rightKnee: rk,
    leftAnkle: la,
    rightAnkle: ra
  } = kpMap;
  const isStanding = !!(lk || rk || la || ra);
  if (nose && ls && rs && lh && rh) {
    const midShoulder = { x: (ls.x + rs.x) / 2, y: (ls.y + rs.y) / 2 };
    const midHip = { x: (lh.x + rh.x) / 2, y: (lh.y + rh.y) / 2 };
    const torsoVec = { x: midShoulder.x - midHip.x, y: midShoulder.y - midHip.y };
    const torsoLen = Math.hypot(torsoVec.x, torsoVec.y) || 1;
    const torsoAngleDeg = Math.abs(Math.atan2(torsoVec.x, -torsoVec.y) * (180 / Math.PI));
    const shoulderTilt = Math.abs(ls.y - rs.y) / torsoLen;
    const hipTilt = Math.abs(lh.y - rh.y) / torsoLen;
    const headLateral = Math.abs(nose.x - midShoulder.x) / torsoLen;
    const noseToShoulderY = (midShoulder.y - nose.y) / torsoLen;
    const headDrop = Math.max(0, 0.3 - noseToShoulderY);
    let penalty;
    if (isStanding) {
      penalty = torsoAngleDeg * 3 + headLateral * 180 + headDrop * 250 + shoulderTilt * 200 + hipTilt * 150;
      if (lk && rk) {
        const midKnee = { x: (lk.x + rk.x) / 2 };
        penalty += Math.abs(midKnee.x - midHip.x) / torsoLen * 100;
      }
    } else {
      penalty = torsoAngleDeg * 2.5 + headLateral * 200 + headDrop * 200 + shoulderTilt * 180 + hipTilt * 120;
    }
    return applyEma(penalty);
  }
  if (nose && ls && rs) {
    const midSx = (ls.x + rs.x) / 2;
    const midSy = (ls.y + rs.y) / 2;
    const span = Math.abs(ls.x - rs.x) || 1;
    let penalty = 0;
    penalty += Math.max(0, Math.abs(nose.x - midSx) / span - 0.08) * 350;
    penalty += Math.max(0, 0.35 - (midSy - nose.y) / span) * 180;
    penalty += Math.abs(ls.y - rs.y) / span * 250;
    return applyEma(penalty);
  }
  if (ls && rs) {
    const tilt = Math.abs(ls.y - rs.y) / (sourceHeight || 480);
    const raw = Math.max(20, Math.min(100, Math.round(100 - tilt * 800)));
    scoreEma = 0.8 * scoreEma + 0.2 * raw;
    return Math.round(scoreEma);
  }
  return null;
}
function applyEma(penalty) {
  const raw = Math.max(0, Math.min(100, Math.round(100 - penalty)));
  scoreEma = 0.8 * scoreEma + 0.2 * raw;
  return Math.round(scoreEma);
}
function extractVLMFromResult(result) {
  const allClasses = [];
  if (Array.isArray(result?.classes)) allClasses.push(...result.classes);
  if (Array.isArray(result?.objects)) {
    for (const obj of result.objects) {
      if (Array.isArray(obj?.classes)) allClasses.push(...obj.classes);
      if (Array.isArray(obj?.objects)) {
        for (const child of obj.objects) {
          if (Array.isArray(child?.classes)) allClasses.push(...child.classes);
        }
      }
    }
  }
  if (allClasses.length === 0) return null;
  const map = {};
  for (const c2 of allClasses) {
    const cat = String(c2?.category ?? "").toLowerCase().trim();
    if (cat) map[cat] = { label: c2.classLabel || null, confidence: c2.confidence ?? 1 };
  }
  return Object.keys(map).length > 0 ? map : null;
}
var FEEDBACK_CATEGORIES = [
  { key: "head position", label: "Head position" },
  { key: "shoulder alignment", label: "Shoulders" },
  { key: "back position", label: "Back position" },
  { key: "neck angle", label: "Neck angle" },
  { key: "overall posture score", label: "Overall posture" },
  { key: "describe any posture issues observed", label: "Issues" }
];
var WARNING_WORDS = [
  "forward-leaning",
  "tilted",
  "higher",
  "rounded",
  "slouched",
  "slightly curved",
  "forward",
  "strained",
  "fair"
];
var BAD_WORDS = ["hunched", "slouched", "poor"];
function classifyLabel(label) {
  if (!label) return "good";
  const l2 = label.toLowerCase();
  if (BAD_WORDS.some((w2) => l2.includes(w2))) return "bad";
  if (WARNING_WORDS.some((w2) => l2.includes(w2))) return "warning";
  return "good";
}
function renderFeedbackItems(vlmMap) {
  const container = document.getElementById("feedbackItems");
  container.innerHTML = "";
  for (const { key, label } of FEEDBACK_CATEGORIES) {
    const entry = vlmMap[key] || findClosestKey(vlmMap, key);
    if (!entry?.label) continue;
    const tier = classifyLabel(entry.label);
    const icon = tier === "good" ? "\u2713" : tier === "warning" ? "\u26A0" : "\u2717";
    const item = document.createElement("div");
    item.className = `feedback-item ${tier}`;
    item.innerHTML = `
      <span class="feedback-icon">${icon}</span>
      <span><strong>${label}:</strong> ${entry.label}</span>
    `;
    container.appendChild(item);
  }
  if (container.children.length === 0) {
    const item = document.createElement("div");
    item.className = "feedback-item good";
    item.innerHTML = `<span class="feedback-icon">\u2713</span><span>Awaiting analysis\u2026</span>`;
    container.appendChild(item);
  }
}
function findClosestKey(vlmMap, target) {
  const t2 = target.toLowerCase();
  for (const k2 of Object.keys(vlmMap)) {
    if (k2.startsWith(t2) || t2.startsWith(k2)) return vlmMap[k2];
  }
  return null;
}
function resetFeedbackUI() {
  document.getElementById("feedbackItems").innerHTML = `
    <div class="feedback-item good">
      <span class="feedback-icon">\u23F3</span>
      <span>Waiting for camera\u2026</span>
    </div>
  `;
}
function setCameraStatus(personDetected) {
  const dot = document.querySelector("#cameraStatus .status-dot");
  const text = document.querySelector("#cameraStatus .status-text");
  if (personDetected) {
    dot.style.backgroundColor = "";
    text.textContent = "Tracking";
  } else {
    dot.style.backgroundColor = "#f44336";
    text.textContent = "No Person Detected";
  }
}
var GREEN_THRESHOLD = 85;
function tickStatsAtTime(now) {
  const inGreen = latestScore >= GREEN_THRESHOLD;
  if (inGreen) {
    if (greenZoneStart === null) greenZoneStart = now;
    streakSeconds = (now - greenZoneStart) / 1e3;
  } else {
    if (greenZoneStart !== null) {
      greenZoneTime += (now - greenZoneStart) / 1e3;
      greenZoneStart = null;
    }
    streakSeconds = 0;
  }
  if (inGreen) {
    if (lastPointTickAt === null) lastPointTickAt = now;
    const ticks = Math.floor((now - lastPointTickAt) / 1e3);
    if (ticks > 0) {
      totalPoints += ticks;
      lastPointTickAt += ticks * 1e3;
    }
  } else {
    lastPointTickAt = null;
  }
  document.getElementById("streakValue").textContent = (streakSeconds / 60).toFixed(1);
  document.getElementById("pointsValue").textContent = `+${totalPoints}`;
}
function applyNumericScoreToUI(score) {
  latestScore = score;
  document.getElementById("scoreBadge").textContent = String(score);
  updatePostureStatusFromScore(score);
}
function updatePostureStatusFromScore(score) {
  const container = document.getElementById("cameraContainer");
  const status = document.getElementById("postureStatus");
  container.classList.remove("warning", "danger");
  status.classList.remove("warning", "danger");
  if (score >= 85) {
    status.querySelector(".status-text").textContent = "Good Posture";
    status.querySelector(".status-icon").textContent = "\u2713";
  } else if (score >= 50) {
    container.classList.add("warning");
    status.classList.add("warning");
    status.querySelector(".status-text").textContent = "Need Adjustment";
    status.querySelector(".status-icon").textContent = "\u26A0";
  } else {
    container.classList.add("danger");
    status.classList.add("danger");
    status.querySelector(".status-text").textContent = "Poor Posture";
    status.querySelector(".status-icon").textContent = "\u2717";
  }
}
function updateTimer() {
  const m2 = Math.floor(sessionTimeRemaining / 60);
  const s2 = sessionTimeRemaining % 60;
  document.getElementById("timeRemaining").textContent = `${m2}:${s2.toString().padStart(2, "0")}`;
}
function initializeSkeletonCanvas() {
  const video = document.getElementById("cameraFeed");
  skeletonCanvas = document.getElementById("skeletonCanvas");
  skeletonCtx = skeletonCanvas.getContext("2d");
  skeletonCanvas.width = video.videoWidth || 640;
  skeletonCanvas.height = video.videoHeight || 480;
}
var SKELETON_EDGES = [
  ["nose", "leftEye"],
  ["nose", "rightEye"],
  ["leftEye", "leftEar"],
  ["rightEye", "rightEar"],
  ["nose", "leftShoulder"],
  ["nose", "rightShoulder"],
  ["leftShoulder", "rightShoulder"],
  ["leftShoulder", "leftElbow"],
  ["rightShoulder", "rightElbow"],
  ["leftElbow", "leftWrist"],
  ["rightElbow", "rightWrist"],
  ["leftShoulder", "leftHip"],
  ["rightShoulder", "rightHip"],
  ["leftHip", "rightHip"],
  ["leftHip", "leftKnee"],
  ["rightHip", "rightKnee"],
  ["leftKnee", "leftAnkle"],
  ["rightKnee", "rightAnkle"]
];
function drawSkeleton(kpMap) {
  if (!skeletonCtx || !skeletonCanvas) return;
  if (Object.keys(kpMap).length === 0) return;
  skeletonCtx.clearRect(0, 0, skeletonCanvas.width, skeletonCanvas.height);
  const color = latestScore >= 85 ? "#4caf50" : latestScore >= 50 ? "#ffc107" : "#f44336";
  skeletonCtx.strokeStyle = color;
  skeletonCtx.lineWidth = 3;
  skeletonCtx.shadowBlur = 6;
  skeletonCtx.shadowColor = color;
  for (const [a2, b2] of SKELETON_EDGES) {
    const A2 = kpMap[a2];
    const B2 = kpMap[b2];
    if (!A2 || !B2 || (A2.confidence ?? 1) < 0.15 || (B2.confidence ?? 1) < 0.15) continue;
    skeletonCtx.beginPath();
    skeletonCtx.moveTo(A2.x, A2.y);
    skeletonCtx.lineTo(B2.x, B2.y);
    skeletonCtx.stroke();
  }
  skeletonCtx.fillStyle = color;
  skeletonCtx.shadowBlur = 10;
  for (const p2 of Object.values(kpMap)) {
    if ((p2.confidence ?? 1) < 0.15) continue;
    skeletonCtx.beginPath();
    skeletonCtx.arc(p2.x, p2.y, 5, 0, Math.PI * 2);
    skeletonCtx.fill();
  }
  skeletonCtx.shadowBlur = 0;
}
function endSession() {
  if (greenZoneStart !== null) {
    greenZoneTime += (Date.now() - greenZoneStart) / 1e3;
    greenZoneStart = null;
  }
  stopPostureTracking();
  alert("\u{1F389} Session Complete!\n\nGreat job maintaining your posture!");
  showPage("mainMenu");
}
window.addEventListener("beforeunload", () => {
  epStop = true;
  if (socket && currentSession) {
    socket.emit("leave_session", { sessionCode: currentSession.sessionId });
  }
});
/*! Bundled license information:

@eyepop.ai/eyepop/dist/eyepop.index.mjs:
  (*! Bundled license information:
  
  mime-db/index.js:
    (*!
     * mime-db
     * Copyright(c) 2014 Jonathan Ong
     * Copyright(c) 2015-2022 Douglas Christopher Wilson
     * MIT Licensed
     *)
  
  mime-types/index.js:
    (*!
     * mime-types
     * Copyright(c) 2014 Jonathan Ong
     * Copyright(c) 2015 Douglas Christopher Wilson
     * MIT Licensed
     *)
  *)
*/
