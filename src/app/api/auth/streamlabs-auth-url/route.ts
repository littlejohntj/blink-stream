import { NextResponse } from 'next/server';
import { streamlabsOAuth, scopes, redirectUri } from '@/utils/streamlabsOAuth';
import { validateAuth } from '@/utils/backend/validate-auth';
import { createAndUpdateAuthCode } from '@/utils//backend/create-and-update-auth-code';
import { validateRequestHeadersAndReturnPubkey } from '@/utils/backend/validate-request-headers-and-return-pubkey';

export async function GET( request: Request ) {

    let authorizedStreamerPubkey;

    try {
        authorizedStreamerPubkey = await validateRequestHeadersAndReturnPubkey(request)
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 401 })
    }

    let authorizationUri;

    try {
        const oneTimeAuthCode = await createAndUpdateAuthCode(authorizedStreamerPubkey)
        authorizationUri = await streamlabsOAuth.authorizationCode.getAuthorizeUri({
            redirectUri,
            scope: scopes,
            state: oneTimeAuthCode
        });
    } catch {
        return NextResponse.json({ error: "Couldn't start auth process." }, { status: 500 })
    }

    return NextResponse.json({ authUrl: authorizationUri })
    
}