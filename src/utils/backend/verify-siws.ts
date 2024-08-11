import { SolanaSignInInput, SolanaSignInOutput } from "@solana/wallet-standard-features";
import { verifySignIn } from "@solana/wallet-standard-util";

export const verifySIWS = (
        input: SolanaSignInInput,
        output: SolanaSignInOutput
    ): boolean => {

        // add in more properties here as we add them later
        var inputCopy: SolanaSignInInput = {
            address: output.account.address
        }

        const serialisedOutput: SolanaSignInOutput = {
            account: {
                ...output.account,
                publicKey: new Uint8Array(output.account.publicKey),
            },
            signature: new Uint8Array(output.signature),
            signedMessage: new Uint8Array(output.signedMessage),
        };

        console.log(serialisedOutput)

        return verifySignIn(inputCopy, serialisedOutput);
};