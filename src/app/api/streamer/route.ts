import { NextResponse } from 'next/server';
import { filterMessage } from '../../../utils/backend/filter-message'
import axios from 'axios';
import { validateAuth } from '@/utils/validate-auth';
import prisma from '@/utils/backend/prisma';
import { StreamerData } from '@/utils/shared/types/streamer-data';

export async function GET(request: Request) {

    const authHeader = request.headers.get('Authorization')

    if ( authHeader == null ) {
        // respond with an error
        return NextResponse.json({ error: 'No auth.' }, { status: 401 });
    }

    let authorizedStreamerPubkey: string
    try {
        authorizedStreamerPubkey = await validateAuth(authHeader)

        console.log(authorizedStreamerPubkey)
    } catch {
        // TODO: Add things for different types of bad auth to instruct the frontend to delete the local storage and sign in again
        return NextResponse.json({ error: "Auth bad" }, { status: 401 });
    }    

    // Now that we have the pubkey we can check the database for it

    let streamer;

    const maybeStreamer = await prisma.streamer.findFirst({
        where: {
            pubkey: authorizedStreamerPubkey
        }
    })

    if ( maybeStreamer == null ) {
        streamer = await prisma.streamer.create({
            data: {
                accessToken: '',
                pubkey: authorizedStreamerPubkey,
                name: '',
                minimum: 0.01,
                authCode: ''
            }
        })
    } else {
        streamer = maybeStreamer
    }

    // Ok at this point we should have an authorized streamer exist
 
    // Now we need to use this to peice together the response object of a streamer
    
    // We can probably use this as a chance to update the database
    // I might wana wait on cooking the database cause it'll break demos until I get this refactor up and going 

    // I want to give something friendly for the frontend to work with

    const streamerData: StreamerData = {
        streamerInfo: {
            name: streamer.name != "" ? streamer.name : null
        },
        donationSettings: {
            minimum: streamer.minimum
        },
        services: {
            authorizedStreamlabs: streamer.accessToken != "" // an empty string would signal no auth at this point
        }
    }

    return NextResponse.json(streamerData);
}

