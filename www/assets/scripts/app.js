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

},{"./globals":2,"./modules":3,"./utils/array":10,"./utils/environment":12,"./utils/html":13,"./utils/is":14}],2:[function(require,module,exports){
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

},{"../utils/environment":12,"./AbstractModule":4}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _environment = require('../utils/environment');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MODULE_NAME = 'Transition';
var EVENT_NAMESPACE = _environment.APP_NAME + '.' + MODULE_NAME;

var EVENT = {
    CLICK: 'click.' + EVENT_NAMESPACE,
    READYTOREMOVE: 'readyToRemove.' + EVENT_NAMESPACE,
    READYTODESTROY: 'readyToDestroy.' + EVENT_NAMESPACE
};

var _class = function () {
    function _class(options) {
        _classCallCheck(this, _class);

        this.options = options;
        this.wrapper = options.wrapper;
        this.overrideClass = options.overrideClass ? options.overrideClass : '';
        this.clickedLink = options.clickedLink;
    }

    _createClass(_class, [{
        key: 'launch',
        value: function launch() {
            if (_environment.isDebug) {
                console.log("---- Launch transition 👊 -----");
            }

            _environment.$html.removeClass('dom-is-loaded dom-is-animated ').addClass('dom-is-loading ' + this.overrideClass);
        }
    }, {
        key: 'hideView',
        value: function hideView(oldView, newView) {
            if (_environment.isDebug) {
                console.log('----- ❌ [VIEW]:hide - ', oldView.getAttribute('data-template'));
            }

            // launch it at the end (animations...)
            _environment.$document.triggerHandler({
                type: EVENT.READYTOREMOVE,
                oldView: oldView,
                newView: newView
            });
        }
    }, {
        key: 'displayView',
        value: function displayView(view) {
            var _this = this;

            if (_environment.isDebug) {
                console.log('----- ✅ [VIEW]:display :', view.getAttribute('data-template'));
            }

            _environment.$html.attr('data-template', view.getAttribute('data-template'));

            setTimeout(function () {

                _environment.$html.addClass('dom-is-loaded').removeClass('dom-is-loading');

                setTimeout(function () {
                    _environment.$html.removeClass(_this.overrideClass).addClass('dom-is-animated');
                }, 1000);

                // launch it at the end (animations...)
                _environment.$document.triggerHandler({
                    type: EVENT.READYTODESTROY
                });
            }, 1000);
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            if (_environment.isDebug) {
                console.log("---- ❌ [transition]:destroy -----");
            }
        }
    }]);

    return _class;
}();

exports.default = _class;

},{"../utils/environment":12}],7:[function(require,module,exports){
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

var MODULE_NAME = 'Transition';
var EVENT_NAMESPACE = _environment.APP_NAME + '.' + MODULE_NAME;

var EVENT = {
    CLICK: 'click.' + EVENT_NAMESPACE,
    READYTOREMOVE: 'readyToRemove.' + EVENT_NAMESPACE,
    READYTODISPLAY: 'readyToDisplay.' + EVENT_NAMESPACE,
    READYTODESTROY: 'readyToDestroy.' + EVENT_NAMESPACE
};

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

},{"../utils/environment":12,"./BaseTransition":6}],8:[function(require,module,exports){
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

var MODULE_NAME = 'Transition';
var EVENT_NAMESPACE = _environment.APP_NAME + '.' + MODULE_NAME;

var EVENT = {
    CLICK: 'click.' + EVENT_NAMESPACE,
    READYTOREMOVE: 'readyToRemove.' + EVENT_NAMESPACE,
    READYTODESTROY: 'readyToDestroy.' + EVENT_NAMESPACE
};

/*

@todo : 

- ✅ get data-transition on clicked link -> launch() and add switch(){}
- ❌ add goto listener
- ❌ add newPageReady functon with google analytics send (maybe pjax do that?)
- ✅ add overrideClass system for all transitions
- ✅ add base class manager like old DefaultTransition (dom-is-loaded, dom-is-loading etc..)



======= SCHEMA =======

[] : listener
* : trigger event

[pjax:send] -> (transition) launch()

[pjax:switch] (= new view is loaded) -> (transition) hideView()-> hide animations & *readyToRemove

[readyToRemove] -> remove() -> delete modules
                            -> remove oldView from the DOM, and innerHTMl newView
                            -> display()

display() -> (transition) displayView() -> display animations & *readyToRemove
          -> init new modules

[readyToRemove] -> reinit()

*/

var _class = function () {
    function _class() {
        var _this = this;

        _classCallCheck(this, _class);

        // jQuery ondomready
        $(function () {
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
            elements: ['a:not(.' + this.noPjaxRequestClass + ')', 'form[action]'],
            selectors: ['title', '' + this.containerClass],
            switches: {}
        };
        this.options.switches[this.containerClass] = function (oldEl, newEl, options) {
            return _this.switch(oldEl, newEl, options);
        };
        this.pjax = new Pjax(this.options);

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
    }

    /**
     * (PJAX) Launch when pjax receive a request
     * get & manage data-transition,init and launch it
     * @param  {event}
     * @return void
     */


    _createClass(_class, [{
        key: 'send',
        value: function send(e) {
            if (_environment.isDebug) {
                console.log("---- Launch request 🙌 -----");
            }

            var el = e.triggerElement;

            var transition = el.getAttribute('data-transition') ? el.getAttribute('data-transition') : 'BaseTransition';
            _environment.$html.attr('data-transition', transition);

            // options available : wrapper, overrideClass
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
        key: 'switch',
        value: function _switch(oldView, newView, options) {
            if (_environment.isDebug) {
                console.log('---- Next view loaded 👌 -----');
            }
            this.transition.hideView(oldView, newView);

            this.pjax.onSwitch();
        }

        /**
         * Launch when you trigger EVENT.READYTOREMOVE in your transition -> hideView(), at the end
         * after oldView hidden, delete modules and launch this.display()
         * @param  {js dom element}, 
         * @param  {js dom element}
         * @return void
         */

    }, {
        key: 'remove',
        value: function remove(oldView, newView) {

            _environment.$document.triggerHandler({
                type: _App.EVENT.DELETE_SCOPED_MODULES,
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
        key: 'display',
        value: function display(view) {
            this.wrapper.innerHTML = view.outerHTML;

            // Fetch any inline script elements.
            var scripts = view.querySelectorAll('script.js-inline');

            if (scripts instanceof window.NodeList) {
                var i = 0;
                var len = scripts.length;
                for (; i < len; i++) {
                    eval(scripts[i].innerHTML);
                }
            }

            _environment.$document.triggerHandler({
                type: _App.EVENT.INIT_SCOPED_MODULES,
                isPjax: true
            });

            this.transition.displayView(view);
        }

        /**
         * Launch when you trigger EVENT.READYTODESTROY in your transition -> displayView(), at the end
         * @return void
         */

    }, {
        key: 'reinit',
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

},{"../App":1,"../utils/environment":12,"./transitions":9}],9:[function(require,module,exports){
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

},{"./BaseTransition":6,"./CustomTransition":7}],10:[function(require,module,exports){
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

},{"./is":14}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){
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

},{}],15:[function(require,module,exports){
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

},{"./is":14}],16:[function(require,module,exports){
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

},{"./array":10,"./environment":12,"./is":14}]},{},[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHMvc2NyaXB0cy9BcHAuanMiLCJhc3NldHMvc2NyaXB0cy9nbG9iYWxzLmpzIiwiYXNzZXRzL3NjcmlwdHMvbW9kdWxlcy5qcyIsImFzc2V0cy9zY3JpcHRzL21vZHVsZXMvQWJzdHJhY3RNb2R1bGUuanMiLCJhc3NldHMvc2NyaXB0cy9tb2R1bGVzL0V4YW1wbGUuanMiLCJhc3NldHMvc2NyaXB0cy90cmFuc2l0aW9ucy9CYXNlVHJhbnNpdGlvbi5qcyIsImFzc2V0cy9zY3JpcHRzL3RyYW5zaXRpb25zL0N1c3RvbVRyYW5zaXRpb24uanMiLCJhc3NldHMvc2NyaXB0cy90cmFuc2l0aW9ucy9UcmFuc2l0aW9uTWFuYWdlci5qcyIsImFzc2V0cy9zY3JpcHRzL3RyYW5zaXRpb25zL3RyYW5zaXRpb25zLmpzIiwiYXNzZXRzL3NjcmlwdHMvdXRpbHMvYXJyYXkuanMiLCJhc3NldHMvc2NyaXB0cy91dGlscy9kZWJvdW5jZS5qcyIsImFzc2V0cy9zY3JpcHRzL3V0aWxzL2Vudmlyb25tZW50LmpzIiwiYXNzZXRzL3NjcmlwdHMvdXRpbHMvaHRtbC5qcyIsImFzc2V0cy9zY3JpcHRzL3V0aWxzL2lzLmpzIiwiYXNzZXRzL3NjcmlwdHMvdXRpbHMvc2Nyb2xsVG8uanMiLCJhc3NldHMvc2NyaXB0cy91dGlscy92aXNpYmlsaXR5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7OztxakJDQUE7OztBQVNBOzs7QUFSQTs7QUFFQTs7OztBQUVBOztBQUNBOztBQUNBOztBQUdBOztJQUFZLE87Ozs7Ozs7O0FBRVosSUFBTSxjQUFjLEtBQXBCO0FBQ0EsSUFBTSxnREFBaUMsV0FBdkM7O0FBRU8sSUFBTSx3QkFBUTtBQUNqQixtQ0FBNkIsZUFEWjtBQUVqQixnREFBMEMsZUFGekI7QUFHakIsb0RBQThDO0FBSDdCLENBQWQ7O0lBTUQsRztBQUNGLG1CQUFjO0FBQUE7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QUFjLENBQWQsRUFBaUIsUUFBakI7QUFDSDtBQUNKOztBQUVEOzs7OztBQUtBLFNBQVMsYUFBVCxDQUF3QixPQUF4QixFQUFpQztBQUM3QixRQUFJLFNBQVMsUUFBUSxNQUFSLElBQWtCLEVBQS9CO0FBQ0EsUUFBSSxRQUFRLFFBQVEsS0FBUixJQUFpQixFQUE3QjtBQUNBLFFBQUksWUFBSjs7QUFFQTtBQUNBLFFBQUksQ0FBQywwQkFBYyxPQUFkLEVBQXVCLE1BQXZCLENBQUwsRUFBcUM7QUFDakMsZ0JBQVEsSUFBUixDQUFhLHVCQUFiO0FBQ0EsZUFBTyxLQUFQO0FBQ0g7QUFDRCxRQUFJLENBQUMsMEJBQWMsTUFBZCxFQUFzQixLQUF0QixDQUFMLEVBQW1DO0FBQy9CLGdCQUFRLElBQVIsQ0FBYSxzQkFBYjtBQUNBLGVBQU8sS0FBUDtBQUNIOztBQUVEO0FBQ0EsUUFBSSxXQUFXLGFBQWYsRUFBOEI7QUFDMUIsY0FBTSxZQUFZLEtBQVosRUFBbUIsT0FBbkIsQ0FBTjtBQUNILEtBRkQsTUFFTyxJQUFJLFdBQVcsZ0JBQWYsRUFBaUM7QUFDcEMsY0FBTSxlQUFlLEtBQWYsRUFBc0IsT0FBdEIsQ0FBTjtBQUNIOztBQUVELFdBQU8sR0FBUDtBQUNIOztRQUVRLGEsR0FBQSxhIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIGpzaGludCBlc25leHQ6IHRydWUgKi9cbmltcG9ydCB7IEFQUF9OQU1FLCAkZG9jdW1lbnQsICRwamF4V3JhcHBlciB9IGZyb20gJy4vdXRpbHMvZW52aXJvbm1lbnQnO1xuXG5pbXBvcnQgZ2xvYmFscyBmcm9tICcuL2dsb2JhbHMnO1xuXG5pbXBvcnQgeyBhcnJheUNvbnRhaW5zLCByZW1vdmVGcm9tQXJyYXkgfSBmcm9tICcuL3V0aWxzL2FycmF5JztcbmltcG9ydCB7IGdldE5vZGVEYXRhIH0gZnJvbSAnLi91dGlscy9odG1sJztcbmltcG9ydCB7IGlzRnVuY3Rpb24gfSBmcm9tICcuL3V0aWxzL2lzJztcblxuLy8gQmFzaWMgbW9kdWxlc1xuaW1wb3J0ICogYXMgbW9kdWxlcyBmcm9tICcuL21vZHVsZXMnO1xuXG5jb25zdCBNT0RVTEVfTkFNRSA9ICdBcHAnO1xuY29uc3QgRVZFTlRfTkFNRVNQQUNFID0gYCR7QVBQX05BTUV9LiR7TU9EVUxFX05BTUV9YDtcblxuZXhwb3J0IGNvbnN0IEVWRU5UID0ge1xuICAgIElOSVRfTU9EVUxFUzogYGluaXRNb2R1bGVzLiR7RVZFTlRfTkFNRVNQQUNFfWAsXG4gICAgSU5JVF9TQ09QRURfTU9EVUxFUzogYGluaXRTY29wZWRNb2R1bGVzLiR7RVZFTlRfTkFNRVNQQUNFfWAsXG4gICAgREVMRVRFX1NDT1BFRF9NT0RVTEVTOiBgZGVsZXRlU2NvcGVkTW9kdWxlcy4ke0VWRU5UX05BTUVTUEFDRX1gXG59O1xuXG5jbGFzcyBBcHAge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLm1vZHVsZXMgPSBtb2R1bGVzO1xuICAgICAgICB0aGlzLmN1cnJlbnRNb2R1bGVzID0gW107XG5cbiAgICAgICAgJGRvY3VtZW50Lm9uKEVWRU5ULklOSVRfTU9EVUxFUywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICB0aGlzLmluaXRHbG9iYWxzKGV2ZW50LmZpcnN0Qmxvb2QpXG4gICAgICAgICAgICAgICAgLmRlbGV0ZU1vZHVsZXMoZXZlbnQpXG4gICAgICAgICAgICAgICAgLmluaXRNb2R1bGVzKGV2ZW50KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJGRvY3VtZW50Lm9uKEVWRU5ULklOSVRfU0NPUEVEX01PRFVMRVMsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5pbml0TW9kdWxlcyhldmVudCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRkb2N1bWVudC5vbihFVkVOVC5ERUxFVEVfU0NPUEVEX01PRFVMRVMsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5kZWxldGVNb2R1bGVzKGV2ZW50KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRGVzdHJveSBhbGwgZXhpc3RpbmcgbW9kdWxlcyBvciBhIHNwZWNpZmljIHNjb3BlIG9mIG1vZHVsZXNcbiAgICAgKiBAcGFyYW0gIHtPYmplY3R9IGV2ZW50IFRoZSBldmVudCBiZWluZyB0cmlnZ2VyZWQuXG4gICAgICogQHJldHVybiB7T2JqZWN0fSAgICAgICBTZWxmIChhbGxvd3MgY2hhaW5pbmcpXG4gICAgICovXG4gICAgZGVsZXRlTW9kdWxlcyhldmVudCkge1xuICAgICAgICBsZXQgZGVzdHJveUFsbCA9IHRydWU7XG4gICAgICAgIGxldCBtb2R1bGVJZHMgPSBbXTtcblxuICAgICAgICAvLyBDaGVjayBmb3Igc2NvcGUgZmlyc3RcbiAgICAgICAgaWYgKGV2ZW50LiRzY29wZSBpbnN0YW5jZW9mIGpRdWVyeSAmJiBldmVudC4kc2NvcGUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgLy8gTW9kdWxlcyB3aXRoaW4gc2NvcGVcbiAgICAgICAgICAgIGNvbnN0ICRtb2R1bGVzID0gZXZlbnQuJHNjb3BlLmZpbmQoJ1tkYXRhLW1vZHVsZV0nKTtcblxuICAgICAgICAgICAgLy8gRGV0ZXJtaW5lIHRoZWlyIHVpZHNcbiAgICAgICAgICAgIG1vZHVsZUlkcyA9ICQubWFrZUFycmF5KCRtb2R1bGVzLm1hcChmdW5jdGlvbihpbmRleCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAkbW9kdWxlcy5lcShpbmRleCkuZGF0YSgndWlkJyk7XG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIGlmIChtb2R1bGVJZHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGRlc3Ryb3lBbGwgPSBmYWxzZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBMb29wIG1vZHVsZXMgYW5kIGRlc3Ryb3lpbmcgYWxsIG9mIHRoZW0sIG9yIHNwZWNpZmljIG9uZXNcbiAgICAgICAgbGV0IGkgPSB0aGlzLmN1cnJlbnRNb2R1bGVzLmxlbmd0aDtcblxuICAgICAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgICAgICBpZiAoZGVzdHJveUFsbCB8fCBhcnJheUNvbnRhaW5zKG1vZHVsZUlkcywgdGhpcy5jdXJyZW50TW9kdWxlc1tpXS51aWQpKSB7XG4gICAgICAgICAgICAgICAgcmVtb3ZlRnJvbUFycmF5KG1vZHVsZUlkcywgdGhpcy5jdXJyZW50TW9kdWxlc1tpXS51aWQpO1xuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudE1vZHVsZXNbaV0uZGVzdHJveSgpO1xuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudE1vZHVsZXMuc3BsaWNlKGkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXhlY3V0ZSBnbG9iYWwgZnVuY3Rpb25zIGFuZCBzZXR0aW5nc1xuICAgICAqIEFsbG93cyB5b3UgdG8gaW5pdGlhbGl6ZSBnbG9iYWwgbW9kdWxlcyBvbmx5IG9uY2UgaWYgeW91IG5lZWRcbiAgICAgKiAoZXguOiB3aGVuIHVzaW5nIEJhcmJhLmpzIG9yIFNtb290aFN0YXRlLmpzKVxuICAgICAqIEByZXR1cm4ge09iamVjdH0gU2VsZiAoYWxsb3dzIGNoYWluaW5nKVxuICAgICAqL1xuICAgIGluaXRHbG9iYWxzKGZpcnN0Qmxvb2QpIHtcbiAgICAgICAgZ2xvYmFscyhmaXJzdEJsb29kKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRmluZCBtb2R1bGVzIGFuZCBpbml0aWFsaXplIHRoZW1cbiAgICAgKiBAcGFyYW0gIHtPYmplY3R9IGV2ZW50IFRoZSBldmVudCBiZWluZyB0cmlnZ2VyZWQuXG4gICAgICogQHJldHVybiB7T2JqZWN0fSAgICAgICBTZWxmIChhbGxvd3MgY2hhaW5pbmcpXG4gICAgICovXG4gICAgaW5pdE1vZHVsZXMoZXZlbnQpIHtcbiAgICAgICAgLy8gRWxlbWVudHMgd2l0aCBtb2R1bGVcbiAgICAgICAgbGV0ICRtb2R1bGVFbHMgPSBbXTtcblxuICAgICAgICAvLyBJZiBmaXJzdCBibG9vZCwgbG9hZCBhbGwgbW9kdWxlcyBpbiB0aGUgRE9NXG4gICAgICAgIC8vIElmIHNjb3BlZCwgcmVuZGVyIGVsZW1lbnRzIHdpdGggbW9kdWxlc1xuICAgICAgICAvLyBJZiBCYXJiYSwgbG9hZCBtb2R1bGVzIGNvbnRhaW5lZCBpbiBCYXJiYSBjb250YWluZXJcbiAgICAgICAgaWYgKGV2ZW50LmZpcnN0Qmxvb2QpIHtcbiAgICAgICAgICAgICRtb2R1bGVFbHMgPSAkZG9jdW1lbnQuZmluZCgnW2RhdGEtbW9kdWxlXScpO1xuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50LiRzY29wZSBpbnN0YW5jZW9mIGpRdWVyeSAmJiBldmVudC4kc2NvcGUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgJG1vZHVsZUVscyA9IGV2ZW50LiRzY29wZS5maW5kKCdbZGF0YS1tb2R1bGVdJyk7XG4gICAgICAgIH0gZWxzZSBpZiAoZXZlbnQuaXNQamF4KSB7XG4gICAgICAgICAgICAkbW9kdWxlRWxzID0gJHBqYXhXcmFwcGVyLmZpbmQoJ1tkYXRhLW1vZHVsZV0nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIExvb3AgdGhyb3VnaCBlbGVtZW50c1xuICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgIGNvbnN0IGVsc0xlbiA9ICRtb2R1bGVFbHMubGVuZ3RoO1xuXG4gICAgICAgIGZvciAoOyBpIDwgZWxzTGVuOyBpKyspIHtcblxuICAgICAgICAgICAgLy8gQ3VycmVudCBlbGVtZW50XG4gICAgICAgICAgICBsZXQgZWwgPSAkbW9kdWxlRWxzW2ldO1xuXG4gICAgICAgICAgICAvLyBBbGwgZGF0YS0gYXR0cmlidXRlcyBjb25zaWRlcmVkIGFzIG9wdGlvbnNcbiAgICAgICAgICAgIGxldCBvcHRpb25zID0gZ2V0Tm9kZURhdGEoZWwpO1xuXG4gICAgICAgICAgICAvLyBBZGQgY3VycmVudCBET00gZWxlbWVudCBhbmQgalF1ZXJ5IGVsZW1lbnRcbiAgICAgICAgICAgIG9wdGlvbnMuZWwgPSBlbDtcbiAgICAgICAgICAgIG9wdGlvbnMuJGVsID0gJG1vZHVsZUVscy5lcShpKTtcblxuICAgICAgICAgICAgLy8gTW9kdWxlIGRvZXMgZXhpc3QgYXQgdGhpcyBwb2ludFxuICAgICAgICAgICAgbGV0IGF0dHIgPSBvcHRpb25zLm1vZHVsZTtcblxuICAgICAgICAgICAgLy8gU3BsaXR0aW5nIG1vZHVsZXMgZm91bmQgaW4gdGhlIGRhdGEtYXR0cmlidXRlXG4gICAgICAgICAgICBsZXQgbW9kdWxlSWRlbnRzID0gYXR0ci5zcGxpdCgvWyxcXHNdKy9nKTtcblxuICAgICAgICAgICAgLy8gTG9vcCBtb2R1bGVzXG4gICAgICAgICAgICBsZXQgaiA9IDA7XG4gICAgICAgICAgICBsZXQgbW9kdWxlc0xlbiA9IG1vZHVsZUlkZW50cy5sZW5ndGg7XG5cbiAgICAgICAgICAgIGZvciAoOyBqIDwgbW9kdWxlc0xlbjsgaisrKSB7XG4gICAgICAgICAgICAgICAgbGV0IG1vZHVsZUF0dHIgPSBtb2R1bGVJZGVudHNbal07XG5cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHRoaXMubW9kdWxlc1ttb2R1bGVBdHRyXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgbW9kdWxlID0gbmV3IHRoaXMubW9kdWxlc1ttb2R1bGVBdHRyXShvcHRpb25zKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50TW9kdWxlcy5wdXNoKG1vZHVsZSk7XG4gICAgICAgICAgICAgICAgICAgIG1vZHVsZS5pbml0KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufVxuXG4vLyBJSUZFIGZvciBsb2FkaW5nIHRoZSBhcHBsaWNhdGlvblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbihmdW5jdGlvbigpIHtcbiAgICBuZXcgQXBwKCk7XG4gICAgJGRvY3VtZW50LnRyaWdnZXJIYW5kbGVyKHtcbiAgICAgICAgdHlwZTogRVZFTlQuSU5JVF9NT0RVTEVTLFxuICAgICAgICBmaXJzdEJsb29kOiB0cnVlXG4gICAgfSk7XG59KSgpO1xuIiwiLyoganNoaW50IGVzbmV4dDogdHJ1ZSAqL1xuaW1wb3J0IFRyYW5zaXRpb25NYW5hZ2VyIGZyb20gJy4vdHJhbnNpdGlvbnMvVHJhbnNpdGlvbk1hbmFnZXInO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihmaXJzdEJsb29kKSB7XG4gICAgc3ZnNGV2ZXJ5Ym9keSgpO1xuXG4gICAgaWYgKGZpcnN0Qmxvb2QpIHtcbiAgICAgICAgY29uc3QgdHJhbnNpdGlvbk1hbmFnZXIgPSBuZXcgVHJhbnNpdGlvbk1hbmFnZXIoKTtcbiAgICB9XG59XG4iLCIvKiBqc2hpbnQgZXNuZXh0OiB0cnVlICovXG5leHBvcnQge2RlZmF1bHQgYXMgRXhhbXBsZX0gZnJvbSAnLi9tb2R1bGVzL0V4YW1wbGUnO1xuIiwiLyoganNoaW50IGVzbmV4dDogdHJ1ZSAqL1xubGV0IHVpZCA9IDA7XG5cbi8qKlxuICogQWJzdHJhY3QgTW9kdWxlXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIHtcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgICAgIHRoaXMuJGVsID0gb3B0aW9ucy4kZWwgfHwgbnVsbDtcbiAgICAgICAgdGhpcy5lbCAgPSBvcHRpb25zLmVsICB8fCBudWxsO1xuXG4gICAgICAgIC8vIEdlbmVyYXRlIGEgdW5pcXVlIG1vZHVsZSBpZGVudGlmaWVyXG4gICAgICAgIHRoaXMudWlkID0gJ20tJyArIHVpZCsrO1xuICAgICAgICAvLyBVc2UgalF1ZXJ5J3MgZGF0YSBBUEkgdG8gXCJzdG9yZSBpdCBpbiB0aGUgRE9NXCJcbiAgICAgICAgdGhpcy4kZWwuZGF0YSgndWlkJywgdGhpcy51aWQpO1xuICAgIH1cblxuICAgIGluaXQoKSB7fVxuXG4gICAgZGVzdHJveSgpIHtcbiAgICAgICAgaWYgKHRoaXMuJGVsKSB7XG4gICAgICAgICAgICB0aGlzLiRlbC5yZW1vdmVEYXRhKCd1aWQnKVxuICAgICAgICB9XG4gICAgfVxufVxuIiwiLyoganNoaW50IGVzbmV4dDogdHJ1ZSAqL1xuaW1wb3J0IHsgQVBQX05BTUUgfSBmcm9tICcuLi91dGlscy9lbnZpcm9ubWVudCc7XG5pbXBvcnQgQWJzdHJhY3RNb2R1bGUgZnJvbSAnLi9BYnN0cmFjdE1vZHVsZSc7XG5cbmNvbnN0IE1PRFVMRV9OQU1FID0gJ0V4YW1wbGUnO1xuY29uc3QgRVZFTlRfTkFNRVNQQUNFID0gYCR7QVBQX05BTUV9LiR7TU9EVUxFX05BTUV9YDtcblxuY29uc3QgRVZFTlQgPSB7XG4gICAgQ0xJQ0s6IGBjbGljay4ke0VWRU5UX05BTUVTUEFDRX1gXG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBleHRlbmRzIEFic3RyYWN0TW9kdWxlIHtcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgICAgIHN1cGVyKG9wdGlvbnMpO1xuXG4gICAgICAgIC8vIERlY2xhcmF0aW9uIG9mIHByb3BlcnRpZXNcbiAgICAgICAgY29uc29sZS5sb2coJ/CflKggW21vZHVsZV06Y29uc3RydWN0b3IgLSBFeGFtcGxlJyk7XG5cbiAgICB9XG5cbiAgICBpbml0KCkge1xuICAgICAgICAvLyBTZXQgZXZlbnRzIGFuZCBzdWNoXG5cbiAgICB9XG5cbiAgICBkZXN0cm95KCkge1xuICAgICAgICBjb25zb2xlLmxvZygn4p2MIFttb2R1bGVdOmRlc3Ryb3kgLSBFeGFtcGxlJyk7XG4gICAgICAgIHN1cGVyLmRlc3Ryb3koKTtcbiAgICAgICAgdGhpcy4kZWwub2ZmKGAuJHtFVkVOVF9OQU1FU1BBQ0V9YCk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgQVBQX05BTUUsICRkb2N1bWVudCwgJGh0bWwsICRib2R5LCAgaXNEZWJ1ZywgJHBqYXhXcmFwcGVyIH0gZnJvbSAnLi4vdXRpbHMvZW52aXJvbm1lbnQnO1xuXG5jb25zdCBNT0RVTEVfTkFNRSA9ICdUcmFuc2l0aW9uJztcbmNvbnN0IEVWRU5UX05BTUVTUEFDRSA9IGAke0FQUF9OQU1FfS4ke01PRFVMRV9OQU1FfWA7XG5cbmNvbnN0IEVWRU5UID0ge1xuICAgIENMSUNLOiBgY2xpY2suJHtFVkVOVF9OQU1FU1BBQ0V9YCxcbiAgICBSRUFEWVRPUkVNT1ZFOiBgcmVhZHlUb1JlbW92ZS4ke0VWRU5UX05BTUVTUEFDRX1gLFxuICAgIFJFQURZVE9ERVNUUk9ZOiBgcmVhZHlUb0Rlc3Ryb3kuJHtFVkVOVF9OQU1FU1BBQ0V9YFxufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3Mge1xuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcblxuICAgICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgICAgICB0aGlzLndyYXBwZXIgPSBvcHRpb25zLndyYXBwZXI7XG4gICAgICAgIHRoaXMub3ZlcnJpZGVDbGFzcyA9IG9wdGlvbnMub3ZlcnJpZGVDbGFzcyA/IG9wdGlvbnMub3ZlcnJpZGVDbGFzcyA6ICcnO1xuICAgICAgICB0aGlzLmNsaWNrZWRMaW5rID0gb3B0aW9ucy5jbGlja2VkTGluaztcblxuICAgIH1cblxuICAgIGxhdW5jaCgpIHtcbiAgICAgICAgaWYoaXNEZWJ1Zykge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCItLS0tIExhdW5jaCB0cmFuc2l0aW9uIPCfkYogLS0tLS1cIik7XG4gICAgICAgIH1cblxuICAgICAgICAkaHRtbFxuICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdkb20taXMtbG9hZGVkIGRvbS1pcy1hbmltYXRlZCAnKVxuICAgICAgICAgICAgLmFkZENsYXNzKGBkb20taXMtbG9hZGluZyAke3RoaXMub3ZlcnJpZGVDbGFzc31gKTtcblxuICAgIH1cblxuICAgIGhpZGVWaWV3KG9sZFZpZXcsIG5ld1ZpZXcpIHtcbiAgICAgICAgaWYoaXNEZWJ1Zykge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJy0tLS0tIOKdjCBbVklFV106aGlkZSAtICcsIG9sZFZpZXcuZ2V0QXR0cmlidXRlKCdkYXRhLXRlbXBsYXRlJykpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gbGF1bmNoIGl0IGF0IHRoZSBlbmQgKGFuaW1hdGlvbnMuLi4pXG4gICAgICAgICRkb2N1bWVudC50cmlnZ2VySGFuZGxlcih7XG4gICAgICAgICAgICB0eXBlOkVWRU5ULlJFQURZVE9SRU1PVkUsXG4gICAgICAgICAgICBvbGRWaWV3OiBvbGRWaWV3LFxuICAgICAgICAgICAgbmV3VmlldzogbmV3Vmlld1xuICAgICAgICB9KTtcblxuICAgIH1cblxuXG4gICAgZGlzcGxheVZpZXcodmlldykge1xuXG4gICAgICAgIGlmKGlzRGVidWcpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCctLS0tLSDinIUgW1ZJRVddOmRpc3BsYXkgOicsIHZpZXcuZ2V0QXR0cmlidXRlKCdkYXRhLXRlbXBsYXRlJykpO1xuICAgICAgICB9XG5cbiAgICAgICAgJGh0bWwuYXR0cignZGF0YS10ZW1wbGF0ZScsIHZpZXcuZ2V0QXR0cmlidXRlKCdkYXRhLXRlbXBsYXRlJykpO1xuXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgJGh0bWxcbiAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoJ2RvbS1pcy1sb2FkZWQnKVxuICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnZG9tLWlzLWxvYWRpbmcnKTtcblxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgJGh0bWxcbiAgICAgICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKHRoaXMub3ZlcnJpZGVDbGFzcylcbiAgICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKCdkb20taXMtYW5pbWF0ZWQnKTtcbiAgICAgICAgICAgIH0sIDEwMDApO1xuXG4gICAgICAgICAgICAvLyBsYXVuY2ggaXQgYXQgdGhlIGVuZCAoYW5pbWF0aW9ucy4uLilcbiAgICAgICAgICAgICRkb2N1bWVudC50cmlnZ2VySGFuZGxlcih7XG4gICAgICAgICAgICAgICAgdHlwZTpFVkVOVC5SRUFEWVRPREVTVFJPWVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfSwxMDAwKTtcbiAgICB9XG5cbiAgICBcbiAgICBkZXN0cm95KCkge1xuICAgICAgICBpZihpc0RlYnVnKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIi0tLS0g4p2MIFt0cmFuc2l0aW9uXTpkZXN0cm95IC0tLS0tXCIpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgQVBQX05BTUUsICRkb2N1bWVudCwgJGh0bWwsIGlzRGVidWcsICRwamF4V3JhcHBlciB9IGZyb20gJy4uL3V0aWxzL2Vudmlyb25tZW50JztcbmltcG9ydCBCYXNlVHJhbnNpdGlvbiBmcm9tICcuL0Jhc2VUcmFuc2l0aW9uJztcblxuY29uc3QgTU9EVUxFX05BTUUgPSAnVHJhbnNpdGlvbic7XG5jb25zdCBFVkVOVF9OQU1FU1BBQ0UgPSBgJHtBUFBfTkFNRX0uJHtNT0RVTEVfTkFNRX1gO1xuXG5jb25zdCBFVkVOVCA9IHtcbiAgICBDTElDSzogYGNsaWNrLiR7RVZFTlRfTkFNRVNQQUNFfWAsXG4gICAgUkVBRFlUT1JFTU9WRTogYHJlYWR5VG9SZW1vdmUuJHtFVkVOVF9OQU1FU1BBQ0V9YCxcbiAgICBSRUFEWVRPRElTUExBWTogYHJlYWR5VG9EaXNwbGF5LiR7RVZFTlRfTkFNRVNQQUNFfWAsXG4gICAgUkVBRFlUT0RFU1RST1k6IGByZWFkeVRvRGVzdHJveS4ke0VWRU5UX05BTUVTUEFDRX1gXG59O1xuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIGV4dGVuZHMgQmFzZVRyYW5zaXRpb257XG4gICAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgICAgICBzdXBlcihvcHRpb25zKTtcblxuICAgICAgICB0aGlzLm92ZXJyaWRlQ2xhc3MgPSAnLWN1c3RvbS10cmFuc2l0aW9uJztcbiAgICB9XG5cbn1cbiIsIi8qIGpzaGludCBlc25leHQ6IHRydWUgKi9cbmltcG9ydCB7IEFQUF9OQU1FLCAkZG9jdW1lbnQsICRodG1sLCBpc0RlYnVnLCAkcGpheFdyYXBwZXIgfSBmcm9tICcuLi91dGlscy9lbnZpcm9ubWVudCc7XG5pbXBvcnQgeyBFVkVOVCBhcyBBUFBfRVZFTlQgfSBmcm9tICcuLi9BcHAnO1xuXG4vL0xpc3QgaGVyZSBhbGwgb2YgeW91ciB0cmFuc2l0aW9uc1xuaW1wb3J0ICogYXMgdHJhbnNpdGlvbnMgZnJvbSAnLi90cmFuc2l0aW9ucyc7XG5cbmNvbnN0IE1PRFVMRV9OQU1FID0gJ1RyYW5zaXRpb24nO1xuY29uc3QgRVZFTlRfTkFNRVNQQUNFID0gYCR7QVBQX05BTUV9LiR7TU9EVUxFX05BTUV9YDtcblxuY29uc3QgRVZFTlQgPSB7XG4gICAgQ0xJQ0s6IGBjbGljay4ke0VWRU5UX05BTUVTUEFDRX1gLFxuICAgIFJFQURZVE9SRU1PVkU6IGByZWFkeVRvUmVtb3ZlLiR7RVZFTlRfTkFNRVNQQUNFfWAsXG4gICAgUkVBRFlUT0RFU1RST1k6IGByZWFkeVRvRGVzdHJveS4ke0VWRU5UX05BTUVTUEFDRX1gXG59O1xuXG4vKlxuXG5AdG9kbyA6IFxuXG4tIOKchSBnZXQgZGF0YS10cmFuc2l0aW9uIG9uIGNsaWNrZWQgbGluayAtPiBsYXVuY2goKSBhbmQgYWRkIHN3aXRjaCgpe31cbi0g4p2MIGFkZCBnb3RvIGxpc3RlbmVyXG4tIOKdjCBhZGQgbmV3UGFnZVJlYWR5IGZ1bmN0b24gd2l0aCBnb29nbGUgYW5hbHl0aWNzIHNlbmQgKG1heWJlIHBqYXggZG8gdGhhdD8pXG4tIOKchSBhZGQgb3ZlcnJpZGVDbGFzcyBzeXN0ZW0gZm9yIGFsbCB0cmFuc2l0aW9uc1xuLSDinIUgYWRkIGJhc2UgY2xhc3MgbWFuYWdlciBsaWtlIG9sZCBEZWZhdWx0VHJhbnNpdGlvbiAoZG9tLWlzLWxvYWRlZCwgZG9tLWlzLWxvYWRpbmcgZXRjLi4pXG5cblxuXG49PT09PT09IFNDSEVNQSA9PT09PT09XG5cbltdIDogbGlzdGVuZXJcbiogOiB0cmlnZ2VyIGV2ZW50XG5cbltwamF4OnNlbmRdIC0+ICh0cmFuc2l0aW9uKSBsYXVuY2goKVxuXG5bcGpheDpzd2l0Y2hdICg9IG5ldyB2aWV3IGlzIGxvYWRlZCkgLT4gKHRyYW5zaXRpb24pIGhpZGVWaWV3KCktPiBoaWRlIGFuaW1hdGlvbnMgJiAqcmVhZHlUb1JlbW92ZVxuXG5bcmVhZHlUb1JlbW92ZV0gLT4gcmVtb3ZlKCkgLT4gZGVsZXRlIG1vZHVsZXNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAtPiByZW1vdmUgb2xkVmlldyBmcm9tIHRoZSBET00sIGFuZCBpbm5lckhUTWwgbmV3Vmlld1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0+IGRpc3BsYXkoKVxuXG5kaXNwbGF5KCkgLT4gKHRyYW5zaXRpb24pIGRpc3BsYXlWaWV3KCkgLT4gZGlzcGxheSBhbmltYXRpb25zICYgKnJlYWR5VG9SZW1vdmVcbiAgICAgICAgICAtPiBpbml0IG5ldyBtb2R1bGVzXG5cbltyZWFkeVRvUmVtb3ZlXSAtPiByZWluaXQoKVxuXG4qL1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIFxuXG4gICAgICAgIC8vIGpRdWVyeSBvbmRvbXJlYWR5XG4gICAgICAgICQoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5sb2FkKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMudHJhbnNpdGlvbiA9IG5ldyB0cmFuc2l0aW9uc1snQmFzZVRyYW5zaXRpb24nXSh7XG4gICAgICAgICAgICB3cmFwcGVyOiB0aGlzLndyYXBwZXJcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLypcbiAgICAgICAgPT09PT0gUEpBWCBDT05GSUdVUkFUSU9OID09PT09XG4gICAgICAgICovXG5cbiAgICAgICAgdGhpcy5jb250YWluZXJDbGFzcyA9ICcuanMtcGpheC1jb250YWluZXInO1xuICAgICAgICB0aGlzLndyYXBwZXJJZCA9ICdqcy1wamF4LXdyYXBwZXInO1xuICAgICAgICB0aGlzLm5vUGpheFJlcXVlc3RDbGFzcyA9ICduby10cmFuc2l0aW9uJztcbiAgICAgICAgdGhpcy53cmFwcGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy53cmFwcGVySWQpO1xuXG4gICAgICAgIHRoaXMub3B0aW9ucyA9IHtcbiAgICAgICAgICAgIGRlYnVnOiBmYWxzZSxcbiAgICAgICAgICAgIGNhY2hlQnVzdDogZmFsc2UsXG4gICAgICAgICAgICBlbGVtZW50czogW2BhOm5vdCguJHt0aGlzLm5vUGpheFJlcXVlc3RDbGFzc30pYCwnZm9ybVthY3Rpb25dJ10sXG4gICAgICAgICAgICBzZWxlY3RvcnM6IFsndGl0bGUnLGAke3RoaXMuY29udGFpbmVyQ2xhc3N9YF0sXG4gICAgICAgICAgICBzd2l0Y2hlczoge31cbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5vcHRpb25zLnN3aXRjaGVzW3RoaXMuY29udGFpbmVyQ2xhc3NdID0gKG9sZEVsLCBuZXdFbCwgb3B0aW9ucykgPT4gdGhpcy5zd2l0Y2gob2xkRWwsIG5ld0VsLCBvcHRpb25zKVxuICAgICAgICB0aGlzLnBqYXggPSBuZXcgUGpheCh0aGlzLm9wdGlvbnMpO1xuXG4gICAgICAgIC8qXG4gICAgICAgID09PT09IExJU1RFTkVSUyA9PT09PVxuICAgICAgICAqL1xuXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3BqYXg6c2VuZCcsKGUpID0+IHRoaXMuc2VuZChlKSk7XG5cblxuICAgICAgICAkZG9jdW1lbnQub24oRVZFTlQuUkVBRFlUT1JFTU9WRSwoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlKGV2ZW50Lm9sZFZpZXcsIGV2ZW50Lm5ld1ZpZXcpO1xuICAgICAgICB9KTtcbiAgICAgICAgJGRvY3VtZW50Lm9uKEVWRU5ULlJFQURZVE9ERVNUUk9ZLChldmVudCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5yZWluaXQoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiAoUEpBWCkgTGF1bmNoIHdoZW4gcGpheCByZWNlaXZlIGEgcmVxdWVzdFxuICAgICAqIGdldCAmIG1hbmFnZSBkYXRhLXRyYW5zaXRpb24saW5pdCBhbmQgbGF1bmNoIGl0XG4gICAgICogQHBhcmFtICB7ZXZlbnR9XG4gICAgICogQHJldHVybiB2b2lkXG4gICAgICovXG4gICAgc2VuZChlKSB7XG4gICAgICAgIGlmKGlzRGVidWcpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiLS0tLSBMYXVuY2ggcmVxdWVzdCDwn5mMIC0tLS0tXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGVsID0gZS50cmlnZ2VyRWxlbWVudDtcbiAgICAgICAgXG4gICAgICAgIGxldCB0cmFuc2l0aW9uID0gZWwuZ2V0QXR0cmlidXRlKCdkYXRhLXRyYW5zaXRpb24nKSA/IGVsLmdldEF0dHJpYnV0ZSgnZGF0YS10cmFuc2l0aW9uJykgOiAnQmFzZVRyYW5zaXRpb24nO1xuICAgICAgICAkaHRtbC5hdHRyKCdkYXRhLXRyYW5zaXRpb24nLHRyYW5zaXRpb24pO1xuXG4gICAgICAgIC8vIG9wdGlvbnMgYXZhaWxhYmxlIDogd3JhcHBlciwgb3ZlcnJpZGVDbGFzc1xuICAgICAgICB0aGlzLnRyYW5zaXRpb24gPSBuZXcgdHJhbnNpdGlvbnNbdHJhbnNpdGlvbl0oe1xuICAgICAgICAgICAgd3JhcHBlcjogdGhpcy53cmFwcGVyLFxuICAgICAgICAgICAgY2xpY2tlZExpbms6IGVsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMudHJhbnNpdGlvbi5sYXVuY2goKTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIChQSkFYKSBMYXVuY2ggd2hlbiBuZXcgcGFnZSBpcyBsb2FkZWRcbiAgICAgKiBAcGFyYW0gIHtqcyBkb20gZWxlbWVudH0sIFxuICAgICAqIEBwYXJhbSAge2pzIGRvbSBlbGVtZW50fVxuICAgICAqIEBwYXJhbSAge29wdGlvbnMgOiBwamF4IG9wdGlvbnN9XG4gICAgICogQHJldHVybiB2b2lkXG4gICAgICovXG4gICAgc3dpdGNoKG9sZFZpZXcsIG5ld1ZpZXcsIG9wdGlvbnMpIHtcbiAgICAgICAgaWYoaXNEZWJ1Zykge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJy0tLS0gTmV4dCB2aWV3IGxvYWRlZCDwn5GMIC0tLS0tJyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy50cmFuc2l0aW9uLmhpZGVWaWV3KG9sZFZpZXcsIG5ld1ZpZXcpO1xuXG4gICAgICAgIHRoaXMucGpheC5vblN3aXRjaCgpO1xuICAgICAgICBcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBMYXVuY2ggd2hlbiB5b3UgdHJpZ2dlciBFVkVOVC5SRUFEWVRPUkVNT1ZFIGluIHlvdXIgdHJhbnNpdGlvbiAtPiBoaWRlVmlldygpLCBhdCB0aGUgZW5kXG4gICAgICogYWZ0ZXIgb2xkVmlldyBoaWRkZW4sIGRlbGV0ZSBtb2R1bGVzIGFuZCBsYXVuY2ggdGhpcy5kaXNwbGF5KClcbiAgICAgKiBAcGFyYW0gIHtqcyBkb20gZWxlbWVudH0sIFxuICAgICAqIEBwYXJhbSAge2pzIGRvbSBlbGVtZW50fVxuICAgICAqIEByZXR1cm4gdm9pZFxuICAgICAqL1xuICAgIHJlbW92ZShvbGRWaWV3LCBuZXdWaWV3KSB7XG5cbiAgICAgICAgJGRvY3VtZW50LnRyaWdnZXJIYW5kbGVyKHtcbiAgICAgICAgICAgIHR5cGU6IEFQUF9FVkVOVC5ERUxFVEVfU0NPUEVEX01PRFVMRVMsXG4gICAgICAgICAgICAkc2NvcGU6ICRwamF4V3JhcHBlclxuICAgICAgICB9KTtcblxuICAgICAgICBvbGRWaWV3LnJlbW92ZSgpO1xuXG4gICAgICAgIHRoaXMuZGlzcGxheShuZXdWaWV3KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBsYXVuY2ggYWZ0ZXIgdGhpcy5yZW1vdmUoKVxuICAgICAqIEBwYXJhbSAge2pzIGRvbSBlbGVtZW50fSwgXG4gICAgICogQHJldHVybiB2b2lkXG4gICAgICovXG4gICAgZGlzcGxheSh2aWV3KSB7XG4gICAgICAgIHRoaXMud3JhcHBlci5pbm5lckhUTUwgPSB2aWV3Lm91dGVySFRNTDtcblxuICAgICAgICAvLyBGZXRjaCBhbnkgaW5saW5lIHNjcmlwdCBlbGVtZW50cy5cbiAgICAgICAgY29uc3Qgc2NyaXB0cyA9IHZpZXcucXVlcnlTZWxlY3RvckFsbCgnc2NyaXB0LmpzLWlubGluZScpO1xuXG4gICAgICAgIGlmIChzY3JpcHRzIGluc3RhbmNlb2Ygd2luZG93Lk5vZGVMaXN0KSB7XG4gICAgICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgICAgICBsZXQgbGVuID0gc2NyaXB0cy5sZW5ndGg7XG4gICAgICAgICAgICBmb3IgKDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgZXZhbChzY3JpcHRzW2ldLmlubmVySFRNTCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAkZG9jdW1lbnQudHJpZ2dlckhhbmRsZXIoe1xuICAgICAgICAgICAgdHlwZTogQVBQX0VWRU5ULklOSVRfU0NPUEVEX01PRFVMRVMsXG4gICAgICAgICAgICBpc1BqYXg6IHRydWVcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy50cmFuc2l0aW9uLmRpc3BsYXlWaWV3KHZpZXcpO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTGF1bmNoIHdoZW4geW91IHRyaWdnZXIgRVZFTlQuUkVBRFlUT0RFU1RST1kgaW4geW91ciB0cmFuc2l0aW9uIC0+IGRpc3BsYXlWaWV3KCksIGF0IHRoZSBlbmRcbiAgICAgKiBAcmV0dXJuIHZvaWRcbiAgICAgKi9cbiAgICByZWluaXQoKSB7XG4gICAgICAgIHRoaXMudHJhbnNpdGlvbi5kZXN0cm95KCk7XG4gICAgICAgICRodG1sLmF0dHIoJ2RhdGEtdHJhbnNpdGlvbicsJycpO1xuICAgICAgICB0aGlzLnRyYW5zaXRpb24gPSBuZXcgdHJhbnNpdGlvbnNbJ0Jhc2VUcmFuc2l0aW9uJ10oe1xuICAgICAgICAgICAgd3JhcHBlcjogdGhpcy53cmFwcGVyXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERPTSBpcyBsb2FkZWRcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICovXG4gICAgbG9hZCgpIHtcbiAgICAgICAgJGh0bWwuYWRkQ2xhc3MoJ2RvbS1pcy1sb2FkZWQnKTtcbiAgICAgICAgJGh0bWwucmVtb3ZlQ2xhc3MoJ2RvbS1pcy1sb2FkaW5nJyk7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgJGh0bWwuYWRkQ2xhc3MoJ2RvbS1pcy1hbmltYXRlZCcpO1xuICAgICAgICB9LCAxMDAwKVxuICAgIH1cbn1cbiIsImV4cG9ydCB7ZGVmYXVsdCBhcyBCYXNlVHJhbnNpdGlvbn0gZnJvbSAnLi9CYXNlVHJhbnNpdGlvbic7XG5leHBvcnQge2RlZmF1bHQgYXMgQ3VzdG9tVHJhbnNpdGlvbn0gZnJvbSAnLi9DdXN0b21UcmFuc2l0aW9uJztcbiIsImltcG9ydCB7IGlzQXJyYXkgfSBmcm9tICcuL2lzJztcblxuZXhwb3J0IGZ1bmN0aW9uIGFkZFRvQXJyYXkgKCBhcnJheSwgdmFsdWUgKSB7XG4gICAgY29uc3QgaW5kZXggPSBhcnJheS5pbmRleE9mKCB2YWx1ZSApO1xuXG4gICAgaWYgKCBpbmRleCA9PT0gLTEgKSB7XG4gICAgICAgIGFycmF5LnB1c2goIHZhbHVlICk7XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gYXJyYXlDb250YWlucyAoIGFycmF5LCB2YWx1ZSApIHtcbiAgICBmb3IgKCBsZXQgaSA9IDAsIGMgPSBhcnJheS5sZW5ndGg7IGkgPCBjOyBpKysgKSB7XG4gICAgICAgIGlmICggYXJyYXlbaV0gPT0gdmFsdWUgKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFycmF5Q29udGVudHNNYXRjaCAoIGEsIGIgKSB7XG4gICAgbGV0IGk7XG5cbiAgICBpZiAoICFpc0FycmF5KCBhICkgfHwgIWlzQXJyYXkoIGIgKSApIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmICggYS5sZW5ndGggIT09IGIubGVuZ3RoICkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaSA9IGEubGVuZ3RoO1xuICAgIHdoaWxlICggaS0tICkge1xuICAgICAgICBpZiAoIGFbaV0gIT09IGJbaV0gKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGVuc3VyZUFycmF5ICggeCApIHtcbiAgICBpZiAoIHR5cGVvZiB4ID09PSAnc3RyaW5nJyApIHtcbiAgICAgICAgcmV0dXJuIFsgeCBdO1xuICAgIH1cblxuICAgIGlmICggeCA9PT0gdW5kZWZpbmVkICkge1xuICAgICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgcmV0dXJuIHg7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsYXN0SXRlbSAoIGFycmF5ICkge1xuICAgIHJldHVybiBhcnJheVsgYXJyYXkubGVuZ3RoIC0gMSBdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlRnJvbUFycmF5ICggYXJyYXksIG1lbWJlciApIHtcbiAgICBpZiAoICFhcnJheSApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGluZGV4ID0gYXJyYXkuaW5kZXhPZiggbWVtYmVyICk7XG5cbiAgICBpZiAoIGluZGV4ICE9PSAtMSApIHtcbiAgICAgICAgYXJyYXkuc3BsaWNlKCBpbmRleCwgMSApO1xuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvQXJyYXkgKCBhcnJheUxpa2UgKSB7XG4gICAgY29uc3QgYXJyYXkgPSBbXTtcbiAgICBsZXQgaSA9IGFycmF5TGlrZS5sZW5ndGg7XG4gICAgd2hpbGUgKCBpLS0gKSB7XG4gICAgICAgIGFycmF5W2ldID0gYXJyYXlMaWtlW2ldO1xuICAgIH1cblxuICAgIHJldHVybiBhcnJheTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpbmRCeUtleVZhbHVlKCBhcnJheSwga2V5LCB2YWx1ZSApIHtcbiAgICByZXR1cm4gYXJyYXkuZmlsdGVyKGZ1bmN0aW9uKCBvYmogKSB7XG4gICAgICAgIHJldHVybiBvYmpba2V5XSA9PT0gdmFsdWU7XG4gICAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjbG9uZUFycmF5KCBhcnJheSApIHtcbiAgICByZXR1cm4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShhcnJheSkpO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oZnVuYywgd2FpdCwgaW1tZWRpYXRlKSB7XG4gICAgbGV0IHRpbWVvdXQ7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zdCBjb250ZXh0ID0gdGhpcztcbiAgICAgICAgY29uc3QgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgICAgY29uc3QgbGF0ZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgICAgICAgaWYgKCFpbW1lZGlhdGUpIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IGNhbGxOb3cgPSBpbW1lZGlhdGUgJiYgIXRpbWVvdXQ7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHdhaXQpO1xuICAgICAgICBpZiAoY2FsbE5vdykgZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICB9O1xufVxuIiwiY29uc3QgQVBQX05BTUUgICAgID0gJ0JvaWxlcnBsYXRlJztcbmNvbnN0IERBVEFfQVBJX0tFWSA9ICcuZGF0YS1hcGknO1xuXG5jb25zdCAkZG9jdW1lbnQgICAgPSAkKGRvY3VtZW50KTtcbmNvbnN0ICR3aW5kb3cgICAgICA9ICQod2luZG93KTtcbmNvbnN0ICRodG1sICAgICAgICA9ICQoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KS5yZW1vdmVDbGFzcygnaGFzLW5vLWpzJykuYWRkQ2xhc3MoJ2hhcy1qcycpO1xuY29uc3QgJGJvZHkgICAgICAgID0gJChkb2N1bWVudC5ib2R5KTtcbmNvbnN0ICRwamF4V3JhcHBlciA9ICQoJyNqcy1wamF4LXdyYXBwZXInKTtcblxuY29uc3QgaXNEZWJ1ZyAgICAgID0gISEkaHRtbC5kYXRhKCdkZWJ1ZycpO1xuXG5leHBvcnQgeyBBUFBfTkFNRSwgREFUQV9BUElfS0VZLCAkZG9jdW1lbnQsICR3aW5kb3csICRodG1sLCAkYm9keSwgaXNEZWJ1ZywgJHBqYXhXcmFwcGVyIH07XG4iLCIvKipcbiAqIEBzZWUgIGh0dHBzOi8vZ2l0aHViLmNvbS9yYWN0aXZlanMvcmFjdGl2ZS9ibG9iL2Rldi9zcmMvdXRpbHMvaHRtbC5qc1xuICovXG5leHBvcnQgZnVuY3Rpb24gZXNjYXBlSHRtbChzdHIpIHtcbiAgICByZXR1cm4gc3RyXG4gICAgICAgIC5yZXBsYWNlKC8mL2csICcmYW1wOycpXG4gICAgICAgIC5yZXBsYWNlKC88L2csICcmbHQ7JylcbiAgICAgICAgLnJlcGxhY2UoLz4vZywgJyZndDsnKTtcbn1cblxuLyoqXG4gKiBQcmVwYXJlIEhUTUwgY29udGVudCB0aGF0IGNvbnRhaW5zIG11c3RhY2hlIGNoYXJhY3RlcnMgZm9yIHVzZSB3aXRoIFJhY3RpdmVcbiAqIEBwYXJhbSAge3N0cmluZ30gc3RyXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1bmVzY2FwZUh0bWwoc3RyKSB7XG4gICAgcmV0dXJuIHN0clxuICAgICAgICAucmVwbGFjZSgvJmx0Oy9nLCAnPCcpXG4gICAgICAgIC5yZXBsYWNlKC8mZ3Q7L2csICc+JylcbiAgICAgICAgLnJlcGxhY2UoLyZhbXA7L2csICcmJyk7XG59XG5cbi8qKlxuICogR2V0IGVsZW1lbnQgZGF0YSBhdHRyaWJ1dGVzXG4gKiBAcGFyYW0gICB7RE9NRWxlbWVudH0gIG5vZGVcbiAqIEByZXR1cm4gIHtBcnJheX0gICAgICAgZGF0YVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0Tm9kZURhdGEobm9kZSkge1xuICAgIC8vIEFsbCBhdHRyaWJ1dGVzXG4gICAgY29uc3QgYXR0cmlidXRlcyA9IG5vZGUuYXR0cmlidXRlcztcblxuICAgIC8vIFJlZ2V4IFBhdHRlcm5cbiAgICBjb25zdCBwYXR0ZXJuID0gL15kYXRhXFwtKC4rKSQvO1xuXG4gICAgLy8gT3V0cHV0XG4gICAgY29uc3QgZGF0YSA9IHt9O1xuXG4gICAgZm9yIChsZXQgaSBpbiBhdHRyaWJ1dGVzKSB7XG4gICAgICAgIGlmICghYXR0cmlidXRlc1tpXSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBBdHRyaWJ1dGVzIG5hbWUgKGV4OiBkYXRhLW1vZHVsZSlcbiAgICAgICAgbGV0IG5hbWUgPSBhdHRyaWJ1dGVzW2ldLm5hbWU7XG5cbiAgICAgICAgLy8gVGhpcyBoYXBwZW5zLlxuICAgICAgICBpZiAoIW5hbWUpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IG1hdGNoID0gbmFtZS5tYXRjaChwYXR0ZXJuKTtcbiAgICAgICAgaWYgKCFtYXRjaCkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJZiB0aGlzIHRocm93cyBhbiBlcnJvciwgeW91IGhhdmUgc29tZVxuICAgICAgICAvLyBzZXJpb3VzIHByb2JsZW1zIGluIHlvdXIgSFRNTC5cbiAgICAgICAgZGF0YVttYXRjaFsxXV0gPSBnZXREYXRhKG5vZGUuZ2V0QXR0cmlidXRlKG5hbWUpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZGF0YTtcbn1cblxuY29uc3QgcmJyYWNlID0gL14oPzpcXHtbXFx3XFxXXSpcXH18XFxbW1xcd1xcV10qXFxdKSQvO1xuXG4vKipcbiAqIFBhcnNlIHZhbHVlIHRvIGRhdGEgdHlwZS5cbiAqXG4gKiBAbGluayAgIGh0dHBzOi8vZ2l0aHViLmNvbS9qcXVlcnkvanF1ZXJ5L2Jsb2IvMy4xLjEvc3JjL2RhdGEuanNcbiAqIEBwYXJhbSAge3N0cmluZ30gZGF0YSAtIEEgdmFsdWUgdG8gY29udmVydC5cbiAqIEByZXR1cm4ge21peGVkfSAgUmV0dXJucyB0aGUgdmFsdWUgaW4gaXRzIG5hdHVyYWwgZGF0YSB0eXBlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0RGF0YShkYXRhKSB7XG4gICAgaWYgKGRhdGEgPT09ICd0cnVlJykge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoZGF0YSA9PT0gJ2ZhbHNlJykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKGRhdGEgPT09ICdudWxsJykge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBPbmx5IGNvbnZlcnQgdG8gYSBudW1iZXIgaWYgaXQgZG9lc24ndCBjaGFuZ2UgdGhlIHN0cmluZ1xuICAgIGlmIChkYXRhID09PSArZGF0YSsnJykge1xuICAgICAgICByZXR1cm4gK2RhdGE7XG4gICAgfVxuXG4gICAgaWYgKHJicmFjZS50ZXN0KCBkYXRhICkpIHtcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UoIGRhdGEgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZGF0YTtcbn1cbiIsImNvbnN0IHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcbmNvbnN0IGFycmF5TGlrZVBhdHRlcm4gPSAvXlxcW29iamVjdCAoPzpBcnJheXxGaWxlTGlzdClcXF0kLztcblxuLy8gdGhhbmtzLCBodHRwOi8vcGVyZmVjdGlvbmtpbGxzLmNvbS9pbnN0YW5jZW9mLWNvbnNpZGVyZWQtaGFybWZ1bC1vci1ob3ctdG8td3JpdGUtYS1yb2J1c3QtaXNhcnJheS9cbmV4cG9ydCBmdW5jdGlvbiBpc0FycmF5ICggdGhpbmcgKSB7XG4gICAgcmV0dXJuIHRvU3RyaW5nLmNhbGwoIHRoaW5nICkgPT09ICdbb2JqZWN0IEFycmF5XSc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0FycmF5TGlrZSAoIG9iaiApIHtcbiAgICByZXR1cm4gYXJyYXlMaWtlUGF0dGVybi50ZXN0KCB0b1N0cmluZy5jYWxsKCBvYmogKSApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNFcXVhbCAoIGEsIGIgKSB7XG4gICAgaWYgKCBhID09PSBudWxsICYmIGIgPT09IG51bGwgKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGlmICggdHlwZW9mIGEgPT09ICdvYmplY3QnIHx8IHR5cGVvZiBiID09PSAnb2JqZWN0JyApIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiBhID09PSBiO1xufVxuXG4vLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzE4MDgyL3ZhbGlkYXRlLW51bWJlcnMtaW4tamF2YXNjcmlwdC1pc251bWVyaWNcbmV4cG9ydCBmdW5jdGlvbiBpc051bWVyaWMgKCB0aGluZyApIHtcbiAgICByZXR1cm4gIWlzTmFOKCBwYXJzZUZsb2F0KCB0aGluZyApICkgJiYgaXNGaW5pdGUoIHRoaW5nICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc09iamVjdCAoIHRoaW5nICkge1xuICAgIHJldHVybiAoIHRoaW5nICYmIHRvU3RyaW5nLmNhbGwoIHRoaW5nICkgPT09ICdbb2JqZWN0IE9iamVjdF0nICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0Z1bmN0aW9uKCB0aGluZyApIHtcbiAgICBjb25zdCBnZXRUeXBlID0ge307XG4gICAgcmV0dXJuIHRoaW5nICYmIGdldFR5cGUudG9TdHJpbmcuY2FsbCh0aGluZykgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XG59XG4iLCIvKiBqc2hpbnQgZXNuZXh0OiB0cnVlICovXG5pbXBvcnQgeyBpc051bWVyaWMgfSBmcm9tICcuL2lzJ1xuXG5sZXQgaXNBbmltYXRpbmcgPSBmYWxzZTtcblxuY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgZWFzaW5nOiAnc3dpbmcnLFxuICAgIGhlYWRlck9mZnNldDogNjAsXG4gICAgc3BlZWQ6IDMwMFxufTtcblxuLyoqXG4gKiBzY3JvbGxUbyBpcyBhIGZ1bmN0aW9uIHRoYXQgc2Nyb2xscyBhIGNvbnRhaW5lciB0byBhbiBlbGVtZW50J3MgcG9zaXRpb24gd2l0aGluIHRoYXQgY29udHJvbGxlclxuICogVXNlcyBqUXVlcnkncyAkLkRlZmVycmVkIHRvIGFsbG93IHVzaW5nIGEgY2FsbGJhY2sgb24gYW5pbWF0aW9uIGNvbXBsZXRpb25cbiAqIEBwYXJhbSAgIHtvYmplY3R9ICAkZWxlbWVudCAgQSBqUXVlcnkgbm9kZVxuICogQHBhcmFtICAge29iamVjdH0gIG9wdGlvbnNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNjcm9sbFRvKCRlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgY29uc3QgZGVmZXJyZWQgPSAkLkRlZmVycmVkKCk7XG5cbiAgICAvLyBEcm9wIGV2ZXJ5dGhpbmcgaWYgdGhpcyBhaW4ndCBhIGpRdWVyeSBvYmplY3RcbiAgICBpZiAoJGVsZW1lbnQgaW5zdGFuY2VvZiBqUXVlcnkgJiYgJGVsZW1lbnQubGVuZ3RoID4gMCkge1xuXG4gICAgICAgIC8vIE1lcmdpbmcgb3B0aW9uc1xuICAgICAgICBvcHRpb25zID0gJC5leHRlbmQoe30sIGRlZmF1bHRzLCAodHlwZW9mIG9wdGlvbnMgIT09ICd1bmRlZmluZWQnID8gb3B0aW9ucyA6IHt9KSk7XG5cbiAgICAgICAgLy8gUHJldmVudHMgYWNjdW11bGF0aW9uIG9mIGFuaW1hdGlvbnNcbiAgICAgICAgaWYgKGlzQW5pbWF0aW5nID09PSBmYWxzZSkge1xuICAgICAgICAgICAgaXNBbmltYXRpbmcgPSB0cnVlO1xuXG4gICAgICAgICAgICAvLyBEZWZhdWx0IGNvbnRhaW5lciB0aGF0IHdlJ2xsIGJlIHNjcm9sbGluZ1xuICAgICAgICAgICAgbGV0ICRjb250YWluZXIgPSAkKCdodG1sLCBib2R5Jyk7XG4gICAgICAgICAgICBsZXQgZWxlbWVudE9mZnNldCA9IDA7XG5cbiAgICAgICAgICAgIC8vIFRlc3RpbmcgY29udGFpbmVyIGluIG9wdGlvbnMgZm9yIGpRdWVyeS1uZXNzXG4gICAgICAgICAgICAvLyBJZiB3ZSdyZSBub3QgdXNpbmcgYSBjdXN0b20gY29udGFpbmVyLCB3ZSB0YWtlIHRoZSB0b3AgZG9jdW1lbnQgb2Zmc2V0XG4gICAgICAgICAgICAvLyBJZiB3ZSBhcmUsIHdlIHVzZSB0aGUgZWxlbWVudHMgcG9zaXRpb24gcmVsYXRpdmUgdG8gdGhlIGNvbnRhaW5lclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zLiRjb250YWluZXIgIT09ICd1bmRlZmluZWQnICYmIG9wdGlvbnMuJGNvbnRhaW5lciBpbnN0YW5jZW9mIGpRdWVyeSAmJiBvcHRpb25zLiRjb250YWluZXIubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICRjb250YWluZXIgPSBvcHRpb25zLiRjb250YWluZXI7XG5cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnMuc2Nyb2xsVG9wICE9PSAndW5kZWZpbmVkJyAmJiBpc051bWVyaWMob3B0aW9ucy5zY3JvbGxUb3ApICYmIG9wdGlvbnMuc2Nyb2xsVG9wICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHNjcm9sbFRvcCA9IG9wdGlvbnMuc2Nyb2xsVG9wO1xuICAgICAgICAgICAgICAgIH0gZWxzZcKge1xuICAgICAgICAgICAgICAgICAgICBzY3JvbGxUb3AgPSAkZWxlbWVudC5wb3NpdGlvbigpLnRvcCAtIG9wdGlvbnMuaGVhZGVyT2Zmc2V0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zLnNjcm9sbFRvcCAhPT0gJ3VuZGVmaW5lZCcgJiYgaXNOdW1lcmljKG9wdGlvbnMuc2Nyb2xsVG9wKSAmJiBvcHRpb25zLnNjcm9sbFRvcCAhPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBzY3JvbGxUb3AgPSBvcHRpb25zLnNjcm9sbFRvcDtcbiAgICAgICAgICAgICAgICB9IGVsc2XCoHtcbiAgICAgICAgICAgICAgICAgICAgc2Nyb2xsVG9wID0gJGVsZW1lbnQub2Zmc2V0KCkudG9wIC0gb3B0aW9ucy5oZWFkZXJPZmZzZXQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkY29udGFpbmVyLmFuaW1hdGUoe1xuICAgICAgICAgICAgICAgIHNjcm9sbFRvcDogc2Nyb2xsVG9wXG4gICAgICAgICAgICB9LCBvcHRpb25zLnNwZWVkLCBvcHRpb25zLmVhc2luZywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaXNBbmltYXRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlKCk7XG59XG4iLCIvKiBqc2hpbnQgZXNuZXh0OiB0cnVlICovXG5pbXBvcnQgeyBpc0Z1bmN0aW9uIH0gZnJvbSAnLi9pcyc7XG5pbXBvcnQgeyBhcnJheUNvbnRhaW5zLCBmaW5kQnlLZXlWYWx1ZSwgcmVtb3ZlRnJvbUFycmF5IH0gZnJvbSAnLi9hcnJheSc7XG5pbXBvcnQgeyAkZG9jdW1lbnQsICR3aW5kb3csICRodG1sLCAkYm9keSB9IGZyb20gJy4vZW52aXJvbm1lbnQnO1xuXG5jb25zdCBDQUxMQkFDS1MgPSB7XG4gICAgaGlkZGVuOiBbXSxcbiAgICB2aXNpYmxlOiBbXVxufTtcblxuY29uc3QgQUNUSU9OUyA9IFtcbiAgICAnYWRkQ2FsbGJhY2snLFxuICAgICdyZW1vdmVDYWxsYmFjaydcbl07XG5cbmNvbnN0IFNUQVRFUyA9IFtcbiAgICAndmlzaWJsZScsXG4gICAgJ2hpZGRlbidcbl07XG5cbmNvbnN0IFBSRUZJWCA9ICd2LSc7XG5cbmxldCBVVUlEID0gMDtcblxuLy8gTWFpbiBldmVudFxuJGRvY3VtZW50Lm9uKCd2aXNpYmlsaXR5Y2hhbmdlJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICBpZiAoZG9jdW1lbnQuaGlkZGVuKSB7XG4gICAgICAgIG9uRG9jdW1lbnRDaGFuZ2UoJ2hpZGRlbicpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIG9uRG9jdW1lbnRDaGFuZ2UoJ3Zpc2libGUnKTtcbiAgICB9XG59KTtcblxuLyoqXG4gKiBBZGQgYSBjYWxsYmFja1xuICogQHBhcmFtIHtzdHJpbmd9ICAgc3RhdGVcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrXG4gKiBAcmV0dXJuIHtzdHJpbmd9ICBpZGVudFxuICovXG5mdW5jdGlvbiBhZGRDYWxsYmFjayAoc3RhdGUsIG9wdGlvbnMpIHtcbiAgICBsZXQgY2FsbGJhY2sgPSBvcHRpb25zLmNhbGxiYWNrIHx8ICcnO1xuXG4gICAgaWYgKCFpc0Z1bmN0aW9uKGNhbGxiYWNrKSkge1xuICAgICAgICBjb25zb2xlLndhcm4oJ0NhbGxiYWNrIGlzIG5vdCBhIGZ1bmN0aW9uJyk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBsZXQgaWRlbnQgPSBQUkVGSVggKyBVVUlEKys7XG5cbiAgICBDQUxMQkFDS1Nbc3RhdGVdLnB1c2goe1xuICAgICAgICBpZGVudDogaWRlbnQsXG4gICAgICAgIGNhbGxiYWNrOiBjYWxsYmFja1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGlkZW50O1xufVxuXG4vKipcbiAqIFJlbW92ZSBhIGNhbGxiYWNrXG4gKiBAcGFyYW0gIHtzdHJpbmd9ICAgc3RhdGUgIFZpc2libGUgb3IgaGlkZGVuXG4gKiBAcGFyYW0gIHtzdHJpbmd9ICAgaWRlbnQgIFVuaXF1ZSBpZGVudGlmaWVyXG4gKiBAcmV0dXJuIHtib29sZWFufSAgICAgICAgIElmIG9wZXJhdGlvbiB3YXMgYSBzdWNjZXNzXG4gKi9cbmZ1bmN0aW9uIHJlbW92ZUNhbGxiYWNrIChzdGF0ZSwgb3B0aW9ucykge1xuICAgIGxldCBpZGVudCA9IG9wdGlvbnMuaWRlbnQgfHwgJyc7XG5cbiAgICBpZiAodHlwZW9mKGlkZW50KSA9PT0gJ3VuZGVmaW5lZCcgfHwgaWRlbnQgPT09ICcnKSB7XG4gICAgICAgIGNvbnNvbGUud2FybignTmVlZCBpZGVudCB0byByZW1vdmUgY2FsbGJhY2snKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGxldCBpbmRleCA9IGZpbmRCeUtleVZhbHVlKENBTExCQUNLU1tzdGF0ZV0sICdpZGVudCcsIGlkZW50KVswXTtcblxuICAgIC8vIGNvbnNvbGUubG9nKGlkZW50KVxuICAgIC8vIGNvbnNvbGUubG9nKENBTExCQUNLU1tzdGF0ZV0pXG5cbiAgICBpZiAodHlwZW9mKGluZGV4KSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgcmVtb3ZlRnJvbUFycmF5KENBTExCQUNLU1tzdGF0ZV0sIGluZGV4KTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS53YXJuKCdDYWxsYmFjayBjb3VsZCBub3QgYmUgZm91bmQnKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn1cblxuLyoqXG4gKiBXaGVuIGRvY3VtZW50IHN0YXRlIGNoYW5nZXMsIHRyaWdnZXIgY2FsbGJhY2tzXG4gKiBAcGFyYW0gIHtzdHJpbmd9ICBzdGF0ZSAgVmlzaWJsZSBvciBoaWRkZW5cbiAqL1xuZnVuY3Rpb24gb25Eb2N1bWVudENoYW5nZSAoc3RhdGUpIHtcbiAgICBsZXQgY2FsbGJhY2tBcnJheSA9IENBTExCQUNLU1tzdGF0ZV07XG4gICAgbGV0IGkgPSAwO1xuICAgIGxldCBsZW4gPSBjYWxsYmFja0FycmF5Lmxlbmd0aDtcblxuICAgIGZvciAoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgY2FsbGJhY2tBcnJheVtpXS5jYWxsYmFjaygpO1xuICAgIH1cbn1cblxuLyoqXG4gKiBQdWJsaWMgZmFjaW5nIEFQSSBmb3IgYWRkaW5nIGFuZCByZW1vdmluZyBjYWxsYmFja3NcbiAqIEBwYXJhbSAgIHtvYmplY3R9ICAgICAgICAgICBvcHRpb25zICBPcHRpb25zXG4gKiBAcmV0dXJuICB7Ym9vbGVhbnxpbnRlZ2VyfSAgICAgICAgICAgVW5pcXVlIGlkZW50aWZpZXIgZm9yIHRoZSBjYWxsYmFjayBvciBib29sZWFuIGluZGljYXRpbmcgc3VjY2VzcyBvciBmYWlsdXJlXG4gKi9cbmZ1bmN0aW9uIHZpc2liaWxpdHlBcGkgKG9wdGlvbnMpIHtcbiAgICBsZXQgYWN0aW9uID0gb3B0aW9ucy5hY3Rpb24gfHwgJyc7XG4gICAgbGV0IHN0YXRlID0gb3B0aW9ucy5zdGF0ZSB8fCAnJztcbiAgICBsZXQgcmV0O1xuXG4gICAgLy8gVHlwZSBhbmQgdmFsdWUgY2hlY2tpbmdcbiAgICBpZiAoIWFycmF5Q29udGFpbnMoQUNUSU9OUywgYWN0aW9uKSkge1xuICAgICAgICBjb25zb2xlLndhcm4oJ0FjdGlvbiBkb2VzIG5vdCBleGlzdCcpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmICghYXJyYXlDb250YWlucyhTVEFURVMsIHN0YXRlKSkge1xuICAgICAgICBjb25zb2xlLndhcm4oJ1N0YXRlIGRvZXMgbm90IGV4aXN0Jyk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBAdG9kbyBNYWdpYyBjYWxsIGZ1bmN0aW9uIHBsc1xuICAgIGlmIChhY3Rpb24gPT09ICdhZGRDYWxsYmFjaycpIHtcbiAgICAgICAgcmV0ID0gYWRkQ2FsbGJhY2soc3RhdGUsIG9wdGlvbnMpO1xuICAgIH0gZWxzZSBpZiAoYWN0aW9uID09PSAncmVtb3ZlQ2FsbGJhY2snKSB7XG4gICAgICAgIHJldCA9IHJlbW92ZUNhbGxiYWNrKHN0YXRlLCBvcHRpb25zKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmV0O1xufVxuXG5leHBvcnQgeyB2aXNpYmlsaXR5QXBpIH07XG4iXX0=
