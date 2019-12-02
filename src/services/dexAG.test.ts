import { matchDexAgId } from './dexAG';
import { matchDexAgId as matchDexAgIdWithCache } from './index';
import { getInitialCache } from './cache';

const CACHE_DATA = [{ symbol: 'ETH', name: 'ETH' }];

jest.mock('./cache', () => ({
  getInitialCache: jest.fn(async () => CACHE_DATA),

  withCache: jest.requireActual('./cache').withCache
}));

afterEach(() => {
  jest.clearAllMocks();
});

describe('matchDexAgId', () => {
  it('initializes the cache', async () => {
    const asset = {
      name: 'ETH',
      symbol: 'ETH',
      uuid: '356a192b-7913-504c-9457-4d18c28d46e6'
    };

    const { cache } = await matchDexAgId({}, asset);
    const result = await matchDexAgId(cache, asset);

    expect(result.cache.coins).toMatchSnapshot();
    expect(getInitialCache).toHaveBeenCalledTimes(1);
  });

  it('fetches the ID of an asset', async () => {
    const asset = {
      name: 'ETH',
      symbol: 'ETH',
      uuid: '356a192b-7913-504c-9457-4d18c28d46e6'
    };

    await expect(matchDexAgId({}, asset)).resolves.toEqual({
      cache: {
        coins: CACHE_DATA
      },
      data: 'ETH'
    });
  });

  it('returns null if an asset could not be found', async () => {
    const asset = {
      name: 'Ethereum Classic',
      symbol: 'ETC',
      uuid: '6c1e671f-9af5-546d-9c1a-52067bdf0e53'
    };

    await expect(matchDexAgId({}, asset)).resolves.toEqual({
      cache: {
        coins: CACHE_DATA
      },
      data: null
    });
  });

  it('works with a cache', async () => {
    const asset = {
      name: 'ETH',
      symbol: 'ETH',
      uuid: '356a192b-7913-504c-9457-4d18c28d46e6'
    };

    await expect(matchDexAgIdWithCache(asset)).resolves.toBe('ETH');
  });
});
