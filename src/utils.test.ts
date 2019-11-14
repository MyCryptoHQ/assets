import { isSimilar } from './utils';

describe('isSimilar', () => {
  it('returns true for similar strings', () => {
    expect(isSimilar('Ethereum', 'Ethereum Network')).toBeTruthy();
    expect(isSimilar('Golem', 'Golem Token')).toBeTruthy();
  });

  it('returns false for non-similar strings', () => {
    expect(isSimilar('Ethereum', 'Bitcoin')).toBeFalsy();
    expect(isSimilar('Ethereum Network', 'Golem Network Token')).toBeFalsy();
  });
});
