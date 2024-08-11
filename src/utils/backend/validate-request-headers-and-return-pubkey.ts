import { validateAuth } from "./validate-auth"

export const validateRequestHeadersAndReturnPubkey = async (request: Request): Promise<string> => {

    const authHeader = request.headers.get('Authorization')

    if ( authHeader == null ) {
        throw new Error("No auth header presented on request")
    }

    let authorizedStreamerPubkey = await validateAuth(authHeader)

    return authorizedStreamerPubkey

}