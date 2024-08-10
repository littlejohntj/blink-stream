"use client";
 
import React, { useCallback, useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { Adapter, WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl, PublicKey } from "@solana/web3.js";
import { TipLinkWalletAdapter } from "@tiplink/wallet-adapter";
import type {
  SolanaSignInInput,
  SolanaSignInOutput,
} from "@solana/wallet-standard-features";
import { setLocalStorage } from "../utils/local-storage/local-storage";
import { handleUserAuthTokenExistingStateAndReturnFinalState } from "@/utils/user-sign-in/user-sign-in";


// Default styles that can be overridden by your app
require("@solana/wallet-adapter-react-ui/styles.css");

// imports here

export const fetchSignInData = async (): Promise<SolanaSignInInput> => {

  return {
      
  }
  
};

 
export default function AppWalletProvider({
    children,
  }: {
    children: React.ReactNode;
  }) {

    const autoSignIn = useCallback(
      async (adapter: Adapter) => {

        const userAuthTokenExists = handleUserAuthTokenExistingStateAndReturnFinalState()

        if ( userAuthTokenExists ) {
            return true;
        }
        
      //   // If the signIn feature is not available, again triggers the default
      //   // autoconnect
        if (!("signIn" in adapter)) return true;
  
      // //   const input = await fetchSignInData()
  

      //   try {
      //     // Send the signInInput to the wallet and trigger a sign-in request
      //   // Note that a function is being passed to `signIn` – this only
      //   // works for the tiplink wallet adapter. the @ts-ignore annotation 
      //   // is required
      //   //
        // @ts-ignore
          const output : SolanaSignInOutput = await adapter.signIn(fetchSignInData);

          const pkArray = new Uint8Array(output.account.publicKey)

          const pk = new PublicKey(pkArray)

          console.log("TIPPY FUCK UR GIRL")
          console.log(pk.toBase58())

          const oap = output.account.publicKey

          const oapPk = new PublicKey(oap)



          console.log(oapPk.toBase58())

          // const fuckMe = output.account.address

          const serialisedOutput: SolanaSignInOutput = {
            account: {
                ...output.account,
                publicKey: pkArray,
            },
            signature: new Uint8Array(output.signature),
            signedMessage: new Uint8Array(output.signedMessage),
        };

          const auth = {
              input: {
                'help': 'me'
              },
              output: serialisedOutput
          }
          
          const authString = JSON.stringify(auth)

          setLocalStorage("auth", authString)

          return true
      
      },
      []
    );
    
    const network = WalletAdapterNetwork.Mainnet;
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);
    const wallets = useMemo(
      () => [
        // manually add any legacy wallet adapters here
        // new UnsafeBurnerWalletAdapter(),
        new TipLinkWalletAdapter({ 
          title: "Name of Dapp", 
          clientId: "d74d8e41-ccd0-4d74-99e6-b430c5f83e75",
          theme: "dark"  // pick between "dark"/"light"/"system"
        }),
      ],
      [network],
    );
   
    return (
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect={autoSignIn}>
          <WalletModalProvider>{children}</WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    );
  }