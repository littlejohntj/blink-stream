import { updateMinimum } from '@/utils/update-minimum';
import { validateAuth } from '@/utils/validate-auth';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {

    const requestUrl = new URL(request.url);
    const minimum = parseFloat(requestUrl.searchParams.get("minimum")!);    
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

    const streamerData = await updateMinimum(minimum, authorizedStreamerPubkey)

    return NextResponse.json(streamerData, { status: 200 });


    
}