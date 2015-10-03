import {configure} from '../src/index';
import {VelocityAnimator} from '../src/animator';

jasmine.getFixtures().fixturesPath = 'base/test/fixtures/';

describe('animator-velocity-plugin', () => {
  let elem;
  let animator;
  let container;

  beforeEach(() => {
    //stop all animations running on the test element
    if (animator) animator.stop(elem, true);

    loadFixtures('animation.html');
    container = $('#animation').eq(0)[0];
    animator = new VelocityAnimator(container);
  });

  describe('plugin initialization', () => {
    let aurelia = {
      globalizeResources: () => {

      },
      container: {
        registerInstance: (type, instance) => {

        },
        get: (Type) => { return new Type(); }
      }
    };

    it('exports a configure function', () => {
      expect(typeof configure).toBe('function');
    });

    it('accepts a setup callback passing back the animator instance', (done) => {
      let cb = (instance) => {
        expect(typeof instance).toBe('object');
        done();
      };

      configure(aurelia, cb);
    });
  });
});
