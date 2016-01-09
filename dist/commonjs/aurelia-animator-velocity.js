'use strict';

exports.__esModule = true;
exports.configure = configure;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _velocity = require('velocity');

var _velocity2 = _interopRequireDefault(_velocity);

var _jsol = require('jsol');

var _jsol2 = _interopRequireDefault(_jsol);

var _aureliaTemplating = require('aurelia-templating');

var _aureliaPal = require('aurelia-pal');

require('velocity/velocity.ui');

var VelocityAnimator = (function () {
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

    this.container = container || _aureliaPal.DOM;
    this.easings = Object.assign(_velocity2['default'].Easings, this.easings);
    this.effects = Object.assign(_velocity2['default'].Redirects, this.effects);
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
    var p = _velocity2['default'](element, nameOrProps, opts);

    if (!p) return Promise.reject(new Error('invalid element used for animator.animate'));
    return p;
  };

  VelocityAnimator.prototype.stop = function stop(element, clearQueue) {
    _velocity2['default'](element, 'stop', clearQueue);
    this.isAnimating = false;
    return this;
  };

  VelocityAnimator.prototype.reverse = function reverse(element) {
    _velocity2['default'](element, 'reverse');
    return this;
  };

  VelocityAnimator.prototype.rewind = function rewind(element) {
    _velocity2['default'](name, 'rewind');
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
      _velocity2['default'].RegisterEffect(name, props);
    }
    return this;
  };

  VelocityAnimator.prototype.unregisterEffect = function unregisterEffect(name) {
    delete this.effects[name];
    return this;
  };

  VelocityAnimator.prototype.runSequence = function runSequence(sequence) {
    var _this2 = this;

    dispatch(_aureliaPal.PLATFORM.global, 'sequenceBegin');
    return new Promise(function (resolve, reject) {
      _this2.sequenceReject = resolve;
      var last = sequence[sequence.length - 1];
      last.options = last.options || last.o || {};
      last.options.complete = function () {
        if (!_this2.sequenceReject) return;
        _this2.sequenceReject = undefined;
        dispatch(_aureliaPal.PLATFORM.global, 'sequenceDone');
        resolve();
      };
      try {
        _velocity2['default'].RunSequence(sequence);
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
    dispatch(_aureliaPal.PLATFORM.global, 'sequenceDone');
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

  VelocityAnimator.prototype.removeClass = function removeClass(element, className) {
    element.classList.remove(className);
    return Promise.resolve(false);
  };

  VelocityAnimator.prototype.addClass = function addClass(element, className) {
    element.classList.add(className);
    return Promise.resolve(false);
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

    if (!element.animations) this._parseAttributes(element);

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

  VelocityAnimator.prototype._parseAttributes = function _parseAttributes(element) {
    var el = undefined;
    var i = undefined;
    var l = undefined;
    element = this._ensureList(element);
    for (i = 0, l = element.length; i < l; i++) {
      el = element[i];
      el.animations = {};
      el.animations.enter = this._parseAttributeValue(el.getAttribute('anim-enter')) || this.enterAnimation;
      el.animations.leave = this._parseAttributeValue(el.getAttribute('anim-leave')) || this.leaveAnimation;
    }
  };

  VelocityAnimator.prototype._parseAttributeValue = function _parseAttributeValue(value) {
    if (!value) return value;
    var p = value.split(';');
    var properties = p[0];
    var options = {};
    if (properties[0] === '{' && properties[properties.length - 1] === '}') properties = _jsol2['default'].parse(properties);

    if (p.length > 1) {
      options = p[1];
      options = _jsol2['default'].parse(options);
    }
    return { properties: properties, options: options };
  };

  VelocityAnimator.prototype._ensureList = function _ensureList(element) {
    if (!Array.isArray(element) && !(element instanceof NodeList)) element = [element];
    return element;
  };

  return VelocityAnimator;
})();

exports.VelocityAnimator = VelocityAnimator;

function dispatch(element, name) {
  var evt = _aureliaPal.DOM.createCustomEvent(_aureliaTemplating.animationEvent[name], { bubbles: true, cancelable: true, detail: element });
  _aureliaPal.DOM.dispatchEvent(evt);
}

function configure(config, callback) {
  var animator = config.container.get(VelocityAnimator);
  config.container.get(_aureliaTemplating.TemplatingEngine).configureAnimator(animator);
  if (typeof callback === 'function') {
    callback(animator);
  }
}