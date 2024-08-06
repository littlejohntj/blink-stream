import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { transferSol, transferTokensChecked, TransferTokensCheckedInstructionAccounts, TransferTokensCheckedInstructionData } from '@metaplex-foundation/mpl-toolbox'
import { lamports, publicKey, PublicKey, Signer, signerIdentity, sol, Transaction, transactionBuilder } from '@metaplex-foundation/umi'

export const usdcDonateTransaction = async ( source: Signer, destination: PublicKey ): Promise<Transaction> => {

    const umi = createUmi(process.env.RPC_URL!)

    const heliusWebhookPubkey = publicKey(process.env.HELIUS_WEBHOOK_PUBKEY!)

    umi.use(signerIdentity(source));

    const transferSolBuilder = transferSol(
        umi, {
            source,
            destination,
            amount: sol(0.01)
        }
    )

    const builder = transactionBuilder().add(transferSolBuilder).addRemainingAccounts(
        {
            pubkey: heliusWebhookPubkey, 
            isSigner: false, 
            isWritable: false
        }
    )

    const transferSolTransaction = await builder.buildAndSign(umi)

    return transferSolTransaction

}