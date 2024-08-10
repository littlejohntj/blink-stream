// This method should take in the auth string and validate it with how ever we do input/out signing validation
// If it's valid, we should return the pubkey string for the valid auth

import { PublicKey } from "@solana/web3.js"

// If it's not valid, we should throw an error with why
export const validateAuth = async ( authString: string ): Promise<string> => {

    const authToken = authString.split(' ')[1]
    const auth = JSON.parse(authToken)
    const authOutputAccoutPubkeyData: Uint8Array = Uint8Array.from(auth.output.account.publicKey)
    const fuck: [string: number] = auth.output.account.publicKey
    
    var numarr: number[] = []

    for ( const f in fuck ) {
        numarr.push(fuck[f])
    }

    const numinarr: Uint8Array = Uint8Array.from(numarr)

    console.log(numinarr)

    const pubkey = new PublicKey(numinarr)
    return pubkey.toBase58()

}