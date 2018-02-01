(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EVENT = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* jshint esnext: true */


// Basic modules


var _environment = require('./utils/environment');

var _globals = require('./globals');

var _globals2 = _interopRequireDefault(_globals);

var _array = require('./utils/array');

var _html = require('./utils/html');

var _is = require('./utils/is');

var _modules = require('./modules');

var modules = _interopRequireWildcard(_modules);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MODULE_NAME = 'App';
var EVENT_NAMESPACE = _environment.APP_NAME + '.' + MODULE_NAME;

var EVENT = exports.EVENT = {
    INIT_MODULES: 'initModules.' + EVENT_NAMESPACE,
    INIT_SCOPED_MODULES: 'initScopedModules.' + EVENT_NAMESPACE,
    DELETE_SCOPED_MODULES: 'deleteScopedModules.' + EVENT_NAMESPACE
};

var App = function () {
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
        key: 'deleteModules',
        value: function deleteModules(event) {
            var destroyAll = true;
            var moduleIds = [];

            // Check for scope first
            if (event.$scope instanceof jQuery && event.$scope.length > 0) {
                // Modules within scope
                var $modules = event.$scope.find('[data-module]');

                // Determine their uids
                moduleIds = $.makeArray($modules.map(function (index) {
                    return $modules.eq(index).data('uid');
                }));

                if (moduleIds.length > 0) {
                    destroyAll = false;
                } else {
                    return this;
                }
            }

            // Loop modules and destroying all of them, or specific ones
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
        key: 'initGlobals',
        value: function initGlobals(firstBlood) {
            (0, _globals2.default)(firstBlood);
            return this;
        }

        /**
         * Find modules and initialize them
         * @param  {Object} event The event being triggered.
         * @return {Object}       Self (allows chaining)
         */

    }, {
        key: 'initModules',
        value: function initModules(event) {
            // Elements with module
            var $moduleEls = [];

            // If first blood, load all modules in the DOM
            // If scoped, render elements with modules
            // If Barba, load modules contained in Barba container
            if (event.firstBlood) {
                $moduleEls = _environment.$document.find('[data-module]');
            } else if (event.$scope instanceof jQuery && event.$scope.length > 0) {
                $moduleEls = event.$scope.find('[data-module]');
            } else if (event.isPjax) {
                $moduleEls = _environment.$pjaxWrapper.find('[data-module]');
            }

            // Loop through elements
            var i = 0;
            var elsLen = $moduleEls.length;

            for (; i < elsLen; i++) {

                // Current element
                var el = $moduleEls[i];

                // All data- attributes considered as options
                var options = (0, _html.getNodeData)(el);

                // Add current DOM element and jQuery element
                options.el = el;
                options.$el = $moduleEls.eq(i);

                // Module does exist at this point
                var attr = options.module;

                // Splitting modules found in the data-attribute
                var moduleIdents = attr.split(/[,\s]+/g);

                // Loop modules
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
}();

// IIFE for loading the application
// ==========================================================================


(function () {
    new App();
    _environment.$document.triggerHandler({
        type: EVENT.INIT_MODULES,
        firstBlood: true
    });
})();

},{"./globals":2,"./modules":3,"./utils/array":11,"./utils/environment":13,"./utils/html":14,"./utils/is":15}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (firstBlood) {
    svg4everybody();

    if (firstBlood) {
        var transitionManager = new _TransitionManager2.default();
    }
};

var _TransitionManager = require('./transitions/TransitionManager');

var _TransitionManager2 = _interopRequireDefault(_TransitionManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./transitions/TransitionManager":8}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Example = require('./modules/Example');

Object.defineProperty(exports, 'Example', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Example).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./modules/Example":5}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* jshint esnext: true */
var uid = 0;

/**
 * Abstract Module
 */

var _class = function () {
    function _class(options) {
        _classCallCheck(this, _class);

        this.$el = options.$el || null;
        this.el = options.el || null;

        // Generate a unique module identifier
        this.uid = 'm-' + uid++;
        // Use jQuery's data API to "store it in the DOM"
        this.$el.data('uid', this.uid);
    }

    _createClass(_class, [{
        key: 'init',
        value: function init() {}
    }, {
        key: 'destroy',
        value: function destroy() {
            if (this.$el) {
                this.$el.removeData('uid');
            }
        }
    }]);

    return _class;
}();

exports.default = _class;

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _environment = require('../utils/environment');

var _AbstractModule2 = require('./AbstractModule');

var _AbstractModule3 = _interopRequireDefault(_AbstractModule2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* jshint esnext: true */


var MODULE_NAME = 'Example';
var EVENT_NAMESPACE = _environment.APP_NAME + '.' + MODULE_NAME;

var EVENT = {
    CLICK: 'click.' + EVENT_NAMESPACE
};

var _class = function (_AbstractModule) {
    _inherits(_class, _AbstractModule);

    function _class(options) {
        _classCallCheck(this, _class);

        // Declaration of properties
        var _this = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, options));

        console.log('🔨 [module]:constructor - Example');

        return _this;
    }

    _createClass(_class, [{
        key: 'init',
        value: function init() {
            // Set events and such

        }
    }, {
        key: 'destroy',
        value: function destroy() {
            console.log('❌ [module]:destroy - Example');
            _get(_class.prototype.__proto__ || Object.getPrototypeOf(_class.prototype), 'destroy', this).call(this);
            this.$el.off('.' + EVENT_NAMESPACE);
        }
    }]);

    return _class;
}(_AbstractModule3.default);

exports.default = _class;

},{"../utils/environment":13,"./AbstractModule":4}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _environment = require('../utils/environment');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {
    function _class(options) {
        _classCallCheck(this, _class);

        this.options = options;
        this.wrapper = options.wrapper;
        this.overrideClass = options.overrideClass ? options.overrideClass : '';
    }

    _createClass(_class, [{
        key: 'launch',
        value: function launch() {
            console.log("---- Launch transition 👊 -----");

            _environment.$html.removeClass('dom-is-loaded dom-is-animated').addClass('dom-is-loading ' + this.overrideClass);
        }
    }, {
        key: 'hideView',
        value: function hideView(view) {
            console.log('----- ❌ [VIEW]:remove - ', view.getAttribute('data-template'));
            view.remove();
        }
    }, {
        key: 'displayView',
        value: function displayView(view) {
            var _this = this;

            setTimeout(function () {

                console.log('----- ✅ [VIEW]:display :', view.getAttribute('data-template'));
                _this.wrapper.innerHTML = view.outerHTML;

                _environment.$html.attr('data-template', view.getAttribute('data-template'));

                _environment.$html.addClass('dom-is-loaded').removeClass('dom-is-loading');

                setTimeout(function () {
                    _environment.$html.removeClass(_this.overrideClass).addClass('dom-is-animated');
                }, 1000);
            }, 1000);
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            console.log("---- ❌ [transition]:destroy -----");
        }
    }]);

    return _class;
}();

exports.default = _class;

},{"../utils/environment":13}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _environment = require('../utils/environment');

var _BaseTransition2 = require('./BaseTransition');

var _BaseTransition3 = _interopRequireDefault(_BaseTransition2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _class = function (_BaseTransition) {
    _inherits(_class, _BaseTransition);

    function _class(options) {
        _classCallCheck(this, _class);

        var _this = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, options));

        _this.overrideClass = '-custom-transition';
        return _this;
    }

    return _class;
}(_BaseTransition3.default);

exports.default = _class;

},{"../utils/environment":13,"./BaseTransition":6}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* jshint esnext: true */


//List here all of your transitions


var _environment = require('../utils/environment');

var _App = require('../App');

var _transitions = require('./transitions');

var transitions = _interopRequireWildcard(_transitions);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MODULE_NAME = 'TransitionManager';
var EVENT_NAMESPACE = _environment.APP_NAME + '.' + MODULE_NAME;

var EVENT = {
    CLICK: 'click.' + EVENT_NAMESPACE
};

/*

@todo : 

- get data-transition on clicked link -> launch() and add switch(){}
- add goto listener
- add newPageReady functon with google analytics send
- add overrideClass system for all transitions
- add base class manager like old DefaultTransition (dom-is-loaded, dom-is-loading etc..)

*/

var _class = function () {
    function _class() {
        var _this = this;

        _classCallCheck(this, _class);

        // jQuery ondomready
        $(function () {
            _this.load();
        });

        this.transition;

        /*
        ===== PJAX CONFIGURATION =====
        */

        this.containerClass = '.js-pjax-container';
        this.wrapperId = 'js-pjax-wrapper';
        this.noPjaxRequestClass = 'no-transition';
        this.wrapper = document.getElementById(this.wrapperId);

        this.options = {
            debug: false,
            elements: ['a:not(.' + this.noPjaxRequestClass + ')', 'form[action]'],
            selectors: ['title', '' + this.containerClass],
            switches: {}
        };
        this.options.switches[this.containerClass] = function (oldEl, newEl, options) {
            return _this.switch(oldEl, newEl, options);
        };
        this.pjax = new Pjax(this.options);

        // temporary solution to get currentTarget clicked (to get data-transition)
        var a = document.querySelectorAll('a:not(.' + this.noPjaxRequestClass + ')');
        for (var i = a.length - 1; i >= 0; i--) {
            a[i].addEventListener('click', function (e) {
                return _this.click(e);
            });
        }

        document.addEventListener('pjax:success', function (e) {
            return _this.success(e);
        });
    }

    _createClass(_class, [{
        key: 'click',
        value: function click(e) {
            console.log("---- Launch request 🙌 -----");

            var el = e.target;
            var transition = el.getAttribute('data-transition') ? el.getAttribute('data-transition') : 'BaseTransition';

            // options available : wrapper, overrideClass
            this.transition = new transitions[transition]({
                wrapper: this.wrapper
            });

            this.transition.launch();
        }
    }, {
        key: 'switch',
        value: function _switch(oldEl, newEl, options) {

            console.log('---- Next view loaded 👌 -----');

            _environment.$document.triggerHandler({
                type: _App.EVENT.DELETE_SCOPED_MODULES,
                $scope: _environment.$pjaxWrapper
            });

            this.transition.hideView(oldEl);
            this.transition.displayView(newEl);

            _environment.$document.triggerHandler({
                type: _App.EVENT.INIT_SCOPED_MODULES,
                isPjax: true
            });
        }
    }, {
        key: 'success',
        value: function success(e) {
            this.transition.destroy();
            this.transition = null;
        }

        /**
         * DOM is loaded
         *
         * @return {void}
         */

    }, {
        key: 'load',
        value: function load() {
            _environment.$html.addClass('dom-is-loaded');
            _environment.$html.removeClass('dom-is-loading');
            setTimeout(function () {
                _environment.$html.addClass('dom-is-animated');
            }, 1000);
        }
    }]);

    return _class;
}();

