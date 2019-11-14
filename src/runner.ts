import Listr from 'listr';
import { getAssets, writeToDisk } from './assets';
import { Asset, ParsedAsset } from './constants';
import {
  matchCoinCapId,
  matchCoinkGeckoId,
  matchCryptoCompareId,
  matchCryptoCurrencyIcon
} from './services';
import { isEmpty, keys } from './utils';

const ASSET_MATCHERS: Required<
  { [key in keyof ParsedAsset]: (asset: Asset) => Promise<string | null> | string | null }
> = {
  coinCapId: matchCoinCapId,
  coinGeckoId: matchCoinkGeckoId,
  cryptoCompareId: matchCryptoCompareId,
  cryptoCurrencyIconName: matchCryptoCurrencyIcon
};

/**
 * Get all matched IDs for an asset. If an ID could not be found for an asset, the ID field is left out.
 *
 * @param {Asset} asset
 * @return {Promise<ParsedAsset>}
 */
export const getIds = async (asset: Asset): Promise<ParsedAsset> => {
  return keys(ASSET_MATCHERS).reduce<Promise<ParsedAsset>>(async (promise, key) => {
    const id = await ASSET_MATCHERS[key](asset);
    if (id) {
      return {
        ...(await promise),
        [key]: id
      };
    }

    return {
      ...(await promise)
    };
  }, Promise.resolve({}));
};

export interface ParsedAssetsObject {
  [key: string]: ParsedAsset;
}

interface ApplicationContext {
  assets: Asset[];
  parsedAssets: ParsedAssetsObject;
}

/**
 * Runs the application.
 */
export const run = async () => {
  const tasks = new Listr<ApplicationContext>([
    {
      title: 'Fetching assets',
      task: async context => {
        context.assets = await getAssets();
      }
    },
    {
      title: 'Matching assets with services',
      task: async context => {
        context.parsedAssets = await context.assets.reduce<Promise<ParsedAssetsObject>>(
          async (promise, asset, index) => {
            const previous = await promise;
            const ids = await getIds(asset);

            if (!isEmpty(ids)) {
              return {
                ...previous,
                [asset.uuid]: ids
              };
            }

            return {
              ...previous
            };
          },
          Promise.resolve({})
        );
      }
    },
    {
      title: 'Writing output to disk',
      task: context => writeToDisk(context.parsedAssets)
    }
  ]);

  return tasks.run();
};
