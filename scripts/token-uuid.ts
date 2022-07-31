import getUuidByString from 'uuid-by-string';
import createKeccakHash from 'keccak';

const keccak256 = (buffer: Buffer): Buffer => {
  return Buffer.from(
    createKeccakHash('keccak256')
      .update(buffer)
      .digest('hex'),
    'hex'
  );
};

const toChecksumAddress = (address: string): string => {
  const hash = keccak256(Buffer.from(address, 'utf8')).toString('hex');

  return address.split('').reduce<string>((addressWithChecksum, character, index) => {
    if (parseInt(hash[index], 16) >= 8) {
      return addressWithChecksum + character.toUpperCase();
    }

    return addressWithChecksum + character;
  }, '0x');
};

const showUsage = () => {
  console.log('\nUsage: yarn token-uuid <contractAddress> <chainId>\n');
  process.exit(1);
};

const run = () => {
  const [contractAddress, chainId] = process.argv.slice(2);
  if (!contractAddress || !chainId) {
    return showUsage();
  }

  console.log(getUuidByString(`${chainId}-${toChecksumAddress(contractAddress)}`));
};

run();
