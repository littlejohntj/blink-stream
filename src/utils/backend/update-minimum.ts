import prisma from "./prisma";
import { StreamerData } from "../shared/types/streamer-data";
import { streamerDataFromPrismaStreamer } from "./streamer-data-from-prisma-streamer";

export const updateMinimum = async ( minimum: number, pubkey: string ): Promise<StreamerData> => {

    const streamer = await prisma.streamer.update({
        where: {
            pubkey: pubkey
        },
        data: {
            minimum: minimum
        }
    })

    const streamerData = streamerDataFromPrismaStreamer(streamer)


    return streamerData
}