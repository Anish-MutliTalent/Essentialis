// src/components/LoginPage.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; // Link might not be needed if nav is in App.tsx
import { useActiveAccount, useConnect, useActiveWallet } from "thirdweb/react";
import {
  inAppWallet,
  createWallet,
  preAuthenticate,
} from "thirdweb/wallets";
import { client } from '../lib/thirdweb'; // Your shared Thirdweb client
import { signMessage } from "thirdweb/utils";
import { FcGoogle } from "react-icons/fc";
import MetaMaskLogo from "./UI/MetaMaskLogo";

// Custom UI components
import Divider from "./UI/Divider";
import LoadingSpinner from "./UI/LoadingSpinner";

const API_BASE_URL = '/api'; // Your Flask backend URL

const LoginPage = () => {
  const navigate = useNavigate();

  const account = useActiveAccount(); // Get connected account info
  const { connect, isConnecting, error: connectionError } = useConnect();
  const activeWallet = useActiveWallet();        // ← correct hook for the wallet instance

  // --- State Management ---
  // UI flow state
  const [uiState, setUiState] = useState<'idle' | 'email_otp' | 'connecting' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Input states
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');

  // Backend interaction states
  const [backendLoginStatus, setBackendLoginStatus] = useState("Awaiting wallet connection...");
  const [isBackendLoading, setIsBackendLoading] = useState(false);

  // User Details Form State
  const [userDetails, setUserDetails] = useState({ name: '', age: '', gender: '' });
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [detailsMessage, setDetailsMessage] = useState('');

  // --- Wallet Definitions for Connection ---
  // Define wallet configurations to be used with the connect function
  const walletsToUse = {
      inApp: inAppWallet({ auth: { options: ["email", "google"] } }),
      metamask: createWallet("io.metamask"),
  };

  // Clear errors when component mounts or connection state changes
  useEffect(() => {
    setErrorMessage(null);
    if (isConnecting) {
        setUiState('connecting');
    } else if (connectionError) {
        setUiState('error');
        // Attempt to get a more specific message if possible
        const specificError = connectionError instanceof Error ? connectionError.message : String(connectionError);
        setErrorMessage(`Connection failed: ${specificError}`);
    } else if (!account && uiState !== 'email_otp') {
         setUiState('idle'); // Revert to idle if disconnected and not waiting for OTP
    }
    // Don't reset uiState if connection succeeds, let the backend linking handle it
  }, [isConnecting, connectionError, account, uiState]); // Added uiState dependency

  // --- Wallet Connection Handlers (Using `connect` from `useConnect`) ---
  const handleEmailLogin = useCallback(async () => {
    if (!email) { setErrorMessage("Please enter your email."); setUiState('error'); return; }
    setUiState('connecting'); setErrorMessage(null);
    try {
      await preAuthenticate({ client, strategy: "email", email });
      setUiState('email_otp'); // Show OTP input
    } catch (err: any) {
      console.error("Email pre-authentication failed:", err);
      setErrorMessage(`Failed to send OTP: ${err.message || err}`);
      setUiState('error');
    }
  }, [email]);

  const handleVerifyEmail = useCallback(async () => {
    if (!email || !otp) { setErrorMessage("Please enter OTP."); setUiState('error'); return; }
    if (otp.length !== 6) { setErrorMessage("OTP must be 6 digits."); setUiState('error'); return; }
    setUiState('connecting'); setErrorMessage(null);
    try {
      await connect(async () => {
        const wallet = walletsToUse.inApp; // Get pre-configured instance
        await wallet.connect({ client, strategy: "email", email, verificationCode: otp });
        return wallet;
      });
      // Success state handled by useEffect watching `account` and `activeWallet`
    } catch (err: any) {
      console.error("Email connect failed:", err);
      setErrorMessage(`Email verification failed: ${err.message || err}`);
      setUiState('email_otp'); // Revert to OTP input on failure
    }
  }, [email, otp, connect, walletsToUse.inApp]);

  const handleSocialLogin = useCallback(async (strategy: "google" /* | "facebook" | "apple" */) => {
      setUiState('connecting'); setErrorMessage(null);
      try {
          await connect(async () => {
              const wallet = walletsToUse.inApp;
              await wallet.connect({ client, strategy: strategy });
              return wallet;
          });
      } catch (err: any) {
          console.error(`${strategy} connect failed:`, err);
          setErrorMessage(`Login with ${strategy} failed: ${err.message || err}`);
          setUiState('error');
      }
  }, [connect, walletsToUse.inApp]);

  const handleMetaMaskConnect = useCallback(async () => {
      setUiState('connecting'); setErrorMessage(null);
      try {
          await connect(async () => {
              const wallet = walletsToUse.metamask; // Use pre-configured instance
              await wallet.connect({ client });
              return wallet;
          });
      } catch (err: any) {
          console.error("MetaMask connect failed:", err);
          setErrorMessage(`MetaMask connect failed: ${err.message || err}`);
          setUiState('error');
      }
  }, [connect, walletsToUse.metamask]);

  // --- Backend Wallet Linking ---
  const linkWalletToBackend = useCallback(async (acct: { address: string }, wallet: any) => {
      if (!acct?.address) return;
      setIsBackendLoading(true);
      setBackendLoginStatus(`Linking wallet ${acct.address.substring(0,6)}...`);

      try {
        // 1. fetch challenge from backend
        const challengeRes = await fetch(`${API_BASE_URL}/auth/login/metamask/challenge`, {
          credentials: "include",
        });
        if (!challengeRes.ok) throw new Error(`Challenge fetch failed: ${challengeRes.status}`);
        const { message_to_sign } = await challengeRes.json();

        // 2. get the low‑level Account object
        const accountObj = wallet.getAccount();
        if (!accountObj) throw new Error("Wallet has no Account");

        // 3. sign the challenge
        const signature = await signMessage({
          account: accountObj,
          message: message_to_sign,
        });  // :contentReference[oaicite:0]{index=0}

        // 4. verify with backend
        const verifyRes = await fetch(`${API_BASE_URL}/auth/login/metamask/verify`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            walletAddress: acct.address,
            signature,
            originalMessage: message_to_sign,
          }),
        });
        if (!verifyRes.ok) {
          const err = await verifyRes.json().catch(() => ({}));
          throw new Error(err.error || `Verify failed: ${verifyRes.status}`);
        }

        const verifyData = await verifyRes.json();
        setBackendLoginStatus(`Backend login successful! User ID: ${verifyData.userId}`);
        sessionStorage.setItem(`backend_linked_${acct.address}`, "true");
      } catch (e: any) {
        console.error("Backend linking error:", e);
        setBackendLoginStatus(`Backend linking error: ${e.message}`);
        sessionStorage.removeItem(`backend_linked_${acct.address}`);
      } finally {
        setIsBackendLoading(false);
      }
    }, []);

  // --- Fetch User Details ---
  const fetchUserDetails = useCallback(async () => {
    if (!account) return;
    console.log("Fetching user details from backend...");
    setIsDetailsLoading(true); setDetailsMessage('');
    try {
      const response = await fetch(`${API_BASE_URL}/user/details`, { method: 'GET', credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setUserDetails({
          name: data.name || '',
          age: data.age || '',
          gender: data.gender || '',
        });
        const allFilled = data.name && data.age && data.physical_address && data.gender;
        if (allFilled) {
          navigate("/dashboard");
        }
        console.log("User details fetched:", data);

      } else if (response.status !== 401) { // Ignore 401 as linking might handle it
        const errData = await response.json().catch(() => ({error: "Failed to parse error"}));
        throw new Error(errData.error || `Failed to fetch details: ${response.status}`);
      }
    } catch (error: any) {
      console.error("Error fetching user details:", error);
      setDetailsMessage(`Error fetching details: ${error.message}`);
    } finally {
      setIsDetailsLoading(false);
    }
  }, [account]);

  // --- Effect to Link Wallet & Fetch Details ---
  useEffect(() => {
    const processConnection = async (currentAccount: { address: string }, currentActiveWallet: any) => {
        console.log("processConnection called with account:", currentAccount, "wallet:", currentActiveWallet);
      const alreadyProcessed = sessionStorage.getItem(`backend_linked_${currentAccount.address}`);
      if (!alreadyProcessed) {
        await linkWalletToBackend(currentAccount, currentActiveWallet);
        // Check again if linking succeeded before fetching details
        if (sessionStorage.getItem(`backend_linked_${currentAccount.address}`)) {
          fetchUserDetails();
        }
      } else {
        // Already linked in this session, check backend status and fetch details
        fetch(`${API_BASE_URL}/auth/status`, {credentials: 'include'})
          .then(res => res.ok ? res.json() : Promise.reject(new Error(`Auth status ${res.status}`)))
          .then(data => {
              if (data.logged_in && data.wallet_address?.toLowerCase() === currentAccount.address.toLowerCase()) {
                  setBackendLoginStatus(`Backend session active.`);
                  setUiState("idle");
                  console.log("Account",account)
                  fetchUserDetails();
              } else {
                 sessionStorage.removeItem(`backend_linked_${currentAccount.address}`);
                 setBackendLoginStatus(`No active backend session.`);
              }
          })
          .catch(e => {
            console.error("Auth status check failed", e);
            setBackendLoginStatus("Could not verify backend session.");
          });
      }
    };

    // Only run if account and wallet instance are available, and not currently loading backend stuff
    if (account && activeWallet && !isBackendLoading && !isConnecting) {
      processConnection(account, activeWallet);
    } else if (!account && !isConnecting) {
      setBackendLoginStatus("Awaiting wallet connection...");
      setUserDetails({ name: '', age: '', gender: '' }); // Reset form
      setDetailsMessage('');
    }

  }, [account, activeWallet, isBackendLoading, isConnecting, linkWalletToBackend, fetchUserDetails]); // Added missing dependencies

    const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
            setUserDetails(prevDetails => ({
                ...prevDetails,
            [name]: value, // Update the specific field based on input name
        }));
    };

  // --- User Details Form Submission Handler ---
  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) { setDetailsMessage("Error: Wallet not connected."); return; }
    setIsDetailsLoading(true); setDetailsMessage('Saving details...');
    console.log('Submitting user details to backend:', { wallet: account.address, details: userDetails });

    try {
      const response = await fetch(`${API_BASE_URL}/user/details`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
            name: userDetails.name,
            // Send age as number or null, ensure empty string becomes null
            age: userDetails.age === '' ? null : parseInt(userDetails.age, 10),
            gender: userDetails.gender,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setDetailsMessage("Details saved successfully!");
        console.log("Details saved response:", data);
        // Update local state with potentially cleaned/validated data from response
        setUserDetails({
            name: data.user?.name || '',
            age: data.user?.age || '',
            gender: data.user?.gender || '',
        });
        const allFilled = data.user?.name && data.user?.age && data.user?.physical_address && data.user?.gender;
          if (allFilled) {
            navigate("/dashboard");
          }
      } else {
        throw new Error(data.error || `Failed to save details: ${response.status}`);
      }
    } catch (error: any) {
      console.error("Error saving user details:", error);
      setDetailsMessage(`Error saving details: ${error.message}`);
    } finally {
      setIsDetailsLoading(false);
    }
  };

  // Determine if the main login/connection UI should be shown
  const showLoginOptions = !account && uiState !== 'email_otp' && !isConnecting;
  const showOtpInput = !account && uiState === 'email_otp' && !isConnecting;
  const showConnectingLoader = isConnecting || (uiState === 'connecting' && !isBackendLoading); // Show generic connecting loader
  const showUserDetailsForm = account; // Show form whenever account is connected
  const [checkedSession, setCheckedSession] = useState(false);

  useEffect(() => {
    // on mount, ask backend if cookie + session is still valid
    fetch(`${API_BASE_URL}/auth/status`, {
      method: "GET",
      credentials: "include",
    })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          console.log("Data, session check:", data, account);
          if (data.logged_in) {
            navigate("/dashboard");
          } else {
            // clear any stale session
            setUiState("idle");
          }
        }
      })
      .catch(() => {
        /* ignore */
      })
      .finally(() => {
        setCheckedSession(true);
      });
  }, []); // run once

  // in your render, don’t show login-options until we’ve checked
  if (!checkedSession) {
    return <LoadingSpinner />;
  }

  return (
    // Full screen container, centers content vertically and horizontally
    <div className="relative min-h-screen w-full flex items-center justify-center text-black p-4 bg-black">


      {/* Content Box */}
      <div className="relative z-10 w-full max-w-sm bg-white bg-opacity-60 backdrop-blur-md rounded-xl shadow-2xl p-6 space-y-5 border border-gray-700">

        <h2 className="text-center text-3xl font-bold text-black">
          {account ? "PROFILE" : "LOG IN / REGISTER"}
        </h2>


        {/* Error Display Area */}
        {errorMessage && (
          <div className="bg-red-500/30 border border-red-600 text-red-600 px-4 py-2 rounded-md text-sm transition-opacity duration-300">
            {errorMessage}
          </div>
        )}

        {/* --- Login Options --- */}
        {showLoginOptions && (
          <div className="space-y-3 animate-fade-in"> {/* Simple fade-in */}
            {/* Google */}
            <button onClick={() => handleSocialLogin("google")} className="w-full button bg-red-600 hover:bg-red-700">
              <span className="w-5 h-5 mr-3 inline-block">
                  <FcGoogle size={24} />
              </span>
              Google
            </button>
            {/* MetaMask */}
            <button onClick={handleMetaMaskConnect} className="w-full button bg-orange-500 hover:bg-orange-600">
                <MetaMaskLogo width={30} height={30} followMouse={true} slowDrift={true} className="w-4 h-4 mr-3 inline-block"/>
              MetaMask
            </button>
            <Divider>Or use email</Divider>
            {/* Email */}
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className="w-full"/>
            <button onClick={handleEmailLogin} disabled={email.trim() === ""} className="w-full button">
              Proceed with Email
            </button>
            {/* Add WalletConnect button here if needed */}
          </div>
        )}

        {/* --- OTP Input --- */}
        {showOtpInput && (
          <div className="space-y-3 animate-fade-in">
            <p className="text-sm text-center text-black">Enter code sent to {email}</p>
            <input type="text" inputMode="numeric" pattern="[0-9]*" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="OTP Code" maxLength={6} className="text-center tracking-widest w-full"/>
            <button onClick={handleVerifyEmail} disabled={!otp || otp.length !== 6} className="w-full button">
              Verify & Connect
            </button>
             <button onClick={() => { setUiState('idle'); setErrorMessage(null); setOtp(''); }} className="w-full text-center text-sm text-black hover:text-gray mt-2">Back</button>
          </div>
        )}

        {/* --- Generic Loading --- */}
        {showConnectingLoader && (
          <div className='text-center py-4'>
             <LoadingSpinner />
             <p className="mt-2 text-sm text-black">Connecting...</p>
          </div>
        )}

        {/* --- Connected State & Details Form --- */}
        {showUserDetailsForm && (
          <div className="mt-2 space-y-4 animate-fade-in">
             {/* Backend Status */}
             {(isBackendLoading || backendLoginStatus) &&
                <p className={`text-center text-xs ${backendLoginStatus.startsWith('Error') ? 'text-red-400' : 'text-black'}`}>
                    {isBackendLoading ? <LoadingSpinner/> : null} {backendLoginStatus}
                </p>
             }

             <hr className="border-black"/>

             <h3 className="text-lg font-semibold text-center">Your Details</h3>
             {detailsMessage && (
                <p className={`text-center text-xs ${detailsMessage.startsWith("Error") ? 'text-red-400' : 'text-green-400'}`}>
                    {detailsMessage}
                </p>
             )}
             {/* User Details Form */}

             <form onSubmit={handleDetailsSubmit} className="space-y-3">
                 <input type="text" id="name" name="name" value={userDetails.name} onChange={handleDetailsChange} placeholder="Full Name" disabled={isDetailsLoading} />
                 <input type="number" id="age" name="age" value={userDetails.age} onChange={handleDetailsChange} placeholder="Age" disabled={isDetailsLoading} />
                 <select id="gender" name="gender" value={userDetails.gender} onChange={handleDetailsChange} disabled={isDetailsLoading}>
                     <option value="">Select Gender</option>
                     <option value="male">Male</option>
                     <option value="female">Female</option>
                     <option value="other">Other</option>
                     <option value="prefer_not_to_say">Prefer not to say</option>
                 </select>
                <button type="submit" className="w-full button" disabled={isDetailsLoading}>
                    {isDetailsLoading ? <LoadingSpinner /> : null} Save Details
                </button>
             </form>

          </div>
        )}

      </div> {/* End Content Box */}
    </div> // End Full screen container
  );
};

export default LoginPage;