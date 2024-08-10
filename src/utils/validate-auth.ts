// This method should take in the auth string and validate it with how ever we do input/out signing validation
// If it's valid, we should return the pubkey string for the valid auth

import { PublicKey } from "@solana/web3.js"

// If it's not valid, we should throw an error with why
export const validateAuth = async ( authString: string ): Promise<string> => {

    const authToken = authString.split(' ')[1]
    const auth = JSON.parse(authToken)
    const pubkeyBytesDict: [string: number] = auth.output.account.publicKey
    
    var byteArray: number[] = []

    for ( const byteIndex in pubkeyBytesDict ) {
        byteArray.push(pubkeyBytesDict[byteIndex])
    }

    const pubkeyByteArray: Uint8Array = Uint8Array.from(byteArray)

    const pubkey = new PublicKey(pubkeyByteArray)
    return pubkey.toBase58()

}