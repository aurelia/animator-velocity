import {VelocityAnimator} from '../src/animator';
import {animationEvent} from 'aurelia-templating';
import {initialize} from 'aurelia-pal-browser';

jasmine.getFixtures().fixturesPath = 'base/test/fixtures/';

describe('the animate method', () => {
  let elem;
  let animator;
  let container;

  beforeAll(() => initialize());

  beforeEach(() => {
    //stop all animations running on the test element

    loadFixtures('animation.html');
    elem = $('#test-simple').eq(0)[0];
    container = $('#animation').eq(0)[0];
    animator = new VelocityAnimator(container);
  });

  it('returns a promise', () => {
    let result = animator.animate(elem, 'fadeIn');
    expect(result.then).toBeDefined();
  });

  it('sets isAnimating to true when the animation starts and sets it to false when the animation is done', (done) => {
    expect(animator.isAnimating).toBe(false);
    animator.animate(elem, 'fadeIn').then(()=> {
      expect(animator.isAnimating).toBe(false);
      done();
    });
    expect(animator.isAnimating).toBe(true);
  });

  it('works with a custom complete function', (done) => {
    let complete = function() {};
    complete = jasmine.createSpy('complete');
    animator.animate(elem, 'fadeIn', {complete: complete}).then(()=> {
      expect(complete).toHaveBeenCalledWith(elem);
      done();
    });
  });

  it('animates an element', (done) => {
    expect(elem.style.opacity).toBe('');

    animator.animate(elem, 'fadeIn').then(()=> {
      expect(elem.style.opacity).toBe('1');
      done();
    });

    //expect(elem.style.opacity).toBe(0);

    //check the properties halfway through
    setTimeout(()=> {
      //get current opacity value
      let opacity = elem.style.opacity;
      //check if opacity was being animated
      expect(opacity > 0, opacity < 1).toBe(true);
    }, 50);
  });

  it('animates multiple elements in parallel', (done) => {
    let elems = container.querySelectorAll('.group1');

    expect(elems[0].style.opacity).toBe('');

    animator.animate(elems, 'fadeIn').then(()=> {
      expect(elems[0].style.opacity).toBe('1');
      expect(elems[1].style.opacity).toBe('1');
      expect(elems[2].style.opacity).toBe('1');
      expect(elems[3].style.opacity).toBe('1');

      done();
    });

    //check the properties halfway through
    setTimeout(()=> {
      for (let i = 0, l = elems.length; i < l; i++) {
        //get current opacity value
        let opacity = elems[0].style.opacity;
        //check if opacity was being animated
        expect(opacity > 0, opacity < 1).toBe(true);
      }
    }, 50);
  });

  it('publishes an animateBegin and animateDone event', (done) => {
    let animateBeginCalled = false;
    let animateDoneCalled = false;
    let l1 = document.addEventListener(animationEvent.animateBegin, (payload) => animateBeginCalled = true);
    let l2 = document.addEventListener(animationEvent.animateDone, () => animateDoneCalled = true);

    animator.animate(elem, 'fadeIn').then(() => {
      expect(animateDoneCalled).toBe(true);
      document.removeEventListener(animationEvent.animateDone, l2, false);
      done();
    });

    expect(animateBeginCalled).toBe(true);
    document.removeEventListener(animationEvent.animateBegin, l1, false);
  });

  //------------------- Test Various Arguments

  it('rejects the promise when nothing is passed', (done) => {
    animator.animate().catch((e)=> {
      expect(e instanceof Error).toBe(true);
      done();
    });
  });

  // first argument
  it('rejects the promise with an Error when first argument is undefined', (done) => {
    animator.animate(undefined, 'fadeIn').catch((e)=> {
      expect(e instanceof Error).toBe(true);
      done();
    });
  });

  it('rejects the promise with an Error when first argument is null', (done) => {
    animator.animate(null, 'fadeIn').catch((e)=> {
      expect(e instanceof Error).toBe(true);
      done();
    });
  });

  it('rejects the promise with an Error when first argument is a boolean', (done) => {
    animator.animate(null, false).catch((e)=> {
      expect(e instanceof Error).toBe(true);
      done();
    });
  });

  it('rejects the promise with an Error when first argument is an integer', (done) => {
    animator.animate(null, 10).catch((e)=> {
      expect(e instanceof Error).toBe(true);
      done();
    });
  });

  it('rejects the promise with an Error when first argument is an array', (done) => {
    animator.animate(null, [1]).catch((e)=> {
      expect(e instanceof Error).toBe(true);
      done();
    });
  });

  it('resolves the promise with a NodeList when first argument is a selector that doesnt match anything', (done) => {
    animator.animate('test', 'fadeIn').then((result)=> {
      expect(result instanceof NodeList).toBe(true);
      expect(result.length === 0).toBe(true);
      done();
    }).catch((e)=> {
      expect(e instanceof Error).toBe(null);
      done();
    });
  });

  it('resolves the promise with a NodeList when first argument is a selector that matches elements', (done) => {
    animator.animate('.group1', 'fadeIn').then((result)=> {
      expect(result instanceof NodeList).toBe(true);
      expect(result.length > 0).toBe(true);
      for (let i = 0; i < result.length; i++) expect(result[i].style.opacity).toBe('1');
      done();
    }).catch((e)=> {
      expect(e instanceof Error).toBe(null);
      done();
    });
  });

  it('resolves the promise with an Array when first argument is an HTMLElement', (done) => {
    animator.animate(elem, {}).catch((e)=> {
      expect(e instanceof Error).toBe(true);
      done();
    });
  });

  it('resolves the promise with a NodeList when first argument is a NodeList', (done) => {
    animator.animate(container.querySelectorAll('.group1'), 'fadeIn').then(result=> {
      expect(result instanceof NodeList).toBe(true);
      done();
    });
  });

  it('resolves the promise with an Array when first argument is an Array', (done) => {
    let elems = container.querySelectorAll('.group1');
    let els = [];
    for (let i = 0; i < elems.length; i++) {
      els.push(elems[i]);
    }
    animator.animate(els, 'fadeIn').then(result=> {
      expect(Array.isArray(result)).toBe(true);
      done();
    });
  });

  // second argument
  it('resolves the promise with an Array when second argument is an effect name that is registered', (done) => {
    animator.animate(elem, 'fadeIn').then(result=> {
      expect(Array.isArray(result)).toBe(true);
      done();
    });
  });

  it('rejects the promise with an Error when second argument is an effect name that has not been registered', (done) => {
    animator.animate(elem, 'wrongEffectName').catch((e)=> {
      expect(e instanceof Error).toBe(true);
      done();
    });
  });

  it('resolves the promise with an Array when second argument is an object', (done) => {
    animator.animate(elem, {opacity: 1}).then(result=> {
      expect(Array.isArray(result)).toBe(true);
      done();
    });
  });

  it('rejects the promise with an Error when second argument is an empty object', (done) => {
    animator.animate(elem, {}).catch((e)=> {
      expect(e instanceof Error).toBe(true);
      done();
    });
  });

  it('rejects the promise with an Error when second argument is omitted', (done) => {
    animator.animate(elem).catch((e)=> {
      expect(e instanceof Error).toBe(true);
      done();
    });
  });

  it('rejects the promise with an Error when second argument is undefined', (done) => {
    animator.animate(elem, undefined).catch((e)=> {
      expect(e instanceof Error).toBe(true);
      done();
    });
  });

  it('rejects the promise with an Error when second argument is null', (done) => {
    animator.animate(elem, null).catch((e)=> {
      expect(e instanceof Error).toBe(true);
      done();
    });
  });

  it('rejects the promise with an Error when second argument is a boolean', (done) => {
    animator.animate(elem, true).catch((e)=> {
      expect(e instanceof Error).toBe(true);
      done();
    });
  });

  it('rejects the promise with an Error when second argument is an array', (done) => {
    animator.animate(elem, [1, 2]).catch((e)=> {
      expect(e instanceof Error).toBe(true);
      done();
    });
  });

  // third argument
  it('resolves the promise with an Array when third argument is an array', (done) => {
    animator.animate(elem, {opacity: 1}, [0]).then(result=> {
      expect(Array.isArray(result)).toBe(true);
      done();
    });
  });

  it('resolves the promise with an Array when third argument is a string', (done) => {
    animator.animate(elem, {opacity: 1}, 'bla').then(result=> {
      expect(Array.isArray(result)).toBe(true);
      done();
    });
  });
});
