import { dirname, join } from 'path';
import { promises as fs } from 'fs';
import execa from 'execa';
import { Asset, BASE_ASSETS, OUTPUT_PATH } from './constants';
import { isValidToken } from './utils';

const TOKEN_FILE_PATH = join(__dirname, '../tokens/eth.json');

/**
 * Parse and validate raw asset JSON. Throws an error if the JSON is invalid.
 *
 * @param {string} json
 * @return {Promise<Asset>}
 */
const parseTokensJson = async (json: string): Promise<Asset[]> => {
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
const fetchEthereumTokens = async (): Promise<Asset[]> => {
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
