import { isEmpty, isSimilar, isValidAsset, isValidToken, keys } from './utils';
import { ParsedAsset } from './constants';

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

describe('isValildToken', () => {
  it('checks if a token is valid', () => {
    expect(
      isValidToken({
        symbol: 'FOO',
        address: '0x0000000000000000000000000000000000000000',
        decimal: '18',
        name: 'Foo',
        uuid: '6b4dbfa6-8ee7-452f-9ca9-ad9663f50c62'
      })
    ).toBeTruthy();
  });

  it('checks if a token is invalid', () => {
    expect(isValidToken({} as any)).toBeFalsy();

    expect(
      isValidToken({
        symbol: 'FOO',
        decimal: '18',
        name: 'Foo',
        uuid: '6b4dbfa6-8ee7-452f-9ca9-ad9663f50c62'
      })
    ).toBeFalsy();

    expect(
      isValidToken({
        symbol: 'FOO',
        address: '0x0',
        decimal: '18',
        name: 'Foo',
        uuid: '6b4dbfa6-8ee7-452f-9ca9-ad9663f50c62'
      })
    ).toBeFalsy();

    expect(
      isValidToken({
        symbol: 'FOO',
        address: '0x0000000000000000000000000000000000000000',
        decimal: '18',
        name: 'Foo',
        uuid: 'foo-bar'
      })
    ).toBeFalsy();

    expect(
      isValidToken({
        symbol: 'FOO',
        address: '0x0000000000000000000000000000000000000000',
        decimal: '-1',
        name: 'Foo',
        uuid: '6b4dbfa6-8ee7-452f-9ca9-ad9663f50c62'
      })
    ).toBeFalsy();
  });
});

describe('isValidAsset', () => {
  it('checks if an asset is valid', () => {
    expect(
      isValidAsset({
        coinCapId: 'foo',
        coinGeckoId: 'bar',
        cryptoCompareId: 'baz',
        cryptoCurrencyIconName: 'qux'
      })
    ).toBeTruthy();

    expect(isValidAsset({})).toBeTruthy();
  });

  it('checks if an asset is invalid', () => {
    expect(
      isValidAsset({
        coinCapId: 'foo',
        coinGeckoId: 'bar',
        cryptoCompareId: 'baz',
        cryptoCurrencyIconName: 'qux',
        invalid: 'field'
      } as any)
    ).toBeFalsy();
  });
});

describe('keys', () => {
  it('returns the key of an object', () => {
    const object: ParsedAsset = {
      coinCapId: 'foo',
      coinGeckoId: 'bar',
      cryptoCompareId: 'baz',
      cryptoCurrencyIconName: 'qux'
    };

    const objectKeys = keys(object);
    expect(Object.keys(object)).toEqual(objectKeys);
    expect(objectKeys).toMatchSnapshot();
  });

  it('has proper TypeScript types', () => {
    const object: ParsedAsset = {
      coinCapId: 'foo',
      coinGeckoId: 'bar',
      cryptoCompareId: 'baz',
      cryptoCurrencyIconName: 'qux'
    };

    const objectKeys = keys(object);
    expect(object[objectKeys[0]]).toBeTruthy();
    expect(object[objectKeys[1]]).toBeTruthy();
    expect(object[objectKeys[2]]).toBeTruthy();
    expect(object[objectKeys[3]]).toBeTruthy();
  });
});

describe('isEmpty', () => {
  it('checks if an object is empty', () => {
    const object: ParsedAsset = {
      coinCapId: 'foo',
      coinGeckoId: 'bar',
      cryptoCompareId: 'baz',
      cryptoCurrencyIconName: 'qux'
    };

    expect(isEmpty(object)).toBeFalsy();
    expect(isEmpty({})).toBeTruthy();
  });
});
