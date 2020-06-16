import Web3 from 'web3';
import config from 'config';

const rpc: string = config.get('RPC.ETH');
const web3 = new Web3(rpc);

export default web3;
