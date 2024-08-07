import { NextResponse } from 'next/server';
import * as bs58 from 'bs58';
import axios from 'axios';
import prisma from '../../../utils/prisma'
import { displayStringForTokenString } from '@/utils/supported-tokens';

export async function POST(request: Request) {

    const transactions = await request.json();
    const transaction = transactions[0]
    const instructions = transaction.instructions
    const lastInstruction = instructions[instructions.length - 1]
    const lastInstructionData = lastInstruction.data

    const decoded = bs58.default.decode(lastInstructionData);
    const decodedString = Buffer.from(decoded).toString('utf-8').slice(4);

    const tipDescription = JSON.parse(decodedString) 

    const token = tipDescription.token

    let streamerPubkey;
    console.log(token)

    console.log(transaction)


    // Note, this could get fucked up once we integrate jup swaps
    if ( token == "sol" ) {
        streamerPubkey = transaction.nativeTransfers[0].toUserAccount
    } else {
        streamerPubkey = transaction.tokenTransfers[0].toUserAccount
    }

    const streamer = await prisma.streamer.findFirst({
        where: {
            pubkey: streamerPubkey
        }
    })

    console.log(streamerPubkey)
    console.log(streamer)


    const reponse = await axios.post("https://streamlabs.com/api/v2.0/alerts", {
        "type": "donation",
        "image_href": "",
        "sound_href": "",
        "message": tipDescription.message,
        "user_message": `${tipDescription.name} donated ${tipDescription.amount} ${ displayStringForTokenString(tipDescription.token) }`,
        "duration": "8000",
        "special_text_color": "Blue"      
    }, {
        headers: {
                "Authorization": `Bearer ${streamer!.accessToken}`
            }
        }
    )

    return NextResponse.json({ status: 200 });
}