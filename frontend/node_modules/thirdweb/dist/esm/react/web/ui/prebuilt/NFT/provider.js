"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext } from "react";
/**
 * @internal
 */
export const NFTProviderContext = /* @__PURE__ */ createContext(undefined);
/**
 * @internal
 */
export function useNFTContext() {
    const ctx = useContext(NFTProviderContext);
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
export function NFTProvider(props) {
    return (_jsx(NFTProviderContext.Provider, { value: props, children: props.children }));
}
//# sourceMappingURL=provider.js.map