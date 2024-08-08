export enum SupportedSplToken {
    BONK = 'bonk',
    JUP = 'jup',
    USDC = 'usdc'
}

export enum SupportedNativeToken {
    SOL = 'sol'
}

export type SupportedToken = SupportedSplToken | SupportedNativeToken

export const tokenMintAddressForSupportedSplToken = ( supportedToken: SupportedSplToken ): string => {
    switch ( supportedToken ) {
        case SupportedSplToken.BONK:
            return 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263'
        case SupportedSplToken.JUP:
            return 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN'
        case SupportedSplToken.USDC:
            return 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
    }
}

export const decimalsForSupportedSplToken = ( supportedToken: SupportedSplToken ): number => {
    switch ( supportedToken ) {
        case SupportedSplToken.BONK:
            return 5
        case SupportedSplToken.JUP:
            return 6
        case SupportedSplToken.USDC:
            return 6
    }
}

export const decimalsForSupportedToken = ( supportedToken: SupportedToken ): number => {
    switch ( supportedToken ) {
        case SupportedSplToken.BONK:
            return 5
        case SupportedSplToken.JUP:
            return 6
        case SupportedSplToken.USDC:
            return 6
        case SupportedNativeToken.SOL:
            return 9
    }
}

export const supportedSplTokenForTokenString = ( tokenString: string ): SupportedSplToken => {
    if ( tokenString == 'bonk' ) {
        return SupportedSplToken.BONK
    } else if ( tokenString == 'jup' ) {
        return SupportedSplToken.JUP
    } else if ( tokenString == 'usdc' ) {
        return SupportedSplToken.USDC
    } else {
        throw new Error("Did not input supported token")
    }
}

export const supportedTokenForTokenString = ( tokenString: string ): SupportedToken => {
    if ( tokenString == 'bonk' ) {
        return SupportedSplToken.BONK
    } else if ( tokenString == 'jup' ) {
        return SupportedSplToken.JUP
    } else if ( tokenString == 'usdc' ) {
        return SupportedSplToken.USDC
    } else if ( tokenString == 'sol' ) {
        return SupportedNativeToken.SOL
    } else {
        throw new Error("Did not input supported token")
    }
}

export const displayStringForTokenString = ( tokenString: string ): string => {
    return `$${tokenString.toUpperCase()}`
}

export const jupTokenIdForSupportedToken= ( supportedToken: SupportedToken ): string => {

    switch ( supportedToken ) {
        case SupportedSplToken.BONK:
            return 'Bonk'
        case SupportedSplToken.JUP:
            return 'JUP'
        case SupportedSplToken.USDC:
            return 'USDC'
        case SupportedNativeToken.SOL:
            return 'SOL'
    }

}