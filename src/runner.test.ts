import { promises as fs } from 'fs';
import { run } from './runner';
import { Asset } from './constants';

jest.mock('fs');
jest.mock('./assets', () => ({
  getAssets: jest.fn(async () => [
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
  ]),

  getParsedAssets: jest.fn(async () => ({
    '356a192b-7913-504c-9457-4d18c28d46e6': {
      coinCapId: 'ethereum'
    }
  })),

  getIds: jest.fn(async (asset: Asset) => {
    switch (asset.uuid) {
      case '356a192b-7913-504c-9457-4d18c28d46e6':
        return {
          coinCapId: 'ethereum',
          coinGeckoId: 'ethereum',
          cryptoCompareId: 'ETH',
          cryptoCurrencyIconName: 'eth'
        };
      case '6c1e671f-9af5-546d-9c1a-52067bdf0e53':
        return {};
    }
  }),

  writeToDisk: jest.fn()
}));

afterEach(() => {
  jest.clearAllMocks();
});

describe('run', () => {
  it('runs the application', async () => {
    const context = await run();
    expect(context.assets).toMatchSnapshot();
    expect(context.parsedAssets).toMatchSnapshot();
  });
});
