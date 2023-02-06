const crypto = require('crypto');
const bip39 = require('bip39');
const ecc = require('tiny-secp256k1')
const { BIP32Factory } = require('bip32')
const bip32 = BIP32Factory(ecc);
// Generate entropy
const entropy = crypto.randomBytes(16).toString('hex');

// Encode entropy as mnemonic words  git
const mnemonic = bip39.entropyToMnemonic(entropy);
console.log(mnemonic);
// generate seed from mnemonic,the seed is a private key that can be used to access the funds in the wallet
const seeds = async () => {
    let seed = await bip39.mnemonicToSeed(mnemonic);
    // console.log(seed.toString('hex'));
    return seed;

}

/*
This code uses the bip32 library to generate a master key from a root seed.
 The root seed is a private key that is used to generate the master key,
  which can be used to generate public keys, private keys,
   and chain codes for a hierarchical deterministic (HD) wallet. 

*/

const master = async () => {
    let derivedSeed = await seeds();

    const rootSeed = Buffer.from(derivedSeed, 'hex');


    const masterKey = bip32.fromSeed(rootSeed);
    console.log("Master private key:", masterKey.toWIF());
    console.log("Master public key:", masterKey.publicKey.toString('hex'));
    console.log("Chain code:", masterKey.chainCode.toString('hex'));

    /* 
    he child key is derived by calling the derivePath method on the master 
    key and passing the desired derivation path as an argument. 
    The derivation path is a string that specifies how the child key 
    should be derived from the parent key. In this example, the derivation path is "m/44'/0'/0'/0/0"
    
    */

    const childKey = masterKey.derivePath("m/44'/0'/0'/0/0");
    console.log("Private child key:", childKey.toWIF());
    console.log("Public child key:", childKey.publicKey.toString('hex'));

}

master()

const bitcoin = require('bitcoinjs-lib');
const crypto = require('crypto');

// Generate a random 32-byte private key
const privateKey = crypto.randomBytes(32);

// Derive the corresponding public key and address
const keyPair = bitcoin.ECPair.fromPrivateKey(privateKey);
const publicKey = keyPair.publicKey;
const address = bitcoin.payments.p2pkh({ pubkey: publicKey }).address;

console.log(`Private key: ${privateKey.toString('hex')}`);
console.log(`Address: ${address}`);

async function spendUTXO(utxo, recipientAddress, amount) {
  // Build a transaction to spend the UTXO
  const tx = new bitcoin.TransactionBuilder();
  tx.addInput(utxo.txid, utxo.vout);
  tx.addOutput(recipientAddress, amount);
  tx.sign(0, keyPair);

  // Broadcast the transaction to the network
  const txHex = tx.build().toHex();
  // You would replace this with code to actually broadcast the transaction
  console.log(`Transaction hex: ${txHex}`);
}

// Example usage
spendUTXO({ txid: 'abc', vout: 0 }, '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2', 1000);