exports.default = _class;

},{"../App":1,"../utils/environment":13,"./transitions":10}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _environment = require('../utils/environment');

var _App = require('../App');

/* jshint esnext: true */
function DefaultTransition(options) {
    options = options || {};
    var startCallback = typeof options.startCallback === 'function' ? options.startCallback : function () {};
    var overrideClass = typeof options.overrideClass === 'string' ? options.overrideClass : '';

    return Barba.BaseTransition.extend({
        start: function start() {
            var _this = this;

            _environment.$html.removeClass('dom-is-loaded dom-is-animated').addClass('dom-is-loading ' + overrideClass);

            startCallback();

            /* Close any overlays */

            setTimeout(function () {
                Promise.all([_this.newContainerLoading]).then(_this.finish.bind(_this));
            }, 1000);
        },
        finish: function finish() {
            _environment.$document.triggerHandler({
                type: _App.EVENT.DELETE_SCOPED_MODULES,
                $scope: _environment.$pjaxWrapper
            });

            this.done();

            var $el = $(this.newContainer);

            // Get the template name of the new container and set it to the DOM
            _environment.$html.attr('data-template', $el.data('template'));

            _environment.$document.triggerHandler({
                type: _App.EVENT.INIT_SCOPED_MODULES,
                isPjax: true
            });

            _environment.$html.addClass('dom-is-loaded').removeClass('dom-is-loading');

            setTimeout(function () {
                _environment.$html.removeClass(overrideClass).addClass('dom-is-animated');
            }, 1000);
        }
    });
}

exports.default = DefaultTransition;

},{"../App":1,"../utils/environment":13}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _BaseTransition = require('./BaseTransition');

Object.defineProperty(exports, 'BaseTransition', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_BaseTransition).default;
  }
});

var _CustomTransition = require('./CustomTransition');

Object.defineProperty(exports, 'CustomTransition', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_CustomTransition).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./BaseTransition":6,"./CustomTransition":7}],11:[function(require,module,exports){
'use strict';

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

var _is = require('./is');

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
    var i = void 0;

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

},{"./is":15}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (func, wait, immediate) {
    var timeout = void 0;
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
};

},{}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var APP_NAME = 'Boilerplate';
var DATA_API_KEY = '.data-api';

var $document = $(document);
var $window = $(window);
var $html = $(document.documentElement).removeClass('has-no-js').addClass('has-js');
var $body = $(document.body);
var $pjaxWrapper = $('#js-pjax-wrapper');

var isDebug = !!$html.data('debug');

exports.APP_NAME = APP_NAME;
exports.DATA_API_KEY = DATA_API_KEY;
exports.$document = $document;
exports.$window = $window;
exports.$html = $html;
exports.$body = $body;
exports.isDebug = isDebug;
exports.$pjaxWrapper = $pjaxWrapper;

},{}],14:[function(require,module,exports){
'use strict';

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
    var attributes = node.attributes;

    // Regex Pattern
    var pattern = /^data\-(.+)$/;

    // Output
    var data = {};

    for (var i in attributes) {
        if (!attributes[i]) {
            continue;
        }

        // Attributes name (ex: data-module)
        var name = attributes[i].name;

        // This happens.
        if (!name) {
            continue;
        }

        var match = name.match(pattern);
        if (!match) {
            continue;
        }

        // If this throws an error, you have some
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
    }

    // Only convert to a number if it doesn't change the string
    if (data === +data + '') {
        return +data;
    }

    if (rbrace.test(data)) {
        return JSON.parse(data);
    }

    return data;
}

},{}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.isArray = isArray;
exports.isArrayLike = isArrayLike;
exports.isEqual = isEqual;
exports.isNumeric = isNumeric;
exports.isObject = isObject;
exports.isFunction = isFunction;
var toString = Object.prototype.toString;
var arrayLikePattern = /^\[object (?:Array|FileList)\]$/;

// thanks, http://perfectionkills.com/instanceof-considered-harmful-or-how-to-write-a-robust-isarray/
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

    if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) === 'object' || (typeof b === 'undefined' ? 'undefined' : _typeof(b)) === 'object') {
        return false;
    }

    return a === b;
}

// http://stackoverflow.com/questions/18082/validate-numbers-in-javascript-isnumeric
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

},{}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.scrollTo = scrollTo;

var _is = require('./is');

var isAnimating = false; /* jshint esnext: true */


var defaults = {
    easing: 'swing',
    headerOffset: 60,
    speed: 300
};

/**
 * scrollTo is a function that scrolls a container to an element's position within that controller
 * Uses jQuery's $.Deferred to allow using a callback on animation completion
 * @param   {object}  $element  A jQuery node
 * @param   {object}  options
 */
function scrollTo($element, options) {
    var deferred = $.Deferred();

    // Drop everything if this ain't a jQuery object
    if ($element instanceof jQuery && $element.length > 0) {

        // Merging options
        options = $.extend({}, defaults, typeof options !== 'undefined' ? options : {});

        // Prevents accumulation of animations
        if (isAnimating === false) {
            isAnimating = true;

            // Default container that we'll be scrolling
            var $container = $('html, body');
            var elementOffset = 0;

            // Testing container in options for jQuery-ness
            // If we're not using a custom container, we take the top document offset
            // If we are, we use the elements position relative to the container
            if (typeof options.$container !== 'undefined' && options.$container instanceof jQuery && options.$container.length > 0) {
                $container = options.$container;

                if (typeof options.scrollTop !== 'undefined' && (0, _is.isNumeric)(options.scrollTop) && options.scrollTop !== 0) {
                    scrollTop = options.scrollTop;
                } else {
                    scrollTop = $element.position().top - options.headerOffset;
                }
            } else {
                if (typeof options.scrollTop !== 'undefined' && (0, _is.isNumeric)(options.scrollTop) && options.scrollTop !== 0) {
                    scrollTop = options.scrollTop;
                } else {
                    scrollTop = $element.offset().top - options.headerOffset;
                }
            }

            $container.animate({
                scrollTop: scrollTop
            }, options.speed, options.easing, function () {
                isAnimating = false;
                deferred.resolve();
            });
        }
    }

    return deferred.promise();
}

},{"./is":15}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.visibilityApi = undefined;

var _is = require('./is');

var _array = require('./array');

var _environment = require('./environment');

var CALLBACKS = {
    hidden: [],
    visible: []
}; /* jshint esnext: true */


var ACTIONS = ['addCallback', 'removeCallback'];

var STATES = ['visible', 'hidden'];

var PREFIX = 'v-';

var UUID = 0;

// Main event
_environment.$document.on('visibilitychange', function (event) {
    if (document.hidden) {
        onDocumentChange('hidden');
    } else {
        onDocumentChange('visible');
    }
});

/**
 * Add a callback
 * @param {string}   state
 * @param {function} callback
 * @return {string}  ident
 */
function addCallback(state, options) {
    var callback = options.callback || '';

    if (!(0, _is.isFunction)(callback)) {
        console.warn('Callback is not a function');
        return false;
    }

    var ident = PREFIX + UUID++;

    CALLBACKS[state].push({
        ident: ident,
        callback: callback
    });

    return ident;
}

/**
 * Remove a callback
 * @param  {string}   state  Visible or hidden
 * @param  {string}   ident  Unique identifier
 * @return {boolean}         If operation was a success
 */
function removeCallback(state, options) {
    var ident = options.ident || '';

    if (typeof ident === 'undefined' || ident === '') {
        console.warn('Need ident to remove callback');
        return false;
    }

    var index = (0, _array.findByKeyValue)(CALLBACKS[state], 'ident', ident)[0];

    // console.log(ident)
    // console.log(CALLBACKS[state])

    if (typeof index !== 'undefined') {
        (0, _array.removeFromArray)(CALLBACKS[state], index);
        return true;
    } else {
        console.warn('Callback could not be found');
        return false;
    }
}

/**
 * When document state changes, trigger callbacks
 * @param  {string}  state  Visible or hidden
 */
function onDocumentChange(state) {
    var callbackArray = CALLBACKS[state];
    var i = 0;
    var len = callbackArray.length;

    for (; i < len; i++) {
        callbackArray[i].callback();
    }
}

/**
 * Public facing API for adding and removing callbacks
 * @param   {object}           options  Options
 * @return  {boolean|integer}           Unique identifier for the callback or boolean indicating success or failure
 */
function visibilityApi(options) {
    var action = options.action || '';
    var state = options.state || '';
    var ret = void 0;

    // Type and value checking
    if (!(0, _array.arrayContains)(ACTIONS, action)) {
        console.warn('Action does not exist');
        return false;
    }
    if (!(0, _array.arrayContains)(STATES, state)) {
        console.warn('State does not exist');
        return false;
    }

    // @todo Magic call function pls
    if (action === 'addCallback') {
        ret = addCallback(state, options);
    } else if (action === 'removeCallback') {
        ret = removeCallback(state, options);
    }

    return ret;
}

