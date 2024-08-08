const solana = require("@solana/web3.js")
console.log(`New Public Key: ${solana.Keypair.generate().publicKey.toBase58()}`)