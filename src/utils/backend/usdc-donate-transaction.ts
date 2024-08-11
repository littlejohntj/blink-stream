import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { addMemo, findAssociatedTokenPda, getSplTokenProgram, SPL_TOKEN_PROGRAM_ID, transferSol, transferTokensChecked, TransferTokensCheckedInstructionAccounts, TransferTokensCheckedInstructionData } from '@metaplex-foundation/mpl-toolbox'
import { publicKey, PublicKey, Signer, signerIdentity, sol, Transaction, transactionBuilder } from '@metaplex-foundation/umi'
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'

export const donateUsdcTransaction = async ( source: Signer, destination: PublicKey, message: string, name: string, amount: number ): Promise<Transaction> => {

    const umi = createUmi(process.env.RPC_URL!).use(mplTokenMetadata())

    const heliusWebhookPubkey = publicKey(process.env.HELIUS_WEBHOOK_PUBKEY!)

    umi.use(signerIdentity(source));

    const usdcPubkey = publicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v")

    const transferSolBuilder = transferSol(
        umi, {
            source,
            destination,
            amount: sol(0.01)
        }
    )

    const senderAta = findAssociatedTokenPda(umi, 
        {
            mint: usdcPubkey,
            owner: source.publicKey,
            tokenProgramId: SPL_TOKEN_PROGRAM_ID
        }
    )

    const destinationAta = findAssociatedTokenPda(umi, 
        {
            mint: usdcPubkey,
            owner: destination,
            tokenProgramId: SPL_TOKEN_PROGRAM_ID
        }
    )

    const transferTokensIxData: TransferTokensCheckedInstructionData = {
        decimals: 6,
        amount: BigInt( amount * ( 10 ** 6 ) ),
        discriminator: 1
    }

    const transferTokensAccounts: TransferTokensCheckedInstructionAccounts = {
        source: senderAta,
        destination: destinationAta,
        mint: usdcPubkey,
        authority: source
    }

    const transferUsdcBuilder = transferTokensChecked(
        umi, {
            ...transferTokensAccounts,
            ...transferTokensIxData
        }
    )

    const tipDescription = {
        name: name,
        message: message,
        amount: amount,
    }

    const tipDescriptionJsonString = JSON.stringify(tipDescription)

    const memoBuilder = addMemo(umi, {
            memo: tipDescriptionJsonString
        }
    )

    const builder = transactionBuilder().add(transferUsdcBuilder).add(memoBuilder).addRemainingAccounts(
        {
            pubkey: heliusWebhookPubkey, 
            isSigner: false, 
            isWritable: false
        }
    )

    const transferSolTransaction = await builder.buildAndSign(umi)

    return transferSolTransaction

}