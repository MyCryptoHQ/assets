import { resolve } from 'path';
import { promises as fs } from 'fs';
import { isValidAsset } from '../src/utils';

const ASSETS_JSON = resolve(__dirname, '../assets/assets.json');

const validate = async () => {
  const json = await fs.readFile(ASSETS_JSON, 'utf8');
  const object = JSON.parse(json);

  const assets = Object.keys(object);
  const invalidAssets = assets.filter(uuid => !isValidAsset(object[uuid]));

  if (invalidAssets.length !== 0) {
    throw new Error(`Assets file has invalid assets: ${invalidAssets.join(', ')}`);
  }
};

validate().catch(error => {
  console.error(error);
  process.exit(1);
});
