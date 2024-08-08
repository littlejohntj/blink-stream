import { NextResponse } from 'next/server';
import { ActionGetResponse, ActionPostRequest, ActionPostResponse, ACTIONS_CORS_HEADERS, createPostResponse, ActionError } from '@solana/actions'
import { createNoopSigner, publicKey, PublicKey } from '@metaplex-foundation/umi';
import { donateSolTransaction } from '@/utils/donate-sol-transaction';
import { toWeb3JsTransaction } from '@metaplex-foundation/umi-web3js-adapters';
import { streamerExists } from '@/utils/streamer-exists';
import { truncatePubkey } from '@/utils/truncate-pubkey';
import { donateUsdcTransaction } from '@/utils/usdc-donate-transaction';
import { streamerInfo } from '@/utils/streamer-info';

export async function GET(request: Request) {

    const requestUrl = new URL(request.url);

    const { toPubkey } = validatedQueryParams(requestUrl);

    const baseHref = new URL(
        `/api/actions/donate?to=${toPubkey}`,
        requestUrl.origin,
      ).toString();

    const knownStremer = await streamerExists(toPubkey.toString())
    const streamer = await streamerInfo(toPubkey.toString())

    let iconUrl: string
    let title: string
    let description: string
    let label: string
    let disabled: boolean
    let error: ActionError | undefined

    if ( streamer != null ) {

        iconUrl = new URL(`/api/streamer-image.png?pubkey=${toPubkey.toString()}`, requestUrl.origin).toString()
        title = `Donate to ${streamer.name}`
        description = `Donate to ${streamer.name}'s live stream and have your message be shown on screen.`
        label = "Donate label"
        disabled = false
        error = undefined

    } else {

        // I think we should show some graphic that explains how to set up if we end up in this situation
        iconUrl = new URL("/unknown-streamer-image.jpg", requestUrl.origin).toString()
        title = "Unknown streamer title"
        description = "Unknown streamer description"
        label = "Unknown streamer label"
        disabled = false
        error = {
            message: "Unknown streamer error message"
        }

    }

    const actionGetResponse: ActionGetResponse = {
        icon: iconUrl,
        title: title,
        description: description,
        label: label,
        disabled: disabled,
        links: {
            actions: [
                {
                    label: "Send Tip",
                    href: `${baseHref}&message={message}&amount={amount}&name={name}`,
                    parameters: [
                        {
                            type: "number",
                            name: "amount",
                            label: "Select amount to tip",
                            required: true,
                        },
                        {
                            name: "name",
                            label: "What is your name? ( Optional ) ",
                            required: false,
                            pattern: "^.{0,50}$",
                            patternDescription: "A name must be less than 50 characters long."
                        },
                        {
                            name: "message", // parameter name in the `href` above
                            label: "Send a message with your tip?", 
                            required: true,
                            pattern: "^.{0,199}$",
                            patternDescription: "A message must be less than 200 characters long."
                        },
                    ],
                },
            ]
        },
        error: error
        
    }

    return NextResponse.json(actionGetResponse, { status: 200, headers: ACTIONS_CORS_HEADERS });

}

export async function POST(request: Request) {

    const requestUrl = new URL(request.url);
    const { amount, message, toPubkey, name } = validatedQueryParams(requestUrl);

    const body: ActionPostRequest = await request.json();

    // validate the client provided input
    let account: PublicKey;
    try {
        account = publicKey(body.account);
    } catch (err) {
        return new Response('Invalid "account" provided', {
                status: 400,
                headers: ACTIONS_CORS_HEADERS,
            }
        );
    }

    const senderName = name ?? truncatePubkey(account.toString())

    const source = createNoopSigner(account)

    // const umiTransaction = await donateSolTransaction(source, message, toPubkey, amount, senderName)
    const umiTransaction = await donateUsdcTransaction(source, toPubkey, message, senderName, amount)

    const transaction = toWeb3JsTransaction(umiTransaction)

    const payload: ActionPostResponse = await createPostResponse(
        {
            fields: {
                transaction,
                message: `Sent ${amount} USDC to streamer!`,
            },
        }
    );

    return NextResponse.json(payload, { status: 200, headers: ACTIONS_CORS_HEADERS });
}

export const OPTIONS = GET;

function validatedQueryParams(requestUrl: URL): { toPubkey: PublicKey, amount: number, message: string, name: string | null } {
    let toPubkey: PublicKey;
    let amount: number;
    let message: string;
    let name: string | null;
  
    try {
        toPubkey = publicKey(requestUrl.searchParams.get("to")!)
    } catch (err) {
        throw "Invalid input query parameter: to";
    }
  
    try {
        amount = parseFloat(requestUrl.searchParams.get("amount")!);
        if (amount <= 0) throw "amount is too small";
    } catch (err) {
        throw "Invalid input query parameter: amount";
    }

    try {
        message = requestUrl.searchParams.get("message")!
    } catch (err) {
        throw "Invalid input query parameter: message";
    }

    name = requestUrl.searchParams.get("name")
  
    return {
        amount,
        toPubkey,
        message,
        name
    };
}