exports.visibilityApi = visibilityApi;

},{"./array":11,"./environment":13,"./is":15}]},{},[1,2,3,4,5,9,6,7,8,10,11,12,13,14,15,16,17])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHMvc2NyaXB0cy9BcHAuanMiLCJhc3NldHMvc2NyaXB0cy9nbG9iYWxzLmpzIiwiYXNzZXRzL3NjcmlwdHMvbW9kdWxlcy5qcyIsImFzc2V0cy9zY3JpcHRzL21vZHVsZXMvQWJzdHJhY3RNb2R1bGUuanMiLCJhc3NldHMvc2NyaXB0cy9tb2R1bGVzL0V4YW1wbGUuanMiLCJhc3NldHMvc2NyaXB0cy90cmFuc2l0aW9ucy9CYXNlVHJhbnNpdGlvbi5qcyIsImFzc2V0cy9zY3JpcHRzL3RyYW5zaXRpb25zL0N1c3RvbVRyYW5zaXRpb24uanMiLCJhc3NldHMvc2NyaXB0cy90cmFuc2l0aW9ucy9UcmFuc2l0aW9uTWFuYWdlci5qcyIsImFzc2V0cy9zY3JpcHRzL3RyYW5zaXRpb25zL19EZWZhdWx0VHJhbnNpdGlvbi5qcyIsImFzc2V0cy9zY3JpcHRzL3RyYW5zaXRpb25zL3RyYW5zaXRpb25zLmpzIiwiYXNzZXRzL3NjcmlwdHMvdXRpbHMvYXJyYXkuanMiLCJhc3NldHMvc2NyaXB0cy91dGlscy9kZWJvdW5jZS5qcyIsImFzc2V0cy9zY3JpcHRzL3V0aWxzL2Vudmlyb25tZW50LmpzIiwiYXNzZXRzL3NjcmlwdHMvdXRpbHMvaHRtbC5qcyIsImFzc2V0cy9zY3JpcHRzL3V0aWxzL2lzLmpzIiwiYXNzZXRzL3NjcmlwdHMvdXRpbHMvc2Nyb2xsVG8uanMiLCJhc3NldHMvc2NyaXB0cy91dGlscy92aXNpYmlsaXR5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7OztxakJDQUE7OztBQVNBOzs7QUFSQTs7QUFFQTs7OztBQUVBOztBQUNBOztBQUNBOztBQUdBOztJQUFZLE87Ozs7Ozs7O0FBRVosSUFBTSxjQUFjLEtBQXBCO0FBQ0EsSUFBTSxnREFBaUMsV0FBdkM7O0FBRU8sSUFBTSx3QkFBUTtBQUNqQixtQ0FBNkIsZUFEWjtBQUVqQixnREFBMEMsZUFG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QWQsRUFBdUIsTUFBdkIsQ0FBTCxFQUFxQztBQUNqQyxnQkFBUSxJQUFSLENBQWEsdUJBQWI7QUFDQSxlQUFPLEtBQVA7QUFDSDtBQUNELFFBQUksQ0FBQywwQkFBYyxNQUFkLEVBQXNCLEtBQXRCLENBQUwsRUFBbUM7QUFDL0IsZ0JBQVEsSUFBUixDQUFhLHNCQUFiO0FBQ0EsZUFBTyxLQUFQO0FBQ0g7O0FBRUQ7QUFDQSxRQUFJLFdBQVcsYUFBZixFQUE4QjtBQUMxQixjQUFNLFlBQVksS0FBWixFQUFtQixPQUFuQixDQUFOO0FBQ0gsS0FGRCxNQUVPLElBQUksV0FBVyxnQkFBZixFQUFpQztBQUNwQyxjQUFNLGVBQWUsS0FBZixFQUFzQixPQUF0QixDQUFOO0FBQ0g7O0FBRUQsV0FBTyxHQUFQO0FBQ0g7O1FBRVEsYSxHQUFBLGEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoganNoaW50IGVzbmV4dDogdHJ1ZSAqL1xuaW1wb3J0IHsgQVBQX05BTUUsICRkb2N1bWVudCwgJHBqYXhXcmFwcGVyIH0gZnJvbSAnLi91dGlscy9lbnZpcm9ubWVudCc7XG5cbmltcG9ydCBnbG9iYWxzIGZyb20gJy4vZ2xvYmFscyc7XG5cbmltcG9ydCB7IGFycmF5Q29udGFpbnMsIHJlbW92ZUZyb21BcnJheSB9IGZyb20gJy4vdXRpbHMvYXJyYXknO1xuaW1wb3J0IHsgZ2V0Tm9kZURhdGEgfSBmcm9tICcuL3V0aWxzL2h0bWwnO1xuaW1wb3J0IHsgaXNGdW5jdGlvbiB9IGZyb20gJy4vdXRpbHMvaXMnO1xuXG4vLyBCYXNpYyBtb2R1bGVzXG5pbXBvcnQgKiBhcyBtb2R1bGVzIGZyb20gJy4vbW9kdWxlcyc7XG5cbmNvbnN0IE1PRFVMRV9OQU1FID0gJ0FwcCc7XG5jb25zdCBFVkVOVF9OQU1FU1BBQ0UgPSBgJHtBUFBfTkFNRX0uJHtNT0RVTEVfTkFNRX1gO1xuXG5leHBvcnQgY29uc3QgRVZFTlQgPSB7XG4gICAgSU5JVF9NT0RVTEVTOiBgaW5pdE1vZHVsZXMuJHtFVkVOVF9OQU1FU1BBQ0V9YCxcbiAgICBJTklUX1NDT1BFRF9NT0RVTEVTOiBgaW5pdFNjb3BlZE1vZHVsZXMuJHtFVkVOVF9OQU1FU1BBQ0V9YCxcbiAgICBERUxFVEVfU0NPUEVEX01PRFVMRVM6IGBkZWxldGVTY29wZWRNb2R1bGVzLiR7RVZFTlRfTkFNRVNQQUNFfWBcbn07XG5cbmNsYXNzIEFwcCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMubW9kdWxlcyA9IG1vZHVsZXM7XG4gICAgICAgIHRoaXMuY3VycmVudE1vZHVsZXMgPSBbXTtcblxuICAgICAgICAkZG9jdW1lbnQub24oRVZFTlQuSU5JVF9NT0RVTEVTLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIHRoaXMuaW5pdEdsb2JhbHMoZXZlbnQuZmlyc3RCbG9vZClcbiAgICAgICAgICAgICAgICAuZGVsZXRlTW9kdWxlcyhldmVudClcbiAgICAgICAgICAgICAgICAuaW5pdE1vZHVsZXMoZXZlbnQpO1xuICAgICAgICB9KTtcblxuICAgICAgICAkZG9jdW1lbnQub24oRVZFTlQuSU5JVF9TQ09QRURfTU9EVUxFUywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICB0aGlzLmluaXRNb2R1bGVzKGV2ZW50KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJGRvY3VtZW50Lm9uKEVWRU5ULkRFTEVURV9TQ09QRURfTU9EVUxFUywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICB0aGlzLmRlbGV0ZU1vZHVsZXMoZXZlbnQpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEZXN0cm95IGFsbCBleGlzdGluZyBtb2R1bGVzIG9yIGEgc3BlY2lmaWMgc2NvcGUgb2YgbW9kdWxlc1xuICAgICAqIEBwYXJhbSAge09iamVjdH0gZXZlbnQgVGhlIGV2ZW50IGJlaW5nIHRyaWdnZXJlZC5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9ICAgICAgIFNlbGYgKGFsbG93cyBjaGFpbmluZylcbiAgICAgKi9cbiAgICBkZWxldGVNb2R1bGVzKGV2ZW50KSB7XG4gICAgICAgIGxldCBkZXN0cm95QWxsID0gdHJ1ZTtcbiAgICAgICAgbGV0IG1vZHVsZUlkcyA9IFtdO1xuXG4gICAgICAgIC8vIENoZWNrIGZvciBzY29wZSBmaXJzdFxuICAgICAgICBpZiAoZXZlbnQuJHNjb3BlIGluc3RhbmNlb2YgalF1ZXJ5ICYmIGV2ZW50LiRzY29wZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAvLyBNb2R1bGVzIHdpdGhpbiBzY29wZVxuICAgICAgICAgICAgY29uc3QgJG1vZHVsZXMgPSBldmVudC4kc2NvcGUuZmluZCgnW2RhdGEtbW9kdWxlXScpO1xuXG4gICAgICAgICAgICAvLyBEZXRlcm1pbmUgdGhlaXIgdWlkc1xuICAgICAgICAgICAgbW9kdWxlSWRzID0gJC5tYWtlQXJyYXkoJG1vZHVsZXMubWFwKGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICRtb2R1bGVzLmVxKGluZGV4KS5kYXRhKCd1aWQnKTtcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgaWYgKG1vZHVsZUlkcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgZGVzdHJveUFsbCA9IGZhbHNlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIExvb3AgbW9kdWxlcyBhbmQgZGVzdHJveWluZyBhbGwgb2YgdGhlbSwgb3Igc3BlY2lmaWMgb25lc1xuICAgICAgICBsZXQgaSA9IHRoaXMuY3VycmVudE1vZHVsZXMubGVuZ3RoO1xuXG4gICAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgICAgIGlmIChkZXN0cm95QWxsIHx8IGFycmF5Q29udGFpbnMobW9kdWxlSWRzLCB0aGlzLmN1cnJlbnRNb2R1bGVzW2ldLnVpZCkpIHtcbiAgICAgICAgICAgICAgICByZW1vdmVGcm9tQXJyYXkobW9kdWxlSWRzLCB0aGlzLmN1cnJlbnRNb2R1bGVzW2ldLnVpZCk7XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50TW9kdWxlc1tpXS5kZXN0cm95KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50TW9kdWxlcy5zcGxpY2UoaSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFeGVjdXRlIGdsb2JhbCBmdW5jdGlvbnMgYW5kIHNldHRpbmdzXG4gICAgICogQWxsb3dzIHlvdSB0byBpbml0aWFsaXplIGdsb2JhbCBtb2R1bGVzIG9ubHkgb25jZSBpZiB5b3UgbmVlZFxuICAgICAqIChleC46IHdoZW4gdXNpbmcgQmFyYmEuanMgb3IgU21vb3RoU3RhdGUuanMpXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBTZWxmIChhbGxvd3MgY2hhaW5pbmcpXG4gICAgICovXG4gICAgaW5pdEdsb2JhbHMoZmlyc3RCbG9vZCkge1xuICAgICAgICBnbG9iYWxzKGZpcnN0Qmxvb2QpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGaW5kIG1vZHVsZXMgYW5kIGluaXRpYWxpemUgdGhlbVxuICAgICAqIEBwYXJhbSAge09iamVjdH0gZXZlbnQgVGhlIGV2ZW50IGJlaW5nIHRyaWdnZXJlZC5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9ICAgICAgIFNlbGYgKGFsbG93cyBjaGFpbmluZylcbiAgICAgKi9cbiAgICBpbml0TW9kdWxlcyhldmVudCkge1xuICAgICAgICAvLyBFbGVtZW50cyB3aXRoIG1vZHVsZVxuICAgICAgICBsZXQgJG1vZHVsZUVscyA9IFtdO1xuXG4gICAgICAgIC8vIElmIGZpcnN0IGJsb29kLCBsb2FkIGFsbCBtb2R1bGVzIGluIHRoZSBET01cbiAgICAgICAgLy8gSWYgc2NvcGVkLCByZW5kZXIgZWxlbWVudHMgd2l0aCBtb2R1bGVzXG4gICAgICAgIC8vIElmIEJhcmJhLCBsb2FkIG1vZHVsZXMgY29udGFpbmVkIGluIEJhcmJhIGNvbnRhaW5lclxuICAgICAgICBpZiAoZXZlbnQuZmlyc3RCbG9vZCkge1xuICAgICAgICAgICAgJG1vZHVsZUVscyA9ICRkb2N1bWVudC5maW5kKCdbZGF0YS1tb2R1bGVdJyk7XG4gICAgICAgIH0gZWxzZSBpZiAoZXZlbnQuJHNjb3BlIGluc3RhbmNlb2YgalF1ZXJ5ICYmIGV2ZW50LiRzY29wZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAkbW9kdWxlRWxzID0gZXZlbnQuJHNjb3BlLmZpbmQoJ1tkYXRhLW1vZHVsZV0nKTtcbiAgICAgICAgfSBlbHNlIGlmIChldmVudC5pc1BqYXgpIHtcbiAgICAgICAgICAgICRtb2R1bGVFbHMgPSAkcGpheFdyYXBwZXIuZmluZCgnW2RhdGEtbW9kdWxlXScpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gTG9vcCB0aHJvdWdoIGVsZW1lbnRzXG4gICAgICAgIGxldCBpID0gMDtcbiAgICAgICAgY29uc3QgZWxzTGVuID0gJG1vZHVsZUVscy5sZW5ndGg7XG5cbiAgICAgICAgZm9yICg7IGkgPCBlbHNMZW47IGkrKykge1xuXG4gICAgICAgICAgICAvLyBDdXJyZW50IGVsZW1lbnRcbiAgICAgICAgICAgIGxldCBlbCA9ICRtb2R1bGVFbHNbaV07XG5cbiAgICAgICAgICAgIC8vIEFsbCBkYXRhLSBhdHRyaWJ1dGVzIGNvbnNpZGVyZWQgYXMgb3B0aW9uc1xuICAgICAgICAgICAgbGV0IG9wdGlvbnMgPSBnZXROb2RlRGF0YShlbCk7XG5cbiAgICAgICAgICAgIC8vIEFkZCBjdXJyZW50IERPTSBlbGVtZW50IGFuZCBqUXVlcnkgZWxlbWVudFxuICAgICAgICAgICAgb3B0aW9ucy5lbCA9IGVsO1xuICAgICAgICAgICAgb3B0aW9ucy4kZWwgPSAkbW9kdWxlRWxzLmVxKGkpO1xuXG4gICAgICAgICAgICAvLyBNb2R1bGUgZG9lcyBleGlzdCBhdCB0aGlzIHBvaW50XG4gICAgICAgICAgICBsZXQgYXR0ciA9IG9wdGlvbnMubW9kdWxlO1xuXG4gICAgICAgICAgICAvLyBTcGxpdHRpbmcgbW9kdWxlcyBmb3VuZCBpbiB0aGUgZGF0YS1hdHRyaWJ1dGVcbiAgICAgICAgICAgIGxldCBtb2R1bGVJZGVudHMgPSBhdHRyLnNwbGl0KC9bLFxcc10rL2cpO1xuXG4gICAgICAgICAgICAvLyBMb29wIG1vZHVsZXNcbiAgICAgICAgICAgIGxldCBqID0gMDtcbiAgICAgICAgICAgIGxldCBtb2R1bGVzTGVuID0gbW9kdWxlSWRlbnRzLmxlbmd0aDtcblxuICAgICAgICAgICAgZm9yICg7IGogPCBtb2R1bGVzTGVuOyBqKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgbW9kdWxlQXR0ciA9IG1vZHVsZUlkZW50c1tqXTtcblxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5tb2R1bGVzW21vZHVsZUF0dHJdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBtb2R1bGUgPSBuZXcgdGhpcy5tb2R1bGVzW21vZHVsZUF0dHJdKG9wdGlvbnMpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRNb2R1bGVzLnB1c2gobW9kdWxlKTtcbiAgICAgICAgICAgICAgICAgICAgbW9kdWxlLmluaXQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59XG5cbi8vIElJRkUgZm9yIGxvYWRpbmcgdGhlIGFwcGxpY2F0aW9uXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuKGZ1bmN0aW9uKCkge1xuICAgIG5ldyBBcHAoKTtcbiAgICAkZG9jdW1lbnQudHJpZ2dlckhhbmRsZXIoe1xuICAgICAgICB0eXBlOiBFVkVOVC5JTklUX01PRFVMRVMsXG4gICAgICAgIGZpcnN0Qmxvb2Q6IHRydWVcbiAgICB9KTtcbn0pKCk7XG4iLCIvKiBqc2hpbnQgZXNuZXh0OiB0cnVlICovXG5pbXBvcnQgVHJhbnNpdGlvbk1hbmFnZXIgZnJvbSAnLi90cmFuc2l0aW9ucy9UcmFuc2l0aW9uTWFuYWdlcic7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGZpcnN0Qmxvb2QpIHtcbiAgICBzdmc0ZXZlcnlib2R5KCk7XG5cbiAgICBpZiAoZmlyc3RCbG9vZCkge1xuICAgICAgICBjb25zdCB0cmFuc2l0aW9uTWFuYWdlciA9IG5ldyBUcmFuc2l0aW9uTWFuYWdlcigpO1xuICAgIH1cbn1cbiIsIi8qIGpzaGludCBlc25leHQ6IHRydWUgKi9cbmV4cG9ydCB7ZGVmYXVsdCBhcyBFeGFtcGxlfSBmcm9tICcuL21vZHVsZXMvRXhhbXBsZSc7XG4iLCIvKiBqc2hpbnQgZXNuZXh0OiB0cnVlICovXG5sZXQgdWlkID0gMDtcblxuLyoqXG4gKiBBYnN0cmFjdCBNb2R1bGVcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3Mge1xuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy4kZWwgPSBvcHRpb25zLiRlbCB8fCBudWxsO1xuICAgICAgICB0aGlzLmVsICA9IG9wdGlvbnMuZWwgIHx8IG51bGw7XG5cbiAgICAgICAgLy8gR2VuZXJhdGUgYSB1bmlxdWUgbW9kdWxlIGlkZW50aWZpZXJcbiAgICAgICAgdGhpcy51aWQgPSAnbS0nICsgdWlkKys7XG4gICAgICAgIC8vIFVzZSBqUXVlcnkncyBkYXRhIEFQSSB0byBcInN0b3JlIGl0IGluIHRoZSBET01cIlxuICAgICAgICB0aGlzLiRlbC5kYXRhKCd1aWQnLCB0aGlzLnVpZCk7XG4gICAgfVxuXG4gICAgaW5pdCgpIHt9XG5cbiAgICBkZXN0cm95KCkge1xuICAgICAgICBpZiAodGhpcy4kZWwpIHtcbiAgICAgICAgICAgIHRoaXMuJGVsLnJlbW92ZURhdGEoJ3VpZCcpXG4gICAgICAgIH1cbiAgICB9XG59XG4iLCIvKiBqc2hpbnQgZXNuZXh0OiB0cnVlICovXG5pbXBvcnQgeyBBUFBfTkFNRSB9IGZyb20gJy4uL3V0aWxzL2Vudmlyb25tZW50JztcbmltcG9ydCBBYnN0cmFjdE1vZHVsZSBmcm9tICcuL0Fic3RyYWN0TW9kdWxlJztcblxuY29uc3QgTU9EVUxFX05BTUUgPSAnRXhhbXBsZSc7XG5jb25zdCBFVkVOVF9OQU1FU1BBQ0UgPSBgJHtBUFBfTkFNRX0uJHtNT0RVTEVfTkFNRX1gO1xuXG5jb25zdCBFVkVOVCA9IHtcbiAgICBDTElDSzogYGNsaWNrLiR7RVZFTlRfTkFNRVNQQUNFfWBcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIGV4dGVuZHMgQWJzdHJhY3RNb2R1bGUge1xuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICAgICAgc3VwZXIob3B0aW9ucyk7XG5cbiAgICAgICAgLy8gRGVjbGFyYXRpb24gb2YgcHJvcGVydGllc1xuICAgICAgICBjb25zb2xlLmxvZygn8J+UqCBbbW9kdWxlXTpjb25zdHJ1Y3RvciAtIEV4YW1wbGUnKTtcblxuICAgIH1cblxuICAgIGluaXQoKSB7XG4gICAgICAgIC8vIFNldCBldmVudHMgYW5kIHN1Y2hcblxuICAgIH1cblxuICAgIGRlc3Ryb3koKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCfinYwgW21vZHVsZV06ZGVzdHJveSAtIEV4YW1wbGUnKTtcbiAgICAgICAgc3VwZXIuZGVzdHJveSgpO1xuICAgICAgICB0aGlzLiRlbC5vZmYoYC4ke0VWRU5UX05BTUVTUEFDRX1gKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBBUFBfTkFNRSwgJGRvY3VtZW50LCAkaHRtbCwgaXNEZWJ1ZywgJHBqYXhXcmFwcGVyIH0gZnJvbSAnLi4vdXRpbHMvZW52aXJvbm1lbnQnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyB7XG4gICAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuXG4gICAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgICAgIHRoaXMud3JhcHBlciA9IG9wdGlvbnMud3JhcHBlcjtcbiAgICAgICAgdGhpcy5vdmVycmlkZUNsYXNzID0gb3B0aW9ucy5vdmVycmlkZUNsYXNzID8gb3B0aW9ucy5vdmVycmlkZUNsYXNzIDogJyc7XG5cbiAgICB9XG5cbiAgICBsYXVuY2goKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiLS0tLSBMYXVuY2ggdHJhbnNpdGlvbiDwn5GKIC0tLS0tXCIpO1xuXG4gICAgICAgICRodG1sXG4gICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ2RvbS1pcy1sb2FkZWQgZG9tLWlzLWFuaW1hdGVkJylcbiAgICAgICAgICAgIC5hZGRDbGFzcyhgZG9tLWlzLWxvYWRpbmcgJHt0aGlzLm92ZXJyaWRlQ2xhc3N9YCk7XG5cbiAgICB9XG5cbiAgICBoaWRlVmlldyh2aWV3KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCctLS0tLSDinYwgW1ZJRVddOnJlbW92ZSAtICcsIHZpZXcuZ2V0QXR0cmlidXRlKCdkYXRhLXRlbXBsYXRlJykpO1xuICAgICAgICB2aWV3LnJlbW92ZSgpO1xuXG4gICAgfVxuXG4gICAgZGlzcGxheVZpZXcodmlldykge1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc29sZS5sb2coJy0tLS0tIOKchSBbVklFV106ZGlzcGxheSA6Jywgdmlldy5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGVtcGxhdGUnKSk7XG4gICAgICAgICAgICB0aGlzLndyYXBwZXIuaW5uZXJIVE1MID0gdmlldy5vdXRlckhUTUw7XG5cbiAgICAgICAgICAgICRodG1sLmF0dHIoJ2RhdGEtdGVtcGxhdGUnLCB2aWV3LmdldEF0dHJpYnV0ZSgnZGF0YS10ZW1wbGF0ZScpKTtcblxuICAgICAgICAgICAgJGh0bWxcbiAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoJ2RvbS1pcy1sb2FkZWQnKVxuICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnZG9tLWlzLWxvYWRpbmcnKTtcblxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgJGh0bWxcbiAgICAgICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKHRoaXMub3ZlcnJpZGVDbGFzcylcbiAgICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKCdkb20taXMtYW5pbWF0ZWQnKTtcbiAgICAgICAgICAgIH0sIDEwMDApO1xuXG4gICAgICAgIH0sMTAwMCk7XG4gICAgfVxuXG4gICAgXG4gICAgZGVzdHJveSgpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCItLS0tIOKdjCBbdHJhbnNpdGlvbl06ZGVzdHJveSAtLS0tLVwiKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBBUFBfTkFNRSwgJGRvY3VtZW50LCAkaHRtbCwgaXNEZWJ1ZywgJHBqYXhXcmFwcGVyIH0gZnJvbSAnLi4vdXRpbHMvZW52aXJvbm1lbnQnO1xuaW1wb3J0IEJhc2VUcmFuc2l0aW9uIGZyb20gJy4vQmFzZVRyYW5zaXRpb24nO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBleHRlbmRzIEJhc2VUcmFuc2l0aW9ue1xuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICAgICAgc3VwZXIob3B0aW9ucyk7XG5cbiAgICAgICAgdGhpcy5vdmVycmlkZUNsYXNzID0gJy1jdXN0b20tdHJhbnNpdGlvbic7XG4gICAgfVxuXG59XG4iLCIvKiBqc2hpbnQgZXNuZXh0OiB0cnVlICovXG5pbXBvcnQgeyBBUFBfTkFNRSwgJGRvY3VtZW50LCAkaHRtbCwgaXNEZWJ1ZywgJHBqYXhXcmFwcGVyIH0gZnJvbSAnLi4vdXRpbHMvZW52aXJvbm1lbnQnO1xuaW1wb3J0IHsgRVZFTlQgYXMgQVBQX0VWRU5UIH0gZnJvbSAnLi4vQXBwJztcblxuLy9MaXN0IGhlcmUgYWxsIG9mIHlvdXIgdHJhbnNpdGlvbnNcbmltcG9ydCAqIGFzIHRyYW5zaXRpb25zIGZyb20gJy4vdHJhbnNpdGlvbnMnO1xuXG5jb25zdCBNT0RVTEVfTkFNRSA9ICdUcmFuc2l0aW9uTWFuYWdlcic7XG5jb25zdCBFVkVOVF9OQU1FU1BBQ0UgPSBgJHtBUFBfTkFNRX0uJHtNT0RVTEVfTkFNRX1gO1xuXG5jb25zdCBFVkVOVCA9IHtcbiAgICBDTElDSzogYGNsaWNrLiR7RVZFTlRfTkFNRVNQQUNFfWBcbn07XG5cbi8qXG5cbkB0b2RvIDogXG5cbi0gZ2V0IGRhdGEtdHJhbnNpdGlvbiBvbiBjbGlja2VkIGxpbmsgLT4gbGF1bmNoKCkgYW5kIGFkZCBzd2l0Y2goKXt9XG4tIGFkZCBnb3RvIGxpc3RlbmVyXG4tIGFkZCBuZXdQYWdlUmVhZHkgZnVuY3RvbiB3aXRoIGdvb2dsZSBhbmFseXRpY3Mgc2VuZFxuLSBhZGQgb3ZlcnJpZGVDbGFzcyBzeXN0ZW0gZm9yIGFsbCB0cmFuc2l0aW9uc1xuLSBhZGQgYmFzZSBjbGFzcyBtYW5hZ2VyIGxpa2Ugb2xkIERlZmF1bHRUcmFuc2l0aW9uIChkb20taXMtbG9hZGVkLCBkb20taXMtbG9hZGluZyBldGMuLilcblxuKi9cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3Mge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBcblxuICAgICAgICAvLyBqUXVlcnkgb25kb21yZWFkeVxuICAgICAgICAkKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMubG9hZCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnRyYW5zaXRpb247XG5cbiAgICAgICAgLypcbiAgICAgICAgPT09PT0gUEpBWCBDT05GSUdVUkFUSU9OID09PT09XG4gICAgICAgICovXG5cbiAgICAgICAgdGhpcy5jb250YWluZXJDbGFzcyA9ICcuanMtcGpheC1jb250YWluZXInO1xuICAgICAgICB0aGlzLndyYXBwZXJJZCA9ICdqcy1wamF4LXdyYXBwZXInO1xuICAgICAgICB0aGlzLm5vUGpheFJlcXVlc3RDbGFzcyA9ICduby10cmFuc2l0aW9uJztcbiAgICAgICAgdGhpcy53cmFwcGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy53cmFwcGVySWQpO1xuXG4gICAgICAgIHRoaXMub3B0aW9ucyA9IHtcbiAgICAgICAgICAgIGRlYnVnOiBmYWxzZSxcbiAgICAgICAgICAgIGVsZW1lbnRzOiBbYGE6bm90KC4ke3RoaXMubm9QamF4UmVxdWVzdENsYXNzfSlgLCdmb3JtW2FjdGlvbl0nXSxcbiAgICAgICAgICAgIHNlbGVjdG9yczogWyd0aXRsZScsYCR7dGhpcy5jb250YWluZXJDbGFzc31gXSxcbiAgICAgICAgICAgIHN3aXRjaGVzOiB7fVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLm9wdGlvbnMuc3dpdGNoZXNbdGhpcy5jb250YWluZXJDbGFzc10gPSAob2xkRWwsIG5ld0VsLCBvcHRpb25zKSA9PiB0aGlzLnN3aXRjaChvbGRFbCwgbmV3RWwsIG9wdGlvbnMpXG4gICAgICAgIHRoaXMucGpheCA9IG5ldyBQamF4KHRoaXMub3B0aW9ucyk7XG5cbiAgICAgICAgLy8gdGVtcG9yYXJ5IHNvbHV0aW9uIHRvIGdldCBjdXJyZW50VGFyZ2V0IGNsaWNrZWQgKHRvIGdldCBkYXRhLXRyYW5zaXRpb24pXG4gICAgICAgIGxldCBhID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgYTpub3QoLiR7dGhpcy5ub1BqYXhSZXF1ZXN0Q2xhc3N9KWApO1xuICAgICAgICBmb3IgKHZhciBpID0gYS5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgYVtpXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsKGUpID0+IHRoaXMuY2xpY2soZSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigncGpheDpzdWNjZXNzJywoZSkgPT4gdGhpcy5zdWNjZXNzKGUpKTtcblxuICAgIH1cblxuICAgIGNsaWNrKGUpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCItLS0tIExhdW5jaCByZXF1ZXN0IPCfmYwgLS0tLS1cIik7XG5cbiAgICAgICAgbGV0IGVsID0gZS50YXJnZXQ7XG4gICAgICAgIGxldCB0cmFuc2l0aW9uID0gZWwuZ2V0QXR0cmlidXRlKCdkYXRhLXRyYW5zaXRpb24nKSA/IGVsLmdldEF0dHJpYnV0ZSgnZGF0YS10cmFuc2l0aW9uJykgOiAnQmFzZVRyYW5zaXRpb24nXG5cbiAgICAgICAgLy8gb3B0aW9ucyBhdmFpbGFibGUgOiB3cmFwcGVyLCBvdmVycmlkZUNsYXNzXG4gICAgICAgIHRoaXMudHJhbnNpdGlvbiA9IG5ldyB0cmFuc2l0aW9uc1t0cmFuc2l0aW9uXSh7XG4gICAgICAgICAgICB3cmFwcGVyOiB0aGlzLndyYXBwZXJcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy50cmFuc2l0aW9uLmxhdW5jaCgpO1xuICAgIH1cblxuICAgIHN3aXRjaChvbGRFbCwgbmV3RWwsIG9wdGlvbnMpIHtcblxuICAgICAgICBjb25zb2xlLmxvZygnLS0tLSBOZXh0IHZpZXcgbG9hZGVkIPCfkYwgLS0tLS0nKTtcblxuICAgICAgICAkZG9jdW1lbnQudHJpZ2dlckhhbmRsZXIoe1xuICAgICAgICAgICAgdHlwZTogQVBQX0VWRU5ULkRFTEVURV9TQ09QRURfTU9EVUxFUyxcbiAgICAgICAgICAgICRzY29wZTogJHBqYXhXcmFwcGVyXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMudHJhbnNpdGlvbi5oaWRlVmlldyhvbGRFbCk7XG4gICAgICAgIHRoaXMudHJhbnNpdGlvbi5kaXNwbGF5VmlldyhuZXdFbCk7XG5cbiAgICAgICAgJGRvY3VtZW50LnRyaWdnZXJIYW5kbGVyKHtcbiAgICAgICAgICAgIHR5cGU6IEFQUF9FVkVOVC5JTklUX1NDT1BFRF9NT0RVTEVTLFxuICAgICAgICAgICAgaXNQamF4OiB0cnVlXG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgc3VjY2VzcyhlKSB7XG4gICAgICAgIHRoaXMudHJhbnNpdGlvbi5kZXN0cm95KCk7XG4gICAgICAgIHRoaXMudHJhbnNpdGlvbiA9IG51bGw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRE9NIGlzIGxvYWRlZFxuICAgICAqXG4gICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgKi9cbiAgICBsb2FkKCkge1xuICAgICAgICAkaHRtbC5hZGRDbGFzcygnZG9tLWlzLWxvYWRlZCcpO1xuICAgICAgICAkaHRtbC5yZW1vdmVDbGFzcygnZG9tLWlzLWxvYWRpbmcnKTtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAkaHRtbC5hZGRDbGFzcygnZG9tLWlzLWFuaW1hdGVkJyk7XG4gICAgICAgIH0sIDEwMDApXG4gICAgfVxufVxuIiwiLyoganNoaW50IGVzbmV4dDogdHJ1ZSAqL1xuaW1wb3J0IHsgQVBQX05BTUUsICRkb2N1bWVudCwgJGh0bWwsICRwamF4V3JhcHBlciB9IGZyb20gJy4uL3V0aWxzL2Vudmlyb25tZW50JztcbmltcG9ydCB7IEVWRU5UIGFzIEFQUF9FVkVOVCB9IGZyb20gJy4uL0FwcCc7XG5cbmZ1bmN0aW9uIERlZmF1bHRUcmFuc2l0aW9uKG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICBjb25zdCBzdGFydENhbGxiYWNrID0gKHR5cGVvZiBvcHRpb25zLnN0YXJ0Q2FsbGJhY2sgPT09ICdmdW5jdGlvbicpID8gb3B0aW9ucy5zdGFydENhbGxiYWNrIDogZnVuY3Rpb24oKXt9O1xuICAgIGNvbnN0IG92ZXJyaWRlQ2xhc3MgPSAodHlwZW9mIG9wdGlvbnMub3ZlcnJpZGVDbGFzcyA9PT0gJ3N0cmluZycpID8gb3B0aW9ucy5vdmVycmlkZUNsYXNzIDogJyc7XG5cbiAgICByZXR1cm4gQmFyYmEuQmFzZVRyYW5zaXRpb24uZXh0ZW5kKHtcbiAgICAgICAgc3RhcnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJGh0bWxcbiAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ2RvbS1pcy1sb2FkZWQgZG9tLWlzLWFuaW1hdGVkJylcbiAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoYGRvbS1pcy1sb2FkaW5nICR7b3ZlcnJpZGVDbGFzc31gKTtcblxuICAgICAgICAgICAgc3RhcnRDYWxsYmFjaygpO1xuXG4gICAgICAgICAgICAvKiBDbG9zZSBhbnkgb3ZlcmxheXMgKi9cblxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgUHJvbWlzZVxuICAgICAgICAgICAgICAgICAgLmFsbChbdGhpcy5uZXdDb250YWluZXJMb2FkaW5nXSlcbiAgICAgICAgICAgICAgICAgIC50aGVuKHRoaXMuZmluaXNoLmJpbmQodGhpcykpO1xuICAgICAgICAgICAgfSwgMTAwMCk7XG4gICAgICAgIH0sXG4gICAgICAgIGZpbmlzaDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkZG9jdW1lbnQudHJpZ2dlckhhbmRsZXIoe1xuICAgICAgICAgICAgICAgIHR5cGU6ICAgQVBQX0VWRU5ULkRFTEVURV9TQ09QRURfTU9EVUxFUyxcbiAgICAgICAgICAgICAgICAkc2NvcGU6ICRwamF4V3JhcHBlclxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMuZG9uZSgpO1xuXG4gICAgICAgICAgICBjb25zdCAkZWwgPSAkKHRoaXMubmV3Q29udGFpbmVyKTtcblxuICAgICAgICAgICAgLy8gR2V0IHRoZSB0ZW1wbGF0ZSBuYW1lIG9mIHRoZSBuZXcgY29udGFpbmVyIGFuZCBzZXQgaXQgdG8gdGhlIERPTVxuICAgICAgICAgICAgJGh0bWwuYXR0cignZGF0YS10ZW1wbGF0ZScsICRlbC5kYXRhKCd0ZW1wbGF0ZScpKTtcblxuICAgICAgICAgICAgJGRvY3VtZW50LnRyaWdnZXJIYW5kbGVyKHtcbiAgICAgICAgICAgICAgICB0eXBlOiBBUFBfRVZFTlQuSU5JVF9TQ09QRURfTU9EVUxFUyxcbiAgICAgICAgICAgICAgICBpc1BqYXg6IHRydWVcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkaHRtbFxuICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnZG9tLWlzLWxvYWRlZCcpXG4gICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdkb20taXMtbG9hZGluZycpO1xuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAkaHRtbFxuICAgICAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3Mob3ZlcnJpZGVDbGFzcylcbiAgICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKCdkb20taXMtYW5pbWF0ZWQnKTtcbiAgICAgICAgICAgIH0sIDEwMDApO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IERlZmF1bHRUcmFuc2l0aW9uO1xuIiwiZXhwb3J0IHtkZWZhdWx0IGFzIEJhc2VUcmFuc2l0aW9ufSBmcm9tICcuL0Jhc2VUcmFuc2l0aW9uJztcbmV4cG9ydCB7ZGVmYXVsdCBhcyBDdXN0b21UcmFuc2l0aW9ufSBmcm9tICcuL0N1c3RvbVRyYW5zaXRpb24nO1xuIiwiaW1wb3J0IHsgaXNBcnJheSB9IGZyb20gJy4vaXMnO1xuXG5leHBvcnQgZnVuY3Rpb24gYWRkVG9BcnJheSAoIGFycmF5LCB2YWx1ZSApIHtcbiAgICBjb25zdCBpbmRleCA9IGFycmF5LmluZGV4T2YoIHZhbHVlICk7XG5cbiAgICBpZiAoIGluZGV4ID09PSAtMSApIHtcbiAgICAgICAgYXJyYXkucHVzaCggdmFsdWUgKTtcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhcnJheUNvbnRhaW5zICggYXJyYXksIHZhbHVlICkge1xuICAgIGZvciAoIGxldCBpID0gMCwgYyA9IGFycmF5Lmxlbmd0aDsgaSA8IGM7IGkrKyApIHtcbiAgICAgICAgaWYgKCBhcnJheVtpXSA9PSB2YWx1ZSApIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYXJyYXlDb250ZW50c01hdGNoICggYSwgYiApIHtcbiAgICBsZXQgaTtcblxuICAgIGlmICggIWlzQXJyYXkoIGEgKSB8fCAhaXNBcnJheSggYiApICkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKCBhLmxlbmd0aCAhPT0gYi5sZW5ndGggKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpID0gYS5sZW5ndGg7XG4gICAgd2hpbGUgKCBpLS0gKSB7XG4gICAgICAgIGlmICggYVtpXSAhPT0gYltpXSApIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZW5zdXJlQXJyYXkgKCB4ICkge1xuICAgIGlmICggdHlwZW9mIHggPT09ICdzdHJpbmcnICkge1xuICAgICAgICByZXR1cm4gWyB4IF07XG4gICAgfVxuXG4gICAgaWYgKCB4ID09PSB1bmRlZmluZWQgKSB7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICB9XG5cbiAgICByZXR1cm4geDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxhc3RJdGVtICggYXJyYXkgKSB7XG4gICAgcmV0dXJuIGFycmF5WyBhcnJheS5sZW5ndGggLSAxIF07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVGcm9tQXJyYXkgKCBhcnJheSwgbWVtYmVyICkge1xuICAgIGlmICggIWFycmF5ICkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgaW5kZXggPSBhcnJheS5pbmRleE9mKCBtZW1iZXIgKTtcblxuICAgIGlmICggaW5kZXggIT09IC0xICkge1xuICAgICAgICBhcnJheS5zcGxpY2UoIGluZGV4LCAxICk7XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9BcnJheSAoIGFycmF5TGlrZSApIHtcbiAgICBjb25zdCBhcnJheSA9IFtdO1xuICAgIGxldCBpID0gYXJyYXlMaWtlLmxlbmd0aDtcbiAgICB3aGlsZSAoIGktLSApIHtcbiAgICAgICAgYXJyYXlbaV0gPSBhcnJheUxpa2VbaV07XG4gICAgfVxuXG4gICAgcmV0dXJuIGFycmF5O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZmluZEJ5S2V5VmFsdWUoIGFycmF5LCBrZXksIHZhbHVlICkge1xuICAgIHJldHVybiBhcnJheS5maWx0ZXIoZnVuY3Rpb24oIG9iaiApIHtcbiAgICAgICAgcmV0dXJuIG9ialtrZXldID09PSB2YWx1ZTtcbiAgICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNsb25lQXJyYXkoIGFycmF5ICkge1xuICAgIHJldHVybiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGFycmF5KSk7XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbihmdW5jLCB3YWl0LCBpbW1lZGlhdGUpIHtcbiAgICBsZXQgdGltZW91dDtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnN0IGNvbnRleHQgPSB0aGlzO1xuICAgICAgICBjb25zdCBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgICBjb25zdCBsYXRlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGltZW91dCA9IG51bGw7XG4gICAgICAgICAgICBpZiAoIWltbWVkaWF0ZSkgZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgY2FsbE5vdyA9IGltbWVkaWF0ZSAmJiAhdGltZW91dDtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgd2FpdCk7XG4gICAgICAgIGlmIChjYWxsTm93KSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgIH07XG59XG4iLCJjb25zdCBBUFBfTkFNRSAgICAgPSAnQm9pbGVycGxhdGUnO1xuY29uc3QgREFUQV9BUElfS0VZID0gJy5kYXRhLWFwaSc7XG5cbmNvbnN0ICRkb2N1bWVudCAgICA9ICQoZG9jdW1lbnQpO1xuY29uc3QgJHdpbmRvdyAgICAgID0gJCh3aW5kb3cpO1xuY29uc3QgJGh0bWwgICAgICAgID0gJChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpLnJlbW92ZUNsYXNzKCdoYXMtbm8tanMnKS5hZGRDbGFzcygnaGFzLWpzJyk7XG5jb25zdCAkYm9keSAgICAgICAgPSAkKGRvY3VtZW50LmJvZHkpO1xuY29uc3QgJHBqYXhXcmFwcGVyID0gJCgnI2pzLXBqYXgtd3JhcHBlcicpO1xuXG5jb25zdCBpc0RlYnVnICAgICAgPSAhISRodG1sLmRhdGEoJ2RlYnVnJyk7XG5cbmV4cG9ydCB7IEFQUF9OQU1FLCBEQVRBX0FQSV9LRVksICRkb2N1bWVudCwgJHdpbmRvdywgJGh0bWwsICRib2R5LCBpc0RlYnVnLCAkcGpheFdyYXBwZXIgfTtcbiIsIi8qKlxuICogQHNlZSAgaHR0cHM6Ly9naXRodWIuY29tL3JhY3RpdmVqcy9yYWN0aXZlL2Jsb2IvZGV2L3NyYy91dGlscy9odG1sLmpzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBlc2NhcGVIdG1sKHN0cikge1xuICAgIHJldHVybiBzdHJcbiAgICAgICAgLnJlcGxhY2UoLyYvZywgJyZhbXA7JylcbiAgICAgICAgLnJlcGxhY2UoLzwvZywgJyZsdDsnKVxuICAgICAgICAucmVwbGFjZSgvPi9nLCAnJmd0OycpO1xufVxuXG4vKipcbiAqIFByZXBhcmUgSFRNTCBjb250ZW50IHRoYXQgY29udGFpbnMgbXVzdGFjaGUgY2hhcmFjdGVycyBmb3IgdXNlIHdpdGggUmFjdGl2ZVxuICogQHBhcmFtICB7c3RyaW5nfSBzdHJcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVuZXNjYXBlSHRtbChzdHIpIHtcbiAgICByZXR1cm4gc3RyXG4gICAgICAgIC5yZXBsYWNlKC8mbHQ7L2csICc8JylcbiAgICAgICAgLnJlcGxhY2UoLyZndDsvZywgJz4nKVxuICAgICAgICAucmVwbGFjZSgvJmFtcDsvZywgJyYnKTtcbn1cblxuLyoqXG4gKiBHZXQgZWxlbWVudCBkYXRhIGF0dHJpYnV0ZXNcbiAqIEBwYXJhbSAgIHtET01FbGVtZW50fSAgbm9kZVxuICogQHJldHVybiAge0FycmF5fSAgICAgICBkYXRhXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXROb2RlRGF0YShub2RlKSB7XG4gICAgLy8gQWxsIGF0dHJpYnV0ZXNcbiAgICBjb25zdCBhdHRyaWJ1dGVzID0gbm9kZS5hdHRyaWJ1dGVzO1xuXG4gICAgLy8gUmVnZXggUGF0dGVyblxuICAgIGNvbnN0IHBhdHRlcm4gPSAvXmRhdGFcXC0oLispJC87XG5cbiAgICAvLyBPdXRwdXRcbiAgICBjb25zdCBkYXRhID0ge307XG5cbiAgICBmb3IgKGxldCBpIGluIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgaWYgKCFhdHRyaWJ1dGVzW2ldKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEF0dHJpYnV0ZXMgbmFtZSAoZXg6IGRhdGEtbW9kdWxlKVxuICAgICAgICBsZXQgbmFtZSA9IGF0dHJpYnV0ZXNbaV0ubmFtZTtcblxuICAgICAgICAvLyBUaGlzIGhhcHBlbnMuXG4gICAgICAgIGlmICghbmFtZSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgbWF0Y2ggPSBuYW1lLm1hdGNoKHBhdHRlcm4pO1xuICAgICAgICBpZiAoIW1hdGNoKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElmIHRoaXMgdGhyb3dzIGFuIGVycm9yLCB5b3UgaGF2ZSBzb21lXG4gICAgICAgIC8vIHNlcmlvdXMgcHJvYmxlbXMgaW4geW91ciBIVE1MLlxuICAgICAgICBkYXRhW21hdGNoWzFdXSA9IGdldERhdGEobm9kZS5nZXRBdHRyaWJ1dGUobmFtZSkpO1xuICAgIH1cblxuICAgIHJldHVybiBkYXRhO1xufVxuXG5jb25zdCByYnJhY2UgPSAvXig/Olxce1tcXHdcXFddKlxcfXxcXFtbXFx3XFxXXSpcXF0pJC87XG5cbi8qKlxuICogUGFyc2UgdmFsdWUgdG8gZGF0YSB0eXBlLlxuICpcbiAqIEBsaW5rICAgaHR0cHM6Ly9naXRodWIuY29tL2pxdWVyeS9qcXVlcnkvYmxvYi8zLjEuMS9zcmMvZGF0YS5qc1xuICogQHBhcmFtICB7c3RyaW5nfSBkYXRhIC0gQSB2YWx1ZSB0byBjb252ZXJ0LlxuICogQHJldHVybiB7bWl4ZWR9ICBSZXR1cm5zIHRoZSB2YWx1ZSBpbiBpdHMgbmF0dXJhbCBkYXRhIHR5cGUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXREYXRhKGRhdGEpIHtcbiAgICBpZiAoZGF0YSA9PT0gJ3RydWUnKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGlmIChkYXRhID09PSAnZmFsc2UnKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoZGF0YSA9PT0gJ251bGwnKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8vIE9ubHkgY29udmVydCB0byBhIG51bWJlciBpZiBpdCBkb2Vzbid0IGNoYW5nZSB0aGUgc3RyaW5nXG4gICAgaWYgKGRhdGEgPT09ICtkYXRhKycnKSB7XG4gICAgICAgIHJldHVybiArZGF0YTtcbiAgICB9XG5cbiAgICBpZiAocmJyYWNlLnRlc3QoIGRhdGEgKSkge1xuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZSggZGF0YSApO1xuICAgIH1cblxuICAgIHJldHVybiBkYXRhO1xufVxuIiwiY29uc3QgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuY29uc3QgYXJyYXlMaWtlUGF0dGVybiA9IC9eXFxbb2JqZWN0ICg/OkFycmF5fEZpbGVMaXN0KVxcXSQvO1xuXG4vLyB0aGFua3MsIGh0dHA6Ly9wZXJmZWN0aW9ua2lsbHMuY29tL2luc3RhbmNlb2YtY29uc2lkZXJlZC1oYXJtZnVsLW9yLWhvdy10by13cml0ZS1hLXJvYnVzdC1pc2FycmF5L1xuZXhwb3J0IGZ1bmN0aW9uIGlzQXJyYXkgKCB0aGluZyApIHtcbiAgICByZXR1cm4gdG9TdHJpbmcuY2FsbCggdGhpbmcgKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzQXJyYXlMaWtlICggb2JqICkge1xuICAgIHJldHVybiBhcnJheUxpa2VQYXR0ZXJuLnRlc3QoIHRvU3RyaW5nLmNhbGwoIG9iaiApICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0VxdWFsICggYSwgYiApIHtcbiAgICBpZiAoIGEgPT09IG51bGwgJiYgYiA9PT0gbnVsbCApIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgaWYgKCB0eXBlb2YgYSA9PT0gJ29iamVjdCcgfHwgdHlwZW9mIGIgPT09ICdvYmplY3QnICkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIGEgPT09IGI7XG59XG5cbi8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTgwODIvdmFsaWRhdGUtbnVtYmVycy1pbi1qYXZhc2NyaXB0LWlzbnVtZXJpY1xuZXhwb3J0IGZ1bmN0aW9uIGlzTnVtZXJpYyAoIHRoaW5nICkge1xuICAgIHJldHVybiAhaXNOYU4oIHBhcnNlRmxvYXQoIHRoaW5nICkgKSAmJiBpc0Zpbml0ZSggdGhpbmcgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzT2JqZWN0ICggdGhpbmcgKSB7XG4gICAgcmV0dXJuICggdGhpbmcgJiYgdG9TdHJpbmcuY2FsbCggdGhpbmcgKSA9PT0gJ1tvYmplY3QgT2JqZWN0XScgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzRnVuY3Rpb24oIHRoaW5nICkge1xuICAgIGNvbnN0IGdldFR5cGUgPSB7fTtcbiAgICByZXR1cm4gdGhpbmcgJiYgZ2V0VHlwZS50b1N0cmluZy5jYWxsKHRoaW5nKSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJztcbn1cbiIsIi8qIGpzaGludCBlc25leHQ6IHRydWUgKi9cbmltcG9ydCB7IGlzTnVtZXJpYyB9IGZyb20gJy4vaXMnXG5cbmxldCBpc0FuaW1hdGluZyA9IGZhbHNlO1xuXG5jb25zdCBkZWZhdWx0cyA9IHtcbiAgICBlYXNpbmc6ICdzd2luZycsXG4gICAgaGVhZGVyT2Zmc2V0OiA2MCxcbiAgICBzcGVlZDogMzAwXG59O1xuXG4vKipcbiAqIHNjcm9sbFRvIGlzIGEgZnVuY3Rpb24gdGhhdCBzY3JvbGxzIGEgY29udGFpbmVyIHRvIGFuIGVsZW1lbnQncyBwb3NpdGlvbiB3aXRoaW4gdGhhdCBjb250cm9sbGVyXG4gKiBVc2VzIGpRdWVyeSdzICQuRGVmZXJyZWQgdG8gYWxsb3cgdXNpbmcgYSBjYWxsYmFjayBvbiBhbmltYXRpb24gY29tcGxldGlvblxuICogQHBhcmFtICAge29iamVjdH0gICRlbGVtZW50ICBBIGpRdWVyeSBub2RlXG4gKiBAcGFyYW0gICB7b2JqZWN0fSAgb3B0aW9uc1xuICovXG5leHBvcnQgZnVuY3Rpb24gc2Nyb2xsVG8oJGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICBjb25zdCBkZWZlcnJlZCA9ICQuRGVmZXJyZWQoKTtcblxuICAgIC8vIERyb3AgZXZlcnl0aGluZyBpZiB0aGlzIGFpbid0IGEgalF1ZXJ5IG9iamVjdFxuICAgIGlmICgkZWxlbWVudCBpbnN0YW5jZW9mIGpRdWVyeSAmJiAkZWxlbWVudC5sZW5ndGggPiAwKSB7XG5cbiAgICAgICAgLy8gTWVyZ2luZyBvcHRpb25zXG4gICAgICAgIG9wdGlvbnMgPSAkLmV4dGVuZCh7fSwgZGVmYXVsdHMsICh0eXBlb2Ygb3B0aW9ucyAhPT0gJ3VuZGVmaW5lZCcgPyBvcHRpb25zIDoge30pKTtcblxuICAgICAgICAvLyBQcmV2ZW50cyBhY2N1bXVsYXRpb24gb2YgYW5pbWF0aW9uc1xuICAgICAgICBpZiAoaXNBbmltYXRpbmcgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBpc0FuaW1hdGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgIC8vIERlZmF1bHQgY29udGFpbmVyIHRoYXQgd2UnbGwgYmUgc2Nyb2xsaW5nXG4gICAgICAgICAgICBsZXQgJGNvbnRhaW5lciA9ICQoJ2h0bWwsIGJvZHknKTtcbiAgICAgICAgICAgIGxldCBlbGVtZW50T2Zmc2V0ID0gMDtcblxuICAgICAgICAgICAgLy8gVGVzdGluZyBjb250YWluZXIgaW4gb3B0aW9ucyBmb3IgalF1ZXJ5LW5lc3NcbiAgICAgICAgICAgIC8vIElmIHdlJ3JlIG5vdCB1c2luZyBhIGN1c3RvbSBjb250YWluZXIsIHdlIHRha2UgdGhlIHRvcCBkb2N1bWVudCBvZmZzZXRcbiAgICAgICAgICAgIC8vIElmIHdlIGFyZSwgd2UgdXNlIHRoZSBlbGVtZW50cyBwb3NpdGlvbiByZWxhdGl2ZSB0byB0aGUgY29udGFpbmVyXG4gICAgICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnMuJGNvbnRhaW5lciAhPT0gJ3VuZGVmaW5lZCcgJiYgb3B0aW9ucy4kY29udGFpbmVyIGluc3RhbmNlb2YgalF1ZXJ5ICYmIG9wdGlvbnMuJGNvbnRhaW5lci5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgJGNvbnRhaW5lciA9IG9wdGlvbnMuJGNvbnRhaW5lcjtcblxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5zY3JvbGxUb3AgIT09ICd1bmRlZmluZWQnICYmIGlzTnVtZXJpYyhvcHRpb25zLnNjcm9sbFRvcCkgJiYgb3B0aW9ucy5zY3JvbGxUb3AgIT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgc2Nyb2xsVG9wID0gb3B0aW9ucy5zY3JvbGxUb3A7XG4gICAgICAgICAgICAgICAgfSBlbHNlwqB7XG4gICAgICAgICAgICAgICAgICAgIHNjcm9sbFRvcCA9ICRlbGVtZW50LnBvc2l0aW9uKCkudG9wIC0gb3B0aW9ucy5oZWFkZXJPZmZzZXQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnMuc2Nyb2xsVG9wICE9PSAndW5kZWZpbmVkJyAmJiBpc051bWVyaWMob3B0aW9ucy5zY3JvbGxUb3ApICYmIG9wdGlvbnMuc2Nyb2xsVG9wICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHNjcm9sbFRvcCA9IG9wdGlvbnMuc2Nyb2xsVG9wO1xuICAgICAgICAgICAgICAgIH0gZWxzZcKge1xuICAgICAgICAgICAgICAgICAgICBzY3JvbGxUb3AgPSAkZWxlbWVudC5vZmZzZXQoKS50b3AgLSBvcHRpb25zLmhlYWRlck9mZnNldDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICRjb250YWluZXIuYW5pbWF0ZSh7XG4gICAgICAgICAgICAgICAgc2Nyb2xsVG9wOiBzY3JvbGxUb3BcbiAgICAgICAgICAgIH0sIG9wdGlvbnMuc3BlZWQsIG9wdGlvbnMuZWFzaW5nLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpc0FuaW1hdGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2UoKTtcbn1cbiIsIi8qIGpzaGludCBlc25leHQ6IHRydWUgKi9cbmltcG9ydCB7IGlzRnVuY3Rpb24gfSBmcm9tICcuL2lzJztcbmltcG9ydCB7IGFycmF5Q29udGFpbnMsIGZpbmRCeUtleVZhbHVlLCByZW1vdmVGcm9tQXJyYXkgfSBmcm9tICcuL2FycmF5JztcbmltcG9ydCB7ICRkb2N1bWVudCwgJHdpbmRvdywgJGh0bWwsICRib2R5IH0gZnJvbSAnLi9lbnZpcm9ubWVudCc7XG5cbmNvbnN0IENBTExCQUNLUyA9IHtcbiAgICBoaWRkZW46IFtdLFxuICAgIHZpc2libGU6IFtdXG59O1xuXG5jb25zdCBBQ1RJT05TID0gW1xuICAgICdhZGRDYWxsYmFjaycsXG4gICAgJ3JlbW92ZUNhbGxiYWNrJ1xuXTtcblxuY29uc3QgU1RBVEVTID0gW1xuICAgICd2aXNpYmxlJyxcbiAgICAnaGlkZGVuJ1xuXTtcblxuY29uc3QgUFJFRklYID0gJ3YtJztcblxubGV0IFVVSUQgPSAwO1xuXG4vLyBNYWluIGV2ZW50XG4kZG9jdW1lbnQub24oJ3Zpc2liaWxpdHljaGFuZ2UnLCBmdW5jdGlvbihldmVudCkge1xuICAgIGlmIChkb2N1bWVudC5oaWRkZW4pIHtcbiAgICAgICAgb25Eb2N1bWVudENoYW5nZSgnaGlkZGVuJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgb25Eb2N1bWVudENoYW5nZSgndmlzaWJsZScpO1xuICAgIH1cbn0pO1xuXG4vKipcbiAqIEFkZCBhIGNhbGxiYWNrXG4gKiBAcGFyYW0ge3N0cmluZ30gICBzdGF0ZVxuICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2tcbiAqIEByZXR1cm4ge3N0cmluZ30gIGlkZW50XG4gKi9cbmZ1bmN0aW9uIGFkZENhbGxiYWNrIChzdGF0ZSwgb3B0aW9ucykge1xuICAgIGxldCBjYWxsYmFjayA9IG9wdGlvbnMuY2FsbGJhY2sgfHwgJyc7XG5cbiAgICBpZiAoIWlzRnVuY3Rpb24oY2FsbGJhY2spKSB7XG4gICAgICAgIGNvbnNvbGUud2FybignQ2FsbGJhY2sgaXMgbm90IGEgZnVuY3Rpb24nKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGxldCBpZGVudCA9IFBSRUZJWCArIFVVSUQrKztcblxuICAgIENBTExCQUNLU1tzdGF0ZV0ucHVzaCh7XG4gICAgICAgIGlkZW50OiBpZGVudCxcbiAgICAgICAgY2FsbGJhY2s6IGNhbGxiYWNrXG4gICAgfSk7XG5cbiAgICByZXR1cm4gaWRlbnQ7XG59XG5cbi8qKlxuICogUmVtb3ZlIGEgY2FsbGJhY2tcbiAqIEBwYXJhbSAge3N0cmluZ30gICBzdGF0ZSAgVmlzaWJsZSBvciBoaWRkZW5cbiAqIEBwYXJhbSAge3N0cmluZ30gICBpZGVudCAgVW5pcXVlIGlkZW50aWZpZXJcbiAqIEByZXR1cm4ge2Jvb2xlYW59ICAgICAgICAgSWYgb3BlcmF0aW9uIHdhcyBhIHN1Y2Nlc3NcbiAqL1xuZnVuY3Rpb24gcmVtb3ZlQ2FsbGJhY2sgKHN0YXRlLCBvcHRpb25zKSB7XG4gICAgbGV0IGlkZW50ID0gb3B0aW9ucy5pZGVudCB8fCAnJztcblxuICAgIGlmICh0eXBlb2YoaWRlbnQpID09PSAndW5kZWZpbmVkJyB8fCBpZGVudCA9PT0gJycpIHtcbiAgICAgICAgY29uc29sZS53YXJuKCdOZWVkIGlkZW50IHRvIHJlbW92ZSBjYWxsYmFjaycpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgbGV0IGluZGV4ID0gZmluZEJ5S2V5VmFsdWUoQ0FMTEJBQ0tTW3N0YXRlXSwgJ2lkZW50JywgaWRlbnQpWzBdO1xuXG4gICAgLy8gY29uc29sZS5sb2coaWRlbnQpXG4gICAgLy8gY29uc29sZS5sb2coQ0FMTEJBQ0tTW3N0YXRlXSlcblxuICAgIGlmICh0eXBlb2YoaW5kZXgpICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICByZW1vdmVGcm9tQXJyYXkoQ0FMTEJBQ0tTW3N0YXRlXSwgaW5kZXgpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLndhcm4oJ0NhbGxiYWNrIGNvdWxkIG5vdCBiZSBmb3VuZCcpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufVxuXG4vKipcbiAqIFdoZW4gZG9jdW1lbnQgc3RhdGUgY2hhbmdlcywgdHJpZ2dlciBjYWxsYmFja3NcbiAqIEBwYXJhbSAge3N0cmluZ30gIHN0YXRlICBWaXNpYmxlIG9yIGhpZGRlblxuICovXG5mdW5jdGlvbiBvbkRvY3VtZW50Q2hhbmdlIChzdGF0ZSkge1xuICAgIGxldCBjYWxsYmFja0FycmF5ID0gQ0FMTEJBQ0tTW3N0YXRlXTtcbiAgICBsZXQgaSA9IDA7XG4gICAgbGV0IGxlbiA9IGNhbGxiYWNrQXJyYXkubGVuZ3RoO1xuXG4gICAgZm9yICg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBjYWxsYmFja0FycmF5W2ldLmNhbGxiYWNrKCk7XG4gICAgfVxufVxuXG4vKipcbiAqIFB1YmxpYyBmYWNpbmcgQVBJIGZvciBhZGRpbmcgYW5kIHJlbW92aW5nIGNhbGxiYWNrc1xuICogQHBhcmFtICAge29iamVjdH0gICAgICAgICAgIG9wdGlvbnMgIE9wdGlvbnNcbiAqIEByZXR1cm4gIHtib29sZWFufGludGVnZXJ9ICAgICAgICAgICBVbmlxdWUgaWRlbnRpZmllciBmb3IgdGhlIGNhbGxiYWNrIG9yIGJvb2xlYW4gaW5kaWNhdGluZyBzdWNjZXNzIG9yIGZhaWx1cmVcbiAqL1xuZnVuY3Rpb24gdmlzaWJpbGl0eUFwaSAob3B0aW9ucykge1xuICAgIGxldCBhY3Rpb24gPSBvcHRpb25zLmFjdGlvbiB8fCAnJztcbiAgICBsZXQgc3RhdGUgPSBvcHRpb25zLnN0YXRlIHx8ICcnO1xuICAgIGxldCByZXQ7XG5cbiAgICAvLyBUeXBlIGFuZCB2YWx1ZSBjaGVja2luZ1xuICAgIGlmICghYXJyYXlDb250YWlucyhBQ1RJT05TLCBhY3Rpb24pKSB7XG4gICAgICAgIGNvbnNvbGUud2FybignQWN0aW9uIGRvZXMgbm90IGV4aXN0Jyk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKCFhcnJheUNvbnRhaW5zKFNUQVRFUywgc3RhdGUpKSB7XG4gICAgICAgIGNvbnNvbGUud2FybignU3RhdGUgZG9lcyBub3QgZXhpc3QnKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8vIEB0b2RvIE1hZ2ljIGNhbGwgZnVuY3Rpb24gcGxzXG4gICAgaWYgKGFjdGlvbiA9PT0gJ2FkZENhbGxiYWNrJykge1xuICAgICAgICByZXQgPSBhZGRDYWxsYmFjayhzdGF0ZSwgb3B0aW9ucyk7XG4gICAgfSBlbHNlIGlmIChhY3Rpb24gPT09ICdyZW1vdmVDYWxsYmFjaycpIHtcbiAgICAgICAgcmV0ID0gcmVtb3ZlQ2FsbGJhY2soc3RhdGUsIG9wdGlvbnMpO1xuICAgIH1cblxuICAgIHJldHVybiByZXQ7XG59XG5cbmV4cG9ydCB7IHZpc2liaWxpdHlBcGkgfTtcbiJdfQ==
