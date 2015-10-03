import {Animator} from 'aurelia-templating';
import {VelocityAnimator} from './animator';
export {VelocityAnimator} from './animator';

export function configure(aurelia:any, cb:any):void {
  let animator = aurelia.container.get(VelocityAnimator);
  Animator.configureDefault(aurelia.container, animator);
  if (cb !== undefined && typeof(cb) === 'function') cb(animator);
}
