import { NextResponse } from 'next/server';
import { streamlabsOAuth, redirectUri } from '@/utils/streamlabsOAuth';
import { updateStreamlabsAccessToken } from '@/utils/backend/update-streamlabs-access-token';
import prisma from '@/utils/backend/prisma';

export async function GET(request: Request) {

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const oneTimeAuthCode = url.searchParams.get('state');
    
    if (!code || !oneTimeAuthCode) {
        // We should probably make a failed to auth with streamlabs thing here
        return NextResponse.redirect(`${baseUrl}/`);
    }

    try {
        // Exchange the code for an access token
        const { accessToken, refreshToken } = await streamlabsOAuth.authorizationCode.getToken({
            code,
            redirectUri,
        });

        const streamer = await prisma.streamer.findFirst({
            where: {
                authCode: oneTimeAuthCode
            }
        })

        if ( streamer == null ) {
            // TODO: Fail
            return NextResponse.redirect(`${baseUrl}/`);
        }

        const pubkey = streamer.pubkey

        await updateStreamlabsAccessToken(pubkey, oneTimeAuthCode, accessToken)
        
        return NextResponse.redirect(`${baseUrl}/`);

    } catch (error) {
        // We should probably make a failed to auth with streamlabs thing here
        return NextResponse.redirect(`${baseUrl}/`);
    }
}