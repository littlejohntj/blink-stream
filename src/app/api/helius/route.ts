import { NextResponse } from 'next/server';
import * as bs58 from 'bs58';
import axios from 'axios';
import prisma from '../../../utils/backend/prisma'
import { displayStringForTokenString } from '@/utils/shared/supported-tokens';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { writeFile } from "fs/promises";

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

    const client = new OpenAI({
        apiKey: process.env['OPENAI_API_KEY']!, // This is the default and can be omitted
    });

    const response = await client.audio.speech.create({
        "model": "tts-1",
        "voice": "alloy",
        "input": tipDescription.message,
    })

    const buffer = Buffer.from( await response.arrayBuffer() )    
        // // @ts-ignore
        const filename = `${Date.now()}.mp3`
    
        // console.log(filename)
    
        try {
            await writeFile(
              path.join(process.cwd(), "public/sounds/" + filename),
              buffer
            );
        } catch (error) {
            console.log("Error occured ", error);
            return NextResponse.json({ Message: "Failed", status: 500 });
        }


    const reponse = await axios.post("https://streamlabs.com/api/v2.0/alerts", {
        "type": "donation",
        "image_href": "",
        "sound_href": `https://ceab3c7cad82.ngrok.app/sounds/${filename}`,
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