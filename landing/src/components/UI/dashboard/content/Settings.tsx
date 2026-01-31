import React from 'react';
import { useActiveAccount, useActiveWallet } from 'thirdweb/react';
import { getContract, prepareContractCall, readContract, sendTransaction, waitForReceipt } from "thirdweb";
import { optimismSepolia } from "thirdweb/chains";
import { client } from '../../../../lib/thirdweb';
import { getEncryptionPublicKey } from '../../../../lib/crypto';
import DocTokenAbi from '../../../../abi/DocToken.json';
import { Button, Card, CardHeader, CardContent, Heading, Text } from '../../index';

const Settings: React.FC = () => {
  const account = useActiveAccount();
  const activeWallet = useActiveWallet();
  const [keyStatus, setKeyStatus] = React.useState<{ registered: boolean; key: string }>({ registered: false, key: '' });
  const [loading, setLoading] = React.useState(false);
  const [statusMsg, setStatusMsg] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (account) checkKeyStatus();
  }, [account]);

  const checkKeyStatus = async () => {
    if (!account) return;
    try {
      // Fetch faucet contract address dynamically or use hardcoded if same
      const res = await fetch('/api/faucet/address');
      const { address } = await res.json();

      const contract = getContract({
        client,
        chain: optimismSepolia,
        address: address,
        abi: DocTokenAbi as any,
      });

      const key = await readContract({
        contract,
        method: "function encryptionKeys(address) view returns (string)",
        params: [account.address],
      }) as string;

      const isRegistered = !!(key && key.length > 10); // "OFF" or empty is not registered
      setKeyStatus({ registered: isRegistered, key });
    } catch (e) {
      console.error("Failed to check key status", e);
    }
  };

  const handleRegister = async () => {
    if (!account || !activeWallet) return;
    setLoading(true);
    setStatusMsg("Generating Encryption Key...");
    try {
      // 1. Get Key
      const pubKey = await getEncryptionPublicKey(activeWallet, account.address);
      if (!pubKey) throw new Error("Failed to generate key");

      // 2. Register on-chain
      setStatusMsg("Confirming Registration...");
      const res = await fetch('/api/faucet/address');
      const { address } = await res.json();

      const contract = getContract({
        client,
        chain: optimismSepolia,
        address: address,
        abi: DocTokenAbi as any,
      });

      const tx = prepareContractCall({
        contract,
        method: "function registerEncryptionKey(string pubKey)",
        params: [pubKey],
      });

      const { transactionHash } = await sendTransaction({ transaction: tx, account });
      setStatusMsg(`Tx Sent: ${transactionHash.slice(0, 10)}... Waiting for confirmation...`);

      await waitForReceipt({ client, chain: optimismSepolia, transactionHash });

      setStatusMsg("Confirmed! Updating UI...");
      setKeyStatus({ registered: true, key: pubKey });
      await checkKeyStatus();
    } catch (e: any) {
      console.error(e);
      setStatusMsg(`Error: ${e.message || String(e)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDisable = async () => {
    if (!account || !activeWallet) return;
    if (!confirm("Are you sure? This will prevent others from sharing generic files with you securely until you re-enable it.")) return;

    setLoading(true);
    setStatusMsg("Disabling Secure Share...");
    try {
      const res = await fetch('/api/faucet/address');
      const { address } = await res.json();

      const contract = getContract({
        client,
        chain: optimismSepolia,
        address: address,
        abi: DocTokenAbi as any,
      });

      // Register "OFF" as the key to effectively disable it
      const tx = prepareContractCall({
        contract,
        method: "function registerEncryptionKey(string pubKey)",
        params: ["OFF"],
      });

      const { transactionHash } = await sendTransaction({ transaction: tx, account });
      setStatusMsg(`Tx Sent: ${transactionHash.slice(0, 10)}... Waiting for confirmation...`);

      await waitForReceipt({ client, chain: optimismSepolia, transactionHash });

      setStatusMsg("Confirmed! Secure Share Disabled.");
      setKeyStatus({ registered: false, key: "OFF" });
      await checkKeyStatus();
    } catch (e: any) {
      console.error(e);
      setStatusMsg(`Error: ${e.message || String(e)}`);
    } finally {
      setLoading(false);
    }
  };

  const clearLocal = () => {
    if (!confirm('Clear local application data? Have you tried disconnecting and reconnecting your wallet?')) return;
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {
      // ignore
    }
    window.location.reload();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card variant="professional">
        <CardHeader>
          <Heading level={2}>Settings</Heading>
        </CardHeader>
        <CardContent className="space-y-6">

          {/* Secure Share Section */}
          <div className="border-b border-gray-700 pb-6">
            <Heading level={3} className="text-yellow-400 mb-2">Secure Sharing</Heading>
            <Text color="muted" className="mb-4">
              Manage your encryption keys for receiving secure files.
              {keyStatus.registered
                ? <span className="text-green-400 font-bold ml-2">● Active</span>
                : <span className="text-gray-500 font-bold ml-2">● Inactive</span>}
            </Text>

            {statusMsg && (
              <div className="mb-4 p-2 bg-gray-800 rounded border border-gray-700 text-sm font-mono text-yellow-200">
                {statusMsg}
              </div>
            )}

            <div className="flex gap-4">
              {!keyStatus.registered ? (
                <Button
                  variant="primary"
                  onClick={handleRegister}
                  loading={loading}
                  disabled={!account}
                >
                  Enable Secure Sharing
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  className="text-red-400 hover:text-red-300 border-red-900/50 hover:bg-red-900/20"
                  onClick={handleDisable}
                  loading={loading}
                  disabled={!account}
                >
                  Disable & Clear Key
                </Button>
              )}
              {keyStatus.registered && (
                <Button variant="secondary" onClick={handleRegister} loading={loading}>
                  Re-Register
                </Button>
              )}
            </div>
            {keyStatus.registered && (
              <Text variant="small" color="muted" className="mt-2 text-xs break-all">
                Current Key: {keyStatus.key.slice(0, 20)}...
              </Text>
            )}
          </div>

          <div className="border border-red-900/30 bg-red-900/10 p-6 rounded-xl">
            <Heading level={4} className="mb-2 text-red-500 flex items-center gap-2">
              Data Management
            </Heading>
            <Text className="mb-4 text-red-200/60 text-sm">
              This is a destructive action. Only use this if the "Disconnect Wallet" function is not working.
              This will wipe your local session data and force a reload.
            </Text>
            <Button
              variant="ghost"
              className="text-red-400 hover:text-red-300 border-red-900/50 hover:bg-red-900/20"
              size="sm"
              onClick={clearLocal}
            >
              Clear Local Data
            </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
