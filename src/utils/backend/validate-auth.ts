// This method should take in the auth string and validate it with how ever we do input/out signing validation
// If it's valid, we should return the pubkey string for the valid auth

import { SolanaSignInInput, SolanaSignInOutput } from "@solana/wallet-standard-features"
import { verifySignIn } from "@solana/wallet-standard-util"
import { Keypair, PublicKey } from "@solana/web3.js"

const byteDictToUint8Array = ( byteDict: [string: number] ): Uint8Array => {

    var byteNumberArray: number[] = []

    for ( const byteIndex in byteDict ) {
        byteNumberArray.push(byteDict[byteIndex])
    }

    const byteArray: Uint8Array = Uint8Array.from(byteNumberArray)

    return byteArray
}

// If it's not valid, we should throw an error with why
export const validateAuth = async ( authString: string ): Promise<string> => {

    const authToken = authString.split(' ')[1]
    const auth = JSON.parse(authToken)

    const pubkeyByteArray = byteDictToUint8Array(auth.output.account.publicKey)

    const pubkey = new PublicKey(pubkeyByteArray)

    const signature = byteDictToUint8Array(auth.output.signature)

    const signedMessage = byteDictToUint8Array(auth.output.signedMessage)

    const serialisedOutput: SolanaSignInOutput = {
        account: {
            address: pubkey.toBase58(),
            publicKey: pubkeyByteArray,
            chains: ["solana:mainnet"],
            features: [
                "solana:signAndSendTransaction",
                "solana:signTransaction",
                "solana:signMessage",
                "solana:signIn"
            ]
        },
        signature: signature,
        signedMessage: signedMessage
    }

    const serialisedInput: SolanaSignInInput = {
        address: pubkey.toBase58()
    }

    const verified = verifySignIn(serialisedInput, serialisedOutput);

    if ( verified == false ) {
        throw new Error("Did not verify")
    }
    
    return pubkey.toBase58()

}