import {TemplatingEngine} from 'aurelia-templating';
import {VelocityAnimator} from './animator';

export function configure(config: Object, callback?:(animator:VelocityAnimator) => void): void {
  let animator = config.container.get(VelocityAnimator);
  config.container.get(TemplatingEngine).configureAnimator(animator);
  if (typeof callback === 'function') { callback(animator); }
}
