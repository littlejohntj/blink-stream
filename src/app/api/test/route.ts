import { NextResponse } from 'next/server';
import * as bs58 from 'bs58';
import axios from 'axios';
import prisma from '../../../utils/backend/prisma'
import { displayStringForTokenString } from '@/utils/shared/supported-tokens';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { writeFile } from "fs/promises";

export async function GET(request: Request) {

    // const streamer = await prisma.streamer.findFirst()

    // const reponse = await axios.post("https://streamlabs.com/api/v2.0/alerts", {
    //     "type": "donation",
    //     "image_href": "https://1fa77e0b8950.ngrok.app/coin.gif",
    //     "sound_href": ``,
    //     "message": '🤯🤯🤯',
    //     "user_message": `Toly donated 10 USDC`,
    //     "duration": "8000",
    //     "special_text_color": "Blue"      
    // }, {
    //     headers: {
    //             "Authorization": `Bearer ${streamer!.accessToken}`
    //         }
    //     }
    // )

    // const client = new OpenAI({
    //     apiKey: process.env['OPENAI_API_KEY']!, // This is the default and can be omitted
    // });

    // const response = await client.audio.speech.create({
    //     "model": "tts-1",
    //     "voice": "alloy",
    //     "input": "toly said      exploding head emoji   exploding head emoji    exploding head emoji",
    // })

    // const buffer = Buffer.from( await response.arrayBuffer() )    
    //     // // @ts-ignore
    //     const filename = `${Date.now()}.mp3`
    
    //     // console.log(filename)
    
    //     try {
    //         await writeFile(
    //           path.join(process.cwd(), "public/sounds/" + filename),
    //           buffer
    //         );
    //     } catch (error) {
    //         console.log("Error occured ", error);
    //         return NextResponse.json({ Message: "Failed", status: 500 });
    //     }

    return NextResponse.json({ status: 200 });
}