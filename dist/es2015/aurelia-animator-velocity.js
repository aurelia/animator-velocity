import velocity from 'velocity-animate';
import { animationEvent, TemplatingEngine } from 'aurelia-templating';
import { aureliaHideClassName } from 'aurelia-templating-resources/aurelia-hide-style';
import { DOM, PLATFORM } from 'aurelia-pal';

import 'velocity-animate/velocity.ui';

export let VelocityAnimator = class VelocityAnimator {
  constructor(container) {
    this.options = {
      duration: 400,
      easing: 'linear'
    };
    this.isAnimating = false;
    this.enterAnimation = { properties: ':enter', options: { easing: 'ease-in', duration: 200 } };
    this.leaveAnimation = { properties: ':leave', options: { easing: 'ease-in', duration: 200 } };
    this.showAnimation = { properties: ':show', options: { easing: 'ease-in', duration: 200 } };
    this.hideAnimation = { properties: ':hide', options: { easing: 'ease-in', duration: 200 } };
    this.easings = [];
    this.effects = {
      ':enter': 'fadeIn',
      ':leave': 'fadeOut',
      ':show': 'fadeIn',
      ':hide': 'fadeOut'
    };

    this.container = container || DOM;
    this.easings = Object.assign(velocity.Easings, this.easings);
    this.effects = Object.assign(velocity.Redirects, this.effects);
  }

  animate(element, nameOrProps, options, silent) {
    if (!element) return Promise.reject(new Error('first argument (element) must be defined'));
    if (!nameOrProps) return Promise.reject(new Error('second argument (animation name or properties) must be defined'));
    if (options && (!(options instanceof Object) || Array.isArray(options))) return Promise.reject(new Error('third argument (options) must be an Object'));

    this.isAnimating = true;

    const _this = this;
    const optionOverrides = {
      complete: function (el) {
        _this.isAnimating = false;
        if (!silent) dispatch(el, 'animateDone');
        if (options && options.complete) options.complete.apply(this, arguments);
      }
    };

    if (typeof element === 'string') element = this.container.querySelectorAll(element);

    if (!element || element.length === 0) return Promise.resolve(element);

    if (!silent) dispatch(element, 'animateBegin');

    if (typeof nameOrProps === 'string') {
      nameOrProps = this.resolveEffectAlias(nameOrProps);
      if (!this.effects[nameOrProps]) return Promise.reject(new Error(`effect with name \`${nameOrProps}\` was not found`));
    }

    const velocityOptions = Object.assign({}, this.options, options, optionOverrides);
    const velocityPromise = velocity(element, nameOrProps, velocityOptions);
    return velocityPromise ? velocityPromise : Promise.reject(new Error('velocity animation failed due to invalid arguments'));
  }

  stop(element, clearQueue) {
    velocity(element, 'stop', clearQueue);
    this.isAnimating = false;
    return this;
  }

  reverse(element) {
    velocity(element, 'reverse');
    return this;
  }

  rewind(element) {
    velocity(name, 'rewind');
    return this;
  }

  registerEffect(name, props) {
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
  }

  unregisterEffect(name) {
    delete this.effects[name];
    return this;
  }

  runSequence(sequence) {
    dispatch(PLATFORM.global, 'sequenceBegin');
    return new Promise((resolve, reject) => {
      this.sequenceReject = resolve;
      let last = sequence[sequence.length - 1];
      last.options = last.options || last.o || {};
      last.options.complete = () => {
        if (!this.sequenceReject) return;
        this.sequenceReject = undefined;
        dispatch(PLATFORM.global, 'sequenceDone');
        resolve();
      };
      try {
        velocity.RunSequence(sequence);
      } catch (e) {
        this.stopSequence(sequence);
        this.sequenceReject(e);
      }
    });
  }

  stopSequence(sequence) {
    sequence.map(item => {
      let el = item.e || item.element || item.elements;
      this.stop(el, true);
    });
    if (this.sequenceReject) {
      this.sequenceReject();
      this.sequenceReject = undefined;
    }
    dispatch(PLATFORM.global, 'sequenceDone');
    return this;
  }

  resolveEffectAlias(alias) {
    if (typeof alias === 'string' && alias[0] === ':') {
      return this.effects[alias];
    }
    return alias;
  }

  enter(element, effectName, options) {
    return this.stop(element, true)._runElementAnimation(element, effectName || ':enter', options, 'enter');
  }

  leave(element, effectName, options) {
    return this.stop(element, true)._runElementAnimation(element, effectName || ':leave', options, 'leave');
  }

  removeClass(element, className) {
    if (className === aureliaHideClassName) {
      element.classList.remove(className);
      return this.stop(element, true)._runElementAnimation(element, ':show', undefined, 'show');
    } else {
      element.classList.remove(className);
      return Promise.resolve(false);
    }
  }

  addClass(element, className) {
    if (className === aureliaHideClassName) {
      return this.stop(element, true)._runElementAnimation(element, ':hide', undefined, 'hide').then(() => {
        element.classList.add(className);
      });
    } else {
      element.classList.add(className);
      return Promise.resolve(false);
    }
  }

  _runElements(element, name, options = {}) {
    if (!element) return Promise.reject(new Error('invalid first argument'));

    if (typeof element === 'string') element = this.container.querySelectorAll(element);

    if (!element || element.length === 0) return Promise.resolve(element);

    for (let i = 0; i < element.length; i++) {
      this._runElementAnimation(element[i], name, options);
    }

    return Promise.resolve(element);
  }

  _runElementAnimation(element, name, options = {}, eventName = undefined) {
    if (!element) return Promise.reject(new Error('invalid first argument'));

    if (typeof element === 'string') element = this.container.querySelectorAll(element);

    if (!element || element.length === 0) return Promise.resolve(element);

    if (!element.animations) this._parseAttributes(element);

    if (eventName) dispatch(element, eventName + 'Begin');

    let overrides = {
      complete: elements => {
        this.isAnimating = false;
        if (eventName) dispatch(element, eventName + 'Done');
        if (options && options.complete) options.complete.apply(this, arguments);
      }
    };

    let attrOpts = {};
    switch (name) {
      case ':enter':
        let enter = element.animations.enter;
        name = enter.properties;
        attrOpts = enter.options;
        break;

      case ':leave':
        let leave = element.animations.leave;
        name = leave.properties;
        attrOpts = leave.options;
        break;

      case ':show':
        let show = element.animations.show;
        name = show.properties;
        attrOpts = show.options;
        break;

      case ':hide':
        let hide = element.animations.hide;
        name = hide.properties;
        attrOpts = hide.options;
        break;

      default:
        if (!this.effects[this.resolveEffectAlias(name)]) throw new Error(`${name} animation is not supported.`);
    }

    let opts = Object.assign({}, this.options, attrOpts, options, overrides);
    return this.animate(element, name, opts, true);
  }

  _parseAttributes(element) {
    let el;
    let i;
    let l;
    element = this._ensureList(element);
    for (i = 0, l = element.length; i < l; i++) {
      el = element[i];
      el.animations = {};
      el.animations.enter = this._parseAttributeValue(el.getAttribute('anim-enter')) || this.enterAnimation;
      el.animations.leave = this._parseAttributeValue(el.getAttribute('anim-leave')) || this.leaveAnimation;
      el.animations.show = this._parseAttributeValue(el.getAttribute('anim-show')) || this.showAnimation;
      el.animations.hide = this._parseAttributeValue(el.getAttribute('anim-hide')) || this.hideAnimation;
    }
  }

  _parseAttributeValue(value) {
    if (!value) {
      return value;
    }

    let p = value.split(';');
    let properties = p[0].trim();
    let options = {};

    if (properties[0] === '{' && properties[properties.length - 1] === '}') {
      properties = parseJSObject(properties);
    }

    if (p.length > 1) {
      options = parseJSObject(p[1].trim());
    }

    return { properties, options };
  }

  _ensureList(element) {
    if (!Array.isArray(element) && !(element instanceof NodeList)) element = [element];
    return element;
  }
};

function dispatch(element, name) {
  let evt = DOM.createCustomEvent(animationEvent[name], { bubbles: true, cancelable: true, detail: element });
  DOM.dispatchEvent(evt);
}

function parseJSObject(text) {
  if (typeof text !== 'string' || !text) {
    return null;
  }

  text = text.replace('{', '').replace('}', '');
  let pairs = text.split(/[,]+(?![^\[]+\])/);
  let obj = {};

  for (let i = 0; i < pairs.length; ++i) {
    let keyAndValue = pairs[i].split(':');
    let value = keyAndValue[1].trim();

    if (value[0] === '[' && value[value.length - 1] === ']' && value.indexOf(',') > -1) value = value.replace('[', '').replace(']', '').split(',');

    obj[keyAndValue[0].trim()] = value;
  }

  return obj;
}

export function configure(config, callback) {
  let animator = config.container.get(VelocityAnimator);
  config.container.get(TemplatingEngine).configureAnimator(animator);
  if (typeof callback === 'function') {
    callback(animator);
  }
}