"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { getSocialIcon, useWalletIcon, } from "../../../../core/utils/walletIcon.js";
/**
 * This component tries to resolve the icon of a given wallet, then return an image.
 * @returns an <img /> with the src of the wallet icon
 *
 * @example
 * ### Basic usage
 * ```tsx
 * import { WalletProvider, WalletIcon } from "thirdweb/react";
 *
 * <WalletProvider id="io.metamask">
 *   <WalletIcon />
 * </WalletProvider>
 * ```
 *
 * Result: An <img /> component with the src of the icon
 * ```html
 * <img src="metamask-icon.png" />
 * ```
 *
 * ### Show a loading sign while the icon is being loaded
 * ```tsx
 * <WalletIcon loadingComponent={<Spinner />} />
 * ```
 *
 * ### Fallback to a dummy image if the wallet icon fails to resolve
 * ```tsx
 * <WalletIcon fallbackComponent={<img src="blank-image.png" />} />
 * ```
 *
 * ### Usage with queryOptions
 * WalletIcon uses useQuery() from tanstack query internally.
 * It allows you to pass a custom queryOptions of your choice for more control of the internal fetching logic
 * ```tsx
 * <WalletIcon queryOptions={{ enabled: someLogic, retry: 3, }} />
 * ```
 *
 * @component
 * @wallet
 * @beta
 */
export function WalletIcon({ loadingComponent, fallbackComponent, queryOptions, ...restProps }) {
    const imageQuery = useWalletIcon({ queryOptions });
    if (imageQuery.isLoading) {
        return loadingComponent || null;
    }
    if (!imageQuery.data) {
        return fallbackComponent || null;
    }
    return _jsx("img", { src: imageQuery.data, ...restProps, alt: restProps.alt });
}
/**
 * Social auth provider icon
 * @returns an <img /> component with the src set to the svg
 *
 * @example
 * ```tsx
 * import { SocialIcon } from "thirdweb/react";
 *
 * <SocialIcon provider="google" />
 * ```
 *
 * Result: An <img /> component with the src of the icon
 * ```html
 * <img src="google-icon-svg" />
 * ```
 *
 * @component
 * @wallet
 * @beta
 */
export function SocialIcon({ provider, ...restProps }) {
    const src = getSocialIcon(provider);
    return _jsx("img", { src: src, ...restProps, alt: restProps.alt });
}
//# sourceMappingURL=icon.js.map