import getUuidByString from 'uuid-by-string';

const showUsage = () => {
  console.log('\nUsage: yarn token-uuid <contractAddress> <chainId>\n');
  process.exit(1);
};

const run = () => {
  const [contractAddress, chainId] = process.argv.slice(2);
  if (!contractAddress || !chainId) {
    return showUsage();
  }

  console.log(getUuidByString(`${chainId}-${contractAddress}`));
};

run();
