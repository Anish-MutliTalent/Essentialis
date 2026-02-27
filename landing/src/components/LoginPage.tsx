// src/components/LoginPage.tsx
import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useActiveAccount, useConnect, useActiveWallet, useDisconnect } from "thirdweb/react";

import {
  inAppWallet,
  createWallet,
  preAuthenticate,
} from "thirdweb/wallets";
import { client } from '../lib/thirdweb';
import { signMessage } from "thirdweb/utils";
import { ethers } from "ethers";
import { FcGoogle } from "react-icons/fc";
import MetaMaskLogo from "./UI/MetaMaskLogo";
import { getContract, prepareContractCall, readContract, sendTransaction } from "thirdweb";
import DocTokenAbi from '../abi/DocToken.json';
import { optimismSepolia } from "thirdweb/chains";
import { getEncryptionPublicKey } from '../lib/crypto'; // Added import

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

async function claimFaucetReward(userAddress: string, activeWallet: any) {
  try {
    const response = await fetch('/api/faucet/get-claim-signature', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ recipient: userAddress }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get claim signature');
    }

    const { amount, deadline, signature, contractAddress } = await response.json();

    console.log("✅ Got signature, submitting claim...");

    if (!contractAddress) {
      console.warn('No contractAddress returned from faucet endpoint, skipping claim');
      return null;
    }

    const contract = await getContract({
      client,
      chain: optimismSepolia, // Match your chain
      address: contractAddress,
      // Cast to `any` to satisfy thirdweb/viem ABI typing for imported JSON
      abi: DocTokenAbi as any,
    });

    let nonce;
    try {
      // Use the simple method name — thirdweb/viem will handle the ABI behind the scenes
      nonce = await readContract({
        contract,
        method: "function nonces(address user) external view returns (uint256)",
        params: [userAddress],
      });
    } catch (err: any) {
      // Handle viem's common "decode zero data" error when the contract address
      // is empty / wrong chain / missing code. In that case, skip claiming
      // rather than throwing an unhandled error.
      const msg = String(err?.message || err);
      if (msg.includes('Cannot decode zero data') || msg.includes('AbiDecodingZeroDataError')) {
        console.warn('Faucet contract call returned zero data (no code / wrong address or chain). Skipping claim.', err);
        return null;
      }
      throw err;
    }

    if (nonce?.toString() === "0") {
      console.log("🎁 Claiming faucet reward for:", userAddress);

      // Attempt to get encryption key for on-chain registration
      let pubKey = "";
      try {
        console.debug("Requesting encryption public key for registration...");
        pubKey = await getEncryptionPublicKey(activeWallet, userAddress);
        console.debug("Got encryption key:", pubKey);
      } catch (keyErr) {
        console.warn("Could not retrieve encryption key. Proceeding with claim only.", keyErr);
      }

      const account = activeWallet.getAccount();

      // Normalize amount into a BigNumber in wei to match contract's `payoutAmount`
      let amountParam: any = amount;
      try {
        if (typeof amount === 'string') {
          // If it's a decimal string like "0.0005", parse as ether string.
          if (amount.includes('.')) {
            amountParam = ethers.utils.parseEther(amount);
          } else if (/^0x[0-9a-fA-F]+$/.test(amount)) {
            // already hex-encoded wei
            amountParam = ethers.BigNumber.from(amount);
          } else {
            // integer string in wei
            amountParam = ethers.BigNumber.from(amount);
          }
        } else if (typeof amount === 'number') {
          // numeric value, assume ether amount (rare) — convert to string first
          amountParam = ethers.utils.parseEther(amount.toString());
        } else {
          // leave as-is (maybe already a BigNumber)
          amountParam = amount;
        }
      } catch (e) {
        console.warn('Failed to parse amount from faucet response, using raw value', amount, e);
        amountParam = amount;
      }

      console.debug('claimFaucetReward: amount (raw) =', amount, 'amountParam =', amountParam?.toString?.() ?? amountParam);

      const transaction = await prepareContractCall({
        contract,
        method: "function claim(address recipient, uint256 amount, uint256 deadline, bytes signature, string pubEncryptionKey)",
        params: [userAddress, amountParam, deadline, signature, pubKey],
      });

      const result = await sendTransaction({
        transaction,
        account,
      });

      console.log("✅ Claim successful! Tx hash:", result.transactionHash);
      return result;
    } else {
      return null; // Already claimed
    }

  } catch (error: any) {
    console.error("❌ Faucet claim failed:", error);
    throw error;
  }
}

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const emailFromGate = location.state?.email;

  const account = useActiveAccount();
  const { connect, isConnecting, error: connectionError } = useConnect();
  const activeWallet = useActiveWallet();

  // --- State Management ---
  const [uiState, setUiState] = useState<'idle' | 'email_otp' | 'connecting' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Disconnect handler
  const { disconnect } = useDisconnect();

  // Input states
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');

  // Backend interaction states
  const [backendLoginStatus, setBackendLoginStatus] = useState("Awaiting wallet connection...");
  const [isBackendLoading, setIsBackendLoading] = useState(false);

  // --- Wallet Definitions for Connection ---
  const walletsToUse = {
    inApp: inAppWallet(
      {
        executionMode: {
          mode: "EIP7702",
          sponsorGas: true,
        },
        auth: { options: ["email", "google"] }
      }),
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

  // --- COOP/COEP Context Switch ---
  // If we arrived here from a cross-origin-isolated page (My Docs), the strict
  // headers are still active, which blocks OAuth popups. Force a hard reload
  // so the server can send this page WITHOUT those headers.
  useEffect(() => {
    // Also clean up any stale coi-serviceworker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          console.log("🧹 LoginPage: Unregistering Service Worker:", registration);
          registration.unregister();
        }
      });
    }

    if (window.crossOriginIsolated) {
      const alreadyTried = sessionStorage.getItem('login_coi_reload');
      if (!alreadyTried) {
        sessionStorage.setItem('login_coi_reload', '1');
        console.log("LoginPage: Hard-reloading to DISABLE strict COOP/COEP for OAuth...");
        window.location.reload();
      } else {
        console.warn("LoginPage: Still cross-origin isolated after reload.");
        sessionStorage.removeItem('login_coi_reload');
      }
    } else {
      sessionStorage.removeItem('login_coi_reload');
    }
  }, []);

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
        await wallet.connect({ client, strategy: "email", email, verificationCode: otp, chain: optimismSepolia });
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
        await wallet.connect({ client, strategy: strategy, chain: optimismSepolia });
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
        await wallet.connect({ client, chain: optimismSepolia });
        return wallet;
      });
    } catch (err: any) {
      console.error("MetaMask connect failed:", err);
      setErrorMessage(`MetaMask connect failed: ${err.message || err}`);
      setUiState('error');
    }
  }, [connect, walletsToUse.metamask]);

  const linkWalletToBackend = useCallback(async (acct: { address: string }, wallet: any) => {
    if (!acct?.address) return;
    setIsBackendLoading(true);
    setBackendLoginStatus(`Linking wallet ${acct.address.substring(0, 6)}...`);

    try {
      const challengeRes = await fetch(`${API_BASE_URL}/auth/login/metamask/challenge`, {
        credentials: "include",
      });
      if (!challengeRes.ok) throw new Error(`Challenge fetch failed: ${challengeRes.status}`);
      const { message_to_sign } = await challengeRes.json();

      let signature;

      // ✅ FIX: Handle different wallet types explicitly
      // if (wallet.id === "io.metamask" || wallet.id === "walletConnect") {
      //   // For external wallets (MetaMask, WalletConnect), use EIP-1193 personal_sign
      //   const provider = wallet.getProvider();
      //   if (!provider) throw new Error("No provider available");

      //   signature = await provider.request({
      //     method: "personal_sign",
      //     params: [
      //       // Convert message to hex
      //       `0x${Buffer.from(message_to_sign, 'utf8').toString('hex')}`,
      //       acct.address
      //     ]
      //   });
      // } else 
      if (wallet.id === "inApp") {
        // For in-app wallets, get the personal wallet (EOA)
        const personalWallet = wallet.getPersonalWallet?.();
        const signerAccount = personalWallet
          ? personalWallet.getAccount()
          : wallet.getAccount();

        if (!signerAccount) throw new Error("No signer account");

        signature = await signMessage({
          account: signerAccount,
          message: message_to_sign,
        });
      } else {
        const accountObj = wallet.getAccount();
        if (!accountObj) throw new Error("Wallet has no Account");

        signature = await signMessage({
          account: accountObj,
          message: message_to_sign,
        });
      }

      const verifyRes = await fetch(`${API_BASE_URL}/auth/login/metamask/verify`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress: acct.address,
          signature,
          originalMessage: message_to_sign,
          email: emailFromGate,
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

  // --- Helper to handle redirect or manual continuation ---
  const handleAuthSuccess = useCallback(() => {
    console.log("handleAuthSuccess: navigating to dashboard (client-side)");
    // Use client-side navigation to preserve wallet state.
    // COOP/COEP headers are only needed for /my-docs (PPT viewer), not /dashboard.
    navigate('/dashboard', { replace: true });
  }, [navigate]);

  // --- Effect to Link Wallet & Fetch Details ---
  useEffect(() => {
    const processConnection = async (currentAccount: { address: string }, currentActiveWallet: any) => {
      console.log("processConnection called with account:", currentAccount);

      const alreadyProcessed = sessionStorage.getItem(`backend_linked_${currentAccount.address}`);

      if (!alreadyProcessed) {
        // Link wallet to backend
        await linkWalletToBackend(currentAccount, currentActiveWallet);

        if (sessionStorage.getItem(`backend_linked_${currentAccount.address}`)) {
          // Verify backend session
          try {
            const s = await fetch(`${API_BASE_URL}/auth/status`, { credentials: 'include' });
            if (s.ok) {
              const sd = await s.json();
              if (sd.logged_in && sd.wallet_address?.toLowerCase() === currentAccount.address.toLowerCase()) {

                // ✅ NEW: Auto-claim faucet reward
                try {
                  setBackendLoginStatus("...");
                  const rewardResult = await claimFaucetReward(currentAccount.address, currentActiveWallet);
                  if (rewardResult) {
                    setBackendLoginStatus("Welcome reward claimed! 🎉");
                  }
                } catch (claimError: any) {
                  console.warn("Faucet claim failed:", claimError);
                  // Don't block login if claim fails
                  setBackendLoginStatus(`Login successful (claim failed: ${claimError.message})`);
                }

                handleAuthSuccess();
                return;
              }
            }
          } catch (e) {
            console.warn('post-link auth.status check failed', e);
          }
        }
      } else {
        // User already processed, check backend session
        try {
          const res = await fetch(`${API_BASE_URL}/auth/status`, { credentials: 'include' });
          if (res.ok) {
            const data = await res.json();
            if (data.logged_in && data.wallet_address?.toLowerCase() === currentAccount.address.toLowerCase()) {
              setBackendLoginStatus(`Backend session active.`);
              handleAuthSuccess();
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
  }, [account, activeWallet, isBackendLoading, isConnecting, linkWalletToBackend, handleAuthSuccess]);

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
              if (account) {
                navigate(decodeURIComponent(nextParam), { replace: true });
              } else {
                console.log("Session valid, waiting for wallet to connect before redirecting to nextParam.");
              }
            } else {
              if (account) {
                handleAuthSuccess();
              } else {
                console.log("Session valid, waiting for wallet to connect before redirecting.");
                setBackendLoginStatus("Welcome back! Please establish wallet connection.");
              }
            }
            // Do not return here if we didn't redirect; let the rest of the component render
            if (account) return;
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
  }, [account, navigate, handleAuthSuccess]);


  if (!checkedSession) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Disconnect handler
  const handleDisconnect = () => {
    if (activeWallet) {
      disconnect(activeWallet);
    }
    sessionStorage.removeItem(`backend_linked_${account?.address}`);
  };

  return (
    <div className="min-h-screen bg-black">
      <Container>
        <Section padding="lg" className="flex items-center justify-center">
          <Card variant="premium" className="w-full max-w-md mx-4">
            <CardHeader className="text-center">
              <Heading level={2} className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                {account ? "WELCOME BACK" : "LOG IN / REGISTER"}
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

                      <div className="text-center">
                        <LoadingSpinner />
                        <Text className="mt-2 text-gray-400">Redirecting to Dashboard...</Text>
                      </div>
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