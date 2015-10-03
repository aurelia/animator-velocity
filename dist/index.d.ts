declare module 'aurelia-animator-velocity' {
  import Velocity from 'velocity';
  import { Animator }  from 'aurelia-templating';
  import  from 'velocity/velocity.ui';
  export class VelocityAnimator {
    constructor(container: any);
    animate(element: any, nameOrProps: any, options: any, silent: any): any;
    enter(element: any, effectName: any, options: any): any;
    leave(element: any, effectName: any, options: any): any;
  }
  export { VelocityAnimator } from 'aurelia-animator-velocity/animator';
  export function configure(aurelia: any, cb: any): any;
}