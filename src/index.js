import {TemplatingEngine} from 'aurelia-templating';
import {VelocityAnimator} from './animator';

/**
 * Configuires the VelocityAnimator as the default animator for Aurelia.
 * @param config The FrameworkConfiguration instance.
 * @param callback A configuration callback provided by the plugin consumer.
 */
export function configure(config: Object, callback?:(animator:VelocityAnimator) => void): void {
  let animator = config.container.get(VelocityAnimator);
  config.container.get(TemplatingEngine).configureAnimator(animator);
  if (typeof callback === 'function') { callback(animator); }
}
