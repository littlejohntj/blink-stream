import { Adapter, WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { useCallback, useMemo } from "react";
import type {
    SolanaSignInInput,
    SolanaSignInOutput,
  } from "@solana/wallet-standard-features";
  import { verifySignIn } from "@solana/wallet-standard-util";
    import {
    ConnectionProvider,
    WalletProvider,
    } from "@solana/wallet-adapter-react";
import { clusterApiUrl } from "@solana/web3.js";
import { TipLinkWalletAdapter } from "@tiplink/wallet-adapter";

function verifySIWS(
    input: SolanaSignInInput,
    output: SolanaSignInOutput
  ): boolean {
    const serialisedOutput: SolanaSignInOutput = {
      account: {
        ...output.account,
        publicKey: new Uint8Array(output.account.publicKey),
      },
      signature: new Uint8Array(output.signature),
      signedMessage: new Uint8Array(output.signedMessage),
    };
    return verifySignIn(input, serialisedOutput);
  };

const fetchSignInData = async (): Promise<SolanaSignInInput> => {
    return {
        
    }
  };


  

function ReactComponent() {
    const loggedIn = false;
	const autoSignIn = useCallback(
    async (adapter: Adapter) => {
      if (loggedIn) {
        // this requires some managed state on the dApp's side,
        // but it would trigger the default autoconnect
        return true;
      }
      
      // If the signIn feature is not available, again triggers the default
      // autoconnect
      if (!("signIn" in adapter)) return true;

    //   const input = await fetchSignInData()

      // Send the signInInput to the wallet and trigger a sign-in request
      // Note that a function is being passed to `signIn` – this only
      // works for the tiplink wallet adapter. the @ts-ignore annotation 
      // is required
      //
      // @ts-ignore
      const output : SolanaSignInOutput = await adapter.signIn(fetchSignInData);





    //   const success = verifySIWS(input, output);

    //   if (!success) throw new Error("Sign In verification failed!");

      // handle success case below
      
      // ...

      return true;
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
		<WalletProvider
            wallets={wallets}
            // pass autoSignIn as the autoConnect prop where the WalletProvider 
            // component is defined
            autoConnect={autoSignIn} 
        >
        ...
        </WalletProvider>
	)
}