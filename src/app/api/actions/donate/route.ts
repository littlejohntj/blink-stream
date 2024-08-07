import { NextResponse } from 'next/server';
import { ActionGetResponse, ActionPostRequest, ActionPostResponse, ACTIONS_CORS_HEADERS, createPostResponse } from '@solana/actions'
import { createNoopSigner, publicKey, PublicKey } from '@metaplex-foundation/umi';
import { donateSolTransaction } from '@/utils/donate-sol-transaction';
import { toWeb3JsTransaction } from '@metaplex-foundation/umi-web3js-adapters';
import prisma from '../../../../utils/prisma'

export async function GET(request: Request) {

    const requestUrl = new URL(request.url);

    const { toPubkey } = validatedQueryParams(requestUrl);

    const baseHref = new URL(
        `/api/actions/donate?to=${toPubkey}`,
        requestUrl.origin,
      ).toString();

      try {
        prisma.streamer.findFirstOrThrow({
            where: {
                pubkey: publicKey.toString()
            }
        })
    } catch {
        // Return error 
    }
    
    const actionGetResponse: ActionGetResponse = {
        icon: new URL("/solana_devs.jpg", requestUrl.origin).toString(),
        title: 'Donate title',
        description: 'Donate description',
        label: 'Button text',
        links: {
            actions: [
                {
                    label: "Message", // button text
                    href: `${baseHref}&message={message}`, // this href will have a text input
                    parameters: [
                      {
                        name: "message", // parameter name in the `href` above
                        label: "What do you want your message to say?", // placeholder of the text input
                        required: true,
                      },
                    ],
                },
            ]
        }
        
    }

    return NextResponse.json(actionGetResponse, { status: 200, headers: ACTIONS_CORS_HEADERS });

}

export async function POST(request: Request) {

    const requestUrl = new URL(request.url);
    const { amount, message, toPubkey } = validatedQueryParams(requestUrl);

    // Add a check that we support the pubkey you're linking to
    try {
        prisma.streamer.findFirstOrThrow({
            where: {
                pubkey: publicKey.toString()
            }
        })
    } catch {
        // Return error 
    }

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