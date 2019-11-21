import { compareTwoStrings } from 'string-similarity';
import { Asset, ASSET_SCHEMA, ParsedAsset, TOKEN_ASSET_SCHEMA } from './constants';

/**
 * Checks whether two strings are similar to each other, based on the Sørensen–Dice coefficient. Returns `true` if the
 * strings are similar, and `false` otherwise.
 *
 * @param {string} first
 * @param {string} second
 * @return {boolean}
 */
export const isSimilar = (first: string, second: string): boolean => {
  return compareTwoStrings(first, second) >= 0.5;
};

/**
 * Checks if the token is a valid token according to the validation schema.
 *
 * @param {Asset} token
 * @return {boolean}
 */
export const isValidToken = (token: Asset): boolean => {
  return !TOKEN_ASSET_SCHEMA.validate(token).error;
};

/**
 * Checks if the asset is a valid (parsed) asset according to the validation schema.
 *
 * @param {ParsedAsset} asset
 * @return {boolean}
 */
export const isValidAsset = (asset: ParsedAsset): boolean => {
  return !ASSET_SCHEMA.validate(asset).error;
};

/**
 * Get the keys of an object as a strong typed array.
 *
 * @param {Object} object
 * @return {(keyof T)[]}
 * @template T
 */
export const keys = <T>(object: T): (keyof T)[] => {
  return Object.keys(object) as (keyof T)[];
};

/**
 * Checks if an object is empty.
 *
 * @param {object} object
 * @return {boolean}
 */
export const isEmpty = (object: object): boolean => {
  return Object.keys(object).length === 0;
};
