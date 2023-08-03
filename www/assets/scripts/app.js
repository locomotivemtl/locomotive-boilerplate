(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __objRest = (source, exclude) => {
    var target = {};
    for (var prop in source)
      if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
        target[prop] = source[prop];
    if (source != null && __getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(source)) {
        if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
          target[prop] = source[prop];
      }
    return target;
  };
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e2) {
          reject(e2);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e2) {
          reject(e2);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // node_modules/svg4everybody/dist/svg4everybody.js
  var require_svg4everybody = __commonJS({
    "node_modules/svg4everybody/dist/svg4everybody.js"(exports, module) {
      !function(root, factory) {
        "function" == typeof define && define.amd ? (
          // AMD. Register as an anonymous module unless amdModuleId is set
          define([], function() {
            return root.svg4everybody = factory();
          })
        ) : "object" == typeof module && module.exports ? (
          // Node. Does not work with strict CommonJS, but
          // only CommonJS-like environments that support module.exports,
          // like Node.
          module.exports = factory()
        ) : root.svg4everybody = factory();
      }(exports, function() {
        function embed(parent, svg, target) {
          if (target) {
            var fragment = document.createDocumentFragment(), viewBox = !svg.hasAttribute("viewBox") && target.getAttribute("viewBox");
            viewBox && svg.setAttribute("viewBox", viewBox);
            for (var clone = target.cloneNode(true); clone.childNodes.length; ) {
              fragment.appendChild(clone.firstChild);
            }
            parent.appendChild(fragment);
          }
        }
        function loadreadystatechange(xhr) {
          xhr.onreadystatechange = function() {
            if (4 === xhr.readyState) {
              var cachedDocument = xhr._cachedDocument;
              cachedDocument || (cachedDocument = xhr._cachedDocument = document.implementation.createHTMLDocument(""), cachedDocument.body.innerHTML = xhr.responseText, xhr._cachedTarget = {}), // clear the xhr embeds list and embed each item
              xhr._embeds.splice(0).map(function(item) {
                var target = xhr._cachedTarget[item.id];
                target || (target = xhr._cachedTarget[item.id] = cachedDocument.getElementById(item.id)), // embed the target into the svg
                embed(item.parent, item.svg, target);
              });
            }
          }, // test the ready state change immediately
          xhr.onreadystatechange();
        }
        function svg4everybody2(rawopts) {
          function oninterval() {
            for (var index = 0; index < uses.length; ) {
              var use = uses[index], parent = use.parentNode, svg = getSVGAncestor(parent), src = use.getAttribute("xlink:href") || use.getAttribute("href");
              if (!src && opts.attributeName && (src = use.getAttribute(opts.attributeName)), svg && src) {
                if (polyfill) {
                  if (!opts.validate || opts.validate(src, svg, use)) {
                    parent.removeChild(use);
                    var srcSplit = src.split("#"), url = srcSplit.shift(), id = srcSplit.join("#");
                    if (url.length) {
                      var xhr = requests[url];
                      xhr || (xhr = requests[url] = new XMLHttpRequest(), xhr.open("GET", url), xhr.send(), xhr._embeds = []), // add the svg and id as an item to the xhr embeds list
                      xhr._embeds.push({
                        parent,
                        svg,
                        id
                      }), // prepare the xhr ready state change event
                      loadreadystatechange(xhr);
                    } else {
                      embed(parent, svg, document.getElementById(id));
                    }
                  } else {
                    ++index, ++numberOfSvgUseElementsToBypass;
                  }
                }
              } else {
                ++index;
              }
            }
            (!uses.length || uses.length - numberOfSvgUseElementsToBypass > 0) && requestAnimationFrame2(oninterval, 67);
          }
          var polyfill, opts = Object(rawopts), newerIEUA = /\bTrident\/[567]\b|\bMSIE (?:9|10)\.0\b/, webkitUA = /\bAppleWebKit\/(\d+)\b/, olderEdgeUA = /\bEdge\/12\.(\d+)\b/, edgeUA = /\bEdge\/.(\d+)\b/, inIframe = window.top !== window.self;
          polyfill = "polyfill" in opts ? opts.polyfill : newerIEUA.test(navigator.userAgent) || (navigator.userAgent.match(olderEdgeUA) || [])[1] < 10547 || (navigator.userAgent.match(webkitUA) || [])[1] < 537 || edgeUA.test(navigator.userAgent) && inIframe;
          var requests = {}, requestAnimationFrame2 = window.requestAnimationFrame || setTimeout, uses = document.getElementsByTagName("use"), numberOfSvgUseElementsToBypass = 0;
          polyfill && oninterval();
        }
        function getSVGAncestor(node) {
          for (var svg = node; "svg" !== svg.nodeName.toLowerCase() && (svg = svg.parentNode); ) {
          }
          return svg;
        }
        return svg4everybody2;
      });
    }
  });

  // assets/scripts/utils/grid-helper.js
  var grid_helper_exports = {};
  __export(grid_helper_exports, {
    gridHelper: () => gridHelper
  });
  function gridHelper({
    gutterCssVar = GRID_HELPER_GUTTER_CSS_VAR,
    marginCssVar = GRID_HELPER_MARGIN_CSS_VAR,
    rgbaColor = GRID_HELPER_RGBA_COLOR
  } = {}) {
    const $gridContainer = document.createElement("div");
    document.body.append($gridContainer);
    setGridHelperColumns($gridContainer, rgbaColor);
    setGridHelperStyles($gridContainer, gutterCssVar, marginCssVar);
    setGridEvents($gridContainer, rgbaColor);
  }
  function setGridHelperStyles($container, gutterCssVar, marginCssVar) {
    const elStyles = $container.style;
    elStyles.zIndex = "10000";
    elStyles.position = "fixed";
    elStyles.top = "0";
    elStyles.left = "0";
    elStyles.display = "flex";
    elStyles.width = "100%";
    elStyles.height = "100%";
    elStyles.columnGap = `var(${gutterCssVar}, 0)`;
    elStyles.paddingLeft = `var(${marginCssVar}, 0)`;
    elStyles.paddingRight = `var(${marginCssVar}, 0)`;
    elStyles.pointerEvents = "none";
    elStyles.visibility = "hidden";
  }
  function setGridHelperColumns($container, rgbaColor) {
    $container.innerHTML = "";
    const columns = Number(
      window.getComputedStyle($container).getPropertyValue("--grid-columns")
    );
    let $col;
    for (var i2 = 0; i2 < columns; i2++) {
      $col = document.createElement("div");
      $col.style.flex = "1 1 0";
      $col.style.backgroundColor = rgbaColor;
      $container.appendChild($col);
    }
  }
  function setGridEvents($container, rgbaColor) {
    window.addEventListener(
      "resize",
      setGridHelperColumns($container, rgbaColor)
    );
    let ctrlDown = false;
    let isActive = false;
    document.addEventListener("keydown", (e2) => {
      if (e2.key == "Control") {
        ctrlDown = true;
      } else {
        if (ctrlDown && e2.key == "g") {
          if (isActive) {
            $container.style.visibility = "hidden";
          } else {
            $container.style.visibility = "visible";
          }
          isActive = !isActive;
        }
      }
    });
    document.addEventListener("keyup", (e2) => {
      if (e2.key == "Control") {
        ctrlDown = false;
      }
    });
  }
  var GRID_HELPER_GUTTER_CSS_VAR, GRID_HELPER_MARGIN_CSS_VAR, GRID_HELPER_RGBA_COLOR;
  var init_grid_helper = __esm({
    "assets/scripts/utils/grid-helper.js"() {
      GRID_HELPER_GUTTER_CSS_VAR = "--grid-gutter";
      GRID_HELPER_MARGIN_CSS_VAR = "--grid-margin";
      GRID_HELPER_RGBA_COLOR = "rgba(255, 0, 0, .1)";
    }
  });

  // node_modules/modujs/dist/main.esm.js
  function _typeof(obj) {
    "@babel/helpers - typeof";
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function(obj2) {
        return typeof obj2;
      };
    } else {
      _typeof = function(obj2) {
        return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
      };
    }
    return _typeof(obj);
  }
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function _defineProperties(target, props) {
    for (var i2 = 0; i2 < props.length; i2++) {
      var descriptor = props[i2];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor)
        descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps)
      _defineProperties(Constructor.prototype, protoProps);
    if (staticProps)
      _defineProperties(Constructor, staticProps);
    return Constructor;
  }
  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  function _slicedToArray(arr, i2) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i2) || _unsupportedIterableToArray(arr, i2) || _nonIterableRest();
  }
  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }
  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr))
      return _arrayLikeToArray(arr);
  }
  function _arrayWithHoles(arr) {
    if (Array.isArray(arr))
      return arr;
  }
  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter))
      return Array.from(iter);
  }
  function _iterableToArrayLimit(arr, i2) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr)))
      return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = void 0;
    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);
        if (i2 && _arr.length === i2)
          break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null)
          _i["return"]();
      } finally {
        if (_d)
          throw _e;
      }
    }
    return _arr;
  }
  function _unsupportedIterableToArray(o2, minLen) {
    if (!o2)
      return;
    if (typeof o2 === "string")
      return _arrayLikeToArray(o2, minLen);
    var n2 = Object.prototype.toString.call(o2).slice(8, -1);
    if (n2 === "Object" && o2.constructor)
      n2 = o2.constructor.name;
    if (n2 === "Map" || n2 === "Set")
      return Array.from(o2);
    if (n2 === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n2))
      return _arrayLikeToArray(o2, minLen);
  }
  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length)
      len = arr.length;
    for (var i2 = 0, arr2 = new Array(len); i2 < len; i2++)
      arr2[i2] = arr[i2];
    return arr2;
  }
  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  var _default = /* @__PURE__ */ function() {
    function _default3(options) {
      _classCallCheck(this, _default3);
      this.mAttr = "data-" + options.dataName;
      this.mCaptureEvents = ["mouseenter", "mouseleave"];
      this.el = options.el;
    }
    _createClass(_default3, [{
      key: "mInit",
      value: function mInit(modules) {
        var _this = this;
        this.modules = modules;
        this.mCheckEventTarget = this.mCheckEventTarget.bind(this);
        if (this.events) {
          Object.keys(this.events).forEach(function(event) {
            return _this.mAddEvent(event);
          });
        }
      }
    }, {
      key: "mUpdate",
      value: function mUpdate(modules) {
        this.modules = modules;
      }
    }, {
      key: "mDestroy",
      value: function mDestroy() {
        var _this2 = this;
        if (this.events) {
          Object.keys(this.events).forEach(function(event) {
            return _this2.mRemoveEvent(event);
          });
        }
      }
    }, {
      key: "mAddEvent",
      value: function mAddEvent(event) {
        var capture = this.mCaptureEvents.includes(event) ? true : false;
        this.el.addEventListener(event, this.mCheckEventTarget, capture);
      }
    }, {
      key: "mRemoveEvent",
      value: function mRemoveEvent(event) {
        var capture = this.mCaptureEvents.includes(event) ? true : false;
        this.el.removeEventListener(event, this.mCheckEventTarget, capture);
      }
    }, {
      key: "mCheckEventTarget",
      value: function mCheckEventTarget(e2) {
        var event = this.events[e2.type];
        if (typeof event === "string") {
          this[event](e2);
        } else {
          var data = "[" + this.mAttr + "]";
          var target = e2.target;
          if (this.mCaptureEvents.includes(e2.type)) {
            if (target.matches(data)) {
              this.mCallEventMethod(e2, event, target);
            }
          } else {
            while (target && target !== document) {
              if (target.matches(data)) {
                if (this.mCallEventMethod(e2, event, target) != "undefined") {
                  break;
                }
              }
              target = target.parentNode;
            }
          }
        }
      }
    }, {
      key: "mCallEventMethod",
      value: function mCallEventMethod(e2, event, target) {
        var name = target.getAttribute(this.mAttr);
        if (event.hasOwnProperty(name)) {
          var method = event[name];
          if (!e2.hasOwnProperty("currentTarget")) {
            Object.defineProperty(e2, "currentTarget", {
              value: target
            });
          }
          if (!e2.hasOwnProperty("curTarget")) {
            Object.defineProperty(e2, "curTarget", {
              value: target
            });
          }
          this[method](e2);
        }
      }
    }, {
      key: "$",
      value: function $(query, context) {
        var classIndex = query.indexOf(".");
        var idIndex = query.indexOf("#");
        var attrIndex = query.indexOf("[");
        var indexes = [classIndex, idIndex, attrIndex].filter(function(index2) {
          return index2 != -1;
        });
        var index = false;
        var name = query;
        var more = "";
        var parent = this.el;
        if (indexes.length) {
          index = Math.min.apply(Math, _toConsumableArray(indexes));
          name = query.slice(0, index);
          more = query.slice(index);
        }
        if (_typeof(context) == "object") {
          parent = context;
        }
        return parent.querySelectorAll("[" + this.mAttr + "=" + name + "]" + more);
      }
    }, {
      key: "parent",
      value: function parent(query, context) {
        var data = "[" + this.mAttr + "=" + query + "]";
        var parent2 = context.parentNode;
        while (parent2 && parent2 !== document) {
          if (parent2.matches(data)) {
            return parent2;
          }
          parent2 = parent2.parentNode;
        }
      }
    }, {
      key: "getData",
      value: function getData(name, context) {
        var target = context || this.el;
        return target.getAttribute(this.mAttr + "-" + name);
      }
    }, {
      key: "setData",
      value: function setData(name, value, context) {
        var target = context || this.el;
        return target.setAttribute(this.mAttr + "-" + name, value);
      }
    }, {
      key: "call",
      value: function call(func, args, mod, id) {
        var _this3 = this;
        if (args && !mod) {
          mod = args;
          args = false;
        }
        if (this.modules[mod]) {
          if (id) {
            if (this.modules[mod][id]) {
              this.modules[mod][id][func](args);
            }
          } else {
            Object.keys(this.modules[mod]).forEach(function(id2) {
              _this3.modules[mod][id2][func](args);
            });
          }
        }
      }
    }, {
      key: "on",
      value: function on(e2, mod, func, id) {
        var _this4 = this;
        if (this.modules[mod]) {
          if (id) {
            this.modules[mod][id].el.addEventListener(e2, function(o2) {
              return func(o2);
            });
          } else {
            Object.keys(this.modules[mod]).forEach(function(i2) {
              _this4.modules[mod][i2].el.addEventListener(e2, function(o2) {
                return func(o2);
              });
            });
          }
        }
      }
    }, {
      key: "init",
      value: function init2() {
      }
    }, {
      key: "destroy",
      value: function destroy() {
      }
    }]);
    return _default3;
  }();
  var _default$1 = /* @__PURE__ */ function() {
    function _default3(options) {
      _classCallCheck(this, _default3);
      this.app;
      this.modules = options.modules;
      this.currentModules = {};
      this.activeModules = {};
      this.newModules = {};
      this.moduleId = 0;
    }
    _createClass(_default3, [{
      key: "init",
      value: function init2(app2, scope) {
        var _this = this;
        var container = scope || document;
        var elements = container.querySelectorAll("*");
        if (app2 && !this.app) {
          this.app = app2;
        }
        this.activeModules["app"] = {
          "app": this.app
        };
        elements.forEach(function(el) {
          Array.from(el.attributes).forEach(function(i2) {
            if (i2.name.startsWith("data-module")) {
              var moduleExists = false;
              var dataName = i2.name.split("-").splice(2);
              var moduleName = _this.toCamel(dataName);
              if (_this.modules[moduleName]) {
                moduleExists = true;
              } else if (_this.modules[_this.toUpper(moduleName)]) {
                moduleName = _this.toUpper(moduleName);
                moduleExists = true;
              }
              if (moduleExists) {
                var options = {
                  el,
                  name: moduleName,
                  dataName: dataName.join("-")
                };
                var module = new _this.modules[moduleName](options);
                var id = i2.value;
                if (!id) {
                  _this.moduleId++;
                  id = "m" + _this.moduleId;
                  el.setAttribute(i2.name, id);
                }
                _this.addActiveModule(moduleName, id, module);
                var moduleId = moduleName + "-" + id;
                if (scope) {
                  _this.newModules[moduleId] = module;
                } else {
                  _this.currentModules[moduleId] = module;
                }
              }
            }
          });
        });
        Object.entries(this.currentModules).forEach(function(_ref) {
          var _ref2 = _slicedToArray(_ref, 2), id = _ref2[0], module = _ref2[1];
          if (scope) {
            var split = id.split("-");
            var moduleName = split.shift();
            var moduleId = split.pop();
            _this.addActiveModule(moduleName, moduleId, module);
          } else {
            _this.initModule(module);
          }
        });
      }
    }, {
      key: "initModule",
      value: function initModule(module) {
        module.mInit(this.activeModules);
        module.init();
      }
    }, {
      key: "addActiveModule",
      value: function addActiveModule(name, id, module) {
        if (this.activeModules[name]) {
          Object.assign(this.activeModules[name], _defineProperty({}, id, module));
        } else {
          this.activeModules[name] = _defineProperty({}, id, module);
        }
      }
    }, {
      key: "update",
      value: function update(scope) {
        var _this2 = this;
        this.init(this.app, scope);
        Object.entries(this.currentModules).forEach(function(_ref3) {
          var _ref4 = _slicedToArray(_ref3, 2), id = _ref4[0], module = _ref4[1];
          module.mUpdate(_this2.activeModules);
        });
        Object.entries(this.newModules).forEach(function(_ref5) {
          var _ref6 = _slicedToArray(_ref5, 2), id = _ref6[0], module = _ref6[1];
          _this2.initModule(module);
        });
        Object.assign(this.currentModules, this.newModules);
      }
    }, {
      key: "destroy",
      value: function destroy(scope) {
        if (scope) {
          this.destroyScope(scope);
        } else {
          this.destroyModules();
        }
      }
    }, {
      key: "destroyScope",
      value: function destroyScope(scope) {
        var _this3 = this;
        var elements = scope.querySelectorAll("*");
        elements.forEach(function(el) {
          Array.from(el.attributes).forEach(function(i2) {
            if (i2.name.startsWith("data-module")) {
              var id = i2.value;
              var dataName = i2.name.split("-").splice(2);
              var moduleName = _this3.toCamel(dataName) + "-" + id;
              var moduleExists = false;
              if (_this3.currentModules[moduleName]) {
                moduleExists = true;
              } else if (_this3.currentModules[_this3.toUpper(moduleName)]) {
                moduleName = _this3.toUpper(moduleName);
                moduleExists = true;
              }
              if (moduleExists) {
                _this3.destroyModule(_this3.currentModules[moduleName]);
                delete _this3.currentModules[moduleName];
              }
            }
          });
        });
        this.activeModules = {};
        this.newModules = {};
      }
    }, {
      key: "destroyModules",
      value: function destroyModules() {
        var _this4 = this;
        Object.entries(this.currentModules).forEach(function(_ref7) {
          var _ref8 = _slicedToArray(_ref7, 2), id = _ref8[0], module = _ref8[1];
          _this4.destroyModule(module);
        });
        this.currentModules = [];
      }
    }, {
      key: "destroyModule",
      value: function destroyModule(module) {
        module.mDestroy();
        module.destroy();
      }
    }, {
      key: "toCamel",
      value: function toCamel(arr) {
        var _this5 = this;
        return arr.reduce(function(a, b) {
          return a + _this5.toUpper(b);
        });
      }
    }, {
      key: "toUpper",
      value: function toUpper(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
      }
    }]);
    return _default3;
  }();
  var main_esm_default = _default$1;

  // assets/scripts/modules.js
  var modules_exports = {};
  __export(modules_exports, {
    Example: () => Example_default,
    Load: () => Load_default,
    Scroll: () => Scroll_default
  });

  // assets/scripts/config.js
  var NODE_ENV = "development";
  var IS_DESKTOP = typeof window.orientation === "undefined";
  var ENV = Object.freeze({
    // Node environment
    NAME: NODE_ENV,
    IS_PROD: NODE_ENV === "production",
    IS_DEV: NODE_ENV === "development",
    // Device
    IS_DESKTOP,
    IS_MOBILE: !IS_DESKTOP
  });
  var CSS_CLASS = Object.freeze({
    LOADING: "is-loading",
    LOADED: "is-loaded",
    READY: "is-ready",
    FONTS_LOADED: "fonts-loaded",
    IMAGE: "c-image",
    IMAGE_LAZY_LOADED: "-lazy-loaded",
    IMAGE_LAZY_LOADING: "-lazy-loading",
    IMAGE_LAZY_ERROR: "-lazy-error"
  });
  var CUSTOM_EVENT = Object.freeze({
    RESIZE_END: "loco.resizeEnd"
    // ...
  });
  var FONT = Object.freeze({
    EAGER: [
      { family: "Source Sans", style: "normal", weight: 400 },
      { family: "Source Sans", style: "normal", weight: 700 }
    ]
  });

  // assets/scripts/utils/fonts.js
  var isFontLoadingAPIAvailable = "fonts" in document;
  function conformsToReference(font, criterion2) {
    for (const [key, value] of Object.entries(criterion2)) {
      switch (key) {
        case "family": {
          if (trim(font[key]) !== value) {
            return false;
          }
          break;
        }
        case "weight": {
          if (font[key] != value) {
            return false;
          }
          break;
        }
        default: {
          if (font[key] !== value) {
            return false;
          }
          break;
        }
      }
    }
    return true;
  }
  function conformsToShorthand(font, criterion2) {
    const family = trim(font.family);
    if (trim(family) === criterion2) {
      return true;
    }
    if (criterion2.endsWith(trim(family)) && (criterion2.match(font.weight) || criterion2.match(font.style))) {
      return true;
    }
    return true;
  }
  function findManyByReference(search) {
    const found = [];
    for (const font of document.fonts) {
      if (conformsToReference(font, search)) {
        found.push(font);
      }
    }
    return found;
  }
  function findManyByShorthand(search) {
    const found = [];
    for (const font of document.fonts) {
      if (conformsToShorthand(font, search)) {
        found.push(font);
      }
    }
    return found;
  }
  function getMany(queries) {
    if (!Array.isArray(queries)) {
      queries = [queries];
    }
    const found = /* @__PURE__ */ new Set();
    queries.forEach((search) => {
      if (search) {
        switch (typeof search) {
          case "string":
            found.add(...findManyByShorthand(search));
            return;
          case "object":
            found.add(...findManyByReference(search));
            return;
        }
      }
      throw new TypeError(
        "Expected font query to be font shorthand or font reference"
      );
    });
    return [...found];
  }
  function loadFonts(fontsToLoad, debug = false) {
    return __async(this, null, function* () {
      var _a;
      if (((_a = fontsToLoad.size) != null ? _a : fontsToLoad.length) === 0) {
        throw new TypeError(
          "Expected at least one font"
        );
      }
      return yield loadFontsWithAPI([...fontsToLoad], debug);
    });
  }
  function loadFontFaceWithAPI(font) {
    return __async(this, null, function* () {
      return yield (font.status === "unloaded" ? font.load() : font.loaded).then((font2) => font2, (err) => font);
    });
  }
  function loadFontsWithAPI(fontsToLoad, debug = false) {
    return __async(this, null, function* () {
      debug && console.group("[loadFonts:API]", fontsToLoad.length, "/", document.fonts.size);
      const fontsToBeLoaded = [];
      for (const fontToLoad of fontsToLoad) {
        if (fontToLoad instanceof FontFace) {
          if (!document.fonts.has(fontToLoad)) {
            document.fonts.add(fontToLoad);
          }
          fontsToBeLoaded.push(
            loadFontFaceWithAPI(fontToLoad)
          );
        } else {
          fontsToBeLoaded.push(
            ...getMany(fontToLoad).map((font) => loadFontFaceWithAPI(font))
          );
        }
      }
      debug && console.groupEnd();
      return yield Promise.all(fontsToBeLoaded);
    });
  }
  function trim(value) {
    return value.replace(/['"]+/g, "");
  }
  function whenReady(queries) {
    return __async(this, null, function* () {
      const fonts = getMany(queries);
      return yield Promise.all(fonts.map((font) => font.loaded));
    });
  }

  // assets/scripts/modules/Example.js
  var Example_default = class extends _default {
    constructor(m) {
      super(m);
    }
    init() {
      whenReady(FONT.EAGER).then((fonts) => this.onFontsLoaded(fonts));
    }
    onFontsLoaded(fonts) {
      console.log("Example: Eager Fonts Loaded!", fonts);
    }
  };

  // node_modules/modularload/dist/main.esm.js
  function _classCallCheck2(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function _defineProperties2(target, props) {
    for (var i2 = 0; i2 < props.length; i2++) {
      var descriptor = props[i2];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor)
        descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  function _createClass2(Constructor, protoProps, staticProps) {
    if (protoProps)
      _defineProperties2(Constructor.prototype, protoProps);
    if (staticProps)
      _defineProperties2(Constructor, staticProps);
    return Constructor;
  }
  function _slicedToArray2(arr, i2) {
    return _arrayWithHoles2(arr) || _iterableToArrayLimit2(arr, i2) || _unsupportedIterableToArray2(arr, i2) || _nonIterableRest2();
  }
  function _arrayWithHoles2(arr) {
    if (Array.isArray(arr))
      return arr;
  }
  function _iterableToArrayLimit2(arr, i2) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null)
      return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
      for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);
        if (i2 && _arr.length === i2)
          break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null)
          _i["return"]();
      } finally {
        if (_d)
          throw _e;
      }
    }
    return _arr;
  }
  function _unsupportedIterableToArray2(o2, minLen) {
    if (!o2)
      return;
    if (typeof o2 === "string")
      return _arrayLikeToArray2(o2, minLen);
    var n2 = Object.prototype.toString.call(o2).slice(8, -1);
    if (n2 === "Object" && o2.constructor)
      n2 = o2.constructor.name;
    if (n2 === "Map" || n2 === "Set")
      return Array.from(o2);
    if (n2 === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n2))
      return _arrayLikeToArray2(o2, minLen);
  }
  function _arrayLikeToArray2(arr, len) {
    if (len == null || len > arr.length)
      len = arr.length;
    for (var i2 = 0, arr2 = new Array(len); i2 < len; i2++)
      arr2[i2] = arr[i2];
    return arr2;
  }
  function _nonIterableRest2() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  var _default2 = /* @__PURE__ */ function() {
    function _default3(options) {
      _classCallCheck2(this, _default3);
      this.defaults = {
        name: "load",
        loadingClass: "is-loading",
        loadedClass: "is-loaded",
        readyClass: "is-ready",
        transitionsPrefix: "is-",
        transitionsHistory: true,
        enterDelay: 0,
        exitDelay: 0,
        loadedDelay: 0,
        isLoaded: false,
        isEntered: false,
        isUrl: false,
        transitionContainer: null,
        popstateIgnore: false
      };
      Object.assign(this, this.defaults, options);
      this.options = options;
      this.namespace = "modular";
      this.html = document.documentElement;
      this.href = window.location.href;
      this.container = "data-" + this.name + "-container";
      this.subContainer = false;
      this.prevTransition = null;
      this.loadAttributes = ["src", "srcset", "style", "href"];
      this.isInserted = false;
      this.isLoading = false;
      this.enterTimeout = false;
      this.controller = new AbortController();
      this.classContainer = this.html;
      this.isChrome = navigator.userAgent.indexOf("Chrome") != -1 ? true : false;
      this.init();
    }
    _createClass2(_default3, [{
      key: "init",
      value: function init2() {
        var _this = this;
        window.addEventListener("popstate", function(e2) {
          return _this.checkState(e2);
        }, false);
        this.html.addEventListener("click", function(e2) {
          return _this.checkClick(e2);
        }, false);
        this.loadEls(document);
      }
    }, {
      key: "checkClick",
      value: function checkClick(e2) {
        if (!e2.ctrlKey && !e2.metaKey) {
          var target = e2.target;
          while (target && target !== document) {
            if (target.matches("a") && target.getAttribute("download") == null) {
              var href = target.getAttribute("href");
              if (!href.startsWith("#") && !href.startsWith("mailto:") && !href.startsWith("tel:")) {
                e2.preventDefault();
                this.reset();
                this.getClickOptions(target);
              }
              break;
            }
            target = target.parentNode;
          }
        }
      }
    }, {
      key: "checkState",
      value: function checkState() {
        if (typeof this.popstateIgnore === "string" && window.location.href.indexOf(this.popstateIgnore) > -1) {
          return;
        }
        this.reset();
        this.getStateOptions();
      }
    }, {
      key: "reset",
      value: function reset() {
        if (this.isLoading) {
          this.controller.abort();
          this.isLoading = false;
          this.controller = new AbortController();
        }
        window.clearTimeout(this.enterTimeout);
        if (this.isInserted) {
          this.removeContainer();
        }
        this.classContainer = this.html;
        Object.assign(this, this.defaults, this.options);
      }
    }, {
      key: "getClickOptions",
      value: function getClickOptions(link) {
        this.transition = link.getAttribute("data-" + this.name);
        this.isUrl = link.getAttribute("data-" + this.name + "-url");
        var href = link.getAttribute("href");
        var target = link.getAttribute("target");
        if (target == "_blank") {
          window.open(href, "_blank");
          return;
        }
        if (this.transition == "false") {
          window.location = href;
          return;
        }
        this.setOptions(href, true);
      }
    }, {
      key: "getStateOptions",
      value: function getStateOptions() {
        if (this.transitionsHistory) {
          this.transition = history.state;
        } else {
          this.transition = false;
        }
        var href = window.location.href;
        this.setOptions(href);
      }
    }, {
      key: "goTo",
      value: function goTo(href, transition, isUrl) {
        this.reset();
        this.transition = transition;
        this.isUrl = isUrl;
        this.setOptions(href, true);
      }
    }, {
      key: "setOptions",
      value: function setOptions(href, push) {
        var container = "[" + this.container + "]";
        var oldContainer;
        if (this.transition && this.transition != "true") {
          this.transitionContainer = "[" + this.container + '="' + this.transition + '"]';
          this.loadingClass = this.transitions[this.transition].loadingClass || this.loadingClass;
          this.loadedClass = this.transitions[this.transition].loadedClass || this.loadedClass;
          this.readyClass = this.transitions[this.transition].readyClass || this.readyClass;
          this.transitionsPrefix = this.transitions[this.transition].transitionsPrefix || this.transitionsPrefix;
          this.enterDelay = this.transitions[this.transition].enterDelay || this.enterDelay;
          this.exitDelay = this.transitions[this.transition].exitDelay || this.exitDelay;
          this.loadedDelay = this.transitions[this.transition].loadedDelay || this.loadedDelay;
          oldContainer = document.querySelector(this.transitionContainer);
        }
        if (oldContainer) {
          container = this.transitionContainer;
          this.oldContainer = oldContainer;
          this.classContainer = this.oldContainer.parentNode;
          if (!this.subContainer) {
            history.replaceState(this.transition, null, this.href);
          }
          this.subContainer = true;
        } else {
          this.oldContainer = document.querySelector(container);
          if (this.subContainer) {
            history.replaceState(this.prevTransition, null, this.href);
          }
          this.subContainer = false;
        }
        this.href = href;
        this.parentContainer = this.oldContainer.parentNode;
        if (this.isUrl === "" || this.isUrl != null && this.isUrl != "false" && this.isUrl != false) {
          history.pushState(this.transition, null, href);
        } else {
          this.oldContainer.classList.add("is-old");
          this.setLoading();
          this.startEnterDelay();
          this.loadHref(href, container, push);
        }
      }
    }, {
      key: "setLoading",
      value: function setLoading() {
        this.classContainer.classList.remove(this.loadedClass, this.readyClass);
        this.classContainer.classList.add(this.loadingClass);
        this.classContainer.classList.remove(this.transitionsPrefix + this.prevTransition);
        if (this.transition) {
          this.classContainer.classList.add(this.transitionsPrefix + this.transition);
        }
        if (!this.subContainer) {
          this.prevTransition = this.transition;
        }
        var loadingEvent = new Event(this.namespace + "loading");
        window.dispatchEvent(loadingEvent);
      }
    }, {
      key: "startEnterDelay",
      value: function startEnterDelay() {
        var _this2 = this;
        this.enterTimeout = window.setTimeout(function() {
          _this2.isEntered = true;
          if (_this2.isLoaded) {
            _this2.transitionContainers();
          }
        }, this.enterDelay);
      }
    }, {
      key: "loadHref",
      value: function loadHref(href, container, push) {
        var _this3 = this;
        this.isLoading = true;
        var signal = this.controller.signal;
        fetch(href, {
          signal
        }).then(function(response) {
          return response.text();
        }).then(function(data) {
          if (push) {
            history.pushState(_this3.transition, null, href);
          }
          var parser = new DOMParser();
          _this3.data = parser.parseFromString(data, "text/html");
          _this3.newContainer = _this3.data.querySelector(container);
          _this3.newContainer.classList.add("is-new");
          _this3.parentNewContainer = _this3.newContainer.parentNode;
          _this3.hideContainer();
          _this3.parentContainer.insertBefore(_this3.newContainer, _this3.oldContainer);
          _this3.isInserted = true;
          _this3.setSvgs();
          _this3.isLoaded = true;
          if (_this3.isEntered) {
            _this3.transitionContainers();
          }
          _this3.loadEls(_this3.newContainer);
          _this3.isLoading = false;
        })["catch"](function(err) {
          window.location = href;
        });
      }
    }, {
      key: "transitionContainers",
      value: function transitionContainers() {
        var _this4 = this;
        this.setAttributes();
        this.showContainer();
        this.setLoaded();
        setTimeout(function() {
          _this4.removeContainer();
          _this4.setReady();
        }, this.exitDelay);
      }
    }, {
      key: "setSvgs",
      value: function setSvgs() {
        if (this.isChrome) {
          var svgs = this.newContainer.querySelectorAll("use");
          if (svgs.length) {
            svgs.forEach(function(svg) {
              var xhref = svg.getAttribute("xlink:href");
              if (xhref) {
                svg.parentNode.innerHTML = '<use xlink:href="' + xhref + '"></use>';
              } else {
                var href = svg.getAttribute("href");
                if (href)
                  svg.parentNode.innerHTML = '<use href="' + href + '"></use>';
              }
            });
          }
        }
      }
    }, {
      key: "setAttributes",
      value: function setAttributes() {
        var _this5 = this;
        var title = this.data.getElementsByTagName("title")[0];
        var newDesc = this.data.head.querySelector('meta[name="description"]');
        var oldDesc = document.head.querySelector('meta[name="description"]');
        var container;
        var newContainer;
        if (this.subContainer) {
          newContainer = this.parentNewContainer;
          container = document.querySelector(this.transitionContainer).parentNode;
        } else {
          newContainer = this.data.querySelector("html");
          container = document.querySelector("html");
        }
        var datas = Object.assign({}, newContainer.dataset);
        if (title)
          document.title = title.innerText;
        if (oldDesc && newDesc)
          oldDesc.setAttribute("content", newDesc.getAttribute("content"));
        if (datas) {
          Object.entries(datas).forEach(function(_ref) {
            var _ref2 = _slicedToArray2(_ref, 2), key = _ref2[0], val = _ref2[1];
            container.setAttribute("data-" + _this5.toDash(key), val);
          });
        }
      }
    }, {
      key: "toDash",
      value: function toDash(str) {
        return str.split(/(?=[A-Z])/).join("-").toLowerCase();
      }
    }, {
      key: "hideContainer",
      value: function hideContainer() {
        this.newContainer.style.visibility = "hidden";
        this.newContainer.style.height = 0;
        this.newContainer.style.overflow = "hidden";
      }
    }, {
      key: "showContainer",
      value: function showContainer() {
        this.newContainer.style.visibility = "";
        this.newContainer.style.height = "";
        this.newContainer.style.overflow = "";
      }
    }, {
      key: "loadEls",
      value: function loadEls(container) {
        var _this6 = this;
        var promises = [];
        this.loadAttributes.forEach(function(attr) {
          var data = "data-" + _this6.name + "-" + attr;
          var els = container.querySelectorAll("[" + data + "]");
          if (els.length) {
            els.forEach(function(el) {
              var elData = el.getAttribute(data);
              el.setAttribute(attr, elData);
              if (attr == "src" || attr == "srcset") {
                var promise = new Promise(function(resolve) {
                  el.onload = function() {
                    return resolve(el);
                  };
                });
                promises.push(promise);
              }
            });
          }
        });
        Promise.all(promises).then(function(val) {
          var imagesEvent = new Event(_this6.namespace + "images");
          window.dispatchEvent(imagesEvent);
        });
      }
    }, {
      key: "setLoaded",
      value: function setLoaded() {
        var _this7 = this;
        this.classContainer.classList.remove(this.loadingClass);
        setTimeout(function() {
          _this7.classContainer.classList.add(_this7.loadedClass);
        }, this.loadedDelay);
        var loadedEvent = new Event(this.namespace + "loaded");
        window.dispatchEvent(loadedEvent);
      }
    }, {
      key: "removeContainer",
      value: function removeContainer() {
        this.parentContainer.removeChild(this.oldContainer);
        this.newContainer.classList.remove("is-new");
        this.isInserted = false;
      }
    }, {
      key: "setReady",
      value: function setReady() {
        this.classContainer.classList.add(this.readyClass);
        var readyEvent = new Event(this.namespace + "ready");
        window.dispatchEvent(readyEvent);
      }
    }, {
      key: "on",
      value: function on(event, func) {
        var _this8 = this;
        window.addEventListener(this.namespace + event, function() {
          switch (event) {
            case "loading":
              return func(_this8.transition, _this8.oldContainer);
            case "loaded":
              return func(_this8.transition, _this8.oldContainer, _this8.newContainer);
            case "ready":
              return func(_this8.transition, _this8.newContainer);
            default:
              return func();
          }
        }, false);
      }
    }]);
    return _default3;
  }();
  var main_esm_default2 = _default2;

  // assets/scripts/utils/html.js
  var queryClosestParent = ($el, selector) => {
    if (!Element.prototype.matches) {
      Element.prototype.matches = Element.prototype.matchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.oMatchesSelector || Element.prototype.webkitMatchesSelector || function(s2) {
        var matches = (this.document || this.ownerDocument).querySelectorAll(s2), i2 = matches.length;
        while (--i2 >= 0 && matches.item(i2) !== this) {
        }
        return i2 > -1;
      };
    }
    for (; $el && $el !== document; $el = $el.parentNode) {
      if ($el.matches(selector))
        return $el;
    }
    return null;
  };

  // assets/scripts/utils/image.js
  var lazyImageLoad = (e2) => {
    const $img = e2.currentTarget;
    const $parent = queryClosestParent($img, `.${CSS_CLASS.IMAGE}`);
    requestAnimationFrame(() => {
      if ($parent) {
        $parent.classList.remove(CSS_CLASS.IMAGE_LAZY_LOADING);
        $parent.classList.add(CSS_CLASS.IMAGE_LAZY_LOADED);
      }
      $img.classList.add(CSS_CLASS.IMAGE_LAZY_LOADED);
    });
  };
  var lazyImageError = (e2) => {
    const $img = e2.currentTarget;
    const $parent = queryClosestParent($img, `.${CSS_CLASS.IMAGE}`);
    requestAnimationFrame(() => {
      if ($parent) {
        $parent.classList.remove(CSS_CLASS.IMAGE_LAZY_LOADING);
        $parent.classList.add(CSS_CLASS.IMAGE_LAZY_ERROR);
      }
    });
  };
  var triggerLazyloadCallbacks = ($lazyImagesArgs) => {
    const $lazyImages = $lazyImagesArgs ? $lazyImagesArgs : document.querySelectorAll('[loading="lazy"]');
    if ("loading" in HTMLImageElement.prototype) {
      for (const $img of $lazyImages) {
        const $parent = queryClosestParent(
          $img,
          `.${CSS_CLASS.IMAGE}`
        );
        if (!$img.complete) {
          if ($parent) {
            $parent.classList.add(
              CSS_CLASS.IMAGE_LAZY_LOADING
            );
          }
          $img.addEventListener("load", lazyImageLoad, { once: true });
          $img.addEventListener("error", lazyImageError, { once: true });
        } else {
          if (!$img.complete) {
            $parent.classList.add(
              CSS_CLASS.IMAGE_LAZY_LOADED
            );
          }
        }
      }
    } else {
      for (const $img of $lazyImages) {
        const $parent = queryClosestParent(
          $img,
          `.${CSS_CLASS.IMAGE}`
        );
        if ($parent) {
          $parent.classList.add(CSS_CLASS.IMAGE_LAZY_LOADED);
        }
      }
    }
  };
  var resetLazyloadCallbacks = () => {
    if ("loading" in HTMLImageElement.prototype) {
      const $lazyImages = document.querySelectorAll('[loading="lazy"]');
      for (const $img of $lazyImages) {
        $img.removeEventListener("load", lazyImageLoad, { once: true });
        $img.removeEventListener("error", lazyImageError, { once: true });
      }
    }
  };

  // assets/scripts/modules/Load.js
  var Load_default = class extends _default {
    constructor(m) {
      super(m);
    }
    init() {
      this.load = new main_esm_default2({
        enterDelay: 0,
        transitions: {
          customTransition: {}
        }
      });
      this.load.on("loaded", (transition, oldContainer, newContainer) => {
        this.call("destroy", oldContainer, "app");
        this.call("update", newContainer, "app");
        triggerLazyloadCallbacks();
      });
      this.load.on("loading", () => {
        resetLazyloadCallbacks();
      });
    }
  };

  // node_modules/@studio-freight/lenis/dist/lenis.modern.mjs
  function t() {
    return t = Object.assign ? Object.assign.bind() : function(t2) {
      for (var e2 = 1; e2 < arguments.length; e2++) {
        var i2 = arguments[e2];
        for (var s2 in i2)
          Object.prototype.hasOwnProperty.call(i2, s2) && (t2[s2] = i2[s2]);
      }
      return t2;
    }, t.apply(this, arguments);
  }
  function e(t2, e2, i2) {
    return Math.max(t2, Math.min(e2, i2));
  }
  var i = class {
    advance(t2) {
      var i2;
      if (!this.isRunning)
        return;
      let s2 = false;
      if (this.lerp)
        this.value = (1 - (o2 = this.lerp)) * this.value + o2 * this.to, Math.round(this.value) === this.to && (this.value = this.to, s2 = true);
      else {
        this.currentTime += t2;
        const i3 = e(0, this.currentTime / this.duration, 1);
        s2 = i3 >= 1;
        const o3 = s2 ? 1 : this.easing(i3);
        this.value = this.from + (this.to - this.from) * o3;
      }
      var o2;
      null == (i2 = this.onUpdate) || i2.call(this, this.value, { completed: s2 }), s2 && this.stop();
    }
    stop() {
      this.isRunning = false;
    }
    fromTo(t2, e2, { lerp: i2 = 0.1, duration: s2 = 1, easing: o2 = (t3) => t3, onUpdate: n2 }) {
      this.from = this.value = t2, this.to = e2, this.lerp = i2, this.duration = s2, this.easing = o2, this.currentTime = 0, this.isRunning = true, this.onUpdate = n2;
    }
  };
  function s(t2, e2) {
    let i2;
    return function() {
      let s2 = arguments, o2 = this;
      clearTimeout(i2), i2 = setTimeout(function() {
        t2.apply(o2, s2);
      }, e2);
    };
  }
  var o = class {
    constructor(t2, e2) {
      this.onWindowResize = () => {
        this.width = window.innerWidth, this.height = window.innerHeight;
      }, this.onWrapperResize = () => {
        this.width = this.wrapper.clientWidth, this.height = this.wrapper.clientHeight;
      }, this.onContentResize = () => {
        const t3 = this.wrapper === window ? document.documentElement : this.wrapper;
        this.scrollHeight = t3.scrollHeight, this.scrollWidth = t3.scrollWidth;
      }, this.wrapper = t2, this.content = e2, this.wrapper === window ? (window.addEventListener("resize", this.onWindowResize, false), this.onWindowResize()) : (this.wrapperResizeObserver = new ResizeObserver(s(this.onWrapperResize, 100)), this.wrapperResizeObserver.observe(this.wrapper), this.onWrapperResize()), this.contentResizeObserver = new ResizeObserver(s(this.onContentResize, 100)), this.contentResizeObserver.observe(this.content), this.onContentResize();
    }
    destroy() {
      var t2, e2;
      window.removeEventListener("resize", this.onWindowResize, false), null == (t2 = this.wrapperResizeObserver) || t2.disconnect(), null == (e2 = this.contentResizeObserver) || e2.disconnect();
    }
    get limit() {
      return { x: this.scrollWidth - this.width, y: this.scrollHeight - this.height };
    }
  };
  var n = () => ({ events: {}, emit(t2, ...e2) {
    let i2 = this.events[t2] || [];
    for (let t3 = 0, s2 = i2.length; t3 < s2; t3++)
      i2[t3](...e2);
  }, on(t2, e2) {
    var i2;
    return (null == (i2 = this.events[t2]) ? void 0 : i2.push(e2)) || (this.events[t2] = [e2]), () => {
      var i3;
      this.events[t2] = null == (i3 = this.events[t2]) ? void 0 : i3.filter((t3) => e2 !== t3);
    };
  } });
  var r = class {
    constructor(t2, { wheelMultiplier: i2 = 1, touchMultiplier: s2 = 2, normalizeWheel: o2 = false }) {
      this.onTouchStart = (t3) => {
        const { clientX: e2, clientY: i3 } = t3.targetTouches ? t3.targetTouches[0] : t3;
        this.touchStart.x = e2, this.touchStart.y = i3, this.lastDelta = { x: 0, y: 0 };
      }, this.onTouchMove = (t3) => {
        const { clientX: e2, clientY: i3 } = t3.targetTouches ? t3.targetTouches[0] : t3, s3 = -(e2 - this.touchStart.x) * this.touchMultiplier, o3 = -(i3 - this.touchStart.y) * this.touchMultiplier;
        this.touchStart.x = e2, this.touchStart.y = i3, this.lastDelta = { x: s3, y: o3 }, this.emitter.emit("scroll", { type: "touch", deltaX: s3, deltaY: o3, event: t3 });
      }, this.onTouchEnd = (t3) => {
        this.emitter.emit("scroll", { type: "touch", inertia: true, deltaX: this.lastDelta.x, deltaY: this.lastDelta.y, event: t3 });
      }, this.onWheel = (t3) => {
        let { deltaX: i3, deltaY: s3 } = t3;
        this.normalizeWheel && (i3 = e(-100, i3, 100), s3 = e(-100, s3, 100)), i3 *= this.wheelMultiplier, s3 *= this.wheelMultiplier, this.emitter.emit("scroll", { type: "wheel", deltaX: i3, deltaY: s3, event: t3 });
      }, this.element = t2, this.wheelMultiplier = i2, this.touchMultiplier = s2, this.normalizeWheel = o2, this.touchStart = { x: null, y: null }, this.emitter = n(), this.element.addEventListener("wheel", this.onWheel, { passive: false }), this.element.addEventListener("touchstart", this.onTouchStart, { passive: false }), this.element.addEventListener("touchmove", this.onTouchMove, { passive: false }), this.element.addEventListener("touchend", this.onTouchEnd, { passive: false });
    }
    on(t2, e2) {
      return this.emitter.on(t2, e2);
    }
    destroy() {
      this.emitter.events = {}, this.element.removeEventListener("wheel", this.onWheel, { passive: false }), this.element.removeEventListener("touchstart", this.onTouchStart, { passive: false }), this.element.removeEventListener("touchmove", this.onTouchMove, { passive: false }), this.element.removeEventListener("touchend", this.onTouchEnd, { passive: false });
    }
  };
  var l = class {
    constructor({ direction: e2, gestureDirection: s2, mouseMultiplier: l2, smooth: h, wrapper: a = window, content: c = document.documentElement, wheelEventsTarget: u = a, smoothWheel: p = null == h || h, smoothTouch: d = false, syncTouch: m = false, syncTouchLerp: v = 0.1, touchInertiaMultiplier: g = 35, duration: S, easing: w = (t2) => Math.min(1, 1.001 - Math.pow(2, -10 * t2)), lerp: f = S ? null : 0.1, infinite: y = false, orientation: T = null != e2 ? e2 : "vertical", gestureOrientation: z = null != s2 ? s2 : "vertical", touchMultiplier: M = 1, wheelMultiplier: E = null != l2 ? l2 : 1, normalizeWheel: L = false } = {}) {
      this.onVirtualScroll = ({ type: e3, inertia: i2, deltaX: s3, deltaY: o2, event: n2 }) => {
        if (n2.ctrlKey)
          return;
        const r2 = "touch" === e3, l3 = "wheel" === e3;
        if ("vertical" === this.options.gestureOrientation && 0 === o2 || "horizontal" === this.options.gestureOrientation && 0 === s3 || r2 && "vertical" === this.options.gestureOrientation && 0 === this.scroll && !this.options.infinite && o2 <= 0)
          return;
        if (n2.composedPath().find((t2) => null == t2 || null == t2.hasAttribute ? void 0 : t2.hasAttribute("data-lenis-prevent")))
          return;
        if (this.isStopped || this.isLocked)
          return void n2.preventDefault();
        if (this.isSmooth = (this.options.smoothTouch || this.options.syncTouch) && r2 || this.options.smoothWheel && l3, !this.isSmooth)
          return this.isScrolling = false, void this.animate.stop();
        n2.preventDefault();
        let h2 = o2;
        "both" === this.options.gestureOrientation ? h2 = Math.abs(o2) > Math.abs(s3) ? o2 : s3 : "horizontal" === this.options.gestureOrientation && (h2 = s3);
        const a2 = r2 && this.options.syncTouch, c2 = r2 && i2 && Math.abs(h2) > 1;
        c2 && (h2 = this.velocity * this.options.touchInertiaMultiplier), this.scrollTo(this.targetScroll + h2, t({ programmatic: false }, a2 && { lerp: c2 ? this.syncTouchLerp : 0.4 }));
      }, this.onScroll = () => {
        if (!this.isScrolling) {
          const t2 = this.animatedScroll;
          this.animatedScroll = this.targetScroll = this.actualScroll, this.velocity = 0, this.direction = Math.sign(this.animatedScroll - t2), this.emit();
        }
      }, e2 && console.warn("Lenis: `direction` option is deprecated, use `orientation` instead"), s2 && console.warn("Lenis: `gestureDirection` option is deprecated, use `gestureOrientation` instead"), l2 && console.warn("Lenis: `mouseMultiplier` option is deprecated, use `wheelMultiplier` instead"), h && console.warn("Lenis: `smooth` option is deprecated, use `smoothWheel` instead"), window.lenisVersion = "1.0.11", a !== document.documentElement && a !== document.body || (a = window), this.options = { wrapper: a, content: c, wheelEventsTarget: u, smoothWheel: p, smoothTouch: d, syncTouch: m, syncTouchLerp: v, touchInertiaMultiplier: g, duration: S, easing: w, lerp: f, infinite: y, gestureOrientation: z, orientation: T, touchMultiplier: M, wheelMultiplier: E, normalizeWheel: L }, this.dimensions = new o(a, c), this.rootElement.classList.add("lenis"), this.velocity = 0, this.isStopped = false, this.isSmooth = p || d, this.isScrolling = false, this.targetScroll = this.animatedScroll = this.actualScroll, this.animate = new i(), this.emitter = n(), this.options.wrapper.addEventListener("scroll", this.onScroll, { passive: false }), this.virtualScroll = new r(u, { touchMultiplier: M, wheelMultiplier: E, normalizeWheel: L }), this.virtualScroll.on("scroll", this.onVirtualScroll);
    }
    destroy() {
      this.emitter.events = {}, this.options.wrapper.removeEventListener("scroll", this.onScroll, { passive: false }), this.virtualScroll.destroy();
    }
    on(t2, e2) {
      return this.emitter.on(t2, e2);
    }
    off(t2, e2) {
      var i2;
      this.emitter.events[t2] = null == (i2 = this.emitter.events[t2]) ? void 0 : i2.filter((t3) => e2 !== t3);
    }
    setScroll(t2) {
      this.isHorizontal ? this.rootElement.scrollLeft = t2 : this.rootElement.scrollTop = t2;
    }
    emit() {
      this.emitter.emit("scroll", this);
    }
    reset() {
      this.isLocked = false, this.isScrolling = false, this.velocity = 0, this.animate.stop();
    }
    start() {
      this.isStopped = false, this.reset();
    }
    stop() {
      this.isStopped = true, this.animate.stop(), this.reset();
    }
    raf(t2) {
      const e2 = t2 - (this.time || t2);
      this.time = t2, this.animate.advance(1e-3 * e2);
    }
    scrollTo(t2, { offset: i2 = 0, immediate: s2 = false, lock: o2 = false, duration: n2 = this.options.duration, easing: r2 = this.options.easing, lerp: l2 = !n2 && this.options.lerp, onComplete: h = null, force: a = false, programmatic: c = true } = {}) {
      if (!this.isStopped || a) {
        if (["top", "left", "start"].includes(t2))
          t2 = 0;
        else if (["bottom", "right", "end"].includes(t2))
          t2 = this.limit;
        else {
          var u;
          let e2;
          if ("string" == typeof t2 ? e2 = document.querySelector(t2) : null != (u = t2) && u.nodeType && (e2 = t2), e2) {
            if (this.options.wrapper !== window) {
              const t3 = this.options.wrapper.getBoundingClientRect();
              i2 -= this.isHorizontal ? t3.left : t3.top;
            }
            const s3 = e2.getBoundingClientRect();
            t2 = (this.isHorizontal ? s3.left : s3.top) + this.animatedScroll;
          }
        }
        if ("number" == typeof t2) {
          if (t2 += i2, t2 = Math.round(t2), this.options.infinite ? c && (this.targetScroll = this.animatedScroll = this.scroll) : t2 = e(0, t2, this.limit), s2)
            return this.animatedScroll = this.targetScroll = t2, this.setScroll(this.scroll), this.reset(), this.emit(), void (null == h || h());
          if (!c) {
            if (t2 === this.targetScroll)
              return;
            this.targetScroll = t2;
          }
          this.animate.fromTo(this.animatedScroll, t2, { duration: n2, easing: r2, lerp: l2, onUpdate: (t3, { completed: e2 }) => {
            o2 && (this.isLocked = true), this.isScrolling = true, this.velocity = t3 - this.animatedScroll, this.direction = Math.sign(this.velocity), this.animatedScroll = t3, this.setScroll(this.scroll), c && (this.targetScroll = t3), e2 && (o2 && (this.isLocked = false), requestAnimationFrame(() => {
              this.isScrolling = false;
            }), this.velocity = 0, null == h || h()), this.emit();
          } });
        }
      }
    }
    get rootElement() {
      return this.options.wrapper === window ? this.options.content : this.options.wrapper;
    }
    get limit() {
      return this.isHorizontal ? this.dimensions.limit.x : this.dimensions.limit.y;
    }
    get isHorizontal() {
      return "horizontal" === this.options.orientation;
    }
    get actualScroll() {
      return this.isHorizontal ? this.rootElement.scrollLeft : this.rootElement.scrollTop;
    }
    get scroll() {
      return this.options.infinite ? function(t2, e2) {
        let i2 = t2 % e2;
        return (e2 > 0 && i2 < 0 || e2 < 0 && i2 > 0) && (i2 += e2), i2;
      }(this.animatedScroll, this.limit) : this.animatedScroll;
    }
    get progress() {
      return 0 === this.limit ? 1 : this.scroll / this.limit;
    }
    get isSmooth() {
      return this.__isSmooth;
    }
    set isSmooth(t2) {
      this.__isSmooth !== t2 && (this.rootElement.classList.toggle("lenis-smooth", t2), this.__isSmooth = t2);
    }
    get isScrolling() {
      return this.__isScrolling;
    }
    set isScrolling(t2) {
      this.__isScrolling !== t2 && (this.rootElement.classList.toggle("lenis-scrolling", t2), this.__isScrolling = t2);
    }
    get isStopped() {
      return this.__isStopped;
    }
    set isStopped(t2) {
      this.__isStopped !== t2 && (this.rootElement.classList.toggle("lenis-stopped", t2), this.__isStopped = t2);
    }
  };

  // node_modules/locomotive-scroll/dist/locomotive-scroll.modern.mjs
  function _extends() {
    _extends = Object.assign ? Object.assign.bind() : function(target) {
      for (var i2 = 1; i2 < arguments.length; i2++) {
        var source = arguments[i2];
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    };
    return _extends.apply(this, arguments);
  }
  var IO = class {
    constructor({
      scrollElements,
      rootMargin = "-1px -1px -1px -1px",
      IORaf
    }) {
      this.scrollElements = void 0;
      this.rootMargin = void 0;
      this.IORaf = void 0;
      this.observer = void 0;
      this.scrollElements = scrollElements;
      this.rootMargin = rootMargin;
      this.IORaf = IORaf;
      this._init();
    }
    /**
     * Lifecyle - Initialize Intersection Observer.
     *
     * @private
     */
    _init() {
      const observerOptions = {
        rootMargin: this.rootMargin
      };
      const onIntersect = (entries) => {
        entries.forEach((entry) => {
          const $targetItem = this.scrollElements.find((item) => item.$el === entry.target);
          if (entry.isIntersecting) {
            $targetItem && ($targetItem.isAlreadyIntersected = true);
            this._setInview(entry);
          } else if ($targetItem && $targetItem.isAlreadyIntersected) {
            this._setOutOfView(entry);
          }
        });
      };
      this.observer = new IntersectionObserver(onIntersect, observerOptions);
      for (const scrollElement of this.scrollElements) {
        const $scrollElement = scrollElement.$el;
        this.observe($scrollElement);
      }
    }
    /**
     * Lifecyle - Destroy Intersection Observer.
     */
    destroy() {
      this.observer.disconnect();
    }
    /**
     * Subscribe element to the Intersection Observer.
     *
     * @param {HTMLElement} $scrollElement - DOM Element to observe.
     */
    observe($scrollElement) {
      if (!$scrollElement) {
        return;
      }
      this.observer.observe($scrollElement);
    }
    /**
     * Unsubscribe element to the Intersection Observer.
     *
     * @param {HTMLElement} $scrollElement - DOM Element to unobserve.
     */
    unobserve($scrollElement) {
      if (!$scrollElement) {
        return;
      }
      this.observer.unobserve($scrollElement);
    }
    /**
     * Find ScrollElementReference instance and trigger inview callbacks.
     *
     * @private
     *
     * @param {IntersectionObserverEntry} entry - DOM Element to observe.
     */
    _setInview(entry) {
      const scrollElement = this.scrollElements.find((scrollElement2) => scrollElement2.$el === entry.target);
      this.IORaf && (scrollElement == null ? void 0 : scrollElement.setInteractivityOn());
      !this.IORaf && (scrollElement == null ? void 0 : scrollElement.setInview());
    }
    /**
     * Find ScrollElementReference instance and trigger out of view callbacks.
     *
     * @private
     *
     * @param {IntersectionObserverEntry} entry - DOM Element to observe.
     */
    _setOutOfView(entry) {
      const scrollElement = this.scrollElements.find((scrollElement2) => scrollElement2.$el === entry.target);
      this.IORaf && (scrollElement == null ? void 0 : scrollElement.setInteractivityOff());
      !this.IORaf && (scrollElement == null ? void 0 : scrollElement.setOutOfView());
      if (!(scrollElement != null && scrollElement.attributes.scrollRepeat) && !this.IORaf) {
        this.unobserve(entry.target);
      }
    }
  };
  function clamp(min, max, value) {
    return value < min ? min : value > max ? max : value;
  }
  function mapRange(inMin, inMax, outMin, outMax, value) {
    const inRange = inMax - inMin;
    const outRange = outMax - outMin;
    return outMin + ((value - inMin) / inRange * outRange || 0);
  }
  function normalize(min, max, value) {
    return mapRange(min, max, 0, 1, value);
  }
  function closestNumber(array, target) {
    return array.reduce((prev, curr) => {
      return Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev;
    });
  }
  var INVIEW_CLASS = "is-inview";
  var PROGRESS_CSS_VAR = "--progress";
  var PROGRESS_MODULAR_METHOD = "onScrollProgress";
  var ScrollElement = class {
    constructor({
      $el,
      id,
      modularInstance,
      subscribeElementUpdateFn,
      unsubscribeElementUpdateFn,
      needRaf,
      scrollOrientation
    }) {
      var _this$$el$dataset$scr, _this$$el$dataset$scr2, _this$$el$dataset$scr3, _this$$el$dataset$scr4, _this$$el$dataset$scr5;
      this.$el = void 0;
      this.id = void 0;
      this.needRaf = void 0;
      this.attributes = void 0;
      this.scrollOrientation = void 0;
      this.isAlreadyIntersected = void 0;
      this.intersection = void 0;
      this.metrics = void 0;
      this.currentScroll = void 0;
      this.translateValue = void 0;
      this.progress = void 0;
      this.lastProgress = void 0;
      this.modularInstance = void 0;
      this.progressModularModules = void 0;
      this.isInview = void 0;
      this.isInteractive = void 0;
      this.isInFold = void 0;
      this.isFirstResize = void 0;
      this.subscribeElementUpdateFn = void 0;
      this.unsubscribeElementUpdateFn = void 0;
      this.$el = $el;
      this.id = id;
      this.needRaf = needRaf;
      this.scrollOrientation = scrollOrientation;
      this.modularInstance = modularInstance;
      this.subscribeElementUpdateFn = subscribeElementUpdateFn;
      this.unsubscribeElementUpdateFn = unsubscribeElementUpdateFn;
      this.attributes = {
        scrollClass: (_this$$el$dataset$scr = this.$el.dataset["scrollClass"]) != null ? _this$$el$dataset$scr : INVIEW_CLASS,
        scrollOffset: (_this$$el$dataset$scr2 = this.$el.dataset["scrollOffset"]) != null ? _this$$el$dataset$scr2 : "0,0",
        scrollPosition: (_this$$el$dataset$scr3 = this.$el.dataset["scrollPosition"]) != null ? _this$$el$dataset$scr3 : "start,end",
        scrollModuleProgress: this.$el.dataset["scrollModuleProgress"] != null,
        scrollCssProgress: this.$el.dataset["scrollCssProgress"] != null,
        scrollEventProgress: (_this$$el$dataset$scr4 = this.$el.dataset["scrollEventProgress"]) != null ? _this$$el$dataset$scr4 : null,
        scrollSpeed: this.$el.dataset["scrollSpeed"] != null ? parseFloat(this.$el.dataset["scrollSpeed"]) : null,
        scrollRepeat: this.$el.dataset["scrollRepeat"] != null,
        scrollCall: (_this$$el$dataset$scr5 = this.$el.dataset["scrollCall"]) != null ? _this$$el$dataset$scr5 : null,
        scrollCallSelf: this.$el.dataset["scrollCallSelf"] != null,
        scrollIgnoreFold: this.$el.dataset["scrollIgnoreFold"] != null,
        scrollEnableTouchSpeed: this.$el.dataset["scrollEnableTouchSpeed"] != null
      };
      this.intersection = {
        start: 0,
        end: 0
      };
      this.metrics = {
        offsetStart: 0,
        offsetEnd: 0,
        bcr: {}
      };
      this.currentScroll = this.scrollOrientation === "vertical" ? window.scrollY : window.scrollX;
      this.translateValue = 0;
      this.progress = 0;
      this.lastProgress = null;
      this.progressModularModules = [];
      this.isInview = false;
      this.isInteractive = false;
      this.isAlreadyIntersected = false;
      this.isInFold = false;
      this.isFirstResize = true;
      this._init();
    }
    /**
     * Lifecyle - Initialize progress tracking.
     *
     * @private
     */
    _init() {
      if (!this.needRaf) {
        return;
      }
      if (this.modularInstance && this.attributes.scrollModuleProgress) {
        this._getProgressModularModules();
      }
      this._resize();
    }
    /**
     * Callback - Resize callback
     */
    onResize({
      currentScroll
    }) {
      this.currentScroll = currentScroll;
      this._resize();
    }
    /**
     * Callback - RAF callback
     */
    onRender({
      currentScroll,
      smooth
    }) {
      const wSize = this.scrollOrientation === "vertical" ? window.innerHeight : window.innerWidth;
      this.currentScroll = currentScroll;
      this._computeProgress();
      if (this.attributes.scrollSpeed && !isNaN(this.attributes.scrollSpeed)) {
        if (!this.attributes.scrollEnableTouchSpeed && !smooth) {
          if (this.translateValue) {
            this.$el.style.transform = `translate3d(0, 0, 0)`;
          }
          this.translateValue = 0;
        } else {
          if (this.isInFold) {
            const progress = Math.max(0, this.progress);
            this.translateValue = progress * wSize * this.attributes.scrollSpeed * -1;
          } else {
            const progress = mapRange(0, 1, -1, 1, this.progress);
            this.translateValue = progress * wSize * this.attributes.scrollSpeed * -1;
          }
          this.$el.style.transform = this.scrollOrientation === "vertical" ? `translate3d(0, ${this.translateValue}px, 0)` : `translate3d(${this.translateValue}px, 0, 0)`;
        }
      }
    }
    /**
     * Inview callback
     */
    setInview() {
      if (this.isInview) {
        return;
      }
      this.isInview = true;
      this.$el.classList.add(this.attributes.scrollClass);
      const way = "enter";
      const from = this._getScrollCallFrom();
      this.attributes.scrollCall && this._dispatchCall(way, from);
    }
    /**
     * Out of view callback
     */
    setOutOfView() {
      if (!(this.isInview && this.attributes.scrollRepeat)) {
        return;
      }
      this.isInview = false;
      this.$el.classList.remove(this.attributes.scrollClass);
      const way = "leave";
      const from = this._getScrollCallFrom();
      this.attributes.scrollCall && this._dispatchCall(way, from);
    }
    /**
     * Switch interactivity on to subscribe the instance to the RAF
     * and start calculations.
     */
    setInteractivityOn() {
      if (this.isInteractive) {
        return;
      }
      this.isInteractive = true;
      this.subscribeElementUpdateFn(this);
    }
    /**
     * Switch interactivity off to unsubscribe the instance to the RAF
     * and stop calculations.
     */
    setInteractivityOff() {
      if (!this.isInteractive) {
        return;
      }
      this.isInteractive = false;
      this.unsubscribeElementUpdateFn(this);
      this.lastProgress != null && this._computeProgress(closestNumber([0, 1], this.lastProgress));
    }
    /**
     * Resize method that compute the element's values.
     *
     * @private
     */
    _resize() {
      this.metrics.bcr = this.$el.getBoundingClientRect();
      this._computeMetrics();
      this._computeIntersection();
      if (this.isFirstResize) {
        this.isFirstResize = false;
        if (this.isInFold) {
          this.setInview();
        }
      }
    }
    /**
     * Compute element's offsets and determine if the element is in fold.
     *
     * @private
     */
    _computeMetrics() {
      const {
        top,
        left,
        height,
        width
      } = this.metrics.bcr;
      const wSize = this.scrollOrientation === "vertical" ? window.innerHeight : window.innerWidth;
      const metricsStart = this.scrollOrientation === "vertical" ? top : left;
      const metricsSize = this.scrollOrientation === "vertical" ? height : width;
      this.metrics.offsetStart = this.currentScroll + metricsStart - this.translateValue;
      this.metrics.offsetEnd = this.metrics.offsetStart + metricsSize;
      if (this.metrics.offsetStart < wSize && !this.attributes.scrollIgnoreFold) {
        this.isInFold = true;
      } else {
        this.isInFold = false;
      }
    }
    /**
     * Compute intersection values depending on the context.
     *
     * @private
     */
    _computeIntersection() {
      const wSize = this.scrollOrientation === "vertical" ? window.innerHeight : window.innerWidth;
      const metricsSize = this.scrollOrientation === "vertical" ? this.metrics.bcr.height : this.metrics.bcr.width;
      const offset = this.attributes.scrollOffset.split(",");
      const offsetStart = offset[0] != void 0 ? offset[0].trim() : "0";
      const offsetEnd = offset[1] != void 0 ? offset[1].trim() : "0";
      const scrollPosition = this.attributes.scrollPosition.split(",");
      let scrollPositionStart = scrollPosition[0] != void 0 ? scrollPosition[0].trim() : "start";
      const scrollPositionEnd = scrollPosition[1] != void 0 ? scrollPosition[1].trim() : "end";
      const viewportStart = offsetStart.includes("%") ? wSize * parseInt(offsetStart.replace("%", "").trim()) * 0.01 : parseInt(offsetStart);
      const viewportEnd = offsetEnd.includes("%") ? wSize * parseInt(offsetEnd.replace("%", "").trim()) * 0.01 : parseInt(offsetEnd);
      if (this.isInFold) {
        scrollPositionStart = "fold";
      }
      switch (scrollPositionStart) {
        case "start":
          this.intersection.start = this.metrics.offsetStart - wSize + viewportStart;
          break;
        case "middle":
          this.intersection.start = this.metrics.offsetStart - wSize + viewportStart + metricsSize * 0.5;
          break;
        case "end":
          this.intersection.start = this.metrics.offsetStart - wSize + viewportStart + metricsSize;
          break;
        case "fold":
          this.intersection.start = 0;
          break;
        default:
          this.intersection.start = this.metrics.offsetStart - wSize + viewportStart;
          break;
      }
      switch (scrollPositionEnd) {
        case "start":
          this.intersection.end = this.metrics.offsetStart - viewportEnd;
          break;
        case "middle":
          this.intersection.end = this.metrics.offsetStart - viewportEnd + metricsSize * 0.5;
          break;
        case "end":
          this.intersection.end = this.metrics.offsetStart - viewportEnd + metricsSize;
          break;
        default:
          this.intersection.end = this.metrics.offsetStart - viewportEnd + metricsSize;
          break;
      }
      if (this.intersection.end <= this.intersection.start) {
        switch (scrollPositionEnd) {
          case "start":
            this.intersection.end = this.intersection.start + 1;
            break;
          case "middle":
            this.intersection.end = this.intersection.start + metricsSize * 0.5;
            break;
          case "end":
            this.intersection.end = this.intersection.start + metricsSize;
            break;
          default:
            this.intersection.end = this.intersection.start + 1;
            break;
        }
      }
    }
    /**
     * Compute the scroll progress of the element depending
     * on its intersection values.
     *
     * @private
     *
     * @param {number} [forcedProgress] - Value to force progress.
     */
    _computeProgress(forcedProgress) {
      const progress = forcedProgress != null ? forcedProgress : clamp(0, 1, normalize(this.intersection.start, this.intersection.end, this.currentScroll));
      this.progress = progress;
      if (progress != this.lastProgress) {
        this.lastProgress = progress;
        this.attributes.scrollCssProgress && this._setCssProgress(progress);
        this.attributes.scrollEventProgress && this._setCustomEventProgress(progress);
        if (this.attributes.scrollModuleProgress) {
          for (const modularModules of this.progressModularModules) {
            this.modularInstance && this.modularInstance.call(PROGRESS_MODULAR_METHOD, progress, modularModules.moduleName, modularModules.moduleId);
          }
        }
        progress > 0 && progress < 1 && this.setInview();
        progress === 0 && this.setOutOfView();
        progress === 1 && this.setOutOfView();
      }
    }
    /**
     * Set the element's progress to a specific css variable.
     *
     * @private
     *
     * @param {number} [currentProgress] - Progress value.
     */
    _setCssProgress(currentProgress = 0) {
      this.$el.style.setProperty(PROGRESS_CSS_VAR, currentProgress.toString());
    }
    /**
     * Set the element's progress to the custom event listeners.
     *
     * @private
     *
     * @param {number} [currentProgress] - Progress value.
     */
    _setCustomEventProgress(currentProgress = 0) {
      const customEventName = this.attributes.scrollEventProgress;
      if (!customEventName)
        return;
      const customEvent = new CustomEvent(customEventName, {
        detail: {
          target: this.$el,
          progress: currentProgress
        }
      });
      window.dispatchEvent(customEvent);
    }
    /**
     * Get modular modules that can listen the element's progress.
     *
     * @private
     */
    _getProgressModularModules() {
      if (!this.modularInstance) {
        return;
      }
      const modulesIdNames = Object.keys(this.$el.dataset).filter((key) => key.includes("module"));
      const modules = Object.entries(this.modularInstance.modules);
      if (!modulesIdNames.length) {
        return;
      }
      for (const modulesIdName of modulesIdNames) {
        const moduleId = this.$el.dataset[modulesIdName];
        if (!moduleId) {
          return;
        }
        for (const module of modules) {
          const [moduleName, moduleObj] = module;
          if (moduleId in moduleObj) {
            this.progressModularModules.push({
              moduleName,
              moduleId
            });
          }
        }
      }
    }
    /**
     * Function to get scroll call from.
     *
     * @private
     */
    _getScrollCallFrom() {
      const closestIntersectionValue = closestNumber([this.intersection.start, this.intersection.end], this.currentScroll);
      return this.intersection.start === closestIntersectionValue ? "start" : "end";
    }
    /**
     * Function to dispatch a custom event or call a modular callback.
     *
     * @private
     *
     * @param {scrollCallWay} way - Enter or leave.
     * @param {scrollCallFrom} from - Start or end.
     */
    _dispatchCall(way, from) {
      var _this$attributes$scro, _this$attributes;
      const callParameters = (_this$attributes$scro = this.attributes.scrollCall) == null ? void 0 : _this$attributes$scro.split(",");
      const callSelf = (_this$attributes = this.attributes) == null ? void 0 : _this$attributes.scrollCallSelf;
      if (callParameters && callParameters.length > 1) {
        var _targetModuleId;
        const [func, moduleName, moduleId] = callParameters;
        let targetModuleId;
        if (callSelf) {
          targetModuleId = this.$el.dataset[`module${moduleName.trim()}`];
        } else {
          targetModuleId = moduleId;
        }
        this.modularInstance && this.modularInstance.call(func.trim(), {
          target: this.$el,
          way,
          from
        }, moduleName.trim(), (_targetModuleId = targetModuleId) == null ? void 0 : _targetModuleId.trim());
      } else if (callParameters) {
        const [customEventName] = callParameters;
        const customEvent = new CustomEvent(customEventName, {
          detail: {
            target: this.$el,
            way,
            from
          }
        });
        window.dispatchEvent(customEvent);
      }
    }
  };
  var ATTRIBUTES_THAT_NEED_RAF = ["scrollOffset", "scrollPosition", "scrollModuleProgress", "scrollCssProgress", "scrollEventProgress", "scrollSpeed"];
  var TRIGGER_ROOT_MARGIN = "-1px -1px -1px -1px";
  var RAF_ROOT_MARGIN = "100% 100% 100% 100%";
  var Core = class {
    constructor({
      $el,
      modularInstance,
      triggerRootMargin,
      rafRootMargin,
      scrollOrientation
    }) {
      this.$scrollContainer = void 0;
      this.modularInstance = void 0;
      this.triggerRootMargin = void 0;
      this.rafRootMargin = void 0;
      this.scrollElements = void 0;
      this.triggeredScrollElements = void 0;
      this.RAFScrollElements = void 0;
      this.scrollElementsToUpdate = void 0;
      this.IOTriggerInstance = void 0;
      this.IORafInstance = void 0;
      this.scrollOrientation = void 0;
      if (!$el) {
        console.error("Please provide a DOM Element as scrollContainer");
        return;
      }
      this.$scrollContainer = $el;
      this.modularInstance = modularInstance;
      this.scrollOrientation = scrollOrientation;
      this.triggerRootMargin = triggerRootMargin != null ? triggerRootMargin : TRIGGER_ROOT_MARGIN;
      this.rafRootMargin = rafRootMargin != null ? rafRootMargin : RAF_ROOT_MARGIN;
      this.scrollElements = [];
      this.triggeredScrollElements = [];
      this.RAFScrollElements = [];
      this.scrollElementsToUpdate = [];
      this._init();
    }
    /**
     * Lifecyle - Initialize the core.
     *
     * @private
     */
    _init() {
      const $scrollElements = this.$scrollContainer.querySelectorAll("[data-scroll]");
      const $scrollElementsArr = Array.from($scrollElements);
      this._subscribeScrollElements($scrollElementsArr);
      this.IOTriggerInstance = new IO({
        scrollElements: [...this.triggeredScrollElements],
        rootMargin: this.triggerRootMargin,
        IORaf: false
      });
      this.IORafInstance = new IO({
        scrollElements: [...this.RAFScrollElements],
        rootMargin: this.rafRootMargin,
        IORaf: true
      });
    }
    /**
     * Lifecyle - Destroy core.
     */
    destroy() {
      this.IOTriggerInstance.destroy();
      this.IORafInstance.destroy();
      this._unsubscribeAllScrollElements();
    }
    /**
     * Callback - Resize callback.
     */
    onResize({
      currentScroll
    }) {
      for (const scrollElement of this.RAFScrollElements) {
        scrollElement.onResize({
          currentScroll
        });
      }
    }
    /**
     * Callback - RAF callback.
     */
    onRender({
      currentScroll,
      smooth
    }) {
      for (const scrollElement of this.scrollElementsToUpdate) {
        scrollElement.onRender({
          currentScroll,
          smooth
        });
      }
    }
    /**
     * Remove items from lists of scroll elements and compute all new values.
     *
     * @param {HTMLElement} $oldContainer - HTMLElement that contains data-scroll elements to unsubscribe
     */
    removeScrollElements($oldContainer) {
      const $scrollElementsToRemove = $oldContainer.querySelectorAll("[data-scroll]");
      if (!$scrollElementsToRemove.length)
        return;
      for (let index = 0; index < this.triggeredScrollElements.length; index++) {
        const scrollElement = this.triggeredScrollElements[index];
        const $scrollElementsToRemoveArr = Array.from($scrollElementsToRemove);
        if ($scrollElementsToRemoveArr.indexOf(scrollElement.$el) > -1) {
          this.IOTriggerInstance.unobserve(scrollElement.$el);
          this.triggeredScrollElements.splice(index, 1);
        }
      }
      for (let index = 0; index < this.RAFScrollElements.length; index++) {
        const scrollElement = this.RAFScrollElements[index];
        const $scrollElementsToRemoveArr = Array.from($scrollElementsToRemove);
        if ($scrollElementsToRemoveArr.indexOf(scrollElement.$el) > -1) {
          this.IORafInstance.unobserve(scrollElement.$el);
          this.RAFScrollElements.splice(index, 1);
        }
      }
      $scrollElementsToRemove.forEach(($scrollElement) => {
        const targetScrollElementToUpdate = this.scrollElementsToUpdate.find((scrollElement) => scrollElement.$el === $scrollElement);
        const targetScrollElement = this.scrollElements.find((scrollElement) => scrollElement.$el === $scrollElement);
        if (targetScrollElementToUpdate) {
          this._unsubscribeElementUpdate(targetScrollElementToUpdate);
        }
        if (targetScrollElement) {
          this.scrollElements = this.scrollElements.filter((scrollElementItem) => scrollElementItem.id != targetScrollElement.id);
        }
      });
    }
    /**
     * Add items to lists of scroll elements and compute all new values.
     *
     * @param {HTMLElement} $newContainer - HTMLElement that contains data-scroll elements to subscribe
     */
    addScrollElements($newContainer) {
      const $scrollElements = $newContainer.querySelectorAll("[data-scroll]");
      const ids = [];
      this.scrollElements.forEach((scrollElement) => {
        ids.push(scrollElement.id);
      });
      const maxID = Math.max(...ids);
      const fromIndex = maxID + 1;
      const $scrollElementsArr = Array.from($scrollElements);
      this._subscribeScrollElements($scrollElementsArr, fromIndex, true);
    }
    /**
     * Create a ScrollElement instance for each elements with
     * `data-scroll` attribute.
     *
     * @private
     *
     * @param {HTMLElement[]} $scrollElements - List of elements that need
     *     to be regarded.
     */
    _subscribeScrollElements($scrollElements, fromIndex = 0, toObserve = false) {
      for (let index = 0; index < $scrollElements.length; index++) {
        const $scrollElement = $scrollElements[index];
        const needRaf = this._checkRafNeeded($scrollElement);
        const scrollElementInstance = new ScrollElement({
          $el: $scrollElement,
          id: fromIndex + index,
          scrollOrientation: this.scrollOrientation,
          modularInstance: this.modularInstance,
          subscribeElementUpdateFn: this._subscribeElementUpdate.bind(this),
          unsubscribeElementUpdateFn: this._unsubscribeElementUpdate.bind(this),
          needRaf
        });
        this.scrollElements.push(scrollElementInstance);
        if (needRaf) {
          this.RAFScrollElements.push(scrollElementInstance);
          if (toObserve) {
            this.IORafInstance.scrollElements.push(scrollElementInstance);
            this.IORafInstance.observe(scrollElementInstance.$el);
          }
        } else {
          this.triggeredScrollElements.push(scrollElementInstance);
          if (toObserve) {
            this.IOTriggerInstance.scrollElements.push(scrollElementInstance);
            this.IOTriggerInstance.observe(scrollElementInstance.$el);
          }
        }
      }
    }
    /**
     * Clear all ScrollElement arrays.
     *
     * @private
     */
    _unsubscribeAllScrollElements() {
      this.scrollElements = [];
      this.RAFScrollElements = [];
      this.triggeredScrollElements = [];
      this.scrollElementsToUpdate = [];
    }
    /**
     * Subscribe ScrollElement instance that needs to be updated.
     *
     * @private
     *
     * @param {ScrollElement} scrollElement - ScrollElement instance inview
     *     that needs to be updated.
     */
    _subscribeElementUpdate(scrollElement) {
      this.scrollElementsToUpdate.push(scrollElement);
    }
    /**
     * Unscribe ScrollElement instance that doesn't need to be updated.
     *
     * @private
     *
     * @param {ScrollElement} scrollElement - The updated ScrollElement instance
     *     out of view now.
     */
    _unsubscribeElementUpdate(scrollElement) {
      this.scrollElementsToUpdate = this.scrollElementsToUpdate.filter((scrollElementToUpdate) => scrollElementToUpdate.id != scrollElement.id);
    }
    /**
     * Check if a DOM Element need a requestAnimationFrame to be used.
     *
     * @private
     *
     * @param {HTMLElement} $scrollElement - The element that needs to be checked.
     *
     * @returns {boolean}
     */
    _checkRafNeeded($scrollElement) {
      let attributesThatNeedRaf = [...ATTRIBUTES_THAT_NEED_RAF];
      const removeAttribute = (attributeToRemove) => {
        attributesThatNeedRaf = attributesThatNeedRaf.filter((attribute) => attribute != attributeToRemove);
      };
      if ($scrollElement.dataset.scrollOffset) {
        const value = $scrollElement.dataset.scrollOffset.split(",").map((test) => test.replace("%", "").trim()).join(",");
        if (value != "0,0") {
          return true;
        } else {
          removeAttribute("scrollOffset");
        }
      } else {
        removeAttribute("scrollOffset");
      }
      if ($scrollElement.dataset.scrollPosition) {
        const value = $scrollElement.dataset.scrollPosition.trim();
        if (value != "top,bottom") {
          return true;
        } else {
          removeAttribute("scrollPosition");
        }
      } else {
        removeAttribute("scrollPosition");
      }
      if ($scrollElement.dataset.scrollSpeed && !isNaN(parseFloat($scrollElement.dataset.scrollSpeed))) {
        return true;
      } else {
        removeAttribute("scrollSpeed");
      }
      for (const attribute of attributesThatNeedRaf) {
        if (attribute in $scrollElement.dataset) {
          return true;
        }
      }
      return false;
    }
  };
  var RO = class {
    constructor({
      resizeElements,
      resizeCallback = () => {
      }
    }) {
      this.$resizeElements = void 0;
      this.isFirstObserve = void 0;
      this.observer = void 0;
      this.resizeCallback = void 0;
      this.$resizeElements = resizeElements;
      this.resizeCallback = resizeCallback;
      this.isFirstObserve = true;
      this._init();
    }
    /**
     * Lifecyle - Initialize Resize Observer.
     *
     * @private
     */
    _init() {
      const onResize = (entries) => {
        var _this$resizeCallback;
        !this.isFirstObserve && ((_this$resizeCallback = this.resizeCallback) == null ? void 0 : _this$resizeCallback.call(this));
        this.isFirstObserve = false;
      };
      this.observer = new ResizeObserver(onResize);
      for (const $resizeElement of this.$resizeElements) {
        this.observer.observe($resizeElement);
      }
    }
    /**
     * Lifecyle - Destroy Resize Observer.
     */
    destroy() {
      this.observer.disconnect();
    }
  };
  var defaultLenisOptions = {
    wrapper: window,
    content: document.documentElement,
    lerp: 0.1,
    duration: 1.2,
    orientation: "vertical",
    gestureOrientation: "vertical",
    smoothWheel: true,
    smoothTouch: false,
    wheelMultiplier: 1,
    touchMultiplier: 2,
    normalizeWheel: true,
    easing: (t2) => Math.min(1, 1.001 - Math.pow(2, -10 * t2))
    // https://www.desmos.com/calculator/brs54l4xou
  };
  var LocomotiveScroll = class {
    constructor({
      lenisOptions = {},
      modularInstance,
      triggerRootMargin,
      rafRootMargin,
      autoResize = true,
      autoStart = true,
      scrollCallback = () => {
      },
      initCustomTicker,
      destroyCustomTicker
    } = {}) {
      this.rafPlaying = void 0;
      this.lenisInstance = void 0;
      this.coreInstance = void 0;
      this.lenisOptions = void 0;
      this.modularInstance = void 0;
      this.triggerRootMargin = void 0;
      this.rafRootMargin = void 0;
      this.rafInstance = void 0;
      this.autoResize = void 0;
      this.autoStart = void 0;
      this.ROInstance = void 0;
      this.initCustomTicker = void 0;
      this.destroyCustomTicker = void 0;
      this._onRenderBind = void 0;
      this._onResizeBind = void 0;
      this._onScrollToBind = void 0;
      this.lenisOptions = _extends({}, defaultLenisOptions, lenisOptions);
      Object.assign(this, {
        lenisOptions,
        modularInstance,
        triggerRootMargin,
        rafRootMargin,
        autoResize,
        autoStart,
        scrollCallback,
        initCustomTicker,
        destroyCustomTicker
      });
      this._onRenderBind = this._onRender.bind(this);
      this._onScrollToBind = this._onScrollTo.bind(this);
      this._onResizeBind = this._onResize.bind(this);
      this.rafPlaying = false;
      this._init();
    }
    /**
     * Lifecyle - Initialize instance.
     *
     * @private
     */
    _init() {
      var _this$lenisInstance;
      this.lenisInstance = new l({
        wrapper: this.lenisOptions.wrapper,
        content: this.lenisOptions.content,
        lerp: this.lenisOptions.lerp,
        duration: this.lenisOptions.duration,
        orientation: this.lenisOptions.orientation,
        gestureOrientation: this.lenisOptions.gestureOrientation,
        smoothWheel: this.lenisOptions.smoothWheel,
        smoothTouch: this.lenisOptions.smoothTouch,
        wheelMultiplier: this.lenisOptions.wheelMultiplier,
        touchMultiplier: this.lenisOptions.touchMultiplier,
        normalizeWheel: this.lenisOptions.normalizeWheel,
        easing: this.lenisOptions.easing
      });
      (_this$lenisInstance = this.lenisInstance) == null ? void 0 : _this$lenisInstance.on("scroll", this.scrollCallback);
      document.documentElement.setAttribute("data-scroll-orientation", this.lenisInstance.options.orientation);
      requestAnimationFrame(() => {
        this.coreInstance = new Core({
          $el: this.lenisInstance.rootElement,
          modularInstance: this.modularInstance,
          triggerRootMargin: this.triggerRootMargin,
          rafRootMargin: this.rafRootMargin,
          scrollOrientation: this.lenisInstance.options.orientation
        });
        this._bindEvents();
        if (this.initCustomTicker && !this.destroyCustomTicker) {
          console.warn("initCustomTicker callback is declared, but destroyCustomTicker is not. Please pay attention. It could cause trouble.");
        } else if (!this.initCustomTicker && this.destroyCustomTicker) {
          console.warn("destroyCustomTicker callback is declared, but initCustomTicker is not. Please pay attention. It could cause trouble.");
        }
        this.autoStart && this.start();
      });
    }
    /**
     * Lifecyle - Destroy instance.
     */
    destroy() {
      this.stop();
      this._unbindEvents();
      this.lenisInstance.destroy();
      this.coreInstance.destroy();
    }
    /**
     * Events - Subscribe events to listen.
     */
    _bindEvents() {
      this._bindScrollToEvents();
      if (this.autoResize) {
        if ("ResizeObserver" in window) {
          this.ROInstance = new RO({
            resizeElements: [document.body],
            resizeCallback: this._onResizeBind
          });
        } else {
          window.addEventListener("resize", this._onResizeBind);
        }
      }
    }
    /**
     * Events - Unsubscribe listened events.
     */
    _unbindEvents() {
      this._unbindScrollToEvents();
      if (this.autoResize) {
        if ("ResizeObserver" in window) {
          this.ROInstance && this.ROInstance.destroy();
        } else {
          window.removeEventListener("resize", this._onResizeBind);
        }
      }
    }
    /**
     * Events - Subscribe scrollTo events to listen.
     */
    _bindScrollToEvents($container) {
      const $rootContainer = $container ? $container : this.lenisInstance.rootElement;
      const $scrollToElements = $rootContainer == null ? void 0 : $rootContainer.querySelectorAll("[data-scroll-to]");
      ($scrollToElements == null ? void 0 : $scrollToElements.length) && $scrollToElements.forEach(($el) => {
        $el.addEventListener("click", this._onScrollToBind, false);
      });
    }
    /**
     * Events - Unsubscribe scrollTo listened events.
     */
    _unbindScrollToEvents($container) {
      const $rootContainer = $container ? $container : this.lenisInstance.rootElement;
      const $scrollToElements = $rootContainer == null ? void 0 : $rootContainer.querySelectorAll("[data-scroll-to]");
      ($scrollToElements == null ? void 0 : $scrollToElements.length) && $scrollToElements.forEach(($el) => {
        $el.removeEventListener("click", this._onScrollToBind, false);
      });
    }
    /**
     * Callback - Resize callback.
     */
    _onResize() {
      requestAnimationFrame(() => {
        var _this$coreInstance;
        (_this$coreInstance = this.coreInstance) == null ? void 0 : _this$coreInstance.onResize({
          currentScroll: this.lenisInstance.scroll
        });
      });
    }
    /**
     * Callback - Render callback.
     */
    _onRender() {
      var _this$lenisInstance2, _this$coreInstance2;
      (_this$lenisInstance2 = this.lenisInstance) == null ? void 0 : _this$lenisInstance2.raf(Date.now());
      (_this$coreInstance2 = this.coreInstance) == null ? void 0 : _this$coreInstance2.onRender({
        currentScroll: this.lenisInstance.scroll,
        smooth: this.lenisInstance.isSmooth
      });
    }
    /**
     * Callback - Scroll To callback.
     */
    _onScrollTo(event) {
      var _event$currentTarget;
      event.preventDefault();
      const $target = (_event$currentTarget = event.currentTarget) != null ? _event$currentTarget : null;
      if (!$target)
        return;
      const target = $target.getAttribute("data-scroll-to-href") || $target.getAttribute("href");
      const offset = $target.getAttribute("data-scroll-to-offset") || 0;
      const duration = $target.getAttribute("data-scroll-to-duration") || this.lenisOptions.duration || defaultLenisOptions.duration;
      target && this.scrollTo(target, {
        offset: typeof offset === "string" ? parseInt(offset) : offset,
        duration: typeof duration === "string" ? parseInt(duration) : duration
      });
    }
    /**
     * Start RequestAnimationFrame that active Lenis smooth and scroll progress.
     */
    start() {
      if (this.rafPlaying) {
        return;
      }
      this.rafPlaying = true;
      this.initCustomTicker ? this.initCustomTicker(this._onRenderBind) : this._raf();
    }
    /**
     * Stop RequestAnimationFrame that active Lenis smooth and scroll progress.
     */
    stop() {
      if (!this.rafPlaying) {
        return;
      }
      this.rafPlaying = false;
      this.destroyCustomTicker ? this.destroyCustomTicker(this._onRenderBind) : this.rafInstance && cancelAnimationFrame(this.rafInstance);
    }
    /**
     * Remove old scroll elements items and rebuild ScrollElements instances.
     */
    removeScrollElements($oldContainer) {
      var _this$coreInstance3;
      if (!$oldContainer) {
        console.error("Please provide a DOM Element as $oldContainer");
        return;
      }
      this._unbindScrollToEvents($oldContainer);
      (_this$coreInstance3 = this.coreInstance) == null ? void 0 : _this$coreInstance3.removeScrollElements($oldContainer);
    }
    /**
     * Add new scroll elements items and rebuild ScrollElements instances.
     */
    addScrollElements($newContainer) {
      var _this$coreInstance4;
      if (!$newContainer) {
        console.error("Please provide a DOM Element as $newContainer");
        return;
      }
      (_this$coreInstance4 = this.coreInstance) == null ? void 0 : _this$coreInstance4.addScrollElements($newContainer);
      requestAnimationFrame(() => {
        this._bindScrollToEvents($newContainer);
      });
    }
    /**
     * Trigger resize callback.
     */
    resize() {
      this._onResizeBind();
    }
    /**
     * Trigger scroll to callback.
     */
    scrollTo(target, options) {
      var _this$lenisInstance3;
      (_this$lenisInstance3 = this.lenisInstance) == null ? void 0 : _this$lenisInstance3.scrollTo(target, {
        offset: options == null ? void 0 : options.offset,
        lerp: options == null ? void 0 : options.lerp,
        duration: options == null ? void 0 : options.duration,
        immediate: options == null ? void 0 : options.immediate,
        lock: options == null ? void 0 : options.lock,
        force: options == null ? void 0 : options.force,
        easing: options == null ? void 0 : options.easing,
        onComplete: options == null ? void 0 : options.onComplete
      });
    }
    /**
     * RequestAnimationFrame that active Lenis smooth and scroll progress.
     *
     * @private
     *
     */
    _raf() {
      this._onRenderBind();
      this.rafInstance = requestAnimationFrame(() => this._raf());
    }
  };

  // assets/scripts/modules/Scroll.js
  var Scroll_default = class extends _default {
    constructor(m) {
      super(m);
    }
    init() {
      this.scroll = new LocomotiveScroll({
        modularInstance: this
      });
    }
    scrollTo(params) {
      var _b;
      let _a = params, { target } = _a, options = __objRest(_a, ["target"]);
      options = Object.assign({
        // Defaults
        duration: 1
      }, options);
      (_b = this.scroll) == null ? void 0 : _b.scrollTo(target, options);
    }
    /**
    * Observe new scroll elements
    *
    * @param $newContainer (HTMLElement)
    */
    addScrollElements($newContainer) {
      var _a;
      (_a = this.scroll) == null ? void 0 : _a.addScrollElements($newContainer);
    }
    /**
    * Unobserve scroll elements
    *
    * @param $oldContainer (HTMLElement)
    */
    removeScrollElements($oldContainer) {
      var _a;
      (_a = this.scroll) == null ? void 0 : _a.removeScrollElements($oldContainer);
    }
    destroy() {
      this.scroll.destroy();
    }
  };

  // assets/scripts/globals.js
  var import_svg4everybody = __toESM(require_svg4everybody(), 1);
  var gridHelper2;
  (() => __async(void 0, null, function* () {
    if (ENV.IS_DEV) {
      const gridHelperModule = yield Promise.resolve().then(() => (init_grid_helper(), grid_helper_exports));
      gridHelper2 = gridHelperModule == null ? void 0 : gridHelperModule.gridHelper;
    }
  }))();
  function globals_default() {
    (0, import_svg4everybody.default)();
    gridHelper2 == null ? void 0 : gridHelper2();
    triggerLazyloadCallbacks();
  }

  // assets/scripts/utils/tickers.js
  var debounce = (callback, delay, immediate = false) => {
    let timeout = null;
    return (...args) => {
      clearTimeout(timeout);
      const later = () => {
        timeout = null;
        if (!immediate) {
          callback(...args);
        }
      };
      if (immediate && !timeout) {
        callback(...args);
      }
      timeout = setTimeout(later, delay);
    };
  };

  // assets/scripts/utils/dom.js
  var $html = document.documentElement;
  var $body = document.body;

  // assets/scripts/app.js
  var app = new main_esm_default({
    modules: modules_exports
  });
  window.onload = (event) => {
    const $style = document.getElementById("main-css");
    if ($style) {
      if ($style.isLoaded) {
        init();
      } else {
        $style.addEventListener("load", (event2) => {
          init();
        });
      }
    } else {
      console.warn('The "main-css" stylesheet not found');
    }
  };
  function init() {
    globals_default();
    app.init(app);
    $html.classList.add(CSS_CLASS.LOADED);
    $html.classList.add(CSS_CLASS.READY);
    $html.classList.remove(CSS_CLASS.LOADING);
    const resizeEndEvent = new CustomEvent(CUSTOM_EVENT.RESIZE_END);
    window.addEventListener("resize", () => {
      $html.style.setProperty("--vw", `${document.documentElement.clientWidth * 0.01}px`);
      debounce(() => {
        window.dispatchEvent(resizeEndEvent);
      }, 200, false);
    });
    if (isFontLoadingAPIAvailable) {
      loadFonts(FONT.EAGER, ENV.IS_DEV).then((eagerFonts) => {
        $html.classList.add(CSS_CLASS.FONTS_LOADED);
        if (ENV.IS_DEV) {
          console.group("Eager fonts loaded!", eagerFonts.length, "/", document.fonts.size);
          console.group("State of eager fonts:");
          eagerFonts.forEach((font) => console.log(
            font.family,
            font.style,
            font.weight,
            font.status
            /*, font*/
          ));
          console.groupEnd();
          console.group("State of all fonts:");
          document.fonts.forEach((font) => console.log(
            font.family,
            font.style,
            font.weight,
            font.status
            /*, font*/
          ));
          console.groupEnd();
        }
      });
    }
  }
})();
/*! Bundled license information:

svg4everybody/dist/svg4everybody.js:
  (*! svg4everybody v2.1.9 | github.com/jonathantneal/svg4everybody *)
*/
//# sourceMappingURL=app.js.map
