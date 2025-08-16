"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenProvider = TokenProvider;
exports.useTokenContext = useTokenContext;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const TokenProviderContext = /* @__PURE__ */ (0, react_1.createContext)(undefined);
/**
 * A React context provider component that supplies Token-related data to its child components.
 *
 * This component serves as a wrapper around the `TokenProviderContext.Provider` and passes
 * the provided token data down to all of its child components through the context API.
 *
 * @example
 * ### Basic usage
 * ```tsx
 * import { TokenProvider, TokenIcon, TokenName  } from "thirdweb/react";
 * import { ethereum } from "thirdweb/chains";
 *
 * <TokenProvider address="0x..." client={...} chain={ethereum}>
 *   <TokenIcon />
 *   <TokenName />
 * </TokenProvider>
 * ```
 *
 * ### This component also works with native token!
 * ```tsx
 * import { NATIVE_TOKEN_ADDRESS} from "thirdweb";
 * import { ethereum } from "thirdweb/chains";
 *
 * <TokenProvider address={NATIVE_TOKEN_ADDRESS} chain={ethereum} client={client}>
 *   <TokenSymbol /> // "ETH"
 * </TokenProvider>
 * ```
 *
 * @component
 * @token
 * @beta
 */
function TokenProvider(props) {
    return ((0, jsx_runtime_1.jsx)(TokenProviderContext.Provider, { value: props, children: props.children }));
}
/**
 * @internal
 */
function useTokenContext() {
    const ctx = (0, react_1.useContext)(TokenProviderContext);
    if (!ctx) {
        throw new Error("TokenProviderContext not found. Make sure you are using TokenName, TokenIcon, TokenSymbol etc. inside a <TokenProvider /> component");
    }
    return ctx;
}
//# sourceMappingURL=provider.js.map