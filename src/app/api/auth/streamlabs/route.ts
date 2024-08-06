import { NextResponse } from 'next/server';
import { streamlabsOAuth, scopes, redirectUri } from '@/utils/streamlabsOAuth';

export async function GET() {
  // Redirect to Streamlabs authorization
  const authorizationUri = await streamlabsOAuth.authorizationCode.getAuthorizeUri({
    redirectUri,
    scope: scopes,
  });

  return NextResponse.redirect(authorizationUri);
}