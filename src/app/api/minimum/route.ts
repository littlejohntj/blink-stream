import { updateMinimum } from '@/utils/backend/update-minimum';
import { validateAuth } from '@/utils/backend/validate-auth';
import { validateRequestHeadersAndReturnPubkey } from '@/utils/backend/validate-request-headers-and-return-pubkey';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {

    const requestUrl = new URL(request.url);

    const minimumString = requestUrl.searchParams.get("minimum")

    if ( minimumString == null ) {
        return NextResponse.json({ error: 'Bad request. Need minimum query parameter' }, { status: 400 }); 
    }

    const minimum = parseFloat(minimumString);

    let authorizedStreamerPubkey;

    try {
        authorizedStreamerPubkey = await validateRequestHeadersAndReturnPubkey(request)
    } catch (error) {
        return NextResponse.json({ error: "Bad request. Not authorized." }, { status: 401 })
    }

    let streamerData;

    try {
        streamerData = await updateMinimum(minimum, authorizedStreamerPubkey)
    } catch {
        return NextResponse.json({ error: "Could not update the name." }, { status: 500 })
    } 

    return NextResponse.json(streamerData, { status: 200 });
    
}