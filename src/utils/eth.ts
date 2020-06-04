import eip55 from 'eip55';

export function ensure0x(hash: string) {
  return hash.startsWith('0x') ? hash : `0x${hash}`;
}

export function checksumEncode(hash: string) {
  return eip55.encode(ensure0x(hash));
}
