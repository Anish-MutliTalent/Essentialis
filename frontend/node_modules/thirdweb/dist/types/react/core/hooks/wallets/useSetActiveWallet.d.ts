/**
 * A hook that lets you set the active wallet.
 * @returns A function that lets you set the active wallet.
 * @example
 * ```jsx
 * import { useSetActiveWallet } from "thirdweb/react";
 *
 * const setActiveWallet = useSetActiveWallet();
 *
 * // later in your code
 * await setActiveWallet(wallet);
 * ```
 * @walletConnection
 */
export declare function useSetActiveWallet(): (activeWallet: import("../../../../exports/wallets.native.js").Wallet) => Promise<void>;
//# sourceMappingURL=useSetActiveWallet.d.ts.map