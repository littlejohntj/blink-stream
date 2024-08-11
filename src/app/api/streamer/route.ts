import { NextResponse } from 'next/server';
import { validateRequestHeadersAndReturnPubkey } from '@/utils/backend/validate-request-headers-and-return-pubkey';
import { findOrCreateStreamer } from '@/utils/backend/find-or-create-streamer';

export async function GET(request: Request) {

    let authorizedStreamerPubkey;

    try {
        authorizedStreamerPubkey = await validateRequestHeadersAndReturnPubkey(request)
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 401 })
    }

    const streamerData = await findOrCreateStreamer(authorizedStreamerPubkey)

    return NextResponse.json(streamerData);
}

