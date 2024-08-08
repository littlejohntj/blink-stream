import prisma from "./prisma"

export const streamerInfo = async ( pubkey: string ): Promise<{ name: string, pubkey: string, minimum: number } | null> => {

    const streamer = await prisma.streamer.findFirst({
        where: {
            pubkey: pubkey
        }
    })

    if ( streamer == null ) {
        return null
    }

    return {
        name: streamer.name,
        pubkey: streamer.pubkey,
        minimum: streamer.minimum
    }
}