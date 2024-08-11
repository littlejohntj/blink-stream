import { StreamerData } from "../shared/types/streamer-data";
import prisma from "./prisma";
import { streamerDataFromPrismaStreamer } from "./streamer-data-from-prisma-streamer";

export const findOrCreateStreamer = async ( pubkey: string ): Promise<StreamerData> => {

    let streamer;

    const maybeStreamer = await prisma.streamer.findFirst({
        where: {
            pubkey: pubkey
        }
    })

    if ( maybeStreamer == null ) {
        streamer = await prisma.streamer.create({
            data: {
                accessToken: '',
                pubkey: pubkey,
                name: '',
                minimum: 0.01,
                authCode: ''
            }
        })
    } else {
        streamer = maybeStreamer
    }

    const streamerData = streamerDataFromPrismaStreamer(streamer)
    
    return streamerData

}