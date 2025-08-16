"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { Text } from "react-native";
import { useAccountContext } from "../../../../core/account/provider.js";
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
export function AccountAddress({ formatFn, ...restProps }) {
    const { address } = useAccountContext();
    const value = formatFn ? formatFn(address) : address;
    return _jsx(Text, { ...restProps, children: value });
}
//# sourceMappingURL=address.js.map