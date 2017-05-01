/*! Dependencies for Locomotive Boilerplate - 2017-04-26 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("Barba", [], factory);
	else if(typeof exports === 'object')
		exports["Barba"] = factory();
	else
		root["Barba"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
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
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
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
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "http://localhost:8080/dist";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	//Promise polyfill https://github.com/taylorhakes/promise-polyfill
	
	if (typeof Promise !== 'function') {
	 window.Promise = __webpack_require__(1);
	}
	
	var Barba = {
	  version: '1.0.0',
	  BaseTransition: __webpack_require__(4),
	  BaseView: __webpack_require__(6),
	  BaseCache: __webpack_require__(8),
	  Dispatcher: __webpack_require__(7),
	  HistoryManager: __webpack_require__(9),
	  Pjax: __webpack_require__(10),
	  Prefetch: __webpack_require__(13),
	  Utils: __webpack_require__(5)
	};
	
	module.exports = Barba;


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(setImmediate) {(function (root) {
	
	  // Store setTimeout reference so promise-polyfill will be unaffected by
	  // other code modifying setTimeout (like sinon.useFakeTimers())
	  var setTimeoutFunc = setTimeout;
	
	  function noop() {
	  }
	
	  // Use polyfill for setImmediate for performance gains
	  var asap = (typeof setImmediate === 'function' && setImmediate) ||
	    function (fn) {
	      setTimeoutFunc(fn, 0);
	    };
	
	  var onUnhandledRejection = function onUnhandledRejection(err) {
	    if (typeof console !== 'undefined' && console) {
	      console.warn('Possible Unhandled Promise Rejection:', err); // eslint-disable-line no-console
	    }
	  };
	
	  // Polyfill for Function.prototype.bind
	  function bind(fn, thisArg) {
	    return function () {
	      fn.apply(thisArg, arguments);
	    };
	  }
	
	  function Promise(fn) {
	    if (typeof this !== 'object') throw new TypeError('Promises must be constructed via new');
	    if (typeof fn !== 'function') throw new TypeError('not a function');
	    this._state = 0;
	    this._handled = false;
	    this._value = undefined;
	    this._deferreds = [];
	
	    doResolve(fn, this);
	  }
	
	  function handle(self, deferred) {
	    while (self._state === 3) {
	      self = self._value;
	    }
	    if (self._state === 0) {
	      self._deferreds.push(deferred);
	      return;
	    }
	    self._handled = true;
	    asap(function () {
	      var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
	      if (cb === null) {
	        (self._state === 1 ? resolve : reject)(deferred.promise, self._value);
	        return;
	      }
	      var ret;
	      try {
	        ret = cb(self._value);
	      } catch (e) {
	        reject(deferred.promise, e);
	        return;
	      }
	      resolve(deferred.promise, ret);
	    });
	  }
	
	  function resolve(self, newValue) {
	    try {
	      // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
	      if (newValue === self) throw new TypeError('A promise cannot be resolved with itself.');
	      if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
	        var then = newValue.then;
	        if (newValue instanceof Promise) {
	          self._state = 3;
	          self._value = newValue;
	          finale(self);
	          return;
	        } else if (typeof then === 'function') {
	          doResolve(bind(then, newValue), self);
	          return;
	        }
	      }
	      self._state = 1;
	      self._value = newValue;
	      finale(self);
	    } catch (e) {
	      reject(self, e);
	    }
	  }
	
	  function reject(self, newValue) {
	    self._state = 2;
	    self._value = newValue;
	    finale(self);
	  }
	
	  function finale(self) {
	    if (self._state === 2 && self._deferreds.length === 0) {
	      asap(function() {
	        if (!self._handled) {
	          onUnhandledRejection(self._value);
	        }
	      });
	    }
	
	    for (var i = 0, len = self._deferreds.length; i < len; i++) {
	      handle(self, self._deferreds[i]);
	    }
	    self._deferreds = null;
	  }
	
	  function Handler(onFulfilled, onRejected, promise) {
	    this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
	    this.onRejected = typeof onRejected === 'function' ? onRejected : null;
	    this.promise = promise;
	  }
	
	  /**
	   * Take a potentially misbehaving resolver function and make sure
	   * onFulfilled and onRejected are only called once.
	   *
	   * Makes no guarantees about asynchrony.
	   */
	  function doResolve(fn, self) {
	    var done = false;
	    try {
	      fn(function (value) {
	        if (done) return;
	        done = true;
	        resolve(self, value);
	      }, function (reason) {
	        if (done) return;
	        done = true;
	        reject(self, reason);
	      });
	    } catch (ex) {
	      if (done) return;
	      done = true;
	      reject(self, ex);
	    }
	  }
	
	  Promise.prototype['catch'] = function (onRejected) {
	    return this.then(null, onRejected);
	  };
	
	  Promise.prototype.then = function (onFulfilled, onRejected) {
	    var prom = new (this.constructor)(noop);
	
	    handle(this, new Handler(onFulfilled, onRejected, prom));
	    return prom;
	  };
	
	  Promise.all = function (arr) {
	    var args = Array.prototype.slice.call(arr);
	
	    return new Promise(function (resolve, reject) {
	      if (args.length === 0) return resolve([]);
	      var remaining = args.length;
	
	      function res(i, val) {
	        try {
	          if (val && (typeof val === 'object' || typeof val === 'function')) {
	            var then = val.then;
	            if (typeof then === 'function') {
	              then.call(val, function (val) {
	                res(i, val);
	              }, reject);
	              return;
	            }
	          }
	          args[i] = val;
	          if (--remaining === 0) {
	            resolve(args);
	          }
	        } catch (ex) {
	          reject(ex);
	        }
	      }
	
	      for (var i = 0; i < args.length; i++) {
	        res(i, args[i]);
	      }
	    });
	  };
	
	  Promise.resolve = function (value) {
	    if (value && typeof value === 'object' && value.constructor === Promise) {
	      return value;
	    }
	
	    return new Promise(function (resolve) {
	      resolve(value);
	    });
	  };
	
	  Promise.reject = function (value) {
	    return new Promise(function (resolve, reject) {
	      reject(value);
	    });
	  };
	
	  Promise.race = function (values) {
	    return new Promise(function (resolve, reject) {
	      for (var i = 0, len = values.length; i < len; i++) {
	        values[i].then(resolve, reject);
	      }
	    });
	  };
	
	  /**
	   * Set the immediate function to execute callbacks
	   * @param fn {function} Function to execute
	   * @private
	   */
	  Promise._setImmediateFn = function _setImmediateFn(fn) {
	    asap = fn;
	  };
	
	  Promise._setUnhandledRejectionFn = function _setUnhandledRejectionFn(fn) {
	    onUnhandledRejection = fn;
	  };
	
	  if (typeof module !== 'undefined' && module.exports) {
	    module.exports = Promise;
	  } else if (!root.Promise) {
	    root.Promise = Promise;
	  }
	
	})(this);
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2).setImmediate))

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(setImmediate, clearImmediate) {var nextTick = __webpack_require__(3).nextTick;
	var apply = Function.prototype.apply;
	var slice = Array.prototype.slice;
	var immediateIds = {};
	var nextImmediateId = 0;
	
	// DOM APIs, for completeness
	
	exports.setTimeout = function() {
	  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
	};
	exports.setInterval = function() {
	  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
	};
	exports.clearTimeout =
	exports.clearInterval = function(timeout) { timeout.close(); };
	
	function Timeout(id, clearFn) {
	  this._id = id;
	  this._clearFn = clearFn;
	}
	Timeout.prototype.unref = Timeout.prototype.ref = function() {};
	Timeout.prototype.close = function() {
	  this._clearFn.call(window, this._id);
	};
	
	// Does not start the time, just sets up the members needed.
	exports.enroll = function(item, msecs) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = msecs;
	};
	
	exports.unenroll = function(item) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = -1;
	};
	
	exports._unrefActive = exports.active = function(item) {
	  clearTimeout(item._idleTimeoutId);
	
	  var msecs = item._idleTimeout;
	  if (msecs >= 0) {
	    item._idleTimeoutId = setTimeout(function onTimeout() {
	      if (item._onTimeout)
	        item._onTimeout();
	    }, msecs);
	  }
	};
	
	// That's not how node.js implements it but the exposed api is the same.
	exports.setImmediate = typeof setImmediate === "function" ? setImmediate : function(fn) {
	  var id = nextImmediateId++;
	  var args = arguments.length < 2 ? false : slice.call(arguments, 1);
	
	  immediateIds[id] = true;
	
	  nextTick(function onNextTick() {
	    if (immediateIds[id]) {
	      // fn.call() is faster so we optimize for the common use-case
	      // @see http://jsperf.com/call-apply-segu
	      if (args) {
	        fn.apply(null, args);
	      } else {
	        fn.call(null);
	      }
	      // Prevent ids from leaking
	      exports.clearImmediate(id);
	    }
	  });
	
	  return id;
	};
	
	exports.clearImmediate = typeof clearImmediate === "function" ? clearImmediate : function(id) {
	  delete immediateIds[id];
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2).setImmediate, __webpack_require__(2).clearImmediate))

