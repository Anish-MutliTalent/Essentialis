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

// Design System Components
import { 
  Button, 
  Input, 
  Card, 
  CardHeader, 
  CardContent,
  Container,
  Section,
  Heading,
  Text,
  LoadingSpinner
} from './UI';

// Custom UI components
import Divider from "./UI/Divider";

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
  console.debug('linkWalletToBackend: backend linked, verifyData=', verifyData);
      } catch (e: any) {
        console.error("Backend linking error:", e);
        setBackendLoginStatus(`Backend linking error: ${e.message}`);
        sessionStorage.removeItem(`backend_linked_${acct.address}`);
      } finally {
        setIsBackendLoading(false);
      }
    }, []);

  
  // --- Effect to Link Wallet & Fetch Details ---
  useEffect(() => {
    const processConnection = async (currentAccount: { address: string }, currentActiveWallet: any) => {
        console.log("processConnection called with account:", currentAccount, "wallet:", currentActiveWallet);
      const alreadyProcessed = sessionStorage.getItem(`backend_linked_${currentAccount.address}`);
      if (!alreadyProcessed) {
        await linkWalletToBackend(currentAccount, currentActiveWallet);
        if (sessionStorage.getItem(`backend_linked_${currentAccount.address}`)) {
          // Verify backend session explicitly before fetching details
          try {
            const s = await fetch(`${API_BASE_URL}/auth/status`, { credentials: 'include' });
            if (s.ok) {
              const sd = await s.json();
              console.debug('post-link auth.status', sd);
              if (sd.logged_in && sd.wallet_address?.toLowerCase() === currentAccount.address.toLowerCase()) {
                navigate('/dashboard', { replace: true });
                return;
              }
            }
          } catch (e) {
            console.warn('post-link auth.status check failed', e);
          }
        }
      } else {
        try {
          const res = await fetch(`${API_BASE_URL}/auth/status`, {credentials: 'include'});
          if (res.ok) {
            const data = await res.json();
            if (data.logged_in && data.wallet_address?.toLowerCase() === currentAccount.address.toLowerCase()) {
              setBackendLoginStatus(`Backend session active.`);
              setUiState("idle");
              navigate('/dashboard', { replace: true });
              return;
            } else {
              sessionStorage.removeItem(`backend_linked_${currentAccount.address}`);
              setBackendLoginStatus(`No active backend session.`);
            }
          }
        } catch (e) {
          console.error("Auth status check failed", e);
          setBackendLoginStatus("Could not verify backend session.");
        }
      }
    };

    if (account && activeWallet && !isBackendLoading && !isConnecting) {
      processConnection(account, activeWallet);
    } else if (!account && !isConnecting) {
      setBackendLoginStatus("Awaiting wallet connection...");
    }
  }, [account, activeWallet, isBackendLoading, isConnecting, linkWalletToBackend]);

  // --- User Details Form Submission Handler ---
  
  // Determine if the main login/connection UI should be shown
  const showLoginOptions = !account && uiState !== 'email_otp' && !isConnecting;
  const showOtpInput = !account && uiState === 'email_otp' && !isConnecting;
  const showConnectingLoader = isConnecting || (uiState === 'connecting' && !isBackendLoading);
  const showUserDetailsForm = account;
  const [checkedSession, setCheckedSession] = useState(false);

  useEffect(() => {
  const checkSession = async () => {
    try {
      const params = new URLSearchParams(window.location.search);
      const nextParam = params.get('next');

      const res = await fetch(`${API_BASE_URL}/auth/status`, {
        method: "GET",
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        console.log("Session check:", data, account, { nextParam });

        if (data.logged_in) {
          if (nextParam && nextParam.startsWith('/')) {
            navigate(decodeURIComponent(nextParam), { replace: true });
          } else {
            navigate('/dashboard', { replace: true });
          }
          return;
        } else {
          setUiState("idle");
        }
      }
    } catch (e) {
      console.warn("Session check failed", e);
    } finally {
      setCheckedSession(true);
    }
  };

  checkSession();
}, [account, navigate]);


  if (!checkedSession) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Container>
        <Section padding="xl" className="flex items-center justify-center">
          <Card variant="premium" className="w-full max-w-md">
            <CardHeader className="text-center">
              <Heading level={2} className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                {account ? "PROFILE" : "LOG IN / REGISTER"}
              </Heading>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Error Display Area */}
              {errorMessage && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm animate-fadeIn font-black">
                  {errorMessage}
                </div>
              )}

              {/* --- Login Options --- */}
              {showLoginOptions && (
                <div className="space-y-4 animate-fadeIn">
                  {/* Google */}
                  <Button 
                    onClick={() => handleSocialLogin("google")} 
                    variant="secondary" 
                    size="lg"
                    className="w-full"
                  >
                    <FcGoogle className="w-5 h-5 mr-3" />
                    Continue with Google
                  </Button>

                  {/* MetaMask */}
                  <Button 
                    onClick={handleMetaMaskConnect} 
                    variant="secondary" 
                    size="lg"
                    className="w-full"
                  >
                    <MetaMaskLogo width={20} height={20} followMouse={true} slowDrift={true} className="mr-3" />
                    Connect MetaMask
                  </Button>

                  <Divider>Or use email</Divider>

                  {/* Email */}
                  <Input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="Enter your email" 
                    variant="professional"
                  />
                  
                  <Button 
                    onClick={handleEmailLogin} 
                    disabled={email.trim() === ""} 
                    variant="primary"
                    size="lg"
                    className="w-full"
                  >
                    Proceed with Email
                  </Button>
                </div>
              )}

              {/* --- OTP Input --- */}
              {showOtpInput && (
                <div className="space-y-4 animate-fadeIn">
                  <Text className="text-center text-gray-300">
                    Enter code sent to {email}
                  </Text>
                  
                  <Input 
                    type="text" 
                    inputMode="numeric" 
                    pattern="[0-9]*" 
                    value={otp} 
                    onChange={(e) => setOtp(e.target.value)} 
                    placeholder="OTP Code" 
                    maxLength={6} 
                    variant="professional"
                    className="text-center tracking-widest"
                  />
                  
                  <Button 
                    onClick={handleVerifyEmail} 
                    disabled={!otp || otp.length !== 6} 
                    variant="primary"
                    size="lg"
                    className="w-full"
                  >
                    Verify & Connect
                  </Button>
                  
                  <Button 
                    onClick={() => { setUiState('idle'); setErrorMessage(null); setOtp(''); }} 
                    variant="ghost"
                    className="w-full"
                  >
                    Back
                  </Button>
                </div>
              )}

              {/* --- Generic Loading --- */}
              {showConnectingLoader && (
                <div className='text-center py-6'>
                   <LoadingSpinner />
                   <Text className="mt-3 text-gray-300">Connecting...</Text>
                </div>
              )}

              {/* --- Connected State & Details Form --- */}
              {showUserDetailsForm && (
                <div className="space-y-6 animate-fadeIn">
                   {account && (
                      <div className="space-y-4 animate-fadeIn">
                        {(isBackendLoading || backendLoginStatus) && (
                          <div className="text-center text-sm p-3 rounded-lg bg-yellow-400/20 text-yellow-400">
                            {isBackendLoading ? <LoadingSpinner className="inline mr-2" /> : null}
                            {backendLoginStatus}
                          </div>
                        )}
                      </div>
                    )}
                </div>
              )}
            </CardContent>
          </Card>
        </Section>
      </Container>
    </div>
  );
};

export default LoginPage;