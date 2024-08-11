import { updateName } from '@/utils/backend/update-name';
import { validateAuth } from '@/utils/backend/validate-auth';
import { validateRequestHeadersAndReturnPubkey } from '@/utils/backend/validate-request-headers-and-return-pubkey';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {

    const requestUrl = new URL(request.url);
    const name = requestUrl.searchParams.get("name")!;    
    let authorizedStreamerPubkey;

    try {
        authorizedStreamerPubkey = await validateRequestHeadersAndReturnPubkey(request)
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 401 })
    }
    const streamerData = await updateName(name, authorizedStreamerPubkey)

    return NextResponse.json(streamerData, { status: 200 });
    
}