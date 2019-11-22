import { CoinCapData, matchCoinCapId } from './coincap';
import { getInitialCache } from './cache';

const CACHE_DATA = [
  {
    id: 'ethereum',
    symbol: 'ETH',
    name: 'Ethereum'
  }
];

jest.mock('./cache', () => ({
  getInitialCache: jest.fn(async () => ({
    data: CACHE_DATA
  })),

  withCache: jest.requireActual('./cache').withCache
}));

afterEach(() => {
  jest.clearAllMocks();
});

describe('matchCoinCapId', () => {
  it('initializes the cache', async () => {
    const asset = {
      name: 'Ethereum',
      symbol: 'ETH',
      uuid: '356a192b-7913-504c-9457-4d18c28d46e6'
    };

    const { cache } = await matchCoinCapId({}, asset);
    const result = await matchCoinCapId(cache, asset);

    expect(result.cache.coins).toMatchSnapshot();
    expect(getInitialCache).toHaveBeenCalledTimes(1);
  });

  it('fetches the ID of an asset', async () => {
    const asset = {
      name: 'Ethereum',
      symbol: 'ETH',
      uuid: '356a192b-7913-504c-9457-4d18c28d46e6'
    };

    await expect(matchCoinCapId({}, asset)).resolves.toEqual({
      cache: {
        coins: CACHE_DATA
      },
      data: 'ethereum'
    });
  });

  it('returns null if an asset could not be found', async () => {
    const asset = {
      name: 'Ethereum Classic',
      symbol: 'ETC',
      uuid: '6c1e671f-9af5-546d-9c1a-52067bdf0e53'
    };

    await expect(matchCoinCapId({}, asset)).resolves.toEqual({
      cache: {
        coins: CACHE_DATA
      },
      data: null
    });
  });
});
