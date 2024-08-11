import { updateMinimum } from '@/utils/backend/update-minimum';
import { validateAuth } from '@/utils/backend/validate-auth';
import { validateRequestHeadersAndReturnPubkey } from '@/utils/backend/validate-request-headers-and-return-pubkey';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {

    const requestUrl = new URL(request.url);

    const minimumString = requestUrl.searchParams.get("minimum")

    if ( minimumString == null ) {
        // bad request
        return NextResponse.json({ error: 'No auth.' }, { status: 401 }); 
    }

    const minimum = parseFloat(minimumString);

    let authorizedStreamerPubkey;

    try {
        authorizedStreamerPubkey = await validateRequestHeadersAndReturnPubkey(request)
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 401 })
    }

    const streamerData = await updateMinimum(minimum, authorizedStreamerPubkey)

    return NextResponse.json(streamerData, { status: 200 });


    
}