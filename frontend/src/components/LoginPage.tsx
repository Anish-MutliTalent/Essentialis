// src/components/LoginPage.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useActiveAccount, useConnect, useActiveWallet } from "thirdweb/react";
import {
  inAppWallet,
  createWallet,
  preAuthenticate,
} from "thirdweb/wallets";
import { client } from '../lib/thirdweb';
import { signMessage } from "thirdweb/utils";
import { FcGoogle } from "react-icons/fc";
import MetaMaskLogo from "./UI/MetaMaskLogo";

// Custom UI components
import Divider from "./UI/Divider";
import LoadingSpinner from "./UI/LoadingSpinner";

const API_BASE_URL = '/api';

const LoginPage = () => {
  const navigate = useNavigate();

  const account = useActiveAccount();
  const { connect, isConnecting, error: connectionError } = useConnect();
  const activeWallet = useActiveWallet();

  // --- State Management ---
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
        const specificError = connectionError instanceof Error ? connectionError.message : String(connectionError);
        setErrorMessage(`Connection failed: ${specificError}`);
    } else if (!account && uiState !== 'email_otp') {
         setUiState('idle');
    }
  }, [isConnecting, connectionError, account, uiState]);

  // --- Wallet Connection Handlers ---
  const handleEmailLogin = useCallback(async () => {
    if (!email) { setErrorMessage("Please enter your email."); setUiState('error'); return; }
    setUiState('connecting'); setErrorMessage(null);
    try {
      await preAuthenticate({ client, strategy: "email", email });
      setUiState('email_otp');
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
        const wallet = walletsToUse.inApp;
        await wallet.connect({ client, strategy: "email", email, verificationCode: otp });
        return wallet;
      });
    } catch (err: any) {
      console.error("Email connect failed:", err);
      setErrorMessage(`Email verification failed: ${err.message || err}`);
      setUiState('email_otp');
    }
  }, [email, otp, connect, walletsToUse.inApp]);

  const handleSocialLogin = useCallback(async (strategy: "google") => {
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
              const wallet = walletsToUse.metamask;
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
        const challengeRes = await fetch(`${API_BASE_URL}/auth/login/metamask/challenge`, {
          credentials: "include",
        });
        if (!challengeRes.ok) throw new Error(`Challenge fetch failed: ${challengeRes.status}`);
        const { message_to_sign } = await challengeRes.json();

        const accountObj = wallet.getAccount();
        if (!accountObj) throw new Error("Wallet has no Account");

        const signature = await signMessage({
          account: accountObj,
          message: message_to_sign,
        });

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

      } else if (response.status !== 401) {
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
        if (sessionStorage.getItem(`backend_linked_${currentAccount.address}`)) {
          fetchUserDetails();
        }
      } else {
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

    if (account && activeWallet && !isBackendLoading && !isConnecting) {
      processConnection(account, activeWallet);
    } else if (!account && !isConnecting) {
      setBackendLoginStatus("Awaiting wallet connection...");
      setUserDetails({ name: '', age: '', gender: '' });
      setDetailsMessage('');
    }

  }, [account, activeWallet, isBackendLoading, isConnecting, linkWalletToBackend, fetchUserDetails]);

    const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
            setUserDetails(prevDetails => ({
                ...prevDetails,
            [name]: value,
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
            age: userDetails.age === '' ? null : parseInt(userDetails.age, 10),
            gender: userDetails.gender,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setDetailsMessage("Details saved successfully!");
        console.log("Details saved response:", data);
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
  const showConnectingLoader = isConnecting || (uiState === 'connecting' && !isBackendLoading);
  const showUserDetailsForm = account;
  const [checkedSession, setCheckedSession] = useState(false);

  useEffect(() => {
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
  }, []);

  if (!checkedSession) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #fbbf24 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, #3b82f6 0%, transparent 50%)`
        }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-2xl mb-4">
            <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a2 2 0 114 0 2 2 0 01-4 0zm8-2a2 2 0 100 4 2 2 0 000-4z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            ESSENTIALIS <span className="text-yellow-400">CLOUD</span>
          </h1>
          <p className="text-gray-400 text-sm">
            Secure document management for everyone
          </p>
        </div>

        {/* Content Card */}
        <div className="bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 shadow-2xl">
          <h2 className="text-center text-xl font-semibold text-white mb-6">
            {account ? "Complete Your Profile" : "Welcome Back"}
          </h2>

          {/* Error Display */}
          {errorMessage && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm mb-6">
              {errorMessage}
            </div>
          )}

          {/* Login Options */}
          {showLoginOptions && (
            <div className="space-y-4">
              {/* Google Login */}
              <button 
                onClick={() => handleSocialLogin("google")} 
                className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-900 font-medium py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02]"
              >
                <FcGoogle size={20} />
                Continue with Google
              </button>

              {/* MetaMask */}
              <button 
                onClick={handleMetaMaskConnect} 
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02]"
              >
                <MetaMaskLogo width={20} height={20} followMouse={false} slowDrift={false} />
                Connect MetaMask
              </button>

              <Divider>Or use email</Divider>

              {/* Email Input */}
              <div className="space-y-4">
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="Enter your email address" 
                  className="w-full bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200"
                />
                <button 
                  onClick={handleEmailLogin} 
                  disabled={email.trim() === ""} 
                  className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-medium py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  Continue with Email
                </button>
              </div>
            </div>
          )}

          {/* OTP Input */}
          {showOtpInput && (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-gray-300 text-sm mb-4">
                  Enter the verification code sent to
                </p>
                <p className="text-yellow-400 font-medium">{email}</p>
              </div>
              <input 
                type="text" 
                inputMode="numeric" 
                pattern="[0-9]*" 
                value={otp} 
                onChange={(e) => setOtp(e.target.value)} 
                placeholder="000000" 
                maxLength={6} 
                className="w-full bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 px-4 py-3 rounded-xl text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200"
              />
              <button 
                onClick={handleVerifyEmail} 
                disabled={!otp || otp.length !== 6} 
                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-medium py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                Verify & Continue
              </button>
              <button 
                onClick={() => { setUiState('idle'); setErrorMessage(null); setOtp(''); }} 
                className="w-full text-center text-sm text-gray-400 hover:text-white transition-colors duration-200"
              >
                ← Back to login options
              </button>
            </div>
          )}

          {/* Loading State */}
          {showConnectingLoader && (
            <div className='text-center py-8'>
               <LoadingSpinner />
               <p className="mt-4 text-sm text-gray-300">Connecting securely...</p>
            </div>
          )}

          {/* User Details Form */}
          {showUserDetailsForm && (
            <div className="space-y-6">
               {/* Backend Status */}
               {(isBackendLoading || backendLoginStatus) && (
                <div className="text-center">
                  <p className={`text-xs ${backendLoginStatus.startsWith('Error') ? 'text-red-400' : 'text-gray-300'}`}>
                      {isBackendLoading && <LoadingSpinner/>} {backendLoginStatus}
                  </p>
                </div>
               )}

               <div className="border-t border-gray-700 pt-6">
                 <h3 className="text-lg font-semibold text-white text-center mb-4">Complete Your Profile</h3>
                 {detailsMessage && (
                    <p className={`text-center text-xs mb-4 ${detailsMessage.startsWith("Error") ? 'text-red-400' : 'text-green-400'}`}>
                        {detailsMessage}
                    </p>
                 )}

                 <form onSubmit={handleDetailsSubmit} className="space-y-4">
                     <input 
                       type="text" 
                       id="name" 
                       name="name" 
                       value={userDetails.name} 
                       onChange={handleDetailsChange} 
                       placeholder="Full Name" 
                       disabled={isDetailsLoading} 
                       className="w-full bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200"
                     />
                     <input 
                       type="number" 
                       id="age" 
                       name="age" 
                       value={userDetails.age} 
                       onChange={handleDetailsChange} 
                       placeholder="Age" 
                       disabled={isDetailsLoading} 
                       className="w-full bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200"
                     />
                     <select 
                       id="gender" 
                       name="gender" 
                       value={userDetails.gender} 
                       onChange={handleDetailsChange} 
                       disabled={isDetailsLoading}
                       className="w-full bg-gray-700/50 border border-gray-600 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200"
                     >
                         <option value="">Select Gender</option>
                         <option value="male">Male</option>
                         <option value="female">Female</option>
                         <option value="other">Other</option>
                         <option value="prefer_not_to_say">Prefer not to say</option>
                     </select>
                    <button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-medium py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none" 
                      disabled={isDetailsLoading}
                    >
                        {isDetailsLoading && <LoadingSpinner />} Save & Continue
                    </button>
                 </form>
               </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-xs">
            Secure • Private • Decentralized
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;