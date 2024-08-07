'use client'

import React from 'react';

const StreamlabsAuthButton: React.FC<{ pubkey: string }> = ({ pubkey }) => {
  const handleAuth = () => {
    const authUrl = `https://streamlabs.com/api/v2.0/authorize?state=${pubkey}&response_type=code&client_id=9cb42312-623d-42a6-9e39-df38a1b823a0&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fcallback%2Fstreamlabs&scope=alerts.create`;
    window.location.href = authUrl;
  };

  return (
    <button onClick={handleAuth} className="btn btn-primary">
      Authorize with Streamlabs
    </button>
  );
};

export default StreamlabsAuthButton;