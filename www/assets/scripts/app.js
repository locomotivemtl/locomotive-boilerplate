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
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
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
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // node_modules/@barba/core/dist/barba.umd.js
  var require_barba_umd = __commonJS({
    "node_modules/@barba/core/dist/barba.umd.js"(exports, module) {
      !function(t, n) {
        typeof exports == "object" && typeof module != "undefined" ? module.exports = n() : typeof define == "function" && define.amd ? define(n) : (t = t || self).barba = n();
      }(exports, function() {
        function t(t2, n2) {
          for (var r2 = 0; r2 < n2.length; r2++) {
            var e2 = n2[r2];
            e2.enumerable = e2.enumerable || false, e2.configurable = true, "value" in e2 && (e2.writable = true), Object.defineProperty(t2, e2.key, e2);
          }
        }
        function n(n2, r2, e2) {
          return r2 && t(n2.prototype, r2), e2 && t(n2, e2), n2;
        }
        function r() {
          return (r = Object.assign || function(t2) {
            for (var n2 = 1; n2 < arguments.length; n2++) {
              var r2 = arguments[n2];
              for (var e2 in r2)
                Object.prototype.hasOwnProperty.call(r2, e2) && (t2[e2] = r2[e2]);
            }
            return t2;
          }).apply(this, arguments);
        }
        function e(t2, n2) {
          t2.prototype = Object.create(n2.prototype), t2.prototype.constructor = t2, t2.__proto__ = n2;
        }
        function i(t2) {
          return (i = Object.setPrototypeOf ? Object.getPrototypeOf : function(t3) {
            return t3.__proto__ || Object.getPrototypeOf(t3);
          })(t2);
        }
        function o(t2, n2) {
          return (o = Object.setPrototypeOf || function(t3, n3) {
            return t3.__proto__ = n3, t3;
          })(t2, n2);
        }
        function u(t2, n2, r2) {
          return (u = function() {
            if (typeof Reflect == "undefined" || !Reflect.construct)
              return false;
            if (Reflect.construct.sham)
              return false;
            if (typeof Proxy == "function")
              return true;
            try {
              return Date.prototype.toString.call(Reflect.construct(Date, [], function() {
              })), true;
            } catch (t3) {
              return false;
            }
          }() ? Reflect.construct : function(t3, n3, r3) {
            var e2 = [null];
            e2.push.apply(e2, n3);
            var i2 = new (Function.bind.apply(t3, e2))();
            return r3 && o(i2, r3.prototype), i2;
          }).apply(null, arguments);
        }
        function f(t2) {
          var n2 = typeof Map == "function" ? /* @__PURE__ */ new Map() : void 0;
          return (f = function(t3) {
            if (t3 === null || Function.toString.call(t3).indexOf("[native code]") === -1)
              return t3;
            if (typeof t3 != "function")
              throw new TypeError("Super expression must either be null or a function");
            if (n2 !== void 0) {
              if (n2.has(t3))
                return n2.get(t3);
              n2.set(t3, r2);
            }
            function r2() {
              return u(t3, arguments, i(this).constructor);
            }
            return r2.prototype = Object.create(t3.prototype, { constructor: { value: r2, enumerable: false, writable: true, configurable: true } }), o(r2, t3);
          })(t2);
        }
        function s(t2, n2) {
          try {
            var r2 = t2();
          } catch (t3) {
            return n2(t3);
          }
          return r2 && r2.then ? r2.then(void 0, n2) : r2;
        }
        typeof Symbol != "undefined" && (Symbol.iterator || (Symbol.iterator = Symbol("Symbol.iterator"))), typeof Symbol != "undefined" && (Symbol.asyncIterator || (Symbol.asyncIterator = Symbol("Symbol.asyncIterator")));
        var c, a = "2.9.7", h = function() {
        };
        !function(t2) {
          t2[t2.off = 0] = "off", t2[t2.error = 1] = "error", t2[t2.warning = 2] = "warning", t2[t2.info = 3] = "info", t2[t2.debug = 4] = "debug";
        }(c || (c = {}));
        var v = c.off, l = function() {
          function t2(t3) {
            this.t = t3;
          }
          t2.getLevel = function() {
            return v;
          }, t2.setLevel = function(t3) {
            return v = c[t3];
          };
          var n2 = t2.prototype;
          return n2.error = function() {
            for (var t3 = arguments.length, n3 = new Array(t3), r2 = 0; r2 < t3; r2++)
              n3[r2] = arguments[r2];
            this.i(console.error, c.error, n3);
          }, n2.warn = function() {
            for (var t3 = arguments.length, n3 = new Array(t3), r2 = 0; r2 < t3; r2++)
              n3[r2] = arguments[r2];
            this.i(console.warn, c.warning, n3);
          }, n2.info = function() {
            for (var t3 = arguments.length, n3 = new Array(t3), r2 = 0; r2 < t3; r2++)
              n3[r2] = arguments[r2];
            this.i(console.info, c.info, n3);
          }, n2.debug = function() {
            for (var t3 = arguments.length, n3 = new Array(t3), r2 = 0; r2 < t3; r2++)
              n3[r2] = arguments[r2];
            this.i(console.log, c.debug, n3);
          }, n2.i = function(n3, r2, e2) {
            r2 <= t2.getLevel() && n3.apply(console, ["[" + this.t + "] "].concat(e2));
          }, t2;
        }(), d = O, m = E2, p = g, w = x, b = T, y = "/", P = new RegExp(["(\\\\.)", "(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?"].join("|"), "g");
        function g(t2, n2) {
          for (var r2, e2 = [], i2 = 0, o2 = 0, u2 = "", f2 = n2 && n2.delimiter || y, s2 = n2 && n2.whitelist || void 0, c2 = false; (r2 = P.exec(t2)) !== null; ) {
            var a2 = r2[0], h2 = r2[1], v2 = r2.index;
            if (u2 += t2.slice(o2, v2), o2 = v2 + a2.length, h2)
              u2 += h2[1], c2 = true;
            else {
              var l2 = "", d2 = r2[2], m2 = r2[3], p2 = r2[4], w2 = r2[5];
              if (!c2 && u2.length) {
                var b2 = u2.length - 1, g2 = u2[b2];
                (!s2 || s2.indexOf(g2) > -1) && (l2 = g2, u2 = u2.slice(0, b2));
              }
              u2 && (e2.push(u2), u2 = "", c2 = false);
              var E3 = m2 || p2, x2 = l2 || f2;
              e2.push({ name: d2 || i2++, prefix: l2, delimiter: x2, optional: w2 === "?" || w2 === "*", repeat: w2 === "+" || w2 === "*", pattern: E3 ? A2(E3) : "[^" + k(x2 === f2 ? x2 : x2 + f2) + "]+?" });
            }
          }
          return (u2 || o2 < t2.length) && e2.push(u2 + t2.substr(o2)), e2;
        }
        function E2(t2, n2) {
          return function(r2, e2) {
            var i2 = t2.exec(r2);
            if (!i2)
              return false;
            for (var o2 = i2[0], u2 = i2.index, f2 = {}, s2 = e2 && e2.decode || decodeURIComponent, c2 = 1; c2 < i2.length; c2++)
              if (i2[c2] !== void 0) {
                var a2 = n2[c2 - 1];
                f2[a2.name] = a2.repeat ? i2[c2].split(a2.delimiter).map(function(t3) {
                  return s2(t3, a2);
                }) : s2(i2[c2], a2);
              }
            return { path: o2, index: u2, params: f2 };
          };
        }
        function x(t2, n2) {
          for (var r2 = new Array(t2.length), e2 = 0; e2 < t2.length; e2++)
            typeof t2[e2] == "object" && (r2[e2] = new RegExp("^(?:" + t2[e2].pattern + ")$", R(n2)));
          return function(n3, e3) {
            for (var i2 = "", o2 = e3 && e3.encode || encodeURIComponent, u2 = !e3 || e3.validate !== false, f2 = 0; f2 < t2.length; f2++) {
              var s2 = t2[f2];
              if (typeof s2 != "string") {
                var c2, a2 = n3 ? n3[s2.name] : void 0;
                if (Array.isArray(a2)) {
                  if (!s2.repeat)
                    throw new TypeError('Expected "' + s2.name + '" to not repeat, but got array');
                  if (a2.length === 0) {
                    if (s2.optional)
                      continue;
                    throw new TypeError('Expected "' + s2.name + '" to not be empty');
                  }
                  for (var h2 = 0; h2 < a2.length; h2++) {
                    if (c2 = o2(a2[h2], s2), u2 && !r2[f2].test(c2))
                      throw new TypeError('Expected all "' + s2.name + '" to match "' + s2.pattern + '"');
                    i2 += (h2 === 0 ? s2.prefix : s2.delimiter) + c2;
                  }
                } else if (typeof a2 != "string" && typeof a2 != "number" && typeof a2 != "boolean") {
                  if (!s2.optional)
                    throw new TypeError('Expected "' + s2.name + '" to be ' + (s2.repeat ? "an array" : "a string"));
                } else {
                  if (c2 = o2(String(a2), s2), u2 && !r2[f2].test(c2))
                    throw new TypeError('Expected "' + s2.name + '" to match "' + s2.pattern + '", but got "' + c2 + '"');
                  i2 += s2.prefix + c2;
                }
              } else
                i2 += s2;
            }
            return i2;
          };
        }
        function k(t2) {
          return t2.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
        }
        function A2(t2) {
          return t2.replace(/([=!:$/()])/g, "\\$1");
        }
        function R(t2) {
          return t2 && t2.sensitive ? "" : "i";
        }
        function T(t2, n2, r2) {
          for (var e2 = (r2 = r2 || {}).strict, i2 = r2.start !== false, o2 = r2.end !== false, u2 = r2.delimiter || y, f2 = [].concat(r2.endsWith || []).map(k).concat("$").join("|"), s2 = i2 ? "^" : "", c2 = 0; c2 < t2.length; c2++) {
            var a2 = t2[c2];
            if (typeof a2 == "string")
              s2 += k(a2);
            else {
              var h2 = a2.repeat ? "(?:" + a2.pattern + ")(?:" + k(a2.delimiter) + "(?:" + a2.pattern + "))*" : a2.pattern;
              n2 && n2.push(a2), s2 += a2.optional ? a2.prefix ? "(?:" + k(a2.prefix) + "(" + h2 + "))?" : "(" + h2 + ")?" : k(a2.prefix) + "(" + h2 + ")";
            }
          }
          if (o2)
            e2 || (s2 += "(?:" + k(u2) + ")?"), s2 += f2 === "$" ? "$" : "(?=" + f2 + ")";
          else {
            var v2 = t2[t2.length - 1], l2 = typeof v2 == "string" ? v2[v2.length - 1] === u2 : v2 === void 0;
            e2 || (s2 += "(?:" + k(u2) + "(?=" + f2 + "))?"), l2 || (s2 += "(?=" + k(u2) + "|" + f2 + ")");
          }
          return new RegExp(s2, R(r2));
        }
        function O(t2, n2, r2) {
          return t2 instanceof RegExp ? function(t3, n3) {
            if (!n3)
              return t3;
            var r3 = t3.source.match(/\((?!\?)/g);
            if (r3)
              for (var e2 = 0; e2 < r3.length; e2++)
                n3.push({ name: e2, prefix: null, delimiter: null, optional: false, repeat: false, pattern: null });
            return t3;
          }(t2, n2) : Array.isArray(t2) ? function(t3, n3, r3) {
            for (var e2 = [], i2 = 0; i2 < t3.length; i2++)
              e2.push(O(t3[i2], n3, r3).source);
            return new RegExp("(?:" + e2.join("|") + ")", R(r3));
          }(t2, n2, r2) : function(t3, n3, r3) {
            return T(g(t3, r3), n3, r3);
          }(t2, n2, r2);
        }
        d.match = function(t2, n2) {
          var r2 = [];
          return E2(O(t2, r2, n2), r2);
        }, d.regexpToFunction = m, d.parse = p, d.compile = function(t2, n2) {
          return x(g(t2, n2), n2);
        }, d.tokensToFunction = w, d.tokensToRegExp = b;
        var S = { container: "container", history: "history", namespace: "namespace", prefix: "data-barba", prevent: "prevent", wrapper: "wrapper" }, j = new (function() {
          function t2() {
            this.o = S, this.u = new DOMParser();
          }
          var n2 = t2.prototype;
          return n2.toString = function(t3) {
            return t3.outerHTML;
          }, n2.toDocument = function(t3) {
            return this.u.parseFromString(t3, "text/html");
          }, n2.toElement = function(t3) {
            var n3 = document.createElement("div");
            return n3.innerHTML = t3, n3;
          }, n2.getHtml = function(t3) {
            return t3 === void 0 && (t3 = document), this.toString(t3.documentElement);
          }, n2.getWrapper = function(t3) {
            return t3 === void 0 && (t3 = document), t3.querySelector("[" + this.o.prefix + '="' + this.o.wrapper + '"]');
          }, n2.getContainer = function(t3) {
            return t3 === void 0 && (t3 = document), t3.querySelector("[" + this.o.prefix + '="' + this.o.container + '"]');
          }, n2.removeContainer = function(t3) {
            document.body.contains(t3) && t3.parentNode.removeChild(t3);
          }, n2.addContainer = function(t3, n3) {
            var r2 = this.getContainer();
            r2 ? this.s(t3, r2) : n3.appendChild(t3);
          }, n2.getNamespace = function(t3) {
            t3 === void 0 && (t3 = document);
            var n3 = t3.querySelector("[" + this.o.prefix + "-" + this.o.namespace + "]");
            return n3 ? n3.getAttribute(this.o.prefix + "-" + this.o.namespace) : null;
          }, n2.getHref = function(t3) {
            if (t3.tagName && t3.tagName.toLowerCase() === "a") {
              if (typeof t3.href == "string")
                return t3.href;
              var n3 = t3.getAttribute("href") || t3.getAttribute("xlink:href");
              if (n3)
                return this.resolveUrl(n3.baseVal || n3);
            }
            return null;
          }, n2.resolveUrl = function() {
            for (var t3 = arguments.length, n3 = new Array(t3), r2 = 0; r2 < t3; r2++)
              n3[r2] = arguments[r2];
            var e2 = n3.length;
            if (e2 === 0)
              throw new Error("resolveUrl requires at least one argument; got none.");
            var i2 = document.createElement("base");
            if (i2.href = arguments[0], e2 === 1)
              return i2.href;
            var o2 = document.getElementsByTagName("head")[0];
            o2.insertBefore(i2, o2.firstChild);
            for (var u2, f2 = document.createElement("a"), s2 = 1; s2 < e2; s2++)
              f2.href = arguments[s2], i2.href = u2 = f2.href;
            return o2.removeChild(i2), u2;
          }, n2.s = function(t3, n3) {
            n3.parentNode.insertBefore(t3, n3.nextSibling);
          }, t2;
        }())(), M = new (function() {
          function t2() {
            this.h = [], this.v = -1;
          }
          var e2 = t2.prototype;
          return e2.init = function(t3, n2) {
            this.l = "barba";
            var r2 = { ns: n2, scroll: { x: window.scrollX, y: window.scrollY }, url: t3 };
            this.h.push(r2), this.v = 0;
            var e3 = { from: this.l, index: 0, states: [].concat(this.h) };
            window.history && window.history.replaceState(e3, "", t3);
          }, e2.change = function(t3, n2, r2) {
            if (r2 && r2.state) {
              var e3 = r2.state, i2 = e3.index;
              n2 = this.m(this.v - i2), this.replace(e3.states), this.v = i2;
            } else
              this.add(t3, n2);
            return n2;
          }, e2.add = function(t3, n2) {
            var r2 = this.size, e3 = this.p(n2), i2 = { ns: "tmp", scroll: { x: window.scrollX, y: window.scrollY }, url: t3 };
            this.h.push(i2), this.v = r2;
            var o2 = { from: this.l, index: r2, states: [].concat(this.h) };
            switch (e3) {
              case "push":
                window.history && window.history.pushState(o2, "", t3);
                break;
              case "replace":
                window.history && window.history.replaceState(o2, "", t3);
            }
          }, e2.update = function(t3, n2) {
            var e3 = n2 || this.v, i2 = r({}, this.get(e3), {}, t3);
            this.set(e3, i2);
          }, e2.remove = function(t3) {
            t3 ? this.h.splice(t3, 1) : this.h.pop(), this.v--;
          }, e2.clear = function() {
            this.h = [], this.v = -1;
          }, e2.replace = function(t3) {
            this.h = t3;
          }, e2.get = function(t3) {
            return this.h[t3];
          }, e2.set = function(t3, n2) {
            return this.h[t3] = n2;
          }, e2.p = function(t3) {
            var n2 = "push", r2 = t3, e3 = S.prefix + "-" + S.history;
            return r2.hasAttribute && r2.hasAttribute(e3) && (n2 = r2.getAttribute(e3)), n2;
          }, e2.m = function(t3) {
            return Math.abs(t3) > 1 ? t3 > 0 ? "forward" : "back" : t3 === 0 ? "popstate" : t3 > 0 ? "back" : "forward";
          }, n(t2, [{ key: "current", get: function() {
            return this.h[this.v];
          } }, { key: "state", get: function() {
            return this.h[this.h.length - 1];
          } }, { key: "previous", get: function() {
            return this.v < 1 ? null : this.h[this.v - 1];
          } }, { key: "size", get: function() {
            return this.h.length;
          } }]), t2;
        }())(), L = function(t2, n2) {
          try {
            var r2 = function() {
              if (!n2.next.html)
                return Promise.resolve(t2).then(function(t3) {
                  var r3 = n2.next;
                  if (t3) {
                    var e2 = j.toElement(t3);
                    r3.namespace = j.getNamespace(e2), r3.container = j.getContainer(e2), r3.html = t3, M.update({ ns: r3.namespace });
                    var i2 = j.toDocument(t3);
                    document.title = i2.title;
                  }
                });
            }();
            return Promise.resolve(r2 && r2.then ? r2.then(function() {
            }) : void 0);
          } catch (t3) {
            return Promise.reject(t3);
          }
        }, $ = d, _ = { __proto__: null, update: L, nextTick: function() {
          return new Promise(function(t2) {
            window.requestAnimationFrame(t2);
          });
        }, pathToRegexp: $ }, q = function() {
          return window.location.origin;
        }, B2 = function(t2) {
          return t2 === void 0 && (t2 = window.location.href), U(t2).port;
        }, U = function(t2) {
          var n2, r2 = t2.match(/:\d+/);
          if (r2 === null)
            /^http/.test(t2) && (n2 = 80), /^https/.test(t2) && (n2 = 443);
          else {
            var e2 = r2[0].substring(1);
            n2 = parseInt(e2, 10);
          }
          var i2, o2 = t2.replace(q(), ""), u2 = {}, f2 = o2.indexOf("#");
          f2 >= 0 && (i2 = o2.slice(f2 + 1), o2 = o2.slice(0, f2));
          var s2 = o2.indexOf("?");
          return s2 >= 0 && (u2 = D(o2.slice(s2 + 1)), o2 = o2.slice(0, s2)), { hash: i2, path: o2, port: n2, query: u2 };
        }, D = function(t2) {
          return t2.split("&").reduce(function(t3, n2) {
            var r2 = n2.split("=");
            return t3[r2[0]] = r2[1], t3;
          }, {});
        }, F = function(t2) {
          return t2 === void 0 && (t2 = window.location.href), t2.replace(/(\/#.*|\/|#.*)$/, "");
        }, H = { __proto__: null, getHref: function() {
          return window.location.href;
        }, getOrigin: q, getPort: B2, getPath: function(t2) {
          return t2 === void 0 && (t2 = window.location.href), U(t2).path;
        }, parse: U, parseQuery: D, clean: F };
        function I(t2, n2, r2) {
          return n2 === void 0 && (n2 = 2e3), new Promise(function(e2, i2) {
            var o2 = new XMLHttpRequest();
            o2.onreadystatechange = function() {
              if (o2.readyState === XMLHttpRequest.DONE) {
                if (o2.status === 200)
                  e2(o2.responseText);
                else if (o2.status) {
                  var n3 = { status: o2.status, statusText: o2.statusText };
                  r2(t2, n3), i2(n3);
                }
              }
            }, o2.ontimeout = function() {
              var e3 = new Error("Timeout error [" + n2 + "]");
              r2(t2, e3), i2(e3);
            }, o2.onerror = function() {
              var n3 = new Error("Fetch error");
              r2(t2, n3), i2(n3);
            }, o2.open("GET", t2), o2.timeout = n2, o2.setRequestHeader("Accept", "text/html,application/xhtml+xml,application/xml"), o2.setRequestHeader("x-barba", "yes"), o2.send();
          });
        }
        var C2 = function(t2) {
          return !!t2 && (typeof t2 == "object" || typeof t2 == "function") && typeof t2.then == "function";
        };
        function N(t2, n2) {
          return n2 === void 0 && (n2 = {}), function() {
            for (var r2 = arguments.length, e2 = new Array(r2), i2 = 0; i2 < r2; i2++)
              e2[i2] = arguments[i2];
            var o2 = false, u2 = new Promise(function(r3, i3) {
              n2.async = function() {
                return o2 = true, function(t3, n3) {
                  t3 ? i3(t3) : r3(n3);
                };
              };
              var u3 = t2.apply(n2, e2);
              o2 || (C2(u3) ? u3.then(r3, i3) : r3(u3));
            });
            return u2;
          };
        }
        var X = new (function(t2) {
          function n2() {
            var n3;
            return (n3 = t2.call(this) || this).logger = new l("@barba/core"), n3.all = ["ready", "page", "reset", "currentAdded", "currentRemoved", "nextAdded", "nextRemoved", "beforeOnce", "once", "afterOnce", "before", "beforeLeave", "leave", "afterLeave", "beforeEnter", "enter", "afterEnter", "after"], n3.registered = /* @__PURE__ */ new Map(), n3.init(), n3;
          }
          e(n2, t2);
          var r2 = n2.prototype;
          return r2.init = function() {
            var t3 = this;
            this.registered.clear(), this.all.forEach(function(n3) {
              t3[n3] || (t3[n3] = function(r3, e2) {
                t3.registered.has(n3) || t3.registered.set(n3, /* @__PURE__ */ new Set()), t3.registered.get(n3).add({ ctx: e2 || {}, fn: r3 });
              });
            });
          }, r2.do = function(t3) {
            for (var n3 = this, r3 = arguments.length, e2 = new Array(r3 > 1 ? r3 - 1 : 0), i2 = 1; i2 < r3; i2++)
              e2[i2 - 1] = arguments[i2];
            if (this.registered.has(t3)) {
              var o2 = Promise.resolve();
              return this.registered.get(t3).forEach(function(t4) {
                o2 = o2.then(function() {
                  return N(t4.fn, t4.ctx).apply(void 0, e2);
                });
              }), o2.catch(function(r4) {
                n3.logger.debug("Hook error [" + t3 + "]"), n3.logger.error(r4);
              });
            }
            return Promise.resolve();
          }, r2.clear = function() {
            var t3 = this;
            this.all.forEach(function(n3) {
              delete t3[n3];
            }), this.init();
          }, r2.help = function() {
            this.logger.info("Available hooks: " + this.all.join(","));
            var t3 = [];
            this.registered.forEach(function(n3, r3) {
              return t3.push(r3);
            }), this.logger.info("Registered hooks: " + t3.join(","));
          }, n2;
        }(h))(), z = function() {
          function t2(t3) {
            if (this.P = [], typeof t3 == "boolean")
              this.g = t3;
            else {
              var n2 = Array.isArray(t3) ? t3 : [t3];
              this.P = n2.map(function(t4) {
                return $(t4);
              });
            }
          }
          return t2.prototype.checkHref = function(t3) {
            if (typeof this.g == "boolean")
              return this.g;
            var n2 = U(t3).path;
            return this.P.some(function(t4) {
              return t4.exec(n2) !== null;
            });
          }, t2;
        }(), G = function(t2) {
          function n2(n3) {
            var r2;
            return (r2 = t2.call(this, n3) || this).k = /* @__PURE__ */ new Map(), r2;
          }
          e(n2, t2);
          var i2 = n2.prototype;
          return i2.set = function(t3, n3, r2) {
            return this.k.set(t3, { action: r2, request: n3 }), { action: r2, request: n3 };
          }, i2.get = function(t3) {
            return this.k.get(t3);
          }, i2.getRequest = function(t3) {
            return this.k.get(t3).request;
          }, i2.getAction = function(t3) {
            return this.k.get(t3).action;
          }, i2.has = function(t3) {
            return !this.checkHref(t3) && this.k.has(t3);
          }, i2.delete = function(t3) {
            return this.k.delete(t3);
          }, i2.update = function(t3, n3) {
            var e2 = r({}, this.k.get(t3), {}, n3);
            return this.k.set(t3, e2), e2;
          }, n2;
        }(z), Q = function() {
          return !window.history.pushState;
        }, W = function(t2) {
          return !t2.el || !t2.href;
        }, J = function(t2) {
          var n2 = t2.event;
          return n2.which > 1 || n2.metaKey || n2.ctrlKey || n2.shiftKey || n2.altKey;
        }, K = function(t2) {
          var n2 = t2.el;
          return n2.hasAttribute("target") && n2.target === "_blank";
        }, V = function(t2) {
          var n2 = t2.el;
          return n2.protocol !== void 0 && window.location.protocol !== n2.protocol || n2.hostname !== void 0 && window.location.hostname !== n2.hostname;
        }, Y = function(t2) {
          var n2 = t2.el;
          return n2.port !== void 0 && B2() !== B2(n2.href);
        }, Z = function(t2) {
          var n2 = t2.el;
          return n2.getAttribute && typeof n2.getAttribute("download") == "string";
        }, tt = function(t2) {
          return t2.el.hasAttribute(S.prefix + "-" + S.prevent);
        }, nt = function(t2) {
          return Boolean(t2.el.closest("[" + S.prefix + "-" + S.prevent + '="all"]'));
        }, rt = function(t2) {
          var n2 = t2.href;
          return F(n2) === F() && B2(n2) === B2();
        }, et = function(t2) {
          function n2(n3) {
            var r3;
            return (r3 = t2.call(this, n3) || this).suite = [], r3.tests = /* @__PURE__ */ new Map(), r3.init(), r3;
          }
          e(n2, t2);
          var r2 = n2.prototype;
          return r2.init = function() {
            this.add("pushState", Q), this.add("exists", W), this.add("newTab", J), this.add("blank", K), this.add("corsDomain", V), this.add("corsPort", Y), this.add("download", Z), this.add("preventSelf", tt), this.add("preventAll", nt), this.add("sameUrl", rt, false);
          }, r2.add = function(t3, n3, r3) {
            r3 === void 0 && (r3 = true), this.tests.set(t3, n3), r3 && this.suite.push(t3);
          }, r2.run = function(t3, n3, r3, e2) {
            return this.tests.get(t3)({ el: n3, event: r3, href: e2 });
          }, r2.checkLink = function(t3, n3, r3) {
            var e2 = this;
            return this.suite.some(function(i2) {
              return e2.run(i2, t3, n3, r3);
            });
          }, n2;
        }(z), it = function(t2) {
          function n2(r2, e2) {
            var i2;
            e2 === void 0 && (e2 = "Barba error");
            for (var o2 = arguments.length, u2 = new Array(o2 > 2 ? o2 - 2 : 0), f2 = 2; f2 < o2; f2++)
              u2[f2 - 2] = arguments[f2];
            return (i2 = t2.call.apply(t2, [this].concat(u2)) || this).error = r2, i2.label = e2, Error.captureStackTrace && Error.captureStackTrace(function(t3) {
              if (t3 === void 0)
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
              return t3;
            }(i2), n2), i2.name = "BarbaError", i2;
          }
          return e(n2, t2), n2;
        }(f(Error)), ot = function() {
          function t2(t3) {
            t3 === void 0 && (t3 = []), this.logger = new l("@barba/core"), this.all = [], this.page = [], this.once = [], this.A = [{ name: "namespace", type: "strings" }, { name: "custom", type: "function" }], t3 && (this.all = this.all.concat(t3)), this.update();
          }
          var n2 = t2.prototype;
          return n2.add = function(t3, n3) {
            switch (t3) {
              case "rule":
                this.A.splice(n3.position || 0, 0, n3.value);
                break;
              case "transition":
              default:
                this.all.push(n3);
            }
            this.update();
          }, n2.resolve = function(t3, n3) {
            var r2 = this;
            n3 === void 0 && (n3 = {});
            var e2 = n3.once ? this.once : this.page;
            e2 = e2.filter(n3.self ? function(t4) {
              return t4.name && t4.name === "self";
            } : function(t4) {
              return !t4.name || t4.name !== "self";
            });
            var i2 = /* @__PURE__ */ new Map(), o2 = e2.find(function(e3) {
              var o3 = true, u3 = {};
              return !(!n3.self || e3.name !== "self") || (r2.A.reverse().forEach(function(n4) {
                o3 && (o3 = r2.R(e3, n4, t3, u3), e3.from && e3.to && (o3 = r2.R(e3, n4, t3, u3, "from") && r2.R(e3, n4, t3, u3, "to")), e3.from && !e3.to && (o3 = r2.R(e3, n4, t3, u3, "from")), !e3.from && e3.to && (o3 = r2.R(e3, n4, t3, u3, "to")));
              }), i2.set(e3, u3), o3);
            }), u2 = i2.get(o2), f2 = [];
            if (f2.push(n3.once ? "once" : "page"), n3.self && f2.push("self"), u2) {
              var s2, c2 = [o2];
              Object.keys(u2).length > 0 && c2.push(u2), (s2 = this.logger).info.apply(s2, ["Transition found [" + f2.join(",") + "]"].concat(c2));
            } else
              this.logger.info("No transition found [" + f2.join(",") + "]");
            return o2;
          }, n2.update = function() {
            var t3 = this;
            this.all = this.all.map(function(n3) {
              return t3.T(n3);
            }).sort(function(t4, n3) {
              return t4.priority - n3.priority;
            }).reverse().map(function(t4) {
              return delete t4.priority, t4;
            }), this.page = this.all.filter(function(t4) {
              return t4.leave !== void 0 || t4.enter !== void 0;
            }), this.once = this.all.filter(function(t4) {
              return t4.once !== void 0;
            });
          }, n2.R = function(t3, n3, r2, e2, i2) {
            var o2 = true, u2 = false, f2 = t3, s2 = n3.name, c2 = s2, a2 = s2, h2 = s2, v2 = i2 ? f2[i2] : f2, l2 = i2 === "to" ? r2.next : r2.current;
            if (i2 ? v2 && v2[s2] : v2[s2]) {
              switch (n3.type) {
                case "strings":
                default:
                  var d2 = Array.isArray(v2[c2]) ? v2[c2] : [v2[c2]];
                  l2[c2] && d2.indexOf(l2[c2]) !== -1 && (u2 = true), d2.indexOf(l2[c2]) === -1 && (o2 = false);
                  break;
                case "object":
                  var m2 = Array.isArray(v2[a2]) ? v2[a2] : [v2[a2]];
                  l2[a2] ? (l2[a2].name && m2.indexOf(l2[a2].name) !== -1 && (u2 = true), m2.indexOf(l2[a2].name) === -1 && (o2 = false)) : o2 = false;
                  break;
                case "function":
                  v2[h2](r2) ? u2 = true : o2 = false;
              }
              u2 && (i2 ? (e2[i2] = e2[i2] || {}, e2[i2][s2] = f2[i2][s2]) : e2[s2] = f2[s2]);
            }
            return o2;
          }, n2.O = function(t3, n3, r2) {
            var e2 = 0;
            return (t3[n3] || t3.from && t3.from[n3] || t3.to && t3.to[n3]) && (e2 += Math.pow(10, r2), t3.from && t3.from[n3] && (e2 += 1), t3.to && t3.to[n3] && (e2 += 2)), e2;
          }, n2.T = function(t3) {
            var n3 = this;
            t3.priority = 0;
            var r2 = 0;
            return this.A.forEach(function(e2, i2) {
              r2 += n3.O(t3, e2.name, i2 + 1);
            }), t3.priority = r2, t3;
          }, t2;
        }(), ut = function() {
          function t2(t3) {
            t3 === void 0 && (t3 = []), this.logger = new l("@barba/core"), this.S = false, this.store = new ot(t3);
          }
          var r2 = t2.prototype;
          return r2.get = function(t3, n2) {
            return this.store.resolve(t3, n2);
          }, r2.doOnce = function(t3) {
            var n2 = t3.data, r3 = t3.transition;
            try {
              var e2 = function() {
                i2.S = false;
              }, i2 = this, o2 = r3 || {};
              i2.S = true;
              var u2 = s(function() {
                return Promise.resolve(i2.j("beforeOnce", n2, o2)).then(function() {
                  return Promise.resolve(i2.once(n2, o2)).then(function() {
                    return Promise.resolve(i2.j("afterOnce", n2, o2)).then(function() {
                    });
                  });
                });
              }, function(t4) {
                i2.S = false, i2.logger.debug("Transition error [before/after/once]"), i2.logger.error(t4);
              });
              return Promise.resolve(u2 && u2.then ? u2.then(e2) : e2());
            } catch (t4) {
              return Promise.reject(t4);
            }
          }, r2.doPage = function(t3) {
            var n2 = t3.data, r3 = t3.transition, e2 = t3.page, i2 = t3.wrapper;
            try {
              var o2 = function(t4) {
                if (u2)
                  return t4;
                f2.S = false;
              }, u2 = false, f2 = this, c2 = r3 || {}, a2 = c2.sync === true || false;
              f2.S = true;
              var h2 = s(function() {
                function t4() {
                  return Promise.resolve(f2.j("before", n2, c2)).then(function() {
                    var t5 = false;
                    function r5(r6) {
                      return t5 ? r6 : Promise.resolve(f2.remove(n2)).then(function() {
                        return Promise.resolve(f2.j("after", n2, c2)).then(function() {
                        });
                      });
                    }
                    var o3 = function() {
                      if (a2)
                        return s(function() {
                          return Promise.resolve(f2.add(n2, i2)).then(function() {
                            return Promise.resolve(f2.j("beforeLeave", n2, c2)).then(function() {
                              return Promise.resolve(f2.j("beforeEnter", n2, c2)).then(function() {
                                return Promise.resolve(Promise.all([f2.leave(n2, c2), f2.enter(n2, c2)])).then(function() {
                                  return Promise.resolve(f2.j("afterLeave", n2, c2)).then(function() {
                                    return Promise.resolve(f2.j("afterEnter", n2, c2)).then(function() {
                                    });
                                  });
                                });
                              });
                            });
                          });
                        }, function(t6) {
                          if (f2.M(t6))
                            throw new it(t6, "Transition error [sync]");
                        });
                      var r6 = function(r7) {
                        return t5 ? r7 : s(function() {
                          var t6 = function() {
                            if (o4 !== false)
                              return Promise.resolve(f2.add(n2, i2)).then(function() {
                                return Promise.resolve(f2.j("beforeEnter", n2, c2)).then(function() {
                                  return Promise.resolve(f2.enter(n2, c2, o4)).then(function() {
                                    return Promise.resolve(f2.j("afterEnter", n2, c2)).then(function() {
                                    });
                                  });
                                });
                              });
                          }();
                          if (t6 && t6.then)
                            return t6.then(function() {
                            });
                        }, function(t6) {
                          if (f2.M(t6))
                            throw new it(t6, "Transition error [before/after/enter]");
                        });
                      }, o4 = false, u3 = s(function() {
                        return Promise.resolve(f2.j("beforeLeave", n2, c2)).then(function() {
                          return Promise.resolve(Promise.all([f2.leave(n2, c2), L(e2, n2)]).then(function(t6) {
                            return t6[0];
                          })).then(function(t6) {
                            return o4 = t6, Promise.resolve(f2.j("afterLeave", n2, c2)).then(function() {
                            });
                          });
                        });
                      }, function(t6) {
                        if (f2.M(t6))
                          throw new it(t6, "Transition error [before/after/leave]");
                      });
                      return u3 && u3.then ? u3.then(r6) : r6(u3);
                    }();
                    return o3 && o3.then ? o3.then(r5) : r5(o3);
                  });
                }
                var r4 = function() {
                  if (a2)
                    return Promise.resolve(L(e2, n2)).then(function() {
                    });
                }();
                return r4 && r4.then ? r4.then(t4) : t4();
              }, function(t4) {
                if (f2.S = false, t4.name && t4.name === "BarbaError")
                  throw f2.logger.debug(t4.label), f2.logger.error(t4.error), t4;
                throw f2.logger.debug("Transition error [page]"), f2.logger.error(t4), t4;
              });
              return Promise.resolve(h2 && h2.then ? h2.then(o2) : o2(h2));
            } catch (t4) {
              return Promise.reject(t4);
            }
          }, r2.once = function(t3, n2) {
            try {
              return Promise.resolve(X.do("once", t3, n2)).then(function() {
                return n2.once ? N(n2.once, n2)(t3) : Promise.resolve();
              });
            } catch (t4) {
              return Promise.reject(t4);
            }
          }, r2.leave = function(t3, n2) {
            try {
              return Promise.resolve(X.do("leave", t3, n2)).then(function() {
                return n2.leave ? N(n2.leave, n2)(t3) : Promise.resolve();
              });
            } catch (t4) {
              return Promise.reject(t4);
            }
          }, r2.enter = function(t3, n2, r3) {
            try {
              return Promise.resolve(X.do("enter", t3, n2)).then(function() {
                return n2.enter ? N(n2.enter, n2)(t3, r3) : Promise.resolve();
              });
            } catch (t4) {
              return Promise.reject(t4);
            }
          }, r2.add = function(t3, n2) {
            try {
              return j.addContainer(t3.next.container, n2), X.do("nextAdded", t3), Promise.resolve();
            } catch (t4) {
              return Promise.reject(t4);
            }
          }, r2.remove = function(t3) {
            try {
              return j.removeContainer(t3.current.container), X.do("currentRemoved", t3), Promise.resolve();
            } catch (t4) {
              return Promise.reject(t4);
            }
          }, r2.M = function(t3) {
            return t3.message ? !/Timeout error|Fetch error/.test(t3.message) : !t3.status;
          }, r2.j = function(t3, n2, r3) {
            try {
              return Promise.resolve(X.do(t3, n2, r3)).then(function() {
                return r3[t3] ? N(r3[t3], r3)(n2) : Promise.resolve();
              });
            } catch (t4) {
              return Promise.reject(t4);
            }
          }, n(t2, [{ key: "isRunning", get: function() {
            return this.S;
          }, set: function(t3) {
            this.S = t3;
          } }, { key: "hasOnce", get: function() {
            return this.store.once.length > 0;
          } }, { key: "hasSelf", get: function() {
            return this.store.all.some(function(t3) {
              return t3.name === "self";
            });
          } }, { key: "shouldWait", get: function() {
            return this.store.all.some(function(t3) {
              return t3.to && !t3.to.route || t3.sync;
            });
          } }]), t2;
        }(), ft = function() {
          function t2(t3) {
            var n2 = this;
            this.names = ["beforeLeave", "afterLeave", "beforeEnter", "afterEnter"], this.byNamespace = /* @__PURE__ */ new Map(), t3.length !== 0 && (t3.forEach(function(t4) {
              n2.byNamespace.set(t4.namespace, t4);
            }), this.names.forEach(function(t4) {
              X[t4](n2.L(t4));
            }));
          }
          return t2.prototype.L = function(t3) {
            var n2 = this;
            return function(r2) {
              var e2 = t3.match(/enter/i) ? r2.next : r2.current, i2 = n2.byNamespace.get(e2.namespace);
              return i2 && i2[t3] ? N(i2[t3], i2)(r2) : Promise.resolve();
            };
          }, t2;
        }();
        Element.prototype.matches || (Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector), Element.prototype.closest || (Element.prototype.closest = function(t2) {
          var n2 = this;
          do {
            if (n2.matches(t2))
              return n2;
            n2 = n2.parentElement || n2.parentNode;
          } while (n2 !== null && n2.nodeType === 1);
          return null;
        });
        var st = { container: null, html: "", namespace: "", url: { hash: "", href: "", path: "", port: null, query: {} } };
        return new (function() {
          function t2() {
            this.version = a, this.schemaPage = st, this.Logger = l, this.logger = new l("@barba/core"), this.plugins = [], this.hooks = X, this.dom = j, this.helpers = _, this.history = M, this.request = I, this.url = H;
          }
          var e2 = t2.prototype;
          return e2.use = function(t3, n2) {
            var r2 = this.plugins;
            r2.indexOf(t3) > -1 ? this.logger.warn("Plugin [" + t3.name + "] already installed.") : typeof t3.install == "function" ? (t3.install(this, n2), r2.push(t3)) : this.logger.warn("Plugin [" + t3.name + '] has no "install" method.');
          }, e2.init = function(t3) {
            var n2 = t3 === void 0 ? {} : t3, e3 = n2.transitions, i2 = e3 === void 0 ? [] : e3, o2 = n2.views, u2 = o2 === void 0 ? [] : o2, f2 = n2.schema, s2 = f2 === void 0 ? S : f2, c2 = n2.requestError, a2 = n2.timeout, h2 = a2 === void 0 ? 2e3 : a2, v2 = n2.cacheIgnore, d2 = v2 !== void 0 && v2, m2 = n2.prefetchIgnore, p2 = m2 !== void 0 && m2, w2 = n2.preventRunning, b2 = w2 !== void 0 && w2, y2 = n2.prevent, P2 = y2 === void 0 ? null : y2, g2 = n2.debug, E3 = n2.logLevel;
            if (l.setLevel((g2 !== void 0 && g2) === true ? "debug" : E3 === void 0 ? "off" : E3), this.logger.info(this.version), Object.keys(s2).forEach(function(t4) {
              S[t4] && (S[t4] = s2[t4]);
            }), this.$ = c2, this.timeout = h2, this.cacheIgnore = d2, this.prefetchIgnore = p2, this.preventRunning = b2, this._ = this.dom.getWrapper(), !this._)
              throw new Error("[@barba/core] No Barba wrapper found");
            this._.setAttribute("aria-live", "polite"), this.q();
            var x2 = this.data.current;
            if (!x2.container)
              throw new Error("[@barba/core] No Barba container found");
            if (this.cache = new G(d2), this.prevent = new et(p2), this.transitions = new ut(i2), this.views = new ft(u2), P2 !== null) {
              if (typeof P2 != "function")
                throw new Error("[@barba/core] Prevent should be a function");
              this.prevent.add("preventCustom", P2);
            }
            this.history.init(x2.url.href, x2.namespace), this.B = this.B.bind(this), this.U = this.U.bind(this), this.D = this.D.bind(this), this.F(), this.plugins.forEach(function(t4) {
              return t4.init();
            });
            var k2 = this.data;
            k2.trigger = "barba", k2.next = k2.current, k2.current = r({}, this.schemaPage), this.hooks.do("ready", k2), this.once(k2), this.q();
          }, e2.destroy = function() {
            this.q(), this.H(), this.history.clear(), this.hooks.clear(), this.plugins = [];
          }, e2.force = function(t3) {
            window.location.assign(t3);
          }, e2.go = function(t3, n2, r2) {
            var e3;
            if (n2 === void 0 && (n2 = "barba"), this.transitions.isRunning)
              this.force(t3);
            else if (!(e3 = n2 === "popstate" ? this.history.current && this.url.getPath(this.history.current.url) === this.url.getPath(t3) : this.prevent.run("sameUrl", null, null, t3)) || this.transitions.hasSelf)
              return n2 = this.history.change(t3, n2, r2), r2 && (r2.stopPropagation(), r2.preventDefault()), this.page(t3, n2, e3);
          }, e2.once = function(t3) {
            try {
              var n2 = this;
              return Promise.resolve(n2.hooks.do("beforeEnter", t3)).then(function() {
                function r2() {
                  return Promise.resolve(n2.hooks.do("afterEnter", t3)).then(function() {
                  });
                }
                var e3 = function() {
                  if (n2.transitions.hasOnce) {
                    var r3 = n2.transitions.get(t3, { once: true });
                    return Promise.resolve(n2.transitions.doOnce({ transition: r3, data: t3 })).then(function() {
                    });
                  }
                }();
                return e3 && e3.then ? e3.then(r2) : r2();
              });
            } catch (t4) {
              return Promise.reject(t4);
            }
          }, e2.page = function(t3, n2, e3) {
            try {
              var i2 = function() {
                var t4 = o2.data;
                return Promise.resolve(o2.hooks.do("page", t4)).then(function() {
                  var n3 = s(function() {
                    var n4 = o2.transitions.get(t4, { once: false, self: e3 });
                    return Promise.resolve(o2.transitions.doPage({ data: t4, page: u2, transition: n4, wrapper: o2._ })).then(function() {
                      o2.q();
                    });
                  }, function() {
                    l.getLevel() === 0 && o2.force(t4.current.url.href);
                  });
                  if (n3 && n3.then)
                    return n3.then(function() {
                    });
                });
              }, o2 = this;
              o2.data.next.url = r({ href: t3 }, o2.url.parse(t3)), o2.data.trigger = n2;
              var u2 = o2.cache.has(t3) ? o2.cache.update(t3, { action: "click" }).request : o2.cache.set(t3, o2.request(t3, o2.timeout, o2.onRequestError.bind(o2, n2)), "click").request, f2 = function() {
                if (o2.transitions.shouldWait)
                  return Promise.resolve(L(u2, o2.data)).then(function() {
                  });
              }();
              return Promise.resolve(f2 && f2.then ? f2.then(i2) : i2());
            } catch (t4) {
              return Promise.reject(t4);
            }
          }, e2.onRequestError = function(t3) {
            this.transitions.isRunning = false;
            for (var n2 = arguments.length, r2 = new Array(n2 > 1 ? n2 - 1 : 0), e3 = 1; e3 < n2; e3++)
              r2[e3 - 1] = arguments[e3];
            var i2 = r2[0], o2 = r2[1], u2 = this.cache.getAction(i2);
            return this.cache.delete(i2), !(this.$ && this.$(t3, u2, i2, o2) === false || (u2 === "click" && this.force(i2), 1));
          }, e2.prefetch = function(t3) {
            var n2 = this;
            this.cache.has(t3) || this.cache.set(t3, this.request(t3, this.timeout, this.onRequestError.bind(this, "barba")).catch(function(t4) {
              n2.logger.error(t4);
            }), "prefetch");
          }, e2.F = function() {
            this.prefetchIgnore !== true && (document.addEventListener("mouseover", this.B), document.addEventListener("touchstart", this.B)), document.addEventListener("click", this.U), window.addEventListener("popstate", this.D);
          }, e2.H = function() {
            this.prefetchIgnore !== true && (document.removeEventListener("mouseover", this.B), document.removeEventListener("touchstart", this.B)), document.removeEventListener("click", this.U), window.removeEventListener("popstate", this.D);
          }, e2.B = function(t3) {
            var n2 = this, r2 = this.I(t3);
            if (r2) {
              var e3 = this.dom.getHref(r2);
              this.prevent.checkHref(e3) || this.cache.has(e3) || this.cache.set(e3, this.request(e3, this.timeout, this.onRequestError.bind(this, r2)).catch(function(t4) {
                n2.logger.error(t4);
              }), "enter");
            }
          }, e2.U = function(t3) {
            var n2 = this.I(t3);
            if (n2)
              return this.transitions.isRunning && this.preventRunning ? (t3.preventDefault(), void t3.stopPropagation()) : void this.go(this.dom.getHref(n2), n2, t3);
          }, e2.D = function(t3) {
            this.go(this.url.getHref(), "popstate", t3);
          }, e2.I = function(t3) {
            for (var n2 = t3.target; n2 && !this.dom.getHref(n2); )
              n2 = n2.parentNode;
            if (n2 && !this.prevent.checkLink(n2, t3, this.dom.getHref(n2)))
              return n2;
          }, e2.q = function() {
            var t3 = this.url.getHref(), n2 = { container: this.dom.getContainer(), html: this.dom.getHtml(), namespace: this.dom.getNamespace(), url: r({ href: t3 }, this.url.parse(t3)) };
            this.C = { current: n2, next: r({}, this.schemaPage), trigger: void 0 }, this.hooks.do("reset", this.data);
          }, n(t2, [{ key: "data", get: function() {
            return this.C;
          } }, { key: "wrapper", get: function() {
            return this._;
          } }]), t2;
        }())();
      });
    }
  });

  // node_modules/svg4everybody/dist/svg4everybody.js
  var require_svg4everybody = __commonJS({
    "node_modules/svg4everybody/dist/svg4everybody.js"(exports, module) {
      !function(root, factory) {
        typeof define == "function" && define.amd ? define([], function() {
          return root.svg4everybody = factory();
        }) : typeof module == "object" && module.exports ? module.exports = factory() : root.svg4everybody = factory();
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
            if (xhr.readyState === 4) {
              var cachedDocument = xhr._cachedDocument;
              cachedDocument || (cachedDocument = xhr._cachedDocument = document.implementation.createHTMLDocument(""), cachedDocument.body.innerHTML = xhr.responseText, xhr._cachedTarget = {}), xhr._embeds.splice(0).map(function(item) {
                var target = xhr._cachedTarget[item.id];
                target || (target = xhr._cachedTarget[item.id] = cachedDocument.getElementById(item.id)), embed(item.parent, item.svg, target);
              });
            }
          }, xhr.onreadystatechange();
        }
        function svg4everybody2(rawopts) {
          function oninterval() {
            for (var index = 0; index < uses.length; ) {
              var use = uses[index], parent = use.parentNode, svg = getSVGAncestor(parent), src2 = use.getAttribute("xlink:href") || use.getAttribute("href");
              if (!src2 && opts.attributeName && (src2 = use.getAttribute(opts.attributeName)), svg && src2) {
                if (polyfill) {
                  if (!opts.validate || opts.validate(src2, svg, use)) {
                    parent.removeChild(use);
                    var srcSplit = src2.split("#"), url = srcSplit.shift(), id = srcSplit.join("#");
                    if (url.length) {
                      var xhr = requests[url];
                      xhr || (xhr = requests[url] = new XMLHttpRequest(), xhr.open("GET", url), xhr.send(), xhr._embeds = []), xhr._embeds.push({
                        parent,
                        svg,
                        id
                      }), loadreadystatechange(xhr);
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
          for (var svg = node; svg.nodeName.toLowerCase() !== "svg" && (svg = svg.parentNode); ) {
          }
          return svg;
        }
        return svg4everybody2;
      });
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
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
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
  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
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
  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr)))
      return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = void 0;
    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);
        if (i && _arr.length === i)
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
  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length)
      len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++)
      arr2[i] = arr[i];
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
      value: function mCheckEventTarget(e) {
        var event = this.events[e.type];
        if (typeof event === "string") {
          this[event](e);
        } else {
          var data = "[" + this.mAttr + "]";
          var target = e.target;
          if (this.mCaptureEvents.includes(e.type)) {
            if (target.matches(data)) {
              this.mCallEventMethod(e, event, target);
            }
          } else {
            while (target && target !== document) {
              if (target.matches(data)) {
                if (this.mCallEventMethod(e, event, target) != "undefined") {
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
      value: function mCallEventMethod(e, event, target) {
        var name = target.getAttribute(this.mAttr);
        if (event.hasOwnProperty(name)) {
          var method = event[name];
          if (!e.hasOwnProperty("currentTarget")) {
            Object.defineProperty(e, "currentTarget", {
              value: target
            });
          }
          if (!e.hasOwnProperty("curTarget")) {
            Object.defineProperty(e, "curTarget", {
              value: target
            });
          }
          this[method](e);
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
      value: function on(e, mod, func, id) {
        var _this4 = this;
        if (this.modules[mod]) {
          if (id) {
            this.modules[mod][id].el.addEventListener(e, function(o) {
              return func(o);
            });
          } else {
            Object.keys(this.modules[mod]).forEach(function(i) {
              _this4.modules[mod][i].el.addEventListener(e, function(o) {
                return func(o);
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
          Array.from(el.attributes).forEach(function(i) {
            if (i.name.startsWith("data-module")) {
              var moduleExists = false;
              var dataName = i.name.split("-").splice(2);
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
                var id = i.value;
                if (!id) {
                  _this.moduleId++;
                  id = "m" + _this.moduleId;
                  el.setAttribute(i.name, id);
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
          Array.from(el.attributes).forEach(function(i) {
            if (i.name.startsWith("data-module")) {
              var id = i.value;
              var dataName = i.name.split("-").splice(2);
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
    Load: () => Load_default,
    Scroll: () => Scroll_default
  });

  // assets/scripts/modules/Load.js
  var import_core = __toESM(require_barba_umd(), 1);

  // assets/scripts/config.js
  var env = "development";
  var config_default = config = Object.freeze({
    ENV: env,
    IS_PROD: env === "production",
    IS_DEV: env === "development",
    CLASS_NAME: {
      LOADING: "is-loading",
      READY: "is-ready",
      LOADED: "is-loaded"
    }
  });

  // assets/scripts/modules/Load.js
  var Load_default = class extends _default {
    constructor(m) {
      super(m);
    }
    init() {
      import_core.default.init({
        debug: config_default.IS_DEV,
        schema: {
          prefix: "data-load"
        },
        transitions: [{
          name: "default-transition",
          leave: (data) => {
            this.call("destroy", data.current.container, "app");
          },
          enter: (data) => {
            this.call("update", data.next.container, "app");
          }
        }]
      });
    }
  };

  // assets/scripts/utils/image.js
  var LAZY_LOADED_IMAGES = [];
  function loadImage(url, options = {}) {
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
        $img.decode().then(loadCallback).catch((e) => {
          reject(e);
        });
      } else {
        $img.onload = loadCallback;
        $img.onerror = (e) => {
          reject(e);
        };
        $img.src = url;
      }
    });
  }
  function getImageMetadata($img) {
    return {
      url: $img.src,
      width: $img.naturalWidth,
      height: $img.naturalHeight,
      ratio: $img.naturalWidth / $img.naturalHeight
    };
  }
  function lazyLoadImage($el, url, callback) {
    return __async(this, null, function* () {
      let src2 = url ? url : $el.dataset.src;
      let loadedImage = LAZY_LOADED_IMAGES.find((image) => image.url === src2);
      if (!loadedImage) {
        loadedImage = yield loadImage(src2);
        if (!loadedImage.url) {
          return;
        }
        LAZY_LOADED_IMAGES.push(loadedImage);
      }
      if ($el.src === src2) {
        return;
      }
      if ($el.tagName === "IMG") {
        $el.src = loadedImage.url;
      } else {
        $el.style.backgroundImage = `url(${loadedImage.url})`;
      }
      requestAnimationFrame(() => {
        let lazyParent = $el.closest(".c-lazy");
        if (lazyParent) {
          lazyParent.classList.add("-lazy-loaded");
          lazyParent.style.backgroundImage = "";
        }
        $el.classList.add("-lazy-loaded");
        callback == null ? void 0 : callback();
      });
    });
  }

  // node_modules/locomotive-scroll/dist/locomotive-scroll.esm.js
  function _classCallCheck2(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function _defineProperties2(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
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
  function _defineProperty2(obj, key, value) {
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
  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly)
        symbols = symbols.filter(function(sym) {
          return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        });
      keys.push.apply(keys, symbols);
    }
    return keys;
  }
  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};
      if (i % 2) {
        ownKeys(Object(source), true).forEach(function(key) {
          _defineProperty2(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function(key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }
    return target;
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
    if (superClass)
      _setPrototypeOf(subClass, superClass);
  }
  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf2(o2) {
      return o2.__proto__ || Object.getPrototypeOf(o2);
    };
    return _getPrototypeOf(o);
  }
  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf2(o2, p2) {
      o2.__proto__ = p2;
      return o2;
    };
    return _setPrototypeOf(o, p);
  }
  function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct)
      return false;
    if (Reflect.construct.sham)
      return false;
    if (typeof Proxy === "function")
      return true;
    try {
      Date.prototype.toString.call(Reflect.construct(Date, [], function() {
      }));
      return true;
    } catch (e) {
      return false;
    }
  }
  function _assertThisInitialized(self2) {
    if (self2 === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self2;
  }
  function _possibleConstructorReturn(self2, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }
    return _assertThisInitialized(self2);
  }
  function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();
    return function _createSuperInternal() {
      var Super = _getPrototypeOf(Derived), result;
      if (hasNativeReflectConstruct) {
        var NewTarget = _getPrototypeOf(this).constructor;
        result = Reflect.construct(Super, arguments, NewTarget);
      } else {
        result = Super.apply(this, arguments);
      }
      return _possibleConstructorReturn(this, result);
    };
  }
  function _superPropBase(object, property) {
    while (!Object.prototype.hasOwnProperty.call(object, property)) {
      object = _getPrototypeOf(object);
      if (object === null)
        break;
    }
    return object;
  }
  function _get(target, property, receiver) {
    if (typeof Reflect !== "undefined" && Reflect.get) {
      _get = Reflect.get;
    } else {
      _get = function _get2(target2, property2, receiver2) {
        var base = _superPropBase(target2, property2);
        if (!base)
          return;
        var desc = Object.getOwnPropertyDescriptor(base, property2);
        if (desc.get) {
          return desc.get.call(receiver2);
        }
        return desc.value;
      };
    }
    return _get(target, property, receiver || target);
  }
  function _slicedToArray2(arr, i) {
    return _arrayWithHoles2(arr) || _iterableToArrayLimit2(arr, i) || _unsupportedIterableToArray2(arr, i) || _nonIterableRest2();
  }
  function _toConsumableArray2(arr) {
    return _arrayWithoutHoles2(arr) || _iterableToArray2(arr) || _unsupportedIterableToArray2(arr) || _nonIterableSpread2();
  }
  function _arrayWithoutHoles2(arr) {
    if (Array.isArray(arr))
      return _arrayLikeToArray2(arr);
  }
  function _arrayWithHoles2(arr) {
    if (Array.isArray(arr))
      return arr;
  }
  function _iterableToArray2(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter))
      return Array.from(iter);
  }
  function _iterableToArrayLimit2(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr)))
      return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = void 0;
    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);
        if (i && _arr.length === i)
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
  function _arrayLikeToArray2(arr, len) {
    if (len == null || len > arr.length)
      len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++)
      arr2[i] = arr[i];
    return arr2;
  }
  function _nonIterableSpread2() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _nonIterableRest2() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  var defaults = {
    el: document,
    name: "scroll",
    offset: [0, 0],
    repeat: false,
    smooth: false,
    initPosition: {
      x: 0,
      y: 0
    },
    direction: "vertical",
    gestureDirection: "vertical",
    reloadOnContextChange: false,
    lerp: 0.1,
    "class": "is-inview",
    scrollbarContainer: false,
    scrollbarClass: "c-scrollbar",
    scrollingClass: "has-scroll-scrolling",
    draggingClass: "has-scroll-dragging",
    smoothClass: "has-scroll-smooth",
    initClass: "has-scroll-init",
    getSpeed: false,
    getDirection: false,
    scrollFromAnywhere: false,
    multiplier: 1,
    firefoxMultiplier: 50,
    touchMultiplier: 2,
    resetNativeScroll: true,
    tablet: {
      smooth: false,
      direction: "vertical",
      gestureDirection: "vertical",
      breakpoint: 1024
    },
    smartphone: {
      smooth: false,
      direction: "vertical",
      gestureDirection: "vertical"
    }
  };
  var _default2 = /* @__PURE__ */ function() {
    function _default3() {
      var options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
      _classCallCheck2(this, _default3);
      Object.assign(this, defaults, options);
      this.smartphone = defaults.smartphone;
      if (options.smartphone)
        Object.assign(this.smartphone, options.smartphone);
      this.tablet = defaults.tablet;
      if (options.tablet)
        Object.assign(this.tablet, options.tablet);
      this.namespace = "locomotive";
      this.html = document.documentElement;
      this.windowHeight = window.innerHeight;
      this.windowWidth = window.innerWidth;
      this.windowMiddle = {
        x: this.windowWidth / 2,
        y: this.windowHeight / 2
      };
      this.els = {};
      this.currentElements = {};
      this.listeners = {};
      this.hasScrollTicking = false;
      this.hasCallEventSet = false;
      this.checkScroll = this.checkScroll.bind(this);
      this.checkResize = this.checkResize.bind(this);
      this.checkEvent = this.checkEvent.bind(this);
      this.instance = {
        scroll: {
          x: 0,
          y: 0
        },
        limit: {
          x: this.html.offsetWidth,
          y: this.html.offsetHeight
        },
        currentElements: this.currentElements
      };
      if (this.isMobile) {
        if (this.isTablet) {
          this.context = "tablet";
        } else {
          this.context = "smartphone";
        }
      } else {
        this.context = "desktop";
      }
      if (this.isMobile)
        this.direction = this[this.context].direction;
      if (this.direction === "horizontal") {
        this.directionAxis = "x";
      } else {
        this.directionAxis = "y";
      }
      if (this.getDirection) {
        this.instance.direction = null;
      }
      if (this.getDirection) {
        this.instance.speed = 0;
      }
      this.html.classList.add(this.initClass);
      window.addEventListener("resize", this.checkResize, false);
    }
    _createClass2(_default3, [{
      key: "init",
      value: function init2() {
        this.initEvents();
      }
    }, {
      key: "checkScroll",
      value: function checkScroll() {
        this.dispatchScroll();
      }
    }, {
      key: "checkResize",
      value: function checkResize() {
        var _this = this;
        if (!this.resizeTick) {
          this.resizeTick = true;
          requestAnimationFrame(function() {
            _this.resize();
            _this.resizeTick = false;
          });
        }
      }
    }, {
      key: "resize",
      value: function resize() {
      }
    }, {
      key: "checkContext",
      value: function checkContext() {
        if (!this.reloadOnContextChange)
          return;
        this.isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1 || this.windowWidth < this.tablet.breakpoint;
        this.isTablet = this.isMobile && this.windowWidth >= this.tablet.breakpoint;
        var oldContext = this.context;
        if (this.isMobile) {
          if (this.isTablet) {
            this.context = "tablet";
          } else {
            this.context = "smartphone";
          }
        } else {
          this.context = "desktop";
        }
        if (oldContext != this.context) {
          var oldSmooth = oldContext == "desktop" ? this.smooth : this[oldContext].smooth;
          var newSmooth = this.context == "desktop" ? this.smooth : this[this.context].smooth;
          if (oldSmooth != newSmooth)
            window.location.reload();
        }
      }
    }, {
      key: "initEvents",
      value: function initEvents() {
        var _this2 = this;
        this.scrollToEls = this.el.querySelectorAll("[data-".concat(this.name, "-to]"));
        this.setScrollTo = this.setScrollTo.bind(this);
        this.scrollToEls.forEach(function(el) {
          el.addEventListener("click", _this2.setScrollTo, false);
        });
      }
    }, {
      key: "setScrollTo",
      value: function setScrollTo(event) {
        event.preventDefault();
        this.scrollTo(event.currentTarget.getAttribute("data-".concat(this.name, "-href")) || event.currentTarget.getAttribute("href"), {
          offset: event.currentTarget.getAttribute("data-".concat(this.name, "-offset"))
        });
      }
    }, {
      key: "addElements",
      value: function addElements() {
      }
    }, {
      key: "detectElements",
      value: function detectElements(hasCallEventSet) {
        var _this3 = this;
        var scrollTop = this.instance.scroll.y;
        var scrollBottom = scrollTop + this.windowHeight;
        var scrollLeft = this.instance.scroll.x;
        var scrollRight = scrollLeft + this.windowWidth;
        Object.entries(this.els).forEach(function(_ref) {
          var _ref2 = _slicedToArray2(_ref, 2), i = _ref2[0], el = _ref2[1];
          if (el && (!el.inView || hasCallEventSet)) {
            if (_this3.direction === "horizontal") {
              if (scrollRight >= el.left && scrollLeft < el.right) {
                _this3.setInView(el, i);
              }
            } else {
              if (scrollBottom >= el.top && scrollTop < el.bottom) {
                _this3.setInView(el, i);
              }
            }
          }
          if (el && el.inView) {
            if (_this3.direction === "horizontal") {
              var width = el.right - el.left;
              el.progress = (_this3.instance.scroll.x - (el.left - _this3.windowWidth)) / (width + _this3.windowWidth);
              if (scrollRight < el.left || scrollLeft > el.right) {
                _this3.setOutOfView(el, i);
              }
            } else {
              var height = el.bottom - el.top;
              el.progress = (_this3.instance.scroll.y - (el.top - _this3.windowHeight)) / (height + _this3.windowHeight);
              if (scrollBottom < el.top || scrollTop > el.bottom) {
                _this3.setOutOfView(el, i);
              }
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
        this.currentElements[i] = current;
        if (current.call && this.hasCallEventSet) {
          this.dispatchCall(current, "enter");
          if (!current.repeat) {
            this.els[i].call = false;
          }
        }
      }
    }, {
      key: "setOutOfView",
      value: function setOutOfView(current, i) {
        var _this4 = this;
        this.els[i].inView = false;
        Object.keys(this.currentElements).forEach(function(el) {
          el === i && delete _this4.currentElements[el];
        });
        if (current.call && this.hasCallEventSet) {
          this.dispatchCall(current, "exit");
        }
        if (current.repeat) {
          current.el.classList.remove(current["class"]);
        }
      }
    }, {
      key: "dispatchCall",
      value: function dispatchCall(current, way) {
        this.callWay = way;
        this.callValue = current.call.split(",").map(function(item) {
          return item.trim();
        });
        this.callObj = current;
        if (this.callValue.length == 1)
          this.callValue = this.callValue[0];
        var callEvent = new Event(this.namespace + "call");
        this.el.dispatchEvent(callEvent);
      }
    }, {
      key: "dispatchScroll",
      value: function dispatchScroll() {
        var scrollEvent = new Event(this.namespace + "scroll");
        this.el.dispatchEvent(scrollEvent);
      }
    }, {
      key: "setEvents",
      value: function setEvents(event, func) {
        if (!this.listeners[event]) {
          this.listeners[event] = [];
        }
        var list = this.listeners[event];
        list.push(func);
        if (list.length === 1) {
          this.el.addEventListener(this.namespace + event, this.checkEvent, false);
        }
        if (event === "call") {
          this.hasCallEventSet = true;
          this.detectElements(true);
        }
      }
    }, {
      key: "unsetEvents",
      value: function unsetEvents(event, func) {
        if (!this.listeners[event])
          return;
        var list = this.listeners[event];
        var index = list.indexOf(func);
        if (index < 0)
          return;
        list.splice(index, 1);
        if (list.index === 0) {
          this.el.removeEventListener(this.namespace + event, this.checkEvent, false);
        }
      }
    }, {
      key: "checkEvent",
      value: function checkEvent(event) {
        var _this5 = this;
        var name = event.type.replace(this.namespace, "");
        var list = this.listeners[name];
        if (!list || list.length === 0)
          return;
        list.forEach(function(func) {
          switch (name) {
            case "scroll":
              return func(_this5.instance);
            case "call":
              return func(_this5.callValue, _this5.callWay, _this5.callObj);
            default:
              return func();
          }
        });
      }
    }, {
      key: "startScroll",
      value: function startScroll() {
      }
    }, {
      key: "stopScroll",
      value: function stopScroll() {
      }
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
        var _this6 = this;
        window.removeEventListener("resize", this.checkResize, false);
        Object.keys(this.listeners).forEach(function(event) {
          _this6.el.removeEventListener(_this6.namespace + event, _this6.checkEvent, false);
        });
        this.listeners = {};
        this.scrollToEls.forEach(function(el) {
          el.removeEventListener("click", _this6.setScrollTo, false);
        });
        this.html.classList.remove(this.initClass);
      }
    }]);
    return _default3;
  }();
  var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
  function createCommonjsModule(fn, module) {
    return module = { exports: {} }, fn(module, module.exports), module.exports;
  }
  var smoothscroll = createCommonjsModule(function(module, exports) {
    (function() {
      function polyfill() {
        var w = window;
        var d = document;
        if ("scrollBehavior" in d.documentElement.style && w.__forceSmoothScrollPolyfill__ !== true) {
          return;
        }
        var Element2 = w.HTMLElement || w.Element;
        var SCROLL_TIME = 468;
        var original = {
          scroll: w.scroll || w.scrollTo,
          scrollBy: w.scrollBy,
          elementScroll: Element2.prototype.scroll || scrollElement,
          scrollIntoView: Element2.prototype.scrollIntoView
        };
        var now = w.performance && w.performance.now ? w.performance.now.bind(w.performance) : Date.now;
        function isMicrosoftBrowser(userAgent) {
          var userAgentPatterns = ["MSIE ", "Trident/", "Edge/"];
          return new RegExp(userAgentPatterns.join("|")).test(userAgent);
        }
        var ROUNDING_TOLERANCE = isMicrosoftBrowser(w.navigator.userAgent) ? 1 : 0;
        function scrollElement(x, y) {
          this.scrollLeft = x;
          this.scrollTop = y;
        }
        function ease(k) {
          return 0.5 * (1 - Math.cos(Math.PI * k));
        }
        function shouldBailOut(firstArg) {
          if (firstArg === null || typeof firstArg !== "object" || firstArg.behavior === void 0 || firstArg.behavior === "auto" || firstArg.behavior === "instant") {
            return true;
          }
          if (typeof firstArg === "object" && firstArg.behavior === "smooth") {
            return false;
          }
          throw new TypeError("behavior member of ScrollOptions " + firstArg.behavior + " is not a valid value for enumeration ScrollBehavior.");
        }
        function hasScrollableSpace(el, axis) {
          if (axis === "Y") {
            return el.clientHeight + ROUNDING_TOLERANCE < el.scrollHeight;
          }
          if (axis === "X") {
            return el.clientWidth + ROUNDING_TOLERANCE < el.scrollWidth;
          }
        }
        function canOverflow(el, axis) {
          var overflowValue = w.getComputedStyle(el, null)["overflow" + axis];
          return overflowValue === "auto" || overflowValue === "scroll";
        }
        function isScrollable(el) {
          var isScrollableY = hasScrollableSpace(el, "Y") && canOverflow(el, "Y");
          var isScrollableX = hasScrollableSpace(el, "X") && canOverflow(el, "X");
          return isScrollableY || isScrollableX;
        }
        function findScrollableParent(el) {
          while (el !== d.body && isScrollable(el) === false) {
            el = el.parentNode || el.host;
          }
          return el;
        }
        function step(context) {
          var time = now();
          var value;
          var currentX;
          var currentY;
          var elapsed = (time - context.startTime) / SCROLL_TIME;
          elapsed = elapsed > 1 ? 1 : elapsed;
          value = ease(elapsed);
          currentX = context.startX + (context.x - context.startX) * value;
          currentY = context.startY + (context.y - context.startY) * value;
          context.method.call(context.scrollable, currentX, currentY);
          if (currentX !== context.x || currentY !== context.y) {
            w.requestAnimationFrame(step.bind(w, context));
          }
        }
        function smoothScroll(el, x, y) {
          var scrollable;
          var startX;
          var startY;
          var method;
          var startTime = now();
          if (el === d.body) {
            scrollable = w;
            startX = w.scrollX || w.pageXOffset;
            startY = w.scrollY || w.pageYOffset;
            method = original.scroll;
          } else {
            scrollable = el;
            startX = el.scrollLeft;
            startY = el.scrollTop;
            method = scrollElement;
          }
          step({
            scrollable,
            method,
            startTime,
            startX,
            startY,
            x,
            y
          });
        }
        w.scroll = w.scrollTo = function() {
          if (arguments[0] === void 0) {
            return;
          }
          if (shouldBailOut(arguments[0]) === true) {
            original.scroll.call(w, arguments[0].left !== void 0 ? arguments[0].left : typeof arguments[0] !== "object" ? arguments[0] : w.scrollX || w.pageXOffset, arguments[0].top !== void 0 ? arguments[0].top : arguments[1] !== void 0 ? arguments[1] : w.scrollY || w.pageYOffset);
            return;
          }
          smoothScroll.call(w, d.body, arguments[0].left !== void 0 ? ~~arguments[0].left : w.scrollX || w.pageXOffset, arguments[0].top !== void 0 ? ~~arguments[0].top : w.scrollY || w.pageYOffset);
        };
        w.scrollBy = function() {
          if (arguments[0] === void 0) {
            return;
          }
          if (shouldBailOut(arguments[0])) {
            original.scrollBy.call(w, arguments[0].left !== void 0 ? arguments[0].left : typeof arguments[0] !== "object" ? arguments[0] : 0, arguments[0].top !== void 0 ? arguments[0].top : arguments[1] !== void 0 ? arguments[1] : 0);
            return;
          }
          smoothScroll.call(w, d.body, ~~arguments[0].left + (w.scrollX || w.pageXOffset), ~~arguments[0].top + (w.scrollY || w.pageYOffset));
        };
        Element2.prototype.scroll = Element2.prototype.scrollTo = function() {
          if (arguments[0] === void 0) {
            return;
          }
          if (shouldBailOut(arguments[0]) === true) {
            if (typeof arguments[0] === "number" && arguments[1] === void 0) {
              throw new SyntaxError("Value could not be converted");
            }
            original.elementScroll.call(this, arguments[0].left !== void 0 ? ~~arguments[0].left : typeof arguments[0] !== "object" ? ~~arguments[0] : this.scrollLeft, arguments[0].top !== void 0 ? ~~arguments[0].top : arguments[1] !== void 0 ? ~~arguments[1] : this.scrollTop);
            return;
          }
          var left = arguments[0].left;
          var top = arguments[0].top;
          smoothScroll.call(this, this, typeof left === "undefined" ? this.scrollLeft : ~~left, typeof top === "undefined" ? this.scrollTop : ~~top);
        };
        Element2.prototype.scrollBy = function() {
          if (arguments[0] === void 0) {
            return;
          }
          if (shouldBailOut(arguments[0]) === true) {
            original.elementScroll.call(this, arguments[0].left !== void 0 ? ~~arguments[0].left + this.scrollLeft : ~~arguments[0] + this.scrollLeft, arguments[0].top !== void 0 ? ~~arguments[0].top + this.scrollTop : ~~arguments[1] + this.scrollTop);
            return;
          }
          this.scroll({
            left: ~~arguments[0].left + this.scrollLeft,
            top: ~~arguments[0].top + this.scrollTop,
            behavior: arguments[0].behavior
          });
        };
        Element2.prototype.scrollIntoView = function() {
          if (shouldBailOut(arguments[0]) === true) {
            original.scrollIntoView.call(this, arguments[0] === void 0 ? true : arguments[0]);
            return;
          }
          var scrollableParent = findScrollableParent(this);
          var parentRects = scrollableParent.getBoundingClientRect();
          var clientRects = this.getBoundingClientRect();
          if (scrollableParent !== d.body) {
            smoothScroll.call(this, scrollableParent, scrollableParent.scrollLeft + clientRects.left - parentRects.left, scrollableParent.scrollTop + clientRects.top - parentRects.top);
            if (w.getComputedStyle(scrollableParent).position !== "fixed") {
              w.scrollBy({
                left: parentRects.left,
                top: parentRects.top,
                behavior: "smooth"
              });
            }
          } else {
            w.scrollBy({
              left: clientRects.left,
              top: clientRects.top,
              behavior: "smooth"
            });
          }
        };
      }
      {
        module.exports = { polyfill };
      }
    })();
  });
  var smoothscroll_1 = smoothscroll.polyfill;
  var _default$12 = /* @__PURE__ */ function(_Core) {
    _inherits(_default3, _Core);
    var _super = _createSuper(_default3);
    function _default3() {
      var _this;
      var options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
      _classCallCheck2(this, _default3);
      _this = _super.call(this, options);
      if (_this.resetNativeScroll) {
        if (history.scrollRestoration) {
          history.scrollRestoration = "manual";
        }
        window.scrollTo(0, 0);
      }
      window.addEventListener("scroll", _this.checkScroll, false);
      if (window.smoothscrollPolyfill === void 0) {
        window.smoothscrollPolyfill = smoothscroll;
        window.smoothscrollPolyfill.polyfill();
      }
      return _this;
    }
    _createClass2(_default3, [{
      key: "init",
      value: function init2() {
        this.instance.scroll.y = window.pageYOffset;
        this.addElements();
        this.detectElements();
        _get(_getPrototypeOf(_default3.prototype), "init", this).call(this);
      }
    }, {
      key: "checkScroll",
      value: function checkScroll() {
        var _this2 = this;
        _get(_getPrototypeOf(_default3.prototype), "checkScroll", this).call(this);
        if (this.getDirection) {
          this.addDirection();
        }
        if (this.getSpeed) {
          this.addSpeed();
          this.speedTs = Date.now();
        }
        this.instance.scroll.y = window.pageYOffset;
        if (Object.entries(this.els).length) {
          if (!this.hasScrollTicking) {
            requestAnimationFrame(function() {
              _this2.detectElements();
            });
            this.hasScrollTicking = true;
          }
        }
      }
    }, {
      key: "addDirection",
      value: function addDirection() {
        if (window.pageYOffset > this.instance.scroll.y) {
          if (this.instance.direction !== "down") {
            this.instance.direction = "down";
          }
        } else if (window.pageYOffset < this.instance.scroll.y) {
          if (this.instance.direction !== "up") {
            this.instance.direction = "up";
          }
        }
      }
    }, {
      key: "addSpeed",
      value: function addSpeed() {
        if (window.pageYOffset != this.instance.scroll.y) {
          this.instance.speed = (window.pageYOffset - this.instance.scroll.y) / Math.max(1, Date.now() - this.speedTs);
        } else {
          this.instance.speed = 0;
        }
      }
    }, {
      key: "resize",
      value: function resize() {
        if (Object.entries(this.els).length) {
          this.windowHeight = window.innerHeight;
          this.updateElements();
        }
      }
    }, {
      key: "addElements",
      value: function addElements() {
        var _this3 = this;
        this.els = {};
        var els = this.el.querySelectorAll("[data-" + this.name + "]");
        els.forEach(function(el, index) {
          var BCR = el.getBoundingClientRect();
          var cl = el.dataset[_this3.name + "Class"] || _this3["class"];
          var id = typeof el.dataset[_this3.name + "Id"] === "string" ? el.dataset[_this3.name + "Id"] : index;
          var top;
          var left;
          var offset = typeof el.dataset[_this3.name + "Offset"] === "string" ? el.dataset[_this3.name + "Offset"].split(",") : _this3.offset;
          var repeat = el.dataset[_this3.name + "Repeat"];
          var call = el.dataset[_this3.name + "Call"];
          var target = el.dataset[_this3.name + "Target"];
          var targetEl;
          if (target !== void 0) {
            targetEl = document.querySelector("".concat(target));
          } else {
            targetEl = el;
          }
          var targetElBCR = targetEl.getBoundingClientRect();
          top = targetElBCR.top + _this3.instance.scroll.y;
          left = targetElBCR.left + _this3.instance.scroll.x;
          var bottom = top + targetEl.offsetHeight;
          var right = left + targetEl.offsetWidth;
          if (repeat == "false") {
            repeat = false;
          } else if (repeat != void 0) {
            repeat = true;
          } else {
            repeat = _this3.repeat;
          }
          var relativeOffset = _this3.getRelativeOffset(offset);
          top = top + relativeOffset[0];
          bottom = bottom - relativeOffset[1];
          var mappedEl = {
            el,
            targetEl,
            id,
            "class": cl,
            top,
            bottom,
            left,
            right,
            offset,
            progress: 0,
            repeat,
            inView: false,
            call
          };
          _this3.els[id] = mappedEl;
          if (el.classList.contains(cl)) {
            _this3.setInView(_this3.els[id], id);
          }
        });
      }
    }, {
      key: "updateElements",
      value: function updateElements() {
        var _this4 = this;
        Object.entries(this.els).forEach(function(_ref) {
          var _ref2 = _slicedToArray2(_ref, 2), i = _ref2[0], el = _ref2[1];
          var top = el.targetEl.getBoundingClientRect().top + _this4.instance.scroll.y;
          var bottom = top + el.targetEl.offsetHeight;
          var relativeOffset = _this4.getRelativeOffset(el.offset);
          _this4.els[i].top = top + relativeOffset[0];
          _this4.els[i].bottom = bottom - relativeOffset[1];
        });
        this.hasScrollTicking = false;
      }
    }, {
      key: "getRelativeOffset",
      value: function getRelativeOffset(offset) {
        var relativeOffset = [0, 0];
        if (offset) {
          for (var i = 0; i < offset.length; i++) {
            if (typeof offset[i] == "string") {
              if (offset[i].includes("%")) {
                relativeOffset[i] = parseInt(offset[i].replace("%", "") * this.windowHeight / 100);
              } else {
                relativeOffset[i] = parseInt(offset[i]);
              }
            } else {
              relativeOffset[i] = offset[i];
            }
          }
        }
        return relativeOffset;
      }
    }, {
      key: "scrollTo",
      value: function scrollTo(target) {
        var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        var offset = parseInt(options.offset) || 0;
        var callback = options.callback ? options.callback : false;
        if (typeof target === "string") {
          if (target === "top") {
            target = this.html;
          } else if (target === "bottom") {
            target = this.html.offsetHeight - window.innerHeight;
          } else {
            target = document.querySelector(target);
            if (!target) {
              return;
            }
          }
        } else if (typeof target === "number") {
          target = parseInt(target);
        } else if (target && target.tagName)
          ;
        else {
          console.warn("`target` parameter is not valid");
          return;
        }
        if (typeof target !== "number") {
          offset = target.getBoundingClientRect().top + offset + this.instance.scroll.y;
        } else {
          offset = target + offset;
        }
        var isTargetReached = function isTargetReached2() {
          return parseInt(window.pageYOffset) === parseInt(offset);
        };
        if (callback) {
          if (isTargetReached()) {
            callback();
            return;
          } else {
            var onScroll = function onScroll2() {
              if (isTargetReached()) {
                window.removeEventListener("scroll", onScroll2);
                callback();
              }
            };
            window.addEventListener("scroll", onScroll);
          }
        }
        window.scrollTo({
          top: offset,
          behavior: options.duration === 0 ? "auto" : "smooth"
        });
      }
    }, {
      key: "update",
      value: function update() {
        this.addElements();
        this.detectElements();
      }
    }, {
      key: "destroy",
      value: function destroy() {
        _get(_getPrototypeOf(_default3.prototype), "destroy", this).call(this);
        window.removeEventListener("scroll", this.checkScroll, false);
      }
    }]);
    return _default3;
  }(_default2);
  var getOwnPropertySymbols = Object.getOwnPropertySymbols;
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  var propIsEnumerable = Object.prototype.propertyIsEnumerable;
  function toObject(val) {
    if (val === null || val === void 0) {
      throw new TypeError("Object.assign cannot be called with null or undefined");
    }
    return Object(val);
  }
  function shouldUseNative() {
    try {
      if (!Object.assign) {
        return false;
      }
      var test1 = new String("abc");
      test1[5] = "de";
      if (Object.getOwnPropertyNames(test1)[0] === "5") {
        return false;
      }
      var test2 = {};
      for (var i = 0; i < 10; i++) {
        test2["_" + String.fromCharCode(i)] = i;
      }
      var order2 = Object.getOwnPropertyNames(test2).map(function(n) {
        return test2[n];
      });
      if (order2.join("") !== "0123456789") {
        return false;
      }
      var test3 = {};
      "abcdefghijklmnopqrst".split("").forEach(function(letter) {
        test3[letter] = letter;
      });
      if (Object.keys(Object.assign({}, test3)).join("") !== "abcdefghijklmnopqrst") {
        return false;
      }
      return true;
    } catch (err) {
      return false;
    }
  }
  var objectAssign = shouldUseNative() ? Object.assign : function(target, source) {
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
  function E() {
  }
  E.prototype = {
    on: function(name, callback, ctx) {
      var e = this.e || (this.e = {});
      (e[name] || (e[name] = [])).push({
        fn: callback,
        ctx
      });
      return this;
    },
    once: function(name, callback, ctx) {
      var self2 = this;
      function listener() {
        self2.off(name, listener);
        callback.apply(ctx, arguments);
      }
      listener._ = callback;
      return this.on(name, listener, ctx);
    },
    emit: function(name) {
      var data = [].slice.call(arguments, 1);
      var evtArr = ((this.e || (this.e = {}))[name] || []).slice();
      var i = 0;
      var len = evtArr.length;
      for (i; i < len; i++) {
        evtArr[i].fn.apply(evtArr[i].ctx, data);
      }
      return this;
    },
    off: function(name, callback) {
      var e = this.e || (this.e = {});
      var evts = e[name];
      var liveEvents = [];
      if (evts && callback) {
        for (var i = 0, len = evts.length; i < len; i++) {
          if (evts[i].fn !== callback && evts[i].fn._ !== callback)
            liveEvents.push(evts[i]);
        }
      }
      liveEvents.length ? e[name] = liveEvents : delete e[name];
      return this;
    }
  };
  var tinyEmitter = E;
  var lethargy = createCommonjsModule(function(module, exports) {
    (function() {
      var root;
      root = exports !== null ? exports : this;
      root.Lethargy = function() {
        function Lethargy2(stability, sensitivity, tolerance, delay) {
          this.stability = stability != null ? Math.abs(stability) : 8;
          this.sensitivity = sensitivity != null ? 1 + Math.abs(sensitivity) : 100;
          this.tolerance = tolerance != null ? 1 + Math.abs(tolerance) : 1.1;
          this.delay = delay != null ? delay : 150;
          this.lastUpDeltas = function() {
            var i, ref, results;
            results = [];
            for (i = 1, ref = this.stability * 2; 1 <= ref ? i <= ref : i >= ref; 1 <= ref ? i++ : i--) {
              results.push(null);
            }
            return results;
          }.call(this);
          this.lastDownDeltas = function() {
            var i, ref, results;
            results = [];
            for (i = 1, ref = this.stability * 2; 1 <= ref ? i <= ref : i >= ref; 1 <= ref ? i++ : i--) {
              results.push(null);
            }
            return results;
          }.call(this);
          this.deltasTimestamp = function() {
            var i, ref, results;
            results = [];
            for (i = 1, ref = this.stability * 2; 1 <= ref ? i <= ref : i >= ref; 1 <= ref ? i++ : i--) {
              results.push(null);
            }
            return results;
          }.call(this);
        }
        Lethargy2.prototype.check = function(e) {
          var lastDelta;
          e = e.originalEvent || e;
          if (e.wheelDelta != null) {
            lastDelta = e.wheelDelta;
          } else if (e.deltaY != null) {
            lastDelta = e.deltaY * -40;
          } else if (e.detail != null || e.detail === 0) {
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
        };
        Lethargy2.prototype.isInertia = function(direction) {
          var lastDeltas, lastDeltasNew, lastDeltasOld, newAverage, newSum, oldAverage, oldSum;
          lastDeltas = direction === -1 ? this.lastDownDeltas : this.lastUpDeltas;
          if (lastDeltas[0] === null) {
            return direction;
          }
          if (this.deltasTimestamp[this.stability * 2 - 2] + this.delay > Date.now() && lastDeltas[0] === lastDeltas[this.stability * 2 - 1]) {
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
          if (Math.abs(oldAverage) < Math.abs(newAverage * this.tolerance) && this.sensitivity < Math.abs(newAverage)) {
            return direction;
          } else {
            return false;
          }
        };
        Lethargy2.prototype.showLastUpDeltas = function() {
          return this.lastUpDeltas;
        };
        Lethargy2.prototype.showLastDownDeltas = function() {
          return this.lastDownDeltas;
        };
        return Lethargy2;
      }();
    }).call(commonjsGlobal);
  });
  var support = function getSupport() {
    return {
      hasWheelEvent: "onwheel" in document,
      hasMouseWheelEvent: "onmousewheel" in document,
      hasTouch: "ontouchstart" in window || window.TouchEvent || window.DocumentTouch && document instanceof DocumentTouch,
      hasTouchWin: navigator.msMaxTouchPoints && navigator.msMaxTouchPoints > 1,
      hasPointer: !!window.navigator.msPointerEnabled,
      hasKeyDown: "onkeydown" in document,
      isFirefox: navigator.userAgent.indexOf("Firefox") > -1
    };
  }();
  var toString = Object.prototype.toString;
  var hasOwnProperty$1 = Object.prototype.hasOwnProperty;
  var bindallStandalone = function(object) {
    if (!object)
      return console.warn("bindAll requires at least one argument.");
    var functions = Array.prototype.slice.call(arguments, 1);
    if (functions.length === 0) {
      for (var method in object) {
        if (hasOwnProperty$1.call(object, method)) {
          if (typeof object[method] == "function" && toString.call(object[method]) == "[object Function]") {
            functions.push(method);
          }
        }
      }
    }
    for (var i = 0; i < functions.length; i++) {
      var f = functions[i];
      object[f] = bind(object[f], object);
    }
  };
  function bind(func, context) {
    return function() {
      return func.apply(context, arguments);
    };
  }
  var Lethargy = lethargy.Lethargy;
  var EVT_ID = "virtualscroll";
  var src = VirtualScroll;
  var keyCodes = {
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    SPACE: 32
  };
  function VirtualScroll(options) {
    bindallStandalone(this, "_onWheel", "_onMouseWheel", "_onTouchStart", "_onTouchMove", "_onKeyDown");
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
      unpreventTouchClass: "vs-touchmove-allowed",
      limitInertia: false,
      useKeyboard: true,
      useTouch: true
    }, options);
    if (this.options.limitInertia)
      this._lethargy = new Lethargy();
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
    if (this.options.passive !== void 0) {
      this.listenerOptions = { passive: this.options.passive };
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
    if (this._lethargy && this._lethargy.check(e) === false)
      return;
    var evt = this._event;
    evt.deltaX = e.wheelDeltaX || e.deltaX * -1;
    evt.deltaY = e.wheelDeltaY || e.deltaY * -1;
    if (support.isFirefox && e.deltaMode == 1) {
      evt.deltaX *= options.firefoxMultiplier;
      evt.deltaY *= options.firefoxMultiplier;
    }
    evt.deltaX *= options.mouseMultiplier;
    evt.deltaY *= options.mouseMultiplier;
    this._notify(e);
  };
  VirtualScroll.prototype._onMouseWheel = function(e) {
    if (this.options.limitInertia && this._lethargy.check(e) === false)
      return;
    var evt = this._event;
    evt.deltaX = e.wheelDeltaX ? e.wheelDeltaX : 0;
    evt.deltaY = e.wheelDeltaY ? e.wheelDeltaY : e.wheelDelta;
    this._notify(e);
  };
  VirtualScroll.prototype._onTouchStart = function(e) {
    var t = e.targetTouches ? e.targetTouches[0] : e;
    this.touchStartX = t.pageX;
    this.touchStartY = t.pageY;
  };
  VirtualScroll.prototype._onTouchMove = function(e) {
    var options = this.options;
    if (options.preventTouch && !e.target.classList.contains(options.unpreventTouchClass)) {
      e.preventDefault();
    }
    var evt = this._event;
    var t = e.targetTouches ? e.targetTouches[0] : e;
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
    switch (e.keyCode) {
      case keyCodes.LEFT:
      case keyCodes.UP:
        evt.deltaY = this.options.keyStep;
        break;
      case keyCodes.RIGHT:
      case keyCodes.DOWN:
        evt.deltaY = -this.options.keyStep;
        break;
      case e.shiftKey:
        evt.deltaY = windowHeight;
        break;
      case keyCodes.SPACE:
        evt.deltaY = -windowHeight;
        break;
      default:
        return;
    }
    this._notify(e);
  };
  VirtualScroll.prototype._bind = function() {
    if (support.hasWheelEvent)
      this.el.addEventListener("wheel", this._onWheel, this.listenerOptions);
    if (support.hasMouseWheelEvent)
      this.el.addEventListener("mousewheel", this._onMouseWheel, this.listenerOptions);
    if (support.hasTouch && this.options.useTouch) {
      this.el.addEventListener("touchstart", this._onTouchStart, this.listenerOptions);
      this.el.addEventListener("touchmove", this._onTouchMove, this.listenerOptions);
    }
    if (support.hasPointer && support.hasTouchWin) {
      this.bodyTouchAction = document.body.style.msTouchAction;
      document.body.style.msTouchAction = "none";
      this.el.addEventListener("MSPointerDown", this._onTouchStart, true);
      this.el.addEventListener("MSPointerMove", this._onTouchMove, true);
    }
    if (support.hasKeyDown && this.options.useKeyboard)
      document.addEventListener("keydown", this._onKeyDown);
  };
  VirtualScroll.prototype._unbind = function() {
    if (support.hasWheelEvent)
      this.el.removeEventListener("wheel", this._onWheel);
    if (support.hasMouseWheelEvent)
      this.el.removeEventListener("mousewheel", this._onMouseWheel);
    if (support.hasTouch) {
      this.el.removeEventListener("touchstart", this._onTouchStart);
      this.el.removeEventListener("touchmove", this._onTouchMove);
    }
    if (support.hasPointer && support.hasTouchWin) {
      document.body.style.msTouchAction = this.bodyTouchAction;
      this.el.removeEventListener("MSPointerDown", this._onTouchStart, true);
      this.el.removeEventListener("MSPointerMove", this._onTouchMove, true);
    }
    if (support.hasKeyDown && this.options.useKeyboard)
      document.removeEventListener("keydown", this._onKeyDown);
  };
  VirtualScroll.prototype.on = function(cb, ctx) {
    this._emitter.on(EVT_ID, cb, ctx);
    var events = this._emitter.e;
    if (events && events[EVT_ID] && events[EVT_ID].length === 1)
      this._bind();
  };
  VirtualScroll.prototype.off = function(cb, ctx) {
    this._emitter.off(EVT_ID, cb, ctx);
    var events = this._emitter.e;
    if (!events[EVT_ID] || events[EVT_ID].length <= 0)
      this._unbind();
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
    if (!window.getComputedStyle)
      return;
    var style = getComputedStyle(el);
    var transform = style.transform || style.webkitTransform || style.mozTransform;
    var mat = transform.match(/^matrix3d\((.+)\)$/);
    if (mat) {
      translate.x = mat ? parseFloat(mat[1].split(", ")[12]) : 0;
      translate.y = mat ? parseFloat(mat[1].split(", ")[13]) : 0;
    } else {
      mat = transform.match(/^matrix\((.+)\)$/);
      translate.x = mat ? parseFloat(mat[1].split(", ")[4]) : 0;
      translate.y = mat ? parseFloat(mat[1].split(", ")[5]) : 0;
    }
    return translate;
  }
  function getParents(elem) {
    var parents = [];
    for (; elem && elem !== document; elem = elem.parentNode) {
      parents.push(elem);
    }
    return parents;
  }
  var NEWTON_ITERATIONS = 4;
  var NEWTON_MIN_SLOPE = 1e-3;
  var SUBDIVISION_PRECISION = 1e-7;
  var SUBDIVISION_MAX_ITERATIONS = 10;
  var kSplineTableSize = 11;
  var kSampleStepSize = 1 / (kSplineTableSize - 1);
  var float32ArraySupported = typeof Float32Array === "function";
  function A(aA1, aA2) {
    return 1 - 3 * aA2 + 3 * aA1;
  }
  function B(aA1, aA2) {
    return 3 * aA2 - 6 * aA1;
  }
  function C(aA1) {
    return 3 * aA1;
  }
  function calcBezier(aT, aA1, aA2) {
    return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT;
  }
  function getSlope(aT, aA1, aA2) {
    return 3 * A(aA1, aA2) * aT * aT + 2 * B(aA1, aA2) * aT + C(aA1);
  }
  function binarySubdivide(aX, aA, aB, mX1, mX2) {
    var currentX, currentT, i = 0;
    do {
      currentT = aA + (aB - aA) / 2;
      currentX = calcBezier(currentT, mX1, mX2) - aX;
      if (currentX > 0) {
        aB = currentT;
      } else {
        aA = currentT;
      }
    } while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);
    return currentT;
  }
  function newtonRaphsonIterate(aX, aGuessT, mX1, mX2) {
    for (var i = 0; i < NEWTON_ITERATIONS; ++i) {
      var currentSlope = getSlope(aGuessT, mX1, mX2);
      if (currentSlope === 0) {
        return aGuessT;
      }
      var currentX = calcBezier(aGuessT, mX1, mX2) - aX;
      aGuessT -= currentX / currentSlope;
    }
    return aGuessT;
  }
  function LinearEasing(x) {
    return x;
  }
  var src$1 = function bezier(mX1, mY1, mX2, mY2) {
    if (!(0 <= mX1 && mX1 <= 1 && 0 <= mX2 && mX2 <= 1)) {
      throw new Error("bezier x values must be in [0, 1] range");
    }
    if (mX1 === mY1 && mX2 === mY2) {
      return LinearEasing;
    }
    var sampleValues = float32ArraySupported ? new Float32Array(kSplineTableSize) : new Array(kSplineTableSize);
    for (var i = 0; i < kSplineTableSize; ++i) {
      sampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
    }
    function getTForX(aX) {
      var intervalStart = 0;
      var currentSample = 1;
      var lastSample = kSplineTableSize - 1;
      for (; currentSample !== lastSample && sampleValues[currentSample] <= aX; ++currentSample) {
        intervalStart += kSampleStepSize;
      }
      --currentSample;
      var dist = (aX - sampleValues[currentSample]) / (sampleValues[currentSample + 1] - sampleValues[currentSample]);
      var guessForT = intervalStart + dist * kSampleStepSize;
      var initialSlope = getSlope(guessForT, mX1, mX2);
      if (initialSlope >= NEWTON_MIN_SLOPE) {
        return newtonRaphsonIterate(aX, guessForT, mX1, mX2);
      } else if (initialSlope === 0) {
        return guessForT;
      } else {
        return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize, mX1, mX2);
      }
    }
    return function BezierEasing(x) {
      if (x === 0) {
        return 0;
      }
      if (x === 1) {
        return 1;
      }
      return calcBezier(getTForX(x), mY1, mY2);
    };
  };
  var keyCodes$1 = {
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    SPACE: 32,
    TAB: 9,
    PAGEUP: 33,
    PAGEDOWN: 34,
    HOME: 36,
    END: 35
  };
  var _default$2 = /* @__PURE__ */ function(_Core) {
    _inherits(_default3, _Core);
    var _super = _createSuper(_default3);
    function _default3() {
      var _this;
      var options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
      _classCallCheck2(this, _default3);
      if (history.scrollRestoration) {
        history.scrollRestoration = "manual";
      }
      window.scrollTo(0, 0);
      _this = _super.call(this, options);
      if (_this.inertia)
        _this.lerp = _this.inertia * 0.1;
      _this.isScrolling = false;
      _this.isDraggingScrollbar = false;
      _this.isTicking = false;
      _this.hasScrollTicking = false;
      _this.parallaxElements = {};
      _this.stop = false;
      _this.scrollbarContainer = options.scrollbarContainer;
      _this.checkKey = _this.checkKey.bind(_assertThisInitialized(_this));
      window.addEventListener("keydown", _this.checkKey, false);
      return _this;
    }
    _createClass2(_default3, [{
      key: "init",
      value: function init2() {
        var _this2 = this;
        this.html.classList.add(this.smoothClass);
        this.html.setAttribute("data-".concat(this.name, "-direction"), this.direction);
        this.instance = _objectSpread2({
          delta: {
            x: this.initPosition.x,
            y: this.initPosition.y
          },
          scroll: {
            x: this.initPosition.x,
            y: this.initPosition.y
          }
        }, this.instance);
        this.vs = new src({
          el: this.scrollFromAnywhere ? document : this.el,
          mouseMultiplier: navigator.platform.indexOf("Win") > -1 ? 1 : 0.4,
          firefoxMultiplier: this.firefoxMultiplier,
          touchMultiplier: this.touchMultiplier,
          useKeyboard: false,
          passive: true
        });
        this.vs.on(function(e) {
          if (_this2.stop) {
            return;
          }
          if (!_this2.isDraggingScrollbar) {
            requestAnimationFrame(function() {
              _this2.updateDelta(e);
              if (!_this2.isScrolling)
                _this2.startScrolling();
            });
          }
        });
        this.setScrollLimit();
        this.initScrollBar();
        this.addSections();
        this.addElements();
        this.checkScroll(true);
        this.transformElements(true, true);
        _get(_getPrototypeOf(_default3.prototype), "init", this).call(this);
      }
    }, {
      key: "setScrollLimit",
      value: function setScrollLimit() {
        this.instance.limit.y = this.el.offsetHeight - this.windowHeight;
        if (this.direction === "horizontal") {
          var totalWidth = 0;
          var nodes = this.el.children;
          for (var i = 0; i < nodes.length; i++) {
            totalWidth += nodes[i].offsetWidth;
          }
          this.instance.limit.x = totalWidth - this.windowWidth;
        }
      }
    }, {
      key: "startScrolling",
      value: function startScrolling() {
        this.startScrollTs = Date.now();
        this.isScrolling = true;
        this.checkScroll();
        this.html.classList.add(this.scrollingClass);
      }
    }, {
      key: "stopScrolling",
      value: function stopScrolling() {
        cancelAnimationFrame(this.checkScrollRaf);
        this.startScrollTs = void 0;
        if (this.scrollToRaf) {
          cancelAnimationFrame(this.scrollToRaf);
          this.scrollToRaf = null;
        }
        this.isScrolling = false;
        this.instance.scroll.y = Math.round(this.instance.scroll.y);
        this.html.classList.remove(this.scrollingClass);
      }
    }, {
      key: "checkKey",
      value: function checkKey(e) {
        var _this3 = this;
        if (this.stop) {
          if (e.keyCode == keyCodes$1.TAB) {
            requestAnimationFrame(function() {
              _this3.html.scrollTop = 0;
              document.body.scrollTop = 0;
              _this3.html.scrollLeft = 0;
              document.body.scrollLeft = 0;
            });
          }
          return;
        }
        switch (e.keyCode) {
          case keyCodes$1.TAB:
            requestAnimationFrame(function() {
              _this3.html.scrollTop = 0;
              document.body.scrollTop = 0;
              _this3.html.scrollLeft = 0;
              document.body.scrollLeft = 0;
              _this3.scrollTo(document.activeElement, {
                offset: -window.innerHeight / 2
              });
            });
            break;
          case keyCodes$1.UP:
            if (this.isActiveElementScrollSensitive()) {
              this.instance.delta[this.directionAxis] -= 240;
            }
            break;
          case keyCodes$1.DOWN:
            if (this.isActiveElementScrollSensitive()) {
              this.instance.delta[this.directionAxis] += 240;
            }
            break;
          case keyCodes$1.PAGEUP:
            this.instance.delta[this.directionAxis] -= window.innerHeight;
            break;
          case keyCodes$1.PAGEDOWN:
            this.instance.delta[this.directionAxis] += window.innerHeight;
            break;
          case keyCodes$1.HOME:
            this.instance.delta[this.directionAxis] -= this.instance.limit[this.directionAxis];
            break;
          case keyCodes$1.END:
            this.instance.delta[this.directionAxis] += this.instance.limit[this.directionAxis];
            break;
          case keyCodes$1.SPACE:
            if (this.isActiveElementScrollSensitive()) {
              if (e.shiftKey) {
                this.instance.delta[this.directionAxis] -= window.innerHeight;
              } else {
                this.instance.delta[this.directionAxis] += window.innerHeight;
              }
            }
            break;
          default:
            return;
        }
        if (this.instance.delta[this.directionAxis] < 0)
          this.instance.delta[this.directionAxis] = 0;
        if (this.instance.delta[this.directionAxis] > this.instance.limit[this.directionAxis])
          this.instance.delta[this.directionAxis] = this.instance.limit[this.directionAxis];
        this.stopScrolling();
        this.isScrolling = true;
        this.checkScroll();
        this.html.classList.add(this.scrollingClass);
      }
    }, {
      key: "isActiveElementScrollSensitive",
      value: function isActiveElementScrollSensitive() {
        return !(document.activeElement instanceof HTMLInputElement) && !(document.activeElement instanceof HTMLTextAreaElement) && !(document.activeElement instanceof HTMLButtonElement) && !(document.activeElement instanceof HTMLSelectElement);
      }
    }, {
      key: "checkScroll",
      value: function checkScroll() {
        var _this4 = this;
        var forced = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : false;
        if (forced || this.isScrolling || this.isDraggingScrollbar) {
          if (!this.hasScrollTicking) {
            this.checkScrollRaf = requestAnimationFrame(function() {
              return _this4.checkScroll();
            });
            this.hasScrollTicking = true;
          }
          this.updateScroll();
          var distance = Math.abs(this.instance.delta[this.directionAxis] - this.instance.scroll[this.directionAxis]);
          var timeSinceStart = Date.now() - this.startScrollTs;
          if (!this.animatingScroll && timeSinceStart > 100 && (distance < 0.5 && this.instance.delta[this.directionAxis] != 0 || distance < 0.5 && this.instance.delta[this.directionAxis] == 0)) {
            this.stopScrolling();
          }
          Object.entries(this.sections).forEach(function(_ref) {
            var _ref2 = _slicedToArray2(_ref, 2), i = _ref2[0], section = _ref2[1];
            if (section.persistent || _this4.instance.scroll[_this4.directionAxis] > section.offset[_this4.directionAxis] && _this4.instance.scroll[_this4.directionAxis] < section.limit[_this4.directionAxis]) {
              if (_this4.direction === "horizontal") {
                _this4.transform(section.el, -_this4.instance.scroll[_this4.directionAxis], 0);
              } else {
                _this4.transform(section.el, 0, -_this4.instance.scroll[_this4.directionAxis]);
              }
              if (!section.inView) {
                section.inView = true;
                section.el.style.opacity = 1;
                section.el.style.pointerEvents = "all";
                section.el.setAttribute("data-".concat(_this4.name, "-section-inview"), "");
              }
            } else {
              if (section.inView || forced) {
                section.inView = false;
                section.el.style.opacity = 0;
                section.el.style.pointerEvents = "none";
                section.el.removeAttribute("data-".concat(_this4.name, "-section-inview"));
              }
              _this4.transform(section.el, 0, 0);
            }
          });
          if (this.getDirection) {
            this.addDirection();
          }
          if (this.getSpeed) {
            this.addSpeed();
            this.speedTs = Date.now();
          }
          this.detectElements();
          this.transformElements();
          if (this.hasScrollbar) {
            var scrollBarTranslation = this.instance.scroll[this.directionAxis] / this.instance.limit[this.directionAxis] * this.scrollBarLimit[this.directionAxis];
            if (this.direction === "horizontal") {
              this.transform(this.scrollbarThumb, scrollBarTranslation, 0);
            } else {
              this.transform(this.scrollbarThumb, 0, scrollBarTranslation);
            }
          }
          _get(_getPrototypeOf(_default3.prototype), "checkScroll", this).call(this);
          this.hasScrollTicking = false;
        }
      }
    }, {
      key: "resize",
      value: function resize() {
        this.windowHeight = window.innerHeight;
        this.windowWidth = window.innerWidth;
        this.checkContext();
        this.windowMiddle = {
          x: this.windowWidth / 2,
          y: this.windowHeight / 2
        };
        this.update();
      }
    }, {
      key: "updateDelta",
      value: function updateDelta(e) {
        var delta;
        var gestureDirection = this[this.context] && this[this.context].gestureDirection ? this[this.context].gestureDirection : this.gestureDirection;
        if (gestureDirection === "both") {
          delta = e.deltaX + e.deltaY;
        } else if (gestureDirection === "vertical") {
          delta = e.deltaY;
        } else if (gestureDirection === "horizontal") {
          delta = e.deltaX;
        } else {
          delta = e.deltaY;
        }
        this.instance.delta[this.directionAxis] -= delta * this.multiplier;
        if (this.instance.delta[this.directionAxis] < 0)
          this.instance.delta[this.directionAxis] = 0;
        if (this.instance.delta[this.directionAxis] > this.instance.limit[this.directionAxis])
          this.instance.delta[this.directionAxis] = this.instance.limit[this.directionAxis];
      }
    }, {
      key: "updateScroll",
      value: function updateScroll(e) {
        if (this.isScrolling || this.isDraggingScrollbar) {
          this.instance.scroll[this.directionAxis] = lerp(this.instance.scroll[this.directionAxis], this.instance.delta[this.directionAxis], this.lerp);
        } else {
          if (this.instance.scroll[this.directionAxis] > this.instance.limit[this.directionAxis]) {
            this.setScroll(this.instance.scroll[this.directionAxis], this.instance.limit[this.directionAxis]);
          } else if (this.instance.scroll.y < 0) {
            this.setScroll(this.instance.scroll[this.directionAxis], 0);
          } else {
            this.setScroll(this.instance.scroll[this.directionAxis], this.instance.delta[this.directionAxis]);
          }
        }
      }
    }, {
      key: "addDirection",
      value: function addDirection() {
        if (this.instance.delta.y > this.instance.scroll.y) {
          if (this.instance.direction !== "down") {
            this.instance.direction = "down";
          }
        } else if (this.instance.delta.y < this.instance.scroll.y) {
          if (this.instance.direction !== "up") {
            this.instance.direction = "up";
          }
        }
        if (this.instance.delta.x > this.instance.scroll.x) {
          if (this.instance.direction !== "right") {
            this.instance.direction = "right";
          }
        } else if (this.instance.delta.x < this.instance.scroll.x) {
          if (this.instance.direction !== "left") {
            this.instance.direction = "left";
          }
        }
      }
    }, {
      key: "addSpeed",
      value: function addSpeed() {
        if (this.instance.delta[this.directionAxis] != this.instance.scroll[this.directionAxis]) {
          this.instance.speed = (this.instance.delta[this.directionAxis] - this.instance.scroll[this.directionAxis]) / Math.max(1, Date.now() - this.speedTs);
        } else {
          this.instance.speed = 0;
        }
      }
    }, {
      key: "initScrollBar",
      value: function initScrollBar() {
        this.scrollbar = document.createElement("span");
        this.scrollbarThumb = document.createElement("span");
        this.scrollbar.classList.add("".concat(this.scrollbarClass));
        this.scrollbarThumb.classList.add("".concat(this.scrollbarClass, "_thumb"));
        this.scrollbar.append(this.scrollbarThumb);
        if (this.scrollbarContainer) {
          this.scrollbarContainer.append(this.scrollbar);
        } else {
          document.body.append(this.scrollbar);
        }
        this.getScrollBar = this.getScrollBar.bind(this);
        this.releaseScrollBar = this.releaseScrollBar.bind(this);
        this.moveScrollBar = this.moveScrollBar.bind(this);
        this.scrollbarThumb.addEventListener("mousedown", this.getScrollBar);
        window.addEventListener("mouseup", this.releaseScrollBar);
        window.addEventListener("mousemove", this.moveScrollBar);
        this.hasScrollbar = false;
        if (this.direction == "horizontal") {
          if (this.instance.limit.x + this.windowWidth <= this.windowWidth) {
            return;
          }
        } else {
          if (this.instance.limit.y + this.windowHeight <= this.windowHeight) {
            return;
          }
        }
        this.hasScrollbar = true;
        this.scrollbarBCR = this.scrollbar.getBoundingClientRect();
        this.scrollbarHeight = this.scrollbarBCR.height;
        this.scrollbarWidth = this.scrollbarBCR.width;
        if (this.direction === "horizontal") {
          this.scrollbarThumb.style.width = "".concat(this.scrollbarWidth * this.scrollbarWidth / (this.instance.limit.x + this.scrollbarWidth), "px");
        } else {
          this.scrollbarThumb.style.height = "".concat(this.scrollbarHeight * this.scrollbarHeight / (this.instance.limit.y + this.scrollbarHeight), "px");
        }
        this.scrollbarThumbBCR = this.scrollbarThumb.getBoundingClientRect();
        this.scrollBarLimit = {
          x: this.scrollbarWidth - this.scrollbarThumbBCR.width,
          y: this.scrollbarHeight - this.scrollbarThumbBCR.height
        };
      }
    }, {
      key: "reinitScrollBar",
      value: function reinitScrollBar() {
        this.hasScrollbar = false;
        if (this.direction == "horizontal") {
          if (this.instance.limit.x + this.windowWidth <= this.windowWidth) {
            return;
          }
        } else {
          if (this.instance.limit.y + this.windowHeight <= this.windowHeight) {
            return;
          }
        }
        this.hasScrollbar = true;
        this.scrollbarBCR = this.scrollbar.getBoundingClientRect();
        this.scrollbarHeight = this.scrollbarBCR.height;
        this.scrollbarWidth = this.scrollbarBCR.width;
        if (this.direction === "horizontal") {
          this.scrollbarThumb.style.width = "".concat(this.scrollbarWidth * this.scrollbarWidth / (this.instance.limit.x + this.scrollbarWidth), "px");
        } else {
          this.scrollbarThumb.style.height = "".concat(this.scrollbarHeight * this.scrollbarHeight / (this.instance.limit.y + this.scrollbarHeight), "px");
        }
        this.scrollbarThumbBCR = this.scrollbarThumb.getBoundingClientRect();
        this.scrollBarLimit = {
          x: this.scrollbarWidth - this.scrollbarThumbBCR.width,
          y: this.scrollbarHeight - this.scrollbarThumbBCR.height
        };
      }
    }, {
      key: "destroyScrollBar",
      value: function destroyScrollBar() {
        this.scrollbarThumb.removeEventListener("mousedown", this.getScrollBar);
        window.removeEventListener("mouseup", this.releaseScrollBar);
        window.removeEventListener("mousemove", this.moveScrollBar);
        this.scrollbar.remove();
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
        if (this.isScrolling) {
          this.html.classList.add(this.scrollingClass);
        }
        this.html.classList.remove(this.draggingClass);
      }
    }, {
      key: "moveScrollBar",
      value: function moveScrollBar(e) {
        var _this5 = this;
        if (this.isDraggingScrollbar) {
          requestAnimationFrame(function() {
            var x = (e.clientX - _this5.scrollbarBCR.left) * 100 / _this5.scrollbarWidth * _this5.instance.limit.x / 100;
            var y = (e.clientY - _this5.scrollbarBCR.top) * 100 / _this5.scrollbarHeight * _this5.instance.limit.y / 100;
            if (y > 0 && y < _this5.instance.limit.y) {
              _this5.instance.delta.y = y;
            }
            if (x > 0 && x < _this5.instance.limit.x) {
              _this5.instance.delta.x = x;
            }
          });
        }
      }
    }, {
      key: "addElements",
      value: function addElements() {
        var _this6 = this;
        this.els = {};
        this.parallaxElements = {};
        var els = this.el.querySelectorAll("[data-".concat(this.name, "]"));
        els.forEach(function(el, index) {
          var targetParents = getParents(el);
          var section = Object.entries(_this6.sections).map(function(_ref3) {
            var _ref4 = _slicedToArray2(_ref3, 2), key = _ref4[0], section2 = _ref4[1];
            return section2;
          }).find(function(section2) {
            return targetParents.includes(section2.el);
          });
          var cl = el.dataset[_this6.name + "Class"] || _this6["class"];
          var id = typeof el.dataset[_this6.name + "Id"] === "string" ? el.dataset[_this6.name + "Id"] : "el" + index;
          var top;
          var left;
          var repeat = el.dataset[_this6.name + "Repeat"];
          var call = el.dataset[_this6.name + "Call"];
          var position = el.dataset[_this6.name + "Position"];
          var delay = el.dataset[_this6.name + "Delay"];
          var direction = el.dataset[_this6.name + "Direction"];
          var sticky = typeof el.dataset[_this6.name + "Sticky"] === "string";
          var speed = el.dataset[_this6.name + "Speed"] ? parseFloat(el.dataset[_this6.name + "Speed"]) / 10 : false;
          var offset = typeof el.dataset[_this6.name + "Offset"] === "string" ? el.dataset[_this6.name + "Offset"].split(",") : _this6.offset;
          var target = el.dataset[_this6.name + "Target"];
          var targetEl;
          if (target !== void 0) {
            targetEl = document.querySelector("".concat(target));
          } else {
            targetEl = el;
          }
          var targetElBCR = targetEl.getBoundingClientRect();
          if (section === null) {
            top = targetElBCR.top + _this6.instance.scroll.y - getTranslate(targetEl).y;
            left = targetElBCR.left + _this6.instance.scroll.x - getTranslate(targetEl).x;
          } else {
            if (!section.inView) {
              top = targetElBCR.top - getTranslate(section.el).y - getTranslate(targetEl).y;
              left = targetElBCR.left - getTranslate(section.el).x - getTranslate(targetEl).x;
            } else {
              top = targetElBCR.top + _this6.instance.scroll.y - getTranslate(targetEl).y;
              left = targetElBCR.left + _this6.instance.scroll.x - getTranslate(targetEl).x;
            }
          }
          var bottom = top + targetEl.offsetHeight;
          var right = left + targetEl.offsetWidth;
          var middle = {
            x: (right - left) / 2 + left,
            y: (bottom - top) / 2 + top
          };
          if (sticky) {
            var elBCR = el.getBoundingClientRect();
            var elTop = elBCR.top;
            var elLeft = elBCR.left;
            var elDistance = {
              x: elLeft - left,
              y: elTop - top
            };
            top += window.innerHeight;
            left += window.innerWidth;
            bottom = elTop + targetEl.offsetHeight - el.offsetHeight - elDistance[_this6.directionAxis];
            right = elLeft + targetEl.offsetWidth - el.offsetWidth - elDistance[_this6.directionAxis];
            middle = {
              x: (right - left) / 2 + left,
              y: (bottom - top) / 2 + top
            };
          }
          if (repeat == "false") {
            repeat = false;
          } else if (repeat != void 0) {
            repeat = true;
          } else {
            repeat = _this6.repeat;
          }
          var relativeOffset = [0, 0];
          if (offset) {
            if (_this6.direction === "horizontal") {
              for (var i = 0; i < offset.length; i++) {
                if (typeof offset[i] == "string") {
                  if (offset[i].includes("%")) {
                    relativeOffset[i] = parseInt(offset[i].replace("%", "") * _this6.windowWidth / 100);
                  } else {
                    relativeOffset[i] = parseInt(offset[i]);
                  }
                } else {
                  relativeOffset[i] = offset[i];
                }
              }
              left = left + relativeOffset[0];
              right = right - relativeOffset[1];
            } else {
              for (var i = 0; i < offset.length; i++) {
                if (typeof offset[i] == "string") {
                  if (offset[i].includes("%")) {
                    relativeOffset[i] = parseInt(offset[i].replace("%", "") * _this6.windowHeight / 100);
                  } else {
                    relativeOffset[i] = parseInt(offset[i]);
                  }
                } else {
                  relativeOffset[i] = offset[i];
                }
              }
              top = top + relativeOffset[0];
              bottom = bottom - relativeOffset[1];
            }
          }
          var mappedEl = {
            el,
            id,
            "class": cl,
            section,
            top,
            middle,
            bottom,
            left,
            right,
            offset,
            progress: 0,
            repeat,
            inView: false,
            call,
            speed,
            delay,
            position,
            target: targetEl,
            direction,
            sticky
          };
          _this6.els[id] = mappedEl;
          if (el.classList.contains(cl)) {
            _this6.setInView(_this6.els[id], id);
          }
          if (speed !== false || sticky) {
            _this6.parallaxElements[id] = mappedEl;
          }
        });
      }
    }, {
      key: "addSections",
      value: function addSections() {
        var _this7 = this;
        this.sections = {};
        var sections = this.el.querySelectorAll("[data-".concat(this.name, "-section]"));
        if (sections.length === 0) {
          sections = [this.el];
        }
        sections.forEach(function(section, index) {
          var id = typeof section.dataset[_this7.name + "Id"] === "string" ? section.dataset[_this7.name + "Id"] : "section" + index;
          var sectionBCR = section.getBoundingClientRect();
          var offset = {
            x: sectionBCR.left - window.innerWidth * 1.5 - getTranslate(section).x,
            y: sectionBCR.top - window.innerHeight * 1.5 - getTranslate(section).y
          };
          var limit = {
            x: offset.x + sectionBCR.width + window.innerWidth * 2,
            y: offset.y + sectionBCR.height + window.innerHeight * 2
          };
          var persistent = typeof section.dataset[_this7.name + "Persistent"] === "string";
          section.setAttribute("data-scroll-section-id", id);
          var mappedSection = {
            el: section,
            offset,
            limit,
            inView: false,
            persistent,
            id
          };
          _this7.sections[id] = mappedSection;
        });
      }
    }, {
      key: "transform",
      value: function transform(element, x, y, delay) {
        var transform2;
        if (!delay) {
          transform2 = "matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,".concat(x, ",").concat(y, ",0,1)");
        } else {
          var start = getTranslate(element);
          var lerpX = lerp(start.x, x, delay);
          var lerpY = lerp(start.y, y, delay);
          transform2 = "matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,".concat(lerpX, ",").concat(lerpY, ",0,1)");
        }
        element.style.webkitTransform = transform2;
        element.style.msTransform = transform2;
        element.style.transform = transform2;
      }
    }, {
      key: "transformElements",
      value: function transformElements(isForced) {
        var _this8 = this;
        var setAllElements = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
        var scrollRight = this.instance.scroll.x + this.windowWidth;
        var scrollBottom = this.instance.scroll.y + this.windowHeight;
        var scrollMiddle = {
          x: this.instance.scroll.x + this.windowMiddle.x,
          y: this.instance.scroll.y + this.windowMiddle.y
        };
        Object.entries(this.parallaxElements).forEach(function(_ref5) {
          var _ref6 = _slicedToArray2(_ref5, 2), i = _ref6[0], current = _ref6[1];
          var transformDistance = false;
          if (isForced) {
            transformDistance = 0;
          }
          if (current.inView || setAllElements) {
            switch (current.position) {
              case "top":
                transformDistance = _this8.instance.scroll[_this8.directionAxis] * -current.speed;
                break;
              case "elementTop":
                transformDistance = (scrollBottom - current.top) * -current.speed;
                break;
              case "bottom":
                transformDistance = (_this8.instance.limit[_this8.directionAxis] - scrollBottom + _this8.windowHeight) * current.speed;
                break;
              case "left":
                transformDistance = _this8.instance.scroll[_this8.directionAxis] * -current.speed;
                break;
              case "elementLeft":
                transformDistance = (scrollRight - current.left) * -current.speed;
                break;
              case "right":
                transformDistance = (_this8.instance.limit[_this8.directionAxis] - scrollRight + _this8.windowHeight) * current.speed;
                break;
              default:
                transformDistance = (scrollMiddle[_this8.directionAxis] - current.middle[_this8.directionAxis]) * -current.speed;
                break;
            }
          }
          if (current.sticky) {
            if (current.inView) {
              if (_this8.direction === "horizontal") {
                transformDistance = _this8.instance.scroll.x - current.left + window.innerWidth;
              } else {
                transformDistance = _this8.instance.scroll.y - current.top + window.innerHeight;
              }
            } else {
              if (_this8.direction === "horizontal") {
                if (_this8.instance.scroll.x < current.left - window.innerWidth && _this8.instance.scroll.x < current.left - window.innerWidth / 2) {
                  transformDistance = 0;
                } else if (_this8.instance.scroll.x > current.right && _this8.instance.scroll.x > current.right + 100) {
                  transformDistance = current.right - current.left + window.innerWidth;
                } else {
                  transformDistance = false;
                }
              } else {
                if (_this8.instance.scroll.y < current.top - window.innerHeight && _this8.instance.scroll.y < current.top - window.innerHeight / 2) {
                  transformDistance = 0;
                } else if (_this8.instance.scroll.y > current.bottom && _this8.instance.scroll.y > current.bottom + 100) {
                  transformDistance = current.bottom - current.top + window.innerHeight;
                } else {
                  transformDistance = false;
                }
              }
            }
          }
          if (transformDistance !== false) {
            if (current.direction === "horizontal" || _this8.direction === "horizontal" && current.direction !== "vertical") {
              _this8.transform(current.el, transformDistance, 0, isForced ? false : current.delay);
            } else {
              _this8.transform(current.el, 0, transformDistance, isForced ? false : current.delay);
            }
          }
        });
      }
    }, {
      key: "scrollTo",
      value: function scrollTo(target) {
        var _this9 = this;
        var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        var offset = parseInt(options.offset) || 0;
        var duration = !isNaN(parseInt(options.duration)) ? parseInt(options.duration) : 1e3;
        var easing = options.easing || [0.25, 0, 0.35, 1];
        var disableLerp = options.disableLerp ? true : false;
        var callback = options.callback ? options.callback : false;
        easing = src$1.apply(void 0, _toConsumableArray2(easing));
        if (typeof target === "string") {
          if (target === "top") {
            target = 0;
          } else if (target === "bottom") {
            target = this.instance.limit.y;
          } else if (target === "left") {
            target = 0;
          } else if (target === "right") {
            target = this.instance.limit.x;
          } else {
            target = document.querySelector(target);
            if (!target) {
              return;
            }
          }
        } else if (typeof target === "number") {
          target = parseInt(target);
        } else if (target && target.tagName)
          ;
        else {
          console.warn("`target` parameter is not valid");
          return;
        }
        if (typeof target !== "number") {
          var targetInScope = getParents(target).includes(this.el);
          if (!targetInScope) {
            return;
          }
          var targetBCR = target.getBoundingClientRect();
          var offsetTop = targetBCR.top;
          var offsetLeft = targetBCR.left;
          var targetParents = getParents(target);
          var parentSection = targetParents.find(function(candidate) {
            return Object.entries(_this9.sections).map(function(_ref7) {
              var _ref8 = _slicedToArray2(_ref7, 2), key = _ref8[0], section = _ref8[1];
              return section;
            }).find(function(section) {
              return section.el == candidate;
            });
          });
          var parentSectionOffset = 0;
          if (parentSection) {
            parentSectionOffset = getTranslate(parentSection)[this.directionAxis];
          } else {
            parentSectionOffset = -this.instance.scroll[this.directionAxis];
          }
          if (this.direction === "horizontal") {
            offset = offsetLeft + offset - parentSectionOffset;
          } else {
            offset = offsetTop + offset - parentSectionOffset;
          }
        } else {
          offset = target + offset;
        }
        var scrollStart = parseFloat(this.instance.delta[this.directionAxis]);
        var scrollTarget = Math.max(0, Math.min(offset, this.instance.limit[this.directionAxis]));
        var scrollDiff = scrollTarget - scrollStart;
        var render = function render2(p) {
          if (disableLerp) {
            if (_this9.direction === "horizontal") {
              _this9.setScroll(scrollStart + scrollDiff * p, _this9.instance.delta.y);
            } else {
              _this9.setScroll(_this9.instance.delta.x, scrollStart + scrollDiff * p);
            }
          } else {
            _this9.instance.delta[_this9.directionAxis] = scrollStart + scrollDiff * p;
          }
        };
        this.animatingScroll = true;
        this.stopScrolling();
        this.startScrolling();
        var start = Date.now();
        var loop = function loop2() {
          var p = (Date.now() - start) / duration;
          if (p > 1) {
            render(1);
            _this9.animatingScroll = false;
            if (duration == 0)
              _this9.update();
            if (callback)
              callback();
          } else {
            _this9.scrollToRaf = requestAnimationFrame(loop2);
            render(easing(p));
          }
        };
        loop();
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
        this.reinitScrollBar();
        this.checkScroll(true);
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
        this.instance = _objectSpread2(_objectSpread2({}, this.instance), {}, {
          scroll: {
            x,
            y
          },
          delta: {
            x,
            y
          },
          speed: 0
        });
      }
    }, {
      key: "destroy",
      value: function destroy() {
        _get(_getPrototypeOf(_default3.prototype), "destroy", this).call(this);
        this.stopScrolling();
        this.html.classList.remove(this.smoothClass);
        this.vs.destroy();
        this.destroyScrollBar();
        window.removeEventListener("keydown", this.checkKey, false);
      }
    }]);
    return _default3;
  }(_default2);
  var Smooth = /* @__PURE__ */ function() {
    function Smooth2() {
      var options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
      _classCallCheck2(this, Smooth2);
      this.options = options;
      Object.assign(this, defaults, options);
      this.smartphone = defaults.smartphone;
      if (options.smartphone)
        Object.assign(this.smartphone, options.smartphone);
      this.tablet = defaults.tablet;
      if (options.tablet)
        Object.assign(this.tablet, options.tablet);
      if (!this.smooth && this.direction == "horizontal")
        console.warn("\u{1F6A8} `smooth:false` & `horizontal` direction are not yet compatible");
      if (!this.tablet.smooth && this.tablet.direction == "horizontal")
        console.warn("\u{1F6A8} `smooth:false` & `horizontal` direction are not yet compatible (tablet)");
      if (!this.smartphone.smooth && this.smartphone.direction == "horizontal")
        console.warn("\u{1F6A8} `smooth:false` & `horizontal` direction are not yet compatible (smartphone)");
      this.init();
    }
    _createClass2(Smooth2, [{
      key: "init",
      value: function init2() {
        this.options.isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1 || window.innerWidth < this.tablet.breakpoint;
        this.options.isTablet = this.options.isMobile && window.innerWidth >= this.tablet.breakpoint;
        if (this.smooth && !this.options.isMobile || this.tablet.smooth && this.options.isTablet || this.smartphone.smooth && this.options.isMobile && !this.options.isTablet) {
          this.scroll = new _default$2(this.options);
        } else {
          this.scroll = new _default$12(this.options);
        }
        this.scroll.init();
        if (window.location.hash) {
          var id = window.location.hash.slice(1, window.location.hash.length);
          var target = document.getElementById(id);
          if (target)
            this.scroll.scrollTo(target);
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
      value: function scrollTo(target, options) {
        this.scroll.scrollTo(target, options);
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
      key: "off",
      value: function off(event, func) {
        this.scroll.unsetEvents(event, func);
      }
    }, {
      key: "destroy",
      value: function destroy() {
        this.scroll.destroy();
      }
    }]);
    return Smooth2;
  }();
  var locomotive_scroll_esm_default = Smooth;

  // assets/scripts/modules/Scroll.js
  var Scroll_default = class extends _default {
    constructor(m) {
      super(m);
    }
    init() {
      this.scroll = new locomotive_scroll_esm_default({
        el: this.el,
        smooth: true
      });
      this.scroll.on("call", (func, way, obj, id) => {
        this.call(func[0], { way, obj }, func[1], func[2]);
      });
      this.scroll.on("scroll", (args) => {
      });
    }
    lazyLoad(args) {
      lazyLoadImage(args.obj.el, null, () => {
      });
    }
    destroy() {
      this.scroll.destroy();
    }
  };

  // assets/scripts/globals.js
  var import_svg4everybody = __toESM(require_svg4everybody(), 1);
  function globals_default() {
    (0, import_svg4everybody.default)();
  }

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
    $html.classList.add(config_default.CLASS_NAME.LOADED);
    $html.classList.add(config_default.CLASS_NAME.READY);
    $html.classList.remove(config_default.CLASS_NAME.LOADING);
  }
})();
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/
/*! svg4everybody v2.1.9 | github.com/jonathantneal/svg4everybody */
//# sourceMappingURL=app.js.map
