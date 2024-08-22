import prisma from "./prisma"

export const updateStreamlabsAccessToken = async ( pubkey: string, oneTimeCode: string, accessToken: string ) => {

    await prisma.streamer.update({
        where: {
            authCode: oneTimeCode,
            pubkey: pubkey
        }, data: {
            accessToken: accessToken
        }
    })

}