import prisma from "./prisma";

export const updateMinimum = async ( minimum: number, pubkey: string ) => {

    // I need a way to identify what streamer we need to update via some kind of token, could just pass the pubkey to be easy
    // Letdo it

    await prisma.streamer.updateMany({
        where: {
            pubkey: pubkey
        },
        data: {
            minimum: minimum
        }
    })
}