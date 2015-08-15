'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.configure = configure;

var _aureliaTemplating = require('aurelia-templating');

var _animator = require('./animator');

Object.defineProperty(exports, 'VelocityAnimator', {
  enumerable: true,
  get: function get() {
    return _animator.VelocityAnimator;
  }
});

function configure(aurelia, cb) {
  var animator = aurelia.container.get(_animator.VelocityAnimator);
  _aureliaTemplating.Animator.configureDefault(aurelia.container, animator);
  if (cb !== undefined && typeof cb === 'function') cb(animator);
}
//# sourceMappingURL=index.js.map