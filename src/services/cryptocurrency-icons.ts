import manifest from 'cryptocurrency-icons/manifest.json';
import { Asset } from '../constants';
import { isSimilar } from '../utils';

/**
 * Attempts to find an icon for an asset in the `cryptocurrency-icons` library. Note that the version used in MyCrypto
 * core and the version used here should be the same, to ensure all icons are available. Returns the name of the icon if
 * a match was found, or `null` otherwise.
 *
 * @param {Asset} asset
 * @return {string|null}
 */
const matchCryptoCurrencyIcon = (asset: Asset): string | null => {
  const iconObject = manifest.find(item => item.symbol === asset.symbol);

  if (iconObject && isSimilar(iconObject.name, asset.name)) {
    return iconObject.symbol.toLowerCase();
  }

  return null;
};

export default matchCryptoCurrencyIcon;
