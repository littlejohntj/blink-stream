"use client";

import { fetchSignInData } from "@/components/AppWalletProvider";
import { setLocalStorage } from "@/utils/local-storage/local-storage";
import { handleUserSignedInStateAndReturnFinalState, handleUserSignOut } from "@/utils/user-sign-in/user-sign-in";
import { Adapter, WalletAdapter } from "@solana/wallet-adapter-base";
import { useWallet } from "@solana/wallet-adapter-react";
import { SolanaSignInOutput } from "@solana/wallet-standard-features";
import { PublicKey } from "@solana/web3.js";
import { GoogleViaTipLinkWalletName } from "@tiplink/wallet-adapter";
import { useCallback, useEffect, useState } from "react";

export default function UserPage() {
    // const [previousPublicKey, setPreviousPublicKey] = useState<PublicKey | null>(null);
    const [userSignedInState, setUserSignedInState] = useState<boolean | null>(null)
    // const [previousDisconnectListener, setPreviousDisconnectListner] =
    // useState<null | WalletAdapter>(null);
    const { select, connect, disconnect, wallet, publicKey, connected, connecting } = useWallet()

    useEffect(() => {
        setUserSignedInState(handleUserSignedInStateAndReturnFinalState())
    }, [connected, publicKey])

    // useEffect(() => {
    //     
    // },[])

   // state management for wallet connect and disconnect actions
//   useEffect(() => {
//     if (wallet) {
//       wallet.adapter.addListener("connect", async () => {
        
//         if (wallet.adapter.publicKey) {
//         const authToken = localStorage.getItem("auth")
//             if (!authToken && "signIn" in wallet.adapter){

//                 // @ts-ignore
//         const output : SolanaSignInOutput = await wallet.adapter.signIn(fetchSignInData);
//         const auth = {
//             input: {},
//             output: output
//           }
  
//           const authString = JSON.stringify(auth)
//         setLocalStorage("auth", authString)

//             }
//         }
//         setUserSignedInState(handleUserSignedInStateAndReturnFinalState())
//       });
//       // need to keep track of previous disconnect listeners, and clear them as to not send a notification for each
//       // wallet that was connected at some point
//       if (previousDisconnectListener) {
//         wallet.adapter.removeListener("disconnect");
//       }
//       const disconnectedListener = wallet.adapter.addListener(
//         "disconnect",
//         () => {
//             handleUserSignOut()
//             setUserSignedInState(false)    
//         }
//       );
//       setPreviousDisconnectListner(disconnectedListener);
//     }
//   }, [wallet, previousPublicKey]);

    const signInUserClicked = useCallback(async () => {
        select(GoogleViaTipLinkWalletName)
    }, [select])

    const signOutUserClicked = async () => {
        handleUserSignOut()
        await disconnect()
    }

    return (
        <main>
            {publicKey ? "I HAVE A PK" : "GOOD LORD IT HURTS"}
            { userSignedInState ?
                (
                    <div>
                        <h1>User is signed in</h1> 
                        <button 
                        className="btn btn-primary"
                        onClick={ async () => { await signOutUserClicked() }  }
                        >
                            Sign Out
                        </button>
                    </div>
                )
                :
                (
                    <div>
                        <h1>User is not signed in</h1> 
                        <button 
                        className="btn btn-primary"
                        onClick={ async () => { void signInUserClicked() } }
                        >
                            Sign In
                        </button>
                    </div>
                )

            }
        </main>
    )
}