import prisma from "./prisma";
import { StreamerData } from "../shared/types/streamer-data";
import { streamerDataFromPrismaStreamer } from "./streamer-data-from-prisma-streamer";

export const updateName = async ( name: string, pubkey: string ): Promise<StreamerData> => {

    const streamer = await prisma.streamer.update({
        where: {
            pubkey: pubkey
        },
        data: {
            name: name
        }
    })

    const streamerData = streamerDataFromPrismaStreamer(streamer)

    return streamerData
    
}