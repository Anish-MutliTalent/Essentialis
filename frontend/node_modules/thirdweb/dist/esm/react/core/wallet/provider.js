"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext } from "react";
/**
 * @internal Exported for tests only
 */
export const WalletProviderContext = /* @__PURE__ */ createContext(undefined);
/**
 * A React context provider component that supplies Wallet-related data to its child components.
 *
 * This component serves as a wrapper around the `WalletProviderContext.Provider` and passes
 * the provided wallet data down to all of its child components through the context API.
 *
 * @example
 * ### Basic usage
 * ```tsx
 * import { WalletProvider, WalletIcon, WalletName } from "thirdweb/react";
 *
 * <WalletProvider id="io.metamask">
 *   <WalletIcon />
 *   <WalletName />
 * </WalletProvider>
 * ```
 * @beta
 * @component
 * @wallet
 */
export function WalletProvider(props) {
    return (_jsx(WalletProviderContext.Provider, { value: props, children: props.children }));
}
/**
 * @internal
 */
export function useWalletContext() {
    const ctx = useContext(WalletProviderContext);
    if (!ctx) {
        throw new Error("WalletProviderContext not found. Make sure you are using WalletIcon, WalletName, etc. inside a <WalletProvider /> component");
    }
    return ctx;
}
//# sourceMappingURL=provider.js.map