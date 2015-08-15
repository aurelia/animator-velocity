'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _velocity = require('velocity');

var _velocity2 = _interopRequireDefault(_velocity);

require('velocity/velocity.ui');

var _aureliaTemplating = require('aurelia-templating');

var VelocityAnimator = (function () {
  function VelocityAnimator(container) {
    _classCallCheck(this, VelocityAnimator);

    this.animationStack = [];
    this.isAnimating = false;
    this.options = {
      duration: 50,
      easing: 'linear'
    };
    this.easings = Object.assign(_velocity2['default'].Easings, this.easings);
    this.effects = Object.assign(_velocity2['default'].Redirects, this.effects);
  }

  _createClass(VelocityAnimator, [{
    key: '_triggerDOMEvent',
    value: function _triggerDOMEvent(eventType, element) {
      var evt = new window.CustomEvent(_aureliaTemplating.animationEvent[name], { bubbles: true, cancelable: true, detail: element });
      document.dispatchEvent(evt);
    }
  }, {
    key: 'animate',
    value: function animate(element, nameOrProps, options, silent) {
      this.isAnimating = true;
      var _this = this;
      var overrides = {
        complete: function complete(el) {
          _this.isAnimating = false;
          if (!silent) _this._triggerDOMEvent(el, "animateDone");
          if (options && options.complete) options.complete.apply(this, arguments);
        }
      };
      if (!element) return Promise.reject(new Error("invalid first argument"));

      if (typeof element === "string") element = this.container.querySelectorAll(element);

      if (!element || element.length === 0) return Promise.resolve(element);

      if (!silent) this._triggerDOMEvent(element, "animateBegin");

      var opts = Object.assign({}, this.options, options, overrides);
      var p = (0, _velocity2['default'])(element, nameOrProps, opts);

      if (!p) return Promise.reject(new Error("invalid element used for animator.animate"));
      return p;
    }
  }, {
    key: '_addMultipleEventListener',
    value: function _addMultipleEventListener(el, s, fn) {
      var evts = s.split(' '),
          i,
          ii;

      for (i = 0, ii = evts.length; i < ii; ++i) {
        el.addEventListener(evts[i], fn, false);
      }
    }
  }, {
    key: '_addAnimationToStack',
    value: function _addAnimationToStack(animId) {
      if (this.animationStack.indexOf(animId) < 0) {
        this.animationStack.push(animId);
      }
    }
  }, {
    key: '_removeAnimationFromStack',
    value: function _removeAnimationFromStack(animId) {
      var idx = this.animationStack.indexOf(animId);
      if (idx > -1) {
        this.animationStack.splice(idx, 1);
      }
    }
  }, {
    key: '_performSingleAnimate',
    value: function _performSingleAnimate(element, effectName) {
      var _arguments = arguments;
      var eventName = arguments.length <= 2 || arguments[2] === undefined ? undefined : arguments[2];

      var _this = this;
      var options = {};
      if (eventName) this._triggerDOMEvent(eventName + "Begin", element);

      var overrides = {
        complete: function complete(elements) {
          _this.isAnimating = false;
          if (eventName) _this._triggerDOMEvent(eventName + "Done", element);
          if (options && options.complete) options.complete.apply(_this, _arguments);
        }
      };
      var opts = Object.assign({}, _this.options, options, overrides);
      this.animate(element, effectName, opts, eventName);
    }
  }, {
    key: 'enter',
    value: function enter(element, effectName, options) {
      var _this = this;
      return new Promise(function (resolve, reject) {
        _this._performSingleAnimate(element, effectName || 'fadeIn', 'enter');
      });
    }
  }, {
    key: 'leave',
    value: function leave(element, effectName, options) {
      var _this = this;
      return new Promise(function (resolve, reject) {
        _this._performSingleAnimate(element, effectName || 'fadeOut', 'leave');
      });
    }
  }]);

  return VelocityAnimator;
})();

exports.VelocityAnimator = VelocityAnimator;
//# sourceMappingURL=animator.js.map