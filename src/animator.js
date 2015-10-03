import Velocity from 'velocity';
import 'velocity/velocity.ui';

export class VelocityAnimator {
  constructor(container) {
    this.animationStack = [];
    this.isAnimating = false;
    this.options = {
        duration: 50,
        easing:'linear'
      };
    this.easings = Object.assign(Velocity.Easings,this.easings);
    this.effects = Object.assign(Velocity.Redirects,this.effects);
  }

_triggerDOMEvent(eventType, element) {
    var evt = new window.CustomEvent(eventType, {bubbles: true, cancelable: true, detail: element});
    document.dispatchEvent(evt);
  }

  animate(element,nameOrProps,options,silent) {
    this.isAnimating = true;
    let _this = this;
    let overrides = {
      complete:function(el){
        _this.isAnimating = false;
        if(!silent) _this._triggerDOMEvent(el,"animateDone");
        if(options && options.complete) options.complete.apply(this,arguments);
      }
    };
    if(!element) return Promise.reject(new Error("invalid first argument"));

    //resolve selectors
    if(typeof element === "string") element = this.container.querySelectorAll(element);

    //if nothing was found or no element was passed resolve the promise immediatly
    if(!element || element.length === 0) return Promise.resolve(element);

    if(!silent) this._triggerDOMEvent(element,"animateBegin");

    //try to run the animation
    var opts = Object.assign({},this.options,options,overrides);
    var p = Velocity(element, nameOrProps, opts);

    //reject the promise if Velocity didn't return a Promise due to invalid arguments
    if(!p) return Promise.reject(new Error("invalid element used for animator.animate"));
    return p;
  }

  _addMultipleEventListener(el, s, fn) {
      var evts = s.split(' '),
        i, ii;

      for (i = 0, ii = evts.length; i < ii; ++i) {
        el.addEventListener(evts[i], fn, false);
      }
    }
    _addAnimationToStack(animId) {
      if(this.animationStack.indexOf(animId) < 0) {
        this.animationStack.push(animId);
      }
    }
   _removeAnimationFromStack(animId) {
      var idx = this.animationStack.indexOf(animId);
      if(idx > -1) {
          this.animationStack.splice(idx, 1);
      }
    }
    _performSingleAnimate(element,effectName,eventName=undefined){
    var _this = this;
    var options={};
    if (eventName) 
      this._triggerDOMEvent(eventName+"Begin", element);

    let overrides = {
          complete:elements=>{
          _this.isAnimating = false;
          if(eventName) _this._triggerDOMEvent(eventName+"Done",element);
          if(options && options.complete) options.complete.apply(_this,arguments);
        }
      }
    var opts = Object.assign({},_this.options,options,overrides);
    this.animate(element, effectName, opts, eventName);   
  }
  
enter(element,effectName,options){  
    let _this  = this;
    return new Promise( (resolve, reject) => {
        _this._performSingleAnimate(element,effectName || 'fadeIn','enter')
    });
  }

  leave(element,effectName,options) {
   var _this = this;
    return new Promise( (resolve, reject) => {               
        _this._performSingleAnimate(element,effectName || 'fadeOut','leave');
    });
  }
}
