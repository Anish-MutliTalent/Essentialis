"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext } from "react";
const TokenProviderContext = /* @__PURE__ */ createContext(undefined);
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
export function TokenProvider(props) {
    return (_jsx(TokenProviderContext.Provider, { value: props, children: props.children }));
}
/**
 * @internal
 */
export function useTokenContext() {
    const ctx = useContext(TokenProviderContext);
    if (!ctx) {
        throw new Error("TokenProviderContext not found. Make sure you are using TokenName, TokenIcon, TokenSymbol etc. inside a <TokenProvider /> component");
    }
    return ctx;
}
//# sourceMappingURL=provider.js.map