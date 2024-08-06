'use client';

import StreamlabsAuthButton from '@/components/StreamlabsAuthButton';
import { useState, useEffect } from 'react';

export default function Home() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/hello')
      .then(response => response.json())
      .then(data => setMessage(data.message));
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Welcome to My Next.js App</h1>
      <p>Message from API: {message}</p>
      <h1>Welcome to My Streamlabs App</h1>
      <StreamlabsAuthButton />
    </main>
  );
}