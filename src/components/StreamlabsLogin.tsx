'use client'

import { useState, useEffect } from 'react';

export default function StreamlabsLogin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if we have an access token
    const accessToken = document.cookie.includes('streamlabs_access_token');
    setIsLoggedIn(accessToken);
  }, []);

  const handleLogin = () => {
    window.location.href = '/api/auth/streamlabs';
  };

  const handleLogout = () => {
    // Clear the cookies and update state
    document.cookie = 'streamlabs_access_token=; Max-Age=0';
    document.cookie = 'streamlabs_refresh_token=; Max-Age=0';
    setIsLoggedIn(false);
  };

  return (
    <div>
      {isLoggedIn ? (
        <button onClick={handleLogout}>Logout from Streamlabs</button>
      ) : (
        <button onClick={handleLogin}>Login with Streamlabs</button>
      )}
    </div>
  );
}