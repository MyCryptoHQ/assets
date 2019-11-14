import { Asset } from '../constants';
import { CachedResponse, getInitialCache, withCache } from './cache';
import { isSimilar } from '../utils';

const COINGECKO_API_ENDPOINT = 'https://api.coingecko.com/api/v3/coins/list';

interface CoinGeckoCoin {
  id: string;
  symbol: string;
  name: string;
}

interface CoinGeckoData {
  coins: CoinGeckoCoin[];
}

/**
 * Match an asset with a CoinGecko ID.
 *
 * @param {Partial<CoinGeckoData>} cache
 * @param {Asset} asset
 * @return {Promise<CachedResponse<CoinGeckoData, string | null>>}
 */
export const matchCoinkGeckoId = async (
  cache: Partial<CoinGeckoData>,
  asset: Asset
): Promise<CachedResponse<CoinGeckoData, string | null>> => {
  const data = cache;
  if (!data || !data.coins) {
    data.coins = await getInitialCache<CoinGeckoCoin[]>(COINGECKO_API_ENDPOINT);
  }

  const match = data.coins.find(coin => coin.symbol === asset.symbol.toLowerCase());
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

export default withCache<CoinGeckoData, typeof matchCoinkGeckoId, string | null>(matchCoinkGeckoId);
