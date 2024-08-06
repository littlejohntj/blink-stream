'use client'

import React from 'react';

const StreamlabsAuthButton: React.FC = () => {
  const handleAuth = () => {
    const authUrl = 'https://streamlabs.com/api/v2.0/authorize?response_type=code&client_id=9cb42312-623d-42a6-9e39-df38a1b823a0&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fcallback%2Fstreamlabs&scope=alerts.create';
    window.location.href = authUrl;
  };

  return (
    <button onClick={handleAuth} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
      Authorize with Streamlabs
    </button>
  );
};

export default StreamlabsAuthButton;