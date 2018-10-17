(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EVENT = void 0;

var _environment = require("./utils/environment");

var _globals = _interopRequireDefault(require("./globals"));

var _array = require("./utils/array");

var _html = require("./utils/html");

var _is = require("./utils/is");

var modules = _interopRequireWildcard(require("./modules"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var MODULE_NAME = 'App';
var EVENT_NAMESPACE = "".concat(_environment.APP_NAME, ".").concat(MODULE_NAME);
var EVENT = {
  INIT_MODULES: "initModules.".concat(EVENT_NAMESPACE),
  INIT_SCOPED_MODULES: "initScopedModules.".concat(EVENT_NAMESPACE),
  DELETE_SCOPED_MODULES: "deleteScopedModules.".concat(EVENT_NAMESPACE)
};
exports.EVENT = EVENT;

var App =
/*#__PURE__*/
function () {
  function App() {
    var _this = this;

    _classCallCheck(this, App);

    this.modules = modules;
    this.currentModules = [];

    _environment.$document.on(EVENT.INIT_MODULES, function (event) {
      _this.initGlobals(event.firstBlood).deleteModules(event).initModules(event);
    });

    _environment.$document.on(EVENT.INIT_SCOPED_MODULES, function (event) {
      _this.initModules(event);
    });

    _environment.$document.on(EVENT.DELETE_SCOPED_MODULES, function (event) {
      _this.deleteModules(event);
    });
  }
  /**
   * Destroy all existing modules or a specific scope of modules
   * @param  {Object} event The event being triggered.
   * @return {Object}       Self (allows chaining)
   */


  _createClass(App, [{
    key: "deleteModules",
    value: function deleteModules(event) {
      var destroyAll = true;
      var moduleIds = []; // Check for scope first

      if (event.$scope instanceof jQuery && event.$scope.length > 0) {
        // Modules within scope
        var $modules = event.$scope.find('[data-module]'); // Determine their uids

        moduleIds = $.makeArray($modules.map(function (index) {
          return $modules.eq(index).data('uid');
        }));

        if (moduleIds.length > 0) {
          destroyAll = false;
        } else {
          return this;
        }
      } // Loop modules and destroying all of them, or specific ones


      var i = this.currentModules.length;

      while (i--) {
        if (destroyAll || (0, _array.arrayContains)(moduleIds, this.currentModules[i].uid)) {
          (0, _array.removeFromArray)(moduleIds, this.currentModules[i].uid);
          this.currentModules[i].destroy();
          this.currentModules.splice(i);
        }
      }

      return this;
    }
    /**
     * Execute global functions and settings
     * Allows you to initialize global modules only once if you need
     * (ex.: when using Barba.js or SmoothState.js)
     * @return {Object} Self (allows chaining)
     */

  }, {
    key: "initGlobals",
    value: function initGlobals(firstBlood) {
      (0, _globals.default)(firstBlood);
      return this;
    }
    /**
     * Find modules and initialize them
     * @param  {Object} event The event being triggered.
     * @return {Object}       Self (allows chaining)
     */

  }, {
    key: "initModules",
    value: function initModules(event) {
      // Elements with module
      var $moduleEls = []; // If first blood, load all modules in the DOM
      // If scoped, render elements with modules
      // If Barba, load modules contained in Barba container

      if (event.firstBlood) {
        $moduleEls = _environment.$document.find('[data-module]');
      } else if (event.$scope instanceof jQuery && event.$scope.length > 0) {
        $moduleEls = event.$scope.find('[data-module]');
      } else if (event.isPjax) {
        $moduleEls = _environment.$pjaxWrapper.find('[data-module]');
      } // Loop through elements


      var i = 0;
      var elsLen = $moduleEls.length;

      for (; i < elsLen; i++) {
        // Current element
        var el = $moduleEls[i]; // All data- attributes considered as options

        var options = (0, _html.getNodeData)(el); // Add current DOM element and jQuery element

        options.el = el;
        options.$el = $moduleEls.eq(i); // Module does exist at this point

        var attr = options.module; // Splitting modules found in the data-attribute

        var moduleIdents = attr.split(/[,\s]+/g); // Loop modules

        var j = 0;
        var modulesLen = moduleIdents.length;

        for (; j < modulesLen; j++) {
          var moduleAttr = moduleIdents[j];

          if (typeof this.modules[moduleAttr] === 'function') {
            var module = new this.modules[moduleAttr](options);
            this.currentModules.push(module);
            module.init();
          }
        }
      }

      return this;
    }
  }]);

  return App;
}(); // IIFE for loading the application
// ==========================================================================


(function () {
  new App();

  _environment.$document.triggerHandler({
    type: EVENT.INIT_MODULES,
    firstBlood: true
  });
})();

},{"./globals":2,"./modules":3,"./utils/array":16,"./utils/environment":18,"./utils/html":19,"./utils/is":20}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _TransitionManager = _interopRequireDefault(require("./transitions/TransitionManager"));

var _svg4everybody = _interopRequireDefault(require("svg4everybody"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(firstBlood) {
  (0, _svg4everybody.default)();

  if (firstBlood) {
    var transitionManager = new _TransitionManager.default();
  }
}

},{"./transitions/TransitionManager":14,"svg4everybody":46}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Example", {
  enumerable: true,
  get: function get() {
    return _Example.default;
  }
});
Object.defineProperty(exports, "LocomotiveScroll", {
  enumerable: true,
  get: function get() {
    return _LocomotiveScroll.default;
  }
});

var _Example = _interopRequireDefault(require("./modules/Example"));

var _LocomotiveScroll = _interopRequireDefault(require("./modules/LocomotiveScroll"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./modules/Example":5,"./modules/LocomotiveScroll":6}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var uid = 0;
/**
 * Abstract Module
 */

var _default =
/*#__PURE__*/
function () {
  function _default(options) {
    _classCallCheck(this, _default);

    this.$el = options.$el || null;
    this.el = options.el || null; // Generate a unique module identifier

    this.uid = 'm-' + uid++; // Use jQuery's data API to "store it in the DOM"

    this.$el.data('uid', this.uid);
  }

  _createClass(_default, [{
    key: "init",
    value: function init() {}
  }, {
    key: "destroy",
    value: function destroy() {
      if (this.$el) {
        this.$el.removeData('uid');
      }
    }
  }]);

  return _default;
}();

exports.default = _default;

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _environment = require("../utils/environment");

var _AbstractModule2 = _interopRequireDefault(require("./AbstractModule"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var MODULE_NAME = 'Example';
var EVENT_NAMESPACE = "".concat(_environment.APP_NAME, ".").concat(MODULE_NAME);
var EVENT = {
  CLICK: "click.".concat(EVENT_NAMESPACE)
};

var _default =
/*#__PURE__*/
function (_AbstractModule) {
  _inherits(_default, _AbstractModule);

  function _default(options) {
    var _this;

    _classCallCheck(this, _default);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(_default).call(this, options)); // Declaration of properties

    console.log('🔨 [module]:constructor - Example');
    return _this;
  }

  _createClass(_default, [{
    key: "init",
    value: function init() {// Set events and such
    }
  }, {
    key: "destroy",
    value: function destroy() {
      console.log('❌ [module]:destroy - Example');

      _get(_getPrototypeOf(_default.prototype), "destroy", this).call(this);

      this.$el.off(".".concat(EVENT_NAMESPACE));
    }
  }]);

  return _default;
}(_AbstractModule2.default);

exports.default = _default;

},{"../utils/environment":18,"./AbstractModule":4}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _environment = require("../utils/environment");

var _AbstractModule2 = _interopRequireDefault(require("./AbstractModule"));

var _ScrollManager = _interopRequireDefault(require("../scroll/vendors/ScrollManager"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var MODULE_NAME = 'LocomotiveScroll';
var EVENT_NAMESPACE = "".concat(_environment.APP_NAME, ".").concat(MODULE_NAME);

var _default =
/*#__PURE__*/
function (_AbstractModule) {
  _inherits(_default, _AbstractModule);

  function _default(options) {
    _classCallCheck(this, _default);

    return _possibleConstructorReturn(this, _getPrototypeOf(_default).call(this, options));
  }

  _createClass(_default, [{
    key: "init",
    value: function init() {
      var _this = this;

      setTimeout(function () {
        _this.scrollManager = new _ScrollManager.default({
          container: _this.$el,
          selector: '.js-animate',
          smooth: true,
          smoothMobile: false,
          mobileContainer: _environment.$document,
          getWay: false,
          getSpeed: false
        });
      }, 500);
    }
  }, {
    key: "destroy",
    value: function destroy() {
      _get(_getPrototypeOf(_default.prototype), "destroy", this).call(this);

      this.scrollManager.destroy();
    }
  }]);

  return _default;
}(_AbstractModule2.default);

exports.default = _default;

},{"../scroll/vendors/ScrollManager":10,"../utils/environment":18,"./AbstractModule":4}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.DEFAULTS = exports.EVENT = exports.EVENT_KEY = void 0;

var _Scroll2 = _interopRequireWildcard(require("./vendors/Scroll"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * UNCOMMENT ONLY THE LINES YOU NEED
 */
// import { $window, $document } from '../../utils/environment';
// import debounce from '../../utils/debounce';
// import { isNumeric } from '../../utils/is';
var EVENT_KEY = _Scroll2.EVENT_KEY;
exports.EVENT_KEY = EVENT_KEY;
var EVENT = Object.assign(_Scroll2.EVENT, {// TEST: `test.${EVENT_KEY}`
});
exports.EVENT = EVENT;
var DEFAULTS = Object.assign(_Scroll2.DEFAULTS, {});
exports.DEFAULTS = DEFAULTS;

var _default =
/*#__PURE__*/
function (_Scroll) {
  _inherits(_default, _Scroll);

  function _default(options) {
    _classCallCheck(this, _default);

    return _possibleConstructorReturn(this, _getPrototypeOf(_default).call(this, options));
  }

  return _default;
}(_Scroll2.default);

exports.default = _default;

},{"./vendors/Scroll":9}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _SmoothScroll2 = _interopRequireDefault(require("./vendors/SmoothScroll"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * UNCOMMENT ONLY THE LINES YOU NEED
 */
// import { $window, $document, $html } from '../utils/environment';
// import Scroll, { DEFAULTS, EVENT } from './Scroll';
// import debounce from '../utils/debounce';
// import Scrollbar from 'smooth-scrollbar';
// import { isNumeric } from '../utils/is';
var _default =
/*#__PURE__*/
function (_SmoothScroll) {
  _inherits(_default, _SmoothScroll);

  function _default(options) {
    _classCallCheck(this, _default);

    return _possibleConstructorReturn(this, _getPrototypeOf(_default).call(this, options));
  }

  return _default;
}(_SmoothScroll2.default);

exports.default = _default;

},{"./vendors/SmoothScroll":11}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.DEFAULTS = exports.EVENT = exports.EVENT_KEY = void 0;

var _environment = require("../../utils/environment");

var _debounce = _interopRequireDefault(require("../../utils/debounce"));

var _is = require("../../utils/is");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var EVENT_KEY = "LocomotiveScroll";
exports.EVENT_KEY = EVENT_KEY;
var EVENT = {
  CLICK: "click.".concat(EVENT_KEY),
  ISREADY: "isReady.".concat(EVENT_KEY),
  REBUILD: "rebuild.".concat(EVENT_KEY),
  RENDER: "render.".concat(EVENT_KEY),
  RESIZE: "resize.".concat(EVENT_KEY),
  SCROLL: "scroll.".concat(EVENT_KEY),
  SCROLLTO: "scrollTo.".concat(EVENT_KEY),
  UPDATE: "update.".concat(EVENT_KEY)
};
exports.EVENT = EVENT;
var DEFAULTS = {
  container: _environment.$document,
  mobileContainer: _environment.$document,
  onScroll: function onScroll() {},
  selector: '.js-animate',
  smooth: false,
  smoothMobile: false,
  reversed: false,
  getWay: false,
  getSpeed: false
};
/**
 * Manage animation of elements on the page according to scroll position.
 *
 * @todo  Manage some options (normally from data attributes) with constructor options (ex.: set repeat for all)
 * @todo  Method to get the distance (as percentage) of an element in the viewport
 */

exports.DEFAULTS = DEFAULTS;

var _default =
/*#__PURE__*/
function () {
  function _default(options) {
    _classCallCheck(this, _default);

    this.$container = options.container ? options.container : DEFAULTS.container;
    this.selector = options.selector ? options.selector : DEFAULTS.selector;
    this.callbacks = {
      onScroll: typeof options.onScroll === 'function' ? options.onScroll : DEFAULTS.onScroll
    };
    this.scroll = {
      x: 0,
      y: 0,
      direction: ''
    };
    this.windowHeight = _environment.$window.height();
    this.windowMiddle = this.windowHeight / 2;
    this.animatedElements = [];
    this.requestId = undefined;
  }
  /**
   * Initialize scrolling animations
   */


  _createClass(_default, [{
    key: "init",
    value: function init() {
      var _this = this;

      this.addElements();
      this.renderAnimations(); // On scroll

      this.$container.on(EVENT.SCROLL, function () {
        _this.renderAnimations();
      }); // Rebuild event

      this.$container.on(EVENT.REBUILD, function () {
        _this.scrollTo({
          targetOffset: 0
        });

        _this.updateElements();
      }); // Update event

      this.$container.on(EVENT.UPDATE, function (event, options) {
        return _this.updateElements(options);
      }); // Render event

      this.$container.on(EVENT.RENDER, function () {
        return _this.renderAnimations();
      }); // Scrollto button event

      this.$container.on(EVENT.CLICK, '.js-scrollto', function (event) {
        event.preventDefault();
        var $target = $(event.currentTarget);
        var offset = $target.data('offset');

        _this.scrollTo({
          sourceElem: $target,
          offsetElem: offset
        });
      });
      this.$container.on(EVENT.SCROLLTO, function (event) {
        return _this.scrollTo(event.options);
      }); // Setup done

      _environment.$document.triggerHandler({
        type: EVENT.ISREADY
      }); // Resize event


      _environment.$window.on(EVENT.RESIZE, (0, _debounce.default)(function () {
        _this.updateElements();
      }, 20));
    }
    /**
     * Find all animatable elements.
     * Called on page load and any subsequent updates.
     */

  }, {
    key: "addElements",
    value: function addElements() {
      this.animatedElements = [];
      var $elements = $(this.selector);
      var len = $elements.length;
      var i = 0;

      for (; i < len; i++) {
        var $element = $elements.eq(i);
        var elementTarget = $element.attr('data-target');
        var elementPosition = $element.attr('data-position');
        var $target = elementTarget && $(elementTarget).length ? $(elementTarget) : $element;
        var elementOffset = $target.offset().top;
        var elementLimit = elementOffset + $target.outerHeight();
        var elementSticky = typeof $element.attr('data-sticky') === 'string';
        var elementStickyTarget = $element.attr('data-sticky-target');
        var elementViewportOffset = null;

        if (typeof $element.attr('data-viewport-offset') === 'string') {
          elementViewportOffset = $element.attr('data-viewport-offset').split(',');
        } //Manage callback


        var elementCallbackString = typeof $element.attr('data-callback') === 'string' ? $element.attr('data-callback') : null;
        var elementCallback = null;

        if (elementCallbackString != null) {
          var event = elementCallbackString.substr(0, elementCallbackString.indexOf('('));
          var optionsString = elementCallbackString.substr(elementCallbackString.indexOf('('), elementCallbackString.length - event.length);
          optionsString = optionsString.replace('(', '');
          optionsString = optionsString.replace(')', '');
          var options = optionsString.split('|');
          var obj = {};

          for (var j = 0; j < options.length; j++) {
            var option = options[j].split(':');
            option[0] = option[0].replace(' ', '');
            var val = void 0; //check if value is a boolean

            if (option[1] === "true") {
              val = true;
            } else if (option[1] === "false") {
              val = false;
            } //check if value is numeric
            else if (/^\d+$/.test(option[1])) {
                val = parseInt(option[1]);
              } //check if value is a String
              else {
                  val = option[1];
                }

            obj[option[0]] = val;
          }

          elementCallback = {
            event: event,
            options: obj
          };
        } // If elements loses its animation after scrolling past it


        var elementRepeat = typeof $element.attr('data-repeat') === 'string';
        var elementInViewClass = $element.attr('data-inview-class');

        if (typeof elementInViewClass === 'undefined') {
          elementInViewClass = 'is-show';
        }

        if (elementSticky) {
          if (typeof elementStickyTarget === 'undefined') {
            elementLimit = this.$container.height();
          } else {
            elementLimit = $(elementStickyTarget).offset().top - $element.height();
          } // Reset offset


          $element.removeClass(elementInViewClass);
          $element.removeClass('is-unstuck');
          $element.css({
            '-webkit-transform': 'translate3d(0, 0, 0)',
            '-ms-transform': 'translate3d(0, 0, 0)',
            'transform': 'translate3d(0, 0, 0)'
          });
        } // Don't add element if it already has its inview class and doesn't repeat


        if (elementRepeat || !$element.hasClass(elementInViewClass)) {
          this.animatedElements[i] = {
            $element: $element,
            offset: Math.round(elementOffset),
            repeat: elementRepeat,
            position: elementPosition,
            limit: elementLimit,
            inViewClass: elementInViewClass,
            sticky: elementSticky,
            callback: elementCallback,
            viewportOffset: elementViewportOffset
          };
        }
      }

      ;
    }
    /**
     * Loop through all animatable elements and apply animation method(s).
     */

  }, {
    key: "animateElements",
    value: function animateElements() {
      var len = this.animatedElements.length;
      var removeIndexes = [];
      var i = 0;

      for (; i < len; i++) {
        var element = this.animatedElements[i]; // If the element's visibility must not be manipulated any further, remove it from the list

        if (this.toggleElement(element, i)) {
          removeIndexes.push(i);
        }
      } // Remove animated elements after looping through elements


      i = removeIndexes.length;

      while (i--) {
        this.animatedElements.splice(removeIndexes[i], 1);
      }
    }
    /**
     * Render the class animations, and update the global scroll positionning.
     */

  }, {
    key: "renderAnimations",
    value: function renderAnimations() {
      // if (window.pageYOffset > this.scroll.y) {
      //     if (this.scroll.direction !== 'down') {
      //         this.scroll.direction = 'down';
      //     }
      // } else if (window.pageYOffset < this.scroll.y) {
      //     if (this.scroll.direction !== 'up') {
      //         this.scroll.direction = 'up';
      //     }
      // }
      if (this.scroll.y !== window.pageYOffset) {
        this.scroll.y = window.pageYOffset;
      }

      if (this.scroll.x !== window.pageXOffset) {
        this.scroll.x = window.pageXOffset;
      }

      this.callbacks.onScroll(this.scroll);
      this.animateElements();
    }
    /**
     * Toggle classes on an element if it's visible.
     *
     * @param  {object}      element Current element to test
     * @param  {int}         index   Index of the element within it's container
     * @return {boolean}             Wether the item must be removed from its container
     */

  }, {
    key: "toggleElement",
    value: function toggleElement(element, index) {
      var removeFromContainer = false;

      if (typeof element !== 'undefined') {
        // Find the bottom edge of the scroll container
        var scrollTop = this.scroll.y;
        var scrollBottom = scrollTop + this.windowHeight; // Define if the element is inView

        var inView = false;

        if (element.position === 'top') {
          inView = scrollTop >= element.offset && scrollTop <= element.limit;
        } else if (element.position === 'below') {
          inView = scrollTop > element.limit;
        } else if (element.sticky) {
          inView = scrollTop >= element.offset && scrollTop <= element.limit;
        } else if (element.viewportOffset != undefined) {
          if (element.viewportOffset.length > 1) {
            var scrollViewportOffsetTop = scrollTop + this.windowHeight * element.viewportOffset[1];
            var scrollViewportOffsetBottom = scrollBottom - this.windowHeight * element.viewportOffset[0];
            inView = scrollViewportOffsetBottom > element.offset && scrollViewportOffsetTop < element.limit;
          } else {
            var scrollViewportOffset = scrollBottom - this.windowHeight * element.viewportOffset[0];
            inView = scrollViewportOffset > element.offset && scrollViewportOffset < element.limit;
          }
        } else {
          inView = scrollBottom >= element.offset && scrollTop <= element.limit;
        }

        if (element.sticky) {
          if (scrollTop > element.limit) {
            element.$element.addClass('is-unstuck');
          } else {
            element.$element.removeClass('is-unstuck');
          }

          if (scrollTop < element.offset) {
            element.$element.removeClass(element.inViewClass);
          }
        } // Add class if inView, remove if not


        if (inView) {
          if (!element.$element.hasClass(element.inViewClass)) {
            element.$element.addClass(element.inViewClass);
            this.triggerCallback(element, 'enter');
          }

          if (!element.repeat && !element.sticky) {
            removeFromContainer = true;
          }

          if (element.sticky) {
            var y = this.scroll.y - element.offset;
            element.$element.css({
              '-webkit-transform': "translate3d(0, ".concat(y, "px, 0)"),
              '-ms-transform': "translate3d(0, ".concat(y, "px, 0)"),
              'transform': "translate3d(0, ".concat(y, "px, 0)")
            });
          }
        } else {
          if (element.repeat) {
            if (element.$element.hasClass(element.inViewClass)) {
              element.$element.removeClass(element.inViewClass);
              this.triggerCallback(element, 'leave');
            }
          }
        }
      }

      return removeFromContainer;
    }
    /**
     * check if the element have a callback, and trigger the event set in the data-callback
     *
     * @param  {object}      element Current element to test
     * @return void
     */

  }, {
    key: "triggerCallback",
    value: function triggerCallback(element, way) {
      if (element.callback != undefined) {
        element.$element.trigger({
          type: element.callback.event,
          options: element.callback.options,
          way: way
        }); //add this where you want dude (in your module btw)
        // $document.on(eventName.Namespace,(e)=>{
        //     console.log(e.options, e.way);
        // });
        /////////////////////////////////////////////
      }
    }
    /**
     * Scroll to a desired target.
     *
     * @param  {object} options
     * @return {void}
     */

  }, {
    key: "scrollTo",
    value: function scrollTo(options) {
      var $targetElem = options.targetElem;
      var $sourceElem = options.sourceElem;
      var offsetElem = options.offsetElem;
      var targetOffset = (0, _is.isNumeric)(options.targetOffset) ? parseInt(options.targetOffset) : 0;
      var speed = (0, _is.isNumeric)(options.speed) ? parseInt(options.speed) : 800;
      var delay = (0, _is.isNumeric)(options.delay) ? parseInt(options.delay) : 0;
      var toTop = options.toTop;
      var toBottom = options.toBottom;
      var offset = 0;

      if (typeof $targetElem === 'undefined' && typeof $sourceElem === 'undefined' && typeof targetOffset === 'undefined') {
        console.warn('You must specify at least one parameter.');
        return false;
      }

      if (typeof $targetElem !== 'undefined' && $targetElem instanceof jQuery && $targetElem.length > 0) {
        targetOffset = $targetElem.offset().top + targetOffset;
      }

      if (typeof $sourceElem !== 'undefined' && $sourceElem instanceof jQuery && $sourceElem.length > 0) {
        var targetData = '';

        if ($sourceElem.attr('data-target')) {
          targetData = $sourceElem.attr('data-target');
        } else {
          targetData = $sourceElem.attr('href');
        }

        targetOffset = $(targetData).offset().top + targetOffset;
      }

      if (typeof offsetElem !== 'undefined') {
        offset = $(offsetElem).outerHeight();
        targetOffset = targetOffset - offset;
      }

      if (toTop === true) {
        targetOffset = 0;
      } else if (toBottom === true) {
        targetOffset = _environment.$document.height();
      }

      setTimeout(function () {
        $('html, body').animate({
          scrollTop: targetOffset
        }, speed);
      }, delay);
    }
    /**
     * Update elements and recalculate all the positions on the page
     */

  }, {
    key: "updateElements",
    value: function updateElements() {
      this.addElements();
      this.animateElements();
      this.windowHeight = _environment.$window.height();
      this.windowMiddle = this.windowHeight / 2;
    }
    /**
     * Destroy
     */

  }, {
    key: "destroy",
    value: function destroy() {
      _environment.$window.off(".".concat(EVENT_KEY));

      this.$container.off(".".concat(EVENT_KEY));
      window.cancelAnimationFrame(this.requestId);
      this.requestId = undefined;
      this.animatedElements = undefined;
    }
  }]);

  return _default;
}();

exports.default = _default;

},{"../../utils/debounce":17,"../../utils/environment":18,"../../utils/is":20}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _environment = require("../../utils/environment");

var _Scroll = _interopRequireWildcard(require("../Scroll"));

var _SmoothScroll = _interopRequireDefault(require("../SmoothScroll"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Basic module that detects which scrolling module we'll be using
 */
var _default =
/*#__PURE__*/
function () {
  function _default(options) {
    _classCallCheck(this, _default);

    this.options = options;
    this.smooth = options.smooth || _Scroll.DEFAULTS.smooth;
    this.smoothMobile = options.smoothMobile || _Scroll.DEFAULTS.smoothMobile;
    this.mobileContainer = options.mobileContainer || _Scroll.DEFAULTS.mobileContainer;
    this.isMobile = false;
    this.init();
  }

  _createClass(_default, [{
    key: "init",
    value: function init() {
      var _this = this;

      _environment.$html[0].scrollTop = 0;
      _environment.$body[0].scrollTop = 0;

      if (!this.smoothMobile) {
        this.isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      }

      this.instance = function () {
        if (_this.smooth === true && !_this.isMobile) {
          return new _SmoothScroll.default(_this.options);
        } else {
          if (_this.mobileContainer) {
            _this.options.container = _this.mobileContainer;
          }

          return new _Scroll.default(_this.options);
        }
      }();

      this.instance.init();
      var $scrollToOnLoadEl = $('.js-scrollto-on-load').first();

      if ($scrollToOnLoadEl.length === 1) {
        _environment.$document.triggerHandler({
          type: 'Event.SCROLLTO',
          options: {
            targetElem: $scrollToOnLoadEl
          }
        });
      }
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.instance.destroy();
    }
  }]);

  return _default;
}();

exports.default = _default;

},{"../../utils/environment":18,"../Scroll":7,"../SmoothScroll":8}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _environment = require("../../utils/environment");

var _Scroll2 = _interopRequireWildcard(require("../Scroll"));

var _debounce = _interopRequireDefault(require("../../utils/debounce"));

var _smoothScrollbar = _interopRequireDefault(require("smooth-scrollbar"));

var _is = require("../../utils/is");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * Smooth scrolling using `smooth-scrollbar`.
 * Based on `Scroll` class, which allows animations of elements on the page
 * according to scroll position.
 *
 * @todo  Method to get the distance (as percentage) of an element in the viewport
 */
var _default =
/*#__PURE__*/
function (_Scroll) {
  _inherits(_default, _Scroll);

  function _default(options) {
    var _this;

    _classCallCheck(this, _default);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(_default).call(this, options));
    _this.isReversed = options.reversed || _Scroll2.DEFAULTS.reversed;
    _this.getWay = options.getWay || _Scroll2.DEFAULTS.getWay;
    _this.getSpeed = options.getSpeed || _Scroll2.DEFAULTS.getSpeed;
    _this.parallaxElements = [];

    if (_this.getSpeed) {
      _this.scroll.speed = 0;
    }

    return _this;
  }
  /**
   * Initialize scrolling animations
   */


  _createClass(_default, [{
    key: "init",
    value: function init() {
      var _this2 = this;

      // Add class to the document to know if SmoothScroll is initialized (to manage overflow on containers)
      _environment.$html.addClass('has-smooth-scroll');

      this.scrollbar = _smoothScrollbar.default.init(this.$container[0], {
        syncCallbacks: true
      });
      this.scrollbarStatus = undefined;
      this.setScrollbarLimit();
      this.setWheelDirection(this.isReversed);
      this.addElements();
      this.renderAnimations(true); // On scroll

      this.scrollbar.addListener(function (status) {
        return _this2.renderAnimations(false, status);
      }); // Rebuild event

      this.$container.on(_Scroll2.EVENT.REBUILD, function () {
        _this2.scrollbar.scrollTo(0, 0, 1);

        _this2.updateElements();
      }); // Update event

      this.$container.on(_Scroll2.EVENT.UPDATE, function (event, options) {
        return _this2.updateElements(options);
      }); // Render event

      this.$container.on(_Scroll2.EVENT.RENDER, function () {
        return _this2.renderAnimations(false);
      }); // Scrollto button event

      this.$container.on(_Scroll2.EVENT.CLICK, '.js-scrollto', function (event) {
        event.preventDefault();
        var $target = $(event.currentTarget);
        var offset = $target.data('offset');

        _this2.scrollTo({
          sourceElem: $target,
          offsetElem: offset
        });
      });
      this.$container.on(_Scroll2.EVENT.SCROLLTO, function (event) {
        return _this2.scrollTo(event.options);
      }); // Setup done

      _environment.$document.triggerHandler({
        type: _Scroll2.EVENT.ISREADY
      }); // Resize event


      _environment.$window.on(_Scroll2.EVENT.RESIZE, (0, _debounce.default)(function () {
        _this2.updateElements();
      }, 20));
    }
    /**
     * Reset existing elements and find all animatable elements.
     * Called on page load and any subsequent updates.
     */

  }, {
    key: "addElements",
    value: function addElements() {
      this.animatedElements = [];
      this.parallaxElements = [];
      var $elements = $(this.selector);
      var len = $elements.length;
      var i = 0;

      for (; i < len; i++) {
        var $element = $elements.eq(i);
        var elementSpeed = (0, _is.isNumeric)($element.attr('data-speed')) ? $element.attr('data-speed') / 10 : false;
        var elementPosition = $element.attr('data-position');
        var elementTarget = $element.attr('data-target');
        var elementHorizontal = $element.attr('data-horizontal');
        var elementSticky = typeof $element.attr('data-sticky') === 'string';
        var elementStickyTarget = $element.attr('data-sticky-target');
        var $target = elementTarget && $(elementTarget).length ? $(elementTarget) : $element;
        var elementOffset = $target.offset().top + this.scrollbar.scrollTop;
        var elementLimit = elementOffset + $target.outerHeight();
        var elementViewportOffset = null;

        if (typeof $element.attr('data-viewport-offset') === 'string') {
          elementViewportOffset = $element.attr('data-viewport-offset').split(',');
        } //Manage callback


        var elementCallbackString = typeof $element.attr('data-callback') === 'string' ? $element.attr('data-callback') : null;
        var elementCallback = null;

        if (elementCallbackString != null) {
          var event = elementCallbackString.substr(0, elementCallbackString.indexOf('('));
          var optionsString = elementCallbackString.substr(elementCallbackString.indexOf('('), elementCallbackString.length - event.length);
          optionsString = optionsString.replace('(', '');
          optionsString = optionsString.replace(')', '');
          var options = optionsString.split('|');
          var obj = {};

          for (var j = 0; j < options.length; j++) {
            var option = options[j].split(':');
            option[0] = option[0].replace(' ', '');
            var val = void 0; //check if value is a boolean

            if (option[1] === "true") {
              val = true;
            } else if (option[1] === "false") {
              val = false;
            } //check if value is numeric
            else if (/^\d+$/.test(option[1])) {
                val = parseInt(option[1]);
              } //check if value is a String
              else {
                  val = option[1];
                }

            obj[option[0]] = val;
          }

          elementCallback = {
            event: event,
            options: obj
          };
        } // If elements stays visible after scrolling past it


        var elementRepeat = typeof $element.attr('data-repeat') === 'string';
        var elementInViewClass = $element.attr('data-inview-class');

        if (typeof elementInViewClass === 'undefined') {
          elementInViewClass = 'is-show';
        }

        if (!elementTarget && $element.attr('data-transform')) {
          elementOffset -= parseFloat($element.attr('data-transform').y);
        }

        if (elementSticky) {
          if (typeof elementStickyTarget === 'undefined') {
            elementLimit = Infinity;
          } else {
            elementLimit = $(elementStickyTarget).offset().top - $element.height() + this.scrollbar.scrollTop;
          }
        }

        var newElement = {
          $element: $element,
          inViewClass: elementInViewClass,
          limit: elementLimit,
          offset: Math.round(elementOffset),
          repeat: elementRepeat,
          callback: elementCallback,
          viewportOffset: elementViewportOffset
        }; // For parallax animated elements

        if (elementSpeed !== false) {
          var _elementPosition = $element.attr('data-position');

          var _elementHorizontal = $element.attr('data-horizontal');

          var elementMiddle = (elementLimit - elementOffset) / 2 + elementOffset;
          newElement.horizontal = _elementHorizontal;
          newElement.middle = elementMiddle;
          newElement.offset = elementOffset;
          newElement.position = _elementPosition;
          newElement.speed = elementSpeed;
          this.parallaxElements.push(newElement);
        } else {
          newElement.sticky = elementSticky;
          this.animatedElements.push(newElement); // @todo Useful?
          // Don't add element if it already has its in view class and doesn't repeat
          // if (elementRepeat || !$element.hasClass(elementInViewClass)) {
          //     this.animatedElements.push(newElement);
          // }

          if (elementSticky) {
            //launch the toggle function to set the position of the sticky element
            this.toggleElement(newElement);
          }
        }
      }

      ;
    }
    /**
     * Render the class/transform animations, and update the global scroll positionning.
     *
     * @param  {boolean} isFirstCall Determines if this is the first occurence of method being called
     * @param  {object}  status      Optional status object received when method is
     *                               called by smooth-scrollbar instance listener.
     * @return {void}
     */

  }, {
    key: "renderAnimations",
    value: function renderAnimations(isFirstCall, status) {
      if (_typeof(status) === 'object') {
        this.scrollbarStatus = status;
      }

      var scrollbarTop = this.scrollbar.scrollTop;

      if (this.getWay) {
        if (scrollbarTop > this.scroll.y) {
          if (this.scroll.direction !== 'down') {
            this.scroll.direction = 'down';
          }
        } else if (scrollbarTop < this.scroll.y) {
          if (this.scroll.direction !== 'up') {
            this.scroll.direction = 'up';
          }
        }
      }

      if (this.getSpeed) {
        if (this.scroll.y !== scrollbarTop) {
          this.scroll.speed = this.scrollbar.movement.y;
          this.scroll.y = scrollbarTop;
        } else {
          this.scroll.speed = 0;
        }
      }

      if (this.scroll.y !== scrollbarTop) {
        this.scroll.y = scrollbarTop;
      }

      this.transformElements(isFirstCall);
      this.animateElements();
    }
    /**
     * Scroll to a desired target.
     *
     * @param  {object} options
     * @return {void}
     */

  }, {
    key: "scrollTo",
    value: function scrollTo(options) {
      var _this3 = this;

      var $targetElem = options.targetElem;
      var $sourceElem = options.sourceElem;
      var offsetElem = options.offsetElem;
      var targetOffset = (0, _is.isNumeric)(options.targetOffset) ? parseInt(options.targetOffset) : 0;
      var delay = (0, _is.isNumeric)(options.delay) ? parseInt(options.delay) : 0;
      var speed = (0, _is.isNumeric)(options.speed) ? parseInt(options.speed) : 900;
      var toTop = options.toTop;
      var toBottom = options.toBottom;
      var offset = 0;

      if (typeof $targetElem === 'undefined' && typeof $sourceElem === 'undefined' && typeof targetOffset === 'undefined') {
        console.warn('You must specify at least one parameter.');
        return false;
      }

      if (typeof $targetElem !== 'undefined' && $targetElem instanceof jQuery && $targetElem.length > 0) {
        targetOffset = $targetElem.offset().top + this.scrollbar.scrollTop + targetOffset;
      }

      if (typeof $sourceElem !== 'undefined' && $sourceElem instanceof jQuery && $sourceElem.length > 0) {
        var targetData = '';

        if ($sourceElem.attr('data-target')) {
          targetData = $sourceElem.attr('data-target');
        } else {
          targetData = $sourceElem.attr('href');
        }

        targetOffset = $(targetData).offset().top + this.scrollbar.scrollTop + targetOffset;
      }

      if (typeof offsetElem !== 'undefined') {
        offset = $(offsetElem).outerHeight();
        targetOffset = targetOffset - offset;
      }

      if (toTop === true) {
        targetOffset = 0;
      } else if (toBottom === true) {
        targetOffset = this.scrollbar.limit.y;
      }

      setTimeout(function () {
        _this3.scrollbar.scrollTo(0, targetOffset, speed);
      }, delay);
    }
    /**
     * Set the scroll bar limit
     */

  }, {
    key: "setScrollbarLimit",
    value: function setScrollbarLimit() {
      this.scrollbarLimit = this.scrollbar.limit.y + this.windowHeight;
    }
    /**
     * Apply CSS transform properties on an element.
     *
     * @param  {object}  $element Targetted jQuery element
     * @param  {int}     x        Translate value
     * @param  {int}     y        Translate value
     * @param  {int}     z        Translate value
     * @return {void}
     */

  }, {
    key: "transformElement",
    value: function transformElement($element, x, y, z) {
      // Defaults
      x = x || 0;
      y = y || 0;
      z = z || 0; // Translate and store the positionning as `data`

      $element.css({
        '-webkit-transform': "translate3d(".concat(x, "px, ").concat(y, "px, ").concat(z, "px)"),
        '-ms-transform': "translate3d(".concat(x, "px, ").concat(y, "px, ").concat(z, "px)"),
        'transform': "translate3d(".concat(x, "px, ").concat(y, "px, ").concat(z, "px)")
      }).data('transform', {
        x: x,
        y: y,
        z: z
      }); // Affect child elements with the same positionning
      // const children = $element.find(this.selector);
      // const len = children.length;
      // let i = 0;
      // for (; i < len; i++) {
      //     let $child = $(children[i]);
      //     if (!$child.data('transform')) {
      //         $child.data('transform', {
      //             x: x,
      //             y: y,
      //             z: z
      //         })
      //     }
      // };
    }
    /**
     * Loop through all parallax-able elements and apply transform method(s).
     *
     * @param  {boolean} isFirstCall Determines if this is the first occurence of method being called
     * @return {void}
     */

  }, {
    key: "transformElements",
    value: function transformElements(isFirstCall) {
      if (this.parallaxElements.length > 0) {
        var scrollbarBottom = this.scrollbar.scrollTop + this.windowHeight;
        var scrollbarMiddle = this.scrollbar.scrollTop + this.windowMiddle;
        var i = 0;
        var len = this.parallaxElements.length;
        var removeIndexes = [];

        for (; i < len; i++) {
          var curEl = this.parallaxElements[i]; // Old

          var scrollBottom = scrollbarBottom; // New
          // let scrollBottom = (curEl.position === 'top') ? this.scrollbar.scrollTop : scrollbarBottom;

          var transformDistance = false; // Define if the element is in view
          // Old

          var inView = scrollBottom >= curEl.offset && this.scroll.y <= curEl.limit; // New
          // let inView = (scrollBottom >= curEl.offset && this.scrollbar.scrollTop <= curEl.limit);

          this.toggleElement(curEl, i);

          if (isFirstCall && !inView && curEl.speed) {
            // Different calculations if it is the first call and the item is not in the view
            if (curEl.position !== 'top') {
              transformDistance = (curEl.offset - this.windowMiddle - curEl.middle) * -curEl.speed;
            }
          } // If element is in view


          if (inView && curEl.speed) {
            switch (curEl.position) {
              case 'top':
                // Old
                transformDistance = this.scrollbar.scrollTop * -curEl.speed; // New
                // transformDistance = (this.scrollbar.scrollTop - curEl.offset) * -curEl.speed;

                break;

              case 'bottom':
                transformDistance = (this.scrollbarLimit - scrollBottom) * curEl.speed;
                break;

              default:
                transformDistance = (scrollbarMiddle - curEl.middle) * -curEl.speed;
                break;
            }
          } // Transform horizontal OR vertical. Defaults to vertical


          if ((0, _is.isNumeric)(transformDistance)) {
            curEl.horizontal ? this.transformElement(curEl.$element, transformDistance) : this.transformElement(curEl.$element, 0, transformDistance);
          }
        }
      }
    }
    /**
     * Update elements and recalculate all the positions on the page
     *
     * @param {object} options
     */

  }, {
    key: "updateElements",
    value: function updateElements(options) {
      options = options || {};
      this.scrollbar.update();
      this.windowHeight = _environment.$window.height();
      this.windowMiddle = this.windowHeight / 2;
      this.setScrollbarLimit();
      this.setWheelDirection(this.isReversed);
      this.addElements();
      this.transformElements(true);

      if (typeof options.callback === 'function') {
        options.callback();
      }

      this.renderAnimations(false, status);
    }
    /**
     * Set smooth-scrollbar scrolling direction for wheel event
     * @param {Boolean} isReversed
     */

  }, {
    key: "setWheelDirection",
    value: function setWheelDirection(isReversed) {
      this.scrollbar.reverseWheel(isReversed);
    }
    /**
     * Destroy
     */

  }, {
    key: "destroy",
    value: function destroy() {
      _get(_getPrototypeOf(_default.prototype), "destroy", this).call(this);

      _environment.$html.removeClass('has-smooth-scroll');

      this.parallaxElements = [];
      this.scrollbar.destroy();
    }
  }]);

  return _default;
}(_Scroll2.default);

exports.default = _default;

},{"../../utils/debounce":17,"../../utils/environment":18,"../../utils/is":20,"../Scroll":7,"smooth-scrollbar":45}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _environment = require("../utils/environment");

var _TransitionManager = require("./TransitionManager");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _default =
/*#__PURE__*/
function () {
  function _default(options) {
    _classCallCheck(this, _default);

    this.options = options;
    this.wrapper = options.wrapper;
    this.overrideClass = options.overrideClass ? options.overrideClass : '';
    this.clickedLink = options.clickedLink;
  }

  _createClass(_default, [{
    key: "launch",
    value: function launch() {
      if (_environment.isDebug) {
        console.log("---- Launch transition 👊 -----");
      }

      _environment.$html.removeClass('has-dom-loaded has-dom-animated ').addClass("has-dom-loading ".concat(this.overrideClass));
    }
  }, {
    key: "hideView",
    value: function hideView(oldView, newView) {
      if (_environment.isDebug) {
        console.log('----- ❌ [VIEW]:hide - ', oldView.getAttribute('data-template'));
      } // launch it at the end (animations...)


      _environment.$document.triggerHandler({
        type: _TransitionManager.EVENT.READYTOREMOVE,
        oldView: oldView,
        newView: newView
      });
    }
  }, {
    key: "displayView",
    value: function displayView(view) {
      var _this = this;

      if (_environment.isDebug) {
        console.log('----- ✅ [VIEW]:display :', view.getAttribute('data-template'));
      }

      _environment.$html.attr('data-template', view.getAttribute('data-template'));

      setTimeout(function () {
        _environment.$html.addClass('has-dom-loaded').removeClass('has-dom-loading');

        setTimeout(function () {
          _environment.$html.removeClass(_this.overrideClass).addClass('has-dom-animated');
        }, 1000); // launch it at the end (animations...)

        _environment.$document.triggerHandler({
          type: _TransitionManager.EVENT.READYTODESTROY
        });
      }, 1000);
    }
  }, {
    key: "destroy",
    value: function destroy() {
      if (_environment.isDebug) {
        console.log("---- ❌ [transition]:destroy -----");
      }
    }
  }]);

  return _default;
}();

exports.default = _default;

},{"../utils/environment":18,"./TransitionManager":14}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _environment = require("../utils/environment");

var _BaseTransition2 = _interopRequireDefault(require("./BaseTransition"));

var _TransitionManager = require("./TransitionManager");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var _default =
/*#__PURE__*/
function (_BaseTransition) {
  _inherits(_default, _BaseTransition);

  function _default(options) {
    var _this;

    _classCallCheck(this, _default);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(_default).call(this, options));
    _this.overrideClass = '-custom-transition';
    return _this;
  }

  return _default;
}(_BaseTransition2.default);

exports.default = _default;

},{"../utils/environment":18,"./BaseTransition":12,"./TransitionManager":14}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.EVENT = void 0;

var _pjax = _interopRequireDefault(require("pjax"));

var _environment = require("../utils/environment");

var _app = require("../app");

var transitions = _interopRequireWildcard(require("./transitions"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var MODULE_NAME = 'Transition';
var EVENT_NAMESPACE = "".concat(_environment.APP_NAME, ".").concat(MODULE_NAME);
var EVENT = {
  CLICK: "click.".concat(EVENT_NAMESPACE),
  READYTOREMOVE: "readyToRemove.".concat(EVENT_NAMESPACE),
  READYTODESTROY: "readyToDestroy.".concat(EVENT_NAMESPACE),
  GOTO: "goto.".concat(EVENT_NAMESPACE)
};
/*

@todo :

- ✅ get data-transition on clicked link -> launch() and add switch(){}
- ✅ add goto listener
- ✅ add overrideClass system for all transitions
- ✅ add base class manager like old DefaultTransition (has-dom-loaded, has-dom-loading etc..)


======= SCHEMA =======

[] : listener
* : trigger event

[pjax:send] -> (transition) launch()

[pjax:switch] (= new view is loaded) -> (transition) hideView()-> hide animations & *readyToRemove

[readyToRemove] -> remove() -> delete modules
                            -> remove oldView from the DOM, and innerHTMl newView
                            -> display()

display() -> (transition) displayView() -> display animations & *readyToDestroy
          -> init new modules

[readyToRemove] -> reinit()

*/

exports.EVENT = EVENT;

var _default =
/*#__PURE__*/
function () {
  function _default() {
    var _this = this;

    _classCallCheck(this, _default);

    // jQuery ondomready
    _environment.$window.on('load', function () {
      _this.load();
    });

    this.transition = new transitions['BaseTransition']({
      wrapper: this.wrapper
    });
    /*
    ===== PJAX CONFIGURATION =====
    */

    this.containerClass = '.js-pjax-container';
    this.wrapperId = 'js-pjax-wrapper';
    this.noPjaxRequestClass = 'no-transition';
    this.wrapper = document.getElementById(this.wrapperId);
    this.options = {
      debug: false,
      cacheBust: false,
      elements: ["a:not(.".concat(this.noPjaxRequestClass, ")"), 'form[action]'],
      selectors: ['title', "".concat(this.containerClass)],
      switches: {},
      requestOptions: {
        timeout: 2000
      }
    };

    this.options.switches[this.containerClass] = function (oldEl, newEl, options) {
      return _this.switch(oldEl, newEl, options);
    };

    this.pjax = new _pjax.default(this.options);
    /*
    ===== LISTENERS =====
    */

    document.addEventListener('pjax:send', function (e) {
      return _this.send(e);
    });

    _environment.$document.on(EVENT.READYTOREMOVE, function (event) {
      _this.remove(event.oldView, event.newView);
    });

    _environment.$document.on(EVENT.READYTODESTROY, function (event) {
      _this.reinit();
    });
    /** goto exampe
    $document.triggerHandler({
        type: 'goto.Transition',
        options : {
            el: {{element clicked?}},
            link: {{url}}
        }
    });
    */


    _environment.$document.on(EVENT.GOTO, function (e) {
      if (e.options.el != undefined) {
        _this.autoEl = e.options.el.get(0);
      }

      _this.pjax.loadUrl(e.options.link, $.extend({}, _this.pjax.options));
    });
  }
  /**
   * (PJAX) Launch when pjax receive a request
   * get & manage data-transition,init and launch it
   * @param  {event}
   * @return void
   */


  _createClass(_default, [{
    key: "send",
    value: function send(e) {
      if (_environment.isDebug) {
        console.log("---- Launch request 🙌 -----");
      }

      var el, transition;

      if (e.triggerElement != undefined) {
        el = e.triggerElement;
        transition = el.getAttribute('data-transition') ? el.getAttribute('data-transition') : 'BaseTransition';

        _environment.$html.attr('data-transition', transition);
      } else {
        if (this.autoEl != undefined) {
          el = this.autoEl;
        } else {
          el = document;
        }

        transition = 'BaseTransition';
      } // options available : wrapper, overrideClass


      this.transition = new transitions[transition]({
        wrapper: this.wrapper,
        clickedLink: el
      });
      this.transition.launch();
    }
    /**
     * (PJAX) Launch when new page is loaded
     * @param  {js dom element},
     * @param  {js dom element}
     * @param  {options : pjax options}
     * @return void
     */

  }, {
    key: "switch",
    value: function _switch(oldView, newView, options) {
      if (_environment.isDebug) {
        console.log('---- Next view loaded 👌 -----');
      }

      this.transition.hideView(oldView, newView);
    }
    /**
     * Launch when you trigger EVENT.READYTOREMOVE in your transition -> hideView(), at the end
     * after oldView hidden, delete modules and launch this.display()
     * @param  {js dom element},
     * @param  {js dom element}
     * @return void
     */

  }, {
    key: "remove",
    value: function remove(oldView, newView) {
      _environment.$document.triggerHandler({
        type: _app.EVENT.DELETE_SCOPED_MODULES,
        $scope: _environment.$pjaxWrapper
      });

      oldView.remove();
      this.display(newView);
    }
    /**
     * launch after this.remove()
     * @param  {js dom element},
     * @return void
     */

  }, {
    key: "display",
    value: function display(view) {
      this.wrapper.innerHTML = view.outerHTML; // Fetch any inline script elements.

      var scripts = view.querySelectorAll('script.js-inline');

      if (scripts instanceof window.NodeList) {
        var i = 0;
        var len = scripts.length;

        for (; i < len; i++) {
          eval(scripts[i].innerHTML);
        }
      }

      _environment.$document.triggerHandler({
        type: _app.EVENT.INIT_SCOPED_MODULES,
        isPjax: true
      });

      this.pjax.onSwitch();
      this.transition.displayView(view);
    }
    /**
     * Launch when you trigger EVENT.READYTODESTROY in your transition -> displayView(), at the end
     * @return void
     */

  }, {
    key: "reinit",
    value: function reinit() {
      this.transition.destroy();

      _environment.$html.attr('data-transition', '');

      this.transition = new transitions['BaseTransition']({
        wrapper: this.wrapper
      });
    }
    /**
     * DOM is loaded
     *
     * @return {void}
     */

  }, {
    key: "load",
    value: function load() {
      _environment.$html.addClass('has-dom-loaded');

      _environment.$html.removeClass('has-dom-loading');

      setTimeout(function () {
        _environment.$html.addClass('has-dom-animated');
      }, 1000);
    }
  }]);

  return _default;
}();

exports.default = _default;

},{"../app":1,"../utils/environment":18,"./transitions":15,"pjax":21}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "BaseTransition", {
  enumerable: true,
  get: function get() {
    return _BaseTransition.default;
  }
});
Object.defineProperty(exports, "CustomTransition", {
  enumerable: true,
  get: function get() {
    return _CustomTransition.default;
  }
});

var _BaseTransition = _interopRequireDefault(require("./BaseTransition"));

var _CustomTransition = _interopRequireDefault(require("./CustomTransition"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./BaseTransition":12,"./CustomTransition":13}],16:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addToArray = addToArray;
exports.arrayContains = arrayContains;
exports.arrayContentsMatch = arrayContentsMatch;
exports.ensureArray = ensureArray;
exports.lastItem = lastItem;
exports.removeFromArray = removeFromArray;
exports.toArray = toArray;
exports.findByKeyValue = findByKeyValue;
exports.cloneArray = cloneArray;

var _is = require("./is");

function addToArray(array, value) {
  var index = array.indexOf(value);

  if (index === -1) {
    array.push(value);
  }
}

function arrayContains(array, value) {
  for (var i = 0, c = array.length; i < c; i++) {
    if (array[i] == value) {
      return true;
    }
  }

  return false;
}

function arrayContentsMatch(a, b) {
  var i;

  if (!(0, _is.isArray)(a) || !(0, _is.isArray)(b)) {
    return false;
  }

  if (a.length !== b.length) {
    return false;
  }

  i = a.length;

  while (i--) {
    if (a[i] !== b[i]) {
      return false;
    }
  }

  return true;
}

function ensureArray(x) {
  if (typeof x === 'string') {
    return [x];
  }

  if (x === undefined) {
    return [];
  }

  return x;
}

function lastItem(array) {
  return array[array.length - 1];
}

function removeFromArray(array, member) {
  if (!array) {
    return;
  }

  var index = array.indexOf(member);

  if (index !== -1) {
    array.splice(index, 1);
  }
}

function toArray(arrayLike) {
  var array = [];
  var i = arrayLike.length;

  while (i--) {
    array[i] = arrayLike[i];
  }

  return array;
}

function findByKeyValue(array, key, value) {
  return array.filter(function (obj) {
    return obj[key] === value;
  });
}

function cloneArray(array) {
  return JSON.parse(JSON.stringify(array));
}

},{"./is":20}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this;
    var args = arguments;

    var later = function later() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };

    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

},{}],18:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.$pjaxWrapper = exports.isDebug = exports.$body = exports.$html = exports.$window = exports.$document = exports.DATA_API_KEY = exports.APP_NAME = void 0;
var APP_NAME = 'Boilerplate';
exports.APP_NAME = APP_NAME;
var DATA_API_KEY = '.data-api';
exports.DATA_API_KEY = DATA_API_KEY;
var $document = $(document);
exports.$document = $document;
var $window = $(window);
exports.$window = $window;
var $html = $(document.documentElement).removeClass('has-no-js').addClass('has-js');
exports.$html = $html;
var $body = $(document.body);
exports.$body = $body;
var $pjaxWrapper = $('#js-pjax-wrapper');
exports.$pjaxWrapper = $pjaxWrapper;
var isDebug = !!$html.data('debug');
exports.isDebug = isDebug;

},{}],19:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.escapeHtml = escapeHtml;
exports.unescapeHtml = unescapeHtml;
exports.getNodeData = getNodeData;
exports.getData = getData;

/**
 * @see  https://github.com/ractivejs/ractive/blob/dev/src/utils/html.js
 */
function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
/**
 * Prepare HTML content that contains mustache characters for use with Ractive
 * @param  {string} str
 * @return {string}
 */


function unescapeHtml(str) {
  return str.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
}
/**
 * Get element data attributes
 * @param   {DOMElement}  node
 * @return  {Array}       data
 */


function getNodeData(node) {
  // All attributes
  var attributes = node.attributes; // Regex Pattern

  var pattern = /^data\-(.+)$/; // Output

  var data = {};

  for (var i in attributes) {
    if (!attributes[i]) {
      continue;
    } // Attributes name (ex: data-module)


    var name = attributes[i].name; // This happens.

    if (!name) {
      continue;
    }

    var match = name.match(pattern);

    if (!match) {
      continue;
    } // If this throws an error, you have some
    // serious problems in your HTML.


    data[match[1]] = getData(node.getAttribute(name));
  }

  return data;
}

var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/;
/**
 * Parse value to data type.
 *
 * @link   https://github.com/jquery/jquery/blob/3.1.1/src/data.js
 * @param  {string} data - A value to convert.
 * @return {mixed}  Returns the value in its natural data type.
 */

function getData(data) {
  if (data === 'true') {
    return true;
  }

  if (data === 'false') {
    return false;
  }

  if (data === 'null') {
    return null;
  } // Only convert to a number if it doesn't change the string


  if (data === +data + '') {
    return +data;
  }

  if (rbrace.test(data)) {
    return JSON.parse(data);
  }

  return data;
}

},{}],20:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isArray = isArray;
exports.isArrayLike = isArrayLike;
exports.isEqual = isEqual;
exports.isNumeric = isNumeric;
exports.isObject = isObject;
exports.isFunction = isFunction;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var toString = Object.prototype.toString;
var arrayLikePattern = /^\[object (?:Array|FileList)\]$/; // thanks, http://perfectionkills.com/instanceof-considered-harmful-or-how-to-write-a-robust-isarray/

function isArray(thing) {
  return toString.call(thing) === '[object Array]';
}

function isArrayLike(obj) {
  return arrayLikePattern.test(toString.call(obj));
}

function isEqual(a, b) {
  if (a === null && b === null) {
    return true;
  }

  if (_typeof(a) === 'object' || _typeof(b) === 'object') {
    return false;
  }

  return a === b;
} // http://stackoverflow.com/questions/18082/validate-numbers-in-javascript-isnumeric


function isNumeric(thing) {
  return !isNaN(parseFloat(thing)) && isFinite(thing);
}

function isObject(thing) {
  return thing && toString.call(thing) === '[object Object]';
}

function isFunction(thing) {
  var getType = {};
  return thing && getType.toString.call(thing) === '[object Function]';
}

},{}],21:[function(require,module,exports){
var executeScripts = require("./lib/execute-scripts.js")
var forEachEls = require("./lib/foreach-els.js")
var parseOptions = require("./lib/parse-options.js")
var switches = require("./lib/switches")
var newUid = require("./lib/uniqueid.js")

var on = require("./lib/events/on.js")
var trigger = require("./lib/events/trigger.js")

var clone = require("./lib/util/clone.js")
var contains = require("./lib/util/contains.js")
var extend = require("./lib/util/extend.js")
var noop = require("./lib/util/noop")

var Pjax = function(options) {
    this.state = {
      numPendingSwitches: 0,
      href: null,
      options: null
    }


    this.options = parseOptions(options)
    this.log("Pjax options", this.options)

    if (this.options.scrollRestoration && "scrollRestoration" in history) {
      history.scrollRestoration = "manual"
    }

    this.maxUid = this.lastUid = newUid()

    this.parseDOM(document)

    on(window, "popstate", function(st) {
      if (st.state) {
        var opt = clone(this.options)
        opt.url = st.state.url
        opt.title = st.state.title
        // Since state already exists, prevent it from being pushed again
        opt.history = false
        opt.scrollPos = st.state.scrollPos
        if (st.state.uid < this.lastUid) {
          opt.backward = true
        }
        else {
          opt.forward = true
        }
        this.lastUid = st.state.uid

        // @todo implement history cache here, based on uid
        this.loadUrl(st.state.url, opt)
      }
    }.bind(this))
  }

Pjax.switches = switches

Pjax.prototype = {
  log: require("./lib/proto/log.js"),

  getElements: function(el) {
    return el.querySelectorAll(this.options.elements)
  },

  parseDOM: function(el) {
    var parseElement = require("./lib/proto/parse-element")
    forEachEls(this.getElements(el), parseElement, this)
  },

  refresh: function(el) {
    this.parseDOM(el || document)
  },

  reload: function() {
    window.location.reload()
  },

  attachLink: require("./lib/proto/attach-link.js"),

  attachForm: require("./lib/proto/attach-form.js"),

  forEachSelectors: function(cb, context, DOMcontext) {
    return require("./lib/foreach-selectors.js").bind(this)(this.options.selectors, cb, context, DOMcontext)
  },

  switchSelectors: function(selectors, fromEl, toEl, options) {
    return require("./lib/switches-selectors.js").bind(this)(this.options.switches, this.options.switchesOptions, selectors, fromEl, toEl, options)
  },

  latestChance: function(href) {
    window.location = href
  },

  onSwitch: function() {
    trigger(window, "resize scroll")

    this.state.numPendingSwitches--

    // debounce calls, so we only run this once after all switches are finished.
    if (this.state.numPendingSwitches === 0) {
      this.afterAllSwitches()
    }
  },

  loadContent: function(html, options) {
    var tmpEl = document.implementation.createHTMLDocument("pjax")

    // parse HTML attributes to copy them
    // since we are forced to use documentElement.innerHTML (outerHTML can't be used for <html>)
    var htmlRegex = /<html[^>]+>/gi
    var htmlAttribsRegex = /\s?[a-z:]+(?:\=(?:\'|\")[^\'\">]+(?:\'|\"))*/gi
    var matches = html.match(htmlRegex)
    if (matches && matches.length) {
      matches = matches[0].match(htmlAttribsRegex)
      if (matches.length) {
        matches.shift()
        matches.forEach(function(htmlAttrib) {
          var attr = htmlAttrib.trim().split("=")
          if (attr.length === 1) {
            tmpEl.documentElement.setAttribute(attr[0], true)
          }
          else {
            tmpEl.documentElement.setAttribute(attr[0], attr[1].slice(1, -1))
          }
        })
      }
    }

    tmpEl.documentElement.innerHTML = html
    this.log("load content", tmpEl.documentElement.attributes, tmpEl.documentElement.innerHTML.length)

    // Clear out any focused controls before inserting new page contents.
    if (document.activeElement && contains(document, this.options.selectors, document.activeElement)) {
      try {
        document.activeElement.blur()
      } catch (e) { }
    }

    this.switchSelectors(this.options.selectors, tmpEl, document, options)
  },

  abortRequest: require("./lib/abort-request.js"),

  doRequest: require("./lib/send-request.js"),

  handleResponse: require("./lib/proto/handle-response.js"),

  loadUrl: function(href, options) {
    options = typeof options === "object" ?
      extend({}, this.options, options) :
      clone(this.options)

    this.log("load href", href, options)

    // Abort any previous request
    this.abortRequest(this.request)

    trigger(document, "pjax:send", options)

    // Do the request
    this.request = this.doRequest(href, options, this.handleResponse.bind(this))
  },

  afterAllSwitches: function() {
    // FF bug: Won’t autofocus fields that are inserted via JS.
    // This behavior is incorrect. So if theres no current focus, autofocus
    // the last field.
    //
    // http://www.w3.org/html/wg/drafts/html/master/forms.html
    var autofocusEl = Array.prototype.slice.call(document.querySelectorAll("[autofocus]")).pop()
    if (autofocusEl && document.activeElement !== autofocusEl) {
      autofocusEl.focus()
    }

    // execute scripts when DOM have been completely updated
    this.options.selectors.forEach(function(selector) {
      forEachEls(document.querySelectorAll(selector), function(el) {
        executeScripts(el)
      })
    })

    var state = this.state

    if (state.options.history) {
      if (!window.history.state) {
        this.lastUid = this.maxUid = newUid()
        window.history.replaceState({
            url: window.location.href,
            title: document.title,
            uid: this.maxUid,
            scrollPos: [0, 0]
          },
          document.title)
      }

      // Update browser history
      this.lastUid = this.maxUid = newUid()

      window.history.pushState({
          url: state.href,
          title: state.options.title,
          uid: this.maxUid,
          scrollPos: [0, 0]
        },
        state.options.title,
        state.href)
    }

    this.forEachSelectors(function(el) {
      this.parseDOM(el)
    }, this)

    // Fire Events
    trigger(document,"pjax:complete pjax:success", state.options)

    if (typeof state.options.analytics === "function") {
      state.options.analytics()
    }

    if (state.options.history) {
      // First parse url and check for hash to override scroll
      var a = document.createElement("a")
      a.href = this.state.href
      if (a.hash) {
        var name = a.hash.slice(1)
        name = decodeURIComponent(name)

        var curtop = 0
        var target = document.getElementById(name) || document.getElementsByName(name)[0]
        if (target) {
          // http://stackoverflow.com/questions/8111094/cross-browser-javascript-function-to-find-actual-position-of-an-element-in-page
          if (target.offsetParent) {
            do {
              curtop += target.offsetTop

              target = target.offsetParent
            } while (target)
          }
        }
        window.scrollTo(0, curtop)
      }
      else if (state.options.scrollTo !== false) {
        // Scroll page to top on new page load
        if (state.options.scrollTo.length > 1) {
          window.scrollTo(state.options.scrollTo[0], state.options.scrollTo[1])
        }
        else {
          window.scrollTo(0, state.options.scrollTo)
        }
      }
    }
    else if (state.options.scrollRestoration && state.options.scrollPos) {
      window.scrollTo(state.options.scrollPos[0], state.options.scrollPos[1])
    }

    this.state = {
      numPendingSwitches: 0,
      href: null,
      options: null
    }
  }
}

Pjax.isSupported = require("./lib/is-supported.js")

// arguably could do `if( require("./lib/is-supported.js")()) {` but that might be a little to simple
if (Pjax.isSupported()) {
  module.exports = Pjax
}
// if there isn’t required browser functions, returning stupid api
else {
  var stupidPjax = noop
  for (var key in Pjax.prototype) {
    if (Pjax.prototype.hasOwnProperty(key) && typeof Pjax.prototype[key] === "function") {
      stupidPjax[key] = noop
    }
  }

  module.exports = stupidPjax
}

},{"./lib/abort-request.js":22,"./lib/events/on.js":24,"./lib/events/trigger.js":25,"./lib/execute-scripts.js":26,"./lib/foreach-els.js":27,"./lib/foreach-selectors.js":28,"./lib/is-supported.js":29,"./lib/parse-options.js":30,"./lib/proto/attach-form.js":31,"./lib/proto/attach-link.js":32,"./lib/proto/handle-response.js":33,"./lib/proto/log.js":34,"./lib/proto/parse-element":35,"./lib/send-request.js":36,"./lib/switches":38,"./lib/switches-selectors.js":37,"./lib/uniqueid.js":39,"./lib/util/clone.js":40,"./lib/util/contains.js":41,"./lib/util/extend.js":42,"./lib/util/noop":43}],22:[function(require,module,exports){
var noop = require("./util/noop")

module.exports = function(request) {
  if (request && request.readyState < 4) {
    request.onreadystatechange = noop
    request.abort()
  }
}

},{"./util/noop":43}],23:[function(require,module,exports){
module.exports = function(el) {
  var code = (el.text || el.textContent || el.innerHTML || "")
  var src = (el.src || "")
  var parent = el.parentNode || document.querySelector("head") || document.documentElement
  var script = document.createElement("script")

  if (code.match("document.write")) {
    if (console && console.log) {
      console.log("Script contains document.write. Can’t be executed correctly. Code skipped ", el)
    }
    return false
  }

  script.type = "text/javascript"

  /* istanbul ignore if */
  if (src !== "") {
    script.src = src
    script.async = false // force synchronous loading of peripheral JS
  }

  if (code !== "") {
    try {
      script.appendChild(document.createTextNode(code))
    }
    catch (e) {
      /* istanbul ignore next */
      // old IEs have funky script nodes
      script.text = code
    }
  }

  // execute
  parent.appendChild(script)
  // avoid pollution only in head or body tags
  if (parent instanceof HTMLHeadElement || parent instanceof HTMLBodyElement) {
    parent.removeChild(script)
  }

  return true
}

},{}],24:[function(require,module,exports){
var forEachEls = require("../foreach-els")

module.exports = function(els, events, listener, useCapture) {
  events = (typeof events === "string" ? events.split(" ") : events)

  events.forEach(function(e) {
    forEachEls(els, function(el) {
      el.addEventListener(e, listener, useCapture)
    })
  })
}

},{"../foreach-els":27}],25:[function(require,module,exports){
var forEachEls = require("../foreach-els")

module.exports = function(els, events, opts) {
  events = (typeof events === "string" ? events.split(" ") : events)

  events.forEach(function(e) {
    var event
    event = document.createEvent("HTMLEvents")
    event.initEvent(e, true, true)
    event.eventName = e
    if (opts) {
      Object.keys(opts).forEach(function(key) {
        event[key] = opts[key]
      })
    }

    forEachEls(els, function(el) {
      var domFix = false
      if (!el.parentNode && el !== document && el !== window) {
        // THANK YOU IE (9/10/11)
        // dispatchEvent doesn't work if the element is not in the DOM
        domFix = true
        document.body.appendChild(el)
      }
      el.dispatchEvent(event)
      if (domFix) {
        el.parentNode.removeChild(el)
      }
    })
  })
}

},{"../foreach-els":27}],26:[function(require,module,exports){
var forEachEls = require("./foreach-els")
var evalScript = require("./eval-script")
// Finds and executes scripts (used for newly added elements)
// Needed since innerHTML does not run scripts
module.exports = function(el) {
  if (el.tagName.toLowerCase() === "script") {
    evalScript(el)
  }

  forEachEls(el.querySelectorAll("script"), function(script) {
    if (!script.type || script.type.toLowerCase() === "text/javascript") {
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
      evalScript(script)
    }
  })
}

},{"./eval-script":23,"./foreach-els":27}],27:[function(require,module,exports){
/* global HTMLCollection: true */

module.exports = function(els, fn, context) {
  if (els instanceof HTMLCollection || els instanceof NodeList || els instanceof Array) {
    return Array.prototype.forEach.call(els, fn, context)
  }
  // assume simple DOM element
  return fn.call(context, els)
}

},{}],28:[function(require,module,exports){
var forEachEls = require("./foreach-els")

module.exports = function(selectors, cb, context, DOMcontext) {
  DOMcontext = DOMcontext || document
  selectors.forEach(function(selector) {
    forEachEls(DOMcontext.querySelectorAll(selector), cb, context)
  })
}

},{"./foreach-els":27}],29:[function(require,module,exports){
module.exports = function() {
  // Borrowed wholesale from https://github.com/defunkt/jquery-pjax
  return window.history &&
    window.history.pushState &&
    window.history.replaceState &&
    // pushState isn’t reliable on iOS until 5.
    !navigator.userAgent.match(/((iPod|iPhone|iPad).+\bOS\s+[1-4]\D|WebApps\/.+CFNetwork)/)
}

},{}],30:[function(require,module,exports){
/* global _gaq: true, ga: true */

var defaultSwitches = require("./switches")

module.exports = function(options) {
  options = options || {}
  options.elements = options.elements || "a[href], form[action]"
  options.selectors = options.selectors || ["title", ".js-Pjax"]
  options.switches = options.switches || {}
  options.switchesOptions = options.switchesOptions || {}
  options.history = (typeof options.history === "undefined") ? true : options.history
  options.analytics = (typeof options.analytics === "function" || options.analytics === false) ? options.analytics : defaultAnalytics
  options.scrollTo = (typeof options.scrollTo === "undefined") ? 0 : options.scrollTo
  options.scrollRestoration = (typeof options.scrollRestoration !== "undefined") ? options.scrollRestoration : true
  options.cacheBust = (typeof options.cacheBust === "undefined") ? true : options.cacheBust
  options.debug = options.debug || false
  options.timeout = options.timeout || 0
  options.currentUrlFullReload = (typeof options.currentUrlFullReload === "undefined") ? false : options.currentUrlFullReload

  // We can’t replace body.outerHTML or head.outerHTML.
  // It creates a bug where a new body or head are created in the DOM.
  // If you set head.outerHTML, a new body tag is appended, so the DOM has 2 body nodes, and vice versa
  if (!options.switches.head) {
    options.switches.head = defaultSwitches.switchElementsAlt
  }
  if (!options.switches.body) {
    options.switches.body = defaultSwitches.switchElementsAlt
  }

  return options
}

/* istanbul ignore next */
function defaultAnalytics() {
  if (window._gaq) {
    _gaq.push(["_trackPageview"])
  }
  if (window.ga) {
    ga("send", "pageview", {page: location.pathname, title: document.title})
  }
}

},{"./switches":38}],31:[function(require,module,exports){
var on = require("../events/on")
var clone = require("../util/clone")

var attrState = "data-pjax-state"

var formAction = function(el, event) {
  if (isDefaultPrevented(event)) {
    return
  }

  // Since loadUrl modifies options and we may add our own modifications below,
  // clone it so the changes don't persist
  var options = clone(this.options)

  // Initialize requestOptions
  options.requestOptions = {
    requestUrl: el.getAttribute("action") || window.location.href,
    requestMethod: el.getAttribute("method") || "GET"
  }

  // create a testable virtual link of the form action
  var virtLinkElement = document.createElement("a")
  virtLinkElement.setAttribute("href", options.requestOptions.requestUrl)

  var attrValue = checkIfShouldAbort(virtLinkElement, options)
  if (attrValue) {
    el.setAttribute(attrState, attrValue)
    return
  }

  event.preventDefault()

  if (el.enctype === "multipart/form-data") {
    options.requestOptions.formData = new FormData(el)
  }
  else {
    options.requestOptions.requestParams = parseFormElements(el)
  }

  el.setAttribute(attrState, "submit")

  options.triggerElement = el
  this.loadUrl(virtLinkElement.href, options)
}

function parseFormElements(el) {
  var requestParams = []

  for (var elementKey in el.elements) {
    if (Number.isNaN(Number(elementKey))) {
      continue;
    }

    var element = el.elements[elementKey]
    var tagName = element.tagName.toLowerCase()
    // jscs:disable disallowImplicitTypeConversion
    if (!!element.name && element.attributes !== undefined && tagName !== "button") {
      // jscs:enable disallowImplicitTypeConversion
      var type = element.attributes.type

      if ((!type || type.value !== "checkbox" && type.value !== "radio") || element.checked) {
        // Build array of values to submit
        var values = []

        if (tagName === "select") {
          var opt

          for (var i = 0; i < element.options.length; i++) {
            opt = element.options[i]
            if (opt.selected && !opt.disabled) {
              values.push(opt.hasAttribute("value") ? opt.value : opt.text)
            }
          }
        }
        else {
          values.push(element.value)
        }

        for (var j = 0; j < values.length; j++) {
          requestParams.push({
            name: encodeURIComponent(element.name),
            value: encodeURIComponent(values[j])
          })
        }
      }
    }
  }

  return requestParams
}

function checkIfShouldAbort(virtLinkElement, options) {
  // Ignore external links.
  if (virtLinkElement.protocol !== window.location.protocol || virtLinkElement.host !== window.location.host) {
    return "external"
  }

  // Ignore click if we are on an anchor on the same page
  if (virtLinkElement.hash && virtLinkElement.href.replace(virtLinkElement.hash, "") === window.location.href.replace(location.hash, "")) {
    return "anchor"
  }

  // Ignore empty anchor "foo.html#"
  if (virtLinkElement.href === window.location.href.split("#")[0] + "#") {
    return "anchor-empty"
  }

  // if declared as a full reload, just normally submit the form
  if (options.currentUrlFullReload && virtLinkElement.href === window.location.href.split("#")[0]) {
    return "reload"
  }
}

var isDefaultPrevented = function(event) {
  return event.defaultPrevented || event.returnValue === false
}

module.exports = function(el) {
  var that = this

  el.setAttribute(attrState, "")

  on(el, "submit", function(event) {
    formAction.call(that, el, event)
  })

  on(el, "keyup", function(event) {
    if (event.keyCode === 13) {
      formAction.call(that, el, event)
    }
  }.bind(this))
}

},{"../events/on":24,"../util/clone":40}],32:[function(require,module,exports){
var on = require("../events/on")
var clone = require("../util/clone")

var attrState = "data-pjax-state"

var linkAction = function(el, event) {
  if (isDefaultPrevented(event)) {
    return
  }

  // Since loadUrl modifies options and we may add our own modifications below,
  // clone it so the changes don't persist
  var options = clone(this.options)

  var attrValue = checkIfShouldAbort(el, event)
  if (attrValue) {
    el.setAttribute(attrState, attrValue)
    return
  }

  event.preventDefault()

  // don’t do "nothing" if user try to reload the page by clicking the same link twice
  if (
    this.options.currentUrlFullReload &&
    el.href === window.location.href.split("#")[0]
  ) {
    el.setAttribute(attrState, "reload")
    this.reload()
    return
  }

  el.setAttribute(attrState, "load")

  options.triggerElement = el
  this.loadUrl(el.href, options)
}

function checkIfShouldAbort(el, event) {
  // Don’t break browser special behavior on links (like page in new window)
  if (event.which > 1 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
    return "modifier"
  }

  // we do test on href now to prevent unexpected behavior if for some reason
  // user have href that can be dynamically updated

  // Ignore external links.
  if (el.protocol !== window.location.protocol || el.host !== window.location.host) {
    return "external"
  }

  // Ignore anchors on the same page (keep native behavior)
  if (el.hash && el.href.replace(el.hash, "") === window.location.href.replace(location.hash, "")) {
    return "anchor"
  }

  // Ignore empty anchor "foo.html#"
  if (el.href === window.location.href.split("#")[0] + "#") {
    return "anchor-empty"
  }
}

var isDefaultPrevented = function(event) {
  return event.defaultPrevented || event.returnValue === false
}

module.exports = function(el) {
  var that = this

  el.setAttribute(attrState, "")

  on(el, "click", function(event) {
    linkAction.call(that, el, event)
  })

  on(el, "keyup", function(event) {
    if (event.keyCode === 13) {
      linkAction.call(that, el, event)
    }
  }.bind(this))
}

},{"../events/on":24,"../util/clone":40}],33:[function(require,module,exports){
var clone = require("../util/clone.js")
var newUid = require("../uniqueid.js")
var trigger = require("../events/trigger.js")

module.exports = function(responseText, request, href, options) {
  options = clone(options  || this.options)
  options.request = request

  // Fail if unable to load HTML via AJAX
  if (responseText === false) {
    trigger(document, "pjax:complete pjax:error", options)

    return
  }

  // push scroll position to history
  var currentState = window.history.state || {}
  window.history.replaceState({
      url: currentState.url || window.location.href,
      title: currentState.title || document.title,
      uid: currentState.uid || newUid(),
      scrollPos: [document.documentElement.scrollLeft || document.body.scrollLeft,
        document.documentElement.scrollTop || document.body.scrollTop]
    },
    document.title, window.location)

  // Check for redirects
  var oldHref = href
  if (request.responseURL) {
    if (href !== request.responseURL) {
      href = request.responseURL
    }
  }
  else if (request.getResponseHeader("X-PJAX-URL")) {
    href = request.getResponseHeader("X-PJAX-URL")
  }
  else if (request.getResponseHeader("X-XHR-Redirected-To")) {
    href = request.getResponseHeader("X-XHR-Redirected-To")
  }

  // Add back the hash if it was removed
  var a = document.createElement("a")
  a.href = oldHref
  var oldHash = a.hash
  a.href = href
  if (oldHash && !a.hash) {
    a.hash = oldHash
    href = a.href
  }

  this.state.href = href
  this.state.options = options

  try {
    this.loadContent(responseText, options)
  }
  catch (e) {
    trigger(document, "pjax:error", options)

    if (!this.options.debug) {
      if (console && console.error) {
        console.error("Pjax switch fail: ", e)
      }
      return this.latestChance(href)
    }
    else {
      throw e
    }
  }
}

},{"../events/trigger.js":25,"../uniqueid.js":39,"../util/clone.js":40}],34:[function(require,module,exports){
module.exports = function() {
  if (this.options.debug && console) {
    if (typeof console.log === "function") {
      console.log.apply(console, arguments)
    }
    // IE is weird
    else if (console.log) {
      console.log(arguments)
    }
  }
}

},{}],35:[function(require,module,exports){
var attrState = "data-pjax-state"

module.exports = function(el) {
  switch (el.tagName.toLowerCase()) {
    case "a":
      // only attach link if el does not already have link attached
      if (!el.hasAttribute(attrState)) {
        this.attachLink(el)
      }
      break

    case "form":
      // only attach link if el does not already have link attached
      if (!el.hasAttribute(attrState)) {
        this.attachForm(el)
      }
      break

    default:
      throw "Pjax can only be applied on <a> or <form> submit"
  }
}

},{}],36:[function(require,module,exports){
var updateQueryString = require("./util/update-query-string");

module.exports = function(location, options, callback) {
  options = options || {}
  var queryString
  var requestOptions = options.requestOptions || {}
  var requestMethod = (requestOptions.requestMethod || "GET").toUpperCase()
  var requestParams = requestOptions.requestParams || null
  var formData = requestOptions.formData || null;
  var requestPayload = null
  var request = new XMLHttpRequest()
  var timeout = options.timeout || 0

  request.onreadystatechange = function() {
    if (request.readyState === 4) {
      if (request.status === 200) {
        callback(request.responseText, request, location, options)
      }
      else if (request.status !== 0) {
        callback(null, request, location, options)
      }
    }
  }

  request.onerror = function(e) {
    console.log(e)
    callback(null, request, location, options)
  }

  request.ontimeout = function() {
    callback(null, request, location, options)
  }

  // Prepare the request payload for forms, if available
  if (requestParams && requestParams.length) {
    // Build query string
    queryString = (requestParams.map(function(param) {return param.name + "=" + param.value})).join("&")

    switch (requestMethod) {
      case "GET":
        // Reset query string to avoid an issue with repeat submissions where checkboxes that were
        // previously checked are incorrectly preserved
        location = location.split("?")[0]

        // Append new query string
        location += "?" + queryString
        break

      case "POST":
        // Send query string as request payload
        requestPayload = queryString
        break
    }
  }
  else if (formData) {
    requestPayload = formData
  }

  // Add a timestamp as part of the query string if cache busting is enabled
  if (options.cacheBust) {
    location = updateQueryString(location, "t", Date.now())
  }

  request.open(requestMethod, location, true)
  request.timeout = timeout
  request.setRequestHeader("X-Requested-With", "XMLHttpRequest")
  request.setRequestHeader("X-PJAX", "true")
  request.setRequestHeader("X-PJAX-Selectors", JSON.stringify(options.selectors))

  // Send the proper header information for POST forms
  if (requestPayload && requestMethod === "POST" && !formData) {
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
  }

  request.send(requestPayload)

  return request
}

},{"./util/update-query-string":44}],37:[function(require,module,exports){
var forEachEls = require("./foreach-els")

var defaultSwitches = require("./switches")

module.exports = function(switches, switchesOptions, selectors, fromEl, toEl, options) {
  var switchesQueue = []

  selectors.forEach(function(selector) {
    var newEls = fromEl.querySelectorAll(selector)
    var oldEls = toEl.querySelectorAll(selector)
    if (this.log) {
      this.log("Pjax switch", selector, newEls, oldEls)
    }
    if (newEls.length !== oldEls.length) {
      throw "DOM doesn’t look the same on new loaded page: ’" + selector + "’ - new " + newEls.length + ", old " + oldEls.length
    }

    forEachEls(newEls, function(newEl, i) {
      var oldEl = oldEls[i]
      if (this.log) {
        this.log("newEl", newEl, "oldEl", oldEl)
      }

      var callback = (switches[selector]) ?
        switches[selector].bind(this, oldEl, newEl, options, switchesOptions[selector]) :
        defaultSwitches.outerHTML.bind(this, oldEl, newEl, options)

      switchesQueue.push(callback)
    }, this)
  }, this)

  this.state.numPendingSwitches = switchesQueue.length

  switchesQueue.forEach(function(queuedSwitch) {
    queuedSwitch()
  })
}

},{"./foreach-els":27,"./switches":38}],38:[function(require,module,exports){
var on = require("./events/on.js")

module.exports = {
  outerHTML: function(oldEl, newEl) {
    oldEl.outerHTML = newEl.outerHTML
    this.onSwitch()
  },

  innerHTML: function(oldEl, newEl) {
    oldEl.innerHTML = newEl.innerHTML

    if (newEl.className === "") {
      oldEl.removeAttribute("class")
    }
    else {
      oldEl.className = newEl.className
    }

    this.onSwitch()
  },

  switchElementsAlt: function(oldEl, newEl) {
    oldEl.innerHTML = newEl.innerHTML

    // Copy attributes from the new element to the old one
    if (newEl.hasAttributes()) {
      var attrs = newEl.attributes
      for (var i = 0; i < attrs.length; i++) {
        oldEl.attributes.setNamedItem(attrs[i].cloneNode())
      }
    }

    this.onSwitch()
  },

  // Equivalent to outerHTML(), but doesn't require switchElementsAlt() for <head> and <body>
  replaceNode: function(oldEl, newEl) {
    oldEl.parentNode.replaceChild(newEl, oldEl)
    this.onSwitch()
  },

  sideBySide: function(oldEl, newEl, options, switchOptions) {
    var forEach = Array.prototype.forEach
    var elsToRemove = []
    var elsToAdd = []
    var fragToAppend = document.createDocumentFragment()
    var animationEventNames = "animationend webkitAnimationEnd MSAnimationEnd oanimationend"
    var animatedElsNumber = 0
    var sexyAnimationEnd = function(e) {
          if (e.target !== e.currentTarget) {
            // end triggered by an animation on a child
            return
          }

          animatedElsNumber--
          if (animatedElsNumber <= 0 && elsToRemove) {
            elsToRemove.forEach(function(el) {
              // browsing quickly can make the el
              // already removed by last page update ?
              if (el.parentNode) {
                el.parentNode.removeChild(el)
              }
            })

            elsToAdd.forEach(function(el) {
              el.className = el.className.replace(el.getAttribute("data-pjax-classes"), "")
              el.removeAttribute("data-pjax-classes")
            })

            elsToAdd = null // free memory
            elsToRemove = null // free memory

            // this is to trigger some repaint (example: picturefill)
            this.onSwitch()
          }
        }.bind(this)

    switchOptions = switchOptions || {}

    forEach.call(oldEl.childNodes, function(el) {
      elsToRemove.push(el)
      if (el.classList && !el.classList.contains("js-Pjax-remove")) {
        // for fast switch, clean element that just have been added, & not cleaned yet.
        if (el.hasAttribute("data-pjax-classes")) {
          el.className = el.className.replace(el.getAttribute("data-pjax-classes"), "")
          el.removeAttribute("data-pjax-classes")
        }
        el.classList.add("js-Pjax-remove")
        if (switchOptions.callbacks && switchOptions.callbacks.removeElement) {
          switchOptions.callbacks.removeElement(el)
        }
        if (switchOptions.classNames) {
          el.className += " " + switchOptions.classNames.remove + " " + (options.backward ? switchOptions.classNames.backward : switchOptions.classNames.forward)
        }
        animatedElsNumber++
        on(el, animationEventNames, sexyAnimationEnd, true)
      }
    })

    forEach.call(newEl.childNodes, function(el) {
      if (el.classList) {
        var addClasses = ""
        if (switchOptions.classNames) {
          addClasses = " js-Pjax-add " + switchOptions.classNames.add + " " + (options.backward ? switchOptions.classNames.forward : switchOptions.classNames.backward)
        }
        if (switchOptions.callbacks && switchOptions.callbacks.addElement) {
          switchOptions.callbacks.addElement(el)
        }
        el.className += addClasses
        el.setAttribute("data-pjax-classes", addClasses)
        elsToAdd.push(el)
        fragToAppend.appendChild(el)
        animatedElsNumber++
        on(el, animationEventNames, sexyAnimationEnd, true)
      }
    })

    // pass all className of the parent
    oldEl.className = newEl.className
    oldEl.appendChild(fragToAppend)
  }
}

},{"./events/on.js":24}],39:[function(require,module,exports){
module.exports = (function() {
  var counter = 0
  return function() {
    var id = ("pjax" + (new Date().getTime())) + "_" + counter
    counter++
    return id
  }
})()

},{}],40:[function(require,module,exports){
module.exports = function(obj) {
  /* istanbul ignore if */
  if (null === obj || "object" !== typeof obj) {
    return obj
  }
  var copy = obj.constructor()
  for (var attr in obj) {
    if (obj.hasOwnProperty(attr)) {
      copy[attr] = obj[attr]
    }
  }
  return copy
}

},{}],41:[function(require,module,exports){
module.exports = function contains(doc, selectors, el) {
  for (var i = 0; i < selectors.length; i++) {
    var selectedEls = doc.querySelectorAll(selectors[i])
    for (var j = 0; j < selectedEls.length; j++) {
      if (selectedEls[j].contains(el)) {
        return true
      }
    }
  }

  return false
}

},{}],42:[function(require,module,exports){
module.exports = function(target) {
  if (target == null) {
    return null
  }

  var to = Object(target)

  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i]

    if (source != null) {
      for (var key in source) {
        // Avoid bugs when hasOwnProperty is shadowed
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          to[key] = source[key]
        }
      }
    }
  }
  return to
}

},{}],43:[function(require,module,exports){
module.exports = function() {}

},{}],44:[function(require,module,exports){
module.exports = function(uri, key, value) {
  var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i")
  var separator = uri.indexOf("?") !== -1 ? "&" : "?"
  if (uri.match(re)) {
    return uri.replace(re, "$1" + key + "=" + value + "$2")
  }
  else {
    return uri + separator + key + "=" + value
  }
}

},{}],45:[function(require,module,exports){
!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.Scrollbar=e():t.Scrollbar=e()}(this,function(){return function(t){function e(r){if(n[r])return n[r].exports;var o=n[r]={exports:{},id:r,loaded:!1};return t[r].call(o.exports,o,o.exports,e),o.loaded=!0,o.exports}var n={};return e.m=t,e.c=n,e.p="",e(0)}([function(t,e,n){t.exports=n(1)},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}function o(t){if(Array.isArray(t)){for(var e=0,n=Array(t.length);e<t.length;e++)n[e]=t[e];return n}return(0,u.default)(t)}var i=n(2),u=r(i),a=n(55),c=r(a),l=n(62),f=r(l);Object.defineProperty(e,"__esModule",{value:!0});var s="function"==typeof f.default&&"symbol"==typeof c.default?function(t){return typeof t}:function(t){return t&&"function"==typeof f.default&&t.constructor===f.default&&t!==f.default.prototype?"symbol":typeof t},d=n(77),h=n(88);n(133),n(150),n(163),n(178),n(193),e.default=d.SmoothScrollbar,d.SmoothScrollbar.version="7.3.1",d.SmoothScrollbar.init=function(t,e){if(!t||1!==t.nodeType)throw new TypeError("expect element to be DOM Element, but got "+("undefined"==typeof t?"undefined":s(t)));if(h.sbList.has(t))return h.sbList.get(t);t.setAttribute("data-scrollbar","");var n=[].concat(o(t.childNodes)),r=document.createElement("div");r.innerHTML='\n        <article class="scroll-content"></article>\n        <aside class="scrollbar-track scrollbar-track-x">\n            <div class="scrollbar-thumb scrollbar-thumb-x"></div>\n        </aside>\n        <aside class="scrollbar-track scrollbar-track-y">\n            <div class="scrollbar-thumb scrollbar-thumb-y"></div>\n        </aside>\n        <canvas class="overscroll-glow"></canvas>\n    ';var i=r.querySelector(".scroll-content");return[].concat(o(r.childNodes)).forEach(function(e){return t.appendChild(e)}),n.forEach(function(t){return i.appendChild(t)}),new d.SmoothScrollbar(t,e)},d.SmoothScrollbar.initAll=function(t){return[].concat(o(document.querySelectorAll(h.selectors))).map(function(e){return d.SmoothScrollbar.init(e,t)})},d.SmoothScrollbar.has=function(t){return h.sbList.has(t)},d.SmoothScrollbar.get=function(t){return h.sbList.get(t)},d.SmoothScrollbar.getAll=function(){return[].concat(o(h.sbList.values()))},d.SmoothScrollbar.destroy=function(t,e){return d.SmoothScrollbar.has(t)&&d.SmoothScrollbar.get(t).destroy(e)},d.SmoothScrollbar.destroyAll=function(t){h.sbList.forEach(function(e){e.destroy(t)})},t.exports=e.default},function(t,e,n){t.exports={default:n(3),__esModule:!0}},function(t,e,n){n(4),n(48),t.exports=n(12).Array.from},function(t,e,n){"use strict";var r=n(5)(!0);n(8)(String,"String",function(t){this._t=String(t),this._i=0},function(){var t,e=this._t,n=this._i;return n>=e.length?{value:void 0,done:!0}:(t=r(e,n),this._i+=t.length,{value:t,done:!1})})},function(t,e,n){var r=n(6),o=n(7);t.exports=function(t){return function(e,n){var i,u,a=String(o(e)),c=r(n),l=a.length;return c<0||c>=l?t?"":void 0:(i=a.charCodeAt(c),i<55296||i>56319||c+1===l||(u=a.charCodeAt(c+1))<56320||u>57343?t?a.charAt(c):i:t?a.slice(c,c+2):(i-55296<<10)+(u-56320)+65536)}}},function(t,e){var n=Math.ceil,r=Math.floor;t.exports=function(t){return isNaN(t=+t)?0:(t>0?r:n)(t)}},function(t,e){t.exports=function(t){if(void 0==t)throw TypeError("Can't call method on  "+t);return t}},function(t,e,n){"use strict";var r=n(9),o=n(10),i=n(26),u=n(15),a=n(27),c=n(28),l=n(44),f=n(46),s=n(45)("iterator"),d=!([].keys&&"next"in[].keys()),h="@@iterator",v="keys",_="values",p=function(){return this};t.exports=function(t,e,n,y,b,g,m){c(n,e,y);var x,S,E,M=function(t){if(!d&&t in T)return T[t];switch(t){case v:return function(){return new n(this,t)};case _:return function(){return new n(this,t)}}return function(){return new n(this,t)}},O=e+" Iterator",w=b==_,P=!1,T=t.prototype,k=T[s]||T[h]||b&&T[b],j=k||M(b),A=b?w?M("entries"):j:void 0,L="Array"==e?T.entries||k:k;if(L&&(E=f(L.call(new t)),E!==Object.prototype&&E.next&&(l(E,O,!0),r||"function"==typeof E[s]||u(E,s,p))),w&&k&&k.name!==_&&(P=!0,j=function(){return k.call(this)}),r&&!m||!d&&!P&&T[s]||u(T,s,j),a[e]=j,a[O]=p,b)if(x={values:w?j:M(_),keys:g?j:M(v),entries:A},m)for(S in x)S in T||i(T,S,x[S]);else o(o.P+o.F*(d||P),e,x);return x}},function(t,e){t.exports=!0},function(t,e,n){var r=n(11),o=n(12),i=n(13),u=n(15),a=n(25),c="prototype",l=function(t,e,n){var f,s,d,h=t&l.F,v=t&l.G,_=t&l.S,p=t&l.P,y=t&l.B,b=t&l.W,g=v?o:o[e]||(o[e]={}),m=g[c],x=v?r:_?r[e]:(r[e]||{})[c];v&&(n=e);for(f in n)s=!h&&x&&void 0!==x[f],s&&a(g,f)||(d=s?x[f]:n[f],g[f]=v&&"function"!=typeof x[f]?n[f]:y&&s?i(d,r):b&&x[f]==d?function(t){var e=function(e,n,r){if(this instanceof t){switch(arguments.length){case 0:return new t;case 1:return new t(e);case 2:return new t(e,n)}return new t(e,n,r)}return t.apply(this,arguments)};return e[c]=t[c],e}(d):p&&"function"==typeof d?i(Function.call,d):d,p&&((g.virtual||(g.virtual={}))[f]=d,t&l.R&&m&&!m[f]&&u(m,f,d)))};l.F=1,l.G=2,l.S=4,l.P=8,l.B=16,l.W=32,l.U=64,l.R=128,t.exports=l},function(t,e){var n=t.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=n)},function(t,e){var n=t.exports={version:"2.5.7"};"number"==typeof __e&&(__e=n)},function(t,e,n){var r=n(14);t.exports=function(t,e,n){if(r(t),void 0===e)return t;switch(n){case 1:return function(n){return t.call(e,n)};case 2:return function(n,r){return t.call(e,n,r)};case 3:return function(n,r,o){return t.call(e,n,r,o)}}return function(){return t.apply(e,arguments)}}},function(t,e){t.exports=function(t){if("function"!=typeof t)throw TypeError(t+" is not a function!");return t}},function(t,e,n){var r=n(16),o=n(24);t.exports=n(20)?function(t,e,n){return r.f(t,e,o(1,n))}:function(t,e,n){return t[e]=n,t}},function(t,e,n){var r=n(17),o=n(19),i=n(23),u=Object.defineProperty;e.f=n(20)?Object.defineProperty:function(t,e,n){if(r(t),e=i(e,!0),r(n),o)try{return u(t,e,n)}catch(t){}if("get"in n||"set"in n)throw TypeError("Accessors not supported!");return"value"in n&&(t[e]=n.value),t}},function(t,e,n){var r=n(18);t.exports=function(t){if(!r(t))throw TypeError(t+" is not an object!");return t}},function(t,e){t.exports=function(t){return"object"==typeof t?null!==t:"function"==typeof t}},function(t,e,n){t.exports=!n(20)&&!n(21)(function(){return 7!=Object.defineProperty(n(22)("div"),"a",{get:function(){return 7}}).a})},function(t,e,n){t.exports=!n(21)(function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a})},function(t,e){t.exports=function(t){try{return!!t()}catch(t){return!0}}},function(t,e,n){var r=n(18),o=n(11).document,i=r(o)&&r(o.createElement);t.exports=function(t){return i?o.createElement(t):{}}},function(t,e,n){var r=n(18);t.exports=function(t,e){if(!r(t))return t;var n,o;if(e&&"function"==typeof(n=t.toString)&&!r(o=n.call(t)))return o;if("function"==typeof(n=t.valueOf)&&!r(o=n.call(t)))return o;if(!e&&"function"==typeof(n=t.toString)&&!r(o=n.call(t)))return o;throw TypeError("Can't convert object to primitive value")}},function(t,e){t.exports=function(t,e){return{enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:e}}},function(t,e){var n={}.hasOwnProperty;t.exports=function(t,e){return n.call(t,e)}},function(t,e,n){t.exports=n(15)},function(t,e){t.exports={}},function(t,e,n){"use strict";var r=n(29),o=n(24),i=n(44),u={};n(15)(u,n(45)("iterator"),function(){return this}),t.exports=function(t,e,n){t.prototype=r(u,{next:o(1,n)}),i(t,e+" Iterator")}},function(t,e,n){var r=n(17),o=n(30),i=n(42),u=n(39)("IE_PROTO"),a=function(){},c="prototype",l=function(){var t,e=n(22)("iframe"),r=i.length,o="<",u=">";for(e.style.display="none",n(43).appendChild(e),e.src="javascript:",t=e.contentWindow.document,t.open(),t.write(o+"script"+u+"document.F=Object"+o+"/script"+u),t.close(),l=t.F;r--;)delete l[c][i[r]];return l()};t.exports=Object.create||function(t,e){var n;return null!==t?(a[c]=r(t),n=new a,a[c]=null,n[u]=t):n=l(),void 0===e?n:o(n,e)}},function(t,e,n){var r=n(16),o=n(17),i=n(31);t.exports=n(20)?Object.defineProperties:function(t,e){o(t);for(var n,u=i(e),a=u.length,c=0;a>c;)r.f(t,n=u[c++],e[n]);return t}},function(t,e,n){var r=n(32),o=n(42);t.exports=Object.keys||function(t){return r(t,o)}},function(t,e,n){var r=n(25),o=n(33),i=n(36)(!1),u=n(39)("IE_PROTO");t.exports=function(t,e){var n,a=o(t),c=0,l=[];for(n in a)n!=u&&r(a,n)&&l.push(n);for(;e.length>c;)r(a,n=e[c++])&&(~i(l,n)||l.push(n));return l}},function(t,e,n){var r=n(34),o=n(7);t.exports=function(t){return r(o(t))}},function(t,e,n){var r=n(35);t.exports=Object("z").propertyIsEnumerable(0)?Object:function(t){return"String"==r(t)?t.split(""):Object(t)}},function(t,e){var n={}.toString;t.exports=function(t){return n.call(t).slice(8,-1)}},function(t,e,n){var r=n(33),o=n(37),i=n(38);t.exports=function(t){return function(e,n,u){var a,c=r(e),l=o(c.length),f=i(u,l);if(t&&n!=n){for(;l>f;)if(a=c[f++],a!=a)return!0}else for(;l>f;f++)if((t||f in c)&&c[f]===n)return t||f||0;return!t&&-1}}},function(t,e,n){var r=n(6),o=Math.min;t.exports=function(t){return t>0?o(r(t),9007199254740991):0}},function(t,e,n){var r=n(6),o=Math.max,i=Math.min;t.exports=function(t,e){return t=r(t),t<0?o(t+e,0):i(t,e)}},function(t,e,n){var r=n(40)("keys"),o=n(41);t.exports=function(t){return r[t]||(r[t]=o(t))}},function(t,e,n){var r=n(12),o=n(11),i="__core-js_shared__",u=o[i]||(o[i]={});(t.exports=function(t,e){return u[t]||(u[t]=void 0!==e?e:{})})("versions",[]).push({version:r.version,mode:n(9)?"pure":"global",copyright:"© 2018 Denis Pushkarev (zloirock.ru)"})},function(t,e){var n=0,r=Math.random();t.exports=function(t){return"Symbol(".concat(void 0===t?"":t,")_",(++n+r).toString(36))}},function(t,e){t.exports="constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",")},function(t,e,n){var r=n(11).document;t.exports=r&&r.documentElement},function(t,e,n){var r=n(16).f,o=n(25),i=n(45)("toStringTag");t.exports=function(t,e,n){t&&!o(t=n?t:t.prototype,i)&&r(t,i,{configurable:!0,value:e})}},function(t,e,n){var r=n(40)("wks"),o=n(41),i=n(11).Symbol,u="function"==typeof i,a=t.exports=function(t){return r[t]||(r[t]=u&&i[t]||(u?i:o)("Symbol."+t))};a.store=r},function(t,e,n){var r=n(25),o=n(47),i=n(39)("IE_PROTO"),u=Object.prototype;t.exports=Object.getPrototypeOf||function(t){return t=o(t),r(t,i)?t[i]:"function"==typeof t.constructor&&t instanceof t.constructor?t.constructor.prototype:t instanceof Object?u:null}},function(t,e,n){var r=n(7);t.exports=function(t){return Object(r(t))}},function(t,e,n){"use strict";var r=n(13),o=n(10),i=n(47),u=n(49),a=n(50),c=n(37),l=n(51),f=n(52);o(o.S+o.F*!n(54)(function(t){Array.from(t)}),"Array",{from:function(t){var e,n,o,s,d=i(t),h="function"==typeof this?this:Array,v=arguments.length,_=v>1?arguments[1]:void 0,p=void 0!==_,y=0,b=f(d);if(p&&(_=r(_,v>2?arguments[2]:void 0,2)),void 0==b||h==Array&&a(b))for(e=c(d.length),n=new h(e);e>y;y++)l(n,y,p?_(d[y],y):d[y]);else for(s=b.call(d),n=new h;!(o=s.next()).done;y++)l(n,y,p?u(s,_,[o.value,y],!0):o.value);return n.length=y,n}})},function(t,e,n){var r=n(17);t.exports=function(t,e,n,o){try{return o?e(r(n)[0],n[1]):e(n)}catch(e){var i=t.return;throw void 0!==i&&r(i.call(t)),e}}},function(t,e,n){var r=n(27),o=n(45)("iterator"),i=Array.prototype;t.exports=function(t){return void 0!==t&&(r.Array===t||i[o]===t)}},function(t,e,n){"use strict";var r=n(16),o=n(24);t.exports=function(t,e,n){e in t?r.f(t,e,o(0,n)):t[e]=n}},function(t,e,n){var r=n(53),o=n(45)("iterator"),i=n(27);t.exports=n(12).getIteratorMethod=function(t){if(void 0!=t)return t[o]||t["@@iterator"]||i[r(t)]}},function(t,e,n){var r=n(35),o=n(45)("toStringTag"),i="Arguments"==r(function(){return arguments}()),u=function(t,e){try{return t[e]}catch(t){}};t.exports=function(t){var e,n,a;return void 0===t?"Undefined":null===t?"Null":"string"==typeof(n=u(e=Object(t),o))?n:i?r(e):"Object"==(a=r(e))&&"function"==typeof e.callee?"Arguments":a}},function(t,e,n){var r=n(45)("iterator"),o=!1;try{var i=[7][r]();i.return=function(){o=!0},Array.from(i,function(){throw 2})}catch(t){}t.exports=function(t,e){if(!e&&!o)return!1;var n=!1;try{var i=[7],u=i[r]();u.next=function(){return{done:n=!0}},i[r]=function(){return u},t(i)}catch(t){}return n}},function(t,e,n){t.exports={default:n(56),__esModule:!0}},function(t,e,n){n(4),n(57),t.exports=n(61).f("iterator")},function(t,e,n){n(58);for(var r=n(11),o=n(15),i=n(27),u=n(45)("toStringTag"),a="CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,TextTrackList,TouchList".split(","),c=0;c<a.length;c++){var l=a[c],f=r[l],s=f&&f.prototype;s&&!s[u]&&o(s,u,l),i[l]=i.Array}},function(t,e,n){"use strict";var r=n(59),o=n(60),i=n(27),u=n(33);t.exports=n(8)(Array,"Array",function(t,e){this._t=u(t),this._i=0,this._k=e},function(){var t=this._t,e=this._k,n=this._i++;return!t||n>=t.length?(this._t=void 0,o(1)):"keys"==e?o(0,n):"values"==e?o(0,t[n]):o(0,[n,t[n]])},"values"),i.Arguments=i.Array,r("keys"),r("values"),r("entries")},function(t,e){t.exports=function(){}},function(t,e){t.exports=function(t,e){return{value:e,done:!!t}}},function(t,e,n){e.f=n(45)},function(t,e,n){t.exports={default:n(63),__esModule:!0}},function(t,e,n){n(64),n(74),n(75),n(76),t.exports=n(12).Symbol},function(t,e,n){"use strict";var r=n(11),o=n(25),i=n(20),u=n(10),a=n(26),c=n(65).KEY,l=n(21),f=n(40),s=n(44),d=n(41),h=n(45),v=n(61),_=n(66),p=n(67),y=n(70),b=n(17),g=n(18),m=n(33),x=n(23),S=n(24),E=n(29),M=n(71),O=n(73),w=n(16),P=n(31),T=O.f,k=w.f,j=M.f,A=r.Symbol,L=r.JSON,R=L&&L.stringify,D="prototype",C=h("_hidden"),I=h("toPrimitive"),N={}.propertyIsEnumerable,F=f("symbol-registry"),H=f("symbols"),z=f("op-symbols"),B=Object[D],G="function"==typeof A,V=r.QObject,W=!V||!V[D]||!V[D].findChild,K=i&&l(function(){return 7!=E(k({},"a",{get:function(){return k(this,"a",{value:7}).a}})).a})?function(t,e,n){var r=T(B,e);r&&delete B[e],k(t,e,n),r&&t!==B&&k(B,e,r)}:k,U=function(t){var e=H[t]=E(A[D]);return e._k=t,e},Y=G&&"symbol"==typeof A.iterator?function(t){return"symbol"==typeof t}:function(t){return t instanceof A},q=function(t,e,n){return t===B&&q(z,e,n),b(t),e=x(e,!0),b(n),o(H,e)?(n.enumerable?(o(t,C)&&t[C][e]&&(t[C][e]=!1),n=E(n,{enumerable:S(0,!1)})):(o(t,C)||k(t,C,S(1,{})),t[C][e]=!0),K(t,e,n)):k(t,e,n)},X=function(t,e){b(t);for(var n,r=p(e=m(e)),o=0,i=r.length;i>o;)q(t,n=r[o++],e[n]);return t},J=function(t,e){return void 0===e?E(t):X(E(t),e)},Q=function(t){var e=N.call(this,t=x(t,!0));return!(this===B&&o(H,t)&&!o(z,t))&&(!(e||!o(this,t)||!o(H,t)||o(this,C)&&this[C][t])||e)},Z=function(t,e){if(t=m(t),e=x(e,!0),t!==B||!o(H,e)||o(z,e)){var n=T(t,e);return!n||!o(H,e)||o(t,C)&&t[C][e]||(n.enumerable=!0),n}},$=function(t){for(var e,n=j(m(t)),r=[],i=0;n.length>i;)o(H,e=n[i++])||e==C||e==c||r.push(e);return r},tt=function(t){for(var e,n=t===B,r=j(n?z:m(t)),i=[],u=0;r.length>u;)!o(H,e=r[u++])||n&&!o(B,e)||i.push(H[e]);return i};G||(A=function(){if(this instanceof A)throw TypeError("Symbol is not a constructor!");var t=d(arguments.length>0?arguments[0]:void 0),e=function(n){this===B&&e.call(z,n),o(this,C)&&o(this[C],t)&&(this[C][t]=!1),K(this,t,S(1,n))};return i&&W&&K(B,t,{configurable:!0,set:e}),U(t)},a(A[D],"toString",function(){return this._k}),O.f=Z,w.f=q,n(72).f=M.f=$,n(69).f=Q,n(68).f=tt,i&&!n(9)&&a(B,"propertyIsEnumerable",Q,!0),v.f=function(t){return U(h(t))}),u(u.G+u.W+u.F*!G,{Symbol:A});for(var et="hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables".split(","),nt=0;et.length>nt;)h(et[nt++]);for(var rt=P(h.store),ot=0;rt.length>ot;)_(rt[ot++]);u(u.S+u.F*!G,"Symbol",{for:function(t){return o(F,t+="")?F[t]:F[t]=A(t)},keyFor:function(t){if(!Y(t))throw TypeError(t+" is not a symbol!");for(var e in F)if(F[e]===t)return e},useSetter:function(){W=!0},useSimple:function(){W=!1}}),u(u.S+u.F*!G,"Object",{create:J,defineProperty:q,defineProperties:X,getOwnPropertyDescriptor:Z,getOwnPropertyNames:$,getOwnPropertySymbols:tt}),L&&u(u.S+u.F*(!G||l(function(){var t=A();return"[null]"!=R([t])||"{}"!=R({a:t})||"{}"!=R(Object(t))})),"JSON",{stringify:function(t){for(var e,n,r=[t],o=1;arguments.length>o;)r.push(arguments[o++]);if(n=e=r[1],(g(e)||void 0!==t)&&!Y(t))return y(e)||(e=function(t,e){if("function"==typeof n&&(e=n.call(this,t,e)),!Y(e))return e}),r[1]=e,R.apply(L,r)}}),A[D][I]||n(15)(A[D],I,A[D].valueOf),s(A,"Symbol"),s(Math,"Math",!0),s(r.JSON,"JSON",!0)},function(t,e,n){var r=n(41)("meta"),o=n(18),i=n(25),u=n(16).f,a=0,c=Object.isExtensible||function(){return!0},l=!n(21)(function(){return c(Object.preventExtensions({}))}),f=function(t){u(t,r,{value:{i:"O"+ ++a,w:{}}})},s=function(t,e){if(!o(t))return"symbol"==typeof t?t:("string"==typeof t?"S":"P")+t;if(!i(t,r)){if(!c(t))return"F";if(!e)return"E";f(t)}return t[r].i},d=function(t,e){if(!i(t,r)){if(!c(t))return!0;if(!e)return!1;f(t)}return t[r].w},h=function(t){return l&&v.NEED&&c(t)&&!i(t,r)&&f(t),t},v=t.exports={KEY:r,NEED:!1,fastKey:s,getWeak:d,onFreeze:h}},function(t,e,n){var r=n(11),o=n(12),i=n(9),u=n(61),a=n(16).f;t.exports=function(t){var e=o.Symbol||(o.Symbol=i?{}:r.Symbol||{});"_"==t.charAt(0)||t in e||a(e,t,{value:u.f(t)})}},function(t,e,n){var r=n(31),o=n(68),i=n(69);t.exports=function(t){var e=r(t),n=o.f;if(n)for(var u,a=n(t),c=i.f,l=0;a.length>l;)c.call(t,u=a[l++])&&e.push(u);return e}},function(t,e){e.f=Object.getOwnPropertySymbols},function(t,e){e.f={}.propertyIsEnumerable},function(t,e,n){var r=n(35);t.exports=Array.isArray||function(t){return"Array"==r(t)}},function(t,e,n){var r=n(33),o=n(72).f,i={}.toString,u="object"==typeof window&&window&&Object.getOwnPropertyNames?Object.getOwnPropertyNames(window):[],a=function(t){try{return o(t)}catch(t){return u.slice()}};t.exports.f=function(t){return u&&"[object Window]"==i.call(t)?a(t):o(r(t))}},function(t,e,n){var r=n(32),o=n(42).concat("length","prototype");e.f=Object.getOwnPropertyNames||function(t){return r(t,o)}},function(t,e,n){var r=n(69),o=n(24),i=n(33),u=n(23),a=n(25),c=n(19),l=Object.getOwnPropertyDescriptor;e.f=n(20)?l:function(t,e){if(t=i(t),e=u(e,!0),c)try{return l(t,e)}catch(t){}if(a(t,e))return o(!r.f.call(t,e),t[e])}},function(t,e){},function(t,e,n){n(66)("asyncIterator")},function(t,e,n){n(66)("observable")},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}function o(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var i=n(78),u=r(i),a=n(81),c=r(a),l=n(85),f=r(l);Object.defineProperty(e,"__esModule",{value:!0}),e.SmoothScrollbar=void 0;var s=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),(0,f.default)(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),d=n(88),h=n(116);e.SmoothScrollbar=function(){function t(e){var n=this,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};o(this,t),e.setAttribute("tabindex","1"),e.scrollTop=e.scrollLeft=0;var i=(0,h.findChild)(e,"scroll-content"),a=(0,h.findChild)(e,"overscroll-glow"),l=(0,h.findChild)(e,"scrollbar-track-x"),f=(0,h.findChild)(e,"scrollbar-track-y");if((0,h.setStyle)(e,{overflow:"hidden",outline:"none"}),(0,h.setStyle)(a,{display:"none","pointer-events":"none"}),this.__readonly("targets",(0,c.default)({container:e,content:i,canvas:{elem:a,context:a.getContext("2d")},xAxis:(0,c.default)({track:l,thumb:(0,h.findChild)(l,"scrollbar-thumb-x")}),yAxis:(0,c.default)({track:f,thumb:(0,h.findChild)(f,"scrollbar-thumb-y")})})).__readonly("offset",{x:0,y:0}).__readonly("thumbOffset",{x:0,y:0}).__readonly("limit",{x:1/0,y:1/0}).__readonly("movement",{x:0,y:0}).__readonly("movementLocked",{x:!1,y:!1}).__readonly("overscrollRendered",{x:0,y:0}).__readonly("overscrollBack",!1).__readonly("thumbSize",{x:0,y:0,realX:0,realY:0}).__readonly("bounding",{top:0,right:0,bottom:0,left:0}).__readonly("children",[]).__readonly("parents",[]).__readonly("size",this.getSize()).__readonly("isNestedScrollbar",!1),(0,u.default)(this,{__hideTrackThrottle:{value:(0,h.debounce)(this.hideTrack.bind(this),1e3,!1)},__updateThrottle:{value:(0,h.debounce)(this.update.bind(this))},__touchRecord:{value:new h.TouchRecord},__listeners:{value:[]},__handlers:{value:[]},__children:{value:[]},__timerID:{value:{}}}),this.__initOptions(r),this.__initReverseWheel(),this.__initScrollbar(),d.sbList.set(e,this),"function"==typeof d.GLOBAL_ENV.MutationObserver){var s=new d.GLOBAL_ENV.MutationObserver(function(){n.update(!0)});s.observe(i,{childList:!0}),Object.defineProperty(this,"__observer",{value:s})}}return s(t,[{key:"MAX_OVERSCROLL",get:function(){var t=this.options,e=this.size;switch(t.overscrollEffect){case"bounce":var n=Math.floor(Math.sqrt(Math.pow(e.container.width,2)+Math.pow(e.container.height,2))),r=this.__isMovementLocked()?2:10;return d.GLOBAL_ENV.TOUCH_SUPPORTED?(0,h.pickInRange)(n/r,100,1e3):(0,h.pickInRange)(n/10,25,50);case"glow":return 150;default:return 0}}},{key:"scrollTop",get:function(){return this.offset.y}},{key:"scrollLeft",get:function(){return this.offset.x}}]),t}()},function(t,e,n){t.exports={default:n(79),__esModule:!0}},function(t,e,n){n(80);var r=n(12).Object;t.exports=function(t,e){return r.defineProperties(t,e)}},function(t,e,n){var r=n(10);r(r.S+r.F*!n(20),"Object",{defineProperties:n(30)})},function(t,e,n){t.exports={default:n(82),__esModule:!0}},function(t,e,n){n(83),t.exports=n(12).Object.freeze},function(t,e,n){var r=n(18),o=n(65).onFreeze;n(84)("freeze",function(t){return function(e){return t&&r(e)?t(o(e)):e}})},function(t,e,n){var r=n(10),o=n(12),i=n(21);t.exports=function(t,e){var n=(o.Object||{})[t]||Object[t],u={};u[t]=e(n),r(r.S+r.F*i(function(){n(1)}),"Object",u)}},function(t,e,n){t.exports={default:n(86),__esModule:!0}},function(t,e,n){n(87);var r=n(12).Object;t.exports=function(t,e,n){return r.defineProperty(t,e,n)}},function(t,e,n){var r=n(10);r(r.S+r.F*!n(20),"Object",{defineProperty:n(16).f})},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}var o=n(85),i=r(o),u=n(89),a=r(u);Object.defineProperty(e,"__esModule",{value:!0});var c=n(92);(0,a.default)(c).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return c[t]}})})},function(t,e,n){t.exports={default:n(90),__esModule:!0}},function(t,e,n){n(91),t.exports=n(12).Object.keys},function(t,e,n){var r=n(47),o=n(31);n(84)("keys",function(){return function(t){return o(r(t))}})},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}var o=n(85),i=r(o),u=n(89),a=r(u);Object.defineProperty(e,"__esModule",{value:!0});var c=n(93);(0,a.default)(c).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return c[t]}})});var l=n(94);(0,a.default)(l).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return l[t]}})});var f=n(115);(0,a.default)(f).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return f[t]}})})},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}var o=n(85),i=r(o),u=n(89),a=r(u);Object.defineProperty(e,"__esModule",{value:!0});var c=function(t){var e={},n={};return(0,a.default)(t).forEach(function(r){(0,i.default)(e,r,{get:function(){if(!n.hasOwnProperty(r)){var e=t[r];n[r]=e()}return n[r]}})}),e},l={MutationObserver:function(){return window.MutationObserver||window.WebKitMutationObserver||window.MozMutationObserver},TOUCH_SUPPORTED:function(){return"ontouchstart"in document},EASING_MULTIPLIER:function(){return navigator.userAgent.match(/Android/)?.5:.25},WHEEL_EVENT:function(){return"onwheel"in window?"wheel":"mousewheel"}};e.GLOBAL_ENV=c(l)},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}var o=n(95),i=r(o);Object.defineProperty(e,"__esModule",{value:!0});var u=new i.default,a=u.set.bind(u),c=u.delete.bind(u);u.update=function(){u.forEach(function(t){t.__updateTree()})},u.delete=function(){var t=c.apply(void 0,arguments);return u.update(),t},u.set=function(){var t=a.apply(void 0,arguments);return u.update(),t},e.sbList=u},function(t,e,n){t.exports={default:n(96),__esModule:!0}},function(t,e,n){n(74),n(4),n(57),n(97),n(108),n(111),n(113),t.exports=n(12).Map},function(t,e,n){"use strict";var r=n(98),o=n(103),i="Map";t.exports=n(104)(i,function(t){return function(){return t(this,arguments.length>0?arguments[0]:void 0)}},{get:function(t){var e=r.getEntry(o(this,i),t);return e&&e.v},set:function(t,e){return r.def(o(this,i),0===t?0:t,e)}},r,!0)},function(t,e,n){"use strict";var r=n(16).f,o=n(29),i=n(99),u=n(13),a=n(100),c=n(101),l=n(8),f=n(60),s=n(102),d=n(20),h=n(65).fastKey,v=n(103),_=d?"_s":"size",p=function(t,e){var n,r=h(e);if("F"!==r)return t._i[r];for(n=t._f;n;n=n.n)if(n.k==e)return n};t.exports={getConstructor:function(t,e,n,l){var f=t(function(t,r){a(t,f,e,"_i"),t._t=e,t._i=o(null),t._f=void 0,t._l=void 0,t[_]=0,void 0!=r&&c(r,n,t[l],t)});return i(f.prototype,{clear:function(){for(var t=v(this,e),n=t._i,r=t._f;r;r=r.n)r.r=!0,r.p&&(r.p=r.p.n=void 0),delete n[r.i];t._f=t._l=void 0,t[_]=0},delete:function(t){var n=v(this,e),r=p(n,t);if(r){var o=r.n,i=r.p;delete n._i[r.i],r.r=!0,i&&(i.n=o),o&&(o.p=i),n._f==r&&(n._f=o),n._l==r&&(n._l=i),n[_]--}return!!r},forEach:function(t){v(this,e);for(var n,r=u(t,arguments.length>1?arguments[1]:void 0,3);n=n?n.n:this._f;)for(r(n.v,n.k,this);n&&n.r;)n=n.p},has:function(t){return!!p(v(this,e),t)}}),d&&r(f.prototype,"size",{get:function(){return v(this,e)[_]}}),f},def:function(t,e,n){var r,o,i=p(t,e);return i?i.v=n:(t._l=i={i:o=h(e,!0),k:e,v:n,p:r=t._l,n:void 0,r:!1},t._f||(t._f=i),r&&(r.n=i),t[_]++,"F"!==o&&(t._i[o]=i)),t},getEntry:p,setStrong:function(t,e,n){l(t,e,function(t,n){this._t=v(t,e),this._k=n,this._l=void 0},function(){for(var t=this,e=t._k,n=t._l;n&&n.r;)n=n.p;return t._t&&(t._l=n=n?n.n:t._t._f)?"keys"==e?f(0,n.k):"values"==e?f(0,n.v):f(0,[n.k,n.v]):(t._t=void 0,f(1))},n?"entries":"values",!n,!0),s(e)}}},function(t,e,n){var r=n(15);t.exports=function(t,e,n){for(var o in e)n&&t[o]?t[o]=e[o]:r(t,o,e[o]);return t}},function(t,e){t.exports=function(t,e,n,r){if(!(t instanceof e)||void 0!==r&&r in t)throw TypeError(n+": incorrect invocation!");return t}},function(t,e,n){var r=n(13),o=n(49),i=n(50),u=n(17),a=n(37),c=n(52),l={},f={},e=t.exports=function(t,e,n,s,d){var h,v,_,p,y=d?function(){return t}:c(t),b=r(n,s,e?2:1),g=0;if("function"!=typeof y)throw TypeError(t+" is not iterable!");if(i(y)){for(h=a(t.length);h>g;g++)if(p=e?b(u(v=t[g])[0],v[1]):b(t[g]),p===l||p===f)return p}else for(_=y.call(t);!(v=_.next()).done;)if(p=o(_,b,v.value,e),p===l||p===f)return p};e.BREAK=l,e.RETURN=f},function(t,e,n){"use strict";var r=n(11),o=n(12),i=n(16),u=n(20),a=n(45)("species");t.exports=function(t){var e="function"==typeof o[t]?o[t]:r[t];u&&e&&!e[a]&&i.f(e,a,{configurable:!0,get:function(){return this}})}},function(t,e,n){var r=n(18);t.exports=function(t,e){if(!r(t)||t._t!==e)throw TypeError("Incompatible receiver, "+e+" required!");return t}},function(t,e,n){"use strict";var r=n(11),o=n(10),i=n(65),u=n(21),a=n(15),c=n(99),l=n(101),f=n(100),s=n(18),d=n(44),h=n(16).f,v=n(105)(0),_=n(20);t.exports=function(t,e,n,p,y,b){var g=r[t],m=g,x=y?"set":"add",S=m&&m.prototype,E={};return _&&"function"==typeof m&&(b||S.forEach&&!u(function(){(new m).entries().next()}))?(m=e(function(e,n){f(e,m,t,"_c"),e._c=new g,void 0!=n&&l(n,y,e[x],e)}),v("add,clear,delete,forEach,get,has,set,keys,values,entries,toJSON".split(","),function(t){var e="add"==t||"set"==t;t in S&&(!b||"clear"!=t)&&a(m.prototype,t,function(n,r){if(f(this,m,t),!e&&b&&!s(n))return"get"==t&&void 0;var o=this._c[t](0===n?0:n,r);return e?this:o})}),b||h(m.prototype,"size",{get:function(){return this._c.size}})):(m=p.getConstructor(e,t,y,x),c(m.prototype,n),i.NEED=!0),d(m,t),E[t]=m,o(o.G+o.W+o.F,E),b||p.setStrong(m,t,y),m}},function(t,e,n){var r=n(13),o=n(34),i=n(47),u=n(37),a=n(106);t.exports=function(t,e){var n=1==t,c=2==t,l=3==t,f=4==t,s=6==t,d=5==t||s,h=e||a;return function(e,a,v){for(var _,p,y=i(e),b=o(y),g=r(a,v,3),m=u(b.length),x=0,S=n?h(e,m):c?h(e,0):void 0;m>x;x++)if((d||x in b)&&(_=b[x],p=g(_,x,y),t))if(n)S[x]=p;else if(p)switch(t){case 3:return!0;case 5:return _;case 6:return x;case 2:S.push(_)}else if(f)return!1;return s?-1:l||f?f:S}}},function(t,e,n){var r=n(107);t.exports=function(t,e){return new(r(t))(e)}},function(t,e,n){var r=n(18),o=n(70),i=n(45)("species");t.exports=function(t){var e;return o(t)&&(e=t.constructor,"function"!=typeof e||e!==Array&&!o(e.prototype)||(e=void 0),r(e)&&(e=e[i],null===e&&(e=void 0))),void 0===e?Array:e}},function(t,e,n){var r=n(10);r(r.P+r.R,"Map",{toJSON:n(109)("Map")})},function(t,e,n){var r=n(53),o=n(110);t.exports=function(t){return function(){if(r(this)!=t)throw TypeError(t+"#toJSON isn't generic");return o(this)}}},function(t,e,n){var r=n(101);t.exports=function(t,e){var n=[];return r(t,!1,n.push,n,e),n}},function(t,e,n){n(112)("Map")},function(t,e,n){"use strict";var r=n(10);t.exports=function(t){r(r.S,t,{of:function(){for(var t=arguments.length,e=new Array(t);t--;)e[t]=arguments[t];return new this(e)}})}},function(t,e,n){n(114)("Map")},function(t,e,n){"use strict";var r=n(10),o=n(14),i=n(13),u=n(101);t.exports=function(t){r(r.S,t,{from:function(t){var e,n,r,a,c=arguments[1];return o(this),e=void 0!==c,e&&o(c),void 0==t?new this:(n=[],e?(r=0,a=i(c,arguments[2],2),u(t,!1,function(t){n.push(a(t,r++))})):u(t,!1,n.push,n),new this(n))}})}},function(t,e){"use strict";Object.defineProperty(e,"__esModule",{value:!0});e.selectors="scrollbar, [scrollbar], [data-scrollbar]"},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}var o=n(85),i=r(o),u=n(89),a=r(u);Object.defineProperty(e,"__esModule",{value:!0});var c=n(117);(0,a.default)(c).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return c[t]}})})},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}var o=n(85),i=r(o),u=n(89),a=r(u);Object.defineProperty(e,"__esModule",{value:!0});var c=n(118);(0,a.default)(c).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return c[t]}})});var l=n(119);(0,a.default)(l).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return l[t]}})});var f=n(120);(0,a.default)(f).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return f[t]}})});var s=n(121);(0,a.default)(s).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return s[t]}})});var d=n(122);(0,a.default)(d).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return d[t]}})});var h=n(123);(0,a.default)(h).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return h[t]}})});var v=n(124);(0,a.default)(v).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return v[t]}})});var _=n(125);(0,a.default)(_).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return _[t]}})});var p=n(126);(0,a.default)(p).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return p[t]}})});var y=n(127);(0,a.default)(y).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return y[t]}})});var b=n(128);
(0,a.default)(b).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return b[t]}})})},function(t,e){"use strict";Object.defineProperty(e,"__esModule",{value:!0});e.buildCurve=function(t,e){var n=[];if(e<=0)return n;for(var r=Math.round(e/1e3*60)-1,o=t?Math.pow(1/Math.abs(t),1/r):0,i=1;i<=r;i++)n.push(t-t*Math.pow(o,i));return n.push(t),n}},function(t,e){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=100;e.debounce=function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:n,r=!(arguments.length>2&&void 0!==arguments[2])||arguments[2];if("function"==typeof t){var o=void 0;return function(){for(var n=arguments.length,i=Array(n),u=0;u<n;u++)i[u]=arguments[u];!o&&r&&setTimeout(function(){return t.apply(void 0,i)}),clearTimeout(o),o=setTimeout(function(){o=void 0,t.apply(void 0,i)},e)}}}},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}function o(t){if(Array.isArray(t)){for(var e=0,n=Array(t.length);e<t.length;e++)n[e]=t[e];return n}return(0,u.default)(t)}var i=n(2),u=r(i);Object.defineProperty(e,"__esModule",{value:!0});e.findChild=function(t,e){var n=t.children,r=null;return n&&[].concat(o(n)).some(function(t){if(t.className.match(e))return r=t,!0}),r}},function(t,e){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n={STANDARD:1,OTHERS:-3},r=[1,28,500],o=function(t){return r[t]||r[0]};e.getDelta=function(t){if("deltaX"in t){var e=o(t.deltaMode);return{x:t.deltaX/n.STANDARD*e,y:t.deltaY/n.STANDARD*e}}return"wheelDeltaX"in t?{x:t.wheelDeltaX/n.OTHERS,y:t.wheelDeltaY/n.OTHERS}:{x:0,y:t.wheelDelta/n.OTHERS}}},function(t,e){"use strict";Object.defineProperty(e,"__esModule",{value:!0});e.getPointerData=function(t){return t.touches?t.touches[t.touches.length-1]:t}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.getPosition=void 0;var r=n(122);e.getPosition=function(t){var e=(0,r.getPointerData)(t);return{x:e.clientX,y:e.clientY}}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.getTouchID=void 0;var r=n(122);e.getTouchID=function(t){var e=(0,r.getPointerData)(t);return e.identifier}},function(t,e){"use strict";Object.defineProperty(e,"__esModule",{value:!0});e.isOneOf=function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[];return e.some(function(e){return t===e})}},function(t,e){"use strict";Object.defineProperty(e,"__esModule",{value:!0});e.pickInRange=function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:-(1/0),n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1/0;return Math.max(e,Math.min(t,n))}},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}var o=n(89),i=r(o);Object.defineProperty(e,"__esModule",{value:!0});var u=["webkit","moz","ms","o"],a=new RegExp("^-(?!(?:"+u.join("|")+")-)"),c=function(t){var e={};return(0,i.default)(t).forEach(function(n){if(!a.test(n))return void(e[n]=t[n]);var r=t[n];n=n.replace(/^-/,""),e[n]=r,u.forEach(function(t){e["-"+t+"-"+n]=r})}),e};e.setStyle=function(t,e){e=c(e),(0,i.default)(e).forEach(function(n){var r=n.replace(/^-/,"").replace(/-([a-z])/g,function(t,e){return e.toUpperCase()});t.style[r]=e[n]})}},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}function o(t){if(Array.isArray(t)){for(var e=0,n=Array(t.length);e<t.length;e++)n[e]=t[e];return n}return(0,a.default)(t)}function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var u=n(2),a=r(u),c=n(85),l=r(c),f=n(129),s=r(f);Object.defineProperty(e,"__esModule",{value:!0}),e.TouchRecord=void 0;var d=s.default||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(t[r]=n[r])}return t},h=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),(0,l.default)(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),v=n(123),_=function(){function t(e){i(this,t),this.updateTime=Date.now(),this.delta={x:0,y:0},this.velocity={x:0,y:0},this.lastPosition=(0,v.getPosition)(e)}return h(t,[{key:"update",value:function(t){var e=this.velocity,n=this.updateTime,r=this.lastPosition,o=Date.now(),i=(0,v.getPosition)(t),u={x:-(i.x-r.x),y:-(i.y-r.y)},a=o-n||16,c=u.x/a*1e3,l=u.y/a*1e3;e.x=.8*c+.2*e.x,e.y=.8*l+.2*e.y,this.delta=u,this.updateTime=o,this.lastPosition=i}}]),t}();e.TouchRecord=function(){function t(){i(this,t),this.touchList={},this.lastTouch=null,this.activeTouchID=void 0}return h(t,[{key:"__add",value:function(t){if(this.__has(t))return null;var e=new _(t);return this.touchList[t.identifier]=e,e}},{key:"__renew",value:function(t){if(!this.__has(t))return null;var e=this.touchList[t.identifier];return e.update(t),e}},{key:"__delete",value:function(t){return delete this.touchList[t.identifier]}},{key:"__has",value:function(t){return this.touchList.hasOwnProperty(t.identifier)}},{key:"__setActiveID",value:function(t){this.activeTouchID=t[t.length-1].identifier,this.lastTouch=this.touchList[this.activeTouchID]}},{key:"__getActiveTracker",value:function(){var t=this.touchList,e=this.activeTouchID;return t[e]}},{key:"isActive",value:function(){return void 0!==this.activeTouchID}},{key:"getDelta",value:function(){var t=this.__getActiveTracker();return t?d({},t.delta):this.__primitiveValue}},{key:"getVelocity",value:function(){var t=this.__getActiveTracker();return t?d({},t.velocity):this.__primitiveValue}},{key:"getLastPosition",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",e=this.__getActiveTracker()||this.lastTouch,n=e?e.lastPosition:this.__primitiveValue;return t?n.hasOwnProperty(t)?n[t]:0:d({},n)}},{key:"updatedRecently",value:function(){var t=this.__getActiveTracker();return t&&Date.now()-t.updateTime<30}},{key:"track",value:function(t){var e=this,n=t.targetTouches;return[].concat(o(n)).forEach(function(t){e.__add(t)}),this.touchList}},{key:"update",value:function(t){var e=this,n=t.touches,r=t.changedTouches;return[].concat(o(n)).forEach(function(t){e.__renew(t)}),this.__setActiveID(r),this.touchList}},{key:"release",value:function(t){var e=this;return this.activeTouchID=void 0,[].concat(o(t.changedTouches)).forEach(function(t){e.__delete(t)}),this.touchList}},{key:"__primitiveValue",get:function(){return{x:0,y:0}}}]),t}()},function(t,e,n){t.exports={default:n(130),__esModule:!0}},function(t,e,n){n(131),t.exports=n(12).Object.assign},function(t,e,n){var r=n(10);r(r.S+r.F,"Object",{assign:n(132)})},function(t,e,n){"use strict";var r=n(31),o=n(68),i=n(69),u=n(47),a=n(34),c=Object.assign;t.exports=!c||n(21)(function(){var t={},e={},n=Symbol(),r="abcdefghijklmnopqrst";return t[n]=7,r.split("").forEach(function(t){e[t]=t}),7!=c({},t)[n]||Object.keys(c({},e)).join("")!=r})?function(t,e){for(var n=u(t),c=arguments.length,l=1,f=o.f,s=i.f;c>l;)for(var d,h=a(arguments[l++]),v=f?r(h).concat(f(h)):r(h),_=v.length,p=0;_>p;)s.call(h,d=v[p++])&&(n[d]=h[d]);return n}:c},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}var o=n(85),i=r(o),u=n(89),a=r(u);Object.defineProperty(e,"__esModule",{value:!0});var c=n(134);(0,a.default)(c).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return c[t]}})})},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}var o=n(85),i=r(o),u=n(89),a=r(u);Object.defineProperty(e,"__esModule",{value:!0});var c=n(135);(0,a.default)(c).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return c[t]}})});var l=n(136);(0,a.default)(l).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return l[t]}})});var f=n(137);(0,a.default)(f).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return f[t]}})});var s=n(138);(0,a.default)(s).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return s[t]}})});var d=n(139);(0,a.default)(d).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return d[t]}})});var h=n(140);(0,a.default)(h).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return h[t]}})});var v=n(141);(0,a.default)(v).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return v[t]}})});var _=n(142);(0,a.default)(_).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return _[t]}})});var p=n(143);(0,a.default)(p).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return p[t]}})});var y=n(144);(0,a.default)(y).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return y[t]}})});var b=n(145);(0,a.default)(b).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return b[t]}})});var g=n(146);(0,a.default)(g).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return g[t]}})});var m=n(147);(0,a.default)(m).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return m[t]}})});var x=n(148);(0,a.default)(x).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return x[t]}})});var S=n(149);(0,a.default)(S).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return S[t]}})})},function(t,e,n){"use strict";var r=n(77);r.SmoothScrollbar.prototype.clearMovement=r.SmoothScrollbar.prototype.stop=function(){this.movement.x=this.movement.y=0,cancelAnimationFrame(this.__timerID.scrollTo)}},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}function o(t){if(Array.isArray(t)){for(var e=0,n=Array(t.length);e<t.length;e++)n[e]=t[e];return n}return(0,u.default)(t)}var i=n(2),u=r(i),a=n(77),c=n(116),l=n(88);a.SmoothScrollbar.prototype.destroy=function(t){var e=this.__listeners,n=this.__handlers,r=this.__observer,i=this.targets,u=i.container,a=i.content;n.forEach(function(t){var e=t.evt,n=t.elem,r=t.fn;n.removeEventListener(e,r)}),n.length=e.length=0,this.stop(),cancelAnimationFrame(this.__timerID.render),r&&r.disconnect(),l.sbList.delete(u),t||this.scrollTo(0,0,300,function(){if(u.parentNode){(0,c.setStyle)(u,{overflow:""}),u.scrollTop=u.scrollLeft=0;for(var t=[].concat(o(a.childNodes));u.firstChild;)u.removeChild(u.firstChild);t.forEach(function(t){return u.appendChild(t)})}})}},function(t,e,n){"use strict";var r=n(77);r.SmoothScrollbar.prototype.getContentElem=function(){return this.targets.content}},function(t,e,n){"use strict";var r=n(77);r.SmoothScrollbar.prototype.getSize=function(){var t=this.targets.container,e=this.targets.content;return{container:{width:t.clientWidth,height:t.clientHeight},content:{width:e.offsetWidth-e.clientWidth+e.scrollWidth,height:e.offsetHeight-e.clientHeight+e.scrollHeight}}}},function(t,e,n){"use strict";var r=n(77);r.SmoothScrollbar.prototype.infiniteScroll=function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:50;if("function"==typeof t){var n={x:0,y:0},r=!1;this.addListener(function(o){var i=o.offset,u=o.limit;u.y-i.y<=e&&i.y>n.y&&!r&&(r=!0,setTimeout(function(){return t(o)})),u.y-i.y>e&&(r=!1),n=i})}}},function(t,e,n){"use strict";var r=n(77);r.SmoothScrollbar.prototype.isVisible=function(t){var e=this.bounding,n=t.getBoundingClientRect(),r=Math.max(e.top,n.top),o=Math.max(e.left,n.left),i=Math.min(e.right,n.right),u=Math.min(e.bottom,n.bottom);return r<u&&o<i}},function(t,e,n){"use strict";var r=n(77);r.SmoothScrollbar.prototype.addListener=function(t){"function"==typeof t&&this.__listeners.push(t)},r.SmoothScrollbar.prototype.removeListener=function(t){"function"==typeof t&&this.__listeners.some(function(e,n,r){return e===t&&r.splice(n,1)})}},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}function o(t,e,n){return e in t?(0,l.default)(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function i(t,e){return!!e.length&&e.some(function(e){return t.match(e)})}function u(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:s.REGIESTER,e=d[t];return function(n){for(var r=arguments.length,o=Array(r>1?r-1:0),u=1;u<r;u++)o[u-1]=arguments[u];this.__handlers.forEach(function(r){var u=r.elem,a=r.evt,c=r.fn,l=r.hasRegistered;l&&t===n.REGIESTER||!l&&t===n.UNREGIESTER||i(a,o)&&(u[e](a,c),r.hasRegistered=!l)})}}var a,c=n(85),l=r(c),f=n(77),s={REGIESTER:0,UNREGIESTER:1},d=(a={},o(a,s.REGIESTER,"addEventListener"),o(a,s.UNREGIESTER,"removeEventListener"),a);f.SmoothScrollbar.prototype.registerEvents=u(s.REGIESTER),f.SmoothScrollbar.prototype.unregisterEvents=u(s.UNREGIESTER)},function(t,e,n){"use strict";var r=n(77);r.SmoothScrollbar.prototype.reverseWheel=function(){var t=arguments.length>0&&void 0!==arguments[0]&&arguments[0];this.wheelReversed="boolean"==typeof t&&t,this.__readonly("wheelReversed",this.wheelReversed)}},function(t,e,n){"use strict";var r=n(77);r.SmoothScrollbar.prototype.scrollIntoView=function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=e.alignToTop,r=void 0===n||n,o=e.onlyScrollIfNeeded,i=void 0!==o&&o,u=e.offsetTop,a=void 0===u?0:u,c=e.offsetLeft,l=void 0===c?0:c,f=e.offsetBottom,s=void 0===f?0:f,d=this.targets,h=this.bounding;if(t&&d.container.contains(t)){var v=t.getBoundingClientRect();i&&this.isVisible(t)||this.__setMovement(v.left-h.left-l,r?v.top-h.top-a:v.bottom-h.bottom-s)}}},function(t,e,n){"use strict";var r=n(116),o=n(77);o.SmoothScrollbar.prototype.scrollTo=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.offset.x,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:this.offset.y,n=this,o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:null,u=this.options,a=this.offset,c=this.limit,l=this.__timerID;cancelAnimationFrame(l.scrollTo),i="function"==typeof i?i:function(){},u.renderByPixels&&(t=Math.round(t),e=Math.round(e));var f=a.x,s=a.y,d=(0,r.pickInRange)(t,0,c.x)-f,h=(0,r.pickInRange)(e,0,c.y)-s,v=(0,r.buildCurve)(d,o),_=(0,r.buildCurve)(h,o),p=v.length,y=0,b=function t(){n.setPosition(f+v[y],s+_[y]),y++,y===p?requestAnimationFrame(function(){i(n)}):l.scrollTo=requestAnimationFrame(t)};b()}},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}var o=n(89),i=r(o),u=n(77);u.SmoothScrollbar.prototype.setOptions=function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};(0,i.default)(e).forEach(function(n){t.options.hasOwnProperty(n)&&void 0!==e[n]&&(t.options[n]=e[n])})}},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}var o=n(129),i=r(o),u=i.default||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(t[r]=n[r])}return t},a=n(116),c=n(77);c.SmoothScrollbar.prototype.setPosition=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.offset.x,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:this.offset.y,n=arguments.length>2&&void 0!==arguments[2]&&arguments[2];this.__hideTrackThrottle();var r={},o=this.options,i=this.offset,c=this.limit,l=this.targets,f=this.__listeners;o.renderByPixels&&(t=Math.round(t),e=Math.round(e)),t!==i.x&&this.showTrack("x"),e!==i.y&&this.showTrack("y"),t=(0,a.pickInRange)(t,0,c.x),e=(0,a.pickInRange)(e,0,c.y),t===i.x&&e===i.y||(r.direction={x:t===i.x?"none":t>i.x?"right":"left",y:e===i.y?"none":e>i.y?"down":"up"},this.__readonly("offset",{x:t,y:e}),r.limit=u({},c),r.offset=u({},this.offset),this.__setThumbPosition(),(0,a.setStyle)(l.content,{"-transform":"translate3d("+-t+"px, "+-e+"px, 0)"}),n||f.forEach(function(t){o.syncCallbacks?t(r):requestAnimationFrame(function(){t(r)})}))}},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}function o(t,e,n){return e in t?(0,c.default)(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function i(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:f.SHOW,e=s[t];return function(){var n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"both",r={TRACK:"show",CONTAINER:"scrolling"},o=this.options,i=this.movement,u=this.targets,a=u.container,c=u.xAxis,l=u.yAxis;i.x||i.y?a.classList.add(r.CONTAINER):a.classList.remove(r.CONTAINER),o.alwaysShowTracks&&t===f.HIDE||(n=n.toLowerCase(),"both"===n&&(c.track.classList[e](r.TRACK),l.track.classList[e](r.TRACK)),"x"===n&&c.track.classList[e](r.TRACK),"y"===n&&l.track.classList[e](r.TRACK))}}var u,a=n(85),c=r(a),l=n(77),f={SHOW:0,HIDE:1},s=(u={},o(u,f.SHOW,"add"),o(u,f.HIDE,"remove"),u);l.SmoothScrollbar.prototype.showTrack=i(f.SHOW),l.SmoothScrollbar.prototype.hideTrack=i(f.HIDE)},function(t,e,n){"use strict";function r(){if("glow"===this.options.overscrollEffect){var t=this.targets,e=this.size,n=t.canvas,r=n.elem,o=n.context,i=window.devicePixelRatio||1,u=e.container.width*i,a=e.container.height*i;u===r.width&&a===r.height||(r.width=u,r.height=a,o.scale(i,i))}}function o(){var t=this.size,e=this.thumbSize,n=this.targets,r=n.xAxis,o=n.yAxis;(0,u.setStyle)(r.track,{display:t.content.width<=t.container.width?"none":"block"}),(0,u.setStyle)(o.track,{display:t.content.height<=t.container.height?"none":"block"}),(0,u.setStyle)(r.thumb,{width:e.x+"px"}),(0,u.setStyle)(o.thumb,{height:e.y+"px"})}function i(){var t=this.options;this.__updateBounding();var e=this.getSize(),n={x:Math.max(e.content.width-e.container.width,0),y:Math.max(e.content.height-e.container.height,0)},i={realX:e.container.width/e.content.width*e.container.width,realY:e.container.height/e.content.height*e.container.height};i.x=Math.max(i.realX,t.thumbMinSize),i.y=Math.max(i.realY,t.thumbMinSize),this.__readonly("size",e).__readonly("limit",n).__readonly("thumbSize",i),o.call(this),r.call(this),this.setPosition(),this.__setThumbPosition()}var u=n(116),a=n(77);a.SmoothScrollbar.prototype.update=function(t){t?requestAnimationFrame(i.bind(this)):i.call(this)}},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}var o=n(85),i=r(o),u=n(89),a=r(u);Object.defineProperty(e,"__esModule",{value:!0});var c=n(151);(0,a.default)(c).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return c[t]}})})},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}var o=n(85),i=r(o),u=n(89),a=r(u);Object.defineProperty(e,"__esModule",{value:!0});var c=n(152);(0,a.default)(c).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return c[t]}})});var l=n(153);(0,a.default)(l).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return l[t]}})});var f=n(154);(0,a.default)(f).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return f[t]}})});var s=n(159);(0,a.default)(s).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return s[t]}})});var d=n(160);(0,a.default)(d).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return d[t]}})});var h=n(161);(0,a.default)(h).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return h[t]}})});var v=n(162);(0,a.default)(v).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return v[t]}})})},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}function o(t){if(Array.isArray(t)){for(var e=0,n=Array(t.length);e<t.length;e++)n[e]=t[e];return n}return(0,a.default)(t)}function i(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=arguments.length>2&&void 0!==arguments[2]&&arguments[2],r=this.limit,i=this.options,u=this.movement;this.__updateThrottle(),i.renderByPixels&&(t=Math.round(t),e=Math.round(e));var a=u.x+t,l=u.y+e;0===r.x&&(a=0),0===r.y&&(l=0);var f=this.__getDeltaLimit(n);u.x=c.pickInRange.apply(void 0,[a].concat(o(f.x))),u.y=c.pickInRange.apply(void 0,[l].concat(o(f.y)))}var u=n(2),a=r(u),c=n(116),l=n(77);Object.defineProperty(l.SmoothScrollbar.prototype,"__addMovement",{value:i,writable:!0,configurable:!0})},function(t,e,n){"use strict";function r(){var t=this,e=this.movement,n=this.movementLocked;a.forEach(function(r){n[r]=e[r]&&t.__willOverscroll(r,e[r])})}function o(){var t=this.movementLocked;a.forEach(function(e){t[e]=!1})}function i(){var t=this.movementLocked;return t.x||t.y}var u=n(77),a=["x","y"];Object.defineProperty(u.SmoothScrollbar.prototype,"__autoLockMovement",{value:r,writable:!0,configurable:!0}),Object.defineProperty(u.SmoothScrollbar.prototype,"__unlockMovement",{value:o,writable:!0,configurable:!0}),Object.defineProperty(u.SmoothScrollbar.prototype,"__isMovementLocked",{value:i,writable:!0,configurable:!0})},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}function o(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";if(t){var e=this.options,n=this.movement,r=this.overscrollRendered,o=this.MAX_OVERSCROLL,i=n[t]=(0,h.pickInRange)(n[t],-o,o),u=e.overscrollDamping,a=r[t]+(i-r[t])*u;e.renderByPixels&&(a|=0),!this.__isMovementLocked()&&Math.abs(a-r[t])<.1&&(a-=i/Math.abs(i||1)),Math.abs(a)<Math.abs(r[t])&&this.__readonly("overscrollBack",!0),(a*r[t]<0||Math.abs(a)<=1)&&(a=0,this.__readonly("overscrollBack",!1)),r[t]=a}}function i(t){var e=this.__touchRecord,n=this.overscrollRendered;return n.x!==t.x||n.y!==t.y||!(!d.GLOBAL_ENV.TOUCH_SUPPORTED||!e.updatedRecently())}function u(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];if(e.length&&this.options.overscrollEffect){var n=this.options,r=this.overscrollRendered,u=l({},r);if(e.forEach(function(e){return o.call(t,e)}),i.call(this,u))switch(n.overscrollEffect){case"bounce":return s.overscrollBounce.call(this,r.x,r.y);case"glow":return s.overscrollGlow.call(this,r.x,r.y);default:return}}}var a=n(129),c=r(a),l=c.default||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(t[r]=n[r])}return t},f=n(77),s=n(155),d=n(88),h=n(116);Object.defineProperty(f.SmoothScrollbar.prototype,"__renderOverscroll",{value:u,writable:!0,configurable:!0})},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}var o=n(85),i=r(o),u=n(89),a=r(u);Object.defineProperty(e,"__esModule",{value:!0});var c=n(156);(0,a.default)(c).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return c[t]}})})},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}var o=n(85),i=r(o),u=n(89),a=r(u);Object.defineProperty(e,"__esModule",{value:!0});var c=n(157);(0,a.default)(c).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return c[t]}})});var l=n(158);(0,a.default)(l).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return l[t]}})})},function(t,e,n){"use strict";function r(t,e){var n=this.size,r=this.offset,i=this.targets,u=this.thumbOffset,a=i.xAxis,c=i.yAxis,l=i.content;if((0,o.setStyle)(l,{"-transform":"translate3d("+-(r.x+t)+"px, "+-(r.y+e)+"px, 0)"}),t){var f=n.container.width/(n.container.width+Math.abs(t));(0,o.setStyle)(a.thumb,{"-transform":"translate3d("+u.x+"px, 0, 0) scale3d("+f+", 1, 1)","-transform-origin":t<0?"left":"right"})}if(e){var s=n.container.height/(n.container.height+Math.abs(e));(0,o.setStyle)(c.thumb,{"-transform":"translate3d(0, "+u.y+"px, 0) scale3d(1, "+s+", 1)","-transform-origin":e<0?"top":"bottom"})}}Object.defineProperty(e,"__esModule",{value:!0}),e.overscrollBounce=r;var o=n(116)},function(t,e,n){"use strict";function r(t,e){var n=this.size,r=this.targets,a=this.options,c=r.canvas,l=c.elem,f=c.context;return t||e?((0,u.setStyle)(l,{display:"block"}),f.clearRect(0,0,n.content.width,n.container.height),f.fillStyle=a.overscrollEffectColor,o.call(this,t),void i.call(this,e)):(0,u.setStyle)(l,{display:"none"})}function o(t){var e=this.size,n=this.targets,r=this.__touchRecord,o=this.MAX_OVERSCROLL,i=e.container,l=i.width,f=i.height,s=n.canvas.context;s.save(),t>0&&s.transform(-1,0,0,1,l,0);var d=(0,u.pickInRange)(Math.abs(t)/o,0,a),h=(0,u.pickInRange)(d,0,c)*l,v=Math.abs(t),_=r.getLastPosition("y")||f/2;s.globalAlpha=d,s.beginPath(),s.moveTo(0,-h),s.quadraticCurveTo(v,_,0,f+h),s.fill(),s.closePath(),s.restore()}function i(t){var e=this.size,n=this.targets,r=this.__touchRecord,o=this.MAX_OVERSCROLL,i=e.container,l=i.width,f=i.height,s=n.canvas.context;s.save(),t>0&&s.transform(1,0,0,-1,0,f);var d=(0,u.pickInRange)(Math.abs(t)/o,0,a),h=(0,u.pickInRange)(d,0,c)*l,v=r.getLastPosition("x")||l/2,_=Math.abs(t);s.globalAlpha=d,s.beginPath(),s.moveTo(-h,0),s.quadraticCurveTo(v,_,l+h,0),s.fill(),s.closePath(),s.restore()}Object.defineProperty(e,"__esModule",{value:!0}),e.overscrollGlow=r;var u=n(116),a=.75,c=.25},function(t,e,n){"use strict";function r(t){var e=this.options,n=this.offset,r=this.movement,o=this.__touchRecord,i=e.damping,u=e.renderByPixels,a=e.overscrollDamping,c=n[t],l=r[t],f=i;if(this.__willOverscroll(t,l)?f=a:o.isActive()&&(f=.5),Math.abs(l)<1){var s=c+l;return{movement:0,position:l>0?Math.ceil(s):Math.floor(s)}}var d=l*(1-f);return u&&(d|=0),{movement:d,position:c+l-d}}function o(){var t=this.options,e=this.offset,n=this.limit,i=this.movement,a=this.overscrollRendered,c=this.__timerID;if(i.x||i.y||a.x||a.y){var l=r.call(this,"x"),f=r.call(this,"y"),s=[];if(t.overscrollEffect){var d=(0,u.pickInRange)(l.position,0,n.x),h=(0,u.pickInRange)(f.position,0,n.y);(a.x||d===e.x&&i.x)&&s.push("x"),(a.y||h===e.y&&i.y)&&s.push("y")}this.movementLocked.x||(i.x=l.movement),this.movementLocked.y||(i.y=f.movement),this.setPosition(l.position,f.position),this.__renderOverscroll(s)}c.render=requestAnimationFrame(o.bind(this))}var i=n(77),u=n(116);Object.defineProperty(i.SmoothScrollbar.prototype,"__render",{value:o,writable:!0,configurable:!0})},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}function o(t){if(Array.isArray(t)){for(var e=0,n=Array(t.length);e<t.length;e++)n[e]=t[e];return n}return(0,a.default)(t)}function i(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=arguments.length>2&&void 0!==arguments[2]&&arguments[2],r=this.options,i=this.movement;this.__updateThrottle();var u=this.__getDeltaLimit(n);r.renderByPixels&&(t=Math.round(t),e=Math.round(e)),i.x=c.pickInRange.apply(void 0,[t].concat(o(u.x))),i.y=c.pickInRange.apply(void 0,[e].concat(o(u.y)))}var u=n(2),a=r(u),c=n(116),l=n(77);Object.defineProperty(l.SmoothScrollbar.prototype,"__setMovement",{value:i,writable:!0,configurable:!0})},function(t,e,n){"use strict";function r(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=this.options,r=this.offset,o=this.limit;if(!n.continuousScrolling)return!1;var u=(0,i.pickInRange)(t+r.x,0,o.x),a=(0,i.pickInRange)(e+r.y,0,o.y),c=!0;return c&=u===r.x,c&=a===r.y,c&=u===o.x||0===u||a===o.y||0===a}var o=n(77),i=n(116);Object.defineProperty(o.SmoothScrollbar.prototype,"__shouldPropagateMovement",{value:r,writable:!0,configurable:!0})},function(t,e,n){"use strict";function r(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;if(!t)return!1;var n=this.offset,r=this.limit,o=n[t];return(0,i.pickInRange)(e+o,0,r[t])===o&&(0===o||o===r[t])}var o=n(77),i=n(116);Object.defineProperty(o.SmoothScrollbar.prototype,"__willOverscroll",{value:r,writable:!0,configurable:!0})},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}var o=n(85),i=r(o),u=n(89),a=r(u);Object.defineProperty(e,"__esModule",{value:!0});var c=n(164);(0,a.default)(c).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return c[t]}})})},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}var o=n(85),i=r(o),u=n(89),a=r(u);Object.defineProperty(e,"__esModule",{value:!0});var c=n(165);(0,a.default)(c).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return c[t]}})});var l=n(166);(0,a.default)(l).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return l[t]}})});var f=n(173);(0,a.default)(f).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return f[t]}})});var s=n(174);(0,a.default)(s).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return s[t]}})});var d=n(175);(0,a.default)(d).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return d[t]}})});var h=n(176);(0,a.default)(h).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return h[t]}})});var v=n(177);(0,a.default)(v).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return v[t]}})})},function(t,e,n){"use strict";function r(){var t=this,e=this.targets,n=e.container,r=e.content,o=!1,u=void 0,a=void 0;Object.defineProperty(this,"__isDrag",{get:function(){return o},enumerable:!1});var c=function e(n){var r=n.x,o=n.y;if(r||o){var i=t.options.speed;t.__setMovement(r*i,o*i),u=requestAnimationFrame(function(){e({x:r,y:o})})}};this.__addEvent(n,"dragstart",function(e){t.__eventFromChildScrollbar(e)||(o=!0,a=e.target.clientHeight,(0,i.setStyle)(r,{"pointer-events":"auto"}),cancelAnimationFrame(u),t.__updateBounding())}),this.__addEvent(document,"dragover mousemove touchmove",function(e){if(o&&!t.__eventFromChildScrollbar(e)){cancelAnimationFrame(u),e.preventDefault();var n=t.__getPointerTrend(e,a);c(n)}}),this.__addEvent(document,"dragend mouseup touchend blur",function(){cancelAnimationFrame(u),o=!1})}var o=n(77),i=n(116);Object.defineProperty(o.SmoothScrollbar.prototype,"__dragHandler",{value:r,writable:!0,configurable:!0})},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}function o(){var t=this,e=this.targets,n=function(e){var n=t.size,r=t.offset,o=t.limit,i=t.movement,u={KEY_CODE:s};switch(e){case u.KEY_CODE.SPACE:return[0,200];case u.KEY_CODE.PAGE_UP:return[0,-n.container.height+40];case u.KEY_CODE.PAGE_DOWN:return[0,n.container.height-40];case u.KEY_CODE.END:return[0,Math.abs(i.y)+o.y-r.y];case u.KEY_CODE.HOME:return[0,-Math.abs(i.y)-r.y];case u.KEY_CODE.LEFT:return[-40,0];case u.KEY_CODE.UP:return[0,-40];case u.KEY_CODE.RIGHT:return[40,0];case u.KEY_CODE.DOWN:return[0,40];default:return null}},r=e.container;this.__addEvent(r,"keydown",function(e){if(document.activeElement===r){var o=t.options,i=t.parents,u=t.movementLocked,a=n(e.keyCode||e.which);if(a){var c=l(a,2),f=c[0],s=c[1];if(t.__shouldPropagateMovement(f,s))return r.blur(),i.length&&i[0].focus(),t.__updateThrottle();e.preventDefault(),t.__unlockMovement(),f&&t.__willOverscroll("x",f)&&(u.x=!0),s&&t.__willOverscroll("y",s)&&(u.y=!0);var d=o.speed;t.__addMovement(f*d,s*d)}}}),this.__addEvent(r,"keyup",function(){t.__unlockMovement()})}var i=n(167),u=r(i),a=n(170),c=r(a),l=function(){function t(t,e){var n=[],r=!0,o=!1,i=void 0;try{for(var u,a=(0,c.default)(t);!(r=(u=a.next()).done)&&(n.push(u.value),
!e||n.length!==e);r=!0);}catch(t){o=!0,i=t}finally{try{!r&&a.return&&a.return()}finally{if(o)throw i}}return n}return function(e,n){if(Array.isArray(e))return e;if((0,u.default)(Object(e)))return t(e,n);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),f=n(77),s={SPACE:32,PAGE_UP:33,PAGE_DOWN:34,END:35,HOME:36,LEFT:37,UP:38,RIGHT:39,DOWN:40};Object.defineProperty(f.SmoothScrollbar.prototype,"__keyboardHandler",{value:o,writable:!0,configurable:!0})},function(t,e,n){t.exports={default:n(168),__esModule:!0}},function(t,e,n){n(57),n(4),t.exports=n(169)},function(t,e,n){var r=n(53),o=n(45)("iterator"),i=n(27);t.exports=n(12).isIterable=function(t){var e=Object(t);return void 0!==e[o]||"@@iterator"in e||i.hasOwnProperty(r(e))}},function(t,e,n){t.exports={default:n(171),__esModule:!0}},function(t,e,n){n(57),n(4),t.exports=n(172)},function(t,e,n){var r=n(17),o=n(52);t.exports=n(12).getIterator=function(t){var e=o(t);if("function"!=typeof e)throw TypeError(t+" is not iterable!");return r(e.call(t))}},function(t,e,n){"use strict";function r(){var t=this,e=this.targets,n=e.container,r=e.xAxis,o=e.yAxis,u=function(e,n){var r=t.size,o=t.thumbSize;if("x"===e){var i=r.container.width-(o.x-o.realX);return n/i*r.content.width}if("y"===e){var u=r.container.height-(o.y-o.realY);return n/u*r.content.height}return 0},a=function(t){return(0,i.isOneOf)(t,[r.track,r.thumb])?"x":(0,i.isOneOf)(t,[o.track,o.thumb])?"y":void 0},c=void 0,l=void 0,f=void 0,s=void 0,d=void 0;this.__addEvent(n,"click",function(e){if(!l&&(0,i.isOneOf)(e.target,[r.track,o.track])){var n=e.target,c=a(n),f=n.getBoundingClientRect(),s=(0,i.getPosition)(e),d=t.offset,h=t.thumbSize;if("x"===c){var v=s.x-f.left-h.x/2;t.__setMovement(u(c,v)-d.x,0)}else{var _=s.y-f.top-h.y/2;t.__setMovement(0,u(c,_)-d.y)}}}),this.__addEvent(n,"mousedown",function(e){if((0,i.isOneOf)(e.target,[r.thumb,o.thumb])){c=!0;var n=(0,i.getPosition)(e),u=e.target.getBoundingClientRect();s=a(e.target),f={x:n.x-u.left,y:n.y-u.top},d=t.targets.container.getBoundingClientRect()}}),this.__addEvent(window,"mousemove",function(e){if(c){e.preventDefault(),l=!0;var n=t.offset,r=(0,i.getPosition)(e);if("x"===s){var o=r.x-f.x-d.left;t.setPosition(u(s,o),n.y)}if("y"===s){var a=r.y-f.y-d.top;t.setPosition(n.x,u(s,a))}}}),this.__addEvent(window,"mouseup blur",function(){c=l=!1})}var o=n(77),i=n(116);Object.defineProperty(o.SmoothScrollbar.prototype,"__mouseHandler",{value:r,writable:!0,configurable:!0})},function(t,e,n){"use strict";function r(){this.__addEvent(window,"resize",this.__updateThrottle)}var o=n(77);Object.defineProperty(o.SmoothScrollbar.prototype,"__resizeHandler",{value:r,writable:!0,configurable:!0})},function(t,e,n){"use strict";function r(){var t=this,e=!1,n=void 0,r=this.targets,o=r.container,u=r.content,a=function e(r){var o=r.x,i=r.y;if(o||i){var u=t.options.speed;t.__setMovement(o*u,i*u),n=requestAnimationFrame(function(){e({x:o,y:i})})}},c=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";(0,i.setStyle)(o,{"-user-select":t})};this.__addEvent(window,"mousemove",function(r){if(e){cancelAnimationFrame(n);var o=t.__getPointerTrend(r);a(o)}}),this.__addEvent(u,"selectstart",function(r){return t.__eventFromChildScrollbar(r)?c("none"):(cancelAnimationFrame(n),t.__updateBounding(),void(e=!0))}),this.__addEvent(window,"mouseup blur",function(){cancelAnimationFrame(n),c(),e=!1}),this.__addEvent(o,"scroll",function(t){t.preventDefault(),o.scrollTop=o.scrollLeft=0})}var o=n(77),i=n(116);Object.defineProperty(o.SmoothScrollbar.prototype,"__selectHandler",{value:r,writable:!0,configurable:!0})},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}function o(){var t=this,e=this.targets,n=this.__touchRecord,r=e.container;this.__addEvent(r,"touchstart",function(e){if(!t.__isDrag){var r=t.__timerID,o=t.movement;cancelAnimationFrame(r.scrollTo),t.__willOverscroll("x")||(o.x=0),t.__willOverscroll("y")||(o.y=0),n.track(e),t.__autoLockMovement()}}),this.__addEvent(r,"touchmove",function(e){if(!(t.__isDrag||s&&s!==t)){n.update(e);var r=n.getDelta(),o=r.x,i=r.y;if(t.__shouldPropagateMovement(o,i))return t.__updateThrottle();var u=t.movement,a=t.MAX_OVERSCROLL,c=t.options;if(u.x&&t.__willOverscroll("x",o)){var l=2;"bounce"===c.overscrollEffect&&(l+=Math.abs(10*u.x/a)),Math.abs(u.x)>=a?o=0:o/=l}if(u.y&&t.__willOverscroll("y",i)){var f=2;"bounce"===c.overscrollEffect&&(f+=Math.abs(10*u.y/a)),Math.abs(u.y)>=a?i=0:i/=f}t.__autoLockMovement(),e.preventDefault(),t.__addMovement(o,i,!0),s=t}}),this.__addEvent(r,"touchcancel touchend",function(e){if(!t.__isDrag){var r=t.options.speed,o=n.getVelocity(),i={};(0,u.default)(o).forEach(function(t){var e=(0,l.pickInRange)(o[t]*c.GLOBAL_ENV.EASING_MULTIPLIER,-1e3,1e3);i[t]=Math.abs(e)>f?e*r:0}),t.__addMovement(i.x,i.y,!0),t.__unlockMovement(),n.release(e),s=null}})}var i=n(89),u=r(i),a=n(77),c=n(88),l=n(116),f=100,s=null;Object.defineProperty(a.SmoothScrollbar.prototype,"__touchHandler",{value:o,writable:!0,configurable:!0})},function(t,e,n){"use strict";function r(){var t=this,e=this.targets.container,n=!1,r=(0,i.debounce)(function(){n=!1},30,!1);this.__addEvent(e,u.GLOBAL_ENV.WHEEL_EVENT,function(e){var o=t.options,u=t.wheelReversed,a=(0,i.getDelta)(e),c=a.x,l=a.y;return c*=o.speed,l*=o.speed,t.__shouldPropagateMovement(c,l)?t.__updateThrottle():(e.preventDefault(),r(),t.overscrollBack&&(n=!0),n&&(t.__willOverscroll("x",c)&&(c=0),t.__willOverscroll("y",l)&&(l=0)),void(u?t.__addMovement(l,c,!0):t.__addMovement(c,l,!0)))})}var o=n(77),i=n(116),u=n(88);Object.defineProperty(o.SmoothScrollbar.prototype,"__wheelHandler",{value:r,writable:!0,configurable:!0})},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}var o=n(85),i=r(o),u=n(89),a=r(u);Object.defineProperty(e,"__esModule",{value:!0});var c=n(179);(0,a.default)(c).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return c[t]}})})},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}var o=n(85),i=r(o),u=n(89),a=r(u);Object.defineProperty(e,"__esModule",{value:!0});var c=n(180);(0,a.default)(c).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return c[t]}})});var l=n(181);(0,a.default)(l).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return l[t]}})});var f=n(182);(0,a.default)(f).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return f[t]}})});var s=n(183);(0,a.default)(s).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return s[t]}})});var d=n(184);(0,a.default)(d).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return d[t]}})});var h=n(187);(0,a.default)(h).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return h[t]}})});var v=n(188);(0,a.default)(v).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return v[t]}})});var _=n(189);(0,a.default)(_).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return _[t]}})});var p=n(190);(0,a.default)(p).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return p[t]}})});var y=n(191);(0,a.default)(y).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return y[t]}})});var b=n(192);(0,a.default)(b).forEach(function(t){"default"!==t&&"__esModule"!==t&&(0,i.default)(e,t,{enumerable:!0,get:function(){return b[t]}})})},function(t,e,n){"use strict";function r(t,e,n){var r=this;if(!t||"function"!=typeof t.addEventListener)throw new TypeError("expect elem to be a DOM element, but got "+t);var o=function(t){for(var e=arguments.length,r=Array(e>1?e-1:0),o=1;o<e;o++)r[o-1]=arguments[o];!t.type.match(/drag/)&&t.defaultPrevented||n.apply(void 0,[t].concat(r))};e.split(/\s+/g).forEach(function(e){r.__handlers.push({evt:e,elem:t,fn:o,hasRegistered:!0}),t.addEventListener(e,o)})}var o=n(77);Object.defineProperty(o.SmoothScrollbar.prototype,"__addEvent",{value:r,writable:!0,configurable:!0})},function(t,e,n){"use strict";function r(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=t.target;return this.children.some(function(t){return t.contains(e)})}var o=n(77);Object.defineProperty(o.SmoothScrollbar.prototype,"__eventFromChildScrollbar",{value:r,writable:!0,configurable:!0})},function(t,e,n){"use strict";function r(){var t=arguments.length>0&&void 0!==arguments[0]&&arguments[0],e=this.options,n=this.offset,r=this.limit;return t&&(e.continuousScrolling||e.overscrollEffect)?{x:[-(1/0),1/0],y:[-(1/0),1/0]}:{x:[-n.x,r.x-n.x],y:[-n.y,r.y-n.y]}}var o=n(77);Object.defineProperty(o.SmoothScrollbar.prototype,"__getDeltaLimit",{value:r,writable:!0,configurable:!0})},function(t,e,n){"use strict";function r(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=this.bounding,r=n.top,o=n.right,u=n.bottom,a=n.left,c=(0,i.getPosition)(t),l=c.x,f=c.y,s={x:0,y:0};return 0===l&&0===f?s:(l>o-e?s.x=l-o+e:l<a+e&&(s.x=l-a-e),f>u-e?s.y=f-u+e:f<r+e&&(s.y=f-r-e),s)}var o=n(77),i=n(116);Object.defineProperty(o.SmoothScrollbar.prototype,"__getPointerTrend",{value:r,writable:!0,configurable:!0})},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}function o(t){if(Array.isArray(t)){for(var e=0,n=Array(t.length);e<t.length;e++)n[e]=t[e];return n}return(0,h.default)(t)}function i(t){var e=this,n={speed:1,damping:.1,thumbMinSize:20,syncCallbacks:!1,renderByPixels:!0,alwaysShowTracks:!1,continuousScrolling:"auto",overscrollEffect:!1,overscrollEffectColor:"#87ceeb",overscrollDamping:.2},r={damping:[0,1],speed:[0,1/0],thumbMinSize:[0,1/0],overscrollEffect:[!1,"bounce","glow"],overscrollDamping:[0,1]},i=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"auto";if(n.overscrollEffect!==!1)return!1;switch(t){case"auto":return e.isNestedScrollbar;default:return!!t}},u={set ignoreEvents(t){console.warn("`options.ignoreEvents` parameter is deprecated, use `instance#unregisterEvents()` method instead. https://github.com/idiotWu/smooth-scrollbar/wiki/Instance-Methods#instanceunregisterevents-regex--regex-regex--")},set friction(t){console.warn("`options.friction="+t+"` is deprecated, use `options.damping="+t/100+"` instead."),this.damping=t/100},get syncCallbacks(){return n.syncCallbacks},set syncCallbacks(t){n.syncCallbacks=!!t},get renderByPixels(){return n.renderByPixels},set renderByPixels(t){n.renderByPixels=!!t},get alwaysShowTracks(){return n.alwaysShowTracks},set alwaysShowTracks(t){t=!!t,n.alwaysShowTracks=t;var r=e.targets.container;t?(e.showTrack(),r.classList.add("sticky")):(e.hideTrack(),r.classList.remove("sticky"))},get continuousScrolling(){return i(n.continuousScrolling)},set continuousScrolling(t){"auto"===t?n.continuousScrolling=t:n.continuousScrolling=!!t},get overscrollEffect(){return n.overscrollEffect},set overscrollEffect(t){t&&!~r.overscrollEffect.indexOf(t)&&(console.warn("`overscrollEffect` should be one of "+(0,s.default)(r.overscrollEffect)+", but got "+(0,s.default)(t)+". It will be set to `false` now."),t=!1),n.overscrollEffect=t},get overscrollEffectColor(){return n.overscrollEffectColor},set overscrollEffectColor(t){n.overscrollEffectColor=t}};(0,l.default)(n).filter(function(t){return!u.hasOwnProperty(t)}).forEach(function(t){(0,a.default)(u,t,{enumerable:!0,get:function(){return n[t]},set:function(e){if(isNaN(parseFloat(e)))throw new TypeError("expect `options."+t+"` to be a number, but got "+("undefined"==typeof e?"undefined":b(e)));n[t]=g.pickInRange.apply(void 0,[e].concat(o(r[t])))}})}),this.__readonly("options",u),this.setOptions(t)}var u=n(85),a=r(u),c=n(89),l=r(c),f=n(185),s=r(f),d=n(2),h=r(d),v=n(55),_=r(v),p=n(62),y=r(p),b="function"==typeof y.default&&"symbol"==typeof _.default?function(t){return typeof t}:function(t){return t&&"function"==typeof y.default&&t.constructor===y.default&&t!==y.default.prototype?"symbol":typeof t},g=n(116),m=n(77);Object.defineProperty(m.SmoothScrollbar.prototype,"__initOptions",{value:i,writable:!0,configurable:!0})},function(t,e,n){t.exports={default:n(186),__esModule:!0}},function(t,e,n){var r=n(12),o=r.JSON||(r.JSON={stringify:JSON.stringify});t.exports=function(t){return o.stringify.apply(o,arguments)}},function(t,e,n){"use strict";function r(){var t=arguments.length>0&&void 0!==arguments[0]&&arguments[0];this.reverseWheel(t)}var o=n(77);Object.defineProperty(o.SmoothScrollbar.prototype,"__initReverseWheel",{value:r,writable:!0,configurable:!0})},function(t,e,n){"use strict";function r(){this.update(),this.__keyboardHandler(),this.__resizeHandler(),this.__selectHandler(),this.__mouseHandler(),this.__touchHandler(),this.__wheelHandler(),this.__dragHandler(),this.__render()}var o=n(77);Object.defineProperty(o.SmoothScrollbar.prototype,"__initScrollbar",{value:r,writable:!0,configurable:!0})},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}function o(t,e){return(0,u.default)(this,t,{value:e,enumerable:!0,configurable:!0})}var i=n(85),u=r(i),a=n(77);Object.defineProperty(a.SmoothScrollbar.prototype,"__readonly",{value:o,writable:!0,configurable:!0})},function(t,e,n){"use strict";function r(){var t=this.targets,e=this.size,n=this.offset,r=this.thumbOffset,i=this.thumbSize;r.x=n.x/e.content.width*(e.container.width-(i.x-i.realX)),r.y=n.y/e.content.height*(e.container.height-(i.y-i.realY)),(0,o.setStyle)(t.xAxis.thumb,{"-transform":"translate3d("+r.x+"px, 0, 0)"}),(0,o.setStyle)(t.yAxis.thumb,{"-transform":"translate3d(0, "+r.y+"px, 0)"})}var o=n(116),i=n(77);Object.defineProperty(i.SmoothScrollbar.prototype,"__setThumbPosition",{value:r,writable:!0,configurable:!0})},function(t,e,n){"use strict";function r(){var t=this.targets.container,e=t.getBoundingClientRect(),n=e.top,r=e.right,o=e.bottom,i=e.left,u=window,a=u.innerHeight,c=u.innerWidth;this.__readonly("bounding",{top:Math.max(n,0),right:Math.min(r,c),bottom:Math.min(o,a),left:Math.max(i,0)})}var o=n(77);Object.defineProperty(o.SmoothScrollbar.prototype,"__updateBounding",{value:r,writable:!0,configurable:!0})},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}function o(t){if(Array.isArray(t)){for(var e=0,n=Array(t.length);e<t.length;e++)n[e]=t[e];return n}return(0,a.default)(t)}function i(){var t=this.targets,e=t.container,n=t.content;this.__readonly("children",[].concat(o(n.querySelectorAll(l.selectors)))),this.__readonly("isNestedScrollbar",!1);for(var r=[],i=e;i=i.parentElement;)l.sbList.has(i)&&(this.__readonly("isNestedScrollbar",!0),r.push(i));this.__readonly("parents",r)}var u=n(2),a=r(u),c=n(77),l=n(88);Object.defineProperty(c.SmoothScrollbar.prototype,"__updateTree",{value:i,writable:!0,configurable:!0})},function(t,e){}])});
},{}],46:[function(require,module,exports){
!function(root, factory) {
    "function" == typeof define && define.amd ? // AMD. Register as an anonymous module unless amdModuleId is set
    define([], function() {
        return root.svg4everybody = factory();
    }) : "object" == typeof module && module.exports ? // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory() : root.svg4everybody = factory();
}(this, function() {
    /*! svg4everybody v2.1.9 | github.com/jonathantneal/svg4everybody */
    function embed(parent, svg, target) {
        // if the target exists
        if (target) {
            // create a document fragment to hold the contents of the target
            var fragment = document.createDocumentFragment(), viewBox = !svg.hasAttribute("viewBox") && target.getAttribute("viewBox");
            // conditionally set the viewBox on the svg
            viewBox && svg.setAttribute("viewBox", viewBox);
            // copy the contents of the clone into the fragment
            for (// clone the target
            var clone = target.cloneNode(!0); clone.childNodes.length; ) {
                fragment.appendChild(clone.firstChild);
            }
            // append the fragment into the svg
            parent.appendChild(fragment);
        }
    }
    function loadreadystatechange(xhr) {
        // listen to changes in the request
        xhr.onreadystatechange = function() {
            // if the request is ready
            if (4 === xhr.readyState) {
                // get the cached html document
                var cachedDocument = xhr._cachedDocument;
                // ensure the cached html document based on the xhr response
                cachedDocument || (cachedDocument = xhr._cachedDocument = document.implementation.createHTMLDocument(""), 
                cachedDocument.body.innerHTML = xhr.responseText, xhr._cachedTarget = {}), // clear the xhr embeds list and embed each item
                xhr._embeds.splice(0).map(function(item) {
                    // get the cached target
                    var target = xhr._cachedTarget[item.id];
                    // ensure the cached target
                    target || (target = xhr._cachedTarget[item.id] = cachedDocument.getElementById(item.id)), 
                    // embed the target into the svg
                    embed(item.parent, item.svg, target);
                });
            }
        }, // test the ready state change immediately
        xhr.onreadystatechange();
    }
    function svg4everybody(rawopts) {
        function oninterval() {
            // while the index exists in the live <use> collection
            for (// get the cached <use> index
            var index = 0; index < uses.length; ) {
                // get the current <use>
                var use = uses[index], parent = use.parentNode, svg = getSVGAncestor(parent), src = use.getAttribute("xlink:href") || use.getAttribute("href");
                if (!src && opts.attributeName && (src = use.getAttribute(opts.attributeName)), 
                svg && src) {
                    if (polyfill) {
                        if (!opts.validate || opts.validate(src, svg, use)) {
                            // remove the <use> element
                            parent.removeChild(use);
                            // parse the src and get the url and id
                            var srcSplit = src.split("#"), url = srcSplit.shift(), id = srcSplit.join("#");
                            // if the link is external
                            if (url.length) {
                                // get the cached xhr request
                                var xhr = requests[url];
                                // ensure the xhr request exists
                                xhr || (xhr = requests[url] = new XMLHttpRequest(), xhr.open("GET", url), xhr.send(), 
                                xhr._embeds = []), // add the svg and id as an item to the xhr embeds list
                                xhr._embeds.push({
                                    parent: parent,
                                    svg: svg,
                                    id: id
                                }), // prepare the xhr ready state change event
                                loadreadystatechange(xhr);
                            } else {
                                // embed the local id into the svg
                                embed(parent, svg, document.getElementById(id));
                            }
                        } else {
                            // increase the index when the previous value was not "valid"
                            ++index, ++numberOfSvgUseElementsToBypass;
                        }
                    }
                } else {
                    // increase the index when the previous value was not "valid"
                    ++index;
                }
            }
            // continue the interval
            (!uses.length || uses.length - numberOfSvgUseElementsToBypass > 0) && requestAnimationFrame(oninterval, 67);
        }
        var polyfill, opts = Object(rawopts), newerIEUA = /\bTrident\/[567]\b|\bMSIE (?:9|10)\.0\b/, webkitUA = /\bAppleWebKit\/(\d+)\b/, olderEdgeUA = /\bEdge\/12\.(\d+)\b/, edgeUA = /\bEdge\/.(\d+)\b/, inIframe = window.top !== window.self;
        polyfill = "polyfill" in opts ? opts.polyfill : newerIEUA.test(navigator.userAgent) || (navigator.userAgent.match(olderEdgeUA) || [])[1] < 10547 || (navigator.userAgent.match(webkitUA) || [])[1] < 537 || edgeUA.test(navigator.userAgent) && inIframe;
        // create xhr requests object
        var requests = {}, requestAnimationFrame = window.requestAnimationFrame || setTimeout, uses = document.getElementsByTagName("use"), numberOfSvgUseElementsToBypass = 0;
        // conditionally start the interval if the polyfill is active
        polyfill && oninterval();
    }
    function getSVGAncestor(node) {
        for (var svg = node; "svg" !== svg.nodeName.toLowerCase() && (svg = svg.parentNode); ) {}
        return svg;
    }
    return svg4everybody;
});
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHMvc2NyaXB0cy9hcHAuanMiLCJhc3NldHMvc2NyaXB0cy9nbG9iYWxzLmpzIiwiYXNzZXRzL3NjcmlwdHMvbW9kdWxlcy5qcyIsImFzc2V0cy9zY3JpcHRzL21vZHVsZXMvQWJzdHJhY3RNb2R1bGUuanMiLCJhc3NldHMvc2NyaXB0cy9tb2R1bGVzL0V4YW1wbGUuanMiLCJhc3NldHMvc2NyaXB0cy9tb2R1bGVzL0xvY29tb3RpdmVTY3JvbGwuanMiLCJhc3NldHMvc2NyaXB0cy9zY3JvbGwvU2Nyb2xsLmpzIiwiYXNzZXRzL3NjcmlwdHMvc2Nyb2xsL1Ntb290aFNjcm9sbC5qcyIsImFzc2V0cy9zY3JpcHRzL3Njcm9sbC92ZW5kb3JzL1Njcm9sbC5qcyIsImFzc2V0cy9zY3JpcHRzL3Njcm9sbC92ZW5kb3JzL1Njcm9sbE1hbmFnZXIuanMiLCJhc3NldHMvc2NyaXB0cy9zY3JvbGwvdmVuZG9ycy9TbW9vdGhTY3JvbGwuanMiLCJhc3NldHMvc2NyaXB0cy90cmFuc2l0aW9ucy9CYXNlVHJhbnNpdGlvbi5qcyIsImFzc2V0cy9zY3JpcHRzL3RyYW5zaXRpb25zL0N1c3RvbVRyYW5zaXRpb24uanMiLCJhc3NldHMvc2NyaXB0cy90cmFuc2l0aW9ucy9UcmFuc2l0aW9uTWFuYWdlci5qcyIsImFzc2V0cy9zY3JpcHRzL3RyYW5zaXRpb25zL3RyYW5zaXRpb25zLmpzIiwiYXNzZXRzL3NjcmlwdHMvdXRpbHMvYXJyYXkuanMiLCJhc3NldHMvc2NyaXB0cy91dGlscy9kZWJvdW5jZS5qcyIsImFzc2V0cy9zY3JpcHRzL3V0aWxzL2Vudmlyb25tZW50LmpzIiwiYXNzZXRzL3NjcmlwdHMvdXRpbHMvaHRtbC5qcyIsImFzc2V0cy9zY3JpcHRzL3V0aWxzL2lzLmpzIiwibm9kZV9tb2R1bGVzL3BqYXgvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcGpheC9saWIvYWJvcnQtcmVxdWVzdC5qcyIsIm5vZGVfbW9kdWxlcy9wamF4L2xpYi9ldmFsLXNjcmlwdC5qcyIsIm5vZGVfbW9kdWxlcy9wamF4L2xpYi9ldmVudHMvb24uanMiLCJub2RlX21vZHVsZXMvcGpheC9saWIvZXZlbnRzL3RyaWdnZXIuanMiLCJub2RlX21vZHVsZXMvcGpheC9saWIvZXhlY3V0ZS1zY3JpcHRzLmpzIiwibm9kZV9tb2R1bGVzL3BqYXgvbGliL2ZvcmVhY2gtZWxzLmpzIiwibm9kZV9tb2R1bGVzL3BqYXgvbGliL2ZvcmVhY2gtc2VsZWN0b3JzLmpzIiwibm9kZV9tb2R1bGVzL3BqYXgvbGliL2lzLXN1cHBvcnRlZC5qcyIsIm5vZGVfbW9kdWxlcy9wamF4L2xpYi9wYXJzZS1vcHRpb25zLmpzIiwibm9kZV9tb2R1bGVzL3BqYXgvbGliL3Byb3RvL2F0dGFjaC1mb3JtLmpzIiwibm9kZV9tb2R1bGVzL3BqYXgvbGliL3Byb3RvL2F0dGFjaC1saW5rLmpzIiwibm9kZV9tb2R1bGVzL3BqYXgvbGliL3Byb3RvL2hhbmRsZS1yZXNwb25zZS5qcyIsIm5vZGVfbW9kdWxlcy9wamF4L2xpYi9wcm90by9sb2cuanMiLCJub2RlX21vZHVsZXMvcGpheC9saWIvcHJvdG8vcGFyc2UtZWxlbWVudC5qcyIsIm5vZGVfbW9kdWxlcy9wamF4L2xpYi9zZW5kLXJlcXVlc3QuanMiLCJub2RlX21vZHVsZXMvcGpheC9saWIvc3dpdGNoZXMtc2VsZWN0b3JzLmpzIiwibm9kZV9tb2R1bGVzL3BqYXgvbGliL3N3aXRjaGVzLmpzIiwibm9kZV9tb2R1bGVzL3BqYXgvbGliL3VuaXF1ZWlkLmpzIiwibm9kZV9tb2R1bGVzL3BqYXgvbGliL3V0aWwvY2xvbmUuanMiLCJub2RlX21vZHVsZXMvcGpheC9saWIvdXRpbC9jb250YWlucy5qcyIsIm5vZGVfbW9kdWxlcy9wamF4L2xpYi91dGlsL2V4dGVuZC5qcyIsIm5vZGVfbW9kdWxlcy9wamF4L2xpYi91dGlsL25vb3AuanMiLCJub2RlX21vZHVsZXMvcGpheC9saWIvdXRpbC91cGRhdGUtcXVlcnktc3RyaW5nLmpzIiwibm9kZV9tb2R1bGVzL3Ntb290aC1zY3JvbGxiYXIvZGlzdC9zbW9vdGgtc2Nyb2xsYmFyLmpzIiwibm9kZV9tb2R1bGVzL3N2ZzRldmVyeWJvZHkvZGlzdC9zdmc0ZXZlcnlib2R5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7OztBQ0FBOztBQUVBOztBQUVBOztBQUNBOztBQUNBOztBQUdBOzs7Ozs7Ozs7Ozs7QUFFQSxJQUFNLFdBQVcsR0FBRyxLQUFwQjtBQUNBLElBQU0sZUFBZSxhQUFNLHFCQUFOLGNBQWtCLFdBQWxCLENBQXJCO0FBRU8sSUFBTSxLQUFLLEdBQUc7QUFDakIsRUFBQSxZQUFZLHdCQUFpQixlQUFqQixDQURLO0FBRWpCLEVBQUEsbUJBQW1CLDhCQUF1QixlQUF2QixDQUZGO0FBR2pCLEVBQUEscUJBQXFCLGdDQUF5QixlQUF6QjtBQUhKLENBQWQ7OztJQU1ELEc7OztBQUNGLGlCQUFjO0FBQUE7O0FBQUE7O0FBQ1YsU0FBSyxPQUFMLEdBQWUsT0FBZjtBQUNBLFNBQUssY0FBTCxHQUFzQixFQUF0Qjs7QUFFQSwyQkFBVSxFQUFWLENBQWEsS0FBSyxDQUFDLFlBQW5CLEVBQWlDLFVBQUMsS0FBRCxFQUFXO0FBQ3hDLE1BQUEsS0FBSSxDQUFDLFdBQUwsQ0FBaUIsS0FBSyxDQUFDLFVBQXZCLEVBQ0ssYUFETCxDQUNtQixLQURuQixFQUVLLFdBRkwsQ0FFaUIsS0FGakI7QUFHSCxLQUpEOztBQU1BLDJCQUFVLEVBQVYsQ0FBYSxLQUFLLENBQUMsbUJBQW5CLEVBQXdDLFVBQUMsS0FBRCxFQUFXO0FBQy9DLE1BQUEsS0FBSSxDQUFDLFdBQUwsQ0FBaUIsS0FBakI7QUFDSCxLQUZEOztBQUlBLDJCQUFVLEVBQVYsQ0FBYSxLQUFLLENBQUMscUJBQW5CLEVBQTBDLFVBQUMsS0FBRCxFQUFXO0FBQ2pELE1BQUEsS0FBSSxDQUFDLGFBQUwsQ0FBbUIsS0FBbkI7QUFDSCxLQUZEO0FBR0g7QUFFRDs7Ozs7Ozs7O2tDQUtjLEss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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeFJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJpbXBvcnQgeyBBUFBfTkFNRSwgJGRvY3VtZW50LCAkcGpheFdyYXBwZXIgfSBmcm9tICcuL3V0aWxzL2Vudmlyb25tZW50JztcblxuaW1wb3J0IGdsb2JhbHMgZnJvbSAnLi9nbG9iYWxzJztcblxuaW1wb3J0IHsgYXJyYXlDb250YWlucywgcmVtb3ZlRnJvbUFycmF5IH0gZnJvbSAnLi91dGlscy9hcnJheSc7XG5pbXBvcnQgeyBnZXROb2RlRGF0YSB9IGZyb20gJy4vdXRpbHMvaHRtbCc7XG5pbXBvcnQgeyBpc0Z1bmN0aW9uIH0gZnJvbSAnLi91dGlscy9pcyc7XG5cbi8vIEJhc2ljIG1vZHVsZXNcbmltcG9ydCAqIGFzIG1vZHVsZXMgZnJvbSAnLi9tb2R1bGVzJztcblxuY29uc3QgTU9EVUxFX05BTUUgPSAnQXBwJztcbmNvbnN0IEVWRU5UX05BTUVTUEFDRSA9IGAke0FQUF9OQU1FfS4ke01PRFVMRV9OQU1FfWA7XG5cbmV4cG9ydCBjb25zdCBFVkVOVCA9IHtcbiAgICBJTklUX01PRFVMRVM6IGBpbml0TW9kdWxlcy4ke0VWRU5UX05BTUVTUEFDRX1gLFxuICAgIElOSVRfU0NPUEVEX01PRFVMRVM6IGBpbml0U2NvcGVkTW9kdWxlcy4ke0VWRU5UX05BTUVTUEFDRX1gLFxuICAgIERFTEVURV9TQ09QRURfTU9EVUxFUzogYGRlbGV0ZVNjb3BlZE1vZHVsZXMuJHtFVkVOVF9OQU1FU1BBQ0V9YFxufTtcblxuY2xhc3MgQXBwIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5tb2R1bGVzID0gbW9kdWxlcztcbiAgICAgICAgdGhpcy5jdXJyZW50TW9kdWxlcyA9IFtdO1xuXG4gICAgICAgICRkb2N1bWVudC5vbihFVkVOVC5JTklUX01PRFVMRVMsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5pbml0R2xvYmFscyhldmVudC5maXJzdEJsb29kKVxuICAgICAgICAgICAgICAgIC5kZWxldGVNb2R1bGVzKGV2ZW50KVxuICAgICAgICAgICAgICAgIC5pbml0TW9kdWxlcyhldmVudCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRkb2N1bWVudC5vbihFVkVOVC5JTklUX1NDT1BFRF9NT0RVTEVTLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIHRoaXMuaW5pdE1vZHVsZXMoZXZlbnQpO1xuICAgICAgICB9KTtcblxuICAgICAgICAkZG9jdW1lbnQub24oRVZFTlQuREVMRVRFX1NDT1BFRF9NT0RVTEVTLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZGVsZXRlTW9kdWxlcyhldmVudCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERlc3Ryb3kgYWxsIGV4aXN0aW5nIG1vZHVsZXMgb3IgYSBzcGVjaWZpYyBzY29wZSBvZiBtb2R1bGVzXG4gICAgICogQHBhcmFtICB7T2JqZWN0fSBldmVudCBUaGUgZXZlbnQgYmVpbmcgdHJpZ2dlcmVkLlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gICAgICAgU2VsZiAoYWxsb3dzIGNoYWluaW5nKVxuICAgICAqL1xuICAgIGRlbGV0ZU1vZHVsZXMoZXZlbnQpIHtcbiAgICAgICAgbGV0IGRlc3Ryb3lBbGwgPSB0cnVlO1xuICAgICAgICBsZXQgbW9kdWxlSWRzID0gW107XG5cbiAgICAgICAgLy8gQ2hlY2sgZm9yIHNjb3BlIGZpcnN0XG4gICAgICAgIGlmIChldmVudC4kc2NvcGUgaW5zdGFuY2VvZiBqUXVlcnkgJiYgZXZlbnQuJHNjb3BlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIC8vIE1vZHVsZXMgd2l0aGluIHNjb3BlXG4gICAgICAgICAgICBjb25zdCAkbW9kdWxlcyA9IGV2ZW50LiRzY29wZS5maW5kKCdbZGF0YS1tb2R1bGVdJyk7XG5cbiAgICAgICAgICAgIC8vIERldGVybWluZSB0aGVpciB1aWRzXG4gICAgICAgICAgICBtb2R1bGVJZHMgPSAkLm1ha2VBcnJheSgkbW9kdWxlcy5tYXAoZnVuY3Rpb24oaW5kZXgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJG1vZHVsZXMuZXEoaW5kZXgpLmRhdGEoJ3VpZCcpO1xuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICBpZiAobW9kdWxlSWRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBkZXN0cm95QWxsID0gZmFsc2U7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gTG9vcCBtb2R1bGVzIGFuZCBkZXN0cm95aW5nIGFsbCBvZiB0aGVtLCBvciBzcGVjaWZpYyBvbmVzXG4gICAgICAgIGxldCBpID0gdGhpcy5jdXJyZW50TW9kdWxlcy5sZW5ndGg7XG5cbiAgICAgICAgd2hpbGUgKGktLSkge1xuICAgICAgICAgICAgaWYgKGRlc3Ryb3lBbGwgfHwgYXJyYXlDb250YWlucyhtb2R1bGVJZHMsIHRoaXMuY3VycmVudE1vZHVsZXNbaV0udWlkKSkge1xuICAgICAgICAgICAgICAgIHJlbW92ZUZyb21BcnJheShtb2R1bGVJZHMsIHRoaXMuY3VycmVudE1vZHVsZXNbaV0udWlkKTtcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRNb2R1bGVzW2ldLmRlc3Ryb3koKTtcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRNb2R1bGVzLnNwbGljZShpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV4ZWN1dGUgZ2xvYmFsIGZ1bmN0aW9ucyBhbmQgc2V0dGluZ3NcbiAgICAgKiBBbGxvd3MgeW91IHRvIGluaXRpYWxpemUgZ2xvYmFsIG1vZHVsZXMgb25seSBvbmNlIGlmIHlvdSBuZWVkXG4gICAgICogKGV4Ljogd2hlbiB1c2luZyBCYXJiYS5qcyBvciBTbW9vdGhTdGF0ZS5qcylcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IFNlbGYgKGFsbG93cyBjaGFpbmluZylcbiAgICAgKi9cbiAgICBpbml0R2xvYmFscyhmaXJzdEJsb29kKSB7XG4gICAgICAgIGdsb2JhbHMoZmlyc3RCbG9vZCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEZpbmQgbW9kdWxlcyBhbmQgaW5pdGlhbGl6ZSB0aGVtXG4gICAgICogQHBhcmFtICB7T2JqZWN0fSBldmVudCBUaGUgZXZlbnQgYmVpbmcgdHJpZ2dlcmVkLlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gICAgICAgU2VsZiAoYWxsb3dzIGNoYWluaW5nKVxuICAgICAqL1xuICAgIGluaXRNb2R1bGVzKGV2ZW50KSB7XG4gICAgICAgIC8vIEVsZW1lbnRzIHdpdGggbW9kdWxlXG4gICAgICAgIGxldCAkbW9kdWxlRWxzID0gW107XG5cbiAgICAgICAgLy8gSWYgZmlyc3QgYmxvb2QsIGxvYWQgYWxsIG1vZHVsZXMgaW4gdGhlIERPTVxuICAgICAgICAvLyBJZiBzY29wZWQsIHJlbmRlciBlbGVtZW50cyB3aXRoIG1vZHVsZXNcbiAgICAgICAgLy8gSWYgQmFyYmEsIGxvYWQgbW9kdWxlcyBjb250YWluZWQgaW4gQmFyYmEgY29udGFpbmVyXG4gICAgICAgIGlmIChldmVudC5maXJzdEJsb29kKSB7XG4gICAgICAgICAgICAkbW9kdWxlRWxzID0gJGRvY3VtZW50LmZpbmQoJ1tkYXRhLW1vZHVsZV0nKTtcbiAgICAgICAgfSBlbHNlIGlmIChldmVudC4kc2NvcGUgaW5zdGFuY2VvZiBqUXVlcnkgJiYgZXZlbnQuJHNjb3BlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICRtb2R1bGVFbHMgPSBldmVudC4kc2NvcGUuZmluZCgnW2RhdGEtbW9kdWxlXScpO1xuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50LmlzUGpheCkge1xuICAgICAgICAgICAgJG1vZHVsZUVscyA9ICRwamF4V3JhcHBlci5maW5kKCdbZGF0YS1tb2R1bGVdJyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBMb29wIHRocm91Z2ggZWxlbWVudHNcbiAgICAgICAgbGV0IGkgPSAwO1xuICAgICAgICBjb25zdCBlbHNMZW4gPSAkbW9kdWxlRWxzLmxlbmd0aDtcblxuICAgICAgICBmb3IgKDsgaSA8IGVsc0xlbjsgaSsrKSB7XG5cbiAgICAgICAgICAgIC8vIEN1cnJlbnQgZWxlbWVudFxuICAgICAgICAgICAgbGV0IGVsID0gJG1vZHVsZUVsc1tpXTtcblxuICAgICAgICAgICAgLy8gQWxsIGRhdGEtIGF0dHJpYnV0ZXMgY29uc2lkZXJlZCBhcyBvcHRpb25zXG4gICAgICAgICAgICBsZXQgb3B0aW9ucyA9IGdldE5vZGVEYXRhKGVsKTtcblxuICAgICAgICAgICAgLy8gQWRkIGN1cnJlbnQgRE9NIGVsZW1lbnQgYW5kIGpRdWVyeSBlbGVtZW50XG4gICAgICAgICAgICBvcHRpb25zLmVsID0gZWw7XG4gICAgICAgICAgICBvcHRpb25zLiRlbCA9ICRtb2R1bGVFbHMuZXEoaSk7XG5cbiAgICAgICAgICAgIC8vIE1vZHVsZSBkb2VzIGV4aXN0IGF0IHRoaXMgcG9pbnRcbiAgICAgICAgICAgIGxldCBhdHRyID0gb3B0aW9ucy5tb2R1bGU7XG5cbiAgICAgICAgICAgIC8vIFNwbGl0dGluZyBtb2R1bGVzIGZvdW5kIGluIHRoZSBkYXRhLWF0dHJpYnV0ZVxuICAgICAgICAgICAgbGV0IG1vZHVsZUlkZW50cyA9IGF0dHIuc3BsaXQoL1ssXFxzXSsvZyk7XG5cbiAgICAgICAgICAgIC8vIExvb3AgbW9kdWxlc1xuICAgICAgICAgICAgbGV0IGogPSAwO1xuICAgICAgICAgICAgbGV0IG1vZHVsZXNMZW4gPSBtb2R1bGVJZGVudHMubGVuZ3RoO1xuXG4gICAgICAgICAgICBmb3IgKDsgaiA8IG1vZHVsZXNMZW47IGorKykge1xuICAgICAgICAgICAgICAgIGxldCBtb2R1bGVBdHRyID0gbW9kdWxlSWRlbnRzW2pdO1xuXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzLm1vZHVsZXNbbW9kdWxlQXR0cl0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG1vZHVsZSA9IG5ldyB0aGlzLm1vZHVsZXNbbW9kdWxlQXR0cl0ob3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudE1vZHVsZXMucHVzaChtb2R1bGUpO1xuICAgICAgICAgICAgICAgICAgICBtb2R1bGUuaW5pdCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn1cblxuLy8gSUlGRSBmb3IgbG9hZGluZyB0aGUgYXBwbGljYXRpb25cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4oZnVuY3Rpb24oKSB7XG4gICAgbmV3IEFwcCgpO1xuICAgICRkb2N1bWVudC50cmlnZ2VySGFuZGxlcih7XG4gICAgICAgIHR5cGU6IEVWRU5ULklOSVRfTU9EVUxFUyxcbiAgICAgICAgZmlyc3RCbG9vZDogdHJ1ZVxuICAgIH0pO1xufSkoKTtcbiIsImltcG9ydCBUcmFuc2l0aW9uTWFuYWdlciBmcm9tICcuL3RyYW5zaXRpb25zL1RyYW5zaXRpb25NYW5hZ2VyJztcbmltcG9ydCBzdmc0ZXZlcnlib2R5IGZyb20gJ3N2ZzRldmVyeWJvZHknO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihmaXJzdEJsb29kKSB7XG4gICAgc3ZnNGV2ZXJ5Ym9keSgpO1xuXG4gICAgaWYgKGZpcnN0Qmxvb2QpIHtcbiAgICAgICAgY29uc3QgdHJhbnNpdGlvbk1hbmFnZXIgPSBuZXcgVHJhbnNpdGlvbk1hbmFnZXIoKTtcbiAgICB9XG59XG4iLCJleHBvcnQge2RlZmF1bHQgYXMgRXhhbXBsZX0gZnJvbSAnLi9tb2R1bGVzL0V4YW1wbGUnO1xuZXhwb3J0IHtkZWZhdWx0IGFzIExvY29tb3RpdmVTY3JvbGx9IGZyb20gJy4vbW9kdWxlcy9Mb2NvbW90aXZlU2Nyb2xsJztcbiIsImxldCB1aWQgPSAwO1xuXG4vKipcbiAqIEFic3RyYWN0IE1vZHVsZVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyB7XG4gICAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgICAgICB0aGlzLiRlbCA9IG9wdGlvbnMuJGVsIHx8IG51bGw7XG4gICAgICAgIHRoaXMuZWwgID0gb3B0aW9ucy5lbCAgfHwgbnVsbDtcblxuICAgICAgICAvLyBHZW5lcmF0ZSBhIHVuaXF1ZSBtb2R1bGUgaWRlbnRpZmllclxuICAgICAgICB0aGlzLnVpZCA9ICdtLScgKyB1aWQrKztcbiAgICAgICAgLy8gVXNlIGpRdWVyeSdzIGRhdGEgQVBJIHRvIFwic3RvcmUgaXQgaW4gdGhlIERPTVwiXG4gICAgICAgIHRoaXMuJGVsLmRhdGEoJ3VpZCcsIHRoaXMudWlkKTtcbiAgICB9XG5cbiAgICBpbml0KCkge31cblxuICAgIGRlc3Ryb3koKSB7XG4gICAgICAgIGlmICh0aGlzLiRlbCkge1xuICAgICAgICAgICAgdGhpcy4kZWwucmVtb3ZlRGF0YSgndWlkJylcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImltcG9ydCB7IEFQUF9OQU1FIH0gZnJvbSAnLi4vdXRpbHMvZW52aXJvbm1lbnQnO1xuaW1wb3J0IEFic3RyYWN0TW9kdWxlIGZyb20gJy4vQWJzdHJhY3RNb2R1bGUnO1xuXG5jb25zdCBNT0RVTEVfTkFNRSA9ICdFeGFtcGxlJztcbmNvbnN0IEVWRU5UX05BTUVTUEFDRSA9IGAke0FQUF9OQU1FfS4ke01PRFVMRV9OQU1FfWA7XG5cbmNvbnN0IEVWRU5UID0ge1xuICAgIENMSUNLOiBgY2xpY2suJHtFVkVOVF9OQU1FU1BBQ0V9YFxufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgZXh0ZW5kcyBBYnN0cmFjdE1vZHVsZSB7XG4gICAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgICAgICBzdXBlcihvcHRpb25zKTtcblxuICAgICAgICAvLyBEZWNsYXJhdGlvbiBvZiBwcm9wZXJ0aWVzXG4gICAgICAgIGNvbnNvbGUubG9nKCfwn5SoIFttb2R1bGVdOmNvbnN0cnVjdG9yIC0gRXhhbXBsZScpO1xuXG4gICAgfVxuXG4gICAgaW5pdCgpIHtcbiAgICAgICAgLy8gU2V0IGV2ZW50cyBhbmQgc3VjaFxuXG4gICAgfVxuXG4gICAgZGVzdHJveSgpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ+KdjCBbbW9kdWxlXTpkZXN0cm95IC0gRXhhbXBsZScpO1xuICAgICAgICBzdXBlci5kZXN0cm95KCk7XG4gICAgICAgIHRoaXMuJGVsLm9mZihgLiR7RVZFTlRfTkFNRVNQQUNFfWApO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IEFQUF9OQU1FLCAkZG9jdW1lbnQgfSBmcm9tICcuLi91dGlscy9lbnZpcm9ubWVudCc7XG5pbXBvcnQgQWJzdHJhY3RNb2R1bGUgZnJvbSAnLi9BYnN0cmFjdE1vZHVsZSc7XG5pbXBvcnQgU2Nyb2xsTWFuYWdlciBmcm9tICcuLi9zY3JvbGwvdmVuZG9ycy9TY3JvbGxNYW5hZ2VyJztcblxuY29uc3QgTU9EVUxFX05BTUUgPSAnTG9jb21vdGl2ZVNjcm9sbCc7XG5jb25zdCBFVkVOVF9OQU1FU1BBQ0UgPSBgJHtBUFBfTkFNRX0uJHtNT0RVTEVfTkFNRX1gO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBleHRlbmRzIEFic3RyYWN0TW9kdWxlIHtcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgICAgIHN1cGVyKG9wdGlvbnMpO1xuICAgIH1cblxuICAgIGluaXQoKSB7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zY3JvbGxNYW5hZ2VyID0gbmV3IFNjcm9sbE1hbmFnZXIoe1xuICAgICAgICAgICAgICAgIGNvbnRhaW5lcjogdGhpcy4kZWwsXG4gICAgICAgICAgICAgICAgc2VsZWN0b3I6ICcuanMtYW5pbWF0ZScsXG4gICAgICAgICAgICAgICAgc21vb3RoOiB0cnVlLFxuICAgICAgICAgICAgICAgIHNtb290aE1vYmlsZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgbW9iaWxlQ29udGFpbmVyOiAkZG9jdW1lbnQsXG4gICAgICAgICAgICAgICAgZ2V0V2F5OiBmYWxzZSxcbiAgICAgICAgICAgICAgICBnZXRTcGVlZDogZmFsc2VcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LCA1MDApO1xuICAgIH1cblxuICAgIGRlc3Ryb3koKSB7XG4gICAgICAgIHN1cGVyLmRlc3Ryb3koKTtcbiAgICAgICAgdGhpcy5zY3JvbGxNYW5hZ2VyLmRlc3Ryb3koKTtcbiAgICB9XG59XG4iLCIvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gRXh0ZW5kZWQgTG9jb21vdGl2ZSBTY3JvbGxcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vKiBqc2hpbnQgZXNuZXh0OiB0cnVlICovXG5pbXBvcnQgU2Nyb2xsLCB7IEVWRU5UX0tFWSBhcyBWRU5ET1JfRVZFTlRfS0VZLCBFVkVOVCBhcyBWRU5ET1JfRVZFTlRTLCBERUZBVUxUUyBhcyBWRU5ET1JfREVGQVVMVFMgfSBmcm9tICcuL3ZlbmRvcnMvU2Nyb2xsJ1xuXG4vKipcbiAqIFVOQ09NTUVOVCBPTkxZIFRIRSBMSU5FUyBZT1UgTkVFRFxuICovXG4vLyBpbXBvcnQgeyAkd2luZG93LCAkZG9jdW1lbnQgfSBmcm9tICcuLi8uLi91dGlscy9lbnZpcm9ubWVudCc7XG4vLyBpbXBvcnQgZGVib3VuY2UgZnJvbSAnLi4vLi4vdXRpbHMvZGVib3VuY2UnO1xuLy8gaW1wb3J0IHsgaXNOdW1lcmljIH0gZnJvbSAnLi4vLi4vdXRpbHMvaXMnO1xuXG5leHBvcnQgY29uc3QgRVZFTlRfS0VZID0gVkVORE9SX0VWRU5UX0tFWTtcblxuZXhwb3J0IGNvbnN0IEVWRU5UID0gT2JqZWN0LmFzc2lnbihWRU5ET1JfRVZFTlRTLCB7XG4gICAgLy8gVEVTVDogYHRlc3QuJHtFVkVOVF9LRVl9YFxufSk7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUUyA9IE9iamVjdC5hc3NpZ24oVkVORE9SX0RFRkFVTFRTLCB7IH0pO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBleHRlbmRzIFNjcm9sbCB7XG4gICAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgICAgICBzdXBlcihvcHRpb25zKVxuICAgIH1cbn1cbiIsIi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBFeHRlbmRlZCBMb2NvbW90aXZlIFNtb290aCBTY3JvbGxcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vKiBqc2hpbnQgZXNuZXh0OiB0cnVlICovXG5pbXBvcnQgU21vb3RoU2Nyb2xsIGZyb20gJy4vdmVuZG9ycy9TbW9vdGhTY3JvbGwnXG5cbi8qKlxuICogVU5DT01NRU5UIE9OTFkgVEhFIExJTkVTIFlPVSBORUVEXG4gKi9cbi8vIGltcG9ydCB7ICR3aW5kb3csICRkb2N1bWVudCwgJGh0bWwgfSBmcm9tICcuLi91dGlscy9lbnZpcm9ubWVudCc7XG4vLyBpbXBvcnQgU2Nyb2xsLCB7IERFRkFVTFRTLCBFVkVOVCB9IGZyb20gJy4vU2Nyb2xsJztcblxuLy8gaW1wb3J0IGRlYm91bmNlIGZyb20gJy4uL3V0aWxzL2RlYm91bmNlJztcbi8vIGltcG9ydCBTY3JvbGxiYXIgZnJvbSAnc21vb3RoLXNjcm9sbGJhcic7XG4vLyBpbXBvcnQgeyBpc051bWVyaWMgfSBmcm9tICcuLi91dGlscy9pcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIGV4dGVuZHMgU21vb3RoU2Nyb2xsIHtcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgICAgIHN1cGVyKG9wdGlvbnMpXG4gICAgfVxufVxuIiwiLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIExvY29tb3RpdmUgU2Nyb2xsXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLyoganNoaW50IGVzbmV4dDogdHJ1ZSAqL1xuaW1wb3J0IHsgJHdpbmRvdywgJGRvY3VtZW50IH0gZnJvbSAnLi4vLi4vdXRpbHMvZW52aXJvbm1lbnQnO1xuXG5pbXBvcnQgZGVib3VuY2UgZnJvbSAnLi4vLi4vdXRpbHMvZGVib3VuY2UnO1xuaW1wb3J0IHsgaXNOdW1lcmljIH0gZnJvbSAnLi4vLi4vdXRpbHMvaXMnO1xuXG5leHBvcnQgY29uc3QgRVZFTlRfS0VZID0gYExvY29tb3RpdmVTY3JvbGxgO1xuXG5leHBvcnQgY29uc3QgRVZFTlQgPSB7XG4gICAgQ0xJQ0s6IGBjbGljay4ke0VWRU5UX0tFWX1gLFxuICAgIElTUkVBRFk6IGBpc1JlYWR5LiR7RVZFTlRfS0VZfWAsXG4gICAgUkVCVUlMRDogYHJlYnVpbGQuJHtFVkVOVF9LRVl9YCxcbiAgICBSRU5ERVI6IGByZW5kZXIuJHtFVkVOVF9LRVl9YCxcbiAgICBSRVNJWkU6IGByZXNpemUuJHtFVkVOVF9LRVl9YCxcbiAgICBTQ1JPTEw6IGBzY3JvbGwuJHtFVkVOVF9LRVl9YCxcbiAgICBTQ1JPTExUTzogYHNjcm9sbFRvLiR7RVZFTlRfS0VZfWAsXG4gICAgVVBEQVRFOiBgdXBkYXRlLiR7RVZFTlRfS0VZfWBcbn07XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUUyA9IHtcbiAgICBjb250YWluZXI6ICRkb2N1bWVudCxcbiAgICBtb2JpbGVDb250YWluZXI6ICRkb2N1bWVudCxcbiAgICBvblNjcm9sbDogZnVuY3Rpb24oKXt9LFxuICAgIHNlbGVjdG9yOiAnLmpzLWFuaW1hdGUnLFxuICAgIHNtb290aDogZmFsc2UsXG4gICAgc21vb3RoTW9iaWxlOiBmYWxzZSxcbiAgICByZXZlcnNlZDogZmFsc2UsXG4gICAgZ2V0V2F5OiBmYWxzZSxcbiAgICBnZXRTcGVlZDogZmFsc2Vcbn07XG5cbi8qKlxuICogTWFuYWdlIGFuaW1hdGlvbiBvZiBlbGVtZW50cyBvbiB0aGUgcGFnZSBhY2NvcmRpbmcgdG8gc2Nyb2xsIHBvc2l0aW9uLlxuICpcbiAqIEB0b2RvICBNYW5hZ2Ugc29tZSBvcHRpb25zIChub3JtYWxseSBmcm9tIGRhdGEgYXR0cmlidXRlcykgd2l0aCBjb25zdHJ1Y3RvciBvcHRpb25zIChleC46IHNldCByZXBlYXQgZm9yIGFsbClcbiAqIEB0b2RvICBNZXRob2QgdG8gZ2V0IHRoZSBkaXN0YW5jZSAoYXMgcGVyY2VudGFnZSkgb2YgYW4gZWxlbWVudCBpbiB0aGUgdmlld3BvcnRcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3Mge1xuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcblxuICAgICAgICB0aGlzLiRjb250YWluZXIgPSAob3B0aW9ucy5jb250YWluZXIpID8gb3B0aW9ucy5jb250YWluZXIgOiBERUZBVUxUUy5jb250YWluZXI7XG4gICAgICAgIHRoaXMuc2VsZWN0b3IgPSAob3B0aW9ucy5zZWxlY3RvcikgPyBvcHRpb25zLnNlbGVjdG9yIDogREVGQVVMVFMuc2VsZWN0b3I7XG5cbiAgICAgICAgdGhpcy5jYWxsYmFja3MgPSB7XG4gICAgICAgICAgICBvblNjcm9sbDogdHlwZW9mIG9wdGlvbnMub25TY3JvbGwgPT09ICdmdW5jdGlvbicgPyBvcHRpb25zLm9uU2Nyb2xsIDogREVGQVVMVFMub25TY3JvbGxcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLnNjcm9sbCA9IHtcbiAgICAgICAgICAgIHg6IDAsXG4gICAgICAgICAgICB5OiAwLFxuICAgICAgICAgICAgZGlyZWN0aW9uOiAnJ1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy53aW5kb3dIZWlnaHQgPSAkd2luZG93LmhlaWdodCgpO1xuICAgICAgICB0aGlzLndpbmRvd01pZGRsZSA9IHRoaXMud2luZG93SGVpZ2h0IC8gMjtcblxuICAgICAgICB0aGlzLmFuaW1hdGVkRWxlbWVudHMgPSBbXTtcblxuICAgICAgICB0aGlzLnJlcXVlc3RJZCA9IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbml0aWFsaXplIHNjcm9sbGluZyBhbmltYXRpb25zXG4gICAgICovXG4gICAgaW5pdCgpIHtcbiAgICAgICAgdGhpcy5hZGRFbGVtZW50cygpO1xuXG4gICAgICAgIHRoaXMucmVuZGVyQW5pbWF0aW9ucygpO1xuXG4gICAgICAgIC8vIE9uIHNjcm9sbFxuICAgICAgICB0aGlzLiRjb250YWluZXIub24oRVZFTlQuU0NST0xMLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnJlbmRlckFuaW1hdGlvbnMoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gUmVidWlsZCBldmVudFxuICAgICAgICB0aGlzLiRjb250YWluZXIub24oRVZFTlQuUkVCVUlMRCwgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zY3JvbGxUbyh7XG4gICAgICAgICAgICAgICAgdGFyZ2V0T2Zmc2V0OiAwXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlRWxlbWVudHMoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gVXBkYXRlIGV2ZW50XG4gICAgICAgIHRoaXMuJGNvbnRhaW5lci5vbihFVkVOVC5VUERBVEUsIChldmVudCwgb3B0aW9ucykgPT4gdGhpcy51cGRhdGVFbGVtZW50cyhvcHRpb25zKSk7XG5cbiAgICAgICAgLy8gUmVuZGVyIGV2ZW50XG4gICAgICAgIHRoaXMuJGNvbnRhaW5lci5vbihFVkVOVC5SRU5ERVIsICgpID0+IHRoaXMucmVuZGVyQW5pbWF0aW9ucygpKTtcblxuICAgICAgICAvLyBTY3JvbGx0byBidXR0b24gZXZlbnRcbiAgICAgICAgdGhpcy4kY29udGFpbmVyLm9uKEVWRU5ULkNMSUNLLCAnLmpzLXNjcm9sbHRvJywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICBsZXQgJHRhcmdldCA9ICQoZXZlbnQuY3VycmVudFRhcmdldCk7XG4gICAgICAgICAgICBsZXQgb2Zmc2V0ID0gJHRhcmdldC5kYXRhKCdvZmZzZXQnKTtcblxuICAgICAgICAgICAgdGhpcy5zY3JvbGxUbyh7XG4gICAgICAgICAgICAgICAgc291cmNlRWxlbTogJHRhcmdldCxcbiAgICAgICAgICAgICAgICBvZmZzZXRFbGVtOiBvZmZzZXRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy4kY29udGFpbmVyLm9uKEVWRU5ULlNDUk9MTFRPLCAoZXZlbnQpID0+IHRoaXMuc2Nyb2xsVG8oZXZlbnQub3B0aW9ucykpO1xuXG4gICAgICAgIC8vIFNldHVwIGRvbmVcbiAgICAgICAgJGRvY3VtZW50LnRyaWdnZXJIYW5kbGVyKHtcbiAgICAgICAgICAgIHR5cGU6IEVWRU5ULklTUkVBRFlcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gUmVzaXplIGV2ZW50XG4gICAgICAgICR3aW5kb3cub24oRVZFTlQuUkVTSVpFLCBkZWJvdW5jZSgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUVsZW1lbnRzKClcbiAgICAgICAgfSwgMjApKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGaW5kIGFsbCBhbmltYXRhYmxlIGVsZW1lbnRzLlxuICAgICAqIENhbGxlZCBvbiBwYWdlIGxvYWQgYW5kIGFueSBzdWJzZXF1ZW50IHVwZGF0ZXMuXG4gICAgICovXG4gICAgYWRkRWxlbWVudHMoKSB7XG4gICAgICAgIHRoaXMuYW5pbWF0ZWRFbGVtZW50cyA9IFtdO1xuXG4gICAgICAgIGNvbnN0ICRlbGVtZW50cyA9ICQodGhpcy5zZWxlY3Rvcik7XG4gICAgICAgIGNvbnN0IGxlbiA9ICRlbGVtZW50cy5sZW5ndGg7XG4gICAgICAgIGxldCBpID0gMDtcblxuICAgICAgICBmb3IgKDsgaSA8IGxlbjsgaSArKykge1xuICAgICAgICAgICAgbGV0ICRlbGVtZW50ID0gJGVsZW1lbnRzLmVxKGkpO1xuICAgICAgICAgICAgbGV0IGVsZW1lbnRUYXJnZXQgPSAkZWxlbWVudC5hdHRyKCdkYXRhLXRhcmdldCcpO1xuICAgICAgICAgICAgbGV0IGVsZW1lbnRQb3NpdGlvbiA9ICRlbGVtZW50LmF0dHIoJ2RhdGEtcG9zaXRpb24nKTtcbiAgICAgICAgICAgIGxldCAkdGFyZ2V0ID0gKGVsZW1lbnRUYXJnZXQgJiYgJChlbGVtZW50VGFyZ2V0KS5sZW5ndGgpID8gJChlbGVtZW50VGFyZ2V0KSA6ICRlbGVtZW50O1xuICAgICAgICAgICAgbGV0IGVsZW1lbnRPZmZzZXQgPSAkdGFyZ2V0Lm9mZnNldCgpLnRvcDtcbiAgICAgICAgICAgIGxldCBlbGVtZW50TGltaXQgPSBlbGVtZW50T2Zmc2V0ICsgJHRhcmdldC5vdXRlckhlaWdodCgpO1xuICAgICAgICAgICAgbGV0IGVsZW1lbnRTdGlja3kgPSAodHlwZW9mICRlbGVtZW50LmF0dHIoJ2RhdGEtc3RpY2t5JykgPT09ICdzdHJpbmcnKTtcbiAgICAgICAgICAgIGxldCBlbGVtZW50U3RpY2t5VGFyZ2V0ID0gJGVsZW1lbnQuYXR0cignZGF0YS1zdGlja3ktdGFyZ2V0Jyk7XG5cbiAgICAgICAgICAgIGxldCBlbGVtZW50Vmlld3BvcnRPZmZzZXQgPSBudWxsO1xuICAgICAgICAgICAgaWYodHlwZW9mICRlbGVtZW50LmF0dHIoJ2RhdGEtdmlld3BvcnQtb2Zmc2V0JykgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICBlbGVtZW50Vmlld3BvcnRPZmZzZXQgPSAkZWxlbWVudC5hdHRyKCdkYXRhLXZpZXdwb3J0LW9mZnNldCcpLnNwbGl0KCcsJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvL01hbmFnZSBjYWxsYmFja1xuICAgICAgICAgICAgbGV0IGVsZW1lbnRDYWxsYmFja1N0cmluZyA9ICh0eXBlb2YgJGVsZW1lbnQuYXR0cignZGF0YS1jYWxsYmFjaycpID09PSAnc3RyaW5nJykgPyAkZWxlbWVudC5hdHRyKCdkYXRhLWNhbGxiYWNrJykgOiBudWxsO1xuICAgICAgICAgICAgbGV0IGVsZW1lbnRDYWxsYmFjayA9IG51bGw7XG5cbiAgICAgICAgICAgIGlmKGVsZW1lbnRDYWxsYmFja1N0cmluZyAhPSBudWxsKXtcbiAgICAgICAgICAgICAgICBsZXQgZXZlbnQgPSBlbGVtZW50Q2FsbGJhY2tTdHJpbmcuc3Vic3RyKDAsIGVsZW1lbnRDYWxsYmFja1N0cmluZy5pbmRleE9mKCcoJykpO1xuICAgICAgICAgICAgICAgIGxldCBvcHRpb25zU3RyaW5nID0gZWxlbWVudENhbGxiYWNrU3RyaW5nLnN1YnN0cihlbGVtZW50Q2FsbGJhY2tTdHJpbmcuaW5kZXhPZignKCcpLGVsZW1lbnRDYWxsYmFja1N0cmluZy5sZW5ndGggLSBldmVudC5sZW5ndGgpO1xuXG4gICAgICAgICAgICAgICAgb3B0aW9uc1N0cmluZyA9IG9wdGlvbnNTdHJpbmcucmVwbGFjZSgnKCcsJycpO1xuICAgICAgICAgICAgICAgIG9wdGlvbnNTdHJpbmcgPSBvcHRpb25zU3RyaW5nLnJlcGxhY2UoJyknLCcnKTtcblxuICAgICAgICAgICAgICAgIGxldCBvcHRpb25zID0gb3B0aW9uc1N0cmluZy5zcGxpdCgnfCcpO1xuXG4gICAgICAgICAgICAgICAgbGV0IG9iaiA9IHt9O1xuXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBvcHRpb25zLmxlbmd0aDsgaisrKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IG9wdGlvbiA9IG9wdGlvbnNbal0uc3BsaXQoJzonKTtcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9uWzBdID0gb3B0aW9uWzBdLnJlcGxhY2UoJyAnLCcnKTtcblxuICAgICAgICAgICAgICAgICAgICBsZXQgdmFsO1xuICAgICAgICAgICAgICAgICAgICAvL2NoZWNrIGlmIHZhbHVlIGlzIGEgYm9vbGVhblxuICAgICAgICAgICAgICAgICAgICBpZihvcHRpb25bMV0gPT09IFwidHJ1ZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWwgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYob3B0aW9uWzFdID09PSBcImZhbHNlXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8vY2hlY2sgaWYgdmFsdWUgaXMgbnVtZXJpY1xuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmKC9eXFxkKyQvLnRlc3Qob3B0aW9uWzFdKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsID0gcGFyc2VJbnQob3B0aW9uWzFdKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvL2NoZWNrIGlmIHZhbHVlIGlzIGEgU3RyaW5nXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsID0gb3B0aW9uWzFdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIG9ialtvcHRpb25bMF1dID0gdmFsO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGVsZW1lbnRDYWxsYmFjayA9IHtldmVudDpldmVudCwgb3B0aW9uczpvYmp9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBJZiBlbGVtZW50cyBsb3NlcyBpdHMgYW5pbWF0aW9uIGFmdGVyIHNjcm9sbGluZyBwYXN0IGl0XG4gICAgICAgICAgICBsZXQgZWxlbWVudFJlcGVhdCA9ICh0eXBlb2YgJGVsZW1lbnQuYXR0cignZGF0YS1yZXBlYXQnKSA9PT0gJ3N0cmluZycpO1xuXG4gICAgICAgICAgICBsZXQgZWxlbWVudEluVmlld0NsYXNzID0gJGVsZW1lbnQuYXR0cignZGF0YS1pbnZpZXctY2xhc3MnKTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZWxlbWVudEluVmlld0NsYXNzID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIGVsZW1lbnRJblZpZXdDbGFzcyA9ICdpcy1zaG93JztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGVsZW1lbnRTdGlja3kpIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGVsZW1lbnRTdGlja3lUYXJnZXQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnRMaW1pdCA9IHRoaXMuJGNvbnRhaW5lci5oZWlnaHQoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50TGltaXQgPSAkKGVsZW1lbnRTdGlja3lUYXJnZXQpLm9mZnNldCgpLnRvcCAtICRlbGVtZW50LmhlaWdodCgpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIFJlc2V0IG9mZnNldFxuICAgICAgICAgICAgICAgICRlbGVtZW50LnJlbW92ZUNsYXNzKGVsZW1lbnRJblZpZXdDbGFzcyk7XG4gICAgICAgICAgICAgICAgJGVsZW1lbnQucmVtb3ZlQ2xhc3MoJ2lzLXVuc3R1Y2snKTtcblxuICAgICAgICAgICAgICAgICRlbGVtZW50LmNzcyh7XG4gICAgICAgICAgICAgICAgICAgICctd2Via2l0LXRyYW5zZm9ybSc6ICd0cmFuc2xhdGUzZCgwLCAwLCAwKScsXG4gICAgICAgICAgICAgICAgICAgICctbXMtdHJhbnNmb3JtJzogJ3RyYW5zbGF0ZTNkKDAsIDAsIDApJyxcbiAgICAgICAgICAgICAgICAgICAgJ3RyYW5zZm9ybSc6ICd0cmFuc2xhdGUzZCgwLCAwLCAwKSdcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gRG9uJ3QgYWRkIGVsZW1lbnQgaWYgaXQgYWxyZWFkeSBoYXMgaXRzIGludmlldyBjbGFzcyBhbmQgZG9lc24ndCByZXBlYXRcbiAgICAgICAgICAgIGlmIChlbGVtZW50UmVwZWF0IHx8ICEkZWxlbWVudC5oYXNDbGFzcyhlbGVtZW50SW5WaWV3Q2xhc3MpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hbmltYXRlZEVsZW1lbnRzW2ldID0ge1xuICAgICAgICAgICAgICAgICAgICAkZWxlbWVudDogJGVsZW1lbnQsXG4gICAgICAgICAgICAgICAgICAgIG9mZnNldDogTWF0aC5yb3VuZChlbGVtZW50T2Zmc2V0KSxcbiAgICAgICAgICAgICAgICAgICAgcmVwZWF0OiBlbGVtZW50UmVwZWF0LFxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogZWxlbWVudFBvc2l0aW9uLFxuICAgICAgICAgICAgICAgICAgICBsaW1pdDogZWxlbWVudExpbWl0LFxuICAgICAgICAgICAgICAgICAgICBpblZpZXdDbGFzczogZWxlbWVudEluVmlld0NsYXNzLFxuICAgICAgICAgICAgICAgICAgICBzdGlja3k6IGVsZW1lbnRTdGlja3ksXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiBlbGVtZW50Q2FsbGJhY2ssXG4gICAgICAgICAgICAgICAgICAgIHZpZXdwb3J0T2Zmc2V0OiBlbGVtZW50Vmlld3BvcnRPZmZzZXRcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTG9vcCB0aHJvdWdoIGFsbCBhbmltYXRhYmxlIGVsZW1lbnRzIGFuZCBhcHBseSBhbmltYXRpb24gbWV0aG9kKHMpLlxuICAgICAqL1xuICAgIGFuaW1hdGVFbGVtZW50cygpIHtcbiAgICAgICAgY29uc3QgbGVuID0gdGhpcy5hbmltYXRlZEVsZW1lbnRzLmxlbmd0aDtcbiAgICAgICAgY29uc3QgcmVtb3ZlSW5kZXhlcyA9IFtdO1xuICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgIGZvciAoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBlbGVtZW50ID0gdGhpcy5hbmltYXRlZEVsZW1lbnRzW2ldO1xuXG4gICAgICAgICAgICAvLyBJZiB0aGUgZWxlbWVudCdzIHZpc2liaWxpdHkgbXVzdCBub3QgYmUgbWFuaXB1bGF0ZWQgYW55IGZ1cnRoZXIsIHJlbW92ZSBpdCBmcm9tIHRoZSBsaXN0XG4gICAgICAgICAgICBpZiAodGhpcy50b2dnbGVFbGVtZW50KGVsZW1lbnQsIGkpKSB7XG4gICAgICAgICAgICAgICAgcmVtb3ZlSW5kZXhlcy5wdXNoKGkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmVtb3ZlIGFuaW1hdGVkIGVsZW1lbnRzIGFmdGVyIGxvb3BpbmcgdGhyb3VnaCBlbGVtZW50c1xuICAgICAgICBpID0gcmVtb3ZlSW5kZXhlcy5sZW5ndGg7XG4gICAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgICAgIHRoaXMuYW5pbWF0ZWRFbGVtZW50cy5zcGxpY2UocmVtb3ZlSW5kZXhlc1tpXSwgMSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZW5kZXIgdGhlIGNsYXNzIGFuaW1hdGlvbnMsIGFuZCB1cGRhdGUgdGhlIGdsb2JhbCBzY3JvbGwgcG9zaXRpb25uaW5nLlxuICAgICAqL1xuICAgIHJlbmRlckFuaW1hdGlvbnMoKSB7XG4gICAgICAgIC8vIGlmICh3aW5kb3cucGFnZVlPZmZzZXQgPiB0aGlzLnNjcm9sbC55KSB7XG4gICAgICAgIC8vICAgICBpZiAodGhpcy5zY3JvbGwuZGlyZWN0aW9uICE9PSAnZG93bicpIHtcbiAgICAgICAgLy8gICAgICAgICB0aGlzLnNjcm9sbC5kaXJlY3Rpb24gPSAnZG93bic7XG4gICAgICAgIC8vICAgICB9XG4gICAgICAgIC8vIH0gZWxzZSBpZiAod2luZG93LnBhZ2VZT2Zmc2V0IDwgdGhpcy5zY3JvbGwueSkge1xuICAgICAgICAvLyAgICAgaWYgKHRoaXMuc2Nyb2xsLmRpcmVjdGlvbiAhPT0gJ3VwJykge1xuICAgICAgICAvLyAgICAgICAgIHRoaXMuc2Nyb2xsLmRpcmVjdGlvbiA9ICd1cCc7XG4gICAgICAgIC8vICAgICB9XG4gICAgICAgIC8vIH1cblxuICAgICAgICBpZiAodGhpcy5zY3JvbGwueSAhPT0gd2luZG93LnBhZ2VZT2Zmc2V0KSB7XG4gICAgICAgICAgICB0aGlzLnNjcm9sbC55ID0gd2luZG93LnBhZ2VZT2Zmc2V0O1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnNjcm9sbC54ICE9PSB3aW5kb3cucGFnZVhPZmZzZXQpIHtcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsLnggPSB3aW5kb3cucGFnZVhPZmZzZXQ7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNhbGxiYWNrcy5vblNjcm9sbCh0aGlzLnNjcm9sbClcblxuICAgICAgICB0aGlzLmFuaW1hdGVFbGVtZW50cygpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRvZ2dsZSBjbGFzc2VzIG9uIGFuIGVsZW1lbnQgaWYgaXQncyB2aXNpYmxlLlxuICAgICAqXG4gICAgICogQHBhcmFtICB7b2JqZWN0fSAgICAgIGVsZW1lbnQgQ3VycmVudCBlbGVtZW50IHRvIHRlc3RcbiAgICAgKiBAcGFyYW0gIHtpbnR9ICAgICAgICAgaW5kZXggICBJbmRleCBvZiB0aGUgZWxlbWVudCB3aXRoaW4gaXQncyBjb250YWluZXJcbiAgICAgKiBAcmV0dXJuIHtib29sZWFufSAgICAgICAgICAgICBXZXRoZXIgdGhlIGl0ZW0gbXVzdCBiZSByZW1vdmVkIGZyb20gaXRzIGNvbnRhaW5lclxuICAgICAqL1xuICAgIHRvZ2dsZUVsZW1lbnQoZWxlbWVudCwgaW5kZXgpIHtcbiAgICAgICAgbGV0IHJlbW92ZUZyb21Db250YWluZXIgPSBmYWxzZTtcblxuICAgICAgICBpZiAodHlwZW9mIGVsZW1lbnQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAvLyBGaW5kIHRoZSBib3R0b20gZWRnZSBvZiB0aGUgc2Nyb2xsIGNvbnRhaW5lclxuICAgICAgICAgICAgY29uc3Qgc2Nyb2xsVG9wID0gdGhpcy5zY3JvbGwueTtcbiAgICAgICAgICAgIGNvbnN0IHNjcm9sbEJvdHRvbSA9IHNjcm9sbFRvcCArIHRoaXMud2luZG93SGVpZ2h0O1xuXG4gICAgICAgICAgICAvLyBEZWZpbmUgaWYgdGhlIGVsZW1lbnQgaXMgaW5WaWV3XG4gICAgICAgICAgICBsZXQgaW5WaWV3ID0gZmFsc2U7XG5cbiAgICAgICAgICAgIGlmIChlbGVtZW50LnBvc2l0aW9uID09PSAndG9wJykge1xuICAgICAgICAgICAgICAgIGluVmlldyA9IChzY3JvbGxUb3AgPj0gZWxlbWVudC5vZmZzZXQgJiYgc2Nyb2xsVG9wIDw9IGVsZW1lbnQubGltaXQpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50LnBvc2l0aW9uID09PSAnYmVsb3cnKSB7XG4gICAgICAgICAgICAgICAgaW5WaWV3ID0gKHNjcm9sbFRvcCA+IGVsZW1lbnQubGltaXQpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50LnN0aWNreSkge1xuICAgICAgICAgICAgICAgIGluVmlldyA9IChzY3JvbGxUb3AgPj0gZWxlbWVudC5vZmZzZXQgJiYgc2Nyb2xsVG9wIDw9IGVsZW1lbnQubGltaXQpO1xuICAgICAgICAgICAgfWVsc2UgaWYoZWxlbWVudC52aWV3cG9ydE9mZnNldCAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBpZihlbGVtZW50LnZpZXdwb3J0T2Zmc2V0Lmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHNjcm9sbFZpZXdwb3J0T2Zmc2V0VG9wID0gc2Nyb2xsVG9wICsgKHRoaXMud2luZG93SGVpZ2h0ICogZWxlbWVudC52aWV3cG9ydE9mZnNldFsxXSk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBzY3JvbGxWaWV3cG9ydE9mZnNldEJvdHRvbSA9IHNjcm9sbEJvdHRvbSAtICh0aGlzLndpbmRvd0hlaWdodCAqIGVsZW1lbnQudmlld3BvcnRPZmZzZXRbMF0pO1xuICAgICAgICAgICAgICAgICAgICBpblZpZXcgPSAoc2Nyb2xsVmlld3BvcnRPZmZzZXRCb3R0b20gPiBlbGVtZW50Lm9mZnNldCAmJiBzY3JvbGxWaWV3cG9ydE9mZnNldFRvcCA8IGVsZW1lbnQubGltaXQpO1xuXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHNjcm9sbFZpZXdwb3J0T2Zmc2V0ID0gc2Nyb2xsQm90dG9tIC0gKHRoaXMud2luZG93SGVpZ2h0ICogZWxlbWVudC52aWV3cG9ydE9mZnNldFswXSk7XG4gICAgICAgICAgICAgICAgICAgIGluVmlldyA9IChzY3JvbGxWaWV3cG9ydE9mZnNldCA+IGVsZW1lbnQub2Zmc2V0ICYmIHNjcm9sbFZpZXdwb3J0T2Zmc2V0IDwgZWxlbWVudC5saW1pdCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGluVmlldyA9IChzY3JvbGxCb3R0b20gPj0gZWxlbWVudC5vZmZzZXQgJiYgc2Nyb2xsVG9wIDw9IGVsZW1lbnQubGltaXQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZWxlbWVudC5zdGlja3kpIHtcbiAgICAgICAgICAgICAgICBpZiAoc2Nyb2xsVG9wID4gZWxlbWVudC5saW1pdCkge1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LiRlbGVtZW50LmFkZENsYXNzKCdpcy11bnN0dWNrJyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC4kZWxlbWVudC5yZW1vdmVDbGFzcygnaXMtdW5zdHVjaycpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChzY3JvbGxUb3AgPCBlbGVtZW50Lm9mZnNldCkge1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LiRlbGVtZW50LnJlbW92ZUNsYXNzKGVsZW1lbnQuaW5WaWV3Q2xhc3MpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gQWRkIGNsYXNzIGlmIGluVmlldywgcmVtb3ZlIGlmIG5vdFxuICAgICAgICAgICAgaWYgKGluVmlldykge1xuICAgICAgICAgICAgICAgIGlmKCFlbGVtZW50LiRlbGVtZW50Lmhhc0NsYXNzKGVsZW1lbnQuaW5WaWV3Q2xhc3MpKXtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC4kZWxlbWVudC5hZGRDbGFzcyhlbGVtZW50LmluVmlld0NsYXNzKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50cmlnZ2VyQ2FsbGJhY2soZWxlbWVudCwnZW50ZXInKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoIWVsZW1lbnQucmVwZWF0ICYmICFlbGVtZW50LnN0aWNreSkge1xuICAgICAgICAgICAgICAgICAgICByZW1vdmVGcm9tQ29udGFpbmVyID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoZWxlbWVudC5zdGlja3kpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHkgPSB0aGlzLnNjcm9sbC55IC0gZWxlbWVudC5vZmZzZXQ7XG5cbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC4kZWxlbWVudC5jc3Moe1xuICAgICAgICAgICAgICAgICAgICAgICAgJy13ZWJraXQtdHJhbnNmb3JtJzogYHRyYW5zbGF0ZTNkKDAsICR7eX1weCwgMClgLFxuICAgICAgICAgICAgICAgICAgICAgICAgJy1tcy10cmFuc2Zvcm0nOiBgdHJhbnNsYXRlM2QoMCwgJHt5fXB4LCAwKWAsXG4gICAgICAgICAgICAgICAgICAgICAgICAndHJhbnNmb3JtJzogYHRyYW5zbGF0ZTNkKDAsICR7eX1weCwgMClgXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQucmVwZWF0KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmKGVsZW1lbnQuJGVsZW1lbnQuaGFzQ2xhc3MoZWxlbWVudC5pblZpZXdDbGFzcykpe1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC4kZWxlbWVudC5yZW1vdmVDbGFzcyhlbGVtZW50LmluVmlld0NsYXNzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudHJpZ2dlckNhbGxiYWNrKGVsZW1lbnQsJ2xlYXZlJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVtb3ZlRnJvbUNvbnRhaW5lcjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBjaGVjayBpZiB0aGUgZWxlbWVudCBoYXZlIGEgY2FsbGJhY2ssIGFuZCB0cmlnZ2VyIHRoZSBldmVudCBzZXQgaW4gdGhlIGRhdGEtY2FsbGJhY2tcbiAgICAgKlxuICAgICAqIEBwYXJhbSAge29iamVjdH0gICAgICBlbGVtZW50IEN1cnJlbnQgZWxlbWVudCB0byB0ZXN0XG4gICAgICogQHJldHVybiB2b2lkXG4gICAgICovXG4gICAgdHJpZ2dlckNhbGxiYWNrKGVsZW1lbnQsd2F5KXtcblxuICAgICAgICBpZihlbGVtZW50LmNhbGxiYWNrICE9IHVuZGVmaW5lZCl7XG4gICAgICAgICAgICBlbGVtZW50LiRlbGVtZW50LnRyaWdnZXIoe1xuICAgICAgICAgICAgICAgIHR5cGU6IGVsZW1lbnQuY2FsbGJhY2suZXZlbnQsXG4gICAgICAgICAgICAgICAgb3B0aW9uczogZWxlbWVudC5jYWxsYmFjay5vcHRpb25zLFxuICAgICAgICAgICAgICAgIHdheTogd2F5XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8vYWRkIHRoaXMgd2hlcmUgeW91IHdhbnQgZHVkZSAoaW4geW91ciBtb2R1bGUgYnR3KVxuICAgICAgICAgICAgLy8gJGRvY3VtZW50Lm9uKGV2ZW50TmFtZS5OYW1lc3BhY2UsKGUpPT57XG4gICAgICAgICAgICAvLyAgICAgY29uc29sZS5sb2coZS5vcHRpb25zLCBlLndheSk7XG4gICAgICAgICAgICAvLyB9KTtcbiAgICAgICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2Nyb2xsIHRvIGEgZGVzaXJlZCB0YXJnZXQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gIHtvYmplY3R9IG9wdGlvbnNcbiAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAqL1xuICAgIHNjcm9sbFRvKG9wdGlvbnMpIHtcbiAgICAgICAgY29uc3QgJHRhcmdldEVsZW0gPSBvcHRpb25zLnRhcmdldEVsZW07XG4gICAgICAgIGNvbnN0ICRzb3VyY2VFbGVtID0gb3B0aW9ucy5zb3VyY2VFbGVtO1xuICAgICAgICBjb25zdCBvZmZzZXRFbGVtID0gb3B0aW9ucy5vZmZzZXRFbGVtO1xuICAgICAgICBsZXQgdGFyZ2V0T2Zmc2V0ID0gaXNOdW1lcmljKG9wdGlvbnMudGFyZ2V0T2Zmc2V0KSA/IHBhcnNlSW50KG9wdGlvbnMudGFyZ2V0T2Zmc2V0KSA6IDA7XG4gICAgICAgIGNvbnN0IHNwZWVkID0gaXNOdW1lcmljKG9wdGlvbnMuc3BlZWQpID8gcGFyc2VJbnQob3B0aW9ucy5zcGVlZCkgOiA4MDA7XG4gICAgICAgIGNvbnN0IGRlbGF5ID0gaXNOdW1lcmljKG9wdGlvbnMuZGVsYXkpID8gcGFyc2VJbnQob3B0aW9ucy5kZWxheSkgOiAwO1xuICAgICAgICBjb25zdCB0b1RvcCA9IG9wdGlvbnMudG9Ub3A7XG4gICAgICAgIGNvbnN0IHRvQm90dG9tID0gb3B0aW9ucy50b0JvdHRvbTtcbiAgICAgICAgbGV0IG9mZnNldCA9IDA7XG5cbiAgICAgICAgaWYgKHR5cGVvZiAkdGFyZ2V0RWxlbSA9PT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mICRzb3VyY2VFbGVtID09PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgdGFyZ2V0T2Zmc2V0ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdZb3UgbXVzdCBzcGVjaWZ5IGF0IGxlYXN0IG9uZSBwYXJhbWV0ZXIuJylcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2YgJHRhcmdldEVsZW0gIT09ICd1bmRlZmluZWQnICYmICR0YXJnZXRFbGVtIGluc3RhbmNlb2YgalF1ZXJ5ICYmICR0YXJnZXRFbGVtLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHRhcmdldE9mZnNldCA9ICR0YXJnZXRFbGVtLm9mZnNldCgpLnRvcCArIHRhcmdldE9mZnNldDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2YgJHNvdXJjZUVsZW0gIT09ICd1bmRlZmluZWQnICYmICRzb3VyY2VFbGVtIGluc3RhbmNlb2YgalF1ZXJ5ICYmICRzb3VyY2VFbGVtLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGxldCB0YXJnZXREYXRhID0gJyc7XG5cbiAgICAgICAgICAgIGlmICgkc291cmNlRWxlbS5hdHRyKCdkYXRhLXRhcmdldCcpKSB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0RGF0YSA9ICRzb3VyY2VFbGVtLmF0dHIoJ2RhdGEtdGFyZ2V0Jyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRhcmdldERhdGEgPSAkc291cmNlRWxlbS5hdHRyKCdocmVmJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRhcmdldE9mZnNldCA9ICQodGFyZ2V0RGF0YSkub2Zmc2V0KCkudG9wICsgdGFyZ2V0T2Zmc2V0O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiBvZmZzZXRFbGVtICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgb2Zmc2V0ID0gJChvZmZzZXRFbGVtKS5vdXRlckhlaWdodCgpO1xuICAgICAgICAgICAgdGFyZ2V0T2Zmc2V0ID0gdGFyZ2V0T2Zmc2V0IC0gb2Zmc2V0O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRvVG9wID09PSB0cnVlKSB7XG4gICAgICAgICAgICB0YXJnZXRPZmZzZXQgPSAwO1xuICAgICAgICB9IGVsc2UgaWYgKHRvQm90dG9tID09PSB0cnVlKSB7XG4gICAgICAgICAgICB0YXJnZXRPZmZzZXQgPSAkZG9jdW1lbnQuaGVpZ2h0KCk7XG4gICAgICAgIH1cblxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHtcbiAgICAgICAgICAgICAgICBzY3JvbGxUb3A6IHRhcmdldE9mZnNldFxuICAgICAgICAgICAgfSwgc3BlZWQpO1xuICAgICAgICB9LCBkZWxheSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVXBkYXRlIGVsZW1lbnRzIGFuZCByZWNhbGN1bGF0ZSBhbGwgdGhlIHBvc2l0aW9ucyBvbiB0aGUgcGFnZVxuICAgICAqL1xuICAgIHVwZGF0ZUVsZW1lbnRzKCkge1xuICAgICAgICB0aGlzLmFkZEVsZW1lbnRzKCk7XG4gICAgICAgIHRoaXMuYW5pbWF0ZUVsZW1lbnRzKCk7XG5cbiAgICAgICAgdGhpcy53aW5kb3dIZWlnaHQgPSAkd2luZG93LmhlaWdodCgpO1xuICAgICAgICB0aGlzLndpbmRvd01pZGRsZSA9IHRoaXMud2luZG93SGVpZ2h0IC8gMjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEZXN0cm95XG4gICAgICovXG4gICAgZGVzdHJveSgpIHtcbiAgICAgICAgJHdpbmRvdy5vZmYoYC4ke0VWRU5UX0tFWX1gKTtcbiAgICAgICAgdGhpcy4kY29udGFpbmVyLm9mZihgLiR7RVZFTlRfS0VZfWApO1xuICAgICAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy5yZXF1ZXN0SWQpO1xuICAgICAgICB0aGlzLnJlcXVlc3RJZCA9IHVuZGVmaW5lZDtcbiAgICAgICAgdGhpcy5hbmltYXRlZEVsZW1lbnRzID0gdW5kZWZpbmVkO1xuICAgIH1cbn1cbiIsIi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBMb2NvbW90aXZlIFNjcm9sbCBNYW5hZ2VyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLyoganNoaW50IGVzbmV4dDogdHJ1ZSAqL1xuaW1wb3J0IHsgJGRvY3VtZW50LCAkd2luZG93LCAkaHRtbCwgJGJvZHkgfSBmcm9tICcuLi8uLi91dGlscy9lbnZpcm9ubWVudCc7XG5pbXBvcnQgU2Nyb2xsLCB7IERFRkFVTFRTLCBFVkVOVCB9IGZyb20gJy4uL1Njcm9sbCc7XG5pbXBvcnQgU21vb3RoU2Nyb2xsIGZyb20gJy4uL1Ntb290aFNjcm9sbCc7XG5cbi8qKlxuICogQmFzaWMgbW9kdWxlIHRoYXQgZGV0ZWN0cyB3aGljaCBzY3JvbGxpbmcgbW9kdWxlIHdlJ2xsIGJlIHVzaW5nXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIHtcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgICAgIHRoaXMuc21vb3RoID0gb3B0aW9ucy5zbW9vdGggfHwgREVGQVVMVFMuc21vb3RoO1xuICAgICAgICB0aGlzLnNtb290aE1vYmlsZSA9IG9wdGlvbnMuc21vb3RoTW9iaWxlIHx8IERFRkFVTFRTLnNtb290aE1vYmlsZTtcbiAgICAgICAgdGhpcy5tb2JpbGVDb250YWluZXIgPSBvcHRpb25zLm1vYmlsZUNvbnRhaW5lciB8fCBERUZBVUxUUy5tb2JpbGVDb250YWluZXI7XG4gICAgICAgIHRoaXMuaXNNb2JpbGUgPSBmYWxzZTtcblxuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICB9XG5cbiAgICBpbml0KCkge1xuICAgICAgICAkaHRtbFswXS5zY3JvbGxUb3AgPSAwO1xuICAgICAgICAkYm9keVswXS5zY3JvbGxUb3AgPSAwO1xuXG4gICAgICAgIGlmICghdGhpcy5zbW9vdGhNb2JpbGUpIHtcbiAgICAgICAgICAgIHRoaXMuaXNNb2JpbGUgPSAoL0FuZHJvaWR8aVBob25lfGlQYWR8aVBvZHxCbGFja0JlcnJ5fElFTW9iaWxlfE9wZXJhIE1pbmkvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuaW5zdGFuY2UgPSAoKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuc21vb3RoID09PSB0cnVlICYmICF0aGlzLmlzTW9iaWxlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBTbW9vdGhTY3JvbGwodGhpcy5vcHRpb25zKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubW9iaWxlQ29udGFpbmVyKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy5jb250YWluZXIgPSB0aGlzLm1vYmlsZUNvbnRhaW5lclxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFNjcm9sbCh0aGlzLm9wdGlvbnMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KSgpO1xuXG4gICAgICAgIHRoaXMuaW5zdGFuY2UuaW5pdCgpO1xuXG4gICAgICAgIGNvbnN0ICRzY3JvbGxUb09uTG9hZEVsID0gJCgnLmpzLXNjcm9sbHRvLW9uLWxvYWQnKS5maXJzdCgpO1xuXG4gICAgICAgIGlmICgkc2Nyb2xsVG9PbkxvYWRFbC5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgICRkb2N1bWVudC50cmlnZ2VySGFuZGxlcih7XG4gICAgICAgICAgICAgICAgdHlwZTogJ0V2ZW50LlNDUk9MTFRPJyxcbiAgICAgICAgICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICAgICAgICAgIHRhcmdldEVsZW06ICRzY3JvbGxUb09uTG9hZEVsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBkZXN0cm95KCkge1xuICAgICAgICB0aGlzLmluc3RhbmNlLmRlc3Ryb3koKTtcbiAgICB9XG59XG4iLCIvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gTG9jb21vdGl2ZSBTbW9vdGggU2Nyb2xsXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLyoganNoaW50IGVzbmV4dDogdHJ1ZSAqL1xuaW1wb3J0IHsgJHdpbmRvdywgJGRvY3VtZW50LCAkaHRtbCB9IGZyb20gJy4uLy4uL3V0aWxzL2Vudmlyb25tZW50JztcbmltcG9ydCBTY3JvbGwsIHsgREVGQVVMVFMsIEVWRU5UIH0gZnJvbSAnLi4vU2Nyb2xsJztcblxuaW1wb3J0IGRlYm91bmNlIGZyb20gJy4uLy4uL3V0aWxzL2RlYm91bmNlJztcbmltcG9ydCBTY3JvbGxiYXIgZnJvbSAnc21vb3RoLXNjcm9sbGJhcic7XG5pbXBvcnQgeyBpc051bWVyaWMgfSBmcm9tICcuLi8uLi91dGlscy9pcyc7XG5cbi8qKlxuICogU21vb3RoIHNjcm9sbGluZyB1c2luZyBgc21vb3RoLXNjcm9sbGJhcmAuXG4gKiBCYXNlZCBvbiBgU2Nyb2xsYCBjbGFzcywgd2hpY2ggYWxsb3dzIGFuaW1hdGlvbnMgb2YgZWxlbWVudHMgb24gdGhlIHBhZ2VcbiAqIGFjY29yZGluZyB0byBzY3JvbGwgcG9zaXRpb24uXG4gKlxuICogQHRvZG8gIE1ldGhvZCB0byBnZXQgdGhlIGRpc3RhbmNlIChhcyBwZXJjZW50YWdlKSBvZiBhbiBlbGVtZW50IGluIHRoZSB2aWV3cG9ydFxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBleHRlbmRzIFNjcm9sbCB7XG4gICAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgICAgICBzdXBlcihvcHRpb25zKTtcblxuICAgICAgICB0aGlzLmlzUmV2ZXJzZWQgPSBvcHRpb25zLnJldmVyc2VkIHx8IERFRkFVTFRTLnJldmVyc2VkO1xuICAgICAgICB0aGlzLmdldFdheSA9IG9wdGlvbnMuZ2V0V2F5IHx8IERFRkFVTFRTLmdldFdheTtcbiAgICAgICAgdGhpcy5nZXRTcGVlZCA9IG9wdGlvbnMuZ2V0U3BlZWQgfHwgREVGQVVMVFMuZ2V0U3BlZWQ7XG5cbiAgICAgICAgdGhpcy5wYXJhbGxheEVsZW1lbnRzID0gW107XG5cblxuICAgICAgICBpZih0aGlzLmdldFNwZWVkKSB7XG4gICAgICAgICAgICB0aGlzLnNjcm9sbC5zcGVlZCA9IDA7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEluaXRpYWxpemUgc2Nyb2xsaW5nIGFuaW1hdGlvbnNcbiAgICAgKi9cbiAgICBpbml0KCkge1xuICAgICAgICAvLyBBZGQgY2xhc3MgdG8gdGhlIGRvY3VtZW50IHRvIGtub3cgaWYgU21vb3RoU2Nyb2xsIGlzIGluaXRpYWxpemVkICh0byBtYW5hZ2Ugb3ZlcmZsb3cgb24gY29udGFpbmVycylcbiAgICAgICAgJGh0bWwuYWRkQ2xhc3MoJ2hhcy1zbW9vdGgtc2Nyb2xsJyk7XG5cbiAgICAgICAgdGhpcy5zY3JvbGxiYXIgPSBTY3JvbGxiYXIuaW5pdCh0aGlzLiRjb250YWluZXJbMF0se1xuICAgICAgICAgICAgc3luY0NhbGxiYWNrczogdHJ1ZVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnNjcm9sbGJhclN0YXR1cyA9IHVuZGVmaW5lZDtcblxuICAgICAgICB0aGlzLnNldFNjcm9sbGJhckxpbWl0KCk7XG5cbiAgICAgICAgdGhpcy5zZXRXaGVlbERpcmVjdGlvbih0aGlzLmlzUmV2ZXJzZWQpO1xuXG4gICAgICAgIHRoaXMuYWRkRWxlbWVudHMoKTtcblxuICAgICAgICB0aGlzLnJlbmRlckFuaW1hdGlvbnModHJ1ZSk7XG5cbiAgICAgICAgLy8gT24gc2Nyb2xsXG4gICAgICAgIHRoaXMuc2Nyb2xsYmFyLmFkZExpc3RlbmVyKChzdGF0dXMpID0+IHRoaXMucmVuZGVyQW5pbWF0aW9ucyhmYWxzZSwgc3RhdHVzKSk7XG5cbiAgICAgICAgLy8gUmVidWlsZCBldmVudFxuICAgICAgICB0aGlzLiRjb250YWluZXIub24oRVZFTlQuUkVCVUlMRCwgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zY3JvbGxiYXIuc2Nyb2xsVG8oMCwgMCwgMSk7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUVsZW1lbnRzKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFVwZGF0ZSBldmVudFxuICAgICAgICB0aGlzLiRjb250YWluZXIub24oRVZFTlQuVVBEQVRFLCAoZXZlbnQsIG9wdGlvbnMpID0+IHRoaXMudXBkYXRlRWxlbWVudHMob3B0aW9ucykpO1xuXG4gICAgICAgIC8vIFJlbmRlciBldmVudFxuICAgICAgICB0aGlzLiRjb250YWluZXIub24oRVZFTlQuUkVOREVSLCAoKSA9PiB0aGlzLnJlbmRlckFuaW1hdGlvbnMoZmFsc2UpKTtcblxuICAgICAgICAvLyBTY3JvbGx0byBidXR0b24gZXZlbnRcbiAgICAgICAgdGhpcy4kY29udGFpbmVyLm9uKEVWRU5ULkNMSUNLLCAnLmpzLXNjcm9sbHRvJywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICBsZXQgJHRhcmdldCA9ICQoZXZlbnQuY3VycmVudFRhcmdldCk7XG4gICAgICAgICAgICBsZXQgb2Zmc2V0ID0gJHRhcmdldC5kYXRhKCdvZmZzZXQnKTtcblxuICAgICAgICAgICAgdGhpcy5zY3JvbGxUbyh7XG4gICAgICAgICAgICAgICAgc291cmNlRWxlbTogJHRhcmdldCxcbiAgICAgICAgICAgICAgICBvZmZzZXRFbGVtOiBvZmZzZXRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLiRjb250YWluZXIub24oRVZFTlQuU0NST0xMVE8sIChldmVudCkgPT4gdGhpcy5zY3JvbGxUbyhldmVudC5vcHRpb25zKSk7XG5cbiAgICAgICAgLy8gU2V0dXAgZG9uZVxuICAgICAgICAkZG9jdW1lbnQudHJpZ2dlckhhbmRsZXIoe1xuICAgICAgICAgICAgdHlwZTogRVZFTlQuSVNSRUFEWVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBSZXNpemUgZXZlbnRcbiAgICAgICAgJHdpbmRvdy5vbihFVkVOVC5SRVNJWkUsIGRlYm91bmNlKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlRWxlbWVudHMoKVxuICAgICAgICB9LCAyMCkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlc2V0IGV4aXN0aW5nIGVsZW1lbnRzIGFuZCBmaW5kIGFsbCBhbmltYXRhYmxlIGVsZW1lbnRzLlxuICAgICAqIENhbGxlZCBvbiBwYWdlIGxvYWQgYW5kIGFueSBzdWJzZXF1ZW50IHVwZGF0ZXMuXG4gICAgICovXG4gICAgYWRkRWxlbWVudHMoKSB7XG4gICAgICAgIHRoaXMuYW5pbWF0ZWRFbGVtZW50cyA9IFtdO1xuICAgICAgICB0aGlzLnBhcmFsbGF4RWxlbWVudHMgPSBbXTtcblxuICAgICAgICBjb25zdCAkZWxlbWVudHMgPSAkKHRoaXMuc2VsZWN0b3IpO1xuICAgICAgICBjb25zdCBsZW4gPSAkZWxlbWVudHMubGVuZ3RoO1xuICAgICAgICBsZXQgaSA9IDA7XG5cbiAgICAgICAgZm9yICg7IGkgPCBsZW47IGkgKyspIHtcbiAgICAgICAgICAgIGxldCAkZWxlbWVudCA9ICRlbGVtZW50cy5lcShpKTtcbiAgICAgICAgICAgIGxldCBlbGVtZW50U3BlZWQgPSBpc051bWVyaWMoJGVsZW1lbnQuYXR0cignZGF0YS1zcGVlZCcpKSA/ICRlbGVtZW50LmF0dHIoJ2RhdGEtc3BlZWQnKSAvIDEwIDogZmFsc2U7XG4gICAgICAgICAgICBsZXQgZWxlbWVudFBvc2l0aW9uID0gJGVsZW1lbnQuYXR0cignZGF0YS1wb3NpdGlvbicpO1xuICAgICAgICAgICAgbGV0IGVsZW1lbnRUYXJnZXQgPSAkZWxlbWVudC5hdHRyKCdkYXRhLXRhcmdldCcpO1xuICAgICAgICAgICAgbGV0IGVsZW1lbnRIb3Jpem9udGFsID0gJGVsZW1lbnQuYXR0cignZGF0YS1ob3Jpem9udGFsJyk7XG4gICAgICAgICAgICBsZXQgZWxlbWVudFN0aWNreSA9ICh0eXBlb2YgJGVsZW1lbnQuYXR0cignZGF0YS1zdGlja3knKSA9PT0gJ3N0cmluZycpO1xuICAgICAgICAgICAgbGV0IGVsZW1lbnRTdGlja3lUYXJnZXQgPSAkZWxlbWVudC5hdHRyKCdkYXRhLXN0aWNreS10YXJnZXQnKTtcbiAgICAgICAgICAgIGxldCAkdGFyZ2V0ID0gKGVsZW1lbnRUYXJnZXQgJiYgJChlbGVtZW50VGFyZ2V0KS5sZW5ndGgpID8gJChlbGVtZW50VGFyZ2V0KSA6ICRlbGVtZW50O1xuICAgICAgICAgICAgbGV0IGVsZW1lbnRPZmZzZXQgPSAkdGFyZ2V0Lm9mZnNldCgpLnRvcCArIHRoaXMuc2Nyb2xsYmFyLnNjcm9sbFRvcDtcbiAgICAgICAgICAgIGxldCBlbGVtZW50TGltaXQgPSBlbGVtZW50T2Zmc2V0ICsgJHRhcmdldC5vdXRlckhlaWdodCgpO1xuXG4gICAgICAgICAgICBsZXQgZWxlbWVudFZpZXdwb3J0T2Zmc2V0ID0gbnVsbDtcbiAgICAgICAgICAgIGlmKHR5cGVvZiAkZWxlbWVudC5hdHRyKCdkYXRhLXZpZXdwb3J0LW9mZnNldCcpID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgZWxlbWVudFZpZXdwb3J0T2Zmc2V0ID0gJGVsZW1lbnQuYXR0cignZGF0YS12aWV3cG9ydC1vZmZzZXQnKS5zcGxpdCgnLCcpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvL01hbmFnZSBjYWxsYmFja1xuICAgICAgICAgICAgbGV0IGVsZW1lbnRDYWxsYmFja1N0cmluZyA9ICh0eXBlb2YgJGVsZW1lbnQuYXR0cignZGF0YS1jYWxsYmFjaycpID09PSAnc3RyaW5nJykgPyAkZWxlbWVudC5hdHRyKCdkYXRhLWNhbGxiYWNrJykgOiBudWxsO1xuICAgICAgICAgICAgbGV0IGVsZW1lbnRDYWxsYmFjayA9IG51bGw7XG5cbiAgICAgICAgICAgIGlmKGVsZW1lbnRDYWxsYmFja1N0cmluZyAhPSBudWxsKXtcbiAgICAgICAgICAgICAgICBsZXQgZXZlbnQgPSBlbGVtZW50Q2FsbGJhY2tTdHJpbmcuc3Vic3RyKDAsIGVsZW1lbnRDYWxsYmFja1N0cmluZy5pbmRleE9mKCcoJykpO1xuICAgICAgICAgICAgICAgIGxldCBvcHRpb25zU3RyaW5nID0gZWxlbWVudENhbGxiYWNrU3RyaW5nLnN1YnN0cihlbGVtZW50Q2FsbGJhY2tTdHJpbmcuaW5kZXhPZignKCcpLGVsZW1lbnRDYWxsYmFja1N0cmluZy5sZW5ndGggLSBldmVudC5sZW5ndGgpO1xuXG4gICAgICAgICAgICAgICAgb3B0aW9uc1N0cmluZyA9IG9wdGlvbnNTdHJpbmcucmVwbGFjZSgnKCcsJycpO1xuICAgICAgICAgICAgICAgIG9wdGlvbnNTdHJpbmcgPSBvcHRpb25zU3RyaW5nLnJlcGxhY2UoJyknLCcnKTtcblxuICAgICAgICAgICAgICAgIGxldCBvcHRpb25zID0gb3B0aW9uc1N0cmluZy5zcGxpdCgnfCcpO1xuXG4gICAgICAgICAgICAgICAgbGV0IG9iaiA9IHt9O1xuXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBvcHRpb25zLmxlbmd0aDsgaisrKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IG9wdGlvbiA9IG9wdGlvbnNbal0uc3BsaXQoJzonKTtcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9uWzBdID0gb3B0aW9uWzBdLnJlcGxhY2UoJyAnLCcnKTtcblxuICAgICAgICAgICAgICAgICAgICBsZXQgdmFsO1xuICAgICAgICAgICAgICAgICAgICAvL2NoZWNrIGlmIHZhbHVlIGlzIGEgYm9vbGVhblxuICAgICAgICAgICAgICAgICAgICBpZihvcHRpb25bMV0gPT09IFwidHJ1ZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWwgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYob3B0aW9uWzFdID09PSBcImZhbHNlXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8vY2hlY2sgaWYgdmFsdWUgaXMgbnVtZXJpY1xuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmKC9eXFxkKyQvLnRlc3Qob3B0aW9uWzFdKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsID0gcGFyc2VJbnQob3B0aW9uWzFdKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvL2NoZWNrIGlmIHZhbHVlIGlzIGEgU3RyaW5nXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsID0gb3B0aW9uWzFdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIG9ialtvcHRpb25bMF1dID0gdmFsO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGVsZW1lbnRDYWxsYmFjayA9IHtldmVudDpldmVudCwgb3B0aW9uczpvYmp9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBJZiBlbGVtZW50cyBzdGF5cyB2aXNpYmxlIGFmdGVyIHNjcm9sbGluZyBwYXN0IGl0XG4gICAgICAgICAgICBsZXQgZWxlbWVudFJlcGVhdCA9ICh0eXBlb2YgJGVsZW1lbnQuYXR0cignZGF0YS1yZXBlYXQnKSA9PT0gJ3N0cmluZycpO1xuXG4gICAgICAgICAgICBsZXQgZWxlbWVudEluVmlld0NsYXNzID0gJGVsZW1lbnQuYXR0cignZGF0YS1pbnZpZXctY2xhc3MnKTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZWxlbWVudEluVmlld0NsYXNzID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIGVsZW1lbnRJblZpZXdDbGFzcyA9ICdpcy1zaG93JztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFlbGVtZW50VGFyZ2V0ICYmICRlbGVtZW50LmF0dHIoJ2RhdGEtdHJhbnNmb3JtJykpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50T2Zmc2V0IC09IHBhcnNlRmxvYXQoJGVsZW1lbnQuYXR0cignZGF0YS10cmFuc2Zvcm0nKS55KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGVsZW1lbnRTdGlja3kpIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGVsZW1lbnRTdGlja3lUYXJnZXQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnRMaW1pdCA9IEluZmluaXR5O1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnRMaW1pdCA9ICQoZWxlbWVudFN0aWNreVRhcmdldCkub2Zmc2V0KCkudG9wIC0gJGVsZW1lbnQuaGVpZ2h0KCkgKyB0aGlzLnNjcm9sbGJhci5zY3JvbGxUb3A7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBuZXdFbGVtZW50ID0ge1xuICAgICAgICAgICAgICAgICRlbGVtZW50OiAkZWxlbWVudCxcbiAgICAgICAgICAgICAgICBpblZpZXdDbGFzczogZWxlbWVudEluVmlld0NsYXNzLFxuICAgICAgICAgICAgICAgIGxpbWl0OiBlbGVtZW50TGltaXQsXG4gICAgICAgICAgICAgICAgb2Zmc2V0OiBNYXRoLnJvdW5kKGVsZW1lbnRPZmZzZXQpLFxuICAgICAgICAgICAgICAgIHJlcGVhdDogZWxlbWVudFJlcGVhdCxcbiAgICAgICAgICAgICAgICBjYWxsYmFjazogZWxlbWVudENhbGxiYWNrLFxuICAgICAgICAgICAgICAgIHZpZXdwb3J0T2Zmc2V0OiBlbGVtZW50Vmlld3BvcnRPZmZzZXRcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8vIEZvciBwYXJhbGxheCBhbmltYXRlZCBlbGVtZW50c1xuICAgICAgICAgICAgaWYgKGVsZW1lbnRTcGVlZCAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICBsZXQgZWxlbWVudFBvc2l0aW9uID0gJGVsZW1lbnQuYXR0cignZGF0YS1wb3NpdGlvbicpO1xuICAgICAgICAgICAgICAgIGxldCBlbGVtZW50SG9yaXpvbnRhbCA9ICRlbGVtZW50LmF0dHIoJ2RhdGEtaG9yaXpvbnRhbCcpO1xuICAgICAgICAgICAgICAgIGxldCBlbGVtZW50TWlkZGxlID0gKChlbGVtZW50TGltaXQgLSBlbGVtZW50T2Zmc2V0KSAvIDIpICsgZWxlbWVudE9mZnNldDtcblxuICAgICAgICAgICAgICAgIG5ld0VsZW1lbnQuaG9yaXpvbnRhbCA9IGVsZW1lbnRIb3Jpem9udGFsO1xuICAgICAgICAgICAgICAgIG5ld0VsZW1lbnQubWlkZGxlID0gZWxlbWVudE1pZGRsZTtcbiAgICAgICAgICAgICAgICBuZXdFbGVtZW50Lm9mZnNldCA9IGVsZW1lbnRPZmZzZXQ7XG4gICAgICAgICAgICAgICAgbmV3RWxlbWVudC5wb3NpdGlvbiA9IGVsZW1lbnRQb3NpdGlvbjtcbiAgICAgICAgICAgICAgICBuZXdFbGVtZW50LnNwZWVkID0gZWxlbWVudFNwZWVkXG5cbiAgICAgICAgICAgICAgICB0aGlzLnBhcmFsbGF4RWxlbWVudHMucHVzaChuZXdFbGVtZW50KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbmV3RWxlbWVudC5zdGlja3kgPSBlbGVtZW50U3RpY2t5O1xuXG4gICAgICAgICAgICAgICAgdGhpcy5hbmltYXRlZEVsZW1lbnRzLnB1c2gobmV3RWxlbWVudCk7XG5cbiAgICAgICAgICAgICAgICAvLyBAdG9kbyBVc2VmdWw/XG4gICAgICAgICAgICAgICAgLy8gRG9uJ3QgYWRkIGVsZW1lbnQgaWYgaXQgYWxyZWFkeSBoYXMgaXRzIGluIHZpZXcgY2xhc3MgYW5kIGRvZXNuJ3QgcmVwZWF0XG4gICAgICAgICAgICAgICAgLy8gaWYgKGVsZW1lbnRSZXBlYXQgfHwgISRlbGVtZW50Lmhhc0NsYXNzKGVsZW1lbnRJblZpZXdDbGFzcykpIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgdGhpcy5hbmltYXRlZEVsZW1lbnRzLnB1c2gobmV3RWxlbWVudCk7XG4gICAgICAgICAgICAgICAgLy8gfVxuXG4gICAgICAgICAgICAgICAgaWYgKGVsZW1lbnRTdGlja3kpIHtcbiAgICAgICAgICAgICAgICAgICAgLy9sYXVuY2ggdGhlIHRvZ2dsZSBmdW5jdGlvbiB0byBzZXQgdGhlIHBvc2l0aW9uIG9mIHRoZSBzdGlja3kgZWxlbWVudFxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRvZ2dsZUVsZW1lbnQobmV3RWxlbWVudCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlbmRlciB0aGUgY2xhc3MvdHJhbnNmb3JtIGFuaW1hdGlvbnMsIGFuZCB1cGRhdGUgdGhlIGdsb2JhbCBzY3JvbGwgcG9zaXRpb25uaW5nLlxuICAgICAqXG4gICAgICogQHBhcmFtICB7Ym9vbGVhbn0gaXNGaXJzdENhbGwgRGV0ZXJtaW5lcyBpZiB0aGlzIGlzIHRoZSBmaXJzdCBvY2N1cmVuY2Ugb2YgbWV0aG9kIGJlaW5nIGNhbGxlZFxuICAgICAqIEBwYXJhbSAge29iamVjdH0gIHN0YXR1cyAgICAgIE9wdGlvbmFsIHN0YXR1cyBvYmplY3QgcmVjZWl2ZWQgd2hlbiBtZXRob2QgaXNcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsZWQgYnkgc21vb3RoLXNjcm9sbGJhciBpbnN0YW5jZSBsaXN0ZW5lci5cbiAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAqL1xuICAgIHJlbmRlckFuaW1hdGlvbnMoaXNGaXJzdENhbGwsIHN0YXR1cykge1xuICAgICAgICBpZiAodHlwZW9mIHN0YXR1cyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsYmFyU3RhdHVzID0gc3RhdHVzO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgc2Nyb2xsYmFyVG9wID0gdGhpcy5zY3JvbGxiYXIuc2Nyb2xsVG9wO1xuXG4gICAgICAgIGlmKHRoaXMuZ2V0V2F5KXtcbiAgICAgICAgICAgIGlmIChzY3JvbGxiYXJUb3AgPiB0aGlzLnNjcm9sbC55KSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc2Nyb2xsLmRpcmVjdGlvbiAhPT0gJ2Rvd24nKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2Nyb2xsLmRpcmVjdGlvbiA9ICdkb3duJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHNjcm9sbGJhclRvcCA8IHRoaXMuc2Nyb2xsLnkpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zY3JvbGwuZGlyZWN0aW9uICE9PSAndXAnKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2Nyb2xsLmRpcmVjdGlvbiA9ICd1cCc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYodGhpcy5nZXRTcGVlZCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuc2Nyb2xsLnkgIT09IHNjcm9sbGJhclRvcCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2Nyb2xsLnNwZWVkID0gdGhpcy5zY3JvbGxiYXIubW92ZW1lbnQueTtcbiAgICAgICAgICAgICAgICB0aGlzLnNjcm9sbC55ID0gc2Nyb2xsYmFyVG9wO1xuICAgICAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuc2Nyb2xsLnNwZWVkID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnNjcm9sbC55ICE9PSBzY3JvbGxiYXJUb3ApIHtcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsLnkgPSBzY3JvbGxiYXJUb3A7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnRyYW5zZm9ybUVsZW1lbnRzKGlzRmlyc3RDYWxsKTtcbiAgICAgICAgdGhpcy5hbmltYXRlRWxlbWVudHMoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTY3JvbGwgdG8gYSBkZXNpcmVkIHRhcmdldC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSAge29iamVjdH0gb3B0aW9uc1xuICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICovXG4gICAgc2Nyb2xsVG8ob3B0aW9ucykge1xuICAgICAgICBjb25zdCAkdGFyZ2V0RWxlbSA9IG9wdGlvbnMudGFyZ2V0RWxlbTtcbiAgICAgICAgY29uc3QgJHNvdXJjZUVsZW0gPSBvcHRpb25zLnNvdXJjZUVsZW07XG4gICAgICAgIGNvbnN0IG9mZnNldEVsZW0gPSBvcHRpb25zLm9mZnNldEVsZW07XG4gICAgICAgIGxldCB0YXJnZXRPZmZzZXQgPSBpc051bWVyaWMob3B0aW9ucy50YXJnZXRPZmZzZXQpID8gcGFyc2VJbnQob3B0aW9ucy50YXJnZXRPZmZzZXQpIDogMDtcbiAgICAgICAgY29uc3QgZGVsYXkgPSBpc051bWVyaWMob3B0aW9ucy5kZWxheSkgPyBwYXJzZUludChvcHRpb25zLmRlbGF5KSA6IDA7XG4gICAgICAgIGNvbnN0IHNwZWVkID0gaXNOdW1lcmljKG9wdGlvbnMuc3BlZWQpID8gcGFyc2VJbnQob3B0aW9ucy5zcGVlZCkgOiA5MDA7XG4gICAgICAgIGNvbnN0IHRvVG9wID0gb3B0aW9ucy50b1RvcDtcbiAgICAgICAgY29uc3QgdG9Cb3R0b20gPSBvcHRpb25zLnRvQm90dG9tO1xuICAgICAgICBsZXQgb2Zmc2V0ID0gMDtcblxuICAgICAgICBpZiAodHlwZW9mICR0YXJnZXRFbGVtID09PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgJHNvdXJjZUVsZW0gPT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiB0YXJnZXRPZmZzZXQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ1lvdSBtdXN0IHNwZWNpZnkgYXQgbGVhc3Qgb25lIHBhcmFtZXRlci4nKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiAkdGFyZ2V0RWxlbSAhPT0gJ3VuZGVmaW5lZCcgJiYgJHRhcmdldEVsZW0gaW5zdGFuY2VvZiBqUXVlcnkgJiYgJHRhcmdldEVsZW0ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdGFyZ2V0T2Zmc2V0ID0gJHRhcmdldEVsZW0ub2Zmc2V0KCkudG9wICsgdGhpcy5zY3JvbGxiYXIuc2Nyb2xsVG9wICsgdGFyZ2V0T2Zmc2V0O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiAkc291cmNlRWxlbSAhPT0gJ3VuZGVmaW5lZCcgJiYgJHNvdXJjZUVsZW0gaW5zdGFuY2VvZiBqUXVlcnkgJiYgJHNvdXJjZUVsZW0ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgbGV0IHRhcmdldERhdGEgPSAnJztcblxuICAgICAgICAgICAgaWYgKCRzb3VyY2VFbGVtLmF0dHIoJ2RhdGEtdGFyZ2V0JykpIHtcbiAgICAgICAgICAgICAgICB0YXJnZXREYXRhID0gJHNvdXJjZUVsZW0uYXR0cignZGF0YS10YXJnZXQnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0RGF0YSA9ICRzb3VyY2VFbGVtLmF0dHIoJ2hyZWYnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGFyZ2V0T2Zmc2V0ID0gJCh0YXJnZXREYXRhKS5vZmZzZXQoKS50b3AgKyB0aGlzLnNjcm9sbGJhci5zY3JvbGxUb3AgKyB0YXJnZXRPZmZzZXQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIG9mZnNldEVsZW0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBvZmZzZXQgPSAkKG9mZnNldEVsZW0pLm91dGVySGVpZ2h0KCk7XG4gICAgICAgICAgICB0YXJnZXRPZmZzZXQgPSB0YXJnZXRPZmZzZXQgLSBvZmZzZXQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodG9Ub3AgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHRhcmdldE9mZnNldCA9IDA7XG4gICAgICAgIH0gZWxzZSBpZiAodG9Cb3R0b20gPT09IHRydWUpIHtcbiAgICAgICAgICAgIHRhcmdldE9mZnNldCA9IHRoaXMuc2Nyb2xsYmFyLmxpbWl0Lnk7XG4gICAgICAgIH1cblxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsYmFyLnNjcm9sbFRvKDAsIHRhcmdldE9mZnNldCwgc3BlZWQpO1xuICAgICAgICB9LCBkZWxheSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0IHRoZSBzY3JvbGwgYmFyIGxpbWl0XG4gICAgICovXG4gICAgc2V0U2Nyb2xsYmFyTGltaXQoKSB7XG4gICAgICAgIHRoaXMuc2Nyb2xsYmFyTGltaXQgPSB0aGlzLnNjcm9sbGJhci5saW1pdC55ICsgdGhpcy53aW5kb3dIZWlnaHQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQXBwbHkgQ1NTIHRyYW5zZm9ybSBwcm9wZXJ0aWVzIG9uIGFuIGVsZW1lbnQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gIHtvYmplY3R9ICAkZWxlbWVudCBUYXJnZXR0ZWQgalF1ZXJ5IGVsZW1lbnRcbiAgICAgKiBAcGFyYW0gIHtpbnR9ICAgICB4ICAgICAgICBUcmFuc2xhdGUgdmFsdWVcbiAgICAgKiBAcGFyYW0gIHtpbnR9ICAgICB5ICAgICAgICBUcmFuc2xhdGUgdmFsdWVcbiAgICAgKiBAcGFyYW0gIHtpbnR9ICAgICB6ICAgICAgICBUcmFuc2xhdGUgdmFsdWVcbiAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAqL1xuICAgIHRyYW5zZm9ybUVsZW1lbnQoJGVsZW1lbnQsIHgsIHksIHopIHtcbiAgICAgICAgLy8gRGVmYXVsdHNcbiAgICAgICAgeCA9IHggfHwgMDtcbiAgICAgICAgeSA9IHkgfHwgMDtcbiAgICAgICAgeiA9IHogfHwgMDtcblxuICAgICAgICAvLyBUcmFuc2xhdGUgYW5kIHN0b3JlIHRoZSBwb3NpdGlvbm5pbmcgYXMgYGRhdGFgXG4gICAgICAgICRlbGVtZW50LmNzcyh7XG4gICAgICAgICAgICAnLXdlYmtpdC10cmFuc2Zvcm0nOiBgdHJhbnNsYXRlM2QoJHt4fXB4LCAke3l9cHgsICR7en1weClgLFxuICAgICAgICAgICAgJy1tcy10cmFuc2Zvcm0nOiBgdHJhbnNsYXRlM2QoJHt4fXB4LCAke3l9cHgsICR7en1weClgLFxuICAgICAgICAgICAgJ3RyYW5zZm9ybSc6IGB0cmFuc2xhdGUzZCgke3h9cHgsICR7eX1weCwgJHt6fXB4KWBcbiAgICAgICAgfSkuZGF0YSgndHJhbnNmb3JtJyx7XG4gICAgICAgICAgICB4IDogeCxcbiAgICAgICAgICAgIHkgOiB5LFxuICAgICAgICAgICAgeiA6IHpcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gQWZmZWN0IGNoaWxkIGVsZW1lbnRzIHdpdGggdGhlIHNhbWUgcG9zaXRpb25uaW5nXG4gICAgICAgIC8vIGNvbnN0IGNoaWxkcmVuID0gJGVsZW1lbnQuZmluZCh0aGlzLnNlbGVjdG9yKTtcbiAgICAgICAgLy8gY29uc3QgbGVuID0gY2hpbGRyZW4ubGVuZ3RoO1xuICAgICAgICAvLyBsZXQgaSA9IDA7XG4gICAgICAgIC8vIGZvciAoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgLy8gICAgIGxldCAkY2hpbGQgPSAkKGNoaWxkcmVuW2ldKTtcbiAgICAgICAgLy8gICAgIGlmICghJGNoaWxkLmRhdGEoJ3RyYW5zZm9ybScpKSB7XG4gICAgICAgIC8vICAgICAgICAgJGNoaWxkLmRhdGEoJ3RyYW5zZm9ybScsIHtcbiAgICAgICAgLy8gICAgICAgICAgICAgeDogeCxcbiAgICAgICAgLy8gICAgICAgICAgICAgeTogeSxcbiAgICAgICAgLy8gICAgICAgICAgICAgejogelxuICAgICAgICAvLyAgICAgICAgIH0pXG4gICAgICAgIC8vICAgICB9XG4gICAgICAgIC8vIH07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTG9vcCB0aHJvdWdoIGFsbCBwYXJhbGxheC1hYmxlIGVsZW1lbnRzIGFuZCBhcHBseSB0cmFuc2Zvcm0gbWV0aG9kKHMpLlxuICAgICAqXG4gICAgICogQHBhcmFtICB7Ym9vbGVhbn0gaXNGaXJzdENhbGwgRGV0ZXJtaW5lcyBpZiB0aGlzIGlzIHRoZSBmaXJzdCBvY2N1cmVuY2Ugb2YgbWV0aG9kIGJlaW5nIGNhbGxlZFxuICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICovXG4gICAgdHJhbnNmb3JtRWxlbWVudHMoaXNGaXJzdENhbGwpIHtcbiAgICAgICAgaWYgKHRoaXMucGFyYWxsYXhFbGVtZW50cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBjb25zdCBzY3JvbGxiYXJCb3R0b20gPSB0aGlzLnNjcm9sbGJhci5zY3JvbGxUb3AgKyB0aGlzLndpbmRvd0hlaWdodDtcbiAgICAgICAgICAgIGNvbnN0IHNjcm9sbGJhck1pZGRsZSA9IHRoaXMuc2Nyb2xsYmFyLnNjcm9sbFRvcCArIHRoaXMud2luZG93TWlkZGxlO1xuXG4gICAgICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgICAgICBjb25zdCBsZW4gPSB0aGlzLnBhcmFsbGF4RWxlbWVudHMubGVuZ3RoO1xuICAgICAgICAgICAgY29uc3QgcmVtb3ZlSW5kZXhlcyA9IFtdO1xuXG4gICAgICAgICAgICBmb3IgKDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGN1ckVsID0gdGhpcy5wYXJhbGxheEVsZW1lbnRzW2ldO1xuICAgICAgICAgICAgICAgIC8vIE9sZFxuICAgICAgICAgICAgICAgIGxldCBzY3JvbGxCb3R0b20gPSBzY3JvbGxiYXJCb3R0b207XG4gICAgICAgICAgICAgICAgLy8gTmV3XG4gICAgICAgICAgICAgICAgLy8gbGV0IHNjcm9sbEJvdHRvbSA9IChjdXJFbC5wb3NpdGlvbiA9PT0gJ3RvcCcpID8gdGhpcy5zY3JvbGxiYXIuc2Nyb2xsVG9wIDogc2Nyb2xsYmFyQm90dG9tO1xuXG4gICAgICAgICAgICAgICAgbGV0IHRyYW5zZm9ybURpc3RhbmNlID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICAvLyBEZWZpbmUgaWYgdGhlIGVsZW1lbnQgaXMgaW4gdmlld1xuICAgICAgICAgICAgICAgIC8vIE9sZFxuICAgICAgICAgICAgICAgIGxldCBpblZpZXcgPSAoc2Nyb2xsQm90dG9tID49IGN1ckVsLm9mZnNldCAmJiB0aGlzLnNjcm9sbC55IDw9IGN1ckVsLmxpbWl0KTtcbiAgICAgICAgICAgICAgICAvLyBOZXdcbiAgICAgICAgICAgICAgICAvLyBsZXQgaW5WaWV3ID0gKHNjcm9sbEJvdHRvbSA+PSBjdXJFbC5vZmZzZXQgJiYgdGhpcy5zY3JvbGxiYXIuc2Nyb2xsVG9wIDw9IGN1ckVsLmxpbWl0KTtcblxuICAgICAgICAgICAgICAgIHRoaXMudG9nZ2xlRWxlbWVudChjdXJFbCwgaSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoaXNGaXJzdENhbGwgJiYgIWluVmlldyAmJiBjdXJFbC5zcGVlZCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBEaWZmZXJlbnQgY2FsY3VsYXRpb25zIGlmIGl0IGlzIHRoZSBmaXJzdCBjYWxsIGFuZCB0aGUgaXRlbSBpcyBub3QgaW4gdGhlIHZpZXdcbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1ckVsLnBvc2l0aW9uICE9PSAndG9wJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtRGlzdGFuY2UgPSAoY3VyRWwub2Zmc2V0IC0gdGhpcy53aW5kb3dNaWRkbGUgLSBjdXJFbC5taWRkbGUpICogLWN1ckVsLnNwZWVkO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gSWYgZWxlbWVudCBpcyBpbiB2aWV3XG4gICAgICAgICAgICAgICAgaWYgKGluVmlldyAmJiBjdXJFbC5zcGVlZCkge1xuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKGN1ckVsLnBvc2l0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICd0b3AnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE9sZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybURpc3RhbmNlID0gdGhpcy5zY3JvbGxiYXIuc2Nyb2xsVG9wICogLWN1ckVsLnNwZWVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE5ld1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRyYW5zZm9ybURpc3RhbmNlID0gKHRoaXMuc2Nyb2xsYmFyLnNjcm9sbFRvcCAtIGN1ckVsLm9mZnNldCkgKiAtY3VyRWwuc3BlZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnYm90dG9tJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm1EaXN0YW5jZSA9ICh0aGlzLnNjcm9sbGJhckxpbWl0IC0gc2Nyb2xsQm90dG9tKSAqIGN1ckVsLnNwZWVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtRGlzdGFuY2UgPSAoc2Nyb2xsYmFyTWlkZGxlIC0gY3VyRWwubWlkZGxlKSAqIC1jdXJFbC5zcGVlZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gVHJhbnNmb3JtIGhvcml6b250YWwgT1IgdmVydGljYWwuIERlZmF1bHRzIHRvIHZlcnRpY2FsXG4gICAgICAgICAgICAgICAgaWYgKGlzTnVtZXJpYyh0cmFuc2Zvcm1EaXN0YW5jZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgKGN1ckVsLmhvcml6b250YWwpID9cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudHJhbnNmb3JtRWxlbWVudChjdXJFbC4kZWxlbWVudCwgdHJhbnNmb3JtRGlzdGFuY2UpIDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudHJhbnNmb3JtRWxlbWVudChjdXJFbC4kZWxlbWVudCwgMCwgdHJhbnNmb3JtRGlzdGFuY2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFVwZGF0ZSBlbGVtZW50cyBhbmQgcmVjYWxjdWxhdGUgYWxsIHRoZSBwb3NpdGlvbnMgb24gdGhlIHBhZ2VcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zXG4gICAgICovXG4gICAgdXBkYXRlRWxlbWVudHMob3B0aW9ucykge1xuICAgICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgICAgICB0aGlzLnNjcm9sbGJhci51cGRhdGUoKTtcbiAgICAgICAgdGhpcy53aW5kb3dIZWlnaHQgPSAkd2luZG93LmhlaWdodCgpO1xuICAgICAgICB0aGlzLndpbmRvd01pZGRsZSA9IHRoaXMud2luZG93SGVpZ2h0IC8gMjtcbiAgICAgICAgdGhpcy5zZXRTY3JvbGxiYXJMaW1pdCgpO1xuICAgICAgICB0aGlzLnNldFdoZWVsRGlyZWN0aW9uKHRoaXMuaXNSZXZlcnNlZCk7XG4gICAgICAgIHRoaXMuYWRkRWxlbWVudHMoKTtcbiAgICAgICAgdGhpcy50cmFuc2Zvcm1FbGVtZW50cyh0cnVlKTtcblxuICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnMuY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIG9wdGlvbnMuY2FsbGJhY2soKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucmVuZGVyQW5pbWF0aW9ucyhmYWxzZSwgc3RhdHVzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXQgc21vb3RoLXNjcm9sbGJhciBzY3JvbGxpbmcgZGlyZWN0aW9uIGZvciB3aGVlbCBldmVudFxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gaXNSZXZlcnNlZFxuICAgICAqL1xuICAgIHNldFdoZWVsRGlyZWN0aW9uKGlzUmV2ZXJzZWQpe1xuICAgICAgICB0aGlzLnNjcm9sbGJhci5yZXZlcnNlV2hlZWwoaXNSZXZlcnNlZCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRGVzdHJveVxuICAgICAqL1xuICAgIGRlc3Ryb3koKSB7XG4gICAgICAgIHN1cGVyLmRlc3Ryb3koKTtcbiAgICAgICAgJGh0bWwucmVtb3ZlQ2xhc3MoJ2hhcy1zbW9vdGgtc2Nyb2xsJyk7XG4gICAgICAgIHRoaXMucGFyYWxsYXhFbGVtZW50cyA9IFtdO1xuICAgICAgICB0aGlzLnNjcm9sbGJhci5kZXN0cm95KCk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgQVBQX05BTUUsICRkb2N1bWVudCwgJGh0bWwsICRib2R5LCAgaXNEZWJ1ZywgJHBqYXhXcmFwcGVyIH0gZnJvbSAnLi4vdXRpbHMvZW52aXJvbm1lbnQnO1xuXG5pbXBvcnQgeyBFVkVOVCBhcyBUcmFuc2l0aW9uRXZlbnQgfSBmcm9tICcuL1RyYW5zaXRpb25NYW5hZ2VyJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyB7XG4gICAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuXG4gICAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgICAgIHRoaXMud3JhcHBlciA9IG9wdGlvbnMud3JhcHBlcjtcbiAgICAgICAgdGhpcy5vdmVycmlkZUNsYXNzID0gb3B0aW9ucy5vdmVycmlkZUNsYXNzID8gb3B0aW9ucy5vdmVycmlkZUNsYXNzIDogJyc7XG4gICAgICAgIHRoaXMuY2xpY2tlZExpbmsgPSBvcHRpb25zLmNsaWNrZWRMaW5rO1xuXG4gICAgfVxuXG4gICAgbGF1bmNoKCkge1xuICAgICAgICBpZihpc0RlYnVnKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIi0tLS0gTGF1bmNoIHRyYW5zaXRpb24g8J+RiiAtLS0tLVwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgICRodG1sXG4gICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ2hhcy1kb20tbG9hZGVkIGhhcy1kb20tYW5pbWF0ZWQgJylcbiAgICAgICAgICAgIC5hZGRDbGFzcyhgaGFzLWRvbS1sb2FkaW5nICR7dGhpcy5vdmVycmlkZUNsYXNzfWApO1xuXG4gICAgfVxuXG4gICAgaGlkZVZpZXcob2xkVmlldywgbmV3Vmlldykge1xuICAgICAgICBpZihpc0RlYnVnKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnLS0tLS0g4p2MIFtWSUVXXTpoaWRlIC0gJywgb2xkVmlldy5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGVtcGxhdGUnKSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBsYXVuY2ggaXQgYXQgdGhlIGVuZCAoYW5pbWF0aW9ucy4uLilcbiAgICAgICAgJGRvY3VtZW50LnRyaWdnZXJIYW5kbGVyKHtcbiAgICAgICAgICAgIHR5cGU6VHJhbnNpdGlvbkV2ZW50LlJFQURZVE9SRU1PVkUsXG4gICAgICAgICAgICBvbGRWaWV3OiBvbGRWaWV3LFxuICAgICAgICAgICAgbmV3VmlldzogbmV3Vmlld1xuICAgICAgICB9KTtcblxuICAgIH1cblxuXG4gICAgZGlzcGxheVZpZXcodmlldykge1xuXG4gICAgICAgIGlmKGlzRGVidWcpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCctLS0tLSDinIUgW1ZJRVddOmRpc3BsYXkgOicsIHZpZXcuZ2V0QXR0cmlidXRlKCdkYXRhLXRlbXBsYXRlJykpO1xuICAgICAgICB9XG5cbiAgICAgICAgJGh0bWwuYXR0cignZGF0YS10ZW1wbGF0ZScsIHZpZXcuZ2V0QXR0cmlidXRlKCdkYXRhLXRlbXBsYXRlJykpO1xuXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuXG4gICAgICAgICAgICAkaHRtbFxuICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnaGFzLWRvbS1sb2FkZWQnKVxuICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnaGFzLWRvbS1sb2FkaW5nJyk7XG5cbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICRodG1sXG4gICAgICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcyh0aGlzLm92ZXJyaWRlQ2xhc3MpXG4gICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnaGFzLWRvbS1hbmltYXRlZCcpO1xuICAgICAgICAgICAgfSwgMTAwMCk7XG5cbiAgICAgICAgICAgIC8vIGxhdW5jaCBpdCBhdCB0aGUgZW5kIChhbmltYXRpb25zLi4uKVxuICAgICAgICAgICAgJGRvY3VtZW50LnRyaWdnZXJIYW5kbGVyKHtcbiAgICAgICAgICAgICAgICB0eXBlOlRyYW5zaXRpb25FdmVudC5SRUFEWVRPREVTVFJPWVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfSwxMDAwKTtcbiAgICB9XG5cblxuICAgIGRlc3Ryb3koKSB7XG4gICAgICAgIGlmKGlzRGVidWcpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiLS0tLSDinYwgW3RyYW5zaXRpb25dOmRlc3Ryb3kgLS0tLS1cIik7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJpbXBvcnQgeyBBUFBfTkFNRSwgJGRvY3VtZW50LCAkaHRtbCwgaXNEZWJ1ZywgJHBqYXhXcmFwcGVyIH0gZnJvbSAnLi4vdXRpbHMvZW52aXJvbm1lbnQnO1xuaW1wb3J0IEJhc2VUcmFuc2l0aW9uIGZyb20gJy4vQmFzZVRyYW5zaXRpb24nO1xuXG5pbXBvcnQgeyBFVkVOVCBhcyBUcmFuc2l0aW9uRXZlbnQgfSBmcm9tICcuL1RyYW5zaXRpb25NYW5hZ2VyJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBleHRlbmRzIEJhc2VUcmFuc2l0aW9ue1xuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICAgICAgc3VwZXIob3B0aW9ucyk7XG5cbiAgICAgICAgdGhpcy5vdmVycmlkZUNsYXNzID0gJy1jdXN0b20tdHJhbnNpdGlvbic7XG4gICAgfVxuXG59XG4iLCJpbXBvcnQgUGpheCBmcm9tICdwamF4JztcbmltcG9ydCB7IEFQUF9OQU1FLCAkZG9jdW1lbnQsICRodG1sLCBpc0RlYnVnLCAkcGpheFdyYXBwZXIsICR3aW5kb3cgfSBmcm9tICcuLi91dGlscy9lbnZpcm9ubWVudCc7XG5pbXBvcnQgeyBFVkVOVCBhcyBBUFBfRVZFTlQgfSBmcm9tICcuLi9hcHAnO1xuXG4vL0xpc3QgaGVyZSBhbGwgb2YgeW91ciB0cmFuc2l0aW9uc1xuaW1wb3J0ICogYXMgdHJhbnNpdGlvbnMgZnJvbSAnLi90cmFuc2l0aW9ucyc7XG5cbmNvbnN0IE1PRFVMRV9OQU1FID0gJ1RyYW5zaXRpb24nO1xuY29uc3QgRVZFTlRfTkFNRVNQQUNFID0gYCR7QVBQX05BTUV9LiR7TU9EVUxFX05BTUV9YDtcblxuZXhwb3J0IGNvbnN0IEVWRU5UID0ge1xuICAgIENMSUNLOiBgY2xpY2suJHtFVkVOVF9OQU1FU1BBQ0V9YCxcbiAgICBSRUFEWVRPUkVNT1ZFOiBgcmVhZHlUb1JlbW92ZS4ke0VWRU5UX05BTUVTUEFDRX1gLFxuICAgIFJFQURZVE9ERVNUUk9ZOiBgcmVhZHlUb0Rlc3Ryb3kuJHtFVkVOVF9OQU1FU1BBQ0V9YCxcbiAgICBHT1RPOiBgZ290by4ke0VWRU5UX05BTUVTUEFDRX1gXG59O1xuXG4vKlxuXG5AdG9kbyA6XG5cbi0g4pyFIGdldCBkYXRhLXRyYW5zaXRpb24gb24gY2xpY2tlZCBsaW5rIC0+IGxhdW5jaCgpIGFuZCBhZGQgc3dpdGNoKCl7fVxuLSDinIUgYWRkIGdvdG8gbGlzdGVuZXJcbi0g4pyFIGFkZCBvdmVycmlkZUNsYXNzIHN5c3RlbSBmb3IgYWxsIHRyYW5zaXRpb25zXG4tIOKchSBhZGQgYmFzZSBjbGFzcyBtYW5hZ2VyIGxpa2Ugb2xkIERlZmF1bHRUcmFuc2l0aW9uIChoYXMtZG9tLWxvYWRlZCwgaGFzLWRvbS1sb2FkaW5nIGV0Yy4uKVxuXG5cbj09PT09PT0gU0NIRU1BID09PT09PT1cblxuW10gOiBsaXN0ZW5lclxuKiA6IHRyaWdnZXIgZXZlbnRcblxuW3BqYXg6c2VuZF0gLT4gKHRyYW5zaXRpb24pIGxhdW5jaCgpXG5cbltwamF4OnN3aXRjaF0gKD0gbmV3IHZpZXcgaXMgbG9hZGVkKSAtPiAodHJhbnNpdGlvbikgaGlkZVZpZXcoKS0+IGhpZGUgYW5pbWF0aW9ucyAmICpyZWFkeVRvUmVtb3ZlXG5cbltyZWFkeVRvUmVtb3ZlXSAtPiByZW1vdmUoKSAtPiBkZWxldGUgbW9kdWxlc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0+IHJlbW92ZSBvbGRWaWV3IGZyb20gdGhlIERPTSwgYW5kIGlubmVySFRNbCBuZXdWaWV3XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLT4gZGlzcGxheSgpXG5cbmRpc3BsYXkoKSAtPiAodHJhbnNpdGlvbikgZGlzcGxheVZpZXcoKSAtPiBkaXNwbGF5IGFuaW1hdGlvbnMgJiAqcmVhZHlUb0Rlc3Ryb3lcbiAgICAgICAgICAtPiBpbml0IG5ldyBtb2R1bGVzXG5cbltyZWFkeVRvUmVtb3ZlXSAtPiByZWluaXQoKVxuXG4qL1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyB7XG4gICAgY29uc3RydWN0b3IoKSB7XG5cblxuICAgICAgICAvLyBqUXVlcnkgb25kb21yZWFkeVxuICAgICAgICAkd2luZG93Lm9uKCdsb2FkJywoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmxvYWQoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy50cmFuc2l0aW9uID0gbmV3IHRyYW5zaXRpb25zWydCYXNlVHJhbnNpdGlvbiddKHtcbiAgICAgICAgICAgIHdyYXBwZXI6IHRoaXMud3JhcHBlclxuICAgICAgICB9KTtcblxuICAgICAgICAvKlxuICAgICAgICA9PT09PSBQSkFYIENPTkZJR1VSQVRJT04gPT09PT1cbiAgICAgICAgKi9cblxuICAgICAgICB0aGlzLmNvbnRhaW5lckNsYXNzID0gJy5qcy1wamF4LWNvbnRhaW5lcic7XG4gICAgICAgIHRoaXMud3JhcHBlcklkID0gJ2pzLXBqYXgtd3JhcHBlcic7XG4gICAgICAgIHRoaXMubm9QamF4UmVxdWVzdENsYXNzID0gJ25vLXRyYW5zaXRpb24nO1xuICAgICAgICB0aGlzLndyYXBwZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLndyYXBwZXJJZCk7XG5cbiAgICAgICAgdGhpcy5vcHRpb25zID0ge1xuICAgICAgICAgICAgZGVidWc6IGZhbHNlLFxuICAgICAgICAgICAgY2FjaGVCdXN0OiBmYWxzZSxcbiAgICAgICAgICAgIGVsZW1lbnRzOiBbYGE6bm90KC4ke3RoaXMubm9QamF4UmVxdWVzdENsYXNzfSlgLCdmb3JtW2FjdGlvbl0nXSxcbiAgICAgICAgICAgIHNlbGVjdG9yczogWyd0aXRsZScsYCR7dGhpcy5jb250YWluZXJDbGFzc31gXSxcbiAgICAgICAgICAgIHN3aXRjaGVzOiB7fSxcbiAgICAgICAgICAgIHJlcXVlc3RPcHRpb25zOiB7XG4gICAgICAgICAgICAgICAgdGltZW91dDogMjAwMFxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLm9wdGlvbnMuc3dpdGNoZXNbdGhpcy5jb250YWluZXJDbGFzc10gPSAob2xkRWwsIG5ld0VsLCBvcHRpb25zKSA9PiB0aGlzLnN3aXRjaChvbGRFbCwgbmV3RWwsIG9wdGlvbnMpXG4gICAgICAgIHRoaXMucGpheCA9IG5ldyBQamF4KHRoaXMub3B0aW9ucyk7XG5cbiAgICAgICAgLypcbiAgICAgICAgPT09PT0gTElTVEVORVJTID09PT09XG4gICAgICAgICovXG5cbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigncGpheDpzZW5kJywoZSkgPT4gdGhpcy5zZW5kKGUpKTtcblxuXG4gICAgICAgICRkb2N1bWVudC5vbihFVkVOVC5SRUFEWVRPUkVNT1ZFLChldmVudCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5yZW1vdmUoZXZlbnQub2xkVmlldywgZXZlbnQubmV3Vmlldyk7XG4gICAgICAgIH0pO1xuICAgICAgICAkZG9jdW1lbnQub24oRVZFTlQuUkVBRFlUT0RFU1RST1ksKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICB0aGlzLnJlaW5pdCgpO1xuICAgICAgICB9KTtcblxuXG4gICAgICAgIC8qKiBnb3RvIGV4YW1wZVxuICAgICAgICAkZG9jdW1lbnQudHJpZ2dlckhhbmRsZXIoe1xuICAgICAgICAgICAgdHlwZTogJ2dvdG8uVHJhbnNpdGlvbicsXG4gICAgICAgICAgICBvcHRpb25zIDoge1xuICAgICAgICAgICAgICAgIGVsOiB7e2VsZW1lbnQgY2xpY2tlZD99fSxcbiAgICAgICAgICAgICAgICBsaW5rOiB7e3VybH19XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICAqL1xuICAgICAgICAkZG9jdW1lbnQub24oRVZFTlQuR09UTywgKGUpID0+IHtcbiAgICAgICAgICAgIGlmKGUub3B0aW9ucy5lbCAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmF1dG9FbCA9IGUub3B0aW9ucy5lbC5nZXQoMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnBqYXgubG9hZFVybChlLm9wdGlvbnMubGluaywgJC5leHRlbmQoe30sIHRoaXMucGpheC5vcHRpb25zKSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogKFBKQVgpIExhdW5jaCB3aGVuIHBqYXggcmVjZWl2ZSBhIHJlcXVlc3RcbiAgICAgKiBnZXQgJiBtYW5hZ2UgZGF0YS10cmFuc2l0aW9uLGluaXQgYW5kIGxhdW5jaCBpdFxuICAgICAqIEBwYXJhbSAge2V2ZW50fVxuICAgICAqIEByZXR1cm4gdm9pZFxuICAgICAqL1xuICAgIHNlbmQoZSkge1xuICAgICAgICBpZihpc0RlYnVnKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIi0tLS0gTGF1bmNoIHJlcXVlc3Qg8J+ZjCAtLS0tLVwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBlbCx0cmFuc2l0aW9uO1xuXG4gICAgICAgIGlmKGUudHJpZ2dlckVsZW1lbnQgIT0gdW5kZWZpbmVkKSB7XG5cbiAgICAgICAgICAgIGVsID0gZS50cmlnZ2VyRWxlbWVudDtcblxuICAgICAgICAgICAgdHJhbnNpdGlvbiA9IGVsLmdldEF0dHJpYnV0ZSgnZGF0YS10cmFuc2l0aW9uJykgPyBlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdHJhbnNpdGlvbicpIDogJ0Jhc2VUcmFuc2l0aW9uJztcbiAgICAgICAgICAgICRodG1sLmF0dHIoJ2RhdGEtdHJhbnNpdGlvbicsdHJhbnNpdGlvbik7XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKHRoaXMuYXV0b0VsICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGVsID0gdGhpcy5hdXRvRWw7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGVsID0gZG9jdW1lbnQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRyYW5zaXRpb24gPSAnQmFzZVRyYW5zaXRpb24nO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gb3B0aW9ucyBhdmFpbGFibGUgOiB3cmFwcGVyLCBvdmVycmlkZUNsYXNzXG4gICAgICAgIHRoaXMudHJhbnNpdGlvbiA9IG5ldyB0cmFuc2l0aW9uc1t0cmFuc2l0aW9uXSh7XG4gICAgICAgICAgICB3cmFwcGVyOiB0aGlzLndyYXBwZXIsXG4gICAgICAgICAgICBjbGlja2VkTGluazogZWxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy50cmFuc2l0aW9uLmxhdW5jaCgpO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogKFBKQVgpIExhdW5jaCB3aGVuIG5ldyBwYWdlIGlzIGxvYWRlZFxuICAgICAqIEBwYXJhbSAge2pzIGRvbSBlbGVtZW50fSxcbiAgICAgKiBAcGFyYW0gIHtqcyBkb20gZWxlbWVudH1cbiAgICAgKiBAcGFyYW0gIHtvcHRpb25zIDogcGpheCBvcHRpb25zfVxuICAgICAqIEByZXR1cm4gdm9pZFxuICAgICAqL1xuICAgIHN3aXRjaChvbGRWaWV3LCBuZXdWaWV3LCBvcHRpb25zKSB7XG4gICAgICAgIGlmKGlzRGVidWcpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCctLS0tIE5leHQgdmlldyBsb2FkZWQg8J+RjCAtLS0tLScpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudHJhbnNpdGlvbi5oaWRlVmlldyhvbGRWaWV3LCBuZXdWaWV3KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBMYXVuY2ggd2hlbiB5b3UgdHJpZ2dlciBFVkVOVC5SRUFEWVRPUkVNT1ZFIGluIHlvdXIgdHJhbnNpdGlvbiAtPiBoaWRlVmlldygpLCBhdCB0aGUgZW5kXG4gICAgICogYWZ0ZXIgb2xkVmlldyBoaWRkZW4sIGRlbGV0ZSBtb2R1bGVzIGFuZCBsYXVuY2ggdGhpcy5kaXNwbGF5KClcbiAgICAgKiBAcGFyYW0gIHtqcyBkb20gZWxlbWVudH0sXG4gICAgICogQHBhcmFtICB7anMgZG9tIGVsZW1lbnR9XG4gICAgICogQHJldHVybiB2b2lkXG4gICAgICovXG4gICAgcmVtb3ZlKG9sZFZpZXcsIG5ld1ZpZXcpIHtcblxuICAgICAgICAkZG9jdW1lbnQudHJpZ2dlckhhbmRsZXIoe1xuICAgICAgICAgICAgdHlwZTogQVBQX0VWRU5ULkRFTEVURV9TQ09QRURfTU9EVUxFUyxcbiAgICAgICAgICAgICRzY29wZTogJHBqYXhXcmFwcGVyXG4gICAgICAgIH0pO1xuXG4gICAgICAgIG9sZFZpZXcucmVtb3ZlKCk7XG5cbiAgICAgICAgdGhpcy5kaXNwbGF5KG5ld1ZpZXcpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGxhdW5jaCBhZnRlciB0aGlzLnJlbW92ZSgpXG4gICAgICogQHBhcmFtICB7anMgZG9tIGVsZW1lbnR9LFxuICAgICAqIEByZXR1cm4gdm9pZFxuICAgICAqL1xuICAgIGRpc3BsYXkodmlldykge1xuICAgICAgICB0aGlzLndyYXBwZXIuaW5uZXJIVE1MID0gdmlldy5vdXRlckhUTUw7XG5cbiAgICAgICAgLy8gRmV0Y2ggYW55IGlubGluZSBzY3JpcHQgZWxlbWVudHMuXG4gICAgICAgIGNvbnN0IHNjcmlwdHMgPSB2aWV3LnF1ZXJ5U2VsZWN0b3JBbGwoJ3NjcmlwdC5qcy1pbmxpbmUnKTtcblxuICAgICAgICBpZiAoc2NyaXB0cyBpbnN0YW5jZW9mIHdpbmRvdy5Ob2RlTGlzdCkge1xuICAgICAgICAgICAgbGV0IGkgPSAwO1xuICAgICAgICAgICAgbGV0IGxlbiA9IHNjcmlwdHMubGVuZ3RoO1xuICAgICAgICAgICAgZm9yICg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgICAgIGV2YWwoc2NyaXB0c1tpXS5pbm5lckhUTUwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgJGRvY3VtZW50LnRyaWdnZXJIYW5kbGVyKHtcbiAgICAgICAgICAgIHR5cGU6IEFQUF9FVkVOVC5JTklUX1NDT1BFRF9NT0RVTEVTLFxuICAgICAgICAgICAgaXNQamF4OiB0cnVlXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMucGpheC5vblN3aXRjaCgpO1xuXG4gICAgICAgIHRoaXMudHJhbnNpdGlvbi5kaXNwbGF5Vmlldyh2aWV3KTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIExhdW5jaCB3aGVuIHlvdSB0cmlnZ2VyIEVWRU5ULlJFQURZVE9ERVNUUk9ZIGluIHlvdXIgdHJhbnNpdGlvbiAtPiBkaXNwbGF5VmlldygpLCBhdCB0aGUgZW5kXG4gICAgICogQHJldHVybiB2b2lkXG4gICAgICovXG4gICAgcmVpbml0KCkge1xuICAgICAgICB0aGlzLnRyYW5zaXRpb24uZGVzdHJveSgpO1xuICAgICAgICAkaHRtbC5hdHRyKCdkYXRhLXRyYW5zaXRpb24nLCcnKTtcbiAgICAgICAgdGhpcy50cmFuc2l0aW9uID0gbmV3IHRyYW5zaXRpb25zWydCYXNlVHJhbnNpdGlvbiddKHtcbiAgICAgICAgICAgIHdyYXBwZXI6IHRoaXMud3JhcHBlclxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBET00gaXMgbG9hZGVkXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAqL1xuICAgIGxvYWQoKSB7XG4gICAgICAgICRodG1sLmFkZENsYXNzKCdoYXMtZG9tLWxvYWRlZCcpO1xuICAgICAgICAkaHRtbC5yZW1vdmVDbGFzcygnaGFzLWRvbS1sb2FkaW5nJyk7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgJGh0bWwuYWRkQ2xhc3MoJ2hhcy1kb20tYW5pbWF0ZWQnKTtcbiAgICAgICAgfSwgMTAwMClcbiAgICB9XG59XG4iLCJleHBvcnQge2RlZmF1bHQgYXMgQmFzZVRyYW5zaXRpb259IGZyb20gJy4vQmFzZVRyYW5zaXRpb24nO1xuZXhwb3J0IHtkZWZhdWx0IGFzIEN1c3RvbVRyYW5zaXRpb259IGZyb20gJy4vQ3VzdG9tVHJhbnNpdGlvbic7XG4iLCJpbXBvcnQgeyBpc0FycmF5IH0gZnJvbSAnLi9pcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBhZGRUb0FycmF5ICggYXJyYXksIHZhbHVlICkge1xuICAgIGNvbnN0IGluZGV4ID0gYXJyYXkuaW5kZXhPZiggdmFsdWUgKTtcblxuICAgIGlmICggaW5kZXggPT09IC0xICkge1xuICAgICAgICBhcnJheS5wdXNoKCB2YWx1ZSApO1xuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFycmF5Q29udGFpbnMgKCBhcnJheSwgdmFsdWUgKSB7XG4gICAgZm9yICggbGV0IGkgPSAwLCBjID0gYXJyYXkubGVuZ3RoOyBpIDwgYzsgaSsrICkge1xuICAgICAgICBpZiAoIGFycmF5W2ldID09IHZhbHVlICkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhcnJheUNvbnRlbnRzTWF0Y2ggKCBhLCBiICkge1xuICAgIGxldCBpO1xuXG4gICAgaWYgKCAhaXNBcnJheSggYSApIHx8ICFpc0FycmF5KCBiICkgKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoIGEubGVuZ3RoICE9PSBiLmxlbmd0aCApIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGkgPSBhLmxlbmd0aDtcbiAgICB3aGlsZSAoIGktLSApIHtcbiAgICAgICAgaWYgKCBhW2ldICE9PSBiW2ldICkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBlbnN1cmVBcnJheSAoIHggKSB7XG4gICAgaWYgKCB0eXBlb2YgeCA9PT0gJ3N0cmluZycgKSB7XG4gICAgICAgIHJldHVybiBbIHggXTtcbiAgICB9XG5cbiAgICBpZiAoIHggPT09IHVuZGVmaW5lZCApIHtcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIHJldHVybiB4O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbGFzdEl0ZW0gKCBhcnJheSApIHtcbiAgICByZXR1cm4gYXJyYXlbIGFycmF5Lmxlbmd0aCAtIDEgXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZUZyb21BcnJheSAoIGFycmF5LCBtZW1iZXIgKSB7XG4gICAgaWYgKCAhYXJyYXkgKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBpbmRleCA9IGFycmF5LmluZGV4T2YoIG1lbWJlciApO1xuXG4gICAgaWYgKCBpbmRleCAhPT0gLTEgKSB7XG4gICAgICAgIGFycmF5LnNwbGljZSggaW5kZXgsIDEgKTtcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0b0FycmF5ICggYXJyYXlMaWtlICkge1xuICAgIGNvbnN0IGFycmF5ID0gW107XG4gICAgbGV0IGkgPSBhcnJheUxpa2UubGVuZ3RoO1xuICAgIHdoaWxlICggaS0tICkge1xuICAgICAgICBhcnJheVtpXSA9IGFycmF5TGlrZVtpXTtcbiAgICB9XG5cbiAgICByZXR1cm4gYXJyYXk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaW5kQnlLZXlWYWx1ZSggYXJyYXksIGtleSwgdmFsdWUgKSB7XG4gICAgcmV0dXJuIGFycmF5LmZpbHRlcihmdW5jdGlvbiggb2JqICkge1xuICAgICAgICByZXR1cm4gb2JqW2tleV0gPT09IHZhbHVlO1xuICAgIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY2xvbmVBcnJheSggYXJyYXkgKSB7XG4gICAgcmV0dXJuIEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoYXJyYXkpKTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGZ1bmMsIHdhaXQsIGltbWVkaWF0ZSkge1xuICAgIGxldCB0aW1lb3V0O1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc3QgY29udGV4dCA9IHRoaXM7XG4gICAgICAgIGNvbnN0IGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICAgIGNvbnN0IGxhdGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgICAgICAgIGlmICghaW1tZWRpYXRlKSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgICAgICB9O1xuICAgICAgICBjb25zdCBjYWxsTm93ID0gaW1tZWRpYXRlICYmICF0aW1lb3V0O1xuICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCB3YWl0KTtcbiAgICAgICAgaWYgKGNhbGxOb3cpIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgfTtcbn1cbiIsImNvbnN0IEFQUF9OQU1FICAgICA9ICdCb2lsZXJwbGF0ZSc7XG5jb25zdCBEQVRBX0FQSV9LRVkgPSAnLmRhdGEtYXBpJztcblxuY29uc3QgJGRvY3VtZW50ICAgID0gJChkb2N1bWVudCk7XG5jb25zdCAkd2luZG93ICAgICAgPSAkKHdpbmRvdyk7XG5jb25zdCAkaHRtbCAgICAgICAgPSAkKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkucmVtb3ZlQ2xhc3MoJ2hhcy1uby1qcycpLmFkZENsYXNzKCdoYXMtanMnKTtcbmNvbnN0ICRib2R5ICAgICAgICA9ICQoZG9jdW1lbnQuYm9keSk7XG5jb25zdCAkcGpheFdyYXBwZXIgPSAkKCcjanMtcGpheC13cmFwcGVyJyk7XG5cbmNvbnN0IGlzRGVidWcgICAgICA9ICEhJGh0bWwuZGF0YSgnZGVidWcnKTtcblxuZXhwb3J0IHsgQVBQX05BTUUsIERBVEFfQVBJX0tFWSwgJGRvY3VtZW50LCAkd2luZG93LCAkaHRtbCwgJGJvZHksIGlzRGVidWcsICRwamF4V3JhcHBlciB9O1xuIiwiLyoqXG4gKiBAc2VlICBodHRwczovL2dpdGh1Yi5jb20vcmFjdGl2ZWpzL3JhY3RpdmUvYmxvYi9kZXYvc3JjL3V0aWxzL2h0bWwuanNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGVzY2FwZUh0bWwoc3RyKSB7XG4gICAgcmV0dXJuIHN0clxuICAgICAgICAucmVwbGFjZSgvJi9nLCAnJmFtcDsnKVxuICAgICAgICAucmVwbGFjZSgvPC9nLCAnJmx0OycpXG4gICAgICAgIC5yZXBsYWNlKC8+L2csICcmZ3Q7Jyk7XG59XG5cbi8qKlxuICogUHJlcGFyZSBIVE1MIGNvbnRlbnQgdGhhdCBjb250YWlucyBtdXN0YWNoZSBjaGFyYWN0ZXJzIGZvciB1c2Ugd2l0aCBSYWN0aXZlXG4gKiBAcGFyYW0gIHtzdHJpbmd9IHN0clxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5leHBvcnQgZnVuY3Rpb24gdW5lc2NhcGVIdG1sKHN0cikge1xuICAgIHJldHVybiBzdHJcbiAgICAgICAgLnJlcGxhY2UoLyZsdDsvZywgJzwnKVxuICAgICAgICAucmVwbGFjZSgvJmd0Oy9nLCAnPicpXG4gICAgICAgIC5yZXBsYWNlKC8mYW1wOy9nLCAnJicpO1xufVxuXG4vKipcbiAqIEdldCBlbGVtZW50IGRhdGEgYXR0cmlidXRlc1xuICogQHBhcmFtICAge0RPTUVsZW1lbnR9ICBub2RlXG4gKiBAcmV0dXJuICB7QXJyYXl9ICAgICAgIGRhdGFcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldE5vZGVEYXRhKG5vZGUpIHtcbiAgICAvLyBBbGwgYXR0cmlidXRlc1xuICAgIGNvbnN0IGF0dHJpYnV0ZXMgPSBub2RlLmF0dHJpYnV0ZXM7XG5cbiAgICAvLyBSZWdleCBQYXR0ZXJuXG4gICAgY29uc3QgcGF0dGVybiA9IC9eZGF0YVxcLSguKykkLztcblxuICAgIC8vIE91dHB1dFxuICAgIGNvbnN0IGRhdGEgPSB7fTtcblxuICAgIGZvciAobGV0IGkgaW4gYXR0cmlidXRlcykge1xuICAgICAgICBpZiAoIWF0dHJpYnV0ZXNbaV0pIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQXR0cmlidXRlcyBuYW1lIChleDogZGF0YS1tb2R1bGUpXG4gICAgICAgIGxldCBuYW1lID0gYXR0cmlidXRlc1tpXS5uYW1lO1xuXG4gICAgICAgIC8vIFRoaXMgaGFwcGVucy5cbiAgICAgICAgaWYgKCFuYW1lKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBtYXRjaCA9IG5hbWUubWF0Y2gocGF0dGVybik7XG4gICAgICAgIGlmICghbWF0Y2gpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgdGhpcyB0aHJvd3MgYW4gZXJyb3IsIHlvdSBoYXZlIHNvbWVcbiAgICAgICAgLy8gc2VyaW91cyBwcm9ibGVtcyBpbiB5b3VyIEhUTUwuXG4gICAgICAgIGRhdGFbbWF0Y2hbMV1dID0gZ2V0RGF0YShub2RlLmdldEF0dHJpYnV0ZShuYW1lKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRhdGE7XG59XG5cbmNvbnN0IHJicmFjZSA9IC9eKD86XFx7W1xcd1xcV10qXFx9fFxcW1tcXHdcXFddKlxcXSkkLztcblxuLyoqXG4gKiBQYXJzZSB2YWx1ZSB0byBkYXRhIHR5cGUuXG4gKlxuICogQGxpbmsgICBodHRwczovL2dpdGh1Yi5jb20vanF1ZXJ5L2pxdWVyeS9ibG9iLzMuMS4xL3NyYy9kYXRhLmpzXG4gKiBAcGFyYW0gIHtzdHJpbmd9IGRhdGEgLSBBIHZhbHVlIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJuIHttaXhlZH0gIFJldHVybnMgdGhlIHZhbHVlIGluIGl0cyBuYXR1cmFsIGRhdGEgdHlwZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldERhdGEoZGF0YSkge1xuICAgIGlmIChkYXRhID09PSAndHJ1ZScpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgaWYgKGRhdGEgPT09ICdmYWxzZScpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmIChkYXRhID09PSAnbnVsbCcpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLy8gT25seSBjb252ZXJ0IHRvIGEgbnVtYmVyIGlmIGl0IGRvZXNuJ3QgY2hhbmdlIHRoZSBzdHJpbmdcbiAgICBpZiAoZGF0YSA9PT0gK2RhdGErJycpIHtcbiAgICAgICAgcmV0dXJuICtkYXRhO1xuICAgIH1cblxuICAgIGlmIChyYnJhY2UudGVzdCggZGF0YSApKSB7XG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKCBkYXRhICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRhdGE7XG59XG4iLCJjb25zdCB0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG5jb25zdCBhcnJheUxpa2VQYXR0ZXJuID0gL15cXFtvYmplY3QgKD86QXJyYXl8RmlsZUxpc3QpXFxdJC87XG5cbi8vIHRoYW5rcywgaHR0cDovL3BlcmZlY3Rpb25raWxscy5jb20vaW5zdGFuY2VvZi1jb25zaWRlcmVkLWhhcm1mdWwtb3ItaG93LXRvLXdyaXRlLWEtcm9idXN0LWlzYXJyYXkvXG5leHBvcnQgZnVuY3Rpb24gaXNBcnJheSAoIHRoaW5nICkge1xuICAgIHJldHVybiB0b1N0cmluZy5jYWxsKCB0aGluZyApID09PSAnW29iamVjdCBBcnJheV0nO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNBcnJheUxpa2UgKCBvYmogKSB7XG4gICAgcmV0dXJuIGFycmF5TGlrZVBhdHRlcm4udGVzdCggdG9TdHJpbmcuY2FsbCggb2JqICkgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzRXF1YWwgKCBhLCBiICkge1xuICAgIGlmICggYSA9PT0gbnVsbCAmJiBiID09PSBudWxsICkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoIHR5cGVvZiBhID09PSAnb2JqZWN0JyB8fCB0eXBlb2YgYiA9PT0gJ29iamVjdCcgKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gYSA9PT0gYjtcbn1cblxuLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xODA4Mi92YWxpZGF0ZS1udW1iZXJzLWluLWphdmFzY3JpcHQtaXNudW1lcmljXG5leHBvcnQgZnVuY3Rpb24gaXNOdW1lcmljICggdGhpbmcgKSB7XG4gICAgcmV0dXJuICFpc05hTiggcGFyc2VGbG9hdCggdGhpbmcgKSApICYmIGlzRmluaXRlKCB0aGluZyApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNPYmplY3QgKCB0aGluZyApIHtcbiAgICByZXR1cm4gKCB0aGluZyAmJiB0b1N0cmluZy5jYWxsKCB0aGluZyApID09PSAnW29iamVjdCBPYmplY3RdJyApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNGdW5jdGlvbiggdGhpbmcgKSB7XG4gICAgY29uc3QgZ2V0VHlwZSA9IHt9O1xuICAgIHJldHVybiB0aGluZyAmJiBnZXRUeXBlLnRvU3RyaW5nLmNhbGwodGhpbmcpID09PSAnW29iamVjdCBGdW5jdGlvbl0nO1xufVxuIiwidmFyIGV4ZWN1dGVTY3JpcHRzID0gcmVxdWlyZShcIi4vbGliL2V4ZWN1dGUtc2NyaXB0cy5qc1wiKVxyXG52YXIgZm9yRWFjaEVscyA9IHJlcXVpcmUoXCIuL2xpYi9mb3JlYWNoLWVscy5qc1wiKVxyXG52YXIgcGFyc2VPcHRpb25zID0gcmVxdWlyZShcIi4vbGliL3BhcnNlLW9wdGlvbnMuanNcIilcclxudmFyIHN3aXRjaGVzID0gcmVxdWlyZShcIi4vbGliL3N3aXRjaGVzXCIpXHJcbnZhciBuZXdVaWQgPSByZXF1aXJlKFwiLi9saWIvdW5pcXVlaWQuanNcIilcclxuXHJcbnZhciBvbiA9IHJlcXVpcmUoXCIuL2xpYi9ldmVudHMvb24uanNcIilcclxudmFyIHRyaWdnZXIgPSByZXF1aXJlKFwiLi9saWIvZXZlbnRzL3RyaWdnZXIuanNcIilcclxuXHJcbnZhciBjbG9uZSA9IHJlcXVpcmUoXCIuL2xpYi91dGlsL2Nsb25lLmpzXCIpXHJcbnZhciBjb250YWlucyA9IHJlcXVpcmUoXCIuL2xpYi91dGlsL2NvbnRhaW5zLmpzXCIpXHJcbnZhciBleHRlbmQgPSByZXF1aXJlKFwiLi9saWIvdXRpbC9leHRlbmQuanNcIilcclxudmFyIG5vb3AgPSByZXF1aXJlKFwiLi9saWIvdXRpbC9ub29wXCIpXHJcblxyXG52YXIgUGpheCA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcclxuICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgIG51bVBlbmRpbmdTd2l0Y2hlczogMCxcclxuICAgICAgaHJlZjogbnVsbCxcclxuICAgICAgb3B0aW9uczogbnVsbFxyXG4gICAgfVxyXG5cclxuXHJcbiAgICB0aGlzLm9wdGlvbnMgPSBwYXJzZU9wdGlvbnMob3B0aW9ucylcclxuICAgIHRoaXMubG9nKFwiUGpheCBvcHRpb25zXCIsIHRoaXMub3B0aW9ucylcclxuXHJcbiAgICBpZiAodGhpcy5vcHRpb25zLnNjcm9sbFJlc3RvcmF0aW9uICYmIFwic2Nyb2xsUmVzdG9yYXRpb25cIiBpbiBoaXN0b3J5KSB7XHJcbiAgICAgIGhpc3Rvcnkuc2Nyb2xsUmVzdG9yYXRpb24gPSBcIm1hbnVhbFwiXHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5tYXhVaWQgPSB0aGlzLmxhc3RVaWQgPSBuZXdVaWQoKVxyXG5cclxuICAgIHRoaXMucGFyc2VET00oZG9jdW1lbnQpXHJcblxyXG4gICAgb24od2luZG93LCBcInBvcHN0YXRlXCIsIGZ1bmN0aW9uKHN0KSB7XHJcbiAgICAgIGlmIChzdC5zdGF0ZSkge1xyXG4gICAgICAgIHZhciBvcHQgPSBjbG9uZSh0aGlzLm9wdGlvbnMpXHJcbiAgICAgICAgb3B0LnVybCA9IHN0LnN0YXRlLnVybFxyXG4gICAgICAgIG9wdC50aXRsZSA9IHN0LnN0YXRlLnRpdGxlXHJcbiAgICAgICAgLy8gU2luY2Ugc3RhdGUgYWxyZWFkeSBleGlzdHMsIHByZXZlbnQgaXQgZnJvbSBiZWluZyBwdXNoZWQgYWdhaW5cclxuICAgICAgICBvcHQuaGlzdG9yeSA9IGZhbHNlXHJcbiAgICAgICAgb3B0LnNjcm9sbFBvcyA9IHN0LnN0YXRlLnNjcm9sbFBvc1xyXG4gICAgICAgIGlmIChzdC5zdGF0ZS51aWQgPCB0aGlzLmxhc3RVaWQpIHtcclxuICAgICAgICAgIG9wdC5iYWNrd2FyZCA9IHRydWVcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICBvcHQuZm9yd2FyZCA9IHRydWVcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5sYXN0VWlkID0gc3Quc3RhdGUudWlkXHJcblxyXG4gICAgICAgIC8vIEB0b2RvIGltcGxlbWVudCBoaXN0b3J5IGNhY2hlIGhlcmUsIGJhc2VkIG9uIHVpZFxyXG4gICAgICAgIHRoaXMubG9hZFVybChzdC5zdGF0ZS51cmwsIG9wdClcclxuICAgICAgfVxyXG4gICAgfS5iaW5kKHRoaXMpKVxyXG4gIH1cclxuXHJcblBqYXguc3dpdGNoZXMgPSBzd2l0Y2hlc1xyXG5cclxuUGpheC5wcm90b3R5cGUgPSB7XHJcbiAgbG9nOiByZXF1aXJlKFwiLi9saWIvcHJvdG8vbG9nLmpzXCIpLFxyXG5cclxuICBnZXRFbGVtZW50czogZnVuY3Rpb24oZWwpIHtcclxuICAgIHJldHVybiBlbC5xdWVyeVNlbGVjdG9yQWxsKHRoaXMub3B0aW9ucy5lbGVtZW50cylcclxuICB9LFxyXG5cclxuICBwYXJzZURPTTogZnVuY3Rpb24oZWwpIHtcclxuICAgIHZhciBwYXJzZUVsZW1lbnQgPSByZXF1aXJlKFwiLi9saWIvcHJvdG8vcGFyc2UtZWxlbWVudFwiKVxyXG4gICAgZm9yRWFjaEVscyh0aGlzLmdldEVsZW1lbnRzKGVsKSwgcGFyc2VFbGVtZW50LCB0aGlzKVxyXG4gIH0sXHJcblxyXG4gIHJlZnJlc2g6IGZ1bmN0aW9uKGVsKSB7XHJcbiAgICB0aGlzLnBhcnNlRE9NKGVsIHx8IGRvY3VtZW50KVxyXG4gIH0sXHJcblxyXG4gIHJlbG9hZDogZnVuY3Rpb24oKSB7XHJcbiAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKClcclxuICB9LFxyXG5cclxuICBhdHRhY2hMaW5rOiByZXF1aXJlKFwiLi9saWIvcHJvdG8vYXR0YWNoLWxpbmsuanNcIiksXHJcblxyXG4gIGF0dGFjaEZvcm06IHJlcXVpcmUoXCIuL2xpYi9wcm90by9hdHRhY2gtZm9ybS5qc1wiKSxcclxuXHJcbiAgZm9yRWFjaFNlbGVjdG9yczogZnVuY3Rpb24oY2IsIGNvbnRleHQsIERPTWNvbnRleHQpIHtcclxuICAgIHJldHVybiByZXF1aXJlKFwiLi9saWIvZm9yZWFjaC1zZWxlY3RvcnMuanNcIikuYmluZCh0aGlzKSh0aGlzLm9wdGlvbnMuc2VsZWN0b3JzLCBjYiwgY29udGV4dCwgRE9NY29udGV4dClcclxuICB9LFxyXG5cclxuICBzd2l0Y2hTZWxlY3RvcnM6IGZ1bmN0aW9uKHNlbGVjdG9ycywgZnJvbUVsLCB0b0VsLCBvcHRpb25zKSB7XHJcbiAgICByZXR1cm4gcmVxdWlyZShcIi4vbGliL3N3aXRjaGVzLXNlbGVjdG9ycy5qc1wiKS5iaW5kKHRoaXMpKHRoaXMub3B0aW9ucy5zd2l0Y2hlcywgdGhpcy5vcHRpb25zLnN3aXRjaGVzT3B0aW9ucywgc2VsZWN0b3JzLCBmcm9tRWwsIHRvRWwsIG9wdGlvbnMpXHJcbiAgfSxcclxuXHJcbiAgbGF0ZXN0Q2hhbmNlOiBmdW5jdGlvbihocmVmKSB7XHJcbiAgICB3aW5kb3cubG9jYXRpb24gPSBocmVmXHJcbiAgfSxcclxuXHJcbiAgb25Td2l0Y2g6IGZ1bmN0aW9uKCkge1xyXG4gICAgdHJpZ2dlcih3aW5kb3csIFwicmVzaXplIHNjcm9sbFwiKVxyXG5cclxuICAgIHRoaXMuc3RhdGUubnVtUGVuZGluZ1N3aXRjaGVzLS1cclxuXHJcbiAgICAvLyBkZWJvdW5jZSBjYWxscywgc28gd2Ugb25seSBydW4gdGhpcyBvbmNlIGFmdGVyIGFsbCBzd2l0Y2hlcyBhcmUgZmluaXNoZWQuXHJcbiAgICBpZiAodGhpcy5zdGF0ZS5udW1QZW5kaW5nU3dpdGNoZXMgPT09IDApIHtcclxuICAgICAgdGhpcy5hZnRlckFsbFN3aXRjaGVzKClcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBsb2FkQ29udGVudDogZnVuY3Rpb24oaHRtbCwgb3B0aW9ucykge1xyXG4gICAgdmFyIHRtcEVsID0gZG9jdW1lbnQuaW1wbGVtZW50YXRpb24uY3JlYXRlSFRNTERvY3VtZW50KFwicGpheFwiKVxyXG5cclxuICAgIC8vIHBhcnNlIEhUTUwgYXR0cmlidXRlcyB0byBjb3B5IHRoZW1cclxuICAgIC8vIHNpbmNlIHdlIGFyZSBmb3JjZWQgdG8gdXNlIGRvY3VtZW50RWxlbWVudC5pbm5lckhUTUwgKG91dGVySFRNTCBjYW4ndCBiZSB1c2VkIGZvciA8aHRtbD4pXHJcbiAgICB2YXIgaHRtbFJlZ2V4ID0gLzxodG1sW14+XSs+L2dpXHJcbiAgICB2YXIgaHRtbEF0dHJpYnNSZWdleCA9IC9cXHM/W2EtejpdKyg/OlxcPSg/OlxcJ3xcXFwiKVteXFwnXFxcIj5dKyg/OlxcJ3xcXFwiKSkqL2dpXHJcbiAgICB2YXIgbWF0Y2hlcyA9IGh0bWwubWF0Y2goaHRtbFJlZ2V4KVxyXG4gICAgaWYgKG1hdGNoZXMgJiYgbWF0Y2hlcy5sZW5ndGgpIHtcclxuICAgICAgbWF0Y2hlcyA9IG1hdGNoZXNbMF0ubWF0Y2goaHRtbEF0dHJpYnNSZWdleClcclxuICAgICAgaWYgKG1hdGNoZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgbWF0Y2hlcy5zaGlmdCgpXHJcbiAgICAgICAgbWF0Y2hlcy5mb3JFYWNoKGZ1bmN0aW9uKGh0bWxBdHRyaWIpIHtcclxuICAgICAgICAgIHZhciBhdHRyID0gaHRtbEF0dHJpYi50cmltKCkuc3BsaXQoXCI9XCIpXHJcbiAgICAgICAgICBpZiAoYXR0ci5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgdG1wRWwuZG9jdW1lbnRFbGVtZW50LnNldEF0dHJpYnV0ZShhdHRyWzBdLCB0cnVlKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRtcEVsLmRvY3VtZW50RWxlbWVudC5zZXRBdHRyaWJ1dGUoYXR0clswXSwgYXR0clsxXS5zbGljZSgxLCAtMSkpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRtcEVsLmRvY3VtZW50RWxlbWVudC5pbm5lckhUTUwgPSBodG1sXHJcbiAgICB0aGlzLmxvZyhcImxvYWQgY29udGVudFwiLCB0bXBFbC5kb2N1bWVudEVsZW1lbnQuYXR0cmlidXRlcywgdG1wRWwuZG9jdW1lbnRFbGVtZW50LmlubmVySFRNTC5sZW5ndGgpXHJcblxyXG4gICAgLy8gQ2xlYXIgb3V0IGFueSBmb2N1c2VkIGNvbnRyb2xzIGJlZm9yZSBpbnNlcnRpbmcgbmV3IHBhZ2UgY29udGVudHMuXHJcbiAgICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCAmJiBjb250YWlucyhkb2N1bWVudCwgdGhpcy5vcHRpb25zLnNlbGVjdG9ycywgZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkpIHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBkb2N1bWVudC5hY3RpdmVFbGVtZW50LmJsdXIoKVxyXG4gICAgICB9IGNhdGNoIChlKSB7IH1cclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnN3aXRjaFNlbGVjdG9ycyh0aGlzLm9wdGlvbnMuc2VsZWN0b3JzLCB0bXBFbCwgZG9jdW1lbnQsIG9wdGlvbnMpXHJcbiAgfSxcclxuXHJcbiAgYWJvcnRSZXF1ZXN0OiByZXF1aXJlKFwiLi9saWIvYWJvcnQtcmVxdWVzdC5qc1wiKSxcclxuXHJcbiAgZG9SZXF1ZXN0OiByZXF1aXJlKFwiLi9saWIvc2VuZC1yZXF1ZXN0LmpzXCIpLFxyXG5cclxuICBoYW5kbGVSZXNwb25zZTogcmVxdWlyZShcIi4vbGliL3Byb3RvL2hhbmRsZS1yZXNwb25zZS5qc1wiKSxcclxuXHJcbiAgbG9hZFVybDogZnVuY3Rpb24oaHJlZiwgb3B0aW9ucykge1xyXG4gICAgb3B0aW9ucyA9IHR5cGVvZiBvcHRpb25zID09PSBcIm9iamVjdFwiID9cclxuICAgICAgZXh0ZW5kKHt9LCB0aGlzLm9wdGlvbnMsIG9wdGlvbnMpIDpcclxuICAgICAgY2xvbmUodGhpcy5vcHRpb25zKVxyXG5cclxuICAgIHRoaXMubG9nKFwibG9hZCBocmVmXCIsIGhyZWYsIG9wdGlvbnMpXHJcblxyXG4gICAgLy8gQWJvcnQgYW55IHByZXZpb3VzIHJlcXVlc3RcclxuICAgIHRoaXMuYWJvcnRSZXF1ZXN0KHRoaXMucmVxdWVzdClcclxuXHJcbiAgICB0cmlnZ2VyKGRvY3VtZW50LCBcInBqYXg6c2VuZFwiLCBvcHRpb25zKVxyXG5cclxuICAgIC8vIERvIHRoZSByZXF1ZXN0XHJcbiAgICB0aGlzLnJlcXVlc3QgPSB0aGlzLmRvUmVxdWVzdChocmVmLCBvcHRpb25zLCB0aGlzLmhhbmRsZVJlc3BvbnNlLmJpbmQodGhpcykpXHJcbiAgfSxcclxuXHJcbiAgYWZ0ZXJBbGxTd2l0Y2hlczogZnVuY3Rpb24oKSB7XHJcbiAgICAvLyBGRiBidWc6IFdvbuKAmXQgYXV0b2ZvY3VzIGZpZWxkcyB0aGF0IGFyZSBpbnNlcnRlZCB2aWEgSlMuXHJcbiAgICAvLyBUaGlzIGJlaGF2aW9yIGlzIGluY29ycmVjdC4gU28gaWYgdGhlcmVzIG5vIGN1cnJlbnQgZm9jdXMsIGF1dG9mb2N1c1xyXG4gICAgLy8gdGhlIGxhc3QgZmllbGQuXHJcbiAgICAvL1xyXG4gICAgLy8gaHR0cDovL3d3dy53My5vcmcvaHRtbC93Zy9kcmFmdHMvaHRtbC9tYXN0ZXIvZm9ybXMuaHRtbFxyXG4gICAgdmFyIGF1dG9mb2N1c0VsID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIlthdXRvZm9jdXNdXCIpKS5wb3AoKVxyXG4gICAgaWYgKGF1dG9mb2N1c0VsICYmIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgIT09IGF1dG9mb2N1c0VsKSB7XHJcbiAgICAgIGF1dG9mb2N1c0VsLmZvY3VzKClcclxuICAgIH1cclxuXHJcbiAgICAvLyBleGVjdXRlIHNjcmlwdHMgd2hlbiBET00gaGF2ZSBiZWVuIGNvbXBsZXRlbHkgdXBkYXRlZFxyXG4gICAgdGhpcy5vcHRpb25zLnNlbGVjdG9ycy5mb3JFYWNoKGZ1bmN0aW9uKHNlbGVjdG9yKSB7XHJcbiAgICAgIGZvckVhY2hFbHMoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvciksIGZ1bmN0aW9uKGVsKSB7XHJcbiAgICAgICAgZXhlY3V0ZVNjcmlwdHMoZWwpXHJcbiAgICAgIH0pXHJcbiAgICB9KVxyXG5cclxuICAgIHZhciBzdGF0ZSA9IHRoaXMuc3RhdGVcclxuXHJcbiAgICBpZiAoc3RhdGUub3B0aW9ucy5oaXN0b3J5KSB7XHJcbiAgICAgIGlmICghd2luZG93Lmhpc3Rvcnkuc3RhdGUpIHtcclxuICAgICAgICB0aGlzLmxhc3RVaWQgPSB0aGlzLm1heFVpZCA9IG5ld1VpZCgpXHJcbiAgICAgICAgd2luZG93Lmhpc3RvcnkucmVwbGFjZVN0YXRlKHtcclxuICAgICAgICAgICAgdXJsOiB3aW5kb3cubG9jYXRpb24uaHJlZixcclxuICAgICAgICAgICAgdGl0bGU6IGRvY3VtZW50LnRpdGxlLFxyXG4gICAgICAgICAgICB1aWQ6IHRoaXMubWF4VWlkLFxyXG4gICAgICAgICAgICBzY3JvbGxQb3M6IFswLCAwXVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGRvY3VtZW50LnRpdGxlKVxyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBVcGRhdGUgYnJvd3NlciBoaXN0b3J5XHJcbiAgICAgIHRoaXMubGFzdFVpZCA9IHRoaXMubWF4VWlkID0gbmV3VWlkKClcclxuXHJcbiAgICAgIHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSh7XHJcbiAgICAgICAgICB1cmw6IHN0YXRlLmhyZWYsXHJcbiAgICAgICAgICB0aXRsZTogc3RhdGUub3B0aW9ucy50aXRsZSxcclxuICAgICAgICAgIHVpZDogdGhpcy5tYXhVaWQsXHJcbiAgICAgICAgICBzY3JvbGxQb3M6IFswLCAwXVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc3RhdGUub3B0aW9ucy50aXRsZSxcclxuICAgICAgICBzdGF0ZS5ocmVmKVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZm9yRWFjaFNlbGVjdG9ycyhmdW5jdGlvbihlbCkge1xyXG4gICAgICB0aGlzLnBhcnNlRE9NKGVsKVxyXG4gICAgfSwgdGhpcylcclxuXHJcbiAgICAvLyBGaXJlIEV2ZW50c1xyXG4gICAgdHJpZ2dlcihkb2N1bWVudCxcInBqYXg6Y29tcGxldGUgcGpheDpzdWNjZXNzXCIsIHN0YXRlLm9wdGlvbnMpXHJcblxyXG4gICAgaWYgKHR5cGVvZiBzdGF0ZS5vcHRpb25zLmFuYWx5dGljcyA9PT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgIHN0YXRlLm9wdGlvbnMuYW5hbHl0aWNzKClcclxuICAgIH1cclxuXHJcbiAgICBpZiAoc3RhdGUub3B0aW9ucy5oaXN0b3J5KSB7XHJcbiAgICAgIC8vIEZpcnN0IHBhcnNlIHVybCBhbmQgY2hlY2sgZm9yIGhhc2ggdG8gb3ZlcnJpZGUgc2Nyb2xsXHJcbiAgICAgIHZhciBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIilcclxuICAgICAgYS5ocmVmID0gdGhpcy5zdGF0ZS5ocmVmXHJcbiAgICAgIGlmIChhLmhhc2gpIHtcclxuICAgICAgICB2YXIgbmFtZSA9IGEuaGFzaC5zbGljZSgxKVxyXG4gICAgICAgIG5hbWUgPSBkZWNvZGVVUklDb21wb25lbnQobmFtZSlcclxuXHJcbiAgICAgICAgdmFyIGN1cnRvcCA9IDBcclxuICAgICAgICB2YXIgdGFyZ2V0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQobmFtZSkgfHwgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeU5hbWUobmFtZSlbMF1cclxuICAgICAgICBpZiAodGFyZ2V0KSB7XHJcbiAgICAgICAgICAvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzgxMTEwOTQvY3Jvc3MtYnJvd3Nlci1qYXZhc2NyaXB0LWZ1bmN0aW9uLXRvLWZpbmQtYWN0dWFsLXBvc2l0aW9uLW9mLWFuLWVsZW1lbnQtaW4tcGFnZVxyXG4gICAgICAgICAgaWYgKHRhcmdldC5vZmZzZXRQYXJlbnQpIHtcclxuICAgICAgICAgICAgZG8ge1xyXG4gICAgICAgICAgICAgIGN1cnRvcCArPSB0YXJnZXQub2Zmc2V0VG9wXHJcblxyXG4gICAgICAgICAgICAgIHRhcmdldCA9IHRhcmdldC5vZmZzZXRQYXJlbnRcclxuICAgICAgICAgICAgfSB3aGlsZSAodGFyZ2V0KVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB3aW5kb3cuc2Nyb2xsVG8oMCwgY3VydG9wKVxyXG4gICAgICB9XHJcbiAgICAgIGVsc2UgaWYgKHN0YXRlLm9wdGlvbnMuc2Nyb2xsVG8gIT09IGZhbHNlKSB7XHJcbiAgICAgICAgLy8gU2Nyb2xsIHBhZ2UgdG8gdG9wIG9uIG5ldyBwYWdlIGxvYWRcclxuICAgICAgICBpZiAoc3RhdGUub3B0aW9ucy5zY3JvbGxUby5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgICB3aW5kb3cuc2Nyb2xsVG8oc3RhdGUub3B0aW9ucy5zY3JvbGxUb1swXSwgc3RhdGUub3B0aW9ucy5zY3JvbGxUb1sxXSlcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICB3aW5kb3cuc2Nyb2xsVG8oMCwgc3RhdGUub3B0aW9ucy5zY3JvbGxUbylcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHN0YXRlLm9wdGlvbnMuc2Nyb2xsUmVzdG9yYXRpb24gJiYgc3RhdGUub3B0aW9ucy5zY3JvbGxQb3MpIHtcclxuICAgICAgd2luZG93LnNjcm9sbFRvKHN0YXRlLm9wdGlvbnMuc2Nyb2xsUG9zWzBdLCBzdGF0ZS5vcHRpb25zLnNjcm9sbFBvc1sxXSlcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnN0YXRlID0ge1xyXG4gICAgICBudW1QZW5kaW5nU3dpdGNoZXM6IDAsXHJcbiAgICAgIGhyZWY6IG51bGwsXHJcbiAgICAgIG9wdGlvbnM6IG51bGxcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcblBqYXguaXNTdXBwb3J0ZWQgPSByZXF1aXJlKFwiLi9saWIvaXMtc3VwcG9ydGVkLmpzXCIpXHJcblxyXG4vLyBhcmd1YWJseSBjb3VsZCBkbyBgaWYoIHJlcXVpcmUoXCIuL2xpYi9pcy1zdXBwb3J0ZWQuanNcIikoKSkge2AgYnV0IHRoYXQgbWlnaHQgYmUgYSBsaXR0bGUgdG8gc2ltcGxlXHJcbmlmIChQamF4LmlzU3VwcG9ydGVkKCkpIHtcclxuICBtb2R1bGUuZXhwb3J0cyA9IFBqYXhcclxufVxyXG4vLyBpZiB0aGVyZSBpc27igJl0IHJlcXVpcmVkIGJyb3dzZXIgZnVuY3Rpb25zLCByZXR1cm5pbmcgc3R1cGlkIGFwaVxyXG5lbHNlIHtcclxuICB2YXIgc3R1cGlkUGpheCA9IG5vb3BcclxuICBmb3IgKHZhciBrZXkgaW4gUGpheC5wcm90b3R5cGUpIHtcclxuICAgIGlmIChQamF4LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eShrZXkpICYmIHR5cGVvZiBQamF4LnByb3RvdHlwZVtrZXldID09PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgc3R1cGlkUGpheFtrZXldID0gbm9vcFxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbW9kdWxlLmV4cG9ydHMgPSBzdHVwaWRQamF4XHJcbn1cclxuIiwidmFyIG5vb3AgPSByZXF1aXJlKFwiLi91dGlsL25vb3BcIilcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ocmVxdWVzdCkge1xyXG4gIGlmIChyZXF1ZXN0ICYmIHJlcXVlc3QucmVhZHlTdGF0ZSA8IDQpIHtcclxuICAgIHJlcXVlc3Qub25yZWFkeXN0YXRlY2hhbmdlID0gbm9vcFxyXG4gICAgcmVxdWVzdC5hYm9ydCgpXHJcbiAgfVxyXG59XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZWwpIHtcclxuICB2YXIgY29kZSA9IChlbC50ZXh0IHx8IGVsLnRleHRDb250ZW50IHx8IGVsLmlubmVySFRNTCB8fCBcIlwiKVxyXG4gIHZhciBzcmMgPSAoZWwuc3JjIHx8IFwiXCIpXHJcbiAgdmFyIHBhcmVudCA9IGVsLnBhcmVudE5vZGUgfHwgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImhlYWRcIikgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50XHJcbiAgdmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIilcclxuXHJcbiAgaWYgKGNvZGUubWF0Y2goXCJkb2N1bWVudC53cml0ZVwiKSkge1xyXG4gICAgaWYgKGNvbnNvbGUgJiYgY29uc29sZS5sb2cpIHtcclxuICAgICAgY29uc29sZS5sb2coXCJTY3JpcHQgY29udGFpbnMgZG9jdW1lbnQud3JpdGUuIENhbuKAmXQgYmUgZXhlY3V0ZWQgY29ycmVjdGx5LiBDb2RlIHNraXBwZWQgXCIsIGVsKVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlXHJcbiAgfVxyXG5cclxuICBzY3JpcHQudHlwZSA9IFwidGV4dC9qYXZhc2NyaXB0XCJcclxuXHJcbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXHJcbiAgaWYgKHNyYyAhPT0gXCJcIikge1xyXG4gICAgc2NyaXB0LnNyYyA9IHNyY1xyXG4gICAgc2NyaXB0LmFzeW5jID0gZmFsc2UgLy8gZm9yY2Ugc3luY2hyb25vdXMgbG9hZGluZyBvZiBwZXJpcGhlcmFsIEpTXHJcbiAgfVxyXG5cclxuICBpZiAoY29kZSAhPT0gXCJcIikge1xyXG4gICAgdHJ5IHtcclxuICAgICAgc2NyaXB0LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNvZGUpKVxyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGUpIHtcclxuICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cclxuICAgICAgLy8gb2xkIElFcyBoYXZlIGZ1bmt5IHNjcmlwdCBub2Rlc1xyXG4gICAgICBzY3JpcHQudGV4dCA9IGNvZGVcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIGV4ZWN1dGVcclxuICBwYXJlbnQuYXBwZW5kQ2hpbGQoc2NyaXB0KVxyXG4gIC8vIGF2b2lkIHBvbGx1dGlvbiBvbmx5IGluIGhlYWQgb3IgYm9keSB0YWdzXHJcbiAgaWYgKHBhcmVudCBpbnN0YW5jZW9mIEhUTUxIZWFkRWxlbWVudCB8fCBwYXJlbnQgaW5zdGFuY2VvZiBIVE1MQm9keUVsZW1lbnQpIHtcclxuICAgIHBhcmVudC5yZW1vdmVDaGlsZChzY3JpcHQpXHJcbiAgfVxyXG5cclxuICByZXR1cm4gdHJ1ZVxyXG59XHJcbiIsInZhciBmb3JFYWNoRWxzID0gcmVxdWlyZShcIi4uL2ZvcmVhY2gtZWxzXCIpXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGVscywgZXZlbnRzLCBsaXN0ZW5lciwgdXNlQ2FwdHVyZSkge1xyXG4gIGV2ZW50cyA9ICh0eXBlb2YgZXZlbnRzID09PSBcInN0cmluZ1wiID8gZXZlbnRzLnNwbGl0KFwiIFwiKSA6IGV2ZW50cylcclxuXHJcbiAgZXZlbnRzLmZvckVhY2goZnVuY3Rpb24oZSkge1xyXG4gICAgZm9yRWFjaEVscyhlbHMsIGZ1bmN0aW9uKGVsKSB7XHJcbiAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoZSwgbGlzdGVuZXIsIHVzZUNhcHR1cmUpXHJcbiAgICB9KVxyXG4gIH0pXHJcbn1cclxuIiwidmFyIGZvckVhY2hFbHMgPSByZXF1aXJlKFwiLi4vZm9yZWFjaC1lbHNcIilcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZWxzLCBldmVudHMsIG9wdHMpIHtcclxuICBldmVudHMgPSAodHlwZW9mIGV2ZW50cyA9PT0gXCJzdHJpbmdcIiA/IGV2ZW50cy5zcGxpdChcIiBcIikgOiBldmVudHMpXHJcblxyXG4gIGV2ZW50cy5mb3JFYWNoKGZ1bmN0aW9uKGUpIHtcclxuICAgIHZhciBldmVudFxyXG4gICAgZXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudChcIkhUTUxFdmVudHNcIilcclxuICAgIGV2ZW50LmluaXRFdmVudChlLCB0cnVlLCB0cnVlKVxyXG4gICAgZXZlbnQuZXZlbnROYW1lID0gZVxyXG4gICAgaWYgKG9wdHMpIHtcclxuICAgICAgT2JqZWN0LmtleXMob3B0cykuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcclxuICAgICAgICBldmVudFtrZXldID0gb3B0c1trZXldXHJcbiAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgZm9yRWFjaEVscyhlbHMsIGZ1bmN0aW9uKGVsKSB7XHJcbiAgICAgIHZhciBkb21GaXggPSBmYWxzZVxyXG4gICAgICBpZiAoIWVsLnBhcmVudE5vZGUgJiYgZWwgIT09IGRvY3VtZW50ICYmIGVsICE9PSB3aW5kb3cpIHtcclxuICAgICAgICAvLyBUSEFOSyBZT1UgSUUgKDkvMTAvMTEpXHJcbiAgICAgICAgLy8gZGlzcGF0Y2hFdmVudCBkb2Vzbid0IHdvcmsgaWYgdGhlIGVsZW1lbnQgaXMgbm90IGluIHRoZSBET01cclxuICAgICAgICBkb21GaXggPSB0cnVlXHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChlbClcclxuICAgICAgfVxyXG4gICAgICBlbC5kaXNwYXRjaEV2ZW50KGV2ZW50KVxyXG4gICAgICBpZiAoZG9tRml4KSB7XHJcbiAgICAgICAgZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbClcclxuICAgICAgfVxyXG4gICAgfSlcclxuICB9KVxyXG59XHJcbiIsInZhciBmb3JFYWNoRWxzID0gcmVxdWlyZShcIi4vZm9yZWFjaC1lbHNcIilcclxudmFyIGV2YWxTY3JpcHQgPSByZXF1aXJlKFwiLi9ldmFsLXNjcmlwdFwiKVxyXG4vLyBGaW5kcyBhbmQgZXhlY3V0ZXMgc2NyaXB0cyAodXNlZCBmb3IgbmV3bHkgYWRkZWQgZWxlbWVudHMpXHJcbi8vIE5lZWRlZCBzaW5jZSBpbm5lckhUTUwgZG9lcyBub3QgcnVuIHNjcmlwdHNcclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihlbCkge1xyXG4gIGlmIChlbC50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09IFwic2NyaXB0XCIpIHtcclxuICAgIGV2YWxTY3JpcHQoZWwpXHJcbiAgfVxyXG5cclxuICBmb3JFYWNoRWxzKGVsLnF1ZXJ5U2VsZWN0b3JBbGwoXCJzY3JpcHRcIiksIGZ1bmN0aW9uKHNjcmlwdCkge1xyXG4gICAgaWYgKCFzY3JpcHQudHlwZSB8fCBzY3JpcHQudHlwZS50b0xvd2VyQ2FzZSgpID09PSBcInRleHQvamF2YXNjcmlwdFwiKSB7XHJcbiAgICAgIGlmIChzY3JpcHQucGFyZW50Tm9kZSkge1xyXG4gICAgICAgIHNjcmlwdC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHNjcmlwdClcclxuICAgICAgfVxyXG4gICAgICBldmFsU2NyaXB0KHNjcmlwdClcclxuICAgIH1cclxuICB9KVxyXG59XHJcbiIsIi8qIGdsb2JhbCBIVE1MQ29sbGVjdGlvbjogdHJ1ZSAqL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihlbHMsIGZuLCBjb250ZXh0KSB7XHJcbiAgaWYgKGVscyBpbnN0YW5jZW9mIEhUTUxDb2xsZWN0aW9uIHx8IGVscyBpbnN0YW5jZW9mIE5vZGVMaXN0IHx8IGVscyBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICByZXR1cm4gQXJyYXkucHJvdG90eXBlLmZvckVhY2guY2FsbChlbHMsIGZuLCBjb250ZXh0KVxyXG4gIH1cclxuICAvLyBhc3N1bWUgc2ltcGxlIERPTSBlbGVtZW50XHJcbiAgcmV0dXJuIGZuLmNhbGwoY29udGV4dCwgZWxzKVxyXG59XHJcbiIsInZhciBmb3JFYWNoRWxzID0gcmVxdWlyZShcIi4vZm9yZWFjaC1lbHNcIilcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oc2VsZWN0b3JzLCBjYiwgY29udGV4dCwgRE9NY29udGV4dCkge1xyXG4gIERPTWNvbnRleHQgPSBET01jb250ZXh0IHx8IGRvY3VtZW50XHJcbiAgc2VsZWN0b3JzLmZvckVhY2goZnVuY3Rpb24oc2VsZWN0b3IpIHtcclxuICAgIGZvckVhY2hFbHMoRE9NY29udGV4dC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKSwgY2IsIGNvbnRleHQpXHJcbiAgfSlcclxufVxyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xyXG4gIC8vIEJvcnJvd2VkIHdob2xlc2FsZSBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9kZWZ1bmt0L2pxdWVyeS1wamF4XHJcbiAgcmV0dXJuIHdpbmRvdy5oaXN0b3J5ICYmXHJcbiAgICB3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUgJiZcclxuICAgIHdpbmRvdy5oaXN0b3J5LnJlcGxhY2VTdGF0ZSAmJlxyXG4gICAgLy8gcHVzaFN0YXRlIGlzbuKAmXQgcmVsaWFibGUgb24gaU9TIHVudGlsIDUuXHJcbiAgICAhbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvKChpUG9kfGlQaG9uZXxpUGFkKS4rXFxiT1NcXHMrWzEtNF1cXER8V2ViQXBwc1xcLy4rQ0ZOZXR3b3JrKS8pXHJcbn1cclxuIiwiLyogZ2xvYmFsIF9nYXE6IHRydWUsIGdhOiB0cnVlICovXHJcblxyXG52YXIgZGVmYXVsdFN3aXRjaGVzID0gcmVxdWlyZShcIi4vc3dpdGNoZXNcIilcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob3B0aW9ucykge1xyXG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9XHJcbiAgb3B0aW9ucy5lbGVtZW50cyA9IG9wdGlvbnMuZWxlbWVudHMgfHwgXCJhW2hyZWZdLCBmb3JtW2FjdGlvbl1cIlxyXG4gIG9wdGlvbnMuc2VsZWN0b3JzID0gb3B0aW9ucy5zZWxlY3RvcnMgfHwgW1widGl0bGVcIiwgXCIuanMtUGpheFwiXVxyXG4gIG9wdGlvbnMuc3dpdGNoZXMgPSBvcHRpb25zLnN3aXRjaGVzIHx8IHt9XHJcbiAgb3B0aW9ucy5zd2l0Y2hlc09wdGlvbnMgPSBvcHRpb25zLnN3aXRjaGVzT3B0aW9ucyB8fCB7fVxyXG4gIG9wdGlvbnMuaGlzdG9yeSA9ICh0eXBlb2Ygb3B0aW9ucy5oaXN0b3J5ID09PSBcInVuZGVmaW5lZFwiKSA/IHRydWUgOiBvcHRpb25zLmhpc3RvcnlcclxuICBvcHRpb25zLmFuYWx5dGljcyA9ICh0eXBlb2Ygb3B0aW9ucy5hbmFseXRpY3MgPT09IFwiZnVuY3Rpb25cIiB8fCBvcHRpb25zLmFuYWx5dGljcyA9PT0gZmFsc2UpID8gb3B0aW9ucy5hbmFseXRpY3MgOiBkZWZhdWx0QW5hbHl0aWNzXHJcbiAgb3B0aW9ucy5zY3JvbGxUbyA9ICh0eXBlb2Ygb3B0aW9ucy5zY3JvbGxUbyA9PT0gXCJ1bmRlZmluZWRcIikgPyAwIDogb3B0aW9ucy5zY3JvbGxUb1xyXG4gIG9wdGlvbnMuc2Nyb2xsUmVzdG9yYXRpb24gPSAodHlwZW9mIG9wdGlvbnMuc2Nyb2xsUmVzdG9yYXRpb24gIT09IFwidW5kZWZpbmVkXCIpID8gb3B0aW9ucy5zY3JvbGxSZXN0b3JhdGlvbiA6IHRydWVcclxuICBvcHRpb25zLmNhY2hlQnVzdCA9ICh0eXBlb2Ygb3B0aW9ucy5jYWNoZUJ1c3QgPT09IFwidW5kZWZpbmVkXCIpID8gdHJ1ZSA6IG9wdGlvbnMuY2FjaGVCdXN0XHJcbiAgb3B0aW9ucy5kZWJ1ZyA9IG9wdGlvbnMuZGVidWcgfHwgZmFsc2VcclxuICBvcHRpb25zLnRpbWVvdXQgPSBvcHRpb25zLnRpbWVvdXQgfHwgMFxyXG4gIG9wdGlvbnMuY3VycmVudFVybEZ1bGxSZWxvYWQgPSAodHlwZW9mIG9wdGlvbnMuY3VycmVudFVybEZ1bGxSZWxvYWQgPT09IFwidW5kZWZpbmVkXCIpID8gZmFsc2UgOiBvcHRpb25zLmN1cnJlbnRVcmxGdWxsUmVsb2FkXHJcblxyXG4gIC8vIFdlIGNhbuKAmXQgcmVwbGFjZSBib2R5Lm91dGVySFRNTCBvciBoZWFkLm91dGVySFRNTC5cclxuICAvLyBJdCBjcmVhdGVzIGEgYnVnIHdoZXJlIGEgbmV3IGJvZHkgb3IgaGVhZCBhcmUgY3JlYXRlZCBpbiB0aGUgRE9NLlxyXG4gIC8vIElmIHlvdSBzZXQgaGVhZC5vdXRlckhUTUwsIGEgbmV3IGJvZHkgdGFnIGlzIGFwcGVuZGVkLCBzbyB0aGUgRE9NIGhhcyAyIGJvZHkgbm9kZXMsIGFuZCB2aWNlIHZlcnNhXHJcbiAgaWYgKCFvcHRpb25zLnN3aXRjaGVzLmhlYWQpIHtcclxuICAgIG9wdGlvbnMuc3dpdGNoZXMuaGVhZCA9IGRlZmF1bHRTd2l0Y2hlcy5zd2l0Y2hFbGVtZW50c0FsdFxyXG4gIH1cclxuICBpZiAoIW9wdGlvbnMuc3dpdGNoZXMuYm9keSkge1xyXG4gICAgb3B0aW9ucy5zd2l0Y2hlcy5ib2R5ID0gZGVmYXVsdFN3aXRjaGVzLnN3aXRjaEVsZW1lbnRzQWx0XHJcbiAgfVxyXG5cclxuICByZXR1cm4gb3B0aW9uc1xyXG59XHJcblxyXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xyXG5mdW5jdGlvbiBkZWZhdWx0QW5hbHl0aWNzKCkge1xyXG4gIGlmICh3aW5kb3cuX2dhcSkge1xyXG4gICAgX2dhcS5wdXNoKFtcIl90cmFja1BhZ2V2aWV3XCJdKVxyXG4gIH1cclxuICBpZiAod2luZG93LmdhKSB7XHJcbiAgICBnYShcInNlbmRcIiwgXCJwYWdldmlld1wiLCB7cGFnZTogbG9jYXRpb24ucGF0aG5hbWUsIHRpdGxlOiBkb2N1bWVudC50aXRsZX0pXHJcbiAgfVxyXG59XHJcbiIsInZhciBvbiA9IHJlcXVpcmUoXCIuLi9ldmVudHMvb25cIilcclxudmFyIGNsb25lID0gcmVxdWlyZShcIi4uL3V0aWwvY2xvbmVcIilcclxuXHJcbnZhciBhdHRyU3RhdGUgPSBcImRhdGEtcGpheC1zdGF0ZVwiXHJcblxyXG52YXIgZm9ybUFjdGlvbiA9IGZ1bmN0aW9uKGVsLCBldmVudCkge1xyXG4gIGlmIChpc0RlZmF1bHRQcmV2ZW50ZWQoZXZlbnQpKSB7XHJcbiAgICByZXR1cm5cclxuICB9XHJcblxyXG4gIC8vIFNpbmNlIGxvYWRVcmwgbW9kaWZpZXMgb3B0aW9ucyBhbmQgd2UgbWF5IGFkZCBvdXIgb3duIG1vZGlmaWNhdGlvbnMgYmVsb3csXHJcbiAgLy8gY2xvbmUgaXQgc28gdGhlIGNoYW5nZXMgZG9uJ3QgcGVyc2lzdFxyXG4gIHZhciBvcHRpb25zID0gY2xvbmUodGhpcy5vcHRpb25zKVxyXG5cclxuICAvLyBJbml0aWFsaXplIHJlcXVlc3RPcHRpb25zXHJcbiAgb3B0aW9ucy5yZXF1ZXN0T3B0aW9ucyA9IHtcclxuICAgIHJlcXVlc3RVcmw6IGVsLmdldEF0dHJpYnV0ZShcImFjdGlvblwiKSB8fCB3aW5kb3cubG9jYXRpb24uaHJlZixcclxuICAgIHJlcXVlc3RNZXRob2Q6IGVsLmdldEF0dHJpYnV0ZShcIm1ldGhvZFwiKSB8fCBcIkdFVFwiXHJcbiAgfVxyXG5cclxuICAvLyBjcmVhdGUgYSB0ZXN0YWJsZSB2aXJ0dWFsIGxpbmsgb2YgdGhlIGZvcm0gYWN0aW9uXHJcbiAgdmFyIHZpcnRMaW5rRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpXHJcbiAgdmlydExpbmtFbGVtZW50LnNldEF0dHJpYnV0ZShcImhyZWZcIiwgb3B0aW9ucy5yZXF1ZXN0T3B0aW9ucy5yZXF1ZXN0VXJsKVxyXG5cclxuICB2YXIgYXR0clZhbHVlID0gY2hlY2tJZlNob3VsZEFib3J0KHZpcnRMaW5rRWxlbWVudCwgb3B0aW9ucylcclxuICBpZiAoYXR0clZhbHVlKSB7XHJcbiAgICBlbC5zZXRBdHRyaWJ1dGUoYXR0clN0YXRlLCBhdHRyVmFsdWUpXHJcbiAgICByZXR1cm5cclxuICB9XHJcblxyXG4gIGV2ZW50LnByZXZlbnREZWZhdWx0KClcclxuXHJcbiAgaWYgKGVsLmVuY3R5cGUgPT09IFwibXVsdGlwYXJ0L2Zvcm0tZGF0YVwiKSB7XHJcbiAgICBvcHRpb25zLnJlcXVlc3RPcHRpb25zLmZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKGVsKVxyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIG9wdGlvbnMucmVxdWVzdE9wdGlvbnMucmVxdWVzdFBhcmFtcyA9IHBhcnNlRm9ybUVsZW1lbnRzKGVsKVxyXG4gIH1cclxuXHJcbiAgZWwuc2V0QXR0cmlidXRlKGF0dHJTdGF0ZSwgXCJzdWJtaXRcIilcclxuXHJcbiAgb3B0aW9ucy50cmlnZ2VyRWxlbWVudCA9IGVsXHJcbiAgdGhpcy5sb2FkVXJsKHZpcnRMaW5rRWxlbWVudC5ocmVmLCBvcHRpb25zKVxyXG59XHJcblxyXG5mdW5jdGlvbiBwYXJzZUZvcm1FbGVtZW50cyhlbCkge1xyXG4gIHZhciByZXF1ZXN0UGFyYW1zID0gW11cclxuXHJcbiAgZm9yICh2YXIgZWxlbWVudEtleSBpbiBlbC5lbGVtZW50cykge1xyXG4gICAgaWYgKE51bWJlci5pc05hTihOdW1iZXIoZWxlbWVudEtleSkpKSB7XHJcbiAgICAgIGNvbnRpbnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBlbGVtZW50ID0gZWwuZWxlbWVudHNbZWxlbWVudEtleV1cclxuICAgIHZhciB0YWdOYW1lID0gZWxlbWVudC50YWdOYW1lLnRvTG93ZXJDYXNlKClcclxuICAgIC8vIGpzY3M6ZGlzYWJsZSBkaXNhbGxvd0ltcGxpY2l0VHlwZUNvbnZlcnNpb25cclxuICAgIGlmICghIWVsZW1lbnQubmFtZSAmJiBlbGVtZW50LmF0dHJpYnV0ZXMgIT09IHVuZGVmaW5lZCAmJiB0YWdOYW1lICE9PSBcImJ1dHRvblwiKSB7XHJcbiAgICAgIC8vIGpzY3M6ZW5hYmxlIGRpc2FsbG93SW1wbGljaXRUeXBlQ29udmVyc2lvblxyXG4gICAgICB2YXIgdHlwZSA9IGVsZW1lbnQuYXR0cmlidXRlcy50eXBlXHJcblxyXG4gICAgICBpZiAoKCF0eXBlIHx8IHR5cGUudmFsdWUgIT09IFwiY2hlY2tib3hcIiAmJiB0eXBlLnZhbHVlICE9PSBcInJhZGlvXCIpIHx8IGVsZW1lbnQuY2hlY2tlZCkge1xyXG4gICAgICAgIC8vIEJ1aWxkIGFycmF5IG9mIHZhbHVlcyB0byBzdWJtaXRcclxuICAgICAgICB2YXIgdmFsdWVzID0gW11cclxuXHJcbiAgICAgICAgaWYgKHRhZ05hbWUgPT09IFwic2VsZWN0XCIpIHtcclxuICAgICAgICAgIHZhciBvcHRcclxuXHJcbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVsZW1lbnQub3B0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBvcHQgPSBlbGVtZW50Lm9wdGlvbnNbaV1cclxuICAgICAgICAgICAgaWYgKG9wdC5zZWxlY3RlZCAmJiAhb3B0LmRpc2FibGVkKSB7XHJcbiAgICAgICAgICAgICAgdmFsdWVzLnB1c2gob3B0Lmhhc0F0dHJpYnV0ZShcInZhbHVlXCIpID8gb3B0LnZhbHVlIDogb3B0LnRleHQpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICB2YWx1ZXMucHVzaChlbGVtZW50LnZhbHVlKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCB2YWx1ZXMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgIHJlcXVlc3RQYXJhbXMucHVzaCh7XHJcbiAgICAgICAgICAgIG5hbWU6IGVuY29kZVVSSUNvbXBvbmVudChlbGVtZW50Lm5hbWUpLFxyXG4gICAgICAgICAgICB2YWx1ZTogZW5jb2RlVVJJQ29tcG9uZW50KHZhbHVlc1tqXSlcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gcmVxdWVzdFBhcmFtc1xyXG59XHJcblxyXG5mdW5jdGlvbiBjaGVja0lmU2hvdWxkQWJvcnQodmlydExpbmtFbGVtZW50LCBvcHRpb25zKSB7XHJcbiAgLy8gSWdub3JlIGV4dGVybmFsIGxpbmtzLlxyXG4gIGlmICh2aXJ0TGlua0VsZW1lbnQucHJvdG9jb2wgIT09IHdpbmRvdy5sb2NhdGlvbi5wcm90b2NvbCB8fCB2aXJ0TGlua0VsZW1lbnQuaG9zdCAhPT0gd2luZG93LmxvY2F0aW9uLmhvc3QpIHtcclxuICAgIHJldHVybiBcImV4dGVybmFsXCJcclxuICB9XHJcblxyXG4gIC8vIElnbm9yZSBjbGljayBpZiB3ZSBhcmUgb24gYW4gYW5jaG9yIG9uIHRoZSBzYW1lIHBhZ2VcclxuICBpZiAodmlydExpbmtFbGVtZW50Lmhhc2ggJiYgdmlydExpbmtFbGVtZW50LmhyZWYucmVwbGFjZSh2aXJ0TGlua0VsZW1lbnQuaGFzaCwgXCJcIikgPT09IHdpbmRvdy5sb2NhdGlvbi5ocmVmLnJlcGxhY2UobG9jYXRpb24uaGFzaCwgXCJcIikpIHtcclxuICAgIHJldHVybiBcImFuY2hvclwiXHJcbiAgfVxyXG5cclxuICAvLyBJZ25vcmUgZW1wdHkgYW5jaG9yIFwiZm9vLmh0bWwjXCJcclxuICBpZiAodmlydExpbmtFbGVtZW50LmhyZWYgPT09IHdpbmRvdy5sb2NhdGlvbi5ocmVmLnNwbGl0KFwiI1wiKVswXSArIFwiI1wiKSB7XHJcbiAgICByZXR1cm4gXCJhbmNob3ItZW1wdHlcIlxyXG4gIH1cclxuXHJcbiAgLy8gaWYgZGVjbGFyZWQgYXMgYSBmdWxsIHJlbG9hZCwganVzdCBub3JtYWxseSBzdWJtaXQgdGhlIGZvcm1cclxuICBpZiAob3B0aW9ucy5jdXJyZW50VXJsRnVsbFJlbG9hZCAmJiB2aXJ0TGlua0VsZW1lbnQuaHJlZiA9PT0gd2luZG93LmxvY2F0aW9uLmhyZWYuc3BsaXQoXCIjXCIpWzBdKSB7XHJcbiAgICByZXR1cm4gXCJyZWxvYWRcIlxyXG4gIH1cclxufVxyXG5cclxudmFyIGlzRGVmYXVsdFByZXZlbnRlZCA9IGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgcmV0dXJuIGV2ZW50LmRlZmF1bHRQcmV2ZW50ZWQgfHwgZXZlbnQucmV0dXJuVmFsdWUgPT09IGZhbHNlXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZWwpIHtcclxuICB2YXIgdGhhdCA9IHRoaXNcclxuXHJcbiAgZWwuc2V0QXR0cmlidXRlKGF0dHJTdGF0ZSwgXCJcIilcclxuXHJcbiAgb24oZWwsIFwic3VibWl0XCIsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICBmb3JtQWN0aW9uLmNhbGwodGhhdCwgZWwsIGV2ZW50KVxyXG4gIH0pXHJcblxyXG4gIG9uKGVsLCBcImtleXVwXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gMTMpIHtcclxuICAgICAgZm9ybUFjdGlvbi5jYWxsKHRoYXQsIGVsLCBldmVudClcclxuICAgIH1cclxuICB9LmJpbmQodGhpcykpXHJcbn1cclxuIiwidmFyIG9uID0gcmVxdWlyZShcIi4uL2V2ZW50cy9vblwiKVxyXG52YXIgY2xvbmUgPSByZXF1aXJlKFwiLi4vdXRpbC9jbG9uZVwiKVxyXG5cclxudmFyIGF0dHJTdGF0ZSA9IFwiZGF0YS1wamF4LXN0YXRlXCJcclxuXHJcbnZhciBsaW5rQWN0aW9uID0gZnVuY3Rpb24oZWwsIGV2ZW50KSB7XHJcbiAgaWYgKGlzRGVmYXVsdFByZXZlbnRlZChldmVudCkpIHtcclxuICAgIHJldHVyblxyXG4gIH1cclxuXHJcbiAgLy8gU2luY2UgbG9hZFVybCBtb2RpZmllcyBvcHRpb25zIGFuZCB3ZSBtYXkgYWRkIG91ciBvd24gbW9kaWZpY2F0aW9ucyBiZWxvdyxcclxuICAvLyBjbG9uZSBpdCBzbyB0aGUgY2hhbmdlcyBkb24ndCBwZXJzaXN0XHJcbiAgdmFyIG9wdGlvbnMgPSBjbG9uZSh0aGlzLm9wdGlvbnMpXHJcblxyXG4gIHZhciBhdHRyVmFsdWUgPSBjaGVja0lmU2hvdWxkQWJvcnQoZWwsIGV2ZW50KVxyXG4gIGlmIChhdHRyVmFsdWUpIHtcclxuICAgIGVsLnNldEF0dHJpYnV0ZShhdHRyU3RhdGUsIGF0dHJWYWx1ZSlcclxuICAgIHJldHVyblxyXG4gIH1cclxuXHJcbiAgZXZlbnQucHJldmVudERlZmF1bHQoKVxyXG5cclxuICAvLyBkb27igJl0IGRvIFwibm90aGluZ1wiIGlmIHVzZXIgdHJ5IHRvIHJlbG9hZCB0aGUgcGFnZSBieSBjbGlja2luZyB0aGUgc2FtZSBsaW5rIHR3aWNlXHJcbiAgaWYgKFxyXG4gICAgdGhpcy5vcHRpb25zLmN1cnJlbnRVcmxGdWxsUmVsb2FkICYmXHJcbiAgICBlbC5ocmVmID09PSB3aW5kb3cubG9jYXRpb24uaHJlZi5zcGxpdChcIiNcIilbMF1cclxuICApIHtcclxuICAgIGVsLnNldEF0dHJpYnV0ZShhdHRyU3RhdGUsIFwicmVsb2FkXCIpXHJcbiAgICB0aGlzLnJlbG9hZCgpXHJcbiAgICByZXR1cm5cclxuICB9XHJcblxyXG4gIGVsLnNldEF0dHJpYnV0ZShhdHRyU3RhdGUsIFwibG9hZFwiKVxyXG5cclxuICBvcHRpb25zLnRyaWdnZXJFbGVtZW50ID0gZWxcclxuICB0aGlzLmxvYWRVcmwoZWwuaHJlZiwgb3B0aW9ucylcclxufVxyXG5cclxuZnVuY3Rpb24gY2hlY2tJZlNob3VsZEFib3J0KGVsLCBldmVudCkge1xyXG4gIC8vIERvbuKAmXQgYnJlYWsgYnJvd3NlciBzcGVjaWFsIGJlaGF2aW9yIG9uIGxpbmtzIChsaWtlIHBhZ2UgaW4gbmV3IHdpbmRvdylcclxuICBpZiAoZXZlbnQud2hpY2ggPiAxIHx8IGV2ZW50Lm1ldGFLZXkgfHwgZXZlbnQuY3RybEtleSB8fCBldmVudC5zaGlmdEtleSB8fCBldmVudC5hbHRLZXkpIHtcclxuICAgIHJldHVybiBcIm1vZGlmaWVyXCJcclxuICB9XHJcblxyXG4gIC8vIHdlIGRvIHRlc3Qgb24gaHJlZiBub3cgdG8gcHJldmVudCB1bmV4cGVjdGVkIGJlaGF2aW9yIGlmIGZvciBzb21lIHJlYXNvblxyXG4gIC8vIHVzZXIgaGF2ZSBocmVmIHRoYXQgY2FuIGJlIGR5bmFtaWNhbGx5IHVwZGF0ZWRcclxuXHJcbiAgLy8gSWdub3JlIGV4dGVybmFsIGxpbmtzLlxyXG4gIGlmIChlbC5wcm90b2NvbCAhPT0gd2luZG93LmxvY2F0aW9uLnByb3RvY29sIHx8IGVsLmhvc3QgIT09IHdpbmRvdy5sb2NhdGlvbi5ob3N0KSB7XHJcbiAgICByZXR1cm4gXCJleHRlcm5hbFwiXHJcbiAgfVxyXG5cclxuICAvLyBJZ25vcmUgYW5jaG9ycyBvbiB0aGUgc2FtZSBwYWdlIChrZWVwIG5hdGl2ZSBiZWhhdmlvcilcclxuICBpZiAoZWwuaGFzaCAmJiBlbC5ocmVmLnJlcGxhY2UoZWwuaGFzaCwgXCJcIikgPT09IHdpbmRvdy5sb2NhdGlvbi5ocmVmLnJlcGxhY2UobG9jYXRpb24uaGFzaCwgXCJcIikpIHtcclxuICAgIHJldHVybiBcImFuY2hvclwiXHJcbiAgfVxyXG5cclxuICAvLyBJZ25vcmUgZW1wdHkgYW5jaG9yIFwiZm9vLmh0bWwjXCJcclxuICBpZiAoZWwuaHJlZiA9PT0gd2luZG93LmxvY2F0aW9uLmhyZWYuc3BsaXQoXCIjXCIpWzBdICsgXCIjXCIpIHtcclxuICAgIHJldHVybiBcImFuY2hvci1lbXB0eVwiXHJcbiAgfVxyXG59XHJcblxyXG52YXIgaXNEZWZhdWx0UHJldmVudGVkID0gZnVuY3Rpb24oZXZlbnQpIHtcclxuICByZXR1cm4gZXZlbnQuZGVmYXVsdFByZXZlbnRlZCB8fCBldmVudC5yZXR1cm5WYWx1ZSA9PT0gZmFsc2VcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihlbCkge1xyXG4gIHZhciB0aGF0ID0gdGhpc1xyXG5cclxuICBlbC5zZXRBdHRyaWJ1dGUoYXR0clN0YXRlLCBcIlwiKVxyXG5cclxuICBvbihlbCwgXCJjbGlja1wiLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgbGlua0FjdGlvbi5jYWxsKHRoYXQsIGVsLCBldmVudClcclxuICB9KVxyXG5cclxuICBvbihlbCwgXCJrZXl1cFwiLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgaWYgKGV2ZW50LmtleUNvZGUgPT09IDEzKSB7XHJcbiAgICAgIGxpbmtBY3Rpb24uY2FsbCh0aGF0LCBlbCwgZXZlbnQpXHJcbiAgICB9XHJcbiAgfS5iaW5kKHRoaXMpKVxyXG59XHJcbiIsInZhciBjbG9uZSA9IHJlcXVpcmUoXCIuLi91dGlsL2Nsb25lLmpzXCIpXHJcbnZhciBuZXdVaWQgPSByZXF1aXJlKFwiLi4vdW5pcXVlaWQuanNcIilcclxudmFyIHRyaWdnZXIgPSByZXF1aXJlKFwiLi4vZXZlbnRzL3RyaWdnZXIuanNcIilcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ocmVzcG9uc2VUZXh0LCByZXF1ZXN0LCBocmVmLCBvcHRpb25zKSB7XHJcbiAgb3B0aW9ucyA9IGNsb25lKG9wdGlvbnMgIHx8IHRoaXMub3B0aW9ucylcclxuICBvcHRpb25zLnJlcXVlc3QgPSByZXF1ZXN0XHJcblxyXG4gIC8vIEZhaWwgaWYgdW5hYmxlIHRvIGxvYWQgSFRNTCB2aWEgQUpBWFxyXG4gIGlmIChyZXNwb25zZVRleHQgPT09IGZhbHNlKSB7XHJcbiAgICB0cmlnZ2VyKGRvY3VtZW50LCBcInBqYXg6Y29tcGxldGUgcGpheDplcnJvclwiLCBvcHRpb25zKVxyXG5cclxuICAgIHJldHVyblxyXG4gIH1cclxuXHJcbiAgLy8gcHVzaCBzY3JvbGwgcG9zaXRpb24gdG8gaGlzdG9yeVxyXG4gIHZhciBjdXJyZW50U3RhdGUgPSB3aW5kb3cuaGlzdG9yeS5zdGF0ZSB8fCB7fVxyXG4gIHdpbmRvdy5oaXN0b3J5LnJlcGxhY2VTdGF0ZSh7XHJcbiAgICAgIHVybDogY3VycmVudFN0YXRlLnVybCB8fCB3aW5kb3cubG9jYXRpb24uaHJlZixcclxuICAgICAgdGl0bGU6IGN1cnJlbnRTdGF0ZS50aXRsZSB8fCBkb2N1bWVudC50aXRsZSxcclxuICAgICAgdWlkOiBjdXJyZW50U3RhdGUudWlkIHx8IG5ld1VpZCgpLFxyXG4gICAgICBzY3JvbGxQb3M6IFtkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsTGVmdCB8fCBkb2N1bWVudC5ib2R5LnNjcm9sbExlZnQsXHJcbiAgICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcCB8fCBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcF1cclxuICAgIH0sXHJcbiAgICBkb2N1bWVudC50aXRsZSwgd2luZG93LmxvY2F0aW9uKVxyXG5cclxuICAvLyBDaGVjayBmb3IgcmVkaXJlY3RzXHJcbiAgdmFyIG9sZEhyZWYgPSBocmVmXHJcbiAgaWYgKHJlcXVlc3QucmVzcG9uc2VVUkwpIHtcclxuICAgIGlmIChocmVmICE9PSByZXF1ZXN0LnJlc3BvbnNlVVJMKSB7XHJcbiAgICAgIGhyZWYgPSByZXF1ZXN0LnJlc3BvbnNlVVJMXHJcbiAgICB9XHJcbiAgfVxyXG4gIGVsc2UgaWYgKHJlcXVlc3QuZ2V0UmVzcG9uc2VIZWFkZXIoXCJYLVBKQVgtVVJMXCIpKSB7XHJcbiAgICBocmVmID0gcmVxdWVzdC5nZXRSZXNwb25zZUhlYWRlcihcIlgtUEpBWC1VUkxcIilcclxuICB9XHJcbiAgZWxzZSBpZiAocmVxdWVzdC5nZXRSZXNwb25zZUhlYWRlcihcIlgtWEhSLVJlZGlyZWN0ZWQtVG9cIikpIHtcclxuICAgIGhyZWYgPSByZXF1ZXN0LmdldFJlc3BvbnNlSGVhZGVyKFwiWC1YSFItUmVkaXJlY3RlZC1Ub1wiKVxyXG4gIH1cclxuXHJcbiAgLy8gQWRkIGJhY2sgdGhlIGhhc2ggaWYgaXQgd2FzIHJlbW92ZWRcclxuICB2YXIgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpXHJcbiAgYS5ocmVmID0gb2xkSHJlZlxyXG4gIHZhciBvbGRIYXNoID0gYS5oYXNoXHJcbiAgYS5ocmVmID0gaHJlZlxyXG4gIGlmIChvbGRIYXNoICYmICFhLmhhc2gpIHtcclxuICAgIGEuaGFzaCA9IG9sZEhhc2hcclxuICAgIGhyZWYgPSBhLmhyZWZcclxuICB9XHJcblxyXG4gIHRoaXMuc3RhdGUuaHJlZiA9IGhyZWZcclxuICB0aGlzLnN0YXRlLm9wdGlvbnMgPSBvcHRpb25zXHJcblxyXG4gIHRyeSB7XHJcbiAgICB0aGlzLmxvYWRDb250ZW50KHJlc3BvbnNlVGV4dCwgb3B0aW9ucylcclxuICB9XHJcbiAgY2F0Y2ggKGUpIHtcclxuICAgIHRyaWdnZXIoZG9jdW1lbnQsIFwicGpheDplcnJvclwiLCBvcHRpb25zKVxyXG5cclxuICAgIGlmICghdGhpcy5vcHRpb25zLmRlYnVnKSB7XHJcbiAgICAgIGlmIChjb25zb2xlICYmIGNvbnNvbGUuZXJyb3IpIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKFwiUGpheCBzd2l0Y2ggZmFpbDogXCIsIGUpXHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHRoaXMubGF0ZXN0Q2hhbmNlKGhyZWYpXHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgdGhyb3cgZVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xyXG4gIGlmICh0aGlzLm9wdGlvbnMuZGVidWcgJiYgY29uc29sZSkge1xyXG4gICAgaWYgKHR5cGVvZiBjb25zb2xlLmxvZyA9PT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nLmFwcGx5KGNvbnNvbGUsIGFyZ3VtZW50cylcclxuICAgIH1cclxuICAgIC8vIElFIGlzIHdlaXJkXHJcbiAgICBlbHNlIGlmIChjb25zb2xlLmxvZykge1xyXG4gICAgICBjb25zb2xlLmxvZyhhcmd1bWVudHMpXHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsInZhciBhdHRyU3RhdGUgPSBcImRhdGEtcGpheC1zdGF0ZVwiXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGVsKSB7XHJcbiAgc3dpdGNoIChlbC50YWdOYW1lLnRvTG93ZXJDYXNlKCkpIHtcclxuICAgIGNhc2UgXCJhXCI6XHJcbiAgICAgIC8vIG9ubHkgYXR0YWNoIGxpbmsgaWYgZWwgZG9lcyBub3QgYWxyZWFkeSBoYXZlIGxpbmsgYXR0YWNoZWRcclxuICAgICAgaWYgKCFlbC5oYXNBdHRyaWJ1dGUoYXR0clN0YXRlKSkge1xyXG4gICAgICAgIHRoaXMuYXR0YWNoTGluayhlbClcclxuICAgICAgfVxyXG4gICAgICBicmVha1xyXG5cclxuICAgIGNhc2UgXCJmb3JtXCI6XHJcbiAgICAgIC8vIG9ubHkgYXR0YWNoIGxpbmsgaWYgZWwgZG9lcyBub3QgYWxyZWFkeSBoYXZlIGxpbmsgYXR0YWNoZWRcclxuICAgICAgaWYgKCFlbC5oYXNBdHRyaWJ1dGUoYXR0clN0YXRlKSkge1xyXG4gICAgICAgIHRoaXMuYXR0YWNoRm9ybShlbClcclxuICAgICAgfVxyXG4gICAgICBicmVha1xyXG5cclxuICAgIGRlZmF1bHQ6XHJcbiAgICAgIHRocm93IFwiUGpheCBjYW4gb25seSBiZSBhcHBsaWVkIG9uIDxhPiBvciA8Zm9ybT4gc3VibWl0XCJcclxuICB9XHJcbn1cclxuIiwidmFyIHVwZGF0ZVF1ZXJ5U3RyaW5nID0gcmVxdWlyZShcIi4vdXRpbC91cGRhdGUtcXVlcnktc3RyaW5nXCIpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihsb2NhdGlvbiwgb3B0aW9ucywgY2FsbGJhY2spIHtcclxuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fVxyXG4gIHZhciBxdWVyeVN0cmluZ1xyXG4gIHZhciByZXF1ZXN0T3B0aW9ucyA9IG9wdGlvbnMucmVxdWVzdE9wdGlvbnMgfHwge31cclxuICB2YXIgcmVxdWVzdE1ldGhvZCA9IChyZXF1ZXN0T3B0aW9ucy5yZXF1ZXN0TWV0aG9kIHx8IFwiR0VUXCIpLnRvVXBwZXJDYXNlKClcclxuICB2YXIgcmVxdWVzdFBhcmFtcyA9IHJlcXVlc3RPcHRpb25zLnJlcXVlc3RQYXJhbXMgfHwgbnVsbFxyXG4gIHZhciBmb3JtRGF0YSA9IHJlcXVlc3RPcHRpb25zLmZvcm1EYXRhIHx8IG51bGw7XHJcbiAgdmFyIHJlcXVlc3RQYXlsb2FkID0gbnVsbFxyXG4gIHZhciByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KClcclxuICB2YXIgdGltZW91dCA9IG9wdGlvbnMudGltZW91dCB8fCAwXHJcblxyXG4gIHJlcXVlc3Qub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XHJcbiAgICBpZiAocmVxdWVzdC5yZWFkeVN0YXRlID09PSA0KSB7XHJcbiAgICAgIGlmIChyZXF1ZXN0LnN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgICAgY2FsbGJhY2socmVxdWVzdC5yZXNwb25zZVRleHQsIHJlcXVlc3QsIGxvY2F0aW9uLCBvcHRpb25zKVxyXG4gICAgICB9XHJcbiAgICAgIGVsc2UgaWYgKHJlcXVlc3Quc3RhdHVzICE9PSAwKSB7XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVxdWVzdCwgbG9jYXRpb24sIG9wdGlvbnMpXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJlcXVlc3Qub25lcnJvciA9IGZ1bmN0aW9uKGUpIHtcclxuICAgIGNvbnNvbGUubG9nKGUpXHJcbiAgICBjYWxsYmFjayhudWxsLCByZXF1ZXN0LCBsb2NhdGlvbiwgb3B0aW9ucylcclxuICB9XHJcblxyXG4gIHJlcXVlc3Qub250aW1lb3V0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICBjYWxsYmFjayhudWxsLCByZXF1ZXN0LCBsb2NhdGlvbiwgb3B0aW9ucylcclxuICB9XHJcblxyXG4gIC8vIFByZXBhcmUgdGhlIHJlcXVlc3QgcGF5bG9hZCBmb3IgZm9ybXMsIGlmIGF2YWlsYWJsZVxyXG4gIGlmIChyZXF1ZXN0UGFyYW1zICYmIHJlcXVlc3RQYXJhbXMubGVuZ3RoKSB7XHJcbiAgICAvLyBCdWlsZCBxdWVyeSBzdHJpbmdcclxuICAgIHF1ZXJ5U3RyaW5nID0gKHJlcXVlc3RQYXJhbXMubWFwKGZ1bmN0aW9uKHBhcmFtKSB7cmV0dXJuIHBhcmFtLm5hbWUgKyBcIj1cIiArIHBhcmFtLnZhbHVlfSkpLmpvaW4oXCImXCIpXHJcblxyXG4gICAgc3dpdGNoIChyZXF1ZXN0TWV0aG9kKSB7XHJcbiAgICAgIGNhc2UgXCJHRVRcIjpcclxuICAgICAgICAvLyBSZXNldCBxdWVyeSBzdHJpbmcgdG8gYXZvaWQgYW4gaXNzdWUgd2l0aCByZXBlYXQgc3VibWlzc2lvbnMgd2hlcmUgY2hlY2tib3hlcyB0aGF0IHdlcmVcclxuICAgICAgICAvLyBwcmV2aW91c2x5IGNoZWNrZWQgYXJlIGluY29ycmVjdGx5IHByZXNlcnZlZFxyXG4gICAgICAgIGxvY2F0aW9uID0gbG9jYXRpb24uc3BsaXQoXCI/XCIpWzBdXHJcblxyXG4gICAgICAgIC8vIEFwcGVuZCBuZXcgcXVlcnkgc3RyaW5nXHJcbiAgICAgICAgbG9jYXRpb24gKz0gXCI/XCIgKyBxdWVyeVN0cmluZ1xyXG4gICAgICAgIGJyZWFrXHJcblxyXG4gICAgICBjYXNlIFwiUE9TVFwiOlxyXG4gICAgICAgIC8vIFNlbmQgcXVlcnkgc3RyaW5nIGFzIHJlcXVlc3QgcGF5bG9hZFxyXG4gICAgICAgIHJlcXVlc3RQYXlsb2FkID0gcXVlcnlTdHJpbmdcclxuICAgICAgICBicmVha1xyXG4gICAgfVxyXG4gIH1cclxuICBlbHNlIGlmIChmb3JtRGF0YSkge1xyXG4gICAgcmVxdWVzdFBheWxvYWQgPSBmb3JtRGF0YVxyXG4gIH1cclxuXHJcbiAgLy8gQWRkIGEgdGltZXN0YW1wIGFzIHBhcnQgb2YgdGhlIHF1ZXJ5IHN0cmluZyBpZiBjYWNoZSBidXN0aW5nIGlzIGVuYWJsZWRcclxuICBpZiAob3B0aW9ucy5jYWNoZUJ1c3QpIHtcclxuICAgIGxvY2F0aW9uID0gdXBkYXRlUXVlcnlTdHJpbmcobG9jYXRpb24sIFwidFwiLCBEYXRlLm5vdygpKVxyXG4gIH1cclxuXHJcbiAgcmVxdWVzdC5vcGVuKHJlcXVlc3RNZXRob2QsIGxvY2F0aW9uLCB0cnVlKVxyXG4gIHJlcXVlc3QudGltZW91dCA9IHRpbWVvdXRcclxuICByZXF1ZXN0LnNldFJlcXVlc3RIZWFkZXIoXCJYLVJlcXVlc3RlZC1XaXRoXCIsIFwiWE1MSHR0cFJlcXVlc3RcIilcclxuICByZXF1ZXN0LnNldFJlcXVlc3RIZWFkZXIoXCJYLVBKQVhcIiwgXCJ0cnVlXCIpXHJcbiAgcmVxdWVzdC5zZXRSZXF1ZXN0SGVhZGVyKFwiWC1QSkFYLVNlbGVjdG9yc1wiLCBKU09OLnN0cmluZ2lmeShvcHRpb25zLnNlbGVjdG9ycykpXHJcblxyXG4gIC8vIFNlbmQgdGhlIHByb3BlciBoZWFkZXIgaW5mb3JtYXRpb24gZm9yIFBPU1QgZm9ybXNcclxuICBpZiAocmVxdWVzdFBheWxvYWQgJiYgcmVxdWVzdE1ldGhvZCA9PT0gXCJQT1NUXCIgJiYgIWZvcm1EYXRhKSB7XHJcbiAgICByZXF1ZXN0LnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LVR5cGVcIiwgXCJhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWRcIilcclxuICB9XHJcblxyXG4gIHJlcXVlc3Quc2VuZChyZXF1ZXN0UGF5bG9hZClcclxuXHJcbiAgcmV0dXJuIHJlcXVlc3RcclxufVxyXG4iLCJ2YXIgZm9yRWFjaEVscyA9IHJlcXVpcmUoXCIuL2ZvcmVhY2gtZWxzXCIpXHJcblxyXG52YXIgZGVmYXVsdFN3aXRjaGVzID0gcmVxdWlyZShcIi4vc3dpdGNoZXNcIilcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oc3dpdGNoZXMsIHN3aXRjaGVzT3B0aW9ucywgc2VsZWN0b3JzLCBmcm9tRWwsIHRvRWwsIG9wdGlvbnMpIHtcclxuICB2YXIgc3dpdGNoZXNRdWV1ZSA9IFtdXHJcblxyXG4gIHNlbGVjdG9ycy5mb3JFYWNoKGZ1bmN0aW9uKHNlbGVjdG9yKSB7XHJcbiAgICB2YXIgbmV3RWxzID0gZnJvbUVsLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpXHJcbiAgICB2YXIgb2xkRWxzID0gdG9FbC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKVxyXG4gICAgaWYgKHRoaXMubG9nKSB7XHJcbiAgICAgIHRoaXMubG9nKFwiUGpheCBzd2l0Y2hcIiwgc2VsZWN0b3IsIG5ld0Vscywgb2xkRWxzKVxyXG4gICAgfVxyXG4gICAgaWYgKG5ld0Vscy5sZW5ndGggIT09IG9sZEVscy5sZW5ndGgpIHtcclxuICAgICAgdGhyb3cgXCJET00gZG9lc27igJl0IGxvb2sgdGhlIHNhbWUgb24gbmV3IGxvYWRlZCBwYWdlOiDigJlcIiArIHNlbGVjdG9yICsgXCLigJkgLSBuZXcgXCIgKyBuZXdFbHMubGVuZ3RoICsgXCIsIG9sZCBcIiArIG9sZEVscy5sZW5ndGhcclxuICAgIH1cclxuXHJcbiAgICBmb3JFYWNoRWxzKG5ld0VscywgZnVuY3Rpb24obmV3RWwsIGkpIHtcclxuICAgICAgdmFyIG9sZEVsID0gb2xkRWxzW2ldXHJcbiAgICAgIGlmICh0aGlzLmxvZykge1xyXG4gICAgICAgIHRoaXMubG9nKFwibmV3RWxcIiwgbmV3RWwsIFwib2xkRWxcIiwgb2xkRWwpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciBjYWxsYmFjayA9IChzd2l0Y2hlc1tzZWxlY3Rvcl0pID9cclxuICAgICAgICBzd2l0Y2hlc1tzZWxlY3Rvcl0uYmluZCh0aGlzLCBvbGRFbCwgbmV3RWwsIG9wdGlvbnMsIHN3aXRjaGVzT3B0aW9uc1tzZWxlY3Rvcl0pIDpcclxuICAgICAgICBkZWZhdWx0U3dpdGNoZXMub3V0ZXJIVE1MLmJpbmQodGhpcywgb2xkRWwsIG5ld0VsLCBvcHRpb25zKVxyXG5cclxuICAgICAgc3dpdGNoZXNRdWV1ZS5wdXNoKGNhbGxiYWNrKVxyXG4gICAgfSwgdGhpcylcclxuICB9LCB0aGlzKVxyXG5cclxuICB0aGlzLnN0YXRlLm51bVBlbmRpbmdTd2l0Y2hlcyA9IHN3aXRjaGVzUXVldWUubGVuZ3RoXHJcblxyXG4gIHN3aXRjaGVzUXVldWUuZm9yRWFjaChmdW5jdGlvbihxdWV1ZWRTd2l0Y2gpIHtcclxuICAgIHF1ZXVlZFN3aXRjaCgpXHJcbiAgfSlcclxufVxyXG4iLCJ2YXIgb24gPSByZXF1aXJlKFwiLi9ldmVudHMvb24uanNcIilcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gIG91dGVySFRNTDogZnVuY3Rpb24ob2xkRWwsIG5ld0VsKSB7XHJcbiAgICBvbGRFbC5vdXRlckhUTUwgPSBuZXdFbC5vdXRlckhUTUxcclxuICAgIHRoaXMub25Td2l0Y2goKVxyXG4gIH0sXHJcblxyXG4gIGlubmVySFRNTDogZnVuY3Rpb24ob2xkRWwsIG5ld0VsKSB7XHJcbiAgICBvbGRFbC5pbm5lckhUTUwgPSBuZXdFbC5pbm5lckhUTUxcclxuXHJcbiAgICBpZiAobmV3RWwuY2xhc3NOYW1lID09PSBcIlwiKSB7XHJcbiAgICAgIG9sZEVsLnJlbW92ZUF0dHJpYnV0ZShcImNsYXNzXCIpXHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgb2xkRWwuY2xhc3NOYW1lID0gbmV3RWwuY2xhc3NOYW1lXHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5vblN3aXRjaCgpXHJcbiAgfSxcclxuXHJcbiAgc3dpdGNoRWxlbWVudHNBbHQ6IGZ1bmN0aW9uKG9sZEVsLCBuZXdFbCkge1xyXG4gICAgb2xkRWwuaW5uZXJIVE1MID0gbmV3RWwuaW5uZXJIVE1MXHJcblxyXG4gICAgLy8gQ29weSBhdHRyaWJ1dGVzIGZyb20gdGhlIG5ldyBlbGVtZW50IHRvIHRoZSBvbGQgb25lXHJcbiAgICBpZiAobmV3RWwuaGFzQXR0cmlidXRlcygpKSB7XHJcbiAgICAgIHZhciBhdHRycyA9IG5ld0VsLmF0dHJpYnV0ZXNcclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhdHRycy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIG9sZEVsLmF0dHJpYnV0ZXMuc2V0TmFtZWRJdGVtKGF0dHJzW2ldLmNsb25lTm9kZSgpKVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5vblN3aXRjaCgpXHJcbiAgfSxcclxuXHJcbiAgLy8gRXF1aXZhbGVudCB0byBvdXRlckhUTUwoKSwgYnV0IGRvZXNuJ3QgcmVxdWlyZSBzd2l0Y2hFbGVtZW50c0FsdCgpIGZvciA8aGVhZD4gYW5kIDxib2R5PlxyXG4gIHJlcGxhY2VOb2RlOiBmdW5jdGlvbihvbGRFbCwgbmV3RWwpIHtcclxuICAgIG9sZEVsLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKG5ld0VsLCBvbGRFbClcclxuICAgIHRoaXMub25Td2l0Y2goKVxyXG4gIH0sXHJcblxyXG4gIHNpZGVCeVNpZGU6IGZ1bmN0aW9uKG9sZEVsLCBuZXdFbCwgb3B0aW9ucywgc3dpdGNoT3B0aW9ucykge1xyXG4gICAgdmFyIGZvckVhY2ggPSBBcnJheS5wcm90b3R5cGUuZm9yRWFjaFxyXG4gICAgdmFyIGVsc1RvUmVtb3ZlID0gW11cclxuICAgIHZhciBlbHNUb0FkZCA9IFtdXHJcbiAgICB2YXIgZnJhZ1RvQXBwZW5kID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpXHJcbiAgICB2YXIgYW5pbWF0aW9uRXZlbnROYW1lcyA9IFwiYW5pbWF0aW9uZW5kIHdlYmtpdEFuaW1hdGlvbkVuZCBNU0FuaW1hdGlvbkVuZCBvYW5pbWF0aW9uZW5kXCJcclxuICAgIHZhciBhbmltYXRlZEVsc051bWJlciA9IDBcclxuICAgIHZhciBzZXh5QW5pbWF0aW9uRW5kID0gZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgaWYgKGUudGFyZ2V0ICE9PSBlLmN1cnJlbnRUYXJnZXQpIHtcclxuICAgICAgICAgICAgLy8gZW5kIHRyaWdnZXJlZCBieSBhbiBhbmltYXRpb24gb24gYSBjaGlsZFxyXG4gICAgICAgICAgICByZXR1cm5cclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBhbmltYXRlZEVsc051bWJlci0tXHJcbiAgICAgICAgICBpZiAoYW5pbWF0ZWRFbHNOdW1iZXIgPD0gMCAmJiBlbHNUb1JlbW92ZSkge1xyXG4gICAgICAgICAgICBlbHNUb1JlbW92ZS5mb3JFYWNoKGZ1bmN0aW9uKGVsKSB7XHJcbiAgICAgICAgICAgICAgLy8gYnJvd3NpbmcgcXVpY2tseSBjYW4gbWFrZSB0aGUgZWxcclxuICAgICAgICAgICAgICAvLyBhbHJlYWR5IHJlbW92ZWQgYnkgbGFzdCBwYWdlIHVwZGF0ZSA/XHJcbiAgICAgICAgICAgICAgaWYgKGVsLnBhcmVudE5vZGUpIHtcclxuICAgICAgICAgICAgICAgIGVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWwpXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgZWxzVG9BZGQuZm9yRWFjaChmdW5jdGlvbihlbCkge1xyXG4gICAgICAgICAgICAgIGVsLmNsYXNzTmFtZSA9IGVsLmNsYXNzTmFtZS5yZXBsYWNlKGVsLmdldEF0dHJpYnV0ZShcImRhdGEtcGpheC1jbGFzc2VzXCIpLCBcIlwiKVxyXG4gICAgICAgICAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZShcImRhdGEtcGpheC1jbGFzc2VzXCIpXHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICBlbHNUb0FkZCA9IG51bGwgLy8gZnJlZSBtZW1vcnlcclxuICAgICAgICAgICAgZWxzVG9SZW1vdmUgPSBudWxsIC8vIGZyZWUgbWVtb3J5XHJcblxyXG4gICAgICAgICAgICAvLyB0aGlzIGlzIHRvIHRyaWdnZXIgc29tZSByZXBhaW50IChleGFtcGxlOiBwaWN0dXJlZmlsbClcclxuICAgICAgICAgICAgdGhpcy5vblN3aXRjaCgpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfS5iaW5kKHRoaXMpXHJcblxyXG4gICAgc3dpdGNoT3B0aW9ucyA9IHN3aXRjaE9wdGlvbnMgfHwge31cclxuXHJcbiAgICBmb3JFYWNoLmNhbGwob2xkRWwuY2hpbGROb2RlcywgZnVuY3Rpb24oZWwpIHtcclxuICAgICAgZWxzVG9SZW1vdmUucHVzaChlbClcclxuICAgICAgaWYgKGVsLmNsYXNzTGlzdCAmJiAhZWwuY2xhc3NMaXN0LmNvbnRhaW5zKFwianMtUGpheC1yZW1vdmVcIikpIHtcclxuICAgICAgICAvLyBmb3IgZmFzdCBzd2l0Y2gsIGNsZWFuIGVsZW1lbnQgdGhhdCBqdXN0IGhhdmUgYmVlbiBhZGRlZCwgJiBub3QgY2xlYW5lZCB5ZXQuXHJcbiAgICAgICAgaWYgKGVsLmhhc0F0dHJpYnV0ZShcImRhdGEtcGpheC1jbGFzc2VzXCIpKSB7XHJcbiAgICAgICAgICBlbC5jbGFzc05hbWUgPSBlbC5jbGFzc05hbWUucmVwbGFjZShlbC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXBqYXgtY2xhc3Nlc1wiKSwgXCJcIilcclxuICAgICAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZShcImRhdGEtcGpheC1jbGFzc2VzXCIpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsLmNsYXNzTGlzdC5hZGQoXCJqcy1QamF4LXJlbW92ZVwiKVxyXG4gICAgICAgIGlmIChzd2l0Y2hPcHRpb25zLmNhbGxiYWNrcyAmJiBzd2l0Y2hPcHRpb25zLmNhbGxiYWNrcy5yZW1vdmVFbGVtZW50KSB7XHJcbiAgICAgICAgICBzd2l0Y2hPcHRpb25zLmNhbGxiYWNrcy5yZW1vdmVFbGVtZW50KGVsKVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoc3dpdGNoT3B0aW9ucy5jbGFzc05hbWVzKSB7XHJcbiAgICAgICAgICBlbC5jbGFzc05hbWUgKz0gXCIgXCIgKyBzd2l0Y2hPcHRpb25zLmNsYXNzTmFtZXMucmVtb3ZlICsgXCIgXCIgKyAob3B0aW9ucy5iYWNrd2FyZCA/IHN3aXRjaE9wdGlvbnMuY2xhc3NOYW1lcy5iYWNrd2FyZCA6IHN3aXRjaE9wdGlvbnMuY2xhc3NOYW1lcy5mb3J3YXJkKVxyXG4gICAgICAgIH1cclxuICAgICAgICBhbmltYXRlZEVsc051bWJlcisrXHJcbiAgICAgICAgb24oZWwsIGFuaW1hdGlvbkV2ZW50TmFtZXMsIHNleHlBbmltYXRpb25FbmQsIHRydWUpXHJcbiAgICAgIH1cclxuICAgIH0pXHJcblxyXG4gICAgZm9yRWFjaC5jYWxsKG5ld0VsLmNoaWxkTm9kZXMsIGZ1bmN0aW9uKGVsKSB7XHJcbiAgICAgIGlmIChlbC5jbGFzc0xpc3QpIHtcclxuICAgICAgICB2YXIgYWRkQ2xhc3NlcyA9IFwiXCJcclxuICAgICAgICBpZiAoc3dpdGNoT3B0aW9ucy5jbGFzc05hbWVzKSB7XHJcbiAgICAgICAgICBhZGRDbGFzc2VzID0gXCIganMtUGpheC1hZGQgXCIgKyBzd2l0Y2hPcHRpb25zLmNsYXNzTmFtZXMuYWRkICsgXCIgXCIgKyAob3B0aW9ucy5iYWNrd2FyZCA/IHN3aXRjaE9wdGlvbnMuY2xhc3NOYW1lcy5mb3J3YXJkIDogc3dpdGNoT3B0aW9ucy5jbGFzc05hbWVzLmJhY2t3YXJkKVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoc3dpdGNoT3B0aW9ucy5jYWxsYmFja3MgJiYgc3dpdGNoT3B0aW9ucy5jYWxsYmFja3MuYWRkRWxlbWVudCkge1xyXG4gICAgICAgICAgc3dpdGNoT3B0aW9ucy5jYWxsYmFja3MuYWRkRWxlbWVudChlbClcclxuICAgICAgICB9XHJcbiAgICAgICAgZWwuY2xhc3NOYW1lICs9IGFkZENsYXNzZXNcclxuICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoXCJkYXRhLXBqYXgtY2xhc3Nlc1wiLCBhZGRDbGFzc2VzKVxyXG4gICAgICAgIGVsc1RvQWRkLnB1c2goZWwpXHJcbiAgICAgICAgZnJhZ1RvQXBwZW5kLmFwcGVuZENoaWxkKGVsKVxyXG4gICAgICAgIGFuaW1hdGVkRWxzTnVtYmVyKytcclxuICAgICAgICBvbihlbCwgYW5pbWF0aW9uRXZlbnROYW1lcywgc2V4eUFuaW1hdGlvbkVuZCwgdHJ1ZSlcclxuICAgICAgfVxyXG4gICAgfSlcclxuXHJcbiAgICAvLyBwYXNzIGFsbCBjbGFzc05hbWUgb2YgdGhlIHBhcmVudFxyXG4gICAgb2xkRWwuY2xhc3NOYW1lID0gbmV3RWwuY2xhc3NOYW1lXHJcbiAgICBvbGRFbC5hcHBlbmRDaGlsZChmcmFnVG9BcHBlbmQpXHJcbiAgfVxyXG59XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKCkge1xyXG4gIHZhciBjb3VudGVyID0gMFxyXG4gIHJldHVybiBmdW5jdGlvbigpIHtcclxuICAgIHZhciBpZCA9IChcInBqYXhcIiArIChuZXcgRGF0ZSgpLmdldFRpbWUoKSkpICsgXCJfXCIgKyBjb3VudGVyXHJcbiAgICBjb3VudGVyKytcclxuICAgIHJldHVybiBpZFxyXG4gIH1cclxufSkoKVxyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9iaikge1xyXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xyXG4gIGlmIChudWxsID09PSBvYmogfHwgXCJvYmplY3RcIiAhPT0gdHlwZW9mIG9iaikge1xyXG4gICAgcmV0dXJuIG9ialxyXG4gIH1cclxuICB2YXIgY29weSA9IG9iai5jb25zdHJ1Y3RvcigpXHJcbiAgZm9yICh2YXIgYXR0ciBpbiBvYmopIHtcclxuICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkoYXR0cikpIHtcclxuICAgICAgY29weVthdHRyXSA9IG9ialthdHRyXVxyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gY29weVxyXG59XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY29udGFpbnMoZG9jLCBzZWxlY3RvcnMsIGVsKSB7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzZWxlY3RvcnMubGVuZ3RoOyBpKyspIHtcclxuICAgIHZhciBzZWxlY3RlZEVscyA9IGRvYy5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yc1tpXSlcclxuICAgIGZvciAodmFyIGogPSAwOyBqIDwgc2VsZWN0ZWRFbHMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgaWYgKHNlbGVjdGVkRWxzW2pdLmNvbnRhaW5zKGVsKSkge1xyXG4gICAgICAgIHJldHVybiB0cnVlXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiBmYWxzZVxyXG59XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odGFyZ2V0KSB7XHJcbiAgaWYgKHRhcmdldCA9PSBudWxsKSB7XHJcbiAgICByZXR1cm4gbnVsbFxyXG4gIH1cclxuXHJcbiAgdmFyIHRvID0gT2JqZWN0KHRhcmdldClcclxuXHJcbiAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcclxuICAgIHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV1cclxuXHJcbiAgICBpZiAoc291cmNlICE9IG51bGwpIHtcclxuICAgICAgZm9yICh2YXIga2V5IGluIHNvdXJjZSkge1xyXG4gICAgICAgIC8vIEF2b2lkIGJ1Z3Mgd2hlbiBoYXNPd25Qcm9wZXJ0eSBpcyBzaGFkb3dlZFxyXG4gICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7XHJcbiAgICAgICAgICB0b1trZXldID0gc291cmNlW2tleV1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIHRvXHJcbn1cclxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHt9XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odXJpLCBrZXksIHZhbHVlKSB7XHJcbiAgdmFyIHJlID0gbmV3IFJlZ0V4cChcIihbPyZdKVwiICsga2V5ICsgXCI9Lio/KCZ8JClcIiwgXCJpXCIpXHJcbiAgdmFyIHNlcGFyYXRvciA9IHVyaS5pbmRleE9mKFwiP1wiKSAhPT0gLTEgPyBcIiZcIiA6IFwiP1wiXHJcbiAgaWYgKHVyaS5tYXRjaChyZSkpIHtcclxuICAgIHJldHVybiB1cmkucmVwbGFjZShyZSwgXCIkMVwiICsga2V5ICsgXCI9XCIgKyB2YWx1ZSArIFwiJDJcIilcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICByZXR1cm4gdXJpICsgc2VwYXJhdG9yICsga2V5ICsgXCI9XCIgKyB2YWx1ZVxyXG4gIH1cclxufVxyXG4iLCIhZnVuY3Rpb24odCxlKXtcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyYmXCJvYmplY3RcIj09dHlwZW9mIG1vZHVsZT9tb2R1bGUuZXhwb3J0cz1lKCk6XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXSxlKTpcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cz9leHBvcnRzLlNjcm9sbGJhcj1lKCk6dC5TY3JvbGxiYXI9ZSgpfSh0aGlzLGZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQpe2Z1bmN0aW9uIGUocil7aWYobltyXSlyZXR1cm4gbltyXS5leHBvcnRzO3ZhciBvPW5bcl09e2V4cG9ydHM6e30saWQ6cixsb2FkZWQ6ITF9O3JldHVybiB0W3JdLmNhbGwoby5leHBvcnRzLG8sby5leHBvcnRzLGUpLG8ubG9hZGVkPSEwLG8uZXhwb3J0c312YXIgbj17fTtyZXR1cm4gZS5tPXQsZS5jPW4sZS5wPVwiXCIsZSgwKX0oW2Z1bmN0aW9uKHQsZSxuKXt0LmV4cG9ydHM9bigxKX0sZnVuY3Rpb24odCxlLG4pe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIHIodCl7cmV0dXJuIHQmJnQuX19lc01vZHVsZT90OntkZWZhdWx0OnR9fWZ1bmN0aW9uIG8odCl7aWYoQXJyYXkuaXNBcnJheSh0KSl7Zm9yKHZhciBlPTAsbj1BcnJheSh0Lmxlbmd0aCk7ZTx0Lmxlbmd0aDtlKyspbltlXT10W2VdO3JldHVybiBufXJldHVybigwLHUuZGVmYXVsdCkodCl9dmFyIGk9bigyKSx1PXIoaSksYT1uKDU1KSxjPXIoYSksbD1uKDYyKSxmPXIobCk7T2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSk7dmFyIHM9XCJmdW5jdGlvblwiPT10eXBlb2YgZi5kZWZhdWx0JiZcInN5bWJvbFwiPT10eXBlb2YgYy5kZWZhdWx0P2Z1bmN0aW9uKHQpe3JldHVybiB0eXBlb2YgdH06ZnVuY3Rpb24odCl7cmV0dXJuIHQmJlwiZnVuY3Rpb25cIj09dHlwZW9mIGYuZGVmYXVsdCYmdC5jb25zdHJ1Y3Rvcj09PWYuZGVmYXVsdCYmdCE9PWYuZGVmYXVsdC5wcm90b3R5cGU/XCJzeW1ib2xcIjp0eXBlb2YgdH0sZD1uKDc3KSxoPW4oODgpO24oMTMzKSxuKDE1MCksbigxNjMpLG4oMTc4KSxuKDE5MyksZS5kZWZhdWx0PWQuU21vb3RoU2Nyb2xsYmFyLGQuU21vb3RoU2Nyb2xsYmFyLnZlcnNpb249XCI3LjMuMVwiLGQuU21vb3RoU2Nyb2xsYmFyLmluaXQ9ZnVuY3Rpb24odCxlKXtpZighdHx8MSE9PXQubm9kZVR5cGUpdGhyb3cgbmV3IFR5cGVFcnJvcihcImV4cGVjdCBlbGVtZW50IHRvIGJlIERPTSBFbGVtZW50LCBidXQgZ290IFwiKyhcInVuZGVmaW5lZFwiPT10eXBlb2YgdD9cInVuZGVmaW5lZFwiOnModCkpKTtpZihoLnNiTGlzdC5oYXModCkpcmV0dXJuIGguc2JMaXN0LmdldCh0KTt0LnNldEF0dHJpYnV0ZShcImRhdGEtc2Nyb2xsYmFyXCIsXCJcIik7dmFyIG49W10uY29uY2F0KG8odC5jaGlsZE5vZGVzKSkscj1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO3IuaW5uZXJIVE1MPSdcXG4gICAgICAgIDxhcnRpY2xlIGNsYXNzPVwic2Nyb2xsLWNvbnRlbnRcIj48L2FydGljbGU+XFxuICAgICAgICA8YXNpZGUgY2xhc3M9XCJzY3JvbGxiYXItdHJhY2sgc2Nyb2xsYmFyLXRyYWNrLXhcIj5cXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwic2Nyb2xsYmFyLXRodW1iIHNjcm9sbGJhci10aHVtYi14XCI+PC9kaXY+XFxuICAgICAgICA8L2FzaWRlPlxcbiAgICAgICAgPGFzaWRlIGNsYXNzPVwic2Nyb2xsYmFyLXRyYWNrIHNjcm9sbGJhci10cmFjay15XCI+XFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInNjcm9sbGJhci10aHVtYiBzY3JvbGxiYXItdGh1bWIteVwiPjwvZGl2PlxcbiAgICAgICAgPC9hc2lkZT5cXG4gICAgICAgIDxjYW52YXMgY2xhc3M9XCJvdmVyc2Nyb2xsLWdsb3dcIj48L2NhbnZhcz5cXG4gICAgJzt2YXIgaT1yLnF1ZXJ5U2VsZWN0b3IoXCIuc2Nyb2xsLWNvbnRlbnRcIik7cmV0dXJuW10uY29uY2F0KG8oci5jaGlsZE5vZGVzKSkuZm9yRWFjaChmdW5jdGlvbihlKXtyZXR1cm4gdC5hcHBlbmRDaGlsZChlKX0pLG4uZm9yRWFjaChmdW5jdGlvbih0KXtyZXR1cm4gaS5hcHBlbmRDaGlsZCh0KX0pLG5ldyBkLlNtb290aFNjcm9sbGJhcih0LGUpfSxkLlNtb290aFNjcm9sbGJhci5pbml0QWxsPWZ1bmN0aW9uKHQpe3JldHVybltdLmNvbmNhdChvKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoaC5zZWxlY3RvcnMpKSkubWFwKGZ1bmN0aW9uKGUpe3JldHVybiBkLlNtb290aFNjcm9sbGJhci5pbml0KGUsdCl9KX0sZC5TbW9vdGhTY3JvbGxiYXIuaGFzPWZ1bmN0aW9uKHQpe3JldHVybiBoLnNiTGlzdC5oYXModCl9LGQuU21vb3RoU2Nyb2xsYmFyLmdldD1mdW5jdGlvbih0KXtyZXR1cm4gaC5zYkxpc3QuZ2V0KHQpfSxkLlNtb290aFNjcm9sbGJhci5nZXRBbGw9ZnVuY3Rpb24oKXtyZXR1cm5bXS5jb25jYXQobyhoLnNiTGlzdC52YWx1ZXMoKSkpfSxkLlNtb290aFNjcm9sbGJhci5kZXN0cm95PWZ1bmN0aW9uKHQsZSl7cmV0dXJuIGQuU21vb3RoU2Nyb2xsYmFyLmhhcyh0KSYmZC5TbW9vdGhTY3JvbGxiYXIuZ2V0KHQpLmRlc3Ryb3koZSl9LGQuU21vb3RoU2Nyb2xsYmFyLmRlc3Ryb3lBbGw9ZnVuY3Rpb24odCl7aC5zYkxpc3QuZm9yRWFjaChmdW5jdGlvbihlKXtlLmRlc3Ryb3kodCl9KX0sdC5leHBvcnRzPWUuZGVmYXVsdH0sZnVuY3Rpb24odCxlLG4pe3QuZXhwb3J0cz17ZGVmYXVsdDpuKDMpLF9fZXNNb2R1bGU6ITB9fSxmdW5jdGlvbih0LGUsbil7big0KSxuKDQ4KSx0LmV4cG9ydHM9bigxMikuQXJyYXkuZnJvbX0sZnVuY3Rpb24odCxlLG4pe1widXNlIHN0cmljdFwiO3ZhciByPW4oNSkoITApO24oOCkoU3RyaW5nLFwiU3RyaW5nXCIsZnVuY3Rpb24odCl7dGhpcy5fdD1TdHJpbmcodCksdGhpcy5faT0wfSxmdW5jdGlvbigpe3ZhciB0LGU9dGhpcy5fdCxuPXRoaXMuX2k7cmV0dXJuIG4+PWUubGVuZ3RoP3t2YWx1ZTp2b2lkIDAsZG9uZTohMH06KHQ9cihlLG4pLHRoaXMuX2krPXQubGVuZ3RoLHt2YWx1ZTp0LGRvbmU6ITF9KX0pfSxmdW5jdGlvbih0LGUsbil7dmFyIHI9big2KSxvPW4oNyk7dC5leHBvcnRzPWZ1bmN0aW9uKHQpe3JldHVybiBmdW5jdGlvbihlLG4pe3ZhciBpLHUsYT1TdHJpbmcobyhlKSksYz1yKG4pLGw9YS5sZW5ndGg7cmV0dXJuIGM8MHx8Yz49bD90P1wiXCI6dm9pZCAwOihpPWEuY2hhckNvZGVBdChjKSxpPDU1Mjk2fHxpPjU2MzE5fHxjKzE9PT1sfHwodT1hLmNoYXJDb2RlQXQoYysxKSk8NTYzMjB8fHU+NTczNDM/dD9hLmNoYXJBdChjKTppOnQ/YS5zbGljZShjLGMrMik6KGktNTUyOTY8PDEwKSsodS01NjMyMCkrNjU1MzYpfX19LGZ1bmN0aW9uKHQsZSl7dmFyIG49TWF0aC5jZWlsLHI9TWF0aC5mbG9vcjt0LmV4cG9ydHM9ZnVuY3Rpb24odCl7cmV0dXJuIGlzTmFOKHQ9K3QpPzA6KHQ+MD9yOm4pKHQpfX0sZnVuY3Rpb24odCxlKXt0LmV4cG9ydHM9ZnVuY3Rpb24odCl7aWYodm9pZCAwPT10KXRocm93IFR5cGVFcnJvcihcIkNhbid0IGNhbGwgbWV0aG9kIG9uICBcIit0KTtyZXR1cm4gdH19LGZ1bmN0aW9uKHQsZSxuKXtcInVzZSBzdHJpY3RcIjt2YXIgcj1uKDkpLG89bigxMCksaT1uKDI2KSx1PW4oMTUpLGE9bigyNyksYz1uKDI4KSxsPW4oNDQpLGY9big0Nikscz1uKDQ1KShcIml0ZXJhdG9yXCIpLGQ9IShbXS5rZXlzJiZcIm5leHRcImluW10ua2V5cygpKSxoPVwiQEBpdGVyYXRvclwiLHY9XCJrZXlzXCIsXz1cInZhbHVlc1wiLHA9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpc307dC5leHBvcnRzPWZ1bmN0aW9uKHQsZSxuLHksYixnLG0pe2MobixlLHkpO3ZhciB4LFMsRSxNPWZ1bmN0aW9uKHQpe2lmKCFkJiZ0IGluIFQpcmV0dXJuIFRbdF07c3dpdGNoKHQpe2Nhc2UgdjpyZXR1cm4gZnVuY3Rpb24oKXtyZXR1cm4gbmV3IG4odGhpcyx0KX07Y2FzZSBfOnJldHVybiBmdW5jdGlvbigpe3JldHVybiBuZXcgbih0aGlzLHQpfX1yZXR1cm4gZnVuY3Rpb24oKXtyZXR1cm4gbmV3IG4odGhpcyx0KX19LE89ZStcIiBJdGVyYXRvclwiLHc9Yj09XyxQPSExLFQ9dC5wcm90b3R5cGUsaz1UW3NdfHxUW2hdfHxiJiZUW2JdLGo9a3x8TShiKSxBPWI/dz9NKFwiZW50cmllc1wiKTpqOnZvaWQgMCxMPVwiQXJyYXlcIj09ZT9ULmVudHJpZXN8fGs6aztpZihMJiYoRT1mKEwuY2FsbChuZXcgdCkpLEUhPT1PYmplY3QucHJvdG90eXBlJiZFLm5leHQmJihsKEUsTywhMCkscnx8XCJmdW5jdGlvblwiPT10eXBlb2YgRVtzXXx8dShFLHMscCkpKSx3JiZrJiZrLm5hbWUhPT1fJiYoUD0hMCxqPWZ1bmN0aW9uKCl7cmV0dXJuIGsuY2FsbCh0aGlzKX0pLHImJiFtfHwhZCYmIVAmJlRbc118fHUoVCxzLGopLGFbZV09aixhW09dPXAsYilpZih4PXt2YWx1ZXM6dz9qOk0oXyksa2V5czpnP2o6TSh2KSxlbnRyaWVzOkF9LG0pZm9yKFMgaW4geClTIGluIFR8fGkoVCxTLHhbU10pO2Vsc2UgbyhvLlArby5GKihkfHxQKSxlLHgpO3JldHVybiB4fX0sZnVuY3Rpb24odCxlKXt0LmV4cG9ydHM9ITB9LGZ1bmN0aW9uKHQsZSxuKXt2YXIgcj1uKDExKSxvPW4oMTIpLGk9bigxMyksdT1uKDE1KSxhPW4oMjUpLGM9XCJwcm90b3R5cGVcIixsPWZ1bmN0aW9uKHQsZSxuKXt2YXIgZixzLGQsaD10JmwuRix2PXQmbC5HLF89dCZsLlMscD10JmwuUCx5PXQmbC5CLGI9dCZsLlcsZz12P286b1tlXXx8KG9bZV09e30pLG09Z1tjXSx4PXY/cjpfP3JbZV06KHJbZV18fHt9KVtjXTt2JiYobj1lKTtmb3IoZiBpbiBuKXM9IWgmJngmJnZvaWQgMCE9PXhbZl0scyYmYShnLGYpfHwoZD1zP3hbZl06bltmXSxnW2ZdPXYmJlwiZnVuY3Rpb25cIiE9dHlwZW9mIHhbZl0/bltmXTp5JiZzP2koZCxyKTpiJiZ4W2ZdPT1kP2Z1bmN0aW9uKHQpe3ZhciBlPWZ1bmN0aW9uKGUsbixyKXtpZih0aGlzIGluc3RhbmNlb2YgdCl7c3dpdGNoKGFyZ3VtZW50cy5sZW5ndGgpe2Nhc2UgMDpyZXR1cm4gbmV3IHQ7Y2FzZSAxOnJldHVybiBuZXcgdChlKTtjYXNlIDI6cmV0dXJuIG5ldyB0KGUsbil9cmV0dXJuIG5ldyB0KGUsbixyKX1yZXR1cm4gdC5hcHBseSh0aGlzLGFyZ3VtZW50cyl9O3JldHVybiBlW2NdPXRbY10sZX0oZCk6cCYmXCJmdW5jdGlvblwiPT10eXBlb2YgZD9pKEZ1bmN0aW9uLmNhbGwsZCk6ZCxwJiYoKGcudmlydHVhbHx8KGcudmlydHVhbD17fSkpW2ZdPWQsdCZsLlImJm0mJiFtW2ZdJiZ1KG0sZixkKSkpfTtsLkY9MSxsLkc9MixsLlM9NCxsLlA9OCxsLkI9MTYsbC5XPTMyLGwuVT02NCxsLlI9MTI4LHQuZXhwb3J0cz1sfSxmdW5jdGlvbih0LGUpe3ZhciBuPXQuZXhwb3J0cz1cInVuZGVmaW5lZFwiIT10eXBlb2Ygd2luZG93JiZ3aW5kb3cuTWF0aD09TWF0aD93aW5kb3c6XCJ1bmRlZmluZWRcIiE9dHlwZW9mIHNlbGYmJnNlbGYuTWF0aD09TWF0aD9zZWxmOkZ1bmN0aW9uKFwicmV0dXJuIHRoaXNcIikoKTtcIm51bWJlclwiPT10eXBlb2YgX19nJiYoX19nPW4pfSxmdW5jdGlvbih0LGUpe3ZhciBuPXQuZXhwb3J0cz17dmVyc2lvbjpcIjIuNS43XCJ9O1wibnVtYmVyXCI9PXR5cGVvZiBfX2UmJihfX2U9bil9LGZ1bmN0aW9uKHQsZSxuKXt2YXIgcj1uKDE0KTt0LmV4cG9ydHM9ZnVuY3Rpb24odCxlLG4pe2lmKHIodCksdm9pZCAwPT09ZSlyZXR1cm4gdDtzd2l0Y2gobil7Y2FzZSAxOnJldHVybiBmdW5jdGlvbihuKXtyZXR1cm4gdC5jYWxsKGUsbil9O2Nhc2UgMjpyZXR1cm4gZnVuY3Rpb24obixyKXtyZXR1cm4gdC5jYWxsKGUsbixyKX07Y2FzZSAzOnJldHVybiBmdW5jdGlvbihuLHIsbyl7cmV0dXJuIHQuY2FsbChlLG4scixvKX19cmV0dXJuIGZ1bmN0aW9uKCl7cmV0dXJuIHQuYXBwbHkoZSxhcmd1bWVudHMpfX19LGZ1bmN0aW9uKHQsZSl7dC5leHBvcnRzPWZ1bmN0aW9uKHQpe2lmKFwiZnVuY3Rpb25cIiE9dHlwZW9mIHQpdGhyb3cgVHlwZUVycm9yKHQrXCIgaXMgbm90IGEgZnVuY3Rpb24hXCIpO3JldHVybiB0fX0sZnVuY3Rpb24odCxlLG4pe3ZhciByPW4oMTYpLG89bigyNCk7dC5leHBvcnRzPW4oMjApP2Z1bmN0aW9uKHQsZSxuKXtyZXR1cm4gci5mKHQsZSxvKDEsbikpfTpmdW5jdGlvbih0LGUsbil7cmV0dXJuIHRbZV09bix0fX0sZnVuY3Rpb24odCxlLG4pe3ZhciByPW4oMTcpLG89bigxOSksaT1uKDIzKSx1PU9iamVjdC5kZWZpbmVQcm9wZXJ0eTtlLmY9bigyMCk/T2JqZWN0LmRlZmluZVByb3BlcnR5OmZ1bmN0aW9uKHQsZSxuKXtpZihyKHQpLGU9aShlLCEwKSxyKG4pLG8pdHJ5e3JldHVybiB1KHQsZSxuKX1jYXRjaCh0KXt9aWYoXCJnZXRcImluIG58fFwic2V0XCJpbiBuKXRocm93IFR5cGVFcnJvcihcIkFjY2Vzc29ycyBub3Qgc3VwcG9ydGVkIVwiKTtyZXR1cm5cInZhbHVlXCJpbiBuJiYodFtlXT1uLnZhbHVlKSx0fX0sZnVuY3Rpb24odCxlLG4pe3ZhciByPW4oMTgpO3QuZXhwb3J0cz1mdW5jdGlvbih0KXtpZighcih0KSl0aHJvdyBUeXBlRXJyb3IodCtcIiBpcyBub3QgYW4gb2JqZWN0IVwiKTtyZXR1cm4gdH19LGZ1bmN0aW9uKHQsZSl7dC5leHBvcnRzPWZ1bmN0aW9uKHQpe3JldHVyblwib2JqZWN0XCI9PXR5cGVvZiB0P251bGwhPT10OlwiZnVuY3Rpb25cIj09dHlwZW9mIHR9fSxmdW5jdGlvbih0LGUsbil7dC5leHBvcnRzPSFuKDIwKSYmIW4oMjEpKGZ1bmN0aW9uKCl7cmV0dXJuIDchPU9iamVjdC5kZWZpbmVQcm9wZXJ0eShuKDIyKShcImRpdlwiKSxcImFcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIDd9fSkuYX0pfSxmdW5jdGlvbih0LGUsbil7dC5leHBvcnRzPSFuKDIxKShmdW5jdGlvbigpe3JldHVybiA3IT1PYmplY3QuZGVmaW5lUHJvcGVydHkoe30sXCJhXCIse2dldDpmdW5jdGlvbigpe3JldHVybiA3fX0pLmF9KX0sZnVuY3Rpb24odCxlKXt0LmV4cG9ydHM9ZnVuY3Rpb24odCl7dHJ5e3JldHVybiEhdCgpfWNhdGNoKHQpe3JldHVybiEwfX19LGZ1bmN0aW9uKHQsZSxuKXt2YXIgcj1uKDE4KSxvPW4oMTEpLmRvY3VtZW50LGk9cihvKSYmcihvLmNyZWF0ZUVsZW1lbnQpO3QuZXhwb3J0cz1mdW5jdGlvbih0KXtyZXR1cm4gaT9vLmNyZWF0ZUVsZW1lbnQodCk6e319fSxmdW5jdGlvbih0LGUsbil7dmFyIHI9bigxOCk7dC5leHBvcnRzPWZ1bmN0aW9uKHQsZSl7aWYoIXIodCkpcmV0dXJuIHQ7dmFyIG4sbztpZihlJiZcImZ1bmN0aW9uXCI9PXR5cGVvZihuPXQudG9TdHJpbmcpJiYhcihvPW4uY2FsbCh0KSkpcmV0dXJuIG87aWYoXCJmdW5jdGlvblwiPT10eXBlb2Yobj10LnZhbHVlT2YpJiYhcihvPW4uY2FsbCh0KSkpcmV0dXJuIG87aWYoIWUmJlwiZnVuY3Rpb25cIj09dHlwZW9mKG49dC50b1N0cmluZykmJiFyKG89bi5jYWxsKHQpKSlyZXR1cm4gbzt0aHJvdyBUeXBlRXJyb3IoXCJDYW4ndCBjb252ZXJ0IG9iamVjdCB0byBwcmltaXRpdmUgdmFsdWVcIil9fSxmdW5jdGlvbih0LGUpe3QuZXhwb3J0cz1mdW5jdGlvbih0LGUpe3JldHVybntlbnVtZXJhYmxlOiEoMSZ0KSxjb25maWd1cmFibGU6ISgyJnQpLHdyaXRhYmxlOiEoNCZ0KSx2YWx1ZTplfX19LGZ1bmN0aW9uKHQsZSl7dmFyIG49e30uaGFzT3duUHJvcGVydHk7dC5leHBvcnRzPWZ1bmN0aW9uKHQsZSl7cmV0dXJuIG4uY2FsbCh0LGUpfX0sZnVuY3Rpb24odCxlLG4pe3QuZXhwb3J0cz1uKDE1KX0sZnVuY3Rpb24odCxlKXt0LmV4cG9ydHM9e319LGZ1bmN0aW9uKHQsZSxuKXtcInVzZSBzdHJpY3RcIjt2YXIgcj1uKDI5KSxvPW4oMjQpLGk9big0NCksdT17fTtuKDE1KSh1LG4oNDUpKFwiaXRlcmF0b3JcIiksZnVuY3Rpb24oKXtyZXR1cm4gdGhpc30pLHQuZXhwb3J0cz1mdW5jdGlvbih0LGUsbil7dC5wcm90b3R5cGU9cih1LHtuZXh0Om8oMSxuKX0pLGkodCxlK1wiIEl0ZXJhdG9yXCIpfX0sZnVuY3Rpb24odCxlLG4pe3ZhciByPW4oMTcpLG89bigzMCksaT1uKDQyKSx1PW4oMzkpKFwiSUVfUFJPVE9cIiksYT1mdW5jdGlvbigpe30sYz1cInByb3RvdHlwZVwiLGw9ZnVuY3Rpb24oKXt2YXIgdCxlPW4oMjIpKFwiaWZyYW1lXCIpLHI9aS5sZW5ndGgsbz1cIjxcIix1PVwiPlwiO2ZvcihlLnN0eWxlLmRpc3BsYXk9XCJub25lXCIsbig0MykuYXBwZW5kQ2hpbGQoZSksZS5zcmM9XCJqYXZhc2NyaXB0OlwiLHQ9ZS5jb250ZW50V2luZG93LmRvY3VtZW50LHQub3BlbigpLHQud3JpdGUobytcInNjcmlwdFwiK3UrXCJkb2N1bWVudC5GPU9iamVjdFwiK28rXCIvc2NyaXB0XCIrdSksdC5jbG9zZSgpLGw9dC5GO3ItLTspZGVsZXRlIGxbY11baVtyXV07cmV0dXJuIGwoKX07dC5leHBvcnRzPU9iamVjdC5jcmVhdGV8fGZ1bmN0aW9uKHQsZSl7dmFyIG47cmV0dXJuIG51bGwhPT10PyhhW2NdPXIodCksbj1uZXcgYSxhW2NdPW51bGwsblt1XT10KTpuPWwoKSx2b2lkIDA9PT1lP246byhuLGUpfX0sZnVuY3Rpb24odCxlLG4pe3ZhciByPW4oMTYpLG89bigxNyksaT1uKDMxKTt0LmV4cG9ydHM9bigyMCk/T2JqZWN0LmRlZmluZVByb3BlcnRpZXM6ZnVuY3Rpb24odCxlKXtvKHQpO2Zvcih2YXIgbix1PWkoZSksYT11Lmxlbmd0aCxjPTA7YT5jOylyLmYodCxuPXVbYysrXSxlW25dKTtyZXR1cm4gdH19LGZ1bmN0aW9uKHQsZSxuKXt2YXIgcj1uKDMyKSxvPW4oNDIpO3QuZXhwb3J0cz1PYmplY3Qua2V5c3x8ZnVuY3Rpb24odCl7cmV0dXJuIHIodCxvKX19LGZ1bmN0aW9uKHQsZSxuKXt2YXIgcj1uKDI1KSxvPW4oMzMpLGk9bigzNikoITEpLHU9bigzOSkoXCJJRV9QUk9UT1wiKTt0LmV4cG9ydHM9ZnVuY3Rpb24odCxlKXt2YXIgbixhPW8odCksYz0wLGw9W107Zm9yKG4gaW4gYSluIT11JiZyKGEsbikmJmwucHVzaChuKTtmb3IoO2UubGVuZ3RoPmM7KXIoYSxuPWVbYysrXSkmJih+aShsLG4pfHxsLnB1c2gobikpO3JldHVybiBsfX0sZnVuY3Rpb24odCxlLG4pe3ZhciByPW4oMzQpLG89big3KTt0LmV4cG9ydHM9ZnVuY3Rpb24odCl7cmV0dXJuIHIobyh0KSl9fSxmdW5jdGlvbih0LGUsbil7dmFyIHI9bigzNSk7dC5leHBvcnRzPU9iamVjdChcInpcIikucHJvcGVydHlJc0VudW1lcmFibGUoMCk/T2JqZWN0OmZ1bmN0aW9uKHQpe3JldHVyblwiU3RyaW5nXCI9PXIodCk/dC5zcGxpdChcIlwiKTpPYmplY3QodCl9fSxmdW5jdGlvbih0LGUpe3ZhciBuPXt9LnRvU3RyaW5nO3QuZXhwb3J0cz1mdW5jdGlvbih0KXtyZXR1cm4gbi5jYWxsKHQpLnNsaWNlKDgsLTEpfX0sZnVuY3Rpb24odCxlLG4pe3ZhciByPW4oMzMpLG89bigzNyksaT1uKDM4KTt0LmV4cG9ydHM9ZnVuY3Rpb24odCl7cmV0dXJuIGZ1bmN0aW9uKGUsbix1KXt2YXIgYSxjPXIoZSksbD1vKGMubGVuZ3RoKSxmPWkodSxsKTtpZih0JiZuIT1uKXtmb3IoO2w+ZjspaWYoYT1jW2YrK10sYSE9YSlyZXR1cm4hMH1lbHNlIGZvcig7bD5mO2YrKylpZigodHx8ZiBpbiBjKSYmY1tmXT09PW4pcmV0dXJuIHR8fGZ8fDA7cmV0dXJuIXQmJi0xfX19LGZ1bmN0aW9uKHQsZSxuKXt2YXIgcj1uKDYpLG89TWF0aC5taW47dC5leHBvcnRzPWZ1bmN0aW9uKHQpe3JldHVybiB0PjA/byhyKHQpLDkwMDcxOTkyNTQ3NDA5OTEpOjB9fSxmdW5jdGlvbih0LGUsbil7dmFyIHI9big2KSxvPU1hdGgubWF4LGk9TWF0aC5taW47dC5leHBvcnRzPWZ1bmN0aW9uKHQsZSl7cmV0dXJuIHQ9cih0KSx0PDA/byh0K2UsMCk6aSh0LGUpfX0sZnVuY3Rpb24odCxlLG4pe3ZhciByPW4oNDApKFwia2V5c1wiKSxvPW4oNDEpO3QuZXhwb3J0cz1mdW5jdGlvbih0KXtyZXR1cm4gclt0XXx8KHJbdF09byh0KSl9fSxmdW5jdGlvbih0LGUsbil7dmFyIHI9bigxMiksbz1uKDExKSxpPVwiX19jb3JlLWpzX3NoYXJlZF9fXCIsdT1vW2ldfHwob1tpXT17fSk7KHQuZXhwb3J0cz1mdW5jdGlvbih0LGUpe3JldHVybiB1W3RdfHwodVt0XT12b2lkIDAhPT1lP2U6e30pfSkoXCJ2ZXJzaW9uc1wiLFtdKS5wdXNoKHt2ZXJzaW9uOnIudmVyc2lvbixtb2RlOm4oOSk/XCJwdXJlXCI6XCJnbG9iYWxcIixjb3B5cmlnaHQ6XCLCqSAyMDE4IERlbmlzIFB1c2hrYXJldiAoemxvaXJvY2sucnUpXCJ9KX0sZnVuY3Rpb24odCxlKXt2YXIgbj0wLHI9TWF0aC5yYW5kb20oKTt0LmV4cG9ydHM9ZnVuY3Rpb24odCl7cmV0dXJuXCJTeW1ib2woXCIuY29uY2F0KHZvaWQgMD09PXQ/XCJcIjp0LFwiKV9cIiwoKytuK3IpLnRvU3RyaW5nKDM2KSl9fSxmdW5jdGlvbih0LGUpe3QuZXhwb3J0cz1cImNvbnN0cnVjdG9yLGhhc093blByb3BlcnR5LGlzUHJvdG90eXBlT2YscHJvcGVydHlJc0VudW1lcmFibGUsdG9Mb2NhbGVTdHJpbmcsdG9TdHJpbmcsdmFsdWVPZlwiLnNwbGl0KFwiLFwiKX0sZnVuY3Rpb24odCxlLG4pe3ZhciByPW4oMTEpLmRvY3VtZW50O3QuZXhwb3J0cz1yJiZyLmRvY3VtZW50RWxlbWVudH0sZnVuY3Rpb24odCxlLG4pe3ZhciByPW4oMTYpLmYsbz1uKDI1KSxpPW4oNDUpKFwidG9TdHJpbmdUYWdcIik7dC5leHBvcnRzPWZ1bmN0aW9uKHQsZSxuKXt0JiYhbyh0PW4/dDp0LnByb3RvdHlwZSxpKSYmcih0LGkse2NvbmZpZ3VyYWJsZTohMCx2YWx1ZTplfSl9fSxmdW5jdGlvbih0LGUsbil7dmFyIHI9big0MCkoXCJ3a3NcIiksbz1uKDQxKSxpPW4oMTEpLlN5bWJvbCx1PVwiZnVuY3Rpb25cIj09dHlwZW9mIGksYT10LmV4cG9ydHM9ZnVuY3Rpb24odCl7cmV0dXJuIHJbdF18fChyW3RdPXUmJmlbdF18fCh1P2k6bykoXCJTeW1ib2wuXCIrdCkpfTthLnN0b3JlPXJ9LGZ1bmN0aW9uKHQsZSxuKXt2YXIgcj1uKDI1KSxvPW4oNDcpLGk9bigzOSkoXCJJRV9QUk9UT1wiKSx1PU9iamVjdC5wcm90b3R5cGU7dC5leHBvcnRzPU9iamVjdC5nZXRQcm90b3R5cGVPZnx8ZnVuY3Rpb24odCl7cmV0dXJuIHQ9byh0KSxyKHQsaSk/dFtpXTpcImZ1bmN0aW9uXCI9PXR5cGVvZiB0LmNvbnN0cnVjdG9yJiZ0IGluc3RhbmNlb2YgdC5jb25zdHJ1Y3Rvcj90LmNvbnN0cnVjdG9yLnByb3RvdHlwZTp0IGluc3RhbmNlb2YgT2JqZWN0P3U6bnVsbH19LGZ1bmN0aW9uKHQsZSxuKXt2YXIgcj1uKDcpO3QuZXhwb3J0cz1mdW5jdGlvbih0KXtyZXR1cm4gT2JqZWN0KHIodCkpfX0sZnVuY3Rpb24odCxlLG4pe1widXNlIHN0cmljdFwiO3ZhciByPW4oMTMpLG89bigxMCksaT1uKDQ3KSx1PW4oNDkpLGE9big1MCksYz1uKDM3KSxsPW4oNTEpLGY9big1Mik7byhvLlMrby5GKiFuKDU0KShmdW5jdGlvbih0KXtBcnJheS5mcm9tKHQpfSksXCJBcnJheVwiLHtmcm9tOmZ1bmN0aW9uKHQpe3ZhciBlLG4sbyxzLGQ9aSh0KSxoPVwiZnVuY3Rpb25cIj09dHlwZW9mIHRoaXM/dGhpczpBcnJheSx2PWFyZ3VtZW50cy5sZW5ndGgsXz12PjE/YXJndW1lbnRzWzFdOnZvaWQgMCxwPXZvaWQgMCE9PV8seT0wLGI9ZihkKTtpZihwJiYoXz1yKF8sdj4yP2FyZ3VtZW50c1syXTp2b2lkIDAsMikpLHZvaWQgMD09Ynx8aD09QXJyYXkmJmEoYikpZm9yKGU9YyhkLmxlbmd0aCksbj1uZXcgaChlKTtlPnk7eSsrKWwobix5LHA/XyhkW3ldLHkpOmRbeV0pO2Vsc2UgZm9yKHM9Yi5jYWxsKGQpLG49bmV3IGg7IShvPXMubmV4dCgpKS5kb25lO3krKylsKG4seSxwP3UocyxfLFtvLnZhbHVlLHldLCEwKTpvLnZhbHVlKTtyZXR1cm4gbi5sZW5ndGg9eSxufX0pfSxmdW5jdGlvbih0LGUsbil7dmFyIHI9bigxNyk7dC5leHBvcnRzPWZ1bmN0aW9uKHQsZSxuLG8pe3RyeXtyZXR1cm4gbz9lKHIobilbMF0sblsxXSk6ZShuKX1jYXRjaChlKXt2YXIgaT10LnJldHVybjt0aHJvdyB2b2lkIDAhPT1pJiZyKGkuY2FsbCh0KSksZX19fSxmdW5jdGlvbih0LGUsbil7dmFyIHI9bigyNyksbz1uKDQ1KShcIml0ZXJhdG9yXCIpLGk9QXJyYXkucHJvdG90eXBlO3QuZXhwb3J0cz1mdW5jdGlvbih0KXtyZXR1cm4gdm9pZCAwIT09dCYmKHIuQXJyYXk9PT10fHxpW29dPT09dCl9fSxmdW5jdGlvbih0LGUsbil7XCJ1c2Ugc3RyaWN0XCI7dmFyIHI9bigxNiksbz1uKDI0KTt0LmV4cG9ydHM9ZnVuY3Rpb24odCxlLG4pe2UgaW4gdD9yLmYodCxlLG8oMCxuKSk6dFtlXT1ufX0sZnVuY3Rpb24odCxlLG4pe3ZhciByPW4oNTMpLG89big0NSkoXCJpdGVyYXRvclwiKSxpPW4oMjcpO3QuZXhwb3J0cz1uKDEyKS5nZXRJdGVyYXRvck1ldGhvZD1mdW5jdGlvbih0KXtpZih2b2lkIDAhPXQpcmV0dXJuIHRbb118fHRbXCJAQGl0ZXJhdG9yXCJdfHxpW3IodCldfX0sZnVuY3Rpb24odCxlLG4pe3ZhciByPW4oMzUpLG89big0NSkoXCJ0b1N0cmluZ1RhZ1wiKSxpPVwiQXJndW1lbnRzXCI9PXIoZnVuY3Rpb24oKXtyZXR1cm4gYXJndW1lbnRzfSgpKSx1PWZ1bmN0aW9uKHQsZSl7dHJ5e3JldHVybiB0W2VdfWNhdGNoKHQpe319O3QuZXhwb3J0cz1mdW5jdGlvbih0KXt2YXIgZSxuLGE7cmV0dXJuIHZvaWQgMD09PXQ/XCJVbmRlZmluZWRcIjpudWxsPT09dD9cIk51bGxcIjpcInN0cmluZ1wiPT10eXBlb2Yobj11KGU9T2JqZWN0KHQpLG8pKT9uOmk/cihlKTpcIk9iamVjdFwiPT0oYT1yKGUpKSYmXCJmdW5jdGlvblwiPT10eXBlb2YgZS5jYWxsZWU/XCJBcmd1bWVudHNcIjphfX0sZnVuY3Rpb24odCxlLG4pe3ZhciByPW4oNDUpKFwiaXRlcmF0b3JcIiksbz0hMTt0cnl7dmFyIGk9WzddW3JdKCk7aS5yZXR1cm49ZnVuY3Rpb24oKXtvPSEwfSxBcnJheS5mcm9tKGksZnVuY3Rpb24oKXt0aHJvdyAyfSl9Y2F0Y2godCl7fXQuZXhwb3J0cz1mdW5jdGlvbih0LGUpe2lmKCFlJiYhbylyZXR1cm4hMTt2YXIgbj0hMTt0cnl7dmFyIGk9WzddLHU9aVtyXSgpO3UubmV4dD1mdW5jdGlvbigpe3JldHVybntkb25lOm49ITB9fSxpW3JdPWZ1bmN0aW9uKCl7cmV0dXJuIHV9LHQoaSl9Y2F0Y2godCl7fXJldHVybiBufX0sZnVuY3Rpb24odCxlLG4pe3QuZXhwb3J0cz17ZGVmYXVsdDpuKDU2KSxfX2VzTW9kdWxlOiEwfX0sZnVuY3Rpb24odCxlLG4pe24oNCksbig1NyksdC5leHBvcnRzPW4oNjEpLmYoXCJpdGVyYXRvclwiKX0sZnVuY3Rpb24odCxlLG4pe24oNTgpO2Zvcih2YXIgcj1uKDExKSxvPW4oMTUpLGk9bigyNyksdT1uKDQ1KShcInRvU3RyaW5nVGFnXCIpLGE9XCJDU1NSdWxlTGlzdCxDU1NTdHlsZURlY2xhcmF0aW9uLENTU1ZhbHVlTGlzdCxDbGllbnRSZWN0TGlzdCxET01SZWN0TGlzdCxET01TdHJpbmdMaXN0LERPTVRva2VuTGlzdCxEYXRhVHJhbnNmZXJJdGVtTGlzdCxGaWxlTGlzdCxIVE1MQWxsQ29sbGVjdGlvbixIVE1MQ29sbGVjdGlvbixIVE1MRm9ybUVsZW1lbnQsSFRNTFNlbGVjdEVsZW1lbnQsTWVkaWFMaXN0LE1pbWVUeXBlQXJyYXksTmFtZWROb2RlTWFwLE5vZGVMaXN0LFBhaW50UmVxdWVzdExpc3QsUGx1Z2luLFBsdWdpbkFycmF5LFNWR0xlbmd0aExpc3QsU1ZHTnVtYmVyTGlzdCxTVkdQYXRoU2VnTGlzdCxTVkdQb2ludExpc3QsU1ZHU3RyaW5nTGlzdCxTVkdUcmFuc2Zvcm1MaXN0LFNvdXJjZUJ1ZmZlckxpc3QsU3R5bGVTaGVldExpc3QsVGV4dFRyYWNrQ3VlTGlzdCxUZXh0VHJhY2tMaXN0LFRvdWNoTGlzdFwiLnNwbGl0KFwiLFwiKSxjPTA7YzxhLmxlbmd0aDtjKyspe3ZhciBsPWFbY10sZj1yW2xdLHM9ZiYmZi5wcm90b3R5cGU7cyYmIXNbdV0mJm8ocyx1LGwpLGlbbF09aS5BcnJheX19LGZ1bmN0aW9uKHQsZSxuKXtcInVzZSBzdHJpY3RcIjt2YXIgcj1uKDU5KSxvPW4oNjApLGk9bigyNyksdT1uKDMzKTt0LmV4cG9ydHM9big4KShBcnJheSxcIkFycmF5XCIsZnVuY3Rpb24odCxlKXt0aGlzLl90PXUodCksdGhpcy5faT0wLHRoaXMuX2s9ZX0sZnVuY3Rpb24oKXt2YXIgdD10aGlzLl90LGU9dGhpcy5fayxuPXRoaXMuX2krKztyZXR1cm4hdHx8bj49dC5sZW5ndGg/KHRoaXMuX3Q9dm9pZCAwLG8oMSkpOlwia2V5c1wiPT1lP28oMCxuKTpcInZhbHVlc1wiPT1lP28oMCx0W25dKTpvKDAsW24sdFtuXV0pfSxcInZhbHVlc1wiKSxpLkFyZ3VtZW50cz1pLkFycmF5LHIoXCJrZXlzXCIpLHIoXCJ2YWx1ZXNcIikscihcImVudHJpZXNcIil9LGZ1bmN0aW9uKHQsZSl7dC5leHBvcnRzPWZ1bmN0aW9uKCl7fX0sZnVuY3Rpb24odCxlKXt0LmV4cG9ydHM9ZnVuY3Rpb24odCxlKXtyZXR1cm57dmFsdWU6ZSxkb25lOiEhdH19fSxmdW5jdGlvbih0LGUsbil7ZS5mPW4oNDUpfSxmdW5jdGlvbih0LGUsbil7dC5leHBvcnRzPXtkZWZhdWx0Om4oNjMpLF9fZXNNb2R1bGU6ITB9fSxmdW5jdGlvbih0LGUsbil7big2NCksbig3NCksbig3NSksbig3NiksdC5leHBvcnRzPW4oMTIpLlN5bWJvbH0sZnVuY3Rpb24odCxlLG4pe1widXNlIHN0cmljdFwiO3ZhciByPW4oMTEpLG89bigyNSksaT1uKDIwKSx1PW4oMTApLGE9bigyNiksYz1uKDY1KS5LRVksbD1uKDIxKSxmPW4oNDApLHM9big0NCksZD1uKDQxKSxoPW4oNDUpLHY9big2MSksXz1uKDY2KSxwPW4oNjcpLHk9big3MCksYj1uKDE3KSxnPW4oMTgpLG09bigzMykseD1uKDIzKSxTPW4oMjQpLEU9bigyOSksTT1uKDcxKSxPPW4oNzMpLHc9bigxNiksUD1uKDMxKSxUPU8uZixrPXcuZixqPU0uZixBPXIuU3ltYm9sLEw9ci5KU09OLFI9TCYmTC5zdHJpbmdpZnksRD1cInByb3RvdHlwZVwiLEM9aChcIl9oaWRkZW5cIiksST1oKFwidG9QcmltaXRpdmVcIiksTj17fS5wcm9wZXJ0eUlzRW51bWVyYWJsZSxGPWYoXCJzeW1ib2wtcmVnaXN0cnlcIiksSD1mKFwic3ltYm9sc1wiKSx6PWYoXCJvcC1zeW1ib2xzXCIpLEI9T2JqZWN0W0RdLEc9XCJmdW5jdGlvblwiPT10eXBlb2YgQSxWPXIuUU9iamVjdCxXPSFWfHwhVltEXXx8IVZbRF0uZmluZENoaWxkLEs9aSYmbChmdW5jdGlvbigpe3JldHVybiA3IT1FKGsoe30sXCJhXCIse2dldDpmdW5jdGlvbigpe3JldHVybiBrKHRoaXMsXCJhXCIse3ZhbHVlOjd9KS5hfX0pKS5hfSk/ZnVuY3Rpb24odCxlLG4pe3ZhciByPVQoQixlKTtyJiZkZWxldGUgQltlXSxrKHQsZSxuKSxyJiZ0IT09QiYmayhCLGUscil9OmssVT1mdW5jdGlvbih0KXt2YXIgZT1IW3RdPUUoQVtEXSk7cmV0dXJuIGUuX2s9dCxlfSxZPUcmJlwic3ltYm9sXCI9PXR5cGVvZiBBLml0ZXJhdG9yP2Z1bmN0aW9uKHQpe3JldHVyblwic3ltYm9sXCI9PXR5cGVvZiB0fTpmdW5jdGlvbih0KXtyZXR1cm4gdCBpbnN0YW5jZW9mIEF9LHE9ZnVuY3Rpb24odCxlLG4pe3JldHVybiB0PT09QiYmcSh6LGUsbiksYih0KSxlPXgoZSwhMCksYihuKSxvKEgsZSk/KG4uZW51bWVyYWJsZT8obyh0LEMpJiZ0W0NdW2VdJiYodFtDXVtlXT0hMSksbj1FKG4se2VudW1lcmFibGU6UygwLCExKX0pKToobyh0LEMpfHxrKHQsQyxTKDEse30pKSx0W0NdW2VdPSEwKSxLKHQsZSxuKSk6ayh0LGUsbil9LFg9ZnVuY3Rpb24odCxlKXtiKHQpO2Zvcih2YXIgbixyPXAoZT1tKGUpKSxvPTAsaT1yLmxlbmd0aDtpPm87KXEodCxuPXJbbysrXSxlW25dKTtyZXR1cm4gdH0sSj1mdW5jdGlvbih0LGUpe3JldHVybiB2b2lkIDA9PT1lP0UodCk6WChFKHQpLGUpfSxRPWZ1bmN0aW9uKHQpe3ZhciBlPU4uY2FsbCh0aGlzLHQ9eCh0LCEwKSk7cmV0dXJuISh0aGlzPT09QiYmbyhILHQpJiYhbyh6LHQpKSYmKCEoZXx8IW8odGhpcyx0KXx8IW8oSCx0KXx8byh0aGlzLEMpJiZ0aGlzW0NdW3RdKXx8ZSl9LFo9ZnVuY3Rpb24odCxlKXtpZih0PW0odCksZT14KGUsITApLHQhPT1CfHwhbyhILGUpfHxvKHosZSkpe3ZhciBuPVQodCxlKTtyZXR1cm4hbnx8IW8oSCxlKXx8byh0LEMpJiZ0W0NdW2VdfHwobi5lbnVtZXJhYmxlPSEwKSxufX0sJD1mdW5jdGlvbih0KXtmb3IodmFyIGUsbj1qKG0odCkpLHI9W10saT0wO24ubGVuZ3RoPmk7KW8oSCxlPW5baSsrXSl8fGU9PUN8fGU9PWN8fHIucHVzaChlKTtyZXR1cm4gcn0sdHQ9ZnVuY3Rpb24odCl7Zm9yKHZhciBlLG49dD09PUIscj1qKG4/ejptKHQpKSxpPVtdLHU9MDtyLmxlbmd0aD51OykhbyhILGU9clt1KytdKXx8biYmIW8oQixlKXx8aS5wdXNoKEhbZV0pO3JldHVybiBpfTtHfHwoQT1mdW5jdGlvbigpe2lmKHRoaXMgaW5zdGFuY2VvZiBBKXRocm93IFR5cGVFcnJvcihcIlN5bWJvbCBpcyBub3QgYSBjb25zdHJ1Y3RvciFcIik7dmFyIHQ9ZChhcmd1bWVudHMubGVuZ3RoPjA/YXJndW1lbnRzWzBdOnZvaWQgMCksZT1mdW5jdGlvbihuKXt0aGlzPT09QiYmZS5jYWxsKHosbiksbyh0aGlzLEMpJiZvKHRoaXNbQ10sdCkmJih0aGlzW0NdW3RdPSExKSxLKHRoaXMsdCxTKDEsbikpfTtyZXR1cm4gaSYmVyYmSyhCLHQse2NvbmZpZ3VyYWJsZTohMCxzZXQ6ZX0pLFUodCl9LGEoQVtEXSxcInRvU3RyaW5nXCIsZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fa30pLE8uZj1aLHcuZj1xLG4oNzIpLmY9TS5mPSQsbig2OSkuZj1RLG4oNjgpLmY9dHQsaSYmIW4oOSkmJmEoQixcInByb3BlcnR5SXNFbnVtZXJhYmxlXCIsUSwhMCksdi5mPWZ1bmN0aW9uKHQpe3JldHVybiBVKGgodCkpfSksdSh1LkcrdS5XK3UuRiohRyx7U3ltYm9sOkF9KTtmb3IodmFyIGV0PVwiaGFzSW5zdGFuY2UsaXNDb25jYXRTcHJlYWRhYmxlLGl0ZXJhdG9yLG1hdGNoLHJlcGxhY2Usc2VhcmNoLHNwZWNpZXMsc3BsaXQsdG9QcmltaXRpdmUsdG9TdHJpbmdUYWcsdW5zY29wYWJsZXNcIi5zcGxpdChcIixcIiksbnQ9MDtldC5sZW5ndGg+bnQ7KWgoZXRbbnQrK10pO2Zvcih2YXIgcnQ9UChoLnN0b3JlKSxvdD0wO3J0Lmxlbmd0aD5vdDspXyhydFtvdCsrXSk7dSh1LlMrdS5GKiFHLFwiU3ltYm9sXCIse2ZvcjpmdW5jdGlvbih0KXtyZXR1cm4gbyhGLHQrPVwiXCIpP0ZbdF06Rlt0XT1BKHQpfSxrZXlGb3I6ZnVuY3Rpb24odCl7aWYoIVkodCkpdGhyb3cgVHlwZUVycm9yKHQrXCIgaXMgbm90IGEgc3ltYm9sIVwiKTtmb3IodmFyIGUgaW4gRilpZihGW2VdPT09dClyZXR1cm4gZX0sdXNlU2V0dGVyOmZ1bmN0aW9uKCl7Vz0hMH0sdXNlU2ltcGxlOmZ1bmN0aW9uKCl7Vz0hMX19KSx1KHUuUyt1LkYqIUcsXCJPYmplY3RcIix7Y3JlYXRlOkosZGVmaW5lUHJvcGVydHk6cSxkZWZpbmVQcm9wZXJ0aWVzOlgsZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yOlosZ2V0T3duUHJvcGVydHlOYW1lczokLGdldE93blByb3BlcnR5U3ltYm9sczp0dH0pLEwmJnUodS5TK3UuRiooIUd8fGwoZnVuY3Rpb24oKXt2YXIgdD1BKCk7cmV0dXJuXCJbbnVsbF1cIiE9UihbdF0pfHxcInt9XCIhPVIoe2E6dH0pfHxcInt9XCIhPVIoT2JqZWN0KHQpKX0pKSxcIkpTT05cIix7c3RyaW5naWZ5OmZ1bmN0aW9uKHQpe2Zvcih2YXIgZSxuLHI9W3RdLG89MTthcmd1bWVudHMubGVuZ3RoPm87KXIucHVzaChhcmd1bWVudHNbbysrXSk7aWYobj1lPXJbMV0sKGcoZSl8fHZvaWQgMCE9PXQpJiYhWSh0KSlyZXR1cm4geShlKXx8KGU9ZnVuY3Rpb24odCxlKXtpZihcImZ1bmN0aW9uXCI9PXR5cGVvZiBuJiYoZT1uLmNhbGwodGhpcyx0LGUpKSwhWShlKSlyZXR1cm4gZX0pLHJbMV09ZSxSLmFwcGx5KEwscil9fSksQVtEXVtJXXx8bigxNSkoQVtEXSxJLEFbRF0udmFsdWVPZikscyhBLFwiU3ltYm9sXCIpLHMoTWF0aCxcIk1hdGhcIiwhMCkscyhyLkpTT04sXCJKU09OXCIsITApfSxmdW5jdGlvbih0LGUsbil7dmFyIHI9big0MSkoXCJtZXRhXCIpLG89bigxOCksaT1uKDI1KSx1PW4oMTYpLmYsYT0wLGM9T2JqZWN0LmlzRXh0ZW5zaWJsZXx8ZnVuY3Rpb24oKXtyZXR1cm4hMH0sbD0hbigyMSkoZnVuY3Rpb24oKXtyZXR1cm4gYyhPYmplY3QucHJldmVudEV4dGVuc2lvbnMoe30pKX0pLGY9ZnVuY3Rpb24odCl7dSh0LHIse3ZhbHVlOntpOlwiT1wiKyArK2Esdzp7fX19KX0scz1mdW5jdGlvbih0LGUpe2lmKCFvKHQpKXJldHVyblwic3ltYm9sXCI9PXR5cGVvZiB0P3Q6KFwic3RyaW5nXCI9PXR5cGVvZiB0P1wiU1wiOlwiUFwiKSt0O2lmKCFpKHQscikpe2lmKCFjKHQpKXJldHVyblwiRlwiO2lmKCFlKXJldHVyblwiRVwiO2YodCl9cmV0dXJuIHRbcl0uaX0sZD1mdW5jdGlvbih0LGUpe2lmKCFpKHQscikpe2lmKCFjKHQpKXJldHVybiEwO2lmKCFlKXJldHVybiExO2YodCl9cmV0dXJuIHRbcl0ud30saD1mdW5jdGlvbih0KXtyZXR1cm4gbCYmdi5ORUVEJiZjKHQpJiYhaSh0LHIpJiZmKHQpLHR9LHY9dC5leHBvcnRzPXtLRVk6cixORUVEOiExLGZhc3RLZXk6cyxnZXRXZWFrOmQsb25GcmVlemU6aH19LGZ1bmN0aW9uKHQsZSxuKXt2YXIgcj1uKDExKSxvPW4oMTIpLGk9big5KSx1PW4oNjEpLGE9bigxNikuZjt0LmV4cG9ydHM9ZnVuY3Rpb24odCl7dmFyIGU9by5TeW1ib2x8fChvLlN5bWJvbD1pP3t9OnIuU3ltYm9sfHx7fSk7XCJfXCI9PXQuY2hhckF0KDApfHx0IGluIGV8fGEoZSx0LHt2YWx1ZTp1LmYodCl9KX19LGZ1bmN0aW9uKHQsZSxuKXt2YXIgcj1uKDMxKSxvPW4oNjgpLGk9big2OSk7dC5leHBvcnRzPWZ1bmN0aW9uKHQpe3ZhciBlPXIodCksbj1vLmY7aWYobilmb3IodmFyIHUsYT1uKHQpLGM9aS5mLGw9MDthLmxlbmd0aD5sOyljLmNhbGwodCx1PWFbbCsrXSkmJmUucHVzaCh1KTtyZXR1cm4gZX19LGZ1bmN0aW9uKHQsZSl7ZS5mPU9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHN9LGZ1bmN0aW9uKHQsZSl7ZS5mPXt9LnByb3BlcnR5SXNFbnVtZXJhYmxlfSxmdW5jdGlvbih0LGUsbil7dmFyIHI9bigzNSk7dC5leHBvcnRzPUFycmF5LmlzQXJyYXl8fGZ1bmN0aW9uKHQpe3JldHVyblwiQXJyYXlcIj09cih0KX19LGZ1bmN0aW9uKHQsZSxuKXt2YXIgcj1uKDMzKSxvPW4oNzIpLmYsaT17fS50b1N0cmluZyx1PVwib2JqZWN0XCI9PXR5cGVvZiB3aW5kb3cmJndpbmRvdyYmT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXM/T2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMod2luZG93KTpbXSxhPWZ1bmN0aW9uKHQpe3RyeXtyZXR1cm4gbyh0KX1jYXRjaCh0KXtyZXR1cm4gdS5zbGljZSgpfX07dC5leHBvcnRzLmY9ZnVuY3Rpb24odCl7cmV0dXJuIHUmJlwiW29iamVjdCBXaW5kb3ddXCI9PWkuY2FsbCh0KT9hKHQpOm8ocih0KSl9fSxmdW5jdGlvbih0LGUsbil7dmFyIHI9bigzMiksbz1uKDQyKS5jb25jYXQoXCJsZW5ndGhcIixcInByb3RvdHlwZVwiKTtlLmY9T2JqZWN0LmdldE93blByb3BlcnR5TmFtZXN8fGZ1bmN0aW9uKHQpe3JldHVybiByKHQsbyl9fSxmdW5jdGlvbih0LGUsbil7dmFyIHI9big2OSksbz1uKDI0KSxpPW4oMzMpLHU9bigyMyksYT1uKDI1KSxjPW4oMTkpLGw9T2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcjtlLmY9bigyMCk/bDpmdW5jdGlvbih0LGUpe2lmKHQ9aSh0KSxlPXUoZSwhMCksYyl0cnl7cmV0dXJuIGwodCxlKX1jYXRjaCh0KXt9aWYoYSh0LGUpKXJldHVybiBvKCFyLmYuY2FsbCh0LGUpLHRbZV0pfX0sZnVuY3Rpb24odCxlKXt9LGZ1bmN0aW9uKHQsZSxuKXtuKDY2KShcImFzeW5jSXRlcmF0b3JcIil9LGZ1bmN0aW9uKHQsZSxuKXtuKDY2KShcIm9ic2VydmFibGVcIil9LGZ1bmN0aW9uKHQsZSxuKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiByKHQpe3JldHVybiB0JiZ0Ll9fZXNNb2R1bGU/dDp7ZGVmYXVsdDp0fX1mdW5jdGlvbiBvKHQsZSl7aWYoISh0IGluc3RhbmNlb2YgZSkpdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKX12YXIgaT1uKDc4KSx1PXIoaSksYT1uKDgxKSxjPXIoYSksbD1uKDg1KSxmPXIobCk7T2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksZS5TbW9vdGhTY3JvbGxiYXI9dm9pZCAwO3ZhciBzPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gdCh0LGUpe2Zvcih2YXIgbj0wO248ZS5sZW5ndGg7bisrKXt2YXIgcj1lW25dO3IuZW51bWVyYWJsZT1yLmVudW1lcmFibGV8fCExLHIuY29uZmlndXJhYmxlPSEwLFwidmFsdWVcImluIHImJihyLndyaXRhYmxlPSEwKSwoMCxmLmRlZmF1bHQpKHQsci5rZXkscil9fXJldHVybiBmdW5jdGlvbihlLG4scil7cmV0dXJuIG4mJnQoZS5wcm90b3R5cGUsbiksciYmdChlLHIpLGV9fSgpLGQ9big4OCksaD1uKDExNik7ZS5TbW9vdGhTY3JvbGxiYXI9ZnVuY3Rpb24oKXtmdW5jdGlvbiB0KGUpe3ZhciBuPXRoaXMscj1hcmd1bWVudHMubGVuZ3RoPjEmJnZvaWQgMCE9PWFyZ3VtZW50c1sxXT9hcmd1bWVudHNbMV06e307byh0aGlzLHQpLGUuc2V0QXR0cmlidXRlKFwidGFiaW5kZXhcIixcIjFcIiksZS5zY3JvbGxUb3A9ZS5zY3JvbGxMZWZ0PTA7dmFyIGk9KDAsaC5maW5kQ2hpbGQpKGUsXCJzY3JvbGwtY29udGVudFwiKSxhPSgwLGguZmluZENoaWxkKShlLFwib3ZlcnNjcm9sbC1nbG93XCIpLGw9KDAsaC5maW5kQ2hpbGQpKGUsXCJzY3JvbGxiYXItdHJhY2steFwiKSxmPSgwLGguZmluZENoaWxkKShlLFwic2Nyb2xsYmFyLXRyYWNrLXlcIik7aWYoKDAsaC5zZXRTdHlsZSkoZSx7b3ZlcmZsb3c6XCJoaWRkZW5cIixvdXRsaW5lOlwibm9uZVwifSksKDAsaC5zZXRTdHlsZSkoYSx7ZGlzcGxheTpcIm5vbmVcIixcInBvaW50ZXItZXZlbnRzXCI6XCJub25lXCJ9KSx0aGlzLl9fcmVhZG9ubHkoXCJ0YXJnZXRzXCIsKDAsYy5kZWZhdWx0KSh7Y29udGFpbmVyOmUsY29udGVudDppLGNhbnZhczp7ZWxlbTphLGNvbnRleHQ6YS5nZXRDb250ZXh0KFwiMmRcIil9LHhBeGlzOigwLGMuZGVmYXVsdCkoe3RyYWNrOmwsdGh1bWI6KDAsaC5maW5kQ2hpbGQpKGwsXCJzY3JvbGxiYXItdGh1bWIteFwiKX0pLHlBeGlzOigwLGMuZGVmYXVsdCkoe3RyYWNrOmYsdGh1bWI6KDAsaC5maW5kQ2hpbGQpKGYsXCJzY3JvbGxiYXItdGh1bWIteVwiKX0pfSkpLl9fcmVhZG9ubHkoXCJvZmZzZXRcIix7eDowLHk6MH0pLl9fcmVhZG9ubHkoXCJ0aHVtYk9mZnNldFwiLHt4OjAseTowfSkuX19yZWFkb25seShcImxpbWl0XCIse3g6MS8wLHk6MS8wfSkuX19yZWFkb25seShcIm1vdmVtZW50XCIse3g6MCx5OjB9KS5fX3JlYWRvbmx5KFwibW92ZW1lbnRMb2NrZWRcIix7eDohMSx5OiExfSkuX19yZWFkb25seShcIm92ZXJzY3JvbGxSZW5kZXJlZFwiLHt4OjAseTowfSkuX19yZWFkb25seShcIm92ZXJzY3JvbGxCYWNrXCIsITEpLl9fcmVhZG9ubHkoXCJ0aHVtYlNpemVcIix7eDowLHk6MCxyZWFsWDowLHJlYWxZOjB9KS5fX3JlYWRvbmx5KFwiYm91bmRpbmdcIix7dG9wOjAscmlnaHQ6MCxib3R0b206MCxsZWZ0OjB9KS5fX3JlYWRvbmx5KFwiY2hpbGRyZW5cIixbXSkuX19yZWFkb25seShcInBhcmVudHNcIixbXSkuX19yZWFkb25seShcInNpemVcIix0aGlzLmdldFNpemUoKSkuX19yZWFkb25seShcImlzTmVzdGVkU2Nyb2xsYmFyXCIsITEpLCgwLHUuZGVmYXVsdCkodGhpcyx7X19oaWRlVHJhY2tUaHJvdHRsZTp7dmFsdWU6KDAsaC5kZWJvdW5jZSkodGhpcy5oaWRlVHJhY2suYmluZCh0aGlzKSwxZTMsITEpfSxfX3VwZGF0ZVRocm90dGxlOnt2YWx1ZTooMCxoLmRlYm91bmNlKSh0aGlzLnVwZGF0ZS5iaW5kKHRoaXMpKX0sX190b3VjaFJlY29yZDp7dmFsdWU6bmV3IGguVG91Y2hSZWNvcmR9LF9fbGlzdGVuZXJzOnt2YWx1ZTpbXX0sX19oYW5kbGVyczp7dmFsdWU6W119LF9fY2hpbGRyZW46e3ZhbHVlOltdfSxfX3RpbWVySUQ6e3ZhbHVlOnt9fX0pLHRoaXMuX19pbml0T3B0aW9ucyhyKSx0aGlzLl9faW5pdFJldmVyc2VXaGVlbCgpLHRoaXMuX19pbml0U2Nyb2xsYmFyKCksZC5zYkxpc3Quc2V0KGUsdGhpcyksXCJmdW5jdGlvblwiPT10eXBlb2YgZC5HTE9CQUxfRU5WLk11dGF0aW9uT2JzZXJ2ZXIpe3ZhciBzPW5ldyBkLkdMT0JBTF9FTlYuTXV0YXRpb25PYnNlcnZlcihmdW5jdGlvbigpe24udXBkYXRlKCEwKX0pO3Mub2JzZXJ2ZShpLHtjaGlsZExpc3Q6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcyxcIl9fb2JzZXJ2ZXJcIix7dmFsdWU6c30pfX1yZXR1cm4gcyh0LFt7a2V5OlwiTUFYX09WRVJTQ1JPTExcIixnZXQ6ZnVuY3Rpb24oKXt2YXIgdD10aGlzLm9wdGlvbnMsZT10aGlzLnNpemU7c3dpdGNoKHQub3ZlcnNjcm9sbEVmZmVjdCl7Y2FzZVwiYm91bmNlXCI6dmFyIG49TWF0aC5mbG9vcihNYXRoLnNxcnQoTWF0aC5wb3coZS5jb250YWluZXIud2lkdGgsMikrTWF0aC5wb3coZS5jb250YWluZXIuaGVpZ2h0LDIpKSkscj10aGlzLl9faXNNb3ZlbWVudExvY2tlZCgpPzI6MTA7cmV0dXJuIGQuR0xPQkFMX0VOVi5UT1VDSF9TVVBQT1JURUQ/KDAsaC5waWNrSW5SYW5nZSkobi9yLDEwMCwxZTMpOigwLGgucGlja0luUmFuZ2UpKG4vMTAsMjUsNTApO2Nhc2VcImdsb3dcIjpyZXR1cm4gMTUwO2RlZmF1bHQ6cmV0dXJuIDB9fX0se2tleTpcInNjcm9sbFRvcFwiLGdldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLm9mZnNldC55fX0se2tleTpcInNjcm9sbExlZnRcIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5vZmZzZXQueH19XSksdH0oKX0sZnVuY3Rpb24odCxlLG4pe3QuZXhwb3J0cz17ZGVmYXVsdDpuKDc5KSxfX2VzTW9kdWxlOiEwfX0sZnVuY3Rpb24odCxlLG4pe24oODApO3ZhciByPW4oMTIpLk9iamVjdDt0LmV4cG9ydHM9ZnVuY3Rpb24odCxlKXtyZXR1cm4gci5kZWZpbmVQcm9wZXJ0aWVzKHQsZSl9fSxmdW5jdGlvbih0LGUsbil7dmFyIHI9bigxMCk7cihyLlMrci5GKiFuKDIwKSxcIk9iamVjdFwiLHtkZWZpbmVQcm9wZXJ0aWVzOm4oMzApfSl9LGZ1bmN0aW9uKHQsZSxuKXt0LmV4cG9ydHM9e2RlZmF1bHQ6big4MiksX19lc01vZHVsZTohMH19LGZ1bmN0aW9uKHQsZSxuKXtuKDgzKSx0LmV4cG9ydHM9bigxMikuT2JqZWN0LmZyZWV6ZX0sZnVuY3Rpb24odCxlLG4pe3ZhciByPW4oMTgpLG89big2NSkub25GcmVlemU7big4NCkoXCJmcmVlemVcIixmdW5jdGlvbih0KXtyZXR1cm4gZnVuY3Rpb24oZSl7cmV0dXJuIHQmJnIoZSk/dChvKGUpKTplfX0pfSxmdW5jdGlvbih0LGUsbil7dmFyIHI9bigxMCksbz1uKDEyKSxpPW4oMjEpO3QuZXhwb3J0cz1mdW5jdGlvbih0LGUpe3ZhciBuPShvLk9iamVjdHx8e30pW3RdfHxPYmplY3RbdF0sdT17fTt1W3RdPWUobikscihyLlMrci5GKmkoZnVuY3Rpb24oKXtuKDEpfSksXCJPYmplY3RcIix1KX19LGZ1bmN0aW9uKHQsZSxuKXt0LmV4cG9ydHM9e2RlZmF1bHQ6big4NiksX19lc01vZHVsZTohMH19LGZ1bmN0aW9uKHQsZSxuKXtuKDg3KTt2YXIgcj1uKDEyKS5PYmplY3Q7dC5leHBvcnRzPWZ1bmN0aW9uKHQsZSxuKXtyZXR1cm4gci5kZWZpbmVQcm9wZXJ0eSh0LGUsbil9fSxmdW5jdGlvbih0LGUsbil7dmFyIHI9bigxMCk7cihyLlMrci5GKiFuKDIwKSxcIk9iamVjdFwiLHtkZWZpbmVQcm9wZXJ0eTpuKDE2KS5mfSl9LGZ1bmN0aW9uKHQsZSxuKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiByKHQpe3JldHVybiB0JiZ0Ll9fZXNNb2R1bGU/dDp7ZGVmYXVsdDp0fX12YXIgbz1uKDg1KSxpPXIobyksdT1uKDg5KSxhPXIodSk7T2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSk7dmFyIGM9big5Mik7KDAsYS5kZWZhdWx0KShjKS5mb3JFYWNoKGZ1bmN0aW9uKHQpe1wiZGVmYXVsdFwiIT09dCYmXCJfX2VzTW9kdWxlXCIhPT10JiYoMCxpLmRlZmF1bHQpKGUsdCx7ZW51bWVyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gY1t0XX19KX0pfSxmdW5jdGlvbih0LGUsbil7dC5leHBvcnRzPXtkZWZhdWx0Om4oOTApLF9fZXNNb2R1bGU6ITB9fSxmdW5jdGlvbih0LGUsbil7big5MSksdC5leHBvcnRzPW4oMTIpLk9iamVjdC5rZXlzfSxmdW5jdGlvbih0LGUsbil7dmFyIHI9big0Nyksbz1uKDMxKTtuKDg0KShcImtleXNcIixmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbih0KXtyZXR1cm4gbyhyKHQpKX19KX0sZnVuY3Rpb24odCxlLG4pe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIHIodCl7cmV0dXJuIHQmJnQuX19lc01vZHVsZT90OntkZWZhdWx0OnR9fXZhciBvPW4oODUpLGk9cihvKSx1PW4oODkpLGE9cih1KTtPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KTt2YXIgYz1uKDkzKTsoMCxhLmRlZmF1bHQpKGMpLmZvckVhY2goZnVuY3Rpb24odCl7XCJkZWZhdWx0XCIhPT10JiZcIl9fZXNNb2R1bGVcIiE9PXQmJigwLGkuZGVmYXVsdCkoZSx0LHtlbnVtZXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe3JldHVybiBjW3RdfX0pfSk7dmFyIGw9big5NCk7KDAsYS5kZWZhdWx0KShsKS5mb3JFYWNoKGZ1bmN0aW9uKHQpe1wiZGVmYXVsdFwiIT09dCYmXCJfX2VzTW9kdWxlXCIhPT10JiYoMCxpLmRlZmF1bHQpKGUsdCx7ZW51bWVyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gbFt0XX19KX0pO3ZhciBmPW4oMTE1KTsoMCxhLmRlZmF1bHQpKGYpLmZvckVhY2goZnVuY3Rpb24odCl7XCJkZWZhdWx0XCIhPT10JiZcIl9fZXNNb2R1bGVcIiE9PXQmJigwLGkuZGVmYXVsdCkoZSx0LHtlbnVtZXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe3JldHVybiBmW3RdfX0pfSl9LGZ1bmN0aW9uKHQsZSxuKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiByKHQpe3JldHVybiB0JiZ0Ll9fZXNNb2R1bGU/dDp7ZGVmYXVsdDp0fX12YXIgbz1uKDg1KSxpPXIobyksdT1uKDg5KSxhPXIodSk7T2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSk7dmFyIGM9ZnVuY3Rpb24odCl7dmFyIGU9e30sbj17fTtyZXR1cm4oMCxhLmRlZmF1bHQpKHQpLmZvckVhY2goZnVuY3Rpb24ocil7KDAsaS5kZWZhdWx0KShlLHIse2dldDpmdW5jdGlvbigpe2lmKCFuLmhhc093blByb3BlcnR5KHIpKXt2YXIgZT10W3JdO25bcl09ZSgpfXJldHVybiBuW3JdfX0pfSksZX0sbD17TXV0YXRpb25PYnNlcnZlcjpmdW5jdGlvbigpe3JldHVybiB3aW5kb3cuTXV0YXRpb25PYnNlcnZlcnx8d2luZG93LldlYktpdE11dGF0aW9uT2JzZXJ2ZXJ8fHdpbmRvdy5Nb3pNdXRhdGlvbk9ic2VydmVyfSxUT1VDSF9TVVBQT1JURUQ6ZnVuY3Rpb24oKXtyZXR1cm5cIm9udG91Y2hzdGFydFwiaW4gZG9jdW1lbnR9LEVBU0lOR19NVUxUSVBMSUVSOmZ1bmN0aW9uKCl7cmV0dXJuIG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL0FuZHJvaWQvKT8uNTouMjV9LFdIRUVMX0VWRU5UOmZ1bmN0aW9uKCl7cmV0dXJuXCJvbndoZWVsXCJpbiB3aW5kb3c/XCJ3aGVlbFwiOlwibW91c2V3aGVlbFwifX07ZS5HTE9CQUxfRU5WPWMobCl9LGZ1bmN0aW9uKHQsZSxuKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiByKHQpe3JldHVybiB0JiZ0Ll9fZXNNb2R1bGU/dDp7ZGVmYXVsdDp0fX12YXIgbz1uKDk1KSxpPXIobyk7T2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSk7dmFyIHU9bmV3IGkuZGVmYXVsdCxhPXUuc2V0LmJpbmQodSksYz11LmRlbGV0ZS5iaW5kKHUpO3UudXBkYXRlPWZ1bmN0aW9uKCl7dS5mb3JFYWNoKGZ1bmN0aW9uKHQpe3QuX191cGRhdGVUcmVlKCl9KX0sdS5kZWxldGU9ZnVuY3Rpb24oKXt2YXIgdD1jLmFwcGx5KHZvaWQgMCxhcmd1bWVudHMpO3JldHVybiB1LnVwZGF0ZSgpLHR9LHUuc2V0PWZ1bmN0aW9uKCl7dmFyIHQ9YS5hcHBseSh2b2lkIDAsYXJndW1lbnRzKTtyZXR1cm4gdS51cGRhdGUoKSx0fSxlLnNiTGlzdD11fSxmdW5jdGlvbih0LGUsbil7dC5leHBvcnRzPXtkZWZhdWx0Om4oOTYpLF9fZXNNb2R1bGU6ITB9fSxmdW5jdGlvbih0LGUsbil7big3NCksbig0KSxuKDU3KSxuKDk3KSxuKDEwOCksbigxMTEpLG4oMTEzKSx0LmV4cG9ydHM9bigxMikuTWFwfSxmdW5jdGlvbih0LGUsbil7XCJ1c2Ugc3RyaWN0XCI7dmFyIHI9big5OCksbz1uKDEwMyksaT1cIk1hcFwiO3QuZXhwb3J0cz1uKDEwNCkoaSxmdW5jdGlvbih0KXtyZXR1cm4gZnVuY3Rpb24oKXtyZXR1cm4gdCh0aGlzLGFyZ3VtZW50cy5sZW5ndGg+MD9hcmd1bWVudHNbMF06dm9pZCAwKX19LHtnZXQ6ZnVuY3Rpb24odCl7dmFyIGU9ci5nZXRFbnRyeShvKHRoaXMsaSksdCk7cmV0dXJuIGUmJmUudn0sc2V0OmZ1bmN0aW9uKHQsZSl7cmV0dXJuIHIuZGVmKG8odGhpcyxpKSwwPT09dD8wOnQsZSl9fSxyLCEwKX0sZnVuY3Rpb24odCxlLG4pe1widXNlIHN0cmljdFwiO3ZhciByPW4oMTYpLmYsbz1uKDI5KSxpPW4oOTkpLHU9bigxMyksYT1uKDEwMCksYz1uKDEwMSksbD1uKDgpLGY9big2MCkscz1uKDEwMiksZD1uKDIwKSxoPW4oNjUpLmZhc3RLZXksdj1uKDEwMyksXz1kP1wiX3NcIjpcInNpemVcIixwPWZ1bmN0aW9uKHQsZSl7dmFyIG4scj1oKGUpO2lmKFwiRlwiIT09cilyZXR1cm4gdC5faVtyXTtmb3Iobj10Ll9mO247bj1uLm4paWYobi5rPT1lKXJldHVybiBufTt0LmV4cG9ydHM9e2dldENvbnN0cnVjdG9yOmZ1bmN0aW9uKHQsZSxuLGwpe3ZhciBmPXQoZnVuY3Rpb24odCxyKXthKHQsZixlLFwiX2lcIiksdC5fdD1lLHQuX2k9byhudWxsKSx0Ll9mPXZvaWQgMCx0Ll9sPXZvaWQgMCx0W19dPTAsdm9pZCAwIT1yJiZjKHIsbix0W2xdLHQpfSk7cmV0dXJuIGkoZi5wcm90b3R5cGUse2NsZWFyOmZ1bmN0aW9uKCl7Zm9yKHZhciB0PXYodGhpcyxlKSxuPXQuX2kscj10Ll9mO3I7cj1yLm4pci5yPSEwLHIucCYmKHIucD1yLnAubj12b2lkIDApLGRlbGV0ZSBuW3IuaV07dC5fZj10Ll9sPXZvaWQgMCx0W19dPTB9LGRlbGV0ZTpmdW5jdGlvbih0KXt2YXIgbj12KHRoaXMsZSkscj1wKG4sdCk7aWYocil7dmFyIG89ci5uLGk9ci5wO2RlbGV0ZSBuLl9pW3IuaV0sci5yPSEwLGkmJihpLm49byksbyYmKG8ucD1pKSxuLl9mPT1yJiYobi5fZj1vKSxuLl9sPT1yJiYobi5fbD1pKSxuW19dLS19cmV0dXJuISFyfSxmb3JFYWNoOmZ1bmN0aW9uKHQpe3YodGhpcyxlKTtmb3IodmFyIG4scj11KHQsYXJndW1lbnRzLmxlbmd0aD4xP2FyZ3VtZW50c1sxXTp2b2lkIDAsMyk7bj1uP24ubjp0aGlzLl9mOylmb3IocihuLnYsbi5rLHRoaXMpO24mJm4ucjspbj1uLnB9LGhhczpmdW5jdGlvbih0KXtyZXR1cm4hIXAodih0aGlzLGUpLHQpfX0pLGQmJnIoZi5wcm90b3R5cGUsXCJzaXplXCIse2dldDpmdW5jdGlvbigpe3JldHVybiB2KHRoaXMsZSlbX119fSksZn0sZGVmOmZ1bmN0aW9uKHQsZSxuKXt2YXIgcixvLGk9cCh0LGUpO3JldHVybiBpP2kudj1uOih0Ll9sPWk9e2k6bz1oKGUsITApLGs6ZSx2Om4scDpyPXQuX2wsbjp2b2lkIDAscjohMX0sdC5fZnx8KHQuX2Y9aSksciYmKHIubj1pKSx0W19dKyssXCJGXCIhPT1vJiYodC5faVtvXT1pKSksdH0sZ2V0RW50cnk6cCxzZXRTdHJvbmc6ZnVuY3Rpb24odCxlLG4pe2wodCxlLGZ1bmN0aW9uKHQsbil7dGhpcy5fdD12KHQsZSksdGhpcy5faz1uLHRoaXMuX2w9dm9pZCAwfSxmdW5jdGlvbigpe2Zvcih2YXIgdD10aGlzLGU9dC5fayxuPXQuX2w7biYmbi5yOyluPW4ucDtyZXR1cm4gdC5fdCYmKHQuX2w9bj1uP24ubjp0Ll90Ll9mKT9cImtleXNcIj09ZT9mKDAsbi5rKTpcInZhbHVlc1wiPT1lP2YoMCxuLnYpOmYoMCxbbi5rLG4udl0pOih0Ll90PXZvaWQgMCxmKDEpKX0sbj9cImVudHJpZXNcIjpcInZhbHVlc1wiLCFuLCEwKSxzKGUpfX19LGZ1bmN0aW9uKHQsZSxuKXt2YXIgcj1uKDE1KTt0LmV4cG9ydHM9ZnVuY3Rpb24odCxlLG4pe2Zvcih2YXIgbyBpbiBlKW4mJnRbb10/dFtvXT1lW29dOnIodCxvLGVbb10pO3JldHVybiB0fX0sZnVuY3Rpb24odCxlKXt0LmV4cG9ydHM9ZnVuY3Rpb24odCxlLG4scil7aWYoISh0IGluc3RhbmNlb2YgZSl8fHZvaWQgMCE9PXImJnIgaW4gdCl0aHJvdyBUeXBlRXJyb3IobitcIjogaW5jb3JyZWN0IGludm9jYXRpb24hXCIpO3JldHVybiB0fX0sZnVuY3Rpb24odCxlLG4pe3ZhciByPW4oMTMpLG89big0OSksaT1uKDUwKSx1PW4oMTcpLGE9bigzNyksYz1uKDUyKSxsPXt9LGY9e30sZT10LmV4cG9ydHM9ZnVuY3Rpb24odCxlLG4scyxkKXt2YXIgaCx2LF8scCx5PWQ/ZnVuY3Rpb24oKXtyZXR1cm4gdH06Yyh0KSxiPXIobixzLGU/MjoxKSxnPTA7aWYoXCJmdW5jdGlvblwiIT10eXBlb2YgeSl0aHJvdyBUeXBlRXJyb3IodCtcIiBpcyBub3QgaXRlcmFibGUhXCIpO2lmKGkoeSkpe2ZvcihoPWEodC5sZW5ndGgpO2g+ZztnKyspaWYocD1lP2IodSh2PXRbZ10pWzBdLHZbMV0pOmIodFtnXSkscD09PWx8fHA9PT1mKXJldHVybiBwfWVsc2UgZm9yKF89eS5jYWxsKHQpOyEodj1fLm5leHQoKSkuZG9uZTspaWYocD1vKF8sYix2LnZhbHVlLGUpLHA9PT1sfHxwPT09ZilyZXR1cm4gcH07ZS5CUkVBSz1sLGUuUkVUVVJOPWZ9LGZ1bmN0aW9uKHQsZSxuKXtcInVzZSBzdHJpY3RcIjt2YXIgcj1uKDExKSxvPW4oMTIpLGk9bigxNiksdT1uKDIwKSxhPW4oNDUpKFwic3BlY2llc1wiKTt0LmV4cG9ydHM9ZnVuY3Rpb24odCl7dmFyIGU9XCJmdW5jdGlvblwiPT10eXBlb2Ygb1t0XT9vW3RdOnJbdF07dSYmZSYmIWVbYV0mJmkuZihlLGEse2NvbmZpZ3VyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpc319KX19LGZ1bmN0aW9uKHQsZSxuKXt2YXIgcj1uKDE4KTt0LmV4cG9ydHM9ZnVuY3Rpb24odCxlKXtpZighcih0KXx8dC5fdCE9PWUpdGhyb3cgVHlwZUVycm9yKFwiSW5jb21wYXRpYmxlIHJlY2VpdmVyLCBcIitlK1wiIHJlcXVpcmVkIVwiKTtyZXR1cm4gdH19LGZ1bmN0aW9uKHQsZSxuKXtcInVzZSBzdHJpY3RcIjt2YXIgcj1uKDExKSxvPW4oMTApLGk9big2NSksdT1uKDIxKSxhPW4oMTUpLGM9big5OSksbD1uKDEwMSksZj1uKDEwMCkscz1uKDE4KSxkPW4oNDQpLGg9bigxNikuZix2PW4oMTA1KSgwKSxfPW4oMjApO3QuZXhwb3J0cz1mdW5jdGlvbih0LGUsbixwLHksYil7dmFyIGc9clt0XSxtPWcseD15P1wic2V0XCI6XCJhZGRcIixTPW0mJm0ucHJvdG90eXBlLEU9e307cmV0dXJuIF8mJlwiZnVuY3Rpb25cIj09dHlwZW9mIG0mJihifHxTLmZvckVhY2gmJiF1KGZ1bmN0aW9uKCl7KG5ldyBtKS5lbnRyaWVzKCkubmV4dCgpfSkpPyhtPWUoZnVuY3Rpb24oZSxuKXtmKGUsbSx0LFwiX2NcIiksZS5fYz1uZXcgZyx2b2lkIDAhPW4mJmwobix5LGVbeF0sZSl9KSx2KFwiYWRkLGNsZWFyLGRlbGV0ZSxmb3JFYWNoLGdldCxoYXMsc2V0LGtleXMsdmFsdWVzLGVudHJpZXMsdG9KU09OXCIuc3BsaXQoXCIsXCIpLGZ1bmN0aW9uKHQpe3ZhciBlPVwiYWRkXCI9PXR8fFwic2V0XCI9PXQ7dCBpbiBTJiYoIWJ8fFwiY2xlYXJcIiE9dCkmJmEobS5wcm90b3R5cGUsdCxmdW5jdGlvbihuLHIpe2lmKGYodGhpcyxtLHQpLCFlJiZiJiYhcyhuKSlyZXR1cm5cImdldFwiPT10JiZ2b2lkIDA7dmFyIG89dGhpcy5fY1t0XSgwPT09bj8wOm4scik7cmV0dXJuIGU/dGhpczpvfSl9KSxifHxoKG0ucHJvdG90eXBlLFwic2l6ZVwiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fYy5zaXplfX0pKToobT1wLmdldENvbnN0cnVjdG9yKGUsdCx5LHgpLGMobS5wcm90b3R5cGUsbiksaS5ORUVEPSEwKSxkKG0sdCksRVt0XT1tLG8oby5HK28uVytvLkYsRSksYnx8cC5zZXRTdHJvbmcobSx0LHkpLG19fSxmdW5jdGlvbih0LGUsbil7dmFyIHI9bigxMyksbz1uKDM0KSxpPW4oNDcpLHU9bigzNyksYT1uKDEwNik7dC5leHBvcnRzPWZ1bmN0aW9uKHQsZSl7dmFyIG49MT09dCxjPTI9PXQsbD0zPT10LGY9ND09dCxzPTY9PXQsZD01PT10fHxzLGg9ZXx8YTtyZXR1cm4gZnVuY3Rpb24oZSxhLHYpe2Zvcih2YXIgXyxwLHk9aShlKSxiPW8oeSksZz1yKGEsdiwzKSxtPXUoYi5sZW5ndGgpLHg9MCxTPW4/aChlLG0pOmM/aChlLDApOnZvaWQgMDttPng7eCsrKWlmKChkfHx4IGluIGIpJiYoXz1iW3hdLHA9ZyhfLHgseSksdCkpaWYobilTW3hdPXA7ZWxzZSBpZihwKXN3aXRjaCh0KXtjYXNlIDM6cmV0dXJuITA7Y2FzZSA1OnJldHVybiBfO2Nhc2UgNjpyZXR1cm4geDtjYXNlIDI6Uy5wdXNoKF8pfWVsc2UgaWYoZilyZXR1cm4hMTtyZXR1cm4gcz8tMTpsfHxmP2Y6U319fSxmdW5jdGlvbih0LGUsbil7dmFyIHI9bigxMDcpO3QuZXhwb3J0cz1mdW5jdGlvbih0LGUpe3JldHVybiBuZXcocih0KSkoZSl9fSxmdW5jdGlvbih0LGUsbil7dmFyIHI9bigxOCksbz1uKDcwKSxpPW4oNDUpKFwic3BlY2llc1wiKTt0LmV4cG9ydHM9ZnVuY3Rpb24odCl7dmFyIGU7cmV0dXJuIG8odCkmJihlPXQuY29uc3RydWN0b3IsXCJmdW5jdGlvblwiIT10eXBlb2YgZXx8ZSE9PUFycmF5JiYhbyhlLnByb3RvdHlwZSl8fChlPXZvaWQgMCkscihlKSYmKGU9ZVtpXSxudWxsPT09ZSYmKGU9dm9pZCAwKSkpLHZvaWQgMD09PWU/QXJyYXk6ZX19LGZ1bmN0aW9uKHQsZSxuKXt2YXIgcj1uKDEwKTtyKHIuUCtyLlIsXCJNYXBcIix7dG9KU09OOm4oMTA5KShcIk1hcFwiKX0pfSxmdW5jdGlvbih0LGUsbil7dmFyIHI9big1Myksbz1uKDExMCk7dC5leHBvcnRzPWZ1bmN0aW9uKHQpe3JldHVybiBmdW5jdGlvbigpe2lmKHIodGhpcykhPXQpdGhyb3cgVHlwZUVycm9yKHQrXCIjdG9KU09OIGlzbid0IGdlbmVyaWNcIik7cmV0dXJuIG8odGhpcyl9fX0sZnVuY3Rpb24odCxlLG4pe3ZhciByPW4oMTAxKTt0LmV4cG9ydHM9ZnVuY3Rpb24odCxlKXt2YXIgbj1bXTtyZXR1cm4gcih0LCExLG4ucHVzaCxuLGUpLG59fSxmdW5jdGlvbih0LGUsbil7bigxMTIpKFwiTWFwXCIpfSxmdW5jdGlvbih0LGUsbil7XCJ1c2Ugc3RyaWN0XCI7dmFyIHI9bigxMCk7dC5leHBvcnRzPWZ1bmN0aW9uKHQpe3Ioci5TLHQse29mOmZ1bmN0aW9uKCl7Zm9yKHZhciB0PWFyZ3VtZW50cy5sZW5ndGgsZT1uZXcgQXJyYXkodCk7dC0tOyllW3RdPWFyZ3VtZW50c1t0XTtyZXR1cm4gbmV3IHRoaXMoZSl9fSl9fSxmdW5jdGlvbih0LGUsbil7bigxMTQpKFwiTWFwXCIpfSxmdW5jdGlvbih0LGUsbil7XCJ1c2Ugc3RyaWN0XCI7dmFyIHI9bigxMCksbz1uKDE0KSxpPW4oMTMpLHU9bigxMDEpO3QuZXhwb3J0cz1mdW5jdGlvbih0KXtyKHIuUyx0LHtmcm9tOmZ1bmN0aW9uKHQpe3ZhciBlLG4scixhLGM9YXJndW1lbnRzWzFdO3JldHVybiBvKHRoaXMpLGU9dm9pZCAwIT09YyxlJiZvKGMpLHZvaWQgMD09dD9uZXcgdGhpczoobj1bXSxlPyhyPTAsYT1pKGMsYXJndW1lbnRzWzJdLDIpLHUodCwhMSxmdW5jdGlvbih0KXtuLnB1c2goYSh0LHIrKykpfSkpOnUodCwhMSxuLnB1c2gsbiksbmV3IHRoaXMobikpfX0pfX0sZnVuY3Rpb24odCxlKXtcInVzZSBzdHJpY3RcIjtPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KTtlLnNlbGVjdG9ycz1cInNjcm9sbGJhciwgW3Njcm9sbGJhcl0sIFtkYXRhLXNjcm9sbGJhcl1cIn0sZnVuY3Rpb24odCxlLG4pe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIHIodCl7cmV0dXJuIHQmJnQuX19lc01vZHVsZT90OntkZWZhdWx0OnR9fXZhciBvPW4oODUpLGk9cihvKSx1PW4oODkpLGE9cih1KTtPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KTt2YXIgYz1uKDExNyk7KDAsYS5kZWZhdWx0KShjKS5mb3JFYWNoKGZ1bmN0aW9uKHQpe1wiZGVmYXVsdFwiIT09dCYmXCJfX2VzTW9kdWxlXCIhPT10JiYoMCxpLmRlZmF1bHQpKGUsdCx7ZW51bWVyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gY1t0XX19KX0pfSxmdW5jdGlvbih0LGUsbil7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gcih0KXtyZXR1cm4gdCYmdC5fX2VzTW9kdWxlP3Q6e2RlZmF1bHQ6dH19dmFyIG89big4NSksaT1yKG8pLHU9big4OSksYT1yKHUpO09iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pO3ZhciBjPW4oMTE4KTsoMCxhLmRlZmF1bHQpKGMpLmZvckVhY2goZnVuY3Rpb24odCl7XCJkZWZhdWx0XCIhPT10JiZcIl9fZXNNb2R1bGVcIiE9PXQmJigwLGkuZGVmYXVsdCkoZSx0LHtlbnVtZXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe3JldHVybiBjW3RdfX0pfSk7dmFyIGw9bigxMTkpOygwLGEuZGVmYXVsdCkobCkuZm9yRWFjaChmdW5jdGlvbih0KXtcImRlZmF1bHRcIiE9PXQmJlwiX19lc01vZHVsZVwiIT09dCYmKDAsaS5kZWZhdWx0KShlLHQse2VudW1lcmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGxbdF19fSl9KTt2YXIgZj1uKDEyMCk7KDAsYS5kZWZhdWx0KShmKS5mb3JFYWNoKGZ1bmN0aW9uKHQpe1wiZGVmYXVsdFwiIT09dCYmXCJfX2VzTW9kdWxlXCIhPT10JiYoMCxpLmRlZmF1bHQpKGUsdCx7ZW51bWVyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gZlt0XX19KX0pO3ZhciBzPW4oMTIxKTsoMCxhLmRlZmF1bHQpKHMpLmZvckVhY2goZnVuY3Rpb24odCl7XCJkZWZhdWx0XCIhPT10JiZcIl9fZXNNb2R1bGVcIiE9PXQmJigwLGkuZGVmYXVsdCkoZSx0LHtlbnVtZXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe3JldHVybiBzW3RdfX0pfSk7dmFyIGQ9bigxMjIpOygwLGEuZGVmYXVsdCkoZCkuZm9yRWFjaChmdW5jdGlvbih0KXtcImRlZmF1bHRcIiE9PXQmJlwiX19lc01vZHVsZVwiIT09dCYmKDAsaS5kZWZhdWx0KShlLHQse2VudW1lcmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGRbdF19fSl9KTt2YXIgaD1uKDEyMyk7KDAsYS5kZWZhdWx0KShoKS5mb3JFYWNoKGZ1bmN0aW9uKHQpe1wiZGVmYXVsdFwiIT09dCYmXCJfX2VzTW9kdWxlXCIhPT10JiYoMCxpLmRlZmF1bHQpKGUsdCx7ZW51bWVyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gaFt0XX19KX0pO3ZhciB2PW4oMTI0KTsoMCxhLmRlZmF1bHQpKHYpLmZvckVhY2goZnVuY3Rpb24odCl7XCJkZWZhdWx0XCIhPT10JiZcIl9fZXNNb2R1bGVcIiE9PXQmJigwLGkuZGVmYXVsdCkoZSx0LHtlbnVtZXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe3JldHVybiB2W3RdfX0pfSk7dmFyIF89bigxMjUpOygwLGEuZGVmYXVsdCkoXykuZm9yRWFjaChmdW5jdGlvbih0KXtcImRlZmF1bHRcIiE9PXQmJlwiX19lc01vZHVsZVwiIT09dCYmKDAsaS5kZWZhdWx0KShlLHQse2VudW1lcmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIF9bdF19fSl9KTt2YXIgcD1uKDEyNik7KDAsYS5kZWZhdWx0KShwKS5mb3JFYWNoKGZ1bmN0aW9uKHQpe1wiZGVmYXVsdFwiIT09dCYmXCJfX2VzTW9kdWxlXCIhPT10JiYoMCxpLmRlZmF1bHQpKGUsdCx7ZW51bWVyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gcFt0XX19KX0pO3ZhciB5PW4oMTI3KTsoMCxhLmRlZmF1bHQpKHkpLmZvckVhY2goZnVuY3Rpb24odCl7XCJkZWZhdWx0XCIhPT10JiZcIl9fZXNNb2R1bGVcIiE9PXQmJigwLGkuZGVmYXVsdCkoZSx0LHtlbnVtZXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe3JldHVybiB5W3RdfX0pfSk7dmFyIGI9bigxMjgpO1xuKDAsYS5kZWZhdWx0KShiKS5mb3JFYWNoKGZ1bmN0aW9uKHQpe1wiZGVmYXVsdFwiIT09dCYmXCJfX2VzTW9kdWxlXCIhPT10JiYoMCxpLmRlZmF1bHQpKGUsdCx7ZW51bWVyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gYlt0XX19KX0pfSxmdW5jdGlvbih0LGUpe1widXNlIHN0cmljdFwiO09iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pO2UuYnVpbGRDdXJ2ZT1mdW5jdGlvbih0LGUpe3ZhciBuPVtdO2lmKGU8PTApcmV0dXJuIG47Zm9yKHZhciByPU1hdGgucm91bmQoZS8xZTMqNjApLTEsbz10P01hdGgucG93KDEvTWF0aC5hYnModCksMS9yKTowLGk9MTtpPD1yO2krKyluLnB1c2godC10Kk1hdGgucG93KG8saSkpO3JldHVybiBuLnB1c2godCksbn19LGZ1bmN0aW9uKHQsZSl7XCJ1c2Ugc3RyaWN0XCI7T2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSk7dmFyIG49MTAwO2UuZGVib3VuY2U9ZnVuY3Rpb24odCl7dmFyIGU9YXJndW1lbnRzLmxlbmd0aD4xJiZ2b2lkIDAhPT1hcmd1bWVudHNbMV0/YXJndW1lbnRzWzFdOm4scj0hKGFyZ3VtZW50cy5sZW5ndGg+MiYmdm9pZCAwIT09YXJndW1lbnRzWzJdKXx8YXJndW1lbnRzWzJdO2lmKFwiZnVuY3Rpb25cIj09dHlwZW9mIHQpe3ZhciBvPXZvaWQgMDtyZXR1cm4gZnVuY3Rpb24oKXtmb3IodmFyIG49YXJndW1lbnRzLmxlbmd0aCxpPUFycmF5KG4pLHU9MDt1PG47dSsrKWlbdV09YXJndW1lbnRzW3VdOyFvJiZyJiZzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7cmV0dXJuIHQuYXBwbHkodm9pZCAwLGkpfSksY2xlYXJUaW1lb3V0KG8pLG89c2V0VGltZW91dChmdW5jdGlvbigpe289dm9pZCAwLHQuYXBwbHkodm9pZCAwLGkpfSxlKX19fX0sZnVuY3Rpb24odCxlLG4pe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIHIodCl7cmV0dXJuIHQmJnQuX19lc01vZHVsZT90OntkZWZhdWx0OnR9fWZ1bmN0aW9uIG8odCl7aWYoQXJyYXkuaXNBcnJheSh0KSl7Zm9yKHZhciBlPTAsbj1BcnJheSh0Lmxlbmd0aCk7ZTx0Lmxlbmd0aDtlKyspbltlXT10W2VdO3JldHVybiBufXJldHVybigwLHUuZGVmYXVsdCkodCl9dmFyIGk9bigyKSx1PXIoaSk7T2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSk7ZS5maW5kQ2hpbGQ9ZnVuY3Rpb24odCxlKXt2YXIgbj10LmNoaWxkcmVuLHI9bnVsbDtyZXR1cm4gbiYmW10uY29uY2F0KG8obikpLnNvbWUoZnVuY3Rpb24odCl7aWYodC5jbGFzc05hbWUubWF0Y2goZSkpcmV0dXJuIHI9dCwhMH0pLHJ9fSxmdW5jdGlvbih0LGUpe1widXNlIHN0cmljdFwiO09iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pO3ZhciBuPXtTVEFOREFSRDoxLE9USEVSUzotM30scj1bMSwyOCw1MDBdLG89ZnVuY3Rpb24odCl7cmV0dXJuIHJbdF18fHJbMF19O2UuZ2V0RGVsdGE9ZnVuY3Rpb24odCl7aWYoXCJkZWx0YVhcImluIHQpe3ZhciBlPW8odC5kZWx0YU1vZGUpO3JldHVybnt4OnQuZGVsdGFYL24uU1RBTkRBUkQqZSx5OnQuZGVsdGFZL24uU1RBTkRBUkQqZX19cmV0dXJuXCJ3aGVlbERlbHRhWFwiaW4gdD97eDp0LndoZWVsRGVsdGFYL24uT1RIRVJTLHk6dC53aGVlbERlbHRhWS9uLk9USEVSU306e3g6MCx5OnQud2hlZWxEZWx0YS9uLk9USEVSU319fSxmdW5jdGlvbih0LGUpe1widXNlIHN0cmljdFwiO09iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pO2UuZ2V0UG9pbnRlckRhdGE9ZnVuY3Rpb24odCl7cmV0dXJuIHQudG91Y2hlcz90LnRvdWNoZXNbdC50b3VjaGVzLmxlbmd0aC0xXTp0fX0sZnVuY3Rpb24odCxlLG4pe1widXNlIHN0cmljdFwiO09iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLGUuZ2V0UG9zaXRpb249dm9pZCAwO3ZhciByPW4oMTIyKTtlLmdldFBvc2l0aW9uPWZ1bmN0aW9uKHQpe3ZhciBlPSgwLHIuZ2V0UG9pbnRlckRhdGEpKHQpO3JldHVybnt4OmUuY2xpZW50WCx5OmUuY2xpZW50WX19fSxmdW5jdGlvbih0LGUsbil7XCJ1c2Ugc3RyaWN0XCI7T2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksZS5nZXRUb3VjaElEPXZvaWQgMDt2YXIgcj1uKDEyMik7ZS5nZXRUb3VjaElEPWZ1bmN0aW9uKHQpe3ZhciBlPSgwLHIuZ2V0UG9pbnRlckRhdGEpKHQpO3JldHVybiBlLmlkZW50aWZpZXJ9fSxmdW5jdGlvbih0LGUpe1widXNlIHN0cmljdFwiO09iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pO2UuaXNPbmVPZj1mdW5jdGlvbih0KXt2YXIgZT1hcmd1bWVudHMubGVuZ3RoPjEmJnZvaWQgMCE9PWFyZ3VtZW50c1sxXT9hcmd1bWVudHNbMV06W107cmV0dXJuIGUuc29tZShmdW5jdGlvbihlKXtyZXR1cm4gdD09PWV9KX19LGZ1bmN0aW9uKHQsZSl7XCJ1c2Ugc3RyaWN0XCI7T2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSk7ZS5waWNrSW5SYW5nZT1mdW5jdGlvbih0KXt2YXIgZT1hcmd1bWVudHMubGVuZ3RoPjEmJnZvaWQgMCE9PWFyZ3VtZW50c1sxXT9hcmd1bWVudHNbMV06LSgxLzApLG49YXJndW1lbnRzLmxlbmd0aD4yJiZ2b2lkIDAhPT1hcmd1bWVudHNbMl0/YXJndW1lbnRzWzJdOjEvMDtyZXR1cm4gTWF0aC5tYXgoZSxNYXRoLm1pbih0LG4pKX19LGZ1bmN0aW9uKHQsZSxuKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiByKHQpe3JldHVybiB0JiZ0Ll9fZXNNb2R1bGU/dDp7ZGVmYXVsdDp0fX12YXIgbz1uKDg5KSxpPXIobyk7T2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSk7dmFyIHU9W1wid2Via2l0XCIsXCJtb3pcIixcIm1zXCIsXCJvXCJdLGE9bmV3IFJlZ0V4cChcIl4tKD8hKD86XCIrdS5qb2luKFwifFwiKStcIiktKVwiKSxjPWZ1bmN0aW9uKHQpe3ZhciBlPXt9O3JldHVybigwLGkuZGVmYXVsdCkodCkuZm9yRWFjaChmdW5jdGlvbihuKXtpZighYS50ZXN0KG4pKXJldHVybiB2b2lkKGVbbl09dFtuXSk7dmFyIHI9dFtuXTtuPW4ucmVwbGFjZSgvXi0vLFwiXCIpLGVbbl09cix1LmZvckVhY2goZnVuY3Rpb24odCl7ZVtcIi1cIit0K1wiLVwiK25dPXJ9KX0pLGV9O2Uuc2V0U3R5bGU9ZnVuY3Rpb24odCxlKXtlPWMoZSksKDAsaS5kZWZhdWx0KShlKS5mb3JFYWNoKGZ1bmN0aW9uKG4pe3ZhciByPW4ucmVwbGFjZSgvXi0vLFwiXCIpLnJlcGxhY2UoLy0oW2Etel0pL2csZnVuY3Rpb24odCxlKXtyZXR1cm4gZS50b1VwcGVyQ2FzZSgpfSk7dC5zdHlsZVtyXT1lW25dfSl9fSxmdW5jdGlvbih0LGUsbil7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gcih0KXtyZXR1cm4gdCYmdC5fX2VzTW9kdWxlP3Q6e2RlZmF1bHQ6dH19ZnVuY3Rpb24gbyh0KXtpZihBcnJheS5pc0FycmF5KHQpKXtmb3IodmFyIGU9MCxuPUFycmF5KHQubGVuZ3RoKTtlPHQubGVuZ3RoO2UrKyluW2VdPXRbZV07cmV0dXJuIG59cmV0dXJuKDAsYS5kZWZhdWx0KSh0KX1mdW5jdGlvbiBpKHQsZSl7aWYoISh0IGluc3RhbmNlb2YgZSkpdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKX12YXIgdT1uKDIpLGE9cih1KSxjPW4oODUpLGw9cihjKSxmPW4oMTI5KSxzPXIoZik7T2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksZS5Ub3VjaFJlY29yZD12b2lkIDA7dmFyIGQ9cy5kZWZhdWx0fHxmdW5jdGlvbih0KXtmb3IodmFyIGU9MTtlPGFyZ3VtZW50cy5sZW5ndGg7ZSsrKXt2YXIgbj1hcmd1bWVudHNbZV07Zm9yKHZhciByIGluIG4pT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG4scikmJih0W3JdPW5bcl0pfXJldHVybiB0fSxoPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gdCh0LGUpe2Zvcih2YXIgbj0wO248ZS5sZW5ndGg7bisrKXt2YXIgcj1lW25dO3IuZW51bWVyYWJsZT1yLmVudW1lcmFibGV8fCExLHIuY29uZmlndXJhYmxlPSEwLFwidmFsdWVcImluIHImJihyLndyaXRhYmxlPSEwKSwoMCxsLmRlZmF1bHQpKHQsci5rZXkscil9fXJldHVybiBmdW5jdGlvbihlLG4scil7cmV0dXJuIG4mJnQoZS5wcm90b3R5cGUsbiksciYmdChlLHIpLGV9fSgpLHY9bigxMjMpLF89ZnVuY3Rpb24oKXtmdW5jdGlvbiB0KGUpe2kodGhpcyx0KSx0aGlzLnVwZGF0ZVRpbWU9RGF0ZS5ub3coKSx0aGlzLmRlbHRhPXt4OjAseTowfSx0aGlzLnZlbG9jaXR5PXt4OjAseTowfSx0aGlzLmxhc3RQb3NpdGlvbj0oMCx2LmdldFBvc2l0aW9uKShlKX1yZXR1cm4gaCh0LFt7a2V5OlwidXBkYXRlXCIsdmFsdWU6ZnVuY3Rpb24odCl7dmFyIGU9dGhpcy52ZWxvY2l0eSxuPXRoaXMudXBkYXRlVGltZSxyPXRoaXMubGFzdFBvc2l0aW9uLG89RGF0ZS5ub3coKSxpPSgwLHYuZ2V0UG9zaXRpb24pKHQpLHU9e3g6LShpLngtci54KSx5Oi0oaS55LXIueSl9LGE9by1ufHwxNixjPXUueC9hKjFlMyxsPXUueS9hKjFlMztlLng9LjgqYysuMiplLngsZS55PS44KmwrLjIqZS55LHRoaXMuZGVsdGE9dSx0aGlzLnVwZGF0ZVRpbWU9byx0aGlzLmxhc3RQb3NpdGlvbj1pfX1dKSx0fSgpO2UuVG91Y2hSZWNvcmQ9ZnVuY3Rpb24oKXtmdW5jdGlvbiB0KCl7aSh0aGlzLHQpLHRoaXMudG91Y2hMaXN0PXt9LHRoaXMubGFzdFRvdWNoPW51bGwsdGhpcy5hY3RpdmVUb3VjaElEPXZvaWQgMH1yZXR1cm4gaCh0LFt7a2V5OlwiX19hZGRcIix2YWx1ZTpmdW5jdGlvbih0KXtpZih0aGlzLl9faGFzKHQpKXJldHVybiBudWxsO3ZhciBlPW5ldyBfKHQpO3JldHVybiB0aGlzLnRvdWNoTGlzdFt0LmlkZW50aWZpZXJdPWUsZX19LHtrZXk6XCJfX3JlbmV3XCIsdmFsdWU6ZnVuY3Rpb24odCl7aWYoIXRoaXMuX19oYXModCkpcmV0dXJuIG51bGw7dmFyIGU9dGhpcy50b3VjaExpc3RbdC5pZGVudGlmaWVyXTtyZXR1cm4gZS51cGRhdGUodCksZX19LHtrZXk6XCJfX2RlbGV0ZVwiLHZhbHVlOmZ1bmN0aW9uKHQpe3JldHVybiBkZWxldGUgdGhpcy50b3VjaExpc3RbdC5pZGVudGlmaWVyXX19LHtrZXk6XCJfX2hhc1wiLHZhbHVlOmZ1bmN0aW9uKHQpe3JldHVybiB0aGlzLnRvdWNoTGlzdC5oYXNPd25Qcm9wZXJ0eSh0LmlkZW50aWZpZXIpfX0se2tleTpcIl9fc2V0QWN0aXZlSURcIix2YWx1ZTpmdW5jdGlvbih0KXt0aGlzLmFjdGl2ZVRvdWNoSUQ9dFt0Lmxlbmd0aC0xXS5pZGVudGlmaWVyLHRoaXMubGFzdFRvdWNoPXRoaXMudG91Y2hMaXN0W3RoaXMuYWN0aXZlVG91Y2hJRF19fSx7a2V5OlwiX19nZXRBY3RpdmVUcmFja2VyXCIsdmFsdWU6ZnVuY3Rpb24oKXt2YXIgdD10aGlzLnRvdWNoTGlzdCxlPXRoaXMuYWN0aXZlVG91Y2hJRDtyZXR1cm4gdFtlXX19LHtrZXk6XCJpc0FjdGl2ZVwiLHZhbHVlOmZ1bmN0aW9uKCl7cmV0dXJuIHZvaWQgMCE9PXRoaXMuYWN0aXZlVG91Y2hJRH19LHtrZXk6XCJnZXREZWx0YVwiLHZhbHVlOmZ1bmN0aW9uKCl7dmFyIHQ9dGhpcy5fX2dldEFjdGl2ZVRyYWNrZXIoKTtyZXR1cm4gdD9kKHt9LHQuZGVsdGEpOnRoaXMuX19wcmltaXRpdmVWYWx1ZX19LHtrZXk6XCJnZXRWZWxvY2l0eVwiLHZhbHVlOmZ1bmN0aW9uKCl7dmFyIHQ9dGhpcy5fX2dldEFjdGl2ZVRyYWNrZXIoKTtyZXR1cm4gdD9kKHt9LHQudmVsb2NpdHkpOnRoaXMuX19wcmltaXRpdmVWYWx1ZX19LHtrZXk6XCJnZXRMYXN0UG9zaXRpb25cIix2YWx1ZTpmdW5jdGlvbigpe3ZhciB0PWFyZ3VtZW50cy5sZW5ndGg+MCYmdm9pZCAwIT09YXJndW1lbnRzWzBdP2FyZ3VtZW50c1swXTpcIlwiLGU9dGhpcy5fX2dldEFjdGl2ZVRyYWNrZXIoKXx8dGhpcy5sYXN0VG91Y2gsbj1lP2UubGFzdFBvc2l0aW9uOnRoaXMuX19wcmltaXRpdmVWYWx1ZTtyZXR1cm4gdD9uLmhhc093blByb3BlcnR5KHQpP25bdF06MDpkKHt9LG4pfX0se2tleTpcInVwZGF0ZWRSZWNlbnRseVwiLHZhbHVlOmZ1bmN0aW9uKCl7dmFyIHQ9dGhpcy5fX2dldEFjdGl2ZVRyYWNrZXIoKTtyZXR1cm4gdCYmRGF0ZS5ub3coKS10LnVwZGF0ZVRpbWU8MzB9fSx7a2V5OlwidHJhY2tcIix2YWx1ZTpmdW5jdGlvbih0KXt2YXIgZT10aGlzLG49dC50YXJnZXRUb3VjaGVzO3JldHVybltdLmNvbmNhdChvKG4pKS5mb3JFYWNoKGZ1bmN0aW9uKHQpe2UuX19hZGQodCl9KSx0aGlzLnRvdWNoTGlzdH19LHtrZXk6XCJ1cGRhdGVcIix2YWx1ZTpmdW5jdGlvbih0KXt2YXIgZT10aGlzLG49dC50b3VjaGVzLHI9dC5jaGFuZ2VkVG91Y2hlcztyZXR1cm5bXS5jb25jYXQobyhuKSkuZm9yRWFjaChmdW5jdGlvbih0KXtlLl9fcmVuZXcodCl9KSx0aGlzLl9fc2V0QWN0aXZlSUQociksdGhpcy50b3VjaExpc3R9fSx7a2V5OlwicmVsZWFzZVwiLHZhbHVlOmZ1bmN0aW9uKHQpe3ZhciBlPXRoaXM7cmV0dXJuIHRoaXMuYWN0aXZlVG91Y2hJRD12b2lkIDAsW10uY29uY2F0KG8odC5jaGFuZ2VkVG91Y2hlcykpLmZvckVhY2goZnVuY3Rpb24odCl7ZS5fX2RlbGV0ZSh0KX0pLHRoaXMudG91Y2hMaXN0fX0se2tleTpcIl9fcHJpbWl0aXZlVmFsdWVcIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm57eDowLHk6MH19fV0pLHR9KCl9LGZ1bmN0aW9uKHQsZSxuKXt0LmV4cG9ydHM9e2RlZmF1bHQ6bigxMzApLF9fZXNNb2R1bGU6ITB9fSxmdW5jdGlvbih0LGUsbil7bigxMzEpLHQuZXhwb3J0cz1uKDEyKS5PYmplY3QuYXNzaWdufSxmdW5jdGlvbih0LGUsbil7dmFyIHI9bigxMCk7cihyLlMrci5GLFwiT2JqZWN0XCIse2Fzc2lnbjpuKDEzMil9KX0sZnVuY3Rpb24odCxlLG4pe1widXNlIHN0cmljdFwiO3ZhciByPW4oMzEpLG89big2OCksaT1uKDY5KSx1PW4oNDcpLGE9bigzNCksYz1PYmplY3QuYXNzaWduO3QuZXhwb3J0cz0hY3x8bigyMSkoZnVuY3Rpb24oKXt2YXIgdD17fSxlPXt9LG49U3ltYm9sKCkscj1cImFiY2RlZmdoaWprbG1ub3BxcnN0XCI7cmV0dXJuIHRbbl09NyxyLnNwbGl0KFwiXCIpLmZvckVhY2goZnVuY3Rpb24odCl7ZVt0XT10fSksNyE9Yyh7fSx0KVtuXXx8T2JqZWN0LmtleXMoYyh7fSxlKSkuam9pbihcIlwiKSE9cn0pP2Z1bmN0aW9uKHQsZSl7Zm9yKHZhciBuPXUodCksYz1hcmd1bWVudHMubGVuZ3RoLGw9MSxmPW8uZixzPWkuZjtjPmw7KWZvcih2YXIgZCxoPWEoYXJndW1lbnRzW2wrK10pLHY9Zj9yKGgpLmNvbmNhdChmKGgpKTpyKGgpLF89di5sZW5ndGgscD0wO18+cDspcy5jYWxsKGgsZD12W3ArK10pJiYobltkXT1oW2RdKTtyZXR1cm4gbn06Y30sZnVuY3Rpb24odCxlLG4pe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIHIodCl7cmV0dXJuIHQmJnQuX19lc01vZHVsZT90OntkZWZhdWx0OnR9fXZhciBvPW4oODUpLGk9cihvKSx1PW4oODkpLGE9cih1KTtPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KTt2YXIgYz1uKDEzNCk7KDAsYS5kZWZhdWx0KShjKS5mb3JFYWNoKGZ1bmN0aW9uKHQpe1wiZGVmYXVsdFwiIT09dCYmXCJfX2VzTW9kdWxlXCIhPT10JiYoMCxpLmRlZmF1bHQpKGUsdCx7ZW51bWVyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gY1t0XX19KX0pfSxmdW5jdGlvbih0LGUsbil7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gcih0KXtyZXR1cm4gdCYmdC5fX2VzTW9kdWxlP3Q6e2RlZmF1bHQ6dH19dmFyIG89big4NSksaT1yKG8pLHU9big4OSksYT1yKHUpO09iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pO3ZhciBjPW4oMTM1KTsoMCxhLmRlZmF1bHQpKGMpLmZvckVhY2goZnVuY3Rpb24odCl7XCJkZWZhdWx0XCIhPT10JiZcIl9fZXNNb2R1bGVcIiE9PXQmJigwLGkuZGVmYXVsdCkoZSx0LHtlbnVtZXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe3JldHVybiBjW3RdfX0pfSk7dmFyIGw9bigxMzYpOygwLGEuZGVmYXVsdCkobCkuZm9yRWFjaChmdW5jdGlvbih0KXtcImRlZmF1bHRcIiE9PXQmJlwiX19lc01vZHVsZVwiIT09dCYmKDAsaS5kZWZhdWx0KShlLHQse2VudW1lcmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGxbdF19fSl9KTt2YXIgZj1uKDEzNyk7KDAsYS5kZWZhdWx0KShmKS5mb3JFYWNoKGZ1bmN0aW9uKHQpe1wiZGVmYXVsdFwiIT09dCYmXCJfX2VzTW9kdWxlXCIhPT10JiYoMCxpLmRlZmF1bHQpKGUsdCx7ZW51bWVyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gZlt0XX19KX0pO3ZhciBzPW4oMTM4KTsoMCxhLmRlZmF1bHQpKHMpLmZvckVhY2goZnVuY3Rpb24odCl7XCJkZWZhdWx0XCIhPT10JiZcIl9fZXNNb2R1bGVcIiE9PXQmJigwLGkuZGVmYXVsdCkoZSx0LHtlbnVtZXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe3JldHVybiBzW3RdfX0pfSk7dmFyIGQ9bigxMzkpOygwLGEuZGVmYXVsdCkoZCkuZm9yRWFjaChmdW5jdGlvbih0KXtcImRlZmF1bHRcIiE9PXQmJlwiX19lc01vZHVsZVwiIT09dCYmKDAsaS5kZWZhdWx0KShlLHQse2VudW1lcmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGRbdF19fSl9KTt2YXIgaD1uKDE0MCk7KDAsYS5kZWZhdWx0KShoKS5mb3JFYWNoKGZ1bmN0aW9uKHQpe1wiZGVmYXVsdFwiIT09dCYmXCJfX2VzTW9kdWxlXCIhPT10JiYoMCxpLmRlZmF1bHQpKGUsdCx7ZW51bWVyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gaFt0XX19KX0pO3ZhciB2PW4oMTQxKTsoMCxhLmRlZmF1bHQpKHYpLmZvckVhY2goZnVuY3Rpb24odCl7XCJkZWZhdWx0XCIhPT10JiZcIl9fZXNNb2R1bGVcIiE9PXQmJigwLGkuZGVmYXVsdCkoZSx0LHtlbnVtZXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe3JldHVybiB2W3RdfX0pfSk7dmFyIF89bigxNDIpOygwLGEuZGVmYXVsdCkoXykuZm9yRWFjaChmdW5jdGlvbih0KXtcImRlZmF1bHRcIiE9PXQmJlwiX19lc01vZHVsZVwiIT09dCYmKDAsaS5kZWZhdWx0KShlLHQse2VudW1lcmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIF9bdF19fSl9KTt2YXIgcD1uKDE0Myk7KDAsYS5kZWZhdWx0KShwKS5mb3JFYWNoKGZ1bmN0aW9uKHQpe1wiZGVmYXVsdFwiIT09dCYmXCJfX2VzTW9kdWxlXCIhPT10JiYoMCxpLmRlZmF1bHQpKGUsdCx7ZW51bWVyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gcFt0XX19KX0pO3ZhciB5PW4oMTQ0KTsoMCxhLmRlZmF1bHQpKHkpLmZvckVhY2goZnVuY3Rpb24odCl7XCJkZWZhdWx0XCIhPT10JiZcIl9fZXNNb2R1bGVcIiE9PXQmJigwLGkuZGVmYXVsdCkoZSx0LHtlbnVtZXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe3JldHVybiB5W3RdfX0pfSk7dmFyIGI9bigxNDUpOygwLGEuZGVmYXVsdCkoYikuZm9yRWFjaChmdW5jdGlvbih0KXtcImRlZmF1bHRcIiE9PXQmJlwiX19lc01vZHVsZVwiIT09dCYmKDAsaS5kZWZhdWx0KShlLHQse2VudW1lcmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGJbdF19fSl9KTt2YXIgZz1uKDE0Nik7KDAsYS5kZWZhdWx0KShnKS5mb3JFYWNoKGZ1bmN0aW9uKHQpe1wiZGVmYXVsdFwiIT09dCYmXCJfX2VzTW9kdWxlXCIhPT10JiYoMCxpLmRlZmF1bHQpKGUsdCx7ZW51bWVyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gZ1t0XX19KX0pO3ZhciBtPW4oMTQ3KTsoMCxhLmRlZmF1bHQpKG0pLmZvckVhY2goZnVuY3Rpb24odCl7XCJkZWZhdWx0XCIhPT10JiZcIl9fZXNNb2R1bGVcIiE9PXQmJigwLGkuZGVmYXVsdCkoZSx0LHtlbnVtZXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe3JldHVybiBtW3RdfX0pfSk7dmFyIHg9bigxNDgpOygwLGEuZGVmYXVsdCkoeCkuZm9yRWFjaChmdW5jdGlvbih0KXtcImRlZmF1bHRcIiE9PXQmJlwiX19lc01vZHVsZVwiIT09dCYmKDAsaS5kZWZhdWx0KShlLHQse2VudW1lcmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHhbdF19fSl9KTt2YXIgUz1uKDE0OSk7KDAsYS5kZWZhdWx0KShTKS5mb3JFYWNoKGZ1bmN0aW9uKHQpe1wiZGVmYXVsdFwiIT09dCYmXCJfX2VzTW9kdWxlXCIhPT10JiYoMCxpLmRlZmF1bHQpKGUsdCx7ZW51bWVyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gU1t0XX19KX0pfSxmdW5jdGlvbih0LGUsbil7XCJ1c2Ugc3RyaWN0XCI7dmFyIHI9big3Nyk7ci5TbW9vdGhTY3JvbGxiYXIucHJvdG90eXBlLmNsZWFyTW92ZW1lbnQ9ci5TbW9vdGhTY3JvbGxiYXIucHJvdG90eXBlLnN0b3A9ZnVuY3Rpb24oKXt0aGlzLm1vdmVtZW50Lng9dGhpcy5tb3ZlbWVudC55PTAsY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy5fX3RpbWVySUQuc2Nyb2xsVG8pfX0sZnVuY3Rpb24odCxlLG4pe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIHIodCl7cmV0dXJuIHQmJnQuX19lc01vZHVsZT90OntkZWZhdWx0OnR9fWZ1bmN0aW9uIG8odCl7aWYoQXJyYXkuaXNBcnJheSh0KSl7Zm9yKHZhciBlPTAsbj1BcnJheSh0Lmxlbmd0aCk7ZTx0Lmxlbmd0aDtlKyspbltlXT10W2VdO3JldHVybiBufXJldHVybigwLHUuZGVmYXVsdCkodCl9dmFyIGk9bigyKSx1PXIoaSksYT1uKDc3KSxjPW4oMTE2KSxsPW4oODgpO2EuU21vb3RoU2Nyb2xsYmFyLnByb3RvdHlwZS5kZXN0cm95PWZ1bmN0aW9uKHQpe3ZhciBlPXRoaXMuX19saXN0ZW5lcnMsbj10aGlzLl9faGFuZGxlcnMscj10aGlzLl9fb2JzZXJ2ZXIsaT10aGlzLnRhcmdldHMsdT1pLmNvbnRhaW5lcixhPWkuY29udGVudDtuLmZvckVhY2goZnVuY3Rpb24odCl7dmFyIGU9dC5ldnQsbj10LmVsZW0scj10LmZuO24ucmVtb3ZlRXZlbnRMaXN0ZW5lcihlLHIpfSksbi5sZW5ndGg9ZS5sZW5ndGg9MCx0aGlzLnN0b3AoKSxjYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLl9fdGltZXJJRC5yZW5kZXIpLHImJnIuZGlzY29ubmVjdCgpLGwuc2JMaXN0LmRlbGV0ZSh1KSx0fHx0aGlzLnNjcm9sbFRvKDAsMCwzMDAsZnVuY3Rpb24oKXtpZih1LnBhcmVudE5vZGUpeygwLGMuc2V0U3R5bGUpKHUse292ZXJmbG93OlwiXCJ9KSx1LnNjcm9sbFRvcD11LnNjcm9sbExlZnQ9MDtmb3IodmFyIHQ9W10uY29uY2F0KG8oYS5jaGlsZE5vZGVzKSk7dS5maXJzdENoaWxkOyl1LnJlbW92ZUNoaWxkKHUuZmlyc3RDaGlsZCk7dC5mb3JFYWNoKGZ1bmN0aW9uKHQpe3JldHVybiB1LmFwcGVuZENoaWxkKHQpfSl9fSl9fSxmdW5jdGlvbih0LGUsbil7XCJ1c2Ugc3RyaWN0XCI7dmFyIHI9big3Nyk7ci5TbW9vdGhTY3JvbGxiYXIucHJvdG90eXBlLmdldENvbnRlbnRFbGVtPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudGFyZ2V0cy5jb250ZW50fX0sZnVuY3Rpb24odCxlLG4pe1widXNlIHN0cmljdFwiO3ZhciByPW4oNzcpO3IuU21vb3RoU2Nyb2xsYmFyLnByb3RvdHlwZS5nZXRTaXplPWZ1bmN0aW9uKCl7dmFyIHQ9dGhpcy50YXJnZXRzLmNvbnRhaW5lcixlPXRoaXMudGFyZ2V0cy5jb250ZW50O3JldHVybntjb250YWluZXI6e3dpZHRoOnQuY2xpZW50V2lkdGgsaGVpZ2h0OnQuY2xpZW50SGVpZ2h0fSxjb250ZW50Ont3aWR0aDplLm9mZnNldFdpZHRoLWUuY2xpZW50V2lkdGgrZS5zY3JvbGxXaWR0aCxoZWlnaHQ6ZS5vZmZzZXRIZWlnaHQtZS5jbGllbnRIZWlnaHQrZS5zY3JvbGxIZWlnaHR9fX19LGZ1bmN0aW9uKHQsZSxuKXtcInVzZSBzdHJpY3RcIjt2YXIgcj1uKDc3KTtyLlNtb290aFNjcm9sbGJhci5wcm90b3R5cGUuaW5maW5pdGVTY3JvbGw9ZnVuY3Rpb24odCl7dmFyIGU9YXJndW1lbnRzLmxlbmd0aD4xJiZ2b2lkIDAhPT1hcmd1bWVudHNbMV0/YXJndW1lbnRzWzFdOjUwO2lmKFwiZnVuY3Rpb25cIj09dHlwZW9mIHQpe3ZhciBuPXt4OjAseTowfSxyPSExO3RoaXMuYWRkTGlzdGVuZXIoZnVuY3Rpb24obyl7dmFyIGk9by5vZmZzZXQsdT1vLmxpbWl0O3UueS1pLnk8PWUmJmkueT5uLnkmJiFyJiYocj0hMCxzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7cmV0dXJuIHQobyl9KSksdS55LWkueT5lJiYocj0hMSksbj1pfSl9fX0sZnVuY3Rpb24odCxlLG4pe1widXNlIHN0cmljdFwiO3ZhciByPW4oNzcpO3IuU21vb3RoU2Nyb2xsYmFyLnByb3RvdHlwZS5pc1Zpc2libGU9ZnVuY3Rpb24odCl7dmFyIGU9dGhpcy5ib3VuZGluZyxuPXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkscj1NYXRoLm1heChlLnRvcCxuLnRvcCksbz1NYXRoLm1heChlLmxlZnQsbi5sZWZ0KSxpPU1hdGgubWluKGUucmlnaHQsbi5yaWdodCksdT1NYXRoLm1pbihlLmJvdHRvbSxuLmJvdHRvbSk7cmV0dXJuIHI8dSYmbzxpfX0sZnVuY3Rpb24odCxlLG4pe1widXNlIHN0cmljdFwiO3ZhciByPW4oNzcpO3IuU21vb3RoU2Nyb2xsYmFyLnByb3RvdHlwZS5hZGRMaXN0ZW5lcj1mdW5jdGlvbih0KXtcImZ1bmN0aW9uXCI9PXR5cGVvZiB0JiZ0aGlzLl9fbGlzdGVuZXJzLnB1c2godCl9LHIuU21vb3RoU2Nyb2xsYmFyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lcj1mdW5jdGlvbih0KXtcImZ1bmN0aW9uXCI9PXR5cGVvZiB0JiZ0aGlzLl9fbGlzdGVuZXJzLnNvbWUoZnVuY3Rpb24oZSxuLHIpe3JldHVybiBlPT09dCYmci5zcGxpY2UobiwxKX0pfX0sZnVuY3Rpb24odCxlLG4pe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIHIodCl7cmV0dXJuIHQmJnQuX19lc01vZHVsZT90OntkZWZhdWx0OnR9fWZ1bmN0aW9uIG8odCxlLG4pe3JldHVybiBlIGluIHQ/KDAsbC5kZWZhdWx0KSh0LGUse3ZhbHVlOm4sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITB9KTp0W2VdPW4sdH1mdW5jdGlvbiBpKHQsZSl7cmV0dXJuISFlLmxlbmd0aCYmZS5zb21lKGZ1bmN0aW9uKGUpe3JldHVybiB0Lm1hdGNoKGUpfSl9ZnVuY3Rpb24gdSgpe3ZhciB0PWFyZ3VtZW50cy5sZW5ndGg+MCYmdm9pZCAwIT09YXJndW1lbnRzWzBdP2FyZ3VtZW50c1swXTpzLlJFR0lFU1RFUixlPWRbdF07cmV0dXJuIGZ1bmN0aW9uKG4pe2Zvcih2YXIgcj1hcmd1bWVudHMubGVuZ3RoLG89QXJyYXkocj4xP3ItMTowKSx1PTE7dTxyO3UrKylvW3UtMV09YXJndW1lbnRzW3VdO3RoaXMuX19oYW5kbGVycy5mb3JFYWNoKGZ1bmN0aW9uKHIpe3ZhciB1PXIuZWxlbSxhPXIuZXZ0LGM9ci5mbixsPXIuaGFzUmVnaXN0ZXJlZDtsJiZ0PT09bi5SRUdJRVNURVJ8fCFsJiZ0PT09bi5VTlJFR0lFU1RFUnx8aShhLG8pJiYodVtlXShhLGMpLHIuaGFzUmVnaXN0ZXJlZD0hbCl9KX19dmFyIGEsYz1uKDg1KSxsPXIoYyksZj1uKDc3KSxzPXtSRUdJRVNURVI6MCxVTlJFR0lFU1RFUjoxfSxkPShhPXt9LG8oYSxzLlJFR0lFU1RFUixcImFkZEV2ZW50TGlzdGVuZXJcIiksbyhhLHMuVU5SRUdJRVNURVIsXCJyZW1vdmVFdmVudExpc3RlbmVyXCIpLGEpO2YuU21vb3RoU2Nyb2xsYmFyLnByb3RvdHlwZS5yZWdpc3RlckV2ZW50cz11KHMuUkVHSUVTVEVSKSxmLlNtb290aFNjcm9sbGJhci5wcm90b3R5cGUudW5yZWdpc3RlckV2ZW50cz11KHMuVU5SRUdJRVNURVIpfSxmdW5jdGlvbih0LGUsbil7XCJ1c2Ugc3RyaWN0XCI7dmFyIHI9big3Nyk7ci5TbW9vdGhTY3JvbGxiYXIucHJvdG90eXBlLnJldmVyc2VXaGVlbD1mdW5jdGlvbigpe3ZhciB0PWFyZ3VtZW50cy5sZW5ndGg+MCYmdm9pZCAwIT09YXJndW1lbnRzWzBdJiZhcmd1bWVudHNbMF07dGhpcy53aGVlbFJldmVyc2VkPVwiYm9vbGVhblwiPT10eXBlb2YgdCYmdCx0aGlzLl9fcmVhZG9ubHkoXCJ3aGVlbFJldmVyc2VkXCIsdGhpcy53aGVlbFJldmVyc2VkKX19LGZ1bmN0aW9uKHQsZSxuKXtcInVzZSBzdHJpY3RcIjt2YXIgcj1uKDc3KTtyLlNtb290aFNjcm9sbGJhci5wcm90b3R5cGUuc2Nyb2xsSW50b1ZpZXc9ZnVuY3Rpb24odCl7dmFyIGU9YXJndW1lbnRzLmxlbmd0aD4xJiZ2b2lkIDAhPT1hcmd1bWVudHNbMV0/YXJndW1lbnRzWzFdOnt9LG49ZS5hbGlnblRvVG9wLHI9dm9pZCAwPT09bnx8bixvPWUub25seVNjcm9sbElmTmVlZGVkLGk9dm9pZCAwIT09byYmbyx1PWUub2Zmc2V0VG9wLGE9dm9pZCAwPT09dT8wOnUsYz1lLm9mZnNldExlZnQsbD12b2lkIDA9PT1jPzA6YyxmPWUub2Zmc2V0Qm90dG9tLHM9dm9pZCAwPT09Zj8wOmYsZD10aGlzLnRhcmdldHMsaD10aGlzLmJvdW5kaW5nO2lmKHQmJmQuY29udGFpbmVyLmNvbnRhaW5zKHQpKXt2YXIgdj10LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO2kmJnRoaXMuaXNWaXNpYmxlKHQpfHx0aGlzLl9fc2V0TW92ZW1lbnQodi5sZWZ0LWgubGVmdC1sLHI/di50b3AtaC50b3AtYTp2LmJvdHRvbS1oLmJvdHRvbS1zKX19fSxmdW5jdGlvbih0LGUsbil7XCJ1c2Ugc3RyaWN0XCI7dmFyIHI9bigxMTYpLG89big3Nyk7by5TbW9vdGhTY3JvbGxiYXIucHJvdG90eXBlLnNjcm9sbFRvPWZ1bmN0aW9uKCl7dmFyIHQ9YXJndW1lbnRzLmxlbmd0aD4wJiZ2b2lkIDAhPT1hcmd1bWVudHNbMF0/YXJndW1lbnRzWzBdOnRoaXMub2Zmc2V0LngsZT1hcmd1bWVudHMubGVuZ3RoPjEmJnZvaWQgMCE9PWFyZ3VtZW50c1sxXT9hcmd1bWVudHNbMV06dGhpcy5vZmZzZXQueSxuPXRoaXMsbz1hcmd1bWVudHMubGVuZ3RoPjImJnZvaWQgMCE9PWFyZ3VtZW50c1syXT9hcmd1bWVudHNbMl06MCxpPWFyZ3VtZW50cy5sZW5ndGg+MyYmdm9pZCAwIT09YXJndW1lbnRzWzNdP2FyZ3VtZW50c1szXTpudWxsLHU9dGhpcy5vcHRpb25zLGE9dGhpcy5vZmZzZXQsYz10aGlzLmxpbWl0LGw9dGhpcy5fX3RpbWVySUQ7Y2FuY2VsQW5pbWF0aW9uRnJhbWUobC5zY3JvbGxUbyksaT1cImZ1bmN0aW9uXCI9PXR5cGVvZiBpP2k6ZnVuY3Rpb24oKXt9LHUucmVuZGVyQnlQaXhlbHMmJih0PU1hdGgucm91bmQodCksZT1NYXRoLnJvdW5kKGUpKTt2YXIgZj1hLngscz1hLnksZD0oMCxyLnBpY2tJblJhbmdlKSh0LDAsYy54KS1mLGg9KDAsci5waWNrSW5SYW5nZSkoZSwwLGMueSktcyx2PSgwLHIuYnVpbGRDdXJ2ZSkoZCxvKSxfPSgwLHIuYnVpbGRDdXJ2ZSkoaCxvKSxwPXYubGVuZ3RoLHk9MCxiPWZ1bmN0aW9uIHQoKXtuLnNldFBvc2l0aW9uKGYrdlt5XSxzK19beV0pLHkrKyx5PT09cD9yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24oKXtpKG4pfSk6bC5zY3JvbGxUbz1yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodCl9O2IoKX19LGZ1bmN0aW9uKHQsZSxuKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiByKHQpe3JldHVybiB0JiZ0Ll9fZXNNb2R1bGU/dDp7ZGVmYXVsdDp0fX12YXIgbz1uKDg5KSxpPXIobyksdT1uKDc3KTt1LlNtb290aFNjcm9sbGJhci5wcm90b3R5cGUuc2V0T3B0aW9ucz1mdW5jdGlvbigpe3ZhciB0PXRoaXMsZT1hcmd1bWVudHMubGVuZ3RoPjAmJnZvaWQgMCE9PWFyZ3VtZW50c1swXT9hcmd1bWVudHNbMF06e307KDAsaS5kZWZhdWx0KShlKS5mb3JFYWNoKGZ1bmN0aW9uKG4pe3Qub3B0aW9ucy5oYXNPd25Qcm9wZXJ0eShuKSYmdm9pZCAwIT09ZVtuXSYmKHQub3B0aW9uc1tuXT1lW25dKX0pfX0sZnVuY3Rpb24odCxlLG4pe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIHIodCl7cmV0dXJuIHQmJnQuX19lc01vZHVsZT90OntkZWZhdWx0OnR9fXZhciBvPW4oMTI5KSxpPXIobyksdT1pLmRlZmF1bHR8fGZ1bmN0aW9uKHQpe2Zvcih2YXIgZT0xO2U8YXJndW1lbnRzLmxlbmd0aDtlKyspe3ZhciBuPWFyZ3VtZW50c1tlXTtmb3IodmFyIHIgaW4gbilPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobixyKSYmKHRbcl09bltyXSl9cmV0dXJuIHR9LGE9bigxMTYpLGM9big3Nyk7Yy5TbW9vdGhTY3JvbGxiYXIucHJvdG90eXBlLnNldFBvc2l0aW9uPWZ1bmN0aW9uKCl7dmFyIHQ9YXJndW1lbnRzLmxlbmd0aD4wJiZ2b2lkIDAhPT1hcmd1bWVudHNbMF0/YXJndW1lbnRzWzBdOnRoaXMub2Zmc2V0LngsZT1hcmd1bWVudHMubGVuZ3RoPjEmJnZvaWQgMCE9PWFyZ3VtZW50c1sxXT9hcmd1bWVudHNbMV06dGhpcy5vZmZzZXQueSxuPWFyZ3VtZW50cy5sZW5ndGg+MiYmdm9pZCAwIT09YXJndW1lbnRzWzJdJiZhcmd1bWVudHNbMl07dGhpcy5fX2hpZGVUcmFja1Rocm90dGxlKCk7dmFyIHI9e30sbz10aGlzLm9wdGlvbnMsaT10aGlzLm9mZnNldCxjPXRoaXMubGltaXQsbD10aGlzLnRhcmdldHMsZj10aGlzLl9fbGlzdGVuZXJzO28ucmVuZGVyQnlQaXhlbHMmJih0PU1hdGgucm91bmQodCksZT1NYXRoLnJvdW5kKGUpKSx0IT09aS54JiZ0aGlzLnNob3dUcmFjayhcInhcIiksZSE9PWkueSYmdGhpcy5zaG93VHJhY2soXCJ5XCIpLHQ9KDAsYS5waWNrSW5SYW5nZSkodCwwLGMueCksZT0oMCxhLnBpY2tJblJhbmdlKShlLDAsYy55KSx0PT09aS54JiZlPT09aS55fHwoci5kaXJlY3Rpb249e3g6dD09PWkueD9cIm5vbmVcIjp0PmkueD9cInJpZ2h0XCI6XCJsZWZ0XCIseTplPT09aS55P1wibm9uZVwiOmU+aS55P1wiZG93blwiOlwidXBcIn0sdGhpcy5fX3JlYWRvbmx5KFwib2Zmc2V0XCIse3g6dCx5OmV9KSxyLmxpbWl0PXUoe30sYyksci5vZmZzZXQ9dSh7fSx0aGlzLm9mZnNldCksdGhpcy5fX3NldFRodW1iUG9zaXRpb24oKSwoMCxhLnNldFN0eWxlKShsLmNvbnRlbnQse1wiLXRyYW5zZm9ybVwiOlwidHJhbnNsYXRlM2QoXCIrLXQrXCJweCwgXCIrLWUrXCJweCwgMClcIn0pLG58fGYuZm9yRWFjaChmdW5jdGlvbih0KXtvLnN5bmNDYWxsYmFja3M/dChyKTpyZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24oKXt0KHIpfSl9KSl9fSxmdW5jdGlvbih0LGUsbil7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gcih0KXtyZXR1cm4gdCYmdC5fX2VzTW9kdWxlP3Q6e2RlZmF1bHQ6dH19ZnVuY3Rpb24gbyh0LGUsbil7cmV0dXJuIGUgaW4gdD8oMCxjLmRlZmF1bHQpKHQsZSx7dmFsdWU6bixlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMH0pOnRbZV09bix0fWZ1bmN0aW9uIGkoKXt2YXIgdD1hcmd1bWVudHMubGVuZ3RoPjAmJnZvaWQgMCE9PWFyZ3VtZW50c1swXT9hcmd1bWVudHNbMF06Zi5TSE9XLGU9c1t0XTtyZXR1cm4gZnVuY3Rpb24oKXt2YXIgbj1hcmd1bWVudHMubGVuZ3RoPjAmJnZvaWQgMCE9PWFyZ3VtZW50c1swXT9hcmd1bWVudHNbMF06XCJib3RoXCIscj17VFJBQ0s6XCJzaG93XCIsQ09OVEFJTkVSOlwic2Nyb2xsaW5nXCJ9LG89dGhpcy5vcHRpb25zLGk9dGhpcy5tb3ZlbWVudCx1PXRoaXMudGFyZ2V0cyxhPXUuY29udGFpbmVyLGM9dS54QXhpcyxsPXUueUF4aXM7aS54fHxpLnk/YS5jbGFzc0xpc3QuYWRkKHIuQ09OVEFJTkVSKTphLmNsYXNzTGlzdC5yZW1vdmUoci5DT05UQUlORVIpLG8uYWx3YXlzU2hvd1RyYWNrcyYmdD09PWYuSElERXx8KG49bi50b0xvd2VyQ2FzZSgpLFwiYm90aFwiPT09biYmKGMudHJhY2suY2xhc3NMaXN0W2VdKHIuVFJBQ0spLGwudHJhY2suY2xhc3NMaXN0W2VdKHIuVFJBQ0spKSxcInhcIj09PW4mJmMudHJhY2suY2xhc3NMaXN0W2VdKHIuVFJBQ0spLFwieVwiPT09biYmbC50cmFjay5jbGFzc0xpc3RbZV0oci5UUkFDSykpfX12YXIgdSxhPW4oODUpLGM9cihhKSxsPW4oNzcpLGY9e1NIT1c6MCxISURFOjF9LHM9KHU9e30sbyh1LGYuU0hPVyxcImFkZFwiKSxvKHUsZi5ISURFLFwicmVtb3ZlXCIpLHUpO2wuU21vb3RoU2Nyb2xsYmFyLnByb3RvdHlwZS5zaG93VHJhY2s9aShmLlNIT1cpLGwuU21vb3RoU2Nyb2xsYmFyLnByb3RvdHlwZS5oaWRlVHJhY2s9aShmLkhJREUpfSxmdW5jdGlvbih0LGUsbil7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gcigpe2lmKFwiZ2xvd1wiPT09dGhpcy5vcHRpb25zLm92ZXJzY3JvbGxFZmZlY3Qpe3ZhciB0PXRoaXMudGFyZ2V0cyxlPXRoaXMuc2l6ZSxuPXQuY2FudmFzLHI9bi5lbGVtLG89bi5jb250ZXh0LGk9d2luZG93LmRldmljZVBpeGVsUmF0aW98fDEsdT1lLmNvbnRhaW5lci53aWR0aCppLGE9ZS5jb250YWluZXIuaGVpZ2h0Kmk7dT09PXIud2lkdGgmJmE9PT1yLmhlaWdodHx8KHIud2lkdGg9dSxyLmhlaWdodD1hLG8uc2NhbGUoaSxpKSl9fWZ1bmN0aW9uIG8oKXt2YXIgdD10aGlzLnNpemUsZT10aGlzLnRodW1iU2l6ZSxuPXRoaXMudGFyZ2V0cyxyPW4ueEF4aXMsbz1uLnlBeGlzOygwLHUuc2V0U3R5bGUpKHIudHJhY2sse2Rpc3BsYXk6dC5jb250ZW50LndpZHRoPD10LmNvbnRhaW5lci53aWR0aD9cIm5vbmVcIjpcImJsb2NrXCJ9KSwoMCx1LnNldFN0eWxlKShvLnRyYWNrLHtkaXNwbGF5OnQuY29udGVudC5oZWlnaHQ8PXQuY29udGFpbmVyLmhlaWdodD9cIm5vbmVcIjpcImJsb2NrXCJ9KSwoMCx1LnNldFN0eWxlKShyLnRodW1iLHt3aWR0aDplLngrXCJweFwifSksKDAsdS5zZXRTdHlsZSkoby50aHVtYix7aGVpZ2h0OmUueStcInB4XCJ9KX1mdW5jdGlvbiBpKCl7dmFyIHQ9dGhpcy5vcHRpb25zO3RoaXMuX191cGRhdGVCb3VuZGluZygpO3ZhciBlPXRoaXMuZ2V0U2l6ZSgpLG49e3g6TWF0aC5tYXgoZS5jb250ZW50LndpZHRoLWUuY29udGFpbmVyLndpZHRoLDApLHk6TWF0aC5tYXgoZS5jb250ZW50LmhlaWdodC1lLmNvbnRhaW5lci5oZWlnaHQsMCl9LGk9e3JlYWxYOmUuY29udGFpbmVyLndpZHRoL2UuY29udGVudC53aWR0aCplLmNvbnRhaW5lci53aWR0aCxyZWFsWTplLmNvbnRhaW5lci5oZWlnaHQvZS5jb250ZW50LmhlaWdodCplLmNvbnRhaW5lci5oZWlnaHR9O2kueD1NYXRoLm1heChpLnJlYWxYLHQudGh1bWJNaW5TaXplKSxpLnk9TWF0aC5tYXgoaS5yZWFsWSx0LnRodW1iTWluU2l6ZSksdGhpcy5fX3JlYWRvbmx5KFwic2l6ZVwiLGUpLl9fcmVhZG9ubHkoXCJsaW1pdFwiLG4pLl9fcmVhZG9ubHkoXCJ0aHVtYlNpemVcIixpKSxvLmNhbGwodGhpcyksci5jYWxsKHRoaXMpLHRoaXMuc2V0UG9zaXRpb24oKSx0aGlzLl9fc2V0VGh1bWJQb3NpdGlvbigpfXZhciB1PW4oMTE2KSxhPW4oNzcpO2EuU21vb3RoU2Nyb2xsYmFyLnByb3RvdHlwZS51cGRhdGU9ZnVuY3Rpb24odCl7dD9yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoaS5iaW5kKHRoaXMpKTppLmNhbGwodGhpcyl9fSxmdW5jdGlvbih0LGUsbil7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gcih0KXtyZXR1cm4gdCYmdC5fX2VzTW9kdWxlP3Q6e2RlZmF1bHQ6dH19dmFyIG89big4NSksaT1yKG8pLHU9big4OSksYT1yKHUpO09iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pO3ZhciBjPW4oMTUxKTsoMCxhLmRlZmF1bHQpKGMpLmZvckVhY2goZnVuY3Rpb24odCl7XCJkZWZhdWx0XCIhPT10JiZcIl9fZXNNb2R1bGVcIiE9PXQmJigwLGkuZGVmYXVsdCkoZSx0LHtlbnVtZXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe3JldHVybiBjW3RdfX0pfSl9LGZ1bmN0aW9uKHQsZSxuKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiByKHQpe3JldHVybiB0JiZ0Ll9fZXNNb2R1bGU/dDp7ZGVmYXVsdDp0fX12YXIgbz1uKDg1KSxpPXIobyksdT1uKDg5KSxhPXIodSk7T2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSk7dmFyIGM9bigxNTIpOygwLGEuZGVmYXVsdCkoYykuZm9yRWFjaChmdW5jdGlvbih0KXtcImRlZmF1bHRcIiE9PXQmJlwiX19lc01vZHVsZVwiIT09dCYmKDAsaS5kZWZhdWx0KShlLHQse2VudW1lcmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGNbdF19fSl9KTt2YXIgbD1uKDE1Myk7KDAsYS5kZWZhdWx0KShsKS5mb3JFYWNoKGZ1bmN0aW9uKHQpe1wiZGVmYXVsdFwiIT09dCYmXCJfX2VzTW9kdWxlXCIhPT10JiYoMCxpLmRlZmF1bHQpKGUsdCx7ZW51bWVyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gbFt0XX19KX0pO3ZhciBmPW4oMTU0KTsoMCxhLmRlZmF1bHQpKGYpLmZvckVhY2goZnVuY3Rpb24odCl7XCJkZWZhdWx0XCIhPT10JiZcIl9fZXNNb2R1bGVcIiE9PXQmJigwLGkuZGVmYXVsdCkoZSx0LHtlbnVtZXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe3JldHVybiBmW3RdfX0pfSk7dmFyIHM9bigxNTkpOygwLGEuZGVmYXVsdCkocykuZm9yRWFjaChmdW5jdGlvbih0KXtcImRlZmF1bHRcIiE9PXQmJlwiX19lc01vZHVsZVwiIT09dCYmKDAsaS5kZWZhdWx0KShlLHQse2VudW1lcmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHNbdF19fSl9KTt2YXIgZD1uKDE2MCk7KDAsYS5kZWZhdWx0KShkKS5mb3JFYWNoKGZ1bmN0aW9uKHQpe1wiZGVmYXVsdFwiIT09dCYmXCJfX2VzTW9kdWxlXCIhPT10JiYoMCxpLmRlZmF1bHQpKGUsdCx7ZW51bWVyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gZFt0XX19KX0pO3ZhciBoPW4oMTYxKTsoMCxhLmRlZmF1bHQpKGgpLmZvckVhY2goZnVuY3Rpb24odCl7XCJkZWZhdWx0XCIhPT10JiZcIl9fZXNNb2R1bGVcIiE9PXQmJigwLGkuZGVmYXVsdCkoZSx0LHtlbnVtZXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe3JldHVybiBoW3RdfX0pfSk7dmFyIHY9bigxNjIpOygwLGEuZGVmYXVsdCkodikuZm9yRWFjaChmdW5jdGlvbih0KXtcImRlZmF1bHRcIiE9PXQmJlwiX19lc01vZHVsZVwiIT09dCYmKDAsaS5kZWZhdWx0KShlLHQse2VudW1lcmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHZbdF19fSl9KX0sZnVuY3Rpb24odCxlLG4pe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIHIodCl7cmV0dXJuIHQmJnQuX19lc01vZHVsZT90OntkZWZhdWx0OnR9fWZ1bmN0aW9uIG8odCl7aWYoQXJyYXkuaXNBcnJheSh0KSl7Zm9yKHZhciBlPTAsbj1BcnJheSh0Lmxlbmd0aCk7ZTx0Lmxlbmd0aDtlKyspbltlXT10W2VdO3JldHVybiBufXJldHVybigwLGEuZGVmYXVsdCkodCl9ZnVuY3Rpb24gaSgpe3ZhciB0PWFyZ3VtZW50cy5sZW5ndGg+MCYmdm9pZCAwIT09YXJndW1lbnRzWzBdP2FyZ3VtZW50c1swXTowLGU9YXJndW1lbnRzLmxlbmd0aD4xJiZ2b2lkIDAhPT1hcmd1bWVudHNbMV0/YXJndW1lbnRzWzFdOjAsbj1hcmd1bWVudHMubGVuZ3RoPjImJnZvaWQgMCE9PWFyZ3VtZW50c1syXSYmYXJndW1lbnRzWzJdLHI9dGhpcy5saW1pdCxpPXRoaXMub3B0aW9ucyx1PXRoaXMubW92ZW1lbnQ7dGhpcy5fX3VwZGF0ZVRocm90dGxlKCksaS5yZW5kZXJCeVBpeGVscyYmKHQ9TWF0aC5yb3VuZCh0KSxlPU1hdGgucm91bmQoZSkpO3ZhciBhPXUueCt0LGw9dS55K2U7MD09PXIueCYmKGE9MCksMD09PXIueSYmKGw9MCk7dmFyIGY9dGhpcy5fX2dldERlbHRhTGltaXQobik7dS54PWMucGlja0luUmFuZ2UuYXBwbHkodm9pZCAwLFthXS5jb25jYXQobyhmLngpKSksdS55PWMucGlja0luUmFuZ2UuYXBwbHkodm9pZCAwLFtsXS5jb25jYXQobyhmLnkpKSl9dmFyIHU9bigyKSxhPXIodSksYz1uKDExNiksbD1uKDc3KTtPYmplY3QuZGVmaW5lUHJvcGVydHkobC5TbW9vdGhTY3JvbGxiYXIucHJvdG90eXBlLFwiX19hZGRNb3ZlbWVudFwiLHt2YWx1ZTppLHdyaXRhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pfSxmdW5jdGlvbih0LGUsbil7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gcigpe3ZhciB0PXRoaXMsZT10aGlzLm1vdmVtZW50LG49dGhpcy5tb3ZlbWVudExvY2tlZDthLmZvckVhY2goZnVuY3Rpb24ocil7bltyXT1lW3JdJiZ0Ll9fd2lsbE92ZXJzY3JvbGwocixlW3JdKX0pfWZ1bmN0aW9uIG8oKXt2YXIgdD10aGlzLm1vdmVtZW50TG9ja2VkO2EuZm9yRWFjaChmdW5jdGlvbihlKXt0W2VdPSExfSl9ZnVuY3Rpb24gaSgpe3ZhciB0PXRoaXMubW92ZW1lbnRMb2NrZWQ7cmV0dXJuIHQueHx8dC55fXZhciB1PW4oNzcpLGE9W1wieFwiLFwieVwiXTtPYmplY3QuZGVmaW5lUHJvcGVydHkodS5TbW9vdGhTY3JvbGxiYXIucHJvdG90eXBlLFwiX19hdXRvTG9ja01vdmVtZW50XCIse3ZhbHVlOnIsd3JpdGFibGU6ITAsY29uZmlndXJhYmxlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHUuU21vb3RoU2Nyb2xsYmFyLnByb3RvdHlwZSxcIl9fdW5sb2NrTW92ZW1lbnRcIix7dmFsdWU6byx3cml0YWJsZTohMCxjb25maWd1cmFibGU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodS5TbW9vdGhTY3JvbGxiYXIucHJvdG90eXBlLFwiX19pc01vdmVtZW50TG9ja2VkXCIse3ZhbHVlOmksd3JpdGFibGU6ITAsY29uZmlndXJhYmxlOiEwfSl9LGZ1bmN0aW9uKHQsZSxuKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiByKHQpe3JldHVybiB0JiZ0Ll9fZXNNb2R1bGU/dDp7ZGVmYXVsdDp0fX1mdW5jdGlvbiBvKCl7dmFyIHQ9YXJndW1lbnRzLmxlbmd0aD4wJiZ2b2lkIDAhPT1hcmd1bWVudHNbMF0/YXJndW1lbnRzWzBdOlwiXCI7aWYodCl7dmFyIGU9dGhpcy5vcHRpb25zLG49dGhpcy5tb3ZlbWVudCxyPXRoaXMub3ZlcnNjcm9sbFJlbmRlcmVkLG89dGhpcy5NQVhfT1ZFUlNDUk9MTCxpPW5bdF09KDAsaC5waWNrSW5SYW5nZSkoblt0XSwtbyxvKSx1PWUub3ZlcnNjcm9sbERhbXBpbmcsYT1yW3RdKyhpLXJbdF0pKnU7ZS5yZW5kZXJCeVBpeGVscyYmKGF8PTApLCF0aGlzLl9faXNNb3ZlbWVudExvY2tlZCgpJiZNYXRoLmFicyhhLXJbdF0pPC4xJiYoYS09aS9NYXRoLmFicyhpfHwxKSksTWF0aC5hYnMoYSk8TWF0aC5hYnMoclt0XSkmJnRoaXMuX19yZWFkb25seShcIm92ZXJzY3JvbGxCYWNrXCIsITApLChhKnJbdF08MHx8TWF0aC5hYnMoYSk8PTEpJiYoYT0wLHRoaXMuX19yZWFkb25seShcIm92ZXJzY3JvbGxCYWNrXCIsITEpKSxyW3RdPWF9fWZ1bmN0aW9uIGkodCl7dmFyIGU9dGhpcy5fX3RvdWNoUmVjb3JkLG49dGhpcy5vdmVyc2Nyb2xsUmVuZGVyZWQ7cmV0dXJuIG4ueCE9PXQueHx8bi55IT09dC55fHwhKCFkLkdMT0JBTF9FTlYuVE9VQ0hfU1VQUE9SVEVEfHwhZS51cGRhdGVkUmVjZW50bHkoKSl9ZnVuY3Rpb24gdSgpe3ZhciB0PXRoaXMsZT1hcmd1bWVudHMubGVuZ3RoPjAmJnZvaWQgMCE9PWFyZ3VtZW50c1swXT9hcmd1bWVudHNbMF06W107aWYoZS5sZW5ndGgmJnRoaXMub3B0aW9ucy5vdmVyc2Nyb2xsRWZmZWN0KXt2YXIgbj10aGlzLm9wdGlvbnMscj10aGlzLm92ZXJzY3JvbGxSZW5kZXJlZCx1PWwoe30scik7aWYoZS5mb3JFYWNoKGZ1bmN0aW9uKGUpe3JldHVybiBvLmNhbGwodCxlKX0pLGkuY2FsbCh0aGlzLHUpKXN3aXRjaChuLm92ZXJzY3JvbGxFZmZlY3Qpe2Nhc2VcImJvdW5jZVwiOnJldHVybiBzLm92ZXJzY3JvbGxCb3VuY2UuY2FsbCh0aGlzLHIueCxyLnkpO2Nhc2VcImdsb3dcIjpyZXR1cm4gcy5vdmVyc2Nyb2xsR2xvdy5jYWxsKHRoaXMsci54LHIueSk7ZGVmYXVsdDpyZXR1cm59fX12YXIgYT1uKDEyOSksYz1yKGEpLGw9Yy5kZWZhdWx0fHxmdW5jdGlvbih0KXtmb3IodmFyIGU9MTtlPGFyZ3VtZW50cy5sZW5ndGg7ZSsrKXt2YXIgbj1hcmd1bWVudHNbZV07Zm9yKHZhciByIGluIG4pT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG4scikmJih0W3JdPW5bcl0pfXJldHVybiB0fSxmPW4oNzcpLHM9bigxNTUpLGQ9big4OCksaD1uKDExNik7T2JqZWN0LmRlZmluZVByb3BlcnR5KGYuU21vb3RoU2Nyb2xsYmFyLnByb3RvdHlwZSxcIl9fcmVuZGVyT3ZlcnNjcm9sbFwiLHt2YWx1ZTp1LHdyaXRhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pfSxmdW5jdGlvbih0LGUsbil7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gcih0KXtyZXR1cm4gdCYmdC5fX2VzTW9kdWxlP3Q6e2RlZmF1bHQ6dH19dmFyIG89big4NSksaT1yKG8pLHU9big4OSksYT1yKHUpO09iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pO3ZhciBjPW4oMTU2KTsoMCxhLmRlZmF1bHQpKGMpLmZvckVhY2goZnVuY3Rpb24odCl7XCJkZWZhdWx0XCIhPT10JiZcIl9fZXNNb2R1bGVcIiE9PXQmJigwLGkuZGVmYXVsdCkoZSx0LHtlbnVtZXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe3JldHVybiBjW3RdfX0pfSl9LGZ1bmN0aW9uKHQsZSxuKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiByKHQpe3JldHVybiB0JiZ0Ll9fZXNNb2R1bGU/dDp7ZGVmYXVsdDp0fX12YXIgbz1uKDg1KSxpPXIobyksdT1uKDg5KSxhPXIodSk7T2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSk7dmFyIGM9bigxNTcpOygwLGEuZGVmYXVsdCkoYykuZm9yRWFjaChmdW5jdGlvbih0KXtcImRlZmF1bHRcIiE9PXQmJlwiX19lc01vZHVsZVwiIT09dCYmKDAsaS5kZWZhdWx0KShlLHQse2VudW1lcmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGNbdF19fSl9KTt2YXIgbD1uKDE1OCk7KDAsYS5kZWZhdWx0KShsKS5mb3JFYWNoKGZ1bmN0aW9uKHQpe1wiZGVmYXVsdFwiIT09dCYmXCJfX2VzTW9kdWxlXCIhPT10JiYoMCxpLmRlZmF1bHQpKGUsdCx7ZW51bWVyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gbFt0XX19KX0pfSxmdW5jdGlvbih0LGUsbil7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gcih0LGUpe3ZhciBuPXRoaXMuc2l6ZSxyPXRoaXMub2Zmc2V0LGk9dGhpcy50YXJnZXRzLHU9dGhpcy50aHVtYk9mZnNldCxhPWkueEF4aXMsYz1pLnlBeGlzLGw9aS5jb250ZW50O2lmKCgwLG8uc2V0U3R5bGUpKGwse1wiLXRyYW5zZm9ybVwiOlwidHJhbnNsYXRlM2QoXCIrLShyLngrdCkrXCJweCwgXCIrLShyLnkrZSkrXCJweCwgMClcIn0pLHQpe3ZhciBmPW4uY29udGFpbmVyLndpZHRoLyhuLmNvbnRhaW5lci53aWR0aCtNYXRoLmFicyh0KSk7KDAsby5zZXRTdHlsZSkoYS50aHVtYix7XCItdHJhbnNmb3JtXCI6XCJ0cmFuc2xhdGUzZChcIit1LngrXCJweCwgMCwgMCkgc2NhbGUzZChcIitmK1wiLCAxLCAxKVwiLFwiLXRyYW5zZm9ybS1vcmlnaW5cIjp0PDA/XCJsZWZ0XCI6XCJyaWdodFwifSl9aWYoZSl7dmFyIHM9bi5jb250YWluZXIuaGVpZ2h0LyhuLmNvbnRhaW5lci5oZWlnaHQrTWF0aC5hYnMoZSkpOygwLG8uc2V0U3R5bGUpKGMudGh1bWIse1wiLXRyYW5zZm9ybVwiOlwidHJhbnNsYXRlM2QoMCwgXCIrdS55K1wicHgsIDApIHNjYWxlM2QoMSwgXCIrcytcIiwgMSlcIixcIi10cmFuc2Zvcm0tb3JpZ2luXCI6ZTwwP1widG9wXCI6XCJib3R0b21cIn0pfX1PYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSxlLm92ZXJzY3JvbGxCb3VuY2U9cjt2YXIgbz1uKDExNil9LGZ1bmN0aW9uKHQsZSxuKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiByKHQsZSl7dmFyIG49dGhpcy5zaXplLHI9dGhpcy50YXJnZXRzLGE9dGhpcy5vcHRpb25zLGM9ci5jYW52YXMsbD1jLmVsZW0sZj1jLmNvbnRleHQ7cmV0dXJuIHR8fGU/KCgwLHUuc2V0U3R5bGUpKGwse2Rpc3BsYXk6XCJibG9ja1wifSksZi5jbGVhclJlY3QoMCwwLG4uY29udGVudC53aWR0aCxuLmNvbnRhaW5lci5oZWlnaHQpLGYuZmlsbFN0eWxlPWEub3ZlcnNjcm9sbEVmZmVjdENvbG9yLG8uY2FsbCh0aGlzLHQpLHZvaWQgaS5jYWxsKHRoaXMsZSkpOigwLHUuc2V0U3R5bGUpKGwse2Rpc3BsYXk6XCJub25lXCJ9KX1mdW5jdGlvbiBvKHQpe3ZhciBlPXRoaXMuc2l6ZSxuPXRoaXMudGFyZ2V0cyxyPXRoaXMuX190b3VjaFJlY29yZCxvPXRoaXMuTUFYX09WRVJTQ1JPTEwsaT1lLmNvbnRhaW5lcixsPWkud2lkdGgsZj1pLmhlaWdodCxzPW4uY2FudmFzLmNvbnRleHQ7cy5zYXZlKCksdD4wJiZzLnRyYW5zZm9ybSgtMSwwLDAsMSxsLDApO3ZhciBkPSgwLHUucGlja0luUmFuZ2UpKE1hdGguYWJzKHQpL28sMCxhKSxoPSgwLHUucGlja0luUmFuZ2UpKGQsMCxjKSpsLHY9TWF0aC5hYnModCksXz1yLmdldExhc3RQb3NpdGlvbihcInlcIil8fGYvMjtzLmdsb2JhbEFscGhhPWQscy5iZWdpblBhdGgoKSxzLm1vdmVUbygwLC1oKSxzLnF1YWRyYXRpY0N1cnZlVG8odixfLDAsZitoKSxzLmZpbGwoKSxzLmNsb3NlUGF0aCgpLHMucmVzdG9yZSgpfWZ1bmN0aW9uIGkodCl7dmFyIGU9dGhpcy5zaXplLG49dGhpcy50YXJnZXRzLHI9dGhpcy5fX3RvdWNoUmVjb3JkLG89dGhpcy5NQVhfT1ZFUlNDUk9MTCxpPWUuY29udGFpbmVyLGw9aS53aWR0aCxmPWkuaGVpZ2h0LHM9bi5jYW52YXMuY29udGV4dDtzLnNhdmUoKSx0PjAmJnMudHJhbnNmb3JtKDEsMCwwLC0xLDAsZik7dmFyIGQ9KDAsdS5waWNrSW5SYW5nZSkoTWF0aC5hYnModCkvbywwLGEpLGg9KDAsdS5waWNrSW5SYW5nZSkoZCwwLGMpKmwsdj1yLmdldExhc3RQb3NpdGlvbihcInhcIil8fGwvMixfPU1hdGguYWJzKHQpO3MuZ2xvYmFsQWxwaGE9ZCxzLmJlZ2luUGF0aCgpLHMubW92ZVRvKC1oLDApLHMucXVhZHJhdGljQ3VydmVUbyh2LF8sbCtoLDApLHMuZmlsbCgpLHMuY2xvc2VQYXRoKCkscy5yZXN0b3JlKCl9T2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksZS5vdmVyc2Nyb2xsR2xvdz1yO3ZhciB1PW4oMTE2KSxhPS43NSxjPS4yNX0sZnVuY3Rpb24odCxlLG4pe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIHIodCl7dmFyIGU9dGhpcy5vcHRpb25zLG49dGhpcy5vZmZzZXQscj10aGlzLm1vdmVtZW50LG89dGhpcy5fX3RvdWNoUmVjb3JkLGk9ZS5kYW1waW5nLHU9ZS5yZW5kZXJCeVBpeGVscyxhPWUub3ZlcnNjcm9sbERhbXBpbmcsYz1uW3RdLGw9clt0XSxmPWk7aWYodGhpcy5fX3dpbGxPdmVyc2Nyb2xsKHQsbCk/Zj1hOm8uaXNBY3RpdmUoKSYmKGY9LjUpLE1hdGguYWJzKGwpPDEpe3ZhciBzPWMrbDtyZXR1cm57bW92ZW1lbnQ6MCxwb3NpdGlvbjpsPjA/TWF0aC5jZWlsKHMpOk1hdGguZmxvb3Iocyl9fXZhciBkPWwqKDEtZik7cmV0dXJuIHUmJihkfD0wKSx7bW92ZW1lbnQ6ZCxwb3NpdGlvbjpjK2wtZH19ZnVuY3Rpb24gbygpe3ZhciB0PXRoaXMub3B0aW9ucyxlPXRoaXMub2Zmc2V0LG49dGhpcy5saW1pdCxpPXRoaXMubW92ZW1lbnQsYT10aGlzLm92ZXJzY3JvbGxSZW5kZXJlZCxjPXRoaXMuX190aW1lcklEO2lmKGkueHx8aS55fHxhLnh8fGEueSl7dmFyIGw9ci5jYWxsKHRoaXMsXCJ4XCIpLGY9ci5jYWxsKHRoaXMsXCJ5XCIpLHM9W107aWYodC5vdmVyc2Nyb2xsRWZmZWN0KXt2YXIgZD0oMCx1LnBpY2tJblJhbmdlKShsLnBvc2l0aW9uLDAsbi54KSxoPSgwLHUucGlja0luUmFuZ2UpKGYucG9zaXRpb24sMCxuLnkpOyhhLnh8fGQ9PT1lLngmJmkueCkmJnMucHVzaChcInhcIiksKGEueXx8aD09PWUueSYmaS55KSYmcy5wdXNoKFwieVwiKX10aGlzLm1vdmVtZW50TG9ja2VkLnh8fChpLng9bC5tb3ZlbWVudCksdGhpcy5tb3ZlbWVudExvY2tlZC55fHwoaS55PWYubW92ZW1lbnQpLHRoaXMuc2V0UG9zaXRpb24obC5wb3NpdGlvbixmLnBvc2l0aW9uKSx0aGlzLl9fcmVuZGVyT3ZlcnNjcm9sbChzKX1jLnJlbmRlcj1yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoby5iaW5kKHRoaXMpKX12YXIgaT1uKDc3KSx1PW4oMTE2KTtPYmplY3QuZGVmaW5lUHJvcGVydHkoaS5TbW9vdGhTY3JvbGxiYXIucHJvdG90eXBlLFwiX19yZW5kZXJcIix7dmFsdWU6byx3cml0YWJsZTohMCxjb25maWd1cmFibGU6ITB9KX0sZnVuY3Rpb24odCxlLG4pe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIHIodCl7cmV0dXJuIHQmJnQuX19lc01vZHVsZT90OntkZWZhdWx0OnR9fWZ1bmN0aW9uIG8odCl7aWYoQXJyYXkuaXNBcnJheSh0KSl7Zm9yKHZhciBlPTAsbj1BcnJheSh0Lmxlbmd0aCk7ZTx0Lmxlbmd0aDtlKyspbltlXT10W2VdO3JldHVybiBufXJldHVybigwLGEuZGVmYXVsdCkodCl9ZnVuY3Rpb24gaSgpe3ZhciB0PWFyZ3VtZW50cy5sZW5ndGg+MCYmdm9pZCAwIT09YXJndW1lbnRzWzBdP2FyZ3VtZW50c1swXTowLGU9YXJndW1lbnRzLmxlbmd0aD4xJiZ2b2lkIDAhPT1hcmd1bWVudHNbMV0/YXJndW1lbnRzWzFdOjAsbj1hcmd1bWVudHMubGVuZ3RoPjImJnZvaWQgMCE9PWFyZ3VtZW50c1syXSYmYXJndW1lbnRzWzJdLHI9dGhpcy5vcHRpb25zLGk9dGhpcy5tb3ZlbWVudDt0aGlzLl9fdXBkYXRlVGhyb3R0bGUoKTt2YXIgdT10aGlzLl9fZ2V0RGVsdGFMaW1pdChuKTtyLnJlbmRlckJ5UGl4ZWxzJiYodD1NYXRoLnJvdW5kKHQpLGU9TWF0aC5yb3VuZChlKSksaS54PWMucGlja0luUmFuZ2UuYXBwbHkodm9pZCAwLFt0XS5jb25jYXQobyh1LngpKSksaS55PWMucGlja0luUmFuZ2UuYXBwbHkodm9pZCAwLFtlXS5jb25jYXQobyh1LnkpKSl9dmFyIHU9bigyKSxhPXIodSksYz1uKDExNiksbD1uKDc3KTtPYmplY3QuZGVmaW5lUHJvcGVydHkobC5TbW9vdGhTY3JvbGxiYXIucHJvdG90eXBlLFwiX19zZXRNb3ZlbWVudFwiLHt2YWx1ZTppLHdyaXRhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pfSxmdW5jdGlvbih0LGUsbil7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gcigpe3ZhciB0PWFyZ3VtZW50cy5sZW5ndGg+MCYmdm9pZCAwIT09YXJndW1lbnRzWzBdP2FyZ3VtZW50c1swXTowLGU9YXJndW1lbnRzLmxlbmd0aD4xJiZ2b2lkIDAhPT1hcmd1bWVudHNbMV0/YXJndW1lbnRzWzFdOjAsbj10aGlzLm9wdGlvbnMscj10aGlzLm9mZnNldCxvPXRoaXMubGltaXQ7aWYoIW4uY29udGludW91c1Njcm9sbGluZylyZXR1cm4hMTt2YXIgdT0oMCxpLnBpY2tJblJhbmdlKSh0K3IueCwwLG8ueCksYT0oMCxpLnBpY2tJblJhbmdlKShlK3IueSwwLG8ueSksYz0hMDtyZXR1cm4gYyY9dT09PXIueCxjJj1hPT09ci55LGMmPXU9PT1vLnh8fDA9PT11fHxhPT09by55fHwwPT09YX12YXIgbz1uKDc3KSxpPW4oMTE2KTtPYmplY3QuZGVmaW5lUHJvcGVydHkoby5TbW9vdGhTY3JvbGxiYXIucHJvdG90eXBlLFwiX19zaG91bGRQcm9wYWdhdGVNb3ZlbWVudFwiLHt2YWx1ZTpyLHdyaXRhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pfSxmdW5jdGlvbih0LGUsbil7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gcigpe3ZhciB0PWFyZ3VtZW50cy5sZW5ndGg+MCYmdm9pZCAwIT09YXJndW1lbnRzWzBdP2FyZ3VtZW50c1swXTpcIlwiLGU9YXJndW1lbnRzLmxlbmd0aD4xJiZ2b2lkIDAhPT1hcmd1bWVudHNbMV0/YXJndW1lbnRzWzFdOjA7aWYoIXQpcmV0dXJuITE7dmFyIG49dGhpcy5vZmZzZXQscj10aGlzLmxpbWl0LG89blt0XTtyZXR1cm4oMCxpLnBpY2tJblJhbmdlKShlK28sMCxyW3RdKT09PW8mJigwPT09b3x8bz09PXJbdF0pfXZhciBvPW4oNzcpLGk9bigxMTYpO09iamVjdC5kZWZpbmVQcm9wZXJ0eShvLlNtb290aFNjcm9sbGJhci5wcm90b3R5cGUsXCJfX3dpbGxPdmVyc2Nyb2xsXCIse3ZhbHVlOnIsd3JpdGFibGU6ITAsY29uZmlndXJhYmxlOiEwfSl9LGZ1bmN0aW9uKHQsZSxuKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiByKHQpe3JldHVybiB0JiZ0Ll9fZXNNb2R1bGU/dDp7ZGVmYXVsdDp0fX12YXIgbz1uKDg1KSxpPXIobyksdT1uKDg5KSxhPXIodSk7T2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSk7dmFyIGM9bigxNjQpOygwLGEuZGVmYXVsdCkoYykuZm9yRWFjaChmdW5jdGlvbih0KXtcImRlZmF1bHRcIiE9PXQmJlwiX19lc01vZHVsZVwiIT09dCYmKDAsaS5kZWZhdWx0KShlLHQse2VudW1lcmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGNbdF19fSl9KX0sZnVuY3Rpb24odCxlLG4pe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIHIodCl7cmV0dXJuIHQmJnQuX19lc01vZHVsZT90OntkZWZhdWx0OnR9fXZhciBvPW4oODUpLGk9cihvKSx1PW4oODkpLGE9cih1KTtPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KTt2YXIgYz1uKDE2NSk7KDAsYS5kZWZhdWx0KShjKS5mb3JFYWNoKGZ1bmN0aW9uKHQpe1wiZGVmYXVsdFwiIT09dCYmXCJfX2VzTW9kdWxlXCIhPT10JiYoMCxpLmRlZmF1bHQpKGUsdCx7ZW51bWVyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gY1t0XX19KX0pO3ZhciBsPW4oMTY2KTsoMCxhLmRlZmF1bHQpKGwpLmZvckVhY2goZnVuY3Rpb24odCl7XCJkZWZhdWx0XCIhPT10JiZcIl9fZXNNb2R1bGVcIiE9PXQmJigwLGkuZGVmYXVsdCkoZSx0LHtlbnVtZXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe3JldHVybiBsW3RdfX0pfSk7dmFyIGY9bigxNzMpOygwLGEuZGVmYXVsdCkoZikuZm9yRWFjaChmdW5jdGlvbih0KXtcImRlZmF1bHRcIiE9PXQmJlwiX19lc01vZHVsZVwiIT09dCYmKDAsaS5kZWZhdWx0KShlLHQse2VudW1lcmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGZbdF19fSl9KTt2YXIgcz1uKDE3NCk7KDAsYS5kZWZhdWx0KShzKS5mb3JFYWNoKGZ1bmN0aW9uKHQpe1wiZGVmYXVsdFwiIT09dCYmXCJfX2VzTW9kdWxlXCIhPT10JiYoMCxpLmRlZmF1bHQpKGUsdCx7ZW51bWVyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gc1t0XX19KX0pO3ZhciBkPW4oMTc1KTsoMCxhLmRlZmF1bHQpKGQpLmZvckVhY2goZnVuY3Rpb24odCl7XCJkZWZhdWx0XCIhPT10JiZcIl9fZXNNb2R1bGVcIiE9PXQmJigwLGkuZGVmYXVsdCkoZSx0LHtlbnVtZXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe3JldHVybiBkW3RdfX0pfSk7dmFyIGg9bigxNzYpOygwLGEuZGVmYXVsdCkoaCkuZm9yRWFjaChmdW5jdGlvbih0KXtcImRlZmF1bHRcIiE9PXQmJlwiX19lc01vZHVsZVwiIT09dCYmKDAsaS5kZWZhdWx0KShlLHQse2VudW1lcmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGhbdF19fSl9KTt2YXIgdj1uKDE3Nyk7KDAsYS5kZWZhdWx0KSh2KS5mb3JFYWNoKGZ1bmN0aW9uKHQpe1wiZGVmYXVsdFwiIT09dCYmXCJfX2VzTW9kdWxlXCIhPT10JiYoMCxpLmRlZmF1bHQpKGUsdCx7ZW51bWVyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdlt0XX19KX0pfSxmdW5jdGlvbih0LGUsbil7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gcigpe3ZhciB0PXRoaXMsZT10aGlzLnRhcmdldHMsbj1lLmNvbnRhaW5lcixyPWUuY29udGVudCxvPSExLHU9dm9pZCAwLGE9dm9pZCAwO09iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLFwiX19pc0RyYWdcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIG99LGVudW1lcmFibGU6ITF9KTt2YXIgYz1mdW5jdGlvbiBlKG4pe3ZhciByPW4ueCxvPW4ueTtpZihyfHxvKXt2YXIgaT10Lm9wdGlvbnMuc3BlZWQ7dC5fX3NldE1vdmVtZW50KHIqaSxvKmkpLHU9cmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uKCl7ZSh7eDpyLHk6b30pfSl9fTt0aGlzLl9fYWRkRXZlbnQobixcImRyYWdzdGFydFwiLGZ1bmN0aW9uKGUpe3QuX19ldmVudEZyb21DaGlsZFNjcm9sbGJhcihlKXx8KG89ITAsYT1lLnRhcmdldC5jbGllbnRIZWlnaHQsKDAsaS5zZXRTdHlsZSkocix7XCJwb2ludGVyLWV2ZW50c1wiOlwiYXV0b1wifSksY2FuY2VsQW5pbWF0aW9uRnJhbWUodSksdC5fX3VwZGF0ZUJvdW5kaW5nKCkpfSksdGhpcy5fX2FkZEV2ZW50KGRvY3VtZW50LFwiZHJhZ292ZXIgbW91c2Vtb3ZlIHRvdWNobW92ZVwiLGZ1bmN0aW9uKGUpe2lmKG8mJiF0Ll9fZXZlbnRGcm9tQ2hpbGRTY3JvbGxiYXIoZSkpe2NhbmNlbEFuaW1hdGlvbkZyYW1lKHUpLGUucHJldmVudERlZmF1bHQoKTt2YXIgbj10Ll9fZ2V0UG9pbnRlclRyZW5kKGUsYSk7YyhuKX19KSx0aGlzLl9fYWRkRXZlbnQoZG9jdW1lbnQsXCJkcmFnZW5kIG1vdXNldXAgdG91Y2hlbmQgYmx1clwiLGZ1bmN0aW9uKCl7Y2FuY2VsQW5pbWF0aW9uRnJhbWUodSksbz0hMX0pfXZhciBvPW4oNzcpLGk9bigxMTYpO09iamVjdC5kZWZpbmVQcm9wZXJ0eShvLlNtb290aFNjcm9sbGJhci5wcm90b3R5cGUsXCJfX2RyYWdIYW5kbGVyXCIse3ZhbHVlOnIsd3JpdGFibGU6ITAsY29uZmlndXJhYmxlOiEwfSl9LGZ1bmN0aW9uKHQsZSxuKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiByKHQpe3JldHVybiB0JiZ0Ll9fZXNNb2R1bGU/dDp7ZGVmYXVsdDp0fX1mdW5jdGlvbiBvKCl7dmFyIHQ9dGhpcyxlPXRoaXMudGFyZ2V0cyxuPWZ1bmN0aW9uKGUpe3ZhciBuPXQuc2l6ZSxyPXQub2Zmc2V0LG89dC5saW1pdCxpPXQubW92ZW1lbnQsdT17S0VZX0NPREU6c307c3dpdGNoKGUpe2Nhc2UgdS5LRVlfQ09ERS5TUEFDRTpyZXR1cm5bMCwyMDBdO2Nhc2UgdS5LRVlfQ09ERS5QQUdFX1VQOnJldHVyblswLC1uLmNvbnRhaW5lci5oZWlnaHQrNDBdO2Nhc2UgdS5LRVlfQ09ERS5QQUdFX0RPV046cmV0dXJuWzAsbi5jb250YWluZXIuaGVpZ2h0LTQwXTtjYXNlIHUuS0VZX0NPREUuRU5EOnJldHVyblswLE1hdGguYWJzKGkueSkrby55LXIueV07Y2FzZSB1LktFWV9DT0RFLkhPTUU6cmV0dXJuWzAsLU1hdGguYWJzKGkueSktci55XTtjYXNlIHUuS0VZX0NPREUuTEVGVDpyZXR1cm5bLTQwLDBdO2Nhc2UgdS5LRVlfQ09ERS5VUDpyZXR1cm5bMCwtNDBdO2Nhc2UgdS5LRVlfQ09ERS5SSUdIVDpyZXR1cm5bNDAsMF07Y2FzZSB1LktFWV9DT0RFLkRPV046cmV0dXJuWzAsNDBdO2RlZmF1bHQ6cmV0dXJuIG51bGx9fSxyPWUuY29udGFpbmVyO3RoaXMuX19hZGRFdmVudChyLFwia2V5ZG93blwiLGZ1bmN0aW9uKGUpe2lmKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQ9PT1yKXt2YXIgbz10Lm9wdGlvbnMsaT10LnBhcmVudHMsdT10Lm1vdmVtZW50TG9ja2VkLGE9bihlLmtleUNvZGV8fGUud2hpY2gpO2lmKGEpe3ZhciBjPWwoYSwyKSxmPWNbMF0scz1jWzFdO2lmKHQuX19zaG91bGRQcm9wYWdhdGVNb3ZlbWVudChmLHMpKXJldHVybiByLmJsdXIoKSxpLmxlbmd0aCYmaVswXS5mb2N1cygpLHQuX191cGRhdGVUaHJvdHRsZSgpO2UucHJldmVudERlZmF1bHQoKSx0Ll9fdW5sb2NrTW92ZW1lbnQoKSxmJiZ0Ll9fd2lsbE92ZXJzY3JvbGwoXCJ4XCIsZikmJih1Lng9ITApLHMmJnQuX193aWxsT3ZlcnNjcm9sbChcInlcIixzKSYmKHUueT0hMCk7dmFyIGQ9by5zcGVlZDt0Ll9fYWRkTW92ZW1lbnQoZipkLHMqZCl9fX0pLHRoaXMuX19hZGRFdmVudChyLFwia2V5dXBcIixmdW5jdGlvbigpe3QuX191bmxvY2tNb3ZlbWVudCgpfSl9dmFyIGk9bigxNjcpLHU9cihpKSxhPW4oMTcwKSxjPXIoYSksbD1mdW5jdGlvbigpe2Z1bmN0aW9uIHQodCxlKXt2YXIgbj1bXSxyPSEwLG89ITEsaT12b2lkIDA7dHJ5e2Zvcih2YXIgdSxhPSgwLGMuZGVmYXVsdCkodCk7IShyPSh1PWEubmV4dCgpKS5kb25lKSYmKG4ucHVzaCh1LnZhbHVlKSxcbiFlfHxuLmxlbmd0aCE9PWUpO3I9ITApO31jYXRjaCh0KXtvPSEwLGk9dH1maW5hbGx5e3RyeXshciYmYS5yZXR1cm4mJmEucmV0dXJuKCl9ZmluYWxseXtpZihvKXRocm93IGl9fXJldHVybiBufXJldHVybiBmdW5jdGlvbihlLG4pe2lmKEFycmF5LmlzQXJyYXkoZSkpcmV0dXJuIGU7aWYoKDAsdS5kZWZhdWx0KShPYmplY3QoZSkpKXJldHVybiB0KGUsbik7dGhyb3cgbmV3IFR5cGVFcnJvcihcIkludmFsaWQgYXR0ZW1wdCB0byBkZXN0cnVjdHVyZSBub24taXRlcmFibGUgaW5zdGFuY2VcIil9fSgpLGY9big3Nykscz17U1BBQ0U6MzIsUEFHRV9VUDozMyxQQUdFX0RPV046MzQsRU5EOjM1LEhPTUU6MzYsTEVGVDozNyxVUDozOCxSSUdIVDozOSxET1dOOjQwfTtPYmplY3QuZGVmaW5lUHJvcGVydHkoZi5TbW9vdGhTY3JvbGxiYXIucHJvdG90eXBlLFwiX19rZXlib2FyZEhhbmRsZXJcIix7dmFsdWU6byx3cml0YWJsZTohMCxjb25maWd1cmFibGU6ITB9KX0sZnVuY3Rpb24odCxlLG4pe3QuZXhwb3J0cz17ZGVmYXVsdDpuKDE2OCksX19lc01vZHVsZTohMH19LGZ1bmN0aW9uKHQsZSxuKXtuKDU3KSxuKDQpLHQuZXhwb3J0cz1uKDE2OSl9LGZ1bmN0aW9uKHQsZSxuKXt2YXIgcj1uKDUzKSxvPW4oNDUpKFwiaXRlcmF0b3JcIiksaT1uKDI3KTt0LmV4cG9ydHM9bigxMikuaXNJdGVyYWJsZT1mdW5jdGlvbih0KXt2YXIgZT1PYmplY3QodCk7cmV0dXJuIHZvaWQgMCE9PWVbb118fFwiQEBpdGVyYXRvclwiaW4gZXx8aS5oYXNPd25Qcm9wZXJ0eShyKGUpKX19LGZ1bmN0aW9uKHQsZSxuKXt0LmV4cG9ydHM9e2RlZmF1bHQ6bigxNzEpLF9fZXNNb2R1bGU6ITB9fSxmdW5jdGlvbih0LGUsbil7big1Nyksbig0KSx0LmV4cG9ydHM9bigxNzIpfSxmdW5jdGlvbih0LGUsbil7dmFyIHI9bigxNyksbz1uKDUyKTt0LmV4cG9ydHM9bigxMikuZ2V0SXRlcmF0b3I9ZnVuY3Rpb24odCl7dmFyIGU9byh0KTtpZihcImZ1bmN0aW9uXCIhPXR5cGVvZiBlKXRocm93IFR5cGVFcnJvcih0K1wiIGlzIG5vdCBpdGVyYWJsZSFcIik7cmV0dXJuIHIoZS5jYWxsKHQpKX19LGZ1bmN0aW9uKHQsZSxuKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiByKCl7dmFyIHQ9dGhpcyxlPXRoaXMudGFyZ2V0cyxuPWUuY29udGFpbmVyLHI9ZS54QXhpcyxvPWUueUF4aXMsdT1mdW5jdGlvbihlLG4pe3ZhciByPXQuc2l6ZSxvPXQudGh1bWJTaXplO2lmKFwieFwiPT09ZSl7dmFyIGk9ci5jb250YWluZXIud2lkdGgtKG8ueC1vLnJlYWxYKTtyZXR1cm4gbi9pKnIuY29udGVudC53aWR0aH1pZihcInlcIj09PWUpe3ZhciB1PXIuY29udGFpbmVyLmhlaWdodC0oby55LW8ucmVhbFkpO3JldHVybiBuL3Uqci5jb250ZW50LmhlaWdodH1yZXR1cm4gMH0sYT1mdW5jdGlvbih0KXtyZXR1cm4oMCxpLmlzT25lT2YpKHQsW3IudHJhY2ssci50aHVtYl0pP1wieFwiOigwLGkuaXNPbmVPZikodCxbby50cmFjayxvLnRodW1iXSk/XCJ5XCI6dm9pZCAwfSxjPXZvaWQgMCxsPXZvaWQgMCxmPXZvaWQgMCxzPXZvaWQgMCxkPXZvaWQgMDt0aGlzLl9fYWRkRXZlbnQobixcImNsaWNrXCIsZnVuY3Rpb24oZSl7aWYoIWwmJigwLGkuaXNPbmVPZikoZS50YXJnZXQsW3IudHJhY2ssby50cmFja10pKXt2YXIgbj1lLnRhcmdldCxjPWEobiksZj1uLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLHM9KDAsaS5nZXRQb3NpdGlvbikoZSksZD10Lm9mZnNldCxoPXQudGh1bWJTaXplO2lmKFwieFwiPT09Yyl7dmFyIHY9cy54LWYubGVmdC1oLngvMjt0Ll9fc2V0TW92ZW1lbnQodShjLHYpLWQueCwwKX1lbHNle3ZhciBfPXMueS1mLnRvcC1oLnkvMjt0Ll9fc2V0TW92ZW1lbnQoMCx1KGMsXyktZC55KX19fSksdGhpcy5fX2FkZEV2ZW50KG4sXCJtb3VzZWRvd25cIixmdW5jdGlvbihlKXtpZigoMCxpLmlzT25lT2YpKGUudGFyZ2V0LFtyLnRodW1iLG8udGh1bWJdKSl7Yz0hMDt2YXIgbj0oMCxpLmdldFBvc2l0aW9uKShlKSx1PWUudGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO3M9YShlLnRhcmdldCksZj17eDpuLngtdS5sZWZ0LHk6bi55LXUudG9wfSxkPXQudGFyZ2V0cy5jb250YWluZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCl9fSksdGhpcy5fX2FkZEV2ZW50KHdpbmRvdyxcIm1vdXNlbW92ZVwiLGZ1bmN0aW9uKGUpe2lmKGMpe2UucHJldmVudERlZmF1bHQoKSxsPSEwO3ZhciBuPXQub2Zmc2V0LHI9KDAsaS5nZXRQb3NpdGlvbikoZSk7aWYoXCJ4XCI9PT1zKXt2YXIgbz1yLngtZi54LWQubGVmdDt0LnNldFBvc2l0aW9uKHUocyxvKSxuLnkpfWlmKFwieVwiPT09cyl7dmFyIGE9ci55LWYueS1kLnRvcDt0LnNldFBvc2l0aW9uKG4ueCx1KHMsYSkpfX19KSx0aGlzLl9fYWRkRXZlbnQod2luZG93LFwibW91c2V1cCBibHVyXCIsZnVuY3Rpb24oKXtjPWw9ITF9KX12YXIgbz1uKDc3KSxpPW4oMTE2KTtPYmplY3QuZGVmaW5lUHJvcGVydHkoby5TbW9vdGhTY3JvbGxiYXIucHJvdG90eXBlLFwiX19tb3VzZUhhbmRsZXJcIix7dmFsdWU6cix3cml0YWJsZTohMCxjb25maWd1cmFibGU6ITB9KX0sZnVuY3Rpb24odCxlLG4pe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIHIoKXt0aGlzLl9fYWRkRXZlbnQod2luZG93LFwicmVzaXplXCIsdGhpcy5fX3VwZGF0ZVRocm90dGxlKX12YXIgbz1uKDc3KTtPYmplY3QuZGVmaW5lUHJvcGVydHkoby5TbW9vdGhTY3JvbGxiYXIucHJvdG90eXBlLFwiX19yZXNpemVIYW5kbGVyXCIse3ZhbHVlOnIsd3JpdGFibGU6ITAsY29uZmlndXJhYmxlOiEwfSl9LGZ1bmN0aW9uKHQsZSxuKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiByKCl7dmFyIHQ9dGhpcyxlPSExLG49dm9pZCAwLHI9dGhpcy50YXJnZXRzLG89ci5jb250YWluZXIsdT1yLmNvbnRlbnQsYT1mdW5jdGlvbiBlKHIpe3ZhciBvPXIueCxpPXIueTtpZihvfHxpKXt2YXIgdT10Lm9wdGlvbnMuc3BlZWQ7dC5fX3NldE1vdmVtZW50KG8qdSxpKnUpLG49cmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uKCl7ZSh7eDpvLHk6aX0pfSl9fSxjPWZ1bmN0aW9uKCl7dmFyIHQ9YXJndW1lbnRzLmxlbmd0aD4wJiZ2b2lkIDAhPT1hcmd1bWVudHNbMF0/YXJndW1lbnRzWzBdOlwiXCI7KDAsaS5zZXRTdHlsZSkobyx7XCItdXNlci1zZWxlY3RcIjp0fSl9O3RoaXMuX19hZGRFdmVudCh3aW5kb3csXCJtb3VzZW1vdmVcIixmdW5jdGlvbihyKXtpZihlKXtjYW5jZWxBbmltYXRpb25GcmFtZShuKTt2YXIgbz10Ll9fZ2V0UG9pbnRlclRyZW5kKHIpO2Eobyl9fSksdGhpcy5fX2FkZEV2ZW50KHUsXCJzZWxlY3RzdGFydFwiLGZ1bmN0aW9uKHIpe3JldHVybiB0Ll9fZXZlbnRGcm9tQ2hpbGRTY3JvbGxiYXIocik/YyhcIm5vbmVcIik6KGNhbmNlbEFuaW1hdGlvbkZyYW1lKG4pLHQuX191cGRhdGVCb3VuZGluZygpLHZvaWQoZT0hMCkpfSksdGhpcy5fX2FkZEV2ZW50KHdpbmRvdyxcIm1vdXNldXAgYmx1clwiLGZ1bmN0aW9uKCl7Y2FuY2VsQW5pbWF0aW9uRnJhbWUobiksYygpLGU9ITF9KSx0aGlzLl9fYWRkRXZlbnQobyxcInNjcm9sbFwiLGZ1bmN0aW9uKHQpe3QucHJldmVudERlZmF1bHQoKSxvLnNjcm9sbFRvcD1vLnNjcm9sbExlZnQ9MH0pfXZhciBvPW4oNzcpLGk9bigxMTYpO09iamVjdC5kZWZpbmVQcm9wZXJ0eShvLlNtb290aFNjcm9sbGJhci5wcm90b3R5cGUsXCJfX3NlbGVjdEhhbmRsZXJcIix7dmFsdWU6cix3cml0YWJsZTohMCxjb25maWd1cmFibGU6ITB9KX0sZnVuY3Rpb24odCxlLG4pe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIHIodCl7cmV0dXJuIHQmJnQuX19lc01vZHVsZT90OntkZWZhdWx0OnR9fWZ1bmN0aW9uIG8oKXt2YXIgdD10aGlzLGU9dGhpcy50YXJnZXRzLG49dGhpcy5fX3RvdWNoUmVjb3JkLHI9ZS5jb250YWluZXI7dGhpcy5fX2FkZEV2ZW50KHIsXCJ0b3VjaHN0YXJ0XCIsZnVuY3Rpb24oZSl7aWYoIXQuX19pc0RyYWcpe3ZhciByPXQuX190aW1lcklELG89dC5tb3ZlbWVudDtjYW5jZWxBbmltYXRpb25GcmFtZShyLnNjcm9sbFRvKSx0Ll9fd2lsbE92ZXJzY3JvbGwoXCJ4XCIpfHwoby54PTApLHQuX193aWxsT3ZlcnNjcm9sbChcInlcIil8fChvLnk9MCksbi50cmFjayhlKSx0Ll9fYXV0b0xvY2tNb3ZlbWVudCgpfX0pLHRoaXMuX19hZGRFdmVudChyLFwidG91Y2htb3ZlXCIsZnVuY3Rpb24oZSl7aWYoISh0Ll9faXNEcmFnfHxzJiZzIT09dCkpe24udXBkYXRlKGUpO3ZhciByPW4uZ2V0RGVsdGEoKSxvPXIueCxpPXIueTtpZih0Ll9fc2hvdWxkUHJvcGFnYXRlTW92ZW1lbnQobyxpKSlyZXR1cm4gdC5fX3VwZGF0ZVRocm90dGxlKCk7dmFyIHU9dC5tb3ZlbWVudCxhPXQuTUFYX09WRVJTQ1JPTEwsYz10Lm9wdGlvbnM7aWYodS54JiZ0Ll9fd2lsbE92ZXJzY3JvbGwoXCJ4XCIsbykpe3ZhciBsPTI7XCJib3VuY2VcIj09PWMub3ZlcnNjcm9sbEVmZmVjdCYmKGwrPU1hdGguYWJzKDEwKnUueC9hKSksTWF0aC5hYnModS54KT49YT9vPTA6by89bH1pZih1LnkmJnQuX193aWxsT3ZlcnNjcm9sbChcInlcIixpKSl7dmFyIGY9MjtcImJvdW5jZVwiPT09Yy5vdmVyc2Nyb2xsRWZmZWN0JiYoZis9TWF0aC5hYnMoMTAqdS55L2EpKSxNYXRoLmFicyh1LnkpPj1hP2k9MDppLz1mfXQuX19hdXRvTG9ja01vdmVtZW50KCksZS5wcmV2ZW50RGVmYXVsdCgpLHQuX19hZGRNb3ZlbWVudChvLGksITApLHM9dH19KSx0aGlzLl9fYWRkRXZlbnQocixcInRvdWNoY2FuY2VsIHRvdWNoZW5kXCIsZnVuY3Rpb24oZSl7aWYoIXQuX19pc0RyYWcpe3ZhciByPXQub3B0aW9ucy5zcGVlZCxvPW4uZ2V0VmVsb2NpdHkoKSxpPXt9OygwLHUuZGVmYXVsdCkobykuZm9yRWFjaChmdW5jdGlvbih0KXt2YXIgZT0oMCxsLnBpY2tJblJhbmdlKShvW3RdKmMuR0xPQkFMX0VOVi5FQVNJTkdfTVVMVElQTElFUiwtMWUzLDFlMyk7aVt0XT1NYXRoLmFicyhlKT5mP2UqcjowfSksdC5fX2FkZE1vdmVtZW50KGkueCxpLnksITApLHQuX191bmxvY2tNb3ZlbWVudCgpLG4ucmVsZWFzZShlKSxzPW51bGx9fSl9dmFyIGk9big4OSksdT1yKGkpLGE9big3NyksYz1uKDg4KSxsPW4oMTE2KSxmPTEwMCxzPW51bGw7T2JqZWN0LmRlZmluZVByb3BlcnR5KGEuU21vb3RoU2Nyb2xsYmFyLnByb3RvdHlwZSxcIl9fdG91Y2hIYW5kbGVyXCIse3ZhbHVlOm8sd3JpdGFibGU6ITAsY29uZmlndXJhYmxlOiEwfSl9LGZ1bmN0aW9uKHQsZSxuKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiByKCl7dmFyIHQ9dGhpcyxlPXRoaXMudGFyZ2V0cy5jb250YWluZXIsbj0hMSxyPSgwLGkuZGVib3VuY2UpKGZ1bmN0aW9uKCl7bj0hMX0sMzAsITEpO3RoaXMuX19hZGRFdmVudChlLHUuR0xPQkFMX0VOVi5XSEVFTF9FVkVOVCxmdW5jdGlvbihlKXt2YXIgbz10Lm9wdGlvbnMsdT10LndoZWVsUmV2ZXJzZWQsYT0oMCxpLmdldERlbHRhKShlKSxjPWEueCxsPWEueTtyZXR1cm4gYyo9by5zcGVlZCxsKj1vLnNwZWVkLHQuX19zaG91bGRQcm9wYWdhdGVNb3ZlbWVudChjLGwpP3QuX191cGRhdGVUaHJvdHRsZSgpOihlLnByZXZlbnREZWZhdWx0KCkscigpLHQub3ZlcnNjcm9sbEJhY2smJihuPSEwKSxuJiYodC5fX3dpbGxPdmVyc2Nyb2xsKFwieFwiLGMpJiYoYz0wKSx0Ll9fd2lsbE92ZXJzY3JvbGwoXCJ5XCIsbCkmJihsPTApKSx2b2lkKHU/dC5fX2FkZE1vdmVtZW50KGwsYywhMCk6dC5fX2FkZE1vdmVtZW50KGMsbCwhMCkpKX0pfXZhciBvPW4oNzcpLGk9bigxMTYpLHU9big4OCk7T2JqZWN0LmRlZmluZVByb3BlcnR5KG8uU21vb3RoU2Nyb2xsYmFyLnByb3RvdHlwZSxcIl9fd2hlZWxIYW5kbGVyXCIse3ZhbHVlOnIsd3JpdGFibGU6ITAsY29uZmlndXJhYmxlOiEwfSl9LGZ1bmN0aW9uKHQsZSxuKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiByKHQpe3JldHVybiB0JiZ0Ll9fZXNNb2R1bGU/dDp7ZGVmYXVsdDp0fX12YXIgbz1uKDg1KSxpPXIobyksdT1uKDg5KSxhPXIodSk7T2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSk7dmFyIGM9bigxNzkpOygwLGEuZGVmYXVsdCkoYykuZm9yRWFjaChmdW5jdGlvbih0KXtcImRlZmF1bHRcIiE9PXQmJlwiX19lc01vZHVsZVwiIT09dCYmKDAsaS5kZWZhdWx0KShlLHQse2VudW1lcmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGNbdF19fSl9KX0sZnVuY3Rpb24odCxlLG4pe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIHIodCl7cmV0dXJuIHQmJnQuX19lc01vZHVsZT90OntkZWZhdWx0OnR9fXZhciBvPW4oODUpLGk9cihvKSx1PW4oODkpLGE9cih1KTtPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KTt2YXIgYz1uKDE4MCk7KDAsYS5kZWZhdWx0KShjKS5mb3JFYWNoKGZ1bmN0aW9uKHQpe1wiZGVmYXVsdFwiIT09dCYmXCJfX2VzTW9kdWxlXCIhPT10JiYoMCxpLmRlZmF1bHQpKGUsdCx7ZW51bWVyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gY1t0XX19KX0pO3ZhciBsPW4oMTgxKTsoMCxhLmRlZmF1bHQpKGwpLmZvckVhY2goZnVuY3Rpb24odCl7XCJkZWZhdWx0XCIhPT10JiZcIl9fZXNNb2R1bGVcIiE9PXQmJigwLGkuZGVmYXVsdCkoZSx0LHtlbnVtZXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe3JldHVybiBsW3RdfX0pfSk7dmFyIGY9bigxODIpOygwLGEuZGVmYXVsdCkoZikuZm9yRWFjaChmdW5jdGlvbih0KXtcImRlZmF1bHRcIiE9PXQmJlwiX19lc01vZHVsZVwiIT09dCYmKDAsaS5kZWZhdWx0KShlLHQse2VudW1lcmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGZbdF19fSl9KTt2YXIgcz1uKDE4Myk7KDAsYS5kZWZhdWx0KShzKS5mb3JFYWNoKGZ1bmN0aW9uKHQpe1wiZGVmYXVsdFwiIT09dCYmXCJfX2VzTW9kdWxlXCIhPT10JiYoMCxpLmRlZmF1bHQpKGUsdCx7ZW51bWVyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gc1t0XX19KX0pO3ZhciBkPW4oMTg0KTsoMCxhLmRlZmF1bHQpKGQpLmZvckVhY2goZnVuY3Rpb24odCl7XCJkZWZhdWx0XCIhPT10JiZcIl9fZXNNb2R1bGVcIiE9PXQmJigwLGkuZGVmYXVsdCkoZSx0LHtlbnVtZXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe3JldHVybiBkW3RdfX0pfSk7dmFyIGg9bigxODcpOygwLGEuZGVmYXVsdCkoaCkuZm9yRWFjaChmdW5jdGlvbih0KXtcImRlZmF1bHRcIiE9PXQmJlwiX19lc01vZHVsZVwiIT09dCYmKDAsaS5kZWZhdWx0KShlLHQse2VudW1lcmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGhbdF19fSl9KTt2YXIgdj1uKDE4OCk7KDAsYS5kZWZhdWx0KSh2KS5mb3JFYWNoKGZ1bmN0aW9uKHQpe1wiZGVmYXVsdFwiIT09dCYmXCJfX2VzTW9kdWxlXCIhPT10JiYoMCxpLmRlZmF1bHQpKGUsdCx7ZW51bWVyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdlt0XX19KX0pO3ZhciBfPW4oMTg5KTsoMCxhLmRlZmF1bHQpKF8pLmZvckVhY2goZnVuY3Rpb24odCl7XCJkZWZhdWx0XCIhPT10JiZcIl9fZXNNb2R1bGVcIiE9PXQmJigwLGkuZGVmYXVsdCkoZSx0LHtlbnVtZXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe3JldHVybiBfW3RdfX0pfSk7dmFyIHA9bigxOTApOygwLGEuZGVmYXVsdCkocCkuZm9yRWFjaChmdW5jdGlvbih0KXtcImRlZmF1bHRcIiE9PXQmJlwiX19lc01vZHVsZVwiIT09dCYmKDAsaS5kZWZhdWx0KShlLHQse2VudW1lcmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHBbdF19fSl9KTt2YXIgeT1uKDE5MSk7KDAsYS5kZWZhdWx0KSh5KS5mb3JFYWNoKGZ1bmN0aW9uKHQpe1wiZGVmYXVsdFwiIT09dCYmXCJfX2VzTW9kdWxlXCIhPT10JiYoMCxpLmRlZmF1bHQpKGUsdCx7ZW51bWVyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4geVt0XX19KX0pO3ZhciBiPW4oMTkyKTsoMCxhLmRlZmF1bHQpKGIpLmZvckVhY2goZnVuY3Rpb24odCl7XCJkZWZhdWx0XCIhPT10JiZcIl9fZXNNb2R1bGVcIiE9PXQmJigwLGkuZGVmYXVsdCkoZSx0LHtlbnVtZXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe3JldHVybiBiW3RdfX0pfSl9LGZ1bmN0aW9uKHQsZSxuKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiByKHQsZSxuKXt2YXIgcj10aGlzO2lmKCF0fHxcImZ1bmN0aW9uXCIhPXR5cGVvZiB0LmFkZEV2ZW50TGlzdGVuZXIpdGhyb3cgbmV3IFR5cGVFcnJvcihcImV4cGVjdCBlbGVtIHRvIGJlIGEgRE9NIGVsZW1lbnQsIGJ1dCBnb3QgXCIrdCk7dmFyIG89ZnVuY3Rpb24odCl7Zm9yKHZhciBlPWFyZ3VtZW50cy5sZW5ndGgscj1BcnJheShlPjE/ZS0xOjApLG89MTtvPGU7bysrKXJbby0xXT1hcmd1bWVudHNbb107IXQudHlwZS5tYXRjaCgvZHJhZy8pJiZ0LmRlZmF1bHRQcmV2ZW50ZWR8fG4uYXBwbHkodm9pZCAwLFt0XS5jb25jYXQocikpfTtlLnNwbGl0KC9cXHMrL2cpLmZvckVhY2goZnVuY3Rpb24oZSl7ci5fX2hhbmRsZXJzLnB1c2goe2V2dDplLGVsZW06dCxmbjpvLGhhc1JlZ2lzdGVyZWQ6ITB9KSx0LmFkZEV2ZW50TGlzdGVuZXIoZSxvKX0pfXZhciBvPW4oNzcpO09iamVjdC5kZWZpbmVQcm9wZXJ0eShvLlNtb290aFNjcm9sbGJhci5wcm90b3R5cGUsXCJfX2FkZEV2ZW50XCIse3ZhbHVlOnIsd3JpdGFibGU6ITAsY29uZmlndXJhYmxlOiEwfSl9LGZ1bmN0aW9uKHQsZSxuKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiByKCl7dmFyIHQ9YXJndW1lbnRzLmxlbmd0aD4wJiZ2b2lkIDAhPT1hcmd1bWVudHNbMF0/YXJndW1lbnRzWzBdOnt9LGU9dC50YXJnZXQ7cmV0dXJuIHRoaXMuY2hpbGRyZW4uc29tZShmdW5jdGlvbih0KXtyZXR1cm4gdC5jb250YWlucyhlKX0pfXZhciBvPW4oNzcpO09iamVjdC5kZWZpbmVQcm9wZXJ0eShvLlNtb290aFNjcm9sbGJhci5wcm90b3R5cGUsXCJfX2V2ZW50RnJvbUNoaWxkU2Nyb2xsYmFyXCIse3ZhbHVlOnIsd3JpdGFibGU6ITAsY29uZmlndXJhYmxlOiEwfSl9LGZ1bmN0aW9uKHQsZSxuKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiByKCl7dmFyIHQ9YXJndW1lbnRzLmxlbmd0aD4wJiZ2b2lkIDAhPT1hcmd1bWVudHNbMF0mJmFyZ3VtZW50c1swXSxlPXRoaXMub3B0aW9ucyxuPXRoaXMub2Zmc2V0LHI9dGhpcy5saW1pdDtyZXR1cm4gdCYmKGUuY29udGludW91c1Njcm9sbGluZ3x8ZS5vdmVyc2Nyb2xsRWZmZWN0KT97eDpbLSgxLzApLDEvMF0seTpbLSgxLzApLDEvMF19Ont4Olstbi54LHIueC1uLnhdLHk6Wy1uLnksci55LW4ueV19fXZhciBvPW4oNzcpO09iamVjdC5kZWZpbmVQcm9wZXJ0eShvLlNtb290aFNjcm9sbGJhci5wcm90b3R5cGUsXCJfX2dldERlbHRhTGltaXRcIix7dmFsdWU6cix3cml0YWJsZTohMCxjb25maWd1cmFibGU6ITB9KX0sZnVuY3Rpb24odCxlLG4pe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIHIodCl7dmFyIGU9YXJndW1lbnRzLmxlbmd0aD4xJiZ2b2lkIDAhPT1hcmd1bWVudHNbMV0/YXJndW1lbnRzWzFdOjAsbj10aGlzLmJvdW5kaW5nLHI9bi50b3Asbz1uLnJpZ2h0LHU9bi5ib3R0b20sYT1uLmxlZnQsYz0oMCxpLmdldFBvc2l0aW9uKSh0KSxsPWMueCxmPWMueSxzPXt4OjAseTowfTtyZXR1cm4gMD09PWwmJjA9PT1mP3M6KGw+by1lP3MueD1sLW8rZTpsPGErZSYmKHMueD1sLWEtZSksZj51LWU/cy55PWYtdStlOmY8citlJiYocy55PWYtci1lKSxzKX12YXIgbz1uKDc3KSxpPW4oMTE2KTtPYmplY3QuZGVmaW5lUHJvcGVydHkoby5TbW9vdGhTY3JvbGxiYXIucHJvdG90eXBlLFwiX19nZXRQb2ludGVyVHJlbmRcIix7dmFsdWU6cix3cml0YWJsZTohMCxjb25maWd1cmFibGU6ITB9KX0sZnVuY3Rpb24odCxlLG4pe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIHIodCl7cmV0dXJuIHQmJnQuX19lc01vZHVsZT90OntkZWZhdWx0OnR9fWZ1bmN0aW9uIG8odCl7aWYoQXJyYXkuaXNBcnJheSh0KSl7Zm9yKHZhciBlPTAsbj1BcnJheSh0Lmxlbmd0aCk7ZTx0Lmxlbmd0aDtlKyspbltlXT10W2VdO3JldHVybiBufXJldHVybigwLGguZGVmYXVsdCkodCl9ZnVuY3Rpb24gaSh0KXt2YXIgZT10aGlzLG49e3NwZWVkOjEsZGFtcGluZzouMSx0aHVtYk1pblNpemU6MjAsc3luY0NhbGxiYWNrczohMSxyZW5kZXJCeVBpeGVsczohMCxhbHdheXNTaG93VHJhY2tzOiExLGNvbnRpbnVvdXNTY3JvbGxpbmc6XCJhdXRvXCIsb3ZlcnNjcm9sbEVmZmVjdDohMSxvdmVyc2Nyb2xsRWZmZWN0Q29sb3I6XCIjODdjZWViXCIsb3ZlcnNjcm9sbERhbXBpbmc6LjJ9LHI9e2RhbXBpbmc6WzAsMV0sc3BlZWQ6WzAsMS8wXSx0aHVtYk1pblNpemU6WzAsMS8wXSxvdmVyc2Nyb2xsRWZmZWN0OlshMSxcImJvdW5jZVwiLFwiZ2xvd1wiXSxvdmVyc2Nyb2xsRGFtcGluZzpbMCwxXX0saT1mdW5jdGlvbigpe3ZhciB0PWFyZ3VtZW50cy5sZW5ndGg+MCYmdm9pZCAwIT09YXJndW1lbnRzWzBdP2FyZ3VtZW50c1swXTpcImF1dG9cIjtpZihuLm92ZXJzY3JvbGxFZmZlY3QhPT0hMSlyZXR1cm4hMTtzd2l0Y2godCl7Y2FzZVwiYXV0b1wiOnJldHVybiBlLmlzTmVzdGVkU2Nyb2xsYmFyO2RlZmF1bHQ6cmV0dXJuISF0fX0sdT17c2V0IGlnbm9yZUV2ZW50cyh0KXtjb25zb2xlLndhcm4oXCJgb3B0aW9ucy5pZ25vcmVFdmVudHNgIHBhcmFtZXRlciBpcyBkZXByZWNhdGVkLCB1c2UgYGluc3RhbmNlI3VucmVnaXN0ZXJFdmVudHMoKWAgbWV0aG9kIGluc3RlYWQuIGh0dHBzOi8vZ2l0aHViLmNvbS9pZGlvdFd1L3Ntb290aC1zY3JvbGxiYXIvd2lraS9JbnN0YW5jZS1NZXRob2RzI2luc3RhbmNldW5yZWdpc3RlcmV2ZW50cy1yZWdleC0tcmVnZXgtcmVnZXgtLVwiKX0sc2V0IGZyaWN0aW9uKHQpe2NvbnNvbGUud2FybihcImBvcHRpb25zLmZyaWN0aW9uPVwiK3QrXCJgIGlzIGRlcHJlY2F0ZWQsIHVzZSBgb3B0aW9ucy5kYW1waW5nPVwiK3QvMTAwK1wiYCBpbnN0ZWFkLlwiKSx0aGlzLmRhbXBpbmc9dC8xMDB9LGdldCBzeW5jQ2FsbGJhY2tzKCl7cmV0dXJuIG4uc3luY0NhbGxiYWNrc30sc2V0IHN5bmNDYWxsYmFja3ModCl7bi5zeW5jQ2FsbGJhY2tzPSEhdH0sZ2V0IHJlbmRlckJ5UGl4ZWxzKCl7cmV0dXJuIG4ucmVuZGVyQnlQaXhlbHN9LHNldCByZW5kZXJCeVBpeGVscyh0KXtuLnJlbmRlckJ5UGl4ZWxzPSEhdH0sZ2V0IGFsd2F5c1Nob3dUcmFja3MoKXtyZXR1cm4gbi5hbHdheXNTaG93VHJhY2tzfSxzZXQgYWx3YXlzU2hvd1RyYWNrcyh0KXt0PSEhdCxuLmFsd2F5c1Nob3dUcmFja3M9dDt2YXIgcj1lLnRhcmdldHMuY29udGFpbmVyO3Q/KGUuc2hvd1RyYWNrKCksci5jbGFzc0xpc3QuYWRkKFwic3RpY2t5XCIpKTooZS5oaWRlVHJhY2soKSxyLmNsYXNzTGlzdC5yZW1vdmUoXCJzdGlja3lcIikpfSxnZXQgY29udGludW91c1Njcm9sbGluZygpe3JldHVybiBpKG4uY29udGludW91c1Njcm9sbGluZyl9LHNldCBjb250aW51b3VzU2Nyb2xsaW5nKHQpe1wiYXV0b1wiPT09dD9uLmNvbnRpbnVvdXNTY3JvbGxpbmc9dDpuLmNvbnRpbnVvdXNTY3JvbGxpbmc9ISF0fSxnZXQgb3ZlcnNjcm9sbEVmZmVjdCgpe3JldHVybiBuLm92ZXJzY3JvbGxFZmZlY3R9LHNldCBvdmVyc2Nyb2xsRWZmZWN0KHQpe3QmJiF+ci5vdmVyc2Nyb2xsRWZmZWN0LmluZGV4T2YodCkmJihjb25zb2xlLndhcm4oXCJgb3ZlcnNjcm9sbEVmZmVjdGAgc2hvdWxkIGJlIG9uZSBvZiBcIisoMCxzLmRlZmF1bHQpKHIub3ZlcnNjcm9sbEVmZmVjdCkrXCIsIGJ1dCBnb3QgXCIrKDAscy5kZWZhdWx0KSh0KStcIi4gSXQgd2lsbCBiZSBzZXQgdG8gYGZhbHNlYCBub3cuXCIpLHQ9ITEpLG4ub3ZlcnNjcm9sbEVmZmVjdD10fSxnZXQgb3ZlcnNjcm9sbEVmZmVjdENvbG9yKCl7cmV0dXJuIG4ub3ZlcnNjcm9sbEVmZmVjdENvbG9yfSxzZXQgb3ZlcnNjcm9sbEVmZmVjdENvbG9yKHQpe24ub3ZlcnNjcm9sbEVmZmVjdENvbG9yPXR9fTsoMCxsLmRlZmF1bHQpKG4pLmZpbHRlcihmdW5jdGlvbih0KXtyZXR1cm4hdS5oYXNPd25Qcm9wZXJ0eSh0KX0pLmZvckVhY2goZnVuY3Rpb24odCl7KDAsYS5kZWZhdWx0KSh1LHQse2VudW1lcmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIG5bdF19LHNldDpmdW5jdGlvbihlKXtpZihpc05hTihwYXJzZUZsb2F0KGUpKSl0aHJvdyBuZXcgVHlwZUVycm9yKFwiZXhwZWN0IGBvcHRpb25zLlwiK3QrXCJgIHRvIGJlIGEgbnVtYmVyLCBidXQgZ290IFwiKyhcInVuZGVmaW5lZFwiPT10eXBlb2YgZT9cInVuZGVmaW5lZFwiOmIoZSkpKTtuW3RdPWcucGlja0luUmFuZ2UuYXBwbHkodm9pZCAwLFtlXS5jb25jYXQobyhyW3RdKSkpfX0pfSksdGhpcy5fX3JlYWRvbmx5KFwib3B0aW9uc1wiLHUpLHRoaXMuc2V0T3B0aW9ucyh0KX12YXIgdT1uKDg1KSxhPXIodSksYz1uKDg5KSxsPXIoYyksZj1uKDE4NSkscz1yKGYpLGQ9bigyKSxoPXIoZCksdj1uKDU1KSxfPXIodikscD1uKDYyKSx5PXIocCksYj1cImZ1bmN0aW9uXCI9PXR5cGVvZiB5LmRlZmF1bHQmJlwic3ltYm9sXCI9PXR5cGVvZiBfLmRlZmF1bHQ/ZnVuY3Rpb24odCl7cmV0dXJuIHR5cGVvZiB0fTpmdW5jdGlvbih0KXtyZXR1cm4gdCYmXCJmdW5jdGlvblwiPT10eXBlb2YgeS5kZWZhdWx0JiZ0LmNvbnN0cnVjdG9yPT09eS5kZWZhdWx0JiZ0IT09eS5kZWZhdWx0LnByb3RvdHlwZT9cInN5bWJvbFwiOnR5cGVvZiB0fSxnPW4oMTE2KSxtPW4oNzcpO09iamVjdC5kZWZpbmVQcm9wZXJ0eShtLlNtb290aFNjcm9sbGJhci5wcm90b3R5cGUsXCJfX2luaXRPcHRpb25zXCIse3ZhbHVlOmksd3JpdGFibGU6ITAsY29uZmlndXJhYmxlOiEwfSl9LGZ1bmN0aW9uKHQsZSxuKXt0LmV4cG9ydHM9e2RlZmF1bHQ6bigxODYpLF9fZXNNb2R1bGU6ITB9fSxmdW5jdGlvbih0LGUsbil7dmFyIHI9bigxMiksbz1yLkpTT058fChyLkpTT049e3N0cmluZ2lmeTpKU09OLnN0cmluZ2lmeX0pO3QuZXhwb3J0cz1mdW5jdGlvbih0KXtyZXR1cm4gby5zdHJpbmdpZnkuYXBwbHkobyxhcmd1bWVudHMpfX0sZnVuY3Rpb24odCxlLG4pe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIHIoKXt2YXIgdD1hcmd1bWVudHMubGVuZ3RoPjAmJnZvaWQgMCE9PWFyZ3VtZW50c1swXSYmYXJndW1lbnRzWzBdO3RoaXMucmV2ZXJzZVdoZWVsKHQpfXZhciBvPW4oNzcpO09iamVjdC5kZWZpbmVQcm9wZXJ0eShvLlNtb290aFNjcm9sbGJhci5wcm90b3R5cGUsXCJfX2luaXRSZXZlcnNlV2hlZWxcIix7dmFsdWU6cix3cml0YWJsZTohMCxjb25maWd1cmFibGU6ITB9KX0sZnVuY3Rpb24odCxlLG4pe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIHIoKXt0aGlzLnVwZGF0ZSgpLHRoaXMuX19rZXlib2FyZEhhbmRsZXIoKSx0aGlzLl9fcmVzaXplSGFuZGxlcigpLHRoaXMuX19zZWxlY3RIYW5kbGVyKCksdGhpcy5fX21vdXNlSGFuZGxlcigpLHRoaXMuX190b3VjaEhhbmRsZXIoKSx0aGlzLl9fd2hlZWxIYW5kbGVyKCksdGhpcy5fX2RyYWdIYW5kbGVyKCksdGhpcy5fX3JlbmRlcigpfXZhciBvPW4oNzcpO09iamVjdC5kZWZpbmVQcm9wZXJ0eShvLlNtb290aFNjcm9sbGJhci5wcm90b3R5cGUsXCJfX2luaXRTY3JvbGxiYXJcIix7dmFsdWU6cix3cml0YWJsZTohMCxjb25maWd1cmFibGU6ITB9KX0sZnVuY3Rpb24odCxlLG4pe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIHIodCl7cmV0dXJuIHQmJnQuX19lc01vZHVsZT90OntkZWZhdWx0OnR9fWZ1bmN0aW9uIG8odCxlKXtyZXR1cm4oMCx1LmRlZmF1bHQpKHRoaXMsdCx7dmFsdWU6ZSxlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pfXZhciBpPW4oODUpLHU9cihpKSxhPW4oNzcpO09iamVjdC5kZWZpbmVQcm9wZXJ0eShhLlNtb290aFNjcm9sbGJhci5wcm90b3R5cGUsXCJfX3JlYWRvbmx5XCIse3ZhbHVlOm8sd3JpdGFibGU6ITAsY29uZmlndXJhYmxlOiEwfSl9LGZ1bmN0aW9uKHQsZSxuKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiByKCl7dmFyIHQ9dGhpcy50YXJnZXRzLGU9dGhpcy5zaXplLG49dGhpcy5vZmZzZXQscj10aGlzLnRodW1iT2Zmc2V0LGk9dGhpcy50aHVtYlNpemU7ci54PW4ueC9lLmNvbnRlbnQud2lkdGgqKGUuY29udGFpbmVyLndpZHRoLShpLngtaS5yZWFsWCkpLHIueT1uLnkvZS5jb250ZW50LmhlaWdodCooZS5jb250YWluZXIuaGVpZ2h0LShpLnktaS5yZWFsWSkpLCgwLG8uc2V0U3R5bGUpKHQueEF4aXMudGh1bWIse1wiLXRyYW5zZm9ybVwiOlwidHJhbnNsYXRlM2QoXCIrci54K1wicHgsIDAsIDApXCJ9KSwoMCxvLnNldFN0eWxlKSh0LnlBeGlzLnRodW1iLHtcIi10cmFuc2Zvcm1cIjpcInRyYW5zbGF0ZTNkKDAsIFwiK3IueStcInB4LCAwKVwifSl9dmFyIG89bigxMTYpLGk9big3Nyk7T2JqZWN0LmRlZmluZVByb3BlcnR5KGkuU21vb3RoU2Nyb2xsYmFyLnByb3RvdHlwZSxcIl9fc2V0VGh1bWJQb3NpdGlvblwiLHt2YWx1ZTpyLHdyaXRhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pfSxmdW5jdGlvbih0LGUsbil7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gcigpe3ZhciB0PXRoaXMudGFyZ2V0cy5jb250YWluZXIsZT10LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLG49ZS50b3Ascj1lLnJpZ2h0LG89ZS5ib3R0b20saT1lLmxlZnQsdT13aW5kb3csYT11LmlubmVySGVpZ2h0LGM9dS5pbm5lcldpZHRoO3RoaXMuX19yZWFkb25seShcImJvdW5kaW5nXCIse3RvcDpNYXRoLm1heChuLDApLHJpZ2h0Ok1hdGgubWluKHIsYyksYm90dG9tOk1hdGgubWluKG8sYSksbGVmdDpNYXRoLm1heChpLDApfSl9dmFyIG89big3Nyk7T2JqZWN0LmRlZmluZVByb3BlcnR5KG8uU21vb3RoU2Nyb2xsYmFyLnByb3RvdHlwZSxcIl9fdXBkYXRlQm91bmRpbmdcIix7dmFsdWU6cix3cml0YWJsZTohMCxjb25maWd1cmFibGU6ITB9KX0sZnVuY3Rpb24odCxlLG4pe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIHIodCl7cmV0dXJuIHQmJnQuX19lc01vZHVsZT90OntkZWZhdWx0OnR9fWZ1bmN0aW9uIG8odCl7aWYoQXJyYXkuaXNBcnJheSh0KSl7Zm9yKHZhciBlPTAsbj1BcnJheSh0Lmxlbmd0aCk7ZTx0Lmxlbmd0aDtlKyspbltlXT10W2VdO3JldHVybiBufXJldHVybigwLGEuZGVmYXVsdCkodCl9ZnVuY3Rpb24gaSgpe3ZhciB0PXRoaXMudGFyZ2V0cyxlPXQuY29udGFpbmVyLG49dC5jb250ZW50O3RoaXMuX19yZWFkb25seShcImNoaWxkcmVuXCIsW10uY29uY2F0KG8obi5xdWVyeVNlbGVjdG9yQWxsKGwuc2VsZWN0b3JzKSkpKSx0aGlzLl9fcmVhZG9ubHkoXCJpc05lc3RlZFNjcm9sbGJhclwiLCExKTtmb3IodmFyIHI9W10saT1lO2k9aS5wYXJlbnRFbGVtZW50OylsLnNiTGlzdC5oYXMoaSkmJih0aGlzLl9fcmVhZG9ubHkoXCJpc05lc3RlZFNjcm9sbGJhclwiLCEwKSxyLnB1c2goaSkpO3RoaXMuX19yZWFkb25seShcInBhcmVudHNcIixyKX12YXIgdT1uKDIpLGE9cih1KSxjPW4oNzcpLGw9big4OCk7T2JqZWN0LmRlZmluZVByb3BlcnR5KGMuU21vb3RoU2Nyb2xsYmFyLnByb3RvdHlwZSxcIl9fdXBkYXRlVHJlZVwiLHt2YWx1ZTppLHdyaXRhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pfSxmdW5jdGlvbih0LGUpe31dKX0pOyIsIiFmdW5jdGlvbihyb290LCBmYWN0b3J5KSB7XG4gICAgXCJmdW5jdGlvblwiID09IHR5cGVvZiBkZWZpbmUgJiYgZGVmaW5lLmFtZCA/IC8vIEFNRC4gUmVnaXN0ZXIgYXMgYW4gYW5vbnltb3VzIG1vZHVsZSB1bmxlc3MgYW1kTW9kdWxlSWQgaXMgc2V0XG4gICAgZGVmaW5lKFtdLCBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHJvb3Quc3ZnNGV2ZXJ5Ym9keSA9IGZhY3RvcnkoKTtcbiAgICB9KSA6IFwib2JqZWN0XCIgPT0gdHlwZW9mIG1vZHVsZSAmJiBtb2R1bGUuZXhwb3J0cyA/IC8vIE5vZGUuIERvZXMgbm90IHdvcmsgd2l0aCBzdHJpY3QgQ29tbW9uSlMsIGJ1dFxuICAgIC8vIG9ubHkgQ29tbW9uSlMtbGlrZSBlbnZpcm9ubWVudHMgdGhhdCBzdXBwb3J0IG1vZHVsZS5leHBvcnRzLFxuICAgIC8vIGxpa2UgTm9kZS5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKSA6IHJvb3Quc3ZnNGV2ZXJ5Ym9keSA9IGZhY3RvcnkoKTtcbn0odGhpcywgZnVuY3Rpb24oKSB7XG4gICAgLyohIHN2ZzRldmVyeWJvZHkgdjIuMS45IHwgZ2l0aHViLmNvbS9qb25hdGhhbnRuZWFsL3N2ZzRldmVyeWJvZHkgKi9cbiAgICBmdW5jdGlvbiBlbWJlZChwYXJlbnQsIHN2ZywgdGFyZ2V0KSB7XG4gICAgICAgIC8vIGlmIHRoZSB0YXJnZXQgZXhpc3RzXG4gICAgICAgIGlmICh0YXJnZXQpIHtcbiAgICAgICAgICAgIC8vIGNyZWF0ZSBhIGRvY3VtZW50IGZyYWdtZW50IHRvIGhvbGQgdGhlIGNvbnRlbnRzIG9mIHRoZSB0YXJnZXRcbiAgICAgICAgICAgIHZhciBmcmFnbWVudCA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKSwgdmlld0JveCA9ICFzdmcuaGFzQXR0cmlidXRlKFwidmlld0JveFwiKSAmJiB0YXJnZXQuZ2V0QXR0cmlidXRlKFwidmlld0JveFwiKTtcbiAgICAgICAgICAgIC8vIGNvbmRpdGlvbmFsbHkgc2V0IHRoZSB2aWV3Qm94IG9uIHRoZSBzdmdcbiAgICAgICAgICAgIHZpZXdCb3ggJiYgc3ZnLnNldEF0dHJpYnV0ZShcInZpZXdCb3hcIiwgdmlld0JveCk7XG4gICAgICAgICAgICAvLyBjb3B5IHRoZSBjb250ZW50cyBvZiB0aGUgY2xvbmUgaW50byB0aGUgZnJhZ21lbnRcbiAgICAgICAgICAgIGZvciAoLy8gY2xvbmUgdGhlIHRhcmdldFxuICAgICAgICAgICAgdmFyIGNsb25lID0gdGFyZ2V0LmNsb25lTm9kZSghMCk7IGNsb25lLmNoaWxkTm9kZXMubGVuZ3RoOyApIHtcbiAgICAgICAgICAgICAgICBmcmFnbWVudC5hcHBlbmRDaGlsZChjbG9uZS5maXJzdENoaWxkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGFwcGVuZCB0aGUgZnJhZ21lbnQgaW50byB0aGUgc3ZnXG4gICAgICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQoZnJhZ21lbnQpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIGxvYWRyZWFkeXN0YXRlY2hhbmdlKHhocikge1xuICAgICAgICAvLyBsaXN0ZW4gdG8gY2hhbmdlcyBpbiB0aGUgcmVxdWVzdFxuICAgICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAvLyBpZiB0aGUgcmVxdWVzdCBpcyByZWFkeVxuICAgICAgICAgICAgaWYgKDQgPT09IHhoci5yZWFkeVN0YXRlKSB7XG4gICAgICAgICAgICAgICAgLy8gZ2V0IHRoZSBjYWNoZWQgaHRtbCBkb2N1bWVudFxuICAgICAgICAgICAgICAgIHZhciBjYWNoZWREb2N1bWVudCA9IHhoci5fY2FjaGVkRG9jdW1lbnQ7XG4gICAgICAgICAgICAgICAgLy8gZW5zdXJlIHRoZSBjYWNoZWQgaHRtbCBkb2N1bWVudCBiYXNlZCBvbiB0aGUgeGhyIHJlc3BvbnNlXG4gICAgICAgICAgICAgICAgY2FjaGVkRG9jdW1lbnQgfHwgKGNhY2hlZERvY3VtZW50ID0geGhyLl9jYWNoZWREb2N1bWVudCA9IGRvY3VtZW50LmltcGxlbWVudGF0aW9uLmNyZWF0ZUhUTUxEb2N1bWVudChcIlwiKSwgXG4gICAgICAgICAgICAgICAgY2FjaGVkRG9jdW1lbnQuYm9keS5pbm5lckhUTUwgPSB4aHIucmVzcG9uc2VUZXh0LCB4aHIuX2NhY2hlZFRhcmdldCA9IHt9KSwgLy8gY2xlYXIgdGhlIHhociBlbWJlZHMgbGlzdCBhbmQgZW1iZWQgZWFjaCBpdGVtXG4gICAgICAgICAgICAgICAgeGhyLl9lbWJlZHMuc3BsaWNlKDApLm1hcChmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGdldCB0aGUgY2FjaGVkIHRhcmdldFxuICAgICAgICAgICAgICAgICAgICB2YXIgdGFyZ2V0ID0geGhyLl9jYWNoZWRUYXJnZXRbaXRlbS5pZF07XG4gICAgICAgICAgICAgICAgICAgIC8vIGVuc3VyZSB0aGUgY2FjaGVkIHRhcmdldFxuICAgICAgICAgICAgICAgICAgICB0YXJnZXQgfHwgKHRhcmdldCA9IHhoci5fY2FjaGVkVGFyZ2V0W2l0ZW0uaWRdID0gY2FjaGVkRG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaXRlbS5pZCkpLCBcbiAgICAgICAgICAgICAgICAgICAgLy8gZW1iZWQgdGhlIHRhcmdldCBpbnRvIHRoZSBzdmdcbiAgICAgICAgICAgICAgICAgICAgZW1iZWQoaXRlbS5wYXJlbnQsIGl0ZW0uc3ZnLCB0YXJnZXQpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCAvLyB0ZXN0IHRoZSByZWFkeSBzdGF0ZSBjaGFuZ2UgaW1tZWRpYXRlbHlcbiAgICAgICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSgpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBzdmc0ZXZlcnlib2R5KHJhd29wdHMpIHtcbiAgICAgICAgZnVuY3Rpb24gb25pbnRlcnZhbCgpIHtcbiAgICAgICAgICAgIC8vIHdoaWxlIHRoZSBpbmRleCBleGlzdHMgaW4gdGhlIGxpdmUgPHVzZT4gY29sbGVjdGlvblxuICAgICAgICAgICAgZm9yICgvLyBnZXQgdGhlIGNhY2hlZCA8dXNlPiBpbmRleFxuICAgICAgICAgICAgdmFyIGluZGV4ID0gMDsgaW5kZXggPCB1c2VzLmxlbmd0aDsgKSB7XG4gICAgICAgICAgICAgICAgLy8gZ2V0IHRoZSBjdXJyZW50IDx1c2U+XG4gICAgICAgICAgICAgICAgdmFyIHVzZSA9IHVzZXNbaW5kZXhdLCBwYXJlbnQgPSB1c2UucGFyZW50Tm9kZSwgc3ZnID0gZ2V0U1ZHQW5jZXN0b3IocGFyZW50KSwgc3JjID0gdXNlLmdldEF0dHJpYnV0ZShcInhsaW5rOmhyZWZcIikgfHwgdXNlLmdldEF0dHJpYnV0ZShcImhyZWZcIik7XG4gICAgICAgICAgICAgICAgaWYgKCFzcmMgJiYgb3B0cy5hdHRyaWJ1dGVOYW1lICYmIChzcmMgPSB1c2UuZ2V0QXR0cmlidXRlKG9wdHMuYXR0cmlidXRlTmFtZSkpLCBcbiAgICAgICAgICAgICAgICBzdmcgJiYgc3JjKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwb2x5ZmlsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFvcHRzLnZhbGlkYXRlIHx8IG9wdHMudmFsaWRhdGUoc3JjLCBzdmcsIHVzZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyByZW1vdmUgdGhlIDx1c2U+IGVsZW1lbnRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnQucmVtb3ZlQ2hpbGQodXNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBwYXJzZSB0aGUgc3JjIGFuZCBnZXQgdGhlIHVybCBhbmQgaWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgc3JjU3BsaXQgPSBzcmMuc3BsaXQoXCIjXCIpLCB1cmwgPSBzcmNTcGxpdC5zaGlmdCgpLCBpZCA9IHNyY1NwbGl0LmpvaW4oXCIjXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIHRoZSBsaW5rIGlzIGV4dGVybmFsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHVybC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZ2V0IHRoZSBjYWNoZWQgeGhyIHJlcXVlc3RcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHhociA9IHJlcXVlc3RzW3VybF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGVuc3VyZSB0aGUgeGhyIHJlcXVlc3QgZXhpc3RzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHhociB8fCAoeGhyID0gcmVxdWVzdHNbdXJsXSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpLCB4aHIub3BlbihcIkdFVFwiLCB1cmwpLCB4aHIuc2VuZCgpLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeGhyLl9lbWJlZHMgPSBbXSksIC8vIGFkZCB0aGUgc3ZnIGFuZCBpZCBhcyBhbiBpdGVtIHRvIHRoZSB4aHIgZW1iZWRzIGxpc3RcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeGhyLl9lbWJlZHMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnQ6IHBhcmVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN2Zzogc3ZnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IGlkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLCAvLyBwcmVwYXJlIHRoZSB4aHIgcmVhZHkgc3RhdGUgY2hhbmdlIGV2ZW50XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvYWRyZWFkeXN0YXRlY2hhbmdlKHhocik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZW1iZWQgdGhlIGxvY2FsIGlkIGludG8gdGhlIHN2Z1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbWJlZChwYXJlbnQsIHN2ZywgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGluY3JlYXNlIHRoZSBpbmRleCB3aGVuIHRoZSBwcmV2aW91cyB2YWx1ZSB3YXMgbm90IFwidmFsaWRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICsraW5kZXgsICsrbnVtYmVyT2ZTdmdVc2VFbGVtZW50c1RvQnlwYXNzO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gaW5jcmVhc2UgdGhlIGluZGV4IHdoZW4gdGhlIHByZXZpb3VzIHZhbHVlIHdhcyBub3QgXCJ2YWxpZFwiXG4gICAgICAgICAgICAgICAgICAgICsraW5kZXg7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gY29udGludWUgdGhlIGludGVydmFsXG4gICAgICAgICAgICAoIXVzZXMubGVuZ3RoIHx8IHVzZXMubGVuZ3RoIC0gbnVtYmVyT2ZTdmdVc2VFbGVtZW50c1RvQnlwYXNzID4gMCkgJiYgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKG9uaW50ZXJ2YWwsIDY3KTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcG9seWZpbGwsIG9wdHMgPSBPYmplY3QocmF3b3B0cyksIG5ld2VySUVVQSA9IC9cXGJUcmlkZW50XFwvWzU2N11cXGJ8XFxiTVNJRSAoPzo5fDEwKVxcLjBcXGIvLCB3ZWJraXRVQSA9IC9cXGJBcHBsZVdlYktpdFxcLyhcXGQrKVxcYi8sIG9sZGVyRWRnZVVBID0gL1xcYkVkZ2VcXC8xMlxcLihcXGQrKVxcYi8sIGVkZ2VVQSA9IC9cXGJFZGdlXFwvLihcXGQrKVxcYi8sIGluSWZyYW1lID0gd2luZG93LnRvcCAhPT0gd2luZG93LnNlbGY7XG4gICAgICAgIHBvbHlmaWxsID0gXCJwb2x5ZmlsbFwiIGluIG9wdHMgPyBvcHRzLnBvbHlmaWxsIDogbmV3ZXJJRVVBLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkgfHwgKG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2gob2xkZXJFZGdlVUEpIHx8IFtdKVsxXSA8IDEwNTQ3IHx8IChuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKHdlYmtpdFVBKSB8fCBbXSlbMV0gPCA1MzcgfHwgZWRnZVVBLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkgJiYgaW5JZnJhbWU7XG4gICAgICAgIC8vIGNyZWF0ZSB4aHIgcmVxdWVzdHMgb2JqZWN0XG4gICAgICAgIHZhciByZXF1ZXN0cyA9IHt9LCByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8IHNldFRpbWVvdXQsIHVzZXMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInVzZVwiKSwgbnVtYmVyT2ZTdmdVc2VFbGVtZW50c1RvQnlwYXNzID0gMDtcbiAgICAgICAgLy8gY29uZGl0aW9uYWxseSBzdGFydCB0aGUgaW50ZXJ2YWwgaWYgdGhlIHBvbHlmaWxsIGlzIGFjdGl2ZVxuICAgICAgICBwb2x5ZmlsbCAmJiBvbmludGVydmFsKCk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGdldFNWR0FuY2VzdG9yKG5vZGUpIHtcbiAgICAgICAgZm9yICh2YXIgc3ZnID0gbm9kZTsgXCJzdmdcIiAhPT0gc3ZnLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgJiYgKHN2ZyA9IHN2Zy5wYXJlbnROb2RlKTsgKSB7fVxuICAgICAgICByZXR1cm4gc3ZnO1xuICAgIH1cbiAgICByZXR1cm4gc3ZnNGV2ZXJ5Ym9keTtcbn0pOyJdfQ==
