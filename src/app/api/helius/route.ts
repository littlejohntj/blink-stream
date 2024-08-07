import { NextResponse } from 'next/server';
import * as bs58 from 'bs58';
import axios from 'axios';
import prisma from '../../../utils/prisma'

export async function POST(request: Request) {

    const transactions = await request.json();
    const transaction = transactions[0]
    const instructions = transaction.instructions
    const lastInstruction = instructions[instructions.length - 1]
    const lastInstructionProgramId = lastInstruction.programId
    const lastInstructionData = lastInstruction.data

    const transferInstruction = instructions[instructions.length - 2]

    const streamerPubkey = transferInstruction.accounts[0]

    const streamer = await prisma.streamer.findFirst({
        where: {
            pubkey: streamerPubkey
        }
    })

    const decoded = bs58.default.decode(lastInstructionData);
    const decodedString = Buffer.from(decoded).toString('utf-8');

    const reponse = await axios.post("https://streamlabs.com/api/v2.0/alerts", {
        "type": "donation",
        "image_href": "",
        "sound_href": "",
        "message": decodedString,
        "user_message": "Thanks for the donation :)",
        "duration": "4000",
        "special_text_color": "Blue"      
    }, {
        headers: {
            "Authorization": `Bearer ${streamer!.accessToken}`
            }
        }
    )

    return NextResponse.json({ status: 200 });
}