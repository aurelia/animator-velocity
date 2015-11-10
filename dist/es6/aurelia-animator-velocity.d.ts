declare module 'aurelia-animator-velocity' {
  import velocity from 'velocity';
  import JSOL from 'jsol';
  import { animationEvent, TemplatingEngine }  from 'aurelia-templating';
  import { DOM, PLATFORM }  from 'aurelia-pal';
  import 'velocity/velocity.ui';
  
  /**
   * Aurelia animator implementation using Velocity
   */
  export class VelocityAnimator {
    
    /**
       * Default options for velocity
       * @type {Object}
       */
    options: any;
    isAnimating: boolean;
    enterAnimation: any;
    leaveAnimation: any;
    
    /**
       * Array of easing names that can be used with this animator
       *
       * @type {Array}
       */
    easings: Array<string>;
    
    /**
       * Effects mapped by name
       *
       * @type {Object}
       */
    effects: any;
    constructor(container: any);
    
    // --------------------------------- Aurelia Animator interface
    /**
       * Run a animation by name or by manually specifying properties and options for it
       *
       * @param element {HTMLElement|Array<HTMLElement>}    Element or array of elements to animate
       * @param nameOrProps {String|Object}                       Element properties to animate
       * @param options {Object}                            Animation options
       *
       * @returns {Promise} resolved when animation is complete
       */
    animate(element: any, nameOrProps: any, options: any, silent: boolean): VelocityAnimator;
    
    /**
       * Stop an animation
       *
       * @param element {HTMLElement}   Element to animate
       * @param clearQueue {boolean}    clear the animation queue
       *
       * @returns {Animator} return this instance for chaining
       */
    stop(element: HTMLElement, clearQueue: boolean): VelocityAnimator;
    
    /**
       * Stop an animation
       *
       * @param element {HTMLElement}   Element to animate
       *
       * @returns {Animator} return this instance for chaining
       */
    reverse(element: HTMLElement): VelocityAnimator;
    
    /**
       * Bring animation back to the start state (this does not stop an animation)
       *
       * @param element {HTMLElement}   Element to animate
       *
       * @returns {Animator} return this instance for chaining
       */
    rewind(element: HTMLElement): VelocityAnimator;
    
    /**
       * Register a new effect by name.
       *
       * if second parameter is a string the effect will registered as an alias
       *
       * @param name {String}   name for the effect
       * @param props {Object}  properties for the effect
       */
    registerEffect(name: string, props: object): VelocityAnimator;
    
    /**
       * Unregister an effect by name
       *
       * @param name {String}   name of the effect
       */
    unregisterEffect(name: string): VelocityAnimator;
    
    /**
       * Run a seqeunce of animations one after the other
       *
       * @param sequence {Array}  array of animations
       */
    runSequence(sequence: Array<any>): Promise;
    
    /**
       * runs stop on all elements in a sequence
       *
       * @param sequence {Array}  array of animations
       */
    stopSequence(sequence: any): VelocityAnimator;
    
    /**
       * Resolve the real effect name from an effect alias
       */
    resolveEffectAlias(alias: string): string;
    
    // --------- The enter and leave animations are called for each page transition made by the router
    /**
       * Run the enter animation on an element
       *
       * @param element {HTMLElement}   Element to stop animating
       *
       * @returns {Promise} resolved when animation is complete
       */
    enter(element: any, effectName: any, options: any): VelocityAnimator;
    
    /**
       * Run the leave animation on an element
       *
       * @param element {HTMLElement}   Element to animate
       *
       * @returns {Promise} resolved when animation is complete
       */
    leave(element: any, effectName: any, options: any): VelocityAnimator;
    
    /**
       * Parse animations specified in the elements attributes.
       * The parsed attributes will be stored in the animations property for the element.
       *
       * @param element {HTMLElement|Array<HTMLElement>}   Element(s) to parse
       */
    parseAttributes(element: any): void;
    
    /**
       * Parse an attribute value as an animation definition
       *
       * syntax with effectname:     effectName:{prop1:value, prop2:value}
       * syntax with properties:     {prop1:value, prop2:value}:{prop1:value, prop2:value}
       *
       * @param value           Attribute value
       * @returns {Object}      Object with the effectName/properties and options that have been extracted
       */
    parseAttributeValue(value: any): any;
    
    /**
       * Turn an element into an array of elements if it's not an array yet or a Nodelist
       */
    ensureList(element: any): any;
  }
  export function configure(config: Object, callback?: ((animator: VelocityAnimator) => void)): void;
}