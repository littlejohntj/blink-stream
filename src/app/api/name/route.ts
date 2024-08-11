import { updateName } from '@/utils/backend/update-name';
import { validateAuth } from '@/utils/backend/validate-auth';
import { validateRequestHeadersAndReturnPubkey } from '@/utils/backend/validate-request-headers-and-return-pubkey';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {

    const requestUrl = new URL(request.url);
    const name = requestUrl.searchParams.get("name");    

    if ( name == null ) {
        return NextResponse.json({error: "Bad request. Need name query parameter"}, { status: 400 });
    }

    let authorizedStreamerPubkey;

    try {
        authorizedStreamerPubkey = await validateRequestHeadersAndReturnPubkey(request)
    } catch (error) {
        return NextResponse.json({ error: "Bad request. Not authorized." }, { status: 401 })
    }

    let streamerData;

    try {
        streamerData = await updateName(name, authorizedStreamerPubkey)
    } catch {
        return NextResponse.json({ error: "Could not update the name." }, { status: 500 })
    }

    return NextResponse.json(streamerData, { status: 200 });
    
}