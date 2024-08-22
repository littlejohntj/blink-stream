import { NextResponse } from 'next/server';
import * as bs58 from 'bs58';
import axios from 'axios';
import prisma from '../../../utils/backend/prisma'
import { displayStringForTokenString } from '@/utils/shared/supported-tokens';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { writeFile } from "fs/promises";
import AWS from 'aws-sdk';

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

        const s3 = new AWS.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_REGION, // e.g., 'us-east-1'
        });
    
        const params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: `sounds/${filename}`, // e.g., 'uploads/my-image.jpg'
            Expires: 60 * 5, // URL expiration time in seconds
            ContentType: 'audio/mpeg', // The content type of the file to be uploaded
        };
    
        const url = await s3.getSignedUrlPromise('putObject', params)

        const putResponse = await axios.put(url, buffer, {
            headers: {
                'Content-Type': 'audio/mpeg',
            }
        });

        if (putResponse.status !== 200) {
            console.log("Failed to upload audio to S3");
            return NextResponse.json({ Message: "Failed to upload audio", status: 500 });
        }
    
        // try {
        //     await writeFile(
        //       path.join(process.cwd(), "public/sounds/" + filename),
        //       buffer
        //     );
        // } catch (error) {
        //     console.log("Error occured ", error);
        //     return NextResponse.json({ Message: "Failed", status: 500 });
        // }

          // Write the image file to storage
        // try {
        //     await writeFile(
        //         path.join(process.cwd(), `public/uploads/images/${filename}.png`),
        //         buffer
        //     )
        // } catch (error) {
        //     return NextResponse.json({ Message: "Failed", status: 500 });
        // }


    const reponse = await axios.post("https://streamlabs.com/api/v2.0/alerts", {
        "type": "donation",
        "image_href": "https://blurt.gg/coin.gif",
        "sound_href": `https://blios-data-collection.s3.amazonaws.com/sounds/${filename}`,
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