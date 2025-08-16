"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountAddress = AccountAddress;
const jsx_runtime_1 = require("react/jsx-runtime");
const provider_js_1 = require("../../../../core/account/provider.js");
/**
 *
 * @returns a <span> containing the full wallet address of the account
 *
 * @example
 * ### Basic usage
 * ```tsx
 * import { AccountProvider, AccountAddress } from "thirdweb/react";
 *
 * <AccountProvider address="0x12345674b599ce99958242b3D3741e7b01841DF3" client={TW_CLIENT}>
 *   <AccountAddress />
 * </AccountProvider>
 * ```
 * Result:
 * ```html
 * <span>0x12345674b599ce99958242b3D3741e7b01841DF3</span>
 * ```
 *
 *
 * ### Shorten the address
 * ```tsx
 * import { AccountProvider, AccountAddress } from "thirdweb/react";
 * import { shortenAddress } from "thirdweb/utils";
 *
 * <AccountProvider address="0x12345674b599ce99958242b3D3741e7b01841DF3" client={TW_CLIENT}>
 *   <AccountAddress formatFn={shortenAddress} />
 * </AccountProvider>
 * ```
 * Result:
 * ```html
 * <span>0x1234...1DF3</span>
 * ```
 *
 * @component
 * @wallet
 * @beta
 */
function AccountAddress({ formatFn, ...restProps }) {
    const { address } = (0, provider_js_1.useAccountContext)();
    const value = formatFn ? formatFn(address) : address;
    return (0, jsx_runtime_1.jsx)("span", { ...restProps, children: value });
}
//# sourceMappingURL=address.js.map