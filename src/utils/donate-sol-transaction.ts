import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { transferSol, addMemo, AddMemoInstructionData } from '@metaplex-foundation/mpl-toolbox'
import { PublicKey, publicKey, Signer, signerIdentity, sol, Transaction, transactionBuilder } from '@metaplex-foundation/umi'

export const donateSolTransaction = async (source: Signer, message: string, toPubkey: PublicKey, amount: number, name: string): Promise<Transaction> => {

    const umi = createUmi(process.env.RPC_URL!)

    const heliusWebhookPubkey = publicKey(process.env.HELIUS_WEBHOOK_PUBKEY!)

    // static pubkey for dev

    umi.use(signerIdentity(source));

    const transferSolBuilder = transferSol(
        umi, {
            source,
            destination: toPubkey,
            amount: sol(amount)
        }
    )

    const tipDescription = {
        name: name,
        message: message,
        amount: amount,
        token: 'sol'
    }

    const tipDescriptionJsonString = JSON.stringify(tipDescription)

    const memoBuilder = addMemo(umi, {
            memo: tipDescriptionJsonString
        }
    )

    const builder = transactionBuilder().add(transferSolBuilder).add(memoBuilder).addRemainingAccounts(
        {
            pubkey: heliusWebhookPubkey, 
            isSigner: false, 
            isWritable: false
        }
    )

    const transferSolTransaction = await builder.buildAndSign(umi)

    return transferSolTransaction

}