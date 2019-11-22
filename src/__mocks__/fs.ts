import { basename } from 'path';

export const promises = {
  mkdir: jest.fn(),

  readFile: jest.fn(
    async (path: string, encoding: string): Promise<string> => {
      const file = basename(path);

      switch (file) {
        case 'eth.json':
          return `
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
        case 'assets.json':
          return `
          {
            "356a192b-7913-504c-9457-4d18c28d46e6": {
              "coinCapId": "ethereum",
              "coinGeckoId": "ethereum",
              "cryptoCompareId": "ETH",
              "cryptoCurrencyIconName": "eth",
              "invalid": "field"
            },
            "59a6f871-34bb-5914-86cc-b5f1307bb3b9": {
              "coinCapId": "golem-network-tokens",
              "coinGeckoId": "golem",
              "cryptoCompareId": "GNT",
              "cryptoCurrencyIconName": "gnt"
            },
            "d3230312-cacb-52e6-a849-8bbf6e8142dd": {
              "coinCapId": "maker",
              "coinGeckoId": "maker",
              "cryptoCompareId": "MKR",
              "cryptoCurrencyIconName": "mkr"
            }
          }
        `;
      }

      throw new Error('File not found');
    }
  ),

  writeFile: jest.fn()
};
