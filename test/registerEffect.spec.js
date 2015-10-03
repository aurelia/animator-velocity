import {VelocityAnimator} from '../src/animator';

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

  describe('registerEffect function', () => {
    beforeEach(() => {
      loadFixtures('animation.html');
      elem = $('#test-simple').eq(0)[0];
      animator.stop(elem, true);
    });

    it('returns the animator instance for a fluent api', () => {
      let result = animator.registerEffect('some-effect', {left: 100});
      expect(result).toBe(animator);
    });

    it('registers a new effect that will be stored in the `effects` property', () => {
      let props = {left: 100};
      animator.registerEffect('newEffect', props);
      expect(animator.effects.newEffect !== undefined).toBe(true);
    });

    it('registers effects that start with a colon as aliases', () => {
      animator.registerEffect(':newEffect', 'fadeIn');
      expect(animator.effects[':newEffect'] !== undefined).toBe(true);

      //expect animation to be resolvable to a real effect name
      expect(animator.resolveEffectAlias(':newEffect') !== undefined).toBe(true);
    });

    //------- arguments

    it('expects the seconds parameter to be a string of when registering aliases', () => {
      expect(function() {
        animator.registerEffect(':testEffect', {left: 100});
      }).toThrow(new Error('second parameter must be a string when registering aliases'));
    });

    it('accepts strings with strange characters as a name', () => {
      let names = [
        'foo-bar',
        'foo_bar',
        'foo_bar!',
        'foo|bar',
        '!@#$%^&*()_+'
      ];
      for (let i = 0, l = names.length; i < l; i++) {
        let n = names[i];
        animator.registerEffect(n, {left: 100});
        expect(animator.effects[n] !== undefined).toBe(true);
      }
    });

    it('throws a TypeError when first aguments is not a string', () => {
      try { animator.registerEffect(null, {left: 100}); } catch (e) { expect(e instanceof TypeError).toBe(true); }
      try { animator.registerEffect(5, {left: 100}); } catch (e) { expect(e instanceof TypeError).toBe(true); }
      try { animator.registerEffect([1, 2], {left: 100}); } catch (e) { expect(e instanceof TypeError).toBe(true); }
      try { animator.registerEffect({}, {left: 100}); } catch (e) { expect(e instanceof TypeError).toBe(true); }
      try { animator.registerEffect(true, {left: 100}); } catch (e) { expect(e instanceof TypeError).toBe(true); }
    });
  });

  describe('unregisterEffect function', () => {
    beforeEach(() => {
      loadFixtures('animation.html');
      elem = $('#test-simple').eq(0)[0];
      animator.stop(elem, true);
    });

    it('returns the animator instance for a fluent api', () => {
      let result = animator.unregisterEffect(elem);
      expect(result).toBe(animator);
    });

    it('unregisters effects', () => {
      animator.registerEffect(':newEffect', 'fadeIn');
      expect(animator.effects.newEffect !== undefined).toBe(true);
      animator.unregisterEffect('newEffect');
      expect(animator.effects.newEffect === undefined).toBe(true);
    });

    it('unregisters aliases', () => {
      animator.registerEffect(':alias', 'fadeIn');
      expect(animator.effects[':alias'] !== undefined).toBe(true);
      animator.unregisterEffect(':alias');
      expect(animator.effects[':alias'] === undefined).toBe(true);
    });
  });
});
