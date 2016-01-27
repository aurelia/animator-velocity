declare module 'aurelia-animator-velocity' {
  import velocity from 'velocity';
  import JSOL from 'jsol';
  import { animationEvent, TemplatingEngine }  from 'aurelia-templating';
  import { DOM, PLATFORM }  from 'aurelia-pal';
  import 'velocity/velocity.ui';

  /**
   * An implementation of the Animator using Velocity.
   */
  export class VelocityAnimator {

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

    // --------------------------------- Aurelia Animator interface
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
    stopSequence(sequence: any): VelocityAnimator;

    /**
       * Resolve the real effect name from an effect alias
       * @param alias The effect alias.
       * @param The resolved value.
       */
    resolveEffectAlias(alias: string): string;

    // --------- The enter and leave animations are called for each page transition made by the router
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
  }

  /**
   * Configuires the VelocityAnimator as the default animator for Aurelia.
   * @param config The FrameworkConfiguration instance.
   * @param callback A configuration callback provided by the plugin consumer.
   */
  export function configure(config: Object, callback?: ((animator: VelocityAnimator) => void)): void;
}