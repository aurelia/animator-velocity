import { VelocityAnimator } from '../src/animator';
import { animationEvent } from 'aurelia-templating';
import { initialize } from 'aurelia-pal-browser';

jasmine.getFixtures().fixturesPath = 'base/test/fixtures/';

describe('`animate` function', () => {
  let container;
  let animator;
  let elemGroup;
  let elem;

  // -------- SETUP
  beforeAll(() => {
    initialize();
    loadFixtures('animation.html');
    elem = $('#test-animate').eq(0)[0];
    elemGroup = $('.test-animate-group');
    container = $('#animation').eq(0)[0];
    animator = new VelocityAnimator(container);
  });

  beforeEach(() => {
    // stop all animations
    animator.stop(elem, true); // stop all animations

    // clear all styles
    elem.removeAttribute('style');
    for (const el of Array.from(elemGroup)) el.removeAttribute('style');
  });

  // -------- TESTS: Main
  it('returns a promise', () => {
    const result = animator.animate(elem, 'fadeIn');
    expect(result instanceof Promise).toBe(true);
  });

  it('sets isAnimating to true when the animation starts and sets it to false when the animation is done', (done) => {
    expect(animator.isAnimating).toBe(false);
    animator.animate(elem, 'fadeIn').then(() => {
      expect(animator.isAnimating).toBe(false);
      done();
    });
    expect(animator.isAnimating).toBe(true);
  });

  it('works with a custom complete function', (done) => {
    const complete = jasmine.createSpy('complete');
    animator.animate(elem, 'fadeIn', { complete }).then(() => {
      expect(complete).toHaveBeenCalledWith(elem);
      done();
    });
  });

  it('animates an element', (done) => {
    expect(elem.style.opacity).toBe('');
    animator.animate(elem, 'fadeIn', { duration: 100 }).then(() => {
      expect(elem.style.opacity).toBe('1');
      done();
    });

    // check properties half-way through the animation
    setTimeout(() => {
      const opacity = elem.style.opacity;
      expect(opacity > 0 && opacity < 1).toBe(true);
    }, 50);
  });

  it('animates multiple elements in parallel', (done) => {
    const elems = Array.from(elemGroup);
    for (const el of elems) expect(el.style.opacity).toBe('');
    animator.animate(elems, 'fadeIn', { duration: 100 }).then(() => {
      for (const el of elems) expect(el.style.opacity).toBe('1');
      done();
    });

    // check properties half-way through the animation
    setTimeout(() => {
      for (const el of elems) {
        const opacity = el.style.opacity;
        expect(opacity > 0 && opacity < 1).toBe(true);
      }
    }, 50);
  });

  it('publishes an animateBegin and animateDone event', (done) => {
    let animateBeginCalled = false;
    let animateDoneCalled = false;
    const beginListener = document.addEventListener(animationEvent.animateBegin, (payload) => animateBeginCalled = true);
    const doneListener = document.addEventListener(animationEvent.animateDone, () => animateDoneCalled = true);

    animator.animate(elem, 'fadeIn', { duration: 100 }).then(() => {
      expect(animateDoneCalled).toBe(true);
      document.removeEventListener(animationEvent.animateDone, doneListener, false);
      done();
    });

    expect(animateBeginCalled).toBe(true);
    document.removeEventListener(animationEvent.animateBegin, beginListener, false);
  });

  it('does not publish an animateBegin and animateDone event when `silent` is true', (done) => {
    let animateBeginCalled = false;
    let animateDoneCalled = false;
    const beginListener = document.addEventListener(animationEvent.animateBegin, (payload) => animateBeginCalled = true);
    const doneListener = document.addEventListener(animationEvent.animateDone, () => animateDoneCalled = true);

    animator.animate(elem, 'fadeIn', { duration: 100 }, true).then(() => {
      expect(animateDoneCalled).toBe(false);
      document.removeEventListener(animationEvent.animateDone, doneListener, false);
      done();
    });

    expect(animateBeginCalled).toBe(false);
    document.removeEventListener(animationEvent.animateBegin, beginListener, false);
  });

  // -------- TESTS: Argument tests
  it('rejects the promise when nothing is passed', (done) => {
    animator.animate().then(() => done.fail()).catch(e => {
      expect(e instanceof Error).toBe(true);
      done();
    });
  });

  // ---- TESTS: First argument (element)
  it('resolves the promise with a NodeList when first argument is a selector that does not match anything', (done) => {
    animator.animate('element-that-does-not-exist', 'fadeIn').then(result => {
      expect(result instanceof NodeList).toBe(true);
      expect(result.length === 0).toBe(true);
      done();
    }).catch(() => done.fail());
  });

  it('resolves the promise with a NodeList when first argument is a selector that matches elements', (done) => {
    animator.animate('.test-animate-group', 'fadeIn').then(result => {
      expect(result instanceof NodeList).toBe(true);
      expect(result.length).toBe(5);
      for (const el of Array.from(result)) expect(el.style.opacity).toBe('1');
      done();
    }).catch(() => done.fail());
  });

  it('resolves the promise with an Array when first argument is an HTMLElement', (done) => {
    animator.animate(elem, 'fadeIn').then(result => {
      expect(Array.isArray(result)).toBe(true);
      done();
    }).catch(() => done.fail());
  });

  it('resolves the promise with a NodeList when first argument is a NodeList', (done) => {
    const nodeList = container.querySelectorAll('.test-animate-group');
    animator.animate(nodeList, 'fadeIn').then(result => {
      expect(result instanceof NodeList).toBe(true);
      done();
    }).catch(() => done.fail());
  });

  it('resolves the promise with an Array when first argument is an Array', (done) => {
    const array = Array.from(container.querySelectorAll('.group1'));
    animator.animate(array, 'fadeIn').then(result => {
      expect(Array.isArray(result)).toBe(true);
      done();
    }).catch(() => done.fail());
  });

  it('rejects the promise with an Error when first argument is undefined', (done) => {
    animator.animate(undefined, 'fadeIn').then(() => done.fail()).catch(e => {
      expect(e instanceof Error).toBe(true);
      done();
    });
  });

  it('rejects the promise with an Error when first argument is null', (done) => {
    animator.animate(null, 'fadeIn').then(() => done.fail()).catch(e => {
      expect(e instanceof Error).toBe(true);
      done();
    });
  });

  it('rejects the promise with an Error when first argument is a boolean', (done) => {
    animator.animate(null, false).then(() => done.fail()).catch(e => {
      expect(e instanceof Error).toBe(true);
      done();
    });
  });

  it('rejects the promise with an Error when first argument is an integer', (done) => {
    animator.animate(null, 10).then(() => done.fail()).catch(e => {
      expect(e instanceof Error).toBe(true);
      done();
    });
  });

  it('rejects the promise with an Error when first argument is an array', (done) => {
    animator.animate(null, [1]).then(() => done.fail()).catch(e => {
      expect(e instanceof Error).toBe(true);
      done();
    });
  });

  // ---- TESTS: Second argument (name or properties)
  it('resolves the promise with an Array when second argument is an effect name that is registered', (done) => {
    animator.animate(elem, 'fadeIn').then(result => {
      expect(Array.isArray(result)).toBe(true);
      done();
    }).catch(() => done.fail());
  });

  it('resolves the promise with an Array when second argument is an object', (done) => {
    animator.animate(elem, { opacity: 1 }).then(result => {
      expect(Array.isArray(result)).toBe(true);
      done();
    }).catch(() => done.fail());
  });

  it('rejects the promise with an Error when second argument is an effect name that has not been registered', (done) => {
    animator.animate(elem, 'effectThatDoesNotExist').then(() => done.fail()).catch(e => {
      expect(e instanceof Error).toBe(true);
      done();
    });
  });

  it('rejects the promise with an Error when second argument is an empty object', (done) => {
    animator.animate(elem, {}).then(() => done.fail()).catch(e => {
      expect(e instanceof Error).toBe(true);
      done();
    });
  });

  it('rejects the promise with an Error when second argument is omitted', (done) => {
    animator.animate(elem).then(() => done.fail()).catch(e => {
      expect(e instanceof Error).toBe(true);
      done();
    });
  });

  it('rejects the promise with an Error when second argument is undefined', (done) => {
    animator.animate(elem, undefined).then(() => done.fail()).catch(e => {
      expect(e instanceof Error).toBe(true);
      done();
    });
  });

  it('rejects the promise with an Error when second argument is null', (done) => {
    animator.animate(elem, null).then(() => done.fail()).catch(e => {
      expect(e instanceof Error).toBe(true);
      done();
    });
  });

  it('rejects the promise with an Error when second argument is a boolean', (done) => {
    animator.animate(elem, true).then(() => done.fail()).catch(e => {
      expect(e instanceof Error).toBe(true);
      done();
    });
  });

  it('rejects the promise with an Error when second argument is an array', (done) => {
    animator.animate(elem, [1, 2]).then(() => done.fail()).catch(e => {
      expect(e instanceof Error).toBe(true);
      done();
    });
  });

  // ---- TESTS: Third argument (options)
  it('resolves the promise with an Array when third argument is an Object', (done) => {
    animator.animate(elem, { opacity: 1 }, {}).then(result => {
      expect(Array.isArray(result)).toBe(true);
      done();
    }).catch(() => done.fail());
  });

  it('resolves the promise with an Array when third argument is null', (done) => {
    animator.animate(elem, { opacity: 1 }, null).then(result => {
      expect(Array.isArray(result)).toBe(true);
      done();
    }).catch(() => done.fail());
  });

  it('resolves the promise with an Array when third argument is undefined', (done) => {
    animator.animate(elem, { opacity: 1 }, undefined).then(result => {
      expect(Array.isArray(result)).toBe(true);
      done();
    }).catch(() => done.fail());
  });

  it('rejects the promise with an Error when third argument is an array', (done) => {
    animator.animate(elem, { opacity: 1 }, [0]).then(() => done.fail()).catch(e => {
      expect(e instanceof Error).toBe(true);
      done();
    });
  });

  it('rejects the promise with an Error when third argument is a string', (done) => {
    animator.animate(elem, { opacity: 1 }, 'fadeIn').then(() => done.fail()).catch(e => {
      expect(e instanceof Error).toBe(true);
      done();
    });
  });

  it('rejects the promise with an Error when third argument is a number', (done) => {
    animator.animate(elem, { opacity: 1 }, 6).then(() => done.fail()).catch(e => {
      expect(e instanceof Error).toBe(true);
      done();
    });
  });

  it('rejects the promise with an Error when third argument is a boolean', (done) => {
    animator.animate(elem, { opacity: 1 }, true).catch(e => {
      expect(e instanceof Error).toBe(true);
      done();
    });
  });

  // ---- TESTS: Fourth argument (silent)
  it('resolves the promise with an Array when fourth argument is a boolean', (done) => {
    animator.animate(elem, { opacity: 1 }, {}, undefined).then(result => {
      expect(Array.isArray(result)).toBe(true);
      done();
    }).catch(() => done.fail());
  });

  it('resolves the promise with an Array when fourth argument is undefined', (done) => {
    animator.animate(elem, { opacity: 1 }, {}, undefined).then(result => {
      expect(Array.isArray(result)).toBe(true);
      done();
    }).catch(() => done.fail());
  });
});
