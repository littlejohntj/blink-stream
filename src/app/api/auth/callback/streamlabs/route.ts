import { NextResponse } from 'next/server';
import { streamlabsOAuth, redirectUri } from '@/utils/streamlabsOAuth';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  

  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 });
  }

  try {
    // Exchange the code for an access token
    const { accessToken, refreshToken } = await streamlabsOAuth.authorizationCode.getToken({
      code,
      redirectUri,
    });

    // At this point, we would want to make an update to the database
    
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    return NextResponse.redirect(`${baseUrl}/`);
  

  } catch (error) {
    console.error('Failed to get token:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 400 });
  }
}