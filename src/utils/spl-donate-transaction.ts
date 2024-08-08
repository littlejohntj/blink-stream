import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { addMemo, createMintWithAssociatedToken, CreateTokenIfMissingInstructionAccounts, CreateTokenIfMissingInstructionData, findAssociatedTokenPda, getSplTokenProgram, SPL_TOKEN_PROGRAM_ID, transferSol, transferTokensChecked, TransferTokensCheckedInstructionAccounts, TransferTokensCheckedInstructionData } from '@metaplex-foundation/mpl-toolbox'
import { publicKey, PublicKey, Signer, signerIdentity, sol, Transaction, transactionBuilder } from '@metaplex-foundation/umi'
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'
import { decimalsForSupportedSplToken, SupportedSplToken, tokenMintAddressForSupportedSplToken } from './supported-tokens'
import { createTokenIfMissing } from '@metaplex-foundation/mpl-toolbox'

export const donateSplTransaction = async ( source: Signer, destination: PublicKey, message: string, name: string, amount: number, token: SupportedSplToken ): Promise<Transaction> => {

    const umi = createUmi(process.env.RPC_URL!).use(mplTokenMetadata())

    const heliusWebhookPubkey = publicKey(process.env.HELIUS_WEBHOOK_PUBKEY!)

    umi.use(signerIdentity(source));

    const splPubkey = publicKey( tokenMintAddressForSupportedSplToken(token) )

    const senderAta = findAssociatedTokenPda(umi, 
        {
            mint: splPubkey,
            owner: source.publicKey,
            tokenProgramId: SPL_TOKEN_PROGRAM_ID
        }
    )

    const destinationAta = findAssociatedTokenPda(umi, 
        {
            mint: splPubkey,
            owner: destination,
            tokenProgramId: SPL_TOKEN_PROGRAM_ID
        }
    )

    const splDecimals = decimalsForSupportedSplToken(token)

    const transferTokensIxData: TransferTokensCheckedInstructionData = {
        decimals: splDecimals,
        amount: BigInt( amount * ( 10 ** splDecimals ) ),
        discriminator: 1
    }

    const transferTokensAccounts: TransferTokensCheckedInstructionAccounts = {
        source: senderAta,
        destination: destinationAta,
        mint: splPubkey,
        authority: source
    }

    const createTokenAccounts: CreateTokenIfMissingInstructionAccounts = {
        payer: source,
        token: destinationAta,
        mint: splPubkey,
        owner: destination,
        ata: destinationAta
    }

    // const createTokenData: CreateTokenIfMissingInstructionData = {

    // }

    const createTokenIfMissingBuilder = createTokenIfMissing(umi, {
        ...createTokenAccounts
    })

    const transferSplBuilder = transferTokensChecked(
        umi, {
            ...transferTokensAccounts,
            ...transferTokensIxData
        }
    )

    const tipDescription = {
        name: name,
        message: message,
        amount: amount,
        token: token
    }

    const tipDescriptionJsonString = JSON.stringify(tipDescription)

    const memoBuilder = addMemo(umi, {
            memo: tipDescriptionJsonString
        }
    )

    const builder = transactionBuilder().add(createTokenIfMissingBuilder).add(transferSplBuilder).add(memoBuilder).addRemainingAccounts(
        {
            pubkey: heliusWebhookPubkey, 
            isSigner: false, 
            isWritable: false
        }
    )

    const transferSplTransaction = await builder.buildAndSign(umi)

    return transferSplTransaction

}