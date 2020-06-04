import * as ethJsUtil from 'ethereumjs-util';
import { ensure0x, checksumEncode } from './eth';

export function verifySignature(
  signature: string,
  message: string,
  address: string
) {
  const msgBuffer = Buffer.from(message);
  const msgHash = ethJsUtil.hashPersonalMessage(msgBuffer);
  const signatureParams = ethJsUtil.fromRpcSig(ensure0x(signature));
  const publicKey = ethJsUtil.ecrecover(
    msgHash,
    signatureParams.v,
    signatureParams.r,
    signatureParams.s
  );
  const addressBuffer = ethJsUtil.publicToAddress(publicKey);
  const addressFromSignature = ethJsUtil.bufferToHex(addressBuffer);

  return checksumEncode(address) === checksumEncode(addressFromSignature);
}

export function verifyTimestampedSignature(
  signature: string,
  expected: string,
  timestamp: number,
  address: string
) {
  const currentTime = Math.floor(new Date().getTime() / 1000);

  if (!verifySignature(signature, expected, address)) {
    throw new Error("Signature doesn't match address");
  }
  if (!(currentTime <= timestamp + 60)) {
    throw new Error('Signature is stale');
  }
  if (!(currentTime >= timestamp - 120)) {
    throw new Error('Timestamp is too far ahead in the future');
  }
  if (!(typeof timestamp === 'number')) {
    throw new Error('Timestamp is not a number');
  }
}
