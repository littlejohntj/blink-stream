import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { transferSol, addMemo, AddMemoInstructionData } from '@metaplex-foundation/mpl-toolbox'
import { PublicKey, publicKey, Signer, signerIdentity, sol, Transaction, transactionBuilder } from '@metaplex-foundation/umi'

export const donateSolTransaction = async (source: Signer, message: string, toPubkey: PublicKey, amount: number): Promise<Transaction> => {

    const umi = createUmi(process.env.RPC_URL!)

    const heliusWebhookPubkey = publicKey(process.env.HELIUS_WEBHOOK_PUBKEY!)

    // static pubkey for dev
    const destination = publicKey("7AC2ph5Wbe9dArpJALucSdRfcyuYHpxmi97aJA735Sr2")

    umi.use(signerIdentity(source));

    const transferSolBuilder = transferSol(
        umi, {
            source,
            destination,
            amount: sol(0.01)
        }
    )

    const memoBuilder = addMemo(umi, {
            memo: message
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