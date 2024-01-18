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
  var __spreadValues = (a4, b3) => {
    for (var prop in b3 || (b3 = {}))
      if (__hasOwnProp.call(b3, prop))
        __defNormalProp(a4, prop, b3[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b3)) {
        if (__propIsEnum.call(b3, prop))
          __defNormalProp(a4, prop, b3[prop]);
      }
    return a4;
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
        } catch (e4) {
          reject(e4);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e4) {
          reject(e4);
        }
      };
      var step = (x2) => x2.done ? resolve(x2.value) : Promise.resolve(x2.value).then(fulfilled, rejected);
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
    for (var i5 = 0; i5 < columns; i5++) {
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
    document.addEventListener("keydown", (e4) => {
      if (e4.key == "Control") {
        ctrlDown = true;
      } else {
        if (ctrlDown && e4.key == "g") {
          if (isActive) {
            $container.style.visibility = "hidden";
          } else {
            $container.style.visibility = "visible";
          }
          isActive = !isActive;
        }
      }
    });
    document.addEventListener("keyup", (e4) => {
      if (e4.key == "Control") {
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
    for (var i5 = 0; i5 < props.length; i5++) {
      var descriptor = props[i5];
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
  function _slicedToArray(arr, i5) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i5) || _unsupportedIterableToArray(arr, i5) || _nonIterableRest();
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
  function _iterableToArrayLimit(arr, i5) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr)))
      return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = void 0;
    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);
        if (i5 && _arr.length === i5)
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
  function _unsupportedIterableToArray(o5, minLen) {
    if (!o5)
      return;
    if (typeof o5 === "string")
      return _arrayLikeToArray(o5, minLen);
    var n5 = Object.prototype.toString.call(o5).slice(8, -1);
    if (n5 === "Object" && o5.constructor)
      n5 = o5.constructor.name;
    if (n5 === "Map" || n5 === "Set")
      return Array.from(o5);
    if (n5 === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n5))
      return _arrayLikeToArray(o5, minLen);
  }
  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length)
      len = arr.length;
    for (var i5 = 0, arr2 = new Array(len); i5 < len; i5++)
      arr2[i5] = arr[i5];
    return arr2;
  }
  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  var _default = /* @__PURE__ */ function() {
    function _default2(options) {
      _classCallCheck(this, _default2);
      this.mAttr = "data-" + options.dataName;
      this.mCaptureEvents = ["mouseenter", "mouseleave"];
      this.el = options.el;
    }
    _createClass(_default2, [{
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
      value: function mCheckEventTarget(e4) {
        var event = this.events[e4.type];
        if (typeof event === "string") {
          this[event](e4);
        } else {
          var data = "[" + this.mAttr + "]";
          var target = e4.target;
          if (this.mCaptureEvents.includes(e4.type)) {
            if (target.matches(data)) {
              this.mCallEventMethod(e4, event, target);
            }
          } else {
            while (target && target !== document) {
              if (target.matches(data)) {
                if (this.mCallEventMethod(e4, event, target) != "undefined") {
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
      value: function mCallEventMethod(e4, event, target) {
        var name = target.getAttribute(this.mAttr);
        if (event.hasOwnProperty(name)) {
          var method = event[name];
          if (!e4.hasOwnProperty("currentTarget")) {
            Object.defineProperty(e4, "currentTarget", {
              value: target
            });
          }
          if (!e4.hasOwnProperty("curTarget")) {
            Object.defineProperty(e4, "curTarget", {
              value: target
            });
          }
          this[method](e4);
        }
      }
    }, {
      key: "$",
      value: function $3(query, context) {
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
      value: function on(e4, mod, func, id) {
        var _this4 = this;
        if (this.modules[mod]) {
          if (id) {
            this.modules[mod][id].el.addEventListener(e4, function(o5) {
              return func(o5);
            });
          } else {
            Object.keys(this.modules[mod]).forEach(function(i5) {
              _this4.modules[mod][i5].el.addEventListener(e4, function(o5) {
                return func(o5);
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
    return _default2;
  }();
  var _default$1 = /* @__PURE__ */ function() {
    function _default2(options) {
      _classCallCheck(this, _default2);
      this.app;
      this.modules = options.modules;
      this.currentModules = {};
      this.activeModules = {};
      this.newModules = {};
      this.moduleId = 0;
    }
    _createClass(_default2, [{
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
          Array.from(el.attributes).forEach(function(i5) {
            if (i5.name.startsWith("data-module")) {
              var moduleExists = false;
              var dataName = i5.name.split("-").splice(2);
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
                var id = i5.value;
                if (!id) {
                  _this.moduleId++;
                  id = "m" + _this.moduleId;
                  el.setAttribute(i5.name, id);
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
          Array.from(el.attributes).forEach(function(i5) {
            if (i5.name.startsWith("data-module")) {
              var id = i5.value;
              var dataName = i5.name.split("-").splice(2);
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
        return arr.reduce(function(a4, b3) {
          return a4 + _this5.toUpper(b3);
        });
      }
    }, {
      key: "toUpper",
      value: function toUpper(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
      }
    }]);
    return _default2;
  }();
  var main_esm_default = _default$1;

  // assets/scripts/modules.js
  var modules_exports = {};
  __export(modules_exports, {
    Dialog: () => Dialog_default,
    Load: () => Load_default,
    Scroll: () => Scroll_default
  });

  // assets/scripts/modules/Dialog.js
  var Dialog_default = class extends _default {
    constructor(m3) {
      super(m3);
      this.$closeBtn = this.$("close")[0];
    }
    init() {
      this.onKeyDown = this.onKeyDown.bind(this);
    }
    onKeyDown(e4) {
      if (e4.key === "Escape") {
        console.log("ESCAPE");
        e4.preventDefault();
        this.$closeBtn.click();
      }
    }
    populate(container) {
      this.el.appendChild(container);
    }
    show() {
      this.el.showModal();
      window.addEventListener("keydown", this.onKeyDown);
    }
    close() {
      window.removeEventListener("keydown", this.onKeyDown);
      this.el.close();
    }
  };

  // node_modules/delegate-it/delegate.js
  var ledger = /* @__PURE__ */ new WeakMap();
  function editLedger(wanted, baseElement, callback, setup) {
    var _a, _b;
    if (!wanted && !ledger.has(baseElement)) {
      return false;
    }
    const elementMap = (_a = ledger.get(baseElement)) != null ? _a : /* @__PURE__ */ new WeakMap();
    ledger.set(baseElement, elementMap);
    const setups = (_b = elementMap.get(callback)) != null ? _b : /* @__PURE__ */ new Set();
    elementMap.set(callback, setups);
    const existed = setups.has(setup);
    if (wanted) {
      setups.add(setup);
    } else {
      setups.delete(setup);
    }
    return existed && wanted;
  }
  function safeClosest(event, selector) {
    let target = event.target;
    if (target instanceof Text) {
      target = target.parentElement;
    }
    if (target instanceof Element && event.currentTarget instanceof Element) {
      const closest = target.closest(selector);
      if (closest && event.currentTarget.contains(closest)) {
        return closest;
      }
    }
  }
  function delegate(selector, type, callback, options = {}) {
    const { signal, base = document } = options;
    if (signal == null ? void 0 : signal.aborted) {
      return;
    }
    const _a = options, { once } = _a, nativeListenerOptions = __objRest(_a, ["once"]);
    const baseElement = base instanceof Document ? base.documentElement : base;
    const capture = Boolean(typeof options === "object" ? options.capture : options);
    const listenerFn = (event) => {
      const delegateTarget = safeClosest(event, selector);
      if (delegateTarget) {
        const delegateEvent = Object.assign(event, { delegateTarget });
        callback.call(baseElement, delegateEvent);
        if (once) {
          baseElement.removeEventListener(type, listenerFn, nativeListenerOptions);
          editLedger(false, baseElement, callback, setup);
        }
      }
    };
    const setup = JSON.stringify({ selector, type, capture });
    const isAlreadyListening = editLedger(true, baseElement, callback, setup);
    if (!isAlreadyListening) {
      baseElement.addEventListener(type, listenerFn, nativeListenerOptions);
    }
    signal == null ? void 0 : signal.addEventListener("abort", () => {
      editLedger(false, baseElement, callback, setup);
    });
  }
  var delegate_default = delegate;

  // node_modules/path-to-regexp/dist.es2015/index.js
  function lexer(str) {
    var tokens = [];
    var i5 = 0;
    while (i5 < str.length) {
      var char = str[i5];
      if (char === "*" || char === "+" || char === "?") {
        tokens.push({ type: "MODIFIER", index: i5, value: str[i5++] });
        continue;
      }
      if (char === "\\") {
        tokens.push({ type: "ESCAPED_CHAR", index: i5++, value: str[i5++] });
        continue;
      }
      if (char === "{") {
        tokens.push({ type: "OPEN", index: i5, value: str[i5++] });
        continue;
      }
      if (char === "}") {
        tokens.push({ type: "CLOSE", index: i5, value: str[i5++] });
        continue;
      }
      if (char === ":") {
        var name = "";
        var j2 = i5 + 1;
        while (j2 < str.length) {
          var code = str.charCodeAt(j2);
          if (
            // `0-9`
            code >= 48 && code <= 57 || // `A-Z`
            code >= 65 && code <= 90 || // `a-z`
            code >= 97 && code <= 122 || // `_`
            code === 95
          ) {
            name += str[j2++];
            continue;
          }
          break;
        }
        if (!name)
          throw new TypeError("Missing parameter name at ".concat(i5));
        tokens.push({ type: "NAME", index: i5, value: name });
        i5 = j2;
        continue;
      }
      if (char === "(") {
        var count = 1;
        var pattern = "";
        var j2 = i5 + 1;
        if (str[j2] === "?") {
          throw new TypeError('Pattern cannot start with "?" at '.concat(j2));
        }
        while (j2 < str.length) {
          if (str[j2] === "\\") {
            pattern += str[j2++] + str[j2++];
            continue;
          }
          if (str[j2] === ")") {
            count--;
            if (count === 0) {
              j2++;
              break;
            }
          } else if (str[j2] === "(") {
            count++;
            if (str[j2 + 1] !== "?") {
              throw new TypeError("Capturing groups are not allowed at ".concat(j2));
            }
          }
          pattern += str[j2++];
        }
        if (count)
          throw new TypeError("Unbalanced pattern at ".concat(i5));
        if (!pattern)
          throw new TypeError("Missing pattern at ".concat(i5));
        tokens.push({ type: "PATTERN", index: i5, value: pattern });
        i5 = j2;
        continue;
      }
      tokens.push({ type: "CHAR", index: i5, value: str[i5++] });
    }
    tokens.push({ type: "END", index: i5, value: "" });
    return tokens;
  }
  function parse(str, options) {
    if (options === void 0) {
      options = {};
    }
    var tokens = lexer(str);
    var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a;
    var defaultPattern = "[^".concat(escapeString(options.delimiter || "/#?"), "]+?");
    var result = [];
    var key = 0;
    var i5 = 0;
    var path = "";
    var tryConsume = function(type) {
      if (i5 < tokens.length && tokens[i5].type === type)
        return tokens[i5++].value;
    };
    var mustConsume = function(type) {
      var value2 = tryConsume(type);
      if (value2 !== void 0)
        return value2;
      var _a2 = tokens[i5], nextType = _a2.type, index = _a2.index;
      throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
    };
    var consumeText = function() {
      var result2 = "";
      var value2;
      while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
        result2 += value2;
      }
      return result2;
    };
    while (i5 < tokens.length) {
      var char = tryConsume("CHAR");
      var name = tryConsume("NAME");
      var pattern = tryConsume("PATTERN");
      if (name || pattern) {
        var prefix = char || "";
        if (prefixes.indexOf(prefix) === -1) {
          path += prefix;
          prefix = "";
        }
        if (path) {
          result.push(path);
          path = "";
        }
        result.push({
          name: name || key++,
          prefix,
          suffix: "",
          pattern: pattern || defaultPattern,
          modifier: tryConsume("MODIFIER") || ""
        });
        continue;
      }
      var value = char || tryConsume("ESCAPED_CHAR");
      if (value) {
        path += value;
        continue;
      }
      if (path) {
        result.push(path);
        path = "";
      }
      var open = tryConsume("OPEN");
      if (open) {
        var prefix = consumeText();
        var name_1 = tryConsume("NAME") || "";
        var pattern_1 = tryConsume("PATTERN") || "";
        var suffix = consumeText();
        mustConsume("CLOSE");
        result.push({
          name: name_1 || (pattern_1 ? key++ : ""),
          pattern: name_1 && !pattern_1 ? defaultPattern : pattern_1,
          prefix,
          suffix,
          modifier: tryConsume("MODIFIER") || ""
        });
        continue;
      }
      mustConsume("END");
    }
    return result;
  }
  function match(str, options) {
    var keys = [];
    var re = pathToRegexp(str, keys, options);
    return regexpToFunction(re, keys, options);
  }
  function regexpToFunction(re, keys, options) {
    if (options === void 0) {
      options = {};
    }
    var _a = options.decode, decode = _a === void 0 ? function(x2) {
      return x2;
    } : _a;
    return function(pathname) {
      var m3 = re.exec(pathname);
      if (!m3)
        return false;
      var path = m3[0], index = m3.index;
      var params = /* @__PURE__ */ Object.create(null);
      var _loop_1 = function(i6) {
        if (m3[i6] === void 0)
          return "continue";
        var key = keys[i6 - 1];
        if (key.modifier === "*" || key.modifier === "+") {
          params[key.name] = m3[i6].split(key.prefix + key.suffix).map(function(value) {
            return decode(value, key);
          });
        } else {
          params[key.name] = decode(m3[i6], key);
        }
      };
      for (var i5 = 1; i5 < m3.length; i5++) {
        _loop_1(i5);
      }
      return { path, index, params };
    };
  }
  function escapeString(str) {
    return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
  }
  function flags(options) {
    return options && options.sensitive ? "" : "i";
  }
  function regexpToRegexp(path, keys) {
    if (!keys)
      return path;
    var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
    var index = 0;
    var execResult = groupsRegex.exec(path.source);
    while (execResult) {
      keys.push({
        // Use parenthesized substring match if available, index otherwise
        name: execResult[1] || index++,
        prefix: "",
        suffix: "",
        modifier: "",
        pattern: ""
      });
      execResult = groupsRegex.exec(path.source);
    }
    return path;
  }
  function arrayToRegexp(paths, keys, options) {
    var parts = paths.map(function(path) {
      return pathToRegexp(path, keys, options).source;
    });
    return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
  }
  function stringToRegexp(path, keys, options) {
    return tokensToRegexp(parse(path, options), keys, options);
  }
  function tokensToRegexp(tokens, keys, options) {
    if (options === void 0) {
      options = {};
    }
    var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x2) {
      return x2;
    } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
    var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
    var delimiterRe = "[".concat(escapeString(delimiter), "]");
    var route = start ? "^" : "";
    for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
      var token = tokens_1[_i];
      if (typeof token === "string") {
        route += escapeString(encode(token));
      } else {
        var prefix = escapeString(encode(token.prefix));
        var suffix = escapeString(encode(token.suffix));
        if (token.pattern) {
          if (keys)
            keys.push(token);
          if (prefix || suffix) {
            if (token.modifier === "+" || token.modifier === "*") {
              var mod = token.modifier === "*" ? "?" : "";
              route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
            } else {
              route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
            }
          } else {
            if (token.modifier === "+" || token.modifier === "*") {
              route += "((?:".concat(token.pattern, ")").concat(token.modifier, ")");
            } else {
              route += "(".concat(token.pattern, ")").concat(token.modifier);
            }
          }
        } else {
          route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
        }
      }
    }
    if (end) {
      if (!strict)
        route += "".concat(delimiterRe, "?");
      route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
    } else {
      var endToken = tokens[tokens.length - 1];
      var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
      if (!strict) {
        route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
      }
      if (!isEndDelimited) {
        route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
      }
    }
    return new RegExp(route, flags(options));
  }
  function pathToRegexp(path, keys, options) {
    if (path instanceof RegExp)
      return regexpToRegexp(path, keys);
    if (Array.isArray(path))
      return arrayToRegexp(path, keys, options);
    return stringToRegexp(path, keys, options);
  }

  // node_modules/swup/dist/Swup.modern.js
  function i() {
    return i = Object.assign ? Object.assign.bind() : function(t2) {
      for (var e4 = 1; e4 < arguments.length; e4++) {
        var i5 = arguments[e4];
        for (var s5 in i5)
          Object.prototype.hasOwnProperty.call(i5, s5) && (t2[s5] = i5[s5]);
      }
      return t2;
    }, i.apply(this, arguments);
  }
  var s = (t2, e4) => String(t2).toLowerCase().replace(/[\s/_.]+/g, "-").replace(/[^\w-]+/g, "").replace(/--+/g, "-").replace(/^-+|-+$/g, "") || e4 || "";
  var n = ({ hash: t2 } = {}) => window.location.pathname + window.location.search + (t2 ? window.location.hash : "");
  var o = (t2, e4 = {}) => {
    const s5 = i({ url: t2 = t2 || n({ hash: true }), random: Math.random(), source: "swup" }, e4);
    window.history.pushState(s5, "", t2);
  };
  var r = (t2 = null, e4 = {}) => {
    t2 = t2 || n({ hash: true });
    const s5 = i({}, window.history.state || {}, { url: t2, random: Math.random(), source: "swup" }, e4);
    window.history.replaceState(s5, "", t2);
  };
  var a = (e4, s5, n5, o5) => {
    const r5 = new AbortController();
    return o5 = i({}, o5, { signal: r5.signal }), delegate_default(e4, s5, n5, o5), { destroy: () => r5.abort() };
  };
  var l = class extends URL {
    constructor(t2, e4 = document.baseURI) {
      super(t2.toString(), e4), Object.setPrototypeOf(this, l.prototype);
    }
    get url() {
      return this.pathname + this.search;
    }
    static fromElement(t2) {
      const e4 = t2.getAttribute("href") || t2.getAttribute("xlink:href") || "";
      return new l(e4);
    }
    static fromUrl(t2) {
      return new l(t2);
    }
  };
  var h = (t2, i5) => {
    try {
      return match(t2, i5);
    } catch (e4) {
      throw new Error(`[swup] Error parsing path "${String(t2)}":
${String(e4)}`);
    }
  };
  var c = class extends Error {
    constructor(t2, e4) {
      super(t2), this.url = void 0, this.status = void 0, this.aborted = void 0, this.timedOut = void 0, this.name = "FetchError", this.url = e4.url, this.status = e4.status, this.aborted = e4.aborted || false, this.timedOut = e4.timedOut || false;
    }
  };
  function u(_0) {
    return __async(this, arguments, function* (t2, e4 = {}) {
      var s5;
      t2 = l.fromUrl(t2).url;
      const { visit: n5 = this.visit } = e4, o5 = i({}, this.options.requestHeaders, e4.headers), r5 = null != (s5 = e4.timeout) ? s5 : this.options.timeout, a4 = new AbortController(), { signal: h4 } = a4;
      e4 = i({}, e4, { headers: o5, signal: h4 });
      let u3, d3 = false, p3 = null;
      r5 && r5 > 0 && (p3 = setTimeout(() => {
        d3 = true, a4.abort("timeout");
      }, r5));
      try {
        u3 = yield this.hooks.call("fetch:request", n5, { url: t2, options: e4 }, (t3, { url: e5, options: i5 }) => fetch(e5, i5)), p3 && clearTimeout(p3);
      } catch (e5) {
        if (d3)
          throw this.hooks.call("fetch:timeout", n5, { url: t2 }), new c(`Request timed out: ${t2}`, { url: t2, timedOut: d3 });
        if ("AbortError" === (null == e5 ? void 0 : e5.name) || h4.aborted)
          throw new c(`Request aborted: ${t2}`, { url: t2, aborted: true });
        throw e5;
      }
      const { status: m3, url: w3 } = u3, g3 = yield u3.text();
      if (500 === m3)
        throw this.hooks.call("fetch:error", n5, { status: m3, response: u3, url: w3 }), new c(`Server error: ${w3}`, { status: m3, url: w3 });
      if (!g3)
        throw new c(`Empty response: ${w3}`, { status: m3, url: w3 });
      const { url: f3 } = l.fromUrl(w3), v2 = { url: f3, html: g3 };
      return !n5.cache.write || e4.method && "GET" !== e4.method || t2 !== f3 || this.cache.set(v2.url, v2), v2;
    });
  }
  var d = class {
    constructor(t2) {
      this.swup = void 0, this.pages = /* @__PURE__ */ new Map(), this.swup = t2;
    }
    get size() {
      return this.pages.size;
    }
    get all() {
      const t2 = /* @__PURE__ */ new Map();
      return this.pages.forEach((e4, s5) => {
        t2.set(s5, i({}, e4));
      }), t2;
    }
    has(t2) {
      return this.pages.has(this.resolve(t2));
    }
    get(t2) {
      const e4 = this.pages.get(this.resolve(t2));
      return e4 ? i({}, e4) : e4;
    }
    set(t2, e4) {
      e4 = i({}, e4, { url: t2 = this.resolve(t2) }), this.pages.set(t2, e4), this.swup.hooks.callSync("cache:set", void 0, { page: e4 });
    }
    update(t2, e4) {
      t2 = this.resolve(t2);
      const s5 = i({}, this.get(t2), e4, { url: t2 });
      this.pages.set(t2, s5);
    }
    delete(t2) {
      this.pages.delete(this.resolve(t2));
    }
    clear() {
      this.pages.clear(), this.swup.hooks.callSync("cache:clear", void 0, void 0);
    }
    prune(t2) {
      this.pages.forEach((e4, i5) => {
        t2(i5, e4) && this.delete(i5);
      });
    }
    resolve(t2) {
      const { url: e4 } = l.fromUrl(t2);
      return this.swup.resolveUrl(e4);
    }
  };
  var p = (t2, e4 = document) => e4.querySelector(t2);
  var m = (t2, e4 = document) => Array.from(e4.querySelectorAll(t2));
  var w = () => new Promise((t2) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        t2();
      });
    });
  });
  function g(t2) {
    return !!t2 && ("object" == typeof t2 || "function" == typeof t2) && "function" == typeof t2.then;
  }
  function f(t2, e4 = []) {
    return new Promise((i5, s5) => {
      const n5 = t2(...e4);
      g(n5) ? n5.then(i5, s5) : i5(n5);
    });
  }
  var y = (t2) => window.CSS && window.CSS.escape ? CSS.escape(t2) : t2;
  var k = (t2) => 1e3 * Number(t2.slice(0, -1).replace(",", "."));
  var b = class {
    constructor(t2) {
      this.swup = void 0, this.swupClasses = ["to-", "is-changing", "is-rendering", "is-popstate", "is-animating", "is-leaving"], this.swup = t2;
    }
    get selectors() {
      const { scope: t2 } = this.swup.visit.animation;
      return "containers" === t2 ? this.swup.visit.containers : "html" === t2 ? ["html"] : Array.isArray(t2) ? t2 : [];
    }
    get selector() {
      return this.selectors.join(",");
    }
    get targets() {
      return this.selector.trim() ? m(this.selector) : [];
    }
    add(...t2) {
      this.targets.forEach((e4) => e4.classList.add(...t2));
    }
    remove(...t2) {
      this.targets.forEach((e4) => e4.classList.remove(...t2));
    }
    clear() {
      this.targets.forEach((t2) => {
        const e4 = t2.className.split(" ").filter((t3) => this.isSwupClass(t3));
        t2.classList.remove(...e4);
      });
    }
    isSwupClass(t2) {
      return this.swupClasses.some((e4) => t2.startsWith(e4));
    }
  };
  var S = class {
    constructor(t2, e4) {
      this.id = void 0, this.state = void 0, this.from = void 0, this.to = void 0, this.containers = void 0, this.animation = void 0, this.trigger = void 0, this.cache = void 0, this.history = void 0, this.scroll = void 0;
      const { to: i5, from: s5 = t2.currentPageUrl, hash: n5, el: o5, event: r5 } = e4;
      this.id = Math.random(), this.state = 1, this.from = { url: s5 }, this.to = { url: i5, hash: n5 }, this.containers = t2.options.containers, this.animation = { animate: true, wait: false, name: void 0, native: t2.options.native, scope: t2.options.animationScope, selector: t2.options.animationSelector }, this.trigger = { el: o5, event: r5 }, this.cache = { read: t2.options.cache, write: t2.options.cache }, this.history = { action: "push", popstate: false, direction: void 0 }, this.scroll = { reset: true, target: void 0 };
    }
    advance(t2) {
      this.state < t2 && (this.state = t2);
    }
    abort() {
      this.state = 8;
    }
    get done() {
      return this.state >= 7;
    }
  };
  function E(t2) {
    return new S(this, t2);
  }
  var P = class {
    constructor(t2) {
      this.swup = void 0, this.registry = /* @__PURE__ */ new Map(), this.hooks = ["animation:out:start", "animation:out:await", "animation:out:end", "animation:in:start", "animation:in:await", "animation:in:end", "animation:skip", "cache:clear", "cache:set", "content:replace", "content:scroll", "enable", "disable", "fetch:request", "fetch:error", "fetch:timeout", "history:popstate", "link:click", "link:self", "link:anchor", "link:newtab", "page:load", "page:view", "scroll:top", "scroll:anchor", "visit:start", "visit:transition", "visit:abort", "visit:end"], this.swup = t2, this.init();
    }
    init() {
      this.hooks.forEach((t2) => this.create(t2));
    }
    create(t2) {
      this.registry.has(t2) || this.registry.set(t2, /* @__PURE__ */ new Map());
    }
    exists(t2) {
      return this.registry.has(t2);
    }
    get(t2) {
      const e4 = this.registry.get(t2);
      if (e4)
        return e4;
      console.error(`Unknown hook '${t2}'`);
    }
    clear() {
      this.registry.forEach((t2) => t2.clear());
    }
    on(t2, e4, s5 = {}) {
      const n5 = this.get(t2);
      if (!n5)
        return console.warn(`Hook '${t2}' not found.`), () => {
        };
      const o5 = i({}, s5, { id: n5.size + 1, hook: t2, handler: e4 });
      return n5.set(e4, o5), () => this.off(t2, e4);
    }
    before(t2, e4, s5 = {}) {
      return this.on(t2, e4, i({}, s5, { before: true }));
    }
    replace(t2, e4, s5 = {}) {
      return this.on(t2, e4, i({}, s5, { replace: true }));
    }
    once(t2, e4, s5 = {}) {
      return this.on(t2, e4, i({}, s5, { once: true }));
    }
    off(t2, e4) {
      const i5 = this.get(t2);
      i5 && e4 ? i5.delete(e4) || console.warn(`Handler for hook '${t2}' not found.`) : i5 && i5.clear();
    }
    call(t2, e4, i5, s5) {
      return __async(this, null, function* () {
        const [n5, o5, r5] = this.parseCallArgs(t2, e4, i5, s5), { before: a4, handler: l4, after: h4 } = this.getHandlers(t2, r5);
        yield this.run(a4, n5, o5);
        const [c4] = yield this.run(l4, n5, o5, true);
        return yield this.run(h4, n5, o5), this.dispatchDomEvent(t2, n5, o5), c4;
      });
    }
    callSync(t2, e4, i5, s5) {
      const [n5, o5, r5] = this.parseCallArgs(t2, e4, i5, s5), { before: a4, handler: l4, after: h4 } = this.getHandlers(t2, r5);
      this.runSync(a4, n5, o5);
      const [c4] = this.runSync(l4, n5, o5, true);
      return this.runSync(h4, n5, o5), this.dispatchDomEvent(t2, n5, o5), c4;
    }
    parseCallArgs(t2, e4, i5, s5) {
      return e4 instanceof S || "object" != typeof e4 && "function" != typeof i5 ? [e4, i5, s5] : [void 0, e4, i5];
    }
    run(_0) {
      return __async(this, arguments, function* (t2, e4 = this.swup.visit, i5, s5 = false) {
        const n5 = [];
        for (const { hook: o5, handler: r5, defaultHandler: a4, once: l4 } of t2)
          if (null == e4 || !e4.done) {
            l4 && this.off(o5, r5);
            try {
              const t3 = yield f(r5, [e4, i5, a4]);
              n5.push(t3);
            } catch (t3) {
              if (s5)
                throw t3;
              console.error(`Error in hook '${o5}':`, t3);
            }
          }
        return n5;
      });
    }
    runSync(t2, e4 = this.swup.visit, i5, s5 = false) {
      const n5 = [];
      for (const { hook: o5, handler: r5, defaultHandler: a4, once: l4 } of t2)
        if (null == e4 || !e4.done) {
          l4 && this.off(o5, r5);
          try {
            const t3 = r5(e4, i5, a4);
            n5.push(t3), g(t3) && console.warn(`Swup will not await Promises in handler for synchronous hook '${o5}'.`);
          } catch (t3) {
            if (s5)
              throw t3;
            console.error(`Error in hook '${o5}':`, t3);
          }
        }
      return n5;
    }
    getHandlers(t2, e4) {
      const i5 = this.get(t2);
      if (!i5)
        return { found: false, before: [], handler: [], after: [], replaced: false };
      const s5 = Array.from(i5.values()), n5 = this.sortRegistrations, o5 = s5.filter(({ before: t3, replace: e5 }) => t3 && !e5).sort(n5), r5 = s5.filter(({ replace: t3 }) => t3).filter((t3) => true).sort(n5), a4 = s5.filter(({ before: t3, replace: e5 }) => !t3 && !e5).sort(n5), l4 = r5.length > 0;
      let h4 = [];
      if (e4 && (h4 = [{ id: 0, hook: t2, handler: e4 }], l4)) {
        const i6 = r5.length - 1, s6 = (t3) => {
          const i7 = r5[t3 - 1];
          return i7 ? (e5, n6) => i7.handler(e5, n6, s6(t3 - 1)) : e4;
        };
        h4 = [{ id: 0, hook: t2, handler: r5[i6].handler, defaultHandler: s6(i6) }];
      }
      return { found: true, before: o5, handler: h4, after: a4, replaced: l4 };
    }
    sortRegistrations(t2, e4) {
      var i5, s5;
      return (null != (i5 = t2.priority) ? i5 : 0) - (null != (s5 = e4.priority) ? s5 : 0) || t2.id - e4.id || 0;
    }
    dispatchDomEvent(t2, e4, i5) {
      if (null != e4 && e4.done)
        return;
      const s5 = { hook: t2, args: i5, visit: e4 || this.swup.visit };
      document.dispatchEvent(new CustomEvent("swup:any", { detail: s5, bubbles: true })), document.dispatchEvent(new CustomEvent(`swup:${t2}`, { detail: s5, bubbles: true }));
    }
  };
  var U = (t2) => {
    if (t2 && "#" === t2.charAt(0) && (t2 = t2.substring(1)), !t2)
      return null;
    const e4 = decodeURIComponent(t2);
    let i5 = document.getElementById(t2) || document.getElementById(e4) || p(`a[name='${y(t2)}']`) || p(`a[name='${y(e4)}']`);
    return i5 || "top" !== t2 || (i5 = document.body), i5;
  };
  var C = "transition";
  var $ = "animation";
  function x(_0) {
    return __async(this, arguments, function* ({ elements: t2, selector: e4 }) {
      if (false === e4 && !t2)
        return;
      let i5 = [];
      if (t2)
        i5 = Array.from(t2);
      else if (e4 && (i5 = m(e4, document.body), !i5.length))
        return void console.warn(`[swup] No elements found matching animationSelector \`${e4}\``);
      const s5 = i5.map((t3) => function(t4) {
        const { type: e5, timeout: i6, propCount: s6 } = function(t5, e6) {
          const i7 = window.getComputedStyle(t5), s7 = A(i7, `${C}Delay`), n5 = A(i7, `${C}Duration`), o5 = H(s7, n5), r5 = A(i7, `${$}Delay`), a4 = A(i7, `${$}Duration`), l4 = H(r5, a4);
          let h4 = null, c4 = 0, u3 = 0;
          return c4 = Math.max(o5, l4), h4 = c4 > 0 ? o5 > l4 ? C : $ : null, u3 = h4 ? h4 === C ? n5.length : a4.length : 0, { type: h4, timeout: c4, propCount: u3 };
        }(t4);
        return !(!e5 || !i6) && new Promise((n5) => {
          const o5 = `${e5}end`, r5 = performance.now();
          let a4 = 0;
          const l4 = () => {
            t4.removeEventListener(o5, h4), n5();
          }, h4 = (e6) => {
            if (e6.target === t4) {
              if (!function(t5) {
                return [`${C}end`, `${$}end`].includes(t5.type);
              }(e6))
                throw new Error("Not a transition or animation event.");
              (performance.now() - r5) / 1e3 < e6.elapsedTime || ++a4 >= s6 && l4();
            }
          };
          setTimeout(() => {
            a4 < s6 && l4();
          }, i6 + 1), t4.addEventListener(o5, h4);
        });
      }(t3));
      s5.filter(Boolean).length > 0 ? yield Promise.all(s5) : e4 && console.warn(`[swup] No CSS animation duration defined on elements matching \`${e4}\``);
    });
  }
  function A(t2, e4) {
    return (t2[e4] || "").split(", ");
  }
  function H(t2, e4) {
    for (; t2.length < e4.length; )
      t2 = t2.concat(t2);
    return Math.max(...e4.map((e5, i5) => k(e5) + k(t2[i5])));
  }
  function q(t2, e4 = {}, s5 = {}) {
    if ("string" != typeof t2)
      throw new Error("swup.navigate() requires a URL parameter");
    if (this.shouldIgnoreVisit(t2, { el: s5.el, event: s5.event }))
      return void window.location.assign(t2);
    const { url: n5, hash: o5 } = l.fromUrl(t2), r5 = this.createVisit(i({}, s5, { to: n5, hash: o5 }));
    this.performNavigation(r5, e4);
  }
  function V(_0) {
    return __async(this, arguments, function* (t2, e4 = {}) {
      if (this.navigating) {
        if (this.visit.state >= 6)
          return t2.state = 2, void (this.onVisitEnd = () => this.performNavigation(t2, e4));
        yield this.hooks.call("visit:abort", this.visit, void 0), this.visit.state = 8;
      }
      this.navigating = true, this.visit = t2;
      const { el: i5 } = t2.trigger;
      e4.referrer = e4.referrer || this.currentPageUrl, false === e4.animate && (t2.animation.animate = false), t2.animation.animate || this.classes.clear();
      const a4 = e4.history || (null == i5 ? void 0 : i5.getAttribute("data-swup-history")) || void 0;
      a4 && ["push", "replace"].includes(a4) && (t2.history.action = a4);
      const l4 = e4.animation || (null == i5 ? void 0 : i5.getAttribute("data-swup-animation")) || void 0;
      var h4, c4;
      l4 && (t2.animation.name = l4), "object" == typeof e4.cache ? (t2.cache.read = null != (h4 = e4.cache.read) ? h4 : t2.cache.read, t2.cache.write = null != (c4 = e4.cache.write) ? c4 : t2.cache.write) : void 0 !== e4.cache && (t2.cache = { read: !!e4.cache, write: !!e4.cache }), delete e4.cache;
      try {
        yield this.hooks.call("visit:start", t2, void 0), t2.state = 3;
        const i6 = this.hooks.call("page:load", t2, { options: e4 }, (t3, e5) => __async(this, null, function* () {
          let i7;
          return t3.cache.read && (i7 = this.cache.get(t3.to.url)), e5.page = i7 || (yield this.fetchPage(t3.to.url, e5.options)), e5.cache = !!i7, e5.page;
        }));
        if (i6.then(({ html: e5 }) => {
          t2.advance(5), t2.to.html = e5;
        }), !t2.history.popstate) {
          const e5 = t2.to.url + t2.to.hash;
          "replace" === t2.history.action || t2.to.url === this.currentPageUrl ? r(e5) : (this.currentHistoryIndex++, o(e5, { index: this.currentHistoryIndex }));
        }
        if (this.currentPageUrl = n(), t2.history.popstate && this.classes.add("is-popstate"), t2.animation.name && this.classes.add(`to-${s(t2.animation.name)}`), t2.animation.wait && (yield i6), t2.done)
          return;
        if (yield this.hooks.call("visit:transition", t2, void 0, () => __async(this, null, function* () {
          if (!t2.animation.animate)
            return yield this.hooks.call("animation:skip", void 0), void (yield this.renderPage(t2, yield i6));
          t2.advance(4), yield this.animatePageOut(t2), t2.animation.native && document.startViewTransition ? yield document.startViewTransition(() => __async(this, null, function* () {
            return yield this.renderPage(t2, yield i6);
          })).finished : yield this.renderPage(t2, yield i6), yield this.animatePageIn(t2);
        })), t2.done)
          return;
        yield this.hooks.call("visit:end", t2, void 0, () => this.classes.clear()), t2.state = 7, this.navigating = false, this.onVisitEnd && (this.onVisitEnd(), this.onVisitEnd = void 0);
      } catch (e5) {
        if (!e5 || null != e5 && e5.aborted)
          return void (t2.state = 8);
        t2.state = 9, console.error(e5), this.options.skipPopStateHandling = () => (window.location.assign(t2.to.url + t2.to.hash), true), window.history.back();
      }
    });
  }
  var I = function(t2) {
    return __async(this, null, function* () {
      yield this.hooks.call("animation:out:start", t2, void 0, () => {
        this.classes.add("is-changing", "is-animating", "is-leaving");
      }), yield this.hooks.call("animation:out:await", t2, { skip: false }, (t3, { skip: e4 }) => {
        if (!e4)
          return this.awaitAnimations({ selector: t3.animation.selector });
      }), yield this.hooks.call("animation:out:end", t2, void 0);
    });
  };
  var L = function({ html: t2 }, { containers: e4 } = this.options) {
    var i5;
    const s5 = new DOMParser().parseFromString(t2, "text/html"), n5 = (null == (i5 = s5.querySelector("title")) ? void 0 : i5.innerText) || "";
    document.title = n5;
    const o5 = m('[data-swup-persist]:not([data-swup-persist=""])'), r5 = e4.map((t3) => {
      const e5 = document.querySelector(t3), i6 = s5.querySelector(t3);
      return e5 && i6 ? (e5.replaceWith(i6), true) : (e5 || console.warn(`[swup] Container missing in current document: ${t3}`), i6 || console.warn(`[swup] Container missing in incoming document: ${t3}`), false);
    }).filter(Boolean);
    return o5.forEach((t3) => {
      const e5 = t3.getAttribute("data-swup-persist"), i6 = p(`[data-swup-persist="${e5}"]`);
      i6 && i6 !== t3 && i6.replaceWith(t3);
    }), r5.length === e4.length;
  };
  var R = function(t2) {
    const e4 = { behavior: "auto" }, { target: s5, reset: n5 } = t2.scroll, o5 = null != s5 ? s5 : t2.to.hash;
    let r5 = false;
    return o5 && (r5 = this.hooks.callSync("scroll:anchor", t2, { hash: o5, options: e4 }, (t3, { hash: e5, options: i5 }) => {
      const s6 = this.getAnchorElement(e5);
      return s6 && s6.scrollIntoView(i5), !!s6;
    })), n5 && !r5 && (r5 = this.hooks.callSync("scroll:top", t2, { options: e4 }, (t3, { options: e5 }) => (window.scrollTo(i({ top: 0, left: 0 }, e5)), true))), r5;
  };
  var T = function(t2) {
    return __async(this, null, function* () {
      if (t2.done)
        return;
      const e4 = this.hooks.call("animation:in:await", t2, { skip: false }, (t3, { skip: e5 }) => {
        if (!e5)
          return this.awaitAnimations({ selector: t3.animation.selector });
      });
      yield w(), yield this.hooks.call("animation:in:start", t2, void 0, () => {
        this.classes.remove("is-animating");
      }), yield e4, yield this.hooks.call("animation:in:end", t2, void 0);
    });
  };
  var N = function(t2, e4) {
    return __async(this, null, function* () {
      if (t2.done)
        return;
      t2.advance(6);
      const { url: i5 } = e4;
      this.isSameResolvedUrl(n(), i5) || (r(i5), this.currentPageUrl = n(), t2.to.url = this.currentPageUrl), yield this.hooks.call("content:replace", t2, { page: e4 }, (t3, { page: e5 }) => {
        if (this.classes.remove("is-leaving"), t3.animation.animate && this.classes.add("is-rendering"), !this.replaceContent(e5, { containers: t3.containers }))
          throw new Error("[swup] Container mismatch, aborting");
        t3.animation.animate && (this.classes.add("is-changing", "is-animating", "is-rendering"), t3.animation.name && this.classes.add(`to-${s(t3.animation.name)}`));
      }), yield this.hooks.call("content:scroll", t2, void 0, () => this.scrollToContent(t2)), yield this.hooks.call("page:view", t2, { url: this.currentPageUrl, title: document.title });
    });
  };
  var O = function(t2) {
    var e4;
    if (e4 = t2, Boolean(null == e4 ? void 0 : e4.isSwupPlugin)) {
      if (t2.swup = this, !t2._checkRequirements || t2._checkRequirements())
        return t2._beforeMount && t2._beforeMount(), t2.mount(), this.plugins.push(t2), this.plugins;
    } else
      console.error("Not a swup plugin instance", t2);
  };
  function D(t2) {
    const e4 = this.findPlugin(t2);
    if (e4)
      return e4.unmount(), e4._afterUnmount && e4._afterUnmount(), this.plugins = this.plugins.filter((t3) => t3 !== e4), this.plugins;
    console.error("No such plugin", e4);
  }
  function M(t2) {
    return this.plugins.find((e4) => e4 === t2 || e4.name === t2 || e4.name === `Swup${String(t2)}`);
  }
  function W(t2) {
    if ("function" != typeof this.options.resolveUrl)
      return console.warn("[swup] options.resolveUrl expects a callback function."), t2;
    const e4 = this.options.resolveUrl(t2);
    return e4 && "string" == typeof e4 ? e4.startsWith("//") || e4.startsWith("http") ? (console.warn("[swup] options.resolveUrl needs to return a relative url"), t2) : e4 : (console.warn("[swup] options.resolveUrl needs to return a url"), t2);
  }
  function j(t2, e4) {
    return this.resolveUrl(t2) === this.resolveUrl(e4);
  }
  var B = { animateHistoryBrowsing: false, animationSelector: '[class*="transition-"]', animationScope: "html", cache: true, containers: ["#swup"], ignoreVisit: (t2, { el: e4 } = {}) => !(null == e4 || !e4.closest("[data-no-swup]")), linkSelector: "a[href]", linkToSelf: "scroll", native: false, plugins: [], resolveUrl: (t2) => t2, requestHeaders: { "X-Requested-With": "swup", Accept: "text/html, application/xhtml+xml" }, skipPopStateHandling: (t2) => {
    var e4;
    return "swup" !== (null == (e4 = t2.state) ? void 0 : e4.source);
  }, timeout: 0 };
  var _ = class {
    constructor(t2 = {}) {
      var e4, s5;
      this.version = "4.5.1", this.options = void 0, this.defaults = B, this.plugins = [], this.visit = void 0, this.cache = void 0, this.hooks = void 0, this.classes = void 0, this.currentPageUrl = n(), this.currentHistoryIndex = void 0, this.clickDelegate = void 0, this.navigating = false, this.onVisitEnd = void 0, this.use = O, this.unuse = D, this.findPlugin = M, this.log = () => {
      }, this.navigate = q, this.performNavigation = V, this.createVisit = E, this.delegateEvent = a, this.fetchPage = u, this.awaitAnimations = x, this.renderPage = N, this.replaceContent = L, this.animatePageIn = T, this.animatePageOut = I, this.scrollToContent = R, this.getAnchorElement = U, this.getCurrentUrl = n, this.resolveUrl = W, this.isSameResolvedUrl = j, this.options = i({}, this.defaults, t2), this.handleLinkClick = this.handleLinkClick.bind(this), this.handlePopState = this.handlePopState.bind(this), this.cache = new d(this), this.classes = new b(this), this.hooks = new P(this), this.visit = this.createVisit({ to: "" }), this.currentHistoryIndex = null != (e4 = null == (s5 = window.history.state) ? void 0 : s5.index) ? e4 : 1, this.checkRequirements() && this.enable();
    }
    checkRequirements() {
      return "undefined" != typeof Promise || (console.warn("Promise is not supported"), false);
    }
    enable() {
      return __async(this, null, function* () {
        var t2;
        const { linkSelector: e4 } = this.options;
        this.clickDelegate = this.delegateEvent(e4, "click", this.handleLinkClick), window.addEventListener("popstate", this.handlePopState), this.options.animateHistoryBrowsing && (window.history.scrollRestoration = "manual"), this.options.native = this.options.native && !!document.startViewTransition, this.options.plugins.forEach((t3) => this.use(t3)), "swup" !== (null == (t2 = window.history.state) ? void 0 : t2.source) && r(null, { index: this.currentHistoryIndex }), yield w(), yield this.hooks.call("enable", void 0, void 0, () => {
          const t3 = document.documentElement;
          t3.classList.add("swup-enabled"), t3.classList.toggle("swup-native", this.options.native);
        });
      });
    }
    destroy() {
      return __async(this, null, function* () {
        this.clickDelegate.destroy(), window.removeEventListener("popstate", this.handlePopState), this.cache.clear(), this.options.plugins.forEach((t2) => this.unuse(t2)), yield this.hooks.call("disable", void 0, void 0, () => {
          const t2 = document.documentElement;
          t2.classList.remove("swup-enabled"), t2.classList.remove("swup-native");
        }), this.hooks.clear();
      });
    }
    shouldIgnoreVisit(t2, { el: e4, event: i5 } = {}) {
      const { origin: s5, url: n5, hash: o5 } = l.fromUrl(t2);
      return s5 !== window.location.origin || !(!e4 || !this.triggerWillOpenNewWindow(e4)) || !!this.options.ignoreVisit(n5 + o5, { el: e4, event: i5 });
    }
    handleLinkClick(t2) {
      const e4 = t2.delegateTarget, { href: i5, url: s5, hash: n5 } = l.fromElement(e4);
      if (this.shouldIgnoreVisit(i5, { el: e4, event: t2 }))
        return;
      if (this.navigating && s5 === this.visit.to.url)
        return void t2.preventDefault();
      const o5 = this.createVisit({ to: s5, hash: n5, el: e4, event: t2 });
      t2.metaKey || t2.ctrlKey || t2.shiftKey || t2.altKey ? this.hooks.callSync("link:newtab", o5, { href: i5 }) : 0 === t2.button && this.hooks.callSync("link:click", o5, { el: e4, event: t2 }, () => {
        var e5;
        const i6 = null != (e5 = o5.from.url) ? e5 : "";
        t2.preventDefault(), s5 && s5 !== i6 ? this.isSameResolvedUrl(s5, i6) || this.performNavigation(o5) : n5 ? this.hooks.callSync("link:anchor", o5, { hash: n5 }, () => {
          r(s5 + n5), this.scrollToContent(o5);
        }) : this.hooks.callSync("link:self", o5, void 0, () => {
          "navigate" === this.options.linkToSelf ? this.performNavigation(o5) : (r(s5), this.scrollToContent(o5));
        });
      });
    }
    handlePopState(t2) {
      var e4, i5, s5, o5;
      const r5 = null != (e4 = null == (i5 = t2.state) ? void 0 : i5.url) ? e4 : window.location.href;
      if (this.options.skipPopStateHandling(t2))
        return;
      if (this.isSameResolvedUrl(n(), this.currentPageUrl))
        return;
      const { url: a4, hash: h4 } = l.fromUrl(r5), c4 = this.createVisit({ to: a4, hash: h4, event: t2 });
      c4.history.popstate = true;
      const u3 = null != (s5 = null == (o5 = t2.state) ? void 0 : o5.index) ? s5 : 0;
      u3 && u3 !== this.currentHistoryIndex && (c4.history.direction = u3 - this.currentHistoryIndex > 0 ? "forwards" : "backwards", this.currentHistoryIndex = u3), c4.animation.animate = false, c4.scroll.reset = false, c4.scroll.target = false, this.options.animateHistoryBrowsing && (c4.animation.animate = true, c4.scroll.reset = true), this.hooks.callSync("history:popstate", c4, { event: t2 }, () => {
        this.performNavigation(c4);
      });
    }
    triggerWillOpenNewWindow(t2) {
      return !!t2.matches('[download], [target="_blank"]');
    }
  };

  // node_modules/@swup/plugin/dist/index.modern.js
  function r2() {
    return r2 = Object.assign ? Object.assign.bind() : function(r5) {
      for (var n5 = 1; n5 < arguments.length; n5++) {
        var e4 = arguments[n5];
        for (var t2 in e4)
          Object.prototype.hasOwnProperty.call(e4, t2) && (r5[t2] = e4[t2]);
      }
      return r5;
    }, r2.apply(this, arguments);
  }
  var n2 = (r5) => String(r5).split(".").map((r6) => String(parseInt(r6 || "0", 10))).concat(["0", "0"]).slice(0, 3).join(".");
  var e = class {
    constructor() {
      this.isSwupPlugin = true, this.swup = void 0, this.version = void 0, this.requires = {}, this.handlersToUnregister = [];
    }
    mount() {
    }
    unmount() {
      this.handlersToUnregister.forEach((r5) => r5()), this.handlersToUnregister = [];
    }
    _beforeMount() {
      if (!this.name)
        throw new Error("You must define a name of plugin when creating a class.");
    }
    _afterUnmount() {
    }
    _checkRequirements() {
      return "object" != typeof this.requires || Object.entries(this.requires).forEach(([r5, e4]) => {
        if (!function(r6, e5, t2) {
          const s5 = function(r7, n5) {
            var e6;
            if ("swup" === r7)
              return null != (e6 = n5.version) ? e6 : "";
            {
              var t3;
              const e7 = n5.findPlugin(r7);
              return null != (t3 = null == e7 ? void 0 : e7.version) ? t3 : "";
            }
          }(r6, t2);
          return !!s5 && ((r7, e6) => e6.every((e7) => {
            const [, t3, s6] = e7.match(/^([\D]+)?(.*)$/) || [];
            var o5, i5;
            return ((r8, n5) => {
              const e8 = { "": (r9) => 0 === r9, ">": (r9) => r9 > 0, ">=": (r9) => r9 >= 0, "<": (r9) => r9 < 0, "<=": (r9) => r9 <= 0 };
              return (e8[n5] || e8[""])(r8);
            })((i5 = s6, o5 = n2(o5 = r7), i5 = n2(i5), o5.localeCompare(i5, void 0, { numeric: true })), t3 || ">=");
          }))(s5, e5);
        }(r5, e4 = Array.isArray(e4) ? e4 : [e4], this.swup)) {
          const n5 = `${r5} ${e4.join(", ")}`;
          throw new Error(`Plugin version mismatch: ${this.name} requires ${n5}`);
        }
      }), true;
    }
    on(r5, n5, e4 = {}) {
      var t2;
      n5 = !(t2 = n5).name.startsWith("bound ") || t2.hasOwnProperty("prototype") ? n5.bind(this) : n5;
      const s5 = this.swup.hooks.on(r5, n5, e4);
      return this.handlersToUnregister.push(s5), s5;
    }
    once(n5, e4, t2 = {}) {
      return this.on(n5, e4, r2({}, t2, { once: true }));
    }
    before(n5, e4, t2 = {}) {
      return this.on(n5, e4, r2({}, t2, { before: true }));
    }
    replace(n5, e4, t2 = {}) {
      return this.on(n5, e4, r2({}, t2, { replace: true }));
    }
    off(r5, n5) {
      return this.swup.hooks.off(r5, n5);
    }
  };

  // node_modules/@swup/fragment-plugin/dist/index.modern.js
  function o2() {
    return o2 = Object.assign ? Object.assign.bind() : function(t2) {
      for (var r5 = 1; r5 < arguments.length; r5++) {
        var e4 = arguments[r5];
        for (var n5 in e4)
          Object.prototype.hasOwnProperty.call(e4, n5) && (t2[n5] = e4[n5]);
      }
      return t2;
    }, o2.apply(this, arguments);
  }
  window.process || (window.process = {}), window.process.env || (window.process.env = {});
  var s2 = ["test"].includes(String("development"));
  var i2 = ["development", "test"].includes(String("development"));
  var a2 = (t2, r5, e4) => null == t2 ? t2 : `\x1B[${r5}m${String(t2)}\x1B[${e4}m`;
  var l2 = (t2) => s2 ? t2 : `\u{1F9E9} ${((t3) => a2(t3, 1, 22))(t2)}`;
  var u2 = (t2) => s2 ? t2 : ((t3) => a2(t3, 94, 39))(t2);
  var c2 = class {
    log(...t2) {
      const r5 = t2.shift();
      console.log(l2(r5), ...t2);
    }
    warn(...t2) {
      const r5 = t2.shift();
      console.warn(l2(r5), ...t2);
    }
    error(...t2) {
      const r5 = t2.shift();
      console.error(l2(r5), ...t2);
    }
    logIf(t2, ...r5) {
      t2 && this.log(...r5);
    }
    warnIf(t2, ...r5) {
      t2 && this.warn(...r5);
    }
    errorIf(t2, ...r5) {
      t2 && this.error(...r5);
    }
  };
  var g2 = (t2) => {
    !function({ parsedRules: t3, swup: e4, logger: n5 }) {
      const o5 = e4.getCurrentUrl();
      t3.filter((t4) => t4.matchesFrom(o5) || t4.matchesTo(o5)).forEach((t4) => {
        t4.containers.forEach((t5) => {
          const s5 = y2(`${t5}:not([data-swup-fragment])`, e4);
          if (!s5)
            return;
          const a4 = s5.getAttribute("data-swup-fragment-url");
          a4 && i2 && (null == n5 || n5.log(`fragment url ${u2(a4)} for ${u2(t5)} provided by server`));
          const { url: l4 } = l.fromUrl(a4 || o5);
          s5.setAttribute("data-swup-fragment", ""), s5.__swupFragment = { url: l4, selector: t5 };
        });
      });
    }(t2), function({ logger: t3, swup: r5 }) {
      const e4 = "data-swup-link-to-fragment";
      document.querySelectorAll(`a[${e4}]`).forEach((n5) => {
        var o5;
        const s5 = n5.getAttribute(e4);
        if (!s5)
          return void (i2 && (null == t3 || t3.warn(`[${e4}] needs to contain a valid fragment selector`)));
        const a4 = y2(s5, r5);
        if (!a4)
          return void (i2 && (null == t3 || t3.log(`ignoring ${u2(`[${e4}="${s5}"]`)} as ${u2(s5)} is missing`)));
        const l4 = null == (o5 = a4.__swupFragment) ? void 0 : o5.url;
        l4 ? m2(l4, r5.getCurrentUrl()) ? i2 && (null == t3 || t3.warn(`The fragment URL of ${s5} is identical to the current URL. This could mean that [data-swup-fragment-url] needs to be provided by the server.`)) : n5.href = l4 : i2 && (null == t3 || t3.warn(`no fragment infos found on ${s5}`));
      });
    }(t2), function({ logger: t3 }) {
      document.querySelectorAll("dialog[data-swup-fragment]").forEach((r5) => {
        r5.__swupFragment ? r5.__swupFragment.modalShown || (r5.__swupFragment.modalShown = true, r5.removeAttribute("open"), null == r5.showModal || r5.showModal(), r5.addEventListener("keydown", (t4) => "Escape" === t4.key && t4.preventDefault())) : i2 && (null == t3 || t3.warn("fragment properties missing on element:", r5));
      });
    }(t2);
  };
  var f2 = (t2, r5) => {
    var e4;
    const n5 = null == (e4 = t2.__swupFragment) ? void 0 : e4.url;
    return !!n5 && m2(n5, r5);
  };
  var m2 = (t2, r5) => h2(t2) === h2(r5);
  var h2 = (t2) => {
    if (!t2.trim())
      return t2;
    const e4 = l.fromUrl(t2);
    return e4.searchParams.sort(), e4.pathname.replace(/\/+$/g, "") + e4.search;
  };
  var p2 = (t2) => {
    const r5 = t2.from.url, e4 = t2.to.url;
    if (r5 && e4)
      return { from: r5, to: e4 };
  };
  var d2 = (t2, r5) => {
    if (null == t2 || !t2.name)
      return;
    const { name: e4, containers: n5 } = t2;
    n5.forEach((t3) => {
      var n6;
      null == (n6 = document.querySelector(t3)) || n6.classList.toggle(`to-${e4}`, r5);
    });
  };
  var w2 = (t2, r5) => r5.find((r6) => r6.matches(t2));
  function v(t2) {
    return !!t2 && t2.containers.every((t3) => {
      var r5;
      return "template" === (null == (r5 = document.querySelector(t3)) || null == (r5 = r5.tagName) ? void 0 : r5.toLowerCase());
    });
  }
  function y2(t2, r5) {
    for (const e4 of r5.options.containers) {
      const r6 = document.querySelector(e4);
      if (null != r6 && r6.matches(t2))
        return r6;
      const n5 = null == r6 ? void 0 : r6.querySelector(t2);
      if (n5)
        return n5;
    }
  }
  function $2(t2) {
    if (!Array.isArray(t2))
      throw new Error("cloneRules() expects an array of rules");
    return t2.map((t3) => o2({}, t3, { from: Array.isArray(t3.from) ? [...t3.from] : t3.from, to: Array.isArray(t3.to) ? [...t3.to] : t3.to, containers: [...t3.containers] }));
  }
  var S2 = class {
    constructor(t2) {
      var r5, o5;
      this.matchesFrom = void 0, this.matchesTo = void 0, this.swup = void 0, this.from = void 0, this.to = void 0, this.containers = void 0, this.name = void 0, this.scroll = false, this.focus = void 0, this.logger = void 0, this.swup = t2.swup, this.logger = t2.logger, this.from = t2.from || "", this.to = t2.to || "", t2.name && (this.name = s(t2.name)), void 0 !== t2.scroll && (this.scroll = t2.scroll), void 0 !== t2.focus && (this.focus = t2.focus), this.containers = this.parseContainers(t2.containers), i2 && (null == (r5 = this.logger) || r5.errorIf(!this.to, "Every fragment rule must contain a 'to' path", this), null == (o5 = this.logger) || o5.errorIf(!this.from, "Every fragment rule must contain a 'from' path", this)), this.matchesFrom = h(this.from), this.matchesTo = h(this.to);
    }
    parseContainers(t2) {
      var r5, e4;
      return Array.isArray(t2) && t2.length ? (e4 = t2.map((t3) => t3.trim()), [...new Set(e4)]).filter((t3) => {
        var r6;
        const e5 = this.validateSelector(t3);
        return null == (r6 = this.logger) || r6.errorIf(e5 instanceof Error, e5), true === e5;
      }) : (i2 && (null == (r5 = this.logger) || r5.error("Every fragment rule must contain an array of containers", this.getDebugInfo())), []);
    }
    validateSelector(t2) {
      return t2.startsWith("#") ? !t2.match(/\s|>/) || new Error(`fragment selectors must not be nested: ${t2}`) : new Error(`fragment selectors must be IDs: ${t2}`);
    }
    getDebugInfo() {
      const { from: t2, to: r5, containers: e4 } = this;
      return { from: String(t2), to: String(r5), containers: String(e4) };
    }
    matches(t2) {
      const { url: e4 } = l.fromUrl(t2.from), { url: n5 } = l.fromUrl(t2.to);
      if (!this.matchesFrom(e4) || !this.matchesTo(n5))
        return false;
      for (const t3 of this.containers) {
        const r5 = this.validateFragmentSelectorForMatch(t3);
        var o5;
        if (r5 instanceof Error)
          return i2 && (null == (o5 = this.logger) || o5.error(r5, this.getDebugInfo())), false;
      }
      return true;
    }
    validateFragmentSelectorForMatch(t2) {
      return document.querySelector(t2) ? !!y2(t2, this.swup) || new Error(`skipping rule since ${u2(t2)} is outside of swup's default containers`) : new Error(`skipping rule since ${u2(t2)} doesn't exist in the current document`);
    }
  };
  var _2 = function(t2) {
    const r5 = p2(t2);
    r5 && w2(r5, this.parsedRules) && (t2.scroll.reset = false);
  };
  var b2 = function(t2) {
    return __async(this, null, function* () {
      const r5 = p2(t2);
      if (!r5)
        return;
      const e4 = this.getFragmentVisit(r5);
      if (!e4)
        return;
      var n5;
      t2.fragmentVisit = e4, i2 && (null == (n5 = this.logger) || n5.log(`fragment visit: ${u2(t2.fragmentVisit.containers.join(", "))}`)), t2.scroll = function(t3, r6) {
        return "boolean" == typeof t3.scroll ? o2({}, r6, { reset: t3.scroll }) : "string" != typeof t3.scroll || r6.target ? r6 : o2({}, r6, { target: t3.scroll });
      }(e4, t2.scroll);
      const s5 = t2.a11y;
      var a4;
      void 0 !== e4.focus && (i2 && (null == (a4 = this.logger) || a4.errorIf(!s5, "Can't set visit.a11y.focus. Is @swup/a11y-plugin installed?")), s5 && (s5.focus = e4.focus)), t2.animation.scope = t2.fragmentVisit.containers, t2.containers = t2.fragmentVisit.containers, t2.animation.selector = t2.fragmentVisit.containers.join(","), d2(e4, true);
    });
  };
  var R2 = function(t2, r5) {
    var e4, n5;
    t2.fragmentVisit && v(t2.fragmentVisit) && (i2 && (null == (e4 = this.logger) || e4.log(`${u2("out")}-animation skipped for ${u2(null == (n5 = t2.fragmentVisit) ? void 0 : n5.containers.toString())}`)), r5.skip = true);
  };
  var E2 = function(t2, r5) {
    var e4, n5;
    t2.fragmentVisit && v(t2.fragmentVisit) && (i2 && (null == (e4 = this.logger) || e4.log(`${u2("in")}-animation skipped for ${u2(null == (n5 = t2.fragmentVisit) ? void 0 : n5.containers.toString())}`)), r5.skip = true);
  };
  var F = function(t2, r5) {
    var e4;
    if (t2.trigger.el || !t2.to.url)
      return;
    const n5 = this.swup.cache.get(t2.to.url);
    n5 && n5.fragmentHtml && (r5.page.html = n5.fragmentHtml, i2 && (null == (e4 = this.logger) || e4.log(`fragment cache used for ${u2(t2.to.url)}`)));
  };
  var A2 = function(t2) {
    d2(t2.fragmentVisit, true), g2(this), (({ swup: t3, logger: r5 }) => {
      const e4 = t3.getCurrentUrl(), n5 = t3.cache, s5 = n5.get(e4);
      if (!s5)
        return;
      const a4 = new DOMParser().parseFromString(s5.html, "text/html"), l4 = [], c4 = Array.from(document.querySelectorAll("[data-swup-fragment]")).filter((t4) => !t4.matches("template") && !f2(t4, e4));
      c4.length && (t3.options.cache ? (c4.forEach((t4) => {
        var e5, o5;
        if (null != t4.querySelector("[data-swup-fragment]"))
          return;
        const s6 = null == (e5 = t4.__swupFragment) ? void 0 : e5.url;
        if (!s6)
          return void (i2 && (null == r5 || r5.warn("no fragment url found:", t4)));
        const u3 = null == (o5 = t4.__swupFragment) ? void 0 : o5.selector;
        if (!u3)
          return void (i2 && (null == r5 || r5.warn("no fragment selector found:", t4)));
        const c5 = n5.get(s6);
        if (!c5)
          return;
        const g3 = a4.querySelector(u3);
        if (!g3)
          return;
        const f3 = new DOMParser().parseFromString(c5.html, "text/html").querySelector(u3);
        f3 && (f3.setAttribute("data-swup-fragment-url", s6), g3.replaceWith(f3), l4.push(t4));
      }), l4.length && (n5.update(e4, o2({}, s5, { fragmentHtml: a4.documentElement.outerHTML })), l4.forEach((t4) => {
        var e5, n6;
        const o5 = (null == (e5 = t4.__swupFragment) ? void 0 : e5.url) || "", s6 = (null == (n6 = t4.__swupFragment) ? void 0 : n6.selector) || "";
        i2 && (null == r5 || r5.log(`updated cache with ${u2(s6)} from ${u2(o5)}`));
      }))) : i2 && (null == r5 || r5.warn("can't cache foreign fragment elements without swup's cache")));
    })(this);
  };
  var V2 = function(t2) {
    d2(t2.fragmentVisit, false);
  };
  var q2 = class extends e {
    get parsedRules() {
      return this._parsedRules;
    }
    constructor(t2) {
      super(), this.name = "SwupFragmentPlugin", this.requires = { swup: ">=4" }, this._rawRules = [], this._parsedRules = [], this.options = void 0, this.defaults = { rules: [], debug: false }, this.logger = void 0, this.options = o2({}, this.defaults, t2);
    }
    mount() {
      const t2 = this.swup;
      var r5;
      this.setRules(this.options.rules), i2 && this.options.debug && (this.logger = new c2()), this.before("link:self", _2), this.on("visit:start", b2), this.before("animation:out:await", R2), this.before("animation:in:await", E2), this.before("content:replace", F), this.on("content:replace", A2), this.on("visit:end", V2), i2 && (null == (r5 = this.logger) || r5.warnIf(!t2.options.cache, "fragment caching will only work with swup's cache being active")), g2(this);
    }
    unmount() {
      super.unmount(), document.querySelectorAll("[data-swup-fragment]").forEach((t2) => {
        t2.removeAttribute("data-swup-fragment-url"), delete t2.__swupFragment;
      });
    }
    setRules(t2) {
      var r5;
      this._rawRules = $2(t2), this._parsedRules = t2.map((t3) => this.parseRule(t3)), i2 && (null == (r5 = this.logger) || r5.log("Updated fragment rules", this.getRules()));
    }
    getRules() {
      return $2(this._rawRules);
    }
    prependRule(t2) {
      this.setRules([t2, ...this.getRules()]);
    }
    appendRule(t2) {
      this.setRules([...this.getRules(), t2]);
    }
    parseRule({ from: t2, to: r5, containers: e4, name: n5, scroll: o5, focus: s5 }) {
      return new S2({ from: t2, to: r5, containers: e4, name: n5, scroll: o5, focus: s5, logger: this.logger, swup: this.swup });
    }
    getFragmentVisit(t2) {
      const r5 = w2(t2, this.parsedRules);
      if (!r5)
        return;
      const e4 = ((t3, r6, e5, n6) => {
        const o6 = m2(t3.from, t3.to);
        return r6.filter((r7) => {
          const s6 = document.querySelector(r7);
          return s6 ? y2(r7, e5) ? !(!o6 && f2(s6, t3.to) && (i2 && (null == n6 || n6.log(`ignoring fragment ${u2(r7)} as it already matches the current URL`)), 1)) : (i2 && (null == n6 || n6.error(`${u2(r7)} is outside of swup's default containers`)), false) : (i2 && (null == n6 || n6.log(`${u2(r7)} missing in current document`)), false);
        });
      })(t2, r5.containers, this.swup, this.logger);
      if (!e4.length)
        return;
      const { name: n5, scroll: o5, focus: s5 } = r5;
      return { containers: e4, name: n5, scroll: o5, focus: s5 };
    }
  };

  // assets/scripts/modules/Load.js
  var Load_default = class extends _default {
    constructor(m3) {
      super(m3);
    }
    init() {
      const load = new _({
        containers: ["[data-load-container]"],
        // cache: false,
        plugins: [
          new q2({
            rules: [
              {
                from: ["/", "/index.php", "/index.php/per_page/:per_page/page/:page"],
                to: ["/", "/index.php", "/index.php/per_page/:per_page/page/:page"],
                containers: ["#paginated"]
              },
              {
                from: ["/", "/index.php", "/index.php/per_page/:per_page/page/:page"],
                to: ["/index.php/modal/:modal"],
                containers: ["#modal"],
                name: "open-modal"
              },
              {
                from: ["/index.php/modal/:modal"],
                to: ["/index.php/modal/:modal"],
                containers: ["#modal"],
                name: "modal-update"
              },
              {
                from: ["/index.php/modal/:modal"],
                to: ["/", "/index.php", "/index.php/per_page/:per_page/page/:page"],
                containers: ["#modal", "#paginated"],
                name: "close-modal"
              }
            ]
          })
        ]
      });
      load.hooks.before("content:replace", (visit) => __async(this, null, function* () {
        console.log("before content replace:", visit);
        for (let container of visit.containers) {
          const oldContainer = this.el.querySelector(container);
          console.log("old container: ", oldContainer);
          this.call("destroy", oldContainer, "app");
        }
      }));
      load.hooks.on("content:replace", (visit) => {
        console.log("On content replace:", visit);
        if (visit.fragmentVisit) {
          if (visit.fragmentVisit.name == "open-modal") {
            this.call("populate", document.getElementById("modal"), "Dialog");
            this.call("show", null, "Dialog");
          } else if (visit.fragmentVisit.name == "close-modal") {
            this.call("close", null, "Dialog");
          }
        }
        for (let container of visit.containers) {
          const newContainer = this.el.querySelector(container);
          console.log("new container: ", newContainer);
          newContainer.classList.add("transition-fade");
          this.call("update", newContainer, "app");
        }
      });
      console.log(this, load);
    }
  };

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
        $img.decode().then(loadCallback).catch((e4) => {
          reject(e4);
        });
      } else {
        $img.onload = loadCallback;
        $img.onerror = (e4) => {
          reject(e4);
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
      for (var i5 = 1; i5 < arguments.length; i5++) {
        var e4 = arguments[i5];
        for (var s5 in e4)
          Object.prototype.hasOwnProperty.call(e4, s5) && (t2[s5] = e4[s5]);
      }
      return t2;
    }, t.apply(this, arguments);
  }
  function i3(t2, i5, e4) {
    return Math.max(t2, Math.min(i5, e4));
  }
  var e2 = class {
    advance(t2) {
      var e4;
      if (!this.isRunning)
        return;
      let s5 = false;
      if (this.lerp)
        this.value = (o5 = this.value, n5 = this.to, (1 - (r5 = 1 - Math.exp(-60 * this.lerp * t2))) * o5 + r5 * n5), Math.round(this.value) === this.to && (this.value = this.to, s5 = true);
      else {
        this.currentTime += t2;
        const e5 = i3(0, this.currentTime / this.duration, 1);
        s5 = e5 >= 1;
        const o6 = s5 ? 1 : this.easing(e5);
        this.value = this.from + (this.to - this.from) * o6;
      }
      var o5, n5, r5;
      null == (e4 = this.onUpdate) || e4.call(this, this.value, s5), s5 && this.stop();
    }
    stop() {
      this.isRunning = false;
    }
    fromTo(t2, i5, { lerp: e4 = 0.1, duration: s5 = 1, easing: o5 = (t3) => t3, onStart: n5, onUpdate: r5 }) {
      this.from = this.value = t2, this.to = i5, this.lerp = e4, this.duration = s5, this.easing = o5, this.currentTime = 0, this.isRunning = true, null == n5 || n5(), this.onUpdate = r5;
    }
  };
  var s3 = class {
    constructor({ wrapper: t2, content: i5, autoResize: e4 = true } = {}) {
      if (this.resize = () => {
        this.onWrapperResize(), this.onContentResize();
      }, this.onWrapperResize = () => {
        this.wrapper === window ? (this.width = window.innerWidth, this.height = window.innerHeight) : (this.width = this.wrapper.clientWidth, this.height = this.wrapper.clientHeight);
      }, this.onContentResize = () => {
        this.scrollHeight = this.content.scrollHeight, this.scrollWidth = this.content.scrollWidth;
      }, this.wrapper = t2, this.content = i5, e4) {
        const t3 = function(t4, i6) {
          let e5;
          return function() {
            let i7 = arguments, s5 = this;
            clearTimeout(e5), e5 = setTimeout(function() {
              t4.apply(s5, i7);
            }, 250);
          };
        }(this.resize);
        this.wrapper !== window && (this.wrapperResizeObserver = new ResizeObserver(t3), this.wrapperResizeObserver.observe(this.wrapper)), this.contentResizeObserver = new ResizeObserver(t3), this.contentResizeObserver.observe(this.content);
      }
      this.resize();
    }
    destroy() {
      var t2, i5;
      null == (t2 = this.wrapperResizeObserver) || t2.disconnect(), null == (i5 = this.contentResizeObserver) || i5.disconnect();
    }
    get limit() {
      return { x: this.scrollWidth - this.width, y: this.scrollHeight - this.height };
    }
  };
  var o3 = class {
    constructor() {
      this.events = {};
    }
    emit(t2, ...i5) {
      let e4 = this.events[t2] || [];
      for (let t3 = 0, s5 = e4.length; t3 < s5; t3++)
        e4[t3](...i5);
    }
    on(t2, i5) {
      var e4;
      return (null == (e4 = this.events[t2]) ? void 0 : e4.push(i5)) || (this.events[t2] = [i5]), () => {
        var e5;
        this.events[t2] = null == (e5 = this.events[t2]) ? void 0 : e5.filter((t3) => i5 !== t3);
      };
    }
    off(t2, i5) {
      var e4;
      this.events[t2] = null == (e4 = this.events[t2]) ? void 0 : e4.filter((t3) => i5 !== t3);
    }
    destroy() {
      this.events = {};
    }
  };
  var n3 = class {
    constructor(t2, { wheelMultiplier: e4 = 1, touchMultiplier: s5 = 2, normalizeWheel: n5 = false }) {
      this.onTouchStart = (t3) => {
        const { clientX: i5, clientY: e5 } = t3.targetTouches ? t3.targetTouches[0] : t3;
        this.touchStart.x = i5, this.touchStart.y = e5, this.lastDelta = { x: 0, y: 0 };
      }, this.onTouchMove = (t3) => {
        const { clientX: i5, clientY: e5 } = t3.targetTouches ? t3.targetTouches[0] : t3, s6 = -(i5 - this.touchStart.x) * this.touchMultiplier, o5 = -(e5 - this.touchStart.y) * this.touchMultiplier;
        this.touchStart.x = i5, this.touchStart.y = e5, this.lastDelta = { x: s6, y: o5 }, this.emitter.emit("scroll", { deltaX: s6, deltaY: o5, event: t3 });
      }, this.onTouchEnd = (t3) => {
        this.emitter.emit("scroll", { deltaX: this.lastDelta.x, deltaY: this.lastDelta.y, event: t3 });
      }, this.onWheel = (t3) => {
        let { deltaX: e5, deltaY: s6 } = t3;
        this.normalizeWheel && (e5 = i3(-100, e5, 100), s6 = i3(-100, s6, 100)), e5 *= this.wheelMultiplier, s6 *= this.wheelMultiplier, this.emitter.emit("scroll", { deltaX: e5, deltaY: s6, event: t3 });
      }, this.element = t2, this.wheelMultiplier = e4, this.touchMultiplier = s5, this.normalizeWheel = n5, this.touchStart = { x: null, y: null }, this.emitter = new o3(), this.element.addEventListener("wheel", this.onWheel, { passive: false }), this.element.addEventListener("touchstart", this.onTouchStart, { passive: false }), this.element.addEventListener("touchmove", this.onTouchMove, { passive: false }), this.element.addEventListener("touchend", this.onTouchEnd, { passive: false });
    }
    on(t2, i5) {
      return this.emitter.on(t2, i5);
    }
    destroy() {
      this.emitter.destroy(), this.element.removeEventListener("wheel", this.onWheel, { passive: false }), this.element.removeEventListener("touchstart", this.onTouchStart, { passive: false }), this.element.removeEventListener("touchmove", this.onTouchMove, { passive: false }), this.element.removeEventListener("touchend", this.onTouchEnd, { passive: false });
    }
  };
  var r3 = class {
    constructor({ wrapper: i5 = window, content: r5 = document.documentElement, wheelEventsTarget: l4 = i5, eventsTarget: h4 = l4, smoothWheel: a4 = true, smoothTouch: c4 = false, syncTouch: u3 = false, syncTouchLerp: p3 = 0.1, __iosNoInertiaSyncTouchLerp: d3 = 0.4, touchInertiaMultiplier: m3 = 35, duration: g3, easing: v2 = (t2) => Math.min(1, 1.001 - Math.pow(2, -10 * t2)), lerp: S3 = !g3 && 0.1, infinite: w3 = false, orientation: f3 = "vertical", gestureOrientation: y3 = "vertical", touchMultiplier: T2 = 1, wheelMultiplier: z = 1, normalizeWheel: M2 = false, autoResize: L2 = true } = {}) {
      this.onVirtualScroll = ({ deltaX: i6, deltaY: e4, event: s5 }) => {
        if (s5.ctrlKey)
          return;
        const o5 = s5.type.includes("touch"), n5 = s5.type.includes("wheel");
        if ("both" === this.options.gestureOrientation && 0 === i6 && 0 === e4 || "vertical" === this.options.gestureOrientation && 0 === e4 || "horizontal" === this.options.gestureOrientation && 0 === i6 || o5 && "vertical" === this.options.gestureOrientation && 0 === this.scroll && !this.options.infinite && e4 <= 0)
          return;
        let r6 = s5.composedPath();
        if (r6 = r6.slice(0, r6.indexOf(this.rootElement)), r6.find((t2) => {
          var i7;
          return (null == t2.hasAttribute ? void 0 : t2.hasAttribute("data-lenis-prevent")) || o5 && (null == t2.hasAttribute ? void 0 : t2.hasAttribute("data-lenis-prevent-touch")) || n5 && (null == t2.hasAttribute ? void 0 : t2.hasAttribute("data-lenis-prevent-wheel")) || (null == (i7 = t2.classList) ? void 0 : i7.contains("lenis"));
        }))
          return;
        if (this.isStopped || this.isLocked)
          return void s5.preventDefault();
        if (this.isSmooth = (this.options.smoothTouch || this.options.syncTouch) && o5 || this.options.smoothWheel && n5, !this.isSmooth)
          return this.isScrolling = false, void this.animate.stop();
        s5.preventDefault();
        let l5 = e4;
        "both" === this.options.gestureOrientation ? l5 = Math.abs(e4) > Math.abs(i6) ? e4 : i6 : "horizontal" === this.options.gestureOrientation && (l5 = i6);
        const h5 = o5 && this.options.syncTouch, a5 = o5 && "touchend" === s5.type && Math.abs(l5) > 1;
        a5 && (l5 = this.velocity * this.options.touchInertiaMultiplier), this.scrollTo(this.targetScroll + l5, t({ programmatic: false }, h5 && { lerp: a5 ? this.syncTouchLerp : this.options.__iosNoInertiaSyncTouchLerp }));
      }, this.onScroll = () => {
        if (!this.isScrolling) {
          const t2 = this.animatedScroll;
          this.animatedScroll = this.targetScroll = this.actualScroll, this.velocity = 0, this.direction = Math.sign(this.animatedScroll - t2), this.emit();
        }
      }, window.lenisVersion = "1.0.27", i5 !== document.documentElement && i5 !== document.body || (i5 = window), this.options = { wrapper: i5, content: r5, wheelEventsTarget: l4, eventsTarget: h4, smoothWheel: a4, smoothTouch: c4, syncTouch: u3, syncTouchLerp: p3, __iosNoInertiaSyncTouchLerp: d3, touchInertiaMultiplier: m3, duration: g3, easing: v2, lerp: S3, infinite: w3, gestureOrientation: y3, orientation: f3, touchMultiplier: T2, wheelMultiplier: z, normalizeWheel: M2, autoResize: L2 }, this.animate = new e2(), this.emitter = new o3(), this.dimensions = new s3({ wrapper: i5, content: r5, autoResize: L2 }), this.toggleClass("lenis", true), this.velocity = 0, this.isLocked = false, this.isStopped = false, this.isSmooth = u3 || a4 || c4, this.isScrolling = false, this.targetScroll = this.animatedScroll = this.actualScroll, this.options.wrapper.addEventListener("scroll", this.onScroll, { passive: false }), this.virtualScroll = new n3(h4, { touchMultiplier: T2, wheelMultiplier: z, normalizeWheel: M2 }), this.virtualScroll.on("scroll", this.onVirtualScroll);
    }
    destroy() {
      this.emitter.destroy(), this.options.wrapper.removeEventListener("scroll", this.onScroll, { passive: false }), this.virtualScroll.destroy(), this.dimensions.destroy(), this.toggleClass("lenis", false), this.toggleClass("lenis-smooth", false), this.toggleClass("lenis-scrolling", false), this.toggleClass("lenis-stopped", false), this.toggleClass("lenis-locked", false);
    }
    on(t2, i5) {
      return this.emitter.on(t2, i5);
    }
    off(t2, i5) {
      return this.emitter.off(t2, i5);
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
      const i5 = t2 - (this.time || t2);
      this.time = t2, this.animate.advance(1e-3 * i5);
    }
    scrollTo(t2, { offset: e4 = 0, immediate: s5 = false, lock: o5 = false, duration: n5 = this.options.duration, easing: r5 = this.options.easing, lerp: l4 = !n5 && this.options.lerp, onComplete: h4 = null, force: a4 = false, programmatic: c4 = true } = {}) {
      if (!this.isStopped && !this.isLocked || a4) {
        if (["top", "left", "start"].includes(t2))
          t2 = 0;
        else if (["bottom", "right", "end"].includes(t2))
          t2 = this.limit;
        else {
          var u3;
          let i5;
          if ("string" == typeof t2 ? i5 = document.querySelector(t2) : null != (u3 = t2) && u3.nodeType && (i5 = t2), i5) {
            if (this.options.wrapper !== window) {
              const t3 = this.options.wrapper.getBoundingClientRect();
              e4 -= this.isHorizontal ? t3.left : t3.top;
            }
            const s6 = i5.getBoundingClientRect();
            t2 = (this.isHorizontal ? s6.left : s6.top) + this.animatedScroll;
          }
        }
        if ("number" == typeof t2) {
          if (t2 += e4, t2 = Math.round(t2), this.options.infinite ? c4 && (this.targetScroll = this.animatedScroll = this.scroll) : t2 = i3(0, t2, this.limit), s5)
            return this.animatedScroll = this.targetScroll = t2, this.setScroll(this.scroll), this.reset(), void (null == h4 || h4(this));
          if (!c4) {
            if (t2 === this.targetScroll)
              return;
            this.targetScroll = t2;
          }
          this.animate.fromTo(this.animatedScroll, t2, { duration: n5, easing: r5, lerp: l4, onStart: () => {
            o5 && (this.isLocked = true), this.isScrolling = true;
          }, onUpdate: (t3, i5) => {
            this.isScrolling = true, this.velocity = t3 - this.animatedScroll, this.direction = Math.sign(this.velocity), this.animatedScroll = t3, this.setScroll(this.scroll), c4 && (this.targetScroll = t3), i5 || this.emit(), i5 && requestAnimationFrame(() => {
              this.reset(), this.emit(), null == h4 || h4(this);
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
    toggleClass(t2, i5) {
      this.rootElement.classList.toggle(t2, i5), this.emitter.emit("className change", this);
    }
  };

  // node_modules/locomotive-scroll/dist/locomotive-scroll.modern.mjs
  function s4() {
    return s4 = Object.assign ? Object.assign.bind() : function(t2) {
      for (var s5 = 1; s5 < arguments.length; s5++) {
        var e4 = arguments[s5];
        for (var i5 in e4)
          Object.prototype.hasOwnProperty.call(e4, i5) && (t2[i5] = e4[i5]);
      }
      return t2;
    }, s4.apply(this, arguments);
  }
  var e3 = class {
    constructor({ scrollElements: t2, rootMargin: s5 = "-1px -1px -1px -1px", IORaf: e4 }) {
      this.scrollElements = void 0, this.rootMargin = void 0, this.IORaf = void 0, this.observer = void 0, this.scrollElements = t2, this.rootMargin = s5, this.IORaf = e4, this._init();
    }
    _init() {
      this.observer = new IntersectionObserver((t2) => {
        t2.forEach((t3) => {
          const s5 = this.scrollElements.find((s6) => s6.$el === t3.target);
          t3.isIntersecting ? (s5 && (s5.isAlreadyIntersected = true), this._setInview(t3)) : s5 && s5.isAlreadyIntersected && this._setOutOfView(t3);
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
      const s5 = this.scrollElements.find((s6) => s6.$el === t2.target);
      this.IORaf && (null == s5 || s5.setInteractivityOn()), !this.IORaf && (null == s5 || s5.setInview());
    }
    _setOutOfView(t2) {
      const s5 = this.scrollElements.find((s6) => s6.$el === t2.target);
      this.IORaf && (null == s5 || s5.setInteractivityOff()), !this.IORaf && (null == s5 || s5.setOutOfView()), null != s5 && s5.attributes.scrollRepeat || this.IORaf || this.unobserve(t2.target);
    }
  };
  function i4(t2, s5, e4, i5, r5) {
    return e4 + ((r5 - t2) / (s5 - t2) * (i5 - e4) || 0);
  }
  function r4(t2, s5) {
    return t2.reduce((t3, e4) => Math.abs(e4 - s5) < Math.abs(t3 - s5) ? e4 : t3);
  }
  var l3 = class {
    constructor({ $el: t2, id: s5, modularInstance: e4, subscribeElementUpdateFn: i5, unsubscribeElementUpdateFn: r5, needRaf: l4, scrollOrientation: n5 }) {
      var o5, a4, c4, h4, d3;
      this.$el = void 0, this.id = void 0, this.needRaf = void 0, this.attributes = void 0, this.scrollOrientation = void 0, this.isAlreadyIntersected = void 0, this.intersection = void 0, this.metrics = void 0, this.currentScroll = void 0, this.translateValue = void 0, this.progress = void 0, this.lastProgress = void 0, this.modularInstance = void 0, this.progressModularModules = void 0, this.isInview = void 0, this.isInteractive = void 0, this.isInFold = void 0, this.isFirstResize = void 0, this.subscribeElementUpdateFn = void 0, this.unsubscribeElementUpdateFn = void 0, this.$el = t2, this.id = s5, this.needRaf = l4, this.scrollOrientation = n5, this.modularInstance = e4, this.subscribeElementUpdateFn = i5, this.unsubscribeElementUpdateFn = r5, this.attributes = { scrollClass: null != (o5 = this.$el.dataset.scrollClass) ? o5 : "is-inview", scrollOffset: null != (a4 = this.$el.dataset.scrollOffset) ? a4 : "0,0", scrollPosition: null != (c4 = this.$el.dataset.scrollPosition) ? c4 : "start,end", scrollModuleProgress: null != this.$el.dataset.scrollModuleProgress, scrollCssProgress: null != this.$el.dataset.scrollCssProgress, scrollEventProgress: null != (h4 = this.$el.dataset.scrollEventProgress) ? h4 : null, scrollSpeed: null != this.$el.dataset.scrollSpeed ? parseFloat(this.$el.dataset.scrollSpeed) : null, scrollRepeat: null != this.$el.dataset.scrollRepeat, scrollCall: null != (d3 = this.$el.dataset.scrollCall) ? d3 : null, scrollCallSelf: null != this.$el.dataset.scrollCallSelf, scrollIgnoreFold: null != this.$el.dataset.scrollIgnoreFold, scrollEnableTouchSpeed: null != this.$el.dataset.scrollEnableTouchSpeed }, this.intersection = { start: 0, end: 0 }, this.metrics = { offsetStart: 0, offsetEnd: 0, bcr: {} }, this.currentScroll = "vertical" === this.scrollOrientation ? window.scrollY : window.scrollX, this.translateValue = 0, this.progress = 0, this.lastProgress = null, this.progressModularModules = [], this.isInview = false, this.isInteractive = false, this.isAlreadyIntersected = false, this.isInFold = false, this.isFirstResize = true, this._init();
    }
    _init() {
      this.needRaf && (this.modularInstance && this.attributes.scrollModuleProgress && this._getProgressModularModules(), this._resize());
    }
    onResize({ currentScroll: t2 }) {
      this.currentScroll = t2, this._resize();
    }
    onRender({ currentScroll: t2, smooth: s5 }) {
      const e4 = "vertical" === this.scrollOrientation ? window.innerHeight : window.innerWidth;
      if (this.currentScroll = t2, this._computeProgress(), this.attributes.scrollSpeed && !isNaN(this.attributes.scrollSpeed))
        if (this.attributes.scrollEnableTouchSpeed || s5) {
          if (this.isInFold) {
            const t3 = Math.max(0, this.progress);
            this.translateValue = t3 * e4 * this.attributes.scrollSpeed * -1;
          } else {
            const t3 = i4(0, 1, -1, 1, this.progress);
            this.translateValue = t3 * e4 * this.attributes.scrollSpeed * -1;
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
      this.isInteractive && (this.isInteractive = false, this.unsubscribeElementUpdateFn(this), null != this.lastProgress && this._computeProgress(r4([0, 1], this.lastProgress)));
    }
    _resize() {
      this.metrics.bcr = this.$el.getBoundingClientRect(), this._computeMetrics(), this._computeIntersection(), this.isFirstResize && (this.isFirstResize = false, this.isInFold && this.setInview());
    }
    _computeMetrics() {
      const { top: t2, left: s5, height: e4, width: i5 } = this.metrics.bcr, r5 = "vertical" === this.scrollOrientation ? window.innerHeight : window.innerWidth, l4 = "vertical" === this.scrollOrientation ? e4 : i5;
      this.metrics.offsetStart = this.currentScroll + ("vertical" === this.scrollOrientation ? t2 : s5) - this.translateValue, this.metrics.offsetEnd = this.metrics.offsetStart + l4, this.isInFold = this.metrics.offsetStart < r5 && !this.attributes.scrollIgnoreFold;
    }
    _computeIntersection() {
      const t2 = "vertical" === this.scrollOrientation ? window.innerHeight : window.innerWidth, s5 = "vertical" === this.scrollOrientation ? this.metrics.bcr.height : this.metrics.bcr.width, e4 = this.attributes.scrollOffset.split(","), i5 = null != e4[0] ? e4[0].trim() : "0", r5 = null != e4[1] ? e4[1].trim() : "0", l4 = this.attributes.scrollPosition.split(",");
      let n5 = null != l4[0] ? l4[0].trim() : "start";
      const o5 = null != l4[1] ? l4[1].trim() : "end", a4 = i5.includes("%") ? t2 * parseInt(i5.replace("%", "").trim()) * 0.01 : parseInt(i5), c4 = r5.includes("%") ? t2 * parseInt(r5.replace("%", "").trim()) * 0.01 : parseInt(r5);
      switch (this.isInFold && (n5 = "fold"), n5) {
        case "start":
        default:
          this.intersection.start = this.metrics.offsetStart - t2 + a4;
          break;
        case "middle":
          this.intersection.start = this.metrics.offsetStart - t2 + a4 + 0.5 * s5;
          break;
        case "end":
          this.intersection.start = this.metrics.offsetStart - t2 + a4 + s5;
          break;
        case "fold":
          this.intersection.start = 0;
      }
      switch (o5) {
        case "start":
          this.intersection.end = this.metrics.offsetStart - c4;
          break;
        case "middle":
          this.intersection.end = this.metrics.offsetStart - c4 + 0.5 * s5;
          break;
        default:
          this.intersection.end = this.metrics.offsetStart - c4 + s5;
      }
      if (this.intersection.end <= this.intersection.start)
        switch (o5) {
          case "start":
          default:
            this.intersection.end = this.intersection.start + 1;
            break;
          case "middle":
            this.intersection.end = this.intersection.start + 0.5 * s5;
            break;
          case "end":
            this.intersection.end = this.intersection.start + s5;
        }
    }
    _computeProgress(t2) {
      const s5 = null != t2 ? t2 : (e4 = i4(this.intersection.start, this.intersection.end, 0, 1, this.currentScroll)) < 0 ? 0 : e4 > 1 ? 1 : e4;
      var e4;
      if (this.progress = s5, s5 != this.lastProgress) {
        if (this.lastProgress = s5, this.attributes.scrollCssProgress && this._setCssProgress(s5), this.attributes.scrollEventProgress && this._setCustomEventProgress(s5), this.attributes.scrollModuleProgress)
          for (const t3 of this.progressModularModules)
            this.modularInstance && this.modularInstance.call("onScrollProgress", s5, t3.moduleName, t3.moduleId);
        s5 > 0 && s5 < 1 && this.setInview(), 0 === s5 && this.setOutOfView(), 1 === s5 && this.setOutOfView();
      }
    }
    _setCssProgress(t2 = 0) {
      this.$el.style.setProperty("--progress", t2.toString());
    }
    _setCustomEventProgress(t2 = 0) {
      const s5 = this.attributes.scrollEventProgress;
      if (!s5)
        return;
      const e4 = new CustomEvent(s5, { detail: { target: this.$el, progress: t2 } });
      window.dispatchEvent(e4);
    }
    _getProgressModularModules() {
      if (!this.modularInstance)
        return;
      const t2 = Object.keys(this.$el.dataset).filter((t3) => t3.includes("module")), s5 = Object.entries(this.modularInstance.modules);
      if (t2.length)
        for (const e4 of t2) {
          const t3 = this.$el.dataset[e4];
          if (!t3)
            return;
          for (const e5 of s5) {
            const [s6, i5] = e5;
            t3 in i5 && this.progressModularModules.push({ moduleName: s6, moduleId: t3 });
          }
        }
    }
    _getScrollCallFrom() {
      const t2 = r4([this.intersection.start, this.intersection.end], this.currentScroll);
      return this.intersection.start === t2 ? "start" : "end";
    }
    _dispatchCall(t2, s5) {
      var e4, i5;
      const r5 = null == (e4 = this.attributes.scrollCall) ? void 0 : e4.split(","), l4 = null == (i5 = this.attributes) ? void 0 : i5.scrollCallSelf;
      if (r5 && r5.length > 1) {
        var n5;
        const [e5, i6, o5] = r5;
        let a4;
        a4 = l4 ? this.$el.dataset[`module${i6.trim()}`] : o5, this.modularInstance && this.modularInstance.call(e5.trim(), { target: this.$el, way: t2, from: s5 }, i6.trim(), null == (n5 = a4) ? void 0 : n5.trim());
      } else if (r5) {
        const [e5] = r5, i6 = new CustomEvent(e5, { detail: { target: this.$el, way: t2, from: s5 } });
        window.dispatchEvent(i6);
      }
    }
  };
  var n4 = ["scrollOffset", "scrollPosition", "scrollModuleProgress", "scrollCssProgress", "scrollEventProgress", "scrollSpeed"];
  var o4 = class {
    constructor({ $el: t2, modularInstance: s5, triggerRootMargin: e4, rafRootMargin: i5, scrollOrientation: r5 }) {
      this.$scrollContainer = void 0, this.modularInstance = void 0, this.triggerRootMargin = void 0, this.rafRootMargin = void 0, this.scrollElements = void 0, this.triggeredScrollElements = void 0, this.RAFScrollElements = void 0, this.scrollElementsToUpdate = void 0, this.IOTriggerInstance = void 0, this.IORafInstance = void 0, this.scrollOrientation = void 0, t2 ? (this.$scrollContainer = t2, this.modularInstance = s5, this.scrollOrientation = r5, this.triggerRootMargin = null != e4 ? e4 : "-1px -1px -1px -1px", this.rafRootMargin = null != i5 ? i5 : "100% 100% 100% 100%", this.scrollElements = [], this.triggeredScrollElements = [], this.RAFScrollElements = [], this.scrollElementsToUpdate = [], this._init()) : console.error("Please provide a DOM Element as scrollContainer");
    }
    _init() {
      const t2 = this.$scrollContainer.querySelectorAll("[data-scroll]"), s5 = Array.from(t2);
      this._subscribeScrollElements(s5), this.IOTriggerInstance = new e3({ scrollElements: [...this.triggeredScrollElements], rootMargin: this.triggerRootMargin, IORaf: false }), this.IORafInstance = new e3({ scrollElements: [...this.RAFScrollElements], rootMargin: this.rafRootMargin, IORaf: true });
    }
    destroy() {
      this.IOTriggerInstance.destroy(), this.IORafInstance.destroy(), this._unsubscribeAllScrollElements();
    }
    onResize({ currentScroll: t2 }) {
      for (const s5 of this.RAFScrollElements)
        s5.onResize({ currentScroll: t2 });
    }
    onRender({ currentScroll: t2, smooth: s5 }) {
      for (const e4 of this.scrollElementsToUpdate)
        e4.onRender({ currentScroll: t2, smooth: s5 });
    }
    removeScrollElements(t2) {
      const s5 = t2.querySelectorAll("[data-scroll]");
      if (s5.length) {
        for (let t3 = 0; t3 < this.triggeredScrollElements.length; t3++) {
          const e4 = this.triggeredScrollElements[t3];
          Array.from(s5).indexOf(e4.$el) > -1 && (this.IOTriggerInstance.unobserve(e4.$el), this.triggeredScrollElements.splice(t3, 1));
        }
        for (let t3 = 0; t3 < this.RAFScrollElements.length; t3++) {
          const e4 = this.RAFScrollElements[t3];
          Array.from(s5).indexOf(e4.$el) > -1 && (this.IORafInstance.unobserve(e4.$el), this.RAFScrollElements.splice(t3, 1));
        }
        s5.forEach((t3) => {
          const s6 = this.scrollElementsToUpdate.find((s7) => s7.$el === t3), e4 = this.scrollElements.find((s7) => s7.$el === t3);
          s6 && this._unsubscribeElementUpdate(s6), e4 && (this.scrollElements = this.scrollElements.filter((t4) => t4.id != e4.id));
        });
      }
    }
    addScrollElements(t2) {
      const s5 = t2.querySelectorAll("[data-scroll]"), e4 = [];
      this.scrollElements.forEach((t3) => {
        e4.push(t3.id);
      });
      const i5 = Math.max(...e4) + 1, r5 = Array.from(s5);
      this._subscribeScrollElements(r5, i5, true);
    }
    _subscribeScrollElements(t2, s5 = 0, e4 = false) {
      for (let i5 = 0; i5 < t2.length; i5++) {
        const r5 = t2[i5], n5 = this._checkRafNeeded(r5), o5 = new l3({ $el: r5, id: s5 + i5, scrollOrientation: this.scrollOrientation, modularInstance: this.modularInstance, subscribeElementUpdateFn: this._subscribeElementUpdate.bind(this), unsubscribeElementUpdateFn: this._unsubscribeElementUpdate.bind(this), needRaf: n5 });
        this.scrollElements.push(o5), n5 ? (this.RAFScrollElements.push(o5), e4 && (this.IORafInstance.scrollElements.push(o5), this.IORafInstance.observe(o5.$el))) : (this.triggeredScrollElements.push(o5), e4 && (this.IOTriggerInstance.scrollElements.push(o5), this.IOTriggerInstance.observe(o5.$el)));
      }
    }
    _unsubscribeAllScrollElements() {
      this.scrollElements = [], this.RAFScrollElements = [], this.triggeredScrollElements = [], this.scrollElementsToUpdate = [];
    }
    _subscribeElementUpdate(t2) {
      this.scrollElementsToUpdate.push(t2);
    }
    _unsubscribeElementUpdate(t2) {
      this.scrollElementsToUpdate = this.scrollElementsToUpdate.filter((s5) => s5.id != t2.id);
    }
    _checkRafNeeded(t2) {
      let s5 = [...n4];
      const e4 = (t3) => {
        s5 = s5.filter((s6) => s6 != t3);
      };
      if (t2.dataset.scrollOffset) {
        if ("0,0" != t2.dataset.scrollOffset.split(",").map((t3) => t3.replace("%", "").trim()).join(","))
          return true;
        e4("scrollOffset");
      } else
        e4("scrollOffset");
      if (t2.dataset.scrollPosition) {
        if ("top,bottom" != t2.dataset.scrollPosition.trim())
          return true;
        e4("scrollPosition");
      } else
        e4("scrollPosition");
      if (t2.dataset.scrollSpeed && !isNaN(parseFloat(t2.dataset.scrollSpeed)))
        return true;
      e4("scrollSpeed");
      for (const e5 of s5)
        if (e5 in t2.dataset)
          return true;
      return false;
    }
  };
  var a3 = class {
    constructor({ resizeElements: t2, resizeCallback: s5 = () => {
    } }) {
      this.$resizeElements = void 0, this.isFirstObserve = void 0, this.observer = void 0, this.resizeCallback = void 0, this.$resizeElements = t2, this.resizeCallback = s5, this.isFirstObserve = true, this._init();
    }
    _init() {
      this.observer = new ResizeObserver((t2) => {
        var s5;
        !this.isFirstObserve && (null == (s5 = this.resizeCallback) || s5.call(this)), this.isFirstObserve = false;
      });
      for (const t2 of this.$resizeElements)
        this.observer.observe(t2);
    }
    destroy() {
      this.observer.disconnect();
    }
  };
  var c3 = { wrapper: window, content: document.documentElement, eventsTarget: window, lerp: 0.1, duration: 0.75, orientation: "vertical", gestureOrientation: "vertical", smoothWheel: true, smoothTouch: false, syncTouch: false, syncTouchLerp: 0.1, touchInertiaMultiplier: 35, wheelMultiplier: 1, touchMultiplier: 2, normalizeWheel: false, autoResize: true, easing: (t2) => Math.min(1, 1.001 - Math.pow(2, -10 * t2)) };
  var h3 = class {
    constructor({ lenisOptions: t2 = {}, modularInstance: e4, triggerRootMargin: i5, rafRootMargin: r5, autoResize: l4 = true, autoStart: n5 = true, scrollCallback: o5 = () => {
    }, initCustomTicker: a4, destroyCustomTicker: h4 } = {}) {
      this.rafPlaying = void 0, this.lenisInstance = void 0, this.coreInstance = void 0, this.lenisOptions = void 0, this.modularInstance = void 0, this.triggerRootMargin = void 0, this.rafRootMargin = void 0, this.rafInstance = void 0, this.autoResize = void 0, this.autoStart = void 0, this.ROInstance = void 0, this.initCustomTicker = void 0, this.destroyCustomTicker = void 0, this._onRenderBind = void 0, this._onResizeBind = void 0, this._onScrollToBind = void 0, this.lenisOptions = s4({}, c3, t2), Object.assign(this, { lenisOptions: t2, modularInstance: e4, triggerRootMargin: i5, rafRootMargin: r5, autoResize: l4, autoStart: n5, scrollCallback: o5, initCustomTicker: a4, destroyCustomTicker: h4 }), this._onRenderBind = this._onRender.bind(this), this._onScrollToBind = this._onScrollTo.bind(this), this._onResizeBind = this._onResize.bind(this), this.rafPlaying = false, this._init();
    }
    _init() {
      var s5;
      this.lenisInstance = new r3({ wrapper: this.lenisOptions.wrapper, content: this.lenisOptions.content, eventsTarget: this.lenisOptions.eventsTarget, lerp: this.lenisOptions.lerp, duration: this.lenisOptions.duration, orientation: this.lenisOptions.orientation, gestureOrientation: this.lenisOptions.gestureOrientation, smoothWheel: this.lenisOptions.smoothWheel, smoothTouch: this.lenisOptions.smoothTouch, syncTouch: this.lenisOptions.syncTouch, syncTouchLerp: this.lenisOptions.syncTouchLerp, touchInertiaMultiplier: this.lenisOptions.touchInertiaMultiplier, wheelMultiplier: this.lenisOptions.wheelMultiplier, touchMultiplier: this.lenisOptions.touchMultiplier, normalizeWheel: this.lenisOptions.normalizeWheel, easing: this.lenisOptions.easing }), null == (s5 = this.lenisInstance) || s5.on("scroll", this.scrollCallback), document.documentElement.setAttribute("data-scroll-orientation", this.lenisInstance.options.orientation), requestAnimationFrame(() => {
        this.coreInstance = new o4({ $el: this.lenisInstance.rootElement, modularInstance: this.modularInstance, triggerRootMargin: this.triggerRootMargin, rafRootMargin: this.rafRootMargin, scrollOrientation: this.lenisInstance.options.orientation }), this._bindEvents(), this.initCustomTicker && !this.destroyCustomTicker ? console.warn("initCustomTicker callback is declared, but destroyCustomTicker is not. Please pay attention. It could cause trouble.") : !this.initCustomTicker && this.destroyCustomTicker && console.warn("destroyCustomTicker callback is declared, but initCustomTicker is not. Please pay attention. It could cause trouble."), this.autoStart && this.start();
      });
    }
    destroy() {
      this.stop(), this._unbindEvents(), this.lenisInstance.destroy(), this.coreInstance.destroy();
    }
    _bindEvents() {
      this._bindScrollToEvents(), this.autoResize && ("ResizeObserver" in window ? this.ROInstance = new a3({ resizeElements: [document.body], resizeCallback: this._onResizeBind }) : window.addEventListener("resize", this._onResizeBind));
    }
    _unbindEvents() {
      this._unbindScrollToEvents(), this.autoResize && ("ResizeObserver" in window ? this.ROInstance && this.ROInstance.destroy() : window.removeEventListener("resize", this._onResizeBind));
    }
    _bindScrollToEvents(t2) {
      const s5 = t2 || this.lenisInstance.rootElement, e4 = null == s5 ? void 0 : s5.querySelectorAll("[data-scroll-to]");
      (null == e4 ? void 0 : e4.length) && e4.forEach((t3) => {
        t3.addEventListener("click", this._onScrollToBind, false);
      });
    }
    _unbindScrollToEvents(t2) {
      const s5 = t2 || this.lenisInstance.rootElement, e4 = null == s5 ? void 0 : s5.querySelectorAll("[data-scroll-to]");
      (null == e4 ? void 0 : e4.length) && e4.forEach((t3) => {
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
      var t2, s5;
      null == (t2 = this.lenisInstance) || t2.raf(Date.now()), null == (s5 = this.coreInstance) || s5.onRender({ currentScroll: this.lenisInstance.scroll, smooth: this.lenisInstance.isSmooth });
    }
    _onScrollTo(t2) {
      var s5;
      t2.preventDefault();
      const e4 = null != (s5 = t2.currentTarget) ? s5 : null;
      if (!e4)
        return;
      const i5 = e4.getAttribute("data-scroll-to-href") || e4.getAttribute("href"), r5 = e4.getAttribute("data-scroll-to-offset") || 0, l4 = e4.getAttribute("data-scroll-to-duration") || this.lenisOptions.duration || c3.duration;
      i5 && this.scrollTo(i5, { offset: "string" == typeof r5 ? parseInt(r5) : r5, duration: "string" == typeof l4 ? parseInt(l4) : l4 });
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
      var s5;
      t2 ? (this._unbindScrollToEvents(t2), null == (s5 = this.coreInstance) || s5.removeScrollElements(t2)) : console.error("Please provide a DOM Element as $oldContainer");
    }
    addScrollElements(t2) {
      var s5;
      t2 ? (null == (s5 = this.coreInstance) || s5.addScrollElements(t2), requestAnimationFrame(() => {
        this._bindScrollToEvents(t2);
      })) : console.error("Please provide a DOM Element as $newContainer");
    }
    resize() {
      this._onResizeBind();
    }
    scrollTo(t2, s5) {
      var e4;
      null == (e4 = this.lenisInstance) || e4.scrollTo(t2, { offset: null == s5 ? void 0 : s5.offset, lerp: null == s5 ? void 0 : s5.lerp, duration: null == s5 ? void 0 : s5.duration, immediate: null == s5 ? void 0 : s5.immediate, lock: null == s5 ? void 0 : s5.lock, force: null == s5 ? void 0 : s5.force, easing: null == s5 ? void 0 : s5.easing, onComplete: null == s5 ? void 0 : s5.onComplete });
    }
    _raf() {
      this._onRenderBind(), this.rafInstance = requestAnimationFrame(() => this._raf());
    }
  };

  // assets/scripts/modules/Scroll.js
  var Scroll_default = class extends _default {
    constructor(m3) {
      super(m3);
    }
    init() {
      this.scroll = new h3({
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
