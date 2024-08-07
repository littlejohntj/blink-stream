import prisma from './prisma'

// Queries the database to check if we have a streamer registered with the included pubkey
export const streamerExists = async ( pubkey: string ): Promise<boolean> => {

    try {
        await prisma.streamer.findFirstOrThrow(
            {
                where: {
                    pubkey: pubkey.toString()
                }
            }
        )
    } catch {
        return false 
    }

    return true

}