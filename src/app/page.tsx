'use client';

import { getLocalStorage } from "@/utils/frontend/local-storage";
import { StreamerData } from "@/utils/shared/types/streamer-data";
import { handleUserAuthTokenExistingStateAndReturnFinalState, handleUserSignOut } from "@/utils/frontend/user-sign-in/user-sign-in";
import { useWallet } from "@solana/wallet-adapter-react";
import { GoogleViaTipLinkWalletName } from "@tiplink/wallet-adapter";
import { useCallback, useEffect, useState } from "react";
import { AUTHORIZE_STREAMLABS_BUTTON_LABEL, BLINK_URL_COPIED_INFO_MESSAGE, BLINK_URL_FAILED_TO_COPY_MESSAGE, COPY_BLINK_BUTTON_LABEL, COULD_NOT_FETCH_STREAMER_MESSAGE, MINIMUM_UPDATED_FAILED_TOAST_MESSAGE, MINIMUM_UPDATED_SUCCESS_TOAST_MESSAGE, NAME_UPDATED_FAILED_TOAST_MESSAGE, NAME_UPDATED_SUCCESS_TOAST_MESSAGE, LOGIN_BUTTON_LABEL, SIGN_OUT_BUTTON_LABEL, STREAMLABS_AUTH_FAILED_MESSAGE, UPDATE_MINIMUM_BUTTON_LABEL, UPDATE_MINIMUM_PLACEHOLDER_LABEL, UPDATE_NAME_BUTTON_LABEL, UPDATE_NAME_PLACEHOLDER_LABEL } from "./user/constants";
import { AlertState, AlertType } from "@/utils/shared/types/alert-state";
import AlertToast from "@/components/toasts/AlertToast";
import { blinkUrl } from "@/utils/shared/blink-url";

