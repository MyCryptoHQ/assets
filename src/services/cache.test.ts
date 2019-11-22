import fetch from 'node-fetch';
import { CachedResponse, getInitialCache, withCache } from './cache';

jest.mock('node-fetch');

afterEach(() => {
  jest.clearAllMocks();
});

interface Cache {
  foo?: string;
}

describe('withCache', () => {
  it('wraps an existing function with a cache', async () => {
    const myFunction = jest.fn(
      async (cache: Cache, foo: string): Promise<CachedResponse<Cache, string>> => {
        return {
          cache: {
            foo
          },
          data: foo
        };
      }
    );

    const myCachedFunction = withCache<Cache, typeof myFunction, string>(myFunction);

    await expect(myCachedFunction('bar')).resolves.toBe('bar');
    await expect(myCachedFunction('baz')).resolves.toBe('baz');

    expect(myFunction).toHaveBeenNthCalledWith(1, {}, 'bar');
    expect(myFunction).toHaveBeenNthCalledWith(2, { foo: 'bar' }, 'baz');
  });
});

describe('getInitialCache', () => {
  it('fetches a URL as JSON', async () => {
    await expect(getInitialCache('https://foo')).resolves.toBeUndefined();
    await expect(fetch).toHaveBeenCalledTimes(1);
  });
});
