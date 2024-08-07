"use client";
import StreamlabsAuthButton from "@/components/StreamlabsAuthButton";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useEffect, useState } from "react";
 
export default function Address() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [balance, setBalance] = useState<number>(0);
  // code for the `getBalanceEvery10Seconds` and useEffect code here
 
  function copyBlink() {
    const textToCopy = `http://localhost:3000/donate?to=${publicKey!}&message={message}`;
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        alert("Text copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-evenly p-24">
      {publicKey ? (
        <div className="flex flex-col gap-4">
          <div>
            <StreamlabsAuthButton pubkey={`${publicKey}`}  />
          </div>
          <div>
            <button className="btn btn-primary" onClick={copyBlink}>Copy Blink</button>
          </div>
        </div>
      ) : (
        <h1>Wallet is not connected</h1>
      )}
        <WalletMultiButton style={{}} />
    </main>
  );
}