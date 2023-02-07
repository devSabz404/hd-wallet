const express = require('express');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const bip39 = require('bip39');
const ecc = require('tiny-secp256k1')
const { BIP32Factory } = require('bip32')
//const bip32 = BIP32Factory(ecc);
const Bitcore = require('bitcore-lib');
const bip32 = require('bip32');

const bitcoin = require('bitcoinjs-lib');
const HDKey = require('hdkey');
const axios = require('axios');


const app = express();

async function getUtxo(address) {
    const url = `https://api.blockcypher.com/v1/btc/main/addrs/${address}/full`;
    const response = await axios.get(url);

    console.log("balance: ", response.data)
    return response.data.txs;
}


app.use(bodyParser.json());



app.post('/', (req, res) => {

    res.send({ "Hello": "high" });
});


// Create a new user account
app.get('/create-account', async (req, res) => {
    const { passphrase } = req.body

    const entropy = crypto.randomBytes(16).toString('hex');
    const mnemonic = bip39.entropyToMnemonic(entropy);
    const seed = bip39.mnemonicToSeedSync(mnemonic, passphrase);

    const root = HDKey.fromMasterSeed(Buffer.from(seed, 'hex'));
    const privKey = root.privateKey.toString('hex')
    const pK = new Bitcore.PrivateKey(privKey);
    const publicKey = pK.toPublicKey();
    const publicKeyHash = Bitcore.crypto.Hash.sha256ripemd160(publicKey.toBuffer());
    const address = new Bitcore.Address(publicKeyHash, 'livenet').toString();


    const accountInfo = {
        mnemonic,
        passphrase,
        rootPrivateKey: root.privateKey.toString('hex'),
        publicKey: root.publicKey.toString('hex'),
        address: address

    };


    res.send(accountInfo);
});

// Retrieve wallet crede
app.post('/send', (req, res) => {
    const { mnemonicPhrase, passphrase } = req.body;
    const seed = bip39.mnemonicToSeedSync(mnemonicPhrase, passphrase);


    const root = HDKey.fromMasterSeed(Buffer.from(seed, 'hex'));
    const privKey = root.privateKey.toString('hex')
    const pK = new Bitcore.PrivateKey(privKey);
    const publicKey = pK.toPublicKey();
    const publicKeyHash = Bitcore.crypto.Hash.sha256ripemd160(publicKey.toBuffer());
    const address = new Bitcore.Address(publicKeyHash, 'livenet').toString();


    const accountInfo = {
        mnemonicPhrase,
        passphrase,
        //rootPrivateKey:root.privateKey.toString('hex'),
        //publicKey: root.publicKey.toString('hex'),
        address: address

    };



    res.send({ accountInfo });
});

// Receive cryptocurrency in the user's wallet
app.post('/transfer', (req, res) => {
    const { toAddress, amount } = req.body;

    function signTransaction(privateKey, fromAddress, toAddress, amount) {
        const privateKey = new Bitcore.PrivateKey(privateKey);
        const from = Bitcore.Address(fromAddress);
        const to = Bitcore.Address(toAddress);
        const utxo = getUtxo(fromAddress);
        const transaction = new Bitcore.Transaction()
            .from(utxo)
            .to(toAddress, amount)
            .change(fromAddress)
            .sign(privateKey);
        return transaction;
    }
    getUtxo("1JYm6mWhKgMUM8wftpwqPQGCvtFeHoVRX2")

    res.send({ success: true });
});

// Check the user's wallet balance
app.get('/balance', (req, res) => {
    const { address } = req.query;
    let accountDetails = getUtxo(address)
    res.send({ accountDetails });
});

app.listen(3000, () => {
    console.log('Wallet service listening on port 3000');
});







