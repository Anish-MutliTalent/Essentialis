"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChainProvider = ChainProvider;
exports.useChainContext = useChainContext;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const ChainProviderContext = /* @__PURE__ */ (0, react_1.createContext)(undefined);
/**
 * A React context provider component that supplies Chain-related data to its child components.
 *
 * This component serves as a wrapper around the `ChainProviderContext.Provider` and passes
 * the provided chain data down to all of its child components through the context API.
 *
 * @example
 * ### Basic usage
 * ```tsx
 * import { ChainProvider, ChainIcon, ChainName } from "thirdweb/react";
 * import { ethereum } from "thirdweb/chains";
 *
 * <ChainProvider chain={ethereum}>
 *   <ChainIcon />
 *   <ChainName />
 * </ChainProvider>
 * ```
 *
 * ### Usage with defineChain
 * ```tsx
 * import { defineChain } from "thirdweb/chains"l
 * import { ChainProvider, ChainName } from "thirdweb/react";
 *
 * const chainId = someNumber;
 *
 * <ChainProvider chain={defineChain(chainId)}>
 *   <ChainName />
 * </ChainProvider>
 * ```
 * @component
 * @chain
 * @beta
 */
function ChainProvider(props) {
    return ((0, jsx_runtime_1.jsx)(ChainProviderContext.Provider, { value: props, children: props.children }));
}
/**
 * @internal
 */
function useChainContext() {
    const ctx = (0, react_1.useContext)(ChainProviderContext);
    if (!ctx) {
        throw new Error("ChainProviderContext not found. Make sure you are using ChainName, ChainIcon, etc. inside a <ChainProvider /> component");
    }
    return ctx;
}
//# sourceMappingURL=provider.js.map