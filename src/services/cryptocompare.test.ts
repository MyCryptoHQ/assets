import { matchCryptoCompareId } from './cryptocompare';
import { getInitialCache } from './cache';

const CACHE_DATA = {
  ETH: {
    Id: '7605',
    Name: 'ETH',
    Symbol: 'ETH',
    CoinName: 'Ethereum'
  },
  GNT: {
    Id: '33022',
    Name: 'GNT',
    Symbol: 'GNT',
    CoinName: 'Golem Network Token',
    BuiltOn: '7605',
    SmartContractAddress: '0xa74476443119A942dE498590Fe1f2454d7D4aC0d'
  },
  FOO: {
    Id: '1337',
    Name: 'Foo',
    Symbol: 'FOO',
    CoinName: 'Foo Token',
    BuiltOn: '1',
    SmartContractAddress: '0x0000000000000000000000000000000000000000'
  }
};

jest.mock('./cache', () => ({
  getInitialCache: jest.fn(async () => ({ Data: CACHE_DATA })),

  withCache: jest.requireActual('./cache').withCache
}));

afterEach(() => {
  jest.clearAllMocks();
});

describe('matchCryptoCompareId', () => {
  it('initializes the cache', async () => {
    const asset = {
      name: 'Ethereum',
      symbol: 'ETH',
      uuid: '356a192b-7913-504c-9457-4d18c28d46e6'
    };

    const { cache } = await matchCryptoCompareId({}, asset);
    const result = await matchCryptoCompareId(cache, asset);

    expect(result.cache.Data).toMatchSnapshot();
    expect(getInitialCache).toHaveBeenCalledTimes(1);
  });

  it('fetches the ID of an asset', async () => {
    const asset = {
      name: 'Ethereum',
      symbol: 'ETH',
      uuid: '356a192b-7913-504c-9457-4d18c28d46e6'
    };

    await expect(matchCryptoCompareId({}, asset)).resolves.toEqual({
      cache: {
        Data: CACHE_DATA
      },
      data: 'ETH'
    });
  });

  it('fetches the ID of a token by address for ERC-20 tokens', async () => {
    const asset = {
      address: '0xa74476443119A942dE498590Fe1f2454d7D4aC0d',
      decimal: '18',
      name: 'Golem',
      symbol: 'GNT',
      uuid: '59a6f871-34bb-5914-86cc-b5f1307bb3b9'
    };

    await expect(matchCryptoCompareId({}, asset)).resolves.toEqual({
      cache: {
        Data: CACHE_DATA
      },
      data: 'GNT'
    });
  });

  it('does not fetch the ID of a token for non-ERC-20 tokens', async () => {
    const asset = {
      address: '0x0000000000000000000000000000000000000000',
      decimal: '18',
      name: 'Bar Token',
      symbol: 'BAR',
      uuid: '5b756932-ed7e-47c1-a8b8-72fb5ec7e229'
    };

    await expect(matchCryptoCompareId({}, asset)).resolves.toEqual({
      cache: {
        Data: CACHE_DATA
      },
      data: null
    });
  });

  it('returns null if an asset could not be found', async () => {
    const asset = {
      name: 'Ethereum Classic',
      symbol: 'ETC',
      uuid: '6c1e671f-9af5-546d-9c1a-52067bdf0e53'
    };

    await expect(matchCryptoCompareId({}, asset)).resolves.toEqual({
      cache: {
        Data: CACHE_DATA
      },
      data: null
    });
  });
});
