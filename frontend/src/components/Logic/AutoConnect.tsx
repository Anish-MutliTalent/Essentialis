// src/components/AutoConnect.tsx
import { useEffect } from "react";
import { useConnect } from "thirdweb/react";                     // :contentReference[oaicite:5]{index=5}
import { createWallet } from "thirdweb/wallets";                 // :contentReference[oaicite:6]{index=6}
import { client } from "../../lib/thirdweb";

export function AutoConnect() {
  const { connect } = useConnect();

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/auth/status", { credentials: "include" });
      if (!res.ok) return;
      const data = await res.json();
      if (!data.logged_in || !data.wallet_address) return;

      // Only try to connect wallet if the method was MetaMask
      if (data.login_method === "metamask") {
        await connect(async () => {
          const wallet = createWallet("io.metamask");
          await wallet.connect({ client });
          return wallet;
        });
      }

      // For Google/email: the backend session is enough — nothing to reconnect here.
    })();
  }, [connect]);

  return null;
}

