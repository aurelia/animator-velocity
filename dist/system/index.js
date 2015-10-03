System.register(['velocity', 'aurelia-templating', 'velocity/velocity.ui', './animator'], function (_export) {
  'use strict';

  var Velocity, Animator, VelocityAnimator;

  _export('configure', configure);

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function configure(aurelia, cb) {
    var animator = aurelia.container.get(VelocityAnimator);
    Animator.configureDefault(aurelia.container, animator);
    if (cb !== undefined && typeof cb === 'function') cb(animator);
  }

  return {
    setters: [function (_velocity) {
      Velocity = _velocity['default'];
    }, function (_aureliaTemplating) {
      Animator = _aureliaTemplating.Animator;
    }, function (_velocityVelocityUi) {}, function (_animator) {
      _export('VelocityAnimator', _animator.VelocityAnimator);
    }],
    execute: function () {
      VelocityAnimator = (function () {
        function VelocityAnimator(container) {
          _classCallCheck(this, VelocityAnimator);

          this.animationStack = [];
          this.isAnimating = false;
          this.options = {
            duration: 50,
            easing: 'linear'
          };
          this.easings = Object.assign(Velocity.Easings, this.easings);
          this.effects = Object.assign(Velocity.Redirects, this.effects);
        }

        VelocityAnimator.prototype._triggerDOMEvent = function _triggerDOMEvent(eventType, element) {
          var evt = new window.CustomEvent(eventType, { bubbles: true, cancelable: true, detail: element });
          document.dispatchEvent(evt);
        };

        VelocityAnimator.prototype.animate = function animate(element, nameOrProps, options, silent) {
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
          var p = Velocity(element, nameOrProps, opts);

          if (!p) return Promise.reject(new Error("invalid element used for animator.animate"));
          return p;
        };

        VelocityAnimator.prototype._addMultipleEventListener = function _addMultipleEventListener(el, s, fn) {
          var evts = s.split(' '),
              i,
              ii;

          for (i = 0, ii = evts.length; i < ii; ++i) {
            el.addEventListener(evts[i], fn, false);
          }
        };

        VelocityAnimator.prototype._addAnimationToStack = function _addAnimationToStack(animId) {
          if (this.animationStack.indexOf(animId) < 0) {
            this.animationStack.push(animId);
          }
        };

        VelocityAnimator.prototype._removeAnimationFromStack = function _removeAnimationFromStack(animId) {
          var idx = this.animationStack.indexOf(animId);
          if (idx > -1) {
            this.animationStack.splice(idx, 1);
          }
        };

        VelocityAnimator.prototype._performSingleAnimate = function _performSingleAnimate(element, effectName) {
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
        };

        VelocityAnimator.prototype.enter = function enter(element, effectName, options) {
          var _this = this;
          return new Promise(function (resolve, reject) {
            _this._performSingleAnimate(element, effectName || 'fadeIn', 'enter');
          });
        };

        VelocityAnimator.prototype.leave = function leave(element, effectName, options) {
          var _this = this;
          return new Promise(function (resolve, reject) {
            _this._performSingleAnimate(element, effectName || 'fadeOut', 'leave');
          });
        };

        return VelocityAnimator;
      })();

      _export('VelocityAnimator', VelocityAnimator);
    }
  };
});