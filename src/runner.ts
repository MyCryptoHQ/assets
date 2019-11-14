import { getAssets, writeToDisk } from './assets';
import { Asset, ParsedAsset } from './constants';
import {
  matchCoinCapId,
  matchCoinkGeckoId,
  matchCryptoCompareId,
  matchCryptoCurrencyIcon
} from './services';
import { removeEmpty } from './utils';
import Listr from 'listr';

/**
 * Get all matched IDs for an asset.
 *
 * @param {Asset} asset
 * @return {Promise<ParsedAsset>}
 */
export const getIds = async (asset: Asset): Promise<ParsedAsset> => {
  return {
    coinCapId: await matchCoinCapId(asset),
    coinGeckoId: await matchCoinkGeckoId(asset),
    cryptoCompareId: await matchCryptoCompareId(asset),
    cryptoCurrencyIconName: matchCryptoCurrencyIcon(asset)
  };
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
        const parsed = await context.assets.reduce<Promise<ParsedAssetsObject>>(
          async (promise, asset) => {
            return {
              ...(await promise),
              [asset.uuid]: await getIds(asset)
            };
          },
          Promise.resolve({})
        );

        context.parsedAssets = removeEmpty(parsed) as ParsedAssetsObject;
      }
    },
    {
      title: 'Writing output to disk',
      task: context => writeToDisk(context.parsedAssets)
    }
  ]);

  return tasks.run();
};
