import { NextResponse } from 'next/server';
import { streamlabsOAuth, scopes, redirectUri } from '@/utils/streamlabsOAuth';
import { validateAuth } from '@/utils/validate-auth';
import { createAndUpdateAuthCode } from '@/utils/create-and-update-auth-code';
import { ACTIONS_CORS_HEADERS } from '@solana/actions';

export async function GET( request: Request ) {

  const authHeader = request.headers.get('Authorization')

  if ( authHeader == null ) {
      // respond with an error
      return NextResponse.json({ error: 'No auth.' }, { status: 401 });
  }

  let authorizedStreamerPubkey: string
  try {
      authorizedStreamerPubkey = await validateAuth(authHeader)
  } catch {
    // todo: respond with a different redirect      
    return NextResponse.json({ error: "Auth bad" }, { status: 401 });
  }

  // create the one time code for state

  console.log(authorizedStreamerPubkey)
  
  const oneTimeAuthCode = await createAndUpdateAuthCode(authorizedStreamerPubkey)

  // Redirect to Streamlabs authorization
  const authorizationUri = await streamlabsOAuth.authorizationCode.getAuthorizeUri({
    redirectUri,
    scope: scopes,
    state: oneTimeAuthCode
  });

  return NextResponse.json({ code: authorizationUri })
}