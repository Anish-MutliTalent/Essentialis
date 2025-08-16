"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletIcon = WalletIcon;
exports.SocialIcon = SocialIcon;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_native_1 = require("react-native");
const react_native_svg_1 = require("react-native-svg");
const walletIcon_js_1 = require("../../../../core/utils/walletIcon.js");
const WalletImage_js_1 = require("../../components/WalletImage.js");
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
function WalletIcon({ loadingComponent, fallbackComponent, queryOptions, ...restProps }) {
    const imageQuery = (0, walletIcon_js_1.useWalletIcon)({ queryOptions });
    if (imageQuery.isLoading) {
        return loadingComponent || null;
    }
    if (!imageQuery.data) {
        return fallbackComponent || null;
    }
    return (0, jsx_runtime_1.jsx)(react_native_1.Image, { source: { uri: imageQuery.data }, ...restProps });
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
function SocialIcon({ provider, ...restProps }) {
    const src = (0, WalletImage_js_1.getAuthProviderImage)(provider);
    return (0, jsx_runtime_1.jsx)(react_native_svg_1.SvgXml, { xml: src, ...restProps });
}
//# sourceMappingURL=icon.js.map