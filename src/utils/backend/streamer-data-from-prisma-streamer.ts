import { StreamerData } from "../shared/types/streamer-data";


export const streamerDataFromPrismaStreamer = ( prismaStreamer: {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    pubkey: string;
    accessToken: string;
    name: string;
    minimum: number;
    authCode: string;
}): StreamerData => {

    const streamerData: StreamerData = {
        streamerInfo: {
            name: prismaStreamer.name != "" ? prismaStreamer.name : null
        },
        donationSettings: {
            minimum: prismaStreamer.minimum
        },
        services: {
            authorizedStreamlabs: prismaStreamer.accessToken != "" // an empty string would signal no auth at this point
        }
    }

    return streamerData

}