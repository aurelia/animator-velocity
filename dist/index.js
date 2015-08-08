import Velocity from 'velocity';
import {animationEvent} from 'aurelia-templating';

export class VelocityAnimator{
	constructor() {
		this.isAnimating = false;
		this.options = {
    		duration: 400,
    		easing:'linear'
  		};
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
      	var opts = Object.assign({},_this.options,options,overrides);
      	Velocity(element, effectName, opts, eventName);
		//todo return this.animate(...)

	}
	animate(){
		this.isAnimating = true;

		//todo Velocity in here
	}
	enter(element){
		let _this  = this;
		return new Promise( (resolve, reject) => {
			// Step 1: generate animation id
      		var animId = element.toString() + Math.random(),
          		classList = element.classList;

          	_this._performSingleAnimate(element,effectName || 'fadeIn','enter')
		}
	}
	leave(element){
		var _this = this;
		return new Promise( (resolve, reject) => {
			// Step 1: generate animation id
      		var animId = element.toString() + Math.random(),
          		classList = element.classList;

          	_this._performSingleAnimate(element,effectName || 'fadeOut','leave');
		}
	}

	_triggerDOMEvent(eventType, element) {
    	var evt = new window.CustomEvent(animationEvent[name], {bubbles: true, cancelable: true, detail: element});
    	document.dispatchEvent(evt);
  }
}