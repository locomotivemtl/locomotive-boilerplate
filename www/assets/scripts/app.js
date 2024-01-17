(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a2, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a2, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a2, prop, b[prop]);
      }
    return a2;
  };
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
        } catch (e3) {
          reject(e3);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e3) {
          reject(e3);
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
    for (var i3 = 0; i3 < columns; i3++) {
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
    document.addEventListener("keydown", (e3) => {
      if (e3.key == "Control") {
        ctrlDown = true;
      } else {
        if (ctrlDown && e3.key == "g") {
          if (isActive) {
            $container.style.visibility = "hidden";
          } else {
            $container.style.visibility = "visible";
          }
          isActive = !isActive;
        }
      }
    });
    document.addEventListener("keyup", (e3) => {
      if (e3.key == "Control") {
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
    for (var i3 = 0; i3 < props.length; i3++) {
      var descriptor = props[i3];
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
  function _slicedToArray(arr, i3) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i3) || _unsupportedIterableToArray(arr, i3) || _nonIterableRest();
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
  function _iterableToArrayLimit(arr, i3) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr)))
      return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = void 0;
    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);
        if (i3 && _arr.length === i3)
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
  function _unsupportedIterableToArray(o3, minLen) {
    if (!o3)
      return;
    if (typeof o3 === "string")
      return _arrayLikeToArray(o3, minLen);
    var n3 = Object.prototype.toString.call(o3).slice(8, -1);
    if (n3 === "Object" && o3.constructor)
      n3 = o3.constructor.name;
    if (n3 === "Map" || n3 === "Set")
      return Array.from(o3);
    if (n3 === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n3))
      return _arrayLikeToArray(o3, minLen);
  }
  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length)
      len = arr.length;
    for (var i3 = 0, arr2 = new Array(len); i3 < len; i3++)
      arr2[i3] = arr[i3];
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
      value: function mCheckEventTarget(e3) {
        var event = this.events[e3.type];
        if (typeof event === "string") {
          this[event](e3);
        } else {
          var data = "[" + this.mAttr + "]";
          var target = e3.target;
          if (this.mCaptureEvents.includes(e3.type)) {
            if (target.matches(data)) {
              this.mCallEventMethod(e3, event, target);
            }
          } else {
            while (target && target !== document) {
              if (target.matches(data)) {
                if (this.mCallEventMethod(e3, event, target) != "undefined") {
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
      value: function mCallEventMethod(e3, event, target) {
        var name = target.getAttribute(this.mAttr);
        if (event.hasOwnProperty(name)) {
          var method = event[name];
          if (!e3.hasOwnProperty("currentTarget")) {
            Object.defineProperty(e3, "currentTarget", {
              value: target
            });
          }
          if (!e3.hasOwnProperty("curTarget")) {
            Object.defineProperty(e3, "curTarget", {
              value: target
            });
          }
          this[method](e3);
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
      value: function on(e3, mod, func, id) {
        var _this4 = this;
        if (this.modules[mod]) {
          if (id) {
            this.modules[mod][id].el.addEventListener(e3, function(o3) {
              return func(o3);
            });
          } else {
            Object.keys(this.modules[mod]).forEach(function(i3) {
              _this4.modules[mod][i3].el.addEventListener(e3, function(o3) {
                return func(o3);
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
          Array.from(el.attributes).forEach(function(i3) {
            if (i3.name.startsWith("data-module")) {
              var moduleExists = false;
              var dataName = i3.name.split("-").splice(2);
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
                var id = i3.value;
                if (!id) {
                  _this.moduleId++;
                  id = "m" + _this.moduleId;
                  el.setAttribute(i3.name, id);
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
          Array.from(el.attributes).forEach(function(i3) {
            if (i3.name.startsWith("data-module")) {
              var id = i3.value;
              var dataName = i3.name.split("-").splice(2);
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
        return arr.reduce(function(a2, b) {
          return a2 + _this5.toUpper(b);
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
  var IS_MOBILE = window.matchMedia("(any-pointer:coarse)").matches;
  var ENV = Object.freeze({
    // Node environment
    NAME: NODE_ENV,
    IS_PROD: NODE_ENV === "production",
    IS_DEV: NODE_ENV === "development",
    // Device
    IS_MOBILE,
    IS_DESKTOP: !IS_MOBILE
  });
  var CSS_CLASS = Object.freeze({
    LOADING: "is-loading",
    LOADED: "is-loaded",
    READY: "is-ready",
    FONTS_LOADED: "fonts-loaded",
    LAZY_CONTAINER: "c-lazy",
    LAZY_LOADED: "-lazy-loaded"
    // ...
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
    for (var i3 = 0; i3 < props.length; i3++) {
      var descriptor = props[i3];
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
  function _slicedToArray2(arr, i3) {
    return _arrayWithHoles2(arr) || _iterableToArrayLimit2(arr, i3) || _unsupportedIterableToArray2(arr, i3) || _nonIterableRest2();
  }
  function _arrayWithHoles2(arr) {
    if (Array.isArray(arr))
      return arr;
  }
  function _iterableToArrayLimit2(arr, i3) {
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
        if (i3 && _arr.length === i3)
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
  function _unsupportedIterableToArray2(o3, minLen) {
    if (!o3)
      return;
    if (typeof o3 === "string")
      return _arrayLikeToArray2(o3, minLen);
    var n3 = Object.prototype.toString.call(o3).slice(8, -1);
    if (n3 === "Object" && o3.constructor)
      n3 = o3.constructor.name;
    if (n3 === "Map" || n3 === "Set")
      return Array.from(o3);
    if (n3 === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n3))
      return _arrayLikeToArray2(o3, minLen);
  }
  function _arrayLikeToArray2(arr, len) {
    if (len == null || len > arr.length)
      len = arr.length;
    for (var i3 = 0, arr2 = new Array(len); i3 < len; i3++)
      arr2[i3] = arr[i3];
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
        window.addEventListener("popstate", function(e3) {
          return _this.checkState(e3);
        }, false);
        this.html.addEventListener("click", function(e3) {
          return _this.checkClick(e3);
        }, false);
        this.loadEls(document);
      }
    }, {
      key: "checkClick",
      value: function checkClick(e3) {
        if (!e3.ctrlKey && !e3.metaKey) {
          var target = e3.target;
          while (target && target !== document) {
            if (target.matches("a") && target.getAttribute("download") == null) {
              var href = target.getAttribute("href");
              if (!href.startsWith("#") && !href.startsWith("mailto:") && !href.startsWith("tel:")) {
                e3.preventDefault();
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

  // assets/scripts/modules/Load.js
  var Load_default = class extends _default {
    constructor(m) {
      super(m);
    }
    init() {
      const load = new main_esm_default2({
        enterDelay: 0,
        transitions: {
          customTransition: {}
        }
      });
      load.on("loaded", (transition, oldContainer, newContainer) => {
        this.call("destroy", oldContainer, "app");
        this.call("update", newContainer, "app");
      });
    }
  };

  // assets/scripts/utils/image.js
  var getImageMetadata = ($img) => ({
    url: $img.src,
    width: $img.naturalWidth,
    height: $img.naturalHeight,
    ratio: $img.naturalWidth / $img.naturalHeight
  });
  var loadImage = (url, options = {}) => {
    return new Promise((resolve, reject) => {
      const $img = new Image();
      if (options.crossOrigin) {
        $img.crossOrigin = options.crossOrigin;
      }
      const loadCallback = () => {
        resolve(__spreadValues({
          element: $img
        }, getImageMetadata($img)));
      };
      if ($img.decode) {
        $img.src = url;
        $img.decode().then(loadCallback).catch((e3) => {
          reject(e3);
        });
      } else {
        $img.onload = loadCallback;
        $img.onerror = (e3) => {
          reject(e3);
        };
        $img.src = url;
      }
    });
  };
  var LAZY_LOADED_IMAGES = [];
  var lazyLoadImage = ($el, url, callback) => __async(void 0, null, function* () {
    let src = url ? url : $el.dataset.src;
    let loadedImage = LAZY_LOADED_IMAGES.find((image) => image.url === src);
    if (!loadedImage) {
      loadedImage = yield loadImage(src);
      if (!loadedImage.url) {
        return;
      }
      LAZY_LOADED_IMAGES.push(loadedImage);
    }
    if ($el.src === src) {
      return;
    }
    if ($el.tagName === "IMG") {
      $el.src = loadedImage.url;
    } else {
      $el.style.backgroundImage = `url(${loadedImage.url})`;
    }
    requestAnimationFrame(() => {
      let lazyParent = $el.closest(`.${CSS_CLASS.LAZY_CONTAINER}`);
      if (lazyParent) {
        lazyParent.classList.add(CSS_CLASS.LAZY_LOADED);
        lazyParent.style.backgroundImage = "";
      }
      $el.classList.add(CSS_CLASS.LAZY_LOADED);
      callback == null ? void 0 : callback();
    });
  });

  // node_modules/@studio-freight/lenis/dist/lenis.modern.mjs
  function t() {
    return t = Object.assign ? Object.assign.bind() : function(t2) {
      for (var i3 = 1; i3 < arguments.length; i3++) {
        var e3 = arguments[i3];
        for (var s3 in e3)
          Object.prototype.hasOwnProperty.call(e3, s3) && (t2[s3] = e3[s3]);
      }
      return t2;
    }, t.apply(this, arguments);
  }
  function i(t2, i3, e3) {
    return Math.max(t2, Math.min(i3, e3));
  }
  var e = class {
    advance(t2) {
      var e3;
      if (!this.isRunning)
        return;
      let s3 = false;
      if (this.lerp)
        this.value = (o3 = this.value, n3 = this.to, (1 - (r3 = 1 - Math.exp(-60 * this.lerp * t2))) * o3 + r3 * n3), Math.round(this.value) === this.to && (this.value = this.to, s3 = true);
      else {
        this.currentTime += t2;
        const e4 = i(0, this.currentTime / this.duration, 1);
        s3 = e4 >= 1;
        const o4 = s3 ? 1 : this.easing(e4);
        this.value = this.from + (this.to - this.from) * o4;
      }
      var o3, n3, r3;
      null == (e3 = this.onUpdate) || e3.call(this, this.value, s3), s3 && this.stop();
    }
    stop() {
      this.isRunning = false;
    }
    fromTo(t2, i3, { lerp: e3 = 0.1, duration: s3 = 1, easing: o3 = (t3) => t3, onStart: n3, onUpdate: r3 }) {
      this.from = this.value = t2, this.to = i3, this.lerp = e3, this.duration = s3, this.easing = o3, this.currentTime = 0, this.isRunning = true, null == n3 || n3(), this.onUpdate = r3;
    }
  };
  var s = class {
    constructor({ wrapper: t2, content: i3, autoResize: e3 = true } = {}) {
      if (this.resize = () => {
        this.onWrapperResize(), this.onContentResize();
      }, this.onWrapperResize = () => {
        this.wrapper === window ? (this.width = window.innerWidth, this.height = window.innerHeight) : (this.width = this.wrapper.clientWidth, this.height = this.wrapper.clientHeight);
      }, this.onContentResize = () => {
        this.scrollHeight = this.content.scrollHeight, this.scrollWidth = this.content.scrollWidth;
      }, this.wrapper = t2, this.content = i3, e3) {
        const t3 = function(t4, i4) {
          let e4;
          return function() {
            let i5 = arguments, s3 = this;
            clearTimeout(e4), e4 = setTimeout(function() {
              t4.apply(s3, i5);
            }, 250);
          };
        }(this.resize);
        this.wrapper !== window && (this.wrapperResizeObserver = new ResizeObserver(t3), this.wrapperResizeObserver.observe(this.wrapper)), this.contentResizeObserver = new ResizeObserver(t3), this.contentResizeObserver.observe(this.content);
      }
      this.resize();
    }
    destroy() {
      var t2, i3;
      null == (t2 = this.wrapperResizeObserver) || t2.disconnect(), null == (i3 = this.contentResizeObserver) || i3.disconnect();
    }
    get limit() {
      return { x: this.scrollWidth - this.width, y: this.scrollHeight - this.height };
    }
  };
  var o = class {
    constructor() {
      this.events = {};
    }
    emit(t2, ...i3) {
      let e3 = this.events[t2] || [];
      for (let t3 = 0, s3 = e3.length; t3 < s3; t3++)
        e3[t3](...i3);
    }
    on(t2, i3) {
      var e3;
      return (null == (e3 = this.events[t2]) ? void 0 : e3.push(i3)) || (this.events[t2] = [i3]), () => {
        var e4;
        this.events[t2] = null == (e4 = this.events[t2]) ? void 0 : e4.filter((t3) => i3 !== t3);
      };
    }
    off(t2, i3) {
      var e3;
      this.events[t2] = null == (e3 = this.events[t2]) ? void 0 : e3.filter((t3) => i3 !== t3);
    }
    destroy() {
      this.events = {};
    }
  };
  var n = class {
    constructor(t2, { wheelMultiplier: e3 = 1, touchMultiplier: s3 = 2, normalizeWheel: n3 = false }) {
      this.onTouchStart = (t3) => {
        const { clientX: i3, clientY: e4 } = t3.targetTouches ? t3.targetTouches[0] : t3;
        this.touchStart.x = i3, this.touchStart.y = e4, this.lastDelta = { x: 0, y: 0 };
      }, this.onTouchMove = (t3) => {
        const { clientX: i3, clientY: e4 } = t3.targetTouches ? t3.targetTouches[0] : t3, s4 = -(i3 - this.touchStart.x) * this.touchMultiplier, o3 = -(e4 - this.touchStart.y) * this.touchMultiplier;
        this.touchStart.x = i3, this.touchStart.y = e4, this.lastDelta = { x: s4, y: o3 }, this.emitter.emit("scroll", { deltaX: s4, deltaY: o3, event: t3 });
      }, this.onTouchEnd = (t3) => {
        this.emitter.emit("scroll", { deltaX: this.lastDelta.x, deltaY: this.lastDelta.y, event: t3 });
      }, this.onWheel = (t3) => {
        let { deltaX: e4, deltaY: s4 } = t3;
        this.normalizeWheel && (e4 = i(-100, e4, 100), s4 = i(-100, s4, 100)), e4 *= this.wheelMultiplier, s4 *= this.wheelMultiplier, this.emitter.emit("scroll", { deltaX: e4, deltaY: s4, event: t3 });
      }, this.element = t2, this.wheelMultiplier = e3, this.touchMultiplier = s3, this.normalizeWheel = n3, this.touchStart = { x: null, y: null }, this.emitter = new o(), this.element.addEventListener("wheel", this.onWheel, { passive: false }), this.element.addEventListener("touchstart", this.onTouchStart, { passive: false }), this.element.addEventListener("touchmove", this.onTouchMove, { passive: false }), this.element.addEventListener("touchend", this.onTouchEnd, { passive: false });
    }
    on(t2, i3) {
      return this.emitter.on(t2, i3);
    }
    destroy() {
      this.emitter.destroy(), this.element.removeEventListener("wheel", this.onWheel, { passive: false }), this.element.removeEventListener("touchstart", this.onTouchStart, { passive: false }), this.element.removeEventListener("touchmove", this.onTouchMove, { passive: false }), this.element.removeEventListener("touchend", this.onTouchEnd, { passive: false });
    }
  };
  var r = class {
    constructor({ wrapper: i3 = window, content: r3 = document.documentElement, wheelEventsTarget: l2 = i3, eventsTarget: h2 = l2, smoothWheel: a2 = true, smoothTouch: c2 = false, syncTouch: u = false, syncTouchLerp: p = 0.1, __iosNoInertiaSyncTouchLerp: d = 0.4, touchInertiaMultiplier: m = 35, duration: g, easing: v = (t2) => Math.min(1, 1.001 - Math.pow(2, -10 * t2)), lerp: S = !g && 0.1, infinite: w = false, orientation: f = "vertical", gestureOrientation: y = "vertical", touchMultiplier: T = 1, wheelMultiplier: z = 1, normalizeWheel: M = false, autoResize: L = true } = {}) {
      this.onVirtualScroll = ({ deltaX: i4, deltaY: e3, event: s3 }) => {
        if (s3.ctrlKey)
          return;
        const o3 = s3.type.includes("touch"), n3 = s3.type.includes("wheel");
        if ("both" === this.options.gestureOrientation && 0 === i4 && 0 === e3 || "vertical" === this.options.gestureOrientation && 0 === e3 || "horizontal" === this.options.gestureOrientation && 0 === i4 || o3 && "vertical" === this.options.gestureOrientation && 0 === this.scroll && !this.options.infinite && e3 <= 0)
          return;
        let r4 = s3.composedPath();
        if (r4 = r4.slice(0, r4.indexOf(this.rootElement)), r4.find((t2) => {
          var i5;
          return (null == t2.hasAttribute ? void 0 : t2.hasAttribute("data-lenis-prevent")) || o3 && (null == t2.hasAttribute ? void 0 : t2.hasAttribute("data-lenis-prevent-touch")) || n3 && (null == t2.hasAttribute ? void 0 : t2.hasAttribute("data-lenis-prevent-wheel")) || (null == (i5 = t2.classList) ? void 0 : i5.contains("lenis"));
        }))
          return;
        if (this.isStopped || this.isLocked)
          return void s3.preventDefault();
        if (this.isSmooth = (this.options.smoothTouch || this.options.syncTouch) && o3 || this.options.smoothWheel && n3, !this.isSmooth)
          return this.isScrolling = false, void this.animate.stop();
        s3.preventDefault();
        let l3 = e3;
        "both" === this.options.gestureOrientation ? l3 = Math.abs(e3) > Math.abs(i4) ? e3 : i4 : "horizontal" === this.options.gestureOrientation && (l3 = i4);
        const h3 = o3 && this.options.syncTouch, a3 = o3 && "touchend" === s3.type && Math.abs(l3) > 1;
        a3 && (l3 = this.velocity * this.options.touchInertiaMultiplier), this.scrollTo(this.targetScroll + l3, t({ programmatic: false }, h3 && { lerp: a3 ? this.syncTouchLerp : this.options.__iosNoInertiaSyncTouchLerp }));
      }, this.onScroll = () => {
        if (!this.isScrolling) {
          const t2 = this.animatedScroll;
          this.animatedScroll = this.targetScroll = this.actualScroll, this.velocity = 0, this.direction = Math.sign(this.animatedScroll - t2), this.emit();
        }
      }, window.lenisVersion = "1.0.27", i3 !== document.documentElement && i3 !== document.body || (i3 = window), this.options = { wrapper: i3, content: r3, wheelEventsTarget: l2, eventsTarget: h2, smoothWheel: a2, smoothTouch: c2, syncTouch: u, syncTouchLerp: p, __iosNoInertiaSyncTouchLerp: d, touchInertiaMultiplier: m, duration: g, easing: v, lerp: S, infinite: w, gestureOrientation: y, orientation: f, touchMultiplier: T, wheelMultiplier: z, normalizeWheel: M, autoResize: L }, this.animate = new e(), this.emitter = new o(), this.dimensions = new s({ wrapper: i3, content: r3, autoResize: L }), this.toggleClass("lenis", true), this.velocity = 0, this.isLocked = false, this.isStopped = false, this.isSmooth = u || a2 || c2, this.isScrolling = false, this.targetScroll = this.animatedScroll = this.actualScroll, this.options.wrapper.addEventListener("scroll", this.onScroll, { passive: false }), this.virtualScroll = new n(h2, { touchMultiplier: T, wheelMultiplier: z, normalizeWheel: M }), this.virtualScroll.on("scroll", this.onVirtualScroll);
    }
    destroy() {
      this.emitter.destroy(), this.options.wrapper.removeEventListener("scroll", this.onScroll, { passive: false }), this.virtualScroll.destroy(), this.dimensions.destroy(), this.toggleClass("lenis", false), this.toggleClass("lenis-smooth", false), this.toggleClass("lenis-scrolling", false), this.toggleClass("lenis-stopped", false), this.toggleClass("lenis-locked", false);
    }
    on(t2, i3) {
      return this.emitter.on(t2, i3);
    }
    off(t2, i3) {
      return this.emitter.off(t2, i3);
    }
    setScroll(t2) {
      this.isHorizontal ? this.rootElement.scrollLeft = t2 : this.rootElement.scrollTop = t2;
    }
    resize() {
      this.dimensions.resize();
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
      const i3 = t2 - (this.time || t2);
      this.time = t2, this.animate.advance(1e-3 * i3);
    }
    scrollTo(t2, { offset: e3 = 0, immediate: s3 = false, lock: o3 = false, duration: n3 = this.options.duration, easing: r3 = this.options.easing, lerp: l2 = !n3 && this.options.lerp, onComplete: h2 = null, force: a2 = false, programmatic: c2 = true } = {}) {
      if (!this.isStopped && !this.isLocked || a2) {
        if (["top", "left", "start"].includes(t2))
          t2 = 0;
        else if (["bottom", "right", "end"].includes(t2))
          t2 = this.limit;
        else {
          var u;
          let i3;
          if ("string" == typeof t2 ? i3 = document.querySelector(t2) : null != (u = t2) && u.nodeType && (i3 = t2), i3) {
            if (this.options.wrapper !== window) {
              const t3 = this.options.wrapper.getBoundingClientRect();
              e3 -= this.isHorizontal ? t3.left : t3.top;
            }
            const s4 = i3.getBoundingClientRect();
            t2 = (this.isHorizontal ? s4.left : s4.top) + this.animatedScroll;
          }
        }
        if ("number" == typeof t2) {
          if (t2 += e3, t2 = Math.round(t2), this.options.infinite ? c2 && (this.targetScroll = this.animatedScroll = this.scroll) : t2 = i(0, t2, this.limit), s3)
            return this.animatedScroll = this.targetScroll = t2, this.setScroll(this.scroll), this.reset(), void (null == h2 || h2(this));
          if (!c2) {
            if (t2 === this.targetScroll)
              return;
            this.targetScroll = t2;
          }
          this.animate.fromTo(this.animatedScroll, t2, { duration: n3, easing: r3, lerp: l2, onStart: () => {
            o3 && (this.isLocked = true), this.isScrolling = true;
          }, onUpdate: (t3, i3) => {
            this.isScrolling = true, this.velocity = t3 - this.animatedScroll, this.direction = Math.sign(this.velocity), this.animatedScroll = t3, this.setScroll(this.scroll), c2 && (this.targetScroll = t3), i3 || this.emit(), i3 && requestAnimationFrame(() => {
              this.reset(), this.emit(), null == h2 || h2(this);
            });
          } });
        }
      }
    }
    get rootElement() {
      return this.options.wrapper === window ? this.options.content : this.options.wrapper;
    }
    get limit() {
      return this.dimensions.limit[this.isHorizontal ? "x" : "y"];
    }
    get isHorizontal() {
      return "horizontal" === this.options.orientation;
    }
    get actualScroll() {
      return this.isHorizontal ? this.rootElement.scrollLeft : this.rootElement.scrollTop;
    }
    get scroll() {
      return this.options.infinite ? (this.animatedScroll % (t2 = this.limit) + t2) % t2 : this.animatedScroll;
      var t2;
    }
    get progress() {
      return 0 === this.limit ? 1 : this.scroll / this.limit;
    }
    get isSmooth() {
      return this.__isSmooth;
    }
    set isSmooth(t2) {
      this.__isSmooth !== t2 && (this.__isSmooth = t2, this.toggleClass("lenis-smooth", t2));
    }
    get isScrolling() {
      return this.__isScrolling;
    }
    set isScrolling(t2) {
      this.__isScrolling !== t2 && (this.__isScrolling = t2, this.toggleClass("lenis-scrolling", t2));
    }
    get isStopped() {
      return this.__isStopped;
    }
    set isStopped(t2) {
      this.__isStopped !== t2 && (this.__isStopped = t2, this.toggleClass("lenis-stopped", t2));
    }
    get isLocked() {
      return this.__isLocked;
    }
    set isLocked(t2) {
      this.__isLocked !== t2 && (this.__isLocked = t2, this.toggleClass("lenis-locked", t2));
    }
    get className() {
      let t2 = "lenis";
      return this.isStopped && (t2 += " lenis-stopped"), this.isLocked && (t2 += " lenis-locked"), this.isScrolling && (t2 += " lenis-scrolling"), this.isSmooth && (t2 += " lenis-smooth"), t2;
    }
    toggleClass(t2, i3) {
      this.rootElement.classList.toggle(t2, i3), this.emitter.emit("className change", this);
    }
  };

  // node_modules/locomotive-scroll/dist/locomotive-scroll.modern.mjs
  function s2() {
    return s2 = Object.assign ? Object.assign.bind() : function(t2) {
      for (var s3 = 1; s3 < arguments.length; s3++) {
        var e3 = arguments[s3];
        for (var i3 in e3)
          Object.prototype.hasOwnProperty.call(e3, i3) && (t2[i3] = e3[i3]);
      }
      return t2;
    }, s2.apply(this, arguments);
  }
  var e2 = class {
    constructor({ scrollElements: t2, rootMargin: s3 = "-1px -1px -1px -1px", IORaf: e3 }) {
      this.scrollElements = void 0, this.rootMargin = void 0, this.IORaf = void 0, this.observer = void 0, this.scrollElements = t2, this.rootMargin = s3, this.IORaf = e3, this._init();
    }
    _init() {
      this.observer = new IntersectionObserver((t2) => {
        t2.forEach((t3) => {
          const s3 = this.scrollElements.find((s4) => s4.$el === t3.target);
          t3.isIntersecting ? (s3 && (s3.isAlreadyIntersected = true), this._setInview(t3)) : s3 && s3.isAlreadyIntersected && this._setOutOfView(t3);
        });
      }, { rootMargin: this.rootMargin });
      for (const t2 of this.scrollElements)
        this.observe(t2.$el);
    }
    destroy() {
      this.observer.disconnect();
    }
    observe(t2) {
      t2 && this.observer.observe(t2);
    }
    unobserve(t2) {
      t2 && this.observer.unobserve(t2);
    }
    _setInview(t2) {
      const s3 = this.scrollElements.find((s4) => s4.$el === t2.target);
      this.IORaf && (null == s3 || s3.setInteractivityOn()), !this.IORaf && (null == s3 || s3.setInview());
    }
    _setOutOfView(t2) {
      const s3 = this.scrollElements.find((s4) => s4.$el === t2.target);
      this.IORaf && (null == s3 || s3.setInteractivityOff()), !this.IORaf && (null == s3 || s3.setOutOfView()), null != s3 && s3.attributes.scrollRepeat || this.IORaf || this.unobserve(t2.target);
    }
  };
  function i2(t2, s3, e3, i3, r3) {
    return e3 + ((r3 - t2) / (s3 - t2) * (i3 - e3) || 0);
  }
  function r2(t2, s3) {
    return t2.reduce((t3, e3) => Math.abs(e3 - s3) < Math.abs(t3 - s3) ? e3 : t3);
  }
  var l = class {
    constructor({ $el: t2, id: s3, modularInstance: e3, subscribeElementUpdateFn: i3, unsubscribeElementUpdateFn: r3, needRaf: l2, scrollOrientation: n3 }) {
      var o3, a2, c2, h2, d;
      this.$el = void 0, this.id = void 0, this.needRaf = void 0, this.attributes = void 0, this.scrollOrientation = void 0, this.isAlreadyIntersected = void 0, this.intersection = void 0, this.metrics = void 0, this.currentScroll = void 0, this.translateValue = void 0, this.progress = void 0, this.lastProgress = void 0, this.modularInstance = void 0, this.progressModularModules = void 0, this.isInview = void 0, this.isInteractive = void 0, this.isInFold = void 0, this.isFirstResize = void 0, this.subscribeElementUpdateFn = void 0, this.unsubscribeElementUpdateFn = void 0, this.$el = t2, this.id = s3, this.needRaf = l2, this.scrollOrientation = n3, this.modularInstance = e3, this.subscribeElementUpdateFn = i3, this.unsubscribeElementUpdateFn = r3, this.attributes = { scrollClass: null != (o3 = this.$el.dataset.scrollClass) ? o3 : "is-inview", scrollOffset: null != (a2 = this.$el.dataset.scrollOffset) ? a2 : "0,0", scrollPosition: null != (c2 = this.$el.dataset.scrollPosition) ? c2 : "start,end", scrollModuleProgress: null != this.$el.dataset.scrollModuleProgress, scrollCssProgress: null != this.$el.dataset.scrollCssProgress, scrollEventProgress: null != (h2 = this.$el.dataset.scrollEventProgress) ? h2 : null, scrollSpeed: null != this.$el.dataset.scrollSpeed ? parseFloat(this.$el.dataset.scrollSpeed) : null, scrollRepeat: null != this.$el.dataset.scrollRepeat, scrollCall: null != (d = this.$el.dataset.scrollCall) ? d : null, scrollCallSelf: null != this.$el.dataset.scrollCallSelf, scrollIgnoreFold: null != this.$el.dataset.scrollIgnoreFold, scrollEnableTouchSpeed: null != this.$el.dataset.scrollEnableTouchSpeed }, this.intersection = { start: 0, end: 0 }, this.metrics = { offsetStart: 0, offsetEnd: 0, bcr: {} }, this.currentScroll = "vertical" === this.scrollOrientation ? window.scrollY : window.scrollX, this.translateValue = 0, this.progress = 0, this.lastProgress = null, this.progressModularModules = [], this.isInview = false, this.isInteractive = false, this.isAlreadyIntersected = false, this.isInFold = false, this.isFirstResize = true, this._init();
    }
    _init() {
      this.needRaf && (this.modularInstance && this.attributes.scrollModuleProgress && this._getProgressModularModules(), this._resize());
    }
    onResize({ currentScroll: t2 }) {
      this.currentScroll = t2, this._resize();
    }
    onRender({ currentScroll: t2, smooth: s3 }) {
      const e3 = "vertical" === this.scrollOrientation ? window.innerHeight : window.innerWidth;
      if (this.currentScroll = t2, this._computeProgress(), this.attributes.scrollSpeed && !isNaN(this.attributes.scrollSpeed))
        if (this.attributes.scrollEnableTouchSpeed || s3) {
          if (this.isInFold) {
            const t3 = Math.max(0, this.progress);
            this.translateValue = t3 * e3 * this.attributes.scrollSpeed * -1;
          } else {
            const t3 = i2(0, 1, -1, 1, this.progress);
            this.translateValue = t3 * e3 * this.attributes.scrollSpeed * -1;
          }
          this.$el.style.transform = "vertical" === this.scrollOrientation ? `translate3d(0, ${this.translateValue}px, 0)` : `translate3d(${this.translateValue}px, 0, 0)`;
        } else
          this.translateValue && (this.$el.style.transform = "translate3d(0, 0, 0)"), this.translateValue = 0;
    }
    setInview() {
      if (this.isInview)
        return;
      this.isInview = true, this.$el.classList.add(this.attributes.scrollClass);
      const t2 = this._getScrollCallFrom();
      this.attributes.scrollCall && this._dispatchCall("enter", t2);
    }
    setOutOfView() {
      if (!this.isInview || !this.attributes.scrollRepeat)
        return;
      this.isInview = false, this.$el.classList.remove(this.attributes.scrollClass);
      const t2 = this._getScrollCallFrom();
      this.attributes.scrollCall && this._dispatchCall("leave", t2);
    }
    setInteractivityOn() {
      this.isInteractive || (this.isInteractive = true, this.subscribeElementUpdateFn(this));
    }
    setInteractivityOff() {
      this.isInteractive && (this.isInteractive = false, this.unsubscribeElementUpdateFn(this), null != this.lastProgress && this._computeProgress(r2([0, 1], this.lastProgress)));
    }
    _resize() {
      this.metrics.bcr = this.$el.getBoundingClientRect(), this._computeMetrics(), this._computeIntersection(), this.isFirstResize && (this.isFirstResize = false, this.isInFold && this.setInview());
    }
    _computeMetrics() {
      const { top: t2, left: s3, height: e3, width: i3 } = this.metrics.bcr, r3 = "vertical" === this.scrollOrientation ? window.innerHeight : window.innerWidth, l2 = "vertical" === this.scrollOrientation ? e3 : i3;
      this.metrics.offsetStart = this.currentScroll + ("vertical" === this.scrollOrientation ? t2 : s3) - this.translateValue, this.metrics.offsetEnd = this.metrics.offsetStart + l2, this.isInFold = this.metrics.offsetStart < r3 && !this.attributes.scrollIgnoreFold;
    }
    _computeIntersection() {
      const t2 = "vertical" === this.scrollOrientation ? window.innerHeight : window.innerWidth, s3 = "vertical" === this.scrollOrientation ? this.metrics.bcr.height : this.metrics.bcr.width, e3 = this.attributes.scrollOffset.split(","), i3 = null != e3[0] ? e3[0].trim() : "0", r3 = null != e3[1] ? e3[1].trim() : "0", l2 = this.attributes.scrollPosition.split(",");
      let n3 = null != l2[0] ? l2[0].trim() : "start";
      const o3 = null != l2[1] ? l2[1].trim() : "end", a2 = i3.includes("%") ? t2 * parseInt(i3.replace("%", "").trim()) * 0.01 : parseInt(i3), c2 = r3.includes("%") ? t2 * parseInt(r3.replace("%", "").trim()) * 0.01 : parseInt(r3);
      switch (this.isInFold && (n3 = "fold"), n3) {
        case "start":
        default:
          this.intersection.start = this.metrics.offsetStart - t2 + a2;
          break;
        case "middle":
          this.intersection.start = this.metrics.offsetStart - t2 + a2 + 0.5 * s3;
          break;
        case "end":
          this.intersection.start = this.metrics.offsetStart - t2 + a2 + s3;
          break;
        case "fold":
          this.intersection.start = 0;
      }
      switch (o3) {
        case "start":
          this.intersection.end = this.metrics.offsetStart - c2;
          break;
        case "middle":
          this.intersection.end = this.metrics.offsetStart - c2 + 0.5 * s3;
          break;
        default:
          this.intersection.end = this.metrics.offsetStart - c2 + s3;
      }
      if (this.intersection.end <= this.intersection.start)
        switch (o3) {
          case "start":
          default:
            this.intersection.end = this.intersection.start + 1;
            break;
          case "middle":
            this.intersection.end = this.intersection.start + 0.5 * s3;
            break;
          case "end":
            this.intersection.end = this.intersection.start + s3;
        }
    }
    _computeProgress(t2) {
      const s3 = null != t2 ? t2 : (e3 = i2(this.intersection.start, this.intersection.end, 0, 1, this.currentScroll)) < 0 ? 0 : e3 > 1 ? 1 : e3;
      var e3;
      if (this.progress = s3, s3 != this.lastProgress) {
        if (this.lastProgress = s3, this.attributes.scrollCssProgress && this._setCssProgress(s3), this.attributes.scrollEventProgress && this._setCustomEventProgress(s3), this.attributes.scrollModuleProgress)
          for (const t3 of this.progressModularModules)
            this.modularInstance && this.modularInstance.call("onScrollProgress", s3, t3.moduleName, t3.moduleId);
        s3 > 0 && s3 < 1 && this.setInview(), 0 === s3 && this.setOutOfView(), 1 === s3 && this.setOutOfView();
      }
    }
    _setCssProgress(t2 = 0) {
      this.$el.style.setProperty("--progress", t2.toString());
    }
    _setCustomEventProgress(t2 = 0) {
      const s3 = this.attributes.scrollEventProgress;
      if (!s3)
        return;
      const e3 = new CustomEvent(s3, { detail: { target: this.$el, progress: t2 } });
      window.dispatchEvent(e3);
    }
    _getProgressModularModules() {
      if (!this.modularInstance)
        return;
      const t2 = Object.keys(this.$el.dataset).filter((t3) => t3.includes("module")), s3 = Object.entries(this.modularInstance.modules);
      if (t2.length)
        for (const e3 of t2) {
          const t3 = this.$el.dataset[e3];
          if (!t3)
            return;
          for (const e4 of s3) {
            const [s4, i3] = e4;
            t3 in i3 && this.progressModularModules.push({ moduleName: s4, moduleId: t3 });
          }
        }
    }
    _getScrollCallFrom() {
      const t2 = r2([this.intersection.start, this.intersection.end], this.currentScroll);
      return this.intersection.start === t2 ? "start" : "end";
    }
    _dispatchCall(t2, s3) {
      var e3, i3;
      const r3 = null == (e3 = this.attributes.scrollCall) ? void 0 : e3.split(","), l2 = null == (i3 = this.attributes) ? void 0 : i3.scrollCallSelf;
      if (r3 && r3.length > 1) {
        var n3;
        const [e4, i4, o3] = r3;
        let a2;
        a2 = l2 ? this.$el.dataset[`module${i4.trim()}`] : o3, this.modularInstance && this.modularInstance.call(e4.trim(), { target: this.$el, way: t2, from: s3 }, i4.trim(), null == (n3 = a2) ? void 0 : n3.trim());
      } else if (r3) {
        const [e4] = r3, i4 = new CustomEvent(e4, { detail: { target: this.$el, way: t2, from: s3 } });
        window.dispatchEvent(i4);
      }
    }
  };
  var n2 = ["scrollOffset", "scrollPosition", "scrollModuleProgress", "scrollCssProgress", "scrollEventProgress", "scrollSpeed"];
  var o2 = class {
    constructor({ $el: t2, modularInstance: s3, triggerRootMargin: e3, rafRootMargin: i3, scrollOrientation: r3 }) {
      this.$scrollContainer = void 0, this.modularInstance = void 0, this.triggerRootMargin = void 0, this.rafRootMargin = void 0, this.scrollElements = void 0, this.triggeredScrollElements = void 0, this.RAFScrollElements = void 0, this.scrollElementsToUpdate = void 0, this.IOTriggerInstance = void 0, this.IORafInstance = void 0, this.scrollOrientation = void 0, t2 ? (this.$scrollContainer = t2, this.modularInstance = s3, this.scrollOrientation = r3, this.triggerRootMargin = null != e3 ? e3 : "-1px -1px -1px -1px", this.rafRootMargin = null != i3 ? i3 : "100% 100% 100% 100%", this.scrollElements = [], this.triggeredScrollElements = [], this.RAFScrollElements = [], this.scrollElementsToUpdate = [], this._init()) : console.error("Please provide a DOM Element as scrollContainer");
    }
    _init() {
      const t2 = this.$scrollContainer.querySelectorAll("[data-scroll]"), s3 = Array.from(t2);
      this._subscribeScrollElements(s3), this.IOTriggerInstance = new e2({ scrollElements: [...this.triggeredScrollElements], rootMargin: this.triggerRootMargin, IORaf: false }), this.IORafInstance = new e2({ scrollElements: [...this.RAFScrollElements], rootMargin: this.rafRootMargin, IORaf: true });
    }
    destroy() {
      this.IOTriggerInstance.destroy(), this.IORafInstance.destroy(), this._unsubscribeAllScrollElements();
    }
    onResize({ currentScroll: t2 }) {
      for (const s3 of this.RAFScrollElements)
        s3.onResize({ currentScroll: t2 });
    }
    onRender({ currentScroll: t2, smooth: s3 }) {
      for (const e3 of this.scrollElementsToUpdate)
        e3.onRender({ currentScroll: t2, smooth: s3 });
    }
    removeScrollElements(t2) {
      const s3 = t2.querySelectorAll("[data-scroll]");
      if (s3.length) {
        for (let t3 = 0; t3 < this.triggeredScrollElements.length; t3++) {
          const e3 = this.triggeredScrollElements[t3];
          Array.from(s3).indexOf(e3.$el) > -1 && (this.IOTriggerInstance.unobserve(e3.$el), this.triggeredScrollElements.splice(t3, 1));
        }
        for (let t3 = 0; t3 < this.RAFScrollElements.length; t3++) {
          const e3 = this.RAFScrollElements[t3];
          Array.from(s3).indexOf(e3.$el) > -1 && (this.IORafInstance.unobserve(e3.$el), this.RAFScrollElements.splice(t3, 1));
        }
        s3.forEach((t3) => {
          const s4 = this.scrollElementsToUpdate.find((s5) => s5.$el === t3), e3 = this.scrollElements.find((s5) => s5.$el === t3);
          s4 && this._unsubscribeElementUpdate(s4), e3 && (this.scrollElements = this.scrollElements.filter((t4) => t4.id != e3.id));
        });
      }
    }
    addScrollElements(t2) {
      const s3 = t2.querySelectorAll("[data-scroll]"), e3 = [];
      this.scrollElements.forEach((t3) => {
        e3.push(t3.id);
      });
      const i3 = Math.max(...e3) + 1, r3 = Array.from(s3);
      this._subscribeScrollElements(r3, i3, true);
    }
    _subscribeScrollElements(t2, s3 = 0, e3 = false) {
      for (let i3 = 0; i3 < t2.length; i3++) {
        const r3 = t2[i3], n3 = this._checkRafNeeded(r3), o3 = new l({ $el: r3, id: s3 + i3, scrollOrientation: this.scrollOrientation, modularInstance: this.modularInstance, subscribeElementUpdateFn: this._subscribeElementUpdate.bind(this), unsubscribeElementUpdateFn: this._unsubscribeElementUpdate.bind(this), needRaf: n3 });
        this.scrollElements.push(o3), n3 ? (this.RAFScrollElements.push(o3), e3 && (this.IORafInstance.scrollElements.push(o3), this.IORafInstance.observe(o3.$el))) : (this.triggeredScrollElements.push(o3), e3 && (this.IOTriggerInstance.scrollElements.push(o3), this.IOTriggerInstance.observe(o3.$el)));
      }
    }
    _unsubscribeAllScrollElements() {
      this.scrollElements = [], this.RAFScrollElements = [], this.triggeredScrollElements = [], this.scrollElementsToUpdate = [];
    }
    _subscribeElementUpdate(t2) {
      this.scrollElementsToUpdate.push(t2);
    }
    _unsubscribeElementUpdate(t2) {
      this.scrollElementsToUpdate = this.scrollElementsToUpdate.filter((s3) => s3.id != t2.id);
    }
    _checkRafNeeded(t2) {
      let s3 = [...n2];
      const e3 = (t3) => {
        s3 = s3.filter((s4) => s4 != t3);
      };
      if (t2.dataset.scrollOffset) {
        if ("0,0" != t2.dataset.scrollOffset.split(",").map((t3) => t3.replace("%", "").trim()).join(","))
          return true;
        e3("scrollOffset");
      } else
        e3("scrollOffset");
      if (t2.dataset.scrollPosition) {
        if ("top,bottom" != t2.dataset.scrollPosition.trim())
          return true;
        e3("scrollPosition");
      } else
        e3("scrollPosition");
      if (t2.dataset.scrollSpeed && !isNaN(parseFloat(t2.dataset.scrollSpeed)))
        return true;
      e3("scrollSpeed");
      for (const e4 of s3)
        if (e4 in t2.dataset)
          return true;
      return false;
    }
  };
  var a = class {
    constructor({ resizeElements: t2, resizeCallback: s3 = () => {
    } }) {
      this.$resizeElements = void 0, this.isFirstObserve = void 0, this.observer = void 0, this.resizeCallback = void 0, this.$resizeElements = t2, this.resizeCallback = s3, this.isFirstObserve = true, this._init();
    }
    _init() {
      this.observer = new ResizeObserver((t2) => {
        var s3;
        !this.isFirstObserve && (null == (s3 = this.resizeCallback) || s3.call(this)), this.isFirstObserve = false;
      });
      for (const t2 of this.$resizeElements)
        this.observer.observe(t2);
    }
    destroy() {
      this.observer.disconnect();
    }
  };
  var c = { wrapper: window, content: document.documentElement, eventsTarget: window, lerp: 0.1, duration: 0.75, orientation: "vertical", gestureOrientation: "vertical", smoothWheel: true, smoothTouch: false, syncTouch: false, syncTouchLerp: 0.1, touchInertiaMultiplier: 35, wheelMultiplier: 1, touchMultiplier: 2, normalizeWheel: false, autoResize: true, easing: (t2) => Math.min(1, 1.001 - Math.pow(2, -10 * t2)) };
  var h = class {
    constructor({ lenisOptions: t2 = {}, modularInstance: e3, triggerRootMargin: i3, rafRootMargin: r3, autoResize: l2 = true, autoStart: n3 = true, scrollCallback: o3 = () => {
    }, initCustomTicker: a2, destroyCustomTicker: h2 } = {}) {
      this.rafPlaying = void 0, this.lenisInstance = void 0, this.coreInstance = void 0, this.lenisOptions = void 0, this.modularInstance = void 0, this.triggerRootMargin = void 0, this.rafRootMargin = void 0, this.rafInstance = void 0, this.autoResize = void 0, this.autoStart = void 0, this.ROInstance = void 0, this.initCustomTicker = void 0, this.destroyCustomTicker = void 0, this._onRenderBind = void 0, this._onResizeBind = void 0, this._onScrollToBind = void 0, this.lenisOptions = s2({}, c, t2), Object.assign(this, { lenisOptions: t2, modularInstance: e3, triggerRootMargin: i3, rafRootMargin: r3, autoResize: l2, autoStart: n3, scrollCallback: o3, initCustomTicker: a2, destroyCustomTicker: h2 }), this._onRenderBind = this._onRender.bind(this), this._onScrollToBind = this._onScrollTo.bind(this), this._onResizeBind = this._onResize.bind(this), this.rafPlaying = false, this._init();
    }
    _init() {
      var s3;
      this.lenisInstance = new r({ wrapper: this.lenisOptions.wrapper, content: this.lenisOptions.content, eventsTarget: this.lenisOptions.eventsTarget, lerp: this.lenisOptions.lerp, duration: this.lenisOptions.duration, orientation: this.lenisOptions.orientation, gestureOrientation: this.lenisOptions.gestureOrientation, smoothWheel: this.lenisOptions.smoothWheel, smoothTouch: this.lenisOptions.smoothTouch, syncTouch: this.lenisOptions.syncTouch, syncTouchLerp: this.lenisOptions.syncTouchLerp, touchInertiaMultiplier: this.lenisOptions.touchInertiaMultiplier, wheelMultiplier: this.lenisOptions.wheelMultiplier, touchMultiplier: this.lenisOptions.touchMultiplier, normalizeWheel: this.lenisOptions.normalizeWheel, easing: this.lenisOptions.easing }), null == (s3 = this.lenisInstance) || s3.on("scroll", this.scrollCallback), document.documentElement.setAttribute("data-scroll-orientation", this.lenisInstance.options.orientation), requestAnimationFrame(() => {
        this.coreInstance = new o2({ $el: this.lenisInstance.rootElement, modularInstance: this.modularInstance, triggerRootMargin: this.triggerRootMargin, rafRootMargin: this.rafRootMargin, scrollOrientation: this.lenisInstance.options.orientation }), this._bindEvents(), this.initCustomTicker && !this.destroyCustomTicker ? console.warn("initCustomTicker callback is declared, but destroyCustomTicker is not. Please pay attention. It could cause trouble.") : !this.initCustomTicker && this.destroyCustomTicker && console.warn("destroyCustomTicker callback is declared, but initCustomTicker is not. Please pay attention. It could cause trouble."), this.autoStart && this.start();
      });
    }
    destroy() {
      this.stop(), this._unbindEvents(), this.lenisInstance.destroy(), this.coreInstance.destroy();
    }
    _bindEvents() {
      this._bindScrollToEvents(), this.autoResize && ("ResizeObserver" in window ? this.ROInstance = new a({ resizeElements: [document.body], resizeCallback: this._onResizeBind }) : window.addEventListener("resize", this._onResizeBind));
    }
    _unbindEvents() {
      this._unbindScrollToEvents(), this.autoResize && ("ResizeObserver" in window ? this.ROInstance && this.ROInstance.destroy() : window.removeEventListener("resize", this._onResizeBind));
    }
    _bindScrollToEvents(t2) {
      const s3 = t2 || this.lenisInstance.rootElement, e3 = null == s3 ? void 0 : s3.querySelectorAll("[data-scroll-to]");
      (null == e3 ? void 0 : e3.length) && e3.forEach((t3) => {
        t3.addEventListener("click", this._onScrollToBind, false);
      });
    }
    _unbindScrollToEvents(t2) {
      const s3 = t2 || this.lenisInstance.rootElement, e3 = null == s3 ? void 0 : s3.querySelectorAll("[data-scroll-to]");
      (null == e3 ? void 0 : e3.length) && e3.forEach((t3) => {
        t3.removeEventListener("click", this._onScrollToBind, false);
      });
    }
    _onResize() {
      requestAnimationFrame(() => {
        var t2;
        null == (t2 = this.coreInstance) || t2.onResize({ currentScroll: this.lenisInstance.scroll });
      });
    }
    _onRender() {
      var t2, s3;
      null == (t2 = this.lenisInstance) || t2.raf(Date.now()), null == (s3 = this.coreInstance) || s3.onRender({ currentScroll: this.lenisInstance.scroll, smooth: this.lenisInstance.isSmooth });
    }
    _onScrollTo(t2) {
      var s3;
      t2.preventDefault();
      const e3 = null != (s3 = t2.currentTarget) ? s3 : null;
      if (!e3)
        return;
      const i3 = e3.getAttribute("data-scroll-to-href") || e3.getAttribute("href"), r3 = e3.getAttribute("data-scroll-to-offset") || 0, l2 = e3.getAttribute("data-scroll-to-duration") || this.lenisOptions.duration || c.duration;
      i3 && this.scrollTo(i3, { offset: "string" == typeof r3 ? parseInt(r3) : r3, duration: "string" == typeof l2 ? parseInt(l2) : l2 });
    }
    start() {
      var t2;
      this.rafPlaying || (null == (t2 = this.lenisInstance) || t2.start(), this.rafPlaying = true, this.initCustomTicker ? this.initCustomTicker(this._onRenderBind) : this._raf());
    }
    stop() {
      var t2;
      this.rafPlaying && (null == (t2 = this.lenisInstance) || t2.stop(), this.rafPlaying = false, this.destroyCustomTicker ? this.destroyCustomTicker(this._onRenderBind) : this.rafInstance && cancelAnimationFrame(this.rafInstance));
    }
    removeScrollElements(t2) {
      var s3;
      t2 ? (this._unbindScrollToEvents(t2), null == (s3 = this.coreInstance) || s3.removeScrollElements(t2)) : console.error("Please provide a DOM Element as $oldContainer");
    }
    addScrollElements(t2) {
      var s3;
      t2 ? (null == (s3 = this.coreInstance) || s3.addScrollElements(t2), requestAnimationFrame(() => {
        this._bindScrollToEvents(t2);
      })) : console.error("Please provide a DOM Element as $newContainer");
    }
    resize() {
      this._onResizeBind();
    }
    scrollTo(t2, s3) {
      var e3;
      null == (e3 = this.lenisInstance) || e3.scrollTo(t2, { offset: null == s3 ? void 0 : s3.offset, lerp: null == s3 ? void 0 : s3.lerp, duration: null == s3 ? void 0 : s3.duration, immediate: null == s3 ? void 0 : s3.immediate, lock: null == s3 ? void 0 : s3.lock, force: null == s3 ? void 0 : s3.force, easing: null == s3 ? void 0 : s3.easing, onComplete: null == s3 ? void 0 : s3.onComplete });
    }
    _raf() {
      this._onRenderBind(), this.rafInstance = requestAnimationFrame(() => this._raf());
    }
  };

  // assets/scripts/modules/Scroll.js
  var Scroll_default = class extends _default {
    constructor(m) {
      super(m);
    }
    init() {
      this.scroll = new h({
        modularInstance: this
      });
    }
    /**
     * Lazy load the related image.
     *
     * @see ../utils/image.js
     *
     * It is recommended to wrap your `<img>` into an element with the
     * CSS class name `.c-lazy`. The CSS class name modifier `.-lazy-loaded`
     * will be applied on both the image and the parent wrapper.
     *
     * ```html
     * <div class="c-lazy o-ratio u-4:3">
     *     <img data-scroll data-scroll-call="lazyLoad, Scroll, main" data-src="http://picsum.photos/640/480?v=1" alt="" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" />
     * </div>
     * ```
     *
     * @param {LocomotiveScroll} args - The Locomotive Scroll instance.
     */
    lazyLoad(args) {
      lazyLoadImage(args.target, null, () => {
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
  window.addEventListener("load", (event) => {
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
  });
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
