"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountBlobbie = AccountBlobbie;
const jsx_runtime_1 = require("react/jsx-runtime");
const provider_js_1 = require("../../../../core/account/provider.js");
const Blobbie_js_1 = require("../../ConnectWallet/Blobbie.js");
/**
 * A wrapper for the Blobbie component
 * @param props BlobbieProps
 * @beta
 * @wallet
 */
function AccountBlobbie(props) {
    const { address } = (0, provider_js_1.useAccountContext)();
    return (0, jsx_runtime_1.jsx)(Blobbie_js_1.Blobbie, { ...props, address: address });
}
//# sourceMappingURL=blobbie.js.map