import prisma from "./prisma"

export const createAndUpdateAuthCode = async ( pubkey: string ): Promise<string> => {

    const authSecret = process.env.STREAMLABS_AUTH_SECRET!
    const oneTimeCode = "abcdefg"

    // create the code using the pubkey, the secret, and some kind of random sting
    
    // prisma.streamer.update({
    //     where: {
    //         pubkey: pubkey
    //     }, data: {

    //     }
    // })

    return oneTimeCode

}