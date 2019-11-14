import fetch from 'node-fetch';

/**
 * Helper type to remove the first parameter from a function.
 */
type OmitFirstParameter<Callable> = Callable extends (
  first: any,
  ...args: infer Params
) => infer Result
  ? (...args: Params) => Result
  : never;

/**
 * The response that must be returned from a cached function. The `cache` field will overwrite the existing cache, and
 * the `data` field is returned.
 */
export interface CachedResponse<Cache, Data> {
  cache: Partial<Cache>;
  data: Data;
}

/**
 * This function wraps a function and keeps track of a cache, which is passed as first argument to the function. The
 * wrapped function can simply be called as a normal function.
 *
 * @param {Callable} callable
 * @return {Promise<Data>}
 * @template Callable
 * @template Data
 */
export const withCache = <
  Cache extends object,
  Callable extends (cache: Partial<Cache>, ...args: Params) => Promise<CachedResponse<Cache, Data>>,
  Data,
  Params extends any[] = Parameters<OmitFirstParameter<Callable>>
>(
  callable: Callable
): ((...args: Params) => Promise<Data>) => {
  let cache: Partial<Cache> = {};

  return async (...args: Params): Promise<Data> => {
    const result = await callable(cache, ...args);
    cache = result.cache;
    return result.data;
  };
};

export const getInitialCache = <T>(url: string): Promise<T> => {
  return fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json'
    }
  }).then(response => response.json());
};
