import { getLocalStorage, removeLocalStorage } from "../local-storage/local-storage"
import { verifySIWS } from "../verify-siws"

export const handleUserSignedInStateAndReturnFinalState = (): boolean => {

    const authString = getLocalStorage("auth")

    if ( authString == null ) {
        return false
    }

    const auth = JSON.parse(authString)

    const authInput = auth.input
    const authOutput = auth.output


    // const verifiedSignedInWithSolana = verifySIWS(authInput, authOutput)

    return true


    // If we couldnt verify thier logic tokens for any reason, remove them and return false
    // if ( verifiedSignedInWithSolana == false ) {
    //     // removeLocalStorage("auth")
    //     return false
    // }

    // return true cause everything was cool
    return true
}

export const handleUserSignOut = () => {
    removeLocalStorage("auth")
}