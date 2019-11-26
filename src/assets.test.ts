import { promises as fs } from 'fs';
import execa from 'execa';
import {
  fetchEthereumTokens,
  getAssets,
  getIds,
  getParsedAssets,
  parseTokensJson,
  writeToDisk
} from './assets';

jest.mock('fs');
jest.mock('execa');
jest.mock('./services', () => ({
  matchCoinCapId: jest.fn(async () => 'golem-network-tokens'),
  matchCoinGeckoId: jest.fn(async () => 'golem'),
  matchCryptoCompareId: jest.fn(async () => 'GNT'),
  matchCryptoCurrencyIcon: jest.fn(),
  matchDexAgId: jest.fn(async () => 'GNT')
}));

afterEach(() => {
  jest.clearAllMocks();
});

describe('getIds', () => {
  it('gets all (available) service IDs for an asset', async () => {
    const asset = {
      address: '0xa74476443119A942dE498590Fe1f2454d7D4aC0d',
      decimal: '18',
      name: 'Golem',
      symbol: 'GNT',
      uuid: '59a6f871-34bb-5914-86cc-b5f1307bb3b9'
    };

    await expect(getIds(asset, null)).resolves.toMatchSnapshot();
  });

  it('uses existing parsed values if available', async () => {
    const asset = {
      address: '0xa74476443119A942dE498590Fe1f2454d7D4aC0d',
      decimal: '18',
      name: 'Golem',
      symbol: 'GNT',
      uuid: '59a6f871-34bb-5914-86cc-b5f1307bb3b9'
    };

    const parsedAsset = {
      cryptoCurrencyIconName: 'gnt'
    };

    const ids = await getIds(asset, parsedAsset);
    expect(ids).toHaveProperty('cryptoCurrencyIconName', 'gnt');
  });

  it('overwrites existing values if they changed', async () => {
    const asset = {
      address: '0xa74476443119A942dE498590Fe1f2454d7D4aC0d',
      decimal: '18',
      name: 'Golem',
      symbol: 'GNT',
      uuid: '59a6f871-34bb-5914-86cc-b5f1307bb3b9'
    };

    const parsedAsset = {
      coinCapId: 'golem',
      cryptoCurrencyIconName: 'gnt'
    };

    const ids = await getIds(asset, parsedAsset);
    expect(ids).toHaveProperty('coinCapId', 'golem-network-tokens');
  });
});

describe('parseTokensJson', () => {
  it('parses a JSON string to a tokens array', async () => {
    const json = `
      [
        {
          "address": "0xa74476443119A942dE498590Fe1f2454d7D4aC0d",
          "symbol": "GNT",
          "decimal": 18,
          "name": "Golem",
          "uuid": "59a6f871-34bb-5914-86cc-b5f1307bb3b9"
        },
        {
          "address": "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2",
          "symbol": "MKR",
          "decimal": 18,
          "name": "MakerDAO",
          "uuid": "d3230312-cacb-52e6-a849-8bbf6e8142dd"
        }
      ]
    `;

    await expect(parseTokensJson(json)).resolves.toMatchSnapshot();
  });

  it('throws on invalid tokens', async () => {
    const json = `
      [
        {
          "address": "0xa74476443119A942dE498590Fe1f2454d7D4aC0d",
          "symbol": "GNT",
          "decimal": 18,
          "name": "Golem",
          "uuid": "59a6f871-34bb-5914-86cc-b5f1307bb3b9"
        },
        {
          "address": "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2",
          "symbol": "MKR",
          "decimal": -1,
          "name": "MakerDAO",
          "uuid": "d3230312-cacb-52e6-a849-8bbf6e8142dd"
        }
      ]
    `;

    await expect(parseTokensJson(json)).rejects.toThrow();
  });
});

describe('fetchEthereumTokens', () => {
  it('fetches Ethereum tokens from the disk', async () => {
    await expect(fetchEthereumTokens()).resolves.toMatchSnapshot();
    expect(execa).toHaveBeenCalledTimes(1);
    expect(fs.readFile).toHaveBeenCalledTimes(1);
  });
});

describe('getAssets', () => {
  it('fetches all assets', async () => {
    await expect(getAssets()).resolves.toMatchSnapshot();
  });
});

describe('getParsedAssets', () => {
  it('fetches all parsed assets', async () => {
    await expect(getParsedAssets()).resolves.toMatchSnapshot();
  });

  it('removes invalid assets', async () => {
    const assets = await getParsedAssets();
    console.log(assets);
    expect(Object.keys(assets).length).toBe(2);
    expect(Object.values(assets)).not.toContainEqual({
      coinCapId: 'ethereum',
      coinGeckoId: 'ethereum',
      cryptoCompareId: 'ETH',
      cryptoCurrencyIconName: 'eth',
      dexAgId: 'ETH',
      invalid: 'field'
    });
  });
});

describe('writeToDisk', () => {
  it('writes an object to the disk', async () => {
    const assets = [
      {
        address: '0xa74476443119A942dE498590Fe1f2454d7D4aC0d',
        decimal: 18,
        name: 'Golem',
        symbol: 'GNT',
        uuid: '59a6f871-34bb-5914-86cc-b5f1307bb3b9'
      },
      {
        address: '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2',
        decimal: 18,
        name: 'MakerDAO',
        symbol: 'MKR',
        uuid: 'd3230312-cacb-52e6-a849-8bbf6e8142dd'
      }
    ];

    await expect(writeToDisk(assets)).resolves.toBeUndefined();
    expect(fs.writeFile).toHaveBeenCalledTimes(1);
    expect(
      (fs.writeFile as jest.MockedFunction<typeof fs.writeFile>).mock.calls[0][1]
    ).toMatchSnapshot();
  });
});
