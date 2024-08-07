"use client";
import StreamlabsAuthButton from "@/components/StreamlabsAuthButton";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useEffect, useState } from "react";
 
export default function Address() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [balance, setBalance] = useState<number>(0);
  // code for the `getBalanceEvery10Seconds` and useEffect code here
 
  return (
    <main className="flex min-h-screen flex-col items-center justify-evenly p-24">
      {publicKey ? (
        <div className="flex flex-col gap-4">
          <button className="btn btn-primary">Button</button>
          <div>
            <StreamlabsAuthButton pubkey={`${publicKey}`}  />
          </div>
        </div>
      ) : (
        <h1>Wallet is not connected</h1>
      )}
        <WalletMultiButton style={{}} />
    </main>
  );
}