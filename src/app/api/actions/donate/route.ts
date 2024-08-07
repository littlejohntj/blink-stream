import { NextResponse } from 'next/server';
import { ActionGetResponse, ActionPostRequest, ActionPostResponse, ACTIONS_CORS_HEADERS, createPostResponse, ActionError } from '@solana/actions'
import { createNoopSigner, publicKey, PublicKey } from '@metaplex-foundation/umi';
import { donateSolTransaction } from '@/utils/donate-sol-transaction';
import { toWeb3JsTransaction } from '@metaplex-foundation/umi-web3js-adapters';
import { streamerExists } from '@/utils/streamer-exists';

export async function GET(request: Request) {

    const requestUrl = new URL(request.url);

    const { toPubkey } = validatedQueryParams(requestUrl);

    const baseHref = new URL(
        `/api/actions/donate?to=${toPubkey}`,
        requestUrl.origin,
      ).toString();

    const knownStremer = await streamerExists(toPubkey.toString())

    let iconUrl: string
    let title: string
    let description: string
    let label: string
    let disabled: boolean
    let error: ActionError | undefined

    if ( knownStremer ) {

        iconUrl = new URL("/donate-image.jpg", requestUrl.origin).toString()
        title = "Donate title"
        description = "Donate description"
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
                    label: "Send Message",
                    href: `${baseHref}&message={message}`, // this href will have a text input
                    parameters: [
                        {
                            name: "message", // parameter name in the `href` above
                            label: "What do you want your message to say?", // placeholder of the text input
                            required: true,
                        }
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
    const { amount, message, toPubkey } = validatedQueryParams(requestUrl);

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

    const source = createNoopSigner(account)

    const umiTransaction = await donateSolTransaction(source, message, toPubkey, amount)

    const transaction = toWeb3JsTransaction(umiTransaction)

    const payload: ActionPostResponse = await createPostResponse(
        {
            fields: {
                transaction,
                message: `Sent 0.01 SOL to streamer!`,
            },
        }
    );

    return NextResponse.json(payload, { status: 200, headers: ACTIONS_CORS_HEADERS });
}

export const OPTIONS = GET;

function validatedQueryParams(requestUrl: URL): { toPubkey: PublicKey, amount: number, message: string } {
    let toPubkey: PublicKey;
    let amount: number;
    let message: string;
  
    try {
        toPubkey = publicKey(requestUrl.searchParams.get("to")!)
    } catch (err) {
        throw "Invalid input query parameter: to";
    }
  
    // try {
    //     amount = parseFloat(requestUrl.searchParams.get("amount")!);
    //     if (amount <= 0) throw "amount is too small";
    // } catch (err) {
    //     throw "Invalid input query parameter: amount";
    // }

    try {
        message = requestUrl.searchParams.get("message")!
    } catch (err) {
        throw "Invalid input query parameter: message";
    }
  
    return {
        amount: 1,
        toPubkey,
        message
    };
}