/***/ },
/* 3 */
/***/ function(module, exports) {

	// shim for using process in browser
	
	var process = module.exports = {};
	
	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.
	
	var cachedSetTimeout;
	var cachedClearTimeout;
	
	(function () {
	  try {
	    cachedSetTimeout = setTimeout;
	  } catch (e) {
	    cachedSetTimeout = function () {
	      throw new Error('setTimeout is not defined');
	    }
	  }
	  try {
	    cachedClearTimeout = clearTimeout;
	  } catch (e) {
	    cachedClearTimeout = function () {
	      throw new Error('clearTimeout is not defined');
	    }
	  }
	} ())
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
	    var timeout = cachedSetTimeout(cleanUpNextTick);
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
	    cachedClearTimeout(timeout);
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
	        cachedSetTimeout(drainQueue, 0);
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


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var Utils = __webpack_require__(5);
	
	/**
	 * BaseTransition to extend
	 *
	 * @namespace Barba.BaseTransition
	 * @type {Object}
	 */
	var BaseTransition = {
	  /**
	   * @memberOf Barba.BaseTransition
	   * @type {HTMLElement}
	   */
	  oldContainer: undefined,
	
	  /**
	   * @memberOf Barba.BaseTransition
	   * @type {HTMLElement}
	   */
	  newContainer: undefined,
	
	  /**
	   * @memberOf Barba.BaseTransition
	   * @type {Promise}
	   */
	  newContainerLoading: undefined,
	
	  /**
	   * Helper to extend the object
	   *
	   * @memberOf Barba.BaseTransition
	   * @param  {Object} newObject
	   * @return {Object} newInheritObject
	   */
	  extend: function(obj){
	    return Utils.extend(this, obj);
	  },
	
	  /**
	   * This function is called from Pjax module to initialize
	   * the transition.
	   *
	   * @memberOf Barba.BaseTransition
	   * @private
	   * @param  {HTMLElement} oldContainer
	   * @param  {Promise} newContainer
	   * @return {Promise}
	   */
	  init: function(oldContainer, newContainer) {
	    var _this = this;
	
	    this.oldContainer = oldContainer;
	    this._newContainerPromise = newContainer;
	
	    this.deferred = Utils.deferred();
	    this.newContainerReady = Utils.deferred();
	    this.newContainerLoading = this.newContainerReady.promise;
	
	    this.start();
	
	    this._newContainerPromise.then(function(newContainer) {
	      _this.newContainer = newContainer;
	      _this.newContainerReady.resolve();
	    });
	
	    return this.deferred.promise;
	  },
	
	  /**
	   * This function needs to be called as soon the Transition is finished
	   *
	   * @memberOf Barba.BaseTransition
	   */
	  done: function() {
	    this.oldContainer.parentNode.removeChild(this.oldContainer);
	    this.newContainer.style.visibility = 'visible';
	    this.deferred.resolve();
	  },
	
	  /**
	   * Constructor for your Transition
	   *
	   * @memberOf Barba.BaseTransition
	   * @abstract
	   */
	  start: function() {},
	};
	
	module.exports = BaseTransition;


/***/ },
/* 5 */
/***/ function(module, exports) {

	/**
	 * Just an object with some helpful functions
	 *
	 * @type {Object}
	 * @namespace Barba.Utils
	 */
	var Utils = {
	  /**
	   * Return the current url
	   *
	   * @memberOf Barba.Utils
	   * @return {String} currentUrl
	   */
	  getCurrentUrl: function() {
	    return window.location.protocol + '//' +
	           window.location.host +
	           window.location.pathname +
	           window.location.search;
	  },
	
	  /**
	   * Given an url, return it without the hash
	   *
	   * @memberOf Barba.Utils
	   * @private
	   * @param  {String} url
	   * @return {String} newCleanUrl
	   */
	  cleanLink: function(url) {
	    return url.replace(/#.*/, '');
	  },
	
	  /**
	   * Time in millisecond after the xhr request goes in timeout
	   *
	   * @memberOf Barba.Utils
	   * @type {Number}
	   * @default
	   */
	  xhrTimeout: 5000,
	
	  /**
	   * Start an XMLHttpRequest() and return a Promise
	   *
	   * @memberOf Barba.Utils
	   * @param  {String} url
	   * @return {Promise}
	   */
	  xhr: function(url) {
	    var deferred = this.deferred();
	    var req = new XMLHttpRequest();
	
	    req.onreadystatechange = function() {
	      if (req.readyState === 4) {
	        if (req.status === 200) {
	          return deferred.resolve(req.responseText);
	        } else {
	          return deferred.reject(new Error('xhr: HTTP code is not 200'));
	        }
	      }
	    };
	
	    req.ontimeout = function() {
	      return deferred.reject(new Error('xhr: Timeout exceeded'));
	    };
	
	    req.open('GET', url);
	    req.timeout = this.xhrTimeout;
	    req.setRequestHeader('x-barba', 'yes');
	    req.send();
	
	    return deferred.promise;
	  },
	
	  /**
	   * Get obj and props and return a new object with the property merged
	   *
	   * @memberOf Barba.Utils
	   * @param  {object} obj
	   * @param  {object} props
	   * @return {object}
	   */
	  extend: function(obj, props) {
	    var newObj = Object.create(obj);
	
	    for(var prop in props) {
	      if(props.hasOwnProperty(prop)) {
	        newObj[prop] = props[prop];
	      }
	    }
	
	    return newObj;
	  },
	
	  /**
	   * Return a new "Deferred" object
	   * https://developer.mozilla.org/en-US/docs/Mozilla/JavaScript_code_modules/Promise.jsm/Deferred
	   *
	   * @memberOf Barba.Utils
	   * @return {Deferred}
	   */
	  deferred: function() {
	    return new function() {
	      this.resolve = null;
	      this.reject = null;
	
	      this.promise = new Promise(function(resolve, reject) {
	        this.resolve = resolve;
	        this.reject = reject;
	      }.bind(this));
	    };
	  },
	
	  /**
	   * Return the port number normalized, eventually you can pass a string to be normalized.
	   *
	   * @memberOf Barba.Utils
	   * @private
	   * @param  {String} p
	   * @return {Int} port
	   */
	  getPort: function(p) {
	    var port = typeof p !== 'undefined' ? p : window.location.port;
	    var protocol = window.location.protocol;
	
	    if (port != '')
	      return parseInt(port);
	
	    if (protocol === 'http:')
	      return 80;
	
	    if (protocol === 'https:')
	      return 443;
	  }
	};
	
	module.exports = Utils;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var Dispatcher = __webpack_require__(7);
	var Utils = __webpack_require__(5);
	
	/**
	 * BaseView to be extended
	 *
	 * @namespace Barba.BaseView
	 * @type {Object}
	 */
	var BaseView  = {
	  /**
	   * Namespace of the view.
	   * (need to be associated with the data-namespace of the container)
	   *
	   * @memberOf Barba.BaseView
	   * @type {String}
	   */
	  namespace: null,
	
	  /**
	   * Helper to extend the object
	   *
	   * @memberOf Barba.BaseView
	   * @param  {Object} newObject
	   * @return {Object} newInheritObject
	   */
	  extend: function(obj){
	    return Utils.extend(this, obj);
	  },
	
	  /**
	   * Init the view.
	   * P.S. Is suggested to init the view before starting Barba.Pjax.start(),
	   * in this way .onEnter() and .onEnterCompleted() will be fired for the current
	   * container when the page is loaded.
	   *
	   * @memberOf Barba.BaseView
	   */
	  init: function() {
	    var _this = this;
	
	    Dispatcher.on('initStateChange',
	      function(newStatus, oldStatus) {
	        if (oldStatus && oldStatus.namespace === _this.namespace)
	          _this.onLeave();
	      }
	    );
	
	    Dispatcher.on('newPageReady',
	      function(newStatus, oldStatus, container) {
	        _this.container = container;
	
	        if (newStatus.namespace === _this.namespace)
	          _this.onEnter();
	      }
	    );
	
	    Dispatcher.on('transitionCompleted',
	      function(newStatus, oldStatus) {
	        if (newStatus.namespace === _this.namespace)
	          _this.onEnterCompleted();
	
	        if (oldStatus && oldStatus.namespace === _this.namespace)
	          _this.onLeaveCompleted();
	      }
	    );
	  },
	
	 /**
	  * This function will be fired when the container
	  * is ready and attached to the DOM.
	  *
	  * @memberOf Barba.BaseView
	  * @abstract
	  */
	  onEnter: function() {},
	
	  /**
	   * This function will be fired when the transition
	   * to this container has just finished.
	   *
	   * @memberOf Barba.BaseView
	   * @abstract
	   */
	  onEnterCompleted: function() {},
	
	  /**
	   * This function will be fired when the transition
	   * to a new container has just started.
	   *
	   * @memberOf Barba.BaseView
	   * @abstract
	   */
	  onLeave: function() {},
	
	  /**
	   * This function will be fired when the container
	   * has just been removed from the DOM.
	   *
	   * @memberOf Barba.BaseView
	   * @abstract
	   */
	  onLeaveCompleted: function() {}
	}
	
	module.exports = BaseView;


/***/ },
/* 7 */
/***/ function(module, exports) {

	/**
	 * Little Dispatcher inspired by MicroEvent.js
	 *
	 * @namespace Barba.Dispatcher
	 * @type {Object}
	 */
	var Dispatcher = {
	  /**
	   * Object that keeps all the events
	   *
	   * @memberOf Barba.Dispatcher
	   * @readOnly
	   * @type {Object}
	   */
	  events: {},
	
	  /**
	   * Bind a callback to an event
	   *
	   * @memberOf Barba.Dispatcher
	   * @param  {String} eventName
	   * @param  {Function} function
	   */
	  on: function(e, f) {
	    this.events[e] = this.events[e] || [];
	    this.events[e].push(f);
	  },
	
	  /**
	   * Unbind event
	   *
	   * @memberOf Barba.Dispatcher
	   * @param  {String} eventName
	   * @param  {Function} function
	   */
	  off: function(e, f) {
	    if(e in this.events === false)
	      return;
	
	    this.events[e].splice(this.events[e].indexOf(f), 1);
	  },
	
	  /**
	   * Fire the event running all the event associated to it
	   *
	   * @memberOf Barba.Dispatcher
	   * @param  {String} eventName
	   * @param  {...*} args
	   */
	  trigger: function(e) {//e, ...args
	    if (e in this.events === false)
	      return;
	
	    for(var i = 0; i < this.events[e].length; i++){
	      this.events[e][i].apply(this, Array.prototype.slice.call(arguments, 1));
	    }
	  }
	};
	
	module.exports = Dispatcher;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var Utils = __webpack_require__(5);
	
	/**
	 * BaseCache it's a simple static cache
	 *
	 * @namespace Barba.BaseCache
	 * @type {Object}
	 */
	var BaseCache = {
	  /**
	   * The Object that keeps all the key value information
	   *
	   * @memberOf Barba.BaseCache
	   * @type {Object}
	   */
	  data: {},
	
	  /**
	   * Helper to extend this object
	   *
	   * @memberOf Barba.BaseCache
	   * @private
	   * @param  {Object} newObject
	   * @return {Object} newInheritObject
	   */
	  extend: function(obj) {
	    return Utils.extend(this, obj);
	  },
	
	  /**
	   * Set a key and value data, mainly Barba is going to save promises
	   *
	   * @memberOf Barba.BaseCache
	   * @param {String} key
	   * @param {*} value
	   */
	  set: function(key, val) {
	    this.data[key] = val;
	  },
	
	  /**
	   * Retrieve the data using the key
	   *
	   * @memberOf Barba.BaseCache
	   * @param  {String} key
	   * @return {*}
	   */
	  get: function(key) {
	    return this.data[key];
	  },
	
	  /**
	   * Flush the cache
	   *
	   * @memberOf Barba.BaseCache
	   */
	  reset: function() {
	    this.data = {};
	  }
	};
	
	module.exports = BaseCache;


/***/ },
/* 9 */
/***/ function(module, exports) {

	/**
	 * HistoryManager helps to keep track of the navigation
	 *
	 * @namespace Barba.HistoryManager
	 * @type {Object}
	 */
	var HistoryManager = {
	  /**
	   * Keep track of the status in historic order
	   *
	   * @memberOf Barba.HistoryManager
	   * @readOnly
	   * @type {Array}
	   */
	  history: [],
	
	  /**
	   * Add a new set of url and namespace
	   *
	   * @memberOf Barba.HistoryManager
	   * @param {String} url
	   * @param {String} namespace
	   * @private
	   */
	  add: function(url, namespace) {
	    if (!namespace)
	      namespace = undefined;
	
	    this.history.push({
	      url: url,
	      namespace: namespace
	    });
	  },
	
	  /**
	   * Return information about the current status
	   *
	   * @memberOf Barba.HistoryManager
	   * @return {Object}
	   */
	  currentStatus: function() {
	    return this.history[this.history.length - 1];
	  },
	
	  /**
	   * Return information about the previous status
	   *
	   * @memberOf Barba.HistoryManager
	   * @return {Object}
	   */
	  prevStatus: function() {
	    var history = this.history;
	
	    if (history.length < 2)
	      return null;
	
	    return history[history.length - 2];
	  }
	};
	
	module.exports = HistoryManager;


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var Utils = __webpack_require__(5);
	var Dispatcher = __webpack_require__(7);
	var HideShowTransition = __webpack_require__(11);
	var BaseCache = __webpack_require__(8);
	
	var HistoryManager = __webpack_require__(9);
	var Dom = __webpack_require__(12);
	
	/**
	 * Pjax is a static object with main function
	 *
	 * @namespace Barba.Pjax
	 * @borrows Dom as Dom
	 * @type {Object}
	 */
	var Pjax = {
	  Dom: Dom,
	  History: HistoryManager,
	  Cache: BaseCache,
	
	  /**
	   * Indicate wether or not use the cache
	   *
	   * @memberOf Barba.Pjax
	   * @type {Boolean}
	   * @default
	   */
	  cacheEnabled: true,
	
	  /**
	   * Indicate if there is an animation in progress
	   *
	   * @memberOf Barba.Pjax
	   * @readOnly
	   * @type {Boolean}
	   */
	  transitionProgress: false,
	
	  /**
	   * Class name used to ignore links
	   *
	   * @memberOf Barba.Pjax
	   * @type {String}
	   * @default
	   */
	  ignoreClassLink: 'no-barba',
	
	  /**
	   * Function to be called to start Pjax
	   *
	   * @memberOf Barba.Pjax
	   */
	  start: function() {
	    this.init();
	  },
	
	  /**
	   * Init the events
	   *
	   * @memberOf Barba.Pjax
	   * @private
	   */
	  init: function() {
	    var container = this.Dom.getContainer();
	    var wrapper = this.Dom.getWrapper();
	
	    wrapper.setAttribute('aria-live', 'polite');
	
	    this.History.add(
	      this.getCurrentUrl(),
	      this.Dom.getNamespace(container)
	    );
	
	    //Fire for the current view.
	    Dispatcher.trigger('initStateChange', this.History.currentStatus());
	    Dispatcher.trigger('newPageReady',
	      this.History.currentStatus(),
	      {},
	      container,
	      this.Dom.currentHTML
	    );
	    Dispatcher.trigger('transitionCompleted', this.History.currentStatus());
	
	    this.bindEvents();
	  },
	
	  /**
	   * Attach the eventlisteners
	   *
	   * @memberOf Barba.Pjax
	   * @private
	   */
	  bindEvents: function() {
	    document.addEventListener('click',
	      this.onLinkClick.bind(this)
	    );
	
	    window.addEventListener('popstate',
	      this.onStateChange.bind(this)
	    );
	  },
	
	  /**
	   * Return the currentURL cleaned
	   *
	   * @memberOf Barba.Pjax
	   * @return {String} currentUrl
	   */
	  getCurrentUrl: function() {
	    return Utils.cleanLink(
	      Utils.getCurrentUrl()
	    );
	  },
	
	  /**
	   * Change the URL with pushstate and trigger the state change
	   *
	   * @memberOf Barba.Pjax
	   * @param {String} newUrl
	   */
	  goTo: function(url) {
	    window.history.pushState(null, null, url);
	    this.onStateChange();
	  },
	
	  /**
	   * Force the browser to go to a certain url
	   *
	   * @memberOf Barba.Pjax
	   * @param {String} url
	   * @private
	   */
	  forceGoTo: function(url) {
	    window.location = url;
	  },
	
	  /**
	   * Load an url, will start an xhr request or load from the cache
	   *
	   * @memberOf Barba.Pjax
	   * @private
	   * @param  {String} url
	   * @return {Promise}
	   */
	  load: function(url) {
	    var deferred = Utils.deferred();
	    var _this = this;
	    var xhr;
	
	    xhr = this.Cache.get(url);
	
	    if (!xhr) {
	      xhr = Utils.xhr(url);
	      this.Cache.set(url, xhr);
	    }
	
	    xhr.then(
	      function(data) {
	        var container = _this.Dom.parseResponse(data);
	
	        _this.Dom.putContainer(container);
	
	        if (!_this.cacheEnabled)
	          _this.Cache.reset();
	
	        deferred.resolve(container);
	      },
	      function() {
	        //Something went wrong (timeout, 404, 505...)
	        _this.forceGoTo(url);
	
	        deferred.reject();
	      }
	    );
	
	    return deferred.promise;
	  },
	
	  /**
	   * Get the .href parameter out of an element
	   * and handle special cases (like xlink:href)
	   *
	   * @private
	   * @memberOf Barba.Pjax
	   * @param  {HTMLElement} el
	   * @return {String} href
	   */
	  getHref: function(el) {
	    if (!el) {
	      return undefined;
	    }
	
	    if (el.getAttribute && typeof el.getAttribute('xlink:href') === 'string') {
	      return el.getAttribute('xlink:href');
	    }
	
	    if (typeof el.href === 'string') {
	      return el.href;
	    }
	
	    return undefined;
	  },
	
	  /**
	   * Callback called from click event
	   *
	   * @memberOf Barba.Pjax
	   * @private
	   * @param {MouseEvent} evt
	   */
	  onLinkClick: function(evt) {
	    var el = evt.target;
	
	    //Go up in the nodelist until we
	    //find something with an href
	    while (el && !this.getHref(el)) {
	      el = el.parentNode;
	    }
	
	    if (this.preventCheck(evt, el)) {
	      evt.stopPropagation();
	      evt.preventDefault();
	
	      Dispatcher.trigger('linkClicked', el, evt);
	
	      var href = this.getHref(el);
	      this.goTo(href);
	    }
	  },
	
	  /**
	   * Determine if the link should be followed
	   *
	   * @memberOf Barba.Pjax
	   * @param  {MouseEvent} evt
	   * @param  {HTMLElement} element
	   * @return {Boolean}
	   */
	  preventCheck: function(evt, element) {
	    if (!window.history.pushState)
	      return false;
	
	    var href = this.getHref(element);
	
	    //User
	    if (!element || !href)
	      return false;
	
	    //Middle click, cmd click, and ctrl click
	    if (evt.which > 1 || evt.metaKey || evt.ctrlKey || evt.shiftKey || evt.altKey)
	      return false;
	
	    //Ignore target with _blank target
	    if (element.target && element.target === '_blank')
	      return false;
	
	    //Check if it's the same domain
	    if (window.location.protocol !== element.protocol || window.location.hostname !== element.hostname)
	      return false;
	
	    //Check if the port is the same
	    if (Utils.getPort() !== Utils.getPort(element.port))
	      return false;
	
	    //Ignore case when a hash is being tacked on the current URL
	    if (href.indexOf('#') > -1)
	      return false;
	
	    //Ignore case where there is download attribute
	    if (element.getAttribute && typeof element.getAttribute('download') === 'string')
	      return false;
	
	    //In case you're trying to load the same page
	    if (Utils.cleanLink(href) == Utils.cleanLink(location.href))
	      return false;
	
	    if (element.classList.contains(this.ignoreClassLink))
	      return false;
	
	    return true;
	  },
	
	  /**
	   * Return a transition object
	   *
	   * @memberOf Barba.Pjax
	   * @return {Barba.Transition} Transition object
	   */
	  getTransition: function() {
	    //User customizable
	    return HideShowTransition;
	  },
	
	  /**
	   * Method called after a 'popstate' or from .goTo()
	   *
	   * @memberOf Barba.Pjax
	   * @private
	   */
	  onStateChange: function() {
	    var newUrl = this.getCurrentUrl();
	
	    if (this.transitionProgress)
	      this.forceGoTo(newUrl);
	
	    if (this.History.currentStatus().url === newUrl)
	      return false;
	
	    this.History.add(newUrl);
	
	    var newContainer = this.load(newUrl);
	    var transition = Object.create(this.getTransition());
	
	    this.transitionProgress = true;
	
	    Dispatcher.trigger('initStateChange',
	      this.History.currentStatus(),
	      this.History.prevStatus()
	    );
	
	    var transitionInstance = transition.init(
	      this.Dom.getContainer(),
	      newContainer
	    );
	
	    newContainer.then(
	      this.onNewContainerLoaded.bind(this)
	    );
	
	    transitionInstance.then(
	      this.onTransitionEnd.bind(this)
	    );
	  },
	
	  /**
	   * Function called as soon the new container is ready
	   *
	   * @memberOf Barba.Pjax
	   * @private
	   * @param {HTMLElement} container
	   */
	  onNewContainerLoaded: function(container) {
	    var currentStatus = this.History.currentStatus();
	    currentStatus.namespace = this.Dom.getNamespace(container);
	
	    Dispatcher.trigger('newPageReady',
	      this.History.currentStatus(),
	      this.History.prevStatus(),
	      container,
	      this.Dom.currentHTML
	    );
	  },
	
	  /**
	   * Function called as soon the transition is finished
	   *
	   * @memberOf Barba.Pjax
	   * @private
	   */
	  onTransitionEnd: function() {
	    this.transitionProgress = false;
	
	    Dispatcher.trigger('transitionCompleted',
	      this.History.currentStatus(),
	      this.History.prevStatus()
	    );
	  }
	};
	
	module.exports = Pjax;


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var BaseTransition = __webpack_require__(4);
	
	/**
	 * Basic Transition object, wait for the new Container to be ready,
	 * scroll top, and finish the transition (removing the old container and displaying the new one)
	 *
	 * @private
	 * @namespace Barba.HideShowTransition
	 * @augments Barba.BaseTransition
	 */
	var HideShowTransition = BaseTransition.extend({
	  start: function() {
	    this.newContainerLoading.then(this.finish.bind(this));
	  },
	
	  finish: function() {
	    document.body.scrollTop = 0;
	    this.done();
	  }
	});
	
	module.exports = HideShowTransition;


/***/ },
/* 12 */
/***/ function(module, exports) {

	/**
	 * Object that is going to deal with DOM parsing/manipulation
	 *
	 * @namespace Barba.Pjax.Dom
	 * @type {Object}
	 */
	var Dom = {
	  /**
	   * The name of the data attribute on the container
	   *
	   * @memberOf Barba.Pjax.Dom
	   * @type {String}
	   * @default
	   */
	  dataNamespace: 'namespace',
	
	  /**
	   * Id of the main wrapper
	   *
	   * @memberOf Barba.Pjax.Dom
	   * @type {String}
	   * @default
	   */
	  wrapperId: 'barba-wrapper',
	
	  /**
	   * Class name used to identify the containers
	   *
	   * @memberOf Barba.Pjax.Dom
	   * @type {String}
	   * @default
	   */
	  containerClass: 'barba-container',
	
	  /**
	   * Full HTML String of the current page.
	   * By default is the innerHTML of the initial loaded page.
	   *
	   * Each time a new page is loaded, the value is the response of the xhr call.
	   *
	   * @memberOf Barba.Pjax.Dom
	   * @type {String}
	   */
	  currentHTML: document.documentElement.innerHTML,
	
	  /**
	   * Parse the responseText obtained from the xhr call
	   *
	   * @memberOf Barba.Pjax.Dom
	   * @private
	   * @param  {String} responseText
	   * @return {HTMLElement}
	   */
	  parseResponse: function(responseText) {
	    this.currentHTML = responseText;
	
	    var wrapper = document.createElement('div');
	    wrapper.innerHTML = responseText;
	
	    var titleEl = wrapper.querySelector('title');
	
	    if (titleEl)
	      document.title = titleEl.textContent;
	
	    return this.getContainer(wrapper);
	  },
	
	  /**
	   * Get the main barba wrapper by the ID `wrapperId`
	   *
	   * @memberOf Barba.Pjax.Dom
	   * @return {HTMLElement} element
	   */
	  getWrapper: function() {
	    var wrapper = document.getElementById(this.wrapperId);
	
	    if (!wrapper)
	      throw new Error('Barba.js: wrapper not found!');
	
	    return wrapper;
	  },
	
	  /**
	   * Get the container on the current DOM,
	   * or from an HTMLElement passed via argument
	   *
	   * @memberOf Barba.Pjax.Dom
	   * @private
	   * @param  {HTMLElement} element
	   * @return {HTMLElement}
	   */
	  getContainer: function(element) {
	    if (!element)
	      element = document.body;
	
	    if (!element)
	      throw new Error('Barba.js: DOM not ready!');
	
	    var container = this.parseContainer(element);
	
	    if (container && container.jquery)
	      container = container[0];
	
	    if (!container)
	      throw new Error('Barba.js: no container found');
	
	    return container;
	  },
	
	  /**
	   * Get the namespace of the container
	   *
	   * @memberOf Barba.Pjax.Dom
	   * @private
	   * @param  {HTMLElement} element
	   * @return {String}
	   */
	  getNamespace: function(element) {
	    if (element && element.dataset) {
	      return element.dataset[this.dataNamespace];
	    } else if (element) {
	      return element.getAttribute('data-' + this.dataNamespace);
	    }
	
	    return null;
	  },
	
	  /**
	   * Put the container on the page
	   *
	   * @memberOf Barba.Pjax.Dom
	   * @private
	   * @param  {HTMLElement} element
	   */
	  putContainer: function(element) {
	    element.style.visibility = 'hidden';
	
	    var wrapper = this.getWrapper();
	    wrapper.appendChild(element);
	  },
	
	  /**
	   * Get container selector
	   *
	   * @memberOf Barba.Pjax.Dom
	   * @private
	   * @param  {HTMLElement} element
	   * @return {HTMLElement} element
	   */
	  parseContainer: function(element) {
	    return element.querySelector('.' + this.containerClass);
	  }
	};
	
	module.exports = Dom;


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var Utils = __webpack_require__(5);
	var Pjax = __webpack_require__(10);
	
	/**
	 * Prefetch
	 *
	 * @namespace Barba.Prefetch
	 * @type {Object}
	 */
	var Prefetch = {
	  /**
	   * Class name used to ignore prefetch on links
	   *
	   * @memberOf Barba.Prefetch
	   * @type {String}
	   * @default
	   */
	  ignoreClassLink: 'no-barba-prefetch',
	
	  /**
	   * Init the event listener on mouseover and touchstart
	   * for the prefetch
	   *
	   * @memberOf Barba.Prefetch
	   */
	  init: function() {
	    if (!window.history.pushState) {
	      return false;
	    }
	
	    document.body.addEventListener('mouseover', this.onLinkEnter.bind(this));
	    document.body.addEventListener('touchstart', this.onLinkEnter.bind(this));
	  },
	
	  /**
	   * Callback for the mousehover/touchstart
	   *
	   * @memberOf Barba.Prefetch
	   * @private
	   * @param  {Object} evt
	   */
	  onLinkEnter: function(evt) {
	    var el = evt.target;
	
	    while (el && !Pjax.getHref(el)) {
	      el = el.parentNode;
	    }
	
	    if (!el || el.classList.contains(this.ignoreClassLink)) {
	      return;
	    }
	
	    var url = Pjax.getHref(el);
	
	    //Check if the link is elegible for Pjax
	    if (Pjax.preventCheck(evt, el) && !Pjax.Cache.get(url)) {
	      var xhr = Utils.xhr(url);
	      Pjax.Cache.set(url, xhr);
	    }
	  }
	};
	
	module.exports = Prefetch;


/***/ }
/******/ ])
});
;
//# sourceMappingURL=barba.js.map
!function(root, factory) {
    "function" == typeof define && define.amd ? // AMD. Register as an anonymous module unless amdModuleId is set
    define([], function() {
        return root.svg4everybody = factory();
    }) : "object" == typeof module && module.exports ? // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory() : root.svg4everybody = factory();
}(this, function() {
    /*! svg4everybody v2.1.8 | github.com/jonathantneal/svg4everybody */
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
                var use = uses[index], parent = use.parentNode, svg = getSVGAncestor(parent);
                if (svg) {
                    var src = use.getAttribute("xlink:href") || use.getAttribute("href");
                    !src && opts.attributeName && (src = use.getAttribute(opts.attributeName));
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
(function(){var f,aa="function"==typeof Object.defineProperties?Object.defineProperty:function(a,b,c){if(c.get||c.set)throw new TypeError("ES3 does not support getters and setters.");a!=Array.prototype&&a!=Object.prototype&&(a[b]=c.value)},k="undefined"!=typeof window&&window===this?this:"undefined"!=typeof global&&null!=global?global:this;function ba(){ba=function(){};k.Symbol||(k.Symbol=ca)}var da=0;function ca(a){return"jscomp_symbol_"+(a||"")+da++}
function l(){ba();var a=k.Symbol.iterator;a||(a=k.Symbol.iterator=k.Symbol("iterator"));"function"!=typeof Array.prototype[a]&&aa(Array.prototype,a,{configurable:!0,writable:!0,value:function(){return ea(this)}});l=function(){}}function ea(a){var b=0;return fa(function(){return b<a.length?{done:!1,value:a[b++]}:{done:!0}})}function fa(a){l();a={next:a};a[k.Symbol.iterator]=function(){return this};return a}
function m(a){if(!(a instanceof Array)){l();var b=a[Symbol.iterator];a=b?b.call(a):ea(a);for(var c=[];!(b=a.next()).done;)c.push(b.value);a=c}return a}function ha(a,b){function c(){}c.prototype=b.prototype;a.prototype=new c;a.prototype.constructor=a;for(var d in b)if(Object.defineProperties){var e=Object.getOwnPropertyDescriptor(b,d);e&&Object.defineProperty(a,d,e)}else a[d]=b[d]}
var n=window.Element.prototype,ia=n.matches||n.matchesSelector||n.webkitMatchesSelector||n.mozMatchesSelector||n.msMatchesSelector||n.oMatchesSelector;function ja(a,b){if(a&&1==a.nodeType&&b){if("string"==typeof b||1==b.nodeType)return a==b||ka(a,b);if("length"in b)for(var c=0,d;d=b[c];c++)if(a==d||ka(a,d))return!0}return!1}function ka(a,b){if("string"!=typeof b)return!1;if(ia)return ia.call(a,b);b=a.parentNode.querySelectorAll(b);for(var c=0,d;d=b[c];c++)if(d==a)return!0;return!1}
function la(a){for(var b=[];a&&a.parentNode&&1==a.parentNode.nodeType;)a=a.parentNode,b.push(a);return b}
function p(a,b,c){function d(a){var d;if(h.composed&&"function"==typeof a.composedPath)for(var e=a.composedPath(),g=0,E;E=e[g];g++)1==E.nodeType&&ja(E,b)&&(d=E);else a:{if((d=a.target)&&1==d.nodeType&&b)for(d=[d].concat(la(d)),e=0;g=d[e];e++)if(ja(g,b)){d=g;break a}d=void 0}d&&c.call(d,a,d)}var e=document,h={composed:!0,S:!0},h=void 0===h?{}:h;e.addEventListener(a,d,h.S);return{j:function(){e.removeEventListener(a,d,h.S)}}}
function ma(a){var b={};if(!a||1!=a.nodeType)return b;a=a.attributes;if(!a.length)return{};for(var c=0,d;d=a[c];c++)b[d.name]=d.value;return b}var na=/:(80|443)$/,q=document.createElement("a"),r={};
function t(a){a=a&&"."!=a?a:location.href;if(r[a])return r[a];q.href=a;if("."==a.charAt(0)||"/"==a.charAt(0))return t(q.href);var b="80"==q.port||"443"==q.port?"":q.port,b="0"==b?"":b,c=q.host.replace(na,"");return r[a]={hash:q.hash,host:c,hostname:q.hostname,href:q.href,origin:q.origin?q.origin:q.protocol+"//"+c,pathname:"/"==q.pathname.charAt(0)?q.pathname:"/"+q.pathname,port:b,protocol:q.protocol,search:q.search}}var u=[];
function oa(a,b){var c=this;this.context=a;this.P=b;this.f=(this.c=/Task$/.test(b))?a.get(b):a[b];this.b=[];this.a=[];this.i=function(a){for(var b=[],d=0;d<arguments.length;++d)b[d-0]=arguments[d];return c.a[c.a.length-1].apply(null,[].concat(m(b)))};this.c?a.set(b,this.i):a[b]=this.i}function v(a,b,c){a=pa(a,b);a.b.push(c);qa(a)}function w(a,b,c){a=pa(a,b);c=a.b.indexOf(c);-1<c&&(a.b.splice(c,1),0<a.b.length?qa(a):a.j())}
function qa(a){a.a=[];for(var b,c=0;b=a.b[c];c++){var d=a.a[c-1]||a.f.bind(a.context);a.a.push(b(d))}}oa.prototype.j=function(){var a=u.indexOf(this);-1<a&&(u.splice(a,1),this.c?this.context.set(this.P,this.f):this.context[this.P]=this.f)};function pa(a,b){var c=u.filter(function(c){return c.context==a&&c.P==b})[0];c||(c=new oa(a,b),u.push(c));return c}
function x(a,b,c,d,e,h){if("function"==typeof d){var g=c.get("buildHitTask");return{buildHitTask:function(c){c.set(a,null,!0);c.set(b,null,!0);d(c,e,h);g(c)}}}return y({},a,b)}function z(a,b){var c=ma(a),d={};Object.keys(c).forEach(function(a){if(!a.indexOf(b)&&a!=b+"on"){var e=c[a];"true"==e&&(e=!0);"false"==e&&(e=!1);a=ra(a.slice(b.length));d[a]=e}});return d}
function sa(a){"loading"==document.readyState?document.addEventListener("DOMContentLoaded",function c(){document.removeEventListener("DOMContentLoaded",c);a()}):a()}function ta(a,b){var c;return function(d){for(var e=[],h=0;h<arguments.length;++h)e[h-0]=arguments[h];clearTimeout(c);c=setTimeout(function(){return a.apply(null,[].concat(m(e)))},b)}}function ua(a){function b(){c||(c=!0,a())}var c=!1;setTimeout(b,2E3);return b}var A={};
function va(a,b){function c(){clearTimeout(e.timeout);e.send&&w(a,"send",e.send);delete A[d];e.R.forEach(function(a){return a()})}var d=a.get("trackingId"),e=A[d]=A[d]||{};clearTimeout(e.timeout);e.timeout=setTimeout(c,0);e.R=e.R||[];e.R.push(b);e.send||(e.send=function(a){return function(b){for(var d=[],e=0;e<arguments.length;++e)d[e-0]=arguments[e];c();a.apply(null,[].concat(m(d)))}},v(a,"send",e.send))}
var y=Object.assign||function(a,b){for(var c=[],d=1;d<arguments.length;++d)c[d-1]=arguments[d];for(var d=0,e=c.length;d<e;d++){var h=Object(c[d]),g;for(g in h)Object.prototype.hasOwnProperty.call(h,g)&&(a[g]=h[g])}return a};function ra(a){return a.replace(/[\-\_]+(\w?)/g,function(a,c){return c.toUpperCase()})}function B(a){return"object"==typeof a&&null!==a}
function C(a,b){var c=window.GoogleAnalyticsObject||"ga";window[c]=window[c]||function(a){for(var b=[],d=0;d<arguments.length;++d)b[d-0]=arguments[d];(window[c].q=window[c].q||[]).push(b)};window.gaDevIds=window.gaDevIds||[];0>window.gaDevIds.indexOf("i5iSjo")&&window.gaDevIds.push("i5iSjo");window[c]("provide",a,b);window.gaplugins=window.gaplugins||{};window.gaplugins[a.charAt(0).toUpperCase()+a.slice(1)]=b}var F={T:1,U:2,V:3,X:4,Y:5,Z:6,$:7,aa:8,ba:9,W:10},G=Object.keys(F).length;
function H(a,b){a.set("\x26_av","2.3.2");var c=a.get("\x26_au"),c=parseInt(c||"0",16).toString(2);if(c.length<G)for(var d=G-c.length;d;)c="0"+c,d--;b=G-b;c=c.substr(0,b)+1+c.substr(b+1);a.set("\x26_au",parseInt(c||"0",2).toString(16))}function I(a,b){H(a,F.T);this.a=y({},b);this.i=a;this.b=this.a.stripQuery&&this.a.queryDimensionIndex?"dimension"+this.a.queryDimensionIndex:null;this.f=this.f.bind(this);this.c=this.c.bind(this);v(a,"get",this.f);v(a,"buildHitTask",this.c)}
I.prototype.f=function(a){var b=this;return function(c){if("page"==c||c==b.b){var d={location:a("location"),page:a("page")};return wa(b,d)[c]}return a(c)}};I.prototype.c=function(a){var b=this;return function(c){var d=wa(b,{location:c.get("location"),page:c.get("page")});c.set(d,null,!0);a(c)}};
function wa(a,b){var c=t(b.page||b.location),d=c.pathname;if(a.a.indexFilename){var e=d.split("/");a.a.indexFilename==e[e.length-1]&&(e[e.length-1]="",d=e.join("/"))}"remove"==a.a.trailingSlash?d=d.replace(/\/+$/,""):"add"==a.a.trailingSlash&&(/\.\w+$/.test(d)||"/"==d.substr(-1)||(d+="/"));d={page:d+(a.a.stripQuery?"":c.search)};b.location&&(d.location=b.location);a.b&&(d[a.b]=c.search.slice(1)||"(not set)");return"function"==typeof a.a.urlFieldsFilter?(b=a.a.urlFieldsFilter(d,t),c={},c.page=b.page,
c.location=b.location,c[a.b]=b[a.b],c):d}I.prototype.remove=function(){w(this.i,"get",this.f);w(this.i,"buildHitTask",this.c)};C("cleanUrlTracker",I);function J(a,b){var c=this;H(a,F.U);if(window.addEventListener){this.a=y({events:["click"],fieldsObj:{},attributePrefix:"ga-"},b);this.f=a;this.c=this.c.bind(this);var d="["+this.a.attributePrefix+"on]";this.b={};this.a.events.forEach(function(a){c.b[a]=p(a,d,c.c)})}}
J.prototype.c=function(a,b){var c=this.a.attributePrefix;if(!(0>b.getAttribute(c+"on").split(/\s*,\s*/).indexOf(a.type))){var c=z(b,c),d=y({},this.a.fieldsObj,c);this.f.send(c.hitType||"event",x({transport:"beacon"},d,this.f,this.a.hitFilter,b,a))}};J.prototype.remove=function(){var a=this;Object.keys(this.b).forEach(function(b){a.b[b].j()})};C("eventTracker",J);
function xa(a,b){var c=this;H(a,F.V);window.IntersectionObserver&&window.MutationObserver&&(this.a=y({rootMargin:"0px",fieldsObj:{},attributePrefix:"ga-"},b),this.c=a,this.M=this.M.bind(this),this.O=this.O.bind(this),this.K=this.K.bind(this),this.L=this.L.bind(this),this.b=null,this.items=[],this.h={},this.g={},sa(function(){c.a.elements&&c.observeElements(c.a.elements)}))}f=xa.prototype;
f.observeElements=function(a){var b=this;a=K(this,a);this.items=this.items.concat(a.items);this.h=y({},a.h,this.h);this.g=y({},a.g,this.g);a.items.forEach(function(a){var c=b.g[a.threshold]=b.g[a.threshold]||new IntersectionObserver(b.O,{rootMargin:b.a.rootMargin,threshold:[+a.threshold]});(a=b.h[a.id]||(b.h[a.id]=document.getElementById(a.id)))&&c.observe(a)});this.b||(this.b=new MutationObserver(this.M),this.b.observe(document.body,{childList:!0,subtree:!0}));requestAnimationFrame(function(){})};
f.unobserveElements=function(a){var b=[],c=[];this.items.forEach(function(d){a.some(function(a){a=ya(a);return a.id===d.id&&a.threshold===d.threshold&&a.trackFirstImpressionOnly===d.trackFirstImpressionOnly})?c.push(d):b.push(d)});if(b.length){var d=K(this,b),e=K(this,c);this.items=d.items;this.h=d.h;this.g=d.g;c.forEach(function(a){if(!d.h[a.id]){var b=e.g[a.threshold],c=e.h[a.id];c&&b.unobserve(c);d.g[a.threshold]||e.g[a.threshold].disconnect()}})}else this.unobserveAllElements()};
f.unobserveAllElements=function(){var a=this;Object.keys(this.g).forEach(function(b){a.g[b].disconnect()});this.b.disconnect();this.b=null;this.items=[];this.h={};this.g={}};function K(a,b){var c=[],d={},e={};b.length&&b.forEach(function(b){b=ya(b);c.push(b);e[b.id]=a.h[b.id]||null;d[b.threshold]=a.g[b.threshold]||null});return{items:c,h:e,g:d}}f.M=function(a){for(var b=0,c;c=a[b];b++){for(var d=0,e;e=c.removedNodes[d];d++)L(this,e,this.L);for(d=0;e=c.addedNodes[d];d++)L(this,e,this.K)}};
function L(a,b,c){1==b.nodeType&&b.id in a.h&&c(b.id);for(var d=0,e;e=b.childNodes[d];d++)L(a,e,c)}
f.O=function(a){for(var b=[],c=0,d;d=a[c];c++)for(var e=0,h;h=this.items[e];e++){var g;if(g=d.target.id===h.id)(g=h.threshold)?g=d.intersectionRatio>=g:(g=d.intersectionRect,g=0<g.top||0<g.bottom||0<g.left||0<g.right);if(g){var D=h.id;g=document.getElementById(D);var D={transport:"beacon",eventCategory:"Viewport",eventAction:"impression",eventLabel:D,nonInteraction:!0},Ia=y({},this.a.fieldsObj,z(g,this.a.attributePrefix));this.c.send("event",x(D,Ia,this.c,this.a.hitFilter,g));h.trackFirstImpressionOnly&&
b.push(h)}}b.length&&this.unobserveElements(b)};f.K=function(a){var b=this,c=this.h[a]=document.getElementById(a);this.items.forEach(function(d){a==d.id&&b.g[d.threshold].observe(c)})};f.L=function(a){var b=this,c=this.h[a];this.items.forEach(function(d){a==d.id&&b.g[d.threshold].unobserve(c)});this.h[a]=null};f.remove=function(){this.unobserveAllElements()};C("impressionTracker",xa);function ya(a){"string"==typeof a&&(a={id:a});return y({threshold:0,trackFirstImpressionOnly:!0},a)}
function za(){this.a={}}function Aa(a,b){(a.a.externalSet=a.a.externalSet||[]).push(b)}za.prototype.ca=function(a,b){for(var c=[],d=1;d<arguments.length;++d)c[d-1]=arguments[d];(this.a[a]=this.a[a]||[]).forEach(function(a){return a.apply(null,[].concat(m(c)))})};var M={},N=!1,O;function P(a,b){b=void 0===b?{}:b;this.a={};this.b=a;this.w=b;this.l=null}ha(P,za);function Q(a,b,c){a=["autotrack",a,b].join(":");M[a]||(M[a]=new P(a,c),N||(window.addEventListener("storage",Ba),N=!0));return M[a]}
function R(){if(null!=O)return O;try{window.localStorage.setItem("autotrack","autotrack"),window.localStorage.removeItem("autotrack"),O=!0}catch(a){O=!1}return O}P.prototype.get=function(){if(this.l)return this.l;if(R())try{this.l=S(window.localStorage.getItem(this.b))}catch(a){}return this.l=y({},this.w,this.l)};P.prototype.set=function(a){this.l=y({},this.w,this.l,a);if(R())try{var b=JSON.stringify(this.l);window.localStorage.setItem(this.b,b)}catch(c){}};
function Ca(a){a.l={};if(R())try{window.localStorage.removeItem(a.b)}catch(b){}}P.prototype.j=function(){delete M[this.b];Object.keys(M).length||(window.removeEventListener("storage",Ba),N=!1)};function Ba(a){var b=M[a.key];if(b){var c=y({},b.w,S(a.oldValue));a=y({},b.w,S(a.newValue));b.l=a;b.ca("externalSet",a,c)}}function S(a){var b={};if(a)try{b=JSON.parse(a)}catch(c){}return b}var Da={};
function T(a,b,c){this.f=a;this.timeout=b||U;this.timeZone=c;this.b=this.b.bind(this);v(a,"sendHitTask",this.b);try{this.c=new Intl.DateTimeFormat("en-US",{timeZone:this.timeZone})}catch(d){}this.a=Q(a.get("trackingId"),"session",{hitTime:0,isExpired:!1})}T.prototype.isExpired=function(a){a=a?a:this.a.get();if(a.isExpired)return!0;var b=new Date,c=(a=a.hitTime)&&new Date(a);return a&&(b-c>6E4*this.timeout||this.c&&this.c.format(b)!=this.c.format(c))?!0:!1};
T.prototype.b=function(a){var b=this;return function(c){a(c);var d=b.a.get(),e=b.isExpired(d);c=c.get("sessionControl");d.hitTime=+new Date;if("start"==c||e)d.isExpired=!1;"end"==c&&(d.isExpired=!0);b.a.set(d)}};T.prototype.j=function(){w(this.f,"sendHitTask",this.b);this.a.j();delete Da[this.f.get("trackingId")]};var U=30;
function V(a,b){H(a,F.W);window.addEventListener&&(this.a=y({increaseThreshold:20,sessionTimeout:U,fieldsObj:{}},b),this.c=a,this.b=Ea(this),this.f=ta(this.f.bind(this),500),this.m=this.m.bind(this),this.i=Q(a.get("trackingId"),"plugins/max-scroll-tracker"),this.s=new T(a,this.a.sessionTimeout,this.a.timeZone),v(a,"set",this.m),Fa(this))}function Fa(a){100>(a.i.get()[a.b]||0)&&window.addEventListener("scroll",a.f)}
V.prototype.f=function(){var a=document.documentElement,b=document.body,a=Math.min(100,Math.max(0,Math.round(window.pageYOffset/(Math.max(a.offsetHeight,a.scrollHeight,b.offsetHeight,b.scrollHeight)-window.innerHeight)*100)));if(this.s.isExpired())Ca(this.i);else if(b=this.i.get()[this.b]||0,a>b&&(100!=a&&100!=b||window.removeEventListener("scroll",this.f),b=a-b,100==a||b>=this.a.increaseThreshold)){var c={};this.i.set((c[this.b]=a,c));a={transport:"beacon",eventCategory:"Max Scroll",eventAction:"increase",
eventValue:b,eventLabel:String(a),nonInteraction:!0};this.a.maxScrollMetricIndex&&(a["metric"+this.a.maxScrollMetricIndex]=b);this.c.send("event",x(a,this.a.fieldsObj,this.c,this.a.hitFilter))}};V.prototype.m=function(a){var b=this;return function(c,d){a(c,d);var e={};(B(c)?c:(e[c]=d,e)).page&&(c=b.b,b.b=Ea(b),b.b!=c&&Fa(b))}};function Ea(a){a=t(a.c.get("page")||a.c.get("location"));return a.pathname+a.search}
V.prototype.remove=function(){this.s.j();window.removeEventListener("scroll",this.f);w(this.c,"set",this.m)};C("maxScrollTracker",V);var Ga={};function W(a,b){H(a,F.X);window.matchMedia&&(this.a=y({changeTemplate:this.changeTemplate,changeTimeout:1E3,fieldsObj:{}},b),B(this.a.definitions)&&(b=this.a.definitions,this.a.definitions=Array.isArray(b)?b:[b],this.b=a,this.c=[],Ha(this)))}
function Ha(a){a.a.definitions.forEach(function(b){if(b.name&&b.dimensionIndex){var c=Ja(b);a.b.set("dimension"+b.dimensionIndex,c);Ka(a,b)}})}function Ja(a){var b;a.items.forEach(function(a){La(a.media).matches&&(b=a)});return b?b.name:"(not set)"}
function Ka(a,b){b.items.forEach(function(c){c=La(c.media);var d=ta(function(){var c=Ja(b),d=a.b.get("dimension"+b.dimensionIndex);c!==d&&(a.b.set("dimension"+b.dimensionIndex,c),c={transport:"beacon",eventCategory:b.name,eventAction:"change",eventLabel:a.a.changeTemplate(d,c),nonInteraction:!0},a.b.send("event",x(c,a.a.fieldsObj,a.b,a.a.hitFilter)))},a.a.changeTimeout);c.addListener(d);a.c.push({fa:c,da:d})})}W.prototype.remove=function(){for(var a=0,b;b=this.c[a];a++)b.fa.removeListener(b.da)};
W.prototype.changeTemplate=function(a,b){return a+" \x3d\x3e "+b};C("mediaQueryTracker",W);function La(a){return Ga[a]||(Ga[a]=window.matchMedia(a))}function X(a,b){H(a,F.Y);window.addEventListener&&(this.a=y({formSelector:"form",shouldTrackOutboundForm:this.shouldTrackOutboundForm,fieldsObj:{},attributePrefix:"ga-"},b),this.b=a,this.c=p("submit",this.a.formSelector,this.f.bind(this)))}
X.prototype.f=function(a,b){var c={transport:"beacon",eventCategory:"Outbound Form",eventAction:"submit",eventLabel:t(b.action).href};if(this.a.shouldTrackOutboundForm(b,t)){navigator.sendBeacon||(a.preventDefault(),c.hitCallback=ua(function(){b.submit()}));var d=y({},this.a.fieldsObj,z(b,this.a.attributePrefix));this.b.send("event",x(c,d,this.b,this.a.hitFilter,b,a))}};
X.prototype.shouldTrackOutboundForm=function(a,b){a=b(a.action);return a.hostname!=location.hostname&&"http"==a.protocol.slice(0,4)};X.prototype.remove=function(){this.c.j()};C("outboundFormTracker",X);
function Y(a,b){var c=this;H(a,F.Z);window.addEventListener&&(this.a=y({events:["click"],linkSelector:"a, area",shouldTrackOutboundLink:this.shouldTrackOutboundLink,fieldsObj:{},attributePrefix:"ga-"},b),this.f=a,this.c=this.c.bind(this),this.b={},this.a.events.forEach(function(a){c.b[a]=p(a,c.a.linkSelector,c.c)}))}
Y.prototype.c=function(a,b){if(this.a.shouldTrackOutboundLink(b,t)){var c=b.getAttribute("href")||b.getAttribute("xlink:href"),d=t(c),e={transport:"beacon",eventCategory:"Outbound Link",eventAction:a.type,eventLabel:d.href};navigator.sendBeacon||"click"!=a.type||"_blank"==b.target||a.metaKey||a.ctrlKey||a.shiftKey||a.altKey||1<a.which||window.addEventListener("click",function(a){a.defaultPrevented||(a.preventDefault(),e.hitCallback=ua(function(){location.href=c}))});d=y({},this.a.fieldsObj,z(b,this.a.attributePrefix));
this.f.send("event",x(e,d,this.f,this.a.hitFilter,b,a))}};Y.prototype.shouldTrackOutboundLink=function(a,b){a=a.getAttribute("href")||a.getAttribute("xlink:href");b=b(a);return b.hostname!=location.hostname&&"http"==b.protocol.slice(0,4)};Y.prototype.remove=function(){var a=this;Object.keys(this.b).forEach(function(b){a.b[b].j()})};C("outboundLinkTracker",Y);var Z=function Ma(b){return b?(b^16*Math.random()>>b/4).toString(16):"10000000-1000-4000-8000-100000000000".replace(/[018]/g,Ma)}();
function Na(a,b){var c=this;H(a,F.$);document.visibilityState&&(this.a=y({sessionTimeout:U,visibleThreshold:5E3,sendInitialPageview:!1,fieldsObj:{}},b),this.b=a,this.i=this.f=null,this.s=!1,this.v=this.v.bind(this),this.o=this.o.bind(this),this.G=this.G.bind(this),this.N=this.N.bind(this),this.c=Q(a.get("trackingId"),"plugins/page-visibility-tracker"),Aa(this.c,this.N),this.m=new T(a,this.a.sessionTimeout,this.a.timeZone),v(a,"set",this.v),window.addEventListener("unload",this.G),document.addEventListener("visibilitychange",
this.o),this.o(),va(this.b,function(){if("visible"==document.visibilityState)c.a.sendInitialPageview&&(Oa(c,{ea:!0}),c.s=!0);else if(c.a.sendInitialPageview&&c.a.pageLoadsMetricIndex){var a={},a=(a.transport="beacon",a.eventCategory="Page Visibility",a.eventAction="page load",a.eventLabel="(not set)",a["metric"+c.a.pageLoadsMetricIndex]=1,a.nonInteraction=!0,a);c.b.send("event",x(a,c.a.fieldsObj,c.b,c.a.hitFilter))}}))}f=Na.prototype;
f.o=function(){var a=this;if("visible"==document.visibilityState||"hidden"==document.visibilityState){var b=Pa(this,this.c.get()),c={time:+new Date,state:document.visibilityState,pageId:Z};this.f&&"visible"==document.visibilityState&&this.a.sendInitialPageview&&!this.s&&(Oa(this),this.s=!0);this.i&&"hidden"==document.visibilityState&&clearTimeout(this.i);this.m.isExpired()?"hidden"==this.f&&"visible"==document.visibilityState?(clearTimeout(this.i),this.i=setTimeout(function(){a.c.set(c);Oa(a,{hitTime:c.time})},
this.a.visibleThreshold)):"hidden"==document.visibilityState&&Ca(this.c):(b.pageId==Z&&"visible"==b.state&&Qa(this,b),this.c.set(c));this.f=document.visibilityState}};function Pa(a,b){"visible"==a.f&&"hidden"==b.state&&b.pageId!=Z&&(b.state="visible",b.pageId=Z,a.c.set(b));return b}
function Qa(a,b,c){c=(c?c:{}).hitTime;var d={hitTime:c},d=(d?d:{}).hitTime;(b=b.time&&!a.m.isExpired()?(d||+new Date)-b.time:0)&&b>=a.a.visibleThreshold&&(b=Math.round(b/1E3),d={transport:"beacon",nonInteraction:!0,eventCategory:"Page Visibility",eventAction:"track",eventValue:b,eventLabel:"(not set)"},c&&(d.queueTime=+new Date-c),a.a.visibleMetricIndex&&(d["metric"+a.a.visibleMetricIndex]=b),a.b.send("event",x(d,a.a.fieldsObj,a.b,a.a.hitFilter)))}
function Oa(a,b){var c=b?b:{};b=c.hitTime;var c=c.ea,d={transport:"beacon"};b&&(d.queueTime=+new Date-b);c&&a.a.pageLoadsMetricIndex&&(d["metric"+a.a.pageLoadsMetricIndex]=1);a.b.send("pageview",x(d,a.a.fieldsObj,a.b,a.a.hitFilter))}f.v=function(a){var b=this;return function(c,d){var e={},e=B(c)?c:(e[c]=d,e);e.page&&e.page!==b.b.get("page")&&"visible"==b.f&&b.o();a(c,d)}};f.N=function(a,b){a.time!=b.time&&b.pageId==Z&&"visible"==b.state&&Qa(this,b,{hitTime:a.time})};
f.G=function(){"hidden"!=this.f&&this.o()};f.remove=function(){this.c.j();this.m.j();w(this.b,"set",this.v);window.removeEventListener("unload",this.G);document.removeEventListener("visibilitychange",this.o)};C("pageVisibilityTracker",Na);
function Ra(a,b){H(a,F.aa);window.addEventListener&&(this.a=y({fieldsObj:{},hitFilter:null},b),this.b=a,this.u=this.u.bind(this),this.J=this.J.bind(this),this.D=this.D.bind(this),this.A=this.A.bind(this),this.B=this.B.bind(this),this.F=this.F.bind(this),"complete"!=document.readyState?window.addEventListener("load",this.u):this.u())}f=Ra.prototype;
f.u=function(){if(window.FB)try{window.FB.Event.subscribe("edge.create",this.B),window.FB.Event.subscribe("edge.remove",this.F)}catch(a){}window.twttr&&this.J()};f.J=function(){var a=this;try{window.twttr.ready(function(){window.twttr.events.bind("tweet",a.D);window.twttr.events.bind("follow",a.A)})}catch(b){}};function Sa(a){try{window.twttr.ready(function(){window.twttr.events.unbind("tweet",a.D);window.twttr.events.unbind("follow",a.A)})}catch(b){}}
f.D=function(a){if("tweet"==a.region){var b={transport:"beacon",socialNetwork:"Twitter",socialAction:"tweet",socialTarget:a.data.url||a.target.getAttribute("data-url")||location.href};this.b.send("social",x(b,this.a.fieldsObj,this.b,this.a.hitFilter,a.target,a))}};
f.A=function(a){if("follow"==a.region){var b={transport:"beacon",socialNetwork:"Twitter",socialAction:"follow",socialTarget:a.data.screen_name||a.target.getAttribute("data-screen-name")};this.b.send("social",x(b,this.a.fieldsObj,this.b,this.a.hitFilter,a.target,a))}};f.B=function(a){this.b.send("social",x({transport:"beacon",socialNetwork:"Facebook",socialAction:"like",socialTarget:a},this.a.fieldsObj,this.b,this.a.hitFilter))};
f.F=function(a){this.b.send("social",x({transport:"beacon",socialNetwork:"Facebook",socialAction:"unlike",socialTarget:a},this.a.fieldsObj,this.b,this.a.hitFilter))};f.remove=function(){window.removeEventListener("load",this.u);try{window.FB.Event.unsubscribe("edge.create",this.B),window.FB.Event.unsubscribe("edge.remove",this.F)}catch(a){}Sa(this)};C("socialWidgetTracker",Ra);
function Ta(a,b){H(a,F.ba);history.pushState&&window.addEventListener&&(this.a=y({shouldTrackUrlChange:this.shouldTrackUrlChange,trackReplaceState:!1,fieldsObj:{},hitFilter:null},b),this.b=a,this.c=location.pathname+location.search,this.H=this.H.bind(this),this.I=this.I.bind(this),this.C=this.C.bind(this),v(history,"pushState",this.H),v(history,"replaceState",this.I),window.addEventListener("popstate",this.C))}f=Ta.prototype;
f.H=function(a){var b=this;return function(c){for(var d=[],e=0;e<arguments.length;++e)d[e-0]=arguments[e];a.apply(null,[].concat(m(d)));Ua(b,!0)}};f.I=function(a){var b=this;return function(c){for(var d=[],e=0;e<arguments.length;++e)d[e-0]=arguments[e];a.apply(null,[].concat(m(d)));Ua(b,!1)}};f.C=function(){Ua(this,!0)};
function Ua(a,b){setTimeout(function(){var c=a.c,d=location.pathname+location.search;c!=d&&a.a.shouldTrackUrlChange.call(a,d,c)&&(a.c=d,a.b.set({page:d,title:document.title}),(b||a.a.trackReplaceState)&&a.b.send("pageview",x({transport:"beacon"},a.a.fieldsObj,a.b,a.a.hitFilter)))},0)}f.shouldTrackUrlChange=function(a,b){return!(!a||!b)};f.remove=function(){w(history,"pushState",this.H);w(history,"replaceState",this.I);window.removeEventListener("popstate",this.C)};C("urlChangeTracker",Ta);})();
//# sourceMappingURL=autotrack.js.map