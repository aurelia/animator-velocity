System.register(['velocity', 'jsol', 'aurelia-templating', 'velocity/velocity.ui'], function (_export) {
  'use strict';

  var velocity, JSOL, animationEvent, VelocityAnimator;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function dispatch(element, name) {
    var evt = new CustomEvent(animationEvent[name], { bubbles: true, cancelable: true, detail: element });
    document.dispatchEvent(evt);
  }
  return {
    setters: [function (_velocity) {
      velocity = _velocity['default'];
    }, function (_jsol) {
      JSOL = _jsol['default'];
    }, function (_aureliaTemplating) {
      animationEvent = _aureliaTemplating.animationEvent;
    }, function (_velocityVelocityUi) {}],
    execute: function () {
      VelocityAnimator = (function () {
        function VelocityAnimator(container) {
          _classCallCheck(this, VelocityAnimator);

          this.options = {
            duration: 400,
            easing: 'linear'
          };
          this.isAnimating = false;
          this.enterAnimation = { properties: ':enter', options: { easing: 'ease-in', duration: 200 } };
          this.leaveAnimation = { properties: ':leave', options: { easing: 'ease-in', duration: 200 } };
          this.easings = [];
          this.effects = {
            ':enter': 'fadeIn',
            ':leave': 'fadeOut'
          };

          this.container = container || window.document;
          this.easings = Object.assign(velocity.Easings, this.easings);
          this.effects = Object.assign(velocity.Redirects, this.effects);
        }

        VelocityAnimator.prototype.animate = function animate(element, nameOrProps, options, silent) {
          this.isAnimating = true;
          var _this = this;
          var overrides = {
            complete: function complete(el) {
              _this.isAnimating = false;
              if (!silent) dispatch(el, 'animateDone');
              if (options && options.complete) options.complete.apply(this, arguments);
            }
          };
          if (!element) return Promise.reject(new Error('invalid first argument'));

          if (typeof element === 'string') element = this.container.querySelectorAll(element);

          if (!element || element.length === 0) return Promise.resolve(element);

          if (!silent) dispatch(element, 'animateBegin');

          if (typeof nameOrProps === 'string') {
            nameOrProps = this.resolveEffectAlias(nameOrProps);
          }

          var opts = Object.assign({}, this.options, options, overrides);
          var p = velocity(element, nameOrProps, opts);

          if (!p) return Promise.reject(new Error('invalid element used for animator.animate'));
          return p;
        };

        VelocityAnimator.prototype.stop = function stop(element, clearQueue) {
          velocity(element, 'stop', clearQueue);
          this.isAnimating = false;
          return this;
        };

        VelocityAnimator.prototype.reverse = function reverse(element) {
          velocity(element, 'reverse');
          return this;
        };

        VelocityAnimator.prototype.rewind = function rewind(element) {
          velocity(name, 'rewind');
          return this;
        };

        VelocityAnimator.prototype.registerEffect = function registerEffect(name, props) {
          if (name[0] === ':') {
            if (typeof props === 'string') {
              this.effects[name] = props;
            } else {
              throw new Error('second parameter must be a string when registering aliases');
            }
          } else {
            velocity.RegisterEffect(name, props);
          }
          return this;
        };

        VelocityAnimator.prototype.unregisterEffect = function unregisterEffect(name) {
          delete this.effects[name];
          return this;
        };

        VelocityAnimator.prototype.runSequence = function runSequence(sequence) {
          var _this2 = this;

          dispatch(window, 'sequenceBegin');
          return new Promise(function (resolve, reject) {
            _this2.sequenceReject = resolve;
            var last = sequence[sequence.length - 1];
            last.options = last.options || last.o || {};
            last.options.complete = function () {
              if (!_this2.sequenceReject) return;
              _this2.sequenceReject = undefined;
              dispatch(window, 'sequenceDone');
              resolve();
            };
            try {
              velocity.RunSequence(sequence);
            } catch (e) {
              _this2.stopSequence(sequence);
              _this2.sequenceReject(e);
            }
          });
        };

        VelocityAnimator.prototype.stopSequence = function stopSequence(sequence) {
          var _this3 = this;

          sequence.map(function (item) {
            var el = item.e || item.element || item.elements;
            _this3.stop(el, true);
          });
          if (this.sequenceReject) {
            this.sequenceReject();
            this.sequenceReject = undefined;
          }
          dispatch(window, 'sequenceDone');
          return this;
        };

        VelocityAnimator.prototype.resolveEffectAlias = function resolveEffectAlias(alias) {
          if (typeof alias === 'string' && alias[0] === ':') {
            return this.effects[alias];
          }
          return alias;
        };

        VelocityAnimator.prototype.enter = function enter(element, effectName, options) {
          return this.stop(element, true)._runElementAnimation(element, effectName || ':enter', options, 'enter');
        };

        VelocityAnimator.prototype.leave = function leave(element, effectName, options) {
          return this.stop(element, true)._runElementAnimation(element, effectName || ':leave', options, 'leave');
        };

        VelocityAnimator.prototype._runElements = function _runElements(element, name) {
          var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

          if (!element) return Promise.reject(new Error('invalid first argument'));

          if (typeof element === 'string') element = this.container.querySelectorAll(element);

          if (!element || element.length === 0) return Promise.resolve(element);

          for (var i = 0; i < element.length; i++) {
            this._runElementAnimation(element[i], name, options);
          }
        };

        VelocityAnimator.prototype._runElementAnimation = function _runElementAnimation(element, name) {
          var _this4 = this,
              _arguments = arguments;

          var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
          var eventName = arguments.length <= 3 || arguments[3] === undefined ? undefined : arguments[3];

          if (!element) return Promise.reject(new Error('invalid first argument'));

          if (typeof element === 'string') element = this.container.querySelectorAll(element);

          if (!element || element.length === 0) return Promise.resolve(element);

          if (!element.animations) this.parseAttributes(element);

          if (eventName) dispatch(element, eventName + 'Begin');

          var overrides = {
            complete: function complete(elements) {
              _this4.isAnimating = false;
              if (eventName) dispatch(element, eventName + 'Done');
              if (options && options.complete) options.complete.apply(_this4, _arguments);
            }
          };

          var opts = Object.assign({}, this.options, options, overrides);
          return this.animate(element, name, opts, true);
        };

        VelocityAnimator.prototype.parseAttributes = function parseAttributes(element) {
          var el = undefined;
          var i = undefined;
          var l = undefined;
          element = this.ensureList(element);
          for (i = 0, l = element.length; i < l; i++) {
            el = element[i];
            el.animations = {};
            el.animations.enter = this.parseAttributeValue(el.getAttribute('anim-enter')) || this.enterAnimation;
            el.animations.leave = this.parseAttributeValue(el.getAttribute('anim-leave')) || this.leaveAnimation;
          }
        };

        VelocityAnimator.prototype.parseAttributeValue = function parseAttributeValue(value) {
          if (!value) return value;
          var p = value.split(';');
          var properties = p[0];
          var options = {};
          if (properties[0] === '{' && properties[properties.length - 1] === '}') properties = JSOL.parse(properties);

          if (p.length > 1) {
            options = p[1];
            options = JSOL.parse(options);
          }
          return { properties: properties, options: options };
        };

        VelocityAnimator.prototype.ensureList = function ensureList(element) {
          if (!Array.isArray(element) && !(element instanceof NodeList)) element = [element];
          return element;
        };

        return VelocityAnimator;
      })();

      _export('VelocityAnimator', VelocityAnimator);
    }
  };
});