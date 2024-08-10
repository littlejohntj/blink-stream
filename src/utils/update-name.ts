import prisma from "./prisma";
import { StreamerData } from "./types/streamer-data";

export const updateName = async ( name: string, pubkey: string ): Promise<StreamerData> => {

    const streamer = await prisma.streamer.update({
        where: {
            pubkey: pubkey
        },
        data: {
            name: name
        }
    })

    const streamerData: StreamerData = {
        streamerInfo: {
            name: streamer.name != "" ? streamer.name : null
        },
        donationSettings: {
            minimum: streamer.minimum
        },
        services: {
            authorizedStreamlabs: streamer.accessToken != "" // an empty string would signal no auth at this point
        }
    }

    return streamerData
    
}