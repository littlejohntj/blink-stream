'use client'

import React from 'react';

const StreamlabsAuthButton: React.FC<{ pubkey: string, authorized: boolean }> = ({ pubkey, authorized }) => {
  const handleAuth = () => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const redirectUrl = `${baseUrl}/api/auth/callback/streamlabs`
    const clientId = process.env.STREAMLABS_CLIENT_ID!
    const authUrl = `https://streamlabs.com/api/v2.0/authorize?state=${pubkey}&response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUrl)}&scope=alerts.create`;
    window.location.href = authUrl;
  };

  return (
    <button disabled={authorized} onClick={handleAuth} className="btn btn-primary">
      { authorized ? 'Authorize' : 'Authorize' }
    </button>
  );
};

export default StreamlabsAuthButton;