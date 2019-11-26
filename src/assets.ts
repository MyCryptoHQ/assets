import { dirname, join } from 'path';
import { promises as fs } from 'fs';
import execa from 'execa';
import { Asset, BASE_ASSETS, OUTPUT_PATH, ParsedAsset } from './constants';
import { isValidAsset, isValidToken, keys } from './utils';
import {
  matchCoinCapId,
  matchCoinGeckoId,
  matchCryptoCompareId,
  matchCryptoCurrencyIcon,
  matchDexAgId
} from './services';

const TOKEN_FILE_PATH = join(__dirname, '../tokens/eth.json');
const ASSET_MATCHERS: Required<
  { [key in keyof ParsedAsset]: (asset: Asset) => Promise<string | null> | string | null }
> = {
  coinCapId: matchCoinCapId,
  coinGeckoId: matchCoinGeckoId,
  cryptoCompareId: matchCryptoCompareId,
  cryptoCurrencyIconName: matchCryptoCurrencyIcon,
  dexAgId: matchDexAgId
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

/**
 * Parse and validate raw asset JSON. Throws an error if the JSON is invalid.
 *
 * @param {string} json
 * @return {Promise<Asset>}
 */
export const parseTokensJson = async (json: string): Promise<Asset[]> => {
  const tokens: Asset[] = JSON.parse(json);

  if (tokens.some(token => !isValidToken(token))) {
    throw new Error('Invalid token JSON scheme');
  }

  return tokens;
};

/**
 * Run `parse-eth-tokens` to fetch Ethereum tokens. Returns parsed assets.
 *
 * @return {Promise<Asset[]>}
 */
export const fetchEthereumTokens = async (): Promise<Asset[]> => {
  await execa('parse-eth-tokens', ['-o', 'tokens']);

  const json = await fs.readFile(TOKEN_FILE_PATH, 'utf8');
  return parseTokensJson(json);
};

/**
 * Get all assets.
 *
 * @return {Promise<Asset[]>}
 */
export const getAssets = async (): Promise<Asset[]> => {
  return [...BASE_ASSETS, ...(await fetchEthereumTokens())];
};

/**
 * Get parsed assets from the disk. If an asset is invalid, it is skipped.
 *
 * @return {Promise<Record<string, ParsedAsset>>}
 */
export const getParsedAssets = async (): Promise<Record<string, ParsedAsset>> => {
  const json = await fs.readFile(OUTPUT_PATH, 'utf8');
  const assets = JSON.parse(json) as Record<string, ParsedAsset>;

  return Object.keys(assets).reduce<Record<string, ParsedAsset>>((object, key) => {
    const asset = assets[key];
    console.log(asset, isValidAsset(asset));
    if (isValidAsset(asset)) {
      object[key] = asset;
    }
    return object;
  }, {});
};

/**
 * Write an object to the disk as a JSON file.
 *
 * @param parsedAssetsObject
 * @return {Promise<void>}
 */
export const writeToDisk = async (parsedAssetsObject: object): Promise<void> => {
  const json = JSON.stringify(parsedAssetsObject, null, 2);

  await fs.mkdir(dirname(OUTPUT_PATH), { recursive: true });
  await fs.writeFile(OUTPUT_PATH, json, 'utf8');
};
