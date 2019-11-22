import matchCryptoCurrencyIcon from './cryptocurrency-icons';

describe('matchCryptoCurrencyIcon', () => {
  it('fetches the ID of an asset', () => {
    const asset = {
      name: 'Ethereum',
      symbol: 'ETH',
      uuid: '356a192b-7913-504c-9457-4d18c28d46e6'
    };

    expect(matchCryptoCurrencyIcon(asset)).toBe('eth');
  });

  it('returns null if an asset could not be found', () => {
    const asset = {
      name: 'Foo Coin',
      symbol: 'FOO',
      uuid: '5b756932-ed7e-47c1-a8b8-72fb5ec7e229'
    };

    expect(matchCryptoCurrencyIcon(asset)).toBe(null);
  });
});
