"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { useAccountContext } from "../../../../core/account/provider.js";
import { Blobbie } from "../../ConnectWallet/Blobbie.js";
/**
 * A wrapper for the Blobbie component
 * @param props BlobbieProps
 * @beta
 * @wallet
 */
export function AccountBlobbie(props) {
    const { address } = useAccountContext();
    return _jsx(Blobbie, { ...props, address: address });
}
//# sourceMappingURL=blobbie.js.map