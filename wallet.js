const express = require('express');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const bip39 = require('bip39');
const ecc = require('tiny-secp256k1')
const { BIP32Factory } = require('bip32')
const bip32 = BIP32Factory(ecc);
const Bitcore = require('bitcore-lib');

// generate seed from mnemonic,the seed is a private key that can be used to access the funds in the wallet
const seeds = async () => {
   
    // console.log(seed.toString('hex'));
    return seed;

}




const app = express();
app.use(bodyParser.json());

// Generate a random seed for the user's wallet
const generateSeed = () => {
  return crypto.randomBytes(32).toString('hex');
};

async function getBalance(address) {
    const balance = await Bitcore.Address(address).getBalance();
    return balance;
  }

app.post('/', (req, res) => {
   
    res.send({"Hello":"high" });
  });
  

// Create a new user account
app.get('/create-account',async (req, res) => {
 // const seed = generateSeed();
  // Store the seed in the database
  // Generate entropy
const entropy = crypto.randomBytes(16).toString('hex');

// Encode entropy as mnemonic words  git
const mnemonic = bip39.entropyToMnemonic(entropy);
console.log(mnemonic);
let seed = await bip39.mnemonicToSeed(mnemonic);
const rootSeed = Buffer.from(seed, 'hex');


const masterKey = bip32.fromSeed(rootSeed);
privateKey = masterKey.toWIF()
publicKey = masterKey.publicKey.toString('hex')

getBalance(publicKey).then(balance => console.log("tthis is balc",balance));
  // ...
  res.send({"private key": privateKey,"seed phrase":mnemonic ,"public key":publicKey});
});

// Send cryptocurrency from the user's wallet
app.post('/send', (req, res) => {
  const { fromAddress, toAddress, amount } = req.body;
  // Implement logic to send the cryptocurrency
  // ...
  res.send({ success: true });
});

// Receive cryptocurrency in the user's wallet
app.post('/receive', (req, res) => {
  const { toAddress, amount } = req.body;
  // Implement logic to receive the cryptocurrency
  // ...
  res.send({ success: true });
});

// Check the user's wallet balance
app.get('/balance', (req, res) => {
  const { address } = req.query;
  // Implement logic to retrieve the wallet balance
  // ...
  res.send({ balance });
});

app.listen(3000, () => {
  console.log('Wallet service listening on port 3000');
});






getBalance('1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2').then(balance => console.log(balance));

const Bitcore = require('bitcore-lib');

async function createTransaction(fromAddress, toAddress, privateKey, amount) {
  const utxo = await Bitcore.Address(fromAddress).getUnspentOutputs();
  const transaction = new Bitcore.Transaction()
    .from(utxo)
    .to(toAddress, amount)
    .change(fromAddress)
    .sign(privateKey);

  return transaction;
}

const fromAddress = '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2';
const toAddress = '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy';
const privateKey = 'cR4q5LxJ23fjdkAiQs8yKU2EuUzC6hTfAWhjC6bbsGDAwDy6hKvB';
const amount = 50000;

createTransaction(fromAddress, toAddress, privateKey, amount).then(transaction => console.log(transaction.toString()));

