"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletProviderContext = void 0;
exports.WalletProvider = WalletProvider;
exports.useWalletContext = useWalletContext;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
/**
 * @internal Exported for tests only
 */
exports.WalletProviderContext = (0, react_1.createContext)(undefined);
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
function WalletProvider(props) {
    return ((0, jsx_runtime_1.jsx)(exports.WalletProviderContext.Provider, { value: props, children: props.children }));
}
/**
 * @internal
 */
function useWalletContext() {
    const ctx = (0, react_1.useContext)(exports.WalletProviderContext);
    if (!ctx) {
        throw new Error("WalletProviderContext not found. Make sure you are using WalletIcon, WalletName, etc. inside a <WalletProvider /> component");
    }
    return ctx;
}
//# sourceMappingURL=provider.js.map