export default function Home() {

    const [userSignedInState, setUserSignedInState] = useState(false)
    const [userAuthTokenExists, setUserAuthTokenExists] = useState(false) 
    const [streamerData, setStreamerData] = useState<StreamerData | null>(null)

    // Streamer Name State
    const [streamerNameTextInput, setStreamerNameTextInput] = useState("")
    const [streamerNameTextInputSourceOfTrust, setStreamerNameTextInputSourceOfTruth] = useState("")

    // Streamer Minimum State
    const [streamerMinimumNumberInput, setStreamerMinimumNumberInput] = useState(0.01)
    const [streamerMinimumNumberInputSourceOfTruth, setStreamerMinimumNumberInputSourceOfTruth] = useState(0.01)

    const [streamerNameIsUpdating, setStreamerNameIsUpdating] = useState(false)
    const [streamerMinimumIsUpdating, setStreamerMinimumIsUpdating] = useState(false)
    const [streamLabsAuthIsUpdating, setStreamLabsAuthIsUpdating] = useState(false)

    const [alertState, setAlertState] = useState<AlertState | null>(null)

    const { select, disconnect, publicKey, connected, connecting } = useWallet()

    // Track the local user auth token existing
    useEffect(() => {
        setUserAuthTokenExists(handleUserAuthTokenExistingStateAndReturnFinalState())
    }, [connected, publicKey])

    // Track the user being "signed in"
    useEffect(() => {
        // Right now, we define a user being "signed in" by them being connected, having a pubkey, and having local auth tokens existing
        setUserSignedInState( userAuthTokenExists && publicKey != null && connected )
    }, [connected, publicKey, userAuthTokenExists])

    // Track the streamer data is set
    useEffect(() => {

        if ( streamerData == null && userSignedInState ) {
            // Make the request to get the data object

            const auth = getLocalStorage("auth")!

            const authHeader = `Bearer ${auth}`;

            const fetchStreamerData = async () => {
                try {
                    const response = await fetch('/api/streamer', {
                        method: 'GET',
                        headers: {
                            'Authorization': authHeader,
                            'Content-Type': 'application/json'
                        }
                    });

                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }

                    const data: StreamerData = await response.json();

                    setStreamerData(data);

                } catch (error) {
                    
                    setAlertState({
                        type: AlertType.ERROR,
                        message: COULD_NOT_FETCH_STREAMER_MESSAGE
                    })
                    setTimeout(() => setAlertState(null), 2000);        

                }
            };

            fetchStreamerData();

        }

    }, [userSignedInState])

    useEffect(() => {
        if ( streamerData != null ) {

            // streamer name
            const streamerDataName = streamerData.streamerInfo.name ?? ""
            setStreamerNameTextInput(streamerDataName)
            setStreamerNameTextInputSourceOfTruth(streamerDataName)

            // streamer minimum
            setStreamerMinimumNumberInput(streamerData.donationSettings.minimum)
            setStreamerMinimumNumberInputSourceOfTruth(streamerData.donationSettings.minimum)

        }
    }, [streamerData])

    const signInUserClicked = useCallback(async () => {
        select(GoogleViaTipLinkWalletName)
    }, [select])

    const signOutUserClicked = async () => {
        handleUserSignOut()
        await disconnect()
    }

    const handleStreamerNameTextInputChange = (event: any) => {
        setStreamerNameTextInput(event.target.value)
    }

    const handleStreamerMinimumNumberInputChange = (event: any) => {
        setStreamerMinimumNumberInput(event.target.value)
    }

    const authorizeStreamlabs = async () => {

        setStreamLabsAuthIsUpdating(true)
        try {
            const auth = getLocalStorage("auth")!
            const authHeader = `Bearer ${auth}`;    
            const response = await fetch('/api/auth/streamlabs-auth-url', {
                method: 'GET',
                headers: {
                    'Authorization': authHeader,
                    'Content-Type': 'application/json'
                }
            });
            const result = await response.json();
            window.location.href = result.authUrl;
        } catch (error) {
            setAlertState({
                type: AlertType.ERROR,
                message: STREAMLABS_AUTH_FAILED_MESSAGE
            })
            setTimeout(() => setAlertState(null), 2000);
        } finally {
            setStreamLabsAuthIsUpdating(false)
        }

    }

    const updateName = async () => {
        setStreamerNameIsUpdating(true);
        try {
            const auth = getLocalStorage("auth")!
            const authHeader = `Bearer ${auth}`;
            const response = await fetch(`/api/name?name=${streamerNameTextInput}`, {
                method: 'POST',
                headers: {
                    'Authorization': authHeader,
                    'Content-Type': 'application/json'
                }
            });
            if ( response.status != 200 ) { throw new Error("Bad response") }
            const result = await response.json();

            setStreamerData(result)
            setAlertState({
                type: AlertType.SUCCESS,
                message: NAME_UPDATED_SUCCESS_TOAST_MESSAGE
            })
            setTimeout(() => setAlertState(null), 2000);

            
        } catch (error) {

            setStreamerNameTextInput(streamerNameTextInputSourceOfTrust)
            setAlertState({
                type: AlertType.ERROR,
                message: NAME_UPDATED_FAILED_TOAST_MESSAGE
            })
            setTimeout(() => setAlertState(null), 2000);

        } finally {
            setStreamerNameIsUpdating(false)
        }

    }

    const updateMinimum = async () => {

        setStreamerMinimumIsUpdating(true)
        try {
            const auth = getLocalStorage("auth")!
            const authHeader = `Bearer ${auth}`;
            const response = await fetch(`/api/minimum?minimum=${streamerMinimumNumberInput}`, {
                method: 'POST',
                headers: {
                    'Authorization': authHeader,
                    'Content-Type': 'application/json'
                }
            });
            if ( response.status != 200 ) { throw new Error("Bad response") }
            const result = await response.json();

            setStreamerData(result)
            setAlertState({
                type: AlertType.SUCCESS,
                message: MINIMUM_UPDATED_SUCCESS_TOAST_MESSAGE
            })
            setTimeout(() => setAlertState(null), 2000);

        } catch(error) {
            setStreamerMinimumNumberInput(streamerMinimumNumberInput)
            setAlertState({
                type: AlertType.ERROR,
                message: MINIMUM_UPDATED_FAILED_TOAST_MESSAGE
            })
            setTimeout(() => setAlertState(null), 2000);
        } finally {
            setStreamerMinimumIsUpdating(false)
        }

    }

    const copyBlickButtonClicked = () => {
        const blinkUrlText = blinkUrl(publicKey!.toBase58());
        navigator.clipboard.writeText(blinkUrlText)
            .then(() => {
                setAlertState({
                    type: AlertType.INFO,
                    message: BLINK_URL_COPIED_INFO_MESSAGE
                })
                setTimeout(() => setAlertState(null), 2000);
            })
            .catch((err) => {
                setAlertState({
                    type: AlertType.ERROR,
                    message: BLINK_URL_FAILED_TO_COPY_MESSAGE
                })
                setTimeout(() => setAlertState(null), 2000);
            })
    }


    return (
        <main>
            <div className="navbar bg-base-100">
                <div className="navbar-start">
                    <a className="btn btn-ghost text-xl">blurt.gg</a>
                </div>
                <div className="navbar-center hidden lg:flex">
                </div>
                <div className="navbar-end">
                    { 
                        userSignedInState ?
                        
                        (
                            <button
                            className="btn btn-primary"
                            onClick={ async () => { await signOutUserClicked() }  }
                            >
                                {SIGN_OUT_BUTTON_LABEL}
                            </button>
                        )
                        
                            :
                        (
                            <div className="css-0">
                                <button 
                                    className="flex justify-center h-10 items-center rounded-lg bg-[#767FFE] py-0 pl-2.5 pr-2.5 text-base text-[#050616] shadow-[0px_0px_40px_rgba(0,0,0,0.06)] hover:bg-[#666EDD] active:bg-[#5A61D1] transition-colors duration-150 ease-linear"
                                    onClick={async () => { await signInUserClicked() }}
                                >
                                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white mr-2">
                                        <img alt="Login with Google" className="h-7 w-7" src="/google.svg" loading="eager" />
                                    </div>
                                    <p className="font-bold">
                                        {LOGIN_BUTTON_LABEL}
                                    </p>
                                </button>
                            </div>
                        )
                    }
                </div>
            </div>
            <div>
                {
                    userSignedInState ?

                    (
                        <div className="flex flex-col space-y-20">
                            <div className="flex justify-center">
                                <a className="text-4xl">Set Up Blurt in 3 Steps.</a>
                            </div>
                            <div className="flex-col space-y-4">
                                <div className="flex justify-center">
                                    <a className="text-xl">1. Authorize with your Streamlabs account</a>
                                </div>
                                <div className="flex justify-center">
                                    <button
                                    className="btn btn-primary"
                                    onClick={authorizeStreamlabs}
                                    disabled={streamerData?.services.authorizedStreamlabs ?? false}
                                    >
                                        {AUTHORIZE_STREAMLABS_BUTTON_LABEL}
                                    </button>
                                </div>
                            </div>
                            <div className="flex-col space-y-4">
                                <div className="flex justify-center">
                                    <a className="text-xl">2. Edit your infomation</a>
                                </div>
                                <div className="flex justify-center space-x-4">
                                    <input
                                    className="input input-bordered input-primary"
                                    type="text"
                                    placeholder={UPDATE_NAME_PLACEHOLDER_LABEL}
                                    value={streamerNameTextInput}
                                    onChange={handleStreamerNameTextInputChange}
                                    disabled={streamerNameIsUpdating}>
                                    </input>
                                    <button
                                    className="btn btn-primary"
                                    onClick={updateName}
                                    disabled={streamerNameIsUpdating || ( streamerNameTextInput == streamerNameTextInputSourceOfTrust )}
                                    >
                                        {UPDATE_NAME_BUTTON_LABEL}
                                    </button>
                                </div>
                                <div className="flex justify-center">
                                    <input
                                    className="input input-bordered input-primary"
                                    type="number"
                                    placeholder={UPDATE_MINIMUM_PLACEHOLDER_LABEL}
                                    value={streamerMinimumNumberInput}
                                    onChange={handleStreamerMinimumNumberInputChange}
                                    disabled={streamerMinimumIsUpdating}>
                                    </input>
                                    <button
                                    className="btn btn-primary"
                                    onClick={updateMinimum}
                                    disabled={streamerMinimumIsUpdating || ( streamerMinimumNumberInput == streamerMinimumNumberInputSourceOfTruth )}
                                    >
                                        {UPDATE_MINIMUM_BUTTON_LABEL}
                                    </button>
                                </div>
                            </div>
                            <div className="flex-col space-y-4">
                                <div className="flex justify-center">
                                    <a className="text-xl">3. Copy your blink url and post it on your stream</a>
                                </div>
                                <div className="flex justify-center">
                                    <button
                                    className="btn btn-primary"
                                    onClick={copyBlickButtonClicked}
                                    >
                                        {COPY_BLINK_BUTTON_LABEL}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )

                        :

                    (
                        <div>
                            <div className="hero bg-base-200 min-h-screen">
                                <div className="hero-content text-center">
                                    <div className="max-w-md">
                                    <h1 className="w-full text-5xl font-bold ">Solana Powered Stream Alerts</h1>
                                    <p className="py-6">
                                    Blurt.gg integrates Solana transactions directly into your stream, triggering real-time alerts that keep your audience engaged.
                                    </p>
                                        <div className="flex justify-center">
                                            <button 
                                                className="relative flex h-11 w-max cursor-pointer items-center justify-center rounded-lg bg-[#767FFE] hover:bg-[#666EDD] active:bg-[#5A61D1] transition-colors duration-150 ease-linear p-4 text-base"
                                                onClick={async () => { await signInUserClicked() }}
                                            >
                                                <div className="absolute left-2.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md ">
                                                <div className="relative h-8 w-8">
                                                    <img 
                                                    alt="Google icon" 
                                                    src="google.svg" 
                                                    className="absolute inset-0 h-full w-full"
                                                    />
                                                </div>
                                                </div>
                                                <div className="pl-9">
                                                <h3 className="font-bold text-[#050616]">
                                                    Sign Up with Google
                                                </h3>
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
                { alertState && <AlertToast alertState={alertState}/>}
            </div>
        </main>
    );
}