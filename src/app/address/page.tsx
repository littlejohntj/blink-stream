"use client";
import CopiedBlinkToast from "@/components/toasts/CopiedBlinkToast";
import StreamlabsAuthButton from "@/components/StreamlabsAuthButton";
import { blinkUrl } from "@/utils/blink-url";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import FailedToCopyBlinkToast from "@/components/toasts/FailedToCopyBlinkToast";
import StreamerNameUpdatedToast from "@/components/toasts/StreamerNameUpdatedToast";
import FailedToUpdateStreamerNameToast from "@/components/toasts/FailedToUpdateStreamerNameToast";

export const WalletButton = dynamic( async () => 
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
    { ssr: false },
)

export default function Address() {

    const { publicKey } = useWallet();

    // Toast Alerts
    const [ copiedBlinkAlertVisible, setCopiedBlinkAlertVisible] = useState(false);
    const [ failedToCopyBlinkAlertVisible, setFailedToCopyBlinkAlertVisible] = useState(false);
    const [ streamerNameUpdatedAlertVisable, setStreamerNameUpdatedAlertVisiable] = useState(false);
    const [ streamerNameFailedToUpdateAlertVisable, setStreamerNameFailedToUpdatAlertVisiable] = useState(false);

    // Streamer Name State
    const [ streamerNameTextInput, setStreamerNameTextInput] = useState("");
    const [ streamerNameIsUpdating, setStreamerNameIsUpdating] = useState(false);
    const [ streamerNameSourceOfTruth, setStreamerNameSourceOfTruth] = useState("");
  
    const copyBlink = () => {
        const textToCopy = blinkUrl(publicKey!.toBase58());
        navigator.clipboard.writeText(textToCopy)
            .then(() => {
                setCopiedBlinkAlertVisible(true);
                setTimeout(() => setCopiedBlinkAlertVisible(false), 1500);
            })
            .catch((err) => {
                setFailedToCopyBlinkAlertVisible(true);
                setTimeout(() => setFailedToCopyBlinkAlertVisible(false), 1500);
            })
    }

    const updateName = async () => {
        setStreamerNameIsUpdating(true)
        try {
          const response = await fetch(`/api/name?name=${streamerNameTextInput}&pubkey=${publicKey!.toBase58()}`);
          if ( response.status != 200 ) { throw new Error("Bad response") }
          const result = await response.json();
          setStreamerNameSourceOfTruth(result.name);
          setStreamerNameTextInput(result.name);
          setStreamerNameUpdatedAlertVisiable(true)
          setTimeout(() => setStreamerNameUpdatedAlertVisiable(false), 1500);
        } catch (error) {
          setStreamerNameTextInput(streamerNameSourceOfTruth);
          setStreamerNameFailedToUpdatAlertVisiable(true);
          setTimeout(() => setStreamerNameFailedToUpdatAlertVisiable(false), 1500);
        } finally {
          setStreamerNameIsUpdating(false)
        }
    }

    const handleInputChange = (event: any) => {
        setStreamerNameTextInput(event.target.value);
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-evenly p-24">
            { publicKey ? (
                    <div className="flex flex-col gap-4">
                        <div>
                            <StreamlabsAuthButton pubkey={`${publicKey}`}  />
                        </div>
                        <div>
                            <button className="btn btn-primary" onClick={copyBlink}>Copy Blink</button>
                        </div>
                        <div className="flex space-x-4">
                          <input
                            type="text"
                            placeholder="Type here"
                            className="input input-bordered input-primary w-full max-w-xs"
                            value={streamerNameTextInput}
                            onChange={handleInputChange} 
                          />
                          <button className="btn btn-primary" onClick={updateName} disabled={ ( streamerNameIsUpdating || ( streamerNameTextInput == streamerNameSourceOfTruth ) ) }>
                            { streamerNameIsUpdating ?
                              (
                                <span className="loading loading-spinner"></span>
                              ) :
                              (
                                <div>
                                  Update Name
                                </div>
                              )
                            }
                          </button>
                        </div>

                    </div>
                ) : (
                    <h1>Wallet is not connected</h1>
                )
            }
            <WalletButton style={{}} />
            { copiedBlinkAlertVisible &&  <CopiedBlinkToast /> }
            { failedToCopyBlinkAlertVisible &&  <FailedToCopyBlinkToast /> }
            { streamerNameUpdatedAlertVisable &&  <StreamerNameUpdatedToast /> }
            { streamerNameFailedToUpdateAlertVisable &&  <FailedToUpdateStreamerNameToast /> }
        </main>
    )

}