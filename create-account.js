const bip32 = require('bip32');
const bip39 = require('bip39');
const crypto = require('crypto');
const bitcoin = require('bitcoinjs-lib');
const HDKey = require('hdkey');
const axios = require('axios');
const Bitcore = require('bitcore-lib');


function mPhrase(){
    const entropy = crypto.randomBytes(16).toString('hex');
    const mnemonic = bip39.entropyToMnemonic(entropy);
    return mnemonic
}

function createAccount(mnemonicPhrase, passphrase = '') {
  
  const seed = bip39.mnemonicToSeedSync(mnemonicPhrase, passphrase);

  const root = HDKey.fromMasterSeed(Buffer.from(seed, 'hex'));


  return {
    mnemonicPhrase,
    passphrase,
    rootPrivateKey:root.privateKey.toString('hex'),
    publicKey: root.publicKey.toString('hex'),
  
  };
}

function retrieveAccount(mnemonicPhrase, passphrase = '') {
  const seed = bip39.mnemonicToSeedSync(mnemonicPhrase, passphrase);
  const root = HDKey.fromMasterSeed(Buffer.from(seed, 'hex'));
;




  return {
    mnemonicPhrase,
    passphrase,
    rootPrivateKey: root.privateKey.toString('hex'),
    publicKey: root.publicKey.toString('hex'),
  
  };
}

// const mm = mPhrase();
// console.log(mm)

// const acc = createAccount(mm,"hello");
// console.log(acc)

const retri = retrieveAccount('film laundry crumble spell skirt double improve loan screen survey focus evil','hello')
console.log(retri)

//rootPrivateKey: 'dadee81602fd7cc93b0b9d5633bf7c0442901d76e1675db5c4604e0ddcd29c42'

// const HDKey = require('hdkey');
// const bitcoin = require('bitcoinjs-lib');

// function generateAddress(rootPrivateKey) {
//   const root = HDKey.fromPrivateKey(Buffer.from(rootPrivateKey, 'hex'));
//   const keyPair = bitcoin.ECPair.fromPrivateKey(root.privateKey);
//   const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey });

//   return address;
// }


async function getAddressBalance(address) {
  const url = `https://blockchain.info/q/addressbalance/${address}`;
  const response = await axios.get(url);
  console.log("balance: ",response.data)

  return response.data;
}

getAddressBalance('1JYm6mWhKgMUM8wftpwqPQGCvtFeHoVRX2')



function privateKeyToAddress(pKey) {
    const pK = new Bitcore.PrivateKey(pKey);
    const publicKey = pK.toPublicKey();
    const publicKeyHash = Bitcore.crypto.Hash.sha256ripemd160(publicKey.toBuffer());
    const address = new Bitcore.Address(publicKeyHash, 'livenet').toString();
    return address;
  }

const addy = privateKeyToAddress('dadee81602fd7cc93b0b9d5633bf7c0442901d76e1675db5c4604e0ddcd29c42')
console.log("addy",addy)

