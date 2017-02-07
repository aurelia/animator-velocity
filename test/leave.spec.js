import {VelocityAnimator} from '../src/animator';
import {animationEvent} from 'aurelia-templating';
import {initialize} from 'aurelia-pal-browser';

jasmine.getFixtures().fixturesPath = 'base/test/fixtures/';

describe('animator-velocity', () => {
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

  describe('leave function', () => {
    beforeEach(() => {
      loadFixtures('animation.html');
      elem = $('#test-simple').eq(0)[0];
      animator.stop(elem, true);
    });

    it('returns a promise', () => {
      let result = animator.leave(elem);
      expect(result.then).toBeDefined();
    });

    it('sets isAnimating to true when the animation starts and sets it to false when the animation is done', (done) => {
      expect(animator.isAnimating).toBe(false);
      animator.leave(elem).then(()=> {
        expect(animator.isAnimating).toBe(false);
        done();
      });
      expect(animator.isAnimating).toBe(true);
    });

    it('can use aliases', (done) => {
      animator.registerEffect(':fadeOutAlias', 'fadeOut');
      animator.leave(elem, ':fadeOutAlias').then(()=> {
        expect(elem.style.opacity).toBe('0');
        done();
      });
    });

    it('can use custom effects', (done) => {
      const customEffect = {
        defaultDuration: 50,
        calls: [ [{ opacity: [0, 1] }, 1] ]
      };

      animator.registerEffect('customFadeOut', customEffect);
      animator.leave(elem, 'customFadeOut').then(()=> {
        expect(elem.style.opacity).toBe('0');
        done();
      });
    });

    it('publishes an leaveBegin and leaveDone event', (done) => {
      let leaveBeginCalled = false;
      let leaveDoneCalled = false;
      let l1 = document.addEventListener(animationEvent.leaveBegin, (payload) => leaveBeginCalled = true);
      let l2 = document.addEventListener(animationEvent.leaveDone, () => leaveDoneCalled = true);

      animator.leave(elem).then(() => {
        expect(leaveDoneCalled).toBe(true);
        document.removeEventListener(animationEvent.leaveDone, l2, false);
        done();
      });

      expect(leaveBeginCalled).toBe(true);
      document.removeEventListener(animationEvent.leaveBegin, l1, false);
    });

    it('publishes an leaveBegin and leaveDone event when using custom effects', (done) => {
      let leaveBeginCalled = false;
      let leaveDoneCalled = false;
      let l1 = document.addEventListener(animationEvent.leaveBegin, (payload) => leaveBeginCalled = true);
      let l2 = document.addEventListener(animationEvent.leaveDone, () => leaveDoneCalled = true);

      animator.leave(elem, 'fadeIn').then(() => {
        expect(leaveDoneCalled).toBe(true);
        document.removeEventListener(animationEvent.leaveDone, l2, false);
        done();
      });

      expect(leaveBeginCalled).toBe(true);
      document.removeEventListener(animationEvent.leaveBegin, l1, false);
    });
  });
});
