'use client';

import StreamlabsAuthButton from '@/components/StreamlabsAuthButton';
import { useState, useEffect } from 'react';
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import Address from './address/page';

export default function Home() {
  const { publicKey } = useWallet();
  const { connection } = useConnection();

  useEffect(() => {
    if (publicKey) {
      console.log(publicKey)
    }
  }, [publicKey, connection]);

  return (
    // <main className="flex min-h-screen flex-col items-center justify-between p-24">
    //   <StreamlabsAuthButton />
    // </main>
    <main className="flex items-center justify-center min-h-screen">
      <div className="border hover:border-slate-900 rounded">
        {/* <WalletMultiButton style={{}} /> */}
        <Address />
      </div>
    </main>
  );
}