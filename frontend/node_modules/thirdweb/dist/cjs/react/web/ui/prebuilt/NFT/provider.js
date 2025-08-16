"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NFTProviderContext = void 0;
exports.useNFTContext = useNFTContext;
exports.NFTProvider = NFTProvider;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
/**
 * @internal
 */
exports.NFTProviderContext = (0, react_1.createContext)(undefined);
/**
 * @internal
 */
function useNFTContext() {
    const ctx = (0, react_1.useContext)(exports.NFTProviderContext);
    if (!ctx) {
        throw new Error("NFTProviderContext not found. Make sure you are using NFTMedia, NFTDescription, etc. inside a <NFTProvider /> component");
    }
    return ctx;
}
/**
 * A React context provider component that supplies NFT-related data to its child components.
 *
 * This component serves as a wrapper around the `NFTProviderContext.Provider` and passes
 * the provided NFT data down to all of its child components through the context API.
 *
 *
 * @param {React.PropsWithChildren<NFTProviderProps>} props - The props for the NFT provider
 *
 * @example
 * ```tsx
 * import { getContract } from "thirdweb";
 * import { NFTProvider, NFTMedia, NFTDescription, NFTName } from "thirdweb/react";
 *
 * const contract = getContract({
 *   address: "0x...",
 *   chain: ethereum,
 *   client: yourThirdwebClient,
 * });
 *
 * <NFTProvider contract={contract} tokenId={0n}>
 *    <NFTMedia />
 *    <NFTDescription />
 *    <NFTName />
 * </NFTProvider>
 * ```
 * @component
 * @nft
 * @beta
 */
function NFTProvider(props) {
    return ((0, jsx_runtime_1.jsx)(exports.NFTProviderContext.Provider, { value: props, children: props.children }));
}
//# sourceMappingURL=provider.js.map