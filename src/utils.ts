import { compareTwoStrings } from 'string-similarity';
import fromEntries from 'object.fromentries';
import { Asset, TOKEN_ASSET_SCHEMA } from './constants';

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
 * Removes `null` properties from an object.
 *
 * @param {object} object
 * @return {object}
 */
export const removeEmpty = (object: object): object =>
  fromEntries(
    Object.entries(object)
      .filter(([key, value]) => value !== null)
      .map(([key, value]) => (typeof value === 'object' ? [key, removeEmpty(value)] : [key, value]))
  );
