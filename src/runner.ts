import Listr from 'listr';
import { getAssets, getIds, getParsedAssets, writeToDisk } from './assets';
import { Asset, ParsedAsset } from './constants';
import { isEmpty } from './utils';

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
