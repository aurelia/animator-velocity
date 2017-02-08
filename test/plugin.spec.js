import {configure} from '../src/index';
import {VelocityAnimator} from '../src/animator';
import {initialize} from 'aurelia-pal-browser';

jasmine.getFixtures().fixturesPath = 'base/test/fixtures/';

describe('animator-velocity-plugin', () => {
  let elem;
  let animator;
  let container;

  beforeAll(() => initialize());

  beforeEach(() => {
    //stop all animations running on the test element
    if (animator) animator.stop(elem, true);

    loadFixtures('animation.html');
    container = $('#animation').eq(0)[0];
    animator = new VelocityAnimator(container);
  });

  describe('plugin initialization', () => {
    let aurelia = {
      globalResources: () => {

      },
      container: {
        registerInstance: (type, instance) => {

        },
        get: (type) => {
          if (type === VelocityAnimator) {
            return new VelocityAnimator();
          }

          return {
            configureAnimator() {

            }
          };
        }
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
