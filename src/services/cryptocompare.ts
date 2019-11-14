import { Asset } from '../constants';
import { CachedResponse, getInitialCache, withCache } from './cache';
import { isSimilar } from '../utils';

const CRYPTOCOMPARE_API_ENDPOINT = 'https://min-api.cryptocompare.com/data/all/coinlist';

interface CryptoCompareData {
  Data: {
    [key: string]: {
      Id: string;
      CoinName: string;
      SmartContractAddress: string;
      BuiltOn: string;
    };
  };
}

/**
 * Match an asset with a CryptoCompare ID.
 *
 * @param {Partial<CryptoCompareData>} cache
 * @param {Asset} asset
 * @return {Promise<CachedResponse<CryptoCompareData, string | null>>}
 */
export const matchCryptoCompareId = async (
  cache: Partial<CryptoCompareData>,
  asset: Asset
): Promise<CachedResponse<CryptoCompareData, string | null>> => {
  let data = cache;
  if (!data || !data.Data) {
    data = await getInitialCache<CryptoCompareData>(CRYPTOCOMPARE_API_ENDPOINT);
  }

  if (!data.Data) {
    return {
      cache: data,
      data: null
    };
  }

  // Search based on contract address
  if (asset.address) {
    const item = Object.values(data.Data).find(
      token => token.SmartContractAddress.toLowerCase() === asset.address!.toLowerCase()
    );

    if (item && item.BuiltOn === '7605') {
      return {
        cache: data,
        data: item.Id
      };
    }
  }

  // Search based on name and symbol
  if (data.Data[asset.symbol] && isSimilar(data.Data[asset.symbol].CoinName, asset.name)) {
    return {
      cache: data,
      data: data.Data[asset.symbol].Id
    };
  }

  return {
    cache: data,
    data: null
  };
};

export default withCache<CryptoCompareData, typeof matchCryptoCompareId, string | null>(
  matchCryptoCompareId
);
