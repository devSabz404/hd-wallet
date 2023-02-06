const { default: axios } = require('axios');
const Bitcore = require('bitcore-lib');

// function signTransaction(privateKey, fromAddress, toAddress, amount) {
//   const privateKey = new Bitcore.PrivateKey(privateKey);
//   const from = Bitcore.Address(fromAddress);
//   const to = Bitcore.Address(toAddress);
//   const utxo = getUtxo(fromAddress);
//   const transaction = new Bitcore.Transaction()
//     .from(utxo)
//     .to(toAddress, amount)
//     .change(fromAddress)
//     .sign(privateKey);
//   return transaction;
// }

async function getUtxo(address) {
  const url = `https://api.blockcypher.com/v1/btc/main/addrs/${address}/full`;
  const response = await axios.get(url);
 
  console.log("balance: ",response.data)
  return response.data.txs;
}

getUtxo("1JYm6mWhKgMUM8wftpwqPQGCvtFeHoVRX2")