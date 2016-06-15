import velocity from 'velocity-animate';
import {
  animationEvent,
  TemplatingEngine
} from 'aurelia-templating';
import {
  DOM,
  PLATFORM
} from 'aurelia-pal';
import 'velocity-animate/velocity.ui';

/**
 * An implementation of the Animator using Velocity.
 */
export declare class VelocityAnimator {
  
  /**
     * Default options for velocity
     */
  options: any;
  isAnimating: boolean;
  enterAnimation: any;
  leaveAnimation: any;
  
  /**
     * Array of easing names that can be used with this animator
     */
  easings: Array<string>;
  
  /**
     * Effects mapped by name
     */
  effects: any;
  
  /**
     * Creates an instance of VelocityAnimator.
     */
  constructor(container: any);
  
  //--------------------------------- Aurelia Animator interface
  /**
     * Run a animation by name or by manually specifying properties and options for it
     *
     * @param element Element or array of elements to animate
     * @param nameOrProps Element properties to animate
     * @param options Animation options
     * @return resolved when animation is complete
     */
  animate(element: any, nameOrProps: any, options?: any, silent?: boolean): Promise<VelocityAnimator>;
  
  /**
     * Stop an animation
     * @param element Element to animate
     * @param clearQueue clear the animation queue
     * @return this instance for chaining
     */
  stop(element: HTMLElement, clearQueue: boolean): VelocityAnimator;
  
  /**
     * Stop an animation
     * @param element Element to animate
     * @return this instance for chaining
     */
  reverse(element: HTMLElement): VelocityAnimator;
  
  /**
     * Bring animation back to the start state (this does not stop an animation)
     * @param element {HTMLElement}   Element to animate
     * @return this instance for chaining
     */
  rewind(element: HTMLElement): VelocityAnimator;
  
  /**
     * Register a new effect by name.
     * if second parameter is a string the effect will registered as an alias
     * @param name name for the effect
     * @param props properties for the effect
     * @return this instance for chaining
     */
  registerEffect(name: string, props: Object): VelocityAnimator;
  
  /**
     * Unregister an effect by name
     * @param name name of the effect
     * @return this instance for chaining
     */
  unregisterEffect(name: string): VelocityAnimator;
  
  /**
     * Run a seqeunce of animations one after the other
     * @param sequence array of animations
     * @return A promise for sequence completion.
     */
  runSequence(sequence: Array<any>): Promise<any>;
  
  /**
     * Runs stop on all elements in a sequence
     * @param sequence array of animations
     * @return this instance for chaining
     */
  stopSequence(sequence?: any): VelocityAnimator;
  
  /**
     * Resolve the real effect name from an effect alias
     * @param alias The effect alias.
     * @param The resolved value.
     */
  resolveEffectAlias(alias: string): string;
  
  //--------- The enter and leave animations are called for each page transition made by the router
  /**
     * Run the enter animation on an element
     * @param element Element to stop animating
     * @return resolved when animation is complete
     */
  enter(element: any, effectName: any, options: any): Promise<VelocityAnimator>;
  
  /**
     * Run the leave animation on an element
     * @param element Element to animate
     * @returns resolved when animation is complete
     */
  leave(element: any, effectName: any, options: any): Promise<VelocityAnimator>;
  
  /**
     * Add a class to an element to trigger an animation.
     * @param element Element to animate
     * @param className Properties to animate or name of the effect to use
     * @returns Resolved when the animation is done
     */
  removeClass(element: HTMLElement, className: string): Promise<boolean>;
  
  /**
     * Add a class to an element to trigger an animation.
     * @param element Element to animate
     * @param className Properties to animate or name of the effect to use
     * @returns Resolved when the animation is done
     */
  addClass(element: HTMLElement, className: string): Promise<boolean>;
  
  /**
     * Run an animation on several elements
     * @param element Element to animate
     * @return when animation is complete
     */
  _runElements(element: any, name: any, options?: any): Promise<VelocityAnimator>;
  
  //--------------------------------- Private methods
  /**
     * execute an animation that is coupled to an HTMLElement
     *
     * The html element can optionally override the animation options through it's attributes
     *
     * @param element {HTMLElement}   Element to animate
     * @param name {String}           Name of the effect to execute
     * @param options                 animation options
     * @param eventName               name of the event to dispatch
     *
     * @returns {Promise} resolved when animation is complete
     */
  _runElementAnimation(element: HTMLElement, name: string, options?: any, eventName?: string): Promise<any>;
  
  /**
     * Parse animations specified in the elements attributes.
     * The parsed attributes will be stored in the animations property for the element.
     *
     * @param element {HTMLElement|Array<HTMLElement>}   Element(s) to parse
     */
  _parseAttributes(element: any): void;
  
  /**
     * Parse an attribute value as an animation definition
     *
     * syntax with effectname:     effectName;{prop1:value, prop2:value}
     * syntax with properties:     {prop1:value, prop2:value};{prop1:value, prop2:value}
     *
     * @param value           Attribute value
     * @returns {Object}      Object with the effectName/properties and options that have been extracted
     */
  _parseAttributeValue(value: any): any;
  
  /**
     * Turn an element into an array of elements if it's not an array yet or a Nodelist
     */
  _ensureList(element: any): any;
}

/**
 * Configuires the VelocityAnimator as the default animator for Aurelia.
 * @param config The FrameworkConfiguration instance.
 * @param callback A configuration callback provided by the plugin consumer.
 */
export declare function configure(config: Object, callback?: ((animator: VelocityAnimator) => void)): void;