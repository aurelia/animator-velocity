import {VelocityAnimator} from '../src/animator';

jasmine.getFixtures().fixturesPath = 'base/test/fixtures/';

describe('stop function', () => {
  let animator;
  let container;

  beforeEach(() => {
    let elem = $('#test-simple').eq(0)[0];

    //stop all animations running on the test element
    if (animator) animator.stop(elem, true);

    loadFixtures('animation.html');
    container = $('#animation').eq(0)[0];
    animator = new VelocityAnimator(container);

    let elems = container.querySelectorAll('.group1');

    animator.stop(elem, true);
    animator.stop(elems, true);
  });

  it('returns the animator instance for a fluent api', () => {
    let elem = $('#test-simple').eq(0)[0];
    let result = animator.stop(elem);
    expect(result).toBe(animator);
  });

  it('stops the animation without resetting it', (done) => {
    let elem = $('#test-simple').eq(0)[0];
    animator.animate(elem, 'fadeIn', {duration: 100});

    //the fixture does not have an opacity at the begining
    expect(elem.style.opacity).toBe('');

    //stop the animation halfway through
    setTimeout(()=> {
      //get current opacity value
      let opacity = elem.style.opacity;
      //check if opacity was being animated
      expect(opacity > 0, opacity < 1).toBe(true);
      //stop animation
      animator.stop(elem);
      //check if opacity hasn't been reset or changed because of the stop
      expect(opacity === elem.style.opacity).toBe(true);

      //make sure the animation didn't continue afterwards
      setTimeout(()=> {
        expect(opacity === elem.style.opacity).toBe(true);
        done();
      }, 10);
    }, 50);
  });

  it('stops multiple elements', (done) => {
    let elems = container.querySelectorAll('.group1');
    animator.stop(elems, true);

    expect(elems[0].style.opacity).toBe('');
    animator.animate(elems, 'fadeIn', {duration: 100});

    //stop the animation halfway through
    setTimeout(()=> {
      //get current opacity value
      let opacity0 = elems[0].style.opacity;
      let opacity1 = elems[1].style.opacity;

      //stop animations
      animator.stop(elems);

      //check if opacity was being animated
      expect(opacity0 > 0, opacity0 < 1).toBe(true);
      //check if opacity hasn't been reset or changed because of the stop
      expect(opacity0 === elems[0].style.opacity).toBe(true);

      //check if opacity was being animated
      expect(opacity1 > 0, opacity1 < 1).toBe(true);
      //check if opacity hasn't been reset or changed because of the stop
      expect(opacity1 === elems[0].style.opacity).toBe(true);

      done();
    }, 50);
  });

  it('sets isAnimating to false', () => {
    let elem = $('#test-simple').eq(0)[0];
    animator.animate(elem, 'fadeIn', {duration: 100});
    expect(animator.isAnimating).toBe(true);
    animator.stop(elem);
    expect(animator.isAnimating).toBe(false);
  });
});
