System.register(['aurelia-templating', './animator'], function (_export) {
  'use strict';

  var Animator, VelocityAnimator;

  _export('configure', configure);

  function configure(aurelia, cb) {
    var animator = aurelia.container.get(VelocityAnimator);
    Animator.configureDefault(aurelia.container, animator);
    if (cb !== undefined && typeof cb === 'function') cb(animator);
  }

  return {
    setters: [function (_aureliaTemplating) {
      Animator = _aureliaTemplating.Animator;
    }, function (_animator) {
      VelocityAnimator = _animator.VelocityAnimator;

      _export('VelocityAnimator', _animator.VelocityAnimator);
    }],
    execute: function () {}
  };
});
//# sourceMappingURL=index.js.map