import { number, object, string } from '@hapi/joi';
import { resolve } from 'path';

export interface Asset {
  name: string;
  symbol: string;
  uuid: string;
  address?: string;
}

export interface ParsedAsset {
  coinCapId: string | null;
  coinGeckoId: string | null;
  cryptoCompareId: string | null;
  cryptoCurrencyIconName: string | null;
}

/**
 * Hardcoded base assets. The UUIDs are generated from the chain ID, e.g. `uuid('1')`.
 */
export const BASE_ASSETS: Asset[] = [
  {
    name: 'Ethereum',
    symbol: 'ETH',
    uuid: '356a192b-7913-504c-9457-4d18c28d46e6'
  },
  {
    name: 'Ethereum Classic',
    symbol: 'ETC',
    uuid: '6c1e671f-9af5-546d-9c1a-52067bdf0e53'
  }
];

/**
 * Token asset validation schema.
 */
export const TOKEN_ASSET_SCHEMA = object({
  symbol: string().required(),
  address: string()
    .regex(/^0x[a-fA-F0-9]{40}$/)
    .required(),
  decimal: number()
    .min(0)
    .required(),
  name: string().required(),
  uuid: string().uuid()
});

/**
 * Parsed asset validation schema.
 */
export const ASSET_SCHEMA = object({
  coinCapId: string().optional(),
  coinGeckoId: string().optional(),
  cryptoCompareId: string().optional(),
  cryptoCurrencyIconName: string().optional()
});

export const OUTPUT_PATH = resolve(__dirname, '../assets/assets.json');
