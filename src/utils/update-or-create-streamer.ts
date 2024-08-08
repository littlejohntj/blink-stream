import prisma from "./prisma"

export const updateOrCreateStreamer = async ( pubkey: string, accessToken: string ) => {

    const maybeStreamer = await prisma.streamer.findFirst({
        where: {
            pubkey: pubkey
        }
    })

    let streamer;

    if ( maybeStreamer == null ) {
        streamer = await prisma.streamer.create({
            data: {
                accessToken: accessToken,
                pubkey: pubkey,
                name: ''
            }
        })
    } else {
        streamer = await prisma.streamer.updateMany({
            where: {
                pubkey: pubkey
            },
            data: {
                accessToken: accessToken
            }
        })
    }

}