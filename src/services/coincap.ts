import { Asset } from '../constants';
import { CachedResponse, getInitialCache, withCache } from './cache';
import { isSimilar } from '../utils';

const COINCAP_API_ENDPOINT = 'https://api.coincap.io/v2/assets';

interface CoinCapCoin {
  id: string;
  symbol: string;
  name: string;
}

interface CoinCapData {
  coins: CoinCapCoin[];
}

/**
 * Match an asset with a CoinCap ID.
 *
 * @param {Partial<CoinCapData>} cache
 * @param {Asset} asset
 * @return {Promise<CachedResponse<CoinCapData, string | null>>}
 */
export const matchCoinCapId = async (
  cache: Partial<CoinCapData>,
  asset: Asset
): Promise<CachedResponse<CoinCapData, string | null>> => {
  const data = cache;
  if (!data || !data.coins) {
    data.coins = (await getInitialCache<{ data: CoinCapCoin[] }>(COINCAP_API_ENDPOINT)).data;
  }

  const match = data.coins.find(coin => coin.symbol === asset.symbol);
  if (match && isSimilar(match.name, asset.name)) {
    return {
      cache: data,
      data: match.id
    };
  }

  return {
    cache: data,
    data: null
  };
};

export default withCache<CoinCapData, typeof matchCoinCapId, string | null>(matchCoinCapId);
