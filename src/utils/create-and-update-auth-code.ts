import { Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import prisma from "./prisma"
import { createHash } from 'crypto';


export const createAndUpdateAuthCode = async ( pubkey: string ): Promise<string> => {

    const authSecret = process.env.STREAMLABS_AUTH_SECRET!
    const randomPubkeyString = Keypair.generate().publicKey.toBase58()
    const concatenatedString = `${authSecret}|${randomPubkeyString}|${pubkey}`;

    const hash = createHash('sha256')

    hash.update(concatenatedString);

    const oneTimeCode = hash.digest('hex');
    
    await prisma.streamer.update({
        where: {
            pubkey: pubkey
        }, data: {
            authCode: oneTimeCode
        }
    })

    return oneTimeCode

}