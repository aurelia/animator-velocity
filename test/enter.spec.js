import {VelocityAnimator} from '../src/animator';
import {animationEvent} from 'aurelia-templating';

jasmine.getFixtures().fixturesPath = 'base/test/fixtures/';

describe('animator-velocity', () => {
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

  describe('enter function', () => {
    beforeEach(() => {
      loadFixtures('animation.html');
      elem = $('#test-simple').eq(0)[0];
      animator.stop(elem, true);
    });

    it('returns a promise', () => {
      let result = animator.enter(elem);
      expect(result.then).toBeDefined();
    });

    it('sets isAnimating to true when the animation starts and sets it to false when the animation is done', (done) => {
      expect(animator.isAnimating).toBe(false);
      animator.enter(elem).then(()=> {
        expect(animator.isAnimating).toBe(false);
        done();
      });
      expect(animator.isAnimating).toBe(true);
    });

    it('can use aliases', (done) => {
      animator.enter(elem).then(()=> {
        expect(elem.style.opacity).toBe('1');
        done();
      });
    });

    it('publishes an enterBegin and enterDone event', (done) => {
      let enterBeginCalled = false;
      let enterDoneCalled = false;
      let l1 = document.addEventListener(animationEvent.enterBegin, (payload) => enterBeginCalled = true);
      let l2 = document.addEventListener(animationEvent.enterDone, () => enterDoneCalled = true);

      animator.enter(elem).then(() => {
        expect(enterDoneCalled).toBe(true);
        document.removeEventListener(animationEvent.enterDone, l2, false);
        done();
      });

      expect(enterBeginCalled).toBe(true);
      document.removeEventListener(animationEvent.enterBegin, l1, false);
    });

    /*it('publishes an enterBegin and enterDone event when using custom effects', (done) => {
     let enterBeginCalled = false, enterDoneCalled = false;
     let l1 = document.addEventListener(animationEvent.enterBegin, (payload) => enterBeginCalled = true),
     l2 = document.addEventListener(animationEvent.enterDone, () => enterDoneCalled = true);

     animator.enter(elem,'fadeIn').then( () => {
     expect(enterDoneCalled).toBe(true);
     document.removeEventListener(animationEvent.enterDone, l2, false);
     done();
     });

     expect(enterBeginCalled).toBe(true);
     document.removeEventListener(animationEvent.enterBegin, l1, false);
     });*/
  });
});
