"use client";

import { getLocalStorage } from "@/utils/frontend/local-storage";
import { StreamerData } from "@/utils/shared/types/streamer-data";
import { handleUserAuthTokenExistingStateAndReturnFinalState, handleUserSignOut } from "@/utils/frontend/user-sign-in/user-sign-in";
import { useWallet } from "@solana/wallet-adapter-react";
import { GoogleViaTipLinkWalletName } from "@tiplink/wallet-adapter";
import { useCallback, useEffect, useState } from "react";
import { AUTHORIZE_STREAMLABS_BUTTON_LABEL, BLINK_URL_COPIED_INFO_MESSAGE, BLINK_URL_FAILED_TO_COPY_MESSAGE, COPY_BLINK_BUTTON_LABEL, COULD_NOT_FETCH_STREAMER_MESSAGE, MINIMUM_UPDATED_FAILED_TOAST_MESSAGE, MINIMUM_UPDATED_SUCCESS_TOAST_MESSAGE, NAME_UPDATED_FAILED_TOAST_MESSAGE, NAME_UPDATED_SUCCESS_TOAST_MESSAGE, LOGIN_BUTTON_LABEL, SIGN_OUT_BUTTON_LABEL, STREAMLABS_AUTH_FAILED_MESSAGE, UPDATE_MINIMUM_BUTTON_LABEL, UPDATE_MINIMUM_PLACEHOLDER_LABEL, UPDATE_NAME_BUTTON_LABEL, UPDATE_NAME_PLACEHOLDER_LABEL } from "./constants";
import { AlertState, AlertType } from "@/utils/shared/types/alert-state";
import AlertToast from "@/components/toasts/AlertToast";
import { blinkUrl } from "@/utils/shared/blink-url";

export default function UserPage() {

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

        if ( streamerData == null ) {
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
            { userSignedInState ?
                (
                    <div>
                        <div>
                            <h1>User is signed in</h1>
                        </div>
                        <div>
                            <button
                            className="btn btn-primary"
                            onClick={authorizeStreamlabs}
                            disabled={streamerData?.services.authorizedStreamlabs ?? false}
                            >
                                {AUTHORIZE_STREAMLABS_BUTTON_LABEL}
                            </button>
                            
                        </div>
                        <div>
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
                        <div>
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
                        <div>
                            <button
                            className="btn btn-primary"
                            onClick={copyBlickButtonClicked}
                            >
                                {COPY_BLINK_BUTTON_LABEL}
                            </button>
                        </div>
                        <div>
                            <button
                            className="btn btn-primary"
                            onClick={ async () => { await signOutUserClicked() }  }
                            >
                                {SIGN_OUT_BUTTON_LABEL}
                            </button>
                        </div>
                    </div>
                )
                :
                (
                    <div>
                        <div>
                            <h1>User is not signed in</h1> 
                        </div>
                        <div>
                            <button 
                            className="btn btn-primary"
                            onClick={ async () => { void signInUserClicked() } }
                            >
                                {LOGIN_BUTTON_LABEL}
                            </button>
                        </div>
                    </div>
                )
            }
            { alertState && <AlertToast alertState={alertState}/>}
        </main>
    )
}