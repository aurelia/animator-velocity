import {VelocityAnimator} from '../src/animator';
import {animationEvent} from 'aurelia-templating';

jasmine.getFixtures().fixturesPath = 'base/test/fixtures/';

describe('animator-velocity', () => {
  let elem;
  let animator;
  let container;
  let seq;
  let testSequence;

  beforeEach(() => {
    //stop all animations running on the test element
    if (animator) animator.stop(elem, true);

    loadFixtures('animation.html');
    container = $('#animation').eq(0)[0];
    seq = container.querySelector('#test-sequence');

    testSequence = [
      {e: seq.children[0], p: {opacity: [1, 0], translateY: [0, 50]}, o: {duration: 100}},
      {e: seq.children[1], p: {opacity: [1, 0]}, o: {delay: 50, easing: 'ease-in', duration: 100, sequenceQueue: false}},
      {e: seq.children[2], p: {opacity: [1, 0], translateY: [0, 50]}, o: {delay: 0, easing: [500, 20], duration: 100}}
    ];

    animator = new VelocityAnimator(container);
  });

  describe('runSequence function', () => {
    beforeEach(() => {
      loadFixtures('animation.html');
      elem = $('#test-simple').eq(0)[0];
      animator.stop(elem, true);
    });

    it('returns a promise', () => {
      let result = animator.runSequence(testSequence);
      expect(result.then).toBeDefined();
    });

    it('executes animations one after another', (done) => {
      animator.runSequence(testSequence).then(() => {
        expect(seq.children[0].style.opacity).toBe('1');
        expect(seq.children[0].style.opacity).toBe('1');
        expect(seq.children[0].style.opacity).toBe('1');
        done();
      });
    });

    it('publishes a sequenceBegin and sequenceDone event', (done) => {
      let sequenceBeginCalled = false;
      let sequenceDoneCalled = false;
      let l1 = document.addEventListener(animationEvent.sequenceBegin, (payload) => sequenceBeginCalled = true);
      let l2 = document.addEventListener(animationEvent.sequenceDone, () => sequenceDoneCalled = true);

      animator.runSequence(testSequence, 'fadeIn').then(() => {
        expect(sequenceDoneCalled).toBe(true);
        document.removeEventListener(animationEvent.sequenceDone, l2, false);
        done();
      });

      expect(sequenceBeginCalled).toBe(true);
      document.removeEventListener(animationEvent.sequenceBegin, l1, false);
    });

    //----- arguments

    it('rejects the promise when nothing is passed', (done) => {
      animator.runSequence().catch((e)=> {
        expect(e instanceof Error).toBe(true);
        done();
      });
    });

    it('rejects the promise when null is passed', (done) => {
      animator.runSequence(null).catch((e)=> {
        expect(e instanceof Error).toBe(true);
        done();
      });
    });

    it('rejects the promise when a string is passed', (done) => {
      animator.runSequence('test').catch((e)=> {
        expect(e instanceof Error).toBe(true);
        done();
      });
    });

    it('rejects the promise when an object s passed', (done) => {
      animator.runSequence({}).catch((e)=> {
        expect(e instanceof Error).toBe(true);
        done();
      });
    });

    it('rejects the promise when an invalid array is passed', (done) => {
      animator.runSequence([1, 2]).catch((e)=> {
        expect(e instanceof Error).toBe(true);
        done();
      });
    });

    it('rejects the promise when an HTMLElement is passed', (done) => {
      animator.runSequence(seq).catch((e)=> {
        expect(e instanceof Error).toBe(true);
        done();
      });
    });

    it('rejects the promise when a boolean is passed', (done) => {
      animator.runSequence(true).catch((e)=> {
        expect(e instanceof Error).toBe(true);
        done();
      });
    });

    it('rejects the promise when a number is passed', (done) => {
      animator.runSequence(5).catch((e)=> {
        expect(e instanceof Error).toBe(true);
        done();
      });
    });
  });
});
