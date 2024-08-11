import prisma from "./backend/prisma"

export const updateStreamlabsAccessToken = async ( oneTimeCode: string, accessToken: string ) => {

    await prisma.streamer.update({
        where: {
            authCode: oneTimeCode
        }, data: {
            accessToken: accessToken
        }
    })

}