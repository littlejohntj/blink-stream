import { NextResponse } from 'next/server';
import { validateRequestHeadersAndReturnPubkey } from '@/utils/backend/validate-request-headers-and-return-pubkey';
import { findOrCreateStreamer } from '@/utils/backend/find-or-create-streamer';

export async function GET(request: Request) {

    let authorizedStreamerPubkey;

    try {
        authorizedStreamerPubkey = await validateRequestHeadersAndReturnPubkey(request)
    } catch (error) {
        return NextResponse.json({ error: "Bad request. Not authorized." }, { status: 401 })
    }

    let streamerData;

    try {
        streamerData = await findOrCreateStreamer(authorizedStreamerPubkey)
    } catch {
        return NextResponse.json({ error: "Could not fetch or create the user." }, { status: 500 })
    } 

    return NextResponse.json(streamerData);
}

