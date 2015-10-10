import {VelocityAnimator} from '../src/animator';
import {animationEvent} from 'aurelia-templating';
import {initialize} from 'aurelia-pal-browser';

jasmine.getFixtures().fixturesPath = 'base/test/fixtures/';

describe('animator-velocity', () => {
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

  describe('staggering', () => {
    let elem;
    beforeEach(() => {
      loadFixtures('animation.html');
      elem = $('#test-simple').eq(0)[0];
      animator.stop(elem, true);
    });

    it('publishes an animationEnd event when all elements are done animating', (done) => {
      let eventCalled = false;

      let listener = document.addEventListener(animationEvent.animateDone, () => eventCalled = true);
      let elems = $('#test-stagger').eq(0)[0].children;

      animator.animate(elems, 'fadeIn', {stagger: 50}).then(() => {
        expect(eventCalled).toBe(true);
        for (let i = 0, l = elems.length; i < l; i++) {
          expect(elems[i].style.opacity).toBe('1');
        }
        document.removeEventListener(animationEvent.staggerNext, listener);
        done();
      });
    });
  });
});
