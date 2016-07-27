define(['exports', './aurelia-animator-velocity'], function (exports, _aureliaAnimatorVelocity) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.keys(_aureliaAnimatorVelocity).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _aureliaAnimatorVelocity[key];
      }
    });
  });
});