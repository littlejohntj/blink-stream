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
import StreamerMinimumUpdatedToast from "@/components/toasts/StreamerMinimumUpdatedToast";

const WalletButton = dynamic( async () => 
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
    const [ streamerMinimumUpdatedAlertVisable, setStreamerMinimumUpdatedAlertVisiable ] = useState(false);
    const [ streamerMinimimumFailedToUpdateAlertVisable, setStreamerMinimumFailedToUpdateAlertVisable ] = useState(false);

    // Streamer Name State
    const [ streamerNameTextInput, setStreamerNameTextInput] = useState("");
    const [ streamerNameIsUpdating, setStreamerNameIsUpdating] = useState(false);
    const [ streamerNameSourceOfTruth, setStreamerNameSourceOfTruth] = useState("");

    // Streamer Minimum State
    const [streamerMinimumInput, setStreamerMinimumInput] = useState(1);
    const [streamerMinimumIsUpdating, setStreamerMinimumIsUpdating] = useState(false);
    const [streamerMinimumSourceOfTruth, setStreamerMinimumSourceOfTruth] = useState(1);

    // Streamer Authorize State
    const [streamerAuthorizedInput, setStreamerAuthorizedInput] = useState(false);
  
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

    const updateMinimum = async () => {
      setStreamerMinimumIsUpdating(true)
      try {
        const response = await fetch(`/api/minimum?minimum=${streamerMinimumInput}&pubkey=${publicKey!.toBase58()}`);
        if ( response.status != 200 ) { throw new Error("Bad response") }
        const result = await response.json();
        setStreamerMinimumSourceOfTruth(result.minimum)
        setStreamerMinimumInput(result.minimum)
        setStreamerMinimumUpdatedAlertVisiable(true)
        setTimeout(() => setStreamerMinimumUpdatedAlertVisiable(false), 1500);
      } catch (error) {
        setStreamerMinimumInput(streamerMinimumSourceOfTruth)
        setStreamerNameFailedToUpdatAlertVisiable(true)
        setTimeout(() => setStreamerMinimumFailedToUpdateAlertVisable(false), 1500);
      } finally {
        setStreamerMinimumIsUpdating(false)
      }
  }

      useEffect(() => {
        if (publicKey) {
          const fetchStreamerInfo = async () => {
            await getStreamerInfo();
          };
          fetchStreamerInfo();
        }
      }, [publicKey]);

      const getStreamerInfo = async () => {
        // setStreamerMinimumIsUpdating(true)
        try {
          const response = await fetch(`/api/info?pubkey=${publicKey!.toBase58()}`);
          if ( response.status != 200 ) { throw new Error("Bad response") }
          const result = await response.json();

          if ( result.streamer == null ) {
              setStreamerAuthorizedInput(false)
          } else {
              setStreamerAuthorizedInput(true)
              setStreamerNameSourceOfTruth(result.streamer.name);
              setStreamerNameTextInput(result.streamer.name);
              setStreamerMinimumSourceOfTruth(result.streamer.minimum)
              setStreamerMinimumInput(result.streamer.minimum)  
          }

        } catch (error) {
          setStreamerAuthorizedInput(false)
          // setStreamerMinimumInput(streamerMinimumSourceOfTruth)
          // setStreamerNameFailedToUpdatAlertVisiable(true)
          // setTimeout(() => setStreamerMinimumFailedToUpdateAlertVisable(false), 1500);
        } finally {
          // setStreamerMinimumIsUpdating(false)
        }
    }

    const handleInputChange = (event: any) => {
        setStreamerNameTextInput(event.target.value);
    }

    const handleMinimumChange = (event: any) => {
      setStreamerMinimumInput(event.target.value);
  }

    return (
        <main className="flex min-h-screen flex-col items-center justify-evenly p-24">
            { publicKey ? (
                    <div className="flex flex-col gap-16 w-full max-w-2xl">
                        <article style={{ position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)' }} className="prose text-center mt-8 mb-12">
                          <h1 className="text-4xl font-bold">🚨 How to use blink alert 🚨</h1>
                        </article>
                        <section className="flex flex-col items-center gap-4">
                            <article className="prose text-center">
                              <h2 className="text-center">1. Authorize with Streamlabs</h2>
                            </article>
                            <div className="flex justify-center">
                                <StreamlabsAuthButton authorized={streamerAuthorizedInput} pubkey={`${publicKey}`}  />
                            </div>
                        </section>
                        <section className="flex flex-col items-center gap-4">
                            <article className="prose text-center">
                              <h2>2. Update your info</h2>
                            </article>
                            <div className="flex flex-col space-y-4 w-full">
                              <div className="flex space-x-4">
                                <input
                                  type="text"
                                  placeholder="What is your name?"
                                  className="input input-bordered input-primary w-full max-w-xs"
                                  value={streamerNameTextInput}
                                  onChange={handleInputChange} 
                                  disabled={!streamerAuthorizedInput}
                                />
                                <button className="btn btn-primary" onClick={updateName} disabled={ ( streamerNameIsUpdating || ( streamerNameTextInput == streamerNameSourceOfTruth ) || !streamerAuthorizedInput ) }>
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
                              <div className="flex space-x-4">
                                <input
                                  type="number"
                                  placeholder="1"
                                  className="input input-bordered input-primary w-full max-w-xs"
                                  value={streamerMinimumInput}
                                  onChange={handleMinimumChange} 
                                  disabled={!streamerAuthorizedInput}
                                  min={1}
                                />
                                <button className="btn btn-primary" onClick={updateMinimum} disabled={ ( streamerMinimumIsUpdating || ( streamerMinimumInput == streamerMinimumSourceOfTruth ) || !streamerAuthorizedInput ) }>
                                  { streamerMinimumIsUpdating ?
                                    (
                                      <span className="loading loading-spinner"></span>
                                    ) :
                                    (
                                      <div>
                                        Update Minimum
                                      </div>
                                    )
                                  }
                                </button>
                              </div>
                            </div>
                        </section>
                        <section className="flex flex-col items-center gap-4">
                            <article className="prose text-center">
                              <h2>3. Go live</h2>
                            </article>
                            <div className="flex justify-center">
                                <button disabled={!streamerAuthorizedInput} className="btn btn-primary" onClick={copyBlink}>Copy Blink</button>
                            </div>
                        </section>
                    </div>
                ) : (
                    <h1>Wallet is not connected</h1>
                )
            }
            { copiedBlinkAlertVisible &&  <CopiedBlinkToast /> }
            { failedToCopyBlinkAlertVisible &&  <FailedToCopyBlinkToast /> }
            { streamerNameUpdatedAlertVisable &&  <StreamerNameUpdatedToast /> }
            { streamerNameFailedToUpdateAlertVisable &&  <FailedToUpdateStreamerNameToast /> }
            { streamerMinimumUpdatedAlertVisable && <StreamerMinimumUpdatedToast /> }
            { streamerMinimimumFailedToUpdateAlertVisable && <FailedToUpdateStreamerNameToast /> }
            <WalletButton style={{ position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)' }} />
        </main>
    )

}