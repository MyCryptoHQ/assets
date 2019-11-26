import { Asset } from '../constants';
import { CachedResponse, getInitialCache, withCache } from './cache';
import { isSimilar } from '../utils';

const DEXAG_API_ENDPOINT = 'https://api.dex.ag/token-list-full';

interface DexAgCoin {
  symbol: string;
  name: string;
}

interface DexAgData {
  coins: DexAgCoin[];
}

/**
 * Match an asset with a DexAg ID.
 *
 * @param {Partial<DexAgData>} cache
 * @param {Asset} asset
 * @return {Promise<CachedResponse<DexAgData, string | null>>}
 */
export const matchDexAgId = async (
  cache: Partial<DexAgData>,
  asset: Asset
): Promise<CachedResponse<DexAgData, string | null>> => {
  const data = cache;
  if (!data || !data.coins) {
    data.coins = await getInitialCache<DexAgCoin[]>(DEXAG_API_ENDPOINT);
  }

  const match = data.coins.find(coin => coin.symbol.toLowerCase() === asset.symbol.toLowerCase());
  if (match) {
    return {
      cache: data,
      data: match.symbol
    };
  }

  return {
    cache: data,
    data: null
  };
};

export default withCache<DexAgData, typeof matchDexAgId, string | null>(matchDexAgId);
