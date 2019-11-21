import Listr from 'listr';
import { getAssets, getParsedAssets, writeToDisk } from './assets';
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
 * @param {ParsedAsset | null} parsedAsset
 * @return {Promise<ParsedAsset>}
 */
export const getIds = async (
  asset: Asset,
  parsedAsset: ParsedAsset | null
): Promise<ParsedAsset> => {
  return keys(ASSET_MATCHERS).reduce<Promise<ParsedAsset>>(async (promise, key) => {
    const id = (await ASSET_MATCHERS[key](asset)) || (parsedAsset && parsedAsset[key]);
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

interface ApplicationContext {
  assets: Asset[];
  parsedAssets: Record<string, ParsedAsset>;
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
        context.parsedAssets = await getParsedAssets();
      }
    },
    {
      title: 'Matching assets with services',
      task: async context => {
        context.parsedAssets = await context.assets.reduce<Promise<Record<string, ParsedAsset>>>(
          async (promise, asset) => {
            const previous = await promise;
            const parsedAsset = previous[asset.uuid];
            const ids = await getIds(asset, parsedAsset);

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
          Promise.resolve(context.parsedAssets)
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
