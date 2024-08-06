import { OAuth2Client } from '@badgateway/oauth2-client';

export const streamlabsOAuth = new OAuth2Client({
  clientId: process.env.STREAMLABS_CLIENT_ID!,
  clientSecret: process.env.STREAMLABS_CLIENT_SECRET!,
  tokenEndpoint: 'https://streamlabs.com/api/v2.0/token',
  authorizationEndpoint: 'https://streamlabs.com/api/v2.0/authorize',
});

export const scopes = ['alerts.create'];

export const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback/streamlabs`;