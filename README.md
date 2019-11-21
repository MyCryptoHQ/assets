# MyCrypto Assets

Asset mappings for CoinCap, CoinGecko, CryptoCompare and CryptoCurrency Icons. The `assets.json` is available through MyCrypto's API [here](https://price.mycryptoapi.com/).

## `assets.json`

The `assets.json` file found in `assets/` consists of a `key -> value` object, where the key is the UUID of an asset, and the value is an object with the following fields:

* `coinCapId` (string)

  The `id` field used in the CoinCap API.
  
* `coinGeckoId` (string)

  The `id` field used in the CoinGecko API.

* `cryptoCompareId` (string)
  
  The `Symbol` field used in the CryptoCompare API.
  
* `cryptoCurrencyIconName` (string)

  The name of the icon in the CryptoCurrency Icon library.

Any of these fields can be `undefined`, in which case no matching asset was found.

The UUID is generated based on [RFC-4122](https://tools.ietf.org/html/rfc4122#section-4.3) name-based UUIDs (v5). For tokens, a combination of the chain ID and token contract is used (`${chainId}-${contractAddress}`). For other assets, only the chain ID is used.

### Supported assets

Currently, the following assets are supported:

* Ethereum
* Ethereum Classic
* ERC-20 tokens on the Ethereum network

## Development

To update the `assets.json` file, simply run:

```
$ yarn build
```

And commit the new file to GitHub. The new file is automatically deployed.
