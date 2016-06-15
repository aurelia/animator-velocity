'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _aureliaAnimatorVelocity = require('./aurelia-animator-velocity');

Object.keys(_aureliaAnimatorVelocity).forEach(function (key) {
  if (key === "default") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _aureliaAnimatorVelocity[key];
    }
  });
});