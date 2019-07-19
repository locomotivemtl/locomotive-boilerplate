(function () {
  'use strict';

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
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
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    }
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  function _iterableToArrayLimit(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }

  var _default =
  /*#__PURE__*/
  function () {
    function _default(options) {
      _classCallCheck(this, _default);

      this.mAttr = 'data-' + options.dataName;
      this.el = options.el;
    }

    _createClass(_default, [{
      key: "mInit",
      value: function mInit(modules) {
        var _this = this;

        this.modules = modules;
        this.mCheckEventTarget = this.mCheckEventTarget.bind(this);

        if (this.events) {
          Object.keys(this.events).forEach(function (event) {
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
          Object.keys(this.events).forEach(function (event) {
            return _this2.mRemoveEvent(event);
          });
        }
      }
    }, {
      key: "mAddEvent",
      value: function mAddEvent(event) {
        this.el.addEventListener(event, this.mCheckEventTarget);
      }
    }, {
      key: "mRemoveEvent",
      value: function mRemoveEvent(event) {
        this.el.removeEventListener(event, this.mCheckEventTarget);
      }
    }, {
      key: "mCheckEventTarget",
      value: function mCheckEventTarget(e) {
        var event = this.events[e.type];

        if (typeof event === "string") {
          this[event](e);
        } else {
          var data = '[' + this.mAttr + ']';
          var target = e.target;

          while (target && target !== document) {
            if (target.matches(data)) {
              var name = target.getAttribute(this.mAttr);

              if (event.hasOwnProperty(name)) {
                var method = event[name];
                Object.defineProperty(e, 'currentTarget', {
                  value: target
                });
                this[method](e);
                break;
              }
            }

            target = target.parentNode;
          }
        }
      }
    }, {
      key: "$",
      value: function $(query, context) {
        var classIndex = query.indexOf('.');
        var idIndex = query.indexOf('#');
        var attrIndex = query.indexOf('[');
        var indexes = [classIndex, idIndex, attrIndex].filter(function (index) {
          return index != -1;
        });
        var index = false;
        var name = query;
        var more = '';
        var parent = this.el;

        if (indexes.length) {
          index = Math.min.apply(Math, _toConsumableArray(indexes));
          name = query.slice(0, index);
          more = query.slice(index);
        }

        if (_typeof(context) == 'object') {
          parent = context;
        }

        return parent.querySelectorAll('[' + this.mAttr + '=' + name + ']' + more);
      }
    }, {
      key: "parent",
      value: function parent(query, context) {
        var data = '[' + this.mAttr + '=' + query + ']';
        var parent = context;

        while (parent && parent !== document) {
          if (parent.matches(data)) {
            return parent;
          }

          parent = parent.parentNode;
        }
      }
    }, {
      key: "data",
      value: function data(name, context) {
        var target = context || this.el;
        return target.getAttribute(this.mAttr + '-' + name);
      }
    }, {
      key: "call",
      value: function call(func, args, mod, id) {
        var _this3 = this;

        if (args && !mod) {
          mod = args;
          args = false;
        }

        if (id) {
          this.modules[mod][id][func](args);
        } else {
          Object.keys(this.modules[mod]).forEach(function (id) {
            _this3.modules[mod][id][func](args);
          });
        }
      }
    }, {
      key: "init",
      value: function init() {}
    }, {
      key: "destroy",
      value: function destroy() {}
    }]);

    return _default;
  }();

  var _default$1 =
  /*#__PURE__*/
  function () {
    function _default(options) {
      _classCallCheck(this, _default);

      this.app;
      this.modules = options.modules;
      this.currentModules = {};
      this.activeModules = {};
      this.newModules = {};
      this.moduleId = 0;
    }

    _createClass(_default, [{
      key: "init",
      value: function init(app, scope) {
        var _this = this;

        var container = scope || document;
        var elements = container.querySelectorAll('*');

        if (app && !this.app) {
          this.app = app;
        }

        this.activeModules['app'] = {
          'app': this.app
        };
        elements.forEach(function (el) {
          Array.from(el.attributes).forEach(function (i) {
            if (i.name.startsWith('data-module')) {
              var moduleExists = false;
              var dataName = i.name.split('-').splice(2);

              var moduleName = _this.toCamel(dataName);

              if (_this.modules[moduleName]) {
                moduleExists = true;
              } else if (_this.modules[_this.toUpper(moduleName)]) {
                moduleName = _this.toUpper(moduleName);
                moduleExists = true;
              }

              if (moduleExists) {
                var options = {
                  el: el,
                  name: moduleName,
                  dataName: dataName.join('-')
                };
                var module = new _this.modules[moduleName](options);
                var id = i.value;

                if (!id) {
                  _this.moduleId++;
                  id = 'm' + _this.moduleId;
                  el.setAttribute(i.name, id);
                }

                _this.addActiveModule(moduleName, id, module);

                var moduleId = moduleName + '-' + id;

                if (scope) {
                  _this.newModules[moduleId] = module;
                } else {
                  _this.currentModules[moduleId] = module;
                }
              }
            }
          });
        });
        Object.entries(this.currentModules).forEach(function (_ref) {
          var _ref2 = _slicedToArray(_ref, 2),
              id = _ref2[0],
              module = _ref2[1];

          if (scope) {
            var split = id.split('-');
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
        Object.entries(this.currentModules).forEach(function (_ref3) {
          var _ref4 = _slicedToArray(_ref3, 2),
              id = _ref4[0],
              module = _ref4[1];

          module.mUpdate(_this2.activeModules);
        });
        Object.entries(this.newModules).forEach(function (_ref5) {
          var _ref6 = _slicedToArray(_ref5, 2),
              id = _ref6[0],
              module = _ref6[1];

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

        var elements = scope.querySelectorAll('*');
        elements.forEach(function (el) {
          Array.from(el.attributes).forEach(function (i) {
            if (i.name.startsWith('data-module')) {
              var name = i.name.split('-').pop();
              var id = i.value;
              var moduleName = _this3.toUpper(name) + '-' + id;
              var module = _this3.currentModules[moduleName];

              if (module) {
                _this3.destroyModule(module);

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

        Object.entries(this.currentModules).forEach(function (_ref7) {
          var _ref8 = _slicedToArray(_ref7, 2),
              id = _ref8[0],
              module = _ref8[1];

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

        return arr.reduce(function (a, b) {
          return a + _this5.toUpper(b);
        });
      }
    }, {
      key: "toUpper",
      value: function toUpper(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
      }
    }]);

    return _default;
  }();

  function _classCallCheck$1(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties$1(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass$1(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties$1(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties$1(Constructor, staticProps);
    return Constructor;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _classCallCheck$2(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties$2(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass$2(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties$2(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties$2(Constructor, staticProps);
    return Constructor;
  }

  function _slicedToArray$1(arr, i) {
    return _arrayWithHoles$1(arr) || _iterableToArrayLimit$1(arr, i) || _nonIterableRest$1();
  }

  function _arrayWithHoles$1(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit$1(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _nonIterableRest$1() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }

  var _default$2 =
  /*#__PURE__*/
  function () {
    function _default(options) {
      _classCallCheck$2(this, _default);

      this.defaults = {
        name: 'load',
        loadingClass: 'is-loading',
        loadedClass: 'is-loaded',
        readyClass: 'is-ready',
        transitionsPrefix: 'is-',
        enterDelay: 0,
        exitDelay: 0,
        loadedDelay: 0,
        isLoaded: false,
        isEntered: false,
        isUrl: false,
        transitionContainer: null
      };
      Object.assign(this, this.defaults, options);
      this.options = options;
      this.namespace = 'modular';
      this.html = document.documentElement;
      this.href = window.location.href;
      this.container = 'data-' + this.name + '-container';
      this.subContainer = false;
      this.prevTransition = null;
      this.loadAttributes = ['src', 'srcset', 'style', 'href'];
      this.isInserted = false;
      this.isLoading = false;
      this.enterTimeout = false;
      this.controller = new AbortController();
      this.classContainer = this.html;
      this.isChrome = navigator.userAgent.indexOf("Chrome") != -1 ? true : false;
      this.init();
    }

    _createClass$2(_default, [{
      key: "init",
      value: function init() {
        var _this = this;

        window.addEventListener('popstate', function (e) {
          return _this.checkState(e);
        }, false);
        this.html.addEventListener('click', function (e) {
          return _this.checkClick(e);
        }, false);
        this.loadEls(document);
      }
    }, {
      key: "checkClick",
      value: function checkClick(e) {
        if (!e.ctrlKey && !e.metaKey) {
          var target = e.target;

          while (target && target !== document) {
            if (target.matches('a')) {
              var href = target.getAttribute('href');

              if (!href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
                e.preventDefault();
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
        this.transition = link.getAttribute('data-' + this.name);
        this.isUrl = link.getAttribute('data-' + this.name + '-url');
        var href = link.getAttribute('href');
        var target = link.getAttribute('target');

        if (target == '_blank') {
          window.open(href, '_blank');
          return;
        }

        if (this.transition == 'false') {
          window.location = href;
          return;
        }

        this.setOptions(href, true);
      }
    }, {
      key: "getStateOptions",
      value: function getStateOptions() {
        this.transition = history.state;
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
        var container = '[' + this.container + ']';
        var oldContainer;

        if (this.transition && this.transition != 'true') {
          this.transitionContainer = '[' + this.container + '="' + this.transition + '"]';
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

        if (this.isUrl === '' || this.isUrl != null && this.isUrl != 'false' && this.isUrl != false) {
          history.pushState(this.transition, null, href);
        } else {
          this.oldContainer.classList.add('is-old');
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

        var loadingEvent = new Event(this.namespace + 'loading');
        window.dispatchEvent(loadingEvent);
      }
    }, {
      key: "startEnterDelay",
      value: function startEnterDelay() {
        var _this2 = this;

        this.enterTimeout = window.setTimeout(function () {
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
          signal: signal
        }).then(function (response) {
          return response.text();
        }).then(function (data) {
          var parser = new DOMParser();
          _this3.data = parser.parseFromString(data, 'text/html');
          _this3.newContainer = _this3.data.querySelector(container);

          _this3.newContainer.classList.add('is-new');

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
        }).catch(function (err) {
          console.log(err);
        });

        if (push) {
          history.pushState(this.transition, null, href);
        }
      }
    }, {
      key: "transitionContainers",
      value: function transitionContainers() {
        var _this4 = this;

        this.setAttributes();
        this.showContainer();
        this.setLoaded();
        setTimeout(function () {
          _this4.removeContainer();

          _this4.setReady();
        }, this.exitDelay);
      }
    }, {
      key: "setSvgs",
      value: function setSvgs() {
        if (this.isChrome) {
          var svgs = this.newContainer.querySelectorAll('use');

          if (svgs.length) {
            svgs.forEach(function (svg) {
              var xhref = svg.getAttribute('xlink:href');

              if (xhref) {
                svg.parentNode.innerHTML = '<use xlink:href="' + xhref + '"></use>';
              } else {
                var href = svg.getAttribute('href');
                if (href) svg.parentNode.innerHTML = '<use href="' + href + '"></use>';
              }
            });
          }
        }
      }
    }, {
      key: "setAttributes",
      value: function setAttributes() {
        var _this5 = this;

        var title = this.data.getElementsByTagName('title')[0];
        var newDesc = this.data.head.querySelector('meta[name="description"]');
        var oldDesc = document.head.querySelector('meta[name="description"]');
        var container;
        var newContainer;

        if (this.subContainer) {
          newContainer = this.parentNewContainer;
          container = document.querySelector(this.transitionContainer).parentNode;
        } else {
          newContainer = this.data.querySelector('html');
          container = document.querySelector('html');
        }

        var datas = Object.assign({}, newContainer.dataset);
        if (title) document.title = title.innerHTML;
        if (oldDesc && newDesc) oldDesc.setAttribute('content', newDesc.getAttribute('content'));

        if (datas) {
          Object.entries(datas).forEach(function (_ref) {
            var _ref2 = _slicedToArray$1(_ref, 2),
                key = _ref2[0],
                val = _ref2[1];

            container.setAttribute('data-' + _this5.toDash(key), val);
          });
        }
      }
    }, {
      key: "toDash",
      value: function toDash(str) {
        return str.split(/(?=[A-Z])/).join('-').toLowerCase();
      }
    }, {
      key: "hideContainer",
      value: function hideContainer() {
        this.newContainer.style.visibility = 'hidden';
        this.newContainer.style.height = 0;
        this.newContainer.style.overflow = 'hidden';
      }
    }, {
      key: "showContainer",
      value: function showContainer() {
        this.newContainer.style.visibility = '';
        this.newContainer.style.height = '';
        this.newContainer.style.overflow = '';
      }
    }, {
      key: "loadEls",
      value: function loadEls(container) {
        var _this6 = this;

        var promises = [];
        this.loadAttributes.forEach(function (attr) {
          var data = 'data-' + _this6.name + '-' + attr;
          var els = container.querySelectorAll('[' + data + ']');

          if (els.length) {
            els.forEach(function (el) {
              var elData = el.getAttribute(data);
              el.setAttribute(attr, elData);

              if (attr == 'src' || attr == 'srcset') {
                var promise = new Promise(function (resolve) {
                  el.onload = function () {
                    return resolve(el);
                  };
                });
                promises.push(promise);
              }
            });
          }
        });
        Promise.all(promises).then(function (val) {
          var imagesEvent = new Event(_this6.namespace + 'images');
          window.dispatchEvent(imagesEvent);
        });
      }
    }, {
      key: "setLoaded",
      value: function setLoaded() {
        var _this7 = this;

        this.classContainer.classList.remove(this.loadingClass);
        setTimeout(function () {
          _this7.classContainer.classList.add(_this7.loadedClass);
        }, this.loadedDelay);
        var loadedEvent = new Event(this.namespace + 'loaded');
        window.dispatchEvent(loadedEvent);
      }
    }, {
      key: "removeContainer",
      value: function removeContainer() {
        this.parentContainer.removeChild(this.oldContainer);
        this.newContainer.classList.remove('is-new');
        this.isInserted = false;
      }
    }, {
      key: "setReady",
      value: function setReady() {
        this.classContainer.classList.add(this.readyClass);
        var readyEvent = new Event(this.namespace + 'ready');
        window.dispatchEvent(readyEvent);
      }
    }, {
      key: "on",
      value: function on(event, func) {
        var _this8 = this;

        window.addEventListener(this.namespace + event, function () {
          switch (event) {
            case 'loading':
              return func(_this8.transition, _this8.oldContainer);

            case 'loaded':
              return func(_this8.transition, _this8.oldContainer, _this8.newContainer);

            case 'ready':
              return func(_this8.transition, _this8.newContainer);

            default:
              return func();
          }
        }, false);
      }
    }]);

    return _default;
  }();

  var _default$3 =
  /*#__PURE__*/
  function (_module) {
    _inherits(_default, _module);

    function _default(m) {
      _classCallCheck$1(this, _default);

      return _possibleConstructorReturn(this, _getPrototypeOf(_default).call(this, m));
    }

    _createClass$1(_default, [{
      key: "init",
      value: function init() {
        var _this = this;

        var load = new _default$2({
          enterDelay: 0,
          transitions: {
            customTransition: {}
          }
        });
        load.on('loaded', function (transition, oldContainer, newContainer) {
          _this.call('destroy', oldContainer, 'app');

          _this.call('update', newContainer, 'app');
        });
      }
    }]);

    return _default;
  }(_default);

  /* locomotive-scroll v3.0.1 | MIT License | https://github.com/locomotivemtl/locomotive-scroll */
  function _classCallCheck$3(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties$3(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass$3(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties$3(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties$3(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty$1(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};
      var ownKeys = Object.keys(source);

      if (typeof Object.getOwnPropertySymbols === 'function') {
        ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }));
      }

      ownKeys.forEach(function (key) {
        _defineProperty$1(target, key, source[key]);
      });
    }

    return target;
  }

  function _inherits$1(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf$1(subClass, superClass);
  }

  function _getPrototypeOf$1(o) {
    _getPrototypeOf$1 = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf$1(o);
  }

  function _setPrototypeOf$1(o, p) {
    _setPrototypeOf$1 = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf$1(o, p);
  }

  function _assertThisInitialized$1(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn$1(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized$1(self);
  }

  function _superPropBase(object, property) {
    while (!Object.prototype.hasOwnProperty.call(object, property)) {
      object = _getPrototypeOf$1(object);
      if (object === null) break;
    }

    return object;
  }

  function _get(target, property, receiver) {
    if (typeof Reflect !== "undefined" && Reflect.get) {
      _get = Reflect.get;
    } else {
      _get = function _get(target, property, receiver) {
        var base = _superPropBase(target, property);

        if (!base) return;
        var desc = Object.getOwnPropertyDescriptor(base, property);

        if (desc.get) {
          return desc.get.call(receiver);
        }

        return desc.value;
      };
    }

    return _get(target, property, receiver || target);
  }

  var defaults = {
    el: document,
    elMobile: document,
    name: 'scroll',
    offset: 0,
    repeat: false,
    smooth: false,
    smoothMobile: false,
    direction: 'vertical',
    inertia: 1,
    "class": 'is-inview',
    scrollbarClass: 'c-scrollbar',
    scrollingClass: 'has-scroll-scrolling',
    draggingClass: 'has-scroll-dragging',
    smoothClass: 'has-scroll-smooth',
    initClass: 'has-scroll-init',
    getSpeed: false,
    getDirection: false
  };

  var _default$4 =
  /*#__PURE__*/
  function () {
    function _default() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck$3(this, _default);

      window.scrollTo(0, 0);
      Object.assign(this, defaults, options);
      this.namespace = 'locomotive';
      this.html = document.documentElement;
      this.windowHeight = window.innerHeight;
      this.windowMiddle = this.windowHeight / 2;
      this.els = [];
      this.hasScrollTicking = false;
      this.checkScroll = this.checkScroll.bind(this);
      this.checkResize = this.checkResize.bind(this);
      this.instance = {
        scroll: {
          x: 0,
          y: 0
        },
        limit: this.html.offsetHeight
      };

      if (this.getDirection) {
        this.instance.direction = null;
      }

      if (this.getDirection) {
        this.instance.speed = 0;
      }

      this.html.classList.add(this.initClass);
      window.addEventListener('resize', this.checkResize, false);
    }

    _createClass$3(_default, [{
      key: "init",
      value: function init() {
        this.initEvents();
      }
    }, {
      key: "checkScroll",
      value: function checkScroll() {
        this.dispatchScroll();
      }
    }, {
      key: "checkResize",
      value: function checkResize() {}
    }, {
      key: "initEvents",
      value: function initEvents() {
        var _this = this;

        this.scrollToEls = this.el.querySelectorAll("[data-".concat(this.name, "-to]"));
        this.setScrollTo = this.setScrollTo.bind(this);
        this.scrollToEls.forEach(function (el) {
          el.addEventListener('click', _this.setScrollTo, false);
        });
      }
    }, {
      key: "setScrollTo",
      value: function setScrollTo(event) {
        event.preventDefault();
        this.scrollTo(event.currentTarget.getAttribute("data-".concat(this.name, "-href")) || event.currentTarget.getAttribute('href'), event.currentTarget.getAttribute("data-".concat(this.name, "-offset")));
      }
    }, {
      key: "addElements",
      value: function addElements() {}
    }, {
      key: "detectElements",
      value: function detectElements() {
        var _this2 = this;

        var scrollTop = this.instance.scroll.y;
        var scrollBottom = scrollTop + this.windowHeight;
        this.els.forEach(function (el, i) {
          if (!el.inView) {
            if (scrollBottom >= el.top && scrollTop < el.bottom) {
              _this2.setInView(el, i);
            }
          }

          if (el.inView) {
            if (scrollBottom < el.top || scrollTop > el.bottom) {
              _this2.setOutOfView(el, i);
            }
          }
        });
        this.hasScrollTicking = false;
      }
    }, {
      key: "setInView",
      value: function setInView(current, i) {
        this.els[i].inView = true;
        current.el.classList.add(current["class"]);

        if (current.call) {
          this.dispatchCall(current, 'enter');
        }

        if (!current.repeat && current.speed === false && !current.sticky) {
          this.els.splice(i, 1);
        }
      }
    }, {
      key: "setOutOfView",
      value: function setOutOfView(current, i) {
        if (current.repeat || current.speed !== undefined) {
          this.els[i].inView = false;
        }

        if (current.call) {
          this.dispatchCall(current, 'exit');
        }

        if (current.repeat) {
          current.el.classList.remove(current["class"]);
        }
      }
    }, {
      key: "dispatchCall",
      value: function dispatchCall(current, way) {
        this.callWay = way;
        this.callValue = current.call.split(',').map(function (item) {
          return item.trim();
        });
        this.callObj = current;
        if (this.callValue.length == 1) this.callValue = this.callValue[0];
        var callEvent = new Event(this.namespace + 'call');
        window.dispatchEvent(callEvent);
      }
    }, {
      key: "dispatchScroll",
      value: function dispatchScroll() {
        var scrollEvent = new Event(this.namespace + 'scroll');
        window.dispatchEvent(scrollEvent);
      }
    }, {
      key: "setEvents",
      value: function setEvents(event, func) {
        var _this3 = this;

        window.addEventListener(this.namespace + event, function () {
          switch (event) {
            case 'scroll':
              return func(_this3.instance);

            case 'call':
              return func(_this3.callValue, _this3.callWay, _this3.callObj);

            default:
              return func();
          }
        }, false);
      }
    }, {
      key: "startScroll",
      value: function startScroll() {}
    }, {
      key: "stopScroll",
      value: function stopScroll() {}
    }, {
      key: "setScroll",
      value: function setScroll(x, y) {
        this.instance.scroll = {
          x: 0,
          y: 0
        };
      }
    }, {
      key: "destroy",
      value: function destroy() {
        var _this4 = this;

        window.removeEventListener('resize', this.checkResize, false);
        this.scrollToEls.forEach(function (el) {
          el.removeEventListener('click', _this4.setScrollTo, false);
        });
      }
    }]);

    return _default;
  }();

  var _default$1$1 =
  /*#__PURE__*/
  function (_Core) {
    _inherits$1(_default, _Core);

    function _default() {
      var _this;

      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck$3(this, _default);

      _this = _possibleConstructorReturn$1(this, _getPrototypeOf$1(_default).call(this, options));
      window.addEventListener('scroll', _this.checkScroll, false);
      return _this;
    }

    _createClass$3(_default, [{
      key: "init",
      value: function init() {
        this.instance.scroll.y = window.scrollY;
        this.addElements();
        this.detectElements();

        _get(_getPrototypeOf$1(_default.prototype), "init", this).call(this);
      }
    }, {
      key: "checkScroll",
      value: function checkScroll() {
        var _this2 = this;

        _get(_getPrototypeOf$1(_default.prototype), "checkScroll", this).call(this);

        if (this.els.length) {
          this.instance.scroll.y = window.scrollY;

          if (!this.hasScrollTicking) {
            requestAnimationFrame(function () {
              _this2.detectElements();
            });
            this.hasScrollTicking = true;
          }
        }
      }
    }, {
      key: "checkResize",
      value: function checkResize() {
        var _this3 = this;

        if (this.els.length) {
          this.windowHeight = window.innerHeight;

          if (!this.hasScrollTicking) {
            requestAnimationFrame(function () {
              _this3.updateElements();
            });
            this.hasScrollTicking = true;
          }
        }
      }
    }, {
      key: "addElements",
      value: function addElements() {
        var _this4 = this;

        var els = this.el.querySelectorAll('[data-' + this.name + ']');
        els.forEach(function (el, i) {
          var cl = el.dataset[_this4.name + 'Class'] || _this4["class"];

          var top = el.getBoundingClientRect().top + _this4.instance.scroll.y;

          var bottom = top + el.offsetHeight;
          var offset = parseInt(el.dataset[_this4.name + 'Offset']) || parseInt(_this4.offset);
          var repeat = el.dataset[_this4.name + 'Repeat'];
          var call = el.dataset[_this4.name + 'Call'];

          if (repeat == 'false') {
            repeat = false;
          } else if (repeat != undefined) {
            repeat = true;
          } else {
            repeat = _this4.repeat;
          }

          _this4.els[i] = {
            el: el,
            "class": cl,
            top: top + offset,
            bottom: bottom,
            offset: offset,
            repeat: repeat,
            inView: false,
            call: call
          };
        });
      }
    }, {
      key: "updateElements",
      value: function updateElements() {
        var _this5 = this;

        this.els.forEach(function (el, i) {
          var top = el.el.getBoundingClientRect().top + _this5.instance.scroll.y;

          var bottom = top + el.el.offsetHeight;
          _this5.els[i].top = top + el.offset;
          _this5.els[i].bottom = bottom;
        });
        this.hasScrollTicking = false;
      }
      /**
       * Scroll to a desired target.
       *
       * @param  {object} options
       * @return {void}
       */

    }, {
      key: "scrollTo",
      value: function scrollTo(targetOption, offsetOption) {
        var target;
        var offset = offsetOption ? parseInt(offsetOption) : 0;

        if (typeof targetOption === 'string') {
          if (targetOption === 'top') {
            target = this.html;
          } else if (targetOption === 'bottom') {
            offset = document.offsetHeight;
            this.html.scrollIntoView({
              behavior: 'smooth',
              block: "end",
              inline: "nearest"
            });
            return;
          } else {
            target = document.querySelectorAll(targetOption)[0];
          }
        } else if (!targetOption.target) {
          target = targetOption;
        }

        if (target) {
          offset = target.getBoundingClientRect().top + offset;
        }

        target.scrollIntoView({
          behavior: 'smooth'
        });
      }
    }, {
      key: "update",
      value: function update() {
        this.updateElements();
      }
    }, {
      key: "destroy",
      value: function destroy() {
        _get(_getPrototypeOf$1(_default.prototype), "destroy", this).call(this);

        window.removeEventListener('scroll', this.checkScroll, false);
      }
    }]);

    return _default;
  }(_default$4);

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

  var objectAssign = shouldUseNative() ? Object.assign : function (target, source) {
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

  function E () {
    // Keep this empty so it's easier to inherit from
    // (via https://github.com/lipsmack from https://github.com/scottcorgan/tiny-emitter/issues/3)
  }

  E.prototype = {
    on: function (name, callback, ctx) {
      var e = this.e || (this.e = {});

      (e[name] || (e[name] = [])).push({
        fn: callback,
        ctx: ctx
      });

      return this;
    },

    once: function (name, callback, ctx) {
      var self = this;
      function listener () {
        self.off(name, listener);
        callback.apply(ctx, arguments);
      }
      listener._ = callback;
      return this.on(name, listener, ctx);
    },

    emit: function (name) {
      var data = [].slice.call(arguments, 1);
      var evtArr = ((this.e || (this.e = {}))[name] || []).slice();
      var i = 0;
      var len = evtArr.length;

      for (i; i < len; i++) {
        evtArr[i].fn.apply(evtArr[i].ctx, data);
      }

      return this;
    },

    off: function (name, callback) {
      var e = this.e || (this.e = {});
      var evts = e[name];
      var liveEvents = [];

      if (evts && callback) {
        for (var i = 0, len = evts.length; i < len; i++) {
          if (evts[i].fn !== callback && evts[i].fn._ !== callback)
            liveEvents.push(evts[i]);
        }
      }

      // Remove event from queue to prevent memory leak
      // Suggested by https://github.com/lazd
      // Ref: https://github.com/scottcorgan/tiny-emitter/commit/c6ebfaa9bc973b33d110a84a307742b7cf94c953#commitcomment-5024910

      (liveEvents.length)
        ? e[name] = liveEvents
        : delete e[name];

      return this;
    }
  };

  var tinyEmitter = E;

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var lethargy = createCommonjsModule(function (module, exports) {
  // Generated by CoffeeScript 1.9.2
  (function() {
    var root;

    root =  exports !== null ? exports : this;

    root.Lethargy = (function() {
      function Lethargy(stability, sensitivity, tolerance, delay) {
        this.stability = stability != null ? Math.abs(stability) : 8;
        this.sensitivity = sensitivity != null ? 1 + Math.abs(sensitivity) : 100;
        this.tolerance = tolerance != null ? 1 + Math.abs(tolerance) : 1.1;
        this.delay = delay != null ? delay : 150;
        this.lastUpDeltas = (function() {
          var i, ref, results;
          results = [];
          for (i = 1, ref = this.stability * 2; 1 <= ref ? i <= ref : i >= ref; 1 <= ref ? i++ : i--) {
            results.push(null);
          }
          return results;
        }).call(this);
        this.lastDownDeltas = (function() {
          var i, ref, results;
          results = [];
          for (i = 1, ref = this.stability * 2; 1 <= ref ? i <= ref : i >= ref; 1 <= ref ? i++ : i--) {
            results.push(null);
          }
          return results;
        }).call(this);
        this.deltasTimestamp = (function() {
          var i, ref, results;
          results = [];
          for (i = 1, ref = this.stability * 2; 1 <= ref ? i <= ref : i >= ref; 1 <= ref ? i++ : i--) {
            results.push(null);
          }
          return results;
        }).call(this);
      }

      Lethargy.prototype.check = function(e) {
        var lastDelta;
        e = e.originalEvent || e;
        if (e.wheelDelta != null) {
          lastDelta = e.wheelDelta;
        } else if (e.deltaY != null) {
          lastDelta = e.deltaY * -40;
        } else if ((e.detail != null) || e.detail === 0) {
          lastDelta = e.detail * -40;
        }
        this.deltasTimestamp.push(Date.now());
        this.deltasTimestamp.shift();
        if (lastDelta > 0) {
          this.lastUpDeltas.push(lastDelta);
          this.lastUpDeltas.shift();
          return this.isInertia(1);
        } else {
          this.lastDownDeltas.push(lastDelta);
          this.lastDownDeltas.shift();
          return this.isInertia(-1);
        }
        return false;
      };

      Lethargy.prototype.isInertia = function(direction) {
        var lastDeltas, lastDeltasNew, lastDeltasOld, newAverage, newSum, oldAverage, oldSum;
        lastDeltas = direction === -1 ? this.lastDownDeltas : this.lastUpDeltas;
        if (lastDeltas[0] === null) {
          return direction;
        }
        if (this.deltasTimestamp[(this.stability * 2) - 2] + this.delay > Date.now() && lastDeltas[0] === lastDeltas[(this.stability * 2) - 1]) {
          return false;
        }
        lastDeltasOld = lastDeltas.slice(0, this.stability);
        lastDeltasNew = lastDeltas.slice(this.stability, this.stability * 2);
        oldSum = lastDeltasOld.reduce(function(t, s) {
          return t + s;
        });
        newSum = lastDeltasNew.reduce(function(t, s) {
          return t + s;
        });
        oldAverage = oldSum / lastDeltasOld.length;
        newAverage = newSum / lastDeltasNew.length;
        if (Math.abs(oldAverage) < Math.abs(newAverage * this.tolerance) && (this.sensitivity < Math.abs(newAverage))) {
          return direction;
        } else {
          return false;
        }
      };

      Lethargy.prototype.showLastUpDeltas = function() {
        return this.lastUpDeltas;
      };

      Lethargy.prototype.showLastDownDeltas = function() {
        return this.lastDownDeltas;
      };

      return Lethargy;

    })();

  }).call(commonjsGlobal);
  });

  var support = (function getSupport() {
      return {
          hasWheelEvent: 'onwheel' in document,
          hasMouseWheelEvent: 'onmousewheel' in document,
          hasTouch: 'ontouchstart' in document,
          hasTouchWin: navigator.msMaxTouchPoints && navigator.msMaxTouchPoints > 1,
          hasPointer: !!window.navigator.msPointerEnabled,
          hasKeyDown: 'onkeydown' in document,
          isFirefox: navigator.userAgent.indexOf('Firefox') > -1
      };
  })();

  var toString = Object.prototype.toString,
      hasOwnProperty$1 = Object.prototype.hasOwnProperty;

  var bindallStandalone = function(object) {
      if(!object) return console.warn('bindAll requires at least one argument.');

      var functions = Array.prototype.slice.call(arguments, 1);

      if (functions.length === 0) {

          for (var method in object) {
              if(hasOwnProperty$1.call(object, method)) {
                  if(typeof object[method] == 'function' && toString.call(object[method]) == "[object Function]") {
                      functions.push(method);
                  }
              }
          }
      }

      for(var i = 0; i < functions.length; i++) {
          var f = functions[i];
          object[f] = bind(object[f], object);
      }
  };

  /*
      Faster bind without specific-case checking. (see https://coderwall.com/p/oi3j3w).
      bindAll is only needed for events binding so no need to make slow fixes for constructor
      or partial application.
  */
  function bind(func, context) {
    return function() {
      return func.apply(context, arguments);
    };
  }

  var Lethargy = lethargy.Lethargy;



  var EVT_ID = 'virtualscroll';

  var src = VirtualScroll;

  var keyCodes = {
      LEFT: 37,
      UP: 38,
      RIGHT: 39,
      DOWN: 40,
      SPACE: 32
  };

  function VirtualScroll(options) {
      bindallStandalone(this, '_onWheel', '_onMouseWheel', '_onTouchStart', '_onTouchMove', '_onKeyDown');

      this.el = window;
      if (options && options.el) {
          this.el = options.el;
          delete options.el;
      }
      this.options = objectAssign({
          mouseMultiplier: 1,
          touchMultiplier: 2,
          firefoxMultiplier: 15,
          keyStep: 120,
          preventTouch: false,
          unpreventTouchClass: 'vs-touchmove-allowed',
          limitInertia: false,
          useKeyboard: true
      }, options);

      if (this.options.limitInertia) this._lethargy = new Lethargy();

      this._emitter = new tinyEmitter();
      this._event = {
          y: 0,
          x: 0,
          deltaX: 0,
          deltaY: 0
      };
      this.touchStartX = null;
      this.touchStartY = null;
      this.bodyTouchAction = null;

      if (this.options.passive !== undefined) {
          this.listenerOptions = {passive: this.options.passive};
      }
  }

  VirtualScroll.prototype._notify = function(e) {
      var evt = this._event;
      evt.x += evt.deltaX;
      evt.y += evt.deltaY;

     this._emitter.emit(EVT_ID, {
          x: evt.x,
          y: evt.y,
          deltaX: evt.deltaX,
          deltaY: evt.deltaY,
          originalEvent: e
     });
  };

  VirtualScroll.prototype._onWheel = function(e) {
      var options = this.options;
      if (this._lethargy && this._lethargy.check(e) === false) return;
      var evt = this._event;

      // In Chrome and in Firefox (at least the new one)
      evt.deltaX = e.wheelDeltaX || e.deltaX * -1;
      evt.deltaY = e.wheelDeltaY || e.deltaY * -1;

      // for our purpose deltamode = 1 means user is on a wheel mouse, not touch pad
      // real meaning: https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent#Delta_modes
      if(support.isFirefox && e.deltaMode == 1) {
          evt.deltaX *= options.firefoxMultiplier;
          evt.deltaY *= options.firefoxMultiplier;
      }

      evt.deltaX *= options.mouseMultiplier;
      evt.deltaY *= options.mouseMultiplier;

      this._notify(e);
  };

  VirtualScroll.prototype._onMouseWheel = function(e) {
      if (this.options.limitInertia && this._lethargy.check(e) === false) return;

      var evt = this._event;

      // In Safari, IE and in Chrome if 'wheel' isn't defined
      evt.deltaX = (e.wheelDeltaX) ? e.wheelDeltaX : 0;
      evt.deltaY = (e.wheelDeltaY) ? e.wheelDeltaY : e.wheelDelta;

      this._notify(e);
  };

  VirtualScroll.prototype._onTouchStart = function(e) {
      var t = (e.targetTouches) ? e.targetTouches[0] : e;
      this.touchStartX = t.pageX;
      this.touchStartY = t.pageY;
  };

  VirtualScroll.prototype._onTouchMove = function(e) {
      var options = this.options;
      if(options.preventTouch
          && !e.target.classList.contains(options.unpreventTouchClass)) {
          e.preventDefault();
      }

      var evt = this._event;

      var t = (e.targetTouches) ? e.targetTouches[0] : e;

      evt.deltaX = (t.pageX - this.touchStartX) * options.touchMultiplier;
      evt.deltaY = (t.pageY - this.touchStartY) * options.touchMultiplier;

      this.touchStartX = t.pageX;
      this.touchStartY = t.pageY;

      this._notify(e);
  };

  VirtualScroll.prototype._onKeyDown = function(e) {
      var evt = this._event;
      evt.deltaX = evt.deltaY = 0;
      var windowHeight = window.innerHeight - 40;

      switch(e.keyCode) {
          case keyCodes.LEFT:
          case keyCodes.UP:
              evt.deltaY = this.options.keyStep;
              break;

          case keyCodes.RIGHT:
          case keyCodes.DOWN:
              evt.deltaY = - this.options.keyStep;
              break;
          case  e.shiftKey:
              evt.deltaY = windowHeight;
              break;
          case keyCodes.SPACE:
              evt.deltaY = - windowHeight;
              break;
          default:
              return;
      }

      this._notify(e);
  };

  VirtualScroll.prototype._bind = function() {
      if(support.hasWheelEvent) this.el.addEventListener('wheel', this._onWheel, this.listenerOptions);
      if(support.hasMouseWheelEvent) this.el.addEventListener('mousewheel', this._onMouseWheel, this.listenerOptions);

      if(support.hasTouch) {
          this.el.addEventListener('touchstart', this._onTouchStart, this.listenerOptions);
          this.el.addEventListener('touchmove', this._onTouchMove, this.listenerOptions);
      }

      if(support.hasPointer && support.hasTouchWin) {
          this.bodyTouchAction = document.body.style.msTouchAction;
          document.body.style.msTouchAction = 'none';
          this.el.addEventListener('MSPointerDown', this._onTouchStart, true);
          this.el.addEventListener('MSPointerMove', this._onTouchMove, true);
      }

      if(support.hasKeyDown && this.options.useKeyboard) document.addEventListener('keydown', this._onKeyDown);
  };

  VirtualScroll.prototype._unbind = function() {
      if(support.hasWheelEvent) this.el.removeEventListener('wheel', this._onWheel);
      if(support.hasMouseWheelEvent) this.el.removeEventListener('mousewheel', this._onMouseWheel);

      if(support.hasTouch) {
          this.el.removeEventListener('touchstart', this._onTouchStart);
          this.el.removeEventListener('touchmove', this._onTouchMove);
      }

      if(support.hasPointer && support.hasTouchWin) {
          document.body.style.msTouchAction = this.bodyTouchAction;
          this.el.removeEventListener('MSPointerDown', this._onTouchStart, true);
          this.el.removeEventListener('MSPointerMove', this._onTouchMove, true);
      }

      if(support.hasKeyDown && this.options.useKeyboard) document.removeEventListener('keydown', this._onKeyDown);
  };

  VirtualScroll.prototype.on = function(cb, ctx) {
    this._emitter.on(EVT_ID, cb, ctx);

    var events = this._emitter.e;
    if (events && events[EVT_ID] && events[EVT_ID].length === 1) this._bind();
  };

  VirtualScroll.prototype.off = function(cb, ctx) {
    this._emitter.off(EVT_ID, cb, ctx);

    var events = this._emitter.e;
    if (!events[EVT_ID] || events[EVT_ID].length <= 0) this._unbind();
  };

  VirtualScroll.prototype.reset = function() {
      var evt = this._event;
      evt.x = 0;
      evt.y = 0;
  };

  VirtualScroll.prototype.destroy = function() {
      this._emitter.off();
      this._unbind();
  };

  function lerp(start, end, amt) {
    return (1 - amt) * start + amt * end;
  }

  function getTranslate(el) {
    var translate = {};
    if (!window.getComputedStyle) return;
    var style = getComputedStyle(el);
    var transform = style.transform || style.webkitTransform || style.mozTransform;
    var mat = transform.match(/^matrix3d\((.+)\)$/);
    if (mat) return parseFloat(mat[1].split(', ')[13]);
    mat = transform.match(/^matrix\((.+)\)$/);
    translate.x = mat ? parseFloat(mat[1].split(', ')[4]) : 0;
    translate.y = mat ? parseFloat(mat[1].split(', ')[5]) : 0;
    return translate;
  }

  /**
   * Returns an array containing all the parent nodes of the given node
   * @param  {object} node
   * @return {array} parent nodes
   */
  function getParents(elem) {
    // Set up a parent array
    var parents = []; // Push each parent element to the array

    for (; elem && elem !== document; elem = elem.parentNode) {
      parents.push(elem);
    } // Return our parent array


    return parents;
  } // https://gomakethings.com/how-to-get-the-closest-parent-element-with-a-matching-selector-using-vanilla-javascript/

  var _default$2$1 =
  /*#__PURE__*/
  function (_Core) {
    _inherits$1(_default, _Core);

    function _default() {
      var _this;

      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck$3(this, _default);

      _this = _possibleConstructorReturn$1(this, _getPrototypeOf$1(_default).call(this, options));
      _this.inertia = _this.inertia * 0.1;
      _this.isScrolling = false;
      _this.isDraggingScrollbar = false;
      _this.isTicking = false;
      _this.hasScrollTicking = false;
      _this.parallaxElements = [];
      _this.inertiaRatio = 1;
      _this.stop = false;
      return _this;
    }

    _createClass$3(_default, [{
      key: "init",
      value: function init() {
        var _this2 = this;

        this.html.classList.add(this.smoothClass);
        this.instance = _objectSpread({
          delta: {
            x: 0,
            y: 0
          }
        }, this.instance);
        this.vs = new src({
          mouseMultiplier: navigator.platform.indexOf('Win') > -1 ? 1 : 0.4,
          touchMultiplier: 4,
          firefoxMultiplier: 30
        });
        this.vs.on(function (e) {
          if (_this2.stop) {
            return;
          }

          if (!_this2.isTicking && !_this2.isDraggingScrollbar) {
            requestAnimationFrame(function () {
              if (!_this2.isScrolling) _this2.startScrolling();

              _this2.updateDelta(e);
            });
            _this2.isTicking = true;
          }

          _this2.isTicking = false;
        });
        this.setScrollLimit();
        this.initScrollBar();
        this.addSections();
        this.addElements();
        this.detectElements();
        this.transformElements(true);

        _get(_getPrototypeOf$1(_default.prototype), "init", this).call(this);
      }
    }, {
      key: "setScrollLimit",
      value: function setScrollLimit() {
        this.instance.limit = this.el.offsetHeight - this.windowHeight;
      }
    }, {
      key: "startScrolling",
      value: function startScrolling() {
        this.isScrolling = true;
        this.checkScroll();
        this.html.classList.add(this.scrollingClass);
      }
    }, {
      key: "stopScrolling",
      value: function stopScrolling() {
        this.isScrolling = false;
        this.inertiaRatio = 1;
        this.instance.scroll.y = Math.round(this.instance.scroll.y);
        this.html.classList.remove(this.scrollingClass);
      }
    }, {
      key: "checkScroll",
      value: function checkScroll() {
        var _this3 = this;

        if (this.isScrolling || this.isDraggingScrollbar) {
          if (!this.hasScrollTicking) {
            requestAnimationFrame(function () {
              return _this3.checkScroll();
            });
            this.hasScrollTicking = true;
          }

          var distance = Math.abs(this.instance.delta.y - this.instance.scroll.y);

          if (distance < 0.5 && this.instance.delta.y != 0 || distance < 0.5 && this.instance.delta.y == 0) {
            this.stopScrolling();
          }

          this.updateScroll();

          for (var i = this.sections.length - 1; i >= 0; i--) {
            if (this.sections[i].persistent || this.instance.scroll.y > this.sections[i].offset && this.instance.scroll.y < this.sections[i].limit) {
              this.transform(this.sections[i].el, 0, -this.instance.scroll.y);
              this.sections[i].el.style.visibility = 'visible';
              this.sections[i].inView = true;
            } else {
              this.sections[i].el.style.visibility = 'hidden';
              this.sections[i].inView = false;
              this.transform(this.sections[i].el, 0, 0);
            }
          }

          if (this.getDirection) {
            this.addDirection();
          }

          if (this.getSpeed) {
            this.addSpeed();
            this.timestamp = Date.now();
          }

          this.detectElements();
          this.transformElements();
          var scrollBarTranslation = this.instance.scroll.y / this.instance.limit * this.scrollBarLimit;
          this.transform(this.scrollbarThumb, 0, scrollBarTranslation);

          _get(_getPrototypeOf$1(_default.prototype), "checkScroll", this).call(this);

          this.hasScrollTicking = false;
        }
      }
    }, {
      key: "checkResize",
      value: function checkResize() {
        this.windowHeight = window.innerHeight;
        this.windowMiddle = this.windowHeight / 2;
        this.update();
      }
    }, {
      key: "updateDelta",
      value: function updateDelta(e) {
        this.instance.delta.y -= e.deltaY;
        if (this.instance.delta.y < 0) this.instance.delta.y = 0;
        if (this.instance.delta.y > this.instance.limit) this.instance.delta.y = this.instance.limit;
      }
    }, {
      key: "updateScroll",
      value: function updateScroll() {
        if (this.isScrolling) {
          this.instance.scroll.y = lerp(this.instance.scroll.y, this.instance.delta.y, this.inertia * this.inertiaRatio);
        } else if (this.isDraggingScrollBar) {
          this.instance.scroll.y = lerp(this.instance.scroll.y, this.instance.delta.y, this.inertia * 2);
        } else {
          this.instance.scroll.y = this.instance.delta.y;
        }
      }
    }, {
      key: "addDirection",
      value: function addDirection() {
        if (this.instance.delta.y > this.instance.scroll.y) {
          if (this.instance.direction !== 'down') {
            this.instance.direction = 'down';
          }
        } else if (this.instance.delta.y < this.instance.scroll.y) {
          if (this.instance.direction !== 'up') {
            this.instance.direction = 'up';
          }
        }
      }
    }, {
      key: "addSpeed",
      value: function addSpeed() {
        if (this.instance.delta.y != this.instance.scroll.y) {
          this.instance.speed = (this.instance.delta.y - this.instance.scroll.y) / (Date.now() - this.timestamp);
        } else {
          this.instance.speed = 0;
        }
      }
    }, {
      key: "initScrollBar",
      value: function initScrollBar() {
        var _this4 = this;

        this.scrollbar = document.createElement('span');
        this.scrollbarThumb = document.createElement('span');
        this.scrollbar.classList.add("".concat(this.scrollbarClass));
        this.scrollbarThumb.classList.add("".concat(this.scrollbarClass, "_thumb"));
        this.scrollbar.append(this.scrollbarThumb);
        document.body.append(this.scrollbar);
        this.scrollbarThumb.style.height = "".concat(window.innerHeight * window.innerHeight / (this.instance.limit + window.innerHeight), "px");
        this.scrollBarLimit = window.innerHeight - this.scrollbarThumb.getBoundingClientRect().height;
        this.scrollbarThumb.addEventListener('mousedown', function (e) {
          return _this4.getScrollBar(e);
        });
        window.addEventListener('mouseup', function (e) {
          return _this4.releaseScrollBar(e);
        });
        window.addEventListener('mousemove', function (e) {
          return _this4.moveScrollBar(e);
        });
      }
    }, {
      key: "reinitScrollBar",
      value: function reinitScrollBar() {
        this.scrollbarThumb.style.height = "".concat(window.innerHeight * window.innerHeight / this.instance.limit, "px");
        this.scrollBarLimit = window.innerHeight - this.scrollbarThumb.getBoundingClientRect().height;
      }
    }, {
      key: "destroyScrollBar",
      value: function destroyScrollBar() {
        var _this5 = this;

        this.scrollbarThumb.removeEventListener('mousedown', function (e) {
          return _this5.getScrollBar(e);
        });
        window.removeEventListener('mouseup', function (e) {
          return _this5.releaseScrollBar(e);
        });
        window.removeEventListener('mousemove', function (e) {
          return _this5.moveScrollBar(e);
        });
      }
    }, {
      key: "getScrollBar",
      value: function getScrollBar(e) {
        this.isDraggingScrollbar = true;
        this.checkScroll();
        this.html.classList.remove(this.scrollingClass);
        this.html.classList.add(this.draggingClass);
      }
    }, {
      key: "releaseScrollBar",
      value: function releaseScrollBar(e) {
        this.isDraggingScrollbar = false;
        this.html.classList.add(this.scrollingClass);
        this.html.classList.remove(this.draggingClass);
      }
    }, {
      key: "moveScrollBar",
      value: function moveScrollBar(e) {
        var _this6 = this;

        if (!this.isTicking && this.isDraggingScrollbar) {
          requestAnimationFrame(function () {
            var y = e.clientY * 100 / window.innerHeight * _this6.instance.limit / 100;

            if (y > 0 && y < _this6.instance.limit) {
              _this6.instance.delta.y = y;
            }
          });
          this.isTicking = true;
        }

        this.isTicking = false;
      }
    }, {
      key: "addElements",
      value: function addElements() {
        var _this7 = this;

        this.els = [];
        this.parallaxElements = [];
        var count = 0;
        this.sections.forEach(function (section, y) {
          var els = _this7.sections[y].el.querySelectorAll("[data-".concat(_this7.name, "]"));

          els.forEach(function (el, i) {
            var cl = el.dataset[_this7.name + 'Class'] || _this7["class"];
            var top;
            var repeat = el.dataset[_this7.name + 'Repeat'];
            var call = el.dataset[_this7.name + 'Call'];
            var position = el.dataset[_this7.name + 'Position'];
            var delay = el.dataset[_this7.name + 'Delay'];
            var direction = el.dataset[_this7.name + 'Direction'];
            var sticky = typeof el.dataset[_this7.name + 'Sticky'] === 'string';
            var speed = el.dataset[_this7.name + 'Speed'] ? parseFloat(el.dataset[_this7.name + 'Speed']) / 10 : false;
            var offset = typeof el.dataset[_this7.name + 'Offset'] === 'string' ? el.dataset[_this7.name + 'Offset'].split(',') : false;
            var target = el.dataset[_this7.name + 'Target'];
            var targetEl;

            if (target !== undefined) {
              targetEl = document.querySelector("".concat(target));
            } else {
              targetEl = el;
            }

            if (!_this7.sections[y].inView) {
              top = targetEl.getBoundingClientRect().top - getTranslate(_this7.sections[y].el).y - getTranslate(targetEl).y;
            } else {
              top = targetEl.getBoundingClientRect().top + _this7.instance.scroll.y - getTranslate(targetEl).y;
            }

            var bottom = top + targetEl.offsetHeight;
            var middle = (bottom - top) / 2 + top;

            if (sticky) {
              top += window.innerHeight;
              bottom = top + targetEl.offsetHeight - window.innerHeight - el.offsetHeight;
              middle = (bottom - top) / 2 + top;
            }

            if (repeat == 'false') {
              repeat = false;
            } else if (repeat != undefined) {
              repeat = true;
            } else {
              repeat = _this7.repeat;
            }

            var relativeOffset = [0, 0];

            if (offset) {
              for (var i = 0; i < offset.length; i++) {
                if (offset[i].includes('%')) {
                  relativeOffset[i] = parseInt(offset[i].replace('%', '') * _this7.windowHeight / 100);
                } else {
                  relativeOffset[i] = parseInt(offset[i]);
                }
              }
            }

            var mappedEl = {
              el: el,
              id: count,
              "class": cl,
              top: top + relativeOffset[0],
              middle: middle,
              bottom: bottom - relativeOffset[1],
              offset: offset,
              repeat: repeat,
              inView: false,
              call: call,
              speed: speed,
              delay: delay,
              position: position,
              target: targetEl,
              direction: direction,
              sticky: sticky
            };
            count++;

            _this7.els.push(mappedEl);

            if (speed !== false || sticky) {
              _this7.parallaxElements.push(mappedEl);
            }
          });
        });
      }
    }, {
      key: "addSections",
      value: function addSections() {
        var _this8 = this;

        this.sections = [];
        var sections = this.el.querySelectorAll("[data-".concat(this.name, "-section]"));

        if (sections.length === 0) {
          sections = [this.el];
        }

        sections.forEach(function (section, i) {
          var offset = section.getBoundingClientRect().top - window.innerHeight * 1.5 - getTranslate(section).y;
          var limit = offset + section.getBoundingClientRect().height + window.innerHeight * 2;
          var persistent = typeof section.dataset[_this8.name + 'Persistent'] === 'string';
          var inView = false;

          if (_this8.instance.scroll.y >= offset && _this8.instance.scroll.y <= limit) {
            inView = true;
          }

          var mappedSection = {
            el: section,
            offset: offset,
            limit: limit,
            inView: inView,
            persistent: persistent
          };
          _this8.sections[i] = mappedSection;
        });
      }
    }, {
      key: "transform",
      value: function transform(element, x, y, delay) {
        var transform;

        if (!delay) {
          transform = "matrix(1,0,0,1,".concat(x, ",").concat(y, ")");
        } else {
          var start = getTranslate(element);
          var lerpX = lerp(start.x, x, delay);
          var lerpY = lerp(start.y, y, delay);
          transform = "matrix(1,0,0,1,".concat(lerpX, ",").concat(lerpY, ")");
        }

        element.style.webkitTransform = transform;
        element.style.msTransform = transform;
        element.style.transform = transform;
      }
    }, {
      key: "transformElements",
      value: function transformElements(isForced) {
        var _this9 = this;

        var scrollBottom = this.instance.scroll.y + this.windowHeight;
        var scrollMiddle = this.instance.scroll.y + this.windowMiddle;
        this.parallaxElements.forEach(function (current, i) {
          var transformDistance = false;

          if (isForced) {
            transformDistance = 0;
          }

          if (current.inView) {
            switch (current.position) {
              case 'top':
                transformDistance = _this9.instance.scroll.y * -current.speed;
                break;

              case 'bottom':
                transformDistance = (_this9.instance.limit - scrollBottom + _this9.windowHeight) * current.speed;
                break;

              default:
                transformDistance = (scrollMiddle - current.middle) * -current.speed;
                break;
            }
          }

          if (current.sticky) {
            if (current.inView) {
              transformDistance = _this9.instance.scroll.y - current.top + window.innerHeight;
            } else {
              if (_this9.instance.scroll.y < current.top - window.innerHeight && _this9.instance.scroll.y < current.top - window.innerHeight / 2) {
                transformDistance = 0;
              } else if (_this9.instance.scroll.y > current.bottom && _this9.instance.scroll.y > current.bottom + 100) {
                transformDistance = current.bottom - current.top + window.innerHeight;
              } else {
                transformDistance = false;
              }
            }
          }

          if (transformDistance !== false) {
            if (current.direction === 'horizontal') {
              _this9.transform(current.el, transformDistance, 0, isForced ? false : current.delay);
            } else {
              _this9.transform(current.el, 0, transformDistance, isForced ? false : current.delay);
            }
          }
        });
      }
      /**
       * Scroll to a desired target.
       *
       * @param  {object} options
       *      Available options :
       *          {node, string, "top", "bottom"} targetOption - The DOM element we want to scroll to
       *          {int} offsetOption - An absolute vertical scroll value to reach, or an offset to apply on top of given `target` or `sourceElem`'s target
       *          {boolean} toBottom - Set to true to scroll all the way to the bottom
       * @return {void}
       */

    }, {
      key: "scrollTo",
      value: function scrollTo(targetOption, offsetOption) {
        var _this10 = this;

        var target;
        var offset = offsetOption ? parseInt(offsetOption) : 0;

        if (typeof targetOption === 'string') {
          if (targetOption === 'top') {
            offset = 0;
          } else if (targetOption === 'bottom') {
            offset = this.instance.limit;
          } else {
            target = document.querySelectorAll(targetOption)[0];
          }
        } else if (!targetOption.target) {
          target = targetOption;
        } // We have a target, get it's coordinates


        if (target) {
          // Get target offset from top
          var targetBCR = target.getBoundingClientRect();
          var offsetTop = targetBCR.top + this.instance.scroll.y; // Try and find the target's parent section

          var targetParents = getParents(target);
          var parentSection = targetParents.find(function (candidate) {
            return _this10.sections.find(function (section) {
              return section.element == candidate;
            });
          });
          var parentSectionOffset = 0;

          if (parentSection) {
            parentSectionOffset = getTranslate(parentSection).y; // We got a parent section, store it's current offset to remove it later
          } // Final value of scroll destination : offsetTop + (optional offset given in options) - (parent's section translate)


          offset = offsetTop + offset - parentSectionOffset;
        }

        offset -= this.instance.scroll.y;
        this.instance.delta.y = Math.min(offset, this.instance.limit); // Actual scrollTo (the lerp will do the animation itself)

        this.inertiaRatio = Math.min(4000 / Math.abs(this.instance.delta.y - this.instance.scroll.y), 0.8); // Update the scroll. If we were in idle state: we're not anymore

        this.isScrolling = true;
        this.checkScroll();
        this.html.classList.add(this.scrollingClass);
      }
    }, {
      key: "update",
      value: function update() {
        this.setScrollLimit();
        this.addSections();
        this.addElements();
        this.detectElements();
        this.updateScroll();
        this.transformElements(true);
      }
    }, {
      key: "startScroll",
      value: function startScroll() {
        this.stop = false;
      }
    }, {
      key: "stopScroll",
      value: function stopScroll() {
        this.stop = true;
      }
    }, {
      key: "setScroll",
      value: function setScroll(x, y) {
        this.instance = {
          scroll: {
            x: x,
            y: y
          },
          delta: {
            x: x,
            y: y
          }
        };
      }
    }, {
      key: "destroy",
      value: function destroy() {
        _get(_getPrototypeOf$1(_default.prototype), "destroy", this).call(this);

        this.stopScrolling();
        this.html.classList.remove(this.smoothClass);
        this.vs.destroy();
        this.scrollbar.remove();
      }
    }]);

    return _default;
  }(_default$4);

  var _default$3$1 =
  /*#__PURE__*/
  function () {
    function _default() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck$3(this, _default);

      this.options = options;
      Object.assign(this, defaults, options);
      this.init();
    }

    _createClass$3(_default, [{
      key: "init",
      value: function init() {
        if (!this.smoothMobile) {
          this.isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        }

        if (this.smooth === true && !this.isMobile) {
          this.scroll = new _default$2$1(this.options);
        } else {
          this.scroll = new _default$1$1(this.options);
        }

        this.scroll.init();

        if (window.location.hash) {
          this.scroll.scrollTo(window.location.hash);
        }
      }
    }, {
      key: "update",
      value: function update() {
        this.scroll.update();
      }
    }, {
      key: "start",
      value: function start() {
        this.scroll.startScroll();
      }
    }, {
      key: "stop",
      value: function stop() {
        this.scroll.stopScroll();
      }
    }, {
      key: "scrollTo",
      value: function scrollTo(target, offset) {
        this.scroll.scrollTo(target, offset);
      }
    }, {
      key: "setScroll",
      value: function setScroll(x, y) {
        this.scroll.setScroll(x, y);
      }
    }, {
      key: "on",
      value: function on(event, func) {
        this.scroll.setEvents(event, func);
      }
    }, {
      key: "destroy",
      value: function destroy() {
        this.scroll.destroy();
      }
    }]);

    return _default;
  }();

  var _default$5 =
  /*#__PURE__*/
  function (_module) {
    _inherits(_default, _module);

    function _default(m) {
      _classCallCheck$1(this, _default);

      return _possibleConstructorReturn(this, _getPrototypeOf(_default).call(this, m));
    }

    _createClass$1(_default, [{
      key: "init",
      value: function init() {
        this.scroll = new _default$3$1({
          el: this.el,
          smooth: true
        });
      }
    }, {
      key: "destroy",
      value: function destroy() {
        this.scroll.destroy();
      }
    }]);

    return _default;
  }(_default);



  var modules = /*#__PURE__*/Object.freeze({
    Load: _default$3,
    Scroll: _default$5
  });

  var commonjsGlobal$1 = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function createCommonjsModule$1(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var svg4everybody = createCommonjsModule$1(function (module) {
  !function(root, factory) {
        module.exports ? // Node. Does not work with strict CommonJS, but
      // only CommonJS-like environments that support module.exports,
      // like Node.
      module.exports = factory() : root.svg4everybody = factory();
  }(commonjsGlobal$1, function() {
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
  });

  function globals () {
    svg4everybody();
  }

  var html = document.documentElement;
  var body = document.body;
  var isDebug = !!html.getAttribute('data-debug');

  var app = new _default$1({
    modules: modules
  });
  app.init(app);
  globals();
  html.classList.add('is-loaded', 'is-ready');
  html.classList.remove('is-loading');

}());
//# sourceMappingURL=app.js.map
